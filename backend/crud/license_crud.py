from typing import Optional

from sqlalchemy.orm import Session

from crud.base import CRUDBase
from models.license import License, LicenseLimitUser
from schemas.license import *


class CRUDLicense(CRUDBase[License, LicenseBase, LicenseBase]):
    def get_by_id(self, db: Session, _id: int):
        return super().get(db, _id)

    def get_by_key_status(self, db: Session) -> Optional[License]:
        return db.query(License).all()


class CRUDLicenseLimitUser:
    def create(self, db: Session, *, obj_in: dict) -> LicenseLimitUser:
        db_obj = LicenseLimitUser(
            user_id=obj_in.get("user_id"),
            license_id=obj_in.get("license_id"),
            limit_id=obj_in.get("limit_id"),
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


license_limit_user_crud_obj = CRUDLicenseLimitUser()
license_crud_obj = CRUDLicense(License)
