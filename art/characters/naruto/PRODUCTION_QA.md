# Naruto neutral production checkpoint

2026-10-11. Draft, not merge-ready. User approved only height_neutral v01; no new animation is approved. All 42 animation sources were attempted. The latest ten technical holds are stored under raw/_rejected solely to exclude them from packing; this is not a user rejection. Original three-attempt caps remain binding.

## Scale and anatomy

Shared K=233/242 gives standing skull-to-sole 192.561983 px. Neutral crown153/sole1100 gives source skeleton947; inferred crown-to-chin124 ±16 gives anatomical target25.214030 px. No individual height cap or nominal seven-head substitution. Candidate idle v05 is provisional, with fixed approved idle preserved. See [independent limb audit](reference/neutral-body-audit.md). Torso and shin proportions broadly match neutral within manual landmark uncertainty; this is not an exact skeleton reconstruction.

## Validation

Read-only main packer at 3f136d8e185016254dd217ff345b464b4b6c150c: node ../../tools/pack-sprites.mjs naruto --root art --out public --quantize 48 exited0, 42 animations / 175 frames, 48 colors, no clipped frames. Final atlas contains32 new candidates and10 older approved fallbacks. New results:21 ok,1 idle reference,8 unmeasured,2 transformed four-tail exemptions. Unmeasured is NOT a scale pass. Older fallback gate drift/pop remains visible. Two active frames use fallback hitboxes; Claude must validate reach/contact with the smaller shared production scale.

Build passed using the local Vite adapter (79 modules). Local port5212 game logged [sprites] using custom sheet for naruto (42 animations), no browser console errors. Gallery/index.html inspected in browser; all32 packed contact strips inspected visually. This is a rendering smoke check, not a gameplay soak or approval.

Heads audit is current. Cast lineup shows Naruto candidate alongside legacy other-fighter atlases, so it is context only, not certification of the final shared cast. Root's independent candidate-idle cast comparison supports the lean body direction qualitatively.

## Holds and uncertainty

Do not approve the full set as technically finished. Eight unmeasured rotated/crouched/lying poses retain independent anatomical sidecars and visible contact sheets; these need explicit manual scale review. Four-tail beamCharge/beamFire use their transformed cranial dome, excluding tails and ears, and narrowly version-scoped absence-of-blond-hair exemptions. No general thresholds were lowered.

backDash v03 corrects push-off, opened balancing arms, backward lean and distinct landing using original attempt2 of3; full pack passes. The forward-flowing ties pass beside the face, a remaining stylization review point. Finger seals, hand anatomy, contact reach and holster-leg continuity remain visual review points. light4 and specialForward failed after measured A/B restitches; a favorable average never replaces all-frame checks. airHeavy and special now show consistent final A/B scale after independent anatomical calibration.

The stitch tool's packed-palette and refinement ROI can measure clothing after clipping the head. Temporary sampled packed-idle palette is restored immediately; independently measured --factor values are documented in sidecars where needed. No tools changes. Prior source versions are immutable; restitches do not reset generator attempt caps.

## All-animation status

| Animation | Latest | Packed | Gate | Recommendation |
|---|---|---|---|---|
| airHeavy | v04 | v04 | ok | Candidate visual review |
| airLight1 | v04 | v04 | ok | Candidate visual review |
| airLight2 | v04 | v03 | old fallback: drift | Hold; correction required |
| airLight3 | v04 | v02 | old fallback: pop | Hold; correction required |
| airRecover | v03 | v03 | unmeasured | Manual scale verification required |
| backDash | v03 | v03 | ok | Candidate visual review |
| beamCharge | v06 | v06 | exempt | Review transformed anatomy separately |
| beamFire | v08 | v08 | exempt | Review transformed anatomy separately |
| block | v04 | v04 | ok | Candidate visual review |
| charge | v05 | v04 | old fallback: drift | Hold; correction required |
| dash | v03 | v03 | ok | Candidate visual review |
| down | v03 | v03 | unmeasured | Manual scale verification required |
| getup | v03 | v03 | unmeasured | Manual scale verification required |
| guard | v04 | v04 | ok | Candidate visual review |
| heavy | v08 | v07 | old fallback: pop | Hold; correction required |
| hurtHigh | v02 | v01 | old fallback: unmeasured | Hold; correction required |
| hurtLow | v02 | v02 | ok | Candidate visual review |
| idle | v05 | v05 | ref | Candidate visual review |
| intro | v02 | v02 | ok | Candidate visual review |
| jumpFall | v03 | v03 | ok | Candidate visual review |
| jumpSquat | v03 | v03 | unmeasured | Manual scale verification required |
| jumpUp | v03 | v03 | ok | Candidate visual review |
| ko | v06 | v06 | unmeasured | Manual scale verification required |
| land | v03 | v03 | ok | Candidate visual review |
| launched | v03 | v03 | unmeasured | Manual scale verification required |
| light1 | v03 | v03 | ok | Candidate visual review |
| light2 | v02 | v02 | ok | Candidate visual review |
| light3 | v02 | v02 | ok | Candidate visual review |
| light4 | v03 | v01 | old fallback: drift | Hold; correction required |
| run | v05 | v05 | ok | Candidate visual review |
| special | v05 | v05 | ok | Candidate visual review |
| specialDown | v03 | v02 | old fallback: drift | Hold; correction required |
| specialForward | v03 | v02 | old fallback: drift | Hold; correction required |
| specialUp | v03 | v03 | ok | Candidate visual review |
| spin | v03 | v03 | unmeasured | Manual scale verification required |
| stagger | v02 | v02 | ok | Candidate visual review |
| superDash | v02 | v02 | ok | Candidate visual review |
| superPose | v04 | v04 | ok | Candidate visual review |
| taunt | v02 | v01 | old fallback: unmeasured | Hold; correction required |
| throw | v04 | v02 | old fallback: ok | Hold; correction required |
| vanish | v02 | v02 | unmeasured | Manual scale verification required |
| win | v04 | v04 | ok | Candidate visual review |

## Original attempt-cap audit

| Held source | Attempts used | Blocking evidence |
|---|---|---|
| light4 v03 | A3/B3 | Both parts capped; hair range/drift survives measured restitch |
| heavy v08 | A3/B1 | Capped A f4 measures265px tall at anatomical target; cannot fit256 by translation |
| airLight2 v04 | 3 | Hair scale drift after final pack |
| airLight3 v04 | A2/B3 | Failing B capped; best B2 retained, B3 worsened hair |
| hurtHigh v02 | 3 | Head/body drift |
| charge v05 | 3 | Excessive hair/feet |
| throw v04 | 3 total across versions | Scale/pose failure |
| taunt v02 | 3 | Hair scale failure |
| specialForward v03 | A3/B1 | Failing A capped; hair1.098 and upright lunge |
| specialDown v03 | 3 | Hair1.163 and range.144, bowed head uncertainty |

Unused attempts on a different passing part do not reset the failed part cap. No further attempts are assumed authorized. backDash has one unused original attempt; no clear further anatomy/pose failure remains after v03.
