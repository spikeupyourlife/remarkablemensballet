<?php snippet('header') ?>

<?php $hero = $page->images()->first(); ?>

<article class="person">
    <header class="person__hero">
        <?php if ($hero): ?>
            <picture class="person__hero-image">
                <img src="<?= $hero->resize(1400, 1800, 80)->url() ?>"
                     alt="<?= $hero->alt()->or($page->title())->escape() ?>"
                     loading="eager">
            </picture>
        <?php endif ?>
        <div class="person__hero-text">
            <p class="person__eyebrow"><?= ucfirst($page->personType()->or('performer')->value()) ?></p>
            <h1 class="person__name">
                <?= $page->stageName()->or($page->title())->escape() ?>
            </h1>
            <?php if ($page->stageName()->isNotEmpty() && $page->stageName()->toString() !== $page->title()->toString()): ?>
                <p class="person__realname">aka <?= $page->title()->escape() ?></p>
            <?php endif ?>
            <?php if ($page->role()->isNotEmpty()): ?>
                <p class="person__role"><?= $page->role()->escape() ?></p>
            <?php endif ?>
            <?php if ($page->performingSince()->isNotEmpty()): ?>
                <p class="person__tenure">
                    Performing since <?= $page->performingSince()->toDate('Y') ?>
                    <?php if ($page->performingUntil()->isNotEmpty()): ?>
                        — <?= $page->performingUntil()->toDate('Y') ?>
                    <?php endif ?>
                </p>
            <?php endif ?>
        </div>
    </header>

    <section class="person__bio prose">
        <?= $page->bio()->kt() ?>
    </section>

    <?php if ($page->quotes()->isNotEmpty()): ?>
        <section class="person__quotes">
            <h2 class="section-head__title">In their own (occasionally regrettable) words</h2>
            <?php foreach ($page->quotes()->toStructure() as $q): ?>
                <blockquote class="quote">
                    <p>&ldquo;<?= $q->quote()->escape() ?>&rdquo;</p>
                    <?php if ($q->context()->isNotEmpty()): ?>
                        <cite><?= $q->context()->escape() ?></cite>
                    <?php endif ?>
                </blockquote>
            <?php endforeach ?>
        </section>
    <?php endif ?>

    <?php
    $gallery = $page->images()->offset(1);
    ?>
    <?php if ($gallery->count()): ?>
        <section class="person__gallery">
            <h2 class="section-head__title">More evidence</h2>
            <div class="image-grid">
                <?php foreach ($gallery as $img): ?>
                    <a href="<?= $img->url() ?>" class="image-grid__item">
                        <img src="<?= $img->resize(600, 600, 80)->url() ?>"
                             alt="<?= $img->alt()->escape() ?>"
                             loading="lazy">
                    </a>
                <?php endforeach ?>
            </div>
        </section>
    <?php endif ?>
</article>

<?php snippet('footer') ?>
