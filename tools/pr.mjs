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
//   npm run pr -- prune [--dry-run]         (in the main checkout) remove clean worktrees whose branch is merged;
//                                           --dry-run also says why each other worktree stays
// From PowerShell, quote the separator (`npm run pr '--' prune --dry-run`) or call `node tools/pr.mjs` directly: a bare
// `--` is dropped there and npm keeps the flags (TOOL-071 honours a swallowed --dry-run and refuses the others).
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
import { framesDrift } from './packer-marker.mjs';
import { checkArt, formatReport, forceReason, overrideMessage, positionalArg, resolveHead, worktreeHolding } from './pr-guard.mjs';
import { SPARSE, artFolders, folderPatterns, mangledPatterns, rawGaps, sparsePatterns } from './sparse-art.mjs';
import { dropLinks, findLinks, restoreLinks } from './worktree-links.mjs';

// The main checkout, wherever this copy of the script lives (it also runs from inside a worktree).
const ROOT = path.dirname(execFileSync('git', ['rev-parse', '--path-format=absolute', '--git-common-dir'],
  { cwd: path.dirname(fileURLToPath(import.meta.url)) }).toString().trim());
const REPO = 'eshin087/gcdtourney';
const PREFIXES = ['feature/', 'fix/', 'art/', 'docs/', 'chore/'];

const [cmd, ...rest] = process.argv.slice(2);

// TOOL-071: PowerShell drops a bare `--`, so `npm run pr -- prune --dry-run` reaches npm as `run pr prune --dry-run`,
// and npm keeps every flag after the script name as its own setting (npm_config_dry_run=true): the script got `prune`
// alone, and on 2026-11-09 a Codex chat's dry run removed a worktree for real. `--art naruto` and `--force-art "<why>"`
// lose the flag and leave its value behind as a stray argument; `--no-deploy` vanishes, so a merge would deploy anyway.
// A swallowed --dry-run is honoured (the safe reading of it); any other swallowed pr flag stops the command before it
// changes anything and says what to type instead. Only `npm run pr` itself counts (npm_lifecycle_event), not an npm
// script further up that started this one.
const NPM_FLAGS = [
  ['npm_config_art', '--art'], ['npm_config_force_art', '--force-art'], ['npm_config_full', '--full'],
  ['npm_config_title', '--title'], ['npm_config_deploy', '--no-deploy', (v) => v === '' || v === 'false'],
  ['npm_config_install', '--no-install', (v) => v === '' || v === 'false'],
];
function swallowedFlags(env) {
  if (env.npm_lifecycle_event !== 'pr') return;
  const lost = NPM_FLAGS.filter(([key, , set = (v) => v !== undefined]) => env[key] !== undefined && set(env[key])).map(([, name]) => name);
  if (lost.length) {
    console.error(`[pr] npm kept ${lost.join(', ')} for itself, so this script never saw ${lost.length > 1 ? 'them' : 'it'} (from PowerShell a bare -- is ` +
      `dropped, and npm reads the flags after the script name as its own settings). Nothing was changed. It received only: ` +
      `${[cmd, ...rest].join(' ')}\n[pr] Type it as \`node tools/pr.mjs ${cmd ?? '<command>'} ...\` with the flags, or quote the separator: \`npm run pr '--' ${cmd ?? '<command>'} ...\``);
    process.exit(1);
  }
  if (env.npm_config_dry_run === 'true' && !rest.includes('--dry-run')) {
    console.log('[pr] npm kept --dry-run for itself (from PowerShell a bare -- is dropped): treating this run as --dry-run');
    rest.push('--dry-run');
  }
}
swallowedFlags(process.env);
const flag = (name) => rest.includes(name);
const opt = (name) => { const i = rest.indexOf(name); return i >= 0 ? rest[i + 1] : undefined; };
const positional = positionalArg(rest);

const git = (args, cwd = ROOT, inherit = false) =>
  execFileSync('git', args, { cwd, stdio: inherit ? 'inherit' : ['ignore', 'pipe', 'inherit'] })?.toString().trim();
// Only npm needs a shell on Windows (npm.cmd); node and gh run directly so paths with spaces stay intact.
const sh = (file, args, cwd = ROOT) => execFileSync(file === 'node' ? process.execPath : file, args,
  { cwd, stdio: 'inherit', shell: file === 'npm' && process.platform === 'win32' });
// Untrimmed, with room for a long listing (every first-parent commit of main, a worktree full of untracked files).
const gitRaw = (args, cwd = ROOT) => execFileSync('git', args, { cwd, stdio: ['ignore', 'pipe', 'inherit'], maxBuffer: 256 << 20 }).toString();
const die = (msg) => { console.error(`[pr] ${msg}`); process.exit(1); };
// Inside the project so it is one folder; .gitignore and vite.config.js keep git and the dev server out of it.
const worktreeDir = (branch) => path.join(ROOT, '.worktrees', branch.replace(/\//g, '-'));
const currentBranch = (cwd = ROOT) => git(['rev-parse', '--abbrev-ref', 'HEAD'], cwd);
// Only ENOENT is missing: a folder this restricted profile may not read (EPERM) still holds someone's work.
const missing = (dir) => { try { fs.statSync(dir); return false; } catch (e) { return e.code === 'ENOENT'; } };
// Every registered worktree except the main checkout. `gone`: git still lists it but its folder no longer exists
// (an app deleted the folder itself, or a removal stopped half way); git cannot run inside it.
const worktrees = () => git(['worktree', 'list', '--porcelain']).split(/\n\n+/).filter((b) => /^worktree /m.test(b)).map((block) => {
  const dir = path.resolve(block.match(/^worktree (.+)$/m)[1]);
  return { dir, branch: (block.match(/^branch refs\/heads\/(.+)$/m) || [])[1], locked: /^locked/m.test(block), gone: missing(dir) };
}).filter((t) => t.dir !== path.resolve(ROOT));
// Drops that one registration (`git worktree remove` accepts a missing folder); `git worktree prune` would drop every
// stale entry at once, a detached one whose commits nothing else reaches among them.
function clearGone(dir) {
  try { git(['worktree', 'remove', dir], ROOT, true); return true; } catch {
    console.warn(`[pr] could not clear the registration of ${dir}: \`git worktree prune\` drops it`);
    return false;
  }
}
// `git worktree remove` for a worktree that still exists. Its links go first (tools/worktree-links.mjs, TOOL-070): Git for
// Windows deletes through a junction, and one in a finished worktree emptied the main checkout's node_modules. If git
// then refuses (uncommitted work, a file held open), the links are put back for whoever still uses the worktree.
function removeWorktree(dir) {
  const dropped = dropLinks(dir);
  for (const { link, target } of dropped) console.log(`[pr] removed the link ${path.relative(dir, link)} -> ${target ?? '?'} first, so git cannot delete what it points to`);
  try { git(['worktree', 'remove', dir], ROOT, true); } catch (e) {
    const lost = restoreLinks(dropped.filter((d) => fs.existsSync(path.dirname(d.link))));
    if (lost.length) console.warn(`[pr] could not put back the link(s) ${lost.join(', ')}`);
    throw e;
  }
}
const linkNote = (dir) => {
  const links = findLinks(dir).map((l) => path.relative(dir, l).replace(/\\/g, '/'));
  return links.length ? `; its link(s) go first, never followed: ${named(links, 4)}` : '';
};

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
    try { removeWorktree(dir); } catch {
      if (!missing(dir)) console.warn(`[pr] left ${dir}: git could not remove it (uncommitted files, a file still open there, or a link that would not go); \`git worktree remove\` it later`);
    }
  }
  // A folder deleted without git (an app's own worktree cleanup), or a removal that deleted the folder but not git's
  // entry, leaves the branch "checked out" where nothing is: it was never deleted, and the next prune crashed there.
  for (const t of worktrees()) {
    if (t.branch === branch && t.gone && !t.locked && clearGone(t.dir)) console.log(`[pr] cleared the registration of ${t.dir}: its folder is gone`);
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

// Which branches `prune` treats as merged into main, and for the others the reason (--dry-run prints it).
// Merged = the tip is in main and the branch has commits of its own. "The tip is in main" alone is what
// `git branch --merged` tests, and it also holds for a branch nobody has committed to yet, whose worktree a session
// may have just opened. Two signals say the branch carries work, and both must hold:
//   1. the tip is not on main's first-parent line: main never pointed at it itself, it only has it through a merge.
//      A branch cut from main, or fast-forwarded along it, sits on that line. Needs no stored state.
//   2. a reflog records a commit made there: the branch's own, or its worktree's HEAD (commits made on a detached
//      HEAD before the branch got its name). A branch cut from another branch's commit (the fresh worktree of a
//      forked session) passes signal 1 once that commit lands, but both logs hold only "Created from", "renamed" and
//      checkouts. Reflogs expire (90 days by default): with no entries left, signal 1 decides alone.
// The test used to be "the tip is a merged-in parent of a merge commit in main" (what `pr merge` makes). It missed a
// tip that reached main through another branch (TOOL-068: an art helper branch its feature branch fast-forwarded to
// and then built on; three such worktrees, 8.6 GB, sat for weeks), and it took a new branch for merged when it was cut
// from a commit of main that a feature branch had merged in (`git merge main` there makes it a merge parent too).
const COMMITTED = /^(commit|cherry-pick|revert|am)\b|\brebase\b|: Merge made by /;
function mergeChecker() {
  const lines = (args, cwd) => gitRaw(args, cwd).split('\n').filter(Boolean);
  const reflog = (ref, cwd) => { try { return lines(['reflog', 'show', '--format=%gs', ref], cwd); } catch { return []; } };
  const mergedTips = new Set(lines(['rev-list', '--merges', '--parents', 'main']).flatMap((line) => line.split(' ').slice(2)));
  const mainLine = new Set(lines(['rev-list', '--first-parent', 'main']));
  const heads = (extra) => lines(['for-each-ref', ...extra, '--format=%(objectname) %(refname)', 'refs/heads/'])
    .map((line) => [line.slice(line.indexOf(' ') + 1).replace('refs/heads/', ''), line.slice(0, line.indexOf(' '))]);
  const tips = new Map(heads([]));
  const inMain = new Set(heads(['--merged', 'main']).map(([name]) => name));
  // `dir`: the branch's worktree when its folder exists (its HEAD reflog is the second place a commit can show)
  return (branch, dir) => {
    const tip = tips.get(branch);
    if (!tip) return { merged: false, why: 'it has no commits yet' }; // an unborn branch (`git worktree add --orphan`)
    if (!inMain.has(branch)) return { merged: false, why: `${git(['rev-list', '--count', `main..refs/heads/${branch}`])} commit(s) of it are not in main` };
    if (mainLine.has(tip)) return { merged: false, why: 'it has no commits of its own: its tip is a commit main itself was at (a new branch, or one only fast-forwarded to main)' };
    const log = [...reflog(`refs/heads/${branch}`), ...(dir ? reflog('HEAD', dir) : [])];
    if (log.length && !log.some((entry) => COMMITTED.test(entry))) return { merged: false, why: 'it has no commits of its own: its tip is in main, but no reflog records a commit made on it (a new branch cut from another branch\'s commit)' };
    return { merged: true, via: mergedTips.has(tip) ? '' : ' through another branch' };
  };
}

// A worktree's uncommitted paths, every untracked file on its own (git folds a wholly untracked folder into one line).
function uncommitted(dir) {
  const fields = gitRaw(['status', '--porcelain=v1', '-z', '--untracked-files=all'], dir).split('\0');
  const list = [];
  for (let i = 0; i < fields.length; i++) {
    if (!fields[i]) continue;
    const code = fields[i].slice(0, 2);
    list.push({ code, file: fields[i].slice(3) });
    if (/[RC]/.test(code)) i++; // the next field is the path it was renamed or copied from
  }
  return list;
}
const changeWord = (code) => (/U|AA|DD/.test(code) ? 'merge conflict' : code.includes('D') ? 'deleted' : code.includes('R') ? 'renamed' : /[AC]/.test(code) ? 'added' : 'modified');
const named = (items, max = 8) => items.slice(0, max).join(', ') + (items.length > max ? `, and ${items.length - max} more` : '');

// art/**/frames/<name>/: where the packer writes cleaned frames back (tools/pack-sprites.mjs writeBack).
const FRAMES_DIR = /^art\/(?:[^/]+\/)*frames\/[^/]+$/;
// Sorts a worktree's uncommitted paths into what keeps it (`keep`, each with its reason) and what may go with it
// (`frames`: folder -> its untracked files). Only one thing may go (TOOL-068): untracked files in a frames/<name>/
// folder that the packer wrote and nobody touched since, whose source raws are unchanged (framesDrift). A pack writes
// those again, and an art worktree is full of them after its branch merged. Everything else is somebody's work.
function sortUncommitted(dir, list) {
  const keep = [], byFolder = new Map(), frames = new Map();
  for (const { code, file } of list) {
    const folder = path.posix.dirname(file);
    if (code !== '??') keep.push(`${file} (${changeWord(code)})`);
    else if (!FRAMES_DIR.test(folder)) keep.push(`${file} (untracked)`);
    else byFolder.set(folder, [...(byFolder.get(folder) || []), file]);
  }
  for (const [folder, files] of byFolder) {
    const drift = framesDrift(path.join(dir, folder), path.join(dir, 'art'), files.map((file) => path.posix.basename(file)));
    if (drift.length) keep.push(...drift.map((d) => `${folder}/${d.file} (${d.why})`));
    else frames.set(folder, files);
  }
  return { keep, frames };
}
// Deletes exactly the files that were checked, then each folder if that emptied it. Anything that appeared in between
// stays, and `git worktree remove` (never forced) then refuses the worktree: git has the last word on "clean".
function dropFrames(dir, frames) {
  for (const [folder, files] of frames) {
    for (const file of files) fs.unlinkSync(path.join(dir, file));
    try { fs.rmdirSync(path.join(dir, folder)); } catch { /* tracked files remain: they leave with the worktree */ }
  }
}

// Worktrees outlive their branch when a merge could not remove them (a session was still inside, or a branch
// was merged some other way). Remove the ones with nothing to lose: a merged branch (mergeChecker) and no uncommitted
// work beyond untouched packer frames (sortUncommitted). Anything else stays; a merged one is listed with the files
// that kept it, and --dry-run also lists the unmerged and detached ones with the reason, so no worktree is passed
// over in silence. A detached HEAD is never removed: its commits may be reachable only from there, and the app that
// made it archives it.
// A registration whose folder is already gone loses only git's entry (and the merged branch); the rest are reported.
// Folders in .worktrees/ that are not git worktrees (hand-made copies) are only reported, never deleted.
function prune() {
  if (currentBranch() !== 'main') die('run this in the main checkout');
  const dry = flag('--dry-run');
  const stateOf = mergeChecker();
  const trees = worktrees();
  for (const t of trees) {
    const state = t.branch ? stateOf(t.branch, t.gone ? null : t.dir) : null;
    // git status cannot run in a folder that is gone (spawnSync ENOENT once aborted the whole prune): clear a merged
    // branch's entry like a removal would, report any other and go on
    if (t.gone) {
      const why = t.locked ? 'it is locked (`git worktree unlock` it if the folder is really gone)'
        : !t.branch ? 'it has a detached HEAD, whose commits may be reachable only from there'
          : !state.merged ? `${t.branch} is not merged (${state.why})` : '';
      if (why) console.warn(`[pr] kept the registration of ${t.dir}: its folder is missing, but ${why}`);
      else if (dry) console.log(`[pr] would clear the registration of ${t.dir}: its folder is missing (${t.branch} merged${state.via})`);
      else if (clearGone(t.dir)) {
        try { git(['branch', '-d', t.branch], ROOT, true); } catch { /* checked out elsewhere */ }
        console.log(`[pr] cleared the registration of ${t.dir}: its folder is missing (${t.branch} merged${state.via})`);
      }
      continue;
    }
    if (!t.branch) {
      if (dry) console.log(`[pr] skipped ${t.dir}: detached HEAD, which prune never removes (archive it through the app that made it)`);
      continue;
    }
    if (!state.merged) {
      if (dry) console.warn(`[pr] kept ${t.dir}: ${t.branch} is not merged: ${state.why}`);
      continue;
    }
    if (t.locked) { console.warn(`[pr] kept ${t.dir}: ${t.branch} is merged${state.via} but the worktree is locked (\`git worktree unlock\` it first)`); continue; }
    let work;
    try { work = sortUncommitted(t.dir, uncommitted(t.dir)); } catch (e) {
      console.warn(`[pr] kept ${t.dir}: its uncommitted work could not be read (${String(e.message).split('\n')[0]}); retry later`);
      continue;
    }
    if (work.keep.length) { console.warn(`[pr] kept ${t.dir}: ${t.branch} is merged${state.via} but has uncommitted work: ${named(work.keep)}`); continue; }
    const folders = [...work.frames.keys()].map((folder) => folder + '/');
    const how = `${t.branch} merged${state.via}` + (folders.length ? `; ${folders.length} folder(s) of untouched packer frames go with it: ${named(folders, 4)}` : '') + linkNote(t.dir);
    if (dry) { console.log(`[pr] would remove ${t.dir} (${how})`); continue; }
    try {
      dropFrames(t.dir, work.frames);
      removeWorktree(t.dir);
      try { git(['branch', '-d', t.branch], ROOT, true); } catch { /* checked out elsewhere */ }
      console.log(`[pr] removed ${t.dir} (${how})`);
    } catch (e) {
      const why = /^could not remove the link/.test(e.message) ? e.message : 'a session or editor may have it open';
      console.warn(`[pr] could not remove ${t.dir} (${why}); retry later`);
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
