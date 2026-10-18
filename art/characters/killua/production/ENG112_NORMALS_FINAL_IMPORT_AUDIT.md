# ENG-112 Killua final import audit (2026-10-18)

Final Astra audit of all 70 new packed frames, idle f0 and approved neutral/combat reference cells. Exact sheet and anim hashes were verified by the auditor. This is technical evidence, not an image approval or release pass.

## Import actions

- Added version-bound `anatomy.measurement: auto-head` sidecars for fTilt v02, dTilt v02, dashAttack v02, fSmash v02, fair v02, bair v02 and dSmash v03, as authorized by relay combat #23.
- Added `auto-head` sidecars for uSmash v02 and uair v02 as authorized after Astra found actual oversizing. Both were refused by the packer because their within-strip head probes remain `pop`; no exemption was broadened.
- Recorded exactly the requested probe exemptions: uSmash v02 frame 5 and uair v02 frame 2, with `scaleExemptVersion: 2`.
- Adjusted phases to uTilt `[3,2,2]`, dashAttack `[3,2,2]`, uSmash `[4,2,2]` to place their drawn peak in the active window.
- Whole-character pack completed at 48 colors, 54 animations and 251 frames. Strict clearance was not achieved.

## Astra findings

- **Visual scale pass, no conspicuous undersize:** fTilt v02, dTilt v02, dashAttack v02, fSmash v02, fair v02, bair v02. This is not a numerical five-segment ±6% certification.
- **dSmash v03 hold:** clipping is resolved, but the fitted body, especially standing/recovery legs and clothing volume, looks compact; segment parity is uncertain. No forced rescale.
- **uTilt v02 hold:** source figures overlap; f1 contains a detached foreign boot/leg and f2 a severed leg boundary. Packer also warns all poses touch and its column split cuts figures. This cannot be cleared by head fitting.
- **uSmash v02 hold:** unobscured heads remain visibly larger than idle (49–50 px vs 43 px). The head probe also pops within the strip (f4 0.80 vs f1 1.19), so auto-head fit is refused. No extra exemption authorized.
- **uair v02 hold:** head, torso, limbs and shoes are visibly oversized; hair widths 55–57 px vs idle 43 px. Probe pop remains (f3 0.75 vs f0 1.35), so auto-head fit is refused. No extra exemption authorized.
- Contact overrides remain incomplete: fTilt boxes excessively tall; dashAttack and uSmash timing/contact need final review; bair boxes are on the wrong side; dSmash boxes omit the left sweep; uair has a tall fallback box. Astra did not provide exact replacement measurements.

The seven successfully fitted strips preserve cell margins: fair f2/f3 x=97–243 / 95–237; bair f2/f3 x=10–153 / 6–146; dSmash f3/f4 x=25–206 / 54–192. These are occupied-pixel bounds, not complete anatomy measurements.

## Disposition

HOLD. Do not ship or represent the guard as passing. A user decision is needed on new source candidates for uTilt, uSmash and uair; dSmash also needs a defensible full-body measurement before final clearance. Approved visual sources remain preserved unchanged.

## Relay combat #24 ship-order follow-up

User decision: first merge only fTilt, dTilt, dashAttack, fSmash, fair, bair v02 and dSmash v03; uTilt/uSmash/uair use existing stand-ins on this branch and continue separately. Moved the approved v02 sources and sidecars unchanged to `raw/_qa_hold/`; older v01 raws were also held because the packer otherwise selected them instead of stand-ins.

Repacked the whole character: 51 animations, 230 frames, 48 colors; three deferred normals are absent and therefore use game fallbacks. Added frame-local contact overrides measured from the final quantized cells: fTilt f2/f3 target the fist, bair f2/f3 target the leftward striking shoe, and dSmash f3/f4 target both low shoes. The `hitboxes.json` `_scale` values match each fitted atlas strip so the packer does not transform these final-cell coordinates a second time. Review crops and red-box overlays are in `public/reviews/normals-killua/ship-seven/`.
