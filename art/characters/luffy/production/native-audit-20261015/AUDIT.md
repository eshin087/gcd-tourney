# Luffy native diagnostic anatomy audit — 2026-10-15

Auditor: GPT-6 Astra, medium. Overall HOLD; no image approvals and no manifest `scaleManualQA` passes assigned. This report supersedes stale/downsampled evidence only for the exact source hashes in [inventory.json](inventory.json). Special remains blocked: the one newly authorized generation attempt was used but its image was not retained. There is no special v02 to audit; no regeneration was attempted here.

**2026-10-15 recovery addendum (Luna, not an Astra re-audit):** the exact third-call image was recovered at `../recovered-special-v02/returned-source.png`. Both panels are guard poses and do not supply the required f6 mid-retraction/f7 upright return. It remains source evidence, not a viable special v02 or an audited candidate. No new call was made. This supersedes only the lost-file status above.

## Evidence and reproduction

Run `node art/characters/luffy/production/native-audit-20261015/render-native.mjs` from this worktree to reproduce the diagnostic, then `node art/characters/luffy/production/native-audit-20261015/measure-landmarks.mjs` for the annotated manual readings. These commands write only this directory. They do not invoke the production pack, modify source art, write public/, change gates, or record exemptions.

Each `*-compare-N.png` contains, left to right: approved title-style neutral, approved combat, current idle f0, then candidate frames N onward. Every displayed cell is exactly 256x256; no comparison row was downsampled. The approved reference crops are source [0,0,724,724] and [1448,0,724,724], each mapped to 256x256. Individual native cells and same-scale `*-unclipped.png` silhouettes are retained beside the comparisons.

The renderer uses the existing manifest bodyHeight, any existing frameOffsets, and the packer's exported background-removal, whole-figure extraction, resampling and foot-anchor placement functions. All requested sources resolve to the exact expected number of whole figures. No per-pose resizing is introduced. Its common 48-color palette is diagnostic: it is not asserted byte-identical to a future production pack, whose selected inventory can differ. No gate was disabled, relaxed or represented as passing. Existing source images and sidecars are SHA256-bound in inventory.json; cell hashes, source-to-native factors, native bounds, lost pixels, and clipping are recorded for every frame.

The source re-render removes the old light3 version ambiguity. It is still not a substitute for the final production atlas audit after Claude's eventual pack.

## Manual body segments

[landmarks.json](landmarks.json) records actual point coordinates; [measured-segments.json](measured-segments.json) records Euclidean projected lengths. `*-landmarks.png` overlays the sampled joints in cyan. These are visible knee-center to ankle-above-sandal and visible neck-base to top-sash measurements, not inferred bone lengths. Endpoint uncertainty is approximately +/-3 native pixels, conservatively +/-6 pixels for a segment. Foreshortening adds systematic uncertainty beyond that band. Hidden skull crowns, hips and upper thighs are explicitly unmeasured.

| Native image | Left / right knee-to-ankle, px | Neck-base to sash, px |
|---|---:|---:|
| Approved neutral | 59.1 / 55.2 | 45.1 |
| Approved combat | 54.6 / 53.8 | 38.8 |
| Idle v01 f0 | 53.3 / 52.6 | 42.8 |
| Guard v01 f0 | 54.4 / 50.0 | concealed by crossed arms |
| Charge v01 f0 | 59.9 / 54.2 | 38.5 |
| Dash v02 f0 | 57.3 / 51.6 | leaning, not certified |
| Dash v02 f1 | 48.7 / 52.4 | leaning, not certified |
| Light3 v02 f0 | 56.0 / 55.7 | not independently measured |
| HurtHigh v01 f0 | not independently measured | 39.3 |
| BeamCharge v01 f0 | not independently measured | 38.3 |
| Light4 v02 f0 / f7 | not independently measured | 40.8 / 43.2 |
| Win v02 f0 | 46.5 / 45.1 | 35.2 |

These readings improve the evidence but do not establish all bilateral segments within +/-6%. Guard/charge/dash visible shin ranges overlap the reference within measurement/projection uncertainty. Light4 f0/f7 torso readings overlap; its old half-sized B section is no longer present. Win f0 projects shorter shins (0.79/0.82 of neutral) and torso (0.78 of neutral), supporting the native-size hold; pose differences and the stated uncertainty still apply. Unmeasured or overlapping intervals are not numeric passes.

## Every requested strip

Occupied heights below are exact opaque bounding-box heights from this diagnostic in frame order. They include hands/hat where applicable and must not be treated as anatomical stature. All frames, intra-strip transitions, and loop endpoints were inspected. A HOLD does not by itself prescribe a redraw.

| Candidate | Heights f0 onward (px) | Native findings and remaining evidence | Verdict; scaleManualQA suitable? |
|---|---|---|---|
| guard v01 | 198,194 | Both intact; clothing/build and shins consistent on native comparison. f1->f0 has modest bend change. Crossed arms hide shoulder/elbow connections and torso start; skull under hat. | Unmeasured HOLD; no |
| charge v01 | 197,198,198,198 | All intact; measured f0 torso/shins overlap approved references within uncertainty. Clothing, headwear and lower-body volume stable. Pink skin f2/f3 resets on f3->f0. Upper-arm/hip landmarks remain insufficient. | Unmeasured HOLD; no |
| land v01 | 130,174 | Complete crouch and recovery. f0 torso strongly foreshortened; f1 remains lower than idle. Native evidence alone does not prove either shrinkage or anatomy equality. | Unmeasured HOLD; no |
| jumpUp v01 | 181,198 | Complete. Hat/arms and tucked f1 legs are now visible natively; bent far leg and covered hip prevent reliable bilateral length comparison. Two-frame loop alternates grounded/tucked poses. | Unmeasured HOLD; no |
| jumpFall v03 | 192,209 | Complete. Hat crown and torso still move vertically by 17px with the lowest sole held at y240; reverse on wrap. Tucked legs and upper thighs remain projection-dependent. | Continuity + unmeasured HOLD; no |
| dash v02 | 160,156 | Both complete; former clipped sandal remains repaired. f0/f1 visible front shins 51.6/52.4px, rear 57.3/48.7px with bending/projection. Trailing arms overlap; stride has position shift on wrap. | Clipping pass only; anatomy unmeasured HOLD; no |
| run v01 | 201,204,201,185,196,193,195,181 | Whole source figures intact. Native foot-anchor placement clips rear extremities: f3 left21px, f4 left32px, f7 left16px. Unclipped same-density silhouettes preserve missing evidence. All other frames readable; wrap includes clipped f7. | Definite placement/clipping HOLD; no |
| light2 v01 | 199,197,196,196,203,203,204 | All complete. f2/f3 straight arm and shoulder rotation, f4-f6 recovery inspected; head/hat and clothing coherent. Shoulder/upper-arm lengths not established across rotation. | Unmeasured HOLD; no |
| light3 v02 | 215,215,215,215,215,215,215 | Correct v02 now inspected, including tucked f4 (old sheet showed extended f4 from another version). Only f3 clips: right8px. f2 and f4 are intact. f0 shins 56.0/55.7px overlap reference. Missing f3 toe/sandal edge blocks full clearance. | Definite placement/clipping HOLD; no |
| airLight1 v01 | 198,178,185,185,198 | All source fists intact; native f2/f3 clip right15px each. Remaining torso/legs coherent, but tucked hips/thighs are occluded. | Definite placement/clipping HOLD; no |
| airHeavy v01 | 198,115,150,186,153,149 | All six native cells intact. f1-f4 tuck/rotate and obscure hips, far shin, torso and shoulder joints. Extended downward arm changes bounds; no uniform-height inference is valid. f5 complete recovery. | Unmeasured HOLD; no |
| hurtHigh v01 | 191,195,187 | All intact. f0 torso 39.3px overlaps combat/idle range. f1 arch and f2 head/body turn preserve readable clothing/build but change projection. | Unmeasured HOLD; no |
| beamCharge v01 | 185,185,198 | All intact; f0 torso 38.3px overlaps combat. Near arm intentionally enlarges; nontransforming head/torso/legs appear coherent. f2->f0 resets enlarged arm. Bilateral body measurements remain incomplete. | Unmeasured + loop HOLD; no |
| light4 v02 | 197,196,200,195,195,201,207,197 | B is no longer half-size; all eight whole figures isolated. f0/f7 torso 40.8/43.2px overlap. Native f4 kicking extremity clips right29px. The full nontransforming anatomy across back/front turns is still unmeasured; prior head-probe conflict is not waived. | Definite placement/clipping + unmeasured HOLD; no |
| win v02 | 212,189,175,210 | All four complete. Current bodyHeight212 divides by max source height896 (factor0.236607); this normalizes away the prior uniform source enlargement. f0 hat-to-sole approximately182px vs approved neutral237.3px; arms explain the taller overall bounds. Measured f0 shins/torso are smaller than neutral. | Native-size HOLD; no |

## Material changes from previous audit

- Correct source-bound light3 v02 is now audited; one right-edge clip at f3 remains, rather than importing v01's three-frame finding.
- Light4 v02's B-scale correction is visible at native density; its f4 still clips. This is no longer merely an absent-packed-evidence hold.
- Win v02's uniform source enlargement is canceled by current bodyHeight normalization. Merely enlarging the raw image again will not establish the approved native stature; Claude must reconcile the explicit native fit while preserving anatomy and the user's approval gate.
- Run and airLight1 truncation is reproduced with intact whole-figure inputs, locating the demonstrated loss at cell placement rather than missing source pixels.
- Manual shin/torso point coordinates and uncertainty are now reviewable. They narrow some uncertainty but do not establish complete anatomy passes.

Special stays blocked; no special v02 image is invented. Heavy's existing 0.900 factor remains inside the earlier measurement uncertainty 0.811-1.161; no re-stitch or pass inferred. No contact/hurtbox/gameplay result is claimed. These diagnostic assets are not shipped art.
