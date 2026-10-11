# 0027. Beam clashes: energy specials that meet become a struggle; a show director for CPU vs CPU

- Status: Proposed
- Date: 2026-10-10
- Deciders: User, Claude (coordinator decisions of 2026-10-10)
- Builds on: [0017](0017-ultimate-variety-and-rhythm-clashes.md) (ultimate kinds, rhythm clashes),
  [0016](0016-showcase-cpu.md) (showcase CPU; this amends its "the CPU only presses buttons" rule for spectating),
  [0011](0011-kit-baseline-and-balance.md) (kits)

## Context

The user (2026-10-10): "never seen a beam clash: showcase it at least once a match." Nothing in the game could
produce one:

1. **There is no beam in the cast.** ADR 0017 gave every current fighter a non-beam ultimate (Four-Tails, Hollow
   Purple, Whirlwind, Amaterasu) and kept the shared beam for Goku, not built yet. Ultimate clashes exist only
   between the orb and the pounce (3 of the 10 pairings), and they look like an orb meeting a pounce, not two streams.
2. **Two energy attacks meeting just cancelled.** `projectileCollisions` killed two touching shots with a spark. That
   is exactly the moment a beam clash should start, and it happens all the time in neutral.
3. **The special clash is narrow and quiet:** two rush specials in their active frames within 1.6 units, one beat,
   the fight camera.
4. **Two independent CPU brains never line one up.** The ENG-056 reservation (ADR 0016 amendment) shows that a clash
   in CPU vs CPU needs coordination; it works only where both ultimates can meet.

Decisions taken with the user and the coordinator: build the beam clash from the **1-bar energy specials**
(Narukami, Reversal: Red, Chidori Spear, Great Fireball); **Naruto drives his Rasengan / Rasenshuriken into the
stream** (no new beam special for him); **rush against rush (Rasengan vs Chidori) stays the one-beat special clash**;
no counter-beam ultimates for Sasuke or Killua (ADR 0017 stands); **CPU vs CPU guarantees at least one beam clash per
match.**

## Decision

### 1. Energy is data

- `PROJECTILES[id].clash = 'beam'` marks an energy shot, with a `stream` palette (core / mid / edge) for its stream:
  `bolt` (Narukami), `red` (Reversal: Red), `spear` (Chidori Spear), `fireball` (Sasuke's air Great Fireball).
  The shuriken has none: it is physical and still just cancels a shot.
- `clash: 'rush'` on the rush specials `rasengan`, `chidori` and `rasenshuriken`.
- `kit.js`: `isEnergy(m)`, `energyMoves(def)` / `airEnergyMoves(def)` (`{ slot, m, cost, kind, range }`, cached per
  def), `canBeamClash(a, b)` (both have one and at least one side has a shot), `incomingEnergy(f)`. `START.shot` /
  `START.rush` record `f.answering`: the energy shot an energy move was started against. A new fighter gets beam
  clashes by flagging its shot or rush; no code names a character.
- All numbers in `CLASH.struggle` (`moves.js`).

### 2. A third clash tier: the struggle

`Game.startClash(A, B, tier)` takes `'ultimate'` (ADR 0017), `'struggle'` (this ADR) or `'beat'` (the one-beat
special clash). `c.lite = tier === 'beat'`, so every existing lite branch is unchanged, and `c.C` holds the tier's
numbers (`{ ...CLASH, ...CLASH.struggle }` for a struggle, `CLASH` otherwise); `updateClash` / `endClash` read push,
draw margin, stakes and outro from it. `clash.js` needed no change (`makeChart` and `Judge` already took a config).

| | Ultimate clash | **Beam clash** | Special clash |
|---|---|---|---|
| Starts | two ultimates' bodies meet | two energy attacks meet, or an energy special answers one | two rushes' active frames within 1.6 |
| Chart | seeded by the pairing, 20 notes, 7.7 s | **fresh every time** (`seedOf(ids, frameNo)`), ~12 presses, ~4.5 s | one ring |
| Win / draw | lead ≥ 2: 250 / 90 each | lead ≥ 1: **120 + wall bounce** / 45 each | the closer press: 60 / trade |
| Camera, HUD | clash camera, rings + bar | the same, **BEAM CLASH!** + both attack names | fight camera, one ring |
| Cooldown | none | 900 frames | 480 frames |

- **Detection** (`checkEnergyClash`, before the shots move each frame, again after the beams update, and when two
  shots touch in `projectileCollisions`): each fighter's energy as clash bodies (`energyBodies`): a shot in flight
  and a running rush are *live*; a shot in its startup and a rush in its windup are *starting*. Live meets live when
  their capsules touch head-on (the same head-on and not-passed test as ultimate clashes, on swept capsules so fast
  shots can't tunnel). A starting body meets a live one heading at its owner from up to `answerRange` 5.5 (or the
  shot it was started against): **the answer**. Two starting bodies wait; two rushes never pair. Both owners must be
  free to lock (not stunned, blocking, dodging, mid-kit-move, teleporting or KO'd) and at least `minDist` 2.2 apart.
  Running before the projectile update means a shot can't hit (or be stopped by Infinity) before it meets its answer.
- **The streams** (`materializeStream`): a shot (in flight or starting) becomes a `Beam` from its owner's hands in the
  shot's `stream` palette at width 0.95 (`Beam(game, owner, { palette, width })`; the ultimate beam keeps
  `def.beam`). The owner locks in `beamFire`; an airborne owner hovers. A Rasengan / Chidori stays a rush body held on
  its rush frame, its hand effect kept lit by `fxTicks`. Two streams meet halfway between the hands; a stream meets a
  rush `rushReach` 1.5 ahead of the fist (so the rusher doesn't jump and the flare doesn't sit on his body). The
  struggle-point flare is `sparks` 0.45 of the ultimate clash's and the end flash is 0.5 instead of 0.9: two 1-bar
  streams would vanish under the full one, and the user has asked for less white.
- **Endings**: the winner's stream runs through (`overwhelm`, the beam branch as before) or the Rasengan goes on into
  its follow-through (a new rush-special branch); the loser takes 120 (unscaled, unblockable, launch [16, 9], wall
  bounce, hard knockdown). A draw blows both back for 45. A locked owner knocked out of the lock (a burn tick's KO)
  loses the struggle. A placed body never stands past the ring barrier (physics doesn't run during a clash).

### 3. The show director (CPU vs CPU only)

`src/game/showDirector.js`, created in `Game.startMatch` only when `game.watching`, ticked before the brains. Once
per match it picks a random moment (15-40 s of fight time into round 1, 8-20 s into a later round that started
without one) and a random challenger among the fighters with an energy move, and holds a **cue** for 480 frames:
`cueFor('beamClash', index)` returns `'challenge'`, `'answer'` or null. A cue that comes to nothing expires and comes
back 6-12 s later. The director is done once the match's first beam clash starts; after that beam clashes only happen
by themselves (both firing into each other in neutral, an occasional answer). **It never presses a button or touches
the simulation**: the brains still decide whether the cue is possible right now (the answerer's ki and state, the
distance), and a real fight goes on around it.

This amends ADR 0016's principle that the CPUs act alone: in spectator matches only, two brains coordinate one
moment per match. Solo and versus CPUs never get a cue.

### 4. The CPUs

- **MasterBrain** (IMPOSSIBLE, INSANE, showman), edits kept to: `threat()` (an energy shot in its startup is a
  threat, `es`, when nothing else is coming; a cued answerer reads it at once, so a 9-frame Chidori Spear can be met),
  `chooseDefense` (an `answerEnergy` offer for an energy threat when an affordable answer exists: weight 50 when cued,
  `0.15 × flair` for the showman and `0.25 × flair` against a person otherwise; a short shot waits until theirs is
  close so the two meet before it fizzles), `choosePlan` / `runPlan` (`challenge`: weight 12 when cued and the
  opponent has the ki to answer, into their lane at a gap their answer reaches, fire once they are free; the cued
  answerer keeps to mid range; short of ki, power up), `spend()` (while the director still has one to cue, keep the
  ki for one energy move) and `playClash` (when spectating, each clash's timing error is jittered ×0.6-1.8 so two
  showmen rarely draw).
- **CpuBrain** (Easy / Normal / Hard): answers an incoming energy shot, or a shot or Rasengan starting further away
  than a melee reaction, at `special × 0.6 × bias('beamClash')` (Easy 9 %, Normal 18 %, Hard 27 %, up to ×3 while
  the player hasn't seen one).
- **Showcase**: a `beamClash` tool when `canBeamClash` holds; `watch()` notes `beamClash` for a struggle and `clash`
  only for an ultimate clash, so a beam clash doesn't count as ENG-056's ultimate clash.

### 5. Lab

Scenarios **Beam clash (energy vs energy)**, **Answer an energy shot** and **Beam clash from the air**, built from
`energyMoves` (timed around the 8-frame kit flash and the release frame of a ground special).

### Measured (2026-10-10, port 5244)

- Lab: Beam clash starts in all 9 pairings that have energy on both sides (the Naruto mirror says it can't); Answer
  an energy shot in all 12 ordered pairings with a shot on the dummy's side; Beam clash from the air in all 12 with an
  air shot on P1's side. Negative cases (hit stun, under 2.2 apart, inside the cooldown, shuriken vs bolt) cancel as
  before; Hollow Purple still erases shots. Ultimate clash: tier `ultimate`, 20 notes, 250 / 90; special clash:
  tier `beat`.
- CPU vs CPU soaks (IMPOSSIBLE showman, frame-stepped): every ordered pairing ×3 twice (96 matches, the second after
  merging main's ground damage) plus 44 Naruto-pairing matches: **130 / 134 matches that can have one showed a beam
  clash (97 %)**, about 1.2 per match (at most 4, a Sasuke mirror trading spears), 23 of 159 struggles drawn (14 %),
  the first one anywhere from 99 to 40 s on the round clock, director dues 9-61 s; no NaN, no fighter outside the
  ring, no stuck states, no console errors, live effects back to 0-9 between matches. ENG-056 is not starved: 15 / 18
  Naruto / Gojo matches still had their ultimate clash (13 / 15 with the director off). The misses were short
  matches or ones where four cues in a row found the answerer busy.

## Alternatives considered

- **Beam ultimates for everyone** (counter-beams for Sasuke and Killua): contradicts ADR 0017 (at most one beam,
  ignite and reflex never clash) and still needs three bars on both sides. Declined by the user.
- **Upgrade shot-vs-shot cancels to the one-beat clash only**: cheap, but no streams and no clash camera: it would not
  read as a beam clash.
- **Rasengan vs Chidori as a full struggle**: more cinematic, but the coordinator kept it the quick special clash to
  keep neutral moving. It also leaves the Naruto mirror without a beam clash (below).
- **The director inside each brain's Showcase** (no shared module): the two brains can't agree on a challenger and an
  answerer, so the once-per-match promise gets weak (ENG-056 manages about 5 in 6). A tiny shared scheduler that only
  cues is simpler and keeps the fight real.
- **A random due without cues** (the showman simply prefers beam clashes while unseen): measured first. Every match
  had its beam clash in the first five seconds, the same way each time; the director's random moment fixes that.

## Consequences

- Every pairing except **the Naruto mirror** can beam-clash. Early-Shippuden Naruto has no energy shot and rush
  against rush stays the special clash, so Naruto vs Naruto never shows one (the director stays idle there). A later
  Naruto kit with a shot, or a user decision to make Rasengan-vs-Rasengan a struggle, would close the gap.
- Beam clashes add 4-5 s of locked time and a 120 + wall-bounce swing to 1-bar exchanges. The 900-frame cooldown
  and the low answer weights keep it to about one per match in CPU vs CPU; re-run the ADR 0011 round-robin if
  Killua or Sasuke (50-ki shots) gain too much, and drop `winDmg` to 100 if so.
- Struggle charts are seeded with the frame number, so they are not reproducible per pairing (the lab still plays the
  same input timeline each time).
- In spectator matches the showman keeps one energy move's ki until the director's beam clash happened.
- Optional art, not required (the streams use the procedural beam shader): a `clashBurst` / `clashShock` VFX entry
  for the meeting point, and struggle-friendly `beamFire` poses (Gojo's and Sasuke's read as finisher releases).
