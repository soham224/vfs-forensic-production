from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel

from .limit import LimitRead


class LicenseBase(BaseModel):
    license_key: str
    key_status: str
    status: bool
    start_date: datetime
    expiry_date: datetime
    created_date: datetime
    updated_date: datetime
    deleted: bool

    class Config:
        orm_mode = True


class LicenseUserData(BaseModel):
    key_status: str
    expiry_date: datetime
    license_key: str
    limits: LimitRead

    class Config:
        orm_mode = True


class LicenseCreateResponse(BaseModel):
    license_id: int
    license_key: str  # plain text to share with the user
    key_status: str

    class Config:
        orm_mode = True
