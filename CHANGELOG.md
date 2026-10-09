# Changelog

All notable changes to GCD Tourney are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) (0.x while in development, see
[docs/CONTRIBUTING.md](docs/CONTRIBUTING.md#versioning-and-releases)).

Every change adds a line under **Unreleased** in the right group: Added, Changed, Deprecated, Removed,
Fixed, Security. Reference task ids and ADRs where useful.

## [Unreleased]

### Added
- Codex Prompt 3 (3a Killua, 3b Gojo) in `docs/agents/CODEX_PROMPT.md` to start both fighters' art from the S1 model sheets; Prompt 1 now uses each character's body scale (ADR 0010).
- Two new fighters: **Killua** (Godspeed era: Narukami, Rhythm Echo, Thunderbolt, Godspeed mode, Godspeed:
  Whirlwind super, Lightning Palm) and **Gojo** (Lapse: Blue, Reversal: Red, Blink, Infinity counter + passive,
  Domain Expansion: Unlimited Void super, Hollow Purple), with 3D placeholder models (Gojo's blindfold lifts for
  the Six Eyes on his super and cut-in), CPU support, and spec v2 art briefs, prompts and manifest/TRACKER rows
  (ENG-028, DOC-008).
- Move system v2 (ADR 0009): directional specials (Special + →/↑/↓, air ↓), special kinds (shot, teleport,
  pull, dive, counter, mode), a SUPER button for second supers (keyboard H/B · P1 T · P2 ' · L2/LT · touch
  SUPER), the Godspeed mode bar, a domain stage (Unlimited Void), and kit move lists on character select.
- ADR 0010: per-character body scale (Killua 182 px, Gojo 215 px). The packer reads `standingBodyPx` per
  character, and the 4 optional kit animations (`specialForward`, `specialUp`, `specialDown`, `superPose`) are
  in SPEC.md, the template and the manifest defaults.
- Naruto expressions v02 candidate applies the approved shorter haircut across all nine expressions; v01 fixed expression reference remains until user approval (ART-NAR-12).
- User approved Naruto shorter-hair model sheet v02; fixed model_sheet.png now anchors subsequent hair revisions (ART-NAR-12).
- Naruto model-sheet v02 hair candidate: shorter crown/rear spikes and temple tufts replace long cheek locks; approved v01 reference is retained pending user review. Mobile gallery now supports newer reference candidates (ART-NAR-12, TOOL-017).
- User approved Naruto and Sasuke run v02 on 2026-10-09; both motion versions are now approved. Naruto shorter-hair reference revision is tracked separately (ART-NAR-12).
- Mobile landscape play: floating joystick + touch buttons (ULT / VANISH one-tap chords, ki dimming), pause
  button, tap-friendly menus with a BACK button, tap to skip the intro, rotate-to-landscape screen, fullscreen +
  landscape lock (Android) and a web manifest (iOS Add to Home Screen), safe areas for notched phones, a TOUCH
  tab in the controls panel with button sizes, and the fight framed clear of the buttons.
- Naruto and Sasuke run v02 candidates: preserved v01 artwork, corrected horizontal placement and flight lift, recovered Sasuke face pixels; eight frames each, 48-color packs with zero final warnings. Both await user review (TOOL-013, ART-NAR-03, ART-SAS-03).
- Mobile art review gallery with exact animation timings, frame stepping, zoom, original images and a validated allowlist export for HTTPS phone review (TOOL-014).
- Naruto and Sasuke idle v01 candidates with preserved A/B source parts, eight packed frames each, 48-color output and browser QA; user approved both on 2026-10-09 with documented deviations, and unchanged idle_approved.png references are saved (ART-NAR-03, ART-SAS-03).
- Naruto and Sasuke S2 expression-sheet v01 candidates from the approved model sheets; Naruto selected from two attempts and Sasuke from one, with expression, whisker and Sharingan QA; both approved by the user on 2026-10-09 and copied to fixed expressions.png references (ART-NAR-02, ART-SAS-02).
- Spec v2 Naruto and Sasuke S1 model sheets v01, both approved by the user on 2026-10-09 with fixed-name reference copies and preserved measured QA (ART-NAR-01, ART-SAS-01, USR-002, USR-003). Remaining prompt/spec wording conflicts are recorded in DOC-007.
- World art pipeline (ADR 0008): 576-spectator crowd roster (356 cameos, 220 originals), stage and NPC
  briefs and prompts, `npm run queue` claim queue for parallel Codex agents, crowd atlas loader with
  idle/cheer/shocked frames, a unique seat shuffle per match and 471 seats.
- Naruto S1 model-sheet review candidate and QA notes; exact scale and color cleanup remain open (ART-NAR-01).
  Spec v1; archived in `reference/_old/` by the spec v2 restart (see Changed).
- Training room inside the controls menu: your fighter mirrors your input in real time against a
  configurable dummy (stand, guard, hop, fight back), with input history, health refill and no timer (ENG-001).
- Controller layout diagrams for keyboard, PlayStation and Xbox, with a toggle and automatic device
  detection (ENG-002).
- Key and gamepad button rebinding, saved per browser, with reset to defaults (ENG-003).
- Unobtrusive mute toggle in the top corner of the screen, in sync with the `M` key (ENG-004).
- 2.5D lanes: fighters face screen-left or screen-right, attacks auto-step into the opponent's depth lane, and
  melee hits require the same lane ([ADR 0005](docs/decisions/0005-25d-lanes-frame-hitboxes.md), ENG-005).
- Per-frame hitboxes and hurtboxes (`boxes` in anims.json) for baked and custom sheets. Impact sparks appear at
  the contact point (ENG-006).
- Custom art loading contract: `complete` flag, `?art=custom` preview flag, `portrait.png`, `cutin.png`,
  `select.png`, and a custom VFX atlas with procedural fallback (ENG-007, ENG-008).
- HD render mode for hi-res sheets (ENG-009).
- Training room extras: holographic practice stage, hitbox/hurtbox viewer (HITBOXES toggle, or `?boxes`),
  Tab hides the panel, Backspace / Create resets positions, gamepad-navigable controls page in the pause menu.
- Per-move `boxPad` in `src/game/moves.js`: hit boxes grow slightly (air attacks more) before the overlap test.
- Art pipeline: the `art/` folder with README, SPEC (hi-res sprite spec v1), STYLE_GUIDE, PIPELINE, TRACKER,
  `manifest.json`, a character template, Naruto/Sasuke/VFX/UI briefs and ChatGPT prompts
  ([ADR 0006](docs/decisions/0006-ai-art-pipeline.md), DOC-002).
- Sprite packer `tools/pack-sprites.mjs` (`npm run sprites [id|vfx]`) with auto boxes, `hitboxes.json`
  overrides and a QA report (TOOL-001).
- Long-term SDLC docs: CLAUDE.md, AGENTS.md, docs/ (architecture, combat design, adding a character, AI
  collaboration, testing, roadmap, contributing, task board, code style), ADRs 0001-0006, this changelog,
  and Codex prompts in docs/agents/ (DOC-001).

### Changed
- Saved key bindings move to `gcd.bindings.v2` (resets custom bindings once). Gamepad L2/LT is SUPER now
  (guard stays on L1/LB).
- The CPU uses specials more often with fighters that have a kit, answers attacks with a counter, and punishes
  frozen or popped-up opponents.
- Art spec v2 ([ADR 0007](docs/decisions/0007-art-spec-v2-shippuden-256.md), amends ADR 0006): Naruto
  Shippuden designs at about 6.5 heads (serious anime proportions instead of the chibi ~4.3-head Part 1
  look), 256×256 cells, pivot [128,240], pixelsPerUnit 128 (~200 px standing body, same world size), ≤ 48
  colors per character (packer warns > 64), new landmarks, contact zones, effect anchors and one shared
  body-height table. Codex now generates the images with its built-in image generator and the user approves
  them. Every generated image is saved as `<asset>_vNN.png` (never overwritten; the packer uses the highest
  version, `raw/_rejected/` is ignored) and queued in the new `art/REVIEW.md`. The v1 Naruto candidate is
  archived in `reference/_old/`, all art statuses are reset to `todo`, and Codex Prompt 0 restarts the art
  with the Naruto and Sasuke model sheets in parallel (DOC-005, TOOL-006). The in-game 3D placeholder stays
  chibi (112 px, ppu 44) until ENG-016.
- Art docs: one generation order everywhere (manifest `step`; Naruto prompts reordered with a step column),
  0-based frame labels in the Naruto briefs, UI images saved straight to `ui/<name>.png`, character effects
  named `<charId>_<effect>` in `art/vfx/raw/_proposed/`, Sasuke drawn at Naruto's body scale (upright
  `bodyHeight` −6 px), Naruto `win` keeps its authored timing, one cut-in background rule (DOC-004).

### Fixed
- Body separation could push a fighter pinned at the ring barrier out of the ring (seen in CPU soaks).
- Ground moves without a lunge kept sliding on the walk speed.
- Spec v2 doc review: Codex prompts no longer upload `reference/source/` pictures, save one version per
  round, bind Prompt 1 to one character, stage explicit paths on one shared art branch and never lower a
  status; ADR 0007 amended (heavy F04 zone y 22-46, airLight2/special are LOW, fix attempts are
  `raw/<anim>_NN_fixMM.png`, 9 px hitbox slack); the template PROMPTS splits long strips into Part A/B with
  SIZE lines; Sasuke's splits keep hit frames in one image; Naruto's launched/superDash poses keep the
  lowest point centered (DOC-006).
- Packer: rejecting the only version of a character's art removes the stale packer-made sheet from
  `public/characters/<id>/`, so rejected art no longer stays in the game (TOOL-007).
- Code review of the lanes/hitbox work: the heavy launcher could never hit (placeholder uppercut pose), vanish
  reappeared out of range, air combos dropped after the first hit (the attacker now rides along with a juggled
  victim), the ultimate windup swung the camera ~90°, and the intro could show both fighters facing away.
- Menus: a frame with two menu events could crash and freeze the game loop; the confirm press that resumes or
  starts training no longer also jumps / attacks; gamepad rebinding (per-pad capture, Options cancels, the bound
  button no longer acts or closes the page); stolen bindings are reported; keys are de-duplicated across P1/P2.
- Training: camera stuck after a reset during an ultimate or clash, the JUMP dummy never refilled health, clash
  prompt showed versus keys, input history miscounted neutral frames, debris rendered black (no light).
- Super dash projectile immunity could stick forever; GPU resources leaked on every character switch; custom
  art packs without `idle` crashed `?art=custom`; broken VFX atlases now log a `[vfx]` line.
- Packer keeps an explicit `"hit": []` override ("cannot hit") instead of falling back to reach.
- Attacks could register as hits while the fist or foot visibly missed the body (depth offset in the 3D
  ring, plus a forgiving cylinder hit test). Fixed by lanes + frame boxes (ENG-005, ENG-006).
- Packer: VFX frames keep their position in the strip row (a spark flare, a rising puff or a leaning
  flame tip no longer re-centers the frame), `glow` grey rings become white + alpha steps, custom craters
  pack at full size, and `ui_*`, `fx_*`, `*_fixNN.png` raws no longer raise warnings (TOOL-005).
- Art briefs contradicted the spec: Naruto strike targets now sit in the SPEC contact zones, the Rasengan
  thrust palm stays inside the engine orb, the Chidori anchor is described as the engine draws it
  (follow-up ENG-015), VFX sizes match what the packer outputs, and smoke is cool white/grey (DOC-004).

## [0.2.0] - 2026-10-04

Reconstructed from the codebase when the changelog was introduced.

### Added
- 3D-baked placeholder sprites: chibi rig built from primitives, keyframed poses, toon shader bake with contour
  lines, outlines, pixel anime eyes and motion smears; HUD portrait and cut-in eye strip
  ([ADR 0003](docs/decisions/0003-3d-baked-placeholder-sprites.md)).
- DBFZ-style combat ([ADR 0004](docs/decisions/0004-dbfz-combat-model.md)): auto combo, launcher + chase,
  air combo, spike + ground bounce, wall bounce off the ring barrier, homing super dash, vanish, signature rush
  specials (Rasengan, Chidori), air projectiles, 3-bar ultimate beam with super flash cut-in, beam clash
  mash-off, special clash, ki economy, damage scaling, hitstun decay, 22-hit combo cap, air tech.
- KO destructive finish: the loser flies out of the ring and crashes into the stands.
- Cinematic camera director (intro flythrough, fight, focus, clash, KO, victory), hitstop, directional shake,
  zoom punch, slow-mo, impact frames, speed lines.
- CPU AI with Easy / Normal / Hard that drives the same virtual pad as players.
- Debug URL helpers (`?fight=`, `?debug`: `step`, `press`, `hold`, `tap`, `freezeCpu`, `snap`).

## [0.1.0] - 2026-10-04

Reconstructed from the codebase when the changelog was introduced.

### Added
- Browser demo built on Three.js + Vite ([ADR 0001](docs/decisions/0001-threejs-vite-browser.md)) with the
  HD-2D pixel renderer: low-res render, nearest upscale, bloom and grade
  ([ADR 0002](docs/decisions/0002-hd2d-pixel-renderer.md)).
- Tournament grounds: tiled ring, grass, temple, stands with an instanced cheering crowd, gate, trees, sky.
- Two fighters (Naruto-style and Sasuke-style), VS CPU and local 2 Players (shared keyboard or two gamepads),
  best of 3 rounds of 99 seconds, title / mode / character select / pause / results menus.
- Fully synthesized WebAudio sound effects, music and crowd (no audio files).
- Procedural VFX atlas and environment textures.
- Sprite Lab (`/sprites.html`): preview animations, copy ChatGPT prompts, import strips, export sheets.

[Unreleased]: #unreleased
[0.2.0]: #020---2026-10-04
[0.1.0]: #010---2026-10-04
