# Changelog

All notable changes to GCD Tourney are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) (0.x while in development, see
[docs/CONTRIBUTING.md](docs/CONTRIBUTING.md#versioning-and-releases)).

Every change adds a line under **Unreleased** in the right group: Added, Changed, Deprecated, Removed,
Fixed, Security. Reference task ids and ADRs where useful.

## [Unreleased]

- Naruto backDash v03 corrects push-off, backward-hop balance and landing with original attempt2; pack passes. Added per-part attempt-cap evidence for ten remaining technical holds.

- Naruto: draft neutral-baseline checkpoint for all42 animations;32 packed candidates and10 technical holds, explicit unmeasured scale states, immutable sources, heads audit and browser review gallery. No new animation approved (ART-NAR-PROP,2026-10-11).

- art(naruto): queue idle v04 at the approved seven-head-model gate; measured stitch, independent idle consistency audit and darker-gold hair probe declaration. Preserve approved idle v02 until review.

- Tools: `npm run pr -- merge` now deploys the merged main to production (https://gcd-tourney.vercel.app) after publishing it, so a merge is live; `--no-deploy` skips it, and a failed deploy never undoes the merge (user request 2026-10-10).
- art(naruto): add seven-head proportion redraw brief and model_sheet v03 candidate with cast lineup and mobile review; model approval required before idle. Raw palette and source-scale caveats documented.
- Sasuke: document seven-head full-redraw plan and queue model_sheet v02 with measured cast lineup; model approval stop, no new idle or shipped sprite changes.

- **CPU combo composer** (ENG-072, ADR 0026): CPU vs CPU combos are long, varied and different every match: each CPU draws a persona from its kit (rushdown, juggler, vanish artist, wall bouncer, kit showman) and composes true combos only (2+ frames of margin, read from the art's hit boxes): wall-bounce handball, vanish ping-pong, relaunches, kit grinds; IMPOSSIBLE and INSANE play the optimal persona. A per-combo bounce budget for everyone (3 wall bounces, 32/28/22 f; 2 ground bounces, 30/24 f; it was unlimited) and a super that grabs a reeling victim carries the combo on. Every match shows WALL BOUNCE! / WALL BOUNCE ×2! / HANDBALL!, GROUND BOUNCE!, RELAUNCH! and VANISH ×2! banners, a technique ticker beside the combo counter and an end-of-combo rating (GREAT, AMAZING, LEGENDARY, STYLISH!). `?seed=N`, `comboStats()` and `soak()` under `?debug`; lab Handball and Vanish ping-pong scenarios and CPU YOU.
- CPU combo composer review fixes (ENG-072): the KO'ing hit counts in a combo's rating and record, the composer closes its combo on a KO or time-up (not in the next round), and waiting for a bounce or firing a three-bar move is checked against the victim's stun like any link (tech share 12 % → 10 %); "one highlight per round per CPU" is still not met (ADR 0026, open design decision).
- **Beam clash** (ENG-073, ADR 0027): two energy specials meeting head-on (Narukami, Reversal: Red, Chidori Spear, Great Fireball; Naruto drives a Rasengan / Rasenshuriken into one), or one fired while theirs flies at you, become a BEAM CLASH: both attacks turn into streams in their own colors, a 4.5 s rhythm struggle decides it (winner 120 + wall bounce, draw 45 each); CPU vs CPU shows at least one every match at any level (a spectator-only show director picks the moment), CPUs at every level sometimes answer your shots (only when a clash can start), lab scenarios Beam clash / Answer an energy shot / Beam clash from the air.
- **CPU defense showcase** (ENG-071, ADR 0025): CPU vs CPU now parries, spot dodges, backsteps (new BACKSTEP callout), wavedashes out of shots, wins vanish wars, reads approaches and blocked strings, reverses out of gappy combos and wake-ups, escapes after techs and trades parry rallies, with a hidden per-match defense persona (parrier, dancer, phantom, rock, scrapper) so every fight defends differently; fixed: CPU answers to vanishes, teleport strikes and late-drawn strikes (Chidori) now fire, an answer picked mid-dash is re-picked, and Easy-Hard no longer lose reactions to plan changes or stall against the barrier.
- Integrated the approved art batch (PRs #24-30) into main: Naruto Four-Tails beamCharge v05 / beamFire v07 and heavy v07 / charge v04, Sasuke heavy v06 and light2 v02 / light3 v02 / special v03 (charge stays v02), Killua Whirlwind beamCharge v05 and heavy v05 / charge v07, Gojo model sheet v06. Each fighter repacked with `--quantize 48` on main's packer, so both batches per fighter share one palette; the Four-Tails `rampage` keeps its new poses with main's ground styles.

- Record user approval of Killua heavy v05 and charge v07 with documented QA caveats accepted. Artwork unchanged; ready for integration.

- Killua heavy v05 candidate rebuilds the reaching animation into a coiled, torso-driven forward rising claw strike with compact recovery; v04 rejected and archived, exact idle ending and gameplay timings preserved. PR30 includes synchronized before/after playback; all candidate art remains unapproved.

- Art: Killua heavy v04 repairs the three middle arm/hand poses, preserves idle recovery, and adds a packed before/after review to PR30; unapproved.

- Killua review candidates: heavy v03 fixes the raised-claw clipping and recovery size pop; charge v07 stabilizes feet and adds shoulder twitches. Preserve rejected history and prior approvals; include cast lineup and committed public review gallery.
- Record user approval of Naruto heavy v07 and charge v04 (2026-10-10, "approve everything"), including documented QA caveats; ready for Claude integration.

- Naruto heavy v07 candidates repair active fist contact and exact idle recovery; charge v04 adds chest expansion, with residual foot drift documented. All new art remains unapproved.
- Sasuke: record user approval for heavy v06; existing QA limitations accepted. Approved charge v02 remains active; rejected v04 stays archived.

- Sasuke: reject charge v04 per user feedback and restore approved charge v02; preserve rejected source history and heavy v06 candidate.

- Sasuke heavy-charge: versioned unapproved candidates, strict packing, source landmarks, cast lineup and a portable phone review gallery; approval versions unchanged.
- Sasuke: record user approval for light2 v02, light3 v02, special v03; existing QA limitations accepted. Approved charge v02 remains active; rejected v04 stays archived.

- Sasuke size-pops: versioned unapproved candidates, strict packing, source landmarks, cast lineup and a portable phone review gallery; approval versions unchanged.
- Record user approval of Killua Whirlwind beamCharge v05; archive superseded pending v04 with documented QA caveats accepted. Artwork unchanged; ready for integration.

- Art (ART-KIL-WW): Whirlwind beamCharge v05 raised-heel ready stance, preserved v04 history, anatomy sidecars, cast lineup and hosted review gallery. All art remains unapproved; beamFire sources, frames and metadata unchanged.
- Record user approval of Naruto beamCharge v05 and beamFire v07 (2026-10-10, "approve everything"), including documented QA caveats; ready for Claude integration.

- Naruto Four-Tails candidate roar v05 and pounce/slams v07 restore four tails per pose, preserve calibrated skull scale, and wire the ultimate to the drawn shroud. Candidates remain unapproved.
- Changed: `npm run pr -- start --art <id>[,<id>]` checks out only that character's (or art kind's) raw art, about 0.5 GB per art worktree instead of 2.2 GB with `--full`; new `npm run pr -- prune` removes clean worktrees of merged branches. AGENTS.md forbids hand-made project copies (they had filled 15 GB).
- Docs (OPS-007): require sparse real Git worktrees, prohibit project-copy fallbacks and art `--full`, reuse task worktrees across versions, and report merged worktrees and cleanup paths.

- Art approval: user approved all current candidates across PRs #24–30; retain Sasuke charge v02, promote Gojo model v06, and hand off sequential integration to Claude. No production deployment in this approval pass.

- Tools: a measured **scale gate** for every packed frame (TOOL-025, TOOL-008, ADR 0021): the packer compares each frame's head (hair included) and feet with the fighter's approved idle, refuses to pack a fighter whose unapproved strip is off (approved ones are listed until ART-SCALE-02 fixes them; `--strict-scale` for all), honours manifest exemptions only for the strip version they name, can refit a wrongly sized raw strip (`auto-head`), and `npm run stitch` joins two-part strips with a measured factor; `npm run scale` writes heads contact sheets, a report, a baseline and head scale guides; `?scaleaudit`, `scaleReport()` and the test lab's head boxes show it in game; brief for Codex in art/scale/SCALE_FIX_BRIEF.md.
- Fixed: `npm run deploy` no longer piles up `gcd-deploy-*` exports in %TEMP% (hundreds of MB each): it retries cleanup for ~15 s and sweeps leftovers older than an hour at the start of every deploy.

- Ops (OPS-006): install local repository-specific PR edit approval rule for future PR numbers; document separate body preparation and repo-first command order. Filesystem write grants unchanged.

- Art review follow-up: restore Sasuke's approved charge v02 per user decision; hand off Killua heavy v05 with stronger forward claw strikes and compact recoil, still unapproved.

- **Ground damage that scales with power** (ENG-070, ADR 0024): the floor cracks, craters and scorches by how hard it was hit (five tiers, from a 1.5-unit hairline crack to a 7-unit crater with rubble, jutting floor slabs and a dust ring), in each move's own look (spiral scour, lightning burns that glow and cool, fire, black flame, wind cuts, claw furrows, cursed fractures, Hollow Purple's trench), grows one crater under repeated slams, lands where an airborne victim crashes, cracks the ki barrier on wall bounces, leaves dirt craters on the grass and a hole in the stand wall on KOs, and grows a fracture under a charging fighter from the power-up's crack level (Naruto bar 2, Sasuke MAX; Killua and Gojo keep the floor whole); lit, clipped at the ring edge, holo in training, clean every round. Procedural decals until Codex's decal art is approved; `groundDemo()` / `groundTest()` under `?debug`, lab scenario "Ground damage".
- **Combo escape** (ENG-068, ADR 0022): hold Guard while being hit to tech out at the first gap (with a direction) or tech roll on landing (not after hard knockdowns); Guard + Special while hit is a once-per-round **Burst** (2 bars, blockable: burst bait) with a gem by each ki gauge; the combo counter turns **blue** when the combo had an escapable gap (training shows the gap in frames); stacked technique banners for PARRY!, DODGE!, AIR DODGE!, TECH!, TECH ROLL!, BURST!, THROW BREAK, REVERSAL, PUNISH! and WAVEDASH in every match; the CPUs and the training dummy (DUMMY TECH / DUMMY BURST) use all of it; lab scenarios for each.
- **Chill generative lo-fi music** (ENG-065, ADR 0019): the grating 148 bpm taiko loop is replaced by songs composed fresh each time (koto plucks, warm pads, soft bass; a brushed beat at 86 bpm in fights, ambient 72 bpm menus with wind chimes, a calmer training mood) that follow the fight's heat, crossfade between moods, dip under pause, clashes and KOs, never burst after a stall, and get a **MUSIC** volume row in the pause menus.
- Changed: getting hit no longer turns a fighter solid white (ENG-064). A hit pops white for 1-3 frames by weight, then keeps the art readable with a brightened body and a glowing rim (warm on heavy hits, gold on smash, orange on counter hits) that fades out; full white stays only on counter hits (not whiff or recovery punishes), supers and KOs (1-bar rush specials pop 2 frames), multi-hit ticks never re-pop, and the hitstop shake no longer shimmers. Compare styles with `?flash=pop|tint|rim|classic|off` or the lab's Tools chips; the lab has a Counter hit scenario.
- Fixed: the fighter nearer the camera no longer draws 9-23% bigger than the other one when they stand apart in depth or one is in the air; in the fight and clash cameras both fighters are scaled to one on-screen size (visual only: hit boxes and hand anchors unchanged, held Rasengan/Chidori effects follow the scaled hand; close-ups keep true perspective; `?depthscale=0` compares) (ENG-067, ADR 0021).
- Fixed: the results screen no longer shows a second, smaller winner sprite or covers the winner (ENG-063): the match ends on a cut to the winner alone (the KO'd loser leaves the shot), whole and undimmed beside a slim side panel (a bottom bar in narrow windows) with the WINNER tag, name and subtitle, on a steady swaying hero camera that never mirrors the sprite; clicking TITLE there (or QUIT TO TITLE in pause) now reaches the title instead of mode select.
- Art handoff: Killua heavy v04 fixes frames 4–6 arm/hand flow in PR #30; update review preview links, keep all new art unapproved.

- Docs (OPS-004): verified direct Git executable also fails working-directory resolution under the restricted profile; unattended worktree/commit/merge workflow remains blocked and permissions stay narrow.
- art(gojo): record user approval of model sheet v06 and promote its fixed reference; retain measured QA caveats. No animation redraw.

- Art (ART-GOJ-BUILD): preserve model v05 history and add unapproved v06 with corrected neutral poses/profile, exact half-scale lineup and preview gallery; record remaining source-scale/palette failures after three attempts. Approved references and runtime art unchanged.

- Docs (OPS-005): document verified machine-local Vite build/dev adapter under restricted reads (production build and HTTP checks pass without new read grants); distinguish remaining Git CLI directory-resolution failure from successful Git file writes.

- Docs (OPS-004): record tightened local MXC read allowlist, positive/negative access probes, and unresolved drive-root traversal failure in Node/Vite; unattended-build setup remains blocked.

- Docs (OPS-004): authorize autonomous project work with separate task worktrees and one sequential integration coordinator; document the local Codex permission profile and Windows Git ACL repair, preserving artwork approval gates.

- Docs (art handoff): replace the sandbox-only handoff with seven real batch PRs (#25, #29, #28, #27, #30, #26, #24) and verified hosted review previews. Preserve version history and approval gates; identify remaining Naruto charge, Sasuke heavy and Gojo model defects. No art merged or production deployed.

- Docs: art briefs for Codex: Gojo's broader adult build and full 42-animation redraw (art/characters/gojo/BUILD_REDRAW.md, ART-GOJ-BUILD), and new `heavy` launchers and `charge` power-ups for Naruto (a bursting uppercut), Sasuke (the Lion's Barrage opening kick) and Killua (a spiraling rising claw rake), in each KIT.md (ART-HEAVY-01, ART-CHARGE-01); inbox items per thread.
- Tools: `npm run lineup` draws the cast side by side on one floor line (idle, run, heavy) with each fighter's standing height and shoulder width, and flags a build outside its declared class (`art/scale/builds.json`), so a new fighter who reads too small or too thin is caught in review (TOOL-023). It flags Gojo today (ART-GOJ-BUILD). `--candidate` lines up an unpacked model-sheet figure.
- Docs: a size and build standard for every fighter (art/CHARACTER_SCALE.md, DOC-009): canon height to standing pixels, build classes with shoulder-width bands, a mandatory cast lineup on the model sheet, idle, run and heavy reviews, and a blocking build gate; Gojo's build is broadened (ADR 0010 note).
- **INSANE CPU level** between Hard and Impossible (ENG-058): the Impossible brain at a person's reaction speed (it sees an attack after 12 frames instead of 7), with fewer parries, dodges, techs and throw breaks, and the odd dropped combo.
- **A fuller power-up** (hold Special, ENG-059): the aura builds the longer you hold, ki streams in toward your chest, pebbles float up, dust rings roll out and the floor cracks, with focus lines, a ground rumble, a slight tremble and a hum that climbs. Each new bar sends out a shockwave with a flash; the last one calls out MAX POWER!. Killua's charge crackles with lightning.
- Fixed: spectators near the edge of a step were cut off where their card poked into the tier behind (or the stand wall behind the standing row), a neighbour's edge pixels could bleed into a spectator, and the side stands' aisle stairs were one slab floating over the low tiers; the aisles now have a half step per tier (ENG-060).
- CPU vs CPU now shows ultimate clashes: when both fighters' ultimates can meet (Naruto, Gojo), the showman saves its first three bars of the match for a rhythm clash, fires only when the opponent has three bars too, and answers theirs; the lab's Tools tab can set the dummy's clash level (Easy..Impossible) (ENG-056, ADR 0016 amendment).
- **Hold back to block** (ENG-057): holding the stick away from the opponent blocks their attacks on the ground, no Guard button needed. With nothing coming you still run away; when they attack close by or a shot or beam is out you turn and guard. The Guard button still blocks, parries and dodges; throws still beat it; CPU levels keep their own blocking. Lab scenario **Hold back to block**.
- Docs: the user signed off on M2 (USR-001) and kept the 3-tomoe Sharingan for Sasuke's cut-in (USR-004); the Codex inbox has the Four-Tails art brief (ART-NAR-4T, required) and optional Gojo / Killua ultimate redraws.
- **Ultimate clashes are a rhythm duel** (ADR 0017 part 2): when two ultimates meet (a beam, Hollow Purple, the Four-Tails pounce; even one still charging), both players play the same note chart: press Light, Heavy or Special as each ring closes on the target, doubles and a FINAL PUSH hold. Perfect / Great / Good push the struggle point, presses off the beat push you back, so mashing loses. The winner's ultimate lands for 250; a lead under 2 is a draw (90 each). Firing your ultimate into theirs answers it with a short flash and windup. Rush specials meeting head-on get a one-beat version (the closer press wins). The CPUs time their presses by level and answer ultimates when they have the bars (ENG-054).
- Removed: button mashing in clashes (`Pad.mashRate` and the CPUs' mash rates).
- "DODGE!" / "AIR DODGE!" now also call out a dodge that beats Hollow Purple or the Four-Tails pounce, only once it really missed; the IMPOSSIBLE CPU no longer spot dodges the pounce (the bodies still collide, so Naruto waits the dodge out and grabs).
- **New ultimates, one shape each** (ADR 0017): Gojo's **Hollow Purple** is now a huge orb that rolls across the stage, erases projectiles and carves a trench (260); Naruto's **Four-Tails** roars in the four-tailed shroud and pounces on all fours, mauling what it catches (~255; side-step during the roar to dodge); Killua's **Godspeed: Whirlwind** auto-counters up to 4 strikes or shots in 5 s, and his flurry SUPER is renamed **Godspeed: Speed of Lightning**. No current fighter uses the shared beam (Goku's Kamehameha will). Both CPUs use and answer them. Art briefs for Codex in each KIT.md (ENG-053).
- **Test lab** (`/lab.html`, ADR 0018): every move of either fighter in one tap with frame data, all 42 animations frame by frame with hit and hurt boxes, one-tap scenarios for the shared mechanics (clashes, throws, parry, dodges, wavedash, air combos, bounces, vanish, super dash, counters, Whirlwind, Hollow Purple), slow motion, frame step, and record/replay on the dummy. Works on PR preview links (ENG-055).

- Tools: `npm run pr -- preview` deploys a PR's branch to a Vercel preview link and posts it on the PR, so it can be tried on a phone before it merges; `npm run deploy` (production) now runs only on `main` (ADR 0018, TOOL-022).

- **CPU vs CPU is a showcase now** (ADR 0016, ENG-049): the IMPOSSIBLE `showman` style plays short combos that end in a special, shot, teleport, vanish kick or super instead of long air juggles, fights at mid range with its whole kit (shots, kit tools, air specials, modes, Domain / Kirin / Amaterasu / flurry supers and beams, charging at a distance), and answers attacks with a rotating mix of parries, spot dodges, air dodges, counters, vanishes, super dashes through shots and beam clashes. Rounds last 35-70 s instead of 20-35 s; neutral went from 13 % to about 30 % of fight time.
- Every CPU level shows more of its kit: a shared `Showcase` (src/game/aiShow.js) weights each CPU's options toward tools the player hasn't seen this match, scaled by level, and Easy / Normal / Hard now parry, spot dodge, air dodge and wavedash at their level's rate (ADR 0016).
- "DODGE!" / "AIR DODGE!" callouts when a spot dodge or air dodge makes an attack, a shot, a beam or a super pass through (ADR 0016).
- Fixed: the IMPOSSIBLE CPU never air dodged (its airborne step skipped the threat layer), its light4 wall route almost always turned into the launcher, its spot dodges started too late to beat the hit, and a charge it gave up on early could fire a special by accident (ADR 0016).
- Fixed: a thrown fighter could end a frame just past the ring barrier.
- Fixed: a dev server started inside a PR worktree ignored edits to its own files (the vite watch ignore matched every `.worktrees/` path; it now ignores only the checkout's own `.worktrees/` folder).
- Docs: one PR plan for new characters (Claude's data PR, then Codex's refs/core/full art PRs), `KIT.md` as the moveset brief both AIs read (template added), not every ultimate a beam, the merge-only main folder, `NOW.md`/inbox edited on main only, and `merge=union` for CHANGELOG.md and art/REVIEW.md (DOC-008).

- PR worktrees now live in `.worktrees/` inside the project instead of a sibling `gcdTourney-worktrees` folder (git-ignored, not watched by the dev server; ADR 0013 amended, OPS-003).

- Art: recorded the user's approval of the final fighter batch (19 Naruto, 14 Killua, 43 Sasuke images; REVIEW, manifest, TRACKER) and installed Sasuke's portrait, cut-in and select images, so he no longer uses the placeholder pictures (ART-SCALE-01, ART-SAS-11).

- **Fighter scale corrections are in the game** (final batch approved by the user, PRs #8 + #9): 19 Naruto and 14 Killua animations re-sized so heads stay one size across every animation (Gojo keeps his original approved proportions, Killua stays shorter and Gojo taller), and Sasuke's final 42-animation pass with pose-fit repairs and Chidori/Kirin anchors; the packer accepts approved compact head targets (ART-SCALE-01).

- Every new feature or character now lands through a pull request built in its own git worktree: `npm run pr -- start|open|merge` (tools/pr.mjs), one `--no-ff` merge commit per feature so it reverts cleanly (ADR 0013, OPS-002).

- **Sasuke's hi-res art is in the game**: Codex's complete set of 42 animations / 175 frames replaces his placeholder in fights, packed at the shared anatomical scale. Every image still waits for the user's review in art/REVIEW.md, and his portrait, cut-in and select candidates are packed only once approved (ART-SCALE-01, ART-SAS-11).

- Art: reject enlarged Gojo head candidates after user feedback; restore approved proportions and document their precedence over nominal 31px guidance.

- Packer: measured skull-to-chin calibration from versioned sidecars, so a raised fist or a crouch no longer changes a fighter's scale; calibrated cached frames keep their scale; shared anatomical gate in art/CHARACTER_SCALE.md (ART-SCALE-01). Naruto's and Killua's corrections continue on a branch.

- Title screen: new Naruto-vs-Killua key art (`title_art` v02, approved by the user) replaces Naruto vs Sasuke; static painted audience (ART-UI-02).

- Naruto final batch approved by the user: all 42 animations and three UI assets; promoted UI sources, preserved pose/reach QA notes, and handed gameplay integration to Claude.

- Naruto complete candidate batch for one final review: 40 new animations and three UI images, completing 42 animations / 175 frames. Corrected pose separation, dash placement, knockout and cut-in; 48-color atlas, frame-local hand boxes, and phone-friendly playback review (ART-NAR-FINAL).

- Approved the complete Gojo art batch (47 assets), promoted canonical references/UI, archived superseded versions, and connected Blink startup/reappearance animation. Canonical strict pack and 160 packer regressions pass; approved-sheet reach measurements and teleport regression recorded.

- Gojo complete candidate set: 42 animations / 175 frames and three UI images from user-selected model v03; corrected merged strips and placement, added limb-specific hitbox overrides, strict 48-color pack and one full-set review gallery (ART-GOJ-01).


- Approved Killua final art batch: expressions, 42 animations / 175 frames and all three UI assets; promoted fixed references/UI and archived 16 superseded candidates. Documented visual caveats retained (ART-KIL-01).

- Gojo: user-selected smaller-head proportions filed as model v03; rejected v02 preserved. Production continues without intermediate approval requests; local browser QA verified under normal sandbox permissions.

- Killua complete candidate batch for one final review: expressions, 42 animations / 175 frames, and three UI images; corrected strip separation, run alignment and air-heavy boxes; strict 48-color pack, browser preview and build verified. Visual reach/pose caveats recorded in `art/characters/killua/production/QA.md` (ART-KIL-01).

### Added
- **Ground-decal art pipeline** (TOOL-026, ADR 0024): `npm run sprites decals` packs approved decals into `public/decals/atlas.json` + pages per page set (base + edge on 2 floor pages, one page per element set, so any pairing stays within the engine's 4-page cap; 31 names, parts `_A/_B/_C` split into the brief's per-image counts in order, tiling `erasure_trench` stretched edge to edge, #FFFFFF hot key kept, <= 24 colors, `--candidates` preview); new `art/decals/` brief, palettes and prompts (style sheet first, gated in the claim queue's new `decal` type); manifest `decals` section; the VFX `crater` is superseded.
- **IMPOSSIBLE CPU level** (VS CPU and CPU vs CPU, `?level=impossible`): a frame-data brain (`src/game/aiMaster.js`)
  that times parries, spot dodges and air dodges against what it sees coming, punishes whiffs and blocked big moves,
  runs each kit's max-damage routes with a lethal check (supers, Amaterasu, vanish and super dash extensions),
  wavedashes for spacing, times meaty attacks on wake-up and anti-airs. It only presses buttons and reacts after 7
  frames, so jabs and mix-ups stay guesses. CPU vs CPU now defaults to it in a louder "showman" style (ENG-043,
  ADR 0014).
- **Parry, spot dodge, air dodge and wavedash** on the Guard button: tap Guard ≤ 6 frames before a hit to parry
  (attacker staggers; 24-frame lockout per press, re-armed by a parry), Guard + ↓ to spot dodge, Guard in the
  air to air dodge (+ direction), and Jump → Guard + direction to wavedash, with the slide's momentum carried into
  the next move (ENG-042, ADR 0014).
- **Throw and throw break** (ADR 0015): Light + Heavy up close grabs a grounded opponent who isn't in hit or block
  stun (so it beats a held Guard, parries and counter stances) and tosses them into the wall for 80; Light + Heavy
  within 12 frames of being grabbed breaks it. Strikes, jumps and spot dodges beat it; a whiff is a 34-frame
  punish. The IMPOSSIBLE CPU tick-throws, throws turtles and breaks throws; Easy to Hard break some (ENG-044).
- **CPU vs CPU** spectator mode works end to end: SELECT MODE → CPU VS CPU or `?mode=cpu` arms both sides, the
  pad bindings stay off, the hint bar shows only how to pause, and touch screens keep just the pause button
  (ENG-041).
- **All world art is in the game** (the user approved every existing world-art image on 2026-10-10): hand-drawn
  hit effects replace the procedural ones (15 effects), 576 anime spectators fill the stands (including the
  Killua and Gojo cameos, kept at the user's request), the tournament grounds use the 30 painted stage textures,
  the announcer, two monk judges and a snack vendor stand around the ring, and the title screen shows the logo
  and key art (ART-WORLD-FINAL).
- **Crowd packer mode:** `npm run sprites crowd` packs the approved spectators into `public/crowd/atlas.*` (idle at
  the height class, feet on the pivot, ≤ 24 colors); the arena uses it instead of the code-painted crowd (TOOL-011,
  ADR 0012).
- **Stage, NPC and title-art support:** packer modes `npm run sprites stage|npc|ui` and the engine side: the arena
  swaps any of its 30 painted texture slots for a packed image without changing world coverage; NPCs are placed
  from a data table and react to round starts, supers, ultimates, clashes and KOs; the title screen shows the logo
  and key art (TOOL-011, ENG-023/024/025, ADR 0012).
- Per-frame **hand anchors** (`hand: [x, y]` in `hitboxes.json`): Rasengan, Rasenshuriken, Chidori, thrown
  projectiles and beams start at the drawn hand of Naruto's, Killua's and Gojo's art (ENG-011, ADR 0012).
- Character select shows each fighter's approved select illustration, mirrored per side from the new
  `selectFacing` character field.
- `--candidates` packer option + `?art=custom`: unapproved effects and spectators are packed into the git-ignored
  `public/preview/` and shown in a real match for review, never deployed (ADR 0012).
- Merged Naruto A39–A42 kit animation briefs, manifest/tracker rows and specialDown-only face/palette exceptions (ADR 0011).
- `docs/agents/CODEX_INBOX.md`: one file where Claude leaves work for each Codex thread; the user pastes one line
  ("Read docs/agents/CODEX_INBOX.md and do the section for your thread"). AGENTS.md rule 6. `npm run status` groups the
  review queue per character.
- Gojo batch 1 candidates: revised model v02, expressions v01, idle v01 and run v02. User authorized provisional references and bulk reviews; packed movement has 48 colors and corrected run placement (ART-GOJ-01).
- Approved Naruto short-hair idle v02 and queued run v03 with matching hair, preserved gait/placement, 48-color packing and phone review exports (ART-NAR-12).
- Killua S1 model-sheet v01 approved with documented QA deviations; fixed model reference saved for S2 expressions (ART-KIL-01).
- Full kits for Naruto (Rasenshuriken handheld, Uzumaki Barrage, Nine-Tails Cloak, Substitution, Shadow Clone
  Barrage) and Sasuke (Chidori Sharp Spear, Lion's Barrage, Sharingan counter, Kirin super, **Amaterasu ultimate**),
  so every fighter fills the same kit slots (ADR 0011: slot and damage budgets, stat index, balance log).
- New kit pieces: counter outcomes (freeze / strike / behind), rush `selfDmg` and grind `vortex`, super kinds
  `skyStrike` (Kirin) and `ignite` + burn status (Amaterasu), non-beam ultimates (`kit.ultimate`), mode defense and
  chakra look, `PASSIVES` table.
- Kit-animation briefs for Naruto and Sasuke (`art/characters/<id>/KIT.md`; Sasuke's Kirin poses replace his beam
  poses) and Codex prompts to merge them (docs/NOW.md).
- `docs/NOW.md` + `npm run status`: one page with the user's next actions, art waiting for review, per-fighter
  progress and what Claude and Codex are doing; both AIs keep it current (AGENTS.md rule 6).
- Balance round-robin recipe (docs/TESTING.md).
- Gojo S1 model-sheet v01 candidate queued for review with measured scale, palette and background deviations (ART-GOJ-01).
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
- **Canon, restrained power-ups** (hold Special, ENG-069, ADR 0023): each fighter powers up like their anime, mostly on the body and far dimmer than before: Naruto's red Nine-Tails chakra boils over him (red slit eyes at bar 2, one chakra tail at MAX), Sasuke's dark curse-mark chakra with Chidori current and the Sharingan glint, Killua's flickering electric outline, and Gojo almost nothing (a faint Infinity shimmer, pebbles that stop mid-air, the Six Eyes at MAX). No focus lines while holding, at most 16 effect sprites per fighter, and no new effects pile up during super-flash freezes; the lab gains "Charge to MAX".
- Rush specials cancelled out of a normal that hit start faster (`cancelStartup`: Rasengan 14, Chidori 16,
  Rasenshuriken 18; raw stays 24 / 28 / 30), so light ×3 → special is a true combo again (ENG-045, ADR 0015).
- CPU level picker has a fourth step, IMPOSSIBLE; CPU vs CPU starts on it. Hard's guard reaction now lands
  inside the parry window against raw launchers, so Hard parries some of them (ADR 0014).
- World art is approval-gated: `npm run sprites` ships only world-art items with an `approvedVersion`, at that
  version; candidates wait in `art/` and can be previewed locally with `--candidates` + `?art=custom`. An unreadable
  manifest never un-ships art (ADR 0012).
- Gojo's Blink puff, speed lines and sound now fire when he disappears, after the wind-up pose (ENG-032 follow-up).
- Killua light4 / airLight3 active boxes cover the kicking foot and the leading arc, not the trail behind the leg.
- Approved Naruto run v03, completing the short-hair revision; switched subsequent Naruto production to one final set review at the user's request (ART-NAR-12).
- Balance pass from CPU round-robins: Gojo power/defense 1.0 and Infinity costs 15 ki per stopped projectile;
  Killua sturdier; Rasengan 150 → 140, Chidori 165 → 152; Lapse: Blue a little less safe (see ADR 0011 log).
- Directional specials count toward the opponent, not the current facing (holding back no longer fired the
  forward special). The CPU splits 3 bars between super and ultimate and uses counters on ↓ or ←.
- Approved Naruto expressions v02 and queued idle v02 with the shorter haircut across eight frames; existing idle/run approvals remain recorded (ART-NAR-12).
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
- KO'd fighters no longer look like they float (ENG-066, TOOL-024, ADR 0020): lying frames get a contact shadow along
  the whole body and a caster turned with the billboard (anims.json `footprint`), a body never rests across the ring
  edge (it slides off onto the grass), a KO during a flurry super or the Four-Tails mauling keeps its launch, and the
  packer warns about lying poses drawn from above (ground check); the side-on `ko` / `down` redraw is ART-KO-01
  (art/scale/KO_DOWN_BRIEF.md).
- An off-ring crater (a KO'd body that slid or flew off the edge) lies on the grass, not mid-air at ring height (ENG-066).
- EXIT TRAINING lands on SELECT MODE instead of a dead pause menu (undefined `MODE_ORDER`), Esc on the first character-select pick works again, and every return to the menus goes through `Game.toMenu()`, which falls back to the title if a screen fails to open (ENG-062).
- Air combos no longer drop on the art packs: a launched pose leans back, so `airLight2` whiffed on Naruto and the
  `airHeavy` spike on Gojo nearly every time. Air attacks now close to the juggle spacing while riding a hit and
  during the next move's startup, and the spike's box pad is wider; the air string connects ~97 % across all 16
  pairings (ADR 0014).
- The crowd no longer flickers between poses when the fight gets exciting: excitement used to multiply each
  spectator's animation rate against the absolute clock, so every change in hype scrambled their phase (~42 pose
  switches per second per spectator). Now each keeps a steady tempo, hype eases in and out and speeds up a shared
  crowd clock instead (~2 switches per second, a calm sway that builds into a bouncing cheer).
- Character select fits a landscape phone: the full kit move list was cut off below 480 px of height.
- Docs: spec v2 sheets are 4096 × 2816 (42 animations / 175 frames), not 4096 × 2560.
- Minimum hurtbox width (0.56 units) so a slim art pack can't make a fighter hard to hit (Killua's art: 75 % → 42 % CPU wins).
- Melee hits on the same frame now trade: P1 used to update first and win every exchange (P1 won 81 % of CPU
  matches; 40-51 % after the fix).
- Mobile art review now displays newer packed idle candidates while retaining the approved idle reference separately (TOOL-017).
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
