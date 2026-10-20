<?php
$file = 'c:\xampp\htdocs\areabazaar\public\admin_auctions.php';
$content = file_get_contents($file);

$old_html = <<<HTML
                <!-- Session Selector Card -->
                <div class="card p-4 mb-4">
                    <h5 class="fw-bold mb-3">All Auction Sessions</h5>
                    <div class="table-responsive">
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
                                <?php foreach (\$sessions as \$s): ?>
                                <tr class="<?php echo \$s['id'] == \$activeId ? 'table-primary-light' : ''; ?>">
                                    <td>
                                        <div class="fw-bold text-primary"><?php echo \$s['session_name']; ?></div>
                                        <div class="text-muted small">ID: #<?php echo \$s['id']; ?></div>
                                    </td>
                                    <td>
                                        <span class="badge bg-<?php echo getStatusColor(\$s['status']); ?> rounded-pill">
                                            <?php echo \$s['status']; ?>
                                        </span>
                                    </td>
                                    <td class="small"><?php echo \$s['start_time'] ?? 'Not Scheduled'; ?></td>
                                    <td class="text-end">
                                        <div class="btn-group">
                                            <?php if (\$s['status'] == 'Draft' || \$s['status'] == 'Ready'): ?>
                                                <button class="btn btn-sm btn-outline-success" onclick="controlSession(<?php echo \$s['id']; ?>, 'start')">Start</button>
                                            <?php
    elseif (\$s['status'] == 'Active'): ?>
                                                <button class="btn btn-sm btn-outline-warning" onclick="controlSession(<?php echo \$s['id']; ?>, 'pause')">Pause</button>
                                                <button class="btn btn-sm btn-outline-danger" onclick="controlSession(<?php echo \$s['id']; ?>, 'end')">End</button>
                                            <?php
    endif; ?>
                                            <a href="?manage_id=<?php echo \$s['id']; ?>" class="btn btn-sm btn-primary ms-2">Manage</a>
                                        </div>
                                    </td>
                                </tr>
                                <?php
endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>

                <?php if (\$currentSession): ?>
                <div class="row g-4 mb-5">
HTML;

$new_html = <<<HTML
                <div class="row mb-4 g-4 align-items-stretch">
                    <div class="col-lg-7">
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
                                        <?php foreach (\$sessions as \$s): ?>
                                        <tr class="<?php echo \$s['id'] == \$activeId ? 'table-primary-light active-interaction-row' : ''; ?>">
                                            <td>
                                                <div class="fw-bold text-primary"><?php echo \$s['session_name']; ?></div>
                                                <div class="text-muted small">ID: #<?php echo \$s['id']; ?></div>
                                            </td>
                                            <td>
                                                <span class="badge bg-<?php echo getStatusColor(\$s['status']); ?> rounded-pill">
                                                    <?php echo \$s['status']; ?>
                                                </span>
                                            </td>
                                            <td class="small"><?php echo \$s['start_time'] ?? 'Not Scheduled'; ?></td>
                                            <td class="text-end">
                                                <div class="btn-group">
                                                    <?php if (\$s['status'] == 'Draft' || \$s['status'] == 'Ready'): ?>
                                                        <button class="btn btn-sm btn-outline-success" onclick="controlSession(<?php echo \$s['id']; ?>, 'start')">Start</button>
                                                    <?php elseif (\$s['status'] == 'Active'): ?>
                                                        <button class="btn btn-sm btn-outline-warning" onclick="controlSession(<?php echo \$s['id']; ?>, 'pause')">Pause</button>
                                                        <button class="btn btn-sm btn-outline-danger" onclick="controlSession(<?php echo \$s['id']; ?>, 'end')">End</button>
                                                    <?php endif; ?>
                                                    <a href="?manage_id=<?php echo \$s['id']; ?>#managementSection" class="btn btn-sm btn-primary ms-2">Manage</a>
                                                </div>
                                            </td>
                                        </tr>
                                        <?php endforeach; ?>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                
                    <div class="col-lg-5">
                        <!-- Waves Manager Card -->
                        <div class="card p-4 h-100 mb-0">
                            <h5 class="fw-bold mb-3"><i class="fa fa-water text-info me-2"></i> Session Waves</h5>
                            <?php if (\$currentSession): ?>
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
                                            <?php if(empty(\$waves)): ?>
                                            <tr><td colspan="3" class="text-center py-4 text-muted small">No waves associated with this session.</td></tr>
                                            <?php else: ?>
                                            <?php foreach (\$waves as \$w): ?>
                                            <tr>
                                                <td>
                                                    <div class="fw-bold text-dark">
                                                        <?php echo \$w['wave_name']; ?> 
                                                        <?php if (\$w['is_default']): ?>
                                                            <span class="badge bg-primary ms-1" style="font-size: 0.65em;">DEFAULT</span>
                                                        <?php endif; ?>
                                                    </div>
                                                    <div class="text-muted small">Switch: <?php echo \$w['scheduled_at'] ? date('H:i', strtotime(\$w['scheduled_at'])) : 'Manual'; ?></div>
                                                </td>
                                                <td>
                                                    <span class="badge bg-<?php echo \$w['status'] == 'Active' ? 'success' : (\$w['status'] == 'Replaced' ? 'secondary' : 'warning'); ?> rounded-pill">
                                                        <?php echo \$w['status']; ?>
                                                    </span>
                                                    <br>
                                                    <?php if (\$w['senior_admin_approval']): ?>
                                                        <span class="badge bg-success mt-1" style="font-size:0.6rem;"><i class="fa fa-check"></i> SA Approved</span>
                                                    <?php else: ?>
                                                        <span class="badge bg-danger mt-1" style="font-size:0.6rem;">Needs Approval</span>
                                                    <?php endif; ?>
                                                </td>
                                                <td class="text-end">
                                                    <div class="btn-group">
                                                        <?php if (!\$w['senior_admin_approval'] && \$isSeniorAdmin): ?>
                                                            <button class="btn btn-sm btn-success px-2" onclick="approveWave(<?php echo \$w['id']; ?>)" title="Approve Wave"><i class="fa fa-stamp"></i></button>
                                                        <?php endif; ?>
                                                        <?php if (\$w['status'] != 'Active' && \$w['senior_admin_approval']): ?>
                                                            <button class="btn btn-sm btn-outline-dark px-2 border" onclick="switchWave(<?php echo \$w['id']; ?>, <?php echo \$currentSession['id']; ?>)" title="Switch to this Wave Now">
                                                                <i class="fa fa-play text-primary"></i>
                                                            </button>
                                                        <?php endif; ?>
                                                    </div>
                                                </td>
                                            </tr>
                                            <?php endforeach; ?>
                                            <?php endif; ?>
                                        </tbody>
                                    </table>
                                </div>
                            <?php else: ?>
                            <div class="text-center py-5 text-muted">
                                <i class="fa fa-mouse-pointer fs-1 mb-3"></i>
                                <p>Select a session to view waves.</p>
                            </div>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>

                <?php if (\$currentSession): ?>
                <div class="row g-4 mb-5" id="managementSection">
HTML;

$content = str_replace($old_html, $new_html, $content);
file_put_contents($file, $content);
echo "UI updated.\n";
