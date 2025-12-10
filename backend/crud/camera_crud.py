# from sqlalchemy.orm import Session
# from crud.base import CRUDBase
# from models.camera import Camera
# from models.location import Location
# from typing import Optional
# from schemas.camera import *
# from sqlalchemy.orm import Session, joinedload
#
#
# class CRUDCamera(CRUDBase[Camera, CameraCreate, CameraUpdate]):
#     def get_by_id(self, db: Session, _id: int):
#         return super().get(db, _id)
#
#     def get_by_name(
#         self, db: Session, *, name: str, company_id: int
#     ) -> Optional[Camera]:
#         return (
#             db.query(Camera)
#             .filter(Camera.camera_name == name)
#             .filter(Camera.deleted == False)
#             .first()
#         )
#
#     def get_all_camera(self, db: Session):
#         return db.query(Camera).filter(Camera.deleted == False).all()
#
#     def get_cameras_by_location(self, db: Session, location_id: int) -> object:
#         return (
#             db.query(Camera)
#             .filter(Camera.location_id == location_id)
#             .filter(Camera.deleted == 0)
#             .all()
#         )
#
#     def get_location(self, db: Session, location_id: int):
#         user = (
#             db.query(Camera)
#             .options(joinedload(Camera.locations))
#             .filter(Camera.location_id == location_id)
#             .filter(Camera.deleted == 0)
#             .all()
#         )
#         return user
#
#
# camera_crud_obj = CRUDCamera(Camera)
