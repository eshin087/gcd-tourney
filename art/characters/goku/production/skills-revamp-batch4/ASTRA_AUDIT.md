# Goku skills batch 4 — Astra audit

Date: 2026-10-18. Reviewer: GPT-6 Astra, medium reasoning. Branch: `art/goku-skills`.

**Overall verdict: HOLD. The exact quantized candidate-atlas audit is blocked by the strict scale gate. No final anatomy/scale certification or scaleManualQA is issued.**

The parent worker reports that `node tools/pack-sprites.mjs goku --candidates --quantize 48` exited 1, explicitly wrote no candidate atlas, and rejected all three v01 strips for missing per-version scaleManualQA in the known Goku head-probe path. Reported source factors are specialUp 0.366, throw 0.316, intro 0.305. These are packer inputs reported by the parent, not independently measured anatomical ratios. I did not rerun or bypass that gate. Existing published atlases/cached frames cannot stand in for these candidates.

## Exact source inventory

All three source strips are 2172 x 724. SHA-256 values were read directly from these files during this audit.

| Source under `art/characters/goku/raw/` | Frames | Requested bodyHeight | SHA-256 | Final verdict |
|---|---:|---:|---|---|
| `specialUp_v01.png` | 6 | 214 | `9C664A4B11F7D7AC1E9D6CA4331878EF5E3C05036FA811F4E21566087D48BF44` | HOLD |
| `throw_v01.png` | 4 | 201 | `A70D621CB6CACD8BBBB3F78FF38F48BDB729FD424C391D3AEEB5AB3E53F2E09D` | HOLD |
| `intro_v01.png` | 4 | 210 | `03A16F4F1476888B7C0CEC83799C5DD2E2E60127AE00544353607D0DDF2455C4` | HOLD |

References visually inspected:

- `art/characters/goku/reference/idle_approved.png`, SHA-256 `57FBBD3CB99FC92A30DAFDD478479971E4E9D497E035C846E9FD28ECB126FE03`.
- `art/characters/goku/reference/title_style_lineup_v02.png`, SHA-256 `7CD53F5CFF685FD50408C9B2B268996FC387CFA7203D9F1D0165222E1FA3D415`; contains Goku neutral/combat and the approved cast neutral cells. Its printed Goku body/hair measurements are reference annotations, not measurements of these candidates.
- Contract read: `art/scale/title-style-pilot/PRODUCTION_CONTRACT.md`. Equal pixel density, full-body anatomy, separate hair/clothing/posed bounds, and actual quantized atlas inspection remain mandatory.

## Preliminary raw-source visual assessment only

Frames below use zero-based indices. Every source pose was inspected; tool display resized the three raw strips to 2048 x 683, so this assessment is not a native-pixel measurement. No head, torso, arm-chain, leg-chain, or shoe percentage is certified. Head tilt, joint occlusion, clothing volume and foreshortening prevent reliable segment comparisons from these views alone.

### specialUp v01 — HOLD

- f0/f1: coherent right-facing guard and deeper crouch; adult muscular arms, orange gi and boots retain the reference identity. Knee flexion explains shorter occupied bounds; do not stretch these to standing height.
- f2/f3: raised straight kick and trailing/tucked opposite leg are readable. Hair/head angle shifts backward with the torso. The raised trouser leg obscures pelvis and upper-leg joints, so leg length and hip construction are unresolved rather than passed.
- f4/f5: knees-to-chest silhouettes read as tucked airborne poses; f5 has clasped hands above the head. Torso and leg chains are heavily occluded. The intended forward rotation is not established by static frames alone; check transition into the approved airHeavy animation in playback.
- No obvious additional complete limb is visible at this display scale. That observation does not clear hands, joint construction, packed clipping or contact reach. Source silhouettes alone cannot establish consistent head/torso/limb/shoe scale against idle.

### throw v01 — HOLD

- f0/f3: airborne bent-knee preparation/recovery with open hands. Both boots and knee silhouettes are readable; tucked limbs substantially hide the actual thigh/shin lengths.
- f1/f2: clear rightward extended palm and opposite bent arm. Shoulder-to-wrist silhouette is coherent, but extension/foreshortening and sleeve overlap need packed comparison against the idle arm chain. Hand shape must be checked after quantization.
- Golden hair, blue undershirt/belt/boots and muscular build visually match the reference family. No gross detached limb is apparent. Hip/leg anatomy, clothing volume and shoe-size consistency remain unmeasured.

### intro v01 — HOLD

- f0/f1/f2: broad grounded stance with clenched fists and upward screaming face. Body/outfit silhouettes are visibly similar across these three frames while hair changes black to gold. Hair-inclusive bounds are not skull/body height evidence.
- f3: right-facing guard clearly recalls the approved idle/combat pose. Neck, shoulders and bent arms change with the guard; exact torso length, shoulder width, head size and shoe scale are not measurable to the acceptance tolerance from this display.
- No obvious extra or missing complete limb is visible. The black-to-gold transition is intentional per the saved generation prompt; this audit does not approve that design or certify animation timing.

## Required completion evidence

Resolve the gate through the project's authorized tooling/manual-QA process without treating this report as a manual pass. Produce an identifiable actual 48-color candidate atlas, recording its hash and exact per-strip v01 source mapping. Astra must then inspect all 14 packed frames at native size beside approved idle and title-style neutral/combat references at equal density, including head, torso, both arm/leg chains, build, clothing and footwear with measurement uncertainty. Check clipping, cell boundaries, grounding, transition/playback continuity and relevant contacts. A later pass applies only to the atlas and source hashes actually audited; image approval remains the user's decision.

No candidate/source image, manifest, approval state or packer setting was changed by this audit. No additional generation was requested.
