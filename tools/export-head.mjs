// Export a commit's tree to a folder without the paths the game never reads, for tools/deploy.mjs:
//   art/                 the raw generations (~1 GB)
//   public/reviews/      review screenshots and clips for the user (725 MB, 3,200 files)
//   public/art-review/   the art review page's catalog and pictures (360 MB)
// Until 2026-11-01 only art/ was left out, and the two public/ folders went up with every deploy: Vite copies public/
// into dist/, so each of 223 deployments held ~1.26 GB and the Vercel account showed 347 GB of deployment storage
// against a 10 GB Hobby limit. With them excluded a deploy is a few tens of MB. The art review page (art-review.html)
// finds its catalog only locally (`npm run dev`); on the live site it reports nothing to review.
//
// Through a private index file, so the shared index (and anything another agent has staged) is never touched. The
// index is built from `ls-tree` minus the excluded paths instead of `read-tree` + `git rm --cached`: in a sparse
// worktree (`pr start --art`, patterns `!/art/*/raw/`) git rm silently skips the paths outside the sparse definition,
// so every raw PNG stayed in the index and checkout-index wrote a 4.9 GB export (TOOL-052, 2026-10-16). ls-tree and
// update-index ignore sparse checkout, and the export is checked for the excluded paths before anything uses it.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

export const EXCLUDE = ['art', 'public/reviews', 'public/art-review'];

const excluded = (p) => EXCLUDE.some((e) => p === e || p.startsWith(e + '/'));

// -> number of files written; throws if anything under an excluded path reached the export
export function exportTree({ root, rev = 'HEAD', dest, index }) {
  const run = (args, input) => execFileSync('git', args, {
    cwd: root, input, maxBuffer: 1 << 30, env: { ...process.env, GIT_INDEX_FILE: index },
  });
  fs.rmSync(index, { force: true });
  const entries = run(['ls-tree', '-r', '-z', '--full-tree', rev]).toString().split('\0').filter(Boolean)
    .filter((e) => !excluded(e.slice(e.indexOf('\t') + 1)));
  run(['update-index', '-z', '--index-info'], entries.join('\0') + '\0');
  run(['checkout-index', '-a', `--prefix=${dest.split(path.sep).join('/')}/`]);
  const leaked = EXCLUDE.find((e) => fs.existsSync(path.join(dest, ...e.split('/'))));
  if (leaked) throw new Error(`export: ${leaked}/ reached ${dest}; refusing to use it`);
  return entries.length;
}
