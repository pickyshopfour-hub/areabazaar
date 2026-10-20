<?php
/**
 * StaffController
 * AreaBazaar PHP/MySQL REST API
 * Handles administration of Staff Users
 */

require_once __DIR__ . '/../Models/StaffUser.php';

class StaffController
{
    private $staffModel;

    public function __construct($db)
    {
        $this->staffModel = new StaffUser($db);
    }

    /**
     * List all staff members
     */
    public function listStaff($data)
    {
        try {
            $staff = $this->staffModel->findAll("role ASC, name ASC");
            // Remove sensitive data
            foreach ($staff as &$user) {
                unset($user['password_hash']);
            }
            return ["status" => "success", "data" => $staff];
        }
        catch (Exception $e) {
            return ["status" => "error", "message" => $e->getMessage()];
        }
    }

    /**
     * Add a new staff member (Robust)
     */
    public function addStaff($data)
    {
        $data = sanitize($data);

        if (empty($data['first_name']) || empty($data['last_name']) || empty($data['phone_number']) || empty($data['role']) || empty($data['password'])) {
            return ["status" => "error", "message" => 'Missing required fields: first_name, last_name, phone_number, role, password'];
        }

        $validRoles = ['Admin', 'SeniorAdmin', 'WHM', 'Sales'];
        if (!in_array($data['role'], $validRoles)) {
            return ["status" => "error", "message" => 'Invalid role provided'];
        }

        // Check unique constraints
        if ($this->staffModel->where('phone_number', $data['phone_number'])) {
            return ["status" => "error", "message" => 'Phone number already registered'];
        }
        if (!empty($data['email']) && $this->staffModel->where('email', $data['email'])) {
            return ["status" => "error", "message" => 'Email already registered'];
        }

        $staffData = [
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'middle_name' => $data['middle_name'] ?? '',
            'name' => trim($data['first_name'] . ' ' . $data['last_name']),
            'phone_number' => $data['phone_number'],
            'email' => $data['email'] ?? '',
            'password_hash' => password_hash($data['password'], PASSWORD_BCRYPT),
            'role' => $data['role'],
            'added_by' => $data['admin_id'] ?? null,
            'status' => 'Active',
            'contact_info' => json_encode($data['contact_info'] ?? [])
        ];

        $newId = $this->staffModel->create($staffData);

        if ($newId) {
            $this->staffModel->auditLog($data['admin_id'] ?? 0, 'Staff', 'HIRE_MEMBER', 'staff_users', null, ['id' => $newId, 'name' => $staffData['name']]);
            return ["status" => "success", "message" => 'Staff member hired successfully', "data" => ['id' => $newId]];
        }
        else {
            return ["status" => "error", "message" => 'Failed to create staff record'];
        }
    }

    /**
     * Handle advanced administrative actions
     */
    public function updateStaff($data)
    {
        $data = sanitize($data);

        if (empty($data['id']) || empty($data['action'])) {
            return ["status" => "error", "message" => 'ID and action are required'];
        }

        $id = $data['id'];
        $action = $data['action'];
        $adminId = $data['admin_id'] ?? 0;

        $oldUser = $this->staffModel->findById($id);
        if (!$oldUser)
            return ["status" => "error", "message" => 'User not found'];

        $updateData = [];
        $logType = $action;

        switch ($action) {
            case 'suspend':
                $updateData['status'] = 'Suspended';
                break;
            case 'unsuspend':
                $updateData['status'] = 'Active';
                break;
            case 'hide':
                $updateData['status'] = 'Hidden';
                break;
            case 'unhide':
                $updateData['status'] = 'Active';
                break;
            case 'deploy':
                $updateData['status'] = 'Deployed';
                $updateData['contact_info'] = json_encode(array_merge(json_decode($oldUser['contact_info'], true) ?: [], ['deployment' => $data['location'] ?? 'Unknown']));
                break;
            case 'redeploy':
                $updateData['contact_info'] = json_encode(array_merge(json_decode($oldUser['contact_info'], true) ?: [], ['deployment' => $data['location'] ?? 'Changed']));
                break;
            case 'remove':
                // We usually don't delete, we archive/hide
                $updateData['status'] = 'Hidden';
                $logType = 'REMOVE_MEMBER';
                break;
            case 'update_role':
                $updateData['role'] = $data['role'];
                break;
            default:
                return ["status" => "error", "message" => 'Invalid action'];
        }

        if ($this->staffModel->update($id, $updateData)) {
            $this->staffModel->auditLog($adminId, 'Staff', $logType, 'staff_users', $oldUser, $updateData);
            return ["status" => "success", "message" => "Action '$action' completed successfully"];
        }
        else {
            return ["status" => "error", "message" => 'Operation failed'];
        }
    }

    /**
     * Get single staff profile
     */
    public function getStaffProfile($data)
    {
        $id = $data['id'] ?? 0;
        $user = $this->staffModel->findById($id);
        if ($user) {
            unset($user['password_hash']);
            return ["status" => "success", "data" => $user];
        }
        return ["status" => "error", "message" => "Staff member not found"];
    }

    /**
     * Add a query/flag record
     */
    public function addQuery($data)
    {
        require_once __DIR__ . '/../Models/Query.php';
        $db = $this->staffModel->getConn();
        $queryModel = new QueryModel($db);

        $data = sanitize($data);

        if ((!isset($data['item_id']) && $data['item_id'] !== 0) || empty($data['item_type']) || empty($data['note'])) {
            return ["status" => "error", "message" => "Missing item_id, item_type, or note"];
        }

        $queryData = [
            'subject_type' => $data['item_type'],
            'subject_id' => $data['item_id'],
            'creator_id' => $data['staff_id'] ?? 0,
            'creator_role' => $data['staff_role'] ?? 'Admin',
            'assigned_to' => $data['assigned_to'] ?? null,
            'note' => $data['note'],
            'flag_types' => isset($data['flags']) ? json_encode($data['flags']) : null,
            'status' => 'Open'
        ];

        if ($queryModel->create($queryData)) {
            return ["status" => "success", "message" => "Query record created"];
        }
        return ["status" => "error", "message" => "Failed to create query"];
    }
}
