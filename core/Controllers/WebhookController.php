<?php
/**
 * WebhookController
 * AreaBazaar PHP/MySQL REST API
 */

require_once __DIR__ . '/../Models/BankReport.php';
require_once __DIR__ . '/../Models/PaymentReport.php';
require_once __DIR__ . '/../Models/PaymentRequest.php';
require_once __DIR__ . '/../Models/Wallet.php';

class WebhookController
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

    public function receiveBankReports()
    {
        $data = json_decode(file_get_contents("php://input"), true);

        if (!is_array($data) || empty($data)) {
            return jsonResponse('error', 'Invalid payload');
        }

        $processed = 0;
        foreach ($data as $reportData) {
            // Assume format: ['bank_ref' => '...', 'amount' => 123, 'raw_narration' => '...', 'transaction_date' => '...']
            $ref = $reportData['bank_ref'] ?? null;
            if (!$ref)
                continue;

            // Extract invoice_refindex if possible
            preg_match('/(AB-[A-Z0-9]{8})/i', $reportData['raw_narration'] ?? '', $matches);
            $invoiceRef = $matches[1] ?? null;

            // Avoid duplicates
            if ($this->bankModel->getByRef($ref))
                continue;

            $status = 'Unreconciled';

            // Get deposit auto limit
            $limitStmt = $this->db->query("SELECT setting_value FROM settings WHERE setting_key = 'deposit_auto_limit'");
            $limitRow = $limitStmt->fetch(PDO::FETCH_ASSOC);
            $depositAutoLimit = $limitRow ? floatval($limitRow['setting_value']) : 1000000;

            $insertData = [
                'bank_ref' => $ref,
                'amount' => $reportData['amount'] ?? 0,
                'raw_narration' => $reportData['raw_narration'] ?? '',
                'transaction_date' => $reportData['transaction_date'] ?? date('Y-m-d'),
                'extraction_source' => 'Gmail_Webhook',
                'status' => 'Unreconciled'
            ];

            $bankId = $this->bankModel->create($insertData);
            if (!$bankId)
                continue;

            $processed++;

            // Reconciliation Logic
            if ($invoiceRef) {
                $paymentReport = $this->getPaymentReportByRef($invoiceRef);
                $paymentRequest = $this->requestModel->findByRef($invoiceRef);

                if ($paymentReport && $paymentRequest) {
                    if (floatval($paymentReport['amount_reported']) == floatval($insertData['amount']) &&
                    floatval($paymentRequest['amount']) == floatval($insertData['amount'])) {
                        // Fully Matched (Awaiting Admin Verification or SeniorAdmin)
                        $this->bankModel->updateStatus($bankId, 'Reconciled');

                        $amount = floatval($insertData['amount']);
                        if ($amount > $depositAutoLimit) {
                            $this->reportModel->updateStatus($invoiceRef, 'AwaitingAdminApproval');
                        }
                        else {
                            $this->reportModel->updateStatus($invoiceRef, 'Matched');
                        }

                    // We DO NOT auto-credit the wallet here, nor do we resolve the request.
                    // Admin handles that via verifyPaymentReport
                    }
                    else {
                        // Amount mismatch
                        $this->bankModel->updateStatus($bankId, 'amount-mismatch');
                        $this->reportModel->updateStatus($invoiceRef, 'amount-mismatch');
                    }
                }
                else {
                    // Correct invoice ref structurally but no corresponding record found
                    $this->bankModel->updateStatus($bankId, 'orphaned');
                }
            }
            else {
                // Orphaned
                $this->bankModel->updateStatus($bankId, 'orphaned');
            }
        }

        return jsonResponse('success', "Processed $processed bank reports");
    }

    private function getPaymentReportByRef($ref)
    {
        $stmt = $this->db->prepare("SELECT * FROM payment_reports WHERE invoice_refindex = :ref ORDER BY id DESC LIMIT 1");
        $stmt->execute([':ref' => $ref]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
