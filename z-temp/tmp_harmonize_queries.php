<?php
$dir = 'c:\xampp\htdocs\areabazaar\public';
$files = glob("$dir/*.php");

foreach ($files as $file) {
    $content = file_get_contents($file);
    if (strpos($content, 'id="queryModal"') === false)
        continue;

    // 1. Harmonize Modal Inputs (change queryContext to queryType)
    $content = str_replace('id="queryContext"', 'id="queryType"', $content);
    $content = str_replace('id="query_context"', 'id="queryType"', $content);

    // 2. Harmonize openQueryModal function
    $pattern_open = '/function\s+openQueryModal\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)\s*\{[^\}]+\}/s';
    $replacement_open = 'function openQueryModal($1, $2) {
        $("#queryItemId").val($1);
        $("#queryType").val($2);
        $("#queryMessage").val("");
        $("#queryModal").modal("show");
    }';
    $content = preg_replace($pattern_open, $replacement_open, $content);

    // 3. Harmonize submitQueryAction function
    $new_submit = 'function submitQueryAction() {
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

    $pattern_submit = '/function\s+submitQueryAction\s*\(\)\s*\{[^\}]+\}/s';
    if (preg_match($pattern_submit, $content)) {
        $content = preg_replace($pattern_submit, $new_submit, $content);
    }
    else {
        // If not found as a standalone function, maybe append to script block
        if (strpos($content, '</script>') !== false) {
            $content = str_replace('</script>', $new_submit . "\n</script>", $content);
        }
    }

    file_put_contents($file, $content);
    echo "Fixed Query logic in: " . basename($file) . "\n";
}

echo "All harmonized.";
?>
