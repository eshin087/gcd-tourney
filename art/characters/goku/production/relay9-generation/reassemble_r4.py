from pathlib import Path
import cv2
import hashlib
import json
import numpy as np

ROOT = Path('.')
OUT = ROOT / 'art/characters/goku/production/relay9-generation/ASSEMBLY_R4.json'
SPECS = [
    {'asset': 'heavy', 'version': 12, 'factor': .73, 'frames': 8, 'roomy': None},
    {'asset': 'light3', 'version': 10, 'factor': .62, 'frames': 7, 'roomy': 280},
]

def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def build_cell(crop, mask, factor, size, baseline, center_x):
    height, width = mask.shape
    scaled_w = max(1, round(width * factor))
    scaled_h = max(1, round(height * factor))
    scaled = cv2.resize(crop, (scaled_w, scaled_h), interpolation=cv2.INTER_NEAREST)
    scaled_mask = cv2.resize(mask.astype(np.uint8), (scaled_w, scaled_h), interpolation=cv2.INTER_NEAREST).astype(bool)
    left = round(size / 2 - round(center_x * factor))
    top = baseline - scaled_h
    cell = np.empty((size, size, 3), dtype=np.uint8)
    cell[:] = [255, 0, 255]
    x0, y0 = max(0, -left), max(0, -top)
    dx, dy = max(0, left), max(0, top)
    copy_w = max(0, min(scaled_w - x0, size - dx))
    copy_h = max(0, min(scaled_h - y0, size - dy))
    if copy_w and copy_h:
        src = scaled_mask[y0:y0 + copy_h, x0:x0 + copy_w]
        dst = cell[dy:dy + copy_h, dx:dx + copy_w]
        dst[src] = scaled[y0:y0 + copy_h, x0:x0 + copy_w][src]
    placed = np.zeros_like(scaled_mask)
    if copy_w and copy_h:
        placed[y0:y0 + copy_h, x0:x0 + copy_w] = scaled_mask[y0:y0 + copy_h, x0:x0 + copy_w]
    return cell, {
        'scaledSize': [scaled_w, scaled_h],
        'offsetTopLeft': [top, left],
        'sourceComponentForegroundPixels': int(mask.sum()),
        'resampledForegroundPixels': int(scaled_mask.sum()),
        'resamplingPixelDelta': int(mask.sum() - scaled_mask.sum()),
        'clippedForegroundPixels': int(scaled_mask.sum() - placed.sum()),
    }

results = []
for spec in SPECS:
    asset, version = spec['asset'], spec['version']
    src_path = ROOT / f'art/characters/goku/raw/_qa_hold/{asset}_v{version}.png'
    image = cv2.imread(str(src_path), cv2.IMREAD_COLOR)
    if image is None:
        raise FileNotFoundError(src_path)
    bg = (image[:, :, 2] > 200) & (image[:, :, 1] < 80) & (image[:, :, 0] > 200)
    count, labels, stats, centroids = cv2.connectedComponentsWithStats((~bg).astype(np.uint8), 8)
    components = [i for i in range(1, count) if stats[i, cv2.CC_STAT_AREA] > 100]
    components.sort(key=lambda i: stats[i, cv2.CC_STAT_LEFT])
    if len(components) != spec['frames']:
        raise ValueError(f'{asset}: got {len(components)} figure components')
    diagnostic_cells, roomy_cells, frame_info = [], [], []
    for frame, label in enumerate(components):
        x, y, w, h = map(int, stats[label, :4])
        x2, y2 = x + w, y + h
        mask = labels[y:y2, x:x2] == label
        crop = image[y:y2, x:x2]
        center_x = float(centroids[label][0] - x)
        diag, di = build_cell(crop, mask, spec['factor'], 256, 240, center_x)
        diagnostic_cells.append(diag)
        row = {
            'frame': frame,
            'sourceComponentId': int(label),
            'sourceComponentBoundsXYWH': [x, y, w, h],
            'densityFactor': spec['factor'],
            'diagnostic': di,
        }
        if spec['roomy']:
            companion, ri = build_cell(crop, mask, spec['factor'], spec['roomy'], spec['roomy'] - 16, center_x)
            roomy_cells.append(companion)
            row['roomyCompanion'] = ri
        frame_info.append(row)
    output = ROOT / f'art/characters/goku/raw/_qa_hold/{asset}_v{version + (1 if asset == "light3" else 1)}.png'
    # Relay9 assembly versioning: light3 source v10 -> v11, heavy source v12 -> v13.
    if asset == 'heavy':
        output = ROOT / 'art/characters/goku/raw/_qa_hold/heavy_v13.png'
    diagnostic_strip = np.concatenate(diagnostic_cells, axis=1)
    if not cv2.imwrite(str(output), diagnostic_strip):
        raise IOError(output)
    item = {
        'asset': asset,
        'source': str(src_path),
        'sourceSha256': sha256(src_path),
        'sourceDimensions': [int(image.shape[1]), int(image.shape[0])],
        'expectedFrameCount': spec['frames'],
        'connectedFigureComponentCount': len(components),
        'componentMaskMethod': '8-connected components of non-magenta source foreground; pixels assigned by component label',
        'uniformDensityFactor': spec['factor'],
        'pivotBottomY': 240,
        'frames': frame_info,
        'diagnosticStrip': str(output),
        'diagnosticDimensions': [int(diagnostic_strip.shape[1]), 256],
        'diagnosticSha256': sha256(output),
    }
    if spec['roomy']:
        roomy_path = ROOT / 'art/characters/goku/raw/_qa_hold/light3_v11_roomy_280.png'
        roomy_strip = np.concatenate(roomy_cells, axis=1)
        if not cv2.imwrite(str(roomy_path), roomy_strip):
            raise IOError(roomy_path)
        item['roomyCompanion'] = {
            'file': str(roomy_path),
            'cellSize': spec['roomy'],
            'dimensions': [int(roomy_strip.shape[1]), int(roomy_strip.shape[0])],
            'sha256': sha256(roomy_path),
        }
    results.append(item)
OUT.write_text(json.dumps({
    'schema': 'goku-relay9-assembly-r4',
    'status': 'diagnostic candidates only; not audited or approved',
    'entries': results,
}, indent=2) + '\n', encoding='utf-8')
