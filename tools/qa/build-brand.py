"""Re-derive every brand asset from the committed masters in brand/.

Two destinations, on purpose:

* ``public/assets/``  — the emblem. It is also referenced by ``index.html``
  (favicon + og:image), so it needs a stable, unhashed URL that Vite can
  rewrite with the deployment base. Components reach it through
  ``getAssetUrl()``.
* ``src/assets/images/`` — the hero backdrop. It is referenced only by
  ``Hero.tsx``, so it is bundled by Vite as an ES module import: hashed,
  optimised, and emitted under the deployment base automatically.

Run from the project root:  python tools/qa/build-brand.py
"""
import os
from PIL import Image

BRAND = 'brand'
PUB = os.path.join('public', 'assets')
SRC_IMAGES = os.path.join('src', 'assets', 'images')

EMBLEM_MASTER = os.path.join(BRAND, 'emblem.jpg')
BACKDROP_MASTER = os.path.join(BRAND, 'hero-backdrop.jpg')

# The design's original hero backdrop URL was gated behind a Google sign-in,
# so the supplied constellation image is the source of truth for this build.
BACKDROP_WIDTHS = (640, 1024, 1376)

os.makedirs(PUB, exist_ok=True)
os.makedirs(SRC_IMAGES, exist_ok=True)

for master in (EMBLEM_MASTER, BACKDROP_MASTER):
    if not os.path.isfile(master):
        raise SystemExit(
            f'missing master artwork: {master}\n'
            'Place the original artwork in brand/ before re-deriving.'
        )

# ---------------------------------------------------------------- emblem
src = Image.open(EMBLEM_MASTER).convert('RGB')
print(f'new emblem: {src.size}')

for size in (512, 128):
    img = src if size == src.size[0] else src.resize((size, size), Image.LANCZOS)
    img.save(
        os.path.join(PUB, f'emblem-{size}.jpg'),
        'JPEG', quality=88 if size == 512 else 85, optimize=True, progressive=True,
    )
    if size == 512:
        img.save(os.path.join(PUB, 'emblem-512.webp'), 'WEBP', quality=88, method=6)

# ----------------------------------------------------------- hero backdrop
backdrop = Image.open(BACKDROP_MASTER).convert('RGB')
print(f'hero backdrop master: {backdrop.size}')

native_w = backdrop.width
for width in BACKDROP_WIDTHS:
    if width > native_w:
        raise SystemExit(
            f'refusing to upscale: {width}px > native {native_w}px'
        )
    img = backdrop if width == native_w else backdrop.resize(
        (width, round(backdrop.height * width / native_w)), Image.LANCZOS
    )
    base = f'hero-backdrop-{width}'
    img.save(
        os.path.join(SRC_IMAGES, f'{base}.jpg'),
        'JPEG', quality=82, optimize=True, progressive=True,
    )
    img.save(
        os.path.join(SRC_IMAGES, f'{base}.webp'),
        'WEBP', quality=78, method=6,
    )

# ------------------------------------------------------------------ report
for folder in (PUB, SRC_IMAGES):
    print(f'\n{folder}/')
    for f in sorted(os.listdir(folder)):
        path = os.path.join(folder, f)
        with Image.open(path) as im:
            print(
                f'  {f:26s} {im.size[0]}x{im.size[1]}'
                f'  {os.path.getsize(path) / 1024:7.1f} KB'
            )
