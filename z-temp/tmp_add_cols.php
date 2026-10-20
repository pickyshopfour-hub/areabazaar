<?php
require 'core/helpers/functions.php';
$db = getConn();
try {
    $db->exec("ALTER TABLE orders ADD COLUMN IF NOT EXISTS whm_notes TEXT");
    echo "Added whm_notes to orders\n";
    $db->exec("ALTER TABLE order_items ADD COLUMN IF NOT EXISTS is_flagged TINYINT(1) DEFAULT 0");
    echo "Added is_flagged to order_items\n";
    $db->exec("ALTER TABLE order_items ADD COLUMN IF NOT EXISTS is_hidden TINYINT(1) DEFAULT 0");
    echo "Added is_hidden to order_items\n";
}
catch (Exception $e) {
    echo $e->getMessage();
}
