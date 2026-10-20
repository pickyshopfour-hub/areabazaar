<?php
/**
 * REST API Router
 * AreaBazaar PHP/MySQL REST API
 */

class Router
{
    private $routes = [];

    /**
     * Register a GET route
     */
    public function get($path, $callback)
    {
        $this->routes['GET'][$path] = $callback;
    }

    /**
     * Register a POST route
     */
    public function post($path, $callback)
    {
        $this->routes['POST'][$path] = $callback;
    }

    /**
     * Dispatch the request
     */
    public function dispatch($uri, $method)
    {
        // Normalize URI
        $uri = parse_url($uri, PHP_URL_PATH);
        $uri = str_replace('/areabazaar/public/', '', $uri);
        $uri = str_replace('index.php/', '', $uri); // Handle explicit index.php in URL
        $uri = trim($uri, '/');

        if (isset($this->routes[$method])) {
            foreach ($this->routes[$method] as $path => $callback) {
                // Simple exact match for now
                if ($path === $uri) {
                    return $this->execute($callback);
                }
            }
        }

        return jsonResponse('error', "No route found for $method $uri");
    }

    /**
     * Execute the controller action
     */
    private function execute($callback)
    {
        if (is_array($callback)) {
            $controllerName = $callback[0];
            $methodName = $callback[1];

            require_once "../core/Controllers/$controllerName.php";

            $database = new Database();
            $db = $database->getConnection();

            $controller = new $controllerName($db);

            // Collect Input Data
            $input = json_decode(file_get_contents("php://input"), true);
            if (!$input)
                $input = array_merge($_POST, $_GET);

            // Pass input to the method
            $result = $controller->$methodName($input);

            // If the controller returns an array, convert to standard JSON response
            if (is_array($result)) {
                $status = $result['status'] ?? 'success';
                $message = $result['message'] ?? '';
                $data = $result['data'] ?? (isset($result['status']) ? null : $result);
                jsonResponse($status, $message, $data);
            }

            return $result;
        }

        return call_user_func($callback);
    }
}
?>
