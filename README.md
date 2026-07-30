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
│   ├── images/          # Fotky z vystoupení
│   └── logo.svg         # Logo skupiny
└── dist/                # Build výstup (po npm run build)
```

## Editace obsahu

Texty jsou přímo v `.astro` souborech v `src/pages/` a `src/components/`.
Fotky se přidávají do `public/images/` a reference v komponentech.

## Deployment

Web je připraven pro nasazení na Cloudflare Pages:
1. Pushnout na GitHub
2. Připojit repo k Cloudflare Pages
3. Nastavit custom doménu

## Status

✅ Prototyp homepage hotový
✅ 5 stránek (Domů, O nás, Akce, Galerie, Kontakt)
✅ Responzivní design
✅ Tmavý motiv s červenými akcenty
⏳ Čeká na feedback a iteraci
