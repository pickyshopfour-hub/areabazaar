<?php
$files = glob("c:/xampp/htdocs/areabazaar/public/*.php");
foreach ($files as $f) {
    if (is_file($f)) {
        $c = file_get_contents($f);
        // Replace all variants of the corruption including the huge one
        $badStrings = [
            "ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¦",
            "Ã¢â€šÂ¦",
            "â‚¦",
            "&#x20A6;",
            "&#8358;"
        ];
        $c = str_replace($badStrings, "₦", $c);
        file_put_contents($f, $c);
    }
}
echo "Done replacing Naira symbols.";
?>
