# 0057. Auto follow-ups and the combo route budget (Light continues every knock-away)

Date: 2026-11-01
Status: accepted
Amends [0056](0056-gatling-hybrid-combo-flow.md) (combo flow) and [0026](0026-combo-composer-and-bounce-budget.md) (juggle rules)

## Context

After ENG-124 (the launcher continues on Light alone) the user played again and reported that combos still feel
hard to do naturally: getting a special out after the ground string, connecting after a second knock-up, after a
knock-down from the air Heavy, and above all after a wall bounce. They asked for a combo system "like other games",
Smash-like follow-ups when the opponent is in the air or wall bouncing, without the game feeling cheap or the
defender getting stuck in combos.

Measured against a strict dummy (it techs on the first legal frame), the failures were mechanical:

1. **A Special released before the hit was dropped.** `spPending` was cleared by the button's release on any live
   frame, so a quick tap during a normal's startup never came out; aerials could not cancel into specials at all.
2. **The string's own ender sent the victim out of reach of everything.** Light ×4 → Special: the cancelled rush
   whiffed the victim light4 had just launched; light4 → Light: a jab against a victim flying away. A wall bounce
   needed Dash at the right moment, then Light.
3. **Heavy pressed on the way down from the spike expired in the landing lag** (10 frames) before the fighter could
   act, so the relaunch after the ground bounce needed a press inside a few-frame window.
4. **The second air string dropped midway.** Air stun after a juggle hit decays twice (`26 − combo`, then × decay);
   by combo 11 it was 8 frames, two short of airLight3's link, so the strict dummy teched out and the spike ender
   was out of reach.

## Decision

Numbers in `CHAIN.follow` and `JUGGLE.keep` (`src/game/moves.js`); logic in `Fighter` (`followAtk`, `canFollow`,
`startFollow`, `fireChaseAtk`, `cancelToSpecial`, `updateSuperDash`, `tryActions`, `tryAirActions`, `takeHit`).

1. **One rule: Light (or Special) at an opponent reeling in the air out of reach continues the combo.** Each such
   chase is an *auto-chase*:
   - after a **knock-away ender** (a hit with `launch` that is neither the launcher nor a Smash light pop), once its
     active frames end: the follow-up super dash homes in, its contact hit catches them, and the held button swings
     off the catch (Light: the air string, or a jab on the floor; Special: the special with its cancel startup, the
     air special in the air). Presses during the dash wait instead of cancelling it short;
   - after a **throw's toss**, the same;
   - **from the floor**, at a victim a jab can't take (above `minY` or beyond `reach`): the follow-up super dash (it
     homes in at their height; the launcher's super jump sails over a low faller);
   - **from the air**, at a victim beyond the DBFZ float or once this jump's air string is spent: the follow-up
     super dash (one per airtime still);
   - the **launcher's Light chase** (ENG-124) is one too.
   Jump and Dash stay the manual, unbudgeted way; Smash light pops (`feet`) stay manual follow-ups.
2. **Special is buffered and has priority.** It is read like the other buttons in live frames (`pressFroz.special`),
   so an early tap counts; on a hit it beats the next jab of a mash; aerials cancel into the air special. Out of a
   knock-away it becomes the follow-up rather than whiffing.
3. **Landing lag doesn't age buffers** (like hitstop, ADR 0056): a press on the way down comes out on the first
   free frame.
4. **Strings finish** (`JUGGLE.keep`): a `chain` hit leaves at least 14 frames of stun after the decay, a launcher
   hit at least 24 frames of air stun. A string started on hit always completes; a late relaunch can be chased.
5. **The route budget bounds it**: at most `CHAIN.follow.max` = 3 auto-chases per combo (the victim's `chaseN`,
   reset with the bounce budget on a fresh combo), within `range` 7 units. With the bounce budget (3 wall, 2
   ground), damage scaling (floor 40 %), growing launched gravity and the 22-hit cap, a combo ends on its budget;
   the defender keeps the first-open-frame tech and Burst.

## Consequences

- Verified against the strict dummy: Light ×4 → Light or Special continues (8 hits, also with Special tapped during
  light4's startup); spike → Heavy pressed early relaunches; the second air string completes; throw → Light (7);
  greedy mashing peaks at 14 hits / 33 % in midscreen, at the wall and in the corner (was 11 hits / 28 % with exact
  timing). The longest scripted route (lab "Spike, relaunch, second air string") is 16 hits / 35 %.
- CPU vs CPU (3 matches, same seeds as production): 0 violations; time in combos 42 % (production 46 %), 12+ hit
  combos 0.33 per match (0.67); rounds shorter on average (30 s vs 37 s) as the follow-ups deal more.
- The CPU combo composer (`aiCombo.js`) still predicts stun without the floors, so it is cautious, never wrong;
  teaching it the follow-ups is a follow-up task. **Done in ENG-126 (2026-11-08):** the composer has `follow`
  (Light), `followSp:<slot>` (Special) and `chaseL` (Light on the launcher) edges, offers none once the victim's
  `chaseN` reaches `CHAIN.follow.max`, and reads the stun floors and the chain magnet. Over the 30 ordered pairs of
  the six fighters (same seeds before and after), spectated CPUs went from 1.0 to 9.0 auto-chases per match and never
  past 3 in a combo; combo length barely moved for them (5.4 to 5.5 hits on average, 0.9 combos of 12+ hits per
  match both times), because the manual Dash and Jump chases already reached the same spots and their combos end on
  the defender's timed techs, bursts and the hitstun decay (ENG-074). The IMPOSSIBLE brain's routes grew: 2.6 to 3.2
  combos of 12+ hits per match, rounds 28 s to 26 s.
- The simulation changed: SIM_ID moved and both det fixtures were re-recorded (replay and rollback stress MATCH).
  The new fields (`chaseN`, `followDash`) ride the generic snapshot.
- Tune by data: `CHAIN.follow.max` (2 would end the no-jump route after the relaunch), `JUGGLE.keep`.
