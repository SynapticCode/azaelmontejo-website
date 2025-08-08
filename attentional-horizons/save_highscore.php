<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');

$highscore_file = '/home/monte/gamedata/highscores.csv'; // Replace 'monte'

if (!isset($_POST['initials']) || !isset($_POST['score'])) {
    http_response_code(400);
    exit;
}

$initials = substr(preg_replace("/[^a-zA-Z0-9]+/", "", $_POST['initials']), 0, 3);
$score = filter_var($_POST['score'], FILTER_VALIDATE_INT);

if ($initials && $score !== false) {
    $line = time() . "," . $initials . "," . $score . "\n";
    @file_put_contents($highscore_file, $line, FILE_APPEND | LOCK_EX);
    echo json_encode(['status' => 'success']);
} else {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid data.']);
}

exit;
?>
