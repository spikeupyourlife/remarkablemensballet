<?php snippet('header') ?>

<header class="page-head">
    <div class="page-head__inner">
        <h1 class="page-head__title"><?= $page->headline()->or($page->title())->escape() ?></h1>
        <p class="page-head__blurb"><?= $page->blurb()->escape() ?></p>
    </div>
</header>

<?php
$all = $page->children()->listed()->filterBy('showInList', true);
$types = $all->groupBy('personType');

$labels = [
    'performer'     => 'Performers',
    'choreographer' => 'Choreographers',
    'costume'       => 'Costume',
    'makeup'        => 'Makeup',
    'musician'      => 'Music',
    'director'      => 'Direction',
    'producer'      => 'Production',
    'assistant'     => 'The PAs',
    'fan'           => 'Honorary members',
    'rookie'        => 'Rookies',
    'other'         => 'Other miracle workers',
];
?>

<section class="team">
    <div class="team__inner">
        <?php foreach ($labels as $key => $heading): ?>
            <?php if (!isset($types->$key) || $types->$key->count() === 0) continue; ?>
            <div class="team__section" data-type="<?= $key ?>">
                <h2 class="team__heading"><?= $heading ?></h2>
                <div class="card-grid">
                    <?php foreach ($types->$key as $person): ?>
                        <?php snippet('person-card', ['person' => $person]) ?>
                    <?php endforeach ?>
                </div>
            </div>
        <?php endforeach ?>
    </div>
</section>

<?php snippet('footer') ?>
