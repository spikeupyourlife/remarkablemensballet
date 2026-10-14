</main>

<footer class="site-footer">
    <div class="site-footer__inner">
        <div class="site-footer__col">
            <p class="site-footer__brand">
                <span class="site-footer__line">Remarkable</span>
                <span class="site-footer__script">Men's Ballet</span>
            </p>
            <p class="site-footer__tagline"><?= $site->tagline()->escape() ?></p>
            <?php if ($site->showUrl()->isNotEmpty()): ?>
                <p class="site-footer__cred">
                    Part of
                    <a href="<?= $site->showUrl()->url() ?>" rel="noopener">
                        <?= $site->showName()->or('The Queenstown Christmas Show')->escape() ?>
                    </a>.
                </p>
            <?php endif ?>
        </div>

        <div class="site-footer__col">
            <h3 class="site-footer__heading">Wander</h3>
            <ul class="site-footer__list">
                <?php foreach ($site->children()->listed() as $item): ?>
                    <li><a href="<?= $item->url() ?>"><?= $item->title()->escape() ?></a></li>
                <?php endforeach ?>
            </ul>
        </div>

        <div class="site-footer__col">
            <h3 class="site-footer__heading">Find us</h3>
            <ul class="site-footer__social">
                <?php if ($site->facebook()->isNotEmpty()): ?>
                    <li><a href="<?= $site->facebook()->url() ?>" rel="noopener">Facebook</a></li>
                <?php endif ?>
                <?php if ($site->instagram()->isNotEmpty()): ?>
                    <li><a href="<?= $site->instagram()->url() ?>" rel="noopener">Instagram</a></li>
                <?php endif ?>
                <?php if ($site->youtube()->isNotEmpty()): ?>
                    <li><a href="<?= $site->youtube()->url() ?>" rel="noopener">YouTube</a></li>
                <?php endif ?>
                <?php if ($site->tiktok()->isNotEmpty()): ?>
                    <li><a href="<?= $site->tiktok()->url() ?>" rel="noopener">TikTok</a></li>
                <?php endif ?>
                <?php if ($site->contactEmail()->isNotEmpty()): ?>
                    <li><a href="mailto:<?= $site->contactEmail() ?>">Email</a></li>
                <?php endif ?>
            </ul>
        </div>
    </div>

    <div class="site-footer__legal">
        <p>&copy; <?= date('Y') ?> Remarkable Men's Ballet. All very serious.</p>
        <ul>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/submit-memory">Submit a memory</a></li>
        </ul>
    </div>
</footer>

<?= js('assets/js/main.js') ?>
<?= js('assets/js/fx.js', ['defer' => true]) ?>
</body>
</html>
