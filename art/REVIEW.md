# Art review queue

Every generated image waits here until the user approves or rejects it. One row per candidate,
**newest first**, so the top of the table is always what needs looking at. Rules:
[ADR 0007](../docs/decisions/0007-art-spec-v2-shippuden-256.md) and [SPEC.md](SPEC.md#files-and-naming).
Workflow: [PIPELINE.md](PIPELINE.md). Status per asset: [TRACKER.md](TRACKER.md) +
[manifest.json](manifest.json).

## How it works

1. **Codex generates** an image (or the user generates one in ChatGPT and hands it over) and saves it
   under the next free version name, for example `characters/naruto/reference/model_sheet_v03.png` or
   `characters/sasuke/raw/light1_v02.png`. The next number is 1 + the highest number used for that
   asset anywhere (its folder, `raw/_parts/`, `_rejected/`, and this table). Numbers are never reused.
   Codex makes up to 3 attempts per round and saves only the best one as the next version.
2. **Codex adds a row at the top of the table** with status `needs review`: date, character, asset,
   a link to the file, the version, what changed compared with the previous version, and QA notes
   (pose count, proportions, palette count, packer warnings, contact-zone check). In the same edit it
   sets the asset's `version` in `manifest.json` to that number (and `status` to `raw` if it was
   `todo`), and updates `TRACKER.md`.
3. **The user reviews.** Open the linked file, or check a packed strip in game with `?art=custom` or in
   the Sprite Lab (`/sprites.html?c=<id>`, click "Load full sheet (.png + .json)…" and pick
   `public/characters/<id>/sheet.png` and `anims.json`; otherwise it shows the baked placeholder), and
   decide:
   - reply in chat, for example "approve naruto model_sheet v03" or "reject sasuke light1 v02: fist
     too low", or
   - edit the status cell in this file to `approved` or `rejected` and write the reason in QA notes.
4. **Codex records the decision:**
   - **approved**: set the row to `approved`; set `approvedVersion` in `manifest.json` (and `status`
     `approved`); update `TRACKER.md`. For references, copy the file to its fixed name
     (`reference/model_sheet.png`, `reference/expressions.png`); for `idle`, also copy the strip to
     `reference/idle_approved.png`; for UI, copy it to `ui/<name>.png` (shared UI: clean it into
     `art/ui/final/`). Any other `needs review` row of the same asset becomes `rejected` (reason:
     superseded by vNN) and its file moves to `_rejected/`. Older approved or rejected candidates stay
     where they are.
   - **rejected**: set the row to `rejected` with the reason; move the file into the `_rejected/`
     folder next to it (`raw/_rejected/`, `reference/_rejected/`, `art/vfx/raw/_rejected/`,
     `art/ui/raw/_rejected/`) and fix the link in the row, so the highest version left in the folder
     is always the current candidate. The next attempt is a new, higher version.
5. Keep rows forever: they are the history of the art.

Naruto and Sasuke can be produced in parallel (separate Codex threads). Each thread only adds and
edits rows for its own character. Re-read this file right before editing it and insert new rows at
the top, so two threads do not overwrite each other.

Status values: `needs review` · `approved` · `rejected`.

## Queue

| date | character | asset | file | version | status | what changed | QA notes |
|---|---|---|---|---|---|---|---|
| 2026-10-09 | naruto | expressions | [expressions_v01.png](characters/naruto/reference/expressions_v01.png) | v01 | approved | First S2, best of 2; approved model_sheet.png input; retry narrowed focused eyes, reduced gasp irises and added short far-cheek whiskers | PASS: 9/9 expressions in correct 3x3 order, consistent approved identity and right 3/4 bust scale, no clipping/text/shadows. Three near-cheek whiskers clear; about two far-cheek strokes distinct, third obscured by contour/hair. Technical: crisp cel bands; actual 1254x1254 versus requested 1024x1024, skull-to-chin about 210 +/-24 px versus nominal 124, dominant background #FA03FB rather than exact #FF00FF. Reference only: no packer/game integration. User approved v01 on 2026-10-09 with visibility/size/background caveats; full [QA](characters/naruto/reference/notes.md) |
| 2026-10-09 | sasuke | expressions | [expressions_v01.png](characters/sasuke/reference/expressions_v01.png) | v01 | approved | First S2, exact prompt with approved model_sheet.png; first attempt selected | PASS: 8/8 expressions in correct 4x2 order, right 3/4, consistent mature face, approved hair and white collar; no accidental clipping, text or shadows. Near Sharingan has three wedge-like marks rather than distinct commas; far marks obscured by hair. Technical: crisp cel bands, palette families match; skull-to-chin about 211 +/-15 px versus nominal124, dominant background #FB02FB with corner variation instead of exact #FF00FF. Reference only: no packer/game integration. User approved v01 on 2026-10-09 with documented precision/scale/background caveats; full [QA](characters/sasuke/reference/notes.md) |
| 2026-10-09 | crowd | crowd-animal-folk-01 (org-af-001..010) | [001](crowd/raw/org-af-001_v01.png), [002](crowd/raw/org-af-002_v01.png), [003](crowd/raw/org-af-003_v01.png), [004](crowd/raw/org-af-004_v01.png), [005](crowd/raw/org-af-005_v01.png), [006](crowd/raw/org-af-006_v01.png), [007](crowd/raw/org-af-007_v01.png), [008](crowd/raw/org-af-008_v01.png), [009](crowd/raw/org-af-009_v01.png), [010](crowd/raw/org-af-010_v01.png) | v01 | needs review | Ten original animal-folk spectators from w01: dog businessperson, cat lady, rabbit kid, boar farmer, bird mail carrier, lizard punk, bear lumberjack, pig chef, cow grocer and monkey performer; three poses each | Lead raw visual QA: all ten match their roster roles and keep one identity across three readable front-facing poses; all are 1536x1024. Minor: 001 shocked ears look rabbit-like; 004 remains broad; 005 cheer has loose letters; 008 shock has airborne hat and ladle. Worker reports noisy near-magenta backgrounds and palettes far above 24 colors. `npm run sprites crowd` is unavailable (TOOL-011), so packed 64x96, palette, atlas and in-game QA remain pending. Recommend visual approval with these caveats. |
| 2026-10-09 | crowd | crowd-animal-folk-02 (org-af-011..020) | [011](crowd/raw/org-af-011_v01.png), [012](crowd/raw/org-af-012_v01.png), [013](crowd/raw/org-af-013_v02.png), [014](crowd/raw/org-af-014_v01.png), [015](crowd/raw/org-af-015_v02.png), [016](crowd/raw/org-af-016_v01.png), [017](crowd/raw/org-af-017_v01.png), [018](crowd/raw/org-af-018_v01.png), [019](crowd/raw/org-af-019_v02.png), [020](crowd/raw/org-af-020_v01.png) | v01 except 013, 015, 019 v02 | approved | First 10 original animal-folk spectators, three poses each; v02 gives wolf, tiger and owl clear column gaps after lead QA rejected their v01 spacing | User approved pilot on 2026-10-09. Raw QA: all 1536x1024, three visually distinct poses, 29-235 px gaps, no canvas clipping; 016's dropped cheese and 018's tea extend below feet. Background is near-magenta with small RGB variation, not exact #FF00FF. `npm run sprites crowd` fails: unknown character "crowd" (TOOL-011); packed palette, 64x96 cells, atlas and in-game checks pending. |
| 2026-10-08 | naruto | model sheet | [model_sheet_v01.png](characters/naruto/reference/model_sheet_v01.png) | v01 | approved | First numbered v2 version replaces the archived Part 1 direction; best of 3 S1 attempts, retries improved head scale, jaw-length locks and true side profile | Identity FAIL only side-lock shape (too straight rather than spiky); Shippuden outfit, face marks and accessories pass (full [QA](characters/naruto/reference/notes.md)). Proportions PASS approximately:724/106 = 6.8 heads (hidden crown y105 +/-10, chin211 +/-3, soles829), non-chibi. Views PASS:5/5, true one-eye right profile, consistent scale; strict baseline FAIL (lowest sole range827-836, stance feet about22px apart). Technical PASS: crisp pixel look, flat cel bands, no text/shadow/floor; FAIL:36 swatches vs34, order drift, near #F903F9 background with corner variation rather than exact #FF00FF. Raw RGB count/edge AA not used as a failure criterion. User approved v01 on 2026-10-09; documented QA deviations accepted; copied unchanged to model_sheet.png |
| 2026-10-08 | sasuke | model sheet | [model_sheet_v01.png](characters/sasuke/reference/model_sheet_v01.png) | v01 | approved | First v2 version, best of 3 S1 attempts; retries moved the rope bow behind the body, moved the crest onto the collar and improved stance foot alignment | Identity FAIL: shirt V reaches toward waist instead of mid-chest; sword projection varies (other identity checks pass; full [QA](characters/sasuke/reference/notes.md)). Proportions FAIL target, estimate 727/100 = 7.3 heads (hidden crown y102 +/-6, chin202, soles829; roughly 6.9-7.7), clearly non-chibi. Views PASS: 5/5, true one-eye right profile, consistent scale; strict baseline FAIL (sole range823-838, stance826/838). Technical PASS: crisp pixel look, flat cel bands, no text/shadow/floor; FAIL:36 swatches vs34, order drift, background near #FB02FB with corner variation rather than exact #FF00FF. Raw RGB count/edge AA not used as a failure criterion. User approved v01 on 2026-10-09; documented QA deviations accepted; copied unchanged to model_sheet.png |
| 2026-10-08 | naruto | model sheet | [model_sheet_candidate_spec-v1.png](characters/naruto/reference/_old/model_sheet_candidate_spec-v1.png) | spec v1 (unnumbered) | rejected | first spec v1 candidate (Part 1 outfit, ~4.3 heads), made before versioned names existed | chibi proportions; superseded by spec v2 (ADR 0007: Shippuden, ~6.5 heads, 256 px cells). Also off-brief: magenta background not uniform, many colors outside the palette (see `reference/notes.md`). Archived in `reference/_old/`, never used as a reference. Naruto's v2 model sheet starts at v01 |
