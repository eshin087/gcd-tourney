"""Reproduce immutable atlas crops; run from this Git worktree with Python + Pillow."""
import hashlib
import io
import json
from pathlib import Path
import subprocess
from PIL import Image, ImageDraw

COMMIT = '6159cc2d'
EXPECTED = '88d4576971827d4397aec6327308c2275a3d21e7c3955a7cc6f0401d84263554'
OUT = Path(__file__).resolve().parent
FILES = {
    'sheet.png': 'public/characters/goku/sheet.png',
    'anims.json': 'public/characters/goku/anims.json',
    'specialForward_v02.json': 'art/characters/goku/raw/specialForward_v02.json',
    'manifest.json': 'art/manifest.json',
}
hashes = {}
for name, source in FILES.items():
    data = subprocess.check_output(['git', 'show', COMMIT + ':' + source])
    hashes[name] = hashlib.sha256(data).hexdigest()
    if name == 'sheet.png':
        assert hashes[name] == EXPECTED
    (OUT / name).write_bytes(data)
meta = json.loads((OUT / 'anims.json').read_text(encoding='utf-8'))
manifest = json.loads((OUT / 'manifest.json').read_text(encoding='utf-8'))
assert meta['animations']['specialForward']['frames'] == list(range(110, 117))
assert manifest['characters']['goku']['animations']['specialForward']['bodyHeight'] == 222
sheet = Image.open(OUT / 'sheet.png').convert('RGBA')
contact = Image.new('RGB', (1024, 560), '#363b43')
draw = ImageDraw.Draw(contact)
rows = []
crops = []
for j, cell in enumerate([0, *range(110, 117)]):
    name = 'idle' if j == 0 else 'f' + str(j - 1)
    x, y = cell % 16 * 256, cell // 16 * 256
    crop = sheet.crop((x, y, x + 256, y + 256))
    crop.save(OUT / (name + '.png'))
    crops.append(crop)
    rows.append({'name': name, 'cell': cell, 'alphaBoundsExclusive': crop.getbbox()})
    cx, cy = j % 4 * 256, j // 4 * 280 + 24
    contact.paste(crop, (cx, cy), crop)
    draw.text((cx + 8, cy - 20), name + ' / cell ' + str(cell), fill='white')
contact.save(OUT / 'contact-native.png')
contact.resize((2048, 1120), Image.Resampling.NEAREST).save(OUT / 'contact-2x.png')
paired = Image.new('RGB', (512, 7 * 280), '#363b43')
pd = ImageDraw.Draw(paired)
for j, crop in enumerate(crops[1:]):
    paired.paste(crops[0], (0, j * 280 + 24), crops[0])
    paired.paste(crop, (256, j * 280 + 24), crop)
    pd.text((8, j * 280 + 4), 'idle f0', fill='white')
    pd.text((264, j * 280 + 4), 'specialForward f' + str(j), fill='white')
paired.save(OUT / 'paired-native.png')
# These are manual projected joint centers, NOT inferred bone lengths or automated detections.
landmarks = {
    'idle': {'neck': [139, 88], 'belt': [126, 123], 'shoulder': [104, 88], 'elbow': [91, 114], 'wrist': [113, 112]},
    'f0': {'neck': [124, 105], 'belt': [118, 138]},
    'f1': {'neck': [177, 120], 'belt': [151, 145]},
    'f2': {'neck': [149, 104], 'belt': [137, 139]},
    'f3': {'neck': [166, 132], 'belt': [137, 153]},
    'f4': {'neck': [158, 136], 'belt': [139, 162]},
    'f5': {'neck': [141, 101], 'belt': [128, 137]},
    'f6': {'neck': [133, 99], 'belt': [123, 136], 'shoulder': [99, 99], 'elbow': [86, 125], 'wrist': [109, 124]},
}
import math
for name, points in landmarks.items():
    points['neckToBeltProjectedPx'] = round(math.dist(points['neck'], points['belt']), 1)
    if 'shoulder' in points:
        points['armChainProjectedPx'] = round(math.dist(points['shoulder'], points['elbow']) + math.dist(points['elbow'], points['wrist']), 1)
    crop = crops[0 if name == 'idle' else int(name[1:]) + 1]
    marked = Image.new('RGB', (256, 256), '#363b43')
    marked.paste(crop, mask=crop)
    d = ImageDraw.Draw(marked)
    for key, point in points.items():
        if not isinstance(point, list):
            continue
        x, y = point
        d.ellipse((x - 2, y - 2, x + 2, y + 2), outline='#00ffff')
        d.text((x + 4, y), key[0].upper(), fill='#00ffff')
    marked.resize((768, 768), Image.Resampling.NEAREST).save(OUT / (name + '-landmarks.png'))
(OUT / 'evidence.json').write_text(json.dumps({
    'commit': subprocess.check_output(['git', 'rev-parse', COMMIT]).decode().strip(),
    'sha256': hashes, 'cells': rows, 'manualLandmarks': landmarks,
    'uncertainty': 'Visible joint/garment endpoint approximately +/-3px each. Projected chains are not bone lengths. Skull crown cannot be read.'
}, indent=2) + '\n', encoding='utf-8')
print(json.dumps({'sha256': hashes, 'cells': rows, 'manualLandmarks': landmarks}, indent=2))
