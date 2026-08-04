/* ============================================================
   SHŠ Heretik — Scéna · site.js
   Veškerá interakce: header, mobilní menu, reveal, jiskry, lightbox.
   Vše s null-guards — stránka funguje i bez JS (progressive enhancement).
   ============================================================ */

(() => {
  'use strict';

  const doc = document;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  /* ---------- 1. Header — stav po scrollu ---------- */
  const header = doc.querySelector('.scena-header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- 2. Mobilní menu ---------- */
  const burger = doc.getElementById('menuToggle');
  const menu = doc.getElementById('scenaMenu');

  if (burger && menu) {
    const mobileMenu = window.matchMedia('(max-width: 1020px)');

    const setMenu = (open) => {
      const returnFocus = !open && mobileMenu.matches && menu.contains(doc.activeElement);
      if (returnFocus) burger.focus();
      burger.classList.toggle('active', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Zavřít menu' : 'Otevřít menu');
      menu.classList.toggle('is-open', open);
      if (open) doc.body.classList.add('scroll-locked');
      else if (!doc.getElementById('lightbox')?.classList.contains('open')) {
        doc.body.classList.remove('scroll-locked');
      }
      if (mobileMenu.matches) menu.setAttribute('aria-hidden', String(!open));
      else menu.removeAttribute('aria-hidden');
      if (open) {
        const first = menu.querySelector('a');
        if (first) first.focus();
      }
    };

    const syncMenu = () => {
      if (!mobileMenu.matches && menu.classList.contains('is-open')) setMenu(false);
      else if (mobileMenu.matches) {
        menu.setAttribute('aria-hidden', String(!menu.classList.contains('is-open')));
      } else {
        menu.removeAttribute('aria-hidden');
      }
    };

    syncMenu();

    burger.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));

    // Zavření po kliku na odkaz
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

    // Escape zavře menu
    doc.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false);
    });

    // Focus trap uvnitř menu
    menu.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const links = Array.from(menu.querySelectorAll('a:not([tabindex="-1"])'));
      if (!links.length) return;
      const first = links[0];
      const last = links[links.length - 1];
      if (e.shiftKey && doc.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && doc.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    // Při přechodu na desktop menu zavři a zpřístupni běžnou navigaci.
    mobileMenu.addEventListener('change', syncMenu);
  }

  /* ---------- 3. Reveal — IntersectionObserver ---------- */
  const revealEls = Array.from(doc.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -5% 0px' }
    );
    revealEls.forEach((el) => io.observe(el));

    // Safety: vše viditelné po 2.5s (i bez IntersectionObserver)
    window.setTimeout(() => {
      doc.querySelectorAll('.reveal:not(.visible)').forEach((el) => el.classList.add('visible'));
    }, 2500);
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  /* ---------- 4. Jiskry ohně (hero canvas) ---------- */
  const canvas = doc.getElementById('sparksCanvas');
  if (canvas && !reduced.matches) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      let width = 0, height = 0, particles = [];
      let raf = null;
      const isMobile = window.innerWidth < 768;
      const MAX_PARTICLES = isMobile ? 70 : 130;

      function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        width = canvas.width = Math.max(1, rect.width);
        height = canvas.height = Math.max(1, rect.height);
      }

      function spawn() {
        const big = Math.random() < 0.18;
        return {
          x: Math.random() * width,
          y: height + Math.random() * 60,
          size: big ? Math.random() * 4 + 3 : Math.random() * 2.2 + 0.8,
          speed: Math.random() * 1.4 + 0.5,
          drift: (Math.random() - 0.5) * 0.8,
          life: 1,
          decay: big ? Math.random() * 0.0008 + 0.0004 : Math.random() * 0.002 + 0.001,
          hue: Math.random() > 0.35 ? 0 : 45,
          flicker: Math.random() * 0.15,
        };
      }

      function tick() {
        if (!document.hidden) {
          ctx.clearRect(0, 0, width, height);
          if (particles.length < MAX_PARTICLES && Math.random() < 0.6) particles.push(spawn());
          particles = particles.filter((p) => p.life > 0);
          for (const p of particles) {
            p.y -= p.speed;
            p.x += p.drift + Math.sin(p.y * 0.02 + p.flicker) * 0.6;
            p.life -= p.decay;
            const color = p.hue === 0 ? '228, 6, 7' : '178, 175, 63';
            const fade = Math.min(p.life * 1.8, 1);
            ctx.shadowBlur = p.size * 6;
            ctx.shadowColor = `rgba(${color}, ${fade})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${color}, ${fade})`;
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 240, 210, ${fade * 0.9})`;
            ctx.fill();
          }
        }
        raf = requestAnimationFrame(tick);
      }

      resize();
      window.addEventListener('resize', resize);
      raf = requestAnimationFrame(tick);
      doc.addEventListener('visibilitychange', () => {
        if (document.hidden && raf !== null) {
          cancelAnimationFrame(raf);
          raf = null;
        } else if (!document.hidden && raf === null) {
          raf = requestAnimationFrame(tick);
        }
      });
    }
  }

  /* ---------- 5. Jemný parallax hero fotky ---------- */
  const heroBg = doc.querySelector('[data-hero-parallax]');
  if (heroBg && finePointer && !reduced.matches) {
    let ticking = false;
    window.addEventListener(
      'scroll',
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const y = window.scrollY;
          if (y < window.innerHeight * 1.5) {
            heroBg.style.transform = `translate3d(0, ${y * 0.14}px, 0)`;
          }
          ticking = false;
        });
      },
      { passive: true }
    );
  }

  /* ---------- 6. Lightbox galerie ---------- */
  const box = doc.getElementById('lightbox');
  const lbImg = doc.getElementById('lightboxImg');
  const lbCaption = doc.getElementById('lightboxCaption');
  const lbCounter = doc.getElementById('lightboxCounter');
  const lbClose = doc.getElementById('lightboxClose');
  const lbPrev = doc.getElementById('lightboxPrev');
  const lbNext = doc.getElementById('lightboxNext');

  if (box && lbImg) {
    const items = Array.from(doc.querySelectorAll('[data-lightbox]'));
    let current = 0;
    let lastFocused = null;

    const show = (i) => {
      current = (i + items.length) % items.length;
      const item = items[current];
      const img = item.querySelector('img');
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt || '';
      if (lbCaption) lbCaption.textContent = item.dataset.caption || '';
      if (lbCounter) lbCounter.textContent = `${current + 1} / ${items.length}`;
    };

    const open = (i) => {
      lastFocused = doc.activeElement;
      show(i);
      box.classList.add('open');
      box.setAttribute('aria-hidden', 'false');
      doc.body.classList.add('scroll-locked');
      if (lbClose) lbClose.focus();
    };

    const close = () => {
      box.classList.remove('open');
      box.setAttribute('aria-hidden', 'true');
      if (!doc.getElementById('scenaMenu')?.classList.contains('is-open')) {
        doc.body.classList.remove('scroll-locked');
      }
      if (lastFocused instanceof HTMLElement) lastFocused.focus();
    };

    items.forEach((item, i) => {
      item.addEventListener('click', () => open(i));
    });

    if (lbClose) lbClose.addEventListener('click', close);
    if (lbPrev) lbPrev.addEventListener('click', () => show(current - 1));
    if (lbNext) lbNext.addEventListener('click', () => show(current + 1));

    // Kliknutí na pozadí zavře
    box.addEventListener('click', (e) => {
      if (e.target === box) close();
    });

    // Klávesnice: Esc / šipky / Tab trap
    doc.addEventListener('keydown', (e) => {
      if (!box.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(current - 1);
      else if (e.key === 'ArrowRight') show(current + 1);
      else if (e.key === 'Tab') {
        const focusables = [lbClose, lbPrev, lbNext].filter(Boolean);
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && doc.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && doc.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  /* ---------- 7. Zvýraznění aktivní položky menu (progress-aware) ---------- */
  // (aria-current se nastavuje v Astro komponentě při buildu — zde nic)
})();
