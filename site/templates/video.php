<?php snippet('header') ?>

<article class="video-page">
    <header class="page-head">
        <div class="page-head__inner">
            <h1 class="page-head__title"><?= $page->title()->escape() ?></h1>
        </div>
    </header>

    <?php snippet('video-embed', ['video' => $page]) ?>

    <div class="prose video-page__body">
        <?= $page->description()->kt() ?>
    </div>
</article>

<?php snippet('footer') ?>
