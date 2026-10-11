# Sasuke post-approval corrections — 2026-10-11

New candidates need user review. Claude remains the only integration coordinator. No merge or production deployment was performed.

Selected: charge v08, getup v04, special v06, specialForward v05, superDash v04. special v07 was technically rejected and archived immutable: its f5 hair measurement was worse (.73) than v06 (.83). Manifest version7 retains the complete history; selected available source is6.

## Checks and holds

- Strict command: `node tools/pack-sprites.mjs sasuke --quantize 48 --strict-scale`. Exit1; production atlas/frames NOT written. Exact [log](post-approval-strict.txt).
- Diagnostic scratch pack uses a separate uncommitted manifest with warn mode solely to render evidence; production manifest thresholds/exemptions/manualQA/builds/scaleFit are unchanged.
- 42 animations /175 frames: 1 reference,27 ok,7 existing manual,3 existing exemptions,1 unmeasured,1 drift,2 pop.
- charge v08: hair1.065–1.069, drift. Original v06 skull/body/canvas retained by localized hair edit and original108px skull sidecar. Best preserves body unlike v07 enlarged-skull attempt. Three extra calls exhausted; do not approve shipping from numeric near-pass.
- special v06: hair .829–1.029, pop. Source B body/skull preserved; hair palette coverage remains inconsistent. Three extra calls exhausted. v07 worsened center pose and was not selected.
- specialForward v05: .853–1.057, pop; last recovery head smaller than active frames. Three extra calls exhausted. No exemptions or calibration chosen to pass.
- getup v04: unmeasured rotating poses; Claude must independently review and record version-specific manual QA if acceptable. f4 lengthened torso/legs, pink ghost removed. Source landmarks listed in sidecar; f4 skull approx(1965,100)→(1985,177),80±10px, independently corroborated by lead77–86. Previous96px estimate disproved by crop. f0/f1 remain ±16–18px uncertainty due rotation/occlusion. Two of three extra calls used; no visible correction currently justified beyond manual review.
- superDash v04: raw byte-identical approved v03, f0 x offset-4 adds requested4px right clearance; f1 retains-9. Anatomical scale unchanged; ok and no clipping reported.
- Build passed via local Vite adapter. No tool/engine changes.
- Approved fixed idle refreshed from already-approved raw idle v06; head guide regenerated against current-idle scratch pack. This applies an existing approval, not a new one.

## Review evidence

[Gallery](../../../../public/art-review/sasuke-post-approval/index.html) shows every selected frame plus approved idle, the raw sources, probe values, and [heads](../../../../public/art-review/sasuke-post-approval/heads.png).
[Contact](../../../../public/art-review/sasuke-post-approval/contact.png): rows idle,charge,getup,special,specialForward,superDash.
[Lineup](../../../../public/art-review/sasuke-post-approval/lineup.png) adds diagnostic charge candidate to the previously successful packed cast; other columns are historical atlas output, NOT the current unshipped cast redraw. Do not use its stale build labels as the approved neutral contract.

[Exact prompts and caps](../reference/post-approval-attempts.json). All saved versions have review rows, earlier approvals remain unchanged. New candidates do not inherit blanket approval. No declaration changes were made to make the probe pass.

