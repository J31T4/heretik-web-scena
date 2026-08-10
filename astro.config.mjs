import { defineConfig } from 'astro/config';

// ============================================================
// Deployment prostředí (jeden repozitář, dva cíle):
//
// 1. PRODUKCE (výchozí) — vlastní doména, kořen webu:
//      site = https://shsheretik.cz
//      base = /
//    Používá se při běžném `npm run build` i při nasazení
//    na produkční hosting (např. FTP/VPS/Cloudflare Pages).
//
// 2. GITHUB PAGES (vedlejší testovací nasazení):
//      PUBLIC_SITE_URL=https://j31t4.github.io \
//      PUBLIC_BASE_PATH=/heretik-web-scena \
//      npm run build
//    Web je pak dostupný na https://j31t4.github.io/heretik-web-scena/
//    a canonical/OG URL obsahují /heretik-web-scena/.
//
// 3. CLOUDFLARE PAGES: CF_PAGES=1 nastavuje Cloudflare sám;
//    web běží na kořenu domény (base = /). Site URL lze přepsat
//    přes PUBLIC_SITE_URL (jinak produkční shsheretik.cz).
// ============================================================
const site = process.env.PUBLIC_SITE_URL || 'https://shsheretik.cz';
const base = process.env.PUBLIC_BASE_PATH || (process.env.CF_PAGES ? '/' : '/');

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
});
