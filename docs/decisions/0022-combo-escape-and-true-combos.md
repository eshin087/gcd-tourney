# 0022. Combo escape (hold-Guard tech, tech roll, Burst), true combos and the blue counter, technique callouts

- Status: Proposed
- Date: 2026-10-10
- Deciders: User, Claude
- Builds on: [0004](0004-dbfz-combat-model.md) (combat model), [0014](0014-defensive-options-and-impossible-cpu.md)
  (defensive options, IMPOSSIBLE CPU), [0016](0016-showcase-cpu.md) (showcase CPU)

## Context

The user asked for three things (2026-10-10):

1. **A way out of a combo.** "Hold a button during a combo to auto recover if the enemy messes up their combo."
   The only escape was the air tech: a fresh button press after air stun ran out. Holding a button did nothing,
   and there was no paid breaker. Given the choice, the user picked **hold Guard** to recover at the first gap
   (an air tech, or a tech roll on landing) **plus a once-per-round Burst for 2 bars** that knocks the attacker
   away mid-combo (Guilty Gear / DBFZ style), over an "Escape Vanish".
2. **The blue combo counter** (BlazBlue / Guilty Gear): a combo the victim could have escaped shows in blue.
   The counter had no idea whether a combo was real: in the air, a victim whose air stun had run out could sit
   there able to tech for several frames, and the next hit still added to the combo.
3. **Callouts like other fighting games** for every defensive success (parry, spot dodge, air dodge...). All of
   them went through one `Hud.callout()` element per side, so each new callout replaced the last one (a PARRY!
   was wiped out by the special-name callout of the punish that followed), and air tech, wavedash, reversal and
   punish had none.

## Decision

All numbers are data in `DEFENSE.tech`, `DEFENSE.burst` and `DEFENSE.reversal` (`src/game/moves.js`).

### 1. Hold Guard to tech, with a direction

- A launched victim (not KO'd, not `held`) can tech on an **open frame**: air stun over and above
  `DEFENSE.tech.minY` (0.35). Any button press techs, as before, and now **Guard simply held** techs too, on the
  first open frame. So a victim who holds Guard through a combo can only be hit by a true combo.
- The stick picks the hop, read against the opponent's side of the screen: neutral or away = **back** (the old
  hop), toward = over to their side, ↑ = rise in place, ↓ = drop straight to the floor (lands with 4 f of lag).
  16 f invulnerable, 10 f long, as before. The combo cap (forced tech at 22 hits) stays.

### 2. Tech roll

A launched victim who lands while holding Guard rolls back to their feet (20 f, invulnerable 18 f, 7.5 u/s in
the stick's direction, else away from the attacker; reuses the `airRecover` pose with afterimages) instead of
lying `down`, **unless the last hit was a hard knockdown**. New hit field `hardKnockdown`; unset it defaults to
true for ground-bounce spikes (air heavy, dive slams) and big unblockable hits (throws, super and ultimate
finishes, clash results); the throw toss, the air heavy spike and the beam's final hit set it explicitly. A KO
never rolls.

### 3. Burst (Guard + Special while being hit)

| | |
|---|---|
| When | in `hitstun` or `launched`, read even during hitstop. Not when `held` (Domain, flurries, the Four-Tails maul, Infinity stagger) or grabbed, not inside the opponent's three-bar move (a `kit` move costing 300) or beam, not in a clash or Domain. |
| Cost | 200 ki (2 bars), **once per round** per fighter (`burstUsed`, reset with the round; the training room gives it back after a calm spell) |
| Shape | an 8 f world freeze with BURST!, then 4 f of startup and 6 active frames of an invulnerable shockwave (radius 2.4) in the fighter's color. It ends the combo and lets go of a grinding vortex. |
| Hit | the attacker inside the radius takes 10 damage and is launched [14, 9] away (`DEFENSE.burst.hit`). It is **blockable and parryable**. |
| Recovery | 20 f after a hit or a whiff, **30 f when it was blocked or parried**: the attacker who stopped and guarded punishes it (**burst bait**). |
| HUD | a gem by each ki gauge: lit while the round's burst is unused, glowing when there's ki for it, dark once spent. |

The input is the vanish chord, which does nothing in hit stun, so it needs no new button, and the touch VANISH
macro bursts too. The later press must be within 3 f (`buffer`), and Special itself must be pressed after the
combo began (`comboFrom`) and under 6 f ago (`chord`, as for the vanish), so a vanish pressed just before getting
hit doesn't turn into a burst, and neither does a Guard press (a tech) from a fighter whose ki charge got hit with
Special still held. A burst that starts on the frame the attacker's hit connects wins: a melee hit queued earlier
that frame (P1 updates before P2) whiffs against it.

### 4. True combos and the blue counter

- `Fighter.gapF` counts open frames since the last hit (the tech gate above, plus the landing frame when a tech
  roll was possible and not taken). A hit landing after a gap sets `comboBlue` for the rest of the combo;
  `lastGap` / `maxGap` keep the numbers. Grounded hit stun can't gap (it returns to idle and the combo restarts),
  and `held` victims can't act, so their hits stay true.
- A multi-hit move can't be teched midway: the new hit field `lock` keeps air stun and hit stun at least that long
  (beam ticks: `tickEvery + 3`; Rasenshuriken and Blue vortex ticks: `tick + 3`).
- The HUD counter turns blue (with a pop on the hit that turned it); in training it shows `GAP nF`, the widest gap
  of the combo.
- With the current decay the bread-and-butter route (light ×3, heavy, chase, air string, spike, ground bounce) is
  true; air-chain extensions past about 12 hits without a bounce, vanish or relaunch turn blue.

### 5. Technique callouts

A data table `TAGS` (`src/ui/hud.js`) and one entry point, `Game.tag(f, id)`: a banner slides in at the screen
edge of fighter `f`'s side, stacked newest on top, at most 3 per side, each sliding out by itself. `big` rows
(PARRY!, BURST!) are larger banners, `small` ones (WAVEDASH) quieter; `cool` is a per-fighter cooldown in frames;
`color: null` uses the fighter's color; `excite` lifts the crowd. Shown in every match:

| id | text | when |
|---|---|---|
| parry | PARRY! | a parry (was the big callout) |
| burst | BURST! | a burst starts |
| dodge / airDodge | DODGE! / AIR DODGE! | something passed through a dodge (now also a throw or a super dash), a Kirin dodged |
| tech / techRoll | TECH! / TECH ROLL! | an air tech, a tech roll |
| throwBreak | THROW BREAK | a throw break (was BREAK!) |
| reversal | REVERSAL | the first hit of an action started within 3 f of leaving hit stun, block stun, wake-up, a tech or a stagger |
| punish | PUNISH! | a fresh combo on someone in their own recovery: a whiffed or blocked move, a parry stagger, the end of a dodge, landing lag, a whiffed throw, a kit move's recovery, a blocked burst, a beam |
| wavedash | WAVEDASH | a wavedash (once per 6 s per fighter) |

Special names and kit callouts (COUNTER!, SUBSTITUTION!, MAX POWER!...) keep the old `Hud.callout()` row, so the
two never overwrite each other. Later work adds its own ids (CPU defense, combo composer, beam clash): a `TAGS`
row plus one `game.tag(f, id)` call.

### 6. The CPUs

- **CpuBrain** holds Guard through a launch with `techHold` per launch (Easy 5 %, Normal 20 %, Hard 45 %), keeping
  its old per-frame tech tap as a late fallback, and bursts with `burst` per combo of 3+ hits (0 / 4 % / 12 %),
  pressed at hit 3-5.
- **MasterBrain** holds Guard to tech when its `tech` roll says so, with a direction picked per launch (back 0.5,
  toward 0.2 when close, down 0.2, up 0.1), and bursts per combo of 3+ hits with `burst` (IMPOSSIBLE 30 %,
  INSANE 15 %, showman 35 %, ×1.5 when under 350 HP or when the attacker sits on three bars; the showman also
  leans toward it while the viewer hasn't seen one), pressed at that hit or the next. IMPOSSIBLE and
  showman **bait** bursts (`bait` 25 % / 30 % per combo against a victim who has one): they stop after hit 3-5 and
  guard, then punish the burst's recovery (a new `opening` case).
- **DummyBrain** (training): `DUMMY TECH` never / hold / random (half the launches, a random direction) and `DUMMY
  BURST` off / on (bursts at hit 3) in the training panel (`game.dummyOpts`). The default (never, off) keeps the
  old dummy: GUARD mode lets go of Guard for the whole launch, so it never techs or rolls by holding it.
- **Showcase**: `burst` is a technique tool.

## Alternatives considered

- **Escape Vanish** (2 bars, vanish out of the combo and kick from behind; the investigation's recommendation):
  reuses the vanish, needs no HUD, but the user picked the Burst.
- **Free Burst without ki** (Guilty Gear's separate burst gauge): more HUD and a free escape every round; 2 bars
  makes it compete with the three-bar moves, so it is a real choice.
- **Any held button techs** (Strive): easiest on a phone, but the user picked Guard, which also reads as "I'm
  defending".
- **Smash-style DI** (bend the knockback with the stick): invisible to spectators, unpredictable routes, hard for
  CPUs. **Mash to escape**: rewards mashing, against the parry lockout's intent (ADR 0014).
- **Big tags in the old big callout row**: a punish's special name would still wipe PARRY! out, so big tags are
  larger banners in the same stack.

## Consequences

- Long combos can now be escaped by holding Guard, so the counter and the CPUs care whether a combo is true; air
  extensions past ~12 hits want a bounce, vanish or relaunch. CPU vs CPU shows TECH!, TECH ROLL! and BURST! every
  match; blue counters show up when IMPOSSIBLE's long routes leave a gap (and more once the combo composer, ADR
  0026, builds longer routes).
- Wake-up pressure is rarer: a held Guard rolls out of most knockdowns. Spikes, throws and supers still leave
  the victim down.
- A burst costs 2 bars, which delays three-bar moves; burst bait gives attackers a reason to stop a combo early.
- New contracts: `Game.tag(f, id)` and `TAGS`; the hit fields `hardKnockdown`, `lock`, `burst`; fighter fields
  `comboBlue`, `gapF`, `lastGap`, `maxGap`, `burstUsed`, `canBurst()`, `techOpen()`.
- No new animation names: the tech roll uses `airRecover`, the burst `charge`. Dedicated `techRoll` and `burst`
  poses are a follow-up (animation contract change, art).
- Revisit the burst's numbers (cost, recovery, radius) and the CPU rates after the balance round-robin (ENG-048).
