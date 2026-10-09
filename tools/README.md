# tools/

| file | what |
|---|---|
| `pack-sprites.mjs` | **Sprite packer**: turns ChatGPT art in `art/` into what the game loads from `public/` (sheets, `anims.json` with hit/hurt boxes, VFX atlas, UI images). |
| `test-pack-sprites.mjs` | Regression test for the packer. Generates fake ChatGPT strips in `tools/.test-fixtures/` (git-ignored), packs them, checks ~100 things (incl. adversarial art: specks, black/transparent backgrounds, edge-cropped feet, one huge pose, extra/missing poses), deletes the folder. |

Both are plain Node ESM (Node 18+). The only dependency is `pngjs` (devDependency).

---

## Sprite packer

### Run it

```bash
npm run sprites                 # every character in art/characters/ + the VFX atlas
npm run sprites naruto          # one character (several ids allowed: npm run sprites naruto sasuke)
npm run sprites vfx             # only the VFX atlas
npm run test:sprites            # packer regression test (never touches art/ or public/)
```

Options go after `--` with bash/cmd: `npm run sprites -- --dry-run naruto`.
**PowerShell eats the `--`** (npm's `npm.ps1` wrapper), so npm swallows the options. In PowerShell use
`npm.cmd run sprites -- --dry-run naruto`, or call Node directly (works everywhere):

```bash
node tools/pack-sprites.mjs --dry-run naruto
```

| option | meaning |
|---|---|
| `--dry-run` | analyse + print the report, write nothing (safe status check for Codex) |
| `--json` | print the report as JSON instead of text (for agents/scripts) |
| `--update-manifest` | raise `status` in `art/manifest.json`: packed anims/effects/UI become `packed`, raw files that could not be packed become `raw`. Never lowers a status (`approved` stays `approved`). Sync `art/TRACKER.md` afterwards. |
| `--quantize <n>` | snap each character to one shared `n`-color palette (median cut over all its frames), e.g. `--quantize 32`. Fixes noisy ChatGPT colors and keeps colors identical across animations. Off by default; a pack-time filter only (frames are not written back while quantizing, so `frames/` stays a faithful clean of the raw art). |
| `--tolerance <n>` | background color tolerance, RGB distance (default 72). Raise it if a pink halo remains, lower it if the character loses pink/purple pixels. |
| `--no-writeback` | do not write cleaned frames back to `art/.../frames/<anim>/` |
| `--strict` | exit code 2 when there are warnings (CI) |
| `--root <dir>` (`--src`, `--art`) | art folder to read (default `./art`). Used by tests. |
| `--out <dir>` | public folder to write (default `./public`). Used by tests, so they never overwrite real characters. |
| `--manifest <file>` | manifest to read (default `<root>/manifest.json`) |
| `--guide <file>` | animation guide module (default `src/art/animGuide.js`) |

Exit codes: `0` ok (also when nothing is packed yet), `1` bad arguments / unknown character / crash, `2` warnings with `--strict`.

### What it reads

```
art/
  manifest.json                      animations per character (frames, phases, bodyHeight, ms, required, status), vfx effects
  characters/<id>/                   one folder per character (folders starting with _ , e.g. _template, are skipped)
    raw/<anim>.png                   ChatGPT strip: poses left -> right on flat magenta #FF00FF
    raw/<anim>_NN.png                ...or one image per frame (NN = 00, 01, ...)
    raw/<anim>.json                  optional per-strip tweaks (see "Sidecar")
    raw/ui_*.png  raw/fx_*.png       skipped silently (ui_* = UI raws, cleaned into ui/; fx_* = effect art left here
                                     by mistake: it belongs in art/vfx/raw/_proposed/<charId>_<effect>.png)
    raw/<anim>_fixNN.png             skipped silently (fix-up attempts; rename the keeper to <anim>.png)
    raw/<subfolder>/                 never read (raw/_parts/ = halves of long strips, raw/_proposed/ = art the engine does not use yet)
    frames/<anim>/<anim>_NN.png      cleaned frames (written by the packer, editable by hand) - these WIN over raw/
    hitboxes.json                    optional hit/hurt box overrides
    ui/portrait.png ui/cutin.png ui/select.png
  vfx/raw/<effect>.png               effect strip on magenta (engine names are fixed: spark, burst, ring, ...)
  vfx/raw/_proposed/                 never read: character effects (<charId>_<effect>.png) waiting for an engine task
  vfx/frames/<effect>/<effect>_NN.png
```

Source order per animation: `frames/<anim>/*.png` -> `raw/<anim>.png` -> `raw/<anim>_NN.png`.
The animation list (names, frame counts, phases, loop, ms, bodyHeight, required) comes from `art/manifest.json`
(`characters.<id>.animations`, then `animationDefaults`), then `src/art/animGuide.js`, then the built-in
SPEC v1 table. File names are matched case-insensitively. Anything that does not match (for example
`ChatGPT Image Oct 8, 2026.png`, `.jpg`/`.webp` files, unknown animation names) is reported, never packed.
The skipped names above (`ui_*`, `fx_*`, `*_fixNN.png`, subfolders) are not reported.

### What it does (per animation)

1. **Background removal**: clusters the border colors (flat magenta, gradients, even a fake "transparency"
   checkerboard), flood-fills them from the edges, removes every remaining near-magenta pixel (holes between
   arm and body) and the anti-aliased magenta fringe on the outline. Alpha becomes hard (0 or 255).
   Already-transparent PNGs (even tightly cropped ones whose outline touches the edge) keep every opaque
   color. On a magenta strip, feet or hair cut by one image edge stay character; another color counts as
   background only if it spans the image (a ground band, a frame). A non-magenta background (white, black,
   ...) is removed with half the tolerance so a dark outline survives, and is warned: gaps enclosed by the
   body cannot be cleaned on it.
2. **Speck removal**: tiny detached blobs (noise) are dropped. After splitting, small blobs far from a pose
   (more than 10% of its height away) or below its soles are dropped too, so a stray mark cannot change the
   scale of the whole animation or the floor line. Smears and sweat drops next to the body are kept. In
   `frames/` only 1-2px strays are ignored.
3. **Split** a strip into poses: by empty columns, with these fixes: tiny detached bits (smears,
   sweat drops) are merged into the nearest pose; with too many pieces, small detached props are folded into
   the nearest pose (or dropped when far), then clearly-smaller gaps are merged, but never two bodies into one
   frame. With fewer poses than the manifest expects, touching poses are cut at the column valleys between two
   bodies; a single pose (one big image, a punch with a long arm) has no such valley and is never sliced
   (`found 1 pose ... not sliced` / `kept N wide pose(s) whole`). A 2-row grid is read row by row. A frame
   count different from the manifest is allowed (warned; also when a 1-frame animation has 2 poses), and attack
   `phases` are rescaled to the new count.
4. **Scale**: the whole strip by one factor so its tallest trimmed pose equals `bodyHeight` (spec table, or
   `manifest bodyHeight`; values that cannot fit above the floor line, i.e. over 181px, are clamped and warned).
   Downscaling uses palette-preserving "mode" sampling (each output pixel takes the
   most common source color of its block; no blur, no new colors). Upscaling is nearest-neighbour and warned.
   Already-clean `frames/` within ~4% of `bodyHeight` are not resampled (no quality loss on re-runs).
5. **Align** each frame in a 192x192 cell: mean x of the opaque pixels in the bottom 20% of rows (the feet)
   on x=96, lowest opaque pixel on y=180 (pivot `[96,180]`). Overflow is clipped and warned.
6. **Boxes** (frame-local px, facing right):
   - `hurt` on every frame: opaque bbox inset 18% left/right and 4% from the top.
   - `hit` only on the active frames (`phases[1]`) of attacks (not `throw`: projectile). Rule: the limb that
     reaches past the idle pose (pixels beyond idle maxX - 6). The limb is isolated by walking back from the tip
     until columns get torso-thick, keeping the blob that holds the forward-most pixel plus smears touching it
     (a guard fist next to a kick is not included). Uppercuts that rise above the idle head use the same idea
     upward. If nothing sticks out: the forward-most 28% of the body. Boxes larger than 40% of the body are warned.
   - `hitboxes.json` overrides are applied last.
7. **Palette** is counted per character; more than 48 colors is warned (use `--quantize 32`).

### What it writes

`public/characters/<id>/sheet.png` (16 columns of 192x192 cells, animations in manifest order) and
`public/characters/<id>/anims.json`:

```json
{
 "frameWidth": 192, "frameHeight": 192, "columns": 16, "pivot": [96, 180], "pixelsPerUnit": 86, "facing": "right",
 "source": "art-pack", "character": "naruto", "packer": 1,
 "complete": false,
 "missingCore": ["special", "win"],
 "animations": {
  "idle":   { "frames": [0,1,2,3,4,5,6,7], "durations": [150,150,150,150,150,150,150,150], "loop": true },
  "light1": { "frames": [8,9,10,11,12,13,14], "durations": [30,30,40,50,50,50,30], "loop": false, "phases": [2,2,3] }
 },
 "boxes": {
  "0":  { "hurt": [[84,46,26,135]] },
  "10": { "hurt": [[88,46,40,135]], "hit": [[118,88,34,16]] }
 }
}
```

- `complete` is `true` only when every core animation exists (`idle run dash jumpUp jumpFall land light1 light2
  light3 light4 heavy airLight1 airHeavy guard hurtHigh launched down getup special beamCharge beamFire charge win`,
  plus anything the manifest lists in `coreAnimations` or marks `required: true`). The game only switches to a custom
  sheet when `complete` is true (partial sheets can be previewed with `?art=custom`).
- **A character with zero frames never gets an `anims.json`/`sheet.png`**, and an existing one is left untouched.
- UI images: magenta background removed, then fitted to the spec size (portrait 96x96 and select 384x384
  bottom-centered, cut-in 480x128 center-cropped) and written next to the sheet (`portrait.png`, `cutin.png`, `select.png`).
  An image that is empty after background removal is warned and not written (the game keeps its fallback).
- VFX: `public/vfx/atlas.png` + `atlas.json` = `{ "cell":128, "cols":<max frames>, "rows":<packed effects>, "ppu":56,
  "anims": { "<name>": { "row", "n", "ms" } } }`, only for effects that have art (the rest stay procedural).
  Each strip is scaled with one factor so its largest frame = `fill` x 128 px (`VFX_EFFECTS` in the packer: the
  same world size as the procedural effect), so only the relative sizes between frames come from the art.
  Frames keep their position inside the strip row: the row's common center line lands on y=64 (center effects)
  or the row's lowest pixel on y=120 (bottom effects `dust`, `flame`, `streak`), so a frame drawn higher (a rising
  puff, a lifting streak) stays higher. Horizontally a strip frame is centered on its split slot (its own
  columns, or an equal slot with the sidecar `{ "split": "even" }`); `flame` is centered on its base so the tip
  keeps its lean. Single files `raw/<effect>_NN.png` of one canvas size are aligned on the union of all frames.
  Tinted effects drawn in color are converted to greyscale (warned). `glow` is drawn as opaque grey rings and
  converted luma -> alpha (white, alpha 110/200/255). `frames/<effect>/*.png` that are already 128x128 are used
  exactly as drawn (alpha kept).

### Write-back and the `.packer.json` marker

When an animation comes from `raw/`, the cleaned 192x192 cells are written to `frames/<anim>/<anim>_NN.png`
together with `frames/<anim>/.packer.json` (source file hashes, bodyHeight, hash of every frame written).
Touch those PNGs up by hand if needed; the next run reads them instead of raw. Rules:

- new `raw/<anim>.png` (or changed sidecar/bodyHeight) **and** frames untouched -> frames are regenerated from raw;
- new raw **but** someone edited the frames -> the edited frames win, with a warning
  (delete `frames/<anim>/` to re-import from raw);
- frames without a marker are treated as hand-made and are never overwritten.

Re-running the packer on unchanged input produces byte-identical output (safe to commit).

### Sidecar `raw/<anim>.json` (optional)

```json
{ "frames": 6, "split": "even", "bodyHeight": 140, "tolerance": 90, "drop": [3] }
```

`frames`: how many poses the strip really has. `split: "even"`: cut the strip into equal slices (snapped to the
emptiest column) instead of by gaps. `bodyHeight`: override for this strip. `tolerance`: background tolerance.
`drop`: indices of bad poses to discard (after splitting; out-of-range indices are warned and ignored).

### `hitboxes.json` (optional, per character)

```json
{
  "_comment": "frame-local px in the final 192 cell; frame numbers are 0-based within the animation",
  "light3": { "2": { "hit": [[120, 120, 40, 18]] }, "3": { "hit": [[118, 118, 42, 20]] } },
  "guard":  { "*": { "hurt": [[78, 50, 36, 130]] } },
  "heavy":  { "5": { "hit": [] } }
}
```

`"*"` applies to every frame of the animation (specific frame numbers still win). An empty `hit` list means **this frame cannot hit** (it is written to `anims.json` as `"hit": []`).
A frame with no `hit` key at all falls back to the move's `reach` in `src/game/moves.js`. An empty `hurt` list removes the override, so the frame uses the default body box.
Keys starting with `_` are ignored. Out-of-range frames and malformed boxes are warned, not fatal.

### Reading the report

```
== naruto ======================================
  packed 12 anims, 70 frames -> sheet 3072x960, 31 colors, PARTIAL (complete=false; preview with ?art=custom)
    idle         8     frames/idle/             x1
    light1       6/7   raw/light1.png           x0.308  (split 1 touching pose group(s))
  missing core (11): ...
  ! light1: 6 frame(s), manifest expects 7 (phases rescaled to 2/2/2)
```

`6/7` = packed / expected frames. `x0.308` = scale applied to the raw art (1/x = raw pixels per game pixel).
Common warnings and the fix:

| warning | fix |
|---|---|
| `unrecognized name` | rename to `<anim>.png` or `<anim>_NN.png`; art the engine does not read yet goes in `raw/_proposed/` |
| `not a PNG` / `not a PNG file` / `corrupt PNG` / `empty file` | re-save (or re-download) as PNG |
| `N frame(s), manifest expects M` | regenerate, or add `raw/<anim>.json` with `frames`/`split`/`drop` |
| `clipped by the 192px cell` | pose too wide or tall for its bodyHeight: redraw tighter, or lower bodyHeight |
| `art is smaller than the target` | generate the strip bigger (fewer poses per image) |
| `has no removable background` | regenerate on flat magenta #FF00FF |
| `background #rrggbb is not magenta` | usable, but holes between limbs stay filled: regenerate on flat magenta #FF00FF |
| `found 1 pose, expected N - not sliced` | poses touch too much (or only one was drawn): regenerate with gaps, or add `raw/<anim>.json` `{ "split": "even" }` |
| `dropped N stray mark(s)` (note) | a speck far from a pose was removed; check the frame if something real was lost |
| `bodyHeight N does not fit` | fix `bodyHeight` in the manifest or sidecar (max 181) |
| `palette has N colors` | clean the art, or pack with `--quantize 32` |
| `large auto hitbox` / `no clear strike limb` | check the frame; add a `hitboxes.json` override |
| `raw changed but frames/ has manual edits` | keep the edits, or delete `frames/<anim>/` to re-import |
| `manifest spec.X is ...` | manifest and packer disagree on SPEC v1; fix the manifest or update both (ADR) |

### Changing the spec / extending

- **New character**: copy `art/characters/_template/` to `art/characters/<id>/`, add it to `art/manifest.json`. No packer change.
- **New animation name**: add it to `art/manifest.json` (and `src/art/animGuide.js` so the engine and Sprite Lab know it). The packer picks it up from the manifest; set `bodyHeight`, `frames`, `phases`, `ms`.
- **New VFX effect**: needs engine support first (effect names are fixed in code); then add it to `manifest.vfx.effects`.
- **Changing SPEC v1** (cell size, pivot, pixelsPerUnit): change `SPEC`/`BODY_HEIGHT` at the top of `pack-sprites.mjs`, bump `PACKER_VERSION`, update `art/SPEC.md` + manifest, record an ADR, and re-pack every character (delete `frames/*/` folders that have a `.packer.json` so they re-import from raw at the new size).
- After any packer change: `npm run test:sprites` must stay green.
