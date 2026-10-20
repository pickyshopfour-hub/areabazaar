<?php
require_once 'c:/xampp/htdocs/areabazaar/core/includes/database.php';
$db = (new Database())->getConnection();

echo "<pre>";

function runQuery($db, $sql, $params = [])
{
    try {
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        return true;
    }
    catch (Exception $e) {
        echo "Error on query: $sql | " . $e->getMessage() . "\n";
        return false;
    }
}

// 1. Oversight Entities
echo "Seeding Oversight Entities...\n";
for ($i = 1; $i <= 10; $i++) {
    runQuery($db, "INSERT IGNORE INTO warehouse_zones (id, zone_name, region_id, status) VALUES (?, ?, ?, 'Active')", [$i + 10, "Warehouse Alpha $i", 1]);
    runQuery($db, "INSERT IGNORE INTO operating_areas (id, area_name, parent_zone_id, status) VALUES (?, ?, ?, 'Active')", [$i + 10, "Coverage Area $i", ($i % 2) + 11]);
    runQuery($db, "INSERT IGNORE INTO delivery_routes (id, route_name, start_area_id, end_area_id, status) VALUES (?, ?, ?, ?, 'Active')", [$i + 10, "Express Route $i", $i + 10, $i + 10]);
    runQuery($db, "INSERT IGNORE INTO system_banks (id, bank_name, account_number, account_name, status) VALUES (?, ?, ?, ?, 'Active')", [$i + 10, "Operations Bank $i", "20394019$i", "AreaBazaar Ops $i"]);
    runQuery($db, "INSERT IGNORE INTO system_google_accounts (id, email, purpose, status) VALUES (?, ?, 'Sync', 'Active')", [$i + 10, "sync$i@areabazaar.com"]);
}

// 2. Partners
echo "Seeding Partners...\n";
$types = ['SBA', 'ZBDp'];
for ($i = 1; $i <= 10; $i++) {
    $type = $types[$i % 2];
    $status = ($i % 3 == 0) ? 'Pending' : 'Approved';
    runQuery($db, "INSERT IGNORE INTO partners (id, name, phone_number, password_hash, partner_type, business_name, approval_status, status) VALUES (?, ?, ?, 'hash', ?, ?, ?, 'Active')",
    [$i + 20, "Partner $i", "080" . str_repeat($i, 7), $type, "Business $i Ltd", $status]);
}

// 3. Auctions
echo "Seeding Auctions...\n";
for ($i = 1; $i <= 10; $i++) {
    $status = ($i == 1) ? 'Active' : (($i <= 5) ? 'Ready' : 'Draft');
    runQuery($db, "INSERT IGNORE INTO auction_sessions (id, session_name, status, start_time) VALUES (?, ?, ?, ?)",
    [$i + 20, "Flash Sale #$i", $status, date('Y-m-d H:i:s', strtotime("+$i days"))]);
}

// 4. Products & Variants
echo "Seeding Products...\n";
runQuery($db, "INSERT IGNORE INTO base_products (id, product_name, category, added_by) VALUES (1, 'Rice 50kg', 'Food', 103), (2, 'Oil 5L', 'Food', 103)");
runQuery($db, "INSERT IGNORE INTO product_variants (id, base_product_id, variant_name, quantity_value, quantity_unit) VALUES (1, 1, 'Mama Gold 50kg', 50, 'kg'), (2, 2, 'Kings Oil 5L', 5, 'L')");

// 5. Orders & Items
echo "Seeding Orders...\n";
// Need customer with ID 101 or 1
runQuery($db, "INSERT IGNORE INTO customers (id, name, phone_number, password_hash, status) VALUES (1, 'Test Customer', '09012345678', 'hash', 'Active')");

for ($i = 1; $i <= 15; $i++) {
    $status = ['Paid', 'Processing', 'Shipped', 'Delivered'][$i % 4];
    if (runQuery($db, "INSERT IGNORE INTO orders (id, user_id, total_amount, status) VALUES (?, ?, ?, ?)", [$i + 100, 1, rand(5000, 50000), $status])) {
        // Add one item to each order
        runQuery($db, "INSERT IGNORE INTO order_items (order_id, show_product_id, quantity, price_at_purchase, treatment_status) VALUES (?, 1, 1, 15000, 'Pending')", [$i + 100]);
    }
}

// Ensure at least one active session has show products
runQuery($db, "INSERT IGNORE INTO show_products (id, session_id, variant_id, current_price, stock_available, status) VALUES (1, '21', 1, 14500, 100, 'Active')");

echo "Seeding completed successfully.";
echo "</pre>";
?>
