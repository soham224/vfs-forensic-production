# VFS Video Notifier

A Python-based service that monitors a directory for new video files and registers them in a MySQL database with their corresponding URLs. The service uses inotify to detect file system events in real-time and supports processing of both new and pre-existing video files. The service operates in "no-copy" mode, meaning it registers files directly in the database without making additional copies.

## Features

- Monitors a specified directory for new video files (mp4, avi, mov, mkv)
- Automatically processes pre-existing video files on startup
- Registers video metadata in a MySQL database
- Generates accessible URLs for the videos
- Configurable polling interval for directory monitoring
- Comprehensive logging system with file rotation

## Prerequisites

- Python 3.8+
- MySQL Server 5.7+
- Required Python packages (see `requirements.txt`)
- Inotify support in the kernel (Linux only)
- Docker and Docker Compose (for containerized deployment)

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

Create a `.env` file in the project root with the following required environment variables:

```bash
# Logging Configuration
LOG_BASE_DIRECTORY=/path/to/logs  # Directory where logs will be stored

# MySQL Database Configuration
MYSQL_USER=your_mysql_user
MYSQL_PASS=your_mysql_password
MYSQL_HOST=mysql_host
MYSQL_PORT=3306
MYSQL_DB_NAME=your_database_name

# Video Directories
CLIENT_VIDEO_DIR=/path/to/monitor/videos  # Directory to monitor for new videos
INTERNAL_VIDEO_FOLDER_PATH=/path/to/internal/videos  # Internal directory for processing

# URL Configuration
NGINX_BASE_URL=http://your-server-ip  # Base URL for video access
NGINX_INTERNAL_PATH=/path/served/by/nginx  # Internal path served by Nginx
BASE_PATH=/base/path/for/relative/urls  # Base path for URL construction

# Optional Configuration
FOLDER_POLL_INTERVAL=5  # Polling interval in seconds (default: 5)
STORAGE_PC_VIDEO_DIR=/path/to/storage  # Optional storage path
STORAGE_PC_BASE_URL=http://storage-server  # Optional storage base URL
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `LOG_BASE_DIRECTORY` | Base directory for log files | Yes | - |
| `MYSQL_USER` | MySQL username | Yes | - |
| `MYSQL_PASS` | MySQL password | Yes | - |
| `MYSQL_HOST` | MySQL host address | Yes | - |
| `MYSQL_PORT` | MySQL port | No | 3306 |
| `MYSQL_DB_NAME` | Database name | Yes | - |
| `CLIENT_VIDEO_DIR` | Directory to monitor for videos | Yes | - |
| `INTERNAL_VIDEO_FOLDER_PATH` | Internal directory for video processing | Yes | - |
| `NGINX_BASE_URL` | Base URL for video access | Yes | - |
| `NGINX_INTERNAL_PATH` | Internal path served by Nginx | Yes* | - |
| `NGINX_SERVE_DIRECTORY` | Alternative to NGINX_INTERNAL_PATH | Yes* | - |
| `BASE_PATH` | Base path for relative URL construction | Yes | - |
| `FOLDER_POLL_INTERVAL` | Polling interval in seconds | No | 5 |
| `STORAGE_PC_VIDEO_DIR` | Optional storage directory | No | - |
| `STORAGE_PC_BASE_URL` | Optional storage base URL | No | - |

*Either `NGINX_INTERNAL_PATH` or `NGINX_SERVE_DIRECTORY` must be provided

## Database Schema

The service expects a `videos` table with the following structure:

```sql
CREATE TABLE `videos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `main_dir` varchar(512) DEFAULT NULL,
  `des_video_path` varchar(1024) NOT NULL,
  `status` int(11) DEFAULT 1,
  `created_date` datetime DEFAULT current_timestamp(),
  `des_url` varchar(1024) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_des_video_path` (`des_video_path`(255)),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

Note: The service uses the `des_video_path` field to store the full path to the video file and `des_url` to store the accessible URL.

## How It Works

1. **Initialization**:
   - Service starts and loads configuration from environment variables
   - Validates all required directories and creates them if they don't exist
   - Establishes database connection using SQLAlchemy with connection pooling
   - Configures logging with file rotation (daily)

2. **Startup Processing**:
   - Scans the configured `CLIENT_VIDEO_DIR` for existing video files (mp4, avi, mov, mkv)
   - Registers each found video in the database without making copies (no-copy mode)
   - Generates and stores accessible URLs for each video based on the configuration

3. **Real-time Monitoring**:
   - Uses `pyinotify` to monitor `CLIENT_VIDEO_DIR` for file system events
   - Watches for two types of events:
     - `IN_CLOSE_WRITE`: Triggered when a file is completely written
     - `IN_MOVED_TO`: Triggered when a file is moved into the directory
   - Processes each event in a non-blocking manner with a configurable poll interval

4. **URL Generation**:
   - Constructs URLs using the formula: `NGINX_BASE_URL` + relative path from `BASE_PATH`
   - Handles path normalization and URL encoding automatically
   - Stores both the full path and generated URL in the database

5. **No-Copy Mode**:
   - Operates in no-copy mode by default, registering files in their original location
   - Maintains original file permissions and ownership
   - Reduces storage requirements and processing overhead

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

## Docker Deployment

The service is designed to run in a Docker container with proper volume mounts for persistence.

### Prerequisites
- Docker 20.10.0+
- Docker Compose 1.29.0+

### Configuration

1. Update the `volumes` section in `docker-compose.yml` to match your host paths:
   ```yaml
   volumes:
     - /host/logs/path:/app/logs
     - /host/videos/path:/path/in/container
   ```

2. Ensure your `.env` file is properly configured with the correct paths and credentials.

### Building and Running

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

### Volume Mounts
- `/app/logs`: Directory for application logs
- `/home/dev1079/frames/vfs/client`: Client video directory (adjust in docker-compose.yml)
- `/home/dev1079/Desktop/vfs_videos`: Internal video directory (adjust in docker-compose.yml)

## Error Handling and Logging

The service implements comprehensive error handling and structured logging:

### Log Files
- Logs are stored in the directory specified by `LOG_BASE_DIRECTORY`
- Log files are rotated daily and kept for 30 days
- Log format: `DD-MM-YYYY_vfs_tusker_notifier_videos.log`

### Common Issues and Solutions

1. **Database Connection Issues**
   - Verify MySQL server is running and accessible
   - Check database credentials in `.env`
   - Ensure the database and table exist with correct permissions

2. **File System Permissions**
   - The container user needs read access to `CLIENT_VIDEO_DIR`
   - Ensure mounted volumes have correct permissions (typically UID/GID 1000)
   - Check SELinux/AppArmor policies if running on a secured system

3. **Configuration Errors**
   - All required environment variables must be set
   - Directory paths must exist and be accessible
   - URL components must be properly formatted

4. **Monitoring Issues**
   - Verify inotify limits are properly configured on the host
   - Check for filesystem events being dropped (logged as warnings)
   - Ensure the watched directory is not on a network filesystem with poor inotify support

## Maintenance and Monitoring

### Log Management
- Logs are automatically rotated daily
- 30 days of logs are retained by default
- Log directory structure:
  ```
  <LOG_BASE_DIRECTORY>/
    DD-MM-YYYY_vfs_tusker_notifier_videos.log
    ...
  ```

### Database Maintenance
1. **Backup**
   - Implement regular database backups using `mysqldump` or your preferred tool
   - Consider using Percona XtraBackup for large databases

2. **Optimization**
   - Monitor and optimize slow queries using the slow query log
   - Regularly run `ANALYZE TABLE` to update index statistics
   - Consider partitioning the videos table if it grows large

3. **Monitoring**
   - Monitor database connection pool usage
   - Track the number of registered videos and growth rate
   - Set up alerts for database connection issues or full disk space

### Performance Considerations
- The service is designed to be lightweight and efficient
- Memory usage scales with the number of files being monitored
- Disk I/O is minimal as it operates in no-copy mode
- Consider increasing `FOLDER_POLL_INTERVAL` if system load is high

## Troubleshooting Guide

### Service Not Starting
1. **Check Logs**
   ```bash
   docker-compose logs vfs-notifier-service
   ```
   - Look for error messages or stack traces
   - Verify all environment variables are set correctly

2. **Common Issues**
   - **Permission Denied**
     - Ensure the container user has read access to mounted volumes
     - Check directory permissions on the host
     - Example fix: `chmod -R 755 /path/to/directory`
   
   - **Database Connection Refused**
     - Verify MySQL server is running and accessible from the container
     - Check if the MySQL user has remote login permissions
     - Test connection: `mysql -h host -u user -p`

### Files Not Being Detected
1. **Basic Checks**
   - Verify files match supported extensions: .mp4, .avi, .mov, .mkv
   - Check file permissions and ownership
   - Ensure files are being written to the correct directory

2. **Inotify Issues**
   - Check inotify limits:
     ```bash
     cat /proc/sys/fs/inotify/max_user_watches
     ```
   - If needed, increase the limit:
     ```bash
     echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
     sudo sysctl -p
     ```

### Database Issues
1. **Connection Problems**
   - Verify MySQL is running: `systemctl status mysql`
   - Check MySQL logs: `sudo tail -f /var/log/mysql/error.log`
   - Test connection from container:
     ```bash
     docker exec -it vfs-notifier-service mysql -h host -u user -p
     ```

2. **Table Structure**
   - Verify the videos table exists and has the correct structure
   - Check for any locks or long-running transactions

### URL Generation Issues
1. **Incorrect URLs**
   - Verify `NGINX_BASE_URL` is correct and accessible
   - Check `BASE_PATH` matches your nginx configuration
   - Ensure the web server has proper permissions to serve the files

2. **Testing**
   - Manually construct the expected URL and test in a browser
   - Check nginx access/error logs for 404s or permission errors

## Support

For additional support, please contact your system administrator or open an issue in the project repository.

## License

[Specify License]

## Maintainer

Shruti Agarwal

## Support

For support, please contact [support-email@example.com] or create an issue in the repository.
