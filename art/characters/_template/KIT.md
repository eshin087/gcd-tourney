# <Name>: kit (moveset brief)

> The one moveset brief that Claude and Codex both read for <Name> ([ADR 0011](../../../docs/decisions/0011-kit-baseline-and-balance.md)
> slots and budgets, [ADR 0009](../../../docs/decisions/0009-move-system-v2.md) kinds). **Claude writes it** in the
> character's data PR (`feature/char-<id>`) together with `src/characters/<id>.js`; **Codex** turns §2 into the
> ANIMATIONS.md entries and PROMPTS.md blocks of its art PRs. If a move changes later, change this file first,
> in the same PR as the data. Design facts (palette, landmarks, outfit) live in [CHARACTER.md](CHARACTER.md);
> ADR 0007 and [art/SPEC.md](../../SPEC.md) win over this file.

## 1. Moveset

Era / version: <which arc or form the art shows; moves must come from it (ADR 0011 "Era")>.
Archetype and feel: <rushdown / zoner / bruiser / trickster, in one line>.

| slot | input | move | kind | cost | numbers (raw, clean hit) | animation(s) |
|---|---|---|---|---|---|---|
| neutral | Special | <NAME> | rush / shot / pull / ... | 100 or 50 | | `special` |
| forward | → + Special | | | | | `specialForward` |
| up | ↑ + Special | | dive / teleport | | | `specialUp` (→ `airHeavy` → `land` for a dive) |
| down | ↓ + Special | | counter / mode | | | `specialDown` |
| back | ← + Special | (optional; falls back to down) | | | | |
| air | Special in the air | | | | | `throw` or `airLight3` |
| SUPER | SUPER (3 bars) | | flurry / domain / skyStrike / ... | 300 | | `superPose` or `beamCharge` → `beamFire` |
| ultimate | Heavy + Special (3 bars) | | beam / ignite / ... (see §3) | 300 | | `beamCharge` → `beamFire` |
| passive | always | (optional) | | | | |

Stats: speed <5.8-6.8>, power <>, defense <>; stat index `(speed / 6.2) × power × defense` = <0.93-1.02>.
Standing height: <occupied neutral px measured on the approved title-style reference beside the cast (ADR 0029); runtime standingBodyPx per ADR 0010 until Claude migrates it>.

## 2. Poses each move needs (for Codex)

One block per animation in the table above that this character draws differently from the template's
generic pose. Per block: frame count, phases (startup / active / recovery), `bodyHeight`, what every frame shows,
which frames are the active (hitting) ones and where the striking hand or foot is, the hand anchor for effects,
and what is **not** in the sprite (the engine draws every energy effect: no glow, fire, lightning or beams in a
sprite). `beamCharge` / `beamFire` show whatever the ultimate or SUPER uses them for, even when it isn't a beam:
the animation names are a contract.

## 3. Ultimate and SUPER: the big moments

- What the ultimate looks like on screen, second by second, and how the opponent can avoid it (dash, jump, block,
  nothing).
- Its kind, and why it isn't the same shape as the rest of the cast's finishers (check the cast table in
  docs/COMBAT_DESIGN.md: the user wants varied finishers, not a beam for everyone).
- Which other finishers it can **clash** with, if any, and what that clash looks like (only where both moves make
  sense together).

## 4. Effects and sound

The VFX atlas effects each move uses (`spark`, `lightning`, `flame`, ...), new effects to brief in art/vfx, and the
sound kinds (`sfxLoop`).
