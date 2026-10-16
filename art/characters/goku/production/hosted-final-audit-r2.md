# Goku r02 — final consolidated diagnostic audit (fixture 2)

2026-10-15. Astra inspected all81 actual quantized frames in16 animations, including all62 retained frames from fixture1 and19 replacement/addition frames. Static sequence/seam review only; no timed playback or runtime-contact certification. No image/design approvals are granted. This report supersedes fixture1 pixel binding for retained animations; fixture1 detailed source/crop findings remain relevant.

## Exact final evidence

- Atlas: `production/scale-qa/reassembly-r02/fixture2-public/characters/goku/sheet.png`
- SHA-256: `c77417967595b060c9981c5d55c6d1cc32fb748a2e7361ea658746e0adb0bfa0`
- Metadata SHA-256: `dec929ae11544546e7a8a8f3c23c860ffa33f4844882bfda2cc9313d7cab9167`
- Settings:256px cells,16columns,pivot[128,240],pixelsPerUnit128,quantize48,no-writeback,isolated warn gate. Independently counted48 opaque RGB colors. Packer warnings do not certify anatomy.
- Exact cell hashes/bounds/timing and manual endpoints: `REASSEMBLY_R02_FIXTURE2_MEASUREMENTS.json`. Annotated native endpoints enlarged3x: `r02f2-*-landmarks-3x.png`.
- `FIXTURE2_UNCHANGED_COMPARISON.json` verifies all retained alpha masks are identical to fixture1, but **every retained cell changed RGB** under the new palette. Every retained contact was visually rechecked; clothing/skin/hair segmentation remains legible, and no new anatomy defect was introduced by this quantization. Findings below are bound to fixture2, not silently transferred from an old palette.
- Worker fixture2 inventory frame paths incorrectly retain the prefix `quantized-crops/` for some entries; actual fixture2 pixels were read from `fixture2-crops/`, not the old directory. Audit extraction corrects that prefix explicitly.

## Reference and uncertainty

Same approved title neutral/combat and idle02 reference audit as AUDIT.md. Idle collar-center→belt38.1±5px,belt36±4px,boot shaft-top→sole43.7±4px. Most candidate segment uncertainties are torso±5,belt±4,boot±4px. JumpUp f0 bent boot uses±6px due shaft-edge overlap and projection; hurtHigh guarded torso uses±7px and remains partly occluded. The measurements JSON lists default uncertainty; these pose-specific increases govern those two cases. Ordinary foreshortening is not an anatomy defect. No numerical shin/knee or other concealed-joint pass is claimed. Heads/build/clothing/arms and visible legs/shoes were inspected in every frame. Ratios below are candidate/idle; diagnostic correction ranges are not authorization to rescale an entire source without new source measurements.

## Latest output decisions

| Output | Body / anatomy | Fit and sequence | Final technical recommendation |
|---|---|---|---|
| idle02 | Approved reference; consistent8-frame loop | No new issue | REF |
| run05 | HOLD: visible torso/boot smaller;32.5±5/32.9±4px versus38.1/43.7. Profile belt is not decisive. Screening torso/boot correction1.17/1.33. | Rear foot clipped f3/f6; static loop coherent | HOLD |
| dash04 | HOLD: torso25.8±5,boot26.2±4px; projected pose adds uncertainty but does not justify full undersize. Screening1.48/1.67, no single factor certified. | Rear foot clipped f1 | HOLD |
| jumpUp04 | **PASS within uncertainty, qualified for tucked projection.** f0 torso38.1,belt36.5,boot35.4±6; f1 torso33.0,belt34.5,boot38.6±4. Boot intervals overlap reference at their edges; torso/belt match, and bent boot silhouettes are coherent. No hidden-leg numeric pass. | Both complete cells; tuck→partial extension readable; static seam no body pop. Runtime flight placement pending. | Proposed PASS at fixture bodyHeight206 only |
| jumpFall04 | **PASS.** f0 torso39±5,belt34.2±4,boot44.7±4; ratios1.02/.95/1.02. f1 retains coherent bent legs, head/build and torso at slightly changed projection. | Both heads/limbs complete; replaces failed03. Two-frame float seam coherent. | Proposed PASS at bodyHeight232 only |
| land04 | HOLD: recovery torso28.2,belt31.0,boot35.4; comparable guard still small. Screening1.23 boot/1.35 torso. | Complete cells; return to idle changes body size | HOLD |
| light1v03 | **PASS body scale within uncertainty**, as fixture1: torso37.1→35.7,belt33→38,boot39.6→42.1 across A/B. Differences overlap measurement ranges; no definite part-scale defect. | f4–6 hair y3 intrudes1px into nominal4px margin; complete canvas silhouette. Static attack/recovery coherent; timed transition pending. | Proposed BODY PASS at bodyHeight238; separate placement HOLD |
| light3v05 | No full anatomy pass. Recovery torso matches, boot36.9 is marginally compatible; do not infer a universal source correction. | Detached/cut arm fragments f1–3; f4 top crop; original raw lost11rows despite fixture-loss0 | HOLD source/fit |
| light4v05 | HOLD: recovery torso30.1,belt29,boot35.7; consistent correction screening1.22–1.27 | Kick clipped right f4/f5 | HOLD scale/fit |
| heavy05 | HOLD: recovery torso27.9,belt28,boot34.8; screening1.26–1.37 | Arm/fist crop and detached edge fragments f3–5 | HOLD scale/source/fit |
| airLight1v05 | Visible body matches: torso38.1,belt33,boot45.2; ratios1/.92/1.03. Guard/anticipation/recovery adult build coherent. Full attack-arm anatomy cannot be certified. | f2/f3 attack arm exits right cell; f1 close to right edge. Static f4 returns coherent guard. | Overall HOLD; visible-body consistency only, no full scaleManualQA pass |
| hurtHigh08 | **PASS within uncertainty**: torso35.2(partly hidden),belt38.3,boot42.4; ratios.93/1.06/.97. Recoil f1 preserves limbs/build/clothing. | All3 cells complete; guard→recoil→guard coherent | Proposed PASS at bodyHeight223 only |
| launched07 | Visible segments plausible: torso40.5,belt30.9(diagonal),boot40.8; no confirmed uniform-scale defect | Both frames crop head/hair left; f0 left arm at edge. Full head/build cannot be certified | HOLD fit; do not redraw merely for reclined bbox |
| getup05 | HOLD: upright torso25,belt27,boot32.6; screening1.33–1.52 confirms small recovery | Rise sequence readable; substantial size change to idle | HOLD scale |
| special03 | Visible body matches within uncertainty: f3 torso42.2,belt39,boot45.7; ratios1.11/1.08/1.05. Extended arm and large stance coherent. | All8 cells crop hair top; worker records768 pixels lost in raw assembly. f0–2 gather,f3–5 palm extension,f6–7 recover; replay relation coherent. | HOLD fit; no complete head pass |
| win04 | Visible torso35,belt37,boot39.8 match uncertainty; slimmer standing silhouette alone not a failure | Hair top all4; raised fist top f2; original staging loss928 pixels | HOLD fit; no complete head/hand pass |

## Pilots remain a separate hash

Guard05 and light205 retain the native-height pilot PASS documented in AUDIT.md, **not in fixture2**. Exact atlas `b319f07b217b76f1292eeba0f1559464b6d6104d7091790180bc8db7293abfe8`, metadata `b4df0fed72369440395e697d5a78cde9a0487f9c6a443830ad497c92e94cf324`; bodyHeights229/236,scale1,quantize48. Current production198/204 shrinks those pixels and remains held. Approved light2v04 drawing approval survives uniform calibration; this is not a new design approval.

## Three unreassembled source holds

- **airHeavy:** original endpoint marks are invalid: boot line ends in background. Earlier torso/boot central-ratio agreement was therefore unreliable. Rear boot screening coordinates and correction guidance are in REASSEMBLY_R02_REVIEW.md. No genuine anatomy mismatch established; re-marking plus quantified fixture is needed. No new candidate/pass.
- **down:** prior collar/belt marks are on head/upper torso rather than folded torso/actual belt. A visible boot alone is insufficient; needs second reliable segment or another frame. HOLD for measurement, not a redraw instruction.
- **charge:** neutral f0→combat stance frames→neutral loop snap remains real. Central scale-ratio disagreement does not prove impossible anatomy; uncertainty intervals overlap. HOLD for pose/loop and unresolved factor. No new candidate/pass.

BeamCharge/beamFire experiments were not included in either r02 fixture and receive no new pass. Their existing holds are unchanged.

## Actionable scope

The completed r02 work supports proposed final-pixel anatomy passes for **jumpUp04,jumpFall04,hurtHigh08**, plus **light1v03 body-only** with a separate margin hold. Pilot guard05/light205 remain separately bound passes. Other body-consistent but cropped outputs are useful calibration evidence, not complete anatomy certifications.

All pass recommendations are **proposed-only until Claude selects identical calibration and the resulting production pixels are checked**. Do not put unconditional production-pass notes against old bodyHeights. User design approval, strict-tool disposition, clipping/contact decisions, timed playback and final public-atlas verification remain separate. Source-factor repair must use corrected source endpoints; the diagnostic ratios above must not become a blanket source rescale rule.

Parent owns the goku-luffy handoff. This auditor changed only manual-audit-r2 evidence. Final release audit remains pending.

## Every-frame ledger

Each row refers to the exact cell hash in MEASUREMENTS.json. BODY PASS does not clear a separate fit hold.

| Animation/version | Frame / atlas slot | Body decision | Native alpha bounds | Static finding |
|---|---:|---|---|---|
| idle v02 | 0 / 0 | REF | 48,9,210,240 | coherent guard |
| idle v02 | 1 / 1 | REF | 47,8,209,240 | coherent guard |
| idle v02 | 2 / 2 | REF | 49,8,210,240 | coherent guard |
| idle v02 | 3 / 3 | REF | 48,9,209,240 | coherent guard |
| idle v02 | 4 / 4 | REF | 48,9,209,240 | coherent guard |
| idle v02 | 5 / 5 | REF | 47,9,209,240 | coherent guard |
| idle v02 | 6 / 6 | REF | 48,9,209,240 | coherent guard |
| idle v02 | 7 / 7 | REF | 48,9,210,240 | coherent loop return |
| run v05 | 0 / 8 | BODY HOLD | 54,47,204,240 | small boot/torso |
| run v05 | 1 / 9 | BODY HOLD | 42,51,192,240 | small boot/torso |
| run v05 | 2 / 10 | BODY HOLD | 79,48,229,240 | profile stride coherent; small body |
| run v05 | 3 / 11 | BODY HOLD | 0,47,157,240 | rear boot cut left |
| run v05 | 4 / 12 | BODY HOLD | 93,46,242,240 | profile stride coherent; small body |
| run v05 | 5 / 13 | BODY HOLD | 10,46,172,240 | extended stride; small body |
| run v05 | 6 / 14 | BODY HOLD | 0,49,158,240 | rear boot cut left |
| run v05 | 7 / 15 | BODY HOLD | 54,47,204,240 | repeat f0; seam coherent |
| dash v04 | 0 / 16 | BODY HOLD | 75,71,229,240 | short visible boot/torso |
| dash v04 | 1 / 17 | BODY HOLD | 0,69,156,240 | rear boot cut left |
| jumpUp v04 | 0 / 18 | QUALIFIED PASS | 91,56,199,240 | tucked boot projection; compatible within stated uncertainty |
| jumpUp v04 | 1 / 19 | QUALIFIED PASS | 94,36,204,240 | partial extension; compatible body; no cut |
| jumpFall v04 | 0 / 20 | PASS | 46,9,226,240 | complete float pose; matched body |
| jumpFall v04 | 1 / 21 | PASS | 50,14,226,240 | complete float pose; coherent seam |
| land v04 | 0 / 22 | BODY HOLD | 60,75,206,240 | crouched contact pose coherent |
| land v04 | 1 / 23 | BODY HOLD | 56,43,202,240 | upright recovery undersized |
| light1 v03 | 0 / 24 | BODY PASS | 51,17,206,240 | A guard matches within uncertainty |
| light1 v03 | 1 / 25 | BODY PASS | 49,20,209,240 | A anticipation coherent |
| light1 v03 | 2 / 26 | BODY PASS | 48,20,209,240 | A anticipation coherent |
| light1 v03 | 3 / 27 | BODY PASS | 49,20,242,240 | A extended arm coherent |
| light1 v03 | 4 / 28 | BODY PASS | 45,3,224,240 | B follow-through; y3 top margin |
| light1 v03 | 5 / 29 | BODY PASS | 45,3,210,240 | B recovery; y3 top margin |
| light1 v03 | 6 / 30 | BODY PASS | 48,3,209,240 | B guard; y3 top margin; body matches within uncertainty |
| light3 v05 | 0 / 31 | ANATOMY HOLD | 58,29,207,240 | guard visually plausible |
| light3 v05 | 1 / 32 | ANATOMY HOLD | 79,35,225,240 | detached edge fragment |
| light3 v05 | 2 / 33 | ANATOMY HOLD | 66,12,230,240 | rear arm severed; detached hand at edge |
| light3 v05 | 3 / 34 | ANATOMY HOLD | 58,16,212,240 | rear arm severed |
| light3 v05 | 4 / 35 | ANATOMY HOLD | 90,4,229,240 | hair truncated top |
| light3 v05 | 5 / 36 | ANATOMY HOLD | 54,21,203,240 | recovery visually plausible |
| light3 v05 | 6 / 37 | ANATOMY HOLD | 54,20,203,240 | recovery body not independently failed; source defects keep strip held |
| light4 v05 | 0 / 38 | BODY HOLD | 56,42,202,240 | small guard |
| light4 v05 | 1 / 39 | BODY HOLD | 57,43,206,240 | small anticipation |
| light4 v05 | 2 / 40 | BODY HOLD | 49,46,212,240 | turn coherent; smaller build |
| light4 v05 | 3 / 41 | BODY HOLD | 39,40,200,240 | turn coherent; smaller build |
| light4 v05 | 4 / 42 | BODY HOLD | 68,39,255,240 | extended kick cut right |
| light4 v05 | 5 / 43 | BODY HOLD | 66,42,255,240 | extended kick cut right |
| light4 v05 | 6 / 44 | BODY HOLD | 85,37,205,240 | raised foot near right edge |
| light4 v05 | 7 / 45 | BODY HOLD | 56,40,201,240 | small recovery guard |
| heavy v05 | 0 / 46 | BODY HOLD | 53,55,204,240 | small guard |
| heavy v05 | 1 / 47 | BODY HOLD | 50,59,206,240 | small anticipation |
| heavy v05 | 2 / 48 | BODY HOLD | 51,50,206,240 | small wind-up |
| heavy v05 | 3 / 49 | BODY HOLD | 78,31,255,240 | extended fist cut at right edge |
| heavy v05 | 4 / 50 | BODY HOLD | 75,37,255,240 | arm severed; detached edge fragment |
| heavy v05 | 5 / 51 | BODY HOLD | 59,36,255,240 | arm severed; detached edge fragment |
| heavy v05 | 6 / 52 | BODY HOLD | 29,49,204,240 | small recovery |
| heavy v05 | 7 / 53 | BODY HOLD | 54,49,202,240 | small guard recovery |
| airLight1 v05 | 0 / 54 | VISIBLE BODY CONSISTENT; ARM HOLD | 105,4,242,240 | guard coherent |
| airLight1 v05 | 1 / 55 | VISIBLE BODY CONSISTENT; ARM HOLD | 108,7,255,240 | anticipation coherent; right margin close |
| airLight1 v05 | 2 / 56 | VISIBLE BODY CONSISTENT; ARM HOLD | 100,12,255,240 | strike arm cut right |
| airLight1 v05 | 3 / 57 | VISIBLE BODY CONSISTENT; ARM HOLD | 106,11,255,240 | strike arm cut right |
| airLight1 v05 | 4 / 58 | VISIBLE BODY CONSISTENT; ARM HOLD | 104,7,236,240 | guard recovery coherent |
| hurtHigh v08 | 0 / 59 | PASS | 45,19,211,240 | guard coherent |
| hurtHigh v08 | 1 / 60 | PASS | 41,22,211,240 | recoil coherent; projected torso |
| hurtHigh v08 | 2 / 61 | PASS | 45,18,212,240 | guard recovery coherent |
| launched v07 | 0 / 62 | VISIBLE BODY CONSISTENT; HEAD HOLD | 0,42,196,240 | head cropped left; arm at edge |
| launched v07 | 1 / 63 | VISIBLE BODY CONSISTENT; HEAD HOLD | 0,77,176,240 | head cropped left |
| getup v05 | 0 / 64 | BODY HOLD | 67,113,209,240 | kneeling body coherent but small |
| getup v05 | 1 / 65 | BODY HOLD | 75,91,192,240 | kneeling body coherent but small |
| getup v05 | 2 / 66 | BODY HOLD | 78,89,201,240 | rising crouch coherent but small |
| getup v05 | 3 / 67 | BODY HOLD | 65,71,196,240 | standing transition undersized |
| getup v05 | 4 / 68 | BODY HOLD | 66,56,189,240 | upright guard confirms small body |
| special v03 | 0 / 69 | VISIBLE BODY CONSISTENT; HEAD HOLD | 22,4,226,240 | hair cropped top; gather |
| special v03 | 1 / 70 | VISIBLE BODY CONSISTENT; HEAD HOLD | 23,5,227,240 | hair cropped top; gather |
| special v03 | 2 / 71 | VISIBLE BODY CONSISTENT; HEAD HOLD | 22,4,228,240 | hair cropped top; gather |
| special v03 | 3 / 72 | VISIBLE BODY CONSISTENT; HEAD HOLD | 22,4,233,240 | hair cropped top; palm extension |
| special v03 | 4 / 73 | VISIBLE BODY CONSISTENT; HEAD HOLD | 21,5,249,240 | hair cropped top; palm extension |
| special v03 | 5 / 74 | VISIBLE BODY CONSISTENT; HEAD HOLD | 21,4,229,240 | hair cropped top; palm extension |
| special v03 | 6 / 75 | VISIBLE BODY CONSISTENT; HEAD HOLD | 22,4,226,240 | hair cropped top; recover |
| special v03 | 7 / 76 | VISIBLE BODY CONSISTENT; HEAD HOLD | 22,5,227,240 | hair cropped top; recover |
| win v04 | 0 / 77 | VISIBLE BODY CONSISTENT; FULL HOLD | 77,4,184,240 | hair top truncated |
| win v04 | 1 / 78 | VISIBLE BODY CONSISTENT; FULL HOLD | 77,4,184,240 | hair top truncated |
| win v04 | 2 / 79 | VISIBLE BODY CONSISTENT; FULL HOLD | 78,4,196,240 | hair and raised fist top truncated |
| win v04 | 3 / 80 | VISIBLE BODY CONSISTENT; FULL HOLD | 77,4,184,240 | hair top truncated; loop rest transition |
