// Export a commit's tree to a folder without the paths the game never reads, for tools/deploy.mjs:
//   art/                 the raw generations (~1 GB)
//   public/reviews/      review screenshots and clips for the user (725 MB, 3,200 files)
//   public/art-review/   the art review page's catalog and pictures (360 MB)
// Until 2026-11-01 only art/ was left out, and the two public/ folders went up with every deploy: Vite copies public/
// into dist/, so each of 223 deployments held ~1.26 GB and the Vercel account showed 347 GB of deployment storage
// against a 10 GB Hobby limit (TOOL-066). A preview deploy still needs the review pages its own branch made (the user
// reviews art on a phone from the preview URL), so `include` brings back paths under the two review folders, never
// under art/; tools/deploy.mjs passes the review files the branch changed (TOOL-067).
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
// the excluded paths a preview may bring back (art/ never ships)
export const REVIEW_DIRS = ['public/reviews', 'public/art-review'];

const under = (p, dir) => p === dir || p.startsWith(dir + '/');
const excluded = (p) => EXCLUDE.some((e) => under(p, e));

// -> number of files written; throws if an excluded path that was not asked for reached the export.
// include: repository paths (files or folders) under REVIEW_DIRS to export anyway.
export function exportTree({ root, rev = 'HEAD', dest, index, include = [] }) {
  const bad = include.find((i) => !REVIEW_DIRS.some((d) => under(i, d) && i !== d));
  if (bad) throw new Error(`export: include ${bad} is not a path inside ${REVIEW_DIRS.join(' or ')}`);
  const wanted = (p) => !excluded(p) || include.some((i) => under(p, i));
  const run = (args, input) => execFileSync('git', args, {
    cwd: root, input, maxBuffer: 1 << 30, env: { ...process.env, GIT_INDEX_FILE: index },
  });
  fs.rmSync(index, { force: true });
  const entries = run(['ls-tree', '-r', '-z', '--full-tree', rev]).toString().split('\0').filter(Boolean)
    .filter((e) => wanted(e.slice(e.indexOf('\t') + 1)));
  run(['update-index', '-z', '--index-info'], entries.join('\0') + '\0');
  run(['checkout-index', '-a', `--prefix=${dest.split(path.sep).join('/')}/`]);
  // the guard reads the folder, not the index: whatever reached it under an excluded path must have been asked for
  for (const e of EXCLUDE) {
    const dir = path.join(dest, ...e.split('/'));
    if (!fs.existsSync(dir)) continue;
    const leaked = fs.readdirSync(dir, { recursive: true, withFileTypes: true }).filter((f) => f.isFile())
      .map((f) => path.relative(dest, path.join(f.parentPath ?? f.path, f.name)).split(path.sep).join('/'))
      .find((p) => !include.some((i) => under(p, i)));
    if (leaked !== undefined) throw new Error(`export: ${leaked} (under ${e}/) reached ${dest}; refusing to use it`);
  }
  return entries.length;
}

// The review files a branch changed against main: what its preview needs to show its own review pages. A review
// page's catalog (public/art-review/review.json) comes along whenever any art-review file changed.
export function changedReviewFiles({ root, rev = 'HEAD', base = 'main' }) {
  const git = (...args) => execFileSync('git', args, { cwd: root }).toString().trim();
  let mergeBase;
  try { mergeBase = git('merge-base', base, rev); } catch { return []; }
  const changed = git('diff', '--name-only', '--diff-filter=ACMR', mergeBase, rev, '--', ...REVIEW_DIRS)
    .split('\n').filter(Boolean);
  const catalog = 'public/art-review/review.json';
  if (changed.some((p) => under(p, 'public/art-review')) && !changed.includes(catalog)) {
    try { git('cat-file', '-e', `${rev}:${catalog}`); changed.push(catalog); } catch { /* no catalog on this commit */ }
  }
  return changed;
}
