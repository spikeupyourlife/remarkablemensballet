<?php snippet('header') ?>

<article class="prose">
    <header class="prose__header">
        <h1 class="prose__title"><?= $page->title()->escape() ?></h1>
    </header>

    <div class="prose__body">
        <?= $page->body()->kt() ?>
    </div>
</article>

<?php snippet('footer') ?>
