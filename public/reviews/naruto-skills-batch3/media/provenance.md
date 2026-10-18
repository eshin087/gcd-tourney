# Naruto skills revamp: batch 3 provenance

Date: 2026-10-18. Source brief: `art/characters/naruto/SKILLS_REVAMP.md`, A4/A5.

| asset | calls | selected output and source SHA-256 | filed strip SHA-256 |
|---|---:|---|---|
| `rasenshuriken` v01 | 3/3 | built-in imagegen call 3; `rasenshuriken_v01_generated.png`; `574d97c6bacb7c8c8ef48ee477e82f17b74168e95927b0c32eb7779bb0b54bb4` | `d669ab4dcf4136d117e174b6669f4e944f32ace96eba88ab174d0d7fc5731a19` |
| `rasenshurikenDome` v01 | 1/3 | built-in imagegen call 1; `rasenshurikenDome_v01_generated.png`; `b2900cfbb8e2b66534a47a18edb4de0a2b2c75b548ed4a0973117f603951d364` | `888b13dd3e3d1294535d3f1226fc471bd9235e46ab9136ad65a17aaa04cbd9a9` |

`rasenshuriken` call 1 and call 2 outputs were generated but not retained after tool output capture failed; they are counted against the cumulative three-call budget and were not filed. Call 3 was selected. `rasenshurikenDome` used one call. No user references were attached. Each selected source was center-cropped into eight equal square cells (source canvases 1774x887 and 2172x724), nearest-neighbor resampled to 256x256 per cell, then quantized to its brief's hard-edged blue-white palette; magenta/pink fringe pixels were restored to exact `#FF00FF`. The filed raw strips are 2048x256. The review contacts and GIFs are derived from these strips.

Technical state: visual source review only; no HD effect packer or in-game runtime check was available on this branch. Art awaits user approval.
