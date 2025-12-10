import os
import urllib.parse
from logger_config import setup_logger
from datetime import datetime
import urllib.parse
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, scoped_session
from config import *

logger = setup_logger()


# Path mapping: Convert /app/... to /home/dev1079/...
def convert_container_path_to_host(container_path):
    """
    Converts a container path like /app/videos_to_process/... to its host equivalent.
    """
    # try:
    #     if container_path.startswith(CONTAINER_CLIENT_VIDEO_DIR):
    #         return container_path.replace(
    #             CONTAINER_CLIENT_VIDEO_DIR, HOST_CLIENT_VIDEO_DIR, 1
    #         )
    #     elif container_path.startswith(CONTAINER_NGINX_INTERNAL_PATH):
    #         return container_path.replace(
    #             CONTAINER_NGINX_INTERNAL_PATH, HOST_NGINX_INTERNAL_PATH, 1
    #         )
    #     return container_path
    # except Exception as e:
    #     logger.error(f"Failed to convert container path to host: {e}", exc_info=True)
    #     return None


try:
    encoded_password = urllib.parse.quote_plus(MYSQL_PASS)
    SQLALCHEMY_DATABASE_URL = f"mysql+mysqlconnector://{MYSQL_USER}:{encoded_password}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB_NAME}"
    logger.debug(f"SQLALCHEMY_DATABASE_URL: {SQLALCHEMY_DATABASE_URL}")
    engine = create_engine(SQLALCHEMY_DATABASE_URL, pool_pre_ping=True)
    SessionLocal = scoped_session(
        sessionmaker(autocommit=False, autoflush=False, bind=engine)
    )

    logger.debug("Global SQLAlchemy engine and session created.")

except Exception as e:
    logger.critical(f"Failed to initialize DB engine: {e}", exc_info=True)
    raise


def get_db_session():
    """Return a scoped DB session."""
    try:
        return SessionLocal()
    except Exception as e:
        logger.error(f"Failed to get DB session: {e}", exc_info=True)
        raise


def copy_and_log_video(file_path):
    try:
        filename = os.path.basename(file_path)
        destination_path = file_path

        # Build URL based on BASE_PATH and NGINX_BASE_URL
        try:
            # Only construct URL if file resides under BASE_PATH to avoid broken URLs
            common = os.path.commonpath([os.path.abspath(destination_path), os.path.abspath(BASE_PATH)])
            if common == os.path.abspath(BASE_PATH):
                rel_from_base = os.path.relpath(destination_path, start=BASE_PATH)
                rel_from_base = rel_from_base.replace("\\", "/").lstrip("/")
                video_url = f"{NGINX_BASE_URL.rstrip('/')}/{rel_from_base}"
            else:
                logger.warning(
                    f"File path {destination_path} is outside BASE_PATH {BASE_PATH}; storing empty des_url"
                )
                video_url = ""
        except Exception as e:
            logger.error(f"Failed to construct URL for {destination_path}: {e}")
            video_url = ""

        now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        session = get_db_session()

        query = text(
            """
            INSERT INTO videos (main_dir, des_video_path, status, created_date, des_url)
            VALUES (:main_dir, :des_video_path, :status, :create_date, :des_url)
            """
        )

        session.execute(
            query,
            {
                "main_dir": os.path.dirname(file_path),
                "des_video_path": destination_path,
                "status": 1,
                "create_date": now_str,
                "des_url": video_url,
            },
        )

        session.commit()
        logger.info(f"Registered video in DB (no copy): {filename}")

    except Exception as e:
        logger.error(f"Failed to register/log video {file_path}: {e}")
