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


## 2026-10-09: run v01, needs review

Selected A2+B3 (2 A attempts,3 B attempts). A2 improved separated silhouettes and visible trailing arms. B1/B2 repeated near/far leg layering and overlapped contact toe with next hand; B3 is best, but the alternate-leg depth remains subtle under the waist cloth. Stitched3104x1025: A(0,1), B(1568,0),32px pure-magenta gutter,1:1 unchanged source pixels. Strip SHA256:45221bfc53dc0c2588e361c15f5657084add99b4eb890ca18a844907e01f45cf. Part A SHA256:c7b6249b768ea30f5fbe89af62168c8c64935c47ea50d979808dd0c33a710002; B:bdcc478ce24d2160b220eac3ec508cc8665d5c1c76f66ca2856a42543b892941.

- Identity/pose: approved dark eyes, swept hair, white open shirt, rope/waist cloth and sheathed sword retained;8 right-facing phases. Both arms are visible but nearly level rather than20degrees above horizontal. Opposite-leg ordering is less readable than Naruto.
- Scale: top hair/skull width45-48px vs40px idle (swept spikes); visible face vertical span approximately34-36px vs38px idle. No oversized face apparent; head landmarks are partly hidden by hair/lean. Raw grounded bottoms after stitch A778/780/781, B779/779/781; flight bottoms740/739.
- Motion FAIL: packed head-centroid x approximately[161,162,192,225,161,161,199,232]; f3-to-f4 shifts64px left, f7-to-f0 shifts71px left. TopY[45,50,39,47,42,48,37,46]; every lowest pixel y240. Source flight lift is removed by packing.
- Packing FAIL: npm run sprites sasuke imported8run frames atscale0.389 and split1touching group across B's3px gap; f4 toe/f5 hand remain separate. Initial warnings:62,762 total colors and run#7 clipped right1px. node tools/pack-sprites.mjs sasuke --quantize 48 produced48colors but still warns run#7right4px margin intrusion. Cached cleaned frames already contain the initial clipping, so the second report is not evidence that clipping disappeared. run07 bbox reaches x255;21 opaque edge pixels at y61-81 cross the head/face. Do not mark packed-clean; status remains raw pending correction/review.
- Shared palette: quantizing idle+run changes81,851 of83,670 opaque idle RGB pixels; alpha/geometry unchanged. Mean absolute channel change about4.47 levels (RGB L1mean13.40). Approved idle source/reference remains byte-identical.

- References: every generation attached approved model_sheet.png, expressions.png and idle_approved.png. Every Part B also attached selected A; each correction also attached its target candidate. Only the single best pair is versioned, originals preserved.
- Final output: 4096x256 atlas, 256x256 cells, 16 columns, pivot [128,240], ppu128. Idle8 and run8; run durations eight60ms, loop true, total480ms. Exactly48 opaque colors, alpha only0/255, zero magenta remnants. Missing21 CORE and15 optional animations remain expected. Cleaned frames retain pre-quantization colors; public sheet is authoritative for palette.
- Runtime: http://127.0.0.1:5188/?fight=naruto,sasuke&mode=solo&art=custom&debug logged custom sheets for both (2 animations, incomplete preview), no console errors. Sprite Lab loaded actual public sheet.png+anims.json and played run(8) for both. Production build passed.
- Alignment finding (TOOL-013, Claude): footAnchor() in tools/pack-sprites.mjs averages opaque pixels in the bottom20% of each trimmed frame; placeCharFrame() puts that anchor at x128 and every lowest pixel at y240. Changing which foot is low moves the head/torso laterally, while raw flight elevation is removed. Translating an entire pose inside its raw slot cannot fix this relative anchor. Recommend reviewing stable body/phase anchors before approving these loops; do not hand-edit public outputs.

Recommendation: fix alignment and the clipped face edge before approval, with v02 or an approved packer anchor solution. Three B attempts are exhausted for this round; v01 remains needs review, with no next attack generation.


## 2026-10-09: run v02 placement revision, needs review

User requested the recommended fixes. Run v01 is rejected/superseded and archived under raw/_rejected/; its A/B sources remain preserved. Run v02 and its A/B copies are byte-identical to v01: no new drawing or resampling. The versioned JSON sidecar applies explicit final-cell offsets before packing/clipping. The packer reimports original source on sidecar change, so previously clipped source pixels are recovered.

- Identity and source pixels preserved; face recovered by reimporting original source before placement. 8 right-facing poses; horizontal head-centroid range 1.2 px; half-cycle jump 0.2 px, loop jump 0.3 px. Grounded soles y240; flight f3/f7 y224. Frame07 bbox x39..185, 70 px clear at right. 48 colors, hard alpha, no clipping or final pack warnings; 21 missing CORE expected. Mobile-width playback checked; alternating legs remain subtle. Recommend user review of v02.
- Cell 256x256, pivot [128,240], ppu128 and bodyHeight204 unchanged; run timing is eight60ms frames (480ms loop). All idle frame geometry and approved raw/reference copies remain unchanged. Public quantized RGB may differ from cleaned pre-quantization frames; comparison checks alpha/geometry.
- Commands: npm run sprites naruto sasuke; node tools/pack-sprites.mjs naruto sasuke --quantize 48. Final report has zero warnings; 21 missing CORE and15 optional animations per character remain expected.
- Mobile review: /art-review.html?c=sasuke&a=run uses exported versioned originals and content-hashed sheet/meta. Browser at390x844 verified selection, pause/step and zoom with no document overflow or console errors. Physical phone confirmation remains with the user.
- Recommendation: review the corrected v02 at actual speed, including opposite-leg readability. It is packed, not approved; no next animation is generated.

- Release verification: production build and all160 packer regression tests passed. Public gallery https://gcd-tourney.vercel.app/art-review.html?c=sasuke&a=run is available without login; selected originals and packed exports match local files byte-for-byte. Deployment dpl_5FpjDBc4RffrPvPMoDciYJoqLkKZ (concurrent mobile release) already included the gallery. No extra deployment was needed.

- Hosted game integration rechecked after v02: custom-sheet log for both fighters (2 animations, incomplete preview); no console errors. Full CORE completion still required for normal automatic activation.
