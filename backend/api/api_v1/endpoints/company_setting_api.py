from datetime import datetime, timezone
from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud
import models
import schemas
from api import deps

router = APIRouter()


@router.post("/add_company_setting", response_model=schemas.CompanySettingRead)
def add_company_setting(
    company_setting_details: schemas.CompanySettingCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    company_setting_details.created_date = datetime.now(timezone.utc).replace(
        microsecond=0
    )
    company_setting_details.updated_date = datetime.now(timezone.utc).replace(
        microsecond=0
    )
    if isinstance(company_setting_details, dict):
        company_setting_obj = company_setting_details
    else:
        company_setting_obj = company_setting_details.dict(exclude_unset=True)

    obj_out = crud.company_setting_obj.create(db=db, obj_in=company_setting_obj)
    if not obj_out:
        raise HTTPException(status_code=500, detail="Device Not Added")
    return obj_out


@router.post("/update_company_setting", response_model=schemas.CompanySettingRead)
def update_company_setting(
    company_setting_details: schemas.CompanySettingUpdate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    company_setting = crud.company_setting_obj.get(db, company_setting_details.id)
    if not company_setting:
        raise HTTPException(status_code=404, detail="Label Setting Not Found")

    company_setting_details.updated_date = datetime.now(timezone.utc).replace(
        microsecond=0
    )
    return crud.company_setting_obj.update(
        db=db, db_obj=company_setting, obj_in=company_setting_details
    )


@router.get("/get_company_setting_by_id", response_model=schemas.CompanySettingRead)
def get_company_setting_by_id(
    company_setting_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    company_setting = crud.company_setting_obj.get_by_id(db, company_setting_id)
    if not company_setting:
        raise HTTPException(status_code=404, detail="No Label Setting Found")
    return company_setting


@router.get(
    "/get_company_setting_by_company_id", response_model=schemas.CompanySettingRead
)
def get_company_setting_by_company_id(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    company_setting = crud.company_setting_obj.get_by_company_id(
        db, current_user.company_id
    )
    if not company_setting:
        return HTTPException(status_code=404, detail="No Company Setting Data Found")
    return company_setting


@router.get(
    "/get_company_setting_by_camera_id", response_model=schemas.CompanySettingRead
)
def get_company_setting_by_camera_id(
    camera_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    company_setting = crud.company_setting_obj.get_by_camera_id(db, camera_id)
    if not company_setting:
        raise HTTPException(status_code=404, detail="No Label Setting Found")
    return company_setting
