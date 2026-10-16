# Luffy calibration r2 audit handoff

Review-only 48-color diagnostic atlas, separate from gameplay files. The normal branch-manifest auto gate was run first and wrote no atlas; its HOLD is recorded in [strict pack log](strict-pack-after-claude-calibration.log). A fixture-only warning-mode pack rendered 23 animations / 108 frames for manual Astra inspection; see [diagnostic pack log](astra-fixture-pack.log), [version/hash inventory](inventory.json), and [timed viewer](index.html).

Atlas SHA-256: `67152fadd32053fb70ab5682b9dde97df94a4c9d818edf233a6d1caa061d2f6e`. Metadata SHA-256: `17e1b30bba502d6508ffd37e99d5fbbb8e31ab40a1cc4fc0aab4f5e3f01d711c`.

Astra audit is pending. Candidates are not approved and no scaleManualQA pass is recorded. Four user-accepted edge clips are placement-only: run v01 rear foot f3/f4/f7; airLight1 v01 fist f2/f3; light3 v02 toe f3; light4 v02 foot f4. Anatomy remains unaudited. beamFire v02's arm clip is described in Claude's calibration note and is not user-accepted.
