<?php
$db = new mysqli('localhost', 'root', '', 'areabazaar');
if ($db->connect_error)
    die("DB Connection Failed");
echo "Seeded Data Summary:\n";
echo "Base Products: " . $db->query("SELECT COUNT(*) FROM base_products")->fetch_row()[0] . "\n";
echo "Product Variants: " . $db->query("SELECT COUNT(*) FROM product_variants")->fetch_row()[0] . "\n";
echo "Auction Sessions: " . $db->query("SELECT COUNT(*) FROM auction_sessions")->fetch_row()[0] . "\n";
echo "Waves: " . $db->query("SELECT COUNT(*) FROM waves")->fetch_row()[0] . "\n";
echo "Wave Items: " . $db->query("SELECT COUNT(*) FROM wave_items")->fetch_row()[0] . "\n";
echo "Show Products: " . $db->query("SELECT COUNT(*) FROM show_products")->fetch_row()[0] . "\n";
echo "Readiness Logs: " . $db->query("SELECT COUNT(*) FROM readiness_check_logs")->fetch_row()[0] . "\n";
?>
