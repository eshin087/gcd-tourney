# Developing GCD Tourney

Commands, debug URLs and test tooling. Back to the [README](../README.md).

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | dev server on port 5188 |
| `npm run dev:alt` | the same on port 5200 (when 5188 is busy) |
| `npm run build` / `npm run preview` | production build into `dist/` / serve it (the build runs the animation, undeclared-identifier and simulation-math lints first) |
| `npm run lobby` | the online lobby server locally (see [server/README.md](../server/README.md)) |
| `npm run sprites [id\|vfx]` | pack approved art from `art/` into `public/` (see [art/README.md](../art/README.md)) |
| `npm run test:sprites` | self-test for the sprite packer |
| `npm run test:lobby` | lobby room rules test |
| `npm run test:music` | self-test for the music composer |

## Debug URLs

- `/?fight=naruto,sasuke&mode=solo&level=hard` skips the menus and starts a match (`level` = easy, normal, hard
  insane or impossible; `mode=versus` for 2P, `mode=cpu` to spectate two CPUs; that one defaults to `level=impossible`).
  `&seed=N` fixes the match seed (the CPUs' combo styles and choices).
- `&art=custom` uses custom sheets even when they're incomplete (useful while art is in production).
- `/?room=ABCDE` opens the online screen for that room (the invite link); `&lobby=ws://...` picks another lobby server
  (`npm run lobby` runs one locally, which a page on localhost uses by itself; see [server/README.md](server/README.md)).
- `/?fight=naruto,sasuke&mode=solo&net=sim&lag=6&loss=5` plays a match through rollback over a simulated network.
- `/?debug` adds console helpers: `step(n)` (frame-step, pauses the live loop), `resumeLoop()`,
  `press('KeyJ')`, `hold('KeyD')` / `release('KeyD')`, `tap(['KeyK','KeyL'])`, `freezeCpu()`,
  `snap()` / `unsnap()`, `music.state()` / `music.next()` (`&musicSeed=N` replays a song), `soak(n, pairs)` and
  `comboStats()` (CPU vs CPU matches back to back and what the CPUs' combos did). See
  [docs/TESTING.md](docs/TESTING.md) for the test checklists and the CPU-vs-CPU soak.
