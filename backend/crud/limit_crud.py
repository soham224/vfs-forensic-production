from typing import Optional

from sqlalchemy.orm import Session

from crud.base import CRUDBase
from models.limit import Limit
from schemas.limit import *


class CRUDLimit(CRUDBase[Limit, LimitCreate, LimitUpdate]):
    def get_by_id(self, db: Session, _id: int):
        return super().get(db, _id)

    def get_by_type(self, db: Session, *, type: str, subtype: str) -> Optional[Limit]:
        return (
            db.query(Limit)
            .filter(Limit.type == type)
            .filter(Limit.subtype == subtype)
            .filter(Limit.deleted == False)
            .first()
        )

    def get_all_limit(self, db: Session):
        return db.query(Limit).filter(Limit.deleted == False).all()


limit_crud_obj = CRUDLimit(Limit)
