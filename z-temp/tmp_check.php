<?php
require_once 'c:/xampp/htdocs/areabazaar/core/includes/database.php';
$db = (new Database())->getConnection();
echo "Zones: " . (new PDO('mysql:host=localhost;dbname=areabazaar', 'root', ''))->query("SELECT count(*) FROM warehouse_zones")->fetchColumn() . "\n";
echo "Sessions: " . (new PDO('mysql:host=localhost;dbname=areabazaar', 'root', ''))->query("SELECT count(*) FROM auction_sessions")->fetchColumn() . "\n";
echo "Staff: " . (new PDO('mysql:host=localhost;dbname=areabazaar', 'root', ''))->query("SELECT count(*) FROM staff_users")->fetchColumn() . "\n";
?>
