# Sasuke reference notes

## 2026-10-08: model_sheet v01, approved

Saved unchanged from the best of three built-in image-generator attempts as `model_sheet_v01.png`. Initial prompt: the complete S1 block in `../PROMPTS.md`, without image inputs. Retry 2 attached attempt 1 and requested a back-only bow, collar crest and improved baseline; retry 3 attached attempt 2 and emphasized a planted stance foot and 34 ordered swatches. No source, archived or v1 image was attached. Only the selected attempt received a workspace version.

Identity checklist against `../CHARACTER.md`:

| item | result |
|---|---|
| Black/blue back spikes and long bangs | PASS |
| No forehead protector | PASS |
| Pale angular face and dark narrow eyes | PASS |
| White long sleeves, tall collar, mid-chest V | FAIL V depth: opening reaches almost the rope belt, around y335 versus rope y345; other shirt details pass |
| Fan crest on back of collar | PASS after retry |
| Purple rope, back bow with loops and ends | PASS back view; bow is less visible than requested in the fighting view |
| Knee-length navy waist cloth | PASS |
| Dark navy pants to ankles | PASS |
| Navy forearm guards and bare hands | PASS |
| Black open-toed sandals | PASS |
| Horizontally sheathed back sword, right-hip grip | FAIL consistency: back view is horizontal and sheathed, but front endpoints are diagonal |
| Lean athletic anime build around 6.5 heads | PASS non-chibi look; FAIL approximate ratio target, estimated 7.3 heads |

Proportion measurement, front view: estimated hidden skull crown y102 +/-6, chin about y202, soles y829. Body height 727 px / head height 100 px = 7.27 heads; crown uncertainty gives roughly 6.9-7.7. This is an anatomical landmark estimate because hair hides the skull. The raw body is larger than S1's nominal 400 px, noted under SPEC raw-size tolerance rather than treated as an independent rejection reason.

Views PASS: five ordered views, true right profile with one eye and a nose/lip/chin silhouette, consistent head scale, correct knife-hand/fist stance. Strict baseline FAIL: front soles829/829; 3/4 soles833/823; profile829; back829/829; stance826/838 (15 px total range). Perspective accounts for some difference, but the shared baseline is not exact.

Technical: 1536x1024. PASS crisp pixel-art appearance, readable flat cel bands, no text, ground shadow, floor or effects. FAIL 36 swatches instead of34 and imperfect palette order. FAIL exact background: dominant #FB02FB, corners vary; visually near-flat magenta. Palette families are recognizable, with some blue/purple saturation drift. Raw unique RGB count and antialiased edges are not reference-sheet failure criteria; the packed-strip palette limit is tested later.

Recommendation: regenerate the shirt V, anatomical ratio, sword projection and 34-color swatch row. User approved v01 on 2026-10-09 with the documented deviations accepted. The versioned file is preserved and copied unchanged to model_sheet.png. No packer/game integration applies to this reference-only round. Repository build passed.


## 2026-10-09: expressions v01, approved

Source: built-in image generator, exact S2 prompt unchanged, approved fixed-name model_sheet.png attached. First attempt selected; no retries. Saved unmodified with SHA256 `55EBCB0E570327444F1A244D1B315861D0E159551FC68ED6ACA51C220180A758`.

- Identity PASS: mature angular face, swept-back dark hair, long bangs, no headband, tall open white collar and palette families match the approved model.
- Expressions PASS: 8 in a 4x2 row-major grid: cold neutral, faint smirk, focused anger, shout, pain, eyes-shut strain, dazed, Sharingan glare. Eyes 1-7 are dark (5-6 closed); 8 is red.
- Sharingan precision caveat: the near iris has three dark wedge-like marks around its center, rather than clear comma curls. The far iris is partly obscured by hair; three individual marks cannot be confirmed.
- Pose/scale PASS for consistency: all right 3/4; 360-364 px wide, 460-464 px tall portrait bounds; about 24 px gaps, intentional chest crop, no accidentally clipped hair/ears/collars. Estimated skull-to-chin 211 +/-15 px (crown y110 +/-15, chin about321), larger than the prompt's nominal124 px. Full-body head ratio does not apply to busts.
- Technical: 1536x1024, crisp pixel appearance and flat cel bands, no visible text, shadow, floor, glow or soft gradients. Visually flat magenta but dominant RGB251,2,251 (#FB02FB); corners (238,12,240), (246,21,243), (235,35,233), (240,30,238), so exact background FAIL. Exact4x grid is not confirmed; raw RGB count/edge anti-aliasing alone is not a reference-sheet failure criterion.
- Reference-only asset: packer frame counts, pivot, contact zones and game integration do not apply. Production build passed 2026-10-09.

Recommendation: approve with the recorded Sharingan, raw scale and background caveats. User approved expressions v01 on 2026-10-09 with documented deviations accepted. The versioned source is preserved and copied unchanged to expressions.png.


## 2026-10-09: idle v01, approved

Selected A1+B1. Two B retries attempted to reduce f6's dip but changed the head angle/width without materially improving amplitude; both remained unsaved. Selected initial prompts used approved model_sheet.png+expressions.png; B also attached selected A. Parts preserved byte-for-byte. Node/pngjs stitched A at(0,1), B at(1568,0),32 px pure-magenta separator, no resizing/remapping/cropping. Output3104x1025, common max raw sole y862. Strip SHA256: 9a58a14fdce2c2c2660efb91c323d74127804febd0231483cb65d07dda793f93.

- Identity: approved mature face/hair/no headband, white collar/open V, purple rear rope bow, sheathed sword, dark eyes and knife-hand/chest-fist guard maintained. User-accepted deep V from S1 persists.
- Geometry: all8 right-facing cells; head approximately32-33 px, near31 target; raw anatomy approximately6.3-6.7 heads. f0 top39, f2 top37, f6 top43, f7 top39; soles y240, maximum204 px body. Rear foot x77-78..94-96; lead x152-153..179-180: <=2 px drift. f7 and f0 match head height and shoes within1 px. Fourth raw A toes end x1533 of1536 but remain intact; seam adds padding. No cell clipping/margin warning.
- Motion:6 px total crown bob; f6 is4 px below neutral, exceeding tiny breathing brief. Loop closes, but the lower pose is visibly more pronounced.
- Packing: npm run sprites sasuke selected raw/idle_v01.png at scale0.281, wrote8 cleaned frames, warned32370 colors. Then node tools/pack-sprites.mjs sasuke --quantize 48 yielded48 colors/zero warnings from frames/idle tied to that raw. Final4096x256 sheet,256px cells,pivot[128,240],ppu128,8x150ms looping idle. Hard alpha; each cleaned cell has one8-connected opaque component and no stray background specks. Cleaned frames retain pre-quantization colors; final public sheet is authoritative for color. Repack with --quantize 48; no manual public edits.
- Runtime: game at http://127.0.0.1:5188/?fight=sasuke,sasuke&mode=solo&art=custom&debug logged custom sheet with1 animation/incomplete preview; no console errors. Sprite Lab loaded actual sheet.png+anims.json and displayed idle(8), body height204. Its center floor dot is the UI's pivot marker (src/spriteLab.js:81), not an art artifact. Other22 CORE and15 optional animations remain missing as expected. Production build passed.

User approved idle v01 on 2026-10-09 with the recorded QA caveats. The versioned strip and A/B parts are preserved; idle_approved.png is an unchanged copy of idle_v01.png. Run production may now use all three approved fixed references.
