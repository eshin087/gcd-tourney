#!/usr/bin/env node
// Regression test for `pr prune` (TOOL-068): which worktrees it calls finished, and what --dry-run says about the rest.
//   node tools/test-prune.mjs   (part of `npm run test:guard`; add --keep to keep tools/.test-fixtures/prune/)
// Builds a throw-away repository under tools/.test-fixtures/ holding a copy of tools/pr.mjs and its imports, then runs
// the real `pr prune` there. On 2026-11-08 three merged art worktrees (8.6 GB) had sat for three weeks: one branch had
// reached main through its feature branch, and all three held untracked frames the packer had written back.
// (A registered worktree whose folder is gone is covered by tools/test-sparse-art.mjs.)
// TOOL-070: on the same day the prune emptied the main checkout's node_modules through a node_modules junction in a
// finished worktree (Git for Windows deletes through junctions); links must go before git removes a worktree.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { GENERATED_BY, MARKER, framesDrift, hashFiles, sha1 } from './packer-marker.mjs';
import { dropLinks, findLinks, restoreLinks } from './worktree-links.mjs';

const TOOL_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.join(TOOL_DIR, '.test-fixtures', 'prune');
// Outside the fixture repository, like the main checkout's node_modules is outside a worktree.
const OUTSIDE = path.join(TOOL_DIR, '.test-fixtures', 'prune-outside');
const PKG = 'node_modules/pkg/index.js';
const samePath = (a, b) => path.resolve(a).toLowerCase() === path.resolve(b).toLowerCase();
const KEEP = process.argv.includes('--keep');
let failures = 0, passes = 0;
const check = (ok, msg) => { if (ok) passes++; else { failures++; console.log(`  FAIL ${msg}`); } };

const git = (cwd, ...a) => execFileSync('git', a, { cwd, stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim();
const put = (dir, rel, data = 'x\n') => { const f = path.join(dir, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, data); };
const pr = (...args) => spawnSync(process.execPath, [path.join(REPO, 'tools', 'pr.mjs'), ...args], { cwd: REPO, encoding: 'utf8' });
// As `npm run pr ...` from PowerShell runs it (TOOL-071): the flags npm kept for itself arrive only as npm_config_* settings.
const prNpm = (npmEnv, ...args) => spawnSync(process.execPath, [path.join(REPO, 'tools', 'pr.mjs'), ...args],
  { cwd: REPO, encoding: 'utf8', env: { ...process.env, npm_lifecycle_event: 'pr', ...npmEnv } });
const on = (dir, rel) => fs.existsSync(path.join(dir, rel));
const wt = (branch) => path.join(REPO, '.worktrees', branch.replace(/\//g, '-'));
const commit = (dir, file, msg) => { put(dir, file, msg + '\n'); git(dir, 'add', '--', file); git(dir, 'commit', '-q', '-m', msg); };
// A worktree on a new branch off `from`, like `pr start` without the sparse checkout (the raws stay on disk).
const add = (branch, from = 'main') => { git(REPO, 'worktree', 'add', '-q', '-b', branch, wt(branch), from); return wt(branch); };
const mergeToMain = (branch) => git(REPO, 'merge', '-q', '--no-ff', '--no-edit', branch);

const SOURCE = ['vfx/raw/spark_v01.png', 'vfx/raw/spark_v01.json'];
// What the packer's write-back leaves in art/vfx/frames/<name>/: cleaned frames and the marker with their hashes.
function packFrames(dir, name, count = 2) {
  const folder = path.join(dir, 'art', 'vfx', 'frames', name);
  const files = {};
  for (let k = 0; k < count; k++) {
    const file = `${name}_0${k}.png`, data = `${name} frame ${k}\n`;
    put(folder, file, data);
    files[file] = sha1(Buffer.from(data));
  }
  const marker = { generatedBy: GENERATED_BY, sourceFile: 'raw/spark_v01.png', version: 1, source: SOURCE, sourceHash: hashFiles(SOURCE.map((s) => path.join(dir, 'art', s))), files };
  put(folder, MARKER, JSON.stringify(marker, null, 2) + '\n');
  return folder;
}

function buildRepo() {
  fs.rmSync(REPO, { recursive: true, force: true });
  fs.rmSync(OUTSIDE, { recursive: true, force: true });
  put(OUTSIDE, PKG, 'outside package\n');
  fs.mkdirSync(REPO, { recursive: true });
  git(REPO, 'init', '-q', '-b', 'main');
  git(REPO, 'config', 'user.email', 'prune@test'); git(REPO, 'config', 'user.name', 'prune test'); git(REPO, 'config', 'core.autocrlf', 'false');
  for (const f of ['pr.mjs', 'pr-guard.mjs', 'sparse-art.mjs', 'scratch-dir.mjs', 'packer-marker.mjs', 'worktree-links.mjs']) put(REPO, 'tools/' + f, fs.readFileSync(path.join(TOOL_DIR, f)));
  put(REPO, 'tools/publish.mjs', '// stub: the fixture never publishes\n');
  put(REPO, '.gitignore', '.worktrees/\nnode_modules/\n');
  put(REPO, 'package.json', '{ "name": "prune-fixture", "private": true }\n');
  put(REPO, 'src/game/code.js', 'export const x = 1;\n');
  put(REPO, 'art/vfx/raw/spark_v01.png', 'raw spark v01\n');
  put(REPO, 'art/vfx/raw/spark_v01.json', '{ "frames": 2 }\n');
  put(REPO, 'art/vfx/frames/glow/.gitkeep', '');
  git(REPO, 'add', '-A'); git(REPO, 'commit', '-q', '-m', 'main');
}

function main() {
  buildRepo();

  // 1) the helper branch of the incident: art/via is fast-forwarded into feature/mid, which takes one more commit,
  //    merges main and lands. Its tip is in main but is no merge commit's parent. Its worktree holds untouched frames.
  const via = add('art/via');
  commit(via, 'via.txt', 'art via');
  const mid = add('feature/mid');
  git(mid, 'merge', '-q', '--ff-only', 'art/via');
  commit(mid, 'mid.txt', 'feature mid');
  commit(REPO, 'main1.txt', 'main moves on');
  // 2) a new branch with no commits, cut from a commit of main that feature/mid then merges in (`git merge main` makes
  //    that commit a merge parent, which the old test took for "merged")
  const fresh = add('fix/new');
  git(mid, 'merge', '-q', '--no-edit', 'main');
  // 3) a new branch with no commits, cut from another branch's commit (a forked session's worktree) and renamed
  const fork = path.join(REPO, '.worktrees', 'fix-fork');
  git(REPO, 'worktree', 'add', '-q', '-b', 'claude/fork', fork, 'art/via');
  git(fork, 'branch', '-m', 'fix/fork');
  // 4) commits made on a detached HEAD, the branch named afterwards: only the worktree's HEAD reflog shows the commit
  const late = wt('fix/late');
  git(REPO, 'worktree', 'add', '-q', '--detach', late, 'main');
  commit(late, 'late.txt', 'fix late');
  git(late, 'switch', '-q', '-c', 'fix/late');
  // 5) merged branches whose worktrees differ only in what is left uncommitted
  const [frames, edited, stray, resourced, notes] = ['art/frames', 'art/edited', 'art/stray', 'art/resourced', 'fix/notes'].map((b) => {
    const d = add(b);
    commit(d, `${path.basename(d)}.txt`, b);
    return d;
  });
  const open = add('fix/open');
  commit(open, 'open.txt', 'fix open');
  const detached = path.join(REPO, '.worktrees', 'detached');
  git(REPO, 'worktree', 'add', '-q', '--detach', detached, 'main');
  // 8) TOOL-070: a merged worktree whose ignored node_modules folders (one nested) are junctions to a folder outside it
  const linked = add('fix/linked');
  commit(linked, 'linked.txt', 'fix linked');
  for (const b of ['fix/late', 'art/frames', 'art/edited', 'art/stray', 'art/resourced', 'fix/notes', 'feature/mid', 'fix/linked']) mergeToMain(b);
  const outsideMods = path.join(OUTSIDE, 'node_modules');
  fs.symlinkSync(outsideMods, path.join(linked, 'node_modules'), 'junction');
  fs.mkdirSync(path.join(linked, 'server'));
  fs.symlinkSync(outsideMods, path.join(linked, 'server', 'node_modules'), 'junction');
  fs.symlinkSync(outsideMods, path.join(notes, 'node_modules'), 'junction'); // in a worktree prune keeps

  packFrames(via, 'spark');
  packFrames(frames, 'spark');
  const glow = packFrames(frames, 'glow'); // beside a committed .gitkeep, as in the real art/vfx/frames/<effect>/
  packFrames(edited, 'spark');
  put(edited, 'art/vfx/frames/spark/spark_01.png', 'touched up by hand\n');
  packFrames(stray, 'spark');
  put(stray, 'art/vfx/frames/spark/notes.txt', 'redo the second frame\n');
  const resFolder = packFrames(resourced, 'spark'); // packed from a raw that is not the committed one
  const resMarker = JSON.parse(fs.readFileSync(path.join(resFolder, MARKER), 'utf8'));
  put(resFolder, MARKER, JSON.stringify({ ...resMarker, sourceHash: sha1(Buffer.from('another drawing')) }, null, 2) + '\n');
  put(notes, 'notes.txt', 'remember this\n');
  put(notes, 'src/game/code.js', 'export const x = 2;\n');

  // the shared helper on its own: a committed .gitkeep is not judged when only the untracked files are named
  check(framesDrift(glow, path.join(frames, 'art'), ['glow_00.png', 'glow_01.png', MARKER]).length === 0, 'framesDrift: untouched frames beside a committed .gitkeep are packer output');
  check(framesDrift(glow, path.join(frames, 'art')).some((d) => d.file === '.gitkeep'), 'framesDrift: judging the whole folder names the file the marker does not list');
  check(framesDrift(path.join(frames, 'art', 'vfx', 'raw'), path.join(frames, 'art')).length === 1, 'framesDrift: a folder without a marker is never packer output');

  // the link helpers on their own (tools/worktree-links.mjs)
  const probe = path.join(OUTSIDE, 'probe');
  put(probe, 'real/file.txt');
  fs.symlinkSync(outsideMods, path.join(probe, 'real', 'mods'), 'junction');
  const found = findLinks(probe);
  check(found.length === 1 && samePath(found[0], path.join(probe, 'real', 'mods')), `findLinks finds a nested junction and does not walk into it (${found.join(', ')})`);
  const dropped = dropLinks(probe);
  check(dropped.length === 1 && !fs.existsSync(path.join(probe, 'real', 'mods')) && on(OUTSIDE, PKG) && on(probe, 'real/file.txt'),
    'dropLinks removes the link itself, not what it points to');
  check(restoreLinks(dropped).length === 0 && samePath(fs.readlinkSync(path.join(probe, 'real', 'mods')), outsideMods) && on(probe, 'real/mods/pkg/index.js'),
    'restoreLinks puts the junction back where it was');

  // 6) --dry-run names every worktree and why it stays or goes, and changes nothing
  const before = git(REPO, 'worktree', 'list', '--porcelain');
  const r1 = pr('prune', '--dry-run');
  const said = (re, text = r1.stdout + r1.stderr) => re.test(text);
  check(r1.status === 0, `prune --dry-run exits 0 (${r1.status}) ${r1.stderr.trim().split('\n').pop()}`);
  check(said(/would remove .*art-via \(art\/via merged through another branch; 1 folder\(s\) of untouched packer frames go with it: art\/vfx\/frames\/spark\/\)/, r1.stdout),
    `a tip merged through an intermediate branch counts as merged (${r1.stdout.match(/.*art-via.*/)})`);
  check(said(/would remove .*feature-mid \(feature\/mid merged\)/, r1.stdout), 'the intermediate branch itself is merged directly');
  check(said(/kept .*fix-new: fix\/new is not merged: it has no commits of its own: its tip is a commit main itself was at/, r1.stderr),
    `a new branch with no commits is not merged, even cut from a commit a feature branch merged in (${(r1.stdout + r1.stderr).match(/.*fix-new.*/)})`);
  check(said(/kept .*fix-fork: fix\/fork is not merged: it has no commits of its own: its tip is in main, but no reflog records a commit/, r1.stderr),
    `a new branch cut from another branch's merged commit is not merged (${(r1.stdout + r1.stderr).match(/.*fix-fork.*/)})`);
  check(said(/would remove .*fix-late \(fix\/late merged\)/, r1.stdout), `commits made before the branch was named count (${(r1.stdout + r1.stderr).match(/.*fix-late.*/)})`);
  check(said(/would remove .*art-frames \(art\/frames merged; 2 folder\(s\) of untouched packer frames go with it: /, r1.stdout) && said(/art-frames.*art\/vfx\/frames\/glow\//, r1.stdout),
    `a worktree dirty only with untouched packer frames would be removed (${(r1.stdout + r1.stderr).match(/.*art-frames.*/)})`);
  check(said(/kept .*art-edited: art\/edited is merged but has uncommitted work: art\/vfx\/frames\/spark\/spark_01\.png \(packer frame edited since it was packed\)/, r1.stderr),
    `an edited frame keeps the worktree and is named (${(r1.stdout + r1.stderr).match(/.*art-edited.*/)})`);
  check(said(/kept .*art-stray: art\/stray is merged but has uncommitted work: art\/vfx\/frames\/spark\/notes\.txt \(not in the packer marker\)/, r1.stderr),
    `a file the marker does not list keeps the worktree and is named (${(r1.stdout + r1.stderr).match(/.*art-stray.*/)})`);
  check(said(/kept .*art-resourced: .*art\/vfx\/frames\/spark\/ \(the source it was packed from changed since: vfx\/raw\/spark_v01\.png/, r1.stderr),
    `frames packed from a raw that is not the committed one keep the worktree (${(r1.stdout + r1.stderr).match(/.*art-resourced.*/)})`);
  check(said(/kept .*fix-notes: fix\/notes is merged but has uncommitted work: /, r1.stderr) && said(/fix-notes.*src\/game\/code\.js \(modified\)/, r1.stderr) && said(/fix-notes.*notes\.txt \(untracked\)/, r1.stderr),
    `an unrelated untracked file and a modified one keep the worktree and are named (${(r1.stdout + r1.stderr).match(/.*fix-notes.*/)})`);
  check(said(/kept .*fix-open: fix\/open is not merged: 1 commit\(s\) of it are not in main/, r1.stderr), `an unmerged branch is listed with its reason (${(r1.stdout + r1.stderr).match(/.*fix-open.*/)})`);
  check(said(/skipped .*detached: detached HEAD, which prune never removes/, r1.stdout), 'a detached worktree is listed as skipped');
  check(said(/would remove .*fix-linked \(fix\/linked merged; its link\(s\) go first, never followed: node_modules, server\/node_modules\)/, r1.stdout),
    `--dry-run names the links that go before the worktree (${(r1.stdout + r1.stderr).match(/.*fix-linked.*/)})`);
  const lines = (r1.stdout + r1.stderr).split('\n').filter((l) => l.startsWith('[pr] '));
  const all = [via, mid, fresh, fork, late, frames, edited, stray, resourced, notes, open, detached, linked];
  check(all.every((d) => lines.filter((l) => l.includes(d)).length === 1) && lines.length === all.length, `--dry-run says one line about every registered worktree (${lines.length} lines for ${all.length})`);
  check(git(REPO, 'worktree', 'list', '--porcelain') === before && on(frames, 'art/vfx/frames/spark/spark_00.png') && on(via, `art/vfx/frames/spark/${MARKER}`) && git(REPO, 'branch', '--list', 'art/via'),
    '--dry-run changes nothing');

  // 6b) TOOL-071: `npm run pr -- prune --dry-run` typed in PowerShell reaches the script as `prune` with npm_config_dry_run
  //     (on 2026-11-09 that ran a real prune); a swallowed --dry-run stays a dry run, other swallowed flags stop the command
  const rd = prNpm({ npm_config_dry_run: 'true' }, 'prune');
  check(rd.status === 0 && /treating this run as --dry-run/.test(rd.stdout) && /would remove .*art-via/.test(rd.stdout),
    `a --dry-run npm swallowed is honoured (${rd.status}) ${(rd.stdout + rd.stderr).split('\n')[0]}`);
  check(git(REPO, 'worktree', 'list', '--porcelain') === before && git(REPO, 'branch', '--list', 'art/via') && on(via, `art/vfx/frames/spark/${MARKER}`),
    'the swallowed --dry-run changes nothing');
  const mainTip = git(REPO, 'rev-parse', 'main');
  const ra = prNpm({ npm_config_art: 'true' }, 'start', 'fix/swallowed', 'naruto');
  check(ra.status === 1 && /npm kept --art for itself/.test(ra.stderr) && /Nothing was changed/.test(ra.stderr) && /received only: start fix\/swallowed naruto/.test(ra.stderr),
    `a swallowed --art stops \`start\` and shows what arrived (${ra.status}) ${ra.stderr.trim().split('\n')[0]}`);
  check(!fs.existsSync(wt('fix/swallowed')) && !git(REPO, 'branch', '--list', 'fix/swallowed'), 'the refused start made no worktree and no branch');
  const rm = prNpm({ npm_config_force_art: 'true', npm_config_deploy: '' }, 'merge', 'fix/open', 'a reason');
  check(rm.status === 1 && /npm kept --force-art, --no-deploy for itself/.test(rm.stderr) && /node tools\/pr\.mjs merge/.test(rm.stderr),
    `a swallowed --force-art and --no-deploy stop \`merge\` before anything (${rm.status}) ${rm.stderr.trim().split('\n')[0]}`);
  check(git(REPO, 'rev-parse', 'main') === mainTip && fs.existsSync(open) && git(REPO, 'branch', '--list', 'fix/open'), 'the refused merge left main and the worktree alone');
  const rn = prNpm({ npm_lifecycle_event: 'test:guard', npm_config_art: 'true' }, 'prune', '--dry-run');
  check(rn.status === 0 && !/npm kept/.test(rn.stdout + rn.stderr), 'settings of an npm script further up (not `npm run pr`) are left alone');

  // 7) the real prune removes exactly what the dry run announced
  const r2 = pr('prune');
  const listed = (dir) => git(REPO, 'worktree', 'list', '--porcelain').toLowerCase().includes(dir.replace(/\\/g, '/').toLowerCase());
  const branchOf = (b) => git(REPO, 'branch', '--list', b);
  check(r2.status === 0, `prune exits 0 (${r2.status}) ${r2.stderr.trim().split('\n').pop()}`);
  for (const [d, b] of [[via, 'art/via'], [mid, 'feature/mid'], [late, 'fix/late'], [frames, 'art/frames'], [linked, 'fix/linked']]) {
    check(!fs.existsSync(d) && !listed(d) && !branchOf(b), `prune removes the worktree and branch of ${b} (${r2.stdout.match(new RegExp(`.*${path.basename(d)}.*`))} ${r2.stderr.trim()})`);
  }
  check(/removed .*art-via \(art\/via merged through another branch; 1 folder\(s\) of untouched packer frames go with it/.test(r2.stdout), 'prune says what went with the worktree');
  check(on(OUTSIDE, PKG), 'removing a worktree leaves what its junctions point to untouched (TOOL-070: git deletes through them)');
  check(/removed the link node_modules -> .*first/.test(r2.stdout) && /removed the link server[\\/]node_modules -> /.test(r2.stdout), `prune names each link it removed first (${r2.stdout.match(/.*removed the link.*/g)})`);
  check(fs.lstatSync(path.join(notes, 'node_modules')).isSymbolicLink() && on(notes, PKG), 'a kept worktree keeps its link');
  for (const [d, b] of [[fresh, 'fix/new'], [fork, 'fix/fork'], [edited, 'art/edited'], [stray, 'art/stray'], [resourced, 'art/resourced'], [notes, 'fix/notes'], [open, 'fix/open']]) {
    check(fs.existsSync(d) && listed(d) && branchOf(b), `prune keeps the worktree and branch of ${b}`);
  }
  check(fs.existsSync(detached) && listed(detached), 'prune leaves the detached worktree alone');
  check(fs.readFileSync(path.join(edited, 'art/vfx/frames/spark/spark_01.png'), 'utf8') === 'touched up by hand\n' && on(edited, 'art/vfx/frames/spark/spark_00.png') && on(edited, `art/vfx/frames/spark/${MARKER}`),
    'a kept worktree keeps its whole frames folder, the untouched frames too');
  check(on(stray, 'art/vfx/frames/spark/notes.txt') && on(stray, 'art/vfx/frames/spark/spark_00.png') && on(resourced, 'art/vfx/frames/spark/spark_00.png') && on(notes, 'notes.txt'), 'nothing is deleted from a kept worktree');
  check(/kept .*art-edited: .*spark_01\.png \(packer frame edited/.test(r2.stderr) && /kept .*fix-notes: .*notes\.txt \(untracked\)/.test(r2.stderr), 'the real run also names what kept a merged worktree');
  const r3 = pr('prune', '--dry-run');
  check(r3.status === 0 && !/would remove|would clear/.test(r3.stdout), `nothing is left to remove afterwards (${r3.stdout.trim()})`);

  if (!KEEP) {
    try { git(REPO, 'worktree', 'prune'); } catch { /* removed below anyway */ }
    fs.rmSync(REPO, { recursive: true, force: true });
    check(on(OUTSIDE, PKG), 'cleaning up the fixture (a kept worktree still links outside) leaves the outside folder alone');
    fs.rmSync(OUTSIDE, { recursive: true, force: true });
  }
  console.log(`${failures ? 'FAILED' : 'ok'}: ${passes} checks passed, ${failures} failed`);
  process.exitCode = failures ? 1 : 0;
}

main();
