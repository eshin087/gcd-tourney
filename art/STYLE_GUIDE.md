> **Active baseline, user approved 2026-10-11:** [Approved cast baseline](scale/APPROVED_CAST_BASELINE.md) supersedes historical scale/build numbers below for the full redraw. Preserve common height ratios and individually measured anatomy; old values describe shipped art only. Claude owns formal spec/ADR integration.

# Style guide

Required for every fighter and every body strip: [shared scale and anatomy gate](CHARACTER_SCALE.md). Technical packing success does not establish anatomical consistency.

How GCD Tourney should **look and move**. Numbers (sizes, pivot, heights, contact zones) live in
[SPEC.md](SPEC.md) (hi-res sprite spec v2, [ADR 0007](../docs/decisions/0007-art-spec-v2-shippuden-256.md)).
This file is about taste and craft. Read it before writing or running any prompt.

## North star

An **HD-2D anime arena fighter**: hi-res pixel-art fighters standing in a real 3D tournament
ring, with the speed and impact of Dragon Ball FighterZ. Every fighter should look like the
**official Naruto Shippuden anime design**, translated into crisp hi-res pixel art in a 256 px cell
(a ~200 px tall body; the old 3D-baked placeholders use 112 px cells). A fan should recognize the
character from the silhouette alone.

**Tone: serious.** These are teenage shinobi who fight to win, drawn the way the Shippuden anime
draws its fights: real anatomy, weight, tension, restrained faces. Not chibi, not super-deformed, not
a mascot or a toy, and not western-realistic either. Spec v1 came out chibi; v2 exists to fix that.

Three tests every frame must pass:

1. **Identity**: is this obviously the character (hair shape, outfit, colors, face)?
2. **Readability**: at 1x zoom, in one glance, can you tell what the pose is doing?
3. **Impact**: on an attack's active frame, is it obvious where the hit lands?

## Character look

### Identity first

- The design comes from the character's **Shippuden** look: hair silhouette, outfit pieces, colors,
  accessories, eye color, face marks. Each character's `CHARACTER.md` has an **identity checklist**.
  If a frame fails one item, regenerate it.
- Prompts **describe the visual traits** (hair, outfit, colors, silhouette) instead of relying on
  a character name or an artist's name. Say "anime fan-art sprite". Never ask for "the style of
  <living artist>".
- The **approved model sheet** (`reference/model_sheet.png`) is the identity anchor. It is attached
  to every prompt.

### Proportions and anatomy (about 6.5 heads)

The body is measured in **heads** (top of skull to chin, about **31 px** in the idle). A standing
upright body is about 200 px, so about 6.5 heads; hair adds up to about 20 px on top. Use these as
the drawing grid (idle landmarks from SPEC, y in the 256 cell):

| part | proportion | idle landmark |
|---|---|---|
| head | 1 head (~31 px) from skull top to chin; eyes about halfway down the head | skull 52, eyes 66-70, chin 83 |
| neck and shoulders | a short visible neck; shoulders about 2 head-widths wide, sloping trapezius | shoulders 92 |
| torso | chest and ribcage about 1 head, waist narrower than the shoulders (athletic V-taper, not bulky) | chest 96-124, belt 124-150 |
| hips | crotch at about the middle of the standing body | hips 152 |
| legs | about half the body; the knee halfway between hip and sole; the foot about 1 head long | knees 196, soles 240 |
| arms | elbow at the waist, wrist at the crotch when the arm hangs; upper arm and forearm about equal | - |
| hands | about 3/4 of the face height; a fist about 2/3 of the head width; not oversized | - |

- **Smaller head, longer limbs.** The head is about 15 % of the height, not 25 %. Eyes are anime eyes
  in the Shippuden shape: narrower and more angular than chibi eyes, with a clear brow line; a 1-2 px
  nose; a short mouth line; a defined jaw and chin.
- **Joints read as joints.** Elbows, knees, wrists and ankles are clear angles in the silhouette, not
  rubber curves. A bent limb shows the bone line: upper arm and forearm keep their length.
- **Same head size, hand size and limb length in every frame of every animation.** Measure the head
  against idle when in doubt.
- **Muscle is shape, not lines.** Shoulders, forearms and calves are shown with one or two shadow
  shapes from the key light, not with drawn contour lines or noise.

### 3/4 view and foreshortening

- The torso turns about 35 degrees toward the camera, so the **far** shoulder sits a little narrower
  and partly behind the chest, and the chest reads about three-quarters as wide as in a front view.
- The far arm and leg look slightly shorter and sit a few px higher (camera about 12 degrees above);
  the near limbs overlap the torso and are drawn in front of it.
- The head turns a bit more than the body so **both eyes show**; the far eye is a little narrower.
- Limbs pointing toward or away from the camera are rare (strikes stay horizontal), but when a knee
  chambers or an arm crosses the body, shorten the hidden segment instead of bending it.

### Weight and balance

- The center of gravity sits over the base. In the fighting stance it is between the feet, slightly
  forward; the torso leans a little into the fight.
- The planted leg carries tension (straighter, heel down); the free leg is relaxed.
- **The hips lead the shoulders** on every strike; the shoulders lead the arm.
- Landings and big hits compress the body (knees bend, shoulders drop) without changing the head.

### Shading, light, outline

- Key light from the **upper-front-right** (the character's front). Shadows fall to the back and
  underneath.
- **3-5 tones per material**, hard cel shapes. Use the extra tones (compared with v1) for form:
  a deep shadow in the folds and under the jaw, a light plane, a small highlight. No gradients, no
  soft airbrush, no noise, no dithering fills.
- **Palette <= 48 colors per character** (the packer warns above 64). A typical budget:

| material | tones | example |
|---|---|---|
| skin | 4-5 | deep shadow, shadow, base, light, (highlight) |
| hair | 4-5 | the main identity color, with a highlight band |
| main cloth (jacket / shirt) | 4-5 | |
| second cloth (pants, black panels) | 4 | |
| third cloth / belt / bands | 3-4 | |
| metal (forehead plate, zipper, sword guard) | 3-4 | |
| eyes | 2-3 | iris, pupil/shadow, catchlight |
| accessories (sandals, pouches, wraps, rope, scabbard) | 6-10 | 2-3 tones each |
| outline | 1-3 | darkest outline plus colored-outline shades |

  The exact hexes are in each character's `CHARACTER.md`; never invent new colors per frame.
- Hue-shift the ramps: shadows lean cooler and more saturated, highlights warmer.
- **1 px dark outline**. Selective outline is welcome (the outline takes a darker shade of the fill
  on lit edges), but the silhouette must stay closed and crisp.
- The **far** arm and leg can be one tone darker than the near ones: it separates depth instantly.
- Hair: big, readable clumps with a highlight band; keep the same spike count and layout in every
  frame (it is the #1 identity feature for most anime characters).
- Cloth: bold folds at the joints (elbow, knee, waist), few elsewhere. Fabric that flutters (headband
  tails, open jacket or shirt edges, rope belt ends) is your secondary-motion tool, so keep it simple
  enough to redraw consistently.

### Things that never go into a body sprite

Aura, energy, beams, sparks, speed lines, motion blur, ground shadows, floors, text, logos with
letters. The engine draws all VFX ([vfx/EFFECTS.md](vfx/EFFECTS.md)) and the shadow. A held or worn
weapon (shuriken, kunai, a sheathed sword) is part of the sprite.

## Camera, facing and mirroring

- Always draw **facing screen-right**, 3/4 view: body turned about 35 degrees toward the camera,
  head a bit more so both eyes show, camera slightly above (about 12 degrees).
- The engine **mirrors** the sprite when the fighter faces left. Asymmetric details (a knot on one
  side, a crest on the back, a sword on one hip) swap sides when mirrored. That is normal in 2D
  fighters; just avoid letters or text anywhere on the character.
- "Near" side = the character's right side (closer to the camera, drawn over the body). "Far" side =
  left side (partly behind the body). Orthodox stance: **lead = far** side forward, **rear = near**
  side back.

## Animation principles

The gameplay timing is fixed in code (`src/game/moves.js`), so the art's job is **poses**: strong,
clear, consistent keys in the right phase.

1. **Key poses first.** For an attack: anticipation, strike (active), recovery. Breakdowns only
   help those three read.
2. **Anticipation.** Every attack starts by moving the opposite way: the fist pulls back, the
   shoulders turn away, the knee chambers. 1-3 startup frames. Bigger move, bigger wind-up.
3. **Line of action.** On the active frame, one clean line runs from the planted foot (or the
   hips) through the shoulder to the fist or foot, **straight toward screen-right**. No bent
   "noodle" limbs on a hit frame.
4. **Smears.** Fast strikes may use one smear frame (the frame just before or at contact): the limb
   drawn as a solid stretched shape along its arc, in the limb's own colors or a pale tint of
   them. No blur, no transparency, no speed lines.
5. **Hold the hit.** Active frames are 2 near-identical frames (1-3 px change, hair/cloth still
   moving) so the hit pose is readable during hitstop.
6. **Follow-through and overlapping action.** Hair, headband tails, open shirt or jacket edges and
   the rope belt lag 1-2 frames behind the body and settle after it stops.
7. **Recover to the stance.** The last frame of a grounded attack matches the idle stance closely
   so chains (light1 -> light2 -> light3 -> light4) blend.
8. **Weight.** Feet are planted and do not slide. The hips lead the shoulders. Kicks need a
   counter-lean. Landings squash.
9. **Squash and stretch,** lightly and realistically: jump squat, landing, vanish, big hits. Never
   change the head size or the limb lengths.
10. **Arcs.** Kicks and swings travel on arcs; uppercuts rise in front of the body, not beside it.
11. **Loops** (idle, run, guard, charge, beams, win) must cycle: the last frame flows into the first.
12. **In-place.** Draw everything in place. The engine moves the fighter (run, dash, jumps,
    lunges, knockback); the packer re-centers the feet anyway.
13. **Fit the cell.** A 6.5-head body lying flat or flying is about 210-240 px long. Follow the SPEC
    pose notes: `superDash` angled about 25 degrees upward with bent knees, `launched` arched
    diagonally, `down` / `ko` flat with the head toward screen-left.

## Combat readability: making hits connect

The user's top complaint with the placeholders: **hits registered without the fist or foot
touching the body.** The hi-res art fixes this at the source:

- **Strikes go horizontally toward screen-right** at the height of the zone they hit (HIGH face
  y 58-90, MID chest y 92-124, LOW stomach y 122-152). The targets are in [SPEC.md, Strikes and
  contact zones](SPEC.md#strikes-and-contact-zones). Both fighters are the same size, so "face height"
  in your cell is the opponent's face height.
- On every **active** frame the striking fist/foot/palm is the **forward-most pixel** of the
  silhouette. Hair, cloth, a sword hilt or a rope end must not stick out further forward (the packer
  builds the hitbox from whatever extends forward).
- The striking limb is **clearly separated** from the body by negative space, with a closed solid
  fist or a visible sole/heel. No open fingers on punches.
- The **idle stance stays compact** (lead fist around x 170-185): it is the baseline the packer
  compares attacks against.
- **Reactions recoil away from the hit**: toward screen-left (backward) in the character's own
  facing-right frame. Hurt poses keep the body compact so the hurtbox matches the art.
- Lying poses (`down`, `ko`): head toward screen-left, feet toward screen-right.
- The engine fights in 2.5D lanes and auto-steps attacks to line up depth, so you never need to
  angle a strike toward or away from the camera. Keep it horizontal.

## Expressions

Draw these on the expression sheet first, then reuse them. Keep them in the serious Shippuden range:
intense and controlled, with big emotion saved for shouts and pain.

| expression | used in |
|---|---|
| determined / neutral | idle, run, guard, most recovery frames |
| angry / focused | attacks, special startup, intro |
| shout (mouth open) | heavy, specials, charge, beamCharge, beamFire |
| grin / smirk | taunt, win (character-specific) |
| pain (eyes squeezed) | hurtHigh, hurtLow, block, launched |
| eyes closed | ko, down |
| dizzy | stagger |

Eye special states (for example red eyes for a clan technique) are listed in the character's
`CHARACTER.md`.

## VFX and UI look

- VFX: bold hard-edged shapes, 2-4 tones, white/light grey for tinted effects. Details in
  [vfx/EFFECTS.md](vfx/EFFECTS.md).
- UI: same pixel-art language and proportions as the sprites. Portraits and cut-ins use the same
  palette as the character. Logo and title art: [ui/README.md](ui/README.md).

## Prompt language rules

- Lead with **"hi-res pixel art anime fan-art sprite"**, then the traits, palette hexes, view,
  pose list, and the technical rules. Each character's `PROMPTS.md` has ready-made blocks.
- **State the proportions in every prompt, positive first, then the negatives**: "about 6.5 heads
  tall, anime-accurate Shippuden-era proportions, athletic teenage build, long legs, small head,
  defined shoulders; serious tone; not chibi, not super-deformed, no big head, no oversized hands or
  feet, not western-realistic". Image generators drift back to big heads when this is missing.
- **Describe, don't name.** "Teenage ninja with spiky golden-yellow hair, three whisker marks on
  each cheek, a black-and-orange zip-up jacket..." works better and more reliably than a name.
- No artist names, no "in the style of <studio>".
- Attach the approved references (`reference/model_sheet.png`, `reference/expressions.png` after S2,
  and `reference/idle_approved.png` once it exists) as image inputs. As identity references, attach
  only approved fixed-name files. Two exceptions: (a) a Part B prompt attaches Part A of the same
  version; (b) a retry of S1/S2 or a strip fix may attach the candidate being corrected, together with
  the list of changes. Never attach `reference/source/`, `reference/_old/` or a v1 image.
- **Fallback wording** when the generator refuses or drifts: drop any character/series names, keep
  the trait description, and add "original character inspired by classic shonen ninja anime, fan-art
  sprite for a personal non-commercial game project". If it still refuses, say so in the REVIEW row or
  tracker notes and ask Claude/Codex to rephrase the traits.
- Legal: recognizable anime characters are fine for a personal/fan demo. A public or commercial
  release needs licenses from the rights holders, or original characters.

## Do and don't

| do | don't |
|---|---|
| attach the approved model sheet + latest approved strip every time | trust the generator to remember the design between threads |
| restate "about 6.5 heads, not chibi" in every prompt | accept a big-headed, short-legged result "because the pose is good" |
| one animation per image, one horizontal row | full sheets, grids, or several animations in one image |
| one character per image (Naruto and Sasuke in separate threads) | both fighters in one generated sprite image |
| restate the palette hexes in every prompt | let colors drift ("slightly more orange this time") |
| strikes horizontal toward screen-right | diagonal punches toward the camera |
| solid smear shapes | motion blur, speed lines, glow |
| flat #FF00FF background | gradients, floors, shadows, scenery behind the character |
| same scale for every pose in a strip | a zoomed-in pose mixed with full-body poses |
| save every image as a new `_vNN` | overwrite or rename an earlier version |
| regenerate single bad frames | accept a strip with one off-model frame |
