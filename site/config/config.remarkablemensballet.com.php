<?php
// Production overrides (Kirby loads config.{host}.php automatically).
return [
    'debug' => false,
    // Root-relative URLs so pages work on both http and https (page cache safe)
    'url' => '/',
    'panel' => ['install' => false],
];
