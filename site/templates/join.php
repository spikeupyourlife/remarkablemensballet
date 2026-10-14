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
                <p class="draft-note">[DRAFT] Sign-up button appears once a contact email is set in the Panel.</p>
            <?php endif ?>
        </div>
    </div>
</section>
<?php snippet('footer') ?>
