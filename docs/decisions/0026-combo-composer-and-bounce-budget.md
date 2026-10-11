# 0026. Seeded CPU combo composer and a per-combo bounce budget

- Status: Proposed
- Date: 2026-10-10
- Deciders: User, Claude
- Amends: [0016](0016-showcase-cpu.md) (its short-combo rule for the showman)
- Builds on: [0014](0014-defensive-options-and-impossible-cpu.md) (IMPOSSIBLE CPU), [0022](0022-combo-escape-and-true-combos.md)
  (combo escape, true combos, `Game.tag`)

## Context

The user asked (2026-10-10) for CPUs that "show off crazy long, creative, unique combos that show the complexity of
the game", with vanish and dash movement connecting them, combos off a wall bounce "that look like a handball game",
and every CPU fight different.

The spectator CPU (MasterBrain `showman`) played short combos on purpose: ADR 0016 capped them at 5 hits because the
old launcher → super dash → air string loop took 68 % of fight time and always looked the same. Its combo logic was a
fixed tree with three branch points (light3: special, launch or wall; airLight2: spike or airLight3; extension: super
dash, then one vanish), so every combo started L1-L2-L3 and ended in one of about five shapes. The engine allowed much
more than the CPU ever used: repeated same-wall bounces, vanish chains out of a vanish kick, relaunches, Gojo's Blink
refreshing the super dash, kit grinds. It also allowed **unlimited** wall and ground bounces (every bounce hit re-armed
the bounce), while the docs said "once per combo".

Since ADR 0022 a victim who holds Guard techs out at the first open frame, so a long CPU combo has to be a true combo.

The user's answers: long varied combos are for CPU vs CPU (IMPOSSIBLE and INSANE play an `optimal` persona, Easy to
Hard are unchanged); 3 wall + 2 ground bounces per combo with less stun each, no super dash refund on a wall bounce;
about one highlight combo per round per CPU; a combo ticker and an end-of-combo rating in every match.

## Decision

### 1. The juggle rules are data (`JUGGLE` in `src/game/moves.js`)

Hitstun decay, launch and juggle air stun, launched gravity, juggle pop, damage scaling, the bounce numbers and the
22-hit cap moved from `fighter.js` into one table that the engine and the CPU planner both read. A pure refactor: the
lab's air combo, wall bounce, vanish, blue combo, tech roll and burst scenarios replay with identical state hashes.

### 2. A per-combo bounce budget

| | max per combo | air stun of the 1st / 2nd / 3rd |
|---|---|---|
| Wall bounce | 3 | 32 / 28 / 22 |
| Ground bounce | 2 | 30 / 24 |

A `wallBounce` / `groundBounce` hit arms the victim only while their combo has bounces of that kind left
(`wbCount` / `gbCount`, reset by a fresh combo, an air tech, a tech roll or a burst). The hooks get the count:
`Game.onWallBounce(f, axis, sign, n)`, `onGroundBounce(f, impact, n)`. A wall bounce gives no super dash back. Same-wall
"handball" is now an explicit, limited route.

### 3. A seeded combo composer (`src/game/aiCombo.js`)

MasterBrain asks the composer at each decision point of a combo it runs (**nodes**: a ground light connected, the
launcher connected, an air light connected, another move connected, free in the air beside them, air-locked, the victim
bounced off the wall or the floor, free on the ground while they reel). The composer answers with an **edge** of a
graph: chains, launch, chase, super dash, vanish, every kit special by its kind (rush, shot, teleport, pull, dive; air
shots and dives), waiting for a predicted bounce, meeting the victim from the ground (the handball light, a jab, a
dash-in light, a heavy relaunch), a three-bar move that carries the combo on, or the end.

- **Only links that work.** An edge's link gap is checked against the victim's stun left with **2+ frames of
  margin**, so a victim holding Guard never escapes a planned link (and the counter stays gold). Predictions use
  `JUGGLE`, `MOVES`, a frame-by-frame forecast of the victim's flight (barrier and floor bounces, the budget, their
  hitstop) and **the art's hit boxes** (the union of a move's active-frame boxes: a strike drawn high misses a short or
  crouched body; one drawn behind the body never reaches). Edges that need ki, the super dash or the bounce budget
  check for it. Each link pressed is checked afterwards: its success rate and how late it lands feed the next choices of
  that brain (a per-match calibration to the art).
- **Variety.** Among the edges that work it draws one from the brain's seeded rng, weighted by: a per-match
  **persona** (rushdown, juggler, vanish artist, wall bouncer, kit showman, drawn by kit affinity read from the data:
  teleports lean vanish artist, wall-bounce specials wall bouncer, ground-bounce dives juggler, a pull kit showman; 30 %
  of a second one blended in and each tag jittered); a **length tier** per combo (short 4-7, medium 8-12, highlight
  13-20 hits) with a governor (a highlight is likelier once 20 s of a round passed without one, rarer after one, rarer
  when combos fill more than half the fight time, likelier with two bars of meter); **freshness** (an edge used often
  this match weighs less); a **cooldown** on routes that repeat a 3-edge opening of this CPU's or the other CPU's recent
  routes; a 1-step **lookahead** (long tiers favor edges that leave a long stun window, a bounce or a grind, and avoid
  dead ends such as a vanish kick with nothing left to follow it); the Showcase bias (ADR 0016).
- **IMPOSSIBLE and INSANE** use the `optimal` persona: the best-priority edge that links, as long as it links (the old
  cap 0), without the variety terms or the three-bar edge (their lethal check stays in `MasterBrain.finisher`).
- **Ki**: a highlight spends freely (it keeps three bars while the showman waits for an ultimate clash); otherwise the
  brain's `spend` rule times the persona's appetite.
- **Burst threat** (ADR 0022): with the victim holding an unused burst and 2 bars, cautious personas draw fewer
  highlights and cash out sooner; risk-loving ones bait it more (`baitK` scales MasterBrain's burst bait).
- **Seeds**: `Game.startMatch` draws a match seed (`?seed=N` fixes it); each CPU gets its share
  (`Game.brainSeed(i)`) for its persona and every composer draw. `src/game/rng.js` holds the shared PRNG (mulberry32,
  also used by the clash charts), `gauss` and `pickW`. Variety and reproducible tests, not lockstep replays: the rest of
  the sim still uses `Math.random`.
- The personas also nudge MasterBrain's neutral (`personaStarters`): a rushdown presses, a juggler jumps in, a vanish
  artist may open with a vanish, a wall bouncer pushes in near the barrier. Personas are not shown in the HUD.

### 4. A super that grabs a reeling victim carries the combo on

A flurry, Domain or maul that holds a victim who is still in a combo counts on from it (and scales like it) instead of
restarting at 1 (`Fighter.takeHit`: a `held` victim with a combo and no throw grip is still stunned). "Combo into
super" reads as one long combo (Light ×3 into Speed of Lightning: 12 hits).

### 5. What the viewer sees (every match, players too)

- Banners (`TAGS`, ADR 0022): WALL BOUNCE! (the 1st), WALL BOUNCE ×2!, HANDBALL! (big, the 3rd), GROUND BOUNCE!,
  RELAUNCH! (a launcher on someone already in the air), VANISH ×2! / ×3! (vanishes inside one combo). A wall bounce also
  zooms in, and from the 2nd one slows time for a moment.
- **Combo ticker**: `Game.trackCombos` follows each victim's combo; techniques show as chips beside the counter
  (WALL, BOUNCE, VANISH, DASH, LAUNCH, RELAUNCH, the special's name, SUPER). The counter stays up while the victim
  still reels.
- **Rating** when a combo ends: GREAT (10+ hits), AMAZING (15+), LEGENDARY (20+), STYLISH! (4+ different
  techniques), with a cheer that grows with the hit count.
- `?debug`: `comboStats()` (hit histogram, long combos and handballs per match, vanishes, distinct routes, combo-time
  share, round lengths, how combos ended, link success) and `soak(n, pairs)`.
- Lab: **Handball (3 wall bounces)** and **Vanish ping-pong** scenarios; Tools → **CPU YOU** plays you as the showman
  with a chosen persona against the dummy, with its route in the readout.

## Alternatives considered

- **Hand-authored showcase routes per character**: predictable and repetitive, the opposite of "every fight
  different". They could become high-weight seed sequences in the composer later.
- **Raising the showman's cap to 12-20**: one line, but it brings back the identical launcher loop ADR 0016 removed.
- **A search planner** (beam search over the graph with simulated outcomes): more optimal, heavier, harder to tune and
  less random. A weighted greedy walk with live link checks and a 1-step lookahead gives variety and enough correctness.
- **A wall bounce refunding the super dash**: easier air handball loops, but more corner damage for players. Not taken
  (user decision).
- **Two-wall ping-pong across the ring**: the ring (17.1 units) is wider than any launch carries; making it work needs
  bounce speeds that look wrong. The vanish ping-pong gives the back-and-forth instead.

## Consequences

- The bounce rule changed for players too: 3 wall and 2 ground bounces per combo (it was unlimited in code).
- CPU vs CPU combos are longer and different every match (soak numbers in docs/TESTING.md); rounds get somewhat
  shorter. Under the true-combo rules of ADR 0022 and the current hitstun decay a combo without meter tops out around
  10-11 hits; 12+ needs bars (vanish chains, a grind special) or a super carried on, so highlights come from those.
- Link checks read the art's hit boxes, so art with a strike box that misses makes the composer route around that
  link (Gojo's light2 and heavy boxes, at head height, pass over Killua's short hurt poses; Sasuke's old light2 box
  behind his body, fixed by the newer art). Fixing such boxes (art/hitboxes) lets the links back in.
- IMPOSSIBLE plays the `optimal` persona: about the same hits per combo as before; damage per combo within about +10 %
  (more where the old brain dropped links the art doesn't allow).
- New contracts: `JUGGLE`; fighter fields `wbCount`, `gbCount`; `Game.onWallBounce(f, axis, sign, n)`,
  `onGroundBounce(f, impact, n)`, `Game.trackCombos`, `onComboEnd`, `comboChip`, `comboShare`, `brainSeed`, `seed`,
  `comboLog`; `Hud.comboStart` / `comboTag` / `comboEnd`; `makeBrain(fighter, level, spectate, seed)`,
  `new MasterBrain(fighter, style, seed, persona)`; `src/game/rng.js`, `src/game/aiCombo.js`.
- Follow-ups: a composer-lite for Easy to Hard (CpuBrain); hit box fixes for the links above; revisit the tier
  weights after the balance round-robin.
