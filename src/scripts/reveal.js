// ============================================================
// SHŠ Heretik — Scéna · reveal.js
// Scroll reveal: [data-reveal] = opacity + translateY(16px),
// one-shot (unobserve), stagger přes --i v [data-reveal-group]
// (cap 6), varianta [data-reveal="curtain"] = clip-path.
// Idempotentní init, re-bind na astro:page-load.
// ============================================================

(() => {
  'use strict';

  const doc = document;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let io = null;
  let ioGuarantee = null;

  const reveal = (entry, observer) => {
    entry.target.classList.add('is-visible');
    // unobserve z obou observerů — one-shot, nic se neopakuje
    observer.unobserve(entry.target);
    io?.unobserve(entry.target);
    ioGuarantee?.unobserve(entry.target);
  };

  const init = () => {
    const els = Array.from(doc.querySelectorAll('[data-reveal]:not(.is-visible)'));
    if (!els.length) return;

    // Bez IO / se sníženým pohybem: vše hned viditelné.
    if (reduced.matches || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    // Stagger: --i podle pozice v rámci [data-reveal-group], cap 6.
    doc.querySelectorAll('[data-reveal-group]').forEach((group) => {
      group.querySelectorAll('[data-reveal]').forEach((el, i) => {
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
