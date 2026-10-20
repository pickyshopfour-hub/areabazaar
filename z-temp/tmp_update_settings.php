<?php
require_once 'core/includes/database.php';
$db = (new Database())->getConnection();

try {
    $db->exec("CREATE TABLE IF NOT EXISTS global_settings (
        setting_key VARCHAR(50) PRIMARY KEY,
        setting_value VARCHAR(255) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // Insert deposit_auto_limit if not exists, let's say 1,000,000 for senior admin limit
    $stmt = $db->prepare("INSERT IGNORE INTO global_settings (setting_key, setting_value) VALUES ('deposit_auto_limit', '1000000')");
    $stmt->execute();

    // Update enum for payment_reports
    $db->exec("ALTER TABLE payment_reports MODIFY COLUMN status ENUM('Pending', 'AwaitingAdminApproval', 'Matched', 'Flagged', 'unremitted', 'amount-mismatch', 'orphaned', 'verified', 'Resolved') DEFAULT 'Pending'");
    echo "DB Schema Updated.\n";
}
catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
