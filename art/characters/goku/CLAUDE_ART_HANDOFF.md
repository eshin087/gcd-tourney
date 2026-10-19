# Claude art handoff — ENG-112 Goku r2

Date: 2026-10-18. Branch: `art/normals-goku-r2`.

## User decision needed

Relay #44's one authorized generation round is complete. Seven image calls were made: uTilt 2, uSmash 2, dSmash 3. All generated attempts and hashes are preserved under `raw/_qa_hold/`; the selected sources are uTilt v04 (call 2), uSmash v04 (call 2), and dSmash v05 (call 3). dSmash v04 remains preserved as the attempt-2 candidate but is superseded for review.

Packed review page: `public/reviews/normals-goku-r2/index.html`.

Astra's exact final5 audit is `production/ENG112_R2_RELAY44_ASTRA_AUDIT.md`; atlas/metadata hashes and measurements are recorded there. HOLDs: uTilt v04 and uSmash v04 fit the cell and their active angled uppercuts are clear, but guard/recovery boots and lower-body proportions are visibly small versus idle02; dSmash v05 correctly has both legs extended in active f2/f3 with phases `[2,2,4]`, but both boots are clipped at the cell edges. Its guard head/upper body also reads larger. No scaleManualQA pass or final hitbox override was recorded. Diagnostic-only placeholder scale manifest and atlas must not ship.

All three selected candidates remain under `raw/_qa_hold/`, so gameplay stand-ins remain active. Please ask the user through the combat lane whether to authorize measured import-only scale correction for uTilt/uSmash and another scoped dSmash repair, or keep the stand-ins. This is a decision request, not image approval. The original seven Goku moves remain approved and merged into main; this branch contains the relay #44 follow-up evidence and candidates only.
