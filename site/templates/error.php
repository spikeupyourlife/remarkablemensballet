<?php snippet('header') ?>
<section class="oops">
    <div class="oops__inner">
        <p class="oops__code">404</p>
        <h1 class="oops__title"><?= $page->headline()->or('This page has left the stage')->escape() ?></h1>
        <p class="oops__blurb"><?= $page->blurb()->escape() ?></p>
        <div class="hero__ctas">
            <a class="btn btn--primary" href="<?= url() ?>">Back to the home page</a>
            <a class="btn btn--outline" href="<?= url('hall-of-fame') ?>">Meet the troupe</a>
        </div>
    </div>
</section>
<?php snippet('footer') ?>
