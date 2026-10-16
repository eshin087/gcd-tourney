// GCD Tourney lobby server (ADR 0036, ENG-094/095): a Cloudflare Worker that hands each room code's WebSocket to that
// room's Durable Object (room.js), and lists the public rooms (directory.js). Rooms run independently, so many lobbies
// play at once.
//   GET /                   health text
//   GET /rooms              the public rooms (JSON, newest summaries; the online menu's room list)
//   GET /room/<CODE>        WebSocket upgrade (CODE: five letters / digits, see src/net/lobby.js on the client)
//   GET /room/<CODE>/ping   'pong' from the room's object: the room list's ping, to where that room runs
//   GET /room/<CODE>/stats  the players' connection stats of the room's recent matches (JSON; for diagnosing lag)
export { Room } from './room.js';
export { Directory } from './directory.js';

// pages that may open a room: production, its preview deployments, and local development (incl. a phone on the LAN)
const ORIGIN = /^(https:\/\/gcd-tourney[a-z0-9-]*\.vercel\.app|http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+)(:\d+)?)$/;

const text = (body, status = 200) => new Response(body + '\n', { status, headers: { 'content-type': 'text/plain' } });

// the room list and pings are read by the game's pages from another origin
function cors(req, res) {
  const origin = req.headers.get('Origin') || '';
  if (!ORIGIN.test(origin)) return res;
  const out = new Response(res.body, res);
  out.headers.set('Access-Control-Allow-Origin', origin);
  out.headers.set('Vary', 'Origin');
  out.headers.set('Cache-Control', 'no-store');
  return out;
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname === '/') return text('GCD Tourney lobby server');
    if (url.pathname === '/rooms' && req.method === 'GET') {
      const rooms = await env.DIRECTORY.get(env.DIRECTORY.idFromName('all')).list();
      return cors(req, Response.json(rooms));
    }
    const sub = url.pathname.match(/^\/room\/([A-Z2-9]{5})\/(stats|ping)$/);
    if (sub && req.method === 'GET') return cors(req, await env.ROOMS.get(env.ROOMS.idFromName(sub[1])).fetch(req));
    const m = url.pathname.match(/^\/room\/([A-Z2-9]{5})$/);
    if (!m) return text('not found', 404);
    if (req.headers.get('Upgrade') !== 'websocket') return text('expected a WebSocket', 426);
    if (!ORIGIN.test(req.headers.get('Origin') || '')) return text('origin not allowed', 403);
    return env.ROOMS.get(env.ROOMS.idFromName(m[1])).fetch(req);
  },
};
