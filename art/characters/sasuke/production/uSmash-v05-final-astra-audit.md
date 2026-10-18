# Sasuke ENG-112 uSmash v05: Astra audit and corrected-atlas recheck

**Latest result: PASS for corrected-atlas visual anatomy, complete assembly and clipping; numerical intrinsic segment tolerances and runtime contact remain unverified. See final recheck below. Earlier HOLD sections are retained as diagnostic history.**

Date: 2026-10-18. Auditor: GPT-6 Astra, medium. Worktree: `.worktrees/art-normals-sasuke`, branch `art/normals-sasuke`.

**HOLD for final packed-atlas anatomy/scale clearance. The reported f3 .45 versus f5 .90 head result is not supported by the source drawing: their visible heads are approximately the same size.** This diagnostic supports a probe/import investigation before another drawing attempt. It does not establish that the packer is correct or that every body segment meets tolerance. The user-approved drawing remains approved as drawn; this audit grants no new image approval.

## Scope and exact evidence

The parent reported that the strict dry-run failed and returned the candidate to `_qa_hold`. The current public atlas has no uSmash entry. Therefore this is explicitly a source-candidate diagnostic, not the requested final atlas audit. No art, sidecar, manifest or atlas was modified.

- Source: `art/characters/sasuke/raw/_qa_hold/uSmash_v05.png`, 2172 x 724 px; SHA-256 `f045866844854d730da55fdc83a1c916f8315902a54e40f650fe08f3e62b3962`.
- Approved neutral: `public/art-review/title-style-pilot/sasuke-neutral_v01.png`; SHA-256 `fbc6b37701c9055b7e1349aec0b1f035ed1aa21638a66541ffbf71ba3e222352`.
- Approved combat: `public/art-review/title-style-pilot/sasuke-combat_v01.png`; SHA-256 `4b1c4fec691c6d29e42be5e02ee5f1b72c431f0df281ce8122276b93e3e185d7`.
- Contract: `art/scale/title-style-pilot/PRODUCTION_CONTRACT.md`, ADR 0029. Exact reference cells control anatomy; posed heights are not standing-size targets.
- Scratch views: `E:/Vibe Coding/.codex/visualizations/2026/10/18/01a14c8c-4884-7102-a8e0-efa63fbe6bb6/usmash-source-audit.png` and `usmash-grid-0.png`, `usmash-grid-1.png`. Grid views preserve native source pixels with 40px coordinate marks. The overview is uniformly reduced and is not a measurement artifact.

## All eight source frames

Head envelopes below are hand-read hair-inclusive extents in native source pixels, approximately +/-8px in width/height because spiky hair, collar overlap and pose obscure endpoints. They are not intrinsic skull measurements. This uncertainty cannot certify the .97-1.03 head gate, but can distinguish an approximately twofold change from similar-size heads. Feet remain near source y620 in every pose.

| Frame | Approximate head envelope W x H | Anatomy/pose finding |
|---|---|---|
| f0 | 80 x 82 | Combat guard; narrow waist, two bent arms, spread legs; open shirt/rope/sheathed sword read coherently. |
| f1 | 80 x 78 | Partial crouch and forward lean; head remains same visual size; bent knees compress occupied height. Both forearms/hands remain attached. |
| f2 | 80 x 78 | Deep crouch, lead hand touches ground; shoulder-to-hand chain lengthens in projection as elbow opens. Head is tilted, not halved. Hip and knees are occluded by cloth. |
| f3 | 80 x 80 | Rising upward punch; hair around source y272-350, raised fist around y223. Head is comparable to f0/f5, not half-size. Torso unfolds and both legs remain bent. |
| f4 | 80 x 80 | Full high extension; hair around y245-320, fist around y142. Visible raised arm is long because elbow straightens; torso extends upward. No duplicate arm or detached fist. |
| f5 | 80 x 82 | Retracting fist near crown height; hair around y288-370. Both elbow bends and lowered torso are readable; no doubling of head width or height relative to f3. |
| f6 | 80 x 82 | Recovery guard; two complete arm and leg chains, consistent shoulder/clothing volume. |
| f7 | 80 x 82 | Returns to f0-like open-palm guard; head, shirt, rope, leg mass and footwear visually match starting pose. |

The f3/f5 head size ratio from these readable envelopes is roughly 1.0, with conservative uncertainty about +/-0.2; it is not plausibly .5. A hair-top search beginning at the highest occupied pixel could encounter the raised fist/forearm before the actual hair in f3/f4. This is a **plausible diagnosis**, not proof of which detector step failed; no exact detector mask or successful packed candidate was available for inspection.

## Whole-body and reference comparison

All eight figures preserve the approved visual identity: angular dark hair, slim torso, open white shirt, purple rope, dark wide upper trousers tapering at shins, sandals and a sword sheathed behind the waist. No source-level twofold scale pop, extra limb, disconnected joint or sudden build inflation is visible. f0/f7 provide a useful same-pose consistency check. f3/f4 enlarge the occupied height through arm extension and a rising torso; shrinking them to the crouch bounding height would create a scale error.

Torso, arms, legs and footwear were each inspected across all frames. Projected collar-to-rope separation changes with lean/extension, approximately 60-100 source px with +/-10px endpoint ambiguity. Shirt collar and rope conceal anatomical shoulder/hip joints; baggy trousers conceal knee/hip centers. Fists and sandals rotate between poses. These observations cannot independently certify intrinsic segment lengths within a narrow percentage tolerance. No numerical torso, arm, leg or shoe pass is claimed. Likewise, source pixels cannot be directly compared with 256px approved cells until the actual import scale is established; there is no approved standing-height resize inferred here.

The source figures are intact, but their spacing is not a reliable eight-equal-cell grid. Dividing 2172 by eight puts tiny adjacent-foot fragments into some diagnostic panels near f5/f6/f7 boundaries. This is an overview slicing artifact; it must not be mistaken for source amputation or used as a production frame extraction rule. Actual packer segmentation and final cell boundaries remain to be checked.

Every frame and the f7-to-f0 return were inspected statically. The sequence reads crouch, rising uppercut, high extension, retraction and guard. Temporal playback, hit/hurtboxes, loop metadata, ground alignment and contact were not verified; they require a successful candidate pack and Claude runtime review.

## Required next evidence

1. Inspect the failing detector mask/selected region for f3/f4 and compare it with the real hair around the coordinates above. Preserve the current source and do not hide the result with a broad exemption.
2. Produce a correctly segmented, quantized candidate atlas at the measured import scale. Confirm each frame is from this source hash and inspect for neighboring-foot fragments, clipping and scale changes.
3. Re-run the complete final anatomy/scale audit on those actual cells against idle and both approved cells. Until then, final atlas clearance remains HOLD.

## Diagnostic quantized atlas follow-up (same audit session)

The parent subsequently produced a non-strict diagnostic pack. It is not eligible for shipping: the strict gate still reports residual head drift near .90 after f3/f4 false-read handling. This supersedes the earlier statement that no candidate atlas was available, but does not supersede the HOLD.

- `public/characters/sasuke/sheet.png` SHA-256 `5ac545e182ff26beda779f44a57a37e28d1af55c58eda15f9c60ac0b92569f0e`.
- `public/characters/sasuke/anims.json` SHA-256 `01f32c74f310be0cb5a4d8dbadc8c10031b209e3b6a9724a34f9865901953edd`.
- uSmash cells 210-217; durations [50,40,30,50,70,70,60,30] ms, phases [3,2,3], loop=false. All eight actual atlas cells inspected, also against actual idle cell 0 and both title cells. Scratch evidence: `usmash-atlas-audit.png` and `usmash-atlas-2x.png` in the directory above. The latter is nearest-neighbor enlargement; it crops outer feet only for the head/torso view, so the full-cell evidence controls clipping.

| Frame/cell | Exact occupied bounds (L,T,R-exclusive,B-exclusive) | Packed anatomy observation |
|---|---|---|
| f0/210 | 74,86,182,241 | Complete guard; head/body visibly smaller than idle, with narrower stance. |
| f1/211 | 84,116,178,241 | Intact partial crouch; no isolated fragment. |
| f2/212 | 84,134,180,241 | Deep crouch and ground hand intact; pose compression is legitimate. |
| f3/213 | 78,64,179,241 | Raised fist above actual head; actual hair around y87-123, not around fist y64. |
| f4/214 | 78,28,180,241 | Full extension; actual hair around y74-109, far below fist y28. |
| f5/215 | 78,93,180,241 | Retracting guard; actual head remains comparable to f3/f4. |
| f6/216 | 78,86,180,241 | Complete recovery; no frame assembly contamination visible. |
| f7/217 | 71,85,185,241 | Complete return guard, similar to f0; slightly wider stance. |

Hand-read packed hair envelopes are approximately 34-36px wide and 35-37px high in f0-f7 (endpoints +/-2-3px); current idle is approximately 39-40px in these dimensions. Approximate readable boxes: f0 x111-145/y86-123; f3 x109-144/y87-123; f4 x108-143/y74-110; f5 x112-148/y93-130. These are manual silhouette readings, not a replacement segmentation algorithm or precise skull measurements. The reference combat hair is approximately 38-40px, also consistent with idle. The observed smaller candidate heads support the residual .90 result, while the actual f3/f4 heads visibly rule out their .45/.49 readings as true twofold shrinkage.

Across all eight packed cells, torso, arms, legs, build and clothing volume remain coherent within this strip. The shirt/rope/upper-leg silhouette looks compact versus idle at the present import scale; no unrelated arm, leg or shoulder swelling suggests that a uniform correction would distort only one region. Sandals look modest, not conspicuously enlarged. Intrinsic lengths remain obscured by fabric and foreshortening, so no narrow numerical full-body tolerance is certified.

**Recommendation:** a uniform importer experiment of `1 / .90 = 1.111...` is justified by the readable-head evidence and preserves all source proportions and frame-to-frame relationships. Do not resize crouches independently. This is a measured starting factor, not a guaranteed final pass: repeat the head measurements and full-body inspection after quantization. A minimum .97 head target would imply 1.078x from .90, but targeting the center gives better head margin if the measurement is trustworthy.

At 1.111x about ground y240, f4 top y28 predicts approximately y4.4, while its width grows from 102 to about 113px. It should fit a 256px cell, but only roughly 4px of upper margin remains; actual rounding, pivot placement and quantization must be checked. Other cells have greater top margin. Feet proxy .97 would rise to about 1.078 under ideal uniform scaling; that proxy is color-area-derived, not actual sandal length. Inspect actual footwear and do not declare a foot failure solely from it. No loop or runtime contact pass is granted.

**Current result remains HOLD:** candidate import is undersized at the readable head, strict pack is not passing, and the proposed corrected atlas has not yet been inspected.

### Skull-landmark calibration limitation

The parent asked for exact per-frame skull-to-chin source measurements for a manual sidecar. None can be certified from these images: hair hides the skull crown in all eight poses, and neck/chin or collar overlap adds uncertainty. The hair-inclusive envelope measurements above must not be relabeled as skull-to-chin lengths. `tools/pack-sprites.mjs` computes sidecar scales as `targetHeadPx / sourceHeadPx[k]`; its target is output pixels (allowed 8..64), not source-equivalent units. Repeating an invented source length eight times would produce uniform scaling mathematically but would not be anatomical measurement evidence. A true uniform import multiplier or explicitly uncertain landmark calibration is required; no exact skull array is supplied by this audit.


## Final corrected strict-atlas recheck

The parent applied manifest `packScale: 1.111` uniformly, preserved raw source pixels, and retained version-specific f3/f4 probe exemptions. The parent reports strict pack passes. I inspected the resulting actual quantized cells 210-217, not cached frame PNGs.

- Final sheet SHA-256: `757c68ccd749c8184221d9e2082c6961f867b469756ec3d2f5fb79a9f04f6a1a`.
- Final anims SHA-256: `e17f1238c9d07ae67e303bd2d45572266f5571e09fbd6ba192c4db14880c4fc5`.
- Final full-cell evidence: `E:/Vibe Coding/.codex/visualizations/2026/10/18/01a14c8c-4884-7102-a8e0-efa63fbe6bb6/usmash-final-atlas.png`.

| Frame | Exact alpha bounds L,T,R-exclusive,B-exclusive | Head probe |
|---|---|---|
| f0 | 68,68,188,241 | .974 |
| f1 | 79,102,183,241 | 1.000 |
| f2 | 79,122,186,241 | 1.000 |
| f3 | 72,44,184,241 | .500, false raised-arm region |
| f4 | 72,4,185,241 | .553, false raised-arm region |
| f5 | 72,76,186,241 | .991 |
| f6 | 72,68,186,241 | 1.000 |
| f7 | 65,68,191,241 | .968 |

Readable head range is **.968-1.000**, median **.9955 (reported .996)** excluding f3/f4. f7 is .002 below a literal .970 target; this is not a claim that every frame mathematically meets .97-1.03. The current gate records `ok`. Non-exempt probe boxes measure about 37-39px wide and 37-43px high (hair tilt explains the f2 height), versus idle reference 39x38. Actual f3/f4 hair remains visually about 38-40px, with +/-2-3px manual uncertainty. Their detector boxes are x153-168/y54-76 and x155-171/y14-40, respectively: those regions are the raised arm, not the actual head. These two scalar results cannot be interpreted as anatomy shrinkage.

**Clipping/placement PASS:** f4 reaches y4, leaving exactly four empty top rows. Its raised fist is complete, with no cut fingertip or edge contact. All frames end at sole y240. All silhouettes have at least 65px horizontal margin on the left and 65px on the right; no neighboring fragments or clipped hands/feet are visible. The small f4 top margin is real and must not receive another blind enlargement.

**Visual whole-body PASS:** all eight corrected cells were compared with idle and approved neutral/combat references. Head scale now reads consistent. Slender torso, shoulder width, sleeve volume, rope/hip drape, bent and extended arm chains, trouser mass, shins and sandals remain coherent through crouch, rise, full extension and recovery. f0/f7 match each other; the narrower stance than idle is a pose difference. f3/f4 show continuous shoulder-elbow-wrist paths and intact hands, with no isolated limb stretch or inflated torso. f1/f2 preserve crouch compression. No visible anatomy defect warrants another generation based on this recheck.

**Footwear inspection:** reported feet median proxy is 1.106, range 1.045-1.286. The raised-arm frames can contribute similar pale colors elsewhere; the contract forbids interpreting this color-area proxy as actual sandal length. Both sandals are intact and visually comparable in length/volume with idle/reference, without a visible large-foot jump. Their projected contours change with stance. I do not certify a numeric intrinsic footwear tolerance from these occluded/rotated shapes.

The uniform import correction fixes the demonstrated undersize without introducing visible frame-to-frame proportion changes. **Final verdict: PASS for visual anatomy, actual-cell assembly and clipping for this exact corrected atlas.** Head, torso, arms, legs and footwear were all inspected; hidden skull/joint landmarks still prevent certified narrow intrinsic segment percentages. Runtime hit/hurtbox contact, timing, attack recovery and in-game playback remain Claude checks. This non-looping attack was inspected in sequence and at the return-to-guard boundary statically; no seamless-loop claim is made. The user's drawing approval is separate and was supplied by the parent; this audit does not approve images or authorize production integration.
