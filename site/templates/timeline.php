<?php snippet('header') ?>

<header class="page-head page-head--big">
    <div class="page-head__inner">
        <p class="page-head__eyebrow">Year <?= kirby()->option('rmb.show_year', 20) ?></p>
        <h1 class="page-head__title"><?= $page->headline()->or($page->title())->escape() ?></h1>
        <p class="page-head__blurb"><?= $page->blurb()->escape() ?></p>
    </div>
</header>

<section class="timeline">
    <div class="timeline__inner">
        <ol class="timeline__list">
            <?php foreach ($page->children()->listed()->sortBy('year', 'desc') as $year): ?>
                <li class="timeline__item <?= $year->isMilestone()->toBool() ? 'is-milestone' : '' ?>">
                    <a href="<?= $year->url() ?>" class="timeline-card">
                        <div class="timeline-card__year"><?= $year->year() ?></div>
                        <div class="timeline-card__body">
                            <h3 class="timeline-card__title"><?= $year->showTitle()->or($year->title())->escape() ?></h3>
                            <?php if ($year->summary()->isNotEmpty()): ?>
                                <p class="timeline-card__summary"><?= $year->summary()->escape() ?></p>
                            <?php endif ?>
                        </div>
                        <?php $img = $year->highlightImage()->toFile() ?? $year->images()->first(); ?>
                        <?php if ($img): ?>
                            <div class="timeline-card__image">
                                <img src="<?= $img->resize(600, 600, 80)->url() ?>" alt="" loading="lazy">
                            </div>
                        <?php endif ?>
                    </a>
                </li>
            <?php endforeach ?>
        </ol>
    </div>
</section>

<?php snippet('footer') ?>
