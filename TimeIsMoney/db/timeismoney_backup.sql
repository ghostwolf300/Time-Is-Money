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
INSERT INTO `user` VALUES (2,'admin','123456',NULL,1,2,'2018-01-12 07:47:26'),(3,'tester1','123456',NULL,1,2,'2018-01-12 07:49:39'),(4,'tester2','123456',NULL,1,2,'2018-01-12 07:49:39'),(5,'tester3','123456',NULL,1,2,'2018-01-12 07:49:39'),(6,'tester4','123456',NULL,1,2,'2018-01-12 07:49:41'),(7,'visus','123456',NULL,1,2,'2018-01-12 07:50:42');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
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
INSERT INTO `user_contract` VALUES (3,'2018-01-01',NULL,1,0.00,0.00,2,'2018-01-12 08:27:30'),(4,'2018-01-01',NULL,2,0.00,0.00,2,'2018-01-12 08:30:06'),(5,'2018-01-01',NULL,4,0.00,0.00,2,'2018-01-12 08:30:06'),(6,'2018-01-01',NULL,5,0.00,0.00,2,'2018-01-12 08:30:06'),(7,'2018-01-01',NULL,5,0.00,0.00,2,'2018-01-12 08:30:08');
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
INSERT INTO `user_personal` VALUES (2,'2018-01-01',NULL,'Sheev','Palpatine',NULL,'1945-05-06',NULL,NULL,2,'2018-01-12 08:39:41'),(3,'2018-01-01',NULL,'Bill','Clinton',NULL,'1951-06-14',NULL,NULL,2,'2018-01-12 08:39:41'),(4,'2018-01-01',NULL,'Vladimir','Putin',NULL,'1968-09-02',NULL,NULL,2,'2018-01-12 08:39:41'),(5,'2018-01-01',NULL,'Tarja','Halonen',NULL,'1979-03-20',NULL,NULL,2,'2018-01-12 08:39:41'),(6,'2018-01-01',NULL,'Tony','Blair',NULL,'1995-07-10',NULL,NULL,2,'2018-01-12 08:39:41'),(7,'2018-01-01',NULL,'Ville','Susi',NULL,'1981-07-13',NULL,NULL,2,'2018-01-12 08:40:08');
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
INSERT INTO `user_role` VALUES (2,1),(2,2),(2,3),(3,3),(4,3),(5,3),(6,3),(6,4),(7,1),(7,2),(7,3),(7,4);
/*!40000 ALTER TABLE `user_role` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-01-12 16:15:17
