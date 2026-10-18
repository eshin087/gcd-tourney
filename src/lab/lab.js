// Test lab (ADR 0018): the training room plus a panel to play any move of either fighter in one tap, step through
// all 42 animations with their hit and hurt boxes on the real art, replay the shared mechanics (clashes, throws,
// dodges, bounces) and change time and the dummy. A separate page, opened from SELECT MODE → LAB or directly:
//   /lab.html?p1=naruto&p2=sasuke
// Each tab lists its rows in groups with a chip bar to show one group, so related checks sit next to each other.
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
  filter: { moves: 'all', anims: 'all', scen: 'all' }, // the group chip picked on each tab
  open: null, // the scenario row showing its full description
  scroll: {}, // list scroll per tab + filter, so a ▶ (which repaints the panel) keeps your place
};
// the tab and its chips survive a reload (a per-viewer convenience: storage may be blocked)
const SAVED = 'gcd.lab.view';
try {
  const v = JSON.parse(localStorage.getItem(SAVED) || 'null');
  if (v?.tab) L.tab = v.tab;
  if (v?.filter) Object.assign(L.filter, v.filter);
} catch { /* private window: defaults */ }
const saveView = () => { try { localStorage.setItem(SAVED, JSON.stringify({ tab: L.tab, filter: L.filter })); } catch { /* ignore */ } };

// Animation groups for the viewer, in ANIM_GUIDE terms; alt strips (altOf) form their own group, and a name added to
// the guide without a group here still shows, under Other.
const ANIM_GROUPS = [
  ['Stance & movement', ['idle', 'run', 'dash', 'backDash', 'superDash', 'jumpSquat', 'jumpUp', 'jumpFall', 'land', 'vanish', 'charge']],
  ['Attacks', ['light1', 'light2', 'light3', 'light4', 'heavy', 'airLight1', 'airLight2', 'airLight3', 'airHeavy', 'throw']],
  ['Specials & supers', ['special', 'specialForward', 'specialUp', 'specialDown', 'beamCharge', 'beamFire', 'superPose', 'beamStruggle', 'beamStruggleAir']],
  ['Guard & hit', ['guard', 'block', 'hurtHigh', 'hurtLow', 'stagger', 'launched', 'spin', 'airRecover', 'down', 'getup', 'ko']],
  ['Tech', ['techGround', 'techRoll', 'wallTech']],
  ['Alts', Object.keys(ANIM_GUIDE).filter((n) => ANIM_GUIDE[n].altOf)],
  ['Show', ['intro', 'taunt', 'win']],
];
const animGroups = () => {
  const seen = new Set(), out = [];
  for (const [name, list] of ANIM_GROUPS) {
    const names = list.filter((n) => ANIM_GUIDE[n] && !seen.has(n));
    names.forEach((n) => seen.add(n));
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
    `frame ${act.fi + 1} / ${A.frames.length} · sheet cell ${act.frame} · ${A.durations?.[act.fi] ?? 100} ms${phase ? ' · ' + phase : ''}`,
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
const fab = button('LAB', () => { root.classList.toggle('hidden'); }, 'lab-fab');
document.body.append(root, fab);

const TABS = [
  ['moves', 'MOVES', 'YOU plays one move on the dummy'],
  ['scen', 'SCENARIOS', 'both fighters scripted: a mechanic between them'],
  ['anims', 'ANIMATIONS', 'YOU shows one strip frame by frame, with boxes'],
  ['tools', 'TOOLS', 'time, the dummy, display and resets'],
];
const scrollKey = () => L.tab + ':' + (L.filter[L.tab] ?? '');

function render() {
  const oldBody = root.querySelector('.lab-body');
  if (oldBody) L.scroll[scrollKey()] = oldBody.scrollTop;
  root.innerHTML = '';
  const head = el('div', 'lab-head');
  const pick = (key, label) => {
    const row = el('div', 'lab-pick');
    const go = (d) => { L[key] = ids[(ids.indexOf(L[key]) + d + ids.length) % ids.length]; start(); };
    const def = ROSTER.find((c) => c.id === L[key]);
    const name = el('b', '', def.name);
    name.style.color = def.color;
    row.append(el('span', 'lab-k', label), button('◀', () => go(-1)), name, button('▶', () => go(1)));
    return row;
  };
  head.append(button('‹ MENU', () => { location.href = '/'; }, 'lab-menu'), el('div', 'lab-title', 'TEST LAB'),
    pick('p1', 'YOU'), pick('p2', 'DUMMY'), button('⇄ swap', () => { [L.p1, L.p2] = [L.p2, L.p1]; start(); }));
  const tabs = el('div', 'lab-tabs');
  for (const [id, label] of TABS) {
    tabs.append(button(label, () => { L.tab = id; saveView(); render(); }, L.tab === id ? 'on' : ''));
  }
  const hint = el('div', 'lab-hint', TABS.find(([id]) => id === L.tab)?.[2] ?? '');
  const body = el('div', 'lab-body');
  if (L.tab === 'moves') body.append(movesTab());
  else if (L.tab === 'anims') body.append(animsTab());
  else if (L.tab === 'scen') body.append(scenariosTab());
  else body.append(toolsTab());
  const status = el('div', 'lab-status');
  root.append(head, tabs, hint, body, status);
  body.scrollTop = L.scroll[scrollKey()] ?? 0;
  paintStatus();
  paintViewer();
}

// The chip bar over a grouped list: ALL, or one group. `groups` = [[name, label]]; the label carries a count.
function chips(groups) {
  const bar = el('div', 'lab-chips');
  const cur = L.filter[L.tab];
  const set = (g) => { L.filter[L.tab] = g; saveView(); render(); };
  bar.append(button('ALL', () => set('all'), cur === 'all' ? 'on' : ''));
  for (const [name, label] of groups) bar.append(button(label, () => set(name), cur === name ? 'on' : ''));
  return bar;
}
// a filter left on a group this pairing doesn't have (a fighter swap) falls back to ALL
const shown = (name, names) => {
  if (!names.includes(L.filter[L.tab])) L.filter[L.tab] = 'all';
  return L.filter[L.tab] === 'all' || L.filter[L.tab] === name;
};
const groupHead = (name, info = '', count = '') =>
  el('div', 'lab-group', `${name.toUpperCase()}${count ? ` <span class="lab-count">${count}</span>` : ''}${info ? `<small>${info}</small>` : ''}`);

function movesTab() {
  const box = el('div');
  const def = fighters()[0].def;
  const groups = [];
  for (const row of moveList(def)) {
    let g = groups.find(([name]) => name === row.group);
    if (!g) groups.push(g = [row.group, []]);
    g[1].push(row);
  }
  box.append(chips(groups.map(([name, rows]) => [name, `${name} ${rows.length}`])));
  const names = groups.map(([name]) => name);
  for (const [name, rows] of groups) {
    if (!shown(name, names)) continue;
    box.append(groupHead(name));
    for (const row of rows) {
      const r = el('div', 'lab-row');
      r.append(button('▶', () => playMove(row), 'play'), el('div', 'lab-move', `<b>${row.name}</b><small>${row.info}</small>`));
      box.append(r);
    }
  }
  box.append(el('p', 'lab-help', 'Each ▶ resets the positions to a distance that suits the move and plays it on YOU against the dummy. Swap to see the other fighter\'s moves; moves that need the dummy to react are under SCENARIOS.'));
  return box;
}

function animsTab() {
  const box = el('div');
  const f = fighters()[0], have = f.asset.meta?.animations;
  const missing = (n) => !!have && !have[n];
  const groups = animGroups();
  box.append(chips(groups.map(([name, list]) => [name, `${name} ${list.filter((n) => !missing(n)).length}/${list.length}`])));
  if (L.viewer) {
    const ctl = el('div', 'lab-row lab-ctl');
    ctl.append(
      button('◀', () => viewerFrame(-1)),
      button(L.viewer.playing ? '❚❚' : '▶', () => { L.viewer.playing = !L.viewer.playing; render(); }),
      button('▶|', () => viewerFrame(1)),
      button(game.showBoxes ? 'boxes ON' : 'boxes OFF', () => { game.showBoxes = !game.showBoxes; render(); }, game.showBoxes ? 'on' : ''),
      button('done', exitViewer),
    );
    box.append(ctl, el('div', 'lab-info lab-viewer'));
  }
  const names = groups.map(([name]) => name);
  for (const [name, list] of groups) {
    if (!shown(name, names)) continue;
    box.append(groupHead(name, '', `${list.filter((n) => !missing(n)).length}/${list.length}`));
    const grid = el('div', 'lab-grid');
    for (const n of list) {
      const b = button(n, () => viewAnim(n), [L.viewer?.name === n ? 'on' : '', missing(n) ? 'miss' : ''].join(' '));
      if (missing(n)) b.title = 'not in this sheet: plays a fallback';
      grid.append(b);
    }
    box.append(grid);
  }
  box.append(el('p', 'lab-help', 'Pick an animation: the game pauses and YOU shows it frame by frame on the real sheet, with hurt boxes (blue), hit boxes (red, active frames) and the scale check: the idle head size (white) around this frame\'s head (gold, orange when the packer flagged the strip). Dim names are not in this fighter\'s sheet (they play a fallback); the counts are strips the sheet has.'));
  return box;
}

function scenariosTab() {
  const box = el('div');
  const defs = fighters().map((f) => f.def);
  const groupOf = (sc) => sc.group ?? 'other', known = SCENARIO_GROUPS.map((g) => g.id);
  const extra = [...new Set(SCENARIOS.map(groupOf))].filter((id) => !known.includes(id)).map((id) => ({ id, name: id }));
  const groups = [...SCENARIO_GROUPS, ...extra]
    .map((g) => ({ ...g, list: SCENARIOS.filter((sc) => groupOf(sc) === g.id) }))
    .filter((g) => g.list.length);
  const ok = (sc) => !sc.needs?.(defs);
  const playable = SCENARIOS.filter(ok).length;
  box.append(chips(groups.map((g) => [g.id, `${g.name} ${g.list.filter(ok).length}/${g.list.length}`])));
  box.append(el('div', 'lab-hint', `${defs[0].name} vs ${defs[1].name}: ${playable} of ${SCENARIOS.length} play here. Dim rows need another pairing. Tap a name for the full description.`));
  const gids = groups.map((g) => g.id);
  for (const g of groups) {
    if (!shown(g.id, gids)) continue;
    box.append(groupHead(g.name, g.info, `${g.list.filter(ok).length}/${g.list.length}`));
    for (const sc of g.list) {
      const need = sc.needs?.(defs), open = L.open === sc.id;
      const r = el('div', 'lab-row');
      const text = el('div', 'lab-move lab-tap' + (need ? ' dim' : '') + (open ? ' open' : ''), `<b>${sc.name}</b><small>${need ? '⚠ ' + need : sc.brief ?? sc.info}</small>`);
      text.addEventListener('click', () => { L.open = open ? null : sc.id; render(); });
      r.append(button('▶', () => playScenario(sc), 'play'), text);
      box.append(r);
      if (open) box.append(el('div', 'lab-detail', sc.info + (L.note && L.running?.label === sc.name ? `<br><span class="lab-warn">${L.note}</span>` : '')));
    }
  }
  return box;
}

function toolsTab() {
  const box = el('div');
  const row = (label, ...items) => {
    const r = el('div', 'lab-row lab-tools');
    r.append(el('span', 'lab-k', label), ...items);
    box.append(r);
  };
  const note = (text) => box.append(el('div', 'lab-hint lab-tool-note', text));
  const chip = (label, on, fn) => button(label, fn, on ? 'on' : '');

  box.append(groupHead('Time', 'slow it down, pause, step frames'));
  row('SPEED', ...[[1, '1×'], [0.5, '½×'], [0.25, '¼×'], [0.1, '⅒×']].map(([s, t]) => chip(t, L.speed === s, () => { L.speed = s; render(); })));
  row('STEP', chip(L.paused ? '▶ play (P)' : '❚❚ pause (P)', L.paused, () => { L.paused = !L.paused; render(); }),
    button('+1 frame (.)', () => { L.paused = true; L.step += 1; render(); }), button('+10', () => { L.paused = true; L.step += 10; render(); }));
  note('Pause and step to read frame data: the readout below shows both fighters every frame.');

  box.append(groupHead('Dummy', 'what the other fighter does'));
  row('DOES', ...[['stand', 'STAND'], ['guard', 'GUARD'], ['jump', 'JUMP'], ['cpu', 'CPU']].map(([id, t]) => chip(t, !L.replay && L.dummy === id, () => {
    L.dummy = id;
    L.replay = false;
    game.setDummy(id);
    game.brains[1] = dummyBrain();
    render();
  })));
  // how well the dummy plays a rhythm clash (its CPU level's timing); a running scenario script keeps its brain
  row('CLASH', ...CPU_LEVELS.map((id) => chip(id.toUpperCase(), L.clashLevel === id, () => {
    L.clashLevel = id;
    if (game.brains[1] instanceof DummyBrain) game.brains[1] = dummyBrain();
    render();
  })));
  row('RECORD', chip(L.recording ? '■ stop recording' : '● record YOU', L.recording, toggleRecord),
    chip(L.replay ? 'replaying on dummy' : `replay on dummy (${(L.rec.length / 60).toFixed(1)} s)`, L.replay, toggleReplay));
  note('Clash: how well the dummy plays a rhythm clash, from EASY (late presses, skipped notes) up. Record: play a few seconds yourself, stop, then the dummy repeats it in a loop (mirrored toward you).');

  box.append(groupHead('You', 'your meter, or the CPU playing for you'));
  row('METER', chip(L.infiniteKi ? 'infinite (both)' : 'normal', L.infiniteKi, () => { L.infiniteKi = !L.infiniteKi; game.trainingCfg.infiniteKi = L.infiniteKi; render(); }));
  // the combo composer (ADR 0026): YOU as the CPU with a persona
  row('CPU YOU', chip('OFF', !L.cpuP1, () => cpuYou(null)), chip('AUTO', L.cpuP1 === 'auto', () => cpuYou('auto')),
    ...Object.keys(PERSONAS).map((p) => chip(p.toUpperCase(), L.cpuP1 === p, () => cpuYou(p))));
  note('CPU YOU: the showman CPU plays YOU with a combo persona against the dummy; its route shows in the readout.');

  box.append(groupHead('Display', 'boxes and hit flash'));
  row('BOXES', chip(game.showBoxes ? 'ON' : 'OFF', game.showBoxes, () => { game.showBoxes = !game.showBoxes; render(); }));
  // A/B the victim's hit flash live (ENG-064): the table is read every frame, so the next hit shows the change
  row('HIT FLASH', ...FLASH_STYLES.map((s) => chip(s.toUpperCase(), HIT_FLASH.style === s, () => { HIT_FLASH.style = s; render(); })));
  row('FLASH STR', ...[0.5, 0.75, 1, 1.25].map((v) => chip(v + '×', HIT_FLASH.strength === v, () => { HIT_FLASH.strength = v; render(); })));

  box.append(groupHead('Reset'));
  row('RESET', button('positions', () => { stopScripts(); place(3.2); }), button('refill HP', () => { for (const f of fighters()) f.hp = 1000; }));
  box.append(el('p', 'lab-help', 'Keys: P pauses, . steps one frame, ` hides the panel. The art packer\'s Sprite Lab is still at /sprites.html.'));
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
  else if (e.code === 'Backquote') root.classList.toggle('hidden');
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

const ready = new Promise((r) => setTimeout(r, 30)).then(() => game.init());
ready.then(() => {
  document.getElementById('loading')?.classList.add('done');
  start();
  requestAnimationFrame(loop);
});
