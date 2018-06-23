-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.1.30-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win32
-- HeidiSQL Version:             9.5.0.5196
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for eventdata
CREATE DATABASE IF NOT EXISTS `eventdata` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci */;
USE `eventdata`;

-- Dumping structure for table eventdata.booking
CREATE TABLE IF NOT EXISTS `booking` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bookingid` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `fromdate` datetime DEFAULT CURRENT_TIMESTAMP,
  `todate` datetime DEFAULT CURRENT_TIMESTAMP,
  `customer` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `numberOfPpl` int(11) DEFAULT NULL,
  `allItems` varchar(5000) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'item:quantity:price, item:quantity:price.....',
  `allHall` varchar(5000) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'hall:price, hall:price',
  `damage` bigint(20) DEFAULT NULL,
  `gst` bigint(20) DEFAULT NULL,
  `service_tax` bigint(20) DEFAULT NULL,
  `total` bigint(20) DEFAULT NULL,
  `paid` bigint(20) DEFAULT NULL,
  `invoice_num` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `gst_num` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `bookingid` (`bookingid`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table eventdata.booking: ~6 rows (approximately)
DELETE FROM `booking`;
/*!40000 ALTER TABLE `booking` DISABLE KEYS */;
INSERT INTO `booking` (`id`, `bookingid`, `fromdate`, `todate`, `customer`, `phone`, `address`, `email`, `numberOfPpl`, `allItems`, `allHall`, `damage`, `gst`, `service_tax`, `total`, `paid`, `invoice_num`, `gst_num`, `created_on`, `updated_on`) VALUES
	(1, 'b-2018-june-09-16-55', '2018-06-11 16:21:19', '2018-06-12 16:21:19', 'Obama Singh', '8877886677', '101, Chor Bazar, Chinch Pokli, Mumbai, Maharastra', 'abc@wewewe.com', 800, 'Pillow:4:20,table:100:100,chair:200:50', 'First hall:10000', 70000, 100000, 8000, 300000, 160000, '648092', '22332200', '2018-06-10 17:01:40', '2018-06-16 15:50:20'),
	(2, 'b-2018-june-09-17-01', '2018-06-14 16:21:19', '2018-06-17 16:21:19', 'Ram Singh Jorge', '9077886677', '201, Bada Bazar, St  Marks, Bangalore, Karnataka', 'ram@gmail.com', 500, 'Pillow:10:10,table:300:200', 'First hall:10000,Delux hall:41000', 80000, 200000, 5000, 200000, 200000, '648093', '22332201', '2018-06-10 17:04:06', '2018-06-16 15:50:32'),
	(4, 'B-2018-June-21-0-12-47', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Varun Singh', '4578690445', 'Anant Niwas, C/o Parmanand Prasad, Bapu Nagar, north Mandiri', '24x7varun@gmail.com', 500, '', 'Delux Hall:300000', 400, 400, 200, 302000, 6000, 'In001', 'GST 001', '2018-06-21 00:12:47', '2018-06-21 00:12:47'),
	(6, 'B-2018-June-20-22-47-47', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Varun', '7764567889', 'Anant Niwas, C/o Parmanand Prasad, Bapu Nagar, north Mandiri', '24x7varun@gmail.com', 800, '', 'Special Hall:70000', 500, 200, 200, 71490, 5000, 'Test00', 'Test001', '2018-06-21 00:23:24', '2018-06-21 00:23:24'),
	(7, 'B-2018-June-20-22-47-48', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'VarunVed', '776007889', 'Anant Niwas, C/o Parmanand Prasad, Bapu Nagar, north Mandiri', '24x7varun@gmail.com', 800, '', 'Special Hall:70000', 500, 200, 200, 71490, 5000, 'Test02', 'Test002', '2018-06-21 00:26:02', '2018-06-21 00:26:02'),
	(8, 'B-2018-June-20-22-47-49', '2018-06-22 00:00:00', '2018-06-24 00:00:00', 'Vikky', '700007889', 'Anant Niwas, C/o Parmanand Prasad, Bapu Nagar, north Mandiri', '24x7varun@gmail.com', 800, '', 'Special Hall:70000', 500, 200, 200, 71490, 6000, 'Test03', 'Test003', '2018-06-21 00:30:43', '2018-06-21 00:30:43'),
	(9, 'B-2018-June-21-0-38-39', '2018-06-27 00:00:00', '2018-06-29 00:00:00', 'Navin Singh', '563456776', 'Anant Niwas, C/o Parmanand Prasad, Bapu Nagar, north Mandiri', '24x7varun@gmail.com', 700, '', 'Special Hall:70000', 600, 0, 400, 80000, 9000, 'In004', 'GST 004', '2018-06-21 00:38:39', '2018-06-21 00:38:39');
/*!40000 ALTER TABLE `booking` ENABLE KEYS */;

-- Dumping structure for table eventdata.hall
CREATE TABLE IF NOT EXISTS `hall` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hallid` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `status` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `type` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'AC/NON-AC',
  `description` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `price` bigint(20) DEFAULT NULL,
  `capacity` bigint(20) DEFAULT NULL,
  `created_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `bookingid` (`hallid`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table eventdata.hall: ~4 rows (approximately)
DELETE FROM `hall`;
/*!40000 ALTER TABLE `hall` DISABLE KEYS */;
INSERT INTO `hall` (`id`, `hallid`, `name`, `status`, `type`, `description`, `price`, `capacity`, `created_on`, `updated_on`) VALUES
	(1, 'h-2028-june-09-14-13', 'First Hall', 'Clean', 'NON-AC', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s', 50000, 3000, '2018-06-10 16:16:22', '2018-06-10 16:16:22'),
	(2, 'h-2028-june-09-14-18', 'SecondHall', 'Dirty', 'NON-AC', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s', 50000, 1000, '2018-06-10 16:18:55', '2018-06-10 16:18:55'),
	(3, 'h-2028-june-09-14-19', 'Special Hall', 'Under Repair', 'AC', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s', 70000, 4000, '2018-06-10 16:20:05', '2018-06-10 16:20:05'),
	(4, 'h-2028-june-09-14-20', 'Delux Hall', 'Clean', 'AC', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s', 300000, 1000, '2018-06-10 16:21:19', '2018-06-10 16:21:37'),
	(5, 'H-2018-June-23-0-26-38', 'Mast Hall', 'Under Repair', 'AC', 'Ek dum dhansu hall hai', 300000, 2000, '2018-06-23 00:26:38', '2018-06-23 00:27:17');
/*!40000 ALTER TABLE `hall` ENABLE KEYS */;

-- Dumping structure for table eventdata.item
CREATE TABLE IF NOT EXISTS `item` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `itemid` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `price` bigint(20) NOT NULL,
  `status` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT 'active/not-active',
  `created_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `itemid` (`itemid`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table eventdata.item: ~6 rows (approximately)
DELETE FROM `item`;
/*!40000 ALTER TABLE `item` DISABLE KEYS */;
INSERT INTO `item` (`id`, `itemid`, `name`, `price`, `status`, `created_on`, `updated_on`) VALUES
	(1, 'i-2028-june-09-14-20', 'Pillow', 50, 'Active', '2018-06-10 16:50:31', '2018-06-16 23:10:46'),
	(2, 'i-2028-june-09-16-51', 'Bed-Sheet', 100, 'Active', '2018-06-10 16:51:48', '2018-06-16 23:12:51'),
	(3, 'i-2018-june-09-16-52', 'Table', 100, 'Active', '2018-06-10 16:52:18', '2018-06-16 23:12:55'),
	(4, 'i-2018-june-09-16-53', 'Chair', 50, 'Active', '2018-06-10 16:52:27', '2018-06-16 23:13:00'),
	(5, 'i-2018-june-09-16-54', 'Zazim', 0, 'Active', '2018-06-10 16:52:39', '2018-06-10 16:52:39'),
	(6, 'i-2018-june-09-16-56', 'Glass', 0, 'Not-Active', '2018-06-10 16:53:22', '2018-06-10 16:53:22'),
	(7, 'I-2018-June-23-0-19-19', 'Jhakkas Item', 500, 'Active', '2018-06-23 00:19:20', '2018-06-23 00:19:20');
/*!40000 ALTER TABLE `item` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
