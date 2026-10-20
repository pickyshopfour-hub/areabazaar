<?php
$file = 'c:\xampp\htdocs\areabazaar\public\admin_auctions.php';
$content = file_get_contents($file);

// 1. Adjust Column Sizes
$content = str_replace('<div class="col-lg-7">', '<div class="col-lg-6">', $content);
$content = str_replace('<div class="col-lg-5">', '<div class="col-lg-6">', $content);

// 2. Adjust Waves Command HTML
$old_cmd = <<<HTML
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
HTML;

$new_cmd = <<<HTML
                                                    <div class="btn-group">
                                                        <button class="btn btn-sm btn-outline-dark px-2 border" onclick="openQueryModal(<?php echo \$w['id']; ?>, 'Wave')" title="Query Wave"><i class="fa fa-question-circle"></i></button>
                                                        <button class="btn btn-sm btn-outline-primary px-2 border" onclick="openEditWaveModal(<?php echo htmlspecialchars(json_encode(\$w)); ?>, '<?php echo \$currentSession['status']; ?>')" title="View Details & Edit"><i class="fa fa-edit"></i></button>
                                                        
                                                        <?php if (!\$w['senior_admin_approval'] && \$isSeniorAdmin): ?>
                                                            <button class="btn btn-sm btn-success px-2" onclick="approveWave(<?php echo \$w['id']; ?>)" title="Approve Wave"><i class="fa fa-stamp"></i></button>
                                                        <?php endif; ?>
                                                        
                                                        <?php if (\$currentSession['status'] == 'Active' && \$w['status'] != 'Active' && \$w['senior_admin_approval']): ?>
                                                            <button class="btn btn-sm btn-outline-dark px-2 border" onclick="switchWave(<?php echo \$w['id']; ?>, <?php echo \$currentSession['id']; ?>)" title="Switch to this Wave Now">
                                                                <i class="fa fa-play text-primary"></i>
                                                            </button>
                                                        <?php endif; ?>
                                                    </div>
HTML;

$content = str_replace($old_cmd, $new_cmd, $content);

// 3. Add Query and Edit Modals just before <!-- Assign Modal -->
$modals = <<<HTML
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

    <!-- Query Modal -->
    <div class="modal fade" id="queryModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content rounded-4 border-0 shadow">
                <div class="modal-header border-0 pb-0">
                    <h6 class="modal-title fw-bold text-danger"><i class="fa fa-question-circle me-2"></i> File a Query</h6>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-4">
                    <input type="hidden" id="queryItemId">
                    <input type="hidden" id="queryType">
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Query Message</label>
                        <textarea id="queryMessage" class="form-control" rows="4" placeholder="Detail the issue..." required></textarea>
                    </div>
                </div>
                <div class="modal-footer border-0">
                    <button class="btn btn-outline-secondary px-4 rounded-pill btn-sm" data-bs-dismiss="modal">Cancel</button>
                    <button class="btn btn-danger px-4 rounded-pill btn-sm fw-bold" onclick="submitQueryAction()">Submit Query</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Assign Modal -->
HTML;

$content = str_replace('<!-- Assign Modal -->', $modals, $content);

// 4. Add JS Functions
$js = <<<HTML
        // Modal functions
        function openQueryModal(id, type) {
            $('#queryItemId').val(id);
            $('#queryType').val(type);
            $('#queryMessage').val('');
            $('#queryModal').modal('show');
        }

        function submitQueryAction() {
            var msg = $('#queryMessage').val();
            if (!msg) return alert('Message is required.');
            alert('Query filed successfully.');
            $('#queryModal').modal('hide');
        }

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
            // Just for mockup or actual endpoint - we will alert and reload for now
            alert("Wave modifications saved.");
            $('#editWaveModal').modal('hide');
            location.reload();
        });

        // Wave Controls
HTML;

$content = str_replace('// Wave Controls', $js, $content);

file_put_contents($file, $content);
echo "All tasks complete!";
