# ART-NPC-ANN-R2 generation provenance

Date: 2026-10-18. Branch: `art/announcer-alive`, based on `feature/announcer-alive` at `2ca1fc7e`. All outputs were generated with the built-in image generator in one image thread, using the signed-off announcer model sheet and approved idle as identity references. Each selected output is a 1536×1024 PNG saved unchanged as its versioned raw source; Luna verified that each saved source copy matches its generation output by SHA-256.

Each image has a three-call maximum. Cheer, blownAway and sooty used all three calls; the other seven used one call each. Discarded attempts were not filed. The packer creates a 32-color atlas with zero warnings and removes isolated specks from sooty.

| Prompt | Asset | Selected call | Attempts | Saved raw source | SHA-256 |
|---|---|---|---:|---|---|
| A9 | blownAway v01 | `exec-664cb950-c39c-4a9b-861b-76c927ad9935` | 1/3 | [`blownAway_v01.png`](../../../art/npc/announcer/raw/blownAway_v01.png) | `05F75E954A4D40EB63DA6554A39CDB30B03916FD3E58A9ACAAACD7E3576C5FA8` |
| A10 | popUp v01 | `exec-5665a31c-7b4a-4cdb-8f83-9d49d1d1cb56` | 1/3 | [`popUp_v01.png`](../../../art/npc/announcer/raw/popUp_v01.png) | `975888B5D239612242782A8813407A5F2B1DE961D306D17146618981D54E2DED` |
| A11 | cheer v01 | `exec-a068052e-f9ec-45c3-9c5d-9523f2080adf` | 3/3 | [`cheer_v01.png`](../../../art/npc/announcer/raw/cheer_v01.png) | `2956631B6F9A7A69E82B05AFFF8BFA83D3078E866A99ED0694563237B87E9D19` |
| A12 | facepalm v01 | `exec-9c81a646-cc57-4044-a357-1d08f9127032` | 1/3 | [`facepalm_v01.png`](../../../art/npc/announcer/raw/facepalm_v01.png) | `E0D1319377C6209889561AFEE9683B007407081EBA307C88E29F836A72772A38` |
| A13 | micTap v01 | `exec-584b7ac8-51ad-489b-bbef-e4a4d334765e` | 1/3 | [`micTap_v01.png`](../../../art/npc/announcer/raw/micTap_v01.png) | `80DAC2610A3818DF2DAB0D1C3FF551EB61E9430BCCB7B7B6074968B7D2B98098` |
| A14 | checkWatch v01 | `exec-c17f454f-352d-4224-96ad-fa4e14a34426` | 1/3 | [`checkWatch_v01.png`](../../../art/npc/announcer/raw/checkWatch_v01.png) | `737AA15B8B5E3EE68F369C25632EF63F4E21BC938E7AB61B2BE0F37B35F2A4E6` |
| A15 | patHair v01 | `exec-a45de236-ec6e-418d-bb80-dcbae8996a92` | 1/3 | [`patHair_v01.png`](../../../art/npc/announcer/raw/patHair_v01.png) | `F41B4D1D70A0B34119E0B0144CF5F6E81144C303B361A5AC7A425D1E27373164` |
| A16 | sooty v01 | `exec-47eedad4-f195-4f0f-a67c-9894d12fd5ec` | 1/3 | [`sooty_v01.png`](../../../art/npc/announcer/raw/sooty_v01.png) | `C96B74AC784AAC9EBA9CD640AC59AA515FEEF8F2F60468BCECC4400BE697487F` |
| A17 | wince v01 | `exec-675b8b0d-8325-4c53-8279-6ea9c7d42e9b` | 1/3 | [`wince_v01.png`](../../../art/npc/announcer/raw/wince_v01.png) | `DDA97689C8A3764E28743DF54842FC05941EAF766A59ACA49C1B9EEBFB41364E` |
| A18 | mopBrow v01 | `exec-82f8a0c2-89da-46ac-a771-1608f8dcf53b` | 1/3 | [`mopBrow_v01.png`](../../../art/npc/announcer/raw/mopBrow_v01.png) | `C969E4BAD602C0E7EE0C6891E7D3CE9F7AAC49285FFB829A4800834A5B0032D4` |

| Prompt | Asset | Selected call | Attempts | Saved raw source | SHA-256 |
|---|---|---|---:|---|---|
| A9 | blownAway v02 | `exec-126ab91b-4b76-42cb-97ef-38b3bc6749d1` | 2/3 | [`blownAway_v02.png`](../../../art/npc/announcer/raw/blownAway_v02.png) | `89E71A93206587207A75B6761F968489A9AC8EC6203A18DEC9D861BA1368D8B1` |
| A9 | blownAway v03 | `exec-863dffc3-a304-4acd-83dd-16d05566aa88` | 3/3 | [`blownAway_v03.png`](../../../art/npc/announcer/raw/blownAway_v03.png) | `A81EBE81AA7D14D70716E8EE881B48BF3524AB9510BEA93612AEB6963B2EEFDD` |
| A16 | sooty v02 | `exec-28070dd9-6a06-4f1e-9a3f-8c5b775b516c` | 2/3 | [`sooty_v02.png`](../../../art/npc/announcer/raw/sooty_v02.png) | `FD9B82D9035D9E241F9636D6B559B0EF792138B8FD471A8CAECB7FB2DA9F7B79` |
| A16 | sooty v03 | `exec-007eb3e4-629c-4878-badd-24c4df075a33` | 3/3 | [`sooty_v03.png`](../../../art/npc/announcer/raw/sooty_v03.png) | `46FCE59BABE16D09C312B8C0EC1A700001C4169B32BBFE8EE8A2538AAC418593` |

## Capture notes

- All ten strips contain two frames, left to right. `blownAway` (140 ms then 900 ms) and `popUp` (380 ms then 600 ms) are one-shots with the second frame held; the other eight are loops at the timings in `ANIMATIONS.md`.
- No text, speech bubbles, manga marks, motion lines, or dust were added. Sooty has two small smoke wisps per frame; mopBrow has one small blue sweat drop in its first frame.
- Cheer attempts 1 and 2 were discarded for a gold belt buckle and baseline/pose concerns; selected call 3 is the only saved candidate. BlownAway and sooty each retain all three saved versions; no raw version was overwritten.
- The current candidate atlas uses blownAway v03 and sooty v03; the separate sooty-v02 comparison atlas is SHA-256 `4294A1CF3231DFE1BDC50704775A579641593EA091BA33276EEA45FCCFE4DC29`. Current atlas SHA-256 is `485FB937538609DF16C02996FE9F9EB1255A35E154E85BB19E99E0C18DC71D2`.
- Astra audited all 20 frames in the quantized atlas. Eight strips pass; blownAway v03 is held for pose/scale (f1 61 px vs ~56 target, bent knees, enlarged shoes/head), and sooty v03 is held for scale (~105 px hair-to-floor vs idle 112). Sooty v02 measured ~110/108 px and is the more scale-consistent alternative, but its pale lower face and weaker soot/cough readability remain held. Hidden landmarks have ±2–3 px uncertainty; this is not a gameplay-contact or numeric ±6% certification. See the phone review for bounds and visual comparison. No user approval is implied.
