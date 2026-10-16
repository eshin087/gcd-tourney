# Round 4 independent final art audit — three fighters, v01

Auditor: GPT-6 Astra, medium; 2026-10-12 America/Los_Angeles (2026-10-13 UTC). **HOLD: Killua, Sasuke and Naruto. No full-body PASS and no art approval.** Gojo and Naruto attack alts are outside this report. This is a read-only production audit; only this report and derived evidence were written.

The matching AGENTS.md/CLAUDE.md model rule, main round-4 inbox and title-style PRODUCTION_CONTRACT.md were read. Approved neutral/combat v01 cells were displayed at the same native density as direct 256×256 atlas crops. Historical head31/body200/canon formulas were not used. The working idle is a comparison, not a replacement for the approved cells.

## Evidence and reproducibility

`audit_extract.py` extracts directly from the actual quantized atlases using each atlas's animation indices. The nine `{fighter}-{candidate,retained,old-replaced}.png` sheets preserve native pixel density in their saved files; display software may reduce the larger sheets. No cached `frames/` image was substituted. `atlas-hashes.json` records exact atlas and JSON SHA-256; `independent-checks.json` records exact occupied bounds, palette counts and source-hash comparisons. All three candidate atlases contain exactly 48 opaque RGB colors.

| Fighter | Worktree | Candidate atlas SHA-256 | Baseline atlas SHA-256 |
|---|---|---|---|
| Sasuke | `.worktrees/art-sasuke-title-r3` | `92fefb5770f429da4ce3cafbd70ee3a07b7f3eba26d51595cc438c081af92e50` | `b2a847f90d261ccc20ecb801442b63150a0ab422ab6be2913ac29b6927aad0f4` |
| Killua | `.worktrees/art-killua-title-r3` | `f9d0d80a7b0bbc9341fe909d5bf57bccdfb3f8c0297a16069453a6d772a0097a` | `771b510a9e82aa664abb936c597f416b2c3058e63dacf29efe5b7c9f0a062686` |
| Naruto | `.worktrees/art-naruto-title-r3` | `0496c7aae6da74b5611e8cab204d193d7de865d1bf09589eac20ed52ed3578a2` | `8d33ba2116321822db29f76c6e6edd3433c155775e5cb599b3f1774aa2effe53` |

Sasuke's selected four raw hashes match the inventory, and its final metadata atlas hash matches the displayed candidate. Killua's ten recorded source hashes (including earlier preserved attempts) match the current files; its diagnostic log names idle11, guard09, superDash08, stagger07 and win05. Naruto's diagnostic log names stagger06, taunt07 and win08; its selected inventory agrees, and current source hashes are recorded independently in `independent-checks.json`. **The animation JSON files themselves do not embed raw-source hashes.** These are inventory/log/hash consistency checks, not a fresh deterministic rebuild proving source-to-atlas lineage. No mismatch was found; the missing embedded binding remains a provenance limitation. Sasuke's `atlas-metadata.json` is under `art/characters/sasuke/production/round4/final-candidates/`, not adjacent to the public candidate atlas as the worker report could imply.

All frames in the named strips were visually inspected in order, including first/last loop joins and Killua idle's A/B join. Coverage: Sasuke 34 old + 8 selected frames; Killua 37 old (including old idle, guard and superDash) + 20 selected; Naruto 14 old + 10 selected = 123 frame instances, plus neutral/combat/idle comparison cells. This is an independent visual and technical audit with independent exact bounds/palette/hash checks. It is **not a second complete coordinate digitization of all garment-covered joints**. The worker's numerical tables were checked for visible landmark plausibility and interval logic; their uncertain limb estimates were not relabeled as independent precise measurements.

## Measurement interpretation

Visible crown-to-chin includes hair. Tilted heads need an anatomical-axis comparison; a topmost hair spike is not a hidden scalp landmark. Torso means the visible collar/zipper/hem relationship, not bounding-box height. Arm and leg chains need identifiable shoulder/elbow/wrist and hip/knee/ankle landmarks. Clothing hides many of these. Frontal shoulder width is unmeasured in these three-quarter, turned or folded views; outer sleeve width does not replace it.

For candidate length c±u and baseline b±v, the conservative ratio interval is `[(c-u)/(b+v), (c+u)/(b-v)]`. A pass requires the complete interval within 0.94–1.06 (Killua footwear 0.96–1.04). An interval overlapping either boundary is inconclusive, even if its midpoint matches. Exact opaque bounds establish the explicit posed-height target only; they do not establish limb anatomy. No hidden joint was inferred to make a pass.

## Sasuke — HOLD

Independent visual comparison confirms the selected beamFire/dash reduce the conspicuously large sandals and body volume of their old versions. The new superDash has a fuller trunk than v05, but its leading fist is absent from the packed cell although complete in the raw source. Approved neutral/combat identity remains recognizable throughout; this does not clear scale.

| Selected strip | Frames inspected | Findings and segment limitations | Join/loop result |
|---|---|---|---|
| superDash v07 | 0,1 | Both opaque bounds terminate at exclusive x256; the leading forearm reaches the right border and the fist is cut. Raw v07 has complete fists. **Packing/placement failure**, not evidence to redraw an absent source hand. Worker reports 10/4px loss; this audit independently confirms clipping, not the extrapolated lost lengths. Hair/head remains comparable by eye; collar-to-sash and arms are visibly fuller than v05. Folded near thigh/shin, hidden hip, and toe-on sandals prevent ±6% chain certification. | Two-frame loop also changes rear elbow/hand position substantially. Clipping persists through both states; HOLD. |
| jumpSquat v06 | 0 | Complete 162px occupied cell; deep squat covers hip/knee centers. Head-axis ~42±5 vs idle ~43±5 and sole36±1 vs34±1 are worker estimates consistent with visible image, but intervals cannot pass. Shirt/sash volume and folded limbs require unresolved anatomical judgment; low-confidence head gate is not clearance. | One-frame hold; no internal temporal join. Entry from idle is intentionally a squat, not a reason to stand-height scale it. |
| beamFire v07 | 0,1,2 | Sandals now plausibly match combat/idle; reported 34,34,35±1 vs34±1 gives intervals .943–1.061, .943–1.061, .971–1.091: none is a strict ±6% pass. Reported torso44±7, arm51±10, leg84±14 have covered endpoints and do not certify. Head/sash/leg mass stays visually coherent across all three. | f1 changes rope tails and rear hand; f2→f0 has no gross size pop in ordered cells. Temporal playback not independently certified here. |
| dash v07 | 0,1 | Complete 160px cells; sandals visibly reduced from v05. Reported33–34±1 cannot strictly pass versus34±1. Lean shortens the projected trunk; sleeve/elbow and sash/hip ambiguity prevent certifying arm/leg lengths. | Two similar forward-lean frames; no gross silhouette-size pop. HOLD for anatomical uncertainty. |

Retained suspects were inspected individually, without treating the garment-area B values as failures:

| Retained strip | Every frame | Specific visibility/transition observations | Result |
|---|---|---|---|
| run v05 | 0–7 | f0/f4 side soles comparable; f1–3/f5–7 lift, rotate or overlap shoes. Forward torso pitch and sash-covered hip prevent reliable torso/leg comparison. The run changes leg phase across f3→4 and f7→0; no cropped limb found. | HOLD/inconclusive; no independently robust new anatomy failure. |
| airLight3 v07 | 0–5 | f0/1 rear/turning view; f2/3 extended kick; f4 back view hides chin; f5 returns to airborne guard. Kicking leg looks longer by projection but no visible hip center supports a ±6% verdict. Rotated soles are not measured as side-profile shoes. | HOLD/inconclusive. Ordered recovery is readable; no new approval. |
| specialUp v09 | 0–5 | f0 coil, f1 rise, f2/3 high kick, f4/5 raised arms. f4/5 guards overlap hair and explain why a head-color probe is unreliable. Hip and bent knee under garments; no inferred hidden lengths. | HOLD/inconclusive. Deliberate phase changes, not automatic scale failures. |
| hurtLow v03 | 0–2 | Arms cover abdomen in f0/1; f2 unfolds toward guard. Side sole31±1 vs34±1 has ratio .857–.970, crossing -6%: possible undersize, no robust interval failure or pass. Trunk bending prevents a straight-height comparison. | HOLD/inconclusive. |
| airRecover v01 | 0–2 | f0 tucked, f1 inverted, f2 settles; chin and joint chains hidden in the roll. The worker's 27±10 inverted head axis is too uncertain for a ratio verdict. | HOLD/inconclusive; never normalize curled height to idle. |

Old beamFire v05 f0–2 and dash v05 f0–1 have visibly excessive side soles. The worker's integer sole measurements (39–40 and44–45 versus34±1) yield conservative lower ratios ≥1.086 and ≥1.229 respectively, supporting redraw eligibility. Other old strip estimates remain uncertain. A blanket “everything was oversized” claim would be unsupported.

## Killua — HOLD

Independent exact bounds confirm idle v11 f0–3=144px, f4–7=146px; guard v09 f0/1=132px. These miss the explicit 156–162 and150–158 targets. Idle stance span is narrower and knees less bent, but the packed figure did not become taller. Approved combat/neutral comparisons also show the new guard's visibly small head/body. Whole-figure scaling cannot be certified as the sole remedy: it changes the already comparable sweater length, limb chains and shoes together.

| Selected strip | Every frame | Findings and segment limitations | Join/loop result |
|---|---|---|---|
| idle v11 | 0–7 | Height failure above is exact. Worker H36–38±2, T38±2, A35±4, L56–58±6, S23±2 are plausible projected readings, but no complete ±6% or shoe±4% interval pass. Shorts conceal hips/upper knees; sleeves conceal shoulder centers. | A/B f3→4 introduces a 2px top-bound step; f7→0 returns it. This is at the permitted breathing amplitude, not independently a failure. Head/hair drawing changes across the join still need user motion review. |
| guard v09 | 0,1 | Exact132px target failure, head34±2 versus combat about40–41. Even comparing to40±2 gives upper ratio36/38=.947: this does not clear the special98–102% head requirement. Crossed forearms conceal arm chains/collar; shoe23±2 cannot clear±4%. | Closely repeated pair; no obvious cell split, but too small in actual atlas. |
| superDash v08 | 0,1 | Head34±2, T29–30±2, arm39±4, folded leg44–45±6, shoe23±2 are projection-limited. Small appearance alone cannot distinguish short anatomy from packing/pose fit. Raised front arm foreshortens; hips and knee fold are hidden. Head normalization would alter all chains; no calibration-only pass. | f0→1 shifts body left and changes trailing legs. Source and packed pose order are coherent; no missing limb seen. |
| stagger v07 | 0–3 | f0–2 dangle arms, f3 changes to a fighting recovery with raised hand. Hair/head and shoes visibly exceed candidate idle. Worker shoe29–30±2 vs candidate idle23±2 gives conservative≥27/25=1.08, a definite mismatch within the candidate set (not automatically a failure against approved combat). Arm49–50±4 vs old39±4 is suggestive; clothing endpoint uncertainty must not be suppressed. | **Additional motion HOLD:** f2→3 restores guard; f3→0 abruptly drops arms and slumps again in a looping stagger. This is a source pose-sequence issue, not atlas scale calibration. |
| win v05 | 0–3 | Hands behind head hide wrists/elbows. T37±2, leg58±6, shoe24±2 versus old38±2/61±6/25±2 overlap too broadly to certify. Slimmer body than old win, recognizable outfit and silhouette. | Small repeated shifts, no gross f3→0 size discontinuity. HOLD for unresolved anatomy rather than an invented failure. |

Source/packing distinction: raw guard v09 is intact and visibly more upright. Its reported raw crown-to-chin≈195±6 over754px occupied height would imply≈155±5px at a40px head, overlapping the target. This is a useful calibration hypothesis, **not a source-body pass**; the forearms hide the collar, projected leg joints remain uncertain, and target uncertainty is too broad. The current atlas is unambiguously wrong for the requested height regardless of that hypothesis.

| Retained strip | Every frame | Named skips and loop/sequence assessment | Result |
|---|---|---|---|
| jumpUp v05 | 0,1 | Raised thigh overlaps shorts; bent shin and pitched shoe make full leg/sole projection incomparable. Collar/hem visible but twisted. Pair remains a coherent lifted-knee jump; no gross internal size pop. | HOLD/inconclusive. |
| jumpFall v05 | 0,1 | Forward pitch and sweater hem lift shorten projected trunk. Thigh origins under shorts; shoes rotate. Pair changes reaching hand/leg angle without a clear segment discontinuity. | HOLD/inconclusive. |
| airRecover v05 | 0,1,2 | f0 curl hides torso/arm, f1 inverted curl hides chin/hips, f2 unfolds. Do not use apparent head or body bounding-box shrink as an anatomical measurement. | HOLD/inconclusive. |
| airLight1 v06 | 0–4 | f0 guard, f1/2 punch, f3/4 recover. Extended arm is most visible at f1/2, but sleeve-covered shoulder and depth remain. Raised thigh/shorts obscure leg origin throughout. | HOLD/inconclusive; readable return sequence. |
| airLight2 v07 | 0–4 | f0 chamber, f1/2 kick, f3/4 recover. Side-kick shoe turns toe-on; shorts cover the hip. Torso leans during extension. No reliable±6% chain comparison. | HOLD/inconclusive; readable return sequence. |

Old stagger v05 and win v04 were also inspected beside both title cells: their longer sweater silhouettes versus new candidates are visible, supporting the worker's concern, but this audit does not infer exact hidden skeletons from that silhouette. No retained strip is promoted to a pass.

## Naruto — HOLD

Candidate stagger v06 f0–3, taunt v07 f0/1 and win v08 f0–3 all have visibly enlarged hair-inclusive heads against the approved combat and idle f0. The reported manual heads49±2,47±2 and46–47±2 versus38±2 give conservative lower ratios1.175,1.125 and1.10–1.125. These are robust packed-head failures even allowing the stated endpoint uncertainty. They are independent of the legacy automatic head probe's≈1.19–1.20 output. Crown-tip ambiguity larger than the stated2px would widen these intervals, but does not supply a full-body pass.

| Selected strip | Every frame | Torso/limb/shoe findings | Join/loop result |
|---|---|---|---|
| stagger v06 | 0–3 | Zipper/collar-to-hem remains visibly longer than combat/idle; reported48–49±2 vs38.6±2 has lower ratio≥46/40.6=1.133. Full arm55±12 and leg73–74±12 are too uncertain to certify. Shoe35±2 vs27.1±2 gives lower33/29.1=1.134, supporting an oversized packed sandal where the profile is comparable. | Almost repeated poses with minor face/hand shifts; no visible gross f3→0 scale step. Movement remains very slight, a user pose/motion decision. |
| taunt v07 | 0,1 | Reported torso45±2 gives lower43/40.6=1.059: just below1.06, so this specific interval is **inconclusive**, not a robust torso fail. Extended pointing arm and larger hair/head make overall overscale visible, but sleeve-covered joints prevent an exact arm verdict. Shoe32±2 versus27.1±2 is also inconclusive. | Closely repeated pointing pair; no cell clipping seen. |
| win v08 | 0–3 | Reported torso44–45±2, arm56–57±12, leg78–79±12 and shoes27–28±2 remain uncertain against idle. Head failure holds every frame. Raised arm f1/2 hides/foreshortens its shoulder chain. | f1/2 overhead pump, f3 opposite-side bent-hand pose, f0 chest-level pose: readable celebration, but f3→0 hand switch is a motion-review point. No claimed numeric loop certification. |

Old stagger v05 f0–3 and taunt v06 f0/1 have visible longer zipper-marker axes than idle. Worker old torso49–49.2±2 and48.5±2 versus38.6±2 yield robust lower ratios≥1.158 and1.145. Old win v07 f0=47±2 gives1.108; f1–3 need not individually fail for that strip to require work. This confirms the original redraw rationale without deriving anatomy from noisy B.

Retained jumpUp v06 f0/1 and superDash v03 f0/1 were inspected. JumpUp's lifted thigh, angled torso and turned soles prevent a comparable leg/sole measurement; the silhouette's greater height is expected from the pose. SuperDash's curled legs overlap under orange trousers; soles rotate toward/away from camera and the trunk pitches. Both pairs are coherent internally with no cropped limb seen. **HOLD/inconclusive; no independent robust new failure and no numeric pass.**

The raw stagger v06 visibly shortens trunk relative to hair/head compared with the old drawing, but the packed output retains216px occupied height in all four frames. This is consistent with a packing calibration contribution to the enlarged head; it does not prove that every raw limb/torso ratio is correct. Claude must calibrate and present a new exact atlas before any final recheck. No global resize is prescribed by this audit.

## Handoff

1. Keep every selected candidate **HOLD / needs review**. Do not replace approved fixed-name art or production atlases based on this report.
2. Resolve Sasuke superDash placement/clipping from the intact source before spending another art call. Recheck both affected final quantized frames and contact reach.
3. Killua requires actual native-height targets, head/footwear consistency, and stagger loop correction or explicit pose feedback. Existing source/packing uncertainty does not authorize inventing hidden-joint measurements or claiming calibration alone solves it.
4. Naruto needs calibration plus full anatomy recheck on the resulting quantized pixels. Remaining calls are a coordinator/worker decision under the recorded budgets, not automatically consumed by this audit.
5. Retained suspects remain inconclusive; do not redraw solely for garment-area or head-color noise. Better visible landmarks or pose-specific anatomical review is needed to resolve them.

No generator, manifest, bodyHeight, frame offset, hitbox, approval state or production output was changed. No build was needed for these derived read-only audit artifacts. Browser playback/contact QA belongs to the coordinator/Claude; this report's loop assessment is from ordered actual atlas cells and does not claim independent browser playback. User approval remains required even after a future audit pass.
