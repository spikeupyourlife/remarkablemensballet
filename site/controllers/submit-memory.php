<?php

return function ($kirby, $page) {
    $fields = [
        'name'  => 'Your name',
        'email' => 'Your email',
        'year'  => 'Year (best guess)',
        'story' => 'The story',
    ];
    $out = ['fields' => $fields, 'values' => [], 'error' => null];
    if ($kirby->request()->is('POST') === false) return $out;

    $r = rmbValidateForm($fields, ['name', 'email', 'story']);
    $out['values'] = $r['values'];
    if (!empty($r['spam'])) go($page->url() . '?submitted=true');
    if (!$r['ok']) return array_merge($out, ['error' => $r['error']]);

    ['name' => $name, 'email' => $email, 'story' => $story] = $r['values'];
    $year = (int) $r['values']['year'];
    $stored = [];
    $memory = null;

    // 1. Store as a draft Kirby page (as before), so nothing is lost if mail fails.
    try {
        $kirby->impersonate('kirby');
        $memory = $page->createChild([
            'slug'     => Str::slug($name . '-' . date('Y-m-d-His')),
            'template' => 'memory',
            'draft'    => true,
            'content'  => [
                'title'          => 'Memory from ' . $name,
                'submittedBy'    => $name,
                'submittedEmail' => $email,
                'submittedAt'    => date('Y-m-d H:i'),
                'story'          => $story,
                'showYear'       => $year ?: '',
            ],
        ]);
        $files = $_FILES['files'] ?? null;
        if ($files && is_array($files['tmp_name'])) {
            foreach ($files['tmp_name'] as $i => $tmp) {
                if (!$tmp || !is_uploaded_file($tmp)) continue;
                $orig = $files['name'][$i] ?? 'upload';
                $mime = $files['type'][$i] ?? '';
                $f = $memory->createFile([
                    'source'   => $tmp,
                    'filename' => Str::slug(F::name($orig)) . '.' . F::extension($orig),
                    'template' => str_starts_with($mime, 'image/') ? 'image' : null,
                ]);
                $stored[] = $f->filename();
            }
        }
    } catch (\Throwable $e) {
        error_log('[RMB forms] memory store failed: ' . $e->getMessage());
    }

    // 2. Email it.
    $extra = ['', 'Attachments stored: ' . ($stored ? implode(', ', $stored) : 'none')];
    if ($memory) {
        $extra[] = 'Review in the Panel: ' . $memory->panel()->url();
    } else {
        $extra[] = 'WARNING: the submission could not be saved on the site; this email is the only copy.';
    }
    $sent = rmbSendForm('Memory', $fields, $r['values'], $extra);

    if ($memory || $sent) go($page->url() . '?submitted=true');
    return array_merge($out, ['error' => "Something went wrong backstage and your memory didn't make it through. Please try again in a few minutes."]);
};
