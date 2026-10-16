// The public room directory (ADR 0036, ENG-095): one Durable Object for the whole game. Public rooms report their
// summary to it (room.js: on every change that shows in the list, and every few minutes while they have members);
// GET /rooms lists the ones heard from recently. A room that stops reporting (its last member left, or the object
// was evicted) drops out after TTL_MS. Without the anti-bot check (room.js), one address can list at most
// PER_OWNER rooms, so a script can't fill the list. Called over Durable Object RPC.
import { DurableObject } from 'cloudflare:workers';

export const TTL_MS = 7 * 60 * 1000;
const MAX_LISTED = 50;
const PER_OWNER = 2; // public rooms one address can have listed at once

export class Directory extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    ctx.blockConcurrencyWhile(async () => {
      this.rooms = (await ctx.storage.get('rooms')) || {};
    });
  }

  // owner: the hash of the opener's address (never listed); returns false when that address already has its share
  async put(code, entry, owner = null) {
    this.prune();
    const others = owner ? Object.values(this.rooms).filter((r) => r.owner === owner && r.code !== code).length : 0;
    if (others >= PER_OWNER) return false;
    this.rooms[code] = { ...entry, code, owner, at: Date.now() };
    await this.ctx.storage.put('rooms', this.rooms);
    return true;
  }

  async drop(code) {
    if (!this.rooms[code]) return;
    delete this.rooms[code];
    await this.ctx.storage.put('rooms', this.rooms);
  }

  // rooms with a match on first, then the fullest, then the newest; full ones last
  list() {
    this.prune();
    return Object.values(this.rooms)
      .sort((a, b) => a.full - b.full || !!b.playing - !!a.playing || b.members - a.members || b.at - a.at)
      .slice(0, MAX_LISTED)
      .map(({ owner, ...r }) => r);
  }

  prune() {
    const now = Date.now();
    for (const [code, r] of Object.entries(this.rooms)) if (now - r.at > TTL_MS) delete this.rooms[code];
  }
}
