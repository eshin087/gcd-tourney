# 0058. Arcade ladder: courses, one-round rivals, a dark-mirror boss and continues that cost score

Date: 2026-11-09
Status: accepted

## Context

Playing alone meant one VS CPU match at a level the player picked, with nothing to work toward. The user asked
for the next big feature that needs no new art (2026-11-08, "what should we work on next") and chose an arcade
mode. Four design questions went to the user before any code (2026-11-09):

| Question | User's pick | Rejected |
|---|---|---|
| Final fight | **Dark mirror**: the player's own fighter, shaded, top CPU brain, extra health, faster ki | a random rival at the top level; no boss |
| Rounds | **One round per rival**; the boss stays best of 3 | best of 3 everywhere (a 12-18 minute run) |
| Difficulty | **Pick a course** (EASY / NORMAL / HARD), each climbing over the run | one fixed climb from EASY to IMPOSSIBLE |
| Losing | **Unlimited continues that cost score**; the record notes a clear without one | 3 continues; one life |

## Decision

- **A run is a ladder of ordinary VS CPU matches.** Each fight is `startMatch({ mode: 'solo', ..., arcade })`, so
  input binding, hints, the CPU brain and every person-versus-CPU rule work unchanged. The run (`ArcadeRun`) and its
  rules live in `src/game/arcade.js`, which has no DOM or three.js and is tested in Node (`npm run test:arcade`).
  `Game.startArcade / arcadeLadder / arcadeFight / arcadeTick / arcadeResults` run it; `src/ui/arcadeMenus.js` draws
  the ladder and the three ends of a fight.
- **The ladder:** every other fighter in a seeded random order (at most `MAX_RIVALS` = 7 for a big cast), the
  fighter's `rival` (character data; Naruto and Sasuke today) always last, then the boss. Stage names count back from
  the GRAND FINAL. A course's five CPU levels spread over however many rivals there are:

  | Course | Rivals | Shadow |
  |---|---|---|
  | EASY | easy, easy, normal, normal, normal | hard |
  | NORMAL | easy, normal, normal, hard, hard | insane |
  | HARD | normal, hard, hard, insane, insane | impossible |

- **Match length per match:** `Game.roundsToWin` (default `ROUNDS_TO_WIN`, reset by `cleanupMatch`) replaces the
  constant in the match flow, the HUD pips and the announcer. A one-round fight has no match point or final round.
  Online play never sets it, so its simulation is unchanged.
- **The dark mirror** is data, not a special case: `shadowDef(def)` copies the player's fighter with the name
  `DARK <NAME>`, a violet colour, `stats.defense × 1.35` (the HUD bar still reads 0-100 %) and an `outline`. The
  sprite takes `BOSS.tint` (multiply) and a standing violet rim. The rim is a generic fighter field, `def.outline`
  (`hitFlash.js`, shown whenever no hit rim is brighter). It starts each round with two ki bars and gains 0.08 ki a
  frame on top of everyone's 0.1 (`arcadeTick`, in `Game`, so `fighter.js` stays untouched).
- **Score**, per won fight, one plain rule per line: victory 5,000; 100 per second left; 5,000 × health left; 200
  per hit of the best combo; PERFECT 10,000; all × the CPU level (1 / 1.5 / 2 / 3 / 4) and × 1.5 for the shadow. A
  continue halves the run's score (`SCORE.keep`).
- **Records** stay in this browser (`localStorage` `gcd.arcade`, like the key bindings): per course and fighter the
  best score, clears, a no-continue clear and the fastest clear in fight seconds. A cleared fighter gets a star on
  the arcade character select. Every read and write is wrapped, so private mode just forgets.

## Consequences

- A new fighter joins the arcade with no work. An optional `rival` id puts a canon rival in the GRAND FINAL.
- The shadow's look depends on its tint plus outline: a fighter whose power-up covers the body (the Nine-Tails
  Cloak) shows the cloak instead while it lasts.
- Tuning lives in `COURSES`, `BOSS` and `SCORE` (`src/game/arcade.js`); `tools/test-arcade.mjs` pins the ladder
  rules and the score maths, so a change there updates its expectations on purpose.
- Revisit for: an ending per fighter (story cards, roadmap M6), unlockables, online leaderboards (would need a
  server and the licensing decision OPS-017 first).
