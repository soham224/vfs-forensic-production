-- MySQL dump 10.13  Distrib 8.0.44, for Linux (x86_64)
--
-- Host: 192.168.11.97    Database: vfs-try-2
-- ------------------------------------------------------
-- Server version	8.0.42-0ubuntu0.24.10.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `camera_rtsp`
--

DROP TABLE IF EXISTS `camera_rtsp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `camera_rtsp` (
  `id` int NOT NULL AUTO_INCREMENT,
  `camera_name` varchar(255) NOT NULL,
  `rtsp_url` varchar(255) NOT NULL,
  `process_fps` int NOT NULL,
  `is_tcp` tinyint(1) DEFAULT NULL,
  `camera_resolution` varchar(255) NOT NULL,
  `camera_ip` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `is_processing` tinyint(1) NOT NULL,
  `roi_type` tinyint(1) NOT NULL,
  `roi_url` varchar(255) DEFAULT NULL,
  `created_date` datetime NOT NULL,
  `updated_date` datetime NOT NULL,
  `status` tinyint(1) NOT NULL,
  `deleted` tinyint(1) NOT NULL,
  `location_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `location_id` (`location_id`),
  KEY `ix_camera_rtsp_id` (`id`),
  CONSTRAINT `camera_rtsp_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `location` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `camera_rtsp`
--

LOCK TABLES `camera_rtsp` WRITE;
/*!40000 ALTER TABLE `camera_rtsp` DISABLE KEYS */;
/*!40000 ALTER TABLE `camera_rtsp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `camera_rtsp_result_type_mapping`
--

DROP TABLE IF EXISTS `camera_rtsp_result_type_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `camera_rtsp_result_type_mapping` (
  `result_type_id` int NOT NULL,
  `camera_rtsp_id` int NOT NULL,
  `roi` json NOT NULL,
  KEY `result_type_id` (`result_type_id`),
  KEY `camera_rtsp_id` (`camera_rtsp_id`),
  CONSTRAINT `camera_rtsp_result_type_mapping_ibfk_1` FOREIGN KEY (`result_type_id`) REFERENCES `result_type` (`id`),
  CONSTRAINT `camera_rtsp_result_type_mapping_ibfk_2` FOREIGN KEY (`camera_rtsp_id`) REFERENCES `camera_rtsp` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `camera_rtsp_result_type_mapping`
--

LOCK TABLES `camera_rtsp_result_type_mapping` WRITE;
/*!40000 ALTER TABLE `camera_rtsp_result_type_mapping` DISABLE KEYS */;
/*!40000 ALTER TABLE `camera_rtsp_result_type_mapping` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `case`
--

DROP TABLE IF EXISTS `case`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `case` (
  `id` int NOT NULL AUTO_INCREMENT,
  `case_id` varchar(255) NOT NULL,
  `case_name` varchar(255) NOT NULL,
  `case_description` varchar(255) DEFAULT NULL,
  `case_status` varchar(255) NOT NULL,
  `case_report` varchar(255) DEFAULT NULL,
  `created_date` datetime NOT NULL,
  `updated_date` datetime NOT NULL,
  `status` tinyint(1) NOT NULL,
  `deleted` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `case_id` (`case_id`),
  KEY `ix_case_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `case`
--

LOCK TABLES `case` WRITE;
/*!40000 ALTER TABLE `case` DISABLE KEYS */;
/*!40000 ALTER TABLE `case` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `case_camera_rtsp_mapping`
--

DROP TABLE IF EXISTS `case_camera_rtsp_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `case_camera_rtsp_mapping` (
  `case_id` int DEFAULT NULL,
  `camera_rtsp_id` int DEFAULT NULL,
  KEY `case_id` (`case_id`),
  KEY `camera_rtsp_id` (`camera_rtsp_id`),
  CONSTRAINT `case_camera_rtsp_mapping_ibfk_1` FOREIGN KEY (`case_id`) REFERENCES `case` (`id`),
  CONSTRAINT `case_camera_rtsp_mapping_ibfk_2` FOREIGN KEY (`camera_rtsp_id`) REFERENCES `camera_rtsp` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `case_camera_rtsp_mapping`
--

LOCK TABLES `case_camera_rtsp_mapping` WRITE;
/*!40000 ALTER TABLE `case_camera_rtsp_mapping` DISABLE KEYS */;
/*!40000 ALTER TABLE `case_camera_rtsp_mapping` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `case_video_mapping`
--

DROP TABLE IF EXISTS `case_video_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `case_video_mapping` (
  `case_id` int DEFAULT NULL,
  `video_id` int DEFAULT NULL,
  KEY `case_id` (`case_id`),
  KEY `video_id` (`video_id`),
  CONSTRAINT `case_video_mapping_ibfk_1` FOREIGN KEY (`case_id`) REFERENCES `case` (`id`),
  CONSTRAINT `case_video_mapping_ibfk_2` FOREIGN KEY (`video_id`) REFERENCES `videos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `case_video_mapping`
--

LOCK TABLES `case_video_mapping` WRITE;
/*!40000 ALTER TABLE `case_video_mapping` DISABLE KEYS */;
/*!40000 ALTER TABLE `case_video_mapping` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company`
--

DROP TABLE IF EXISTS `company`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company` (
  `id` int NOT NULL AUTO_INCREMENT,
  `company_email` varchar(255) NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `company_description` varchar(255) DEFAULT NULL,
  `company_address` varchar(255) NOT NULL,
  `company_pin_code` varchar(255) NOT NULL,
  `company_website` varchar(255) NOT NULL,
  `company_contact` varchar(255) NOT NULL,
  `company_poc` varchar(255) NOT NULL,
  `company_poc_contact` varchar(255) NOT NULL,
  `company_status` tinyint(1) NOT NULL,
  `deployment_region` varchar(255) NOT NULL,
  `created_date` datetime NOT NULL,
  `updated_date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_company_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company`
--

LOCK TABLES `company` WRITE;
/*!40000 ALTER TABLE `company` DISABLE KEYS */;
INSERT IGNORE INTO `company` VALUES (1,'vfssuperadmin@tusker.ai','demo','demo','demo','380005','demo','1236985268','demo','2569369565',1,'ap-south-1','2025-06-13 11:59:29','2025-06-13 11:59:29');
/*!40000 ALTER TABLE `company` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company_setting`
--

DROP TABLE IF EXISTS `company_setting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company_setting` (
  `id` int NOT NULL AUTO_INCREMENT,
  `start_time` varchar(255) NOT NULL,
  `end_time` varchar(255) NOT NULL,
  `buffer_time` varchar(255) NOT NULL,
  `is_used_camera` tinyint(1) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `company_id` int DEFAULT NULL,
  `created_date` datetime NOT NULL,
  `updated_date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `company_id` (`company_id`),
  KEY `ix_company_setting_id` (`id`),
  CONSTRAINT `company_setting_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_setting`
--

LOCK TABLES `company_setting` WRITE;
/*!40000 ALTER TABLE `company_setting` DISABLE KEYS */;
/*!40000 ALTER TABLE `company_setting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `license`
--

DROP TABLE IF EXISTS `license`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `license` (
  `id` int NOT NULL AUTO_INCREMENT,
  `license_key` varchar(255) DEFAULT NULL,
  `key_status` varchar(20) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `expiry_date` datetime DEFAULT NULL,
  `created_date` datetime NOT NULL,
  `updated_date` datetime NOT NULL,
  `status` tinyint(1) NOT NULL,
  `deleted` tinyint(1) NOT NULL,
  `limit_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `limit_id` (`limit_id`),
  KEY `ix_license_license_key` (`license_key`),
  KEY `ix_license_id` (`id`),
  KEY `ix_license_key_status` (`key_status`),
  CONSTRAINT `license_ibfk_1` FOREIGN KEY (`limit_id`) REFERENCES `limit` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `license`
--

LOCK TABLES `license` WRITE;
/*!40000 ALTER TABLE `license` DISABLE KEYS */;
INSERT IGNORE INTO `license` VALUES (1,'gAAAAABoTBiFyYw73HRgg4lNxDF_uh3UmxaT2DbMv-ZL-u8jq_6KnHUCEDwFzCFldEjV-3v9CpkA_zdATM_PtLxK6HRihtnrM9Yy4hUQ5L9cu8WLbeQ6bdw=','activate','2025-06-13 12:35:26','2027-06-13 12:35:26','2025-06-13 12:35:26','2025-06-13 12:35:26',1,0,1);
/*!40000 ALTER TABLE `license` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `limit`
--

DROP TABLE IF EXISTS `limit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `limit` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(100) NOT NULL,
  `subtype` varchar(255) NOT NULL,
  `current_limit` int NOT NULL,
  `created_date` datetime NOT NULL,
  `updated_date` datetime NOT NULL,
  `status` tinyint(1) NOT NULL,
  `deleted` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `type` (`type`),
  KEY `ix_limit_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `limit`
--

LOCK TABLES `limit` WRITE;
/*!40000 ALTER TABLE `limit` DISABLE KEYS */;
INSERT IGNORE INTO `limit` VALUES (1,'VFS','camera',10,'2025-06-13 10:03:16','2025-06-13 10:03:16',1,0);
/*!40000 ALTER TABLE `limit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `location`
--

DROP TABLE IF EXISTS `location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `location` (
  `id` int NOT NULL AUTO_INCREMENT,
  `location_name` varchar(255) NOT NULL,
  `created_date` datetime NOT NULL,
  `updated_date` datetime NOT NULL,
  `status` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_location_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `location`
--

LOCK TABLES `location` WRITE;
/*!40000 ALTER TABLE `location` DISABLE KEYS */;
/*!40000 ALTER TABLE `location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `id` int NOT NULL AUTO_INCREMENT,
  `notification_message` varchar(255) NOT NULL,
  `type_of_notification` varchar(255) DEFAULT NULL,
  `status` tinyint(1) NOT NULL,
  `is_unread` tinyint(1) NOT NULL,
  `created_date` datetime NOT NULL,
  `updated_date` datetime NOT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `ix_notification_id` (`id`),
  CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `result`
--

DROP TABLE IF EXISTS `result`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `result` (
  `id` int NOT NULL AUTO_INCREMENT,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_url` varchar(255) NOT NULL,
  `bounding_box` json NOT NULL,
  `suspect_id` int DEFAULT NULL,
  `result_type_id` int DEFAULT NULL,
  `frame_time` datetime DEFAULT NULL,
  `created_date` datetime NOT NULL,
  `updated_date` datetime NOT NULL,
  `status` tinyint(1) NOT NULL,
  `deleted` tinyint(1) NOT NULL,
  `label` json NOT NULL,
  `label_count` json NOT NULL,
  `camera_id` int DEFAULT NULL,
  `video_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `suspect_id` (`suspect_id`),
  KEY `result_type_id` (`result_type_id`),
  KEY `camera_id` (`camera_id`),
  KEY `video_id` (`video_id`),
  CONSTRAINT `result_ibfk_1` FOREIGN KEY (`suspect_id`) REFERENCES `suspect` (`id`),
  CONSTRAINT `result_ibfk_2` FOREIGN KEY (`result_type_id`) REFERENCES `result_type` (`id`),
  CONSTRAINT `result_ibfk_3` FOREIGN KEY (`camera_id`) REFERENCES `camera_rtsp` (`id`),
  CONSTRAINT `result_ibfk_4` FOREIGN KEY (`video_id`) REFERENCES `videos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4817 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `result`
--

LOCK TABLES `result` WRITE;
/*!40000 ALTER TABLE `result` DISABLE KEYS */;
/*!40000 ALTER TABLE `result` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `result_type`
--

DROP TABLE IF EXISTS `result_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `result_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `result_type` varchar(255) NOT NULL,
  `roi_status` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_result_type_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `result_type`
--

LOCK TABLES `result_type` WRITE;
/*!40000 ALTER TABLE `result_type` DISABLE KEYS */;
INSERT IGNORE INTO `result_type` VALUES (1,'Forensic',1);
/*!40000 ALTER TABLE `result_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_role_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT IGNORE INTO `role` VALUES (1,'superadmin'),(2,'admin'),(3,'supervisor'),(4,'resultmanager'),(5,'reporter');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suspect`
--

DROP TABLE IF EXISTS `suspect`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suspect` (
  `id` int NOT NULL AUTO_INCREMENT,
  `suspect_name` varchar(255) NOT NULL,
  `suspect_image_path` varchar(255) NOT NULL,
  `suspect_image_url` varchar(255) NOT NULL,
  `created_date` datetime NOT NULL,
  `updated_date` datetime NOT NULL,
  `status` tinyint(1) NOT NULL,
  `deleted` tinyint(1) NOT NULL,
  `case_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `case_id` (`case_id`),
  KEY `ix_suspect_id` (`id`),
  CONSTRAINT `suspect_ibfk_1` FOREIGN KEY (`case_id`) REFERENCES `case` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suspect`
--

LOCK TABLES `suspect` WRITE;
/*!40000 ALTER TABLE `suspect` DISABLE KEYS */;
/*!40000 ALTER TABLE `suspect` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_email` varchar(255) DEFAULT NULL,
  `user_password` varchar(255) NOT NULL,
  `user_status` tinyint(1) NOT NULL,
  `created_date` datetime NOT NULL,
  `updated_date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ix_user_user_email` (`user_email`),
  KEY `ix_user_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT IGNORE INTO `user` VALUES (1,'vfssuperadmin@tusker.ai','$2b$12$Pj5rSWjXSQOpHK94wVJ3MONdsxdkeehqG3XNfL6Lw2SZPaZaiHOUC',1,'2025-06-13 11:59:29','2025-06-13 11:59:29');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_license_mapping`
--

DDROP TABLE IF EXISTS `user_license_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_license_mapping` (
  `license_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  KEY `license_id` (`license_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_license_mapping_ibfk_1` FOREIGN KEY (`license_id`) REFERENCES `license` (`id`),
  CONSTRAINT `user_license_mapping_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_license_mapping`
--

LOCK TABLES `user_license_mapping` WRITE;
/*!40000 ALTER TABLE `user_license_mapping` DISABLE KEYS */;
INSERT INTO `user_license_mapping` VALUES (1,1);
/*!40000 ALTER TABLE `user_license_mapping` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_location`
--

DROP TABLE IF EXISTS `user_location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_location` (
  `user_id` int DEFAULT NULL,
  `location_id` int DEFAULT NULL,
  KEY `user_id` (`user_id`),
  KEY `location_id` (`location_id`),
  CONSTRAINT `user_location_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `user_location_ibfk_2` FOREIGN KEY (`location_id`) REFERENCES `location` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_location`
--

LOCK TABLES `user_location` WRITE;
/*!40000 ALTER TABLE `user_location` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_role`
--

ROP TABLE IF EXISTS `user_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_role` (
  `user_id` int DEFAULT NULL,
  `role_id` int DEFAULT NULL,
  KEY `user_id` (`user_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `user_role_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `user_role_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_role`
--

LOCK TABLES `user_role` WRITE;
/*!40000 ALTER TABLE `user_role` DISABLE KEYS */;
INSERT INTO `user_role` VALUES (1,1);
/*!40000 ALTER TABLE `user_role` ENABLE KEYS */;
UNLOCK TABLES;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_role`
--

LOCK TABLES `user_role` WRITE;
/*!40000 ALTER TABLE `user_role` DISABLE KEYS */;
-- Only insert if both user and role exist and the mapping doesn't exist
INSERT IGNORE INTO `user_role` 
SELECT 1, 1
WHERE EXISTS (SELECT 1 FROM `user` WHERE id = 1)
AND EXISTS (SELECT 1 FROM `role` WHERE id = 1)
AND NOT EXISTS (SELECT 1 FROM `user_role` WHERE user_id = 1 AND role_id = 1);
/*!40000 ALTER TABLE `user_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `videos`
--

DROP TABLE IF EXISTS `videos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `videos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `main_dir` varchar(255) DEFAULT NULL,
  `des_video_path` varchar(255) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `created_date` datetime DEFAULT NULL,
  `des_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_videos_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `videos`
--

LOCK TABLES `videos` WRITE;
/*!40000 ALTER TABLE `videos` DISABLE KEYS */;
/*!40000 ALTER TABLE `videos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'vfs-try-2'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-11 12:09:01
