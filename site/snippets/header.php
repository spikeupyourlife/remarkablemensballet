<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= $page->isHomePage() ? $site->title() . ' · 20 years of tutus' : $page->title() . ' · ' . $site->title() ?></title>
    <meta name="description" content="<?= $page->metaDescription()->or($site->metaDescription())->escape() ?>">

    <meta property="og:title" content="<?= $page->title()->escape() ?>">
    <meta property="og:description" content="<?= $page->metaDescription()->or($site->metaDescription())->escape() ?>">
    <meta property="og:type" content="website">
    <meta property="og:url" content="<?= $page->url() ?>">
    <meta property="og:site_name" content="<?= $site->title()->escape() ?>">
    <meta property="og:locale" content="en_NZ">
    <?php $ogImage = $site->ogImage()->toFile() ?? $page->images()->first() ?? page('home')?->images()->first(); ?>
    <?php if ($ogImage): ?>
        <meta property="og:image" content="<?= $ogImage->crop(1200, 630)->url() ?>">
        <meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
        <meta name="twitter:card" content="summary_large_image">
    <?php endif ?>
    <link rel="canonical" href="<?= $page->url() ?>">
    <link rel="icon" href="<?= url('assets/images/favicon.svg') ?>" type="image/svg+xml">
    <link rel="apple-touch-icon" href="<?= url('assets/images/apple-touch-icon.png') ?>">
    <meta name="theme-color" content="#131038">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,700;1,900&family=Inter:wght@300;400;500;600;700&family=Dancing+Script:wght@400;600;700&display=swap">

    <?= css('assets/css/main.css') ?>
    <?= css('assets/css/upgrade.css') ?>
    <?= css('assets/css/v2.css') ?>
    <?= css('assets/css/' . $page->intendedTemplate()->name() . '.css', ['accept' => false]) ?>
</head>
<body class="page--<?= $page->intendedTemplate() ?>">

<a class="skip" href="#main">Skip to content</a>

<header class="site-header">
    <div class="site-header__inner">
        <a href="<?= $site->url() ?>" class="site-brand" aria-label="<?= $site->title() ?> — home">
            <span class="site-brand__mark site-brand__mark--crest" aria-hidden="true">
                <img src="<?= url('assets/images/crest-shield.svg') ?>" alt="" width="472" height="682">
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
                <?php foreach ($site->children()->listed()->not('home', 'sponsors', 'contact', 'submit-memory') as $item): ?>
                    <li class="site-nav__item">
                        <a href="<?= $item->url() ?>"
                           class="site-nav__link <?= $item->isOpen() ? 'is-active' : '' ?>">
                            <?= $item->title()->escape() ?>
                        </a>
                    </li>
                <?php endforeach ?>
                <li class="site-nav__item site-nav__item--cta"><a href="<?= url('join') ?>" class="btn btn--primary btn--sm" data-confetti>Audition</a></li>
            </ul>
        </nav>
    </div>
</header>

<main id="main">
