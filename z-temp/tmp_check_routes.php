<?php
require_once 'core/includes/database.php';
$db = (new Database())->getConnection();

try {
    $stmt = $db->query("SELECT * FROM delivery_routes LIMIT 1");
    print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
}
catch (Exception $e) {
    echo $e->getMessage();
}
