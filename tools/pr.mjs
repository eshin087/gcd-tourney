#!/usr/bin/env node
// Feature branches as pull requests, without touching the shared working copy (ADR 0013).
//
//   npm run pr -- start <branch> [--art <id>[,<id>]] [--full] [--no-install]   new worktree + branch off main in .worktrees/<branch>
//   npm run pr -- art <id>[,<id>]           (inside a sparse worktree) check out more raw art there, and verify it is on disk
//   npm run pr -- open [--title "..."]      (inside the worktree) publish the branch slim + open the GitHub PR
//   npm run pr -- preview                   (inside the worktree) deploy the branch to a Vercel preview, link it in the PR
//   npm run pr -- merge <branch> [--no-deploy] [--force-art "<reason>"]  (in the main checkout) art guard, merge --no-ff,
//                                           publish main, remove the worktree, deploy main to production
//   npm run pr -- check <branch>            (anywhere) the art guard alone, read-only: what `merge` would refuse (tools/pr-guard.mjs)
//   npm run pr -- prune [--dry-run]         (in the main checkout) remove clean worktrees whose branch is merged
//
// Why worktrees: Claude sessions and Codex share the main checkout, so `git checkout` there would yank files
// out from under the others. Each feature lives in its own folder and branch; main only receives merges.
// Why --no-ff: one merge commit per feature, so `git revert -m 1 <merge>` undoes the whole feature.
// Why merge locally instead of `gh pr merge`: GitHub holds a filter-repo rewrite of local main
// (tools/publish.mjs); a merge commit made on GitHub would make the next publish non-fast-forward.
// Publishing main after the local merge makes GitHub mark the PR merged.
// Code worktrees skip raw image generations (~2 GB, same globs as publish.mjs). Art work adds back only the raw
// art it needs with --art (a character id like naruto, or an art/ folder like vfx or crowd), so a worktree stays
// a few hundred MB; --full copies the whole art library and is a last resort. Never copy the project folder
// by hand instead of making a worktree: seven such copies once filled 15 GB.

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkArt, formatReport, forceReason, overrideMessage, positionalArg, resolveHead, worktreeHolding } from './pr-guard.mjs';
import { SPARSE, artFolders, folderPatterns, mangledPatterns, rawGaps, sparsePatterns } from './sparse-art.mjs';

// The main checkout, wherever this copy of the script lives (it also runs from inside a worktree).
const ROOT = path.dirname(execFileSync('git', ['rev-parse', '--path-format=absolute', '--git-common-dir'],
  { cwd: path.dirname(fileURLToPath(import.meta.url)) }).toString().trim());
const REPO = 'eshin087/gcd-tourney';
const PREFIXES = ['feature/', 'fix/', 'art/', 'docs/', 'chore/'];

const [cmd, ...rest] = process.argv.slice(2);
const flag = (name) => rest.includes(name);
const opt = (name) => { const i = rest.indexOf(name); return i >= 0 ? rest[i + 1] : undefined; };
const positional = positionalArg(rest);

const git = (args, cwd = ROOT, inherit = false) =>
  execFileSync('git', args, { cwd, stdio: inherit ? 'inherit' : ['ignore', 'pipe', 'inherit'] })?.toString().trim();
// Only npm needs a shell on Windows (npm.cmd); node and gh run directly so paths with spaces stay intact.
const sh = (file, args, cwd = ROOT) => execFileSync(file === 'node' ? process.execPath : file, args,
  { cwd, stdio: 'inherit', shell: file === 'npm' && process.platform === 'win32' });
const die = (msg) => { console.error(`[pr] ${msg}`); process.exit(1); };
// Inside the project so it is one folder; .gitignore and vite.config.js keep git and the dev server out of it.
const worktreeDir = (branch) => path.join(ROOT, '.worktrees', branch.replace(/\//g, '-'));
const currentBranch = (cwd = ROOT) => git(['rev-parse', '--abbrev-ref', 'HEAD'], cwd);

function start() {
  const branch = positional;
  if (!branch || !PREFIXES.some((p) => branch.startsWith(p))) die(`usage: pr start <${PREFIXES.join('|')}name> [--art <id>[,<id>]] [--full] [--no-install]`);
  const folders = artFolders(ROOT, opt('--art'));
  const dir = worktreeDir(branch);
  if (fs.existsSync(dir)) die(`${dir} already exists`);
  git(['worktree', 'add', '--no-checkout', '-b', branch, dir, 'main'], ROOT, true);
  if (flag('--full')) {
    console.warn('[pr] --full checks out the whole ~2 GB art library; prefer --art <id> for one character or art kind');
  } else {
    // later patterns win, so the re-included folders bring back their raw/ that SPARSE excluded
    git(['sparse-checkout', 'set', '--no-cone', ...SPARSE, ...folderPatterns(folders)], dir, true);
  }
  git(['checkout', branch], dir, true);
  verifyArt(dir, folders);
  if (flag('--no-install')) console.log('[pr] skipped npm ci (--no-install)');
  else {
    console.log('[pr] installing dependencies');
    sh('npm', ['ci', '--prefer-offline', '--no-audit', '--no-fund'], dir);
  }
  console.log(`[pr] ready: ${dir}\n[pr] work and commit there, then run \`npm run pr -- open\` from that folder.`);
}

// Proof, not hope (TOOL-048): every tracked raw/ file of the --art folders is on disk. A worktree that silently lacks
// art/vfx/raw/ packs an atlas without the effects whose raws are missing, and that atlas then gets committed.
function verifyArt(dir, folders) {
  const bad = mangledPatterns(sparsePatterns(dir));
  if (bad.length) console.warn(`[pr] sparse-checkout patterns that match nothing (a shell rewrote the leading /): ${bad.join(', ')}`);
  const gaps = rawGaps(dir, folders);
  for (const g of gaps) if (!g.skipped.length) console.log(`[pr] ${g.folder}/raw/: ${g.tracked} tracked file(s) on disk`);
  const missing = gaps.filter((g) => g.skipped.length);
  if (missing.length) {
    die(`raw art is not checked out: ${missing.map((g) => `${g.folder}/raw/ (${g.skipped.length} of ${g.tracked} file(s) missing, e.g. ${g.skipped[0]})`).join('; ')}. ` +
      'Run `npm run pr -- art <id>` inside the worktree; do not pack until it passes');
  }
}

// Bring more raw art into an existing sparse worktree (one recreated without --art, or a task that grew), the same
// patterns `start --art` writes. `git sparse-checkout add art/x` by hand misses raw/, and typed in Git Bash a leading
// /art/... becomes C:/Program Files/Git/art/..., which matches nothing.
function art() {
  const list = positional;
  if (!list) die('usage: pr art <id>[,<id>]   (inside the worktree; a character id like naruto, or an art/ folder like vfx)');
  const cwd = git(['rev-parse', '--show-toplevel'], process.cwd());
  if (path.resolve(cwd) === path.resolve(ROOT)) die('run this inside a sparse feature worktree; the main checkout has all the art');
  const folders = artFolders(ROOT, list);
  const current = sparsePatterns(cwd);
  if (!current.length) {
    console.log('[pr] this worktree is not sparse: all art is already checked out');
  } else {
    if (!current.some((p) => p.startsWith('!'))) die('this worktree uses cone-mode sparse checkout; recreate it with `npm run pr -- start --art`');
    const wanted = folderPatterns(folders);
    const kept = current.filter((p) => !mangledPatterns([p]).length);
    if (kept.length < current.length) console.log(`[pr] dropping pattern(s) a shell rewrote: ${mangledPatterns(current).join(', ')}`);
    const add = wanted.filter((p) => !kept.includes(p));
    if (add.length || kept.length < current.length) git(['sparse-checkout', 'set', '--no-cone', ...kept, ...add], cwd, true);
    else console.log('[pr] the sparse patterns already include ' + folders.join(', '));
  }
  verifyArt(cwd, folders);
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

// A Vercel preview of the branch's committed work (tools/deploy.mjs --preview), linked in a PR comment, so the
// user can try it on a phone before saying merge (ADR 0018). The live site is untouched.
function preview() {
  const branch = currentBranch(process.cwd());
  if (branch === 'main') die('run this inside a PR worktree; main deploys with `npm run deploy`');
  const cwd = git(['rev-parse', '--show-toplevel'], process.cwd());
  const out = execFileSync(process.execPath, [path.join(cwd, 'tools', 'deploy.mjs'), '--preview'], { cwd, stdio: ['ignore', 'pipe', 'inherit'] }).toString();
  process.stdout.write(out);
  const url = (out.match(/PREVIEW_URL=(\S+)/) || [])[1];
  if (!url) die('no preview URL in the deploy output');
  const pr = execFileSync('gh', ['pr', 'list', '--repo', REPO, '--head', branch, '--json', 'number', '--jq', '.[0].number']).toString().trim();
  if (!pr) { console.log(`[pr] preview: ${url} (no PR for ${branch} yet: run \`npm run pr -- open\`)`); return; }
  const head = git(['rev-parse', '--short', 'HEAD'], cwd);
  execFileSync('gh', ['pr', 'comment', pr, '--repo', REPO, '--body', `Preview of ${head}: ${url}\n\nThe test lab is at ${url}/lab.html once it ships.`], { stdio: 'inherit' });
  console.log(`[pr] preview linked on #${pr}: ${url}`);
}

function merge() {
  const branch = positional;
  if (!branch) die('usage: pr merge <branch>');
  if (currentBranch() !== 'main') die('the main checkout is not on main');
  let reason;
  try { reason = forceReason(rest); } catch (e) { die(e.message); }
  // Conflicts get resolved in the feature worktree (git merge main there), never on main.
  let tree;
  try {
    tree = execFileSync('git', ['merge-tree', '--write-tree', 'main', branch], { cwd: ROOT, stdio: 'pipe' }).toString().split('\n')[0].trim();
  } catch {
    die(`${branch} conflicts with main: run \`git merge main\` in its worktree, resolve, commit, \`npm run pr -- open\`, retry`);
  }
  // Fighter art ships by what the packer finds, not by what the user approved (TOOL-028): judge the merge result first.
  const guard = checkArt({ root: ROOT, base: 'main', head: tree });
  formatReport(guard, branch).forEach((l) => console.log(l));
  let message = [];
  if (!guard.ok) {
    if (!reason) die(`art guard refused ${branch}: fix the strips above, or override with --force-art "<reason>" (the reason goes into the merge commit)`);
    message = overrideMessage(branch, reason, guard).flatMap((m) => ['-m', m]);
    console.warn(`[pr] --force-art: merging despite ${guard.refusals.length} refusal(s); the reason is recorded in the merge commit`);
  } else if (reason) console.log('[pr] --force-art was not needed: the art guard passed');
  try {
    git(['merge', '--no-ff', ...(message.length ? message : ['--no-edit']), branch], ROOT, true);
  } catch {
    die('merge refused: another session has uncommitted edits on main in files this branch changes. ' +
      'Ask it to commit or move them to its own branch, then retry.');
  }
  // read right after the merge: another agent's commit landing on main during the publish must not become the revert hint
  const mergeCommit = git(['rev-parse', '--short', 'HEAD']);
  // A failed publish (GitHub unreachable, a non-fast-forward) does not undo the merge: say so, then finish the cleanup and
  // the deploy instead of stopping half way (TOOL-038)
  let published = true;
  try { sh('node', [path.join(ROOT, 'tools', 'publish.mjs')], ROOT); } catch {
    published = false;
    console.warn('[pr] merged, but the GitHub publish failed (see above): GitHub shows the PR open until `npm run publish:github` succeeds');
  }
  const dir = worktreeDir(branch);
  if (fs.existsSync(dir)) {
    try { git(['worktree', 'remove', dir], ROOT, true); } catch { console.warn(`[pr] left ${dir}: git could not remove it (uncommitted files, or a file still open there); \`git worktree remove\` it later`); }
  }
  const holder = worktreeHolding(git(['worktree', 'list', '--porcelain']), branch);
  if (holder) console.log(`[pr] kept branch ${branch}: it is checked out in ${holder} (delete it once that worktree is done)`);
  else {
    try { execFileSync('git', ['branch', '-d', branch], { cwd: ROOT, stdio: 'pipe' }); } catch (e) {
      console.warn(`[pr] kept branch ${branch}: ${String(e.stderr || e.message).trim().split('\n')[0]}`);
    }
  }
  // The user's call (2026-10-10): a merge should be live, not only on GitHub. Vercel isn't wired to the slim
  // GitHub copy, so the merge deploys the merged main itself. A failed deploy never undoes the merge.
  if (flag('--no-deploy')) console.log('[pr] skipped the production deploy (--no-deploy): run `npm run deploy` when ready');
  else {
    try { sh('node', [path.join(ROOT, 'tools', 'deploy.mjs')], ROOT); } catch {
      console.warn(`[pr] merged${published ? ' and published' : ''}, but the production deploy failed: run \`npm run deploy\` from the main checkout`);
    }
  }
  console.log(`[pr] merged ${branch}. Revert later with: git revert -m 1 ${mergeCommit}`);
}

// The art guard alone, read-only: what `merge` would refuse for this branch right now (main + branch, no checkout needed).
function check() {
  const branch = positional;
  if (!branch) die('usage: pr check <branch>');
  const { head, base, merged } = resolveHead(ROOT, 'main', branch);
  if (!merged) console.warn(`[pr] ${branch} does not merge cleanly into main (docs conflicts are normal for a stale branch; \`merge\` will refuse until they are resolved): judging the merge result anyway`);
  const guard = checkArt({ root: ROOT, base, head });
  formatReport(guard, branch).forEach((l) => console.log(l));
  process.exitCode = guard.ok ? 0 : 1;
}

// Worktrees outlive their branch when a merge could not remove them (a session was still inside, or a branch
// was merged some other way). Remove the clean ones; anything with uncommitted work stays and is listed.
// Folders in .worktrees/ that are not git worktrees (hand-made copies) are only reported, never deleted.
function prune() {
  if (currentBranch() !== 'main') die('run this in the main checkout');
  const dry = flag('--dry-run');
  // "merged" = the branch tip is a merged-in parent of a merge commit on main (what `pr merge` makes);
  // `git branch --merged` would also count a just-started branch with no commits yet
  const mergedTips = new Set(git(['rev-list', '--merges', '--parents', 'main']).split('\n')
    .flatMap((line) => line.split(' ').slice(2)));
  const merged = new Set(git(['for-each-ref', '--format=%(refname:short) %(objectname)', 'refs/heads/']).split('\n')
    .map((line) => line.split(' ')).filter(([, sha]) => mergedTips.has(sha)).map(([name]) => name));
  const trees = git(['worktree', 'list', '--porcelain']).split(/\n\n+/).map((block) => ({
    dir: path.resolve((block.match(/^worktree (.+)$/m) || [])[1] || ''),
    branch: (block.match(/^branch refs\/heads\/(.+)$/m) || [])[1],
  })).filter((t) => t.branch && t.dir !== path.resolve(ROOT));
  for (const t of trees) {
    if (!merged.has(t.branch)) continue;
    const dirty = git(['status', '--porcelain'], t.dir);
    if (dirty) { console.warn(`[pr] kept ${t.dir}: ${t.branch} is merged but has uncommitted work`); continue; }
    if (dry) { console.log(`[pr] would remove ${t.dir} (${t.branch} merged)`); continue; }
    try {
      git(['worktree', 'remove', t.dir], ROOT, true);
      try { git(['branch', '-d', t.branch], ROOT, true); } catch { /* checked out elsewhere */ }
      console.log(`[pr] removed ${t.dir} (${t.branch} merged)`);
    } catch {
      console.warn(`[pr] could not remove ${t.dir} (a session or editor may have it open); retry later`);
    }
  }
  const known = new Set(trees.map((t) => t.dir));
  const base = path.join(ROOT, '.worktrees');
  for (const name of fs.existsSync(base) ? fs.readdirSync(base) : []) {
    const dir = path.join(base, name);
    if (fs.statSync(dir).isDirectory() && !known.has(path.resolve(dir))) {
      console.warn(`[pr] ${dir} is not a git worktree (a plain copy?); delete it by hand once its work is safe`);
    }
  }
}

({ start, art, open, preview, merge, check, prune }[cmd] || (() => die('usage: pr start|art|open|preview|merge|check|prune (see tools/pr.mjs)')))();
