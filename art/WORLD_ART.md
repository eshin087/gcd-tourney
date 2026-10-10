# World art: start here

Everything in GCD Tourney that is **not a fighter**: the packed crowd in the stands, the tournament
stage, the announcer and other side characters, the UI art and the effects. The goal is the authentic
World Martial Arts Tournament feel from Dragon Ball: a stand full of 500+ visibly different anime/manga
spectators around a hand-made white-stone ring, all in the same crisp HD-2D pixel art as the fighters.

Rules and numbers come from [ADR 0008](../docs/decisions/0008-world-art-and-parallel-production.md)
(world art + parallel production). **ADR 0008 wins** over anything else. Fighter art is a separate track:
[README.md](README.md), [SPEC.md](SPEC.md), [ADR 0007](../docs/decisions/0007-art-spec-v2-shippuden-256.md).

Today all of this is painted in code (28 crowd variants of 24 x 32 px, procedural stage textures, a
32 x 48 announcer, procedural VFX). Each area replaces the procedural version piece by piece. Anything
without approved art keeps its procedural fallback, so nothing breaks while art is in flight.

## Read this first, depending on who you are

| you are | read | then |
|---|---|---|
| **the user** | [How the user reviews](#how-the-user-reviews-at-scale), [REVIEW.md](REVIEW.md) | approve batches or list the ids to redo, in chat or in REVIEW.md |
| **Codex lead** (one session) | this file, [queue/README.md](queue/README.md) (lead loop), [REVIEW.md](REVIEW.md), [TRACKER.md](TRACKER.md) | run pilots, spawn workers, pack, build contact sheets, queue reviews, commit |
| **Codex worker** (many sessions) | [queue/README.md](queue/README.md) (worker loop), then the README / prompts of the area you claimed | claim a batch, generate, save, self-QA, `done`, claim the next |
| **Claude** (Claude Code) | ADR 0008, this file | queue tool, packer world modes, engine loaders, fixes reported in `docs/TASKS.md` |

## The five areas, in priority order

| # | area | folder | what it produces in the game | size of the job | brief and prompts |
|---|---|---|---|---|---|
| 1 | **Crowd** | `art/crowd/` | `public/crowd/atlas.png` + `atlas.json`: every seat gets a unique spectator with `idle`, `cheer` and `shocked` frames | **576 spectators** in 43 roster groups (356 cameo, 220 original), 1 raw image each (3 poses) = 1700+ frames, **70+ batches** (up to 10 each; groups of 6-8 are one partial batch) | `crowd/README.md`, `crowd/PROMPTS.md`, rosters in `crowd/roster/<group>.json` |
| 2 | **Stage set** | `art/stage/` | `public/stage/<slot>.png` + `manifest.json`: ring, temple, stands, gate, banners, lanterns, trees, clouds, sky | **30 slots**, 1 batch each | `stage/ASSETS.md` (slot list, sizes, tiling, world coverage), `stage/PROMPTS.md` |
| 3 | **Announcer + NPCs** | `art/npc/` | `public/npc/<id>/sheet.png` + `anims.json` | **4 NPCs** (announcer, two monk officials `monk-a` / `monk-b`, food vendor) = 4 model sheets + 9 animation strips, 18 frames | `npc/README.md` (cast, NPC spec), `npc/<id>/CHARACTER.md`, `npc/<id>/PROMPTS.md` |
| 4 | **UI** | `art/ui/` | logo, title key art, menu, character-select and results backgrounds, HUD frame pieces (shown once Claude wires them, ENG-013) | about **6-8 images** | [ui/README.md](ui/README.md), [ui/PROMPTS.md](ui/PROMPTS.md) |
| 5 | **VFX** | `art/vfx/` | `public/vfx/atlas.png` + `atlas.json`: hit sparks, bursts, rings, dust, smoke, orb, lightning... | **15 effects**, 1 batch each | [vfx/README.md](vfx/README.md), [vfx/EFFECTS.md](vfx/EFFECTS.md), [vfx/PROMPTS.md](vfx/PROMPTS.md) |

Altogether about **125-130 batches and about 640 images** (crowd 71 batches / 576 images, stage 30, NPC 4 batches / 13 images, UI about 7, VFX 15; counted 2026-10-08). Batch ids, claim order and exact output file
names come from the claim queue ([queue/README.md](queue/README.md)); `npm run queue -- status` shows the
live counts.

### Why this order

1. **Crowd first: the biggest visual win.** About 400 seats are on screen in almost every camera shot,
   and today they are 28 tiny repeating variants. Five hundred different faces (and recognizable cameos)
   are what make the stage read as a real tournament. It is also the most parallel job (70+ independent
   batches), so it keeps the most workers busy.
2. **Stage set second.** The ring, temple and stands fill the rest of the frame. Fewer images, but each
   one covers a lot of screen.
3. **Announcer and NPCs third.** Few images with a lot of personality: the announcer is in every intro
   and KO.
4. **UI fourth.** Menus and HUD art matter once the arena looks right; the title key art should match the
   final fighters and stage anyway.
5. **VFX fifth.** The procedural effects already read well in motion; hand-made ones are polish.

The queue hands out batches in this order by default (`claim` without `--type` takes crowd first).

## The numbers that matter

Full details live in each area's brief. These are the ones every agent should know by heart.

**Crowd** (ADR 0008)

- Cell **64 x 96 px**, transparent, **3 frames per spectator: `idle`, `cheer`, `shocked`**. Pivot
  **[32, 94]** (feet center, 2 px empty below). Crowd ppu **50** (a medium adult is 1.4 world units).
- Front view facing the viewer, camera slightly above (about 10 degrees). Billboards always face the camera.
- **Height classes** (idle height incl. hair or hat; the packer scales each spectator to it): `tiny` 44 ·
  `short` 58 · `medium` 70 · `tall` 78 · `huge` 84. Tall and huge spectators cheer with arms out to the
  sides, not straight up.
- Poses: **idle** = standing, watching the ring, a small personality pose (arms crossed, eating, holding a
  sign). **cheer** = excited (arms up, fist pump, waving a flag, shouting). **shocked** = KO and super
  moments (jaw drop, hands on head, leaning back, eyes wide).
- Style: anime/manga pixel art matching the fighters (spec v2 realism for adults, natural proportions for
  kids and creatures), hard pixels, 1 px dark outline, **<= 24 colors per spectator**.
- Raw: **one image per spectator**, the 3 poses in one row (idle, cheer, shocked), same scale, feet on
  one baseline, on a **1536 x 1024 flat magenta canvas**, saved as `art/crowd/raw/<id>_vNN.png`.
- Roster entries (`art/crowd/roster/<group>.json`, schema in ADR 0008) carry everything a prompt needs:
  `look` (and the name-free `fallbackLook` for cameos), `heightClass`, and one line each for `idle`,
  `cheer` and `shocked`.
- Atlas: 64 cells per row (21 spectators per row); 500 spectators = 24 rows = 4096 x 2304 px; the current 576 = 28 rows = 4096 x 2688 px.

**Stage set**: each procedural slot (`src/art/textures.js` plus the tree, cloud and sky painters) can be
replaced by `public/stage/<slot>.png`. Custom art keeps the slot's **world coverage and tiling**
(seamless where it repeats) at about **4x the procedural resolution** (32-64 px per world unit). Look:
white stone ring, Chinese-temple architecture, red and gold banners, lanterns, palms and pines, blue sky.
Raw `art/stage/raw/<slot>_vNN.png` -> approved and fitted `art/stage/final/<slot>.png` -> packer.

**NPCs**: cell **128 x 128**, pivot **[64, 124]**, ppu **80**, facing the viewer in 3/4 view.
Announcer `idle` 2, `point` 2, `shout` 2, `cower` 2 (hides during big explosions; a recognizable
DBZ-announcer homage is allowed). Monk officials `idle` 2, `signal` 2. Vendor `idle` 2. Each NPC batch
starts with a model sheet (`art/npc/<id>/reference/model_sheet_vNN.png`) that the animation prompts
attach; strips go to `art/npc/<id>/raw/<anim>_vNN.png`.

**UI** sizes: [ui/README.md](ui/README.md). **VFX** cells (128 x 128, ppu 56): [vfx/README.md](vfx/README.md)
and [SPEC.md](SPEC.md). Both use the versioned names of ADR 0007.

## Rules every world-art image follows

- **Cut-out art** (spectators, NPCs, stage sprites such as trees, clouds and the parasol, the logo, VFX)
  is drawn on a **flat #FF00FF magenta background**: one flat color, edge to edge, no gradient.
  **Opaque art** (stage textures, the sky, UI backgrounds and key art) fills the whole canvas instead.
- **Hard-edged pixel art**: crisp square pixels, **1 px dark outline** on characters and sprites, no
  anti-aliasing, no blur, no soft gradients, no noise or dithering fills. VFX follow their own color
  rules in [vfx/README.md](vfx/README.md) (tinted effects have no outline).
- **No text** anywhere: no letters, numbers, logos or watermarks (signs held by spectators show simple
  shapes only). The exceptions are the game logo (briefed in [ui/README.md](ui/README.md)) and the stage kanji slots:
  the banners, the gate sign and the lanterns are made of kanji ([stage/ASSETS.md](stage/ASSETS.md)).
- **No ground shadow, no floor, no scenery** behind cut-out art. The engine draws shadows.
- **One painted light for unlit billboards.** Spectators and NPCs get no engine light, so both are
  painted with the key light from the **upper front, a little from the left of the image** (the arena
  sun's side). Fighters keep their own upper-front-right rule ([STYLE_GUIDE.md](STYLE_GUIDE.md)).
- **No magenta inside the art.** The packer deletes near-magenta pixels, so hot pink, magenta and violet
  never appear in a character or sprite. Pink characters (pink hair, a pink-skinned creature) use a
  soft pastel or salmon pink, well away from #FF00FF.
- **Describe, don't name styles.** Prompts describe visual traits (hair, outfit, colors, build, props).
  Never ask for "the style of" a living artist or a studio.
- **Versioned names** (ADR 0007): every saved image is `<name>_vNN.png`, v01, v02, ...; versions are
  never overwritten or reused; the highest version is the current candidate; rejected files move to the
  `_rejected/` folder next to them.
- Prompts are **paste-ready** in each area's `PROMPTS.md` (crowd: one template filled from the roster
  entry). If a prompt drifts or gets refused, the worker notes it and the lead fixes the prompt or
  roster, never the worker.

## Production plan

**Phase 0: tools (Claude).** The claim queue (`tools/queue.mjs`, `npm run queue`), the packer's world
modes (`npm run sprites crowd|stage|npc|ui`, all since 2026-10-10: approved art only, `--candidates` for a local preview) and the engine
loaders (crowd atlas, stage overrides, NPC sheets, UI images). Claude builds these in parallel with
production; art never waits for them, because the raw files are the source and can be packed later.
If `npm run queue` is not wired yet, `node tools/queue.mjs <command>` does the same. If a packer mode is
missing, the lead reviews the raw images directly and files a row for Claude in `docs/TASKS.md`.

**Phase 1: pilots (gate).** Before many workers start on an area, one pilot batch proves the style:
the first crowd batch, one stage slot, the announcer. Run the pilots side by side (the lead plus 2-3
workers, each with `--type`), pack them, and put them in front of the user together. Once the user
approves an area's pilot, its approved images become that area's style reference (the area README names
the file every later prompt attaches). Mass production of an area starts only after its pilot is
approved: 500 spectators in the wrong style are 500 redos.

**Phase 2: mass production.** The lead spawns workers. Suggested fleet: start with **4 workers** while
the first post-pilot batches come back, then grow to **8-12** (mostly `--type crowd`, 1-2 on stage, NPC,
UI and VFX). If the image generator starts rate-limiting, fewer workers finish sooner than many stalled
ones. Workers never wait for review: they keep claiming while the user reviews earlier batches.

**Phase 3: integration (Claude, continuous).** As each area gets approved art, Claude wires it in game
(crowd atlas first), soaks it and reports problems back through `docs/TASKS.md`.

**Phase 4: redo and fill.** Rejected items return to the queue as `-rN` batches. When free batches run
low (fewer than about 2 per worker), the lead asks for new roster groups or slots so nobody idles.

## Parallel production model

```
rosters (art/crowd/roster/*.json) + art/queue/sources.json
        |
        v
npm run queue -- build  ------------------------------->  art/queue/batches.json
                                                                  |
   Codex workers w01..wNN (many, in parallel)                     |  claim (atomic, one owner)
   generate -> save <name>_vNN.png -> self-QA -> done  <----------+
        |
        v
art/<area>/raw/*_vNN.png
        |
        v
Codex lead: npm run sprites <area>  ->  contact sheets (crowd) + public/<area>/
        |
        v
art/REVIEW.md batch row  ->  user: "approve <batch>" or "redo <batch>: id1, id2"
        |                                   |
        v                                   v
lead: TRACKER + manifest,          lead: move to _rejected/,
commit art/** + public/**          npm run queue -- reopen <batch> --items ...

Claude, in parallel the whole time: queue tool, packer world modes, engine loaders,
integration fixes from docs/TASKS.md
```

### Who writes what

Many agents write into one working copy at the same time. File ownership is what keeps them from
overwriting each other.

| who | writes | never touches |
|---|---|---|
| **Codex worker** | only the output files of the batch it holds (the exact paths `claim` printed); its claim, through the CLI only | shared files (`REVIEW.md`, `TRACKER.md`, `manifest.json`, rosters, `art/queue/*.json`), `public/`, `src/`, `tools/`, `docs/`, root docs; never runs `git add` / `git commit` |
| **Codex lead** | shared art files (`REVIEW.md`, `TRACKER.md`, `manifest.json`, rosters, `art/queue/sources.json`), packer outputs (`art/crowd/contact/`, `public/{crowd,stage,npc,ui,vfx,characters}/`), moves to `_rejected/`, rows for Claude in `docs/TASKS.md`; commits `art/**` and those `public/` folders with explicit paths | `src/`, `tools/`, the rest of `docs/`, root docs (`CHANGELOG.md` included) |
| **Claude** | `src/`, `tools/`, `docs/`, root docs, ADRs; commits only the paths it changed | generated images, review statuses, rosters (unless asked to add groups) |
| **the user** | decisions: approve / redo in chat or in the `REVIEW.md` status cell; roster wishes | - |

Commit rules: the lead commits only `art/**` and `public/{crowd,stage,npc,ui,vfx,characters}/**`, always
with explicit paths (never `git add -A` or `git add .`), with conventional messages such as
`art(crowd): add crowd-dragon-ball-01 v01 (10 spectators)`. Claude commits only `src/`, `tools/`,
`docs/` and root docs. Both retry when git reports `index.lock` (another session is committing). Details:
[queue/README.md](queue/README.md#commits-lead-only).

### Handoffs between Codex and Claude

- Codex -> Claude: a row in `docs/TASKS.md` (owner Claude, one-line problem, the batch or file, the
  console line). Typical: a packer mode fails, an atlas looks wrong in game, a new slot or NPC animation
  needs engine support.
- Claude -> Codex: new or changed sources (roster groups, `art/queue/sources.json`, briefs), noted in
  `docs/TASKS.md`; the lead runs `npm run queue -- build` to pick them up.
- Neither side waits on the other: art accumulates as raw files, code lands behind fallbacks.

## How the user reviews at scale

Five hundred spectators cannot be reviewed one image at a time, so review happens **per batch**.

- **Crowd: one contact sheet per batch.** The packer builds `art/crowd/contact/<batch>.png`: the
  batch's 10 spectators side by side, each with its 3 poses and its id. One glance answers: on style,
  on model, all different from each other, poses readable?
- **One `REVIEW.md` row per batch** (newest first): date, area (`crowd`), the batch id with its id range,
  a link to the contact sheet, the version(s), the status, what changed, QA notes. Stage slots, NPCs, UI
  images and effects keep one row per batch as well (an NPC row links its model sheet and strips).
- **Reply in chat** (or edit the status cell in `REVIEW.md`):

| you say | what happens |
|---|---|
| `approve crowd-dragon-ball-01` | row `approved`; TRACKER and manifest updated |
| `approve crowd-dragon-ball-01 to crowd-dragon-ball-05` or `approve all waiting crowd batches` | same for every batch listed |
| `redo crowd-dragon-ball-01: db-003 (hair too short), db-007 (looks chibi)` | the rest of the batch is approved; the lead moves those files to `_rejected/` and reopens just those ids as `crowd-dragon-ball-01-r1`, with your reasons as the note; the redo comes back as a new row |
| `reject crowd-dragon-ball-01: whole style is off` | every file of the batch moves to `_rejected/`; the whole batch is reopened |

- **Cadence.** The lead collects finished batches and pings you with the list (for example every five
  batches or every hour) instead of after each one. Production does not stop while batches wait, so
  review is never the bottleneck. Silence is not approval: unreviewed batches stay `needs review`.
- **The lead pre-filters.** Obvious failures (wrong pose count, text in the image, magenta fringe,
  cropped feet) are rejected and reopened by the lead before they reach you.
- **In game.** Stage slots are judged in place (a tile can look fine alone and wrong on the ring), so
  their rows include an in-game screenshot once Claude's stage loader is in. The crowd atlas is checked in
  game once the crowd loader lands.

## Copyright: cameos

- Cameos are **fan art of copyrighted characters**. That is fine for this private fan project. They
  must be **removed or replaced** (an originals-only build, the `cameos: false` flag in ADR 0008) before
  any public or commercial release, unless the rights are licensed. Cameo art is a release blocker for any
  public build.
- Every cameo roster entry has a name-free **`fallbackLook`**: when the generator refuses a name or
  drifts, the prompt switches to the trait description. Originals (`"kind": "original"`) never need one.
- **Never name a living artist's style**, and never ask for "the style of" a studio.
- **No real people**: no celebrities, athletes, streamers or politicians in the stands, cameo or not.
- Official pictures, if the user collects any for comparison, stay local in a `reference/source/`
  folder (git-ignored), are never committed and are never used as a style source.
- Spectators' signs, flags and clothes carry no real words, logos or brand marks.

## Folder map

```
art/
  WORLD_ART.md            this file: entry point for all non-fighter art
  queue/                  claim queue (protocol: queue/README.md; tool: tools/queue.mjs)
    README.md  sources.json  batches.json  extra.json  STATUS.md  claims/  claims/_history/
  crowd/                  576 spectators (43 roster groups)
    README.md  STYLE.md  PROMPTS.md  roster/<group>.json
    raw/<id>_vNN.png  raw/_rejected/  frames/  contact/<batch>.png
  stage/                  stage set (30 slots)
    README.md  ASSETS.md  PROMPTS.md
    raw/<slot>_vNN.png  raw/_fit/<slot>_vNN.png  raw/_fit/<slot>_vNN_2x2.png  raw/_rejected/  final/<slot>.png
  npc/                    announcer, monk-a, monk-b, vendor
    README.md
    <id>/CHARACTER.md  <id>/ANIMATIONS.md  <id>/PROMPTS.md
    <id>/reference/model_sheet_vNN.png  <id>/reference/model_sheet.png  <id>/reference/idle_approved.png  <id>/reference/_rejected/
    <id>/raw/<anim>_vNN.png  <id>/raw/_rejected/  <id>/frames/<anim>/<anim>_NN.png
  ui/                     logo, key art, backgrounds, HUD pieces (README.md, PROMPTS.md, raw/, final/)
  vfx/                    effects (README.md, EFFECTS.md, PROMPTS.md, raw/, frames/)

public/                   packer outputs only (never hand-edited)
  crowd/atlas.png  crowd/atlas.json
  stage/<slot>.png  stage/manifest.json
  npc/<id>/sheet.png  npc/<id>/anims.json
  vfx/atlas.png  vfx/atlas.json
```

Shared status files stay where they are: [REVIEW.md](REVIEW.md) (review queue), [TRACKER.md](TRACKER.md)
and [manifest.json](manifest.json), all edited only by the Codex lead.
