// The lobby connection (ADR 0036, ENG-094): one WebSocket to a room on the lobby server (server/), JSON messages
// (the protocol is in server/README.md). Match messages (`in`, `ck`) wait in an inbox the rollback session reads
// through matchLink(); everything else goes to the handlers (online.js). A 'ping' every 2 s keeps the socket open
// and measures the round trip (the server answers 'pong' without waking the room); the room hears it every 5 s, and
// it sets a match's input delay, so `open` fires after the first round trip (or 1 s) to put it in the hello.

// the deployed lobby server (server/README.md: the user's Cloudflare account). ?lobby=<ws url> overrides it, and a
// page served from localhost uses `npm run lobby` (wrangler dev) on port 8787 instead
export const LOBBY_URL = 'wss://gcd-tourney-lobby.eshin087.workers.dev';

// room codes: five characters a person can read out (no I / O / 0 / 1)
export const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const newCode = () => Array.from({ length: 5 }, () => CODE_CHARS[(Math.random() * CODE_CHARS.length) | 0]).join('');
export const cleanCode = (s) => String(s || '').toUpperCase().replace(/[^A-Z2-9]/g, '').replace(/[IO]/g, '').slice(0, 5);

export function lobbyUrl(qs = new URLSearchParams(location.search)) {
  const q = qs.get('lobby');
  if (q) return q.replace(/\/$/, '');
  if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return 'ws://127.0.0.1:8787';
  return LOBBY_URL;
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
    this.rttSent = 0;
    const opened = () => {
      clearTimeout(this.openT);
      if (this.open) return;
      this.open = true;
      this.on.open?.();
    };
    this.ws.onopen = () => {
      this.pinger = setInterval(() => this.ping(), 2000);
      this.ping();
      this.openT = setTimeout(opened, 1000);
    };
    this.ws.onmessage = (e) => {
      if (e.data === 'pong') {
        const now = performance.now();
        if (this.pingAt) this.rtt = now - this.pingAt;
        this.pingAt = 0;
        if (!this.open) opened();
        else if (this.rtt != null && now - this.rttSent > 5000) {
          this.rttSent = now;
          this.send({ t: 'rtt', ms: Math.round(this.rtt) });
        }
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
      clearTimeout(this.openT);
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
    clearTimeout(this.openT);
    try { this.ws.close(1000); } catch { /* not open yet */ }
  }

  // the transport a RollbackSession reads (the server stamps who a message is from)
  matchLink() {
    return { send: (msg) => this.send(msg), receive: () => this.inbox.splice(0) };
  }
}
