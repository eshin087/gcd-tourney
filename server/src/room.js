// The Room Durable Object (ADR 0036, ENG-094/095): one per room code, holding its WebSockets and running RoomCore.
// Hibernating WebSockets: an idle room (everyone in the lobby, nobody playing) costs nothing while it sleeps, and a
// restarted object finds its members again on the sockets' attachments and its line in storage. A match's inputs
// live in memory only; during a match messages flow 120 times a second, so the object never sleeps mid-match.
// A public room reports its summary to the directory (directory.js) when it changes and every HEARTBEAT_MS. Opening
// one takes the Cloudflare Turnstile check once the TURNSTILE_SECRET Worker secret exists (verify(): siteverify); until
// then (the user's call, 2026-10-16: "Not now") anyone may open one, and the directory caps rooms per address.
// Sockets are found by member id (this.sockets): a member who comes back (ENG-097: hello with `resume`) takes its seat
// on the new socket, the old one (if the server still thinks it is open) is closed, and its later close is ignored.
import { DurableObject } from 'cloudflare:workers';
import { RoomCore } from './roomCore.js';

const HEARTBEAT_MS = 3 * 60 * 1000; // the directory drops a room it hasn't heard from in 7 minutes
// the pages a Turnstile token may come from (siteverify's hostname): production and its preview deployments
const TOKEN_HOST = /^gcd-tourney[a-z0-9-]*\.vercel\.app$/;

const hashIp = async (ip) => {
  if (!ip) return null;
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('gcd-room:' + ip));
  return [...new Uint8Array(d).slice(0, 8)].map((b) => b.toString(16).padStart(2, '0')).join('');
};

export class Room extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.alarmAt = null;
    this.pubKey = null; // what the directory last heard from this room
    this.pubAt = 0;
    this.sockets = new Map(); // member id -> its current socket
    // the client's keepalive: answered without waking the object
    ctx.setWebSocketAutoResponse(new WebSocketRequestResponsePair('ping', 'pong'));
    ctx.blockConcurrencyWhile(async () => {
      const saved = await ctx.storage.get('room');
      this.code = (await ctx.storage.get('code')) || null;
      this.core = new RoomCore({
        send: (id, msg) => this.send(id, msg),
        close: (id, code, reason) => { try { this.sockets.get(id)?.close(code, reason); } catch { /* closed */ } },
        save: (s) => { ctx.storage.put('room', s); },
        now: () => Date.now(),
      }, saved);
      for (const ws of ctx.getWebSockets()) {
        const m = ws.deserializeAttachment();
        if (!m?.joined || m.superseded) continue;
        this.core.restore(m);
        this.sockets.set(m.id, ws);
      }
      this.alarmAt = await ctx.storage.getAlarm();
    });
  }

  async fetch(req) {
    const url = new URL(req.url);
    if (url.pathname.endsWith('/stats')) return Response.json(this.core.statsLog); // index.js: GET only
    if (url.pathname.endsWith('/ping')) return new Response('pong'); // the room list's ping, measured to where the room runs
    const code = url.pathname.match(/^\/room\/([A-Z2-9]{5})$/)?.[1];
    if (code && code !== this.code) {
      this.code = code; // the directory lists rooms by code; the object only learns its own from a request
      await this.ctx.storage.put('code', code);
    }
    const [client, server] = Object.values(new WebSocketPair());
    const id = crypto.randomUUID().replace(/-/g, '').slice(0, 10);
    this.ctx.acceptWebSocket(server, [id]); // the tag finds this member's socket again (getWebSockets(id))
    const ip = await hashIp(req.headers.get('CF-Connecting-IP'));
    if (!this.owner) this.owner = ip; // the address that opened the room: the directory lists a few rooms per address
    server.serializeAttachment({ id, joined: false, ip, region: req.cf?.colo ?? '' });
    return new Response(null, { status: 101, webSocket: client });
  }

  send(id, msg) {
    const ws = this.sockets.get(id);
    if (!ws) return; // away: the room keeps its seat, not its messages
    try { ws.send(JSON.stringify(msg)); } catch { /* closing */ }
  }

  async webSocketMessage(ws, data) {
    const a = ws.deserializeAttachment();
    if (typeof data !== 'string' || data.length > 16384) return ws.close(1009, 'message too big');
    let msg;
    try { msg = JSON.parse(data); } catch { return; }
    if (!a.joined) {
      if (msg?.t !== 'hello') return;
      // opening a public room takes the anti-bot check when it is switched on (the secret is set); joining one doesn't
      const opening = !!msg.public && this.core.members.size === 0;
      const verified = opening && (!this.env.TURNSTILE_SECRET || await this.verify(msg.turnstile));
      // a member coming back takes its seat on this socket (the old one, if still open, is closed and then ignored)
      const back = msg.resume ? this.core.resumable(msg.resume) : null;
      const id = back || a.id;
      const old = this.sockets.get(id);
      this.sockets.set(id, ws);
      if (old && old !== ws) {
        old.serializeAttachment({ ...old.deserializeAttachment(), superseded: true });
        try { old.close(4002, 'reconnected elsewhere'); } catch { /* closed */ }
      }
      const m = this.core.join(id, msg, { ip: a.ip, region: a.region, verified });
      if (!m) {
        if (this.sockets.get(id) === ws) this.sockets.delete(id);
        return ws.close(4000, 'rejected');
      }
      ws.serializeAttachment({ ...m, joined: true });
    } else {
      if (this.core.message(a.id, msg) === 'flood') return ws.close(4008, 'too many messages');
      const m = this.core.members.get(a.id);
      if ((msg?.t === 'set' || msg?.t === 'rtt') && m) ws.serializeAttachment({ ...m, joined: true });
    }
    await this.sync();
  }

  // Cloudflare Turnstile: the token the client's widget produced, checked once with the secret (fails closed).
  // TURNSTILE_DEV (server/.dev.vars only, never deployed) accepts the test keys' tokens from any page.
  async verify(token) {
    const secret = this.env.TURNSTILE_SECRET;
    if (!secret || typeof token !== 'string' || !token || token.length > 2048) return false;
    try {
      const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ secret, response: token }),
        signal: AbortSignal.timeout(10000),
      });
      if (!r.ok) return false;
      const d = await r.json();
      if (this.env.TURNSTILE_DEV === '1') return d.success === true;
      return d.success === true && d.action === 'create_room' && TOKEN_HOST.test(d.hostname ?? '');
    } catch {
      return false;
    }
  }

  async webSocketClose(ws, code) {
    this.drop(ws);
    try { ws.close(code === 1005 || code === 1006 ? 1000 : code, 'bye'); } catch { /* already closed */ }
    await this.sync();
  }

  async webSocketError(ws) {
    this.drop(ws);
    await this.sync();
  }

  // a socket closed: its member keeps the seat for the grace period (unless it left on purpose, or came back on
  // another socket already)
  drop(ws) {
    const a = ws.deserializeAttachment();
    if (!a?.joined || this.sockets.get(a.id) !== ws) return;
    this.sockets.delete(a.id);
    this.core.disconnect(a.id);
  }

  async alarm() {
    this.alarmAt = null;
    this.core.timer();
    await this.sync();
  }

  async sync() {
    await this.publish();
    await this.schedule();
  }

  // the directory hears what changed in this room's listing (and every HEARTBEAT_MS while it is listed)
  async publish() {
    if (!this.code || !this.env.DIRECTORY) return;
    const sum = this.core.summary(), key = JSON.stringify(sum), now = Date.now();
    if (key === this.pubKey && !(sum && now - this.pubAt >= HEARTBEAT_MS)) return;
    const dir = this.env.DIRECTORY.get(this.env.DIRECTORY.idFromName('all'));
    try {
      if (sum) await dir.put(this.code, sum, this.ownerOf());
      else if (this.pubKey !== null) await dir.drop(this.code);
      this.pubKey = key;
      this.pubAt = now;
    } catch { /* the directory is a listing: the next change or heartbeat tries again */ }
  }

  // the address hash of the room's first member (for the directory's per-address cap)
  ownerOf() {
    return this.core.members.values().next().value?.ip ?? this.owner ?? null;
  }

  // one alarm at a time: kept while it fires before the room needs it, so a match's 120 messages a second don't
  // each touch storage
  async schedule() {
    const now = Date.now();
    const beat = this.pubKey && this.pubKey !== 'null' ? this.pubAt + HEARTBEAT_MS : null;
    const want = [this.core.nextWake(), beat].filter((t) => t != null);
    const at = want.length ? Math.max(now + 50, Math.min(...want)) : null;
    if (at == null) {
      if (this.alarmAt != null) await this.ctx.storage.deleteAlarm();
      this.alarmAt = null;
      return;
    }
    if (this.alarmAt != null && this.alarmAt > now && this.alarmAt <= at) return;
    this.alarmAt = at;
    await this.ctx.storage.setAlarm(at);
  }
}
