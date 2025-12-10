from fastapi import APIRouter

from api.api_v1.endpoints import (
    camera_api,
    camera_rtsp_api,
    case_api,
    company_api,
    company_setting_api,
    limit_api,
    location_api,
    login,
    license_api,
    result_api,
    suspect_api,
    users,
    result_type_api,
)
from models import Suspect

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(company_api.router, tags=["company management"])
api_router.include_router(location_api.router, tags=["location"])
api_router.include_router(users.router, tags=["users"])
# api_router.include_router(notification_api.router, tags=["Notification"])
api_router.include_router(company_setting_api.router, tags=["Company Setting"])
api_router.include_router(case_api.router, tags=["Case"])
api_router.include_router(suspect_api.router, tags=["Suspect"])
api_router.include_router(result_type_api.router, tags=["Result Type"])
api_router.include_router(result_api.router, tags=["Result"])
api_router.include_router(limit_api.router, tags=["Limit"])
api_router.include_router(license_api.router, tags=["License"])

api_router.include_router(camera_rtsp_api.router, tags=["Camera RTSP"])
