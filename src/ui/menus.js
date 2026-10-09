import { audio } from '../core/audio.js';
import { portraitCanvas } from './hud.js';
import { ControlsPanel } from './controls.js';
import { IS_TOUCH_DEVICE } from '../core/touch.js';
import { kitOf } from '../game/kit.js';
import { SPECIAL_MOVES, SUPERS } from '../game/moves.js';

const el = (tag, cls, html = '') => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  return e;
};

// Char-select move list: one line per distinct special in the fighter's kit, then the supers.
const SLOT_LABEL = [['neutral', 'SP'], ['forward', '→SP'], ['up', '↑SP'], ['down', '↓SP'], ['back', '←SP'], ['air', 'air SP'], ['airDown', 'air ↓SP']];
function kitMovesHtml(c) {
  const k = kitOf(c), seen = new Set(), rows = [];
  for (const [slot, label] of SLOT_LABEL) {
    const m = SPECIAL_MOVES[k.specials[slot]];
    const name = m?.name ?? (slot === 'air' ? c.projectileName : null);
    if (!name || seen.has(name)) continue;
    seen.add(name);
    rows.push(`<div><b>${name}</b> ${label}</div>`);
  }
  if (k.super && SUPERS[k.super]) rows.push(`<div><b>${c.superName ?? SUPERS[k.super].name}</b> SUPER</div>`);
  rows.push(`<div><b>${c.beam.name}</b> ultimate</div>`);
  return rows.join('');
}

// Move list shown beside the bindings on the controls page (button names are layout-agnostic).
export const MOVES_HTML = `
  <div class="ctl-col">
    <h3>DBFZ-STYLE MOVES</h3>
    <table>
      <tr><td>Auto combo</td><td>Light ×4 on the ground, Light ×3 in the air</td></tr>
      <tr><td>Bread &amp; butter</td><td>Light ×3 → Heavy (launch) → Jump (chase) → Light ×2 → Heavy (spike)</td></tr>
      <tr><td>Super dash</td><td>Dash with no direction: homing flight (once per jump)</td></tr>
      <tr><td>Dash</td><td>Dash + direction, or double-tap a direction</td></tr>
      <tr><td>Vanish</td><td>Guard + Special <small>(1 bar)</small>: teleport behind &amp; smash, works from block</td></tr>
      <tr><td>Specials</td><td>tap Special, or Special + → / ↑ / ↓ for the fighter's other specials <small>(½–1 bar)</small></td></tr>
      <tr><td>Ki charge</td><td>hold Special</td></tr>
      <tr><td>Air special</td><td>Special in the air <small>(+↓ for some fighters)</small></td></tr>
      <tr><td>Ultimate beam</td><td>Heavy + Special <small>(3 bars)</small> · fire back to CLASH, then mash</td></tr>
      <tr><td>Second super</td><td>SUPER <small>(3 bars)</small>: Godspeed Whirlwind, Unlimited Void… (the beam if the fighter has none)</td></tr>
      <tr><td>Air recover</td><td>any button while launched</td></tr>
    </table>
  </div>`;

const DUMMY_MODES = [['stand', 'STAND'], ['guard', 'GUARD'], ['jump', 'JUMP'], ['cpu', 'CPU']];

export class Menus {
  constructor(root, game) {
    this.game = game;
    this.root = el('div', 'menus');
    root.appendChild(this.root);
    this.screen = null;
    this.ctrl = null;
    this.previews = [];
    this.panel = null; // live ControlsPanel (training room or controls page)
    this.ctlLayout = null; // layout tab the player picked (null = follow the active device)
    this.trainCollapsed = IS_TOUCH_DEVICE; // on a phone the panel would cover the touch buttons
    // touch has no Esc: a back button for every screen that has a 'back' action
    this.backBtn = el('button', 'm-back', '‹ BACK');
    this.backBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.ctrl?.back) { audio.play('ui'); this.ctrl.back(); }
    });
    root.appendChild(this.backBtn);
    this.lastTick = performance.now();
    const tick = () => {
      requestAnimationFrame(tick);
      const now = performance.now();
      const dt = now - this.lastTick;
      this.lastTick = now;
      for (const p of this.previews) p.update(dt);
    };
    requestAnimationFrame(tick);
  }

  clear() {
    this.panel?.destroy();
    this.panel = null;
    this.root.innerHTML = '';
    this.root.className = 'menus';
    this.root.onclick = null; // the title screen's click-anywhere handler must not leak into other screens
    this.ctrl = null;
    this.previews = [];
  }

  // per rendered frame (from Game.render): live input highlights
  tick() {
    if (this.panel && !(this.screen === 'training' && this.trainCollapsed)) this.panel.tick();
    const showBack = this.game.input.lastDevice === 'touch' && !!this.ctrl?.back && this.screen !== 'training';
    if (showBack !== this._back) this.backBtn.classList.toggle('show', (this._back = showBack));
  }

  hide() {
    this.clear();
    this.screen = null;
  }

  handle(events) {
    const ctrl = this.ctrl;
    if (!ctrl) return;
    for (const e of events) {
      if (this.ctrl !== ctrl) break; // a handler changed or closed the screen: drop the rest of the batch
      ctrl[e.action]?.(e);
    }
  }

  // Generic vertical list menu.
  // Items: { label: string | () => string, sub?, action?, cycle?(dir) }. Cycle items
  // change a value with left/right (confirm / click steps forward).
  list(items, opts = {}) {
    let idx = opts.index ?? 0;
    const box = el('div', 'list ' + (opts.cls || ''));
    box.addEventListener('mousedown', (e) => { if (e.target.closest('button')) e.preventDefault(); });
    const label = (it) => (typeof it.label === 'function' ? it.label() : it.label);
    const btns = items.map((it, i) => {
      const b = el('button', 'item' + (it.cycle ? ' cyc' : ''), `<span>${label(it)}</span>${it.sub ? `<small>${it.sub}</small>` : ''}`);
      b.onmouseenter = () => { idx = i; render(); };
      b.onclick = () => { idx = i; confirm(); };
      box.append(b);
      return b;
    });
    const render = () => btns.forEach((b, i) => {
      b.classList.toggle('sel', i === idx);
      if (typeof items[i].label === 'function') b.querySelector('span').innerHTML = label(items[i]);
    });
    const step = (d) => {
      const it = items[idx];
      if (!it.cycle) return;
      it.cycle(d);
      audio.play('ui');
      render();
    };
    const confirm = () => {
      const it = items[idx];
      if (it.cycle && !it.action) return step(1);
      audio.play('uiConfirm');
      it.action();
    };
    render();
    const ctrl = {
      up: () => { idx = (idx + items.length - 1) % items.length; audio.play('ui'); render(); },
      down: () => { idx = (idx + 1) % items.length; audio.play('ui'); render(); },
      left: () => step(-1),
      right: () => step(1),
      confirm,
      back: opts.back ? () => { audio.play('ui'); opts.back(); } : null,
      pause: opts.back ? () => opts.back() : null,
    };
    return { box, ctrl };
  }

  // ------------------------------------------------------------ screens
  title() {
    this.clear();
    this.screen = 'title';
    this.root.classList.add('title-screen');
    this.root.innerHTML = `
      <div class="logo">
        <div class="logo-main" data-t="GCD TOURNEY">GCD TOURNEY</div>
        <div class="logo-sub">天下一武闘祭</div>
      </div>
      <div class="press">${this.game.input.lastDevice === 'touch' ? 'TAP TO START' : 'PRESS ENTER / START'}</div>
      <div class="foot">HD-2D anime arena fighter · tech demo · placeholder art</div>`;
    const go = () => {
      audio.init();
      audio.play('gong');
      audio.startMusic('menu');
      this.modeSelect();
    };
    this.root.onclick = go;
    this.ctrl = { confirm: go, pause: go };
  }

  modeSelect(index = 0) {
    this.clear();
    this.screen = 'mode';
    this.root.classList.add('panel-screen');
    this.root.append(el('div', 'screen-title', 'SELECT MODE'));
    const { box, ctrl } = this.list([
      { label: 'VS CPU', sub: 'fight the computer', action: () => this.charSelect('solo') },
      { label: '2 PLAYERS', sub: 'same keyboard or two gamepads', action: () => this.charSelect('versus') },
      { label: 'TRAINING & CONTROLS', sub: 'practice room · PS / Xbox layouts · rebind', action: () => this.game.startTraining() },
      { label: 'SPRITE LAB', sub: 'preview & export sprite sheets', action: () => window.open('/sprites.html', '_blank') },
    ], { index, back: () => this.title() });
    this.root.append(box);
    this.ctrl = ctrl;
  }

  // Full controls page (pause menu): layouts, live highlights, navigable rebinding.
  controls(back) {
    this.clear();
    this.screen = 'controls';
    this.root.classList.add('panel-screen', 'dim', 'controls-screen');
    this.root.append(el('div', 'screen-title', 'CONTROLS'));
    const wrap = el('div', 'controls-page');
    const panel = (this.panel = new ControlsPanel(this.game.input, {
      layout: this.ctlLayout,
      onLayout: (l) => (this.ctlLayout = l),
      onBack: back,
    }));
    wrap.append(panel.root, el('div', 'moves-box', MOVES_HTML));
    this.root.append(wrap);
    const nav = (a) => () => panel.nav(a);
    this.ctrl = {
      up: nav('up'), down: nav('down'), left: nav('left'), right: nav('right'), confirm: nav('confirm'),
      back: () => { if (!panel.capturing) { audio.play('ui'); back(); } },
      pause: () => { if (!panel.capturing) back(); },
    };
  }

  // ------------------------------------------------------------ training room overlay
  // Side panel over the live training room: fighters, dummy behaviour and the
  // controls panel, so players see every input light up while they practice.
  trainingPanel() {
    this.clear();
    this.screen = 'training';
    this.root.classList.add('training-screen');
    this.root.classList.toggle('collapsed', this.trainCollapsed);
    const g = this.game, roster = g.roster, cfg = g.trainingCfg;
    const panel = el('div', 'tr-panel');
    panel.addEventListener('mousedown', (e) => { if (e.target.closest('button')) e.preventDefault(); });

    const head = el('div', 'tr-head', '<b>TRAINING ROOM</b>');
    const touchUi = g.input.lastDevice === 'touch';
    const hide = el('button', 'tr-hide', touchUi ? 'HIDE ▶' : 'HIDE <kbd>Tab</kbd>');
    hide.onclick = () => this.toggleTrainingPanel();
    head.append(hide);

    const opts = el('div', 'tr-opts');
    const charRow = (label, key) => {
      const row = el('div', 'tr-row');
      const idx = Math.max(0, roster.findIndex((c) => c.id === cfg[key]));
      const go = (d) => { audio.play('uiConfirm'); g.startTraining({ [key]: roster[(idx + d + roster.length) % roster.length].id }); };
      const prev = el('button', 'tr-arrow', '◀'), next = el('button', 'tr-arrow', '▶');
      prev.onclick = () => go(-1);
      next.onclick = () => go(1);
      const val = el('b', 'tr-val', roster[idx].name);
      val.style.color = roster[idx].color;
      row.append(el('span', 'tr-label', label), prev, val, next);
      return row;
    };
    opts.append(charRow('YOU', 'p1'), charRow('DUMMY', 'p2'));

    const modeRow = el('div', 'tr-row');
    const chips = el('div', 'tr-chips');
    for (const [id, label] of DUMMY_MODES) {
      const b = el('button', 'ctl-chip' + (cfg.dummy === id ? ' on' : ''), label);
      b.onclick = () => {
        g.setDummy(id);
        audio.play('ui');
        chips.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b));
      };
      chips.append(b);
    }
    modeRow.append(el('span', 'tr-label', 'DUMMY DOES'), chips);

    const kiRow = el('div', 'tr-row');
    const ki = el('button', 'ctl-chip' + (cfg.infiniteKi ? ' on' : ''), cfg.infiniteKi ? 'ON' : 'OFF');
    ki.onclick = () => {
      cfg.infiniteKi = !cfg.infiniteKi;
      ki.classList.toggle('on', cfg.infiniteKi);
      ki.textContent = cfg.infiniteKi ? 'ON' : 'OFF';
      audio.play('ui');
    };
    const reset = el('button', 'ctl-btn tr-reset', touchUi ? 'RESET' : 'RESET <kbd>Backspace</kbd>');
    reset.onclick = () => g.resetTrainingPositions();
    kiRow.append(el('span', 'tr-label', 'INFINITE KI'), ki, reset);
    const boxRow = el('div', 'tr-row');
    const boxes = el('button', 'ctl-chip' + (g.showBoxes ? ' on' : ''), g.showBoxes ? 'ON' : 'OFF');
    boxes.onclick = () => {
      g.showBoxes = !g.showBoxes;
      boxes.classList.toggle('on', g.showBoxes);
      boxes.textContent = g.showBoxes ? 'ON' : 'OFF';
      audio.play('ui');
    };
    boxRow.append(el('span', 'tr-label', 'HITBOXES'), boxes, el('span', 'tr-legend', '<i class="lg-hurt"></i>body <i class="lg-hit"></i>attack'));
    opts.append(modeRow, kiRow, boxRow);

    this.panel = new ControlsPanel(g.input, { layout: this.ctlLayout, onLayout: (l) => (this.ctlLayout = l) });
    const foot = el('div', 'tr-foot', '<kbd>Esc</kbd> / Options: menu &amp; full controls · <kbd>Tab</kbd>: hide panel');
    panel.append(head, opts, this.panel.root, foot);

    const show = el('button', 'tr-show', '◀ CONTROLS <kbd>Tab</kbd>');
    show.addEventListener('mousedown', (e) => e.preventDefault());
    show.onclick = () => this.toggleTrainingPanel();
    this.root.append(panel, show);
  }

  // Fraction of the screen width the training panel covers (0 when hidden). Cached:
  // reading layout every frame would force a reflow per frame.
  panelCover() {
    if (this.screen !== 'training' || this.trainCollapsed) return 0;
    const now = performance.now();
    if (!this._cover || now - this._cover.t > 500) {
      const p = this.root.querySelector('.tr-panel');
      const left = p ? p.getBoundingClientRect().left : window.innerWidth;
      this._cover = { t: now, v: Math.max(0, Math.min(0.6, 1 - left / window.innerWidth)) };
    }
    return this._cover.v;
  }

  toggleTrainingPanel() {
    if (this.screen !== 'training') return;
    this.trainCollapsed = !this.trainCollapsed;
    this.root.classList.toggle('collapsed', this.trainCollapsed);
    audio.play('ui');
  }

  // mode: 'solo' | 'versus' | 'training'. onBack overrides where Esc on the first pick goes.
  charSelect(mode, onBack = null) {
    this.clear();
    this.screen = 'chars';
    this.root.classList.add('char-screen');
    const roster = this.game.roster;
    const assets = this.game.rosterAssets;
    const LOCKED = 6;
    const slots = roster.length + LOCKED;
    let cursor = 0;
    let step = 0; // 0 = P1 picking, 1 = P2/CPU picking, 2 = difficulty
    const picks = [null, null];
    let level = 1;
    const levels = ['EASY', 'NORMAL', 'HARD'];

    const title = el('div', 'screen-title', 'CHOOSE YOUR FIGHTER');
    const wrap = el('div', 'cs-wrap');
    const sides = [0, 1].map((i) => {
      const s = el('div', `cs-side s${i + 1}`);
      const tag = el('div', 'cs-tag', i === 0 ? 'P1' : mode === 'solo' ? 'CPU' : mode === 'training' ? 'DUMMY' : 'P2');
      const cv = document.createElement('canvas');
      cv.width = assets[0].meta.frameWidth; cv.height = assets[0].meta.frameHeight;
      cv.className = 'cs-sprite';
      const name = el('div', 'cs-name');
      const sub = el('div', 'cs-sub');
      const moves = el('div', 'cs-moves');
      s.append(tag, cv, name, sub, moves);
      return { s, cv, name, sub, moves, preview: null };
    });
    const grid = el('div', 'cs-grid');
    const cells = [];
    for (let i = 0; i < slots; i++) {
      const c = el('div', 'cs-cell');
      if (i < roster.length) {
        c.append(portraitCanvas(assets[i], 34));
        c.style.setProperty('--pc', roster[i].color);
      } else {
        c.classList.add('locked');
        c.innerHTML = '<span>?</span>';
      }
      c.onmouseenter = () => { if (step < 2) { cursor = i; render(); } };
      c.onclick = () => { if (step < 2) { cursor = i; confirm(); } };
      grid.append(c);
      cells.push(c);
    }
    const diff = el('div', 'cs-diff hidden');
    const hint = el('div', 'cs-hint');
    wrap.append(sides[0].s, grid, sides[1].s);
    this.root.append(title, wrap, diff, hint);

    const showSide = (i, idx, anim = 'idle') => {
      const S = sides[i];
      if (idx == null || idx >= roster.length) {
        S.name.textContent = idx == null ? '' : 'COMING SOON';
        S.sub.textContent = idx == null ? '' : 'Your next legend goes here';
        S.moves.innerHTML = '';
        S.preview = null;
        S.cv.getContext('2d').clearRect(0, 0, 64, 64);
        this.previews = sides.map((x) => x.preview).filter(Boolean);
        return;
      }
      const c = roster[idx];
      S.name.textContent = c.name;
      S.name.style.color = c.color;
      S.sub.textContent = c.subtitle;
      S.moves.innerHTML = kitMovesHtml(c);
      S.preview = new SpritePreview(S.cv, assets[idx], anim, i === 1);
      this.previews = sides.map((x) => x.preview).filter(Boolean);
    };

    const render = () => {
      cells.forEach((c, i) => {
        c.classList.toggle('p1', step === 0 && i === cursor);
        c.classList.toggle('p2', step === 1 && i === cursor);
        c.classList.toggle('picked1', picks[0] === i);
        c.classList.toggle('picked2', picks[1] === i);
      });
      if (step < 2) showSide(step, cursor);
      diff.classList.toggle('hidden', step !== 2);
      diff.innerHTML = `<span class="arrow">◀</span> CPU LEVEL: <b>${levels[level]}</b> <span class="arrow">▶</span>`;
      const touchUi = this.game.input.lastDevice === 'touch';
      hint.textContent = touchUi
        ? step === 2 ? 'Tap ◀ ▶ to change the level · tap the level to FIGHT' : 'Tap a fighter to pick'
        : step === 2 ? 'Left/Right to change · Enter to FIGHT · Esc to go back'
        : `${step === 0 ? 'P1' : mode === 'solo' ? 'Pick the CPU opponent' : mode === 'training' ? 'Pick the training dummy' : 'P2'} · Arrows/WASD to move · Enter to select · Esc to go back`;
    };

    const confirm = () => {
      if (step < 2 && cursor >= roster.length) { audio.play('block'); return; }
      audio.play('uiConfirm');
      if (step === 0) {
        picks[0] = cursor;
        showSide(0, cursor, 'taunt');
        step = 1;
        cursor = roster.length > 1 ? (cursor + 1) % roster.length : 0;
      } else if (step === 1) {
        picks[1] = cursor;
        showSide(1, cursor, 'taunt');
        if (mode === 'solo') step = 2;
        else if (mode === 'training') return this.game.startTraining({ p1: roster[picks[0]].id, p2: roster[picks[1]].id });
        else return this.game.startMatch({ mode, p1: roster[picks[0]].id, p2: roster[picks[1]].id });
      } else {
        return this.game.startMatch({ mode, p1: roster[picks[0]].id, p2: roster[picks[1]].id, level: levels[level].toLowerCase() });
      }
      render();
    };

    const move = (d) => {
      if (step === 2) { level = (level + (d > 0 ? 1 : 2)) % 3; audio.play('ui'); render(); return; }
      cursor = (cursor + d + slots) % slots;
      audio.play('ui');
      render();
    };
    const cols = 4;
    this.ctrl = {
      left: () => move(-1),
      right: () => move(1),
      up: () => step < 2 && move(-cols),
      down: () => step < 2 && move(cols),
      confirm,
      back: () => {
        audio.play('ui');
        if (step === 0) return onBack ? onBack() : this.modeSelect(mode === 'solo' ? 0 : mode === 'training' ? 2 : 1);
        step--;
        picks[step] = null;
        if (step === 0) showSide(1, null);
        render();
      },
    };
    // tap the arrows to change the level, anywhere else to fight
    diff.onclick = (e) => {
      const arrow = e.target.closest?.('.arrow');
      if (arrow) move(arrow.textContent.includes('◀') ? -1 : 1);
      else confirm();
    };
    showSide(1, null);
    render();
  }

  pause(onResume, onQuit, training = false, index = 0) {
    this.clear();
    this.screen = 'pause';
    this.root.classList.add('panel-screen', 'dim');
    this.root.append(el('div', 'screen-title', training ? 'TRAINING' : 'PAUSED'));
    const again = (i) => () => this.pause(onResume, onQuit, training, i);
    const g = this.game;
    const items = training
      ? [
          { label: 'RESUME', action: onResume },
          { label: 'CONTROLS & REBINDING', sub: 'PS / Xbox / keyboard layouts', action: () => this.controls(again(1)) },
          {
            label: () => `DUMMY: ◀ ${DUMMY_MODES.find(([id]) => id === g.trainingCfg.dummy)?.[1]} ▶`,
            cycle: (d) => {
              const i = DUMMY_MODES.findIndex(([id]) => id === g.trainingCfg.dummy);
              g.setDummy(DUMMY_MODES[(i + d + DUMMY_MODES.length) % DUMMY_MODES.length][0]);
            },
          },
          { label: () => `INFINITE KI: ◀ ${g.trainingCfg.infiniteKi ? 'ON' : 'OFF'} ▶`, cycle: () => { g.trainingCfg.infiniteKi = !g.trainingCfg.infiniteKi; } },
          { label: () => `HITBOXES: ◀ ${g.showBoxes ? 'ON' : 'OFF'} ▶`, cycle: () => { g.showBoxes = !g.showBoxes; } },
          { label: 'RESET POSITIONS', action: () => { onResume(); g.resetTrainingPositions(); } },
          { label: 'CHANGE FIGHTERS', action: () => this.charSelect('training', again(6)) },
          { label: 'EXIT TRAINING', action: () => g.exitTraining() },
        ]
      : [
          { label: 'RESUME', action: onResume },
          { label: 'CONTROLS', sub: 'PS / Xbox / keyboard · rebind', action: () => this.controls(again(1)) },
          { label: 'QUIT TO TITLE', action: onQuit },
        ];
    const { box, ctrl } = this.list(items, { index, back: onResume });
    this.root.append(box);
    this.ctrl = ctrl;
  }

  results(winner, asset, onRematch, onChars, onTitle) {
    this.clear();
    this.screen = 'results';
    this.root.classList.add('panel-screen', 'results');
    const head = el('div', 'res-head');
    const cv = document.createElement('canvas');
    cv.width = asset.meta.frameWidth; cv.height = asset.meta.frameHeight;
    cv.className = 'cs-sprite big';
    head.append(cv, el('div', 'res-text', `<div class="res-win">WINNER</div><div class="res-name" style="color:${winner.def.color}">${winner.def.name}</div>`));
    this.root.append(head);
    this.previews = [new SpritePreview(cv, asset, 'win')];
    const { box, ctrl } = this.list([
      { label: 'REMATCH', action: onRematch },
      { label: 'CHARACTER SELECT', action: onChars },
      { label: 'TITLE', action: onTitle },
    ]);
    this.root.append(box);
    this.ctrl = ctrl;
  }
}

// Small canvas animator for menus.
class SpritePreview {
  constructor(cv, asset, anim, flip = false) {
    this.cv = cv;
    this.ctx = cv.getContext('2d');
    this.asset = asset;
    this.flip = flip;
    this.a = asset.anim(anim);
    this.i = 0;
    this.t = 0;
    this.draw();
  }
  update(dt) {
    this.t += dt;
    const d = this.a.durations?.[this.i] ?? 100;
    if (this.t >= d) {
      this.t = 0;
      this.i = (this.i + 1) % this.a.frames.length;
      this.draw();
    }
  }
  draw() {
    const { ctx, asset } = this;
    const m = asset.meta, f = this.a.frames[this.i];
    const W = this.cv.width, H = this.cv.height;
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    if (this.flip) { ctx.translate(W, 0); ctx.scale(-1, 1); }
    ctx.drawImage(asset.image, (f % asset.cols) * m.frameWidth, Math.floor(f / asset.cols) * m.frameHeight, m.frameWidth, m.frameHeight, 0, 0, W, H);
    ctx.restore();
  }
}
