<?php
/**
 * Wallet Controller
 * AreaBazaar PHP/MySQL REST API
 */

require_once '../core/Models/Customer.php';

class WalletController
{
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    /**
     * Get wallet balance
     */
    public function balance()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $data = sanitize($data);

        if (!isset($data['customer_id'])) {
            jsonResponse('error', "Missing customer ID");
        }

        $query = "SELECT balance, surveillance_flag FROM wallets WHERE customer_id = ? LIMIT 1";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(1, $data['customer_id']);
        $stmt->execute();
        $wallet = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($wallet) {
            jsonResponse('success', "Balance retrieved", $wallet);
        }
        else {
            jsonResponse('error', "Wallet not found");
        }
    }

    /**
     * Report a manual bank deposit
     */
    public function reportDeposit()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $data = sanitize($data);

        if (!isset($data['customer_id']) || !isset($data['amount'])) {
            jsonResponse('error', "Missing deposit data");
        }

        // Generate InvoiceRefIndex
        $refIndex = "AB-" . strtoupper(substr(md5(uniqid()), 0, 8));

        $query = "INSERT INTO payment_requests (user_id, amount, invoice_refindex, status) VALUES (?, ?, ?, 'Pending')";
        $stmt = $this->db->prepare($query);

        if ($stmt->execute([$data['customer_id'], $data['amount'], $refIndex])) {
            jsonResponse('success', "Deposit reported. Please use reference: $refIndex", ['ref' => $refIndex]);
        }
        else {
            jsonResponse('error', "Failed to record deposit report");
        }
    }
}
?>
