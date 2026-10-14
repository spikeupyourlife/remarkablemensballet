<?php
return function ($kirby, $page) {
    $fields = [
        'name'  => 'Your name',
        'email' => 'Your email',
        'phone' => 'Phone (optional)',
        'move'  => 'Your single best dance move (in words)',
        'notes' => 'Anything else we should know',
    ];
    $out = ['fields' => $fields, 'values' => [], 'error' => null, 'sent' => get('sent') === '1'];
    if ($kirby->request()->is('POST') === false) return $out;

    $r = rmbValidateForm($fields, ['name', 'email', 'move']);
    $out['values'] = $r['values'];
    if (!empty($r['spam'])) go($page->url() . '?sent=1#signup');
    if (!$r['ok']) return array_merge($out, ['error' => $r['error']]);

    if (rmbSendForm('Audition sign-up', $fields, $r['values'])) go($page->url() . '?sent=1#signup');
    return array_merge($out, ['error' => "The tutu is willing but the email server is weak. Your sign-up didn't go through, so please try again shortly."]);
};
