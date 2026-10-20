<?php
require 'core/helpers/functions.php';
$_GET = ['page' => 1];
require 'core/Controllers/WhmController.php';
$c = new WhmController(getConn());
print_r($c->getOrderItemsMgt($_GET));
