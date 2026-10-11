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
- **Ki.** It spends freely, except that until it has fired its first three-bar move of the match it holds its
  bars from one bar up (nothing smaller may take it back under three bars) and powers up to get there.
  Spending freely under normal ki rules it would almost never reach three bars; holding out for every
  three-bar move (some fighters have two) starved the rest of the kit.
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
  to become intangible: they now start 2 frames earlier, are only picked when that much time is left, and the
  brain waits in place instead of starting a dash it can't guard out of. A dive's hover and slam are now one
  threat (a new one at the slam re-picked the answer 2 frames before impact), and a projectile's arrival is
  measured to when it touches the body, not to its closest approach (a fireball touches 5-7 frames earlier).
  Against a 5-12 frame normal a reaction is too late anyway: the showman also spot dodges on a read, when the
  opponent runs or dashes into range while it guards.
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

- Measured on a 5-match soak after the change (showman): rounds 35-66 s (were 20-35), combos 3-7 hits
  (100-230 damage), neutral 26-34 % of fight time (was 13 %), combos about 40-45 % (was 68 %), every fighter
  fired at least one three-bar move per match, and each fighter left 0-5 of its ~16 tools unused per match
  (one Naruto showed everything). Over 10 fighter-matches: 9 parries, 12 spot dodges, 42 air dodges, 19
  vanishes, 12 throws, 15 three-bar moves. A fighter that loses fast shows less: the fight stays real.
- Difficulty ladder (CPU vs CPU, the higher level's wins): IMPOSSIBLE > Hard 8/8 (7/8 before), Hard > Easy
  13/16, Hard > Normal 4/8 (3/8 before), Normal > Easy 9/16 (6/8 before). CPU-vs-CPU win rates are a weak
  proxy for difficulty against people; the Easy/Normal additions are rare and mostly mistimed (`slop`).
- New tools (a special kind, a super kind, a technique) should be registered in `toolsOf` / `TECH` and, if the
  brains need to know when they fit, given a weight in `kitOptions`, `pickBig`, `chooseDefense` or `pickSpecial`.
- The Showcase only reads state, so a future replay or online mode is unaffected; the brains still use
  `Math.random()` (ROADMAP: seeded RNG for online).
- Revisit the showman's numbers (`cap`, plan weights) after balance changes to damage or ki gain (ADR 0011).

## Amendment (2026-10-10, ENG-056): a reserved clash

After ADR 0017 replaced mashing with rhythm clashes, CPU vs CPU still almost never showed one (0 in 14 matches):
an ultimate is only answered when the defender has three bars at that moment, and free spending rarely leaves both
fighters there at once. The user approved a fix in the showman:

- `Showcase` has a `clash` tool, present only when both fighters' ultimates can meet (`clashable`: Hollow Purple,
  Four-Tails, a beam); it counts the ultimate clashes this fighter has been in (not the one-beat special clash).
- `MasterBrain.clashWait`: while no clash has been seen this match, the showman reserves its three bars for one
  (from one bar up, like the first-three-bar-move rule). It fires its ultimate only once the opponent has three bars
  too (it reads their meter, as a player can), so they can answer it, and its answer to their clashable ultimate
  weighs `bias('clash')` more. No in-combo or punish super while it waits. It gives up for the round after 10 s at
  three bars without the opponent getting there, or with under 20 s left. Once per match, so the next three bars can
  go to the second super.
- The lab's Tools tab has a CLASH row: the training dummy plays any clash at the timing of the picked CPU level
  (`DummyBrain` `clashLevel`, Normal by default).

Measured (showman, Naruto / Gojo pairings, both sides able to clash): see CHANGELOG / docs/TASKS.md ENG-056.

## Amendment (2026-10-10, ENG-073): the show director

[ADR 0027](0027-beam-clash-energy-struggles.md) adds a `beamClash` tool (energy specials that can meet) and, in
spectator matches only, a show director (`src/game/showDirector.js`) that cues the two CPUs (showmen, or Easy-Hard
CpuBrains) once per match to play a beam clash (one challenges, the other answers). It never presses a button; the brains still decide whether the cue
is possible. `watch()` now notes `clash` only for an ultimate clash and `beamClash` for a beam clash.
