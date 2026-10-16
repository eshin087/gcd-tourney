# Luffy core: Claude calibration review (2026-10-15)

Input: `art/luffy-core` at 8e0f348, every core strip's newest raw (held ones included) packed into a scratch atlas with
`--quantize 48` and a scratch-only exemption so it could be viewed (never committed; the branch manifest is untouched).
Evidence in this folder: three one-scale contact sheets (idle f0 left of every strip, cells at 0.5x, red lines at the
idle's hat top y38 and the floor y240) and `heights.txt` (per frame: hat-top-to-sole px / widest hat row px, measured
by `heights.cjs` on the straw shade #fbbd51 within RGB 30; uncertainty about ±3 px height, ±3 px brim, more when the
hat is tilted or an arm crosses it). Scripts are `heights.cjs` and `sheet.cjs` (run from the repo root).

## Why the automatic probe misreads Luffy

His 48-colour palette has no hat-only or sandal-only colour: the hat straw `#fbbd51` is also the sash, the hat browns
are skin shadows and sandal straps, the hatband red is the vest. The automatic head palette therefore includes vest
and sash shades, and the feet palette skin shadows, so heads read 1.07-1.21 and feet 0.58-0.86 in poses whose size
matches the idle at one scale. A declared `headColors: ["#fbbd51"]` was tested and is worse (the hat silhouette
changes a lot with tilt; win read 0.52). So Luffy's numeric gate is not trustworthy, and nothing here weakens it: the
accepted path is `scaleManualQA` with per-frame landmark evidence, and real size errors are fixed, not exempted.

## Findings at one scale (idle hat-to-sole 199-202 px, brim 39-41 px)

| strip | finding | fix (no new image unless stated) |
|---|---|---|
| guard, charge, land, jumpUp, jumpFall, dash, run, light2, light3, airLight1, airHeavy, hurtHigh, beamCharge | size consistent with the idle at one scale (heights 179-203 in upright frames, brims 39-50 with head turn) | probe misread only: Astra records `scaleManualQA` per strip with these landmarks if the frames pass anatomy review |
| win v01 | upright pose only 174-183 px, shorter than the crouched idle (200): drawn too small | rescale with a measured manual factor so his upright height matches his approved title-style neutral at native density (~1.15-1.2x; measure it) |
| light4 v01 | f5-f7 are 101-105 px vs 200-206 in f0-f4: part B's head was mismeasured (idleScaleB 0.1871) and scaled by 0.4288 | re-stitch the existing parts into the next free version with part B factor ~0.84 (0.4288 x 203/103), landmarks hat top / soles, uncertainty ±3 % |
| special v01 | f6 is a cut figure (brim 25 px; the seam split one pose) | re-stitch the existing parts with the whole-figure layout into the next free version; check every frame is one intact figure |
| heavy v01 | brims 27-37 px vs 40 and a pop between parts (bFactor 0.9) | re-check part B's factor with landmarks before any redraw |
| light1 v01 | 153-168 px (about 0.8x), f0 a different drawing, black divider lines inside frames | needs a new image: its 3 calls are used, so it waits for the user |
| beamFire v02 | the Gigant Pistol arm leaves the cell (clip 44/130 px) | expected for this move (the engine's giant fist continues the lane); Claude accepts the clip for the arm only, the body must stay inside |
| launched, down, getup | low-confidence poses; down/getup lying frames float 7-8 px | manual QA; down/getup grounding needs a fix within budget or the user's call |
