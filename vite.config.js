import { defineConfig } from 'vite';
import { resolve } from 'path';
import { writeFileSync, mkdirSync } from 'fs';

// Dev server only: the determinism test (ADR 0034, src/net/detTest.js) saves a recorded match log as a fixture in
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
          JSON.parse(body);
          mkdirSync(resolve(__dirname, 'public/det'), { recursive: true });
          writeFileSync(resolve(__dirname, `public/det/${name}.json`), body);
          res.end(`saved public/det/${name}.json (${body.length} bytes)`);
        } catch (e) {
          res.statusCode = 400;
          res.end(String(e.message));
        }
      });
    });
  },
});

// .worktrees/ holds full copies of the project (npm run pr): watching them would reload on every edit there.
// Only this checkout's own folder: a dev server started inside a worktree sits under a .worktrees/ path too,
// and a '**/.worktrees/**' glob made it ignore every one of its own files (no reload after an edit).
const worktrees = resolve(__dirname, '.worktrees').replace(/\\/g, '/') + '/**';
// .publish-cache/ is the bare repository tools/publish.mjs rewrites history in; nothing there is served.
const publishCache = resolve(__dirname, '.publish-cache').replace(/\\/g, '/') + '/**';

export default defineConfig({
  plugins: [detFixtures()],
  server: { port: 5188, strictPort: true, host: '127.0.0.1', watch: { ignored: [worktrees, publishCache] } },
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
