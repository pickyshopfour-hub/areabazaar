<?php
$db = new mysqli('localhost', 'root', '', 'areabazaar');
if ($db->connect_error)
    die("DB Connection Failed");

$res = $db->query("ALTER TABLE waves MODIFY COLUMN status ENUM('Pending', 'Active', 'Replaced', 'Cancelled', 'Removed') DEFAULT 'Pending'");
if ($res) {
    echo "Status ENUM altered successfully to include 'Removed'.\n";
}
else {
    echo "Error: " . $db->error . "\n";
}
?>
