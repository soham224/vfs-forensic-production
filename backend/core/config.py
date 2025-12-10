import json
import os
import secrets
from typing import List, Optional

from pydantic import AnyHttpUrl, BaseSettings, HttpUrl


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    # 60 minutes * 24 hours * 8 days = 8 days
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 8 * 1
    SERVER_NAME: str = "server"
    SERVER_HOST: AnyHttpUrl = "http://localhost"

    PROJECT_NAME: str = "Auto Serving REST"

    MODEL_TEST_USER_CREDIT: int = 100

    SUPER_ADMIN_MAIL_LIST: list = ["mihir.softvan@gmail.com"]

    # Rekognition
    GENERIC_COLLECTION_NAME = "tusker-fr-coll"
    FACES_STORE_BUCKET = ""

    MYSQL_HOSTNAME = os.environ["MYSQL_HOSTNAME"]
    MYSQL_USERNAME = os.environ["MYSQL_USERNAME"]
    MYSQL_PASS = os.environ["MYSQL_PASS"]
    MYSQL_PORT: int = os.environ["MYSQL_PORT"]
    MYSQL_DB_NAME = os.environ["MYSQL_DB_NAME"]
    MYSQL_POOL_SIZE = int(os.environ["MYSQL_POOL_SIZE"])
    MYSQL_MAX_OVERFLOW = int(os.environ["MYSQL_MAX_OVERFLOW"])
    MYSQL_POOL_TIMEOUT = int(os.environ["MYSQL_POOL_TIMEOUT"])
    MYSQL_POOL_PRE_PING = os.environ["MYSQL_POOL_PRE_PING"]

    ROI_API_ENDPOINT = os.environ["ROI_API_ENDPOINT"]
    MODEL_TEST_API_URL: str = (
        "https://k9hyxica2b.execute-api.ap-south-1.amazonaws.com/prod/infer"
    )

    TEST_IMG_STORAGE_BUCKET: str = "tusker-testing-images-storage"
    MODEL_STORAGE_BUCKET: str = "tusker-model-storage"

    AWS_DEFAULT_REGION = "ap-south-1"
    DEFAULT_IMG_SIZE = "640"
    DEFAULT_CONF = "0.3"
    DEFAULT_IOU = "0.5"

    FRAME_EXTRACTOR_URI = (
        "437476783934.dkr.ecr.ap-south-1.amazonaws.com/tusker-rtsp-handler:latest"
    )
    FUNCTION_DEPLOY_URI = (
        "437476783934.dkr.ecr.ap-south-1.amazonaws.com/gen-model-deploy:latest"
    )

    API_EXAMPLE_URL = ""
    FRAME_GENERATOR_URI = ""
    ATTENDANCE_REPORT_URI = ""
    VIOLATION_REPORT_URI = ""

    TD_TASK_ROLE_ARN = "arn:aws:iam::437476783934:role/ecs-tasks-s3"
    TD_EXECUTION_ROLE_ARN = "arn:aws:iam::437476783934:role/ecsTaskExecutionRole"
    FUNCTION_DEPLOY_ROLE_ARN = "arn:aws:iam::437476783934:role/lambda-s3-access"

    ECS_SERVICE_SG = ["sg-008d9a78f8be2117c"]
    ECS_SERVICE_SUBNETS = ["subnet-079b22bc794e5f76e", "subnet-0740c3c7d9577b589"]
    NOTIFICATION_SEND_PASS = "ufqrxlfacxbaxgdx"
    NOTIFICATION_SEND_EMAIL = "tuskerai.noreply@gmail.com"

    LOGO_VIDEO_TABLE = "tusker-logo-detection"

    LOGO_MODEL_TABLE = "tusker-logo-model-details"

    LOGO_DETECTION_STORAGE_BUCKET = "tusker-img-storage-logo-detection"

    USER_ID_CV2 = json.loads(os.environ["USER_ID_CV2"])
    BASE_DIR = os.environ["BASE_DIR"]
    CHECK_RTSP_DATA = os.environ["CHECK_RTSP_DATA"]
    LICENSE_SECRET_KEY = os.environ["LICENSE_SECRET_KEY"]
    TOTAL_CHAIRS_COUNT = json.loads(os.environ["TOTAL_CHAIRS_COUNT"])
    SUSPECT_DETAILS_API = os.environ["SUSPECT_DETAILS_API"]
    LOCAL_VIDEOS_PATH = os.environ["LOCAL_VIDEOS_PATH"]
    LOCAL_IP_URL = os.environ["LOCAL_IP_URL"]
    LOCAL_NGINX_PATH = os.environ["LOCAL_NGINX_PATH"]
    SUSPECT_IMG_DIR = os.environ["SUSPECT_IMG_DIR"]

    class Config:
        case_sensitive = True


settings = Settings()
