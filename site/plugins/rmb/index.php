<?php

/**
 * Remarkable Men's Ballet — site-specific helpers.
 */

Kirby::plugin('rmb/site', [

    'pageMethods' => [
        // True if the page (or any ancestor) is the team / gallery / etc.
        'inSection' => function (string $slug): bool {
            $page = $this;
            while ($page) {
                if ($page->slug() === $slug) return true;
                $page = $page->parent();
            }
            return false;
        },
    ],

    'pagesMethods' => [
        'currentPerformers' => function () {
            return $this->filter(fn($p) => $p->personType()->value() === 'performer')
                        ->filterBy('isCurrent', true);
        },
    ],

    'fieldMethods' => [
        // Convert "2m30s", "1h2m", "46m" → seconds. Mirrors site/snippets/video-embed.
        'toSeconds' => function ($field) {
            $t = strtolower(trim((string) $field->value));
            if ($t === '') return 0;
            if (ctype_digit($t)) return (int) $t;
            preg_match_all('/(\d+)\s*([hms])/i', $t, $m, PREG_SET_ORDER);
            $s = 0;
            foreach ($m as $part) {
                $n = (int) $part[1];
                $u = strtolower($part[2]);
                $s += $u === 'h' ? $n * 3600 : ($u === 'm' ? $n * 60 : $n);
            }
            return $s;
        },
    ],

]);
