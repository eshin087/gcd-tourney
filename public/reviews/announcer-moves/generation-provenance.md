# Announcer moves generation provenance

Batch: `npc-announcer-r1` (ENG-118), branch `art/announcer-moves`, base `3edc0d61`.

Each selected strip was generated with the built-in imagegen tool using its matching A5–A8 prompt block from `art/npc/announcer/PROMPTS.md`. Every call attached exactly the approved `reference/model_sheet.png` (SHA-256 `26E2E1BBFFB545AC25013C4E22D0D4AEB2C059DB43DA33943370008DDFDD2098`) and `reference/idle_approved.png` (SHA-256 `275B87EE9568AECF9CFFD335807EEC8CE6761AFFBC1FAF6DEF4FDFE5993C9B98`). No other image inputs were attached. The generated raw canvas is 1536×1024 with flat magenta; the packer extracted the specified frames and quantized them into the 128×128 NPC atlas.

| Asset | Selected output | Prompt | Selected call | SHA-256 of saved raw |
|---|---|---|---|---|
| walk | `art/npc/announcer/raw/walk_v01.png` | A5 (`walk`) | Call 2; the first wrapper invocation did not preserve its returned image data, so its output was not saved or used. | `E86BA86DD253296AAD097E88A8B74D468F3C377B3A1B1543FA2C1B2EE28EB786` |
| run | `art/npc/announcer/raw/run_v01.png` | A6 (`run`) | Call 1 | `38DAA594AB0C2266B45832C6D85EFEC98864D141C62A90B82209F3AAE2BFA662` |
| shocked | `art/npc/announcer/raw/shocked_v01.png` | A7 (`shocked`) | Call 1 | `13357BEF082C8116182E69D9B6BFF64FA8D882ED27D7A65EDAB9B3375C221452` |
| micThrust | `art/npc/announcer/raw/micThrust_v01.png` | A8 (`micThrust`) | Call 1 | `FADFBD54990F6BBD6A5940DEBD90330139BE883B5DC1C45EB282466284C2F3A7` |

Prompt-block SHA-256 values (UTF-8): A5 `dae16168ff48413f699be21411ec5f3e16543f45d793533c8393af0d5c8fa163`; A6 `00699d7d20d4061e3a508693e92ac93b00e810bf47046bb02ebe38c17a360a41`; A7 `f16f9bcc3b5cf1e6cdeffcb53ce78a0addc2f598604c4f25ef5bc266805c217c`; A8 `e1c8352ca867096fce136a37be17245d94186b96dad9e0339baf99e3bdad56e2`.

Technical evidence: `node tools/pack-sprites.mjs npc --candidates` exited 0, packed all four candidates, reported 32 colors and zero warnings. The final Astra anatomy/scale audit and user art approval are still pending. The two `shocked` frames are visually almost identical and need explicit reviewer attention.
