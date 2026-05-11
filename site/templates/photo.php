<?php snippet('header') ?>

<?php $image = $page->images()->first(); ?>

<article class="photo-page">
    <?php if ($image): ?>
        <figure class="photo-page__figure">
            <img src="<?= $image->resize(1600, 1600, 85)->url() ?>"
                 alt="<?= $image->alt()->or($page->title())->escape() ?>"
                 loading="eager">
            <?php if ($image->caption()->isNotEmpty()): ?>
                <figcaption><?= $image->caption()->escape() ?></figcaption>
            <?php endif ?>
        </figure>
    <?php endif ?>

    <div class="photo-page__meta prose">
        <h1><?= $page->title()->escape() ?></h1>
        <p class="photo-page__when">
            <?php if ($page->showName()->isNotEmpty()): ?><?= $page->showName()->escape() ?><?php endif ?>
            <?php if ($page->showDate()->isNotEmpty()): ?> · <?= $page->showDate()->toDate('d M Y') ?><?php endif ?>
        </p>

        <?= $page->description()->kt() ?>

        <?php
        $tagGroups = [
            'Who'   => $page->whoTags(),
            'What'  => $page->whatTags(),
            'When'  => $page->whenTags(),
            'Where' => $page->whereTags(),
            'Why'   => $page->whyTags(),
        ];
        $hasTags = false;
        foreach ($tagGroups as $g) if ($g->isNotEmpty()) { $hasTags = true; break; }
        ?>
        <?php if ($hasTags): ?>
            <dl class="tag-grid">
                <?php foreach ($tagGroups as $label => $field): ?>
                    <?php if ($field->isNotEmpty()): ?>
                        <dt><?= $label ?></dt>
                        <dd>
                            <?php foreach ($field->split() as $tag): ?>
                                <span class="tag"><?= esc($tag) ?></span>
                            <?php endforeach ?>
                        </dd>
                    <?php endif ?>
                <?php endforeach ?>
            </dl>
        <?php endif ?>

        <?php $performers = $page->performers()->toPages(); ?>
        <?php if ($performers->count()): ?>
            <p class="photo-page__people">
                <strong>People:</strong>
                <?php foreach ($performers as $p): ?>
                    <a href="<?= $p->url() ?>"><?= $p->stageName()->or($p->title())->escape() ?></a><?= $performers->last()->is($p) ? '' : ', ' ?>
                <?php endforeach ?>
            </p>
        <?php endif ?>

        <?php if ($page->photographer()->isNotEmpty()): ?>
            <p class="photo-page__credit">Photo: <?= $page->photographer()->escape() ?></p>
        <?php endif ?>
    </div>
</article>

<?php snippet('footer') ?>
