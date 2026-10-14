<?php

return [

    'debug' => false,

    // The home page slug
    'home' => 'home',

    // Pretty URLs without index.php
    'url' => null,

    // Languages off for now — easy to enable later
    'languages' => false,

    // Default smart routing for assets
    'thumbs' => [
        'driver'  => 'gd',
        'quality' => 82,
        'format'  => 'webp',
    ],

    // Date format — using the default 'date' handler so PHP date() format
    // codes (e.g. 'd M Y' = '08 Dec 2025') work as expected in templates.
    // (The 'intl' handler uses ICU codes which would require 'd MMM yyyy'.)
    'date' => [
        'handler' => 'date',
    ],

    // Panel customisation
    'panel' => [
        'install' => true, // allow first-run installer
    ],

    // Cache (LiteSpeed-friendly)
    'cache' => [
        'pages' => [
            'active'    => true,
            'type'      => 'file',
            'ignore'    => function ($page) {
                // Don't cache pages with forms / dynamic content
                return in_array($page->intendedTemplate()->name(), ['submit-memory', 'contact']);
            },
        ],
    ],

    // Routes (custom URLs)
    'routes' => [
        // Pretty year archive: /timeline/2008
        [
            'pattern' => 'timeline/(:any)',
            'action'  => function ($year) {
                $page = page('timeline/' . $year);
                if (!$page) return false;
                return $page;
            },
        ],
    ],

    // Brand-specific globals
    'rmb' => [
        'show_year' => 20, // 20th anniversary
    ],

];
