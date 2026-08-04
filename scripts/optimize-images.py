#!/usr/bin/env python3
"""Optimalizace fotek SHŠ Heretik do public/images/opt/ (webp + jpeg)."""
from PIL import Image
import os

LANCZOS = getattr(Image, 'Resampling', Image).LANCZOS

SRC = 'public/images'
DST = 'public/images/opt'
os.makedirs(DST, exist_ok=True)

# (src, max_dim, jpeg_quality) — max_dim = nejdelší strana
PLAN = {
    'hero-1.jpeg':  (1600, 80),
    'hero-2.jpeg':  (1600, 80),
    'gallery-1.jpeg': (1400, 78),
    'gallery-2.jpeg': (1400, 78),
    'gallery-3.jpeg': (1400, 78),
    'gallery-4.jpeg': (1400, 78),
    'gallery-5.jpeg': (1400, 78),
    'gallery-6.jpeg': (1400, 78),
    'gallery-7.jpeg': (1400, 78),
    'gallery-8.jpeg': (1400, 78),
}

total_before = total_after = 0
for src, (max_dim, q) in PLAN.items():
    im = Image.open(os.path.join(SRC, src)).convert('RGB')
    w, h = im.size
    if max(w, h) > max_dim:
        r = max_dim / max(w, h)
        im = im.resize((round(w * r), round(h * r)), LANCZOS)
    base = os.path.splitext(src)[0]
    total_before += os.path.getsize(os.path.join(SRC, src))
    # webp
    im.save(os.path.join(DST, base + '.webp'), 'WEBP', quality=q, method=6)
    # jpeg (progressive)
    im.save(os.path.join(DST, base + '.jpg'), 'JPEG', quality=q, progressive=True, optimize=True)
    total_after += os.path.getsize(os.path.join(DST, base + '.webp')) + os.path.getsize(os.path.join(DST, base + '.jpg'))
    print(f'{src} {im.size} webp={os.path.getsize(os.path.join(DST, base + ".webp"))//1024}KB jpg={os.path.getsize(os.path.join(DST, base + ".jpg"))//1024}KB')

# mobilní varianta hero-1 (900px) — menší datový tok na mobilech
im = Image.open(os.path.join(SRC, 'hero-1.jpeg')).convert('RGB')
r = 900 / max(im.size)
im = im.resize((round(im.width * r), round(im.height * r)), LANCZOS)
im.save(os.path.join(DST, 'hero-1-900.webp'), 'WEBP', quality=76, method=6)
im.save(os.path.join(DST, 'hero-1-900.jpg'), 'JPEG', quality=76, progressive=True, optimize=True)
print(f'hero-1-900 {im.size} webp={os.path.getsize(os.path.join(DST, "hero-1-900.webp"))//1024}KB jpg={os.path.getsize(os.path.join(DST, "hero-1-900.jpg"))//1024}KB')

print(f'\nPŮVODNÍ celkem: {total_before//1024//1024} MB | OPT celkem: {total_after//1024//1024} MB')
