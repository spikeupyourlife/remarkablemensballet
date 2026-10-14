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

    // Routes: 301s from the old 12-page sitemap to the 9-page one (Oct 2026)
    'routes' => (function () {
        $map = [
            'about'    => 'our-story',
            'timeline' => 'our-story',
            'team'     => 'hall-of-fame',
            'videos'   => 'performances',
            'sponsors' => 'support-us',
        ];
        $routes = [];
        foreach ($map as $from => $to) {
            $routes[] = ['pattern' => $from, 'action' => fn () => go($to, 301)];
            $keepChild = in_array($from, ['team', 'videos'], true);
            $routes[] = [
                'pattern' => $from . '/(:all)',
                'action'  => fn ($rest) => go($keepChild ? $to . '/' . $rest : $to, 301),
            ];
        }
        return $routes;
    })(),

    // Brand-specific globals
    'rmb' => [
        'show_year' => 20, // 20th anniversary
        // Primary nav, in order (Contact lives in the footer; Join is the Audition button)
        'nav' => ['our-story', 'hall-of-fame', 'performances', 'gallery', 'press', 'support-us'],
        // Next show card + countdown. Venue and tickets: christmasshow.co.nz only.
        'nextShow' => [
            'title'  => 'The Queenstown Christmas Show 2026: Christmas Stars',
            'kicker' => "The show's 20th anniversary, and ours",
            'starts' => '2026-12-05T15:00:00+13:00',
            'times'  => ['Saturday 5 December, 3pm', 'Sunday 6 December, 1pm', 'Sunday 6 December, 5pm'],
            'url'    => 'https://christmasshow.co.nz',
        ],
    ],

];
