<?php snippet('header') ?>

<header class="page-head page-head--curtain">
    <div class="page-head__inner">
        <p class="page-head__eyebrow">Hall of Fame · 2006 to 2026</p>
        <h1 class="page-head__title"><?= $page->headline()->or($page->title())->escape() ?></h1>
        <p class="page-head__blurb"><?= $page->blurb()->escape() ?></p>
    </div>
</header>

<?php
$all = $page->children()->listed()->filterBy('showInList', true);
$perf = $all->filter(fn($p) => $p->personType()->value() === 'performer');
$sections = [
    ['current', 'The current company', 'Active duty. Tutus pressed. Dignity on leave.', $perf->filter(fn($p) => $p->isCurrent()->toBool())],
    ['choreo', 'Choreographers and crew', 'The people who make it look (almost) intentional.', $all->filter(fn($p) => $p->personType()->value() !== 'performer')],
    ['alumni', 'Alumni', 'Retired from the stage. Never from our hearts. Some of them still have the tutu.', $perf->filter(fn($p) => !$p->isCurrent()->toBool())],
];
?>

<section class="team">
    <p class="draft-note draft-note--center">Stats marked “Awaiting confession” fill in once the dancer owns up (bribes accepted). Know a name we've missed? <a href="/submit-memory">Tell us</a>.</p>
    <div class="team__inner">
        <?php foreach ($sections as [$key, $heading, $blurb, $people]): ?>
            <?php if ($people->count() === 0) continue; ?>
            <div class="team__section" id="<?= $key ?>" data-type="<?= $key ?>">
                <h2 class="team__heading"><?= $heading ?> <small>(<?= $people->count() ?>)</small></h2>
                <p class="team__blurb"><?= $blurb ?></p>
                <div class="tgrid">
                    <?php foreach ($people as $person): ?>
                        <?php snippet('person-card', ['person' => $person]) ?>
                    <?php endforeach ?>
                </div>
            </div>
        <?php endforeach ?>
    </div>
</section>

<?php snippet('footer') ?>
