<?php snippet('header') ?>

<header class="page-head">
    <div class="page-head__inner">
        <h1 class="page-head__title"><?= $page->headline()->or($page->title())->escape() ?></h1>
        <p class="page-head__blurb"><?= $page->blurb()->escape() ?></p>
    </div>
</header>

<section class="performances">
    <div class="performances__inner">
        <?php
        $upcoming = $page->children()->listed()->filter(fn($p) => $p->showDate()->toDate() >= time())->sortBy('showDate', 'asc');
        $past = $page->children()->listed()->filter(fn($p) => $p->showDate()->toDate() < time())->sortBy('showDate', 'desc');
        ?>

        <?php if ($upcoming->count()): ?>
            <h2 class="section-head__title">Upcoming</h2>
            <div class="card-grid">
                <?php foreach ($upcoming as $p): ?>
                    <a href="<?= $p->url() ?>" class="perf-card perf-card--upcoming">
                        <?php $poster = $p->images()->first(); ?>
                        <?php if ($poster): ?>
                            <img src="<?= $poster->resize(600, 800, 80)->url() ?>" alt="" loading="lazy">
                        <?php endif ?>
                        <div class="perf-card__body">
                            <h3><?= $p->title()->escape() ?></h3>
                            <p><?= $p->showDate()->toDate('l d M Y') ?></p>
                            <p><?= $p->venue()->escape() ?></p>
                        </div>
                    </a>
                <?php endforeach ?>
            </div>
        <?php endif ?>

        <?php if ($past->count()): ?>
            <h2 class="section-head__title">Past shows</h2>
            <div class="card-grid">
                <?php foreach ($past as $p): ?>
                    <a href="<?= $p->url() ?>" class="perf-card">
                        <?php $poster = $p->images()->first(); ?>
                        <?php if ($poster): ?>
                            <img src="<?= $poster->resize(600, 800, 80)->url() ?>" alt="" loading="lazy">
                        <?php endif ?>
                        <div class="perf-card__body">
                            <h3><?= $p->title()->escape() ?></h3>
                            <p><?= $p->showDate()->toDate('M Y') ?></p>
                            <p><?= $p->venue()->escape() ?></p>
                        </div>
                    </a>
                <?php endforeach ?>
            </div>
        <?php endif ?>
    </div>
</section>

<?php snippet('footer') ?>
