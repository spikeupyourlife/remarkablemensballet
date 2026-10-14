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
        <h2>Send us a note</h2>
        <?php if ($sent): ?>
            <?php snippet('form-messages', ['sent' => "Note received. It has been placed on a small velvet cushion and carried to the troupe. We'll reply as soon as someone remembers their password."]) ?>
        <?php else: ?>
            <?php snippet('form-messages', ['error' => $error]) ?>
            <?php snippet('rmb-form', ['fields' => $fields, 'values' => $values, 'textareas' => ['message'], 'required' => ['name', 'email', 'message'], 'button' => 'Send it', 'action' => $page->url()]) ?>
        <?php endif ?>
        <?php if ($page->bookings()->isNotEmpty()): ?>
            <h3>Bookings &amp; press</h3>
            <?= $page->bookings()->kt() ?>
        <?php endif ?>
    </div>
</section>

<?php snippet('footer') ?>
