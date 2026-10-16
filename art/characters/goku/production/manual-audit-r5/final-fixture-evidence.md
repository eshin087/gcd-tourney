# Relay 11 isolated final-atlas fixture

This fixture combines the audited 93-frame baseline, user-approved heavy v14, and light3 v13 for an exact 108-frame audit. It does not change the branch's public atlas.

- Candidate source: `art/characters/goku/raw/_qa_hold/light3_v12.png`, SHA-256 `C2320840541EF2B9A9EBD5919F632BF40F733092CE2C2DDCD54F37467447DCB1`.
- Uniform assembly: `art/characters/goku/raw/_qa_hold/light3_v13.png`, SHA-256 `3A55C5C25E389C6336A3938EF9716929EEEA7D6A90B7D834FAF0ED06A701CBC8`; factor `.696133442603862` reference-ensemble median (operational `.696133`), selected from torso/boot/belt landmarks, not posed bounding-box fit.
- Astra candidate audit: `CANDIDATE_AUDIT.md`; exact seven-cell 48-color candidate anatomy/scale pass within uncertainty. It is not the final-atlas audit or user drawing approval.
- Manifest `bodyHeight` in the fixture is 237. The normal packer's native-size tolerance retained the actual 238px occupied extent at x1 (all seven report `frameScales` are 1); four magenta specks were removed. This is an observed pack result, not a claim that 237/238 was applied.
- Exact 48-color atlas: `final-fixture-public/characters/goku/sheet.png`, SHA-256 `EBB27850371179A0FDC9DA5D76816EBDB52B747712643B60CD40E14BFE6460CA`; metadata `.../anims.json`, SHA-256 `B43AF90A609DC0A36E688BAD916C50694962CE2FCED6FB02384CD400BCD814CA`.
- It contains 23 animations / 108 frames. Independent extraction confirms 101 retained baseline frames have zero alpha-pixel differences from the branch's current `public/characters/goku/sheet.png`. The candidate is the only new animation content.
- Pack report: `final-fixture-pack-report.json`, SHA-256 `8729003A5E3DD7E2BE172F21F1DD754853A0CCDF034CA11FC55B193D5DBDAA21`. Strict-scale policy is recorded separately; no production `scaleManualQA`, public adoption, or final pass is asserted here.

Earlier temporary outputs `FF139D8F...` / `DB121A6F...` came from an invalid-manifest fallback and are stale. They must not be audited or referenced.
