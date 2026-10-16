# Goku core: relay 9 repairs and audited branch atlas

## Review

- **Calibration gallery:** https://gcd-tourney-4hfbyo2rn-eshin087s-projects.vercel.app/characters/goku/calibration-r4/index.html
- **Preview:** https://gcd-tourney-4hfbyo2rn-eshin087s-projects.vercel.app
- Local review entry: `/characters/goku/calibration-r4/index.html`

The gallery shows the approved neutral/combat reference strip at native 256px cells, approved identity references, exact candidate frames and one-shot timing, the light3 256px diagnostic beside its complete 280px companion, and an atlas player reading the branch `sheet.png` and `anims.json`. Parent browser QA is recorded in `art/characters/goku/production/relay9-generation/PARENT_BROWSER_R4.md`.

## Relay 9 decisions and current state

The user authorized one redraw call for `light3` and one for `heavy`. These were each the fifth cumulative call; both budgets are now exhausted. Call authorization is not image approval.

- **light3 v11 — technical HOLD, excluded.** The source was measured at uniform factor .62. In standard 256px cells it loses 800 foreground-mask pixels across seven frames; frame 5 loses 680. The same-density 280px companion preserves all scaled pixels. v10 source, v11 diagnostic and roomy companion remain versioned. The exact call output was recovered from the same session's uniquely scoped generated-images folder and call time window after the wrapper omitted its output hint; the original `output_hint` was not recorded. See `GENERATION_LEDGER.md` and the recovery receipt.
- **heavy v14 — technical PASS, user approved via Claude relay #10.** Independent torso, boot and belt landmarks across f0/f6/f7 support factor .720. All eight poses fit at native x1 with bodyHeight235 and zero clipping. v12 source and superseded v13 remain preserved. The user quote was "Approved". Manifest `status` remains approved and `approvedVersion` is now 14.

The final strict 48-color atlas contains 22 animations / 101 frames; `light3` is the only missing core animation. Astra audited the exact atlas and parent browser QA checked candidate/atlas playback, native reference scale, clipping counts and a local game-load smoke check. This does not certify runtime contacts, timed gameplay, or approvals for other assets. The known getup floor/contact warning remains for Claude's runtime review.

- Sheet SHA-256: `f117d996d5d9f225b13bfc6d7b19a741e603fa04a329b1410422263eadd824f2`
- Metadata SHA-256: `2ee25e2a2103a145f1a888700b5e55cd19ddb0fd7a755649f1056226e6fdbbd6`

Real-input pack command: `node tools/pack-sprites.mjs goku --strict-scale --quantize 48 --no-writeback --json`. It exited 0 and reproduced both audited hashes. The committed preview build also succeeded. No tests, merge, or production deployment were run.

## Evidence

- Final Astra strict audit: `art/characters/goku/production/manual-audit-r4/FINAL_STRICT_AUDIT.md`
- Source screens and measurements: `art/characters/goku/production/manual-audit-r4/SOURCE_SCREEN.md`
- Candidate diagnostics and assembly details: `art/characters/goku/production/relay9-generation/`
- Browser QA: `art/characters/goku/production/relay9-generation/PARENT_BROWSER_R4.md`
- Per-candidate review rows: `art/characters/goku/REVIEW_ROWS.md`

## Current review rows

| Candidate | Review state | Technical result and provenance |
|---|---|---|
| light3 v10 source — [preserved source](art/characters/goku/raw/_qa_hold/light3_v10.png) | Technical hold; not ready for drawing review | Fifth cumulative generation call. Exact output path was recovered from the same session's generated-images folder and call window after the wrapper omitted its output hint; the original output_hint was not recorded. Source, prompt/reference hashes and recovery receipt are in art/characters/goku/production/relay9-generation/GENERATION_LEDGER.md. |
| light3 v11 — [256px diagnostic](art/characters/goku/raw/_qa_hold/light3_v11.png) and [280px companion](art/characters/goku/raw/_qa_hold/light3_v11_roomy_280.png) | Technical HOLD; excluded | Uniform .62 factor; 800 foreground-mask pixels clip in the standard 256px cells, while the same-density roomy companion preserves all scaled foreground pixels. |
| heavy v12 source — [preserved source](art/characters/goku/raw/_qa_hold/heavy_v12.png) | Source preserved; v14 is current candidate | Fifth cumulative generation call. Source, prompt/reference hashes and component provenance are in the relay9 generation ledger. |
| heavy v13 — [preserved assembly](art/characters/goku/raw/_qa_hold/heavy_v13.png) | Superseded diagnostic; preserved | Earlier uniform .73 assembly; retained as version history. |
| heavy v14 — [current selected candidate](art/characters/goku/raw/heavy_v14.png) | User approved via Claude relay #10 ("Approved") | Uniform .720 factor from independent f0/f6/f7 torso, boot and belt landmarks; bodyHeight235, native x1, zero clipping. Exact final atlas anatomy/scale audit PASS. Manifest status is approved and approvedVersion is 14. |

Relay 9 authorized exactly one new generation call for each move, making five cumulative calls each. No further calls were made. The exact source receipt and all assembly candidates are recorded in art/characters/goku/REVIEW_ROWS.md.

## Hosted verification

Parent authenticated fetch verified that the hosted branch sheet.png and anims.json match the exact hashes above. Hosted HTML reports heavy v14 technical PASS and user approval via relay #10, light3 v11 HOLD and excluded, and the 101-frame atlas. Vercel browser access reaches the login page, so hosted interactive rendering was not browser-verified; local interactive QA passed as documented above.


## User approval

On 2026-10-16, Claude relay #10 relayed the user decision: "Approved". It applies exactly to Goku heavy v14. No other Goku asset is approved by this decision. light3 v11 remains held and excluded.
