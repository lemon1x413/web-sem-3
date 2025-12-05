<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$file = 'log.json';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if ($input) {
        $input['serverTime'] = date("Y-m-d H:i:s.u"); 
        
        $currentData = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
        if (!is_array($currentData)) $currentData = [];
        
        $currentData[] = $input;
        
        file_put_contents($file, json_encode($currentData, JSON_PRETTY_PRINT));
        
        echo json_encode(["status" => "success", "serverTime" => $input['serverTime']]);
    } else {
        echo json_encode(["status" => "error", "message" => "No data"]);
    }
} elseif ($method === 'GET') {
    if (file_exists($file)) {
        echo file_get_contents($file);
    } else {
        echo json_encode([]);
    }
} elseif ($method === 'DELETE') {
    file_put_contents($file, json_encode([]));
    echo json_encode(["status" => "cleared"]);
}
?>