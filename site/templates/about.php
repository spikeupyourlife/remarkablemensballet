<?php snippet('header') ?>

<article class="about">
    <header class="page-head page-head--curtain">
        <div class="page-head__inner">
            <p class="page-head__eyebrow">Our story · Since the very first Christmas Show</p>
            <h1 class="page-head__title"><?= $page->headline()->or($page->title())->escape() ?></h1>
        </div>
    </header>

    <?php $img = $page->images()->first(); ?>
    <?php if ($img): ?>
        <figure class="about__hero">
            <img src="<?= $img->resize(1400, 0, 85)->url() ?>" alt="<?= $img->alt()->escape() ?>">
        </figure>
    <?php endif ?>

    <div class="prose about__body">
        <?= $page->body()->kt() ?>
    </div>
</article>

<?php snippet('milestones', ['story' => $page]) ?>

<?php snippet('stats', ['story' => $page]) ?>

<?php $shame = $page->shame()->toStructure(); if ($shame->count()): ?>
<section class="shame">
    <div class="shame__inner">
        <header class="section-head">
            <p class="eyebrow">Lest we forget</p>
            <h2 class="display">The Wall of Shame</h2>
            <p class="section-head__blurb">Malfunctions, mishaps and moments of questionable judgement, preserved for posterity.</p>
        </header>
        <ul class="shame__grid">
            <?php foreach ($shame as $s): ?>
                <li class="shame__item"><span class="shame__year"><?= $s->year()->escape() ?></span><h3><?= $s->title()->escape() ?></h3><p><?= $s->text()->escape() ?></p></li>
            <?php endforeach ?>
            <li class="shame__item shame__item--soon"><span class="shame__year">Coming soon</span><h3>Your disaster here</h3><p>The troupe is compiling its confessions. Were you there? <a href="/submit-memory">Dob them in</a>.</p></li>
        </ul>
    </div>
</section>
<?php endif ?>

<section class="recruit ballet-gradient">
    <div class="recruit__inner">
        <h2>Help us fill the gaps</h2>
        <p>Whole years of our history (most of 2006 to 2018) are missing from the archive. Got a photo, a video or a story? We would very much like to see it. Probably.</p>
        <a class="btn btn--gold btn--lg" href="/submit-memory">Submit a memory</a>
    </div>
</section>

<?php snippet('footer') ?>
