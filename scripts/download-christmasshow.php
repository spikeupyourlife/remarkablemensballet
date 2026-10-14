<?php
/**
 * Bulk-download all photos from christmasshow.co.nz year pages.
 *
 * For each year we know about, downloads every photo URL into:
 *   D:\temp\Mens Ballet\christmasshow-YYYY\
 *
 * Files are renamed YYYYMMDD_NNN.jpg so the event-aware importer
 * picks them up automatically once you've pruned non-RMB shots.
 *
 * - Sequential years (2018, 2020, 2022) are generated from a pattern.
 * - Years with gaps (2019, 2021, 2024, 2025) read URL lists from
 *   scripts/data/christmasshow-YYYY.txt.
 *
 * Re-runs are idempotent — already-downloaded files are skipped.
 *
 * Usage:
 *   php scripts/download-christmasshow.php
 *   php scripts/download-christmasshow.php 2024 2025          # subset
 *   php scripts/download-christmasshow.php --dry-run          # plan only
 */

const TARGET_ROOT = 'D:/temp/Mens Ballet';
const UA          = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
const PARALLEL    = 4; // be polite to their server

// Per-year plan. 'date' becomes the filename prefix → event-album router.
$plan = [
    '2018' => [
        'date'    => '20181208',
        'pattern' => 'https://christmasshow.co.nz/wp-content/uploads/2019/11/queenstown-christmas-show-2018-%03d.jpg',
        'range'   => [1, 380],
        'scaled'  => [3, 36, 224],   // these have -scaled before .jpg
    ],
    '2019' => [
        'date'      => '20191215',
        'url_file'  => __DIR__ . '/data/christmasshow-2019.txt',
    ],
    '2020' => [
        'date'    => '20201213',
        'pattern' => 'https://christmasshow.co.nz/wp-content/uploads/2020/12/2020-christmas-show-%03d.jpg',
        'range'   => [1, 391],
    ],
    '2021' => [
        'date'      => '20211211',
        'url_file'  => __DIR__ . '/data/christmasshow-2021.txt',
    ],
    '2022' => [
        'date'    => '20221210',
        'pattern' => 'https://christmasshow.co.nz/wp-content/uploads/2022/12/SV-Xmas-Show-2022-%d-of-222.web_.jpg',
        'range'   => [1, 222],
    ],
    '2024' => [
        'date'      => '20241208',
        'url_file'  => __DIR__ . '/data/christmasshow-2024.txt',
    ],
    '2025' => [
        'date'      => '20251207',
        'url_file'  => __DIR__ . '/data/christmasshow-2025.txt',
    ],
];

$args = array_slice($argv, 1);
$dryRun = in_array('--dry-run', $args, true);
$args = array_filter($args, fn($a) => $a[0] !== '-');
$years = $args ?: array_keys($plan);

$totalQueued = 0; $totalDownloaded = 0; $totalSkipped = 0; $totalFailed = 0;

foreach ($years as $year) {
    if (!isset($plan[$year])) { fwrite(STDERR, "Unknown year: $year\n"); continue; }
    $info = $plan[$year];
    $dir  = TARGET_ROOT . "/christmasshow-$year";
    if (!is_dir($dir)) mkdir($dir, 0755, true);

    // Build URL list
    $urls = [];
    if (isset($info['pattern'])) {
        [$start, $end] = $info['range'];
        $scaled = array_flip($info['scaled'] ?? []);
        for ($i = $start; $i <= $end; $i++) {
            $url = sprintf($info['pattern'], $i);
            if (isset($scaled[$i])) {
                $url = preg_replace('/\.jpg$/', '-scaled.jpg', $url);
            }
            $urls[] = $url;
        }
    } elseif (isset($info['url_file'])) {
        if (!is_file($info['url_file'])) {
            fwrite(STDERR, "Missing url file: {$info['url_file']}\n");
            continue;
        }
        $lines = file($info['url_file'], FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            $line = trim($line);
            if ($line === '' || $line[0] === '#') continue;
            // Accept "URL: https://..." or plain "https://..."
            if (preg_match('~https?://\S+~', $line, $m)) $urls[] = $m[0];
        }
    } else {
        fwrite(STDERR, "Year $year has neither pattern nor url_file\n");
        continue;
    }

    echo "── $year ── " . count($urls) . " urls → $dir\n";
    $totalQueued += count($urls);

    if ($dryRun) continue;

    // Build (url, destination) pairs
    $jobs = [];
    $seq = 1;
    foreach ($urls as $url) {
        $out = sprintf('%s/%s_%03d.jpg', $dir, $info['date'], $seq++);
        if (file_exists($out) && filesize($out) > 0) { $totalSkipped++; continue; }
        $jobs[] = ['url' => $url, 'out' => $out];
    }

    // Parallel download using curl_multi
    $batches = array_chunk($jobs, PARALLEL);
    $done = 0; $failed = 0;
    foreach ($batches as $batch) {
        $mh = curl_multi_init();
        $handles = [];
        $fps = [];
        foreach ($batch as $j) {
            $ch = curl_init();
            $fp = fopen($j['out'] . '.part', 'wb');
            curl_setopt_array($ch, [
                CURLOPT_URL            => $j['url'],
                CURLOPT_FILE           => $fp,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_USERAGENT      => UA,
                CURLOPT_TIMEOUT        => 60,
                CURLOPT_CONNECTTIMEOUT => 15,
                CURLOPT_FAILONERROR    => true,
            ]);
            curl_multi_add_handle($mh, $ch);
            // Use spl_object_id — PHP 8+ CurlHandle is an object and (int) casting
            // collides (all become 1), silently overwriting siblings in this dict.
            $handles[spl_object_id($ch)] = ['ch' => $ch, 'fp' => $fp, 'job' => $j];
        }
        do {
            curl_multi_exec($mh, $running);
            curl_multi_select($mh, 1.0);
        } while ($running > 0);

        foreach ($handles as $h) {
            $code = curl_getinfo($h['ch'], CURLINFO_HTTP_CODE);
            $size = curl_getinfo($h['ch'], CURLINFO_SIZE_DOWNLOAD);
            fclose($h['fp']);
            curl_multi_remove_handle($mh, $h['ch']);
            curl_close($h['ch']);
            if ($code === 200 && $size > 0) {
                rename($h['job']['out'] . '.part', $h['job']['out']);
                $done++;
            } else {
                @unlink($h['job']['out'] . '.part');
                $failed++;
                fwrite(STDERR, "  ! HTTP $code for {$h['job']['url']}\n");
            }
        }
        curl_multi_close($mh);
        echo "  [" . str_pad((string)($done + $failed), 4) . " / " . count($jobs) . "]\r";
    }
    echo "  $year: $done ok, $failed failed\n";
    $totalDownloaded += $done;
    $totalFailed += $failed;
}

echo str_repeat('-', 60) . "\n";
echo "Queued:     $totalQueued\n";
echo "Downloaded: $totalDownloaded\n";
echo "Skipped:    $totalSkipped\n";
echo "Failed:     $totalFailed\n";
