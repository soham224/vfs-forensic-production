import logging
import uuid
import crud
import models
import schemas
import os
from collections import OrderedDict
from datetime import datetime, timedelta, timezone
from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload
from api import deps
from glob import glob
from models import Videos
from core.config import settings
from models import CameraRTSP, Case, Location, User
from fastapi.responses import StreamingResponse
from io import BytesIO
import requests
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Image as RLImage,
    Table,
    TableStyle,
    KeepTogether,
    ListFlowable,
    ListItem,
    Indenter,
    KeepInFrame,
    PageBreak,
)
from reportlab.lib.utils import ImageReader
from PIL import Image as PILImage
from reportlab.pdfbase.pdfmetrics import stringWidth

from schemas.case import (
    CameraDetailsResponse,
    CaseRequestSchema,
    CaseStatusCountRequest,
    GraphCaseRequestSchema,
    PaginatedResultsSchema,
    PaginationMeta,
    UpdateCaseReportRequest,
    UpdateCaseReportResponse,
    UpdateCaseStatusRequest,
    UpdateCaseStatusResponse,
    CaseResponse,
    CaseSuspectRequest,
)

ALLOWED_STATUSES = ["OPEN", "CLOSED"]
ALLOWED_REPORTS = ["OPEN", "PROCESSING", "ON HOLD", "COMPLETED"]
BOX_BORDER_COLOR = colors.HexColor("#AAAAAA")
router = APIRouter()


def _get_owned_case_or_404(
    db: Session, case_id: int, current_user: models.User
) -> Case:
    """
    Retrieve a case that belongs to the current active user or raise a 404 to
    avoid leaking the existence of other users' cases.
    """
    case = (
        db.query(Case)
        .filter(
            Case.id == case_id,
            Case.user_id == current_user.id,
            Case.deleted == False,
        )
        .first()
    )
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case


@router.post("/add_case", response_model=schemas.CaseRead)
def add_case(
    case_details: schemas.CaseCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Adds a new case and associates cameras with it if provided.
    """
    # Check if case_id is unique
    db_case = (
        db.query(models.Case)
        .filter(models.Case.case_id == case_details.case_id)
        .first()
    )
    if db_case:
        raise HTTPException(status_code=400, detail="Case ID already exists.")

    # Check if case_name already exists (duplicate validation)
    existing_case_by_name = crud.case_crud_obj.get_by_name(
        db, name=case_details.case_name, user_id=current_user.id
    )
    if existing_case_by_name:
        logging.warning(f"Case name '{case_details.case_name}' already exists.")
        raise HTTPException(status_code=400, detail="Case name already exists")

    # Validate mutual exclusivity of camera_ids and video_ids
    has_cameras = bool(case_details.camera_ids)
    has_videos = bool(getattr(case_details, "video_ids", []))
    if has_cameras and has_videos:
        raise HTTPException(
            status_code=400,
            detail="Provide either camera_ids or video_ids, not both.",
        )

    cameras = []
    videos = []
    if has_cameras:
        cameras = (
            db.query(models.CameraRTSP)
            .filter(models.CameraRTSP.id.in_(case_details.camera_ids))
            .all()
        )
        if len(cameras) != len(case_details.camera_ids):
            raise HTTPException(status_code=400, detail="Some camera IDs are invalid.")
    elif has_videos:
        videos = (
            db.query(models.Videos)
            .filter(models.Videos.id.in_(case_details.video_ids))
            .all()
        )
        if len(videos) != len(case_details.video_ids):
            raise HTTPException(status_code=400, detail="Some video IDs are invalid.")
    # Create the new case
    new_case = models.Case(
        case_id=f"{uuid.uuid4()}",
        case_name=case_details.case_name,
        user_id=current_user.id,
        case_description=case_details.case_description,
        case_status="OPEN",
        case_report="OPEN",
        created_date=(
            datetime.now(timezone.utc)
            .replace(microsecond=0)
            .strftime("%Y-%m-%d %H:%M:%S")
        ),
        updated_date=(
            datetime.now(timezone.utc)
            .replace(microsecond=0)
            .strftime("%Y-%m-%d %H:%M:%S")
        ),
        status=True,
        deleted=False,
        cameras_rtsp=cameras,
    )
    # Attach videos if provided
    if has_videos:
        new_case.videos = videos

    db.add(new_case)
    db.commit()
    db.refresh(new_case)
    return new_case


@router.post("/case_duplicate_check")
def case_duplicate_check(
    case_name: str = Body(..., embed=True, description="Case name to check"),
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Check whether a case name already exists for the current active user scope.

    Names are compared in a normalized way (trimmed + lowercased) so inputs like
    "Demo", " demo ", and "DEMO" are treated as the same.
    """
    normalized_name = (case_name or "").strip().lower()
    if not normalized_name:
        raise HTTPException(status_code=400, detail="Case name is required")

    exists = crud.case_crud_obj.exists_by_normalized_name(
        db, normalized_name=normalized_name, user_id=current_user.id
    )
    if exists:
        return {
            "is_unique": False,
            "message": "The case with same name already exists",
        }
    return {
        "is_unique": True,
        "message": "No duplicate case found",
    }


@router.post("/update_case", response_model=schemas.CaseRead)
def update_case(
    case_details: schemas.CaseUpdate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    case_details.updated_date = (
        datetime.now(timezone.utc).replace(microsecond=0).strftime("%Y-%m-%d %H:%M:%S")
    )

    # Fetch the case object for the current user
    db_obj = _get_owned_case_or_404(
        db=db, case_id=case_details.id, current_user=current_user
    )

    # Check if the new case name is unique (only if case_name is being changed)
    # Compare with current case name to avoid unnecessary duplicate check
    if db_obj.case_name != case_details.case_name:
        existing_case_by_name = crud.case_crud_obj.get_by_name(
            db,
            name=case_details.case_name,
            user_id=current_user.id,
            exclude_id=case_details.id,
        )
        if existing_case_by_name:
            logging.warning(f"Case name '{case_details.case_name}' already exists.")
            raise HTTPException(status_code=400, detail="Case name already exists")

    # Update the case details
    updated_case = crud.case_crud_obj.update(
        db=db, db_obj=db_obj, obj_in=case_details.dict(exclude_unset=True)
    )

    # Update camera associations if camera_ids are provided
    if "camera_ids" in case_details.dict(exclude_unset=True):
        camera_ids = case_details.camera_ids
        cameras = db.query(models.Camera).filter(models.Camera.id.in_(camera_ids)).all()
        if len(cameras) != len(camera_ids):
            logging.warning("Some camera IDs are invalid.")
            raise HTTPException(status_code=400, detail="Some camera IDs are invalid.")
        updated_case.cameras = cameras

    db.commit()
    db.refresh(updated_case)
    return updated_case


@router.get("/get_case_by_id", response_model=schemas.CaseRead)
def get_case_by_id(
    case_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    db_obj = _get_owned_case_or_404(db=db, case_id=case_id, current_user=current_user)

    # Compute timestamps in IST without mutating the ORM object
    created_ist = (
        db_obj.created_date + timedelta(hours=5, minutes=30)
        if db_obj.created_date
        else None
    )
    updated_ist = (
        db_obj.updated_date + timedelta(hours=5, minutes=30)
        if db_obj.updated_date
        else None
    )

    # Derive video file names, if any videos are associated with the case
    video_names = []
    try:
        if hasattr(db_obj, "videos") and db_obj.videos:
            for v in db_obj.videos:
                if getattr(v, "des_video_path", None):
                    video_names.append(v.des_video_path.split("/")[-1])
    except Exception as e:
        logging.exception("Failed extracting video names for case_id=%s", case_id)

    # Build response model, leveraging orm_mode for nested relations
    case_read = schemas.CaseRead.from_orm(db_obj)
    case_read.created_date = created_ist
    case_read.updated_date = updated_ist
    case_read.video_names = video_names or None
    return case_read


@router.post("/get_cases_by_ids", response_model=List[schemas.CaseRead])
def get_cases_by_ids(
    case_ids: List[int],
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    db_obj = (
        db.query(Case)
        .filter(
            Case.id.in_(case_ids),
            Case.user_id == current_user.id,
            Case.deleted == False,
        )
        .all()
    )
    if not db_obj:
        logging.warning("Data Not Found")
        raise HTTPException(status_code=404, detail="No Data Found")
    return db_obj


@router.get("/get_all_cases", response_model=List[schemas.CaseRead])
def get_all_case(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    db_obj = (
        db.query(Case)
        .filter(Case.deleted == False, Case.user_id == current_user.id)
        .all()
    )
    if not db_obj:
        logging.warning("Data Not Found")
        return []
    return db_obj


@router.post("/get_case", response_model=PaginatedResultsSchema)
def get_cases_by_user(
    request: CaseRequestSchema,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
):
    # Unified search without restrictive joins so cases without cameras/locations are still returned
    base_id_query = db.query(Case.id).filter(
        Case.deleted == False, Case.user_id == current_user.id
    )
    if getattr(request, "case_name", None) and request.case_name.strip() != "":
        search = f"%{request.case_name.strip()}%"
        base_id_query = base_id_query.filter(Case.case_name.ilike(search))
    base_id_query = base_id_query.order_by(Case.id.desc())

    # Accurate total count using a subquery over the distinct, filtered IDs
    total_count = db.query(func.count()).select_from(base_id_query.subquery()).scalar()

    if not total_count:
        return PaginatedResultsSchema(
            results=[],
            pagination=PaginationMeta(
                total_page=0,
                next_page=None,
                pre_page=None,
                page_size=request.page_size,
                total_count=0,
            ),
        )

    # Pagination calculations
    total_page = (total_count + request.page_size - 1) // request.page_size
    current_page = request.page_number
    next_page = current_page + 1 if current_page < total_page else None
    pre_page = current_page - 1 if current_page > 1 else None

    # Page over distinct Case IDs
    offset = (current_page - 1) * request.page_size
    page_ids = [
        row[0] for row in base_id_query.offset(offset).limit(request.page_size).all()
    ]

    # Fetch full Case objects for the page in DESC order (latest first)
    cases = []
    if page_ids:
        cases = (
            db.query(Case).filter(Case.id.in_(page_ids)).order_by(Case.id.desc()).all()
        )

    return PaginatedResultsSchema(
        results=cases,
        pagination=PaginationMeta(
            total_page=total_page,
            next_page=next_page,
            pre_page=pre_page,
            page_size=request.page_size,
            total_count=total_count,
        ),
    )


@router.get("/get_all_cases_by_user_id", response_model=List[schemas.CaseRead])
def get_all_cases_by_user_id(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    db_obj = (
        db.query(Case)
        .filter(Case.deleted == False, Case.user_id == current_user.id)
        .all()
    )
    if not db_obj:
        logging.warning("Data Not Found")
        return []
    return db_obj


@router.get("/delete_case", response_model=schemas.CaseRead)
def delete_case(
    case_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    db_obj = _get_owned_case_or_404(db=db, case_id=case_id, current_user=current_user)
    return crud.case_crud_obj.update(db=db, db_obj=db_obj, obj_in={"deleted": True})


@router.post("/case_status_count")
def get_case_status_count(
    case_request: CaseStatusCountRequest,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
):
    user_location_ids = [location.id for location in current_user.locations]
    predefined_statuses = ["OPEN", "PROCESSING", "ON HOLD", "COMPLETED", "CLOSED"]
    # Ensure the user has locations assigned
    if not user_location_ids:
        raise HTTPException(
            status_code=404, detail="User does not have assigned locations."
        )

    # NOTE: Location/RTSP mapping temporarily disabled per request; counting over Case only
    result_type_counts = (
        db.query(Case.case_status, func.count(func.distinct(Case.id)).label("count"))
        .filter(
            Case.created_date >= case_request.start_date,
            Case.created_date <= case_request.end_date,
            Case.user_id == current_user.id,
            Case.deleted == False,
        )
        .group_by(Case.case_status)
        .all()
    )
    result_type_dict = {result_type: count for result_type, count in result_type_counts}
    final_counts = {
        status: result_type_dict.get(status, 0) for status in predefined_statuses
    }
    total_count = sum(final_counts.values())

    # Construct dictionary with "TOTAL COUNT" first
    final_counts = OrderedDict(
        [("TOTAL COUNT", total_count)] + list(final_counts.items())
    )

    return dict(final_counts)


# @router.get("/case_status_count_percentage")
# def get_case_status_count_percentage(
#     case_request: CaseStatusCountRequest,
#     db: Session = Depends(deps.get_db),
#     current_user: models.User = Depends(deps.get_current_active_user),
# ):
#     user_location_ids = [location.id for location in current_user.locations]
#     predefined_statuses = ["OPEN", "PROCESSING", "ON HOLD", "COMPLETED"]
#
#     # Ensure the user has locations assigned
#     if not user_location_ids:
#         raise HTTPException(
#             status_code=403, detail="User does not have assigned locations."
#         )
#
#     result_type_counts = (
#         db.query(Case.case_status, func.count(func.distinct(Case.id)).label("count"))
#         .join(Case.cameras_rtsp)
#         .join(CameraRTSP.location)
#         .filter(CameraRTSP.location_id.in_(user_location_ids))
#         .group_by(Case.case_status)
#         .all()
#     )
#     result_type_dict = {result_type: count for result_type, count in result_type_counts}
#     final_counts = {}
#     for status in predefined_statuses:
#         status_count = result_type_dict.get(status, 0)
#         if case_label:
#             if status != case_label.upper():
#                 status = "ACTIVE CASE"
#             final_counts[status] = final_counts.get(status, 0) + status_count
#         else:
#             final_counts[status] = result_type_dict.get(status, 0)
#
#     total_count = sum(final_counts.values())
#
#     # Calculate percentage for each status type
#     percentage_counts = [
#         {
#             "name": status,
#             "y": round((count / total_count) * 100, 2) if total_count > 0 else 0,
#         }
#         for status, count in final_counts.items()
#     ]
#
#     return {"data": percentage_counts}


@router.post("/case_status_count_percentage")
def get_case_status_count_percentage(
    case_request: CaseStatusCountRequest,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
):
    user_location_ids = [location.id for location in current_user.locations]
    predefined_statuses = ["OPEN", "PROCESSING", "ON HOLD", "COMPLETED", "CLOSED"]

    # Ensure the user has locations assigned
    if not user_location_ids:
        raise HTTPException(
            status_code=404, detail="User does not have assigned locations."
        )

    # Validate date range
    if case_request.start_date >= case_request.end_date:
        raise HTTPException(
            status_code=400, detail="Start time must be before end time."
        )

    # Query to fetch case status counts with date range filtering
    # NOTE: Location/RTSP mapping temporarily disabled per request; counting over Case only
    result_type_counts = (
        db.query(Case.case_status, func.count(func.distinct(Case.id)).label("count"))
        .filter(
            Case.created_date >= case_request.start_date,
            Case.created_date <= case_request.end_date,
            Case.user_id == current_user.id,
            Case.deleted == False,
        )
        .group_by(Case.case_status)
        .all()
    )

    result_type_dict = {result_type: count for result_type, count in result_type_counts}
    final_counts = {}
    for status in predefined_statuses:
        status_count = result_type_dict.get(status, 0)
        if case_request.case_status:
            if status != case_request.case_status.upper():
                status = "ACTIVE CASE"
            final_counts[status] = final_counts.get(status, 0) + status_count
        else:
            final_counts[status] = result_type_dict.get(status, 0)

    total_count = sum(final_counts.values())
    if total_count == 0:
        raise HTTPException(status_code=404, detail="No data found")
    # Calculate percentage for each status type
    percentage_counts = [
        {
            "name": status,
            "y": round((count / total_count) * 100, 2) if total_count > 0 else 0,
        }
        for status, count in final_counts.items()
    ]

    return {"data": percentage_counts}


@router.put("/update_case_status", response_model=UpdateCaseStatusResponse)
def update_case_status(
    update_request: UpdateCaseStatusRequest,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
):
    # Validate the new status
    if update_request.case_status not in ALLOWED_STATUSES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Allowed values are {ALLOWED_STATUSES}",
        )

    case = _get_owned_case_or_404(
        db=db, case_id=update_request.id, current_user=current_user
    )

    # Update the status
    case.case_status = update_request.case_status
    case.updated_date = datetime.utcnow()

    # Commit the changes
    db.commit()
    db.refresh(case)

    # Return the response
    return UpdateCaseStatusResponse(
        id=case.id,
        case_id=case.case_id,
        case_name=case.case_name,
        case_status=case.case_status,
        updated_date=case.updated_date,
    )


@router.put("/update_case_report", response_model=UpdateCaseReportResponse)
def update_case_report(
    update_request: UpdateCaseReportRequest,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
):
    # Validate the new status
    if update_request.case_report not in ALLOWED_REPORTS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Allowed values are {ALLOWED_REPORTS}",
        )

    case = _get_owned_case_or_404(
        db=db, case_id=update_request.case_id, current_user=current_user
    )

    # Update the status
    case.case_report = update_request.case_report
    case.updated_date = datetime.utcnow()

    # Commit the changes
    db.commit()
    db.refresh(case)

    # Return the response
    return UpdateCaseReportResponse(
        id=case.id,
        case_id=case.case_id,
        case_name=case.case_name,
        case_report=case.case_report,
        updated_date=case.updated_date,
    )


@router.put("/update_case_status", response_model=UpdateCaseStatusResponse)
def update_case_status(
    update_request: UpdateCaseStatusRequest,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
):
    # Validate the new status
    if update_request.case_status not in ALLOWED_STATUSES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Allowed values are {ALLOWED_STATUSES}",
        )

    case = _get_owned_case_or_404(
        db=db, case_id=update_request.case_id, current_user=current_user
    )

    # Update the status
    case.case_status = update_request.case_status
    case.updated_date = datetime.utcnow()

    # Commit the changes
    db.commit()
    db.refresh(case)

    # Return the response
    return UpdateCaseStatusResponse(
        id=case.id,
        case_id=case.case_id,
        case_name=case.case_name,
        case_status=case.case_status,
        updated_date=case.updated_date,
    )


@router.post("/get_case_graph_details")
def get_graph_details(
    filter_request: GraphCaseRequestSchema,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
):
    return crud.case_crud_obj.get_graph_details(
        db=db, filter_request=filter_request, user_id=current_user.id
    )


@router.post("/case_suspect_journey")
def get_suspect_journey_by_case_ids(
    case_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
):
    _get_owned_case_or_404(db=db, case_id=case_id, current_user=current_user)
    return crud.case_crud_obj.get_suspect_journey(db=db, case_id=case_id)


@router.get("/get_all_cases_by_status", response_model=list)
def get_all_cases_by_status(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
):
    cases = (
        db.query(Case)
        .options(
            joinedload(Case.suspects),  # Load suspects
            joinedload(Case.cameras_rtsp),  # Load cameras_rtsp
        )
        .filter(
            Case.case_report.in_(["OPEN", "ON HOLD"]),
            Case.deleted == False,
            Case.user_id == current_user.id,
            Case.suspects.any(),  # Ensure the case has at least one suspect
            Case.cameras_rtsp.any(),
        )
        .all()
    )
    result = []
    for case in cases:
        result.append(
            {
                "id": case.id,
                "case_id": case.case_id,
                "case_name": case.case_name,
                "case_report": case.case_report,
                "suspects": [
                    {
                        "suspect_id": suspect.id,  # Explicitly map suspect_id
                        "suspect_name": suspect.suspect_name,
                        "suspect_image_url": suspect.suspect_image_url,
                    }
                    for suspect in case.suspects
                ],
                "cameras_rtsp": [
                    {
                        "id": camera.id,
                        "rtsp_url": camera.rtsp_url,
                    }
                    for camera in case.cameras_rtsp
                ],
            }
        )
    if not result:
        return []
    return result


# @router.get("/get_all_videos")
# def get_all_videos():
#     video_extensions = ("*.mp4", "*.avi", "*.mkv", "*.mov")  # Add more if needed
#     video_files = []
#     for ext in video_extensions:
#         video_files.extend(glob(os.path.join(settings.LOCAL_VIDEOS_PATH, ext)))
#     print(video_files)
#     # Convert to local IP URLs
#     return [
#         {
#             "name": video_path.split("/")[-1],
#             "url": video_path.replace(settings.LOCAL_NGINX_PATH, settings.LOCAL_IP_URL),
#         }
#         for video_path in video_files
#     ]


@router.get("/get_all_videos")
def get_all_videos(db: Session = Depends(deps.get_db)):
    # Fetch videos where status = True
    videos = db.query(Videos).filter(Videos.status == True).all()

    # Format response
    return [
        {
            "id": video.id,
            "video_name": video.des_video_path.split("/")[-1],  # Extract filename
            "destination_url": video.des_url.replace(
                settings.LOCAL_NGINX_PATH, settings.LOCAL_IP_URL
            ),
        }
        for video in videos
    ]


# ----------------------------------------------------------------------------
# PDF: Generate Case Report
# ----------------------------------------------------------------------------


def _now_ist_str() -> str:
    """Return current DATE string in IST for report header."""
    ist = datetime.utcnow() + timedelta(hours=5, minutes=30)
    return ist.strftime("%d %b %Y")


def _fetch_image_bytes(src: str) -> BytesIO:
    """Fetch image from local path or URL and return BytesIO. Handles failures gracefully."""
    buf = BytesIO()
    try:
        if not src:
            return buf
        if src.startswith("http://") or src.startswith("https://"):
            r = requests.get(src, timeout=10)
            r.raise_for_status()
            buf.write(r.content)
        else:
            # Treat as filesystem path
            with open(src, "rb") as f:
                buf.write(f.read())
    except Exception:
        # Leave buffer empty; caller may render a placeholder
        logging.exception("Failed to load image: %s", src)
    finally:
        buf.seek(0)
    return buf


def _draw_header_footer(canvas, doc):
    """Draw header (centered logo, top-right datetime) and footer (page number, address)."""
    width, height = A4
    # Header: logo top-left
    logo_path = "./logo/logo.png"
    try:
        logo_bytes = _fetch_image_bytes(logo_path)
        if logo_bytes.getbuffer().nbytes > 0:
            logo = ImageReader(logo_bytes)
            desired_w = 90
            iw, ih = logo.getSize()
            aspect = ih / float(iw) if iw else 1.0
            desired_h = desired_w * aspect
            x = 36
            y = height - desired_h - 20
            canvas.drawImage(
                logo,
                x,
                y,
                width=desired_w,
                height=desired_h,
                preserveAspectRatio=True,
                mask="auto",
            )
            header_line_y = y - 6  # draw line just below the logo
            date_y = y + desired_h - 12  # fine-tuned to align with logo top
        else:
            header_line_y = height - 30
            date_y = height - 18
    except Exception:
        logging.exception("Header logo draw failed")
        header_line_y = height - 30
        date_y = height - 18

    # Header: date only top-right
    canvas.setFont("Helvetica", 9)
    canvas.drawRightString(width - 36, date_y, _now_ist_str())
    # Header separator line just below the logo
    canvas.setLineWidth(1)
    canvas.setStrokeColor(colors.black)
    canvas.line(36, header_line_y, width - 36, header_line_y)

    # Footer
    canvas.setFont("Helvetica", 8)
    # Footer separator line (footer starting indicator)
    canvas.setLineWidth(1)
    canvas.setStrokeColor(colors.black)
    canvas.line(36, 34, width - 36, 34)
    # Bottom-right page number
    page_str = f"Page {canvas.getPageNumber()}"
    canvas.drawRightString(width - 36, 20, page_str)


@router.get("/generate_case_report")
def generate_case_report(
    case_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
):
    # Fetch case details and suspect journey
    case_obj = _get_owned_case_or_404(db=db, case_id=case_id, current_user=current_user)

    journey = crud.case_crud_obj.get_suspect_journey(case_id=case_id, db=db)

    # Prepare PDF
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=36,
        rightMargin=36,
        topMargin=64,  # Reduced gap under header/logo
        bottomMargin=42,
        title=f"Case Report - {getattr(case_obj, 'case_name', '')}",
    )

    styles = getSampleStyleSheet()
    # Previous style configuration retained for reference.
    # styles.add(
    #     ParagraphStyle(
    #         name="Heading",
    #         fontSize=14,
    #         leading=18,
    #         spaceAfter=6,
    #         spaceBefore=4,
    #         alignment=0,
    #         fontName="Helvetica-Bold",
    #     )
    # )
    styles.add(ParagraphStyle(name="Subtle", fontSize=9, textColor=colors.grey))
    styles.add(
        ParagraphStyle(
            name="TileTitle", fontSize=10, leading=12, spaceAfter=4, spaceBefore=2
        )
    )
    styles.add(
        ParagraphStyle(
            name="Heading",
            fontSize=18,
            leading=22,
            spaceAfter=6,
            spaceBefore=4,
            alignment=0,
            fontName="Helvetica-Bold",
        )
    )
    styles.add(
        ParagraphStyle(
            name="MainTitle",
            parent=styles["Title"],
            alignment=1,
            spaceBefore=4,
            spaceAfter=8,
            fontName="Helvetica-Bold",
            fontSize=20,
            leading=24,
        )
    )
    styles.add(
        ParagraphStyle(
            name="BodyContent",
            parent=styles["BodyText"],
            fontSize=11,
            leading=15,
        )
    )
    styles.add(
        ParagraphStyle(
            name="IndentedBody",
            parent=styles["BodyContent"],
            leftIndent=6,
            firstLineIndent=6,
        )
    )
    styles.add(
        ParagraphStyle(
            name="CaseMeta",
            parent=styles["BodyContent"],
        )
    )
    styles.add(
        ParagraphStyle(
            name="SuspectCardText",
            parent=styles["BodyContent"],
            fontSize=10.5,
            leading=13,
        )
    )
    styles.add(
        ParagraphStyle(
            name="SectionHeading",
            parent=styles["Heading"],
            fontSize=16,
            leading=20,
            spaceBefore=12,
            spaceAfter=8,
            alignment=0,
        )
    )
    styles.add(
        ParagraphStyle(
            name="CenterHeading",
            parent=styles["Heading2"],
            alignment=1,
            spaceBefore=6,
            spaceAfter=6,
            fontName="Helvetica-Bold",
            fontSize=16,
            leading=20,
        )
    )

    story = []

    # Case heading details (Centered, bold)
    story.append(Paragraph("Case Report", styles["MainTitle"]))

    # Case metadata
    created_dt = getattr(case_obj, "created_date", None)
    if created_dt:
        created_dt = created_dt + timedelta(hours=5, minutes=30)
        created_str = created_dt.strftime("%d %b %Y, %I:%M:%S %p")
    else:
        created_str = "N/A"
    updated_dt = getattr(case_obj, "updated_date", None)
    if updated_dt:
        updated_dt = updated_dt + timedelta(hours=5, minutes=30)
        updated_str = updated_dt.strftime("%d %b %Y, %I:%M:%S %p")
    else:
        updated_str = "N/A"

    case_id_disp = (getattr(case_obj, "case_id", "") or "")[-12:]
    case_name_text = getattr(case_obj, "case_name", "")
    case_description_text = getattr(case_obj, "case_description", "")
    case_status_text = getattr(case_obj, "case_status", "N/A") or "N/A"
    report_status_text = getattr(case_obj, "case_report", "N/A") or "N/A"
    suspect_count = len(getattr(case_obj, "suspects", []) or [])

    story.append(Paragraph("Case Summary", styles["SectionHeading"]))
    incident_text = (
        case_description_text
        or "No incident narrative has been recorded for this case."
    )
    formatted_incident_text = incident_text.replace("\n", "<br/>")
    summary_rows = [
        [
            Paragraph("<b>Case ID</b>", styles["BodyContent"]),
            Paragraph(case_id_disp or "N/A", styles["BodyContent"]),
        ],
        [
            Paragraph("<b>Case Name</b>", styles["BodyContent"]),
            Paragraph(case_name_text or "N/A", styles["BodyContent"]),
        ],
        [
            Paragraph("<b>Case Date & Time</b>", styles["BodyContent"]),
            Paragraph(created_str, styles["BodyContent"]),
        ],
        [
            Paragraph("<b>Associated Suspects</b>", styles["BodyContent"]),
            Paragraph(str(suspect_count), styles["BodyContent"]),
        ],
        [
            Paragraph("<b>Case Details</b>", styles["BodyContent"]),
            Paragraph(formatted_incident_text, styles["BodyContent"]),
        ],
    ]
    # Use a shared left indent so summary and suspect sections align
    cards_left_indent = 12
    left_indent_summary = cards_left_indent
    available_width_summary = (
        A4[0] - doc.leftMargin - doc.rightMargin
    ) - left_indent_summary
    summary_col_ratio = 0.35
    summary_table = Table(
        summary_rows,
        colWidths=[
            available_width_summary * summary_col_ratio,
            available_width_summary * (1 - summary_col_ratio),
        ],
    )
    summary_table.hAlign = "LEFT"
    summary_table.setStyle(
        TableStyle(
            [
                ("TEXTCOLOR", (0, 0), (-1, -1), colors.black),
                ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
                ("FONTNAME", (1, 0), (1, -1), "Helvetica"),
                ("FONTSIZE", (0, 0), (-1, -1), 11),
                ("LEADING", (0, 0), (-1, -1), 14),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                ("INNERGRID", (0, 0), (-1, -1), 0.5, BOX_BORDER_COLOR),
                ("BOX", (0, 0), (-1, -1), 1, BOX_BORDER_COLOR),
            ]
        )
    )
    story.append(Indenter(left=cards_left_indent))
    story.append(summary_table)
    story.append(Indenter(left=-cards_left_indent))
    story.append(Spacer(1, 14))

    story.append(Spacer(1, 10))

    story.append(Paragraph("Suspect Information", styles["SectionHeading"]))
    suspects = list(getattr(case_obj, "suspects", []) or [])
    if suspects:
        story.append(
            Paragraph(
                "The following persons of interest are linked to the case and remain under review by the investigative unit.",
                styles["IndentedBody"],
            )
        )
        story.append(Spacer(1, 8))
    else:
        story.append(
            Paragraph(
                "No suspect profiles are available for this case at the time of reporting.",
                styles["IndentedBody"],
            )
        )
        story.append(Spacer(1, 12))

    # Suspects as cards (image + name), 2 per row, centered
    if suspects:

        sus_cards = []
        cards_per_row = 3
        total_width = A4[0] - doc.leftMargin - doc.rightMargin
        available_width = total_width - cards_left_indent

        inter_col_gap = 16
        sus_col_w = (
            available_width - inter_col_gap * (cards_per_row - 1)
        ) / cards_per_row
        passport_side = min(max(sus_col_w - 32, 1.2 * inch), 1.8 * inch)
        card_inner_width = sus_col_w
        inner_padding = 8
        inner_width = max(1, card_inner_width - 2 * inner_padding)
        for s in suspects:
            flows = []
            image_height = 0
            s_img_buf = _fetch_image_bytes(getattr(s, "suspect_image_url", ""))
            if s_img_buf.getbuffer().nbytes > 0:
                try:
                    with PILImage.open(BytesIO(s_img_buf.getvalue())) as pil:
                        pil = pil.convert("RGB")
                        pil = pil.resize((640, 640))
                        outb = BytesIO()
                        pil.save(outb, format="PNG")
                        outb.seek(0)
                    image_padding = 8
                    usable_width = max(1, card_inner_width - (2 * image_padding))
                    side = min(passport_side, usable_width)
                    img = RLImage(outb, width=side, height=side)
                    flows.append(img)
                    image_height = side
                except Exception:
                    pass
            spacer_height = 6
            flows.append(Spacer(1, spacer_height))
            suspect_name = getattr(s, "suspect_name", None)
            if not suspect_name or not str(suspect_name).strip():
                suspect_name = "Unknown Suspect"
            paragraph = Paragraph(
                suspect_name,
                styles["BodyContent"],
            )
            _, paragraph_height = paragraph.wrap(inner_width, 0)
            flows.append(paragraph)

            total_content_height = image_height + spacer_height + paragraph_height
            total_height = total_content_height + 2 * inner_padding
            sus_cards.append({"flows": flows, "height": total_height})

        rows = []
        for idx in range(0, len(sus_cards), cards_per_row):
            row_cards = sus_cards[idx : idx + cards_per_row]
            while len(row_cards) < cards_per_row:
                row_cards.append(None)
            row_height = max(
                (card["height"] for card in row_cards if card),
                default=inner_padding * 2,
            )
            row_with_spacers = []
            for c_idx, card in enumerate(row_cards):
                if card:
                    inner_keep = KeepInFrame(
                        inner_width,
                        max(row_height - 2 * inner_padding, inner_padding),
                        card["flows"],
                        mode="shrink",
                    )
                    card_table = Table(
                        [[inner_keep]],
                        colWidths=[card_inner_width],
                        rowHeights=[row_height],
                    )
                    card_table.setStyle(
                        TableStyle(
                            [
                                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                                ("LEFTPADDING", (0, 0), (-1, -1), inner_padding),
                                ("RIGHTPADDING", (0, 0), (-1, -1), inner_padding),
                                ("TOPPADDING", (0, 0), (-1, -1), inner_padding),
                                ("BOTTOMPADDING", (0, 0), (-1, -1), inner_padding),
                                ("BACKGROUND", (0, 0), (-1, -1), colors.whitesmoke),
                                ("BOX", (0, 0), (-1, -1), 1.2, BOX_BORDER_COLOR),
                            ]
                        )
                    )
                    row_with_spacers.append(card_table)
                else:
                    row_with_spacers.append(Spacer(sus_col_w, row_height))

                if c_idx < cards_per_row - 1:
                    row_with_spacers.append(Spacer(inter_col_gap, row_height))
            rows.append((row_with_spacers, row_height))

        col_widths = []
        for col_index in range(cards_per_row):
            col_widths.append(sus_col_w)
            if col_index < cards_per_row - 1:
                col_widths.append(inter_col_gap)

        row_gap = 10
        rows_with_spacing = []
        row_heights = []
        for idx, (row, row_height) in enumerate(rows):
            rows_with_spacing.append(row)
            row_heights.append(row_height)
            if idx < len(rows) - 1:
                gap_row = [Spacer(width, row_gap) for width in col_widths]
                rows_with_spacing.append(gap_row)
                row_heights.append(row_gap)

        sus_table = Table(
            rows_with_spacing,
            colWidths=col_widths,
            rowHeights=row_heights,
            hAlign="LEFT",
        )
        sus_table.setStyle(
            TableStyle(
                [
                    ("LEFTPADDING", (0, 0), (-1, -1), 0),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                    ("TOPPADDING", (0, 0), (-1, -1), 0),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
                    ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ]
            )
        )
        story.append(Indenter(left=cards_left_indent))
        story.append(sus_table)
        story.append(Indenter(left=-cards_left_indent))
        story.append(Spacer(1, 10))

    story.append(PageBreak())
    story.append(Paragraph("Suspect Journey", styles["SectionHeading"]))
    story.append(
        Paragraph(
            "Photographic and video stills documenting the suspect journey are consolidated below. Visuals are sequenced chronologically when timestamps are available.",
            styles["IndentedBody"],
        )
    )
    story.append(Spacer(1, 4))

    # Build tiles: two per row
    tiles = []
    total_content_width = A4[0] - doc.leftMargin - doc.rightMargin
    column_gap = 16
    max_img_w = total_content_width / 2  # width of each journey column within margins
    max_img_h = 3.0 * inch
    journey_card_height = max_img_h + (1.6 * inch)

    def build_tile(entry: dict):
        comps = []
        # Image
        file_url = entry.get("file_url") or ""
        # Quick filter: only try to render common image types
        lower_url = file_url.lower()
        is_img_candidate = any(
            lower_url.endswith(ext)
            for ext in [".jpg", ".jpeg", ".png", ".bmp", ".gif", ".webp"]
        ) or lower_url.startswith("http")
        img_buf = _fetch_image_bytes(file_url) if is_img_candidate else BytesIO()
        if img_buf.getbuffer().nbytes > 0:
            try:
                # Force square 640x640 then fit into card width
                with PILImage.open(BytesIO(img_buf.getvalue())) as pil:
                    pil = pil.convert("RGB")
                    pil = pil.resize((640, 640))
                    outb = BytesIO()
                    pil.save(outb, format="PNG")
                    outb.seek(0)
                # Fit within inner card width to avoid overflow
                # Card column width is (max_img_w - 12); paddings 10 left/right -> usable width:
                inner_content_w = max(1, (max_img_w - 12) - 20)
                width_pts = min(inner_content_w, 3.8 * inch)
                height_pts = min(width_pts, max_img_h)
                img = RLImage(outb, width=width_pts, height=height_pts)
                comps.append(img)
            except Exception:
                # Skip image rendering on any error to prevent layout failure
                logging.exception(
                    "Failed to render image tile or non-image content encountered"
                )
        # Meta details
        suspect_names = (
            ", ".join(
                list(
                    {
                        s.get("suspect_name")
                        for s in entry.get("suspects", [])
                        if s.get("suspect_name")
                    }
                )
            )
            or "Unknown"
        )
        ts = entry.get("frame_time")
        time_str = (
            ts
            if isinstance(ts, str)
            else (ts.strftime("%d %b %Y, %H:%M:%S") if ts else "")
        )
        source_type = entry.get("source_type")
        if source_type == "video":
            video_name = entry.get("video_name") or "Unknown Video"
            source_line = f"<b>Video:</b> {video_name}"
            loc_line = ""
        else:
            camera_name = entry.get("camera_name") or "Unknown Camera"
            location_name = entry.get("location_name") or ""
            source_line = f"<b>Camera:</b> {camera_name}"
            loc_line = f"<br/><b>Location:</b> {location_name}" if location_name else ""

        desc = entry.get("description") or ""
        if len(desc) > 500:
            desc = desc[:500] + "…"

        meta = (
            f"<b>Suspect Name:</b> {suspect_names}<br/>"
            f"<b>Time:</b> {time_str}<br/>"
            f"{source_line}{loc_line}<br/>"
            f"<b>Description:</b> {desc}"
        )
        comps.append(Spacer(1, 6))
        comps.append(Paragraph(meta, styles["BodyContent"]))

        # Wrap this tile in an inner single-cell table to get an individual card box
        card_inner_width = max_img_w - 12
        card_body = KeepInFrame(
            card_inner_width - 4,
            journey_card_height - 8,
            comps,
            mode="shrink",
        )
        card = Table(
            [[card_body]],
            colWidths=[card_inner_width],
            rowHeights=[journey_card_height],
        )
        card.setStyle(
            TableStyle(
                [
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 10),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                    ("TOPPADDING", (0, 0), (-1, -1), 8),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                    ("BACKGROUND", (0, 0), (-1, -1), colors.whitesmoke),
                    ("BOX", (0, 0), (-1, -1), 1.2, BOX_BORDER_COLOR),
                ]
            )
        )
        return card

    # Chunk into rows of 2
    row = []
    data = []
    for entry in journey or []:
        row.append(build_tile(entry))
        if len(row) == 2:
            data.append(row)
            row = []
    if row:
        # pad last cell if odd count
        row.append(Spacer(max_img_w, journey_card_height))
        data.append(row)

    if data:
        rows_per_page = 2  # 2 rows x 2 columns = 4 tiles per page
        row_gap = 16
        for idx in range(0, len(data), rows_per_page):
            chunk = data[idx : idx + rows_per_page]
            while len(chunk) < rows_per_page:
                chunk.append(
                    [
                        Spacer(max_img_w, journey_card_height),
                        Spacer(max_img_w, journey_card_height),
                    ]
                )

            chunk_with_spacing = []
            row_heights = []
            for row_index, row_cards in enumerate(chunk):
                chunk_with_spacing.append(row_cards)
                row_heights.append(journey_card_height)
                if row_index < len(chunk) - 1:
                    chunk_with_spacing.append(
                        [
                            Spacer(max_img_w, row_gap),
                            Spacer(max_img_w, row_gap),
                        ]
                    )
                    row_heights.append(row_gap)

            table = Table(
                chunk_with_spacing,
                colWidths=[max_img_w, max_img_w],
                rowHeights=row_heights,
                hAlign="LEFT",
                spaceBefore=6,
                spaceAfter=6,
                repeatRows=0,
            )
            table.setStyle(
                TableStyle(
                    [
                        ("VALIGN", (0, 0), (-1, -1), "TOP"),
                        # keep edges flush with margins but add internal gutter
                        ("LEFTPADDING", (0, 0), (0, -1), 0),
                        ("RIGHTPADDING", (0, 0), (0, -1), column_gap / 2),
                        ("LEFTPADDING", (1, 0), (1, -1), column_gap / 2),
                        ("RIGHTPADDING", (1, 0), (1, -1), 0),
                        ("TOPPADDING", (0, 0), (-1, -1), 0),
                        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
                        ("SPLITLONGWORDS", (0, 0), (-1, -1), True),
                    ]
                )
            )
            story.append(table)
            if idx + rows_per_page < len(data):
                story.append(Spacer(1, 12))
    else:
        story.append(Paragraph("No suspect journey data available.", styles["Subtle"]))

    story.append(Spacer(1, 14))
    story.append(Paragraph("Conclusion", styles["SectionHeading"]))
    suspect_sentence = (
        f"{suspect_count} person(s) of interest are linked to this matter and remain under analytical review."
        if suspect_count
        else "No persons of interest have been formally associated with this matter."
    )
    normalized_case_status = case_status_text.title()
    normalized_report_status = report_status_text.title()
    conclusion_text = (
        f"The case is presently classified as {normalized_case_status} with the report workflow marked "
        f"{normalized_report_status}. {suspect_sentence}"
    )

    next_steps_lookup = {
        "OPEN": "Recommended next steps include completing evidence correlation, capturing formal witness statements, and preparing charging documentation.",
        "PROCESSING": "Recommended next steps include final validation of evidentiary packages and liaison with prosecutorial authorities.",
        "ON HOLD": "Recommended next steps include reviewing outstanding dependencies and resuming investigative activity once prerequisites are satisfied.",
        "COMPLETED": "Recommended next steps include archiving the full investigative packet and notifying relevant stakeholders.",
        "CLOSED": "Recommended next steps include retaining final records and concluding administrative close-out activities.",
    }
    follow_up = next_steps_lookup.get(
        case_status_text.upper(),
        "Recommended next steps will be issued upon the next procedural review.",
    )
    conclusion_items = [
        ListItem(
            Paragraph(conclusion_text, styles["BodyContent"]),
            leftIndent=0,
            bulletText="•",
        ),
        ListItem(
            Paragraph(follow_up, styles["BodyContent"]),
            leftIndent=0,
            bulletText="•",
        ),
    ]
    story.append(Indenter(left=18))
    story.append(
        ListFlowable(
            conclusion_items,
            bulletType="bullet",
            leftIndent=12,
            bulletFontName="Helvetica-Bold",
            bulletFontSize=11,
        )
    )
    story.append(Indenter(left=-18))

    # Build PDF
    doc.build(story, onFirstPage=_draw_header_footer, onLaterPages=_draw_header_footer)

    buffer.seek(0)
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=case_report_{case_id}.pdf"
        },
    )
