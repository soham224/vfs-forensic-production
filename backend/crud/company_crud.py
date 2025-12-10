from sqlalchemy.orm import Session

from crud.base import CRUDBase
from models.user import Company
from schemas.user import *


class CRUDCompany(CRUDBase[Company, CompanyCreate, CompanyUpdate]):
    def get_by_id(self, db: Session, _id: int):
        return super().get(db, _id)


company_crud_obj = CRUDCompany(Company)
