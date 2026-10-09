# Task board

The single list of work in flight, shared by the user, Claude, ChatGPT and Codex. The protocol is in
[AI_COLLABORATION.md](AI_COLLABORATION.md).

**How to use**
- Claim a task by setting **Owner** and **Status** to `in-progress` before starting. One owner per task.
- When you finish, set `review` with a one-line note (what changed, how to verify). The user or the
  reviewing AI sets `done`.
- New work gets a new row with the next id in its area. Keep notes to one line, and link a file or ADR for detail.
- Art tasks track **batches**. Per-asset status lives in [art/TRACKER.md](../art/TRACKER.md) and
  [art/manifest.json](../art/manifest.json).

**Status:** `todo` · `in-progress` · `review` · `done` · `blocked` (put the reason in notes)
**Owners:** `Claude` · `ChatGPT` (images; the user runs the prompts, Codex coordinates) · `Codex` · `User`
**Areas:** `ENG` engine/gameplay · `TOOL` tooling/packer · `DOC` docs/process · `OPS` repo/release ·
`ART-NAR` Naruto art · `ART-SAS` Sasuke art · `ART-VFX` effects · `ART-UI` shared UI art · `USR` user decisions

## Milestone M2: training, input, hit accuracy (v0.3.0)

| ID | Title | Owner | Status | Notes |
|---|---|---|---|---|
| ENG-001 | Training room in the controls menu: the character mirrors the player's input in real time | Claude | in-progress | `Game.startTraining`, `DummyBrain`; dummy modes, health refill, no timer |
| ENG-002 | Controller layout diagrams: keyboard / PlayStation / Xbox, player toggle, auto-detect device | Claude | in-progress | `src/ui/controls.js`, `padKind()` in input.js |
| ENG-003 | Rebind keys and gamepad buttons; persist; reset to defaults | Claude | in-progress | localStorage key `gcd.bindings.v1` |
| ENG-004 | Mute toggle in the top corner of the screen, unobtrusive, in sync with `M` | Claude | in-progress | uses `audio.setMuted` |
| ENG-005 | 2.5D lanes: screen-horizontal facing, attack auto depth-step, same-lane rule, CPU lines up | Claude | in-progress | ADR 0005; `LANE` in game.js |
| ENG-006 | Per-frame hit/hurt boxes from anims.json `boxes` (baked + custom); spark at the contact point | Claude | in-progress | fixes "hit shown but fist not touching body" |
| ENG-007 | Custom sheet loading: `complete` flag, `?art=custom`, portrait/cutin/select PNGs | Claude | in-progress | contract in art/SPEC.md |
| ENG-008 | Custom VFX atlas loading (`public/vfx/atlas.*`) with per-effect procedural fallback | Claude | in-progress | |
| ENG-009 | HD render mode auto-enabled for hi-res sheets | Claude | in-progress | ADR 0002 consequences |
| TOOL-001 | `tools/pack-sprites.mjs` + `npm run sprites [id\|vfx]`: clean, scale, align, auto boxes, overrides, report | Claude | in-progress | ADR 0006 |
| DOC-001 | SDLC docs: CLAUDE.md, AGENTS.md, docs/*, ADRs 0001-0006, CHANGELOG, Codex prompts | Claude | review | check the facts against code after the M2 engine tasks land |
| DOC-002 | Art briefs: art/README, SPEC, STYLE_GUIDE, PIPELINE, TRACKER, manifest, `_template`, Naruto/Sasuke/VFX/UI | Claude | in-progress | |
| OPS-001 | Initialize the local git repo, first commit, verify `.gitignore` (node_modules, dist) | Claude | in-progress | conventional commits from here on |
| USR-001 | Play-test M2 (training room, layouts, rebinding, mute, hit accuracy) and sign off | User | todo | after the ENG tasks reach `review` |

## Milestone M3: hi-res Naruto & Sasuke (v0.4.0)

### Tooling and engine follow-ups

| ID | Title | Owner | Status | Notes |
|---|---|---|---|---|
| ENG-010 | Debug hitbox/hurtbox overlay (toggle in training + `?debug`) | Claude | todo | needed for tuning hitboxes.json |
| ENG-011 | Per-frame anchor points (hand / effect origin) so special VFX and projectiles start at the drawn hand | Claude | todo | spec v2 proposal: needs an ADR + art/SPEC.md update; today the offsets are fixed (art/SPEC.md "Effect anchor points") |
| ENG-012 | `soak(n)` debug helper in main.js (CPU vs CPU for n matches + checks) | Claude | todo | replaces the manual recipe in TESTING.md |
| ENG-014 | Per-character signature effect sheets (`<charId>_<effect>`, briefed in `art/characters/<id>/MOVES_AND_VFX.md`, raws in `art/vfx/raw/_proposed/`): packer + loader support, preferred over shared VFX | Claude | todo | not in art/SPEC.md v1, so it needs a spec bump + ADR; includes the Sasuke follow-ups (Chidori at the hand during beamCharge, lightning beam style, Sharingan glint) |
| ENG-015 | Chidori anchor: move the lightning to the forward hand point (0.7 fwd, 0.78 up) for the last third of the active phase (t ≥ A + 2/3·active), so it matches the drawn f5 thrust on a whiff | Claude | todo | `handTick('chidori')` in effects.js + phase calc in game.js `fxTicks`; then drop the "known gap" notes in art/SPEC.md and Sasuke ANIMATIONS/MOVES_AND_VFX |
| TOOL-002 | Align `chatgptPrompt()` in animGuide.js + Sprite Lab with the hi-res spec (192 cells, 4-4.5 heads, not chibi) | Claude | todo | today two prompt sources disagree; art/ PROMPTS.md files win |
| TOOL-003 | Sprite Lab: preview packed custom sheets with a box overlay | Claude | todo | |
| TOOL-004 | Data lint: manifest anims = animGuide = FALLBACK coverage; run before build | Claude | todo | |
| DOC-003 | Update ASSETS.md to point at the hi-res pipeline (keep the Sprite Lab quick path) | Claude | done | ASSETS.md points at art/; warns that the Sprite Lab "Copy prompt" is pre-hi-res (TOOL-002) |
| TOOL-005 | Packer VFX fixes: frames keep their offset in the strip row (no per-frame re-centering), `glow` luma->alpha, crater fill 0.97, skip `ui_*`/`fx_*`/`*_fixNN.png` in raw/, fallback ms for taunt/win match SPEC | Claude | review | `npm run test:sprites` (108 checks, 5 new); docs: art/vfx/README "Packing notes", tools/README |
| DOC-004 | Art-doc consistency pass: one generation order (manifest steps), 0-based frame labels, Naruto contact zones, Rasengan thrust palm at the orb point, Chidori anchor wording, UI saved straight to `ui/`, character effects as `<charId>_<effect>` in `_proposed/`, Sasuke body scale = Naruto's (bodyHeights −6 on upright poses) | Claude | review | art/SPEC.md, PIPELINE, Naruto/Sasuke briefs, template, CODEX_PROMPT, AGENTS |
| OPS-002 | Bump `package.json` version at the next release (it says 0.1.0, but 0.2.0 has shipped) | Claude | todo | see CONTRIBUTING versioning |

### Naruto art (steps = `art/manifest.json` generation order; a custom sheet goes live when all CORE anims are packed)

| ID | Title | Owner | Status | Notes |
|---|---|---|---|---|
| ART-NAR-01 | Step 1: reference model sheet: front, 3/4 right, side, back, fighting stance, palette swatches | ChatGPT | todo | **do first**; save to `art/characters/naruto/reference/model_sheet.png`; attach to every later prompt |
| USR-002 | Approve the Naruto reference sheet before batch generation | User | todo | locks design and palette |
| ART-NAR-02 | Step 2: expression sheet (9 heads) | ChatGPT | todo | `reference/expressions.png`; attach from here on |
| ART-NAR-03 | Steps 3-4 (CORE): idle, then run | ChatGPT | todo | approve `idle` first, Codex copies it to `reference/idle_approved.png` and it is attached from then on |
| ART-NAR-04 | Step 5 core attacks (CORE): light1, light2, light3, light4, heavy, airLight1, airHeavy | ChatGPT | todo | strikes extend toward screen-right on active frames; targets in ANIMATIONS.md |
| ART-NAR-05 | Step 6 reactions (CORE): guard, hurtHigh, launched, down, getup | ChatGPT | todo | lying poses: lowest point on the floor line |
| ART-NAR-06 | Step 7 specials (CORE): charge, beamCharge, beamFire, special/Rasengan | ChatGPT | todo | palm EMPTY; the engine draws the orb at the hand anchor (MOVES_AND_VFX.md) |
| ART-NAR-07 | Step 8 rest of the core (CORE): dash, jumpUp, jumpFall, land, win | ChatGPT | todo | completes the core set: the sheet loads by default |
| ART-NAR-08 | Step 9 optional: backDash, superDash, jumpSquat, airLight2, airLight3, block, hurtLow, spin, airRecover, throw, vanish, stagger, ko, intro, taunt | ChatGPT | todo | fallbacks cover them until then |
| ART-NAR-09 | Step 11 UI: portrait 96×96, cut-in 480×128, select 384×384 | ChatGPT | todo | save straight to `art/characters/naruto/ui/<name>.png` (the packer fits the size) |
| ART-NAR-10 | File, pack, QA, hitbox overrides for every batch; keep TRACKER + manifest current | Codex | todo | `npm run sprites naruto` |
| ART-NAR-11 | In-game approval of Naruto hi-res set | User | todo | status `approved` |

### Sasuke art

| ID | Title | Owner | Status | Notes |
|---|---|---|---|---|
| ART-SAS-01 | Step 1: reference model sheet: front, 3/4 right, side, back, fighting stance, palette swatches | ChatGPT | todo | **do first**; save to `art/characters/sasuke/reference/model_sheet.png` |
| USR-003 | Approve the Sasuke reference sheet before batch generation | User | todo | |
| ART-SAS-02 | Step 2: expression sheet (8 heads incl. Sharingan) | ChatGPT | todo | `reference/expressions.png` |
| ART-SAS-03 | Steps 3-4 (CORE): idle, then run | ChatGPT | todo | approve `idle` first, Codex copies it to `reference/idle_approved.png`; Sasuke runs with a stronger forward lean |
| ART-SAS-04 | Step 5 core attacks (CORE): light1, light2, light3, light4, heavy, airLight1, airHeavy | ChatGPT | todo | same body scale as Naruto (bodyHeights −6 on upright poses, see TRACKER) |
| ART-SAS-05 | Step 6 reactions (CORE): guard, hurtHigh, launched, down, getup | ChatGPT | todo | |
| ART-SAS-06 | Step 7 specials (CORE): charge, beamCharge, beamFire, special/Chidori | ChatGPT | todo | hand trails low behind (≈x53,y152) through startup and sprint f3-f4; thrust f5, impact f6; no lightning drawn |
| ART-SAS-07 | Step 8 rest of the core (CORE): dash, jumpUp, jumpFall, land, win | ChatGPT | todo | |
| ART-SAS-08 | Step 9 optional: throw (fireball release) and intro first, then backDash, superDash, jumpSquat, airLight2, airLight3, block, hurtLow, spin, airRecover, vanish, stagger, ko, taunt | ChatGPT | todo | |
| ART-SAS-09 | Step 11 UI: portrait 96×96, cut-in 480×128 (red eyes), select 384×384 | ChatGPT | todo | save straight to `art/characters/sasuke/ui/<name>.png` |
| ART-SAS-10 | File, pack, QA, hitbox overrides for every batch; keep TRACKER + manifest current | Codex | todo | `npm run sprites sasuke` |
| ART-SAS-11 | In-game approval of Sasuke hi-res set | User | todo | |

### VFX and shared UI art

| ID | Title | Owner | Status | Notes |
|---|---|---|---|---|
| ART-VFX-01 | Impact set: spark, burst, ring, lines, star | ChatGPT | todo | white/light grey only (tinted at runtime) |
| ART-VFX-02 | Ground set: dust, smoke, crater | ChatGPT | todo | full color; crater is a top-down decal |
| ART-VFX-03 | Aura set: flame, streak, glow, lightning | ChatGPT | todo | white (tinted); flame/streak bottom-anchored on y=120 |
| ART-VFX-04 | Projectile/signature set: shuriken, fire, orb (Rasengan) | ChatGPT | todo | full color |
| ART-VFX-05 | File, pack (`npm run sprites vfx`), in-game QA, update TRACKER | Codex | todo | missing effects fall back to procedural |
| ART-UI-01 | Title logo "GCD TOURNEY" (+ 天下一武闘祭 subtitle) | ChatGPT | todo | `art/ui/PROMPTS.md` |
| ART-UI-02 | Title / menu background art | ChatGPT | todo | |
| ENG-013 | Use custom logo and title art in menus when present | Claude | todo | after ART-UI-01/02 |

## Later (M4+)

| ID | Title | Owner | Status | Notes |
|---|---|---|---|---|
| ENG-020 | Lazy placeholder baking (on character select) so boot stays flat as the roster grows | Claude | todo | M4 |
| ENG-021 | Data-driven specials (fx kind, hand anchor, rush/projectile/teleport) to drop per-kind code | Claude | todo | M4, ADR |
| ENG-022 | Character select grid for 8+ fighters (paging, select art) | Claude | todo | M4 |
| USR-010 | Pick the next two characters (candidates: Goku, Luffy, Ichigo, Vegeta, Zoro, Kakashi) | User | todo | then CHAR-<id>-* tasks per ADDING_A_CHARACTER.md |
| ENG-030 | Stage system + first per-series stage | Claude | todo | M5 |
| ENG-031 | Sample-based SFX and music + volume sliders | Claude | todo | M5 |
| ENG-040 | Seeded RNG in the simulation (determinism prerequisite for online) | Claude | todo | M7 prerequisite |
| TOOL-010 | Unit tests for pure modules (packer image ops, move data validation, Pad) | Claude | todo | ADR for the test runner |

## Done

| ID | Title | Owner | Status | Notes |
|---|---|---|---|---|
| M0 | Playable demo: arena, 2 fighters, VS CPU / 2P, rounds, synth audio, Sprite Lab | Claude | done | v0.1.0 |
| M1 | 3D-baked placeholder sprites + DBFZ combat feel | Claude | done | v0.2.0 |
