<?php
$dir = 'c:\xampp\htdocs\areabazaar\public';
$files = glob("$dir/*.php");

foreach ($files as $file) {
    if (strpos($file, 'dashboard') === false && strpos($file, 'admin') === false && strpos($file, 'whm') === false) {
        continue;
    }

    $content = file_get_contents($file);
    if (strpos($content, 'submitQueryAction') === false)
        continue;

    // Pattern to match the corrupted submitQueryAction
    // It starts with 'function submitQueryAction() {' and ends with a block that has double closures or similar
    // We'll replace the entire function with a clean version.

    $clean_func = 'function submitQueryAction() {
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
                location.reload();
            } else {
                alert(res.message || "Failed to submit query.");
            }
        }).fail(function() {
            alert("Failed to contact server.");
        });
    }';

    // This regex matches the function name and then searches for the next 'function' or '</script>' to define boundaries
    // Actually, let's just use a broad match for the corrupted block.
    // The corruption seems to be: ... }).fail(function() { ... }); }, function(res) { ... }); }

    $regex = '/function\s+submitQueryAction\s*\(\)\s*\{.*?\}(?=\s*(function|\<\/script\>))/s';

    // If the regex is too complex, we can use string positions
    $start_pos = strpos($content, 'function submitQueryAction');
    if ($start_pos !== false) {
        $search_content = substr($content, $start_pos);
        // Find the next function or the end of script
        $end_pos = strpos($search_content, 'function ', 30);
        if ($end_pos === false) {
            $end_pos = strpos($search_content, '</script>');
        }

        if ($end_pos !== false) {
            $old_func = substr($search_content, 0, $end_pos);
            $content = str_replace($old_func, $clean_func . "\n\n    ", $content);
            file_put_contents($file, $content);
            echo "Fixed: " . basename($file) . "\n";
        }
    }
}

echo "Cleanup complete.";
?>
