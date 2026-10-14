<?php $out = $video->linkOut()->toBool(); ?>
<a href="<?= $out ? esc($video->videoUrl()->value(), 'attr') : $video->url() ?>" class="video-card"<?= $out ? ' target="_blank" rel="noopener"' : '' ?>>
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
    <h3 class="video-card__title"><?= $video->title()->escape() ?><?= $out ? ' <small>(opens Vimeo)</small>' : '' ?></h3>
</a>
