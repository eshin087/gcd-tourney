# 0028. Timed impact tech (Smash style), alongside the hold-Guard tech

- Status: Proposed
- Date: 2026-10-11
- Deciders: User, Claude
- Builds on: [0022](0022-combo-escape-and-true-combos.md) (hold-Guard tech, tech roll, Burst, `Game.tag`),
  [0026](0026-combo-composer-and-bounce-budget.md) (bounce budget, combo composer)

## Context

The user wants combat to be a mix of Smash Bros and DBFZ (2026-10-11). Since ADR 0022 a victim escapes a combo by
holding Guard: an air tech at the first open frame, or a tech roll on landing, except after a hard knockdown. Nothing
answered the moment the victim *hits* something: a ground bounce, a wall bounce (the "handball" juggles of ADR 0026),
a spike's or a throw's hard knockdown all play out whatever the victim does, so the corner and the floor were pure
attacker territory. Smash's tech is the missing skill: press shield just before you hit the floor or a wall and you
recover on the spot, roll, or jump off the wall; press too early and you're locked out, so mashing fails.

The user's decisions (2026-10-11):

1. A timed tech beats ground bounces, wall bounces (handball included), hard knockdowns from spikes and throws, and
   normal landings. Super finishes (three-bar finals) can't be teched; they are flagged by data, never by character.
2. Smash timing: a **fresh** Guard press (an edge) within about 11 frames before the impact techs; a press that
   doesn't tech locks the timed tech out for about 40 frames. Holding Guard alone never does it (the hold-Guard
   tech keeps its job). A press during hitstop or a freeze still counts.
3. Options: on the floor tech in place (neutral) or roll left / right; on the ring barrier a WALL TECH (cling a few
   frames, kick off away, invulnerable) or, holding ↑, a WALL-JUMP TECH (higher, actionable). A teched bounce uses
   no bounce budget and ends the combo.
4. TECH! / WALL TECH! banners with their own flash and sound, and a crowd pop; the hold-tech banner stays.
5. CPUs tech by level (Easy ~5 %, Normal ~15 %, Hard ~35 %, INSANE ~55 %, IMPOSSIBLE and the CPU-vs-CPU showman
   ~65 % of techable impacts), with timing jitter that can miss; the combo composer treats a victim who can still
   tech an upcoming bounce as a risk; the training dummy gets a TIMED option.

## Decision

All numbers are data in `DEFENSE.impactTech` (`src/game/moves.js`); the logic is in `Fighter` (`readTechPress`,
`tryImpactTech`, `startImpactTech`, `wallKick`, the `impactTech` state).

| | |
|---|---|
| Attempt | a Guard press (read from the pad's press stamp) while in `hitstun` or `launched`, made after the combo began. Stamped in the fighter's **live frames** (`liveF`: frames it actually simulates, not hitstop, not world freezes): a press during hitstop or a super-flash / parry / vanish freeze counts as made on the first live frame after it. |
| Window | the impact techs when the last attempt is **0-11** live frames old (`window`). |
| Lockout | a press within **40** live frames of the last attempt (`lockout`) is ignored, so an early press (or mashing) leaves the real window dead. A success re-arms at once. |
| Impacts | the first floor contact of a fall in `launched` (a ground bounce, a spike's or throw's hard knockdown, a plain landing; not the second contact after the floor skip), and a wall bounce at the ring barrier (`wb` armed, faster than `JUGGLE.wall.minSpeed`). |
| Never | on a KO, while `held` or grabbed, outside live input, or after a hit with `noTech` (the new hit field: flurry, Amaterasu, Kirin and Four-Tails finals, Hollow Purple, the ultimate beam's final hit, ultimate clash results; a beam *struggle* result stays techable). |
| Floor | neutral stick: **tech in place**, 18 f, invulnerable 14 f. Stick left / right (screen, \|x\| > 0.5): **roll** that way, 8 u/s, friction 0.88, 22 f, invulnerable 18 f. |
| Wall | **WALL TECH**: cling to the barrier 6 f (no gravity), then kick off away at [7, 6.5], free and falling 12 f later; invulnerable 22 f from the impact. With ↑ (or Jump) held at the kick: **WALL-JUMP TECH**, [5, 13], free to act in the air at once, invulnerable 14 f from the impact. |
| Effect | the combo ends (`endCombo`), the bounce never happens, so no bounce budget is spent. The impact is checked before the hold-Guard tech roll, so a timed tech also beats the landings a roll couldn't (ground bounces, hard knockdowns). |
| Feedback | `Game.onImpactTech`: TECH! or WALL TECH! (new `TAGS` rows, white-cyan), a small white-cyan ring and spark at the contact point (the floor under them, or the barrier) with the barrier's hex flash, a `tech` hit-flash tier on the body, a new `tech` sound (a bright two-note ting), a crowd pop (`excite` and a soft cheer). |

The hold-Guard tech is unchanged: holding Guard through a combo still air-techs at the first open frame and rolls on
soft landings. Its first press is an attempt like any other, so a player holding Guard from the start of a launch is
locked out of the timed tech for that launch's first 40 frames.

### CPUs (`src/game/aiTech.js`)

- `impactAhead(f)` steps a launched fighter's flight the way `Fighter.physics` does and returns the live frames to its
  next techable impact (floor or wall); it matches the engine frame for frame with nobody touching the victim.
- `TechTimer(rate, sd)`: armed per launch with `rate` (`LEVELS.impactTech` in `ai.js`: Easy 0.05, Normal 0.15, Hard
  0.35; `STYLES.impactTech` in `aiMaster.js`: INSANE 0.55, IMPOSSIBLE 0.65, showman 0.65). Armed, it presses Guard
  `aim` (5) ± `sd` frames before each impact (`techSd`: 5 / 4 / 3 / 2.5 / 2 / 2), so a wide jitter presses too early
  (locked out) or too late; it picks in place / roll away / roll toward (0.4 / 0.35 / 0.25) or wall tech / wall jump
  (0.55 / 0.45). The choice is per launch because an earlier Guard press would lock the tech out: an armed brain that
  also rolled the hold tech techs the air gaps with a Jump tap instead of a held Guard.
- **Combo composer** (`aiCombo.js`): `techRisk()` is the victim's timed-tech rate this match (`techStats` teched /
  faced, prior 0.5 / 3), 0 while they're locked out. Edges that set up a bounce (`wall` / `gb` tags) or wait for one
  are weighted down by it (optimal: ×(1 − 0.6 risk), waiting ×(1 − 0.9 risk); personas scale it by their risk
  appetite, floor 0.15). A teched bounce ends the route with the reason `groundTech` / `wallTech`.
- **Training**: `DUMMY TECH` gets `TIMED` (every techable impact, mid-window, a random option).

### Lab

Scenarios **Timed tech off a spike**, **Wall tech**, **Wall-jump tech** and **Tech too early (locked out)**. A script
step `{ t, tech: n, len }` presses Guard once when the fighter's next impact is n live frames away (`impactAhead`).

## Alternatives considered

- **Count the window in game frames** (pad frames): a press during a spike's 15-frame hitstop would fall out of the
  window before the victim even moves. Live frames make a press in hitstop count as if made when the world resumes.
- **Any button for the timed tech** (Smash uses shield only): Guard keeps one meaning for every escape (ADR 0022) and
  doesn't collide with the any-button air tech.
- **Tech every wall contact, not only wall bounces**: a launched victim drifting into the barrier would always have a
  free out; the user's list names bounces, so only `wb` contacts are techable.
- **Holding Guard also techs impacts**: rejected by the user (decision 2): the timed tech is a skill, the hold is the
  safety net.
- **Per-impact CPU rolls**: the hold tech's own Guard press at the start of a launch locked the CPUs out of most
  impacts (a first soak teched about a third of what it aimed for), so the roll is per launch.

## Consequences

- Bounce routes are no longer guaranteed: a victim who reads the bounce techs it, the combo ends and the budget isn't
  spent. CPU vs CPU shows TECH! / WALL TECH! every match; the composer leans away from bounce routes against a victim
  who techs them.
- Spikes, throws and ground bounces are no longer guaranteed knockdowns for a player who times the press; super
  finishes are.
- New contracts: `DEFENSE.impactTech`, the hit field `noTech`, the fighter state `impactTech` (`techKind`: `inPlace`,
  `roll`, `wall`, `wallKick`), fighter fields `liveF`, `itTry`, `noTech`, `techStats`, `techedAt`;
  `Fighter.impactTechable()`, `impactTechLocked()`, `tryImpactTech()`; `Game.onImpactTech(f, kind, axis, sign)`;
  `TAGS.impactTech` / `wallTech`; `HIT_FLASH.tech`; the `tech` sound; `aiTech.js` (`impactAhead`, `TechTimer`); the
  lab script step `tech`; `dummyOpts.tech = 'timed'`.
- No new animation names: tech in place and the wall cling use `land`, the roll and the wall kick `airRecover`, the
  wall jump `jumpUp`. Dedicated `techInPlace` / `wallTech` poses are a follow-up (animation contract change, art).
- Revisit the window, lockout, invulnerability and CPU rates after the balance round-robin (ENG-048).
