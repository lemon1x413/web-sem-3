<?php
header('Content-Type: application/json');

$filename = 'data.json';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $input = file_get_contents('php://input');
    
    if ($input) {
        file_put_contents($filename, $input);
        echo json_encode(["status" => "success", "message" => "Data saved"]);
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "No data provided"]);
    }
} elseif ($method === 'GET') {
    if (file_exists($filename)) {
        echo file_get_contents($filename);
    } else {
        echo json_encode([]);
    }
}
?>