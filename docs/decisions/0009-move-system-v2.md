# 0009. Move system v2: command specials, special kinds, a SUPER button, passives and modes

- Status: accepted
- Date: 2026-10-09
- Builds on: [0004](0004-dbfz-combat-model.md). Implements ENG-021 (data-driven specials).

## Context

Every fighter had exactly three moves of their own: one ground special (always a forward *rush*), one air
projectile (shuriken or fireball) and one beam ultimate. Killua (HxH, Godspeed era) and Gojo (JJK) are
defined by moves that fit none of those: a lightning bolt, afterimage teleports, a lightning dive, a speed
mode, a gravity pull, a repulsion blast, a counter barrier, a passive that stops projectiles, and cinematic
supers (Godspeed: Whirlwind, Domain Expansion). The user chose the full kit, including the unique mechanics.

## Decision

### Inputs

| input | does |
|---|---|
| Special (tap) | the **neutral** special |
| toward the opponent + Special | **forward** special |
| away + Special | **back** special |
| up + Special | **up** special (anti-air) |
| down + Special | **down** special |
| Special in the air | **air** special; down + Special in the air: **airDown** |
| hold Special | ki charge (unchanged) |
| Heavy + Special | beam ultimate, 3 bars (unchanged) |
| **SUPER** (new button) | the fighter's second super, 3 bars; fighters without one fire their beam ultimate |

Direction is read from the stick when the special comes out: forward/back along the screen axis
relative to the fighter's facing, up/down when the stick is mostly vertical. SUPER defaults: keyboard
`H` (alt `B`) solo, `T` for 2P player 1, `'` for player 2; gamepad L2 / LT (guard keeps L1 / LB); touch
gets a SUPER button. Bindings storage moves to `gcd.bindings.v2` (old saved bindings reset once).

### Kit data (character file)

```js
kit: {
  specials: { neutral, forward, back, up, down, air, airDown },  // ids from SPECIAL_MOVES (src/game/moves.js)
  super: 'whirlwind',        // id from SUPERS, or omitted
  passive: 'infinity',       // or omitted
},
```

Missing slots fall back: forward / up / down -> neutral, back -> down -> neutral, airDown -> air. Fighters
without a `kit` get `{ neutral: def.special, air: def.projectile }`, so Naruto and Sasuke keep working.

### Special kinds (shared, data-driven; behaviour in `src/game/kit.js`)

| kind | what it does | data |
|---|---|---|
| `rush` | charge forward with energy in hand, big hit (Rasengan, Chidori) | existing SPECIALS fields |
| `shot` | fire a projectile type from the hand, ground or air | `proj`, `anim`, `startup`, `recovery`, `cost` |
| `teleport` | vanish, reappear at an offset from the opponent (behind / above), optional follow-up move, afterimages | `to`, `hide`, `follow`, `ghosts` |
| `pull` | spawn a vortex in front that drags the opponent in, ticks damage, then pops them up (combo starter) | `dist`, `radius`, `len`, `tick`, `pop` |
| `dive` | leap toward the opponent, then slam down with an area hit (anti-air on the way up) | `rise`, `hang`, `slam`, `area`, hit data |
| `counter` | short stance: melee attackers are frozen (stagger) and projectiles stop | `len`, `stagger` |
| `mode` | timed power-up: speed / damage multipliers, special dashes, aura | `len`, `speed`, `damage`, `blinkDash` |

### Supers (SUPER button, 3 bars)

| kind | what it does |
|---|---|
| `flurry` | Killua: lightning dash; on contact the opponent is held and struck from every direction, then a slam |
| `domain` | Gojo: the stage turns into the void and the opponent is frozen for ~2.5 s (free combo). Sure-hit unless the opponent is invulnerable |

### Passives

`infinity` (Gojo): non-beam projectiles stop and fade before touching him while he can act (not while
stunned, launched or down), and he takes no chip damage when blocking.

### The two kits

**Killua** (Godspeed era, slim, fastest walk/run, lower power and defense)

| input | move | kind | cost |
|---|---|---|---|
| Special | Narukami (lightning bolt, long stun) | shot | ½ bar |
| → + Special | Rhythm Echo (afterimages, reappears behind, claw strike) | teleport | 1 bar |
| ↑ + Special | Thunderbolt (lightning leap and slam) | dive | 1 bar |
| ↓ / ← + Special | Godspeed (8 s: +35% speed, lightning blink dashes, +15% damage) | mode | 1 bar |
| air Special / air ↓ + Special | Narukami (air) / Thunderbolt (air) | shot / dive | ½ / 1 bar |
| Heavy + Special | Lightning Palm (beam) | beam | 3 bars |
| SUPER | Godspeed: Whirlwind | flurry | 3 bars |

**Gojo** (blindfold; the eyes show on his supers' cut-ins; tall, strong, durable)

| input | move | kind | cost |
|---|---|---|---|
| Special | Lapse: Blue (gravity vortex pull) | pull | 1 bar |
| → + Special | Reversal: Red (repulsion blast, wall bounce) | shot | 1 bar |
| ↑ + Special | Blink (teleport above the opponent) | teleport | ½ bar |
| ↓ / ← + Special | Infinity (counter stance) | counter | ½ bar |
| air Special | Reversal: Red (air) | shot | 1 bar |
| Heavy + Special | Hollow Purple (wide purple beam) | beam | 3 bars |
| SUPER | Domain Expansion: Unlimited Void | domain | 3 bars |
| passive | Infinity: projectiles stop before touching him, no chip damage | | |

### Animation contract

Four new **optional** animation names (fallback in brackets): `specialForward` (special), `specialUp`
(special), `specialDown` (charge), `superPose` (taunt). Kinds otherwise reuse existing names (`vanish`,
`throw`, `jumpUp`, `airHeavy`, `land`, `light2`, `light4`). Art pipeline docs, the manifest and the
template list them as optional.

## Consequences

- New engine module `src/game/kit.js` (kinds, supers, passives, modes), new projectile types (bolt, red),
  vortex and void effects, a 7th input action `super`, AI support for command specials and supers.
- Character files stay data: future fighters pick kinds and tune numbers; only a new *kind* needs code.
- Naruto and Sasuke are unchanged until they get kits (their SUPER fires the beam ultimate).
