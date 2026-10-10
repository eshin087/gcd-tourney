import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // .worktrees/ holds full copies of the project (npm run pr): watching them would reload on every edit there
  server: { port: 5188, strictPort: true, host: '127.0.0.1', watch: { ignored: ['**/.worktrees/**'] } },
  // only the real pages: the default crawls every .html under the root, worktree copies included
  optimizeDeps: { entries: ['index.html', 'sprites.html', 'art-review.html'] },
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        sprites: resolve(__dirname, 'sprites.html'),
        artReview: resolve(__dirname, 'art-review.html'),
      },
    },
  },
});
