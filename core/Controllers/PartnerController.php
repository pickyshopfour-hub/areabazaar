<?php
/**
 * Partner Controller
 * AreaBazaar PHP/MySQL REST API
 * Handles partner onboarding, approval, and management
 */

require_once __DIR__ . '/../Models/Partner.php';

class PartnerController
{
    private $partnerModel;

    public function __construct($db)
    {
        $this->partnerModel = new Partner($db);
    }

    /**
     * Add a single partner (from web form or GS push)
     * ADM-PT-05/06, WHM-SP-01/02
     */
    public function addPartner($data)
    {
        // Validate required fields
        $required = ['name', 'phone_number', 'partner_type'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                return ['status' => 'error', 'message' => "Missing required field: $field"];
            }
        }

        // Validate partner type
        $validTypes = ['SBA', 'ZBDp', 'Agent'];
        if (!in_array($data['partner_type'], $validTypes)) {
            return ['status' => 'error', 'message' => 'Invalid partner type'];
        }

        try {
            $this->partnerModel->createPartner($data);
            return [
                'status' => 'success',
                'message' => $data['partner_type'] . ' partner registered successfully. Awaiting approval.'
            ];
        }
        catch (PDOException $e) {
            if (strpos($e->getMessage(), 'Duplicate') !== false) {
                return ['status' => 'error', 'message' => 'Phone number already registered'];
            }
            return ['status' => 'error', 'message' => 'Registration failed: ' . $e->getMessage()];
        }
    }

    /**
     * Batch ingest partners from Google Sheets template
     * ADM-PT-05/06
     */
    public function batchIngest($data)
    {
        if (empty($data['partners']) || !is_array($data['partners'])) {
            return ['status' => 'error', 'message' => 'No partner data provided'];
        }

        $onboardedBy = $data['onboarded_by'] ?? null;
        $results = $this->partnerModel->batchCreate($data['partners'], $onboardedBy);

        return [
            'status' => 'success',
            'message' => "Batch complete: {$results['success']} added, {$results['failed']} failed",
            'data' => $results
        ];
    }

    /**
     * List pending partner approvals
     * ADM-PT-01/02
     */
    public function listPending($data)
    {
        $type = $data['type'] ?? null;
        $partners = $this->partnerModel->findPendingApprovals($type);
        return [
            'status' => 'success',
            'data' => $partners,
            'count' => count($partners)
        ];
    }

    /**
     * List all partners with optional filters
     */
    public function listAll($data)
    {
        $filters = [
            'type' => $data['type'] ?? null,
            'approval_status' => $data['approval_status'] ?? null,
            'search' => $data['search'] ?? null
        ];
        $partners = $this->partnerModel->getAllPartners($filters);
        $counts = $this->partnerModel->getApprovalCounts();
        return [
            'status' => 'success',
            'data' => $partners,
            'counts' => $counts
        ];
    }

    /**
     * Approve, reject, query, or flag a partner
     * ADM-PT-01/02 (SeniorAdmin only for approve/reject)
     */
    public function approvePartner($data)
    {
        if (empty($data['partner_id']) || empty($data['action'])) {
            return ['status' => 'error', 'message' => 'Missing partner_id or action'];
        }

        $validActions = ['Approved', 'Rejected', 'Queried', 'Flagged'];
        if (!in_array($data['action'], $validActions)) {
            return ['status' => 'error', 'message' => 'Invalid action: ' . $data['action']];
        }

        $adminId = $data['admin_id'] ?? null;
        $notes = $data['notes'] ?? '';

        $success = $this->partnerModel->updateApprovalStatus(
            $data['partner_id'],
            $data['action'],
            $adminId,
            $notes
        );

        if ($success) {
            return [
                'status' => 'success',
                'message' => "Partner status updated to: {$data['action']}"
            ];
        }
        return ['status' => 'error', 'message' => 'Failed to update partner status'];
    }

    /**
     * Get partner profile details
     */
    public function getPartnerProfile($data)
    {
        $id = $data['id'] ?? null;
        if (!$id) {
            return ['status' => 'error', 'message' => 'Partner ID required'];
        }

        $partner = $this->partnerModel->getPartnerDetails($id);
        if ($partner) {
            // Decode JSON fields for display
            if ($partner['contact_info']) {
                $partner['contact_info'] = json_decode($partner['contact_info'], true);
            }
            if ($partner['supply_categories']) {
                $partner['supply_categories'] = json_decode($partner['supply_categories'], true);
            }
            if ($partner['documents_json']) {
                $partner['documents_json'] = json_decode($partner['documents_json'], true);
            }
            return ['status' => 'success', 'data' => $partner];
        }
        return ['status' => 'error', 'message' => 'Partner not found'];
    }

    /**
     * Get dashboard summary counts
     */
    public function getDashboardStats($data)
    {
        $counts = $this->partnerModel->getApprovalCounts();
        return [
            'status' => 'success',
            'data' => $counts
        ];
    }
}
?>
