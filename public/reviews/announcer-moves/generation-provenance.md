# Announcer moves generation provenance

Batch: `npc-announcer-r1` (ENG-118), branch `art/announcer-moves`, base `3edc0d61`.

Initial v01 strips were generated with the built-in imagegen tool using their A5–A8 blocks from `art/npc/announcer/PROMPTS.md`; those calls attached only approved `reference/model_sheet.png` (SHA-256 `26E2E1BBFFB545AC25013C4E22D0D4AEB2C059DB43DA33943370008DDFDD2098`) and `reference/idle_approved.png` (SHA-256 `275B87EE9568AECF9CFFD335807EEC8CE6761AFFBC1FAF6DEF4FDFE5993C9B98`). Correction calls also attached the prior version being corrected as allowed by the retry/fix workflow. The generated raw canvas is 1536×1024 with flat magenta; the packer extracted the specified frames and quantized them into the 128×128 NPC atlas.

| Asset | Selected output | Prompt | Selected call | SHA-256 of saved raw |
|---|---|---|---|---|
| walk | `art/npc/announcer/raw/walk_v01.png` | A5 (`walk`) | Call 2; the first wrapper invocation did not preserve its returned image data, so its output was not saved or used. | `E86BA86DD253296AAD097E88A8B74D468F3C377B3A1B1543FA2C1B2EE28EB786` |
| run | `art/npc/announcer/raw/run_v01.png` | A6 (`run`) | Call 1 | `38DAA594AB0C2266B45832C6D85EFEC98864D141C62A90B82209F3AAE2BFA662` |
| shocked | `art/npc/announcer/raw/shocked_v01.png` | A7 (`shocked`) | Call 1 | `13357BEF082C8116182E69D9B6BFF64FA8D882ED27D7A65EDAB9B3375C221452` |
| micThrust | `art/npc/announcer/raw/micThrust_v01.png` | A8 (`micThrust`) | Call 1 | `FADFBD54990F6BBD6A5940DEBD90330139BE883B5DC1C45EB282466284C2F3A7` |

Prompt-block SHA-256 values (UTF-8): A5 `dae16168ff48413f699be21411ec5f3e16543f45d793533c8393af0d5c8fa163`; A6 `00699d7d20d4061e3a508693e92ac93b00e810bf47046bb02ebe38c17a360a41`; A7 `f16f9bcc3b5cf1e6cdeffcb53ce78a0addc2f598604c4f25ef5bc266805c217c`; A8 `e1c8352ca867096fce136a37be17245d94186b96dad9e0339baf99e3bdad56e2`.

## Correction round: v02/v03 candidates

The four correction strips were generated as separate imagegen calls, each from its matching A5–A8 prompt plus corrective constraints, with only the same two approved references listed above. Cumulative budgets count every imagegen call, including the v01 calls. The original wrapper failure for walk was one of the three calls. The call history is:

### Round 1 selection snapshot (historical; superseded below)

| Asset | Saved correction versions | Cumulative imagegen calls at this checkpoint | Selected by candidate packer at this checkpoint | SHA-256 |
|---|---|---:|---|---|
| walk | `walk_v02.png` | 3/3 | v02 | `4C7D4714BB139269866ACAED5B9DA459C67339FF33CE5CDE02C898B58FDEB7CF` |
| run | `run_v02.png`, `run_v03.png` | 3/3 | v03 | v02 `7F7F1F6D3B1F53DF263997850259A3FE846A572EA52A04641D9F1DAE70417FB4`; v03 `A7DEEF5C7C93C182F61BD94E19FBBDF73315168F2B30FFD0E1CA5B880FE1AFD6` |
| shocked | `shocked_v02.png` | 2/3 | v02 | `D6C16146D85095FBF2EBE3D7AB3AE3C7577BAD121C9EAC4ABF35AA3970998AC8` |
| micThrust | `micThrust_v02.png` | 2/3 | v02 | `820E25F5F67E63F48BAA3CA37FCCFD6843BC6D42B68179E70100D69AEC81471B` |

Run v03 consumed its last remaining A6 call after inspecting v02, which still had repeated leg silhouettes and visible horizontal hair drift. Walk v02 used its final A5 call. No additional calls are authorized or available for either asset. Call totals are the recorded generation ledger; the imagegen interface did not expose provider call IDs. All v01 raw files remain unchanged; their version names are listed in the phone review page, and the v01 packed atlas remains playable there.

Correction round 1 findings: walk v02 still repeats f0/f2 contact and f1/f3 passing silhouettes (technical hold); run v03 still has major horizontal/pose movement (technical hold). Astra audit then found a 9 px shoe-contour discrepancy in shocked v02 despite matching extents, and a swapped-hands defect in micThrust v02. Those findings triggered one final allowed correction call for each asset; both cumulative budgets are now exhausted at 3/3.

`node tools/pack-sprites.mjs npc --candidates` final pack exited 0 and selected walk v02, run v03, shocked v03, micThrust v03. Packer reported 32 colors for announcer; the full NPC pack reported zero warnings. The exported atlas `packed-latest-v03.png` independently contains 31 unique opaque RGB values (alpha > 0), SHA-256 `7D0961E3615E7772729F366A7568654E4C22994432E9232744DD3311C1092761`. Both counts are recorded as separate measurements; no art changed. Historical atlases: `packed-latest-v02-v03.png` and `packed-candidate.png`.

| Asset | Final correction | Cumulative calls | Generator saved output | SHA-256 | Current pack selection |
|---|---|---:|---|---|---|
| shocked | `shocked_v03.png`; attached approved model sheet, approved idle, and `shocked_v02.png`; targeted identical shoe contours while preserving the subtle recoil | 3/3 | `exec-f410c70c-4ca2-4949-a1f0-f9f825e9d82d.png` | `70BDA09E6DECBFE062C41D1E466AA296DDC6455452D4F421FB8EE08E487D2E5E` | v03 |
| micThrust | `micThrust_v03.png`; attached approved model sheet, approved idle, and `micThrust_v02.png`; targeted right-hand mic arm crossing from image-left shoulder and left hand at ear, with fixed idle feet | 3/3 | `exec-a2220916-ea83-4f9b-b68c-cbc3f9fc0367.png` | `3DFA195BA7CC11D510AB7D4AFFCFC7D928CD0E033EECBF39DEA7120DEDA62397` | v03 |

Astra final audit (2026-10-19) holds all four current candidates: walk v02 repeats same-leg phases; foot extent x88–89 exceeds x86. Run v03 repeats same-leg phases; hair shifts about 13–16 px and f2 foot extent x31–96 exceeds x34–94. Shocked v03 has a 13-pixel shoe-contour mask discrepancy, with extents x38–90 vs x39–90. MicThrust v03 still has wrong hands (left holds mic, right cups ear) and feet differ from approved idle. All cumulative budgets are exhausted at 3/3. No art is approved.