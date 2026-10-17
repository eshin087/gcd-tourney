# Beam struggle: final Astra atlas audit v01

Date: 2026-10-17. Auditor: GPT-6 Astra, medium reasoning. Branch: `art/beam-clash-r3`. Scope: seven already user-approved live strips; read-only art audit. This report does not withdraw approval, authorize a redraw, change a manifest, or approve a release.

## Result

| Fighter / strip | Version | Final audit result | Reason |
|---|---:|---|---|
| Naruto beamStruggle | v02 | PASS, visible anatomy and loop | Head, jacket, limb chains and sandals remain compatible with approved combat anatomy; no missing/cut limb; modest three-frame motion. |
| Sasuke beamStruggle | v01 | HOLD, anatomy | Torso and legs are markedly shorter than the combat reference and idle while the head stays near reference size. This is not explained by a lower posed bounding box alone. |
| Sasuke beamStruggleAir | v01 | HOLD, loop and measurement confidence | Mouth/head translate substantially; concealed folded legs cannot support a confident length pass. |
| Killua beamStruggle | v01 | PASS, visible anatomy and loop | Small build and costume remain compatible with the combat reference; no clear segment discontinuity across the three poses. |
| Killua beamStruggleAir | v02 | HOLD, loop | Anatomy is visually plausible under knee foreshortening, but the palm drops in the surge and jumps back at the seam. |
| Gojo beamStruggle | v01 | PASS, visible anatomy and loop | Long slim limbs, hair/blindfold, jacket and shoes remain coherent; small ground loop. |
| Gojo beamStruggleAir | v01 | HOLD, loop | Crown moves 12 px vertically; the pointing fingers and torso translate substantially between f0 and f1 and at the seam, exceeding the brief's restrained 1-2 px give. |

**Meaning of PASS:** no material visible anatomy/scale or loop defect found at native density and enlarged nearest-neighbor inspection, within the measurement uncertainties below. It is not a certified all-segments-within-6-percent anthropometric result. The latter cannot be established from these raster landmarks, and is expressly **not passed** here. Hidden or foreshortened limbs are not silently assigned a numeric pass. Existing user image approvals remain unchanged for every row, including HOLD.

## Inputs and method

- Read main coordination/control/inbox Round 3 and the approved `art/scale/title-style-pilot/PRODUCTION_CONTRACT.md`; inspected exact neutral/combat v01 cells, not a historical universal height or head ratio.
- Extracted every frame directly from each current `public/characters/<id>/sheet.png`, using that character's `anims.json` frame list. All use 256x256, 16 columns, pivot [128,240]. Ground resolves to 175,176,177; air to 178,179,180. These indices were read, not assumed.
- Compared all 21 target cells with each approved neutral/combat cell and current atlas idle f0 at **one pixel density**. Inspected both 0->1->2 and 2->0 transitions frame by frame. This is a raster/sequence audit, not a gameplay, contact/hurtbox, or real-time browser validation.
- All seven JSON loops are `true` with [70,70,70] ms (210 ms/cycle). No packer, scale tool, art generator, or atlas write was run.
- Exact alpha bounds and hashes are machine measurements. Anatomy landmarks are hand-read on 16-px coordinate grids at 3x nearest-neighbor zoom. Visible endpoints have approximately +/-2-3 px uncertainty; shoulder/hip centers under garments +/-4-6 px; occluded joints can exceed +/-8 px. Segment distances are projected 2D distances, not reconstructed skeleton lengths.
- Source crown uncertainty in the contract is +/-12 source pixels, about +/-2.7-3.1 packed pixels. This compounds with landmark ambiguity. Hair, clothing and posed bounds are kept separate from anatomy; no crouch was scaled to standing height.
- Head measurements below include hair and face to chin, excluding headband tails. T is collar/base-of-neck to waistband center; A is a visible shoulder-elbow-wrist chain; L is hip-knee-ankle chain. Shoes are visible heel-to-toe length along their drawn axis, excluding the ankle shaft. These are inspection estimates, not color-count probe scores.
- Working idles (manifest): Naruto v07, Sasuke v07, Killua v11, Gojo v08. Idles are comparators, not replacements for the approved neutral/combat contract. Killua's and Gojo's upright idle torsos project longer than their combat cells; this uncertainty is retained rather than forced into a numeric pass.

## Measured anatomy evidence

Native packed pixels; ranges summarize visible pose/landmark variation across f0-f2, with uncertainties **additional** to each range. These deliberately rounded measurements do not claim single-pixel anatomical precision.

| Target | Head incl hair W x H | Torso T | Visible arm A | Visible leg L | Shoe length | Interpretation |
|---|---|---|---|---|---|---|
| Naruto ground f0-f2 | about 34-38 x 35-39 | about 35-41 | about 45-51 | about 73-79 | about 31-35 | Compatible with combat/idle: head about 35-38 x 36-40, T about 39-43, A about 47-53, L about 72-78, forward sandal about 31-34. |
| Sasuke ground f0-f2 | about 34-39 x 38-42 | about 23-29 | about 53-62; shoulder partially hidden | about 63-70 | about 29-33 | Combat/idle T about 39-44 and L about 83-90; torso/leg reduction is larger than plausible landmark error. Arm is relatively long against the compressed trunk; do not treat its uncertain shoulder as a precise excess ratio. |
| Sasuke air f0-f2 | about 37-42 x 39-44 | about 36-43 | rear chain roughly 49-58, shoulder hidden by sleeve | NOT confidently measurable under overlapping robe/trousers | about 27-32, rotated | Head/trunk broadly compatible; leg-length certification held. The trailing silhouette is clothing, not a measured femur. |
| Killua ground f0-f2 | about 41-45 x 37-42 | about 32-37 | about 36-42 | about 49-57 | about 27-31 | Combat T about 34-39, A about 35-41, L about 52-59, shoe about 28-31; upright idle T about 39-43. Mild projected torso shortening is consistent with leaning, but not a measured +/-6% certification. |
| Killua air f0-f2 | about 40-44 x 37-41 | about 31-36 | about 39-46 | projected folded chain about 44-52; depth uncertain | about 27-31, rotated | No clear lost limb or shoe growth. Shorter projected thigh is consistent with tuck/foreshortening, not evidence that its true length passed. |
| Gojo ground f0-f2 | about 35-40 x 34-39 | about 63-69 | about 69-76 | about 104-113 | about 33-38 | Compatible with combat T about 65-71, A about 68-77, L about 105-115, shoe about 34-38. Neutral/idle T about 73-80 is longer in projection; no uniform shrink factor is inferred. |
| Gojo air f0-f2 | about 36-41 x 35-39 | about 61-70 | about 65-75 | projected chain about 96-109, bent | about 32-37, rotated | Slim build and jacket volume remain plausible; knee flexion and depth prevent a strict chain-ratio certification. Loop is independently held. |

Representative reproducible landmarks (x,y, native cell coordinates; chosen joint centers are estimates):

- Naruto ground f0: T (145,123)->(128,159), about 40 px; L (130,173)->(173,183)->(178,215), about 77 px. Combat/idle corresponding leg chain is about 75 px. Hair/headband tails are excluded from these endpoints.
- Sasuke ground f0: T (127,157)->(117,179), about 24 px; L (126,191)->(161,207)->(173,231), about 65 px. Idle T (120,104)->(119,145), about 41 px; L (127,164)->(168,190)->(178,226), about 85 px. Even allowing +/-6 px joint ambiguity, this is a strong shortening signal. Do not resize the whole sprite: its head and hands would also change.
- Killua ground f0: T (139,157)->(125,188), about 34 px; combat T (129,138)->(128,174), about 36 px. Idle T (128,124)->(131,164), about 40 px. This is why a pose-aware combat comparison and a stated uncertainty are necessary.
- Gojo ground f0: T (130,66)->(143,129), about 64 px; combat collar-to-waist approximately 67 px. Neutral and idle are more upright and longer in projection. Ground forward arm is near-horizontal; air measurements retain the bent-arm ambiguity.

## Every-frame and seam findings

### Naruto beamStruggle v02

f0: two arms resolve to the forward push/support wrist; near palm intact. Jacket thickness and thigh/calf chains remain plausible against combat. f1: torso becomes more upright/left-shifted, head approximately 2 px lower; both arms and both sandals remain intact. f2: shoulders and cupped hand advance, jacket/tails flare; no head-size jump or disappearing limb. The 2->0 seam retracts the palm by several pixels but preserves the lunge and foot baseline. Hair crown y88/90/89; all soles y240. The bounding right edge increases 209->208->214 (exclusive bounds), not an anatomy growth measurement. PASS at visible audit precision; no claim that all segments were proven within +/-6%.

### Sasuke beamStruggle v01

f0: head stays near combat size but the shirt collar-to-rope span and hip-to-ankle chains are visibly compressed. f1 repeats this compressed construction, with a 5 px downward crown shift. f2 preserves the short trunk/legs while robe and rope flare rearward. All limbs remain present, and sandals are complete; no cell-edge clipping. The 2->0 seam is coherent as a loop, but coherent repetition does not cure the scale mismatch. HOLD for torso/leg anatomy across all three frames. This is a finding on an already-approved drawing, not a redraw instruction.

### Sasuke beamStruggleAir v01

f0: tiger-sign hand remains at the lips; other arm extends back; robe and tucked legs overlap. f1: head and mouth advance/down; torso remains similar width. f2: strongest forward head/torso lean; folded knee/robe overlap obscures which contour defines the thigh. Both feet remain visible, though their overlapping orientation changes. Mouth estimates are approximately (176,104), (182,109), (199,113), +/-3 px: about 25 px across f0->f2, much more than the brief's approximately 6 px emission-point stability. The f2->f0 reset is visible in the raster sequence. HOLD for the loop and unverified occluded leg lengths; no claim of a proven anatomical shortening in the air pose.

### Killua beamStruggle v01

f0: small narrow trunk, open forward palm, rear fist at hip, two bent leg chains and high-top shoes are intact. f1: slight left give, clothing folds change without a clear skeletal length change. f2: rear arm/fist drops slightly and shorts/hair react; forward palm remains near its previous location. Hair crown y118/119/120; feet stay at y240. Open fingers and white cuffs are not counted as head area. The ground loop retains costume volume and a coherent small build. PASS at visible audit precision; torso/leg estimates overlap the combat reference within manual uncertainty, without asserting a strict numeric gate.

### Killua beamStruggleAir v02

f0/f1: consistent tucked-knee hover, rear fist at hip, visible open palm. f2: near arm pitches down, moving the palm center from approximately (192,170)/(192,172) to (197,180), +/-2-3 px. The roughly 11 px f0->f2 displacement and return seam are larger than the approximately 6 px brief target. Hair, torso, shorts and shoes retain plausible relative volume; the compact projected thigh is not enough to prove a true shortened bone. HOLD for palm/loop stability; tucked-leg numeric scale remains low confidence rather than passed.

### Gojo beamStruggle v01

f0: two-finger gesture, pocket arm, slim jacket and long trousers all resolve. f1: slight give with stable head size; f2: coat/hair flare and forward hand advances slightly. Crown y26/27/27; fingertip x about226/227/231 at nearly constant y, +/-2 px; soles remain y240. Both shoe shapes remain coherent and neither shoulder nor pocket arm vanishes. The f2->f0 seam is small. PASS at visible audit precision against the approved combat construction, with the longer neutral/idle trunk projection explicitly retained as uncertainty.

### Gojo beamStruggleAir v01

f0: relaxed torso and dangling/bent legs; pocket hand and forward two-finger gesture intact. f1: whole upper body moves back/down; crown goes y27->39, fingers from approximately (227,133) to (212,141), +/-3 px. f2: crown y35, fingertips about (216,141), with changed knee/shoe orientation. Head and clothing do not obviously inflate, but f0->f1 is about 17 px of fingertip translation and f2->f0 resets by about 14 px. This is much larger than the intended subtle Gojo give. HOLD for loop/pose drift. Rotated shoes and bent legs are not resized to a standing box.

## Provenance, exact frame bounds, and unchanged inputs

Version attribution below is the current manifest's approvedVersion plus the Round 3 inbox record. The atlas PNG does not embed a raw-version label; this audit did not repack to independently prove raw-to-atlas provenance. Hashes identify exactly what was inspected. Bounds use [left,top,right,bottom), from nonzero alpha; they are occupancy evidence, not anatomical height.

### naruto

`beamStruggle` approved v02; bodyHeight 153; frames [175, 176, 177].

| Local frame | Atlas index | Exact alpha bounds | SHA-256 of decoded 256x256 RGBA bytes |
|---|---:|---|---|
| f0 | 175 | [51, 88, 209, 241] | `6c49cfc6a54541d7bcea2e4e45bac273bd16c65131548e8c432533c5020f07ec` |
| f1 | 176 | [50, 90, 208, 241] | `6ec78da1895761bc36e659865db3ac727a905ba6216083601b2d20b0a62f0d08` |
| f2 | 177 | [49, 89, 214, 241] | `f52b2219cc1266528ccb07f675962a97fa54c7cbb6e5b56dd82f1fa980edeabe` |

| Input | SHA-256 file bytes |
|---|---|
| `public/characters/naruto/sheet.png` | `06d57c2ace6913c6f8f61898655f59b126f6d09474fb2341e31ed3951e3d2ceb` |
| `public/characters/naruto/anims.json` | `f8a01ed5640eb57cac16ca5f9a0350b88f8998d0f980f83916726aea50623fdc` |
| `public/art-review/title-style-pilot/naruto-neutral_v01.png` | `acfd7240f9ee7fbe71c1b6c50ea8a269ceedeb05de44b929850ca8de06a0610f` |
| `public/art-review/title-style-pilot/naruto-combat_v01.png` | `cdc6ff9838bbae102301b738ef7596be3b2cc8ecb6f24c98d27c02a0bb479751` |

### sasuke

`beamStruggle` approved v01; bodyHeight 122; frames [175, 176, 177].

| Local frame | Atlas index | Exact alpha bounds | SHA-256 of decoded 256x256 RGBA bytes |
|---|---:|---|---|
| f0 | 175 | [55, 119, 196, 241] | `0f09537d983f368b76d5c1c996e7a4c364e5c2304a4e6624207077c897783b0e` |
| f1 | 176 | [53, 124, 197, 241] | `55ba180cfb56174a4b789e0d411e7d7e7dd47b10c330dc894c4931694681cb7c` |
| f2 | 177 | [52, 120, 200, 241] | `b0c030492ea6582d88bc607bcd0137c776d7576079e474251c8bb9d07ac3a2a5` |

`beamStruggleAir` approved v01; bodyHeight 168; frames [178, 179, 180].

| Local frame | Atlas index | Exact alpha bounds | SHA-256 of decoded 256x256 RGBA bytes |
|---|---:|---|---|
| f0 | 178 | [76, 73, 191, 241] | `bfcbe8c302b7d81d8ad24402e2352424bb0e921dacbe35cc608a35821d9f03bd` |
| f1 | 179 | [85, 75, 192, 241] | `daa86cb4f5b352628f2732044d1d09328f64164ad5de07d4341adecb6cc3b6bb` |
| f2 | 180 | [82, 80, 208, 241] | `cddbefff094d8c8a1f3cb42c337880cd11dc72f04cb00e9dc747f443afca19c3` |

| Input | SHA-256 file bytes |
|---|---|
| `public/characters/sasuke/sheet.png` | `40ab6e099dd4c0201a072f1666cdf1696751a7edcb578d8a4a6dcc4b872be873` |
| `public/characters/sasuke/anims.json` | `685dd4019f3efd91812b51e9a801b50c615b6caee467b2dafcd072c0e9a12452` |
| `public/art-review/title-style-pilot/sasuke-neutral_v01.png` | `fbc6b37701c9055b7e1349aec0b1f035ed1aa21638a66541ffbf71ba3e222352` |
| `public/art-review/title-style-pilot/sasuke-combat_v01.png` | `4b1c4fec691c6d29e42be5e02ee5f1b72c431f0df281ce8122276b93e3e185d7` |

### killua

`beamStruggle` approved v01; bodyHeight 123; frames [175, 176, 177].

| Local frame | Atlas index | Exact alpha bounds | SHA-256 of decoded 256x256 RGBA bytes |
|---|---:|---|---|
| f0 | 175 | [56, 118, 196, 241] | `be44c959c2522ebaf752deac6759d7984ba0f9bb42806bc05b66d0ba6be607f9` |
| f1 | 176 | [56, 119, 195, 241] | `b232708f271ee1330dd52d9fc23c3921c2c1d2178fda482efea65982010954e1` |
| f2 | 177 | [53, 120, 194, 241] | `f1c84b909087566eacab50570365f42ca745285b1e0eb0e1bed21004faf9dfac` |

`beamStruggleAir` approved v02; bodyHeight 118; frames [178, 179, 180].

| Local frame | Atlas index | Exact alpha bounds | SHA-256 of decoded 256x256 RGBA bytes |
|---|---:|---|---|
| f0 | 178 | [103, 124, 203, 241] | `864e94280dc2164790c24899e066c35a8d5833890e08e5b6d14a2688711b4fe1` |
| f1 | 179 | [103, 124, 203, 241] | `0ed2f48a3945f0b22415f38c51832c74cb382d4137727946996813c8306987f5` |
| f2 | 180 | [105, 126, 207, 241] | `6b8d5e7df9243b61e08e57253d19f570bfc718b1750e68fb7c3c392c4ac3c050` |

| Input | SHA-256 file bytes |
|---|---|
| `public/characters/killua/sheet.png` | `836927d35607c9ffe9cebfd4f00b3cae12f77c0e92323100a16d63c1b75cfb6a` |
| `public/characters/killua/anims.json` | `7fb34ca7f98cccc6917a21313bf782b4d22e6d7afb8d2171a687e372552141cf` |
| `public/art-review/title-style-pilot/killua-neutral_v01.png` | `86278707ba8f0fcb78942cbcedb3341d8ad8f559e95f8cbf48273d0bbdca1855` |
| `public/art-review/title-style-pilot/killua-combat_v01.png` | `d32d8f9f297efac7bcd8ba7e0dfd34c4d458ada1fc5e45a9c93801340f5a63d6` |

### gojo

`beamStruggle` approved v01; bodyHeight 215; frames [175, 176, 177].

| Local frame | Atlas index | Exact alpha bounds | SHA-256 of decoded 256x256 RGBA bytes |
|---|---:|---|---|
| f0 | 175 | [76, 26, 227, 241] | `9a47c2caa9a68a04b8076483fe70dc8a9a41949c056a09295cd4563fff9ae5f1` |
| f1 | 176 | [75, 27, 228, 241] | `d84530c82e07d439b31d4ced55ab05288e88ee0ee0e65e170309ff2ecf02d184` |
| f2 | 177 | [73, 27, 232, 241] | `77a550327b2256dd973289fbd4e8cbc622988b2908df1b3fe533a9970e3775bf` |

`beamStruggleAir` approved v01; bodyHeight 215; frames [178, 179, 180].

| Local frame | Atlas index | Exact alpha bounds | SHA-256 of decoded 256x256 RGBA bytes |
|---|---:|---|---|
| f0 | 178 | [106, 27, 228, 241] | `5922dcb8decfc579a0b2c261d71db3cf0674fae0aaf31635223e17fc348febb9` |
| f1 | 179 | [100, 39, 213, 241] | `79c8f3efc633aa052e136aadc37aa63267bb3f542e50cb36e75ba502678b154f` |
| f2 | 180 | [94, 35, 217, 241] | `04d26228a2dd83cf2b43b1ff0e2cad676b5038c741e4bdd0c923bbac2b0e0b13` |

| Input | SHA-256 file bytes |
|---|---|
| `public/characters/gojo/sheet.png` | `e5546329c470738a46537fb754ea55887b418c9dbbe7e00e6b7af8684c6f0ca0` |
| `public/characters/gojo/anims.json` | `4fd805c2380a2d7bad933e679b838c850c2fc58e7044d0b06b45e748cc9bd1fb` |
| `public/art-review/title-style-pilot/gojo-neutral_v01.png` | `d9fd4dca67c7cc133e897773a3c8128d6c5320a42402642c11409fea770175a0` |
| `public/art-review/title-style-pilot/gojo-combat_v01.png` | `ab42bc6facd14659bf35b48a4bce8682cd17218f200d1e7fcdc6430f58451656` |

## Limits and handoff

All 21 frames fit safely inside their 256x256 cells; no frame truncation was found. No shader, game camera, collision/contact zone, live-deployment byte comparison, or real-time loop playback was tested. No Naruto hand-anchor file was edited. Prior strict pack results were not rerun and are not substituted for this audit.

Scratch evidence is reproducible from the hashed sheets and JSON using cell crop `(index % 16 * 256, floor(index / 16) * 256, 256,256)`. Local inspection images are under `E:/Vibe Coding/.codex/visualizations/2026/10/17/01a14c11-bc07-7bb1-9cbb-4f8be60be9e1/beam-astra-audit/` (`<fighter>-comparison.png`, `<fighter>-grid-0..8.png`, decoded target cells and `records.json`). Grid 0=neutral, 1=combat, 2=idle f0, 3-5=ground f0-f2, 6-8=air f0-f2. These are disposable crops/comparisons, not new generated art or approved assets.

Next action belongs to the parent beam-clash worker/Claude handoff: report these holds alongside existing approval, and decide whether any future correction is wanted. No redraw, approval change, pack, merge or deployment is authorized by this report.
