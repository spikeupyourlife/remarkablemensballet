<?php
// Launch-ready production overrides.
// Copy over site/config/config.remarkablemensballet.com.php
// (and the www copy) when Spike says go-live. Do not upload this
// file in the review deploy: the yellow banner must stay on until then.
return [
    'debug' => false,
    // Root-relative URLs so pages work on both http and https (page cache safe)
    'url' => '/',
    'panel' => ['install' => false],
    // Public launch: hide the Reviewer's note banner.
    'rmb.review' => false,
    // Forms: send via the host's built-in PHP mail()/sendmail (cPanel, no SMTP creds)
    'email' => [
        'transport' => ['type' => 'mail'],
    ],
    'rmb.forms' => [
        'to'   => 'spike@queenstown.com',
        'from' => 'noreply@remarkablemensballet.com',
    ],
];
