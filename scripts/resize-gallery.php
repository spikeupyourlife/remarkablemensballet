<?php
/**
 * One-shot: resize JPEGs already in content/4_gallery in-place.
 *
 * The site only needs screen-resolution images, not print masters. This
 * script walks every image under /content/4_gallery, and if the longest
 * edge is bigger than --max-side, it rewrites the file at that size with
 * the given JPEG quality. EXIF orientation is honoured during rotation.
 *
 * THIS OVERWRITES THE ORIGINAL FILES. Run --dry-run first.
 *
 * Usage:
 *   php scripts/resize-gallery.php --dry-run
 *   php scripts/resize-gallery.php --max-side=2400 --jpeg-quality=85
 */

require __DIR__ . '/../kirby/bootstrap.php';

const GALLERY = __DIR__ . '/../content/4_gallery';

function fmtB(int $b): string {
    if ($b < 1024)       return "$b B";
    if ($b < 1048576)    return number_format($b / 1024, 1) . " KB";
    if ($b < 1073741824) return number_format($b / 1048576, 1) . " MB";
    return number_format($b / 1073741824, 2) . " GB";
}

$dryRun = false;
$maxSide = 2400;
$quality = 85;
foreach (array_slice($argv, 1) as $arg) {
    if ($arg === '--dry-run' || $arg === '-n') $dryRun = true;
    elseif (preg_match('/^--max-side=(\d+)$/', $arg, $m)) $maxSide = (int) $m[1];
    elseif (preg_match('/^--jpeg-quality=(\d+)$/', $arg, $m)) $quality = (int) $m[1];
}

echo "Target:      " . realpath(GALLERY) . "\n";
echo "Max side:    {$maxSide}px\n";
echo "JPEG q:      {$quality}\n";
echo "Mode:        " . ($dryRun ? "DRY RUN" : "WILL OVERWRITE FILES") . "\n";
echo str_repeat('-', 60) . "\n";

$totalBefore = 0;
$totalAfter  = 0;
$resized = 0;
$skipped = 0;
$errors  = 0;

$rii = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator(GALLERY, FilesystemIterator::SKIP_DOTS)
);

foreach ($rii as $f) {
    if (!$f->isFile()) continue;
    $ext = strtolower($f->getExtension());
    if (!in_array($ext, ['jpg', 'jpeg'], true)) continue;

    $path = $f->getPathname();
    $info = @getimagesize($path);
    if (!$info) { $errors++; continue; }
    [$w, $h] = $info;
    $longest = max($w, $h);
    $before = filesize($path) ?: 0;
    $totalBefore += $before;

    if ($longest <= $maxSide) {
        $skipped++;
        $totalAfter += $before;
        continue;
    }

    if ($dryRun) {
        $ratio = $maxSide / $longest;
        $newW  = (int) round($w * $ratio);
        $newH  = (int) round($h * $ratio);
        echo "  would resize  " . substr($path, strlen(GALLERY) + 1) . "  ({$w}x{$h} → {$newW}x{$newH}, " . fmtB($before) . ")\n";
        $resized++;
        $totalAfter += (int) round($before * ($ratio * $ratio) * 0.6); // rough estimate
        continue;
    }

    $img = @imagecreatefromjpeg($path);
    if (!$img) { $errors++; $totalAfter += $before; continue; }

    $exif = @exif_read_data($path);
    $orient = (int) ($exif['Orientation'] ?? 1);
    switch ($orient) {
        case 3: $img = imagerotate($img, 180, 0); break;
        case 6: $img = imagerotate($img, -90, 0); [$w, $h] = [$h, $w]; break;
        case 8: $img = imagerotate($img, 90,  0); [$w, $h] = [$h, $w]; break;
    }

    $ratio = $maxSide / max($w, $h);
    $newW  = max(1, (int) round($w * $ratio));
    $newH  = max(1, (int) round($h * $ratio));
    $dst   = imagecreatetruecolor($newW, $newH);
    imagecopyresampled($dst, $img, 0, 0, 0, 0, $newW, $newH, $w, $h);
    imagedestroy($img);

    // Write to temp file first, then atomic-replace, so we don't half-write
    // a file if PHP crashes mid-write.
    $tmp = $path . '.resizing';
    if (!imagejpeg($dst, $tmp, $quality)) {
        imagedestroy($dst);
        @unlink($tmp);
        $errors++;
        $totalAfter += $before;
        continue;
    }
    imagedestroy($dst);

    if (!rename($tmp, $path)) {
        @unlink($tmp);
        $errors++;
        $totalAfter += $before;
        continue;
    }

    $after = filesize($path) ?: 0;
    $totalAfter += $after;
    $resized++;

    if ($resized % 20 === 0) echo "  [$resized resized]\n";
}

echo str_repeat('-', 60) . "\n";
echo "Resized:  $resized\n";
echo "Skipped:  $skipped (already <= {$maxSide}px)\n";
echo "Errors:   $errors\n";
echo "Before:   " . fmtB($totalBefore) . "\n";
echo "After:    " . fmtB($totalAfter) . "\n";
$saved = $totalBefore - $totalAfter;
$pct = $totalBefore > 0 ? round(100 * $saved / $totalBefore, 1) : 0;
echo "Saved:    " . fmtB($saved) . " ({$pct}%)" . ($dryRun ? " [estimate]" : "") . "\n";

if (!$dryRun && $resized > 0) {
    echo "\nNote: Kirby's resized image cache lives in /media/. Cleared on next render.\n";
}
