import os
import shutil
import glob

# Source and destination folders
source_folder = "/home/dev1034/Videos/demo-1"  # Change this to your source folder
destination_folder = (
    "/media/dev1034/storage1/demo-1"  # Change this to your target folder
)

# Ensure the destination folder exists
os.makedirs(destination_folder, exist_ok=True)

# Video file extensions
video_extensions = ("*.mp4", "*.avi", "*.mkv", "*.mov", "*.flv", "*.wmv")

# Move files
for ext in video_extensions:
    for file in glob.glob(os.path.join(source_folder, ext)):
        shutil.copy(file, os.path.join(destination_folder, os.path.basename(file)))
        print(f"Moved: {file} → {destination_folder}")

print("All videos moved successfully!")
