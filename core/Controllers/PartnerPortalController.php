<?php
require_once __DIR__ . '/../Models/Order.php';

class PartnerPortalController
{
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    // --- SBA PORTAL ---
    public function getSbaTasks($data)
    {
        $sbaId = $data['sba_id'] ?? 101; // Defaulting to our seeded John SBA for visualization
        $stmt = $this->db->prepare("SELECT sa.*, p.product_name, p.bulk_purchase_price 
                                    FROM sba_acquisitions sa 
                                    JOIN base_products p ON sa.base_product_id = p.id 
                                    WHERE sa.sba_id = ? AND sa.assign_status IN ('pending', 'sbaAck', 'approved') AND sa.supply_status != 'QArejected'");
        $stmt->execute([$sbaId]);
        return jsonResponse('success', 'tasks', $stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    public function submitSbaAction($data)
    {
        if (empty($data['id']) || empty($data['action']) || empty($data['password']))
            return jsonResponse('error', 'Missing params (id, action, or password)');

        $id = $data['id'];
        $action = $data['action'];
        $note = $data['note'] ?? '';
        $issueType = $data['issue_type'] ?? null;
        $password = $data['password'];

        // 1. Get SBA ID from acquisition record
        $stmt = $this->db->prepare("SELECT sba_id FROM sba_acquisitions WHERE id = ?");
        $stmt->execute([$id]);
        $task = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$task)
            return jsonResponse('error', 'Record not found');

        // 2. Verify Password against partners table
        $stmt = $this->db->prepare("SELECT password_hash FROM partners WHERE id = ?");
        $stmt->execute([$task['sba_id']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$user || !password_verify($password, $user['password_hash'])) {
            return jsonResponse('error', 'Invalid security authentication');
        }

        // 3. Process Actions
        if ($action === 'accept') {
            $stmt = $this->db->prepare("UPDATE sba_acquisitions SET supply_status = 'acknowledged', assign_status = 'sbaAck', sba_notes = ?, issue_type = NULL WHERE id = ?");
            $stmt->execute([$note, $id]);
        }
        else if ($action === 'reject') {
            $stmt = $this->db->prepare("UPDATE sba_acquisitions SET supply_status = 'pending', assign_status = 'sbaRejected', sba_notes = ?, issue_type = ? WHERE id = ?");
            $stmt->execute([$note, $issueType, $id]);
        }
        else if ($action === 'supplied') {
            $stmt = $this->db->prepare("UPDATE sba_acquisitions SET supply_status = 'supplied', sba_notes = ?, issue_type = NULL WHERE id = ? AND (assign_status = 'approved' OR assign_status = 'sbaAck')");
            $stmt->execute([$note, $id]);
        }
        else if ($action === 'withdrawn') {
            $stmt = $this->db->prepare("UPDATE sba_acquisitions SET supply_status = 'pending', assign_status = 'sbaRejected', sba_notes = ?, issue_type = ? WHERE id = ?");
            $stmt->execute([$note, $issueType, $id]);
        }

        return jsonResponse('success', 'SBA Operation Processed Successfully');
    }

    public function getSbaRemittances($data)
    {
        $sbaId = $data['sba_id'] ?? 101;
        $stmt = $this->db->prepare("SELECT * FROM partner_remittances WHERE partner_id = ? ORDER BY id DESC");
        $stmt->execute([$sbaId]);
        return jsonResponse('success', 'remits', $stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    // --- ZBDP PORTAL ---
    public function getZbdTasks($data)
    {
        $zbdId = $data['zbd_id'] ?? 201; // Defaulting to Driver Dan
        $stmt = $this->db->prepare("SELECT za.*, a.area_name, p.product_name
                                    FROM zbd_assignments za 
                                    JOIN operating_areas a ON za.destination_area_id = a.id
                                    JOIN base_products p ON za.base_product_id = p.id
                                    WHERE za.zbdp_id = ? AND za.progress_status != 'completed'");
        $stmt->execute([$zbdId]);
        return jsonResponse('success', 'tasks', $stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    public function getZbdRemittances($data)
    {
        $zbdId = $data['zbd_id'] ?? 201;
        $stmt = $this->db->prepare("SELECT * FROM partner_remittances WHERE partner_id = ? ORDER BY id DESC");
        $stmt->execute([$zbdId]);
        return jsonResponse('success', 'remits', $stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    public function acknowledgeRemittance($data)
    {
        if (empty($data['id']) || empty($data['password']))
            return jsonResponse('error', 'Missing ID or password');

        $id = $data['id'];
        $password = $data['password'];

        // Verify Password
        $stmt = $this->db->prepare("SELECT r.partner_id, p.password_hash FROM partner_remittances r JOIN partners p ON r.partner_id = p.id WHERE r.id = ?");
        $stmt->execute([$id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user || !password_verify($password, $user['password_hash'])) {
            return jsonResponse('error', 'Invalid security authentication');
        }

        $stmt = $this->db->prepare("UPDATE partner_remittances SET status = 'Acknowledged' WHERE id = ?");
        $stmt->execute([$id]);
        return jsonResponse('success', 'Remittance Acknowledged Successfully');
    }
}
