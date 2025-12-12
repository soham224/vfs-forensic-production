import logging

from fastapi import FastAPI
from fastapi_pagination import add_pagination
from starlette.middleware.cors import CORSMiddleware
import uvicorn

from api.api_v1.api import api_router
from applogging.applogger import read_logging_config, setup_logging
from core.config import settings
from core.db_init_utils import initialize_database
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

# Try to initialize database with data from dump file if tables are empty
try:
    initialize_database()
except Exception as e:
    logger = logging.getLogger(__name__)
    logger.warning(f"Database initialization skipped due to: {str(e)}")
    logger.info("API will continue to start without database initialization.")

# if "prod" in os.getenv("MYSQL_DB_NAME"):
#     custom_schedule()

add_pagination(app)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8004, reload=False)
