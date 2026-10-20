<?php
require 'core/helpers/functions.php';
$db = getConn();
try {
    $db->exec("INSERT INTO operating_areas (area_name, type, parent_zone_id, status) VALUES 
        ('Ikeja Distribution Area', 'area', 1, 'Active'), 
        ('Surulere Dispatch Region', 'sub-zone', 1, 'Active')");
    echo 'Done!';
}
catch (Exception $e) {
    echo $e->getMessage();
}
