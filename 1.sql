-- --------------------------------------------------------
-- Хост:                         127.0.0.1
-- Версия сервера:               5.7.11-log - MySQL Community Server (GPL)
-- Операционная система:         Win64
-- HeidiSQL Версия:              9.4.0.5125
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Дамп структуры базы данных db_anchat
DROP DATABASE IF EXISTS `db_anchat`;
CREATE DATABASE IF NOT EXISTS `db_anchat` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `db_anchat`;

-- Дамп структуры для таблица db_anchat.tbl_activation
DROP TABLE IF EXISTS `tbl_activation`;
CREATE TABLE IF NOT EXISTS `tbl_activation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `sent_dt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `FK__tbl_users_act` FOREIGN KEY (`user_id`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Активация по мейлу';

-- Экспортируемые данные не выделены.
-- Дамп структуры для таблица db_anchat.tbl_friendlist
DROP TABLE IF EXISTS `tbl_friendlist`;
CREATE TABLE IF NOT EXISTS `tbl_friendlist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `friend_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK__tbl_users_friendfrom` (`user_id`),
  KEY `FK__tbl_users_friendto` (`friend_id`),
  CONSTRAINT `FK__tbl_users_friendfrom` FOREIGN KEY (`user_id`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK__tbl_users_friendto` FOREIGN KEY (`friend_id`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Экспортируемые данные не выделены.
-- Дамп структуры для таблица db_anchat.tbl_reg_ignore
DROP TABLE IF EXISTS `tbl_reg_ignore`;
CREATE TABLE IF NOT EXISTS `tbl_reg_ignore` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `ignored_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK__tbl_users_ignfrom` (`user_id`),
  KEY `FK__tbl_users_ignto` (`ignored_id`),
  CONSTRAINT `FK__tbl_users_ignfrom` FOREIGN KEY (`user_id`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK__tbl_users_ignto` FOREIGN KEY (`ignored_id`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Экспортируемые данные не выделены.
-- Дамп структуры для таблица db_anchat.tbl_resetpass
DROP TABLE IF EXISTS `tbl_resetpass`;
CREATE TABLE IF NOT EXISTS `tbl_resetpass` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `sent_dt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `FK__tbl_users_rp` FOREIGN KEY (`user_id`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Сброс пароля для пользователей по мейлу';

-- Экспортируемые данные не выделены.
-- Дамп структуры для таблица db_anchat.tbl_sessions
DROP TABLE IF EXISTS `tbl_sessions`;
CREATE TABLE IF NOT EXISTS `tbl_sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `session_cookie` varchar(32) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `last_activity` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Экспортируемые данные не выделены.
-- Дамп структуры для таблица db_anchat.tbl_users
DROP TABLE IF EXISTS `tbl_users`;
CREATE TABLE IF NOT EXISTS `tbl_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_email` varchar(100) NOT NULL,
  `user_pass` varchar(256) NOT NULL,
  `user_about` varchar(300) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_email` (`user_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Зарегистрированные пользователи ресурса\r\npass+salt!';

-- Экспортируемые данные не выделены.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
