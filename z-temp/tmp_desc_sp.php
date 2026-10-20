<?php
require_once 'core/includes/database.php';
$db = (new Database())->getConnection();
try {
    $stmt = $db->query("DESCRIBE show_products");
    print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
}
catch (Exception $e) {
    echo $e->getMessage();
}
