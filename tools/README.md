# tools/

| file | what |
|---|---|
| `pack-sprites.mjs` | **Sprite packer**: turns generated art in `art/` into what the game loads from `public/` (sheets, `anims.json` with hit/hurt boxes, VFX atlas, UI images). |
| `test-pack-sprites.mjs` | Regression test for the packer. Generates fake ChatGPT-style strips in `tools/.test-fixtures/` (git-ignored), packs them, checks ~150 things (incl. adversarial art: specks, black/transparent backgrounds, edge-cropped feet, one huge pose, extra/missing poses; versioned `_vNN` candidates, rejected versions, the spec read from the manifest, the 64/65-color warning line), deletes the folder. |
| `test-music.mjs` | Test for the generative music composer (`src/core/musicPlan.js`, [ADR 0019](../docs/decisions/0019-generative-lofi-music.md)): same seed same song, varied 8-bar windows across 20 seeds, melody / pad ranges and scales, pad voice-leading leaps, no intro drums, heat gates. `npm run test:music` (`-- --print` prints a song). No dependencies. |
| `queue.mjs` | Claim queue for parallel art production (world art batches): see its header comment and [ADR 0008](../docs/decisions/0008-world-art-and-parallel-production.md). Not part of the sprite packer. |

All are plain Node ESM (Node 18+). The only dependency is `pngjs` (devDependency).

---

## Sprite packer

The numbers it packs to (cell size, pivot, pixels per unit, color limits) come from the `spec` block of
`art/manifest.json`. Today that is **hi-res sprite spec v2**: 256x256 cells, ~6.5-head Shippuden
proportions, pivot `[128, 240]`, ppu 128. Where the numbers come from:
[docs/decisions/0007-art-spec-v2-shippuden-256.md](../docs/decisions/0007-art-spec-v2-shippuden-256.md).

### Run it

```bash
npm run sprites                 # every character in art/characters/ + every world-art kind (vfx, crowd, stage, npc, ui)
npm run sprites naruto          # one character (several ids allowed: npm run sprites naruto sasuke)
npm run sprites vfx             # only the VFX atlas (approved effects only)
npm run sprites crowd           # only the crowd atlas (approved spectators only)
npm run sprites stage npc ui    # approved stage slots, NPC sheets and shared UI images
node tools/pack-sprites.mjs vfx crowd stage npc ui --candidates   # every candidate -> public/preview/ (local, ?art=custom)
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
| `--update-manifest` | raise `status` in `art/manifest.json`: packed anims/effects/UI become `packed`, raw files that could not be packed become `raw`. Never lowers a status (`approved` stays `approved`). Also raises each asset's `version` to the highest `raw/<anim>_vNN.png` found (never lowered; `approvedVersion` is never touched). Sync `art/TRACKER.md` afterwards. |
| `--quantize <n>` | snap each character to one shared `n`-color palette (median cut over all its frames), e.g. `--quantize 48`. Fixes noisy colors and keeps colors identical across animations. Off by default; a pack-time filter only (frames are not written back while quantizing, so `frames/` stays a faithful clean of the raw art). |
| `--tolerance <n>` | background color tolerance, RGB distance (default 72). Raise it if a pink halo remains, lower it if the character loses pink/purple pixels. |
| `--no-writeback` | do not write cleaned frames back to `art/.../frames/<anim>/` |
| `--strict` | exit code 2 when there are warnings (CI) |
| `--candidates` | world art (VFX, crowd, stage, NPC, UI) is **approval-gated**: by default only items with an `approvedVersion` in the manifest are packed, at that version (a newer candidate is noted in the report and waits), outputs whose approval is gone are removed, and an unreadable manifest leaves every world-art output untouched. `--candidates` packs every latest candidate into `<out>/preview/<kind>/` instead (an item without a candidate previews its approved image), leaving the shipped outputs alone. `public/preview/` is git-ignored; the game shows it with `?art=custom`. Characters are not affected. |
| `--root <dir>` (`--src`, `--art`) | art folder to read (default `./art`). Used by tests. |
| `--out <dir>` | public folder to write (default `./public`). Used by tests, so they never overwrite real characters. |
| `--manifest <file>` | manifest to read (default `<root>/manifest.json`) |
| `--guide <file>` | animation guide module (default `src/art/animGuide.js`) |

Exit codes: `0` ok (also when nothing is packed yet), `1` bad arguments / unknown character / crash, `2` warnings with `--strict`.

### The spec comes from the manifest

The packer reads these keys from `art/manifest.json` `"spec"`. A missing key takes the spec v2 default
without a word; a malformed one (wrong type, out of range, a pivot outside the cell) is warned
(`manifest spec.<key> is ...`) and takes the default. The manifest is the authority: a different but valid
value is followed, not reported as a mismatch.

| key | v2 default | used for |
|---|---|---|
| `name` | `"hi-res sprite spec v2"` | report header, `"spec"` in `anims.json` |
| `frameWidth`, `frameHeight` | 256, 256 | cell size |
| `columns` | 16 | sheet columns (sheet width = 16 x 256 = 4096 px) |
| `pivot` | `[128, 240]` | feet center x, floor line y |
| `pixelsPerUnit` | 128 | written to `anims.json` (the engine's world size; ppu >= 70 also selects the HD render mode) |
| `facing` | `"right"` | written to `anims.json` |
| `maxColors` | 48 | palette target per character (note above it, `--quantize` suggestion) |
| `warnColors` | 64 | palette warning above this |
| `cellMargin` | 4 | safe margin: every opaque pixel inside x 4..251, y >= 4 (warned otherwise); also lowers the largest allowed `bodyHeight` |
| `standingBodyPx` | 200 | scales the pixel thresholds of the hitbox heuristics (tuned at 136 px in spec v1) |
| `versionSuffix` | `"_vNN"` | informational; any other value is warned (the file scan only understands `_vNN`) |
| `adr`, `rawBackground` | | informational, not used (the background removal always targets magenta) |

The VFX cell (`vfx.cell` 128, `vfx.ppu` 56, `vfx.baseline` 120) is still a packer constant; the manifest
restates it and a different value is warned.

### What it reads

```
art/
  manifest.json                      spec block; animations per character (frames, phases, bodyHeight, ms, required,
                                     status, version, approvedVersion); vfx effects
  characters/<id>/                   one folder per character (folders starting with _ , e.g. _template, are skipped)
    raw/<anim>_vNN.png               versioned strip candidate (v01, v02, ...): poses left -> right on flat magenta
                                     #FF00FF. The HIGHEST version is packed.
    raw/<anim>_vNN.json              optional sidecar for that version only (merged over raw/<anim>.json)
    raw/<anim>.png                   unversioned strip: used only when no raw/<anim>_vNN.png exists
    raw/<anim>_NN.png                ...or one image per frame (NN = 00, 01, ..., no "v"): used only when neither exists
    raw/<anim>.json                  optional per-animation tweaks (see "Sidecar"), applies to every version
    raw/ui_*.png  raw/fx_*.png       skipped silently (ui_* = UI candidates such as ui_portrait_v02.png, cleaned into
                                     ui/; fx_* = effect art left here by mistake: it belongs in
                                     art/vfx/raw/_proposed/<charId>_<effect>_vNN.png)
    raw/<anim>_NN_fixMM.png          skipped silently (fix-up attempts: NN = frame, MM = attempt; any name ending in
                                     _fix<digits>.png is skipped; the patched strip becomes the next _vNN)
    raw/<subfolder>/                 never read: raw/_rejected/ (rejected versions), raw/_parts/ (halves of long strips,
                                     <anim>_vNN_A.png / _B.png), raw/_old/, raw/_proposed/ (art the engine does not use yet)
    frames/<anim>/<anim>_NN.png      cleaned frames (written by the packer, editable by hand) - see "Write-back"
    hitboxes.json                    optional hit/hurt box overrides
    ui/portrait.png ui/cutin.png ui/select.png
    reference/                       never read by the packer (model sheets, expressions, idle_approved.png)
  vfx/raw/<effect>_vNN.png           versioned effect strip on magenta (engine names are fixed: spark, burst, ring, ...);
                                     highest version packed, plain vfx/raw/<effect>.png only when none exists
  vfx/raw/_rejected/ _proposed/ ...  never read (_proposed/ = character effects waiting for an engine task)
  vfx/frames/<effect>/<effect>_NN.png
```

**Source order per animation** (and per effect):

1. `frames/<anim>/*.png` when they are hand-made (no marker) or hand-edited, or when they are the untouched
   packer output of the current raw source (see "Write-back");
2. else the **highest** `raw/<anim>_vNN.png` (numeric: `v10` beats `v09`);
3. else `raw/<anim>.png`;
4. else the `raw/<anim>_NN.png` single frames.

Lower versions are history and are skipped silently. A plain `raw/<anim>.png` or singles next to a versioned
file are skipped with a note. Rejected versions belong in `raw/_rejected/`, so the highest file left in `raw/`
is always the current candidate. The packer always packs the highest version, approved or not; when the
manifest's `approvedVersion` differs, the report notes `candidate v03 (approved: v02)`.

The animation list (names, frame counts, phases, loop, ms, bodyHeight, required, approvedVersion) comes from
`art/manifest.json` (`characters.<id>.animations`, then `animationDefaults`), then `src/art/animGuide.js`, then
the packer's built-in tables. File names are matched case-insensitively (a case mismatch is warned with the
right name). Anything that does not match (for example `ChatGPT Image Oct 8, 2026.png`, `.jpg`/`.webp` files,
unknown animation names with or without `_vNN`) is reported, never packed. Also warned: a one-digit version
(`idle_v3.png` is used, but rename it to `idle_v03.png`), the same version number twice, and a strip part
(`idle_v03_A.png`) left in `raw/` instead of `raw/_parts/`.

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
4. **Scale**: the whole strip by one factor so its tallest trimmed pose equals `bodyHeight` (the ADR 0007
   table, or `manifest bodyHeight`, or the sidecar). The largest allowed value is `pivot y + 1 - cellMargin`
   (237 px in spec v2); a value that does not fit is clamped and warned, only for animations that have art.
   Downscaling uses palette-preserving "mode" sampling (each output pixel takes the most common source color
   of its block; no blur, no new colors). Upscaling is nearest-neighbour and warned. Already-clean `frames/`
   within ~4% of `bodyHeight` are not resampled (no quality loss on re-runs).
5. **Align** each frame in a 256x256 cell: mean x of the opaque pixels in the bottom 20% of rows (the feet)
   on x=128, lowest opaque pixel on y=240 (pivot `[128,240]`). Pixels outside the cell are clipped and warned;
   pixels inside the 4 px cell margin (x < 4, x > 251 or y < 4) are warned.
6. **Boxes** (frame-local px, facing right):
   - `hurt` on every frame: opaque bbox inset 18% left/right and 4% from the top.
   - `hit` only on the active frames (`phases[1]`) of attacks (not `throw`: projectile). Rule: the limb that
     reaches past the idle pose (pixels beyond idle maxX - 6 px at spec v1 scale, 9 px at v2). The limb is
     isolated by walking back from the tip until columns get torso-thick, keeping the blob that holds the
     forward-most pixel plus smears touching it (a guard fist next to a kick is not included). Uppercuts that
     rise above the idle head use the same idea upward. If nothing sticks out: the forward-most 28% of the body.
     Boxes larger than 40% of the body are warned. Every pixel threshold of these rules (tip band, minimum limb
     length and blob size, box padding) was tuned on spec v1 art and is scaled by `standingBodyPx / 136`
     (x1.47 in spec v2), so the boxes behave the same on bigger sprites.
   - `hitboxes.json` overrides are applied last.
7. **Palette** is counted per character: above `maxColors` (48) is a note, above `warnColors` (64) a warning
   (use `--quantize 48`).

### What it writes

`public/characters/<id>/sheet.png` (16 columns of 256x256 cells, animations in manifest order; a full
175-frame character (42 animations) is 4096 x 2816) and `public/characters/<id>/anims.json`:

```json
{
 "frameWidth": 256, "frameHeight": 256, "columns": 16, "pivot": [128, 240], "pixelsPerUnit": 128, "facing": "right",
 "spec": "hi-res sprite spec v2", "source": "art-pack", "character": "naruto", "packer": 2,
 "complete": false,
 "missingCore": ["special", "win"],
 "animations": {
  "idle":   { "frames": [0,1,2,3,4,5,6,7], "durations": [150,150,150,150,150,150,150,150], "loop": true },
  "light1": { "frames": [8,9,10,11,12,13,14], "durations": [30,30,40,50,50,50,30], "loop": false, "phases": [2,2,3] }
 },
 "boxes": {
  "0":  { "hurt": [[110,45,36,196]] },
  "10": { "hurt": [[115,45,60,196]], "hit": [[204,62,26,26]] }
 }
}
```

- `complete` is `true` only when every core animation exists (`idle run dash jumpUp jumpFall land light1 light2
  light3 light4 heavy airLight1 airHeavy guard hurtHigh launched down getup special beamCharge beamFire charge win`,
  plus anything the manifest lists in `coreAnimations` or marks `required: true`). The game only switches to a custom
  sheet when `complete` is true (partial sheets can be previewed with `?art=custom`).
- **A character with zero frames never gets an `anims.json`/`sheet.png`**. An existing one that the packer made
  (`"source": "art-pack"`, e.g. after the only version of the only strip moved to `raw/_rejected/`) is removed, so
  the rejected art stops shipping and the game falls back to the placeholder (`--dry-run` only reports it). An
  existing sheet the packer did not make (Sprite Lab download) is left untouched.
- UI images: magenta background removed, then fitted to the spec size (portrait 96x96 and select 384x384
  bottom-centered, cut-in 480x128 center-cropped) and written next to the sheet (`portrait.png`, `cutin.png`, `select.png`).
  An image that is empty after background removal is warned and not written (the game keeps its fallback).
  The packer reads only `ui/<name>.png`; the reviewed candidate `raw/ui_<name>_vNN.png` is fitted and saved there by hand.
- VFX: `public/vfx/atlas.png` + `atlas.json` = `{ "cell":128, "cols":<max frames>, "rows":<packed effects>, "ppu":56,
  "anims": { "<name>": { "row", "n", "ms" } } }`, only for **approved** effects that have art (the rest stay procedural;
  `--candidates` writes every effect to `public/preview/vfx/`).
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

When an animation comes from `raw/`, the cleaned 256x256 cells are written to `frames/<anim>/<anim>_NN.png`
together with `frames/<anim>/.packer.json`:

```json
{ "sourceFile": "raw/idle_v03.png", "version": 3, "source": ["characters/naruto/raw/idle_v03.png", "characters/naruto/raw/idle.json"],
  "sourceHash": "...", "bodyHeight": 204, "cell": { "frameWidth": 256, "frameHeight": 256, "pivot": [128, 240] }, "files": { "idle_00.png": "<sha1>" } }
```

The hash covers the file names and bytes of the raw image and its sidecars. Touch the PNGs up by hand if
needed; the next run reads them instead of raw. Rules:

- the chosen raw source changed (**a newer `_vNN`**, an edited raw or sidecar, the newest version moved to
  `_rejected/` so an older one is chosen again) or `bodyHeight` or the spec cell changed, **and** the frames
  are untouched -> frames are regenerated from the new source (note: `re-imported: replaces frames/ cleaned
  from raw/idle_v02.png`);
- the source changed **but** someone edited the frames -> the edited frames win, with a warning naming both
  files (delete `frames/<anim>/` to re-import from raw);
- untouched frames whose raw source is gone (its only version was moved to `raw/_rejected/`) are **not packed**
  (warned), so rejected art never reaches the game; hand-edited ones still are;
- frames without a marker are treated as hand-made and are never overwritten.

Re-running the packer on unchanged input produces byte-identical output (safe to commit).

### Sidecar `raw/<anim>.json` / `raw/<anim>_vNN.json` (optional)

```json
{ "frames": 6, "split": "even", "bodyHeight": 140, "tolerance": 90, "drop": [3] }
```

`frames`: how many poses the strip really has. `split: "even"`: cut the strip into equal slices (snapped to the
emptiest column) instead of by gaps. `bodyHeight`: override for this animation. `tolerance`: background
tolerance. `drop`: indices of bad poses to discard (after splitting; out-of-range indices are warned and ignored).

`raw/<anim>.json` applies to every source of the animation. `raw/<anim>_vNN.json` applies only while that
version is the one packed, and its keys win over `raw/<anim>.json`. Put image-specific keys (`frames`, `split`,
`drop`) in the versioned sidecar, so they do not carry over to the next candidate.

- Crowd (ADR 0008): `public/crowd/atlas.png` + `atlas.json` = `{ "cell": [64, 96], "cols": 64, "ppu": 50, "pivot": [32, 94],
  "frames": ["idle", "cheer", "shocked"], "source": "approved", "spectators": [{ "id", "cell", "heightClass", "kind", "tags",
  "version" }] }`. Input: every roster spectator (`art/crowd/roster/*.json`, roster order) whose highest
  `approvedVersion` in `worldArt.crowd.batches.*.items` has a raw `art/crowd/raw/<id>_vNN.png`. Per raw: magenta
  removed (fringe included), specks dropped, the 3 poses split (even thirds when the split disagrees), each trimmed;
  one scale per spectator so idle = its height class (`tiny` 44, `short` 58, `medium` 70, `tall` 78, `huge` 84 px),
  shrunk for the whole spectator only if a pose would rise above y 2 or exceed 64 px; each pose stands on y 94,
  centered on its feet; <= 24 colors per spectator (median cut), binary alpha. 21 spectators per row (`cell` = the
  idle cell index). Not written yet: `art/crowd/frames/` write-back and per-batch contact sheets (TOOL-021).

- Stage (`art/stage/ASSETS.md`): `public/stage/<slot>.png` + `manifest.json` = `{ "source", "packer", "slots": { "<slot>":
  { "file", "size": [w, h], "kind": "texture"|"cutout"|"sprite", "version" } } }` for the 30 slots in `STAGE_SLOTS`. Source per
  approved slot: `final/<slot>.png`, else `review/<slot>_palette_vNN.png`, else `raw/_fit/<slot>_vNN.png` at the approved
  version. The size must be exact (else warned, not shipped); textures are made opaque, cutouts/sprites keyed to alpha 0/255.
- NPCs (`art/npc/README.md`): `public/npc/<id>/sheet.png` (8 columns of 128 px cells) + `anims.json` (`frameWidth` 128,
  `pivot` [64, 124], `pixelsPerUnit` 80, `facing` "viewer-right", `animations: { name: { frames, durations, loop, version } }`).
  The animation table of `art/npc/<id>/ANIMATIONS.md` gives the names, loop flags, frame times and target heights; each strip
  (2 poses on magenta) is scaled to its own height row, feet on y 124, inside the 4 px margin, <= 32 colors per NPC. An NPC
  without an approved `idle` is not packed (and its old output is removed).
- Shared UI (`art/ui/README.md`): `public/ui/logo.png` (at most 640 x 240, alpha 0/255), `public/ui/title_art.png` (exactly
  640 x 360, opaque) + `manifest.json` (`assets: { name: { file, size, version } }`). Approval: `sharedUi.<logo|titleArt>` or the
  `worldArt.ui` batches; source `final/<asset>.png`, else `review/<asset>_palette_vNN.png` / `_fit_vNN.png`.

### `hitboxes.json` (optional, per character)

```json
{
  "_comment": "frame-local px in the final 256 cell; frame numbers are 0-based within the animation",
  "light3": { "2": { "hit": [[222, 122, 24, 26]] }, "3": { "hit": [[222, 124, 24, 24]] } },
  "guard":  { "*": { "hurt": [[104, 51, 48, 190]] } },
  "heavy":  { "5": { "hit": [] } }
}
```

`"*"` applies to every frame of the animation (specific frame numbers still win). An empty `hit` list means **this frame cannot hit** (it is written to `anims.json` as `"hit": []`).
A frame with no `hit` key at all falls back to the move's `reach` in `src/game/moves.js`. An empty `hurt` list removes the override, so the frame uses the default body box.
`"hand": [x, y]` marks the drawn palm or fingertip (256-cell px, rounded) for hand effects, projectile spawns and beam
origins (`null` removes it); frames without one use their hit box, then the nearest frame of the animation (art/SPEC.md
"Effect anchor points").
Keys starting with `_` are ignored. Out-of-range frames and malformed boxes are warned, not fatal.
Contact zones per attack (where a hit box should sit) are in `art/SPEC.md`.

### Reading the report

```
GCD Tourney sprite packer v2
  spec: hi-res sprite spec v2 (256x256 cells, pivot [128,240], ppu 128, <= 48 colors)

== naruto ======================================
  packed 12 anims, 70 frames -> sheet 4096x1280, 47 colors, PARTIAL (complete=false; preview with ?art=custom)
    idle         8     <- raw/idle_v03.png             x0.412  (candidate v03 (approved: v02))
    run          8     <- frames/run/ (raw/run_v02.png) x1
    light1       6/7   <- raw/light1_v01.png           x0.308  (split 1 touching pose group(s))
    light3       7     <- frames/light3/ (hand-edited, from raw/light3_v01.png) x1
  missing core (11): ...
  ! light1: 6 frame(s), manifest expects 7 (phases rescaled to 2/2/2)
```

`<-` names the file each animation came from: a raw file (this run cleaned it), or `frames/<anim>/` with the
raw file those frames were cleaned from, `hand-edited`, or `hand-made`. With `--json`, each packed entry has
`source` (what was read), `from` (the raw file behind it), `version` (its `_vNN` number or `null`), `edited`
and `handMade`; each character has `versions` (highest raw version per animation) and the report has the
resolved `spec`. `6/7` = packed / expected frames. `x0.308` = scale applied to the raw art (1/x = raw pixels
per game pixel).

Common warnings and the fix:

| warning | fix |
|---|---|
| `unrecognized name` | rename to `<anim>_vNN.png` (or `<anim>.png` / `<anim>_NN.png`); art the engine does not read yet goes in `raw/_proposed/` |
| `use a two-digit version` / `rename to ... (case)` | rename as shown (the file is still used) |
| `version N already exists as ...` | versions are never reused: give the file the next free number |
| `strip part - move it to raw/_parts/` | move it; save the joined strip as `raw/<anim>_vNN.png` |
| `not a PNG` / `not a PNG file` / `corrupt PNG` / `empty file` | re-save (or re-download) as PNG |
| `N frame(s), manifest expects M` | regenerate, or add `raw/<anim>_vNN.json` with `frames`/`split`/`drop` |
| `clipped by the 256x256 cell` | pose too wide or tall for its bodyHeight: redraw tighter, or lower bodyHeight |
| `reach into the 4px cell margin` | same, smaller: the pose touches the cell edge; lower bodyHeight a little or redraw narrower |
| `art is smaller than the target` | generate the strip bigger (fewer poses per image) |
| `has no removable background` | regenerate on flat magenta #FF00FF |
| `background #rrggbb is not magenta` | usable, but holes between limbs stay filled: regenerate on flat magenta #FF00FF |
| `found 1 pose, expected N - not sliced` | poses touch too much (or only one was drawn): regenerate with gaps, or add `raw/<anim>_vNN.json` `{ "split": "even" }` |
| `dropped N stray mark(s)` (note) | a speck far from a pose was removed; check the frame if something real was lost |
| `bodyHeight N does not fit` | fix `bodyHeight` in the manifest or sidecar (max 237 in spec v2) |
| `palette has N colors (> 64 ...)` | clean the art, or pack with `--quantize 48` |
| `large auto hitbox` / `no clear strike limb` | check the frame; add a `hitboxes.json` override |
| `... changed but frames/<anim>/ has manual edits` | keep the edits, or delete `frames/<anim>/` to re-import the new source |
| `frames/<anim>/ were cleaned from ..., which is no longer in raw/` | the only version was rejected: delete `frames/<anim>/` (or add a new `_vNN`) |
| `manifest spec.X is ... - must be ...` | the manifest's spec block has a malformed value; fix it (the v2 default is used meanwhile) |

### Changing the spec / extending

- **New character**: copy `art/characters/_template/` to `art/characters/<id>/`, add it to `art/manifest.json`. No packer change.
- **New animation name**: add it to `art/manifest.json` (and `src/art/animGuide.js` so the engine and Sprite Lab know it). The packer picks it up from the manifest; set `bodyHeight`, `frames`, `phases`, `ms`.
- **New VFX effect**: needs engine support first (effect names are fixed in code); then add it to `manifest.vfx.effects`.
- **Changing the spec** (cell size, pivot, pixelsPerUnit, color limits): record an ADR, change the `spec` block (and the
  body heights) in `art/manifest.json`, update `art/SPEC.md`, and re-run the packer. Packer-written `frames/` folders
  re-import automatically (their marker records the cell); hand-edited ones keep winning, so redo or delete them.
  Change `SPEC_DEFAULTS` / `BODY_HEIGHT` at the top of `pack-sprites.mjs` (and bump `PACKER_VERSION`) only so the
  defaults match the new spec for a manifest that leaves keys out.
- After any packer change: `npm run test:sprites` must stay green.
