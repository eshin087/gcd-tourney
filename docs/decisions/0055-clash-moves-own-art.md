# 0055: Beam clashes in each move's own art, Red's orb shoves, and the Gigant Pistol clashes

**Status:** Accepted (user decisions, 2026-10-19)
**Date:** 2026-10-19
**Task:** ENG-122 (engine), ART-CLASH-HD (art, [art/vfx/CLASH_HD_BRIEF.md](../../art/vfx/CLASH_HD_BRIEF.md))
**Amends:** [ADR 0034](0034-beam-clash-visuals.md) (how a clash is drawn), [0027](0027-beam-clash-energy-struggles.md)
(the struggle's ending), [0017](0017-ultimate-variety-and-rhythm-clashes.md) and [0032](0032-goku-and-luffy-kits.md) (which
ultimates clash)

## Context

The user (2026-10-19): "the beam clashes between all the characters are really buggy janky and not looking good. some
seem to have placeholder beams instead of the iconic ability they use." Claude frame-stepped every pairing in the lab
(8 beam-clash pairings, the air clash, 4 ultimate clashes). The console was clean; the problems were all in how a clash
looks and what the fighters do in it:

1. **Stand-in art.** Since the skills revamp every move has approved HD art (`chidoriSpear`, `lightningPalm`,
   `reversalRed`, `greatFireball`, `kamehamehaHead`, the Dragon Fist's dragon), but a clash still drew round 1's 128 px
   pieces: the Chidori Spear a thin laser, the Lightning Palm a small zigzag strip, the Great Fireball a low-res fire
   strip, the Dragon Fist a plain yellow glow, the meeting point a white ball.
2. **Reversal: Red as a laser.** The `orb` style drew a long red ribbon from Gojo's hand with the orb at his fingertips.
3. **Ultimate clashes merged.** In a clash the Kamehameha dropped its drawn head, so two beams read as one bar with no
   collision; Hollow Purple (radius 1.45 at full size, centred 0.98 up) sank into the floor as a dome and hid the
   Four-Tails beam and the meeting point.
4. **The winner's follow-through.** A struggle winner switched to `beamFire`, which is the fighter's ultimate pose
   (Sasuke's arm raised to Kirin's storm, Gojo's Hollow Purple stance), and the winning stream grew to `maxLen` 26: a
   laser across the whole screen, past the loser.
5. **Glow discs.** A soft disc at each shooter's hand (`beamO`) and the clash aura's disc (a bubble round each fighter).
6. **Luffy never clashes**: his Gigant Pistol was not a clash kind (ADR 0032: "a fist has nothing to push against").

The user chose, in Claude's chat: **new clash art** that continues each move's approved HD effect (Codex draws it, the
user approves every image); **Red's orb shoves forward** with repulsion shockwaves, no beam; **the Gigant Pistol clashes**
with the beam and orb ultimates; the winner's attack **blasts through and stops** in the move's own burst.

## Decision

### Engine (ships now, with the old art as stand-ins)

- **Drawn bands.** A stream palette (`PROJECTILES[id].stream`, `def.beam`) may name `band: { fx, scroll, scale }`, an HD
  tile strip (`*Stream`) laid end to end like round 1's bands. `streamStyle(game, pal, inClash)` (projectiles.js) uses it
  once the atlas has it, in a clash only, else the style's stand-in. An ultimate beam caught in a clash switches to its
  band (`Beam.restyle(true)`); its view is rebuilt when the style changes (`ShotViews`, by style key).
- **Red** (`style: 'orb'`): no ribbon. The orb's front sits on the struggle point (the beam's head), so the head carries
  it through the loser when Red wins. Art: `redPush` once approved, else the HD `reversalRed` turned along the line, else
  round 1's `redOrb`. Small repulsion ripples run from the fingertips into it.
- **Kamehameha head in a clash**: drawn at 0.72 scale, its front on the struggle point, so two beams press into each
  other at the collision.
- **Hollow Purple in a clash**: drawn at 0.7 scale (`look.clashScale`), its front on the struggle point and clear of the
  floor. View only: the clash still places the orb itself.
- **The collision**: `clashKnot` (HD, white, tinted per side, two layers) once approved, else `clashBurst`; drawn above
  beam heads and orbs (order 9) with a smaller white core.
- **Winner**: a struggle winner holds its push pose (`beamStruggle` / `beamStruggleAir`) through the follow-through; the
  stream surges from the struggle point to the loser's chest and stops there (`Beam.cap`), letting go 20 frames sooner
  than an ultimate beam. The loser gets the winning move's own burst (`Game.clashBurstOf`: a shot's `burstFx`, a rush's
  `blastFx` or its dragon's `coil.burst`, Hollow Purple's `look.burst`, the Gigant Pistol's `blastFx`); otherwise the
  generic clash blast as before.
- **No glow discs**: no hand bulb on a clash stream (`Beam.stream`) or a drawn band; the clash aura keeps its thin flames
  without the disc (`auraTick(..., disc = false)`).
- **Dragon Fist**: held into a clash it keeps the golden ki envelope (`dragonFistAura`) instead of a lone glow; once
  `dragonFistPush` is approved the dragon bursts from the fist to the struggle point (`clashPush: { fx, reach }`: the
  point sits `reach` further out).
- **Killua's stream** takes his lightning's white-violet (`#8c6bff`), matching the HD Lightning Palm.

### The Gigant Pistol clashes (amends ADR 0032)

`laneStrike` joins the clash kinds (`kit.js` `CLASH_KINDS`). Its body (`laneBody`, `Game.ultimateBody` kind `fist`): from
his shoulder down his lane to the giant fist while it punches; winding up it is already one at the shoulder (like a beam
still charging), and a clash that catches it sends the punch out at once (`releaseFist`). In the clash the fist is held
against the other attack with the giant arm drawn from his shoulder (`Effects.laneArm(..., hold)`); pressed back, the arm
shortens to `FIST_ARM` 1.3 before he gives ground. A win drives the fist through the loser (`resumeLaneStrike`: the arm
snaps back from there into the chibi recovery, its hit was the clash's). Answering a running ultimate it winds up in
`answerWindup` 12 frames (34 otherwise). The CPUs answer it the way they answer an orb or a pounce: CpuBrain on its
windup, MasterBrain through a `laneStrike` threat that only a brain able to meet it sees, so their other reactions to
the punch are unchanged.

### Art (Codex, ART-CLASH-HD)

Eight HD effects, every one approved by the user before it ships: `clashKnot` (shared), `spearStream`, `fireballStream`
(sasuke), `palmStream` (killua), `kamehamehaStream`, `dragonFistPush` (goku), `beastBeamStream` (naruto), `redPush` (gojo).
The packer knows the names (`VFX_EFFECTS`); the brief has the frames, sizes and palettes.

## Alternatives considered

- **Reuse the approved art only** (stretch and hold each move's existing strip in the clash): no new images and faster,
  but the strips are drawn as one shot or one blade, not as a stream that tiles. Offered; the user chose new art.
- **Red as a red energy torrent** (a drawn stream): offered; the user chose the orb itself, which is how Red looks.
- **Luffy's Gum-Gum Pistol in beam clashes too** (a 1-bar physical shot pushed into an energy shot): offered; the user
  chose the ultimate only. The Pistol still just cancels a shot.
- **A big cinematic finish** (camera push-in, larger burst): offered; the user chose blast through and stop.

## Consequences

- Until each image is approved the game draws today's stand-ins (`streamBolt`/`streamLance`/`streamFlame`, `clashBurst`,
  the HD `reversalRed`, the ribbon), so nothing waits on the art.
- Four more pairings have an ultimate clash: Luffy against Naruto, Goku and Gojo, and the Luffy mirror. His Gigant
  Pistol misses less against CPUs that answer it.
- A clash winner no longer plays `beamFire` after a struggle, so a fighter's ultimate pose stays the ultimate's.
