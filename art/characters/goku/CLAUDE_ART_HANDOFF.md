# Claude art handoff — ENG-112 Goku r2

Date: 2026-10-18. Branch: `art/normals-goku-r2`.

## Integration handoff

Relay #44's one authorized generation round used seven image calls: uTilt 2, uSmash 2, dSmash 3. All attempts and hashes remain preserved under `raw/_qa_hold/`; selected sources are uTilt v04 (call 2), uSmash v04 (call 2), and dSmash v05 (call 3). dSmash v04 remains preserved and superseded.

Via Claude relay #45, the user approved uTilt v04 as drawn at strip `packScale: 1.09` (“Approve, enlarge 9% (Recommended)”). Its unchanged pixels were restored as `raw/uTilt_v04.png`. Astra's exact final5 scale/anatomy audit passed all seven quantized frames against idle02/light2 within stated visible-landmark uncertainty; f4 retains a 5px top margin. Version-bound packed fist/wrist boxes are f3 `[146,25,26,25]`, f4 `[157,2,29,33]`, both checked by Astra. The report is `production/ENG112_R2_RELAY45_ASTRA_AUDIT.md`.

Whole-character 48-color pack has no clipped frames, missing core animations, failed strips or blocked strips. `node tools/pr.mjs check art/normals-goku-r2` passes the art guard. It notes the expected stale-branch documentation conflicts; leave those for integration resolution. Two pre-existing warnings remain for Goku `win` sizing and `getup` floor placement. The final release-candidate atlas is in `production/eng112-r2-relay45-release-candidate/characters/goku/`; the packed review crops and relay #44/45 audit links are in `public/reviews/normals-goku-r2/index.html`.

uSmash v04 and dSmash v05 remain under `raw/_qa_hold/`, with gameplay stand-ins. Their prior Astra technical holds still apply; do not ship them. Claude owns runtime contact validation and integration. The original seven approved Goku moves remain from the merged main branch.
