<?php
/** Hall of Fame trading card, flips on hover/focus/tap to reveal stats. Expects: $person */
$photo = $person->images()->template('image')->first() ?? $person->images()->first();
$s = rmbStats($person);
$type = $person->personType()->or('performer')->value();
$d = fn($k) => $s[$k]['draft'] ? ' class="is-draft"' : '';
?>
<div class="flip reveal" data-tilt>
  <div class="flip__inner">
    <a class="tcard tcard--<?= esc($type, 'attr') ?> flip__face flip__front" href="<?= $person->url() ?>">
        <div class="tcard__top"><span class="tcard__no">No. <?= $s['number'] ?></span><span class="tcard__type"><?= esc(ucfirst($type)) ?></span></div>
        <div class="tcard__photo">
            <?php if ($photo): ?>
                <img src="<?= $photo->crop(480, 560)->url() ?>" alt="<?= $photo->alt()->or($person->title())->escape() ?>" loading="lazy">
            <?php else: ?>
                <div class="tcard__silhouette" aria-hidden="true"><?= svg('assets/images/butterfly.svg') ?><span>Portrait pending</span></div>
            <?php endif ?>
            <span class="tcard__shine" aria-hidden="true"></span>
        </div>
        <div class="tcard__plate">
            <h3 class="tcard__name"><?= $person->stageName()->or($person->title())->escape() ?></h3>
            <?php if ($person->role()->isNotEmpty()): ?><p class="tcard__role"><?= $person->role()->escape() ?></p><?php endif ?>
        </div>
        <span class="tcard__hint" aria-hidden="true">Hover to flip ↻</span>
    </a>
    <a class="tcard tcard--back tcard--<?= esc($type, 'attr') ?> flip__face flip__back" href="<?= $person->url() ?>" tabindex="-1" aria-hidden="true">
        <p class="tcard__backtitle"><?= $person->stageName()->or($person->title())->escape() ?></p>
        <dl class="tcard__stats">
            <div><dt>Service</dt><dd<?= $d('years') ?>><?= esc((string) $s['years']['value']) ?><?= is_int($s['years']['value']) ? ' yrs' : '' ?></dd></div>
            <div><dt>Debut</dt><dd<?= $d('debut') ?>><?= esc((string) $s['debut']['value']) ?></dd></div>
            <div><dt>Signature move</dt><dd<?= $d('move') ?>><?= esc($s['move']['value']) ?></dd></div>
            <div><dt>Tutu colour</dt><dd<?= $d('tutu') ?>><?= esc($s['tutu']['value']) ?></dd></div>
            <div><dt>Special power</dt><dd<?= $d('power') ?>><?= esc($s['power']['value']) ?></dd></div>
        </dl>
        <span class="btn btn--gold btn--sm">Read the dossier →</span>
    </a>
  </div>
</div>
