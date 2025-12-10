import logging
import shutil
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, List

import requests
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import text

import crud
import models
import schemas
from api import deps
from core.config import settings

UPLOAD_DIR = Path(settings.BASE_DIR)
UPLOAD_DIR.mkdir(exist_ok=True)

router = APIRouter()


@router.post("/add_suspect", response_model=schemas.SuspectRead)
def add_suspect(
    suspect_name: str = Form(...),
    case_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    # Always store uploads into the configured SUSPECT_IMG_DIR with a unique name
    target_dir = Path(str(settings.SUSPECT_IMG_DIR))
    target_dir.mkdir(parents=True, exist_ok=True)
    safe_suffix = Path(file.filename).suffix
    unique_name = f"{uuid.uuid4().hex}{safe_suffix}"
    target_path = target_dir / unique_name
    with open(target_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    # Generate file URL
    suspect_dir: str = str(settings.SUSPECT_IMG_DIR).strip()
    nginx_root: str = str(settings.LOCAL_NGINX_PATH).strip()
    base_url: str = str(settings.LOCAL_IP_URL).strip()

    # Remove the local nginx root from the directory to get the web-relative path
    # Compare path segments to avoid symlink/resolve pitfalls
    from pathlib import PurePosixPath as _PPP

    sus_p = _PPP(suspect_dir)
    root_p = _PPP(nginx_root)
    s_parts = sus_p.parts
    r_parts = root_p.parts
    if len(r_parts) > 0 and s_parts[: len(r_parts)] == r_parts:
        rel_parts = s_parts[len(r_parts) :]
        web_relative = "/".join(rel_parts)
    else:
        # Fallback: conservative string-based removal
        root_norm = nginx_root.rstrip("/")
        if root_norm and (
            suspect_dir == root_norm or suspect_dir.startswith(root_norm + "/")
        ):
            web_relative = suspect_dir[len(root_norm) :]
        else:
            web_relative = suspect_dir.replace(root_norm + "/", "", 1).replace(
                root_norm, "", 1
            )

    # Normalize slashes
    web_relative = web_relative.lstrip("/")
    # Final fallback: anchor from the 'frames' segment if available
    idx = web_relative.find("frames/")
    if idx > 0:
        web_relative = web_relative[idx:]
    base_url = base_url.rstrip("/")

    file_url = f"{base_url}/{web_relative}/{unique_name}"

    suspect_details = schemas.SuspectCreate(
        case_id=case_id,
        suspect_name=suspect_name,
        suspect_image_path=str(target_path),
        suspect_image_url=file_url,
        status=True,
        deleted=False,
        created_date=datetime.now(timezone.utc)
        .replace(microsecond=0)
        .strftime("%Y-%m-%d %H:%M:%S"),
        updated_date=datetime.now(timezone.utc)
        .replace(microsecond=0)
        .strftime("%Y-%m-%d %H:%M:%S"),
    )
    if isinstance(suspect_details, dict):
        suspect_details_obj = suspect_details
    else:
        suspect_details_obj = suspect_details.dict(exclude_unset=True)

    obj_out = crud.suspect_crud_obj.create(db=db, obj_in=suspect_details_obj)

    if not obj_out:
        raise HTTPException(status_code=500, detail="Device Not Added")
    # response = requests.get(
    #     f"{settings.SUSPECT_DETAILS_API}", params={"suspect_id": obj_out.id}
    # )
    # # Check if the response is successful
    # if response.status_code == 200:
    #     # Parse and print the JSON response
    #     data = response.json()
    #     logging.info("Response from API::", data)
    # Internal call instead of external requests.get()
    try:
        suspect_details = get_suspect_details(obj_out.id, db)
        logging.info(f"Suspect Details: {suspect_details}")
    except Exception as exc:
        logging.error(f"Failed to fetch suspect details internally: {exc}")
    return obj_out


@router.post("/update_suspect", response_model=schemas.SuspectRead)
def update_suspect(
    suspect_details: schemas.SuspectUpdate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    suspect_details.updated_date = (
        datetime.now(timezone.utc).replace(microsecond=0).strftime("%Y-%m-%d %H:%M:%S")
    )
    db_obj = crud.suspect_crud_obj.get(db, suspect_details.id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Data Not Found")
    suspect = crud.suspect_crud_obj.get_by_name(
        db, name=suspect_details.suspect_name, company_id=current_user.company_id
    )
    if suspect:
        logging.warning("location name already taken")
        raise HTTPException(
            status_code=400,
            detail="The location name already exists in the system.",
        )
    return crud.location_crud_obj.update(db=db, db_obj=db_obj, obj_in=suspect_details)


@router.post("/update_suspect_status", response_model=schemas.SuspectRead)
def update_suspect_status(
    suspect_details: schemas.SuspectStatus,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    suspect_details.updated_date = (
        datetime.now(timezone.utc).replace(microsecond=0).strftime("%Y-%m-%d %H:%M:%S")
    )
    db_obj = crud.suspect_crud_obj.get_by_id(db, suspect_details.id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Data Not Found")
    return crud.suspect_crud_obj.update(
        db=db,
        db_obj=db_obj,
        obj_in={
            "status": suspect_details.status,
            "updated_date": suspect_details.updated_date,
        },
    )


@router.get("/get_suspect_by_id", response_model=schemas.SuspectRead)
def get_suspect_by_id(
    suspect_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    db_obj = crud.suspect_crud_obj.get_by_id(db, suspect_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="No Data Found")
    return db_obj


@router.get("/get_suspect_by_case_id", response_model=List[schemas.SuspectName])
def get_suspect_by_case_id(
    case_id: int,
    db: Session = Depends(deps.get_db),
) -> Any:
    db_obj = crud.suspect_crud_obj.get_suspects_by_id(db, case_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="No Data Found")
    return db_obj


@router.get("/get_all_suspect", response_model=List[schemas.SuspectRead])
def get_all_suspect(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    db_obj = crud.suspect_crud_obj.get_all(db)
    if not db_obj:
        raise HTTPException(status_code=404, detail="No Data Found")
    return db_obj


@router.get("/delete_suspect", response_model=schemas.SuspectRead)
def delete_suspect(
    suspect_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    db_obj = crud.suspect_crud_obj.get_by_id(db, suspect_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Data Not Found")
    return crud.suspect_crud_obj.update(db=db, db_obj=db_obj, obj_in={"deleted": True})


@router.get(
    "/store_suspect_details",
    response_model=schemas.SuspectDetailsResponse,
    tags=["Suspects"],
)
def get_suspect_details(suspect_id: int, db=Depends(deps.get_db)):
    try:
        # Fetch suspect row
        suspect_query = text(
            """
            SELECT id, suspect_name, suspect_image_url, case_id
            FROM suspect
            WHERE id = :suspect_id
              AND deleted = FALSE
        """
        )
        suspect = db.execute(suspect_query, {"suspect_id": suspect_id}).fetchone()
        if not suspect:
            raise HTTPException(status_code=404, detail="Suspect not found")

        case_id = suspect.case_id
        # Validate case exists
        case_query = text(
            """
            SELECT id
            FROM `case`
            WHERE id = :case_id
              AND deleted = FALSE
        """
        )
        case = db.execute(case_query, {"case_id": case_id}).fetchone()
        if not case:
            raise HTTPException(status_code=404, detail="Associated case not found")

        # Pull associated camera RTSP ids
        camera_query = text(
            """
            SELECT camera_rtsp.id
            FROM camera_rtsp
            JOIN case_camera_rtsp_mapping
              ON camera_rtsp.id = case_camera_rtsp_mapping.camera_rtsp_id
            WHERE case_camera_rtsp_mapping.case_id = :case_id
              AND camera_rtsp.deleted = FALSE
        """
        )
        cameras = db.execute(camera_query, {"case_id": case_id}).fetchall()
        camera_rtsp_ids = [str(camera.id) for camera in cameras]

        return schemas.SuspectDetailsResponse(
            suspect_id=suspect.id,
            suspect_name=suspect.suspect_name,
            case_id=case_id,
            camera_rtsp_ids=camera_rtsp_ids,
        )

    except HTTPException:
        raise
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Database error")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
