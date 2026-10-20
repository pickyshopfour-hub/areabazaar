<?php
$whmLinks = [
    'whm_dashboard.php' => ['icon' => 'fa-home', 'label' => 'Dashboard Overview'],
    'whm_auctions.php' => ['icon' => 'fa-gavel', 'label' => 'Manage Auctions'],
    'whm_auction_orders.php' => ['icon' => 'fa-clipboard-list', 'label' => 'Auction Orders Mgt'],
    'whm_auction_items.php' => ['icon' => 'fa-box-open', 'label' => 'Auction Order Items Mgt'],
    'whm_sba_acquisitions.php' => ['icon' => 'fa-pallet', 'label' => 'SBA Acquisitions'],
    'whm_partners.php' => ['icon' => 'fa-handshake', 'label' => 'Partners'],
    'whm_inventory.php' => ['icon' => 'fa-box', 'label' => 'Inventory'],
    'whm_zbdp_dispatch.php' => ['icon' => 'fa-truck-loading', 'label' => 'ZBDp Dispatch']
];

$adminLinks = [
    'admin_dashboard.php' => ['icon' => 'fa-chart-pie', 'label' => 'Overview'],
    'admin_global_orders.php' => ['icon' => 'fa-globe', 'label' => 'Global Orders'],
    'admin_dispatch.php' => ['icon' => 'fa-truck-fast', 'label' => 'Logistics & Dispatch'],
    'admin_inventory.php' => ['icon' => 'fa-boxes-stacked', 'label' => 'Inventory Tracking'],
    'admin_finance.php' => ['icon' => 'fa-vault', 'label' => 'Finance Hub'],
    'admin_auctions.php' => ['icon' => 'fa-gavel', 'label' => 'Auction Configs'],
    'admin_active_sessions.php' => ['icon' => 'fa-tower-broadcast', 'label' => 'Live Sessions'],
    'admin_partners.php' => ['icon' => 'fa-handshake', 'label' => 'Partner Approvals'],
    'admin_oversight.php' => ['icon' => 'fa-shield-halved', 'label' => 'SA Oversight']
];

function generateSidebar($links, $currentFile)
{
    // We want to return the HTML to replace inside `<nav class="nav flex-column">` to `</nav>`
    $html = "<nav class=\"nav flex-column\">\n";
    foreach ($links as $file => $info) {
        $activeClass = ($file === $currentFile) ? 'active mb-2' : 'text-white-50 mb-2';
        $html .= "                    <a class=\"nav-link {$activeClass}\" href=\"{$file}\"><i class=\"fa {$info['icon']} me-2\"></i> {$info['label']}</a>\n";
    }
    $html .= "                </nav>";
    return $html;
}

$files = glob('public/whm_*.php');
foreach ($files as $file) {
    if (in_array(basename($file), array_keys($whmLinks))) {
        $content = file_get_contents($file);
        $newNav = generateSidebar($whmLinks, basename($file));
        $content = preg_replace('/<nav class="nav flex-column">.*?<\/nav>/s', $newNav, $content);
        file_put_contents($file, $content);
        echo "Updated WHM sidebar in $file\n";
    }
}

// Admin sidebars (excluding oversight since it uses a different pill structure for tabs, but check first)
$adminFiles = glob('public/admin_*.php');
foreach ($adminFiles as $file) {
    $basename = basename($file);
    if (in_array($basename, array_keys($adminLinks)) && $basename !== 'admin_oversight.php') {
        $content = file_get_contents($file);
        $newNav = generateSidebar($adminLinks, $basename);
        $content = preg_replace('/<nav class="nav flex-column">.*?<\/nav>/s', $newNav, $content);
        file_put_contents($file, $content);
        echo "Updated Admin sidebar in $file\n";
    }
}
?>
