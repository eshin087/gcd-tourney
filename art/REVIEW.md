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
| 2026-10-08 | naruto | model sheet | [model_sheet_v01.png](characters/naruto/reference/model_sheet_v01.png) | v01 | approved | First numbered v2 version replaces the archived Part 1 direction; best of 3 S1 attempts, retries improved head scale, jaw-length locks and true side profile | Identity FAIL only side-lock shape (too straight rather than spiky); Shippuden outfit, face marks and accessories pass (full [QA](characters/naruto/reference/notes.md)). Proportions PASS approximately:724/106 = 6.8 heads (hidden crown y105 +/-10, chin211 +/-3, soles829), non-chibi. Views PASS:5/5, true one-eye right profile, consistent scale; strict baseline FAIL (lowest sole range827-836, stance feet about22px apart). Technical PASS: crisp pixel look, flat cel bands, no text/shadow/floor; FAIL:36 swatches vs34, order drift, near #F903F9 background with corner variation rather than exact #FF00FF. Raw RGB count/edge AA not used as a failure criterion. User approved v01 on 2026-10-09; documented QA deviations accepted; copied unchanged to model_sheet.png |
| 2026-10-08 | sasuke | model sheet | [model_sheet_v01.png](characters/sasuke/reference/model_sheet_v01.png) | v01 | approved | First v2 version, best of 3 S1 attempts; retries moved the rope bow behind the body, moved the crest onto the collar and improved stance foot alignment | Identity FAIL: shirt V reaches toward waist instead of mid-chest; sword projection varies (other identity checks pass; full [QA](characters/sasuke/reference/notes.md)). Proportions FAIL target, estimate 727/100 = 7.3 heads (hidden crown y102 +/-6, chin202, soles829; roughly 6.9-7.7), clearly non-chibi. Views PASS: 5/5, true one-eye right profile, consistent scale; strict baseline FAIL (sole range823-838, stance826/838). Technical PASS: crisp pixel look, flat cel bands, no text/shadow/floor; FAIL:36 swatches vs34, order drift, background near #FB02FB with corner variation rather than exact #FF00FF. Raw RGB count/edge AA not used as a failure criterion. User approved v01 on 2026-10-09; documented QA deviations accepted; copied unchanged to model_sheet.png |
| 2026-10-08 | naruto | model sheet | [model_sheet_candidate_spec-v1.png](characters/naruto/reference/_old/model_sheet_candidate_spec-v1.png) | spec v1 (unnumbered) | rejected | first spec v1 candidate (Part 1 outfit, ~4.3 heads), made before versioned names existed | chibi proportions; superseded by spec v2 (ADR 0007: Shippuden, ~6.5 heads, 256 px cells). Also off-brief: magenta background not uniform, many colors outside the palette (see `reference/notes.md`). Archived in `reference/_old/`, never used as a reference. Naruto's v2 model sheet starts at v01 |
