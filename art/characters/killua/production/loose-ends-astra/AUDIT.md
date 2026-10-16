# Astra final candidate audit — Killua loose ends, 2026-10-15

**HOLD charge v14, down v08 and ko v09. No approval and no production scale pass.** Every new candidate frame (4+2+1) was inspected in the frozen 48-color diagnostic atlas. The unchanged gate rejected all three. The frozen pack uses isolated warning mode solely for inspection; it is not a release atlas.

## Frozen evidence

- Atlas: `../loose-ends-diagnostic/warn-mode-atlas/characters/killua/sheet.png`
- SHA256: `dcfa207a5a30cf9ae31e185e6684d4472ae6012727b50525f1199bf75bd3a628`
- anims.json SHA256: `f07b4887bc898a340f63fb559e99db0a4efa2ef48cb2f48524ae4ae84ba4f5cc`
- Exact candidate and idle crops in this directory are extracted directly from this sheet using its animation indices. Contact sheets preserve one pixel density and add labels and y240 floor lines only.
- Compared approved title-style neutral/combat cells, reference/idle_approved.png and packed idle11. The unauthorized second charge output was not opened, inspected or selected.

## Measurement policy

Numbers are manual native-cell projected estimates, not 3D anthropometry. H is hair-top to chin for upright heads, or the analogous visible head axis for lying heads; crown-under-hair is occluded. T is neckline/shoulder-center→belt/hip-center. UA/FA = shoulder–elbow / elbow–wrist; UL/LL = hip–knee / knee–ankle; S = heel–toe projection; W = garment shoulder span. Typical endpoint uncertainty ±4px, segment ±6px, head ±2–3px; clipping means **unmeasurable**, never a numeric pass. Overlapping far limbs are excluded from intrinsic-length certification.

Screening reference ranges at the same native density: packed idle11 H ~36–42, T ~35–45, UA ~20–29, FA ~18–27, UL ~29–40, LL ~29–39, S ~20–29, W ~31–41. Approved neutral has a more upright torso (roughly 42–52px neckline to belt) and straight limbs; combat/idle are crouched. Do not fit a crouch or lying silhouette to upright height.

## Every-frame evidence

| Candidate/frame | H endpoints / screening size | T endpoints / screening length | UA / FA | UL / LL | S / W | Finding |
|---|---|---|---|---|---|---|
| charge v14 f0 | y119:163 / 41–47 | (137,165)→(128,191) / 24–33 | 19–29 / 16–26 | 20–32 / 18–29 | 19–28 / 33–43 | Head visibly larger relative to bent torso than approved idle; upper legs strongly foreshortened |
| f1 | y119:163 / 41–47 | (137,165)→(128,191) / 24–33 | 19–29 / 16–26 | 20–32 / 18–29 | 19–28 / 33–43 | Same large-head relationship; hand shift is subtle |
| f2 | y119:163 / 41–47 | (137,165)→(128,191) / 24–33 | 19–29 / 16–26 | 20–32 / 18–29 | 19–28 / 33–43 | Same crouch; far joints hidden, no full-limb certification |
| f3 | y119:163 / 41–47 | (137,165)→(128,191) / 24–33 | 19–29 / 16–26 | 20–32 / 18–29 | 19–28 / 33–43 | Same head hold; wrap pose coherent |
| down v08 f0 | head/hair crosses x0; complete H unmeasurable | (54,197)→(118,215) / 60–72 | 25–39 / 23–37 visible near arm | 40–56 / 41–57 bent upper leg | right shoe clipped; W projection unmeasurable | Major horizontal clipping; garment torso much larger in projection than idle; raised knee |
| down v08 f1 | head/hair crosses x0; complete H unmeasurable | (47,207)→(112,216) / 60–72 | 23–37 / 22–36 visible near arm | 39–55 / 39–55 visible lower chain | right shoes clipped; W unmeasurable | Full head and footwear unavailable; cannot certify anatomical scale |
| ko v09 f0 | head mostly outside x255; H unmeasurable | neck partly clipped near (249,199)→(165,214) / ~78–92, low confidence | 25–41 / 25–41 near arm, shoulder ambiguous | 39–55 / 38–54 visible bent chain | 26–40 / W unmeasurable | Head exclusion alone prevents final audit pass; large torso projection and clipped neck |

Numbers are screening annotations on exact crops, intentionally broad. Hidden endpoint uncertainty exceeds the ±6% production criterion. No full-contract pass is inferred from them. The charge knee bend reduces projected leg chains; that alone is not an intrinsic short-leg finding. Down/ko cannot be meaningfully compared by standing height.

The packer supplied head ratios charge approximately 1.10/1.085/1.094/1.085 (aggregate ~1.09), feet 1.158; down head .837, feet 1.343 with unmeasured probes; ko head .662, feet 1.215 with unmeasured probes. Clipped heads invalidate interpreting down/ko probe values as true head shrinkage. Charge's intended ~8% head correction appears to overshoot the packed idle comparison; calibration must determine how much is head size versus pose/segmentation. Foot color ratios are not measured shoe widths.

## Grounding and clipping

- down f0: visible head/hand lower contours lie near y230–240, but head crosses x0 so the complete head-floor relation cannot be measured. Back/hip lower garment contour is near y229–234, roughly 6–11px above the floor; upper knee is near y154 and is intentionally raised. The lower leg is nearly horizontal, with shoe clipping at x255. It does not demonstrate the complete head/back/hips/legs all resting on y240 requirement.
- down f1: side-on long body is clearer; lower head/hand/garment/shoe contours occupy approximately y231–240. Head and shoe clipping prevent complete contact certification. Back/hips appear within roughly 6–10px of floor, not a measured universal ground contact. Claude must check final camera/contact rather than assume every point of a curved silhouette touches one line.
- ko f0: left shoes and bent legs approach y240 and the near hand sits near the floor. Head/neck extend outside the right cell; no head-grounding measurement is possible. Back/hip lower contour is near y231–237. The missing head is a hard diagnostic hold.

There are visible opaque pixels touching both horizontal boundaries in down and the right boundary in ko; this is not simply extra transparent margin. Do not crop/repaint the outputs or resize lying poses by their height to hide the issue. Claude owns sidecar calibration and packer treatment.

## Transitions and replay

All adjacent frames and end/start pairs were visually compared in ordered atlas crops. No real-time game or timed browser playback was performed by this auditor. Charge 0→1→2→3→0 is a small breathing/twitch loop with stable feet and no obvious size pop within the strip; its head/body relationship differs from idle. No broad aura silhouette is visible in the quantized cells, so retention of v13's requested aura cannot be certified here; inspect source and runtime effect separately.

Down 0→1 lowers the bent upper knee and extends the legs, a readable impact-to-rest change; clipping persists on both ends and masks head/foot motion. Reverse replay 1→0 sharply raises the knee, expected for a non-looping impact animation rather than a seamless loop. KO is one static frame: repeat is identical, but cannot certify entry continuity from down because orientation changes (down head left; ko head right) and the ko head is outside the cell. Mark that state-change flip for Claude's runtime review.

## Required next step

Claude calibration/repack must restore complete head and footwear inside the final cell while preserving anatomical scale. Re-audit changed final pixels, including all lying contours. No calibration, manifest fields, production atlas, approval state or raw image was edited by this auditor. All three remain needs review with technical HOLD; this report does not authorize another generation call.

## Source/reference hashes

- `.worktrees\art-killua-loose-ends\art\characters\killua\raw\charge_v14.png` SHA256 `18e39c33f9451972a4e88005c3dd454a9a4b6b1ee2c6af92ba2326dda9672030`
- `.worktrees\art-killua-loose-ends\art\characters\killua\raw\down_v08.png` SHA256 `7264843db3512cc205264b6fb9978974fccef6eecebc2682795bfba9f9342486`
- `.worktrees\art-killua-loose-ends\art\characters\killua\raw\ko_v09.png` SHA256 `8837d5f15beb4bdfbde5bd2fb75cf00c369c58c50a324bfe9df669e3c0709ccc`
- `.worktrees\art-killua-loose-ends\art\characters\killua\reference\idle_approved.png` SHA256 `67e7016328a35ae12aaa2969f5e8c911d64b093039d9b1612583b21bff655aa9`
- `public\art-review\title-style-pilot\killua-neutral_v01.png` SHA256 `86278707ba8f0fcb78942cbcedb3341d8ad8f559e95f8cbf48273d0bbdca1855`
- `public\art-review\title-style-pilot\killua-combat_v01.png` SHA256 `d32d8f9f297efac7bcd8ba7e0dfd34c4d458ada1fc5e45a9c93801340f5a63d6`

## Supporting coordinate traces

`projected-landmark-traces.json` gives approximate visible shoulder/elbow/wrist and hip/knee/ankle coordinates for every frame, with Euclidean projected segment calculations. The broad screening ranges above are visual estimates, not tight bounds on those coordinate calculations; discrepancies within endpoint uncertainty do not justify a pass. Hidden joints cannot be recovered from this evidence.
