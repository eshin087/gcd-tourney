# Goku reassembly r02 — fixture 1 quantized audit

Date: 2026-10-15. Astra manual static frame/sequence audit. All 64 frames (12 animations including approved idle) inspected at native density; representative endpoint overlays were inspected at nearest-neighbor3x. This is a diagnostic fixture audit, not design approval or a production release pass.

## Exact scope

- Sheet SHA-256: `f56ef41137234e3f955900660d903359c7d060178a3e29ca4a6e707944f55f81`
- Metadata SHA-256: `e37f1dc357328d97473c251a9b18a0ba3e4f79fc2c8a511603058d929fe947eb`
- Files: `production/scale-qa/reassembly-r02/fixture-public/characters/goku/{sheet.png,anims.json}`.
- 256px cells,16 columns,pivot[128,240],pixelsPerUnit128; `--quantize 48 --no-writeback`, isolated `scaleGate:warn`. Independently counted48 opaque RGB values.
- Source-to-fixture shifts and losses are pinned in fixture-inventory.json. Per-cell hashes, atlas indexes, durations, actual alpha bounds and independent endpoints are in `REASSEMBLY_R02_FIXTURE1_MEASUREMENTS.json` beside this report. The twelve `r02-*-landmarks-3x.png` files show representative manual marks.
- Proposed fixture bodyHeight values: idle233,run195,dash172,jumpFall240,land198,light1238,light3240,light4205,heavy211,hurtHigh223,getup186,win240. These settings do not repair pixels already missing from staged inputs. No pass transfers to current production bodyHeight values or another sheet.

## Reference and measurement limits

Approved title neutral/combat and idle02 are the same independently audited reference cells documented in AUDIT.md. Harmonized idle torso38.1±5px, belt36±4px, boot43.7±4px. Representative candidate length uncertainty: torso±5px,belt±4px,boot±4px; hurtHigh guarded torso is partly occluded, so use±7px and treat as a screening check. Endpoints are manual native-cell coordinates, not automatic head-probe output. Knees/shins under the gi are unmeasured. Forearms are visually checked for continuity/build and compared only where the pose reveals them; no fabricated hidden-joint measurements. Hair silhouette, head shape, torso mass, arms, leg/clothing volume and shoes were inspected across every frame.

Ratios below are candidate/idle. Correction ranges are landmark-specific screening evidence, **not an approved resample factor**: source endpoints must be corrected and affected final pixels re-audited. A pose-dependent screen width alone does not establish mismatch. Holds below use additional visible segment evidence, clear truncation, or disconnected anatomy.

## Per-strip decisions

| Strip | Body-scale finding | Fit/source/sequence finding | Recommendation |
|---|---|---|---|
| idle02 | Reference; original adult build retained across8frames | Static loop seam coherent | Reference only |
| run05 | HOLD: f0 torso32.5(.85),belt25.3(.70,profile-sensitive),boot32.9(.75). Boots visibly short across stride; screening correction1.17 torso/1.33 boot, not universal1.42 belt. | f3/f6 rear boot cut at left. f7→f0 coherent repeated running pose; limb swing legible. | HOLD; re-mark source anatomy before enlarging and re-evaluate overflow |
| dash04 | HOLD: f0 torso25.8(.68),boot26.2(.60),belt27.2(.76). Crouch explains height, not all of boot shortening; projected axes increase uncertainty. Screening corrections1.48 torso/1.67 boot; no single factor certified. | f1 rear boot cut left; f1→f0 otherwise coherent dash cycling. | HOLD; corrected source landmarks needed |
| jumpFall03 | HOLD: historical disputed factor; missing head prevents complete comparison. Visible body overly large relative to idle. | Both frames lose head/hair at top; staged loss5498 non-magenta pixels. | HOLD; superseded correction04 must be audited separately |
| land04 | HOLD: recovery f1 torso28.2(.74),belt31.0(.86),boot35.4(.81). Comparable recovery pose confirms undersize; screening1.23 boot/1.35 torso. | No cut visible; f0 crouch→f1 recovery coherent, but f1→idle body-size change. | HOLD calibration |
| light1v03 | **PASS body scale within stated uncertainty:** f0 torso37.1(.97),belt33.0(.92),boot39.6(.91); f6 torso35.7(.94),belt38.0(1.06),boot42.1(.96). A/B boot difference2.5px is below combined uncertainty; torso intervals overlap. Head/build/clothing and visible limbs coherent throughout. | B half f4–6 has hair at y3,1px into nominal4px top margin, without hard canvas crop. A/B standing silhouette changes modestly; static pose transition explains much of it. | Body-only proposed pass at these exact pixels; placement/margin HOLD and timed transition review remain |
| light3v05 | Visible recovery torso37.4(.98),belt32(.89),boot36.9(.84); boot interval marginally overlaps reference, so no definite uniform-factor correction from this alone. **Full anatomy HOLD**, no scaleManualQA pass. | Detached edge arm/hand pieces f1–3; f2/f3 rear arm cut; f4 top truncation. Prior raw clip11rows persists; fixture lost0 does not undo it. | HOLD source/cell integrity |
| light4v05 | HOLD: f7 torso30.1(.79),belt29.0(.81),boot35.7(.82); consistent small recovery body. Screening correction1.22–1.27 across independent landmarks. | f4/f5 kick cut at right; f6 raised foot near right edge. f7 returns coherently to smaller guard, then size changes to idle. | HOLD calibration and fit |
| heavy05 | HOLD: f7 torso27.9(.73),belt28.0(.78),boot34.8(.80); screening correction1.26–1.37. Smaller recovery build repeats f0/f6/f7. | f3 fist at right edge; f4/f5 arm cut with detached edge fragments. | HOLD calibration and source/cell integrity |
| hurtHigh08 | **PASS anatomy/body scale within uncertainty:** f2 torso35.2(.93,partly obscured),belt38.3(1.06),boot42.4(.97); f0 guard and f1 recoil preserve head/build/clothing/visible limb scale. f1 extension differs in projection, without body-size discontinuity. | No truncation or disconnected limb observed. Guard→recoil→guard readable; recovery→idle plausible. | Proposed manual PASS for this exact fixture/settings; runtime timing/contact and user approval remain |
| getup05 | HOLD: f4 torso25(.66),belt27(.75),boot32.6(.74); clear smaller upright body, not a crouched-height inference. Screening correction1.33–1.52; no approved single factor. | Kneel→rise coherent, but f4→idle large size discontinuity. No cut seen. | HOLD calibration |
| win04 | **Visible torso/belt/boot dimensions match within uncertainty:**35(.92),37(1.03),39.8(.91). Standing pose/slimmer silhouette does not itself fail anatomy. Complete head/raised-hand comparison impossible. | Hair top cropped throughout; f2 raised fist cropped. Staging lost928 pixels. f3→f0 switches guard arm to rest, readable celebratory loop but timed review pending. | Overall HOLD fit; limited visible-body consistency is not complete scaleManualQA pass |

## Static versus timed evidence

All frames and first/last relationships were inspected as static sequences. Metadata timings were recorded, not played by this auditor. No runtime contact, hitbox, timing, or gameplay certification is claimed. Parent may append independently observed playback evidence. Low-confidence head palette measurements remain irrelevant to these decisions; scaleAudit.head values are measurements, not evidence that pixels were normalized to valid anatomy.

## Production and handoff

Only light1v03 has a body-only proposed pass, and hurtHigh08 a full visible-anatomy proposed pass in this freeze. Parent/Claude must select matching calibration and verify final pixel identity before production scaleManualQA can inherit either result. Margin/source/clip holds remain separate and cannot be cleared by a body-scale note. Final release audit remains pending. No manifest, source, tool, approval or public production output was modified by Astra. Parent owns the goku-luffy handoff.

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
| jumpFall v03 | 0 / 18 | HOLD | 28,4,253,240 | head truncated top |
| jumpFall v03 | 1 / 19 | HOLD | 32,4,253,240 | head truncated top |
| land v04 | 0 / 20 | BODY HOLD | 60,75,206,240 | crouched contact pose coherent |
| land v04 | 1 / 21 | BODY HOLD | 56,43,202,240 | upright recovery undersized |
| light1 v03 | 0 / 22 | BODY PASS | 51,17,206,240 | A guard matches within uncertainty |
| light1 v03 | 1 / 23 | BODY PASS | 49,20,209,240 | A anticipation coherent |
| light1 v03 | 2 / 24 | BODY PASS | 48,20,209,240 | A anticipation coherent |
| light1 v03 | 3 / 25 | BODY PASS | 49,20,242,240 | A extended arm coherent |
| light1 v03 | 4 / 26 | BODY PASS | 45,3,224,240 | B follow-through; y3 top margin |
| light1 v03 | 5 / 27 | BODY PASS | 45,3,210,240 | B recovery; y3 top margin |
| light1 v03 | 6 / 28 | BODY PASS | 48,3,209,240 | B guard; y3 top margin; body matches within uncertainty |
| light3 v05 | 0 / 29 | ANATOMY HOLD | 58,29,207,240 | guard visually plausible |
| light3 v05 | 1 / 30 | ANATOMY HOLD | 79,35,225,240 | detached edge fragment |
| light3 v05 | 2 / 31 | ANATOMY HOLD | 66,12,230,240 | rear arm severed; detached hand at edge |
| light3 v05 | 3 / 32 | ANATOMY HOLD | 58,16,212,240 | rear arm severed |
| light3 v05 | 4 / 33 | ANATOMY HOLD | 90,4,229,240 | hair truncated top |
| light3 v05 | 5 / 34 | ANATOMY HOLD | 54,21,203,240 | recovery visually plausible |
| light3 v05 | 6 / 35 | ANATOMY HOLD | 54,20,203,240 | recovery body not independently failed; source defects keep strip held |
| light4 v05 | 0 / 36 | BODY HOLD | 56,42,202,240 | small guard |
| light4 v05 | 1 / 37 | BODY HOLD | 57,43,206,240 | small anticipation |
| light4 v05 | 2 / 38 | BODY HOLD | 49,46,212,240 | turn coherent; smaller build |
| light4 v05 | 3 / 39 | BODY HOLD | 39,40,200,240 | turn coherent; smaller build |
| light4 v05 | 4 / 40 | BODY HOLD | 68,39,255,240 | extended kick cut right |
| light4 v05 | 5 / 41 | BODY HOLD | 66,42,255,240 | extended kick cut right |
| light4 v05 | 6 / 42 | BODY HOLD | 85,37,205,240 | raised foot near right edge |
| light4 v05 | 7 / 43 | BODY HOLD | 56,40,201,240 | small recovery guard |
| heavy v05 | 0 / 44 | BODY HOLD | 53,55,204,240 | small guard |
| heavy v05 | 1 / 45 | BODY HOLD | 50,59,206,240 | small anticipation |
| heavy v05 | 2 / 46 | BODY HOLD | 51,50,206,240 | small wind-up |
| heavy v05 | 3 / 47 | BODY HOLD | 78,31,255,240 | extended fist cut at right edge |
| heavy v05 | 4 / 48 | BODY HOLD | 75,37,255,240 | arm severed; detached edge fragment |
| heavy v05 | 5 / 49 | BODY HOLD | 59,36,255,240 | arm severed; detached edge fragment |
| heavy v05 | 6 / 50 | BODY HOLD | 29,49,204,240 | small recovery |
| heavy v05 | 7 / 51 | BODY HOLD | 54,49,202,240 | small guard recovery |
| hurtHigh v08 | 0 / 52 | PASS | 45,19,211,240 | guard coherent |
| hurtHigh v08 | 1 / 53 | PASS | 41,22,211,240 | recoil coherent; projected torso |
| hurtHigh v08 | 2 / 54 | PASS | 45,18,212,240 | guard recovery coherent |
| getup v05 | 0 / 55 | BODY HOLD | 67,113,209,240 | kneeling body coherent but small |
| getup v05 | 1 / 56 | BODY HOLD | 75,91,192,240 | kneeling body coherent but small |
| getup v05 | 2 / 57 | BODY HOLD | 78,89,201,240 | rising crouch coherent but small |
| getup v05 | 3 / 58 | BODY HOLD | 65,71,196,240 | standing transition undersized |
| getup v05 | 4 / 59 | BODY HOLD | 66,56,189,240 | upright guard confirms small body |
| win v04 | 0 / 60 | VISIBLE BODY CONSISTENT; FULL HOLD | 77,4,184,240 | hair top truncated |
| win v04 | 1 / 61 | VISIBLE BODY CONSISTENT; FULL HOLD | 77,4,184,240 | hair top truncated |
| win v04 | 2 / 62 | VISIBLE BODY CONSISTENT; FULL HOLD | 78,4,196,240 | hair and raised fist top truncated |
| win v04 | 3 / 63 | VISIBLE BODY CONSISTENT; FULL HOLD | 77,4,184,240 | hair top truncated; loop rest transition |
