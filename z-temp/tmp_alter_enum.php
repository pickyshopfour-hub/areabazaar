<?php
require_once 'core/includes/database.php';
$db = (new Database())->getConnection();

try {
    $db->exec("ALTER TABLE sba_acquisitions MODIFY COLUMN supply_status ENUM('pending', 'acknowledged', 'supplied', 'QApassed', 'completed') DEFAULT 'pending'");
    echo "SBA enum altered.";
}
catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
