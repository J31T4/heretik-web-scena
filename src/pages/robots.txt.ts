import type { APIRoute } from 'astro';

// robots.txt generovaný z konfigurace — Sitemap URL vždy odpovídá
// aktivnímu prostředí (produkce shsheretik.cz / GitHub Pages).
export const GET: APIRoute = ({ site }) => {
  const origin = site?.origin ?? 'https://shsheretik.cz';
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
  const sitemapUrl = `${origin}${basePath}/sitemap.xml`;
  return new Response(`User-agent: *\nAllow: /\nSitemap: ${sitemapUrl}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
