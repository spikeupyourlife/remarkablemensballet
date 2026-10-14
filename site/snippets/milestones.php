<?php $items = ($story ?? page('our-story'))?->milestones()->toStructure(); if (!$items || !$items->count()) return; ?>
<section class="htl" aria-label="Twenty years, give or take">
    <div class="htl__head reveal">
        <p class="eyebrow">The long and winding pirouette</p>
        <h2 class="display">Twenty years<br>in twelve seconds</h2>
        <?php if (!empty($more)): ?><p><a class="btn btn--outline btn--sm" href="/our-story">Read the whole story</a></p><?php endif ?>
    </div>
    <ol class="htl__track" tabindex="0">
        <?php foreach ($items as $m): ?>
            <li class="htl__item"><span class="htl__year"><?= $m->year()->escape() ?></span><h3><?= $m->title()->escape() ?></h3><p><?= $m->text()->escape() ?></p></li>
        <?php endforeach ?>
    </ol>
</section>
