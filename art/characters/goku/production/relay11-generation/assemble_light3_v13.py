from pathlib import Path
import hashlib
import json

import cv2
import numpy as np


ROOT = Path(__file__).resolve().parents[5]
SOURCE = ROOT / "art/characters/goku/raw/_qa_hold/light3_v12.png"
OUTPUT = ROOT / "art/characters/goku/raw/_qa_hold/light3_v13.png"
SIDECAR = ROOT / "art/characters/goku/raw/_qa_hold/light3_v13.json"
EVIDENCE = Path(__file__).with_name("ASSEMBLY_V13.json")
FACTOR = 0.696133
CELL = 256
BASELINE = 240
KERNEL = np.ones((9, 9), dtype=np.uint8)


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest().upper()


if OUTPUT.exists() or SIDECAR.exists():
    raise FileExistsError("Refusing to overwrite a versioned light3 v13 file")

image = cv2.imread(str(SOURCE), cv2.IMREAD_COLOR)
if image is None:
    raise FileNotFoundError(SOURCE)

b, g, r = cv2.split(image)
foreground = ~((r > 200) & (b > 200) & (g < 80))
closed = cv2.morphologyEx(
    foreground.astype(np.uint8),
    cv2.MORPH_CLOSE,
    KERNEL,
)
count, labels, stats, centroids = cv2.connectedComponentsWithStats(closed, 8)
components = [i for i in range(1, count) if stats[i, cv2.CC_STAT_AREA] >= 1000]
components.sort(key=lambda i: centroids[i][0])
if len(components) != 7:
    raise ValueError(f"Expected seven figure components, found {len(components)}")

cells = []
frame_rows = []
owned = np.zeros(foreground.shape, dtype=bool)
for frame, label in enumerate(components):
    x, y, w, h = map(int, stats[label, :4])
    y2, x2 = y + h, x + w
    source_mask = foreground[y:y2, x:x2] & (labels[y:y2, x:x2] == label)
    owned[y:y2, x:x2] |= source_mask
    crop = image[y:y2, x:x2]

    scaled_w = max(1, round(w * FACTOR))
    scaled_h = max(1, round(h * FACTOR))
    scaled = cv2.resize(crop, (scaled_w, scaled_h), interpolation=cv2.INTER_NEAREST)
    scaled_mask = cv2.resize(
        source_mask.astype(np.uint8),
        (scaled_w, scaled_h),
        interpolation=cv2.INTER_NEAREST,
    ).astype(bool)

    center_x = float(centroids[label][0] - x)
    left = round(CELL / 2 - round(center_x * FACTOR))
    top = BASELINE - scaled_h
    cell = np.empty((CELL, CELL, 3), dtype=np.uint8)
    cell[:] = [255, 0, 255]

    sx0, sy0 = max(0, -left), max(0, -top)
    dx0, dy0 = max(0, left), max(0, top)
    copy_w = max(0, min(scaled_w - sx0, CELL - dx0))
    copy_h = max(0, min(scaled_h - sy0, CELL - dy0))
    placed_mask = np.zeros_like(scaled_mask)
    if copy_w and copy_h:
        patch_mask = scaled_mask[sy0:sy0 + copy_h, sx0:sx0 + copy_w]
        target = cell[dy0:dy0 + copy_h, dx0:dx0 + copy_w]
        source_pixels = scaled[sy0:sy0 + copy_h, sx0:sx0 + copy_w]
        target[patch_mask] = source_pixels[patch_mask]
        placed_mask[sy0:sy0 + copy_h, sx0:sx0 + copy_w] = patch_mask

    scaled_pixels = int(scaled_mask.sum())
    placed_pixels = int(placed_mask.sum())
    frame_rows.append({
        "frame": frame,
        "sourceComponentLabel": int(label),
        "sourceComponentBoundsXYWH": [x, y, w, h],
        "sourceComponentForegroundPixels": int(source_mask.sum()),
        "uniformDensityFactor": FACTOR,
        "scaledCellBoundsXYWH": [left, top, scaled_w, scaled_h],
        "scaledForegroundPixels": scaled_pixels,
        "resamplingPixelDelta": int(source_mask.sum()) - scaled_pixels,
        "clippedForegroundPixels": scaled_pixels - placed_pixels,
        "sourceCentroidX": round(float(centroids[label][0]), 3),
    })
    cells.append(cell)

if int((foreground & ~owned).sum()) != 0:
    raise ValueError(f"Unassigned foreground source pixels: {int((foreground & ~owned).sum())}")
if any(row["clippedForegroundPixels"] != 0 for row in frame_rows):
    raise ValueError("Assembly clips source-derived foreground at native cell bounds")

strip = np.concatenate(cells, axis=1)
if not cv2.imwrite(str(OUTPUT), strip):
    raise IOError(OUTPUT)

evidence = {
    "schema": "goku-relay11-light3-assembly-v13",
    "state": "held diagnostic candidate; independent quantized Astra audit pending; not a manualQA or approval pass",
    "source": str(SOURCE.relative_to(ROOT)).replace("\\", "/"),
    "sourceSha256": sha256(SOURCE),
    "sourceDimensions": [int(image.shape[1]), int(image.shape[0])],
    "sourceForegroundRule": "not (R>200 and B>200 and G<80)",
    "componentDiscovery": "9x9 rectangular morphological close used only to assign source foreground into separated connected figure components; source colors/pixels remain unchanged before uniform nearest-neighbor scaling",
    "expectedFrames": 7,
    "foundFigureComponents": len(components),
    "unassignedSourceForegroundPixels": 0,
    "uniformDensityFactor": FACTOR,
    "factorBasis": "Astra multi-reference median torso/boot/belt ratio: 0.696133; not selected from posed bounding-box height",
    "cellSize": CELL,
    "pivotBottomY": BASELINE,
    "resampling": "nearest-neighbor; same uniform factor for all seven frames",
    "frames": frame_rows,
    "output": str(OUTPUT.relative_to(ROOT)).replace("\\", "/"),
    "outputDimensions": [int(strip.shape[1]), int(strip.shape[0])],
    "outputSha256": sha256(OUTPUT),
    "clippedForegroundPixels": sum(row["clippedForegroundPixels"] for row in frame_rows),
    "status": "technical hold until exact quantized candidate audit; drawing approval pending",
}
EVIDENCE.write_text(json.dumps(evidence, indent=2) + "\n", encoding="utf-8")

sidecar = {
    "character": "goku",
    "animation": "light3",
    "version": 13,
    "frames": 7,
    "sourceVersion": 12,
    "sourcePath": evidence["source"],
    "sourceSha256": evidence["sourceSha256"],
    "assemblyEvidence": str(EVIDENCE.relative_to(ROOT)).replace("\\", "/"),
    "assemblyEvidenceSha256": sha256(EVIDENCE),
    "savedPath": str(OUTPUT.relative_to(ROOT)).replace("\\", "/"),
    "sha256": evidence["outputSha256"],
    "dimensions": evidence["outputDimensions"],
    "scaleFactor": FACTOR,
    "bodyHeight": None,
    "status": "technical hold pending exact quantized candidate audit; no drawing approval",
}
SIDECAR.write_text(json.dumps(sidecar, indent=2) + "\n", encoding="utf-8")
print(json.dumps({
    "output": sidecar["savedPath"],
    "outputSha256": sidecar["sha256"],
    "evidence": str(EVIDENCE.relative_to(ROOT)).replace("\\", "/"),
    "sourceSha256": sidecar["sourceSha256"],
    "factor": FACTOR,
    "frames": len(frame_rows),
    "clippedForegroundPixels": evidence["clippedForegroundPixels"],
}, indent=2))
