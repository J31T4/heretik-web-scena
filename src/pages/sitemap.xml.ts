import type { APIRoute } from 'astro';

// Sitemap generovaná z konfigurace — URL odpovídají aktivnímu prostředí
// (produkce https://shsheretik.cz/ bez /heretik-web-scena/, GitHub Pages s ním).
const PAGES = ['/', '/o-nas/', '/akce/', '/galerie/', '/kontakt/'];

export const GET: APIRoute = ({ site }) => {
  const origin = site?.origin ?? 'https://shsheretik.cz';
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
  const urls = PAGES.map((p) => `  <url>\n    <loc>${origin}${basePath}${p}</loc>\n  </url>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
