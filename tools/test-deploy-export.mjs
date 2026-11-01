#!/usr/bin/env node
// Regression test for the deploy export (TOOL-052, tools/export-head.mjs) and its clean-up (TOOL-053, tools/scratch-dir.mjs,
// tools/rm-later.mjs).
//   node tools/test-deploy-export.mjs   (part of `npm run test:guard`; add --keep to keep tools/.test-fixtures/deploy-export/)
// Builds a throw-away repository with a sparse worktree like `pr start` makes (raw/ outside the sparse definition) and
// exports HEAD from both checkouts: on 2026-10-16 `git rm --cached art` skipped the sparse paths in a worktree, every raw
// PNG reached the export and each Luffy preview deploy left 4.9 GB on C:. Then exports Windows still held locked when
// the deploy ended waited for the next deploy's sweep: 29 GB in E:gcd-scratch.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { EXCLUDE, changedReviewFiles, exportTree } from './export-head.mjs';
import { DEFAULT_MAX_MB, checkDeploySize, formatSize, maxMb } from './deploy-size.mjs';
import { SPARSE } from './sparse-art.mjs';
import { isScratchCopy, removeCopy, scratchDir, sweepStale } from './scratch-dir.mjs';

const TOOL_DIR = path.dirname(fileURLToPath(import.meta.url));
const BASE = path.join(TOOL_DIR, '.test-fixtures', 'deploy-export');
const REPO = path.join(BASE, 'repo');
const WT = path.join(BASE, 'wt');
const KEEP = process.argv.includes('--keep');
let failures = 0, passes = 0;
const check = (ok, msg) => { if (ok) passes++; else { failures++; console.log(`  FAIL ${msg}`); } };

const git = (cwd, ...a) => execFileSync('git', a, { cwd, stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim();
const put = (rel, data = 'x\n') => { const f = path.join(REPO, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, data); };
const files = (dir) => fs.readdirSync(dir, { recursive: true, withFileTypes: true }).filter((e) => e.isFile())
  .map((e) => path.relative(dir, path.join(e.parentPath ?? e.path, e.name)).split(path.sep).join('/')).sort();

function buildRepo() {
  fs.rmSync(BASE, { recursive: true, force: true });
  fs.mkdirSync(REPO, { recursive: true });
  git(REPO, 'init', '-q', '-b', 'main');
  git(REPO, 'config', 'user.email', 'deploy@test'); git(REPO, 'config', 'user.name', 'deploy test'); git(REPO, 'config', 'core.autocrlf', 'false');
  put('package.json', '{ "name": "deploy-fixture", "private": true }\n');
  put('src/game/code.js', 'export const x = 1;\n');
  put('public/characters/naruto/sheet.png');
  put('artwork.md', 'not art/: must ship\n');
  put('art/manifest.json', '{}\n');
  put('art/characters/naruto/hitboxes.json', '{}\n');
  put('art/characters/naruto/raw/idle_v01.png');
  put('art/characters/naruto/raw/_rejected/run_v01.png');
  put('art/crowd/raw/fan_v01.png');
  put('art/vfx/raw/glow_v01.png');
  // review material under public/ ships with Vite's copy of public/ unless the export leaves it out (2026-11-01)
  put('public/reviews/beam-clash-r1/01.png');
  put('public/art-review/review.json', '{}\n');
  put('public/art-reviewed.txt', 'not public/art-review/: must ship\n');
  git(REPO, 'add', '-A'); git(REPO, 'commit', '-q', '-m', 'main');
  // the sparse worktree `pr start` makes: everything but raw/
  git(REPO, 'worktree', 'add', '-q', '--no-checkout', '-b', 'art/x', WT);
  git(WT, 'sparse-checkout', 'set', '--no-cone', ...SPARSE);
  git(WT, 'checkout', '-q');
}

function exportOf(root, name) {
  const dest = path.join(BASE, name);
  fs.mkdirSync(dest, { recursive: true });
  let err = null, n = 0;
  try { n = exportTree({ root, dest, index: path.join(BASE, `${name}.index`) }); } catch (e) { err = e; }
  return { dest, n, err, files: err ? [] : files(dest) };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function cleanup() {
  // a scratch folder of our own, so nothing real is swept
  const SCR = path.join(BASE, 'scratch');
  process.env.GCD_SCRATCH_DIR = SCR;
  process.env.GCD_RM_LATER_INTERVAL_MS = '300';
  process.env.GCD_RM_LATER_TIMEOUT_MS = '20000';
  check(path.resolve(scratchDir()) === path.resolve(SCR), 'GCD_SCRATCH_DIR picks the scratch folder');
  const copy = (name) => { const d = path.join(SCR, name); fs.mkdirSync(path.join(d, 'sub'), { recursive: true }); fs.writeFileSync(path.join(d, 'sub', 'f'), 'x'); return d; };

  // only a tool's own copy directly in a scratch root may be deleted
  check(isScratchCopy(path.join(SCR, 'gcd-deploy-AbC123')) && isScratchCopy(path.join(SCR, 'gcd-deploy-77.index')), 'isScratchCopy: an export and its index file');
  check(!isScratchCopy(path.join(SCR, 'other')) && !isScratchCopy(SCR) && !isScratchCopy(path.join(SCR, 'x', 'gcd-deploy-AbC123'))
    && !isScratchCopy(path.join(REPO, 'gcd-deploy-AbC123')), 'isScratchCopy: not another name, the folder itself, a nested copy or a copy elsewhere');
  const keep = path.join(BASE, 'gcd-deploy-notscratch');
  fs.mkdirSync(keep, { recursive: true });
  const refused = spawnSync(process.execPath, [path.join(TOOL_DIR, 'rm-later.mjs'), keep], { encoding: 'utf8' });
  check(refused.status === 2 && fs.existsSync(keep), `rm-later refuses a path outside the scratch folder (exit ${refused.status})`);

  // the sweep: copies older than an hour go, a fresh one (a deploy running now) stays
  const old = copy('gcd-deploy-old111'), fresh = copy('gcd-art-guard-new222');
  const hourAgo = new Date(Date.now() - 2 * 60 * 60 * 1000); fs.utimesSync(old, hourAgo, hourAgo);
  const swept = sweepStale({ log: () => {} });
  check(!fs.existsSync(old) && fs.existsSync(fresh) && swept.length === 1, `sweepStale removes only the stale copy (${swept})`);
  check(removeCopy(fresh).removed && !fs.existsSync(fresh), 'removeCopy deletes an unlocked copy at once');

  // a locked export (a process whose cwd is inside it: Windows refuses to delete it) is left to rm-later, which deletes
  // it once the lock is gone
  if (process.platform === 'win32') {
    const locked = copy('gcd-deploy-lock333');
    const holder = spawn(process.execPath, ['-e', 'setTimeout(() => {}, 2500)'], { cwd: path.join(locked, 'sub'), stdio: 'ignore' });
    await sleep(300);
    const r = removeCopy(locked, { tries: 1, retryDelay: 50 });
    check(!r.removed && r.later && /^E[A-Z]+$/.test(String(r.code)), `removeCopy hands a locked copy to rm-later with its error code (${JSON.stringify(r)})`);
    let gone = false;
    for (let i = 0; i < 40 && !gone; i++) { await sleep(500); gone = !fs.existsSync(locked); }
    check(gone, 'rm-later deletes the copy once the lock is released');
    holder.kill();
  }
}

function main() {
  buildRepo();
  check(!fs.existsSync(path.join(WT, 'art/characters/naruto/raw/idle_v01.png')) && fs.existsSync(path.join(WT, 'art/characters/naruto/hitboxes.json')),
    'the fixture worktree is sparse: raw/ is outside the checkout, other art is on disk');
  const want = ['artwork.md', 'package.json', 'public/art-reviewed.txt', 'public/characters/naruto/sheet.png', 'src/game/code.js'];

  // the old way (read-tree + git rm --cached art) leaks raw/ in the sparse worktree: proves the fixture reproduces the bug
  const oldIdx = path.join(BASE, 'old.index'), env = { ...process.env, GIT_INDEX_FILE: oldIdx };
  execFileSync('git', ['read-tree', 'HEAD'], { cwd: WT, env });
  execFileSync('git', ['rm', '--cached', '-r', '-q', '--ignore-unmatch', 'art'], { cwd: WT, env });
  const left = execFileSync('git', ['ls-files', '--', 'art'], { cwd: WT, env }).toString().split('\n').filter(Boolean);
  check(left.length > 0, `the old export kept art/ in a sparse worktree (${left.length} path(s) left); the fixture no longer reproduces the bug`);

  for (const [root, name] of [[REPO, 'main'], [WT, 'sparse']]) {
    const r = exportOf(root, name);
    check(!r.err, `${name}: export succeeds (${r.err?.message})`);
    const out = r.files.filter((f) => EXCLUDE.some((e) => f.startsWith(e + '/')));
    check(out.length === 0, `${name}: no art/, public/reviews/ or public/art-review/ in the export (${out})`);
    check(JSON.stringify(r.files) === JSON.stringify(want), `${name}: the export is exactly the committed tree minus the excluded paths (${r.files})`);
    check(r.n === want.length, `${name}: exportTree counts ${r.n} files`);
  }

  // the guard: anything under an excluded path in the destination makes exportTree throw before a deploy can use it
  for (const [i, e] of EXCLUDE.entries()) {
    const g = path.join(BASE, `guard${i}`);
    fs.mkdirSync(path.join(g, ...e.split('/')), { recursive: true });
    fs.writeFileSync(path.join(g, ...e.split('/'), 'stray.png'), 'x');
    let threw = false;
    try { exportTree({ root: REPO, dest: g, index: path.join(BASE, `guard${i}.index`) }); } catch { threw = true; }
    check(threw, `exportTree refuses an export that holds ${e}/`);
  }
}

// TOOL-067: a preview carries the review files its branch changed and nothing else under the review folders
function previewReviews() {
  git(REPO, 'switch', '-q', '-c', 'review/batch');
  put('public/reviews/new-batch/index.html', '<!doctype html>\n');
  put('public/reviews/new-batch/01.png');
  put('public/art-review/new-item.png');
  git(REPO, 'add', '-A'); git(REPO, 'commit', '-q', '-m', 'review batch');
  const changed = changedReviewFiles({ root: REPO, rev: 'HEAD', base: 'main' }).sort();
  const wantChanged = ['public/art-review/new-item.png', 'public/art-review/review.json', 'public/reviews/new-batch/01.png',
    'public/reviews/new-batch/index.html'];
  check(JSON.stringify(changed) === JSON.stringify(wantChanged), `changedReviewFiles: the branch's review files plus the catalog (${changed})`);
  check(changedReviewFiles({ root: REPO, rev: 'main', base: 'main' }).length === 0, 'changedReviewFiles: main itself changes nothing');

  const r = exportOf(REPO, 'preview');
  check(!r.err, `preview-less export of the review branch succeeds (${r.err?.message})`);
  check(!r.files.some((f) => f.startsWith('public/reviews/') || f.startsWith('public/art-review/')), 'without include, no review file ships');
  const dest = path.join(BASE, 'preview-inc');
  fs.mkdirSync(dest, { recursive: true });
  let err = null;
  try { exportTree({ root: REPO, dest, index: path.join(BASE, 'preview-inc.index'), include: changed }); } catch (e) { err = e; }
  check(!err, `export with the branch's review files succeeds (${err?.message})`);
  const got = err ? [] : files(dest);
  check(wantChanged.every((f) => got.includes(f)), 'the preview holds every review file the branch changed');
  check(!got.includes('public/reviews/beam-clash-r1/01.png'), 'the preview leaves out review batches the branch did not touch');
  check(!got.some((f) => f.startsWith('art/')), 'art/ never ships, even in a preview');

  let threw = false;
  try { exportTree({ root: REPO, dest: path.join(BASE, 'bad-inc'), index: path.join(BASE, 'bad-inc.index'), include: ['art/manifest.json'] }); } catch { threw = true; }
  check(threw, 'include refuses a path under art/');
  threw = false;
  try { exportTree({ root: REPO, dest: path.join(BASE, 'bad-inc2'), index: path.join(BASE, 'bad-inc2.index'), include: ['public/reviews'] }); } catch { threw = true; }
  check(threw, 'include refuses a whole review folder (only paths inside it)');
  git(REPO, 'switch', '-q', 'main');
}

// TOOL-067: the size guard measures the build output and names the largest folders when it refuses
function sizeGuard() {
  const out = path.join(BASE, 'output');
  fs.mkdirSync(path.join(out, 'static', 'characters', 'naruto'), { recursive: true });
  fs.mkdirSync(path.join(out, 'static', 'reviews', 'big'), { recursive: true });
  fs.writeFileSync(path.join(out, 'static', 'characters', 'naruto', 'sheet.png'), Buffer.alloc(1024 * 1024));
  fs.writeFileSync(path.join(out, 'static', 'reviews', 'big', 'clip.mp4'), Buffer.alloc(3 * 1024 * 1024));
  const ok = checkDeploySize(out, { limit: 10 });
  check(ok.ok && Math.abs(ok.mb - 4) < 0.01, `checkDeploySize: 4 MB under a 10 MB limit passes (${ok.mb})`);
  const bad = checkDeploySize(out, { limit: 2 });
  check(!bad.ok && bad.top[0].dir === 'static/reviews', `checkDeploySize: over the limit, the largest folder comes first (${bad.top[0]?.dir})`);
  const text = formatSize(bad).join('\n');
  check(/REFUSED/.test(text) && text.includes('static/reviews'), 'formatSize: a refusal says so and names the folder');
  check(maxMb({}) === DEFAULT_MAX_MB && maxMb({ GCD_DEPLOY_MAX_MB: '400' }) === 400 && maxMb({ GCD_DEPLOY_MAX_MB: 'x' }) === DEFAULT_MAX_MB,
    'maxMb: default, override, and junk falls back to the default');
  check(checkDeploySize(path.join(BASE, 'missing')).mb === 0, 'checkDeploySize: a missing folder is 0 MB');
}

try { main(); previewReviews(); sizeGuard(); await cleanup(); } catch (e) { failures++; console.log(`  FAIL crashed: ${e.stack}`); }
finally {
  if (!KEEP) {
    try { git(REPO, 'worktree', 'remove', '--force', WT); } catch { /* already gone */ }
    fs.rmSync(BASE, { recursive: true, force: true });
  }
}
console.log(`deploy export: ${passes} passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
