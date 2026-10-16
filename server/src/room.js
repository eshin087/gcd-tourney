// The Room Durable Object (ADR 0036, ENG-094): one per room code, holding its WebSockets and running RoomCore.
// Hibernating WebSockets: an idle room (everyone in the lobby, nobody playing) costs nothing while it sleeps, and a
// restarted object finds its members again on the sockets' attachments and its line in storage. A match's inputs
// live in memory only; during a match messages flow 120 times a second, so the object never sleeps mid-match.
import { DurableObject } from 'cloudflare:workers';
import { RoomCore } from './roomCore.js';

export class Room extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.alarmAt = null;
    // the client's keepalive: answered without waking the object
    ctx.setWebSocketAutoResponse(new WebSocketRequestResponsePair('ping', 'pong'));
    ctx.blockConcurrencyWhile(async () => {
      const saved = await ctx.storage.get('room');
      this.core = new RoomCore({
        send: (id, msg) => this.send(id, msg),
        save: (s) => { ctx.storage.put('room', s); },
        now: () => Date.now(),
      }, saved);
      for (const ws of ctx.getWebSockets()) {
        const m = ws.deserializeAttachment();
        if (m?.joined) this.core.restore(m);
      }
      this.alarmAt = await ctx.storage.getAlarm();
    });
  }

  async fetch(req) {
    if (new URL(req.url).pathname.endsWith('/stats')) return Response.json(this.core.statsLog); // index.js: GET only
    const [client, server] = Object.values(new WebSocketPair());
    const id = crypto.randomUUID().replace(/-/g, '').slice(0, 10);
    this.ctx.acceptWebSocket(server, [id]); // the tag finds this member's socket again (getWebSockets(id))
    server.serializeAttachment({ id, joined: false });
    return new Response(null, { status: 101, webSocket: client });
  }

  send(id, msg) {
    const data = JSON.stringify(msg);
    for (const ws of this.ctx.getWebSockets(id)) {
      try { ws.send(data); } catch { /* closing */ }
    }
  }

  async webSocketMessage(ws, data) {
    const a = ws.deserializeAttachment();
    if (typeof data !== 'string' || data.length > 16384) return ws.close(1009, 'message too big');
    let msg;
    try { msg = JSON.parse(data); } catch { return; }
    if (!a.joined) {
      if (msg?.t !== 'hello') return;
      const m = this.core.join(a.id, msg);
      if (!m) return ws.close(4000, 'rejected');
      ws.serializeAttachment({ ...m, joined: true });
    } else {
      if (this.core.message(a.id, msg) === 'flood') return ws.close(4008, 'too many messages');
      const m = this.core.members.get(a.id);
      if ((msg?.t === 'set' || msg?.t === 'rtt') && m) ws.serializeAttachment({ ...m, joined: true });
    }
    await this.schedule();
  }

  async webSocketClose(ws, code) {
    this.drop(ws);
    try { ws.close(code === 1005 || code === 1006 ? 1000 : code, 'bye'); } catch { /* already closed */ }
    await this.schedule();
  }

  async webSocketError(ws) {
    this.drop(ws);
    await this.schedule();
  }

  drop(ws) {
    const a = ws.deserializeAttachment();
    if (a?.joined) this.core.leave(a.id);
  }

  async alarm() {
    this.alarmAt = null;
    this.core.timer();
    await this.schedule();
  }

  // one alarm at a time: kept while it fires before the room needs it, so a match's 120 messages a second don't
  // each touch storage
  async schedule() {
    const at = this.core.nextWake();
    const now = Date.now();
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
