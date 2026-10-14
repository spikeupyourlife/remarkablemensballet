<?php snippet('header') ?>

<article class="year">
    <header class="page-head page-head--big">
        <div class="page-head__inner">
            <p class="page-head__eyebrow"><?= $page->year() ?><?= $page->isMilestone()->toBool() ? ' · milestone' : '' ?></p>
            <h1 class="page-head__title"><?= $page->showTitle()->or($page->title())->escape() ?></h1>
            <?php if ($page->summary()->isNotEmpty()): ?>
                <p class="page-head__blurb"><?= $page->summary()->escape() ?></p>
            <?php endif ?>
        </div>
    </header>

    <div class="prose year__story">
        <?= $page->story()->kt() ?>
    </div>

    <?php $images = $page->images(); ?>
    <?php if ($images->count()): ?>
        <section class="year__gallery">
            <h2 class="section-head__title">Photos</h2>
            <div class="image-grid" data-lightbox-group>
                <?php foreach ($images as $img): ?>
                    <a href="<?= $img->url() ?>" class="image-grid__item"
                       data-lightbox-src="<?= $img->url() ?>"
                       data-lightbox-alt="<?= $img->alt()->or($page->title())->escape() ?>"
                       data-lightbox-caption="<?= $img->caption()->escape() ?>">
                        <img src="<?= $img->resize(600, 600, 80)->url() ?>" alt="<?= $img->alt()->escape() ?>" loading="lazy">
                    </a>
                <?php endforeach ?>
            </div>
        </section>
    <?php endif ?>

    <?php $cast = $page->cast()->toPages(); ?>
    <?php if ($cast->count()): ?>
        <section class="year__cast">
            <h2 class="section-head__title">Cast &amp; crew</h2>
            <div class="card-grid">
                <?php foreach ($cast as $person): ?>
                    <?php snippet('person-card', ['person' => $person]) ?>
                <?php endforeach ?>
            </div>
        </section>
    <?php endif ?>
</article>

<?php snippet('footer') ?>
