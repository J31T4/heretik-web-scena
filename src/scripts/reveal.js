// ============================================================
// SHŠ Heretik — Scéna · reveal.js
// Jeden scroll-reveal systém pro:
//   - .reveal / .reveal--zoom (fade + translateY / scale)
//   - [data-reveal] (fade + translateY), [data-reveal="curtain"] (clip-path)
// One-shot (unobserve), stagger přes --reveal-i v [data-reveal-group]
// (cap 6), delays přes --reveal-delay (třídy .reveal--delay-*).
// Po dohrání animace uvolní reveal hooky a will-change.
// Idempotentní init, re-bind na astro:page-load.
// ============================================================

(() => {
  'use strict';

  const doc = document;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let io = null;
  let ioGuarantee = null;

  // Všechny reveal prvky (třídy i data-reveal atributy).
  const queryReveals = () =>
    Array.from(doc.querySelectorAll('.reveal:not(.is-visible), [data-reveal]:not(.is-visible)'));

  const finish = (el) => {
    // Odstranit hooky: CSS selektory přestanou matchovat → prvek zůstane
    // viditelný, will-change zmizí, hover transformace fungují.
    el.removeAttribute('data-reveal');
    el.classList.remove('reveal', 'reveal--zoom');
    el.style.removeProperty('--reveal-i');
    el.style.removeProperty('--reveal-delay');
  };

  const reveal = (entry, observer) => {
    const el = entry.target;
    el.classList.add('is-visible');
    // unobserve z obou observerů — one-shot, nic se neopakuje
    observer.unobserve(el);
    io?.unobserve(el);
    ioGuarantee?.unobserve(el);
    if (reduced.matches) {
      finish(el);
      return;
    }
    const onEnd = (e) => {
      if (e.target !== el) return;
      el.removeEventListener('transitionend', onEnd);
      finish(el);
    };
    el.addEventListener('transitionend', onEnd);
    setTimeout(() => finish(el), 2000); // pojistka pro přerušené transitiony
  };

  const init = () => {
    const els = queryReveals();
    if (!els.length) return;

    // Bez IO / se sníženým pohybem: vše hned viditelné.
    if (reduced.matches || !('IntersectionObserver' in window)) {
      els.forEach((el) => {
        el.classList.add('is-visible');
        finish(el);
      });
      return;
    }

    // Stagger: --reveal-i podle pozice v rámci [data-reveal-group], cap 6.
    doc.querySelectorAll('[data-reveal-group]').forEach((group) => {
      group.querySelectorAll('.reveal, [data-reveal]').forEach((el, i) => {
        el.style.setProperty('--reveal-i', `${Math.min(i, 6) * 80}ms`);
      });
    });

    if (!io) {
      // Hlavní observer: reveal o kousek před vstupem do viewportu.
      io = new IntersectionObserver(
        (entries) => entries.forEach((entry) => entry.isIntersecting && reveal(entry, io)),
        { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
      );
      // Záruka: prvek na úplném konci stránky by se s -10% marginem
      // nemusel nikdy protnout — bez marginu se vždy dočká.
      ioGuarantee = new IntersectionObserver(
        (entries) => entries.forEach((entry) => entry.isIntersecting && reveal(entry, ioGuarantee)),
        { rootMargin: '0px', threshold: 0 }
      );
    }
    els.forEach((el) => {
      io.observe(el);
      ioGuarantee.observe(el);
    });
  };

  init();
  doc.addEventListener('astro:page-load', init);
})();
