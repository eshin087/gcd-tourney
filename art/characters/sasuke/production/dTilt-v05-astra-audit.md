# Sasuke ENG-112 dTilt v05: final atlas audit

Date: 2026-10-18. Auditor: GPT-6 Astra, medium. Branch: `art/normals-sasuke`.

**PASS for visual anatomy, complete-frame assembly and drawn LOW contact. HOLD for any claim of certified intrinsic limb/torso/shoe tolerance or runtime contact/timing.** This is a technical visual finding, not user approval. No source art, sidecar, manifest or atlas was changed by this audit.

## Exact evidence

- Candidate `art/characters/sasuke/raw/dTilt_v05.png` is byte-identical to selected `_qa_hold/dTilt_v05_attempt03.png`: SHA-256 `a5c6a920847732f086810b498f8b79c15b9c82bc46f6d44b2554102706932123`.
- Sidecar `raw/dTilt_v05.json`: `anatomy.measurement = auto-head`; SHA-256 `8c2879f0f010fd12accbaedcc5d41442d01e3f81d032b991e3595b1d22133f0a`. This specifies measured head fitting; it does not independently measure the rest of the body.
- Actual `public/characters/sasuke/sheet.png`: SHA-256 `aa294ba6423f228588853b2e92fc78778ebf650f1ff03dfa4ad4e56405ac653c`.
- Actual `public/characters/sasuke/anims.json`: SHA-256 `9334a63dbe58990a7e83675e1dd627197db3f835bd7a3b234bb1efd745713837`.
- Compared all six atlas cells 181–186 directly with `public/art-review/title-style-pilot/sasuke-neutral_v01.png`, `sasuke-combat_v01.png`, and current atlas idle f0, at identical pixel density and at nearest-neighbor 2x enlargement. The approved cells and `art/scale/title-style-pilot/PRODUCTION_CONTRACT.md` are the controlling references. Raw strip also inspected for correspondence and assembly errors.
- Diagnostic contact sheet (scratch, not shipped art): `E:/Vibe Coding/.codex/visualizations/2026/10/18/01a14c8c-4884-7102-a8e0-efa63fbe6bb6/sasuke-dtilt-v05-audit.png`.

## Every-frame findings

Bounds below are exact occupied-alpha bounds `(left, top, right-exclusive, bottom-exclusive)` in the actual 256px atlas cell. Head ratios are the recorded packer probe versus idle, not intrinsic skull measurements.

| Frame / atlas | Bounds | Head ratio | Visual finding |
|---|---|---|---|
| f0 / 181 | 77,71,182,241 | .970 | Ready stance; slender torso, two complete arms and legs; sheathed sword visible behind waist. |
| f1 / 182 | 80,110,182,241 | 1.008 | Drops into squat; knees flex and torso leans; head and clothing do not inflate to compensate for reduced pose height. |
| f2 / 183 | 90,117,213,241 | .986 | First active frame lifts/extends lead foot; heel-to-toe diagonal in front, below knee/chest level; support foot remains grounded. |
| f3 / 184 | 70,118,216,241 | .988 | Second active frame is full low extension; continuous hip-to-knee-to-ankle chain, no detached foot or cut at frame boundary. |
| f4 / 185 | 73,117,214,241 | 1.000 | Early recovery retains extension with slight settling; no new limb or visible proportion pop. |
| f5 / 186 | 81,112,172,241 | .974 | Retracts to deep crouch; both legs readable; upright idle return is a pose transition, not a demonstrated scale change. |

All soles reach y240. No occupied pixel touches the left/right cell boundary. The lower 123–131px posed heights of f1–f5 versus f0 170px are legitimate crouch compression; do not resize them to the 209px neutral occupied height. Approved combat occupies 180px and atlas idle 177px.

## Full-body comparison and uncertainty

- **Head:** complete, visually consistent hairstyle/face across all frames and with both title cells. Probe .970–1.008 is inside the assigned .97–1.03 envelope. Hair-included probe boxes range 35–37px wide and 36–40px high. These are segmentation boxes, not skull lengths; crown landmark uncertainty in the contract remains applicable.
- **Torso/build:** open white shirt, narrow waist, purple rope and dark hip drape remain consistent. Shoulder-to-waist projected lengths visually remain roughly 35–45px, with approximately ±5px endpoint uncertainty from collar, lean and rope occlusion. No obvious stretched chest or enlarged shoulders. This estimate does not certify a percentage tolerance.
- **Arms:** fists stay in guard; elbows/sleeves overlap the torso and foreshorten substantially. Both visible arm chains are continuous, and sleeve/cuff volume does not visibly jump. Hidden shoulder/elbow landmarks prevent an independent intrinsic upper/lower arm length measurement; no numerical arm pass claimed.
- **Legs:** f2 transitions a bent leg into f3/f4 horizontal extension; the support knee remains deeply bent. Trouser mass remains concentrated around the upper legs, with narrower shins, consistent with reference clothing. Hip and knee centers are hidden by cloth; intrinsic thigh/shin ratios are not independently certified. A projected straight extension cannot be compared numerically with a bent reference bounding box.
- **Shoes:** coherent sandals/ankle wraps in every cell; no visible oversized sole. Raised active-foot contour is rotated relative to reference grounded footwear. Packer feet-color proxies are 1.330,1.199,1.195,1.305,1.224,1.292. Per contract these are square-root matching-color areas, not shoe length ratios; they neither certify nor alone disprove footwear anatomy. Numerical intrinsic shoe tolerance remains unverified.
- **Clothing/identity:** white open shirt, dark hair, purple rope belt, dark trousers, sandals and sheathed sword persist; no drawn blade, duplicate limb, or sudden silhouette/build change found. No separate quantitative garment-area measurement was made in this audit.

## Contact and sequence

The atlas specifies six frames, phases [2,2,2], durations [35,30,50,50,50,30] ms and loop=false (245ms total). Active frames are f2/f3. Visual toe/contact landmarks are approximately (209,207) and (211,217), respectively, ±4px, in cell coordinates: 29–39px above the y240 ground and 81–83px in front of pivot x128. Both read as shin-height contact in front of a standing opponent. f2 is less extended; f3 gives full reach. These are hand-read drawn landmarks, not verified collision-box centers.

Sequence inspection covered every frame in order and the f5-to-idle/f0 boundary. Recovery stays low then rises; the full kick silhouette persists into the first recovery frame f4. That is compatible with the recorded phase allocation, but temporal smoothness, interrupt behavior, target reach and actual hit/hurtbox overlap require Claude runtime review. No browser playback or in-game contact test was performed here. This non-looping attack must not be described as a verified seamless animation loop.

**Recommendation:** retain v05 as visually reviewable; do not redraw or rescale it solely on crouch bounds or feet-area proxy. User drawing approval remains separate. Keep intrinsic numerical tolerance and runtime contact/timing explicitly unverified until measured/reviewed by their owners.

## Garment-area advisory

The coordinating worker reports body-sheet B=.73 against idle for v05. This is below the assigned .93-1.07 envelope. B is a garment-area proxy; crouch overlap, guarded arms and folded legs reduce visible area. The direct cell inspection above found plausible compression but does not numerically explain away the .73 result. Treat B as an unresolved advisory and retain HOLD on a full quantitative body-scale pass; segment measurements or a documented pose/occlusion explanation are needed. No threshold or exemption was changed.

