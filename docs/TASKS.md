# Task board

The single list of work in flight, shared by the user, Claude and Codex. The protocol is in
[AI_COLLABORATION.md](AI_COLLABORATION.md).

**How to use**
- Claim a task by setting **Owner** and **Status** to `in-progress` before starting. One owner per task.
- When you finish, set `review` with a one-line note (what changed, how to verify). The user or the
  reviewing AI sets `done`.
- New work gets a new row with the next id in its area. Keep notes to one line, and link a file or ADR for detail.
- Art tasks track **batches**. Per-asset status lives in [art/TRACKER.md](../art/TRACKER.md) and
  [art/manifest.json](../art/manifest.json); every generated image version has a row in
  [art/REVIEW.md](../art/REVIEW.md).

**Status:** `todo` · `in-progress` · `review` · `done` · `blocked` (put the reason in notes)
**Owners:** `Claude` · `Codex` (generates the images with its built-in generator, files, packs, QA) · `User`
(reviews and approves images; may generate by hand in ChatGPT)
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
| ENG-011 | Per-frame anchor points (hand / effect origin) so special VFX and projectiles start at the drawn hand | Claude | todo | needs a later spec bump (after v2) + ADR; today the offsets are fixed (art/SPEC.md "Effect anchor points", v2 px in ADR 0007) |
| ENG-012 | `soak(n)` debug helper in main.js (CPU vs CPU for n matches + checks) | Claude | todo | replaces the manual recipe in TESTING.md |
| ENG-014 | Per-character signature effect sheets (`<charId>_<effect>`, briefed in `art/characters/<id>/MOVES_AND_VFX.md`, raws in `art/vfx/raw/_proposed/`): packer + loader support, preferred over shared VFX | Claude | todo | not in art/SPEC.md (v2), so it needs a spec bump + ADR; includes the Sasuke follow-ups (Chidori at the hand during beamCharge, lightning beam style, Sharingan glint) |
| ENG-015 | Chidori anchor: move the lightning to the forward hand point (0.7 fwd, 0.78 up) for the last third of the active phase (t ≥ A + 2/3·active), so it matches the drawn f5 thrust on a whiff | Claude | todo | `handTick('chidori')` in effects.js + phase calc in game.js `fxTicks`; then drop the "known gap" notes in art/SPEC.md and Sasuke ANIMATIONS/MOVES_AND_VFX |
| ENG-016 | Restyle the 3D placeholder rig to ~6.5 heads so baked fighters match spec v2 proportions (optional, later) | Claude | todo | ADR 0007: the placeholder stays chibi (112 px, ppu 44) until then; keep the bake < 1 s per character |
| TOOL-002 | Align `chatgptPrompt()` in animGuide.js + Sprite Lab with art spec v2 (256 cells, Shippuden, ~6.5 heads, not chibi) | Claude | todo | today two prompt sources disagree; art/ PROMPTS.md files win |
| TOOL-003 | Sprite Lab: preview packed custom sheets with a box overlay | Claude | todo | |
| TOOL-004 | Data lint: manifest anims = animGuide = FALLBACK coverage; run before build | Claude | todo | |
| DOC-003 | Update ASSETS.md to point at the hi-res pipeline (keep the Sprite Lab quick path) | Claude | done | ASSETS.md points at art/; warns that the Sprite Lab "Copy prompt" is pre-hi-res (TOOL-002) |
| TOOL-005 | Packer VFX fixes: frames keep their offset in the strip row (no per-frame re-centering), `glow` luma->alpha, crater fill 0.97, skip `ui_*`/`fx_*`/`*_fixNN.png` in raw/, fallback ms for taunt/win match SPEC | Claude | review | `npm run test:sprites` (108 checks, 5 new); docs: art/vfx/README "Packing notes", tools/README |
| DOC-004 | Art-doc consistency pass: one generation order (manifest steps), 0-based frame labels, Naruto contact zones, Rasengan thrust palm at the orb point, Chidori anchor wording, UI saved straight to `ui/`, character effects as `<charId>_<effect>` in `_proposed/`, Sasuke body scale = Naruto's (bodyHeights −6 on upright poses) | Claude | review | art/SPEC.md, PIPELINE, Naruto/Sasuke briefs, template, CODEX_PROMPT, AGENTS; the −6 body-height rule is superseded by the shared v2 table (ADR 0007) |
| TOOL-006 | Packer spec v2: `spec` block read from the manifest (256 cells, pivot [128,240], ppu 128, palette warning > 64), highest `raw/<anim>_vNN.png` wins (plain `<anim>.png` only without versions), `raw/_rejected/` ignored, report names the file used | Claude | done | ADR 0007; `npm run test:sprites` |
| DOC-005 | Art spec v2 docs: ADR 0007, art/ SPEC, STYLE_GUIDE, PIPELINE, REVIEW.md queue, manifest, briefs and prompts, template, agent docs, Codex Prompt 0 (Codex generates, versioned review) | Claude | done | ADR 0007; v1 Naruto candidate archived in `reference/_old/` |
| DOC-006 | Spec v2 review fixes: ADR 0007 amendments (heavy F04 zone y 22-46, airLight2/special LOW, `_NN_fixMM` fix attempts, 9 px hitbox slack), Codex prompts (no reference/source/ uploads, one saved version per round, per-character Prompt 1, explicit-path commits on one shared art branch, status never goes down), template PROMPTS split into Part A/B with SIZE lines, Sasuke splits keep hit frames together, Naruto launched/superDash centering, Sprite Lab load-sheet instructions | Claude | done | `npm run test:sprites`, `npm run sprites` |
| DOC-007 | Reconcile remaining art-doc wording with ADR 0007 | Claude | todo | Naruto PROMPTS S1 says same scale and height despite a bent-knee stance (keep anatomical scale, allow lower stance); SPEC Chidori anchor table keeps the thrust at (64,199), while ADR 0007 lists thrust/recovery at (218,140); reconcile with ENG-015 without changing the accepted v2 contract |
| TOOL-007 | Packer: when nothing packable is left for a character, remove its stale packer-made `anims.json` + `sheet.png` (rejecting the only version no longer leaves rejected art in the game) | Claude | done | `npm run test:sprites` (versions 5); tools/README |
| TOOL-008 | Stitch tool for long strips: join `raw/_parts/<anim>_vNN_A.png` + `_B.png` into `raw/<anim>_vNN.png` (bottom-aligned, >= 24 px magenta gap, nearest-neighbor rescale of B to A's head size); packer option or `npm run stitch` | Claude | todo | until then Codex uses a throwaway script (art/PIPELINE.md "Long strips (parts)") |
| TOOL-009 | Sprite Lab: auto-load `public/characters/<id>/sheet.png` + `anims.json` when present (today it always shows the baked placeholder unless the sheet is loaded by hand) | Claude | todo | docs tell users to use "Load full sheet (.png + .json)…" |
| TOOL-013 | Correct run frame alignment with explicit placement | Codex | review | User authorized 2026-10-09. Added validated per-frame final-cell frameOffsets sidecars, applied before clipping; source-hash invalidation recovers original pixels. v02 keeps unchanged raw source and fixed pivot/bodyHeight. Naruto horizontal head range 0.8 px, Sasuke 1.2 px; flight lift restored and Sasuke f7 face recovered. 160 packer tests passed; final 48-color packs have zero warnings. Review tools change; art approval remains pending. |
| TOOL-014 | Mobile art review page and hosted asset export | Codex | review | Read-only /art-review.html with exact timing, pause/step/scrub, speed, zoom, full-resolution originals and approval status. npm run review:export validates selected versions and writes 13 allowlisted files (19.99 MiB). Phone-width browser checks passed; deployed HTTPS gallery and all exports verified byte-identical without login. The concurrent mobile release already included the gallery; no additional deployment needed. User reviews art via HTTPS and replies in chat. |
| OPS-002 | Bump `package.json` version at the next release (it says 0.1.0, but 0.2.0 has shipped) | Claude | todo | see CONTRIBUTING versioning |


### Spec v2 restart

Art restarted on spec v2 ([ADR 0007](decisions/0007-art-spec-v2-shippuden-256.md)): Shippuden designs, ~6.5
heads, 256 px cells. The v1 (chibi, Part 1) Naruto candidate is archived in `reference/_old/`, and every v1
status was reset to `todo`. Codex generates; every saved image is `<asset>_vNN.png` with a row in
[art/REVIEW.md](../art/REVIEW.md); the user answers `approve vNN` or gives feedback. Start a session with
**Prompt 0** in [agents/CODEX_PROMPT.md](agents/CODEX_PROMPT.md).

### Naruto art (steps = `art/manifest.json` generation order; a custom sheet goes live when all CORE anims are packed)

| ID | Title | Owner | Status | Notes |
|---|---|---|---|---|
| ART-NAR-01 | S1 model sheet (spec v2, Shippuden jacket, ~6.5 heads): front, 3/4 right, true side profile, back, fighting stance, palette swatches | Codex | done | User approved v01 on 2026-10-09; fixed model_sheet.png copy saved; QA deviations retained in REVIEW.md; reference only; build passed |
| USR-002 | Approve the Naruto model sheet (`approve vNN`) before anything else is generated for him | User | done | Approved model-sheet v01 on 2026-10-09; design reference locked for S2 |
| ART-NAR-02 | S2 expression sheet | Codex | done | User approved expressions v01 on 2026-10-09; fixed expressions.png saved unchanged; documented QA deviations accepted; ready for idle |
| ART-NAR-03 | Steps 3-4 (CORE): idle, then run | Codex | review | Idle v01 approved and committed 194bc4a; run v01 rejected/superseded at user request, source retained. Run v02 corrects placement (TOOL-013), 8 frames at 60 ms, 48 colors, zero final warnings. Mobile review page tested; 160 regression tests and production build passed. Waiting for explicit run v02 approval before attacks. |
| ART-NAR-04 | Step 5 core attacks (CORE): light1, light2, light3, light4, heavy, airLight1, airHeavy | Codex | todo | strikes reach the v2 contact zones (art/SPEC.md) toward screen-right on active frames |
| ART-NAR-05 | Step 6 reactions (CORE): guard, hurtHigh, launched, down, getup | Codex | todo | lying poses: lowest point on the floor line (y 240); `down` lies flat, head toward screen-left |
| ART-NAR-06 | Step 7 specials (CORE): charge, beamCharge, beamFire, special/Rasengan | Codex | todo | palm EMPTY; the engine draws the orb at the hand anchor (≈ x205, y148 in the 256 cell) |
| ART-NAR-07 | Step 8 rest of the core (CORE): dash, jumpUp, jumpFall, land, win | Codex | todo | completes the core set: the sheet loads by default |
| ART-NAR-08 | Step 9 optional: backDash, superDash, jumpSquat, airLight2, airLight3, block, hurtLow, spin, airRecover, throw, vanish, stagger, ko, intro, taunt | Codex | todo | fallbacks cover them until then; `superDash` angled ~25° up to fit the cell |
| ART-NAR-09 | Step 11 UI: portrait 96×96, cut-in 480×128, select 384×384 | Codex | todo | `raw/ui_<name>_vNN.png`; approved copy `ui/<name>.png` (the packer fits the size) |
| ART-NAR-10 | Pack, QA, REVIEW.md rows, hitbox overrides for every batch; keep TRACKER + manifest (`version`, `approvedVersion`) current | Codex | todo | `npm run sprites naruto` |
| ART-NAR-11 | In-game approval of the Naruto hi-res set | User | todo | status `approved` |

### Sasuke art

| ID | Title | Owner | Status | Notes |
|---|---|---|---|---|
| ART-SAS-01 | S1 model sheet (spec v2, Hebi-era white open-chest shirt, purple rope belt, sword sheathed at the back of the belt, ~6.5 heads): front, 3/4 right, true side profile, back, fighting stance, palette swatches | Codex | done | User approved v01 on 2026-10-09; fixed model_sheet.png copy saved; QA deviations retained in REVIEW.md; reference only; build passed |
| USR-003 | Approve the Sasuke model sheet (`approve vNN`) before anything else is generated for him | User | done | Approved model-sheet v01 on 2026-10-09; design reference locked for S2 |
| ART-SAS-02 | S2 expression sheet (incl. Sharingan) | Codex | done | User approved expressions v01 on 2026-10-09; fixed expressions.png saved unchanged; documented QA deviations accepted; ready for idle |
| ART-SAS-03 | Steps 3-4 (CORE): idle, then run | Codex | review | Idle v01 approved and committed 194bc4a; run v01 rejected/superseded at user request, source retained. Run v02 corrects placement (TOOL-013), 8 frames at 60 ms, 48 colors, zero final warnings. Mobile review page tested; 160 regression tests and production build passed. Waiting for explicit run v02 approval before attacks. |
| ART-SAS-04 | Step 5 core attacks (CORE): light1, light2, light3, light4, heavy, airLight1, airHeavy | Codex | todo | same body-height table as Naruto (ADR 0007); the sword stays sheathed (the moveset doesn't swing it) |
| ART-SAS-05 | Step 6 reactions (CORE): guard, hurtHigh, launched, down, getup | Codex | todo | |
| ART-SAS-06 | Step 7 specials (CORE): charge, beamCharge, beamFire, special/Chidori | Codex | todo | hand trails low behind (≈ x64, y199 in the 256 cell) through startup and sprint f3-f4; thrust f5 (≈ x218, y140), impact f6; no lightning drawn |
| ART-SAS-07 | Step 8 rest of the core (CORE): dash, jumpUp, jumpFall, land, win | Codex | todo | |
| ART-SAS-08 | Step 9 optional: throw (fireball release) and intro first, then backDash, superDash, jumpSquat, airLight2, airLight3, block, hurtLow, spin, airRecover, vanish, stagger, ko, taunt | Codex | todo | |
| ART-SAS-09 | Step 11 UI: portrait 96×96, cut-in 480×128 (red eyes), select 384×384 | Codex | todo | `raw/ui_<name>_vNN.png`; approved copy `ui/<name>.png` |
| ART-SAS-10 | Pack, QA, REVIEW.md rows, hitbox overrides for every batch; keep TRACKER + manifest (`version`, `approvedVersion`) current | Codex | todo | `npm run sprites sasuke` |
| ART-SAS-11 | In-game approval of the Sasuke hi-res set | User | todo | |

### VFX and shared UI art

VFX cells (128 px, ppu 56) and UI sizes didn't change in spec v2. Raws are versioned like everything else
(`art/vfx/raw/<effect>_vNN.png`, highest version packed).

| ID | Title | Owner | Status | Notes |
|---|---|---|---|---|
| ART-VFX-01 | Impact set: spark, burst, ring, lines, star | Codex | todo | white/light grey only (tinted at runtime) |
| ART-VFX-02 | Ground set: dust, smoke, crater | Codex | todo | full color; crater is a top-down decal |
| ART-VFX-03 | Aura set: flame, streak, glow, lightning | Codex | todo | white (tinted); flame/streak bottom-anchored on y=120 |
| ART-VFX-04 | Projectile/signature set: shuriken, fire, orb (Rasengan) | Codex | todo | full color |
| ART-VFX-05 | Pack (`npm run sprites vfx`), in-game QA, REVIEW.md rows, update TRACKER | Codex | todo | missing effects fall back to procedural |
| ART-UI-01 | Title logo "GCD TOURNEY" (+ 天下一武闘祭 subtitle) | Codex | todo | `art/ui/PROMPTS.md`; versioned `_vNN`, user approves |
| ART-UI-02 | Title / menu background art | Codex | todo | versioned `_vNN`, user approves |
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
| ENG-023 | World art loaders: stage slot overrides from `public/stage/` (ADR 0008, `art/stage/ASSETS.md`) | Claude | todo | in parallel with Codex world art |
| ENG-024 | Announcer + monks + vendor NPC sprites from `public/npc/<id>/`, reacting to KOs/supers | Claude | todo | ADR 0008 |
| ENG-025 | UI art hooks: logo, title key art, title background from `public/ui/` with CSS fallback | Claude | todo | `art/ui/README.md` |
| ENG-020 | `cameos: false` build flag: originals-only crowd for any public build | Claude | todo | release blocker for public builds (ADR 0008) |
| TOOL-011 | Packer world modes: `npm run sprites crowd` (atlas + contact sheets), `stage`, `npc`, `ui` | Claude | todo | until then the Codex lead reviews raw files |
| TOOL-012 | `tools/queue.mjs` claim queue (`npm run queue`) | Claude | done | race-tested: 20 simultaneous claims, 1 winner |
| ENG-026 | Crowd atlas loader: 3 frames, shock on big moments, unique seat shuffle, 471 seats | Claude | done | ADR 0008 |
| ENG-027 | Mobile landscape play: touch controls, tap menus, rotate screen, fullscreen, PWA manifest | Claude | done | docs/TESTING.md "Mobile" |

## Done

| ID | Title | Owner | Status | Notes |
|---|---|---|---|---|
| M0 | Playable demo: arena, 2 fighters, VS CPU / 2P, rounds, synth audio, Sprite Lab | Claude | done | v0.1.0 |
| M1 | 3D-baked placeholder sprites + DBFZ combat feel | Claude | done | v0.2.0 |
