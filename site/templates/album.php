<?php snippet('header') ?>

<header class="page-head">
    <div class="page-head__inner">
        <p class="page-head__eyebrow">
            <?php if ($page->showDate()->isNotEmpty()): ?>
                <?= $page->showDate()->toDate('d M Y') ?>
                <?php if ($page->location()->isNotEmpty()): ?> · <?= $page->location()->escape() ?><?php endif ?>
            <?php endif ?>
        </p>
        <h1 class="page-head__title">
            <?= $page->headline()->or($page->title())->escape() ?>
        </h1>
        <?php if ($page->description()->isNotEmpty()): ?>
            <p class="page-head__blurb"><?= $page->description()->escape() ?></p>
        <?php endif ?>
    </div>
</header>

<section class="album">
    <div class="album__inner">
        <?php $images = $page->files()->template('image')->sortBy('takenAt', 'asc'); ?>
        <p class="album__count"><?= $images->count() ?> photos · click any to view</p>
        <div class="masonry" data-lightbox-group>
            <?php foreach ($images as $img): ?>
                <?php
                    $alt     = $img->alt()->or($page->title())->escape();
                    $caption = $img->caption()->escape();
                    $taken   = $img->takenAt()->isNotEmpty() ? $img->takenAt()->toDate('d M Y') : '';
                ?>
                <a class="photo-card"
                   href="<?= $img->url() ?>"
                   data-lightbox-src="<?= $img->url() ?>"
                   data-lightbox-alt="<?= $alt ?>"
                   data-lightbox-caption="<?= $caption ?>"
                   data-lightbox-meta="<?= $taken ?>">
                    <img src="<?= $img->resize(800, 0, 80)->url() ?>"
                         alt="<?= $alt ?>"
                         loading="lazy">
                    <?php if ($img->caption()->isNotEmpty()): ?>
                        <div class="photo-card__overlay">
                            <p class="photo-card__title"><?= $caption ?></p>
                        </div>
                    <?php endif ?>
                </a>
            <?php endforeach ?>
        </div>
    </div>
</section>

<?php snippet('footer') ?>
