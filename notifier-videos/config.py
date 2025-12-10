import os
from logger_config import setup_logger

logger = setup_logger()

# Logger base directory
LOG_BASE_DIRECTORY = os.getenv("LOG_BASE_DIRECTORY")

# MySQL DB configs
MYSQL_USER = os.getenv("MYSQL_USER")
MYSQL_PASS = os.getenv("MYSQL_PASS")
MYSQL_HOST = os.getenv("MYSQL_HOST")
MYSQL_PORT = os.getenv("MYSQL_PORT")
MYSQL_DB_NAME = os.getenv("MYSQL_DB_NAME")

logger.info(f"Using DB: {MYSQL_USER}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB_NAME}")

# NGINX and path configs
NGINX_BASE_URL = os.getenv("NGINX_BASE_URL")
NGINX_INTERNAL_PATH = os.getenv("NGINX_INTERNAL_PATH")
CLIENT_VIDEO_DIR = os.getenv("CLIENT_VIDEO_DIR")
NGINX_SERVE_DIRECTORY = os.getenv("NGINX_SERVE_DIRECTORY")

# Extract relative path from the full internal path
BASE_PATH = os.getenv("BASE_PATH")
path_for_url = NGINX_INTERNAL_PATH or NGINX_SERVE_DIRECTORY

if not NGINX_BASE_URL or not BASE_PATH or not path_for_url:
    missing = []
    if not NGINX_BASE_URL:
        missing.append("NGINX_BASE_URL")
    if not BASE_PATH:
        missing.append("BASE_PATH")
    if not path_for_url:
        missing.append("NGINX_INTERNAL_PATH or NGINX_SERVE_DIRECTORY")
    raise EnvironmentError(
        f"Missing required environment variables for URL construction: {', '.join(missing)}"
    )

# Normalize and compute relative path safely
relative_path = os.path.relpath(path_for_url, start=BASE_PATH)
relative_path = relative_path.replace("\\", "/").lstrip("/")

# Construct the final URL prefix (optional helper)
NGINX_URL_PREFIX = f"{NGINX_BASE_URL.rstrip('/')}/{relative_path}"
logger.info(f"Using NGINX_URL_PREFIX: {NGINX_URL_PREFIX}")

# HOST_BASE_PATH = os.getenv("HOST_BASE_PATH", "/home/dev1079")
FOLDER_POLL_INTERVAL = int(
    os.getenv("FOLDER_POLL_INTERVAL", 5)
)  # default = 5s if not set

STORAGE_PC_VIDEO_DIR = os.getenv("STORAGE_PC_VIDEO_DIR")  # optional in no-copy mode
STORAGE_PC_BASE_URL = os.getenv("STORAGE_PC_BASE_URL")  # optional in no-copy mode
