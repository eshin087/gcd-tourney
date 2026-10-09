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
| ultimate | Heavy + Special | the shared beam, or a `kit.ultimate` (a `SUPERS` entry) | 300 | beam ~250 effective and can be dodged or clashed · non-beam: unavoidable ≤ 230, dodgeable ≤ 300 |
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
| SUPER | Shadow Clone Barrage (flurry, 7×22 + 130) | **Kirin** (skyStrike: 280, dodgeable) | Godspeed: Whirlwind (flurry, 8×22 + 130) | Unlimited Void (domain, 150 f) |
| ultimate | Rasen Cannon (beam) | **Amaterasu** (ignite: 80 + 10×14 burn, unavoidable) | Lightning Palm (beam) | Hollow Purple (beam) |
| passive | - | - | - | Infinity (15 ki per volley stopped) |
| stats (index) | 5.9 / 1.0 / 1.0 (0.95) | 6.2 / 1.0 / 1.0 (1.00) | 6.8 / 0.97 / 0.95 (1.01) | 6.0 / 1.0 / 1.0 (0.97) |

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

Current read (2026-10-09): every fighter is within about 40-60 % in CPU play, and no errors, ring-outs, NaN
positions or stuck states showed up in about 500 matches. Naruto leads in CPU play (about 60 %). Re-run after the
real art lands (hurtboxes change) and after any kit change (ENG-037).
