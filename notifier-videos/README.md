# VFS Video Notifier

A Python-based service that monitors a directory for new video files and registers them in a database with their corresponding URLs. The service uses inotify to detect file system events and supports both immediate and pre-existing file processing.

## Features

- Monitors a specified directory for new video files (mp4, avi, mov, mkv)
- Automatically processes pre-existing video files on startup
- Registers video metadata in a MySQL database
- Generates accessible URLs for the videos
- Configurable polling interval for directory monitoring
- Comprehensive logging system with file rotation

## Prerequisites

- Python 3.8+
- MySQL Server
- Required Python packages (see `requirements.txt`)
- Inotify support in the kernel

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd vfs-notifier-videos
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Configuration

Copy the `.env.example` to `.env` and update the following environment variables:

```bash
# Logging
LOG_BASE_DIRECTORY=./logs  # Directory where logs will be stored

# Database Configuration
MYSQL_USER=your_mysql_user
MYSQL_PASS=your_mysql_password
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DB_NAME=your_database_name

# Directory to monitor for videos
CLIENT_VIDEO_DIR=/path/to/videos

# Base URL for video access
NGINX_BASE_URL=http://your-server-ip
NGINX_SERVE_DIRECTORY=/path/served/by/nginx

# Base path for URL construction
BASE_PATH=/base/path/for/relative/urls

# Polling interval in seconds
FOLDER_POLL_INTERVAL=5
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `LOG_BASE_DIRECTORY` | Base directory for log files | Yes | - |
| `MYSQL_USER` | MySQL username | Yes | - |
| `MYSQL_PASS` | MySQL password | Yes | - |
| `MYSQL_HOST` | MySQL host | Yes | localhost |
| `MYSQL_PORT` | MySQL port | No | 3306 |
| `MYSQL_DB_NAME` | Database name | Yes | - |
| `CLIENT_VIDEO_DIR` | Directory to monitor for videos | Yes | - |
| `NGINX_BASE_URL` | Base URL for video access | Yes | - |
| `NGINX_SERVE_DIRECTORY` | Directory served by Nginx | Yes | - |
| `BASE_PATH` | Base path for relative URL construction | Yes | - |
| `FOLDER_POLL_INTERVAL` | Polling interval in seconds | No | 5 |

## Database Schema

The service expects a `videos` table with the following structure:

```sql
CREATE TABLE videos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    main_dir VARCHAR(512),
    des_video_path VARCHAR(1024) NOT NULL,
    status INT DEFAULT 1,
    created_date DATETIME,
    des_url VARCHAR(1024)
);
```

## How It Works

1. **Initialization**:
   - The service starts and loads configuration from environment variables
   - Database connection is established
   - Logging is configured with file rotation (daily)

2. **Startup Processing**:
   - Scans the configured `CLIENT_VIDEO_DIR` for existing video files
   - Registers each found video in the database
   - Generates and stores accessible URLs for each video

3. **Directory Monitoring**:
   - Uses `pyinotify` to monitor the `CLIENT_VIDEO_DIR` for new files
   - Watches for `IN_CLOSE_WRITE` and `IN_MOVED_TO` events
   - When a new video file is detected, it's registered in the database

4. **URL Generation**:
   - For each video, a URL is constructed using `NGINX_BASE_URL` and the relative path from `BASE_PATH`
   - The URL is stored in the database for easy access

## Running the Service

1. Ensure all environment variables are properly set in `.env`
2. Activate the virtual environment if not already activated
3. Run the service:
   ```bash
   python main.py
   ```

## Logging

Logs are stored in the directory specified by `LOG_BASE_DIRECTORY` with the following format:
- Filename: `DD-MM-YYYY_vfs_tusker_notifier_videos.log`
- Log rotation: Daily, with 30 days of backup

## Docker Support

A `Dockerfile` and `docker-compose.yml` are provided for containerized deployment.

### Building and Running with Docker

1. Build the Docker image:
   ```bash
   docker-compose build
   ```

2. Start the service:
   ```bash
   docker-compose up -d
   ```

3. View logs:
   ```bash
   docker-compose logs -f
   ```

## Error Handling

The service includes comprehensive error handling and logging. Common issues include:
- Database connection failures
- File system permission issues
- Invalid directory paths
- Missing environment variables

## Maintenance

### Log Rotation
Logs are automatically rotated daily and kept for 30 days. The log directory structure is:
```
<LOG_BASE_DIRECTORY>/
  logs/
    DD-MM-YYYY_vfs_tusker_notifier_videos.log
    ...
```

### Database Maintenance
Regular database maintenance (backup, optimization) should be performed according to your organization's policies.

## Troubleshooting

1. **Service not detecting files**
   - Verify `CLIENT_VIDEO_DIR` exists and is readable
   - Check file permissions in the monitored directory
   - Ensure the service has sufficient permissions to read the directory

2. **Database connection issues**
   - Verify database credentials in `.env`
   - Check if MySQL server is running and accessible
   - Ensure the database and table exist

3. **URL generation problems**
   - Verify `NGINX_BASE_URL` and `BASE_PATH` are correctly set
   - Ensure the video files are accessible via the web server

## License

[Specify License]

## Maintainer

Shruti Agarwal

## Support

For support, please contact [support-email@example.com] or create an issue in the repository.
