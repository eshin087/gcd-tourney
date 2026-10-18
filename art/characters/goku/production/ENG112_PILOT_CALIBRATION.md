# ENG-112 Goku pilot calibration handoff

Status: **hold before generating the other eight normals**. Goku's production workflow requires Claude to calibrate a planted and an extended/airborne pilot from reliable body landmarks before batch expansion. No numeric head-probe pass is claimed.

## Selected pilot sources

| move | selected version | source | dimensions / layout | source SHA-256 | calls |
|---|---|---|---|---|---|
| fTilt | v01 | `raw/fTilt_v01.png` | 1792x256; seven horizontal 256px cells | `D92A4B868BEDDA70A2BCA6CB1866FAC06A8F58FE5E3A71C36413983C17FCD870` | attempt 1 result lost and documented; attempt 2 retained; attempt 3 selected |
| fair | v01 | `raw/fair_v01.png` | 1536x1024; 3x2 grid, row-major | `89496DA590C79209428BF01FAA98D4163EDA3C48981956A5D024FF54E2069525` | attempts 1 and 2 retained; attempt 3 selected |

Every returned source and exact prompt/reference provenance is retained under `raw/_qa_hold/`. The Goku approved identity references used were `reference/model_sheet.png`, `reference/expressions.png`, and `reference/idle_approved.png`; hashes are in the per-attempt ledgers.

## Packer diagnostic

Ran `node tools/pack-sprites.mjs goku --root art --manifest <temporary pilot manifest> --out <temporary output> --quantize 48 --no-writeback --json`. The temporary manifest selected only these v01 pilots; the real production manifest was not used as a calibration bypass. The analyzer recognized fTilt as 7 frames and fair as 6 frames, with per-strip fit factors 0.609 and 0.474. Both received `unmeasured` scale verdicts because Goku's gold hair makes the automatic head detector unreliable, and the strict gate refused atlas output. The generated temporary output directory remained empty. These factors are recorded as diagnostics, not approved import scales.

The next step is Claude's source-landmark calibration for both pilots against Goku's approved idle and the title-style neutral/combat cells. Confirm source density/scale and actual frame boundaries; then pack calibrated candidates and have Astra audit the packed pixels before authorizing remaining generation. If the landmarks disagree or the source cannot be calibrated, keep the batch paused and route the unresolved measurement to the user through the combat lane.

No user image approval is requested by this handoff. fSmash attempt 1 was returned as the helper was being paused; it is retained and documented under `_qa_hold`, consumes one of its three calls, and is not a selected candidate.
