# ENG-112 Goku normals: final Astra technical audit

2026-10-18. Auditor: GPT-6 Astra, medium. Worktree: `E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-normals-goku`, branch `art/normals-goku`. Inspection only; no art approval.

## Disposition

**HOLD all ten v01 candidates for final production clearance.** This does not mean all ten require redraws. fTilt, dTilt and fair have plausible anatomy but insufficient precise all-segment evidence. uTilt and uSmash have visible scale failures. dashAttack, dSmash and bair have definite cell-edge clipping. fSmash has an import/order failure and retained grid borders. uair needs better scale evidence and may be undersized. No `scaleManualQA: pass` is justified by this inspection.

The exact 48-color quantized diagnostic atlas was inspected, every candidate frame, at native pixel density, with nearest-neighbor enlargement for clear guard comparisons. All ten entries are **non-looping**; every sequence and start/end pose was checked, but no seamless loop or timed runtime/contact certification is claimed. This warn-mode diagnostic (fighter packScale .92; strip factors 1.0 except fair .92) cannot itself establish a strict production pack pass.

## Reference and measurement method

Compared actual atlas idle f0/cell 0 and all light2 31-37, light4 45-52, heavy 53-60 and airLight1 61-65 cells. Inspected title neutral/combat v02 at native 256px from the existing fixture copies in `production/scale-qa/pilot-v01/fixture-output/references/`. The proposed `production/calibration-r2/assets/references/` location is absent here. These title images retain the adult muscular shoulders/arms, narrow blue sash, orange gi leg volume, long boots, and non-chibi head/body relationship. Native title artwork and the fitted runtime idle are separate density stages: title cells establish intended anatomy; precise candidate-to-runtime comparisons use idle at the atlas's actual .92 fighter fit, not a forced standing-height fit of crouches.

Coordinates and alpha bounds below are exact integer pixels; right/bottom bounds are exclusive. Margins use 256 minus those bounds. These are geometric support measurements, **not skeletal dimensions**. Boot, shoulder-to-belt and belt estimates are manual visible-contour measurements, deliberately rounded with uncertainty. Clothes conceal joints and hair conceals the skull. No full skull-to-chin, thigh/shin, upper-arm/forearm ratio within +/-6% can be inferred from an opaque sleeve/trouser silhouette alone. At 30px, +/-3px is already 10%; apparent visual agreement therefore does not earn a numerical pass. Hair height is not substituted for skull height, and crouched/airborne bounds are never resized to a standing target.

Clear guard comparisons in native pixels (approximate endpoints, uncertainty included): idle f0 right boot cuff around y200-203 to sole y235-239: visible boot span about **36-40px +/-3px**; shoulder crest to upper belt about **39-43px +/-3px**; blue belt span about **36-42px +/-3px**. These are projected garment landmarks, not anatomical shin/torso lengths. For uTilt f0/cell118 the right cuff is around y210-213 to sole y238-240 (**26-30px +/-3px**) and shoulder-to-belt about **32-36px +/-3px**. For uSmash f7/cell154 cuff around y211-214 to sole y239-240 (**26-29px +/-3px**), shoulder-to-belt about **31-35px +/-3px**. The boots are roughly 20-30% shorter centrally; this is much larger than the intended tolerance and persists in the guard endpoints, independent of crouch height. Near-guard occupied heights corroborate but do not decide it: idle 213px, uTilt f0 174px, uSmash f7 161px.

| v01 strip | Scale/anatomy evidence and uncertainty | Correction disposition |
|---|---|---|
| fTilt | Clear boots roughly 35-41px, shoulder-to-belt 37-44px; +/-3-5px. Adult arms/gi preserved. Skull and turned shoulder joints unreadable in active cells. | Evidence HOLD; retain selected factor pending accurate landmarks. No new rescale justified. Active f2 contact should be checked. |
| uTilt | Clear guard boots 26-30px; torso garment 32-36px; +/-3px. Smaller head/hair, arms and trouser volume too. | Scale HOLD. Measured enlargement may help, but overhead f4 already reaches y25; enlarging ~1.2-1.3 around sole y240 would exceed top. Needs measured placement/import and full re-audit, not blind scale fit. |
| dTilt | Guard boots about 37-43px, garment torso 39-46px; +/-3-5px. Crouch/extended leg proportion plausible; hips/knees concealed. | Evidence HOLD, no demonstrated reason to shrink. Low strike pose broadly complies. |
| dashAttack | Guard boots about 34-42px; garment torso 37-45px, +/-4px. Active limbs are cut off, so their lengths cannot be audited. | Clipping HOLD. Recenter/import complete source cells first. Do not shrink whole body just to hide clipping. Re-audit missing anatomy after import. |
| fSmash | Muscular adult shape broadly retained; rectangles corrupt alpha bounds and possibly packing fit. Current temporal order invalid. | Import HOLD. Remove grid-border pixels via derived import, crop 3x3 cells, restore row-major order, then repack/re-audit. Source v01 must remain unchanged. |
| uSmash | Endpoint boots 26-29px; torso garment 31-35px +/-3px, all smaller than idle. Arms/gi also reduced. | Scale HOLD. Clear guard landmarks support enlargement, but vertical strike y25 makes simple sole-anchored scaling unsafe. Import/placement plan needed; don't make body smaller. |
| dSmash | Guard boot/torso size broadly near idle; +/-4-6px. Active feet truncated; knees/hips occluded. | Clipping and pose HOLD. Opposite directions occur sequentially, not on both sides in each active frame as SPEC requires. A scale factor cannot correct that semantic mismatch. Claude must resolve the brief/spec discrepancy or redraw. |
| fair | Visible boots roughly 34-42px; shoulder-to-belt roughly 34-44px; +/-4-6px due rotation. Adult build credible. All boots intact at .92 strip fit. | Evidence HOLD, not proven failure. Retain .92 pilot fit; hidden thigh/shin/skull landmarks prevent strict numerical clearance. |
| bair | Smaller projected shoulder/belt than airLight1; approximate shoulder-to-belt 29-36px, +/-4-6px. Rotated/partly occluded boots cannot provide accurate full lengths. | Clipping HOLD plus scale concern. Facing/right, strike/left is correct. Recenter complete source rather than shrink; then remeasure. |
| uair | Shoulder-to-belt roughly 28-36px, +/-4-6px, boot contours roughly 30-38px with foreshortening. Narrower adult silhouette than airLight1. | Evidence/scale HOLD. No precise uniform correction factor is supported. Clear top boot on active f2/f3; vertical action complies. |

Estimates in this table are observations of clear examples, not min/max measurements of every hidden anatomical segment. Head skull landmarks, arm segment lengths and shin/thigh lengths remain unmeasured wherever covered or foreshortened. No claim of all-frame +/-6% compliance is made. No extra child discount, shoulder inflation or old universal head ratio is used.

## Definite import and pose findings

- dashAttack cells 133/134 contain 73/19 opaque pixels on x255. f2 cuts into the forward upper figure and f3 loses the kicking boot. dSmash 158/159 have 25 right-edge / 26 left-edge pixels; bair 171/172 each have 14 left-edge pixels. These are visible amputated contours, not merely close margins. Source-complete imports and placements need inspection before any factor is selected.
- fSmash source `raw/fSmash_v01.png` is a 3x3 grid with black separators. The intended chronological row-major cells 0..8 contain guard, deep coiled charge, knee-up launch, windup, two punches, and three recovery guards. Actual atlas f0..f8 visually map to source indices **[6,3,0,1,7,4,2,8,5]**. Thus source charge cell 1 appears in atlas f3, atlas held f1 uses source cell 3, active f4 is a guard and the final frame is a punch. Border residue forms visible rectangles in all nine cells, so alpha rectangles are not figure-only bounds. The source has usable intended poses; fix import before considering generation.
- uTilt reaches maximum overhead extension in f4, which metadata marks recovery (phases 2/2/3). f2/f3 have folded/bent arm positions. Claude should check the actual active contact arc and standing-opponent reach. fTilt f2 similarly remains a tight bent-arm coil before f3 full extension.
- dSmash prompt attempt02 asks right then left across f3/f4, while current SPEC requires both sides on active frames. The output follows the sequential prompt, not the stronger simultaneous bilateral requirement. Do not silently treat that as compliance.
- All retained poses preserve recognisable adult Goku identity, orange/blue clothing and golden hair. Identity familiarity does not resolve quantitative build/scale errors or user design approval.

## Every-frame review

Table cells are immutable atlas IDs for this hash. Per-frame observations include head/body/gi continuity and occlusion; general uncertainty limits above apply to every entry.


### fTilt v01 — HOLD

| Frame / atlas cell | Alpha bounds L,T,R,B | Margins L/T/R/B | Observation |
|---|---|---|---|
| f0 / 111 | (57, 24, 198, 241) | 57/24/58/15 | Complete adult guard; narrow belt, full gi trousers, intact boots. |
| f1 / 112 | (64, 28, 206, 241) | 64/28/50/15 | Windup turns shoulders; far arm partly hidden; no disconnected elbow. |
| f2 / 113 | (56, 25, 206, 241) | 56/25/50/15 | Back-facing coil; active f2 has bent fist near face rather than full long chest strike. |
| f3 / 114 | (50, 28, 236, 241) | 50/28/20/15 | Active f3 extends continuous shoulder-elbow-wrist-fist chain toward right at chest height. |
| f4 / 115 | (54, 25, 202, 241) | 54/25/54/15 | Abrupt return to guard after extension; torso/gi volume plausible. |
| f5 / 116 | (58, 24, 199, 241) | 58/24/57/15 | Settling guard, complete hands and feet. |
| f6 / 117 | (59, 24, 199, 241) | 59/24/57/15 | Near-repeat guard; plausible exit to idle. |

### uTilt v01 — HOLD

| Frame / atlas cell | Alpha bounds L,T,R,B | Margins L/T/R/B | Observation |
|---|---|---|---|
| f0 / 118 | (72, 67, 185, 241) | 72/67/71/15 | Guard is visibly smaller than idle, including boots and torso, not merely lower head position. |
| f1 / 119 | (67, 78, 192, 241) | 67/78/64/15 | Lower crouch retains small boots/forearms; bent knees prevent leg-length reading. |
| f2 / 120 | (72, 68, 190, 241) | 72/68/66/15 | Active f2 coiled elbow/fist near face, limited forward reach. |
| f3 / 121 | (71, 55, 188, 241) | 71/55/68/15 | Active f3 raises bent forearm over head; arc reads, strongest extension not yet reached. |
| f4 / 122 | (72, 25, 185, 241) | 72/25/71/15 | Fully extended vertical fist occurs in recovery f4; clear phase/contact concern. |
| f5 / 123 | (67, 66, 191, 241) | 67/66/65/15 | Arm retracts; small torso and boot contours persist. |
| f6 / 124 | (69, 67, 190, 241) | 69/67/66/15 | Guard returns at same reduced anatomical scale as f0. |

### dTilt v01 — HOLD

| Frame / atlas cell | Alpha bounds L,T,R,B | Margins L/T/R/B | Observation |
|---|---|---|---|
| f0 / 125 | (47, 23, 209, 241) | 47/23/47/15 | Near-standing guard comparable to idle; slightly fuller hair silhouette. |
| f1 / 126 | (58, 54, 197, 241) | 58/54/59/15 | Crouch compresses knees plausibly; wrists and boots intact. |
| f2 / 127 | (28, 63, 216, 241) | 28/63/40/15 | Active low leg extends right; bent supporting leg and fists intact. |
| f3 / 128 | (28, 70, 228, 241) | 28/70/28/15 | Active low kick follows through; far knee/hip occluded; full striking boot. |
| f4 / 129 | (69, 54, 199, 241) | 69/54/57/15 | Retracts to crouch; trouser overlap prevents precise thigh reading. |
| f5 / 130 | (48, 23, 209, 241) | 48/23/47/15 | Standing guard restored; no clear size pop versus f0. |

### dashAttack v01 — HOLD

| Frame / atlas cell | Alpha bounds L,T,R,B | Margins L/T/R/B | Observation |
|---|---|---|---|
| f0 / 131 | (65, 37, 195, 241) | 65/37/61/15 | Guard reasonably near idle scale; full boots. |
| f1 / 132 | (80, 48, 247, 241) | 80/48/9/15 | Running gather; forward body translation, intact bounds but only 9px right margin. |
| f2 / 133 | (104, 40, 256, 241) | 104/40/0/15 | Active gather/right forearm-head region is cut by right edge; 73 opaque edge pixels. |
| f3 / 134 | (53, 69, 256, 241) | 53/69/0/15 | Active flying kick cut at right edge; 19 opaque edge pixels, missing terminal boot. |
| f4 / 135 | (102, 23, 213, 241) | 102/23/43/15 | High knee retracts, torso turns; intact limbs. |
| f5 / 136 | (47, 33, 208, 241) | 47/33/48/15 | Landing guard; shoulders and gi read adult. |
| f6 / 137 | (46, 34, 207, 241) | 46/34/49/15 | Guard settlement; acceptable visual exit pose pending scale check. |

### fSmash v01 — HOLD

| Frame / atlas cell | Alpha bounds L,T,R,B | Margins L/T/R/B | Observation |
|---|---|---|---|
| f0 / 138 | (21, 23, 239, 241) | 21/23/17/15 | Source row-major cell 6 (recovery), not chronological startup; rectangular border residue. |
| f1 / 139 | (21, 23, 239, 241) | 21/23/17/15 | Source cell 3: windup, not intended deep held charge in source cell 1. |
| f2 / 140 | (20, 23, 238, 241) | 20/23/18/15 | Source cell 0: guard inserted after windup. |
| f3 / 141 | (27, 23, 245, 241) | 27/23/11/15 | Source cell 1: intended deep held charge appears too late at f3. |
| f4 / 142 | (25, 23, 243, 241) | 25/23/13/15 | Source cell 7: guard is incorrectly active; border remains. |
| f5 / 143 | (25, 23, 243, 241) | 25/23/13/15 | Source cell 4: full rightward punch active; intact shoulder/wrist chain. |
| f6 / 144 | (14, 23, 232, 241) | 14/23/24/15 | Source cell 2: startup knee lift appears in recovery. |
| f7 / 145 | (23, 23, 241, 241) | 23/23/15/15 | Source cell 8: guard recovery. |
| f8 / 146 | (34, 23, 251, 241) | 34/23/5/15 | Source cell 5: fully extended punch ends animation, wrong exit to idle. |

### uSmash v01 — HOLD

| Frame / atlas cell | Alpha bounds L,T,R,B | Margins L/T/R/B | Observation |
|---|---|---|---|
| f0 / 147 | (72, 83, 184, 241) | 72/83/72/15 | Crouched guard visibly undersized; boots and arm bulk reduced. |
| f1 / 148 | (78, 97, 179, 241) | 78/97/77/15 | Deeper squat; small boot size persists independently of pose height. |
| f2 / 149 | (81, 108, 177, 241) | 81/108/79/15 | Deep coil, near arm retracted; knees/hips covered. |
| f3 / 150 | (82, 70, 181, 241) | 82/70/75/15 | Active bent rising fist; small torso and supporting boots. |
| f4 / 151 | (74, 25, 181, 241) | 74/25/75/15 | Active full upward strike with complete overhead fist and arm. |
| f5 / 152 | (76, 64, 183, 241) | 76/64/73/15 | Retracting raised arm; no clipping, reduced build persists. |
| f6 / 153 | (74, 74, 181, 241) | 74/74/75/15 | Standing guard still visibly small versus idle. |
| f7 / 154 | (73, 80, 182, 241) | 73/80/74/15 | Final guard confirms size issue outside compressed crouch. |

### dSmash v01 — HOLD

| Frame / atlas cell | Alpha bounds L,T,R,B | Margins L/T/R/B | Observation |
|---|---|---|---|
| f0 / 155 | (54, 49, 203, 241) | 54/49/53/15 | Low guard, adult shoulder/arm build retained. |
| f1 / 156 | (61, 86, 210, 241) | 61/86/46/15 | Deep squat with palm planted; knee/hip heavily occluded. |
| f2 / 157 | (54, 92, 183, 241) | 54/92/73/15 | Back turn with planted palm; two boots identifiable. |
| f3 / 158 | (86, 66, 256, 241) | 86/66/0/15 | Active sweep RIGHT only; right boot clipped (25 edge pixels). |
| f4 / 159 | (0, 68, 187, 241) | 0/68/69/15 | Active sweep LEFT only; left boot clipped (26 edge pixels). Not simultaneous bilateral strike. |
| f5 / 160 | (65, 74, 210, 241) | 65/74/46/15 | Back-facing tuck and planted hand; colored sole exposed, not missing shoe. |
| f6 / 161 | (53, 32, 207, 241) | 53/32/49/15 | Returns upright; large pose-height change plausible but requires timed review. |
| f7 / 162 | (49, 23, 208, 241) | 49/23/48/15 | Final guard near idle size; cannot certify hidden active leg lengths. |

### fair v01 — HOLD

| Frame / atlas cell | Alpha bounds L,T,R,B | Margins L/T/R/B | Observation |
|---|---|---|---|
| f0 / 163 | (68, 72, 197, 241) | 68/72/59/15 | Airborne tuck; intact fists/boots, gi thigh overlap. |
| f1 / 164 | (56, 66, 190, 241) | 56/66/66/15 | Tuck rotates; near shoulder-arm chain intact, waist partly hidden. |
| f2 / 165 | (60, 72, 245, 241) | 60/72/11/15 | Active right kick complete, 11px right margin; hip/knee occlusion. |
| f3 / 166 | (60, 78, 245, 241) | 60/78/11/15 | Active right kick follow-through, 11px right margin; no boot clipping. |
| f4 / 167 | (68, 77, 191, 241) | 68/77/65/15 | Leg retracts, crossed boots distinguishable; hidden calf/hip. |
| f5 / 168 | (91, 68, 198, 241) | 91/68/58/15 | Guarded tuck exit; transition to existing aerial reference untested. |

### bair v01 — HOLD

| Frame / atlas cell | Alpha bounds L,T,R,B | Margins L/T/R/B | Observation |
|---|---|---|---|
| f0 / 169 | (115, 56, 211, 241) | 115/56/45/15 | Right-facing airborne gather; smaller torso/boot appearance than live airLight1. |
| f1 / 170 | (88, 56, 179, 241) | 88/56/77/15 | Coil facing right; opposite calf obscured; narrow projected torso. |
| f2 / 171 | (0, 61, 148, 241) | 0/61/108/15 | Active kick correctly extends LEFT behind; boot clipped at left edge (14 pixels). |
| f3 / 172 | (0, 60, 150, 241) | 0/60/106/15 | Active left kick follows through; same left clipping (14 pixels). |
| f4 / 173 | (100, 56, 188, 241) | 100/56/68/15 | Retracted knees; intact limbs, small-looking shoulder/belt. |
| f5 / 174 | (114, 56, 214, 241) | 114/56/42/15 | Right-facing recovery; endpoint leaves coherent aerial guard. |

### uair v01 — HOLD

| Frame / atlas cell | Alpha bounds L,T,R,B | Margins L/T/R/B | Observation |
|---|---|---|---|
| f0 / 175 | (116, 59, 198, 241) | 116/59/58/15 | Airborne knee-up guard; slim/small torso compared with airLight1; hands partly hide neckline. |
| f1 / 176 | (92, 55, 182, 241) | 92/55/74/15 | Tuck with both fists guarding; knees obscure hip landmarks. |
| f2 / 177 | (67, 28, 176, 241) | 67/28/80/15 | Active vertical kick clearly above head; complete boot and sole. |
| f3 / 178 | (68, 25, 169, 241) | 68/25/87/15 | Active vertical kick follow-through; complete leg silhouette, hidden hip and far knee. |
| f4 / 179 | (106, 56, 198, 241) | 106/56/58/15 | Retracts to airborne guard; wrists intact. |
| f5 / 180 | (116, 56, 204, 241) | 116/56/52/15 | Airborne guard exit; modest pose shift, no clear discontinuous limb loss. |

## Exact version and source binding

SHA-256 read from disk during this audit. All paths below are relative to `art/characters/goku/`. Selected sources are byte-identical to their named candidate, confirmed by hashing.

| File | SHA-256 |
|---|---|
| `production/eng112-all-diagnostic-atlas/characters/goku/sheet.png` | `2b0e7027a36b77d302fd3c9a8bfbd4d8f1a3a3edd5d4efbb4fb9a39dd57f714b` |
| `production/eng112-all-diagnostic-atlas/characters/goku/anims.json` | `1616cd0c507de43189962684e0712ca160293f5a4b76bade49f3d4f520309464` |
| `raw/fTilt_v01.png` | `d92a4b868bedda70a2bca6cb1866fac06a8f58fe5e3a71c36413983c17fcd870` |
| `raw/uTilt_v01.png` | `1cd7fe57ef661ed57972236de05697abe52ab11cdfc406740504f562f9a102f0` |
| `raw/dTilt_v01.png` | `09a583c5b1ea27baf27893d036dae2bd16ec1b980bb2a103dc07c25dfa31df22` |
| `raw/dashAttack_v01.png` | `f5d84c06c56fa819bd561bb7de4ecccb7db61ff3bfb833cce6cb3bcde4cd330d` |
| `raw/fSmash_v01.png` | `baecb43f6573462a4eb32ee831aad04e92066e7bbdebae6414e0b344be8e13ed` |
| `raw/uSmash_v01.png` | `99a0ba4994a5b22f60aa0ffbf3b0e1505deb5164088dae6003b121aaba5076c8` |
| `raw/dSmash_v01.png` | `5fa2c7a9fc9928788a2e17cf914453c0ef4a0760b26b939030b8c03c82abd43b` |
| `raw/fair_v01.png` | `89496da590c79209428bf01faa98d4163eda3c48981956a5d024ff54e2069525` |
| `raw/bair_v01.png` | `a014511373bfa5ec2f52b9df5a138efaff8cb08147b77297b8e0003308ccfc55` |
| `raw/uair_v01.png` | `a013fd19f30e4ee09b279d0363f6c4d17083129e27c749a93b217a053add83ac` |
| `production/scale-qa/pilot-v01/fixture-output/references/title-combat-v02.png` | `5714f663bd847e7ce9bb258d49872b85190fbcc9de3a75678acaa2fc25bfd69c` |
| `production/scale-qa/pilot-v01/fixture-output/references/title-neutral-v02.png` | `748ace13116f05cde59ca1ad390655bca26156e351fd6afcf307d2aad7ee7445` |

Selected `_qa_hold` source/attempt records: fTilt attempt03; fair attempt03; uTilt attempt01; dTilt attempt01; dashAttack attempt01; fSmash attempt03; uSmash attempt01; dSmash attempt02; bair attempt01; uair attempt01. Their `*_source.png` hashes equal the corresponding raw candidate hashes above. Prompt and reference provenance remains in the adjacent attempt Markdown files; this audit does not reset any generation budget.

## Required handoff

Claude should first repair/verify source import order, borders and clipped-cell placement, then derive any anatomical fit from matched landmarks. A new atlas hash requires a new audit of affected cells. Where an enlarged complete figure cannot fit within a 256px cell, do not solve this by making Goku anatomically small; escalate placement/pose/import constraints. fTilt/dTilt/fair evidence holds need readable matching landmarks or an explicitly accepted measurement disposition, not an invented numeric pass. The current atlas is not suitable for final strict scaleManualQA clearance.

User image/design approval remains separate and pending. This audit does not change gameplay, contacts, hitboxes, sources, manifest, tracker, REVIEW, or public outputs; no commit, generation, pack or build was performed. Only this report was added to the task worktree. Temporary inspection sheets were placed in the supplied visualization scratch directory, not in the art inputs.

## fSmash importer-side correction recommendation (source verified)

For source hash `baecb43f6573462a4eb32ee831aad04e92066e7bbdebae6414e0b344be8e13ed`, dimensions are exactly 1254x1254. Near-black separator columns are x=0,417,418,835,836,1253 (over 98% of each column has max RGB below 40); rows are y=0,417,418,835,1253 at that threshold. Adjacent dark magenta fringe exists, e.g. x419 at y200 is RGB(134,7,149), so erasing only the darkest one-pixel lines is insufficient.

A non-destructive version-bound `erase` sidecar can remove these verified empty divider bands, in raw `[x,y,width,height]` coordinates:

```json
{
  "erase": [
    [0,0,4,1254], [414,0,8,1254], [832,0,8,1254], [1250,0,4,1254],
    [0,0,1254,4], [0,414,1254,8], [0,832,1254,8], [0,1250,1254,4]
  ]
}
```

These bands visually miss all figures. A supporting color scan found zero strongly non-magenta colored pixels in each proposed band (criterion r>1.5b+20 or b>1.5r+20 or g>max(r,b)+20); this is a divider safety check, not proof of skin/anatomy segmentation. The raw image remains byte-identical. Preserve source history and follow PIPELINE's candidate-version/sidecar rules for the corrected import.

First try the existing auto grid split after this erase, in a disposable diagnostic only; verify its actual order against the source row-major 3x3 grid. Do **not** assume `split: even` means a 3x3 grid: the read importer only accepts `even` versus `auto`, and no explicit grid-coordinate sidecar contract was verified. If auto still scrambles poses, use Claude-owned importer support or a separately versioned derived strip from the nine known rectangles in row-major order, preserving the original source and recording provenance. Interior rectangles can exclude the erased gutters: x intervals [4,414),[422,832),[840,1250), y intervals the same; all are 410x410. Inspect full figure containment before using those crops. Expected corrected chronology is source row-major 0..8, held charge source cell1 at atlas f1, punches source cells4/5 at f4/f5, and guards source6/7/8 at recovery f6/f7/f8.

No sidecar, corrected raster or diagnostic repack was created by this audit. A corrected atlas must be re-audited for margins, preserved body scale, order and exact hash; the present HOLD stays in force until that happens.
