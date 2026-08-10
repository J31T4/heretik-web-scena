// Helper pro base-prefixované cesty.
// Astro nastaví BASE_URL podle astro.config.mjs:
//   produkce (kořen):  '/'
//   GitHub Pages:      '/heretik-web-scena/'
export const BASE = import.meta.env.BASE_URL || '/';

/** Asset path s base prefixem: '/logo.svg' → '/heretik-web-scena/logo.svg' */
export function asset(path) {
  const clean = path.startsWith('/') ? path : '/' + path;
  return BASE.replace(/\/$/, '') + clean;
}

/** Page path s base prefixem a koncovým lomítkem: '/o-nas' → '/heretik-web-scena/o-nas/' */
export function page(path) {
  if (path === '/' || path === '') return BASE;
  const clean = path.startsWith('/') ? path : '/' + path;
  return BASE.replace(/\/$/, '') + clean.replace(/\/+$/, '') + '/';
}
