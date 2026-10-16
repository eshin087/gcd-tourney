# Sasuke round4: packed-cell audit, not approval

All 34 frames in the nine requested strips were inspected beside idle f0 at 3x nearest-neighbor magnification with a 16px coordinate grid. Baseline and candidate hashes are in their adjacent `atlas-metadata.json`. The production atlas remains the prior pack because the strict candidate pack exits 1. `diagnostic-final/` is a warning-only 48-color render, never a shipping pass.

The H column is the automatic hair silhouette probe. The separate visible crown-to-chin coordinate table below measures the round4 head axis including hair; no hidden scalp interpolation is needed. The approved combat cell is included on both body sheets at its original density.

Reference estimates in native pixels: collar-to-belt axis 47 +/-6; shoulder-elbow-wrist chain 47 +/-8; hip-knee-ankle chain 84 +/-12; side-facing grounded sole 34 +/-1 (idle loop 34-35). Shirt, wrap and baggy trousers cover the actual shoulder, hip and knee joint centers. The first three are **low-confidence projected centerline estimates**, obtained from visible collar/belt, sleeve/guard and trouser/ankle landmarks. They are recorded with deliberately broad uncertainty, not substituted for exact skeletal lengths. The reference arm, for example, follows approximately (135,106), (155,120), (177,120). The visible leg follows approximately (128,162), (163,195), (181,225). Covered centers could move several pixels. No such interval establishes a +/-6% pass.

Shoe method: for the clearly side-facing front grounded sandal, native opaque sole extents at y230..240, x>=128 are heel-to-toe lengths; see `sole-probe.mjs`. The integer opaque-pixel bounds are deterministic. The +/-1px total length interval allocates +/-0.5px subpixel edge location to each endpoint; it does not mean +/-1px at each endpoint. Rotated/partial silhouettes are skipped rather than assigned that small error budget. Bounds are length bounds, not garment area. A rotated, toe-on or airborne sandal is explicitly skipped below. Frontal shoulder width is skipped in these three-quarter, leaning or twisting frames; no shoulder inflation was accepted.

## Production atlas: every requested frame

T/A/L = low-confidence projected torso / arm-chain / leg-chain estimates in px. `u` means hidden or depth-foreshortened, so no defensible chain length was assigned. The uncertainty applies to **each** frame, not only the strip median. H is the automatic hair probe. No row below is a full-body pass.

| strip version / frame | H | T | A | L | shoe | uncertainty / decision |
|---|---:|---:|---:|---:|---:|---|
| superDash v05 / 0 | 0.996 | 35 +/-6 | 39 +/-8 | 67 +/-14 | u | Oblique flight; rear shoe toe-on, hip/knee covered. Named redraw. |
| superDash v05 / 1 | 1 | 35 +/-6 | 38 +/-8 | u | u | Near knee and rear shin overlap, rear shoe toe-on. Named redraw. |
| jumpSquat v03 / 0 | 1.085 | 46 +/-7 | 56 +/-10 | 82 +/-16 | 38 +/-1 | Deep folding hides hip/knee centers; sole interval crosses 6% boundary. Named redraw. |
| beamFire v05 / 0 | 1.028 | 47 +/-6 | 62 +/-10 | 88 +/-12 | 40 +/-1 | Sole 180..219: +17.6% midpoint, ratio interval 1.114..1.242. Fail, redraw. |
| beamFire v05 / 1 | 1.012 | 47 +/-6 | 62 +/-10 | 88 +/-12 | 40 +/-1 | Sole 180..219: same proven failure. |
| beamFire v05 / 2 | 1.013 | 47 +/-6 | 62 +/-10 | 87 +/-12 | 39 +/-1 | Sole 182..220: +14.7%, interval 1.086..1.212. Fail. |
| dash v05 / 0 | 0.987 | 47 +/-7 | 59 +/-10 | 88 +/-14 | 44 +/-1 | Sole 152..195: +29.4%, interval 1.229..1.364. Fail, redraw. |
| dash v05 / 1 | 0.979 | 47 +/-7 | 59 +/-10 | 88 +/-14 | 45 +/-1 | Sole 163..207: +32.4%, interval 1.257..1.394. Fail. |
| run v05 / 0 | 1.024 | 39 +/-8 | 51 +/-10 | 80 +/-14 | 33 +/-1 | Torso leaned/turned; joint uncertainty crosses gate. Sole interval .914..1.030. Inconclusive. |
| run v05 / 1 | 1.003 | 39 +/-8 | 51 +/-10 | 78 +/-16 | u | Front shin folds in depth; airborne toe-on shoe. Inconclusive. |
| run v05 / 2 | 1.024 | 40 +/-8 | 51 +/-10 | 80 +/-16 | u | Hip/knee obscured; shoes rotated. Inconclusive. |
| run v05 / 3 | 0.996 | 39 +/-8 | 51 +/-10 | 80 +/-16 | u | Both feet airborne and one toe-on; covered hips. Inconclusive. |
| run v05 / 4 | 1.021 | 40 +/-8 | 51 +/-10 | 80 +/-14 | 34 +/-1 | Side-facing sole .943..1.061 crosses 6% boundary. Inconclusive. |
| run v05 / 5 | 1.006 | 39 +/-8 | 51 +/-10 | 80 +/-16 | u | Ground-band slice 26px is only partial shoe, not length. Inconclusive. |
| run v05 / 6 | 1.013 | 40 +/-8 | 51 +/-10 | 80 +/-16 | u | Airborne/rotated shoes; knee depths unclear. Inconclusive. |
| run v05 / 7 | 0.997 | 39 +/-8 | 51 +/-10 | 80 +/-16 | u | Airborne rear shin crosses body; shoe axis rotates. Inconclusive. |
| airLight3 v07 / 0 | 1 | 47 +/-8 | 54 +/-10 | 88 +/-15 | u | Tucked airborne front leg; shoe toe-on. Inconclusive. |
| airLight3 v07 / 1 | 0.986 | 47 +/-8 | 54 +/-10 | 90 +/-15 | u | Hip under wrap, leading knee lifting into depth. Inconclusive. |
| airLight3 v07 / 2 | 1.019 | 47 +/-8 | 54 +/-10 | 92 +/-13 | u | Kicking leg extends; heel/toe tilt prevents grounded comparison. Inconclusive. |
| airLight3 v07 / 3 | 1.023 | 47 +/-8 | 54 +/-10 | 92 +/-13 | u | Straight kick and oblique pelvis, uncertain hip; toe-up shoe. Inconclusive. |
| airLight3 v07 / 4 | 1.015 | 46 +/-8 | 53 +/-10 | 88 +/-15 | u | Retracting kick, folded shin/foot. Inconclusive. |
| airLight3 v07 / 5 | 0.974 | 45 +/-8 | 52 +/-10 | 84 +/-15 | u | Settle pose retains covered hip/knee; rotated foot. Inconclusive. |
| specialUp v09 / 0 | 1.038 | 39 +/-8 | 47 +/-12 | 80 +/-16 | u | Coil folds torso and thigh into depth; shoe rotated. Inconclusive. |
| specialUp v09 / 1 | 1.013 | 40 +/-8 | 47 +/-12 | 80 +/-16 | u | Rising coil; guarded arm hides elbow. Inconclusive. |
| specialUp v09 / 2 | 1.005 | 40 +/-8 | 48 +/-12 | 81 +/-16 | u | Folded leading knee, rear leg oblique; hands partially overlap. Inconclusive. |
| specialUp v09 / 3 | 0.975 | 40 +/-8 | 48 +/-12 | 81 +/-16 | u | Continued rising pose, near knee covered. Inconclusive. |
| specialUp v09 / 4 | 0.564 | 44 +/-8 | u | 84 +/-16 | u | Raised guard contaminates head segmentation; extended arm points in depth. Inconclusive. |
| specialUp v09 / 5 | 1.436 | 46 +/-8 | u | 87 +/-16 | u | Raised navy arm merges into hair-colored head probe; hanging leg hip hidden. Inconclusive. |
| hurtLow v03 / 0 | 0.969 | 39 +/-8 | u | 78 +/-14 | 31 +/-1 | Arms crossed over abdomen hide elbows; sole .857.. .970 crosses -6% boundary. Inconclusive. |
| hurtLow v03 / 1 | 0.994 | 40 +/-8 | u | 78 +/-14 | 31 +/-1 | Same folded arms and covered hip/knee. Inconclusive. |
| hurtLow v03 / 2 | 1 | 41 +/-8 | u | 80 +/-14 | 31 +/-1 | Less torso fold; chain uncertainties remain. Inconclusive. |
| airRecover v01 / 0 | 1.055 | 40 +/-10 | u | u | u | Tucked curled knees/arms overlap in depth; no chain endpoints or side sole. Inconclusive. |
| airRecover v01 / 1 | 1.969 | 40 +/-10 | u | u | u | Upside-down curl, hands/hips/knees overlap; shoe axis rotated. Inconclusive. |
| airRecover v01 / 2 | 1 | 43 +/-8 | 48 +/-12 | 84 +/-16 | u | Recovery settle; covered hips, one folded shin and angled foot. Inconclusive. |

These estimates document the inspection, but cannot resolve the skeletal comparison because garment-covered joints and crown/jaw landmark ambiguity exceed the requested tolerance. Only beamFire and dash have an independently robust failure in the suspects. The five other suspect sources therefore remain unchanged. Their historical approvals were preserved, and this round makes no new approval or measurement pass.

## Selected diagnostic candidates

| strip / frame | H after measured auto fit | T | A | L | shoe | decision |
|---|---:|---:|---:|---:|---:|---|
| superDash v07 / 0 | 0.951 | 47 +/-7 | 49 +/-10 | 84 +/-16 | u | Right 10px clipped; toe-on trailing shoe. Technical hold at 3/3 calls. |
| superDash v07 / 1 | 0.958 | 47 +/-7 | 49 +/-10 | u | u | Right 4px clipped; overlapping near knee/shin. Technical hold. |
| jumpSquat v06 / 0 | 1.037, low confidence | 46 +/-7 | 56 +/-10 | 82 +/-16 | 36 +/-1 | Shoe +5.9% midpoint, ratio1.000..1.121; uncertainty crosses gate. No manual QA pass. 3/3 calls. |
| beamFire v07 / 0 | 0.974 | 44 +/-7 | 51 +/-10 | 84 +/-14 | 34 +/-1 | Sole now matches idle midpoint, interval .943..1.061 crosses gate. Full anatomy inconclusive. 3/3 calls. |
| beamFire v07 / 1 | 0.995 | 44 +/-7 | 51 +/-10 | 84 +/-14 | 34 +/-1 | Same interval; full anatomy inconclusive. |
| beamFire v07 / 2 | 1 | 44 +/-7 | 51 +/-10 | 84 +/-14 | 35 +/-1 | Shoe+2.9% midpoint, interval .971..1.091; full anatomy inconclusive. |
| dash v07 / 0 | 1.03 | 47 +/-7 | 54 +/-10 | 84 +/-14 | 34 +/-1 | Shoe midpoint0%; interval.943..1.061 crosses6% boundary. Full anatomy inconclusive;2/3 calls. |
| dash v07 / 1 | 0.996 | 47 +/-7 | 54 +/-10 | 84 +/-14 | 33 +/-1 | Shoe-2.9% midpoint; interval.914..1.030 crosses6% boundary. Full anatomy inconclusive. |

Earlier filed versions are immutable review history: superDash v06 (hair .920-.927, T35 +/-7, A39 +/-10, L67 +/-16; no pass), jumpSquat v04 (hair1.071 low-confidence, T46 +/-8, A56 +/-12, L82 +/-18; no pass), jumpSquat v05 (hair1.025 low-confidence, sole40 +/-1, no full-body pass), beamFire v06 (fit hair .997-1.010, sole approximately29 +/-2 after fit, no full-body pass). They were saved before best-of-round selection, a filing error retained transparently rather than overwriting or deleting versions.

## Verification and handoff

`npm run body -- sasuke superDash jumpSquat beamFire airLight3 dash run specialUp hurtLow airRecover` ran against production. The body proxy flags all nine, but passes nothing. The separate candidate body sheet uses `--public diagnostic-final`, the exact copied approved combat cell, and scale2. Garment-area B is advisory, never used as a skeleton measurement.

Final strict `node tools/pack-sprites.mjs sasuke --quantize 48 --no-writeback --json` exits1 on jumpSquat low-confidence and preserves production output. superDash has additional clipping after automatic measured fit, which must be resolved before integration. Claude owns placement/bodyHeight/contact calibration. The auto-fit sidecars change neither bodyHeight nor per-frame offsets. The user must review identity and pose candidates; no candidate has full-body numeric certification.




## Visible crown-to-chin axes (native cell px, hair included)

Round4 uses the **visible hair crown to chin**, not the hidden skull. This corrects the earlier interpretation. Crown coordinates select an actual top-row hair pixel; multiple equally high spikes are explicitly included in the 5-7px **total axis** uncertainty. Chin coordinates are manual outer-jaw turns at +/-2px per coordinate. Axis length is Euclidean distance between the points. This is a distinct measurement from the automatic H column. Idle f0: crown(110,65), chin(128,104), axis42.95+/-5px. Broad intervals overlap the +/-6% boundary and establish no pass. No body segments or contacts were inferred from H.

| atlas / strip / frame | crown (x,y) | chin (x,y) | axis px | ratio interval to idle | result / visibility |
|---|---|---|---:|---|---|
| baseline superDash f0 | (172,135) | (190,172) | 41.15 +/-5 | 0.754..1.216 | Inconclusive; crown-tip / jaw uncertainty |
| baseline superDash f1 | (173,134) | (190,169) | 38.91 +/-5 | 0.707..1.157 | Inconclusive; crown-tip / jaw uncertainty |
| baseline jumpSquat f0 | (174,80) | (195,115) | 40.82 +/-5 | 0.747..1.207 | Inconclusive; crown-tip / jaw uncertainty |
| baseline beamFire f0 | (131,45) | (151,82) | 42.06 +/-6 | 0.752..1.266 | Inconclusive; crown-tip / jaw uncertainty |
| baseline beamFire f1 | (129,45) | (149,82) | 42.06 +/-6 | 0.752..1.266 | Inconclusive; crown-tip / jaw uncertainty |
| baseline beamFire f2 | (132,44) | (152,82) | 42.94 +/-5 | 0.791..1.263 | Inconclusive; crown-tip / jaw uncertainty |
| baseline dash f0 | (214,83) | (228,119) | 38.63 +/-6 | 0.680..1.176 | Inconclusive; crown-tip / jaw uncertainty |
| baseline dash f1 | (219,84) | (235,122) | 41.23 +/-6 | 0.735..1.244 | Inconclusive; crown-tip / jaw uncertainty |
| baseline run f0 | (157,97) | (177,134) | 42.06 +/-5 | 0.773..1.240 | Inconclusive; crown-tip / jaw uncertainty |
| baseline run f1 | (157,97) | (177,136) | 43.83 +/-5 | 0.810..1.287 | Inconclusive; crown-tip / jaw uncertainty |
| baseline run f2 | (157,97) | (176,134) | 41.59 +/-5 | 0.763..1.228 | Inconclusive; crown-tip / jaw uncertainty |
| baseline run f3 | (156,101) | (176,139) | 42.94 +/-5 | 0.791..1.263 | Inconclusive; crown-tip / jaw uncertainty |
| baseline run f4 | (159,100) | (178,137) | 41.59 +/-5 | 0.763..1.228 | Inconclusive; crown-tip / jaw uncertainty |
| baseline run f5 | (158,102) | (176,139) | 41.15 +/-5 | 0.754..1.216 | Inconclusive; crown-tip / jaw uncertainty |
| baseline run f6 | (157,97) | (175,134) | 41.15 +/-5 | 0.754..1.216 | Inconclusive; crown-tip / jaw uncertainty |
| baseline run f7 | (157,104) | (176,141) | 41.59 +/-5 | 0.763..1.228 | Inconclusive; crown-tip / jaw uncertainty |
| baseline airLight3 f0 | (149,49) | (163,86) | 39.56 +/-7 | 0.679..1.227 | Inconclusive; crown-tip / jaw uncertainty |
| baseline airLight3 f1 | (98,57) | (116,93) | 40.25 +/-5 | 0.735..1.192 | Inconclusive; crown-tip / jaw uncertainty |
| baseline airLight3 f2 | (51,114) | (80,150) | 46.23 +/-5 | 0.860..1.350 | Inconclusive; crown-tip / jaw uncertainty |
| baseline airLight3 f3 | (71,114) | (98,151) | 45.80 +/-5 | 0.851..1.339 | Inconclusive; crown-tip / jaw uncertainty |
| baseline airLight3 f4 | skipped | skipped | uncertain | unmeasured | Head turned away; back view hides chin |
| baseline airLight3 f5 | (157,78) | (176,115) | 41.59 +/-5 | 0.763..1.228 | Inconclusive; crown-tip / jaw uncertainty |
| baseline specialUp f0 | (160,113) | (178,153) | 43.86 +/-5 | 0.810..1.287 | Inconclusive; crown-tip / jaw uncertainty |
| baseline specialUp f1 | (154,61) | (174,101) | 44.72 +/-5 | 0.828..1.310 | Inconclusive; crown-tip / jaw uncertainty |
| baseline specialUp f2 | (133,71) | (151,109) | 42.05 +/-5 | 0.773..1.240 | Inconclusive; crown-tip / jaw uncertainty |
| baseline specialUp f3 | (130,59) | (150,97) | 42.94 +/-5 | 0.791..1.263 | Inconclusive; crown-tip / jaw uncertainty |
| baseline specialUp f4 | skipped | skipped | uncertain | unmeasured | Raised navy guards cover upper crown; visible lower hair is not crown |
| baseline specialUp f5 | skipped | skipped | uncertain | unmeasured | Raised forearm meets and covers upper crown; probe includes forearm |
| baseline hurtLow f0 | (162,99) | (172,142) | 44.15 +/-6 | 0.796..1.321 | Inconclusive; crown-tip / jaw uncertainty |
| baseline hurtLow f1 | (142,85) | (157,128) | 45.54 +/-6 | 0.825..1.358 | Inconclusive; crown-tip / jaw uncertainty |
| baseline hurtLow f2 | (125,76) | (140,117) | 43.66 +/-5 | 0.806..1.282 | Inconclusive; crown-tip / jaw uncertainty |
| baseline airRecover f0 | (83,125) | (111,159) | 44.05 +/-6 | 0.793..1.319 | Inconclusive; crown-tip / jaw uncertainty |
| baseline airRecover f1 | skipped | skipped | uncertain | unmeasured | Inverted curled head: crown near(125,237), chin near(112,213), 27+/-10px; forearm/jaw overlap and hair rotation make this inconclusive |
| baseline airRecover f2 | (128,63) | (140,103) | 41.76 +/-6 | 0.746..1.258 | Inconclusive; crown-tip / jaw uncertainty |
| candidate superDash f0 | (185,99) | (206,132) | 39.12 +/-7 | 0.670..1.215 | Inconclusive; crown-tip / jaw uncertainty |
| candidate superDash f1 | (179,98) | (201,133) | 41.34 +/-7 | 0.716..1.274 | Inconclusive; crown-tip / jaw uncertainty |
| candidate jumpSquat f0 | (165,80) | (187,116) | 42.19 +/-5 | 0.776..1.243 | Inconclusive; crown-tip / jaw uncertainty |
| candidate beamFire f0 | (120,75) | (135,114) | 41.79 +/-6 | 0.746..1.259 | Inconclusive; crown-tip / jaw uncertainty |
| candidate beamFire f1 | (121,74) | (137,113) | 42.15 +/-6 | 0.754..1.269 | Inconclusive; crown-tip / jaw uncertainty |
| candidate beamFire f2 | (119,75) | (134,114) | 41.79 +/-6 | 0.746..1.259 | Inconclusive; crown-tip / jaw uncertainty |
| candidate dash f0 | (218,83) | (234,122) | 42.15 +/-7 | 0.733..1.295 | Inconclusive; crown-tip / jaw uncertainty |
| candidate dash f1 | (218,84) | (234,121) | 40.31 +/-7 | 0.695..1.247 | Inconclusive; crown-tip / jaw uncertainty |
