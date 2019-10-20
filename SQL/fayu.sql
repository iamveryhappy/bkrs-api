-- MySQL dump 10.13  Distrib 5.7.24, for Win64 (x86_64)
--
-- Host: localhost    Database: fayu
-- ------------------------------------------------------
-- Server version	5.7.24-log

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
-- Current Database: `fayu`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `fayu` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci */;

USE `fayu`;

--
-- Table structure for table `chapters`
--

DROP TABLE IF EXISTS `chapters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chapters` (
  `c_id` int(5) NOT NULL AUTO_INCREMENT,
  `c_current` int(1) DEFAULT '0',
  `c_chapter` varchar(255) NOT NULL,
  PRIMARY KEY (`c_id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8 COMMENT='fayu text chapters';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chapters`
--

LOCK TABLES `chapters` WRITE;
/*!40000 ALTER TABLE `chapters` DISABLE KEYS */;
INSERT INTO `chapters` VALUES (1,0,'第一節 字和詞'),(2,0,'第二節 詞類'),(3,0,'第三節 詞品'),(4,0,'第四節 仂語'),(5,0,'第五節 句子'),(6,0,'第六節 句子形式和謂語形式'),(7,0,'第七節 敍述句'),(8,0,'第八節 描寫句和判斷句'),(9,0,'第九節 複合句'),(10,0,'第十節 能願式'),(11,0,'第十一節 使成式'),(12,0,'第十二節 處置式'),(13,0,'第十三節 被動式'),(14,1,'第十四節 遞繫式'),(15,0,'第十五節 緊縮式'),(16,0,'第十六節 次品補語和末品補語'),(17,0,'第十七節 繫詞'),(18,0,'第十八節 否定作用'),(19,0,'第十九節 副詞'),(20,0,'第二十節 記號'),(21,0,'第二十一節 情貎'),(22,0,'第二十二節 語氣'),(23,0,'第二十三節 語氣末品'),(24,0,'第二十四節 聯結詞'),(25,0,'第二十五節 關係末品'),(26,0,'第二十六節 人稱代詞'),(27,0,'第二十七節 無定代詞，複指代詞等'),(28,0,'第二十八節 指示代詞'),(29,0,'第二十九節 疑問代詞'),(30,0,'第三十節 基數，序數，問數法'),(31,0,'第三十一節 《一》，《一個》'),(32,0,'第三十二節 人物的稱數法'),(33,0,'第三十三節 行爲的稱數法'),(34,0,'第三十四節 疊字，疊詞，對立語'),(35,0,'第三十五節 併合語，化合語，成語'),(36,0,'第三十六節 擬聲法和繪景法'),(37,0,'第三十七節 複説法'),(38,0,'第三十八節 承説法和省略法'),(39,0,'第三十九節 倒裝法和插語法'),(40,0,'第四十節 情緒的呼聲義的呼聲'),(41,0,'第四十一節 複音詞的創造'),(42,0,'第四十二節 主語和繫詞的增加'),(43,0,'第四十三節 句子延長'),(44,0,'第四十四節 可能式，被動式，記號的歐化'),(45,0,'第四十五節 聯結成分的歐化'),(46,0,'第四十六節 新替代法和新稱數法'),(47,0,'附錄一 語'),(48,0,'附錄二 文字'),(49,0,'附錄三 標點和格式');
/*!40000 ALTER TABLE `chapters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fayu_hi`
--

DROP TABLE IF EXISTS `fayu_hi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fayu_hi` (
  `fa_id` int(11) NOT NULL AUTO_INCREMENT,
  `bh_id` int(11) NOT NULL,
  `bh_has_tr` int(1) NOT NULL DEFAULT '0',
  `bh_hex` varchar(45) DEFAULT NULL,
  `bh_sm` varchar(255) DEFAULT NULL,
  `bh_tr` varchar(255) DEFAULT NULL,
  `bh_pin` varchar(255) DEFAULT NULL,
  `bh_trans` text,
  PRIMARY KEY (`fa_id`),
  UNIQUE KEY `bh_id_UNIQUE` (`bh_id`),
  KEY `bh_id` (`bh_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COMMENT='single characters';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fayu_hi`
--

LOCK TABLES `fayu_hi` WRITE;
/*!40000 ALTER TABLE `fayu_hi` DISABLE KEYS */;
/*!40000 ALTER TABLE `fayu_hi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fayu_word`
--

DROP TABLE IF EXISTS `fayu_word`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fayu_word` (
  `faw_id` int(11) NOT NULL AUTO_INCREMENT,
  `bw_id` int(11) NOT NULL,
  `bw_bh_id` int(11) NOT NULL,
  `bw_has_tr` int(1) NOT NULL DEFAULT '0',
  `bw_length` int(11) DEFAULT NULL,
  `bw_sm` varchar(255) DEFAULT NULL,
  `bw_tr` varchar(255) DEFAULT NULL,
  `bw_pin` varchar(255) DEFAULT NULL,
  `bw_trans` text,
  PRIMARY KEY (`faw_id`),
  UNIQUE KEY `bw_id_UNIQUE` (`bw_id`),
  KEY `bw_id` (`bw_id`),
  KEY `bw_bh_id` (`bw_bh_id`),
  KEY `bw_has_tr` (`bw_has_tr`),
  FULLTEXT KEY `bw_sm` (`bw_sm`),
  FULLTEXT KEY `bw_tr` (`bw_tr`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COMMENT='word list per hieroglyph';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fayu_word`
--

LOCK TABLES `fayu_word` WRITE;
/*!40000 ALTER TABLE `fayu_word` DISABLE KEYS */;
/*!40000 ALTER TABLE `fayu_word` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `texts`
--

DROP TABLE IF EXISTS `texts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `texts` (
  `t_id` int(11) NOT NULL AUTO_INCREMENT,
  `t_c_id` int(5) NOT NULL,
  `t_raw` text NOT NULL,
  `t_mark` text NOT NULL,
  PRIMARY KEY (`t_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='fayu texts';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `texts`
--

LOCK TABLES `texts` WRITE;
/*!40000 ALTER TABLE `texts` DISABLE KEYS */;
/*!40000 ALTER TABLE `texts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `zici_texts`
--

DROP TABLE IF EXISTS `zici_texts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `zici_texts` (
  `zct_id` int(11) NOT NULL AUTO_INCREMENT,
  `zct_t_id` int(11) DEFAULT NULL,
  `zct_bh_id` int(11) DEFAULT NULL,
  `zct_bw_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`zct_id`),
  KEY `zct_t_id` (`zct_t_id`),
  KEY `zct_bh_id` (`zct_bh_id`),
  KEY `zct_bw_id` (`zct_bw_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='fayu texts2zi_ci';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `zici_texts`
--

LOCK TABLES `zici_texts` WRITE;
/*!40000 ALTER TABLE `zici_texts` DISABLE KEYS */;
/*!40000 ALTER TABLE `zici_texts` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-10-20 21:32:26
