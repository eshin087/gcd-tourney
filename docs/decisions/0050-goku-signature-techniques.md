# 0050: Goku's signature techniques: the Spirit Bomb SUPER, a Kaio-ken mode, and their data

**Status:** Accepted (user decision, 2026-10-18)
**Date:** 2026-10-18
**Task:** ENG-SKL-GOK (engine), ART-SKL-GOK (art, Codex chat "5 - Skills Effects")
**Builds on:** [ADR 0044](0044-signature-techniques.md) (HD effect cells), [ADR 0045](0045-naruto-four-tails-beam.md)
(the beam's `def.beam` data), [ADR 0047](0047-sasuke-signature-techniques.md) (technique data on moves, shots and supers)
**Amends:** [ADR 0032](0032-goku-and-luffy-kits.md) (Goku's SUPER and his Back + Special slot)

## Context

After Naruto and Sasuke, the user asked for the same revamp of Goku (2026-10-18: the specials, supers and ultimates
should look like the iconic anime/manga versions). In game, five of his eight kit strips had never been drawn, so
Dragon Fist and Rising Kick played the Ki Blast palm push, Instant Transmission his power-up stance, the Kaio-ken
flash his idle. Dragon Fist hid him in a big glow disc and hit with a white-out; the ki blasts were one blue glow disc;
the Kaio-ken Rush was the shared flurry with red afterimages; the Kamehameha charged with no ball and no chant.

The user's answers (question box, 2026-10-18), every one Claude's recommendation:
- the Kamehameha classic, revamped;
- the SUPER becomes the **Spirit Bomb**, and the **Kaio-ken** moves to Back + Special as a power-up mode;
- the full anime Dragon Fist (the dragon coiling round them);
- Instant Transmission, the Ki Blast Volley, Rising Kick as an afterimage chase and a Super Saiyan intro revamped too.

## Decision

Every new behaviour is data on the move, the projectile, the super or the character, read by shared code (CLAUDE.md
rule 4):

1. **Kit:** `kit.super` is `spiritBomb` (a `skyStrike` with Kirin's numbers: 40-frame flash, the mark, 280 on the spot
   40 frames later, radius 2, dodged by dashing out); `kit.specials.back` is `kaioken`, a `mode` in the ADR 0011
   budget (speed 1.2 x damage 1.15 x defense 1.0, 420 frames, 1 bar, like Gear Second and the Nine-Tails Cloak). The
   `kaiokenRush` flurry is gone.
2. **Beam (`def.beam`):** `chant` (syllables called out through the windup from the charge's own clock, the last one
   as it fires), `originFx` (the technique held at the palms while it fires), `headFx` (the beam's own head in place
   of the two glow bulbs, turned along the beam on screen), `gather.mote` (what converges on the ball) and
   `gather.aura` (keep a thinner aura too). Goku's cupped hands and palms are `hand` anchors in hitboxes.json. A beam
   without these fields (Naruto's) draws as before.
3. **Sky strike:** `bomb` (the Spirit Bomb, like Kirin's `storm`): the sphere gathers over his raised hands from the
   super flash on (Game.fxTicks draws it while the kit state is still in its flash), motes stream in from all round
   the stage, the stage dims and the camera tips up (the view-only `stormDim` / `stormLift`), and `swing` frames
   before the strike he shoves it and it falls onto the mark as a dome.
4. **Mode:** `burstFx` (its own burst as it starts), `aura` (an effect held behind him), `shell` (the AuraShell flame
   outline on the body; the charge's own shell wins while he powers up) and `tint` (a body tint under any stronger
   flash) while it lasts.
5. **Rush:** `coil` (Dragon Fist): on a hit the victim is held through the hit stop (30 frames, was 20) while an HD
   effect winds round them, its frame following the stop's own count; when the stop ends it bursts (`burst`) and they
   fly with the launch the hit already gave them. One hit, damage unchanged; `blastFx: { fx: null }` drops the white-out.
6. **Shot:** `every` (a volley fired one shot per `every` frames through the active phase, one per drawn palm thrust),
   `muzzle` (a flash at the hand) and `halo` (the glow's opacity, 0 for none). The Ki Blast Volley's frames move to
   10 / 12 / 12 (was 12 / 3 / 18) so the three thrusts show.
7. **Teleport:** `shimmer` (Instant Transmission): no puff or afterimage; the effect closes on him as he goes and plays
   backward where he reappears.
8. **Dive:** Lion's Barrage's `shadow` with no `hits` goes straight to the drop, and `hangPose` holds a strip's startup
   while he hangs: Rising Kick's afterimage chase (blink above them, the two-fist hammer of `airHeavy` into the floor).
   Damage unchanged.
9. **Intro:** `def.intro` plays the `intro` strip once when the fly-in reaches the fighter's side (`at`, seconds per
   side), its effect on the change and the aura after it (the Super Saiyan transformation).
10. Fifteen HD effect names (`kamehameha`, `kamehamehaHead`, `kamehamehaRing`, `kiBlast`, `kiMuzzle`, `kiBlastBurst`,
    `dragonFistAura`, `dragonFistDragon`, `dragonFistBurst`, `instantTransmission`, `kaiokenBurst`, `kaiokenAura`,
    `spiritBomb`, `spiritBombBlast`, `superSaiyanBurst`) with procedural stand-ins until Codex's art is approved
    ([SKILLS_REVAMP.md](../../art/characters/goku/SKILLS_REVAMP.md)).

## Alternatives considered

- **Kaio-ken Rush kept as the SUPER** (the user's second option): faithful to the Saiyan saga's Kaio-ken attack, but
  it left the Spirit Bomb out, and Kaio-ken is a power-up in the anime, not a single attack.
- **Instant Transmission Kamehameha** (the Cell Games): iconic, but a beam you can no longer dodge by leaving its lane
  changes the beam's balance for every fighter that has to answer it. The user kept the classic.
- **A two-hit Dragon Fist** (the punch, then a separate burst hit): combo scaling would cut the second hit, and the
  CPUs read a rush as one hit. The longer hit stop keeps it one hit with the same frame advantage.

## Consequences

- The determinism fixtures don't include Goku; they are re-recorded at the merge anyway (the shared code changed).
- The CPUs read the Spirit Bomb as a sky strike and the Kaio-ken as a mode with no new AI code.
- Until Codex's strips land, Dragon Fist and Rising Kick still play stand-in poses (`special`), Instant Transmission
  `charge`, the Spirit Bomb `idle`, the air volley `light1` and the intro `idle`; the effects carry the moves.
- Any later fighter can reuse the fields: a chant, a beam head, a mode aura, a coil, a staggered volley, a shimmer, an
  intro transformation.
