# 0043: Title first, the rest behind it: the boot and the loading screen

**Status:** Accepted (user request, 2026-10-17)
**Date:** 2026-10-17
**Task:** ENG-102

## Context

The user asked why the first load takes so long, mostly on a phone. Measured on https://gcd-tourney.vercel.app
(desktop, fast link, cold cache, 2026-10-17):

- The title showed after **5.6 s** and **31.5 MB**. JS was only ~0.4 MB gzipped (index 203 kB, game 191 kB). The rest
  was art: six fighter sheets (2.3-3.7 MB each, 4096 x 2816), their super/ultimate layers (~0.5-1 MB per fighter),
  the crowd atlas (4.8 MB), the stage, NPCs and VFX.
- `Game.init` awaited every file in turn: the art index, the VFX atlas, the decals, the crowd, the stage, then each
  fighter's anims.json, sheet and UI layers one fighter after another. So the downloads ran one at a time.
- Sheets, the crowd, VFX and NPC atlases were requested with `?v=<Date.now()>`, which defeats the browser cache: every
  visit downloaded all 31 MB again. JSON used `cache: 'no-store'`.
- Nothing was baked: all six fighters ship packs, so the 3D placeholder bake (the old "BAKING FIGHTERS..." text) no
  longer runs at all. The main-thread work before the first fetch is ~0.4 s on desktop (module eval and building the
  arena).
- The Google Fonts stylesheet blocked the first paint.

On a phone over 4G (~10 Mbit/s) the 31.5 MB alone is ~25 s before the title, and again on every visit.

## Decision

1. **Boot loads only what the title screen needs** (`Game.init`): the art index, the title art (`public/ui/`) and every
   fighter's anims.json (their pixel density picks the render detail), ~0.5 MB with the JS. The title shows then.
2. **Everything else loads behind the title, all at once** (`Game.loadWorld`, `game.assetsReady`): VFX, decals, stage,
   NPCs, crowd and all fighters in parallel; each fighter's sheet and UI layers download side by side.
3. **A screen or match that needs the fighters waits for them** (`game.whenLoaded`): `startMatch`, `startTraining`,
   `openOnline` and the character select. Until `game.loaded`, they show the loading screen with the fighters'
   progress and run once it is in (only the newest request waits). `?fight=` links, the determinism test and the lab
   keep the loading screen up until everything is in (`init({ waitAll: true })`), so their scripts see fighters at once.
4. **Cacheable art URLs** (`artUrl` in `src/core/artIndex.js`): production requests the plain path. Vercel already serves
   public files with an ETag and `max-age=0, must-revalidate`, so a repeat visit gets 304s (measured: 30 kB instead
   of 31 MB) and a deploy that changes a file still shows at once. Dev keeps a fresh `?v=` so a just-packed sheet shows.
   JSON uses `cache: 'no-cache'` (revalidate) instead of `no-store`.
5. **A real progress bar** (`src/core/loadProgress.js`, `src/ui/loader.js`): every `loadImage` / `fetchArtJson` reports
   to one tracker, weighted by the file's size from `art-index.json` (`tools/art-index.mjs` now lists the byte size of
   every game art file of 32 kB or more), so the bar follows bytes, not file count. The markup sits in `index.html` and
   `lab.html` (title art, logo, bar), so it paints before any script arrives; the font stylesheet no longer blocks
   that paint. A slim strip over the title shows the fighters loading behind it.
6. **Portrait phones** see the game's logo and title art (same `public/ui/` files, so no extra download) with the load
   bar and a smaller rotate hint, instead of only the hint.

Rejected:
- *Long-lived cache headers (`immutable`) with hashed URLs.* Every deploy would either re-download everything (a build
  id) or need per-file hashes in every request path; ETag revalidation already avoids the bytes, at one small round trip
  per file, multiplexed over HTTP/2.
- *Only the two picked fighters' sheets per match.* Smaller downloads and GPU memory, but character select draws the
  animated idle of fighters without `select.png`, and online matches must start on both machines in the same frame.
  Worth doing later (TASKS follow-up), not in this change.
- *Recompressing the sheets or the crowd atlas.* Those are generated outputs of approved art; a packer change, if any,
  is its own task.

## Consequences

- First visit on a phone: the title after ~0.5 MB instead of 31.5 MB. Fighting still needs the full download, but it
  runs while the player is on the title and menus, and it is no longer serial.
- Repeat visits download only what a deploy changed.
- Code that reaches `game.rosterAssets`, `game.fxMeta` or the crowd right after `game.init()` must wait for
  `game.assetsReady` (or go through `whenLoaded`). The guards cover every way into a match today.
- Boot timings are marked on the page: `performance.getEntriesByName('gcd:title')` and `'gcd:loaded'`.
