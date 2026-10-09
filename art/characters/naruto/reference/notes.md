# Naruto reference notes

2026-10-08: Generated three S1 attempts with the built-in ChatGPT image generator. The third is saved as `model_sheet_candidate.png` for visual review. It includes the five requested views on a shared baseline and 31 unlabeled swatches.

The candidate does not yet meet the technical brief: the figures are about 580 px tall instead of 270 px, the magenta background is not uniformly `#FF00FF`, and the image contains many colors outside the 31-color palette. The first two attempts also missed the swatch count. Keep `model_sheet.png` unset until the sheet meets the brief and the user approves the design.

2026-10-08: Superseded by spec v2 ([ADR 0007](../../../../docs/decisions/0007-art-spec-v2-shippuden-256.md)): the candidate is too chibi (about 4.3 heads, Part 1 outfit) and its "side view" is a turned 3/4 view, not a true profile. Archived as `_old/model_sheet_candidate_spec-v1.png`; do not attach it to v2 prompts. Spec v2 candidates are saved as `model_sheet_vNN.png` and queued in `art/REVIEW.md`.

## 2026-10-08: model_sheet v01, approved

Saved unchanged from the best of three built-in image-generator attempts as `model_sheet_v01.png`. Initial prompt: the complete S1 block in `../PROMPTS.md`, without image inputs. Retry 2 attached attempt 1 and requested 6.5-head proportions, jaw-length side locks, an edge-on profile and 34 swatches; retry 3 attached attempt 2 and emphasized a roughly 12% larger anatomical head, jaw-length locks and the ordered palette row. No source, archived or v1 image was attached. Only the selected attempt received a workspace version.

Identity checklist against `../CHARACTER.md`:

| item | result |
|---|---|
| Golden layered spikes, bangs and jaw-length spiky side locks | FAIL side-lock shape: length corrected, but locks look straight rather than spiky; golden crown/bangs pass |
| Black headband, steel leaf plate and two long tails | PASS |
| Sharp blue eyes and thin brows | PASS |
| Three whiskers on each visible cheek | PASS visually; far-cheek line count less distinct in fighting view |
| Black/orange Shippuden jacket, black high collar, zipper, back red spiral | PASS |
| Orange pants with folded lower-shin cuffs | PASS |
| Black right-thigh holster | PASS; white bands also appear under its straps, an optional detail if approved |
| Black open-toed sandals | PASS |
| Lean athletic anime build around 6.5 heads | PASS approximately, estimated 6.8 heads; non-chibi |
| Slim angular face, normal blue eyes and no fangs | PASS |

Proportion measurement, front view: estimated hidden skull crown y105 +/-10, chin y211 +/-3, soles y829. Body height724 px / head height106 px =6.83 heads; uncertainty about6.2-7.6 because hair hides the skull. Independent visual review agrees proportions are plausibly near the target. Raw body height exceeds S1's nominal400 px, noted under SPEC raw-size tolerance rather than treated as an independent rejection reason.

Views PASS: five ordered views, true right profile with one eye and a nose/lip/chin silhouette, consistent anatomical scale, orthodox raised-fist stance. Strict baseline FAIL: per-figure lowest soles range827-836; stance feet are about22px apart vertically (some difference is perspective). The bent stance naturally sits lower than the upright views at the same anatomical scale.

Technical:1536x1024. PASS crisp pixel-art appearance, readable flat cel bands, no text, ground shadow, floor or effects. FAIL36 swatches instead of34 and imperfect palette order. FAIL exact background: dominant #F903F9 with corner variation, visually near-flat magenta. Character palette families read correctly without obvious soft material gradients. Raw unique RGB count and antialiased edges are not reference-sheet failure criteria; the packed-strip palette limit is tested later.

Recommendation: regenerate spikier side locks and the 34-color swatch/background treatment. User approved v01 on 2026-10-09 with the documented deviations accepted. The versioned file is preserved and copied unchanged to model_sheet.png. No packer/game integration applies to this reference-only round. Repository build passed.


## 2026-10-09: expressions v01, approved

Source: built-in image generator, exact S2 prompt with approved fixed-name model_sheet.png on attempt 1. Selected attempt 2 of 2: also attached the first candidate and requested visible far-cheek whiskers, narrower focused eyes and smaller gasp irises while preserving the layout and identity. Saved unchanged with SHA256 `711E156E27F5FA4EF53B2518802207410747705A83AA69CC1D8D297B3BC4AB2F`.

- Identity PASS with visibility caveat: angular teenage face, golden hair, side locks, blue eyes, black headband/tails, steel plate and black jacket collar match approved S1. Three near-cheek whiskers are clear; about two short far-cheek strokes are distinct, with the third lost at the narrow contour/hair. This improves attempt 1, which lacked the far marks.
- Expressions PASS: 9 busts in the correct 3x3 row-major order: determined, focused, fierce/gritted teeth, shout, confident open-eye grin, pain with shut eyes, gasp, serious dazed, knocked out. Focused now has narrower eyes; gasp now has small irises.
- Pose/scale PASS for consistency: all face right 3/4, consistent heads and shoulders. Face 1 crown under hair estimated y100 +/-20, chin310 +/-4, skull-to-chin about210 +/-24 px versus nominal124 px; shout jaw naturally lowers. Full-body head ratio does not apply to busts.
- Layout: actual1254x1254 versus requested1024x1024; square grid retained, no resizing performed. Row content bounds y14-402,420-805,825-1216 with 17/19 px clear gaps and 14-38 px outside margins. No overlap or clipping; shoulder/chest crops intentional.
- Technical: crisp pixel appearance, flat cel bands, palette families match, no visible text, floor, shadow or glow. Visually flat magenta, but dominant RGB250,3,251 (#FA03FB) instead of exact #FF00FF. Exact4x grid is not confirmed; raw RGB count/edge anti-aliasing alone is not a reference-sheet failure criterion.
- Reference-only asset: packer frame counts, pivots, contact zones and game integration do not apply. Production build passed 2026-10-09.

Recommendation: approve with the recorded whisker visibility, raw size and background caveats. User approved expressions v01 on 2026-10-09 with documented deviations accepted. The versioned source is preserved and copied unchanged to expressions.png.


## 2026-10-09: idle v01, approved

Selected A attempt 3 and B attempt 2. A retries reduced a deep crouch (~27 then9 game px) to a5 px packed bob. B retry corrected the first B pose and loop closure. Original PNG parts are preserved; Node/pngjs stitched A at(0,0), B at(1560,0), original scale with a24 px magenta gutter; output3096x1024. No resampling or retouching. Strip SHA256: db820c67b7f9753594af0caeea5a052abfcdac803b625d748bdb98f0f7914e87.

Input lineage exception: initial A/B attached approved model_sheet.png and expressions.png; B also selected A. A2 used those fixed references plus candidate. Final A3 used A2 alone as its edit target; B2 used selected A plus B1. These final correction calls did not reattach the fixed references required by the workflow. Visual comparison against both approved references found no identity drift; this exception is recorded rather than described as fully compliant. Future corrections must reattach fixed approved references.

- Identity: mature Shippuden face, leaf plate, black collar/headband, orange outfit, whiskers, holster and compact guard preserved. Tails angle backward more than their requested relaxed downward hang.
- Geometry: all8 right-facing cells, head about31 px; skull/sole ratio about188/31=6.1 in bent stance, consistent with6.5 upright target. Tops [37,38,40,42,41,37,37,37], soles y240. Body maximum204 px. Rear shoe x77-79..94-96; lead x152-153..179-181: drift <=2 px. f7-to-f0 head height matches and shoes within1 px. No clipping or margin warnings.
- Motion: total5 px crown bob, larger than1-2 px brief; f4-to-f5 rises4 px in150 ms. A/B seam is close; final-to-first geometry closes.
- Packing: npm run sprites naruto selected raw/idle_v01.png at scale0.288, wrote8 cleaned frames, warned25933 colors. Then node tools/pack-sprites.mjs naruto --quantize 48 yielded48 colors and zero warnings from frames/idle linked to the same raw. Final4096x256 sheet,256px cells,pivot[128,240],ppu128,8x150ms looping idle. Hard alpha, zero opaque magenta remnants. Cleaned frames remain pre-quantization; final public sheet is the color-authoritative preview. Repack with --quantize 48 to retain the palette cap; no public files edited by hand.
- Runtime: game at http://127.0.0.1:5188/?fight=naruto,naruto&mode=solo&art=custom&debug logged custom sheet with1 animation/incomplete preview; no console errors. Sprite Lab loaded actual sheet.png+anims.json and displayed idle(8) with body height204. Other22 CORE actions and15 optional actions remain missing as expected. Production build passed.

User approved idle v01 on 2026-10-09 with the recorded QA caveats. The versioned strip and A/B parts are preserved; idle_approved.png is an unchanged copy of idle_v01.png. Run production may now use all three approved fixed references.
