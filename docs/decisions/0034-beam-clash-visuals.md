# 0034. Beam clash visuals: a shape per move, struggle poses and clash effects

- Status: Proposed
- Date: 2026-10-15
- Deciders: User, Claude
- Amends: [0027](0027-beam-clash-energy-struggles.md) (how a struggle is drawn; its rules and numbers stand),
  [0017](0017-ultimate-variety-and-rhythm-clashes.md) (the ultimate clash gets the same drawing fixes)

## Context

The user (2026-10-15): "The beam clash has a lot of visual bugs and I think the art and animation can be much better
and more iconic looking to each character." Frame-stepped in the lab (Killua vs Sasuke, Naruto vs Gojo), and confirmed
by the user from real matches:

1. **Fighters lost in white.** The struggle-point flare, the bloom, the aura streaks and the end flash bury the
   fighters; Killua is invisible for most of a clash against Sasuke, and the end flash whites out the screen.
2. **A glow ball over the firer.** The beam's origin bulb (`beamO`, drawn in front of the sprites) covers the body.
3. **Misaligned streams.** Each stream aims at the opponent's chest from its own hand (Killua's at 0.65 up,
   Sasuke's at 1.0), so the two meet at a kink, and the Rasengan floats 1.5 ahead of Naruto's hand.
4. **Blocky beams.** The shader's streaks are hard rectangles that scroll along the ribbon and read as a glitch.
5. **No identity.** Narukami, Chidori Spear and the Rasengan are the same blue-white ribbon; Reversal: Red becomes a
   long red laser, which is not how Red looks.
6. **The HUD covers the clash.** BEAM CLASH! sits over a fighter for about a second; the rhythm ring sits on the
   meeting point.
7. **Flat poses.** Each fighter holds the `beamFire` release (or the rush frame), not a strain against the other side.

The user decided (2026-10-15): **each move keeps its own shape** in the struggle; the work covers **both** the beam
clash and the ultimate clash; Codex draws **struggle push poses**, a **meeting-point effect** and **per-move stream
effects** (every image still needs the user's approval).

## Decision

### 1. Drawing fixes (engine, both clash tiers)

- **Aligned streams.** In a clash every stream and held rush aims at the struggle point, from the hand of the pose
  actually shown (`hand('beamStruggle')`, else `hand('beamFire')`, else the fixed offset). A rush body's orb sits at
  the drawn hand and the struggle point starts at its surface, not 1.5 ahead.
- **Readable fighters.** Effects stay off the bodies: the origin bulb shrinks to the palm and draws behind the sprite;
  the struggle point flare has a size budget below the fighters' height; aura streaks are suppressed while a clash
  runs; the start and end flashes are colored, short and under the fighters' layer budget (no full-screen white).
- **No blocks.** The ribbon shader's rectangles become thin, tapered streaks along the flow.
- **HUD out of the way.** BEAM CLASH! and the attack names sit above the fighters' heads and leave sooner; the rhythm
  ring and bar sit below the floor line of the clash.

### 2. A shape per move (data)

`PROJECTILES[id].stream.style` (and `def.beam.style` for the ultimate beams) picks how a stream is drawn:

| style | move | drawn as |
|---|---|---|
| `bolt` | Narukami (Killua) | a thick, branching zigzag of lightning, flickering |
| `lance` | Chidori Spear (Sasuke) | a thin, straight blade of lightning with crackle around it |
| `flame` | Great Fireball (Sasuke, air) | a rolling torrent of fire that widens toward the point |
| `orb` | Reversal: Red (Gojo) | a pulsing red sphere held at the fingertip, pushing a repulsion wave |
| `ribbon` | ultimate beams (Kamehameha) | the shader ribbon, fixed as above |

A rush special (`clash: 'rush'`: Rasengan, Rasenshuriken, Chidori, Dragon Fist) stays a held technique at the hand.
No code names a character: a new fighter picks a style in its data.

### 3. `beamStruggle`: an optional struggle pose

A new optional animation (3 frames, loop, 70 ms each, body height 198, `FALLBACK` -> `beamFire`): **braced and
pushing the fighter's 1-bar energy move into the opponent's, straining** (front knee bent, back leg driving, the
technique hand(s) forward at the `hand` point, hair and clothes blown back). The content follows the fighter's
energy move, like `beamCharge` / `beamFire` follow the kit: Naruto holds the Rasengan out in one palm, Sasuke thrusts
the Chidori Spear arm, Killua points the Narukami hand, Gojo holds Red at two fingertips, Goku drives the Dragon Fist.
Its `hand` (hitboxes.json) is the stream origin. The struggle tier plays it for both sides when the sheet has it; the
ultimate clash keeps its strike poses. Luffy has no energy move, so he needs no strip.

### 4. Clash effects (VFX atlas)

Five new atlas effects (128 cell, ppu 56), each with a procedural stand-in in `src/art/vfxPainter.js` until the user
approves the art:

| effect | frames | ms | color | anchor | what |
|---|---|---|---|---|---|
| `clashBurst` | 6 | 45 | white (tinted) | center | the knot where two streams collide: a roiling core with jagged spikes spraying up and down (loop) |
| `streamBolt` | 4 | 40 | white (tinted) | center, tiles horizontally | a horizontal band of branching zigzag lightning (loop) |
| `streamLance` | 4 | 40 | white (tinted) | center, tiles horizontally | a thin straight lightning blade with crackle (loop) |
| `streamFlame` | 4 | 50 | full color | center, tiles horizontally | a horizontal band of rolling fire (loop) |
| `redOrb` | 6 | 40 | full color | center | Reversal: Red: a crimson sphere with a white-hot core and a ring pushing out (loop) |

The `stream*` bands are laid end to end along the stream (the engine repeats them; column 0 continues column 127).

### 5. Beam clashes from the air (amendment, the user's calls of 2026-10-15)

The air clash looked broken: the airborne owner froze at jump height in a standing `beamFire` pose, a grounded rush
answering it was dragged along the floor under the struggle point as the point climbed (Sasuke ended on Killua's side),
the held Chidori trailed behind the body, the camera framed only the point, and a rush that won finished on the floor
two units under the launched air fighter. Decided:

- **The air owner eases down** to a low hover (`airHover` 1.1 over `airEase` 24 frames) and holds its air pose:
  `beamStruggleAir` (a new optional strip, 3 frames, loop, 70 ms, FALLBACK `throw`), else the `throw` release frame.
- **A grounded rush stays planted** (`placeAirRush`): it holds its technique up the stream line, the struggle point sits
  `airTech` ahead of the drawn hand on the line to the air owner's hand, and the side losing ground is shoved: the rusher
  back along the floor, the air owner back and up (`airPush`, `airLift`). Streams against streams keep the line model.
- **A held technique is drawn where the stream meets it**, not at the frame's hand; a struggle rush shows its thrust frame.
- **A rush that wins blasts up the line** (`Effects.techBlast`) into the air fighter; the rusher stays on the floor. A
  stream that wins from the air aims through the loser's chest, and its owner keeps the air pose until it falls.
- **The clash camera frames both bodies** (the vertical span widens and lifts the shot).

## Alternatives considered

- **One beam ribbon styled per move** (colors and texture only): less work, but the user picked distinct shapes.
- **Per-character effect sheets** (`<charId>_<effect>`, ENG-014): the shapes follow the move, not the character
  (Sasuke has two), and per-move names keep the atlas small.
- **Reuse `beamFire` for the struggle**: it is a release pose; the user asked for poses that read as a struggle.

## Consequences

- One more optional strip for five fighters (`beamStruggle`) and one for the three with an air energy shot
  (`beamStruggleAir`), and five effects, all through the normal approval queue. Until each is
  approved, the engine draws the stand-in (procedural effect, `beamFire` pose).
- The fixes in section 1 ship without any art.
- A new fighter with an energy move picks a `stream.style` and draws `beamStruggle`.
