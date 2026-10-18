# ENG-112 Goku pilot calibration handoff

Status after Claude relay #38: **eight remaining normals authorized to resume**. Goku's head probe is disabled by design; each candidate requires a version-bound landmark `scaleManualQA` record. Claude's color-area comparison sets fTilt v01 strip `packScale: 1.0` and fair v01 strip `packScale: 0.92`. Astra's exact-atlas landmark audit is pending. No numeric head-probe pass is claimed.

## Selected pilot sources

| move | selected version | source | dimensions / layout | source SHA-256 | calls |
|---|---|---|---|---|---|
| fTilt | v01 | `raw/fTilt_v01.png` | 1792x256; seven horizontal 256px cells | `D92A4B868BEDDA70A2BCA6CB1866FAC06A8F58FE5E3A71C36413983C17FCD870` | attempt 1 result lost and documented; attempt 2 retained; attempt 3 selected |
| fair | v01 | `raw/fair_v01.png` | 1536x1024; 3x2 grid, row-major | `89496DA590C79209428BF01FAA98D4163EDA3C48981956A5D024FF54E2069525` | attempts 1 and 2 retained; attempt 3 selected |

Every returned source and exact prompt/reference provenance is retained under `raw/_qa_hold/`. The Goku approved identity references used were `reference/model_sheet.png`, `reference/expressions.png`, and `reference/idle_approved.png`; hashes are in the per-attempt ledgers.

## Packer diagnostic

Ran `node tools/pack-sprites.mjs goku --root art --manifest <temporary pilot manifest> --out <temporary output> --quantize 48 --no-writeback --json`. The temporary manifest selected only these v01 pilots; the real production manifest was not used as a calibration bypass. The analyzer recognized fTilt as 7 frames and fair as 6 frames, with per-strip fit factors 0.609 and 0.474. Both received `unmeasured` scale verdicts because Goku's gold hair makes the automatic head detector unreliable, and the strict gate refused atlas output. The generated temporary output directory remained empty. These factors are recorded as diagnostics, not approved import scales.

Claude's relay #38 compared fTilt blue color area `.91–1.02` and gi area `1.05–1.09` against live light2 `.98` and `1.01–1.05`, respectively, and set strip `packScale: 1.0`. For fair, the relay measured blue `.92–1.09` / gi `.94–1.14` against live airLight1 blue `.89–.97` / gi `.95–1.05`, about 8–12% larger, plus 3px of intrusion at f2/f3; the relay set strip `packScale: 0.92`. These are the calibration decisions; the remaining eight should use the same diagnostic comparison against the matching live move class, with measured strip packScale only where landmarks differ by more than about 6%.

The warn-mode diagnostic atlas at `eng112-pilot-atlas/public/characters/goku/` uses the two calibrated strip fits and a temporary manifest. Sheet SHA-256 `EC0AE1F30E337C7522125A376F07D44EC322F9322CDF1948217C719B8AA5A48D`; anims SHA-256 `12FAA10CD0BB5EBFB0BA6D67DC1CFE2B89026AA75AD6167AFBCDE34CE46849F`. fTilt occupies frames 111–117 and fair 118–123. Astra's [exact-atlas audit](ENG112_PILOT_ASTRA_AUDIT.md) found coherent visible anatomy and complete margins but holds both versions for numeric scaleManualQA: occluded knees/hips/skull and endpoint uncertainty prevent confirming every segment within about 6%. This is not a demonstrated drift and does not justify redrawing or further scaling. Claude technical disposition remains pending; the relay #38 authorization allows the other eight candidate drawings to proceed while the pilots stay held.

No user image approval is requested by this handoff. fSmash attempt 1 was returned as the helper was being paused; it is retained and documented under `_qa_hold`, consumes one of its three calls, and is not a selected candidate.
