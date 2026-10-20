<?php
require 'core/helpers/functions.php';
$db = getConn();
$stmt = $db->query('EXPLAIN product_variants');
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
$stmt = $db->query('EXPLAIN base_products');
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
