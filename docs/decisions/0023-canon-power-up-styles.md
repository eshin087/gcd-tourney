# 0023. Canon power-ups as per-fighter charge-style data under a VFX budget

- Status: Proposed
- Date: 2026-10-10
- Deciders: User, Claude
- Supersedes the look of ENG-059 (the shared "fuller power-up"); builds on [0012](0012-art-integration-gates-and-hand-anchors.md) (approval-gated VFX art)

## Context

Holding Special charges ki. Since ENG-059 every fighter powered up with one shared DBZ-style recipe: 1.4 to 1.65
flame tongues per frame plus light streaks, ki motes, pebbles, a held glow disc, dust rings and a crater, with
full-screen focus lines, a camera rumble, a 4.8 Hz body flicker and, on every new bar, a burst and ring drawn over
the body plus a full-screen color flash. A Monte-Carlo run of the spawn code gave about 91 to 118 live sprites per
charging fighter, 30 to 37 of them above the bloom threshold, lighting 8 to 12 times the fighter's own silhouette.
The user called it "way too bright and cluttered" and asked for each fighter to power up the way they do in their
anime. The only per-fighter data was Killua's `charge.sparks`; everything else came from `def.color`, so Naruto,
Sasuke, Killua and Gojo all became orange or blue flame blobs. Two bugs rode along: every `t % n` emitter fired on
each frozen frame of a super flash (f.t stands still while effects keep ticking), and a mode's own aura (Nine-Tails
cloak, Godspeed crackle) stacked on top of the charge.

The user chose "canon, restrained": Naruto's red Nine-Tails chakra bubbling up (leading into his Four-Tails
ultimate), Sasuke's Sharingan glint, Chidori lightning crawling over his body and dark curse-mark chakra, Killua's
blue-white lightning crackle with his hair rising, Gojo almost no aura, just a Six Eyes glow and a faint Infinity
shimmer. Most of the effect on the body, much dimmer than now. The coordinator settled the open details: no
Susanoo for Sasuke, no orbiting Blue and Red for Gojo (pebbles that lift and freeze mid-air instead, no rumble,
dust, cracks or flash), one chakra tail for Naruto at MAX.

## Decision

1. **A charge style is fighter data.** `charge` in `src/characters/<id>.js` is deep-merged over `CHARGE_DEFAULT`
   (a restrained DBZ ki aura for any fighter without a block), and an active mode's `charge` (moves.js) is merged
   on top; today modes only add `level: 1` (Nine-Tails cloak, Godspeed). Fields: `palette` (named colors), `body`,
   `bodyTint` + `tint`, `shell`, `emit` (emitters), `eyes`, `ground`, `bar` / `max` beats and `sound`. One
   interpreter, `src/game/chargeFx.js`, runs it; no shared system checks a fighter id.
2. **The power lives on the body.** `src/game/auraShell.js` adds a second quad behind the sprite (a child of the
   body mesh, sharing its uvRect uniform) whose shader dilates the frame's alpha into one or two hard bands:
   `boil` (Naruto), `dark` (Sasuke), `electric` (Killua, flickering segments), `shimmer` (Gojo) and `flame` (the
   default). Colors stay at or below 1.0, so the shell never blooms.
3. **Levels, not time, grow the look.** `level` = filled ki bars + the mode's boost, 0 to 3 (3 = MAX). The first
   45 frames only widen the shell; emitters, eye glints and held effects (Naruto's tail) unlock per level.
4. **Restraint rules are code, not data** (enforced in chargeFx.js, so a new block cannot opt out):
   R1 at most 16 live charge sprites per fighter plus the shell and at most 2 held effects; R2 glow at most 0.6,
   at most 0.2 on a sprite larger than scale 0.25; R3 opacity at most 0.6 above scale 0.3, shell at most 0.7;
   R4 only sprites up to scale 0.25 may sit in front of the body, the rest are placed behind it in the sprite's
   billboard plane; R5 no focus lines while holding, a new bar pulses them to at most 0.35, the overlay flash
   only at MAX, at most 0.1 and in the style's dark color; R6 a steady body tint at most 0.06 (no flicker);
   R7 nothing spawns while the world is frozen; R8 a mode's own aura pauses while charging; R9 rumble at most
   0.05 camera trauma per 4 frames.
5. **The floor is optional.** Every live charge frame calls `game.fx.ground?.chargeTick?.(f, t, level)` and a full
   gauge calls `game.fx.ground?.chargeMax?.(f)` (the ground-damage module, ADR 0024); without it a style lays at
   most one crater per charge at `ground.crackAt`. A style with `crackAt: 0` (Gojo, Killua) never touches the
   floor.
6. **New effects are generic names, tinted at runtime,** in the shared VFX atlas: `bubble`, `wisp`, `arc`,
   `ripple`, and one character effect `naruto_chakraTail` (the `<charId>_<effect>` rule in art/vfx/README.md).
   Each has a procedural painter, a packer entry and a manifest entry (status todo); Codex art replaces them after
   the user approves it. ENG-014 (per-character effect sheets) can build on the same names.
7. **The charge loop has a voice per style** (`sound`): `hum` (default), `boil`, `crackle`, `calm`.

## Alternatives considered

- **Keep the shared recipe and turn the numbers down.** Rejected: it fixes the brightness, not the complaint that
  nobody powers up like themselves, and the next fighter would still be a flame blob.
- **Per-fighter code paths** (`if (def.id === 'naruto')`). Rejected by hard rule 4; data plus one interpreter
  scales to the cast plan.
- **Hand-drawn aura frames in the character sheets.** Rejected: an aura is on top of every charge frame and
  every mode, and the sprite rule is that the engine owns auras; it would also multiply the art per fighter.
- **A soft glow shell (gradients) instead of hard bands.** Rejected: it blooms and breaks the pixel look.
- **Sasuke's Susanoo ribcage at MAX and Gojo's orbiting Blue and Red** (the investigation's first draft). The
  user's restrained choice ruled both out: too big and too busy for a power-up.

## Consequences

- A new fighter gets a quiet default aura for free and a canon look by adding one `charge` block; the template
  and docs/ADDING_A_CHARACTER.md describe it.
- The budget is checkable: `game.fx.items.filter(i => i.tag === 'charge' && i.life > 0).length` stays at or below
  16 (Gojo about 7), and the lab's "Charge to MAX" row plays the whole build from an empty gauge.
- Eye offsets (`eyes.at`) are measured on spec v2 art (ppu 128) and skipped on the baked placeholder; a redraw
  that moves a head (Gojo's ART-GOJ-BUILD) needs the offset re-checked in the lab. Every spot on or around the
  body (`body`, `eyes.at`, held effects, bar beats) and its sprite size scale by `SpriteActor.depthK` (ENG-067), the
  way `Effects.handTick` does, so the power-up stays on the drawn body when the fighters stand at different depths.
- Five new atlas rows wait for Codex art (art/vfx/EFFECTS.md, PROMPTS.md); until then the procedural stand-ins
  ship.
- Not covered here (follow-up): the Nine-Tails cloak and Godspeed mode auras and the beamCharge / beamFire auras
  still use the old `auraTick`; routing them through the same styles is a separate task.
- Revisit if the user wants a louder power-up for a future character (a Super Saiyan): raise its own data within
  the rules, or amend the rules here.
