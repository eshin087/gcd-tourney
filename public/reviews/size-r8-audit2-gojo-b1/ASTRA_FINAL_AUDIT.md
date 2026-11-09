# ART-SIZE-R8 B1 — Gojo light1 v08 final Astra audit

## Result

**Within the user's size-audit tolerance; integration follow-up remains.** The drawing is user-approved, and the Astra measurements do not create a head or footwear hold under the user's rule. The head median `.943` is 5.7% below idle, within the 8% median line for this audit. The front-shoe proxy `1.11` is within Gojo's live-strip range: 25 of 54 strips measure above `1.08`. The strip is fully contained and the earlier severe short-body problem is substantially improved. Pose occlusion limits segment-by-segment precision, but that uncertainty is not a hold under the current decision.

Correction from Claude relay `audit2 #4`: the user's “keep reach” means preserve the jab's live-game reach from v05, whose far edge is x212 at f2 and x204 at f3. It does not accept v08's shorter visible palm reach as the new gameplay reach. Claude will widen the f2/f3 hitboxes during integration. This worktree does not change those boxes. The user's decision via relay `audit2 #3` was “Approve, keep reach.”

## Audited artifact and method

- Character/animation: Gojo `light1` v08, all seven frames and the full return to idle.
- Evidence: actual 48-color quantized production atlas, compared with the packed approved idle and the approved title-style Gojo neutral/combat cells at the same pixel density.
- Atlas SHA-256: `93B73C1C7236FD23792EFE263D97D02431CA76A6C084B8C78D50019A819E9E67`.
- Packed cells: 30–36. Phases `[2,2,3]`; durations `[30,30,40,50,50,50,30]`; no loop.
- Scale report: head ratios by frame `.914, .914, .943, .963, .955, .914, .943`; median `.943`. These are hair-mask probe ratios, not skull-length measurements, and the mask has pose-dependent uncertainty.
- Body-area proxy B by frame `.879, .904, .922, .911, .944, .946, .952`; median `.922`. This advisory area measurement does not certify individual torso or limb lengths.

## Every-frame observations

| Frame / cell | Head probe | Visual anatomy and pose | Finding |
|---|---:|---|---|
| f0 / 30 | .914 | Coherent chest-level anticipation; near hand remains pocketed. Head probe is below idle. | Within the user's median-based audit tolerance; no per-frame reject threshold was set. |
| f1 / 31 | .914 | Shoulder, elbow and wrist remain connected as the palm launches screen-right. Head probe is below idle. | Arm chain visually connected; median head result remains within the user's threshold. |
| f2 / 32 | .943 | Extended arm and leg chains remain connected; directional smear resolves around the forward palm. | Anatomy coherent; preserve v05 live-game hitbox reach at integration. |
| f3 / 33 | .963 | Smear resolves into an intact palm and arm. | Best head match in the strip; anatomy coherent. |
| f4 / 34 | .955 | Plausible elbow bend and palm withdrawal. | Anatomy coherent. |
| f5 / 35 | .914 | Hand lowers toward the pocket; front shoe remains visibly longer than idle. Head probe is below idle. | Shoe proxy is within Gojo's observed range; no hold. |
| f6 / 36 | .943 | Both hands return to pockets; the transition to idle changes head size, stance and hand placement rather than matching the idle endpoint. | Recovery is readable; loop is not applicable, but return-to-idle should be checked in runtime. |

Across the strip, Gojo retains the lean build, high collar, blindfold, right-facing view and two intact leg chains. Shoulder rotation and pocketed arms explain some garment-area reduction. Collar-to-hem is visually about `75–80 ±5 px` versus idle about `80 ±4 px`; the leg chains appear modestly shorter, not the earlier approximately 12% short, but clothing obscures landmarks too much to certify them at ±6%. No shoulder inflation or recurrence of the original roughly 20% torso shortening is visible.

## Head and footwear measurements

The head probe is below idle in all seven frames and falls to `.914` at f0, f1 and f5. The hair-mask probe can move with silhouette changes, so it does not isolate skull length; manual head landmarks remain uncertain. The median is `.943` (5.7% below idle), which is inside the user's 8% median threshold; no hold is assigned for those frame values.

The front-shoe raster spans `38, 39, 39, 40, 40, 40, 40 px` across f0–f6 in the y230–240 band, versus `36 px` on idle (`+5.6–11.1%`). The rear shoe is about `21–22 px` versus idle `21 px`. Pixel bounds are exact; mapping them to anatomical shoe length carries roughly `±1–2 px` uncertainty because of pose and perspective. The front-foot proxy is `1.079–1.125`. This is within the observed Gojo range: 25 of his 54 live strips probe above `1.08`; it is not a footwear hold.

## Containment, contact and live-game reach

- Occupied bounds are x72–196, y19–240. There is no clipping or cross-cell contamination; every frame reaches y240. Crown variation is 3 px and the rear foot shifts left by 3 px across the sequence.
- The packed v08 f2 palm occupies x175–196, y55–73; f3 occupies x179–191, y55–73. The live-game v05 far edge is x212 at f2 and x204 at f3. The user's “keep reach” decision explicitly preserves that live-game range; the shorter v08 visible palm is not accepted as a change in gameplay reach.
- The worktree's v08 hitbox overrides are f2 `[174,54,24,21]` and f3 `[178,54,15,21]`. Claude will widen them during integration to preserve the live-game reach. Runtime contact, grounding and return-to-idle checks remain with Claude.

## Disposition

Keep v08 marked **approved by the user** in REVIEW, manifest and TRACKER. Its head median and front-shoe proxy are within the user's audit tolerances. Record Claude's integration task to preserve live-game reach by widening the f2/f3 hitboxes; do not alter hitboxes on this branch. No further drawing is requested for B1. B2–B11 and R4 are outside this audit.
