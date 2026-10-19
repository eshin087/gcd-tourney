# Luffy charge v02 pack evidence

- Source: `art/characters/luffy/raw/charge_v02.png`, SHA-256 `69e94d35c8e7832f5a08104e93a7fd61d1268ecdb1e491678396403522c2dd5` (byte-identical promotion from `_qa_hold`; no drawing edits).
- Pack command: `node tools/pack-sprites.mjs luffy --quantize 48 --keep-palette` after merging current main.
- Result: 23 animations / 110 frames, 4096x1792, 48 colors, complete. Charge uses atlas cells 86-91, durations `[70,90,110,110,110,110]`, `loopFrom: 2`; packer detected the source's two-row grid.
- Packed sheet SHA-256: `557bdb538bbcfd79c5dadcf0761d3da8ae93986fe8ae0a4d110363519fb46a8c`.
- Packed metadata SHA-256 after Astra's scale-only record: `dd751d52fcd259ca37ca038ba862051d9e9c10aa8aee6ddc2d74ea34a8c03fe2`.
- Automatic scale report: 1 reference, 21 manual, 1 unmeasured. `art/scale/builds.json` sets Luffy's head probe to manual, so charge v02 needs version-bound rigid-landmark `scaleManualQA` by Astra.
- Initial strict command failed solely because charge v02 lacked its required manual landmark QA. After Astra recorded the version-bound scale-only pass in the manifest, rerunning `node tools/pack-sprites.mjs luffy --quantize 48 --keep-palette --strict-scale` passed the strict scale gate and rewrote the same atlas. The pack still reports unrelated pre-existing placement warnings below.
- Body sheet ratios for charge v02: B `[1.035, 1.100, 1.100, 1.107, 1.104, 1.079]`, median `1.100`; the head probe values are invalid for Luffy and are not scale evidence. See `body-sheet/` and the packed-pixel registration sheet `registration_v02.png`.
- The pack also reports pre-existing placement warnings on run, light3, light4 and beamFire. They are outside this charge change; the 10 fallback strike-hitbox warnings are likewise pre-existing.

The strict repack after inserting `scaleManualQA` preserved the packed sheet byte-for-byte (same SHA-256 above) and the same charge cells, timings, and `loopFrom`. Only metadata changed from Astra's pre-record hash `f73578bf7f640be0919f0a0443133f5c1891305ad3c9844905221ecb3b2353e9` to the final hash above.

This is pack/scale evidence, not a loop-contract pass, interactive lab playback, in-game validation, or merge authorization. Astra's packed loop audit is HOLD; see `ASTRA_AUDIT.md`.
