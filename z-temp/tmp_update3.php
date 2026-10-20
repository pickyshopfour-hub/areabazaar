<?php
$file = 'c:\xampp\htdocs\areabazaar\public\admin_auctions.php';
$content = file_get_contents($file);

$old_js = <<<HTML
        function submitAssign() {
            const id = $('#assignOrderId').val();
            const val = $('#assignValue').val();
            if (!val) return alert("Please enter assignee ID");
            executeOrderAction(id, 'Assign', val);
            $('#assignModal').modal('hide');
        }
    </script>
HTML;

$new_js = <<<HTML
        function submitAssign() {
            const id = $('#assignOrderId').val();
            const val = $('#assignValue').val();
            if (!val) return alert("Please enter assignee ID");
            executeOrderAction(id, 'Assign', val);
            $('#assignModal').modal('hide');
        }

        // Wave Controls
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
HTML;

$content = str_replace($old_js, $new_js, $content);
file_put_contents($file, $content);
echo "JS updated.\n";
