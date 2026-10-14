<?php snippet('header') ?>

<?php $hero = $page->images()->first(); ?>

<?php $s = rmbStats($page); $type = $page->personType()->or('performer')->value(); ?>
<article class="person person--hof">
    <header class="hof">
        <div class="hof__inner">
            <div data-tilt class="hof__card tcard tcard--big tcard--<?= esc($type, 'attr') ?>">
                <div class="tcard__top"><span class="tcard__no">No. <?= $s['number'] ?></span><span class="tcard__type"><?= esc(ucfirst($type)) ?></span></div>
                <div class="tcard__photo">
                    <?php if ($hero): ?>
                        <img src="<?= $hero->crop(720, 840)->url() ?>" alt="<?= $hero->alt()->or($page->title())->escape() ?>" loading="eager">
                    <?php else: ?>
                        <div class="tcard__silhouette" aria-hidden="true"><?= svg('assets/images/butterfly.svg') ?><span>Portrait pending</span></div>
                    <?php endif ?>
                </div>
                <div class="tcard__plate"><h1 class="tcard__name"><?= $page->stageName()->or($page->title())->escape() ?></h1></div>
            </div>
            <div class="hof__dossier">
                <p class="person__eyebrow">Hall of Fame · Official record</p>
                <h2 class="hof__name"><?= $page->title()->escape() ?></h2>
                <?php if ($page->role()->isNotEmpty()): ?><p class="person__role"><?= $page->role()->escape() ?></p><?php endif ?>
                <dl class="statsheet">
                    <div><dt>Years of service</dt><dd class="<?= $s['years']['draft'] ? 'is-draft' : '' ?>"><?= esc((string) $s['years']['value']) ?></dd></div>
                    <div><dt>Debut</dt><dd class="<?= $s['debut']['draft'] ? 'is-draft' : '' ?>"><?= esc((string) $s['debut']['value']) ?></dd></div>
                    <div><dt>Signature move</dt><dd class="<?= $s['move']['draft'] ? 'is-draft' : '' ?>"><?= esc($s['move']['value']) ?></dd></div>
                    <div><dt>Tutu colour</dt><dd class="<?= $s['tutu']['draft'] ? 'is-draft' : '' ?>"><?= esc($s['tutu']['value']) ?></dd></div>
                    <div><dt>Special power</dt><dd class="<?= $s['power']['draft'] ? 'is-draft' : '' ?>"><?= esc($s['power']['value']) ?></dd></div>
                    <div><dt>Status</dt><dd><?= $page->isCurrent()->toBool() ? 'Active duty' : 'Emeritus' ?></dd></div>
                </dl>
                <?php if (in_array(true, array_column($s, 'draft'), true)): ?>
                    <p class="draft-note">Stats in grey italics are [DRAFT] placeholders until confirmed by the dancer (or a reliable witness).</p>
                <?php endif ?>
            </div>
        </div>
    </header>

    <section class="person__bio prose">
        <?= $page->bio()->kt() ?>
    </section>

    <?php if ($page->quotes()->isNotEmpty()): ?>
        <section class="person__quotes">
            <h2 class="section-head__title">In their own (occasionally regrettable) words</h2>
            <?php foreach ($page->quotes()->toStructure() as $q): ?>
                <blockquote class="quote">
                    <p>&ldquo;<?= $q->quote()->escape() ?>&rdquo;</p>
                    <?php if ($q->context()->isNotEmpty()): ?>
                        <cite><?= $q->context()->escape() ?></cite>
                    <?php endif ?>
                </blockquote>
            <?php endforeach ?>
        </section>
    <?php endif ?>

    <?php
    $gallery = $page->images()->offset(1);
    ?>
    <?php if ($gallery->count()): ?>
        <section class="person__gallery">
            <h2 class="section-head__title">More evidence</h2>
            <div class="image-grid" data-lightbox-group>
                <?php foreach ($gallery as $img): ?>
                    <a href="<?= $img->url() ?>" class="image-grid__item"
                       data-lightbox-src="<?= $img->url() ?>"
                       data-lightbox-alt="<?= $img->alt()->or($page->title())->escape() ?>"
                       data-lightbox-caption="<?= $img->caption()->escape() ?>">
                        <img src="<?= $img->resize(600, 600, 80)->url() ?>"
                             alt="<?= $img->alt()->escape() ?>"
                             loading="lazy">
                    </a>
                <?php endforeach ?>
            </div>
        </section>
    <?php endif ?>
    <nav class="person__back"><a class="btn btn--outline" href="<?= $page->parent()->url() ?>">Back to the Hall of Fame</a></nav>
</article>

<?php snippet('footer') ?>
