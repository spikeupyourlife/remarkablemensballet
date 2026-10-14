<?php
// Production overrides (Kirby loads config.{host}.php automatically).
return [
    'debug' => false,
    // Root-relative URLs so pages work on both http and https (page cache safe)
    'url' => '/',
    'panel' => ['install' => false],
    // Forms: send via the host's built-in PHP mail()/sendmail (cPanel, no SMTP creds)
    'email' => [
        'transport' => ['type' => 'mail'],
    ],
    'rmb.forms' => [
        'to'   => 'spike@queenstown.com',
        'from' => 'noreply@remarkablemensballet.com',
    ],
];
