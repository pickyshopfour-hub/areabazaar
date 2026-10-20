<?php
require_once 'core/includes/database.php';
$db = (new Database())->getConnection();

try {
    // get a valid order item ID
    $stmt = $db->query("SELECT id FROM order_items LIMIT 1");
    $valid_id = $stmt->fetchColumn();

    // 1. More SBA Assignments in various states
    $stmt = $db->prepare("INSERT INTO sba_acquisitions (sba_id, base_product_id, order_item_id, total_qty, unit_cost, assign_status, supply_status, time_assigned) VALUES (?, ?, ?, ?, ?, ?, ?, NOW() - INTERVAL ? HOUR)");

    // Pending approval
    $stmt->execute([101, 1, $valid_id, 1500, 48000, 'pending', 'pending', 12]);
    $stmt->execute([101, 2, $valid_id, 500, 5200, 'pending', 'pending', 6]);

    // Supplied (needs QA)
    $stmt->execute([101, 1, $valid_id, 200, 48000, 'approved', 'supplied', 2]);

    // QApassed
    $stmt->execute([101, 2, $valid_id, 800, 5200, 'approved', 'QApassed', 1]);

    // Completed
    $stmt->execute([101, 3, $valid_id, 100, 6500, 'approved', 'completed', 48]);


    // 2. More ZBDp Assignments in various states
    $stmt = $db->prepare("INSERT INTO zbd_assignments (zbdp_id, destination_area_id, base_product_id, total_quantity, transport_price, progress_status, time_assigned) VALUES (?, ?, ?, ?, ?, ?, NOW() - INTERVAL ? HOUR)");

    // pending
    $stmt->execute([201, 2, 1, 100, 50000, 'pending', 24]);

    // accepted
    $stmt->execute([201, 3, 2, 50, 30000, 'accepted', 10]);

    // loaded
    $stmt->execute([201, 1, 3, 150, 60000, 'loaded', 5]);

    // dispatch_ready
    $stmt->execute([201, 2, 4, 80, 45000, 'dispatch_ready', 2]);

    // confirmed
    $stmt->execute([201, 3, 1, 200, 80000, 'confirmed', 1]);


    // 3. More Partner Remittances
    $stmt = $db->prepare("INSERT INTO partner_remittances (partner_id, amount, bank_ref, status) VALUES (?, ?, ?, ?)");

    // Sent status (waiting for Ack)
    $stmt->execute([101, 120000, 'PAY-SBA-1', 'Sent']);
    $stmt->execute([201, 85000, 'PAY-ZBD-1', 'Sent']);

    // Acknowledged
    $stmt->execute([101, 450000, 'PAY-SBA-0', 'Acknowledge']);


    // 4. More Transport Benchmarks
    $stmt = $db->prepare("INSERT INTO transport_benchmark_cost (base_product_id, route_id, price_per_unit, is_hidden) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE price_per_unit = VALUES(price_per_unit)");

    $stmt->execute([1, 1, 400, 0]);
    $stmt->execute([1, 2, 600, 0]);
    $stmt->execute([2, 1, 300, 0]);
    $stmt->execute([3, 1, 800, 1]); // Hidden example

    echo "Extra seed data added successfully!";

}
catch (Exception $e) {
    die("Seeding error: " . $e->getMessage());
}
