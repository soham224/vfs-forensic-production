import os
import pyinotify
from my_utils import copy_and_log_video
from config import CLIENT_VIDEO_DIR
from logger_config import setup_logger
from config import FOLDER_POLL_INTERVAL

logger = setup_logger()


class EventHandler(pyinotify.ProcessEvent):
    """
    Handler for file creation and move events.
    """

    def process_IN_CLOSE_WRITE(self, event):
        self._handle_file(event, "IN_CLOSE_WRITE")

    def process_IN_MOVED_TO(self, event):
        self._handle_file(event, "IN_MOVED_TO")

    def _handle_file(self, event, event_type):
        logger.info(f"[{event_type}] Detected file: {event.pathname}")
        if event.pathname.endswith((".mp4", ".avi", ".mov", ".mkv")):
            logger.info(f"Registering video in DB (no copy): {event.pathname}")
            copy_and_log_video(event.pathname)

        else:
            logger.debug(f"File ignored (not video): {event.pathname}")


def process_existing_files():
    """
    At startup, move any pre-existing files.
    """
    try:
        for fname in os.listdir(CLIENT_VIDEO_DIR):
            path = os.path.join(CLIENT_VIDEO_DIR, fname)
            if os.path.isfile(path) and fname.endswith(
                (".mp4", ".avi", ".mov", ".mkv")
            ):
                logger.info(f"Found pre-existing video: {path}")
                # logger.debug(f"Scanning folder every {FOLDER_POLL_INTERVAL} seconds")
                copy_and_log_video(path)

    except Exception as e:
        logger.error(f"Error processing existing files: {e}")
