# Goku batch 4 v01: final quantized-atlas audit

2026-10-18 — GPT-6 Astra, medium. Scope: intro v01, throw v01, specialUp v01 only. **All three: HOLD for unresolved head-scale certification. Visual anatomy and cell containment pass, subject to pose/occlusion uncertainty.** No exemption or art approval is granted. User approval via relay goku-skills #14 remains intact.

## Exact evidence

- Atlas: `public/characters/goku/sheet.png`, SHA256 `01a3863997d08571e609ad376a15de85d0a33bd7bba668fab171fa1969cf46f2`.
- Metadata: `public/characters/goku/anims.json`, SHA256 `dc86a4e4dacab10a0bcd9696f69c89a3d6594ebfeba41a81f60908aaa24ef301`.
- Reference: idle v02, atlas cell 0; visually compared with `art/characters/goku/reference/title_style_draft_v02.png` and the title-style production contract. The neutral/combat reference is a qualitative anatomy baseline; its raw magenta cell is not treated as having the same packed scale as this atlas.
- Direct atlas extraction at native density and nearest-neighbor enlargement; all 14 cells inspected. Bounds below are exact alpha extents `[left, top, right-exclusive, bottom-exclusive]` within each 256px cell. Idle cell 0: `[55,28,205,241]`.
- BodyHeight settings: intro 213, throw 211, specialUp 257 (236px cell cap). These are settings, not measured anatomical heights.
- Claude-supplied garment B: intro .99–1.03; throw .99–1.03; specialUp standing .91–.97, kick 1.07–1.09, tuck .77. These values are corroborating evidence from the handoff, not independently remeasured segment lengths and not numeric anatomy passes.

## Every frame

| Strip/frame (cell) | Alpha bounds | Visual finding |
|---|---|---|
| intro f0 (110) | 57,48,202,241 | Black hair transformation start, upturned head; chest, arms, wide stance and boots coherent. Hair silhouette differs intentionally from gold idle. |
| intro f1 (111) | 57,45,202,241 | Gold hair, open mouth and extended neck; torso, waist, thighs and boots consistent with f0. |
| intro f2 (112) | 57,50,202,241 | Similar raised-chin effort pose; no detached extremity, inflated shoulder or collapsed torso. |
| intro f3 (113) | 56,47,204,241 | Guard recovery, chin lowered and fists raised; build/clothing remain coherent with idle. |
| throw f0 (92) | 66,47,213,241 | Airborne bent knees, arms opening; leg folds explain shorter bounds. Head/torso/boots intact. |
| throw f1 (93) | 73,59,223,241 | Rightward palm extension and bent rear arm; shoulder-elbow-wrist chain coherent, hips and two bent legs identifiable. |
| throw f2 (94) | 81,55,225,241 | Extension held; neck and face angle change without obvious gross size jump. Boots and leg chains remain complete. |
| throw f3 (95) | 74,48,206,241 | Arm retracts, knees remain bent; torso volume and outfit continuous. No stretched limb or broken hand connection. |
| specialUp f0 (125) | 56,73,207,241 | Low ready stance; chest/waist compressed by crouch, two full leg chains and boots visible. |
| specialUp f1 (126) | 76,97,194,241 | Deeper crouch; forward torso tilt and folded legs account for lower/shorter silhouette. |
| specialUp f2 (127) | 43,5,187,241 | Raised vertical kick, extended lower leg and lowered supporting leg; boot/hip connections readable. 5px top margin, no clipping. Torso foreshortened. |
| specialUp f3 (128) | 34,20,176,241 | High kick with other leg bent; bulky trouser silhouette follows the bend. Two leg chains discernible, no obvious duplicated limb. |
| specialUp f4 (129) | 82,92,175,241 | Tight tuck; arms overlap knees and torso is substantially occluded. Low garment B is compatible with overlap; hidden segment lengths cannot be certified. |
| specialUp f5 (130) | 101,38,186,241 | Hands clasped overhead, legs tucked; both arms and boots present. Head partly enclosed by arms/hair. No truncation at cell edges. |

## Sequence and limits

Intro is a 4-frame loop at 150ms each. Its f3→f0 reset changes the gold guard back to black-haired powering-up stance; that visible reset is part of the approved sequence and is not treated as a new anatomy defect. Throw and specialUp are non-looping; consecutive poses and recovery transitions were reviewed as ordered atlas frames. Runtime playback, contact/hurtboxes and floor placement were not tested by this audit.

Facing remains predominantly screen-right in all three strips, including the upward-looking kick frames. The figure build, orange gi, blue undershirt/belt/wristbands/boots and limb attachments are visually consistent. Every cell is contained with no evidence of a neighboring figure fragment or a severed edge. Alpha bounds establish containment, not whether a generator omitted hidden anatomy.

**Head scale is unmeasured, not passed.** The known Goku automatic head probe is untrusted. Hair transformation, upward pitch, open jaw and arm/torso occlusion prevent a common skull landmark set across these frames and idle. Even a manual face endpoint estimate has roughly ±3–5 native-pixel uncertainty; that is too large to certify a tight percentage tolerance. Hair-inclusive silhouette bounds are not a substitute. No numeric head ratio or ±6% segment pass is claimed. Hidden torso/limb lengths in specialUp f4–f5 likewise remain uncertain; no visible gross anatomical failure was found.

The three version-bound `scaleManualQA` records therefore retain **hold**, with visual anatomy and containment findings explicitly separate. Clearing the hold requires a defensible head measurement method or the user's explicit acceptance of this unmeasured limit; no exemption was added. No redraw is prescribed from these findings alone. Public atlas/metadata, approvals, bodyHeight and all other animation entries were left unchanged.
