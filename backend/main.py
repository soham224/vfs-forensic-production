from fastapi import FastAPI
from fastapi_pagination import add_pagination
from starlette.middleware.cors import CORSMiddleware

from api.api_v1.api import api_router
from applogging.applogger import read_logging_config, setup_logging
from core.config import settings
from db import init_db

app = FastAPI(
    title=settings.PROJECT_NAME, openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

log_config_dict = read_logging_config("log_config.yml")
setup_logging(log_config_dict)

# if "prod" in os.getenv("MYSQL_DB_NAME"):
#     custom_schedule()

add_pagination(app)

# Run the File
#

import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "main:app",  # "filename:app_instance"
        host="0.0.0.0",  # Or "127.0.0.1" for localhost only
        port=8004,  # Port number
        reload=True,  # Auto-reload on code changes (for development)
    )
