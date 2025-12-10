from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import crud
import models
import schemas
from api import deps

router = APIRouter()


@router.get("/get_result_type", response_model=List[schemas.ResultTypeBaseSchema])
def get_result_type(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
):
    return crud.result_type_crud_obj.get_by_roi_result(db)
