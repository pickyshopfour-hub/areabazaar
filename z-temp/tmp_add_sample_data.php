<?php
require 'core/helpers/functions.php';
$db = getConn();

try {
    $db->beginTransaction();

    // 1. Insert 3 Customers
    $users = [
        ['name' => 'John Doe', 'phone_number' => '08011111111', 'password_hash' => password_hash('password', PASSWORD_DEFAULT), 'location_area_id' => 1],
        ['name' => 'Jane Smith', 'phone_number' => '08022222222', 'password_hash' => password_hash('password', PASSWORD_DEFAULT), 'location_area_id' => 2],
        ['name' => 'Foodie Ltd', 'phone_number' => '08033333333', 'password_hash' => password_hash('password', PASSWORD_DEFAULT), 'location_area_id' => 1]
    ];
    $userIds = [];
    foreach ($users as $u) {
        $stmt = $db->prepare("INSERT INTO customers (name, phone_number, password_hash, location_area_id) VALUES (?, ?, ?, ?)");
        $stmt->execute([$u['name'], $u['phone_number'], $u['password_hash'], $u['location_area_id']]);
        $userIds[] = $db->lastInsertId();
    }

    // 2. Insert Orders
    $orders = [
        ['user_id' => $userIds[0], 'total_amount' => 15000, 'status' => 'Paid', 'destination_area' => 1],
        ['user_id' => $userIds[1], 'total_amount' => 45000, 'status' => 'Processing', 'destination_area' => 2, 'is_urgent' => 1],
        ['user_id' => $userIds[2], 'total_amount' => 120000, 'status' => 'Shipped', 'destination_area' => 1],
        ['user_id' => $userIds[0], 'total_amount' => 5000, 'status' => 'Delivered', 'destination_area' => 2]
    ];
    $orderIds = [];
    foreach ($orders as $o) {
        $stmt = $db->prepare("INSERT INTO orders (user_id, total_amount, status, destination_area, is_urgent) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$o['user_id'], $o['total_amount'], $o['status'], $o['destination_area'], $o['is_urgent'] ?? 0]);
        $orderIds[] = $db->lastInsertId();
    }

    // 3. Insert Order Items
    $items = [
        ['order_id' => $orderIds[0], 'show_product_id' => 1, 'quantity' => 1, 'price_at_purchase' => 15000, 'treatment_status' => 'Pending', 'whm_status' => 'requested'],
        ['order_id' => $orderIds[1], 'show_product_id' => 1, 'quantity' => 3, 'price_at_purchase' => 15000, 'treatment_status' => 'Packed', 'whm_status' => 'packed'],
        ['order_id' => $orderIds[2], 'show_product_id' => 1, 'quantity' => 8, 'price_at_purchase' => 15000, 'treatment_status' => 'Dispatched', 'whm_status' => 'dispatched'],
        ['order_id' => $orderIds[3], 'show_product_id' => 1, 'quantity' => 1, 'price_at_purchase' => 5000, 'treatment_status' => 'Delivered', 'whm_status' => 'delivered'],
    ];
    foreach ($items as $i) {
        $stmt = $db->prepare("INSERT INTO order_items (order_id, show_product_id, quantity, price_at_purchase, treatment_status, whm_status) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$i['order_id'], $i['show_product_id'], $i['quantity'], $i['price_at_purchase'], $i['treatment_status'], $i['whm_status']]);
    }

    $db->commit();
    echo "Sample data successfully added: 3 Customers, 4 Orders, 4 Order Items.";
}
catch (Exception $e) {
    $db->rollBack();
    echo "Error inserting sample data: " . $e->getMessage();
}
