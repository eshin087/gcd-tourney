# ENG-112 Killua dSmash v03: final diagnostic atlas audit

2026-10-18. **Result: technical HOLD.** Selected source is v03 attempt01. Selection is not user approval. This audit inspects the exact quantized diagnostic atlas, all eight candidate cells and the eight-frame idle loop; it does not certify runtime hitboxes or gameplay contact. No art inputs, manifest values, transforms or production atlas were changed. No additional generation was made.

## Evidence identity

- Diagnostic directory: `E:\Vibe Coding\.codex\visualizations\2026\10\18\01a14c8c-4884-7102-a8e0-efa63fbe6bb6\killua-v03-atlas2\characters\killua\`.
- `sheet.png` SHA-256, independently verified: `15025afeef5c3945b6a3ce7d5245a71d8e1bd051d3391453cca4bdc9108109e9`.
- `anims.json` SHA-256, independently verified: `09d11c86aa52c6698673484a1f443cb5d6df1fb219f26425d275a810e3cf4261`.
- dSmash atlas cells 225-232, zero-based local frames 00-07, phases [3,2,3], non-looping. Active frames are 03 and 04, cells 228 and 229.
- Compared with atlas idle cells 0-7; approved `reference/idle_approved.png`, `model_sheet.png`, `expressions.png`; main `public/art-review/title-style-pilot/killua-neutral_v01.png` and `killua-combat_v01.png`; selected `raw/_qa_hold/dSmash_v03_attempt01.png`; rejected `raw/_rejected/dSmash_v02.png`; and the exact-atlas findings recorded in `ENG112_NORMALS_V02_AUDIT.md`.
- Inspection-only crops `audit-idle-dsmash.png` and nearest-neighbor `audit-active-3x.png` are in the diagnostic directory. Source images and the atlas were not modified.

## Every frame: connection and margins

Bounds below are inclusive occupied-pixel coordinates measured from the actual atlas alpha channel. The lower occupied y=240 agrees with the prescribed sole/support baseline. Bounding boxes describe poses, not body stature.

| Local frame / cell | Bounds x / y | Observation |
|---|---|---|
| 00 / 225 | 65-190 / 70-240 | Connected standing guard, both arms and boots present. Visibly larger head and fuller figure than idle. |
| 01 / 226 | 77-180 / 117-240 | Connected crouch; forward hand approaches the boot. Narrow hand/shoe gap and fingers are less distinct after quantization. |
| 02 / 227 | 69-186 / 119-240 | Connected deeper preparation, one supporting hand down and rear arm extended. Both legs/boots readable. |
| 03 / 228 | 0-224 / 124-240 | Both low outward legs and boots read as simultaneous strikes. Left boot reaches x=0 and its outer contour is boundary-cut: fails left safety margin and clean full-foot retention. Supporting arm/hand is attached. |
| 04 / 229 | 35-207 / 122-240 | Both low boots visible, connected to their legs. Right leg extends; left knee folds with the boot nearer the hip. Rear low presence is readable but rear strike reach is substantially weaker than frame 03. |
| 05 / 230 | 90-178 / 118-240 | Connected compact recovery; supporting hand and both boots present. Palm/finger detail remains uncertain. |
| 06 / 231 | 70-186 / 73-240 | Connected rising/guard recovery; no boundary contact. |
| 07 / 232 | 68-187 / 70-240 | Connected guard; no boundary contact. Larger figure than idle makes the return to idle a visible size change. |

No detached extra limb or missing complete limb is visible in these cells. Frame 03 nevertheless fails full margin retention. Fine finger count and wrist anatomy are not certifiable from these pixels; the supporting palms are broad/flattened rather than clearly articulated.

## Both-side LOW requirement

Compared with v02's alternating one-sided sweeps, v03 substantially improves the required action: both active frames now contain low boots on each side of the torso. Frame 03 clearly communicates a bilateral split sweep. Frame 04 communicates an extended front strike and a folded rear leg with a low rear boot; it does not communicate equally strong bilateral extension. The raised rear hand is not counted as a LOW contact.

Thus the static bilateral LOW silhouette is readable in both frames, with qualified confidence for frame 04. A strict contact pass remains pending: frame 03 loses its left margin, and frame 04's shorter rear reach must be checked against Claude's actual contact/hurtbox requirements. No runtime test or hitbox validation was performed.

## Anatomy, scale and clothing

The approved title neutral/combat cells preserve a lean build, compact head, restrained shirt volume and slim lower legs. The atlas idle loop is stable: its occupied height ranges 156-158 px, with frame 0 x68-186/y85-240. Candidate standing frames 00/07 occupy 171 px height and 06 occupies 168 px; these are evidence of a larger presentation, not direct stature ratios because their stance differs.

The candidate head/hair mass is visibly enlarged across preparation, action and recovery relative to idle. Torso/shirt volume and cuffs look fuller; hands and boots also read heavier. Shorts retain the identity and basic cut but broad folds and the split pose obscure hip landmarks. Exposed lower-leg lengths, bent knees and foreshortened rear leg cannot be equated to standing limb lengths. Arms remain connected, but pose-specific upper/lower-arm segment lengths have not been reliably measured. No head/torso/arms/legs/shoes +/-6% certification is issued.

Raw attempt01 already contains the fuller head/body impression and weak folded rear leg in frame 04. Quantization preserves those features rather than correcting them. It introduces small-scale edge/finger loss, and this pack additionally drives frame 03's rear boot to the cell boundary. The raw's complete canvas margins therefore do not establish packed margins. All three sources were 2172x724 rather than the requested 2048x256, with nonuniform pose spacing and soft illustrated rendering; quantization alone does not establish compliance with the hard-pixel art direction.

## Uniform packScale feasibility

The supplied exact-pack diagnostics are H=1.244 median and F=1.402 with a uniform verdict. These are treated as reported probe results, not independently rederived anatomical measurements. In the existing v02 audit, H and F are head-color and shoe-color proxies. **F is not a whole-body or torso measurement.** The uniform verdict is not an anatomy pass.

If both reported values behave as linear scale ratios, +/-6% gives:

- Head: s in [0.94/1.244, 1.06/1.244] = [0.755627, 0.852090].
- Shoe: s in [0.94/1.402, 1.06/1.402] = [0.670471, 0.756063].
- Mathematical overlap: [0.755627, 0.756063], only about 0.000436 wide.

At s=0.7558 the reported head ratio would be about 0.940215 and shoe ratio about 1.059632. Consequently it would be incorrect to claim these two rounded medians make uniform scaling mathematically impossible. However, the overlap is too narrow to support a robust measured pass: rounding, pixel resampling, segmentation and pose uncertainty can consume it, and medians do not certify every frame. Such a shrink would also reduce torso/limb dimensions substantially; those independent measurements are missing.

**No measured uniform packScale has been demonstrated to bring head and body segments inside +/-6% simultaneously.** The present evidence supports only a fragile theoretical head/shoe overlap, not whole-body feasibility. No packScale trial or transform was applied by this audit. Any proposed calibrated output requires a fresh exact-atlas audit of all frames, margins, rear reach and independent anatomical segments.

## Disposition

Retain v03 attempt01 as the strongest of the three authorized attempts, on technical HOLD. Preserve all attempts and the exhausted cumulative three-call budget. Outstanding items are frame 03 left-foot margin, frame 04 rear contact strength, measured full-body scale/anatomy, and art-style/user review. This report neither approves the image nor authorizes another generation.
