-- Ensure the target database exists on container start
CREATE DATABASE IF NOT EXISTS `vfs_auto_serving` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
FLUSH PRIVILEGES;

