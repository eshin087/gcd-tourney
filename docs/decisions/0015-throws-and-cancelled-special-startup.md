# 0015. Throw and throw break; faster startup for specials cancelled out of a hit

- Status: Accepted
- Date: 2026-10-10
- Deciders: User, Claude
- Builds on: [0014](0014-defensive-options-and-impossible-cpu.md) (parry, dodges, IMPOSSIBLE CPU)

## Context

ADR 0014 left two gaps, and the user chose the fix for each:

1. **Nothing beat a held guard.** Guard turns to face the attacker by itself and there was no throw, so a player
   who only held Guard could be hit only by unblockable supers; the IMPOSSIBLE CPU landed zero hits on a guard-only
   dummy in 50 s. Parry made defense stronger still. The user picked a throw with a throw break (over a guard
   meter).
2. **Light ×3 → signature rush special was not a combo.** light3's hit stun (22 f, ~20 with decay) ran out before
   Rasengan (24 f startup), Chidori (28) or Rasenshuriken (30) landed, so a defender holding Guard blocked the
   "ender". The user picked a faster startup when the special is cancelled out of a hit.

## Decision

### 1. Throw (numbers in `THROW`, `src/game/moves.js`)

| | |
|---|---|
| Input | Light + Heavy pressed within 2 frames (buffered; Light then Heavy, or Heavy then Light, a frame or two apart still throws). Works from neutral, out of a dash, a wavedash slide (the slide carries into it) and straight out of Guard. Ground only. |
| Frames | startup 5, active 3, whiff recovery 26 (34 total: a whiffed throw is a big punish) |
| Reach | 1.05 units along the screen, 0.6 in depth (a jab reaches further: strikes outrange throws) |
| Grabs | a grounded opponent in `idle`, `run`, `guard`, `land`, `wavedash`, `charge`, `dash`, `jumpSquat` or `held`; an attack only during its startup; a kit move only while it stands still (counter stance, mode power-up, Blue cast) |
| Doesn't grab | hit stun, block stun, airborne, invincible (dash start, wake-up, spot dodge), hidden |
| Hold | the victim is pinned 18 f in front of the thrower and can **break** with Light + Heavy within the first 12 f: no damage, "BREAK!", both pushed apart with 10 f of recovery. Two throws on the same frame break each other. |
| Toss | 80 damage (`minScale` 0.8), launch [12, 8.5] with a wall bounce, unblockable; from frame 6 of the toss the thrower can super dash or vanish after them |

So the triangle is: **strike beats throw** (an active attack hits the thrower first), **throw beats guard,
parry and counter stances**, **guard and parry beat strikes**, and **spot dodge, jumping or a break beat
throws**. Like the dodges, it reuses existing poses (`light1` reach and hold, `light4` toss; the victim in
`hurtHigh`) until dedicated grab art exists (ENG-046).

### 2. Cancelled specials start faster (`cancelStartup`)

A rush special cancelled out of a normal that hit (the `spPending` cancel in `Fighter.updateAttack`) starts at
its `cancelStartup`: Rasengan 14 (raw 24), Chidori 16 (raw 28), Rasenshuriken 18 (raw 30). Raw, they keep their
slow, punishable startup. Measured against a defender who guards the moment they can: light ×3 → Rasengan
4 hits / 200, → Chidori 4 hits / 209, → Rasenshuriken 8 hits / 159, none blocked.

### 3. The CPUs

- IMPOSSIBLE throws: a tick throw after a blocked string, a throw instead of a jab when the opponent sits in Guard
  (more often against someone who blocks a lot), a guard held too long right in front of it, and a throw on
  wake-up instead of a meaty. It only throws at states it can grab. It breaks throws on reaction 55 % of the time
  (`showman` 45 %), punishes whiffed and broken throws, and against a throw-happy player sometimes spot dodges or
  jabs when they walk right up. Its combo planner uses `cancelStartup`.
- Easy / Normal / Hard break throws at their reaction time with `guard × 0.6` odds (about 11 / 25 / 42 %).

## Consequences

- Turtling no longer works: on the guard-only dummy every fighter's IMPOSSIBLE CPU lands 2-6 throws in 50 s and
  converts them into full combos. Blocking still beats strikes, so offense becomes a real strike/throw guess.
- Light ×3 → special is a reliable 1-bar ender again; raw specials stay readable and punishable.
- Both changes add damage options: re-run the balance round-robin (ENG-048, ADR 0011 log) before tuning.
