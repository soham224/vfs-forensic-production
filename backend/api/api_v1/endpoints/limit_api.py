import logging
from datetime import datetime, timezone
from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud
import models
import schemas
from api import deps

router = APIRouter()


@router.post("/add_limit", response_model=schemas.LimitRead)
def add_limit(
    limit_details: schemas.LimitCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    limit_details.status = True
    limit_details.deleted = False
    limit_details.created_date = (
        datetime.now(timezone.utc).replace(microsecond=0).strftime("%Y-%m-%d %H:%M:%S")
    )
    limit_details.updated_date = (
        datetime.now(timezone.utc).replace(microsecond=0).strftime("%Y-%m-%d %H:%M:%S")
    )
    if isinstance(limit_details, dict):
        limit_details_obj = limit_details
    else:
        limit_details_obj = limit_details.dict(exclude_unset=True)

    obj_out = crud.limit_crud_obj.create(db=db, obj_in=limit_details_obj)
    if not obj_out:
        logging.error("Device Not Added")
        raise HTTPException(status_code=500, detail="Device Not Added")
    return obj_out


@router.post("/update_limit", response_model=schemas.LimitRead)
def update_limit(
    limit_details: schemas.LimitUpdate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    limit_details.updated_date = (
        datetime.now(timezone.utc).replace(microsecond=0).strftime("%Y-%m-%d %H:%M:%S")
    )
    db_obj = crud.limit_crud_obj.get(db, limit_details.id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Data Not Found")
    limit = crud.limit_crud_obj.get_by_type(
        db, type=limit_details.type, subtype=limit_details.subtype
    )
    if limit:
        logging.warning("limit name already taken")
        raise HTTPException(
            status_code=400,
            detail="The limit name already exists in the system.",
        )
    return crud.limit_crud_obj.update(db=db, db_obj=db_obj, obj_in=limit_details)


@router.get("/get_limit_by_id", response_model=schemas.LimitRead)
def get_limit_by_id(
    limit_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    db_obj = crud.limit_crud_obj.get_by_id(db, limit_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="No Data Found")
    return db_obj


@router.get("/get_all_limit", response_model=List[schemas.LimitRead])
def get_all_limit(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    db_obj = crud.limit_crud_obj.get_all_enabled_deleted(db)
    if not db_obj:
        raise HTTPException(status_code=404, detail="No Data Found")
    return db_obj


@router.get("/delete_limit", response_model=schemas.LimitRead)
def delete_limit(
    limit_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    db_obj = crud.limit_crud_obj.get_by_id(db, limit_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Data Not Found")
    return crud.limit_crud_obj.update(db=db, db_obj=db_obj, obj_in={"deleted": True})
