# ART-SIZE-R8 B7 — Gojo fTilt attempt inventory

Target: `fTilt` v02, seven frames with `[2,2,3]` phases. Preserve the grounded chest-height near-hand palm strike; match idle's jacket and trouser width. Do not alter `bodyHeight`, `packScale`, or gameplay timing.

References attached: approved model sheet, expressions and idle; fTilt v01 for pose order only. The approved idle is the silhouette-width authority.

## Part A — poses f0-f3

| Call | Result | Returned image path | SHA-256 | Filed path |
|---:|---|---|---|---|
| 1 | Selected for stitch | `E:/Vibe Coding/.codex/generated_images/01a1bdc7-7f63-74b0-aa73-a9f06981795a/exec-37865e31-455f-4567-bd97-c2316fe3dbec.png` | `79BA34398F0ECE18A20AC1353BD7A742B0CB7E9BB475F75A9FAC9D7835321C7B` | `raw/_parts/fTilt_v02_A.png` |

## Part B — poses f4-f6

| Call | Result | Returned image path | SHA-256 | Filed path |
|---:|---|---|---|---|
| 1 | Selected for stitch | `E:/Vibe Coding/.codex/generated_images/01a1bdc7-7f63-74b0-aa73-a9f06981795a/exec-d259e4d1-3349-49c9-84b4-faa347b620e2.png` | `D3598BC4EDAFF098D2B5A207561BDC59D456BCD3D50BE79C78647EDAD7F4AF36` | `raw/_parts/fTilt_v02_B.png` |

## Stitch and packed evidence

Stitch: measured B factor `.9756`, B/A after stitch `.994`. Quantized pack passed; seven frames with phases `[2,2,3]`, `packScale` unchanged at 1. Head median `1.016`, feet proxy `1.014`, verdict `ok`. Body median `.935`, no flag. Packed body sheet and atlas compared to idle f0. Using the build-color horizontal-run proxy on upright f0/f6 cells, jacket widths match idle at y64 (36 vs 37 px), y80 (25 vs 25), y88 (28 vs 27); trouser runs at y168/176/184/200 are 19/17/19/15 vs idle 19/17/19/15 px. The former 20-23 px leg bulk is corrected. No fTilt hitbox override exists. Atlas SHA-256 at this pack: `178d87fe22dd9da6fbeb6b878f60fe0f1a8498f4ecccf50b70afa4b0a2f78e80`.

Final consolidated B2-B7 quantized atlas SHA-256: 178D87FE22DD9DA6FBEB6B878F60FE0F1A8498F4ECCCF50B70AFA4B0A2F78E80.
