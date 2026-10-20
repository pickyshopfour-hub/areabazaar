<?php
$files = glob("c:/xampp/htdocs/areabazaar/public/*.php");
$timestamp = time();
foreach ($files as $f) {
    if (is_file($f)) {
        $c = file_get_contents($f);
        // Remove any existing version string
        $c = preg_replace('/src="\.\.\/assets\/js\/global\.js(\?v=[0-9]+)?"/', 'src="../assets/js/global.js?v=' . $timestamp . '"', $c);
        file_put_contents($f, $c);
    }
}
echo "Cache busted script!";
?>
