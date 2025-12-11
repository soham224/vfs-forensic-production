import os
import urllib.parse
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
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

# Database connection URL
encoded_password = urllib.parse.quote_plus(MYSQL_PASS)
SQLALCHEMY_DATABASE_URL = f"mysql+mysqlconnector://{MYSQL_USER}:{encoded_password}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB_NAME}"

# Create engine
engine = create_engine(SQLALCHEMY_DATABASE_URL, pool_pre_ping=True)

# Create session factory
SessionLocal = scoped_session(
    sessionmaker(autocommit=False, autoflush=False, bind=engine)
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# NGINX and path configs
NGINX_BASE_URL = os.getenv("NGINX_BASE_URL")
NGINX_INTERNAL_PATH = os.getenv("NGINX_INTERNAL_PATH")
CLIENT_VIDEO_DIR = os.getenv("CLIENT_VIDEO_DIR")
INTERNAL_VIDEO_FOLDER_PATH = os.getenv("INTERNAL_VIDEO_FOLDER_PATH")
NGINX_SERVE_DIRECTORY = os.getenv("NGINX_SERVE_DIRECTORY")

# Ensure internal video directory exists
if INTERNAL_VIDEO_FOLDER_PATH and not os.path.exists(INTERNAL_VIDEO_FOLDER_PATH):
    os.makedirs(INTERNAL_VIDEO_FOLDER_PATH, exist_ok=True)
    logger.info(f"Created internal video directory: {INTERNAL_VIDEO_FOLDER_PATH}")

logger.info(f"Client video directory: {CLIENT_VIDEO_DIR}")
logger.info(f"Internal video directory: {INTERNAL_VIDEO_FOLDER_PATH}")

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
