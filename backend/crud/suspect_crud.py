from typing import Optional

from sqlalchemy.orm import Session

from crud.base import CRUDBase
from models.suspect import Suspect
from schemas.suspect import *


class CRUDSuspect(CRUDBase[Suspect, SuspectCreate, SuspectUpdate]):
    def get_by_id(self, db: Session, _id: int):
        return super().get(db, _id)

    def get_suspects_by_id(self, db: Session, case_id: int) -> Optional[Suspect]:
        return (
            db.query(Suspect)
            .filter(Suspect.case_id == case_id)
            .filter(Suspect.deleted == False)
            .all()
        )

    def get_by_name(
        self, db: Session, *, name: str, company_id: int
    ) -> Optional[Suspect]:
        return (
            db.query(Suspect)
            .filter(Suspect.suspect_name == name)
            .filter(Suspect.deleted == False)
            .first()
        )

    def get_all_suspect(self, db: Session):
        return db.query(Suspect).filter(Suspect.deleted == False).all()


suspect_crud_obj = CRUDSuspect(Suspect)
