<?php snippet('header') ?>

<article class="about">
    <header class="page-head">
        <div class="page-head__inner">
            <h1 class="page-head__title"><?= $page->headline()->or($page->title())->escape() ?></h1>
        </div>
    </header>

    <?php $img = $page->images()->first(); ?>
    <?php if ($img): ?>
        <figure class="about__hero">
            <img src="<?= $img->resize(1400, 0, 85)->url() ?>" alt="<?= $img->alt()->escape() ?>">
        </figure>
    <?php endif ?>

    <div class="prose about__body">
        <?= $page->body()->kt() ?>
    </div>
</article>

<?php snippet('footer') ?>
