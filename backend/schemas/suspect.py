from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class SuspectBase(BaseModel):
    suspect_name: str
    status: Optional[bool] = True
    deleted: Optional[bool] = False


class SuspectCreate(SuspectBase):
    case_id: int
    suspect_image_path: str
    suspect_image_url: str
    created_date: Optional[datetime] = None
    updated_date: Optional[datetime] = None


class SuspectUpdate(SuspectBase):
    id: int
    location_id: int
    updated_date: Optional[datetime]


class SuspectRead(SuspectBase):
    id: int
    suspect_image_path: str
    suspect_image_url: str
    created_date: datetime
    updated_date: datetime
    case_id: int

    class Config:
        orm_mode = True


class SuspectStatus(BaseModel):
    id: int
    status: bool = True
    updated_date: Optional[datetime]


class SuspectName(BaseModel):
    id: int
    suspect_name: str

    class Config:
        orm_mode = True


class SuspectDetailsResponse(BaseModel):
    suspect_id: int
    suspect_name: str
    case_id: int
    camera_rtsp_ids: List[int]
