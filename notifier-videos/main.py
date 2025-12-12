import pyinotify
import time
from notifier import EventHandler, process_existing_files
from config import CLIENT_VIDEO_DIR, FOLDER_POLL_INTERVAL, logger


def main():
    try:
        logger.info(
            "Starting Video Notifier (no-copy mode): registering files directly to DB"
        )
        process_existing_files()
        wm = pyinotify.WatchManager()
        mask = pyinotify.IN_CLOSE_WRITE | pyinotify.IN_MOVED_TO
        logger.info(f"Using pyinotify mask: IN_CLOSE_WRITE | IN_MOVED_TO")

        handler = EventHandler()
        notifier = pyinotify.Notifier(wm, handler)
        wm.add_watch(CLIENT_VIDEO_DIR, mask)

        logger.info(f"Watching folder: {CLIENT_VIDEO_DIR}")

        # notifier.loop()
        while True:
            try:
                notifier.process_events()
                if notifier.check_events(timeout=1000):  # 1 second timeout
                    notifier.read_events()
                # logger.debug(f"Notifier polling interval: {FOLDER_POLL_INTERVAL} seconds")
                time.sleep(FOLDER_POLL_INTERVAL)
            except KeyboardInterrupt:
                logger.info("Shutting down notifier.")
                notifier.stop()
                break
            except Exception as e:
                logger.error(f"Error during watcher loop: {e}")
    except Exception as e:
        logger.error(f"Error during main loop: {e}")


if __name__ == "__main__":
    main()
