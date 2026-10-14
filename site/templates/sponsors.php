<?php snippet('header') ?>

<header class="page-head">
    <div class="page-head__inner">
        <h1 class="page-head__title"><?= $page->headline()->or($page->title())->escape() ?></h1>
        <p class="page-head__blurb"><?= $page->blurb()->escape() ?></p>
    </div>
</header>

<?php if ($page->causeHeadline()->isNotEmpty() || $page->causeBody()->isNotEmpty()): ?>
<section class="cause ballet-gradient">
    <div class="cause__inner">
        <h2 class="cause__headline"><?= $page->causeHeadline()->escape() ?></h2>
        <div class="cause__body prose-inverse">
            <?= $page->causeBody()->kt() ?>
        </div>
        <?php if ($page->donationsActive()->toBool() && $page->donationUrl()->isNotEmpty()): ?>
            <p>
                <a href="<?= $page->donationUrl()->url() ?>" class="btn btn--gold" rel="noopener">
                    <?= $page->donationCta()->or('Donate')->escape() ?>
                </a>
            </p>
        <?php endif ?>
    </div>
</section>
<?php endif ?>

<?php
$tiers = [
    'principal' => 'Principal sponsors',
    'major'     => 'Major sponsors',
    'supporter' => 'Supporters',
    'friend'    => 'Friends of the show',
    'inkind'    => 'In-kind partners',
];
$bytier = $page->children()->listed()->groupBy('tier');
?>
<?php if ($page->children()->listed()->count() === 0 && $page->emptyBlurb()->isNotEmpty()): ?>
<section class="sponsors sponsors--empty"><div class="sponsors__inner"><p class="coming-soon coming-soon--big"><?= $page->emptyBlurb()->kti() ?></p></div></section>
<?php endif ?>
<section class="sponsors">
    <div class="sponsors__inner">
        <?php foreach ($tiers as $key => $heading): ?>
            <?php if (!isset($bytier->$key) || $bytier->$key->count() === 0) continue; ?>
            <div class="sponsors__tier sponsors__tier--<?= $key ?>">
                <h2 class="section-head__title"><?= $heading ?></h2>
                <div class="card-grid card-grid--logos">
                    <?php foreach ($bytier->$key as $s): ?>
                        <a href="<?= $s->website()->or('#')->url() ?>" class="sponsor-card" rel="noopener">
                            <?php $logo = $s->images()->first(); ?>
                            <?php if ($logo): ?>
                                <img src="<?= $logo->resize(0, 200, 85)->url() ?>" alt="<?= $s->title()->escape() ?>">
                            <?php else: ?>
                                <span class="sponsor-card__name"><?= $s->title()->escape() ?></span>
                            <?php endif ?>
                        </a>
                    <?php endforeach ?>
                </div>
            </div>
        <?php endforeach ?>
    </div>
</section>

<?php snippet('footer') ?>
