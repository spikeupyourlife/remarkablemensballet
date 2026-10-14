<?php if (!empty($sent)): ?>
    <div class="form-msg form-msg--ok" role="status"><?= $sent ?></div>
<?php elseif (!empty($error)): ?>
    <div class="form-msg form-msg--err" role="alert"><?= esc($error) ?></div>
<?php endif ?>
