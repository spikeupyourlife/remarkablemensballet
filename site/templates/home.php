<?php snippet('header') ?>

<?php snippet('hero') ?>

<section class="intro">
    <div class="intro__inner">
        <h2 class="intro__headline"><?= $page->introHeadline()->escape() ?></h2>
        <?= $page->introBody()->kt() ?>
    </div>
</section>

<?php
$team = page('team');
$featured = $team ? $team->children()->listed()->filterBy('featured', true)->shuffle()->limit(6) : null;
?>
<?php if ($featured && $featured->count()): ?>
<section class="featured-team">
    <div class="featured-team__inner">
        <header class="section-head">
            <h2 class="section-head__title">A few of the brave</h2>
            <p class="section-head__blurb">Some of the people foolish enough to wear the tutu this year.</p>
        </header>
        <div class="card-grid">
            <?php foreach ($featured as $person): ?>
                <?php snippet('person-card', ['person' => $person]) ?>
            <?php endforeach ?>
        </div>
        <p class="section-cta">
            <a href="/team" class="btn btn--ghost">Meet the whole circus</a>
        </p>
    </div>
</section>
<?php endif ?>

<?php
$nextShow = page('performances')?->children()->listed()
    ->filter(fn($p) => $p->showDate()->toDate() >= time())
    ->sortBy('showDate', 'asc')
    ->first();
?>
<?php if ($nextShow): ?>
<section class="next-show ballet-gradient">
    <div class="next-show__inner">
        <p class="next-show__eyebrow">Next time we embarrass ourselves</p>
        <h2 class="next-show__title"><?= $nextShow->title()->escape() ?></h2>
        <p class="next-show__when">
            <?= $nextShow->showDate()->toDate('l d M Y') ?> · <?= $nextShow->venue()->escape() ?>
        </p>
        <?php if ($nextShow->ticketUrl()->isNotEmpty()): ?>
            <a href="<?= $nextShow->ticketUrl()->url() ?>" class="btn btn--primary" rel="noopener">
                Get tickets
            </a>
        <?php endif ?>
    </div>
</section>
<?php endif ?>

<?php if ($page->sections()->isNotEmpty()): ?>
    <section class="page-blocks">
        <?= $page->sections()->toBlocks() ?>
    </section>
<?php endif ?>

<?php snippet('footer') ?>
