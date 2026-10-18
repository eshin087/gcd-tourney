# ENG-112 Killua R2 final fitted-atlas audit — Astra

2026-10-18. Auditor: GPT-6 Astra, medium. Worktree: `.worktrees/art-normals-killua-r2`; branch `art/normals-killua-r2`.

**Technical disposition: PASS within the explicit relay #28 accepted uair fit/body-volume tradeoff. uTilt v03 and uSmash v02 pass visual anatomy/scale inspection; uair v02 retains visibly small body proportions and is NOT an unrestricted anatomy/scale pass.** No new clipping, severed limbs, foreign fragments or fit-boundary defects were found in the 21 inspected frames. The previous small-body finding for uair remains true; the supplied user decision to ship that exact fit resolves its disposition, not its measurements. Without that decision the body-proportion finding would remain HOLD.

## Scope and evidence

Inspected actual quantized `public/characters/killua/sheet.png` cells using `anims.json`, current idle v11 f0 (cell 0), approved `public/art-review/title-style-pilot/killua-neutral_v01.png` and `killua-combat_v01.png`, `art/scale/body-killua-uTilt-uSmash-uair.png`, `art/scale/body-report.json`, and the title-style production contract. Native 256 px atlas crops were inspected individually and sequentially; the comparison sheet preserves equal pixel density. All three moves have `loop:false`; startup, strike, recovery and return-pose continuity were inspected statically. No runtime playback, contact/hurtbox testing, build, generation, repacking, source edits or approval changes were performed.

Version/fit authorization supplied by parent: uTilt v03 / import x0.75 / visual approval combat #27; uSmash v02 / x0.8613 / approval #20; uair v02 / x0.75 / explicit ship-with-fit and advisory-body decision #28. This report does not independently certify relay authorship or grant image approval.

## Every-frame findings

| Move/frame (atlas cell) | Inspection |
|---|---|
| uTilt f0 (188) | Head and lean torso close to idle; narrower bent stance, two intact boots. |
| uTilt f1 (189) | Guard hand meets face naturally; arm overlap reduces visible shirt area, not a missing torso. |
| uTilt f2 (190) | Raised claw connects through wrist/sleeve/shoulder; hair stays coherent beside raised sleeve. |
| uTilt f3 (191) | Overhead diagonal claw strike reads clearly; connected arm and planted legs, no clipping. |
| uTilt f4 (192) | Arm sweeps down/forward; torso rotation and forearm overlap remain plausible. |
| uTilt f5 (193) | Hands return near waist; compact shirt silhouette follows arm placement, legs retain length. |
| uTilt f6 (194) | Returns near f0; intact hands/boots, no conspicuous body-scale jump. |
| uSmash f0 (217) | Slightly narrower upright guard than idle; coherent adolescent build, no conspicuous undersize. |
| uSmash f1 (218) | Crouch compresses silhouette; bent knee and hip chains remain connected. |
| uSmash f2 (219) | Deepest crouch explains low occupied height and low garment-area score; not fitted to standing height. |
| uSmash f3 (220) | Rising anticipation preserves torso and legs; readable head close to idle. |
| uSmash f4 (221) | Overhead active claw/hand, connected raised arm; sleeve masks part of hair and corrupts head probe. |
| uSmash f5 (222) | Higher overhead extension, intact fingers and wrist; sleeve occlusion explains low probe, not actual head collapse. |
| uSmash f6 (223) | Return through forward guard, intact limbs and shoes; leaner silhouette remains plausible. |
| uSmash f7 (224) | Returns near startup, no obvious whole-body shrink or detached detail. |
| uair f0 (245) | Readable head near reference size; shirt/trunk and folded limbs visibly compact relative to idle. |
| uair f1 (246) | Strong knee tuck explains much of silhouette compression; small trunk persists, all limbs connected. |
| uair f2 (247) | Upward kick connects through shorts/hip; actual hair remains readable below shoe; shoe contaminates head probe. |
| uair f3 (248) | Full upward kick, intact raised boot and hip connection; reduced trunk/clothing volume persists. |
| uair f4 (249) | Recovery tuck/leg extension coherent; small body relative to head persists, no severing. |
| uair f5 (250) | Returns to airborne startup-like pose; short readable torso remains conspicuous, boots intact. |

uTilt does **not** look conspicuously small after its x0.75 fit. Its head, shirt volume, arm chains, bent legs and footwear are visually compatible with idle and the approved lean combat build. uSmash also does **not** show a conspicuously small whole body; its deep crouches and raised sleeve account for much of its advisory score. Uair **does** look conspicuously compact, particularly shirt length in f0/f5 and overall trunk/limb volume relative to the head. The neutral reference confirms a lean build but does not justify shortening the readable torso. Bent aerial legs explain occupied-height changes, not all of this torso reduction. This is the accepted tradeoff, not a newly disproven warning.

## Measurements and limits

Body B is a square-root garment-color-area ratio to current idle f0; it is not body height, limb length or a five-segment anatomy test. Poses/occlusion and palette matching introduce roughly +/-10% advisory noise. Head H uses the approved combat-reference palette; current idle f0 itself reads H1.032, so H is not directly a ratio against current idle. Low obstructed head values are withheld from anatomical conclusions.

| Move | B per frame | B median | H per frame |
|---|---|---|---|
| uTilt v03 | 0.966, 0.878, 0.999, 0.918, 0.908, 0.872, 0.968 | 0.918 | 1.013, 1, 1.032, 1.025, 1.032, 1.032, 1.023 |
| uSmash v02 | 0.902, 0.779, 0.75, 0.844, 0.868, 0.862, 0.805, 0.926 | 0.853 | 1, 1.025, 0.995, 1.032, 0.696, 0.557, 0.992, 1.025 |
| uair v02 | 0.871, 0.643, 0.795, 0.77, 0.67, 0.88 | 0.783 | 0.996, 1, 0.575, 0.551, 0.995, 1.003 |

Manual visible collar-to-hem intervals on the packed art are approximately idle 43–48 px, uTilt readable frames 40–46 px, uSmash upright frames 41–46 px, uair f0/f5 32–37 px. These are visual landmark estimates, approximately +/-4–6 px uncertainty due to folds, collar placement and obliqueness; they are not exact skeleton measurements. Hidden elbows/hips/knees make individual limb-chain estimates less reliable (roughly +/-6–10 px). Fine finger anatomy is limited by pixel resolution. No claim is made that every head, torso, arm, leg and shoe lies within +/-6%; unmeasured/occluded segments are not numerical passes.

All inspected opaque bounds stay strictly inside the 256x256 cell: combined x50–187, y57–240 inclusive. y240 is the intended sole anchor, with 15 transparent rows beneath; there is no cell-edge clipping. uTilt reaches y80 at its highest hand, uSmash y57, uair y81. The native crops contain no foreign boot or cut limb. Aerial anchor behavior and strike hitboxes require Claude's runtime/contact checks.

## Exact evidence hashes (SHA-256)

- `public/characters/killua/sheet.png`: `a7237809a757c97a40ae1b1e34b96236faa54eb7cad41a4dabb7b6957a3e19b1`
- `public/characters/killua/anims.json`: `1f694c5ebacb6ac831862efbd73f4aa877ca501e72d2c614816b3bfcca697b0f`
- `art/scale/body-killua-uTilt-uSmash-uair.png`: `129097a651f1cdb4ed5f3fa5eeea3c91982c7f8b5ee8cb41d21f5489e7988e79`
- `art/scale/body-report.json`: `eaa19586bfe54e563dc1ec1bf0f771d96006b9b1b7b06160763ffd322b97f7e2`
- `public/art-review/title-style-pilot/killua-neutral_v01.png`: `86278707ba8f0fcb78942cbcedb3341d8ad8f559e95f8cbf48273d0bbdca1855`
- `public/art-review/title-style-pilot/killua-combat_v01.png`: `d32d8f9f297efac7bcd8ba7e0dfd34c4d458ada1fc5e45a9c93801340f5a63d6`

Only this new audit report was written in the task worktree. Parent owns shared bookkeeping and handoff; Claude owns integration and production.
