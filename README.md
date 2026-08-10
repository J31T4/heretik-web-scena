# SHŠ Heretik Web

Moderní web pro skupinu historického a scénického šermu SHŠ Heretik (Mohelnice).

## Technologie

- **Astro 7** – static site generator
- **Pure CSS** – bez frameworků (soubor `src/styles/scena.css`)
- **JavaScript** – progresivní vylepšení (menu, lightbox, reveal, Instagram feed)

## Produkční a testovací nasazení

Web buildí pro **dvě prostředí z jednoho repa** (`astro.config.mjs`):

| Prostředí | site | base | Jak se zapne |
|---|---|---|---|
| **Produkce** – `https://shsheretik.cz` | `https://shsheretik.cz` | `/` | výchozí `npm run build` |
| **GitHub Pages** (test) – `https://j31t4.github.io/heretik-web-scena/` | `https://j31t4.github.io` | `/heretik-web-scena` | `PUBLIC_SITE_URL` + `PUBLIC_BASE_PATH` |

Produkční build je **výchozí**. GitHub Pages build se zapne explicitními proměnnými:

```bash
# Produkční build (shsheretik.cz — canonical, og:, sitemap, robots)
npm run build

# Testovací build (GitHub Pages subcesta — canonical/og:/sitemap s /heretik-web-scena/)
PUBLIC_SITE_URL=https://j31t4.github.io PUBLIC_BASE_PATH=/heretik-web-scena npm run build
```

Podporované proměnné prostředí:

- `PUBLIC_SITE_URL` – absolutní base URL webu (default `https://shsheretik.cz`)
- `PUBLIC_BASE_PATH` – subcesta, na které web běží (default `/`)
- `CF_PAGES` – pokud je nastaveno Cloudflare Pages (base zůstává `/`)

Všechna metadata (canonical, `og:url`, `og:image`, sitemap, robots, JSON-LD) se
generují ze stejné konfigurace – `robots.txt` a `sitemap.xml` nejsou ruční soubory,
ale endpointy v `src/pages/`.

> **DNS, vlastní doména a HTTPS certifikát se nastavují u poskytovatele hostingu**
> (např. Wedos / Forpsi / active24) – nelze je změnit jen úpravou repozitáře.
> Po registraci domény a nahrání buildu na hosting je potřeba nastavit DNS záznam
> a HTTPS ručně u registrátora / hostingu.

## Vývoj

### Požadavky

- Node.js **>= 22.12** (viz `.node-version` a `engines` v `package.json`)

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
│   ├── components/      # Header, Footer, Hero, Picture, Instagram feed, atd.
│   ├── data/            # Sdílená data (site.js – navigace, kontakty, sociální sítě)
│   ├── layouts/         # ScenaLayout (hlavní layout)
│   ├── pages/           # Domů, O nás, Akce, Galerie, Kontakt, 404, robots.txt, sitemap.xml
│   ├── scripts/         # site.js, reveal.js (progresivní vylepšení)
│   ├── styles/          # scena.css (tokeny + sdílené styly)
│   └── utils/           # paths.js (base-prefix), typo.js (česká mikrotypografie)
├── public/
│   ├── images/opt/      # Optimalizované webové assety (webp + jpg, generované skriptem)
│   └── logo.svg         # Logo skupiny
├── assets-src/
│   └── originals/       # Původní fotografie (zůstávají v Gitu, nekopírují se do dist/)
├── scripts/
│   └── optimize-images.py  # Generuje responzivní varianty obrázků (480/800/1200/plná)
└── dist/                # Build výstup (po npm run build)
```

## Editace obsahu

Texty jsou přímo v `.astro` souborech v `src/pages/` a `src/components/`.
Společné údaje (kontaktní e-mail, Instagram handle, sociální sítě, navigace)
jsou centrálně v `src/data/site.js` – jeden zdroj pravdy.

Fotky se přidávají jako originály do `assets-src/originals/`, pak se spustí
`python3 scripts/optimize-images.py`, který vygeneruje responzivní varianty
(480 / 800 / 1200 / plná šířka, vždy WebP + JPEG) do `public/images/opt/` –
ty se teprve kopírují do buildu.

## CI

GitHub Actions workflow (`.github/workflows/build.yml`) ověřuje, že se projekt
sestaví: Node 22, `npm ci`, `npm run build`. Automatický deployment **není**
součástí CI.

## Deployment

### Produkce (shsheretik.cz)

1. `npm run build` (výchozí konfigurace → `https://shsheretik.cz`)
2. Nahraj obsah `dist/` na hosting (FTP / VPS / Pages)
3. U poskytovatele nastav DNS, custom domain a HTTPS certifikát

### GitHub Pages (testovací)

```bash
PUBLIC_SITE_URL=https://j31t4.github.io PUBLIC_BASE_PATH=/heretik-web-scena npm run build
```

## Status

✅ 5 stránek (Domů, O nás, Akce, Galerie, Kontakt) — „PŘEDSTAVENÍ ZAČÍNÁ"
✅ Responzivní design, tmavý divadelní motiv, vlastní fonty (swap)
✅ Lightbox, mobilní menu (focus trap + no-JS fallback), reduced-motion, WCAG AA
✅ Responzivní obrázky (srcset/sizes), IG feed s ošetřením chyb
⏳ Nákup domény .cz + DNS a HTTPS u poskytovatele hostingu
