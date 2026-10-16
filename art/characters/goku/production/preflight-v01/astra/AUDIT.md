# Astra diagnostic audit — Goku preflight v01

Date: 2026-10-15. Result: HOLD for production; salvage/calibration diagnosis only. No approval changed. All 23 comparison rows (108 frames in each diagnostic atlas) were inspected, including first/last frame relationships. Static sequence review is not timed playback or in-game contact validation. No final release anatomy pass is issued.

## Evidence identity

Worktree: E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-goku-core, branch art/goku-core, source commit 728fa9d747f421a3189c89f2bded0e5d4bfeb85e. Inventory pins source versions and hashes. Reference: references_v01.png (approved title neutral/combat cells and approved idle f0). Inspected paired contact images and direct atlas crops (idle, guard, light2, light3), nearest-neighbor 3x copies in this folder.

SHA256:
- current/characters/goku/sheet.png: 279dcd3733c1542dd166e35ce45298605274cecd5f98e51bc2050397f607b692
- current/characters/goku/anims.json: 8868fced283ddadb95af27de0540dbb62971b7f45ba51b9a6256ecd6fb8a08c1
- native-control/characters/goku/sheet.png: d45228ed1882904f384cebee074f53d3c19bfd604c154592cbee513cec74e95b
- native-control/characters/goku/anims.json: 04070be6b5eab31d46dc9d27341985e9a662669a92aedc93995624af0d8ed1cd

Both atlases deliberately expose held pixels using a diagnostic warn fixture. Their complete:true metadata concerns that fixture inventory, not full production coverage or passing release gates. Native-control is an occupied-height experiment, NOT a common-density solution. Its 237px cap still changes scale and cannot validate a tall/raised-arm pose.

## What is actually failing

Current manifest applies scale 0.725 to land, 0.828 to guard, 0.850 to light2, 0.825 to air attacks/beam rows, and 0.599 to launched. Visible shrinkage is real, but is not proof that the source drawing is too small. Native-control restores much of the apparent body consistency while exposing cell/pivot overflows. A per-strip maximum occupied height is not an anatomical calibration landmark.

The supplied probe diagnostics fail their own idle consistency and report tiny color fragments as heads. These numbers cannot support a redraw or numeric pass. Declare/repair the detector against independently marked true regions, then require idle self-check and known scale controls before using it. Hair-only correction is insufficient for torso and limbs.

## Manual pilot measurements

Approximate native-control pixel coordinates, visually marked on direct atlas crops. Segment endpoints carry about +/-2px each; lengths +/-3px (torso +/-4px). These are screening measurements, NOT a <=6% certification or a ready-to-apply production factor. All points are local to the 256px cell. Body pivot and clothing folds introduce additional uncertainty.

| Frame | Collar/neck base to belt center | Visible belt horizontal span | Screen-left boot top to sole, diagonal | Eye line to chin |
|---|---|---|---|---|
| idle v02 f0 | (124,66) to (126,112), about 46px | x108..144, about 36px | (72,197) to (55,239), about 45px | y55..67, about 12px |
| guard v04 f0 | (118,61) to (122,109), about 48px | x103..142, about 39px | (60,199) to (44,240), about 44px | y50..62, about 12px |
| light2 v04 f0 | (121,61) to (122,108), about 47px | x104..140, about 36px | (70,197) to (54,240), about 46px | y48..62, about 14px |

Guard has a wider stance/garment silhouette and slightly wider belt, but these measurements do not support a wholesale redraw. Light2 has coherent torso/boot scale; its rotated attack frames change projection. Both are good calibration pilots, using several stable landmarks on ORIGINAL generation sources. Do not infer the source-to-cell factor solely from these already-resampled pixels. Exposed biceps/forearms remain visually coherent; occlusion prevents defensible precise limb-chain certification here.

Approved neutral/combat reference vs approved idle: idle retains the adult build, gi volume and long limb structure; combat stance and hair differ in projection. Approval is preserved. The reference itself must remain on the measurement sheet; idle agreement alone cannot certify every proportion.

## Per-animation findings (zero-based frames)

All rows remain HOLD for final production until strict calibration, atlas audit, contact checks and applicable user approval.

| Selected version / frames inspected | Diagnosis and next action |
|---|---|
| idle02 f0–7 | Coherent breathing sequence and f7→f0 seam; anchor candidate. No gross anatomical defect found. Probe self-check is invalid. |
| run04 f0–7 | Usable running poses but actual atlas clips f3 left13px and f6 left11px. Cut/anchor repair first; native-control intentionally keeps original scale. Foot/arm phases vary, so inspect timed loop after recut. |
| dash03 f0–1 | Torso/limb arrangement plausible at restored size. Native f1 clips left28px. Resolve anchoring/cell fit; do not shrink whole fighter to hide it. |
| jumpUp03 f0–1 | Tuck→extension is readable; native hair/head looks somewhat large relative to idle, needs source landmarks. Loop repeats extension→tuck sharply; runtime jump hold/timing check required. No automatic redraw justified. |
| jumpFall02 f0–1 | Coherent airborne fall pair; native torso/boots broadly plausible. Calibrate from segments, then confirm transition from jumpUp. |
| land03 f0–1 | Crouch→guard readable. Current 0.725 scale is a major false size cue. Native crouch hand/forearm and gi volume need measured check, but no gross missing anatomy. Calibration candidate. |
| light1 v02 f0–6 | Intact jab sequence, coherent recovery; remains at 0.854 in both experiments, so density is unresolved. Calibrate source independently. |
| light2 v04 f0–6 | Best approved attack calibration pilot. All visible limbs complete; rotated f2 torso is intentional. Recovery is broadly coherent with idle. |
| light3 v04 f0–6 | HOLD assembly/source repair: f2 contains a disconnected arm/hand fragment on the right and truncated rear arm on the left; f3 also cuts rear arm. Visible in actual native atlas crop despite no clip warning. Reinspect intact generation source and segmentation before considering a redraw. |
| light4 v04 f0–7 | Coherent spin/kick sequence but native f4/f5 kick tips clipped right28/right21px. Cell/pivot engineering issue first, not a head-ratio failure. |
| heavy v04 f0–7 | Punch f3–5 cut at right edge (21/22/25px native); detached wrist/hand fragments visible in paired rows. Restore complete source segmentation and anchors; preserve approved drawing. |
| airLight1 v04 f0–4 | Severe native punch cutoff f2/f3 right70/right60px; f1 enters right margin. Cannot pass by head fitting. Needs source recut/pivot/cell-fit solution. |
| airHeavy v04 f0–5 | Coherent tuck→downward double-hand blow→recovery, complete figures. Clothing projection varies strongly but no gross missing anatomy. Calibration candidate, then measured limb lengths. |
| guard v04 f0–1 | Intact f0 guard→tighter f1 cover; seam has pose motion but no gross size jump. Suitable pilot; not numerically passed or user approved. |
| hurtHigh v07 f0–2 | Cover→recoil→cover is readable, preserved arm chains. Native body scale plausible; calibrate. |
| launched v06 f0–1 | Current makes fighter dramatically small; native clips head/rear body left41/61px. Prior raw-only pass cannot certify packed atlas. Anchor/cell-fit hold; no scale-only pass. |
| down v04 f0–1 | Kneel collapse→side lying anatomically readable at native size. Native f1 clips right4px. Preserve original down pose; slight crop/anchor repair and Claude grounding check needed. |
| getup v03 f0–4 | Kneel→crouch→guard sequence coherent. f4 stance differs from idle, so transition merits playback. Reported f0 floor warning applies to a kneeling pose, not proof of a floating lying body. Calibrate/contact check; prior raw-only pass is superseded. |
| charge v04 f0–3 | Source/motion HOLD: neutral f0 abruptly becomes combat stance f1–3, then snaps back at loop seam. Scaling cannot repair that pose sequence. Decide canonical charge intent; with no calls authorized, retain hold or reassemble existing suitable poses subject to user review. |
| beamCharge v04 f0–2 | Consistent cupped-hands hold and loop; calibration candidate. Hands overlap, limiting exact forearm measurement. |
| beamFire v04 f0–2 | Consistent extended-palm hold and loop; calibration candidate. Foreshortening/overlap requires contact validation. |
| special v02 f0–7 | Cupped-hands→palm release→recovery coherent; source scale/clothing volume broadly stable. Calibration candidate; check contact timing. |
| win v03 f0–3 | Neutral→hand near chest→raised fist→chest gesture readable. Loop returns arm down; review timing. Hair touches source y0 in every frame, so recover top margin from original source; native cap cannot establish full source integrity. |

## Better workflow and resumption order

1. Freeze exact inventory/hashes and retain approvals/budgets. No new image calls.
2. Pilot guard + light2 alongside idle and approved title cells. Mark original-source landmarks (boot top/sole, belt, neck/belt, eye/chin; add forearm where not foreshortened), record endpoints and uncertainty. A single factor must agree across reliable segments; disagreement means anatomy/pose investigation, not averaging away the defect.
3. Reassemble at that measured density. Preserve complete figures before enforcing pivot. Explicitly report any out-of-cell pixels. Current overflow warnings demonstrate that density and anchor must be solved together by Claude; do not globally shrink to clear clipping.
4. Split defects: source segmentation (light3 and perhaps heavy), pivot/cell fit (run, dash, light4, heavy, airLight1, launched, down), pose-loop repair (charge), coherent calibration candidates (remaining rows). Original source inspection determines whether intact missing limbs can be recovered without any generation.
5. Claude fixes/calibrates detector and manifest only after source factors are recorded. Add idle self-check and known scaled-copy controls; detector uncertainty yields HOLD, not pass. Avoid broad exemptions.
6. Rebuild strict quantized production candidate from frozen inventory, inspect EVERY resulting frame plus timed loops and runtime transitions. Recheck anatomy, all five body regions, shoes, contact/hurtboxes and clipping. Then final Astra release audit and user's remaining image approvals.

Do not inherit the earlier launched/down/getup raw-only pass. It is useful source evidence only; launched and down demonstrably fail actual packed cell fit here. No new art call is warranted merely by the failed color-fragment head readings.

Claude next action: review calibration/segmentation/anchor findings. Owning chat must commit the handoff and ring goku-luffy once; this subagent does not ring. Final release audit remains pending.

## Existing manual-QA records requiring Claude correction

Live worktree manifest has scaleManualQA.result = pass for launched v06, down v04 and getup v03, all by Codex and all citing production/scale-qa/goku-lowpose-contact-v01.png. Notes describe native-density shape comparison with +/-10px (launched/down) or +/-8px (getup) uncertainty and explicitly disclaim numeric height pass or user approval. Nevertheless the result field is too strong for release use: it is raw-only evidence without actual atlas integrity. Claude should preserve the historical note but supersede/reclassify the machine-readable pass, then rerun after calibration. Launched and down visibly clip in the native diagnostic; getup has no defensible final packed proportion certification. This audit did not edit these records.
