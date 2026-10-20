<?php
/**
 * Finance Admin Controller
 * AreaBazaar PHP/MySQL REST API
 */

require_once __DIR__ . '/../Models/BankReport.php';
require_once __DIR__ . '/../Models/PaymentReport.php';
require_once __DIR__ . '/../Models/PaymentRequest.php';
require_once __DIR__ . '/../Models/Wallet.php';

class FinanceAdminController
{
    private $db;
    private $bankModel;
    private $reportModel;
    private $requestModel;
    private $walletModel;

    public function __construct($db)
    {
        $this->db = $db;
        $this->bankModel = new BankReport($db);
        $this->reportModel = new PaymentReport($db);
        $this->requestModel = new PaymentRequest($db);
        $this->walletModel = new Wallet($db);
    }

    // --- BANK REPORTS ---
    public function listBankReports()
    {
        $stmt = $this->db->query("SELECT * FROM bank_reports ORDER BY time_recorded DESC LIMIT 500");
        return jsonResponse('success', 'Bank reports fetched', $stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    public function syncBankReports()
    {
        // For manual sync trigger from admin dashboard
        // The Google Apps Script URL
        $scriptUrl = "https://script.google.com/macros/s/AKfycbzxxxxxxx/exec?action=extract";
        // To be safe, we just make a GET request to trigger the GAS, which then pushes back via webhook
        // We'll return a simulated success for now, or use cURL if needed.

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $scriptUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode == 200 || $httpCode == 302 || $response) {
            return jsonResponse('success', 'Sync triggered. Data is being processed in the background.');
        }

        return jsonResponse('error', 'Failed to trigger sync');
    }

    // --- PAYMENT REPORTS (Customer) ---
    public function listCustomerPaymentReports()
    {
        $stmt = $this->db->query("SELECT * FROM payment_reports WHERE submitter = 'customer' ORDER BY time_reported DESC");
        return jsonResponse('success', 'Fetched', $stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    // --- PAYMENT REQUESTS ---
    public function listPaymentRequests()
    {
        $stmt = $this->db->query("SELECT * FROM payment_requests ORDER BY time_created DESC");
        return jsonResponse('success', 'Fetched', $stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    // --- AGENT REMITTANCES (FRM) ---
    public function listAgentPaymentReports()
    {
        $stmt = $this->db->query("SELECT * FROM payment_reports WHERE submitter = 'agent' ORDER BY time_reported DESC");
        return jsonResponse('success', 'Fetched', $stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    public function verifyPaymentReport()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        if (empty($data['id']) || empty($data['action']))
            return jsonResponse('error', 'Invalid data');

        $reportId = $data['id'];
        $action = $data['action']; // 'Matched', 'Flagged'
        $stmt = $this->db->prepare("SELECT * FROM payment_reports WHERE id = :id");
        $stmt->execute([':id' => $reportId]);
        $report = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$report)
            return jsonResponse('error', 'Not found');

        $this->reportModel->updateStatus($report['invoice_refindex'], $action);

        if (!empty($data['bank_match_id']) && ($action === 'Matched' || $action === 'verified')) {
            $this->bankModel->updateStatus($data['bank_match_id'], 'Reconciled');
        }

        if ($action === 'Matched' || $action === 'verified') {
            $this->requestModel->updateStatus($report['invoice_refindex'], 'Resolved');
            $request = $this->requestModel->findByRef($report['invoice_refindex']);
            if ($request) {
                $this->walletModel->creditWallet($request['user_id'], $report['amount_reported']);
            }
        }

        return jsonResponse('success', "Report $action");
    }

    // --- SENIOR ADMIN OVERSIGHT ---
    public function getOversightFinance()
    {
        $limitStmt = $this->db->query("SELECT setting_value FROM settings WHERE setting_key = 'deposit_auto_limit'");
        $limitRow = $limitStmt->fetch(PDO::FETCH_ASSOC);
        $limit = $limitRow ? floatval($limitRow['setting_value']) : 1000000;

        $stmt = $this->db->query("SELECT * FROM payment_reports WHERE status = 'AwaitingAdminApproval' ORDER BY id DESC");
        $awaitingApproval = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $stmt = $this->db->prepare("SELECT * FROM bank_reports WHERE (status = 'orphaned' OR status = 'amount-mismatch') AND amount > :limit ORDER BY id DESC");
        $stmt->execute([':limit' => $limit]);
        $highValueOrphans = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return jsonResponse('success', 'Oversight Finance Fetched', [
            'awaitingApproval' => $awaitingApproval,
            'highValueOrphans' => $highValueOrphans,
            'limit' => $limit
        ]);
    }

    public function getPartnerRemittances()
    {
        // We will fetch both SBA and ZBDp using their partner type
        $stmt = $this->db->query("SELECT pr.*, p.name as partner_name, p.partner_type 
                                  FROM partner_remittances pr 
                                  JOIN partners p ON pr.partner_id = p.id 
                                  ORDER BY pr.id DESC limit 200");
        return jsonResponse('success', 'Partner Remittances Fetched', $stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    public function processRemittanceAction()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        if (empty($data['id']) || empty($data['action']))
            return jsonResponse('error', 'Invalid parameters');

        $id = $data['id'];
        $action = $data['action']; // 'Sent' (approved/paid), 'Cancelled'

        $stmt = $this->db->prepare("UPDATE partner_remittances SET status = ? WHERE id = ?");
        $stmt->execute([$action, $id]);

        return jsonResponse('success', "Remittance $action Processed");
    }
}
