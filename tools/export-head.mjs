// Export a commit's tree to a folder without art/ (the raw generations the game never reads), for tools/deploy.mjs.
//
// Through a private index file, so the shared index (and anything another agent has staged) is never touched. The
// index is built from `ls-tree` minus art/ instead of `read-tree` + `git rm --cached art`: in a sparse worktree
// (`pr start --art`, patterns `!/art/*/raw/`) git rm silently skips the paths outside the sparse definition, so every
// raw PNG stayed in the index and checkout-index wrote a 4.9 GB export (TOOL-052, 2026-10-16). ls-tree and
// update-index ignore sparse checkout, and the export is checked for art/ before anything uses it.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const EXCLUDE = 'art';

// -> number of files written; throws if anything under art/ reached the export
export function exportTree({ root, rev = 'HEAD', dest, index }) {
  const run = (args, input) => execFileSync('git', args, {
    cwd: root, input, maxBuffer: 1 << 30, env: { ...process.env, GIT_INDEX_FILE: index },
  });
  fs.rmSync(index, { force: true });
  const entries = run(['ls-tree', '-r', '-z', '--full-tree', rev]).toString().split('\0').filter(Boolean)
    .filter((e) => { const p = e.slice(e.indexOf('\t') + 1); return p !== EXCLUDE && !p.startsWith(EXCLUDE + '/'); });
  run(['update-index', '-z', '--index-info'], entries.join('\0') + '\0');
  run(['checkout-index', '-a', `--prefix=${dest.split(path.sep).join('/')}/`]);
  if (fs.existsSync(path.join(dest, EXCLUDE))) throw new Error(`export: ${EXCLUDE}/ reached ${dest}; refusing to use it`);
  return entries.length;
}
