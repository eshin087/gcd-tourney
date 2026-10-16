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
  ahead of the view split; it is small and the determinism test proves it on a phone.
