from sqlalchemy import join, select
from sqlalchemy.orm import Session, joinedload

from crud.base import CRUDBase
from models.camera import CameraRTSP, CameraRTSPResultTypeMapping
from models.location import Location, UserLocation
from models.user import User
from schemas.camera import *


class CRUDCameraRTSP(CRUDBase[CameraRTSP, CameraRtspCreate, CameraRtspUpdate]):
    def get_by_id(self, db: Session, _id: int):
        return super().get(db, _id)

    def get_by_name(self, db: Session, *, name: str) -> Optional[CameraRTSP]:
        return (
            db.query(CameraRTSP)
            .filter(CameraRTSP.camera_name == name)
            .filter(CameraRTSP.deleted == False)
            .first()
        )

    def get_all_camera(self, db: Session):
        return db.query(CameraRTSP).filter(CameraRTSP.deleted == False).all()

    def get_cameras_rtsp_by_location(self, db: Session, location_id: int) -> object:
        return (
            db.query(CameraRTSP)
            .filter(CameraRTSP.location_id == location_id)
            .filter(CameraRTSP.deleted == 0)
            .all()
        )

    def get_location(self, db: Session, location_id: int):
        user = (
            db.query(CameraRTSP)
            .options(joinedload(CameraRTSP.locations))
            .filter(CameraRTSP.location_id == location_id)
            .filter(CameraRTSP.deleted == 0)
            .all()
        )
        return user

    def get_all_cameras_by_user_id(self, db: Session, user_id: int):
        return (
            db.query(CameraRTSP)
            .join(UserLocation, UserLocation.c.location_id == CameraRTSP.location_id)
            .join(Location, Location.id == UserLocation.c.location_id)
            .join(User, User.id == UserLocation.c.user_id)
            .filter(User.id == user_id)
            .all()
        )

    def get_by_name_for_update(
        self, db: Session, name: str, _id: int
    ) -> Optional[CameraRTSP]:
        return (
            db.query(CameraRTSP)
            .filter(CameraRTSP.camera_name == name)
            .filter(CameraRTSP.deleted == False)
            .filter(CameraRTSP.id != _id)
            .first()
        )

    def get_camera_result_mapping_value(
        self, db: Session, camera_id: int, result_type_id: int
    ):
        return (
            db.query(CameraRTSPResultTypeMapping)
            .filter(CameraRTSPResultTypeMapping.c.result_type_id == result_type_id)
            .filter(CameraRTSPResultTypeMapping.c.camera_rtsp_id == camera_id)
            .first()
        )

    def update_camera_result_mapping_roi_value(
        self, db: Session, camera_id: int, result_type_id: int, roi_list: list
    ):
        db.execute(
            CameraRTSPResultTypeMapping.update()
            .where(CameraRTSPResultTypeMapping.c.result_type_id == result_type_id)
            .where(CameraRTSPResultTypeMapping.c.camera_rtsp_id == camera_id)
            .values(roi=roi_list)
        )
        db.commit()

    def get_camera_result_mapping_roi_value(
        self, db: Session, camera_id: int, result_type_id: int
    ):
        return (
            db.query(CameraRTSPResultTypeMapping)
            .filter(CameraRTSPResultTypeMapping.c.result_type_id == result_type_id)
            .filter(CameraRTSPResultTypeMapping.c.camera_rtsp_id == camera_id)
            .first()
        )


camera_rtsp_crud_obj = CRUDCameraRTSP(CameraRTSP)
