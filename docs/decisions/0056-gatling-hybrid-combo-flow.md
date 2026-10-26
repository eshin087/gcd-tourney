# 0056. Gatling hybrid combo flow (mash = string, live-frame buffers, chain magnet)

Date: 2026-10-25
Status: accepted
Supersedes part of [0042](0042-smash-directional-normals.md) (tilt links); amends [0004](0004-dbfz-combat-model.md)

## Context

The user played the game after ADR 0042's Smash-style normals landed and reported that combat feels awkward:
landing a light hit doesn't flow into a combo. They want the game to play like a mix of Smash and SF/DBFZ, with
strings much easier to pull off. Asked what goes wrong, they picked **"the next hit whiffs — they've been pushed
out of reach"**, chose a **gatling hybrid** for chain rules, **mash = jab string** for the stick, and they play on
keyboard, gamepad and phone touch alike.

Reading the input code found three mechanical causes:

1. **Hitstop ate the buffers.** Every melee contact freezes both bodies 7–16 frames while the pad clock keeps
   counting, and every cancel window (`Pad.buffered`) was counted on the pad clock. A follow-up pressed on the hit
   spark — the natural moment — often expired before the body unfroze. The CPUs even worked around it
   (`aiMaster` presses on live frames only, with a comment saying why); a person can't.
2. **The natural approach input started the one dead-end string.** Holding toward the opponent + Light is the
   forward tilt (ADR 0042), which never chained into anything and pushed the victim 4 units out, so walk-up
   mashing produced fTilt, fTilt, fTilt, each whiffing further away.
3. **Links were frame-tight.** Out of a tilt, the next normal was read only by `tryActions`' 5–6 frame window at
   idle, after up to 15 recovery frames plus hitstop.

## Decision

All numbers in `CHAIN` (`src/game/moves.js`); logic in `Fighter` (buffered, freshDir, stampPresses,
gatlingNormal, startChain) and two hooks in `Game.stepWorld` / `resolveMelee`.

1. **Live-frame buffers.** Every chain / cancel / attack-start window is counted in the fighter's live frames
   (`Fighter.buffered`): each fighter counts the frames it has spent frozen (`frozenF`, from its own hitstop and
   the world freezes in `stepWorld`), `stepWorld` stamps each press with the `frozenF` it happened at
   (`stampPresses`, every sim frame, since fighters skip `update()` during world freezes), and the window check
   discounts frozen frames since the press. A press during a freeze counts as made when the body unfreezes —
   the rule `DEFENSE.impactTech` already followed. Windows: chains and cancels `CHAIN.buffer` = 12, starting a
   normal from idle / run / dash / air `CHAIN.act` = 10 (was 5–6). Guard, parry and burst reads are untouched.
2. **Gatling hybrid, on hit only.** A ground light-button normal whose hit **landed** (`moveLanded`, set only on
   `takeHit` returning `'hit'`, never on block or parry) cancels from its `cancel` frame into:
   - **mash**: the jab string (a tilt goes to `light1`; the jab string keeps its own `next` order);
   - **a fresh flick + Light**: that tilt, each tilt once per string (`stringUsed`, cleared on a fresh opener);
   - **Heavy**: the launcher, or with a fresh flick that smash attack as the string's ender.
   Launching normals (up tilt, dash attack, light4) still end or link — their pop is the follow-up — and
   whiffed or blocked tilts keep full Smash recovery, so spacing and blocking still beat mashing. The jab
   string's own whiff/block chaining and its on-block launcher cancel stay as they were. Aerials are unchanged
   (the air string chains, the big aerials link, the DBFZ juggle rides).
3. **Mash = jab string; a flick is deliberate.** At every Light/Heavy press the fighter records whether the held
   direction was flicked within `CHAIN.fresh` = 9 frames (`atkFresh`, from `Pad.dirPress` edges — pure pad data,
   so replays and rollback stay deterministic). Mid-string, a stale direction (walking, approaching) mashes the
   string; only a fresh flick picks a tilt or smash. **Openers are unchanged**: walk-up + Light is still the
   forward tilt — it just flows into the string now.
4. **Chain magnet.** A chain or gatling started on a landed hit raises its lunge to `gap × rate` (16) capped at
   `max` 14 u/s, the gap measured to `closeTo` 0.85 (combo spacing, just outside `Game.separate`'s 0.72) —
   measured to a fixed spacing because packed art hits with its drawn fist boxes, shorter than `reach`. Openers
   get no magnet. Light jab pushback eased (2.2/2.4/2.8 → 1.5/1.7/2.3; fTilt 4 → 3.2) so strings stay in range.

## Consequences

- The verified core loop: walk-up fTilt → mash → light1 → light2 → light3 → light4, or any tilt mid-string by
  flick, → Heavy launcher → chase → air string → spike, with every press made at reaction speed.
- Tilt gatlings are hit-confirm only: block and whiff keep ADR 0042's punishable Smash recovery, so the hybrid
  adds flow without making pressure free. Hitstun decay, damage scaling, the 22-hit cap and the burst already
  bound long strings, so no new infinite appears (each tilt once per string guards cancel loops).
- The simulation changed: the SIM_ID moved and both det fixtures were re-recorded (ADR 0036 workflow).
- CPU brains keep working unchanged (they press on live frames and aim at the press, which reads as fresh); they
  don't yet *use* the new gatlings — teaching the combo composer the routes is a follow-up (ENG-123 note).
- `docs/COMBAT_DESIGN.md` tables updated. The old `cancel` field now also marks a tilt's gatling frame.
