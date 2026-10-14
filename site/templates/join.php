<?php snippet('header') ?>
<?php $email = $page->ctaEmail()->or($site->contactEmail()); ?>
<header class="page-head page-head--curtain">
    <div class="page-head__inner">
        <p class="page-head__eyebrow">Now casting · Season 21</p>
        <h1 class="page-head__title"><?= $page->headline()->escape() ?></h1>
        <p class="page-head__blurb"><?= $page->blurb()->escape() ?></p>
    </div>
</header>

<section class="audition">
    <div class="audition__inner">
        <div class="audition__form-sheet reveal">
            <p class="stamp">Official document</p>
            <h2>Essential criteria</h2>
            <ul class="checklist"><?php foreach ($page->requirements()->split("\n") as $line): $line = ltrim(trim($line), '- '); if ($line === '') continue; ?>
                <li><?= esc($line) ?></li>
            <?php endforeach ?></ul>
            <h3>Not required</h3>
            <p class="audition__not"><?= $page->notRequired()->escape() ?></p>
        </div>
        <div class="audition__process reveal">
            <h2>The process</h2>
            <?= $page->process()->kt() ?>
            <?php if ($email->isNotEmpty()): ?>
                <a class="btn btn--primary" data-confetti href="mailto:<?= $email ?>?subject=I%20would%20like%20to%20wear%20the%20tutu"><?= $page->ctaLabel()->escape() ?></a>
            <?php else: ?>
                <p class="coming-soon">Sign-ups open soon. Our audition inbox is still being fitted for a tutu. Meanwhile, leave your name via the <a href="/submit-memory">memory form</a> and we'll be in touch.</p>
            <?php endif ?>
        </div>
    </div>
</section>
<?php $faq = $page->faq()->toStructure(); if ($faq->count()): ?>
<section class="faq">
    <div class="faq__inner">
        <p class="eyebrow">Recruitment FAQ</p>
        <h2 class="display">Questions men ask (eventually)</h2>
        <?php foreach ($faq as $item): ?>
            <details class="faq__item"><summary><?= $item->q()->escape() ?></summary><p><?= $item->a()->escape() ?></p></details>
        <?php endforeach ?>
    </div>
</section>
<?php endif ?>
<?php snippet('footer') ?>
