# Naruto round-4 calibration and repair analysis

Status: evidence-only handoff for Claude's scale calibration. No source art, packed production output, normalization settings, bodyHeight, offsets, hitboxes, or calibration code were changed. The 48-color candidate atlas remains diagnostic/unapproved. Measurements below are from `SEGMENTS.md` / `segments.json`, which record the actual quantized 256 px atlas and native-pixel marker coordinates.

## Sources and scope

- Approved scale references: `reference/idle_approved.png` (idle v07) and `public/art-review/title-style-pilot/naruto-neutral_v01.png` / `naruto-combat_v01.png`; production contract at `art/scale/title-style-pilot/PRODUCTION_CONTRACT.md`.
- Round-4 baseline/candidate atlas measurements: `art/characters/naruto/production/round4/SEGMENTS.md`, `segments.json`, and the atlas hashes recorded there. Candidate selections: stagger v06, taunt v07, win v08; retained jumpUp v06 and superDash v03.
- Head values in this audit mean visible hair-crown-to-chin length, not hidden skull height. Torso is collar-to-hem marker distance. Arms/legs carry ±12 px chain uncertainty; torso/head ±2 px; profile shoe ±2 px. Obscured/foreshortened parts are skipped as documented in `segments.json`.

## What a common per-strip scale can and cannot solve

Use the current idle as ratio 1.00 and the stated segment gate [0.94, 1.06]. For an observed candidate-to-idle ratio `r`, a uniform multiplier `k` can bring that segment into range only when `0.94/r ≤ k ≤ 1.06/r`. All interval intersections below use the listed nominal point estimates. They are calibration diagnostics only, not robust contradiction proofs or passes; ±12 px chain uncertainty is wider than the 6% gate.

| Candidate | Head hair proxy | Torso | Arm chain | Leg chain | Shoe | Nominal common `k` across all listed visible measures |
|---|---:|---:|---:|---:|---:|---|
| stagger v06 | 49/38 = 1.289 | 48–49/38.6 = 1.244–1.269 | 55/46 = 1.196 | 73–74/68 = 1.074–1.088 | 35/27.1 = 1.292 | none at nominal points: leg requires `k≥0.875`; shoe requires `k≤0.820` |
| taunt v07 | 47/38 = 1.237 | 45/38.6 = 1.166 | 54–55/46 = 1.174–1.196 | 78/68 = 1.147 | 32/27.1 = 1.181 | about 0.819–0.857; nominally feasible, not certifiable at current uncertainty |
| win v08 | 46–47/38 = 1.211–1.237 | 44–45/38.6 = 1.140–1.166 | 56–57/46 = 1.217–1.239 | 78–79/68 = 1.147–1.162 | 27–28/27.1 = 0.996–1.033 | none: arms require `k≤0.855`; the shoe requires `k≥0.910` even at its largest frame ratio, so empty |

These nominal empty intersections are not enough to claim the drawings need separate segment edits: limb estimates can move substantially within their stated uncertainty. The one robust current-packing fact is stagger torso: its minimum observed marker length 48−2 against idle maximum 38.6+2 gives ratio 46/40.6 = 1.133, above 1.06. A single factor around 0.79–0.85 could bring its nominal torso into range; the present data do not robustly prove that the limbs then fail. That question requires Claude to calibrate against Naruto's two approved title cells (neutral and combat) and directly remeasure the same visible landmarks.

The strongest direct evidence is the torso marker comparison at the current packing. Against idle's 38.6±2 px, stagger's minimum candidate torso is 48±2 (conservative ratio floor 46/40.6 = 1.133), which is a robust mismatch before any new calibration. Taunt is 45±2 (floor 43/40.6 = 1.059, effectively on the threshold within rounding); win's minimum is 44±2 (floor 42/40.6 = 1.034). For taunt and win, these candidate torso measurements do not robustly prove an out-of-gate defect. Earlier baseline failures were stronger: stagger baseline torso conservative ratio 47.2/40.6 = 1.163, taunt 46.5/40.6 = 1.145, win f0 45/40.6 = 1.108.

A scalar calibration changes every visible length together and cannot change internal proportions. Nominal point estimates give stagger an empty all-segment factor interval and win a conflict between arm and shoe; however, those conflicts are not robust given the ±12 px chain uncertainty. The robust finding here is limited to stagger's currently oversized torso before calibration. If calibration changes only runtime rendering, it leaves packed-pixel measurements unchanged and cannot itself satisfy the atlas segment gate. Claude should state whether calibration changes source/atlas normalization or only runtime scale, then remeasure matching visible landmarks in the actual quantized result.

The exact user-approved Naruto neutral/combat cells still govern anatomy. The round-4 segment table does not contain direct numerical measurements of those two approved Naruto reference cells beyond idle v07; Claude should measure matching visible segments from each at the same density before finalizing any calibration. Do not infer a new universal body-height number from the noisy garment-area (`B`) proxy or the old pre-contract pixel targets.

## Retained strips and cumulative attempt budgets

- **stagger v06:** one new call in this authorized round plus three historical calls (four total); two of the round's three calls remain unused. The selected candidate's torso/head scale still needs a resolved path, but the nominal torso/limb estimates alone do not prove a residual defect after calibration. Any further call remains inside the already authorized 2-call remainder; no new budget is implied.
- **taunt v07:** same 1 + 3 historical (4 total), 2 round calls unused. Nominally a common multiplier exists, but ±12 px limb-chain uncertainty and ±2 px torso/head uncertainty do not support a 6% pass. Claude's cross-reference calibration should decide whether the candidate can be corrected consistently before another image is used.
- **win v08:** same 1 + 3 historical (4 total), 2 round calls unused. Nominal internal ratios differ; direct remeasurement against neutral/combat and the calibration are needed before calling a robust failure. Its one new call was drawn before the exact marker audit; attempts cannot be reset by a revised analysis.
- **jumpUp v06:** zero round-4 calls. No robust visible-segment failure was established; raised forearm/rear leg are foreshortened and the shoe has no comparable profile. The “measure strips that fail” authorization has not been triggered, so retain it and do not redraw based only on its approximate head/height or body-area proxy.
- **superDash v03:** zero round-4 calls. Folded legs and sole-on sandals prevent reliable length comparison; no robust physical-length defect was established. Retain it; the advisory garment-area value (~0.86) alone does not authorize redraw.

No candidate is approved or certified by this analysis. Claude owns calibration and game/contact review; after that response, redraw only a segment failure that remains after the reference-based calibration, using the remaining named-image budget. Each new attempt must be recorded cumulatively and then remeasured in the actual quantized atlas.




