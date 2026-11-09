// Arcade screens (ENG-127, ADR 0058): the ladder between fights and the three ends of a fight (stage clear, defeat
// with its continue, the champion after the dark mirror). They draw into Menus' root with its list helper; the rules
// and the run are src/game/arcade.js, the flow Game.startArcade / arcadeFight / arcadeResults.
import { audio } from '../core/audio.js';
import { portraitCanvas } from './hud.js';
import { COURSES } from '../game/arcade.js';

const el = (tag, cls, html = '') => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  return e;
};
const fmt = (n) => Math.round(n).toLocaleString('en-US');
const clock = (secs) => `${Math.floor(secs / 60)}:${String(Math.round(secs) % 60).padStart(2, '0')}`;
// the ladder cells are narrow: the stage names they show
const SHORT = { PRELIMINARY: 'PRELIM', QUARTERFINAL: 'QUARTER', SEMIFINAL: 'SEMI', 'GRAND FINAL': 'FINAL', 'SHADOW MATCH': 'SHADOW' };

const defOf = (game, id) => game.roster.find((c) => c.id === id) ?? game.roster[0];
const assetOf = (game, id) => game.rosterAssets[game.roster.findIndex((c) => c.id === id)];
const named = (name, color) => `<b style="color:${color}">${name}</b>`;

// The run so far and the next fight. The boss's cell stays a silhouette until it is the fight under way.
export function arcadeLadder(menus, run, on) {
  const g = menus.game;
  menus.clear();
  menus.screen = 'arcade';
  menus.root.classList.add('panel-screen', 'arcade-screen');
  const C = COURSES[run.course];
  const me = defOf(g, run.p1);
  menus.root.append(
    el('div', 'screen-title', 'ARCADE'),
    el('div', 'arc-sub', `${C.label} COURSE · SCORE <b>${fmt(run.score)}</b>${run.continues ? ` · CONTINUES ${run.continues}` : ''}`));

  const path = el('div', 'arc-path');
  run.fights.forEach((F, i) => {
    const d = defOf(g, F.opp);
    const cell = el('div', 'arc-cell');
    const hidden = F.boss && i > run.index;
    cell.classList.toggle('done', i < run.index);
    cell.classList.toggle('now', i === run.index);
    cell.classList.toggle('boss', F.boss);
    cell.classList.toggle('veiled', hidden);
    cell.style.setProperty('--pc', F.boss ? '#a77bff' : d.color);
    const face = el('div', 'arc-face');
    face.append(portraitCanvas(assetOf(g, F.opp), 34));
    if (hidden) face.append(el('span', 'arc-q', '?'));
    if (i < run.index) face.append(el('i', 'arc-ko', 'KO'));
    cell.append(face, el('small', '', hidden ? '???' : SHORT[F.stage] ?? F.stage));
    path.append(cell);
  });

  const F = run.fight;
  const opp = defOf(g, F.opp);
  const oppName = F.boss ? named(`DARK ${opp.name}`, '#a77bff') : named(opp.name, opp.color);
  const next = el('div', 'arc-next',
    `<div class="arc-stage">STAGE ${run.stageNo} · ${F.stage}</div>` +
    `<div class="arc-vs">${named(me.name, me.color)} <span>VS</span> ${oppName}</div>` +
    `<div class="arc-meta">CPU ${F.level.toUpperCase()} · ${F.rounds > 1 ? `BEST OF ${F.rounds * 2 - 1}` : 'ONE ROUND'}</div>`);

  const { box, ctrl } = menus.list([
    { label: F.boss ? 'FACE YOUR SHADOW' : 'FIGHT', action: on.fight },
    { label: 'QUIT RUN', sub: 'back to the title · the run is lost', action: on.quit },
  ], { cls: 'arc-list' });
  menus.root.append(path, next, box);
  menus.ctrl = ctrl;
}

// The side panel beside the live 3D hero shot, like Menus.results (it reads .res-panel for the camera's framing).
function resultPanel(menus, head, def, body, items) {
  menus.clear();
  menus.screen = 'results';
  menus._resCover = null;
  menus.root.classList.add('results-screen', 'arcade-results');
  const panel = el('div', 'res-panel');
  panel.append(el('div', 'res-text',
    `<div class="res-win">${head}</div><div class="res-name" style="color:${def.color};--len:${def.name.length}">${def.name}</div>`));
  if (body) panel.append(el('div', 'arc-body', body));
  const { box, ctrl } = menus.list(items, { cls: 'res-list' });
  panel.append(box);
  menus.root.append(panel);
  menus.ctrl = ctrl;
}

// a fight's score lines, its level multiplier and total
function scoreLines(F, res) {
  const rows = res.lines.map((l) => `<div><span>${l.label}</span><b>${fmt(l.pts)}</b></div>`);
  rows.push(`<div class="mult"><span>CPU ${F.level.toUpperCase()}${F.boss ? ' · SHADOW' : ''}</span><b>×${res.mult}</b></div>`);
  rows.push(`<div class="tot"><span>STAGE</span><b>${fmt(res.total)}</b></div>`);
  return rows.join('');
}

// won a rival fight: its score, then on to the ladder
export function arcadeClear(menus, w, run, res, on) {
  const F = run.fights[run.index - 1];
  const body = `<div class="arc-lines">${scoreLines(F, res)}<div class="run"><span>RUN SCORE</span><b>${fmt(run.score)}</b></div></div>`;
  const N = run.fight;
  audio.play('cheer', 0.8);
  resultPanel(menus, `STAGE ${run.index} CLEAR · ${F.stage}`, w.def, body, [
    { label: 'NEXT FIGHT', sub: N.boss ? 'stage ' + run.stageNo + ' · ???' : `stage ${run.stageNo} · ${N.stage}`, action: on.next },
    { label: 'QUIT RUN', sub: 'back to the title · the run is lost', action: on.quit },
  ]);
}

// lost: the CPU's hero shot, and what a continue costs
export function arcadeDefeat(menus, w, run, on) {
  const F = run.fight;
  const body = `<div class="arc-cont">CONTINUE?<div>SCORE <b>${fmt(run.score)}</b> → <b>${fmt(run.continueScore)}</b></div>` +
    `${run.continues ? `<small>continues so far: ${run.continues}</small>` : ''}</div>`;
  resultPanel(menus, `DEFEATED · STAGE ${run.stageNo}`, w.def, body, [
    { label: 'CONTINUE', sub: `the ${F.stage.toLowerCase()} again · score halved`, action: on.cont },
    { label: 'GIVE UP', sub: 'back to the title', action: on.quit },
  ]);
}

// the shadow is beaten: the run's totals and the record it set
export function arcadeChampion(menus, w, run, res, saved, on) {
  const F = run.fights[run.fights.length - 1];
  const C = COURSES[run.course];
  const secs = Math.round(run.frames / 60);
  const badges = [
    saved.newBest && !saved.first ? 'NEW RECORD!' : '',
    saved.first ? 'FIRST CLEAR!' : '',
    saved.newFastest && !saved.first ? 'FASTEST CLEAR!' : '',
    run.continues === 0 ? 'NO CONTINUES ★' : '',
  ].filter(Boolean).map((b) => `<i>${b}</i>`).join('');
  const body =
    `<div class="arc-lines">${scoreLines(F, res)}` +
    `<div class="run big"><span>RUN SCORE</span><b>${fmt(run.score)}</b></div>` +
    `<div><span>CLEAR TIME</span><b>${clock(secs)}</b></div>` +
    `<div><span>LONGEST COMBO</span><b>${run.bestCombo} HITS</b></div>` +
    `<div><span>CONTINUES</span><b>${run.continues}</b></div></div>` +
    (badges ? `<div class="arc-badges">${badges}</div>` : '') +
    `<div class="arc-rec">${C.label} RECORD · BEST ${fmt(saved.rec.best)} · ${saved.rec.clears}× CLEARED · FASTEST ${clock(saved.rec.fastest)}</div>`;
  audio.play('cheer', 1.4);
  resultPanel(menus, `WORLD CHAMPION · ${C.label} COURSE`, w.def, body, [
    { label: 'ARCADE AGAIN', sub: 'another fighter or course', action: on.again },
    { label: 'TITLE', action: on.title },
  ]);
}
