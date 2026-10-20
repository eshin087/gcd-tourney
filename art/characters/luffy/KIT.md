# Luffy: kit (moveset brief)

> The one moveset brief that Claude and Codex both read for Luffy ([ADR 0011](../../../docs/decisions/0011-kit-baseline-and-balance.md)
> slots and budgets, [ADR 0009](../../../docs/decisions/0009-move-system-v2.md) kinds, [ADR 0032](../../../docs/decisions/0032-goku-and-luffy-kits.md)).
> **Claude writes it** in the data PR (`feature/char-goku-luffy`) together with `src/characters/luffy.js`; **Codex**
> turns §2 into the ANIMATIONS.md entries and PROMPTS.md blocks of its art PRs. If a move changes later, change this
> file first, in the same PR as the data. Design facts (palette, landmarks, outfit) live in CHARACTER.md (Codex
> writes it); ADR 0007, ADR 0029 and [art/SPEC.md](../../SPEC.md) win over this file.

## 1. Moveset

Era / version: **One Piece, Enies Lobby arc** (Gear Second and Gear Third, the open red vest, blue shorts with white
cuffs, straw sandals, the straw hat). Every move is one he uses in that arc.
Archetype and feel: stretchy brawler: long reach, a fast mode, and a huge slow finisher.

| slot | input | move | kind | cost | numbers (raw, clean hit) | animation(s) |
|---|---|---|---|---|---|---|
| neutral | Special | GUM-GUM PISTOL | shot (the stretched fist, physical) | 50 | 70, ~6 u reach | `special` |
| forward | → + Special | GUM-GUM BAZOOKA | rush (short lunge, physical) | 100 | 145, wall bounce | `specialForward` |
| up | ↑ + Special | GUM-GUM ROCKET | dive | 100 | rise 36 + slam 100 (ground bounce) | `specialUp` → `airHeavy` → `land` |
| down | ↓ + Special | GEAR SECOND | mode | 100 | 420 f: × 1.25 speed, × 1.1 damage | `charge` |
| back | ← + Special | GUM-GUM WHIP | rush (low sweep, long leg) | 50 | 90, knockdown | `specialDown` |
| air | Special in the air | GUM-GUM PISTOL | shot | 50 | 70 | `throw` |
| air↓ | ↓ + Special in the air | GUM-GUM ROCKET (drop only) | dive | 100 | slam 94 | `airHeavy` → `land` |
| SUPER | SUPER (3 bars) | GEAR SECOND: JET GATLING | flurry, from the front | 300 | 9 × 20 + 125, wall bounce | `superPose`, then `dash`, `light2` / `light4`, `heavy` |
| ultimate | Heavy + Special (3 bars) | GEAR THIRD: GIGANT PISTOL | laneStrike (new kind, ADR 0032) | 300 | 270, one unblockable hit | `beamCharge` → `beamFire` |
| passive | - | none (Gear Second is the ↓ mode; its steam is also his power-up look) | | | | |

The user's approved list (2026-10-13) had the Whip on ↓ and Gear Second as his style. ADR 0011 keeps ↓ for modes and
counters, so Gear Second is the ↓ mode and the Whip moved to ←.

Stats: speed 6.1, power 1.0, defense 1.0; stat index 0.98.
Standing height: measured on his approved title-style reference beside the cast (ADR 0029). Canon: about 172 cm at
17; lean and wiry, a little shorter than Goku. Runtime `standingBodyPx` stays the spec default until Claude's
contact/hurtbox migration.

> **Skills revamp (ENG-SKL-LUF, ADR 0051, 2026-10-18):** the specials, Jet Gatling and Gigant Pistol now play as in
> the anime. The frame-by-frame art for `special` v03, `throw` v01, `specialForward` v01, `specialUp` v01,
> `specialDown` v01, `beamFire` v03 and the 14 HD effects is in [SKILLS_REVAMP.md](SKILLS_REVAMP.md), which wins over
> §2 and §4 below where they differ: a limb longer than the cell leaves it at the edge (the `hand` anchor sits there)
> and the engine draws the rest; Gear Second's pink skin is a palette swap in the engine, not a redraw.

## 2. Poses each move needs (for Codex)

Frame counts and phases are the template's (art/manifest.json); timing lives in `src/game/moves.js`. The engine draws
every effect: no steam, glow or motion lines in a sprite. Luffy's rubber stretching **is** drawn: a stretched arm or
leg is part of the body.

- **`special` (Gum-Gum Pistol), 8 frames, phases 3/3/2.** Startup: twists the torso away, the near arm wound far
  back behind him. Active (frames 3-5): the near arm stretched straight out toward the opponent, much longer than a
  normal arm (it reaches toward the cell edge), fist closed. The fist is the hand anchor (the engine also sends the
  fist hitbox further out). Recovery: the arm snaps back.
- **`specialForward` (Bazooka), 7 frames, phases 2/2/3.** Startup: both arms stretched back behind him, crouched.
  Active: both palms shoved forward together at chest height, arms straight, leaning in. Recovery: back to stance.
- **`specialUp` (Rocket), 6 frames, phases 2/2/2.** Deep crouch with both arms stretched back and down (the
  slingshot), then launching straight up with both arms above the head, then turning over into `airHeavy` f0.
- **`specialDown` (Whip), 4 frames, phases 2/1/1.** Startup: crouched low, weight on the back leg. Active: a low
  sweeping kick, the near leg stretched far out along the floor (rubber), hands on the floor for balance. Recovery:
  pulls the leg back.
- **`charge` (Gear Second): his power-up and the Gear Second activation.** Crouched low, one hand on the knee, the
  other fist clenched, pumping; the skin flushed pink (draw the flush, the engine adds the steam).
- **`superPose` (Jet Gatling), 4-frame loop.** Low Gear Second stance, both fists cocked back, skin flushed pink.
- **`beamCharge` (Gigant Pistol windup), 3-frame loop.** Gear Third: he bites his thumb and blows the near arm up;
  across the 3 frames the arm and fist grow huge (the fist ends larger than his whole body), held up and behind him.
  **`beamFire`, 3-frame loop:** the giant fist thrown forward, arm stretched and still giant. Mind the cell: the giant
  arm may fill the cell width; Claude checks the cell margins with the packer.
- `intro`: grinning, one hand holding the straw hat on his head. `taunt`: laughing, pointing. `win`: both arms up,
  laughing. The straw hat stays on in every frame except where he is knocked flying (`launched`, `spin`, `ko`: it
  may hang on his back by its cord).

## 3. Ultimate and SUPER: the big moments

- **Gear Third: Gigant Pistol** (ultimate, new `laneStrike` kind): a long windup while the arm inflates, then the
  giant fist shoots down his lane to ~7 u and back. One unblockable hit of 270. You avoid it by leaving the lane or
  jumping over it during the windup; it never clashes (a fist has no stream to push), which makes it a different
  shape from every other finisher: Goku's beam, Gojo's orb, Naruto's pounce, Sasuke's ignite, Killua's reflex.
- **Gear Second: Jet Gatling** (SUPER): he dashes in; on contact a blur of punches from in front (9 hits), then one
  last straight punch that sends them into the wall.

## 4. Effects and sound

Since the skills revamp (ADR 0051): the Pistol is the stretched arm (`gumArm`) from his hand to the fist (`gumFist`),
which snaps back, with a knuckle impact (`gumImpact`); the Bazooka's hit is `bazookaBlast`, the Rocket's take-off
`rocketSnap` (his arms drawn up to what they grabbed), the Whip's leg `whipSweep`; Gear Second is his skin flushed
pink (the shader's palette swap), `gear2Burst` and `gear2Steam`, afterimages and the JET names; Jet Gatling is
`gatlingFists` and a `bazookaBlast` Jet Bazooka; Gigant Pistol is `gear3Puff` on the windup, `gigantArm` and
`gigantFist` down the lane, `gigantImpact`, then `luffyChibi` for the recovery. Until the art is approved each is a
procedural stand-in. Sounds: `whooshHeavy` for the stretches, `explosion` on the Gigant Pistol hit.
