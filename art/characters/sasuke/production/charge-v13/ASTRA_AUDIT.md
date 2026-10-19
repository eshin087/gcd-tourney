# Sasuke charge v13 — final Astra packed-atlas audit

Date: 2026-10-18 local. Verdict: **TECHNICAL HOLD; not image approval.**

## Exact subject

Worktree: `E:\Vibe Coding\Claude Code\gcdTourney\.worktrees\art-charge-sasuke`, branch `art/charge-sasuke`.

- Packed `public/characters/sasuke/sheet.png` SHA256: `94bf18b745df85bc6749ad989bb44e8aab5bbb9980ac0ea46a38aa54fe0d8522`.
- Packed `anims.json` SHA256: `1b2309ace3aaa0430ebf69960c91cc28bdf917b55b21844facce3632f2a330bc`.
- Examined actual atlas cells 115–120 (charge f0–f5), idle f0 cell 0, and exact `public/art-review/title-style-pilot/sasuke-neutral_v01.png` / `sasuke-combat_v01.png`, all at equal density.
- Verified metadata: durations 70/90/110/110/110/110 ms, `loopFrom: 2`, `loop: true`, 256px cells, 16 columns. Parent supplied the v13 raw/fit provenance: measured fit 0.846, head probe 1.002, feet probe 1.086 and garment B 0.82–0.84 (median 0.83). These probe values are context, not substituted for the manual audit.
- No raw, manifest, approval record, public output or animation contract was changed by this audit. No pack/build/game test was run. No `scaleManualQA` pass is warranted.

## Main finding: head agreement hides a smaller lower body

At native equal density the head and central torso remain broadly comparable with idle and the approved combat cell, but the hips-to-floor span, trouser legs and shoes are visibly reduced. The approved combat cell and current idle have closely comparable long, broadly spread legs. The candidate's low stance does not by itself explain all of the shortened lower-leg and footwear geometry. This is a hold requiring an anatomy repair or stronger pose evidence, not an excuse to scale the entire figure up (which would enlarge its already comparable head).

`manual-segment-landmarks.png` records the actual selected landmarks. These are projected 2D garment/joint estimates, **not true anatomical bone lengths**. Joint placement uncertainty is approximately +/-3px per landmark, greater at the concealed hip. Foreshortening and loose trousers prevent a precise 3D ratio or a +/-6% certification. Measurements nevertheless independently support the low B warning:

| Measurement | idle f0 px | charge f2 px | candidate / idle | Interpretation |
|---|---:|---:|---:|---|
| Upper chest to belt centre | 36.12 | 35.13 | 0.973 | Central torso length broadly retained; width changes with turn/arm occlusion |
| Screen-left hip–knee–ankle chain | 91.24 | 66.67 | 0.731 | Large projected shortening; cannot certify anatomy preservation |
| Screen-right hip–knee–ankle chain | 87.18 | 59.67 | 0.684 | Large projected shortening; cannot certify anatomy preservation |
| Screen-left knee–ankle segment | 33.24 | 22.80 | 0.686 | Visible lower leg also shorter, not merely a narrower stance |
| Screen-right knee–ankle segment | 35.78 | 21.59 | 0.603 | Same concern; uncertain knee under trousers |
| Extended shoulder–elbow–wrist chain | 45.82 | 50.54 | 1.103 | Different pose/foreshortening; no numeric arm pass |
| Screen-left footwear ROI width | 21 | 17 | 0.810 | y228–240 opaque bounds, includes ankle; exact pixels, pose dependent |
| Screen-right footwear ROI width | 34 | 21 | 0.618 | y228–240 opaque bounds, includes ankle; exact pixels, pose dependent |

The folded seal arm is partially obscured and strongly flexed; neither its upper-arm nor forearm bone length is reliably recoverable to +/-6%. Its sleeve and wrist anatomy look plausible but are not quantitatively cleared. Shoulders are turned more frontally/narrowly than idle, so silhouette width alone is not used as a failure. Head size is visually comparable; head probe success is not full-body success. Garment B is below this charge brief's 0.93–1.07 target, and the manual evidence does not resolve that warning as a harmless color/pose probe error.

The feet probe 1.086 must not be read as shoes being 8.6% too large: it is a matching-color area-derived metric. Direct footwear bounds here are smaller. Do not add a manual exemption to clear the actual body discrepancy.

## Every frame

| Frame | Observation and disposition |
|---|---|
| f0 / 115 | Gather is lower (opaque top y97 versus hold y89), with hand pulled toward chest and narrower base. Both feet reach y239/240. Outfit and sword-hilt cue are consistent. Same reduced lower-body concern; crouch height itself is not a failure. |
| f1 / 116 | Release raises head/torso and sets right-hand two-finger seal before the face. Left fist drops beside/back of the body. Reads as gather-to-seal, but mouth does not clearly become an open shout. Reduced leg/shoe scale persists. |
| f2 / 117 | Held reference: seal and clenched fist readable; torso/head comparable, legs compact. Floor at y240. Hold for scale and insufficient visible power-up expression. |
| f3 / 118 | Same pose and placement within roughly 1–2px by visual landmarks. No clear chest/shoulder lift or widest shout distinguishable. Redrawn interior pixels throughout body, not a clean isolated breath. |
| f4 / 119 | Same compact anatomy. No clear separate forearm/fist strain beat; small pixel changes exist, but no convincing intentional motion progression. |
| f5 / 120 | Head top y90, other hold frames y89. Placement remains stable; no obvious reset pop to f2 in static registration. No clearly drawn settle phase or fourth cycling cloth shape. |

## Registration, movement and pose

- **Floor registration: acceptable within the revised 1–2px outline tolerance.** f2–f5 left shoe bounds all x78–94 and right shoe x160–180 within y228–240. Left floor contact x78–94 (f5 ends x93); right floor contact alternates start x167/168 through x180. No whole-foot translation or floor-height bounce. Floor differences are redrawn pixels, not evidence of a large slip.
- **Head, knees, hips, seal and left fist placement:** visual inspection of all four hold cells finds no gross positional drift; approximate landmarks stay within 1–2px. This is a visual estimate, not a segmented centroid computation. Head crown changes y89 to y90 at f5. The seal remains at the face and left fist stays by the thigh. There is no large loop spasm in these static registration checks.
- **Requested breathing/updraft: HOLD.** The four poses are almost identical in silhouette and expression. There is no readily legible 1–2px chest/shoulder heave or four distinct cycling hair/cloth forms. Pixel differences are widespread interior redraws: f3/f4/f5 differ from f2 in 2768/2826/2541 RGBA pixels. Their feet bands differ in 265/246/252 pixels despite stable bounds. This shows that the cells are not duplicates; it does not establish intentional breathing. Diff masks in `loop-differences.png` expose the distributed texture changes. No browser playback was performed; the supplied timed GIF is reproducible inspection evidence, not a claim of in-game QA.
- **Power pose:** two-finger seal before chin is readable; exact handedness is inferred from the 3/4 pose, not independently proven. Left hand reads as a closed fist. His pose is tense but expression reads controlled/closed or very narrowly open rather than the requested shouting Sharingan glare. Eye detail is too small to certify Sharingan design.
- **Sword:** visible short hilt emerges behind the belt at screen-left consistently in all frames; no unsheathed blade. The complete scabbard is obscured, so exact small-of-back placement cannot be certified. No obvious contradictory exposed weapon placement.
- **Effects:** no visible aura, sparks, lightning, dust or steam baked into these cells. Pass for the no-effects rule.
- **Outfit/identity:** dark spiky hair, open pale high-collar shirt, purple rope, dark trousers/guards and sandals are consistent through all six frames and recognizable against the approved references. No palette strobe apparent from static inspection.
- **Edges:** actual atlas alpha is binary in idle and all six charge cells (zero semitransparent pixels). Packed outlines are pixel-stepped; source softness is not independently charged as a packed defect. Some quantized interior stipple/redraw remains, especially across the held loop. No clipping or stray detached effect seen.

## Evidence and next action

- `atlas-reference-sheet.png`: actual six cells with idle and exact title-style neutral/combat reference cells, equal pixel density.
- `frame-0.png` through `frame-6.png`: nearest-neighbor 3x idle and charge f0–f5.
- `landmark-grid.png`, `manual-segment-landmarks.png`, `manual-segment-measurements.json`: transparent projected segment audit.
- `geometry-probes.json`: exact opaque footwear/floor ROI bounds. The legacy key `hair` is only an unsegmented ROI containing other body pixels, **not a hair/head measurement**; do not use it as a head gate.
- `loop-differences.png`, `loop-pixel-measurements.json`: exact RGBA differences against f2. Regions overlap and include background; counts are not anatomical movement amplitudes.
- `atlas-timed-loop.gif`: gather/release once, hold repeated five times, then GIF restarts; timing taken from metadata.

Repair the lower-body proportions while preserving the approved head/torso relationship, and make the intended shout/breath/updraft beats legible with planted feet. Repack the repaired candidate and re-audit the exact resulting atlas. Preserve version and cumulative generation budget; Luna owns fixes. **Do not approve v13, exempt its scale warning, or mark it technically ready based only on the automatic head fit.** User design approval remains pending and separate.
