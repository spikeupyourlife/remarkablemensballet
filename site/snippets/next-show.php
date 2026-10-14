<?php $show = option('rmb.nextShow'); if (!$show || strtotime($show['starts']) < time() - 86400 * 2) return; ?>
<section class="nextshow" aria-label="Next show">
    <div class="nextshow__card reveal">
        <p class="eyebrow">Next performance</p>
        <h2 class="nextshow__title"><?= esc($show['title']) ?></h2>
        <p class="nextshow__kicker"><?= esc($show['kicker']) ?></p>
        <ul class="nextshow__times">
            <?php foreach ($show['times'] as $t): ?><li><?= esc($t) ?></li><?php endforeach ?>
        </ul>
        <div class="countdown" data-countdown="<?= esc($show['starts'], 'attr') ?>" aria-live="off">
            <div><span data-cd="d">--</span><small>days</small></div>
            <div><span data-cd="h">--</span><small>hours</small></div>
            <div><span data-cd="m">--</span><small>minutes</small></div>
            <p class="countdown__done" hidden>Curtain up. Tutus on.</p>
        </div>
        <p class="nextshow__more">Venue, times and tickets: <a href="<?= esc($show['url'], 'attr') ?>" rel="noopener">christmasshow.co.nz</a></p>
    </div>
</section>
<script>
(function () {
  var el = document.currentScript.previousElementSibling.querySelector('[data-countdown]');
  if (!el) return;
  var t = new Date(el.getAttribute('data-countdown')).getTime();
  function tick() {
    var s = Math.max(0, Math.floor((t - Date.now()) / 1000));
    if (s === 0) { el.querySelector('.countdown__done').hidden = false; return; }
    el.querySelector('[data-cd=d]').textContent = Math.floor(s / 86400);
    el.querySelector('[data-cd=h]').textContent = Math.floor(s % 86400 / 3600);
    el.querySelector('[data-cd=m]').textContent = Math.floor(s % 3600 / 60);
  }
  tick(); setInterval(tick, 30000);
})();
</script>
