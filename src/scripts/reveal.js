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
    const el = entry.target;
    el.classList.add('is-visible');
    // unobserve z obou observerů — one-shot, nic se neopakuje
    observer.unobserve(el);
    io?.unobserve(el);
    ioGuarantee?.unobserve(el);
    // Po dohrání revealu uvolnit transform/transition, aby hover
    // stavy (lift, scale) mohly na prvku fungovat bez konfliktu.
    const finish = () => {
      el.removeAttribute('data-reveal');
      el.style.removeProperty('--reveal-i');
    };
    if (reduced.matches) {
      finish();
      return;
    }
    const onEnd = (e) => {
      if (e.target !== el) return;
      el.removeEventListener('transitionend', onEnd);
      finish();
    };
    el.addEventListener('transitionend', onEnd);
    setTimeout(finish, 2000); // pojistka pro přerušené transitiony
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
