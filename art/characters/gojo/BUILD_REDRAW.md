# Gojo: build correction and full redraw (brief for Codex, 2026-10-10)

> Written by Claude for Codex. **User decision (2026-10-10):** Gojo is too thin and looks too small. Keep his head
> (size, face, blindfold, white hair) and his 215 px standing skeleton; make his build broader (shoulders roughly
> 1.6x wider than now, thicker arms and legs, an adult athletic chest), then redraw **all 42 animations** to the new
> build: a new model sheet for approval first, then idle, run, then the rest. His `heavy` and `charge` are
> redesigned in the same pass (sections 7 and 8). This supersedes the "slender adult proportions" half of the
> ART-SCALE-01 note; the "compact head" half stays (art/CHARACTER_SCALE.md "User correction"). ADR 0007, ADR 0010
> and art/SPEC.md still win on every number they set. Section 10 lists the doc changes Claude makes.

## 1. What is wrong: the measurements

Measured on 2026-10-10 from the packed sheets (`public/characters/<id>/sheet.png`), idle f0 unless noted, 3/4 view,
final-cell px. "By eye" values come from 4-5x crops and are ±3 px.

| measure | Naruto | Sasuke | Killua | **Gojo now** |
|---|---|---|---|---|
| declared standing skeleton (`standingBodyPx`) | 200 | 200 | 182 | **215** |
| idle height incl. hair | 203 | 202 | 186 | 221 |
| idle max width | 103 | 103 | 86 | **80** |
| shoulder band: widest row 15-30 % below the figure top (automatic proxy) | 77 (guard fists inside the band) | 87 (lead hand inside) | 64 (lead hand inside) | **52** (hands in pockets: shoulders only) |
| deltoid to deltoid, hands and forearms excluded (by eye) | ~62 | ~60 | ~42 | **~50** |
| shoulder band ÷ skeleton (SBR) | 0.385 | 0.435 | 0.352 | **0.242** |
| deltoid ÷ skeleton (DR) | 0.31 | 0.30 | 0.23 | **0.23** |
| idle max width ÷ idle height (MWR) | 0.51 | 0.51 | 0.46 | **0.36** |
| near upper arm, sleeve (by eye) | ~20 | ~20 | ~16 | ~15-16 |
| thigh at mid-thigh, cloth | 20-22 | 23-27 (baggy) | 24-29 (shorts) | 17-20 |
| calf at mid-shin, cloth | 19-23 | 20-24 | bare, 11-16 | 15-17 |

What this shows:

1. **An adult drawn with a child's shoulders.** Gojo's deltoid ratio (0.23) equals 13-year-old Killua's and is a
   quarter below the 16-year-olds' (0.30-0.31). The band proxy exaggerates the gap a little (the teens' bands
   include their guard hands, +15 to +26 px), but the hands-excluded width confirms the user's read.
2. **His pose hides what breadth he has.** The idle keeps both hands in the pockets with a slouch, so no guard arm
   widens his silhouette as it does for the others: his max-width ratio (0.36) is the lowest of the cast by far.
3. **His height is compressed.** At 190+ cm against Naruto's 166 cm he would be about 229 px if heights scaled
   linearly; the cell caps him at 215 (1.075x Naruto instead of 1.145x). Breadth has to carry the size difference.
4. **The model sheet alone did not catch it.** The approved v03 reads broad in its front view (shoulders about 0.29
   of the skeleton), but its 3/4 views are already as narrow as the packed idle (about 0.24), and the strips followed
   the 3/4 views and the prompts' "very tall and slender" wording. So the new sheet must be broader than v03 in the
   3/4 views, the prompts drop "slender", and the build gate is measured on the **packed idle**, not on the sheet.

## 2. Target build at the 215 px skeleton

From the anime: Gojo is over 190 cm with a broad-shouldered, long-limbed, lean-athletic adult frame: square
shoulders that fill the jacket, a deep chest, a V-taper to the waist, under a small head. In a front view his
shoulders are about three of his head-widths across. At sprite scale his head is about 26-28 px wide in the 3/4 idle
(the blindfold row), so about 2.8-3 head-widths is about 78 px, deltoid to deltoid.

Against the cast: an adult must read clearly broader than the teens (DR 0.30-0.31), i.e. the athletic-adult band
0.34-0.39 (74-84 px at 215, see the scale standard). The user's "roughly 1.6x" of the 52 px band is 83 px. Both land
on the same target.

| measure (packed idle f0, 3/4 view) | now | **target** | check |
|---|---|---|---|
| standing skeleton | 215 | **215, unchanged** | |
| idle height incl. hair | 221 | **219-223, unchanged** | |
| head (skull-to-chin, face, blindfold, hair) | idle v02 | **identical to idle v02, ±1 px** | |
| shoulder band (SBR proxy) | 52 (0.24) | **82 (78-86)**, 1.5-1.65x, SBR 0.38 | the teens' 77 / 87 include their guard hands |
| deltoid to deltoid (DR) | ~50 (0.23) | **78 (74-84)**, DR 0.36 | 1.25x Naruto's ~62 in px; clearly above the teens' 0.30-0.31 |
| chest, torso only | ~36 | **48-52** | |
| waist, jacket at the navel | ~36-38 | **42-46** | V-taper: about 0.55-0.6 of the deltoid width |
| upper arm, sleeve | ~15-16 | **21-23** | Naruto ~20 |
| forearm, sleeve at mid-forearm | ~13 | **17-19** | |
| thigh, trouser leg at mid-thigh | 17-20 | **24-27** | Naruto 20-22 |
| calf, trouser leg at mid-shin | 15-17 | **19-22** | Naruto 19-23, Sasuke 20-24 |
| idle max width (elbows out, hands in pockets) | 80 (0.36) | **100-108** (MWR 0.45-0.49) | Naruto and Sasuke 103 |
| hands, feet | | large adult hands (an open hand about as long as his face); black shoes about one head long | |

Build class: **athletic adult** (scale standard). If the first candidate reads as a bodybuilder, step down toward the
low end of the windows (74 px deltoid); never below it.

## 3. What must not change

- **Head:** the approved skull-to-chin size (`targetHeadPx` stays his approved value, never 31), the narrow adult
  face (sharp jaw, straight nose, thin lips), the wide black blindfold over the eyes and brows with no tails, the
  white hair crown (same spike layout, about 18 px above the skull, two or three strands over the band), the
  expressions of `reference/expressions.png`.
- **Height and lengths:** the 215 px standing skeleton, the idle height (hair top about y 18-22), the crotch at half
  his height, the arm and leg lengths, his `bodyHeight` table (ANIMATIONS.md Summary) and the height ceiling (no
  hand, elbow or foot above the top of his hair; no frame above y 8).
- **Uniform:** the tall stand-up collar zipped to the chin, the center zipper and silver pull, the hip-length jacket
  with side slits, the loose straight trousers, black leather shoes; no buttons, emblem or hood. The clothes stay
  loose and follow the bigger frame.
- **Palette:** the 29 colors of CHARACTER.md §7 (no new color), the `#08080c` outline, the key light.
- **Everything else:** facing, 3/4 view, pivot, ppu 128, the ADR 0007 contact zones, the pockets schedule of
  CHARACTER.md §4 (one change: the new `heavy` keeps the L hand in its pocket), the motion language (lazy slouch,
  economy, one hand is enough), the Six Eyes only in `superPose` and the UI cut-in, the kit poses.

## 4. New model sheet: S1 → `reference/model_sheet_v05.png`

v04 is rejected (in `reference/_rejected/`), so the next free number is **v05**. Attach: `reference/model_sheet.png`
(the approved v03, as the candidate being corrected) and `reference/expressions.png` (face). Save as:
`reference/model_sheet_v05.png`. After "approve gojo model_sheet v05", Codex copies it to `reference/model_sheet.png`.

```text
Character model sheet for a hi-res pixel-art 2D anime arena fighting game (anime fan-art).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, broad-shouldered, athletic man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall with a broad, athletic adult build: wide, square shoulders clearly broader than a teenage fighter's (about three of his head-widths across in a front view), a deep chest, solid upper arms and forearms, strong thighs and calves filling the loose trousers, a V-shaped torso tapering to a firm waist; very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest and broadest fighter in the game, clearly bigger than a 6.5-head teenage fighter, with exactly the compact head of the attached approved references (the head of model v03 and idle v02: never enlarge or shrink it). Not chibi, not super-deformed, no big head, no oversized hands or feet, not a bodybuilder, not lanky or skinny, not western-realistic.
CHANGE FROM THE ATTACHED SHEET: this corrects the attached approved model sheet. Keep exactly: every head (the same face, blindfold and white hair, and the same head size relative to his height), his height and leg length, the five poses, the uniform design and the colors. Change only his body build, to what PROPORTIONS describes: clearly broader, square shoulders (about three head-widths across in view 1, and about one and a half times as broad as now in the 3/4 views 2 and 5, where the attached sheet reads narrow), a deeper and broader chest, thicker upper arms and forearms, stronger thighs and calves, slightly larger hands. The jacket and trousers stay loose and follow the bigger frame; the tall collar widens a little with the stronger neck. In view 5 the lazy slouch and the hands in the pockets must not narrow his shoulders: they stay broad and square. Redraw at the declared 2x scale below (smaller on the canvas than the attached sheet) so the broader figures fit with clear gaps.

Draw the same character 5 times in one row on a 1536x1024 landscape canvas, all at exactly the same scale, standing on one shared baseline, with clear gaps between them:
1. FRONT view, relaxed neutral stand, arms slightly away from the body, facing the viewer (the zipper runs down the center of the jacket from the collar top to the hem; the blindfold covers both eyes; the shoulders wide and square);
2. 3/4 view facing RIGHT (body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show), relaxed neutral stand: this is the main game view;
3. TRUE SIDE PROFILE facing RIGHT: turned exactly 90 degrees, the nose, lips and chin in silhouette pointing straight to the right, the blindfold band seen from the side wrapping around the head at eye level, the white hair spikes in profile sweeping up and back, the tall collar in profile up to the jaw, a deep adult chest and back, the far arm and leg hidden behind the near ones; NOT a 3/4 view;
4. BACK view: the back of the white hair spikes and the short hair at the nape, the blindfold's neat overlapping wraps at the back of the head (no hanging tails), the back of the tall collar, a broad jacket back tapering to the waist, and the hem;
5. 3/4 view facing RIGHT in his relaxed fighting stance: tall and loose, knees bent about 20 degrees, left foot forward, right foot back, weight on the back leg, BOTH HANDS IN HIS TROUSER POCKETS with the elbows hanging loosely out, a slight slouch that keeps the shoulders broad, chin slightly down as if looking down at a shorter opponent, a lazy confident smile.
Below the figures, one row of 29 small square color swatches (no text), one per palette color, in the palette order listed below.
Show clearly in every view: the black blindfold covering both eyes and brows; the snow-white hair standing up above the band; the tall collar zipped up to the chin; the hip-length dark navy jacket with the center zipper and the small silver pull; loose dark trousers; black leather shoes; about 7 heads tall with very long legs and a broad, athletic adult frame.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (the head matching approved model v03 and idle v02; the hair adds about 18 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. On this sheet draw at 2x: every art pixel is a 2x2 block, so the standing body (soles to top of the skull) is about 430 px tall on the canvas (the head at twice its approved packed length), the hair on top of that.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No text, no labels, no ground shadow, no floor, no effects.
```

Check before saving (and in the REVIEW.md QA notes):

- **Build:** in views 2 and 5, deltoid to deltoid ÷ standing skeleton is 0.34-0.39 (at 2x about 146-168 px on a
  430 px skeleton); view 1 about three head-widths across; a visible V-taper; limbs visibly thicker than on v03.
- **Head:** each head matches v03's face, blindfold and hair; the head-to-height ratio within ±3 % of v03's.
- **Height:** the 2x skeleton about 430 px (±5 %), the crotch at half the height.
- Everything the v03 checklist asked: a true profile in view 3, the collar and zipper, no buttons, flat magenta,
  at most 48 colors.
- **Lineup:** view 5 downscaled by 2 (nearest-neighbor) next to the cast's packed idles on one floor line
  (scale standard), linked in the REVIEW row. The user approves the sheet with the lineup in view.

## 5. New lines for every Gojo prompt

Replace in **every** Gojo block of PROMPTS.md (S1, S2, A01-A42, U1, U3) and in the fallback line:

- **CHARACTER line:** "a very tall, slender, broad-shouldered man" → "**a very tall, broad-shouldered, athletic
  man**" (the rest of the line unchanged).
- **PROPORTIONS line**, whole line:

  ```text
  PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall with a broad, athletic adult build: wide, square shoulders clearly broader than a teenage fighter's, a deep chest, solid upper arms and forearms, strong thighs and calves filling the loose trousers, a V-shaped torso tapering to a firm waist; very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest and broadest fighter in the game, clearly bigger than a 6.5-head teenage fighter, with exactly the compact head of the attached approved references (never enlarge or shrink it). Not chibi, not super-deformed, no big head, no oversized hands or feet, not a bodybuilder, not lanky or skinny, not western-realistic.
  ```

- **After the "Match the attached ..." line**, add: "The attached expression sheet shows his face only; take the
  body build from the attached model sheet and idle strip."
- **After the SCALE line** of every strip block, add:

  ```text
  SCALE LOCK: preserve the approved character's skull-to-chin length, excluding hair. The nominal 31px value is not permission to enlarge Gojo; his approved proportions take precedence. Standing skeleton height is 215 px. Draw the source art at a declared common multiplier of 2x (skull 2 x the approved skull length, standing skeleton 2 x 215 px). Keep head size, torso width, upper-arm/forearm lengths and thigh/shin lengths constant in every pose and every part. Crouching, curling, jumping, raising a hand and leaning change pose bounds, not camera distance. Do not scale a pose to fill its slot. Leave empty background where needed. Use the same reference camera and perspective throughout. Build lock: keep the broad shoulders, chest and limb thickness of the attached model sheet and idle strip in every pose; turning, slouching, crouching or hands in the pockets change the pose, never the build.
  ```

- **Fallback CHARACTER line** (CHARACTER.md §9 and PROMPTS.md): "a very tall, slender, broad-shouldered man of
  about 28" → "a very tall, broad-shouldered, athletic man of about 28".

## 6. Redraw order and method (all 42 animations + UI)

**One art branch.** The packer always uses the highest version, so a half-redrawn Gojo would ship a broad idle next
to a slim run. Do the whole set in one worktree (`npm run pr -- start art/gojo-build --full`), give the user preview
deploys for phone review (`npm run pr -- preview`), and merge only when all 42 strips and the two UI images pass.
`main` keeps today's Gojo until then.

**Two routes per strip.**

- **Route A, edit (default for the 40 strips whose poses stay):** edit the approved version as the candidate being
  corrected (allowed by AGENTS.md: "a strip fix may attach the candidate being corrected, together with the list of
  changes"). Two-part strips: edit `raw/_parts/<anim>_v<approved>_A.png`, then `_B.png` with the new part A
  attached, and stitch them as the new `_vNN`. This keeps the approved poses, timing and head exactly; only the build
  changes.
- **Route B, fresh generation:** the PROMPTS.md block with the section 5 lines, for `heavy` and `charge` (redesigned,
  sections 7-8) and for any strip whose edit distorts a pose, a limb length or the head.

Route A prompt (one per image; fill in the `<...>`):

```text
Use case: precise-object-edit. Asset: hi-res pixel-art anime fan-art sprite strip, "<anim>" <PART A of 2 / PART B of 2 / single image>, <N> existing poses.
Input 1 EDIT TARGET: the approved "<anim>" strip<, part A / part B>. Input 2: the approved model sheet (his new broad build). Input 3: the approved expression sheet (his face only). Input 4: the approved idle strip (the new build and the scale anchor).< Input 5: the new part A of this version, for scale and continuity.>
Edit input 1: change ONLY his body build in every pose to match inputs 2 and 4: broad, square adult shoulders, a deeper chest, thicker upper arms and forearms, stronger thighs and calves filling the loose trousers, a V-shaped torso, slightly larger hands; the jacket and trousers stay loose and follow the bigger frame. Keep EXACTLY: every pose in the same order, every limb angle and joint position, the head (size, face, blindfold over the eyes, white hair, expression), his height and leg length, the hands in or out of the pockets as they are, the uniform design, the colors, the facing and 3/4 view, the feet on the baseline, the positions on the canvas and the gaps between poses. Turning, slouching, crouching or hands in the pockets never narrow the shoulders. Do not redraw the poses from the idle; do not enlarge the figures; no new poses, no effects, no labels.
<the BLINDFOLD line of the strip's PROMPTS.md block (superPose: its EYES line)>
<the STYLE, PALETTE and BACKGROUND lines of the strip's PROMPTS.md block>
```

**Per strip, every time:** a new `_vNN` (never overwrite), a sidecar `raw/<anim>_vNN.json` with `anatomy` (target =
his approved skull length measured on idle v02; copy the approved version's `frameOffsets` as a starting point and
recheck them, since a broader body moves the foot centering), re-measure that animation's `hitboxes.json` overrides
and `_hands` anchors (delete the stale ones before packing), one REVIEW row. Steps 1-4 (S1, idle, run, heavy) also
attach the lineup (scale standard).

| order | step | id · asset | frames | next version | route | notes |
|---|---|---|---|---|---|---|
| 1 | 1 | S1 · model sheet | | `model_sheet_v05` | edit of v03 (section 4) | **user approval + lineup**, then copy to `reference/model_sheet.png` |
| 2 | 2 | S2 · expressions | | keep v02 | none | the face does not change; regenerate (v03) only if the user wants the busts to show the new shoulders |
| 3 | 3 | A01 · `idle` | 8 (2 images) | `idle_v04` | A, edit of v02 | **user approval + lineup**, then copy to `reference/idle_approved.png`; this fixes the build for every later strip |
| 4 | 4 | A02 · `run` | 8 (2) | `run_v05` | A, edit of v03 | lineup |
| 5 | 5 | A03 `light1` · A04 `light2` · A05 `light3` · A06 `light4` | 7, 7, 7, 8 | v03 · v03 · v02 · v03 | A | wider kicks: keep inside x 4..251 |
| 6 | 5 | A07 · `heavy` | 8 (2) | `heavy_v02` | **B, redesign (section 7)** | lineup (f3) |
| 7 | 5 | A08 `airLight1` · A09 `airHeavy` | 5, 6 | v02 · v03 | A | |
| 8 | 6 | A10 `guard` · A11 `hurtHigh` · A12 `launched` · A13 `down` · A14 `getup` | 2, 3, 2, 2, 5 | v03 · v02 · v02 · v02 · v02 | A | lying poses get thicker, not longer |
| 9 | 7 | A15 · `charge` | 4 | `charge_v03` | **B, redesign (section 8)** | |
| 10 | 7 | A16 `beamCharge` · A17 `beamFire` · A18 `special` | 3, 3, 8 | v02 · v03 · v02 | A | re-measure the Red / Blue hand points and `beamFire` `_hands` |
| 11 | 8 | A19 `dash` · A20 `jumpUp` · A21 `jumpFall` · A22 `land` · A23 `win` | 2, 2, 2, 2, 4 | v03 · v03 · v03 · v03 · v02 | A | the core set is complete here |
| 12 | 9 | A33 `throw` · A37 `intro` first (every match shows them), then A24 `backDash` · A25 `superDash` · A26 `jumpSquat` · A27 `airLight2` · A28 `airLight3` · A29 `block` · A30 `hurtLow` · A31 `spin` · A32 `airRecover` · A34 `vanish` · A35 `stagger` · A36 `ko` · A38 `taunt` | | throw v02, intro v02, backDash v03, superDash v03, jumpSquat v03, airLight2 v02, airLight3 v02, block v02, hurtLow v02, spin v02, airRecover v02, vanish v02, stagger v02, ko v03, taunt v02 | A | `throw` f1 `_hands` re-measured |
| 13 | 9 | A41 `specialDown` · A39 `specialForward` · A42 `superPose` · A40 `specialUp` | 4, 7, 4, 6 | v02 each | A | `superPose` keeps the Six Eyes and the blindfold on the forehead |
| 14 | 11 | U1 · portrait 96×96 | | `ui_portrait_v02` | B (U1 block with the new lines) | **redo**: head and shoulders show the new build |
| 15 | 11 | U3 · select 384×384 | | `ui_select_v02` | B (U3 block with the new lines) | **redo**: full body |
| - | 11 | U2 · cut-in 480×128 | | keep v01 | none | eyes and brows only: unchanged |

The next-version numbers were read from the folders and REVIEW.md today; recheck before saving (1 + the highest
number anywhere, AGENTS.md).

**Lying rule (ADR 0020):** `down` (A13) and `ko` (A36) take **route B**, not an edit: the approved poses are drawn from above and float in the game, so draw them fresh side-on at the spec camera with the head, back, hips, legs and heels on y 240 ([SPEC.md "Lying poses"](../../SPEC.md#lying-poses); prompt lines and QA in [KO_DOWN_BRIEF.md](../../scale/KO_DOWN_BRIEF.md)); the packer's ground check must report nothing for `ko`, `down` f1 and `getup` f0.

## 7. `heavy` redesign: ONE-HAND RISING ELBOW INTO PALM

8 frames · phases 3/2/3 (startup f0-f2, active f3-f4, recovery f5-f7) · plays once · **CORE** · bodyHeight **228**
(his table) · ms 40/35/30/50/70/70/60/30 · prompt A07 (2 images: f0-f4 + f5-f7) · next version **v02**

**What is wrong now (v01):** f0-f2 are a guard, a crouch and a stance with the fist at the chin (f2 also has a stray
pixel cluster left of the body, about x 99, y 140); **f3 and f4 are the same pose**, a horizontal forearm at shoulder
height (both override boxes [160, 52, 36, 27], the frames pushed 22 px right by `frameOffsets`), which reads as a
short forearm jab or a block, not a launcher; f5 lands upright, f6 is a deep squat and f7 stands bolt upright with
straight legs (228 px, not the idle's bent-knee slouch), a big pop from f6 to f7.

**The move:** in his style, one hand is enough. The L hand **stays in its pocket for the whole move** (CHARACTER.md §4
changes `heavy` from "both out" to "L in pocket"). A lazy half step and a dip, then the R elbow drives up under the
chin, and from the elbow the forearm whips up into an open-palm uppercut that lifts the opponent off the floor. Elbow
first, then the palm: two beats on one rising line in front of his face.

Gameplay facts (`MOVES.heavy`, `src/game/fighter.js`): the same as for the cast. Startup 12 game frames (f0-f2), active
5 (f3 about 3, f4 about 2; 12 frames of hitstop freeze the active frame on a hit), recovery 22 (f5 is held longest; the
hop lands about 3 game frames into f6 and the engine then plays `land`). The lunge (5.5 units/s, falling to 0 by the
end of the active phase) moves him about 100 px on a whiff: draw the half step in place, feet never slide. The hop
(5 units/s on f3) lifts him about 43 px at its top: f3 on the ball of the R foot, f4-f5 airborne with the lowest point
under the hips, f6 reaching for the floor; no negative `frameOffsets` dy. Launch `[2.4, 15.5]`: straight up. Hit test:
the packed f3 / f4 boxes grown by `boxPad` [0.14, 0.3] (about 18 × 38 px).

- **Strike target:** f3: the R **elbow tip** in **x 180-208, y 58-86**, aim about x 194, y 80 (a standard opponent's
  chin is his own shoulder height); the elbow tip is the right-most pixel, the folded forearm and fist behind it.
  f4: the R **palm heel** in **x 160-188, y 22-46**, aim about x 174, y 32, in front of his face at brow height and
  never above the top of his hair. The hop lifts the sprite about 11-28 px during f3, so keep the f3 elbow low in
  its zone.
- **Height ceiling:** knees stay bent about 20° on f3-f4 and the head leans slightly over the elbow, so these frames
  stay about 226 px tall (top at y 14 or lower); no frame above y 8.
- **Smear:** f3 only: the R upper arm and elbow drawn as one solid tapered shape stretched back along their path in the
  navy sleeve colors, attached and behind or below the elbow. No separate streak.
- **Hair and cloth:** hair tips swept back on f2-f3, dragged down on f4 (rising), lifted on f6 (falling), settled on
  f7. The jacket hem flares on f2-f3 (the side slits open), lifts on f4-f6, settles on f7.
- **Scale:** the new build in every frame (section 2); pack with an anatomy sidecar (`raw/heavy_v02.json`), his
  approved head. `heavy_v01.json` (`frameOffsets` [22, -5] on f3-f4) belongs to v01: do not copy it.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `heavy_00` | startup | HALF STEP: the R hand slides out of its pocket, the L hand stays in its pocket; the L foot slides forward about 12 px, the weight shifting onto it; torso leans forward about 10° and turns away (R shoulder back, chest toward the viewer); the R arm folds, R fist at the R hip, elbow pointing back. | focused, a faint smile | Hem swings back · QA: hips over the midpoint between the feet |
| f1 | `heavy_01` | startup | DIP (the lowest frame): the long legs fold (knees about 40°), hips sink about 15 px, torso dips forward about 15°; the R elbow cocked low and back behind the hip; head up, looking down at the target. | focused | Hem pooled over the thighs · QA: about 200-205 px tall |
| f2 | `heavy_02` | startup | DRIVE: legs push up, hips and shoulders rotate toward the target, the R heel lifts; the R elbow swings forward and up past the stomach, forearm folded, fist near the chest. | focused | Hair tips swept back · QA: elbow about x 168, y 118; no stray pixels |
| f3 | `heavy_03` | **active** | RISING ELBOW: the R elbow tip drives up and forward through the opponent's chin height (his own shoulder height), the upper arm angled slightly upward, the forearm folded back so the R fist sits beside his own chin; torso turned almost to profile with the R shoulder leading, leaning back about 10°; up on the ball of the R foot, knees still bent about 20°; L hand in its pocket. | grin with teeth | **Smear** (above) · QA: elbow tip x 194 ±8, y 80 ±6, the right-most pixel; frame top at y 14 or lower |
| f4 | `heavy_04` | **active** | PALM LIFT: from the elbow the R forearm whips up into an open-palm uppercut, the heel of the palm leading upward, fingers spread back, the palm in front of his face at brow height; the elbow stays forward at shoulder height; he rises in the hop: the R foot leaves the floor with pointed toes, the L knee slightly bent (the L toes the lowest point); L hand in its pocket. | grin | Hair tips dragged down, hem lifted · QA: palm heel x 174 ±8, y 32 ±8 (zone x 160-188, y 22-46), never above the hair top |
| f5 | `heavy_05` | recovery | TOP OF THE HOP (held longest): the R palm still raised, 2-4 px lower than in f4; knees bent with the feet hanging, toes pointed under the hips; head tilted up at the launched opponent; L hand in its pocket. | grin | Hem lifted · QA: the lowest point under the hips |
| f6 | `heavy_06` | recovery | DROP: the R arm lowering with the palm turning down, knees bending, feet reaching for the floor toes first. | lazy smile | Hair tips and hem lift (falling) · QA: flows into `land` f0 (R arm out forward and down, L hand in the pocket) |
| f7 | `heavy_07` | recovery | Back in the relaxed stance, the R hand sliding back into its pocket (matches the new idle f0). | lazy smile | QA: within 1-2 px of idle v04 f0 (v01's f7 stood straight-legged) |

### A07 prompt blocks (replace the current A07)

8 frames, phases 3/2/3. **Two images** (poses 1-5, then 6-8). **Save as: `raw/_parts/heavy_vNN_A.png` and `raw/_parts/heavy_vNN_B.png`** (same NN = the next free version; today 02); Codex stitches them into `raw/heavy_vNN.png`. Attach: `reference/model_sheet.png` (v05), `reference/expressions.png`, `reference/idle_approved.png` (v04); for part B also part A, plus the approved `land` strip only if it has already been redrawn to the new build (in the order of section 6 it comes later; never attach a slim-build strip). Without it, delete the "Also attached" sentence from part B. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#heavy).

Part A (save as `raw/_parts/heavy_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, broad-shouldered, athletic man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall with a broad, athletic adult build: wide, square shoulders clearly broader than a teenage fighter's, a deep chest, solid upper arms and forearms, strong thighs and calves filling the loose trousers, a V-shaped torso tapering to a firm waist; very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest and broadest fighter in the game, clearly bigger than a 6.5-head teenage fighter, with exactly the compact head of the attached approved references (never enlarge or shrink it). Not chibi, not super-deformed, no big head, no oversized hands or feet, not a bodybuilder, not lanky or skinny, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose. The attached expression sheet shows his face only; take the body build from the attached model sheet and idle strip.

ANIMATION: "heavy", a one-handed rising launcher with the right (near) arm: his left hand stays in its trouser pocket the whole time; after a lazy half step and a dip, his right ELBOW drives up under the opponent's chin, then from the elbow his forearm whips straight up into an open-palm uppercut that lifts the opponent off the floor. 8 frames in total, numbered 1 to 8 from left to right; this image is PART A of 2 and shows only poses 1 to 5. Poses 4 and 5 are the HIT frames. Pose 4: the right elbow point leads, up and forward in front of him at the chin height of a shorter opponent standing on the right, the right-most part of the character. Pose 5: the right palm heel rises in front of his face at the height of his brow, never above the top of his hair. His hair, the jacket hem and the left arm stay behind the strike.
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
1. Half step: his right hand slides out of its pocket while the LEFT HAND STAYS IN ITS POCKET; the left foot slides a short step forward and the weight shifts onto it; torso leaning forward slightly and turning away from the opponent (right shoulder back, chest toward the viewer); the right arm folds with the right fist at the right hip and the elbow pointing back. Face: focused, a faint smile.
2. Dip, the lowest pose: his long legs fold (knees bent about 40 degrees), hips sink, torso dips forward; the right elbow cocked low and back behind the hip; head up, looking down at the opponent on the right. Face: focused. The jacket hem pooled over the thighs.
3. Drive: the legs push up, hips and shoulders rotate toward the opponent, the right heel lifts; the right elbow swings forward and up past his stomach with the forearm folded and the fist near his chest. Face: focused. Hair tips swept back.
4. IMPACT, the rising elbow: the right ELBOW drives UP AND FORWARD through the chin height of a shorter opponent on the right (about his own shoulder height), the upper arm angled slightly upward, the forearm folded back so his right fist sits beside his own chin; torso turned almost to profile with the right shoulder leading, leaning back slightly; up on the ball of the right foot with the knees still bent; left hand in its pocket. Face: grin with teeth. SMEAR: the right upper arm and elbow drawn as one solid tapered shape stretched back along their path in the navy sleeve colors, attached and behind the elbow (hard pixels, no blur).
5. IMPACT, the palm lift: from the elbow his right forearm whips straight up into an open-palm uppercut, the heel of the palm leading upward and the fingers spread back, the palm in front of his face at brow height and never above the top of his hair; the elbow stays forward at shoulder height; he rises in a short hop: the right foot leaves the floor with pointed toes, the left knee slightly bent; left hand in its pocket. Face: grin. Hair tips dragged down, the jacket hem lifted.
MOTION: A lazy, arrogant one-handed launcher: elbow first, then the palm, both rising IN FRONT of his face (they hit a shorter opponent on the right), never beside his own head; the left hand never leaves its pocket. Draw everything in place: the game moves him forward and adds the hop. No hand, elbow or foot ever goes above the top of his hair.

LAYOUT: one single horizontal row of exactly 5 poses on a 1536x1024 landscape canvas. Split the width into 5 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SCALE LOCK: preserve the approved character's skull-to-chin length, excluding hair. The nominal 31px value is not permission to enlarge Gojo; his approved proportions take precedence. Standing skeleton height is 215 px. Draw the source art at a declared common multiplier of 2x (skull 2 x the approved skull length, standing skeleton 2 x 215 px). Keep head size, torso width, upper-arm/forearm lengths and thigh/shin lengths constant in every pose and every part. Crouching, curling, jumping, raising a hand and leaning change pose bounds, not camera distance. Do not scale a pose to fill its slot. Leave empty background where needed. Use the same reference camera and perspective throughout. Build lock: keep the broad shoulders, chest and limb thickness of the attached model sheet and idle strip in every pose; turning, slouching, crouching or hands in the pockets change the pose, never the build.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

Part B (attach part A too, and the redrawn `land` strip if it exists; save as `raw/_parts/heavy_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, broad-shouldered, athletic man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall with a broad, athletic adult build: wide, square shoulders clearly broader than a teenage fighter's, a deep chest, solid upper arms and forearms, strong thighs and calves filling the loose trousers, a V-shaped torso tapering to a firm waist; very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest and broadest fighter in the game, clearly bigger than a 6.5-head teenage fighter, with exactly the compact head of the attached approved references (never enlarge or shrink it). Not chibi, not super-deformed, no big head, no oversized hands or feet, not a bodybuilder, not lanky or skinny, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose. The attached expression sheet shows his face only; take the body build from the attached model sheet and idle strip. Also attached: the approved "land" strip, for continuity: pose 7 must flow into its first pose.

ANIMATION: "heavy", a one-handed rising launcher with the right (near) arm; his left hand stays in its trouser pocket the whole time. 8 frames in total, numbered 1 to 8 from left to right; this image is PART B of 2 and shows only poses 6 to 8 (the attached part A shows poses 1 to 5).
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
6. Top of the hop, the pose held longest: in the air, the right palm still raised in front of his face (a little lower than in pose 5), the knees bent with the feet hanging and the toes pointed under his hips; head tilted up toward the opponent he launched; left hand in its pocket. Face: grin. The jacket hem lifted.
7. Dropping to land: the right arm lowering with the palm turning down, the knees bending, the feet reaching for the floor toes first; left hand in its pocket. Face: lazy smile. Hair tips and hem lifted by the fall.
8. Back in the relaxed stance with both hands in the pockets, the same as idle frame 1. Face: lazy smile.
MOTION: A lazy, arrogant one-handed launcher: elbow first, then the palm, both rising IN FRONT of his face, never beside his own head; the left hand never leaves its pocket. Draw everything in place: the game moves him forward and adds the hop. No hand, elbow or foot ever goes above the top of his hair.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SCALE LOCK: preserve the approved character's skull-to-chin length, excluding hair. The nominal 31px value is not permission to enlarge Gojo; his approved proportions take precedence. Standing skeleton height is 215 px. Draw the source art at a declared common multiplier of 2x (skull 2 x the approved skull length, standing skeleton 2 x 215 px). Keep head size, torso width, upper-arm/forearm lengths and thigh/shin lengths constant in every pose and every part. Crouching, curling, jumping, raising a hand and leaning change pose bounds, not camera distance. Do not scale a pose to fill its slot. Leave empty background where needed. Use the same reference camera and perspective throughout. Build lock: keep the broad shoulders, chest and limb thickness of the attached model sheet and idle strip in every pose; turning, slouching, crouching or hands in the pockets change the pose, never the build.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

## 8. `charge` redesign: effortless power-up

4 frames · loops · **CORE** · bodyHeight **215** (his table) · ms 50/50/50/50 · prompt A15 · next version **v03**
(v02 is rejected)

**What is wrong now (v01):** he stands straight-legged (knees locked) with the arms spread down and the palms to the
floor, and the four frames are almost identical (about 7 % of the silhouette changes between frames, the least in the
cast). With the thin build it reads as a mannequin.

**The move:** calm, not straining; he never shouts. The power does the work: his broad frame squares up and opens,
the fingers flex, and the energy's updraft tears at the hair tips, the jacket hem, the sleeves and the trouser legs.
The engine draws the blue aura flames, streaks, floor pebbles and glow and pulses his sprite with the character color
(`state 'charge'`, a free-running loop at 50 ms a frame, a 200 ms cycle). Loop rules: the **feet are identical in all
four frames**; the body moves 2-3 px at most (shoulders up on f1-f2, down on f3); the **head moves at most 2 px**; the
hair tips, hem, sleeves and trouser legs change shape by 2 to 5 px in every frame, always upward; f3 flows back into
f0 without a pop. No aura, glow or energy in the sprite.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `charge_00` | loop | CALM POWER: feet planted wide (well wider than his broad shoulders), knees bent about 15°, torso upright and square, chest open, shoulders back; both arms held out and down about 30° from his sides, palms open facing the floor, fingers spread and tense; chin slightly up. | lazy smile | Hair tips and jacket hem lifted, sleeves fluttering |
| f1 | `charge_01` | loop | SURGE: shoulders rise about 2 px and roll back, chest lifts, arms spread 2-3 px wider, fingers flex wider. | lazy smile | Hair tips stretched up 2 px, hem flared up, trouser legs rippling |
| f2 | `charge_02` | loop | PEAK: as f1 with a 1 px tremble to the right, head tilted back about 3°, the smile widening into a grin. | grin | Hair tips, hem and sleeves at their highest (third shape) |
| f3 | `charge_03` | loop | SETTLE: shoulders and arms ease back 1-2 px; flows into f0. | lazy smile | Hem and hair tips drop 2 px into a fourth shape |

### A15 prompt block (replace the current A15)

4 frames, loops. **Save as: `raw/charge_vNN.png`** (next free version; today 03). Attach: `reference/model_sheet.png` (v05), `reference/expressions.png`, `reference/idle_approved.png` (v04). Details and QA: [ANIMATIONS.md](ANIMATIONS.md#charge).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, broad-shouldered, athletic man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall with a broad, athletic adult build: wide, square shoulders clearly broader than a teenage fighter's, a deep chest, solid upper arms and forearms, strong thighs and calves filling the loose trousers, a V-shaped torso tapering to a firm waist; very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest and broadest fighter in the game, clearly bigger than a 6.5-head teenage fighter, with exactly the compact head of the attached approved references (never enlarge or shrink it). Not chibi, not super-deformed, no big head, no oversized hands or feet, not a bodybuilder, not lanky or skinny, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose. The attached expression sheet shows his face only; take the body build from the attached model sheet and idle strip.

ANIMATION: "charge", an effortless power-up: he squares his broad frame and opens up while the power does the work, tearing at his hair and clothes; he never strains and never shouts. 4 frames, left to right. It loops: the last frame must flow smoothly back into the first.
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
1. Calm power: feet planted wide, well wider than his broad shoulders; knees slightly bent; torso upright and square with the chest open and the shoulders back; both arms held out and down from his sides at about 30 degrees, palms open facing the floor, fingers spread and tense; chin slightly up. Face: calm lazy smile. Hair tips and the jacket hem lifted by a rising wind, sleeves fluttering.
2. Surge: the shoulders rise slightly and roll back, the chest lifts, the arms spread a little wider and the fingers flex wider. Face: lazy smile. Hair tips stretched upward, the jacket hem flared up, the trouser legs rippling.
3. Peak: the same as pose 2 with a very small tremble (shifted very slightly to the right), the head tilted back a touch, the smile widening into a confident grin. Face: grin. Hair tips, jacket hem and sleeves at their highest, in a third shape.
4. Settle: the shoulders and arms ease back slightly; the hem and hair tips drop a little into a fourth shape; it flows straight back into pose 1. Face: lazy smile.
MOTION: Effortless power: his body barely moves and his feet never move; the energy does the work: the hair tips, jacket hem, sleeves and trouser legs blow UPWARD and change shape in every pose. Draw NO aura, no glow and no energy: the game adds them.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SCALE LOCK: preserve the approved character's skull-to-chin length, excluding hair. The nominal 31px value is not permission to enlarge Gojo; his approved proportions take precedence. Standing skeleton height is 215 px. Draw the source art at a declared common multiplier of 2x (skull 2 x the approved skull length, standing skeleton 2 x 215 px). Keep head size, torso width, upper-arm/forearm lengths and thigh/shin lengths constant in every pose and every part. Crouching, curling, jumping, raising a hand and leaning change pose bounds, not camera distance. Do not scale a pose to fill its slot. Leave empty background where needed. Use the same reference camera and perspective throughout. Build lock: keep the broad shoulders, chest and limb thickness of the attached model sheet and idle strip in every pose; turning, slouching, crouching or hands in the pockets change the pose, never the build.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

## 9. Acceptance checks

For the model sheet (section 4), then for every packed strip (`npm run sprites gojo`):

1. **Lineup** (scale standard): idle f0, run f3 (flight) and heavy f3 of the new Gojo next to Naruto, Sasuke and
   Killua on one floor line at 2x, saved as `art/scale/lineup-gojo-<asset>_vNN.png` and linked in the REVIEW row for
   S1, idle, run and heavy. In it Gojo must read as the biggest fighter, broad and tall, without looking heavy.
2. **Shoulder width (blocking):** packed idle f0, shoulder band **78-86 px** (median over the 8 frames), deltoid to
   deltoid **74-84 px**, max width **100-108 px**; chest, waist and limb windows of section 2. Outside a window =
   rejected, whatever the pack report says.
3. **Head (blocking, CHARACTER_SCALE.md gate):** the blindfold band, face and hair crown overlay idle v02's within
   1 px (same skull-to-chin, same hair height above the skull); every sidecar's `targetHeadPx` is his approved value.
4. **Height:** standing skeleton 215 ±5 % (204-226); idle 219-223 px including hair; no frame above y 8.
5. **Consistency in every strip:** shoulder and torso widths within ±8 % of the new idle's in comparable views; no
   strip slims him (slouch, turn, pockets, crouch). The head within ±2 px of idle in comparable views.
6. **Technical:** at most 48 colors (the 29 of §7, nothing new), nothing clipped in x 4..251 (wider kicks and lying
   poses), feet on the pivot, blindfold on (eyes only in `superPose`), the pockets schedule (with the new `heavy`).
7. **Boxes and anchors:** each redrawn animation's `hitboxes.json` overrides (today `light1`, `airLight1`,
   `airLight2`, `special`, `specialForward`, `specialUp`, `heavy`) and `_hands` anchors (`throw` f1, `beamFire`
   f0-f2) re-measured on the new frames; stale ones deleted before packing.
8. **Heavy:** f3's box on the elbow inside x 180-208, y 58-86; f4's box on the forearm and palm inside x 160-188,
   y 22-46; the L hand in its pocket in all 8 frames; f7 matches idle v04 f0. **Charge:** feet identical, the loop
   seamless, visible shoulder and cloth motion, no aura.
9. **In game** (`?fight=gojo,naruto&mode=solo&art=custom&debug` and the other cross matches): the normals connect
   from normal spacing, the heavy launches, the CPU-vs-CPU soak is clean (Claude, section 10), and the user checks the
   preview deploy on the phone before the merge.

## 10. Follow-ups

1. **Done by Claude (2026-10-10, PR #23):** art/CHARACTER_SCALE.md ("User decision 2026-10-10", canon height, build
   classes, the lineup review and the build gate), the ADR 0010 note, art/SPEC.md's note that the heavy's striking
   limb is the fighter's own, and `npm run lineup` (`--candidate` for the model sheet view).
2. **Codex, in the `art/gojo-build` branch:**
   - Gojo CHARACTER.md: the "User direction" paragraph ("slender silhouette"), the one-paragraph look and the §9
     fallback ("slender" → "athletic"), §2 item 10 Build (the section 2 targets), the §4 pockets table (`heavy` →
     "L in pocket").
   - Gojo PROMPTS.md and ANIMATIONS.md: the "Current correction" banner ("slender body"), the section 5 lines in
     every block, the new A07 / A15 blocks, the Conventions "Proportions" bullet (the build targets), and the `heavy`
     and `charge` entries (sections 7-8, in that file's bullet format).
   - The ART-SCALE-01 banners at the top of all four fighters' CHARACTER.md and PROMPTS.md ("compact head and slender
     adult proportions" → "compact head and an athletic adult build").
   - `art/scale/builds.json`: Gojo's `deltoidPx` measured on the approved new idle.
3. **Claude, after the art PR:** the ADR 0010 reach table and a CPU-vs-CPU soak (at least 3 matches, Gojo vs each
   fighter). His packed hurt boxes get roughly 30 % wider (the packer insets the bounding box by 18 % per side), so
   check that his defense 1.05 still feels right and that the normals' whiff and hit spacing hold (TASKS ENG-061).
