<?php
$files = glob("c:/xampp/htdocs/areabazaar/public/*.php");
foreach ($files as $f) {
    $c = file_get_contents($f);
    $c = str_replace(["&#8358;", "Ã¢â€šÂ¦", "â‚¦", "&#x20A6;"], "₦", $c);
    file_put_contents($f, $c);
}
echo "Done replacing Naira symbols.";
?>
