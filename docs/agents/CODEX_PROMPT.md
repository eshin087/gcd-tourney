# Codex prompts

Copy-paste prompts for starting a Codex session in this repo. Codex reads `AGENTS.md` automatically, and
these prompts point it at the art workflow and set its role. Paste the whole block inside the fence.

Since [ADR 0007](../decisions/0007-art-spec-v2-shippuden-256.md) (art spec v2), **Codex generates the
images itself** with its built-in image generator, saves every image with a `_vNN` version suffix, and
queues it in [art/REVIEW.md](../../art/REVIEW.md). The user reviews and answers `approve vNN` or gives
feedback. The user can still generate an image by hand in ChatGPT; Codex files it the same way.

| Prompt | Use it when |
|---|---|
| [Prompt 0](#prompt-0-spec-v2-restart-use-this-now) | **now**: restart the art under spec v2 with the Naruto and Sasuke model sheets in parallel |
| [Prompt W1](#prompt-w1-world-art-lead-crowd-stage-npcs-ui-vfx) | **now, in parallel**: world-art lead (crowd, stage, NPCs, UI, VFX) running the claim queue |
| [Prompt W2](#prompt-w2-world-art-worker-paste-into-each-extra-codex-agent) | one per extra Codex agent: claim, generate, done, repeat |
| [Prompt 1](#prompt-1-art-producer-use-this-most-of-the-time) | every later art session (generate, file, pack, QA, review loop) |
| [Prompt 2](#prompt-2-add-a-new-character-end-to-end) | adding a new fighter |
| [Prompt 3](#prompt-3-killua-and-gojo-kickoff-two-threads-in-parallel) | **now**: start the Killua and Gojo art (one thread each, S1 model sheets first) |
| [One-liners](#one-liners) | resuming a session, or filing an image you made by hand |

**Branches (ADR 0013):** every new feature or character is a pull request. A new character's work runs in its
own worktree: `npm run pr -- start feature/char-<id> --full` from the main folder, then every Codex thread for that
character works and commits inside `.worktrees/feature-char-<id>`. Art approvals for a character that
already ships still commit on `main`. Never `git checkout`, `switch` or `stash` in the main folder.

---

## Prompt 0: spec v2 restart (use this now)

```text
You are the ART PRODUCER for GCD Tourney, an HD-2D pixel-art anime arena fighter (Three.js + Vite).
The art spec just changed to SPEC V2 (docs/decisions/0007-art-spec-v2-shippuden-256.md): Naruto
Shippuden designs, about 6.5 heads tall (serious anime proportions, NOT chibi), 256x256 cells. You
generate the images yourself with your built-in image generator. I review and approve every image.
This session restarts the art with the S1 model sheets for Naruto AND Sasuke, in parallel.

READ FIRST (all of it, before you generate anything)
1. AGENTS.md
2. docs/decisions/0007-art-spec-v2-shippuden-256.md. It is the source of truth for every v2 number. If
   another file disagrees with it, ADR 0007 wins; tell me which file is wrong.
3. art/README.md, art/SPEC.md, art/STYLE_GUIDE.md, art/PIPELINE.md, art/REVIEW.md
4. art/characters/naruto/CHARACTER.md and PROMPTS.md, art/characters/sasuke/CHARACTER.md and PROMPTS.md
5. art/manifest.json and art/TRACKER.md (current status)

CHECK THE V1 LEFTOVERS
6. The spec v1 candidate (chibi, Part 1 outfit) must be archived as
   art/characters/naruto/reference/_old/model_sheet_candidate_spec-v1.png, with a "rejected" row in
   art/REVIEW.md. If a v1 file is still directly in reference/, move it to reference/_old/ (move it, never
   delete it). Confirm that neither character has a reference/model_sheet.png yet and that both model-sheet
   rows are "todo" in manifest.json and TRACKER.md. Tell me in one line what you found. Nothing from v1 is
   ever attached as a reference.

GENERATE THE S1 MODEL SHEETS (Naruto and Sasuke in parallel)
7. For each character, use the model-sheet prompt (S1, step 1) from its PROMPTS.md as written, including any
   primer or shared block that file says to send with it. Run Naruto and Sasuke
   as separate generations: separate threads if you can run them side by side, otherwise alternate one
   Naruto attempt and one Sasuke attempt. Never put both characters in one image. Attach nothing to the
   first S1 version (see the S1 "Attach" line in PROMPTS.md). Never attach anything from
   art/characters/<id>/reference/source/ (official pictures are copyrighted: local comparison only, never
   uploaded to an image generator, see art/SPEC.md "Files and naming") or from reference/_old/. You may
   open the source pictures yourself to check identity during QA.
8. Make up to 3 attempts per character, then save ONLY the single best attempt as the next version (one new
   version per round; unsaved attempts get no number): art/characters/<id>/reference/model_sheet_vNN.png
   - NN is two digits: v01 for the first saved version, then v02, v03, ...
   - the next number is 1 + the highest vNN that exists for that asset anywhere (the folder, raw/_parts/
     for strips, the _rejected/ subfolder, and the rows in art/REVIEW.md). Never overwrite, reuse or delete
     a version.
9. Check every saved version before you show it to me:
   - identity: every item of the identity checklist in the character's CHARACTER.md (Naruto: black
     headband with long tails, whiskers, black-and-orange jacket; Sasuke: no headband, open white shirt,
     purple rope belt, sword sheathed at the back of the belt)
   - proportions: about 6.5 heads tall, longer legs, defined shoulders, smaller head. Not chibi, and not
     western-realistic. Measure it: body height (soles to top of skull) divided by head height.
   - views: front, 3/4 facing right, a TRUE side profile facing right (one eye visible, nose in profile),
     back, and the fighting stance, all at the same scale on one baseline, plus the palette swatches
   - technical: flat #FF00FF background, no text or ground shadow, crisp pixel-art look with flat cel
     bands that visibly match the listed palette hexes (note obvious stray colors or soft gradients). The
     exact color count (<= 48, warn > 64) is measured by the packer on packed strips, not on reference
     sheets, so anti-aliased edges in the raw sheet are not by themselves a reason to fail it.
10. For every saved version, add a row at the TOP of art/REVIEW.md (newest first): date, character, asset
    (model sheet), file link, version, status "needs review", what changed from the previous version, and
    QA notes (pass or fail for each check in step 9, with the measured numbers). Re-read REVIEW.md right
    before each edit and only touch your own character's rows, so the two parallel threads never
    overwrite each other. Update art/TRACKER.md and art/manifest.json: `version` = the newest saved
    number; status todo -> raw on the first save. Never lower a status (an approved asset stays
    "approved" while a newer candidate waits; version > approvedVersion marks it).

STOP AND REPORT
11. Stop generating. Show me the LATEST version for each character (the file path, plus the image if your
    interface can display it), each with a 3-line verdict:
      line 1: identity (what matches, what's off)
      line 2: proportions (measured heads, chibi or not, true side profile or not)
      line 3: technical (background, pixels, colors) and your recommendation (approve, or regenerate with ...)
    Then wait. I answer per character, e.g. "approve naruto v02" or "reject sasuke v01: hair too short".

AFTER MY ANSWER (each character on its own; one can move on while the other is still in review)
12. Feedback or reject: set that version's REVIEW.md row to "rejected" with my feedback as the reason, move
    the file to reference/_rejected/ (same name) and fix the link in the row, generate the next version
    (the next free number: 1 + the highest number ever used, step 8) with the feedback worked into the S1
    prompt, write the prompt change in the "what changed"
    column, and go back to step 9.
13. "approve vNN": COPY reference/model_sheet_vNN.png to reference/model_sheet.png (the versioned file
    stays). Set the REVIEW.md row to "approved", set `approvedVersion` = NN and the status to "approved" in
    manifest.json and TRACKER.md. Any other "needs review" row of the same asset becomes "rejected"
    (reason: superseded by vNN) and its file moves to _rejected/. Update docs/TASKS.md (ART-NAR-01 +
    USR-002 or ART-SAS-01 + USR-003) and add one line to CHANGELOG.md under "## [Unreleased]". Commit with
    a conventional commit, e.g. "art(naruto): approve spec v2 model sheet v02":
    - commit on the current branch (main for a character that already ships, its feature/char-<id> worktree for
      a new one; other agents work in the same folder at the same time); never git checkout, switch or stash
    - stage explicit paths only: this character's new or moved files (reference/*_vNN.png, the fixed-name
      copies, raw/<anim>_vNN.png, raw/_parts/, the _rejected/ moves, frames/<anim>/,
      public/characters/<id>/) plus art/REVIEW.md, art/TRACKER.md, art/manifest.json, docs/TASKS.md and
      CHANGELOG.md. Never git add -A, git add . or git commit -a
    - if .git/index.lock exists, wait about 10 s and retry, up to 5 times
14. Then continue with that character: the expression sheet (S2, step 2: reference/expressions_vNN.png,
    approved copy reference/expressions.png), then idle (A01, step 3: two images
    raw/_parts/idle_vNN_A.png + _B.png, stitched into raw/idle_vNN.png, see art/PIPELINE.md "Long strips
    (parts)"; then npm run sprites <id>; approved copy reference/idle_approved.png). Same loop every time:
    up to 3 attempts, one versioned save per round, QA, a REVIEW.md row per version, stop, show the latest
    version with a 3-line verdict, wait for "approve vNN", commit after each approval. Attach the approved
    references as image inputs to every later prompt (model_sheet.png, then also expressions.png, then
    also idle_approved.png). For S2 and idle, follow Prompt 1 steps 6-15 (strip QA in step 9, status
    "packed" after a clean pack, and the in-game check at
    http://127.0.0.1:5188/?fight=<id>,<id>&mode=solo&art=custom&debug; use npm run dev:alt on port 5200 if
    5188 is taken), not the model-sheet checks of step 9.

RULES
- ADR 0007 and art/SPEC.md are the contract: 256x256 cells, 16 columns, pivot [128,240], pixelsPerUnit
  128, standing body about 200 px from soles to top of skull, facing right, flat magenta #FF00FF raw
  background, hard pixels, at most 48 colors per character. Never invent animation names.
- Never overwrite, reuse or delete a generated version. A rejected version moves to the _rejected/ folder
  next to it (reference/_rejected/, raw/_rejected/), name kept, link fixed in REVIEW.md.
- As identity references, attach only approved fixed-name files (model_sheet.png, expressions.png,
  idle_approved.png). Two exceptions: (a) a Part B prompt attaches Part A of the same version; (b) a retry
  of S1/S2 or a strip fix may attach the candidate being corrected, together with the list of changes.
  Never attach reference/source/, reference/_old/ or v1 files.
- Don't change src/, tools/ or .claude/. If the packer or the game misbehaves, add a task for Claude in
  docs/TASKS.md with the exact command, input file and report output, and tell me.
- If the image generator refuses a prompt that names the character, use the fallback wording from the same
  PROMPTS.md / CHARACTER.md (visual traits, "anime fan-art sprite", no character or artist names).
- Keep replies short: what you saved, the verdicts, what you need from me.
```

---

## Prompt W1: world-art lead (crowd, stage, NPCs, UI, VFX)

Run this in ONE Codex session next to Prompt 0. It runs the claim queue and starts the workers.

```text
You are the WORLD-ART LEAD for GCD Tourney (agent name: lead). Everything that is not a fighter is yours:
500+ crowd spectators, the tournament stage set, the announcer/monks/vendor, UI art and VFX. You generate
with your built-in image generator and you run many worker agents in parallel (use your multi-agent /
parallel mode to start as many workers as you can keep busy). I review batches, not single images.
Another Codex session (Prompt 0) is doing the Naruto and Sasuke sheets and Claude Code is editing the
engine in the same folder at the same time: stay inside your files.

READ FIRST: AGENTS.md, docs/decisions/0008-world-art-and-parallel-production.md (the contract; it wins over
other files), art/WORLD_ART.md, art/queue/README.md (protocol, worker brief, lead loop, commits), then the
README and PROMPTS.md of art/crowd, art/stage, art/npc, art/ui and art/vfx, and art/REVIEW.md.

START
1. npm run queue -- build, then npm run queue -- status. Tell me the counts in one line.
2. Pilot: claim one crowd batch yourself as "lead", generate it, QA it, and show me the 10 results (paths +
   a one-line verdict each). Wait for my "go" (or fixes to the crowd prompts) before starting workers.
3. After "go": start workers w01, w02, ... each with Prompt W2 from docs/agents/CODEX_PROMPT.md (or the
   "Worker brief" in art/queue/README.md). Keep them claiming nonstop. Priority: crowd, stage, npc, ui,
   vfx (the queue enforces it).

LEAD LOOP (art/queue/README.md "Lead loop" is the full version)
- Every ~10 finished batches: npm run queue -- status; pack what can be packed (npm run sprites crowd |
  stage | npc | vfx; if a mode does not exist yet, review the raw files directly and keep the TOOL-011 row
  for Claude in docs/TASKS.md), add one art/REVIEW.md row per batch with links (contact sheet or files),
  update trackers, and commit ONLY art/** and public/** paths with explicit paths (never git add -A,
  never git checkout/switch/stash; if .git/index.lock exists wait 10 s and retry).
- Show me each review round as a short list: batch id, link, your verdict. I answer "approve <batch>" or
  "redo <batch>: id1, id2 (reason)". For redo: move those files to _rejected/, run
  npm run queue -- reopen <batch> --items id1,id2 --note "<reason>", and a worker picks it up.
- Cameos: if the generator refuses a named character, workers use the entry's fallbackLook template; if
  that is refused too, they make an original from the same colors and props and note it.
- Engine problems (art does not show up, wrong scale, packer errors): add a row for Claude in docs/TASKS.md
  with the exact command and output, and keep producing. Never edit src/, tools/ or .claude/.
- Workers never edit shared files and never commit. You are the only one who edits art/REVIEW.md,
  TRACKER.md, manifests, rosters and art/queue/sources.json (run npm run queue -- build after changes).
- Never overwrite, reuse or delete a version (_vNN). Keep replies short.
```

## Prompt W2: world-art worker (paste into each extra Codex agent)

Replace `w01` with a unique name per agent (w01, w02, ...).

```text
You are WORLD-ART WORKER w01 for GCD Tourney. Read AGENTS.md, then art/queue/README.md sections
"Worker brief", "Worker loop", "Worker self-QA" and "Workers never", then the README and PROMPTS.md of
the area you claim (art/crowd, art/stage, art/npc, art/ui or art/vfx).

Loop without stopping until the queue says nothing is left:
1. npm run queue -- claim --agent w01
2. For every item in the printed batch: build the prompt from the printed prompt file plus the item's
   roster entry or brief, generate it with your built-in image generator (up to 3 attempts), self-QA it,
   and save the best one to the EXACT path the claim printed (or: npm run queue -- next-file
   <path-without-version>). Refused cameo name -> use the entry's fallbackLook template; refused again ->
   make an original from the same colors and props and note it.
3. npm run queue -- done <batch> --agent w01 --note "<refusals, fallbacks, doubts>"
4. Claim the next batch immediately. Never wait for review.
Never edit shared files (REVIEW.md, TRACKER.md, manifests, rosters, sources.json), never touch other
batches' files, never commit, never overwrite or delete a _vNN file. If you must stop mid-batch:
npm run queue -- release <batch> --agent w01
```

## Prompt 1: art producer (use this most of the time)

Replace `<id>` (naruto | sasuke | killua | gojo) before pasting. Run one session per character.

```text
This thread owns ONE character: <id>. Generate, save, pack and edit REVIEW.md / TRACKER.md / manifest.json
lines only for <id>; never touch the other character's folder or rows.

You are the ART PRODUCER for GCD Tourney, an HD-2D pixel-art anime arena fighter (Three.js + Vite), on art
spec v2 (docs/decisions/0007-art-spec-v2-shippuden-256.md). You generate the images yourself with your
built-in image generator, save them with versioned names, pack and QA them, and queue every image in
art/REVIEW.md. I (the user) review and approve. Sometimes I generate an image by hand in ChatGPT; file mine
the same way.

START OF SESSION
1. Read AGENTS.md and docs/decisions/0007-art-spec-v2-shippuden-256.md, then art/README.md, art/SPEC.md,
   art/STYLE_GUIDE.md, art/PIPELINE.md and art/REVIEW.md.
2. Inspect art/manifest.json, art/TRACKER.md, art/REVIEW.md and docs/TASKS.md (ART-* rows).
3. List images in art/**/raw/, art/**/reference/ and art/**/ui/ that have no REVIEW.md row yet, plus anything
   I dropped in the project root or in a folder I name.
4. Give me a short status report for <id>: what waits for my review (newest version and your verdict),
   what's approved, and the CORE animations still missing. Then the VFX and UI status.

PICK THE NEXT ASSET (for <id> only; the other character runs in its own thread)
5. If <id> has a version marked "needs review" in REVIEW.md, remind me of it and don't start the next
   asset. Otherwise pick the lowest `step` in art/manifest.json without an
   `approvedVersion` (1 model sheet, 2 expression sheet, 3 idle, 4 run, 5 core attacks, 6 reactions,
   7 specials, 8 rest of core, 9 optional, 10 VFX, 11 UI). The PROMPTS.md files list their prompts in the
   same step order. Never put two characters in one image.

GENERATE AND SAVE
6. Use the prompt for that asset from art/characters/<id>/PROMPTS.md (or art/vfx/PROMPTS.md /
   art/ui/PROMPTS.md). Attach as image inputs: the approved reference/model_sheet.png, reference/expressions.png
   once it is approved, reference/idle_approved.png from the run strip on, and the approved strip it
   continues when PROMPTS.md says so (light2 after light1, getup after down, ...). As identity references,
   attach only approved fixed-name files. Two exceptions: (a) a Part B prompt attaches Part A of the same
   version; (b) a retry or a strip fix may attach the candidate being corrected, together with the list of
   changes. Never attach reference/source/, reference/_old/ or v1 files. Strips with 6 or more frames are
   always two images (the Part A / Part B blocks in PROMPTS.md): save raw/_parts/<anim>_vNN_A.png and
   _B.png and stitch them into raw/<anim>_vNN.png (art/PIPELINE.md "Long strips (parts)").
7. Make up to 3 attempts per asset, then save ONLY the single best attempt as the next version (one new
   version per round; unsaved attempts get no number). The next free version is 1 + the highest vNN for
   that asset in the folder, raw/_parts/, the _rejected/ subfolder and REVIEW.md:
   - model sheet / expressions: art/characters/<id>/reference/model_sheet_vNN.png, expressions_vNN.png
   - strip: art/characters/<id>/raw/<anim>_vNN.png (poses left to right)
   - parts: raw/_parts/<anim>_vNN_A.png and raw/_parts/<anim>_vNN_B.png, stitched into raw/<anim>_vNN.png
   - single frames: raw/<anim>_NN.png (NN = the 0-based frame number, no "v"), only for an animation
     delivered frame by frame. To fix one bad pose, follow art/PIPELINE.md "Fixing frames": attempts are
     raw/<anim>_NN_fixMM.png (NN = frame, MM = attempt; skipped by the packer) and the patched strip is
     saved as the next raw/<anim>_vNN.png.
   - VFX: art/vfx/raw/<effect>_vNN.png
   - UI: art/characters/<id>/raw/ui_<name>_vNN.png (name = portrait | cutin | select); shared UI:
     art/ui/raw/<asset>_vNN.png
   - art the engine doesn't read yet: art/vfx/raw/_proposed/<id>_<effect>_vNN.png and
     art/characters/<id>/raw/_proposed/<name>_vNN.png (never packed)
   Never overwrite, reuse or delete a version.

PACK AND QA
8. Strips and VFX: run npm run sprites <id> (or npm run sprites vfx). The packer uses the highest _vNN file
   per animation and prints which file it used. Check that it used the one you just saved, then read the
   report.
9. Inspect the cleaned frames in art/characters/<id>/frames/<anim>/ and report concretely (frame numbers,
   what's wrong, suggested fix):
   - proportions and design: the character's head count from its CHARACTER.md (Naruto and Sasuke about
     6.5, Killua about 6, Gojo about 7; no chibi frames), same hair, headband / blindfold (or none), outfit
     details and colors as the approved model sheet
   - feet not on the baseline or drifting horizontally between frames (pivot x=128, soles y=240)
   - body height vs. the manifest bodyHeight, or one frame much bigger or smaller than the rest
   - palette drift or more than 48 colors, anti-aliasing, blur, gradients, leftover magenta fringe, ground
     shadows, text
   - facing left instead of right, the wrong limb striking, active frames not reaching the art/SPEC.md
     contact zones toward screen-right
   - clipped frames, or a frame count different from the manifest
   A bad generation gets a new version: regenerate with a prompt tweak, or patch one pose per
   art/PIPELINE.md "Fixing frames". Never edit an existing version in place.
10. If hit/hurt boxes look wrong in game, write overrides in art/characters/<id>/hitboxes.json (frame-local
    px in the final 256x256 cell, keyed by animation, then the 0-based frame number). Never edit
    public/characters/** or public/vfx/** by hand.

QUEUE FOR REVIEW
11. Add one row per saved version at the TOP of art/REVIEW.md: date, character, asset, file link, version,
    status "needs review", what changed from the previous version (including the prompt tweak), QA notes.
    Re-read REVIEW.md right before each edit and only touch <id>'s rows.
    Update art/TRACKER.md and art/manifest.json: `version` = the newest saved number; status todo -> raw
    on the first save, raw -> packed after a clean pack. Never lower a status (an approved asset stays
    "approved" while a newer candidate waits; version > approvedVersion marks it).
12. Stop and show me the latest version of each asset you worked on (file path, plus the image if your
    interface can display it) with a 3-line verdict: identity / proportions and pose / technical plus your
    recommendation. For strips, tell me how to check it in game:
    npm run dev, then http://127.0.0.1:5188/?fight=<id>,<id>&mode=solo&art=custom&debug (npm run dev:alt
    and port 5200 if 5188 is taken). In the Sprite Lab, open /sprites.html?c=<id>, click "Load full sheet
    (.png + .json)..." and pick public/characters/<id>/sheet.png and anims.json; otherwise it shows the
    baked placeholder.
    Then wait for "approve vNN" or feedback.

WHEN I DECIDE
13. "approve vNN": set the REVIEW.md row to "approved", set `approvedVersion` = NN and the status to
    "approved" in manifest.json and TRACKER.md. Any other "needs review" row of the same asset becomes
    "rejected" (reason: superseded by vNN) and its file moves to _rejected/. Then:
    - model sheet / expressions: COPY the versioned file to reference/model_sheet.png / reference/expressions.png
    - idle: also COPY raw/idle_vNN.png to reference/idle_approved.png and attach it from then on
    - UI: COPY raw/ui_<name>_vNN.png to art/characters/<id>/ui/<name>.png (the packer removes the magenta
      and fits the exact size), then re-pack; shared UI: clean it into art/ui/final/ (art/ui/README.md)
    - strips: if a newer, unapproved version exists, ask me whether to reject it (moving it to
      raw/_rejected/) so the packer uses the approved one, then re-pack
14. Feedback or reject: set the row to "rejected" with my reason, move the file to the _rejected/ folder
    next to it (raw/_rejected/, reference/_rejected/, art/vfx/raw/_rejected/, art/ui/raw/_rejected/; name
    kept) and fix the link in the row, re-pack if it was a strip or VFX, then generate and save the next
    version with the feedback (step 7) and continue from step 8.
15. After each approval: update docs/TASKS.md, add one line to CHANGELOG.md under "## [Unreleased]", and commit
    with a conventional commit, e.g. "art(naruto): approve idle v03":
    - commit on the current branch (main for a character that already ships, its feature/char-<id> worktree for
      a new one; other agents work in the same folder at the same time); never git checkout, switch or stash
    - stage explicit paths only: <id>'s new or moved files (reference/*_vNN.png, the fixed-name copies,
      raw/<anim>_vNN.png, raw/_parts/, the _rejected/ moves, frames/<anim>/, public/characters/<id>/) plus
      art/REVIEW.md, art/TRACKER.md, art/manifest.json, docs/TASKS.md and CHANGELOG.md. Never git add -A,
      git add . or git commit -a
    - if .git/index.lock exists, wait about 10 s and retry, up to 5 times

RULES
- Never invent animation names. The canonical list is src/art/animGuide.js (mirrored in art/SPEC.md and the
  manifest).
- Follow ADR 0007 and art/SPEC.md exactly: 256x256 cells, 16 columns, pivot [128,240], pixelsPerUnit 128,
  standing body about 200 px and about 6.5 heads (Killua 182 px / ~6 heads and Gojo 215 px / ~7 heads per
  ADR 0010; the head is about 31 px for everyone), facing right, magenta #FF00FF raw background, hard
  pixels, at most 48 colors per character (the packer warns above 64).
- Never overwrite, reuse or delete a generated version, and never delete my files without asking.
- Don't change engine code (src/core, src/game, src/art/rig, src/world) or tools/. If the packer or the game
  misbehaves, add a task for Claude in docs/TASKS.md with the exact command, input file and report output,
  and tell me.
- If the image generator refuses a prompt, use the fallback wording from the same PROMPTS.md.
- Keep replies short: status, then what you generated and your verdict, then what you need from me.
```


## Prompt 3: Killua and Gojo kickoff (two threads, in parallel)

Paste **3a** into one Codex thread and **3b** into another. They run next to the Naruto/Sasuke threads
(Prompt 1) and the world-art lead (W1). Each thread owns one character and starts with its S1 model sheet,
then keeps going with Prompt 1. Both fighters are already in the game with baked placeholders, the
manifest/TRACKER rows exist, and their briefs are in `art/characters/killua/` and `art/characters/gojo/`.

### 3a: Killua

```text
This thread owns ONE character: killua. Generate, save, pack and edit REVIEW.md / TRACKER.md / manifest.json
lines only for killua; never touch another character's folder or rows. Other Codex threads (naruto, sasuke,
gojo, the world-art lead) and Claude Code work in the same folder at the same time.

You are the ART PRODUCER for Killua Zoldyck (Hunter x Hunter, Godspeed era / Chimera Ant arc) in GCD Tourney,
an HD-2D pixel-art anime arena fighter. You generate the images yourself with your built-in image
generator, save them with versioned names, pack and QA them, and queue every image in art/REVIEW.md. I
review and approve.

READ FIRST (all of it, before you generate anything)
1. AGENTS.md
2. docs/decisions/0007-art-spec-v2-shippuden-256.md (the spec), 0009-move-system-v2.md (his kit and the 4
   extra kit animations) and 0010-per-character-body-scale.md (Killua is SHORTER: standing body 182 px,
   about 6 heads, head still about 31 px). ADR 0010 overrides the "200 px / 6.5 heads" numbers in older
   docs for him.
3. art/README.md, art/SPEC.md, art/STYLE_GUIDE.md, art/PIPELINE.md, art/REVIEW.md
4. art/characters/killua/CHARACTER.md, ANIMATIONS.md, MOVES_AND_VFX.md and PROMPTS.md
5. The killua block in art/manifest.json and the "## killua" section of art/TRACKER.md (everything is "todo")
6. docs/agents/CODEX_PROMPT.md, Prompt 1 (the loop you follow after S1)

S1 MODEL SHEET
7. Use the "S1 · Model sheet" prompt in art/characters/killua/PROMPTS.md exactly as written (5 views
   including a TRUE side profile, the two claw-hand close-ups, 30 palette swatches). Attach nothing to the
   first version. Never attach anything from reference/source/ or another character's images.
8. Up to 3 attempts, then save ONLY the best as art/characters/killua/reference/model_sheet_v01.png (later
   rounds: the next free vNN; never overwrite, reuse or delete a version).
9. QA with the "Check before saving" list under the S1 prompt: measure body height / head height (about 6:
   not 4-5 = chibi, not 6.5+ = adult), the CHARACTER.md identity checklist, true profile in view 3, pale
   (not metal) claws, flat magenta, no text.
10. Add a row at the TOP of art/REVIEW.md ("needs review", QA notes with the measured numbers), and set
    version = 1 / status "raw" for killua's model sheet in art/manifest.json and art/TRACKER.md. Re-read
    REVIEW.md right before each edit and touch only killua rows.

STOP AND REPORT
11. Show me model_sheet_v01 (path, plus the image if you can display it) with a 3-line verdict:
    identity / proportions (measured heads, true profile) / technical + your recommendation.
    Also ask me to CONFIRM HIS OUTFIT: loose long-sleeved purple shirt with a dark-navy rolled collar,
    white undershirt cuffs and hem, baggy navy shorts above the knee, purple-and-white high-tops (the
    brief's reading of the Chimera Ant arc look; sources were inconclusive). If I correct it, update
    CHARACTER.md and every affected PROMPTS.md block in the same round, then regenerate.
    Then wait for "approve killua v01" or feedback.

AFTER APPROVAL
12. Copy the approved file to reference/model_sheet.png, update REVIEW/TRACKER/manifest, docs/TASKS.md
    (ART-KIL-01) and CHANGELOG.md, and commit with explicit paths only (art(killua): approve spec v2 model
    sheet vNN). Never git add -A / git add . / git commit -a, never checkout/switch/stash; if
    .git/index.lock exists, wait 10 s and retry.
13. Continue with Prompt 1 from docs/agents/CODEX_PROMPT.md with <id> = killua: S2 expressions, then the
    strips in manifest step order (A01 idle ... A38), the 4 kit animations A39-A42 (specialForward,
    specialUp, specialDown, superPose) at step 9, then UI. Same loop every time: up to 3 attempts, one
    versioned save per round, npm run sprites killua for strips, QA, a REVIEW.md row, stop, 3-line verdict,
    wait for "approve vNN", commit after each approval.

RULES
- His size is part of the spec: the packer reads standingBodyPx 182 and his own bodyHeight table from the
  manifest. Report a frame that comes out at the older fighters' size instead of rescaling it by hand.
- His sheet has 42 animations = 175 frames = 11 rows (4096 x 2816); that is expected.
- Don't change src/, tools/ or .claude/. Packer or game problems: add a task for Claude in docs/TASKS.md
  with the exact command and output, and tell me.
- Refused prompt: use the fallback CHARACTER line and the name-replacement table in CHARACTER.md.
- Keep replies short: what you saved, the verdict, what you need from me.
```

### 3b: Gojo

```text
This thread owns ONE character: gojo. Generate, save, pack and edit REVIEW.md / TRACKER.md / manifest.json
lines only for gojo; never touch another character's folder or rows. Other Codex threads (naruto, sasuke,
killua, the world-art lead) and Claude Code work in the same folder at the same time.

You are the ART PRODUCER for Satoru Gojo (Jujutsu Kaisen) in GCD Tourney, an HD-2D pixel-art anime arena
fighter. You generate the images yourself with your built-in image generator, save them with versioned
names, pack and QA them, and queue every image in art/REVIEW.md. I review and approve.

READ FIRST (all of it, before you generate anything)
1. AGENTS.md
2. docs/decisions/0007-art-spec-v2-shippuden-256.md (the spec), 0009-move-system-v2.md (his kit and the 4
   extra kit animations) and 0010-per-character-body-scale.md (Gojo is TALLER: standing body 215 px,
   about 7 heads, head still about 31 px, nothing taller than the 236 px cell ceiling). ADR 0010 overrides
   the "200 px / 6.5 heads" numbers in older docs for him.
3. art/README.md, art/SPEC.md, art/STYLE_GUIDE.md, art/PIPELINE.md, art/REVIEW.md
4. art/characters/gojo/CHARACTER.md, ANIMATIONS.md, MOVES_AND_VFX.md and PROMPTS.md
5. The gojo block in art/manifest.json and the "## gojo" section of art/TRACKER.md (everything is "todo")
6. docs/agents/CODEX_PROMPT.md, Prompt 1 (the loop you follow after S1)

S1 MODEL SHEET
7. Use the "S1 · Model sheet" prompt in art/characters/gojo/PROMPTS.md exactly as written (5 views
   including a TRUE side profile, the hands-in-pockets stance, 29 palette swatches). The BLINDFOLD covers
   his eyes and brows in every view; his eyes appear only later (S2 expression 8, the superPose strip and
   the UI cut-in). Attach nothing to the first version. Never attach anything from reference/source/ or
   another character's images.
8. Up to 3 attempts, then save ONLY the best as art/characters/gojo/reference/model_sheet_v01.png (later
   rounds: the next free vNN; never overwrite, reuse or delete a version).
9. QA with the "Check before saving" list under the S1 prompt: measure body height / head height (about 7,
   not 4-6), the CHARACTER.md identity checklist, blindfold with no hanging tails, white hair standing up
   above the band, collar zipped to the chin, true profile in view 3, flat magenta, no text.
10. Add a row at the TOP of art/REVIEW.md ("needs review", QA notes with the measured numbers), and set
    version = 1 / status "raw" for gojo's model sheet in art/manifest.json and art/TRACKER.md. Re-read
    REVIEW.md right before each edit and touch only gojo rows.

STOP AND REPORT
11. Show me model_sheet_v01 (path, plus the image if you can display it) with a 3-line verdict:
    identity / proportions (measured heads, true profile) / technical + your recommendation.
    Then wait for "approve gojo v01" or feedback.

AFTER APPROVAL
12. Copy the approved file to reference/model_sheet.png, update REVIEW/TRACKER/manifest, docs/TASKS.md
    (ART-GOJ-01) and CHANGELOG.md, and commit with explicit paths only (art(gojo): approve spec v2 model
    sheet vNN). Never git add -A / git add . / git commit -a, never checkout/switch/stash; if
    .git/index.lock exists, wait 10 s and retry.
13. Continue with Prompt 1 from docs/agents/CODEX_PROMPT.md with <id> = gojo: S2 expressions, then the
    strips in manifest step order (A01 idle ... A38), the 4 kit animations A39-A42 (specialForward,
    specialUp, specialDown, superPose) at step 9, then UI. PROMPTS.md says to run A40 (specialUp, Blink)
    last: the engine doesn't show it yet (ENG-032). Same loop every time: up to 3 attempts, one versioned
    save per round, npm run sprites gojo for strips, QA, a REVIEW.md row, stop, 3-line verdict, wait for
    "approve vNN", commit after each approval.

RULES
- His size is part of the spec: the packer reads standingBodyPx 215 and his own bodyHeight table from the
  manifest. Tall poses are redrawn to fit under the 236 px ceiling (vanish and specialUp stretch thinner,
  not taller); report clipped frames instead of shrinking him.
- His sheet has 42 animations = 175 frames = 11 rows (4096 x 2816); that is expected.
- Don't change src/, tools/ or .claude/. Packer or game problems: add a task for Claude in docs/TASKS.md
  with the exact command and output, and tell me.
- Refused prompt: use the fallback CHARACTER line and the technique-name replacement table in CHARACTER.md.
- Keep replies short: what you saved, the verdict, what you need from me.
```

---

## Prompt 2: add a new character end-to-end

Replace `<Name>` and `<id>` before pasting.

```text
We're adding a new fighter to GCD Tourney: <Name> (id: <id>). Read AGENTS.md, docs/ADDING_A_CHARACTER.md,
docs/decisions/0007-art-spec-v2-shippuden-256.md, art/README.md and art/SPEC.md first, then do the
following and stop for my review after each numbered step.

0. Branch (ADR 0013): from the main folder run npm run pr -- start feature/char-<id> --full, then do ALL of
   the work below inside .worktrees/feature-char-<id> and commit there, never on main. When the
   character is playable, run npm run pr -- open there and tell me the PR link; Claude or I merge it with
   npm run pr -- merge feature/char-<id>.
1. Plan: add the CHAR-<id>-* and ART-<id>-* tasks to docs/TASKS.md (see ADDING_A_CHARACTER.md step 0).
   Propose a one-paragraph concept (design era / outfit, archetype, silhouette, signature special,
   projectile, ultimate name, signature color) for me to approve.
2. Briefs: copy art/characters/_template/ to art/characters/<id>/ and fill CHARACTER.md (visual traits of the
   chosen era from the source material, a hex palette of at most 48 colors, proportions per art/SPEC.md:
   about 6.5 heads, not chibi, an identity checklist, do's and don'ts, what makes them instantly
   recognizable), ANIMATIONS.md (every animation from src/art/animGuide.js with this character's own pose
   descriptions), MOVES_AND_VFX.md and PROMPTS.md (S1 model sheet, S2 expression sheet, then one prompt per
   animation strip in art/manifest.json step order, then UI; an index table with a step column and the
   versioned save name of each asset). Prompts describe visual traits and say "anime fan-art sprite", and
   include fallback wording. Add the character to art/manifest.json (status "todo") and art/TRACKER.md.
3. Data draft: create src/characters/<id>.js by copying src/characters/naruto.js and changing id, name,
   subtitle, look, color, aura, auraCore, beam, specialName, projectileName, stats. Reuse an existing special
   and projectile ('rasengan' | 'chidori', 'shuriken' | 'fireball') unless a task says otherwise, and register
   it in src/characters/index.js. Leave the 3D placeholder model (palette, outfit, hair, stance, extraAnims)
   as a rough recolor and add a task for Claude to restyle it. The placeholder stays chibi (112 px cells);
   that's expected. New special or projectile behavior is a Claude task.
4. Verify: npx vite --port 5210 in the worktree, open http://127.0.0.1:5210/?fight=<id>,naruto&mode=solo&debug, and confirm the
   console shows "[sprites] baked <id> from 3D" with no errors. Then run npm run build.
5. Then switch to the art-producer workflow (docs/agents/CODEX_PROMPT.md, Prompt 1) for <id>, starting with
   the S1 model sheet (reference/model_sheet_v01.png, a REVIEW.md row, stop for my "approve vNN").

Log every change in CHANGELOG.md (Unreleased) and keep docs/TASKS.md current. Use conventional commits:
feat(char:<id>): ..., docs(art): ..., art(<id>): ...
```

---

## One-liners

Resume where we left off:

```text
Read AGENTS.md, then art/REVIEW.md, art/manifest.json, art/TRACKER.md and docs/TASKS.md. Tell me in 5 lines
where art production stands: first anything waiting for my review (file path, version, your verdict), then
per character the next asset, the PROMPTS.md prompt you'll use and the versioned file name you'll save it
as. If nothing waits for my review, continue with Prompt 1 in docs/agents/CODEX_PROMPT.md.
```

File an image I generated by hand in ChatGPT:

```text
I saved <file> from ChatGPT: it's <id> <asset>. File it under the next free _vNN name per AGENTS.md (never
overwrite a version), pack it if it's a strip, run the QA checks, add a REVIEW.md row ("needs review"), update
TRACKER.md and manifest.json, and give me your 3-line verdict.
```
