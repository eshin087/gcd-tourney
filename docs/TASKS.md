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
| ENG-001 | Training room in the controls menu: the character mirrors the player's input in real time | Claude | done | `Game.startTraining`, `DummyBrain`; dummy modes, health refill, no timer |
| ENG-002 | Controller layout diagrams: keyboard / PlayStation / Xbox, player toggle, auto-detect device | Claude | done | `src/ui/controls.js`, `padKind()` in input.js |
| ENG-003 | Rebind keys and gamepad buttons; persist; reset to defaults | Claude | done | localStorage key `gcd.bindings.v1` |
| ENG-004 | Mute toggle in the top corner of the screen, unobtrusive, in sync with `M` | Claude | done | uses `audio.setMuted` |
| ENG-005 | 2.5D lanes: screen-horizontal facing, attack auto depth-step, same-lane rule, CPU lines up | Claude | done | ADR 0005; `LANE` in game.js |
| ENG-006 | Per-frame hit/hurt boxes from anims.json `boxes` (baked + custom); spark at the contact point | Claude | done | fixes "hit shown but fist not touching body" |
| ENG-007 | Custom sheet loading: `complete` flag, `?art=custom`, portrait/cutin/select PNGs | Claude | done | contract in art/SPEC.md |
| ENG-008 | Custom VFX atlas loading (`public/vfx/atlas.*`) with per-effect procedural fallback | Claude | done | |
| ENG-009 | HD render mode auto-enabled for hi-res sheets | Claude | done | ADR 0002 consequences |
| TOOL-001 | `tools/pack-sprites.mjs` + `npm run sprites [id\|vfx]`: clean, scale, align, auto boxes, overrides, report | Claude | done | ADR 0006 |
| DOC-001 | SDLC docs: CLAUDE.md, AGENTS.md, docs/*, ADRs 0001-0006, CHANGELOG, Codex prompts | Claude | review | check the facts against code after the M2 engine tasks land |
| DOC-002 | Art briefs: art/README, SPEC, STYLE_GUIDE, PIPELINE, TRACKER, manifest, `_template`, Naruto/Sasuke/VFX/UI | Claude | done | |
| DOC-008 | Character consistency across Claude and Codex: PR plan per new character, KIT.md template, ultimate variety rule, shared-file rules, union merges for append-only logs, Prompt 2 rewritten | Claude | done | 2026-10-10; files: docs/ADDING_A_CHARACTER.md, docs/AI_COLLABORATION.md, AGENTS.md, docs/agents/CODEX_PROMPT.md, art/characters/_template/KIT.md, .gitattributes |
| OPS-003 | Worktrees inside the project: `npm run pr -- start` makes `.worktrees/<branch>`; `.gitignore` + vite `server.watch.ignored`; docs and ADR 0013 amended | Claude | done | 2026-10-10, user request; files: tools/pr.mjs, .gitignore, vite.config.js, CLAUDE.md, AGENTS.md, docs/CONTRIBUTING.md, docs/agents/, docs/decisions/0013-pull-requests-in-worktrees.md |
| OPS-002 | PR-only workflow for features and characters: `tools/pr.mjs` (worktree start / slim publish + PR / no-ff merge), ADR 0013, CLAUDE/AGENTS/CONTRIBUTING/AI_COLLABORATION/Codex prompts | Claude | done | 2026-10-10; files: tools/pr.mjs, package.json, CLAUDE.md, AGENTS.md, docs/CONTRIBUTING.md, docs/AI_COLLABORATION.md, docs/agents/CODEX_PROMPT.md, docs/decisions/ |
| OPS-001 | Initialize the local git repo, first commit, verify `.gitignore` (node_modules, dist) | Claude | done | conventional commits from here on |
| USR-001 | Play-test M2 (training room, layouts, rebinding, mute, hit accuracy) and sign off | User | done | 2026-10-10: the user signed off on M2 in chat with Claude. after the ENG tasks reach `review` |

## Milestone M3: hi-res Naruto & Sasuke (v0.4.0)

### Tooling and engine follow-ups

| ID | Title | Owner | Status | Notes |
|---|---|---|---|---|
| ENG-010 | Debug hitbox/hurtbox overlay (toggle in training + `?debug`) | Claude | todo | needed for tuning hitboxes.json |
| ENG-011 | Per-frame anchor points (hand / effect origin) so special VFX and projectiles start at the drawn hand | Claude | done | 2026-10-10: `hand: [x, y]` in hitboxes.json -> anims.json; `SheetAsset.hand` / `SpriteActor.hand` (frame anchor, hit box, nearest frame); hand fx, shots and beams use it; no spec bump needed (ADR 0012) |
| ENG-053 | Ultimate variety (ADR 0017 part 1): kinds `orb` (Hollow Purple), `rampage` (Four-Tails), `reflex` (Whirlwind); Killua's SUPER renamed Speed of Lightning; both CPUs | Claude | done | 2026-10-10: PR #14 merged and deployed. 2026-10-10; files: src/game/kit.js, moves.js, projectiles.js, game.js, fighter.js, ai.js, aiMaster.js, src/characters/naruto|killua|gojo.js; the pounce commits to its line at the roar (a homing one landed 4 times in 2 rounds). Codex: ART-NAR-4T (Four-Tails frames, required), optional Gojo beamFire and Killua beamCharge redraws, optional hollowPurple VFX |
| ENG-054 | Rhythm ultimate clash (ADR 0017 part 2): shared note chart replaces mashing; clash bodies for beam/orb/rampage; faster answer to an ultimate; one-beat special clash | Claude | done | 2026-10-10: PR #17 merged and deployed. 2026-10-10; stacked on ENG-053's PR. files: src/game/clash.js (new), game.js, kit.js, moves.js, fighter.js, projectiles.js, ai.js, aiMaster.js, src/core/input.js, audio.js, src/ui/hud.js, controls.js, src/style.css, src/lab/scripts.js. Lab-tested every pairing (orb/rush/beam, mirrors, answers, special clash, cooldown); 14 CPU matches clean |
| TOOL-022 | Vercel preview deploy per PR (`npm run deploy -- --preview`, link in the PR) | Claude | done | 2026-10-10, PR #15 (ADR 0018) |
| ENG-055 | Test lab page (`lab.html`): move list per fighter, animation viewer with boxes, mechanic scenarios, test tools | Claude | done | 2026-10-10, PR #16 (ADR 0018) |
| ENG-056 | CPU-vs-CPU clashes are rare (both need 3 bars at once): the showman saves its bars when the opponent has 3 so it can answer their ultimate; lab option for the dummy's clash timing (Easy..Impossible) | Claude | review | 2026-10-10: user approved; PR `feature/showcase-clashes` (ADR 0016 amendment). Naruto/Gojo showman matches: 5 of 6 showed a rhythm clash (was 0 of 14), no soak errors in 13 matches; lab Tools > CLASH sets the dummy's clash level (IMPOSSIBLE dummy verified). Verify: TESTING.md IMPOSSIBLE step 5. files: src/game/aiMaster.js, src/game/aiShow.js, src/game/ai.js (DummyBrain only, not LEVELS), src/lab/lab.js, src/lab/scripts.js (ultClash text), docs/COMBAT_DESIGN.md, docs/TESTING.md, docs/decisions/0016-*, CHANGELOG.md. found in the ENG-054 soak: 0 natural clashes in 14 matches, but CPUs answer 9-10 of 12 forced ultimates |
| ART-NAR-4T | Four-Tails shroud frames: `beamCharge` (the roar) and `beamFire` (the pounce, claw slams) for Naruto's ultimate, then the `SUPERS.fourTails` data switch | Codex | todo | required for the anime look (ADR 0017); brief: art/characters/naruto/KIT.md §5; inbox Naruto thread; an art PR with `_vNN` candidates for the user's review |
| ART-GOJ-HP | Optional: Gojo `beamFire` as the JJK season 2 Hollow Purple release gesture | Codex | todo | brief: art/characters/gojo/KIT.md; after ART-NAR-4T; the current pose already works |
| ART-KIL-WW | Optional: Killua `beamCharge` as the Whirlwind ready stance | Codex | todo | brief: art/characters/killua/KIT.md; after ART-NAR-4T; the current charge pose already works |
| VFX-HP | Optional: a `hollowPurple` VFX atlas entry so Codex can draw a dedicated Hollow Purple strip (today: the tinted procedural orb) | Claude | todo | gojo/KIT.md "Effect"; then an inbox item for the world-art lead |
| ENG-057 | Hold back to block: holding the stick away from the opponent blocks any blockable hit on the ground (always on); the Guard button still blocks, parries and dodges; CPU pads keep their level's guard rates | Claude | review | PR #19 (preview linked on it). user request 2026-10-10; files: src/game/fighter.js, src/game/ai.js, src/game/aiMaster.js (opponent-blocking reads only), src/ui/controls.js, src/lab/scripts.js, README.md, docs/COMBAT_DESIGN.md, docs/TESTING.md |
| ENG-058 | INSANE CPU level between HARD and IMPOSSIBLE: the frame-data brain with human-like reactions (~12 f) and some mistakes | Claude | review | PR #20: Insane beat Hard 4/4; vs the same Normal CPU it lost 616 HP a round to Impossible's 368. user request 2026-10-10; files: src/game/ai.js (CPU_LEVELS, makeBrain), src/game/aiMaster.js (STYLES: one new row), src/main.js, README.md, docs/COMBAT_DESIGN.md |
| ENG-059 | Polish the power-up (hold Special): a fuller aura that builds, gathering sparks, rising debris, ground ring and cracks, camera rumble, a burst per bar, rising sound | Claude | review | PR #21: 3 CPU matches clean, at most 96 live effects. user request 2026-10-10; files: src/game/effects.js, src/game/game.js (fxTicks), src/game/fighter.js (charge state), src/core/audio.js, src/characters/*.js (charge style data) |
| ENG-060 | Crowd QA: spectators clipping or glitching in the stands | Claude | review | PR #22: cards slid toward the camera in depth only, half-texel inset, real aisle stairs. user report 2026-10-10; files: src/world/arena.js, src/art/crowdPainter.js |
| TOOL-023 | `npm run lineup`: the cast side by side on one baseline (idle, run, heavy) with height and shoulder-width numbers, for every model sheet and idle review | Claude | in progress | branch chore/lineup-tool (tool done; scale standard docs to add). supports DOC-009; files: tools/lineup.mjs, package.json |
| DOC-009 | Scale and build standard for future characters: canon height to px, build classes with shoulder-width bands, a mandatory cast lineup review | Claude | todo | user request 2026-10-10; files: art/CHARACTER_SCALE.md, docs/ADDING_A_CHARACTER.md |
| ART-GOJ-BUILD | Gojo's broader adult build (keep his head and 215 px height): new model sheet, then all 42 animations | Codex | todo | user decision 2026-10-10 (shoulders 52 px today vs Killua 64, Naruto 77, Sasuke 87); brief in gojo/KIT.md once Claude adds it |
| ART-HEAVY-01 | New heavy (launcher) animations for Naruto, Sasuke and Killua: anticipation, step-in, full-body rising strike, follow-through | Codex | todo | user review 2026-10-10 (today's launchers are an arm raised on the spot); briefs in each KIT.md once Claude adds them; Gojo's comes with ART-GOJ-BUILD |
| ART-CHARGE-01 | New charge (power-up) loops for Naruto, Sasuke and Killua with visible straining motion | Codex | todo | with ENG-059 (engine effects); briefs in each KIT.md once Claude adds them |
| ENG-012 | `soak(n)` debug helper in main.js (CPU vs CPU for n matches + checks) | Claude | todo | replaces the manual recipe in TESTING.md; `mode=cpu` (ENG-041) already arms both CPUs, the helper adds the NaN / ring-out / stuck checks and the match loop |
| ENG-041 | CPU vs CPU spectator mode: SELECT MODE entry, `?mode=cpu`, both sides at one level (default Hard), spectator hints, pause-only touch overlay | Claude | done | 2026-10-09; files: src/game/game.js, src/ui/menus.js, src/ui/controls.js, src/core/input.js, src/core/touch.js, src/main.js, src/style.css; docs/TESTING.md soak + round-robin recipes use it |
| ENG-042 | Defensive options: parry (tap Guard just before a hit), spot dodge (Guard + ↓), air dodge (Guard in the air), wavedash (air dodge into the floor) | Claude | review | 2026-10-10: `DEFENSE` in moves.js, states `dodge`/`airDodge`/`wavedash` + `Fighter.parry` (ADR 0014); also the air-juggle tracking fix (`JUGGLE_GAP`, airHeavy `boxPad`). Verify: docs/TESTING.md "IMPOSSIBLE CPU and defensive options" step 1. Branch `feature/impossible-cpu` (PR). files: src/game/fighter.js, src/game/moves.js, src/game/game.js, src/game/projectiles.js, src/core/input.js, src/ui/menus.js, docs/COMBAT_DESIGN.md, README.md |
| ENG-043 | IMPOSSIBLE CPU level: frame-data threat reads, parry/dodge defense, punishes, optimal kit combo routes with lethal checks, wavedash spacing, okizeme; CPU vs CPU defaults to it | Claude | review | 2026-10-10: `MasterBrain` (src/game/aiMaster.js), `makeBrain` + `CPU_LEVELS` in ai.js; beats Hard 9/9; CPU vs CPU soak clean (14 matches, all levels: no errors / NaN / stuck / ring-outs). Verify: TESTING.md steps 2-5. files: src/game/ai.js, src/game/aiMaster.js (new), src/game/game.js, src/ui/menus.js, src/main.js, docs/TESTING.md, docs/decisions/0014-* |
| ENG-044 | Beat a held guard: throw / grab (Light + Heavy close; beats guard, parry, counter stances; loses to strikes, jumps, spot dodge) + throw break | Claude | review | 2026-10-10: user chose the throw. `THROW` in moves.js, `Fighter.updateThrow`, `Game.tryGrab`/`breakThrow`/`throwHit`; IMPOSSIBLE throws (tick, turtle, oki) and breaks; ADR 0015. Branch `feature/throws` (PR, after #3). Verify: TESTING.md IMPOSSIBLE step 6 |
| ENG-045 | Light ×3 → rush special is a true combo: `cancelStartup` (Rasengan 14, Chidori 16, Rasenshuriken 18) when cancelled out of a hit | Claude | review | 2026-10-10: user chose faster cancelled startup; verified vs a guard-when-free dummy (never blocked); ADR 0015, branch `feature/throws` |
| ENG-046 | Dedicated `dodge`, `airDodge`, `parry` poses (animation contract change: animGuide, FALLBACK, rig anims, manifest, SPEC, ASSETS) and art for all four fighters | Claude + Codex | todo | today they reuse `vanish`, `airRecover`/`jumpFall`, `guard` with ghosts and a shimmer |
| ENG-047 | Training room: IMPOSSIBLE dummy and a "parry practice" dummy (attacks on a rhythm, shows the parry window) | Claude | todo | `DummyBrain` modes |
| ENG-048 | Balance round-robin after ENG-042/043 (juggle tracking lengthened every air combo) | Claude | todo | docs/TESTING.md "Balance round-robin", log in ADR 0011 |
| ENG-049 | Showcase CPU: every CPU shows its kit (shared `Showcase` weights, level-scaled), CPU vs CPU `showman` plays short combos + mid-range kit + rotating defense; Easy-Hard parry / spot dodge / air dodge / wavedash; DODGE! callouts | Claude | review | 2026-10-10, user request (all CPUs, show first but real, same ki rules); ADR 0016. Verify: TESTING.md IMPOSSIBLE step 5 (`b.show.unseen()`). Also fixes: IMPOSSIBLE never air dodged, light4 route, late spot dodges, early charge release, throw-hold barrier overshoot, worktree dev server ignoring its own edits (vite.config.js). files: src/game/ai.js, src/game/aiMaster.js, src/game/aiShow.js (new), src/game/fighter.js, src/game/game.js, src/game/kit.js, src/game/projectiles.js, vite.config.js, docs/COMBAT_DESIGN.md, docs/TESTING.md, docs/decisions/0016-* |
| ENG-050 | Showcase follow-ups: slow-mo + camera punch when a dodge or parry beats a big special or super by a few frames; a "technique ticker" for spectators (WAVEDASH, PUNISH) if the callouts prove too sparse | Claude | todo | extras the user left open in ENG-049 |
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
| TOOL-017 | Show newer reference and idle candidates in mobile art review | Codex | review | files: tools/export-art-review.mjs. Latest packed idle candidate now exports independently of its approved fixed reference.18 focused fixture cases passed including promotion, stale/missing sources, marker/reference mismatch and no-write failures/dry runs.160 packer regression checks and production build passed. |
| OPS-002 | Bump `package.json` version at the next release (it says 0.1.0, but 0.2.0 has shipped) | Claude | todo | see CONTRIBUTING versioning |


### Spec v2 restart

Art restarted on spec v2 ([ADR 0007](decisions/0007-art-spec-v2-shippuden-256.md)): Shippuden designs, ~6.5
heads, 256 px cells. The v1 (chibi, Part 1) Naruto candidate is archived in `reference/_old/`, and every v1
status was reset to `todo`. Codex generates; every saved image is `<asset>_vNN.png` with a row in
[art/REVIEW.md](../art/REVIEW.md); the user answers `approve vNN` or gives feedback. Start a session with
**Prompt 0** in [agents/CODEX_PROMPT.md](agents/CODEX_PROMPT.md).

| ART-SCALE-01 | Audit and correct fighter anatomical scale; finish Sasuke with shared scale gate | Codex | done | 2026-10-10: user approved the final batch (PR #9) and Claude merged #8 + #9: repack byte-identical, 207 packer checks, build and CPU matches clean. Approvals recorded and Sasuke UI installed by Claude 2026-10-10 (PR art/approve-fighter-batch). Follow-ups: Sasuke size pops in light2/light3/special (two stitched parts at different scales), Naruto/Killua ko margin notes. Candidate corrections, original Gojo restoration, scale gate, complete Sasuke kit and local browser QA finished; separate PR awaiting final visual approval. See art/scale/FINAL_QA.md (including two non-clipping KO margin warnings). User requested all four fighters have consistent head/body scale across animations; complete Sasuke after calibration. User reaffirmed original Gojo head size; enlarged Gojo candidates rejected. Preserve versions and approvals; one final review. files: docs/FIGHTER_SCALE_HANDOFF.md, docs/decisions/0010-per-character-body-scale.md, art/characters/_template/PROMPTS.md, tools/pack-sprites.mjs, tools/test-pack-sprites.mjs, art/scale/, art/CHARACTER_SCALE.md, art/characters/sasuke/, art/characters/naruto/, art/characters/killua/, art/characters/gojo/, art/PIPELINE.md, art/STYLE_GUIDE.md, art/README.md, art/manifest.json, art/TRACKER.md, art/REVIEW.md, docs/ADDING_A_CHARACTER.md, docs/NOW.md, docs/agents/CODEX_INBOX.md, CHANGELOG.md. |

### Naruto art (steps = `art/manifest.json` generation order; a custom sheet goes live when all CORE anims are packed)

| ID | Title | Owner | Status | Notes |
|---|---|---|---|---|
| ART-NAR-FINAL | Complete Naruto art set for one final review | Codex | done | 40 new animations and 3 UI candidates complete; full set 42 animations / 175 frames, strict 48-color pack passes. Review /art-review/naruto/final/. Source corrections, sidecars, hitbox overrides and visual caveats in production/QA.md. User approved the final Naruto batch; visual caveats retained in production/QA.md. Gameplay integration remains Claude work. files: art/characters/naruto/, public/art-review/naruto/final/, public/characters/naruto/, Naruto tracker/review/manifest rows, docs/NOW.md, CHANGELOG.md. |
| ART-NAR-01 | S1 model sheet (spec v2, Shippuden jacket, ~6.5 heads): front, 3/4 right, true side profile, back, fighting stance, palette swatches | Codex | done | User approved v01 on 2026-10-09; fixed model_sheet.png copy saved; QA deviations retained in REVIEW.md; reference only; build passed |
| USR-002 | Approve the Naruto model sheet (`approve vNN`) before anything else is generated for him | User | done | Approved model-sheet v01 on 2026-10-09; design reference locked for S2 |
| ART-NAR-02 | S2 expression sheet | Codex | done | User approved expressions v01 on 2026-10-09; fixed expressions.png saved unchanged; documented QA deviations accepted; ready for idle |
| ART-NAR-03 | Steps 3-4 (CORE): idle, then run | Codex | done | Idle v01 and run v02 approved. Run approval 2026-10-09 preserves placement fixes, eight 60 ms frames and documented QA. Hair correction proceeds separately under ART-NAR-12 before more Naruto animations. |
| ART-NAR-04 | Step 5 core attacks (CORE): light1, light2, light3, light4, heavy, airLight1, airHeavy | Codex | done | strikes reach the v2 contact zones (art/SPEC.md) toward screen-right on active frames; completed candidates and checks tracked by ART-NAR-FINAL; final batch approved. |
| ART-NAR-05 | Step 6 reactions (CORE): guard, hurtHigh, launched, down, getup | Codex | done | lying poses: lowest point on the floor line (y 240); `down` lies flat, head toward screen-left; completed candidates and checks tracked by ART-NAR-FINAL; final batch approved. |
| ART-NAR-06 | Step 7 specials (CORE): charge, beamCharge, beamFire, special/Rasengan | Codex | done | palm EMPTY; the engine draws the orb at the hand anchor (≈ x205, y148 in the 256 cell); completed candidates and checks tracked by ART-NAR-FINAL; final batch approved. |
| ART-NAR-07 | Step 8 rest of the core (CORE): dash, jumpUp, jumpFall, land, win | Codex | done | completes the core set: the sheet loads by default; completed candidates and checks tracked by ART-NAR-FINAL; final batch approved. |
| ART-NAR-08 | Step 9 optional: backDash, superDash, jumpSquat, airLight2, airLight3, block, hurtLow, spin, airRecover, throw, vanish, stagger, ko, intro, taunt | Codex | done | fallbacks cover them until then; `superDash` angled ~25° up to fit the cell; completed candidates and checks tracked by ART-NAR-FINAL; final batch approved. |
| ART-NAR-09 | Step 11 UI: portrait 96×96, cut-in 480×128, select 384×384 | Codex | done | `raw/ui_<name>_vNN.png`; approved copy `ui/<name>.png` (the packer fits the size); completed candidates and checks tracked by ART-NAR-FINAL; final batch approved. |
| ART-NAR-12 | Shorten Naruto hair and update reference direction | Codex | done | Model/expressions/idle v02 and run v03 approved; haircut propagation complete. User overrides per-asset review pauses: remaining Naruto set gets one final approval after production and QA. Routine tests authorized. Kit briefs A39-A42 integrated per inbox. |
| ART-NAR-10 | Pack, QA, REVIEW.md rows, hitbox overrides for every batch; keep TRACKER + manifest (`version`, `approvedVersion`) current | Codex | done | `npm run sprites naruto`; completed candidates and checks tracked by ART-NAR-FINAL; final batch approved. |
| ART-NAR-11 | Final Naruto art approval | User | done | Final batch approved in chat; gameplay feel and integration validation remain separate. |

### Sasuke art

| ID | Title | Owner | Status | Notes |
|---|---|---|---|---|
| ART-SAS-01 | S1 model sheet (spec v2, Hebi-era white open-chest shirt, purple rope belt, sword sheathed at the back of the belt, ~6.5 heads): front, 3/4 right, true side profile, back, fighting stance, palette swatches | Codex | done | User approved v01 on 2026-10-09; fixed model_sheet.png copy saved; QA deviations retained in REVIEW.md; reference only; build passed |
| USR-003 | Approve the Sasuke model sheet (`approve vNN`) before anything else is generated for him | User | done | Approved model-sheet v01 on 2026-10-09; design reference locked for S2 |
| ART-SAS-02 | S2 expression sheet (incl. Sharingan) | Codex | done | User approved expressions v01 on 2026-10-09; fixed expressions.png saved unchanged; documented QA deviations accepted; ready for idle |
| ART-SAS-03 | Steps 3-4 (CORE): idle, then run | Codex | done | Idle v01 and run v02 approved. Run approval 2026-10-09 preserves recovered face, placement fixes, eight 60 ms frames and documented QA. |
| ART-SAS-04 | Step 5 core attacks (CORE): light1, light2, light3, light4, heavy, airLight1, airHeavy | Codex | review | Generated and technically checked; one final visual approval pending. See art/scale/FINAL_QA.md. |
| ART-SAS-05 | Step 6 reactions (CORE): guard, hurtHigh, launched, down, getup | Codex | review | Generated and technically checked; one final visual approval pending. See art/scale/FINAL_QA.md. |
| ART-SAS-06 | Step 7 specials (CORE): charge, beamCharge, beamFire, special/Chidori | Codex | review | Generated and technically checked; one final visual approval pending. See art/scale/FINAL_QA.md. |
| ART-SAS-07 | Step 8 rest of the core (CORE): dash, jumpUp, jumpFall, land, win | Codex | review | Generated and technically checked; one final visual approval pending. See art/scale/FINAL_QA.md. |
| ART-SAS-08 | Step 9 optional: throw (fireball release) and intro first, then backDash, superDash, jumpSquat, airLight2, airLight3, block, hurtLow, spin, airRecover, vanish, stagger, ko, taunt | Codex | review | Generated and technically checked; one final visual approval pending. See art/scale/FINAL_QA.md. |
| ART-SAS-09 | Step 11 UI: portrait 96×96, cut-in 480×128 (red eyes), select 384×384 | Codex | review | Generated and technically checked; one final visual approval pending. See art/scale/FINAL_QA.md. |
| ART-SAS-10 | Pack, QA, REVIEW.md rows, hitbox overrides for every batch; keep TRACKER + manifest (`version`, `approvedVersion`) current | Codex | review | Generated and technically checked; one final visual approval pending. See art/scale/FINAL_QA.md. |
| ART-SAS-11 | In-game approval of the Sasuke hi-res set | User | done | 2026-10-10: approved with the PR #9 batch; Codex records it |

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
| ART-UI-02 | Title / menu background art | Codex | done | 2026-10-10: user-approved Naruto-vs-Killua `title_art` v02 shipped (static painted audience; the crowd-sprite overlay experiment was dropped); 128-color fit in public/ui, zero warnings. PR art/title-art-v02 |
| ENG-013 | Use custom logo and title art in menus when present | Claude | todo | after ART-UI-01/02 |


## Later (M4+)

| ID | Title | Owner | Status | Notes |
|---|---|---|---|---|
| ENG-020 | Lazy placeholder baking (on character select) so boot stays flat as the roster grows | Claude | todo | M4 |
| ENG-021 | Data-driven specials (fx kind, hand anchor, rush/projectile/teleport) to drop per-kind code | Claude | todo | M4, ADR |
| ENG-022 | Character select grid for 8+ fighters (paging, select art) | Claude | todo | M4 |
| USR-010 | Pick the next two characters (candidates: Goku, Luffy, Ichigo, Vegeta, Zoro, Kakashi) | User | done | then CHAR-<id>-* tasks per ADDING_A_CHARACTER.md; 2026-10-09: user picked Killua and Gojo (ENG-028) |
| ENG-030 | Stage system + first per-series stage | Claude | todo | M5 |
| ENG-031 | Sample-based SFX and music + volume sliders | Claude | todo | M5 |
| ENG-040 | Seeded RNG in the simulation (determinism prerequisite for online) | Claude | todo | M7 prerequisite |
| TOOL-010 | Unit tests for pure modules (packer image ops, move data validation, Pad) | Claude | todo | ADR for the test runner |
| ENG-023 | World art loaders: stage slot overrides from `public/stage/` (ADR 0008, `art/stage/ASSETS.md`) | Claude | done | 2026-10-10: slot registry in arena.js swaps the image of every painted texture of a slot (geometry/repeats unchanged); `loadStageArt` in src/world/worldArt.js; approved only, `?art=custom` previews (ADR 0012) |
| ENG-024 | Announcer + monks + vendor NPC sprites from `public/npc/<id>/`, reacting to KOs/supers | Claude | done | 2026-10-10: `NPCS` placement + `NPC_CUES` (intro, round start, super, ultimate, clash, KO, crash, round end) in src/world/worldArt.js; announcer sheet replaces the painted one |
| ENG-025 | UI art hooks: logo, title key art, title background from `public/ui/` with CSS fallback | Claude | done | 2026-10-10: title screen shows `public/ui/logo.png` + `title_art.png` when approved; CSS logo otherwise (title background `title_bg` not wired: no candidate yet) |
| ENG-020 | `cameos: false` build flag: originals-only crowd for any public build | Claude | todo | release blocker for public builds (ADR 0008) |
| TOOL-011 | Packer world modes: `npm run sprites crowd` (atlas + contact sheets), `stage`, `npc`, `ui` | Claude | done | 2026-10-10: `crowd`, `stage`, `npc`, `ui` modes, approval-gated, `--candidates` -> public/preview/ (ADR 0012); NPC strips scaled per ANIMATIONS.md height row (fixes the announcer point / monk-b signal scale drift). 195 packer tests. Contact sheets + frames/ write-back moved to TOOL-021 |
| ART-WORLD-FINAL | Complete world art corrections, final review packet and integration QA | Codex lead | done | 2026-10-10: the user approved all existing world art in chat with Claude; Claude recorded the approvals (manifest, REVIEW, TRACKER, final/ + NPC reference copies), packed everything (VFX 15, crowd 576 incl. Killua/Gojo cameos, stage 30, NPC 4, UI 2; zero warnings) and shipped it. Follow-ups: ENG-039 (stage quirks), ENG-020 (cameo flag) |
| TOOL-021 | Crowd mode: per-batch contact sheets (`art/crowd/contact/<batch>.png`) and `art/crowd/frames/` write-back for hand touch-ups | Claude | todo | art/crowd/README.md; until then review with `--candidates` + `?art=custom` or the phone gallery |
| ENG-039 | Stage engine quirks from art/stage/ASSETS.md "Engine notes": lantern glyphs face +-x, stretched riser / wall-cap / beam faces, mipmaps (nearest-mipmap) for repeated ground and wall textures | Claude | todo | visible with the stage candidates (`?art=custom`); fix in arena.js, never by distorting the art |
| TOOL-012 | `tools/queue.mjs` claim queue (`npm run queue`) | Claude | done | race-tested: 20 simultaneous claims, 1 winner |
| TOOL-018 | Queue CLI named flags lost through `npm run queue --` on this PowerShell host | Claude | todo | `npm run queue -- reopen crowd-farmers-villagers-01 --items org-farm-001,org-farm-008 --note "..."` printed `re-opened as crowd-farmers-villagers-01-r1: org-farm-001, org-farm-002, org-farm-003, org-farm-004, org-farm-005, org-farm-006, org-farm-007, org-farm-008, org-farm-009, org-farm-010` (all items). Lead corrected unclaimed `art/queue/extra.json`; direct `node tools/queue.mjs reopen ... --items "id1,id2" --note "..."` targets only named items. Reproduce/fix documented npm command or wrapper and test flag forwarding. |
| ENG-026 | Crowd atlas loader: 3 frames, shock on big moments, unique seat shuffle, 471 seats | Claude | done | ADR 0008 |
| ENG-028 | Move system v2 (ADR 0009): command specials, special kinds, SUPER button, passives/modes; Killua + Gojo fighters | Claude | done | every move tested with `?debug`; CPU soaks Killua-Gojo x3, Gojo-Naruto, Sasuke-Killua, both mirrors, Naruto-Sasuke: clean |
| DOC-008 | Killua + Gojo art briefs (spec v2) and move-system-v2 art contract (4 optional anims) | Claude | done | briefs + PROMPTS (A39-A42 = kit anims), manifest/TRACKER rows, SPEC, template, ADR 0010 (Killua 182 px, Gojo 215 px) |
| ART-KIL-01 | Killua complete art set | Codex | done | User approved final batch 2026-10-09: expressions, all 42 animations / 175 frames, 3 UI assets. Approved fixed references/UI promoted; superseded candidates archived. QA caveats remain documented; ENG-035 owns gameplay reach follow-up. Commit deferred per user instruction to avoid protected Git writes; scoped patch saved locally. files: docs/NOW.md, docs/agents/CODEX_INBOX.md, CHANGELOG.md |
| ART-GOJ-01 | Gojo approved complete art set | Codex | done | User approved all 47 latest assets: model v03, expressions v02, 42 animations / 175 frames and 3 UI. Promoted fixed files; archived superseded versions. Strict canonical pack: zero warnings, 48 colors; build and 160 packer regressions pass. Full QA: art/characters/gojo/production/QA.md. files: docs/NOW.md, docs/agents/CODEX_INBOX.md, CHANGELOG.md |
| ENG-032 | Gojo Blink animation integration | Codex | done | Startup/reappearance use specialUp f0-1/f4-5; hide stays six ticks. Legacy teleport defaults preserved; regression test passes. Browser confirms visible startup frames 0/1, hidden interval, visible recovery frames 4/5 and normal exit; no errors. files: src/game/kit.js, src/game/moves.js |
| ENG-033 | Startup bake grows with the roster (4 fighters = 1.6-2.2 s blocking): bake the selected fighters first or in a worker | Claude | todo | console `[sprites] baked <id> from 3D in N ms` |
| ENG-034 | Kit VFX polish: lightning between Killua's palms in `beamCharge`, Gojo's blue + red orbs in both hands for Hollow Purple, optional `killua_*` / `gojo_*` effect sheets | Claude | todo | MOVES_AND_VFX.md §4 of both briefs; ENG-014 |
| ENG-035 | Re-run the ADR 0010 reach table with the packed Killua/Gojo sheets and tune lunge/stats if a normal whiffs | Claude | done | 2026-10-10: all 36 kit moves (9 slots x 4 fighters) run clean in training; 144 CPU matches with the art packs: Naruto 53 %, Sasuke 33 %, Killua 58 %, Gojo 56 %, P1 47 %, no errors / NaN / stuck / ring-outs outside KO (ADR 0011 log run 10-11). Killua light4 f3 / airLight3 f2 boxes trimmed to foot + leading arc |
| ENG-036 | Full kits for Naruto (Rasenshuriken, Uzumaki Barrage, Nine-Tails Cloak, Substitution, Shadow Clone Barrage) and Sasuke (Chidori Spear, Lion's Barrage, Sharingan counter, Kirin, Amaterasu ultimate); kit baseline + balance pass (ADR 0011) | Claude | done | every move tested with `?debug`; 4 CPU round-robins after the trade fix (288 matches): no errors, ring-outs or stuck states; results in ADR 0011 balance log |
| TOOL-019 | Cross-agent tracking: `docs/NOW.md` (what the user does next) + `npm run status` (live summary from REVIEW/manifest/TASKS) | Claude | done | files: tools/status.mjs, package.json, docs/NOW.md, AGENTS.md, CLAUDE.md, docs/AI_COLLABORATION.md |
| ART-NAR-13 | Merge `art/characters/naruto/KIT.md` into ANIMATIONS/PROMPTS (A39-A42), CHARACTER.md, manifest and TRACKER; generate the kit strips at step 9 | Codex | done | paste prompt N from docs/NOW.md; completed candidates and checks tracked by ART-NAR-FINAL; final batch approved. |
| ART-SAS-12 | Swap in the Kirin `beamCharge`/`beamFire` (KIT.md §4) now; merge the rest of `art/characters/sasuke/KIT.md` (A39-A42); kit strips at step 9 | Codex | done | Merged ADR 0011 kit briefs, Kirin poses and all four kit strips; cut-in retains three-tomoe Sharingan. |
| USR-004 | Sasuke cut-in eyes: keep the 3-tomoe Sharingan (shared by Kirin and Amaterasu) or switch to the Mangekyō | User | done | 2026-10-10: the user approved the default: keep the 3-tomoe Sharingan. default: Sharingan; tell Codex/Claude if you want the Mangekyō |
| ENG-037 | Balance follow-up: re-run the round-robin when real art lands (hurtboxes change) and after any kit tweak; CPU-vs-CPU favours fighters whose neutral special is a rush (combo ender) | Claude | todo | next run: when Sasuke's art lands (ENG-038). docs/TESTING.md "Balance round-robin"; ADR 0011 log |
| ENG-038 | Sasuke 33 % in CPU play next to three art packs: his placeholder hurtbox is 0.68 units wide vs 0.56 for the art packs. If his art is far off, narrow the baked placeholder's hurtbox (not his kit) and re-run the round-robin | Claude | todo | ADR 0011 log run 10-11; src/art/rig/baker.js boxes |
| TOOL-020 | Codex inbox (`docs/agents/CODEX_INBOX.md`) + QA of Killua's full art set and Gojo's first strips; engine minimum hurtbox width | Claude | done | Killua set loads complete; 24 CPU matches clean |
| ART-CRWD-FIX | Killua (hxh) and Gojo (jjk) are fighters now: replace their crowd spectators with other characters | Codex | todo | lead edits art/crowd/roster/hunter-x-hunter.json + jujutsu-kaisen.json, rebuild the queue, reopen if images exist |
| ENG-027 | Mobile landscape play: touch controls, tap menus, rotate screen, fullscreen, PWA manifest | Claude | done | docs/TESTING.md "Mobile" |

## Done

| ID | Title | Owner | Status | Notes |
|---|---|---|---|---|
| M0 | Playable demo: arena, 2 fighters, VS CPU / 2P, rounds, synth audio, Sprite Lab | Claude | done | v0.1.0 |
| M1 | 3D-baked placeholder sprites + DBFZ combat feel | Claude | done | v0.2.0 |
