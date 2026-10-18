# Full Sasuke diagnostic atlas for ENG-112

This is a diagnostic pack for the Astra scale audit, not a production atlas or an art approval. It was built from the full Sasuke raw source set with `node tools/pack-sprites.mjs sasuke --quantize 48`, using an ephemeral copy of `art/manifest.json` that marked fTilt, dTilt, dashAttack and uSmash at their current versions as approved solely so the packer would emit the complete atlas despite their candidate scale failures. The repository manifest was not changed for this diagnostic build.

The atlas contains 53 animations and 243 frames at 48 colors. `sheet.png` SHA-256: `cdf928740441a9f6430b0cdc85d25f331b62781540ac767df1f638254ac861d8`. `anims.json` SHA-256: `b124251b65546ba30deac3611f66ccad79235828b4d96759982d0794b4f3f3e6`. fair v03 in this diagnostic atlas is the pre-fit import; the current post-fit production atlas is `public/characters/sasuke/sheet.png` with SHA-256 `59BDABFD6E72E7D425E9ACEEBD0DDF1EE1498C44471099307406F93E561E1B23`.

The packer reported measurement failures for fTilt v03, dTilt v01, dashAttack v05 and uSmash v05. Those candidates remain out of the shipped pack. Approved uTilt v01, fair v03 and uair v01 are included for direct frame-level comparison; their scale findings remain under Astra review. The atlas does not clear the separate runtime contact check.
