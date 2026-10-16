# GCD Tourney lobby server

The online rooms ([ADR 0036](../docs/decisions/0036-online-rollback-netcode.md), ENG-094): a Cloudflare Worker with one
Durable Object per room code. Rooms run independently, so many play at once. Its tooling (wrangler) lives in this
folder's own `package.json`, out of the game's dependencies.

| File | What it is |
|---|---|
| `src/index.js` | the Worker: `GET /` health text, `GET /room/<CODE>` WebSocket upgrade (allowed origins only) to that room's object |
| `src/room.js` | the `Room` Durable Object: hibernating WebSockets, the alarm, storage; runs `RoomCore` |
| `src/roomCore.js` | the room's rules in plain JavaScript (no Cloudflare API): members, the winner-stays-on line, the match relay, the spectator feed |
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

Deployed: https://gcd-tourney-lobby.eshin087.workers.dev (2026-10-16). After a change to `src/` here, run
`npm test`, then `npm run deploy` again; the game needs no redeploy unless the protocol changed.

## Protocol

JSON text messages over one WebSocket per member; the text `ping` gets `pong` (keepalive and round trip, answered
without waking a sleeping room). Every member of a room must run the same simulation build (`sim`, the game's
`SIM_ID`).

Client to server:

| Message | When |
|---|---|
| `{ t: 'hello', name, fighter, sim, play }` | first, once (`play`: false only watches) |
| `{ t: 'set', name?, fighter?, play? }` | any time; a fighter change counts from the next match |
| `{ t: 'in', start, v: [packed...], ack, adv }` | a player, every frame: its inputs from frame `start` (rollback.js) |
| `{ t: 'ck', frame, hash }` | a player: its state hash of a frame both sides have confirmed |
| `{ t: 'result', winner: 0 \| 1 }` | a player, once every frame of its match is confirmed |
| `{ t: 'desync', frame }` | a player whose hash differed from the other side's |

Server to client:

| Message | Means |
|---|---|
| `{ t: 'welcome', you, room }` | joined; `you` is this member's id |
| `{ t: 'room', room }` | anything changed: `{ members: [{ id, name, fighter, play, wins, streak }], queue: [ids], match: { no, players, fighters } \| null, host, nextIn }` |
| `{ t: 'start', no, players: [{ id, name, fighter }], seed, delay, you }` | a match starts: `you` 0 / 1 plays that side, -1 watches |
| `{ t: 'in', from, ... }`, `{ t: 'ck', ... }` | the other player's messages, passed on |
| `{ t: 'feed', no, start, a: [...], b: [...] }` | to everyone not playing: both players' inputs for the frames from `start` on, once both are known (from 0 for a late joiner) |
| `{ t: 'end', no, winner, reason, streak, capped, frame? }` | the match is over: `reason` is `ko`, `forfeit` (left), `timeout` (silent 10 s), `desync`, `mismatch` (results differ) or `server` (the room restarted) |
| `{ t: 'error', code, text }` | refused (`full`, `version`); the socket closes |

Rules: the first two in line play; the winner stays on and the loser goes to the back; after five wins in a row the
winner goes to the back too. A no contest puts the same pair first again. The next match starts six seconds after the
last one ended. A member sending more than 150 messages a second for long is disconnected (code 4008).
