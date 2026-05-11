<?php snippet('header') ?>

<header class="page-head">
    <div class="page-head__inner">
        <h1 class="page-head__title"><?= $page->headline()->or($page->title())->escape() ?></h1>
        <p class="page-head__blurb"><?= $page->blurb()->escape() ?></p>
    </div>
</header>

<section class="videos">
    <div class="videos__inner">
        <div class="card-grid">
            <?php foreach ($page->children()->listed() as $video): ?>
                <a href="<?= $video->url() ?>" class="video-card">
                    <div class="video-card__thumb">
                        <?php
                        $thumb = $video->thumbnail()->toFile();
                        if (!$thumb && $video->videoType()->value() === 'youtube') {
                            preg_match('~(?:youtu\.be/|youtube\.com/(?:watch\?v=|embed/|shorts/))([\w-]{11})~', $video->videoUrl(), $m);
                            $ytid = $m[1] ?? null;
                            if ($ytid) {
                                ?>
                                <img src="https://i.ytimg.com/vi/<?= $ytid ?>/hqdefault.jpg" alt="" loading="lazy">
                                <?php
                            }
                        } elseif ($thumb) {
                            ?>
                            <img src="<?= $thumb->resize(800, 450, 80)->url() ?>" alt="" loading="lazy">
                            <?php
                        }
                        ?>
                        <span class="video-card__play" aria-hidden="true">▶</span>
                    </div>
                    <h3 class="video-card__title"><?= $video->title()->escape() ?></h3>
                </a>
            <?php endforeach ?>
        </div>
    </div>
</section>

<?php snippet('footer') ?>
