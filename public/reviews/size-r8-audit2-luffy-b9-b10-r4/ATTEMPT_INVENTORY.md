# ART-SIZE-R8 Luffy B9/B10/R4 candidate inventory

Canonical source: `art/characters/luffy/production/size-r8-b9-b10-r4/ATTEMPT_INVENTORY.md`.

## B9 · run v02

- Image-generation calls: 1 of 3.
- Kept contact-sheet source: `art/characters/luffy/raw/_parts/run_v02_grid.png`, SHA-256 `3ed6989ed2e499c939e1a4e793785a2070b01dbe3cb166000cd9695b2fb95046`.
- Normalized with one uniform factor to a 4×2 grid, split into two four-frame strips, then stitched with measured B/A factor 0.9849. No pose-specific scaling.
- Final strip: `art/characters/luffy/raw/run_v02.png`; sidecar records source, stitch and frame placement. Measured offsets clear f3/f4/f7 clipping while preserving bodyHeight 204 and existing packScale 0.92.

## B10 · down v04

- Image-generation calls: 3 of 3; two earlier calls were unsaved. The saved call generated a two-cell contact sheet on 2026-11-09.
- Kept source: `art/characters/luffy/raw/_parts/down_v04_grid.png`, SHA-256 `10a8e084f68891d268451e5c8b06836c26c6e7e51a0b80d1e265b316ae78f67b`.
- Final strip: `art/characters/luffy/raw/down_v04.png`, 512×256; sidecar records the source and uniform normalization. Existing bodyHeight 106, packScale 0.92 and `[80,420]` ms timing remain unchanged.

## R4 · specialForward v02

- Image-generation calls: 0. One deterministic pixel-repair pass copied v01 and removed the detached f5 orange rear-foot fragment at source bounds x1611–1622, y560–576.
- Original v01 SHA-256: `7148219c2ae26fd4de0216cf1fc41e503afea8391f708137c067eb945d9b3098`.
- v02 strip SHA-256: `6d42d9a32482186240a2f96c67304520d476c6da8577d313433f13a2afbff841`.
- Sidecar records the repaired rectangle, 204 changed pixels, preserved palm-fragment regions, unchanged timing and existing packScale 1.08. No anatomy/scale claim is made; the prior technical hold remains.
