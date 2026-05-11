<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= $page->isHomePage() ? $site->title() : $page->title() . ' — ' . $site->title() ?></title>
    <meta name="description" content="<?= $page->metaDescription()->or($site->metaDescription())->escape() ?>">

    <meta property="og:title" content="<?= $page->title()->escape() ?>">
    <meta property="og:description" content="<?= $page->metaDescription()->or($site->metaDescription())->escape() ?>">
    <meta property="og:type" content="website">
    <meta property="og:url" content="<?= $page->url() ?>">
    <?php if ($ogImage = $site->ogImage()->toFile()): ?>
        <meta property="og:image" content="<?= $ogImage->resize(1200, 630)->url() ?>">
    <?php endif ?>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Inter:wght@300;400;500;600;700&family=Dancing+Script:wght@400;600;700&display=swap">

    <?= css('assets/css/main.css') ?>
    <?= css('assets/css/' . $page->intendedTemplate()->name() . '.css', ['accept' => false]) ?>
</head>
<body class="page--<?= $page->intendedTemplate() ?>">

<a class="skip" href="#main">Skip to content</a>

<header class="site-header">
    <div class="site-header__inner">
        <a href="<?= $site->url() ?>" class="site-brand" aria-label="<?= $site->title() ?> — home">
            <span class="site-brand__mark" aria-hidden="true">
                <?= svg('assets/images/butterfly.svg') ?>
            </span>
            <span class="site-brand__name">
                <span class="site-brand__name-line">Remarkable</span>
                <span class="site-brand__name-script">Men's Ballet</span>
            </span>
        </a>

        <nav class="site-nav" aria-label="Primary">
            <button class="site-nav__toggle" aria-expanded="false" aria-controls="site-nav-list">
                <span class="visually-hidden">Menu</span>
                <span aria-hidden="true">≡</span>
            </button>
            <ul id="site-nav-list" class="site-nav__list">
                <?php foreach ($site->children()->listed() as $item): ?>
                    <li class="site-nav__item">
                        <a href="<?= $item->url() ?>"
                           class="site-nav__link <?= $item->isOpen() ? 'is-active' : '' ?>">
                            <?= $item->title()->escape() ?>
                        </a>
                    </li>
                <?php endforeach ?>
            </ul>
        </nav>
    </div>
</header>

<main id="main">
