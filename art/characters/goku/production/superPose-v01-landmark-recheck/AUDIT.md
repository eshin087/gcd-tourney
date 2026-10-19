# Goku superPose v01: version-bound landmark recheck

**Verdict: FAIL TO CERTIFY (technical result: hold).** The concrete failure criterion is unmet measurement evidence: covered crown/joint endpoints cannot establish all required anatomical dimensions within +/-6% of idle f0, and the quoted absolute footwear bounds are not reproduced in this exact atlas. This is not a demonstrated anatomical defect. The visible design, torso, and broad build are compatible with idle f0; the garment proxy agrees with Claude. This audit does **not** substantiate the supplied absolute boot dimensions, or certify every anatomical segment within +/-6%. Some endpoints are hidden by hair, sleeves and trousers, and footwear bounds change with orientation. This is an evidence/measurement hold, not a conclusion that a redraw or rescale is required. No art approval is granted or withdrawn here.

**Motion: separate HOLD retained.** The frames have subtle contour changes, but also substantial internal redrawing. They do not establish a clean, controlled 1-2 px tremble solely from their packed pixels. See motion results below.

## Exact input and method

- Source: `feature/goku-skills` commit `3120d514`, `public/characters/goku/sheet.png` and paired `anims.json`, extracted with `git show` because the supplied other sandbox's Temp folder was unavailable here.
- Atlas SHA-256: `8a77c8ebcb6690e5afc8d6a892b5a492f9b9c83017f55c7d45ecf3a62f097876` (verified).
- Idle f0: cell **0**. superPose v01 f0/f1/f2/f3: **110/111/112/113**, verified in paired metadata. Four 140 ms frames, loop true (560 ms loop).
- 256 x 256 cells, 16 columns, pivot [128,240], 128 pixels/unit. No resizing, repacking, fitting, or calibration was performed. `bodyHeight: 226` is supplied packing context, not a measured standing skeleton in this posed sprite.
- All coordinates below are **cell-local, zero-based and inclusive**. Width/height of a bbox = max-min+1. Screen-left and screen-right refer to the image, not an inferred anatomical side.
- `native-contact.png`: idle f0 directly above every candidate, artwork pasted at **1 source pixel = 1 output pixel**. `coordinate-guide.png` is an auxiliary native-scale coordinate grid, not the clean contact evidence. `cell-*.png` are lossless atlas crops.
- Exact palette measurements and pixel differences are reproducible. Anatomical estimates are marked with uncertainty; a covered endpoint is **not measurable**, even where a plausible search box is provided. They must not be converted into a numeric pass.
- Scope: requested comparison to approved idle f0. This does not independently reapprove idle against the original title-style reference lineup or certify runtime contacts.

## Head, torso and limbs: visible landmarks

Visual review at equal pixel density finds consistent face/neck identity and muscular build. The head is tipped differently; the hair is visibly shorter in its vertical projection. The raised arms uncover the torso and change shoulder exposure. Pants conceal hip, knee and most shin endpoints.

| Landmark / metric | Idle f0 | superPose f0 | f1 | f2 | f3 | Interpretation / uncertainty |
|---|---|---|---|---|---|---|
| Head crown under hair -> chin | Estimated crown search x137-146,y58-64; chin x141-150,y78-86 | Crown x118-128,y63-69; chin x126-140,y78-86 | Same search boxes +/-1 px | Same search boxes +/-1 px | Same boxes +/-2 px | Approx. 22-28 px projected crown-to-chin length; the candidate is more tipped back; crown is covered, **not measurable** as an exact anatomical segment. About +/-5 px, too wide for a +/-6% certification. Hair tips are not crown. |
| Hair top / chin vertical extent | Hair top about y28; chin y78-86 | Hair top about y47; chin y78-86 | Hair top about y46; chin y78-86 | Hair top about y47; chin y78-86 | Hair top about y46; chin y78-86 | Approx. 51-59 px versus 32-41 px **hair-inclusive projection**, +/-2 px hair boundary. Tilt/spike silhouette differs; do not use this as skull scaling. |
| Neck base / collar -> upper sash | Collar near (135,91), sash near (128,121) | Collar near (130,94), sash near (129,124) | Within 1 px of f0 | Within 1 px of f0 | Within 2 px of f0 | Projected centerline roughly 30-32 px, +/-4 px from collar/belt definition. Compatible torso length, not a tight numeric pass. |
| Torso garment envelope, excluding raised/bent arms | Approx x97-160,y79-129 | Approx x97-159,y84-132 | Approx x98-160,y84-132 | Approx x97-160,y84-132 | Approx x98-161,y84-132 | Width about 63-64 px; height about 49-51 px; +/-3 px at sleeve/shoulder boundary. Similar exposed garment envelope; different shoulder pose. |
| Screen-left upper arm, shoulder -> elbow | Shoulder near (103,91), elbow near (92,113); projected 25 px | Shoulder near (101,89), elbow near (88,72); projected 21 px | Approx same +/-1 px | Approx same +/-1 px | Approx same +/-2 px | Joint centers covered by sleeve or inferred from bend; +/-5 px. **Not measurable** as bone length. These are landmark search centers, not evidence of a 16% shorter humerus. |
| Screen-left forearm, elbow -> wrist | (92,113) -> (110,111), about 18 px | (88,72) -> (75,52), about 24 px | Approx same +/-1 px | Approx same +/-1 px | Approx same +/-2 px | Idle forearm is strongly foreshortened/partly hidden by fist/cuff; +/-4 px. Visible outline is plausible; **not measurable** as matched anatomical length. |
| Screen-right upper arm, shoulder -> elbow | (156,98) -> (178,114), about 27 px | (156,88) -> (169,72), about 21 px | Approx same +/-1 px | Approx same +/-1 px | Approx same +/-2 px | Shoulder center covered, perspective differs; +/-5 px. **Not measurable** as matched anatomical length. |
| Screen-right forearm, elbow -> wrist | (178,114) -> (174,96), about 18 px | (169,72) -> (182,52), about 24 px | Approx same +/-1 px | Approx same +/-1 px | Approx same +/-2 px | Idle bends toward viewer and cuff obscures endpoint; +/-4 px. **Not measurable** as matched anatomical length. |
| Screen-left thigh / shin | Hip search (120-132,132-144); knee (87-100,169-181); cuff (74-86,195-204) | Hip (119-132,133-145); knee (91-104,172-184); cuff (76-90,199-209) | Same boxes +/-1 px | Same boxes +/-1 px | Same boxes +/-2 px | Loose trouser folds do not locate knee or hip joint. **Not measurable**; no thigh/shin pass. Silhouette remains compatible with the wider/lower stance. |
| Screen-right thigh / shin | Hip (133-144,133-145); knee (164-177,157-172); cuff (168-185,195-204) | Hip (132-144,135-147); knee (157-171,171-184); cuff (164-181,199-209) | Same boxes +/-1 px | Same boxes +/-1 px | Same boxes +/-2 px | Joint placement is inferred beneath cloth. **Not measurable**; no thigh/shin pass. Projected knee position changes with stance. |

These manual search boxes are deliberately broader than the artwork's one-pixel contour edges. They record the actual uncertainty of assigning anatomy beneath cloth/hair; pixel-exact silhouette coordinates do not remove that uncertainty.

## Garment area: exact independent cross-check

Recomputed using `3120d514:art/scale/builds.json` Goku `bodyColors`, opaque alpha >127, Euclidean RGB distance <=8, matching the body-sheet definition. B = sqrt(candidate matched-color area / idle matched-color area).

| Cell | Matched-color area (px) | B |
|---|---:|---:|
| idle 0 | 5105 | 1.000000 |
| superPose f0 / 110 | 5008 | 0.990454 |
| f1 / 111 | 4961 | 0.985795 |
| f2 / 112 | 4991 | 0.988771 |
| f3 / 113 | 5014 | 0.991047 |

**Agrees with Claude's 0.985-0.991 range**, allowing rounding. This exact pixel count has no sampling uncertainty, but its interpretation as body size is advisory (the project documents approximately +/-10% pose sensitivity). The selected colors also occur in hair and footwear outlines: e.g. the idle mask reaches y32 and y239. It is not an isolated anatomical torso area and does not certify hidden limb lengths. `garment-measurements.json` preserves these values and mask bboxes.

## Boots: separate left/right measurements

The clearest repeatable automatic boundary here is the **blue boot fill**, deliberately excluding dark outline, orange/red trim and sole. Mask: opaque pixels with R<50, G>25, B>90, y>170, split at x128. Inspection confirms these blue regions are footwear. Bounds below are exact for that defined mask, not full-boot dimensions.

| Cell | Screen-left blue bbox [xmin,ymin,xmax,ymax] | W x H | vs idle left W/H | Screen-right blue bbox | W x H | vs idle right W/H |
|---|---|---:|---:|---|---:|---:|
| idle 0 | [57,199,84,237] | 28 x 39 | 1.000 / 1.000 | [167,201,203,233] | 37 x 33 | 1.000 / 1.000 |
| 110 | [56,202,87,237] | 32 x 36 | 1.143 / 0.923 | [164,204,200,237] | 37 x 34 | 1.000 / 1.030 |
| 111 | [56,203,89,237] | 34 x 35 | 1.214 / 0.897 | [165,204,201,237] | 37 x 34 | 1.000 / 1.030 |
| 112 | [56,204,87,238] | 32 x 35 | 1.143 / 0.897 | [165,204,201,237] | 37 x 34 | 1.000 / 1.030 |
| 113 | [57,204,89,237] | 33 x 34 | 1.179 / 0.872 | [165,204,202,237] | 38 x 34 | 1.027 / 1.030 |

Full boot, including outline/trim/sole, has an oblique trouser-to-boot boundary. Manual conservative bounds:

| Cell | Left full boot approximate bounds / dimensions | Right full boot approximate bounds / dimensions |
|---|---|---|
| idle 0 | x55-88, cuff top y196-199, bottom y240; **34 +/-2 wide, 42-45 high** | x165-204, cuff top y198-201, bottom y235; **40 +/-2 wide, 35-38 high** |
| 110 | x54-90, cuff top y199-202, bottom y240; **37 +/-2 wide, 39-42 high** | x162-202, cuff top y201-204, bottom y239; **41 +/-2 wide, 36-39 high** |
| 111 | x55-91, cuff top y200-203, bottom y240; **37 +/-2 wide, 38-41 high** | x163-202, cuff top y201-204, bottom y239; **40 +/-2 wide, 36-39 high** |
| 112 | x54-90, cuff top y201-204, bottom y240; **37 +/-2 wide, 37-40 high** | x163-202, cuff top y201-204, bottom y239; **40 +/-2 wide, 36-39 high** |
| 113 | x55-92, cuff top y201-204, bottom y240; **38 +/-2 wide, 37-40 high** | x163-202, cuff top y201-204, bottom y239; **40 +/-2 wide, 36-39 high** |

Manual full-boot width endpoint uncertainty is +/-2 px (shading/trim at diagonal cuff); cuff height interval is explicit. Width includes projected toe/shaft envelope. The left boot is angled further outward than idle, so increased projected width and reduced projected height do **not** directly prove an enlarged or shortened boot. The right boot dimensions are compatible. Nevertheless, this evidence cannot honestly certify both boots' every dimension within +/-6%.

**Disagrees with Claude's absolute 52-56 / 49-50 px heights and 49-55 / 49-51 px widths at native scale.** Those values are not reproduced by the boot fill or manually delimited full boots in this exact atlas. Including trousers, a different coordinate scale, or a different measurement axis may explain the discrepancy, but none is established here. Request their exact endpoints/metric before using those numbers as clearance. Do not rescale this candidate based on this disagreement alone.

## Four-frame loop / tremble

- Whole occupied bounds (exclusive max as returned by PIL): f0 (51,33,205,241), f1 (52,33,205,241), f2 (51,33,205,241), f3 (52,33,205,241). This is a 1 px leftmost-hand change; common top and floor bounds remain locked. It is not evidence that every internal landmark moves by 1-2 px.
- Distinct RGBA pixels per successive transition including closure: **7094, 6726, 7352, 7937**. Many are interior shading changes, not displaced silhouette.
- Best global integer registration in [-3,+3] px for each axis minimizes differences at (-1,0), (0,0), (-1,0), (+1,0), respectively. Even then **6829, 6726, 6985, 6806** pixels differ. Thus this is not simply a rigid 1 px shake of a fixed drawing.
- Head ROI [93,43,150,98) alpha XOR counts per transition: **67,69,153,159**. Internal RGBA changes: **1354,1314,1506,1548**. Hair/face redraw is appreciably stronger on the final two transitions.
- Legs ROI [52,134,205,241) alpha XOR: **236,114,216,362**; internal RGBA changes: **3566,3367,3575,3929**. Closing transition has the largest silhouette and texture change in this ROI.
- The images support small pose fluctuations and near-locked outer bounds, but the intended *subtle tremble* is a temporal quality requirement. No runtime playback was performed in this audit. The pre-existing motion hold remains; coordinate bounding boxes and raw difference counts alone cannot clear perceived wobble/flicker. Claude should inspect the actual 140 ms loop and its f3->f0 closure at gameplay scale.

## Handoff

Technical conclusion: **FAIL TO CERTIFY (result: hold)**, with consistent broad visual build and a corroborated garment proxy. Hidden segments remain unmeasured; native footwear measurements do not reproduce the quoted cross-check. No generation, calibration, repacking, user approval, staging or commit performed. User's prior visual approval via goku-skills relay #3 remains historical approval evidence, distinct from this technical finding. Parent records the result and coordinates any endpoint clarification / motion review with Claude.

## Manifest-ready recommendation

```json
{
  "result": "hold",
  "verdict": "FAIL TO CERTIFY",
  "asset": "superPose",
  "version": 1,
  "atlasSha256": "8a77c8ebcb6690e5afc8d6a892b5a492f9b9c83017f55c7d45ecf3a62f097876",
  "cells": [
    110,
    111,
    112,
    113
  ],
  "referenceCell": 0,
  "failureCriterion": "Required +/-6% anatomy evidence is not established: crown/joint endpoints are covered and not tightly measurable; quoted absolute footwear bounds are not reproduced in this atlas. No true anatomical defect is proved.",
  "motionResult": "hold",
  "motionReason": "Controlled subtle 1-2 px tremble is not objectively cleared; existing motion hold remains."
}
```

Recommendation only: adapt to the actual scaleManualQA schema; this audit does not edit the manifest.
