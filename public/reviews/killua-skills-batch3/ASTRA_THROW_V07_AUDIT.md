# Astra audit — Killua B2 throw_v07

Date: 2026-10-18. Task: ART-SKL-KIL, skills revamp Batch 3.
Reviewer: GPT-6 Astra, medium. Worktree: `.worktrees/art-killua-skills`, branch `art/killua-skills`.

**Verdict: HOLD. Provisional raw-image review only. No final quantized-atlas audit or numeric anatomy/scale pass is possible on the available v07 evidence. This is not an art approval decision.**

## Evidence and provenance

Visually inspected:
- `art/characters/killua/raw/throw_v07.png` (2172 x 724 source, four poses left to right; f0-f3 below).
- `public/art-review/title-style-pilot/killua-neutral_v01.png` and `killua-combat_v01.png` (exact approved title-style cells).
- `art/characters/killua/reference/idle_approved.png` (approved working idle).

Read ADR 0029, `art/scale/title-style-pilot/PRODUCTION_CONTRACT.md`, `art/characters/killua/SKILLS_REVAMP.md` B2 and `production/skills-revamp-batch3/B2-attempt-inventory.md`. The inventory identifies selected call 3, SHA-256 `5FC8FE030AC007555751D86D0F4A2D23BBE9F62B164AF7D91B4E8A9A1BBE3A96`, with all three generation calls consumed. That hash is inventory provenance, not an independently recomputed hash in this audit.

The coordinating agent supplied the actual pack-command findings: `node tools/pack-sprites.mjs killua --quantize 48` failed; throw v07 imported at x0.309, reported head 1.28 of idle and feet 1.49 of idle, and frame #1 clipped 17 px on the right. Nothing was written to the character atlas or frame outputs. These values are attributed pack-report findings, not independent manual anatomy measurements. The report text was supplied through the task handoff; no saved Batch 3 pack-log file was available in the inspected production directory.

`npm run body -- killua throw` read the existing v06 frames (reported B 0.86 / H 0.98). That output is stale for this candidate and cannot certify throw_v07. No v07 packed-frame or loop result is inferred from it.

## Provisional frame findings

| Frame | Raw-image finding | Result |
|---|---|---|
| f0 wind-up | Steel disc with rim/hub is visible in the raised hand beside the head, and the opposite hand reaches forward. The prop reads as a yo-yo and appears only here. Legs are airborne and asymmetrically folded: the forward knee rises toward the torso; the other knee drops lower. This is a readable coil, but not a close bilateral tuck. | Prop read acceptable provisionally; final size, hand attachment and tuck require packed inspection. |
| f1 snap | The arm pointing forward in f0 appears to continue into the down-forward extended arm. The f0 prop-bearing arm instead appears to become the trailing fist. This suggests the wrong arm executes the throw. The extended hand reads predominantly as a splayed open palm; a distinct crooked middle finger and a reliable string-loop location are not established. The down-forward reach is readable. One knee trails while the other folds back. | HOLD for apparent arm-role discontinuity and ambiguous middle-finger anchor. |
| f2 follow-through | The same leading arm stays extended; its hand curls palm-up toward a tug gesture. This reads as a pull, but retains the f1 arm-role concern. Both legs swing forward, with broad visible shoe/sole surfaces. Knee bends are plausible at raw scale, but shorts conceal hip and upper-thigh landmarks. | HOLD pending arm continuity and quantitative limb/foot review in final cells. |
| f3 catch | Both knees tuck and both shoes remain separately readable. One hand reaches forward while the other opens near the upper chest. The chest hand could serve the intended returning catch, but the preceding arm assignment makes its continuity ambiguous. No yo-yo is painted here, consistent with an engine-rendered returning prop. | Catch intent readable; exact R middle-finger anchor and motion continuity remain unverified. |

Anatomical right/left cannot be certified solely by this three-quarter image. The continuity concern follows the visible raised-prop arm versus forward-pointing arm between frames; it does not rely on guessing a handedness label from screen position.

## Anatomy, scale and clothing

- **Head:** white spiky hair, face shape and identity remain recognizable across all four poses. Raw heads look broadly consistent with one another, but that is not a native-density comparison with the approved cells. The reported 1.28 head probe is a failed gate, not a pass or proof of a particular skull enlargement. Hair and skull must be measured separately on the final quantized candidate.
- **Torso/build:** purple shirt, white undershirt edge, dark collar and navy shorts preserve the reference design. Bending and loose fabric obscure shoulder-to-hip landmarks; f0's lateral reach and f1/f2's lean change the torso envelope. No exact torso-length or shoulder-width agreement with approved anatomy can be established from this source review.
- **Arms/hands:** arms remain traceable from shoulder through elbow to wrist; the central issue is which arm performs the action. Oversized-looking expressive palms and cuff widths require equal-density comparison. A hand anchor must land on the actual middle finger after packing, not on an estimated raw palm center.
- **Legs/knees:** f0/f1 have asymmetric folds, f2 has forward-swinging legs, f3 has a compact tuck. No obvious extra limb is visible. Hidden thigh segments, foreshortening and overlapping shorts prevent a defensible numeric femur/tibia comparison. Do not fit any tucked pose to standing height.
- **Shoes/soles:** high-top design and white toe/sole treatment persist. f2 exposes long, broad sole profiles; f0/f1/f3 rotate the shoes differently. The reported feet 1.49 is a matching-color area-derived linear proxy, not a measured shoe length. Occlusion, exposed sole area and matching colors can affect it. It is sufficient to retain the failed gate, but insufficient to prescribe a 1/1.49 shoe resize. All shoe and sole contours must survive final packing without clipping.
- **Rendering:** source shading has smooth/anti-aliased transitions inconsistent with a strict hard-pixel raw treatment. Its final 48-color appearance, edge integrity and small finger readability remain unknown because the v07 pack failed.

## Measurement limits and required recheck

No manual numeric anatomy pass is recorded. The source is 2172 x 724 rather than four native 256 px cells, and the packer's reported import factor does not substitute for inspecting its accepted quantized output. Covered joints, hair/crown uncertainty, perspective, shoe rotation and the missing accepted atlas all limit measurement. The contract's source crown uncertainty remains applicable; no universal head ratio or old 200 px body target was used.

Keep v07 on technical hold. Luna/coordinator should resolve the failed gate and right-edge clipping without stretching the airborne body or weakening thresholds, and resolve the f0-to-f1 arm-role and middle-finger readability issues. Further image calls require the applicable budget authorization because the inventory records 3/3 used. After a successful strict pack, verify that the actual atlas and frame files are v07 (or the explicitly selected successor), then re-audit every frame and playback transition against both approved cells and idle at one pixel density. Record head/skull and hair separately, shoulder-to-hip length, arm and leg chains, clothing volume, shoes/soles, and uncertainty. Rebuild the body/head evidence from that version and measure the four R middle-finger anchors in packed cells. A passing head gate alone cannot clear these holds; user art approval remains separate.
