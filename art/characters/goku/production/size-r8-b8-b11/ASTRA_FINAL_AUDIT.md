# Goku B8/B11 final Astra packed-atlas audit

GPT-6 Astra (medium), 2026-11-09. User approved both drawings via relay audit2 #8, quote **"Approve both"**. That image/design approval remains intact. This report identifies separate technical holds; it does not reject or alter the user's approved art.

## Later shipping decision (relay audit2 #12)

After this audit, the user directed Claude to ship bair v02 despite the short-upper-torso HOLD: **"Ship v02 (Recommended)"**. This is a shipping decision, not a new image approval or an anatomy/scale pass. The measured HOLD and version-bound `scaleManualQA` result `hold` remain unchanged. Claude owns the forced integration and will cite relay #12 with `--force-art`.

## Result

| Strip | Final disposition | Reason |
|---|---|---|
| B8 run v10 | **HOLD: internal registration**; visible anatomy/scale acceptable | Large horizontal body/head shifts at f2-to-f3 and f5-to-f6 remain in the exact packed cells. All frames fit their cells and the f7-to-f0 seam is small, but that does not clear the internal jumps. |
| B11 bair v02 / R3 replacement | **HOLD: short upper torso relative to approved idle/title anatomy** | Near-upright f0/f5 have a substantially compressed neckline-to-belt section, corroborated by smaller head/upper-body presentation. Tucked legs alone cannot explain it. Corrected color defects and complete f2/f3 kick are confirmed. |

No `scaleManualQA` pass object is provided for either held strip. The audit itself changed no pixels, scales, offsets, source inputs, manifest, approval records or production outputs. Relay #12 later changed only the documented shipping disposition for bair v02; it did not change the audit finding or authorize a rescale.

## Exact artifact

- Worktree: `E:/Vibe Coding/.codex/worktrees/art-size-r8-b/gcdTourney`, branch `art/size-r8-b`.
- Actual `public/characters/goku/sheet.png` SHA-256: `E596D3BBFA12E13A26E8C59390E650A004BC3602E14939EFEDCB0693FDF9DF21`.
- Matching `public/characters/goku/anims.json` SHA-256: `F97537105D1BE50BAC901936B4706C117777927439B605617464A479B49AAA94`.
- Metadata records run v10 cells 8-15, eight 60 ms frames, loop true (480 ms); bair v02 cells 184-189, durations [50,40,50,70,60,30], phases [2,2,2], loop false.
- The new evidence boards extract these exact atlas cells. They are not cached `frames/` images or the source strips.
- Automatic Goku head probing is disabled. Recorded `.591` run and `.713` bair probe values are **not used as numerical evidence**, ratios or grounds for these holds.

## Reference and measurement method

Approved packed idle v02 f0 (cell 0) is the runtime-density comparator. Approved Goku v02 neutral/combat cells are `public/characters/goku/calibration-r2/assets/references/title-neutral-v02.png` and `title-combat-v02.png`, sourced from the approved `art/characters/goku/reference/title_style_draft_v02.png`. They were viewed at their native 256x256 cell density with the actual atlas cells; only magenta in the disposable reference composite is transparent. The production contract establishes anatomy/build; title-native and fitted runtime art are distinct density stages, so no exact title-to-atlas pixel ratio is invented. The native title combat also has a visibly longer chest section than the new bair anticipation/recovery.

Prior-strip context was examined in existing `run-v10-compare.png` and `bair-v02-compare.png`, documented as including run v09/bair v01. Those unlabeled/interleaved boards are secondary context only. Final verdicts depend on freshly extracted, explicitly labeled cells and approved idle/title references; no unverified prior-frame mapping is used for measurements.

Clear contour landmarks have about +/-2-3 px uncertainty per endpoint. Neckline/belt measures have about +/-5-6 px combined uncertainty, due to garment folds and neck angle. Hip/knee centers under loose trousers can be uncertain by +/-6-8 px each; their exact anatomical chain lengths are not claimed. Hair is recorded separately from skull/face interpretation. No crouched or airborne body is fitted to a standing bounding box.

Manual one-density estimates from `astra-upper-body-4x.png`:

| Comparator | Hair crown through visible chin | Neckline/upper sternum to belt center | Interpretation |
|---|---:|---:|---|
| Idle f0 | approximately 50-54 px | approximately 34-40 px | Approved runtime baseline. |
| Run f0 and other readable front/three-quarter frames | approximately 47-54 px | approximately 33-40 px | Tracks idle within pose/landmark uncertainty; rotated back-view f2-f4 are not given false exact chest lengths. |
| Bair f0 and f5 | approximately 44-48 px | approximately 22-28 px | Hair differences alone are not decisive, but the substantially shorter chest remains in two readable near-upright frames. |

These are manual projected anatomical/garment landmarks, not automated probe output. The bair torso midpoint reduction is roughly 25-35%; precise percentage is not certified. At the most favorable ends of the uncertainty ranges the difference narrows, but the directly visible compressed chest and smaller shoulder/arm presentation persist across the sequence. Raising one thigh shortens overall pose height; it does not explain reducing the collar-to-belt chest section this much in f0/f5. This is an observed anatomy concern, not a hold merely because concealed joints cannot be measured.

## Exact bounds and registration evidence

Bounds below are `[x0,y0,x1-exclusive,y1-exclusive]`. All alpha bounds lie strictly within the 256px cells. `top35 centerX` is the center of the exact opaque x extent in the first 35 occupied rows of each frame; it tracks upper hair/head position only and is **not** a scale or skull proxy. Its full source bounds are in `astra-atlas-metrics.json`.

### run

| Frame / cell | Occupied bounds | top35 centerX |
|---|---|---:|
| f0 / 8 | [47, 28, 205, 241] | 144.0 |
| f1 / 9 | [56, 34, 200, 241] | 155.5 |
| f2 / 10 | [92, 26, 240, 241] | 190.5 |
| f3 / 11 | [4, 31, 173, 241] | 110.0 |
| f4 / 12 | [4, 23, 166, 241] | 100.5 |
| f5 / 13 | [30, 24, 166, 241] | 117.5 |
| f6 / 14 | [106, 23, 229, 241] | 184.0 |
| f7 / 15 | [43, 24, 211, 241] | 147.5 |

### bair

| Frame / cell | Occupied bounds | top35 centerX |
|---|---|---:|
| f0 / 184 | [115, 56, 215, 241] | 180.5 |
| f1 / 185 | [91, 58, 173, 241] | 143.5 |
| f2 / 186 | [4, 59, 150, 241] | 116.0 |
| f3 / 187 | [8, 70, 158, 241] | 118.0 |
| f4 / 188 | [103, 65, 185, 241] | 152.0 |
| f5 / 189 | [115, 62, 213, 241] | 179.0 |

## Run v10: all-frame assessment

| Frame | Anatomy, build and pose | Technical finding |
|---|---|---|
| f0 / 8 | Forward-facing stride, connected shoulder/elbow/wrist chains, long boots and loose gi consistent with idle. Hair/face remain adult-scale. | Contained; coherent stride endpoint. |
| f1 / 9 | Front leg advances, opposite boot lifts; chest leans without a sudden head-size change. | Head center shifts +11.5 px from f0; gait-related motion alone is plausible here. |
| f2 / 10 | Torso turns partly away; forward elbow and raised knee remain attached, orange trouser volume intact. | Figure is located markedly right of pivot; upper-head center x190.5. |
| f3 / 11 | Alternate stride with rear boot folded back, long leading leg, coherent back/shoulder build. | Upper-head center abruptly becomes x110: -80.5 px from f2 in one 60 ms beat. This is a body-registration jump, not a head-size change. |
| f4 / 12 | Continues the rear-facing stride with intact rear boot and forward leg. | Leftmost occupied x4, fully contained; center x100.5. Clipping correction succeeded but does not establish registration consistency. |
| f5 / 13 | Rotates toward viewer with a rear folded boot and connected arms. | Center x117.5; anatomy remains coherent. |
| f6 / 14 | Tucked passing pose with overlapping legs, both boots identifiable; torso/head scale remains consistent. | Center jumps +66.5 px to x184 from f5; torso also translates visibly, not merely hair rotation. |
| f7 / 15 | Opens back to front-facing stride; same build, gi and boot scale as f0. | Center returns to x147.5; f7-to-f0 difference only -3.5 px. |

Hair/head and garment volume are sufficiently consistent to pass the visual anatomy/scale portion. Shoulder rotation in f2-f4 legitimately changes visible chest width; bent limbs legitimately reduce posed extent. No detached or duplicated limb is evident. The first/last loop seam itself is reasonably aligned: f7 crown y24 versus f0 y28, upper-head center 147.5 versus144.0, with similar open-stride poses. It is **the internal cycle**, particularly f2-f3 and f5-f6, that prevents final clearance.

All frames share the same metadata pivot [128,240]; no per-frame runtime origin compensation is recorded in these animation entries. The measured shifts are much larger than the uncertainty of the landmarks and accompany translation of the chest/hips. See `astra-run-registration-and-seam.png` with the fixed x128 line. Claude must check the actual runtime implementation and contact/root registration; a 480 ms gameplay playback could confirm the symptom, but has not been performed by this audit. No scale adjustment would address a positional jump, and no offset edit is authorized by this report.

## Bair v02: all-frame assessment and R3 corrections

| Frame | Anatomy and pose | Color/contact/containment finding |
|---|---|---|
| f0 / 184 | One raised knee, extended opposite leg and guard arms; near-upright chest visibly short versus idle, with a smaller upper-body presentation. | Chin shows a skin/shadow contour, no isolated dark blob. Waist is a continuous blue sash/orange gi boundary without the prior pale patch. |
| f1 / 185 | Tight knee chamber, overlapped legs and guard; head/arms connected. Tucked pose is not judged by standing height. | Both boots identifiable; no clipping. This compressed pose alone would not prove a torso failure. |
| f2 / 186 | Back kick extends to screen-left; the torso rotates and one arm draws back. Hip-to-trouser-to-boot chain is complete. | Leftmost occupied x4: boot toe and its outline remain inside the cell. Orange gi is continuous; no misplaced skin patch on the gi. Legitimate exposed arm/neck skin remains. |
| f3 / 187 | Sustained back kick, complete long rear leg and downward counter-leg, connected guard arm. | Leftmost occupied x8; full kicking boot retained, including toe. The corrected offset clears the border. |
| f4 / 188 | Re-chamber with overlapping thighs and intact two-boot silhouette. | No fragment crosses cell boundary; fold/occlusion limits pelvis and knee measurement. |
| f5 / 189 | Returns to one-knee-raised guard; same short collar-to-belt section as f0, rather than restoration to approved idle's upper-body proportions. | Recovery is complete and cleanly contained. Persistent readable torso reduction corroborates the f0 finding. |

The f2/f3 rear kick completeness and the named f0/f2 color defects are repaired in the actual quantized atlas. Thus the R3 color/clip repair scope is satisfied by B11; it does not independently clear the anatomy hold. The f0/f5 chest comparison is decisive enough to retain HOLD. Boots, legs and clothing are complete; hidden joints prevent claiming exact limb ratios, and no separate missing-limb hold is added.

Bair is non-looping. F0/f5 resemble recovery endpoints, with upper-head center 180.5/179, but this audit has not validated jumpFall transitions, rearward hitboxes, attack reach, fighter facing or world-space altitude. Those remain Claude runtime checks.

## Evidence and boundaries

New files authored by this audit:

- `art/characters/goku/production/size-r8-b8-b11/ASTRA_FINAL_AUDIT.md`
- `public/reviews/size-r8-audit2-goku-b8-b11/astra-run-all-frames.png`
- `public/reviews/size-r8-audit2-goku-b8-b11/astra-bair-all-frames.png`
- `public/reviews/size-r8-audit2-goku-b8-b11/astra-atlas-metrics.json`
- `public/reviews/size-r8-audit2-goku-b8-b11/astra-landmarks-2x.png`
- `public/reviews/size-r8-audit2-goku-b8-b11/astra-upper-body-4x.png`
- `public/reviews/size-r8-audit2-goku-b8-b11/astra-run-registration-and-seam.png`

Existing comparison boards, inventories and review page were only read. No other worktree was accessed for this audit. No repack/build was run: this is inspection of an exact supplied production atlas, not validation of a code change. No commit was created. The user-approved versions remain approved drawings with the technical holds above; Claude handles any further action through the existing approval/coordination procedure.
