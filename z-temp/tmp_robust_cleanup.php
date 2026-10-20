<?php
$dir = 'c:\xampp\htdocs\areabazaar\public';
$files = glob("$dir/*.php");

foreach ($files as $file) {
    if (strpos($file, 'dashboard') === false && strpos($file, 'admin') === false && strpos($file, 'whm') === false) {
        continue;
    }

    $content = file_get_contents($file);

    // 1. Remove ANY JS function with these names, but keep it clean
    // We'll use a regex that matches until the last brace of the function
    // For simplicity, let's just use string replace on common patterns if possible, 
    // but regex is often required

    // This removes the corrupted block entirely
    $content = preg_replace('/function\s+submitQueryAction\s*\(.*?\)\s*\{.*?\}(?=\s*(function|<\/script>))/s', '', $content);
    $content = preg_replace('/function\s+openQueryModal\s*\(.*?\)\s*\{.*?\}(?=\s*(function|<\/script>))/s', '', $content);

    // 2. Clear content from script tags with src
    $content = preg_replace('/(<script\s+[^>]*src="[^"]+"[^>]*>).*?<\/script>/is', '$1</script>', $content);

    // 3. Handle admin_auctions.php specifically
    if (basename($file) === 'admin_auctions.php') {
        // Add Query button to Inventory
        if (strpos($content, 'Query Item') === false) {
            $content = str_replace(
                '<button class="btn btn-sm btn-outline-dark" onclick="openItemCommand(${item.id}, \'addStock\')">',
                '<button class="btn btn-sm btn-outline-dark" onclick="openQueryModal(${item.id}, \'Inventory\')" title="Query Item"><i class="fa fa-question-circle"></i></button>' . "\n" . '                                    <button class="btn btn-sm btn-outline-dark" onclick="openItemCommand(${item.id}, \'addStock\')">',
                $content
            );
        }

        // Add Query button to Orders
        if (strpos($content, 'Query Order') === false) {
            $content = str_replace(
                '<button class="btn btn-xs btn-success" onclick="executeOrderAction(${order.id}, \'Approve\')">Approve</button>',
                '<button class="btn btn-xs btn-outline-dark me-1" onclick="openQueryModal(${order.id}, \'Order\')" title="Query Order"><i class="fa fa-question"></i></button>' . "\n" . '                                    <button class="btn btn-xs btn-success" onclick="executeOrderAction(${order.id}, \'Approve\')">Approve</button>',
                $content
            );
        }

        // Guard the forEach
        $content = str_replace('res.data.forEach(item => {', 'if(res.status === "success" && res.data) { res.data.forEach(item => {', $content);
        $content = str_replace('res.data.forEach(order => {', 'if(res.status === "success" && res.data) { res.data.forEach(order => {', $content);
        // Add closing braces (approximate, since we replaced above)
        // This is tricky, let's just check if we added it
        if (strpos($content, 'if(res.status === "success" && res.data) { res.data.forEach(') !== false) {
            $content = str_replace("\n" . '                $(\'#auctionItemsBody\')', '                } ' . "\n" . '                $(\'#auctionItemsBody\')', $content);
            $content = str_replace("\n" . '                $(\'#auctionOrdersBody\')', '                } ' . "\n" . '                $(\'#auctionOrdersBody\')', $content);
        }
    }

    // 4. Final Injection of clean functions
    $clean_js = '
    function openQueryModal(id, type) {
        $("#queryItemId").val(id);
        $("#queryType").val(type);
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
                location.reload();
            } else {
                alert(res.message || "Failed to submit query.");
            }
        }).fail(function() {
            alert("Failed to contact server.");
        });
    }';

    if (strpos($content, 'submitQueryAction') === false) {
        $content = str_replace('</body>', "<script>\n" . $clean_js . "\n</script>\n</body>", $content);
    }

    file_put_contents($file, $content);
    echo "Fixed: " . basename($file) . "\n";
}

echo "Cleanup complete.";
?>
