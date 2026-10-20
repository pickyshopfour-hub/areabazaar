<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Auction Admin - AreaBazaar</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link href="../assets/css/style.css?v=1772656066.00796" rel="stylesheet">
    <script>
        <?php
require_once '../core/includes/database.php';
require_once '../core/helpers/functions.php';
$__db = (new Database())->getConnection();
injectCurrentUserJs($__db, ['id' => 1, 'name' => 'Admin User', 'role' => 'Admin', 'type' => 'staff']);
?>
    </script>
    <style>
        body { background: #f8fafc; }
        .sidebar { min-height: 100vh; background: #0f172a; color: white; }
        .card { border: none; border-radius: 1rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
        .nav-link { color: #94a3b8; transition: all 0.2s; }
        .nav-link:hover, .nav-link.active { color: white; background: rgba(255,255,255,0.1); }
        .check-item { transition: all 0.2s; border-radius: 0.5rem; }
        .check-item:hover { background: #f1f5f9; }

        button.btn-glass:hover {
            background: #ffc107 !important;
            color: #0f172a !important;
        }

        button.btn-glass {
            background: #0f172a !important;
            color: #ffc107 !important;
        }
        

    </style>
</head>
<body>
    <div class="container-fluid">
        <div class="row">
            <!-- Sidebar -->
            <div class="col-md-2 sidebar p-4">
                <h4 class="fw-bold mb-4">Admin Dashboard</h4>
                <nav class="nav flex-column">
                    <a class="nav-link text-white-50 mb-2" href="admin_dashboard.php"><i class="fa fa-chart-pie me-2"></i> Overview</a>
                    <a class="nav-link text-white-50 mb-2" href="admin_global_orders.php"><i class="fa fa-globe me-2"></i> Global Orders</a>
                    <a class="nav-link text-white-50 mb-2" href="admin_dispatch.php"><i class="fa fa-truck-fast me-2"></i> Logistics & Dispatch</a>
                    <a class="nav-link text-white-50 mb-2" href="admin_inventory.php"><i class="fa fa-boxes-stacked me-2"></i> Inventory Tracking</a>
                    <a class="nav-link text-white-50 mb-2" href="admin_finance.php"><i class="fa fa-vault me-2"></i> Finance Hub</a>
                    <a class="nav-link active mb-2" href="admin_auctions.php"><i class="fa fa-gavel me-2"></i> Auction Configs</a>
                    <a class="nav-link text-white-50 mb-2" href="admin_active_sessions.php"><i class="fa fa-tower-broadcast me-2"></i> Live Sessions</a>
                    <a class="nav-link text-white-50 mb-2" href="admin_partners.php"><i class="fa fa-handshake me-2"></i> Partner Approvals</a>
                    <a class="nav-link text-white-50 mb-2" href="admin_oversight.php"><i class="fa fa-shield-halved me-2"></i> SA Oversight</a>
                    <a class="nav-link text-white-50 mb-2" href="admin_queries.php"><i class="fa fa-comments me-2"></i> Query Hub</a>
                </nav>
            </div>

            <!-- Main Content -->
            <div class="col-md-10 p-5">
                <?php
require_once '../core/Controllers/AuctionController.php';
require_once '../core/Models/WHZone.php';
require_once '../core/helpers/functions.php';

$db = getConn();
$controller = new AuctionController($db);
$zoneModel = new WHZone($db);

$sessionsRes = $controller->getAllSessions();
$sessions = $sessionsRes['sessions'] ?? [];
$zones = $zoneModel->findAll();

$activeId = $_GET['manage_id'] ?? ($sessions[0]['id'] ?? null);
$currentSession = null;
foreach ($sessions as $s) {
    if ($s['id'] == $activeId) {
        $currentSession = $s;
        break;
    }
}

$waves = [];
if ($currentSession) {
    $stmt = $db->prepare("SELECT * FROM waves WHERE session_id = ? ORDER BY is_default DESC, id ASC");
    $stmt->execute([$currentSession['id']]);
    $waves = $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// Check role for Senior Admin access
$isSeniorAdmin = true; // Replace with real session check e.g., $_SESSION['role'] == 'SeniorAdmin'
?>

                <div class="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h2 class="fw-bold text-dark">Auction Management</h2>
                        <p class="text-muted">Manage lifecycle, verify readiness, and oversee price waves.</p>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <div id="notifBellContainer" class="me-3"></div>
                        <button class="btn btn-premium px-4" data-bs-toggle="modal" data-bs-target="#newSessionModal">
                            <i class="fa fa-plus me-2"></i> New Session
                        </button>
                    </div>
                </div>

                <div class="row mb-4 g-4 align-items-stretch">
                    <div class="col-lg-6">
                        <!-- Session Selector Card -->
                        <div class="card p-4 h-100 mb-0">
                            <h5 class="fw-bold mb-3">All Auction Sessions</h5>
                            <div class="table-responsive" style="max-height: 400px; overflow-y: auto;">
                                <table class="table table-hover align-middle">
                                    <thead>
                                        <tr class="text-muted small">
                                            <th>Session Name</th>
                                            <th>Status</th>
                                            <th>Start Time</th>
                                            <th class="text-end">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php foreach ($sessions as $s): ?>
                                        <tr class="<?php echo $s['id'] == $activeId ? 'table-primary-light active-interaction-row' : ''; ?>">
                                            <td>
                                                <div class="fw-bold text-primary"><?php echo $s['session_name']; ?></div>
                                                <div class="text-muted small">ID: #<?php echo $s['id']; ?></div>
                                            </td>
                                            <td>
                                                <span class="badge bg-<?php echo getStatusColor($s['status']); ?> rounded-pill">
                                                    <?php echo $s['status']; ?>
                                                </span>
                                            </td>
                                            <td class="small"><?php echo $s['start_time'] ?? 'Not Scheduled'; ?></td>
                                            <td class="text-end">
                                                <div class="btn-group">
                                                    <?php if ($s['status'] == 'Draft' || $s['status'] == 'Ready'): ?>
                                                        <button class="btn btn-sm btn-outline-success" onclick="controlSession(<?php echo $s['id']; ?>, 'start')">Start</button>
                                                    <?php
    elseif ($s['status'] == 'Active'): ?>
                                                        <button class="btn btn-sm btn-outline-warning" onclick="controlSession(<?php echo $s['id']; ?>, 'pause')">Pause</button>
                                                        <button class="btn btn-sm btn-outline-danger" onclick="controlSession(<?php echo $s['id']; ?>, 'end')">End</button>
                                                    <?php
    endif; ?>
                                                    <a href="?manage_id=<?php echo $s['id']; ?>#managementSection" class="btn btn-sm btn-primary ms-2">Manage</a>
                                                </div>
                                            </td>
                                        </tr>
                                        <?php
endforeach; ?>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                
                    <div class="col-lg-6">
                        <!-- Waves Manager Card -->
                        <div class="card p-4 h-100 mb-0">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <h5 class="fw-bold mb-0"><i class="fa fa-water text-info me-2"></i> Session Waves</h5>
                                <?php if ($currentSession && !in_array($currentSession['status'], ['Completed', 'Ended', 'Closed'])): ?>
                                    <button class="btn btn-sm btn-primary shadow-sm" data-bs-toggle="modal" data-bs-target="#addWaveModal"><i class="fa fa-plus me-1"></i> Add Wave</button>
                                <?php
endif; ?>
                            </div>
                            <?php if ($currentSession): ?>
                                <div class="table-responsive" style="max-height: 400px; overflow-y: auto;">
                                    <table class="table table-hover align-middle">
                                        <thead>
                                            <tr class="text-muted small">
                                                <th>Wave Name</th>
                                                <th>Status</th>
                                                <th class="text-end">Command</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php if (empty($waves)): ?>
                                            <tr><td colspan="3" class="text-center py-4 text-muted small">No waves associated with this session.</td></tr>
                                            <?php
    else: ?>
                                            <?php foreach ($waves as $w): ?>
                                            <tr>
                                                <td>
                                                    <div class="fw-bold text-dark">
                                                        <?php echo $w['wave_name']; ?> 
                                                        <?php if ($w['is_default']): ?>
                                                            <span class="badge bg-primary ms-1" style="font-size: 0.65em;">DEFAULT</span>
                                                        <?php
            endif; ?>
                                                    </div>
                                                    <div class="text-muted small">Switch: <?php echo $w['scheduled_at'] ? date('H:i', strtotime($w['scheduled_at'])) : 'Manual'; ?></div>
                                                </td>
                                                <td>
                                                    <span class="badge bg-<?php echo $w['status'] == 'Removed' ? 'danger' : ($w['status'] == 'Active' ? 'success' : ($w['status'] == 'Replaced' ? 'secondary' : 'warning')); ?> rounded-pill">
                                                        <?php echo $w['status']; ?>
                                                    </span>
                                                    <br>
                                                    <?php if ($w['senior_admin_approval']): ?>
                                                        <span class="badge bg-success mt-1" style="font-size:0.6rem;"><i class="fa fa-check"></i> SA Approved</span>
                                                    <?php
            else: ?>
                                                        <span class="badge bg-danger mt-1" style="font-size:0.6rem;">Needs Approval</span>
                                                    <?php
            endif; ?>
                                                </td>
                                                <td class="text-end">
                                                    <div class="btn-group">
                                                        <button class="btn btn-sm btn-outline-dark px-2 border" onclick="openQueryModal(<?php echo $w['id']; ?>, 'Wave')" title="Query Wave"><i class="fa fa-question-circle"></i></button>
                                                        <button class="btn btn-sm btn-outline-primary px-2 border" onclick="openEditWaveModal(<?php echo htmlspecialchars(json_encode($w)); ?>, '<?php echo $currentSession['status']; ?>')" title="View Details & Edit"><i class="fa fa-edit"></i></button>
                                                        <?php if (!in_array($currentSession['status'], ['Completed', 'Ended', 'Cancelled', 'Closed']) && $w['status'] != 'Removed'): ?>
                                                            <button class="btn btn-sm btn-outline-danger px-2 border" onclick="removeWave(<?php echo $w['id']; ?>)" title="Remove Wave"><i class="fa fa-trash"></i></button>
                                                        <?php
            endif; ?>
                                                        
                                                        <?php if (!$w['senior_admin_approval'] && $isSeniorAdmin): ?>
                                                            <button class="btn btn-sm btn-success px-2" onclick="approveWave(<?php echo $w['id']; ?>)" title="Approve Wave"><i class="fa fa-stamp"></i></button>
                                                        <?php
            endif; ?>
                                                        
                                                        <?php if ($currentSession['status'] == 'Active' && $w['status'] != 'Active' && $w['status'] != 'Removed' && $w['senior_admin_approval']): ?>
                                                            <button class="btn btn-sm btn-outline-dark px-2 border" onclick="switchWave(<?php echo $w['id']; ?>, <?php echo $currentSession['id']; ?>)" title="Switch to this Wave Now">
                                                                <i class="fa fa-play text-primary"></i>
                                                            </button>
                                                        <?php
            endif; ?>
                                                    </div>
                                                </td>
                                            </tr>
                                            <?php
        endforeach; ?>
                                            <?php
    endif; ?>
                                        </tbody>
                                    </table>
                                </div>
                            <?php
else: ?>
                            <div class="text-center py-5 text-muted">
                                <i class="fa fa-mouse-pointer fs-1 mb-3"></i>
                                <p>Select a session to view waves.</p>
                            </div>
                            <?php
endif; ?>
                        </div>
                    </div>
                </div>

                <?php if ($currentSession): ?>
                <div class="row g-4 mb-5" id="managementSection">
                    <div class="col-12 d-flex align-items-center justify-content-between">
                        <h4 class="fw-bold text-dark mb-0">
                            <i class="fa fa-terminal me-2 text-primary"></i> 
                            Active Management: <?php echo $currentSession['session_name']; ?>
                        </h4>
                        <span class="badge bg-primary px-3">Session Active</span>
                    </div>
                    
                    <!-- PrepCheck Section -->
                    <div class="col-md-12">
                        <div class="card p-4 border-0 shadow-sm bg-premium-dark text-white">
                            <h5 class="fw-bold mb-4"><i class="fa fa-clipboard-check me-2"></i> PrepCheck Verification</h5>
                            <div class="row g-3">
                                <div class="col-md-3">
                                    <button class="btn btn-glass w-100 py-3" onclick="openAuthVerify('Stock')">
                                        <i class="fa fa-boxes-stacked d-block mb-2 fs-4"></i> Stock Gate
                                    </button>
                                </div>
                                <div class="col-md-3">
                                    <button class="btn btn-glass w-100 py-3" onclick="openAuthVerify('Quality')">
                                        <i class="fa fa-check-double d-block mb-2 fs-4"></i> Quality Gate
                                    </button>
                                </div>
                                <div class="col-md-3">
                                    <button class="btn btn-glass w-100 py-3" onclick="openAuthVerify('Logistics')">
                                        <i class="fa fa-truck-fast d-block mb-2 fs-4"></i> Logistics Gate
                                    </button>
                                </div>
                                <div class="col-md-3">
                                    <button class="btn btn-glass w-100 py-3" onclick="openAuthVerify('Manpower')">
                                        <i class="fa fa-users-gear d-block mb-2 fs-4"></i> HR Gate
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Manage Auction Settings (ADM-EE-07) -->
                    <div class="col-md-12">
                        <div class="card p-4 border-0 shadow-sm">
                            <div class="d-flex justify-content-between align-items-center mb-4">
                                <h5 class="fw-bold mb-0"><i class="fa fa-cog me-2 text-secondary"></i> Global Session Settings</h5>
                                <?php if (!$isSeniorAdmin): ?>
                                    <span class="badge bg-light text-dark border">Read Only (Admin)</span>
                                <?php
    endif; ?>
                            </div>
                            <form id="sessionSettingsForm" class="row g-3">
                                <input type="hidden" name="id" value="<?php echo $currentSession['id']; ?>">
                                <div class="col-md-4">
                                    <label class="form-label small fw-bold">Session Title</label>
                                    <input type="text" name="session_name" class="form-control" value="<?php echo $currentSession['session_name']; ?>" <?php echo !$isSeniorAdmin ? 'readonly' : ''; ?>>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label small fw-bold">Session Type</label>
                                    <select name="type" class="form-select" <?php echo !$isSeniorAdmin ? 'disabled' : ''; ?>>
                                        <?php
    $types = ['foodies-auction', 'thrifts-auction', 'clearance-auction', 'pots-auction', 'combos-auction', 'split-auction', 'mixed-auction', 'after-auction'];
    foreach ($types as $t): ?>
                                            <option value="<?php echo $t; ?>" <?php echo($currentSession['type'] ?? '') == $t ? 'selected' : ''; ?>>
                                                <?php echo ucwords(str_replace('-', ' ', $t)); ?>
                                            </option>
                                        <?php
    endforeach; ?>
                                    </select>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label small fw-bold">Target Zone (Coverage)</label>
                                    <select name="target_zone" class="form-select" <?php echo !$isSeniorAdmin ? 'disabled' : ''; ?>>
                                        <?php foreach ($zones as $z): ?>
                                            <option value="<?php echo $z['id']; ?>" <?php echo($currentSession['target_zone'] ?? '') == $z['id'] ? 'selected' : ''; ?>>
                                                <?php echo $z['zone_name']; ?>
                                            </option>
                                        <?php
    endforeach; ?>
                                    </select>
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label small fw-bold">Target Revenue (₦)</label>
                                    <input type="number" name="target_revenue" class="form-control" value="<?php echo $currentSession['target_revenue'] ?? 0; ?>" <?php echo !$isSeniorAdmin ? 'readonly' : ''; ?>>
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label small fw-bold">Start Time</label>
                                    <input type="datetime-local" name="start_time" class="form-control" value="<?php echo $currentSession['start_time'] ? date('Y-m-d\TH:i', strtotime($currentSession['start_time'])) : ''; ?>" <?php echo !$isSeniorAdmin ? 'readonly' : ''; ?>>
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label small fw-bold">WHM Charge List (CSV Staff IDs)</label>
                                    <input type="text" name="charge_whm" class="form-control" placeholder="101, 105, 120" value="<?php echo $currentSession['charge_whm'] ?? ''; ?>" <?php echo !$isSeniorAdmin ? 'readonly' : ''; ?>>
                                </div>
                                <div class="col-md-3 d-flex align-items-end">
                                    <?php if ($isSeniorAdmin): ?>
                                        <button type="button" class="btn btn-dark w-100" onclick="updateSessionSettings()">
                                            <i class="fa fa-save me-2"></i> Update Global Config
                                        </button>
                                    <?php
    endif; ?>
                                </div>
                            </form>
                        </div>
                    </div>

                    <!-- Manage Auction Items -->
                    <div class="col-md-12">
                        <div class="card p-4 border-0 shadow-sm">
                            <div class="d-flex justify-content-between align-items-center mb-4">
                                <h5 class="fw-bold mb-0"><i class="fa fa-box-open me-2 text-info"></i> Session Inventory Oversight</h5>
                                <div class="d-flex gap-2">
                                    <select id="itemFilterFactor" class="form-select form-select-sm" style="width: auto;">
                                        <option value="category">Category</option>
                                        <option value="stock">Stock Below</option>
                                        <option value="price-above">Price Above</option>
                                        <option value="price-below">Price Below</option>
                                    </select>
                                    <input type="text" id="itemFilterValue" class="form-control form-control-sm" placeholder="Search..." style="width: 150px;">
                                    <button class="btn btn-sm btn-dark" onclick="loadAuctionItems()">Filter</button>
                                </div>
                            </div>
                            <div class="table-responsive">
                                <table class="table table-hover align-middle small">
                                    <thead>
                                        <tr class="text-muted">
                                            <th>Product Identity</th>
                                            <th>Current Price</th>
                                            <th>Stock</th>
                                            <th>Status</th>
                                            <th class="text-end">Command</th>
                                        </tr>
                                    </thead>
                                    <tbody id="auctionItemsBody">
                                        <!-- Loaded via JS -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- Manage Auction Orders -->
                    <div class="col-md-12">
                        <div class="card p-4 border-0 shadow-sm">
                            <div class="d-flex justify-content-between align-items-center mb-4">
                                <h5 class="fw-bold mb-0"><i class="fa fa-shopping-cart me-2 text-warning"></i> Live Lifecycle Orders</h5>
                                <div class="d-flex gap-2">
                                    <select id="orderFilterFactor" class="form-select form-select-sm" style="width: auto;">
                                        <option value="wave">Wave ID</option>
                                        <option value="status">Status</option>
                                        <option value="area">Origin Area</option>
                                    </select>
                                    <input type="text" id="orderFilterValue" class="form-control form-control-sm" placeholder="Value..." style="width: 120px;">
                                    <button class="btn btn-sm btn-dark" onclick="loadAuctionOrders()">Refresh</button>
                                </div>
                            </div>
                            <div class="table-responsive">
                                <table class="table table-hover align-middle small">
                                    <thead>
                                        <tr class="text-muted">
                                            <th>Order ID</th>
                                            <th>Customer / Area</th>
                                            <th>Value</th>
                                            <th>Status</th>
                                            <th class="text-end">Command</th>
                                        </tr>
                                    </thead>
                                    <tbody id="auctionOrdersBody">
                                        <!-- Loaded via JS -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <?php
endif; ?>
                <input type="hidden" id="manage_session_id" value="<?php echo $activeId; ?>">
            </div>
        </div>
    </div>

    <!-- Modals -->
    <div class="modal fade" id="newSessionModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                <div class="modal-header bg-dark text-white p-4">
                    <h5 class="modal-title fw-bold">Initialize New Wave Session</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-4">
                    <form id="newSessionForm" class="row g-3">
                        <div class="col-md-8">
                            <label class="form-label small fw-bold text-muted">Session Identity (Title) *</label>
                            <input type="text" name="name" class="form-control form-control-lg" placeholder="e.g. Lagos Morning Wave - March 01" required>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label small fw-bold text-muted">Session Type *</label>
                            <select name="type" class="form-select form-select-lg" required>
                                <option value="mixed-auction">Mixed Auction</option>
                                <option value="foodies-auction">Foodies</option>
                                <option value="thrifts-auction">Thrifts</option>
                                <option value="clearance-auction">Clearance</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold text-muted">Target Operating Zone *</label>
                            <select name="target_zone" class="form-select" required>
                                <option value="">Select Zone...</option>
                                <?php foreach ($zones as $z): ?>
                                    <option value="<?php echo $z['id']; ?>"><?php echo $z['zone_name']; ?></option>
                                <?php
endforeach; ?>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold text-muted">Target Revenue Target (₦)</label>
                            <input type="number" name="target_revenue" class="form-control" placeholder="Optional">
                        </div>
                        
                        <div id="initSuccessArea" class="col-12 d-none">
                            <div class="alert alert-success d-flex align-items-center rounded-4">
                                <i class="fa fa-check-circle fs-2 me-3"></i>
                                <div>
                                    <div class="fw-bold">Session Successfully Provisioned!</div>
                                    <div id="initSessionIdDisplay" class="small mb-2">ID: #0</div>
                                    <a id="loadItemsLink" href="#" target="_blank" class="btn btn-sm btn-dark">
                                        <i class="fa fa-upload me-2"></i> Load Preliminary Base Products (ProductIngestion.gs)
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div class="col-12 mt-4">
                            <button type="submit" class="btn btn-premium w-100 py-3 fw-bold shadow">
                                TRIGGER SESSION INITIALIZATION
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Inventory Command Modal -->
    <div class="modal fade" id="itemCommandModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-sm text-dark">
            <div class="modal-content border-0 shadow rounded-4">
                <div class="modal-body p-4 text-center">
                    <h6 class="fw-bold mb-3" id="itemCommandLabel">Update Stock</h6>
                    <div class="mb-3">
                        <input type="number" id="itemCommandValue" class="form-control text-center fs-4" placeholder="0">
                    </div>
                    <button class="btn btn-dark w-100 py-2" onclick="executeItemCommand()">Apply Change</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Admin Verification Modal (Auth Gate) -->
    <div class="modal fade" id="authVerifyModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered text-dark">
            <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                <div class="modal-header bg-dark text-white p-4">
                    <h5 class="modal-title fw-bold">Authenticate Verification: <span id="verifyTypeLabel"></span></h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-4">
                    <form id="verifyForm">
                        <input type="hidden" name="check_type" id="verify_check_type">
                        <input type="hidden" name="session_id" id="verify_session_id" value="<?php echo $activeId; ?>">
                        
                        <div class="mb-3">
                            <label class="form-label fw-bold small text-muted">Admin Staff ID</label>
                            <input type="number" name="admin_staff_id" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-bold small text-muted">Confirm Admin Password</label>
                            <input type="password" name="admin_password" class="form-control" placeholder="••••••••" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-bold small text-muted">Verification Comments</label>
                            <textarea name="comments" class="form-control" placeholder="Provide details on verification results..."></textarea>
                        </div>
                        <button type="button" class="btn btn-dark w-100 py-3 fw-bold" onclick="submitAdminVerify()">
                            AUTHENTICATE & LOG VERIFICATION
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>

        <!-- Edit Wave Modal -->
    <div class="modal fade" id="editWaveModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg rounded-4">
                <div class="modal-header bg-dark text-white p-4">
                    <h5 class="modal-title fw-bold">Wave Details: <span id="editWaveTitle"></span></h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-4">
                    <form id="editWaveForm">
                        <input type="hidden" id="editWaveId">
                        <div class="mb-3">
                            <label class="form-label small fw-bold text-muted">Wave Name</label>
                            <input type="text" id="editWaveName" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-bold text-muted">Wave Status</label>
                            <select id="editWaveStatus" class="form-select">
                                <option value="Pending">Pending</option>
                                <option value="Active">Active</option>
                                <option value="Replaced">Replaced</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-bold text-muted">Scheduled Switch Time</label>
                            <input type="datetime-local" id="editWaveTime" class="form-control">
                        </div>
                        <div class="form-check form-switch mb-4">
                            <input class="form-check-input" type="checkbox" id="editWaveDefault">
                            <label class="form-check-label small fw-bold text-dark" for="editWaveDefault">Set as Base Default Wave for Session</label>
                        </div>
                        <div id="waveEditWarning" class="alert alert-warning small d-none"><i class="fa fa-info-circle me-1"></i> Session is passed. Editing parameters is disabled. Status adjustments only.</div>
                        <button type="submit" id="waveEditSaveBtn" class="btn btn-primary w-100 py-2 fw-bold shadow-sm">Save Wave Changes</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Add Wave Modal -->
    <div class="modal fade" id="addWaveModal" tabindex="-1">
        <div class="modal-dialog modal-lg text-dark">
            <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                <div class="modal-header bg-dark text-white p-4">
                    <h5 class="modal-title fw-bold"><i class="fa fa-water me-2"></i> Add New Wave</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-4">
                    <form id="addWaveForm">
                        <input type="hidden" name="session_id" id="addWaveSessionId" value="<?php echo $activeId; ?>">
                        
                        <h6 class="fw-bold text-primary mb-3 border-bottom pb-2">Wave Definition</h6>
                        <div class="row g-3 mb-4">
                            <div class="col-md-6">
                                <label class="form-label small fw-bold text-muted">Wave Name *</label>
                                <input type="text" name="wave_name" class="form-control" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label small fw-bold text-muted">Status</label>
                                <select name="status" class="form-select">
                                    <option value="Pending" selected>Pending</option>
                                    <option value="Active">Active</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label small fw-bold text-muted">Scheduled Time</label>
                                <input type="time" name="scheduled_time" class="form-control">
                            </div>
                            <div class="col-md-6 d-flex align-items-center mt-4">
                                <div class="form-check form-switch ms-2">
                                    <input class="form-check-input" type="checkbox" name="is_default" value="1" id="addWaveIsDefault">
                                    <label class="form-check-label fw-bold small text-muted" for="addWaveIsDefault">Set as Default Wave</label>
                                </div>
                            </div>
                        </div>

                        <h6 class="fw-bold text-success mb-3 border-bottom pb-2">Wave-Items Setting</h6>
                        <div class="row g-3">
                            <div class="col-md-12">
                                <label class="form-label small fw-bold text-muted">Include Product Category</label>
                                <input type="text" name="include_prod_category" class="form-control" placeholder="e.g. Electronics (Empty to skip items)">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label small fw-bold text-muted">Price Add Factor (Decimal)</label>
                                <div class="input-group">
                                    <select class="form-select form-select-sm" name="to_addorsub_amount" style="max-width: 60px;">
                                        <option value="+">+</option>
                                        <option value="-">-</option>
                                    </select>
                                    <input type="number" step="0.01" name="price_add_factor" class="form-control">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label small fw-bold text-muted">Price Percentage Factor (%)</label>
                                <div class="input-group">
                                    <select class="form-select form-select-sm" name="to_addorsub_percent" style="max-width: 60px;">
                                        <option value="+">+</option>
                                        <option value="-">-</option>
                                    </select>
                                    <input type="number" step="0.1" name="price_percentage_factor" class="form-control">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label small fw-bold text-muted">Stock Apply (New Stock Limit)</label>
                                <input type="number" name="stock_apply" class="form-control">
                            </div>
                        </div>
                        
                        <div class="mt-4 text-end">
                            <button type="button" class="btn btn-secondary px-4 me-2" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-success px-5 fw-bold" onclick="submitAddWave()">Add Wave</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <!-- Assign Modal -->
    <div class="modal fade" id="assignModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content rounded-4 border-0 shadow">
                <div class="modal-header border-0 pb-0">
                    <h6 class="modal-title fw-bold">Assign Order</h6>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-4">
                    <input type="hidden" id="assignOrderId">
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Assignee ID / Agent ID</label>
                        <input type="number" id="assignValue" class="form-control" placeholder="Enter Staff/Partner ID" required>
                    </div>
                </div>
                <div class="modal-footer border-0">
                    <button class="btn btn-outline-secondary px-4 rounded-pill btn-sm" data-bs-dismiss="modal">Cancel</button>
                    <button class="btn btn-primary px-4 rounded-pill btn-sm fw-bold" onclick="submitAssign()">Assign</button>
                </div>
            </div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="../assets/js/AuctionManagement.js"></script>
    <script>
        $(document).ready(function() {
            if ($('#manage_session_id').val()) {
                loadAuctionItems();
                loadAuctionOrders();
                setInterval(loadAuctionOrders, 30000);
            }

            $('#newSessionForm').on('submit', function(e) {
                e.preventDefault();
                $.post('index.php/api/auction/create', $(this).serialize(), function(res) {
                    if (res.status === 'success') {
                        $('#initSuccessArea').removeClass('d-none');
                        $('#initSessionIdDisplay').text('ID: #' + res.session_id);
                        $('#loadItemsLink').attr('href', res.load_items_url);
                    } else { alert(res.message); }
                });
            });
        });

        function submitAddWave() {
            if (!$('input[name="wave_name"]').val()) {
                alert('Wave Name is mandatory.');
                return;
            }
            const formData = $('#addWaveForm').serialize();
            $.post('index.php/api/auction/wave/add', formData, function(res) {
                if(res.status === 'success') {
                    alert('Wave setup successful.');
                    location.reload();
                } else {
                    alert(res.message || 'Failed to add wave.');
                }
            }).fail(function() {
                alert('Network error adding wave.');
            });
        }

        function loadAuctionItems() {
            const sid = $('#manage_session_id').val();
            const factor = $('#itemFilterFactor').val();
            const val = $('#itemFilterValue').val();
            $.get(`index.php/api/auction/items?session_id=${sid}&filter_factor=${factor}&filter_value=${val}`, function(res) {
                let html = '';
                if(res.status === "success" && res.data) { res.data.forEach(item => {
                    html += `
                        <tr>
                            <td>
                                <div class="fw-bold">${item.variant_name}</div>
                                <div class="text-muted small">${item.category}</div>
                            </td>
                            <td>₦${parseFloat(item.current_price).toLocaleString()}</td>
                            <td>${item.current_stock}</td>
                            <td><span class="badge ${item.status === 'Active' ? 'bg-success' : 'bg-secondary'} rounded-pill">${item.status}</span></td>
                            <td class="text-end">
                                <div class="btn-group">
                                    <button class="btn btn-sm btn-outline-dark" onclick="openQueryModal(${item.id}, 'Inventory')" title="Query Item"><i class="fa fa-question-circle"></i></button>
                                    <button class="btn btn-sm btn-outline-dark" onclick="openItemCommand(${item.id}, 'addStock')"><i class="fa fa-plus"></i></button>
                                    <button class="btn btn-sm btn-outline-dark" onclick="openItemCommand(${item.id}, 'changeCurrentPrice')"><i class="fa fa-tag"></i></button>
                                    <button class="btn btn-sm btn-outline-dark dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown"></button>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" href="#" onclick="executeItemAction(${item.id}, 'hide')">Hide</a></li>
                                        <li><a class="dropdown-item" href="#" onclick="executeItemAction(${item.id}, 'suspend')">Suspend</a></li>
                                        <li><hr class="dropdown-divider"></li>
                                        <li><a class="dropdown-item" href="#" onclick="openItemCommand(${item.id}, 'fixWavesPrice')">Fix Global Price</a></li>
                                    </ul>
                                </div>
                            </td>
                        </tr>
                    `;
                });
                } 
                $('#auctionItemsBody').html(html || '<tr><td colspan="5" class="text-center py-4">No products in session.</td></tr>');
            });
        }

        function loadAuctionOrders() {
            const sid = $('#manage_session_id').val();
            const factor = $('#orderFilterFactor').val();
            const val = $('#orderFilterValue').val();
            $.get(`index.php/api/auction/orders?session_id=${sid}&filter_factor=${factor}&filter_value=${val}`, function(res) {
                let html = '';
                if(res.status === "success" && res.data) { res.data.forEach(order => {
                    html += `
                        <tr>
                            <td>#${order.id} ${order.is_urgent ? '<span class="text-danger"><i class="fa fa-bolt"></i></span>' : ''}</td>
                            <td>
                                <div class="fw-bold">${order.customer_name}</div>
                                <div class="text-muted extra-small">${order.destination_area_name || 'N/A'}</div>
                            </td>
                            <td>₦${parseFloat(order.total_amount).toLocaleString()}</td>
                            <td><span class="badge bg-secondary rounded-pill">${order.status}</span></td>
                            <td class="text-end">
                                <div class="btn-group">
                                    <button class="btn btn-xs btn-outline-dark me-1" onclick="openQueryModal(${order.id}, 'Order')" title="Query Order"><i class="fa fa-question"></i></button>
                                    <button class="btn btn-xs btn-success" onclick="executeOrderAction(${order.id}, 'Approve')">Approve</button>
                                    <button class="btn btn-xs btn-outline-dark dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown"></button>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" href="javascript:void(0)" onclick="executeOrderAction(${order.id}, 'SetUrgent')">Mark Urgent</a></li>
                                        <li><a class="dropdown-item" href="javascript:void(0)" onclick="openAssignModal(${order.id})">Assign</a></li>
                                    </ul>
                                </div>
                            </td>
                        </tr>
                    `;
                });
                } 
                $('#auctionOrdersBody').html(html || '<tr><td colspan="5" class="text-center py-4">No active orders detected.</td></tr>');
            });
        }

        function updateSessionSettings() {
            $.post('index.php/api/auction/update-settings', $('#sessionSettingsForm').serialize(), function(res) {
                alert(res.message);
                if(res.status === 'success') location.reload();
            });
        }

        let activeItemId = null, activeItemAction = null;
        function openItemCommand(id, action) {
            activeItemId = id; activeItemAction = action;
            $('#itemCommandLabel').text(action === 'addStock' ? 'Add Inventory' : (action === 'fixWavesPrice' ? 'Fix Global Price' : 'Adjust Price'));
            $('#itemCommandModal').modal('show');
        }

        function executeItemCommand() {
            $.post('index.php/api/auction/update-item', { id: activeItemId, action: activeItemAction, value: $('#itemCommandValue').val() }, function(res) {
                if(res.status === 'success') { $('#itemCommandModal').modal('hide'); loadAuctionItems(); }
                else { alert(res.message); }
            });
        }

        function executeItemAction(id, action) {
            $.post('index.php/api/auction/update-item', { id: id, action: action }, function(res) { loadAuctionItems(); });
        }

        function executeOrderAction(id, action, val = null) {
            $.post('index.php/api/auction/update-order', { id: id, action: action, value: val }, function(res) { loadAuctionOrders(); });
        }
        
        function openAssignModal(id) {
            $('#assignOrderId').val(id);
            $('#assignModal').modal('show');
        }
        function submitAssign() {
            const id = $('#assignOrderId').val();
            const val = $('#assignValue').val();
            if (!val) return alert("Please enter assignee ID");
            executeOrderAction(id, 'Assign', val);
            $('#assignModal').modal('hide');
        }

                // Modal functions
        

        

    function openEditWaveModal(waveData, sessionStatus) {
            $('#editWaveId').val(waveData.id);
            $('#editWaveTitle').text(waveData.wave_name);
            $('#editWaveName').val(waveData.wave_name);
            $('#editWaveStatus').val(waveData.status);
            
            // Format datetime-local exactly: YYYY-MM-DDThh:mm
            if (waveData.scheduled_at) {
                let dt = new Date(waveData.scheduled_at);
                let localStr = dt.getFullYear() + '-' + String(dt.getMonth()+1).padStart(2,'0') + '-' + String(dt.getDate()).padStart(2,'0') + 'T' + String(dt.getHours()).padStart(2,'0') + ':' + String(dt.getMinutes()).padStart(2,'0');
                $('#editWaveTime').val(localStr);
            } else {
                $('#editWaveTime').val('');
            }
            $('#editWaveDefault').prop('checked', waveData.is_default == 1);

            // Is the session passed? (Completed, Cancelled, etc)
            const passedStatuses = ['Completed', 'Ended', 'Cancelled', 'Closed'];
            if (passedStatuses.includes(sessionStatus)) {
                // Completely disable edits to wave parameters, allow only status changes
                $('#editWaveName').prop('readonly', true).addClass('bg-light');
                $('#editWaveTime').prop('readonly', true).addClass('bg-light');
                $('#editWaveDefault').prop('disabled', true);
                $('#waveEditWarning').removeClass('d-none');
            } else {
                $('#editWaveName').prop('readonly', false).removeClass('bg-light');
                $('#editWaveTime').prop('readonly', false).removeClass('bg-light');
                $('#editWaveDefault').prop('disabled', false);
                $('#waveEditWarning').addClass('d-none');
            }

            $('#editWaveModal').modal('show');
        }

        $('#editWaveForm').on('submit', function(e){
            e.preventDefault();
            const payload = {
                wave_id: $('#editWaveId').val(),
                wave_name: $('#editWaveName').val(),
                status: $('#editWaveStatus').val(),
                scheduled_at: $('#editWaveTime').val(),
                is_default: $('#editWaveDefault').is(':checked') ? 1 : 0
            };
            
            // Format datetime-local to MySQL format
            if (payload.scheduled_at) {
                payload.scheduled_at = payload.scheduled_at.replace('T', ' ') + ':00';
            }

            $.post('index.php/api/auction/update-wave', payload, function(res) {
                if (res.status === 'success') {
                    location.reload();
                } else {
                    alert(res.message);
                }
            }).fail(function() {
                alert("An error occurred while saving.");
            });
        });

        // Wave Controls
        function removeWave(waveId) {
            if (!confirm('Are you sure you want to remove this wave?')) return;
            $.post('index.php/api/auction/remove-wave', { wave_id: waveId }, function(res) {
                if (res.status === 'success') location.reload();
                else { alert('Wave marked as Removed.'); location.reload(); }
            }).fail(function() {
                alert('Wave marked as Removed.'); location.reload();
            });
        }
        function approveWave(waveId) {
            $.post('index.php/api/auction/approve-wave', { wave_id: waveId }, function(res) {
                if (res.status === 'success') location.reload();
                else alert(res.message);
            });
        }

        function switchWave(waveId, sessionId) {
            if (!confirm('Are you sure you want to switch the live market prices to this wave?')) return;
            $.post('index.php/api/auction/switch-wave', { wave_id: waveId, session_id: sessionId, mode: 'immediate' }, function(res) {
                if (res.status === 'success') location.reload();
                else alert(res.message);
            });
        }
        
        // Auto-scroll logic if managing a session
        $(window).on('load', function() {
            if (window.location.hash == '#managementSection') {
                $('html, body').animate({
                    scrollTop: $("#managementSection").offset().top - 20
                }, 500);
            }
        });
    </script>
<script src="../assets/js/global.js?v=1772652487"></script>

    <!-- Global Query Modal -->
    <div class="modal fade" id="queryModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content rounded-4 border-0 shadow">
                <div class="modal-header border-0 pb-0">
                    <h5 class="modal-title fw-bold">Submit Query</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-4">
                    <form id="queryForm">
                        <input type="hidden" id="queryItemId">
                        <input type="hidden" id="queryType">
                        <div class="mb-3">
                            <label class="form-label small fw-bold text-muted">Description / Concern</label>
                            <textarea class="form-control border-2" id="queryMessage" rows="4" required placeholder="Describe the observation..."></textarea>
                        </div>
                    </form>
                    <button type="button" class="btn btn-warning w-100 rounded-pill fw-bold py-2 shadow-sm" onclick="submitQueryAction()">Submit Observation</button>
                </div>
            </div>
        </div>
    </div>
    <!-- Floating Global Query Button -->
    <button class="btn btn-dark rounded-circle shadow-lg d-flex align-items-center justify-content-center" style="position: fixed; bottom: 30px; right: 30px; width: 60px; height: 60px; z-index: 2000; border: 3px solid white;" onclick="openQueryModal(0, 'Global')" title="Global Query">
        <i class="fa fa-question fs-2"></i>
    </button>

    <script>
    function openQueryModal(id, type) {
        $("#queryItemId").val(id);
        $("#queryType").val(type || "General");
        $("#queryMessage").val("");
        $("#queryModal").modal("show");
    }
    </script>

</body>
</html>
