/**
 * Auction Management Javascript
 * AreaBazaar Admin Control
 */

function controlSession(id, action) {
    if (!confirm(`Are you sure you want to ${action} this session?`)) return;

    fetch(`../api/auction/${action}-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: id })
    })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                location.reload();
            } else {
                alert('Error: ' + data.message);
            }
        });
}

/**
 * Open PrepCheck Report from Lookup (GS Archive)
 */
function openPrepCheckReport() {
    const lookup = document.getElementById('report_lookup_id').value;
    if (!lookup) return alert('Enter Session ID or Date');

    // In real life, we'd fetch the URL from the DB based on this lookup
    // For now, we simulate finding the specific PrepCheck report link
    alert('Looking up PrepCheck Report for: ' + lookup + '\n(Simulated: Opening Google Drive Archive)');
    window.open('https://drive.google.com/drive/folders/PREP-CHECKS-FOLDER-ID', '_blank');
}

/**
 * Open Auth Gate for Verification
 */
function openAuthVerify(type) {
    document.getElementById('verifyTypeLabel').innerText = type;
    document.getElementById('verify_check_type').value = type;
    const modal = new bootstrap.Modal(document.getElementById('authVerifyModal'));
    modal.show();
}

/**
 * Submit Admin Verification via Auth Gate
 */
function submitAdminVerify() {
    const form = document.getElementById('verifyForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Secure Verification Check
    if (data.admin_password !== 'admin123') { // Mocking validation
        return alert('Authentication Failed: Invalid Admin Password');
    }

    data.status = 'Verified';

    fetch('../api/auction/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(res => {
            alert(res.message);
            bootstrap.Modal.getInstance(document.getElementById('authVerifyModal')).hide();
            location.reload();
        });
}

/**
 * Final Clearance
 */
function openFinalClearanceModal() {
    const modal = new bootstrap.Modal(document.getElementById('finalClearanceModal'));
    modal.show();
}

function submitFinalClearance() {
    const note = document.getElementById('final_review_note').value;
    const sessionId = document.getElementById('manage_session_id').value;

    if (!note) return alert('Please provide a technical review note');

    const data = {
        session_id: sessionId,
        check_type: 'Overall',
        status: 'Verified',
        comments: note,
        admin_staff_id: 1 // Assuming logged in admin
    };

    fetch('../api/auction/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(res => {
            alert('Final Clearance Logged. Awaiting Senior Admin Approval for Session Start.');
            bootstrap.Modal.getInstance(document.getElementById('finalClearanceModal')).hide();
            location.reload();
        });
}
