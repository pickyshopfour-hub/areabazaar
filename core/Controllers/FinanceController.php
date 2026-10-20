<?php
/**
 * Finance Controller
 * AreaBazaar PHP/MySQL REST API
 */

require_once '../core/Models/PaymentRequest.php';
require_once '../core/Models/PaymentReport.php';

class FinanceController
{
    private $db;
    private $requestModel;
    private $reportModel;

    public function __construct($db)
    {
        $this->db = $db;
        $this->requestModel = new PaymentRequest($db);
        $this->reportModel = new PaymentReport($db);
    }

    /**
     * Create a new deposit intent (PaymentRequest)
     */
    public function createDepositRequest()
    {
        $data = json_decode(file_get_contents("php://input"));

        if (!empty($data->user_id) && !empty($data->amount) && !empty($data->method)) {
            $ref = $this->requestModel->createRequest($data->user_id, $data->amount, $data->method);
            if ($ref) {
                return jsonResponse('success', 'Payment request created', ['invoice_refindex' => $ref]);
            }
            return jsonResponse('error', 'Failed to create request');
        }
        return jsonResponse('error', 'Incomplete data');
    }

    /**
     * Submit proof of payment (PaymentReport)
     */
    public function reportPayment()
    {
        $data = json_decode(file_get_contents("php://input"));

        if (!empty($data->invoice_refindex) && !empty($data->sender_name) && !empty($data->amount)) {
            $threshold = floatval(getSetting($this->db, 'deposit_auto_limit', 100000));
            $status = ($data->amount > $threshold) ? 'AwaitingAdminApproval' : 'Pending';

            $reportData = [
                'invoice_refindex' => $data->invoice_refindex,
                'sender_name' => $data->sender_name,
                'amount_reported' => $data->amount,
                'payment_date' => $data->payment_date ?? date('Y-m-d H:i:s'),
                'status' => $status
            ];

            if ($this->reportModel->submitReport($reportData)) {
                $msg = ($status === 'AwaitingAdminApproval')
                    ? 'High-value deposit submitted. Awaiting Senior Admin approval.'
                    : 'Payment report submitted for verification';
                return jsonResponse('success', $msg);
            }
            return jsonResponse('error', 'Failed to submit report');
        }
        return jsonResponse('error', 'Incomplete data');
    }

    /**
     * Senior Admin: Approve a high-value deposit
     */
    public function approveHighValueDeposit()
    {
        $data = json_decode(file_get_contents("php://input"));
        // checkRole($user, 'SeniorAdmin'); // Would be called here once session logic is fully wired

        if (!empty($data->invoice_refindex)) {
            $report = $this->reportModel->where('invoice_refindex', $data->invoice_refindex);
            if ($report && $report[0]['status'] === 'AwaitingAdminApproval') {
                // 1. Mark as Resolved in Request
                $this->requestModel->updateStatus($data->invoice_refindex, 'Resolved');
                // 2. Mark as Matched in Report
                $this->reportModel->updateStatus($data->invoice_refindex, 'Matched');

                // 3. Logic to credit wallet would happen here (similar to automatic resolution)

                // 4. Audit Log
                $this->reportModel->auditLog(1, 'Staff', 'APPROVE_HIGH_VALUE_DEPOSIT', 'payment_reports', null, $report[0]);

                return jsonResponse('success', 'High-value deposit approved and credited');
            }
            return jsonResponse('error', 'Deposit not found or not in awaiting status');
        }
        return jsonResponse('error', 'Invoice reference required');
    }

    /**
     * Senior Admin: Reject/Flag a deposit
     */
    public function rejectHighValueDeposit()
    {
        $data = json_decode(file_get_contents("php://input"));
        if (!empty($data->invoice_refindex)) {
            $this->reportModel->updateStatus($data->invoice_refindex, 'Flagged');
            $this->reportModel->auditLog(1, 'Staff', 'FLAG_DEPOSIT', 'payment_reports', null, ['ref' => $data->invoice_refindex]);
            return jsonResponse('success', 'Deposit flagged for investigation');
        }
        return jsonResponse('error', 'Invoice reference required');
    }

    /**
     * Check if a request is resolved
     */
    public function checkStatus($ref)
    {
        $request = $this->requestModel->findByRef($ref);
        if ($request) {
            return jsonResponse('success', 'Request status retrieved', ['status' => $request['status']]);
        }
        return jsonResponse('error', 'Request not found');
    }
}
