// The lobby connection (ADR 0036, ENG-094): one WebSocket to a room on the lobby server (server/), JSON messages
// (the protocol is in server/README.md). Match messages (`in`, `ck`) wait in an inbox the rollback session reads
// through matchLink(); everything else goes to the handlers (online.js). A 'ping' every 2 s keeps the socket open
// and measures the round trip: the server answers 'pong' without waking the room.

// set once the lobby server is deployed (server/README.md); ?lobby=<ws url> overrides it, and a page served from
// localhost uses `npm run lobby` (wrangler dev) on port 8787
export const LOBBY_URL = '';

// room codes: five characters a person can read out (no I / O / 0 / 1)
export const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const newCode = () => Array.from({ length: 5 }, () => CODE_CHARS[(Math.random() * CODE_CHARS.length) | 0]).join('');
export const cleanCode = (s) => String(s || '').toUpperCase().replace(/[^A-Z2-9]/g, '').replace(/[IO]/g, '').slice(0, 5);

export function lobbyUrl(qs = new URLSearchParams(location.search)) {
  const q = qs.get('lobby');
  if (q) return q.replace(/\/$/, '');
  if (LOBBY_URL) return LOBBY_URL;
  if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return 'ws://127.0.0.1:8787';
  return '';
}

export class LobbyClient {
  // on: { open, close(event), welcome, room, start, feed, end, error } (each gets the message)
  constructor(url, code, on) {
    this.code = code;
    this.on = on;
    this.inbox = []; // `in` / `ck` for the rollback session
    this.rtt = null; // ms, the last ping's round trip
    this.open = false;
    this.pingAt = 0;
    this.ws = new WebSocket(`${url}/room/${code}`);
    this.ws.onopen = () => {
      this.open = true;
      this.pinger = setInterval(() => this.ping(), 2000);
      this.on.open?.();
      this.ping();
    };
    this.ws.onmessage = (e) => {
      if (e.data === 'pong') {
        if (this.pingAt) this.rtt = performance.now() - this.pingAt;
        this.pingAt = 0;
        return;
      }
      let m;
      try { m = JSON.parse(e.data); } catch { return; }
      if (m.t === 'in' || m.t === 'ck') this.inbox.push(m);
      else this.on[m.t]?.(m);
    };
    this.ws.onclose = (e) => {
      this.open = false;
      clearInterval(this.pinger);
      this.on.close?.(e);
    };
    this.ws.onerror = () => {}; // onclose follows with the code
  }

  ping() {
    const now = performance.now();
    if (this.ws.readyState !== 1 || (this.pingAt && now - this.pingAt < 5000)) return;
    this.pingAt = now;
    this.ws.send('ping');
  }

  send(msg) {
    if (this.ws.readyState === 1) this.ws.send(JSON.stringify(msg)); // not while closing: the browser logs every try
  }

  close() {
    this.on = {};
    clearInterval(this.pinger);
    try { this.ws.close(1000); } catch { /* not open yet */ }
  }

  // the transport a RollbackSession reads (the server stamps who a message is from)
  matchLink() {
    return { send: (msg) => this.send(msg), receive: () => this.inbox.splice(0) };
  }
}
