<?php $stats = ($story ?? page('our-story'))?->stats()->toStructure(); if (!$stats || !$stats->count()) return; ?>
<section class="numbers" aria-label="The stats board">
    <div class="numbers__inner reveal-stagger">
        <?php foreach ($stats as $st): $n = $st->number()->value(); $digits = preg_replace('/\D/', '', $n); ?>
            <div><span class="numbers__n"<?= $digits !== '' && $digits === str_replace(',', '', rtrim($n, '+')) ? ' data-count="' . $digits . '"' : '' ?>><?= esc($n) ?></span><span class="numbers__l"><?= $st->label()->escape() ?></span></div>
        <?php endforeach ?>
    </div>
</section>
