# Final Astra audit — Killua ART-SIZE-R8 A9/A10

Date: 2026-11-09 UTC (2026-11-08 local). Reviewer: GPT-6 Astra, medium. Audit only; no generation, repack, exemption, manifest, hitbox, production atlas, or approval changes.

## Verdict

- **A9 `superPose` v09: PASS — anatomy, scale, packed-cell integrity, and four-frame loop.** A version-bound `scaleManualQA` anatomy pass is justified for v09, if the coordinator needs that record. This does not authorize unrelated versions or waive runtime integration checks.
- **A10 `getup` v08: HOLD — anatomy/scale pass; floor-contract disposition remains open.** The f0 H=0.480 reading is a rotated-head probe failure, not a half-size head. A version-bound manual **anatomy/scale** pass is justified for v08 including f0, with this report cited. Do not use a generic manual pass to imply that its ground warning passed: the literal ground predicate still fails. Claude must check the folded-foot contact/shadow behavior and resolve that specific warning under the production contract before full technical clearance. No anatomy redraw or whole-strip resize is justified by this audit.

User approval is separate: relay `audit1 #8`, “Approve both,” approves these drawings as drawn. It does not clear technical, runtime, merge, or production-deployment gates.

## Exact evidence inspected

Worktree: `E:\Vibe Coding\.codex\worktrees\art-size-r8-a\gcdTourney`, branch `art/size-r8-a` (locked).

Actual 48-color diagnostic pack directory:
`E:\Vibe Coding\.codex\visualizations\2026\11\09\01a1bdc6-197c-7b01-b15e-921d5c059ab8\killua-r8-astra-audit\out\characters\killua\`

- `sheet.png`: SHA-256 `90A4F8EA9151FC68B42397A042C21BCE713414A1E65B798289BB64996DD6BE30`.
- `anims.json`: SHA-256 `24B1D75AAD093FD5E91076AF2FC3B7FA55627B64248FA1A581A51C1C7D9960A0`.
- Recomputed both hashes and compared decoded RGBA pixels of **each** review-strip cell directly with its indexed atlas cell; all nine were identical. Thus visual inspection below is of the actual quantized atlas pixels, not raw-source inference.
- `public/reviews/size-r8-killua/superPose-candidate-packed.png`: v09, atlas indices 173–176; 120 ms each; loop=true. Recorded file hash `4C209C68AD1138785040416D9038D8855496B467D9FF62509C1F7631C01E4AC1`.
- `public/reviews/size-r8-killua/getup-candidate-packed.png`: v08, atlas indices 110–114; 70/60/60/80/70 ms; loop=false. Recorded file hash `5C83F4ABD2C53FBC5FDEB6B758115F1494063BB509CAB825429C7F421E3D5E62`.
- Equal-density references inspected: `public/reviews/size-r8-killua/idle-packed.png`, `killua-neutral_v01.png`, `killua-combat_v01.png`; overview `body-candidates.png` in that directory.
- Source/version provenance and automated H/B values: `art/characters/killua/production/size-r8/GENERATION_INVENTORY.md`; sources `raw/superPose_v09.png` and `raw/getup_v08.png`. Previous v08/v07 are historical inputs, not the audited outputs.
- Governing documents: `art/scale/title-style-pilot/PRODUCTION_CONTRACT.md`, `art/scale/size-r8/AUDIT.md`, `art/SPEC.md`, ADR 0029 and ADR 0020. Read the actual groundContact predicate in `tools/pack-sprites.mjs`; did not change it.

## Measurement method and limits

All measurements are at 256 px cell density, pivot [128,240], ppu 128. Exact occupied bounds below come from alpha pixels; bounds use exclusive right/bottom. They include hair, hands and clothing and are **not** anatomical height measurements. Segment estimates are manual image readings, generally +/-3–4 px at visible joints and +/-5–8 px where the shirt/shorts hide joints. They support the R8 investigation of clear bulk/scale errors, not a claim that every hidden bone has been certified within a strict +/-6% band. Hair is not the skull crown. The title contract itself retains source-crown uncertainty.

Useful direct comparisons: neutral occupied bounds (87,55,169,241); idle f0 (68,85,187,241); combat (54,96,202,241). Neutral and superPose use the straighter, longer-shirt presentation; idle/getup use the folded combat presentation. This family distinction is already recorded in the R8 audit; matching every posed bounding height to idle would introduce an error.

Manual segment checks (approximate, not automatic probe output):

| Landmark/segment | Approved reference | Audited candidate | Interpretation |
|---|---|---|---|
| Neutral collar-to-shirt hem | about 48 px | superPose f0–f3 about 47–50 px | Preserves neutral torso; raised sleeve is not shoulder inflation |
| Neutral shorts envelope | about 46 px wide, 34 px high | superPose about 45–48 wide, 31–35 high | Previous ~19% excess is absent |
| Neutral exposed shin path | about 35–38 px | superPose about 35–39 px | Lean calf lengths retained; knees/hem have several pixels uncertainty |
| Neutral near calf thickness | about 8–11 px | superPose about 8–11 px | No ~20% leg-thickness inflation |
| Neutral shoes | near about 17–19 px wide; far about 25–28 px | superPose near about 15–18; far about 24–27 | Comparable perspective-dependent footwear; no enlarged shoe mass |
| Combat/idle collar-to-hem path | roughly 35–42 px | getup f4 roughly 36–42 px | Comparable torso under a lower/wider guard; not the neutral's straight torso length |
| Idle hair/face head envelope | roughly 40–45 px across | getup f0 roughly 38–44 across the rotated head | Rules out H=.480 as anatomy; silhouette/face are full-size |

Projected arm or thigh lengths are not interchangeable across poses. For flexed/occluded limbs I traced shoulder–elbow–wrist and hip–knee–ankle direction, visible thickness and endpoints, without fabricating exact hidden-joint ratios.

## A9 — superPose v09, every frame and loop

Recorded probe H: 1.000, .975, 1.029, 1.000. Recorded advisory garment-area B: .938, .890, .900, .920. These accompany, not replace, the segment inspection.

| Frame / exact bounds | Head, torso and shoulders | Arms/hands | Legs, shorts and shoes/contact |
|---|---|---|---|
| f0 (85,57,172,241) | Full-size head against neutral; narrow torso, no inflated shoulder cap | Raised forearm crosses chest; compact hooked fingers, low hand distinct from sleeve | Narrow shorts; lean exposed shins; both complete shoes settle at floor; no clipping |
| f1 (85,58,172,241) | Slight hair/crown settling, not a body-size change; torso remains same family | Claw/forearm flex changes outline without added arm thickness; low fingers remain compact | Shorts fold changes, not added thigh width; shin and shoe sizes agree with f0 |
| f2 (86,55,172,241) | Hair/upper body rises 2–3 px; head remains within reference scale; no chest expansion | Raised wrist and hand retain size; sleeves do not balloon | Shorts hem rises slightly with pose; knee/ankle chains remain lean; feet remain grounded |
| f3 (85,57,172,241) | Returns to f0 envelope and narrow shoulder/torso scale | Same compact hand and arm family; no stray or amputated fingers at cell edge | Same leg lengths, shorts volume and shoes as f0; no lower-body scale step |

Loop f0→f1→f2→f3→f0 was inspected in order. The largest crown excursion is 3 px; soles stay y240. f3→f0 returns to identical occupied bounds with only drawing/finger/fold variation, not a scale pop. Arms partly overlap the torso and the legs stand closer together than idle; the lower B median (.910) is therefore not evidence of a 9% anatomical shrink. The neutral comparison and visible shin/shorts dimensions are the stronger checks here. PASS.

## A10 — getup v08, every frame and transition

Recorded H: f0 .480 (invalid for this pose), then 1.019, 1.018, 1.050, 1.010. B: .730, .866, .966, .831, .892. Garment overlap and view direction change drastically across this kip-up; none of those B values alone measures bone length.

| Frame / exact bounds | Head, torso and shoulders | Arms/hands | Legs, shorts and shoes/contact |
|---|---|---|---|
| f0 (73,169,201,241) | Rotated full-size silver head, face tucked; shirt compressed under folded posture, not tiny torso | Visible planted palm/forearm supports head-side end; far arm is occluded, not independently measurable | Knees folded toward chest, thighs/shorts overlap; lower legs and shoes are lifted. Broad back/hip/hand support is grounded; see exact floor check below |
| f1 (84,83,182,241) | Head same scale as f0, body rolls upward; shoulder-to-waist chain is oblique, not enlarged chest | Elbow-to-palm support readable on both sides; wrists/hands stay compact | Shorts run diagonally into raised bent legs; lean calves, overlapping shoes. Hand/shoulder end supports floor; raised footwear is intentional |
| f2 (40,96,175,241) | Head retains size on tilted-back torso; no ballooning chest/shoulders | Both arms extend with slim sleeve/forearm chains and small spread hands | Folded legs and overlapping shoes explain compressed leg projection; shorts remain lean. Lowest packed shoe y240 follows SPEC's airborne anchoring, not proof of airborne runtime motion |
| f3 (100,100,204,241) | Full-size head in deep landing crouch; compact folded torso | Forearm/hand come toward guard; sleeves and hands match combat build | Bent thighs overlap shorts; near shin has credible length despite crouch; far shoe partly occluded. Near shoe grounds landing; no clipping |
| f4 (57,98,195,241) | Combat-size head/torso with narrower slim build; not v07's oversized upper body | Loose guard, compact hands; shoulder and upper-arm volume match combat reference | Wide, lower guard; slim diagonal calves, normal shorts, complete shoes. No bulk discontinuity into idle |

Endpoints: f0→f1 changes from tuck to shoulder/palm push with a continuous full-size head and consistent garment/limb thickness. f1→f2 unfolds the body; f2→f3 folds into landing, without a size jump. f3→f4 opens the stance. This is **not** a looping strip; do not judge f4→f0 as a required loop. For f4→idle f0, candidate crown y98 versus idle y85 is a 13 px posture rise, not a 13 px head shrink: approved combat crown is y96. Candidate width 138 px versus combat 148 and idle 119 reflects the wider guard/feet and different arm extension. Torso, hands, shins and shoes do not show the prior bulk-to-idle slimming. Runtime timing/movement was not tested here.

### f0 floor warning: exact reproduction and interpretation

Recomputed from the actual cell with alpha >=128 and contact distance <=5 px:

- 128 occupied columns; 98 within 5 px of floor: 76.5625%, rounding to the reported 77%. This is a fraction of **columns**, not of all body pixels.
- Minimum floor gaps by left-to-right fifth: **[0, 0, 1, 1, 13] px**.
- Sample support-column lowest pixels: x85→239, x95→239, x105→240, x115→240, x125→238, x135→238, x145→238, x155→239, x165→239.
- At the transition to the folded limbs: x175→228, x177→225; the lifted footwear region x180→199, x190→201, x200→181.

Thus the far-right fifth, covering the upward-folded legs/footwear, creates the warning. It is not a broad floating back or a lone supporting toe: the hand/back/hip support spans most of the pose. The head is actively tucked/lifted, consistent with preparing a kip-up rather than a resting KO. The numerical floor measurement is real and reproducible (one-pixel contour precision), but its inference of an accidentally floating resting body is pose-sensitive here. The supplied brief explicitly requires knees to chest and planted palms. The production contract says not to replace selected poses merely to satisfy a stale side-on brief.

Nevertheless the literal SPEC/packer predicate still fails, and this audit has not observed the in-game footprint shadow or support at the spec camera. **Keep A10's overall technical HOLD until Claude documents the runtime/contact disposition.** Do not suppress the warning by resizing the head, sinking the whole sprite, flattening the approved tuck, weakening thresholds, or treating image approval as a waiver. A version-specific anatomy note can safely explain the invalid head probe; it cannot silently waive a separate floor rule.

## Handoff

Only this report is added by this auditor. No production atlas, hitboxes, raw art, approval fields, or shared records were edited. No merge, unlock, preview or production publish. Coordinator owns manifest/manual-QA recording and Claude handoff. The current diagnostic pack is not proof of the production atlas or runtime behavior.

## Post-audit packer check

After recording version-bound anatomy/scale QA for v09/v08, the coordinator reran the packer to an isolated `out-after-qa/` folder with `--quantize 48 --no-writeback`. The sheet SHA-256 remains `90A4F8EA9151FC68B42397A042C21BCE713414A1E65B798289BB64996DD6BE30`, byte-identical to the atlas inspected above. Updated `anims.json` SHA-256 is `AF9281715499F3BF095DC4B0B18A487DA5170BEA6E8555C30DCA351A68F5FB9D`. The stale v07 manual-QA and unmeasured f0 warnings are gone; the separate getup v08 floor-contact warning remains, as does the unrelated idle-baseline warning. This verification stayed in scratch and wrote no production output; the technical hold remains for Claude's runtime contact/shadow disposition.
