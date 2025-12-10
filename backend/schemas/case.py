from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel

from enums.case_status_enum import CaseStatusEnum, CaseReportEnum

from .camera import CameraRtspRead
from .suspect import SuspectRead


# Shared properties


class CameraLocation(BaseModel):
    location_name: str

    class Config:
        orm_mode = True


class CameraRTSPInCase(BaseModel):
    camera_name: str
    location: CameraLocation

    # locationss: CameraLocation

    class Config:
        orm_mode = True


class SuspectCase(BaseModel):
    suspect_image_url: str
    suspect_name: str

    class Config:
        orm_mode = True


class CaseCreate(BaseModel):
    case_id: Optional[str]
    case_name: str
    camera_ids: List[int] = []
    video_ids: List[int] = []
    case_description: Optional[str] = None
    case_status: Optional[str] = None
    case_report: Optional[str] = None
    created_date: Optional[datetime]
    updated_date: Optional[datetime]
    status: Optional[bool]
    deleted: Optional[bool]

    class Config:
        orm_mode = True


class CaseRead(BaseModel):
    id: int
    cameras_rtsp: Optional[List[CameraRTSPInCase]]
    suspects: Optional[List[SuspectCase]]
    case_id: Optional[str]
    case_name: str
    case_description: Optional[str] = None
    case_status: str
    case_report: Optional[str] = None
    created_date: Optional[datetime]
    updated_date: Optional[datetime]
    status: Optional[bool]
    deleted: Optional[bool]
    # Optional list of video file names associated with the case (if videos were attached)
    video_names: Optional[List[str]] = None

    class Config:
        orm_mode = True


class PaginationMeta(BaseModel):
    total_page: int
    next_page: Optional[int]
    pre_page: Optional[int]
    page_size: int
    total_count: int


class PaginatedResultsSchema(BaseModel):
    results: List[CaseRead]
    pagination: PaginationMeta


class CaseRequestSchema(BaseModel):
    page_number: int = 1  # Default page number
    page_size: int = 10  # Default page size
    case_name: Optional[str] = ""  # Optional search term; empty means no filter


class CaseBase(BaseModel):
    case_name: str
    case_status: str
    case_report: Optional[str]
    case_description: str
    status: Optional[bool] = True
    deleted: Optional[bool] = False


# class CaseCreate(CaseBase):
#     case_id: Optional[str]
#     camera_ids: List[int]
#     created_date: Optional[datetime]
#     updated_date: Optional[datetime]
#
#
class CaseUpdate(CaseBase):
    id: int
    camera_ids: Optional[List[int]] = None
    updated_date: Optional[datetime]


class CaseAIDetails(BaseModel):
    case_id: int
    cameras_rtsp: Optional[List[CameraRTSPInCase]]


#
#
# class CaseRead(CaseBase):
#     id: int
#     case_id: str
#     suspects: List[SuspectRead] = []
#     cameras_rtsp: List[CameraRtspRead] = []
#     created_date: datetime
#     updated_date: datetime
#
#     class Config:
#         orm_mode = True


class CaseNameRead(BaseModel):
    case_name: str

    class Config:
        orm_mode = True


class CaseStatus(BaseModel):
    id: int
    status: bool = True
    updated_date: Optional[datetime]


class PaginatedCaseRead(BaseModel):
    page: int
    page_size: int
    total: int
    items: List[CaseRead]

    class Config:
        orm_mode = True


class UpdateCaseStatusRequest(BaseModel):
    id: int
    case_status: CaseStatusEnum


class UpdateCaseStatusResponse(BaseModel):
    id: int
    case_id: str
    case_name: str
    case_status: str
    updated_date: datetime


class UpdateCaseReportRequest(BaseModel):
    case_id: int
    case_report: CaseReportEnum


# Response schema for successful status update
class UpdateCaseReportResponse(BaseModel):
    id: int
    case_id: str
    case_name: str
    case_report: str
    updated_date: datetime


class CaseStatusCountRequest(BaseModel):
    case_status: str = ""
    start_date: datetime
    end_date: datetime


class GraphCaseRequestSchema(BaseModel):
    start_date: datetime = None
    end_date: datetime = None
    duration_type: str = None
    time_zone: str = None
    get_id: bool = False


class CameraDetailsResponse(BaseModel):
    camera_id: int
    camera_name: str
    file_url: str
    bounding_box: dict  # Assuming the bounding box is a JSON object
    frame_time: str


class SuspectJourneyResponse(BaseModel):
    suspect_name: str
    camera_details: CameraDetailsResponse
    case_id: int


class CameraRTSPResponse(BaseModel):
    id: int

    class Config:
        orm_mode = True


class SuspectCaseRead(BaseModel):
    suspect_id: int
    suspect_image_url: str
    suspect_name: str

    class Config:
        orm_mode = True


class CaseSuspectRequest(BaseModel):
    case_ids: int


class CaseResponse(BaseModel):
    id: int
    case_id: str
    case_name: str
    case_status: str
    suspects: List[SuspectCaseRead]
    cameras_rtsp: List[CameraRTSPResponse]

    class Config:
        orm_mode = True
