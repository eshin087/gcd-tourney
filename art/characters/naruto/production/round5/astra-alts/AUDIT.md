# Round 5 Naruto alternate atlas audit

Date: 2026-10-15. Auditor: GPT-6 Astra, medium. Source branch `art/naruto-alts`, commit `357951e`. Scope: ten selected strips, **59 actual quantized atlas frames**, their adjacent transitions and last-to-first preview repeats, paired packed bases, approved title-style neutral/combat cells and packed idle. No generation, packing, calibration changes, approval, merge or deployment.

**Binary verdict: HOLD on all ten for full-contract clearance.** This does **not** mean ten demonstrated anatomy defects. Visual inspection and per-frame visible endpoint annotation are complete; an every-segment ±6% intrinsic-length certificate is not established. Nine have no newly demonstrated contact failure or global scale pop. `light2Alt v03` additionally has a confirmed drawn-contact discrepancy. Per-strip distinction is machine-readable in [verdicts.json](verdicts.json); all source candidates remain `needs review`.

## Exact evidence

- sheet.png SHA-256: `68dc54555c32184ea69b02b8bc3ea2df2c7e32ebf2f86a1184aa3055cf61ba3e`
- anims.json SHA-256: `1e4669fab67b71a3400d03cdc351b997560de183f861ccbda14dc98ea921a047`
- [Provenance](provenance.json) records selected raw version hashes and held airHeavyAlt files.
- [Atlas checks](atlas-evidence.json) records every atlas index, exact alpha bounds, per-cell RGBA hash and box comparisons. All **59/59** base hit/hurt box objects are equal, and all ten durations and phase arrays equal their bases. All have `loop: false`; last-to-first here means a review-player repeat, not a new gameplay loop.
- Every frame is visible at unchanged 1:1 density in `<animation>.png`, its packed base in `<base>-base.png`, and first/last comparisons in `<animation>-endpoints.png`. Grid PNGs use exact 2x nearest-neighbor enlargement; subtract the 20px native border to read coordinates. References are in [references.png](references.png).
- Every frame is wholly inside the 256px cell. Minimum right margin is 4px (exclusive bound 252). Alpha bounds only establish containment, not an invisible source crop or anatomical fidelity.

## Measurement method and limits

Fresh independent native-cell annotations for **all 59 frames** are in [PER-FRAME-MEASUREMENTS.md](PER-FRAME-MEASUREMENTS.md) and [per-frame endpoint coordinates, uncertainties and ratios](per-frame-measurements.json). The initial diagnostic reference samples remain in [MEASUREMENTS.md](MEASUREMENTS.md) and [ratio intervals](ratio-intervals.json). They replace old audit numbers for this atlas; the prior audit used different pixels and some different garment/joint landmarks. They are not scaled copies of the historical table.

H-hair is the visible hair-crown-to-chin envelope, not anatomical head height. H-skull estimates the skull under hair and is deliberately low confidence. T is collar to the black jacket hem, excluding orange trouser/crotch folds. Arms and legs use the selected visible shoulder/elbow/wrist and hip/knee/ankle chain. S measures a projected heel-to-toe segment only when distinguishable. All coordinates are frame-local.

Uncertainty is ±4px for either H or S, ±6px for T and each arm segment, ±7px for each leg segment. These are conservative manual landmark uncertainties, **before** unknown depth/foreshortening. A 24px skull height has a ±6% band only 1.44px wide; these measurements cannot certify that band. An interval crossing the band is unresolved, not a numeric fail or pass. Neutral and combat projections differ by pose: do not resize a crouch to the standing neutral. Shoulder width is excluded: both deltoid endpoints at comparable depth are not exposed. Far limbs, folded knees, turned sandals and forearms crossing the chest are likewise excluded from intrinsic-length certification, although inspected for continuity, count, build and clothing volume.

**Supplemental annotation complete:** 59/59 frame rows contain H-hair, estimated H-skull, T, selected visible upper arm/forearm and shin endpoints; 58/59 contain a selected thigh and 43/59 a measurable shoe. The one missing thigh is light3Alt f4: its hip/upper thigh is hidden by the crossed chamber. The 16 N/A shoes are toe-on/dangling silhouettes with hidden heels, identified individually. Selected sides and other-side occlusion/depth reasons are recorded per frame, including additional visible far forearms on light4Alt f2-f4. Ten colored `*-landmarks.png` sheets show all selected segments on the actual pixels. No frame remains omitted. These projected endpoint measurements still cannot prove intrinsic lengths within ±6% when their uncertainty is wider than the allowed band; the HOLDs now reflect that precision/projection limit, not unfinished annotation. A head-gate success does not fill the hidden joints.

Reference sample H-hair/H-skull/T: neutral **36.1/22.1/49.1px**; combat **36.1/22.1/38.5px**; packed idle f0 **38.0/23.0/36.3px**. Treat decimal Euclidean outputs as calculation results from coarse integer landmarks, not subpixel measurement precision. The approved neutral/combat cells remain the visual contract; the working idle is a comparison, not permission to shorten upright trunks.

## Per-strip findings

| Strip | Version | Visual sequence, transition and wrap findings | Full-contract result |
|---|---:|---|---|
| airLight1Alt | 01 | All f0-f4 intact; f1/f2 extend then f3 retracts; f4→f0 nearly same guard. Straight punch is very close to the base technique. Turned footwear and folded/far limbs remain unmeasured. No confirmed global size pop. | HOLD: anatomy precision / technique review |
| airLight2Alt | 01 | f0 chamber→f1/f2 kick→f3 tuck→f4 chamber; f4→f0 small pose change. No split limbs or obvious scale discontinuity. Supporting knee and shoulder depth are ambiguous; resembles base. | HOLD: anatomy precision / technique review |
| airLight3Alt | 01 | f0 chamber→f1 open torso→f2/f3 crescent kick→f4 retract→f5 guard. The crescent is an effect, excluded from body size. Start/recovery are more compressed than base and the base's back-facing spin is absent. f5→f0 is a pose change, not demonstrated scale change. | HOLD: anatomy precision / endpoint and technique review |
| heavyAlt | 02 | f0/f1 preload→f2 rise→f3/f4 high kick→f5 retract→f6 land→f7 guard. No confirmed A/B head-size jump in these final pixels. The tipped-back head and hair change projection; a failed hair probe alone cannot prove a size jump. f7→f0 bends into startup. Striking knee is concealed under straight orange cloth; exact thigh/shin split unresolved. | HOLD: anatomy precision |
| hurtHighAlt | 01 | f0/f1 lean back/open arms; f2 guarded recoil. Endpoints broadly match base. f2→f0 repeats the recoil, as expected for a preview of a non-loop reaction. Head roll and sandal projection prevent a strict numeric certificate. | HOLD: anatomy precision |
| hurtLowAlt | 01 | Fold→rear arm thrown out→folded recovery, all three figures intact. f2→f0 modest head/torso angle change. Hands overlap the abdomen and knees are bent. No proven global scale pop. | HOLD: anatomy precision |
| light1Alt | 01 | f0/f1 load→f2/f3 extension→f4 cross-body withdrawal→f5/f6 guard. Active art still reads as straight punch rather than the requested compact hook. Wider startup/end stance than base; f6→f0 is close. Old auto-box failures are superseded by exact base-box inheritance. | HOLD: anatomy precision / hook fidelity |
| light2Alt | 03 | f0 guard→f1 knee lift→f2/f3 kick→f4 chamber→f5/f6 guard. Base rear-fist load is absent. Foot is intact after offset calibration but remains too low/far for base contact. f6→f0 similar guard with stance variation. | HOLD: confirmed drawn contact, plus anatomy precision |
| light3Alt | 02 | f0 grounded guard differs from base chamber; f1 rises, f2/f3 mid-height kick is intact. f3→f4 switches to a crossed chamber/support configuration: a conspicuous pose reset, not proven size change. f5/f6 recover to wide guard, f6→f0 near pose. No old low-sweep contact defect remains visible. | HOLD: anatomy precision / transition and endpoint review |
| light4Alt | 01 | f0 guard→f1 palms→f2/f3 shove→f4 low follow-through→f5 rear step→f6/f7 guard. Distinct double-palm technique. No confirmed part-scale pop; f7→f0 slight chest/head-height shift and recovery differs from base. Turned f5 sandal is not a length measurement. | HOLD: anatomy precision / endpoint review |

Build and clothing volume: all ten retain the black/orange jacket, trouser volume, bandaged thigh, sandals and Naruto's overall slim build. No extra/missing limbs or newly demonstrated shoulder inflation were found in the 59 frames. This is a qualitative observation, not a hidden all-segment numerical pass. The palm/kick/guard changes must remain visible to the user; technical review never approves the drawing.

## light2Alt contact: confirmed independently

See [light2-contact.png](light2-contact.png). Green = exact inherited base hit rectangles; red = manually identified alt sandal extent (±3px landmark uncertainty).

| Frame | Exact base/alt hit rectangle x,y,w,h | Estimated drawn alt foot extent x0,y0,x1,y1 | Foot-center minus hit-center |
|---|---|---|---|
| f2 | [189,84,34,26] | [220,115,251,133] | about (+29.5,+27)px |
| f3 | [190,86,24,21] | [211,116,235,132] | about (+21,+27.5)px |

The f2 toe at x251 is about **31px past the visible base fist near x220** (±3px), consistent with Claude's approximate 32px report. Relative to the base hit rectangle's right edge x223 it is 28px past. The f3 kick has already retracted horizontally, so one shared 32px figure should not be claimed for both frames. Both sandals sit about **27-28px below** the inherited hit center. This exceeds the 24px visual-contact height target nominally; the ±3px reading reaches its boundary, but the overlay independently shows the hit rectangle visibly above the foot, not covering it. Gameplay contact remains the base's exactly; the concern is spark/drawing alignment. No hitbox change is proposed here.

## airHeavyAlt fallback

Verified no `airHeavyAlt` key in final anims.json and no root `raw/airHeavyAlt*` selected source. Versions v01/v02 PNG+sidecars and v03 PNG exist under `raw/_qa_hold/`, with hashes in provenance. Thus no held alt is packed. The existing runtime missing-alt fallback is Claude's documented contract; this audit verified the metadata/input preconditions, not a new browser gameplay execution. No new anatomy verdict is issued for held airHeavyAlt.

## Handoff

The confirmed contact residual and art-direction differences are suitable for the unified phone review page. Anatomy precision HOLDs must be displayed as **measurement unresolved**, not as ten proven malformed drawings. User acceptance is separate from numeric validation. Claude owns any calibration/contact reconciliation; no further image calls or corrective edits were made. Initial local launcher attempts failed (missing worktree `.codex/vite.mjs`, then restricted realpath under ordinary `npm run build`; historical output in build.txt). The coordinator subsequently ran the correct absolute adapter in this worktree: `node --preserve-symlinks --preserve-symlinks-main E:/Vibe Coding/Claude Code/gcdTourney/.codex/vite.mjs build`, reported exit 0 / 85 modules. No source/tool workaround was made. This build pass does not certify anatomy or gameplay.
