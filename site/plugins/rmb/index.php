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

/**
 * Cache-busted asset URL: av('assets/css/v2.css') → /assets/css/v2.css?v=<mtime>
 * LiteSpeed sends 7-day max-age on static files, so the query changes whenever the file does.
 */
if (!function_exists('av')) {
    function av(string $path): string
    {
        $file = kirby()->root('index') . '/' . ltrim($path, '/');
        $v = is_file($file) ? filemtime($file) : null;
        return url($path) . ($v ? '?v=' . $v : '');
    }
}

/**
 * Form helpers (Oct 2026). Every site form posts through rmbHandleForm(), which
 * checks CSRF + honeypot + required fields, then emails the submission via
 * Kirby's email() using the host's PHP mail() transport (see production configs).
 *
 * rmbHandleForm('Contact', ['name' => 'Your name', ...], ['name', 'email', 'message'])
 * returns ['ok' => bool, 'error' => ?string, 'values' => array]
 */
if (!function_exists('rmbFormValues')) {
    function rmbFormValues(array $fields): array
    {
        $v = [];
        foreach (array_keys($fields) as $k) {
            $v[$k] = trim(Kirby\Toolkit\Str::substr((string) get($k, ''), 0, $k === 'message' || $k === 'story' ? 4000 : 300));
        }
        return $v;
    }

    function rmbValidateForm(array $fields, array $required): array
    {
        $values = rmbFormValues($fields);
        if (csrf(get('csrf')) !== true) {
            return ['ok' => false, 'error' => 'Your session went for a lie-down. Please try sending that again.', 'values' => $values];
        }
        if ((string) get('website', '') !== '') {
            // Honeypot tripped: pretend all is well, send nothing.
            return ['ok' => false, 'spam' => true, 'error' => null, 'values' => $values];
        }
        foreach ($required as $k) {
            if ($values[$k] === '') {
                return ['ok' => false, 'error' => 'Please fill in ' . strtolower($fields[$k]) . '. Even ballerinas need the basics.', 'values' => $values];
            }
        }
        if (isset($values['email']) && $values['email'] !== '' && !Kirby\Toolkit\V::email($values['email'])) {
            return ['ok' => false, 'error' => "That email address doesn't look quite right. Mind checking it?", 'values' => $values];
        }
        return ['ok' => true, 'error' => null, 'values' => $values];
    }

    /** Send a form submission. Returns true on success; logs and returns false on failure. */
    function rmbSendForm(string $formName, array $fields, array $values, array $extraLines = []): bool
    {
        $name = $values['name'] ?? 'Anonymous';
        $lines = ["New {$formName} submission from the Remarkable Men's Ballet website", ''];
        foreach ($fields as $k => $label) {
            $lines[] = $label . ': ' . (($values[$k] ?? '') === '' ? '(blank)' : $values[$k]);
        }
        $lines = array_merge($lines, $extraLines, ['', 'Sent: ' . (new DateTime('now', new DateTimeZone('Pacific/Auckland')))->format('Y-m-d H:i T'), 'Page: ' . (kirby()->request()->url()->toString())]);
        // Strip anything that could break a header.
        $subjectName = preg_replace('/[\r\n]+/', ' ', $name);
        try {
            $mail = [
                'to'      => option('rmb.forms.to', 'spike@queenstown.com'),
                'from'    => option('rmb.forms.from', 'noreply@remarkablemensballet.com'),
                'fromName'=> "Remarkable Men's Ballet website",
                'subject' => '[RMB] ' . $formName . ': ' . Kirby\Toolkit\Str::substr($subjectName, 0, 80),
                'body'    => implode("\n", $lines),
            ];
            if (!empty($values['email']) && Kirby\Toolkit\V::email($values['email'])) {
                $mail['replyTo'] = $values['email'];
            }
            kirby()->email($mail);
            return true;
        } catch (\Throwable $e) {
            error_log('[RMB forms] ' . $formName . ' email failed: ' . $e->getMessage());
            return false;
        }
    }
}
