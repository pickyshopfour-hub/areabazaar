<?php
$file = 'c:\xampp\htdocs\areabazaar\core\Controllers\AuctionController.php';
$content = file_get_contents($file);

$needle = "public function switchWave(\$data)";
$replacement = "public function removeWave(\$data) {
        if (empty(\$data['wave_id'])) return jsonResponse('error', 'Wave ID required');
        \$stmt = \$this->db->prepare(\"UPDATE waves SET status='Removed' WHERE id=?\");
        if (\$stmt->execute([\$data['wave_id']])) return jsonResponse('success', 'Wave marked as Removed');
        return jsonResponse('error', 'Update Failed');
    }

    $needle";

if (strpos($content, 'public function removeWave') === false) {
    if (strpos($content, $needle) !== false) {
        $content = str_replace($needle, $replacement, $content);
        file_put_contents($file, $content);
        echo "Controller updated.\n";
    }
}

$index_file = 'c:\xampp\htdocs\areabazaar\public\index.php';
$index_content = file_get_contents($index_file);
$route_needle = "\$router->post('api/auction/switch-wave', ['AuctionController', 'switchWave']);";
$route_replacement = "\$router->post('api/auction/switch-wave', ['AuctionController', 'switchWave']);\n\$router->post('api/auction/remove-wave', ['AuctionController', 'removeWave']);";

if (strpos($index_content, 'remove-wave') === false) {
    $index_content = str_replace($route_needle, $route_replacement, $index_content);
    file_put_contents($index_file, $index_content);
    echo "Router updated.\n";
}
