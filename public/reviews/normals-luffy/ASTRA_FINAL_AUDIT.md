# Luffy ENG-112 final diagnostic atlas audit

**Result: four technical visual/scale passes, six holds.** The user approved all ten drawings as drawn via Claude relay combat #49. This remains a diagnostic atlas (`scaleGate: warn`), not a strict production pass; drawing approval does not clear the six technical holds.

- `audit_atlas/sheet.png` SHA-256: `9be5f2e0edb8aaf7214eb6694ede4b1032f5872c3685eff491febfc5c5daee0e`
- `audit_atlas/anims.json` SHA-256: `311c9a92427b520849e84319052255c1a3f3985a827687dad271ae2c311b280d`
- Atlas: 4096×3072, 48 opaque colors, 178 frames.
- Inspected all 70 selected candidate frames in sequence. Every supplied review crop was byte-checked against its atlas cells.
- Visible endpoint uncertainty: about ±3 px for brim/sole, ±5–7 px for neck-to-sash and ±5–6 px for exposed shin. Hidden or strongly foreshortened anatomy was not numerically certified.

| Move | Candidate | Result and evidence |
|---|---|---|
| fTilt | v01, cells 108–114 | **PASS.** Connected chest-height punch on active f2–f3; coherent recovery. Hat, neck-to-sash, shins, sandals and clothing volume are consistent with idle. Bounds x65–203, y53–241; no strip rescale. The first two generation calls lack captured output receipts; see the raw attempt ledger. |
| uTilt | v02, cells 115–121 | **HOLD — scale.** Hat/head, trunk and sandals read smaller than idle through startup and upright extension. A connected strike and adequate margins do not establish idle-sized anatomy. |
| dTilt | v02, cells 122–127 | **HOLD — anatomy, clipping, timing.** Enlarged hat/upper body; active f2 clips the forward sandal at x=256; f3 has retracted to a knee lift. |
| dashAttack | v02, cells 128–134 | **HOLD — clipping and color contamination.** f2 cuts the head/hat and front knee at x=256; f4 also reaches the right edge; pink remains around the rear knee in f3. |
| fSmash | v02, cells 135–143 | **PASS.** Active fists are complete. Measured `frameOffsets` `[-7,0]` across all nine frames; active right margins are 5 px and 4 px. No body rescale; the uniform shift adds no frame-to-frame jump. |
| uSmash | v03, cells 144–151 | **HOLD — whole-body shrink.** Hat, torso, shorts and sandals remain substantially smaller than idle even in upright poses; the raised arm fits because the full figure is reduced. |
| dSmash | v02, cells 152–159 | **HOLD — clipped bilateral contact and timing.** The first active split reaches both cell edges, losing both contacts; the next active frame is crouched recovery rather than a second two-sided sweep. |
| fair | v03, cells 160–165 | **PASS.** Measured `frameOffsets` `[-18,0]` across all six frames recover the hat, hands and forward sandal without body rescale. Forward margins on frames 0/1/2 are 13/8/5 px; second active sandal remains visible. No pink streaks found. |
| bair | v03, cells 166–171 | **PASS.** Connected rearward heel on active frames 2–3 with the torso facing right; at least 12 px left and 15 px right margins. Visible head, torso, shorts, legs and sandals remain coherent. Runtime hitbox direction is not certified. |
| uair | v01, cells 172–177 | **HOLD — pose and timing.** f2 is a knee chamber; only f3 makes overhead contact. A straight supporting leg and grounded sandal read as a standing high kick. |

The four pass records are version-bound to these exact sheet and metadata hashes and the displayed quantized cells. They certify visible anatomy/scale within the listed uncertainty only. They do not certify runtime contacts, hitboxes, gameplay, strict scale-gate status or drawing approval.
