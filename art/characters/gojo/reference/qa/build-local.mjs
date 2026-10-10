// Keep the existing Vite project configuration; avoid Windows sandbox realpath EPERM.
// This changes module resolution, not filesystem permissions or sandbox settings.
import { build } from 'vite';
await import('../../../../../tools/art-index.mjs');
await build({ resolve: { preserveSymlinks: true } });
