// Sparse art worktrees (TOOL-047): which art/ folders a worktree checks out, and proof that their raw/ is on disk.
// Imported by tools/pr.mjs (start, art) and tools/pack-sprites.mjs (the dropped-effect guard); no side effects on import.
//
// Why a check and not only patterns: `pr start --art` writes the right patterns, but worktrees also get recreated or
// repaired by hand. One (art/beam-clash, 2026-10-15) carried only the base exclusions, so art/vfx/raw/ was empty and
// the packer committed an atlas without six live effects; another had `git sparse-checkout add /art/...` typed in Git
// Bash, which rewrites a leading-slash argument to `C:/Program Files/Git/art/...` and silently matches nothing.

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

// Code worktrees skip raw image generations (~2 GB, the same globs as publish.mjs).
export const SPARSE = ['/*', '!/art/*/raw/', '!/art/*/*/raw/', '!/art/**/_rejected/', '!/art/**/_old/', '!/art/**/contact/'];

// --art naruto,vfx -> art/characters/naruto and art/vfx: the folder of each id under art/ (a character id or an art kind)
export function artFolders(root, list) {
  if (!list) return [];
  return [...new Set(String(list).split(',').map((s) => s.trim()).filter(Boolean))].map((id) =>
    // an id with no folder yet is a new character; its folder must still be in the sparse set or `git add` refuses it
    'art/' + ([id, 'characters/' + id].find((r) => fs.existsSync(path.join(root, 'art', r))) || 'characters/' + id));
}

// Non-cone patterns that bring a folder back whole, raw included. They go after SPARSE: later patterns win, but the
// SPARSE exclusions match raw/ itself, so the parent folder alone is not enough; `/**` re-includes everything below it
// and the explicit raw/ line says what the patterns are for.
export const folderPatterns = (folders) => folders.flatMap((f) => [`/${f}/`, `/${f}/**`, `/${f}/raw/`]);

// Patterns the shell rewrote before git saw them (Git Bash turns /art/x/ into C:/Program Files/Git/art/x/): they never match.
export const mangledPatterns = (patterns) => patterns.filter((p) => /^!?[A-Za-z]:[\\/]/.test(p));

export function sparsePatterns(dir) {
  try {
    return execFileSync('git', ['sparse-checkout', 'list'], { cwd: dir, stdio: ['ignore', 'pipe', 'pipe'] }).toString().split(/\r?\n/).filter(Boolean);
  } catch { return []; }
}

// Tracked files under `rel` (repo-relative, forward slashes) that the sparse checkout leaves off disk (skip-worktree).
// Empty outside a git repository or when nothing is skipped.
export function skippedFiles(dir, rel) {
  try {
    const out = execFileSync('git', ['ls-files', '-t', '--', rel], { cwd: dir, stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 << 20 }).toString();
    return out.split(/\r?\n/).filter((l) => l.startsWith('S ')).map((l) => l.slice(2));
  } catch { return []; }
}

// For each folder: how many tracked raw/ files the worktree has on disk, and the ones the sparse checkout skips
// (the _rejected/_old/contact folders do not count: SPARSE drops them on purpose).
export function rawGaps(dir, folders) {
  return folders.map((f) => {
    const raw = `${f}/raw`;
    let tracked = [];
    try {
      tracked = execFileSync('git', ['ls-files', '--', raw], { cwd: dir, stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 << 20 }).toString().split(/\r?\n/).filter(Boolean);
    } catch { /* not a repository */ }
    const wanted = (p) => !/\/(_rejected|_old|contact)\//.test(p);
    const skipped = skippedFiles(dir, raw).filter(wanted);
    return { folder: f, tracked: tracked.filter(wanted).length, skipped };
  });
}
