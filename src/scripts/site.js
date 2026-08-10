/* ============================================================
   SHŠ Heretik — Scéna · site.js
   Veškerá interakce: header, mobilní menu, reveal, lightbox.
   Vše s null-guards — stránka funguje i bez JS (progressive enhancement).
   ============================================================ */

(() => {
  'use strict';

  const doc = document;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const afterPaint = (callback) => requestAnimationFrame(() => requestAnimationFrame(callback));

  /* ---------- 1. Header — stav po scrollu ---------- */
  const header = doc.querySelector('.scena-header');
  if (header) {
    // Sentinel (1px) + IntersectionObserver — žádný scroll listener.
    const sentinel = doc.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText = 'position:absolute;top:24px;left:0;width:1px;height:1px;pointer-events:none;';
    doc.body.prepend(sentinel);

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        ([entry]) => header.classList.toggle('is-scrolled', !entry.isIntersecting),
        { rootMargin: '-1px 0px 0px 0px' }
      );
      io.observe(sentinel);
    } else {
      // Fallback bez IO — jen tam, kde není k dispozici.
      const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }
  }

  /* ---------- 2. Mobilní menu ---------- */
  const burger = doc.getElementById('menuToggle');
  const menu = doc.getElementById('scenaMenu');

  if (burger && menu) {
    const mobileMenu = window.matchMedia('(max-width: 1160px)');

    // Prvky mimo menu, které se při otevřeném menu stanou inertní
    // (hlavní obsah, patička, logo v hlavičce). Burger ani nav zůstávají aktivní.
    const inertTargets = () => {
      const header = doc.querySelector('.scena-header');
      const main = doc.getElementById('obsah');
      const footer = doc.querySelector('.scena-footer');
      const brand = header?.querySelector('.header__brand');
      return [main, footer, brand].filter(Boolean);
    };

    const setInert = (inert) => {
      inertTargets().forEach((el) => {
        if (inert) el.setAttribute('inert', '');
        else el.removeAttribute('inert');
      });
    };

    const setMenu = (open) => {
      burger.classList.toggle('active', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Zavřít menu' : 'Otevřít menu');
      menu.classList.toggle('is-open', open);
      if (open) {
        doc.body.classList.add('scroll-locked');
        setInert(true);
        afterPaint(() => burger.focus());
      } else {
        setInert(false);
        if (!doc.getElementById('lightbox')?.open) {
          doc.body.classList.remove('scroll-locked');
        }
        // Po zavření vrať focus na burger (pokud focus byl uvnitř menu)
        if (mobileMenu.matches && menu.contains(doc.activeElement)) burger.focus();
      }
      if (mobileMenu.matches) menu.setAttribute('aria-hidden', String(!open));
      else menu.removeAttribute('aria-hidden');
    };

    const syncMenu = () => {
      if (!mobileMenu.matches) {
        if (menu.classList.contains('is-open')) setMenu(false);
        else setInert(false); // po přechodu na desktop vše vyčistit
        menu.removeAttribute('aria-hidden');
      } else {
        menu.setAttribute('aria-hidden', String(!menu.classList.contains('is-open')));
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

    // Focus trap uvnitř menu — jen když je mobilní menu otevřené
    menu.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab' || !mobileMenu.matches || !menu.classList.contains('is-open')) return;
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

  /* ---------- 4. Jemný parallax hero fotky ---------- */
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

  /* ---------- 5. Lightbox galerie ---------- */
  const box = doc.getElementById('lightbox');
  const lbImg = doc.getElementById('lightboxImg');
  const lbCaption = doc.getElementById('lightboxCaption');
  const lbNum = doc.getElementById('lightboxNum');
  const lbCounter = doc.getElementById('lightboxCounter');
  const lbClose = doc.getElementById('lightboxClose');
  const lbPrev = doc.getElementById('lightboxPrev');
  const lbNext = doc.getElementById('lightboxNext');

  if (box && lbImg) {
    const items = Array.from(doc.querySelectorAll('[data-lightbox]'));
    let current = 0;

    const show = (i) => {
      current = (i + items.length) % items.length;
      const item = items[current];
      // Lightbox vždy používá plnou variantu (data-full-src), ne responzivní náhled.
      lbImg.src = item.dataset.fullSrc || item.querySelector('img')?.currentSrc || item.querySelector('img')?.src;
      lbImg.alt = item.querySelector('img')?.alt || '';
      // Popisek ve stylu destičky: „01 Tábořiště“
      const [head, ...rest] = String(item.dataset.caption || '').split(' — ');
      if (lbNum) lbNum.textContent = String(current + 1).padStart(2, '0');
      if (lbCaption) lbCaption.textContent = rest.length ? rest.join(' — ') : head;
      if (lbCounter) lbCounter.textContent = `${current + 1} / ${items.length}`;
      // Preload sousedních fotografií — plné URL z data-full-src
      for (const offset of [-1, 1]) {
        const adjacent = items[(current + offset + items.length) % items.length];
        const adjacentSrc = adjacent?.dataset.fullSrc;
        if (adjacentSrc) {
          const preload = new Image();
          preload.src = adjacentSrc;
        }
      }
    };

    const open = (i) => {
      show(i);
      doc.body.classList.add('scroll-locked');
      if (typeof box.showModal === 'function') box.showModal();
      else box.setAttribute('open', '');
      if (lbClose) afterPaint(() => lbClose.focus());
    };

    const close = () => {
      if (box.open) box.close();
      doc.body.classList.remove('scroll-locked');
    };

    items.forEach((item, i) => {
      item.addEventListener('click', () => open(i));
    });

    if (lbClose) lbClose.addEventListener('click', close);
    if (lbPrev) lbPrev.addEventListener('click', () => show(current - 1));
    if (lbNext) lbNext.addEventListener('click', () => show(current + 1));

    // Kliknutí na prázdné místo (samotný dialog, ne obsah) zavře
    box.addEventListener('click', (e) => {
      if (e.target === box) close();
    });

    // Klávesnice: šipky (Esc a focus trap řeší nativní <dialog>)
    doc.addEventListener('keydown', (e) => {
      if (!box.open) return;
      if (e.key === 'ArrowLeft') show(current - 1);
      else if (e.key === 'ArrowRight') show(current + 1);
    });

    // Nativní dialog vrací focus tam, odkud se otevřel — jen pojistka:
    box.addEventListener('close', () => {
      if (!doc.getElementById('scenaMenu')?.classList.contains('is-open')) {
        doc.body.classList.remove('scroll-locked');
      }
    });
  }

  /* ---------- 6. Zvýraznění aktivní položky menu (progress-aware) ---------- */
  // (aria-current se nastavuje v Astro komponentě při buildu — zde nic)
})();
