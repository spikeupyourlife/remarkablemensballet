<?php

return function ($kirby, $page) {

    if ($kirby->request()->is('POST') === false) {
        return [];
    }

    // Honeypot — bots love filling hidden fields.
    if (get('website') !== '' && get('website') !== null) {
        return ['error' => 'Spam detected.'];
    }

    $name  = trim((string) get('name'));
    $email = trim((string) get('email'));
    $story = trim((string) get('story'));
    $year  = (int) get('year');

    if ($name === '' || $email === '' || $story === '') {
        return ['error' => 'Please fill in your name, email, and the story.'];
    }

    try {
        $kirby->impersonate('kirby');

        $slug = Str::slug($name . '-' . date('Y-m-d-His'));

        $memory = $page->createChild([
            'slug'     => $slug,
            'template' => 'memory',
            'draft'    => true,
            'content'  => [
                'title'         => 'Memory from ' . $name,
                'submittedBy'   => $name,
                'submittedEmail'=> $email,
                'submittedAt'   => date('Y-m-d H:i'),
                'story'         => $story,
                'showYear'      => $year ?: '',
            ],
        ]);

        // Handle file uploads.
        $files = $_FILES['files'] ?? null;
        if ($files && is_array($files['tmp_name'])) {
            foreach ($files['tmp_name'] as $i => $tmp) {
                if (!$tmp || !is_uploaded_file($tmp)) continue;
                $orig = $files['name'][$i] ?? 'upload';
                $mime = $files['type'][$i] ?? '';
                $template = str_starts_with($mime, 'image/') ? 'image' : null;
                $memory->createFile([
                    'source'   => $tmp,
                    'filename' => Str::slug(F::name($orig)) . '.' . F::extension($orig),
                    'template' => $template,
                ]);
            }
        }

        // Notify the team.
        if ($to = site()->contactEmail()->value()) {
            try {
                $kirby->email([
                    'to'      => $to,
                    'from'    => $to,
                    'replyTo' => $email,
                    'subject' => 'New RMB memory submission from ' . $name,
                    'body'    => "Name: {$name}\nEmail: {$email}\nYear: {$year}\n\n{$story}\n\nReview: " . $memory->panel()->url(),
                ]);
            } catch (\Throwable $e) {
                // Don't break the form if mail is misconfigured.
            }
        }

    } catch (\Throwable $e) {
        return ['error' => 'Sorry — something broke. Please try again or email us directly.'];
    }

    go($page->url() . '?submitted=true');
};
