from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


# Shared properties
class LocationBase(BaseModel):
    location_name: str
    # company_id: Optional[int]
    status: Optional[bool]


class LocationCreate(LocationBase):
    user_id: Optional[str]
    created_date: Optional[datetime]
    updated_date: Optional[datetime]


class LocationUpdate(LocationBase):
    id: int
    updated_date: Optional[datetime]


class LocationRead(LocationBase):
    id: int
    created_date: datetime
    updated_date: datetime

    class Config:
        orm_mode = True


class LocationNameRead(BaseModel):
    location_name: str

    class Config:
        orm_mode = True


class LocationStatus(BaseModel):
    id: int
    status: bool = True
    updated_date: Optional[datetime]


class CameraLocation(BaseModel):
    camera_name: str


class LocationCameraRead(BaseModel):
    cameras: List[CameraLocation]
