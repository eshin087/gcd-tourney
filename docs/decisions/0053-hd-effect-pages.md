# 0053: HD effects on one page per owner, loaded per match

**Status:** Accepted (asked for by the skills-effects hub chat, 2026-10-18)
**Date:** 2026-10-18
**Task:** TOOL-064
**Builds on:** [ADR 0044](0044-signature-techniques.md) (the 256 px HD effect cell), the fighter sheet pages (TOOL-060)
and the decal page sets ([ADR 0024](0024-ground-damage-decals.md): a match loads only the pages it needs)

## Context

ADR 0044 put every full-colour signature effect on one page, `public/vfx/atlas_hd.png`: 256 px cells, 8 across, one
effect per row. The skills revamp adds about 15 effects per fighter, so the page only grows taller:

- 2048 x 8960 after Gojo (35 effects), 2048 x 11520 after Killua (45), about 2048 x 18944 once Goku (15) and Luffy (14)
  land. That passes 16384 px, the desktop WebGL texture limit, so desktop browsers would downscale it too.
- Phones with a 4096 or 8192 px limit already got it downscaled to 728 x 4096 or 1456 x 8192: their HD effects were
  drawn at about a third (or 70 %) of their resolution, with a three.js resize warning.
- Every match uploaded the whole page to the GPU, 90 MiB (RGBA, no mipmaps) whoever was fighting, and every visit
  downloaded it at boot (7.4 MB). Most of it belongs to fighters who are not in the match.

## Decision

1. **One page per owner.** Every HD effect has an `owner`: the fighter id whose techniques draw it, or `shared` (the
   default) for an effect more than one fighter uses or that shared engine code draws for anyone (`poof`, `subLog`). It
   is set on the `VFX_EFFECTS` entry in `tools/pack-sprites.mjs`; a manifest `vfx.effects.<name>.owner` overrides it.
   The packer writes `atlas_hd_shared.png` first, then `atlas_hd_<owner>.png` in table order, one effect per row as
   before. A page holds at most 16 rows, so it is at most 2048 x 4096 and a phone with a 4096 limit loads it at full
   size; an owner with more effects spills onto `atlas_hd_<owner>_2.png`. An owner that is not a lowercase id goes to
   the shared page with a warning; one the manifest has no character for is warned too. Pages a pack no longer writes
   (the old `atlas_hd.png` included) are removed.
2. **atlas.json** describes them in its `hd` block: `{ cell, ppu, pages: [{ image, owner, cols, rows }], effects:
   { <name>: { page, row, n, ms } } }`. It has no `image` / `anims`, the keys of the single page: a build from before
   this change finds no HD block it can read and keeps its HD effects procedural, instead of requesting an
   `atlas_hd.png` that is gone. The new runtime still reads such an old single-page block (as one shared page), for a
   candidate preview packed by an older packer.
3. **A match loads only its pages.** At boot `Effects.loadCustom` reads the JSON and `atlas.png` only.
   `Effects.prepare(fighters, renderer)` (match and training start, beside the decals' `prepare`) loads the shared
   pages and the pages of both fighters (`def.id`), uploads each as it arrives (`initTexture`, so the first effect does
   not hitch) and frees the GPU copy of every other owner's page. A rematch with the same fighters keeps its pages.
4. **Stand-ins until the page is in.** An HD effect whose page this match has not got draws its procedural stand-in
   (`vfxPainter.js`): during a match's first moments while the page downloads, when the page failed, or when the effect
   is drawn in a match that does not load its owner. An effect keeps the sheet it was spawned with; a held one (`keep`)
   switches to the real strip once its page arrives. The console stays quiet while a page loads; a failed page prints
   one `[vfx]` line naming its effects, and an effect drawn outside its owner's matches prints one `[vfx]` line saying
   which page it is on (its owner is wrong: make it `shared`).
5. **The shared page is `atlas.png` itself.** The runtime no longer copies it and the procedural frames into one merged
   canvas (which would have grown past 4096 px with every procedural stand-in of an effect whose art is not approved
   yet). An effect without packed art draws from the procedural sheet, which `bakeVfx` now lays out 2048 px wide (strip
   blocks side by side, `col` per strip): 2048 x 1152 for 72 effects instead of 512 x 4608.

## Alternatives considered

- **Bigger or more cells per row on one page:** the area is the same, so it only delays the 16384 px wall, and phones
  still downscale everything.
- **Pages cut every 16 rows in table order, all loaded every match:** fixes the size limit but keeps the memory (about
  150 MiB for every match once Goku and Luffy land).
- **Deriving each fighter's effects from its data:** the names are spread over kit, move and effect code (hand ticks,
  teleports, sky strikes); an owner per effect is one field, and the runtime's console line catches a wrong one.
- **Downloading every page at boot and uploading per match:** no stand-in moment at a match's start, but every visit
  would download every fighter's effects (7.4 MB now, about 12 MB with Goku and Luffy); the decal pages already load
  per match.

## Consequences

GPU memory per match for the effects (RGBA, no mipmaps; MiB):

| | Before | After |
|---|---|---|
| HD effects | 90.0 (2048 x 11520, every match) | shared 3.5 + both fighters' pages: Naruto 16.0, Sasuke 26.0, Gojo 24.0, Killua 20.0; from 19.5 (a Naruto mirror) to 53.5 (Sasuke vs Gojo) |
| Shared effects | 11.8 (the 896 x 3456 merged canvas) | 10.9 (`atlas.png`, 896 x 3200) + 9.0 (the procedural sheet, uploaded only when a procedural effect draws, e.g. `dustWave` until its art is approved) |
| Worst match | 101.8 | 73.4 |

With Goku (15 effects, about 2048 x 3840, 30 MiB) and Luffy (14, about 2048 x 3584, 28 MiB) one page would have been
148 MiB and too tall for desktop; paged, their match needs about 61.5 MiB. A phone downloads nothing for HD effects at
boot (7.4 MB before) and per match only the shared page (0.3 MB) and its two fighters' pages (Naruto 1.7, Sasuke 2.9,
Gojo 1.8, Killua 0.8 MB), cached afterwards; it draws them at full resolution.

- Every new HD effect sets `owner` (a fighter's own: its id; one several fighters use: `shared`). Shared engine code
  that names one fighter's effect (Killua's `echo` crackle, the sky strike's clouds) draws a stand-in in another
  fighter's match until that effect becomes `shared`; the console line says so.
- Review pages that showed `preview/vfx/atlas_hd.png` read `preview/vfx/atlas_hd_<owner>.png` now.
- `?debug`: `game.fx.hdStatus()` lists the pages, which are on the GPU and their size; `await game.fx.pagesReady()`
  waits for the match's pages.
- Revisit when one fighter passes 16 HD effects (its second page loads with it) or a match needs effects from a third
  owner (a data field naming the extra owners a fighter draws from).
