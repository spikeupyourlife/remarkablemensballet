<?php snippet('header') ?>

<header class="page-head">
    <div class="page-head__inner">
        <h1 class="page-head__title"><?= $page->headline()->or($page->title())->escape() ?></h1>
        <p class="page-head__blurb"><?= $page->blurb()->escape() ?></p>
    </div>
</header>

<section class="gallery">
    <div class="gallery__inner">
        <div class="masonry">
            <?php foreach ($page->children()->listed()->sortBy('showDate', 'desc') as $photo): ?>
                <?php snippet('photo-card', ['photo' => $photo]) ?>
            <?php endforeach ?>
        </div>
    </div>
</section>

<?php snippet('footer') ?>
