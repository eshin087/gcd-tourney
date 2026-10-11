# Killua additional redraw checkpoint — 2026-10-11

Nine requested strips / 50 frames inspected. **Strict whole-character pack exits 1; no runtime atlas or frame outputs written.** Five new strips have per-strip `ok`; light1 and airLight3 remain capped numerical holds; down and ko require Claude manual review. New images are not covered by the earlier blanket approval.

| Asset | Version | Extra calls / 3 | Strict verdict | Detail |
|---|---|---|---|---|
| run | v07 | 2/3 | ok | Head size corrected. Existing near/far leg depth reversal still ambiguous; preserved approved body/poses, not claimed as new gait repair. |
| light1 | v08 | 3/3 | drift | Capped: final hair-only retry overshot; f0-f3 still oversized. Earlier v06/v07 also failed. No further calls authorized in this round. |
| heavy | v10 | 2/3 | ok | Hair f0/f5 reduced; crouched skull measurement remains ±12 source px. Full 8-frame body continuity inspected. |
| airLight3 | v07 | 3/3 | pop | Capped: final A hair retry overshot, f2/f3 large. B is corrected v06 unchanged. Earlier v06 A was undersized. Do not scalar-fit away the part discrepancy. |
| airHeavy | v06 | 2/3 | ok | Second call corrected remaining f2 hair; all 6 frames read continuous at one scale. |
| special | v05 | 1/3 | ok | Head correction in B, original A unchanged. All eight hand poses and body lengths preserved. |
| specialDown | v04 | 1/3 | ok | Hair-only correction f0/f1. All four body poses preserved. |
| down | v05 | 1/3 | unmeasured | Claude manual QA required for new v05. Side-on f0 impact/f1 rest; shortened near shin ~1.30 skull axes; source landmarks uncertain ±18px. No new floor/margin warning. |
| ko | v06 | 1/3 | unmeasured | Claude manual QA required for new v06. Side-on rest; shortened shin ~1.49 skull axes vs prior ~2.3; source landmarks uncertain ±20px. No new floor/margin warning. |

Every contact has approved idle v03 in cell 0, then f0 onward at the same pixel scale. All 50 frames were inspected for body build, limbs, margins, pose continuity and identity. Raw edits preserve long slim torso/shins; no general head/body shrinking was used. Near/far running leg depth remains ambiguous from the approved source. Strict report and per-frame landmarks retain numeric uncertainty; no uncertain value was tuned to force a pass.

Commands: `node tools/pack-sprites.mjs killua --quantize 48 --strict-scale --json` (strict-final.json, exit1); official stitch `--counts` against scratch-public idle3; diagnostic-only pack with copied warn manifest, `--quantize 48 --no-writeback --out .../scratch-public` (exit0). `scale-audit` writes final-scale only through scratch-art. `npm.cmd run lineup -- --candidate .../candidate-run.png --name killua-run-v07 --out .../lineup.png` adds current run at actual pixel scale; other columns are historical worktree atlases and are not evidence of current cast approval.

Remaining warnings: old stored scale-baseline still reports 51x36 versus current idle43x32; stale airHeavy exemption v02 is not applied to v06. These records were deliberately not changed. No thresholds, exemptions, manual-QA, scaleFit or builds data changed. Claude must decide down/ko manual evidence; light1/airLight3 need a further authorized correction or targeted tooling diagnosis, never waiver of real drift.

Validation: `npm.cmd run build` passed (Vite6.4.3,80 modules). Manifest diff changes exactly nine newest-version fields; approvedVersion/status and every calibration/exemption/manual record remain unchanged.
Browser QA: all18 gallery images loaded; existing42-animation custom Killua atlas loaded. No application exceptions; only the existing missing favicon.ico returned404 twice.
