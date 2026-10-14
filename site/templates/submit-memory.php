<?php snippet('header') ?>

<header class="page-head">
    <div class="page-head__inner">
        <h1 class="page-head__title"><?= $page->headline()->or($page->title())->escape() ?></h1>
        <?= $page->blurb()->kt() ?>
    </div>
</header>

<section class="submit">
    <div class="submit__inner">
        <?php
        $submitted = get('submitted') === 'true';
        ?>

        <?php if ($submitted): ?>
            <div class="submit__thanks">
                <h2>Thanks.</h2>
                <?= $page->thanks()->kt() ?>
                <p><a href="/submit-memory" class="btn btn--ghost">Submit another</a></p>
            </div>
        <?php else: ?>
            <form class="submit__form"
                  action="<?= $page->url() ?>"
                  method="post"
                  enctype="multipart/form-data">

                <?php snippet('form-messages', ['error' => $error ?? null]) ?>
                <?php snippet('honeypot') ?>

                <label>
                    Your name
                    <input type="text" name="name" required maxlength="120" value="<?= esc($values['name'] ?? '', 'attr') ?>">
                </label>
                <label>
                    Email
                    <input type="email" name="email" required maxlength="200" value="<?= esc($values['email'] ?? '', 'attr') ?>">
                </label>
                <label>
                    What year was this? (best guess)
                    <input type="number" name="year" min="2006" max="<?= date('Y') ?>">
                </label>
                <label>
                    The story / context
                    <textarea name="story" rows="5" maxlength="4000" required><?= esc($values['story'] ?? '') ?></textarea>
                </label>
                <label>
                    Attach photos or short videos (multiple)
                    <input type="file" name="files[]" multiple accept="image/*,video/*">
                </label>

                <button type="submit" class="btn btn--primary">Send it in</button>
            </form>
        <?php endif ?>
    </div>
</section>

<?php snippet('footer') ?>
