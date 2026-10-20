<?php
/**
 * Agent (FRM) Controller
 * AreaBazaar PHP/MySQL REST API
 */

require_once __DIR__ . '/../Models/PaymentReport.php';

class AgentController
{
    private $db;
    private $reportModel;

    public function __construct($db)
    {
        $this->db = $db;
        $this->reportModel = new PaymentReport($db);
    }

    public function listCustomers()
    {
        // For now, simulate authenticated FRM using $_GET['agent_id'] or similar session var.
        $agentRef = $_GET['agent_ref'] ?? 'FRM-001';
        $stmt = $this->db->prepare("SELECT id, name, phone_number, location_area_id, time_created FROM customers WHERE associated_ref_code = :ref");
        $stmt->execute([':ref' => $agentRef]);
        return jsonResponse('success', 'Customers listed', $stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    public function listPayments()
    {
        $agentId = $_GET['agent_id'] ?? 1; // Default to 1 for demo
        $stmt = $this->db->prepare("SELECT id, invoice_refindex, amount_reported, time_reported, status, receipt_path FROM payment_reports WHERE submitter = 'agent' AND submitter_id = :agent_id ORDER BY time_reported DESC LIMIT 30");
        $stmt->execute([':agent_id' => $agentId]);
        return jsonResponse('success', 'Payments listed', $stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    public function reportPayment()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        if (empty($data['invoice_refindex']) || empty($data['amount_reported'])) {
            return jsonResponse('error', 'Missing data');
        }

        // report as 'agent', status 'unremitted'
        $insertData = [
            'invoice_refindex' => $data['invoice_refindex'],
            'sender_name' => $data['sender_name'] ?? 'Agent Payment',
            'amount_reported' => $data['amount_reported'],
            'payment_date' => $data['payment_date'] ?? date('Y-m-d H:i:s'),
            'status' => 'unremitted',
            'submitter' => 'agent',
            'submitter_id' => $data['agent_id'] ?? 1
        ];

        $this->reportModel->submitReport($insertData);
        return jsonResponse('success', 'Customer payment reported successfully');
    }

    public function reportRemittance()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        if (empty($data['invoices']) || empty($data['bank_ref']) || empty($data['total_amount'])) {
            return jsonResponse('error', 'Incomplete remittance data');
        }

        $calcTotal = 0;
        foreach ($data['invoices'] as $inv) {
            $calcTotal += floatval($inv['amount']);
        }

        if (abs($calcTotal - floatval($data['total_amount'])) > 0.01) {
            return jsonResponse('error', 'Total remitted amount does not balance with included invoices');
        }

        $agentId = $data['agent_id'] ?? 1;

        foreach ($data['invoices'] as $inv) {
            $stmt = $this->db->prepare("UPDATE payment_reports SET status = 'Pending', receipt_path = :ref WHERE invoice_refindex = :inv AND status = 'unremitted' AND submitter_id = :agent_id");
            $stmt->execute([':ref' => $data['bank_ref'], ':inv' => $inv['ref'], ':agent_id' => $agentId]);
        }

        return jsonResponse('success', 'Remittance reported successfully. Bank sync pending.');
    }
}
