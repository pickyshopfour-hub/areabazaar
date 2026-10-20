<?php
/**
 * Final injection of Query buttons for missed dashboards
 */

// 1. admin_finance.php
$af_path = 'c:\xampp\htdocs\areabazaar\public\admin_finance.php';
$af_content = file_get_contents($af_path);

// Bank Reports
$af_content = str_replace(
    '<button class="btn btn-sm btn-outline-primary" onclick="viewBank(${r.id})">View</button>',
    '<button class="btn btn-sm btn-outline-info px-2 me-1" onclick="openQueryModal(${r.id}, \'BankReport\')" title="Query Record"><i class="fa fa-question"></i></button><button class="btn btn-sm btn-outline-primary" onclick="viewBank(${r.id})">View</button>',
    $af_content
);

// Payment Reports (Customer/Agent)
$af_content = str_replace(
    '${r.status === \'Matched\' ? `<button class="btn btn-sm btn-success px-2 py-1 me-1 shadow-sm" onclick="processVerification(${r.id}, \'verified\', \'\')" title="Quick Verify"><i class="fa fa-check"></i></button>` : \'\'}',
    '<button class="btn btn-sm btn-outline-info rounded-pill px-2 me-1" onclick="openQueryModal(${r.id}, `${type === \'customer\' ? \'CustomerReport\' : \'AgentReport\'}`)" title="Query Record"><i class="fa fa-question"></i></button>${r.status === \'Matched\' ? `<button class="btn btn-sm btn-success px-2 py-1 me-1 shadow-sm" onclick="processVerification(${r.id}, \'verified\', \'\')" title="Quick Verify"><i class="fa fa-check"></i></button>` : \'\'}',
    $af_content
);

file_put_contents($af_path, $af_content);
echo "Processed admin_finance.php\n";

// 2. whm_dashboard.php
$wd_path = 'c:\xampp\htdocs\areabazaar\public\whm_dashboard.php';
$wd_content = file_get_contents($wd_path);

// Orders
$wd_content = str_replace(
    '<button class="btn btn-sm btn-dark" onclick="updateOrderStatus(${o.id}, \'Processing\')">Start Triage</button>',
    '<button class="btn btn-sm btn-outline-info me-1" onclick="openQueryModal(${o.id}, \'Order\')" title="Query Order"><i class="fa fa-question"></i></button><button class="btn btn-sm btn-dark" onclick="updateOrderStatus(${o.id}, \'Processing\')">Start Triage</button>',
    $wd_content
);

// Items Triage
$wd_content = str_replace(
    '<button class="btn btn-sm btn-outline-success" onclick="markItemPacked(${i.variant_id})">Pack SKU</button>',
    '<button class="btn btn-sm btn-outline-info me-1" onclick="openQueryModal(${i.variant_id}, \'Variant\')" title="Query Variant"><i class="fa fa-question"></i></button><button class="btn btn-sm btn-outline-success" onclick="markItemPacked(${i.variant_id})">Pack SKU</button>',
    $wd_content
);

file_put_contents($wd_path, $wd_content);
echo "Processed whm_dashboard.php\n";

// 3. agent_dashboard.php
$ad_path = 'c:\xampp\htdocs\areabazaar\public\agent_dashboard.php';
$ad_content = file_get_contents($ad_path);

// Customers
$ad_content = str_replace(
    '<td><span class="badge bg-success">Active</span></td>',
    '<td><div class="d-flex align-items-center gap-2"><span class="badge bg-success">Active</span><button class="btn btn-xs btn-outline-primary border-0" onclick="openQueryModal(${c.id}, \'Customer\')" title="Query Customer"><i class="fa fa-question-circle"></i></button></div></td>',
    $ad_content
);

// Payments
$ad_content = str_replace(
    '<td><span class="badge bg-${badge}">${p.status === \'Pending\' ? \'Remitted (Awaiting Bank)\' : p.status}</span></td>',
    '<td><div class="d-flex align-items-center gap-2"><span class="badge bg-${badge}">${p.status === \'Pending\' ? \'Remitted (Awaiting Bank)\' : p.status}</span><button class="btn btn-xs btn-outline-primary border-0" onclick="openQueryModal(${p.id}, \'PaymentReport\')" title="Query Payment"><i class="fa fa-question-circle"></i></button></div></td>',
    $ad_content
);

file_put_contents($ad_path, $ad_content);
echo "Processed agent_dashboard.php\n";
?>
