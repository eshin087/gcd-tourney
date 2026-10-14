#!/usr/bin/env node
// Push a slim copy of main to the private GitHub repo (no raw image generations).
//
//   npm run publish:github                    (local main -> GitHub main)
//   npm run publish:github -- --branch <name> (a local branch -> the same GitHub branch, e.g. for a PR)
//   npm run publish:github -- --full          (rebuild the publish cache first)
//
// The local repository keeps everything (raw ChatGPT/Codex images, several GB and growing). GitHub gets the
// same history minus art/**/raw/, _rejected/, _old/ and contact sheets, rewritten with git-filter-repo. The
// rewrite is deterministic, so every run produces the same commit ids for old commits and the push is a
// normal fast-forward.
//
// The publish cache: one bare repository at <main checkout>/.publish-cache/repo.git, shared by the main
// checkout, every worktree, Claude session and Codex thread (git-ignored, outside Vite's watch, safe to
// delete). It is a `git clone --shared`: it reads the main repository's objects in place instead of copying
// them (E: is exFAT, so hardlinks are not an option), and holds only the slim rewrites, a few MB. Original
// branches live in its refs/heads/, their rewrites in refs/publish/. A run fetches the branch (no object
// transfer), rewrites that one ref with --refs (partial mode: no gc or repack, ~1 s for the whole history)
// and pushes it. The old way, a full clone into os.tmpdir() plus gc on every run, took minutes to ~50 min.
// Why not filter-repo's incremental --state-branch mode: a commit rewritten in an earlier run is opaque to
// it, so it leaves the id in a revert's "This reverts commit <id>" untranslated and can't see pruned raw-only
// parents of a merge. Its ids would drift from a full rewrite, and the next rebuild (new cache, --full) could
// no longer fast-forward GitHub. So every run rewrites the whole branch, inside the cache.
// .publish-cache/publish.lock makes concurrent publishes wait their turn instead of sharing the cache.
// A missing or broken cache (e.g. the project moved, or main pruned objects it pointed at) is rebuilt;
// --full forces that.
// GCD_PUBLISH_REMOTE and GCD_PUBLISH_CACHE override the target and the cache folder (for tests).
// Needs: python with git-filter-repo (`python -m pip install git-filter-repo`).

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// The repository's shared .git, the same from the main checkout and from every worktree (as in tools/pr.mjs)
const GIT_DIR = execFileSync('git', ['rev-parse', '--path-format=absolute', '--git-common-dir'],
  { cwd: path.dirname(fileURLToPath(import.meta.url)) }).toString().trim();
const MAIN = path.dirname(GIT_DIR);
const CACHE = path.resolve(process.env.GCD_PUBLISH_CACHE || path.join(MAIN, '.publish-cache'));
const REPO = path.join(CACHE, 'repo.git');
const LOCK = path.join(CACHE, 'publish.lock');
const REMOTE = process.env.GCD_PUBLISH_REMOTE || 'https://github.com/eshin087/gcd-tourney.git';
const bi = process.argv.indexOf('--branch');
const BRANCH = bi > 0 && process.argv[bi + 1] ? process.argv[bi + 1] : 'main';
const FULL = process.argv.includes('--full');
const EXCLUDE = ['art/*/raw/*', 'art/*/_rejected/*', 'art/*/_old/*', 'art/*/contact/*'];
const PYTHON = process.platform === 'win32' ? 'python' : 'python3';
// A publish takes seconds plus the push, so a lock this old was left behind by a crash.
const STALE_MS = 2 * 60 * 60 * 1000;
const WAIT_MS = 60 * 60 * 1000;

// GIT_DIR in the environment too: filter-repo runs plain `git` commands, and a bare repository found only
// through the working directory is refused where safe.bareRepository=explicit.
const CACHE_ENV = { ...process.env, GIT_DIR: REPO };
const run = (cmd, args, opts = {}) => execFileSync(cmd, args, { stdio: ['ignore', 'pipe', 'inherit'], ...opts }).toString().trim();
const git = (args) => run('git', args, { env: CACHE_ENV });
const tryGit = (args) => { try { return execFileSync('git', args, { env: CACHE_ENV, stdio: 'pipe' }).toString().trim(); } catch { return null; } };
const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
const die = (msg) => { console.error(`[publish] ${msg}`); process.exit(1); };

try {
  run('git', ['rev-parse', '--verify', '--quiet', `refs/heads/${BRANCH}^{commit}`], { cwd: MAIN, stdio: 'pipe' });
} catch { die(`no local branch ${BRANCH}`); }
try { run(PYTHON, ['-m', 'git_filter_repo', '--version'], { stdio: 'pipe' }); } catch {
  die(`git-filter-repo is missing: ${PYTHON} -m pip install git-filter-repo`);
}

// One publish at a time: the lock file is created exclusively, and a waiting run polls until it is gone.
// It sits outside repo.git so a rebuild can delete the repository while holding it.
let held = false;
function lock() {
  fs.mkdirSync(CACHE, { recursive: true });
  const me = JSON.stringify({ pid: process.pid, host: os.hostname(), branch: BRANCH, since: new Date().toISOString() });
  const start = Date.now();
  let told = false;
  for (;;) {
    try { fs.writeFileSync(LOCK, me, { flag: 'wx' }); held = true; return; } catch (e) { if (e.code !== 'EEXIST') throw e; }
    let text, age;
    try { text = fs.readFileSync(LOCK, 'utf8'); age = Date.now() - fs.statSync(LOCK).mtimeMs; } catch { continue; } // just released
    let other = null;
    try { other = JSON.parse(text); } catch { /* still being written, or left empty by a crash */ }
    const dead = other ? other.host === os.hostname() && !alive(other.pid) : age > 60_000;
    if (dead || age > STALE_MS) {
      // re-read right before deleting, so a lock another waiter has just taken over is not removed
      try {
        if (fs.readFileSync(LOCK, 'utf8') === text) {
          console.warn(`[publish] removing a stale lock (${other ? `pid ${other.pid}, ${other.branch}, since ${other.since}` : 'empty'})`);
          fs.rmSync(LOCK, { force: true });
        }
      } catch { /* already gone */ }
      continue;
    }
    if (Date.now() - start > WAIT_MS) die(`still locked after ${WAIT_MS / 60000} min by ${text}; delete ${LOCK} if no publish is running`);
    if (!told) console.log(`[publish] waiting for another publish to finish (${other ? `${other.branch}, pid ${other.pid}` : 'starting'})`);
    told = true;
    sleep(1000);
  }
}
function alive(pid) {
  try { process.kill(pid, 0); return true; } catch (e) { return e.code === 'EPERM'; }
}
function unlock() {
  if (!held) return;
  held = false;
  try { if (JSON.parse(fs.readFileSync(LOCK, 'utf8')).pid === process.pid) fs.rmSync(LOCK, { force: true }); } catch { /* gone */ }
}
process.on('exit', unlock);
for (const sig of ['SIGINT', 'SIGTERM', 'SIGHUP']) process.on(sig, () => process.exit(130));

// The marker is set last, so a build that was interrupted counts as missing. A dead link to the main objects
// (folder moved, cache copied elsewhere) would only fail after a slow fetch attempt, so check it up front.
function usable() {
  if (!fs.existsSync(path.join(REPO, 'HEAD')) || tryGit(['config', '--get', 'gcd.publishcache']) !== '1') return false;
  const objects = path.join(REPO, 'objects');
  try {
    const shared = fs.readFileSync(path.join(objects, 'info', 'alternates'), 'utf8').trim();
    return fs.existsSync(path.join(path.resolve(objects, shared), 'pack'));
  } catch { return false; }
}

function rebuild() {
  console.log(`[publish] building the publish cache in ${REPO}`);
  fs.rmSync(REPO, { recursive: true, force: true, maxRetries: 3 });
  run('git', ['clone', '-q', '--bare', '--shared', '--no-tags', '--single-branch', '--branch', BRANCH, GIT_DIR, REPO]);
  // Point at the main objects relatively, so the pair survives the project folder moving or being renamed.
  const objects = path.join(REPO, 'objects');
  const shared = path.relative(objects, path.join(GIT_DIR, 'objects')).replace(/\\/g, '/');
  fs.writeFileSync(path.join(objects, 'info', 'alternates'), shared + '\n');
  // No automatic gc or maintenance: tidy() rolls up the small packs the rewrites add.
  git(['config', 'gc.auto', '0']);
  git(['config', 'maintenance.auto', 'false']);
  git(['symbolic-ref', 'HEAD', 'refs/heads/main']);
  git(['config', 'gcd.publishCache', '1']);
}

// Fetch the branch, rewrite the whole of it into refs/publish/<branch> and check the result.
function rewrite() {
  git(['fetch', '-q', '--no-tags', '--update-head-ok', GIT_DIR, `+refs/heads/${BRANCH}:refs/heads/${BRANCH}`]);
  git(['update-ref', `refs/publish/${BRANCH}`, `refs/heads/${BRANCH}`]);
  // the previous run's metadata; a day-old already_ran file makes filter-repo stop and ask on stdin
  fs.rmSync(path.join(REPO, 'filter-repo'), { recursive: true, force: true });
  run(PYTHON, ['-m', 'git_filter_repo', '--force', '--quiet', '--invert-paths',
    ...EXCLUDE.flatMap((g) => ['--path-glob', g]), '--refs', `refs/publish/${BRANCH}`], { cwd: REPO, env: CACHE_ENV });
  const slim = git(['rev-parse', `refs/publish/${BRANCH}`]);
  // never push raw art: git pathspecs match `*` across folders, like filter-repo's --path-glob
  const leak = git(['log', '-1', '--format=%h', slim, '--', ...EXCLUDE]);
  if (leak) throw new Error(`the rewrite of ${BRANCH} still has excluded files (commit ${leak})`);
  return slim;
}

// Drop cache refs of branches that are gone locally (merged PRs), then roll up the small packs that each
// rewrite adds. -l leaves the main repository's objects where they are.
function tidy() {
  const live = new Set(run('git', ['for-each-ref', '--format=%(refname:short)', 'refs/heads/'], { cwd: MAIN }).split('\n'));
  for (const ref of git(['for-each-ref', '--format=%(refname)', 'refs/heads/', 'refs/publish/']).split('\n').filter(Boolean)) {
    if (!live.has(ref.replace(/^refs\/(heads|publish)\//, ''))) git(['update-ref', '-d', ref]);
  }
  const packs = fs.readdirSync(path.join(REPO, 'objects', 'pack')).filter((f) => f.endsWith('.pack'));
  // bitmaps need every object in one pack, which -l rules out
  if (packs.length > 20) git(['-c', 'repack.writeBitmaps=false', 'repack', '-a', '-d', '-l', '-q']);
}

lock();
try {
  const t0 = Date.now();
  let fresh = FULL || !usable();
  if (fresh) rebuild();
  let slim;
  try {
    slim = rewrite();
  } catch (e) {
    if (fresh) throw e;
    console.warn(`[publish] the publish cache failed (${String(e.message).split('\n')[0]}); rebuilding it`);
    rebuild();
    fresh = true;
    slim = rewrite();
  }
  execFileSync('git', ['push', REMOTE, `refs/publish/${BRANCH}:refs/heads/${BRANCH}`], { env: CACHE_ENV, stdio: 'inherit' });
  try { tidy(); } catch (e) { console.warn(`[publish] cache housekeeping skipped: ${String(e.message).split('\n')[0]}`); }
  const secs = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`published ${BRANCH} (${slim.slice(0, 7)}) to ${REMOTE} without raw art in ${secs} s` +
    (fresh ? ' (built the publish cache)' : ''));
} finally {
  unlock();
}
