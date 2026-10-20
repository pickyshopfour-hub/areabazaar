<?php
$dir = 'c:\xampp\htdocs\areabazaar\public';
$files = glob("$dir/*.php");

foreach ($files as $file) {
    if (strpos($file, 'dashboard') !== false || strpos($file, 'admin') !== false || strpos($file, 'whm') !== false) {
        $content = file_get_contents($file);

        // This regex specifically searches for the standard submitQueryAction definition that currently just has alerts
        $pattern = '/function\s+submitQueryAction\s*\(\)\s*\{[^\}]+\}/s';

        $new_func = <<<JS
function submitQueryAction() {
        var id = $('#queryItemId').val();
        var type = $('#queryType').val(); // Type might be optional or hidden input
        var msg = $('#queryMessage').val();
        
        if (!msg) return alert('Message is required.');
        if (!id) id = 0;
        if (!type) type = 'General';

        $.post('index.php/api/queries/add', {
            subject_id: id,
            subject_type: type,
            note: msg,
            author_id: 1 // Placeholder for now, typically pulled from session
        }, function(res) {
            if (res.status === 'success') {
                alert('Query recorded successfully.');
                $('#queryModal').modal('hide');
                location.reload();
            } else {
                alert(res.message || 'Failed to submit query.');
            }
        }).fail(function() {
            alert('Failed to contact server.');
        });
    }
JS;

        if (strpos($content, 'submitQueryAction()') !== false) {
            // Find boundaries of the function block to replace
            $content = preg_replace($pattern, $new_func, $content);
            file_put_contents($file, $content);
            echo "Updated: " . basename($file) . "\n";
        }
    }
}
echo "Done.";
?>
