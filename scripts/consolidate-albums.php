<?php
/**
 * Consolidate date-grouped gallery albums into event-based ones.
 *
 * Moves photos (and their .txt sidecars) from the day-by-day albums
 * the importer made into new "event" albums. Old empty folders are removed.
 *
 * Safe to re-run: existing destination files are not overwritten.
 *
 * Usage:
 *   php scripts/consolidate-albums.php
 */

require __DIR__ . '/../kirby/bootstrap.php';

const GALLERY = __DIR__ . '/../content/4_gallery';

$plan = [
    'christmas-show-2019' => [
        'title'       => 'Christmas Show 2019',
        'description' => "The 13th annual Queenstown Christmas Show. Big tutus, bigger hair.",
        'showDate'    => '2019-12-15',
        'location'    => 'Queenstown',
        'sources'     => ['1_2019-11-25', '2_2019-12-09', '3_2019-12-12', '4_2019-12-15', '5_2019-12-23'],
    ],
    'christmas-show-2020' => [
        'title'       => 'Christmas Show 2020',
        'description' => "The 14th show. The year of the asterisks.",
        'showDate'    => '2020-12-13',
        'location'    => 'Queenstown',
        'sources'     => ['6_2020-12-13'],
    ],
    'christmas-show-2021' => [
        'title'       => 'Christmas Show 2021',
        'description' => "The 15th show. We did most of it online, somehow.",
        'showDate'    => '2021-12-10',
        'location'    => 'Queenstown',
        'sources'     => ['7_2021-12-10'],
    ],
    'christmas-show-2023' => [
        'title'       => 'Christmas Show 2023',
        'description' => "The 17th annual Christmas Show — *Not a Creature Was Stirring (Not Even a Mouse)*.",
        'showDate'    => '2023-12-10',
        'location'    => 'Queenstown Events Centre',
        'sources'     => ['8_2023-12-10', '9_2023-12-25'],
    ],
    'christmas-show-2024' => [
        'title'       => 'Christmas Show 2024',
        'description' => "The 18th annual show. The year of the presents. The tutus had a sad year off.",
        'showDate'    => '2024-12-08',
        'location'    => 'Queenstown Events Centre',
        'sources'     => ['10_2024-12-01', '11_2024-12-08'],
    ],
    'arrowtown-autumn-festival-2025' => [
        'title'       => 'Arrowtown Autumn Festival 2025',
        'description' => "The leaves were turning, and so were we.",
        'showDate'    => '2025-04-25',
        'location'    => 'Arrowtown',
        'sources'     => ['12_2025-04-06', '13_2025-04-13', '14_2025-04-24', '15_2025-04-25', '16_2025-04-26'],
    ],
    'christmas-show-2025' => [
        'title'       => 'Christmas Show 2025',
        'description' => "The 19th annual Christmas Show — *Kiwi Kirihimete Adventure*. Crowds of record-breaking proportions.",
        'showDate'    => '2025-12-07',
        'location'    => 'Queenstown Events Centre',
        'sources'     => ['17_2025-11-25', '18_2025-12-07'],
    ],
    'arrowtown-autumn-festival-2026' => [
        'title'       => 'Arrowtown Autumn Festival 2026',
        'description' => "Mid-April mischief.",
        'showDate'    => '2026-04-16',
        'location'    => 'Arrowtown',
        'sources'     => ['19_2026-04-16'],
    ],
];

echo "Consolidating " . count($plan) . " event albums.\n";
echo str_repeat('-', 60) . "\n";

$prefix = 1;
$moved = 0;
$collisions = 0;

foreach ($plan as $slug => $info) {
    $newDir = sprintf('%s/%d_%s', GALLERY, $prefix++, $slug);

    // Folder might already exist if script is re-run after partial failure.
    if (!is_dir($newDir)) mkdir($newDir, 0755, true);

    foreach ($info['sources'] as $src) {
        $srcDir = GALLERY . '/' . $src;
        if (!is_dir($srcDir)) {
            // Maybe already consolidated — skip silently
            continue;
        }
        foreach (scandir($srcDir) as $f) {
            if (in_array($f, ['.', '..', 'album.txt'], true)) continue;
            $from = "$srcDir/$f";
            $to   = "$newDir/$f";
            if (file_exists($to)) {
                $collisions++;
                continue;
            }
            if (rename($from, $to)) {
                $moved++;
            } else {
                fwrite(STDERR, "  ! move failed: $from -> $to\n");
            }
        }
        // Clean up
        @unlink("$srcDir/album.txt");
        @rmdir($srcDir);
    }

    // Write the new album.txt
    $albumTxt = "$newDir/album.txt";
    $content  = "Title: {$info['title']}\n\n----\n\n";
    $content .= "Headline: {$info['title']}\n\n----\n\n";
    $content .= "Description:\n\n{$info['description']}\n\n----\n\n";
    $content .= "Showdate: {$info['showDate']}\n\n----\n\n";
    $content .= "Location: {$info['location']}\n\n----\n\n";
    $content .= "Featured: false\n\n----\n\n";
    $content .= "Showinlist: true\n";
    file_put_contents($albumTxt, $content);

    $count = 0;
    foreach (glob("$newDir/*.{jpg,jpeg,png,webp,heic,heif,mp4,mov}", GLOB_BRACE) as $f) $count++;
    echo "  ✓ {$slug} — {$count} files\n";
}

echo str_repeat('-', 60) . "\n";
echo "Moved: {$moved}  Skipped (already in destination): {$collisions}\n";

// Sanity: list any leftover numeric-prefixed dirs that didn't get folded in.
$leftover = [];
foreach (glob(GALLERY . '/*', GLOB_ONLYDIR) as $d) {
    $base = basename($d);
    if (!preg_match('/^\d+_/', $base)) continue;
    // Is this one of the new event albums we just created?
    $matched = false;
    foreach (array_keys($plan) as $slug) {
        if (preg_match('/^\d+_' . preg_quote($slug, '/') . '$/', $base)) { $matched = true; break; }
    }
    if (!$matched) $leftover[] = $base;
}
if ($leftover) {
    echo "\nLeftover folders (not consolidated — left in place):\n";
    foreach ($leftover as $l) echo "  - $l\n";
}
