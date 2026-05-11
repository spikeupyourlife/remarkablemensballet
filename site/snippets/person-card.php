<?php
/** Expects: $person (Page) */
$photo = $person->images()->template('image')->first() ?? $person->images()->first();
?>
<a class="person-card" href="<?= $person->url() ?>">
    <div class="person-card__photo">
        <?php if ($photo): ?>
            <img src="<?= $photo->resize(600, 800, 80)->url() ?>"
                 alt="<?= $photo->alt()->or($person->title())->escape() ?>"
                 loading="lazy">
        <?php else: ?>
            <div class="person-card__photo--empty" aria-hidden="true">
                <?= svg('assets/images/butterfly.svg') ?>
            </div>
        <?php endif ?>
    </div>
    <div class="person-card__body">
        <h3 class="person-card__name"><?= $person->stageName()->or($person->title())->escape() ?></h3>
        <?php if ($person->role()->isNotEmpty()): ?>
            <p class="person-card__role"><?= $person->role()->escape() ?></p>
        <?php endif ?>
        <?php if ($person->personType()->isNotEmpty() && $person->personType()->value() !== 'performer'): ?>
            <span class="person-card__badge"><?= ucfirst($person->personType()->value()) ?></span>
        <?php endif ?>
    </div>
</a>
