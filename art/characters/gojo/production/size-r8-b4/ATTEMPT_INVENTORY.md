# ART-SIZE-R8 B4 — Gojo airLight1 attempt inventory

User decision (Claude relay audit2 #6): v10 was not selected. The user authorized three more image calls to correct the compact torso, targeting collar-to-hem about 80 px, shoulders about 73 px, and full leg lengths at the same density as idle f0 and the approved neutral/combat cells. Keep the five-frame palm-jab phases, timing, and strike frame. If none passes, retain approved v07. Calls 4-6 used the complete additional budget; no replacement was selected, so v07 remains current.

Target: `airLight1` v11, redrawn to match Gojo's approved idle/jumpFall body scale while preserving the five-frame mid-air palm-jab action and `[1,2,2]` phases. Do not alter `bodyHeight`, `packScale`, or gameplay timing.

References attached: approved `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`; prior `airLight1_v07.png` for pose order only. The previous candidate is not an identity or body-size target.

## Generation call inventory

| Call | Returned image path | SHA-256 | Filed path | Selection |
|---:|---|---|---|---|
| 1 | `E:/Vibe Coding/.codex/generated_images/01a1bdc7-7f63-74b0-aa73-a9f06981795a/exec-052a81e7-00c6-4e32-b6d9-88013a4799e3.png` | `1E369BBCC8BD5BD473881D86DB8DC2D8F5BB950C5B75EABAA942D1F6BED4E35B` | `raw/_rejected/airLight1_v08.png` | Not selected after packed QA: head median `.97`, body median `.75`; collar-to-hem and leg lengths remain visibly undersized beside idle/jumpFall. |
| 2 | `E:/Vibe Coding/.codex/generated_images/01a1bdc7-7f63-74b0-aa73-a9f06981795a/exec-b6ce5fcd-b412-47ef-ab1d-1e74a1137f26.png` | `F443EFECEF1C962390783002EE0AB08231CB5F9DC73C19FEA42CA405C01F8A77` | `raw/_rejected/airLight1_v09.png` | Not selected after strict pack: head probe `.86` of idle, outside the scale gate; public pack was not written. |
| 3 | `E:/Vibe Coding/.codex/generated_images/01a1bdc7-7f63-74b0-aa73-a9f06981795a/exec-7a4528bb-f9f8-47a1-8467-0990a63b1eaf.png` | `A2D3074D6CD83C99950B10DCF46AD3280D5BB097EEE525623AC96B0AF5039610` | `raw/airLight1_v10.png` | Selected for final evaluation: enlarged only the head over the longer body and preserved all five jab poses. |
| 4 | `E:/Vibe Coding/.codex/generated_images/01a1bdc7-7f63-74b0-aa73-a9f06981795a/exec-e4a42867-ba61-4457-b7b9-d64914749823.png` | `9336B2B52E39F86BBEA638A0C23328A6D14F9AA4D44C9C55E1F61B90A5F7CD9F` | `attempts/airLight1_call04.png` | Not selected: strict head gate measured `.79` of idle; no pack written. |
| 5 | `E:/Vibe Coding/.codex/generated_images/01a1bdc7-7f63-74b0-aa73-a9f06981795a/exec-2c7213f1-aa5d-4dd3-bf8a-6a21f8cdad79.png` | `0AB95537F9423CA332B764A203BAE672FAB51BB09607E639F6F047F5B26E8A0D` | `attempts/airLight1_call05.png` | Not selected: strict head gate passed; packed body proxy was `.71` (frames `.70,.74,.74,.71,.71`) and the torso remained visibly short. |
| 6 | `E:/Vibe Coding/.codex/generated_images/01a1bdc7-7f63-74b0-aa73-a9f06981795a/exec-d3428ee0-9096-4233-b94b-7106571cc40c.png` | `6955B6BD1EC6EFF714D2609199DAF88D48F08D7DBB7F9E0F6A2FBB194811BD4F` | `attempts/airLight1_call06.png` | Not selected: strict head gate measured `.83` of idle with feet `1.11`; the packer did not write the candidate. |

Prompt summaries: call 1 asked for the approved identity, compact head, body build and five-pose jab; body QA found it still too small. Call 2 used idle and approved jumpFall as body authority, specified a 35x22 head, approximately 76-80 px collar-to-hem and 70-73 px shoulder span; strict pack found head `.86`. Call 3 targets the approved head at about 35x22 over the longer body from call 2, preserving the five jab poses. Calls 4-6 used the exact user targets and the approved idle, neutral, combat, and prior pose references; call 5 still measured `.71` body proxy, while call 6 missed the strict head gate.

## Packed evidence

Final B2-B7 quantized atlas SHA-256: `178D87FE22DD9DA6FBEB6B878F60FE0F1A8498F4ECCCF50B70AFA4B0A2F78E80`. Candidate v10 is present for visual review but remains on technical hold for its small body proxy.

Call 1 packed evidence: head median `.97`; body median `.75` (`SMALL`); rejected. Call 2 strict pack: head `.86` (`head/hair drift`), not written; rejected. Call 3 (`airLight1` v10): strict pack passes; head median `1.00`; body median `.77` (`SMALL`, per-frame `.76,.79,.79,.76,.77`). Packed contact sheet compared against approved `jumpFall` still shows the torso compact; hold for body scale despite the head pass. Active palm pixels on f1/f2: x211-223, y69-88; `hitboxes.json` v10 boxes set to `[209,67,17,23]` on both frames with `_scale: 1`.

Call 4 strict pack: head `.79`, not written. Call 5 strict pack: passes the head gate; body-sheet proxy `.71`, not a body-scale pass. Call 6 strict pack: head `.83`, feet `1.11`, not written. The body-sheet command after call 6 read the last successful packed output from call 5 because strict failure did not replace the scratch atlas; its `.71` report belongs to call 5 and is not evidence for call 6. None of calls 4-6 met both the head gate and the user-requested body size. No v11 was saved to production raw; v10 was moved to `raw/_rejected/` after the user's decision, and approved v07 remains the current B4 strip.
