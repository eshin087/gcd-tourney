# Luffy relay8 final strict atlas audit

Astra, 2026-10-16. **PASS within measurement uncertainty for all 22 selected animations / 100 actual quantized frames.** Down v03 and getup v03 correct the earlier density/assembly holds. Special remains HOLD and absent. This is technical anatomy/scale evidence, not user design approval or runtime contact certification.

## Exact audited output

- Sheet: `production/relay8-generation/strict-r5/output/characters/luffy/sheet.png`, SHA256 `0fc2f4a87b9c01991271209c04df2ee3913799ad626a9cd2a68d0f91fb54d122`.
- Metadata: same directory `anims.json`, SHA256 `dc679a50fe5a7536c76be12272da040a36495a105dda6e3028d7abf96777598f`.
- Normal strict pack: exit 0; 22 animations, 100 cells, 48 opaque RGB colors. Down03 bodyHeight106 and getup03 bodyHeight209 pack at x1. Input snapshots and pack report are in `relay8-generation/strict-r5/`.
- `FINAL_PIXEL_HASHES.json` binds each exact extracted cell, index, timing and loop flag. `final-cells/*-contact.png` are native-density exact atlas copies, visually inspected in full. Retained 93 cells have zero alpha-byte differences against baseline sheet `563832d5fc499f860a5a35e21f8e576c3885b4e1a9c76bd7173807187707a996`; seven new cells have null baseline comparisons. RGB changed with shared quantization and was independently rechecked, not inferred from masks.

## Per-strip outcome

| Animation/version | Frames | Anatomy/scale |
|---|---:|---|
| idle01 | 8 | PASS reference retained |
| run01 | 8 | PASS; existing accepted rear-foot clips |
| dash02 | 2 | PASS |
| jumpUp01 | 2 | PASS |
| jumpFall03 | 2 | PASS |
| land01 | 2 | PASS |
| light1 v02 | 7 | PASS |
| light2 v01 | 7 | PASS |
| light3 v02 | 7 | PASS; existing accepted toe clip |
| light4 v02 | 8 | PASS; existing accepted foot clip |
| heavy01 | 8 | PASS |
| airLight1 v01 | 5 | PASS; existing accepted fist clips |
| airHeavy01 | 6 | PASS |
| guard01 | 2 | PASS |
| hurtHigh01 | 3 | PASS |
| launched02 | 2 | PASS |
| down03 | 2 | PASS, repaired density |
| getup03 | 5 | PASS, complete component assembly |
| charge01 | 4 | PASS; intended GearSecond tint |
| beamCharge01 | 3 | PASS; intended growing fist |
| beamFire02 | 3 | PASS body; Claude's arm-continuation exception retained |
| win03 | 4 | PASS |
| special01 | absent | HOLD; no new output from failed fourth call |

## Anatomy and uncertainty

Compared final cells to approved title neutral/combat and idle at one density. Reference native neckline-to-sash 41.5 +/-6, shin52.8 +/-6, forearm32.3 +/-6 pixels; endpoints and independent source overlays are in INITIAL_MEASUREMENTS.json and V03_CANDIDATE_AUDIT.md. Projection and occlusion are explicit limitations; hidden joints receive no invented numeric pass. Hat/posed bounding box is not a body-scale certificate.

Down03 f1 visible torso37.8 +/-5 and shin51.7 +/-5 remain supported after final shared quantization; f0 preserved shin48.2 +/-5. Face, neck, arm breadth, vest/short volume and complete sandals remain coherent with the reclining angle and reference. The corrected source factor .205 is independently supported by torso and shin; it was not derived from hat width. Getup03 uses uniform source factor .477: f4 torso42.2 +/-6, left/right shins55.5/48.9 +/-6, forearm30.5 +/-6. Face/head/build/clothing remain consistent across all five complete figures. See candidate report for endpoint coordinates and source hashes; final palette leaves those visible boundaries readable.

All retained frames were visually rechecked for head/face readability, torso contour, visible limb chains, build, clothing volume and sandals. Shared colors preserve skin/vest/short/sash separation, dark joint outlines and support silhouettes. No new segmentation loss or systematic anatomy-size drift was found. Old accepted clipping is unchanged, not newly excused by this audit.

## Static sequence / seam review

Reviewed consecutive poses and last-to-first relationships for every looping row, plus one-shot recovery poses. Idle/guard breathing and run/dash gait remain coherent; jump loops and launched tilt preserve the same body. Attack retractions return to coherent guards. Down transitions from braced collapse to supported side-lying; getup progresses side-lying, elbow support, hands/knees, low kneel and guard. Down-to-getup is a pose change with coherent density; exact runtime registration remains a contact check. Charge and beam loops intentionally contain tint/growing-fist or release/reset changes; their visible resets are retained move behavior, not evidence of a scale defect.

This is a static all-frame and sequence/seam inspection with metadata timings recorded. No timed playback, gameplay grounding, hitbox/contact-zone or engine giant-fist continuity claim is made. Existing user-accepted run f3/f4/f7, airLight1 f2/f3, light3 f3 and light4 f4 placement exceptions remain; beamFire f1/f2 arm-only continuation remains Claude's runtime responsibility.

## Handoff

The exact isolated strict output is now technically audited. Public adoption is valid only if its sheet and metadata match these hashes; any changed pixels require recheck. User image approval is still pending for down03/getup03. Special call4 failed validation before output (six refs exceeded five), counted4/4; no retry or special v02 exists. Parent owns preview publication, approval-desk routing and one goku-luffy handoff ring. Auditor changed evidence only. Main AGENTS/inbox and relay state rechecked: goku-luffy is Codex turn with watcher on; no ring sent by this subagent.
