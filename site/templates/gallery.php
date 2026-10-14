<?php snippet('header') ?>

<header class="page-head">
    <div class="page-head__inner">
        <h1 class="page-head__title"><?= $page->headline()->or($page->title())->escape() ?></h1>
        <p class="page-head__blurb"><?= $page->blurb()->escape() ?></p>
    </div>
</header>

<section class="gallery">
    <div class="gallery__inner">
        <?php
        $albums = $page->children()->listed()->filterBy('intendedTemplate', 'album')->sortBy('showDate', 'desc');
        $photos = $page->children()->listed()->filterBy('intendedTemplate', 'photo')->sortBy('showDate', 'desc');
        ?>

        <?php if ($albums->count()): ?>
            <div class="card-grid">
                <?php foreach ($albums as $album): ?>
                    <?php
                    $cover = $album->cover()->toFile()
                        ?? $album->files()->template('image')->first()
                        ?? $album->images()->first();
                    $count = $album->files()->template('image')->count();
                    ?>
                    <a class="album-card" href="<?= $album->url() ?>">
                        <?php if ($cover): ?>
                            <img src="<?= $cover->resize(800, 800, 80)->url() ?>"
                                 alt="<?= $cover->alt()->or($album->title())->escape() ?>"
                                 loading="lazy">
                        <?php endif ?>
                        <div class="album-card__body">
                            <h3 class="album-card__title"><?= $album->headline()->or($album->title())->escape() ?></h3>
                            <p class="album-card__meta">
                                <?php if ($album->showDate()->isNotEmpty()): ?>
                                    <?= $album->showDate()->toDate('d M Y') ?> ·
                                <?php endif ?>
                                <?= $count ?> photo<?= $count === 1 ? '' : 's' ?>
                            </p>
                        </div>
                    </a>
                <?php endforeach ?>
            </div>
        <?php endif ?>

        <?php if ($photos->count()): ?>
            <h2 class="section-head__title" style="margin-top:3rem">Standalone shots</h2>
            <div class="masonry">
                <?php foreach ($photos as $photo): ?>
                    <?php snippet('photo-card', ['photo' => $photo]) ?>
                <?php endforeach ?>
            </div>
        <?php endif ?>
    </div>
</section>

<?php snippet('footer') ?>
