#!/usr/bin/env node
// Attack alts (ADR 0031): the deterministic base/alt picker and the animation contract, without a browser.
//   npm run test:alts
// Imports the engine's pure picker (src/game/animAlts.js), the guide (src/art/animGuide.js) and the real FALLBACK /
// SheetAsset from src/game/sprites.js (location is stubbed: the modules read URL flags at load).

globalThis.location = globalThis.location || { search: '' };
const { ALT_OF, ALT_BASE, ALTS_MODE, thueMorse, altOffset, pickAnim } = await import('../src/game/animAlts.js');
const { ANIM_GUIDE } = await import('../src/art/animGuide.js');
const { FALLBACK, SheetAsset } = await import('../src/game/sprites.js');
const { MOVES } = await import('../src/game/moves.js');

let passes = 0, failures = 0;
const check = (ok, msg) => {
  if (ok) passes++;
  else { failures++; console.log(`  FAIL ${msg}`); }
};

console.log('attack alt test');

// ---- the contract: 11 alts, each optional with its base's frames and phases, falling back to its base
const NAMES = ['light1', 'light2', 'light3', 'light4', 'heavy', 'airLight1', 'airLight2', 'airLight3', 'airHeavy', 'hurtHigh', 'hurtLow'];
check(Object.keys(ALT_OF).join() === NAMES.join() && NAMES.every((b) => ALT_OF[b] === `${b}Alt` && ALT_BASE[`${b}Alt`] === b), 'contract: the 11 bases and their <base>Alt names');
for (const [base, alt] of Object.entries(ALT_OF)) {
  const g = ANIM_GUIDE[alt], b = ANIM_GUIDE[base];
  check(g && g.optional === true && g.altOf === base && g.frames === b.frames && String(g.phases) === String(b.phases) && !!g.loop === !!b.loop,
    `guide: ${alt} is optional with ${base}'s frames and phases`);
  check(/^alternate of /.test(g?.pose || '') && /first and last frames match the base's/.test(g?.pose || ''), `guide: ${alt} has the shared alt pose line`);
  check(FALLBACK[alt] === base, `FALLBACK: ${alt} falls back to ${base}`);
}
// every melee move that plays one of the bases maps through the picker (MOVES.vanishKick borrows light4)
check(Object.values(MOVES).filter((m) => ALT_OF[m.anim]).length >= 10 && MOVES.vanishKick.anim === 'light4', 'contract: the normals and vanishKick play bases that have alts');

// ---- the pattern: Thue-Morse from the per-base offset
check(Array.from({ length: 16 }, (_, n) => thueMorse(n)).join('') === '0110100110010110', 'pattern: Thue-Morse bits');
const offsets = NAMES.map(altOffset);
check(offsets.every((o) => Number.isInteger(o) && o >= 0 && o < 8), `pattern: offsets are 0-7 (${offsets})`);
check(new Set(['light1', 'light2', 'light3', 'light4'].map(altOffset)).size === 4, 'pattern: the light chain sits at four different offsets');
check(altOffset('light1') === altOffset('light1'), 'pattern: the offset is stable');

const has = (names) => (n) => names.includes(n);
const ALL = has(Object.values(ALT_OF));
const run = (base, n, hasAnim = ALL, mode = 'auto', counters = {}) => Array.from({ length: n }, () => pickAnim(base, counters, hasAnim, mode));

for (const base of NAMES) {
  const seq = run(base, 64);
  const alts = seq.filter((s) => s === ALT_OF[base]).length;
  check(Math.abs(alts - 32) <= 1, `balanced: ${base} plays its alt ${alts} of 64 times`);
  const triple = seq.some((s, i) => i >= 2 && s === seq[i - 1] && s === seq[i - 2]);
  check(!triple, `no repeats: ${base} never shows the same version three times in a row`);
  check(seq.every((s) => s === base || s === ALT_OF[base]), `${base}: only the base or its alt`);
}
// deterministic: the same counters give the same choices (no Math.random), and every base keeps its own count
{
  const a = run('light2', 20), b = run('light2', 20);
  check(a.join() === b.join(), 'deterministic: two fresh fighters choose the same sequence');
  const c = {};
  pickAnim('light1', c, ALL, 'auto'); pickAnim('light1', c, ALL, 'auto'); pickAnim('heavy', c, ALL, 'auto');
  check(c.light1 === 2 && c.heavy === 1 && c.light2 === undefined, `counters: one count per base (${JSON.stringify(c)})`);
}
// a light string used once per combo: its four moves do not all switch together
{
  const c = {};
  const combos = Array.from({ length: 8 }, () => ['light1', 'light2', 'light3', 'light4'].map((b) => (pickAnim(b, c, ALL, 'auto') === b ? 'B' : 'A')).join(''));
  check(combos.some((s) => /A/.test(s) && /B/.test(s)), `pattern: a string mixes versions (${combos.join(' ')})`);
  check(new Set(combos).size >= 4, `pattern: the strings vary from combo to combo (${new Set(combos).size} kinds)`);
}

// ---- fail soft: a missing alt plays the base and never moves the counter
{
  const c = {};
  const seq = run('light1', 12, has([]), 'auto', c);
  check(seq.every((s) => s === 'light1') && c.light1 === undefined, 'fallback: no alt strip -> always the base, counter untouched');
  const only = run('light3', 8, has(['light1Alt']), 'auto', c);
  check(only.every((s) => s === 'light3'), 'fallback: another base\'s alt does not count');
  check(pickAnim('special', c, ALL, 'auto') === 'special' && pickAnim('guard', c, ALL, 'on') === 'guard' && pickAnim(undefined, c, ALL) === undefined,
    'fallback: names without alts pass through untouched');
}

// ---- ?alts overrides (passed as the mode parameter)
check(ALTS_MODE === 'auto', `?alts: no flag is the alternating pattern (${ALTS_MODE})`);
check(run('heavy', 10, ALL, 'off').every((s) => s === 'heavy'), '?alts=0: never an alt');
check(run('heavy', 10, ALL, 'on').every((s) => s === 'heavyAlt'), '?alts=1: always the alt when the sheet has it');
check(run('heavy', 4, has([]), 'on').every((s) => s === 'heavy'), '?alts=1: still the base when the alt is missing');

// ---- the sheet test the fighter uses: SheetAsset.has is true only for a strip of its own, never through FALLBACK
{
  const meta = { frameWidth: 4, frameHeight: 4, pixelsPerUnit: 1, pivot: [2, 3], animations: { idle: { frames: [0] }, light1: { frames: [1] }, light1Alt: { frames: [2] }, heavy: { frames: [3] } } };
  const sheet = Object.create(SheetAsset.prototype);
  sheet.meta = meta;
  const hasStrip = (n) => sheet.has(n);
  check(hasStrip('light1Alt') && !hasStrip('heavyAlt') && sheet.anim('heavyAlt') === meta.animations.heavy, 'sheet: a missing alt resolves to its base strip but is not "had"');
  const c = {};
  check(run('heavy', 6, hasStrip, 'auto', c).every((s) => s === 'heavy') && Math.abs(run('light1', 64, hasStrip, 'auto', c).filter((s) => s === 'light1Alt').length - 32) <= 1,
    'sheet: only the alt the sheet has is ever picked');
}

console.log(`${failures ? 'FAILED' : 'OK'}: ${passes} passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
