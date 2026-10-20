<?php
/**
 * Auth Controller
 * AreaBazaar PHP/MySQL REST API
 * Handles customer login/register AND staff/partner session-based auth.
 */

require_once '../core/Models/Customer.php';
require_once '../core/Models/StaffUser.php';
require_once '../core/Models/Partner.php';

class AuthController
{
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    // ─────────────────────────────────────────────
    // CUSTOMER ENDPOINTS (existing, unchanged)
    // ─────────────────────────────────────────────

    /**
     * Customer Login (JSON-API, no session)
     * POST /api/auth/login
     */
    public function login($data)
    {
        $data = sanitize($data);

        if (!isset($data['phone']) || !isset($data['password'])) {
            return ["status" => "error", "message" => "Missing credentials"];
        }

        $customer = new Customer($this->db);
        $user = $customer->authenticate($data['phone'], $data['password']);

        if ($user) {
            unset($user['password_hash']);
            return ["status" => "success", "message" => "Login successful", "data" => $user];
        }
        return ["status" => "error", "message" => "Invalid phone number or password"];
    }

    /**
     * Customer Registration (JSON-API, no session)
     * POST /api/auth/register
     */
    public function register($data)
    {
        $data = sanitize($data);

        if (!isset($data['name']) || !isset($data['phone']) || !isset($data['password'])) {
            return ["status" => "error", "message" => "Incomplete registration data"];
        }

        $customer = new Customer($this->db);

        if ($customer->where('phone_number', $data['phone'])) {
            return ["status" => "error", "message" => "Phone number already registered"];
        }

        if (empty($data['associated_ref_code'])) {
            return ["status" => "error", "message" => "FRM Reference Code is required"];
        }
        $partnerModel = new Partner($this->db);
        $frm = $partnerModel->where('name', $data['associated_ref_code']);
        if (!$frm || $frm[0]['partner_type'] !== 'FRM') {
            return ["status" => "error", "message" => "Invalid FRM Reference Code"];
        }

        $data['password_hash'] = password_hash($data['password'], PASSWORD_BCRYPT);
        unset($data['password']);

        $newId = $customer->create($data);

        if ($newId) {
            return ["status" => "success", "message" => "Registration successful", "data" => ['id' => $newId]];
        }
        return ["status" => "error", "message" => "Registration failed"];
    }

    // ─────────────────────────────────────────────
    // STAFF & PARTNER SESSION-BASED AUTH
    // ─────────────────────────────────────────────

    /**
     * Staff / Partner Login with secure session + cookie
     * POST /api/auth/staff-login
     * Body: { phone, password, redirect? }
     */
    public function staffLogin()
    {
        $data = !empty($_POST) ? $_POST : json_decode(file_get_contents("php://input"), true);
        $data = sanitize($data ?? []);

        if (empty($data['phone']) || empty($data['password'])) {
            return jsonResponse('error', 'Missing credentials');
        }

        $phone = $data['phone'];
        $password = $data['password'];
        $redirect = $data['redirect'] ?? null;

        // 1. Try staff_users first
        $staffModel = new StaffUser($this->db);
        $staff = $staffModel->where('phone_number', $phone);
        if ($staff) {
            $user = $staff[0];
            if (!password_verify($password, $user['password_hash'])) {
                return jsonResponse('error', 'Invalid credentials');
            }
            if ($user['status'] !== 'Active') {
                return jsonResponse('error', 'Account is suspended');
            }
            $sessionData = [
                'id' => $user['id'],
                'name' => $user['name'],
                'role' => $user['role'],
                'type' => 'staff',
                'login_at' => time(),
            ];
            $this->_startSession($sessionData);
            $redirectTo = $redirect ?? $this->_defaultRedirect($user['role']);
            return jsonResponse('success', 'Login successful', [
                'user' => $sessionData,
                'redirect' => $redirectTo
            ]);
        }

        // 2. Try partners
        $partnerModel = new Partner($this->db);
        $partners = $partnerModel->where('phone_number', $phone);
        if ($partners) {
            $user = $partners[0];
            if (!password_verify($password, $user['password_hash'])) {
                return jsonResponse('error', 'Invalid credentials');
            }
            if ($user['status'] !== 'Active') {
                return jsonResponse('error', 'Account is suspended');
            }
            $sessionData = [
                'id' => $user['id'],
                'name' => $user['name'],
                'role' => $user['partner_type'], // SBA | ZBDp | Agent
                'type' => 'partner',
                'login_at' => time(),
            ];
            $this->_startSession($sessionData);
            $redirectTo = $redirect ?? $this->_defaultRedirect($user['partner_type']);
            return jsonResponse('success', 'Login successful', [
                'user' => $sessionData,
                'redirect' => $redirectTo
            ]);
        }

        return jsonResponse('error', 'Invalid credentials');
    }

    /**
     * Staff / Partner Registration
     * POST /api/auth/staff-register
     * Body: { name, phone, password, role, added_by? }
     * Note: Role must be a valid staff role. Intended for SeniorAdmin use.
     */
    public function staffRegister()
    {
        $data = !empty($_POST) ? $_POST : json_decode(file_get_contents("php://input"), true);
        $data = sanitize($data ?? []);

        if (empty($data['name']) || empty($data['phone']) || empty($data['password']) || empty($data['role'])) {
            return jsonResponse('error', 'Incomplete registration data');
        }

        $validRoles = ['Admin', 'SeniorAdmin', 'WHM'];
        if (!in_array($data['role'], $validRoles)) {
            return jsonResponse('error', 'Invalid role specified');
        }

        $staffModel = new StaffUser($this->db);
        if ($staffModel->where('phone_number', $data['phone'])) {
            return jsonResponse('error', 'Phone number already registered');
        }

        $data['password_hash'] = password_hash($data['password'], PASSWORD_BCRYPT);
        unset($data['password']);

        $newId = $staffModel->create([
            'name' => $data['name'],
            'phone_number' => $data['phone'],
            'password_hash' => $data['password_hash'],
            'role' => $data['role'],
            'added_by' => $data['added_by'] ?? null,
        ]);

        if ($newId) {
            $sessionData = [
                'id' => $newId,
                'name' => $data['name'],
                'role' => $data['role'],
                'type' => 'staff',
                'login_at' => time(),
            ];
            $this->_startSession($sessionData);
            return jsonResponse('success', 'Staff registered successfully', [
                'user' => $sessionData,
                'redirect' => $this->_defaultRedirect($data['role'])
            ]);
        }
        return jsonResponse('error', 'Registration failed');
    }

    /**
     * Logout — destroy session + expire cookie
     * POST /api/auth/logout
     */
    public function logout()
    {
        $this->_destroySession();
        // Determine redirect: if a 'redirect' param was sent, use it; else go to a default login page
        $data = !empty($_POST) ? $_POST : json_decode(file_get_contents("php://input"), true);
        $redirectTo = ($data['redirect'] ?? null) ?: 'login.php';
        return jsonResponse('success', 'Logged out successfully', ['redirect' => $redirectTo]);
    }

    /**
     * Check current session state
     * GET /api/auth/check
     * Returns user data if session is valid, error if not
     */
    public function checkSession()
    {
        $this->_initSession();
        if (!empty($_SESSION['user']) && isset($_SESSION['user']['login_at'])) {
            $lifetimeSecs = (int)($this->_getSetting('session_lifetime_minutes', 120) * 60);
            if ((time() - $_SESSION['user']['login_at']) > $lifetimeSecs) {
                $this->_destroySession();
                return jsonResponse('error', 'Session expired', ['redirect' => 'login.php']);
            }
            $user = $_SESSION['user'];
            unset($user['login_at']); // don't expose internally
            return jsonResponse('success', 'Session active', $user);
        }
        return jsonResponse('error', 'Not authenticated', null, 401);
    }

    /**
     * [SCAFFOLD] Verify user (OTP / email link)
     * POST /api/auth/verify-user
     * Placeholder for future verification flow
     */
    public function verifyUser()
    {
        return jsonResponse('error', 'Verification not yet implemented');
    }

    // ─────────────────────────────────────────────
    // PRIVATE HELPERS
    // ─────────────────────────────────────────────

    /**
     * Start a secure PHP session and set cookie
     */
    private function _startSession(array $userData)
    {
        $this->_initSession();
        session_regenerate_id(true); // prevent session fixation
        $_SESSION['user'] = $userData;

        // Set secure session cookie
        $lifetimeSecs = (int)($this->_getSetting('session_lifetime_minutes', 120) * 60);
        $secure = (bool)(int)$this->_getSetting('session_secure_cookie', 0);
        setcookie(
            'ab_session',
            session_id(),
        [
            'expires' => time() + $lifetimeSecs,
            'path' => '/',
            'secure' => $secure,
            'httponly' => true,
            'samesite' => 'Strict',
        ]
        );
    }

    /**
     * Destroy session and expire the cookie
     */
    private function _destroySession()
    {
        $this->_initSession();
        $_SESSION = [];
        session_destroy();
        setcookie('ab_session', '', time() - 3600, '/', '', false, true);
    }

    /**
     * Start session safely (avoid "already started" warnings)
     */
    private function _initSession()
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_name('ab_session');
            session_start();
        }
    }

    /**
     * Read a value from global_settings
     */
    private function _getSetting($key, $default = null)
    {
        try {
            $stmt = $this->db->prepare("SELECT setting_value FROM global_settings WHERE setting_key = ? LIMIT 1");
            $stmt->execute([$key]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            return $row ? $row['setting_value'] : $default;
        }
        catch (Exception $e) {
            return $default;
        }
    }

    /**
     * Map role to default redirect page
     */
    private function _defaultRedirect($role)
    {
        $map = [
            'SeniorAdmin' => 'admin_auctions.php',
            'Admin' => 'admin_auctions.php',
            'WHM' => 'whm_dashboard.php',
            'SBA' => 'sba_dashboard.php',
            'ZBDp' => 'zbdp_dashboard.php',
            'Agent' => 'agent_dashboard.php',
        ];
        return $map[$role] ?? 'index.php';
    }
}
?>
