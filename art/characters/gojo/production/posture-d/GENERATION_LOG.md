# Gojo posture D generation and technical record

Date: 2026-10-17. Decision relay #13: “D: posture fix (Recommended).” Generator-directing Codex model: GPT-6 Luna, medium. USER APPROVAL via Claude relay gojo-run #14: “hurtHigh: Approve v04 (Recommended). hurtLow: Keep v04 (Recommended). launched: Approve v08 (Recommended).” hurtHigh v04 and launched v08 are approved as drawings; hurtLow v04 remains approved, and v05-v07 are rejected. Technical holds remain; the approved candidates are packed only in this unmerged PR branch.

Scope was limited to `hurtHigh`, `hurtLow`, and `launched`. Identity attachments were the approved `reference/model_sheet.png`, `reference/expressions.png`, and `reference/idle_approved.png`; the D posture direction was `production/proportions/gojo-combat_study-D_v01.png`. Each animation used the inbox’s exact posture target: hurtHigh has bent knees and separated feet in every frame while the upper body snaps back; hurtLow retains the fold and bent knees while widening stance; launched keeps one knee tucked/up and the other leg trailing/split, never a straight pair. Outfit/head/model anatomy stays approved.

Each strip used its cumulative three-call budget. An attempt means one image-generation call; calls that failed to save also count. Hashes are SHA-256 of the preserved returned PNGs under `generation-source/`.

| Strip / call | Returned source | SHA-256 | Selected version | Outcome |
|---|---|---|---|---|
| hurtHigh 1 | Returned image path was not captured at generation time; lost. | unavailable | none | Counted against the 3-call budget. |
| hurtHigh 2 | `generation-source/hurtHigh_v04_attempt02.png` | `679E9CEF34DAF8C2C406ABD544DDE89354E4C7CD5F5375493B099BD85DE7B478` | none | 2172×724 source; retained for provenance only. |
| hurtHigh 3 | `generation-source/hurtHigh_v04_attempt03.png` | `6FD33BCC49C554C5B6B2D307C725519B9B4810089D1B4A3C1807F206BED60796` | `raw/_qa_hold/hurtHigh_v04.png` | Strict pack head ratio 1.23 / feet ratio 1.35 vs idle; technical HOLD. Live v03 unchanged. |
| hurtLow 1 | `generation-source/hurtLow_v05_attempt01.png` | `7CA8AD4BDDAC3A08D142CB57D5EF92F91A682CC92AE327604C7A7BF1F1743305` | `raw/_qa_hold/hurtLow_v05.png` | Pack head 1.20 / feet 1.04; technical HOLD. |
| hurtLow 2 | `generation-source/hurtLow_v05_attempt02.png` | `65E23994E9D47910CADAEB4CD1134CF8A163AD1B5464E187DFBACFE6581C1B34` | `raw/_qa_hold/hurtLow_v06.png` | Pack head 0.90 / feet 1.03; technical HOLD. |
| hurtLow 3 | `generation-source/hurtLow_v05_attempt03.png` | `5D7F3FCA36C79F18117866C534A58CC8900901CC07D72B95461F06685FA500EE` | `raw/_qa_hold/hurtLow_v07.png` | Pack head 1.19 / feet 0.98; technical HOLD. Budget exhausted. Live v04 unchanged. |
| launched 1 | `generation-source/launched_v07_attempt01.png` | `DE821C5844FA32E531AC9C92E2CCF913D1422D3FB93D30699070AEC6D46079A0` | none | Kept only in the attempt-source record. |
| launched 2 | `generation-source/launched_v07_attempt02.png` | `740935A4E76418E52368B6A4A1911DF69AE8197E777DECF9B73ECCDDAFFEE918` | `raw/_qa_hold/launched_v07.png` | D knee split present; Astra found torso ~59–61±5px against neutral ~78±4px; head/limb segments uncertain. HOLD. |
| launched 3 | `generation-source/launched_v07_attempt03.png` | `8EC2242DA411EF38AFB3A77F2557FDF9D422527334793E6F3FA6A36CDBBD92E4` | `raw/_qa_hold/launched_v08.png` | D split-knee pose present. Astra estimated collar-to-hem 66±4px against neutral 78±4px (about 0.85); head/limbs not certifiable within ±6%. HOLD. Budget exhausted. Live v06 unchanged. |

The full final pre-pack anatomy audit, images, connected-component measurements, source hashes and uncertainty are in [ASTRA_PREPACK.md](ASTRA_PREPACK.md). In v08, figures touch/overlap by x-coordinate but are separate components; the packer split them into 3 then kept 2. No scaleManualQA pass or exemption is added. After the user decision, hurtHigh v04 and launched v08 are approved as drawings and moved to active raw; hurtLow v05-v07 and launched v07 are rejected under `_rejected/`. The approved candidates are packed only in this unmerged PR branch; technical holds remain.

### User approval via Claude relay #14

USER APPROVAL via Claude relay gojo-run #14: “hurtHigh: Approve v04 (Recommended). hurtLow: Keep v04 (Recommended). launched: Approve v08 (Recommended).”

Approved as drawings: hurtHigh v04 and launched v08. Kept: hurtLow v04. Rejected files moved to raw/_rejected/: hurtLow v05/v06/v07 and launched v07. Technical holds remain; approval does not certify scale, anatomy or runtime contacts. Pack and PR guard outcomes are recorded in the branch handoff.

### Final-call launched prompt

```text
Use case: stylized-concept
Asset type: two-frame hi-res pixel-art sprite strip for a browser anime arena fighter.
Input images: model_sheet.png, expressions.png and idle_approved.png are the approved identity/anatomy/scale references; launched_v07.png is the candidate to correct (preserve the stronger tucked-knee / trailing-leg pose); gojo-combat_study-D_v01.png is the user-selected D posture direction reference for knee bend and leg split.
Primary request: Create a corrected launched reaction strip matching the approved Gojo identity and body proportions exactly. Pose-only change; do not redesign or resize the approved anatomy. Correct the undersized torso in the attached candidate by matching the collar-to-hem and head/torso scale of the approved idle reference. Keep the collar-to-hem torso volume and length consistent with idle; preserve adult slim shoulder, arm, leg and clothing proportions. Maintain the D pose: body arched diagonally backward, flying toward screen-left; one knee tucked/up, the other leg trailing and split forward to screen-right; legs clearly bent, never a straight paired-leg shape. Both frames keep this tucked/split-leg read. Keep the same outfit, face, hair, blindfold and palette. The silhouette must fit the declared cells without enlarging or shrinking the character to fill them.
Animation: exactly 2 distinct frames, looping. Frame 0: diagonal backward flight pose, belly arched upward, hips around the middle/lower part of the silhouette, head/shoulders upper-left, one knee raised/tucked, opposite leg trailing to screen-right at hip height or slightly higher, arms bent and flung up/back. Frame 1: a small alternate limb pose, preserving the same body/head/torso scale and the same one-knee-up / one-trailing-leg split; slight elbow/leg changes only.
Layout: one horizontal row, exactly 2 equal slots, one complete figure per slot, centered and separated by clear magenta space; canvas 1536x1024. Each source panel is 768x1024 and is normalized to a 256x256 game cell by the project packer. Keep identical figure scale in both panels; do not let limbs cross between slots.
View: facing screen-right in 3/4 view, same as approved references.
Style: crisp hard-edged high-resolution pixel art, hard pixels, no anti-aliasing, blur, gradients, dithering, glow, noise, shadow, floor, text, numbers, labels, borders, extra characters or effects. Solid #FF00FF background. Preserve the same black blindfold, white hair, dark navy jacket and trousers, black shoes, face and color family from the approved references.
```

### Packing and comparison evidence

`node tools/pack-sprites.mjs gojo --quantize 48` after holding v04/v05-v07/v07-v08 completed with 44 animations, 181 frames, 48 colors, and wrote the atlas. It selected only old approved hurtHigh v03, hurtLow v04 and launched v06. Therefore this is a successful unchanged-live pack, not a packed or audited candidate result. The earlier pack attempt with launched v08 active failed the low-confidence pose gate and did not write the atlas.

`npm run body -- gojo` wrote `art/scale/body-gojo.png` and report. It measured current approved hurtLow v04 B 0.81, H 1.02; held candidate files are skipped. `npm run lineup` wrote `art/scale/lineup.png`: Gojo row uses down, so it is context, not posture-candidate QA; reports 43/43 Gojo heads ok or not judged. `npm run scale -- gojo` wrote `art/scale/heads-gojo.png`; the current active pack has 1 reference, 35 automatic pass, 8 manual. The full current approved atlas has unrelated existing body/lineup warnings; see generated reports. No held candidate has an atlas measurement.
