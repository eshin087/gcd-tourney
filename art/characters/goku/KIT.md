# Goku: kit (moveset brief)

> The one moveset brief that Claude and Codex both read for Goku ([ADR 0011](../../../docs/decisions/0011-kit-baseline-and-balance.md)
> slots and budgets, [ADR 0009](../../../docs/decisions/0009-move-system-v2.md) kinds, [ADR 0032](../../../docs/decisions/0032-goku-and-luffy-kits.md)).
> **Claude writes it** in the data PR (`feature/char-goku-luffy`) together with `src/characters/goku.js`; **Codex** turns
> §2 into the ANIMATIONS.md entries and PROMPTS.md blocks of its art PRs. If a move changes later, change this file
> first, in the same PR as the data. Design facts (palette, landmarks, outfit) live in CHARACTER.md (Codex writes it);
> ADR 0007, ADR 0029 and [art/SPEC.md](../../SPEC.md) win over this file.

## 1. Moveset

Era / version: **Dragon Ball Z, Cell saga, Super Saiyan** (golden hair, teal-green eyes, the orange gi over the dark
blue undershirt he wears against Cell). Every move is one he uses in the anime, except the Dragon Fist (a GT
technique the user picked on 2026-10-13).
Archetype and feel: all-rounder with a zoning tool, a big punch and a teleport; the cast's one beam.

| slot | input | move | kind | cost | numbers (raw, clean hit) | animation(s) |
|---|---|---|---|---|---|---|
| neutral | Special | KI BLAST VOLLEY | shot (3 blasts, narrow fan) | 50 | 3 × 24, ~11 u range | `special` |
| forward | → + Special | DRAGON FIST | rush (energy: can beam-clash) | 100 | 150, wall bounce | `specialForward` |
| up | ↑ + Special | RISING KICK | dive | 100 | rise 38 + slam 96 (ground bounce) | `specialUp` → `airHeavy` → `land` |
| down | ↓ + Special | INSTANT TRANSMISSION | teleport behind + vanish kick | 100 | kick 75 | `specialDown` (two fingers to the forehead), then `light4` |
| back | ← + Special | = down | | | | |
| air | Special in the air | KI BLAST VOLLEY | shot | 50 | 3 × 24 | `throw` |
| air↓ | ↓ + Special in the air | RISING KICK (drop only) | dive | 100 | slam 92 | `airHeavy` → `land` |
| SUPER | SUPER (3 bars) | KAIO-KEN RUSH | flurry | 300 | 8 × 22 + 130 | `superPose`, then `dash`, `light2` / `light4`, `airHeavy` |
| ultimate | Heavy + Special (3 bars) | KAMEHAMEHA | the shared beam (the cast's only beam, ADR 0017) | 300 | 12 / 5 f ticks + 130 | `beamCharge` → `beamFire` |
| passive | - | none (the Super Saiyan aura is his power-up look, `charge`) | | | | |

Stats: speed 6.2, power 1.02, defense 1.0; stat index 1.02.
Standing height: measured on his approved title-style reference beside the cast (ADR 0029). Canon: about 175 cm, an
adult; taller than Naruto and Sasuke, a little shorter than Gojo. Runtime `standingBodyPx` stays the spec default
until Claude's contact/hurtbox migration.

## 2. Poses each move needs (for Codex)

Frame counts and phases are the template's (art/manifest.json); timing lives in `src/game/moves.js`. The engine
draws every energy effect: no glow, ki, aura, beam or blast in a sprite.

- **`special` (Ki Blast Volley), 8 frames, phases 3/3/2.** Startup: draws both palms back to the near hip. Active
  (frames 3-5): one open palm thrust straight forward per frame, alternating hands (near, far, near), body squared up,
  shouting. The palm of the thrusting hand is the hand anchor. Recovery: back to stance.
- **`specialForward` (Dragon Fist), 7 frames, phases 2/2/3.** Startup: deep stance, near fist pulled back to the hip,
  far hand open forward. Active: a full-body lunging straight punch, near arm fully extended at chest height, rear leg
  straight. Recovery: steps back into stance. The fist is the hand anchor (the engine draws the golden glow).
- **`specialUp` (Rising Kick), 6 frames, phases 2/2/2.** Crouch, a rising front kick (near leg high above the head),
  then a forward flip that turns over into `airHeavy` f0 (drawn to flow into it).
- **`specialDown` (Instant Transmission), 4 frames, phases 2/1/1.** Standing upright and calm, eyes closed, index and
  middle finger of the near hand raised to the forehead; the other arm relaxed. He vanishes after it (engine), and the
  kick from behind is `light4`.
- **`superPose` (Kaio-ken), 4-frame loop.** Wide stance, fists clenched at the sides, head back shouting (the engine
  draws the red Kaio-ken aura).
- **`beamCharge` (Kamehameha), 3-frame loop.** The classic pose: body turned side-on, both hands cupped together at the
  rear hip, knees bent. **`beamFire`, 3-frame loop:** both arms thrust straight forward, wrists together, palms open
  toward the opponent, front knee bent. The cupped hands / palms are the beam origin.
- `intro`: arms folded or a calm guard with a confident smile. `taunt`: beckoning with the near hand. `win`: a relaxed
  smile, one fist raised. Super Saiyan hair in every frame, including `ko` and `down`.

## 3. Ultimate and SUPER: the big moments

- **Kamehameha** (ultimate): the shared beam, the one beam in the cast (ADR 0017, ADR 0027). Long windup in
  `beamCharge`, then a straight stream down his lane; dodge it by leaving the lane, block it, or answer it with your own
  ultimate (an ultimate clash). It also beam-clashes the other energy specials (Rasengan, Chidori, Narukami, Red, Dragon
  Fist).
- **Kaio-ken Rush** (SUPER): he flares red and dashes in; on contact the victim is held and struck from all sides
  (8 hits), then slammed down. Dodged by not being there when the dash arrives.

## 4. Effects and sound

Ki blasts use the `orb` effect tinted white-blue; Dragon Fist the hand fx `kiFist` (golden `glow` + `flame`); Kaio-ken
the `chakra` flame bursts tinted red; the beam is the shared beam in his `beam` palette (white / light blue / blue).
Power-up: golden `flame` shell, `wisp` and floating pebbles (`star`), floor cracks at bar 2 (`charge` in goku.js).
No new VFX atlas effects are needed.
