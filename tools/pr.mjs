#!/usr/bin/env node
// Feature branches as pull requests, without touching the shared working copy (ADR 0013).
//
//   npm run pr -- start <branch> [--full]   new worktree + branch off main in ../gcdTourney-worktrees/<branch>
//   npm run pr -- open [--title "..."]      (inside the worktree) publish the branch slim + open the GitHub PR
//   npm run pr -- merge <branch>            (in the main checkout) merge --no-ff, publish main, remove the worktree
//
// Why worktrees: Claude sessions and Codex share the main checkout, so `git checkout` there would yank files
// out from under the others. Each feature lives in its own folder and branch; main only receives merges.
// Why --no-ff: one merge commit per feature, so `git revert -m 1 <merge>` undoes the whole feature.
// Why merge locally instead of `gh pr merge`: GitHub holds a filter-repo rewrite of local main
// (tools/publish.mjs); a merge commit made on GitHub would make the next publish non-fast-forward.
// Publishing main after the local merge makes GitHub mark the PR merged.
// Code worktrees skip raw image generations (~1.5 GB, same globs as publish.mjs); --full checks them out for art work.

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// The main checkout, wherever this copy of the script lives (it also runs from inside a worktree).
const ROOT = path.dirname(execFileSync('git', ['rev-parse', '--path-format=absolute', '--git-common-dir'],
  { cwd: path.dirname(fileURLToPath(import.meta.url)) }).toString().trim());
const REPO = 'eshin087/gcd-tourney';
const SPARSE = ['/*', '!/art/*/raw/', '!/art/*/*/raw/', '!/art/**/_rejected/', '!/art/**/_old/', '!/art/**/contact/'];
const PREFIXES = ['feature/', 'fix/', 'art/', 'docs/', 'chore/'];

const [cmd, ...rest] = process.argv.slice(2);
const flag = (name) => rest.includes(name);
const opt = (name) => { const i = rest.indexOf(name); return i >= 0 ? rest[i + 1] : undefined; };
const positional = rest.find((a, i) => !a.startsWith('--') && rest[i - 1] !== '--title');

const git = (args, cwd = ROOT, inherit = false) =>
  execFileSync('git', args, { cwd, stdio: inherit ? 'inherit' : ['ignore', 'pipe', 'inherit'] })?.toString().trim();
// Only npm needs a shell on Windows (npm.cmd); node and gh run directly so paths with spaces stay intact.
const sh = (file, args, cwd = ROOT) => execFileSync(file === 'node' ? process.execPath : file, args,
  { cwd, stdio: 'inherit', shell: file === 'npm' && process.platform === 'win32' });
const die = (msg) => { console.error(`[pr] ${msg}`); process.exit(1); };
const worktreeDir = (branch) => path.resolve(ROOT, '..', 'gcdTourney-worktrees', branch.replace(/\//g, '-'));
const currentBranch = (cwd = ROOT) => git(['rev-parse', '--abbrev-ref', 'HEAD'], cwd);

function start() {
  const branch = positional;
  if (!branch || !PREFIXES.some((p) => branch.startsWith(p))) die(`usage: pr start <${PREFIXES.join('|')}name> [--full]`);
  const dir = worktreeDir(branch);
  if (fs.existsSync(dir)) die(`${dir} already exists`);
  git(['worktree', 'add', '--no-checkout', '-b', branch, dir, 'main'], ROOT, true);
  if (!flag('--full')) {
    git(['sparse-checkout', 'set', '--no-cone', ...SPARSE], dir, true);
  }
  git(['checkout', branch], dir, true);
  console.log('[pr] installing dependencies');
  sh('npm', ['ci', '--prefer-offline', '--no-audit', '--no-fund'], dir);
  console.log(`[pr] ready: ${dir}\n[pr] work and commit there, then run \`npm run pr -- open\` from that folder.`);
}

function open() {
  const branch = currentBranch(process.cwd());
  if (branch === 'main') die('run this inside a feature worktree, not on main');
  const cwd = git(['rev-parse', '--show-toplevel'], process.cwd());
  const dirty = git(['status', '--porcelain', '--untracked-files=no'], cwd);
  if (dirty) console.warn('[pr] uncommitted changes are not part of the PR:\n' + dirty);
  sh('node', [path.join(cwd, 'tools', 'publish.mjs'), '--branch', branch], cwd);
  const existing = execFileSync('gh', ['pr', 'list', '--repo', REPO, '--head', branch, '--json', 'url', '--jq', '.[0].url'])
    .toString().trim();
  if (existing) { console.log(`[pr] updated ${existing}`); return; }
  const title = opt('--title') || git(['log', '-1', '--format=%s'], cwd);
  const log = git(['log', '--format=- %s', `main..${branch}`], cwd);
  const body = `${log}\n\nMerge with \`npm run pr -- merge ${branch}\` from the main checkout (not the GitHub button).` +
    `\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)`;
  sh('gh', ['pr', 'create', '--repo', REPO, '--base', 'main', '--head', branch, '--title', title, '--body', body], cwd);
}

function merge() {
  const branch = positional;
  if (!branch) die('usage: pr merge <branch>');
  if (currentBranch() !== 'main') die('the main checkout is not on main');
  // Conflicts get resolved in the feature worktree (git merge main there), never on main.
  try {
    execFileSync('git', ['merge-tree', '--write-tree', 'main', branch], { cwd: ROOT, stdio: 'pipe' });
  } catch {
    die(`${branch} conflicts with main: run \`git merge main\` in its worktree, resolve, commit, \`npm run pr -- open\`, retry`);
  }
  try {
    git(['merge', '--no-ff', '--no-edit', branch], ROOT, true);
  } catch {
    die('merge refused: another session has uncommitted edits on main in files this branch changes. ' +
      'Ask it to commit or move them to its own branch, then retry.');
  }
  sh('node', [path.join(ROOT, 'tools', 'publish.mjs')], ROOT);
  const dir = worktreeDir(branch);
  if (fs.existsSync(dir)) {
    try { git(['worktree', 'remove', dir], ROOT, true); } catch { console.warn(`[pr] left ${dir} (uncommitted files in it)`); }
  }
  try { git(['branch', '-d', branch], ROOT, true); } catch { /* still checked out somewhere */ }
  console.log(`[pr] merged ${branch}. Revert later with: git revert -m 1 ${git(['rev-parse', '--short', 'HEAD'])}`);
}

({ start, open, merge }[cmd] || (() => die('usage: pr start|open|merge (see tools/pr.mjs)')))();
