<?php
require_once 'core/includes/database.php';
$db = (new Database())->getConnection();

try {
    $db->exec("ALTER TABLE delivery_routes ADD COLUMN charge_officer_id int(10) unsigned, ADD COLUMN time_created timestamp DEFAULT CURRENT_TIMESTAMP");
    echo "Columns added.";
}
catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
