// Test lab (ADR 0018): the training room plus a panel to play any move of either fighter in one tap, step through
// all 42 animations with their hit and hurt boxes on the real art, replay the shared mechanics (clashes, throws,
// dodges, bounces) and change time and the dummy. A separate page, opened from SELECT MODE → LAB or directly:
//   /lab.html?p1=naruto&p2=sasuke
// On a wide screen the panel docks beside the game (which shrinks to the space left); every tab is the same kind of
// list: foldable groups of rows, ▶ on the left, a short note on the right, and the text sizes itself to fit.
// Keys: the solo keyboard plays P1 as usual; P pauses, . steps one frame, ` hides the panel.
import { PixelRenderer } from '../core/renderer.js';
import { InputManager } from '../core/input.js';
import { audio } from '../core/audio.js';
import { Game } from '../game/game.js';
import { TouchControls, IS_TOUCH_DEVICE } from '../core/touch.js';
import { ROSTER } from '../characters/index.js';
import { ANIM_GUIDE } from '../art/animGuide.js';
import { ARENA_LIMIT } from '../game/constants.js';
import { DummyBrain, CPU_LEVELS } from '../game/ai.js';
import { ScriptBrain, ReplayBrain, recordFrame, moveList, SCENARIOS, SCENARIO_GROUPS } from './scripts.js';
import { HIT_FLASH } from '../game/moves.js';
import { FLASH_STYLES } from '../game/hitFlash.js';
import { MasterBrain } from '../game/aiMaster.js';
import { PERSONAS } from '../game/aiCombo.js';
import './lab.css';

const renderer = new PixelRenderer(document.getElementById('app'));
const input = new InputManager();
if (IS_TOUCH_DEVICE) input.lastDevice = 'touch';
const game = new Game(renderer, input);
window.game = game; // the same console handle as the game page
window.lab = { get state() { return L; }, tick: (dt = 1 / 60) => tick(dt) }; // console access for tests
const touch = new TouchControls({ onPause: () => {} });
input.touch = touch;
game.touch = touch;
window.addEventListener('pointerdown', () => audio.init(), { once: true });
window.addEventListener('keydown', () => audio.init(), { once: true });

const qs = new URLSearchParams(location.search);
const ids = ROSTER.map((c) => c.id);
const L = {
  p1: ids.includes(qs.get('p1')) ? qs.get('p1') : ids[0],
  p2: ids.includes(qs.get('p2')) ? qs.get('p2') : ids[1],
  speed: 1, paused: false, step: 0, dummy: 'stand', clashLevel: 'normal', infiniteKi: true, tab: 'moves',
  running: null, viewer: null, rec: [], recording: false, replay: false, note: '',
  cpuP1: null, // YOU played by the showman CPU with this combo persona (ADR 0026), or null
  fold: new Set(), // folded groups, as 'tab:group'
  open: null, // the scenario row showing its full description
  scroll: {}, // list scroll per tab, so a ▶ (which repaints the panel) keeps your place
};
// the tab and its chips survive a reload (a per-viewer convenience: storage may be blocked)
const SAVED = 'gcd.lab.view';
try {
  const v = JSON.parse(localStorage.getItem(SAVED) || 'null');
  if (v?.tab) L.tab = v.tab;
  if (Array.isArray(v?.fold)) L.fold = new Set(v.fold);
} catch { /* private window: defaults */ }
const saveView = () => { try { localStorage.setItem(SAVED, JSON.stringify({ tab: L.tab, fold: [...L.fold] })); } catch { /* ignore */ } };

// Animation groups for the viewer, in ANIM_GUIDE terms. An alt strip (altOf) sits right after its base as a small
// "alt" chip, so a pair is checked together; a name added to the guide without a group here still shows, under Other.
const ANIM_GROUPS = [
  ['Movement', ['idle', 'run', 'dash', 'backDash', 'superDash', 'jumpSquat', 'jumpUp', 'jumpFall', 'land', 'vanish', 'charge']],
  ['Attacks', ['light1', 'light2', 'light3', 'light4', 'heavy', 'airLight1', 'airLight2', 'airLight3', 'airHeavy', 'throw']],
  ['Specials', ['special', 'specialForward', 'specialUp', 'specialDown', 'beamCharge', 'beamFire', 'superPose', 'beamStruggle', 'beamStruggleAir']],
  ['Guard & hit', ['guard', 'block', 'hurtHigh', 'hurtLow', 'stagger', 'launched', 'spin', 'airRecover', 'down', 'getup', 'ko']],
  ['Tech', ['techGround', 'techRoll', 'wallTech']],
  ['Show', ['intro', 'taunt', 'win']],
];
const ALTS_OF = {}; // base name -> its alt strips
for (const [n, g] of Object.entries(ANIM_GUIDE)) if (g.altOf) (ALTS_OF[g.altOf] ??= []).push(n);
const animGroups = () => {
  const seen = new Set(), out = [];
  for (const [name, list] of ANIM_GROUPS) {
    const names = list.filter((n) => ANIM_GUIDE[n] && !seen.has(n));
    for (const n of names) [n, ...(ALTS_OF[n] ?? [])].forEach((x) => seen.add(x));
    if (names.length) out.push([name, names]);
  }
  const rest = Object.keys(ANIM_GUIDE).filter((n) => !seen.has(n));
  if (rest.length) out.push(['Other', rest]);
  return out;
};

// ------------------------------------------------------------------ helpers
const el = (tag, cls = '', html = '') => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  return e;
};
const button = (label, onclick, cls = '') => {
  const b = el('button', 'lab-btn ' + cls, label);
  b.addEventListener('mousedown', (e) => e.preventDefault()); // keep keyboard focus on the game
  b.addEventListener('click', (e) => { e.stopPropagation(); audio.init(); onclick(b); });
  return b;
};
const fighters = () => game.fighters;
const dummyBrain = () => {
  const f = fighters()[1];
  return L.replay && L.rec.length ? new ReplayBrain(f, L.rec, true) : new DummyBrain(f, L.dummy, L.clashLevel);
};

function start() {
  L.viewer = null;
  L.running = null;
  game.startTraining({ p1: L.p1, p2: L.p2, dummy: L.dummy, infiniteKi: L.infiniteKi });
  game.menus.hide(); // the lab panel replaces the training panel
  game.brains[1] = dummyBrain();
  if (L.cpuP1) cpuYou(L.cpuP1, false);
  const url = new URL(location.href);
  url.searchParams.set('p1', L.p1);
  url.searchParams.set('p2', L.p2);
  history.replaceState(null, '', url);
  render();
}

// Stand them `gap` apart (the dummy near the barrier for wall bounces, `room` units from it) with fresh state.
function place(gap, nearWall = false, room = 0.9) {
  game.resetTrainingPositions();
  const [a, b] = fighters();
  const cx = nearWall ? ARENA_LIMIT - room - gap / 2 : 0;
  a.reset(cx - gap / 2, 0);
  b.reset(cx + gap / 2, 0);
  game.faceEachOther();
  game.cam.snap();
}

// Run timelines on P1 (and the dummy); the keyboard and touch take P1 back when P1's script ends.
function runScripts(stepsA, stepsB, label) {
  stopScripts();
  const [a, b] = fighters();
  game.input.bind(game.pads, 'cpu'); // nobody's hands on P1 while the script plays
  const run = { label, a: true, b: !!stepsB?.length };
  L.running = run;
  const end = (who) => {
    if (L.running !== run) return;
    run[who] = false;
    if (who === 'a' && L.cpuP1) {
      L.running = null; // (so cpuYou's stopScripts leaves the dummy's script alone)
      cpuYou(L.cpuP1, false);
      L.running = run;
    } else if (who === 'a') {
      game.brains[0] = null;
      game.input.bind(game.pads, 'solo');
      game.input.flush();
    } else game.brains[1] = dummyBrain();
    if (!run.a && !run.b) L.running = null;
    paintStatus();
  };
  game.brains[0] = new ScriptBrain(a, stepsA, () => end('a'));
  game.brains[1] = run.b ? new ScriptBrain(b, stepsB, () => end('b')) : dummyBrain();
  paintStatus();
}

function stopScripts() {
  if (!L.running) return;
  L.running = null;
  game.brains[0] = null;
  game.brains[1] = dummyBrain();
  game.input.bind(game.pads, 'solo');
}

// YOU played by the showman CPU with a combo persona ('auto' = drawn from the kit), against the dummy: with DUMMY
// STAND it never techs, so every route the combo composer plans shows (its log is in the readout). null = you again.
function cpuYou(persona, paint = true) {
  stopScripts();
  L.cpuP1 = persona;
  if (persona) {
    game.debugCombos = true; // keep the composer's per-combo log (window.comboLog)
    window.comboLog = window.comboLog || [];
    game.comboLog = game.comboLog || []; // its recent routes (the readout shows the last)
    game.input.bind(game.pads, 'cpu');
    game.brains[0] = new MasterBrain(fighters()[0], 'showman', (Math.random() * 4294967296) >>> 0, persona === 'auto' ? null : persona);
  } else {
    game.brains[0] = null;
    game.input.bind(game.pads, 'solo');
    game.input.flush();
  }
  if (paint) render();
}

function playMove(row) {
  exitViewer();
  place(row.range);
  const [a] = fighters();
  a.ki = row.kiFrom ?? Math.max(a.ki, row.ki); // kiFrom: a row that needs an exact start (charge to MAX)
  runScripts(row.steps, null, row.name);
  if (row.kiFrom != null) L.running.ownKi = true; // the infinite meter waits while it plays (it fills from empty)
}

function playScenario(sc) {
  exitViewer();
  const defs = fighters().map((f) => f.def);
  L.note = sc.needs?.(defs) ?? '';
  L.open = sc.id; // its row opens on the full description
  place(sc.setup.gap, sc.setup.nearWall, sc.setup.room);
  const [a, b] = fighters();
  a.ki = Math.max(a.ki, sc.setup.kiA ?? 0);
  b.ki = Math.max(b.ki, sc.setup.kiB ?? 0);
  const steps = (s) => (typeof s === 'function' ? s(defs) : s);
  runScripts(steps(sc.a), steps(sc.b), sc.name);
  render();
}

// ------------------------------------------------------------------ animation viewer
function viewAnim(name) {
  stopScripts();
  if (!L.viewer) place(3);
  const a = fighters()[0];
  a.setState('idle');
  a.actor.play(name, true);
  a.actor.headCheck = true; // the scale gate's head boxes (boxViewer.js)
  L.viewer = { name, playing: false };
  game.showBoxes = true;
  render();
}

function viewerFrame(d) {
  const V = L.viewer, act = fighters()[0].actor;
  if (!V) return;
  const n = act.anim.frames.length;
  act.fi = (act.fi + d + n) % n;
  act.setFrame(act.anim.frames[act.fi]);
  paintViewer();
}

function exitViewer() {
  if (!L.viewer) return;
  L.viewer = null;
  fighters()[0].actor.headCheck = false;
  fighters()[0].setState('idle');
  render();
}

function viewerInfo() {
  const f = fighters()[0], act = f.actor, A = act.anim, V = L.viewer;
  const own = f.asset.meta?.animations?.[V.name];
  const used = Object.entries(f.asset.meta?.animations || {}).find(([, v]) => v === A)?.[0];
  const ph = A.phases?.length === 3 ? A.phases : null;
  const phase = ph ? (act.fi < ph[0] ? 'startup' : act.fi < ph[0] + ph[1] ? 'active' : 'recovery') : (A.loop ? 'loop' : '');
  const boxes = (k) => f.asset.boxes(act.frame, k, 1)?.length ?? 0;
  const sa = f.asset.meta?.scaleAudit?.anims?.[V.name], fh = sa?.frames?.[act.fi];
  const off = sa && ['uniform', 'drift', 'pop'].includes(sa.verdict);
  return [
    `<b>${V.name}</b> ${own ? '' : `<span class="lab-warn">not in this sheet: falls back to ${used ?? '?'}</span>`}`,
    `frame ${act.fi + 1} / ${A.frames.length} · sheet cell ${act.frame}${f.asset.textures?.length > 1 ? ` (page ${act.page + 1} of ${f.asset.textures.length})` : ''} · ${A.durations?.[act.fi] ?? 100} ms${phase ? ' · ' + phase : ''}`,
    ph ? `phases ${ph.join(' / ')} (startup / active / recovery)` : '',
    `boxes: ${boxes('hurt')} hurt, ${boxes('hit')} hit · art: ${f.asset.source ?? (f.asset.meta?.source || 'baked')}`,
    sa ? `head ${fh == null ? '-' : fh.toFixed(2)} of the idle's · strip ${sa.head == null ? '-' : sa.head.toFixed(2)} <span class="${off ? 'lab-warn' : ''}">${sa.verdict}</span> (white box = idle head size, gold = this frame's head)` : '',
    `<i>${ANIM_GUIDE[V.name]?.pose ?? ''}</i>`,
  ].filter(Boolean).join('<br>');
}

// ------------------------------------------------------------------ record and replay
function toggleRecord() {
  if (L.recording) {
    L.recording = false;
  } else {
    L.rec = [];
    L.recording = true;
    L.replay = false;
    game.brains[1] = dummyBrain();
  }
  render();
}

function toggleReplay() {
  if (!L.rec.length) return;
  L.replay = !L.replay;
  game.brains[1] = dummyBrain();
  render();
}

// ------------------------------------------------------------------ panel
const root = el('div', 'lab');
const fab = button('LAB', () => { root.classList.toggle('hidden'); dock(); }, 'lab-fab');
document.body.append(root, fab);

// Docked: the game, its HUD and overlay take the space left of the panel (style.css + lab.css), so nothing is covered.
// A phone keeps the panel as a drawer over the game: docking there would leave the fight a sliver.
let docked = null;
function dock() {
  const on = !root.classList.contains('hidden') && window.innerWidth >= 900;
  if (on === docked) return;
  docked = on;
  document.body.classList.toggle('lab-docked', on);
  window.dispatchEvent(new Event('resize')); // the renderer and overlay re-measure their (narrower) box
}
window.addEventListener('resize', () => { dock(); fit(); });

const TABS = [['moves', 'Moves'], ['scen', 'Scenarios'], ['anims', 'Animations'], ['tools', 'Tools']];

function render() {
  const oldBody = root.querySelector('.lab-body');
  if (oldBody) L.scroll[L.tab] = oldBody.scrollTop;
  root.innerHTML = '';
  // one line: back to the menu, YOU vs DUMMY as dropdowns, swap
  const top = el('div', 'lab-top');
  const pick = (key, label) => {
    const sel = el('select', 'lab-sel');
    sel.title = label;
    for (const c of ROSTER) sel.append(Object.assign(document.createElement('option'), { value: c.id, textContent: c.name }));
    sel.value = L[key];
    sel.style.color = ROSTER.find((c) => c.id === L[key]).color;
    sel.addEventListener('change', () => { L[key] = sel.value; sel.blur(); start(); });
    return sel;
  };
  top.append(button('‹', () => { location.href = '/'; }, 'lab-back'), el('span', 'lab-k', 'YOU'), pick('p1', 'YOU'),
    el('span', 'lab-vs', 'vs'), el('span', 'lab-k', 'DUMMY'), pick('p2', 'DUMMY'),
    button('⇄', () => { [L.p1, L.p2] = [L.p2, L.p1]; start(); }, 'lab-swap'));
  top.lastChild.title = 'swap fighters';
  const tabs = el('div', 'lab-tabs');
  for (const [id, label] of TABS) tabs.append(button(label, () => { L.tab = id; saveView(); render(); }, L.tab === id ? 'on' : ''));
  const body = el('div', 'lab-body');
  const inner = el('div', 'lab-fit');
  inner.append(L.tab === 'moves' ? movesTab() : L.tab === 'anims' ? animsTab() : L.tab === 'scen' ? scenariosTab() : toolsTab());
  body.append(inner);
  root.append(top, tabs, body, el('div', 'lab-status'));
  fit();
  body.scrollTop = L.scroll[L.tab] ?? 0;
  paintStatus();
  paintViewer();
}

// Size the list's text so the whole tab fits the panel without scrolling: the largest step from FIT_MAX down to
// FIT_MIN that fits. Below FIT_MIN (a phone, a short window) it stays readable and scrolls instead.
const FIT_MIN = 0.74, FIT_MAX = 1.3;
function fit() {
  const body = root.querySelector('.lab-body'), inner = body?.firstChild;
  if (!inner || root.classList.contains('hidden')) return;
  let lo = FIT_MIN, hi = FIT_MAX;
  const fits = (s) => { inner.style.fontSize = s + 'em'; return inner.scrollHeight <= body.clientHeight; };
  if (fits(hi)) return;
  for (let i = 0; i < 7; i++) { const m = (lo + hi) / 2; if (fits(m)) lo = m; else hi = m; }
  fits(lo);
}

// A foldable group: the header shows its name and count; a tap folds or opens it.
function group(box, id, name, count = '', info = '') {
  const key = L.tab + ':' + id, folded = L.fold.has(key);
  const head = el('button', 'lab-ghead' + (folded ? ' folded' : ''), `<span class="lab-caret">${folded ? '▸' : '▾'}</span>${name}${count ? `<span class="lab-count">${count}</span>` : ''}`);
  if (info) head.title = info;
  head.addEventListener('mousedown', (e) => e.preventDefault());
  head.addEventListener('click', (e) => { e.stopPropagation(); folded ? L.fold.delete(key) : L.fold.add(key); saveView(); render(); });
  box.append(head);
  if (folded) return null;
  const list = el('div', 'lab-list');
  box.append(list);
  return list;
}
// The one row: ▶ (optional), a name, a muted note on the right, then any extra controls.
function item(list, { play, name, note = '', cls = '', onName, extra = [] }) {
  const r = el('div', 'lab-item ' + cls);
  if (play) r.append(button('▶', play, 'play'));
  const n = el('span', 'lab-name', name);
  if (onName) { n.classList.add('tap'); n.addEventListener('click', onName); }
  const t = el('span', 'lab-note', note);
  t.title = note; // the full text when the note is cut short
  r.append(n, t, ...extra);
  list.append(r);
  return r;
}

function movesTab() {
  const box = el('div');
  const groups = [];
  for (const row of moveList(fighters()[0].def)) {
    let g = groups.find(([name]) => name === row.group);
    if (!g) groups.push(g = [row.group, []]);
    g[1].push(row);
  }
  for (const [name, rows] of groups) {
    const list = group(box, name, name, rows.length);
    if (list) for (const row of rows) item(list, { play: () => playMove(row), name: row.name, note: row.info });
  }
  return box;
}

function animsTab() {
  const box = el('div');
  const f = fighters()[0], have = f.asset.meta?.animations;
  const missing = (n) => !!have && !have[n];
  if (L.viewer) {
    const ctl = el('div', 'lab-ctl');
    ctl.append(
      button('◀', () => viewerFrame(-1)),
      button(L.viewer.playing ? '❚❚' : '▶', () => { L.viewer.playing = !L.viewer.playing; render(); }),
      button('▶|', () => viewerFrame(1)),
      button(game.showBoxes ? 'boxes on' : 'boxes off', () => { game.showBoxes = !game.showBoxes; render(); }, game.showBoxes ? 'on' : ''),
      button('done', exitViewer),
    );
    box.append(ctl, el('div', 'lab-info lab-viewer'));
  }
  for (const [name, names] of animGroups()) {
    const all = names.flatMap((n) => [n, ...(ALTS_OF[n] ?? [])]);
    const list = group(box, name, name, `${all.filter((n) => !missing(n)).length}/${all.length}`);
    if (!list) continue;
    list.classList.add('cols');
    for (const n of names) {
      const alts = (ALTS_OF[n] ?? []).map((a) => {
        const b = button('alt', () => viewAnim(a), ['lab-alt', L.viewer?.name === a ? 'on' : '', missing(a) ? 'miss' : ''].join(' '));
        b.title = a + (missing(a) ? ': not in this sheet' : '');
        return b;
      });
      item(list, {
        play: () => viewAnim(n), name: n, note: missing(n) ? 'fallback' : '', extra: alts,
        cls: [L.viewer?.name === n ? 'on' : '', missing(n) ? 'miss' : ''].join(' '),
      });
    }
  }
  box.append(el('p', 'lab-help', 'alt = the alternate strip. Dim = not in this fighter\'s sheet (plays a fallback). Boxes: hurt blue, hit red; head check: idle size white, this frame gold.'));
  return box;
}

function scenariosTab() {
  const box = el('div');
  const defs = fighters().map((f) => f.def);
  const groupOf = (sc) => sc.group ?? 'other', known = SCENARIO_GROUPS.map((g) => g.id);
  const extra = [...new Set(SCENARIOS.map(groupOf))].filter((id) => !known.includes(id)).map((id) => ({ id, name: id }));
  const ok = (sc) => !sc.needs?.(defs);
  for (const g of [...SCENARIO_GROUPS, ...extra]) {
    const scs = SCENARIOS.filter((sc) => groupOf(sc) === g.id);
    if (!scs.length) continue;
    const list = group(box, g.id, g.name, `${scs.filter(ok).length}/${scs.length}`, g.info);
    if (!list) continue;
    for (const sc of scs) {
      const need = sc.needs?.(defs), open = L.open === sc.id;
      item(list, {
        play: () => playScenario(sc), name: sc.name, note: need ? 'needs another pair' : sc.brief ?? '',
        cls: (need ? 'miss' : '') + (open ? ' open' : ''), onName: () => { L.open = open ? null : sc.id; render(); },
      });
      if (open) list.append(el('div', 'lab-detail', sc.info + (need ? `<br><span class="lab-warn">⚠ ${need}</span>` : '')));
    }
  }
  box.append(el('p', 'lab-help', 'Tap a name for its full description. Dim rows need another pair of fighters.'));
  return box;
}

function toolsTab() {
  const box = el('div');
  const chip = (label, on, fn) => button(label, fn, on ? 'on' : '');
  const row = (list, name, ...ctl) => {
    const seg = el('span', 'lab-seg');
    seg.append(...ctl);
    item(list, { name, extra: [seg], cls: 'tool' });
  };

  let list = group(box, 'time', 'Time', '', 'P pauses, . steps one frame');
  if (list) {
    row(list, 'Speed', ...[[1, '1×'], [0.5, '½×'], [0.25, '¼×'], [0.1, '⅒×']].map(([s, t]) => chip(t, L.speed === s, () => { L.speed = s; render(); })));
    row(list, 'Step', chip(L.paused ? '▶ play' : '❚❚ pause', L.paused, () => { L.paused = !L.paused; render(); }),
      button('+1', () => { L.paused = true; L.step += 1; render(); }), button('+10', () => { L.paused = true; L.step += 10; render(); }));
  }
  list = group(box, 'dummy', 'Dummy', '', 'what the other fighter does');
  if (list) {
    row(list, 'Does', ...[['stand', 'stand'], ['guard', 'guard'], ['jump', 'jump'], ['cpu', 'CPU']].map(([id, t]) => chip(t, !L.replay && L.dummy === id, () => {
      L.dummy = id;
      L.replay = false;
      game.setDummy(id);
      game.brains[1] = dummyBrain();
      render();
    })));
    // how well the dummy plays a rhythm clash (its CPU level's timing); a running scenario script keeps its brain
    row(list, 'Clash skill', ...CPU_LEVELS.map((id) => chip(id, L.clashLevel === id, () => {
      L.clashLevel = id;
      if (game.brains[1] instanceof DummyBrain) game.brains[1] = dummyBrain();
      render();
    })));
    row(list, 'Record', chip(L.recording ? '■ stop' : '● record you', L.recording, toggleRecord),
      chip(L.replay ? 'replaying' : `replay ${(L.rec.length / 60).toFixed(1)} s`, L.replay, toggleReplay));
  }
  list = group(box, 'you', 'You');
  if (list) {
    row(list, 'Meter', chip('infinite', L.infiniteKi, () => { L.infiniteKi = true; game.trainingCfg.infiniteKi = true; render(); }),
      chip('normal', !L.infiniteKi, () => { L.infiniteKi = false; game.trainingCfg.infiniteKi = false; render(); }));
    // the combo composer (ADR 0026): YOU as the showman CPU with a persona; its route shows in the readout
    row(list, 'CPU plays you', chip('off', !L.cpuP1, () => cpuYou(null)), chip('auto', L.cpuP1 === 'auto', () => cpuYou('auto')),
      ...Object.keys(PERSONAS).map((p) => chip(p, L.cpuP1 === p, () => cpuYou(p))));
  }
  list = group(box, 'display', 'Display');
  if (list) {
    row(list, 'Hit boxes', chip('on', game.showBoxes, () => { game.showBoxes = true; render(); }), chip('off', !game.showBoxes, () => { game.showBoxes = false; render(); }));
    // A/B the victim's hit flash live (ENG-064): the table is read every frame, so the next hit shows the change
    row(list, 'Hit flash', ...FLASH_STYLES.map((s) => chip(s, HIT_FLASH.style === s, () => { HIT_FLASH.style = s; render(); })));
    row(list, 'Flash strength', ...[0.5, 0.75, 1, 1.25].map((v) => chip(v + '×', HIT_FLASH.strength === v, () => { HIT_FLASH.strength = v; render(); })));
  }
  list = group(box, 'reset', 'Reset');
  if (list) row(list, 'Reset', button('positions', () => { stopScripts(); place(3.2); }), button('refill HP', () => { for (const f of fighters()) f.hp = 1000; }));
  box.append(el('p', 'lab-help', 'Keys: P pause, . one frame, ` hides the panel. Record: play a few seconds, stop, and the dummy loops it back at you. The Sprite Lab is at /sprites.html.'));
  return box;
}

function paintViewer() {
  const v = root.querySelector('.lab-viewer');
  if (v && L.viewer) v.innerHTML = viewerInfo();
}

let statusT = 0;
function paintStatus() {
  const s = root.querySelector('.lab-status');
  if (!s || fighters().length < 2) return;
  const line = (f) => `<b style="color:${f.def.color}">${f.def.name}</b> ${f.state}${f.moveName ? '/' + f.moveName : ''}${f.kitState ? '/' + f.kitState.kind + (f.kitState.phase ? ':' + f.kitState.phase : '') : ''} t${f.t} · hp ${f.hp} · ki ${Math.round(f.ki)}${f.combo ? ` · combo ${f.combo} (${f.comboDmg})` : ''}`;
  // CPU YOU: its persona and the combo route it is composing (or the last one)
  const z = !L.running && game.brains[0]?.composer, last = game.comboLog?.[0];
  const comp = z ? `<br><span class="lab-run">CPU ${z.p.name}: ${z.live ? `${z.tier} ${z.target} · ${z.route.join(' › ')}` : last ? `last ${last.hits} hits · ${last.edges.join(' › ')}` : 'neutral'}</span>` : '';
  s.innerHTML = `${L.running ? `<span class="lab-run">▶ ${L.running.label}</span><br>` : ''}${L.recording ? '<span class="lab-rec">● REC</span> ' : ''}${line(fighters()[0])}<br>${line(fighters()[1])}${comp}`;
}

// ------------------------------------------------------------------ loop
window.addEventListener('keydown', (e) => {
  if (e.code === 'KeyP') { L.paused = !L.paused; render(); }
  else if (e.code === 'Period') { L.paused = true; L.step += 1; }
  else if (e.code === 'Backquote') { root.classList.toggle('hidden'); dock(); }
});

let last = performance.now();
function loop(now) {
  requestAnimationFrame(loop); // schedule first: an exception in one frame must never freeze the lab
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  tick(dt);
}

// one lab frame; exposed as window.lab.tick so a hidden tab (no requestAnimationFrame) can be driven from the console
function tick(dt) {
  if (game.fighters.length < 2) { game.frame(dt); return; }
  const meter = L.infiniteKi && !L.running?.ownKi;
  if (game.trainingCfg) game.trainingCfg.infiniteKi = meter; // the training room refills P1 inside the frame
  if (L.viewer) {
    if (L.viewer.playing) {
      const act = fighters()[0].actor;
      act.update(dt * 1000 * L.speed);
      paintViewer();
    }
    game.render(dt); // the sim stays paused; the camera still settles on the fighter
  } else if (L.paused) {
    // one fixed frame per step, so frame data can be read off the readout
    while (L.step > 0) { L.step--; game.frame(1 / 60); }
    game.render(0);
  } else game.frame(dt * L.speed);
  if (meter) for (const f of game.fighters) f.ki = Math.max(f.ki, 300);
  if (L.recording && !L.running) {
    L.rec.push(recordFrame(fighters()[0]));
    if (L.rec.length >= 600) { L.recording = false; render(); }
  }
  if (++statusT % 6 === 0) paintStatus();
}

// the lab starts in training at once: its loading screen stays up until every fighter is in (ENG-102)
const ready = game.init({ waitAll: true }).then(() => game.assetsReady);
ready.then(() => {
  start();
  dock();
  requestAnimationFrame(loop);
});
