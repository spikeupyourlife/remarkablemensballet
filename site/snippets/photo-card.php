<?php
/** Expects: $photo (Page representing a gallery photo) */
$image = $photo->images()->first();
?>
<a class="photo-card" href="<?= $photo->url() ?>">
    <?php if ($image): ?>
        <img src="<?= $image->resize(800, 800, 80)->url() ?>"
             alt="<?= $image->alt()->or($photo->title())->escape() ?>"
             loading="lazy">
    <?php endif ?>
    <div class="photo-card__overlay">
        <p class="photo-card__title"><?= $photo->title()->escape() ?></p>
        <?php if ($photo->showName()->isNotEmpty() || $photo->showDate()->isNotEmpty()): ?>
            <p class="photo-card__meta">
                <?= $photo->showName()->escape() ?>
                <?php if ($photo->showDate()->isNotEmpty()): ?>
                    · <?= $photo->showDate()->toDate('Y') ?>
                <?php endif ?>
            </p>
        <?php endif ?>
    </div>
</a>
