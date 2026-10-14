<?php
/**
 * Bulk-import photos from a folder into Kirby gallery albums.
 *
 * Auto-routes each photo into the right EVENT album based on its EXIF date:
 *   - Nov-Dec → "Christmas Show <year>"
 *   - Mar-May → "Arrowtown Autumn Festival <year>"
 *   - Jun-Aug → "Queenstown Winter Festival <year>"
 *   - other   → "Other — <date>" (creates a dated misc album for you to rename)
 *
 * Existing albums are EXTENDED, not duplicated. Re-running is safe.
 * The script matches existing albums by the slug suffix (e.g. any folder
 * whose name ends with "_christmas-show-2024"), so manual numeric-prefix
 * renames in the Panel still work.
 *
 * Usage:
 *   php scripts/import-photos.php "D:\temp\Mens Ballet"
 *   php scripts/import-photos.php "D:\temp\Mens Ballet" --dry-run
 *   php scripts/import-photos.php "D:\temp\Mens Ballet" --max-side=2400 --jpeg-quality=85
 *
 * Subfolders are walked recursively, so the team can drop in nested folders.
 *
 * --max-side=N         resize JPEGs so the longest edge is N pixels (default: 0 = no resize)
 * --jpeg-quality=N     JPEG output quality 1-100 (default: 85)
 */

require __DIR__ . '/../kirby/bootstrap.php';

const GALLERY_ROOT       = __DIR__ . '/../content/4_gallery';
const ACCEPTED_IMG_EXT   = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif'];
const ACCEPTED_VIDEO_EXT = ['mp4', 'mov', 'm4v', 'webm'];

$source = null;
$dryRun = false;
$maxSide = 0;
$jpegQuality = 85;
foreach (array_slice($argv, 1) as $arg) {
    if ($arg === '--dry-run' || $arg === '-n') $dryRun = true;
    elseif (preg_match('/^--max-side=(\d+)$/', $arg, $m)) $maxSide = (int)$m[1];
    elseif (preg_match('/^--jpeg-quality=(\d+)$/', $arg, $m)) $jpegQuality = (int)$m[1];
    elseif (!str_starts_with($arg, '-')) $source = $arg;
}

if (!$source || !is_dir($source)) {
    fwrite(STDERR, "Usage: php scripts/import-photos.php <source-folder> [--dry-run] [--max-side=N] [--jpeg-quality=N]\n");
    exit(1);
}

echo "Source: {$source}\n";
echo "Target: " . realpath(GALLERY_ROOT) . "\n";
if ($dryRun) echo "*** DRY RUN — no files will be written ***\n";
if ($maxSide > 0) echo "Resize: max longest edge = {$maxSide}px @ q={$jpegQuality}\n";
echo str_repeat('-', 60) . "\n";

/**
 * Copy a JPEG to $dest. If $maxSide > 0 and the longest edge exceeds it,
 * resize while honouring EXIF orientation. Returns [ok, srcBytes, dstBytes].
 */
function copyJpegMaybeResize(string $src, string $dest, int $maxSide, int $quality): array {
    $srcBytes = filesize($src) ?: 0;

    if ($maxSide <= 0) {
        $ok = @copy($src, $dest);
        return [$ok, $srcBytes, $ok ? ((int) filesize($dest)) : 0];
    }

    $info = @getimagesize($src);
    if (!$info) {
        // Not a recognisable image; fall back to plain copy.
        $ok = @copy($src, $dest);
        return [$ok, $srcBytes, $ok ? ((int) filesize($dest)) : 0];
    }
    [$w, $h] = $info;
    $longest = max($w, $h);

    $exif   = @exif_read_data($src);
    $orient = (int)($exif['Orientation'] ?? 1);

    // No resize needed AND no rotation needed → plain copy.
    if ($longest <= $maxSide && in_array($orient, [0, 1], true)) {
        $ok = @copy($src, $dest);
        return [$ok, $srcBytes, $ok ? ((int) filesize($dest)) : 0];
    }

    $img = @imagecreatefromjpeg($src);
    if (!$img) {
        $ok = @copy($src, $dest);
        return [$ok, $srcBytes, $ok ? ((int) filesize($dest)) : 0];
    }

    // Apply EXIF rotation so the resized output is upright.
    switch ($orient) {
        case 3: $img = imagerotate($img, 180, 0); break;
        case 6: $img = imagerotate($img, -90, 0); [$w, $h] = [$h, $w]; break;
        case 8: $img = imagerotate($img, 90,  0); [$w, $h] = [$h, $w]; break;
    }

    if ($longest > $maxSide) {
        $ratio = $maxSide / max($w, $h);
        $newW  = max(1, (int) round($w * $ratio));
        $newH  = max(1, (int) round($h * $ratio));
        $dst   = imagecreatetruecolor($newW, $newH);
        imagecopyresampled($dst, $img, 0, 0, 0, 0, $newW, $newH, $w, $h);
        imagedestroy($img);
        $img = $dst;
    }

    $ok = imagejpeg($img, $dest, $quality);
    imagedestroy($img);

    return [$ok, $srcBytes, $ok ? ((int) filesize($dest)) : 0];
}

// ---------- Helpers ----------------------------------------------------------

function gpsDecimal(array $parts, string $ref): ?float {
    if (count($parts) < 3) return null;
    $deg = parseRational($parts[0]);
    $min = parseRational($parts[1]);
    $sec = parseRational($parts[2]);
    if ($deg === null || $min === null || $sec === null) return null;
    $val = $deg + ($min / 60) + ($sec / 3600);
    if (in_array(strtoupper($ref), ['S', 'W'])) $val = -$val;
    return $val;
}

function parseRational($r): ?float {
    if (is_numeric($r)) return (float)$r;
    if (is_string($r) && strpos($r, '/') !== false) {
        [$n, $d] = explode('/', $r);
        $d = (float)$d;
        return $d == 0.0 ? null : (float)$n / $d;
    }
    return null;
}

function extractDate(string $path): array {
    $exif = @exif_read_data($path, 'EXIF', true);
    if (!empty($exif['EXIF']['DateTimeOriginal'])) {
        $dt = DateTime::createFromFormat('Y:m:d H:i:s', $exif['EXIF']['DateTimeOriginal']);
        if ($dt) return [$dt->format('Y-m-d'), $dt->format('Y-m-d H:i:s'), 'exif'];
    }
    $base = basename($path);
    if (preg_match('/^(?:IMG_|VID_)?(\d{4})(\d{2})(\d{2})[-_]?(\d{2})?(\d{2})?(\d{2})?/i', $base, $m)) {
        $H = $m[4] ?? '00'; $M = $m[5] ?? '00'; $S = $m[6] ?? '00';
        $dt = DateTime::createFromFormat('Y-m-d H:i:s', "{$m[1]}-{$m[2]}-{$m[3]} $H:$M:$S");
        if ($dt && checkdate((int)$m[2], (int)$m[3], (int)$m[1])) {
            return [$dt->format('Y-m-d'), $dt->format('Y-m-d H:i:s'), 'filename'];
        }
    }
    if (preg_match('/^IMG-(\d{4})(\d{2})(\d{2})-/i', $base, $m)) {
        $dt = DateTime::createFromFormat('Y-m-d H:i:s', "{$m[1]}-{$m[2]}-{$m[3]} 12:00:00");
        if ($dt) return [$dt->format('Y-m-d'), $dt->format('Y-m-d H:i:s'), 'filename'];
    }
    if (preg_match('/^FB_IMG_(\d{10,})/i', $base, $m)) {
        $ts = strlen($m[1]) > 10 ? intdiv((int)$m[1], 1000) : (int)$m[1];
        $dt = (new DateTime('@' . $ts))->setTimezone(new DateTimeZone('Pacific/Auckland'));
        return [$dt->format('Y-m-d'), $dt->format('Y-m-d H:i:s'), 'filename'];
    }
    if (preg_match('/^Screenshot_(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})(\d{2})/i', $base, $m)) {
        $dt = DateTime::createFromFormat('Y-m-d H:i:s', "{$m[1]}-{$m[2]}-{$m[3]} {$m[4]}:{$m[5]}:{$m[6]}");
        if ($dt) return [$dt->format('Y-m-d'), $dt->format('Y-m-d H:i:s'), 'filename'];
    }
    $dt = (new DateTime('@' . filemtime($path)))->setTimezone(new DateTimeZone('Pacific/Auckland'));
    return [$dt->format('Y-m-d'), $dt->format('Y-m-d H:i:s'), 'mtime'];
}

/**
 * Map a photo date to an event album spec.
 */
function eventForDate(string $date): array {
    [$y, $m] = array_map('intval', explode('-', $date));
    if ($m >= 11) {
        return [
            'slug'        => "christmas-show-$y",
            'title'       => "Christmas Show $y",
            'description' => "",
            'location'    => 'Queenstown Events Centre',
            'showDate'    => "$y-12-08",
        ];
    }
    if ($m >= 3 && $m <= 5) {
        return [
            'slug'        => "arrowtown-autumn-festival-$y",
            'title'       => "Arrowtown Autumn Festival $y",
            'description' => "",
            'location'    => 'Arrowtown',
            'showDate'    => "$y-04-25",
        ];
    }
    if ($m >= 6 && $m <= 8) {
        return [
            'slug'        => "queenstown-winter-festival-$y",
            'title'       => "Queenstown Winter Festival $y",
            'description' => "",
            'location'    => 'Queenstown',
            'showDate'    => "$y-06-25",
        ];
    }
    return [
        'slug'        => "other-$date",
        'title'       => "Other — $date",
        'description' => "",
        'location'    => 'Queenstown',
        'showDate'    => $date,
    ];
}

/**
 * Find an existing album folder by its slug suffix.
 * Handles forward AND backward slashes (Windows).
 */
function findAlbumDir(string $slug): ?string {
    foreach (glob(GALLERY_ROOT . '/*', GLOB_ONLYDIR) as $d) {
        $base = basename($d);
        if (preg_match('/^\d+_(.+)$/', $base, $m) && $m[1] === $slug) {
            return $d;
        }
    }
    return null;
}

function nextAlbumPrefix(): int {
    $max = 0;
    foreach (glob(GALLERY_ROOT . '/*', GLOB_ONLYDIR) as $d) {
        $base = basename($d);
        if (preg_match('/^(\d+)_/', $base, $m)) {
            $max = max($max, (int)$m[1]);
        }
    }
    return $max + 1;
}

// ---------- 1. Discover + group ---------------------------------------------

if (!is_dir(GALLERY_ROOT)) mkdir(GALLERY_ROOT, 0755, true);

$files = [];
$rii = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($source, FilesystemIterator::SKIP_DOTS)
);
foreach ($rii as $f) {
    if (!$f->isFile()) continue;
    $ext = strtolower($f->getExtension());
    if (!in_array($ext, ACCEPTED_IMG_EXT) && !in_array($ext, ACCEPTED_VIDEO_EXT)) continue;
    [$date, $dt, $src] = extractDate($f->getPathname());
    $event = eventForDate($date);
    $files[] = [
        'full'    => $f->getPathname(),
        'name'    => $f->getFilename(),
        'ext'     => $ext,
        'date'    => $date,
        'dt'      => $dt,
        'src'     => $src,
        'event'   => $event,
        'isVideo' => in_array($ext, ACCEPTED_VIDEO_EXT),
    ];
}

echo "Discovered " . count($files) . " files\n";

if (count($files) === 0) {
    echo "Nothing to import.\n";
    exit;
}

$grouped = [];
foreach ($files as $f) $grouped[$f['event']['slug']][] = $f;
krsort($grouped); // newest year first

echo "Event routing:\n";
foreach ($grouped as $slug => $list) {
    $existing = findAlbumDir($slug);
    $note = $existing ? '(extending ' . basename($existing) . ')' : '(new album)';
    echo "  " . str_pad($slug, 35) . str_pad(count($list) . " files", 12) . $note . "\n";
}
echo str_repeat('-', 60) . "\n";

if ($dryRun) { echo "Dry run — nothing written.\n"; exit; }

// ---------- 2. Place files ---------------------------------------------------

$copied = 0; $skipped = 0;
$totalSrcBytes = 0; $totalDstBytes = 0;

foreach ($grouped as $slug => $list) {
    $info  = $list[0]['event'];
    $album = findAlbumDir($slug);
    if (!$album) {
        $prefix = nextAlbumPrefix();
        $album = sprintf('%s/%d_%s', GALLERY_ROOT, $prefix, $slug);
        mkdir($album, 0755, true);

        $albumTxt = "$album/album.txt";
        $content  = "Title: {$info['title']}\n\n----\n\nHeadline: {$info['title']}\n\n----\n\n";
        $content .= "Description:\n\n{$info['description']}\n\n----\n\n";
        $content .= "Showdate: {$info['showDate']}\n\n----\n\nLocation: {$info['location']}\n\n----\n\n";
        $content .= "Featured: false\n\n----\n\nShowinlist: true\n";
        file_put_contents($albumTxt, $content);
    }

    foreach ($list as $f) {
        $dest = $album . '/' . $f['name'];
        if (file_exists($dest)) { $skipped++; continue; }

        $isJpeg = !$f['isVideo'] && in_array($f['ext'], ['jpg', 'jpeg'], true);

        // Extract EXIF BEFORE the (potentially) lossy resize, so we keep the
        // metadata in the sidecar even if the resized image strips it.
        $exif = null;
        if (!$f['isVideo']) {
            $exif = @exif_read_data($f['full'], 'IFD0,EXIF,GPS', true);
        }

        if ($isJpeg) {
            [$ok, $srcB, $dstB] = copyJpegMaybeResize($f['full'], $dest, $maxSide, $jpegQuality);
            if (!$ok) {
                fwrite(STDERR, "  ! copy/resize failed: {$f['name']}\n");
                continue;
            }
            $totalSrcBytes += $srcB;
            $totalDstBytes += $dstB;
        } else {
            if (!@copy($f['full'], $dest)) {
                fwrite(STDERR, "  ! copy failed: {$f['name']}\n");
                continue;
            }
            $sz = filesize($dest) ?: 0;
            $totalSrcBytes += $sz;
            $totalDstBytes += $sz;
        }

        if (!$f['isVideo']) {
            $camera = trim(($exif['IFD0']['Make'] ?? '') . ' ' . ($exif['IFD0']['Model'] ?? ''));
            $lat = $lng = '';
            if (!empty($exif['GPS']['GPSLatitude']) && !empty($exif['GPS']['GPSLatitudeRef'])) {
                $v = gpsDecimal($exif['GPS']['GPSLatitude'], $exif['GPS']['GPSLatitudeRef']);
                $lat = $v === null ? '' : number_format($v, 6);
            }
            if (!empty($exif['GPS']['GPSLongitude']) && !empty($exif['GPS']['GPSLongitudeRef'])) {
                $v = gpsDecimal($exif['GPS']['GPSLongitude'], $exif['GPS']['GPSLongitudeRef']);
                $lng = $v === null ? '' : number_format($v, 6);
            }

            $sidecar = $dest . '.txt';
            $txt  = "Template: image\n\n----\n\nCaption:\n\n----\n\nAlt:\n\n----\n\nCredit:\n\n----\n\n";
            $txt .= "Takenat: {$f['dt']}\n\n----\n\nIscover: false\n\n----\n\n";
            $txt .= "Camera: {$camera}\n\n----\n\nLens:\n\n----\n\n";
            $txt .= "Gpslat: {$lat}\n\n----\n\nGpslng: {$lng}\n\n----\n\n";
            $txt .= "Originalfilename: {$f['name']}\n";
            file_put_contents($sidecar, $txt);
        }
        $copied++;
    }
    $total = 0;
    foreach (glob("$album/*.{jpg,jpeg,png,webp,heic,heif,mp4,mov,m4v,webm}", GLOB_BRACE) as $_) $total++;
    echo "  ✓ " . basename($album) . " — {$total} files total\n";
}

function fmtBytes(int $b): string {
    if ($b < 1024)       return "{$b} B";
    if ($b < 1048576)    return number_format($b / 1024, 1) . " KB";
    if ($b < 1073741824) return number_format($b / 1048576, 1) . " MB";
    return number_format($b / 1073741824, 2) . " GB";
}

echo str_repeat('-', 60) . "\n";
echo "Copied: {$copied}  Skipped (already present): {$skipped}\n";
if ($maxSide > 0 && $totalSrcBytes > 0) {
    $saved = $totalSrcBytes - $totalDstBytes;
    $pct   = $totalSrcBytes > 0 ? round(100 * $saved / $totalSrcBytes, 1) : 0;
    echo "Source bytes:  " . fmtBytes($totalSrcBytes) . "\n";
    echo "Output bytes:  " . fmtBytes($totalDstBytes) . "\n";
    echo "Saved:         " . fmtBytes($saved) . " ({$pct}%)\n";
}
