# 0025. CPU defense: reads that fire, per-match defense personas, reads and exchanges for CPU vs CPU

- Status: Proposed
- Date: 2026-10-10
- Deciders: User, Claude
- Amends: [0016](0016-showcase-cpu.md) (showcase CPU)
- Builds on: [0014](0014-defensive-options-and-impossible-cpu.md) (defensive options, IMPOSSIBLE CPU),
  [0022](0022-combo-escape-and-true-combos.md) (combo escape, technique callouts)

## Context

The user (2026-10-10): "the CPUs barely use wavedash, parry, air dodges, dodges defensively: showcase that too, epic
anime-like fight scenes", and "all of it dynamic and random so every CPU fight is different".

CPU vs CPU runs the IMPOSSIBLE brain in its `showman` style (ADR 0016). When it saw a threat and could act, it already
answered with a parry, dodge, counter or vanish most of the time; it just rarely got there:

- **Reads that never fired.** An answer picked while the CPU couldn't act (hitstop, a dash's first frames, a throw)
  was stored as "none" for the whole threat. The vanish threat counted 5 frames too many (it ignored that the brain
  skips the arrival freeze), so its dodge, counter-vanish, counter and parry answers never ran; once the vanisher
  reappeared, the 2-frame vanishKick was hidden behind the reaction time and the answer was dropped. The same held for
  teleport strikes (Rhythm Echo, Substitution). Only a plain block worked against a vanish. A counter stance pressed
  into a teleport's arrival freeze lost its release (an edge pressed during a freeze is lost). `CpuBrain` (Easy-Hard)
  timed its reactions on `planT`, which every plan change resets, so many reactions never came.
- **Timing read from the move, not the art.** Threats were timed to the start of the active frames, but an art pack
  can draw the strike later (Sasuke's Chidori has its hand behind him for the first two active frames and lands 12
  frames in), so parries against it were early and turned into blocks.
- **Few defensive moments.** An 8-frame reaction hid every jab and air jab; wavedash and back dash were never used
  defensively; blocked strings and hit stun were passive; after a parry the punish was always a jab; nothing changed
  a CPU's defensive style from match to match.

## Decision

### 1. Reads that fire (all levels)

- A "none" picked while the CPU couldn't act is re-picked the first frame it can (`retry`).
- Vanish threats count live frames: `hideFrames - t + vanishKick startup`. Vanish and teleport strikes keep their
  threat key on the strike itself (`strikeThreat`), without reaction gating: the CPU saw the smoke. The counter
  stance presses a frame earlier so its release never lands in an arrival freeze.
- Every melee threat is timed to the drawn strike: `reachT(o, m)` (`src/game/aiDefense.js`) reads the sheet's hit
  boxes with `SpriteActor.setPhase`'s phase-to-frame mapping and returns the first active frame whose box reaches in
  front of the body (`x1 >= 0.3`), cached per sheet and animation; a sheet without box data hits by reach at once.
  `CpuBrain` uses it too.
- `CpuBrain` reactions run on a live-frame clock (`clk`) that plan changes never reset. Its lane step no longer stalls
  when both fighters stand stacked in depth against the barrier.
- Answers that can't work are no longer offered: no spot dodge against a rush special (the body keeps pressing into
  the dodger and its long active frames outlast the dodge), no parry against a vortex's grind; a spot dodge against a
  shot needs two more frames of lead; a vanish answer waits in place for its moment, like a dodge.

### 2. Defense personas (`DEF_PERSONAS`, `src/game/aiShow.js`)

Each CPU rolls a hidden persona at its first frame: **parrier**, **dancer**, **phantom**, **rock** (rolled 0.7 as
often) or **scrapper** (0.8); 70 % of the time not the opponent's. Its multipliers (parry, dodge, airdodge,
wavedash, backstep, vanish, counter, block, read, rally, escape) are jittered ×0.8-1.25 per match and ±10 % per
round, and blended by a strength `s`: `m' = 1 + (m - 1)·s`.

| Brain | Strength | Effect |
|---|---|---|
| showman (CPU vs CPU) | 1 | the multipliers as they are |
| IMPOSSIBLE, INSANE | 0.4 | normalized: the advanced answers' total weight stays the style's, so the persona only changes *which* one comes out, never how often one does; block keeps its weight |
| Easy-Hard vs a person | 0.4 | the level's technique rates (`parry`, `spot`, `airDodge`, `wavedash`, `vanish`, `dodge`) reshaped, their sum kept |
| Easy-Hard spectated | 1 | the rates ×1.5, each capped at 0.9 (`makeBrain` passes `spectate` to `CpuBrain`) |

Personas also lean the hold-Guard tech direction (back × airdodge, toward × read, down × block, up × escape) and the
burst chance (× escape). They are not shown to the viewer.

### 3. New showman knobs (`STYLES`, read with `?? 0`)

Showman: `react` 8 → 6 (a heavy is dodgeable from idle, `light4` and air heavy parryable; jabs stay a guess),
`parry` 0.45 → 0.55, `dodge` 0.5 → 0.55, and new knobs in `DEF_KNOBS`: `defPersona` 1, `read` 0.5, `stringRead`
0.5, `gapEscape` 0.6, `escape` 0.5, `rally` 2, `rallyMax` 3, `rotate` 0.5, `wdDefense` 0.8, `backstep` 0.8,
`vanishWar` 2. IMPOSSIBLE and INSANE get only `defPersona` 0.4.

### 4. New answers and reads (showman)

- **Answers**: a **wavedash** out of a shot's line in depth (seen 12+ frames out, 19 for a big shot); a **backstep**
  (back dash, 8 invulnerable frames) through a swing seen 3-10 frames out with room behind; the **vanish war**:
  vanish back against a vanish (on the ground or in the air), so their kick whiffs on nobody and ours lands in its
  20-frame recovery (a Showcase tool, `vanishWar`). Rotation: each repeat of an answer among its last four multiplies
  its weight by `rotate`; a dodge within 150 frames of the last is half as likely (staleness).
- **Approach read** (`readApproach`): once per approach (dash, run or wavedash in at over 3 u/s, inside 3.4 units)
  with chance `read`, a guessed threat timed to when their jab would land, answered with a parry, dodge, backstep,
  wavedash back, back jump, a jab to stuff it, a vanish behind them or a block. A throw beats the guard and parry
  reads, a delayed jab beats the dodge: a real guess.
- **String read** (`stringRead`): on a blocked hit that chains into another, with chance `stringRead`: parry the next
  hit on its rhythm (if the lockout allows), guard-cancel vanish, or (when the next hit leaves room after the block
  stun) spot dodge, wavedash or jump out; else keep blocking.
- **Gap reversal** (`gapEscape`): once per hit-stun entry, a parry press on the stun's last frame, or a spot dodge or
  back dash on the first free frame. A true combo's next hit lands inside the stun; only gappy strings (the blue
  counter's case) get escaped.
- **Wake-up read**: as a get-up ends with them close and coming in, a parry timed to the end of the wake-up
  invulnerability, a backstep, a wavedash or a back jump.
- **Mid-combo escapes** (after an air tech, chance `escape`): air dodge away or through them, a waveland (an air
  dodge into the floor: a slide), a vanish behind them, or the super dash straight back in.

### 5. Parry punishes and rallies (showman only)

Once per parry the showman picks a jab (1), a heavy into the launcher route (0.6), a throw (0.4, a staggered fighter
can be grabbed), a vanish (0.7, it lands inside the stagger), or a **rally** (`rally` × persona × 0.5ⁿ per rally in
the exchange, at most `rallyMax`): a raw rush or shot that lands at least 6 frames after their stagger ends, a vanish
timed to reappear just after they recover, or else a heavy swung so it is already in sight on their first free frame.
The rally is not guaranteed on purpose: the recovered fighter parries it back, dodges, vanishes, counters or eats it,
so a parry, parry-back exchange can happen. An exchange ends when a real hit lands or after 3 s. IMPOSSIBLE and INSANE
keep the guaranteed jab. Presses that read an edge (vanish, special) wait for the first live frame after the parry
freeze.

### 6. Callout and code layout

- A back dash's invulnerable frames count as a dodge for callouts (`Fighter.evading`), and a swing that misses a
  back-dashing fighter by under its reach + 0.6 too: **BACKSTEP** (a `TAGS` row) through `Game.tag`. `Game.onEvade`
  counts `f.evades` for the report.
- The showcase's methods live in `src/game/aiDefense.js` (mixed into `MasterBrain`), so `aiMaster.js` stays
  readable and parallel branches touch fewer of its lines.
- Measurement: `game.brains.map((b) => b.show.report())` returns `{ persona, used, defLog, done, parries, evades,
  rallies }` (`defLog` = answers picked, `done` = actions carried out).

## Alternatives considered

- **A duel director** that choreographs both brains into exchanges: rejected, ADR 0016 rules out scripted turns.
- **A faster showman (react 3-4)** so jabs become parryable: parries would swamp everything; the reads give the same
  moments as real guesses.
- **Hold back to block for CPUs**: raises the turtle factor and changes Easy-Hard against people.
- **Showing the persona** on the VS screen or HUD: the user chose to keep it hidden (coordinator decision).
- **Persona weights in the showman's neutral plans** (space × wavedash, jump-in × airdodge, guard × block): left out
  so this change stays out of `choosePlan`, which the beam-clash work changes at the same time; a follow-up.

## Consequences

- Measured over 48 showcase matches (8 pairings incl. a mirror, two runs of 24; averages per fighter-match): parries
  3.3-3.9, spot dodges 2.6-2.7, visible air dodges and escapes 3.3-3.7, defensive wavedashes and backsteps 2.6-3.0,
  escapes after a tech 3.0-3.5; a counter-vanish in 58 % of matches, a parry exchange (two parries by alternating
  sides within 3 s) in 58-83 %; rounds 47-48 s on average (88 % within 35-70 s); all five personas every run; no
  single answer over 50 % of a fighter's picks in 93 of 96 fighter-matches. Single runs vary a lot (a counter-vanish
  needs a vanish to answer), so judge over 24+ matches. Before: about 2 parries and 1 spot dodge, no defensive
  wavedash or backstep, no counter-vanish, an exchange in 1 of 4 matches.
- Difficulty ladder (8 matches each, not spectating): Hard > Easy 7/8, Hard > Normal 4/8, Normal > Easy 5/8,
  Insane > Hard 8/8, Impossible > Insane 7/8, Impossible > Hard 8/8, all within one of ADR 0016 / ENG-058.
  Raw heavies at 1.1 units hit Easy 65 % and Normal 70 % of the time.
- A rally is a non-guaranteed punish: CPU vs CPU only (`rally` is 0 for IMPOSSIBLE and INSANE, which humans fight).
- IMPOSSIBLE and INSANE defend better against vanishes, teleports and late-drawn strikes (bug fixes), with the same
  answer rates otherwise.
- Hard rounds no longer stall with both CPUs pressed into the barrier.
- New contracts: `STYLES` knobs (`DEF_KNOBS`), `DEF_PERSONAS`, `Showcase.persona` / `pm()` / `report()`, the
  `backstep` and `vanishWar` Showcase tools, `reachT`, the BACKSTEP tag, `f.evades`.
- Follow-ups: persona weights in neutral plans; dedicated dodge / air dodge / backstep poses (ENG-046); revisit the
  knobs after the combo composer (ADR 0026) lengthens combos.
