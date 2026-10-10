# 0016. Showcase CPU: every CPU shows its kit, CPU vs CPU plays for the viewer

- Status: Accepted
- Date: 2026-10-10
- Deciders: User, Claude
- Builds on: [0014](0014-defensive-options-and-impossible-cpu.md) (IMPOSSIBLE CPU, defensive options),
  [0015](0015-throws-and-cancelled-special-startup.md) (throws)

## Context

The user found CPU vs CPU boring: "just basic neutral ground and air attacks". They wanted both CPUs to use
their whole kit (specials, modes, supers, ultimates), dodge spells, and show the advanced techniques (wavedash,
parry, spot dodge, air dodge) now and then, so a viewer sees how much skill expression the game has.

Instrumented CPU vs CPU matches (IMPOSSIBLE, `showman`) showed why:

- **68 % of fight time was combos**, mostly long launcher → air string → super dash juggles (victims spent
  39 s of a 78 s fight launched). Neutral was 13 %. Rounds ended in 20-35 s.
- **Most of the kit never came out.** Per fighter per match: 1-3 specials; in three matches, zero beam
  ultimates, modes, dive specials, Blue, Domain, Kirin, Shadow Clone Barrage or Whirlwind.
- **Ki sat at three bars unused**: the brain only spent three bars on a finish its damage check said would kill.
- **Advanced defense was nearly absent**: spot dodge 0, air dodge 0 (a bug: the airborne brain never reached
  its threat layer), about one parry per match. Threats were rare because neutral was jab pressure, and a
  5-frame jab is below the brain's reaction time.

The user's answers to the design questions: apply it to **every CPU**, scaled by level (not only CPU vs CPU);
**show first, but real** (the better play still wins; no scripted turns); **same ki rules, spend freely** (no
spectator-only ki boost); extras left to Claude.

## Decision

### 1. A shared Showcase layer (`src/game/aiShow.js`)

`Showcase` keeps a match-long count of the tools its fighter has used: every kit special (a ground move and its
air version are one tool), the second super, the ultimate (or the shared beam), and the system techniques
(vanish, super dash, wavedash, parry, spot dodge, air dodge, throw, charge). It only *watches* the fighter's
state (what the screen shows; `Fighter.parries` counts parries) and never presses a button. `bias(tool)` turns
the count into a weight: `1 + 3·push` for a tool the viewer hasn't seen, falling toward 1 with each use. Each
brain multiplies its own option weights by it, so variety goes up only among the options the brain already
judged real for the situation. `push` is per level: Easy 0.3, Normal 0.5, Hard 0.7, IMPOSSIBLE 0.35, showman 1.

### 2. The `showman` style (CPU vs CPU) plays for the viewer

- **Short combos with a flashy ender.** Routes are picked once per combo, weighted toward short ones: light ×3
  → a special the viewer hasn't seen, or light4 into a special cancel (shot, teleport, rush off the wall). The
  launcher route is the exception, and it stops extending at `cap` hits (5). After the ender it cashes out (a
  vanish kick sometimes) and lets the victim fall instead of looping super dash → air string. This is a real
  choice players make; the opponent still has to tech, block and escape for real.
- **Neutral at mid range with the kit.** More zoning, kit tools (pull, teleport, rush, dive leaps), air specials,
  modes and three-bar moves; less jab pressure; a wake-up "reset" that backs off to mid range instead of always
  pressing a meaty jab; a "power up" plan that backs off and charges ki while unseen tools need it.
- **Ki.** It spends freely, except that while one of its three-bar moves hasn't been seen this match it holds
  its last bars (nothing smaller may take it back under three bars) until it fires one. Spending freely under
  normal ki rules it would almost never reach three bars.
- **Defense as a weighted pick.** Each seen threat gets one answer, drawn from the ones that work against it
  (parry, spot dodge, air dodge, counter, vanish, super dash through a shot, sidestep, counter-beam, block),
  weighted by the style and the Showcase. A plain block weighs little for the showman.

The `impossible` style (vs a player) keeps its max-damage routes (`cap: 0`) and its meter habits, and gets the
same weighted defense with a smaller push, so it also mixes its answers more.

### 3. Easy, Normal and Hard (`CpuBrain`) learn the techniques

Per level: `parry` (with `slop`, the frames its timing is off by: ±5 at Easy, so most of those parries fail),
`spot`, `airDodge`, `wavedash`, and `show`. They react to attacks and projectiles with those at their level's
rate, end ground strings with whichever special (rush, shot, teleport strike) the player hasn't seen, spend more
of their ki on the kit, and pick the second super or the ultimate by what they've shown.

### 4. Feedback for the viewer

A **DODGE!** / **AIR DODGE!** callout when a spot dodge or air dodge actually makes an attack, a projectile, a
beam, a flurry super or Amaterasu pass through (`Game.onEvade`), for players and CPUs alike. Parry, vanish,
throw and counters already had one.

### Fixes found on the way

- The IMPOSSIBLE brain's `airStep` always reported "handled", so the threat layer never ran while airborne: it
  could not air dodge. It now hands over to the threat layer when nothing of its own is running.
- The light4 wall route only pressed Light on its first confirmed frame, so it almost always became the
  launcher route. The route now sticks.
- Spot dodges were triggered 4-5 frames before the hit, but need 3-4 frames (guard, neutral, ↓, dodge frame 2)
  to become intangible: they now start 2 frames earlier, and the brain waits in place instead of starting a
  dash it can't guard out of.
- A charge hold released before the 12-frame charge threshold fires a special: the brain now holds until the
  charge state starts.
- A thrown victim could end a frame past the ring barrier (the throw hold moved it after its own clamp).

## Alternatives considered

- **Choreographed exhibition** (CPUs take turns, leave openings on purpose): rejected by the user ("show first,
  still real").
- **Faster or unlimited ki when spectating**: rejected by the user (same rules everywhere).
- **A per-match checklist that forces each tool once**: forcing a tool where it doesn't fit makes the CPU throw
  away rounds in obvious ways. Weights inside the set of sensible options keep it real.
- **More HP or a longer timer in CPU vs CPU**: changes the rules; shorter combos give rounds room instead.

## Consequences

- Measured on 4 matchups after the change (showman): rounds 35-70 s, combos 3-7 hits (100-230 damage), neutral
  about 30 % of fight time (was 13 %), combos about 40-45 % (was 68 %), every fighter fired at least one
  three-bar move per match, and most fighters showed all or all but 2-4 of their tools per match. A fighter that
  loses fast shows less: the fight stays real.
- New tools (a special kind, a super kind, a technique) should be registered in `toolsOf` / `TECH` and, if the
  brains need to know when they fit, given a weight in `kitOptions`, `pickBig`, `chooseDefense` or `pickSpecial`.
- The Showcase only reads state, so a future replay or online mode is unaffected; the brains still use
  `Math.random()` (ROADMAP: seeded RNG for online).
- Revisit the showman's numbers (`cap`, plan weights) after balance changes to damage or ki gain (ADR 0011).
