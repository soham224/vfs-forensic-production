from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr

from .license import LicenseUserData
from .location import LocationCameraRead, LocationRead


# Role Schema
class RoleBase(BaseModel):
    role: str


class Role(RoleBase):
    id: int

    class Config:
        orm_mode = True


class CompanyBase(BaseModel):
    company_email: str
    company_name: str
    company_description: str
    company_address: str
    company_pin_code: str
    company_website: str
    company_contact: str
    company_poc: str
    company_poc_contact: str
    deployment_region: str


class CompanyCreate(CompanyBase):
    created_date: Optional[datetime]
    updated_date: Optional[datetime]
    company_status: bool = True


class CompanyUpdate(CompanyBase):
    id: int
    updated_date: Optional[datetime]


class CompanyRead(CompanyBase):
    id: int
    created_date: datetime
    updated_date: datetime

    class Config:
        orm_mode = True


# Shared properties
class UserBase(BaseModel):
    user_email: EmailStr
    user_status: bool = True


# Properties to receive via API on creation
class UserCreate(UserBase):
    license_key: str
    user_password: Optional[str]

    class Config:
        orm_mode = True


# Properties to receive via API on update
class UserUpdate(UserBase):
    password: Optional[str] = None


class UserForgotPassword(BaseModel):
    user_email: str
    license_key: str

    class Config:
        orm_mode = True


class UserInDBBase(UserBase):
    id: Optional[int] = None
    roles: List[Role] = []
    locations: List[LocationRead] = []

    class Config:
        orm_mode = True


# Additional properties to return via API
class User(UserInDBBase):
    user_password: str
    created_date: datetime
    updated_date: datetime


class UserForgotSchema(BaseModel):
    user_password: str

    class Config:
        orm_mode = True


# class User(BaseModel):
#     user_password: str
#     created_date: Optional[datetime]
#     licenses: List[LicenseUserData]
#     class Config:
#         orm_mode = True


class UserLicense(BaseModel):
    licenses: List[LicenseUserData]

    class Config:
        orm_mode = True


# Additional properties stored in DB
class UserInDB(UserInDBBase):
    hashed_password: str


class UserLocation(BaseModel):
    locations: List[LocationCameraRead]

    class Config:
        orm_mode = True
