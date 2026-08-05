# SHŠ Heretik Web

Moderní web pro skupinu historického šermu SHŠ Heretik.

## Technologie

- **Astro** - static site generator
- **Pure CSS** - bez frameworků
- **Cloudflare Pages** - hosting (plánováno)

## Vývoj

### Instalace
```bash
npm install
```

### Lokální vývoj
```bash
npm run dev
```
Web poběží na `http://localhost:4321`

### Build pro produkci
```bash
npm run build
```
Výstup v `dist/` složce.

### Preview buildu
```bash
npm run preview
```

## Struktura projektu

```
heretik-web/
├── src/
│   ├── components/      # Header, Footer, Hero, atd.
│   ├── layouts/         # BaseLayout
│   ├── pages/           # Domů, O nás, Akce, Galerie, Kontakt
│   └── styles/          # global.css
├── public/
│   ├── images/opt/      # Optimalizované webové assety (webp + jpg, generované skriptem)
│   └── logo.svg         # Logo skupiny
├── assets-src/
│   └── originals/       # Původní fotografie (zůstávají v Gitu, nekopírují se do dist/)
└── dist/                # Build výstup (po npm run build)
```

## Editace obsahu

Texty jsou přímo v `.astro` souborech v `src/pages/` a `src/components/`.
Fotky se přidávají jako originály do `assets-src/originals/`, pak se spustí
`python3 scripts/optimize-images.py`, který vygeneruje optimalizované varianty
(webp + jpg) do `public/images/opt/` – ty se teprve kopírují do buildu.

## Deployment

### Cloudflare Pages (hlavní hosting — doporučeno)

Web buildí pro **dva cíle z jednoho repa** (v `astro.config.mjs`):

| Prostředí | Cesta | Jak se pozná |
|---|---|---|
| Cloudflare Pages (vlastní doména) | kořen `/` | env proměnná `CF_PAGES=1` (nastaví Cloudflare sám) |
| GitHub Pages (záloha) | `/heretik-web-scena/` | bez env proměnné |

**Postup (Git integrace, auto-deploy):**
1. Založ účet na dash.cloudflare.com (zdarma)
2. Workers & Pages → **Create** → **Pages** → **Connect to Git** → vyber `heretik-web-scena`
3. Build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Production branch: `main`
4. Deploy → dostaneš adresu `<projekt>.pages.dev`

**Ruční upload (bez Git integrace):**
```bash
npx wrangler login        # jednou, OAuth v prohlížeči
./scripts/deploy-cloudflare.sh
```

**Vlastní doména `.cz`:**
1. Registrace `.cz` u českého registrátora (Wedos / Forpsi / active24), cca 120–140 Kč/rok
2. V Cloudflare Pages: projekt → **Custom domains** → přidej `shsheretik.cz`
3. U registrátora nasměruj DNS: záznam `CNAME @ → <projekt>.pages.dev`
   (nebo přepni nameservery na Cloudflare, návod ti CF sám ukáže)
4. SSL/TLS si Cloudflare zařídí sám, `shsheretik.cz` běží na kořeni bez subcesty

### GitHub Pages (záloha, aktuálně na j31t4.github.io/heretik-web-scena)

```bash
npm run build                                  # bez CF_PAGES → subpath build
cd /tmp && rm -rf gp && git clone --quiet --branch gh-pages https://github.com/J31T4/heretik-web-scena.git gp
cd gp && rm -rf * && cp -r /PATH/TO/REPO/dist/. . && git add -A
git -c user.name="..." -c user.email="..." commit -m "deploy" && git push origin gh-pages
```

## Status

✅ 5 stránek (Domů, O nás, Akce, Galerie, Kontakt) — „PŘEDSTAVENÍ ZAČÍNÁ"
✅ Responzivní design, tmavý divadelní motiv, vlastní fonty
✅ Lightbox, mobilní menu, reduced-motion, WCAG AA
✅ Cloudflare Pages připraveno (CF_PAGES build na kořen domény)
⏳ Nákup domény .cz + propojení s Cloudflare Pages
