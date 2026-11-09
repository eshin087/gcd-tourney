# ART-SIZE-R8 B3 — Gojo fSmash attempt inventory

Target: `fSmash` v01, redrawn as v02. Preserve the 9-frame `[4,2,3]` charge, strike and recovery sequence; lengthen torso and legs to the approved idle build. Do not change `bodyHeight`, `packScale`, moves or timing.

- Move source: [KIT.md](../../KIT.md), [ANIMATIONS.md](../../ANIMATIONS.md#f-smash), and [MOVES_AND_VFX.md](../../MOVES_AND_VFX.md). The same palm strike and held frame 2 are retained.
- Pose order reference: `raw/fSmash_v01.png`, SHA-256 `C23681F7A1CAF7011BEFAC0597B3093740EE31F97D209DBBFD67B927335FE389`.
- Existing v01 sidecar selects 4+5 frames and marks `anatomy.measurement=auto-head`; retain the 4+5 split, discard the old frame-count override, and preserve the auto-head measurement instruction for v02.
- Each part has an independent maximum of 3 generation calls. Failed and unsaved calls count. Only the selected best attempt becomes v02.
- Identity references: approved `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`; v01 only for exact pose order. Part B also uses selected v02 Part A.

## Generation call inventory

| Part | Call | Returned image path | SHA-256 | Filed path | Filed SHA-256 | Selection |
|---|---:|---|---|---|---|---|
| A (f0–f3) | 1 | `E:/Vibe Coding/.codex/generated_images/01a1bdc7-7f63-74b0-aa73-a9f06981795a/exec-4b5206cc-0969-4106-b690-8f52be82f243.png` | `A96A6F1C6A9ECEB7D400B6F938392EAA7FB58811439C9B0660DB290E4CB6AACC` | `raw/_parts/fSmash_v02_A.png` | `A96A6F1C6A9ECEB7D400B6F938392EAA7FB58811439C9B0660DB290E4CB6AACC` | Selected: four-frame charge/load sequence; all heads and body poses held at one scale. |
| B (f4–f8) | 1 | `E:/Vibe Coding/.codex/generated_images/01a1bdc7-7f63-74b0-aa73-a9f06981795a/exec-504f1ced-de33-42c0-b4e5-442cac280ece.png` | `7C9555F3F2EE0782E30E2FE1E061BD509F379E75610895B8758D778CA30E0487` | `raw/_parts/fSmash_v02_B.png` | `7C9555F3F2EE0782E30E2FE1E061BD509F379E75610895B8758D778CA30E0487` | Selected: five strike/recovery poses at Part A's visible scale. |

## Stitch and packed evidence

## Stitch and packed evidence

- Stitch v02 measured Part B factor `1.0184`; Part A was scaled `.9819`, leaving the post-stitch B/A size ratio at `.971`.
- Quantized pack passed at 48 colors: `fSmash` v02 occupies nine frames with phases `[4,2,3]`; `packScale` remains 1 and timing is unchanged. Head median `.971`, feet proxy median `1.157`, no scale-gate flag.
- Body-area proxy B by frame: `.965, .944, .941, .958, .986, .959, .917, .939, .963`; median `.958`, no flag. Packed frames and body sheet inspected beside idle.
- Active palm pixels in the packed atlas: f4 x190–199/y46–72; f5 x181–192/y46–70. `hitboxes.json` v02 uses f4 `[189,45,12,28]`, f5 `[180,45,14,26]`; no pack scaling warning.
- Final B2-B7 quantized atlas SHA-256: `178D87FE22DD9DA6FBEB6B878F60FE0F1A8498F4ECCCF50B70AFA4B0A2F78E80`.
