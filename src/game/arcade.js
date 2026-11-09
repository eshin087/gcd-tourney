// Arcade ladder (ENG-127, ADR 0058): one player against the rest of the cast, one round each, on a course whose CPU
// level climbs fight by fight, then a best-of-3 against a dark mirror of their own fighter. A lost fight can be
// retried as often as the player likes; each continue halves the score, and the record says whether a clear needed
// one. This module is the rules and the data only (no DOM, no three.js), so tools/test-arcade.mjs can check it in
// Node: Game runs the fights (startArcade / arcadeFight / arcadeResults), src/ui/arcadeMenus.js draws the screens.

// The CPU level of each rival fight, first to last, and the boss's. The user picked courses over one fixed climb
// (2026-11-09): EASY never meets INSANE, HARD ends on IMPOSSIBLE.
export const COURSES = {
  easy: { label: 'EASY', levels: ['easy', 'easy', 'normal', 'normal', 'normal'], boss: 'hard' },
  normal: { label: 'NORMAL', levels: ['easy', 'normal', 'normal', 'hard', 'hard'], boss: 'insane' },
  hard: { label: 'HARD', levels: ['normal', 'hard', 'hard', 'insane', 'insane'], boss: 'impossible' },
};
export const COURSE_IDS = ['easy', 'normal', 'hard'];

// Tournament stage names, counted back from the last rival (a bigger cast adds more PRELIMINARY rounds in front).
const STAGE_FROM_END = ['GRAND FINAL', 'SEMIFINAL', 'QUARTERFINAL', 'QUALIFIER'];
const FIRST_STAGE = 'PRELIMINARY';
export const BOSS_STAGE = 'SHADOW MATCH';
// A bigger cast keeps the run about this long: that many rivals, drawn at random, then the boss.
export const MAX_RIVALS = 7;

// The dark mirror: the player's own fighter, shaded, with the course's top CPU brain, about a third more health
// (its defense stat, so the HUD bar still reads 0..100 %), quicker ki and two bars at the start of every round.
export const BOSS = {
  rounds: 2, // round wins to take the match: the boss is best of 3, every rival a single round (user 2026-11-09)
  defense: 1.35,
  kiPerFrame: 0.08, // on top of everyone's passive 0.1 (Fighter.update): nearly twice as quick to the next bar
  startKi: 200,
  tint: [0.42, 0.32, 0.7], // multiplies the sprite (SpriteActor `tint`): a dark violet shade
  outline: { color: '#b56bff', amount: 0.9 }, // a glowing rim on the drawn outline (hitFlash.js), so it reads on dark outfits too
  prefix: 'DARK ',
  subtitle: 'Your own shadow',
  color: '#a77bff',
};

// The boss's fighter data: a copy of the player's with the shadow's name, colour and defense. Game.startMatch keeps
// the original for the sheet and portrait (rosterAssets is indexed by the roster's own objects).
export function shadowDef(def) {
  return {
    ...def,
    name: BOSS.prefix + def.name,
    subtitle: BOSS.subtitle,
    color: BOSS.color,
    outline: BOSS.outline,
    stats: { ...def.stats, defense: (def.stats?.defense ?? 1) * BOSS.defense },
  };
}

// Points for a won fight. The breakdown is shown line by line, so every line is one plain rule.
export const SCORE = {
  win: 5000,
  time: 100, // per whole second left on the clock
  health: 5000, // times the share of health left
  combo: 200, // per hit of the fight's best combo
  perfect: 10000, // no damage taken all fight
  level: { easy: 1, normal: 1.5, hard: 2, insane: 3, impossible: 4 },
  boss: 1.5, // the shadow match counts half again
  keep: 0.5, // the share of the score a continue keeps
};

const round10 = (n) => Math.round(n / 10) * 10;

// Small seeded generator for the ladder order, so a seed (tests, ?arcade=..&seed=) replays the same run.
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// The fights of one run. roster: the cast (objects with `id` and an optional `rival` id: the fighter's rival, when
// they are in the cast, is always the GRAND FINAL). Rival levels spread the course's five over however many rivals
// there are.
export function buildLadder(p1, course, roster, seed = 1) {
  const C = COURSES[course] || COURSES.normal;
  const rand = rng(seed);
  const me = roster.find((c) => c.id === p1);
  const others = roster.filter((c) => c.id !== p1).map((c) => c.id);
  for (let i = others.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [others[i], others[j]] = [others[j], others[i]];
  }
  const rivals = others.slice(0, MAX_RIVALS);
  const rival = me?.rival;
  if (rival && others.includes(rival)) {
    // the rival skips the draw for the last slot (a bigger cast may have drawn them out)
    const k = rivals.indexOf(rival);
    if (k >= 0) rivals.splice(k, 1);
    else rivals.pop();
    rivals.push(rival);
  }
  const n = rivals.length;
  const fights = rivals.map((opp, i) => ({
    opp,
    level: C.levels[Math.min(C.levels.length - 1, Math.floor((i * C.levels.length) / n))],
    stage: STAGE_FROM_END[n - 1 - i] ?? FIRST_STAGE,
    boss: false,
    rounds: 1,
  }));
  fights.push({ opp: p1, level: C.boss, stage: BOSS_STAGE, boss: true, rounds: BOSS.rounds });
  return fights;
}

// One won fight's score. s: { won, timeLeft (seconds), hpFrac (0..1), bestCombo (hits), perfect, level, boss }.
// A lost fight scores nothing (the continue is what it costs).
export function scoreFight(s) {
  if (!s.won) return { lines: [], mult: 1, total: 0 };
  const lines = [
    { label: 'VICTORY', pts: SCORE.win },
    { label: 'TIME BONUS', pts: Math.max(0, Math.floor(s.timeLeft)) * SCORE.time },
    { label: 'HEALTH BONUS', pts: round10(Math.max(0, Math.min(1, s.hpFrac)) * SCORE.health) },
  ];
  if (s.bestCombo > 0) lines.push({ label: `BEST COMBO ×${s.bestCombo}`, pts: s.bestCombo * SCORE.combo });
  if (s.perfect) lines.push({ label: 'PERFECT', pts: SCORE.perfect });
  const mult = (SCORE.level[s.level] ?? 1) * (s.boss ? SCORE.boss : 1);
  const sum = lines.reduce((t, l) => t + l.pts, 0);
  return { lines, mult, total: round10(sum * mult) };
}

// One playthrough. The fight under way is `fights[index]`; a won fight moves on, a lost one stays until continued.
export class ArcadeRun {
  constructor({ p1, course = 'normal', roster, seed = (Math.random() * 4294967296) >>> 0 }) {
    this.p1 = p1;
    this.course = COURSES[course] ? course : 'normal';
    this.seed = seed >>> 0;
    this.fights = buildLadder(p1, this.course, roster, this.seed);
    this.index = 0;
    this.score = 0;
    this.continues = 0;
    this.frames = 0; // fight frames played across the run, lost fights included (the clear time)
    this.bestCombo = 0;
    this.results = []; // one scoreFight result per won fight, in order
  }

  get fight() {
    return this.fights[this.index] ?? null;
  }

  get stageNo() {
    return this.index + 1;
  }

  get done() {
    return this.index >= this.fights.length;
  }

  // The end of the current fight. r: scoreFight's input plus `frames` (fight frames it took). Returns the score.
  finish(r) {
    const F = this.fight;
    const res = scoreFight({ ...r, level: F.level, boss: F.boss });
    this.frames += r.frames ?? 0;
    this.bestCombo = Math.max(this.bestCombo, r.bestCombo ?? 0);
    if (r.won) {
      this.score += res.total;
      this.results.push({ stage: F.stage, opp: F.opp, ...res });
      this.index++;
    }
    return res;
  }

  // What the score drops to on a continue (shown before the player picks it).
  get continueScore() {
    return round10(this.score * SCORE.keep);
  }

  continueRun() {
    this.score = this.continueScore;
    this.continues++;
  }
}

// ------------------------------------------------------------ records (this browser only, like the key bindings)
const KEY = 'gcd.arcade';
const defaultStore = () => {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null; // a sandboxed frame throws on the getter itself
  }
};

// { 'normal:naruto': { best, clears, clean, fastest } }: best score, clears, cleared without a continue, the
// quickest clear in fight seconds
export function loadRecords(store = defaultStore()) {
  try {
    const r = JSON.parse(store?.getItem(KEY) || '{}');
    return r && typeof r === 'object' ? r : {};
  } catch {
    return {};
  }
}

export function recordFor(recs, course, id) {
  return recs[`${course}:${id}`] ?? null;
}

// The fighters that have cleared any course (a star on their cell in the arcade character select).
export function clearedIds(recs) {
  const ids = new Set();
  for (const [k, r] of Object.entries(recs)) if (r?.clears > 0) ids.add(k.slice(k.indexOf(':') + 1));
  return ids;
}

// A finished run into the records. Returns the new record and what it beat, for the champion screen.
export function saveClear(run, store = defaultStore()) {
  const recs = loadRecords(store);
  const k = `${run.course}:${run.p1}`;
  const old = recs[k] ?? { best: 0, clears: 0, clean: false, fastest: null };
  const secs = Math.round(run.frames / 60);
  const rec = {
    best: Math.max(old.best, run.score),
    clears: old.clears + 1,
    clean: old.clean || run.continues === 0,
    fastest: old.fastest == null ? secs : Math.min(old.fastest, secs),
  };
  recs[k] = rec;
  try {
    store?.setItem(KEY, JSON.stringify(recs));
  } catch {
    // private mode or a full store: the run still finishes, it just isn't remembered
  }
  return { rec, newBest: run.score > old.best, newFastest: old.fastest == null || secs < old.fastest, first: old.clears === 0 };
}
