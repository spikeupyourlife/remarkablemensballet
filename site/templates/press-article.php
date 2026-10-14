<?php snippet('header') ?>

<article class="press-article">
    <header class="page-head">
        <div class="page-head__inner">
            <p class="press-article__source">
                <?= $page->sourceName()->escape() ?>
                <?php if ($page->author()->isNotEmpty()): ?> · by <?= $page->author()->escape() ?><?php endif ?>
                <?php if ($page->publishedDate()->isNotEmpty()): ?> · <?= $page->publishedDate()->toDate('d M Y') ?><?php endif ?>
            </p>
            <h1 class="page-head__title"><?= $page->title()->escape() ?></h1>
            <?php if ($page->excerpt()->isNotEmpty()): ?>
                <p class="page-head__blurb"><?= $page->excerpt()->escape() ?></p>
            <?php endif ?>
        </div>
    </header>

    <?php $img = $page->images()->first(); ?>
    <?php if ($img): ?>
        <figure class="press-article__image">
            <img src="<?= $img->resize(1400, 0, 85)->url() ?>" alt="<?= $img->alt()->escape() ?>">
            <?php if ($img->credit()->isNotEmpty()): ?>
                <figcaption>Photo: <?= $img->credit()->escape() ?></figcaption>
            <?php endif ?>
        </figure>
    <?php else: ?>
        <figure class="press-article__image press-fallback press-fallback--wide" aria-hidden="true">
            <img src="<?= av('assets/images/crest-shield-dark-a.svg') ?>" alt="">
            <span class="press-fallback__src"><?= $page->sourceName()->escape() ?></span>
            <span class="press-fallback__year"><?= $page->publishedDate()->toDate('Y') ?></span>
        </figure>
    <?php endif ?>

    <div class="prose press-article__body">
        <?= $page->body()->kt() ?>
    </div>

    <?php if ($page->sourceUrl()->isNotEmpty()): ?>
        <p class="press-article__source-link">
            <a href="<?= $page->sourceUrl()->url() ?>" rel="noopener">Read the full story at <?= $page->sourceName()->or('the publisher\'s site')->escape() ?> →</a>
        </p>
    <?php endif ?>
</article>

<?php snippet('footer') ?>
