<?php
require_once 'core/includes/database.php';
$db = (new Database())->getConnection();

try {
    // 1. Alter partner_remittances status
    $db->exec("ALTER TABLE partner_remittances MODIFY COLUMN status ENUM('queued', 'approved', 'Sent', 'Acknowledge') DEFAULT 'queued'");

    // 2. Adjust sba_acquisitions
    // Drop existing if it's not populated, or just add columns. We'll alter it.
    // The previous schema had remittance_status. We can add assign_status, supply_status, time_assigned, time_approved.
    // Wait, the comment says it groups ordered items by Base Product, so it's a batch order.
    // We add a link to base_product_id instead of order_item_id? Or just keep it generic.
    // Actually, let's add the columns to sba_acquisitions: 
    // assign_status: pending, approved
    // supply_status: pending, supplied, QApassed, completed
    $db->exec("ALTER TABLE sba_acquisitions 
        ADD COLUMN base_product_id BIGINT UNSIGNED AFTER sba_id,
        ADD COLUMN assign_status ENUM('pending', 'approved') DEFAULT 'pending',
        ADD COLUMN supply_status ENUM('pending', 'supplied', 'QApassed', 'completed') DEFAULT 'pending',
        ADD COLUMN time_assigned DATETIME,
        ADD COLUMN time_approved DATETIME
    ");

    // 3. Create transport_benchmark_cost
    $db->exec("CREATE TABLE IF NOT EXISTS transport_benchmark_cost (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        base_product_id BIGINT UNSIGNED NOT NULL,
        route_id INT UNSIGNED NOT NULL,
        price_per_unit DECIMAL(15,2) NOT NULL,
        time_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // 4. Create zbd_assignment
    $db->exec("CREATE TABLE IF NOT EXISTS zbd_assignments (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        zbdp_id INT UNSIGNED,
        destination_area_id INT UNSIGNED NOT NULL,
        base_product_id BIGINT UNSIGNED NOT NULL,
        total_quantity INT NOT NULL,
        transport_price DECIMAL(15,2),
        progress_status ENUM('pending', 'accepted', 'loaded', 'dispatch_ready', 'confirmed', 'completed') DEFAULT 'pending',
        time_assigned DATETIME,
        time_accepted DATETIME,
        time_loaded DATETIME,
        time_completed DATETIME
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    echo "DB schema updated for Chunk 9.\n";
}
catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
