# Architecture Decision Records

An ADR captures one significant decision: the context, what was decided, and the consequences we accept.
ADRs stop future contributors (human or AI) from re-litigating settled questions, and make it obvious
when a decision should be revisited.

## When to write one

- A new runtime dependency, build tool, test runner or formatter.
- A new core system or a change to a cross-cutting contract (anims.json format, art/SPEC.md, animation names,
  hit detection rules, the save format for bindings).
- A change in how the AIs collaborate or how assets flow.
- Anything you'd have to explain twice.

## Process

1. Copy the template below to `NNNN-short-title.md` (next number, kebab-case).
2. Set **Status: Proposed**. Claude usually drafts. Codex may draft for art-pipeline topics.
3. The user accepts it (**Accepted**) or rejects it (**Rejected**, kept for the record).
4. ADRs are immutable once accepted. To change course, write a new ADR that **supersedes** the old one, and set
   the old one's status to `Superseded by NNNN`. When the new ADR replaces only part of the old one, it
   **amends** it instead: the old ADR gets a one-line `Amended by NNNN` header note and nothing else changes.
5. Mention the ADR in CHANGELOG and link it from the docs it affects.

## Index

| # | Title | Status |
|---|---|---|
| [0001](0001-threejs-vite-browser.md) | Three.js + Vite, browser-only, plain JS | Accepted |
| [0002](0002-hd2d-pixel-renderer.md) | HD-2D pixel renderer (low-res render, nearest upscale, bloom) | Accepted |
| [0003](0003-3d-baked-placeholder-sprites.md) | 3D-baked placeholder sprites | Accepted |
| [0004](0004-dbfz-combat-model.md) | DBFZ-inspired combat model | Accepted |
| [0005](0005-25d-lanes-frame-hitboxes.md) | 2.5D lanes + per-frame hitboxes/hurtboxes | Accepted (implementation in progress) |
| [0006](0006-ai-art-pipeline.md) | AI art pipeline: ChatGPT images, packer, Codex coordination | Accepted (amended by 0007) |
| [0007](0007-art-spec-v2-shippuden-256.md) | Art spec v2: Shippuden designs, ~6.5 heads, 256 px cells, versioned review; Codex generates the images | Accepted |
| [0008](0008-world-art-and-parallel-production.md) | World art (crowd, stage, NPCs, UI, VFX) and parallel Codex production with a claim queue | Accepted |
| [0009](0009-move-system-v2.md) | Move system v2: command specials, special kinds, SUPER button, passives and modes | Accepted |
| [0010](0010-per-character-body-scale.md) | Per-character body scale (shorter Killua, taller Gojo); amends 0007 | Accepted |
| [0011](0011-kit-baseline-and-balance.md) | Kit baseline: every fighter fills the same slots within the same budgets; balance log | Accepted |
| [0012](0012-art-integration-gates-and-hand-anchors.md) | Art integration: approval-gated world art (VFX, crowd, stage, NPC, UI), local candidate preview, per-frame hand anchors | Accepted |
| [0013](0013-pull-requests-in-worktrees.md) | Every feature and character lands through a PR, built in its own worktree (`npm run pr`) | Accepted |
| [0014](0014-defensive-options-and-impossible-cpu.md) | Defensive options (parry, spot dodge, air dodge, wavedash), the IMPOSSIBLE CPU brain, air-juggle tracking | Proposed |
| [0015](0015-throws-and-cancelled-special-startup.md) | Throw and throw break; faster startup for specials cancelled out of a hit | Accepted |
| [0016](0016-showcase-cpu.md) | Showcase CPU: every CPU shows its kit (shared `Showcase` weights), CPU vs CPU plays short combos and mid-range kit for the viewer | Accepted |
| [0017](0017-ultimate-variety-and-rhythm-clashes.md) | Every ultimate its own shape (orb, rampage, reflex; one beam at most), ultimate clashes as a rhythm duel | Accepted |
| [0018](0018-preview-deploys-and-test-lab.md) | A Vercel preview link per PR (`npm run pr -- preview`) and a test lab page | Accepted |
| [0019](0019-generative-lofi-music.md) | Chill generative lo-fi music: seeded composer + WebAudio performer, moods, ducks, music volume | Proposed (in PR) |
| [0020](0020-lying-pose-ground-contact.md) | Lying poses touch the floor: packer ground check, per-frame footprint, grounded KO shadow | Proposed (in PR) |
| [0021](0021-scale-gate-and-depth-normalized-sprites.md) | Measured scale gate for every packed frame; depth-normalized fighter sprites in fight cameras | Proposed (in PR) |
| [0022](0022-combo-escape-and-true-combos.md) | Combo escape: hold-Guard tech, once-per-round Burst, the blue counter for escapable combos, callout banners | Proposed (in PR) |
| [0023](0023-canon-power-up-styles.md) | Canon power-ups as per-fighter charge-style data under a VFX budget | Proposed (in PR) |
| [0024](0024-ground-damage-decals.md) | Ground damage: force tiers, element styles, a separate decal atlas kind | Proposed (in PR) |
| [0025](0025-cpu-defense-personas.md) | CPU defense personas, reads and exchanges for CPU vs CPU (amends 0016) | Proposed (in PR) |
| [0026](0026-combo-composer-and-bounce-budget.md) | Seeded CPU combo composer and a per-combo bounce budget (amends 0016) | Proposed (in PR) |
| [0027](0027-beam-clash-energy-struggles.md) | Beam clashes: energy specials that meet become a struggle; show director for CPU vs CPU | Proposed (in PR) |
| [0028](0028-timed-impact-tech.md) | Timed impact tech (Smash style): a fresh Guard press before a floor or wall impact; wall tech, wall jump, lockout | Proposed (in PR) |
| [0029](0029-title-style-scale-baseline.md) | The approved title-style cells are the cast and new-character scale/anatomy baseline; older numeric targets are historical | Accepted |
| [0030](0030-tech-recovery-animations.md) | Tech recovery animations: techGround, techRoll, wallTech on the tech's clock, wall anchoring, unread beats are not a scale pass | Proposed |
| [0031](0031-attack-alt-animations.md) | Attack alts: optional `<anim>Alt` strips for the nine attacks and both hit reactions, same frames and phases, deterministic Thue-Morse alternation, fail-soft to the base, packer hit-box check | Proposed |
| [0032](0032-goku-and-luffy-kits.md) | Goku and Luffy join: their kits (Goku keeps the cast's one beam), and the `laneStrike` ultimate kind for Gigant Pistol | Accepted |
| [0034](0034-beam-clash-visuals.md) | Beam clash visuals: drawing fixes for both clash tiers, a stream shape per move (`stream.style`), the optional `beamStruggle` pose and five clash effects | Proposed |
| [0033](0033-claude-codex-relay.md) | Claude-Codex relay: Claude queues the inbox prompt into the lane's Codex chat, Codex rings a git-ignored doorbell that wakes Claude's background watcher; per-lane hop limit and pause switch; approvals never relayed | Proposed |
| [0036](0036-online-rollback-netcode.md) | Online play: own rollback module, simulation made replayable first (sim-owned control basis, frame-based flow, view events, save/restore, deterministic math), lobby server on Cloudflare Durable Objects, inputs relayed, spectators replay; determinism spike results | Proposed |
| [0037](0037-approvals-in-claude.md) | Approvals happen in Claude: Codex rings the relay `--for user`, Claude asks with a question box and relays the user's quoted answer (`USER APPROVAL via Claude`); amends 0033 | Accepted |
| [0038](0038-melee-clash.md) | Melee clash: lights / heavies meeting while both are live cancel out and chain (CLASH ×n, CLASH BREAK! at 5); a heavy beats a light; the `clashBack` bounce; CPUs seek clashes | Accepted |
| [0039](0039-approvals-desk.md) | One approvals desk: only the Claude chat `0 - Approvals` asks the user; Codex rings for the user and other Claude chats' `relay ask` land in one queue (`.relay/asks/`), watched by `relay wait all`; `/approvals` + a SessionStart hook restore it after chats are deleted; amends 0037 | Accepted |
| [0040](0040-desk-on-off-switch.md) | The user's on/off switch for the desk: `relay desk off` makes every chat ask the user itself (the ADR 0037 way; `relay ask` queues nothing, exit 6), `desk on` restores 0039; amends 0039 | Accepted |
| [0041](0041-fighter-pack-scale.md) | `packScale` in the manifest resizes a whole fighter when packed (bodyHeight, frameOffsets, hitboxes.json anchors); Goku and Luffy pack at x0.92 to sit on the cast's 1.17 px per cm of canon height; amends 0029 | Accepted |
| [0042](0042-smash-directional-normals.md) | Smash-style directional normals: the stick picks tilts, smash attacks (charged) and forward / back / up airs; only the jab strings chain, the rest link; short hop, double jump, fast fall, facing held through a jump; the DBFZ juggle kept; stand-in strips until the art; CPUs keep their moves until ENG-111 | Accepted |
| [0043](0043-fast-boot-and-loading-screen.md) | Title first, the rest behind it: boot loads only the title art and fighter metadata (~0.5 MB), the fighters and world art load in parallel behind the title and fights wait for them (`whenLoaded`); plain art URLs revalidated by ETag instead of `?v=<now>`; a byte-weighted loading bar; portrait phones see the logo and title art | Accepted |
| [0044](0044-signature-techniques.md) | Signature techniques: 256 px HD effect cells on their own page (`atlas_hd.png`), shadow clones as `kitState.crew` data drawn by `CloneCrew`, cloaks (`ChakraShroud`) and transformations (`engulf`) drawn on the body, a rush special's own `blastFx` | Accepted |
| [0045](0045-naruto-four-tails-beam.md) | Naruto's ultimate is the Four-Tails beam (Tailed Beast Ball): the shared beam with the transformation as `def.beam` data (`flashPose`, `shroud`, `gather`, `muzzle`); amends ADR 0017's one-beam rule (user decision) | Accepted |
| [0046](0046-palette-reserve.md) | `paletteReserve` in the manifest gives strips drawn in other colours (a transformation) their own share of a fighter's 48 colours, taken from the shared entries the other strips need least; Naruto's Four-Tails fox reserves 8 | Accepted |
| [0047](0047-sasuke-signature-techniques.md) | Sasuke's signature techniques as data on moves, shots and supers: a rush's `trench` and `hitPose`, a shot's `lance` / `orient` / `burstFx`, a dive's `shadow` (Lion's Barrage), a counter's `current`, a sky strike's `storm` (Kirin: clouds, stage dim, camera lift, the dragon), an ignite's `blastFx` / `hitFlash` / clinging `burn.fx` (Amaterasu) | Accepted |
| [0048](0048-live-announcer.md) | The live announcer: a view-only director (`src/world/announcer.js`) walks the MC around the ring behind the fight, calls the rounds, counts over the fallen fighter and presents the winner; lines are data (`announcerLines.js`), shown as small DOM captions above his head under the HUD (a background touch, no balloons); `npcCue(kind, info)` carries who and what | Accepted |
| [0049](0049-gojo-signature-techniques.md) | Gojo's signature techniques as view-only data: a pull's `look` (Blue's HD point, dragged rubble, implosion), a shot's hand-tick `fx` / `fxForm` and a projectile's `halo: false` (Red), Blink on the shared teleport `vanishFx` / `appearFx`, Infinity's `stopFx` / `hang`, an orb's `look` with the drawn palms `def.hands` (Hollow Purple), a domain's `open` / `flood` / `shatter` (the black sphere, the cosmos, the glass) and a super's `glint` (Six Eyes) | Accepted |
| [0050](0050-goku-signature-techniques.md) | Goku's signature techniques: the Spirit Bomb SUPER (a sky strike's `bomb`) and a Kaio-ken mode on Back + Special (amends 0032), a beam's `chant` / `originFx` / `headFx`, a mode's `burstFx` / `aura` / `shell` / `tint`, a rush's `coil` (Dragon Fist), a shot's `every` / `muzzle` / `halo`, a teleport's `shimmer`, a hitless `shadow` chase, a one-shot intro transformation | Accepted |
| [0051](0051-luffy-signature-techniques.md) | Luffy's signature techniques: rubber limbs carried on from where a strip's limb leaves the cell (the shared `limb` on a shot, a rush's `sweep`, a dive's `grab`, a lane strike's `arm`), a palette swap on the body (`recolor` beside the shared mode look: Gear Second's pink skin), a power-up's `ghost` / `names` (JET), flurry and lane-strike options (the fist storm, the Jet Bazooka, the chibi after Gear Third) | Accepted |
| [0052](0052-killua-signature-techniques.md) | Killua's signature techniques as data, on the shared pieces (mode look `aura` / `shell`, `limb`, `vanishFx` / `appearFx`, the hand tick): a mode's `blink`, a shot's `cling` (an effect kept on the stunned body) and `returns` (the yo-yo), a teleport's `afterimage` / `streak` (Rhythm Echo, Whirlwind's counter), lingering crew afterimages, a dive's `gather` / `column` / `landFx` / `diveAnim` (Narukami), a flurry's `zigzag` (Speed of Lightning) | Accepted |
| [0053](0053-hd-effect-pages.md) | HD effects on one page per owner (`atlas_hd_shared.png`, `atlas_hd_<fighter>.png`, at most 2048 x 4096 each, `owner` on the effect): a match loads the shared pages and its two fighters' only (`Effects.prepare`), procedural stand-ins until a page is in; `atlas.png` is the shared page itself | Accepted |
| [0054](0054-god-spectator-level.md) | GOD, a CPU vs CPU-only level above IMPOSSIBLE: MasterBrain style `god` with new knobs that default to today's values (`rallyDecay`, `rallyParry`, `clashChain`, `energyAnswer`, `exactTech`) and a `god` combo persona; against a person `?level=god` is IMPOSSIBLE | Accepted |
| [0055](0055-clash-moves-own-art.md) | Beam clashes in each move's own art (drawn HD `band`s for the streams, `clashKnot`, the Kamehameha head pressed into the collision), Reversal: Red as its orb shoved forward, Hollow Purple clear of the floor, the winner holding its push pose while its attack stops at the loser in the move's own burst, and the Gigant Pistol as a clash body for beam and orb ultimates | Accepted |

## Template

```markdown
# NNNN. Title

- Status: Proposed | Accepted | Rejected | Superseded by NNNN
- Date: YYYY-MM-DD
- Deciders: User, Claude (, Codex)

## Context
What forces are at play? What problem are we solving? What constraints?

## Decision
What we will do, stated plainly.

## Alternatives considered
Options we rejected, and why.

## Consequences
What becomes easier, what becomes harder, what we must now maintain, and when to revisit.
```
