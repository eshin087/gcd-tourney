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
