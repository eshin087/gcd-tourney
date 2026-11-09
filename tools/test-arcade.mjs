// Arcade ladder rules test (ENG-127, ADR 0058): src/game/arcade.js in Node, with a fake cast and a fake localStorage.
// Run: npm run test:arcade
import assert from 'node:assert/strict';
import {
  COURSES, COURSE_IDS, BOSS, BOSS_STAGE, MAX_RIVALS, SCORE, buildLadder, scoreFight, ArcadeRun,
  loadRecords, recordFor, clearedIds, saveClear,
} from '../src/game/arcade.js';

let passed = 0;
const test = (name, fn) => {
  try {
    fn();
    passed++;
  } catch (e) {
    console.error(`FAIL ${name}\n`, e);
    process.exitCode = 1;
  }
};

const CAST = [
  { id: 'naruto', rival: 'sasuke' }, { id: 'sasuke', rival: 'naruto' }, { id: 'killua' }, { id: 'gojo' }, { id: 'goku' }, { id: 'luffy' },
];
const LEVEL_ORDER = ['easy', 'normal', 'hard', 'insane', 'impossible'];

test('a six-fighter cast: five rivals, one round each, then the best-of-3 dark mirror', () => {
  for (const course of COURSE_IDS) {
    const L = buildLadder('killua', course, CAST, 7);
    assert.equal(L.length, 6);
    const rivals = L.slice(0, 5);
    assert.deepEqual(new Set(rivals.map((f) => f.opp)), new Set(['naruto', 'sasuke', 'gojo', 'goku', 'luffy']));
    assert.ok(rivals.every((f) => !f.boss && f.rounds === 1));
    assert.deepEqual(rivals.map((f) => f.level), COURSES[course].levels);
    const boss = L[5];
    assert.deepEqual(boss, { opp: 'killua', level: COURSES[course].boss, stage: BOSS_STAGE, boss: true, rounds: BOSS.rounds });
    assert.deepEqual(rivals.map((f) => f.stage), ['PRELIMINARY', 'QUALIFIER', 'QUARTERFINAL', 'SEMIFINAL', 'GRAND FINAL']);
  }
});

test('the HARD course ends on IMPOSSIBLE and EASY never meets INSANE', () => {
  assert.equal(buildLadder('goku', 'hard', CAST, 1).at(-1).level, 'impossible');
  assert.ok(buildLadder('goku', 'easy', CAST, 1).every((f) => f.level !== 'insane' && f.level !== 'impossible'));
});

test('a fighter\'s rival is always the GRAND FINAL', () => {
  for (let seed = 1; seed < 40; seed++) {
    const L = buildLadder('naruto', 'normal', CAST, seed);
    assert.equal(L[4].opp, 'sasuke');
    assert.equal(L[4].stage, 'GRAND FINAL');
  }
});

test('the same seed draws the same ladder, other seeds shuffle it', () => {
  const order = (seed) => buildLadder('gojo', 'normal', CAST, seed).map((f) => f.opp).join();
  assert.equal(order(123), order(123));
  const seen = new Set();
  for (let seed = 1; seed < 30; seed++) seen.add(order(seed));
  assert.ok(seen.size > 5, `only ${seen.size} different orders`);
});

test('a big cast keeps the run at MAX_RIVALS rivals, levels climbing, rival still last', () => {
  const big = [{ id: 'a', rival: 'k' }, ...'bcdefghijkl'.split('').map((id) => ({ id }))];
  for (let seed = 1; seed < 30; seed++) {
    const L = buildLadder('a', 'normal', big, seed);
    assert.equal(L.length, MAX_RIVALS + 1);
    const rivals = L.slice(0, -1);
    assert.equal(new Set(rivals.map((f) => f.opp)).size, MAX_RIVALS);
    assert.ok(!rivals.some((f) => f.opp === 'a'));
    assert.equal(rivals.at(-1).opp, 'k');
    const lv = rivals.map((f) => LEVEL_ORDER.indexOf(f.level));
    assert.ok(lv.every((v, i) => i === 0 || v >= lv[i - 1]), `levels go down: ${lv}`);
    assert.equal(rivals[0].stage, 'PRELIMINARY');
    assert.equal(rivals.at(-1).stage, 'GRAND FINAL');
  }
});

test('a two-fighter cast: one rival, then the boss', () => {
  const L = buildLadder('naruto', 'normal', CAST.slice(0, 2), 5);
  assert.deepEqual(L.map((f) => [f.opp, f.stage]), [['sasuke', 'GRAND FINAL'], ['naruto', BOSS_STAGE]]);
});

test('scoring: every line is one plain rule, times the level', () => {
  const s = scoreFight({ won: true, timeLeft: 42.7, hpFrac: 0.5, bestCombo: 12, perfect: false, level: 'normal' });
  assert.deepEqual(s.lines.map((l) => l.pts), [5000, 4200, 2500, 2400]);
  assert.equal(s.mult, 1.5);
  assert.equal(s.total, 21150);
  const p = scoreFight({ won: true, timeLeft: 99, hpFrac: 1, bestCombo: 0, perfect: true, level: 'impossible', boss: true });
  assert.equal(p.lines.at(-1).label, 'PERFECT');
  assert.equal(p.total, (5000 + 9900 + 5000 + 0 + SCORE.perfect) * 4 * SCORE.boss);
  assert.deepEqual(scoreFight({ won: false, timeLeft: 50, hpFrac: 0, bestCombo: 30, level: 'hard' }), { lines: [], mult: 1, total: 0 });
});

test('a run: losing stays on the fight, a continue halves the score, winning moves on to the end', () => {
  const run = new ArcadeRun({ p1: 'luffy', course: 'normal', roster: CAST, seed: 9 });
  const win = { won: true, timeLeft: 50, hpFrac: 1, bestCombo: 10, perfect: true, frames: 3000 };
  run.finish(win);
  assert.equal(run.index, 1);
  const s1 = run.score;
  assert.ok(s1 > 0);
  const lost = run.finish({ won: false, timeLeft: 0, hpFrac: 0, bestCombo: 25, frames: 2000 });
  assert.equal(lost.total, 0);
  assert.equal(run.index, 1, 'a lost fight does not move on');
  assert.equal(run.bestCombo, 25, 'a lost fight\'s combo still counts for the run');
  assert.equal(run.continueScore, Math.round(s1 / 2 / 10) * 10);
  run.continueRun();
  assert.equal(run.continues, 1);
  while (!run.done) run.finish(win);
  assert.equal(run.results.length, 6);
  assert.equal(run.frames, 3000 * 6 + 2000);
  assert.equal(run.fight, null);
  assert.equal(run.results.at(-1).stage, BOSS_STAGE);
});

test('an unknown course falls back to NORMAL', () => {
  assert.equal(new ArcadeRun({ p1: 'goku', course: 'nightmare', roster: CAST }).course, 'normal');
});

const fakeStore = () => {
  const m = new Map();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, String(v)), m };
};

test('records: best score, clears, a clean clear and the fastest time', () => {
  const store = fakeStore();
  const run = new ArcadeRun({ p1: 'gojo', course: 'hard', roster: CAST, seed: 3 });
  run.score = 50000;
  run.frames = 60 * 400;
  run.continues = 1;
  let r = saveClear(run, store);
  assert.deepEqual(r, { rec: { best: 50000, clears: 1, clean: false, fastest: 400 }, newBest: true, newFastest: true, first: true });
  run.score = 40000;
  run.frames = 60 * 300;
  run.continues = 0;
  r = saveClear(run, store);
  assert.deepEqual(r.rec, { best: 50000, clears: 2, clean: true, fastest: 300 });
  assert.equal(r.newBest, false);
  assert.equal(r.newFastest, true);
  const recs = loadRecords(store);
  assert.deepEqual(recordFor(recs, 'hard', 'gojo'), r.rec);
  assert.equal(recordFor(recs, 'easy', 'gojo'), null);
  assert.deepEqual([...clearedIds(recs)], ['gojo']);
});

test('records never throw: no store, a broken store, junk in the store', () => {
  const run = new ArcadeRun({ p1: 'goku', course: 'easy', roster: CAST });
  assert.equal(saveClear(run, null).rec.clears, 1);
  const broken = { getItem: () => { throw new Error('denied'); }, setItem: () => { throw new Error('full'); } };
  assert.equal(saveClear(run, broken).rec.clears, 1);
  assert.deepEqual(loadRecords({ getItem: () => '{not json' }), {});
  assert.deepEqual(loadRecords({ getItem: () => 'null' }), {});
});

if (!process.exitCode) console.log(`test-arcade: ${passed} passed`);
