#!/usr/bin/env node
// Regression test for tools/pr-guard.mjs (TOOL-028: the art guard of `npm run pr -- merge`).
//   npm run test:guard            (add -- --keep to keep tools/.test-fixtures/pr-guard/ for inspection)
// Builds a throw-away git repo under tools/.test-fixtures/ (never art/, public/ or the real repository) holding one
// fake fighter, cuts branches that add approved / unapproved / held / off-size strips or commit a pack that drops
// animations main ships (TOOL-061), and checks what the guard says about each merge result. The scale gate runs the real
// packer (dry run) on those fixtures.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { scratchDir } from './scratch-dir.mjs';
import { PNG } from 'pngjs';
import { checkArt, formatReport, forceReason, overrideMessage, positionalArg, resolveHead, worktreeHolding } from './pr-guard.mjs';

const TOOL_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.join(TOOL_DIR, '.test-fixtures', 'pr-guard');
const KEEP = process.argv.includes('--keep');
let failures = 0, passes = 0;
const check = (ok, msg) => { if (ok) passes++; else { failures++; console.log(`  FAIL ${msg}`); } };

// ---------------------------------------------------------------- fake ChatGPT strips (as in test-pack-sprites.mjs)
const S = 6;
const COL = { outline: [26, 22, 34], pants: [40, 52, 96], orange: [240, 120, 24], skin: [246, 200, 154], hair: [255, 210, 60], fist: [214, 150, 110] };
const SHOE = [150, 40, 40];
function mulberry(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
function image(w, h, bg, rand, noise = 2) {
  const img = { w, h, data: new Uint8Array(w * h * 4), mask: new Uint8Array(w * h) };
  for (let i = 0; i < w * h; i++) {
    for (let k = 0; k < 3; k++) img.data[i * 4 + k] = clamp(bg[k] + (rand() - 0.5) * 2 * noise);
    img.data[i * 4 + 3] = 255;
  }
  return img;
}
function setPx(img, x, y, c) {
  if (x < 0 || y < 0 || x >= img.w || y >= img.h) return;
  const i = (y * img.w + x) * 4;
  img.data[i] = c[0]; img.data[i + 1] = c[1]; img.data[i + 2] = c[2]; img.data[i + 3] = 255;
  img.mask[y * img.w + x] = 1;
}
function rect(img, x0, y0, w, h, c, rand) {
  for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) setPx(img, x, y, [clamp(c[0] + (rand() - 0.5) * 6), clamp(c[1] + (rand() - 0.5) * 6), clamp(c[2] + (rand() - 0.5) * 6)]);
}
function fringe(img, rand) {
  const { w, h } = img;
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
    const p = y * w + x;
    if (!img.mask[p] || (img.mask[p - 1] && img.mask[p + 1] && img.mask[p - w] && img.mask[p + w]) || rand() < 0.5) continue;
    const i = p * 4;
    img.data[i] = clamp((img.data[i] + 255) / 2); img.data[i + 1] = clamp(img.data[i + 1] / 2); img.data[i + 2] = clamp((img.data[i + 2] + 255) / 2);
  }
}
function figure(p = {}) {
  const b = p.bob || 0;
  const R = [[-7, -1, 0, 4, SHOE], [1, 7, 0, 4, SHOE], [-6, -2, 4, 28, COL.pants], [2, 6, 4, 28, COL.pants]];
  R.push([-7, 7, 28 + b, 52 + b, COL.orange], [-6, 6, 52 + b, 64 + b, COL.skin], [-7, 7, 62 + b, 70 + b, COL.hair], [-5, -3, 70 + b, 74 + b, COL.hair], [1, 3, 70 + b, 75 + b, COL.hair]);
  R.push([-11, -7, 38 + b, 42 + b, COL.skin], [7, 11, 42 + b, 46 + b, COL.skin]);
  if (p.up) R.push([3, 7, 64 + b, 64 + b + p.up, COL.fist]); // a fist above the head shrinks the whole strip (every strip is fitted to its tallest pose)
  return R;
}
function stripPng(poses, seed) {
  const rand = mulberry(seed), gap = 46;
  const img = image((poses.length * gap + 30) * S, 120 * S, [255, 0, 255], rand);
  poses.forEach((p, k) => {
    const fx = (30 + k * gap) * S, floor = 110 * S;
    const X = (v) => Math.round(fx + v * S), Y = (v) => Math.round(floor - v * S);
    const rects = figure(p);
    for (const [x0, x1, y0, y1] of rects) rect(img, X(x0 - 1), Y(y1 + 1), X(x1 + 1) - X(x0 - 1), Y(y0 - 1) - Y(y1 + 1), COL.outline, rand);
    for (const [x0, x1, y0, y1, c] of rects) rect(img, X(x0), Y(y1), X(x1) - X(x0), Y(y0) - Y(y1), c, rand);
  });
  fringe(img, rand);
  const png = new PNG({ width: img.w, height: img.h });
  png.data = Buffer.from(img.data);
  return PNG.sync.write(png);
}
const IDLE = stripPng([0, 0, 1, 1, 1, 0, 0, 1].map((bob) => ({ bob })), 901);
const GOOD = (seed) => stripPng(Array.from({ length: 7 }, () => ({})), seed);
const BAD = (seed) => stripPng(Array.from({ length: 7 }, (_, k) => (k === 3 ? { up: 22 } : {})), seed); // 'uniform': the figure packs ~12 % small

// ---------------------------------------------------------------- the throw-away repository
const git = (...a) => execFileSync('git', a, { cwd: REPO, stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim();
const put = (rel, data) => { const f = path.join(REPO, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, data); };
const readManifest = () => JSON.parse(fs.readFileSync(path.join(REPO, 'art', 'manifest.json'), 'utf8'));
const writeManifest = (m) => put('art/manifest.json', JSON.stringify(m, null, 2) + '\n');
const setApproved = (anim, v) => { const m = readManifest(); m.characters.guardy.animations[anim].approvedVersion = v; writeManifest(m); };
// the committed pack: the animations it lists and the version each ships ({ idle: 1, ... })
const PACK = 'public/characters/guardy/anims.json';
const writePack = (vers) => put(PACK, JSON.stringify({
  animations: Object.fromEntries(Object.keys(vers).map((a) => [a, { start: 0, frames: 1 }])),
  scaleAudit: { anims: Object.fromEntries(Object.entries(vers).map(([a, v]) => [a, { v }])) },
}));
const commit = (msg) => { git('add', '-A'); git('commit', '-q', '-m', msg); };
const branch = (name, from, fn) => { git('checkout', '-q', '-B', name, from); fn(); commit(name); git('checkout', '-q', 'main'); };
const RAW = 'art/characters/guardy/raw/';
const guard = (name, opts = {}) => { const r = resolveHead(REPO, 'main', name); return { r, res: checkArt({ root: REPO, base: r.base, head: r.head, ...opts }) }; };
const dropsOf = (res) => res.refusals.filter((r) => r.kind === 'dropped');
const tmpGuards = () => fs.readdirSync(scratchDir()).filter((n) => n.startsWith('gcd-art-guard-')).length;

function buildRepo() {
  fs.rmSync(REPO, { recursive: true, force: true });
  fs.mkdirSync(REPO, { recursive: true });
  git('init', '-q', '-b', 'main');
  git('config', 'user.email', 'guard@test'); git('config', 'user.name', 'guard test'); git('config', 'core.autocrlf', 'false');
  const atk = { frames: 7, phases: [2, 2, 3], bodyHeight: 204, status: 'approved', approvedVersion: 1 };
  writeManifest({
    spec: { name: 'hi-res sprite spec v2', frameWidth: 256, frameHeight: 256, columns: 16, pivot: [128, 240], pixelsPerUnit: 128, facing: 'right', maxColors: 48, warnColors: 64, cellMargin: 4, standingBodyPx: 200 },
    characters: { guardy: { name: 'Guardy', animations: { idle: { frames: 8, loop: true, bodyHeight: 204, status: 'approved', approvedVersion: 1 }, light1: atk, light2: atk } } },
  });
  put(RAW + 'idle_v01.png', IDLE);
  put(RAW + 'light1_v01.png', GOOD(902));
  put(RAW + 'light2_v01.png', GOOD(903));
  put(RAW + 'light2_v02.png', GOOD(904)); // already on main and not approved: a pre-existing mismatch the guard must not blame a branch for
  writePack({ idle: 1, light1: 1, light2: 2 });
  put('src/game/code.js', 'export const x = 1;\n');
  commit('main');
}

function main() {
  const before = tmpGuards();
  buildRepo();
  const root = git('rev-parse', 'main');

  // 1) a code branch: one git diff, nothing else
  branch('code', 'main', () => put('src/game/code.js', 'export const x = 2;\n'));
  let t = Date.now();
  const c = guard('code');
  check(c.res.ok && c.res.skipped && Date.now() - t < 1500, `code branch: skipped without a pack (skipped ${c.res.skipped}, ${Date.now() - t} ms)`);
  check(/nothing to check/.test(formatReport(c.res, 'code')[0]), 'code branch: the report says there is nothing to check');

  // 2) a new newest strip that nobody approved
  branch('unapproved', 'main', () => put(RAW + 'light1_v02.png', GOOD(910)));
  const u = guard('unapproved').res;
  check(!u.ok && u.refusals.length === 1 && u.refusals[0].id === 'guardy' && u.refusals[0].anim === 'light1' && u.refusals[0].kind === 'unapproved' && u.refusals[0].newest === 2 && u.refusals[0].approved === 1,
    `unapproved newest raw refuses, naming fighter, anim, newest and approved (${JSON.stringify(u.refusals.map((r) => [r.anim, r.kind, r.newest, r.approved]))})`);
  check(/approve it/.test(u.refusals[0].fix) && /raw\/_qa_hold\//.test(u.refusals[0].fix), 'unapproved: the fix names approving or raw/_qa_hold/');
  check(formatReport(u, 'unapproved').some((l) => /REFUSED guardy light1\s+newest v02\s+approved v01/.test(l)), 'unapproved: the printed list shows fighter, anim, newest and approved');
  check(!u.refusals.some((r) => r.kind === 'scale'), 'unapproved: a well-sized strip passes the scale gate');
  check(u.notes.some((n) => /light2 v02/.test(n)), 'unapproved: the older light2 mismatch on main is a note, not a refusal');

  // 3) the same strip held in raw/_qa_hold/ is not shipped
  branch('hold', 'main', () => put(RAW + '_qa_hold/light1_v02.png', GOOD(910)));
  const h = guard('hold').res;
  check(h.ok && h.changed.guardy?.includes('light1'), `a strip held in raw/_qa_hold/ passes (ok ${h.ok}, changed ${h.changed.guardy})`);

  // 4) approved and well sized
  branch('approved', 'main', () => { put(RAW + 'light1_v02.png', GOOD(910)); setApproved('light1', 2); });
  const a = guard('approved').res;
  check(a.ok, `an approved, well-sized new version passes (${a.refusals.map((r) => r.kind + ' ' + r.anim)})`);

  // 5) approved but off-size: the strict scale gate refuses even with the approval
  branch('offsize', 'main', () => { put(RAW + 'light1_v02.png', BAD(911)); setApproved('light1', 2); });
  const o = guard('offsize').res;
  check(!o.ok && o.refusals.length === 1 && o.refusals[0].kind === 'scale' && o.refusals[0].anim === 'light1' && /head|uniform|figure/.test(o.refusals[0].text),
    `an approved but off-size strip fails the strict scale gate (${JSON.stringify(o.refusals.map((r) => [r.anim, r.kind, r.text.slice(0, 60)]))})`);

  // 6) a committed pack that ships a version nobody approved
  branch('shipped', 'main', () => writePack({ idle: 1, light1: 3, light2: 2 }));
  const s = guard('shipped').res;
  check(!s.ok && s.refusals.some((r) => r.kind === 'shipped' && r.anim === 'light1' && r.shipped === 3), `a committed pack of an unapproved version refuses (${JSON.stringify(s.refusals.map((r) => [r.anim, r.kind]))})`);
  check(!dropsOf(s).length, 'shipped: a pack that keeps every animation drops nothing');

  // 7) TOOL-061: packed in a worktree that held only the new raw, the pack lists just that strip and drops main's others
  branch('sparse', 'main', () => { put(RAW + 'light1_v02.png', GOOD(910)); setApproved('light1', 2); writePack({ light1: 2 }); });
  const sp = guard('sparse').res, spd = dropsOf(sp);
  check(!sp.ok && spd.length === 1 && spd[0].id === 'guardy' && JSON.stringify(spd[0].dropped) === '["idle","light2"]',
    `a pack that drops animations main ships refuses, naming them (${JSON.stringify(spd.map((r) => [r.id, r.dropped]))})`);
  const spLines = formatReport(sp, 'sparse');
  check(spLines.some((l) => /REFUSED guardy \*\s+\(dropped\)$/.test(l)) && spLines.some((l) => /the pack drops 2 animations main ships \(idle, light2\): it lists 1, main 3/.test(l)),
    'sparse: the printed list names the fighter, the count and every missing animation');
  check(/npm run pr -- art guardy/.test(spd[0]?.fix) && /--force-art/.test(spd[0]?.fix),'sparse: the fix names re-packing with every raw, and the override');

  // 8) a pack that keeps every animation main ships and adds a new one passes
  branch('grows', 'main', () => {
    put(RAW + 'light3_v01.png', GOOD(912));
    const m = readManifest();
    m.characters.guardy.animations.light3 = { frames: 7, phases: [2, 2, 3], bodyHeight: 204, status: 'approved', approvedVersion: 1 };
    writeManifest(m);
    writePack({ idle: 1, light1: 1, light2: 2, light3: 1 });
  });
  const g = guard('grows').res;
  check(g.ok && !dropsOf(g).length && g.changed.guardy?.includes('light3'), `a pack that keeps main's animations and adds one passes (${JSON.stringify(g.refusals.map((r) => [r.anim, r.kind]))})`);

  // 9) a deleted pack, and one that does not parse (a conflict in the generated file), drop everything main ships
  branch('deleted', 'main', () => fs.rmSync(path.join(REPO, PACK)));
  const del = dropsOf(guard('deleted', { scale: false }).res);
  check(del.length === 1 && del[0].dropped.length === 3 && /the merge deletes public\/characters\/guardy\/anims\.json: it drops all 3 animations main ships \(idle, light1, light2\)/.test(del[0].text),
    `a deleted pack refuses with every animation main ships (${del.map((r) => r.text)})`);
  branch('garbled', 'main', () => put(PACK, '<<<<<<< ours\n{}\n'));
  const gb = dropsOf(guard('garbled', { scale: false }).res);
  check(gb.length === 1 && gb[0].dropped.length === 3 && /does not parse/.test(gb[0].text) && /merge main/.test(gb[0].fix), `a pack that does not parse refuses (${gb.map((r) => r.text)})`);

  // 10) --force-art overrides a drop like any other refusal, and the merge commit records what was dropped
  const fm = overrideMessage('sparse', 'light2 and idle retired on purpose', sp);
  check(/--force-art\): light2 and idle retired on purpose/.test(fm[1]) && /guardy \(dropped 2: idle, light2\)/.test(fm[2]), `the override message names the dropped animations (${fm[2]})`);

  // 11) the verdict is on the merge result: main approves the version after the branch was cut
  git('checkout', '-q', 'main');
  setApproved('light1', 2); commit('main approves light1 v02');
  const m = guard('unapproved');
  check(m.r.merged && m.res.ok, `judged on the merge result: main's approval of v02 covers the branch (merged ${m.r.merged}, ok ${m.res.ok})`);

  // 12) arguments and the override message
  check(positionalArg(['art/x', '--force-art', 'because I said so']) === 'art/x' && positionalArg(['--force-art', 'why', 'art/x']) === 'art/x' && positionalArg(['--title', 'T', 'fix/y', '--no-deploy']) === 'fix/y',
    'arguments: the --force-art reason never becomes the branch');
  check(forceReason(['b']) === null && forceReason(['b', '--force-art', ' ok ']) === 'ok', 'arguments: --force-art "<reason>" is read, absent means no override');
  for (const bad of [['b', '--force-art'], ['b', '--force-art', '--no-deploy'], ['b', '--force-art', '  ']]) {
    let threw = false;
    try { forceReason(bad); } catch { threw = true; }
    check(threw, `arguments: ${JSON.stringify(bad)} is refused (a reason is required)`);
  }
  const msg = overrideMessage('art/x', 'user approved in chat', u);
  check(msg[0] === "Merge branch 'art/x'" && /--force-art\): user approved in chat/.test(msg[1]) && /guardy light1 \(unapproved; newest v02, approved v01\)/.test(msg[2]), 'the merge commit message records the reason and what was overridden');

  // 13) TOOL-038: which worktree holds a branch, from `git worktree list --porcelain`
  const porcelain = ['worktree E:/p/main', 'HEAD 1111', 'branch refs/heads/main', '', 'worktree E:/p/.worktrees/art-x', 'HEAD 2222',
    'branch refs/heads/art/x', '', 'worktree E:/p/.worktrees/detached', 'HEAD 3333', 'detached', ''].join('\r\n');
  check(worktreeHolding(porcelain, 'art/x') === 'E:/p/.worktrees/art-x' && worktreeHolding(porcelain, 'main') === 'E:/p/main',
    'worktreeHolding: finds the worktree that has the branch checked out (CRLF output too)');
  check(worktreeHolding(porcelain, 'art/gone') === null && worktreeHolding(porcelain, 'art') === null, 'worktreeHolding: null for a branch no worktree holds, never a prefix match');

  check(tmpGuards() === before, 'the scale gate leaves no scratch folder behind');
  check(git('rev-parse', 'main') !== root && git('status', '--porcelain') === '', 'the fixture repository is left clean (the guard only reads it)');

  if (!KEEP) fs.rmSync(REPO, { recursive: true, force: true });
  console.log(`${failures ? 'FAILED' : 'ok'}: ${passes} checks passed, ${failures} failed`);
  process.exitCode = failures ? 1 : 0;
}
main();