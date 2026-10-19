# Luffy charge v02 — final packed-atlas Astra audit

2026-10-18, GPT-6 Astra. **Manual scale: PASS; strict charge-loop contract: HOLD.** The user's relay #6 approval, “Approve v02 as drawn”, remains image approval. This audit makes no edits to the drawing and does not turn that approval into a technical loop pass. No game playback or contact/hurtbox verification is claimed.

## Exact evidence

- Raw `raw/charge_v02.png`: SHA256 `69e94d35c8e7832f5a08104e93a7fd61d1268ecdb1e491678396403522c2dd5`.
- Actual quantized `public/characters/luffy/sheet.png`: SHA256 `557bdb538bbcfd79c5dadcf0761d3da8ae93986fe8ae0a4d110363519fb46a8c`.
- `anims.json`: SHA256 `f73578bf7f640be0919f0a0443133f5c1891305ad3c9844905221ecb3b2353e9`; charge cells 86–91, timings 70/90/110/110/110/110 ms, `loopFrom: 2`.
- [All cells beside references](reference-contact-2x.png), [atlas row](atlas-contact-2x.png), [registration](registration-2x.png), [landmark crosses](landmarks-2x.png), [coordinates](landmarks.json).

Cells were cropped directly from the atlas at 256px, without refitting. The reference sheet uses the approved title draft's neutral crop `(0,0,724,724)` and combat crop `(1448,0,2172,724)`, displayed at 256px exactly as its approved lineup SVG specifies. The source idle first cell was inspected in `reference/idle_approved.png`; the numerical production comparison uses its current packed idle f0. Reference resizing is only for the approved display density, not to match charge height. The original four title-style cells and production contract establish the cast relationship; Luffy's approved title poses establish his own anatomy. No common head-ratio or standing-height target was substituted.

## Scale and anatomy

Method: native alpha bounds of separate sandal ROIs `(30,227,85,241)` and `(160,227,220,241)` (exclusive right/bottom), followed by visual landmarks on nearest-neighbor enlarged cells. Widths include outline. These are geometric sandal widths, not palette-area ratios. Exact occupied bounds have zero pixel-count uncertainty; interpretation of the sandal/ankle boundary has about ±1px uncertainty. Luffy has no wristbands: none were invented as measurement anchors.

| Frame | Left sandal width | Right sandal width | Left/right lowest occupied y |
|---|---:|---:|---|
| Packed idle f0 | 26 | 40 | 240 / 237 |
| Charge f0 | 27 | 39 | 240 / 239 |
| Charge f1 | 27 | 39 | 240 / 238 |
| Charge f2 | 27 | 39 | 240 / 238 |
| Charge f3 | 27 | 38 | 240 / 238 |
| Charge f4 | 27 | 39 | 240 / 238 |
| Charge f5 | 27 | 39 | 240 / 238 |

The rigid width ratios are +3.8% left and -2.5% to -5.0% right against idle. The shorter posed figure therefore does not indicate a uniform underscale. Visual face width is approximately 24±2px in idle and release/holds; chin/hat occlusion makes gather less certain (about ±3px). Neck-to-sash projected span is about 47±3px in idle and 46±3px in the held stance. Hat tilt is separate from skull size.

Every frame retains the lean torso, narrow waist, long legs, open vest, white shorts cuffs, sash and sandals. f0 compresses the torso in a forward crouch; f1 opens it; f2–f5 retain that figure. No extra/missing limb, clipping, disconnected hand, inflated shoulder mass or new rubber extension was observed. The lowered near forearm projects shorter than idle's forward guard arm; bend and foreshortening prevent a confident exact length ratio. Shorts broaden across the crouched thighs, without a clear clothing-volume scale error. This is a manual landmark scale acceptance, **not a measured ±6% certificate for every anatomical segment**, and no automatic head/garment probe pass is claimed. `builds.json` correctly leaves the unreliable hat probe manual.

The proposed version-bound record is [proposed-scaleManualQA.json](proposed-scaleManualQA.json). It accepts drawing scale only. It must not be cited as clearing the following loop failures.

## Sequence and loop

| Check | Finding |
|---|---|
| f0 gather → f1 release | PASS visually: lower, tucked normal-skin gather changes to lifted, grinning pink Gear Second stance; knee hand and chest fist read. |
| f1–f5 pink stability | PASS state continuity: each remains pink. Shared pinks include RGB `(249,154,150)` and `(240,113,116)`; normal highlights remain, but no return to normal-skin state occurs. |
| Feet locked f2–f5 | HOLD. Compared with f2, the y220–240 region has 585/479/462 changed RGBA pixels for f3/f4/f5. Even floor row y240 has 17/13/14 changed pixels. Left sandal moves one pixel left in f3; right edge/shape changes. These are small geometric changes but not identical planted pixels. |
| Head ≤2px | HOLD. Estimated face centers f2/f3/f4/f5: `(149,115)/(147,111)/(149,114)/(149,118)`, ±1.5px per center. Nominal vertical excursion is 7px. Exact hat-top y is 85/82/84/88, consistent with the drift but not used as a skull-size proxy. |
| Fist ≤2px | HOLD. Chest-fist centers approximately `(157,146)/(154,143)/(157,145)/(157,148)`, ±1.5px. Nominal excursion 3px x, 5px y; cannot certify ≤2px. |
| Hip/knee lock; 1–2px pump | HOLD. Sash top landmarks move about 5px vertically and shoulder about 6px (±2px landmark interpretation). Knees and cuffs change with the figure. This is a several-pixel body pump rather than the required locked hip line. |
| Four-shape updraft and wrap | Four frames differ, especially sash/vest/hat contours, but much of the motion is whole-body displacement. Distinct upward cloth flow is weak; f5→f2 returns roughly 3px upward. Cannot certify a seamless locked hold from these pixels. |
| Sprite effects | PASS: no generated steam, aura, lightning or dust. |

Claude's “feet within 1–3px after fit” is broadly supported geometrically, while exact pixel locking fails. “Hold pump 3–4px” understates the full f3-to-f5 excursion at the head; landmarks indicate roughly 6–7px there. Estimates include uncertainty and are not subpixel tracking claims.

**Handoff:** preserve the approved v02 pixels. Claude must reconcile the approved-as-drawn decision with the explicit loop deviations and perform the game/contact check before integration. No redraw or scripted repair is authorized by this audit. A new atlas hash/refit invalidates these measurements and requires rechecking affected cells.

## Metadata-only strict repack note

After the version-bound `scaleManualQA` was added, the strict pack was rerun. The quantized sheet stayed byte-identical at SHA-256 `557bdb538bbcfd79c5dadcf0761d3da8ae93986fe8ae0a4d110363519fb46a8c`; charge cells 86–91, timings, and `loopFrom: 2` are unchanged. `anims.json` metadata changed from `f73578bf7f640be0919f0a0443133f5c1891305ad3c9844905221ecb3b2353e9` to `dd751d52fcd259ca37ca038ba862051d9e9c10aa8aee6ddc2d74ea34a8c03fe2` to record the manual scale result. Pixel measurements remain valid; no atlas refit occurred.
