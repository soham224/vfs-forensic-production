from sqlalchemy.orm import Session
from crud.base import CRUDBase
from models.result_type import ResultType
from schemas.result import ResultCreate, ResultUpdate


class CRUDResultType(CRUDBase[ResultType, ResultType, ResultType]):
    def get_by_id(self, db: Session, _id: int):
        return super().get(db, _id)

    def get_by_id_list(self, db: Session, id_list: list):
        return db.query(ResultType).filter(ResultType.id.in_(id_list)).all()

    def get_by_roi_result(self, db: Session):
        return db.query(ResultType).filter(ResultType.roi_status == True).all()


result_type_crud_obj = CRUDResultType(ResultType)
