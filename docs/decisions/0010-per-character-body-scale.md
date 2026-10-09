# 0010. Per-character body scale: a shorter Killua and a taller Gojo

- Status: Accepted
- Date: 2026-10-09
- Deciders: User, Claude
- Amends: [0007](0007-art-spec-v2-shippuden-256.md) ("every character uses the same body scale")

## Context

ADR 0007 gives every fighter a 200 px standing body (soles to top of skull) in the 256 px cell, so
the strike landmarks and hit heights are the same on everyone. `art/SPEC.md` asks for an ADR and a
reach/lunge check before a genuinely taller or shorter character is added.

The next two fighters are not the same size as the Shippuden cast:

- **Killua** (Hunter x Hunter, Godspeed era) is a slight 14-year-old and clearly shorter.
- **Gojo** (Jujutsu Kaisen) is very tall. His height and long limbs are part of how people recognize him.

Drawing both at 200 px would erase that. The art briefs (`art/characters/killua/`,
`art/characters/gojo/`) were written for the real sizes.

## Decision

1. **A character may set its own standing body height** in `art/manifest.json`
   (`characters.<id>.standingBodyPx`). Its `bodyHeight` table is the shared table times
   `standingBodyPx / 200`, capped at the cell ceiling (soles on y 240, 4 px top margin = 236 px).
   - **Killua: 182 px** (x 0.91). The one exception is `heavy`, at 206 px instead of 198, so its
     claw still reaches the F04 strike zone.
   - **Gojo: 215 px** (x ~1.09; tall poses are redrawn to stay under 236 px rather than clipped).
2. **The head stays about 31 px for everyone.** Only the body grows or shrinks, so the cast keeps
   one pixel density and one face size. Killua is ~6 heads and Gojo ~7.
3. **pixelsPerUnit stays 128 for every sheet.** A taller body is taller in the world too. The
   engine needs no special case: hurtboxes and hitboxes are per frame, so a taller sprite is
   automatically a taller target with longer reach.
4. The packer scales its automatic-hitbox heuristics with the character's `standingBodyPx`
   (`tools/pack-sprites.mjs`, `boxTuning`). The spec-wide `spec.standingBodyPx` stays the default.
5. **Strike zones stay as specified** (the ADR 0007 landmark table). Normals aim at the same y
   bands on every body, so a short fighter's HIGH strike lands at head height on a tall one and
   at brow or shoulder height on someone his size. That's intentional.

## Reach / lunge check (2026-10-09, baked placeholders)

Placeholder bakes use the same props as the briefs. Measured from the sheets in a debug session
(world units):

| fighter | idle hurtbox top | light1 reach | light3 | light4 | airHeavy |
|---|---|---|---|---|---|
| Naruto | 1.45 | 0.75 | 0.68 | 0.66 | 0.68 |
| Sasuke | 1.36 | 0.75 | 0.68 | 0.66 | 0.68 |
| Killua | 1.34 | 0.73 | 0.64 | 0.61 | 0.66 |
| Gojo | 1.55 | 0.80 | 0.75 | 0.73 | 0.70 |

- The differences in reach are **at most 0.07 units**. That's smaller than the hitbox growth
  (`boxPad` 0.1) and much smaller than every move's `lunge` (4.5-6 units/s), which is shared. Every
  normal still connects from the spacing the AI and auto-combo use.
- The balance offsets live in the stats in each character file:
  - Killua: faster (speed 6.8), slightly weaker and frailer (power 0.92, defense 0.9).
  - Gojo: slower (speed 6.0), stronger and sturdier (power 1.1, defense 1.05).
- CPU-vs-CPU soaks (Killua-Gojo x3, Gojo-Naruto, Sasuke-Killua, both mirrors) finished with no
  stuck states, whiff loops or ring-outs.

## Alternatives considered

- **Same 200 px body for everyone (status quo).** It's simple, but Gojo would look as tall as Naruto
  and Killua would look like an adult. Both are wrong for the fans.
- **Scale the sprite in the engine (per-character world scale).** The art would stay at 200 px and
  be stretched in the world. That breaks the shared pixel grid (the HD-2D look relies on one texel
  size) and makes faces different sizes on screen.
- **Separate strike-zone tables per body size.** That's more data to keep in sync, and "a hit lands
  at the same height in the world" is the rule players feel. Rejected for now.

## Consequences

- With the four kit animations (ADR 0009), Killua and Gojo have 42 animations: 175 frames, which is
  an **11-row sheet (4096 x 2816)**. The packer already sizes rows from the frame count. The
  2048 px texture-limit fallback in ADR 0007 still applies.
- Hurtbox height now differs between fighters, so some air combos may drop on Killua sooner. Watch
  this when real art lands and re-run the reach check with the packed sheets (the table above is
  from the placeholder bakes).
- Every future fighter that isn't ~200 px needs a `standingBodyPx`, a scaled `bodyHeight` table and a
  row in the reach table above.
