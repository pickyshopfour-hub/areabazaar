-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 18, 2026 at 10:58 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `areabazaar`
--

-- --------------------------------------------------------

--
-- Table structure for table `auction_sessions`
--

CREATE TABLE `auction_sessions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `session_name` varchar(255) NOT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `status` enum('Draft','Ready','Active','Ended','Cancelled') DEFAULT 'Draft',
  `current_wave_id` bigint(20) UNSIGNED DEFAULT NULL,
  `senior_admin_approval` tinyint(1) DEFAULT 0,
  `time_created` timestamp NOT NULL DEFAULT current_timestamp(),
  `type` enum('foodies-auction','thrifts-auction','clearance-auction','pots-auction','combos-auction','split-auction','mixed-auction','after-auction') DEFAULT 'mixed-auction',
  `target_zone` int(10) UNSIGNED DEFAULT NULL,
  `target_revenue` decimal(15,2) DEFAULT 0.00,
  `charge_admin` int(10) UNSIGNED DEFAULT NULL,
  `charge_sales` int(10) UNSIGNED DEFAULT NULL,
  `charge_whm` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `auction_sessions`
--

INSERT INTO `auction_sessions` (`id`, `session_name`, `start_time`, `end_time`, `status`, `current_wave_id`, `senior_admin_approval`, `time_created`, `type`, `target_zone`, `target_revenue`, `charge_admin`, `charge_sales`, `charge_whm`) VALUES
(11, 'Flash Sale #1', '2026-02-27 11:49:55', NULL, 'Active', NULL, 0, '2026-02-26 10:49:55', 'mixed-auction', NULL, 0.00, NULL, NULL, NULL),
(12, 'Flash Sale #2', '2026-02-28 11:49:55', NULL, 'Ready', NULL, 0, '2026-02-26 10:49:55', 'mixed-auction', NULL, 0.00, NULL, NULL, NULL),
(13, 'Flash Sale #3', '2026-03-01 11:49:55', NULL, 'Ready', NULL, 0, '2026-02-26 10:49:55', 'mixed-auction', NULL, 0.00, NULL, NULL, NULL),
(14, 'Flash Sale #4', '2026-03-02 11:49:55', NULL, 'Ready', NULL, 0, '2026-02-26 10:49:55', 'mixed-auction', NULL, 0.00, NULL, NULL, NULL),
(15, 'Flash Sale #5', '2026-03-03 11:49:55', NULL, 'Ready', NULL, 0, '2026-02-26 10:49:55', 'mixed-auction', NULL, 0.00, NULL, NULL, NULL),
(16, 'Flash Sale #6', '2026-03-04 11:49:55', NULL, 'Draft', NULL, 0, '2026-02-26 10:49:55', 'mixed-auction', NULL, 0.00, NULL, NULL, NULL),
(17, 'Flash Sale #7', '2026-03-05 11:49:55', NULL, 'Draft', NULL, 0, '2026-02-26 10:49:55', 'mixed-auction', NULL, 0.00, NULL, NULL, NULL),
(18, 'Flash Sale #8', '2026-03-06 11:49:55', NULL, 'Draft', NULL, 0, '2026-02-26 10:49:55', 'mixed-auction', NULL, 0.00, NULL, NULL, NULL),
(19, 'Flash Sale #9', '2026-03-07 11:49:55', NULL, 'Draft', NULL, 0, '2026-02-26 10:49:55', 'mixed-auction', NULL, 0.00, NULL, NULL, NULL),
(20, 'Flash Sale #10', '2026-03-08 11:49:55', NULL, 'Draft', NULL, 0, '2026-02-26 10:49:55', 'mixed-auction', NULL, 0.00, NULL, NULL, NULL),
(21, 'Flash Sale #1', '2026-02-27 11:51:48', NULL, 'Active', NULL, 0, '2026-02-26 10:51:48', 'mixed-auction', NULL, 0.00, NULL, NULL, NULL),
(22, 'Flash Sale #2', '2026-02-28 11:51:48', NULL, 'Ready', NULL, 0, '2026-02-26 10:51:48', 'mixed-auction', NULL, 0.00, NULL, NULL, NULL),
(23, 'Flash Sale #3', '2026-03-01 11:51:48', NULL, 'Ready', NULL, 0, '2026-02-26 10:51:48', 'mixed-auction', NULL, 0.00, NULL, NULL, NULL),
(24, 'Flash Sale #4', '2026-03-02 11:51:48', NULL, 'Ready', NULL, 0, '2026-02-26 10:51:48', 'mixed-auction', NULL, 0.00, NULL, NULL, NULL),
(25, 'Flash Sale #5', '2026-03-03 11:51:48', NULL, 'Ready', NULL, 0, '2026-02-26 10:51:48', 'mixed-auction', NULL, 0.00, NULL, NULL, NULL),
(26, 'Flash Sale #6', '2026-03-04 11:51:48', NULL, 'Draft', NULL, 0, '2026-02-26 10:51:48', 'mixed-auction', NULL, 0.00, NULL, NULL, NULL),
(27, 'Flash Sale #7', '2026-03-05 11:51:48', NULL, 'Draft', NULL, 0, '2026-02-26 10:51:48', 'mixed-auction', NULL, 0.00, NULL, NULL, NULL),
(28, 'Flash Sale #8', '2026-03-06 11:51:48', NULL, 'Draft', NULL, 0, '2026-02-26 10:51:48', 'mixed-auction', NULL, 0.00, NULL, NULL, NULL),
(29, 'Flash Sale #9', '2026-03-07 11:51:48', NULL, 'Draft', NULL, 0, '2026-02-26 10:51:48', 'mixed-auction', NULL, 0.00, NULL, NULL, NULL),
(30, 'Flash Sale #10', '2026-03-08 11:51:48', NULL, 'Draft', NULL, 0, '2026-02-26 10:51:48', 'mixed-auction', NULL, 0.00, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `user_type` enum('Customer','Staff','System','Provider','Partner') NOT NULL,
  `action` varchar(255) DEFAULT NULL,
  `entity_affected` varchar(100) DEFAULT NULL,
  `old_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`old_data`)),
  `new_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`new_data`)),
  `ip_address` varchar(45) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `audit_logs`
--

INSERT INTO `audit_logs` (`id`, `user_id`, `user_type`, `action`, `entity_affected`, `old_data`, `new_data`, `ip_address`, `timestamp`) VALUES
(1, 103, 'Staff', 'UPDATE_STATUS_google', 'google', '{\"id\":1,\"email\":\"sync@areabazaar.com\",\"purpose\":\"BankSync Engine\",\"access_token\":null,\"refresh_token\":null,\"charge_officer_id\":null,\"status\":\"Active\",\"time_created\":\"2026-02-26 09:31:44\"}', '{\"status\":\"Active\"}', '::1', '2026-02-26 08:57:49'),
(2, 103, 'Staff', 'deploy', 'staff_users', '{\"id\":101,\"name\":\"Admin Yusuf\",\"first_name\":null,\"last_name\":null,\"middle_name\":null,\"email\":null,\"phone_number\":\"08011111111\",\"password_hash\":\"hash\",\"role\":\"Admin\",\"contact_info\":null,\"added_by\":null,\"time_created\":\"2026-02-26 07:38:49\",\"status\":\"Active\"}', '{\"status\":\"Deployed\",\"contact_info\":\"{\\\"deployment\\\":\\\"\\\"}\"}', '::1', '2026-02-26 08:59:06'),
(3, 103, 'Staff', 'unsuspend', 'staff_users', '{\"id\":101,\"name\":\"Admin Yusuf\",\"first_name\":null,\"last_name\":null,\"middle_name\":null,\"email\":null,\"phone_number\":\"08011111111\",\"password_hash\":\"hash\",\"role\":\"Admin\",\"contact_info\":\"{\\\"deployment\\\":\\\"\\\"}\",\"added_by\":null,\"time_created\":\"2026-02-26 07:38:49\",\"status\":\"Deployed\"}', '{\"status\":\"Active\"}', '::1', '2026-02-26 08:59:58'),
(4, 103, 'Staff', 'suspend', 'staff_users', '{\"id\":103,\"name\":\"SeniorAdmin\",\"first_name\":null,\"last_name\":null,\"middle_name\":null,\"email\":null,\"phone_number\":\"08033333333\",\"password_hash\":\"hash\",\"role\":\"SeniorAdmin\",\"contact_info\":null,\"added_by\":null,\"time_created\":\"2026-02-26 07:38:49\",\"status\":\"Active\"}', '{\"status\":\"Suspended\"}', '::1', '2026-02-26 09:00:01'),
(5, 103, 'Staff', 'hide', 'staff_users', '{\"id\":103,\"name\":\"SeniorAdmin\",\"first_name\":null,\"last_name\":null,\"middle_name\":null,\"email\":null,\"phone_number\":\"08033333333\",\"password_hash\":\"hash\",\"role\":\"SeniorAdmin\",\"contact_info\":null,\"added_by\":null,\"time_created\":\"2026-02-26 07:38:49\",\"status\":\"Suspended\"}', '{\"status\":\"Hidden\"}', '::1', '2026-02-26 09:00:09'),
(6, 103, 'Staff', 'REMOVE_MEMBER', 'staff_users', '{\"id\":103,\"name\":\"SeniorAdmin\",\"first_name\":null,\"last_name\":null,\"middle_name\":null,\"email\":null,\"phone_number\":\"08033333333\",\"password_hash\":\"hash\",\"role\":\"SeniorAdmin\",\"contact_info\":null,\"added_by\":null,\"time_created\":\"2026-02-26 07:38:49\",\"status\":\"Hidden\"}', '{\"status\":\"Hidden\"}', '::1', '2026-02-26 09:00:16'),
(7, 103, 'Staff', 'deploy', 'staff_users', '{\"id\":103,\"name\":\"SeniorAdmin\",\"first_name\":null,\"last_name\":null,\"middle_name\":null,\"email\":null,\"phone_number\":\"08033333333\",\"password_hash\":\"hash\",\"role\":\"SeniorAdmin\",\"contact_info\":null,\"added_by\":null,\"time_created\":\"2026-02-26 07:38:49\",\"status\":\"Hidden\"}', '{\"status\":\"Deployed\",\"contact_info\":\"{\\\"deployment\\\":\\\"\\\"}\"}', '::1', '2026-02-26 09:00:28'),
(8, 103, 'Staff', 'deploy', 'staff_users', '{\"id\":103,\"name\":\"SeniorAdmin\",\"first_name\":null,\"last_name\":null,\"middle_name\":null,\"email\":null,\"phone_number\":\"08033333333\",\"password_hash\":\"hash\",\"role\":\"SeniorAdmin\",\"contact_info\":\"{\\\"deployment\\\":\\\"\\\"}\",\"added_by\":null,\"time_created\":\"2026-02-26 07:38:49\",\"status\":\"Deployed\"}', '{\"status\":\"Deployed\",\"contact_info\":\"{\\\"deployment\\\":\\\"\\\"}\"}', '::1', '2026-02-26 09:00:52'),
(9, 103, 'Staff', 'UPDATE_STATUS_area', 'area', '{\"id\":2,\"area_name\":\"Yaba\",\"parent_zone_id\":2,\"charge_officer_id\":null,\"status\":\"Pending\",\"metadata\":null,\"time_created\":\"2026-02-26 09:31:44\"}', '{\"status\":\"Active\"}', '::1', '2026-02-26 09:10:45'),
(10, 103, 'Staff', 'UPDATE_STATUS_bank', 'bank', '{\"id\":18,\"bank_name\":\"Operations Bank 8\",\"account_number\":\"203940198\",\"account_name\":\"AreaBazaar Ops 8\",\"is_active\":1,\"charge_officer_id\":null,\"status\":\"Active\",\"time_created\":\"2026-02-26 11:51:48\"}', '{\"status\":\"Suspended\"}', '::1', '2026-02-27 09:03:47'),
(11, 103, 'Staff', 'ASSIGN_OFFICER_whz', 'whz', NULL, '{\"officer_id\":\"102\"}', '::1', '2026-02-27 12:36:07');

-- --------------------------------------------------------

--
-- Table structure for table `bank_reports`
--

CREATE TABLE `bank_reports` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `transaction_date` date DEFAULT NULL,
  `raw_narration` text DEFAULT NULL,
  `amount` decimal(15,2) DEFAULT NULL,
  `bank_ref` varchar(100) DEFAULT NULL,
  `extraction_source` varchar(50) DEFAULT NULL,
  `status` enum('Unreconciled','Reconciled','amount-mismatch','orphaned') DEFAULT 'Unreconciled',
  `time_recorded` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bank_reports`
--

INSERT INTO `bank_reports` (`id`, `transaction_date`, `raw_narration`, `amount`, `bank_ref`, `extraction_source`, `status`, `time_recorded`) VALUES
(1, '2026-02-27', 'Remittance REF 0695', 38116.00, 'R108510719', NULL, 'amount-mismatch', '2026-02-27 17:35:58'),
(2, '2026-02-27', 'Payment REF AB-00002 thanks', 40641.00, 'R356282683', NULL, 'Reconciled', '2026-02-27 17:35:58'),
(3, '2026-02-27', 'Remittance REF 8412', 44333.00, 'R061365217', NULL, 'Reconciled', '2026-02-27 17:35:58'),
(4, '2026-02-27', 'Payment REF AB-00004 thanks', 3433.00, 'R949698943', NULL, 'orphaned', '2026-02-27 17:35:58'),
(5, '2026-02-27', 'Remittance REF 2942', 8686.00, 'R542605276', NULL, 'Unreconciled', '2026-02-27 17:35:58'),
(6, '2026-02-27', 'Payment REF AB-00006 thanks', 7125.00, 'R501080356', NULL, 'amount-mismatch', '2026-02-27 17:35:58'),
(7, '2026-02-27', 'Payment REF AB-00007 thanks', 27322.00, 'R111309879', NULL, 'Unreconciled', '2026-02-27 17:35:58'),
(8, '2026-02-27', 'Remittance REF 9075', 44662.00, 'R597012214', NULL, 'amount-mismatch', '2026-02-27 17:35:58'),
(9, '2026-02-27', 'Payment REF AB-00009 thanks', 35715.00, 'R216347788', NULL, 'Unreconciled', '2026-02-27 17:35:58'),
(10, '2026-02-27', 'Remittance REF 4947', 28516.00, 'R494908710', NULL, 'Unreconciled', '2026-02-27 17:35:58'),
(11, '2026-02-27', 'Transfer from Mary Anne / AB-00011', 43617.00, 'R936928047', NULL, 'orphaned', '2026-02-27 17:35:58'),
(12, '2026-02-27', 'Transfer from Jane Smith / AB-00012', 40400.00, 'R659053312', NULL, 'amount-mismatch', '2026-02-27 17:35:58'),
(13, '2026-02-27', 'Payment REF AB-00013 thanks', 22573.00, 'R895394968', NULL, 'amount-mismatch', '2026-02-27 17:35:58'),
(14, '2026-02-27', 'Remittance REF 5362', 35478.00, 'R867523675', NULL, 'Unreconciled', '2026-02-27 17:35:58'),
(15, '2026-02-27', 'Transfer from Agent X / AB-00015', 42922.00, 'R164748909', NULL, 'Unreconciled', '2026-02-27 17:35:58'),
(16, '2026-02-27', 'Transfer from Michael Johnson / AB-00016', 15050.00, 'R413946282', NULL, 'orphaned', '2026-02-27 17:35:58'),
(17, '2026-02-27', 'Remittance REF 4995', 46606.00, 'R641233903', NULL, 'amount-mismatch', '2026-02-27 17:35:58'),
(18, '2026-02-27', 'Transfer from Agent X / AB-00018', 21163.00, 'R969467175', NULL, 'amount-mismatch', '2026-02-27 17:35:58'),
(19, '2026-02-27', 'Payment REF AB-00019 thanks', 32212.00, 'R986698518', NULL, 'amount-mismatch', '2026-02-27 17:35:58'),
(20, '2026-02-27', 'Transfer from John Doe / AB-00020', 18099.00, 'R404481565', NULL, 'amount-mismatch', '2026-02-27 17:35:58'),
(21, '2026-02-27', 'Transfer from John Doe / AB-00021', 39717.00, 'R091522012', NULL, 'orphaned', '2026-02-27 17:35:58'),
(22, '2026-02-27', 'Payment REF AB-00022 thanks', 7320.00, 'R269600696', NULL, 'orphaned', '2026-02-27 17:35:58'),
(23, '2026-02-27', 'Remittance REF 6942', 16705.00, 'R753268836', NULL, 'Unreconciled', '2026-02-27 17:35:58'),
(24, '2026-02-27', 'Remittance REF 1455', 19969.00, 'R704724300', NULL, 'Unreconciled', '2026-02-27 17:35:58'),
(25, '2026-02-27', 'Remittance REF 8361', 35860.00, 'R666252928', NULL, 'Unreconciled', '2026-02-27 17:35:58'),
(26, '2026-02-27', 'Payment REF AB-00026 thanks', 34931.00, 'R396490374', NULL, 'orphaned', '2026-02-27 17:35:58'),
(27, '2026-02-27', 'Remittance REF 2999', 3577.00, 'R660534080', NULL, 'Unreconciled', '2026-02-27 17:35:58'),
(28, '2026-02-27', 'Transfer from Mary Anne / AB-00028', 38350.00, 'R892158005', NULL, 'amount-mismatch', '2026-02-27 17:35:58'),
(29, '2026-02-27', 'Payment REF AB-00029 thanks', 43387.00, 'R079558546', NULL, 'amount-mismatch', '2026-02-27 17:35:58'),
(30, '2026-02-27', 'Transfer from Jane Smith / AB-00030', 11866.00, 'R630118462', NULL, 'Reconciled', '2026-02-27 17:35:58'),
(31, '2026-02-27', 'Remittance REF 1299', 40058.00, 'R283119586', NULL, 'amount-mismatch', '2026-02-27 17:35:58'),
(32, '2026-02-27', 'Remittance REF 6993', 25429.00, 'R321010927', NULL, 'Unreconciled', '2026-02-27 17:35:58'),
(33, '2026-02-27', 'Payment REF AB-00033 thanks', 40874.00, 'R657135529', NULL, 'amount-mismatch', '2026-02-27 17:35:58'),
(34, '2026-02-27', 'Payment REF AB-00034 thanks', 9264.00, 'R430528254', NULL, 'Unreconciled', '2026-02-27 17:35:58'),
(35, '2026-02-27', 'Transfer from Michael Johnson / AB-00035', 48070.00, 'R610832351', NULL, 'Reconciled', '2026-02-27 17:35:58'),
(36, '2026-02-27', 'Remittance REF 0040', 48652.00, 'R152432531', NULL, 'Reconciled', '2026-02-27 17:35:58'),
(37, '2026-02-27', 'Payment REF AB-00037 thanks', 47015.00, 'R974809004', NULL, 'orphaned', '2026-02-27 17:35:58'),
(38, '2026-02-27', 'Transfer from Mary Anne / AB-00038', 36346.00, 'R740694021', NULL, 'orphaned', '2026-02-27 17:35:58'),
(39, '2026-02-27', 'Remittance REF 6339', 10613.00, 'R340256144', NULL, 'Reconciled', '2026-02-27 17:35:58'),
(40, '2026-02-27', 'Transfer from Mary Anne / AB-00040', 29010.00, 'R879592297', NULL, 'orphaned', '2026-02-27 17:35:58'),
(41, '2026-02-27', 'Transfer from Whale User / NO REF', 15000000.00, 'BNK-ORP-15M', NULL, 'orphaned', '2026-02-27 20:18:51'),
(42, '2026-02-27', 'Transfer Ref: AB-HIGHVAL01 Amount mismatched', 2000000.00, 'BNK-MIS-2M', NULL, 'amount-mismatch', '2026-02-27 20:18:51');

-- --------------------------------------------------------

--
-- Table structure for table `base_products`
--

CREATE TABLE `base_products` (
  `id` int(10) UNSIGNED NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `bulk_purchase_price` decimal(15,2) DEFAULT NULL,
  `bulk_purchase_unit` varchar(50) DEFAULT NULL,
  `unit_handling_cost` decimal(10,2) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `main_photo` varchar(255) DEFAULT NULL,
  `added_by` int(10) UNSIGNED DEFAULT NULL,
  `time_created` timestamp NOT NULL DEFAULT current_timestamp(),
  `admin_approval` enum('Pending','Approved','Rejected') DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `base_products`
--

INSERT INTO `base_products` (`id`, `product_name`, `brand`, `category`, `bulk_purchase_price`, `bulk_purchase_unit`, `unit_handling_cost`, `description`, `main_photo`, `added_by`, `time_created`, `admin_approval`) VALUES
(1, 'Rice 50kg', NULL, 'Food', NULL, NULL, NULL, NULL, NULL, 0, '2026-02-26 10:49:55', 'Approved'),
(2, 'Oil 5L', NULL, 'Food', NULL, NULL, NULL, NULL, NULL, 0, '2026-02-26 10:49:55', 'Approved'),
(3, 'Whm Test Product', 'Brand Whm1', 'Cat Whm1', 0.00, NULL, 0.00, NULL, 'prod_3_whm-test-product.jpg', NULL, '2026-02-27 14:09:12', 'Pending'),
(10, 'Premium Rice 50kg', NULL, NULL, 45000.00, NULL, NULL, NULL, NULL, NULL, '2026-02-27 22:09:03', 'Pending'),
(20, 'Vegetable Oil 25L', NULL, NULL, 32000.00, NULL, NULL, NULL, NULL, NULL, '2026-02-27 22:09:03', 'Pending'),
(21, 'Indomie Instant Noodles', NULL, 'Food', NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-05 12:31:24', 'Pending'),
(22, 'Dangote Sugar', NULL, 'Food', NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-05 12:31:24', 'Pending'),
(23, 'Power Oil', NULL, 'Food', NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-05 12:31:24', 'Pending'),
(24, 'Milo Beverage', NULL, 'Beverage', NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-05 12:31:24', 'Pending'),
(25, 'Peak Milk', NULL, 'Beverage', NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-05 12:31:24', 'Pending'),
(26, 'Golden Penny Spaghetti', NULL, 'Food', NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-05 12:31:24', 'Pending'),
(27, 'Coca Cola', NULL, 'Beverage', NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-05 12:31:24', 'Pending'),
(28, 'Knorr Cubes', NULL, 'Food', NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-05 12:31:24', 'Pending'),
(29, 'Ariel Detergent', NULL, 'Household', NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-05 12:31:24', 'Pending'),
(30, 'Morning Fresh', NULL, 'Household', NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-05 12:31:24', 'Pending'),
(31, 'Dettol Soap', NULL, 'Health', NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-05 12:31:24', 'Pending'),
(32, 'Always Ultra', NULL, 'Health', NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-05 12:31:24', 'Pending'),
(33, 'Colgate Toothpaste', NULL, 'Health', NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-05 12:31:24', 'Pending'),
(34, 'Bama Mayonnaise', NULL, 'Food', NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-05 12:31:24', 'Pending'),
(35, 'Gino Tomato Paste', NULL, 'Food', NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-05 12:31:24', 'Pending');

-- --------------------------------------------------------

--
-- Table structure for table `commissions`
--

CREATE TABLE `commissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `partner_id` int(10) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `status` enum('Pending','Approved','Credited') DEFAULT 'Pending',
  `time_created` timestamp NOT NULL DEFAULT current_timestamp(),
  `time_approved` datetime DEFAULT NULL,
  `time_credited` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `coverage_areas`
--

CREATE TABLE `coverage_areas` (
  `id` int(10) UNSIGNED NOT NULL,
  `area_name` varchar(100) NOT NULL,
  `parent_zone_id` int(10) UNSIGNED DEFAULT NULL,
  `status` enum('Pending','Active','Suspended') DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `coverage_areas`
--

INSERT INTO `coverage_areas` (`id`, `area_name`, `parent_zone_id`, `status`) VALUES
(1, 'Garki Area 1', 1, 'Active'),
(2, 'Wuse Zone 2', 1, 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `location_area_id` int(10) UNSIGNED DEFAULT NULL,
  `associated_ref_code` varchar(50) DEFAULT NULL,
  `verification_status` tinyint(1) DEFAULT 0,
  `contact_info` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`contact_info`)),
  `delivery_passcode` varchar(10) DEFAULT NULL,
  `auth_pin` char(4) DEFAULT NULL,
  `added_by` enum('user','admin','system') DEFAULT 'user',
  `time_created` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('Active','Suspended','Flagged') DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `name`, `phone_number`, `password_hash`, `location_area_id`, `associated_ref_code`, `verification_status`, `contact_info`, `delivery_passcode`, `auth_pin`, `added_by`, `time_created`, `status`) VALUES
(1, 'Toluwani Ojo 94', '08054625908', '', 4, 'FRM-001', 0, NULL, NULL, NULL, 'user', '2026-02-27 18:11:55', 'Active'),
(2, 'Toluwani Ojo 26', '08020235055', '', 2, 'FRM-001', 0, NULL, NULL, NULL, 'user', '2026-02-27 18:11:55', 'Active'),
(3, 'Toluwani Ojo 96', '08095634899', '', 5, 'FRM-001', 0, NULL, NULL, NULL, 'user', '2026-02-27 18:11:55', 'Active'),
(4, 'Chinedu Okafor 58', '08015500440', '', 2, 'FRM-001', 0, NULL, NULL, NULL, 'user', '2026-02-27 18:11:55', 'Active'),
(5, 'Toluwani Ojo 35', '08076439730', '', 1, 'FRM-001', 0, NULL, NULL, NULL, 'user', '2026-02-27 18:11:55', 'Active'),
(6, 'Zainab Bello 23', '08013127281', '', 3, 'FRM-001', 0, NULL, NULL, NULL, 'user', '2026-02-27 18:11:55', 'Active'),
(7, 'Nkechi Ekeh 39', '08098209524', '', 5, 'FRM-001', 0, NULL, NULL, NULL, 'user', '2026-02-27 18:11:55', 'Active'),
(8, 'Zainab Bello 54', '08048924456', '', 1, 'FRM-001', 0, NULL, NULL, NULL, 'user', '2026-02-27 18:11:55', 'Active'),
(9, 'Zainab Bello 82', '08078504257', '', 2, 'FRM-001', 0, NULL, NULL, NULL, 'user', '2026-02-27 18:11:55', 'Active'),
(10, 'Femi Adebayo 38', '08018240198', '', 4, 'FRM-001', 0, NULL, NULL, NULL, 'user', '2026-02-27 18:11:55', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `delivery_routes`
--

CREATE TABLE `delivery_routes` (
  `id` int(10) UNSIGNED NOT NULL,
  `route_name` varchar(100) NOT NULL,
  `area_id` int(10) UNSIGNED DEFAULT NULL,
  `status` enum('Pending','Active','Suspended') DEFAULT 'Active',
  `charge_officer_id` int(10) UNSIGNED DEFAULT NULL,
  `time_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `delivery_routes`
--

INSERT INTO `delivery_routes` (`id`, `route_name`, `area_id`, `status`, `charge_officer_id`, `time_created`) VALUES
(1, 'Garki-Main-Route', 1, 'Active', NULL, '2026-02-28 00:27:32'),
(2, 'Wuse-Express', 2, 'Active', NULL, '2026-02-28 00:27:32');

-- --------------------------------------------------------

--
-- Table structure for table `global_settings`
--

CREATE TABLE `global_settings` (
  `setting_key` varchar(50) NOT NULL,
  `setting_value` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `global_settings`
--

INSERT INTO `global_settings` (`setting_key`, `setting_value`) VALUES
('deposit_auto_limit', '1000000'),
('notif_email_enabled', '0'),
('notif_email_from', 'no-reply@areabazaar.com'),
('notif_poll_interval_seconds', '30'),
('notif_sms_api_key', ''),
('notif_sms_enabled', '0'),
('notif_sms_gateway_url', ''),
('notif_sms_sender_id', 'AreaBazaar'),
('session_lifetime_minutes', '120'),
('session_secure_cookie', '0');

-- --------------------------------------------------------

--
-- Table structure for table `hvp_shipping`
--

CREATE TABLE `hvp_shipping` (
  `id` int(10) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED DEFAULT NULL,
  `request_details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`request_details`)),
  `fee` decimal(15,2) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Requested',
  `time_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `operating_areas`
--

CREATE TABLE `operating_areas` (
  `id` int(10) UNSIGNED NOT NULL,
  `area_name` varchar(100) NOT NULL,
  `parent_zone_id` int(10) UNSIGNED DEFAULT NULL,
  `charge_officer_id` int(10) UNSIGNED DEFAULT NULL,
  `status` enum('Pending','Active','Suspended') DEFAULT 'Pending',
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `time_created` timestamp NOT NULL DEFAULT current_timestamp(),
  `type` enum('country-zone','sub-zone','area') DEFAULT 'area'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `operating_areas`
--

INSERT INTO `operating_areas` (`id`, `area_name`, `parent_zone_id`, `charge_officer_id`, `status`, `metadata`, `time_created`, `type`) VALUES
(1, 'Ikoyi', 1, NULL, 'Active', NULL, '2026-02-26 08:31:44', 'area'),
(2, 'Yaba', 2, NULL, 'Active', NULL, '2026-02-26 08:31:44', 'area'),
(11, 'Coverage Area 1', 2, NULL, 'Active', NULL, '2026-02-26 10:49:55', 'area'),
(12, 'Coverage Area 2', 1, NULL, 'Active', NULL, '2026-02-26 10:49:55', 'area'),
(13, 'Coverage Area 3', 2, NULL, 'Active', NULL, '2026-02-26 10:49:55', 'area'),
(14, 'Coverage Area 4', 1, NULL, 'Active', NULL, '2026-02-26 10:49:55', 'area'),
(15, 'Coverage Area 5', 2, NULL, 'Active', NULL, '2026-02-26 10:49:55', 'area'),
(16, 'Coverage Area 6', 1, NULL, 'Active', NULL, '2026-02-26 10:49:55', 'area'),
(17, 'Coverage Area 7', 2, NULL, 'Active', NULL, '2026-02-26 10:49:55', 'area'),
(18, 'Coverage Area 8', 1, NULL, 'Active', NULL, '2026-02-26 10:49:55', 'area'),
(19, 'Coverage Area 9', 2, NULL, 'Active', NULL, '2026-02-26 10:49:55', 'area'),
(20, 'Coverage Area 10', 1, NULL, 'Active', NULL, '2026-02-26 10:49:55', 'area'),
(21, 'Ikeja Distribution Area', 1, NULL, 'Active', NULL, '2026-02-27 11:51:01', 'area'),
(22, 'Surulere Dispatch Region', 1, NULL, 'Active', NULL, '2026-02-27 11:51:01', 'sub-zone');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `total_amount` decimal(15,2) NOT NULL,
  `status` enum('Paid','AdminApproved','Processing','Shipped','Delivered','Cancelled') DEFAULT 'Paid',
  `delivery_passcode` varchar(10) DEFAULT NULL,
  `shipping_address_id` int(10) UNSIGNED DEFAULT NULL,
  `admin_id` int(10) UNSIGNED DEFAULT NULL,
  `time_created` timestamp NOT NULL DEFAULT current_timestamp(),
  `time_approved` datetime DEFAULT NULL,
  `time_delivered` datetime DEFAULT NULL,
  `assigned_to` int(10) UNSIGNED DEFAULT NULL,
  `destination_area` text DEFAULT NULL,
  `request_xpd` varchar(50) DEFAULT NULL,
  `request_hvp` varchar(50) DEFAULT NULL,
  `is_urgent` tinyint(1) DEFAULT 0,
  `whm_notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `total_amount`, `status`, `delivery_passcode`, `shipping_address_id`, `admin_id`, `time_created`, `time_approved`, `time_delivered`, `assigned_to`, `destination_area`, `request_xpd`, `request_hvp`, `is_urgent`, `whm_notes`) VALUES
(101, 1, 24360.00, 'Processing', NULL, NULL, NULL, '2026-02-26 10:51:48', NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(102, 1, 26899.00, 'Shipped', NULL, NULL, NULL, '2026-02-26 10:51:48', NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(103, 1, 15603.00, 'AdminApproved', NULL, NULL, NULL, '2026-02-26 10:51:49', '2026-02-26 12:07:22', NULL, NULL, NULL, NULL, NULL, 1, NULL),
(104, 1, 49880.00, 'AdminApproved', NULL, NULL, NULL, '2026-02-26 10:51:49', '2026-02-26 12:53:39', NULL, NULL, NULL, NULL, NULL, 0, NULL),
(105, 1, 42115.00, 'Processing', NULL, NULL, NULL, '2026-02-26 10:51:49', NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(106, 1, 40827.00, 'AdminApproved', NULL, NULL, NULL, '2026-02-26 10:51:49', '2026-03-03 15:10:46', NULL, NULL, NULL, NULL, NULL, 0, NULL),
(107, 1, 21972.00, 'AdminApproved', NULL, NULL, NULL, '2026-02-26 10:51:49', '2026-02-26 13:32:04', NULL, NULL, NULL, NULL, NULL, 1, NULL),
(108, 1, 38923.00, 'Processing', NULL, NULL, NULL, '2026-02-26 10:51:49', NULL, NULL, NULL, NULL, NULL, NULL, 0, ''),
(109, 1, 8343.00, 'Processing', NULL, NULL, NULL, '2026-02-26 10:51:49', NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(110, 1, 45048.00, 'AdminApproved', NULL, NULL, NULL, '2026-02-26 10:51:49', '2026-03-13 07:25:28', NULL, NULL, NULL, NULL, NULL, 0, NULL),
(111, 1, 37792.00, 'Delivered', NULL, NULL, NULL, '2026-02-26 10:51:49', NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(112, 1, 34998.00, 'AdminApproved', NULL, NULL, NULL, '2026-02-26 10:51:49', '2026-02-26 13:32:19', NULL, NULL, NULL, NULL, NULL, 0, NULL),
(113, 1, 35576.00, 'Processing', NULL, NULL, NULL, '2026-02-26 10:51:49', NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(114, 1, 32430.00, 'Shipped', NULL, NULL, NULL, '2026-02-26 10:51:49', NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(115, 1, 35098.00, 'Delivered', NULL, NULL, NULL, '2026-02-26 10:51:49', NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(116, 2, 15000.00, 'AdminApproved', NULL, NULL, NULL, '2026-02-27 11:54:09', '2026-06-25 19:22:49', NULL, NULL, '1', NULL, NULL, 0, ''),
(117, 3, 45000.00, 'Processing', NULL, NULL, NULL, '2026-02-27 11:54:09', NULL, NULL, NULL, '2', NULL, NULL, 1, NULL),
(118, 4, 120000.00, 'Shipped', NULL, NULL, NULL, '2026-02-27 11:54:09', NULL, NULL, NULL, '1', NULL, NULL, 0, NULL),
(119, 2, 5000.00, 'AdminApproved', NULL, NULL, NULL, '2026-02-27 11:54:09', '2026-03-06 07:57:42', NULL, NULL, '2', NULL, NULL, 1, NULL),
(5001, 1, 100000.00, 'Processing', NULL, 1, NULL, '2026-02-27 22:09:03', NULL, NULL, NULL, NULL, NULL, NULL, 0, ''),
(5002, 1, 150000.00, 'Processing', NULL, 2, NULL, '2026-02-27 22:09:03', NULL, NULL, NULL, NULL, NULL, NULL, 0, '');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `show_product_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `price_at_purchase` decimal(15,2) NOT NULL,
  `treatment_status` enum('Pending','Processing','Packed','Dispatched') DEFAULT 'Pending',
  `admin_approval_flag` tinyint(1) DEFAULT 0,
  `whm_status` enum('requested','supplied','QA-passed','packed','labelled','staging-land','staging-cleared','area-sorted','loaded','zbd-transit','area-land','area-cleared','dispatched') DEFAULT 'requested',
  `sba_status` varchar(50) DEFAULT 'Pending',
  `zbd_status` varchar(50) DEFAULT 'Pending',
  `delivery_status` varchar(50) DEFAULT 'Pending',
  `charge_whm` int(10) UNSIGNED DEFAULT NULL,
  `charge_sba` int(10) UNSIGNED DEFAULT NULL,
  `charge_zbd` int(10) UNSIGNED DEFAULT NULL,
  `ship_notes` text DEFAULT NULL,
  `is_flagged` tinyint(1) DEFAULT 0,
  `is_hidden` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `show_product_id`, `quantity`, `price_at_purchase`, `treatment_status`, `admin_approval_flag`, `whm_status`, `sba_status`, `zbd_status`, `delivery_status`, `charge_whm`, `charge_sba`, `charge_zbd`, `ship_notes`, `is_flagged`, `is_hidden`) VALUES
(16, 101, 1, 1, 15000.00, 'Packed', 0, 'requested', 'Pending', 'Pending', 'Pending', NULL, NULL, NULL, NULL, 0, 0),
(17, 102, 1, 1, 15000.00, 'Pending', 0, 'requested', 'Pending', 'Pending', 'Pending', NULL, NULL, NULL, NULL, 0, 0),
(18, 103, 1, 1, 15000.00, 'Packed', 0, 'requested', 'Pending', 'Pending', 'Pending', NULL, NULL, NULL, NULL, 0, 0),
(19, 104, 1, 1, 15000.00, 'Packed', 0, 'requested', 'Pending', 'Pending', 'Pending', NULL, NULL, NULL, NULL, 0, 0),
(20, 105, 1, 1, 15000.00, 'Packed', 0, 'requested', 'Pending', 'Pending', 'Pending', NULL, NULL, NULL, NULL, 0, 0),
(21, 106, 1, 1, 15000.00, 'Packed', 0, 'requested', 'Pending', 'Pending', 'Pending', NULL, NULL, NULL, NULL, 0, 0),
(22, 107, 1, 1, 15000.00, 'Packed', 0, 'requested', 'Pending', 'Pending', 'Pending', NULL, NULL, NULL, NULL, 0, 0),
(23, 108, 1, 1, 15000.00, 'Packed', 0, 'requested', 'Pending', 'Pending', 'Pending', NULL, NULL, NULL, NULL, 0, 0),
(24, 109, 1, 1, 15000.00, 'Packed', 0, 'requested', 'Pending', 'Pending', 'Pending', NULL, NULL, NULL, NULL, 0, 0),
(25, 110, 1, 1, 15000.00, 'Packed', 0, 'requested', 'Pending', 'Pending', 'Pending', NULL, NULL, NULL, NULL, 0, 0),
(26, 111, 1, 1, 15000.00, 'Pending', 0, 'requested', 'Pending', 'Pending', 'Pending', NULL, NULL, NULL, NULL, 0, 0),
(27, 112, 1, 1, 15000.00, 'Packed', 0, 'requested', 'Pending', 'Pending', 'Pending', NULL, NULL, NULL, NULL, 0, 0),
(28, 113, 1, 1, 15000.00, 'Packed', 0, 'requested', 'Pending', 'Pending', 'Pending', NULL, NULL, NULL, NULL, 0, 0),
(29, 114, 1, 1, 15000.00, 'Pending', 0, 'requested', 'Pending', 'Pending', 'Pending', NULL, NULL, NULL, NULL, 0, 0),
(30, 115, 1, 1, 15000.00, 'Pending', 0, 'requested', 'Pending', 'Pending', 'Pending', NULL, NULL, NULL, NULL, 0, 0),
(31, 116, 1, 1, 15000.00, 'Packed', 0, 'requested', 'Pending', 'Pending', 'Pending', NULL, NULL, NULL, NULL, 0, 0),
(32, 117, 1, 3, 15000.00, 'Packed', 0, 'packed', 'Pending', 'Pending', 'Pending', NULL, NULL, NULL, NULL, 0, 0),
(33, 118, 1, 8, 15000.00, 'Dispatched', 0, 'dispatched', 'Pending', 'Pending', 'Pending', NULL, NULL, NULL, NULL, 0, 0),
(34, 119, 1, 1, 5000.00, '', 0, '', 'Pending', 'Pending', 'Pending', NULL, NULL, NULL, NULL, 0, 0),
(6001, 5001, 1000, 2, 48000.00, 'Packed', 0, 'requested', 'Pending', 'Pending', 'Pending', NULL, NULL, NULL, NULL, 0, 0),
(6002, 5001, 2000, 1, 35000.00, 'Pending', 0, 'requested', 'Pending', 'Pending', 'Pending', NULL, NULL, NULL, NULL, 0, 0),
(6003, 5002, 1000, 5, 48000.00, 'Packed', 0, 'requested', 'Pending', 'Pending', 'Pending', NULL, NULL, NULL, NULL, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `partners`
--

CREATE TABLE `partners` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `partner_type` enum('SBA','ZBDp','Agent') NOT NULL,
  `business_name` varchar(255) DEFAULT NULL,
  `commission_rate` decimal(5,2) DEFAULT 0.00,
  `region_id` int(10) UNSIGNED DEFAULT NULL,
  `contact_info` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`contact_info`)),
  `supply_categories` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`supply_categories`)),
  `vehicle_count` int(10) UNSIGNED DEFAULT NULL,
  `documents_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`documents_json`)),
  `approval_status` enum('Pending','Approved','Rejected','Queried','Flagged') DEFAULT 'Pending',
  `approved_by` int(10) UNSIGNED DEFAULT NULL,
  `approval_notes` text DEFAULT NULL,
  `onboarded_by` int(10) UNSIGNED DEFAULT NULL,
  `time_approved` datetime DEFAULT NULL,
  `status` enum('Active','Suspended') DEFAULT 'Active',
  `time_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `partners`
--

INSERT INTO `partners` (`id`, `name`, `phone_number`, `password_hash`, `partner_type`, `business_name`, `commission_rate`, `region_id`, `contact_info`, `supply_categories`, `vehicle_count`, `documents_json`, `approval_status`, `approved_by`, `approval_notes`, `onboarded_by`, `time_approved`, `status`, `time_created`) VALUES
(11, 'Partner 1', '0801111111', '', 'ZBDp', 'Business 1 Ltd', 0.00, NULL, NULL, NULL, NULL, NULL, 'Approved', NULL, NULL, NULL, NULL, 'Active', '2026-02-26 10:49:55'),
(12, 'Partner 2', '0802222222', '', 'SBA', 'Business 2 Ltd', 0.00, NULL, NULL, NULL, NULL, NULL, 'Approved', NULL, NULL, NULL, NULL, 'Active', '2026-02-26 10:49:55'),
(13, 'Partner 3', '0803333333', '', 'ZBDp', 'Business 3 Ltd', 0.00, NULL, NULL, NULL, NULL, NULL, 'Queried', 103, 'trty thius one', NULL, NULL, 'Active', '2026-02-26 10:49:55'),
(14, 'Partner 4', '0804444444', '', 'SBA', 'Business 4 Ltd', 0.00, NULL, NULL, NULL, NULL, NULL, 'Approved', NULL, NULL, NULL, NULL, 'Active', '2026-02-26 10:49:55'),
(15, 'Partner 5', '0805555555', '', 'ZBDp', 'Business 5 Ltd', 0.00, NULL, NULL, NULL, NULL, NULL, 'Approved', NULL, NULL, NULL, NULL, 'Active', '2026-02-26 10:49:55'),
(16, 'Partner 6', '0806666666', '', 'SBA', 'Business 6 Ltd', 0.00, NULL, NULL, NULL, NULL, NULL, 'Queried', 103, 'The standard query GOOOO', NULL, NULL, 'Active', '2026-02-26 10:49:55'),
(17, 'Partner 7', '0807777777', '', 'ZBDp', 'Business 7 Ltd', 0.00, NULL, NULL, NULL, NULL, NULL, 'Approved', NULL, NULL, NULL, NULL, 'Active', '2026-02-26 10:49:55'),
(18, 'Partner 8', '0808888888', '', 'SBA', 'Business 8 Ltd', 0.00, NULL, NULL, NULL, NULL, NULL, 'Approved', NULL, NULL, NULL, NULL, 'Active', '2026-02-26 10:49:55'),
(19, 'Partner 9', '0809999999', '', 'ZBDp', 'Business 9 Ltd', 0.00, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, NULL, NULL, NULL, 'Active', '2026-02-26 10:49:55'),
(20, 'Partner 10', '08010101010101010', '', 'SBA', 'Business 10 Ltd', 0.00, NULL, NULL, NULL, NULL, NULL, 'Approved', NULL, NULL, NULL, NULL, 'Active', '2026-02-26 10:49:55'),
(101, 'John SBA', '08011111111', 'hash', 'SBA', 'John Supplies Ltd', 0.00, NULL, NULL, NULL, NULL, NULL, 'Queried', 0, 'Test Query', NULL, NULL, 'Active', '2026-02-27 22:09:03'),
(102, 'Mary SBA', '08022222222', 'hash', 'SBA', 'Mary Agro', 0.00, NULL, NULL, NULL, NULL, NULL, 'Queried', 0, 'Mary Test Query', NULL, NULL, 'Active', '2026-02-27 22:09:03'),
(201, 'Driver Dan', '08033333333', 'hash', 'ZBDp', 'Dan Logistics', 0.00, NULL, NULL, NULL, NULL, NULL, 'Queried', 0, 'Driver Dan Query', NULL, NULL, 'Active', '2026-02-27 22:09:03'),
(202, 'Pilot Pete', '08044444444', 'hash', 'ZBDp', 'Pete Transport', 0.00, NULL, NULL, NULL, NULL, NULL, 'Approved', NULL, NULL, NULL, NULL, 'Active', '2026-02-27 22:09:03');

-- --------------------------------------------------------

--
-- Table structure for table `partner_remittances`
--

CREATE TABLE `partner_remittances` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `partner_id` int(10) UNSIGNED NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `bank_ref` varchar(100) DEFAULT NULL,
  `status` enum('queued','approved','Sent','Acknowledge') DEFAULT 'queued',
  `time_sent` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `partner_remittances`
--

INSERT INTO `partner_remittances` (`id`, `partner_id`, `amount`, `bank_ref`, `status`, `time_sent`) VALUES
(9001, 101, 450000.00, NULL, 'queued', '2026-02-27 22:09:03'),
(9002, 102, 256000.00, NULL, 'queued', '2026-02-27 22:09:03'),
(9003, 201, 15000.00, NULL, 'approved', '2026-02-27 22:09:03'),
(9004, 202, 8500.00, NULL, 'Sent', '2026-02-27 22:09:03'),
(9005, 101, 120000.00, 'PAY-SBA-1', 'Sent', '2026-02-27 23:16:09'),
(9006, 201, 85000.00, 'PAY-ZBD-1', 'Sent', '2026-02-27 23:16:09'),
(9007, 101, 450000.00, 'PAY-SBA-0', 'Acknowledge', '2026-02-27 23:16:09'),
(9008, 101, 120000.00, 'PAY-SBA-1', 'Sent', '2026-02-27 23:32:43'),
(9009, 201, 85000.00, 'PAY-ZBD-1', 'Sent', '2026-02-27 23:32:43'),
(9010, 101, 450000.00, 'PAY-SBA-0', 'Acknowledge', '2026-02-27 23:32:43'),
(9011, 101, 300000.00, NULL, 'queued', '2026-02-28 18:03:59');

-- --------------------------------------------------------

--
-- Table structure for table `partner_wallets`
--

CREATE TABLE `partner_wallets` (
  `id` int(10) UNSIGNED NOT NULL,
  `partner_id` int(10) UNSIGNED NOT NULL,
  `balance` decimal(15,2) DEFAULT 0.00,
  `threshold_limit` decimal(15,2) DEFAULT 100000.00,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment_reports`
--

CREATE TABLE `payment_reports` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `request_id` bigint(20) UNSIGNED DEFAULT NULL,
  `invoice_refindex` varchar(20) NOT NULL,
  `sender_name` varchar(255) DEFAULT NULL,
  `amount_reported` decimal(15,2) DEFAULT NULL,
  `payment_date` datetime DEFAULT NULL,
  `receipt_path` varchar(255) DEFAULT NULL,
  `status` enum('Pending','AwaitingAdminApproval','Matched','Flagged','unremitted','amount-mismatch','orphaned','verified','Resolved') DEFAULT 'Pending',
  `time_reported` timestamp NOT NULL DEFAULT current_timestamp(),
  `submitter` enum('customer','agent','admin') DEFAULT 'customer',
  `submitter_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment_reports`
--

INSERT INTO `payment_reports` (`id`, `request_id`, `invoice_refindex`, `sender_name`, `amount_reported`, `payment_date`, `receipt_path`, `status`, `time_reported`, `submitter`, `submitter_id`) VALUES
(1, 1, 'AB-00001', 'Agent X', 38116.00, NULL, NULL, 'Flagged', '2026-02-27 17:35:58', 'customer', NULL),
(2, 2, 'AB-00002', 'Agent X', 40641.00, NULL, NULL, 'Pending', '2026-02-27 17:35:58', 'admin', NULL),
(3, 3, 'AB-00003', 'Michael Johnson', 44333.00, NULL, NULL, 'Pending', '2026-02-27 17:35:58', 'agent', 1),
(4, 4, 'AB-00004', 'Mary Anne', 3433.00, NULL, NULL, 'amount-mismatch', '2026-02-27 17:35:58', 'agent', 1),
(5, 5, 'AB-00005', 'Agent X', 8686.00, NULL, NULL, 'amount-mismatch', '2026-02-27 17:35:58', 'admin', NULL),
(6, 6, 'AB-00006', 'Michael Johnson', 7125.00, NULL, NULL, 'Matched', '2026-02-27 17:35:58', 'agent', 1),
(7, 7, 'AB-00007', 'Agent X', 27322.00, NULL, NULL, 'Flagged', '2026-02-27 17:35:58', 'admin', NULL),
(8, 8, 'AB-00008', 'John Doe', 44662.00, NULL, NULL, 'Flagged', '2026-02-27 17:35:58', 'admin', NULL),
(9, 9, 'AB-00009', 'Jane Smith', 35715.00, NULL, NULL, 'amount-mismatch', '2026-02-27 17:35:58', 'customer', NULL),
(10, 10, 'AB-00010', 'Michael Johnson', 28516.00, NULL, NULL, 'Matched', '2026-02-27 17:35:58', 'customer', NULL),
(11, 11, 'AB-00011', 'Mary Anne', 43617.00, NULL, NULL, 'unremitted', '2026-02-27 17:35:58', 'customer', NULL),
(12, 12, 'AB-00012', 'Jane Smith', 40400.00, NULL, NULL, 'verified', '2026-02-27 17:35:58', 'agent', 1),
(13, 13, 'AB-00013', 'Michael Johnson', 22573.00, NULL, NULL, 'Flagged', '2026-02-27 17:35:58', 'customer', NULL),
(14, 14, 'AB-00014', 'Jane Smith', 35478.00, NULL, NULL, 'Pending', '2026-02-27 17:35:58', 'admin', NULL),
(15, 15, 'AB-00015', 'Agent X', 42922.00, NULL, NULL, 'unremitted', '2026-02-27 17:35:58', 'agent', 1),
(16, 16, 'AB-00016', 'Michael Johnson', 15050.00, NULL, NULL, 'unremitted', '2026-02-27 17:35:58', 'admin', NULL),
(17, 17, 'AB-00017', 'John Doe', 46606.00, NULL, NULL, 'unremitted', '2026-02-27 17:35:58', 'customer', NULL),
(18, 18, 'AB-00018', 'Agent X', 21163.00, NULL, NULL, 'unremitted', '2026-02-27 17:35:58', 'admin', NULL),
(19, 19, 'AB-00019', 'Mary Anne', 32212.00, NULL, NULL, 'Pending', '2026-02-27 17:35:58', 'customer', NULL),
(20, 20, 'AB-00020', 'John Doe', 18099.00, NULL, NULL, 'Matched', '2026-02-27 17:35:58', 'admin', NULL),
(21, 21, 'AB-00021', 'John Doe', 39717.00, NULL, NULL, 'Matched', '2026-02-27 17:35:58', 'customer', NULL),
(22, 22, 'AB-00022', 'Agent X', 7320.00, NULL, NULL, 'unremitted', '2026-02-27 17:35:58', 'agent', 1),
(23, 23, 'AB-00023', 'Mary Anne', 16705.00, NULL, NULL, 'Flagged', '2026-02-27 17:35:58', 'customer', NULL),
(24, 24, 'AB-00024', 'John Doe', 19969.00, NULL, NULL, 'Flagged', '2026-02-27 17:35:58', 'agent', 1),
(25, 25, 'AB-00025', 'Mary Anne', 35860.00, NULL, NULL, 'Flagged', '2026-02-27 17:35:58', 'admin', NULL),
(26, 26, 'AB-00026', 'Jane Smith', 34931.00, NULL, NULL, 'Flagged', '2026-02-27 17:35:58', 'agent', 1),
(27, 27, 'AB-00027', 'Mary Anne', 3577.00, NULL, NULL, 'Pending', '2026-02-27 17:35:58', 'agent', 1),
(28, 28, 'AB-00028', 'Mary Anne', 38350.00, NULL, NULL, 'unremitted', '2026-02-27 17:35:58', 'admin', NULL),
(29, 29, 'AB-00029', 'Agent X', 43387.00, NULL, NULL, 'Pending', '2026-02-27 17:35:58', 'agent', 1),
(30, 30, 'AB-00030', 'Jane Smith', 11866.00, NULL, NULL, 'amount-mismatch', '2026-02-27 17:35:58', 'admin', NULL),
(31, 31, 'AB-00031', 'Agent X', 40058.00, NULL, NULL, 'Flagged', '2026-02-27 17:35:58', 'admin', NULL),
(32, 32, 'AB-00032', 'Michael Johnson', 25429.00, NULL, NULL, 'Pending', '2026-02-27 17:35:58', 'customer', NULL),
(33, 33, 'AB-00033', 'John Doe', 40874.00, NULL, NULL, 'Flagged', '2026-02-27 17:35:58', 'agent', 1),
(34, 34, 'AB-00034', 'John Doe', 9264.00, NULL, NULL, 'unremitted', '2026-02-27 17:35:58', 'admin', NULL),
(35, 35, 'AB-00035', 'Michael Johnson', 48070.00, NULL, NULL, 'unremitted', '2026-02-27 17:35:58', 'admin', NULL),
(36, 36, 'AB-00036', 'Agent X', 48652.00, NULL, NULL, 'amount-mismatch', '2026-02-27 17:35:58', 'customer', NULL),
(37, 37, 'AB-00037', 'Mary Anne', 47015.00, NULL, NULL, 'amount-mismatch', '2026-02-27 17:35:58', 'agent', 1),
(38, 38, 'AB-00038', 'Mary Anne', 36346.00, NULL, NULL, 'unremitted', '2026-02-27 17:35:58', 'agent', 1),
(39, 39, 'AB-00039', 'Michael Johnson', 10613.00, NULL, NULL, 'Flagged', '2026-02-27 17:35:58', 'admin', NULL),
(40, 40, 'AB-00040', 'Mary Anne', 29010.00, NULL, NULL, 'unremitted', '2026-02-27 17:35:58', 'agent', 1),
(41, NULL, 'AB-HIGHVAL01', 'Customer Alpha', 1500000.00, NULL, NULL, 'AwaitingAdminApproval', '2026-02-27 20:18:51', 'customer', NULL),
(42, NULL, 'AB-HIGHVAL02', 'Agent Beta', 2500000.00, NULL, NULL, 'AwaitingAdminApproval', '2026-02-27 20:18:51', 'agent', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `payment_requests`
--

CREATE TABLE `payment_requests` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `method` enum('Bank','Card','Agent') DEFAULT 'Bank',
  `invoice_refindex` varchar(20) NOT NULL,
  `status` enum('Pending','AwaitingAdminApproval','Resolved','Expired','Cancelled') DEFAULT 'Pending',
  `time_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment_requests`
--

INSERT INTO `payment_requests` (`id`, `user_id`, `amount`, `method`, `invoice_refindex`, `status`, `time_created`) VALUES
(1, 5, 38116.00, '', 'AB-00001', '', '2026-02-27 17:35:58'),
(2, 8, 40641.00, '', 'AB-00002', '', '2026-02-27 17:35:58'),
(3, 3, 44333.00, '', 'AB-00003', 'Pending', '2026-02-27 17:35:58'),
(4, 3, 3433.00, '', 'AB-00004', '', '2026-02-27 17:35:58'),
(5, 10, 8686.00, '', 'AB-00005', 'Pending', '2026-02-27 17:35:58'),
(6, 10, 7125.00, '', 'AB-00006', 'Pending', '2026-02-27 17:35:58'),
(7, 2, 27322.00, '', 'AB-00007', '', '2026-02-27 17:35:58'),
(8, 8, 44662.00, '', 'AB-00008', '', '2026-02-27 17:35:58'),
(9, 4, 35715.00, '', 'AB-00009', 'Pending', '2026-02-27 17:35:58'),
(10, 2, 28516.00, '', 'AB-00010', '', '2026-02-27 17:35:58'),
(11, 2, 43617.00, '', 'AB-00011', '', '2026-02-27 17:35:58'),
(12, 1, 40400.00, '', 'AB-00012', 'Resolved', '2026-02-27 17:35:58'),
(13, 3, 22573.00, '', 'AB-00013', '', '2026-02-27 17:35:58'),
(14, 9, 35478.00, '', 'AB-00014', 'Pending', '2026-02-27 17:35:58'),
(15, 1, 42922.00, '', 'AB-00015', '', '2026-02-27 17:35:58'),
(16, 3, 15050.00, '', 'AB-00016', '', '2026-02-27 17:35:58'),
(17, 3, 46606.00, '', 'AB-00017', '', '2026-02-27 17:35:58'),
(18, 1, 21163.00, '', 'AB-00018', 'Pending', '2026-02-27 17:35:58'),
(19, 2, 32212.00, '', 'AB-00019', '', '2026-02-27 17:35:58'),
(20, 10, 18099.00, '', 'AB-00020', '', '2026-02-27 17:35:58'),
(21, 3, 39717.00, '', 'AB-00021', '', '2026-02-27 17:35:58'),
(22, 10, 7320.00, '', 'AB-00022', 'Pending', '2026-02-27 17:35:58'),
(23, 7, 16705.00, '', 'AB-00023', '', '2026-02-27 17:35:58'),
(24, 1, 19969.00, '', 'AB-00024', '', '2026-02-27 17:35:58'),
(25, 1, 35860.00, '', 'AB-00025', '', '2026-02-27 17:35:58'),
(26, 8, 34931.00, '', 'AB-00026', '', '2026-02-27 17:35:58'),
(27, 1, 3577.00, '', 'AB-00027', '', '2026-02-27 17:35:58'),
(28, 8, 38350.00, '', 'AB-00028', '', '2026-02-27 17:35:58'),
(29, 7, 43387.00, '', 'AB-00029', '', '2026-02-27 17:35:58'),
(30, 1, 11866.00, '', 'AB-00030', '', '2026-02-27 17:35:58'),
(31, 6, 40058.00, '', 'AB-00031', '', '2026-02-27 17:35:58'),
(32, 6, 25429.00, '', 'AB-00032', '', '2026-02-27 17:35:58'),
(33, 3, 40874.00, '', 'AB-00033', '', '2026-02-27 17:35:58'),
(34, 1, 9264.00, '', 'AB-00034', 'Pending', '2026-02-27 17:35:58'),
(35, 6, 48070.00, '', 'AB-00035', '', '2026-02-27 17:35:58'),
(36, 8, 48652.00, '', 'AB-00036', '', '2026-02-27 17:35:58'),
(37, 7, 47015.00, '', 'AB-00037', '', '2026-02-27 17:35:58'),
(38, 7, 36346.00, '', 'AB-00038', '', '2026-02-27 17:35:58'),
(39, 2, 10613.00, '', 'AB-00039', '', '2026-02-27 17:35:58'),
(40, 9, 29010.00, '', 'AB-00040', '', '2026-02-27 17:35:58'),
(41, 1, 1500000.00, 'Bank', 'AB-HIGHVAL01', 'Pending', '2026-02-27 20:18:51'),
(42, 2, 2500000.00, 'Agent', 'AB-HIGHVAL02', 'Pending', '2026-02-27 20:18:51');

-- --------------------------------------------------------

--
-- Table structure for table `product_variants`
--

CREATE TABLE `product_variants` (
  `id` int(10) UNSIGNED NOT NULL,
  `base_product_id` int(10) UNSIGNED NOT NULL,
  `variant_name` varchar(255) NOT NULL,
  `quantity_value` decimal(10,2) DEFAULT NULL,
  `quantity_unit` varchar(20) DEFAULT NULL,
  `photo_path` varchar(255) DEFAULT NULL,
  `presentation_type` enum('Split-pack','Auction-unit') DEFAULT 'Auction-unit',
  `admin_approval` enum('Pending','Approved','Rejected') DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_variants`
--

INSERT INTO `product_variants` (`id`, `base_product_id`, `variant_name`, `quantity_value`, `quantity_unit`, `photo_path`, `presentation_type`, `admin_approval`) VALUES
(1, 1, 'Mama Gold 50kg', 50.00, 'kg', NULL, 'Auction-unit', 'Approved'),
(2, 2, 'Kings Oil 5L', 5.00, 'L', NULL, 'Auction-unit', 'Approved'),
(3, 3, 'Whm Test Product (Standard)', 1.00, 'pcs', 'var_3_whm-test-product-standard-.jpg', 'Auction-unit', 'Pending'),
(100, 10, 'Rice variant 1', NULL, NULL, NULL, 'Auction-unit', 'Pending'),
(200, 20, 'Oil variant 1', NULL, NULL, NULL, 'Auction-unit', 'Pending'),
(201, 1, 'Variant 1 for Product 1', 6.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(202, 1, 'Variant 2 for Product 1', 1.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(203, 1, 'Variant 3 for Product 1', 8.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(204, 1, 'Variant 4 for Product 1', 10.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(205, 2, 'Variant 1 for Product 2', 7.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(206, 2, 'Variant 2 for Product 2', 6.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(207, 2, 'Variant 3 for Product 2', 1.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(208, 2, 'Variant 4 for Product 2', 7.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(209, 3, 'Variant 1 for Product 3', 4.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(210, 3, 'Variant 2 for Product 3', 1.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(211, 3, 'Variant 3 for Product 3', 8.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(212, 3, 'Variant 4 for Product 3', 9.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(213, 10, 'Variant 1 for Product 10', 1.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(214, 10, 'Variant 2 for Product 10', 9.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(215, 10, 'Variant 3 for Product 10', 10.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(216, 10, 'Variant 4 for Product 10', 7.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(217, 20, 'Variant 1 for Product 20', 6.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(218, 20, 'Variant 2 for Product 20', 9.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(219, 20, 'Variant 3 for Product 20', 4.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(220, 20, 'Variant 4 for Product 20', 9.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(221, 21, 'Variant 1 for Product 21', 1.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(222, 21, 'Variant 2 for Product 21', 8.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(223, 21, 'Variant 3 for Product 21', 5.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(224, 21, 'Variant 4 for Product 21', 4.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(225, 22, 'Variant 1 for Product 22', 8.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(226, 22, 'Variant 2 for Product 22', 3.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(227, 22, 'Variant 3 for Product 22', 6.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(228, 22, 'Variant 4 for Product 22', 5.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(229, 23, 'Variant 1 for Product 23', 2.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(230, 23, 'Variant 2 for Product 23', 2.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(231, 23, 'Variant 3 for Product 23', 9.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(232, 23, 'Variant 4 for Product 23', 4.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(233, 24, 'Variant 1 for Product 24', 9.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(234, 24, 'Variant 2 for Product 24', 7.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(235, 24, 'Variant 3 for Product 24', 9.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(236, 24, 'Variant 4 for Product 24', 3.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(237, 25, 'Variant 1 for Product 25', 5.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(238, 25, 'Variant 2 for Product 25', 1.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(239, 25, 'Variant 3 for Product 25', 2.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(240, 25, 'Variant 4 for Product 25', 10.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(241, 26, 'Variant 1 for Product 26', 7.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(242, 26, 'Variant 2 for Product 26', 5.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(243, 26, 'Variant 3 for Product 26', 8.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(244, 26, 'Variant 4 for Product 26', 3.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(245, 27, 'Variant 1 for Product 27', 7.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(246, 27, 'Variant 2 for Product 27', 2.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(247, 27, 'Variant 3 for Product 27', 4.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(248, 27, 'Variant 4 for Product 27', 9.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(249, 28, 'Variant 1 for Product 28', 6.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(250, 28, 'Variant 2 for Product 28', 3.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(251, 28, 'Variant 3 for Product 28', 2.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(252, 28, 'Variant 4 for Product 28', 6.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(253, 29, 'Variant 1 for Product 29', 3.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(254, 29, 'Variant 2 for Product 29', 5.00, 'Pack', NULL, 'Auction-unit', 'Approved'),
(255, 29, 'Variant 3 for Product 29', 1.00, 'Pack', NULL, 'Auction-unit', 'Approved');

-- --------------------------------------------------------

--
-- Table structure for table `queries`
--

CREATE TABLE `queries` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `subject_type` varchar(100) NOT NULL,
  `subject_id` bigint(20) UNSIGNED NOT NULL,
  `creator_id` int(10) UNSIGNED NOT NULL,
  `creator_role` varchar(50) NOT NULL,
  `assigned_to` int(10) UNSIGNED DEFAULT NULL,
  `note` text NOT NULL,
  `flag_types` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`flag_types`)),
  `status` enum('Open','Closed','Archived') DEFAULT 'Open',
  `response` text DEFAULT NULL,
  `time_created` timestamp NOT NULL DEFAULT current_timestamp(),
  `time_resolved` datetime DEFAULT NULL,
  `priority` enum('Low','Normal','High','Critical') DEFAULT 'Normal',
  `assigned_role` varchar(50) DEFAULT NULL,
  `closed_by` int(10) UNSIGNED DEFAULT NULL,
  `close_reason` text DEFAULT NULL,
  `last_activity` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `queries`
--

INSERT INTO `queries` (`id`, `subject_type`, `subject_id`, `creator_id`, `creator_role`, `assigned_to`, `note`, `flag_types`, `status`, `response`, `time_created`, `time_resolved`, `priority`, `assigned_role`, `closed_by`, `close_reason`, `last_activity`, `created_at`) VALUES
(1, 'Partners', 13, 103, 'SeniorAdmin', 102, 'trty thius one', NULL, 'Open', NULL, '2026-03-05 16:04:03', NULL, 'Normal', NULL, NULL, NULL, '2026-03-07 08:06:16', '2026-03-07 08:06:16'),
(2, 'Partners', 16, 103, 'SeniorAdmin', 102, 'The standard query GOOOO', NULL, 'Open', NULL, '2026-03-05 16:09:11', NULL, 'Normal', NULL, NULL, NULL, '2026-03-07 08:06:16', '2026-03-07 08:06:16'),
(3, 'Global', 0, 1, 'Admin', NULL, 'Test Query from Subagent - All checks passing so far.', NULL, 'Open', NULL, '2026-03-05 17:00:17', NULL, 'Normal', NULL, NULL, NULL, '2026-03-07 08:06:16', '2026-03-07 08:06:16'),
(4, 'Wave', 8, 1, 'Admin', NULL, 'DAGA Queery test', NULL, 'Open', NULL, '2026-03-05 17:03:19', NULL, 'Normal', NULL, NULL, NULL, '2026-03-07 08:06:16', '2026-03-07 08:06:16'),
(5, 'assigned_sba', 20, 1, 'Admin', NULL, 'SBA Acquisition Query QQQ', NULL, 'Open', NULL, '2026-03-05 17:09:48', NULL, 'Normal', NULL, NULL, NULL, '2026-03-07 08:06:16', '2026-03-07 08:06:16'),
(6, 'unassigned_dispatch', 20, 1, 'Admin', NULL, 'ZBD Disp Query ZZZZ', NULL, 'Open', NULL, '2026-03-05 17:10:45', NULL, 'Normal', NULL, NULL, NULL, '2026-03-07 08:06:16', '2026-03-07 08:06:16'),
(7, 'Global', 0, 1, 'Admin', NULL, 'Trying the global page Query GGGG', NULL, 'Open', NULL, '2026-03-05 17:18:33', NULL, 'Normal', NULL, NULL, NULL, '2026-03-07 08:06:16', '2026-03-07 08:06:16'),
(8, 'remittance', 9009, 1, 'Admin', NULL, 'zbd Query test zzzz', NULL, 'Open', NULL, '2026-03-05 17:19:11', NULL, 'Normal', NULL, NULL, NULL, '2026-03-07 08:06:16', '2026-03-07 08:06:16'),
(9, 'sba', 3, 1, 'Admin', NULL, 'Order SAB Assign Query', NULL, 'Open', NULL, '2026-03-05 17:26:05', NULL, 'Normal', NULL, NULL, NULL, '2026-03-07 08:06:16', '2026-03-07 08:06:16'),
(10, 'zbdp', 8004, 1, 'Admin', NULL, 'Order ZBD assign query', NULL, 'Open', NULL, '2026-03-05 17:26:40', NULL, 'Normal', NULL, NULL, NULL, '2026-03-07 08:06:16', '2026-03-07 08:06:16'),
(11, 'Wave', 7, 1, 'Admin', NULL, 'Auction Wave Query', NULL, 'Open', NULL, '2026-03-05 17:29:17', NULL, 'Normal', NULL, NULL, NULL, '2026-03-07 08:06:16', '2026-03-07 08:06:16'),
(12, 'Queried', 101, 1, 'Admin', NULL, 'Test Query', NULL, 'Open', NULL, '2026-03-05 19:14:40', NULL, 'Normal', NULL, NULL, NULL, '2026-03-07 08:06:16', '2026-03-07 08:06:16'),
(13, 'Queried', 102, 1, 'Admin', NULL, 'Mary Test Query', NULL, 'Open', NULL, '2026-03-05 19:15:31', NULL, 'Normal', NULL, NULL, NULL, '2026-03-07 08:06:16', '2026-03-07 08:06:16'),
(14, 'Queried', 201, 1, 'Admin', NULL, 'Driver Dan Query', NULL, 'Open', NULL, '2026-03-05 19:16:26', NULL, 'Normal', NULL, NULL, NULL, '2026-03-07 08:06:16', '2026-03-07 08:06:16'),
(15, 'Product', 32, 1, 'Admin', NULL, 'Inventory Test', NULL, 'Open', NULL, '2026-03-05 19:17:19', NULL, 'Normal', NULL, NULL, NULL, '2026-03-07 08:06:16', '2026-03-07 08:06:16'),
(16, 'Test', 1, 1, 'Admin', NULL, 'Automatic Test Query', NULL, 'Open', NULL, '2026-03-05 19:18:29', NULL, 'Normal', NULL, NULL, NULL, '2026-03-07 08:06:16', '2026-03-07 08:06:16'),
(17, 'Global', 0, 1, 'Admin', NULL, 'Global Test Query', NULL, 'Open', NULL, '2026-03-05 19:19:27', NULL, 'Normal', NULL, NULL, NULL, '2026-03-07 08:06:16', '2026-03-07 08:06:16'),
(18, 'AuctionSession', 21, 1, 'Admin', NULL, 'OH That ?', NULL, 'Open', NULL, '2026-03-06 10:47:37', NULL, 'Normal', NULL, NULL, NULL, '2026-03-07 08:06:16', '2026-03-07 08:06:16');

-- --------------------------------------------------------

--
-- Table structure for table `query_audit_log`
--

CREATE TABLE `query_audit_log` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `query_id` bigint(20) UNSIGNED NOT NULL,
  `actor_id` int(10) UNSIGNED NOT NULL,
  `actor_role` varchar(50) NOT NULL,
  `action` varchar(100) NOT NULL,
  `detail` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `query_notifications`
--

CREATE TABLE `query_notifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `query_id` bigint(20) UNSIGNED NOT NULL,
  `recipient_id` int(10) UNSIGNED NOT NULL,
  `recipient_role` varchar(50) NOT NULL,
  `type` enum('NewAssignment','NewResponse','PriorityChange','ThreadClosed') NOT NULL,
  `message` text DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `query_responses`
--

CREATE TABLE `query_responses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `query_id` bigint(20) UNSIGNED NOT NULL,
  `responder_id` int(10) UNSIGNED NOT NULL,
  `responder_role` varchar(50) NOT NULL,
  `message` text NOT NULL,
  `forwarded_to` int(10) UNSIGNED DEFAULT NULL,
  `forwarded_role` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `query_response_notes`
--

CREATE TABLE `query_response_notes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `response_id` bigint(20) UNSIGNED NOT NULL,
  `author_id` int(10) UNSIGNED NOT NULL,
  `author_role` varchar(50) NOT NULL,
  `note` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `readiness_check_logs`
--

CREATE TABLE `readiness_check_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `session_id` bigint(20) UNSIGNED NOT NULL,
  `whm_staff_id` int(10) UNSIGNED DEFAULT NULL,
  `admin_staff_id` int(10) UNSIGNED DEFAULT NULL,
  `check_type` enum('Stock','Quality','Manpower','Logistics','Financial','Overall') NOT NULL,
  `status` enum('Pending','Verified','Flagged','Rejected') DEFAULT 'Pending',
  `comments` text DEFAULT NULL,
  `report_url` varchar(255) DEFAULT NULL,
  `report_metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`report_metadata`)),
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `readiness_check_logs`
--

INSERT INTO `readiness_check_logs` (`id`, `session_id`, `whm_staff_id`, `admin_staff_id`, `check_type`, `status`, `comments`, `report_url`, `report_metadata`, `timestamp`) VALUES
(1, 11, 10, NULL, 'Overall', 'Verified', NULL, NULL, '{\"info\":\"Automated seed data\"}', '2026-03-05 12:33:59'),
(2, 12, 10, NULL, 'Overall', 'Verified', NULL, NULL, '{\"info\":\"Automated seed data\"}', '2026-03-05 12:35:56'),
(3, 13, 10, NULL, 'Overall', 'Verified', NULL, NULL, '{\"info\":\"Automated seed data\"}', '2026-03-05 12:35:56'),
(4, 14, 10, NULL, 'Overall', 'Verified', NULL, NULL, '{\"info\":\"Automated seed data\"}', '2026-03-05 12:35:56'),
(5, 15, 10, NULL, 'Overall', 'Verified', NULL, NULL, '{\"info\":\"Automated seed data\"}', '2026-03-05 12:35:56');

-- --------------------------------------------------------

--
-- Table structure for table `sba_acquisitions`
--

CREATE TABLE `sba_acquisitions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `sba_id` int(10) UNSIGNED DEFAULT NULL,
  `base_product_id` bigint(20) UNSIGNED DEFAULT NULL,
  `order_item_id` bigint(20) UNSIGNED DEFAULT NULL,
  `total_qty` int(11) NOT NULL,
  `unit_cost` decimal(15,2) DEFAULT NULL,
  `remittance_status` enum('Pending','Paid','Acknowledged','Cancelled') DEFAULT 'Pending',
  `remittance_id` bigint(20) UNSIGNED DEFAULT NULL,
  `time_recorded` timestamp NOT NULL DEFAULT current_timestamp(),
  `assign_status` enum('pending','approved','sbaAck','sbaRejected','cancelled','hanging') DEFAULT 'pending',
  `supply_status` enum('pending','acknowledged','supplied','QApassed','completed','QArejected','QArisk') DEFAULT 'pending',
  `time_assigned` datetime DEFAULT NULL,
  `time_approved` datetime DEFAULT NULL,
  `admin_notes` text DEFAULT NULL,
  `whm_notes` text DEFAULT NULL,
  `sba_notes` text DEFAULT NULL,
  `issue_type` varchar(100) DEFAULT NULL,
  `session_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sba_acquisitions`
--

INSERT INTO `sba_acquisitions` (`id`, `sba_id`, `base_product_id`, `order_item_id`, `total_qty`, `unit_cost`, `remittance_status`, `remittance_id`, `time_recorded`, `assign_status`, `supply_status`, `time_assigned`, `time_approved`, `admin_notes`, `whm_notes`, `sba_notes`, `issue_type`, `session_id`) VALUES
(3, 101, 1, 16, 1500, 48000.00, 'Pending', NULL, '2026-02-27 23:14:40', 'pending', 'pending', '2026-02-27 12:14:40', NULL, NULL, NULL, NULL, NULL, NULL),
(4, 101, 2, 16, 500, 5200.00, 'Pending', NULL, '2026-02-27 23:14:40', 'pending', 'pending', '2026-02-27 18:14:40', NULL, NULL, NULL, NULL, NULL, NULL),
(5, 101, 1, 16, 200, 48000.00, 'Pending', NULL, '2026-02-27 23:14:40', 'approved', 'supplied', '2026-02-27 22:14:40', NULL, NULL, NULL, NULL, NULL, NULL),
(6, 101, 2, 16, 800, 5200.00, 'Pending', NULL, '2026-02-27 23:14:40', 'approved', 'QApassed', '2026-02-27 23:14:40', NULL, NULL, NULL, NULL, NULL, NULL),
(7, 101, 3, 16, 100, 6500.00, 'Pending', NULL, '2026-02-27 23:14:40', 'approved', 'completed', '2026-02-26 00:14:40', NULL, NULL, NULL, NULL, NULL, NULL),
(8, 101, 1, 16, 1500, 48000.00, 'Pending', NULL, '2026-02-27 23:16:09', 'pending', 'pending', '2026-02-27 12:16:09', NULL, NULL, NULL, NULL, NULL, NULL),
(9, 101, 2, 16, 500, 5200.00, 'Pending', NULL, '2026-02-27 23:16:09', 'pending', 'pending', '2026-02-27 18:16:09', NULL, NULL, NULL, NULL, NULL, NULL),
(10, 101, 1, 16, 200, 48000.00, 'Pending', NULL, '2026-02-27 23:16:09', 'approved', 'supplied', '2026-02-27 22:16:09', NULL, NULL, NULL, NULL, NULL, NULL),
(11, 101, 2, 16, 800, 5200.00, 'Pending', NULL, '2026-02-27 23:16:09', 'approved', 'QApassed', '2026-02-27 23:16:09', NULL, NULL, NULL, NULL, NULL, NULL),
(12, 101, 3, 16, 100, 6500.00, 'Pending', NULL, '2026-02-27 23:16:09', 'approved', 'completed', '2026-02-26 00:16:09', NULL, NULL, NULL, NULL, NULL, NULL),
(13, 101, 1, 16, 1500, 48000.00, 'Pending', NULL, '2026-02-27 23:32:43', 'pending', 'pending', '2026-02-27 12:32:43', NULL, NULL, NULL, NULL, NULL, NULL),
(14, 101, 2, 16, 500, 5200.00, 'Pending', NULL, '2026-02-27 23:32:43', 'cancelled', 'pending', '2026-02-27 18:32:43', NULL, NULL, NULL, NULL, NULL, NULL),
(15, 101, 1, 16, 200, 48000.00, 'Pending', NULL, '2026-02-27 23:32:43', 'approved', 'supplied', '2026-02-27 22:32:43', NULL, NULL, NULL, NULL, NULL, NULL),
(16, 101, 2, 16, 800, 5200.00, 'Pending', NULL, '2026-02-27 23:32:43', 'approved', 'QApassed', '2026-02-27 23:32:43', NULL, NULL, NULL, NULL, NULL, NULL),
(17, 101, 3, 16, 100, 6500.00, 'Pending', NULL, '2026-02-27 23:32:43', 'approved', 'completed', '2026-02-26 00:32:43', NULL, NULL, NULL, NULL, NULL, NULL),
(18, 101, 1, NULL, 50, 4500.00, 'Pending', NULL, '2026-02-28 18:03:59', 'pending', 'pending', '2026-02-28 19:03:59', NULL, NULL, NULL, NULL, NULL, NULL),
(19, 101, 2, NULL, 20, 15000.00, 'Pending', NULL, '2026-02-28 18:03:59', 'hanging', 'QArisk', '2026-02-28 19:03:59', NULL, NULL, NULL, NULL, NULL, NULL),
(20, 101, 3, NULL, 150, 2000.00, 'Pending', NULL, '2026-02-28 18:03:59', 'approved', 'completed', '2026-02-27 19:03:59', NULL, NULL, NULL, NULL, NULL, NULL),
(21, NULL, 2, NULL, 500, 5200.00, 'Pending', NULL, '2026-02-28 18:50:34', '', 'pending', '2026-02-28 19:50:34', NULL, NULL, NULL, NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`setting_key`, `setting_value`, `updated_at`) VALUES
('deposit_auto_limit', '100000', '2026-02-26 08:09:15');

-- --------------------------------------------------------

--
-- Table structure for table `shipping`
--

CREATE TABLE `shipping` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `zbdp_id` int(10) UNSIGNED DEFAULT NULL,
  `transport_bill_amount` decimal(15,2) DEFAULT NULL,
  `current_status` varchar(50) DEFAULT NULL,
  `dispatch_time` datetime DEFAULT NULL,
  `delivery_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `show_products`
--

CREATE TABLE `show_products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `session_id` varchar(50) NOT NULL,
  `variant_id` int(10) UNSIGNED NOT NULL,
  `display_name` varchar(255) DEFAULT NULL,
  `starting_price` decimal(15,2) DEFAULT NULL,
  `current_price` decimal(15,2) DEFAULT NULL,
  `stock_available` int(10) UNSIGNED DEFAULT 0,
  `status` enum('Active','SoldOut','Ended') DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `show_products`
--

INSERT INTO `show_products` (`id`, `session_id`, `variant_id`, `display_name`, `starting_price`, `current_price`, `stock_available`, `status`) VALUES
(1, '21', 1, NULL, NULL, 14500.00, 100, 'Active'),
(1000, 'sess-01', 100, NULL, NULL, NULL, 0, 'Active'),
(2000, 'sess-01', 200, NULL, NULL, NULL, 0, 'Active'),
(2001, '11', 205, NULL, 4790.00, 4790.00, 148, 'Active'),
(2002, '11', 213, NULL, 2959.00, 2959.00, 56, 'Active'),
(2003, '11', 237, NULL, 9660.00, 9660.00, 73, 'Active'),
(2004, '11', 233, NULL, 5336.00, 5336.00, 84, 'Active'),
(2005, '11', 206, NULL, 6391.00, 6391.00, 114, 'Active'),
(2006, '11', 241, NULL, 9162.00, 9162.00, 125, 'Active'),
(2007, '11', 239, NULL, 1736.00, 1736.00, 178, 'Active'),
(2008, '11', 236, NULL, 6057.00, 6057.00, 137, 'Active'),
(2009, '11', 227, NULL, 9693.00, 9693.00, 61, 'Active'),
(2010, '11', 240, NULL, 6401.00, 6401.00, 123, 'Active'),
(2011, '11', 219, NULL, 8288.00, 8288.00, 193, 'Active'),
(2012, '11', 208, NULL, 3164.00, 3164.00, 135, 'Active'),
(2013, '11', 216, NULL, 9007.00, 9007.00, 50, 'Active'),
(2014, '11', 209, NULL, 8411.00, 8411.00, 147, 'Active'),
(2015, '11', 222, NULL, 7408.00, 7408.00, 67, 'Active'),
(2016, '12', 240, NULL, 8940.00, 8940.00, 56, 'Active'),
(2017, '12', 255, NULL, 7735.00, 7735.00, 85, 'Active'),
(2018, '12', 244, NULL, 8207.00, 8207.00, 178, 'Active'),
(2019, '12', 220, NULL, 9319.00, 9319.00, 92, 'Active'),
(2020, '12', 217, NULL, 3925.00, 3925.00, 145, 'Active'),
(2021, '12', 201, NULL, 3030.00, 3030.00, 156, 'Active'),
(2022, '12', 235, NULL, 4218.00, 4218.00, 197, 'Active'),
(2023, '12', 213, NULL, 4593.00, 4593.00, 161, 'Active'),
(2024, '12', 212, NULL, 5035.00, 5035.00, 106, 'Active'),
(2025, '12', 245, NULL, 1216.00, 1216.00, 156, 'Active'),
(2026, '12', 218, NULL, 5527.00, 5527.00, 159, 'Active'),
(2027, '12', 254, NULL, 8081.00, 8081.00, 195, 'Active'),
(2028, '12', 231, NULL, 6483.00, 6483.00, 110, 'Active'),
(2029, '12', 203, NULL, 1711.00, 1711.00, 185, 'Active'),
(2030, '12', 202, NULL, 6456.00, 6456.00, 179, 'Active'),
(2031, '13', 223, NULL, 3181.00, 3181.00, 57, 'Active'),
(2032, '13', 228, NULL, 2923.00, 2923.00, 99, 'Active'),
(2033, '13', 245, NULL, 7115.00, 7115.00, 117, 'Active'),
(2034, '13', 221, NULL, 3889.00, 3889.00, 153, 'Active'),
(2035, '13', 204, NULL, 6491.00, 6491.00, 52, 'Active'),
(2036, '13', 251, NULL, 4194.00, 4194.00, 197, 'Active'),
(2037, '13', 248, NULL, 2783.00, 2783.00, 196, 'Active'),
(2038, '13', 239, NULL, 5102.00, 5102.00, 176, 'Active'),
(2039, '13', 254, NULL, 2364.00, 2364.00, 157, 'Active'),
(2040, '13', 234, NULL, 4591.00, 4591.00, 52, 'Active'),
(2041, '13', 247, NULL, 1759.00, 1759.00, 92, 'Active'),
(2042, '13', 217, NULL, 2064.00, 2064.00, 90, 'Active'),
(2043, '13', 229, NULL, 1515.00, 1515.00, 110, 'Active'),
(2044, '13', 255, NULL, 7458.00, 7458.00, 165, 'Active'),
(2045, '13', 240, NULL, 8620.00, 8620.00, 179, 'Active'),
(2046, '14', 209, NULL, 2302.00, 2302.00, 54, 'Active'),
(2047, '14', 243, NULL, 3882.00, 3882.00, 98, 'Active'),
(2048, '14', 204, NULL, 5612.00, 5612.00, 181, 'Active'),
(2049, '14', 210, NULL, 2763.00, 2763.00, 126, 'Active'),
(2050, '14', 246, NULL, 5613.00, 5613.00, 65, 'Active'),
(2051, '14', 217, NULL, 2095.00, 2095.00, 118, 'Active'),
(2052, '14', 222, NULL, 6942.00, 6942.00, 101, 'Active'),
(2053, '14', 219, NULL, 6640.00, 6640.00, 121, 'Active'),
(2054, '14', 235, NULL, 5920.00, 5920.00, 112, 'Active'),
(2055, '14', 227, NULL, 6990.00, 6990.00, 192, 'Active'),
(2056, '14', 215, NULL, 3347.00, 3347.00, 186, 'Active'),
(2057, '14', 208, NULL, 2781.00, 2781.00, 64, 'Active'),
(2058, '14', 226, NULL, 8036.00, 8036.00, 93, 'Active'),
(2059, '14', 233, NULL, 7739.00, 7739.00, 186, 'Active'),
(2060, '14', 202, NULL, 6635.00, 6635.00, 73, 'Active'),
(2061, '15', 238, NULL, 1189.00, 1189.00, 85, 'Active'),
(2062, '15', 237, NULL, 3498.00, 3498.00, 119, 'Active'),
(2063, '15', 208, NULL, 2766.00, 2766.00, 149, 'Active'),
(2064, '15', 242, NULL, 9135.00, 9135.00, 166, 'Active'),
(2065, '15', 250, NULL, 9650.00, 9650.00, 69, 'Active'),
(2066, '15', 254, NULL, 1613.00, 1613.00, 156, 'Active'),
(2067, '15', 222, NULL, 7043.00, 7043.00, 54, 'Active'),
(2068, '15', 223, NULL, 6763.00, 6763.00, 57, 'Active'),
(2069, '15', 228, NULL, 4411.00, 4411.00, 66, 'Active'),
(2070, '15', 251, NULL, 9975.00, 9975.00, 93, 'Active'),
(2071, '15', 229, NULL, 6073.00, 6073.00, 51, 'Active'),
(2072, '15', 230, NULL, 2644.00, 2644.00, 102, 'Active'),
(2073, '15', 235, NULL, 1244.00, 1244.00, 72, 'Active'),
(2074, '15', 202, NULL, 3866.00, 3866.00, 132, 'Active'),
(2075, '15', 212, NULL, 1535.00, 1535.00, 81, 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `staff_users`
--

CREATE TABLE `staff_users` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `middle_name` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone_number` varchar(20) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('Admin','SeniorAdmin','WHM','Sales') NOT NULL,
  `contact_info` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`contact_info`)),
  `added_by` int(10) UNSIGNED DEFAULT NULL,
  `time_created` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('Active','Suspended','Hidden','Deployed','AwaitingApproval') DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff_users`
--

INSERT INTO `staff_users` (`id`, `name`, `first_name`, `last_name`, `middle_name`, `email`, `phone_number`, `password_hash`, `role`, `contact_info`, `added_by`, `time_created`, `status`) VALUES
(101, 'Admin Yusuf', NULL, NULL, NULL, NULL, '08011111111', 'hash', 'Admin', '{\"deployment\":\"\"}', NULL, '2026-02-26 06:38:49', 'Active'),
(102, 'WHM Balogun', NULL, NULL, NULL, NULL, '08022222222', 'hash', 'WHM', NULL, NULL, '2026-02-26 06:38:49', 'Active'),
(103, 'SeniorAdmin', NULL, NULL, NULL, NULL, '08033333333', 'hash', 'SeniorAdmin', '{\"deployment\":\"\"}', NULL, '2026-02-26 06:38:49', 'Deployed'),
(104, 'Sales Rep 1', NULL, NULL, NULL, NULL, '08044444444', '', 'Sales', NULL, NULL, '2026-02-26 08:08:33', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `system_banks`
--

CREATE TABLE `system_banks` (
  `id` int(10) UNSIGNED NOT NULL,
  `bank_name` varchar(100) NOT NULL,
  `account_number` varchar(20) NOT NULL,
  `account_name` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `charge_officer_id` int(10) UNSIGNED DEFAULT NULL,
  `status` enum('Pending','Active','Suspended') DEFAULT 'Pending',
  `time_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `system_banks`
--

INSERT INTO `system_banks` (`id`, `bank_name`, `account_number`, `account_name`, `is_active`, `charge_officer_id`, `status`, `time_created`) VALUES
(1, 'Zenith Bank', '1234567890', 'AreaBazaar Collections', 1, NULL, 'Active', '2026-02-26 08:31:44'),
(11, 'Operations Bank 1', '203940191', 'AreaBazaar Ops 1', 1, NULL, 'Active', '2026-02-26 10:51:48'),
(12, 'Operations Bank 2', '203940192', 'AreaBazaar Ops 2', 1, NULL, 'Active', '2026-02-26 10:51:48'),
(13, 'Operations Bank 3', '203940193', 'AreaBazaar Ops 3', 1, NULL, 'Active', '2026-02-26 10:51:48'),
(14, 'Operations Bank 4', '203940194', 'AreaBazaar Ops 4', 1, NULL, 'Active', '2026-02-26 10:51:48'),
(15, 'Operations Bank 5', '203940195', 'AreaBazaar Ops 5', 1, NULL, 'Active', '2026-02-26 10:51:48'),
(16, 'Operations Bank 6', '203940196', 'AreaBazaar Ops 6', 1, NULL, 'Active', '2026-02-26 10:51:48'),
(17, 'Operations Bank 7', '203940197', 'AreaBazaar Ops 7', 1, NULL, 'Active', '2026-02-26 10:51:48'),
(18, 'Operations Bank 8', '203940198', 'AreaBazaar Ops 8', 1, NULL, 'Suspended', '2026-02-26 10:51:48'),
(19, 'Operations Bank 9', '203940199', 'AreaBazaar Ops 9', 1, NULL, 'Active', '2026-02-26 10:51:48'),
(20, 'Operations Bank 10', '2039401910', 'AreaBazaar Ops 10', 1, NULL, 'Active', '2026-02-26 10:51:48');

-- --------------------------------------------------------

--
-- Table structure for table `system_google_accounts`
--

CREATE TABLE `system_google_accounts` (
  `id` int(10) UNSIGNED NOT NULL,
  `email` varchar(255) NOT NULL,
  `purpose` varchar(100) DEFAULT NULL,
  `access_token` text DEFAULT NULL,
  `refresh_token` text DEFAULT NULL,
  `charge_officer_id` int(10) UNSIGNED DEFAULT NULL,
  `status` enum('Pending','Active','Suspended') DEFAULT 'Pending',
  `time_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `system_google_accounts`
--

INSERT INTO `system_google_accounts` (`id`, `email`, `purpose`, `access_token`, `refresh_token`, `charge_officer_id`, `status`, `time_created`) VALUES
(1, 'sync@areabazaar.com', 'BankSync Engine', NULL, NULL, NULL, 'Active', '2026-02-26 08:31:44'),
(11, 'sync1@areabazaar.com', 'Sync', NULL, NULL, NULL, 'Active', '2026-02-26 10:51:48'),
(12, 'sync2@areabazaar.com', 'Sync', NULL, NULL, NULL, 'Active', '2026-02-26 10:51:48'),
(13, 'sync3@areabazaar.com', 'Sync', NULL, NULL, NULL, 'Active', '2026-02-26 10:51:48'),
(14, 'sync4@areabazaar.com', 'Sync', NULL, NULL, NULL, 'Active', '2026-02-26 10:51:48'),
(15, 'sync5@areabazaar.com', 'Sync', NULL, NULL, NULL, 'Active', '2026-02-26 10:51:48'),
(16, 'sync6@areabazaar.com', 'Sync', NULL, NULL, NULL, 'Active', '2026-02-26 10:51:48'),
(17, 'sync7@areabazaar.com', 'Sync', NULL, NULL, NULL, 'Active', '2026-02-26 10:51:48'),
(18, 'sync8@areabazaar.com', 'Sync', NULL, NULL, NULL, 'Active', '2026-02-26 10:51:48'),
(19, 'sync9@areabazaar.com', 'Sync', NULL, NULL, NULL, 'Active', '2026-02-26 10:51:48'),
(20, 'sync10@areabazaar.com', 'Sync', NULL, NULL, NULL, 'Active', '2026-02-26 10:51:48');

-- --------------------------------------------------------

--
-- Table structure for table `transport_benchmark_cost`
--

CREATE TABLE `transport_benchmark_cost` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `base_product_id` bigint(20) UNSIGNED NOT NULL,
  `route_id` int(10) UNSIGNED NOT NULL,
  `price_per_unit` decimal(15,2) NOT NULL,
  `time_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_hidden` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transport_benchmark_cost`
--

INSERT INTO `transport_benchmark_cost` (`id`, `base_product_id`, `route_id`, `price_per_unit`, `time_updated`, `is_hidden`) VALUES
(1, 10, 1, 500.00, '2026-02-27 22:09:03', 0),
(2, 20, 1, 400.00, '2026-02-27 22:09:03', 0),
(3, 10, 2, 600.00, '2026-02-27 22:09:03', 0),
(4, 20, 2, 550.00, '2026-02-27 22:09:03', 0),
(5, 1, 1, 400.00, '2026-02-27 23:32:43', 0),
(6, 1, 2, 600.00, '2026-02-27 23:32:43', 0),
(7, 2, 1, 300.00, '2026-02-27 23:32:43', 0),
(8, 3, 1, 800.00, '2026-02-28 00:03:06', 1);

-- --------------------------------------------------------

--
-- Table structure for table `wallets`
--

CREATE TABLE `wallets` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `balance` decimal(15,2) DEFAULT 0.00,
  `surveillance_flag` tinyint(1) DEFAULT 0,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wallets`
--

INSERT INTO `wallets` (`id`, `customer_id`, `balance`, `surveillance_flag`, `last_updated`) VALUES
(1, 1, 40400.00, 0, '2026-03-06 06:50:16');

-- --------------------------------------------------------

--
-- Table structure for table `warehouse_zones`
--

CREATE TABLE `warehouse_zones` (
  `id` int(10) UNSIGNED NOT NULL,
  `zone_name` varchar(100) NOT NULL,
  `region_id` int(10) UNSIGNED DEFAULT NULL,
  `charge_officer_id` int(10) UNSIGNED DEFAULT NULL,
  `status` enum('Pending','Active','Suspended') DEFAULT 'Pending',
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `time_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `warehouse_zones`
--

INSERT INTO `warehouse_zones` (`id`, `zone_name`, `region_id`, `charge_officer_id`, `status`, `metadata`, `time_created`) VALUES
(1, 'Lagos-Island Central', NULL, NULL, 'Active', NULL, '2026-02-26 08:31:44'),
(2, 'Mainland Hub', NULL, NULL, 'Pending', NULL, '2026-02-26 08:31:44'),
(3, 'Warehouse Alpha 1', 0, NULL, 'Active', NULL, '2026-02-26 10:48:23'),
(12, 'Warehouse Alpha 2', 0, NULL, 'Active', NULL, '2026-02-26 10:49:55'),
(13, 'Warehouse Alpha 3', 0, NULL, 'Active', NULL, '2026-02-26 10:49:55'),
(14, 'Warehouse Alpha 4', 0, NULL, 'Active', NULL, '2026-02-26 10:49:55'),
(15, 'Warehouse Alpha 5', 0, NULL, 'Active', NULL, '2026-02-26 10:49:55'),
(16, 'Warehouse Alpha 6', 0, NULL, 'Active', NULL, '2026-02-26 10:49:55'),
(17, 'Warehouse Alpha 7', 0, 102, 'Active', NULL, '2026-02-26 10:49:55'),
(18, 'Warehouse Alpha 8', 0, NULL, 'Active', NULL, '2026-02-26 10:49:55'),
(19, 'Warehouse Alpha 9', 0, NULL, 'Active', NULL, '2026-02-26 10:49:55'),
(20, 'Warehouse Alpha 10', 0, NULL, 'Active', NULL, '2026-02-26 10:49:55');

-- --------------------------------------------------------

--
-- Table structure for table `waves`
--

CREATE TABLE `waves` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `session_id` bigint(20) UNSIGNED NOT NULL,
  `wave_name` varchar(255) DEFAULT NULL,
  `scheduled_at` datetime DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT 0,
  `senior_admin_approval` tinyint(1) DEFAULT 0,
  `status` enum('Pending','Active','Replaced','Cancelled','Removed') DEFAULT 'Pending',
  `actual_switch_time` datetime DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `time_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `waves`
--

INSERT INTO `waves` (`id`, `session_id`, `wave_name`, `scheduled_at`, `is_default`, `senior_admin_approval`, `status`, `actual_switch_time`, `metadata`, `time_created`) VALUES
(1, 11, 'Wave 1 for Session 11', NULL, 1, 1, 'Pending', NULL, '{\"info\":\"Seeded Wave\"}', '2026-03-05 12:33:59'),
(2, 11, 'Wave 1 for Session 11', NULL, 1, 1, 'Pending', NULL, '{\"info\":\"Seeded Wave\"}', '2026-03-05 12:35:55'),
(3, 11, 'Wave 2 for Session 11', NULL, 0, 1, 'Pending', NULL, '{\"info\":\"Seeded Wave\"}', '2026-03-05 12:35:56'),
(4, 11, 'Wave 3 for Session 11', NULL, 0, 1, 'Pending', NULL, '{\"info\":\"Seeded Wave\"}', '2026-03-05 12:35:56'),
(5, 12, 'Wave 1 for Session 12', NULL, 1, 1, 'Pending', NULL, '{\"info\":\"Seeded Wave\"}', '2026-03-05 12:35:56'),
(6, 12, 'Wave 2 for Session 12', NULL, 0, 1, 'Pending', NULL, '{\"info\":\"Seeded Wave\"}', '2026-03-05 12:35:56'),
(7, 12, 'Wave 3 for Session 12', NULL, 0, 1, 'Pending', NULL, '{\"info\":\"Seeded Wave\"}', '2026-03-05 12:35:56'),
(8, 12, 'Wave 4 for Session 12- DAGA', NULL, 0, 1, 'Pending', NULL, '{\"info\":\"Seeded Wave\"}', '2026-03-05 12:35:56'),
(9, 13, 'Wave 1 for Session 13', NULL, 1, 1, 'Pending', NULL, '{\"info\":\"Seeded Wave\"}', '2026-03-05 12:35:56'),
(10, 13, 'Wave 2 for Session 13', NULL, 0, 1, 'Pending', NULL, '{\"info\":\"Seeded Wave\"}', '2026-03-05 12:35:56'),
(11, 13, 'Wave 3 for Session 13', NULL, 0, 1, 'Pending', NULL, '{\"info\":\"Seeded Wave\"}', '2026-03-05 12:35:56'),
(12, 13, 'Wave 4 for Session 13', NULL, 0, 1, 'Pending', NULL, '{\"info\":\"Seeded Wave\"}', '2026-03-05 12:35:56'),
(13, 13, 'Wave 5 for Session 13', NULL, 0, 1, 'Pending', NULL, '{\"info\":\"Seeded Wave\"}', '2026-03-05 12:35:56'),
(14, 14, 'Wave 1 for Session 14', NULL, 1, 1, 'Pending', NULL, '{\"info\":\"Seeded Wave\"}', '2026-03-05 12:35:56'),
(15, 14, 'Wave 2 for Session 14', NULL, 0, 1, 'Pending', NULL, '{\"info\":\"Seeded Wave\"}', '2026-03-05 12:35:56'),
(16, 14, 'Wave 3 for Session 14', NULL, 0, 1, 'Pending', NULL, '{\"info\":\"Seeded Wave\"}', '2026-03-05 12:35:56'),
(17, 14, 'Wave 4 for Session 14', NULL, 0, 1, 'Pending', NULL, '{\"info\":\"Seeded Wave\"}', '2026-03-05 12:35:56'),
(18, 15, 'Wave 1 for Session 15', NULL, 1, 1, 'Pending', NULL, '{\"info\":\"Seeded Wave\"}', '2026-03-05 12:35:56'),
(19, 15, 'Wave 2 for Session 15', NULL, 0, 1, 'Pending', NULL, '{\"info\":\"Seeded Wave\"}', '2026-03-05 12:35:56'),
(20, 15, 'Wave 3 for Session 15', NULL, 0, 1, 'Pending', NULL, '{\"info\":\"Seeded Wave\"}', '2026-03-05 12:35:56'),
(21, 15, 'Wave 4 for Session 15', NULL, 0, 1, 'Pending', NULL, '{\"info\":\"Seeded Wave\"}', '2026-03-05 12:35:56'),
(22, 21, 'Beta Wave 1', NULL, 1, 0, 'Pending', NULL, NULL, '2026-03-06 10:44:54');

-- --------------------------------------------------------

--
-- Table structure for table `wave_items`
--

CREATE TABLE `wave_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `wave_id` bigint(20) UNSIGNED NOT NULL,
  `variant_id` int(10) UNSIGNED NOT NULL,
  `new_price` decimal(15,2) NOT NULL,
  `new_stock` int(10) UNSIGNED DEFAULT NULL,
  `status` enum('Active','Suspended','Deactivated') DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wave_items`
--

INSERT INTO `wave_items` (`id`, `wave_id`, `variant_id`, `new_price`, `new_stock`, `status`) VALUES
(1, 1, 245, 7249.00, 72, 'Active'),
(2, 2, 205, 4790.00, 114, 'Active'),
(3, 2, 213, 2959.00, 185, 'Active'),
(4, 2, 237, 9660.00, 186, 'Active'),
(5, 2, 233, 5336.00, 83, 'Active'),
(6, 2, 206, 6391.00, 100, 'Active'),
(7, 2, 241, 9162.00, 131, 'Active'),
(8, 2, 239, 1736.00, 173, 'Active'),
(9, 2, 236, 6057.00, 200, 'Active'),
(10, 2, 227, 9693.00, 123, 'Active'),
(11, 2, 240, 6401.00, 196, 'Active'),
(12, 2, 219, 8288.00, 110, 'Active'),
(13, 2, 208, 3164.00, 196, 'Active'),
(14, 2, 216, 9007.00, 52, 'Active'),
(15, 2, 209, 8411.00, 120, 'Active'),
(16, 2, 222, 7408.00, 169, 'Active'),
(17, 3, 205, 8422.70, 137, 'Active'),
(18, 3, 213, 1448.75, 72, 'Active'),
(19, 3, 237, 5962.20, 172, 'Active'),
(20, 3, 233, 6077.15, 59, 'Active'),
(21, 3, 206, 7910.65, 133, 'Active'),
(22, 3, 241, 7365.35, 98, 'Active'),
(23, 3, 239, 3794.30, 63, 'Active'),
(24, 3, 236, 7652.25, 115, 'Active'),
(25, 3, 227, 4854.50, 105, 'Active'),
(26, 3, 240, 4290.20, 173, 'Active'),
(27, 3, 219, 4066.95, 66, 'Active'),
(28, 3, 208, 6088.55, 71, 'Active'),
(29, 3, 216, 4164.80, 139, 'Active'),
(30, 3, 209, 7611.40, 180, 'Active'),
(31, 3, 222, 5643.95, 103, 'Active'),
(32, 4, 205, 7275.60, 134, 'Active'),
(33, 4, 213, 3987.90, 110, 'Active'),
(34, 4, 237, 4564.80, 196, 'Active'),
(35, 4, 233, 2294.10, 98, 'Active'),
(36, 4, 206, 6480.90, 121, 'Active'),
(37, 4, 241, 6825.60, 101, 'Active'),
(38, 4, 239, 1107.00, 191, 'Active'),
(39, 4, 236, 3474.00, 121, 'Active'),
(40, 4, 227, 3180.60, 139, 'Active'),
(41, 4, 240, 5352.30, 171, 'Active'),
(42, 4, 219, 1566.00, 173, 'Active'),
(43, 4, 208, 5058.00, 81, 'Active'),
(44, 4, 216, 1267.20, 87, 'Active'),
(45, 4, 209, 4904.10, 98, 'Active'),
(46, 4, 222, 7080.30, 147, 'Active'),
(47, 5, 240, 8940.00, 123, 'Active'),
(48, 5, 255, 7735.00, 60, 'Active'),
(49, 5, 244, 8207.00, 146, 'Active'),
(50, 5, 220, 9319.00, 133, 'Active'),
(51, 5, 217, 3925.00, 86, 'Active'),
(52, 5, 201, 3030.00, 137, 'Active'),
(53, 5, 235, 4218.00, 115, 'Active'),
(54, 5, 213, 4593.00, 197, 'Active'),
(55, 5, 212, 5035.00, 167, 'Active'),
(56, 5, 245, 1216.00, 187, 'Active'),
(57, 5, 218, 5527.00, 196, 'Active'),
(58, 5, 254, 8081.00, 128, 'Active'),
(59, 5, 231, 6483.00, 176, 'Active'),
(60, 5, 203, 1711.00, 108, 'Active'),
(61, 5, 202, 6456.00, 52, 'Active'),
(62, 6, 240, 2957.35, 120, 'Active'),
(63, 6, 255, 5884.30, 124, 'Active'),
(64, 6, 244, 6327.00, 63, 'Active'),
(65, 6, 220, 3738.25, 197, 'Active'),
(66, 6, 217, 8515.80, 89, 'Active'),
(67, 6, 201, 6094.25, 117, 'Active'),
(68, 6, 235, 6534.10, 120, 'Active'),
(69, 6, 213, 4539.10, 109, 'Active'),
(70, 6, 212, 7427.10, 118, 'Active'),
(71, 6, 245, 2471.90, 60, 'Active'),
(72, 6, 218, 7651.30, 90, 'Active'),
(73, 6, 254, 8900.55, 151, 'Active'),
(74, 6, 231, 8725.75, 69, 'Active'),
(75, 6, 203, 8680.15, 163, 'Active'),
(76, 6, 202, 2178.35, 124, 'Active'),
(77, 7, 240, 7105.50, 82, 'Active'),
(78, 7, 255, 3429.00, 51, 'Active'),
(79, 7, 244, 7155.90, 137, 'Active'),
(80, 7, 220, 2942.10, 76, 'Active'),
(81, 7, 217, 1839.60, 166, 'Active'),
(82, 7, 201, 8856.00, 122, 'Active'),
(83, 7, 235, 5314.50, 58, 'Active'),
(84, 7, 213, 6213.60, 162, 'Active'),
(85, 7, 212, 1828.80, 120, 'Active'),
(86, 7, 245, 1658.70, 137, 'Active'),
(87, 7, 218, 7667.10, 103, 'Active'),
(88, 7, 254, 4031.10, 51, 'Active'),
(89, 7, 231, 7024.50, 185, 'Active'),
(90, 7, 203, 4041.00, 193, 'Active'),
(91, 7, 202, 8181.90, 193, 'Active'),
(92, 8, 240, 7044.00, 138, 'Active'),
(93, 8, 255, 8008.00, 64, 'Active'),
(94, 8, 244, 5719.00, 85, 'Active'),
(95, 8, 220, 5603.00, 135, 'Active'),
(96, 8, 217, 4373.00, 127, 'Active'),
(97, 8, 201, 3524.00, 53, 'Active'),
(98, 8, 235, 2671.00, 98, 'Active'),
(99, 8, 213, 8925.00, 164, 'Active'),
(100, 8, 212, 9951.00, 94, 'Active'),
(101, 8, 245, 8015.00, 115, 'Active'),
(102, 8, 218, 2615.00, 165, 'Active'),
(103, 8, 254, 8218.00, 167, 'Active'),
(104, 8, 231, 9263.00, 70, 'Active'),
(105, 8, 203, 6735.00, 130, 'Active'),
(106, 8, 202, 3427.00, 56, 'Active'),
(107, 9, 223, 3181.00, 134, 'Active'),
(108, 9, 228, 2923.00, 88, 'Active'),
(109, 9, 245, 7115.00, 109, 'Active'),
(110, 9, 221, 3889.00, 129, 'Active'),
(111, 9, 204, 6491.00, 124, 'Active'),
(112, 9, 251, 4194.00, 64, 'Active'),
(113, 9, 248, 2783.00, 115, 'Active'),
(114, 9, 239, 5102.00, 93, 'Active'),
(115, 9, 254, 2364.00, 126, 'Active'),
(116, 9, 234, 4591.00, 193, 'Active'),
(117, 9, 247, 1759.00, 107, 'Active'),
(118, 9, 217, 2064.00, 131, 'Active'),
(119, 9, 229, 1515.00, 71, 'Active'),
(120, 9, 255, 7458.00, 135, 'Active'),
(121, 9, 240, 8620.00, 165, 'Active'),
(122, 10, 223, 9193.15, 176, 'Active'),
(123, 10, 228, 1862.95, 182, 'Active'),
(124, 10, 245, 4478.30, 122, 'Active'),
(125, 10, 221, 2451.00, 76, 'Active'),
(126, 10, 204, 5080.60, 107, 'Active'),
(127, 10, 251, 8161.45, 186, 'Active'),
(128, 10, 248, 5116.70, 176, 'Active'),
(129, 10, 239, 6665.20, 144, 'Active'),
(130, 10, 254, 1007.95, 101, 'Active'),
(131, 10, 234, 8630.75, 178, 'Active'),
(132, 10, 247, 3155.90, 149, 'Active'),
(133, 10, 217, 6195.90, 175, 'Active'),
(134, 10, 229, 8799.85, 66, 'Active'),
(135, 10, 255, 5480.55, 72, 'Active'),
(136, 10, 240, 5787.40, 189, 'Active'),
(137, 11, 223, 1657.80, 84, 'Active'),
(138, 11, 228, 2173.50, 152, 'Active'),
(139, 11, 245, 1402.20, 102, 'Active'),
(140, 11, 221, 1782.90, 70, 'Active'),
(141, 11, 204, 2998.80, 123, 'Active'),
(142, 11, 251, 6828.30, 56, 'Active'),
(143, 11, 248, 4029.30, 82, 'Active'),
(144, 11, 239, 1904.40, 197, 'Active'),
(145, 11, 254, 3385.80, 185, 'Active'),
(146, 11, 234, 6671.70, 86, 'Active'),
(147, 11, 247, 1987.20, 141, 'Active'),
(148, 11, 217, 4316.40, 70, 'Active'),
(149, 11, 229, 2772.90, 117, 'Active'),
(150, 11, 255, 966.60, 71, 'Active'),
(151, 11, 240, 5165.10, 100, 'Active'),
(152, 12, 223, 9418.00, 100, 'Active'),
(153, 12, 228, 3996.00, 165, 'Active'),
(154, 12, 245, 1640.00, 86, 'Active'),
(155, 12, 221, 3587.00, 183, 'Active'),
(156, 12, 204, 7832.00, 55, 'Active'),
(157, 12, 251, 4216.00, 147, 'Active'),
(158, 12, 248, 2935.00, 165, 'Active'),
(159, 12, 239, 4891.00, 101, 'Active'),
(160, 12, 254, 1672.00, 199, 'Active'),
(161, 12, 234, 2148.00, 149, 'Active'),
(162, 12, 247, 8723.00, 110, 'Active'),
(163, 12, 217, 7141.00, 106, 'Active'),
(164, 12, 229, 2071.00, 199, 'Active'),
(165, 12, 255, 9666.00, 179, 'Active'),
(166, 12, 240, 4729.00, 113, 'Active'),
(167, 13, 223, 6548.00, 90, 'Active'),
(168, 13, 228, 2314.00, 173, 'Active'),
(169, 13, 245, 7335.00, 105, 'Active'),
(170, 13, 221, 8522.00, 166, 'Active'),
(171, 13, 204, 1420.00, 100, 'Active'),
(172, 13, 251, 9664.00, 67, 'Active'),
(173, 13, 248, 3212.00, 84, 'Active'),
(174, 13, 239, 4828.00, 195, 'Active'),
(175, 13, 254, 4737.00, 174, 'Active'),
(176, 13, 234, 3645.00, 94, 'Active'),
(177, 13, 247, 7729.00, 92, 'Active'),
(178, 13, 217, 5663.00, 185, 'Active'),
(179, 13, 229, 9080.00, 98, 'Active'),
(180, 13, 255, 3664.00, 52, 'Active'),
(181, 13, 240, 5222.00, 199, 'Active'),
(182, 14, 209, 2302.00, 124, 'Active'),
(183, 14, 243, 3882.00, 151, 'Active'),
(184, 14, 204, 5612.00, 150, 'Active'),
(185, 14, 210, 2763.00, 124, 'Active'),
(186, 14, 246, 5613.00, 148, 'Active'),
(187, 14, 217, 2095.00, 119, 'Active'),
(188, 14, 222, 6942.00, 160, 'Active'),
(189, 14, 219, 6640.00, 187, 'Active'),
(190, 14, 235, 5920.00, 170, 'Active'),
(191, 14, 227, 6990.00, 52, 'Active'),
(192, 14, 215, 3347.00, 154, 'Active'),
(193, 14, 208, 2781.00, 165, 'Active'),
(194, 14, 226, 8036.00, 97, 'Active'),
(195, 14, 233, 7739.00, 91, 'Active'),
(196, 14, 202, 6635.00, 102, 'Active'),
(197, 15, 209, 3626.15, 129, 'Active'),
(198, 15, 243, 7317.85, 151, 'Active'),
(199, 15, 204, 2546.00, 79, 'Active'),
(200, 15, 210, 2831.95, 157, 'Active'),
(201, 15, 246, 7397.65, 158, 'Active'),
(202, 15, 217, 2493.75, 95, 'Active'),
(203, 15, 222, 9115.25, 114, 'Active'),
(204, 15, 219, 6654.75, 167, 'Active'),
(205, 15, 235, 6419.15, 57, 'Active'),
(206, 15, 227, 4388.05, 167, 'Active'),
(207, 15, 215, 6378.30, 159, 'Active'),
(208, 15, 208, 4063.15, 57, 'Active'),
(209, 15, 226, 7304.55, 143, 'Active'),
(210, 15, 233, 4168.60, 52, 'Active'),
(211, 15, 202, 4196.15, 82, 'Active'),
(212, 16, 209, 2055.60, 115, 'Active'),
(213, 16, 243, 7922.70, 155, 'Active'),
(214, 16, 204, 5770.80, 177, 'Active'),
(215, 16, 210, 4758.30, 141, 'Active'),
(216, 16, 246, 3623.40, 146, 'Active'),
(217, 16, 217, 5711.40, 172, 'Active'),
(218, 16, 222, 4077.00, 91, 'Active'),
(219, 16, 219, 7272.90, 156, 'Active'),
(220, 16, 235, 4177.80, 145, 'Active'),
(221, 16, 227, 2129.40, 181, 'Active'),
(222, 16, 215, 3764.70, 163, 'Active'),
(223, 16, 208, 6139.80, 50, 'Active'),
(224, 16, 226, 7259.40, 101, 'Active'),
(225, 16, 233, 5892.30, 132, 'Active'),
(226, 16, 202, 5316.30, 164, 'Active'),
(227, 17, 209, 9725.00, 169, 'Active'),
(228, 17, 243, 6085.00, 77, 'Active'),
(229, 17, 204, 3699.00, 50, 'Active'),
(230, 17, 210, 6296.00, 91, 'Active'),
(231, 17, 246, 5608.00, 92, 'Active'),
(232, 17, 217, 6292.00, 62, 'Active'),
(233, 17, 222, 7525.00, 143, 'Active'),
(234, 17, 219, 2770.00, 165, 'Active'),
(235, 17, 235, 3752.00, 177, 'Active'),
(236, 17, 227, 5847.00, 196, 'Active'),
(237, 17, 215, 9439.00, 85, 'Active'),
(238, 17, 208, 2762.00, 80, 'Active'),
(239, 17, 226, 7791.00, 72, 'Active'),
(240, 17, 233, 8643.00, 147, 'Active'),
(241, 17, 202, 2174.00, 67, 'Active'),
(242, 18, 238, 1189.00, 125, 'Active'),
(243, 18, 237, 3498.00, 171, 'Active'),
(244, 18, 208, 2766.00, 107, 'Active'),
(245, 18, 242, 9135.00, 89, 'Active'),
(246, 18, 250, 9650.00, 147, 'Active'),
(247, 18, 254, 1613.00, 104, 'Active'),
(248, 18, 222, 7043.00, 85, 'Active'),
(249, 18, 223, 6763.00, 193, 'Active'),
(250, 18, 228, 4411.00, 149, 'Active'),
(251, 18, 251, 9975.00, 83, 'Active'),
(252, 18, 229, 6073.00, 51, 'Active'),
(253, 18, 230, 2644.00, 181, 'Active'),
(254, 18, 235, 1244.00, 158, 'Active'),
(255, 18, 202, 3866.00, 187, 'Active'),
(256, 18, 212, 1535.00, 164, 'Active'),
(257, 19, 238, 4788.00, 117, 'Active'),
(258, 19, 237, 4242.70, 170, 'Active'),
(259, 19, 208, 8406.55, 147, 'Active'),
(260, 19, 242, 7246.60, 88, 'Active'),
(261, 19, 250, 2494.70, 154, 'Active'),
(262, 19, 254, 8730.50, 85, 'Active'),
(263, 19, 222, 6498.00, 136, 'Active'),
(264, 19, 223, 4501.10, 132, 'Active'),
(265, 19, 228, 8548.10, 152, 'Active'),
(266, 19, 251, 7428.05, 83, 'Active'),
(267, 19, 229, 5291.50, 185, 'Active'),
(268, 19, 230, 8794.15, 89, 'Active'),
(269, 19, 235, 5884.30, 121, 'Active'),
(270, 19, 202, 3379.15, 150, 'Active'),
(271, 19, 212, 8694.40, 191, 'Active'),
(272, 20, 238, 5420.70, 181, 'Active'),
(273, 20, 237, 5336.10, 108, 'Active'),
(274, 20, 208, 7218.90, 69, 'Active'),
(275, 20, 242, 7704.00, 53, 'Active'),
(276, 20, 250, 3408.30, 68, 'Active'),
(277, 20, 254, 1901.70, 99, 'Active'),
(278, 20, 222, 3860.10, 96, 'Active'),
(279, 20, 223, 6631.20, 189, 'Active'),
(280, 20, 228, 1133.10, 155, 'Active'),
(281, 20, 251, 2204.10, 197, 'Active'),
(282, 20, 229, 5259.60, 84, 'Active'),
(283, 20, 230, 4674.60, 168, 'Active'),
(284, 20, 235, 1630.80, 63, 'Active'),
(285, 20, 202, 4885.20, 106, 'Active'),
(286, 20, 212, 3985.20, 198, 'Active'),
(287, 21, 238, 8099.00, 60, 'Active'),
(288, 21, 237, 5338.00, 155, 'Active'),
(289, 21, 208, 5404.00, 190, 'Active'),
(290, 21, 242, 6296.00, 168, 'Active'),
(291, 21, 250, 6061.00, 91, 'Active'),
(292, 21, 254, 5491.00, 182, 'Active'),
(293, 21, 222, 3813.00, 114, 'Active'),
(294, 21, 223, 9788.00, 114, 'Active'),
(295, 21, 228, 4904.00, 148, 'Active'),
(296, 21, 251, 7280.00, 115, 'Active'),
(297, 21, 229, 3628.00, 89, 'Active'),
(298, 21, 230, 1239.00, 80, 'Active'),
(299, 21, 235, 2434.00, 62, 'Active'),
(300, 21, 202, 9903.00, 84, 'Active'),
(301, 21, 212, 4916.00, 130, 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `xpd_shipping`
--

CREATE TABLE `xpd_shipping` (
  `id` int(10) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED DEFAULT NULL,
  `request_details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`request_details`)),
  `fee` decimal(15,2) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Requested',
  `time_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `zbd_assignments`
--

CREATE TABLE `zbd_assignments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `zbdp_id` int(10) UNSIGNED DEFAULT NULL,
  `destination_area_id` int(10) UNSIGNED NOT NULL,
  `base_product_id` bigint(20) UNSIGNED NOT NULL,
  `total_quantity` int(11) NOT NULL,
  `transport_price` decimal(15,2) DEFAULT NULL,
  `progress_status` enum('unassigned','pending','accepted','rejected','withdrawn','loaded','dispatch_ready','dispatch_risk','bad_dispatch','confirmed','completed','cancelled') DEFAULT 'unassigned',
  `time_assigned` datetime DEFAULT NULL,
  `time_accepted` datetime DEFAULT NULL,
  `time_loaded` datetime DEFAULT NULL,
  `time_completed` datetime DEFAULT NULL,
  `session_id` bigint(20) UNSIGNED DEFAULT NULL,
  `order_id` bigint(20) UNSIGNED DEFAULT NULL,
  `remittance_status` enum('Pending','Cancelled','Paid','Acknowledged') DEFAULT 'Pending',
  `admin_notes` text DEFAULT NULL,
  `whm_notes` text DEFAULT NULL,
  `zbdp_notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `zbd_assignments`
--

INSERT INTO `zbd_assignments` (`id`, `zbdp_id`, `destination_area_id`, `base_product_id`, `total_quantity`, `transport_price`, `progress_status`, `time_assigned`, `time_accepted`, `time_loaded`, `time_completed`, `session_id`, `order_id`, `remittance_status`, `admin_notes`, `whm_notes`, `zbdp_notes`) VALUES
(8001, 201, 1, 10, 20, 10000.00, 'accepted', NULL, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, NULL, 'Good to go.'),
(8002, 202, 2, 20, 15, 8250.00, 'accepted', NULL, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, NULL, NULL),
(8003, 201, 1, 10, 12, 6000.00, 'loaded', NULL, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, NULL, NULL),
(8004, 202, 2, 20, 10, 5500.00, 'dispatch_ready', NULL, NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, NULL, NULL),
(8005, 201, 2, 1, 100, 50000.00, 'pending', '2026-02-27 00:14:40', NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, NULL, NULL),
(8006, 201, 3, 2, 50, 30000.00, 'accepted', '2026-02-27 14:14:40', NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, NULL, NULL),
(8007, 201, 1, 3, 150, 60000.00, 'loaded', '2026-02-27 19:14:40', NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, NULL, NULL),
(8008, 201, 2, 4, 80, 45000.00, 'dispatch_ready', '2026-02-27 22:14:40', NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, NULL, NULL),
(8009, 201, 3, 1, 200, 80000.00, 'confirmed', '2026-02-27 23:14:40', NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, NULL, NULL),
(8010, 201, 2, 1, 100, 50000.00, 'pending', '2026-02-27 00:16:09', NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, NULL, NULL),
(8011, 201, 3, 2, 50, 30000.00, 'accepted', '2026-02-27 14:16:09', NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, NULL, NULL),
(8012, 201, 1, 3, 150, 60000.00, 'loaded', '2026-02-27 19:16:09', NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, NULL, NULL),
(8013, 201, 2, 4, 80, 45000.00, 'dispatch_ready', '2026-02-27 22:16:09', NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, NULL, NULL),
(8014, 201, 3, 1, 200, 80000.00, 'confirmed', '2026-02-27 23:16:09', NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, NULL, NULL),
(8015, 201, 2, 1, 100, 50000.00, 'pending', '2026-02-27 00:32:43', NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, NULL, NULL),
(8016, 201, 3, 2, 50, 30000.00, 'accepted', '2026-02-27 14:32:43', NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, NULL, NULL),
(8017, 201, 1, 3, 150, 60000.00, 'loaded', '2026-02-27 19:32:43', NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, NULL, NULL),
(8018, 201, 2, 4, 80, 45000.00, 'dispatch_ready', '2026-02-27 22:32:43', NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, NULL, NULL),
(8019, 201, 3, 1, 200, 80000.00, 'confirmed', '2026-02-27 23:32:43', NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `auction_sessions`
--
ALTER TABLE `auction_sessions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bank_reports`
--
ALTER TABLE `bank_reports`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `bank_ref` (`bank_ref`);

--
-- Indexes for table `base_products`
--
ALTER TABLE `base_products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `commissions`
--
ALTER TABLE `commissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `partner_id` (`partner_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `coverage_areas`
--
ALTER TABLE `coverage_areas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phone_number` (`phone_number`),
  ADD KEY `idx_phone` (`phone_number`),
  ADD KEY `idx_ref` (`associated_ref_code`);

--
-- Indexes for table `delivery_routes`
--
ALTER TABLE `delivery_routes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `global_settings`
--
ALTER TABLE `global_settings`
  ADD PRIMARY KEY (`setting_key`);

--
-- Indexes for table `hvp_shipping`
--
ALTER TABLE `hvp_shipping`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `operating_areas`
--
ALTER TABLE `operating_areas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `area_name` (`area_name`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `show_product_id` (`show_product_id`);

--
-- Indexes for table `partners`
--
ALTER TABLE `partners`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phone_number` (`phone_number`),
  ADD KEY `idx_approval` (`approval_status`),
  ADD KEY `idx_type` (`partner_type`);

--
-- Indexes for table `partner_remittances`
--
ALTER TABLE `partner_remittances`
  ADD PRIMARY KEY (`id`),
  ADD KEY `partner_id` (`partner_id`);

--
-- Indexes for table `partner_wallets`
--
ALTER TABLE `partner_wallets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `partner_id` (`partner_id`);

--
-- Indexes for table `payment_reports`
--
ALTER TABLE `payment_reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `request_id` (`request_id`),
  ADD KEY `idx_ref` (`invoice_refindex`);

--
-- Indexes for table `payment_requests`
--
ALTER TABLE `payment_requests`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `invoice_refindex` (`invoice_refindex`);

--
-- Indexes for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `base_product_id` (`base_product_id`);

--
-- Indexes for table `queries`
--
ALTER TABLE `queries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `query_audit_log`
--
ALTER TABLE `query_audit_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_query` (`query_id`);

--
-- Indexes for table `query_notifications`
--
ALTER TABLE `query_notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_recipient` (`recipient_id`,`is_read`);

--
-- Indexes for table `query_responses`
--
ALTER TABLE `query_responses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_query` (`query_id`);

--
-- Indexes for table `query_response_notes`
--
ALTER TABLE `query_response_notes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_response` (`response_id`);

--
-- Indexes for table `readiness_check_logs`
--
ALTER TABLE `readiness_check_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `session_id` (`session_id`);

--
-- Indexes for table `sba_acquisitions`
--
ALTER TABLE `sba_acquisitions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sba_id` (`sba_id`),
  ADD KEY `order_item_id` (`order_item_id`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`setting_key`);

--
-- Indexes for table `shipping`
--
ALTER TABLE `shipping`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `zbdp_id` (`zbdp_id`);

--
-- Indexes for table `show_products`
--
ALTER TABLE `show_products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `variant_id` (`variant_id`),
  ADD KEY `idx_session` (`session_id`);

--
-- Indexes for table `staff_users`
--
ALTER TABLE `staff_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phone_number` (`phone_number`);

--
-- Indexes for table `system_banks`
--
ALTER TABLE `system_banks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `system_google_accounts`
--
ALTER TABLE `system_google_accounts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `transport_benchmark_cost`
--
ALTER TABLE `transport_benchmark_cost`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `wallets`
--
ALTER TABLE `wallets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `warehouse_zones`
--
ALTER TABLE `warehouse_zones`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `zone_name` (`zone_name`);

--
-- Indexes for table `waves`
--
ALTER TABLE `waves`
  ADD PRIMARY KEY (`id`),
  ADD KEY `session_id` (`session_id`);

--
-- Indexes for table `wave_items`
--
ALTER TABLE `wave_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `wave_id` (`wave_id`),
  ADD KEY `variant_id` (`variant_id`);

--
-- Indexes for table `xpd_shipping`
--
ALTER TABLE `xpd_shipping`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `zbd_assignments`
--
ALTER TABLE `zbd_assignments`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `auction_sessions`
--
ALTER TABLE `auction_sessions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `bank_reports`
--
ALTER TABLE `bank_reports`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `base_products`
--
ALTER TABLE `base_products`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `commissions`
--
ALTER TABLE `commissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `coverage_areas`
--
ALTER TABLE `coverage_areas`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `delivery_routes`
--
ALTER TABLE `delivery_routes`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `hvp_shipping`
--
ALTER TABLE `hvp_shipping`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `operating_areas`
--
ALTER TABLE `operating_areas`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5003;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6004;

--
-- AUTO_INCREMENT for table `partners`
--
ALTER TABLE `partners`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=203;

--
-- AUTO_INCREMENT for table `partner_remittances`
--
ALTER TABLE `partner_remittances`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9012;

--
-- AUTO_INCREMENT for table `partner_wallets`
--
ALTER TABLE `partner_wallets`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment_reports`
--
ALTER TABLE `payment_reports`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `payment_requests`
--
ALTER TABLE `payment_requests`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `product_variants`
--
ALTER TABLE `product_variants`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=256;

--
-- AUTO_INCREMENT for table `queries`
--
ALTER TABLE `queries`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `query_audit_log`
--
ALTER TABLE `query_audit_log`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `query_notifications`
--
ALTER TABLE `query_notifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `query_responses`
--
ALTER TABLE `query_responses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `query_response_notes`
--
ALTER TABLE `query_response_notes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `readiness_check_logs`
--
ALTER TABLE `readiness_check_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `sba_acquisitions`
--
ALTER TABLE `sba_acquisitions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `shipping`
--
ALTER TABLE `shipping`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `show_products`
--
ALTER TABLE `show_products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2076;

--
-- AUTO_INCREMENT for table `staff_users`
--
ALTER TABLE `staff_users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;

--
-- AUTO_INCREMENT for table `system_banks`
--
ALTER TABLE `system_banks`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `system_google_accounts`
--
ALTER TABLE `system_google_accounts`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `transport_benchmark_cost`
--
ALTER TABLE `transport_benchmark_cost`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `wallets`
--
ALTER TABLE `wallets`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `warehouse_zones`
--
ALTER TABLE `warehouse_zones`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `waves`
--
ALTER TABLE `waves`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `wave_items`
--
ALTER TABLE `wave_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=302;

--
-- AUTO_INCREMENT for table `xpd_shipping`
--
ALTER TABLE `xpd_shipping`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `zbd_assignments`
--
ALTER TABLE `zbd_assignments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8020;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `commissions`
--
ALTER TABLE `commissions`
  ADD CONSTRAINT `commissions_ibfk_1` FOREIGN KEY (`partner_id`) REFERENCES `partners` (`id`),
  ADD CONSTRAINT `commissions_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `customers` (`id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`show_product_id`) REFERENCES `show_products` (`id`);

--
-- Constraints for table `partner_remittances`
--
ALTER TABLE `partner_remittances`
  ADD CONSTRAINT `partner_remittances_ibfk_1` FOREIGN KEY (`partner_id`) REFERENCES `partners` (`id`);

--
-- Constraints for table `partner_wallets`
--
ALTER TABLE `partner_wallets`
  ADD CONSTRAINT `partner_wallets_ibfk_1` FOREIGN KEY (`partner_id`) REFERENCES `partners` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payment_reports`
--
ALTER TABLE `payment_reports`
  ADD CONSTRAINT `payment_reports_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `payment_requests` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`base_product_id`) REFERENCES `base_products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `readiness_check_logs`
--
ALTER TABLE `readiness_check_logs`
  ADD CONSTRAINT `readiness_check_logs_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `auction_sessions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sba_acquisitions`
--
ALTER TABLE `sba_acquisitions`
  ADD CONSTRAINT `sba_acquisitions_ibfk_1` FOREIGN KEY (`sba_id`) REFERENCES `partners` (`id`),
  ADD CONSTRAINT `sba_acquisitions_ibfk_2` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`id`);

--
-- Constraints for table `shipping`
--
ALTER TABLE `shipping`
  ADD CONSTRAINT `shipping_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `shipping_ibfk_2` FOREIGN KEY (`zbdp_id`) REFERENCES `partners` (`id`);

--
-- Constraints for table `show_products`
--
ALTER TABLE `show_products`
  ADD CONSTRAINT `show_products_ibfk_1` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`);

--
-- Constraints for table `wallets`
--
ALTER TABLE `wallets`
  ADD CONSTRAINT `wallets_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `waves`
--
ALTER TABLE `waves`
  ADD CONSTRAINT `waves_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `auction_sessions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `wave_items`
--
ALTER TABLE `wave_items`
  ADD CONSTRAINT `wave_items_ibfk_1` FOREIGN KEY (`wave_id`) REFERENCES `waves` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `wave_items_ibfk_2` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
