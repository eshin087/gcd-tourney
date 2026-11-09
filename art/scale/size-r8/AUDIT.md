# Size audit round 8 (ART-SIZE-R8, 2026-11-08)

**User request (2026-11-08, Claude chat "Character art sprite consistency audit"):** "audit all the art sprites and
animation and ensure everything is consistent. i'm still seeing instances where some sprites are much bigger than the
others. for example i think when sasuke parries or spot dodges it gets big." Codex chats "Character Art Audit #1"
(relay lane `audit1`) and "Character Art Audit #2" (lane `audit2`) build new images.

**User decisions (same chat, question box):** fix "the ~34 clear ones" (off by 8 % or more); strips with the right head
but the wrong body are **redrawn by Codex**, each new drawing comes to the user for approval; strips that are uniformly
the wrong size are **resized in the pack by Claude** (`animations.<anim>.packScale`, ADR 0041, drawing unchanged).
Borderline strips (5-7 %) stay as they are this round.

## Why it still happens

Every fighter is drawn at one scale at runtime (ppu 128, root scale = depth correction only, 1.00 in the lab). The
packer sizes each strip by its **head** (the scale gate), so heads match while the body under them differs 10-25 %
from strip to strip, and Goku and Luffy have no working head probe at all. Rounds 6-7 fixed head-size errors; the strips
added since 2026-10-18 (Smash normals, skills, charge) were never audited. Sasuke's spot dodge holds his `jumpSquat`
frame (`dodgePose`, src/characters/sasuke.js), drawn bulkier than his idle; when his attack is parried he plays
`stagger`, drawn wider than his approved standing cell. His `guard` (the parry pose) matches. A parry also zooms the
camera (`cam.zoomPunch(0.5)`), which enlarges both fighters for a moment; that is intended.

## Method

All 286 packed strips (about 1,300 frames) of the six fighters: (1) per frame, idle f0's head template-matched over
scale, rotation and mirror, a second head template cut from the approved neutral cell, silhouette area and limb
thickness (distance-transform ridge), each against the fighter's median strip (`measure.py`, `report.py`); (2) contact
sheets of every strip beside idle f0 and the approved neutral at one density, read by eye strip by strip (Claude for
Sasuke, one reviewer per other fighter); (3) the worst ones checked again at 2x beside the idle (boards below). A strip
is on the list when the eye and at least one measure agree on 8 % or more. Tools and raw numbers stay in Claude's
scratch folder; this file is the record.

Evidence boards (same pixel density and floor line, dashed line = idle crown):
[defense poses](boards/0-defense-poses.png) · [Sasuke](boards/1-sasuke.png) · [Naruto](boards/2-naruto.png) ·
[Gojo](boards/3-gojo.png) · [Goku](boards/4-goku.png) · [Luffy](boards/5-luffy.png) · [Killua](boards/6-killua.png)

## The 34 strips

### Redraw (Codex; the head is right, the body is not: a resize cannot fix it)

| # | Fighter | Strip (version) | Frames | What is off (against idle f0 / the approved neutral cell) | Lane |
|---|---|---|---|---|---|
| A1 | Sasuke | jumpSquat (v07) | 1 | **His spot-dodge pose.** Torso, arms and baggy trousers bulkier than idle | audit1 |
| A2 | Sasuke | stagger (v08) | 4 | **Plays when he is parried.** Upright; shoulders and torso wider than the approved neutral | audit1 |
| A3 | Sasuke | fTilt (v03, packScale 0.92) | 7 | At x1 the head is about 12 % big, at x0.92 the body about 9 % small: proportions | audit1 |
| A4 | Naruto | light2 (v06) | 7 | Limbs about 10 % thicker, sandals and fists about 20 % bigger, torso heavier; head right. light2Alt (v05) is about 5 % small, so the pair pops 15 % | audit1 |
| A5 | Naruto | stagger (v08) | 4 | Plays when he is parried. Upright front view at 87 % of the neutral's height: legs about 15 %, torso about 8 % short | audit1 |
| A6 | Naruto | taunt (v10) | 2 | Same fault as stagger (83 % of the neutral's height, legs apart) | audit1 |
| A7 | Naruto | light3Alt (v02) | 7 | Kick frames f1-f4: standing leg about 20 % short (light3 v04 is right) | audit1 |
| A8 | Naruto | specialDown (v05) | 4 | Roar frames f2-f3 about 10-12 % bigger than f0-f1 and the idle (longer, thicker legs, broader torso) | audit1 |
| A9 | Killua | superPose (v08) | 4 | Shorts about 19 % wider and longer, legs about 20 % thicker, hands bigger than the neutral | audit1 |
| A10 | Killua | getup (v07) | 5 | f1-f4 torso about 12 % bigger, arms and legs thicker; f4 is nearly the idle pose, so he slims when idle resumes | audit1 |
| B1 | Gojo | light1 (v05) | 7 | His jab. Torso about 20 % and legs about 12 % shorter than idle in the same stance: the crown drops from 230 to 199 | audit2 |
| B2 | Gojo | special (v07) | 8 | f3-f7 about 9 % smaller than f0-f2 (crown 231 to 211 at f3; legs about 13 %, torso about 8 % shorter) | audit2 |
| B3 | Gojo | fSmash (v01) | 9 | Torso about 12 % and legs 11-15 % short (f8 stands 206 against the neutral's 235) | audit2 |
| B4 | Gojo | airLight1 (v07) | 5 | Short, narrow torso (collar to hem about 58 px against 80, shoulders 57 against 73), legs about 10 % short | audit2 |
| B5 | Gojo | airLight3 (v12) | 6 | Legs about 15 % short (hem to ankle about 90 px against 108), torso about 61 px against 80 | audit2 |
| B6 | Gojo | fair (v01) | 6 | Very short torso (about 55-60 px against 80), narrow shoulders | audit2 |
| B7 | Gojo | fTilt (v01) | 7 | Bulky: trouser legs 20-23 px wide against 17-19, boxier jacket | audit2 |
| B8 | Goku | run (v09) | 8 | Head (hair and face) about 15-18 % bigger on an idle-size body | audit2 |
| B9 | Luffy | run (v01) | 8 | Head (hat and face) about 10-12 % bigger on an idle-size body | audit2 |
| B10 | Luffy | down (v03) | 2 | f0 (crawl) about 12 % small, f1 (lying) about 5-20 % big: a pop inside the strip | audit2 |

Pixel repairs, no image call (new `_vNN` from the same pixels):

| # | Fighter | Strip (version) | Repair | Lane |
|---|---|---|---|---|
| R1 | Naruto | airHeavyAlt (v04) | f2-f4: the thigh pouch is blue (about 60 px a frame) instead of black like the other frames | audit1 |
| R2 | Naruto | jumpSquat (v04) | f0: small orange blob beside the rear fist | audit1 |
| R3 | Goku | bair (v01) | f0: dark blob under the chin, pale patch at the waist; f2: skin-coloured patch on the gi. Claude resizes it (C4) | audit2 |
| R4 | Luffy | specialForward (v01) | f5: stray orange speck by the rear foot. Claude resizes it (C14) | audit2 |

### Resize in the pack (Claude, branch `art/size-r8-resize`; drawing unchanged)

Factor = the new `animations.<anim>.packScale` relative to today's. Checked at the new size beside idle f0 before it ships.

| # | Fighter | Strip (version) | Measured against the fighter's other strips | Factor |
|---|---|---|---|---|
| C1 | Sasuke | bair (v01) | head 1.08-1.09 (two templates), area 1.04 | x0.93 |
| C2 | Sasuke | fSmash (v02) | head 1.04-1.05, area 1.07 | x0.95 |
| C3 | Sasuke | dashAttack (v05) | head 0.95-0.96, thickest part 0.78 (lunge), by eye about 8-12 % small | x1.06 |
| C4 | Goku | bair (v01) | head 0.90, area 0.82, by eye -17 % | x1.15 |
| C5 | Goku | uair (v01) | head 0.97, area 0.82 (tucked), by eye -13 % | x1.10 |
| C6 | Goku | intro (v01) | head 0.90, area 0.94, thickness 0.90 | x1.10 |
| C7 | Goku | fSmash (v01) | area 1.12, thickness 1.09-1.12, by eye +11-17 % | x0.90 |
| C8 | Goku | fTilt (v01) | head 1.09, area 1.05 | x0.94 |
| C9 | Goku | dTilt (v01) | head 1.08, area 1.03, shoulders +9 % | x0.93 |
| C10 | Goku | fair (v01, already x0.92) | head 1.06, thickness 1.16, by eye +8 % | x0.94 |
| C11 | Luffy | specialDown (v03, already x0.77) | head 1.22, area 1.13, by eye +20-25 % | x0.82 |
| C12 | Luffy | fair (v03) | head 1.13, thickness 1.26, by eye +15 % | x0.88 |
| C13 | Luffy | heavy (v01) | head 0.79, area 0.91, thickness 0.85 | x1.12 |
| C14 | Luffy | specialForward (v01) | head 0.86-0.93 in every frame, area 0.89-0.95 | x1.08 |

## Seen, not in this round

- Borderline 5-7 %: Sasuke light3, uSmash, beamStruggle, run (thin side-on); Gojo airLight2, airHeavy, uSmash, uTilt,
  dTilt, dSmash, beamStruggle; Goku light1 (f0-f2 vs f4-f6 about 10 % apart), superPose, specialDown, uTilt; Luffy
  light1, light4 f5-f7, hurtHigh, bair; Naruto land, light4Alt, jumpFall, heavyAlt f3-f5, specialForward, specialUp;
  Killua launched, backDash, beamCharge.
- **Colour:** Naruto's jumpsuit uses two base oranges, deep (250,136,42) and bright (251,157,33), in different strips,
  so his suit shifts hue between moves. Killua's charge is shaded darker than every other strip; his newer Smash strips
  have more lavender in the hair. Luffy light4 f1 has stray red pixels at the shorts cuff, special f6 a pink blotch on
  the shin, specialUp f0-f3 arms ending in flat cuts (check whether the engine's arm limb covers them).
- Killua: combat strips (idle included) have a shorter upper body than his neutral cell; his show strips (win, taunt,
  superPose, intro, down, ko) use the neutral's longer torso. Each family is consistent inside itself.
