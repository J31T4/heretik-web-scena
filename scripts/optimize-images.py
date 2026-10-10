#!/usr/bin/env python3
"""Optimalizace fotek SHŠ Heretik do public/images/opt/ (webp + jpeg).

Zdrojové originály: assets-src/originals/ (zůstávají v Gitu, nekopírují se do buildu).
Optimalizované webové assety: public/images/opt/ (kopírují se do dist/).

Pro každý obrázek generuje responzivní varianty (480, 800, 1200 a plná šířka),
vždy jako WebP i JPEG — Picture.astro z nich sestaví srcset.
Reprodukovatelné: stejný vstup → stejný výstup (pevné kvality, LANCZOS).
"""
from PIL import Image, ImageOps
import os

LANCZOS = getattr(Image, 'Resampling', Image).LANCZOS

SRC = 'assets-src/originals'
DST = 'public/images/opt'
os.makedirs(DST, exist_ok=True)

# (src, max_dim, jpeg_quality) — max_dim = nejdelší strana plné varianty
PLAN = {
    'hero-1.jpeg':   (1600, 80),
    'hero-2.jpeg':   (1600, 80),
    'gallery-1.jpeg': (1400, 78),
    'gallery-2.jpeg': (1400, 78),
    'gallery-3.jpeg': (1400, 78),
    'gallery-4.jpeg': (1400, 78),
    'gallery-5.jpeg': (1400, 78),
    'gallery-6.jpeg': (1400, 78),
    'gallery-7.jpeg': (1400, 78),
    'gallery-8.jpeg': (1400, 78),
    # Nové fotky 2026 (září) — hradní akce, večerní vystoupení, jevištní souboje
    'gallery-9.jpeg': (1400, 78),
    'gallery-10.jpeg': (1400, 78),
    'gallery-11.jpeg': (1400, 78),
    'gallery-12.jpeg': (1400, 78),
    'gallery-13.jpeg': (1400, 78),
    'gallery-14.jpeg': (1400, 78),
    'gallery-15.jpeg': (1400, 78),
    'gallery-16.jpeg': (1400, 78),
    'gallery-17.jpeg': (1400, 78),
    'gallery-18.jpeg': (1400, 78),
    'gallery-19.jpeg': (1400, 78),
    'gallery-20.jpeg': (1400, 78),
    'gallery-21.jpeg': (1400, 78),
    'gallery-22.jpeg': (1400, 78),
    'gallery-23.jpeg': (1400, 78),
    'gallery-24.jpeg': (1400, 78),
    'gallery-25.jpeg': (1400, 78),
    'gallery-26.jpeg': (1400, 78),
    'gallery-27.jpeg': (1400, 78),
    'gallery-28.jpeg': (1400, 78),
    'gallery-29.jpeg': (1400, 78),
}

# Responzivní šířky variant (longest edge), kromě plné varianty.
VARIANTS = [480, 800, 1200]

# Mobilní varianty (longest edge) pro hero obrázky — používá je mobileSrc
# v ScenaHero / ScenaCTA (menší soubor pro telefony).
MOBILE_VARIANTS = {
    'hero-1.jpeg': [900],
    'hero-2.jpeg': [900],
}


def save_variant(im, path, q):
    """Uloží obrázek jako WebP i JPEG se stejnou kvalitou."""
    im.save(path + '.webp', 'WEBP', quality=q, method=6)
    im.save(path + '.jpg', 'JPEG', quality=q, progressive=True, optimize=True)


total_before = total_after = 0
for src, (max_dim, q) in PLAN.items():
    # exif_transpose: vyřeší EXIF orientaci (např. fotky z telefonu otočené o 90°);
    # u fotek s orientací 1 je to no-op, takže staré výstupy zůstávají identické.
    im = ImageOps.exif_transpose(Image.open(os.path.join(SRC, src))).convert('RGB')
    w, h = im.size
    base = os.path.splitext(src)[0]
    total_before += os.path.getsize(os.path.join(SRC, src))

    # Plná varianta (max_dim na nejdelší straně)
    if max(w, h) > max_dim:
        r = max_dim / max(w, h)
        full = im.resize((round(w * r), round(h * r)), LANCZOS)
    else:
        full = im
    save_variant(full, os.path.join(DST, base), q)
    total_after += os.path.getsize(os.path.join(DST, base + '.webp')) + os.path.getsize(os.path.join(DST, base + '.jpg'))

    # Menší responzivní varianty (jen pokud je originál větší)
    for v in VARIANTS:
        if max(w, h) <= v:
            continue
        # KRITICKÉ: poměr se počítá vůči PLNÉ variantě (full už byl zmenšen
        # z originálu) — vůči max(w,h) originálu by varianty byly o ~27% menší,
        # než tvrdí jejich název, a srcset by dostával upscalované obrázky.
        r = v / max(full.width, full.height)
        variant = full.resize((round(full.width * r), round(full.height * r)), LANCZOS)
        # Náhledy mají vyšší kvalitu než plná — bývají upscalované na 2× displejích.
        save_variant(variant, os.path.join(DST, f'{base}-{v}'), min(q + 4, 86))
        total_after += os.path.getsize(os.path.join(DST, f'{base}-{v}.webp')) + os.path.getsize(os.path.join(DST, f'{base}-{v}.jpg'))

    # Mobilní varianty (hero obrázky — mobileSrc v ScenaHero / ScenaCTA)
    for v in MOBILE_VARIANTS.get(src, []):
        if max(full.width, full.height) <= v:
            continue
        r = v / max(full.width, full.height)
        variant = full.resize((round(full.width * r), round(full.height * r)), LANCZOS)
        save_variant(variant, os.path.join(DST, f'{base}-{v}'), min(q + 4, 86))
        total_after += os.path.getsize(os.path.join(DST, f'{base}-{v}.webp')) + os.path.getsize(os.path.join(DST, f'{base}-{v}.jpg'))

    print(f'{src} → {full.size} (+ {VARIANTS})')

print(f'\nPŮVODNÍ celkem: {total_before//1024//1024} MB | OPT celkem: {total_after//1024//1024} MB')
