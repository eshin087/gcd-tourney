#!/usr/bin/env node
// Regression test for sparse art worktrees (TOOL-048: `pr start --art`, `pr art`, tools/sparse-art.mjs), and for
// `pr prune` / `pr merge` meeting a registered worktree whose folder is gone (TOOL-063).
//   node tools/test-sparse-art.mjs   (part of `npm run test:guard`; add --keep to keep tools/.test-fixtures/sparse-art/)
// Builds a throw-away repository under tools/.test-fixtures/ holding a copy of tools/pr.mjs and its imports, then runs
// the real `pr start` there and checks what lands on disk: art/vfx/raw/ was empty in a worktree on 2026-10-15 and the
// packer committed an atlas without six live effects.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { SPARSE, artFolders, folderPatterns, mangledPatterns, rawGaps, sparsePatterns } from './sparse-art.mjs';

const TOOL_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.join(TOOL_DIR, '.test-fixtures', 'sparse-art');
const KEEP = process.argv.includes('--keep');
let failures = 0, passes = 0;
const check = (ok, msg) => { if (ok) passes++; else { failures++; console.log(`  FAIL ${msg}`); } };

const git = (cwd, ...a) => execFileSync('git', a, { cwd, stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim();
const put = (rel, data = 'x\n') => { const f = path.join(REPO, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, data); };
const pr = (cwd, ...args) => spawnSync(process.execPath, [path.join(cwd, 'tools', 'pr.mjs'), ...args], { cwd, encoding: 'utf8' });
const on = (dir, rel) => fs.existsSync(path.join(dir, rel));
const wt = (branch) => path.join(REPO, '.worktrees', branch.replace(/\//g, '-'));

function buildRepo() {
  fs.rmSync(REPO, { recursive: true, force: true });
  fs.mkdirSync(REPO, { recursive: true });
  git(REPO, 'init', '-q', '-b', 'main');
  git(REPO, 'config', 'user.email', 'sparse@test'); git(REPO, 'config', 'user.name', 'sparse test'); git(REPO, 'config', 'core.autocrlf', 'false');
  for (const f of ['pr.mjs', 'pr-guard.mjs', 'sparse-art.mjs', 'scratch-dir.mjs']) put('tools/' + f, fs.readFileSync(path.join(TOOL_DIR, f)));
  put('tools/publish.mjs', '// stub: `pr merge` publishes to GitHub; the fixture never does\n');
  put('.gitignore', '.worktrees/\nnode_modules/\n');
  put('package.json', '{ "name": "sparse-fixture", "private": true }\n');
  put('src/game/code.js', 'export const x = 1;\n');
  put('art/vfx/EFFECTS.md');
  put('art/vfx/frames/glow/glow_00.png');
  for (const e of ['glow_v01.png', 'bubble_v01.png', 'bubble_v01.json', 'ripple_v02.png']) put('art/vfx/raw/' + e);
  put('art/vfx/raw/_rejected/ripple_v01.png');
  put('art/characters/naruto/hitboxes.json', '{}\n');
  put('art/characters/naruto/raw/idle_v01.png');
  put('art/characters/naruto/raw/run_v02.png');
  put('art/characters/naruto/raw/_rejected/run_v01.png');
  put('art/characters/sasuke/raw/idle_v01.png');
  put('art/crowd/raw/fan_v01.png');
  git(REPO, 'add', '-A'); git(REPO, 'commit', '-q', '-m', 'main');
}

function main() {
  // 1) the pattern helpers, no git
  check(SPARSE.includes('!/art/*/raw/') && SPARSE.includes('!/art/*/*/raw/'), 'SPARSE still excludes every raw/ (code worktrees stay small)');
  buildRepo();
  const folders = artFolders(REPO, 'naruto, vfx,naruto,newguy');
  check(JSON.stringify(folders) === JSON.stringify(['art/characters/naruto', 'art/vfx', 'art/characters/newguy']),
    `artFolders: a character id, an art kind, duplicates and a new character (${folders})`);
  const pats = folderPatterns(['art/vfx']);
  check(pats.includes('/art/vfx/') && pats.includes('/art/vfx/**') && pats.includes('/art/vfx/raw/'), `folderPatterns re-include the folder, everything below it and raw/ (${pats})`);
  check(JSON.stringify(mangledPatterns(['/*', 'C:/Program Files/Git/art/vfx/', '!D:\\x', '/art/vfx/**'])) === JSON.stringify(['C:/Program Files/Git/art/vfx/', '!D:\\x']),
    'mangledPatterns: spots a leading slash a shell rewrote into a drive path');

  // 2) the real `pr start --art vfx,naruto`: both folders' raw/ on disk, the rest stays out
  const a = wt('art/both');
  const r1 = pr(REPO, 'start', 'art/both', '--art', 'vfx,naruto', '--no-install');
  check(r1.status === 0, `pr start --art vfx,naruto succeeds (exit ${r1.status}) ${r1.stderr.trim().split('\n').pop()}`);
  for (const f of ['art/vfx/raw/glow_v01.png', 'art/vfx/raw/bubble_v01.json', 'art/vfx/raw/ripple_v02.png', 'art/vfx/frames/glow/glow_00.png', 'art/characters/naruto/raw/idle_v01.png', 'art/characters/naruto/raw/run_v02.png']) {
    check(on(a, f), `--art vfx,naruto: ${f} is on disk`);
  }
  check(!on(a, 'art/characters/sasuke/raw/idle_v01.png') && !on(a, 'art/crowd/raw/fan_v01.png'), '--art vfx,naruto: other folders\' raw/ stays out');
  check(on(a, 'src/game/code.js') && on(a, 'art/characters/naruto/hitboxes.json'), 'code and art data outside raw/ are checked out');
  check(/art\/vfx\/raw\/: 4 tracked file\(s\) on disk/.test(r1.stdout) && /art\/characters\/naruto\/raw\/: 2 tracked/.test(r1.stdout), `start reports each raw/ it verified (${r1.stdout.match(/\[pr\] art.*/g)})`);
  check(rawGaps(a, ['art/vfx', 'art/characters/naruto']).every((g) => !g.skipped.length), 'rawGaps: nothing skipped in the --art folders');

  // 3) a worktree started without --art (or recreated by hand) has no vfx raw, and rawGaps sees it
  const c = wt('art/code');
  const r2 = pr(REPO, 'start', 'art/code', '--no-install');
  check(r2.status === 0 && !on(c, 'art/vfx/raw/glow_v01.png') && on(c, 'art/vfx/frames/glow/glow_00.png'), `a code worktree skips raw/ but keeps frames/ (exit ${r2.status})`);
  const gap = rawGaps(c, ['art/vfx'])[0];
  check(gap.tracked === 4 && gap.skipped.length === 4 && gap.skipped.includes('art/vfx/raw/glow_v01.png'), `rawGaps: the 4 vfx raws are tracked but skipped (${JSON.stringify(gap)})`);

  // 4) `pr art vfx` repairs it, dropping a pattern Git Bash rewrote (`sparse-checkout add /art/crowd/` typed there)
  git(c, 'sparse-checkout', 'add', 'C:/Program Files/Git/art/crowd/');
  const r3 = pr(c, 'art', 'vfx');
  const after = sparsePatterns(c);
  check(r3.status === 0 && on(c, 'art/vfx/raw/glow_v01.png') && on(c, 'art/vfx/raw/ripple_v02.png'), `pr art vfx brings art/vfx/raw/ back (exit ${r3.status}) ${r3.stderr.trim()}`);
  check(!mangledPatterns(after).length && /dropping pattern/.test(r3.stdout), `pr art drops the rewritten pattern (${after.filter((p) => p.includes(':'))})`);
  check(!on(c, 'art/characters/naruto/raw/idle_v01.png'), 'pr art vfx leaves character raws out');
  const r4 = pr(c, 'art', 'vfx');
  check(r4.status === 0 && /already include/.test(r4.stdout) && JSON.stringify(sparsePatterns(c)) === JSON.stringify(after), 'pr art is idempotent');
  const r5 = pr(c, 'art', 'naruto');
  check(r5.status === 0 && on(c, 'art/characters/naruto/raw/run_v02.png') && on(c, 'art/vfx/raw/glow_v01.png'), 'pr art naruto adds a character and keeps vfx');
  const r6 = pr(REPO, 'art', 'vfx');
  check(r6.status !== 0 && /inside a sparse feature worktree/.test(r6.stderr), 'pr art refuses the main checkout');

  // 5) start dies loudly when the check fails (simulated: the old patterns without `/**`, which re-include the folder but not its raw/)
  const s = path.join(REPO, 'tools', 'sparse-art.mjs');
  const orig = fs.readFileSync(s, 'utf8');
  fs.writeFileSync(s, orig.replace("[`/${f}/`, `/${f}/**`, `/${f}/raw/`]", "[`/${f}/`]"));
  const r7 = pr(REPO, 'start', 'art/broken', '--art', 'vfx', '--no-install');
  fs.writeFileSync(s, orig);
  check(r7.status !== 0 && /raw art is not checked out: art\/vfx\/raw\/ \(4 of 4/.test(r7.stderr), `start refuses a worktree whose --art raw/ is missing (exit ${r7.status}) ${r7.stderr.trim()}`);

  // 6) a registered worktree whose folder is gone (TOOL-063): on 2026-10-18 git still listed a deleted app worktree, and
  //    prune died with `spawnSync git ENOENT` running git status there, before reaching the worktrees after it
  const listed = (dir) => git(REPO, 'worktree', 'list', '--porcelain').toLowerCase().includes(dir.replace(/\\/g, '/').toLowerCase());
  const branchOf = (b) => git(REPO, 'branch', '--list', b);
  const [gone, later, open, held] = ['fix/gone', 'fix/later', 'fix/open', 'fix/held'].map((b) => {
    const d = wt(b), f = `${path.basename(d)}.txt`;
    const r = pr(REPO, 'start', b, '--no-install');
    check(r.status === 0, `pr start ${b} (exit ${r.status}) ${r.stderr.trim()}`);
    fs.writeFileSync(path.join(d, f), b + '\n'); git(d, 'add', '--', f); git(d, 'commit', '-q', '-m', b);
    return d;
  });
  for (const b of ['fix/gone', 'fix/later', 'fix/held']) git(REPO, 'merge', '-q', '--no-ff', '--no-edit', b);
  git(REPO, 'worktree', 'lock', held);
  for (const d of [gone, open, held]) fs.rmSync(d, { recursive: true, force: true });
  const r8 = pr(REPO, 'prune', '--dry-run');
  check(r8.status === 0, `prune --dry-run survives worktrees whose folder is gone (exit ${r8.status}) ${r8.stderr.trim().split('\n').pop()}`);
  check(/would clear the registration of .*fix-gone: its folder is missing \(fix\/gone merged\)/.test(r8.stdout) && /would remove .*fix-later \(fix\/later merged\)/.test(r8.stdout),
    `--dry-run reports the missing worktree in one line and goes on to the rest (${r8.stdout.trim()})`);
  check(listed(gone) && branchOf('fix/gone') && fs.existsSync(later), '--dry-run changes nothing');
  const r9 = pr(REPO, 'prune');
  check(r9.status === 0, `prune survives worktrees whose folder is gone (exit ${r9.status}) ${r9.stderr.trim().split('\n').pop()}`);
  check(!listed(gone) && !branchOf('fix/gone') && /cleared the registration of .*fix-gone/.test(r9.stdout), `prune clears the missing merged worktree's entry and deletes its branch (${r9.stdout.trim()})`);
  check(!listed(later) && !fs.existsSync(later) && !branchOf('fix/later'), 'prune still removes the present merged worktree after it');
  check(listed(open) && branchOf('fix/open') && /kept the registration of .*fix-open: its folder is missing, but fix\/open is not merged/.test(r9.stderr),
    `an unmerged branch's missing worktree is only reported (${r9.stderr.trim()})`);
  check(listed(held) && branchOf('fix/held') && /fix-held: its folder is missing, but it is locked/.test(r9.stderr), 'a locked missing worktree is only reported');

  //    `pr merge` of a branch whose worktree folder an app already deleted (outside .worktrees/): no stale entry left,
  //    so the branch is deleted instead of staying "checked out" in a folder that does not exist
  const app = path.join(REPO, '.claude', 'worktrees', 'charge');
  git(REPO, 'worktree', 'add', '-q', '-b', 'fix/charge', app, 'main');
  fs.writeFileSync(path.join(app, 'charge.txt'), 'c\n'); git(app, 'add', '--', 'charge.txt'); git(app, 'commit', '-q', '-m', 'charge');
  fs.rmSync(app, { recursive: true, force: true });
  const r10 = pr(REPO, 'merge', 'fix/charge', '--no-deploy');
  check(r10.status === 0 && /cleared the registration of .*charge: its folder is gone/.test(r10.stdout), `pr merge clears the entry of the deleted folder (exit ${r10.status}) ${r10.stderr.trim()}`);
  check(!listed(app) && !branchOf('fix/charge') && git(REPO, 'log', '-1', '--format=%s').includes('fix/charge'), 'pr merge merged fix/charge and deleted the branch');

  if (!KEEP) {
    try { git(REPO, 'worktree', 'prune'); } catch { /* removed below anyway */ }
    fs.rmSync(REPO, { recursive: true, force: true });
  }
  console.log(`${failures ? 'FAILED' : 'ok'}: ${passes} checks passed, ${failures} failed`);
  process.exitCode = failures ? 1 : 0;
}

main();
