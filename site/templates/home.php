<?php snippet('header') ?>
<?php
$heroImage = $page->images()->first();
$team = page('team');
$members = $team ? $team->children()->listed() : null;
$withPhoto = $members ? $members->filter(fn($p) => $p->images()->count() > 0) : null;
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
            <a href="/team" class="btn btn--gold btn--lg">Enter the Hall of Fame</a>
            <a href="/join" class="btn btn--ghost btn--lg" data-confetti>Audition (if you dare)</a>
        </div>
    </div>
    <span class="scrollcue" aria-hidden="true">Scroll, gracefully</span>
</section>

<section class="showbar" aria-label="Christmas Show 2026">
    <div class="showbar__track">
        <p class="showbar__eyebrow">Season 21 · Auditions</p>
        <p class="showbar__what"><strong>Christmas Stars</strong>, the 20th Anniversary Christmas Show: Sat 5 Dec (3pm) and Sun 6 Dec (1pm and 5pm). Kids' auditions (ages 8 to 14) are <strong>Sunday 18 October</strong> at the Arrowtown Athenaeum Hall.</p>
        <a class="btn btn--primary btn--sm" href="https://christmasshow.co.nz/audition-info/" rel="noopener">Audition info</a>
        <a class="showbar__men" href="/join">Grown men: different audition →</a>
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

<section class="numbers">
    <div class="numbers__inner reveal-stagger">
        <div><span class="numbers__n" data-count="20">20</span><span class="numbers__l">years of tulle</span></div>
        <div><span class="numbers__n" data-count="<?= $members ? $members->count() : 0 ?>"><?= $members ? $members->count() : 0 ?></span><span class="numbers__l">names in the Hall of Fame</span></div>
        <div><span class="numbers__n" data-count="3">3</span><span class="numbers__l">mayors in tutus</span></div>
        <div><span class="numbers__n" data-count="2700">2,700</span><span class="numbers__l">witnesses in 2025</span></div>
    </div>
</section>

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
        <p class="section-cta"><a href="/team" class="btn btn--outline">See all <?= $members->count() ?> cards</a></p>
    </div>
</section>
<?php endif ?>

<section class="htl" aria-label="Twenty years, give or take">
    <div class="htl__head reveal">
        <p class="eyebrow">The long and winding pirouette</p>
        <h2 class="display">Twenty years<br>in twelve seconds</h2>
        <p class="draft-note">[DRAFT] Milestones from the press archive. Spike to verify.</p>
    </div>
    <ol class="htl__track" tabindex="0">
        <?php foreach ([
            ['2006', 'The idea', 'Doug Kamo and Simon Green talk a group of grown men into tutus. Nobody has recovered.'],
            ['2009', 'A mayor in tulle', 'Mayor Clive Geddes joins the line. Civic dignity takes a brief holiday.'],
            ['2010', 'The dream team', 'The press notices. "Dream team" is the phrase used. We have framed it.'],
            ['2011', 'The class of 2011', 'James Beech files a column from inside the troupe. Journalism is never the same.'],
            ['2013', 'Enter the choreographer', 'Anna Stuart takes charge of the steps. Standards rise, briefly.'],
            ['2020', 'Winter Festival', 'The troupe goes rogue at the Queenstown Winter Festival. In winter. In tutus.'],
            ['2025', 'Arrowtown, and a record', 'First ever show outside the Christmas Show, then a record 2,700 crowd in December.'],
            ['2026', 'Year twenty', 'Christmas Stars. The 20th anniversary. We pretend to be very calm about it.'],
        ] as [$y, $t, $b]): ?>
            <li class="htl__item"><span class="htl__year"><?= $y ?></span><h3><?= $t ?></h3><p><?= $b ?></p></li>
        <?php endforeach ?>
    </ol>
</section>

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
        <p>[DRAFT] No experience. No flexibility. No problem. We are always on the lookout for brave men of the Lakes District with a free week in December and a loose grip on dignity.</p>
        <a class="btn btn--gold btn--lg" href="/join" data-confetti>Read the audition requirements</a>
    </div>
</section>

<?php snippet('footer') ?>
