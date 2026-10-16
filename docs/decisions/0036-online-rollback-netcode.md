# 0036: Online play: rollback netcode, lobby server, determinism first

**Status:** Proposed
**Date:** 2026-10-15
**Task:** ENG-090 (spike); follow-ups ENG-091 to ENG-095

## Context

The user asked (2026-10-15) for online multiplayer with rollback netcode, lobbies where people watch while they wait
their turn, and many people playing at once. Their answers to the scoping questions:

- **Concurrency:** many lobbies at the same time, each with one 1v1 match (not 2v2, not several matches per lobby).
- **Audience:** public lobbies as well as private room codes.
- **Devices:** desktop and phones in the same match (so Chrome/Edge, Firefox and Safari, whose iPhone engine every
  iOS browser shares, must compute the same fight).
- **Queue:** winner stays on.

Rollback (GGPO-style) needs both machines to compute the same simulation from the same inputs: each side predicts
the other's input, and when the real input arrives late it restores an earlier state and re-simulates up to ~8
frames inside one 16.7 ms frame. ROADMAP M7 asked for a spike before committing. This ADR records the spike
(`src/net/simHash.js`, `src/net/detTest.js`, fixtures in `public/det/`, docs/TESTING.md "Determinism test") and the
plan that follows from it.

### What the spike measured (Chrome 152, Windows desktop, 2026-10-15)

The harness records a CPU vs CPU match (both pads' inputs after the brains wrote them, plus per-frame hashes of the
simulation in six groups: game flow, each fighter, pads, shots, camera basis), replays the inputs with the brains
off, and reports the first frame where the two runs differ and which values differ.

1. **The fixed step is deterministic from pad inputs once four leaks are fenced off** (fresh camera, a pinned
   control basis, a per-match frame counter and render clock). Recording and replay matched frame for frame for three
   matches (Naruto vs Sasuke, seeds 7/8/9: 7588, 6457 and 6030 frames, same winner and HP), and the two saved
   fixtures (naruto-sasuke-s7, 6982 frames; gojo-killua-s3, 5372 frames: Infinity, Hollow Purple, Godspeed) replay
   with every checkpoint equal from a fresh page.
2. **`Math.random()` does not reach gameplay state.** Two replays with different random sequences matched for 6691
   frames. Its gameplay-adjacent uses are the CPU brains (absent online) and effects. ENG-040 (a seeded RNG for the
   simulation) is therefore not an online prerequisite; it stays useful for reproducible CPU matches.
3. **Leaks the online work must remove** (each was observed as a split, except where noted):
   - **The control basis comes from the rendered camera.** Stick directions, facing, `side`, lane offsets and dash
     directions read `cam.right` / `cam.fwd` ([camera.js](../../src/game/camera.js)), which the render loop updates
     with real-time smoothing, screen shake, interpolated render positions and the window's aspect ratio. A 120 Hz
     replay split at frame 0 (basis off by 1e-8); the first match on a page split at frame 1 because the hidden
     pane's aspect changed from 16:9 to 1:1. Two players never share a window, a refresh rate or a frame cadence.
   - **Round flow runs on wall-clock time** (`stateT += dtReal`, `Game.flow`). At 120 Hz, 144 Hz and with uneven
     frame times, FIGHT! started at frame 96 instead of 97 and the round timer, ki and everything after split.
     KO slow-mo (`timeScale`, `slowT -= dtReal`) feeds the same accumulator (by reading; not isolated by the test).
   - **The frame counter is absolute across matches** (`Game.frameNo` never resets): `Game.tag` cooldown stamps and
     the beam-clash chart seed (`seedOf(A.id, B.id, frameNo)`, ADR 0027) differ between two peers that played a
     different number of frames before.
   - **The render clock reaches state:** the round winner turns to `cam.yaw` (`Game.roundOver`), which follows the
     charge tremble (`Math.sin(time * 70)` in `Fighter.sync`); Infinity callout timers stamp `game.time` on the
     fighter (`projectiles.js`).
   - **View data lives on simulation objects:** the power-up particles (`f.chargeFx`, Math.random) and the hit
     flash (`f.hfx`, render clock) on fighters; the brains tag shots (`_aid`, `seen`). The hash skips these keys.
   - **CPU-only rules key on `game.brains[i]`:** holding back blocks only for a pad without a brain
     (`Fighter.holdingBack`). Online both sides are people, but the rule must come from match setup both peers share.
   - **Art data is gameplay data:** hit/hurt boxes, frame durations and phases come from each fighter's `anims.json`
     (or the baked placeholder). Two peers with different packs fight different fights. The log records an art
     fingerprint per fighter; the replay page reports a mismatch.
4. **Cost.** The fixed step averaged 0.03–0.08 ms (p95 0.1–0.3 ms, max ~5 ms) on this PC, so 8 re-simulated frames
   cost ~2 ms at p95. On the user's iPhone (iOS 18.7, Safari 27) it averaged 0.029 ms, max 3 ms (Safari's timer
   rounds to 1 ms, so the page now also sums 8 consecutive steps). Today's step still spawns effects, plays sounds and
   paints decals; a re-simulation must skip them.
5. **Cross-engine: Safari's `Math.hypot` differs from Chrome's.** The spec leaves the last bit of `Math.hypot`, `sin`,
   `cos`, `atan2`, `pow` ... to each engine; `+ - * /` and `Math.sqrt` are exactly rounded everywhere. On the user's
   iPhone (iOS 18.7, Safari 27) both fixtures split from the Chrome reference early although both matches ended
   with the reference's winner, rounds and HP (a matching result proves nothing: a 120 Hz Chrome replay also splits
   and still ends the same). Per-field traces then named the first difference: gojo-killua-s3 at frame 125, both
   fighters' `pos.z` one ulp apart (`Game.separate`, the push-apart step), and naruto-sasuke-s7 at frame 267,
   fighter 1's `vel.x`/`vel.z`. Both are `Math.hypot`: Safari returned 0.5794781766945303 where Chrome returns
   0.5794781766945304, and feeding Safari's value into `separate` reproduces all four of the phone's coordinates bit
   for bit; a Chrome replay with a square-root hypot reproduces the phone's frame-267 velocity exactly. Safari's
   hypot is neither Chrome's nor a plain square root (that emulation splits at frame 120, the phone at 125).
   A census of every `Math` call inside the fixed step (both fixtures): ~40,000 `hypot` calls reach gameplay
   (`Pad.setMove` normalizing the stick, `separate`, `distTo`, `takeHit`, `onHit`, attacks, shots, tech rolls) and one
   `sin` (the beam-clash struggle line, `Game.updateClash`); every other `sin`, `cos`, `pow`, `atan2` and `asin` is
   in effects, ground decals and three.js color and rotation code. The prototype `src/net/dmath.js` (hypot, sin and
   cos from `+ - * /` and `Math.sqrt`, within 1–2 ulp of V8) is installed by the test's `detMath` option; the
   fixtures are re-recorded with it and replay exactly in Chrome even with `Math.hypot` deliberately skewed by one
   ulp (without it, the skew splits at frame 97). With it, the user's iPhone matched the Chrome reference on every frame of both fixtures (2026-10-15: naruto-sasuke-s7, 4250 frames; gojo-killua-s3, 5242 frames). After main brought in the melee clash (ADR 0038) the fixtures were re-recorded; a census on that code still finds only hypot, sin and cos on gameplay paths. Firefox: not run yet.
   Also found on the way: replaying an already-normalized stick normalizes it twice (a length of 1.0000000000000002
   rescales it), so the wire must carry the raw stick.

## Decision

1. **Rollback netcode, our own small module** (`src/net/`), no runtime dependency: inputs delayed 2 frames by default
   (a setting, 0–4), up to 8 frames of rollback, prediction by repeating the last input, a ring buffer of saved
   states, time sync by frame advantage (the side ahead idles a frame now and then), and the simHash groups
   exchanged every 30 frames. A mismatch ends the match as a no contest and records both sides' logs (the replay
   harness reads them); state-transfer resync can come later, since rollback needs serializable states anyway.
2. **Simulation first.** Before any networking, the fixed step must be replayable:
   - a **simulation-owned control basis**: the fight camera's yaw rule computed in the fixed step from fighter
     positions on fixed DT; the render camera follows it for framing, shake and smoothing, and nothing in the
     simulation reads the render camera;
   - **round flow, intros, KO slow-mo and the round-winner pose on frames**, the frame counter per match, nothing
     in the simulation reads `game.time`;
   - **view out of the step**: effects, sounds, HUD, camera kicks and decals become events the simulation emits;
     the view plays each once (keyed by frame and kind), and re-simulation runs with them muted; `chargeFx` and
     `hfx` move to the view;
   - **save/restore** of plain data for fighters, pads, shots, clashes, domain and game flow (`simHash` stays the
     test oracle: restore, step, hash must equal the original run);
   - **deterministic math**: the simulation and the basis call `dmath.js` (today's prototype in `src/net/`: hypot,
     sin, cos; atan2, pow and exp when a gameplay path needs them) instead of `Math.hypot`, `sin`, `cos` and friends,
     and a lint rejects those `Math` functions in simulation files. Effects and three.js keep the engine's (cosmetic);

   - **player kind in match setup** (`person` / `cpu`) instead of `brains[i] != null`;
   - **a match handshake** that compares the build id and both fighters' art fingerprints.
3. **Wire input:** per player per frame, the raw stick (before `Pad.setMove` normalizes it) quantized to signed 8-bit
   x/y plus a 7-bit button mask (3 bytes).
   The pad's derived state (buffers, double taps) is simulation state, rebuilt from the inputs and saved with it.
4. **Server: Cloudflare Workers + Durable Objects**, in a separate `server/` package (its dev tooling, wrangler, stays
   out of the game's dependencies). One Durable Object per lobby (room, queue, chat, spectator feed over hibernating
   WebSockets) and one directory object that lists public lobbies. Lobbies run independently, so many run at once.
5. **Transport: relay first.** Public lobbies send match inputs through the lobby object (no peer sees another's IP,
   no TURN service to pay for). Peer-to-peer WebRTC may come later for private rooms, opt-in, with the relay as the
   fallback.
6. **Spectators replay, they don't roll back:** the lobby fans out confirmed inputs; spectators run the simulation
   about a second behind, and someone joining mid-match fast-forwards from frame 0 with the inputs so far.
7. **Lobbies:** winner stays on with a streak cap (5), a visible queue, quick-chat and emotes instead of free text, a
   nickname filter, host kick and vote-kick, rate limits, Cloudflare Turnstile on lobby creation, leaving a match
   counts as a loss, and each lobby shows its region and ping.
8. **Order of work** (one PR each, offline play unchanged at every step):
   ENG-091 control basis, frame-based flow and slow-mo, per-match counters (a playtest: the controls must feel the
   same); ENG-092 view events out of the step, save/restore, deterministic math and its lint; ENG-093 a local netplay
   mode (two pads in one page with simulated latency and loss) that proves rollback without a server; ENG-094 the
   lobby server, relay transport and spectating; ENG-095 public lobby browser and moderation (P2P later).

## Alternatives considered

- **Delay-based netcode:** simpler, but every frame of latency becomes input lag; past ~60 ms it feels bad. The
  user asked for rollback.
- **Server-authoritative simulation:** the server runs the fight. Needs a THREE-free headless simulation and server
  CPU per match, and players still need prediction (rollback) to hide the round trip. Kept for later anti-cheat.
- **An existing library:** GGPO (C++), GGRS (Rust; wasm plus a bridge to a JS simulation), netplayjs (JS, PeerJS
  dependency, unmaintained). The protocol is a few hundred lines; the hard part is our simulation, which no library
  fixes.
- **Fixed-point physics:** cross-engine safe, but a rewrite of every movement and collision formula. IEEE basic
  operations are already identical in every engine; replacing the transcendental functions is enough.
- **Peer-to-peer for public lobbies:** exposes each player's IP to strangers and needs paid TURN for ~10–20 % of
  networks. Relay first.
- **A Node server (Colyseus) on Fly.io, or PartyKit:** both work; plain Durable Objects give one isolated object per
  lobby with no servers to run and no extra layer.

## Consequences

- ENG-091 and ENG-092 touch fighter.js, game.js, kit.js, projectiles.js and the effects hooks. Other work in those
  files (new kits, mechanics) has to be sequenced around them.
- The controls move from the rendered camera to a simulation-owned basis; it must feel the same (playtest).
- `Math.random` stays fine for effects and the CPU; ENG-040 is no longer an online prerequisite.
- Public lobbies make the game more public: the ROADMAP v1.0 licensing decision on recognizable characters should
  come before it is promoted.
- The fixtures in `public/det/` (~90 KB) ship with the game until the local netplay mode replaces them; the
  dev-server `/__det/save` endpoint (vite.config.js) only exists under `vite serve`.
- New: a `server/` package and a Cloudflare account (the user's), needed from ENG-094.
- Safari's `Math.hypot` splits real matches, so deterministic math (`hypot` first) moves to the front of ENG-092,
  ahead of the view split; it is small and the determinism test proves it on a phone. (Done in ENG-091.)

## Progress

- **ENG-090 (spike), merged 2026-10-15 (PRs #109, #115):** the determinism test, the iPhone result, fixture
  fingerprints.
- **ENG-091, 2026-10-15:** the simulation is replayable with no test workarounds.
  - `src/game/basis.js` owns the control basis: the fight framing's yaw rule on the fighters' positions, damped on
    the fixed step (`Game.basis`, read by the fighters, kits, melee, throws and the CPU brains). The render camera
    takes its yaw from it, interpolated between steps.
  - The match flow and the KO slow-mo run in `Game.tickFlow` on the fixed step (`stateT` / `slowT` advance by
    `DT / timeScale`, so the old timings hold).
  - `frameNo` resets per match. The round winner faces the basis's yaw. Gojo's Infinity ki charge and callout
    count frames, not the render clock.
  - `Game.kinds` ('person' / 'cpu', from the match setup) decides the hold-back-to-block rule.
  - `-0` sticks become `0` in `Pad.setMove`: a saved log or the wire can't carry the sign.
  - The gameplay files use `src/game/dmath.js` (hypot, sin, cos, atan, atan2; atan / atan2 match V8 bit for bit);
    `tools/lint-sim-math.mjs` in `prebuild` keeps engine `Math` out of them. The shuriken spread turns its
    directions by hand instead of with three.js's `applyAxisAngle`.
  - The state hash skips more view state: shots' effect handles (`sprite`, `glow`) and the beam's ripple clock
    (`waveT`). Its `cam` group became `basis`.
  - Result: fresh recordings of four pairings replay exactly at 60, 120 and 144 Hz and with uneven frame times
    (naruto-sasuke, gojo-killua, goku-luffy, killua-sasuke). They also replay exactly with `Math.hypot` /
    `Math.sin` deliberately skewed by an ulp, and the first match after a page load replays like any other.
    A 3-match CPU soak is clean.
  - Merged 2026-10-16 (PR #125) after the user's playtest ("Feels the same").
- **ENG-092, 2026-10-16:** save / restore and quiet re-simulation, the two things a rollback does.
  - `src/game/snapshot.js`: `Game.saveState()` / `loadState(S)`. The state is a deep copy of the match fields
    (`GAME_STATE`), both fighters, both pads, the shots, the clash, the basis and each sprite's playback. Shared
    structure stays shared, and move tables, characters and art packs are kept by reference. Positions, velocities
    and facings are restored in place, so anything holding them still holds the live ones. The view fields on
    fighters (`chargeFx`, `hfx`, `groundMark`) are neither saved nor restored.
  - Shots no longer own their visuals. `ShotViews` (projectiles.js) draws each projectile's sprite and glow and
    each beam's ribbon (`BeamView`) from the simulation every render, keyed by a per-match shot `id`. A restored
    or re-simulated shot therefore finds its view again. Beam styles check `game.fxMeta`, never the effects
    object.
  - `Game.quiet(fn)` runs re-simulated steps with the HUD, camera, effects, stages and menus replaced by a no-op
    stand-in, sound off (`audio.quiet`), no afterimages (`actorView.quiet`) and no effect ticks.
  - `Game.syncView()` keeps the stage in step with the domain every frame. After a restore it also resets the
    clash camera and bar and the beam, orb, charge and clash hums.
  - Test: `det.replay(log, { rollback: { every, depth } })` saves every `every` frames, plays `depth` frames on
    random inputs, restores, re-simulates quietly on the right inputs, and checks every frame against the
    recording.
  - Result: four pairings matched through 500–1,011 rewinds each (8 frames every 10). On desktop Chrome a save
    costs ≈0.06 ms, a restore ≈0.06 ms, and 8 quiet frames ≈0.3–0.5 ms (one 12 ms outlier, likely garbage
    collection), well inside a 16.7 ms frame. The `?det=` page now runs this stress test too and prints the
    timings. A 3-match soak is clean, with no leftover shot views.
  - Known gaps for ENG-093 to watch:
    - One-off events (a hit spark, a callout, a camera cut) that a mispredicted frame played are not taken back.
    - A rewind across a match's end would miss its results screen (the menus are stood in for).
    - The CPU brains are not saved: rollback is for person-vs-person.
- **ENG-093, 2026-10-16:** the rollback session, proven over a simulated network.
  - `src/net/rollback.js` `RollbackSession`: one packed number per player and frame (stick as signed 8 bits per axis,
    buttons as bits), local inputs `delay` frames ahead (default 2), unacknowledged ones resent in every message,
    remote ones predicted by repeating the last real one. A wrong prediction restores the state saved before that
    frame and re-simulates to the present quietly. It never runs more than `maxRollback` (8) frames past the newest
    remote input; past that it stalls, which keeps both machines in step. Every 60 frames the two sides compare the
    hash of a frame both have confirmed.
  - `Game.frame` runs `netplay.tick()` instead of `fixedUpdate()` when `game.netplay` is set, and `stepWorld` takes
    the pads' inputs from it instead of the devices and brains. `InputManager.poll` is now `sample()` (the devices,
    no pad writes) plus the pad writes, so a session can read the devices for a future frame.
  - `src/net/netSim.js`: `SimLink` (latency, jitter, loss) and `SimRemote` (the other machine, with its own frame
    clock and the same stall rule). `?net=sim` plays a normal match through it (a CPU or player 2 on the far side)
    with a stats overlay.
  - Test: `det.netplay(log, opts)` plays a recording's two players through the session, one local and one over the
    simulated network, and compares every frame with a plain replay. Result: MATCH on every frame for naruto-sasuke
    (6 ± 2 frames one way, 5 % loss: 321 rollbacks up to 7 frames deep; 12 ± 4, 15 % loss: 9 stalls, 8-frame
    rollbacks), gojo-killua (4 ± 3, 10 %, local as player 2), goku-luffy (9 ± 1, 2 %, delay 3) and killua-sasuke
    (6 ± 2, 5 %), no desyncs; a tampered input at frame 600 is reported as a desync at frame 600. A `?net=sim`
    match against the CPU ran to its KO with 289 rollbacks and a clean console, and a 3-match soak is clean.
  - Both fixtures were stale on production (recorded before later gameplay changes; same split at frame 821 there)
    and are re-recorded on this build: both MATCH on `?det=`, and `det.netplay` matches them at 10 ± 4 frames with
    12 % loss and at 6 ± 2 with 5 % loss as player 2.
  - Known gaps for ENG-094:
    - The CPU brain on the far side of `?net=sim` thinks on the predicted present, not the confirmed past; online
      matches are person vs person.
    - A rewind across the match's last KO would replay its results quietly; the server should decide the result
      from confirmed frames.
    - The transport is the remaining piece: the lobby server relays the same `in` / `ck` messages.
- **ENG-094, 2026-10-16:** online rooms on the lobby server.
  - `server/`: a Cloudflare Worker and one `Room` Durable Object per room code (hibernating WebSockets, an alarm for
    timers). The rules live in `roomCore.js`, plain JavaScript that a Node test drives with a fake clock. It handles
    members, the winner-stays-on line (streak cap 5), the relay of `in` / `ck` between the two players, the
    spectator feed of confirmed frames (all of them for a late joiner), and both players' results. A match ends
    early on a mismatch, a desync report, a player leaving (forfeit) or a player silent for 10 s (timeout). Every
    member must run the same simulation build (`SIM_ID`). Allowed origins only, and a flood limit.
  - Client: `src/net/lobby.js` (the socket), `online.js` (the screens' logic and each match: a RollbackSession for a
    player, a `SpectateSession` that replays the feed a little behind for everyone else), ONLINE on the mode list,
    `?room=CODE` invite links, the room screen and the match strip. Online matches have no pause and no intro skip
    (both run on every machine), and the results screen is the room.
  - Time sync (frame advantage, GGPO-style) in RollbackSession: a machine that started earlier waits out half the
    difference instead of making the other roll back every frame.
  - Fixes the real network exposed: the intro's length was read from the camera, which a quiet re-simulation stands
    in for (a rollback in the intro would have ended it early on one machine); it is a constant now (`INTRO_DUR`).
    `link.pump?.(++ticks)` never counted ticks on a link without `pump` (optional chaining skips the argument).
  - Test: `det.online(log)` plays a recording through the real server (wrangler dev): naruto-sasuke (1,500 frames) and
    gojo-killua (2,400) MATCH on every frame with the intro, the hash checks pass through the server, and the
    spectator feed equals both players' inputs. With stand-in bots: winner stays on, forfeit, timeout, a full match
    to KO reported and counted, spectating, a late join fast-forwarding about 650 frames, the room over a watched
    match, phone landscape layout. A 3-match soak is clean.
  - Deployed 2026-10-16 on the user's Cloudflare account (free plan): https://gcd-tourney-lobby.eshin087.workers.dev
    (`LOBBY_URL`). `det.online` against it from a local page: naruto-sasuke, 1,800 frames, MATCH on every frame at a
    23 ms ping, 30 hash checks, the feed exact. A page on localhost still uses `npm run lobby` unless `?lobby=` says
    otherwise.
  - Not yet: a real two-device playtest; reconnecting to a match after a dropped connection; public lobbies, chat and
    moderation (ENG-095).
