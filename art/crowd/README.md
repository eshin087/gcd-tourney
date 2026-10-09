# art/crowd/: the tournament crowd

The stands around the ring hold **500+ visibly different anime/manga spectators**: recognizable
**cameos** (famous characters from other series, drawn as spectators in their usual outfits) next to
**animal-headed townsfolkathletesgrandparents, old mastersfamilies, kidsfarmers, villagersidol fansdojo students, masters, wrestlersmonks, priestsninja and samurai cosplayerspunks, delinquents, biker gangsrich patronsrobots, aliensstudentstravelers, touristsfood vendors, workersoriginal** tournament townsfolk (martial artists, monks, families, kids, elders, vendors,
animal-folk, punks, rich patrons, robots...). The goal is the packed, loud, everyone-is-different
stand of the Dragon Ball World Martial Arts Tournament.

Codex generates one image per spectator with its built-in image generator, many agents in parallel,
and the user reviews whole batches on contact sheets.

**Source of truth:** [ADR 0008](../../docs/decisions/0008-world-art-and-parallel-production.md). If
this folder disagrees with it, the ADR wins. Look and taste: [STYLE.md](STYLE.md). Paste-ready
prompts: [PROMPTS.md](PROMPTS.md). Fighter-wide craft rules: [art/STYLE_GUIDE.md](../STYLE_GUIDE.md).

> **Tooling status (2026-10-08).** The queue tool (`npm run queue`), the packer's crowd mode
> (`npm run sprites crowd`) and the engine's atlas loader are being built by Claude in parallel
> (ADR 0008). The commands below are their agreed contract. Until a command exists, the Codex lead
> does that step by hand (assigns batches, reviews raws directly) and nothing else changes.

## Folder layout

```
art/crowd/
  README.md  STYLE.md  PROMPTS.md
  roster/<group>.json        who the spectators are (one file per series or archetype group)
  raw/<id>_vNN.png           generated images: 3 poses per spectator (highest version wins)
  raw/_rejected/             rejected versions (ignored by the packer)
  frames/                    packer output: cleaned 64 x 96 cells per spectator (file names: tools/README.md)
  contact/<batch>.png        packer output: review contact sheet per batch
```

The game never reads `art/`. The packer writes `public/crowd/atlas.png` + `atlas.json`.

## The spec (ADR 0008)

| property | value |
|---|---|
| cell | **64 x 96 px**, transparent |
| frames per spectator | **3: `idle`, `cheer`, `shocked`** (in that order) |
| pivot | **[32, 94]**: feet center on y 94, 2 px empty below |
| view | **front view**, facing the viewer, camera slightly above (~10 degrees). Billboards always face the camera. |
| world scale | crowd ppu **50** (a medium adult is 1.4 world units, a tall one 1.56 = fighter height) |
| colors | **<= 24 per spectator** |
| outline / shading | 1 px dark outline, hard pixels, flat cel shading |
| background (raw) | flat magenta **#FF00FF**; no ground shadow, no text (held signs show simple shapes, no real words) |
| raw image | **one image per spectator**: the 3 poses in one row (idle, cheer, shocked), same scale, feet on one baseline, on a **1536 x 1024** magenta canvas |
| raw file | `art/crowd/raw/<id>_vNN.png` (two-digit version, never overwritten or reused) |

**Poses**

| frame | what | used when |
|---|---|---|
| `idle` | standing, watching the ring, a small personality pose (arms crossed, eating, holding a sign...) | calm moments; alternates with `cheer` |
| `cheer` | excited: arms up, fist pump, waving a flag, shouting. Arms may rise to y 2. | rhythm loop, faster and more often as excitement rises |
| `shocked` | jaw drop, hands on head, leaning back, eyes wide | KOs, ultimates, clashes, big hits |

**Height classes.** Height of the idle frame including hair or hat. The packer scales each
spectator so its idle frame matches its class, so the raw drawing size does not set the final size;
the class does.

| class | idle height (px in the 96 cell) | for | world height |
|---|---|---|---|
| `tiny` | 44 | small kids, small creatures | 0.88 |
| `short` | 58 | short adults, elders, teens | 1.16 |
| `medium` | 70 | average adults | 1.40 |
| `tall` | 78 | tall adults (fighter height) | 1.56 |
| `huge` | 84 | giants, very bulky builds | 1.68 |

`tall` and `huge` spectators cheer with their **arms out to the sides, not straight up**, so the
cheer pose still fits under y 2. Every pose must also fit the 64 px width.

## Rosters

`art/crowd/roster/<group>.json`, one file per series or archetype group, written by separate agents
(parallel writers never share a file). Workers **read** rosters and never edit them; only the Codex
lead changes them.

```json
{
  "group": "dragon-ball", "kind": "cameo", "series": "Dragon Ball / Dragon Ball Z",
  "spectators": [
    { "id": "db-001", "name": "Master Roshi", "heightClass": "short",
      "look": "...", "fallbackLook": "...",
      "idle": "...", "cheer": "...", "shocked": "...", "tags": ["elder", "martial-artist"] }
  ]
}
```

- `id` = `<groupPrefix>-NNN`: lowercase ascii, unique across all groups, and also the raw file name.
- **Cameos** (`"kind": "cameo"`) have `name`, the group's `series`, a `look` and a name-free
  `fallbackLook` for when the generator refuses a name.
- **Originals** (`"kind": "original"`) have a `label` instead of `name`/`series`, and no
  `fallbackLook`.
- `idle`, `cheer`, `shocked` are short pose descriptions; `tags` feed engine variety (kids, elders,
  martial artists...).

**Groups and id prefixes.** The roster folder itself is the authoritative list; this table was
generated from it on 2026-10-08: **43 roster files, 576 spectators (356 cameo, 220 original), 71 crowd
batches** (a group of 6-8 is one partial batch). The id prefix (`db`) names the spectator files; the
`group` (`dragon-ball`) names the batches.

Cameo groups (28 files, 356 spectators):

| prefix | roster file | `group` (batch ids `crowd-<group>-NN`) | series | spectators |
|---|---|---|---|---|
| `aot` | `attack-on-titan.json` | `attack-on-titan` | Attack on Titan | 10 |
| `baki` | `baki.json` | `baki` | Baki the Grappler | 8 |
| `bl` | `bleach.json` | `bleach` | Bleach | 20 |
| `csm` | `chainsaw-man.json` | `chainsaw-man` | Chainsaw Man | 10 |
| `bebop` | `cowboy-bebop.json` | `cowboy-bebop` | Cowboy Bebop | 6 |
| `ds` | `demon-slayer.json` | `demon-slayer` | Demon Slayer: Kimetsu no Yaiba | 15 |
| `db` | `dragon-ball.json` | `dragon-ball` | Dragon Ball / Dragon Ball Z / Dragon Ball Super / Dragon Ball GT | 40 |
| `eva` | `evangelion.json` | `evangelion` | Neon Genesis Evangelion | 6 |
| `fotns` | `fist-of-the-north-star.json` | `fist-of-the-north-star` | Fist of the North Star | 8 |
| `fma` | `fullmetal-alchemist.json` | `fullmetal-alchemist` | Fullmetal Alchemist: Brotherhood | 10 |
| `gin` | `gintama.json` | `gintama` | Gintama | 8 |
| `ippo` | `hajime-no-ippo.json` | `hajime-no-ippo` | Hajime no Ippo | 8 |
| `hxh` | `hunter-x-hunter.json` | `hunter-x-hunter` | Hunter x Hunter | 15 |
| `jojo` | `jojo.json` | `jojo` | JoJo's Bizarre Adventure | 15 |
| `jjk` | `jujutsu-kaisen.json` | `jujutsu-kaisen` | Jujutsu Kaisen | 15 |
| `kengan` | `kengan-ashura.json` | `kengan-ashura` | Kengan Ashura | 6 |
| `ken` | `kenichi.json` | `kenichi` | History's Strongest Disciple Kenichi | 6 |
| `mob` | `mob-psycho-100.json` | `mob-psycho-100` | Mob Psycho 100 | 8 |
| `mha` | `my-hero-academia.json` | `my-hero-academia` | My Hero Academia | 20 |
| `nar` | `naruto.json` | `naruto` | Naruto / Naruto Shippuden / Boruto | 30 |
| `op` | `one-piece.json` | `one-piece` | One Piece | 30 |
| `opm` | `one-punch-man.json` | `one-punch-man` | One Punch Man | 12 |
| `ranma` | `ranma.json` | `ranma` | Ranma 1/2 | 8 |
| `sm` | `sailor-moon.json` | `sailor-moon` | Sailor Moon | 10 |
| `seiya` | `saint-seiya.json` | `saint-seiya` | Saint Seiya | 8 |
| `sd` | `slam-dunk.json` | `slam-dunk` | Slam Dunk | 6 |
| `sxf` | `spy-x-family.json` | `spy-x-family` | Spy x Family | 6 |
| `yyh` | `yu-yu-hakusho.json` | `yu-yu-hakusho` | Yu Yu Hakusho | 12 |

Original groups (15 files, 220 spectators):

| prefix | roster file | `group` (batch ids `crowd-<group>-NN`) | who | spectators |
|---|---|---|---|---|
| `org-af` | `animal-folk.json` | `animal-folk` | animal-headed townsfolk | 20 |
| `org-athl` | `athletes.json` | `athletes` | athletes | 12 |
| `org-el` | `elders.json` | `elders` | grandparents, old masters | 15 |
| `org-fk` | `families-kids.json` | `families-kids` | families, kids | 20 |
| `org-farm` | `farmers-villagers.json` | `farmers-villagers` | farmers, villagers | 13 |
| `org-idol` | `idol-fans.json` | `idol-fans` | idol fans | 13 |
| `org-ma` | `martial-artists.json` | `martial-artists` | dojo students, masters, wrestlers | 20 |
| `org-mp` | `monks-priests.json` | `monks-priests` | monks, priests | 10 |
| `org-cosp` | `ninja-samurai-cosplayers.json` | `ninja-samurai-cosplayers` | ninja and samurai cosplayers | 13 |
| `org-punk` | `punks-delinquents.json` | `punks-delinquents` | punks, delinquents, biker gangs | 15 |
| `org-rich` | `rich-patrons.json` | `rich-patrons` | rich patrons | 14 |
| `org-ra` | `robots-aliens.json` | `robots-aliens` | robots, aliens | 10 |
| `org-stud` | `students.json` | `students` | students | 15 |
| `org-trvl` | `travelers-tourists.json` | `travelers-tourists` | travelers, tourists | 15 |
| `org-vw` | `vendors-workers.json` | `vendors-workers` | food vendors, workers | 15 |

## Parallel production: batches and claims

The unit of work is a **batch of 10 spectators from one roster group** (batch ids such as
`crowd-dragon-ball-01`). `npm run queue -- build` regenerates `art/queue/batches.json` from the rosters.

- **Claim** (atomic, two agents can never get the same batch):
  `npm run queue -- claim --type crowd --agent <name>`. It prints the batch, the prompt file and the
  exact output file names. A claim older than 3 hours without progress becomes claimable again.
- **Finish:** `npm run queue -- done <batch> --agent <name>` checks that the expected files exist,
  then marks the batch `done`. `release` gives a batch back; `status` prints progress and writes
  `art/queue/STATUS.md`.
- **Workers only write their own batch's raw files** (`art/crowd/raw/<id>_vNN.png`). Shared files
  (`art/REVIEW.md`, `art/TRACKER.md`, manifests, rosters) are updated only by the **Codex lead**,
  which also packs, builds contact sheets and commits. **Workers never commit.**

### Worker loop: one spectator at a time

For each id in your claimed batch, in order:

1. **Read the roster entry** (`art/crowd/roster/<group>.json`): `kind`, `name` or `label`, the
   group's `series`, `heightClass`, `look`, `fallbackLook`, `idle`, `cheer`, `shocked`.
2. **Fill the prompt template** from [PROMPTS.md](PROMPTS.md): template A (cameo) or C (original).
   Paste the roster text **verbatim**, and paste the height note for its class from the
   PROMPTS.md table. Don't invent looks; if an entry is unusable, note it for the lead (step 6).
3. **Generate** with the built-in image generator. If the lead has named a style anchor (below),
   attach it as a style reference.
4. **Save** to the **exact path `claim` printed** (`art/crowd/raw/<id>_vNN.png`). If unsure about
   the number, `npm run queue -- next-file art/crowd/raw/<id>` prints it (it counts `raw/_rejected/`
   too). Never overwrite or rename an existing version.
5. **Quick QA** (checklist below, about 30 seconds). If it fails, retry with the retry wording or
   the fix prompt in PROMPTS.md. Discard failed attempts unsaved; only the keeper gets a version.
6. **Next spectator.** Budget: **3 attempts per spectator.** A cameo that is refused or comes out
   off-model goes to template B (fallback). If the third attempt is still weak, save the best one
   and list its id with a one-line reason in your hand-back, so it shows up on the contact sheet for
   a redo. If even the fallback is refused, generate an **original** spectator with the same
   colours, build and props as the `fallbackLook` (no name, no series), save it under the printed
   path and report `<id>: refused, generated as original` (same rule as
   [art/queue/README.md](../queue/README.md#worker-loop) step 7). Every id ends with a saved file.
7. After the last spectator: `npm run queue -- done <batch> --agent <you> --note "..."` (it only
   passes when every expected file exists). The note lists fallbacks used, refusals generated as
   originals and weak ids. If `done` lists missing outputs, save them under the exact names and run
   it again. Never leave a claimed batch open; if you must stop, `release` it.

Keep moving. A spectator is 64 x 96 pixels in the end: good-and-consistent beats perfect.

**Style anchor:** _none yet_. After the first crowd batch is approved, the lead names one approved
raw here (for example `art/crowd/raw/db-001_v01.png`). Workers attach it to every generation as a
**style** reference (outline weight, pixel size, shading), never as a character reference.

### Quick QA checklist (every raw, before saving)

- [ ] **Exactly 3 full-body poses** in one row, left to right: idle, cheer, shocked. One person, no
      extra people or duplicates.
- [ ] **The same person** in all three: same face, hair, outfit, colors, props.
- [ ] **Same scale**: the head is the same size in all three poses.
- [ ] **Feet on one baseline**, planted in the same spot; arms, head and face do the acting. A pose
      line that says "hopping" or "jumping" is drawn as bent knees or tiptoes, soles on the baseline.
- [ ] **Front view** facing the viewer, camera slightly above. Not a side view, not a 3/4 turn.
- [ ] **Flat magenta #FF00FF background**: no floor, no ground shadow, no scenery, no gradient. No
      magenta or hot pink on the spectator.
- [ ] **No text**: no letters, numbers or kanji on clothes or signs, no speech bubbles, no labels; no
      floating symbols (sweat drops, stars, marks); no aura or effects.
- [ ] **Pixel art**: hard edges, a bold dark outline, flat cel shading, no blur or glow, a small
      palette (<= 24 colors; the packer counts exactly).
- [ ] **Recognizable at 64 x 96**: shrink it (or squint) to about 1/8: the silhouette, hair shape and
      2-3 signature colors still say who or what it is, and the three poses read as different.
- [ ] **Height class**: the build matches the class (a `tiny` kid looks like a kid, a `huge` one is
      big); `tall`/`huge` cheer with the arms out to the sides; no pose sticks out far sideways (wide
      flags, outstretched props).
- [ ] **Distinct**: it doesn't look like a palette swap of another spectator in the batch.
- [ ] **Cameos**: the `look` traits are there; if the fallback was used, say so in the hand-back.

## Batch review (contact sheets)

The user reviews **batches, not single images**:

1. The lead runs `npm run sprites crowd`, which packs the atlas and writes one contact sheet per batch
   to `art/crowd/contact/<batch>.png` (each spectator's three cleaned cells next to its id).
2. The lead adds **one `art/REVIEW.md` row per batch** (`needs review`) linking the contact sheet,
   with the ids that workers flagged.
3. The user answers in chat or in REVIEW.md: `approve crowd-dragon-ball-01`, or
   `crowd-dragon-ball-01: redo db-003 (face unreadable), db-007 (not front view)`.
4. The lead records it: approved batches are done; each redo id's raw moves to `raw/_rejected/` and
   the id goes back into the queue. The next attempt is a higher `_vNN`.

## Copyright (cameos)

Cameos are **fan art of copyrighted characters**. That's fine for this private fan project. They
must be removed or replaced with originals (the `cameos: false` build flag in ADR 0008) **before any
public or commercial release**, unless licensed. Prompts describe visual traits and may name the
character and series; they **never name a living artist or ask for a studio's style**. Originals
must not be thinly disguised copies of real characters.

## How the engine uses it

- The packer turns every spectator's highest raw version into three 64 x 96 cells (idle scaled to
  its height class, feet on the pivot, magenta removed) and writes **`public/crowd/atlas.png` +
  `atlas.json`**: 64 cells per row (4096 px wide), each spectator = 3 consecutive cells in one row
  (21 spectators per row; 500 spectators = 24 rows = 2304 px tall, the current 576 = 28 rows = 2688 px).
  `atlas.json` = `{ "cell": [64, 96], "cols": 64, "ppu": 50, "pivot": [32, 94], "frames": ["idle",
  "cheer", "shocked"], "spectators": [{ "id", "cell", "heightClass", "kind", "tags" }] }`.
- In a match, the crowd is one instanced set of camera-facing billboards. Every seat gets a
  **unique spectator**, reshuffled each match; the seat count goes up to about 400, so each match
  shows a different slice of the 500+.
- Spectators flip between `idle` and `cheer` on their own rhythm; the rhythm and the share of cheers
  rise with the match's excitement. **`shocked` plays on KOs, ultimates, clashes and big hits.**
- The crowd is **unlit**: the light painted into the sprite is the only light it gets (it is tinted
  darker during super flashes).
- From the arena camera most spectators appear smaller than 64 x 96 on screen, so silhouette, hair
  shape and big color areas carry the identity.
- **No atlas = procedural crowd.** Until `public/crowd/atlas.png` exists, the game keeps its
  code-painted crowd (28 variants, 24 x 32 px, idle + cheer).
