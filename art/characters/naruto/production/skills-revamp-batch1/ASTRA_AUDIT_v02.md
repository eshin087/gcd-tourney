# Astra audit v02: Naruto skills batch 1

Date: 2026-10-18 UTC. Auditor: GPT-6 Astra, medium. Worktree: `E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-naruto-skills`, branch `art/naruto-skills`.

**B1 beamCharge v11: HOLD. B2 beamFire v14 with placement sidecar: HOLD for final packed verification. B3 ui_ult_fg v04: HOLD for anatomical calibration, with contrast explicitly exposed for user visual review.** No image approval, scale exemption, manual numeric pass, or production release is granted. No generation calls or art-source edits were made by this audit.

## Evidence boundary

Directly inspected all three raw B1 and B2 frames, B3 raw and fitted PNG, unchanged backdrop, placement JSON, current static page CSS, production contract, and prior ASTRA_AUDIT_v01.md including its addenda. A native source crop of B1 f2 and an alpha composite of the fitted B3 at the CSS placement were generated solely as disposable diagnostics and inspected. This is not browser playback or engine-contact verification.

The coordinator reports running `node tools/pack-sprites.mjs naruto --quantize 48 --no-writeback --out public/reviews/naruto-skills-batch1/candidate-output`: 54 animations analyzed, 48 colors, expected no-head holds for B1/B2, and no B2 clipping or 4 px margin warnings after the offsets. This audit did not rerun or independently inspect that log. **No new character atlas was written.** The prior v01 partial atlas cannot certify v11 or the new B2 placement. The 48-color report is not a successful final atlas/scale pass.

## B1 beamCharge v11

All three source frames now show four distinct tail tips, two separate ears, full engulfment, open white roar mouth and four connected limbs. No human hair, headband, skin, clothing or sandals is visible. The earlier 3/4/3 tail-count defect is cleared **at raw level**. Body contours remain visually stable across f0/f1/f2; the coordinator's pixel equality check outside the patched 400 x 400 region is reported evidence, not independently recomputed here.

**New raw seam defect:** f2 has a straight vertical cut/join at frame-local x400 inside the tall tail and adjoining rightmost tail, especially around y200..390. A native crop covering local x300..529, y160..429 confirms the abrupt vertical outline and color discontinuity. The copied tall tail ends squarely where the old fourth-tail area resumes. This is an artificial rectangular patch boundary, not a normal tapered contour. It remains visible in the full strip. f0 has a less conspicuous boundary; this audit does not certify every join as seamless.

The three larger left/upper fan shapes are largely repeated while the rightmost tail moves. Ordered source transitions, including f2 -> f0, preserve four tips but the f2 join and abrupt rightmost-tail change remain visual review concerns. No playback smoothness pass is claimed. B1 remains HOLD for this seam and unresolved final anatomy/scale evidence.

## B2 beamFire v14 and sidecar

The raw hash is unchanged from v01. Every raw frame has four readable tails and an intact fully engulfed figure. f0 launches with projecting claws, f1 tucks the legs in the air, f2 descends into a low brace/landing with both forelimbs down. No obvious detached or extra limb is visible. f2 still does not independently communicate a single forward claw impact at hip height. The sidecar records that Claude selected this as the slam pose; the remaining issue is contact/readability verification in the engine, not a demand to disregard that selection or spend another image call.

`beamFire_v14.json` specifies even splitting and offsets `[-21,0],[-21,0],[0,0]`, with the correct source SHA-256. These express translation only, preserving density and vertical position; they contain no anatomical calibration. The coordinator reports diagnostic clipping and margin warnings cleared. Therefore the old clipping is **addressed in placement configuration and reported diagnostic analysis**, but final pixel containment is pending a newly written atlas. Do not reuse the old clipped partial atlas as evidence that the corrected placement still clips, or as evidence that it passes. The offsets also change f1 -> f2 horizontal registration by 21 px; Claude must inspect motion/contacts at runtime. Airborne vertical placement is unchanged.

## B3 ui_ult_fg v04 and static composition

Raw and fitted images retain four tails, four connected limbs, two ears, full engulfment and complete claws. Fitted size is 576 x 432, with the same hash audited in v01. The earlier fitted-output availability and magenta CSS defects remain cleared. The current `.poster img` explicitly sets transparent background and zero border radius; foreground width 75%, left 12.5%, bottom 0 places it at (96,0) in a 768 x 432 poster.

An exact-placement diagnostic composite was inspected. It preserves the complete figure and four foreground tails, but red contours compete with the red sky, black tail silhouettes and bright ground cracks. Eye and mouth read strongly; flank, leg and some tail boundaries separate poorly at smaller viewing sizes. This is a qualitative visual concern, not a measured contrast-ratio failure. The prior occupied bounds x25..551/y0..431 remain applicable to the unchanged fitted pixels: zero top/bottom breathing room is tight, without visible severing. This is a static diagnostic, not a browser-render pass.

## Anatomy and scale uncertainty

The prior audit's skull/torso/arm estimates were explicitly uncertain and belong to its old packed artifact. They must not be relabeled as v11/current-placement measurements. Open jaw, ears, shroud musculature, crouch, perspective and overlapping far limbs prevent trustworthy equal-density segment comparison from these raw sheets alone. B1 body stability does not establish title-scale correctness. B2's complete raw claws do not establish packed contact coordinates. B3 is a perspective splash, not a skeleton calibration image. Shoes are absent by design; clawed feet cannot silently stand in for footwear measurements.

Final quantized atlas comparison with approved neutral/combat cells and packed idle, every affected frame/transition, remains pending. No +/-6% anatomy assertion or no-head exemption follows from this audit.

## Review presentation and next evidence

At inspection, index.html still labels B1 v10, embeds the old partial atlas, lists B2 clipping as current, and says A8 awaits HD support. The coordinator must update those labels to the actual current evidence before sharing the page as a v11/current-offset review. A8 is outside this B1-B3 audit. Preserve the distinction between raw visual review and technical clearance. B1's patch seam needs correction or explicit exposure; final packed scale, placement and Claude's runtime contact checks remain open. User visual approval is separate and is not supplied here.

## Exact SHA-256 evidence

| Artifact | SHA-256 |
|---|---|
| raw/beamCharge_v11.png | 9a739a0b8a860c05e1099e739ea11b4757562a39a3fb8cc6491febad35ee8317 |
| raw/beamFire_v14.png | 82335d9dad17ca81e828c8f3814ed8228c60841cd4c1df55f394c594ecb576e3 |
| raw/beamFire_v14.json | b79c66f80dbeac029699d838ab5c255f90a7382332cBCD1e1639ad8097c3b72e |
| raw/ui_ult_fg_v04.png | b82b3ec384dc58868e5dd7992d3864fd10ca3034fcb76845129a70eef5f39088 |
| review media/ui_ult_fg_v04_fitted.png | 287800d7f66d07b80c10dc125122e0cd9d2fa9f60af004bd5c73e8ebaee9dc61 |
| review media/ui_ult_bg_v01.png | 1fb570ad35162f0c1c83ca416b7381b138b4cc8cfdb5d78d7a0f430b5b3c252d |
| review index.html at inspection | 1c9f58662593dc63b893a1608dd5771ffbf013cbf44678d39243cf9f58a249c5 |

Raw paths are beneath `art/characters/naruto/`; review paths beneath `public/reviews/naruto-skills-batch1/`. Hashes bind inspection time; a later page correction requires a new page hash, not alteration of this historical record.


## Coordinator correction after inspection

The review page was updated after this audit inspected it: it now lists beamCharge v11 and discloses the f2 x400 rectangular join, beamFire v14 placement with final packing pending, and the requested f0 slam mapping as pending Claude engine work. The earlier statement that the page still showed v10/clipping is historical to the inspection timestamp, not current. No new atlas was written.
