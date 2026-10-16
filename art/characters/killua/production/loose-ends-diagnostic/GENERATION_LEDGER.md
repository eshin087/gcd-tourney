# Killua scale loose-ends generation and diagnostic ledger

All three versioned images below are candidates only; none is approved. Source PNG bytes were copied from the exact imagegen return paths. No raw candidate was resized or edited.

## Approved inputs

- `reference/idle_approved.png` SHA-256 `67E7016328A35AE12AAA2969F5E8C911D64B093039D9B1612583B21BFF655AA9`
- `reference/title_style_approved.png` SHA-256 `388DEFF2763A8C85009B1B7364B8F220C1C6582BC72DC30771C668F35407453C`
- `reference/title_style_combat_cell_v01.png` SHA-256 `D32D8F9F297EFAC7BCD8BA7E0DFD34C4D458ADA1FC5E45A9C93801340F5A63D6`
- Predecessors: `raw/charge_v13.png` `FD85FAD40CFE5DE07162821BE18E1B94723D170F4AD1430BDD10167F711DC67B`; `raw/down_v07.png` `E1F2E6840BEE2C34747A58EE295CEFCA9326AAD3D3BBCBFDCF053C2440CA001F`; `raw/ko_v08.png` `D0E1B389BC2AD9E7111745F364C36B722AAE475101D521F017D1A2444A11F755`

## Authorized generation calls

### charge v14

- First call event id: `exec-60762c91-52d7-494f-b3c1-ae56d396463e`
- Completed: `2026-10-16T02:50:23.462Z`
- Exact return path: `E:\Vibe Coding\.codex\generated_images\01a1429d-6392-7462-8aaf-362271c5fc1f\exec-60762c91-52d7-494f-b3c1-ae56d396463e.png`
- Saved candidate: `raw/charge_v14.png`; SHA-256 `18E39C33F9451972A4E88005C3DD454A9A4B6B1EE2C6AF92BA2326DDA9672030`
- Prompt: Edit reference image 1 (Killua charge v13 strip) into the next candidate, preserving its exact four-frame composition, pose, relaxed low open hands, crouched stance, facial expression, white spiky hair, purple long-sleeve top with white cuffs and hem, navy shorts, purple high-top shoes, and faint lavender/white electrical aura. Use reference image 2 (approved idle) and image 3 (approved title-style combat cell) only to correct Killua's physical head scale and anatomy: the head including hair should match their head size relative to his body, increasing it about 8 percent from v13 while keeping feet/body scale and the same poses. Keep four evenly spaced full figures, facing screen-right in 3/4 view, same camera and proportions; preserve a seamless looping charge with only subtle aura/palm changes. Flat pure #FF00FF background. Crisp hard-edged anime fan-art sprite, no antialiasing, no blur, no gradients, no text, no grid/dividers, no cropping. Output one horizontal strip of exactly four equal frames, each 256x256 native cells, pivot [128,240], soles aligned to y=240 in each cell. Do not add extra figures or change pose, aura, clothing, body size, or loop timing.

### down v08

- Exact return path: `E:\Vibe Coding\.codex\generated_images\01a1429d-6392-7462-8aaf-362271c5fc1f\exec-88235c69-6818-4be1-b01b-17d738c45785.png`
- Saved candidate: `raw/down_v08.png`; SHA-256 `7264843DB3512CC205264B6FB9978974FCCEF6EECEBC2682795BFBA9F9342486`
- Prompt: Create one 2-frame horizontal sprite strip of Killua Zoldyck from the supplied approved reference images. Use image 1, the approved title-style neutral, and image 2, the approved combat cell, as the exact anatomy, hair, face, outfit and scale references. Use image 3 (existing down v07) only to understand the original impact-then-lying pose intent; redraw it in a strict side-on 3/4 fighting-game camera approximately 12 degrees down, not from above. Frame 1 is the impact pose lying on his side after falling, frame 2 is the settled lying pose. Both must read as the same body and same head size as the approved neutral/combat. Head, back, hips and legs rest directly on the floor line at y=240; no floating gap. Preserve Killua's white spiky hair, purple top, white cuffs, navy shorts and purple high-top sneakers. Face and torso side-on, clear connected anatomy, limbs naturally bent and resting on the ground; the body axis lies horizontally across the cell. Center whole figures, no cropping, equal scale between frames. Pure flat #FF00FF background. Hard pixel edges, crisp anime fan-art sprite, no anti-aliasing, blur, gradients, text, grid or dividers. Exactly two equal 256x256 cells, pivot [128,240].

### ko v09

- Exact return path: `E:\Vibe Coding\.codex\generated_images\01a1429d-6392-7462-8aaf-362271c5fc1f\exec-2378a4c0-eb63-46c1-b638-60b362a62d91.png`
- Saved candidate: `raw/ko_v09.png`; SHA-256 `8837D5F15BEB4BDFBDE5BD2FB75CF00C369C58C50A324BFE9DF669E3C0709CCC`
- Prompt: Create a single-frame KO sprite of Killua Zoldyck based on the supplied images. Image 1 is the approved title-style neutral cell and image 2 is the approved combat cell; follow their exact head, torso, limbs, outfit, shoes and physical proportions. Image 3 (KO v08) conveys the original exhausted unconscious pose only; redraw it side-on in the game's 3/4 camera about 12 degrees down, not viewed from above. Killua lies unconscious on his side with eyes closed, relaxed face, naturally bent legs and relaxed arms; head, back, hips and legs rest directly on the floor line at y=240 with no gap. Match the approved neutral's head size and anatomy. White spiky hair, purple top with white cuffs, navy shorts, purple high-top shoes. Whole figure centered and uncropped, facing screen-right, horizontal floor pose. Flat #FF00FF background, crisp hard-edge anime fan-art sprite, no blur, gradients, antialiasing, text, grid, divider, effects or extra objects. Exactly one 256x256 cell, pivot [128,240].

## Accidental unauthorized duplicate call

While extracting the first call's output metadata, a second charge generation call was mistakenly made. It is not selected, must not be reviewed as a candidate or packed, and is preserved only in `raw/_qa_hold/charge_v14_duplicate_UNAUTHORIZED_call02.png` (SHA-256 `925422BC8748865AC11E39D44F9FF4412F41948F3F33190DACF91DD442298F5E`). Exact return path: `E:\Vibe Coding\.codex\generated_images\01a1429d-6392-7462-8aaf-362271c5fc1f\exec-091f1f07-19dd-4679-82a6-9a894591c430.png`. The authorized first call above is the sole v14 candidate.

## Diagnostic pack

- Production gate command: `node tools/pack-sprites.mjs killua --out art/characters/killua/production/loose-ends-diagnostic --no-writeback --quantize 48 --json` exited 1; character refused, 12 warnings, only UI files written.
- Isolated warning-only diagnostic manifest: `manifest-warn-only.json`, with only `characters.killua.scaleGate = "warn"` added. It is not the production manifest.
- Quantized review atlas: `warn-mode-atlas/characters/killua/sheet.png` SHA-256 `dcfa207a5a30cf9ae31e185e6684d4472ae6012727b50525f1199bf75bd3a628`; `anims.json` SHA-256 `f07b4887bc898a340f63fb559e99db0a4efa2ef48cb2f48524ae4ae84ba4f5cc`. Packer exit 0, 42 animations, complete, 48 colors, 8 warnings. The production gate still fails charge, down and ko.
- Probe report on raw candidates: charge head 1.09 (frames 1.100, 1.085, 1.094, 1.085), feet 1.158, uniform/strict; down head 0.837, feet 1.343, unmeasured/strict; KO head 0.662, feet 1.215, unmeasured/strict. These probes do not certify full anatomy. No calibration, bodyHeight, offsets, hitboxes or exemptions were changed.
