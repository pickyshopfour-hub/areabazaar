<?php
$c = new mysqli('localhost', 'root', '', 'areabazaar');
if ($c->connect_error)
    die("Connection failed: " . $c->connect_error);

$res = $c->query("ALTER TABLE waves ADD COLUMN is_default TINYINT(1) DEFAULT 0 AFTER scheduled_at");
if ($res) {
    echo "Column is_default added to waves.\n";
}
else {
    echo "Error altering table: " . $c->error . "\n";
}
?>
