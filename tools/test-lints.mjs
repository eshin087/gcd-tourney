#!/usr/bin/env node
// Regression test for the build lints (TOOL-004 tools/lint-anims.mjs, TOOL-027 tools/check-undeclared.mjs).
//   npm run test:lints            (add -- --keep to keep tools/.test-fixtures/lints/ for inspection)
// The undeclared-identifier cases are written to tools/.test-fixtures/lints/ (git-ignored, like the packer test's
// fixtures) and run through the real CLI too, so the exit code and the report format are covered. The animation lint
// is a pure function over plain data: each case doctors a copy of the real inputs and expects one precise message.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { findUndeclared, checkTree } from './check-undeclared.mjs';
import { checkAnims, parseFallback, loadReal } from './lint-anims.mjs';

const TOOLS = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(TOOLS, '..');
const FIX = path.join(TOOLS, '.test-fixtures', 'lints');
const KEEP = process.argv.includes('--keep');
let passed = 0;
const failures = [];
const check = (name, ok, detail = '') => {
  if (ok) passed++;
  else { failures.push(`${name}${detail ? ': ' + detail : ''}`); console.error(`FAIL ${name}${detail ? ': ' + detail : ''}`); }
};
const names = (src) => findUndeclared(src).map((f) => f.name);
const only = (name, src, want, line) => {
  const got = findUndeclared(src);
  check(name, got.length === 1 && got[0].name === want && (line === undefined || got[0].line === line), JSON.stringify(got));
};
const clean = (name, src) => { const got = findUndeclared(src); check(name, got.length === 0, JSON.stringify(got)); };

// ---------------------------------------------------------------- TOOL-027: check-undeclared
// the ENG-062 bug: the pause menu read a MODE_ORDER nobody declared
const menuBug = [
  "import { Menu } from './menu.js';",
  "const MODES = ['solo', 'versus'];",
  'export function pauseMenu(state) {',
  '  const idx = MODE_ORDER.indexOf(state.mode);',
  '  return new Menu(MODES[idx]);',
  '}',
  '',
].join('\n');
only('planted MODE_ORDER is caught, with its line', menuBug, 'MODE_ORDER', 4);
clean('declaring MODE_ORDER fixes it', menuBug.replace("const MODES", "const MODE_ORDER = ['solo', 'versus'];\nconst MODES"));

only('a typo of a local', 'const counter = 1;\nconsole.log(countr, counter);', 'countr');
only('a missing import', "import { a } from './a.js';\na();\nb();", 'b');
only('used in a template substitution', 'export const s = `x ${missing1} y`;', 'missing1');
only('used in a nested template', 'const a = 1;\nexport const s = `x ${`y ${a} ${missing2}`}`;', 'missing2');
only('a method body', 'class A { m() { return nope2; } }', 'nope2');
only('a parameter default', 'export function f(a = nope3) { return a; }', 'nope3');
only('an arrow body', 'export const f = (x) => x + nope4;', 'nope4');
only('a single-parameter arrow body', 'export const f = x => x + nope5;', 'nope5');
only('used outside the function that declares it', 'function a() { const hidden = 1; return hidden; }\nfunction b() { return hidden; }', 'hidden');
only('used outside its block', 'export function f(x) {\n  if (x) { const t = 1; }\n  return t;\n}', 't', 3);
only('a catch parameter is local to the catch', 'try { run(); } catch (err) { log(err); }\nfunction run() {}\nfunction log() {}\nerr;', 'err');
check('every undeclared use is reported, not only the first', names('a1(); b1(); c1();').join() === 'a1,b1,c1');
clean('names in strings, comments and regexes are not code', "// MODE_ORDER\n/* MODE_ORDER */\nconst a = 'MODE_ORDER', b = \"MODE_ORDER\", c = /MODE_ORDER/g, d = `MODE_ORDER`;\nexport default [a, b, c, d];");
clean('globals', 'export default [Math.PI, JSON, window.innerWidth, document.body, new URL("x", location.href), setTimeout, Float32Array, performance.now()];');

// a wide sample of valid syntax: the scanner must stay silent on all of it
const kitchenSink = String.raw`
import Def, { a as b, c } from './m.js';
import * as THREE from 'three';
import './side.js';
export { b as renamed, c };
export * as ns from './n.js';
export { q } from './q.js';
const mk = () => ({ p1: 1, p2: { deep: 2 }, z: 3 });
const { p1, p2: { deep }, ...rest } = mk(), [first, , third = 3, ...others] = [1, 2, 3, 4];
let counter = 0, other = counter + p1 + deep + first + third;
export const FLAG = true;
export default class Widget extends Def {
  static count = 0;
  #secret = 1;
  label = 'w';
  static #hidden() { return 1; }
  static { Widget.count += 1; }
  constructor(opts = {}, { size = 2, ...more } = {}) {
    super();
    this.size = size + more.k + opts.n + this.#secret;
  }
  get area() { return this.size * this.size; }
  set area(v) { this.size = Math.sqrt(v); }
  async *stream(n = counter) { for (let i = 0; i < n; i++) yield i; }
  [Symbol.iterator]() { return [][Symbol.iterator](); }
}
function outer(x, y = x * 2, ...zs) {
  const inner = (q) => q + x + y + zs.length;
  label: for (const k in { a: 1 }) { if (k) continue label; else break label; }
  try { inner(1); } catch ({ message }) { return message; } finally { counter++; }
  return function named(n) { return n ? named(n - 1) : x; };
}
const obj = { first, 'quoted': 1, 3: 'n', [first + 1]: 2, get g() { return 1; }, set g(v) {}, async am() {}, *gen() {}, short() { return b; }, k: counter ? first : third };
const arrows = [(a) => a, async (a, b2) => a + b2, async v => v, ({ m }) => m, ([n1]) => n1, (t, u = t) => u];
const re = /[/\]]+\/x/gi.test('a/b') ? 1 / 2 : 4 / counter / 2;
const tpl = ${'`'}a${'${'}${'`'}b${'${'}first}c${'`'}}d ${'${'} { k: 1 }.k } ${'${'}arrows.length}${'`'};
const optional = obj?.short?.() ?? obj?.[0] ?? THREE.MathUtils;
const g1 = typeof document !== 'undefined' && window.innerWidth > 0 && new URL('x', location.href);
for (const [kk, vv] of Object.entries(obj)) console.log(kk, vv);
for (let i = 0, n = 3; i < n; i++) counter += i;
switch (counter) { case first: { const scoped = 1; counter += scoped; break; } default: break; }
do { counter--; } while (counter > 0);
if (counter) { var hoisted = 1; }
new Widget().area; Promise.all([]).then(async function () { await null; });
export function lastUse() { return [rest, others, other, FLAG, outer, re, tpl, optional, g1, hoisted, fnLater()]; }
function fnLater() { return later; }
const later = 1;
`;
clean('valid syntax sample (patterns, classes, templates, regexes, optional chaining, hoisting)', kitchenSink);

// the CLI: a fixture tree with the planted bug fails the run and says where
fs.rmSync(FIX, { recursive: true, force: true });
fs.mkdirSync(path.join(FIX, 'bad', 'ui'), { recursive: true });
fs.mkdirSync(path.join(FIX, 'good'), { recursive: true });
fs.writeFileSync(path.join(FIX, 'bad', 'ui', 'menus.js'), menuBug);
fs.writeFileSync(path.join(FIX, 'good', 'sink.js'), kitchenSink);
const run = (script, ...args) => spawnSync(process.execPath, [path.join(TOOLS, script), ...args], { encoding: 'utf8' });
const bad = run('check-undeclared.mjs', path.join(FIX, 'bad'));
check('CLI exits 1 on the planted bug', bad.status === 1, `status ${bad.status}`);
check('CLI names file, line and identifier', /ui\/menus\.js:4: "MODE_ORDER" is used but never declared or imported/.test(bad.stderr), bad.stderr);
const good = run('check-undeclared.mjs', path.join(FIX, 'good'));
check('CLI exits 0 on valid code', good.status === 0, good.stderr);
check('checkTree lists file paths relative to the root', JSON.stringify(checkTree(path.join(FIX, 'bad'))) === JSON.stringify([{ file: 'ui/menus.js', name: 'MODE_ORDER', line: 4 }]));

// today's tree
let t0 = performance.now();
const srcFindings = checkTree(path.join(ROOT, 'src'), ROOT);
const undeclaredMs = performance.now() - t0;
check('src/ has no undeclared identifiers', srcFindings.length === 0, srcFindings.map((f) => `${f.file}:${f.line} ${f.name}`).join('; '));
check('check-undeclared runs well under 2 s on src/', undeclaredMs < 2000, `${Math.round(undeclaredMs)} ms`);

// ---------------------------------------------------------------- TOOL-004: lint-anims
t0 = performance.now();
const real = await loadReal(ROOT);
const base = checkAnims(real);
const animsMs = performance.now() - t0;
check('the real animation contract has no errors', base.errors.length === 0, base.errors.join('; '));
check('lint-anims runs well under 2 s (load + check)', animsMs < 2000, `${Math.round(animsMs)} ms`);
const doctored = (edit) => { const d = structuredClone(real); edit(d); return checkAnims(d); };
const wantError = (name, edit, re) => { const r = doctored(edit); check(name, r.errors.some((e) => re.test(e)), JSON.stringify(r.errors)); };
const wantWarning = (name, edit, re) => { const r = doctored(edit); check(name, r.errors.length === 0 && r.warnings.some((e) => re.test(e)), JSON.stringify(r)); };

const firstChar = Object.keys(real.manifest.characters)[0];
wantError('a guide animation with no manifest default', (d) => { delete d.manifest.animationDefaults.hurtLow; }, /animationDefaults has no entry for "hurtLow"/);
wantError('a manifest default the guide does not know', (d) => { d.manifest.animationDefaults.ghost = { frames: 1 }; }, /animationDefaults has "ghost", which is not in ANIM_GUIDE/);
wantError('a fighter missing a required animation', (d) => { delete d.manifest.characters[firstChar].animations.idle; }, new RegExp(`characters\\.${firstChar}\\.animations has no "idle" entry`));
wantWarning('a fighter missing an optional animation only warns', (d) => { delete d.manifest.characters[firstChar].animations.superPose; }, /optional superPose/);
wantError('a fighter entry the guide does not know', (d) => { d.manifest.characters[firstChar].animations.ghost = {}; }, /has "ghost", which is not in ANIM_GUIDE/);
wantError('an optional animation with no FALLBACK entry', (d) => { delete d.fallback.specialUp; }, /optional animation "specialUp" has no FALLBACK entry/);
wantError('a mistyped FALLBACK target', (d) => { d.fallback.specialUp = 'speical'; }, /FALLBACK maps "specialUp" to "speical", which is not an animation name/);
wantError('a FALLBACK key that is not an animation', (d) => { d.fallback.ghost = 'idle'; }, /FALLBACK has a key "ghost"/);
wantError('a FALLBACK chain longer than the engine follows', (d) => {
  const chain = ['specialUp', 'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7'];
  chain.forEach((n, i) => { if (i + 1 < chain.length) d.fallback[n] = chain[i + 1]; });
  for (const id of Object.keys(d.baked)) d.baked[id] = d.baked[id].filter((n) => n !== 'specialUp');
  for (const n of chain.slice(1)) d.guide[n] = { frames: 1 };
}, /"specialUp" never reaches an animation the placeholder bakes/);
wantError('a FALLBACK cycle', (d) => { d.fallback.techGround = 'techRoll'; d.fallback.techRoll = 'techGround'; for (const id of Object.keys(d.baked)) d.baked[id] = d.baked[id].filter((n) => !['techGround', 'techRoll'].includes(n)); }, /"techGround" never reaches/);
wantError('an alt of a base that does not exist', (d) => { d.guide.light1Alt = { ...d.guide.light1Alt, altOf: 'nope' }; }, /"light1Alt" is altOf "nope", which is not in ANIM_GUIDE/);
wantError('an alt with a different frame count (guide)', (d) => { d.guide.light1Alt = { ...d.guide.light1Alt, frames: 9 }; }, /ANIM_GUIDE: "light1Alt" has 9 frames, its base has 7/);
wantError('an alt with different phases (manifest default)', (d) => { d.manifest.animationDefaults.heavyAlt.phases = [1, 1, 1]; }, /animationDefaults: "heavyAlt" phases \[1,1,1\] differ/);
wantError('an alt whose fighter entry changes the frames', (d) => { d.manifest.characters[firstChar].animations.airLight1Alt.frames = 3; }, new RegExp(`characters\\.${firstChar}: "airLight1Alt" has 3 frames`));
wantError('an alt whose default names another base', (d) => { d.manifest.animationDefaults.light2Alt.altOf = 'light3'; }, /animationDefaults\.light2Alt\.altOf is "light3", the guide says "light2"|animationDefaults\.light2Alt\.altOf is/);
wantError('a move that strikes behind whose strip is not marked strike: back', (d) => { delete d.guide.bair.strike; }, /MOVES\.bair strikes behind \(back: true\) but ANIM_GUIDE\.bair has no strike: 'back'/);
wantError('a strip marked strike: back that no back move plays', (d) => { d.guide.fair = { ...d.guide.fair, strike: 'back' }; }, /ANIM_GUIDE\.fair has strike: 'back' but no move with back: true plays it/);
wantError('an unknown strike side', (d) => { d.guide.uair = { ...d.guide.uair, strike: 'up' }; }, /ANIM_GUIDE\.uair\.strike is "up" - only 'back' is known/);
wantWarning('SPEC.md missing an animation name only warns', (d) => { d.spec = d.spec.split('`wallTech`').join('wallTech'); }, /art\/SPEC\.md does not mention in backticks: wallTech/);
check('parseFallback reads the real FALLBACK', parseFallback(fs.readFileSync(path.join(ROOT, 'src/game/sprites.js'), 'utf8')).light1Alt === 'light1');
check('parseFallback fails loudly when the literal moves', (() => { try { parseFallback('export const OTHER = {};'); return false; } catch { return true; } })());

const noArt = checkAnims({ ...structuredClone(real), manifest: null, spec: null });
check('without art/ (a deploy export) the manifest and SPEC checks are skipped, not failed', noArt.errors.length === 0 && noArt.notes.length === 1 && noArt.warnings.length === 0, JSON.stringify(noArt));
check('without art/ the FALLBACK checks still run', (() => { const d = structuredClone(real); d.manifest = null; d.fallback.specialUp = 'speical'; return checkAnims(d).errors.length > 0; })());

const cli = run('lint-anims.mjs');
check('lint-anims CLI exits 0 on this tree', cli.status === 0, cli.stderr);

// the lints must stay wired into the build
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
check('prebuild runs both lints', /lint-anims\.mjs/.test(pkg.scripts.prebuild) && /check-undeclared\.mjs/.test(pkg.scripts.prebuild), pkg.scripts.prebuild);

if (!KEEP) fs.rmSync(FIX, { recursive: true, force: true });
console.log(`test-lints: ${passed} checks passed${failures.length ? `, ${failures.length} FAILED` : ''} (check-undeclared on src ${Math.round(undeclaredMs)} ms, lint-anims ${Math.round(animsMs)} ms)`);
process.exit(failures.length ? 1 : 0);
