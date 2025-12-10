from datetime import datetime
from typing import Optional

from pydantic import BaseModel


# Shared properties
class CompanySettingBase(BaseModel):
    start_time: str
    end_time: str
    buffer_time: str
    camera_id: int
    company_id: int
    is_used_camera: bool
    status: bool


class CompanySettingCreate(CompanySettingBase):
    created_date: Optional[datetime] = None
    updated_date: Optional[datetime] = None
    status: bool = True


class CompanySettingUpdate(CompanySettingBase):
    id: int
    updated_date: Optional[datetime]


class CompanySettingRead(CompanySettingBase):
    id: int
    created_date: datetime
    updated_date: datetime

    class Config:
        orm_mode = True
