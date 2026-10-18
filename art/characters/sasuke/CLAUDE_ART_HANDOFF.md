# ENG-112 Sasuke normals handoff

Branch `art/normals-sasuke`; real worktree `.worktrees/art-normals-sasuke`. This handoff is at
the Astra/medium final audit result: HOLD for all six packed candidates. No drawing is user-approved, and no merge or
production deployment was performed.

## Candidate state

The separate Astra audit returned HOLD for all six packed candidates. Four other moves remain on their established gameplay fallback after layout/contact failures. Older saved versions remain preserved in `raw/` or `raw/_qa_hold/`.

| Move | Saved version | Calls | Current state | QA evidence |
|---|---:|---:|---|---|
| fTilt | v01 | 3/3 | Technical hold; `raw/_qa_hold/` | Packed QA split figures across columns. No atlas strip. |
| uTilt | v01 | 1/3 | Technical hold | Astra found f3 hitbox on foot; override now covers overhead hand/forearm, f2 remains on rising hand. No certified idle scale baseline or lab check. |
| dTilt | v02 | 2/3 + 3 unusable extra calls | Technical hold | Astra found waist/stomach strike instead of shin height. Source unchanged; no retained replacement. Scale baseline absent. |
| dashAttack | v03 | 3/3 | Technical hold; versions v01-v03 in `_qa_hold/` | f2 has no clear strike limb; the source pose group still touches across frame columns. No atlas strip. |
| fSmash | v02 | 3/3 cumulative | Technical hold | Astra HOLD; no certified idle body/head scale baseline. f1 is the charge pose. No calls remain. |
| uSmash | v03 | 3/3 | Technical hold; versions v01-v03 in `_qa_hold/` | Active f3 remains a guarded pose without an overhead strike. No atlas strip. |
| dSmash | v03 | 3/3 | Technical hold; versions v01-v03 in `_qa_hold/` | Active f4 clips 1 px past the 4 px cell margin. No atlas strip. |
| fair | v03 | 3/3 | Technical hold | Astra HOLD; no certified idle body/head scale baseline. Lab contact unverified. |
| bair | v01 | 1/3 | Technical hold | Astra found f2/f3 boxes pointed forward; overrides now follow rear kicking foot screen-left. No certified idle scale baseline or lab check. |
| uair | v01 | 1/3 | Technical hold | Astra HOLD; no certified idle body/head scale baseline. Lab contact unverified. |

## Generation provenance

All calls attached only these approved identity/scale references:

- `art/characters/sasuke/reference/model_sheet.png`
- `art/characters/sasuke/reference/idle_approved.png`
- `public/art-review/title-style-pilot/sasuke-neutral_v01.png`
- `public/art-review/title-style-pilot/sasuke-combat_v01.png`

The built-in image-generation service stored original outputs under
`E:\Vibe Coding\.codex\generated_images\01a14dbf-5160-7970-91c6-9c01dbef4cbf\`. The `exec-*.png`
suffix binds each output to its exact generation call; selected or held images were copied into this
worktree without overwriting the originals. Calls used these prompt directions:

| Move / attempt | Output call suffix | Prompt intent / result |
|---|---|---|
| fTilt 1 | `f15e6151-e5a6-4ef2-bb40-c92a570c2747` | Seven-frame chest-height lead straight; unavailable as a filed candidate. |
| fTilt 2 | `3e037a7f-8360-4b0c-8e0d-da68071f1f6b` | Accidental two-frame generic strip; not used. |
| fTilt 3 | `5e55537a-cb25-47f9-90bd-59882caa7175` | Seven-frame chest punch; saved as v01, later technical hold for touching columns. |
| uTilt 1 | `01f80a1c-4539-4cd9-b3d8-88b8a14641ef` | Seven-frame upward arm arc from face to overhead. |
| dTilt 1 | `c044b677-d97b-4332-8d6e-6c4d527677cc` | Six-frame low shin poke; v01 clipped in a wide crouch. |
| dTilt 2 | `505eaa5c-d0a5-45e5-8cbd-1e70cead26ae` | Narrowed crouch/compact low poke; selected v02. |
| dashAttack 1 | `64d40a23-2f35-48ab-9519-c0881463b160` | Seven-frame running lunge and chest punch. |
| dashAttack 2 | `671ca0ba-9849-4c6b-b28e-87e5ecdc3afb` | Narrower lunge and in-cell strike. |
| dashAttack 3 | `3559b905-8ca6-4c07-8e4a-00ec670ed4f8` | Wider source gaps; still held after f2 strike/contact and touching-group QA. |
| fSmash 1 | `c6950c86-c5e2-4ad0-b4f9-7b701761ae5d` | Nine-frame coiled rear-fist smash; f1 charge pose. |
| fSmash 2 | `3c27b850-c7f7-4211-b4eb-284b6056d13f` | Added column gaps; selected v02. |
| fSmash 3 | `e2df7bcf-d6ff-429a-8eac-7cc02693658e` | Final wider-gap attempt; v03 held for margin clipping. |
| uSmash 1 | `da4a2c53-df4b-48c6-bebc-edc4f7951cf1` | Eight-frame rising overhead strike. |
| uSmash 2 | `f765195e-5af4-4c2d-83c4-ff1020d0c4f6` | Wider column gaps; active f3/f4 still lack a clear strike. |
| uSmash 3 | `95624328-991c-493f-8b94-6459f3bd35e3` | Put the first overhead arm extension into active f3; f3 still held in guard. |
| dSmash 1 | `b339dcf0-c50d-496c-abe7-228651935a74` | Eight-frame low sweep behind then in front. |
| dSmash 2 | `0fb8730c-1ba8-4d02-aacf-e09478773c13` | Compact two-sided sweep; margin still failed. |
| dSmash 3 | `6526fd3b-7af1-4a2d-b3f6-67f198b1a8bf` | Final margin-focused sweep; f4 remains 1 px clipped. |
| fair 1 | `aaf906eb-872d-4215-a200-2924c6081911` | Six-frame forward aerial kick. |
| fair 2 | `8406b75d-73e3-4212-bc95-6613c0dd9e05` | Shorter active leg and broader gaps. |
| fair 3 | `60a52d20-b539-48d8-b988-421e57b3ba85` | Final in-cell aerial kick; selected v03. |
| bair 1 | `20cff6b9-4595-47b0-9f35-49c9bcd1db9f` | Six-frame aerial kick screen-left behind the body. |
| uair 1 | `b5dc8afb-d83d-4666-99b6-8e5d0d503e7a` | Six-frame straight-up aerial kick. |

## Validation and limits

- `node tools/pack-sprites.mjs sasuke --quantize 48` returned exit 0. Final atlas: 6 eligible
  moves / 40 frames, 48 colors. It is partial by design: fTilt, dashAttack, uSmash and dSmash are
  absent and keep fallbacks. `approvedVersion` remains null for all ten moves.
- The packer cannot measure scale because the worktree contains no packed idle animation. It also
  reports unrelated stale-cleaned-frame notices from the sparse checkout. Raw generated files use
  smooth cel shading and a high source color count; the quantized atlas meets the 48-color target,
  but strict hard-pixel fidelity still needs Astra's inspection.
- `node tools/body-sheet.mjs sasuke uTilt dTilt fSmash fair bair uair --out public/reviews/normals-sasuke/body`
  reported “no idle packed - nothing to measure against”; `body-report.json` has no fighter measurements.
- `node tools/lineup.mjs sasuke --rows idle:0,uTilt:2,dTilt:2,fSmash:4,fair:3,bair:3,uair:3 --out public/reviews/normals-sasuke/lineup-normals-sasuke.png`
  reported “no idle animation” and “no idle packed”; its blank idle row makes the output diagnostic, not a scale pass.
- The Sprite Lab could not be reached from the browser surface (`ERR_CONNECTION_TIMED_OUT`); the
  restricted shell also rejected the local socket request. Gameplay hitbox landing is unverified.
- The review page shows each move's frames beside the approved idle and its original stand-in. The
  six packed loops use quantized atlas cells. Technical-hold loops use source-only sliced frames and
  are explicitly labeled as non-packed.

## Astra audit and follow-up (2026-10-18)

- Astra's final result is HOLD for all six packed candidates; this branch has no certified idle body/head scale baseline. Confirmed findings: uTilt f3 hitbox was on the foot; bair f2/f3 boxes pointed front/right while the strike travels left; dTilt v02 reads waist/stomach height instead of the directional-normal brief's required shin-height strike. The final contact-box recheck passes static pixel placement for corrected uTilt f3 and bair f2/f3 boxes; runtime hit landing remains unverified.
- Non-generation fixes changed Sasuke `hitboxes.json` for uTilt f3 and bair f2/f3 only. dTilt v02 is unchanged and held; no new art candidate was retained.
- Process breach: after the parent authorized only dTilt's one remaining call, three imagegen calls were issued while trying to retrieve a result that the first wrapper did not display. No output was saved, inspected, or used. Tool call IDs/results were not exposed to this agent. The extra calls exceed the dTilt budget; no further Sasuke imagegen calls are permitted.
- Packed review PNGs and GIF frames were rebuilt from quantized atlas cells. Authored frame durations came from `public/characters/sasuke/anims.json`; GIF stores centiseconds, so 35/45 ms values round to 30/40 ms. Hold GIFs remain source-only previews, not atlas evidence.

### Astra frame audit measurements

Candidate atlas SHA-256: `4cc0ee4258fd86538a4bad269f46378a445dfd49137de2580bf6b9c29dc8fa81`; decoded RGBA SHA-256: `3a4a1aeda267077a90ff13bbde7e255e367c47fed017587e4854b96a65dea011`. Reference is current main's packed idle f0 (SHA-256 `7ad5eab46eab261fb043c073ee44a5a8a5b9f69195494c24f6a9865f7980aa06`), 38×38 px head probe and 2,816 px garment-color count. These are in-memory diagnostics against a cross-pack reference because the candidate worktree did not pack idle; they are not certified pass measurements.

| Strip | Head ratios by frame | Body B ratios by frame | Astra finding |
|---|---|---|---|
| uTilt v01 | .921, .950, invalid, invalid, .942, .921, .921 | .831, .719, .815, .972, .841, .842, .826 | HOLD; raised arms confuse head segmentation; f3 box was on the foot and is now corrected. |
| dTilt v02 | 1.036, 1.026, 1.026, 1.033, .974, 1.023 | .829, .837, .782, .799, .836, .839 | HOLD; strike reads waist/stomach, not shins. SPEC legacy LOW/stomach wording conflicts with the normals brief. |
| fSmash v02 | 1.034, .974, 1.053, 1.029, 1.048, 1.001, 1.046, 1.079, 1.026 | .933, .901, .815, .878, .972, 1.038, .801, .903, .913 | HOLD; head values exceed 1.03 on several frames; body/build cannot be certified. |
| fair v03 | 1.060, 1.073, 1.072, 1.079, 1.053, 1.059 | .688, .635, .716, .723, .707, .682 | HOLD; head readings exceed 1.03; low B readings are inconclusive due pose/palette noise. |
| bair v01 | 1.026, 1.053, 1.036, 1.033, 1.053, 1.053 | .903, .789, .750, .775, .765, .904 | HOLD; registration center shifts about 49 px left f0→f1 then returns by f5; boxes now follow the rear foot. |
| uair v01 | 1.017, invalid, .947, .947, 1.000, 1.014 | .778, .728, .762, .782, .751, .785 | HOLD; f1 raised arm confuses head segmentation; no defensible scale/body-volume pass. |

Body B uses selected garment colors and has about ±10% pose noise plus cross-pack palette uncertainty; low values do not prove equivalent physical shrinkage. A 1 px landmark shift is roughly 2.6% of the 38 px reference head. All six have complete visible limb chains and no obvious chibi conversion or cell-edge clipping; the sword remains sheathed wherever visible, but occlusion prevents certification in every frame. All frames' lowest opaque pixel is y240, which confirms atlas placement only. Gameplay contact and landing were not checked.

Review export validation: all 40 packed review PNG crops match their atlas cells exactly, including RGBA. Six GIFs have correct frame counts; fSmash and bair durations match metadata, while the other four round 35/45 ms to GIF's 30/40 ms 10 ms resolution. GIF palette conversion changes some opaque RGB and makes transparent pixels black, so use exact-cell PNGs for pixel/color inspection.

No merge, PR, approval request, or production deployment was performed.
