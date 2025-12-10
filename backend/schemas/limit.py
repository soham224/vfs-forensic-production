from datetime import datetime
from typing import Optional

from pydantic import BaseModel


# Shared properties
class LimitBase(BaseModel):
    type: Optional[str] = None
    subtype: Optional[str] = None
    current_limit: int
    status: Optional[bool] = True
    deleted: Optional[bool] = False


class LimitCreate(LimitBase):
    created_date: Optional[datetime]
    updated_date: Optional[datetime]


class LimitRead(LimitBase):
    id: int
    created_date: datetime
    updated_date: datetime

    class Config:
        orm_mode = True


class LimitUpdate(LimitBase):
    id: int
    current_limit: int
    updated_date: Optional[datetime]
