/* RMB fx: reveal, tilt, flip, count-up, confetti, sparkle cursor, curtain.
   Vanilla, ~4 KB. Everything bails out under prefers-reduced-motion. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const root = document.documentElement;
  root.classList.add('js');
  if (reduce) root.classList.add('reduce');

  // Curtain: plays once per session
  const curtain = document.querySelector('.curtain');
  if (curtain) {
    if (reduce || sessionStorage.getItem('rmb-curtain')) curtain.remove();
    else {
      sessionStorage.setItem('rmb-curtain', 1);
      requestAnimationFrame(() => setTimeout(() => curtain.classList.add('is-open'), 250));
      setTimeout(() => curtain.remove(), 2200);
    }
  }

  // Scroll reveal
  const els = document.querySelectorAll('.reveal, .reveal-stagger');
  if (reduce || !('IntersectionObserver' in window)) els.forEach(e => e.classList.add('is-in'));
  else {
    const io = new IntersectionObserver((entries) => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    els.forEach((e, i) => { e.style.setProperty('--d', (i % 4) * 70 + 'ms'); io.observe(e); });
  }

  // Count-up
  const fmt = n => n.toLocaleString('en-NZ');
  const counters = document.querySelectorAll('[data-count]');
  const run = el => {
    const end = +el.dataset.count, t0 = performance.now(), dur = 1400;
    const step = t => { const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(end * e)); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };
  if (!reduce && 'IntersectionObserver' in window) {
    counters.forEach(c => c.textContent = '0');
    const co = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { run(e.target); co.unobserve(e.target); } }), { threshold: .6 });
    counters.forEach(c => co.observe(c));
  }

  // Card flip on tap (touch devices); hover handles desktop in CSS
  document.querySelectorAll('.flip').forEach(card => {
    card.addEventListener('click', e => {
      if (fine) return;
      if (!card.classList.contains('is-flipped')) { e.preventDefault(); card.classList.add('is-flipped'); }
    });
  });

  // 3D tilt (desktop only)
  if (fine && !reduce) document.querySelectorAll('[data-tilt]').forEach(el => {
    let raf;
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--rx', (-y * 10).toFixed(2) + 'deg');
        el.style.setProperty('--ry', (x * 12).toFixed(2) + 'deg');
        el.style.setProperty('--mx', ((x + .5) * 100).toFixed(0) + '%');
        el.style.setProperty('--my', ((y + .5) * 100).toFixed(0) + '%');
      });
    });
    el.addEventListener('pointerleave', () => { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
  });

  // Confetti (tulle, sequins and the odd tutu)
  const colours = ['#ed1968', '#ffd800', '#ead8ee', '#ffffff', '#7b5cff'];
  const burst = (x, y) => {
    if (reduce) return;
    const c = document.createElement('canvas'); c.className = 'confetti';
    const dpr = Math.min(2, devicePixelRatio || 1);
    c.width = innerWidth * dpr; c.height = innerHeight * dpr; document.body.appendChild(c);
    const g = c.getContext('2d'); g.scale(dpr, dpr);
    const bits = Array.from({ length: 90 }, () => ({ x, y, vx: (Math.random() - .5) * 12, vy: -Math.random() * 12 - 4,
      r: Math.random() * 6 + 3, a: Math.random() * 6, va: (Math.random() - .5) * .3, c: colours[Math.random() * colours.length | 0],
      tutu: Math.random() < .08 }));
    let f = 0;
    const tick = () => {
      g.clearRect(0, 0, innerWidth, innerHeight);
      bits.forEach(b => { b.vy += .35; b.vx *= .99; b.x += b.vx; b.y += b.vy; b.a += b.va;
        g.save(); g.translate(b.x, b.y); g.rotate(b.a);
        if (b.tutu) { g.font = '18px serif'; g.fillText('🩰', -9, 6); }
        else { g.fillStyle = b.c; g.fillRect(-b.r / 2, -b.r / 4, b.r, b.r / 2); }
        g.restore(); });
      if (++f < 110) requestAnimationFrame(tick); else c.remove();
    };
    tick();
  };
  document.querySelectorAll('[data-confetti]').forEach(btn => btn.addEventListener('click', e => {
    if (reduce) return;
    const r = btn.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2);
    const href = btn.getAttribute('href');
    if (href && !e.metaKey && !e.ctrlKey && !href.startsWith('mailto')) { e.preventDefault(); setTimeout(() => location.href = href, 650); }
  }));
  window.rmbBurst = burst;

  // Sparkle trail on cards and buttons (desktop, throttled)
  if (fine && !reduce) {
    let last = 0;
    document.addEventListener('pointermove', e => {
      const now = performance.now(); if (now - last < 45) return;
      if (!e.target.closest('.flip, .btn, .seal, [data-tilt]')) return;
      last = now;
      const s = document.createElement('span'); s.className = 'sparkle';
      s.textContent = Math.random() < .15 ? '🩰' : '✦';
      s.style.left = e.clientX + 'px'; s.style.top = e.clientY + 'px';
      s.style.setProperty('--dx', (Math.random() - .5) * 40 + 'px');
      document.body.appendChild(s); setTimeout(() => s.remove(), 800);
    }, { passive: true });
  }

  // Timeline: drag to scroll + wheel to horizontal
  document.querySelectorAll('.htl__track').forEach(t => {
    let down = false, sx = 0, sl = 0;
    t.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; sx = e.clientX; sl = t.scrollLeft; t.classList.add('is-drag'); });
    addEventListener('pointerup', () => { down = false; t.classList.remove('is-drag'); });
    t.addEventListener('pointermove', e => { if (down) t.scrollLeft = sl - (e.clientX - sx); });
  });
})();
