<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Log access to this script
file_put_contents('data/debug_log.txt', date('Y-m-d H:i:s') . " - Script accessed\n", FILE_APPEND);

// Check if this is a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    file_put_contents('data/debug_log.txt', date('Y-m-d H:i:s') . " - Not a POST request\n", FILE_APPEND);
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get the data from the POST request
$raw_data = file_get_contents('php://input');
file_put_contents('data/debug_log.txt', date('Y-m-d H:i:s') . " - Raw data: " . substr($raw_data, 0, 100) . "...\n", FILE_APPEND);

$post_data = json_decode($raw_data, true);

// Check if JSON decoding was successful
if ($post_data === null) {
    file_put_contents('data/debug_log.txt', date('Y-m-d H:i:s') . " - JSON decode error: " . json_last_error_msg() . "\n", FILE_APPEND);
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
    exit;
}

// Check if required fields exist
if (!isset($post_data['filedata']) || !isset($post_data['filename'])) {
    file_put_contents('data/debug_log.txt', date('Y-m-d H:i:s') . " - Missing required fields\n", FILE_APPEND);
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

$data = $post_data['filedata'];
$filename = "data/" . basename($post_data['filename']); // Sanitize filename

try {
    // Write the data to the file
    $handle = fopen($filename, 'w'); // 'w' to create or overwrite
    if ($handle === false) {
        throw new Exception("Could not open file for writing");
    }
    
    $bytes_written = fwrite($handle, $data);
    if ($bytes_written === false) {
        throw new Exception("Could not write to file");
    }
    
    fclose($handle);
    
    file_put_contents('data/debug_log.txt', date('Y-m-d H:i:s') . " - Successfully wrote $bytes_written bytes to $filename\n", FILE_APPEND);
    
    // Return success response
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Data saved successfully']);
    
} catch (Exception $e) {
    file_put_contents('data/debug_log.txt', date('Y-m-d H:i:s') . " - Error: " . $e->getMessage() . "\n", FILE_APPEND);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>
