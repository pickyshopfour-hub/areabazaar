<?php
require 'core/helpers/functions.php';
$db = getConn();
try {
    $db->exec("ALTER TABLE base_products ADD COLUMN admin_approval ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending'");
    $db->exec("UPDATE base_products SET admin_approval = 'Approved'");
    $db->exec("ALTER TABLE product_variants ADD COLUMN admin_approval ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending'");
    $db->exec("UPDATE product_variants SET admin_approval = 'Approved'");
    echo 'Schema updated successfully.';
}
catch (Exception $e) {
    echo 'Error: ' . $e->getMessage();
}
