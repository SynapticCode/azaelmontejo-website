<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$highscore_file = '/home/monte/gamedata/highscores.csv'; // Replace 'monte'
$scores = [];

if (file_exists($highscore_file)) {
    if (($handle = fopen($highscore_file, "r")) !== FALSE) {
        while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
            if (count($data) === 3) {
                $scores[] = ['timestamp' => $data[0], 'initials' => $data[1], 'score' => (int)$data[2]];
            }
        }
        fclose($handle);
    }
}

// Sort by score descending
usort($scores, function($a, $b) {
    return $b['score'] - $a['score'];
});

// Return top 10
echo json_encode(array_slice($scores, 0, 10));
exit;
?>
