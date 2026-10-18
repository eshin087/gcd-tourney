# Changelog

All notable changes to GCD Tourney are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) (0.x while in development, see
[docs/CONTRIBUTING.md](docs/CONTRIBUTING.md#versioning-and-releases)).

Every change adds a line under **Unreleased** in the right group: Added, Changed, Deprecated, Removed,
Fixed, Security. Reference task ids and ADRs where useful.

## [Unreleased]

- Changed (ART-SKL-SAS): via Claude relay skills #14, recorded user approval of Sasuke `chidoriForm`, `chidoriBurst`, `chidoriSpear` and `chidoriCurrent` v01. Amaterasu v01/v02 attempts are preserved on technical hold; user decision pending on no-call pixel cleanup.
- Changed (ART-SKL-SAS): the user authorized a third `art/sasuke-skills` worktree alongside the two Smash normals worktrees (relay skills #13); the two-worktree cap remains for Smash normals rounds.
- Fixed (TOOL-PALETTE-RESERVE, ADR 0046): Naruto's Four-Tails fox is crimson in game again, as approved (beamCharge v17, beamFire v15), instead of red-brown with a peach mouth. Packed at 48 colours, his orange jumpsuit took the fox's colours; the new manifest field `paletteReserve` gives the fox 8 of the 48, taken from near-duplicate dark greys the rest of his strips barely miss (2 % of their pixels move, by 2-10 levels; nothing visible). `npm run test:sprites` covers it.

- Added (OPS-019): `tools/capped.ps1` runs a command (a dev server) under a memory cap and ends it with the shell that started it; `npm run dev:capped` is the normal dev server through it, and `npm run devs` (`tools/dev-servers.ps1`) lists the dev servers running now with their memory and warns when the machine's committed memory is near its limit. Nothing is scheduled or left running. Prompted by a Vite dev server that reached 131 GB of committed memory on 2026-10-17.
- Changed (ENG-SKL-NAR-2): Naruto round 2, from the user's review of the live build. The Nine-Tails Cloak is the aura only (no tail). The Shadow Clone Barrage summons its clones one at a time, fast, each poofing in on its own side to land its own attack (punch, flying kick, uppercut, roundhouse, heel drop...) while Naruto holds the seal, then the U-ZU-MA-KI kick-up and the Rasengan drop. The ultimate is now **Four-Tails: Tailed Beast Ball**, a beam (ADR 0045): the chakra swallows him into the four-tailed form during the flash, red and blue chakra gather into a ball at the mouth, and a red-white blast with shock rings fires from it with Codex's approved art: the fox gathering (beamCharge v17) and firing from its mouth (beamFire v15), the chakra ball (beastBall v01), the shock rings (beastBeamRing v01), the roar (fourTailsRoar v02) and the fully engulfed ultimate splash (ui_ult_fg v04). The Four-Tails pounce and mauling are retired. Codex's approved batch 2 effects ship too: the Rasengan (held, forming, spiral blast), the clone poof and the Substitution log, and batch 3: the Rasenshuriken's wind blades and its dome of wind blades (the two full-sphere frames loop while it grinds).

- Fixed (ENG-113, ADR 0042 amended): the DBFZ air combos are back. In a juggle off a launcher, spike, bounce, super dash or the air string, Light is the air string again whatever direction you hold (↓ + Light the spike), so following the launcher with the stick held toward them no longer cuts the string to one forward air; the CPUs stop ending those juggles with an up air that landed the victim on their feet. The directional aerials stay for the open air and after a light pop, and the C-stick still picks them. Also fixed: a vanish started right after an air string's juggle tracking stepped the fighter toward a victim pinned on the barrier could leave them a hair past it for the vanish (a soak ring violation).
- Changed (ART-SIZE-R7): archived the Codex audit worktree after PR #153 merged the independent table; no redraws or image calls were needed.

- Changed (ART-SIZE-R7, ADR 0041): Goku and Luffy are 8 % smaller in game (user option A, 2026-10-18), on the cast's 1.17 px per cm of canon height: Goku had shipped at 1.08x his approved reference and stood as tall as Gojo, and Luffy's reference was drawn large. New manifest field `packScale` makes the packer resize a whole fighter (every strip's bodyHeight, frameOffsets and hitboxes.json anchors); no drawing changed. Their hit boxes shrink with the art (Goku heavy reaches 117 px instead of 127). `npm run test:sprites` covers it.

- Fixed (ART-SIZE-R7): 12 strips that were drawn 5-14 % bigger or smaller than the rest of their fighter are resized to match (manifest `animations.<anim>.packScale`, ADR 0041): Goku dash, special, beamCharge, win; Luffy charge, jumpUp, getup, airLight1, land, light4, beamCharge; Gojo heavy. Measured on every frame of all six fighters (head templates, body area, hand landmarks); no drawing changed. New packer flag `--keep-palette` keeps the current sheet's colours on a repack, so the other strips stay byte for byte.

- Changed (ENG-SKL-NAR): Naruto's techniques look like the anime (ADR 0044). The Nine-Tails Cloak is see-through red-orange chakra over his whole body with a boiling rim and one tail; the Shadow Clone Barrage sends six real clones that poof out, surround the target, beat it up in turns, kick it skyward (U! ZU! MA! KI!) and leave Naruto to drop a big Rasengan on it; the Uzumaki Barrage rises with three clones; Substitution leaves a log; the Rasengan forms in his palm and blows out in a spiral instead of a white flash; the Rasenshuriken has wind blades and grinds the victim in a dome of them; the Four-Tails swallows him in red-black chakra during the flash and bursts off him at the end (a silhouette with four tails until Codex's shroud frames are approved). New: 256 px HD effect cells (`atlas_hd.png`) with procedural stand-ins for eight new effects, and a thicker dark outline on super and ultimate splash cutouts.
- Added (ENG-111, ADR 0042): the CPUs play the Smash moves. Every level aims its stick for the directional normals and jumps with short or full hops: up tilts (and up smashes) as anti-airs, down and forward tilt pokes, short-hop neutral and forward airs (also fast-fall aerials that land into a down tilt), back airs after running off, forward tilts and charged smash attacks to punish whiffs, dash attacks, and in the air the aerial that fits where the opponent is. The combo composer links down tilt into the jab string, up tilt into another up tilt or a short hop and up air, and a short-hop aerial into a down tilt; the Showcase counts the new moves so spectated CPUs show them all. `soak()` reports each CPU's tools per match (`perMatch[i].used`).
- Added (ENG-110, ADR 0042): Smash-style combat. The stick now picks the normal: → / ↑ / ↓ + Light are forward, up and down tilts, → / ↑ / ↓ + Heavy are smash attacks (hold Heavy to charge, up to ×1.4 damage), Light in a dash with the stick held is a dash attack, and in the air Light gives the neutral air, → / ← / ↑ + Light the forward, back and up airs and ↓ + Light the spike. Tilts and aerials link instead of chaining (only the jab strings chain; specials, vanish, super dash and supers still cancel on hit). Smash air: tap Jump for a short hop (Jump + Light: a short-hop aerial), a double jump, fast fall with ↓, the facing held through a jump (back airs, cross-ups), several aerials per jump with their own landing lag; the launcher's chase and its floating air string stay. Light pops land on the feet. The new moves use stand-in strips until Codex draws them (ENG-112, after the art audit); the CPUs keep their old moves until ENG-111.
- Added (ENG-110, ADR 0042): Smash-style combat. The stick now picks the normal: → / ↑ / ↓ + Light are forward, up and down tilts, → / ↑ / ↓ + Heavy are smash attacks (hold Heavy to charge, up to ×1.4 damage), Light in a dash with the stick held is a dash attack, and in the air Light gives the neutral air, → / ← / ↑ + Light the forward, back and up airs and ↓ + Light the spike. Tilts and aerials link instead of chaining (only the jab strings chain; specials, vanish, super dash and supers still cancel on hit). Smash air: tap Jump for a short hop (Jump + Light: a short-hop aerial), a double jump, fast fall with ↓, the facing held through a jump (back airs, cross-ups), several aerials per jump with their own landing lag; the launcher's chase and its floating air string stay. Light pops land on the feet. The new moves use stand-in strips until Codex draws them (ENG-112, after the art audit); the CPUs keep their old moves until ENG-111. On a gamepad the right stick is a Smash C-stick: a smash attack that way on the ground, that aerial in the air (online inputs grow to 27 bits; the lobby server accepts them).
- Changed (ENG-105): the test lab panel docks beside the game on screens 900 px and wider (the game, HUD and flash overlay shrink to the space left, so nothing is covered; the renderer and overlay now size to their own box). Every tab is one kind of list: foldable group headers with counts and rows of ▶ / name / note; YOU and DUMMY are dropdowns on one line; the text sizes itself to fit the screen so Moves, Animations and Tools need no scrolling.

- Changed (ENG-104): the lab panel's text and buttons scale with the screen (14 to 18 px, 13 px on phones; the panel 380 to 540 px wide) and option buttons stretch to fill their row, so TOOLS and ANIMATIONS read larger with no empty gap beside them.
- Changed (ART-SKL-NAR): recorded user approval via Claude relay skills #10 for rasenshuriken and rasenshurikenDome v01; HD packing and gameplay integration checks remain with Claude.



- Changed (ART-SKL-NAR): recorded user approval via Claude relay skills #9 for rasengan, rasenganForm, rasenganBurst, poof and subLog v01; visual approval is separate from Claude-owned packing and gameplay checks.



- Added (ART-SKL-NAR): prepared Naruto skills batch 3 HD effect candidates rasenshuriken v01 and rasenshurikenDome v01; added generation provenance, manifest/review records and gallery. Awaiting user visual approval and Claude pack/game integration checks.


- Changed (ART-SKL-NAR): prepared Naruto skills batch 2 HD candidates rasengan, rasenganForm, rasenganBurst, poof and subLog v01 (one image call each); added manifest/review/provenance records and gallery. Awaiting user visual approval and Claude pack/game integration checks.

- Changed (ART-SKL-NAR): recorded user approval via Claude relay skills #7 for beamCharge v17, fourTailsRoar v02, beamFire v15 with its +13px placement sidecar, beastBall v01 and beastBeamRing v01; superseded beamCharge v12-v16 and fourTailsRoar v01 are preserved under `_rejected/`. Character scale/contact/integration holds remain.

- Changed (ART-SKL-NAR): prepared Four-Tails mouth-beam art candidates for round 2: beamFire v15 plus HD beastBall and beastBeamRing v01; v14 pounce approval is superseded for the ultimate. Claude confirmed local effect packing/placement; beamFire received a +13px final-cell placement sidecar with no rescale. Visual approval and character scale/contact checks remain pending.

- Changed (ART-NAR-SKILLS-B1): recorded the user approval of beamFire v14 + sidecar and ui_ult_fg v04 via Claude relay skills #4; promoted the approved UI source. beamCharge v17 and fourTailsRoar v02 remain unapproved candidates for review.
- Changed (ART-NAR-SKILLS-B1): edited beamCharge v17 to clean the f0/f2 tail joins with no image call; fourTailsRoar v02 keeps the 236px circular mask, with all eight packed frames inside a 117.99px radius.
- Changed (ENG-102): faster first load. The title shows after ~0.5 MB (title art and fighter metadata) instead of all 31.5 MB of art; fighters, crowd, stage and effects load in parallel behind it, and a fight waits for them on the loading screen. Art is requested by its plain URL (ETag revalidation) instead of `?v=<now>`, so a repeat visit downloads ~30 kB instead of 31 MB. A real loading bar (byte-weighted, title art and logo behind it) replaces "BAKING FIGHTERS...", and portrait phones see the logo and title art above a smaller rotate hint (ADR 0043).
- Changed (ART-SIZE-R7): recorded the Codex independent audit of 230 packed fighter strips on `art/size-r7-codex` (`903b9b63`); Claude will reconcile measurements and provide the redraw list.
- Changed (ENG-101): lab layout pass. TOOLS rows line up (a label column, options wrap beside it, short notes); SCENARIOS show as two columns of cards capped at two lines, the open card's description spanning both columns under its row; ANIMATIONS fit on one screen, one compact row per group with each alt strip as an `alt` chip beside its base. The panel is a little wider (420 px).

- Record user approval via Claude relay gojo-run #14 for Gojo hurtHigh v04 and launched v08, keep hurtLow v04, preserve rejected alternates, and document the final packed-atlas technical holds on PR #143.

- Changed (ENG-100): SELECT MODE's SPRITE LAB row is now **LAB**, the test lab (`/sprites.html` still works by URL). The lab lists every tab in groups with a chip bar to show one group and counts of what the pairing has: scenarios in six groups (Clashes, Defense, Tech & escape, Combos, Fighter kits, Look & feel) with a one-line brief each (tap for the full text), animations in seven groups with missing strips dimmed, tools in sections; ‹ MENU returns to the game, the tab and chips are remembered, and four scenarios that only repeated a MOVES row (wavedash, vanish, super dash, plain throw) are gone.

- ART-SIZE-R6: recorded the user decision “keep v02” for Sasuke beamStruggle via Claude relay art-camera #10; v05 remains not taken and held, with no image approval.

- ART-SIZE-R6: PR #142 merged as d5304303; Sasuke v02 (PR #140) remains live and measures the right size, v04 remains user-rejected in `raw/_rejected/`, and v05 was not taken and stays in `raw/_qa_hold/`. The user made no beam-vs-size decision. No new art ships and no camera/engine change.

- Art (ART-BEAM-CLASH): User approved Goku ground `beamStruggle_v01` and Sasuke ground `beamStruggle_v02` via Claude relay beam-clash #15: “Goku v01: Approve v01. Sasuke v02: Approve v02.” Both approvals are recorded in REVIEW, manifest and TRACKER, and both sources are in `raw/`. Their technical holds remain: Goku's strict gate has an unmeasured head and 1 px frame-2 clip, plus title-combat/beamFire density disagreement and Astra shoulder/chest HOLD; Sasuke's auto head gate passes but Astra holds torso length and loop stability, with arm uncertainty. No production atlas or contact override was promoted. All three air strips remain unchanged. Evidence: `public/reviews/beam-clash-r3/` and character production ledgers.
- Added: Goku's beam clash push (Dragon Fist, `beamStruggle` v01, packed at the head-matched bodyHeight 205 and shifted 6 px left so the fist stays in the cell) and Sasuke's redrawn Chidori Spear push (v02, bodyHeight 153), with hand anchors on the fist and fingertips (ART-BEAM-CLASH). Re-snapping the shared 48-colour palette nudges about 1 % of Goku's and 0.3 % of Sasuke's other pixels (TOOL-PALETTE-LOCK).
- Added: Gojo dash v11 and superDash v13 size-redraw candidates, exact call provenance, packed-atlas Astra audit and review gallery (ART-GOJO-DASH-SIZE). The user approved both v11/v13 as drawn via Claude relay gojo-run #11 despite the recorded technical holds; the approved v11/v13 sources are packed on this branch.

- Added: `node tools/relay.mjs desk on|off`, the user's switch for the approvals desk (OPS-018, ADR 0040). While it is off, each chat asks the user itself instead of queueing everything for `0 - Approvals`.
- Added: Round 2b Goku and Luffy super/ultimate image candidates, call/hash ledger, Astra audit and candidate review gallery (ART-SUPER-ART). All eight approved via Claude relay effects #10 despite recorded Astra palette/crop/anatomy holds; approved fixed copies and fitted packer outputs were added.

- Changed: online work is paused at the user's call (2026-10-16) with its core live: rollback netcode, private and public rooms, quick-chat and moderation, spectating, rejoining after a drop (ENG-094/095/097). Open follow-ups: peer-to-peer private rooms (ENG-098), switching on the anti-bot check (ENG-099), the licensing decision before promoting public play (OPS-017).
- Fixed: in a beam clash Naruto's Rasengan stream started in the air 24-49 px in front of his hand; his `beamStruggle` hand anchors are re-measured on the packed sheet (palm, following the drawn strain frame) (ART-BEAM-CLASH).
- Fixed: the determinism page reported STALE FIXTURE after the Goku and Luffy art changed the simulation fingerprint (every anims.json counts); both fixtures are re-recorded and MATCH.
- Added: Goku and Luffy play with their own title-style art: all 23 core animations each, user-approved, calibrated at the approved density and Astra-audited (PRs #123 and #96). Known and accepted for now: Luffy edge clips on run/light3/light4/airLight1, the Gigant Pistol arm leaving the cell, Goku getup f0 floating ~8 px (TASKS ART-LUFFY-EDGECLIPS, ART-LUFFY-GIGANT-ARM, ART-GOKU-GETUP-FLOAT).

- Added: rejoining an online match after a dropped connection (ENG-097, ADR 0036): the room keeps a dropped seat for 20 seconds; the game reconnects by itself, resends what the room missed, or after a page reload rebuilds the match from the room's input log; the other player sees "waiting for X to reconnect" with a countdown. Away members aren't put into new matches.
- Added: public lobbies (ENG-095, ADR 0036): BROWSE PUBLIC ROOMS lists open rooms with region, players and ping; CREATE A PUBLIC ROOM or a private one (a Cloudflare Turnstile check is built in but switched off for now; meanwhile the list shows at most two rooms per address); quick-chat lines and emotes instead of free text, shown in the room and over matches; a nickname filter; the host removes members and anyone can vote to (a majority), with a 10-minute ban. The lobby server gains a `Directory` object, `GET /rooms` and `GET /room/<CODE>/ping`.
- Added: online rooms (ENG-094, ADR 0036; the lobby server runs at https://gcd-tourney-lobby.eshin087.workers.dev): ONLINE on the mode list creates a room or joins one by its five-letter code (`?room=CODE` invite links); the first two in line fight over rollback netcode, the winner stays on (streak cap 5), everyone else watches live (a late joiner fast-forwards), Esc opens the room over a watched match. The lobby server is `server/` (Cloudflare Worker + a Durable Object per room, `npm run lobby` locally, `npm run test:lobby`); `det.online` checks the whole path and `det.bot` adds stand-in members. Rollback gains time sync (frame advantage). Input delay is picked per match from the players' ping: 1 frame on a good connection (it was always 2), and each player's connection stats are kept at `/room/<CODE>/stats` for diagnosing lag.
- Fixed: the intro's length is a constant the match flow reads, not the camera's, so a rollback during an online intro can't end it early on one machine (ENG-094).
- Added: rollback netcode, tested locally (ENG-093, ADR 0036): `src/net/rollback.js` (`RollbackSession`: packed inputs, input delay, prediction, save / restore and quiet re-simulation, stalls past 8 frames, state-hash desync check), `src/net/netSim.js` (simulated latency / jitter / loss), `?net=sim[&lag=6&jitter=2&loss=5&delay=2]` plays a match through it against the CPU (or player 2 in versus) with a stats overlay, and `det.netplay(log, opts)` checks every frame against a plain replay; `InputManager.poll` is split into `sample()` + the pad writes.
- Added: rollback groundwork (ENG-092, ADR 0036): `Game.saveState()` / `loadState()` (`src/game/snapshot.js`), `Game.quiet()` for silent re-simulation, shots drawn from state by `ShotViews` (projectiles keyed by id, beam meshes in `BeamView`), and a rollback stress test (`det.replay(log, { rollback })`, also on the `?det=` page): four pairings stay frame-exact through 500-1,000 rewinds.
- Changed: the melee clash's CLASH! / CLASH ×n! / CLASH BREAK! text is a right-hand side banner like TECH! (each count replaces the last) instead of a center-screen callout over the fighters (ENG-096, ADR 0038).

- Changed: Gojo's dash, backDash and superDash are redrawn in the new run's pose (ART-GOJO-RUN-JKL): far hand in his pocket, near fist forward. Dash v10, backDash v07 and superDash v12 approved by the user via the approvals desk and passed by the Astra audit (dash with a comparison note). SuperDash drops the open palm. Sidecar frameOffsets hold the head steady and lift backDash's tucked frame.
- Added: Gojo dash-family candidates in the approved run v14 pose (ART-GOJO-RUN-JKL): backDash v07 is packed for technical review with an Astra HOLD on tucked-frame placement and uncertain occluded anatomy; dash v10 and superDash v12 remain quarantined after clipping/scale failures. No image approval or production promotion.
- Added (TOOL-GOKU-PROBE, interim): `art/scale/builds.json` fighter `headProbe: { mode: "manual", why }`. For a fighter whose head the probe provably misreads (Goku, Luffy), no strip passes or fails on the head numbers: each is unmeasured until a version-bound `scaleManualQA` landmark check accepts it. Not an exemption; other fighters unchanged.

- Changed: the simulation is replayable with no test workarounds (ENG-091, ADR 0036): it owns its control basis (`src/game/basis.js`; the render camera follows its yaw), runs the match flow and KO slow-mo on the fixed step, resets its frame counter per match, never reads the render clock (Gojo's Infinity charge counts frames), takes the hold-back-to-block rule from the match setup (`Game.kinds`), stores -0 sticks as 0, and uses deterministic math (`src/game/dmath.js`; `npm run lint:simmath` in prebuild). Fixtures re-recorded; replays match at 60/120/144 Hz and uneven frame times.
- Art (ART-BEAM-CLASH): generated and recorded user approval via Claude relay #10 for Killua `beamStruggleAir` v02; strict quantized scale gate and body sheet pass, and superseded v01 is archived. Astra anatomy audit and exact hand-anchor measurement remain pending.
- Art (ART-BEAM-CLASH): recorded the user's Claude desk approval for six strict-scale-passing beam-struggle candidates (Naruto ground v02; Sasuke ground/air v01; Killua ground v01; Gojo ground/air v01). Killua air v01 remains quarantined after a strict-gate failure. Astra anatomy audit is pending.
- Added: the approvals desk stops itself when all work is done (TOOL-051, ADR 0039): Claude chats report `relay chat active|done`, and `relay wait all` exits after 15 quiet minutes with no open ask, no lane waiting on Codex and no active chat; `relay status` says what keeps it awake.

- art(killua): record user approval via Claude relay scale#6 (“i approve those 5”) for charge v14, down v08 and ko v09 as drawn. Calibration uncertainty remains; charge aura retention and runtime grounding/state-transition checks remain on technical hold for Claude.

- art(killua): Astra re-audited calibrated charge v14, down v08 and mirrored ko v09; gross scale/clipping defects resolved and visual anatomy screening passes. Runtime grounding and aura retention remain unverified; calibration uncertainties remain. User approval is recorded in the entry above. No new generation or calibration edits.

- art(killua): Charge14/down08/ko09 sources filed; normal scale gate fails; diagnostic-only atlas for Astra. Charge used one unauthorized duplicate call, quarantined and excluded; first authorized output retained.
- art(naruto): record user approval via Claude for light2Alt v05 and airHeavyAlt v04 as drawn; retain Claude-owned contact and anatomy holds.

- Review: refreshed the five-candidate scale-loose-ends page from the calibrated atlases with Astra's final screening results, exact comparison crops and full audit evidence; unresolved technical checks remain and no art is approved.

- art(naruto): One authorized call each for light2Alt05 and airHeavyAlt04; normal scale gate fails; diagnostic-only atlas and Astra review for Claude calibration.
- art(scale): record user approval via Claude of Naruto light2Alt05/airHeavyAlt04 and Killua charge14/down08/ko09; return remaining technical checks to Claude without merge or production deploy.

- Added: Codex chats with no relay lane are found and handled (TOOL-050): `relay status` lists recent project chats nobody mapped, `relay ask --app codex --from "<title>"` lets such a chat queue a question, and `relay answer` maps it by title and relays the answer.

- Changed: Gojo runs instead of hover-gliding (ART-GOJO-RUN-JKL): run v14 in the K "fast athletic" direction, far hand in his pocket and the near fist forward, approved by the user via the approvals desk and passed by the Astra audit. Part A of the generated stride is used for both halves; the sidecar frameOffsets hold his head steady and lift the flight frames.
- Fixed: relay watchers no longer crash on Windows when a state file is renamed while another watcher reads it (EPERM/EBUSY); the write retries briefly (TOOL-049).

- Changed: one central chat (OPS-016): the Claude chat `0 - Approvals` now also gives the status overview, forwards the user's instructions to Codex chats and runs the reset after chats are deleted; the Codex control chat "0 - G", its attention monitor (OPS-014) and `$gcdtourney-attention` (OPS-015) are retired. Codex chats never ask the user; they ring `--for user` and stop.

- Added: explicit-only `$gcdtourney-attention` project skill to run the multi-chat status check immediately and update or pause the existing bounded monitor (OPS-015).

- Added: storage hygiene rule (OPS-013, CLAUDE.md, AGENTS.md, docs/AI_COLLABORATION.md): after a merge the coordinator prunes merged and unregistered worktree folders, a finished task deletes its `node_modules/` and `dist/`, agent scratch stays out of the project, `deliverables/` empties once the user has them, and `_preserved-*` folders carry a README with a review-by date; versioned `_vNN` art, approved art and unmerged commits are never touched.

- Fixed: a sparse worktree can no longer silently pack without its raw art (TOOL-048). `npm run pr -- start --art` verifies every tracked `raw/` file of its folders is on disk and stops otherwise; new `npm run pr -- art <id>[,<id>]` adds raw art to an existing worktree (the art/beam-clash worktree had been recreated without `--art`, and a hand-typed `git sparse-checkout add` in Git Bash had become `C:/Program Files/Git/art/...`); the packer refuses a VFX atlas that would lose a shipped effect whose source is missing on disk (`--allow-drop` to intend it), which is how PR #110 committed an atlas without glow, bubble, wisp, arc, ripple and naruto_chakraTail. Test: `tools/test-sparse-art.mjs` in `npm run test:guard`, run 13d/e in `npm run test:sprites`.
- Changed: the approvals desk command is `/approvals` (was `/desk`); desk questions must name the asking chat, say exactly what a yes approves and link the preview itself; the desk keeps one bounded background watcher and never restarts it in a loop (TOOL-047, ADR 0039).

- Changed: the control-chat monitor backs off according to progress, pauses on completion/user-only waits/stalls, and retains a fixed four-hour maximum session expiration; no endless five-minute loop (OPS-012).

- Added: the drawn beam clash effects (ADR 0034, ART-BEAM-CLASH): clashBurst, streamBolt, streamLance, streamFlame and redOrb v01, approved by the user, replace the procedural stand-ins. Packed with every existing effect kept (Codex's branch atlas, packed in a sparse worktree without the VFX raws, had dropped glow, bubble, wisp, arc, ripple and naruto_chakraTail).
- Added: one approvals desk (ADR 0039, TOOL-046): only the Claude chat `0 - Approvals` asks the user. Codex rings for the user and other Claude chats' new `relay ask` share one queue (`.relay/asks/`), watched by `relay wait all` and answered with `relay answer <id>`; lane watchers leave the user's rings to the desk. `/approvals` project command and a SessionStart hook (`relay brief`) restore it after chats are deleted. `npm run status` opens with "Needs you now" and lists only each asset's newest REVIEW.md row (166 rows down to 39).

- Added: persistent control-chat coordination procedure, replaceable control identity, consolidated attention monitoring and recovery after chat deletion; Claude approval routing remains governed by ADR 0037 (OPS-011).

- Fixed: the determinism page (`?det=`) reports a fixture recorded on other gameplay code as STALE instead of as a split: fixtures carry a simulation fingerprint (`vite.config.js` simId, `import.meta.env.SIM_ID`); both fixtures re-recorded on the beam-clash and melee-clash code (ENG-090, ADR 0036).

- Added: online-play determinism test (ENG-090, ADR 0036): `src/net/simHash.js` (per-frame state hash in groups, dumps to diff), `src/net/detTest.js` (`?debug` -> `det.record/replay/diagnose`, `?det=<fixture>` replays a saved match against its reference in any browser), fixtures in `public/det/` (per-frame hashes, per-field traces), `src/net/dmath.js` (deterministic hypot/sin/cos: Safari's `Math.hypot` differs from Chrome's), and ADR 0036 (rollback netcode, lobby server and the leaks the spike found).
- Fixed: beam clashes from the air (ADR 0034 section 5, ENG-082): the airborne fighter eases down to a low hover in an air pose (new optional `beamStruggleAir`, else the `throw` release frame) instead of standing on nothing at jump height; a grounded Rasengan / Chidori answer stays planted and holds its technique up the stream line instead of being dragged under it (it could end on the other side); a held Chidori shows forward, not trailing behind; a winning rush blasts up the line into the air fighter; the clash camera frames both bodies.
- Fixed: beam clash visuals (ADR 0034, ENG-082): fighters no longer vanish in white (a contained two-color `clashBurst` instead of the full-size white glow, a thinner aura behind the body, short colored start/end flashes, a smaller colored finish on the loser); the origin glow no longer covers the firer; the Rasengan meets the stream at its held orb; no blocky streaks in the beam shader; BEAM CLASH! sits under the health bars and the rhythm ring and bar below the fighters. Each move keeps its own shape: Narukami a lightning zigzag, Chidori Spear a lance, Great Fireball a fire torrent, Reversal: Red an orb sending repulsion ripples; `beamStruggle` plays once a sheet has it.
- Added: Sasuke's approved Kirin banner backdrop and Amaterasu splash backdrop (ART-SUPER-ART); until his cutouts are approved the HUD shows his eye strip as a framed panel on his side of the banner and as a band across the splash, so the backdrops stay visible (ADR 0035).

- Art (ART-SUPER-ART): recorded the user-approved Sasuke Kirin and Amaterasu v01 backdrops and packed them with the merged ENG-083 runtime. User rejected v01 foregrounds and then authorized v02 and v03 redos; both v03 foregrounds were approved via Claude relay effects #6 despite Astra holds and packed into the review branch.
- Added: melee clash (ENG-096, ADR 0038): two lights or two heavies meeting while both are live cancel out (CLASH!, no damage: the strikes held together with sparks in both fighters' colors and the camera pushing in, then a short pushback, free to act); pressing again chains it (CLASH ×2, ×3... with growing effects and ki for both) until the 5th skids both far back (CLASH BREAK!); a light that meets a heavy loses (CRUSH!). The CPUs seek clashes at a per-level rate; lab scenarios **Melee clash chain** and **Heavy beats light**.
- docs(scale): hand back calibrated five-candidate Astra re-audit and corrected protected preview; oversizing/clipping resolved, precise contact/grounding/aura follow-up retained for Claude. No image approvals or new generation.

- Added: super banners and ultimate splashes (ADR 0035, ENG-083): a taller super banner with the move's backdrop and the fighter breaking out of its top, a full-screen ultimate splash (backdrop push-in, letterbox bars, the fighter sliding in, the move name), four optional layer images per fighter (`super_bg`, `super_fg`, `ult_bg`, `ult_fg`; packer fits them), each falling back to today's eye strip on speed lines; every ultimate's flash holds 24 frames longer (`ULTIMATE.splashHold`).
- Added: eye techniques (ADR 0035): Sasuke's Sharingan counter shows a large turning Sharingan behind him and flashes his red eyes across the HUD, a successful read spins it up; Amaterasu shows his Mangekyō. Drawn in code from character data (`eyes`, a move's `sigil` / `eyeFlash`).
- Changed: approvals happen in Claude (TOOL-045, ADR 0037): Codex rings the relay `--for user --kind approval|decision|blocked`, Claude notifies and asks with a question box, then relays the user's quoted answer (`send --user-approved|--user-rejected|--user-decision`); `relay status` shows "turn: you". Also: round trips count only sends that answer a new ring, watchers wait 24 h and say when to restart, `send` unarchives an archived Codex chat, `send --direct`, `add <lane> <chat>` without `--thread`, `remove <lane>`.

- Changed: every Codex handback explicitly reports completion/wait status, required user actions, pending Claude work and the next actor; existing project chats receive the rule (OPS-010).

- Added: a raw sidecar can set `"flipX": true` to mirror a character pose drawn facing the wrong way, frame by frame (TOOL-044; art/PIPELINE.md).

- docs(scale): hand five audited candidates and protected diagnostics to Claude for calibration; disclose duplicate charge call.
- Changed: ring damage looks like broken stone in the floor instead of stickers on it: decals show the ring's own texture and grid, only their cracks, pits and scorch darken it, craters sink into a lit bowl with parallax depth, the drawn rubble is off on the ring, and hot seams glow half as long and much dimmer; permanent craters stay (ENG-084, ADR 0024 amended).

- Changed: every agent checks main's current inbox and relay state before finishing, sends required Claude handbacks automatically, and reports delivery or waiting status while preserving approval/pause brakes (OPS-009).
- Fixed: `npm run pr -- merge` names its own merge commit in the revert hint, finishes the worktree cleanup and the deploy when the GitHub publish fails (with a warning), and says which worktree holds a branch it cannot delete (TOOL-038).

- docs(scale): claim the five authorized loose-end repairs; leave Gojo to J/K/L per user clarification.
- Added: the beam clash art contract (ADR 0034, ENG-082): the optional `beamStruggle` animation (3-frame braced push, falls back to `beamFire`) and five clash effects (`clashBurst`, `streamBolt`, `streamLance`, `streamFlame`, `redOrb`) with procedural stand-ins; the packer warns about a stream band frame that cannot tile. Briefs: art/characters/BEAM_STRUGGLE_BRIEF.md, art/vfx/EFFECTS.md "Beam clash".
- Art (ART-BEAM-CLASH): user approved all five v01 clash effects on 2026-10-15; updated manifest/review/tracker and repacked the approved VFX atlas. Naruto `beamStruggle` v01 remains on technical hold: strict scale measured head/hair at 1.40x and feet at 0.62x approved idle; body sheet and Astra atlas audit remain pending.
- Changed: while a new idle candidate is the newest raw, the scale gate measures every strip (and the candidate idle) against the approved idle instead, so a pending idle no longer moves head numbers or auto head fits (TOOL-040; art/CHARACTER_SCALE.md).

- Fixed: the GitHub publish keeps commit ids in commit messages as written (`--preserve-commit-hashes`), so a message citing a branch commit no longer changes the slim history when that branch merges; branch publishes replace their own GitHub branch and `-- --force` replaces GitHub main once (TOOL-043).

- art(naruto): record user visual approval of airLight1Alt v01, airLight2Alt v01, airLight3Alt v01, heavyAlt v02, hurtHighAlt v01, hurtLowAlt v01, light1Alt v01, light3Alt v02, light4Alt v01; retain technical evidence and unrelated holds.

- art(naruto): light2Alt — User explicitly kept v04 held on 2026-10-15. Not approved; contact and technical HOLD retained; no further generation authorized.

- Art (ART-ALTS-NAR): added Naruto light2Alt v04 with a single user-authorized paired f2/f3 contact repair call; diagnostic pack still shows a 30px reach and height residual. Candidate remains unapproved and on technical hold.
- Art (ART-ALTS-NAR): added a measured heavyAlt v02 restitch and source repairs for light2Alt v03, light3Alt v02 and airHeavyAlt v03; airHeavyAlt v03 is now held byte-for-byte under `raw/_qa_hold/`. Raw v01/v02 remain, so v02 may be selected and base fallback is unverified; Claude owns repack/cache/fallback resolution. No candidate is approved or in public output.
- Art (ART-ALTS-NAR): filed 11 Naruto attack-alt candidates (including v02 selections assembled from already generated parts), reconciled cumulative call budgets, and produced isolated 48-color quantized QA with paired base/alt atlas, exact input hashes, per-frame bounds and active hitbox deltas. Candidate assets remain unapproved; multiple technical holds are recorded in REVIEW.md.
- art(naruto): record user visual approval of stagger v08, win v09; retain technical evidence and unrelated holds.

- art(naruto): record the user's taunt v10 visual approval; preserve Astra's technical HOLD and archive superseded pending v07/v09 sources (ART-NAR-TAUNT10-DECISION).

- Naruto stagger v08 and taunt v10: final source-only Astra screen measured T/H 1.20 against neutral 1.292 (about 7% short centrally), improved about 12% for stagger and 7% for taunt. Uncertainty overlaps the relative 6% band, so both remain numeric anatomy HOLDs, not passes; poses are preserved, with no packed atlas assessment. Ready for Claude inspection and calibration.

- Audit Naruto stagger v07 and taunt v09 in Claude-calibrated atlas 0725f44: six frames and loop wraps, full hashes and bilateral projected measurements; both remain anatomy HOLD with torso residual and explicit uncertainty. No art approval or production changes.

- Naruto stagger v07 and taunt v09: one authorized round-4 source call each. Stagger retains its four-pose sway but the torso correction remains visually subtle and needs measurement. The task-local taunt output retains the requested pointing/callout poses; torso calibration and Astra measurement remain pending. An unrelated worker's four-frame kick output was quarantined after it was mistakenly copied to v08. Neither candidate was packed or certified. Win09 Astra audit recorded as strict-numeric HOLD, not a pass or approval.

- Naruto win v09: one authorized round-4 redraw preserves the four victory gestures and restores upright anatomy against the approved title references. Candidate awaits Claude calibration and technical review; no atlas or gameplay change.

- Naruto round4: measured every suspect packed frame; saved unapproved stagger v06, taunt v07 and win v08 after robust torso-marker failures. Self-contained diagnostic review with per-frame segment estimates and uncertainty; strict scale fails at current calibration. JumpUp v06 and superDash v03 retained as inconclusive. No runtime calibration, approval, merge or production change (ART-SCALE-R4-NAR).
- art(gojo): record user visual approval of airLight1 v07, airLight2 v05, airRecover v05, jumpFall v06, light3 v06, superDash v09, throw v05; retain technical evidence and unrelated holds.

- Review: publish three one-call targeted repair candidates with Astra findings and the user-approved Naruto taunt10 reference; distinguish improved arm/motion from unresolved contact and anatomy holds.

- Added: phone-first round-5 review gallery for the 28 calibrated fighter strips, with current atlas provenance, approved-scale comparisons and Astra findings; feedback remains outside approval records (ART-ROUND5-PHONE).

- Art: User explicitly approved gojo idle v08 as drawn on 2026-10-15. Visual approval only; Claude calibration, clipping/scale/loop checks and final packed-atlas audit remain pending. No new generation, merge or production deployment authorized.

- Added: mobile feedback gallery for exact Gojo idle08 and Goku idle02 source candidates, approved references, provenance and explicit technical holds (ART-IDLE-PHONE).

- Gojo round4: re-stitched light3 v06 from immutable v05 parts at Claude's hair-measured factor 1.024, downscaling A to preserve relative fit; saved one authorized idle v08 whole-strip redraw from the approved combat cell with generation hash and pose hold. No calibration, pack or production atlas changed.

- Gojo round4: added a hash-identified Claude handoff for idle/superDash calibration review, light3 seam diagnosis and airLight1/throw source-column assembly; separates confirmed envelope/torso/seam concerns from projection uncertainty and records remaining image-call budgets. No art, calibration, production atlas or approval changed.

- Gojo round4: saved jumpFall v06, airRecover v05, throw v05, airLight1 v07, airLight2 v05 and light3 v05 as unapproved candidates; added quantized diagnostic atlas, per-frame Astra H/T/A/L/S holds and review gallery. Full strict pack remains blocked; airLight2 call overrun and source recovery are disclosed. No production atlas, scale calibration or approval changed.

- Gojo round4: versioned combat-stance idle v07 and superDash v08/v09 candidates with strict diagnostic reports and actual atlas segment landmarks; QA holds retained, production approvals/calibration and run studies preserved.

- User selected Gojo G relaxed-arm glide direction; H/I study sources retained as rejected alternatives. Leg-phase/seam technical holds remain; production runv12 unchanged.

- Gojo G/H/I review-only run/glide studies following D, with relaxed swing, one-pocket and low floating arm treatments; versioned sources, eight-frame contacts, playable GIF/MP4 and verified embedded demo. Measured density correction clears neutral head probe; leg/seam review holds remain. Production runv12 unchanged.

- Gojo D/E/F eight-frame run/glide direction studies: versioned review-only sources,48color native cells, contact sheets, GIF/MP4, embedded offline demo and browser/media QA; earlier B/C rejected. Production runv12 unchanged; scale/anatomy/leg-continuity holds remain.
- art(sasuke): record user visual approval of beamFire v07, dash v07, superDash v07; retain technical evidence and unrelated holds.

- art(sasuke): jumpSquat — User approved v07 as drawn on 2026-10-15. Visual approval only; all Astra anatomy and technical HOLDs remain for Claude. No merge or production authorization.

- Sasuke round4: file jumpSquat v07 from the single authorized arm-repair call; exact generation event and SHA256 recorded, candidate awaits review and packed anatomy QA.
- Sasuke round4: audit the calibrated a2a8faed atlas (8 frames), resolve prior fist clipping, record native bilateral segment evidence and remaining anatomy HOLDs; jumpSquat extended-arm concern, existing v06 manual QA preserved.

- Added Sasuke round-4 calibration handoff with exact source/candidate hashes, strict-pack evidence and remaining call budgets; superDash v07 remains held for Claude's measured placement review.
- Sasuke round4: measured sandal failures trigger beamFire/dash redraws; superDash and spot-dodge candidates filed for full-body audit. No art approval or runtime calibration change.
- art(killua): record user visual approval of guard v09, idle v11, superDash v08; retain technical evidence and unrelated holds.

- art(killua): stagger — User approved v08 as drawn on 2026-10-15. Visual approval only; all Astra anatomy and technical HOLDs remain for Claude. No merge or production authorization.

- ART-SCALE-R4-KIL: one authorized imagegen call patched Killua stagger v07 f3; v08 preserves f0-f2 pixel-for-pixel. Actual-manifest diagnostic pack uses unchanged bodyHeight186 and byte-identical auto-head sidecar; packed probe reads head1.025/feet1.235, with shoe/body review still held and approval pending.

- Audit Killua calibrated idle11, guard09, superDash08 and win05 from exact atlas hashes: stance heights pass; explicit head target and upright win torso remain HOLD, with all16 per-frame bilateral measurements and uncertainty. No art approval or output changes.

- ART-SCALE-R4-KIL: corrected the Killua gallery to foreground selected candidates, play exact diagnostic atlas frames beside approved references with pause/step controls, and expose Astra’s stagger loop-reset hold; art and approvals unchanged.

- ART-SCALE-R4: Killua unapproved taller idle/guard and superDash/stagger/win redraws, per-frame native48 anatomy evidence and diagnostic review gallery; strict packing/calibration holds, shipped atlas unchanged.
- docs(scale): hand all24 explicit round5 user approvals back to Claude; retain light2Alt and airHeavyAlt holds.

- Added: a raw sidecar can list `"erase": [[x, y, w, h], ...]` rectangles that the packer clears before packing, for a leftover the stray cleanup keeps because it sits close to a body (TOOL-042; art/PIPELINE.md).

- docs(scale): hand user-approved Sasuke jumpSquat07 and Killua stagger08 back to Claude for technical checks; retain Naruto light2Alt04 hold.

- Fixed: relay `send` now marks every earlier ring as read, so a ring Claude handled by hand no longer wakes the next watcher as if Codex had already replied (ADR 0033).

- Added: Goku's approved art references (PR #94): title-style neutral + combat v02 (v01 superseded: too small), model sheet v02, expressions v02 and idle v02 (calibrated: idle bodyHeight 233, packs at x1). He still plays on the baked placeholder until his core animations land.

- Art: record explicit user approval of Goku model sheet v02 and expressions v02; promote exact approved fixed references, preserving idle technical holds.

- Art: User explicitly approved goku idle v02 as drawn on 2026-10-15. Visual approval only; Claude calibration, clipping/scale/loop checks and final packed-atlas audit remain pending. No new generation, merge or production deployment authorized.
- Art: completed scale-relay calibrated audits, held airHeavyAlt03, re-stitched Gojo light3 and saved the authorized final Naruto/Gojo source calls; all holds and user-feedback stop recorded, relay not rung.

- Changed: clarified that Codex character-art generation work must use `gpt-6-luna` at `medium` reasoning; documented that the image-generation tool's rendering model is controlled separately.

- Added: Luffy's approved art references (PR #93): title-style neutral + combat v01, model sheet v01, expressions v01 and idle v01, plus his CHARACTER, ANIMATIONS, MOVES_AND_VFX and PROMPTS briefs. He still plays on the baked placeholder until his core animations land.

- Added: Claude-Codex relay (TOOL-041, ADR 0033): `npm run relay` queues the inbox prompt into a lane's Codex chat (`codex queue`), Codex rings a git-ignored doorbell that wakes Claude's background watcher, with a 4-round-trip limit per lane between user replies, a pause switch, and approvals never relayed; `npm run test:relay`. AGENTS.md, CLAUDE.md and AI_COLLABORATION.md say when to send, ring and stop.

- Art: returned round-4 Naruto source repairs and win09 Astra HOLD plus Sasuke/Killua/Gojo calibration handoffs to Claude; preserved calibration files and documented source-recovery/failed-probe incidents. No candidate approval, merge or production deployment.

- Complete calibrated Naruto 14-frame Astra audit, use one authorized win09 redraw, and request Claude recalibration; preserve source budgets and withhold preview while anatomy holds remain.

- Resume Naruto round-4 final anatomy audit from Claude calibration f3191a6; keep Naruto attack-alt calibration files reserved to Claude and withhold another preview pending audit.
- Added: Goku (Super Saiyan, Cell saga) and Luffy (Enies Lobby, Gear Second / Third) are playable on baked placeholders (ADR 0032): their kits, KIT.md briefs and reserved manifest blocks; a `laneStrike` ultimate kind (Gigant Pistol), flurry options `front` / `hitColor` / `finalFx: 'impact'`, and the `kiFist` hand effect. Goku's Kamehameha is the cast's one beam.

- Preserve Naruto pre-calibration reference audit and correct the torso-projection inference; await Claude calibration before new art or another preview. No sprite or gameplay changes.

- Reopen Naruto round-4 scale repair before further user review; request Claude calibration and reserve Codex source analysis plus independent final segment audit.

- Fixed: `npm run deploy`, `publish:github`, the art merge guard and `stitch` no longer fill the system drive. Their throw-away copies (a deploy export is ~4 GB) go to `gcd-scratch` at the root of the project's drive when `%TEMP%` is on another drive (`tools/scratch-dir.mjs`; `GCD_SCRATCH_DIR` overrides). Deploy also sweeps stale `gcd-deploy-*` exports left in `%TEMP%` by older runs.
- Publish Naruto alt PR88 and committed selected-only preview; record completed 65-frame Astra HOLD audit, exact contact baseline, browser limitations and all-five-package review handoff. No image approval or production integration.

- Added (TOOL-028): `npm run pr -- merge` now runs an art guard (`tools/pr-guard.mjs`) on the merge result and refuses a branch whose changed fighter strips have a newest raw `_vNN` that is not the manifest `approvedVersion` (move it to `raw/_qa_hold/` or get it approved), ship an unapproved committed pack, or fail the strict scale gate (packer dry run on scratch copies, nothing written under art/ or public/); `--force-art "<reason>"` overrides and records the reason in the merge commit; `npm run pr -- check <branch>` previews the verdict read-only; `npm run test:guard` covers it.
- Link Gojo PR83 and committed review preview; complete the Part 1 handoff with all anatomy holds explicit and Naruto alts still in progress.
- Added: animation-contract lint `tools/lint-anims.mjs` (TOOL-004), the first step of `prebuild`: every `animGuide.js` animation needs a manifest default and a per-fighter entry, optional ones a `FALLBACK` entry that names real animations and reaches one the placeholder bakes, every `altOf` repeats its base's frames and phases, and `art/SPEC.md` must name every animation (warning only). `npm run lint:anims`, `--strict` to fail on warnings; skips the manifest/SPEC checks when `art/` is absent (deploy export).

- Added: undeclared-identifier check `tools/check-undeclared.mjs` (TOOL-027), the second step of `prebuild`: a parser-free lexer + scope pass fails the build on any name used in `src/**/*.js` that is never declared, imported or a known global (the ENG-062 `MODE_ORDER` bug). `npm run lint:undeclared`; `npm run test:lints` covers both lints (`tools/test-lints.mjs`).
- Fixed (TOOL-037): the packer's automatic hit box finder measured its "rising strike" rule against the idle head, so a crouched title-style idle made the hair of every upright pose a strike box. It now measures against the approved standing cell (`art/scale/builds.json` `standingReference`, the title-style neutral; byte copies added for Killua and Sasuke), and the "no clear strike limb" note no longer counts frames `hitboxes.json` overrides. The `--json` report gains `hitBoxes` and `hitRef`. Shipped art: one auto box moves (Naruto specialUp f3, same front edge).
- Added: `soak(n, opts)` debug helper (ENG-012, `?debug`): n CPU vs CPU matches on the fixed step, every frame checked for NaN positions, ring-outs outside a KO, stuck states, console errors and stalls; returns a summary (winners, rounds, durations, every violation with frame / fighter / state / position), progress in `window.__soak`, `Math.random` reseeded per match (`seed` option). TESTING.md's manual soak recipe is replaced by it.

- Fixed: ENG-075, a clash push-back (Gojo mirror) carried a fighter up to 0.4 past `ARENA_LIMIT` for the whole struggle; reproduced with `soak()` by removing `placeClash`'s clamp (23 ring-outs in 15 of 24 cornered Gojo mirrors), the clamp that was already on main (69e8b14) now carries the ENG-075 note and the soak shows 0 ring-outs.

- Record round-4 generation-budget breaches and exact-hash recovery of Gojo temporary sources; no versioned candidate was overwritten or approved.

- Art round 4: link Killua's committed selected-loop review preview; retain all anatomy holds. Further browser QA uses the Codex browser per user direction.

- Independent round-4 Astra audit records HOLD findings across 123 Sasuke, Killua and Naruto frame instances, with exact atlas hashes and native comparison sheets; review previews remain unapproved diagnostic output.

- ENG-081 opened the Naruto attack-alt pilot gate; a Luna worker is preparing frame tables in `art/naruto-alts`, and Astra performs the independent final anatomy audit. The vanished external Gojo checkout is being recovered from its preserved branch and backed-up measurements into a real project worktree.

- Changed: future Codex agents use GPT-6 Luna with medium reasoning for all work except final anatomy/scale audits, which use GPT-6 Astra with medium reasoning; matched policy in AGENTS.md and CLAUDE.md preserves user art approval (OPS-008).

- Round-4 fighter scale consistency work started in isolated sparse worktrees with one sub-agent per fighter; every visible body segment is measured in the packed atlas. Naruto attack alts remain gated on ENG-081 landing on main; Gojo run direction studies and round-3 candidates are preserved.

- Record user rejection of prior Gojo B/C movement studies and link D/E/F review deliverables in the existing managed worktree; production runv12 unchanged.

- Review recovery (2026-10-12, OPS-PERM-20261012): saved a durable, self-contained Gojo B/C HTML comparison and v02 GIF/frame exports in docs after TEMP expired; no new drawing call or production-art change. Prepared a root-relative workspace permission edit and separate Git/local-preview verification guide; no configuration, ACL, worktree or production deployment changed.

- Workflow (2026-10-12, OPS-005): all GCD Tourney worktrees must live inside project `.worktrees/`; removed the older allowance for external Codex app worktrees from collaboration instructions and aligned AGENTS/CLAUDE. Documented app Worktree root setting and read-only inventory: external Gojo checkout preserved pending inspection, Killua checkout preserved with three unmerged commits. No app setting, permission profile, worktree move or deletion performed.

- Art review follow-up (2026-10-12, ART-TITLE-R3): standalone full eight-frame Gojo B pocket-glide and C blindfold-float comparison, versioned source inventory, normal/half-speed GIFs and synchronized interactive controls. Review records only committed; artifacts remain in permitted TEMP pending accessible real-worktree filing. No manifest, atlas, gameplay or production changes.

- Art/workflow follow-up (2026-10-12): Codex app created a real Gojo worktree; current session access remains blocked outside its permitted roots. Added a three-direction Gojo movement study for review (tool output awaiting versioned worktree filing); no atlas or production change. Restored repository-local commit identity from recent commit history.

- Art follow-up (2026-10-12): recorded Sasuke/Killua/Gojo movement scale feedback and Gojo run/glide concept request. Round-3 production stopped at denied real worktree creation; no new candidates or production changes.

- Changed: Gojo title-style art ships (PR #72) with round-3 QA: airLight3 v12, airHeavy v08 and special v07 boxes re-measured; run v12 (the user's hover-glide), special v07 and airHeavy v08 are user-approved stand-ins until the round-3 redraws.

- User approved gojo round-2 art: airLight3 v12. Other visual/technical holds remain for Claude integration; no production deployment.

- Gojo title-style round2 candidates: airHeavy v08 best and airLight3 v12 clear the strict scale gate, with a hair-volume hold retained for airHeavy after technically failed v09; run v12 hover-glide and special v07 also pack but retain explicit tighter-scale / body-seam visual holds. Versioned history, cumulative budgets and native review evidence retained; no approval, main integration, production deploy or tech animations.

- art(gojo): draft upright run v10 using authorized A1/B2 attempts; add strict isolated native review and measured evidence. Height214–221px and margins pass; tight2% head and clean leg alternation remain held. Full fighter pack still blocked by existing airLight3/airHeavy. New v10 unapproved.

- Art (PR72, not on main yet): Gojo's title-style set with the user's 2026-10-11 approval recorded; light4 v08 re-stitch, true-scale fits for launched/getup/ko, manual scale records, hit boxes re-measured on the new art (heavy keeps its old box: the drawn elbow never reaches). Strict scale gate still fails on airLight3 and airHeavy (head drawn too small); special's part A head and fragments and run's repeated lead leg need new images.
- art(gojo): add direct diagnostic playback for all 42 current candidate strips and three UI images in the draft preview, visibly labeled with strict-gate and motion holds.
- art(gojo): clear down and KO cell clipping by measured whole-pose placement, retaining original lying pixels and unresolved floor-contact holds.
- art(gojo): preserve launched v04 reaction pixels in v06 with measured offsets that clear cell clipping; retain its low-confidence scale hold and diagnostic native contact.
- art(gojo): retain rejected third light4 recovery half after it repeated the oversize A/B seam; document the exhausted source budget and strict-pack hold.
- art(gojo): correct five-pose getup segmentation and superDash placement; retain exhausted run and heavy source attempts with explicit QA holds.
- art(gojo): add anatomy corrections for specialDown, superPose, throw, airLight1 and light3; all five clear the automated head gate while full frame review remains pending.
- art(gojo): add corrected special and specialForward candidate strips; preserve measured part-size seams and original down/KO pose holds for review.

- art(gojo): begin the approved title-style 42-animation and three-UI redraw; preserve versioned candidates and explicit scale, pose, and pack QA holds (ART-GOJO-TITLE).
- Changed: Sasuke title-style art ships (PR #71) with round-3 QA: launched/down/KO calibrated to his standing size (manual QA), heavy/throw within 2% of the idle, heavy/throw/specialUp boxes and the release point re-measured.

- User approved sasuke round-2 art: heavy v11, backDash v07, charge v12, block v07, throw v07, stagger v08, specialUp v09. Other visual/technical holds remain for Claude integration; no production deployment.

- art(sasuke): add seven strict-passing round-2 correction candidates and three explicit holds on PR71, with native quantized review playback, cumulative attempt inventory and retained original approvals (ART-SAS-TITLE-20261011).

- Art (PR71, not on main yet): Sasuke's title-style set with the user's 2026-10-11 approval recorded; the approved originals ship for throw, stagger, launched, spin, airRecover, down, ko, specialUp and superPose (manual scale checks against the new idle); edge, run and jumpFall placement fixes; hit boxes re-measured on the new art. Strict scale gate fails only on the original throw v01 (the same finding as live).

- Added Sasuke title-style first-pass source coverage for all 42 canonical animations and three UI candidates, with a 48-color diagnostic player and explicit mixed-atlas review holds (ART-SAS-TITLE-20261011).
- art(sasuke): add title-style intro v03 and rear-view win v04 with native 48-color QA; archive unreadable superPose v03 eye detail after atlas crop.
- art(sasuke): add title-style getup v05 with native five-frame manual inverted-head QA; archive two clipped/head-popped throws and two frontal staggers.
- art(sasuke): add numeric-gated superDash v05 with measured whole-frame placement and archive unproven spin/airRecover sources without production scale exemptions.
- art(sasuke): add title-style charge v11, beamCharge v05 and beamFire v05 with 48-color native atlas QA; record beamFire's historical contact-zone hold and archive five earlier power-pose candidates.
- art(sasuke): add title-style block and Sharingan taunt with numeric pack passes, and vanish with versioned manual afterimage QA; archive four oversized or mismatched candidates.
- art(sasuke): add title-style jump squat, falling loop and landing with actual atlas QA; document the crouch's manual low-confidence scale finding and archive two falling rejects.
- art(sasuke): add title-style dash v05 and backDash v05, plus jumpUp v05 with a documented manual airborne-tuck scale exemption; archive five failed movement candidates.
- art(sasuke): add title-style high/low hurt reactions with measured head-fit heights and actual 48-color atlas QA; archive three failed launched candidates without a scale exemption.

- art(sasuke): preserve original down/KO pose layouts in new-style attempts v04/v05, archive technical rejects after clip, floor-contact and uncertain-scale checks; keep original approved poses active pending redraw guidance.

- art(sasuke): add title-style airborne hammer v04 with measured two-part stitch and documented manual f0/f1 head-mask finding, backed by actual atlas crops.

- art(sasuke): add title-style airborne jab v04, correct a measured 4 px contact-fist clip without changing generated pixels and inspect all five packed frames.

- art(sasuke): add title-style heavy rising launcher v10 with measured generated idle recovery, preserve rejected v09 and verify eight 48-color packed frames.

- art(sasuke): add title-style roundhouse v08 and correct light1 v09, light2 v07, light3 v08 recovery endpoints to the approved open-palm stance by measured reuse of generated idle source poses; preserve all prior versions and verify the 48-color atlas.

- art(sasuke): add title-style front kick v07 with measured placement, unclipped active sandals and a recovery pose that rejoins the approved idle height; archive two rejected attempts.

- art(sasuke): correct the lead jab's early extension in title-style v07; preserve rejected v06 and inspect all seven packed frames. The v07 two-fist recovery was later rejected because the approved stance has an open lead palm.

- art(sasuke): add title-style rear straight v06 candidate with measured stitch, strict new-strip scale pass and actual-atlas QA; archive enlarged-head v05. Its closed-fist endpoint was later rejected against the approved open-palm stance.

- art(sasuke): start approved title-style redraw with measured idle v07, corrected guard v04 and lead jab v06 candidates; preserve pilot references and document the guard mask exemption and pending full-batch QA.
- Changed: Killua title-style art ships (PR #70) with round-3 QA: idle loop offset, beamFire/run v09 within 2% of the combat cell, beamFire hand points; charge v13, beamFire v09 and run v09 are user-approved stand-ins until the round-3 redraws (charge with a recorded size exception).

- User approved killua round-2 art: idle v08, stagger v05, taunt v05. Other visual/technical holds remain for Claude integration; no production deployment.

- Art: Killua round-2 title-style corrections in PR70: idle v08, stagger v05 and taunt v05 pass a strict diagnostic subset and await review; charge v13, beamFire v09 and run v09 remain held. Full fighter strict pack fails charge. No new art approvals or production integration.

- Art (PR70, not on main yet): Killua's scale gate measures against the approved title-style combat cell; launched refit, manual scale records, the win cuff misread, the user's 2026-10-11 approval of the shown versions (UI portrait v02 / cutin v03 / select v02 promoted), and hit boxes re-measured on the new art (his light string lands again). Strict scale gate still fails on charge, stagger and taunt (head/hair drawn too big) and down (decision); idle loop dip, beamFire recoil and run phase need new images.

- Killua review: expose all three unapproved UI candidates through a separate fitted diagnostic gallery; approved UI is untouched.

- Killua: refine specialDown hair without changing body scale; document footwear-proxy limitations and peer anatomy QA, refresh all41 non-idle diagnostic candidates. No production approval.

- Killua: added native animation workbench and corrected recovery candidates; documented same-pixel probe sensitivity and intact-source stitching failure. All new art remains unapproved; full production gate blocked.

- Killua title-style production checkpoint: versioned attacks/reactions/specials, approved-reference diagnostics and explicit anatomy/motion holds; no new approvals or production release.

- art(killua): add eight title-style movement/reaction candidates and controlled idle anatomy re-evaluation; all pending review, full atlas not ready.

- Art: eight independent Killua title-style candidates and approved-reference QA controls; idle, taunt and win technical holds remain. No production release.

- Added: Killua title-style production trial from the approved pilot: versioned idle and guard strips plus three UI candidates, with native-size QA and a documented idle loop hold. Existing fixed-name art remains approved; no production integration yet (ART-KIL-TITLE-20261011).
- Changed: Naruto title-style art ships (PR #69) with round-3 QA: KO calibrated to the down pose, round-2 strips within 2% of the idle, re-measured airLight3/light2 boxes; spin v07 is a user-approved stand-in with a recorded size exception until spin v08; run v07 ships while v08 is held.

- User approved naruto round-2 art: charge v07, jumpUp v06, specialDown v05. Other visual/technical holds remain for Claude integration; no production deployment.

- User approved Naruto airLight3 v09 and KO v09 artwork; approvals recorded in PR #69. KO calibration/contact and other existing technical holds remain for Claude; no production deployment.

- Naruto KO/kick v08 user rejections archived; v09 whole-pose redraws use exactly three authorized calls. Kick passes strict scale and margins; KO remains a calibration/manual QA hold with a separately labeled77px proposal (PR69).

- Naruto title-style round2: seven versioned corrections and native48-color review evidence; three recommended for art review, run/kick motion-size holds and KO/spin manual QA pending (PR69).

- Art (PR69, not on main yet): Claude assembled Naruto's approved source-only title-style parts with the fixed stitch (light1 v04, light2 v06, airLight3 v07, airHeavy v09, special v08, specialForward v04, specialUp v04; heavy v12 re-stitch), fitted their scale, recorded the user's 2026-10-11 approval of the versions shown in the final preview, re-measured hit boxes and hand anchors on the new art, and added manual scale records. Strict scale gate still fails on jumpUp, airLight3, airHeavy v09, specialDown, spin and ko (new images or decisions needed).

- Added: Naruto diagnostic player now shows packer-fitted previews of the new versioned portrait, cut-in and select UI sources without changing approved UI files (ART-NAR-TITLE).
- Added: Naruto title-style airLight3 v07 head-proportion and airHeavy v09 motion redraw source parts; both remain source-only because the stitcher aborts at Part A head detection before assembly (ART-NAR-TITLE).
- Added: Naruto title-style airLight3 v06, airHeavy v08, special v06/v07 and specialForward v04 sources. AirHeavy passes isolated scale with repeated-pose motion hold; airLight3 clips/has oversized heads, while special and specialForward expose stitch assembly blockers (ART-NAR-TITLE).
- Added: Naruto title-style airLight2 v05, specialDown v04 and specialUp v04 source parts; airLight2 passes isolated strict scale, specialDown remains a bowed-head scale hold, and specialUp exposes a stitcher manual-factor head-probe blocker (ART-NAR-TITLE).
- Added: Naruto title-style light3 v04, light4 v08 and heavy v11 source strips and native atlas QA; all pass isolated strict scale, with combo/recovery motion checks recorded for review (ART-NAR-TITLE).
- Added: Naruto title-style airLight1 five-frame jab candidates; best v06 passes isolated strict scale but overshoots the fist contact zone, while v07 reaches the cell margin (ART-NAR-TITLE).
- Added: Naruto title-style light2 seven-frame rear straight candidates and measured stitch QA; best assembled v05 passes isolated scale but misses the chin contact zone, and v06's four source figures overlap in x projection so the stitcher miscounts them (ART-NAR-TITLE).

- Added: Naruto title-style win v07 four-phase bent-elbow victory loop; measured anatomy and fist top pass isolated strict 48-color QA (ART-NAR-TITLE).

- Added: Naruto title-style superPose v05 clean-cutout four-frame seal loop with isolated strict 48-color scale and loop QA (ART-NAR-TITLE).

- Added: Naruto title-style throw v09 candidate with old v02 hand edits preserved; isolated scale passes, but release hand overshoots the gameplay contact zone and remains held (ART-NAR-TITLE).

- Added: Naruto title-style intro v05 candidate with stable four-frame crossed-finger seal loop and isolated strict 48-color pack result (ART-NAR-TITLE).

- Added: Naruto title-style stagger v05 four-frame candidate; isolated scale gate passes, but opposite sway lacks distinction and remains a motion hold (ART-NAR-TITLE).

- Added: Naruto title-style vanish v04 candidate with measured native 48-color anatomy comparison and version-scoped manual scale QA; final cast review and full-pack resolution remain pending (ART-NAR-TITLE).

- Added: Naruto title-style production checkpoint from the user-approved pilot: provisional idle v07, run v07, dash v04, backDash v04, superDash v03, jumpSquat v04, jumpUp v04, jumpFall v04, land v06, guard v05, block v05, hurtHigh v04, hurtLow v03, getup v07, charge v06, beamCharge v08, original-pose down v05/KO v07 and three UI candidates. Native atlas QA records isolated dash/block/jumpFall passes and manual low-confidence crouch QA; idle/run/jumpUp/land and down/KO holds remain without promotion, and light1 stitch is rejected and launched v05, spin v06 and airRecover v07 and taunt v06 remain anatomy holds; beamFire v12 remains a scale/contact hold (ART-NAR-TITLE). The old game art remains the approved release until final review and Claude integration.
- Changed: the spot dodge holds the vanish strip's crouch frame instead of playing through to its standing toe-rise; with the crouched title-style idles every fighter popped up taller for the whole dodge.

- Fixed: the packer warned about clipped or margin-touching frames of a strip that the auto head fit then placed again at its fitted size (Sasuke special v13 "clipped 15px" for a fitted frame inside the cell); the warnings now describe the cells that ship.
- Added: tech poses (ENG-079, TOOL-034, ADR 0030): three optional canonical animations, `techGround` (tech in place), `techRoll` (tech roll, played backward for a back roll) and `wallTech` (wall tech; the wall jump reuses its push-off, then `jumpUp`), played on each tech state's own clock (`DEFENSE` `animPhases`) so the art never changes timing; a fighter without them keeps the old `land` / `airRecover` / `jumpUp` poses. The packer wall-anchors the cling frames on the barrier (anims.json `wallAnchor`, re-centred on walls seen in depth), warns on a thin wall contact or a tucked pose packed at standing height, and the scale gate reports their unreadable beats as not read (`partial` until a manual QA record). Brief for Codex: art/characters/TECH_POSES_BRIEF.md. `npm run test:anims`.

- Fixed: tech poses review (ENG-079, TOOL-034, ADR 0030 revision), before any tech art: the wall tech's cling and push-off frames are packed against a wall line at cell x 8 (anims.json `wallLine`; the pivot column cut off a full push-off for tall fighters) and drawn with that line on the barrier; the tech roll keeps its on-screen facing and back-roll direction when the opponent crosses over; the wall jump's push-off stays turned from the wall to its last frame and never replays after an air attack; the roll's shoulder contact is no longer measured by the scale probe (not read, and in the size band); the recorded scale audit keeps every unread frame; the per-frame tech pose helpers reuse their results.

- Changed: the approved title-style cells and production contract (PR #68) are the one scale and anatomy baseline for the cast and new characters (ADR 0029). CLAUDE.md, AGENTS.md, the art spec/guides, the agent prompts and the character templates point there; the 200 px / 31 px / 6.5-head, canon-height and pixels/cm numbers are marked historical. Runtime scale data and shipped atlases are unchanged.
- User approved the four title-style v01 character references and scaled lineups; full animation production authorized with original down/KO poses preserved in the new style.
- Art: capture title-style production QA lessons, reproducible stitch/probe holds and Claude handoff; add a consolidated candidate-review hub. Full sources exist across all four fighters, but new strips/UI remain unapproved and production unchanged.

- Art review only: original-title-style four-character draft, shared-size neutral/combat comparison and documented current Killua/Sasuke silhouette mismatch. Pilot approved by the user; subsequent production candidates remain unapproved and production unchanged.
- Added: `builds.json` `scaleReference` (approved reference cells the scale gate measures every strip and the idle against, for a fighter whose idle biases the probe), and a whole-figure frame split in the packer for strips whose column split cuts a connected figure (Gojo airLight1/light2/light4, Killua light3/specialForward). Main's shipped atlases are unchanged.

- Fixed: `npm run stitch` cut connected figures into neighbouring frames when their horizontal projections overlapped (Killua specialForward v12, Naruto light2 v06, special v07), aborted on parts whose hair yellow differed slightly from the quantized shipped idle (Naruto's title-style aerials), and refused a written manual factor where no head was found. It now separates whole figures, lays them out with clean gaps, measures against a fresh unquantized idle, and honours `--factor` with `--landmarks`/`--uncertainty`.

- Reverted: the redrawn cast (PRs #61-#64) and its repack, at the user's request (2026-10-11); the game is back on the previous approved art for all four fighters. The redraw stays in history; the next art revision lands as a new PR.

- Changed: the redrawn cast ships (PRs #61 Gojo, #62 Sasuke, #63 Naruto, #64 Killua): every strip at the user-approved version on the approved neutral baseline, the scale gate clean (0 flagged strips) with the documented rescales, version-scoped misread notes and manual QA records. Killua's down and ko temporarily use the previous approved v04 / v05 until their fixed versions pass QA and approval (user decision 2026-10-11).

- art(killua): record explicit user approvals for light1 v09 and airLight3 v08; archive superseded pending versions. No new generation or runtime promotion; down05/ko06 manual QA remains Claude-owned.

- art(killua): record user approval of run07, heavy10, airHeavy06, special05 and specialDown04; begin newly authorized three-call hair corrections for light1 and airLight3. Down/KO manual decisions remain Claude-owned.

- art(killua): additional authorized corrections for nine strips, refreshed already-approved idle reference and guide, full-frame evidence and attempt ledger; five per-strip passes, two capped holds and two Claude manual-QA holds. Runtime atlas unchanged (ART-KIL-SCALE-W1).

- Record user blanket visual approval (2026-10-11) of Killua PR64 latest reviewed checkpoint, with exact versions. Strict pack and manual anatomy holds remain; no atlas or manifest shipped-approval promotion (ART-KIL-SCALE-W1).

- Killua approved-neutral redraw checkpoint:42 actions generated;10 strict scale failures and8 manual anatomy holds remain. Versioned sources, calibrated sidecars, attempt ledger, review gallery and stitch-ROI tooling evidence; no new art approvals or atlas promotion (ART-KIL-SCALE-W1).

- Capture Killua jab stitch refinement failure: the old packed idle target clips new heads, then the probe selects a shirt hem; preserve per-frame ROI/provenance evidence for Claude without changing tools or waiving final art QA.

- Killua scale-fix evidence: retain 19 asset candidates, side-on KO/down and measured long-strip redraws; block approval/integration on the failing palette-sensitive scale gate. Previous approved runtime sheet retained.
- User approved Naruto light4 v07; superseded pending light4 versions archived. Naruto strict repack passes; PR63 ready for Claude integration when cast gates clear.

- Naruto light4 v07: localized generated f0 hair correction clears full strict scale packing. Other seven poses and all bodies preserved; candidate atlas updated, image approval pending.

- Recorded user approval of Naruto heavy v10, throw v05 and airLight3 v05. Three additional light4 corrections retained v05 (v06 inferior retry archived), still held by the strict scale gate; runtime atlas remains unchanged.

- Naruto post-approval candidates: heavy v10 fixes raised-pose clipping; throw v05 and airLight3 v05 pass scale. Light4 v04 remains held after the authorized extra attempts; strict packing blocks runtime changes. New versions await review (PR63).

- Record user visual approval of Naruto latest42 checkpoint versions (2026-10-11); preserve10 strict holds and8 unmeasured candidates, with shipping manifest promotion deferred until technical clearance.

- Naruto getup v04 fixes the floor palm direction and two-foot deep landing squat within original3-attempt cap; rotating-head scale remains explicitly unmeasured.

- Naruto backDash v03 corrects push-off, backward-hop balance and landing with original attempt2; pack passes. Added per-part attempt-cap evidence for ten remaining technical holds.

- Naruto: draft neutral-baseline checkpoint for all42 animations;32 packed candidates and10 technical holds, explicit unmeasured scale states, immutable sources, heads audit and browser review gallery. No new animation approved (ART-NAR-PROP,2026-10-11).

- art(naruto): queue idle v04 at the approved seven-head-model gate; measured stitch, independent idle consistency audit and darker-gold hair probe declaration. Preserve approved idle v02 until review.
- art(sasuke): verify final specialForward v06/getup v04 user approvals and passing strict atlas; hand off integration to Claude.

- art(sasuke): record charge v09/special v10 approvals; retain Claude-calibrated specialForward v06 and getup v04 for review with a passing strict atlas.

- Sasuke second correction round: record approved superDashv04; chargev09 and specialv10 pass scale checks. Strongest specialForwardv06 retained with explicit hold, getupv04 unchanged for Claude manualQA.

- Sasuke post-approval correction candidates and complete frame evidence: refreshed approved idle guide, localized charge/rush edits, corrected getup proportions and superDash clearance; four strict/manual holds remain, no new approvals or production atlas.

- Sasuke: record user blanket visual approval for latest42 reviewed checkpoint versions (2026-10-11); preserve six technical failures and manual continuity holds, defer shipping application to QA/Claude integration.

- Sasuke: twelve bounded neutral-redraw corrections and exact probe-mask evidence; all42 candidates remain unapproved, six strict-pack holds remain (draft PR62).

- Sasuke neutral redraw checkpoint: all 42 animations / 175 source frames, anatomical sidecars and full diagnostic gallery; strict scale failures and exhausted attempts remain explicit holds (ART-SAS-NEUTRAL).

- Sasuke: idle v02/v03 candidates against approved smaller-head model; heads and lineup show proportion/build caveats, correction recommended before baseline approval.
- Gojo: record user approval of airLight3 v07 and archive superseded v05.

- Gojo: record user approval of charge, airHeavy and win v06; start newly authorized airLight3 correction round.

- Gojo: corrected hair continuity in airHeavy v06, charge v06 and win v06; queued visual review. AirLight3 remains capped technical hold. Refreshed fixed approved idle and its measured guide.

- Recorded user visual approval of all 42 selected Gojo redraw versions; technical holds and shipping gates remain open.

- Gojo spin v03: targeted hair-mass correction and independent anatomical-axis calibration; preview explicitly separates eight manual-QA holds from numeric passes. No new animation approval.

- Art review checkpoint: Gojo approved-neutral redraw sources for all42 animations;37 candidates pass packing,5 technical holds preserved. Adds full-frame review page and production QA evidence. No production integration.

- Begin Gojo full42-frame-set redraw against user-approved neutral baseline; candidates remain unapproved.
- Fixed: the packer shipped hand-edited frames of an older version under a newer approved raw (Naruto light4, throw, specialForward packed v01/v02 as v03/v04). Such a pack is now refused with the fix named; `frames/_old/` archives are ignored.
- Added: the scale gate's acceptance path for poses the probe cannot read (TOOL-ROTATED-ANATOMY): an unmeasured candidate strip now fails until a version-scoped `scaleManualQA` record exists, and is then reported as `manual`, never `ok`.
- Fixed: `npm run stitch` measured redraws against a stale packed idle and could refine to a scale that cut the head off the cell; it now checks the idle version, ignores clipped trials, measures like the gate and takes `--counts A,B` for touching poses.

- Integrated user-approved decal PRs #53, #52 and #54 sequentially: 31 types / 143 variants, approved-only combined atlas, unchanged reviewed pixels, maximum four pages per match; 308 regression checks and production build pass. Accepted visual QA caveats preserved; character redraw untouched.

- art(decals): record user approval of cursed erasure/trench/repel/big v02 and implode/fracture v03, accepting documented visual deviations; pack approved production atlas without changing reviewed pixels.

- art(decals): revise cursed candidates, preserve rejected history, remove tracked preview outputs and host an isolated candidate gallery; remaining fringe and repel hot-placement failures are explicit, no approval.

- art(decals): six cursed v01 candidates, 20 packed variants, review gallery and documented remaining palette/design caveats; no art approved.
- art(decals): record user approval of PR52's six latest chakra decal versions / 24 variants and pack approved outputs; preserve source fringe, shape and hot-key caveats as accepted deviations. No redraw or production deployment.

- art(decals): revise chakra shapes and palette candidates in PR52; preserve rejected histories, remove tracked preview outputs, add a self-contained unapproved game review atlas. Four fresh-source fringe failures remain explicitly documented; no approval or production promotion.

- art(decals): add six chakra v01 candidates (11 images/24 variants), scoped review gallery and QA; approval and palette corrections pending.

- art(decals): record user approval of all 19 latest core decal sets (99 variants), retain accepted QA deviations, archive superseded candidates, and generate approved-only output for coordinator integration.

- Fixed: the core decal review reloads candidate image pages before each group selection, so returning to a previously viewed group works after the game releases its textures (ART-DEC-W4).

- art(decals): add unapproved v02 crack_s, scuff, skid, burn_lightning_big and barrier_crack corrections; preserve source history, fresh-pack 99 variants, document remaining fringe, and bundle an independent review gallery/game harness without tracked public/preview output.

- Art: add unapproved decal style and 19 base/edge/lightning/fire/ki candidates (99 variants), candidate preview gallery and documented fringe/shading limitations.
- **Timed impact tech** (ENG-078, ADR 0028): Smash-style tech alongside the hold-Guard tech: a fresh Guard press up to 11 frames before you hit the floor or the ring barrier beats ground bounces, wall bounces (handball), spike and throw knockdowns and landings (tech in place, roll with ← / →; WALL TECH clings and kicks off, ↑ wall-jumps and can act), ends the combo and spends no bounce budget; an early press locks it out for 40 frames, holding doesn't count, presses in hitstop and freezes count, super finishes (`noTech`) can't be teched. TECH! / WALL TECH! banners, a white-cyan spark, a ting and a crowd pop; CPUs tech by level (5-65 %, with timing error), the combo composer weighs bounce routes by the victim's tech rate, DUMMY TECH TIMED, four lab scenarios.
- Art QA: document the explicit low-confidence gate limitation and hand off anatomical acceptance criteria to Claude; no blanket exemptions or threshold changes.

- Documented the reproduced stale-idle/clipped-head stitching failure and new-idle palette-mask lesson; queued tooling correction for Claude (TOOL-STITCH-ROI).

- AGENTS.md and CLAUDE.md now carry the same approved-baseline override, so historical fixed-height/head-count rules cannot silently re-enter future art prompts (ART-CAST-PILOT).

- Added a provenance-recorded cross-cast idle QA snapshot to compare corrected working anchors against approved neutrals (ART-CAST-PILOT); not an animation approval.

- Future-character templates now require measured neutral anatomy and SCALE LOCK values instead of inherited 200px/31px/6.5-head defaults; onboarding links the approved cast contract (ART-CAST-PILOT).

- Record explicit approval of the neutral four-character baseline; authorize full42-animation redraws and document shared proportional scaling for future fighters.

- Art review: add four neutral standing candidates and a common-height lineup; remove child/tall-cap adjustments in this review only. Existing production art and approvals unchanged.

- Art review: compare Gojo with official adult anime/game art and slim the sample shoulders, chest and arms while retaining height/head and the other three fighters. Queue Gojo sample v03 and lineup v04; no approvals or production changes (ART-CAST-PILOT).

- Art review: revise the cast pilot after feedback: leaner Naruto with larger head, unchanged Sasuke, and clearer Gojo/Killua height separation on an uncapped review canvas. Preserve previous samples; production remains unchanged pending review (ART-CAST-PILOT).

- Art review: generate a corrected four-character proportion pilot with idle, guard, run and light1 samples, equal-scale before/after gallery, head closeups and documented probe limits. Candidates only; full animation production waits for user review (ART-CAST-PILOT).

- Fixed: the scale gate measured every strip in the fighter-wide `--quantize` palette, so a candidate's new colours moved the unchanged idle's head (Killua 52x35 vs 52x43) and other strips' verdicts. It now measures before quantizing against the idle's own palette (declared hair colours snapped first); `anims.json` records the per-frame numbers and `npm run scale` reports those. Sheets unchanged; scale baseline rewritten once for the method change (ART-KIL-PROBE).
- Art review: add cast proportion sample gallery with fixed-scale playback, Naruto head comparisons, approved multi-angle models and title-screen reference; no shipped sprite or approval changes (ART-CAST-SAMPLES).

- Tools: `npm run pr -- merge` now deploys the merged main to production (https://gcd-tourney.vercel.app) after publishing it, so a merge is live; `--no-deploy` skips it, and a failed deploy never undoes the merge (user request 2026-10-10).
- art(naruto): add seven-head proportion redraw brief and model_sheet v03 candidate with cast lineup and mobile review; model approval required before idle. Raw palette and source-scale caveats documented.
- Sasuke: document seven-head full-redraw plan and queue model_sheet v02 with measured cast lineup; model approval stop, no new idle or shipped sprite changes.

- **CPU combo composer** (ENG-072, ADR 0026): CPU vs CPU combos are long, varied and different every match: each CPU draws a persona from its kit (rushdown, juggler, vanish artist, wall bouncer, kit showman) and composes true combos only (2+ frames of margin, read from the art's hit boxes): wall-bounce handball, vanish ping-pong, relaunches, kit grinds; IMPOSSIBLE and INSANE play the optimal persona. A per-combo bounce budget for everyone (3 wall bounces, 32/28/22 f; 2 ground bounces, 30/24 f; it was unlimited) and a super that grabs a reeling victim carries the combo on. Every match shows WALL BOUNCE! / WALL BOUNCE ×2! / HANDBALL!, GROUND BOUNCE!, RELAUNCH! and VANISH ×2! banners, a technique ticker beside the combo counter and an end-of-combo rating (GREAT, AMAZING, LEGENDARY, STYLISH!). `?seed=N`, `comboStats()` and `soak()` under `?debug`; lab Handball and Vanish ping-pong scenarios and CPU YOU.
- CPU combo composer review fixes (ENG-072): the KO'ing hit counts in a combo's rating and record, the composer closes its combo on a KO or time-up (not in the next round), and waiting for a bounce or firing a three-bar move is checked against the victim's stun like any link (tech share 12 % → 10 %); "one highlight per round per CPU" is still not met (ADR 0026, open design decision).
- art(vfx): record user approvals for bubble/wisp/arc/chakra tail v01 and ripple v02; ship them through the approved atlas; archive superseded ripple v01.

- art(vfx): add unapproved power-up candidates bubble/wisp/arc/chakra tail v01 and ripple v02, packed frame gallery and isolated candidate preview.

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
- **Body sheet** (TOOL-036): `npm run body [id] [anim...]` (`tools/body-sheet.mjs`) draws every packed frame beside idle f0 and the approved combat cell at one pixel density, labelled with a body-size number B (garment area vs idle f0, from new `bodyColors` in `art/scale/builds.json`) and the gate's head number H; writes `art/scale/body-<id>.png` and `body-report.json` (strips with median B beyond ±12 % flagged), so a strip no longer passes review on its head alone. B is an advisory proxy (±10 %), confirmed by segment measurement; documented in art/CHARACTER_SCALE.md "Body sheet (TOOL-036)". The scale audit's 3x5 font and draw helpers are now exported for it.
- **Attack alts** (ENG-081, ADR 0031): eleven optional `<anim>Alt` strips (`light1Alt`-`light4Alt`, `heavyAlt`, `airLight1Alt`-`airLight3Alt`, `airHeavyAlt`, `hurtHighAlt`, `hurtLowAlt`) with their base's frames and phases; each fighter alternates base and alt per use in a deterministic Thue-Morse pattern (`src/game/animAlts.js`, never three of one version in a row) only when its sheet has the alt, so today's sheets play exactly as before; `?alts=0` / `?alts=1` for review, a lab scenario, the manifest lists the alts per fighter (todo), and the packer warns when an alt's frame count, phases or active hit box (12 px reach, 16 px height) differ from its base's. `npm run test:alts`.
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
- **Attack alts ship their base's hit and hurt boxes** (ADR 0031 amendment): the packer copies the base strip's boxes onto every alt frame, so an alt's drawing can never change what connects or what can be hit; `altCheck` now only warns when the drawn strike lands more than 24 px from the base's hit (the spark would float off the limb), and an alt with another frame count keeps its own boxes. No runtime change.
- Publishing to GitHub (`npm run publish:github`, `npm run pr -- open|merge`) reuses one shared publish cache in `.publish-cache/` instead of cloning the whole repository into the temp folder and gc-ing it every time: it fetches the branch, rewrites it with the same commit ids in about a second and pushes. A lock file makes concurrent publishes wait; a broken cache rebuilds itself (`-- --full` forces it).
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
- Deploy exports delete themselves: one Windows still holds locked after `vercel deploy` (29 GB piled up in E:\gcd-scratch) is handed to a detached `tools/rm-later.mjs` that retries for 10 min, the warning names the error code, the Vercel CLI runs without telemetry, and the art guard and stitcher sweep stale copies too (TOOL-053).
- Preview deploys from sparse art worktrees no longer export every raw PNG (4.9 GB left on C: per Codex preview): `git rm --cached art` skipped sparse paths, so the export is now built from `ls-tree` minus art/ and checked for art/; the stale sweep also covers `%TEMP%\codex-gcd-*` folders and the Windows user temp, and a GCD_SCRATCH_DIR on the system drive is warned about (TOOL-052).
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

- Recorded three additional Killua idle correction attempts; technical hold remains after independent scale review.

- ART-SCALE-R4-KIL: added hash-verified source-to-fit calibration handoff for Killua idle11, guard09, superDash08, stagger07 and win05; no art, fit data, packer or shipped atlas changed.






