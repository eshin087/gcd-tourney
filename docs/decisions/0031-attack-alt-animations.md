# 0031: Attack alt animations (<anim>Alt strips alternated with the base)

**Status:** Proposed
**Date:** 2026-10-12
**Task:** ENG-081 (engine, packer, contract), ART-ALTS-NAR then ART-ALTS (Codex art)

## Context

Every light string, launcher and air string plays the same strip every time, and so do the two hit reactions. In a
long fight the user sees the same swing over and over (user request, 2026-10-12: an alternate version of all nine
attacks and both hit reactions; Naruto pilots them). Two constraints shape the answer:

- **Gameplay timing lives in `src/game/moves.js`, never in the art** (CLAUDE.md hard rule 1). An alternate drawing must
  not change startup, active, recovery, damage or reach.
- **Melee hit boxes come from the art.** `Game.checkMelee` reads `asset.boxes(actor.frame, 'hit' | 'hurt')` from the
  frame on screen, so a drawing that strikes higher, lower, shorter or longer changes what connects. An alternate is
  visual only if it strikes where the base does.

The engine must also behave exactly as today until alt art exists, keep the startup 3D bake flat (it runs on the main
thread) and stay deterministic for a future online mode (CLAUDE.md gotcha: the sim will need a seeded RNG).

## Decision

1. **Eleven optional canonical animations** in `src/art/animGuide.js`: `light1Alt`, `light2Alt`, `light3Alt`,
   `light4Alt`, `heavyAlt`, `airLight1Alt`, `airLight2Alt`, `airLight3Alt`, `airHeavyAlt`, `hurtHighAlt`, `hurtLowAlt`.
   Each records its base (`altOf`) and has the base's frame count and phases. Never core: the `complete` flag and
   `missingCore` are unaffected. `FALLBACK` maps each alt to its base.
2. **No placeholder alts.** `src/art/rig/anims.js` keys none: the baker renders every keyed animation at startup, and a
   placeholder alt would only re-pose the same chibi swing. A baked sheet therefore has no alt strip, `SheetAsset.has`
   is false and the fighter keeps the base; bake time is unchanged.
3. **Deterministic alternation.** `src/game/animAlts.js` (pure, no three.js) holds the base -> alt table and
   `pickAnim(base, counters, hasAnim)`. Each fighter keeps a use counter per base (`Fighter.animUses`, per match). The
   n-th use plays the alt when the Thue-Morse bit of `n + offset(base)` is 1 (bit = parity of the set bits). The
   sequence is balanced (every aligned pair holds one of each), never shows one version three times in a row, and the
   per-base offset (a small stable hash, 0-7) keeps light1-light4, used once each per string, from all switching
   together. No `Math.random`: the same inputs give the same pictures on every machine.
4. **Fail soft, per strip.** An alt is picked only when the fighter's sheet has it as its own strip
   (`SheetAsset.has`, never through `FALLBACK`); otherwise the base plays and the counter does not move. A fighter with
   some alts drawn alternates only those.
5. **Hook points.** `Fighter.startMove` maps every move's `anim` through the picker (the normals, the air normals, and
   kit moves that borrow these strips: `vanishKick` plays `light4`, a counter's follow-up, a super dash's attack);
   `updateAttack` keeps playing that strip on the move's own phases (a move set without `startMove`, a beam clash
   resuming a rush, plays its base). `takeHit` maps the `hurtHigh` / `hurtLow` it chose (the existing high/low
   alternation stays). The throw keeps its borrowed `light1` / `light4` poses: its reach, hold and toss are tuned to
   those frames and an alternate technique would not read as a grab.
6. **Same contract as the base, checked by the packer** (contact amended 2026-10-14, see the amendment below). An alt keeps the base's frame count and phases, strikes at the
   base's height and reach, starts and ends on the base's poses (so any mix blends), uses a different technique and the
   same anatomy at the idle's scale (art/SPEC.md "Attack alts"). The packer (`altCheck`) compares every packed alt with
   its packed base: another frame count or phases warns; the union of the active-phase hit boxes (cell px, facing
   right, after `hitboxes.json`) warns when its far edge is more than 12 px nearer or farther or its vertical centre more
   than 16 px higher or lower (a `light3` alt hitting higher says that light3 is a low); an alt packed without its base
   warns. Warn, never fail: the user still reviews every alt in game.
7. **Review switches.** `?alts=0` never picks an alt, `?alts=1` always picks it when the sheet has one (any page,
   parsed like `?depthscale`). The lab has an "Attack alts (repeat a string)" scenario.
8. **Manifest.** `art/manifest.json` lists the eleven alts in `animationDefaults` and for every fighter (status `todo`,
   `altOf`, frames / phases / ms / bodyHeight copied from that fighter's base entry). Where an alt's own entry is silent
   the packer takes the fighter's base entry, then the defaults.

## Alternatives considered

- **Random choice per use.** Simple, but it repeats a version three or four times in a row often enough to feel broken,
  and `Math.random` in the sim would desync a future online mode or a replay.
- **Context-based choice** (alt on the 2nd and 4th hit of a string, alt against an airborne target, alt on a counter
  hit). It ties art to combo state, so a string always looks the same again, which is the complaint; it also makes the
  pattern depend on gameplay rules that change. Can be layered on top of the counter later if the user wants it.
- **More than one alt per move** (`light1Alt2` ...). More variety, but three times the art per fighter and a harder
  contract to keep at the same height and reach. One alt with a no-triple pattern already breaks the repetition.
- **Baked placeholder alts.** Keeps the contract symmetric, but adds about 65 frames to every startup bake for art that
  is a re-pose of the same chibi strike, against the "keep the bake under ~1 s" budget.

## Consequences

- Art cost: 11 strips per fighter (65 frames), drawn after the base is approved; Naruto first, the user reviews them in
  game before the other three (ART-ALTS). With every alt a sheet has 56 animations and 255 frames: 16 rows, 4096 x 4096
  (still one 4096 texture).
- Hit boxes: since the 2026-10-14 amendment an alt ships its base's boxes, so contact cannot differ; the drawn strike
  still has to land near them (the packer warns past 24 px) so the hit spark sits on the limb. `aiDefense` / `aiCombo` keep reading the base strip's timing (the same phases), and an
  alt within tolerance changes their reach estimate by at most a few px.
- `npm run status` counts the alts as unapproved optional strips (42/53 per fighter until they are drawn).
- Tests: `npm run test:alts` (the picker, the contract, `?alts`), `npm run test:sprites` (`altCheck`, inheritance from
  the base entry).
- Revisit if the user wants context-based variety, more alts per move, or alts for specials and supers.

## Amendment (2026-10-14): alts inherit their base's boxes

The Naruto pilot (PR88, eleven v01 alts) showed the art-box contract failing for reasons that are not about gameplay.
Seven of nine attack alts missed the 12 / 16 px contact tolerance: the packer's auto hit box finder had picked a torso,
a guard fist or a whole foot area on new drawings, and a few alts struck elsewhere by design. Keeping each alt's own
boxes would mean a hitboxes.json override per alt frame, or redraws, just to reproduce boxes the base already has. It
would also leave gameplay depending on the drawing, against what the user was promised when they chose alts:
"damage, timing and hitboxes stay the same; only the art changes".

**Decision.** The packer copies the base's `hit` and `hurt` boxes onto every alt frame, frame for frame
(`inheritAltBoxes`, after `altCheck`). An alt's own `hand` anchor stays, so hand effects follow the drawn hand. An alt
whose frame count differs from its base's cannot be matched frame for frame: it keeps its own boxes and the packer
warns, as before. `altCheck` now judges the drawing only: where the alt's drawn strike lands (its auto box, or a
`hitboxes.json` entry on the alt that points at the fist or foot) against the base's hit, with a 24 px tolerance,
because the hit spark appears where the base's boxes meet the opponent.

**Consequences.** Contact, hurt boxes and the AI's reach estimates are the base's by construction; no per-alt
hitboxes.json overrides are needed. An alt drawn far from the base's strike (a low sweep for a mid kick) still connects
like the base but shows the spark off the limb, so it is redrawn rather than accepted. The runtime is unchanged
(`checkMelee` reads the frame's boxes as before).

