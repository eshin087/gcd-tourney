# Killua round4 anatomical audit — review holds

Current game atlas remains unchanged. These measurements are from quantized native256cells, with source/reference hashes in measurements.json. Diagnostic pack is a disposable isolated fixture: its invented approval flags exist ONLY to permit measurement output, never in the real manifest. It is not a passing production pack or a user approval.

Manual raster readings are approximate visible-joint measurements, not exact inferred skeletons. H = visible crown to chin (hair included, rotated along head axis for inverted pose); T = collar centre to hem centre; A = shoulder–elbow + elbow–wrist; L = hip–knee + knee–ankle; S = heel–toe shoe length, not occupied width or colour area. Values are native px ± uncertainty. Hip and shoulder under clothing are low confidence. — means landmark concealed and no number is asserted. Projected values do not certify anatomy; see each strip note. Frontal shoulder width is skipped for every 3/4/turned pose (perspective projection cannot certify frontal anatomy).

Shipped approved idle08 f0 baseline: H38±2, T38±2, A39±4, L61±6, S25±2. Explicit landmark guide: head crown(130,98)→chin(131,136); collar(128,135)→hem(128,173); arm shoulder(139,141)→elbow(151,162)→wrist(166,164); leg hip(134,178)→knee(163,193)→ankle(176,218); shoe heel(174,233)→toe(198,237). Hidden joints account for the wider uncertainty. Approved combat independently inspected: H~40–41, T~38, chains partly under clothing. It cannot resolve a hidden scalp landmark. There is no skull-to-chin sidecar with invented values.

No strip receives PASS: ±6% tolerance is tighter than several manual uncertainty intervals. A confidence interval crossing the limit is INCONCLUSIVE. Old stagger/win have an evidenced oversized upright torso and were redrawn. The remaining5suspects receive no redraw on uncertain/occluded projection alone. Retain approved source and request anatomical review if a definite failed joint becomes visible.

## shipped jumpUp v05

hip and knee under folded shorts: leg chain unmeasured; shoe pitched; arm shoulder under sleeve ±4. Torso slightly turned.

| Frame | H ±2 | T ±2 | A ±4 | L ±6 | S ±2 | Decision |
|---|---|---|---|---|---|---|
| 0 | 41 | 35 | 41 | — | 24 | HOLD / inconclusive |
| 1 | 41 | 36 | 40 | — | 25 | HOLD / inconclusive |

## shipped jumpFall v05

torso forward pitch and billowing hem: projected distance only; both upper thighs under shorts, shoe pitched. No ratio certification from projected arm/torso.

| Frame | H ±2 | T ±2 | A ±4 | L ±6 | S ±2 | Decision |
|---|---|---|---|---|---|---|
| 0 | 39 | 32 | 33 | — | 25 | HOLD / inconclusive |
| 1 | 41 | 31 | 34 | — | 26 | HOLD / inconclusive |

## shipped airRecover v05

f0 curl hides collar/hem and elbow; f1 inverted head axis rotated, trunk folded/hidden; f2 torso pitch, hip/knee occluded. Shoes rotated: projected heel-to-toe.

| Frame | H ±2 | T ±2 | A ±4 | L ±6 | S ±2 | Decision |
|---|---|---|---|---|---|---|
| 0 | 37 | — | — | — | 25 | HOLD / inconclusive |
| 1 | 39 | — | — | — | 26 | HOLD / inconclusive |
| 2 | 40 | 29 | 35 | — | 25 | HOLD / inconclusive |

## shipped stagger v05

upright collar/hem visible: torso confidently oversized (+18 to +39% after ±2 px uncertainty). Shoulder joint under sleeve; hip covered ±6.

| Frame | H ±2 | T ±2 | A ±4 | L ±6 | S ±2 | Decision |
|---|---|---|---|---|---|---|
| 0 | 40 | 47 | 49 | 60 | 27 | FAIL torso |
| 1 | 40 | 48 | 49 | 61 | 27 | FAIL torso |
| 2 | 41 | 48 | 48 | 61 | 27 | FAIL torso |
| 3 | 40 | 48 | 49 | 61 | 27 | FAIL torso |

## shipped win v04

upright collar/hem visible: torso confidently oversized (+15 to +36% after ±2 px uncertainty). Raised arms occlude wrist/head; hip under shorts ±6.

| Frame | H ±2 | T ±2 | A ±4 | L ±6 | S ±2 | Decision |
|---|---|---|---|---|---|---|
| 0 | 41 | 47 | — | 61 | 27 | FAIL torso |
| 1 | 41 | 46 | — | 61 | 27 | FAIL torso |
| 2 | 40 | 47 | — | 61 | 27 | FAIL torso |
| 3 | 41 | 47 | — | 61 | 27 | FAIL torso |

## shipped airLight1 v06

f0/f3/f4 curled arms hide elbow/wrist; f1/f2 straight near arm visible but shoulder under sleeve. Chambered thigh hip/knee hidden; shoes end-on.

| Frame | H ±2 | T ±2 | A ±4 | L ±6 | S ±2 | Decision |
|---|---|---|---|---|---|---|
| 0 | 38 | 37 | — | — | 24 | HOLD / inconclusive |
| 1 | 39 | 37 | 43 | — | 24 | HOLD / inconclusive |
| 2 | 39 | 37 | 43 | — | 24 | HOLD / inconclusive |
| 3 | 39 | 36 | — | — | 24 | HOLD / inconclusive |
| 4 | 38 | 37 | — | — | 24 | HOLD / inconclusive |

## shipped airLight2 v07

arms curled/overlapped; hip beneath shorts on chamber and kick; the active far thigh overlaps shorts. Rotated shoe lengths are projected only.

| Frame | H ±2 | T ±2 | A ±4 | L ±6 | S ±2 | Decision |
|---|---|---|---|---|---|---|
| 0 | 41 | 37 | — | — | 26 | HOLD / inconclusive |
| 1 | 40 | 38 | — | — | 25 | HOLD / inconclusive |
| 2 | 40 | 38 | — | — | 25 | HOLD / inconclusive |
| 3 | 41 | 37 | — | — | 26 | HOLD / inconclusive |
| 4 | 41 | 37 | — | — | 26 | HOLD / inconclusive |

## candidate idle v10

same near-side joints selected across loop; sleeve/shorts conceal joint centres. Head fit passes but shoes probe 1.24–1.27; body 144 px, target156–162 unmet.

| Frame | H ±2 | T ±2 | A ±4 | L ±6 | S ±2 | Decision |
|---|---|---|---|---|---|---|
| 0 | 40 | 39 | 35 | 54 | 23 | HOLD / inconclusive |
| 1 | 40 | 39 | 35 | 54 | 23 | HOLD / inconclusive |
| 2 | 39 | 39 | 35 | 54 | 23 | HOLD / inconclusive |
| 3 | 40 | 39 | 35 | 54 | 23 | HOLD / inconclusive |
| 4 | 40 | 39 | 35 | 54 | 23 | HOLD / inconclusive |
| 5 | 39 | 39 | 35 | 54 | 23 | HOLD / inconclusive |
| 6 | 39 | 39 | 35 | 54 | 23 | HOLD / inconclusive |
| 7 | 40 | 39 | 35 | 54 | 23 | HOLD / inconclusive |

## candidate guard v08

crossed forearms occlude elbow/shoulder chain; visible torso/leg distances uncertain; body133px, desired taller stance unmet.

| Frame | H ±2 | T ±2 | A ±4 | L ±6 | S ±2 | Decision |
|---|---|---|---|---|---|---|
| 0 | 39 | 33 | — | 54 | 22 | HOLD / inconclusive |
| 1 | 40 | 34 | — | 54 | 22 | HOLD / inconclusive |

## candidate superDash v08

legacy posed-height fit shrinks head to0.83combat; folded near leg hip concealed. Torso pitch/shoulder perspective. Calibration hold, not anatomical pass.

| Frame | H ±2 | T ±2 | A ±4 | L ±6 | S ±2 | Decision |
|---|---|---|---|---|---|---|
| 0 | 34 | 29 | 39 | 44 | 23 | HOLD / inconclusive |
| 1 | 34 | 30 | 39 | 45 | 23 | HOLD / inconclusive |

## candidate stagger v07

shortened torso selected after3calls; native pack overlong arms and shoes. Shoe lower bound27/idle upper27 crosses6%, so uncertain against shipped; relative candidateidle upper25 gives ≥8% fail. Budget exhausted.

| Frame | H ±2 | T ±2 | A ±4 | L ±6 | S ±2 | Decision |
|---|---|---|---|---|---|---|
| 0 | 43 | 31 | 49 | 68 | 29 | HOLD / inconclusive |
| 1 | 42 | 33 | 48 | 69 | 29 | HOLD / inconclusive |
| 2 | 44 | 32 | 50 | 68 | 29 | HOLD / inconclusive |
| 3 | 41 | 34 | — | 65 | 30 | HOLD / inconclusive |

## candidate win v05

raised hands behind head hide elbow/wrist chain. Torso and near leg visible with stated uncertainty. No full anatomy pass.

| Frame | H ±2 | T ±2 | A ±4 | L ±6 | S ±2 | Decision |
|---|---|---|---|---|---|---|
| 0 | 38 | 37 | — | 58 | 24 | HOLD / inconclusive |
| 1 | 38 | 37 | — | 58 | 24 | HOLD / inconclusive |
| 2 | 38 | 37 | — | 58 | 24 | HOLD / inconclusive |
| 3 | 38 | 37 | — | 58 | 24 | HOLD / inconclusive |

## Actual candidate packing and recommendations

`node tools/pack-sprites.mjs killua --quantize48 --strict-scale` exits1; superDash08 head0.832, existingcharge13 head0.92. Nothing written to production atlas or frames. idle10 head1.005 (individual0.999–1.025), shoes1.244–1.272; actual body heights 145/145/146/144/144/145/144/144 px and floor-band spans 118/119/119/119/117/119/119/119 px. A head probe pass does not meet taller-idle/body/shoe requirements. guard08 head0.959, shoes1.107–1.123, heights 132/132 px. Stagger07 shoes1.289–1.361 and anatomical hold after budget exhausted. win05 head1.005/shoes1.173–1.197, arm occlusion prevents full numerical clearance.

Recommend reviewing visual direction only and holding integration. Claude must reconcile legacy posed-height fit against visible crown/chin and joint landmarks before in-game review. Calibration must not distort anatomy. If correctly calibrated anatomy still fails, use remaining calls only for evidenced failures; stagger has no calls remaining. Do not change bodyHeight, offsets, hitboxes, approvedVersion, or fixed approved references.

## Saved candidate inventory / calls

This round used idleA2/B2, guard1, superDash2, stagger3, win1 (11calls). Cumulative A8/B8+separate priorf0fix1, guard4, superDash4, stagger7, win2. Final selected idle10, guard08, superDash08, stagger07, win05. Prematurely filed idle09, superDash07, stagger06 remain immutable needs-review technical holds with their own rows; no self rejection or overwrite. Remaining allowance A1/B1, guard2, superDash1, win2; stagger exhausted. Unused second stagger attempt is not numbered. Named redraw generations made; suspected strips measured allframes. No round3 work performed.

## Final pose corrections after independent review

Idle A3/B3 and guard2 address the observed squat/short leg chains. Total14calls: idleA3/B3, guard2, superDash2, stagger3, win1. Cumulative idleA9/B9+priorfix1; guard5; superDash4; stagger7; win2. Idle and stagger budgets exhausted; guard1/superDash1/win2 remain. New best idle11 and guard09; previous saved09/10/08 remain immutable needs-review holds.

### candidate idle v11

| Frame | H ±2 | T ±2 | A ±4 | L ±6 | S ±2 | Occupied height | Floorband span |
|---|---|---|---|---|---|---|---|
| 0 | 36 | 38 | 35 | 56 | 23 | 144 | 110 |
| 1 | 37 | 38 | 35 | 57 | 23 | 144 | 110 |
| 2 | 38 | 38 | 35 | 57 | 23 | 144 | 110 |
| 3 | 38 | 38 | 35 | 57 | 23 | 144 | 110 |
| 4 | 37 | 38 | 35 | 57 | 23 | 146 | 111 |
| 5 | 37 | 38 | 35 | 58 | 23 | 146 | 111 |
| 6 | 38 | 38 | 35 | 58 | 23 | 146 | 111 |
| 7 | 37 | 38 | 35 | 58 | 23 | 146 | 111 |
### candidate guard v09

| Frame | H ±2 | T ±2 | A ±4 | L ±6 | S ±2 | Occupied height | Floorband span |
|---|---|---|---|---|---|---|---|
| 0 | 34 | 34 | occluded | 56 | 23 | 132 | 83 |
| 1 | 34 | 34 | occluded | 56 | 23 | 132 | 83 |

Final idle11 headprobe0.966 (individual0.942–1.000), feet1.211–1.242; actual head36–38px, torso38±2, legchain56–58±6. Occupied height 144/144/144/144/146/146/146/146 vs156–162target: FAIL height. Source pose improvement did not produce a passing native drawing. Full-figure enlargement risks oversizing torso; do not describe this as calibration-only. Guard09 head0.904 (individual0.900/0.908), feet1.068/1.077; nativeH34±2, torso34±2, leg56±6, shoe23±2; actualheight 132/132. Source guard is more upright but current posed-height fit shrinks head. Occluded collar/forearms prevent full-chain clearance. Need Claude to distinguish source proportion failure from posed-height calibration; no invented skull landmark or blanket exemption. Strict48 now exits1 for superDash08, guard09 and preexistingcharge13. No atlas/frame production write. Final recommendation remains HOLD all integration; user can review visual direction only.

## Raw/source versus calibration evidence

Guard09 raw firstfigure crown(493,146), chin(511,340), solesY900 gives head~195±6 / height754px. AtH40 ratio implies155±5px; target150–158 uncertainty preventsPASS. Leg hip(483,530), knee(574,658), ankle(632,792) chain303±18px (hip under clothing); normalizedH40 ~62±5px. These are independent visible source points, not prompt targets or a guessed scalp. [Record](raw-landmarks.json).

SuperDash08 head34±2/leg44–45±6: headscaled40/34 gives52–53±8, overlapping baseline61±6. Arm39±4 scaled~46±6 overlapsbaseline39±4; torso pitched. INCONCLUSIVE, not evidenced anatomy failure. Final1call preserved pending definite joint feedback. Stricthead0.832 hold unchanged.

## TOOL-036 body sheets and build

Merged currentmain tooling into taskbranch (d4994c9); resolvedTASKS by retaining coordinator ART-SCALE-R4 in-progress and adding scoped ART-SCALE-R4-KIL review row. npm run body -- killua exits0: shipped17/42area flags. Direct CLI candidate10-strip diagnostic body command exits0:4area flags (airLight1,airLight2,guard,airRecover); source candidate atlas unchanged. B measures opaque body-colour area, not anatomical segment scale; ±10%pose noise, no numeric certification. Head-only sheet diagnostic generated separately. Posed-height and approved references unchanged.

Production adapter build exits0 (82modules,9m45s; full public art copied). git diff --check clean; public/characters/killua has zero changes. Gallery file src/href references all present. Local IAB browser returned ERR_CONNECTION_TIMED_OUT and direct restricted-profile fetch EACCES127.0.0.1:5275; browser preview verification remains coordinator-owned. No in-game approval or candidate gameplay integration.

## Selected-candidate playback correction

Gallery main sections now select idle11/guard09/superDash08/stagger07/win05 only. Earlier saved candidates are closed historical details. Each player crops the exact diagnostic-sheet.png using diagnostic-anims.json frame IDs and durations, beside approved combatv01 and shipped approved idle08f0 at native256density. Independent pause/previous/next/restart, half/quarter speed and repeat toggle expose every frame and join. Metadata versions are checked before playback; missing/mismatched data errors without substitute sources. One-off VM exercised actual control handlers and every selected atlas crop, pause/duration, half-speed, repeat-off and stagger3→0; this is not rendered browser verification. Source/atlas9filehashes unchanged from HEAD. Root verifies the committed hosted preview.

Astra report (main deliverables/round4-qa/astra-three-fighters_v01.md, GPT-6Astra medium) adds a motion HOLD: stagger07f3→f0 abruptly returns from recovered guard to dangling/slumped arms. Source pose-sequence issue, separate from calibration. Three-call budget exhausted; no new generation requested or performed. The report is mirrored read-only in the gallery. No approval, manifest, packed-atlas or source change.


Gallery refresh production build completed: adapter command exited 0 (82 modules; 1m39s). Full output and exit code are recorded in gallery-refresh-build.txt. Browser preview remains pending root verification.
