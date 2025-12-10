import datetime
import os
from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud
import models
import schemas
from api import deps
from core.aws_utils import create_collection

router = APIRouter()


@router.post("/add_company", response_model=schemas.CompanyRead)
def add_company(
    company_details: schemas.CompanyCreate,
    db: Session = Depends(deps.get_db),
) -> Any:
    company_details.created_date = datetime.datetime.now().replace(microsecond=0)
    company_details.updated_date = datetime.datetime.now().replace(microsecond=0)
    if isinstance(company_details, dict):
        obj_in = company_details
    else:
        obj_in = company_details.dict(exclude_unset=True)

    db_obj = crud.company_crud_obj.create(db=db, obj_in=obj_in)
    if not db_obj:
        raise HTTPException(status_code=500, detail="Data Not Added")
    if "prod" in os.getenv("MYSQL_DB_NAME"):
        collection = create_collection(db_obj.id)
        if not collection:
            raise HTTPException(status_code=500, detail="Collection Not Added")
    return db_obj


@router.post("/update_company", response_model=schemas.CompanyRead)
def update_company(
    company_details: schemas.CompanyUpdate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    db_obj = crud.company_crud_obj.get(db, company_details.id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Data Not Found")

    company_details.updated_date = datetime.datetime.now().replace(microsecond=0)
    return crud.device.update(db=db, db_obj=db_obj, obj_in=company_details)


@router.get("/get_company_by_id", response_model=schemas.CompanyRead)
def get_company_by_id(
    company_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    db_obj = crud.company_crud_obj.get_by_id(db, company_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="No Data Found")
    return db_obj


@router.get("/get_all_companies", response_model=List[schemas.CompanyRead])
def get_all_company(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    db_obj = crud.company_crud_obj.get_all(db)
    if not db_obj:
        raise HTTPException(status_code=404, detail="No Data Found")
    return db_obj
