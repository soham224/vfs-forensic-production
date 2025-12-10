from sqlalchemy.orm import Session

from crud.base import CRUDBase
from models.company_setting import CompanySetting
from schemas.company_setting import *


class CRUDCompanySetting(
    CRUDBase[CompanySetting, CompanySettingCreate, CompanySettingUpdate]
):
    def get_by_id(self, db: Session, _id: int):
        return super().get(db, _id)

    def get_by_company_id(self, db: Session, company_id: int):
        if (
            len(
                db.query(CompanySetting)
                .filter(CompanySetting.company_id == company_id)
                .all()
            )
            > 0
        ):
            return (
                db.query(CompanySetting)
                .filter(CompanySetting.company_id == company_id)
                .one()
            )

    def get_by_camera_id(self, db: Session, camera_id: int):
        if (
            len(
                db.query(CompanySetting)
                .filter(CompanySetting.camera_id == camera_id)
                .all()
            )
            > 0
        ):
            return (
                db.query(CompanySetting)
                .filter(CompanySetting.camera_id == camera_id)
                .one()
            )


company_setting_obj = CRUDCompanySetting(CompanySetting)
