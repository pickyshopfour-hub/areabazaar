<?php
require_once 'core/includes/database.php';
$db = (new Database())->getConnection();

// Seed SBA Acquisition to test Admin Reject
try {
    // Insert a pending SBA acquisition
    $stmt = $db->prepare("INSERT INTO sba_acquisitions (base_product_id, sba_id, total_qty, unit_cost, assign_status, supply_status, time_assigned) 
        VALUES (1, 101, 50, 4500.00, 'pending', 'pending', NOW())");
    $stmt->execute();

    // Insert a hanging SBA acquisition (QA failed/risk)
    $stmt = $db->prepare("INSERT INTO sba_acquisitions (base_product_id, sba_id, total_qty, unit_cost, assign_status, supply_status, time_assigned) 
        VALUES (2, 101, 20, 15000.00, 'hanging', 'QArisk', NOW())");
    $stmt->execute();

    // Also Insert a completed supply awaiting remittance
    $stmt = $db->prepare("INSERT INTO sba_acquisitions (base_product_id, sba_id, total_qty, unit_cost, assign_status, supply_status, time_assigned) 
        VALUES (3, 101, 150, 2000.00, 'approved', 'completed', DATE_SUB(NOW(), INTERVAL 1 DAY))");
    $stmt->execute();

    // Add to partner_remittances directly for that completed one
    $stmt = $db->prepare("INSERT INTO partner_remittances (partner_id, amount, status, time_sent) VALUES (101, 300000.00, 'queued', NOW())");
    $stmt->execute();

    echo "Seed data inserted successfully for reliable testing.";
}
catch (Exception $e) {
    echo "Error inserting seed data: " . $e->getMessage();
}
