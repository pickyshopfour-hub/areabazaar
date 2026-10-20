<?php
$ch = curl_init('http://localhost/areabazaar/public/index.php/api/agent/customers');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$res = curl_exec($ch);
echo "RES: \n" . $res . "\n";
