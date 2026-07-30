// Helper pro GitHub Pages subpath
// Astro nastaví BASE_URL = '/heretik-web/' při buildu
export const BASE = import.meta.env.BASE_URL || '/';

/** Asset path s base prefixem: '/logo.svg' → '/heretik-web/logo.svg' */
export function asset(path) {
  const clean = path.startsWith('/') ? path : '/' + path;
  return BASE.replace(/\/$/, '') + clean;
}

/** Page path s base prefixem: '/o-nas' → '/heretik-web/o-nas' */
export function page(path) {
  if (path === '/' || path === '') return BASE;
  const clean = path.startsWith('/') ? path : '/' + path;
  return BASE.replace(/\/$/, '') + clean;
}
