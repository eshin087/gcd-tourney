# tools/

| file | what |
|---|---|
| `pack-sprites.mjs` | **Sprite packer**: turns generated art in `art/` into what the game loads from `public/` (sheets, `anims.json` with hit/hurt boxes, VFX atlas, UI images). |
| `test-pack-sprites.mjs` | Regression test for the packer (then the decal tests, `test-pack-decals.mjs`). Generates fake ChatGPT-style strips in `tools/.test-fixtures/` (git-ignored), packs them, checks ~150 things (incl. adversarial art: specks, black/transparent backgrounds, edge-cropped feet, one huge pose, extra/missing poses; versioned `_vNN` candidates, rejected versions, the spec read from the manifest, the 64/65-color warning line), deletes the folder. |
| `scale-probe.mjs` | The **scale probe** (TOOL-025, ADR 0021): measures each packed frame's head silhouette (hair included) and feet against the fighter's idle. A module (no CLI) shared by the packer's scale gate, `scale-audit.mjs`, `stitch-parts.mjs` and `lineup.mjs`. See "Scale gate" below. |
| `scale-audit.mjs` | `npm run scale`: the scale gate's numbers for the shipped sheets, the heads contact sheets `art/scale/heads-<id>.png`, `art/scale/scale-report.json`, `scale-baseline.json`, and with `--guide` each fighter's `reference/head_scale_guide.png`. |
| `stitch-parts.mjs` | `npm run stitch`: joins a strip generated in two parts (`raw/_parts/<anim>_vNN_A.png` + `_B.png`) with a **measured** size factor (TOOL-008). |
| `lineup.mjs` | `npm run lineup`: the cast side by side on one floor line with build numbers and each fighter's head scale per animation (art/CHARACTER_SCALE.md "Lineup review"). |
| `pack-decals.mjs` | The packer's **ground-decal** kind (`npm run sprites decals`, ADR 0024): `DECAL_SPECS` (the engine's decal contract), raw parts, hot key, pages. Called by `pack-sprites.mjs`, which passes its image helpers in. |
| `test-pack-decals.mjs` | Decal regression test (run by `test-pack-sprites.mjs`, or alone): fixtures in `tools/.test-fixtures/decals/`. |
| `lint-anims.mjs` | `npm run lint:anims` (first step of `prebuild`, TOOL-004): the animation contract as a build check: `animGuide.js` ↔ manifest `animationDefaults` and per-fighter entries ↔ `FALLBACK` (sprites.js) ↔ the placeholder rig anims ↔ `altOf` frames/phases ↔ `strike: 'back'` / the move's `back: true` (moves.js) ↔ `art/SPEC.md`. Errors fail the build; warnings (optional strips a fighter lacks, SPEC wording) do not unless `--strict`. Skips the manifest/SPEC checks when `art/` is absent (deploy export). |
| `check-undeclared.mjs` | `npm run lint:undeclared` (second step of `prebuild`, TOOL-027): finds identifiers used in `src/**/*.js` that are never declared, imported or a known global (the ENG-062 `MODE_ORDER` bug). Parser-free lexer + brace-scope pass; permissive where it cannot tell, so it never flags working code. |
| `test-lints.mjs` | `npm run test:lints`: regression test for both lints (planted `MODE_ORDER` bug, a valid-syntax sample, one doctored case per animation rule, CLI exit codes). Fixtures in `tools/.test-fixtures/lints/` (git-ignored, deleted after the run). |
| `test-music.mjs` | Test for the generative music composer (`src/core/musicPlan.js`, [ADR 0019](../docs/decisions/0019-generative-lofi-music.md)): same seed same song, varied 8-bar windows across 20 seeds, melody / pad ranges and scales, pad voice-leading leaps, no intro drums, heat gates. `npm run test:music` (`-- --print` prints a song). No dependencies. |
| `relay.mjs` | `npm run relay`: the Claude-Codex relay ([ADR 0033](../docs/decisions/0033-claude-codex-relay.md)): `send` queues the inbox prompt into a lane's Codex chat (`codex queue`), `ring` is Codex's doorbell, `wait` is Claude's background watcher; state in git-ignored `.relay/`. Approvals: Codex rings `--for user`, Claude relays the user's answer with `--user-approved` ([ADR 0037](../docs/decisions/0037-approvals-in-claude.md)). Approvals desk ([ADR 0039](../docs/decisions/0039-approvals-desk.md)): `ask` queues a Claude chat's question, `asks` lists the queue, `wait all` is the desk's watcher, `answer <id>` relays the user's answer, `brief` is the SessionStart hook text. See its header. |
| `test-relay.mjs` | `npm run test:relay`: every relay command against a throw-away `.relay/`, a fake Codex chat index and a fake `codex`. |
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
npm run sprites                 # every character in art/characters/ + every world-art kind (vfx, crowd, stage, npc, ui, decals)
npm run sprites naruto          # one character (several ids allowed: npm run sprites naruto sasuke)
npm run sprites vfx             # only the VFX atlas (approved effects only)
npm run sprites crowd           # only the crowd atlas (approved spectators only)
npm run sprites stage npc ui    # approved stage slots, NPC sheets and shared UI images
npm run sprites decals          # approved ground decals -> public/decals/ (atlas.json + the pages of each page set)
node tools/pack-sprites.mjs vfx crowd stage npc ui decals --candidates   # every candidate -> public/preview/ (local, ?art=custom)
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
| `--strict-scale` | scale gate strict for **every** strip, approved or not: the check before a fighter is set to `"scaleGate": "strict"`. Without it only unapproved strips fail, which is the gate a new strip must pass (see "Scale gate") |
| `--fit-head <id>:<anim>[,...]` | auto head fit for these strips, like the sidecar `anatomy: { "measurement": "auto-head" }`: a raw strip whose verdict is `uniform` is rescaled so its head matches the idle's |
| `--candidates` | world art (VFX, crowd, stage, NPC, UI, decals) is **approval-gated**: by default only items with an `approvedVersion` in the manifest are packed, at that version (a newer candidate is noted in the report and waits), outputs whose approval is gone are removed, and an unreadable manifest leaves every world-art output untouched. `--candidates` packs every latest candidate into `<out>/preview/<kind>/` instead (an item without a candidate previews its approved image), leaving the shipped outputs alone. `public/preview/` is git-ignored; the game shows it with `?art=custom`. Characters are not affected. |
| `--allow-drop` | (TOOL-048) the VFX atlas is refused (exit 1, nothing written) when it would lose an effect it ships whose source (`raw/` or `frames/`) is missing on disk, usually a sparse worktree without `art/vfx/raw/` (run `npm run pr -- art vfx` there). An effect that lost its approval still leaves without it. `--allow-drop` lets the loss through when it is intended. |
| `--root <dir>` (`--src`, `--art`) | art folder to read (default `./art`). Used by tests. |
| `--out <dir>` | public folder to write (default `./public`). Used by tests, so they never overwrite real characters. |
| `--manifest <file>` | manifest to read (default `<root>/manifest.json`) |
| `--guide <file>` | animation guide module (default `src/art/animGuide.js`) |

Exit codes: `0` ok (also when nothing is packed yet), `1` bad arguments / unknown character / crash, or the **scale gate failed**
(a `scale gate:` line; the sheet is still written so you can look at it), `2` warnings with `--strict`.

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
  decals/raw/<name>_vNN.png          ground-decal candidate on magenta, or the parts <name>_vNN_A.png, _B.png ... of one version
  decals/raw/<name>.json, <name>_vNN.json   optional sidecars (tolerance, drop, frames, split, parts.<letter>)
  decals/frames/<name>/<name>_NN.png cleaned cells (exact cell size = final)
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
     rise above the standing head use the same idea upward. The standing head is the top of the approved upright cell in `art/scale/builds.json` `standingReference.cells` (the title-style neutral cell); without one it is the idle's top (a crouched idle makes every upright pose's hair "rise"). The forward rule still measures against the idle's front. If nothing sticks out: the forward-most 28% of the body.
     Boxes larger than 40% of the body are warned. Every pixel threshold of these rules (tip band, minimum limb
     length and blob size, box padding) was tuned on spec v1 art and is scaled by `standingBodyPx / 136`
     (x1.47 in spec v2), so the boxes behave the same on bigger sprites.
   - `hitboxes.json` overrides are applied last.
   - **Lying frames** (ADR 0020): the resting ones (`ko` all, `down` last, `getup` first) get a **ground check**:
     per body column, the gap between its lowest opaque pixel and y 240. Warned (never dropped) unless at least
     40% of the columns are within 6 px, no fifth of the body's length is more than 12 px up at its lowest, and the
     frame is at most `bodyHeight` x 1.15 tall (px at a 200 px standing body, scaled by `standingBodyPx / 200`).
     A pose drawn from above fails it: one hand touches the floor line and the head end hangs in the air. Every
     `ko` and `down` frame and `getup` f0 also get a `footprint` (their opaque x span); the JSON report's `ground`
     has the measurements.
7. **Palette** is counted per character: above `maxColors` (48) is a note, above `warnColors` (64) a warning
   (use `--quantize 48`).
8. **Scale gate**: every strip's head (hair included) and feet are measured against the idle of the same pack (see
   "Scale gate" below). Strips with the auto head fit are rescaled first.

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
 },
 "footprint": { "108": [20,224], "109": [35,249], "110": [65,181], "135": [0,253] }
}
```

- `scaleAudit` (added after `boxes`): the scale gate's measurement for the dev tools (`?scaleaudit`, the test lab's head
  boxes, `scaleReport()`): `ref.box` (idle f0 head box), and per animation `head`, `feet`, `verdict`, `v`, per-frame
  `frames` and `boxes`. The game ignores it otherwise.
- `footprint` (only when the pack has lying frames): `"<sheet frame>": [x0, x1]`, the opaque x span (inclusive cell
  px) of every `ko` and `down` frame and `getup` f0. The engine stretches the contact shadow along it (ADR 0020).

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
- frames without a marker are treated as hand-made and are never overwritten;
- an applied auto head fit records its factor as `"autoHead"` in the marker: asking for the fit, or dropping it,
  re-imports the raw once; after that the fitted frames are kept as they are. A request that was **not** fitted
  (verdict not `uniform`) is not recorded, so it re-imports and is measured again on every pack while it stands: an
  exemption, `headColors` or a new idle can still make it fit.

Re-running the packer on unchanged input produces byte-identical output (safe to commit).

### Sidecar `raw/<anim>.json` / `raw/<anim>_vNN.json` (optional)

```json
{ "frames": 6, "split": "even", "bodyHeight": 140, "tolerance": 90, "drop": [3] }
```

`frames`: how many poses the strip really has. `split: "even"`: cut the strip into equal slices (snapped to the
emptiest column) instead of by gaps. `bodyHeight`: override for this animation. `tolerance`: background
tolerance. `drop`: indices of bad poses to discard (after splitting; out-of-range indices are warned and ignored).
`anatomy: { "measurement": "auto-head" }`: the auto head fit (see "Scale gate"). `stitch`: written by
`npm run stitch` (the measured factor); the packer ignores it.

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
- Ground decals (`art/decals/README.md`, ADR 0024, `tools/pack-decals.mjs`): `public/decals/atlas.json` + one PNG page per
  page set (`DECAL_PAGE_SETS`: base + edge, chakra + ki, lightning + fire, cursed; `decals_<set>.png`, or `_1`, `_2` ... when a
  set needs several pages; each <= 2048 x 2048, first fit on a 128 px grid, biggest cells first, a name never split across
  pages; the report checks the floor pages + the two biggest element sets against the engine's 4-page cap per match)
  = `{ "ppu": 64, "source", "packer", "pages": [...], "pageSizes": [[w, h], ...], "decals": { "<name>": { "page", "w", "h",
  "frames": [[x, y], ...], "mode": "flat"|"wall", "tinted", "group", "directional"?, "hotKey"?, "tile"?, "version" } } }`.
  Names, cells, variants per image, groups and modes come from `DECAL_SPECS` (the engine contract; the manifest's `decals.items`
  restates them, drift is warned) and only names with an `approvedVersion` (`decals.items.<name>` or a `worldArt.decal` batch)
  ship. Per name: the raw's parts are joined in letter order, magenta removed (alpha 0/255, specks under 4 px dropped), each
  image split into its brief count (extra pieces such as ring halves joined by slot, in order) and scaled so its largest
  variant fills 97% of the cell, each variant centered (tiling `erasure_trench`: each variant stretched to the full width,
  a variant short of either end warned); hot-key names snap near-white (>= 250) to #FFFFFF and keep it out of the
  <= 24-color median cut, other names tone near-white down to #F6F6F6, the tinted `barrier_crack` becomes greyscale (warned
  when drawn in color);
  magenta/purple pixels and a hot-key name without #FFFFFF are warned. Cleaned cells are written back to
  `art/decals/frames/<name>/` with the usual marker; stale pages and an unapproved atlas are removed.

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
Keys starting with `_` are ignored, except an animation's `"_scale"`: the auto head fit it was measured at (default 1).
When an animation is packed at another fit, its boxes and `hand` points are scaled about the pivot by the ratio (a note
says so), so re-measured boxes get `"_scale": <the fit>` and are not scaled twice.
Out-of-range frames and malformed boxes are warned, not fatal.
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
| `large auto hitbox` / `no clear strike limb` | check the frame; add a `hitboxes.json` override. The strike-limb note lists the frames (`light2#2`) still on the auto box; frames a `hitboxes.json` override replaced are not counted. `--json` reports every active frame's box and rule (`hitBoxes`) and the rising-strike reference (`hitRef`) |
| `standingReference: ... does not exist` | the cell named in `builds.json` is missing or not 256x256: the rising-strike rule falls back to the idle until it is fixed |
| `N lying frame(s) float above the floor line` | the lying pose is drawn from above: redraw it side-on at the spec camera with the head, back, hips and legs on y 240 (art/SPEC.md "Lying poses"; the four current fighters: art/scale/KO_DOWN_BRIEF.md) |
| `... changed but frames/<anim>/ has manual edits` | keep the edits, or delete `frames/<anim>/` to re-import the new source |
| `frames/<anim>/ were cleaned from ..., which is no longer in raw/` | the only version was rejected: delete `frames/<anim>/` (or add a new `_vNN`) |
| `manifest spec.X is ... - must be ...` | the manifest's spec block has a malformed value; fix it (the v2 default is used meanwhile) |
| `scale gate: <anim> head 0.80 of idle (feet 1.01): head/hair drift` | an unapproved strip's head is off the idle's (exit 1, nothing written): redraw it to `reference/head_scale_guide.png` |
| `scale gate: did not write public/characters/<id>/ (it keeps its last pack) or frames/` | a strict strip failed, so the whole pack of that fighter was refused: fix the strips named above |
| `scale: <anim>: the manifest's scale exemption was written for vNN but the packed strip is vMM` | an exemption covers only its own drawing: look at the new version on the heads sheet; if the probe misreads it too, set `"scaleExemptVersion": MM` |
| `scale gate: <anim> head 0.85 of idle (feet 0.88): the whole figure is off` | re-import with the auto head fit (a new version, sidecar `anatomy: { "measurement": "auto-head" }`) |
| `scale gate: <anim> pops inside the strip` | two parts at two sizes: `npm run stitch` with a measured factor, or redraw |
| `~ <anim> ... [approved vNN]` (scale findings) | an approved strip is off; not a failure until it is fixed (ART-SCALE-02) |
| `scale: <anim> head X was Y in art/scale/scale-baseline.json at the same version` | something other than new art resized a strip (sidecar, bodyHeight, packer): find it, or `npm run scale -- --baseline` if intended |

### Scale gate (TOOL-025, ADR 0021)

The contract and the verdicts are in [art/CHARACTER_SCALE.md "Scale gate (automatic)"](../art/CHARACTER_SCALE.md#scale-gate-automatic).
How the tools measure (`scale-probe.mjs`):

- The **reference** is the idle of the same pack. The gate measures the cells **before** `--quantize`, with their
  colours reduced to the **idle's own** palette (`measurementCells`, ART-KIL-PROBE): pixels within 20 of a declared
  `headColors` / `feetColors` colour are snapped to it first (every strip), the palette is the idle's median cut to
  48 colours, and every strip is mapped to its nearest colour (colours farther than any idle colour from the palette
  stay unmatched). A strip's numbers therefore depend only on its own pixels and the idle's: adding, redrawing or
  recolouring another strip never moves them, and `--quantize` does not change a single measurement. (Before, the
  fighter-wide median cut decided the colours, so Killua's unchanged idle head read 52x35 or 52x43 depending on the
  candidates in the pack.)
- `anims.json` records the gate's per-frame measurements (`meta.scaleAudit`, `method: "idle-palette"`). `npm run scale`
  and `npm run lineup` judge those with today's manifest instead of re-measuring the quantized sheet; a pack made
  before the method is measured from the sheet and says so (repack it for the gate's own numbers).
- **Head**: the colours at least 1.5x denser in the top 12 % of the idle figure than in its lower 60 % (skin
  excluded), or `headColors` of the fighter in `art/scale/builds.json` (Naruto: the hair yellow only, Sasuke: his
  navy hair shades). The mask is opened with a 3x3 cross, split into 8-connected blobs, and the highest blob of at
  least 20 % of the idle head area is the head (holes filled). Head scale = median of sqrt(area), width and height
  ratios. **Feet**: colours at least 3x denser in the bottom 7 % (or `feetColors`).
- **Per strip**: the median head and feet over the frames (exempt frames left out) and the head range. Verdicts and
  thresholds: `GATE_DEFAULTS` in the module, overridable by `spec.scaleGate` in the manifest (`stripTol`, `popTol`,
  `feetAgree`, `feetShare`, `fitMin`, `fitMax`, `baselineTol`, `lowConf`).
- **Strictness**: per character `"scaleGate": "auto"` (default: unapproved strips strict, approved ones findings),
  `"strict"` or `"warn"`; a character folder without a manifest entry is `warn`; `--strict-scale` makes every strip
  strict for the run. A strict strip that fails **refuses the pack**: neither `public/characters/<id>/` nor `frames/`
  is written for that fighter (the last good pack stays), and the exit code is 1.
- **Unreadable poses** (`unmeasured`: the low-confidence list, or no head found) fail a strict strip unless the manifest
  animation carries `"scaleManualQA": { "version", "result": "pass", "by", "note", "evidence" }` for exactly the packed
  version; it is then `manual`, shown apart from `ok` (TOOL-ROTATED-ANATOMY).
- **Shadowed hand edits**: `frames/<anim>/` edited on an older version than the newest raw refuses the pack (the new raw
  is measured instead); `frames/_old/` and any `frames/_*` folder are archives the packer ignores.
- **Approved reference cells** (`builds.json` fighter `"scaleReference": { "cells": ["characters/<id>/reference/<cell>.png"],
  "why": "..." }`, 256 px game cells): every strip, the idle included, is measured against them instead of the idle, and
  the idle gets a real verdict and is gated like a candidate. For a fighter whose idle's own exact shades bias the probe
  (Killua's title-style idle: every strip read ~0.89 of its value against the approved combat cell, and the approved cell
  itself read 0.912 against the idle). A missing or wrong-size cell fails the gate. The stitch tool uses the same cells.
- **Whole-figure frame split**: when the column split cuts a connected figure (a hand reaching over the next pose's
  column) or miscounts the poses, a one-row strip is split into its figures instead (the biggest components are the
  bodies, small detached bits join the nearest); figures that really touch are warned. Strips that split cleanly are
  unchanged.
- **Stitch** (`stitch-parts.mjs`): measures against the fighter's current idle packed fresh from `art/` without
  `--quantize`, the cells the gate measures (`--public <dir>` uses an existing pack instead and refuses one older than
  `raw/idle_vNN.png`); ignores a refinement trial that cuts a pose at the top of the cell; measures like the gate
  (`measurementCells`). Poses are **whole figures** (8-connected components: the biggest ones are the bodies, small
  detached bits join the nearest), so a hand reaching over the next pose's column is not cut into it, and the stitched
  strip lays the figures out one by one with a clean gap; only figures that really touch fall back to the column split
  (warned, with the part's own layout). `--counts A,B` fixes the pose counts; the total must match the manifest. Where
  the probe finds no head, `--factor` needs `--reason`, `--landmarks` and `--uncertainty` (recorded in the sidecar).
- **Exemptions** (`scaleExempt`, `scaleExemptFrames` on a manifest animation) need `"scaleExemptVersion"`: they
  cover only that version of the strip. A redraw (another version) is measured, with a warning, until someone looks
  at it and re-exempts it on purpose; an exemption without a version covers only an unversioned strip.
- **Auto head fit**: after the gather, the strips that asked for it are audited; a `uniform` one is resampled from its
  raw at `scale / head` (clamped `fitMin..fitMax`); the gate then audits the final cells.
- **Stitch** (`stitch-parts.mjs`): each part's poses are measured at their own trial scale and once more at the scale
  that should bring the head to 1.00; their colours are snapped to the packed idle's (brightness weighted double, so a
  more saturated hair shade still reads as hair). Factor = the ratio of the two parts' idle-matching scales.

```bash
npm run scale                      # every packed fighter: heads-<id>.png, scale-report.json, scale-baseline.json
npm run scale -- killua --guide    # + art/characters/killua/reference/head_scale_guide.png (redraw reference)
npm run scale -- --baseline        # accept the current heads as the baseline (an intended change)
npm run stitch -- naruto specialUp 2 --parts 1     # re-stitch the v01 parts with a measured factor as v02
npm run stitch -- killua light2 3 --dry-run        # measure only
```

`npm run scale` reads `public/characters/<id>/` (what ships), so pack first. `--root`, `--public`, `--out` point it
elsewhere (the regression test does).

### Changing the spec / extending

- **New character**: copy `art/characters/_template/` to `art/characters/<id>/`, add it to `art/manifest.json`. No packer change.
- **New animation name**: add it to `art/manifest.json` (and `src/art/animGuide.js` so the engine and Sprite Lab know it). The packer picks it up from the manifest; set `bodyHeight`, `frames`, `phases`, `ms`.
- **New VFX effect**: needs engine support first (effect names are fixed in code); then add it to `manifest.vfx.effects`.
- **New decal name**: engine support first (`src/game/ground.js`, `src/art/decalPainter.js`), then `DECAL_SPECS` in
  `pack-decals.mjs`, `decals.items` in the manifest, `art/queue/sources.json` and the brief (`art/decals/README.md`).
- **Changing the spec** (cell size, pivot, pixelsPerUnit, color limits): record an ADR, change the `spec` block (and the
  body heights) in `art/manifest.json`, update `art/SPEC.md`, and re-run the packer. Packer-written `frames/` folders
  re-import automatically (their marker records the cell); hand-edited ones keep winning, so redo or delete them.
  Change `SPEC_DEFAULTS` / `BODY_HEIGHT` at the top of `pack-sprites.mjs` (and bump `PACKER_VERSION`) only so the
  defaults match the new spec for a manifest that leaves keys out.
- After any packer change: `npm run test:sprites` must stay green.
