<?php snippet('header') ?>

<header class="page-head">
    <div class="page-head__inner">
        <h1 class="page-head__title"><?= $page->headline()->or($page->title())->escape() ?></h1>
        <p class="page-head__blurb"><?= $page->blurb()->escape() ?></p>
    </div>
</header>

<section class="press">
    <div class="press__inner">
        <ul class="press__list">
            <?php foreach ($page->children()->listed()->sortBy('publishedDate', 'desc') as $article): ?>
                <li class="press__item">
                    <a href="<?= $article->url() ?>" class="press-card">
                        <?php $img = $article->images()->first(); ?>
                        <?php if ($img): ?>
                            <div class="press-card__thumb">
                                <img src="<?= $img->resize(600, 400, 80)->url() ?>" alt="" loading="lazy">
                            </div>
                        <?php else: ?>
                            <div class="press-card__thumb press-fallback" aria-hidden="true">
                                <img src="<?= av('assets/images/crest-shield-dark-a.svg') ?>" alt="" loading="lazy">
                                <span class="press-fallback__src"><?= $article->sourceName()->escape() ?></span>
                                <span class="press-fallback__year"><?= $article->publishedDate()->toDate('Y') ?></span>
                            </div>
                        <?php endif ?>
                        <div class="press-card__body">
                            <p class="press-card__source">
                                <?= $article->sourceName()->escape() ?>
                                <?php if ($article->publishedDate()->isNotEmpty()): ?>
                                    · <?= $article->publishedDate()->toDate('d M Y') ?>
                                <?php endif ?>
                            </p>
                            <h3 class="press-card__title"><?= $article->title()->escape() ?></h3>
                            <?php if ($article->excerpt()->isNotEmpty()): ?>
                                <p class="press-card__excerpt"><?= $article->excerpt()->excerpt(220) ?></p>
                            <?php endif ?>
                        </div>
                    </a>
                </li>
            <?php endforeach ?>
        </ul>
    </div>
</section>

<?php snippet('footer') ?>
