<form class="rmb-form" action="<?= esc($action, 'attr') ?>" method="post" novalidate>
    <?php snippet('honeypot') ?>
    <?php foreach ($fields as $k => $label): $req = in_array($k, $required, true); $val = $values[$k] ?? ''; ?>
        <label class="rmb-form__field">
            <span><?= esc($label) ?><?= $req ? ' *' : '' ?></span>
            <?php if (in_array($k, $textareas, true)): ?>
                <textarea name="<?= $k ?>" rows="4" maxlength="4000"<?= $req ? ' required' : '' ?>><?= esc($val) ?></textarea>
            <?php else: ?>
                <input type="<?= $k === 'email' ? 'email' : ($k === 'phone' ? 'tel' : 'text') ?>" name="<?= $k ?>" maxlength="300" value="<?= esc($val, 'attr') ?>"<?= $req ? ' required' : '' ?><?= $k === 'email' ? ' autocomplete="email"' : ($k === 'name' ? ' autocomplete="name"' : '') ?>>
            <?php endif ?>
        </label>
    <?php endforeach ?>
    <button type="submit" class="btn btn--primary"><?= esc($button) ?></button>
</form>
