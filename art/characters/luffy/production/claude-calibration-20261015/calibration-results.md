# Luffy core calibration results (2026-10-15)

Scope: existing source art only; no image generation, packing, REVIEW/manifest/tracker update, public output, PR, or preview. Existing `raw/_qa_hold/` files and `raw/_parts/` sources remain unchanged.

## 1. light4 re-stitch

- Source parts: `raw/_parts/light4_v01_A.png` SHA-256 `CCF189A1FCCF1DD2AF0667D3DE345EFCB11B240B5E6E37644034C37BBB02DCE9`; `raw/_parts/light4_v01_B.png` SHA-256 `844BE42847E77C35DE2CE7014EC06E318A23CC8C92CD067C535793496C0FF36E`.
- Previous held composite `raw/_qa_hold/light4_v01.png`: SHA-256 `ADD02E6234E5875541DB4788461CD3505A44C0DA69BBC5ADA2D640F037E2D33F` (preserved).
- Hat-top-to-sole landmarks from `production/claude-calibration-20261015/heights.txt`: A f0–f4 = 203, 201, 206, 201, 200 px (median 201); after the previous 0.4288 B scaling, f5–f7 = 105, 104, 101 px (median 104). Correcting gives 0.4288 × 201/104 = 0.829; full measured ranges (A 200–206, B 101–105, each ±3 px) give 0.817–0.875. Used the requested approximate manual factor 0.84, inside that measured range.
- Stitcher found a separate head-probe B/A factor 0.6387 and reports post-rescale head B/A 1.303. This conflicts with the body-height landmark factor; retain as an explicit QA hold pending manual review.
- New candidate `raw/light4_v02.png`: SHA-256 `2547D41F81656B9755CE9EAFBA50BED1AD416B1C4A9EC4F1F43BF9B5611E826B`; sidecar `raw/light4_v02.json`: SHA-256 `E3D866152802B98B6EC1AC63B8BCC5A3AC2EB7E11A93186069167945FEBC920F`. No generation attempts consumed; light4's recorded generation budget remains 3/3.

## 2. special re-stitch blocked

- `raw/_parts/special_v01_B.png` and `raw/_parts/special_v01_B_two.png` are byte-identical, SHA-256 `D1BE8CF34C5C1DA435154F4B97B9696749701EF0FD73FA43C13E4E8DAFA8E87F`; each is 854,489 bytes. The part visibly has two touching figures and a vertical crop seam through the left figure. The existing whole-figure splitter cannot separate touching figures, and the pixels needed to make f6 intact are absent at that seam. No `special_v02` was fabricated. Source A SHA-256 is `7EC7381D83CA597C9E91F6C05BC7390C241A0FC24BEFA9A77E506828D1A55CEB`. Preserve special v01 hold. Existing generation inventory: 2/3 calls; this calibration uses none.

## 3. heavy re-measurement; no re-stitch

- Part A brim widths across f0–f4: 35, 37, 31, 34, 27 px (median 34). Part B across f5–f7: 28, 34, 33 px (median 33), from the one-scale calibration measurements. B/A = 33/34 = 0.971. With ±3 px per brim, conservative ratio bounds are 30/37 = 0.811 to 36/31 = 1.161. The existing 0.900 factor is inside the measurement uncertainty, so no new heavy composite was warranted.
- Heavy part hashes: A `974AE4629C1CC090BCAAB76CF77C18F2311300418954C7B0E27D7BE10EE06865`; B `FF00840FD725E8779ED794E0281799B095E329BDB3129F8EBECBA6B79764EEA8`. Existing heavy v01 remains held. Generation inventory remains 2/3.

## 4. win stature measurement and v02

- Native reference is the approved neutral embedded in `reference/title_style_lineup_v01.svg`: nested SVG `viewBox="0 0 724 724"`, rendered at 256×256. This is a direct native-density mapping, not an estimate from the 2172×724 source canvas. Straw-hat top y=23; sole y=693; hat-top-to-sole = 671 px × 256/724 = 237.2597 native px. Reference SVG SHA-256 `84ECF61ED394C47C069BDA8425F9E569604203FC8049186B8029C375C91CB50E`.
- Held win v01 calibration measurements: 183, 180, 174, 181 px; median 180.5 px. Measured factor = 237.2597/180.5 = 1.3145 (uncertainty about ±0.023 from ±1px reference and ±3px win measurements). This is above Claude's earlier 1.15–1.2 estimate; the exact native-cell mapping is the basis for the versioned candidate.
- Created `raw/win_v02.png` from the four existing v01 figures, each isolated, nearest-neighbor rescaled by 1.3145 and bottom-aligned. Dimensions 1928×960; SHA-256 `9B49D44E5A48BF3B60AAD3A84ECAE217F65DC32B869F1ED09BE1CC6FA8C6C444`. Sidecar `raw/win_v02.json` SHA-256 `B0D7A3A44BBE24FED1E8993380F7D14FF6C83BC208728C04A4628161B4795ACD` records reference, source hash, frame boxes, factor and uncertainty. Source `raw/_qa_hold/win_v01.png` SHA-256 `FB91682384287165D9F03AECB717643FAA2CDE470E0CE303328294FEC3FD9761`; preserved. No generation attempts consumed; win's recorded inventory remains 1/3.
- Candidate remains unreviewed. No production pack or native-atlas size check was run, per scope.

## Native diagnostic audit follow-up

See [Astra native audit](../native-audit-20261015/AUDIT.md) and its inventory/landmark JSON. The 256px/cell source-bound diagnostic confirms light4 v02 B-size repair but right29px f4 clipping, and demonstrates that win v02 uniform source enlargement is canceled by current bodyHeight212 normalization. Neither is cleared. Special remains blocked: the one newly authorized call was used but its output was not retained; no special v02 is inferred or regenerated. No production pack, public output, manifest gate change or approval occurred.
