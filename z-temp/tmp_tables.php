<?php
$db = new PDO('mysql:host=localhost;dbname=areabazaar', 'root', '');
foreach ($db->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN) as $t) {
    echo $t . "\n";
}
?>
