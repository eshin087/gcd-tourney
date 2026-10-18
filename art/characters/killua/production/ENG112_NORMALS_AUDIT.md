# ENG-112 Killua directional normals: final technical audit

Date: 2026-10-18  
Branch: `art/normals-killua`  
Candidate versions: all ten strips v01; none has a user approval.  
Audit model: GPT-6 Astra, medium.  
Scope: actual 48-color quantized diagnostic atlas, compared with Killua's packed idle and approved title-style references. The temporary manifest set only the ten candidates' approval fields in a scratch copy so the packer could produce an inspectable atlas; the working manifest remains unapproved. Whole-character diagnostic pack: 54 animations, 251 frames. Candidate frame cells: fTilt 181–187; uTilt 188–194; dTilt 195–200; dashAttack 201–207; fSmash 208–216; uSmash 217–224; dSmash 225–232; fair 233–238; bair 239–244; uair 245–250.

Diagnostic atlas SHA-256: `b9b99d8812d7cdb1f38e96bc5143fd2f1d4666b47a595dcb1ace041deecef130`  
Diagnostic anims JSON SHA-256: `7d0ae916e920c5edc17da35efba7f4eec9db726ae26b867c5831ed3197045bbf`  
Per-frame H/F metrics: [ENG112_NORMALS_METRICS.json](ENG112_NORMALS_METRICS.json)  
Packed-cell review: [Killua diagnostic review](../../../../public/reviews/normals-killua/index.html)

## Findings

| Strip | Result | Astra finding |
|---|---|---|
| fTilt v01 | HOLD | Forward straight punch reads, but it lands high near face/shoulder instead of clearly chest. Hair silhouette varies; H range 0.143 makes scale pop uncertain. Feet/limb chains otherwise continuous. No justified uniform rescale. |
| uTilt v01 | HOLD | Detached hand fragments / abrupt arm ends in f1 and f5. Arc is present, but limb continuity fails. H range 0.182 is partly affected by rotation/segmentation. |
| dTilt v01 | HOLD | Head/body mass and shoes read enlarged. f3 foot reaches x255 and clips. Head-derived factor ~0.758 differs from shoe-derived ~0.829; a uniform rescale is not demonstrated. |
| dashAttack v01 | HOLD | Head reaches x255 in f2/f3; f3 truncates head and forward body. H minimum 0.567 is clipping, not shrinkage. Scale cannot repair lost pixels or the transition. |
| fSmash v01 | HOLD | f2–f5 show severed legs / foreign shoe pieces from adjacent-figure overlap. Charge f2 is modest and the punch is already extending in startup f3. Segmentation must be repaired before a scale decision. |
| uSmash v01 | HOLD | Crouch-to-overhead punch reads, but head/sleeve volume changes across poses. f7 returns to deep crouch and visibly pops when transitioning to idle. Uniform scaling unsupported. |
| dSmash v01 | HOLD | Both sides are struck at shin height. Head/upper-body mass is enlarged relative to shoes, and f7 stands taller than the opening crouch. Uniform head normalization would undersize shoes. |
| fair v01 | HOLD | Forward aerial kick reads. Head/body and leg chain are enlarged; striking shoe clips at x255. Head factor ~0.819 differs from feet factor ~0.889. |
| bair v01 | HOLD | Direction is correct (faces right, strikes left). Best uniform-scale candidate: head factor ~0.876, feet factor ~0.905, H range 0.085. Torso/limb volume still exceeds reference and needs corrected-atlas measurement. |
| uair v01 | HOLD | Upward kick reads and fits. Head/body are enlarged. Automatic H on f2/f3 selects the shoe and is invalid; use manual head landmarks if reconsidered. |

All candidates retain recognizable Killua identity and broad lavender/navy/white colors. Their smooth illustrated contours, dense shading and hair/sleeve volume differences do not establish hard-pixel source-style compliance. Quantization alone does not resolve that issue.

H (head) and F (shoe-color area) are proxies, not full anatomical measurements. Reliable per-frame skull, shoulder, upper/lower arm, thigh/shin measurements within ±6% were not obtained because of clipping, overlap and foreshortening. No numeric full-body pass is claimed. No runtime move/contact test was performed. The new normals' three-call budgets are exhausted (dTilt: 3 calls, only attempt01 saved; two parallel results were not captured). No further image call is authorized by the current batch.

## Decision needed

All ten v01 candidates remain technical holds. The selected files and all 28 captured attempts remain preserved, and the full source pack remains available. To reach a review-ready batch, the next work needs either new user-authorized generation budgets for the specific broken strips or a decision to keep the stand-ins. The diagnostic page is explicitly not an image approval request.

