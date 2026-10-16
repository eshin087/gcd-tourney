# Goku jumpUp v03 redraw evidence

Date: 2026-10-15. Existing `jumpUp_v01` and `jumpUp_v02` remain preserved in `_qa_hold/`. The selected imagegen output was filed as the next candidate `jumpUp_v03.png`.

## Calls and files

- Existing v01 source: `generation-source/jumpUp_v01_attempt01.png`.
- A prior reprocessing pass produced v02 from the existing source without a new generation call.
- This redraw exhausted the three-call budget: one generation call's output path was not captured (counted as failed); the next call returned source `generation-source/jumpUp_v03_attempt03.png`.
- Generator source SHA-256: `C8B5EE50491068292041519B5533F41A78EC77084A80C846D5307686C2309E81` (1774x887).
- Native two-cell result: `raw/jumpUp_v03.png`, 512x256, SHA-256 `033B2F04768939B7C48A5B27D9674F6D71876C6D59A0179F10FAEDD71AD36F5F`.
- Conversion used the existing `grid-to-cells.mjs` at one common transform, x0.300375. The whole-figure bounds were f0 y23..240 (218px) and f1 y1..239 (239px); no pose-by-pose scaling was applied.

## Technical result

Command: `node tools/pack-sprites.mjs goku --quantize 48 --dry-run`.

The gate failed: jumpUp head size is 0.62 of approved idle and feet size is 0.78. The output has two visibly different occupied heights; it is held and cannot be treated as a numeric scale pass. The dry run wrote nothing. No more image-generation calls remain for jumpUp in the three-call budget.

## Prompt

Create a corrected two-frame pixel-art Goku ascent strip, one horizontal row of exactly two native 256x256 cells. Use the attached held jumpUp candidate for pose sequence only and the approved title-style and idle anchors for identity, anatomy, and density. In each cell, skull crown excluding golden hair to boot soles should match the approved adult body scale, approximately 233 pixels. Keep body/head/limb proportions identical between the poses. Frame 0: compact preparatory rise with flexed knees, lifting torso, balanced arms. Frame 1: rising with body slightly extended, knees bent and arms stabilizing. Full figure, including hair and boots, completely inside each cell, soles arranged naturally for an airborne action; no clipping or overlap. Adult Cell-era Super Saiyan design, upright golden spiky hair, teal-green eyes, orange gi over dark blue short-sleeved undershirt, blue sash, wristbands, dark blue boots. Match approved title-style pixel clusters, hard edges, dark outlines, restrained cel shading. Solid pure magenta #FF00FF background. No blur, anti-aliasing, gradients, dithering, aura, ki, beams, effects, text or labels. Unapproved candidate v03; do not alter prior versions.
