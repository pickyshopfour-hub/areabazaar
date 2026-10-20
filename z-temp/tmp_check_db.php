<?php
require_once 'core/includes/database.php';
$db = (new Database())->getConnection();
$tables = ['warehouse_zones', 'operating_areas', 'delivery_routes', 'system_banks', 'system_google_accounts'];
$result = [];
foreach ($tables as $t) {
    try {
        $stmt = $db->query("DESC $t");
        $result[$t] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    catch (Exception $e) {
        $result[$t] = $e->getMessage();
    }
}
echo json_encode($result, JSON_PRETTY_PRINT);
?>
