/* ============================================================
   Remarkable Men's Ballet — site script
   ============================================================ */

// ------------- Mobile nav toggle ------------------------------
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

// ------------- Lightbox ---------------------------------------
// Activates on any container with [data-lightbox-group]. Children
// with [data-lightbox-src] become slides. Falls back to the regular
// link target if JS is disabled.
(() => {
  const groups = document.querySelectorAll('[data-lightbox-group]');
  if (!groups.length) return;

  const SLIDESHOW_INTERVAL = 4000;

  // ---- Build the lightbox DOM once and reuse for every group
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Photo viewer');
  lb.hidden = true;
  lb.innerHTML = `
    <button class="lightbox__close" type="button" aria-label="Close">×</button>
    <div class="lightbox__counter" aria-live="polite"></div>
    <button class="lightbox__prev" type="button" aria-label="Previous photo">‹</button>
    <button class="lightbox__next" type="button" aria-label="Next photo">›</button>
    <figure class="lightbox__figure">
      <div class="lightbox__loader" aria-hidden="true"></div>
      <img class="lightbox__img" alt="">
      <figcaption class="lightbox__caption">
        <span class="lightbox__caption-text"></span>
        <span class="lightbox__meta"></span>
      </figcaption>
    </figure>
    <div class="lightbox__toolbar">
      <button class="lightbox__play" type="button" aria-label="Start slideshow" aria-pressed="false">
        <span class="lightbox__play-icon">▶</span>
        <span class="lightbox__play-label">Slideshow</span>
      </button>
    </div>
  `;
  document.body.appendChild(lb);

  const elImg     = lb.querySelector('.lightbox__img');
  const elCap     = lb.querySelector('.lightbox__caption-text');
  const elMeta    = lb.querySelector('.lightbox__meta');
  const elCounter = lb.querySelector('.lightbox__counter');
  const elPlay    = lb.querySelector('.lightbox__play');
  const elPlayIcon = lb.querySelector('.lightbox__play-icon');
  const elPlayLabel = lb.querySelector('.lightbox__play-label');
  const elLoader  = lb.querySelector('.lightbox__loader');

  let slides = [];
  let current = 0;
  let playing = false;
  let timer = null;

  function preload(i) {
    if (i < 0 || i >= slides.length) return;
    const img = new Image();
    img.src = slides[i].src;
  }

  function show(i) {
    current = ((i % slides.length) + slides.length) % slides.length;
    const s = slides[current];

    elLoader.hidden = false;
    elImg.style.opacity = '0';

    const tmp = new Image();
    tmp.onload = () => {
      elImg.src = s.src;
      elImg.alt = s.alt || '';
      elLoader.hidden = true;
      elImg.style.opacity = '1';
    };
    tmp.onerror = () => { elLoader.hidden = true; };
    tmp.src = s.src;

    elCap.textContent  = s.caption || '';
    elMeta.textContent = s.meta || '';
    elCounter.textContent = `${current + 1} / ${slides.length}`;

    // Pre-warm neighbours
    preload(current + 1);
    preload(current - 1);
  }

  function open(groupSlides, index) {
    slides = groupSlides;
    lb.hidden = false;
    document.body.classList.add('is-lightbox-open');
    show(index);
  }

  function close() {
    pause();
    lb.hidden = true;
    document.body.classList.remove('is-lightbox-open');
    elImg.removeAttribute('src');
  }

  function next() { show(current + 1); }
  function prev() { show(current - 1); }

  function play() {
    if (playing) return;
    playing = true;
    elPlay.classList.add('is-playing');
    elPlay.setAttribute('aria-pressed', 'true');
    elPlay.setAttribute('aria-label', 'Pause slideshow');
    elPlayIcon.textContent = '⏸';
    elPlayLabel.textContent = 'Pause';
    timer = setInterval(next, SLIDESHOW_INTERVAL);
  }

  function pause() {
    if (!playing) return;
    playing = false;
    elPlay.classList.remove('is-playing');
    elPlay.setAttribute('aria-pressed', 'false');
    elPlay.setAttribute('aria-label', 'Start slideshow');
    elPlayIcon.textContent = '▶';
    elPlayLabel.textContent = 'Slideshow';
    if (timer) clearInterval(timer);
    timer = null;
  }

  // ---- Wire each group
  groups.forEach(group => {
    const cards = Array.from(group.querySelectorAll('[data-lightbox-src]'));
    const groupSlides = cards.map(c => ({
      src:     c.dataset.lightboxSrc,
      alt:     c.dataset.lightboxAlt || '',
      caption: c.dataset.lightboxCaption || '',
      meta:    c.dataset.lightboxMeta || '',
    }));

    cards.forEach((card, i) => {
      card.addEventListener('click', e => {
        // honour middle-click / ctrl-click / cmd-click as "open in new tab"
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
        e.preventDefault();
        open(groupSlides, i);
      });
    });
  });

  // ---- Controls
  lb.querySelector('.lightbox__close').addEventListener('click', close);
  lb.querySelector('.lightbox__prev').addEventListener('click', e => { e.stopPropagation(); pause(); prev(); });
  lb.querySelector('.lightbox__next').addEventListener('click', e => { e.stopPropagation(); pause(); next(); });
  elPlay.addEventListener('click', e => { e.stopPropagation(); playing ? pause() : play(); });

  // Click on the dim background (but not the image / buttons) closes
  lb.addEventListener('click', e => {
    if (e.target === lb || e.target.classList.contains('lightbox__figure')) close();
  });

  // ---- Keyboard
  document.addEventListener('keydown', e => {
    if (lb.hidden) return;
    switch (e.key) {
      case 'Escape':     e.preventDefault(); close(); break;
      case 'ArrowRight': e.preventDefault(); pause(); next(); break;
      case ' ':          e.preventDefault(); pause(); next(); break;
      case 'ArrowLeft':  e.preventDefault(); pause(); prev(); break;
      case 'p':
      case 'P':          e.preventDefault(); playing ? pause() : play(); break;
    }
  });

  // ---- Touch swipe
  let touchStartX = 0;
  let touchStartY = 0;
  lb.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  lb.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      pause();
      dx > 0 ? prev() : next();
    }
  }, { passive: true });
})();
