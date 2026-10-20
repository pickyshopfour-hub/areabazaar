<?php
require_once 'core/includes/database.php';
$db = (new Database())->getConnection();

try {
    // Drop existing to recreate clean
    $db->exec("DROP TABLE IF EXISTS coverage_areas");
    $db->exec("DROP TABLE IF EXISTS delivery_routes");

    // Check if tables exist
    $db->exec("CREATE TABLE IF NOT EXISTS coverage_areas (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        area_name VARCHAR(100) NOT NULL,
        parent_zone_id INT UNSIGNED,
        status ENUM('Pending','Active','Suspended') DEFAULT 'Active'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $db->exec("CREATE TABLE IF NOT EXISTS delivery_routes (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        route_name VARCHAR(100) NOT NULL,
        area_id INT UNSIGNED,
        status ENUM('Pending','Active','Suspended') DEFAULT 'Active'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // 1. Coverage Areas & Routes
    $db->exec("INSERT INTO coverage_areas (id, area_name, parent_zone_id, status) VALUES 
        (1, 'Garki Area 1', 1, 'Active'),
        (2, 'Wuse Zone 2', 1, 'Active')
    ");

    $db->exec("INSERT INTO delivery_routes (id, route_name, area_id, status) VALUES 
        (1, 'Garki-Main-Route', 1, 'Active'),
        (2, 'Wuse-Express', 2, 'Active')
    ");

    // 2. Partners (SBAs and ZBDps)
    $db->exec("INSERT IGNORE INTO partners (id, name, phone_number, password_hash, partner_type, business_name, approval_status, status) VALUES 
        (101, 'John SBA', '08011111111', 'hash', 'SBA', 'John Supplies Ltd', 'Approved', 'Active'),
        (102, 'Mary SBA', '08022222222', 'hash', 'SBA', 'Mary Agro', 'Approved', 'Active'),
        (201, 'Driver Dan', '08033333333', 'hash', 'ZBDp', 'Dan Logistics', 'Approved', 'Active'),
        (202, 'Pilot Pete', '08044444444', 'hash', 'ZBDp', 'Pete Transport', 'Approved', 'Active')
    ");

    // 3. Products hierarchy
    $db->exec("INSERT IGNORE INTO base_products (id, product_name, bulk_purchase_price) VALUES 
        (10, 'Premium Rice 50kg', 45000.00),
        (20, 'Vegetable Oil 25L', 32000.00)
    ");

    $db->exec("INSERT IGNORE INTO product_variants (id, base_product_id, variant_name) VALUES 
        (100, 10, 'Rice variant 1'),
        (200, 20, 'Oil variant 1')
    ");

    $db->exec("INSERT IGNORE INTO show_products (id, session_id, variant_id) VALUES 
        (1000, 'sess-01', 100),
        (2000, 'sess-01', 200)
    ");

    // 4. Transport Benchmark Cost
    $db->exec("INSERT IGNORE INTO transport_benchmark_cost (base_product_id, route_id, price_per_unit) VALUES 
        (10, 1, 500.00),
        (20, 1, 400.00),
        (10, 2, 600.00),
        (20, 2, 550.00)
    ");

    // 5. Orders and Items (for pending groupings)
    $db->exec("INSERT IGNORE INTO customers (id, name, phone_number, password_hash) VALUES (1, 'Test Cust', '0901', 'hash')");
    $db->exec("INSERT IGNORE INTO orders (id, user_id, total_amount, shipping_address_id, status) VALUES 
        (5001, 1, 100000.00, 1, 'Paid'),
        (5002, 1, 150000.00, 2, 'Paid')
    ");
    $db->exec("INSERT IGNORE INTO order_items (id, order_id, show_product_id, quantity, price_at_purchase, treatment_status) VALUES 
        (6001, 5001, 1000, 2, 48000.00, 'Pending'),
        (6002, 5001, 2000, 1, 35000.00, 'Pending'),
        (6003, 5002, 1000, 5, 48000.00, 'Pending')
    ");

    $db->exec("UPDATE sba_acquisitions SET base_product_id = 10 WHERE id=7001");

    // 6. SBA Acquisitions (various states)
    $db->exec("INSERT IGNORE INTO sba_acquisitions (id, sba_id, base_product_id, order_item_id, total_qty, unit_cost, assign_status, supply_status) VALUES 
        (7001, 101, 10, 0, 10, 45000.00, 'pending', 'pending'),
        (7002, 102, 20, 0, 15, 32000.00, 'approved', 'pending'),
        (7003, 101, 10, 0, 5,  45000.00, 'approved', 'supplied'),
        (7004, 102, 20, 0, 8,  32000.00, 'approved', 'QApassed')
    ");

    // 7. ZBD Assignments (various states)
    $db->exec("INSERT IGNORE INTO zbd_assignments (id, zbdp_id, destination_area_id, base_product_id, total_quantity, transport_price, progress_status) VALUES 
        (8001, 201, 1, 10, 20, 10000.00, 'pending'),
        (8002, 202, 2, 20, 15, 8250.00, 'accepted'),
        (8003, 201, 1, 10, 12, 6000.00, 'loaded'),
        (8004, 202, 2, 20, 10, 5500.00, 'dispatch_ready')
    ");

    // 8. Remittances (queued, approved, Sent, Acknowledge)
    $db->exec("INSERT IGNORE INTO partner_remittances (id, partner_id, amount, status) VALUES 
        (9001, 101, 450000.00, 'queued'),
        (9002, 102, 256000.00, 'queued'),
        (9003, 201, 15000.00, 'approved'),
        (9004, 202, 8500.00, 'Sent')
    ");

    echo "Fully seeded Chunk 9 sample data.\n";
}
catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
