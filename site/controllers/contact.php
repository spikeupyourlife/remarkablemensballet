<?php
return function ($kirby, $page) {
    $fields = ['name' => 'Your name', 'email' => 'Your email', 'message' => 'Your message'];
    $out = ['fields' => $fields, 'values' => [], 'error' => null, 'sent' => get('sent') === '1'];
    if ($kirby->request()->is('POST') === false) return $out;

    $r = rmbValidateForm($fields, ['name', 'email', 'message']);
    $out['values'] = $r['values'];
    if (!empty($r['spam'])) go($page->url() . '?sent=1');
    if (!$r['ok']) return array_merge($out, ['error' => $r['error']]);

    if (rmbSendForm('Contact', $fields, $r['values'])) go($page->url() . '?sent=1');
    return array_merge($out, ['error' => "Our carrier pigeon has tripped over its tutu and your note didn't go through. Please try again in a few minutes."]);
};
