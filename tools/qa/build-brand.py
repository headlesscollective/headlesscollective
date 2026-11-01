"""Swap in the supplied brand mark and keep master artwork under version control.

Generates the derivative sizes the site actually uses, at the same filenames and
pixel dimensions as before, so no markup or styling has to change.
"""
import os
import shutil
from PIL import Image

NEW_LOGO = (
    r'C:\Users\yasr4\.minimax\v2\assets\2026\11\01\09-24-22-358-asset_20261101-092422-358_'
    r'2d206d6c8027_76d8cea7-Gemini_Generated_Image_bkolc7bkolc7bkol.jpg'
)
HERO_MASTER = (
    r'C:\Users\yasr4\.minimax\v2\assets\2026\11\01\07-20-48-534-asset_20261101-072048-534_'
    r'8d697459bfb6_651027b7-screen.png'
)

BRAND = 'brand'
PUB = os.path.join('public', 'assets')
os.makedirs(BRAND, exist_ok=True)
os.makedirs(PUB, exist_ok=True)

# --- keep the masters in the repo so derivatives can always be re-derived ---
shutil.copyfile(NEW_LOGO, os.path.join(BRAND, 'emblem.jpg'))
shutil.copyfile(HERO_MASTER, os.path.join(BRAND, 'hero-backdrop.jpg'))
print('brand masters:', sorted(os.listdir(BRAND)))

# --- emblem derivatives (same names + dimensions as before) ---
src = Image.open(NEW_LOGO).convert('RGB')
print('new emblem:', src.size)

for size in (512, 128):
    img = src if size == src.size else src.resize((size, size), Image.LANCZOS)
    jpg = os.path.join(PUB, f'emblem-{size}.jpg')
    img.save(jpg, 'JPEG', quality=88 if size == 512 else 85, optimize=True, progressive=True)
    if size == 512:
        img.save(os.path.join(PUB, 'emblem-512.webp'), 'WEBP', quality=88, method=6)

for f in sorted(os.listdir(PUB)):
    if f.startswith('emblem'):
        im = Image.open(os.path.join(PUB, f))
        print(f'{f:22s} {im.size[0]}x{im.size[1]}  {os.path.getsize(os.path.join(PUB, f))/1024:7.1f} KB')
