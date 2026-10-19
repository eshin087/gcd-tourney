# Side characters (NPCs)

The people around the ring who are not fighters: the tournament **announcer**, two **judge monks** and a
**snack vendor**. They are what makes the stage read as the World Martial Arts Tournament and not as an
empty arena. Each NPC is a small sprite sheet (2-frame animations) that the engine places as a
camera-facing billboard and switches between animations on match events.

Rules come from [ADR 0008](../../docs/decisions/0008-world-art-and-parallel-production.md) (world art,
claim queue, commit rules; it wins over everything else) and
[ADR 0007](../../docs/decisions/0007-art-spec-v2-shippuden-256.md) (versioned `_vNN` names, review queue).
Taste and craft: [STYLE_GUIDE.md](../STYLE_GUIDE.md). Fighter numbers in SPEC.md do **not** apply here;
the NPC numbers are below.

## The cast

| id | who | where in the scene | animations (frames) | idle height | world height (ppu 80) | brief |
|---|---|---|---|---|---|---|
| `announcer` | tournament MC with a microphone: blond curly hair, sunglasses, black suit (homage to the Dragon Ball tournament announcer, a cameo allowed by ADR 0008) | beside the ring, on the grass at the back-left next to the gong; walks the ring edge during a match (ENG-118) | `idle` 2, `point` 2, `shout` 2, `cower` 2, `walk` 4, `run` 4, `shocked` 2, `micThrust` 2 | 112 px | 1.40 units | [announcer/](announcer/CHARACTER.md) |
| `monk-a` | **elder judge**: short, round, stooped, bald, long white brows and beard, saffron robe + crimson mantle, holds a referee paddle-fan | at a ring corner (proposed: back-left) | `idle` 2, `signal` 2 | 92 px | 1.15 units | [monk-a/](monk-a/CHARACTER.md) |
| `monk-b` | **young judge**: tall, lean, upright, shaved head, slate-grey robe + crimson sash, long wooden staff with a red ribbon | at the opposite ring corner (proposed: back-right, mirrored) | `idle` 2, `signal` 2 | 108 px | 1.35 units | [monk-b/](monk-b/CHARACTER.md) |
| `vendor` | **snack vendor**: stocky, cheerful, towel headband, indigo festival coat, a wooden tray of noodles, dumpling skewers and buns hung from his neck (no cart) | in an aisle of the stands (the stair gaps of the side stands or the entrance path) | `idle` 2 | 104 px | 1.30 units | [vendor/](vendor/CHARACTER.md) |

For scale: a fighter is about 1.56 units tall and a medium adult spectator 1.4 units (crowd ppu 50,
ADR 0008), so the announcer stands like a medium adult in the stands, the elder monk is clearly short and
the young monk is the tallest, leanest body of the four. Two monks with different silhouettes (short and
round with a fan versus tall and narrow with a staff) is deliberate: they must never read as the same
sprite twice.

The two monks share the tournament's **official crimson** (`#c8323c`, the same red as the temple
banners) so they read as a team; the announcer wears a deep-red tie for the same reason.

## NPC spec (ADR 0008)

| property | value |
|---|---|
| cell | **128 x 128** px, transparent |
| pivot | **[64, 124]** (feet center on y 124, 4 px empty below) |
| pixelsPerUnit | **80** (112 px = 1.40 world units) |
| cell margin | every opaque pixel inside **x 4..123, y 4..124** after packing |
| view | **3/4 view facing the viewer, turned about 30 degrees toward screen-right** (as if watching a fight off to the right), head turned a little more to the right, camera about 10 degrees above. Both eyes visible |
| handedness in that view | the NPC's **right** hand is on the **left** side of the image, the **left** hand on the **right** side (they mostly face the viewer) |
| proportions | natural anime proportions per character (adults about 5.5 to 7 heads, see each CHARACTER.md). Never chibi, never super-deformed |
| style | hard-edged anime pixel art matching the fighters, dark outline `#1d1420` one art pixel thick (1 px in the cell, about 4 canvas px in the 4x raw), 3 to 4 tone flat cel shading, **key light from the upper front, a little from the left of the image** (the arena sun; the same painted light as the crowd, because NPCs and spectators are unlit billboards side by side; fighters keep their own upper-front-right rule), no anti-aliasing, gradients, dithering, glow or noise |
| palette | the exact hexes in each CHARACTER.md, **<= 32 colors per NPC** |
| raw background | flat magenta `#FF00FF` |
| never in the sprite | text, letters, numbers, logos with letters, speech bubbles, sound-effect lettering, ground shadow, floor, scenery, energy effects, steam (the engine may add steam and dust) |
| frames | every NPC animation has **2 frames** unless its ANIMATIONS.md row says otherwise (the announcer's `walk` and `run` cycles have 4; the packer reads the `frames` column). Loops cycle f0 -> f1 -> f0; one-shot animations play f0 (wind-up) then hold f1 |
| raw generation | **one animation per image**: all of its frames in one row on a 1536 x 1024 magenta canvas, same scale, feet on one baseline. Pixel art drawn at 4x (every art pixel a 4 x 4 block), so a 112 px NPC is about 450 px tall on the canvas |

**Mirroring.** The engine flips an NPC horizontally when it stands on the right of the ring so it faces
the fight. Asymmetric details (which hand holds the microphone, which shoulder the mantle covers) swap
sides when mirrored. That is accepted; it is one more reason why nothing on an NPC may carry text.

**Fit the cell.** 128 px is tight for a 108 to 116 px figure. Raised arms go **diagonally** up and out
toward the right, never straight up (a straight-up arm on a 112 px adult ends about 20 px above the
cell). Props (fan, staff, tray) stay inside the margin in every frame. Each ANIMATIONS.md gives the
exact limits per pose.

## Folder layout

```
art/npc/
  README.md                     this file
  <id>/
    CHARACTER.md                look, identity checklist, palette, landmarks, legal notes
    ANIMATIONS.md               every animation frame by frame, timing, heights, engine triggers, QA numbers
    PROMPTS.md                  paste-ready image prompts: model sheet first, then one prompt per animation
    reference/                  created by the first save:
      model_sheet_vNN.png         model-sheet candidates (turnaround + swatches)
      model_sheet.png             the approved sheet (copied by the lead on approval)
      idle_approved.png           the approved idle strip (copied by the lead on approval)
      _rejected/                  rejected sheets
    raw/
      <anim>_vNN.png            one strip per animation (2 frames in one row), highest NN = current candidate
      _rejected/                rejected strips, ignored by the packer
    frames/
      <anim>/<anim>_NN.png      cleaned 128 x 128 frames (packer output or hand touch-ups)
```

Packer output (`npm run sprites npc`, approved animations only): `public/npc/<id>/sheet.png` + `anims.json`.
The animation list, loop flags, frame times and target heights come from the table in `<id>/ANIMATIONS.md`;
each strip is scaled so its tallest frame matches its row's height (strips drift in scale between images), feet
on y 124, centered on x 64, inside the 4 px margin, <= 32 colors. An NPC ships only when its `idle` is approved.
`node tools/pack-sprites.mjs npc --candidates` packs the latest strips into the git-ignored `public/preview/npc/`
(seen in the arena with `?art=custom`). Never edit the outputs by hand (CLAUDE.md rule 3); change the raw art and re-pack.

## File flow (parallel production)

NPCs go through the claim queue like every other world asset (ADR 0008). **One batch = one NPC**:
`npc-announcer`, `npc-monk-a`, `npc-monk-b`, `npc-vendor`.

| step | who | what |
|---|---|---|
| 1. claim | worker | `npm run queue -- claim --type npc --agent <name>`. It prints the batch, this NPC's `PROMPTS.md` and the exact output names. Work on that batch only |
| 2. read | worker | `<id>/CHARACTER.md` (identity checklist, palette), `<id>/ANIMATIONS.md` (poses, QA numbers), then `<id>/PROMPTS.md` |
| 3. model sheet | worker | run prompt **S1** unless an approved `reference/model_sheet.png` already exists (then skip S1 and attach that file). Save as `<id>/reference/model_sheet_vNN.png` |
| 4. strips | worker | run the animation prompts in PROMPTS.md order, **in the same image thread**, attaching the model sheet (and the idle strip for every strip after idle). Save each as `<id>/raw/<anim>_vNN.png` |
| 5. self-QA | worker | the [quick check](#quick-check-before-saving) on every image before saving. A failed attempt that was never saved needs no number; regenerate it |
| 6. done | worker | `npm run queue -- done npc-<id> --agent <name>`; hand back to the lead with one QA line per file (pose count, scale match, palette drift, anything off-model). Workers never edit `REVIEW.md`, `TRACKER.md`, `manifest.json` and never commit |
| 7. queue for review | lead | **one `art/REVIEW.md` row per `npc-<id>` batch** (`needs review`, ADR 0008), linking the model sheet and every strip with their versions; `manifest.json` / `TRACKER.md` updated |
| 8. pack + preview | lead | `node tools/pack-sprites.mjs npc --candidates`, then the game with `?art=custom` (local preview in the arena; the NPCs react to round start, supers, clashes and KOs); check the report |
| 9. decision | user | approve the batch row, or name the files to redo; per-file approve / redo goes in that row's notes (chat or REVIEW.md) |
| 10. record | lead | approved: copy the sheet to `reference/model_sheet.png` and the idle strip to `reference/idle_approved.png`, set `approvedVersion`. Rejected: move the file to `_rejected/` next to it, fix the REVIEW link, re-open the batch with the reason |
| 11. commit | lead | explicit paths only: `art/npc/**`, `public/npc/**` (never `git add -A`) |

**Version numbers.** Save to the **exact paths `claim` printed**. For a file it did not print (for
example a second model-sheet try after a saved one), run `npm run queue -- next-file
art/npc/<id>/raw/<anim>` (or `art/npc/<id>/reference/model_sheet`): it counts the folder and its
`_rejected/` subfolder. Two digits, starting at `v01`, never reused, never overwritten. Names are exactly the animation names below (`idle_v01.png`,
`point_v03.png`, `signal_v02.png`); no other suffixes.

**Attaching the model sheet (NPC rule).** ADR 0007 says prompts attach approved references only. NPC
batches are small (2 to 5 images) and the user reviews an NPC as a whole, so an NPC batch runs as one
unit: when no approved `reference/model_sheet.png` exists yet, the strips in the same batch attach the
batch's own model-sheet candidate. The lead's REVIEW row for the batch names the sheet version each strip was
drawn from. If the user rejects that sheet, the lead re-opens the batch and every strip of it is redone
from the next sheet. Once a sheet is approved, every later prompt attaches only the approved copy.

**Refusals.** The announcer prompts name the Dragon Ball announcer. If the generator refuses or drifts,
use the fallback `CHARACTER:` line in [announcer/PROMPTS.md](announcer/PROMPTS.md) (traits only, no
names). The monks and the vendor are original designs and need no fallback.

## Quick check before saving

Run this on every image (30 seconds). If one item fails, regenerate instead of saving.

- [ ] Exactly the requested number of figures (4 on a model sheet, 2 on a strip), one row, nothing
      overlapping, a clear magenta gap between figures.
- [ ] Same character, same scale (same head size) in both frames; feet on one shared baseline.
- [ ] 3/4 view toward the right edge, both eyes visible; the hands are on the sides the prompt says
      (the microphone, fan and staff never switch hands between frames).
- [ ] Proportions as the CHARACTER.md says (no big head, no chibi), identity checklist passes.
- [ ] Colors match the palette (no new hues, no gradients); dark outline one art pixel thick (about 4 canvas px) closed all around; light from the upper left.
- [ ] Flat, uniform magenta background; no magenta on the character.
- [ ] No text, letters, numbers, speech bubbles, sound-effect lettering, ground shadow, floor, steam
      or energy effects.
- [ ] Raised arms and props go diagonally, not straight up (they must fit the 128 px cell after
      packing; ANIMATIONS.md has the limits).

## QA after packing (lead)

- [ ] Every frame inside x 4..123, y 4..124 (no clipped hand, fan, staff tip or hair).
- [ ] Trimmed heights match the targets in ANIMATIONS.md (the packer scales each strip so its tallest frame
      equals its row's height, which also evens out scale drift between generated strips; a row without a height
      takes idle's scale), and the head reads the same size in every animation.
- [ ] Feet centered on x 64 and on y 124 in every frame: the NPC does not slide or hop between frames
      unless the pose says so.
- [ ] Readable at 1x in the game buffer: the face and the identity props (sunglasses, beard, staff,
      tray) read in one glance.
- [ ] Mirrored copy still looks right (no text, no "wrong-hand" problem that breaks the pose).
- [ ] Palette <= 32 colors.

## How the engine will use them

Wired on 2026-10-10 (ADR 0012): `src/world/worldArt.js` (`NPCS` placement table, `NPC_CUES` event table,
`NpcSprite`) and the cue calls in `src/game/game.js`. Placement today: announcer at the gong (replaces the painted
one), monk-a at the back-left ring corner, monk-b mirrored at the back-right corner, the vendor in the left
stand's standing-room gap. The notes below were the brief.

- **Loading.** An NPC loader reads `public/npc/<id>/anims.json` + `sheet.png` (cell, pivot, ppu and
  per-animation `frames` / `durations` / `loop`, like a fighter's anims.json) and draws each NPC as a
  camera-facing billboard at ppu 80, feet on the grass. Proposed anims.json shape (the packer is the
  authority):

  ```json
  {
    "frameWidth": 128, "frameHeight": 128, "columns": 8, "pivot": [64, 124], "pixelsPerUnit": 80,
    "facing": "viewer-right", "source": "art-pack", "complete": true,
    "animations": {
      "idle":  { "frames": [0, 1], "durations": [520, 520], "loop": true },
      "point": { "frames": [2, 3], "durations": [240, 240], "loop": true }
    }
  }
  ```

- **Placement and facing.** The announcer replaces today's procedural `bakeAnnouncer()` billboard
  (`src/art/crowdPainter.js`, placed in `src/world/arena.js` beside the gong at the back-left of the
  ring). The monks stand on the grass just outside two ring corners (the ring spans -9..9 on x and z).
  The vendor stands in an aisle of the stands and may drift slowly along it (the engine moves the
  billboard; no walk animation exists). An NPC on the right of the ring is mirrored so it faces the
  fight.
- **Event triggers** (proposed; durations are engine-side):

  | NPC | animation | when |
  |---|---|---|
  | announcer | `idle` | default |
  | announcer | `point` | the intro (calling each fighter), the winner at a KO / round end, a ring-out |
  | announcer | `shout` | round start ("Begin!"), super and ultimate activation (the super flash), long combos |
  | announcer | `cower` | ultimate beams, beam clashes, explosion-size KOs, hard camera shakes. Has priority over `shout` / `point` |
  | monks | `idle` | default |
  | monks | `signal` | round start (both), ring-out (the nearer monk), KO / time-up decision; plays f0, holds f1 for the call, back to `idle` |
  | vendor | `idle` | always (he keeps selling whatever happens: comic contrast with the crowd) |

- **Fallbacks (fail soft, CLAUDE.md rule 6).** A missing animation falls back to `idle`. A missing or
  broken announcer sheet keeps the procedural announcer; missing monk or vendor sheets mean that NPC is
  simply not placed. One clear console line, never a crash.
- **Lighting.** NPCs use the same dimming as the crowd during supers (the screen darkens), so draw them
  at normal daylight values; no baked darkness.

## Status

Briefs and prompts: ready for all four NPCs. Engine loader, packer NPC mode and queue tool: done (ADR 0012).
Per-asset status lives in [TRACKER.md](../TRACKER.md) and [manifest.json](../manifest.json), maintained by the
Codex lead.
