# Sasuke uTilt v05 deterministic head edit (ENG-112)

## User direction

Claude relayed user decision combat #11: do not generate an image; enlarge only the hair-to-chin head of approved
uTilt v01 about 8% around the neck/jaw, keep the same poses and strip layout, record the deterministic pixel edit, then
return the result for seam review. The user approved v01 via Claude relay combat #3. This v05 is a new unapproved
candidate; `approvedVersion` remains 1. v02 and v03 were occupied by failed earlier image edits, and a failed local
deterministic v04 attempt is preserved at `raw/_qa_hold/uTilt_v04_edit_attempt.png`. Version numbers were not reused.

## Source and operation

- Source: `raw/_qa_hold/uTilt_v01.png`, 2172x724 RGB, SHA-256 `91c0c2c3a2c29014d851dd2fc2077818c4550b0de920d4210058f2bdfd727c56`.
- Output: `raw/uTilt_v05.png`, 2172x724 RGB, SHA-256 `a29190a34aa7ae132e963186c4a6b794b27ef6f2707f2806f595aa9c5eec9efe`.
- Operation: for each frame, select only the visible hair/head-to-chin pixels inside a hand-traced head mask and overlay a deterministic nearest-neighbor 1.08 enlargement about the neck/jaw anchor. All source pixels outside the transformed head/neck-edge regions remain byte-identical. There were no image-generation or image-edit model calls.
- Per-frame anchors in source canvas coordinates: f0 `(165,350)`, f1 `(508,411)`, f2 `(788,329)`, f3 `(1073,300)`, f4 `(1380,320)`, f5 `(1675,348)`, f6 `(1985,348)`.
- Transformed source pixel bounding boxes (exclusive max): f0 `(116,231)-(212,353)`, f1 `(455,319)-(553,417)`, f2 `(733,246)-(831,333)`, f3 `(1001,209)-(1106,313)`, f4 `(1315,225)-(1421,331)`, f5 `(1625,231)-(1722,357)`, f6 `(1942,235)-(2039,357)`. Total pixel differences from v01: 46,294.
- v04 attempt used erase-and-replace, exposed magenta seams at the collar/back hair, and was moved intact to `_qa_hold`; v05 instead overlays the enlargement on the untouched source so the original neck/collar remain underneath.

## Pack and Astra evidence

The initial quantized pack reported a false `pop` because the head probe selected raised arms at f2/f3. Astra confirmed on the
v05 source that the actual heads remain below-left of those arms, matching the earlier v01 measurement error. The manifest
therefore records only f2 and f3 as `scaleExemptFrames`, with `scaleExemptVersion: 5` and explicit version-bound reasons.

A default candidate pack then passed and wrote the 48-color atlas. For that diagnostic pack only, dTilt v06 was temporarily
moved to `raw/_qa_hold/`; the atlas therefore packs approved dTilt v05 and candidate uTilt v05. dTilt v06 was restored to
`raw/` before the full strict-scale dry run, which correctly fails on dTilt v06 (head 1.09 of idle, feet 1.50). uTilt v05
cells are 181–187; `loop:false`, phases 2/2/3.

Final Astra audit of the actual quantized cells:

| Frame | head probe | body B | finding |
|---|---:|---:|---|
| 0 | .971 | .918 | head/jaw joins collar; stance retained |
| 1 | 1.000 | .828 | crouch intact; folded limbs obscure segment lengths |
| 2 | .540 (false arm probe) | .882 | head is below-left of raised arm; sleeve obscures lower landmarks |
| 3 | .581 (false arm probe) | 1.039 | head is below-left of overhead arm; neck remains connected |
| 4 | .996 | .917 | recovery head/collar continuous; silhouettes retained |
| 5 | 1.000 | .920 | clean recovery silhouette and jaw attachment |
| 6 | .921 | .913 | no obvious seam; readable head remains below target |

Head-edit seam/pose verdict: **PASS for the user's seam review**. Full numerical scale/anatomy verdict: **HOLD**. Readable
head measurements have approximately ±2–3 packed-pixel uncertainty, higher at f2/f3 due to occlusion and angle; this is not
precise enough to certify ±3%. Body-sheet median B is `.917`, below the assigned `.93–1.07` advisory envelope, and this
inspection does not quantitatively explain away the shortfall. The unchanged v01 poses already look more compact/narrow than
idle/combat. No new torso/limb/footwear/clothing-volume distortion is apparent, but no numerical segment pass is claimed.

- Quantized atlas `public/characters/sasuke/sheet.png`, SHA-256 `77bae360d8f662558c7072b5db3754754d78e059f0ceaab0fca404e3785c6a5c`.
- `public/characters/sasuke/anims.json`, SHA-256 `6a9c100ba823ac80d2ff7e35ea915b2eafa407f7c67c569815573e1ce14572fd`.
- Before/after source-head view: `public/reviews/normals-sasuke/uTilt_head_before_after_v05.png`.
- Packed frame loop, body sheet, and scale-head sheet are linked on the ENG-112 review page.

User seam approval is still pending; approval of v05 would not clear the Astra numeric hold, activate the strip in production,
or override the separate dTilt v06 gate. Fallback remains active pending user drawing approval and Claude's integration check.
