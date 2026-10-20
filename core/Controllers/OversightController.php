<?php
/**
 * OversightController
 * AreaBazaar PHP/MySQL REST API
 * Handles management of WHZ, Areas, Routes, Banks, and Google Accounts
 */

require_once __DIR__ . '/../Models/WHZone.php';
require_once __DIR__ . '/../Models/OperatingArea.php';
require_once __DIR__ . '/../Models/DeliveryRoute.php';
require_once __DIR__ . '/../Models/SystemBank.php';
require_once __DIR__ . '/../Models/GoogleAccount.php';

class OversightController
{
    private $db;
    private $models = [];

    public function __construct($db)
    {
        $this->db = $db;
        $this->models = [
            'whz' => new WHZone($db),
            'area' => new OperatingArea($db),
            'route' => new DeliveryRoute($db),
            'bank' => new SystemBank($db),
            'google' => new GoogleAccount($db)
        ];
    }

    /**
     * Get list for a specific entity type
     */
    public function listEntities($data)
    {
        $type = $data['type'] ?? '';
        if (!isset($this->models[$type])) {
            return ["status" => "error", "message" => "Invalid entity type: " . $type];
        }

        $dataList = $this->models[$type]->findAll("time_created DESC");
        return ["status" => "success", "message" => "List of $type retrieved", "data" => $dataList];
    }

    /**
     * Update entity status (SeniorAdmin only)
     */
    public function updateStatus($data)
    {
        $data = sanitize($data);

        if (empty($data['type']) || empty($data['id']) || empty($data['status'])) {
            return ["status" => "error", "message" => "Missing type, id, or status"];
        }

        $type = $data['type'];
        $id = $data['id'];
        $status = $data['status'];

        if (!isset($this->models[$type])) {
            return ["status" => "error", "message" => "Invalid entity type"];
        }

        $model = $this->models[$type];
        $oldData = $model->findById($id);

        if ($model->update($id, ['status' => $status])) {
            $model->auditLog($data['admin_id'] ?? 0, 'Staff', "UPDATE_STATUS_$type", $type, $oldData, ['status' => $status]);
            return ["status" => "success", "message" => "Status updated to $status"];
        }
        else {
            return ["status" => "error", "message" => "Update failed"];
        }
    }

    /**
     * Assign Charge Officer
     */
    public function assignChargeOfficer($data)
    {
        $data = sanitize($data);

        if (empty($data['type']) || empty($data['id']) || !isset($data['officer_id'])) {
            return ["status" => "error", "message" => "Missing type, id, or officer_id"];
        }

        $type = $data['type'];
        $id = $data['id'];
        $officerId = $data['officer_id'];

        if (!isset($this->models[$type])) {
            return ["status" => "error", "message" => "Invalid entity type"];
        }

        $model = $this->models[$type];
        if ($model->update($id, ['charge_officer_id' => $officerId])) {
            $model->auditLog($data['admin_id'] ?? 0, 'Staff', "ASSIGN_OFFICER_$type", $type, null, ['officer_id' => $officerId]);
            return ["status" => "success", "message" => "Charge officer assigned"];
        }
        else {
            return ["status" => "error", "message" => "Assignment failed"];
        }
    }

    /**
     * Batch ingest from Google Sheets template
     */
    public function batchIngest($data)
    {
        if (empty($data['type']) || empty($data['items'])) {
            return ["status" => "error", "message" => "Missing type or items"];
        }

        $type = $data['type'];
        $items = $data['items'];

        if (!isset($this->models[$type])) {
            return ["status" => "error", "message" => "Invalid entity type"];
        }

        $model = $this->models[$type];
        $success = 0;
        $failed = 0;

        foreach ($items as $item) {
            $item = sanitize($item);
            if ($model->create($item)) {
                $success++;
            }
            else {
                $failed++;
            }
        }

        return ["status" => "success", "message" => "Batch ingestion complete: $success success, $failed failed"];
    }

    /**
     * Create a new entity
     */
    public function createEntity($data)
    {
        $data = sanitize($data);
        $type = $data['type'] ?? '';

        if (!isset($this->models[$type])) {
            return ["status" => "error", "message" => "Invalid entity type"];
        }

        unset($data['type']); // Remove type from data passed to model create

        $id = $this->models[$type]->create($data);
        if ($id) {
            $this->models[$type]->auditLog($data['admin_id'] ?? 0, 'Staff', "CREATE_$type", $type, null, $data);
            return ["status" => "success", "message" => "Entity created successfully", "id" => $id];
        }
        else {
            return ["status" => "error", "message" => "Creation failed"];
        }
    }

    /**
     * Delete an entity (SeniorAdmin only)
     */
    public function deleteEntity($data)
    {
        $data = sanitize($data);

        if (empty($data['type']) || empty($data['id'])) {
            return ["status" => "error", "message" => "Missing type or id"];
        }

        $type = $data['type'];
        $id = $data['id'];

        if (!isset($this->models[$type])) {
            return ["status" => "error", "message" => "Invalid entity type"];
        }

        $model = $this->models[$type];
        $oldData = $model->findById($id);

        if ($model->delete($id)) {
            $model->auditLog($data['admin_id'] ?? 0, 'Staff', "DELETE_$type", $type, $oldData, null);
            return ["status" => "success", "message" => "Entity deleted successfully"];
        }
        else {
            return ["status" => "error", "message" => "Deletion failed"];
        }
    }
}
