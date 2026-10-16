# Luffy win v03 and light1 v02: Claude calibration (2026-10-15)

Reference density: Luffy's packed idle matches his approved title-style cells (Astra's native audit: idle f0 shins
53.3/52.6 px vs combat 54.6/53.8, torso 42.8 vs 38.8), so a source drawn at the lineup density should pack at x1.

- **win v03** (`raw/_qa_hold/win_v03.png`, native cells): upright hat-to-sole 237-238 px in every frame, the approved
  neutral's 238 at the same density (Codex's win-v03-QA.md). At the inherited `bodyHeight` 212 the packer scaled it
  x0.891, which is what the strict gate read as head 0.94 / feet 0.88. Claude set win `bodyHeight` to **236** (the
  tallest figure the cell holds with its 4 px top margin): x0.99, 1 % under the neutral, inside the ±3 px landmark
  uncertainty.
- **light1 v02** (`raw/_qa_hold/light1_v02.png`, native cells): occupied 202-205 px; lower legs 61.8-64.8 px vs the
  combat cell's 65 (Codex). Its `bodyHeight` 204 already packs it at about x1, so no change. The strict gate's head 1.10
  is Luffy's known palette misread (the hat shares the sash/vest/skin colours: CALIBRATION.md), not a size error.

Both stay in `_qa_hold` until Astra's final audit of the packed frames; neither number is an anatomy pass.
