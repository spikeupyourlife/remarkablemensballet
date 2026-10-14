<?php
/**
 * Hero block.
 * Expects: $page with heroHeadline, heroFlourish, heroBlurb, heroCta, heroCtaLink,
 *          heroSecondaryCta, heroSecondaryLink, and a hero image attached.
 */
$heroImage = $page->images()->template('image')->first() ?? $page->images()->first();
?>
<section class="hero">
    <?php if ($heroImage): ?>
        <picture class="hero__image">
            <source srcset="<?= $heroImage->resize(1920, 1280, 80)->url() ?>" media="(min-width: 1024px)">
            <source srcset="<?= $heroImage->resize(1280, 960, 80)->url() ?>" media="(min-width: 640px)">
            <img src="<?= $heroImage->resize(800, 1000, 80)->url() ?>"
                 alt="<?= $heroImage->alt()->escape() ?>"
                 loading="eager"
                 fetchpriority="high">
        </picture>
    <?php endif ?>

    <div class="hero__veil" aria-hidden="true"></div>

    <div class="hero__inner">
        <h1 class="hero__title">
            <span class="hero__title-line"><?= $page->heroHeadline()->or('Remarkable Men\'s Ballet')->escape() ?></span>
            <?php if ($page->heroFlourish()->isNotEmpty()): ?>
                <span class="hero__title-flourish"><?= $page->heroFlourish()->escape() ?></span>
            <?php endif ?>
        </h1>
        <?php if ($page->heroBlurb()->isNotEmpty()): ?>
            <p class="hero__blurb"><?= $page->heroBlurb()->escape() ?></p>
        <?php endif ?>
        <div class="hero__ctas">
            <?php if ($page->heroCta()->isNotEmpty()): ?>
                <a href="<?= $page->heroCtaLink()->or('/performances') ?>" class="btn btn--primary">
                    <?= $page->heroCta()->escape() ?>
                </a>
            <?php endif ?>
            <?php if ($page->heroSecondaryCta()->isNotEmpty()): ?>
                <a href="<?= $page->heroSecondaryLink()->or('/our-story') ?>" class="btn btn--ghost">
                    <?= $page->heroSecondaryCta()->escape() ?>
                </a>
            <?php endif ?>
        </div>
    </div>
</section>
