<?php
require_once 'core/includes/database.php';
$db = (new Database())->getConnection();

$db->exec("SET FOREIGN_KEY_CHECKS = 0;");
$db->exec("TRUNCATE TABLE customers");
$db->exec("SET FOREIGN_KEY_CHECKS = 1;");

echo "Seeding agent customers...\n";

for ($i = 1; $i <= 10; $i++) {
    $name = ['Chinedu Okafor', 'Amina Yusuf', 'Toluwani Ojo', 'Femi Adebayo', 'Nkechi Ekeh', 'Zainab Bello'][array_rand(['Chinedu Okafor', 'Amina Yusuf', 'Toluwani Ojo', 'Femi Adebayo', 'Nkechi Ekeh', 'Zainab Bello'])] . " " . rand(10, 99);
    $phone = "080" . rand(10000000, 99999999);
    $area_id = rand(1, 5);

    $stmt = $db->prepare("INSERT INTO customers (name, phone_number, location_area_id, associated_ref_code) VALUES (?, ?, ?, 'FRM-001')");
    $stmt->execute([$name, $phone, $area_id]);
}

echo "Assigned Customers seeded successfully!\n";
