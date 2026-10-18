# Size audit round 7: Claude's measurement and fixes (2026-10-18)

User request (2026-10-18): every character frame the same size; Goku and Luffy "way bigger than the other characters".
User decisions: Goku/Luffy option A (x0.92), resize first and redraw only wrong drawings, 5 % tolerance, one review
page per fighter. Codex's independent screen of the same atlases: [CODEX_AUDIT.md](CODEX_AUDIT.md).

## Cast scale (Goku, Luffy)

Standing body (soles to skull, no hair) over canon height: Naruto 195 px / 166 cm, Sasuke 197 / 168, Gojo 222 / 190,
about 1.17 px per cm (Killua 176 / 158). Goku's shipped idle fits his approved combat cell (title_style_draft v02) at
x1.08 (silhouette IoU 0.93), about 224 px for 175 cm (1.28 px/cm). Luffy's idle matches his approved lineup cell, which
was itself drawn large: about 217 px for 172 cm (1.26 px/cm). Both pack at `packScale` 0.92 (ADR 0041): about 206 and
200 px.

## Per-strip method

1. **Head template:** idle f0's head (hair included) searched in every frame over scale 0.70-1.40, rotation +-90 deg and
   mirror (masked RGB difference, OpenCV). Controls: frames rescaled x0.85 / x0.92 / x1.08 / x1.15 read within 3 %
   (head pushed out of the cell by an upscale is the only miss, and it shows as a high match error).
2. **Self-match bias:** a template reads its own frame at exactly 1.00 and every other drawing 4-7 % small, so each
   strip is compared with its fighter's **consensus** (median over all its strips), not with the idle.
3. **Second head template** from the approved reference pose (title-style combat cells; Goku draft v02; Luffy draft v01
   cut at the shipped density).
4. **Body area** (sqrt of opaque pixels vs the consensus) as an independent measure. Shoe and lower-torso templates were
   tried and dropped: feet foreshorten in the air (0.8) and on the ground (1.1-1.3), torsos twist.
5. **Hand landmarks** where the measures disagreed (Gojo light1: crown to chin 36 vs 35 px, hair 40 vs 37-40 px = 0.96-0.97,
   while the template read 0.91; Goku run/dash hair width and crown-to-eye 1.02-1.09).
6. **Rule:** resize where the median of the independent measures is 6 % or more off the consensus, after a visual check of
   the frame at the corrected size beside idle f0. One measure alone misreads turned heads and folded poses by up to 10 %.

## Fixes (animations.<anim>.packScale, drawings unchanged)

| Fighter | Strip | Factor | Evidence (head / reference head / body area, vs consensus) |
|---|---|---|---|
| Goku | dash | x0.945 | 1.13 / - / 1.00; landmarks 1.03-1.09 |
| Goku | special | x0.93 | 1.08 / 1.13 / 1.05 |
| Goku | beamCharge | x0.93 | 1.08 / - / 1.07 |
| Goku | win | x1.105 (cell caps it at about x1.09) | 0.88 / - / 0.93 |
| Luffy | charge | x0.875 | 1.14 / 1.15 / 1.14 (Codex: scale-off) |
| Luffy | jumpUp | x0.90 | 1.09 / 1.11 / 1.13 |
| Luffy | getup | x0.925 | 1.09 / 1.11 / 1.06 |
| Luffy | airLight1 | x0.93 | 1.11 / 1.12 / 1.04 |
| Luffy | land | x1.085 | 0.91 / 0.91 / 0.93 |
| Luffy | light4 | x1.075 | 0.92 / 0.91 / 0.94 |
| Luffy | beamCharge | x1.07 | 0.91 / 0.91 / 0.96 |
| Gojo | heavy | x1.05 (cell caps it at about x1.04) | 0.95 / 0.95 / 0.95; round 6 read 0.90-0.94 |

The packer's automatic head fit keeps a strip's own packScale (it was fitting it away). `--keep-palette` keeps each
fighter's palette and colour choices, so every other strip is byte for byte the same as before (verified for Killua and
Gojo: Killua is unchanged, Gojo's only changed strip is heavy).

## Held (no change)

- **Measures disagree with the packer's colour head probe:** Killua beamStruggleAir (head templates 0.90/0.90, body area
  0.91; the probe read 1.00 before and 1.11 after a x1.10 resize) and Gojo beamCharge (head templates 1.07/1.09; probe
  1.00 before, 0.93 after x0.925). The gate refused both resizes and nothing visibly hides the head, so no exemption is
  justified: left as they ship.

- **Within measurement error (about 5 %):** Goku run (1.05 median) and airLight1, Luffy run and light1, Sasuke jumpFall,
  beamStruggleAir and airLight3 (head and area disagree), Gojo light1 (landmarks 0.96-0.97), Killua beamStruggle.
- **Lying, tucked, crouched or spinning poses** where head and area disagree and the frame looks right by eye: Killua ko,
  spin, getup, stagger, guard, jumpSquat, beamFire; Gojo ko, land, airRecover; Naruto getup, specialForward, jumpFall,
  superDash.
- **Gojo hurtHigh, hurtLow, launched:** out of scope here (PR #143, lane gojo-run).
- **Naruto backDash:** same body scale as the idle (head 1.00, belt 40/41 px, shoe 38/37 px) but frames 1 and 3 stand
  15-16 px taller (180 vs 165 px): a pose height change, the user's call (keep or redraw lower).

## All strips (vs the fighter's consensus; blank = no reliable match)

| Fighter | Strip | Head | Reference head | Body area |
|---|---|---|---|---|
| naruto | run | 1.05 |  | 0.99 |
| naruto | dash | 1.00 |  | 1.01 |
| naruto | backDash | 1.00 |  | 0.98 |
| naruto | superDash | 1.06 |  | 0.99 |
| naruto | jumpSquat | 1.03 |  | 0.92 |
| naruto | jumpUp | 1.01 |  | 1.11 |
| naruto | jumpFall | 0.93 |  | 0.99 |
| naruto | land | 1.04 |  | 1.08 |
| naruto | light1 | 1.00 |  | 1.01 |
| naruto | light2 | 1.00 |  | 1.12 |
| naruto | light3 | 1.00 |  | 1.00 |
| naruto | light4 | 0.98 |  | 0.96 |
| naruto | heavy | 0.97 |  | 1.00 |
| naruto | airLight1 | 1.00 |  | 0.99 |
| naruto | airLight2 | 0.97 |  | 0.95 |
| naruto | airLight3 | 1.02 |  | 0.92 |
| naruto | airHeavy | 0.98 |  | 1.03 |
| naruto | guard | 1.00 |  | 0.99 |
| naruto | block | 1.00 |  | 0.97 |
| naruto | hurtHigh |  |  | 1.05 |
| naruto | hurtLow | 1.04 |  | 0.98 |
| naruto | launched |  |  | 1.03 |
| naruto | spin |  |  | 0.94 |
| naruto | airRecover |  |  | 0.91 |
| naruto | down |  |  | 1.00 |
| naruto | getup | 1.09 |  | 1.01 |
| naruto | charge | 1.01 |  | 1.03 |
| naruto | throw | 1.02 |  | 1.01 |
| naruto | beamCharge | 1.00 |  | 1.08 |
| naruto | beamFire | 0.97 |  | 0.98 |
| naruto | vanish |  |  | 1.00 |
| naruto | stagger |  |  | 1.00 |
| naruto | ko |  |  | 0.98 |
| naruto | special | 0.98 |  | 1.01 |
| naruto | intro | 1.00 |  | 1.03 |
| naruto | taunt | 1.00 |  | 1.01 |
| naruto | win | 0.98 |  | 1.03 |
| naruto | specialForward | 0.92 |  | 1.05 |
| naruto | specialUp |  |  | 1.06 |
| naruto | specialDown |  |  | 1.11 |
| naruto | superPose | 0.97 |  | 0.98 |
| naruto | beamStruggle | 0.95 |  | 0.99 |
| naruto | light1Alt | 1.03 |  | 1.02 |
| naruto | light2Alt | 0.97 |  | 0.99 |
| naruto | light3Alt | 1.00 |  | 0.95 |
| naruto | light4Alt | 1.04 |  | 1.05 |
| naruto | heavyAlt | 1.03 |  | 1.02 |
| naruto | airLight1Alt | 1.03 |  | 1.02 |
| naruto | airLight2Alt | 1.03 |  | 0.97 |
| naruto | airLight3Alt | 1.00 |  | 0.98 |
| naruto | airHeavyAlt | 0.97 |  | 0.97 |
| naruto | hurtHighAlt |  |  | 1.03 |
| naruto | hurtLowAlt | 1.04 |  | 0.96 |
| sasuke | run |  | 0.99 | 0.89 |
| sasuke | dash |  | 1.03 | 1.07 |
| sasuke | backDash | 0.99 | 1.00 | 1.04 |
| sasuke | superDash | 1.00 | 1.00 | 0.94 |
| sasuke | jumpSquat |  |  | 1.07 |
| sasuke | jumpUp | 1.01 | 0.99 | 1.13 |
| sasuke | jumpFall | 0.93 | 0.93 | 1.06 |
| sasuke | land | 0.98 | 0.99 | 0.99 |
| sasuke | light1 | 1.05 | 1.03 | 0.98 |
| sasuke | light2 | 0.99 | 1.00 | 1.00 |
| sasuke | light3 | 0.99 | 0.98 | 1.07 |
| sasuke | light4 | 0.98 | 0.98 | 1.01 |
| sasuke | heavy | 1.05 | 1.03 | 0.99 |
| sasuke | airLight1 | 1.05 | 1.00 | 0.97 |
| sasuke | airLight2 | 1.05 | 1.03 | 0.99 |
| sasuke | airLight3 |  | 0.93 | 1.04 |
| sasuke | airHeavy | 0.99 | 1.00 | 0.95 |
| sasuke | guard |  | 1.01 | 0.98 |
| sasuke | block | 1.05 | 1.03 | 1.02 |
| sasuke | hurtHigh |  | 1.05 | 1.02 |
| sasuke | hurtLow | 0.98 | 0.98 | 0.91 |
| sasuke | launched |  | 0.97 | 0.92 |
| sasuke | spin |  |  | 0.87 |
| sasuke | airRecover |  |  | 0.88 |
| sasuke | down |  |  | 0.96 |
| sasuke | getup |  | 1.05 | 0.93 |
| sasuke | charge | 1.05 | 1.05 | 1.01 |
| sasuke | throw | 1.05 |  | 1.01 |
| sasuke | beamCharge |  |  | 1.04 |
| sasuke | beamFire | 1.05 | 1.05 | 1.00 |
| sasuke | vanish | 0.98 | 0.99 | 1.01 |
| sasuke | stagger | 1.04 | 0.97 | 1.10 |
| sasuke | ko |  |  | 0.95 |
| sasuke | special |  | 1.00 | 0.97 |
| sasuke | intro |  | 1.02 | 1.03 |
| sasuke | taunt |  | 0.94 | 1.02 |
| sasuke | win |  |  | 1.02 |
| sasuke | specialForward | 1.00 | 1.00 | 1.01 |
| sasuke | specialUp | 0.99 | 0.99 | 0.91 |
| sasuke | specialDown | 1.05 | 1.02 | 1.03 |
| sasuke | superPose |  |  | 1.02 |
| sasuke | beamStruggle | 1.01 | 1.00 | 0.95 |
| sasuke | beamStruggleAir | 0.92 | 0.92 | 0.99 |
| killua | run | 1.00 |  | 1.02 |
| killua | dash | 0.97 |  | 0.94 |
| killua | backDash | 0.99 |  | 0.94 |
| killua | superDash | 1.01 | 1.00 | 1.06 |
| killua | jumpSquat | 0.95 |  | 0.94 |
| killua | jumpUp | 1.05 | 1.02 | 1.04 |
| killua | jumpFall | 1.00 | 0.94 | 0.99 |
| killua | land | 1.02 | 1.00 | 1.00 |
| killua | light1 | 1.02 | 1.00 | 1.03 |
| killua | light2 | 1.02 | 0.98 | 1.00 |
| killua | light3 | 0.99 |  | 1.00 |
| killua | light4 | 1.00 |  | 1.00 |
| killua | heavy | 1.00 |  | 1.01 |
| killua | airLight1 | 1.02 | 1.00 | 0.94 |
| killua | airLight2 | 1.04 | 1.00 | 0.95 |
| killua | airLight3 | 1.00 | 1.00 | 0.95 |
| killua | airHeavy | 0.96 | 0.89 | 0.97 |
| killua | guard | 0.95 |  | 0.95 |
| killua | block | 0.95 |  | 0.95 |
| killua | hurtHigh | 1.00 |  | 1.02 |
| killua | hurtLow | 0.98 | 0.93 | 0.93 |
| killua | launched |  |  | 1.12 |
| killua | spin | 0.92 |  | 0.84 |
| killua | airRecover | 0.99 |  | 0.84 |
| killua | down | 1.05 | 0.95 | 0.98 |
| killua | getup | 1.08 |  | 1.11 |
| killua | charge | 1.08 | 1.00 | 0.92 |
| killua | throw | 0.98 | 0.96 | 1.01 |
| killua | beamCharge | 1.00 |  | 1.02 |
| killua | beamFire | 0.84 |  | 0.95 |
| killua | vanish | 0.98 | 1.01 | 0.97 |
| killua | stagger | 1.07 |  | 1.05 |
| killua | ko | 0.82 |  | 0.91 |
| killua | special | 1.00 |  | 1.01 |
| killua | intro | 1.03 |  | 1.02 |
| killua | taunt | 1.05 |  | 1.08 |
| killua | win | 1.05 | 1.02 | 1.11 |
| killua | specialForward | 1.00 | 0.97 | 1.02 |
| killua | specialUp | 0.98 |  | 0.97 |
| killua | specialDown |  | 1.01 | 1.05 |
| killua | superPose | 1.05 |  | 1.13 |
| killua | beamStruggle | 0.97 | 0.93 | 1.01 |
| killua | beamStruggleAir | 0.90 | 0.90 | 0.91 |
| gojo | run | 1.03 | 1.02 | 1.00 |
| gojo | dash | 1.00 | 1.00 | 1.06 |
| gojo | backDash | 0.97 | 0.98 | 0.97 |
| gojo | superDash | 0.99 | 0.99 | 1.00 |
| gojo | jumpSquat | 1.00 | 1.00 | 1.03 |
| gojo | jumpUp | 1.04 | 1.02 | 1.02 |
| gojo | jumpFall | 1.01 | 1.03 | 1.11 |
| gojo | land | 0.89 | 0.96 | 0.90 |
| gojo | light1 | 0.91 | 0.91 | 0.99 |
| gojo | light2 | 1.01 | 1.00 | 1.06 |
| gojo | light3 | 0.96 | 0.94 | 0.97 |
| gojo | light4 | 1.00 | 0.97 | 1.04 |
| gojo | heavy | 0.95 | 0.95 | 0.95 |
| gojo | airLight1 | 0.96 | 0.96 | 0.90 |
| gojo | airLight2 | 1.03 | 1.04 | 0.95 |
| gojo | airLight3 | 1.01 | 1.01 | 0.90 |
| gojo | airHeavy | 1.01 | 1.03 | 0.96 |
| gojo | guard | 0.98 | 1.03 | 1.04 |
| gojo | block | 0.99 | 1.01 | 1.03 |
| gojo | hurtHigh | 0.95 | 0.93 | 1.05 |
| gojo | hurtLow | 0.84 | 0.96 | 0.93 |
| gojo | launched | 0.95 |  | 1.09 |
| gojo | spin | 1.07 | 1.03 | 0.94 |
| gojo | airRecover | 1.06 | 1.11 | 0.97 |
| gojo | down |  |  | 0.98 |
| gojo | getup | 0.93 | 0.97 | 0.92 |
| gojo | charge | 0.97 | 0.97 | 1.05 |
| gojo | throw | 1.01 | 1.00 | 0.99 |
| gojo | beamCharge | 1.07 | 1.09 | 1.14 |
| gojo | beamFire | 0.96 | 0.99 | 1.00 |
| gojo | vanish | 1.05 | 1.03 | 0.96 |
| gojo | stagger | 1.01 | 0.99 | 1.06 |
| gojo | ko | 0.82 |  | 0.97 |
| gojo | special | 1.02 | 0.98 | 0.94 |
| gojo | intro | 1.02 | 1.01 | 1.05 |
| gojo | taunt | 1.04 | 1.05 | 1.05 |
| gojo | win | 1.01 |  | 1.02 |
| gojo | specialForward | 1.01 | 0.99 | 0.99 |
| gojo | specialUp | 0.98 | 1.01 | 1.02 |
| gojo | specialDown | 1.02 |  | 1.00 |
| gojo | superPose |  |  | 1.02 |
| gojo | beamStruggle | 0.96 | 0.98 | 1.06 |
| gojo | beamStruggleAir | 0.98 | 0.94 | 1.02 |
| goku | run | 1.13 |  | 1.04 |
| goku | dash | 1.13 |  | 1.00 |
| goku | jumpUp | 0.98 |  | 0.86 |
| goku | jumpFall | 1.00 | 0.93 | 0.99 |
| goku | land | 1.02 |  | 1.04 |
| goku | light1 | 1.02 |  | 1.00 |
| goku | light2 | 0.95 | 1.00 | 1.01 |
| goku | light3 | 1.02 |  | 0.95 |
| goku | light4 | 0.96 |  | 1.00 |
| goku | heavy | 1.02 |  | 1.02 |
| goku | airLight1 | 0.92 | 0.93 | 0.99 |
| goku | airHeavy | 0.98 | 1.01 | 0.94 |
| goku | guard | 0.94 |  | 1.00 |
| goku | hurtHigh | 0.95 |  | 0.96 |
| goku | launched |  |  | 0.95 |
| goku | down |  |  | 0.81 |
| goku | getup | 1.02 | 1.03 | 1.00 |
| goku | charge | 0.95 | 0.96 | 0.98 |
| goku | beamCharge | 1.08 |  | 1.07 |
| goku | beamFire | 1.02 |  | 1.03 |
| goku | special | 1.08 | 1.13 | 1.05 |
| goku | win | 0.88 |  | 0.93 |
| goku | beamStruggle | 0.96 |  | 1.02 |
| luffy | run | 1.09 | 1.12 | 1.00 |
| luffy | dash | 0.98 | 1.00 | 1.00 |
| luffy | jumpUp | 1.09 | 1.11 | 1.13 |
| luffy | jumpFall | 0.96 | 0.97 | 0.96 |
| luffy | land | 0.91 | 0.91 | 0.93 |
| luffy | light1 | 1.06 | 1.07 | 1.03 |
| luffy | light2 | 0.98 | 0.97 | 1.01 |
| luffy | light3 | 0.95 | 0.96 | 0.95 |
| luffy | light4 | 0.92 | 0.91 | 0.94 |
| luffy | heavy |  |  | 0.91 |
| luffy | airLight1 | 1.11 | 1.12 | 1.04 |
| luffy | airHeavy |  |  | 0.94 |
| luffy | guard | 0.99 | 0.98 | 0.96 |
| luffy | hurtHigh |  |  | 0.95 |
| luffy | launched |  |  | 1.07 |
| luffy | down |  |  | 0.92 |
| luffy | getup | 1.09 | 1.11 | 1.06 |
| luffy | charge | 1.14 | 1.15 | 1.14 |
| luffy | beamCharge | 0.91 | 0.91 | 0.96 |
| luffy | beamFire | 1.01 | 1.00 | 1.10 |
| luffy | special | 1.02 | 1.04 | 1.03 |
| luffy | win |  |  | 1.10 |
