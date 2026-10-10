// Test lab (ADR 0018): the training room plus a panel to play any move of either fighter in one tap, step through
// all 42 animations with their hit and hurt boxes on the real art, replay the shared mechanics (clashes, throws,
// dodges, bounces) and change time and the dummy. A separate page, not linked from the game:
//   /lab.html?p1=naruto&p2=sasuke
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
import { ScriptBrain, ReplayBrain, recordFrame, moveList, SCENARIOS } from './scripts.js';
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
  const url = new URL(location.href);
  url.searchParams.set('p1', L.p1);
  url.searchParams.set('p2', L.p2);
  history.replaceState(null, '', url);
  render();
}

// Stand them `gap` apart (the dummy near the barrier for wall bounces) with fresh state.
function place(gap, nearWall = false) {
  game.resetTrainingPositions();
  const [a, b] = fighters();
  const cx = nearWall ? ARENA_LIMIT - 0.9 - gap / 2 : 0;
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
    if (who === 'a') {
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

function playMove(row) {
  exitViewer();
  place(row.range);
  const [a] = fighters();
  a.ki = Math.max(a.ki, row.ki);
  runScripts(row.steps, null, row.name);
}

function playScenario(sc) {
  exitViewer();
  const defs = fighters().map((f) => f.def);
  L.note = sc.needs?.(defs) ?? '';
  place(sc.setup.gap, sc.setup.nearWall);
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
  return [
    `<b>${V.name}</b> ${own ? '' : `<span class="lab-warn">not in this sheet: falls back to ${used ?? '?'}</span>`}`,
    `frame ${act.fi + 1} / ${A.frames.length} · sheet cell ${act.frame} · ${A.durations?.[act.fi] ?? 100} ms${phase ? ' · ' + phase : ''}`,
    ph ? `phases ${ph.join(' / ')} (startup / active / recovery)` : '',
    `boxes: ${boxes('hurt')} hurt, ${boxes('hit')} hit · art: ${f.asset.source ?? (f.asset.meta?.source || 'baked')}`,
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

function render() {
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
  head.append(el('div', 'lab-title', 'TEST LAB'), pick('p1', 'YOU'), pick('p2', 'DUMMY'),
    button('⇄ swap', () => { [L.p1, L.p2] = [L.p2, L.p1]; start(); }));
  const tabs = el('div', 'lab-tabs');
  for (const [id, label] of [['moves', 'MOVES'], ['anims', 'ANIMATIONS'], ['scen', 'SCENARIOS'], ['tools', 'TOOLS']]) {
    tabs.append(button(label, () => { L.tab = id; render(); }, L.tab === id ? 'on' : ''));
  }
  const body = el('div', 'lab-body');
  if (L.tab === 'moves') body.append(movesTab());
  else if (L.tab === 'anims') body.append(animsTab());
  else if (L.tab === 'scen') body.append(scenariosTab());
  else body.append(toolsTab());
  const status = el('div', 'lab-status');
  root.append(head, tabs, body, status);
  paintStatus();
  paintViewer();
}

function movesTab() {
  const box = el('div');
  const def = fighters()[0].def;
  let group = '';
  for (const row of moveList(def)) {
    if (row.group !== group) { group = row.group; box.append(el('div', 'lab-group', group)); }
    const r = el('div', 'lab-row');
    r.append(button('▶', () => playMove(row), 'play'), el('div', 'lab-move', `<b>${row.name}</b><small>${row.info}</small>`));
    box.append(r);
  }
  box.append(el('p', 'lab-help', 'Each ▶ resets the positions to a distance that suits the move and plays it on YOU against the dummy. Swap to see the other fighter\'s moves.'));
  return box;
}

function animsTab() {
  const box = el('div');
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
  const grid = el('div', 'lab-grid');
  for (const name of Object.keys(ANIM_GUIDE)) grid.append(button(name, () => viewAnim(name), L.viewer?.name === name ? 'on' : ''));
  box.append(grid, el('p', 'lab-help', 'Pick an animation: the game pauses and YOU shows it frame by frame on the real sheet, with hurt boxes (blue) and hit boxes (red, active frames).'));
  return box;
}

function scenariosTab() {
  const box = el('div');
  if (L.note) box.append(el('div', 'lab-warn lab-note', L.note));
  const defs = fighters().map((f) => f.def);
  for (const sc of SCENARIOS) {
    const r = el('div', 'lab-row');
    const need = sc.needs?.(defs);
    r.append(button('▶', () => playScenario(sc), 'play'), el('div', 'lab-move' + (need ? ' dim' : ''), `<b>${sc.name}</b><small>${need ? need : sc.info}</small>`));
    box.append(r);
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
  const chip = (label, on, fn) => button(label, fn, on ? 'on' : '');
  row('TIME', ...[[1, '1×'], [0.5, '½×'], [0.25, '¼×'], [0.1, '⅒×']].map(([s, t]) => chip(t, L.speed === s, () => { L.speed = s; render(); })));
  row('', chip(L.paused ? '▶ play (P)' : '❚❚ pause (P)', L.paused, () => { L.paused = !L.paused; render(); }),
    button('+1 frame (.)', () => { L.paused = true; L.step += 1; render(); }), button('+10', () => { L.paused = true; L.step += 10; render(); }));
  row('DUMMY', ...[['stand', 'STAND'], ['guard', 'GUARD'], ['jump', 'JUMP'], ['cpu', 'CPU']].map(([id, t]) => chip(t, !L.replay && L.dummy === id, () => {
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
  row('METER', chip(L.infiniteKi ? 'infinite (both)' : 'normal', L.infiniteKi, () => { L.infiniteKi = !L.infiniteKi; game.trainingCfg.infiniteKi = L.infiniteKi; render(); }));
  row('BOXES', chip(game.showBoxes ? 'ON' : 'OFF', game.showBoxes, () => { game.showBoxes = !game.showBoxes; render(); }));
  row('RESET', button('positions', () => { stopScripts(); place(3.2); }), button('refill HP', () => { for (const f of fighters()) f.hp = 1000; }));
  box.append(el('p', 'lab-help', 'Record: play a few seconds yourself, stop, then the dummy repeats it in a loop (mirrored toward you). Clash: how well the dummy plays a rhythm clash, from EASY (late presses, skipped notes) up. Pause and step to read frame data; the readout below shows both fighters every frame.'));
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
  s.innerHTML = `${L.running ? `<span class="lab-run">▶ ${L.running.label}</span><br>` : ''}${L.recording ? '<span class="lab-rec">● REC</span> ' : ''}${line(fighters()[0])}<br>${line(fighters()[1])}`;
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
  if (L.infiniteKi) for (const f of game.fighters) f.ki = Math.max(f.ki, 300);
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
