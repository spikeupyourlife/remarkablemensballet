<?php
/**
 * Hall of Fame trading-card stats.
 * Real values come from Panel fields (signatureMove, tutuColour, specialty);
 * until Spike fills them in, a deterministic DRAFT placeholder is picked per slug
 * and flagged so templates can mark it as draft.
 */
function rmbStats(Kirby\Cms\Page $p): array
{
    $moves = ['The Reluctant Pirouette', 'Grand Jeté (Lite)', 'The Arabesque of Regret', 'Plié and Pray',
              'The Sugar Plum Shuffle', 'Swan Lake (Frankton Arm)', 'The Unannounced Lift', 'Pas de Bourrée-ish'];
    $tutus = ['Flamingo Pink', 'Remarkables Snow', 'Lake Wakatipu Teal', 'Midnight Sequin',
              'Gold Lamé (Contested)', 'Lavender Haze', 'Hi-Vis Tulle', 'Christmas Tinsel'];
    $powers = ['Stage presence', 'Hair-free shins', 'Remembers the count', 'Crowd warm-up',
               'Costume repair', 'Unflappable', 'Spontaneous encore', 'Can still touch toes'];
    $h = crc32($p->slug());
    $pick = fn($field, $list, $salt) => $p->content()->get($field)->isNotEmpty()
        ? ['value' => $p->content()->get($field)->value(), 'draft' => false]
        : ['value' => $list[($h >> $salt) % count($list)], 'draft' => true];

    $since = $p->performingSince()->isNotEmpty() ? (int) $p->performingSince()->toDate('Y') : null;
    $until = $p->performingUntil()->isNotEmpty() ? (int) $p->performingUntil()->toDate('Y') : (int) date('Y');
    return [
        'years'  => $since ? ['value' => max(1, $until - $since), 'draft' => false]
                           : ['value' => 'Classified', 'draft' => true],
        'debut'  => $since ? ['value' => $since, 'draft' => false] : ['value' => 'TBC', 'draft' => true],
        'move'   => $pick('signatureMove', $moves, 3),
        'tutu'   => $pick('tutuColour', $tutus, 7),
        'power'  => $pick('specialty', $powers, 11),
        'number' => str_pad((string) $p->num(), 2, '0', STR_PAD_LEFT),
    ];
}
