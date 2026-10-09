# Style guide

How GCD Tourney should **look and move**. Numbers (sizes, pivot, heights, contact zones) live in
[SPEC.md](SPEC.md). This file is about taste and craft. Read it before writing or running any
prompt.

## North star

An **HD-2D anime arena fighter**: hi-res pixel-art fighters standing in a real 3D tournament
ring, with the speed and impact of Dragon Ball FighterZ. Every fighter should look like the
**original manga/anime design**, translated into crisp hi-res pixel art (about 2x the detail of the
old placeholders). A fan should recognize the character from the silhouette alone.

Three tests every frame must pass:

1. **Identity**: is this obviously the character (hair shape, outfit, colors, face)?
2. **Readability**: at 1x zoom, in one glance, can you tell what the pose is doing?
3. **Impact**: on an attack's active frame, is it obvious where the hit lands?

## Character look

### Identity first

- The design comes from the character's anime/manga look: hair silhouette, outfit pieces, colors,
  accessories, eye color, face marks. Each character's `CHARACTER.md` has an **identity checklist**.
  If a frame fails one item, regenerate it.
- Prompts **describe the visual traits** (hair, outfit, colors, silhouette) instead of relying on
  a character name or an artist's name. Say "anime fan-art sprite". Never ask for "the style of
  <living artist>".
- The **approved model sheet** (`reference/model_sheet.png`) is the identity anchor. It is attached
  to every prompt.

### Proportions and anatomy

- About **4 to 4.5 heads tall**: anime-accurate but slightly stylized so heads, hands and feet read
  at small size. Standing about 136 px to the top of the skull, plus up to 16 px of hair.
- Big expressive eyes (both visible thanks to the 3/4 head turn), a 1-2 px nose, a clear mouth
  line. Hands slightly oversized; fists are solid, readable blocks.
- Same head size, hand size and limb length in every frame of every animation.

### Shading, light, outline

- Key light from the **upper-front-right** (the character's front). Shadows fall to the back and
  underneath.
- **3-4 tones per material** (shadow, base, light, optional highlight), hard cel shapes. No
  gradients, no soft airbrush, no noise.
- Hue-shift the ramps: shadows lean cooler/more saturated, highlights warmer. Use the hex palette in
  `CHARACTER.md`; never invent new colors per frame.
- **1 px dark outline**. Selective outline is welcome (the outline takes a darker shade of the fill
  on lit edges), but the silhouette must stay closed and crisp.
- The **far** arm and leg can be one tone darker than the near ones: it separates depth instantly.
- Hair: big, readable clumps with a highlight band; keep the same spike count and layout in every
  frame (it is the #1 identity feature for most anime characters).
- Cloth: few, bold folds. Fabric that flutters (headband tails, scarf, sleeves, coat tails) is your
  secondary-motion tool, so keep it simple enough to redraw consistently.

### Things that never go into a body sprite

Aura, energy, beams, sparks, speed lines, motion blur, ground shadows, floors, text, logos with
letters. The engine draws all VFX ([vfx/EFFECTS.md](vfx/EFFECTS.md)) and the shadow. A small
held weapon (shuriken, kunai, sword) is part of the sprite.

## Camera, facing and mirroring

- Always draw **facing screen-right**, 3/4 view: body turned about 35 degrees toward the camera,
  head a bit more so both eyes show, camera slightly above (about 12 degrees).
- The engine **mirrors** the sprite when the fighter faces left. Asymmetric details (a knot on one
  side, a crest on the back, a scar) swap sides when mirrored. That is normal in 2D fighters; just
  avoid letters or text anywhere on the character.
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
5. **Hold the hit.** Active frames are 2 near-identical frames (1-2 px change, hair/cloth still
   moving) so the hit pose is readable during hitstop.
6. **Follow-through and overlapping action.** Hair, headband tails, sleeves and cloth lag 1-2 frames
   behind the body and settle after it stops.
7. **Recover to the stance.** The last frame of a grounded attack matches the idle stance closely
   so chains (light1 -> light2 -> light3 -> light4) blend.
8. **Weight.** Feet are planted and do not slide. The hips lead the shoulders. Kicks need a
   counter-lean. Landings squash.
9. **Squash and stretch,** lightly: jump squat, landing, vanish, big hits. Never change the head
   size.
10. **Arcs.** Kicks and swings travel on arcs; uppercuts rise in front of the body, not beside it.
11. **Loops** (idle, run, guard, charge, beams, win) must cycle: the last frame flows into the first.
12. **In-place.** Draw everything in place. The engine moves the fighter (run, dash, jumps,
    lunges, knockback); the packer re-centers the feet anyway.

## Combat readability: making hits connect

The user's top complaint with the placeholders: **hits registered without the fist or foot
touching the body.** The hi-res art fixes this at the source:

- **Strikes go horizontally toward screen-right** at the height of the zone they hit (HIGH face,
  MID chest, LOW stomach). The targets are in [SPEC.md, Strikes and contact
  zones](SPEC.md#strikes-and-contact-zones). Both fighters are the same size, so "face height" in
  your cell is the opponent's face height.
- On every **active** frame the striking fist/foot/palm is the **forward-most pixel** of the
  silhouette. Hair, scarves or flying cloth must not stick out further forward (the packer builds
  the hitbox from whatever extends forward).
- The striking limb is **clearly separated** from the body by negative space, with a closed solid
  fist or a visible sole/heel. No open fingers on punches.
- The **idle stance stays compact** (lead fist around x 125-135): it is the baseline the packer
  compares attacks against.
- **Reactions recoil away from the hit**: toward screen-left (backward) in the character's own
  facing-right frame. Hurt poses keep the body compact so the hurtbox matches the art.
- Lying poses (`down`, `ko`): head toward screen-left, feet toward screen-right.
- The engine fights in 2.5D lanes and auto-steps attacks to line up depth, so you never need to
  angle a strike toward or away from the camera. Keep it horizontal.

## Expressions

Draw these on the expression sheet first, then reuse them:

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
- UI: same pixel-art language as the sprites. Portraits and cut-ins use the same palette as the
  character. Logo and title art: [ui/README.md](ui/README.md).

## Prompt language rules

- Lead with **"hi-res pixel art anime fan-art sprite"**, then the traits, palette hexes, view,
  pose list, and the technical rules. Each character's `PROMPTS.md` has ready-made blocks.
- **Describe, don't name.** "Teenage ninja with spiky golden-yellow hair, three whisker marks on
  each cheek, orange-and-black jumpsuit..." works better and more reliably than a name.
- No artist names, no "in the style of <studio>".
- **Fallback wording** when ChatGPT refuses or drifts: drop any character/series names, keep the
  trait description, and add "original character inspired by classic shonen ninja anime, fan-art
  sprite for a personal non-commercial game project". If it still refuses, say so in the tracker
  notes and ask Claude/Codex to rephrase the traits.
- Legal: recognizable anime characters are fine for a personal/fan demo. A public or commercial
  release needs licenses from the rights holders, or original characters.

## Do and don't

| do | don't |
|---|---|
| attach the approved model sheet + latest approved strip every time | trust ChatGPT to remember the design between chats |
| one animation per image, one horizontal row | full sheets, grids, or several animations in one image |
| restate the palette hexes in every prompt | let colors drift ("slightly more orange this time") |
| strikes horizontal toward screen-right | diagonal punches toward the camera |
| solid smear shapes | motion blur, speed lines, glow |
| flat #FF00FF background | gradients, floors, shadows, scenery behind the character |
| same scale for every pose in a strip | a zoomed-in pose mixed with full-body poses |
| regenerate single bad frames | accept a strip with one off-model frame |
