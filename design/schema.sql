-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: areabazaar
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auction_sessions`
--

DROP TABLE IF EXISTS `auction_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auction_sessions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `session_name` varchar(255) NOT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `status` enum('Draft','Ready','Active','Ended','Cancelled') DEFAULT 'Draft',
  `current_wave_id` bigint(20) unsigned DEFAULT NULL,
  `senior_admin_approval` tinyint(1) DEFAULT 0,
  `time_created` timestamp NOT NULL DEFAULT current_timestamp(),
  `type` enum('foodies-auction','thrifts-auction','clearance-auction','pots-auction','combos-auction','split-auction','mixed-auction','after-auction') DEFAULT 'mixed-auction',
  `target_zone` int(10) unsigned DEFAULT NULL,
  `target_revenue` decimal(15,2) DEFAULT 0.00,
  `charge_admin` int(10) unsigned DEFAULT NULL,
  `charge_sales` int(10) unsigned DEFAULT NULL,
  `charge_whm` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `audit_logs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `user_type` enum('Customer','Staff','Partner') DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `entity_affected` varchar(100) DEFAULT NULL,
  `old_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`old_data`)),
  `new_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`new_data`)),
  `ip_address` varchar(45) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `bank_reports`
--

DROP TABLE IF EXISTS `bank_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bank_reports` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `transaction_date` date DEFAULT NULL,
  `raw_narration` text DEFAULT NULL,
  `amount` decimal(15,2) DEFAULT NULL,
  `bank_ref` varchar(100) DEFAULT NULL,
  `extraction_source` varchar(50) DEFAULT NULL,
  `status` enum('Unreconciled','Reconciled','amount-mismatch','orphaned') DEFAULT 'Unreconciled',
  `time_recorded` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `bank_ref` (`bank_ref`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `base_products`
--

DROP TABLE IF EXISTS `base_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `base_products` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `product_name` varchar(255) NOT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `bulk_purchase_price` decimal(15,2) DEFAULT NULL,
  `bulk_purchase_unit` varchar(50) DEFAULT NULL,
  `unit_handling_cost` decimal(10,2) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `main_photo` varchar(255) DEFAULT NULL,
  `added_by` int(10) unsigned DEFAULT NULL,
  `time_created` timestamp NOT NULL DEFAULT current_timestamp(),
  `admin_approval` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `commissions`
--

DROP TABLE IF EXISTS `commissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `commissions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `partner_id` int(10) unsigned NOT NULL,
  `order_id` bigint(20) unsigned NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `status` enum('Pending','Approved','Credited') DEFAULT 'Pending',
  `time_created` timestamp NOT NULL DEFAULT current_timestamp(),
  `time_approved` datetime DEFAULT NULL,
  `time_credited` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `partner_id` (`partner_id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `commissions_ibfk_1` FOREIGN KEY (`partner_id`) REFERENCES `partners` (`id`),
  CONSTRAINT `commissions_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `coverage_areas`
--

DROP TABLE IF EXISTS `coverage_areas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `coverage_areas` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `area_name` varchar(100) NOT NULL,
  `parent_zone_id` int(10) unsigned DEFAULT NULL,
  `status` enum('Pending','Active','Suspended') DEFAULT 'Active',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customers` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `location_area_id` int(10) unsigned DEFAULT NULL,
  `associated_ref_code` varchar(50) DEFAULT NULL,
  `verification_status` tinyint(1) DEFAULT 0,
  `contact_info` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`contact_info`)),
  `delivery_passcode` varchar(10) DEFAULT NULL,
  `auth_pin` char(4) DEFAULT NULL,
  `added_by` enum('user','admin','system') DEFAULT 'user',
  `time_created` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('Active','Suspended','Flagged') DEFAULT 'Active',
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone_number` (`phone_number`),
  KEY `idx_phone` (`phone_number`),
  KEY `idx_ref` (`associated_ref_code`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `delivery_routes`
--

DROP TABLE IF EXISTS `delivery_routes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `delivery_routes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `route_name` varchar(100) NOT NULL,
  `area_id` int(10) unsigned DEFAULT NULL,
  `status` enum('Pending','Active','Suspended') DEFAULT 'Active',
  `charge_officer_id` int(10) unsigned DEFAULT NULL,
  `time_created` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `global_settings`
--

DROP TABLE IF EXISTS `global_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `global_settings` (
  `setting_key` varchar(50) NOT NULL,
  `setting_value` varchar(255) NOT NULL,
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hvp_shipping`
--

DROP TABLE IF EXISTS `hvp_shipping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hvp_shipping` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) unsigned DEFAULT NULL,
  `request_details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`request_details`)),
  `fee` decimal(15,2) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Requested',
  `time_created` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `operating_areas`
--

DROP TABLE IF EXISTS `operating_areas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `operating_areas` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `area_name` varchar(100) NOT NULL,
  `parent_zone_id` int(10) unsigned DEFAULT NULL,
  `charge_officer_id` int(10) unsigned DEFAULT NULL,
  `status` enum('Pending','Active','Suspended') DEFAULT 'Pending',
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `time_created` timestamp NOT NULL DEFAULT current_timestamp(),
  `type` enum('country-zone','sub-zone','area') DEFAULT 'area',
  PRIMARY KEY (`id`),
  UNIQUE KEY `area_name` (`area_name`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_items` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) unsigned NOT NULL,
  `show_product_id` bigint(20) unsigned NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `price_at_purchase` decimal(15,2) NOT NULL,
  `treatment_status` enum('Pending','Processing','Packed','Dispatched') DEFAULT 'Pending',
  `admin_approval_flag` tinyint(1) DEFAULT 0,
  `whm_status` enum('requested','supplied','QA-passed','packed','labelled','staging-land','staging-cleared','area-sorted','loaded','zbd-transit','area-land','area-cleared','dispatched') DEFAULT 'requested',
  `sba_status` varchar(50) DEFAULT 'Pending',
  `zbd_status` varchar(50) DEFAULT 'Pending',
  `delivery_status` varchar(50) DEFAULT 'Pending',
  `charge_whm` int(10) unsigned DEFAULT NULL,
  `charge_sba` int(10) unsigned DEFAULT NULL,
  `charge_zbd` int(10) unsigned DEFAULT NULL,
  `ship_notes` text DEFAULT NULL,
  `is_flagged` tinyint(1) DEFAULT 0,
  `is_hidden` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `show_product_id` (`show_product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`show_product_id`) REFERENCES `show_products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6004 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orders` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `total_amount` decimal(15,2) NOT NULL,
  `status` enum('Paid','AdminApproved','Processing','Shipped','Delivered','Cancelled') DEFAULT 'Paid',
  `delivery_passcode` varchar(10) DEFAULT NULL,
  `shipping_address_id` int(10) unsigned DEFAULT NULL,
  `admin_id` int(10) unsigned DEFAULT NULL,
  `time_created` timestamp NOT NULL DEFAULT current_timestamp(),
  `time_approved` datetime DEFAULT NULL,
  `time_delivered` datetime DEFAULT NULL,
  `assigned_to` int(10) unsigned DEFAULT NULL,
  `destination_area` text DEFAULT NULL,
  `request_xpd` varchar(50) DEFAULT NULL,
  `request_hvp` varchar(50) DEFAULT NULL,
  `is_urgent` tinyint(1) DEFAULT 0,
  `whm_notes` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `customers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5003 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `partner_remittances`
--

DROP TABLE IF EXISTS `partner_remittances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `partner_remittances` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `partner_id` int(10) unsigned NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `bank_ref` varchar(100) DEFAULT NULL,
  `status` enum('queued','approved','Sent','Acknowledge') DEFAULT 'queued',
  `time_sent` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `partner_id` (`partner_id`),
  CONSTRAINT `partner_remittances_ibfk_1` FOREIGN KEY (`partner_id`) REFERENCES `partners` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9012 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `partner_wallets`
--

DROP TABLE IF EXISTS `partner_wallets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `partner_wallets` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `partner_id` int(10) unsigned NOT NULL,
  `balance` decimal(15,2) DEFAULT 0.00,
  `threshold_limit` decimal(15,2) DEFAULT 100000.00,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `partner_id` (`partner_id`),
  CONSTRAINT `partner_wallets_ibfk_1` FOREIGN KEY (`partner_id`) REFERENCES `partners` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `partners`
--

DROP TABLE IF EXISTS `partners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `partners` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `partner_type` enum('SBA','ZBDp','Agent') NOT NULL,
  `business_name` varchar(255) DEFAULT NULL,
  `commission_rate` decimal(5,2) DEFAULT 0.00,
  `region_id` int(10) unsigned DEFAULT NULL,
  `contact_info` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`contact_info`)),
  `supply_categories` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`supply_categories`)),
  `vehicle_count` int(10) unsigned DEFAULT NULL,
  `documents_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`documents_json`)),
  `approval_status` enum('Pending','Approved','Rejected','Queried','Flagged') DEFAULT 'Pending',
  `approved_by` int(10) unsigned DEFAULT NULL,
  `approval_notes` text DEFAULT NULL,
  `onboarded_by` int(10) unsigned DEFAULT NULL,
  `time_approved` datetime DEFAULT NULL,
  `status` enum('Active','Suspended') DEFAULT 'Active',
  `time_created` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone_number` (`phone_number`),
  KEY `idx_approval` (`approval_status`),
  KEY `idx_type` (`partner_type`)
) ENGINE=InnoDB AUTO_INCREMENT=203 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `payment_reports`
--

DROP TABLE IF EXISTS `payment_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payment_reports` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `request_id` bigint(20) unsigned DEFAULT NULL,
  `invoice_refindex` varchar(20) NOT NULL,
  `sender_name` varchar(255) DEFAULT NULL,
  `amount_reported` decimal(15,2) DEFAULT NULL,
  `payment_date` datetime DEFAULT NULL,
  `receipt_path` varchar(255) DEFAULT NULL,
  `status` enum('Pending','AwaitingAdminApproval','Matched','Flagged','unremitted','amount-mismatch','orphaned','verified','Resolved') DEFAULT 'Pending',
  `time_reported` timestamp NOT NULL DEFAULT current_timestamp(),
  `submitter` enum('customer','agent','admin') DEFAULT 'customer',
  `submitter_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `request_id` (`request_id`),
  KEY `idx_ref` (`invoice_refindex`),
  CONSTRAINT `payment_reports_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `payment_requests` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `payment_requests`
--

DROP TABLE IF EXISTS `payment_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payment_requests` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `method` enum('Bank','Card','Agent') DEFAULT 'Bank',
  `invoice_refindex` varchar(20) NOT NULL,
  `status` enum('Pending','AwaitingAdminApproval','Resolved','Expired','Cancelled') DEFAULT 'Pending',
  `time_created` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `invoice_refindex` (`invoice_refindex`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `product_variants`
--

DROP TABLE IF EXISTS `product_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_variants` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `base_product_id` int(10) unsigned NOT NULL,
  `variant_name` varchar(255) NOT NULL,
  `quantity_value` decimal(10,2) DEFAULT NULL,
  `quantity_unit` varchar(20) DEFAULT NULL,
  `photo_path` varchar(255) DEFAULT NULL,
  `presentation_type` enum('Split-pack','Auction-unit') DEFAULT 'Auction-unit',
  `admin_approval` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  PRIMARY KEY (`id`),
  KEY `base_product_id` (`base_product_id`),
  CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`base_product_id`) REFERENCES `base_products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=256 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `queries`
--

DROP TABLE IF EXISTS `queries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `queries` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `subject_type` varchar(100) NOT NULL,
  `subject_id` bigint(20) unsigned NOT NULL,
  `creator_id` int(10) unsigned NOT NULL,
  `creator_role` varchar(50) NOT NULL,
  `assigned_to` int(10) unsigned DEFAULT NULL,
  `note` text NOT NULL,
  `flag_types` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`flag_types`)),
  `status` enum('Open','Closed','Archived') DEFAULT 'Open',
  `response` text DEFAULT NULL,
  `time_created` timestamp NOT NULL DEFAULT current_timestamp(),
  `time_resolved` datetime DEFAULT NULL,
  `priority` enum('Low','Normal','High','Critical') DEFAULT 'Normal',
  `assigned_role` varchar(50) DEFAULT NULL,
  `closed_by` int(10) unsigned DEFAULT NULL,
  `close_reason` text DEFAULT NULL,
  `last_activity` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `query_audit_log`
--

DROP TABLE IF EXISTS `query_audit_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `query_audit_log` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `query_id` bigint(20) unsigned NOT NULL,
  `actor_id` int(10) unsigned NOT NULL,
  `actor_role` varchar(50) NOT NULL,
  `action` varchar(100) NOT NULL,
  `detail` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_query` (`query_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `query_notifications`
--

DROP TABLE IF EXISTS `query_notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `query_notifications` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `query_id` bigint(20) unsigned NOT NULL,
  `recipient_id` int(10) unsigned NOT NULL,
  `recipient_role` varchar(50) NOT NULL,
  `type` enum('NewAssignment','NewResponse','PriorityChange','ThreadClosed') NOT NULL,
  `message` text DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_recipient` (`recipient_id`,`is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `query_response_notes`
--

DROP TABLE IF EXISTS `query_response_notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `query_response_notes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `response_id` bigint(20) unsigned NOT NULL,
  `author_id` int(10) unsigned NOT NULL,
  `author_role` varchar(50) NOT NULL,
  `note` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_response` (`response_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `query_responses`
--

DROP TABLE IF EXISTS `query_responses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `query_responses` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `query_id` bigint(20) unsigned NOT NULL,
  `responder_id` int(10) unsigned NOT NULL,
  `responder_role` varchar(50) NOT NULL,
  `message` text NOT NULL,
  `forwarded_to` int(10) unsigned DEFAULT NULL,
  `forwarded_role` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_query` (`query_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `readiness_check_logs`
--

DROP TABLE IF EXISTS `readiness_check_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `readiness_check_logs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `session_id` bigint(20) unsigned NOT NULL,
  `whm_staff_id` int(10) unsigned DEFAULT NULL,
  `admin_staff_id` int(10) unsigned DEFAULT NULL,
  `check_type` enum('Stock','Quality','Manpower','Logistics','Financial','Overall') NOT NULL,
  `status` enum('Pending','Verified','Flagged','Rejected') DEFAULT 'Pending',
  `comments` text DEFAULT NULL,
  `report_url` varchar(255) DEFAULT NULL,
  `report_metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`report_metadata`)),
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `session_id` (`session_id`),
  CONSTRAINT `readiness_check_logs_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `auction_sessions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sba_acquisitions`
--

DROP TABLE IF EXISTS `sba_acquisitions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sba_acquisitions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `sba_id` int(10) unsigned DEFAULT NULL,
  `base_product_id` bigint(20) unsigned DEFAULT NULL,
  `order_item_id` bigint(20) unsigned DEFAULT NULL,
  `total_qty` int(11) NOT NULL,
  `unit_cost` decimal(15,2) DEFAULT NULL,
  `remittance_status` enum('Pending','Paid','Acknowledged','Cancelled') DEFAULT 'Pending',
  `remittance_id` bigint(20) unsigned DEFAULT NULL,
  `time_recorded` timestamp NOT NULL DEFAULT current_timestamp(),
  `assign_status` enum('pending','approved','sbaAck','sbaRejected','cancelled','hanging') DEFAULT 'pending',
  `supply_status` enum('pending','acknowledged','supplied','QApassed','completed','QArejected','QArisk') DEFAULT 'pending',
  `time_assigned` datetime DEFAULT NULL,
  `time_approved` datetime DEFAULT NULL,
  `admin_notes` text DEFAULT NULL,
  `whm_notes` text DEFAULT NULL,
  `sba_notes` text DEFAULT NULL,
  `issue_type` varchar(100) DEFAULT NULL,
  `session_id` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sba_id` (`sba_id`),
  KEY `order_item_id` (`order_item_id`),
  CONSTRAINT `sba_acquisitions_ibfk_1` FOREIGN KEY (`sba_id`) REFERENCES `partners` (`id`),
  CONSTRAINT `sba_acquisitions_ibfk_2` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `settings` (
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shipping`
--

DROP TABLE IF EXISTS `shipping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shipping` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) unsigned NOT NULL,
  `zbdp_id` int(10) unsigned DEFAULT NULL,
  `transport_bill_amount` decimal(15,2) DEFAULT NULL,
  `current_status` varchar(50) DEFAULT NULL,
  `dispatch_time` datetime DEFAULT NULL,
  `delivery_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `zbdp_id` (`zbdp_id`),
  CONSTRAINT `shipping_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `shipping_ibfk_2` FOREIGN KEY (`zbdp_id`) REFERENCES `partners` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `show_products`
--

DROP TABLE IF EXISTS `show_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `show_products` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `session_id` varchar(50) NOT NULL,
  `variant_id` int(10) unsigned NOT NULL,
  `display_name` varchar(255) DEFAULT NULL,
  `starting_price` decimal(15,2) DEFAULT NULL,
  `current_price` decimal(15,2) DEFAULT NULL,
  `stock_available` int(10) unsigned DEFAULT 0,
  `status` enum('Active','SoldOut','Ended') DEFAULT 'Active',
  PRIMARY KEY (`id`),
  KEY `variant_id` (`variant_id`),
  KEY `idx_session` (`session_id`),
  CONSTRAINT `show_products_ibfk_1` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2076 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `staff_users`
--

DROP TABLE IF EXISTS `staff_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `staff_users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `middle_name` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone_number` varchar(20) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('Admin','SeniorAdmin','WHM','Sales') NOT NULL,
  `contact_info` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`contact_info`)),
  `added_by` int(10) unsigned DEFAULT NULL,
  `time_created` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('Active','Suspended','Hidden','Deployed','AwaitingApproval') DEFAULT 'Active',
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone_number` (`phone_number`)
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `system_banks`
--

DROP TABLE IF EXISTS `system_banks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `system_banks` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `bank_name` varchar(100) NOT NULL,
  `account_number` varchar(20) NOT NULL,
  `account_name` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `charge_officer_id` int(10) unsigned DEFAULT NULL,
  `status` enum('Pending','Active','Suspended') DEFAULT 'Pending',
  `time_created` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `system_google_accounts`
--

DROP TABLE IF EXISTS `system_google_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `system_google_accounts` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `purpose` varchar(100) DEFAULT NULL,
  `access_token` text DEFAULT NULL,
  `refresh_token` text DEFAULT NULL,
  `charge_officer_id` int(10) unsigned DEFAULT NULL,
  `status` enum('Pending','Active','Suspended') DEFAULT 'Pending',
  `time_created` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `transport_benchmark_cost`
--

DROP TABLE IF EXISTS `transport_benchmark_cost`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `transport_benchmark_cost` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `base_product_id` bigint(20) unsigned NOT NULL,
  `route_id` int(10) unsigned NOT NULL,
  `price_per_unit` decimal(15,2) NOT NULL,
  `time_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_hidden` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wallets`
--

DROP TABLE IF EXISTS `wallets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wallets` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `customer_id` bigint(20) unsigned NOT NULL,
  `balance` decimal(15,2) DEFAULT 0.00,
  `surveillance_flag` tinyint(1) DEFAULT 0,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `wallets_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `warehouse_zones`
--

DROP TABLE IF EXISTS `warehouse_zones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `warehouse_zones` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `zone_name` varchar(100) NOT NULL,
  `region_id` int(10) unsigned DEFAULT NULL,
  `charge_officer_id` int(10) unsigned DEFAULT NULL,
  `status` enum('Pending','Active','Suspended') DEFAULT 'Pending',
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `time_created` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `zone_name` (`zone_name`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wave_items`
--

DROP TABLE IF EXISTS `wave_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wave_items` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `wave_id` bigint(20) unsigned NOT NULL,
  `variant_id` int(10) unsigned NOT NULL,
  `new_price` decimal(15,2) NOT NULL,
  `new_stock` int(10) unsigned DEFAULT NULL,
  `status` enum('Active','Suspended','Deactivated') DEFAULT 'Active',
  PRIMARY KEY (`id`),
  KEY `wave_id` (`wave_id`),
  KEY `variant_id` (`variant_id`),
  CONSTRAINT `wave_items_ibfk_1` FOREIGN KEY (`wave_id`) REFERENCES `waves` (`id`) ON DELETE CASCADE,
  CONSTRAINT `wave_items_ibfk_2` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=302 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `waves`
--

DROP TABLE IF EXISTS `waves`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `waves` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `session_id` bigint(20) unsigned NOT NULL,
  `wave_name` varchar(255) DEFAULT NULL,
  `scheduled_at` datetime DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT 0,
  `senior_admin_approval` tinyint(1) DEFAULT 0,
  `status` enum('Pending','Active','Replaced','Cancelled','Removed') DEFAULT 'Pending',
  `actual_switch_time` datetime DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `time_created` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `session_id` (`session_id`),
  CONSTRAINT `waves_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `auction_sessions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `xpd_shipping`
--

DROP TABLE IF EXISTS `xpd_shipping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `xpd_shipping` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) unsigned DEFAULT NULL,
  `request_details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`request_details`)),
  `fee` decimal(15,2) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Requested',
  `time_created` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `zbd_assignments`
--

DROP TABLE IF EXISTS `zbd_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `zbd_assignments` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `zbdp_id` int(10) unsigned DEFAULT NULL,
  `destination_area_id` int(10) unsigned NOT NULL,
  `base_product_id` bigint(20) unsigned NOT NULL,
  `total_quantity` int(11) NOT NULL,
  `transport_price` decimal(15,2) DEFAULT NULL,
  `progress_status` enum('unassigned','pending','accepted','rejected','withdrawn','loaded','dispatch_ready','dispatch_risk','bad_dispatch','confirmed','completed','cancelled') DEFAULT 'unassigned',
  `time_assigned` datetime DEFAULT NULL,
  `time_accepted` datetime DEFAULT NULL,
  `time_loaded` datetime DEFAULT NULL,
  `time_completed` datetime DEFAULT NULL,
  `session_id` bigint(20) unsigned DEFAULT NULL,
  `order_id` bigint(20) unsigned DEFAULT NULL,
  `remittance_status` enum('Pending','Cancelled','Paid','Acknowledged') DEFAULT 'Pending',
  `admin_notes` text DEFAULT NULL,
  `whm_notes` text DEFAULT NULL,
  `zbdp_notes` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8020 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-10 18:31:28
