# Naruto round-5 final quantized-atlas audit

2026-10-15 · GPT-6 Astra, medium reasoning · **HOLD on stagger v08 and taunt v10**.

Audited branch `art/naruto-title-r3`, commit `5dee03f74b5113eae1951a0393c4e66865132956`. Scope is every stagger08 frame (0–3), taunt10 frame (0–1), each consecutive transition and each wrap. Win09 is outside this audit. No generation, packing, calibration, approval, integration or deployment occurred.

## Result

**Stagger08: torso correction confirmed centrally; complete anatomy remains HOLD.** Upper-collar to black jacket hem is 51±3 px against neutral 50.4±3: ratio1.012. Hair-inclusive head40±2 versus39±2 and lateral sandal30–31±2 versus neutral28±2 / idle29±2 are centrally close, although the strict ±6% interval test is not secured. The near-upright leg silhouette is visibly compressed: hem-to-ankle vertical distance about57 px versus neutral84 px. This is a garment/posture diagnostic, not a bone-length ratio. Estimated right thigh/shin25.7–26.0/19.4–19.6±7 each versus neutral42.6/29.0±7 each remain concerning; concealed hip and knee joints prevent calling those exact anatomical deficits. Hanging forearms also screen short (19–21±6 versus neutral28–32±6). Do not translate a corrected torso or passing head probe into a whole-character pass.

**Taunt10: torso central residual, but uncertainty HOLD rather than a proven 15–20% deficit.** Matched upper-collar to black-hem endpoints give46.1–46.2±3 versus neutral50.4±3, ratio0.914–0.917 (central8–9% short). The possible ratio interval about0.81–1.04 overlaps the ±6% band. A lower-collar-to-orange-hem measurement yields40–43, but comparing that to the neutral's upper-collar-to-black-hem50.4 changes the landmark definition. Claude's recorded0.80–0.85 estimate is retained as prior evidence, **not independently confirmed as an exact deficit** by this audit. Head40±2 and sandal28±2 are compatible centrally. The raised pointing arm, bent hip-hand arm and splayed legs have substantial projection/occlusion; no strict limb pass is claimed.

Neither strip has an isolated scale pop, missing limb, or clipped sandal in the inspected atlas. Stagger's dazed sway is very slight; head/expression variations are small. Taunt changes mouth/callout while retaining the point. Stagger0→1→2→3→0 and taunt0→1→0 were inspected in order; the residuals persist across the strip rather than appearing at a seam. These are static frame/transition inspections, not gameplay or browser playback verification.

## Method and uncertainty

All comparison cells retain native256px density. Native crops come directly from the SHA-256-bound atlas via anims.json frame indices; reference cells are the exact approved neutral/combat PNGs. `*-grid.png` gives4x nearest-neighbor coordinate grids; `*-landmarks.png` overlays H yellow, T cyan, arms pink, legs green and S white. `audit.json` contains every coordinate, hash, frame index, duration, ratio and exclusion. `verdicts.json` is the gallery handoff.

H means hair crown to chin (skull crown hidden), T upper collar to bottom of black jacket hem, S lateral heel-to-toe distance. H/S uncertainty±2px; T±3; each arm segment±6; each leg segment±7, including concealed joint placement. These are conservative manual estimate ranges, not statistical confidence intervals. A central ratio inside the band is not a numeric pass when the range extends outside it. Different poses may legitimately foreshorten projected lengths: short projection alone does not prove a short bone.

Neutral is the upright torso/leg comparator. Combat and approved packed idle07f0 are independently viewed contextual comparisons, not substitutes for upright anatomy. Frontal shoulder width is excluded in every image because all views are three-quarter; measuring garment width as frontal skeleton width would invent certainty. Far-side/perspective-facing sandal length and skeletal crown are likewise excluded. Cloth-covered limb points are disclosed as estimates even where both segment ends are drawn; raised/bent arm and crouched/splayed leg projections are excluded from strict skeletal certification.

## Native measurements

Values below are central projected lengths in px. Arms and legs show screen-right / screen-left; coordinate details and uncertainties are in `audit.json`.

| Cell | H | T | upper arm R/L | forearm R/L | thigh R/L | shin R/L | S |
|---|---:|---:|---:|---:|---:|---:|---:|
| neutral | 39.0 | 50.4 | 25.7/29.1 | 32.2/27.7 | 42.6/42.1 | 29.0/31.8 | 28.0 |
| combat | 38.0 | 39.3 | 21.9/24.1 | 17.0/25.6 | 41.3/35.5 | 25.3/28.3 | 29.0 |
| idle0 | 40.0 | 37.7 | 25.1/25.5 | 19.8/27.3 | 40.0/34.7 | 23.5/26.4 | 29.0 |
| stagger0 | 40.0 | 51.0 | 26.9/24.4 | 19.2/20.9 | 26.0/26.0 | 19.4/22.8 | 31.0 |
| stagger1 | 40.0 | 51.0 | 26.9/24.4 | 19.4/20.6 | 25.7/26.4 | 19.6/22.4 | 30.0 |
| stagger2 | 40.0 | 51.0 | 26.7/24.4 | 19.4/20.9 | 26.0/26.0 | 19.4/22.8 | 30.0 |
| stagger3 | 40.0 | 51.0 | 26.9/24.4 | 19.4/20.6 | 25.7/26.4 | 19.6/22.4 | 30.0 |
| taunt0 | 40.0 | 46.2 | 18.0/26.6 | 26.9/17.0 | 27.2/27.3 | 20.9/21.6 | 28.0 |
| taunt1 | 40.0 | 46.1 | 18.0/26.6 | 26.9/17.0 | 27.2/27.3 | 20.9/21.6 | 28.0 |

The earlier audit's neutral knee was placed at y174 and wrist at y135. This inspection places the cloth knee abouty181±7 and wrist/cuff boundaryy143±6. Those differences lie near the historical uncertainties and explain why exact inherited limb ratios should not be treated as ground truth. The new estimates are independently marked in the reference image; no previous number was silently reused as a pass.

## Evidence and identity

- [Stagger comparison at one density](stagger-panel.png)
- [Taunt comparison at one density](taunt-panel.png)
- [Coordinates, exclusions and exact source hashes](audit.json)
- [Gallery verdicts](verdicts.json)

The approved idle fixed-name PNG is byte-identical to raw idle_v07.png (see hashes). Candidate source sidecars specify bodyHeight179 for stagger08 and170 for taunt10; no sidecar field was edited. The full hashes below bind this verdict to this atlas only.

- `public/characters/naruto/sheet.png`: `715a177322a6347bb86365430035e9610d0210122e2582da94fcee9ac67dd241`
- `public/characters/naruto/anims.json`: `de68f9d5dfe3cf596f9b7d09a65316d9d3043b323978cde39f7bac7b714cfcf2`
- `public/art-review/title-style-pilot/naruto-neutral_v01.png`: `acfd7240f9ee7fbe71c1b6c50ea8a269ceedeb05de44b929850ca8de06a0610f`
- `public/art-review/title-style-pilot/naruto-combat_v01.png`: `cdc6ff9838bbae102301b738ef7596be3b2cc8ecb6f24c98d27c02a0bb479751`
- `art/characters/naruto/reference/idle_approved.png`: `eeb62e3d8981c168ccc48ffeb847ef8308e267c84f9b3b5e2b29a690d1a15db3`
- `art/characters/naruto/raw/idle_v07.png`: `eeb62e3d8981c168ccc48ffeb847ef8308e267c84f9b3b5e2b29a690d1a15db3`
- `art/characters/naruto/raw/stagger_v08.png`: `be43bf84a100d4b4e0e03eb794b48d941291f426ada8630f291f4b5dd6f11ac7`
- `art/characters/naruto/raw/stagger_v08.json`: `35d4afca2f495558c8fdbec2a12bcc3ed11e9f12a75435c4770f7215437d0403`
- `art/characters/naruto/raw/taunt_v10.png`: `a7699b300b2600979e3fe11bb78ddfede0fe7f28f918433d6210e19f9180eb7f`
- `art/characters/naruto/raw/taunt_v10.json`: `f87cb5c92cc5662570150580ab089277bf374c83dc71086bd041c1aaad6f42a1`


## Handoff

User review remains required. Keep both candidate REVIEW rows `needs review` and preserve all existing approved versions. No calls remain in the authorized round. If the user accepts these visual residuals, record that decision without changing this technical evidence into a ±6% pass. Claude owns any later calibration/contact checks. This evidence-only change does not require a new pack; the coordinator owns the requested combined-page build and browser verification.
