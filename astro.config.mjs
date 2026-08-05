import { defineConfig } from 'astro/config';

// Dvě deployment cíle z jednoho repa:
// - Cloudflare Pages (vlastní doména, kořen): CF_PAGES=1 nastavuje Cloudflare sám
// - GitHub Pages (záloha, /heretik-web-scena/): bez env proměnné
const base = process.env.CF_PAGES ? '/' : '/heretik-web-scena';

export default defineConfig({
  site: 'https://shsheretik.cz',
  base,
  trailingSlash: 'never',
});
