<?php
/**
 * NotificationService
 * Handles delivery of notifications via Email and/or SMS
 * Email and SMS are gated by global_settings flags.
 * In-app notifications are handled separately by QueryNotificationModel.
 */
class NotificationService
{
    /**
     * Send an email notification (gated by notif_email_enabled setting)
     *
     * @param string $to      Recipient email address
     * @param string $subject Email subject
     * @param string $body    Email body (HTML or plain text)
     * @param PDO    $db      DB connection for reading settings
     */
    public static function sendEmail($to, $subject, $body, $db = null)
    {
        if ($db) {
            $stmt = $db->prepare("SELECT setting_value FROM global_settings WHERE setting_key = ? LIMIT 1");
            $stmt->execute(['notif_email_enabled']);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$row || $row['setting_value'] != '1')
                return; // Feature disabled
        }

        // Fetch sender address
        $fromAddr = 'no-reply@areabazaar.com';
        if ($db) {
            $stmt->execute(['notif_email_from']);
            $fRow = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($fRow)
                $fromAddr = $fRow['setting_value'];
        }

        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "Content-type: text/html; charset=UTF-8\r\n";
        $headers .= "From: AreaBazaar <{$fromAddr}>\r\n";

        $result = @mail($to, $subject, $body, $headers);
        if (!$result) {
            error_log("NotificationService::sendEmail failed to: {$to}");
        }
    }

    /**
     * Send an SMS via bulk gateway (gated by notif_sms_enabled setting)
     *
     * @param string $phone   Recipient phone number (international format)
     * @param string $message SMS message text
     * @param PDO    $db      DB connection for reading settings
     */
    public static function sendSms($phone, $message, $db = null)
    {
        if (!$db)
            return;

        $stmt = $db->prepare("SELECT setting_value FROM global_settings WHERE setting_key = ? LIMIT 1");

        $stmt->execute(['notif_sms_enabled']);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row || $row['setting_value'] != '1')
            return; // Feature disabled

        $stmt->execute(['notif_sms_gateway_url']);
        $gatewayRow = $stmt->fetch(PDO::FETCH_ASSOC);
        $gatewayUrl = $gatewayRow ? $gatewayRow['setting_value'] : '';

        $stmt->execute(['notif_sms_api_key']);
        $keyRow = $stmt->fetch(PDO::FETCH_ASSOC);
        $apiKey = $keyRow ? $keyRow['setting_value'] : '';

        $stmt->execute(['notif_sms_sender_id']);
        $senderRow = $stmt->fetch(PDO::FETCH_ASSOC);
        $senderId = $senderRow ? $senderRow['setting_value'] : 'AreaBazaar';

        if (empty($gatewayUrl) || empty($apiKey)) {
            error_log("NotificationService::sendSms — gateway not configured");
            return;
        }

        // Generic HTTP POST to SMS gateway
        $payload = json_encode([
            'to' => $phone,
            'message' => $message,
            'sender_id' => $senderId,
            'api_key' => $apiKey,
        ]);

        $ch = curl_init($gatewayUrl);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode < 200 || $httpCode >= 300) {
            error_log("NotificationService::sendSms failed (HTTP {$httpCode}) to: {$phone}. Response: {$response}");
        }
    }
}
?>
