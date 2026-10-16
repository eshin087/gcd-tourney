// GCD Tourney lobby server (ADR 0036, ENG-094): a Cloudflare Worker that hands each room code's WebSocket to that
// room's Durable Object (room.js). Rooms run independently, so many lobbies play at once.
//   GET /                 health text
//   GET /room/<CODE>      WebSocket upgrade (CODE: five letters / digits, see src/net/lobby.js on the client)
export { Room } from './room.js';

// pages that may open a room: production, its preview deployments, and local development (incl. a phone on the LAN)
const ORIGIN = /^(https:\/\/gcd-tourney[a-z0-9-]*\.vercel\.app|http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+)(:\d+)?)$/;

const text = (body, status = 200) => new Response(body + '\n', { status, headers: { 'content-type': 'text/plain' } });

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname === '/') return text('GCD Tourney lobby server');
    const m = url.pathname.match(/^\/room\/([A-Z2-9]{5})$/);
    if (!m) return text('not found', 404);
    if (req.headers.get('Upgrade') !== 'websocket') return text('expected a WebSocket', 426);
    if (!ORIGIN.test(req.headers.get('Origin') || '')) return text('origin not allowed', 403);
    return env.ROOMS.get(env.ROOMS.idFromName(m[1])).fetch(req);
  },
};
