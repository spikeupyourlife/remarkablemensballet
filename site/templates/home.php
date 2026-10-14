<?php snippet('header') ?>
<?php
$heroImage = $page->images()->first();
$team = page('hall-of-fame');
$story = page('our-story');
$members = $team ? $team->children()->listed() : null;
$withPhoto = $members ? $members->filter(fn($p) => $p->images()->count() > 0)->sortBy('isCurrent', 'desc', 'num', 'asc') : null;
$nextShow = page('performances')?->children()->listed()
    ->filter(fn($p) => $p->showDate()->toDate() >= time())->sortBy('showDate', 'asc')->first();
$press = page('press')?->children()->listed()->limit(10);
?>
<div class="curtain" aria-hidden="true"><span class="curtain__l"></span><span class="curtain__r"></span></div>

<section class="anniv anniv--v2">
    <?php if ($heroImage): ?>
        <picture class="anniv__bg">
            <source srcset="<?= $heroImage->resize(1920, 1280, 75)->url() ?>" media="(min-width: 900px)">
            <img src="<?= $heroImage->resize(900, 1100, 75)->url() ?>" alt="<?= $heroImage->alt()->or('The troupe in full costume, backstage')->escape() ?>" fetchpriority="high">
        </picture>
    <?php endif ?>
    <div class="anniv__veil" aria-hidden="true"></div>
    <div class="anniv__inner">
        <p class="kicker reveal">Queenstown · Est. 2006 · Very serious</p>
        <h1 class="mega reveal">
            <span class="mega__a">Remarkable</span>
            <span class="mega__b">Men's <em>Ballet</em></span>
        </h1>
        <div class="anniv__row reveal">
            <p class="anniv__blurb"><?= $page->heroBlurb()->escape() ?></p>
            <div class="seal seal--spin" aria-label="Twentieth anniversary, 2006 to 2026">
                <span class="seal__big">20</span><span class="seal__small">years</span><span class="seal__years">2006 · 2026</span>
            </div>
        </div>
        <div class="hero__ctas hero__ctas--left reveal">
            <a href="/hall-of-fame" class="btn btn--gold btn--lg">Enter the Hall of Fame</a>
            <a href="/join" class="btn btn--ghost btn--lg" data-confetti>Audition (if you dare)</a>
        </div>
    </div>
    <span class="scrollcue" aria-hidden="true">Scroll, gracefully</span>
</section>

<section class="showbar" aria-label="Christmas Show 2026">
    <div class="showbar__track">
        <p class="showbar__eyebrow">Confirmed · Year 20</p>
        <p class="showbar__what"><strong>Confirmed: the Remarkable Men's Ballet returns for the 20th Christmas Show, December 2026.</strong> Tutus have been pressed. Dignity has not. Catch us Sat 5 Dec (3pm) and Sun 6 Dec (1pm and 5pm).</p>
        <a class="btn btn--primary btn--sm" href="/join" data-confetti>Season 21 recruits wanted</a>
        <a class="showbar__men" href="https://christmasshow.co.nz" rel="noopener">christmasshow.co.nz →</a>
    </div>
</section>

<section class="split">
    <div class="split__inner">
        <div class="split__big reveal"><span>A serious</span><span>endeavour.</span><em>Mostly.</em></div>
        <div class="split__text reveal">
            <p class="eyebrow">From the programme notes</p>
            <?= $page->introBody()->kt() ?>
        </div>
    </div>
</section>
<section hidden class="intro intro--programme">
    <div class="intro__inner">
        <p class="eyebrow">From the programme notes</p>
        <h2 class="intro__headline"><?= $page->introHeadline()->escape() ?></h2>
        <?= $page->introBody()->kt() ?>
    </div>
</section>

<?php snippet('next-show') ?>

<?php snippet('stats', ['story' => $story]) ?>

<?php if ($withPhoto && $withPhoto->count()): ?>
<section class="hof-strip">
    <div class="hof-strip__inner">
        <header class="section-head">
            <p class="eyebrow">Hall of Fame</p>
            <h2 class="display">Legends of the tulle</h2>
            <p class="section-head__blurb">Collect them all. Trade them at the bar. Do not, under any circumstances, get them laminated.</p>
        </header>
        <div class="tgrid tgrid--fan">
            <?php foreach ($withPhoto->limit(4) as $person): ?><?php snippet('person-card', ['person' => $person]) ?><?php endforeach ?>
        </div>
        <p class="section-cta"><a href="/hall-of-fame" class="btn btn--outline">See all <?= $members->count() ?> cards</a></p>
    </div>
</section>
<?php endif ?>

<?php snippet('milestones', ['story' => $story, 'more' => true]) ?>

<?php if ($press && $press->count()): ?>
<section class="marquee" aria-label="As seen in the press">
    <p class="eyebrow marquee__label">As seen in the press</p>
    <div class="marquee__viewport">
        <ul class="marquee__track">
            <?php foreach ([0, 1] as $dup): foreach ($press as $a): ?>
                <li<?= $dup ? ' aria-hidden="true"' : '' ?>><a href="<?= $a->url() ?>"<?= $dup ? ' tabindex="-1"' : '' ?>><span class="marquee__src"><?= $a->sourceName()->escape() ?></span> &ldquo;<?= $a->title()->escape() ?>&rdquo;</a></li>
            <?php endforeach; endforeach ?>
        </ul>
    </div>
</section>
<?php endif ?>

<section class="recruit ballet-gradient">
    <div class="recruit__inner">
        <h2>Could <em>you</em> be Remarkable?</h2>
        <p>No experience. No flexibility. No problem. We are always on the lookout for brave men of the Lakes District with a free week in December and a loose grip on dignity.</p>
        <a class="btn btn--gold btn--lg" href="/join" data-confetti>Read the audition requirements</a>
    </div>
</section>

<?php snippet('footer') ?>
