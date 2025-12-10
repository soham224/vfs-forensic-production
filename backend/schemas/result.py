from datetime import datetime
from typing import Dict, List, Optional

from pydantic import BaseModel


class SuspectSchema(BaseModel):
    id: int
    name: str


class ResultTypeSchema(BaseModel):
    id: int
    result_type: str

    class Config:
        orm_mode = True


class LocationSchema(BaseModel):
    location_name: str

    class Config:
        orm_mode = True


class CameraRTSPSchema(BaseModel):
    camera_name: str
    location: LocationSchema

    class Config:
        orm_mode = True


# Shared properties
class ResultBase(BaseModel):
    file_name: str
    file_path: str
    file_url: str
    bounding_box: dict
    suspect_id: Optional[int]
    status: Optional[bool] = True
    deleted: Optional[bool] = False
    label: dict
    label_count: dict
    camera_id: Optional[int] = None
    video_id: Optional[int] = None

    class Config:
        orm_mode = True


class ResultCreate(ResultBase):
    frame_time: datetime
    result_type_id: int
    created_date: Optional[datetime]
    updated_date: Optional[datetime]


class ResultUpdate(ResultBase):
    id: int
    updated_date: Optional[datetime]


class ResultRead(ResultBase):
    id: int
    created_date: datetime
    updated_date: datetime

    class Config:
        orm_mode = True


class ResultNameRead(BaseModel):
    result_name: str

    class Config:
        orm_mode = True


class ResultStatus(BaseModel):
    id: int
    status: bool = True
    updated_date: Optional[datetime]


class ResultRequestSchema(BaseModel):
    page_number: int = 1  # Default page number
    page_size: int = 10  # Default page size
    location_id: Optional[List[int]] = None
    camera_id: Optional[List[int]] = None
    result_type: Optional[int] = None
    start_datetime: Optional[datetime] = None
    end_datetime: Optional[datetime] = None


class ResultResponseSchema(BaseModel):
    id: int
    file_name: str
    file_path: str
    file_url: str
    bounding_box: dict
    frame_time: datetime
    created_date: datetime
    updated_date: datetime
    status: bool
    deleted: bool
    label: dict
    label_count: dict
    suspect: Optional[SuspectSchema]
    result_type: Optional[ResultTypeSchema]
    cameras_rtsp: Optional[CameraRTSPSchema]

    class Config:
        orm_mode = True


class PaginationMeta(BaseModel):
    total_page: int
    next_page: Optional[int] = None
    pre_page: Optional[int] = None
    page_size: int
    total_count: int


class PaginatedResultsSchema(BaseModel):
    results: List[ResultResponseSchema]
    pagination: PaginationMeta


# Response schema


class ResultTypeCountRequest(BaseModel):
    start_date: datetime
    end_date: datetime


class ResultTypeCountResponse(BaseModel):
    result_type_counts: List[Dict[str, int]]


class GraphResultRequestSchema(BaseModel):
    start_date: datetime = None
    end_date: datetime = None
    label: list = None
    duration_type: str = None
    time_zone: str = None
    get_id: bool = False


class ChairOccupancyRequest(BaseModel):
    start_date: datetime
    end_date: datetime


class ChairOccupancyResponse(BaseModel):
    name: str
    y: float
