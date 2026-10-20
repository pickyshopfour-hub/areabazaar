<?php
/**
 * Phase 1 — DB Migration: Queries & Flags System Tables
 * Run once: http://localhost/areabazaar/public/migrate_phase1_queries.php
 */
require_once '../core/includes/database.php';
$db = (new Database())->getConnection();

$steps = [];

// 1. ALTER queries table — add new columns (skip if already exist)
$steps[] = ["ALTER queries - priority", "ALTER TABLE `queries`
    ADD COLUMN IF NOT EXISTS `priority`      ENUM('Low','Normal','High','Critical') DEFAULT 'Normal',
    ADD COLUMN IF NOT EXISTS `assigned_to`   INT UNSIGNED,
    ADD COLUMN IF NOT EXISTS `assigned_role` VARCHAR(50),
    ADD COLUMN IF NOT EXISTS `closed_by`     INT UNSIGNED,
    ADD COLUMN IF NOT EXISTS `close_reason`  TEXT,
    ADD COLUMN IF NOT EXISTS `last_activity` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS `created_at`    TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
];

// Alter status column separately (it may already exist but with wrong enum)
$steps[] = ["ALTER queries - status ENUM", "ALTER TABLE `queries`
    MODIFY COLUMN `status` ENUM('Open','Closed','Archived') DEFAULT 'Open'"
];

// 2. CREATE query_responses
$steps[] = ["CREATE query_responses", "CREATE TABLE IF NOT EXISTS `query_responses` (
    `id`             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `query_id`       BIGINT UNSIGNED NOT NULL,
    `responder_id`   INT UNSIGNED NOT NULL,
    `responder_role` VARCHAR(50) NOT NULL,
    `message`        TEXT NOT NULL,
    `forwarded_to`   INT UNSIGNED,
    `forwarded_role` VARCHAR(50),
    `created_at`     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_query (`query_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
];

// 3. CREATE query_response_notes
$steps[] = ["CREATE query_response_notes", "CREATE TABLE IF NOT EXISTS `query_response_notes` (
    `id`          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `response_id` BIGINT UNSIGNED NOT NULL,
    `author_id`   INT UNSIGNED NOT NULL,
    `author_role` VARCHAR(50) NOT NULL,
    `note`        TEXT NOT NULL,
    `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_response (`response_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
];

// 4. CREATE query_notifications
$steps[] = ["CREATE query_notifications", "CREATE TABLE IF NOT EXISTS `query_notifications` (
    `id`               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `query_id`         BIGINT UNSIGNED NOT NULL,
    `recipient_id`     INT UNSIGNED NOT NULL,
    `recipient_role`   VARCHAR(50) NOT NULL,
    `type`             ENUM('NewAssignment','NewResponse','PriorityChange','ThreadClosed') NOT NULL,
    `message`          TEXT,
    `is_read`          TINYINT(1) DEFAULT 0,
    `created_at`       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_recipient (`recipient_id`, `is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
];

// 5. CREATE query_audit_log
$steps[] = ["CREATE query_audit_log", "CREATE TABLE IF NOT EXISTS `query_audit_log` (
    `id`         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `query_id`   BIGINT UNSIGNED NOT NULL,
    `actor_id`   INT UNSIGNED NOT NULL,
    `actor_role` VARCHAR(50) NOT NULL,
    `action`     VARCHAR(100) NOT NULL,
    `detail`     TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_query (`query_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
];

echo "<pre>\n";
foreach ($steps as [$label, $sql]) {
    try {
        $db->exec($sql);
        echo "✔ {$label}\n";
    }
    catch (PDOException $e) {
        echo "✖ {$label}: " . $e->getMessage() . "\n";
    }
}
echo "\n<strong>Phase 1 migration complete.</strong>\n</pre>";
?>
