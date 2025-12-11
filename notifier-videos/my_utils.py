import os

import shutil
import subprocess
from datetime import datetime
from sqlalchemy import text
from config import logger, INTERNAL_VIDEO_FOLDER_PATH, NGINX_BASE_URL, BASE_PATH, SessionLocal



def get_db_session():
    """Return a scoped DB session."""
    try:
        return SessionLocal()
    except Exception as e:
        logger.error(f"Failed to get DB session: {e}", exc_info=True)
        raise


def convert_to_mp4(input_path, output_path):
    try:
        os.makedirs(os.path.dirname(output_path), exist_ok=True)

        cmd = [
            'ffmpeg',
            '-i', input_path,
            '-c:v', 'libx264',
            '-c:a', 'aac',
            '-strict', 'experimental',
            '-y',
            output_path
        ]

        result = subprocess.run(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )

        if result.returncode != 0:
            logger.error(f"FFmpeg conversion failed for {input_path}: {result.stderr}")
            return False

        logger.info(f"Converted to MP4: {output_path}")
        return True

    except Exception as e:
        logger.error(f"Error converting {input_path} -> {output_path}: {e}")
        return False


def copy_and_log_video(file_path):
    try:
        if not os.path.exists(file_path):
            logger.error(f"Source file missing: {file_path}")
            return

        filename = os.path.basename(file_path)
        base_name, ext = os.path.splitext(filename)
        ext = ext.lower()

        # OUTPUT ALWAYS MP4
        output_filename = f"{base_name}.mp4"
        destination_path = os.path.join(INTERNAL_VIDEO_FOLDER_PATH, output_filename)

        os.makedirs(INTERNAL_VIDEO_FOLDER_PATH, exist_ok=True)

        # ==================================================================
        # RULE 1: If the MP4 already exists → DO NOTHING (avoid duplicates)
        # ==================================================================
        if os.path.exists(destination_path):
            logger.info(f"MP4 already exists, skipping: {destination_path}")
            return

        # ==================================================================
        # RULE 2: If uploaded is MP4 → Copy only once
        # ==================================================================
        if ext == ".mp4":
            shutil.copy2(file_path, destination_path)
            logger.info(f"Copied MP4 to storage: {destination_path}")

        # ==================================================================
        # RULE 3: If uploaded is NOT MP4 → Convert only once
        # ==================================================================
        else:
            logger.info(f"Converting non-MP4: {file_path} -> {destination_path}")

            if not convert_to_mp4(file_path, destination_path):
                logger.error(f"FFmpeg conversion failed: {file_path}")
                return

            logger.info(f"Converted to MP4: {destination_path}")

        # ==================================================================
        # Build Public URL
        # ==================================================================
        abs_dest = os.path.abspath(destination_path)
        abs_base = os.path.abspath(BASE_PATH)

        if abs_dest.startswith(abs_base):
            rel = os.path.relpath(abs_dest, abs_base).replace("\\", "/")
            video_url = f"{NGINX_BASE_URL.rstrip('/')}/{rel.lstrip('/')}"
        else:
            video_url = ""

        # ==================================================================
        # DB INSERT (ensure only MP4 is inserted)
        # ==================================================================
        session = get_db_session()

        query = text("""
            INSERT INTO videos (main_dir, des_video_path, status, created_date, des_url)
            VALUES (:main_dir, :des_video_path, :status, :create_date, :des_url)
        """)

        session.execute(query, {
            "main_dir": INTERNAL_VIDEO_FOLDER_PATH,
            "des_video_path": destination_path,
            "status": 1,
            "create_date": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
            "des_url": video_url,
        })

        session.commit()
        logger.info(f"DB entry created for MP4: {destination_path}")

    except Exception as e:
        logger.error(f"Error in copy_and_log_video: {file_path} -> {e}", exc_info=True)

