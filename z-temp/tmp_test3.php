<?php
require 'core/helpers/functions.php';
$_GET = [];
require 'core/Controllers/OrderController.php';
$c = new OrderController(getConn());
print_r($c->listGlobalOrders([]));
