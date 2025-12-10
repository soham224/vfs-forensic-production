# import logging
# from typing import Any, List
# from datetime import datetime, timezone
# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
#
# import crud
# import models
# import schemas
# from api import deps
#
# router = APIRouter()
#
#
# @router.post("/add_camera", response_model=schemas.CameraRead)
# def add_camera(
#     camera_details: schemas.CameraCreate,
#     db: Session = Depends(deps.get_db),
#     current_user: models.User = Depends(deps.get_current_active_admin),
# ) -> Any:
#     camera_details.status = True
#     camera_details.deleted = False
#     camera_details.created_date = (
#         datetime.now(timezone.utc).replace(microsecond=0).strftime("%Y-%m-%d %H:%M:%S")
#     )
#
#     camera_details.updated_date = (
#         datetime.now(timezone.utc).replace(microsecond=0).strftime("%Y-%m-%d %H:%M:%S")
#     )
#     if isinstance(camera_details, dict):
#         camera_details_obj = camera_details
#     else:
#         camera_details_obj = camera_details.dict(exclude_unset=True)
#
#     obj_out = crud.camera_crud_obj.create(db=db, obj_in=camera_details_obj)
#     if not obj_out:
#         raise HTTPException(status_code=500, detail="Device Not Added")
#     return obj_out
#
#
# @router.post("/update_camera", response_model=schemas.CameraRead)
# def update_camera(
#     camera_details: schemas.CameraUpdate,
#     db: Session = Depends(deps.get_db),
#     current_user: models.User = Depends(deps.get_current_active_user),
# ) -> Any:
#     camera_details.updated_date = (
#         datetime.now(timezone.utc).replace(microsecond=0).strftime("%Y-%m-%d %H:%M:%S")
#     )
#     db_obj = crud.camera_crud_obj.get(db, camera_details.id)
#     if not db_obj:
#         raise HTTPException(status_code=404, detail="Data Not Found")
#     camera = crud.camera_crud_obj.get_by_name(
#         db, name=camera_details.camera_name, company_id=current_user.company_id
#     )
#     if camera:
#         logging.warning("location name already taken")
#         raise HTTPException(
#             status_code=400,
#             detail="The location name already exists in the system.",
#         )
#     return crud.location_crud_obj.update(db=db, db_obj=db_obj, obj_in=camera_details)
#
#
# @router.post("/update_camera_status", response_model=schemas.CameraRead)
# def update_camera_status(
#     camera_details: schemas.CameraStatus,
#     db: Session = Depends(deps.get_db),
#     current_user: models.User = Depends(deps.get_current_active_user),
# ) -> Any:
#     camera_details.updated_date = (
#         datetime.now(timezone.utc).replace(microsecond=0).strftime("%Y-%m-%d %H:%M:%S")
#     )
#     db_obj = crud.camera_crud_obj.get_by_id(db, camera_details.id)
#     if not db_obj:
#         raise HTTPException(status_code=404, detail="Data Not Found")
#     return crud.camera_crud_obj.update(
#         db=db,
#         db_obj=db_obj,
#         obj_in={
#             "status": camera_details.status,
#             "updated_date": camera_details.updated_date,
#         },
#     )
#
#
# @router.get("/get_camera_by_id", response_model=schemas.CameraRead)
# def get_camera_by_id(
#     camera_id: int,
#     db: Session = Depends(deps.get_db),
#     current_user: models.User = Depends(deps.get_current_active_user),
# ) -> Any:
#     db_obj = crud.camera_crud_obj.get_by_id(db, camera_id)
#     if not db_obj:
#         raise HTTPException(status_code=404, detail="No Data Found")
#     return db_obj
#
#
# @router.get("/get_all_camera", response_model=List[schemas.CameraRead])
# def get_all_camera(
#     db: Session = Depends(deps.get_db),
#     current_user: models.User = Depends(deps.get_current_active_admin),
# ) -> Any:
#     db_obj = crud.camera_crud_obj.get_all_enabled_deleted(db)
#     print(db_obj)
#     if not db_obj:
#         raise HTTPException(status_code=404, detail="No Data Found")
#     return db_obj
#
#
# @router.get("/delete_camera", response_model=schemas.CameraRead)
# def delete_camera(
#     camera_id: int,
#     db: Session = Depends(deps.get_db),
#     current_user: models.User = Depends(deps.get_current_active_user),
# ) -> Any:
#     db_obj = crud.camera_crud_obj.get_by_id(db, camera_id)
#     if not db_obj:
#         raise HTTPException(status_code=404, detail="Data Not Found")
#     return crud.camera_crud_obj.update(db=db, db_obj=db_obj, obj_in={"deleted": True})
#
#
# @router.post("/get_cameras_by_location_id", response_model=List[schemas.CameraRead])
# def get_cameras_by_location_id(
#     location_ids: List[int],
#     db: Session = Depends(deps.get_db),
#     current_user: models.User = Depends(deps.get_current_active_user),
# ) -> Any:
#     db_objs = []
#     for location_id in location_ids:
#         db_objs.extend(crud.camera_crud_obj.get_cameras_by_location(db, location_id))
#     return db_objs
