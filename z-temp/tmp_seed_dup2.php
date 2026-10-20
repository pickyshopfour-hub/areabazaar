<?php
require_once 'core/includes/database.php';
$db = (new Database())->getConnection();

try {
    $db->query("ALTER TABLE sba_acquisitions MODIFY sba_id int(10) unsigned NULL");

    // Check if the duplicate exists, if not make one
    $dupCheck = $db->prepare("SELECT id FROM sba_acquisitions WHERE base_product_id = 2 AND assign_status = 'unassigned'");
    $dupCheck->execute();
    if (!$dupCheck->fetch()) {
        $db->query("INSERT INTO sba_acquisitions (base_product_id, sba_id, session_id, total_qty, unit_cost, assign_status, supply_status, time_assigned) VALUES (2, NULL, 'session_222', 500, 5200.00, 'unassigned', 'pending', NOW())");
        echo "Inserted unassigned clone. ";
    }

    echo "DB properly seeded for Unassigned Clone vs Cancelled State display.";
}
catch (Exception $e) {
    echo "Error checking: " . $e->getMessage();
}
