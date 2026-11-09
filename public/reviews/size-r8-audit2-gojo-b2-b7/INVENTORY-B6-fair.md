# ART-SIZE-R8 B6 — Gojo fair attempt inventory

Target: `fair` v02, six frames, `[2,2,2]` phases. Preserve the airborne front kick and strike frames f2-f3; match the approved idle/jumpFall body proportions and head size. Do not alter `bodyHeight`, `packScale`, or gameplay timing.

References attached: approved model sheet, expressions and idle; approved jumpFall as the full body-scale reference; fair v01 for pose order only.

## Part A — poses f0-f3

| Call | Result | Returned image path | SHA-256 | Filed path |
|---:|---|---|---|---|
| 1 | Selected for stitch | `E:/Vibe Coding/.codex/generated_images/01a1bdc7-7f63-74b0-aa73-a9f06981795a/exec-4ea552f2-5cf7-4604-b0b1-a7192acca8b1.png` | `5EFF87B573CCD0BC7F095027EDB0E7FB9306E29D7D61303397AEBF1B8EFB69B9` | `raw/_parts/fair_v02_A.png` |

## Part B — poses f4-f5

| Call | Result | Returned image path | SHA-256 | Filed path |
|---:|---|---|---|---|
| 1 | Selected for stitch | `E:/Vibe Coding/.codex/generated_images/01a1bdc7-7f63-74b0-aa73-a9f06981795a/exec-0029cd32-df25-4060-ad20-1d8c24166842.png` | `742EB9D0AD2089B9E2F0D728623EF9A78E7345C0808C8AD62A5FAFB63E30A129` | `raw/_parts/fair_v02_B.png` |

## Stitch and packed evidence

Stitch: measured B factor `.9173`, B/A after stitch `1.004`. Quantized pack passed; candidate `fair` v02, approved v01, six frames with phases `[2,2,2]`; `packScale` remains 1. Head median `.999`, feet proxy `.96`, head verdict `ok`. Body median `.880` versus approved `jumpFall` median `.889` (about 1% difference), no body-sheet flag. All six packed cells inspected beside idle and jumpFall; the reduced B values in folded poses track the approved jumpFall pose envelope. No `hitboxes.json` fair override exists. Atlas SHA-256 at this pack: `989c150602ecad2cf62150660401a3db030d45c2cc9f4066a25e1f16f42757a0`.

Final consolidated B2-B7 quantized atlas SHA-256: 178D87FE22DD9DA6FBEB6B878F60FE0F1A8498F4ECCCF50B70AFA4B0A2F78E80.
