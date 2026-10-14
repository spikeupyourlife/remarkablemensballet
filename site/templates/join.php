<?php snippet('header') ?>
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
            <a class="btn btn--primary" data-confetti href="#signup"><?= $page->ctaLabel()->escape() ?></a>
        </div>
    </div>
</section>
<section class="signup" id="signup">
    <div class="signup__inner">
        <p class="eyebrow">Step one</p>
        <h2 class="display">Put my name down</h2>
        <?php if ($sent): ?>
            <?php snippet('form-messages', ['sent' => 'Bravo. Your name is in the tutu hat. Someone from the troupe will be in touch before rehearsals start. Start pointing your toes.']) ?>
        <?php else: ?>
            <p>Tell us who you are and describe your single best dance move. In words. We are not ready for video.</p>
            <?php snippet('form-messages', ['error' => $error]) ?>
            <?php snippet('rmb-form', ['fields' => $fields, 'values' => $values, 'textareas' => ['move', 'notes'], 'required' => ['name', 'email', 'move'], 'button' => 'Sign me up', 'action' => $page->url() . '#signup']) ?>
        <?php endif ?>
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
