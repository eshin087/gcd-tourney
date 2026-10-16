# Super art round 2a generation ledger

Generated 2026-10-16 with the built-in image_gen tool; no CLI/API fallback. Worktree: `art/super-art-r2` (`8706d894`). Reference inputs for every image: that fighter's approved `reference/model_sheet.png`, `reference/expressions.png`, and `reference/idle_approved.png`. The generated PNG bytes were copied directly from the tool's returned data URL into each listed raw path. No candidate was copied into `ui/` or packed into shipping files.

One call per distinct asset except Naruto `super_bg`, which took two calls (the first result was not captured in the initial tool wrapper; the second result is the saved v01). This remains below the three-call per-image limit. Every saved candidate is version 01.

| Character / asset | Calls | Dimensions | Bytes | SHA-256 | Saved path |
|---|---:|---:|---:|---|---|
| Naruto / super_bg | 2 | 1536x1024 | 2096866 | `5ff93e87360a34374a0c1f5d35d5c2bef1f6c8aee3a393fcd811ef7fb8d404d3` | `art/characters/naruto/raw/ui_super_bg_v01.png` |
| Naruto / super_fg | 1 | 1536x1024 | 1692102 | `047f5f027d877727e4aa3392576f67b7073abfc7dd473c6cf2c6381e0fcdad7b` | `art/characters/naruto/raw/ui_super_fg_v01.png` |
| Naruto / ult_bg | 1 | 1672x941 | 1591540 | `c39d370ad56d3f50bd3b5c2b12ae083c8a8ab8234cfb0bd1936aa74daebc7245` | `art/characters/naruto/raw/ui_ult_bg_v01.png` |
| Naruto / ult_fg | 1 | 1536x1024 | 1873844 | `5ac1a64d3f2423b601b734db2641787fdbf26a65f33aa7260a7ee456eae90324` | `art/characters/naruto/raw/ui_ult_fg_v01.png` |
| Killua / super_bg | 1 | 1536x1024 | 1781681 | `10cc11552c7ccd2f3f7c7bb46819a53311588a100582d2ce5583b516d5183a52` | `art/characters/killua/raw/ui_super_bg_v01.png` |
| Killua / super_fg | 1 | 1983x793 | 973996 | `27aec0604d6625d779324287300bd0eca74a69a7c07870df556a707452fc4270` | `art/characters/killua/raw/ui_super_fg_v01.png` |
| Killua / ult_bg | 1 | 1536x1024 | 1799719 | `9ae622a12c7c8aa8d9410eff67e3ca62d74ae8ab7e7834654bcd9119a1f7ef13` | `art/characters/killua/raw/ui_ult_bg_v01.png` |
| Killua / ult_fg | 1 | 1536x1024 | 1792397 | `b82fee9c426eae21d5047b76ef8efb7ba4a9c666216cbf5dd57ef1c300975a87` | `art/characters/killua/raw/ui_ult_fg_v01.png` |
| Gojo / super_bg | 1 | 2172x724 | 2064196 | `4abe7109eea55ecc9b8106ac1a4eecdf0c7c7f517ad5e74bf9ab54daf17b5bcb` | `art/characters/gojo/raw/ui_super_bg_v01.png` |
| Gojo / super_fg | 1 | 1983x793 | 696801 | `87c627fe59b7584df5f5bedc593926ce6f39145d71adb42e37622902feb5352a` | `art/characters/gojo/raw/ui_super_fg_v01.png` |
| Gojo / ult_bg | 1 | 1536x1024 | 2176625 | `f7d580b436c8b288ad5b0827c1b4aa434618a58736806d98d6964421a73eaf85` | `art/characters/gojo/raw/ui_ult_bg_v01.png` |
| Gojo / ult_fg | 1 | 1536x1024 | 1604215 | `22ec02cb05481a616d556e93603c5e815e155803986ac45373e53d7641625f4f` | `art/characters/gojo/raw/ui_ult_fg_v01.png` |

## Visual and technical notes

- All six foreground files are RGBA PNGs with non-opaque alpha values; the cutouts have transparency.
- The three `super_fg` images came back at 1983x793 for Killua and Gojo and 1536x1024 for Naruto rather than the brief's nominal generation canvas; the ultimate fg outputs are 1536x1024. The generated output dimensions are recorded above; the downstream packer must still fit them to contract size.
- Backdrops returned at varied sizes (including 2172x724 for Gojo super and 1672x941 for Naruto ultimate). Check center crops at final size.
- Visual inspection: Naruto super face is recognizable and has short spikes/headband/whiskers; Naruto Four-Tails has glowing eyes/mouth and four tail-like forms. Killua super/ultimate retain white hair, blue eyes, purple shirt and youthful look. Gojo's cutouts show his white hair, revealed blue eyes and dark high collar. The faces read as the right characters at this preview scale.
- Technical/style hold for reviewer: generation introduced smooth shading, glow/soft edges and fine anti-aliased pixel contours despite hard-pixel instructions. None are certified against the final 2x grid or approved-cell measurements; no Astra audit has been performed. Treat candidates as provisional for independent review and possible within-budget edits.
- No REVIEW.md, manifest, tracker, UI copy, or public shipping output was changed by this generation subtask.
