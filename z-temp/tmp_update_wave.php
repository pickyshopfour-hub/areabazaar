<?php
$file_admin = 'c:\xampp\htdocs\areabazaar\public\admin_auctions.php';
$content_admin = file_get_contents($file_admin);

$old_submit = <<<JS
        $('#editWaveForm').on('submit', function(e){
            e.preventDefault();
            // Just for mockup or actual endpoint - we will alert and reload for now
            alert("Wave modifications saved.");
            $('#editWaveModal').modal('hide');
            location.reload();
        });
JS;

$new_submit = <<<JS
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
JS;

$content_admin = str_replace($old_submit, $new_submit, $content_admin);
file_put_contents($file_admin, $content_admin);


$file_controller = 'c:\xampp\htdocs\areabazaar\core\Controllers\AuctionController.php';
$content_controller = file_get_contents($file_controller);

$old_remove = <<<PHP
    public function removeWave(\$data)
    {
PHP;

$new_update_and_remove = <<<PHP
    public function updateWave(\$data)
    {
        \$waveId = \$data['wave_id'] ?? null;
        if (!\$waveId) return ["status" => "error", "message" => "Wave ID required"];
        
        \$waveName = \$data['wave_name'] ?? '';
        \$status = \$data['status'] ?? 'Pending';
        \$scheduledAt = !empty(\$data['scheduled_at']) ? \$data['scheduled_at'] : null;
        \$isDefault = isset(\$data['is_default']) ? (int)\$data['is_default'] : 0;
        
        if (\$isDefault) {
            // First we need to get the session_id for this wave
            \$stmt = \$this->sessionModel->getConn()->prepare("SELECT session_id FROM waves WHERE id = ?");
            \$stmt->execute([\$waveId]);
            \$wave = \$stmt->fetch(PDO::FETCH_ASSOC);
            if (\$wave) {
                // Unset all other defaults in that session
                \$stmtReset = \$this->sessionModel->getConn()->prepare("UPDATE waves SET is_default = 0 WHERE session_id = ?");
                \$stmtReset->execute([\$wave['session_id']]);
            }
        }
        
        // Build the basic update parameters
        // The frontend disables editing wave_name and scheduled_at if the session is passed,
        // so we check if they are provided/applicable. But we can just boldly update what the frontend gives.
        \$sql = "UPDATE waves SET is_default = :isDefault, status = :status";
        \$params = [
            ":isDefault" => \$isDefault,
            ":status" => \$status,
            ":id" => \$waveId
        ];

        // Only update these fields if they were modified/provided. (Readonly on frontend means they submit as is)
        if (\$waveName !== '') {
            \$sql .= ", wave_name = :waveName";
            \$params[':waveName'] = \$waveName;
        }
        
        if (\$scheduledAt !== null) {
            \$sql .= ", scheduled_at = :scheduledAt";
            \$params[':scheduledAt'] = \$scheduledAt;
        } else {
            \$sql .= ", scheduled_at = NULL";
        }

        \$sql .= " WHERE id = :id";
        
        \$stmt = \$this->sessionModel->getConn()->prepare(\$sql);
        if (\$stmt->execute(\$params)) {
             return ["status" => "success", "message" => "Wave updated successfully"];
        }
        
        return ["status" => "error", "message" => "Update Failed"];
    }

    public function removeWave(\$data)
    {
PHP;

if (strpos($content_controller, 'public function updateWave(') === false) {
    if (strpos($content_controller, $old_remove) !== false) {
        $content_controller = str_replace($old_remove, $new_update_and_remove, $content_controller);
        file_put_contents($file_controller, $content_controller);
        echo "Controller updated.\n";
    }
}


$file_index = 'c:\xampp\htdocs\areabazaar\public\index.php';
$content_index = file_get_contents($file_index);

$old_route = "\$router->post('api/auction/remove-wave', ['AuctionController', 'removeWave']);";
$new_route = "\$router->post('api/auction/update-wave', ['AuctionController', 'updateWave']);\n\$router->post('api/auction/remove-wave', ['AuctionController', 'removeWave']);";

if (strpos($content_index, 'update-wave') === false) {
    $content_index = str_replace($old_route, $new_route, $content_index);
    file_put_contents($file_index, $content_index);
    echo "Router updated.\n";
}

echo "All done.\n";
