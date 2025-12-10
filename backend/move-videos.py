import os
import shutil
import time
import mysql.connector
from datetime import datetime

# Configuration
MAIN_DIR = "/home/dev1034/Videos/demo-1"  # Source directory
DEST_DIR = "/home/dev1034/Pictures/demo-2"  # Destination directory
MAIN_NGINX_DIR = "/home/dev1034/Pictures"
IP_ROOT = "http://192.168.11.89"
DB_CONFIG = {
    "host": "192.168.11.89",
    "user": "admin",
    "password": "admin",
    "database": "vfs-try-1",
}

# Allowed video extensions
VIDEO_EXTENSIONS = {".mp4", ".avi", ".mov", ".mkv", ".flv"}


def connect_db():
    """Connects to MySQL database."""
    return mysql.connector.connect(**DB_CONFIG)


# def create_table():
#     """Creates the videos table if it does not exist."""
#     conn = connect_db()
#     cursor = conn.cursor()
#     query = """
#     CREATE TABLE IF NOT EXISTS videos (
#         id INT AUTO_INCREMENT PRIMARY KEY,
#         main_dir VARCHAR(255) NOT NULL,
#         des_video_path VARCHAR(255) NOT NULL UNIQUE,
#         des_url VARCHAR(255) NOT NULL,
#         created_date DATETIME NOT NULL,
#         status BOOL NOT NULL DEFAULT 1
#     )
#     """
#     cursor.execute(query)
#     conn.commit()
#     cursor.close()
#     conn.close()


def video_exists_in_db(cursor, video_path):
    """Check if video already exists in database."""
    query = "SELECT COUNT(*) FROM videos WHERE des_video_path = %s"
    cursor.execute(query, (video_path,))
    return cursor.fetchone()[0] > 0


def insert_video_record(video_path):
    """Insert video record into database."""
    conn = connect_db()
    cursor = conn.cursor()
    des_url = video_path.replace(MAIN_NGINX_DIR, IP_ROOT)

    if not video_exists_in_db(cursor, video_path):
        query = """
        INSERT INTO videos (main_dir, des_video_path, des_url, created_date, status)
        VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(query, (MAIN_DIR, video_path, des_url, datetime.now(), 1))
        conn.commit()

    cursor.close()
    conn.close()


def copy_new_videos():
    """Check and copy new videos from main dir to destination."""
    for filename in os.listdir(MAIN_DIR):
        file_path = os.path.join(MAIN_DIR, filename)

        if (
            os.path.isfile(file_path)
            and os.path.splitext(filename)[1].lower() in VIDEO_EXTENSIONS
        ):
            dest_path = os.path.join(DEST_DIR, filename)

            if not os.path.exists(dest_path):
                shutil.copy2(file_path, dest_path)
                insert_video_record(dest_path)
                print(f"Copied and recorded: {filename}")
            else:
                print(f"File already exists: {filename}")


def main():
    """Main function to continuously monitor the directory."""
    # create_table()
    while True:
        copy_new_videos()
        time.sleep(10)  # Check every 10 seconds


if __name__ == "__main__":
    main()
