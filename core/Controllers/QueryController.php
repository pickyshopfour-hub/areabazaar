<?php
/**
 * Query Controller — Full Implementation
 * Handles all query thread, response, assignment, and notification operations.
 */
require_once __DIR__ . '/../Models/Query.php';
require_once __DIR__ . '/../Models/QueryResponse.php';
require_once __DIR__ . '/../Models/QueryNotification.php';
require_once __DIR__ . '/../Services/NotificationService.php';

class QueryController
{
    private $db;
    private $queryModel;
    private $responseModel;
    private $notifModel;

    public function __construct($db)
    {
        $this->db = $db;
        $this->queryModel = new QueryModel($db);
        $this->responseModel = new QueryResponseModel($db);
        $this->notifModel = new QueryNotificationModel($db);
    }

    // ─────────────────────────────────────────────
    // QUERY CREATION
    // ─────────────────────────────────────────────

    /**
     * Create a new query thread
     * POST /api/queries/add
     */
    public function addQuery($data = null)
    {
        $data = $data ?? (!empty($_POST) ? $_POST : json_decode(file_get_contents("php://input"), true) ?? []);

        // Flexible field mapping (backwards-compatible)
        $subjectId = $data['subject_id'] ?? $data['item_id'] ?? $data['session_id'] ?? $data['order_id'] ?? $data['id'] ?? 0;
        $subjectType = $data['subject_type'] ?? $data['item_type'] ?? $data['type'] ?? $data['context'] ?? 'General';
        $note = $data['note'] ?? $data['description'] ?? $data['message'] ?? null;

        if (empty($subjectType) || empty($note)) {
            return ['status' => 'error', 'message' => 'Missing required fields: Type or Note'];
        }

        $data['subject_id'] = $subjectId;
        $data['subject_type'] = $subjectType;
        $data['note'] = $note;
        $data['creator_id'] = $data['creator_id'] ?? $data['staff_id'] ?? $data['admin_id'] ?? 1;
        $data['creator_role'] = $data['creator_role'] ?? $data['staff_role'] ?? 'Admin';
        $data['priority'] = $data['priority'] ?? 'Normal';

        if ($this->queryModel->create($data)) {
            $newId = $this->queryModel->lastInsertId();

            // Notify assigned user if set
            if (!empty($data['assigned_to'])) {
                $this->_notify($newId, $data['assigned_to'], $data['assigned_role'] ?? '', 'NewAssignment',
                    "A new query has been assigned to you: \"{$subjectType}\" — {$note}");
            }

            return ['status' => 'success', 'message' => 'Query recorded successfully', 'id' => $newId];
        }
        return ['status' => 'error', 'message' => 'Database error: Failed to record query'];
    }

    // ─────────────────────────────────────────────
    // THREAD LISTING & DETAIL
    // ─────────────────────────────────────────────

    /**
     * List query threads with optional filters
     * GET /api/queries/list?status=Open&assigned_to=5&priority=High
     * Access: All — returns only threads relevant to caller (Admin/SrAdmin see all)
     */
    public function listQueries()
    {
        $filters = [
            'status' => $_GET['status'] ?? null,
            'priority' => $_GET['priority'] ?? null,
            'assigned_to' => $_GET['assigned_to'] ?? null,
            'assigned_role' => $_GET['assigned_role'] ?? null,
            'creator_id' => $_GET['creator_id'] ?? null,
            'unassigned_only' => !empty($_GET['unassigned_only']),
        ];
        $queries = $this->queryModel->findAll(array_filter($filters, fn($v) => $v !== null && $v !== false));
        return jsonResponse('success', 'Queries loaded', $queries);
    }

    /**
     * Get a full query thread (query + responses with notes)
     * GET /api/queries/thread?query_id=12
     */
    public function getThread()
    {
        $queryId = (int)($_GET['query_id'] ?? 0);
        if (!$queryId)
            return jsonResponse('error', 'Missing query_id');

        $query = $this->queryModel->findById($queryId);
        if (!$query)
            return jsonResponse('error', 'Query not found');

        $responses = $this->responseModel->findByQuery($queryId);
        return jsonResponse('success', 'Thread loaded', [
            'query' => $query,
            'responses' => $responses,
        ]);
    }

    // ─────────────────────────────────────────────
    // RESPONSES
    // ─────────────────────────────────────────────

    /**
     * Submit a response to a query thread
     * POST /api/queries/respond
     * Body: { query_id, responder_id, responder_role, message, forwarded_to?, forwarded_role? }
     */
    public function submitResponse()
    {
        $data = !empty($_POST) ? $_POST : json_decode(file_get_contents("php://input"), true) ?? [];

        if (empty($data['query_id']) || empty($data['message']) || empty($data['responder_id'])) {
            return jsonResponse('error', 'Missing required fields');
        }

        $query = $this->queryModel->findById($data['query_id']);
        if (!$query)
            return jsonResponse('error', 'Query not found');
        if ($query['status'] === 'Closed' || $query['status'] === 'Archived') {
            return jsonResponse('error', 'Cannot respond to a closed/archived thread');
        }

        $responseId = $this->responseModel->create($data);
        if (!$responseId)
            return jsonResponse('error', 'Failed to save response');

        // Stamp last_activity on parent query
        $this->queryModel->update($data['query_id'], ['last_activity' => date('Y-m-d H:i:s')]);

        // If forwarding, update assignment
        if (!empty($data['forwarded_to'])) {
            $this->queryModel->update($data['query_id'], [
                'assigned_to' => $data['forwarded_to'],
                'assigned_role' => $data['forwarded_role'] ?? '',
            ]);
            $this->_notify($data['query_id'], $data['forwarded_to'], $data['forwarded_role'] ?? '', 'NewAssignment',
                "A query response has been forwarded to you. Message: \"{$data['message']}\"");
        }

        // Notify original creator of the new response (if different from responder)
        if ($query['creator_id'] != $data['responder_id']) {
            $this->_notify($data['query_id'], $query['creator_id'], $query['creator_role'], 'NewResponse',
                "A new response was added to your query by {$data['responder_role']}.");
        }

        // Notify current assignee if different from both creator and responder
        if (!empty($query['assigned_to'])
        && $query['assigned_to'] != $data['responder_id']
        && $query['assigned_to'] != $query['creator_id']
        ) {
            $this->_notify($data['query_id'], $query['assigned_to'], $query['assigned_role'], 'NewResponse',
                "A response was added to a query assigned to you.");
        }

        return jsonResponse('success', 'Response submitted', ['response_id' => $responseId]);
    }

    // ─────────────────────────────────────────────
    // ASSIGNMENT & PRIORITY
    // ─────────────────────────────────────────────

    /**
     * Assign (or reassign) a query to a user
     * POST /api/queries/assign
     * Body: { query_id, assigned_to, assigned_role, actor_id? }
     */
    public function assignQuery()
    {
        $data = !empty($_POST) ? $_POST : json_decode(file_get_contents("php://input"), true) ?? [];

        if (empty($data['query_id']) || empty($data['assigned_to'])) {
            return jsonResponse('error', 'Missing required fields');
        }

        $updated = $this->queryModel->update($data['query_id'], [
            'assigned_to' => $data['assigned_to'],
            'assigned_role' => $data['assigned_role'] ?? '',
        ]);
        if (!$updated)
            return jsonResponse('error', 'Failed to assign query');

        $this->_notify($data['query_id'], $data['assigned_to'], $data['assigned_role'] ?? '', 'NewAssignment',
            "A query has been assigned to you.");

        return jsonResponse('success', 'Query assigned successfully');
    }

    /**
     * Set/reset priority on a query thread
     * POST /api/queries/set-priority
     * Body: { query_id, priority, assigned_to?, assigned_role?, note?, actor_id, actor_role }
     */
    public function setPriority()
    {
        $data = !empty($_POST) ? $_POST : json_decode(file_get_contents("php://input"), true) ?? [];

        if (empty($data['query_id']) || empty($data['priority'])) {
            return jsonResponse('error', 'Missing required fields');
        }

        $updates = ['priority' => $data['priority']];
        if (!empty($data['assigned_to'])) {
            $updates['assigned_to'] = $data['assigned_to'];
            $updates['assigned_role'] = $data['assigned_role'] ?? '';
        }

        $this->queryModel->update($data['query_id'], $updates);

        // If there's a note, add a response record for it
        if (!empty($data['note']) && !empty($data['actor_id'])) {
            $this->responseModel->create([
                'query_id' => $data['query_id'],
                'responder_id' => $data['actor_id'],
                'responder_role' => $data['actor_role'] ?? 'Admin',
                'message' => "[Priority set to {$data['priority']}] " . $data['note'],
            ]);
        }

        // Notify the assignee
        if (!empty($data['assigned_to'])) {
            $this->_notify($data['query_id'], $data['assigned_to'], $data['assigned_role'] ?? '', 'PriorityChange',
                "A query assigned to you has been set to priority: {$data['priority']}.");
        }

        return jsonResponse('success', 'Priority updated');
    }

    // ─────────────────────────────────────────────
    // CLOSE THREAD
    // ─────────────────────────────────────────────

    /**
     * Originator closes their own query thread
     * POST /api/queries/close
     * Body: { query_id, closer_id, closer_role, reason? }
     */
    public function closeQuery()
    {
        $data = !empty($_POST) ? $_POST : json_decode(file_get_contents("php://input"), true) ?? [];

        if (empty($data['query_id']) || empty($data['closer_id'])) {
            return jsonResponse('error', 'Missing required fields');
        }

        $query = $this->queryModel->findById($data['query_id']);
        if (!$query)
            return jsonResponse('error', 'Query not found');

        // Originator check
        if ((int)$query['creator_id'] !== (int)$data['closer_id']) {
            return jsonResponse('error', 'Only the originator may close this thread');
        }

        $this->queryModel->update($data['query_id'], [
            'status' => 'Closed',
            'closed_by' => $data['closer_id'],
            'close_reason' => $data['reason'] ?? 'Resolved by originator',
        ]);

        // Notify assignee if any
        if (!empty($query['assigned_to'])) {
            $this->_notify($data['query_id'], $query['assigned_to'], $query['assigned_role'], 'ThreadClosed',
                "A query thread assigned to you has been closed by its originator.");
        }

        return jsonResponse('success', 'Query thread closed');
    }

    /**
     * Admin force-closes a cold query thread (requires password verification)
     * POST /api/queries/close-cold
     * Body: { query_id, actor_id, actor_role, password, reason, note? }
     */
    public function closeColdQuery()
    {
        $data = !empty($_POST) ? $_POST : json_decode(file_get_contents("php://input"), true) ?? [];

        if (empty($data['query_id']) || empty($data['actor_id']) || empty($data['password']) || empty($data['reason'])) {
            return jsonResponse('error', 'Missing required fields');
        }

        // Authenticate actor password against staff_users
        require_once __DIR__ . '/../Models/StaffUser.php';
        $staffModel = new StaffUser($this->db);
        $staff = $staffModel->findById($data['actor_id']);
        if (!$staff || !password_verify($data['password'], $staff['password_hash'])) {
            return jsonResponse('error', 'Authentication failed');
        }

        $query = $this->queryModel->findById($data['query_id']);
        if (!$query)
            return jsonResponse('error', 'Query not found');

        $this->queryModel->update($data['query_id'], [
            'status' => 'Closed',
            'closed_by' => $data['actor_id'],
            'close_reason' => $data['reason'],
        ]);

        // Optional note as response
        if (!empty($data['note'])) {
            $this->responseModel->create([
                'query_id' => $data['query_id'],
                'responder_id' => $data['actor_id'],
                'responder_role' => $data['actor_role'] ?? 'Admin',
                'message' => "[ADMIN FORCE-CLOSE] {$data['note']}",
            ]);
        }

        // Write to audit log
        $this->_auditLog($data['query_id'], $data['actor_id'], $data['actor_role'] ?? 'Admin',
            'force_closed', "Reason: {$data['reason']}" . (!empty($data['note']) ? " | Note: {$data['note']}" : ""));

        // Notify creator and assignee
        foreach (array_unique([$query['creator_id'], $query['assigned_to']]) as $uid) {
            if ($uid) {
                $role = ($uid == $query['creator_id']) ? $query['creator_role'] : $query['assigned_role'];
                $this->_notify($data['query_id'], $uid, $role, 'ThreadClosed',
                    "A query thread has been administratively closed. Reason: {$data['reason']}");
            }
        }

        return jsonResponse('success', 'Query thread force-closed and audit logged');
    }

    // ─────────────────────────────────────────────
    // ADMIN NOTES ON RESPONSES
    // ─────────────────────────────────────────────

    /**
     * Add an admin comment note to a specific response
     * POST /api/queries/add-note
     * Body: { response_id, author_id, author_role, note }
     */
    public function addResponseNote()
    {
        $data = !empty($_POST) ? $_POST : json_decode(file_get_contents("php://input"), true) ?? [];

        if (empty($data['response_id']) || empty($data['author_id']) || empty($data['note'])) {
            return jsonResponse('error', 'Missing required fields');
        }

        $result = $this->responseModel->addNote(
            $data['response_id'],
            $data['author_id'],
            $data['author_role'] ?? 'Admin',
            $data['note']
        );

        return $result
            ? jsonResponse('success', 'Note added to response')
            : jsonResponse('error', 'Failed to add note');
    }

    // ─────────────────────────────────────────────
    // ADMIN POWER TOOLS
    // ─────────────────────────────────────────────

    /**
     * Archive all closed threads older than 28 days
     * POST /api/queries/prune-archive
     * Body: { days? } — defaults to 28
     */
    public function pruneToArchive()
    {
        $data = !empty($_POST) ? $_POST : json_decode(file_get_contents("php://input"), true) ?? [];
        $days = (int)($data['days'] ?? 28);
        $count = $this->queryModel->pruneOld($days);
        return jsonResponse('success', "{$count} thread(s) archived", ['archived_count' => $count]);
    }

    /**
     * Get all open threads stale for more than 4 days (cold audit)
     * GET /api/queries/cold-audit?days=4
     */
    public function getColdThreads()
    {
        $days = (int)($_GET['days'] ?? 4);
        $threads = $this->queryModel->getCold($days);
        return jsonResponse('success', 'Cold threads loaded', $threads);
    }

    // ─────────────────────────────────────────────
    // NOTIFICATIONS
    // ─────────────────────────────────────────────

    /**
     * Get unread notifications for the current user
     * GET /api/notifications/unread?recipient_id=5
     */
    public function getUnreadNotifications()
    {
        $recipientId = (int)($_GET['recipient_id'] ?? 0);
        if (!$recipientId)
            return jsonResponse('error', 'Missing recipient_id');

        $notifs = $this->notifModel->getUnread($recipientId);
        $count = count($notifs);
        return jsonResponse('success', 'Notifications loaded', [
            'count' => $count,
            'notifications' => $notifs,
        ]);
    }

    /**
     * Mark notifications as read
     * POST /api/notifications/mark-read
     * Body: { recipient_id } or { notif_id } for single
     */
    public function markNotificationsRead()
    {
        $data = !empty($_POST) ? $_POST : json_decode(file_get_contents("php://input"), true) ?? [];

        if (!empty($data['notif_id'])) {
            $this->notifModel->markOneRead($data['notif_id']);
        }
        elseif (!empty($data['recipient_id'])) {
            $this->notifModel->markAllRead($data['recipient_id']);
        }
        else {
            return jsonResponse('error', 'Missing recipient_id or notif_id');
        }
        return jsonResponse('success', 'Notifications marked as read');
    }

    // ─────────────────────────────────────────────
    // INTERNAL HELPERS
    // ─────────────────────────────────────────────

    /**
     * Fire an in-app notification and conditionally send Email/SMS
     */
    private function _notify($queryId, $recipientId, $recipientRole, $type, $message)
    {
        // 1. Always: in-app notification
        $this->notifModel->create($queryId, $recipientId, $recipientRole, $type, $message);

        // 2. Conditional: Email (requires notif_email_enabled = 1 in global_settings)
        // Attempt to resolve recipient email from staff_users or partners
        try {
            $stmt = $this->db->prepare(
                "SELECT email FROM staff_users WHERE id = :id LIMIT 1
                 UNION
                 SELECT email FROM partners WHERE id = :id LIMIT 1"
            );
            $stmt->execute([':id' => $recipientId]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($row && !empty($row['email'])) {
                NotificationService::sendEmail(
                    $row['email'],
                    "AreaBazaar Query Notification: {$type}",
                    "<p>{$message}</p>",
                    $this->db
                );
            }
        }
        catch (Exception $e) {
            // Email resolution failure is non-fatal
            error_log("QueryController::_notify email lookup failed: " . $e->getMessage());
        }

        // 3. Conditional: SMS (requires notif_sms_enabled = 1 in global_settings)
        try {
            $stmt = $this->db->prepare(
                "SELECT phone_number FROM staff_users WHERE id = :id LIMIT 1
                 UNION
                 SELECT phone_number FROM partners WHERE id = :id LIMIT 1"
            );
            $stmt->execute([':id' => $recipientId]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($row && !empty($row['phone_number'])) {
                NotificationService::sendSms($row['phone_number'], $message, $this->db);
            }
        }
        catch (Exception $e) {
            error_log("QueryController::_notify SMS lookup failed: " . $e->getMessage());
        }
    }

    /**
     * Write an entry to query_audit_log
     */
    private function _auditLog($queryId, $actorId, $actorRole, $action, $detail = null)
    {
        try {
            $stmt = $this->db->prepare(
                "INSERT INTO query_audit_log (query_id, actor_id, actor_role, action, detail, created_at)
                 VALUES (:qid, :aid, :arole, :action, :detail, NOW())"
            );
            $stmt->execute([
                ':qid' => $queryId,
                ':aid' => $actorId,
                ':arole' => $actorRole,
                ':action' => $action,
                ':detail' => $detail,
            ]);
        }
        catch (Exception $e) {
            error_log("QueryController::_auditLog Error: " . $e->getMessage());
        }
    }
}
?>
