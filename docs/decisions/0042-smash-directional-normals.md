# 0042: Smash-style directional normals, smash attacks and Smash air

**Status:** Accepted
**Date:** 2026-10-17
**Task:** ENG-110 (engine, phase 1); follow-ups ENG-111 (CPU), ENG-112 (art), TOOL-060 (sheet pages)

## Context

The user wants the game to have more depth and to be taken seriously as a fighting game, with Smash Bros. combat:
jab, forward / up / down tilts, a dash attack, and neutral / forward / back / up airs. Until now the attack side was pure
DBFZ ([ADR 0004](0004-dbfz-combat-model.md)): Light always started the same 4-hit auto combo and Heavy was always the
launcher, in the air Light always started the air string and Heavy was always the spike, and the stick only picked
specials ([ADR 0009](0009-move-system-v2.md)). The defense side already had Smash's tools (parry, spot dodge, air dodge,
wavedash, timed tech: ADR 0014, ADR 0028).

The user's answers to the design questions (2026-10-17):

- **Knockback:** fixed per move. The HP bars and rounds stay; no percent, no knockback growth, no ring-out mode.
- **How normals connect:** Smash links plus meter cancels. Tilts and aerials don't cancel into each other: a combo is
  the next move landing inside the hit stun. The jab string stays, and specials, vanish, the super dash and supers still
  cancel on hit.
- **Heavy:** smash attacks on → / ↑ / ↓ + Heavy, charged by holding Heavy. Neutral Heavy stays the launcher.
- **Air:** Smash air (short hop, double jump, fast fall, aerials that fall with the jump, the facing held through a jump),
  but the launcher's super-jump chase and its floating juggle stay, so the anime air combos stay.
- **Art:** the strips wait until the running art audit ends; the engine ships first on stand-in strips.

## Decision

1. **The stick picks the normal** (`NORMALS` in `src/game/moves.js`, `Fighter.normalFor`). It is read when the attack
   starts; a stick that is neutral by then falls back to the one held at the press (a quick tap). Vertical wins when the
   stick is mostly up or down, as for specials.

   | | neutral | ← / → | ↑ | ↓ |
   |---|---|---|---|---|
   | Light, ground | jab (`light1`, the jab string) | forward tilt `fTilt` | up tilt `uTilt` | down tilt `dTilt` |
   | Heavy, ground | launcher (`heavy`) | forward smash `fSmash` | up smash `uSmash` | down smash `dSmash` |
   | Light, air | neutral air (`airLight1`, the air string) | forward air `fair` / back air `bair` (along the facing) | up air `uair` | down air (`airHeavy`, the spike) |
   | Heavy, air | down air (`airHeavy`) in every direction | | | |

   Light during a forward dash with the stick still held is the dash attack (`dashAttack`); with the stick let go it is
   the lunging jab, as before. ↑ and ↓ also walk in depth on the ring, so a Light pressed while walking up or down the lane
   is an up or down tilt: the same trade the specials make (attacks step into the lane on their own).
2. **Links, not cancels.** Only the jab strings (`chain` in `MOVES`: Light × 4, air Light × 3) chain into other normals:
   the next jab, the launcher, the spike. Every other normal links. Meter cancels on hit are unchanged (special, vanish,
   super, ultimate, the super dash after a launching hit, the launcher's chase). The frame data is tuned for links:
   down tilt is +11 on hit (into a jab or a tilt), up tilt pops them just over the head and juggles into itself or an up air.
3. **Smash attacks** hold on their `charge.at` frame while Heavy stays down, up to 60 frames, for up to 1.4 × the damage.
   Knockback stays the move's (fixed knockback). They are slow and punishable on block.
4. **Smash air.** Jump let go before the 4-frame squat ends is a short hop (9.6 u/s against 13.6); Jump with Light or
   Heavy within 2 frames is a short hop with that aerial out on the first airborne frame (Ultimate's shortcut, since a
   67 ms tap is hard on a keyboard). One double jump, back on landing or when hit. A fresh ↓ at or past the top of the jump
   fast-falls. In the open the facing holds through the jump (so a back air exists and jumping over someone is a
   cross-up), aerials fall with normal gravity and air control, a jump can carry several aerials, and each aerial has its
   own landing lag (`landLag`, `autoCancel` on its recovery's tail).
5. **The DBFZ juggle stays** where it was: an air attack started beside an opponent reeling in the air (within
   `AIR.juggle`, 3.2 units) floats level with them, turns to them, rides along with the air string and keeps the one air
   string per jump. The launcher's chase is unchanged.
6. **Light pops land on the feet** (`feet` on up tilt, dash attack, forward and up air): the victim lands in a short
   landing instead of a knockdown, like Smash's low knockback. Everything else tumbles as before.
7. **Stand-in art.** Each new strip is an optional animation (`animGuide.js`) with a `FALLBACK` to the nearest strip the
   fighter has, and uses that strip's hit boxes. A back air without its own strip shows `airLight3` mirrored, boxes and
   all (`Fighter.mirrorPose`). Up tilt and up smash step forward a little (`lunge`) so the borrowed uppercut reaches a
   standing opponent. The move data never depends on the drawing.
8. **The CPUs keep their game for now.** A brain that doesn't set `aimsNormals` (every CPU level and the training dummy)
   has its Light / Heavy read as a neutral stick and its jump taps as full hops, so it plays exactly the moves its combo
   composer and threat reads were built on. Lab scripts and replays stand in for a player and aim. A CPU slot without its
   brain (a replayed CPU match) reads the same way, so recordings play back identically. Teaching the CPUs the new moves
   is ENG-111.

## Alternatives considered

- **Smash percent and ring-outs** (knockback growing with damage, KO by leaving the ring): the user kept HP bars.
  **Knockback growing as HP drops** (a hybrid): the user kept fixed knockback, so every route works at any HP.
- **Pure links** (no meter cancels): the most "legit", but the hardest for new players and the biggest CPU rework.
  **Keeping every DBFZ cancel**: least change, least Smash.
- **Tilt vs smash by how far the stick is pushed** (Smash's own rule): impossible on a keyboard and unreliable on touch;
  a separate button (Heavy) is the readable split.
- **Smash-style DI**: still rejected for the ADR 0022 reasons (invisible to spectators, unpredictable for the CPU).
- **A modifier button for tilts** (so walking in depth never tilts): one more button for the most common moves; the
  specials already live with the stick's double meaning.
- **Teaching the CPUs in the same change**: the combo composer (ADR 0026) and the threat reads are built on the jab
  string and the launcher; a separate change can be soaked on its own.

## Consequences

- Ten new optional animation names per fighter: `fTilt`, `uTilt`, `dTilt`, `dashAttack`, `fSmash`, `uSmash`, `dSmash`,
  `fair`, `bair`, `uair` (60 strips for the cast of six). Codex draws them after the art audit (ENG-112), through the
  usual review. Until then the fallbacks repeat existing strips, so some moves look alike.
- **Sheet capacity.** A sheet is 16 × 16 cells (4096 px). A fighter with every alt already packs 255 frames; these ten
  strips add 68. Before Codex draws them the packer needs a second sheet page (or a larger sheet where the GPU allows it):
  TOOL-060.
- The CPUs don't use the new moves until ENG-111; their jump-ins now fall like Smash aerials, and they can be hit by
  them. Physics rules are the same for everyone; only the reading of a CPU's stick at the press is held back.
- Players' habits change: Light with the stick held toward the opponent is now a forward tilt, not the jab. The jab string
  and the bread-and-butter route need a neutral stick.
- Revisit the numbers after the art lands (the hit boxes then come from the real strikes) and after the CPUs use the
  moves (ENG-111), with a soak and the lab's frame data.
