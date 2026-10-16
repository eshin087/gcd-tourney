# Goku core: relay 9 repairs and audited branch atlas

## Review

- **Calibration gallery:** https://gcd-tourney-4hfbyo2rn-eshin087s-projects.vercel.app/characters/goku/calibration-r4/index.html
- **Preview:** https://gcd-tourney-4hfbyo2rn-eshin087s-projects.vercel.app
- Local review entry: `/characters/goku/calibration-r4/index.html`

The gallery shows the approved neutral/combat reference strip at native 256px cells, approved identity references, exact candidate frames and one-shot timing, the light3 256px diagnostic beside its complete 280px companion, and an atlas player reading the branch `sheet.png` and `anims.json`. Parent browser QA is recorded in `art/characters/goku/production/relay9-generation/PARENT_BROWSER_R4.md`.

## Relay 9 decisions and current state

The user authorized one redraw call for `light3` and one for `heavy`. These were each the fifth cumulative call; both budgets are now exhausted. Call authorization is not image approval.

- **light3 v11 — technical HOLD, excluded.** The source was measured at uniform factor .62. In standard 256px cells it loses 800 foreground-mask pixels across seven frames; frame 5 loses 680. The same-density 280px companion preserves all scaled pixels. v10 source, v11 diagnostic and roomy companion remain versioned. The exact call output was recovered from the same session's uniquely scoped generated-images folder and call time window after the wrapper omitted its output hint; the original `output_hint` was not recorded. See `GENERATION_LEDGER.md` and the recovery receipt.
- **heavy v14 — technical PASS, user drawing approval pending.** Independent torso, boot and belt landmarks across f0/f6/f7 support factor .720. All eight poses fit at native x1 with bodyHeight235 and zero clipping. v12 source and superseded v13 remain preserved. The manifest keeps `status: approved` and `approvedVersion: 4` for the already approved v04 drawing; v14 remains a candidate awaiting review.

The final strict 48-color atlas contains 22 animations / 101 frames; `light3` is the only missing core animation. Astra audited the exact atlas and parent browser QA checked candidate/atlas playback, native reference scale, clipping counts and a local game-load smoke check. This does not certify runtime contacts, timed gameplay, or user drawing approval. The known getup floor/contact warning remains for Claude's runtime review.

- Sheet SHA-256: `f117d996d5d9f225b13bfc6d7b19a741e603fa04a329b1410422263eadd824f2`
- Metadata SHA-256: `2ee25e2a2103a145f1a888700b5e55cd19ddb0fd7a755649f1056226e6fdbbd6`

Real-input pack command: `node tools/pack-sprites.mjs goku --strict-scale --quantize 48 --no-writeback --json`. It exited 0 and reproduced both audited hashes. The committed preview build also succeeded. No tests, merge, or production deployment were run.

## Evidence

- Final Astra strict audit: `art/characters/goku/production/manual-audit-r4/FINAL_STRICT_AUDIT.md`
- Source screens and measurements: `art/characters/goku/production/manual-audit-r4/SOURCE_SCREEN.md`
- Candidate diagnostics and assembly details: `art/characters/goku/production/relay9-generation/`
- Browser QA: `art/characters/goku/production/relay9-generation/PARENT_BROWSER_R4.md`
- Per-candidate review rows: `art/characters/goku/REVIEW_ROWS.md`
