import logging
from datetime import datetime, timezone
from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, literal_column
from sqlalchemy.orm import Session

import crud
import models
import schemas
from api import deps
from core.config import settings
from models.camera import CameraRTSP
from models.result import Result
from models.result_type import ResultType
from schemas.result import (
    ChairOccupancyRequest,
    ChairOccupancyResponse,
    GraphResultRequestSchema,
    ResultRequestSchema,
    ResultTypeCountRequest,
    ResultTypeCountResponse,
)

router = APIRouter()


@router.post("/add_result", response_model=schemas.ResultRead)
def add_result(
    result_details: schemas.ResultCreate,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    result_details.frame_time = result_details.frame_time.replace(
        tzinfo=timezone.utc, microsecond=0
    )
    result_details.status = True
    result_details.deleted = False
    result_details.created_date = (
        datetime.now(timezone.utc).replace(microsecond=0).strftime("%Y-%m-%d %H:%M:%S")
    )
    result_details.updated_date = (
        datetime.now(timezone.utc).replace(microsecond=0).strftime("%Y-%m-%d %H:%M:%S")
    )
    result_details.frame_time = result_details.frame_time.replace(
        tzinfo=timezone.utc
    ).strftime("%Y-%m-%d %H:%M:%S")
    if isinstance(result_details, dict):
        result_details_obj = result_details
    else:
        result_details_obj = result_details.dict(exclude_unset=True)

    obj_out = crud.result_crud_obj.create(db=db, obj_in=result_details_obj)
    if not obj_out:
        raise HTTPException(status_code=500, detail="Device Not Added")
    return obj_out


@router.post("/update_result", response_model=schemas.ResultRead)
def update_result(
    result_details: schemas.ResultUpdate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    result_details.updated_date = (
        datetime.now(timezone.utc).replace(microsecond=0).strftime("%Y-%m-%d %H:%M:%S")
    )
    db_obj = crud.result_crud_obj.get(db, result_details.id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Data Not Found")
    result = crud.result_crud_obj.get_by_name(
        db, name=result_details.result_name, company_id=current_user.company_id
    )
    if result:
        logging.warning("location name already taken")
        raise HTTPException(
            status_code=400,
            detail="The location name already exists in the system.",
        )
    return crud.location_crud_obj.update(db=db, db_obj=db_obj, obj_in=result_details)


@router.post("/update_result_status", response_model=schemas.ResultRead)
def update_result_status(
    result_details: schemas.ResultStatus,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    result_details.updated_date = (
        datetime.now(timezone.utc).replace(microsecond=0).strftime("%Y-%m-%d %H:%M:%S")
    )
    db_obj = crud.result_crud_obj.get_by_id(db, result_details.id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Data Not Found")
    return crud.result_crud_obj.update(
        db=db,
        db_obj=db_obj,
        obj_in={
            "status": result_details.status,
            "updated_date": result_details.updated_date,
        },
    )


@router.get("/get_result_by_id", response_model=schemas.ResultResponseSchema)
def get_result_by_id(
    result_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    db_obj = crud.result_crud_obj.get_by_id(db, result_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Result not found")
    return db_obj


@router.post("/get_result_by_ids", response_model=List[schemas.ResultResponseSchema])
def get_result_by_ids(
    result_ids: List[int],
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    db_obj = crud.result_crud_obj.get_multiple_by_ids(db, result_ids)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Result not found")
    return db_obj


@router.get("/get_all_result", response_model=List[schemas.ResultResponseSchema])
def get_all_result(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    db_obj = crud.result_crud_obj.get_all_results_by_user_id(
        db, user_id=current_user.id
    )
    if not db_obj:
        raise HTTPException(status_code=404, detail="No Data Found")
    return db_obj


@router.get("/delete_result", response_model=schemas.ResultRead)
def delete_result(
    result_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    db_obj = crud.result_crud_obj.get_by_id(db, result_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Data Not Found")
    return crud.result_crud_obj.update(db=db, db_obj=db_obj, obj_in={"deleted": True})


@router.post("/get_result", response_model=schemas.PaginatedResultsSchema)
def get_result(
    request: ResultRequestSchema,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
):
    results = crud.result_crud_obj.get_paginated_results(
        db=db, request=request, user_id=current_user.id
    )
    return results


@router.post("/result_type_count", response_model=ResultTypeCountResponse)
def get_result_type_count(
    request: ResultTypeCountRequest,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
):
    start_date = request.start_date
    end_date = request.end_date

    # Get location IDs associated with the current user
    user_location_ids = [location.id for location in current_user.locations]

    # Subquery to get counts of results grouped by result type, filtered by date
    result_type_counts_subquery = (
        db.query(
            ResultType.id.label("result_type_id"), func.count(Result.id).label("count")
        )
        .outerjoin(Result, Result.result_type_id == ResultType.id)
        .join(CameraRTSP, CameraRTSP.id == Result.camera_id, isouter=True)
        .filter(
            CameraRTSP.location_id.in_(user_location_ids),
            Result.created_date >= start_date,
            Result.created_date <= end_date,
        )
        .group_by(ResultType.id)
        .subquery()
    )

    # Query all result types with their counts, defaulting to 0 if no results are found
    result_type_counts = (
        db.query(
            ResultType.result_type,
            func.coalesce(
                result_type_counts_subquery.c.count, literal_column("0")
            ).label("count"),
        )
        .outerjoin(
            result_type_counts_subquery,
            result_type_counts_subquery.c.result_type_id == ResultType.id,
        )
        .all()
    )
    return {
        "result_type_counts": [
            {result_type: count} for result_type, count in result_type_counts
        ]
    }


@router.post("/get_graph_result")
def get_result(
    request: GraphResultRequestSchema,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
):
    results = crud.result_crud_obj.get_graph_results(db=db, filter_request=request)
    return results


@router.post("/chair_occupancy_count", response_model=List[ChairOccupancyResponse])
def get_chair_occupancy_count(
    request: ChairOccupancyRequest,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
):
    start_time = request.start_date.replace(microsecond=0).strftime("%Y-%m-%d %H:%M:%S")
    end_time = request.end_date.replace(microsecond=0).strftime("%Y-%m-%d %H:%M:%S")

    # Get the cameras associated with the current user
    user_locations = [loc.id for loc in current_user.locations]
    cameras = (
        db.query(CameraRTSP).filter(CameraRTSP.location_id.in_(user_locations)).all()
    )

    if not cameras:
        raise HTTPException(
            status_code=404, detail="No cameras found for the current user"
        )

    total_percentage = 0
    total_cameras = 0

    for camera in cameras:
        camera_id = str(camera.id)
        if camera_id not in settings.TOTAL_CHAIRS_COUNT:
            continue

        total_chairs = settings.TOTAL_CHAIRS_COUNT[camera_id]
        # Fetch data dynamically from the database
        occupancy_results = (
            db.query(models.Result)
            .filter(
                models.Result.camera_id == camera.id,
                models.Result.frame_time >= start_time,
                models.Result.frame_time <= end_time,
            )
            .all()
        )

        if not occupancy_results:
            continue

        # Calculate average occupancy for the current camera
        camera_total_occupancy = 0
        camera_entries = 0

        for result in occupancy_results:
            count = result.label_count.get(
                "occupancy_detection", 0
            )  # Adjust the key as per your data
            camera_total_occupancy += count / total_chairs * 100
            if count != 0:
                camera_entries += 1
        if camera_entries > 0:
            camera_average_percentage = camera_total_occupancy / camera_entries
            total_percentage += camera_average_percentage
            total_cameras += 1

    if total_cameras == 0:
        raise HTTPException(
            status_code=404, detail="No occupancy data found for the given time range"
        )
    overall_average_percentage = total_percentage / total_cameras
    return [
        {"name": "chair_occupied", "y": round(overall_average_percentage, 2)},
        {"name": "chair_available", "y": round(100 - overall_average_percentage, 2)},
    ]
