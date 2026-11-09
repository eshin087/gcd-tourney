import { defineConfig } from 'vite';
import { resolve, join } from 'path';
import { writeFileSync, mkdirSync, readdirSync, readFileSync, existsSync } from 'fs';
import { createHash } from 'crypto';

// The simulation's fingerprint (import.meta.env.SIM_ID): a hash of everything a fight is computed from (the game,
// fighter and input code, the state hash and its deterministic math, every fighter's anims.json with its boxes).
// A determinism fixture (ADR 0036) records it, so a build whose gameplay changed reports the fixture as stale instead
// of as a split. Line endings are normalized: a Windows checkout and the deploy's clean export hash the same.
function simId() {
  const files = [];
  const add = (p) => { if (existsSync(p)) files.push(p); };
  const walk = (dir, test) => {
    if (!existsSync(dir)) return;
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p, test);
      else if (test(e.name)) files.push(p);
    }
  };
  walk(resolve(__dirname, 'src/game'), (n) => n.endsWith('.js'));
  walk(resolve(__dirname, 'src/characters'), (n) => n.endsWith('.js'));
  walk(resolve(__dirname, 'public/characters'), (n) => n === 'anims.json');
  for (const f of ['src/core/input.js', 'src/net/simHash.js']) add(resolve(__dirname, f));
  const h = createHash('sha1');
  for (const f of files.map((p) => p.slice(__dirname.length).replace(/\\/g, '/')).sort()) {
    h.update(f);
    h.update(readFileSync(join(__dirname, f), 'utf8').replace(/\r\n/g, '\n'));
  }
  return h.digest('hex').slice(0, 12);
}

// Dev server only: the determinism test (ADR 0036, src/net/detTest.js) saves a recorded match log as a fixture in
// public/det/, so another browser or a phone can replay it against the reference hashes.
const detFixtures = () => ({
  name: 'det-fixtures',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use('/__det/save', (req, res) => {
      const name = new URL(req.url, 'http://x').searchParams.get('name') || '';
      if (req.method !== 'POST' || !/^[a-z0-9-]{1,60}$/.test(name)) { res.statusCode = 400; res.end('bad request'); return; }
      let body = '';
      req.on('data', (c) => { body += c; });
      req.on('end', () => {
        try {
          // stamp the fingerprint of the files on disk now: the page's import.meta.env.SIM_ID is the one this server
          // started with, and gameplay edits since (the page reloads on them) would make the fixture look stale
          const log = JSON.parse(body);
          log.sim = simId();
          const out = JSON.stringify(log);
          mkdirSync(resolve(__dirname, 'public/det'), { recursive: true });
          writeFileSync(resolve(__dirname, `public/det/${name}.json`), out);
          res.end(`saved public/det/${name}.json (${out.length} bytes, sim ${log.sim})`);
        } catch (e) {
          res.statusCode = 400;
          res.end(String(e.message));
        }
      });
    });
  },
});

// Folders the dev server's file watcher stays out of. Each is this checkout's own folder, resolved from __dirname:
// a dev server started inside a worktree sits under a .worktrees/ (or .claude/worktrees/) path too, and a
// '**/.worktrees/**' glob made it ignore every one of its own files (no reload after an edit).
const unwatched = (dir) => resolve(__dirname, dir).replace(/\\/g, '/') + '/**';
// .worktrees/ holds full copies of the project (npm run pr): watching them would reload on every edit there.
const worktrees = unwatched('.worktrees');
// .claude/worktrees/ holds the Claude app's managed worktrees, full copies as well. The watcher also keeps a handle
// open on every folder it follows, and Windows refuses to rename a folder while one inside it is held: with a server
// running from the main checkout, `npm run test:sprites` in a worktree died with EPERM on a rename (TOOL-069).
const appWorktrees = unwatched('.claude/worktrees');
// tools/.test-fixtures/ is where the tool tests build throw-away art trees and git repositories. Nothing there is
// served, and the same handles broke a test run in the checkout its own dev server was started from.
const testFixtures = unwatched('tools/.test-fixtures');
// .publish-cache/ is the bare repository tools/publish.mjs rewrites history in; nothing there is served.
const publishCache = unwatched('.publish-cache');

export default defineConfig({
  plugins: [detFixtures()],
  define: { 'import.meta.env.SIM_ID': JSON.stringify(simId()) },
  server: {
    port: 5188, strictPort: true, host: '127.0.0.1',
    watch: { ignored: [worktrees, appWorktrees, testFixtures, publishCache] },
  },
  // only the real pages: the default crawls every .html under the root, worktree copies included
  optimizeDeps: { entries: ['index.html', 'sprites.html', 'art-review.html', 'lab.html'] },
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        sprites: resolve(__dirname, 'sprites.html'),
        artReview: resolve(__dirname, 'art-review.html'),
        lab: resolve(__dirname, 'lab.html'), // the test lab (ADR 0018): a dev page, not linked from the game
      },
    },
  },
});
