<?php snippet('header') ?>

<article class="performance">
    <header class="page-head">
        <div class="page-head__inner">
            <h1 class="page-head__title"><?= $page->title()->escape() ?></h1>
            <p class="page-head__blurb">
                <?= $page->showDate()->toDate('l d M Y') ?> · <?= $page->venue()->escape() ?>
            </p>
        </div>
    </header>

    <?php $poster = $page->images()->first(); ?>
    <?php if ($poster): ?>
        <figure class="performance__poster">
            <img src="<?= $poster->resize(1200, 1600, 85)->url() ?>" alt="">
        </figure>
    <?php endif ?>

    <div class="prose performance__body">
        <?= $page->description()->kt() ?>

        <?php $times = $page->showTimes()->toStructure(); ?>
        <?php if ($times->count()): ?>
            <h3>All show times</h3>
            <ul class="show-times">
                <?php foreach ($times as $t): ?>
                    <li>
                        <strong><?= $t->date()->toDate('l d M Y') ?></strong>
                        — <?= $t->time()->escape() ?>
                        <?php if ($t->note()->isNotEmpty()): ?>
                            <em>(<?= $t->note()->escape() ?>)</em>
                        <?php endif ?>
                    </li>
                <?php endforeach ?>
            </ul>
        <?php endif ?>

        <?php if ($page->ticketUrl()->isNotEmpty()): ?>
            <p>
                <a href="<?= $page->ticketUrl()->url() ?>" class="btn btn--primary" rel="noopener">
                    Get tickets via <?= $page->ticketProvider()->or('our ticket provider')->escape() ?>
                </a>
            </p>
        <?php endif ?>
    </div>
</article>

<?php snippet('footer') ?>
