# ART-SIZE-R8 B2 — Gojo special attempt inventory

Target: `special` v07, redrawn as v08 at the same body/head scale as Gojo's approved idle. The error is the smaller f3–f7 poses; keep f0–f2's move sequence and correct the later poses without enlarging the head.

- Source brief: [PROMPTS.md A18](../../PROMPTS.md#special-lapse-blue-two-finger-point-core) and [ANIMATIONS.md](../../ANIMATIONS.md#special).
- Candidate being corrected: `raw/special_v07.png`, SHA-256 `DDBD56B1539220C3C8B8A4DC3D64812F480FBF6AFBAFACA7E7618535A2680890`.
- Existing stitch v07 measured part scales 0.2598 (A) and 0.3193 (B); the stitcher scaled A by 0.8137 to reconcile them. v08 must be generated at a consistent idle-matched scale, then stitched only with its measured scale factor.
- Each part has an independent maximum of 3 generation calls. Call logs include failed and unsaved calls. Only the selected best attempt becomes v08.
- Identity references: approved `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. The old special v07 is used only to preserve pose order; Part B also uses selected Part A.
- Required sequence remains 8 frames, phases `[3,3,2]`: A = f0–f2, B = f3–f7. No blue, vortex, aura or glow. Keep the left hand in the pocket and the blindfold over both eyes.

## Generation call inventory

| Part | Call | Returned image path | SHA-256 | Filed path | Filed SHA-256 | Selection |
|---|---:|---|---|---|---|---|
| A | 1 | `E:/Vibe Coding/.codex/generated_images/01a1bdc7-7f63-74b0-aa73-a9f06981795a/exec-31a0d117-4a84-4f4c-b6c2-24d343a081da.png` | `044B1310031E7916D79A207A764A8FC98D2EC35AF72A791E7776B99F3579F0F7` | `raw/_parts/special_v08_A.png` | `044B1310031E7916D79A207A764A8FC98D2EC35AF72A791E7776B99F3579F0F7` | Selected: three poses; same high-collar uniform and two-finger sequence. |
| B | 1 | `E:/Vibe Coding/.codex/generated_images/01a1bdc7-7f63-74b0-aa73-a9f06981795a/exec-37470369-1de8-4d03-9872-07b67d642bd7.png` | `ADEDE0CFD5723B6780A826D2F7B9400AEE20E78F628584D3154B9169A982581B` | `raw/_parts/special_v08_B.png` | `ADEDE0CFD5723B6780A826D2F7B9400AEE20E78F628584D3154B9169A982581B` | Selected: five continuation poses; stitcher will reconcile scale with Part A. |

## Stitch and packed evidence

- Stitch v08 measured B factor `1.2579` and scaled Part A by `.795`. The stitcher warned one refinement trial clipped a pose, used its first estimate, and marked the cross-part head comparison uncertain; the actual packed cells were checked below.
- Quantized pack `node tools/pack-sprites.mjs gojo --quantize 48` exited 0: 54 animations / 254 frames, 48 colors. `special` v08 occupies cells 139–146, phases `[3,3,2]`, durations `[120,120,120,120,120,160,110,70]`; v07 remains approved.
- Packed head ratios by frame: `.961, .949, .967, .943, .955, .977, .957, .960`; median `.958`, range `.943–.977`. No head-gate failure. Feet proxy range `1.052–1.129`, median `1.091`.
- Body-area proxy B: `.893, .870, .876, .903, .893, .891, .889, .932`; median `.892`, no strip-level flag. The consolidated body sheet and packed cells were inspected directly; B remains an advisory area proxy.
- Actual packed body sheet comparison against idle f0 and the approved combat cell shows f3–f7 no longer shrink relative to f0–f2. The full strip retains connected limbs, consistent head size, blindfold, high-collar uniform and shared floor line; no frame clips. The f0–f2 to f3 transition stays within the observed head range.
- Final B2-B7 quantized atlas SHA-256: `178D87FE22DD9DA6FBEB6B878F60FE0F1A8498F4ECCCF50B70AFA4B0A2F78E80`.
- Evidence files: `art/scale/body-gojo-special.png`, `art/scale/heads-gojo.png`, `art/scale/scale-report.json` (frame values above); atlas frames `public/characters/gojo/sheet.png`, cells 139–146.
