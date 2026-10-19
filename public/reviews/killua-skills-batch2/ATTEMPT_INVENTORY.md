# Killua skills revamp batch 2 attempt inventory

Prompt source: `art/characters/killua/SKILLS_REVAMP.md` sections 2-4, B1, A8 and A9. All generation was directed by gpt-6-luna/medium. Budgets are cumulative and no image used more than 3 calls. Paths identify exact generator outputs; hashes were calculated on those exact paths or selected raw copies.

## B1 `specialUp` v09

Prompt: §4 B1, six poses f0 coil, f1 launch, f2-f3 anti-air rise, f4 apex gather, f5 45-degree palm-first dive. Approved `model_sheet.png`, `expressions.png` where needed, `idle_approved.png`, and title-style references attached. No effects in character frames.

| Call | Exact output | SHA-256 | Verdict |
|---:|---|---|---|
| 1 | `E:/Vibe Coding/.codex/generated_images/01a151c7-3ee4-79d1-a422-578cf7f81237/exec-d128586b-ddb5-41b5-9e41-ed71470e42ef.png` | `5F3F9310C03E6E4C74E7FE7E76A43ED1C04A750472F74D2DAE8B82E50D598E40` | Not selected; call 2 read as a clearer six-pose progression |
| 2 | `E:/Vibe Coding/.codex/generated_images/01a151c7-3ee4-79d1-a422-578cf7f81237/exec-fe5b2761-da4e-4a0d-9ab3-43e6c817efc6.png` | `A7164429E3E47300EDDD1FC809FD49F54598DD3E86571643B7CAA180EBC5308F` | Selected unchanged as `art/characters/killua/raw/specialUp_v09.png`; 2172x724, not the requested six square cells. Call 3 showed clearer separators but the same canvas issue. |
| 3 | `E:/Vibe Coding/.codex/generated_images/01a151c7-3ee4-79d1-a422-578cf7f81237/exec-f492d0c1-bd3e-4824-809a-aae4cd1151e8.png` | `CB543F0E2CB295F0042D629DB670E53A2CF33F8289102CBD45A4FB15282CD1C7` | Not selected; explicit 1536x256 request was ignored and output remained 2172x724. |

Packer detects six poses, but `node tools/pack-sprites.mjs killua --quantize 48` fails the head scale gate: f0 1.12x idle vs f5 0.78x idle. No quantized v09 atlas was written. The frames folder/packer sidecar still identifies v08. `npm run body -- killua specialUp` therefore measured the existing v08 data, not v09; it is not v09 evidence. See the Astra hold report.

## A8 `narukamiBolt` v01

Prompt: §2 shared Killua lightning and §3 A8; four vertical tiling bolt cells, 40ms, center anchor. Two calls.

| Call | Exact output | SHA-256 | Verdict |
|---:|---|---|---|
| 1 | `E:/Vibe Coding/.codex/generated_images/01a151c7-4e0c-71f0-bd76-809c9d73fafe/exec-5be12145-5c3e-45e1-b1e0-69ef771de109.png` | `1D67A783A74E68804624D0F6C17EAC030D3E6C6E2568F16AA7CBCD18C9B9EB3F` | Not selected; call 2 better matched the central bolt column and varied side crackle. |
| 2 | `E:/Vibe Coding/.codex/generated_images/01a151c7-4e0c-71f0-bd76-809c9d73fafe/exec-0e06ce44-1ca8-40e9-818d-80d24889ab44.png` | `D944E450397438E4BADBB87EA2AB2365AF6DFAFB9183BC0E7561237D3029A4C5` | Selected unchanged as `art/vfx/raw/narukamiBolt_v01.png`; 2079x756. Packer found 4/4, but exact top/bottom edge comparison differs by 53-57 RGBA channel values per frame. |

## A9 `narukamiStrike` v01

Prompt: §2 shared Killua lightning and §3 A9; eight-frame bottom-anchored floor strike and fade. Three calls used; no further calls in this round.

| Call | Exact output | SHA-256 | Verdict |
|---:|---|---|---|
| 1 | `E:/Vibe Coding/.codex/generated_images/01a151c7-4e0c-71f0-bd76-809c9d73fafe/exec-a9bda78d-4c32-4b45-b0fc-07da7f0387ab.png` | `1900B0EE00663481EA9CA41852A6EE3FB51262ADA1085D25D37B1DAC113DA484` | Not selected; call 2 read better as a sequence. |
| 2 | `E:/Vibe Coding/.codex/generated_images/01a151c7-4e0c-71f0-bd76-809c9d73fafe/exec-89a71f48-114d-4e45-8d42-6694f325aeee.png` | `42BE4D1116822CF98F25F2EE98474452F93B5609CFA84F686C3998B6FFADB1FF` | Selected unchanged as `art/vfx/raw/narukamiStrike_v01.png`; 2172x724. Packer found 7/8 frames and a low floor baseline. |
| 3 | `E:/Vibe Coding/.codex/generated_images/01a151c7-4e0c-71f0-bd76-809c9d73fafe/exec-c8dcf0a9-0622-44c9-ba43-fa54e5ac86a1.png` | `B298D6B67D05A5B484E06983035F729860A0C6494CE9C4172E820460E36F47B5` | Not selected or filed as v02: same 2172x724 layout; floor around 64% of image height rather than y=240/256. No material technical improvement. |

All three VFX sources have near-magenta corner pixels and over 100k source colors (A8 160,831; A9 selected 122,254), exceeding the prompt's exact magenta and <=16-color source requirements. They are preserved unchanged; candidate packer keying/quantization does not erase the source deviation. The A8 and A9 pack report found 4/4 and 7/8 frames respectively. These remain user-review candidates under technical hold.
