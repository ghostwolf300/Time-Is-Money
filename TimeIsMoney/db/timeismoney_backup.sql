-- MySQL dump 10.13  Distrib 5.7.20, for Win64 (x86_64)
--
-- Host: localhost    Database: timeismoney
-- ------------------------------------------------------
-- Server version	5.7.20-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `contract_type`
--

DROP TABLE IF EXISTS `contract_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contract_type` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `contract_type_name` varchar(128) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contract_type`
--

LOCK TABLES `contract_type` WRITE;
/*!40000 ALTER TABLE `contract_type` DISABLE KEYS */;
INSERT INTO `contract_type` VALUES (1,'FT Retail Employee'),(2,'PT Retail Employee'),(3,'FT Logistics Employee'),(4,'PT Logistics Employee'),(5,'Office Employee');
/*!40000 ALTER TABLE `contract_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cost_center`
--

DROP TABLE IF EXISTS `cost_center`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cost_center` (
  `id` int(11) NOT NULL,
  `secondary_id` varchar(32) DEFAULT NULL,
  `name` varchar(32) NOT NULL,
  `enabled` tinyint(1) DEFAULT '1',
  `changed_by` int(11) DEFAULT NULL,
  `change_ts` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_cost_center_changed_by` (`changed_by`),
  CONSTRAINT `fk_cost_center_changed_by` FOREIGN KEY (`changed_by`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cost_center`
--

LOCK TABLES `cost_center` WRITE;
/*!40000 ALTER TABLE `cost_center` DISABLE KEYS */;
INSERT INTO `cost_center` VALUES (1,'0371001','Sales',1,2,'2018-01-17 09:07:39'),(2,'0371234','Projects',1,2,'2018-01-17 09:07:39'),(3,'4225555','Logistics',1,2,'2018-01-17 09:07:39'),(4,'0086542','Restaurant',1,2,'2018-01-17 09:07:39'),(5,'0376379','Management',1,2,'2018-01-17 09:07:46');
/*!40000 ALTER TABLE `cost_center` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `forecast`
--

DROP TABLE IF EXISTS `forecast`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `forecast` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `org_unit_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_forecast_org_unit_id` (`org_unit_id`),
  CONSTRAINT `fk_forecast_org_unit_id` FOREIGN KEY (`org_unit_id`) REFERENCES `org_unit` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forecast`
--

LOCK TABLES `forecast` WRITE;
/*!40000 ALTER TABLE `forecast` DISABLE KEYS */;
INSERT INTO `forecast` VALUES (1,'March 2018',27,'2018-03-01','2018-03-31');
/*!40000 ALTER TABLE `forecast` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `forecast_hours`
--

DROP TABLE IF EXISTS `forecast_hours`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `forecast_hours` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `forecast_id` int(10) unsigned NOT NULL,
  `forecast_date` date NOT NULL,
  `forecast_time` tinyint(3) unsigned NOT NULL,
  `hours_needed` decimal(5,2) DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `fk_forecast_hours_forecast_id` (`forecast_id`),
  CONSTRAINT `fk_forecast_hours_forecast_id` FOREIGN KEY (`forecast_id`) REFERENCES `forecast` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forecast_hours`
--

LOCK TABLES `forecast_hours` WRITE;
/*!40000 ALTER TABLE `forecast_hours` DISABLE KEYS */;
INSERT INTO `forecast_hours` VALUES (9,1,'2018-03-01',0,0.00),(10,1,'2018-03-01',1,0.00),(11,1,'2018-03-01',2,0.00),(12,1,'2018-03-01',3,0.00),(13,1,'2018-03-01',4,0.00),(14,1,'2018-03-01',5,2.00),(15,1,'2018-03-01',6,2.00),(16,1,'2018-03-01',7,2.00),(17,1,'2018-03-01',8,2.00),(18,1,'2018-03-01',9,3.00),(19,1,'2018-03-01',10,3.00),(20,1,'2018-03-01',11,3.00),(21,1,'2018-03-01',12,3.00),(22,1,'2018-03-01',13,3.00),(23,1,'2018-03-01',14,3.00),(24,1,'2018-03-01',15,3.00),(25,1,'2018-03-01',16,4.00),(26,1,'2018-03-01',17,4.00),(27,1,'2018-03-01',18,4.00),(28,1,'2018-03-01',19,2.00),(29,1,'2018-03-01',20,2.00),(30,1,'2018-03-01',21,0.00),(31,1,'2018-03-01',22,0.00),(32,1,'2018-03-01',23,0.00);
/*!40000 ALTER TABLE `forecast_hours` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `org_unit`
--

DROP TABLE IF EXISTS `org_unit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `org_unit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `cost_center_id` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `changed_by` int(11) DEFAULT NULL,
  `change_ts` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_org_unit_cost_center_id` (`cost_center_id`),
  KEY `fk_org_unit_changed_by` (`changed_by`),
  CONSTRAINT `fk_org_unit_changed_by` FOREIGN KEY (`changed_by`) REFERENCES `user` (`id`),
  CONSTRAINT `fk_org_unit_cost_center_id` FOREIGN KEY (`cost_center_id`) REFERENCES `cost_center` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `org_unit`
--

LOCK TABLES `org_unit` WRITE;
/*!40000 ALTER TABLE `org_unit` DISABLE KEYS */;
INSERT INTO `org_unit` VALUES (1,'Company',NULL,NULL,2,'2018-01-17 09:17:36'),(2,'Store 001',NULL,1,2,'2018-01-17 09:22:59'),(3,'Store 002',NULL,1,2,'2018-01-17 09:22:59'),(4,'Store 003',NULL,1,2,'2018-01-17 09:22:59'),(5,'Store 004',NULL,1,2,'2018-01-17 09:22:59'),(6,'Store 005',NULL,1,2,'2018-01-17 09:23:02'),(7,'Sales',1,2,2,'2018-01-17 09:32:07'),(8,'Projects',2,2,2,'2018-01-17 09:32:07'),(9,'Logistics',3,2,2,'2018-01-17 09:32:07'),(10,'Restaurant',4,2,2,'2018-01-17 09:32:07'),(11,'Management',5,2,2,'2018-01-17 09:32:07'),(12,'Sales',1,3,2,'2018-01-17 09:32:07'),(13,'Projects',2,3,2,'2018-01-17 09:32:07'),(14,'Logistics',3,3,2,'2018-01-17 09:32:07'),(15,'Restaurant',4,3,2,'2018-01-17 09:32:07'),(16,'Management',5,3,2,'2018-01-17 09:32:07'),(17,'Sales',1,4,2,'2018-01-17 09:32:07'),(18,'Projects',2,4,2,'2018-01-17 09:32:07'),(19,'Logistics',3,4,2,'2018-01-17 09:32:07'),(20,'Restaurant',4,4,2,'2018-01-17 09:32:07'),(21,'Management',5,4,2,'2018-01-17 09:32:07'),(22,'Sales',1,5,2,'2018-01-17 09:32:07'),(23,'Projects',2,5,2,'2018-01-17 09:32:07'),(24,'Logistics',3,5,2,'2018-01-17 09:32:07'),(25,'Restaurant',4,5,2,'2018-01-17 09:32:07'),(26,'Management',5,5,2,'2018-01-17 09:32:09'),(27,'Department 01',1,7,2,'2018-01-17 09:36:48'),(28,'Department 02',1,7,2,'2018-01-17 09:36:48'),(29,'Department 03',1,7,2,'2018-01-17 09:36:48'),(30,'Department 01',3,9,2,'2018-01-17 09:36:48'),(31,'Department 02',3,9,2,'2018-01-17 09:36:48'),(32,'Department 03',3,9,2,'2018-01-17 09:36:49'),(33,'Sub-department 01',3,31,2,'2018-01-17 09:37:44'),(34,'Sub-department 02',3,31,2,'2018-01-17 09:37:46');
/*!40000 ALTER TABLE `org_unit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plan`
--

DROP TABLE IF EXISTS `plan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `plan` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `org_unit_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `active` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_plan_org_unit_id` (`org_unit_id`),
  CONSTRAINT `fk_plan_org_unit_id` FOREIGN KEY (`org_unit_id`) REFERENCES `org_unit` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plan`
--

LOCK TABLES `plan` WRITE;
/*!40000 ALTER TABLE `plan` DISABLE KEYS */;
INSERT INTO `plan` VALUES (1,'Feb 2018',27,'2018-02-01','2018-02-28',1),(2,'Mar 2018',27,'2018-03-01','2018-03-31',1),(3,'Dec 2017',27,'2017-12-01','2017-12-31',1),(4,'Feb 2018 - alternative',27,'2017-02-01','2017-02-28',0);
/*!40000 ALTER TABLE `plan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plan_org_unit`
--

DROP TABLE IF EXISTS `plan_org_unit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `plan_org_unit` (
  `plan_id` int(10) unsigned NOT NULL,
  `org_unit_id` int(11) NOT NULL,
  PRIMARY KEY (`plan_id`,`org_unit_id`),
  KEY `fk_plan_org_unit_org_unit_id` (`org_unit_id`),
  CONSTRAINT `fk_plan_org_unit_org_unit_id` FOREIGN KEY (`org_unit_id`) REFERENCES `org_unit` (`id`),
  CONSTRAINT `fk_plan_org_unit_plan_id` FOREIGN KEY (`plan_id`) REFERENCES `plan` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plan_org_unit`
--

LOCK TABLES `plan_org_unit` WRITE;
/*!40000 ALTER TABLE `plan_org_unit` DISABLE KEYS */;
INSERT INTO `plan_org_unit` VALUES (1,27),(2,27),(1,28),(2,28),(1,29),(2,29);
/*!40000 ALTER TABLE `plan_org_unit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `role` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'ADMIN'),(2,'MANAGER'),(3,'CO-WORKER'),(4,'SHIFT PLANNER');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rounding_rule`
--

DROP TABLE IF EXISTS `rounding_rule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rounding_rule` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `direction` tinyint(3) unsigned NOT NULL,
  `name` varchar(64) NOT NULL,
  `seconds_before` int(11) NOT NULL DEFAULT '0',
  `seconds_after` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rounding_rule`
--

LOCK TABLES `rounding_rule` WRITE;
/*!40000 ALTER TABLE `rounding_rule` DISABLE KEYS */;
INSERT INTO `rounding_rule` VALUES (1,1,'Stamp in - default',300,300),(2,2,'Stamp out - default',300,300);
/*!40000 ALTER TABLE `rounding_rule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedule`
--

DROP TABLE IF EXISTS `schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `schedule` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `plan_id` int(10) unsigned DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `schedule_date` date NOT NULL,
  `schedule_type_id` int(11) NOT NULL,
  `start` time DEFAULT NULL,
  `end` time DEFAULT NULL,
  `org_unit_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_schedule_user_id` (`user_id`),
  KEY `fk_schedule_plan_id` (`plan_id`),
  CONSTRAINT `fk_schedule_plan_id` FOREIGN KEY (`plan_id`) REFERENCES `plan` (`id`),
  CONSTRAINT `fk_schedule_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=127 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedule`
--

LOCK TABLES `schedule` WRITE;
/*!40000 ALTER TABLE `schedule` DISABLE KEYS */;
INSERT INTO `schedule` VALUES (97,1,3,'2018-02-13',1,'08:00:00','13:30:00',27),(98,1,3,'2018-02-14',1,'08:00:00','13:30:00',27),(99,1,3,'2018-02-15',1,'08:00:00','13:30:00',27),(100,1,3,'2018-02-16',1,'08:00:00','13:30:00',27),(101,1,5,'2018-02-13',1,'12:00:00','18:00:00',27),(102,1,5,'2018-02-14',1,'12:00:00','18:00:00',27),(103,1,5,'2018-02-15',1,'12:00:00','18:00:00',27),(104,1,5,'2018-02-16',1,'12:00:00','18:00:00',27),(105,1,3,'2018-02-18',1,'12:00:00','18:00:00',27),(106,1,3,'2018-02-19',1,'12:00:00','18:00:00',27),(107,1,3,'2018-02-20',1,'12:00:00','18:00:00',27),(108,1,5,'2018-02-19',1,'08:00:00','16:00:00',27),(109,1,5,'2018-02-20',1,'08:00:00','16:00:00',27),(110,1,5,'2018-02-21',1,'08:00:00','16:00:00',27),(111,1,5,'2018-02-22',1,'08:00:00','16:00:00',27),(112,1,5,'2018-02-23',1,'08:00:00','16:00:00',27),(113,1,7,'2018-02-20',1,'09:00:00','17:00:00',27),(114,1,7,'2018-02-21',1,'09:00:00','17:00:00',27),(115,1,7,'2018-02-22',1,'09:00:00','17:00:00',27),(116,1,7,'2018-02-23',1,'09:00:00','17:00:00',27),(117,1,7,'2018-02-26',1,'09:00:00','17:00:00',27),(118,1,7,'2018-02-27',1,'09:00:00','17:00:00',27),(119,1,7,'2018-02-28',1,'09:00:00','17:00:00',27),(120,1,5,'2018-02-26',1,'12:00:00','18:00:00',27),(121,1,5,'2018-02-27',1,'12:00:00','18:00:00',27),(122,1,5,'2018-02-28',1,'12:00:00','18:00:00',27),(123,1,3,'2018-02-24',1,'08:00:00','16:00:00',27),(124,1,3,'2018-02-25',1,'08:00:00','16:00:00',27),(125,1,3,'2018-02-26',1,'08:00:00','16:00:00',27),(126,1,3,'2018-02-27',1,'08:00:00','16:00:00',27);
/*!40000 ALTER TABLE `schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(32) NOT NULL,
  `password` varchar(32) NOT NULL,
  `secondary_id` varchar(10) DEFAULT NULL,
  `enabled` tinyint(1) DEFAULT NULL,
  `changed_by` int(11) DEFAULT NULL,
  `change_ts` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_user_changed_by` (`changed_by`),
  CONSTRAINT `fk_user_changed_by` FOREIGN KEY (`changed_by`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (2,'admin','123456',NULL,1,2,'2018-01-12 07:47:26'),(3,'tester1','123456',NULL,1,2,'2018-01-12 07:49:39'),(4,'tester2','123456','hfdhdfhfd',1,7,'2018-01-29 09:27:49'),(5,'tester3','123456',NULL,1,2,'2018-01-12 07:49:39'),(6,'tester4','123456','666d',1,7,'2018-01-29 10:04:56'),(7,'visus','123456','testgsk',1,7,'2018-01-29 07:49:27');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_assignment`
--

DROP TABLE IF EXISTS `user_assignment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_assignment` (
  `user_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `org_unit_id` int(11) NOT NULL,
  `changed_by` int(11) DEFAULT NULL,
  `change_ts` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`start_date`),
  KEY `fk_user_assignment_changed_by` (`changed_by`),
  KEY `fk_user_assignment_org_unit_id` (`org_unit_id`),
  CONSTRAINT `fk_user_assignment_changed_by` FOREIGN KEY (`changed_by`) REFERENCES `user` (`id`),
  CONSTRAINT `fk_user_assignment_org_unit_id` FOREIGN KEY (`org_unit_id`) REFERENCES `org_unit` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_assignment`
--

LOCK TABLES `user_assignment` WRITE;
/*!40000 ALTER TABLE `user_assignment` DISABLE KEYS */;
INSERT INTO `user_assignment` VALUES (3,'2018-01-01',NULL,27,2,'2018-01-17 09:48:41'),(4,'2018-01-01','2018-01-28',28,7,'2018-01-24 11:37:14'),(4,'2018-01-29',NULL,32,7,'2018-01-29 09:27:33'),(5,'2018-01-01',NULL,27,7,'2018-02-03 22:55:55'),(6,'2018-01-01','2018-01-31',27,7,'2018-02-08 10:20:51'),(7,'2017-10-01','2017-12-31',30,7,'2018-01-22 08:01:20'),(7,'2018-01-01','2018-02-28',27,7,'2018-02-12 08:01:43'),(7,'2018-03-01',NULL,33,7,'2018-01-23 09:11:44');
/*!40000 ALTER TABLE `user_assignment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_contract`
--

DROP TABLE IF EXISTS `user_contract`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_contract` (
  `user_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `contract_type_id` smallint(6) NOT NULL,
  `max_hours` decimal(4,2) DEFAULT '0.00',
  `min_hours` decimal(4,2) DEFAULT '0.00',
  `changed_by` int(11) DEFAULT NULL,
  `change_ts` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`start_date`),
  KEY `fk_user_contract_changed_by` (`changed_by`),
  CONSTRAINT `fk_user_contract_changed_by` FOREIGN KEY (`changed_by`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_contract`
--

LOCK TABLES `user_contract` WRITE;
/*!40000 ALTER TABLE `user_contract` DISABLE KEYS */;
INSERT INTO `user_contract` VALUES (0,'2018-01-01','2018-01-30',4,30.00,15.00,7,'2018-01-29 07:08:43'),(3,'2018-01-01',NULL,1,0.00,0.00,2,'2018-01-12 08:27:30'),(4,'2018-01-01','2018-01-28',2,30.00,0.00,7,'2018-01-29 09:23:10'),(4,'2018-01-29',NULL,1,40.00,40.00,7,'2018-01-29 09:26:54'),(5,'2018-01-01',NULL,4,0.00,0.00,2,'2018-01-12 08:30:06'),(6,'2018-01-01','2018-01-31',5,0.00,0.00,7,'2018-02-08 10:15:15'),(7,'2017-01-01','2017-12-31',1,40.00,10.00,7,'2018-01-22 13:57:57'),(7,'2018-01-01','2018-01-30',4,30.00,10.00,7,'2018-01-23 11:36:01'),(7,'2018-01-31',NULL,4,30.00,10.00,7,'2018-01-22 11:50:46');
/*!40000 ALTER TABLE `user_contract` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_personal`
--

DROP TABLE IF EXISTS `user_personal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_personal` (
  `user_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `first_name` varchar(32) NOT NULL,
  `last_name` varchar(32) NOT NULL,
  `middle_name` varchar(32) DEFAULT NULL,
  `birth_date` date NOT NULL,
  `phone` varchar(24) DEFAULT NULL,
  `email` varchar(320) DEFAULT NULL,
  `changed_by` int(11) DEFAULT NULL,
  `change_ts` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`start_date`),
  KEY `fk_user_personal_changed_by` (`changed_by`),
  CONSTRAINT `fk_user_personal_changed_by` FOREIGN KEY (`changed_by`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_personal`
--

LOCK TABLES `user_personal` WRITE;
/*!40000 ALTER TABLE `user_personal` DISABLE KEYS */;
INSERT INTO `user_personal` VALUES (0,'2018-01-01','2018-01-31','Ville','Susi','test','1981-07-13','666 666 666','hotmale@microhard.com',7,'2018-01-29 07:00:45'),(2,'2018-01-01',NULL,'Sheev','Palpatine',NULL,'1945-05-06',NULL,NULL,2,'2018-01-12 08:39:41'),(3,'2018-01-01',NULL,'Bill','Clinton',NULL,'1951-06-14',NULL,NULL,2,'2018-01-12 08:39:41'),(4,'2018-01-01','2018-01-28','Vladimir','Putin','','1968-09-02','','',7,'2018-01-24 11:36:50'),(4,'2018-01-29',NULL,'Vladimir','Putin','','1968-09-02','1234567','',7,'2018-01-29 09:26:32'),(5,'2018-01-01',NULL,'Tarja','Halonen',NULL,'1979-03-20',NULL,NULL,2,'2018-01-12 08:39:41'),(6,'2018-01-01',NULL,'Tony','Blair',NULL,'1995-07-10',NULL,NULL,2,'2018-01-12 08:39:41'),(7,'2017-10-01','2017-12-31','Ville','Susi',NULL,'1981-07-13','123456789','myemail@company.com',2,'2018-01-18 10:08:05'),(7,'2018-01-01','2018-01-31','Ville','Susi','My test','1981-07-13','666 666 666','hotmale@microhard.com',7,'2018-01-29 07:08:16'),(7,'2018-02-01','2018-02-15','Ville','Susi','Juhani','1981-07-13','+358 555 111 20','myemail@company.com',7,'2018-02-02 17:17:26'),(7,'2018-02-16','2018-04-09','Wille','Susi','Juhani','1981-07-13','+358 555 111 20','myemail@company.com',7,'2018-02-02 17:20:12'),(7,'2018-04-10',NULL,'Ville','Susi','Superfly','1981-07-13','555 222 333','new rec',7,'2018-01-19 13:55:00');
/*!40000 ALTER TABLE `user_personal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_role`
--

DROP TABLE IF EXISTS `user_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_role` (
  `user_id` int(11) NOT NULL,
  `role_id` smallint(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_role`
--

LOCK TABLES `user_role` WRITE;
/*!40000 ALTER TABLE `user_role` DISABLE KEYS */;
INSERT INTO `user_role` VALUES (2,1),(2,2),(2,3),(3,3),(5,3),(7,1),(7,2),(7,3),(4,2),(4,3),(6,3),(6,4),(-10,3);
/*!40000 ALTER TABLE `user_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_roles` (
  `user_role_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(32) NOT NULL,
  `role` varchar(32) NOT NULL,
  PRIMARY KEY (`user_role_id`),
  UNIQUE KEY `uni_username_role` (`role`,`username`),
  KEY `fk_username_idx` (`username`),
  CONSTRAINT `fk_username` FOREIGN KEY (`username`) REFERENCES `users` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (2,'visus','ROLE_ADMIN'),(3,'emves','ROLE_USER'),(1,'visus','ROLE_USER');
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `username` varchar(32) NOT NULL,
  `firstname` varchar(32) DEFAULT NULL,
  `lastname` varchar(32) DEFAULT NULL,
  `password` varchar(32) NOT NULL,
  `enabled` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('emves','Emilia','Vesterinen','abcdef',1),('visus','Ville','Susi','123456',1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `work_time`
--

DROP TABLE IF EXISTS `work_time`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `work_time` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `org_unit_id` int(11) NOT NULL,
  `stamp_in` timestamp NULL DEFAULT NULL,
  `stamp_out` timestamp NULL DEFAULT NULL,
  `date_in` date DEFAULT NULL,
  `date_out` date DEFAULT NULL,
  `rounded_in_time` time DEFAULT NULL,
  `rounded_out_time` time DEFAULT NULL,
  `changed_by` int(11) NOT NULL,
  `change_ts` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_work_time_user_id` (`user_id`),
  KEY `fk_work_time_org_unit_id` (`org_unit_id`),
  KEY `fk_work_time_changed_by` (`changed_by`),
  CONSTRAINT `fk_work_time_changed_by` FOREIGN KEY (`changed_by`) REFERENCES `user` (`id`),
  CONSTRAINT `fk_work_time_org_unit_id` FOREIGN KEY (`org_unit_id`) REFERENCES `org_unit` (`id`),
  CONSTRAINT `fk_work_time_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `work_time`
--

LOCK TABLES `work_time` WRITE;
/*!40000 ALTER TABLE `work_time` DISABLE KEYS */;
INSERT INTO `work_time` VALUES (31,7,29,'2018-02-05 05:59:00','2018-02-05 14:57:00','2018-02-05','2018-02-05',NULL,NULL,7,'2018-02-15 08:50:00'),(32,7,27,'2018-02-07 06:00:00','2018-02-07 13:04:00','2018-02-07','2018-02-07',NULL,NULL,7,'2018-02-15 08:09:52'),(33,7,27,NULL,NULL,NULL,NULL,NULL,NULL,7,'2018-02-15 08:30:46'),(34,7,27,NULL,NULL,NULL,NULL,NULL,NULL,7,'2018-02-15 08:32:39'),(35,7,27,NULL,NULL,NULL,NULL,NULL,NULL,7,'2018-02-15 08:38:18'),(36,7,27,'2018-02-07 15:00:00','2018-02-07 19:00:00','2018-02-07','2018-02-07',NULL,NULL,7,'2018-02-15 09:58:53'),(37,7,27,'2018-02-12 05:54:00','2018-02-12 14:03:00','2018-02-12','2018-02-12','07:54:00','16:03:00',7,'2018-02-15 13:50:40'),(38,7,27,'2018-02-13 05:49:00','2018-02-13 13:56:00','2018-02-13','2018-02-13','07:49:00','15:56:00',7,'2018-02-15 13:50:45'),(39,7,28,'2018-02-12 14:29:00','2018-02-12 19:59:00','2018-02-12','2018-02-12','16:29:00','21:59:00',7,'2018-02-15 13:50:43'),(40,7,27,'2018-02-11 03:00:00','2018-02-11 12:30:00','2018-02-11','2018-02-11',NULL,NULL,7,'2018-02-15 10:27:39'),(41,7,27,'2018-02-11 13:00:00','2018-02-11 16:02:00','2018-02-11','2018-02-11',NULL,NULL,7,'2018-02-15 10:27:56'),(42,7,27,'2018-02-20 06:55:00','2018-02-20 15:05:00','2018-02-20','2018-02-20','09:00:00','17:00:00',7,'2018-02-15 14:00:55'),(43,7,27,'2018-02-20 06:05:00','2018-02-20 14:30:00','2018-02-20','2018-02-20','08:05:00','16:30:00',7,'2018-02-15 14:01:12'),(44,5,27,'2018-02-12 09:55:00','2018-02-12 14:00:00','2018-02-12','2018-02-12','11:55:00','16:00:00',7,'2018-02-15 14:03:54'),(45,5,27,'2018-02-13 09:55:00','2018-02-13 14:00:00','2018-02-13','2018-02-13','12:00:00','16:00:00',7,'2018-02-15 14:06:03');
/*!40000 ALTER TABLE `work_time` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-02-15 16:07:53
