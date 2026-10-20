<?php
$dir = 'c:\xampp\htdocs\areabazaar\public';
$files = glob("$dir/*.php");

$clean_js = '
    function openQueryModal(id, type) {
        $("#queryItemId").val(id);
        $("#queryType").val(type || "General");
        $("#queryMessage").val("");
        $("#queryModal").modal("show");
    }

    function submitQueryAction() {
        var id = $("#queryItemId").val();
        var type = $("#queryType").val();
        var msg = $("#queryMessage").val();
        
        if (!msg) return alert("Message is required.");
        
        $.post("index.php/api/queries/add", {
            subject_id: id || 0,
            subject_type: type || "General",
            note: msg
        }, function(res) {
            if (res.status === "success") {
                alert("Query recorded successfully.");
                $("#queryModal").modal("hide");
                // location.reload(); // Optional
            } else {
                alert(res.message || "Failed to submit query.");
            }
        }).fail(function() {
            alert("Failed to contact server.");
        });
    }';

$modal_html = '
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
    <button class="btn btn-dark rounded-circle shadow-lg d-flex align-items-center justify-content-center" style="position: fixed; bottom: 30px; right: 30px; width: 60px; height: 60px; z-index: 2000; border: 3px solid white;" onclick="openQueryModal(0, \'Global\')" title="Global Query">
        <i class="fa fa-question fs-2"></i>
    </button>
';

foreach ($files as $file) {
    if (strpos($file, 'dashboard') === false && strpos($file, 'admin') === false && strpos($file, 'whm') === false) {
        continue;
    }

    $content = file_get_contents($file);

    // 1. Remove all old script-based definitions of submitQueryAction and openQueryModal
    // This removes them from SCRIPT blocks
    $content = preg_replace('/function\s+submitQueryAction\s*\(.*?\)\s*\{.*?\}\s*(?=\s*(function|<\/script>))/s', '', $content);
    $content = preg_replace('/function\s+openQueryModal\s*\(.*?\)\s*\{.*?\}\s*(?=\s*(function|<\/script>))/s', '', $content);

    // 2. Clear corrupted script src content
    $content = preg_replace('/(<script\s+[^>]*src="[^"]+"[^>]*>).*?<\/script>/is', '$1</script>', $content);

    // 3. Remove existing queryModal if it has another ID or is present
    // We look for any modal with id="queryModal" and remove it to replace with our clean one
    $content = preg_replace('/<div[^>]*id="queryModal".*?<\/div>(\s*<\/div>){2,}/s', '', $content);

    // 4. Specifically for admin_auctions.php, add icons back
    if (basename($file) === 'admin_auctions.php') {
        // Fix the match to include the <i> tag
        if (strpos($content, 'Query Item') === false) {
            $target = '<button class="btn btn-sm btn-outline-dark" onclick="openItemCommand(${item.id}, \'addStock\')">';
            $replacement = '<button class="btn btn-sm btn-outline-dark" onclick="openQueryModal(${item.id}, \'Inventory\')" title="Query Item"><i class="fa fa-question-circle"></i></button>' . "\n" . '                                    ' . $target;
            $content = str_replace($target, $replacement, $content);
        }

        if (strpos($content, 'Query Order') === false) {
            $target = '<button class="btn btn-xs btn-success" onclick="executeOrderAction(${order.id}, \'Approve\')">Approve</button>';
            $replacement = '<button class="btn btn-xs btn-outline-dark me-1" onclick="openQueryModal(${order.id}, \'Order\')" title="Query Order"><i class="fa fa-question"></i></button>' . "\n" . '                                    ' . $target;
            $content = str_replace($target, $replacement, $content);
        }
    }

    // 5. Injects the HTML and JS before </body>
    // We remove any existing floating button too first (approx check)
    $content = str_replace('<!-- Floating Global Query Button -->', '', $content);
    $content = str_replace('<!-- Global Query Modal -->', '', $content);

    // Inject New Modal & Button
    $content = str_replace('</body>', $modal_html . "\n<script>\n" . $clean_js . "\n</script>\n" . '</body>', $content);

    file_put_contents($file, $content);
    echo "Fixed: " . basename($file) . "\n";
}

echo "Final check for script tag corruption...\n";

// Secondary pass to ensure no nested/double script tags or corrupted src
foreach ($files as $file) {
    if (strpos($file, 'dashboard') === false && strpos($file, 'admin') === false && strpos($file, 'whm') === false) {
        continue;
    }
    $content = file_get_contents($file);
    // Remove duplicate scripts if injected multiple times by error
    $content = str_replace("<script>\n<script>\n", "<script>\n", $content);
    $content = str_replace("</script>\n</script>\n", "</script>\n", $content);
    file_put_contents($file, $content);
}

echo "Cleanup complete.";
?>
