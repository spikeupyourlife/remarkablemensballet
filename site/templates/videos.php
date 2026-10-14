<?php snippet('header') ?>

<header class="page-head">
    <div class="page-head__inner">
        <h1 class="page-head__title"><?= $page->headline()->or($page->title())->escape() ?></h1>
        <p class="page-head__blurb"><?= $page->blurb()->escape() ?></p>
    </div>
</header>

<section class="videos">
    <div class="videos__inner">
        <div class="card-grid">
            <?php foreach ($page->children()->listed() as $video): ?>
                <?php snippet('video-card', ['video' => $video]) ?>
            <?php endforeach ?>
        </div>
    </div>
</section>

<?php snippet('footer') ?>
