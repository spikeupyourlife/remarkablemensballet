<?php snippet('header') ?>

<header class="page-head">
    <div class="page-head__inner">
        <h1 class="page-head__title"><?= $page->headline()->or($page->title())->escape() ?></h1>
        <p class="page-head__blurb"><?= $page->blurb()->escape() ?></p>
    </div>
</header>

<?php snippet('next-show') ?>

<section class="performances">
    <div class="performances__inner">
        <?php
        $shows = $page->children()->listed()->filterBy('intendedTemplate', 'performance');
        $upcoming = $shows->filter(fn($p) => $p->showDate()->toDate() >= time())->sortBy('showDate', 'asc');
        $past = $shows->filter(fn($p) => $p->showDate()->toDate() < time())->sortBy('showDate', 'desc');
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

<?php $archive = $page->pastShows()->toStructure(); if ($archive->count()): ?>
<section class="archive">
    <div class="archive__inner">
        <p class="eyebrow">The back catalogue</p>
        <h2 class="display">Past shows</h2>
        <ol class="archive__list">
            <?php foreach ($archive as $a): ?>
                <li><span class="archive__year"><?= $a->year()->escape() ?></span><div><h3><?= $a->show()->escape() ?></h3><p><?= $a->note()->escape() ?></p></div></li>
            <?php endforeach ?>
            <li class="archive__soon"><span class="archive__year">2006 to 2017</span><div><h3>The lost years</h3><p>Records coming soon. If you were there, <a href="/submit-memory">tell us what happened</a>.</p></div></li>
        </ol>
    </div>
</section>
<?php endif ?>

<?php $videos = $page->children()->listed()->filterBy('intendedTemplate', 'video')->sortBy('showYear', 'desc'); if ($videos->count()): ?>
<section class="videos" id="videos">
    <div class="videos__inner">
        <p class="eyebrow">The (sort of) action</p>
        <h2 class="display">Videos</h2>
        <p class="section-head__blurb">Highlights, lowlights, and a couple of things we probably shouldn't have filmed.</p>
        <div class="card-grid">
            <?php foreach ($videos as $video): snippet('video-card', ['video' => $video]); endforeach ?>
        </div>
    </div>
</section>
<?php endif ?>

<?php snippet('footer') ?>
