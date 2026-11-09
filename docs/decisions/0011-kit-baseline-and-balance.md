# 0011. Kit baseline: every fighter fills the same slots, within the same budgets

- Status: Accepted
- Date: 2026-10-09
- Deciders: User, Claude
- Builds on: [0009](0009-move-system-v2.md) (move system v2). Amends 0009's "fighters without a kit" fallback, which is
  now only a safety net.

## Context

ADR 0009 added kits, but only Killua and Gojo had one. Naruto and Sasuke still had two specials and no second
super, so the cast was uneven: players try →/↑/↓ Special on everyone, and the older two had far fewer tools. The
user asked for full kits for Naruto and Sasuke that respect their era (early Shippuden Naruto, before Sage Mode;
Hebi-era Sasuke), a balance pass across the cast, and a baseline that every future fighter follows.

## Decision

### 1. Every fighter fills the same slots

| slot | input | role | cost | damage budget (raw, clean hit) |
|---|---|---|---|---|
| `neutral` | tap Special | the signature special | 100 (rush) or 50 (shot) | rush 140-170 · shot 55-90 |
| `forward` | → + Special | a second offensive tool at a different range than neutral | 50-100 | ½ bar 55-90 · 1 bar 100-190 (higher only with a real cost: slow startup, self-damage, short range) |
| `up` | ↑ + Special | anti-air or vertical (dive, teleport above) | 50-100 | dive: rise 34-40 + slam 90-104 |
| `down` | ↓ + Special | a stance, counter or mode (no direct damage) | counter 50 · mode 100 | counter: window 18-24 f, stagger 20-50 f (+ an optional follow of at most 75) · mode: up to 480 f, speed × damage × defense ≤ 1.55 |
| `back` | ← + Special | optional; falls back to `down` | 50-100 | as its kind |
| `air` | Special in the air | air special (usually a projectile) | 50-100 | 50-90 |
| `airDown` | ↓ + Special in the air | optional; usually the air version of `up` | as `up` | slam 90-100 |
| `super` | SUPER | second super | 300 | 220-300 effective (after `minScale`), or equal control (a domain ≤ 150 f) |
| ultimate | Heavy + Special | a `kit.ultimate` (a `SUPERS` entry of its own kind), or the shared beam; at most one beam in the cast ([ADR 0017](0017-ultimate-variety-and-rhythm-clashes.md)) | 300 | beam ~250 effective and can be dodged or clashed · non-beam: unavoidable ≤ 230, dodgeable ≤ 300 |
| `passive` | always on | optional | must cost something (Infinity: 15 ki per volley stopped) | - |

- Every slot is filled with a `SPECIAL_MOVES` / `SUPERS` entry of an existing **kind** whenever one fits. A new kind
  needs its own ADR (or an amendment to this one) and a `CpuBrain.pickSpecial` weight.
- **Stats:** speed 5.8-6.8, and a **stat index** `(speed / 6.2) × power × defense` between **0.93 and 1.02**.
  Fighters with a passive stay at or below 1.0.
- **Era:** moves come from the fighter's art era (the brief in `art/characters/<id>/`). Naruto is early
  Shippuden, so he gets no Sage Mode, and his Rasenshuriken is **handheld** (he can't throw it yet; it tears his
  arm, so it costs him `selfDmg`).

### 2. The cast after this ADR

| | Naruto (early Shippuden) | Sasuke (Hebi era) | Killua (Godspeed) | Gojo |
|---|---|---|---|---|
| neutral | Rasengan (rush, 140) | Chidori (rush, 152) | Narukami (shot ½, 58) | Lapse: Blue (pull: 8/tick + pop 40) |
| forward | Rasenshuriken, handheld (rush 40 + grind vortex 12/tick + 76, self 25) | Chidori Sharp Spear (shot ½, 72, ~6 u) | Rhythm Echo (teleport + strike 70) | Reversal: Red (shot, 88) |
| up | Uzumaki Barrage (dive 38 + 96) | Lion's Barrage (dive 40 + 98) | Thunderbolt (dive 34 + 104) | Blink (teleport above, ½) |
| down | Nine-Tails Cloak (mode: ×1.12 speed, ×1.1 dmg, ×1.12 def) | Sharingan (counter → strike) | Godspeed (mode: ×1.35 speed, ×1.12 dmg, blink dash) | Infinity (counter → freeze, 48 f) |
| back | Substitution (counter → behind + kick, ½) | = down | = down | = down |
| air / air↓ | shuriken / Barrage dive | fireball / Lion's dive | Narukami / Thunderbolt dive | Red / = air |
| SUPER | Shadow Clone Barrage (flurry, 7×22 + 130) | **Kirin** (skyStrike: 280, dodgeable) | Godspeed: Speed of Lightning (flurry, 8×22 + 130; named Whirlwind before ADR 0017) | Unlimited Void (domain, 150 f) |
| ultimate | **Four-Tails** (rampage: 3×45 + 120; was the Rasen Cannon beam) | **Amaterasu** (ignite: 80 + 10×14 burn, unavoidable) | **Godspeed: Whirlwind** (reflex: up to 4 counters of 70 in 300 f; was the Lightning Palm beam) | **Hollow Purple** (orb: 260, one hit; was a beam) |
| passive | - | - | - | Infinity (15 ki per volley stopped) |
| stats (index) | 5.9 / 1.0 / 1.0 (0.95) | 6.2 / 1.0 / 1.0 (1.00) | 6.8 / 0.97 / 0.95 (1.01) | 6.0 / 1.0 / 1.0 (0.97) |

Added by [ADR 0032](0032-goku-and-luffy-kits.md) (2026-10-13):

| | Goku (Super Saiyan, Cell saga) | Luffy (Enies Lobby) |
|---|---|---|
| neutral | Ki Blast Volley (shot ½, 3 × 24) | Gum-Gum Pistol (shot ½, 70, ~6 u) |
| forward | Dragon Fist (rush, 150) | Gum-Gum Bazooka (rush, 145) |
| up | Rising Kick (dive 38 + 96) | Gum-Gum Rocket (dive 36 + 100) |
| down | Instant Transmission (teleport behind + kick 75) | Gear Second (mode: ×1.25 speed, ×1.1 dmg) |
| back | Kaio-ken (mode: ×1.2 speed, ×1.15 dmg; ADR 0050, was = down) | Gum-Gum Whip (rush ½, 90, low) |
| air / air↓ | Ki Blast Volley / Rising Kick dive | Pistol / Rocket dive |
| SUPER | Spirit Bomb (skyStrike: 280, dodgeable; ADR 0050, was the Kaio-ken Rush flurry) | Gear Second: Jet Gatling (flurry from the front, 9×20 + 125) |
| ultimate | **Kamehameha** (the shared beam: the cast's one beam) | **Gear Third: Gigant Pistol** (laneStrike: 270, dodgeable) |
| passive | - | - |
| stats (index) | 6.2 / 1.02 / 1.0 (1.02) | 6.1 / 1.02 / 1.0 (1.00; power 1.0 until 2026-11-08) |

### 3. New engine pieces (all data-driven)

- **Counter outcomes** (`onCounter`): `freeze` (Infinity), `strike` (Sharingan: an instant `follow` move),
  `behind` (Substitution: smoke and a log, then a teleport behind with `follow`).
- **Rush extras:** `selfDmg` (Rasenshuriken) and `vortex` (a grind vortex spawned where the rush connects;
  `Vortex` takes a fixed point and colors).
- **Super kinds:** `ignite` (Amaterasu: a hit plus a **burn** status that deals damage over time with no stun and
  can KO), `skyStrike` (Kirin: marks the spot, strikes `delay` frames later, can be dashed out of).
- **`kit.ultimate`:** Heavy + Special fires a `SUPERS` entry instead of the beam. `SUPERS.*.pose`/`strikePose`
  choose the animations (Kirin uses Sasuke's `beamCharge`/`beamFire`, which he no longer needs for a beam).
- **Mode look and defense:** `fx: 'chakra' | 'lightning'`, `auraColor`/`auraCore` recolor the aura, and
  `defense` divides incoming damage.
- **`PASSIVES`** table: Infinity costs 15 ki per stopped volley (a 3-shuriken throw is one charge) and needs
  that much ki to work.
- **Simultaneous melee** (`Game.resolveMelee`): hits found in a frame are applied together, so same-frame
  exchanges trade. Before, P1 updated first and won every exchange (P1 won 81 % of CPU matches).
- Visual flavor fields: dive `landFx`/`riseFx`, flurry `hitFx`/`finalFx`, counter `callout`/`color`.

## Alternatives considered

- **Leave Naruto and Sasuke on two specials.** Rejected: an uneven cast, and players would read the extra slots as
  broken inputs.
- **Sage Mode for Naruto** (my first proposal). Rejected by the user: the art is early Shippuden, before Sage Mode.
- **Amaterasu as Sasuke's SUPER** (first reading). The user clarified that it's his **ultimate**. Kirin takes the
  SUPER, so he keeps a big lightning finisher.
- **Per-fighter special-casing in code** (`if (def.id === 'sasuke')`). Rejected per CLAUDE.md rule 4. Every
  difference is a data field.

## Consequences

- Every fighter now draws the 4 kit animations (`specialForward`, `specialUp`, `specialDown`, `superPose`). They
  stay optional for the sheet's `complete` flag because the fallbacks cover them. Naruto's and Sasuke's briefs
  for them are in `art/characters/<id>/KIT.md`, which Codex merges into their ANIMATIONS.md and PROMPTS.md (A39-A42).
- A fighter whose ultimate isn't a beam redraws `beamCharge`/`beamFire` as the poses of whatever uses them (Sasuke:
  Kirin). They stay core animations: the names are a contract.
- Balance is checked with a CPU round-robin (docs/TESTING.md "Balance round-robin"). Results and tuning notes go
  in the log below.

## Balance log

CPU round-robins: Hard vs Hard, every ordered pair, best of 3 (docs/TESTING.md "Balance round-robin"). A run of
36 matches gives each fighter 18; that swings about ±12 %, so decisions use pooled runs. The CPU favors fighters
whose neutral special is a rush (it ends its combos with it), so trust hands-on play when they disagree.

| run | matches | Naruto | Sasuke | Killua | Gojo | P1 side | change before the run |
|---|---|---|---|---|---|---|---|
| 1 | 36 | 67 % | 44 % | 50 % | 39 % | - | first kits; Gojo 1.0/1.0 + Infinity 15 ki per stop; Killua 0.95/0.92; Naruto speed 6.0; Sasuke 1.0/0.97 |
| 2-3 | 72 | 47 % | 56 % | 42 % | 56 % | 81 % | Shadow Clone Barrage 7×22 + 130; Nine-Tails ×1.1 dmg / ×1.12 def; Gojo domain 150 f, counter stagger 48; CPU splits 3 bars, uses ← counters |
| 4-5 | 72 | 50 % | 44 % | 42 % | 64 % | 51 % | **fix: simultaneous melee (trades)** |
| 6 + replay | 72 + 24 | 81 % / 67 % | 42 % | 39 % | 39 % | 62 % | Lapse: Blue weaker (8/tick, pop 36, recovery 26); Killua power 0.97; Sasuke defense 1.0 |
| 8 | 72 | 67 % | 56 % | 42 % | 36 % | 40 % | Rasenshuriken 12/tick + 76; Naruto speed 5.9; Killua defense 0.95 |
| 9 | 72 | 64 % | 42 % | 44 % | 50 % | 46 % | Rasengan 150 → 140, Chidori 165 → 152; Blue pop 40, recovery 23 |
| check | 24 (Naruto vs Gojo) | 58 % | - | - | 42 % | - | Infinity charges once per volley (Naruto's 3-shuriken throws drained 45 ki each; Naruto had won 29 of 36 vs Gojo across runs 6-9) |
| 10-11 | 144 | 53 % | **33 %** | 58 % | 56 % | 47 % | first run with art: Naruto, Killua and Gojo on their approved art packs (art hurt/hit boxes, hand anchors); Sasuke still the baked placeholder |

Current read (2026-10-10): with three fighters on real art, Naruto, Killua and Gojo sit at 53-58 % and Sasuke drops
to 33 % (runs 10-11 alone: 36 % and 31 %). The likely cause is mixing art sources, not his kit: his placeholder's
standing hurtbox is 0.68 units wide, the art packs' are 0.41-0.52 (widened to the 0.56 minimum), so he is about
20 % easier to hit, at similar reach. No tuning yet, because his art (ART-SAS) replaces the placeholder; if it
stays a while, narrow the placeholder hurtbox instead of buffing his kit (ENG-038). No errors, ring-outs outside a
KO, NaN positions or stuck states in about 650 matches. Re-run when Sasuke's art lands and after any kit change
(ENG-037).

### Six fighters (2026-11-08; ENG-048, CHAR-goku-balance, CHAR-luffy-balance)

The first run with Goku and Luffy, and the first since run 10-11. Everything changed in between: all six fighters
are on their approved art (drawn hit and hurt boxes), the kits were revamped (ADR 0050 and the per-fighter skills
work), and the combat rules moved (directional normals and Smash air, ADR 0042; the gatling hybrid and the
auto follow-ups, ADR 0056 / 0057). So these rows start a new series and are not comparable with runs 1-11.

Hard vs Hard (`CpuBrain`), every ordered pair, best of 3; one pass is 30 matches, 10 per fighter. `Math.random`
seeded per match (5000 + the match index), intro skipped. Run on the ENG-126 branch, which does not touch the Hard
brain (it has its own combo logic, not the combo composer).

| run | matches | Naruto | Sasuke | Killua | Gojo | Goku | Luffy | P1 side |
|---|---|---|---|---|---|---|---|---|
| 12 (passes 1-6) | 180 | 50 % | 55 % | 45 % | 55 % | 50 % | 45 % | 51 % |
| 13 (passes 7-12) | 180 | 62 % | 65 % | 38 % | 38 % | 58 % | 38 % | 51 % |
| **12-13 pooled** | **360** | **56 %** (67/120) | **60 %** (72/120) | **42 %** (50/120) | **47 %** (56/120) | **54 %** (65/120) | **42 %** (50/120) | **51 %** |

Head to head, pooled (row's wins out of the 24 matches of that pair):

| | Naruto | Sasuke | Killua | Gojo | Goku | Luffy |
|---|---|---|---|---|---|---|
| Naruto | - | 9 | 13 | 15 | 13 | 17 |
| Sasuke | 15 | - | 16 | 15 | 12 | 14 |
| Killua | 11 | 8 | - | 10 | 12 | 9 |
| Gojo | 9 | 9 | 14 | - | 12 | 12 |
| Goku | 11 | 12 | 12 | 12 | - | 18 |
| Luffy | 7 | 10 | 15 | 12 | 6 | - |

Read (2026-11-08): on the pooled 360 every fighter is inside the 40-60 % target and the side bias is gone (51 %).
Sasuke sits at the top edge (60 %), Killua and Luffy near the bottom (42 %). Two runs of 60 matches per fighter
differ by up to 17 points for the same build (Gojo 55 % then 38 %), which is what 60 matches give (about ±13 % at two
sigma), so only the pooled row is worth reading; at 120 matches per fighter it is ±9 %. The spread across the six is
real but small (chi-square about 14.5 on 5 degrees of freedom, p near 0.01). Pairs worth a look by hand: Goku beats
Luffy 18 of 24 and Naruto beats him 17 of 24; Sasuke beats Killua 16 of 24 and Naruto 15 of 24. Every kit move got
used (the Hard CPU's most used specials: Reversal: Red 280, Chidori Spear 224, Lightning Palm 198, Dragon Fist 195,
Rasenshuriken 181; least: Yo-Yo 34, Rising Kick 38, Uzumaki Barrage 40, Gum-Gum Rocket 44). No draws, time-outs, NaN
positions or console errors in the 360 matches; a match lasts 102 s on average.

No number was changed. Proposals for the user, smallest first, each to be re-run before the next:

1. **Leave it** (recommended): all six are in the target band, and the CPU is a stand-in for players.
2. **Luffy power 1.00 to 1.02** (stat index 0.98 to 1.00, inside the 0.93-1.02 band): he is the one fighter with two
   lopsided pairings.
3. **Killua**: his stat index is already 1.01 (the top of the band is 1.02), so not a stat; a kit number instead, and
   only if hands-on play agrees he is weak (his defense, 0.95, is the cast's lowest by design).
4. **Sasuke**: nothing unless a third run keeps him at 60 % or above; then Chidori Spear 72 to 68 (the Hard CPU's
   second most used special).

### Luffy power 1.00 to 1.02 (2026-11-08, the user's pick: "Nudge Luffy")

Proposal 2, then the same 360 matches again: same protocol and seeds, on main `b8102009` (it adds the arcade ladder,
ENG-127, which does not change an ordinary match) plus the nudge.

| run | matches | Naruto | Sasuke | Killua | Gojo | Goku | Luffy | P1 side |
|---|---|---|---|---|---|---|---|---|
| 14 (passes 1-6) | 180 | 53 % | 57 % | 40 % | 52 % | 68 % | 30 % | 49 % |
| 15 (passes 7-12) | 180 | 60 % | 67 % | 38 % | 47 % | 53 % | 35 % | 51 % |
| **14-15 pooled** | **360** | **57 %** (68/120) | **62 %** (74/120) | **39 %** (47/120) | **49 %** (59/120) | **61 %** (73/120) | **33 %** (39/120) | **50 %** |
| **12-15, all four** | **720** | **56 %** (135/240) | **61 %** (146/240) | **40 %** (97/240) | **48 %** (115/240) | **58 %** (138/240) | **37 %** (89/240) | **51 %** |

Luffy's pairings over runs 12-15 (his wins of 48): Naruto 11, Sasuke 17, Goku 17, Gojo 20, Killua 24.

**Run 16, Luffy only, on the resized art.** While runs 14-15 ran, ART-SIZE-R8 landed on main: 13 strips pack at a
new size and their hit boxes with them (Luffy's launcher ×1.12, Bazooka ×1.08, forward air ×0.88; Goku's forward
smash and tilts smaller, up air bigger; Sasuke's back air and forward smash smaller, dash attack bigger). Runs 12-15
are on the art before it. So one more run on main `bc905a48` with the nudge, Luffy's 10 ordered pairings × 12 passes
(seeds 9000 + the match index): **Luffy 37 % (44/120)**; his wins of 24 against Naruto 10, Sasuke 4, Killua 10,
Gojo 9, Goku 11; P1 side 52 %. The resize did not move him: over his 360 matches in runs 12-16 he is at 37 %
(133/360, about ±5 %).

Read (2026-11-08):

- **The nudge cannot be seen.** Two per cent more damage is worth a point or two of win rate at most, and a 360-match
  run is ±9 % per fighter. Luffy scoring 33 % with the buff after 42 % without it is that noise (1.5 sigma on the
  difference), not an effect of the buff: more damage does not lose matches. A change this small needs thousands of
  matches to measure, so decide it on design grounds (stat index 1.00, inside the band).
- **What the second run does add is the order.** Over 720 matches Luffy is at 37 % (about ±6 %), Killua 40 %, Sasuke
  61 %: Luffy is probably below the 40-60 % target, Killua on its lower edge and Sasuke on its upper edge. The first
  run's "everyone inside the band" was too kind to Luffy.
- **Caution.** These are Hard CPUs playing each kit, and this log already notes the CPU's taste for rush specials.
  Luffy loses most to Naruto (11 of 48); whether that is his kit or the CPU's use of it needs a look by hand.

Proposals, none applied:

1. Keep the +2 % (harmless, in the right direction) and treat Luffy as still open.
2. A change big enough to measure, on one move: his Gum-Gum Pistol costs the same half bar as Sasuke's Chidori Spear
   but is slower and a little weaker (startup 11 against 9, recovery 20 against 18, 70 damage against 72), though it
   reaches further (about 6.3 units against 4.8); matching the Spear's frames is the smallest step with a visible size.
3. Measure the next change with a Luffy-only run (his 10 ordered pairings, 30 or more passes per setting), which puts
   all the matches where the change is.

### Gum-Gum Pistol on the Chidori Spear's frames (2026-11-08, the user's pick: "Try the Pistol")

Proposal 2, measured the way proposal 3 says. Luffy's 10 ordered pairings × 30 passes, and every match played twice
from the same seed (20000 + the pairing's index): once with the old frames (startup 11, recovery 20) and once with
the new ones (9 and 18), switched in the page between matches. Power 1.02, the resized art, Hard vs Hard, 600 matches.

| run 17 | matches | Luffy | his wins of 60 against Naruto | Sasuke | Killua | Gojo | Goku | P1 side |
|---|---|---|---|---|---|---|---|---|
| old frames (11 / 20) | 300 | 42 % (125) | 28 | 14 | 29 | 26 | 28 | 52 % |
| new frames (9 / 18) | 300 | 39 % (116) | 16 | 15 | 33 | 27 | 25 | 47 % |

By seed: Luffy won with both settings 44 times, only with the old frames 81, only with the new 72, with neither 103.

Read (2026-11-08):

- **No measurable effect.** Three points lower with the new frames, where the difference of two 300-match samples is
  good to about ±8; the paired count (72 against 81) says the same, and the two halves of the run disagree in sign
  (passes 1-15: 45 % old, 35 % new; passes 16-30: 38 % old, 42 % new).
- **It could not have shown.** The Hard CPU fires the Pistol about 1.2 times a match (707 uses in the 600 matches),
  so two frames of startup on it barely touch a CPU match. For a person it is another question, a faster neutral
  poke, and only hands-on play answers it. The change is on its branch for that; these numbers neither support nor
  oppose it.
- **The steady signal is a matchup, not a move.** Over every Luffy run (12-17) he has won 26 % against Sasuke (50 of
  192) and 34 % against Naruto (65 of 192), against 50 % with Killua (96), 43 % with Gojo (82) and 42 % with Goku
  (81). Overall he is at 39 % (374 of 960).

Proposals, none applied beyond the branch:

1. Decide the Pistol frames by feel (the branch preview), not by this log.
2. Before another number moves, find what loses him the Sasuke and Naruto matches: watch a set of Hard CPU matches of
   each with the combo and damage logs on (who lands the first hit, which moves do the damage, how his Pistol and Whip
   fare against Chidori and Rasengan), then change the one thing that explains it and measure with a run like 17.
