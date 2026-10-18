# GCD Tourney lobby server

The online rooms ([ADR 0036](../docs/decisions/0036-online-rollback-netcode.md), ENG-094): a Cloudflare Worker with one
Durable Object per room code. Rooms run independently, so many play at once. Its tooling (wrangler) lives in this
folder's own `package.json`, out of the game's dependencies.

| File | What it is |
|---|---|
| `src/index.js` | the Worker: `GET /` health text, `GET /rooms` (the public room list), `GET /room/<CODE>` WebSocket upgrade (allowed origins only) to that room's object, `GET /room/<CODE>/ping` and `/stats` |
| `src/room.js` | the `Room` Durable Object: hibernating WebSockets, the alarm, storage, the Turnstile check, reporting to the directory; runs `RoomCore` |
| `src/directory.js` | the `Directory` Durable Object (one for the game): public rooms' summaries, dropped 7 minutes after their last report |
| `src/names.js` | the nickname filter (roots ROT13-encoded) |
| `src/roomCore.js` | the room's rules in plain JavaScript (no Cloudflare API): members, the winner-stays-on line, the match relay, the spectator feed, public / private, quick-chat, removing members |
| `test/room.test.mjs` | `RoomCore` in Node with a fake clock (`npm test` here, `npm run test:lobby` from the repository root) |

## Run it locally

```bash
npm install
npm run dev
```

It listens on `ws://127.0.0.1:8787` (from the repository root: `npm run lobby`). A game page served from localhost uses
it automatically; any other page takes `?lobby=ws://127.0.0.1:8787`. In the game, `?debug` then gives
`det.online(log)` (the end-to-end test) and `det.bot(code)` (a stand-in member, to try the screens alone); see
docs/TESTING.md.

## Deploy it (the user's Cloudflare account; the free plan is enough)

1. Once: `npx wrangler login` (a browser window asks to allow Wrangler), and pick the account's `workers.dev`
   subdomain in the Cloudflare dashboard (Workers & Pages) if it has none.
2. `npm run deploy`. It prints the address, `https://gcd-tourney-lobby.<subdomain>.workers.dev`.
3. Put `wss://gcd-tourney-lobby.<subdomain>.workers.dev` in `LOBBY_URL` (src/net/lobby.js) and deploy the game.

Deployed: https://gcd-tourney-lobby.eshin087.workers.dev (2026-10-16). Redeployed 2026-10-18 for the 27-bit inputs (the C-stick, ADR 0042): a server older than the game drops messages holding a C-stick input, so deploy the server first whenever the input format grows. After a change to `src/` here, run
`npm test`, then `npm run deploy` again; the game needs no redeploy unless the protocol changed.

## The anti-bot check (Cloudflare Turnstile): ready, switched off

**Off for now** (the user's call, 2026-10-16: "Not now"): no widget exists, `SITEKEY` is empty and the Worker has no
`TURNSTILE_SECRET`, so anyone may open a public room; the directory lists at most two per address instead. To switch
it on: create a managed widget for `gcd-tourney.vercel.app` (and each preview address to be tested) with action
`create_room`, put its site key in `SITEKEY` (`src/net/turnstile.js`) and deploy the game, then
`wrangler secret put TURNSTILE_SECRET` here (the server checks tokens as soon as the secret exists, so the game must
have the site key first).

When it is on, opening a public room takes a Turnstile token: the client's widget (`src/net/turnstile.js`, action `create_room`)
produces it, and the room checks it once with siteverify before listing the room. The widget's site key is `SITEKEY` in
`src/net/turnstile.js`; its secret is the Worker secret `TURNSTILE_SECRET` (`wrangler secret put`, never in a file).
Tokens must come from production or a preview (`gcd-tourney*.vercel.app`), and each preview address must be on the
widget's domain list. Locally, `server/.dev.vars` (git-ignored) holds Cloudflare's always-pass test secret and
`TURNSTILE_DEV=1`, and a page on localhost uses the test site key.

## Protocol

JSON text messages over one WebSocket per member; the text `ping` gets `pong` (keepalive and round trip, answered
without waking a sleeping room). Every member of a room must run the same simulation build (`sim`, the game's
`SIM_ID`).

Client to server:

| Message | When |
|---|---|
| `{ t: 'hello', name, fighter, sim, play, rtt, cid, public?, turnstile? }` | first, once (`play`: false only watches; `rtt`: the first ping's round trip, ms; `cid`: this browser's id, for bans; into an empty room, `public: true` with a Turnstile token opens it public) |
| `{ t: 'hello', resume: { id, token, have }, ... }` | coming back on a new connection (ENG-097): the seat's id and the welcome's token; `have`: how many of each player's inputs this page still holds (`null` after a reload) |
| `{ t: 'leave' }` | leaving on purpose (no grace) |
| `{ t: 'say', i }` | a quick-chat line or emote: an index into `src/net/quickChat.js` (no free text; one per 1.2 s) |
| `{ t: 'kick', id }` | the host removes a member |
| `{ t: 'vote', id }` | a vote to remove a member (a majority of the others, at least two, within 90 s) |
| `{ t: 'rtt', ms }` | every 5 s: the round trip to the room; a match's input delay comes from its two players' (`pickDelay`) |
| `{ t: 'set', name?, fighter?, play? }` | any time; a fighter change counts from the next match |
| `{ t: 'in', start, v: [packed...], ack, adv }` | a player, every frame: its inputs from frame `start` (rollback.js) |
| `{ t: 'ck', frame, hash }` | a player: its state hash of a frame both sides have confirmed |
| `{ t: 'result', winner: 0 \| 1 }` | a player, once every frame of its match is confirmed |
| `{ t: 'desync', frame }` | a player whose hash differed from the other side's |
| `{ t: 'stats', match, slot, device, delay, rtt, frames, rollbacks, maxDepth, resimFrames, stalls, syncWaits, fps, fpsLow, longFrames, seconds }` | a player, when its match ends: how its connection and frame rate held up (kept, newest 20, at `GET /room/<CODE>/stats`) |

Server to client:

| Message | Means |
|---|---|
| `{ t: 'welcome', you, token, room, resumed? }` | joined (or back: `resumed`); `you` is this member's id, `token` the secret that takes the seat back after a drop |
| `{ t: 'room', room }` | anything changed: `{ members: [{ id, name, fighter, play, wins, streak }], queue: [ids], match: { no, players, fighters } \| null, host, nextIn, pub, title, region, chat: [{ from, name, i }], votes: { id: count }, needed }` |
| `{ t: 'say', from, name, i }` | a quick-chat line |
| `{ t: 'log', no, p, start, v }`, `{ t: 'logEnd', no }` | a player coming back: player `p`'s inputs from `start` (from its `have`, or all after a reload), then the end of them |
| `{ t: 'start', no, players: [{ id, name, fighter }], seed, delay, you, resume? }` | a match starts (or, with `resume: { have: [n0, n1] }`, a player's match comes back: how many inputs the room holds of each): `you` 0 / 1 plays that side, -1 watches; `delay`: input delay in frames, 1 when the two players' round trips average 67 ms or less, 2 up to 117 ms, else 3 |
| `{ t: 'in', from, ... }`, `{ t: 'ck', ... }` | the other player's messages, passed on |
| `{ t: 'feed', no, start, a: [...], b: [...] }` | to everyone not playing: both players' inputs for the frames from `start` on, once both are known (from 0 for a late joiner) |
| `{ t: 'end', no, winner, reason, streak, capped, frame? }` | the match is over: `reason` is `ko`, `forfeit` (left), `timeout` (silent 10 s), `desync`, `mismatch` (results differ) or `server` (the room restarted) |
| `{ t: 'error', code, text }` | refused (`full`, `version`, `verify`: no valid Turnstile token for a public room, `banned`: removed from this room lately) or `removed` (kicked or voted out); the socket closes |

`GET /room/<CODE>/stats` returns the players' stats of the room's recent matches (JSON), for diagnosing lag after a
playtest: `stalls` (frames waiting for the other side's inputs), `syncWaits` (time sync), `rollbacks` / `maxDepth`,
`fps` / `fpsLow` (the average and the worst second) and `longFrames` (frames over two refreshes), per device.

`GET /rooms` lists the public rooms (at most two per address, while the anti-bot check is off): `[{ code, title, region, members, playing: [names] | null, waiting, full, at }]`,
matches first. Room views list each member's `away` (ms left to come back, 0 when connected). `GET /room/<CODE>/ping` answers `pong` from the room's object, for the list's ping to where it runs.

Rules: the first two in line play; the winner stays on and the loser goes to the back; after five wins in a row the
winner goes to the back too. A no contest puts the same pair first again. The next match starts six seconds after the
last one ended. A member sending more than 150 messages a second for long is disconnected (code 4008). The first member opens the room,
public or private, and names it ("<name>'s room"); the longest-standing member is the host. Names pass the filter
(`names.js`: a rude one becomes Player<digits>). A removed member's browser stays out for 10 minutes, and so does its
address unless someone still in the room shares it (one home's Wi-Fi). When the last member leaves, the room is unlisted
and its code free for a fresh room.

Rejoining (ENG-097): a connection that drops keeps its member's seat for 20 seconds (marked away; a match stands
still, waiting); the member comes back with `resume` and its token, or the seat is freed (a player forfeits). An away
member keeps its place in line but isn't put into a new match. A player silent for 20 seconds on an open connection
forfeits too.
