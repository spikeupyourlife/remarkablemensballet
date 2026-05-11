<?php snippet('header') ?>

<header class="page-head">
    <div class="page-head__inner">
        <h1 class="page-head__title"><?= $page->headline()->or($page->title())->escape() ?></h1>
        <p class="page-head__blurb"><?= $page->blurb()->escape() ?></p>
    </div>
</header>

<section class="contact">
    <div class="contact__inner prose">
        <?php if ($page->email()->isNotEmpty()): ?>
            <p>
                <strong>General:</strong>
                <a href="mailto:<?= $page->email() ?>"><?= $page->email() ?></a>
            </p>
        <?php endif ?>
        <?php if ($page->bookings()->isNotEmpty()): ?>
            <h3>Bookings &amp; press</h3>
            <?= $page->bookings()->kt() ?>
        <?php endif ?>
    </div>
</section>

<?php snippet('footer') ?>
