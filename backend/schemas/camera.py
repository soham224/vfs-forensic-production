from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel

from .location import LocationRead


# Shared properties
class CameraBase(BaseModel):
    camera_name: str
    nvr_id: str
    status: bool = True
    deleted: bool = False
    # location_id: int


class CameraCreate(CameraBase):
    location_id: int
    created_date: Optional[datetime] = None
    updated_date: Optional[datetime] = None


class CameraUpdate(CameraBase):
    id: int
    location_id: int
    updated_date: Optional[datetime]


class CameraRead(CameraBase):
    id: int
    created_date: datetime
    updated_date: datetime
    # location_id: int
    locations: LocationRead

    class Config:
        orm_mode = True


class CameraStatus(BaseModel):
    id: int
    status: bool = True
    updated_date: Optional[datetime]


class CameraRtspBase(BaseModel):
    camera_name: str
    status: bool = True
    deleted: bool = False
    rtsp_url: str
    camera_name: str
    camera_resolution: str
    process_fps: int
    location_id: int
    camera_ip: Optional[str]
    is_active: bool
    is_processing: bool
    is_tcp: Optional[bool]

    class Config:
        orm_mode = True


class CameraRtspCreate(CameraRtspBase):
    created_date: Optional[datetime] = None
    updated_date: Optional[datetime] = None
    roi_type: Optional[bool]
    roi_url: Optional[str]
    status: bool = True
    location_id: int
    # result_types: List[int] = []


class CameraRtspUpdate(CameraRtspBase):
    id: int
    updated_date: Optional[datetime]
    # result_types: List[int] = []


class CameraRtspResultTypeUpdate(BaseModel):
    id: int
    result_types: List[int] = []


class ResultTypeRead(BaseModel):
    id: int
    result_type: str

    class Config:
        orm_mode = True


class CameraRtspRead(CameraRtspBase):
    id: int
    roi_type: Optional[bool]
    roi_url: Optional[str]
    created_date: datetime
    updated_date: datetime
    location: LocationRead
    result_types: List[ResultTypeRead]

    class Config:
        orm_mode = True


class CameraRtspStatus(BaseModel):
    id: int
    status: bool = True
    updated_date: Optional[datetime]


class LocationID(BaseModel):
    location_id: List[int]


class CameraRoiGet(BaseModel):
    camera_id: int
    result_type_id: int


class CameraRoiUpdate(CameraRoiGet):
    roi_list: list
