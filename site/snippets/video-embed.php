<?php
/** Expects: $video (Page representing a video) */

$url     = $video->videoUrl()->toString();
$type    = $video->videoType()->or('youtube')->value();
$start   = $video->startTime()->value();
$end     = $video->endTime()->value();

// Convert "2m30s" / "1h2m" / "46m" → total seconds.
function rmb_time_to_seconds(?string $t): int {
    if (!$t) return 0;
    $t = strtolower(trim($t));
    if (ctype_digit($t)) return (int)$t;
    preg_match_all('/(\d+)\s*([hms])/i', $t, $m, PREG_SET_ORDER);
    $s = 0;
    foreach ($m as $part) {
        $n = (int)$part[1];
        $u = strtolower($part[2]);
        $s += $u === 'h' ? $n * 3600 : ($u === 'm' ? $n * 60 : $n);
    }
    return $s;
}

$startSec = rmb_time_to_seconds($start);
$endSec   = rmb_time_to_seconds($end);

if ($type === 'youtube') {
    preg_match('~(?:youtu\.be/|youtube\.com/(?:watch\?v=|embed/|shorts/))([\w-]{11})~', $url, $m);
    $id = $m[1] ?? null;
    if (!$id) return;
    $src = "https://www.youtube-nocookie.com/embed/{$id}";
    $q = [];
    if ($startSec > 0) $q['start'] = $startSec;
    if ($endSec   > 0) $q['end']   = $endSec;
    $q['rel'] = 0;
    $src .= '?' . http_build_query($q);
} elseif ($type === 'vimeo') {
    preg_match('~vimeo\.com/(\d+)~', $url, $m);
    $id = $m[1] ?? null;
    if (!$id) return;
    $src = "https://player.vimeo.com/video/{$id}";
    if ($startSec > 0) $src .= '#t=' . $startSec . 's';
}
?>
<div class="video-embed">
    <iframe src="<?= $src ?>"
            title="<?= $video->title()->escape() ?>"
            frameborder="0"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen></iframe>
</div>
