from datetime import datetime, timezone
from typing import List, Optional

from sqlalchemy.orm import Session

from crud.base import CRUDBase
from models.location import Location, UserLocation
from models.user import User
from schemas.location import LocationCreate, LocationUpdate


class CRUDLocation(CRUDBase[Location, LocationCreate, LocationUpdate]):
    def get_by_id(self, db: Session, _id: int):
        return super().get(db, _id)

    def get_by_name(self, db: Session, *, name: str) -> Optional[Location]:
        return db.query(Location).filter(Location.location_name == name).first()

    def get_all_company_location(self, db: Session, company_id: int):
        return db.query(Location).filter(Location.company_id == company_id).all()

    def get_all_company_enabled_location(self, db: Session, company_id: int):
        return (
            db.query(Location)
            .filter(Location.company_id == company_id)
            .filter(Location.status == True)
            .all()
        )

    def get_total_enabled_locations_obj(self, db: Session, location_list: list):
        return (
            db.query(Location)
            .filter(Location.id.in_(location_list))
            .filter(Location.status == True)
            .all()
        )

    def get_user_by_id(self, db: Session, user_id: int) -> Optional[User]:
        return db.query(User).filter(User.id == user_id).first()

    def create(self, db: Session, user_id: int, *, obj_in: LocationCreate) -> Location:
        user_obj = self.get_user_by_id(db=db, user_id=user_id)
        db_obj = Location(
            location_name=obj_in.location_name,
            created_date=datetime.now(timezone.utc).replace(microsecond=0),
            updated_date=datetime.now(timezone.utc).replace(microsecond=0),
            status=True,
        )
        db_obj.location.append(user_obj)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_location_by_user_id(self, db: Session, user_id: int) -> List[Location]:
        return (
            db.query(Location)
            .join(
                UserLocation,
                Location.id == UserLocation.c.location_id,
            )
            .filter(UserLocation.c.user_id == user_id)
            .all()
        )


location_crud_obj = CRUDLocation(Location)
