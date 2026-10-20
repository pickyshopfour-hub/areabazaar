<?php
/**
 * Global Helper Functions
 * AreaBazaar PHP/MySQL REST API
 */
require_once __DIR__ . '/../includes/database.php';

function getConn()
{
    static $conn = null;
    if ($conn === null) {
        $db = new Database();
        $conn = $db->getConnection();
    }
    return $conn;
}

/**
 * Standardized JSON Response
 */
function jsonResponse($status, $message, $data = null)
{
    header('Content-Type: application/json');
    $response = [
        'status' => $status,
        'message' => $message,
        'timestamp' => date('Y-m-d H:i:s')
    ];
    if ($data !== null) {
        $response['data'] = $data;
    }
    echo json_encode($response);
    exit;
}

/**
 * Input Sanitization
 */
function sanitize($data)
{
    if (is_array($data)) {
        foreach ($data as $key => $value) {
            $data[$key] = sanitize($value);
        }
    }
    else {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);
    }
    return $data;
}

/**
 * Get Bearer Token from Header
 */
function getBearerToken()
{
    $headers = getallheaders();
    if (isset($headers['Authorization'])) {
        if (preg_match('/Bearer\s(\S+)/', $headers['Authorization'], $matches)) {
            return $matches[1];
        }
    }
    return null;
}
/**
 * RBAC Helper: Check if user has required role
 */
function checkRole($user, $requiredRole)
{
    if (!$user || !isset($user['role'])) {
        jsonResponse('error', 'Unauthorized: Authentication required', null);
    }

    if ($user['role'] !== $requiredRole && $user['role'] !== 'SeniorAdmin') {
        jsonResponse('error', 'Forbidden: Insufficient permissions', null);
    }
}

/**
 * Get Bootstrap color class for status badges
 */
function getStatusColor($status)
{
    $colors = [
        'Draft' => 'secondary',
        'Ready' => 'info',
        'Active' => 'success',
        'Ended' => 'danger',
        'Cancelled' => 'dark',
        'Paused' => 'warning'
    ];
    return $colors[$status] ?? 'primary';
}

/**
 * Retrieve a global setting from the database
 */
function getSetting($db, $key, $default = null)
{
    try {
        $query = "SELECT setting_value FROM global_settings WHERE setting_key = ? LIMIT 1";
        $stmt = $db->prepare($query);
        $stmt->execute([$key]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ? $row['setting_value'] : $default;
    }
    catch (Exception $e) {
        return $default;
    }
}

// ─────────────────────────────────────────────
// SESSION AUTH HELPERS
// ─────────────────────────────────────────────

/**
 * Start session safely if not already started
 */
function _initSession()
{
    if (session_status() === PHP_SESSION_NONE && !headers_sent()) {
        session_name('ab_session');
        session_start();
    }
}

/**
 * Get the currently logged-in user from session.
 * Returns array with id, name, role, type — or null if not authenticated.
 */
function currentUser()
{
    _initSession();
    return $_SESSION['user'] ?? null;
}

/**
 * Auth Guard — checks session is valid and user has required role.
 * Calls forceLogin() (redirect) if not authenticated.
 * Returns 403 JSON if authenticated but role not permitted.
 *
 * @param array|string $allowedRoles  e.g. ['Admin', 'SeniorAdmin'] or 'SeniorAdmin'
 * @param string       $loginPage     Login redirect target
 */
function authGuard($allowedRoles = [], $loginPage = 'login.php')
{
    _initSession();
    $user = $_SESSION['user'] ?? null;

    if (!$user) {
        forceLogin($loginPage);
    }

    // Check session expiry (default 120 min)
    $db = getConn();
    $lifetimeSecs = (int)(getSetting($db, 'session_lifetime_minutes', 120) * 60);
    if ((time() - ($user['login_at'] ?? 0)) > $lifetimeSecs) {
        session_destroy();
        forceLogin($loginPage);
    }

    if (!empty($allowedRoles)) {
        $allowedRoles = (array)$allowedRoles;
        if (!in_array($user['role'], $allowedRoles)) {
            jsonResponse('error', 'Forbidden: Insufficient permissions');
        }
    }

    return $user;
}

/**
 * Force redirect to login page, preserving current URL as return target.
 */
function forceLogin($loginPage = 'login.php')
{
    $returnUrl = urlencode($_SERVER['REQUEST_URI'] ?? '');
    header("Location: {$loginPage}?return={$returnUrl}");
    exit;
}

/**
 * [FUTURE] Force redirect to user verification page.
 */
function forceVerify($verifyPage = 'verify.php')
{
    header("Location: {$verifyPage}");
    exit;
}

/**
 * Inject window.currentUser and window.notifPollInterval for a dashboard page.
 * Call this inside a <script> block at the top of each dashboard PHP page.
 *
 * @param PDO $db         Active DB connection — used to fetch notif poll interval from settings
 * @param array $override Optional: hardcoded user data for development use
 */
function injectCurrentUserJs($db, $override = [])
{
    _initSession();
    $user = array_merge(
    ['id' => 1, 'name' => 'Dev User', 'role' => 'Admin', 'type' => 'staff'],
        $_SESSION['user'] ?? [],
        $override
    );
    $pollInterval = (int)getSetting($db, 'notif_poll_interval_seconds', 30);
    echo "window.currentUser = " . json_encode([
        'id' => (int)$user['id'],
        'name' => htmlspecialchars($user['name']),
        'role' => $user['role'],
        'type' => $user['type'] ?? 'staff',
    ]) . ";\n";
    echo "window.notifPollInterval = " . ($pollInterval * 1000) . ";\n";
}
?>
