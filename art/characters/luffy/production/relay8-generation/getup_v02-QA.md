# Luffy getup v02 candidate — relay #8

Status: candidate is frozen for independent Astra inspection. **No scale/manual QA pass, art approval, or gameplay approval is claimed.**

## Provenance and whole-source measurement

- Candidate: `art/characters/luffy/raw/getup_v02.png`, SHA-256 `94c7666ebc59f696a7acea845b2a64ee576af179310682ad4d087ee9125598d4`.
- Sidecar: `art/characters/luffy/raw/getup_v02.json`; source preserved unchanged from `production/generation-source/getup_v02_call02_returned-source.png` (2,172×724, SHA-256 `674be6dfc0e3cda4546201392d5b0664681565e8d80cd28d8724276631611127`).
- Complete whole-figure component boxes measured in the continuous image, inclusive: f0 `[25,421]–[497,599]` (473×179), f1 `[540,356]–[908,599]` (369×244), f2 `[937,314]–[1317,604]` (381×291), f3 `[1370,258]–[1692,603]` (323×346), f4 `[1759,163]–[2150,603]` (392×441). The apparent crossings at nominal 434px panel separators are outline pixels from intact drawings, not limbs clipped at the source image edge. The five main components are separated by clear horizontal gaps. No source component is omitted by the figure extraction.
- Source lowest y varies by 5px (599–604); final cell placement uses the packer's common foot anchor y=240, a translation rather than per-pose scale.

## Provisional scale and corrected landmarks

Candidate sidecar requests a shared target body height of 190px. Its recorded source-bbox factor is `190/441 = 0.43084`; after packer-style background cleanup and figure trimming, the frozen helper-built atlas applied `190/439 = 0.43280`. This small denominator difference is retained as a provenance note. Both factors are **provisional and uncertified**; neither is a measured-scale pass. My first rough f4 neckline point `(168,88)` was too near the jaw; do not use its 114px torso estimate.

Astra's interim source check corrected the f4 sternoclavicular/open-vest neckline to about `(185,115)` and sash center to `(178,202)`, length `87.3±8px`; the exposed left shin is approximately `(72,300)` to `(31,402)`, length `110±8px`. Against the previous independent reference endpoints (idle torso `41.5±6px`, exposed shin `52.8±6px`), these imply factors about `0.476` and `0.480`, respectively. The estimate supports a common factor near `0.478` (torso: neck base `(185,115)` to sash `(178,202)`, `87.3±8px`; shin `(72,300)` to `(31,402)`, `110±8px`; reference torso `41.5±6px`, shin `52.8±6px`). This suggests frozen `0.43280` may be undersized. The current atlas remains frozen for Astra's complete report; no change or pass is made here.

## Candidate-cell bounds and attempt/pack status

The frozen diagnostic cells are f0 x25–228/y164–240; f1 x49–207/y137–240; f2 x51–214/y116–240; f3 x71–209/y92–240; f4 x42–210/y51–240. These are candidate placement bounds, not scale approval.

Generation call 2/3 was used 2026-10-16; exact prompt, approved input hashes, returned filename, source path and copy incident are recorded in `getup-v02-call02.md`. No retry is authorized this round. The isolated strict pack exited 1 and wrote no target because this low-confidence pose requires independent manual comparison. The seven-cell candidate fixture was created with packer-exported helpers for inspection; it is not the standard full gameplay atlas. All findings must remain bound to its exact SHA in `diagnostic-atlas/anims.json`.
