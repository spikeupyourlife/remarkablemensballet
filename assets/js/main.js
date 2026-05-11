(() => {
  const toggle = document.querySelector('.site-nav__toggle');
  const list = document.querySelector('#site-nav-list');
  if (toggle && list) {
    toggle.addEventListener('click', () => {
      const open = list.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
})();
