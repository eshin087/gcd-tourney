import { audio } from '../core/audio.js';
import { portraitCanvas } from './hud.js';
import { ControlsPanel } from './controls.js';
import { IS_TOUCH_DEVICE } from '../core/touch.js';
import { kitOf } from '../game/kit.js';
import { SPECIAL_MOVES, SUPERS } from '../game/moves.js';
import { CPU_LEVELS } from '../game/ai.js';
import { QUICK } from '../net/quickChat.js';

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
  rows.push(`<div><b>${SUPERS[k.ultimate]?.name ?? c.beam.name}</b> ultimate</div>`);
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
      <tr><td>Parry</td><td>tap Guard just before a hit lands: no damage, they stagger <small>(mashing Guard won't parry)</small></td></tr>
      <tr><td>Spot dodge</td><td>Guard + push ↓</td></tr>
      <tr><td>Air dodge</td><td>Guard in the air <small>(+ direction, once per jump)</small></td></tr>
      <tr><td>Wavedash</td><td>Jump, then at once Guard + direction: slide, attack out of it</td></tr>
      <tr><td>Throw</td><td>Light + Heavy up close: beats Guard and parry · grabbed? Light + Heavy to break</td></tr>
    </table>
  </div>`;

const DUMMY_MODES = [['stand', 'STAND'], ['guard', 'GUARD'], ['jump', 'JUMP'], ['cpu', 'CPU']];
// the pause menus' MUSIC volume row (ADR 0019): left / right in 10% steps, a tap steps up and wraps to OFF
const musicRow = () => ({
  label: () => `MUSIC: ◀ ${audio.musicVolume > 0 ? `${Math.round(audio.musicVolume * 100)}%` : 'OFF'} ▶`,
  cycle: (d) => audio.stepMusicVolume(d),
});
const NO_COVER = Object.freeze({ x: 0, y: 0 }); // resultsCover() off the results screen

// SELECT MODE rows in display order. modeIndex() reads the same table, so a new row can't desync the
// cursor a screen returns to (a hard-coded index went stale when CPU VS CPU was added). The ids of the
// fight rows (solo, versus, cpu) are the charSelect / startMatch mode strings.
const MODES = [
  { id: 'solo', label: 'VS CPU', sub: 'fight the computer' },
  { id: 'versus', label: '2 PLAYERS', sub: 'same keyboard or two gamepads' },
  { id: 'online', label: 'ONLINE', sub: 'a room for you and your friends · watch while you wait' },
  { id: 'cpu', label: 'CPU VS CPU', sub: 'sit back and watch two CPUs go all out' },
  { id: 'training', label: 'TRAINING & CONTROLS', sub: 'practice room · PS / Xbox layouts · rebind' },
  { id: 'sprites', label: 'SPRITE LAB', sub: 'preview & export sprite sheets' },
];

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
      const sub = typeof it.sub === 'function' ? it.sub() : it.sub;
      const b = el('button', 'item' + (it.cycle ? ' cyc' : ''), `<span>${label(it)}</span>${it.sub ? `<small>${sub}</small>` : ''}`);
      b.onmouseenter = () => { idx = i; render(); };
      // stop here: an item that opens the title screen (TITLE, QUIT TO TITLE) would otherwise bubble into the
      // click-anywhere handler title() just put on .menus and skip straight on to mode select
      b.onclick = (e) => { e.stopPropagation(); idx = i; confirm(); };
      box.append(b);
      return b;
    });
    const render = () => btns.forEach((b, i) => {
      b.classList.toggle('sel', i === idx);
      if (typeof items[i].label === 'function') b.querySelector('span').innerHTML = label(items[i]);
      if (typeof items[i].sub === 'function') b.querySelector('small').innerHTML = items[i].sub();
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
    return { box, ctrl, refresh: render };
  }

  // ------------------------------------------------------------ screens
  title() {
    this.clear();
    this.screen = 'title';
    this.root.classList.add('title-screen');
    // packed title art (npm run sprites ui) replaces the CSS logo / sits behind it; without it the text logo stays
    const art = this.game.uiArt;
    this.root.innerHTML = `
      ${art?.titleArt ? `<img class="title-art" src="${art.titleArt}" alt="">` : ''}
      <div class="logo">
        ${art?.logo ? `<img class="logo-img" src="${art.logo}" alt="GCD TOURNEY 天下一武闘祭">` : `<div class="logo-main" data-t="GCD TOURNEY">GCD TOURNEY</div>
        <div class="logo-sub">天下一武闘祭</div>`}
      </div>
      <div class="press">${this.game.input.lastDevice === 'touch' ? 'TAP TO START' : 'PRESS ENTER / START'}</div>
      <div class="foot">HD-2D anime arena fighter · tech demo · art in progress</div>`;
    const go = () => {
      audio.init();
      audio.play('gong');
      audio.startMusic('menu');
      this.modeSelect();
    };
    this.root.onclick = go;
    this.ctrl = { confirm: go, pause: go };
  }

  // Row of a mode on the SELECT MODE list (for going back to it with the cursor in place).
  modeIndex(mode) {
    return Math.max(0, MODES.findIndex((m) => m.id === mode));
  }

  modeSelect(index = 0) {
    this.clear();
    this.screen = 'mode';
    this.root.classList.add('panel-screen');
    this.root.append(el('div', 'screen-title', 'SELECT MODE'));
    // rows without an entry here are fight modes: they go to character select
    const act = {
      training: () => this.game.startTraining(),
      online: () => this.game.openOnline(),
      sprites: () => window.open('/sprites.html', '_blank'),
    };
    const { box, ctrl } = this.list(
      MODES.map((m) => ({ label: m.label, sub: m.sub, action: act[m.id] || (() => this.charSelect(m.id)) })),
      { index, back: () => this.title() });
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
    // combo escape (ADR 0022): how the dummy gets out of your combos
    const optRow = (label, key, opts) => {
      const row = el('div', 'tr-row'), box = el('div', 'tr-chips');
      for (const [v, text] of opts) {
        const b = el('button', 'ctl-chip' + (g.dummyOpts[key] === v ? ' on' : ''), text);
        b.onclick = () => {
          g.dummyOpts[key] = v;
          audio.play('ui');
          box.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b));
        };
        box.append(b);
      }
      row.append(el('span', 'tr-label', label), box);
      return row;
    };
    const techRow = optRow('DUMMY TECH', 'tech', [['never', 'NEVER'], ['hold', 'HOLD'], ['random', 'RANDOM'], ['timed', 'TIMED']]); // timed: ADR 0028
    const burstRow = optRow('DUMMY BURST', 'burst', [[false, 'OFF'], [true, 'ON']]);

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
    opts.append(modeRow, techRow, burstRow, kiRow, boxRow);

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

  // mode: 'solo' | 'versus' | 'cpu' | 'training'. onBack overrides where Esc on the first pick goes.
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
    const cpuLevel = mode === 'solo' || mode === 'cpu'; // modes with a difficulty step
    const levels = CPU_LEVELS.map((l) => l.toUpperCase());
    let level = mode === 'cpu' ? levels.length - 1 : 1; // spectating defaults to IMPOSSIBLE: the point is to watch the best bots
    const tags = { solo: ['P1', 'CPU'], cpu: ['CPU 1', 'CPU 2'], training: ['P1', 'DUMMY'] }[mode] || ['P1', 'P2'];
    const who = { solo: ['P1', 'Pick the CPU opponent'], cpu: ['Pick CPU 1', 'Pick CPU 2'], training: ['P1', 'Pick the training dummy'] }[mode] || ['P1', 'P2'];
    const go = mode === 'cpu' ? 'WATCH' : 'FIGHT';

    const title = el('div', 'screen-title', mode === 'cpu' ? 'CHOOSE THE FIGHTERS' : 'CHOOSE YOUR FIGHTER');
    const wrap = el('div', 'cs-wrap');
    const sides = [0, 1].map((i) => {
      const s = el('div', `cs-side s${i + 1}`);
      const tag = el('div', 'cs-tag', tags[i]);
      const cv = document.createElement('canvas');
      cv.width = assets[0].meta.frameWidth; cv.height = assets[0].meta.frameHeight;
      cv.className = 'cs-sprite';
      // the hand-made select illustration (select.png) when a fighter has one; the animated sprite otherwise
      const art = el('img', 'cs-art hidden');
      art.alt = '';
      const name = el('div', 'cs-name');
      const sub = el('div', 'cs-sub');
      const moves = el('div', 'cs-moves');
      s.append(tag, cv, art, name, sub, moves);
      return { s, cv, art, name, sub, moves, preview: null };
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
        S.art.classList.add('hidden');
        S.cv.classList.remove('hidden');
        S.cv.getContext('2d').clearRect(0, 0, S.cv.width, S.cv.height);
        this.previews = sides.map((x) => x.preview).filter(Boolean);
        return;
      }
      const c = roster[idx];
      S.name.textContent = c.name;
      S.name.style.color = c.color;
      S.sub.textContent = c.subtitle;
      S.moves.innerHTML = kitMovesHtml(c);
      const sel = assets[idx].select;
      if (sel) {
        // mirror the illustration when it faces away from the middle (P1 looks right, P2 left)
        S.art.src = sel.src;
        S.art.classList.toggle('flip', (c.selectFacing || 'right') !== (i === 0 ? 'right' : 'left'));
        S.art.classList.remove('hidden');
        S.cv.classList.add('hidden');
        S.preview = null;
      } else {
        S.art.classList.add('hidden');
        S.cv.classList.remove('hidden');
        S.preview = new SpritePreview(S.cv, assets[idx], anim, i === 1);
      }
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
        ? step === 2 ? `Tap ◀ ▶ to change the level · tap the level to ${go}` : 'Tap a fighter to pick'
        : step === 2 ? `Left/Right to change · Enter to ${go} · Esc to go back`
        : `${who[step]} · Arrows/WASD to move · Enter to select · Esc to go back`;
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
        if (cpuLevel) step = 2;
        else if (mode === 'training') return this.game.startTraining({ p1: roster[picks[0]].id, p2: roster[picks[1]].id });
        else return this.game.startMatch({ mode, p1: roster[picks[0]].id, p2: roster[picks[1]].id });
      } else {
        return this.game.startMatch({ mode, p1: roster[picks[0]].id, p2: roster[picks[1]].id, level: levels[level].toLowerCase() });
      }
      render();
    };

    const move = (d) => {
      if (step === 2) { level = (level + (d > 0 ? 1 : levels.length - 1)) % levels.length; audio.play('ui'); render(); return; }
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
        if (step === 0) return onBack ? onBack() : this.modeSelect(this.modeIndex(mode));
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

  // ------------------------------------------------------------ online (ADR 0036, ENG-094/095; the logic is net/online.js)
  // Your name and a room code: browse the public rooms, open a public or private one, or join one by its code (code:
  // from an invite link, JOIN is then selected). Room titles and member names come from the server, already filtered,
  // and always go in as text, never as markup.
  onlineEntry(online, code = '') {
    this.clear();
    this.screen = 'online-entry';
    this.root.classList.add('panel-screen', 'online-screen');
    this.root.append(el('div', 'screen-title', 'ONLINE'));
    const field = (label, input) => {
      const f = el('label', 'on-field');
      f.append(el('span', '', label), input);
      return f;
    };
    const input = (cls, value, max, placeholder) => {
      const i = el('input', 'on-input ' + cls);
      Object.assign(i, { value, maxLength: max, placeholder, autocomplete: 'off', spellcheck: false });
      return i;
    };
    const name = input('on-name', online.name, 16, 'your name');
    const room = input('on-code', code, 5, 'CODE');
    room.autocapitalize = 'characters';
    room.addEventListener('input', () => { room.value = room.value.toUpperCase(); });
    const form = el('div', 'on-form');
    form.append(field('YOUR NAME', name), field('ROOM CODE', room));
    const msg = el('div', 'on-msg');
    msg.textContent = online.error || (online.available ? '' : 'Online play is not set up yet.');
    const named = (fn) => () => { online.setName(name.value); fn(); };
    const join = named(() => online.join(room.value));
    const { box, ctrl } = this.list([
      { label: 'BROWSE PUBLIC ROOMS', sub: 'join anyone playing now', action: named(() => online.browse()) },
      { label: 'CREATE A PUBLIC ROOM', sub: 'listed for everyone to join', action: named(() => online.create(true)) },
      { label: 'CREATE A PRIVATE ROOM', sub: 'only people with your invite link', action: named(() => online.create(false)) },
      { label: 'JOIN WITH A CODE', sub: 'the code a friend sent you', action: join },
    ], { index: code ? 3 : 0, back: () => this.modeSelect(this.modeIndex('online')) });
    // Enter in a field: join with a code, else browse
    for (const i of [name, room]) i.addEventListener('keydown', (e) => { if (e.key === 'Enter') (room.value.trim() ? join : named(() => online.browse()))(); });
    this.root.append(form, msg, box);
    this.ctrl = ctrl;
  }

  // the anti-bot check before a public room opens: Cloudflare's widget draws itself in the returned element
  onlineVerify(online) {
    this.clear();
    this.screen = 'online-verify';
    this.root.classList.add('panel-screen', 'online-screen');
    this.root.append(el('div', 'screen-title', 'OPENING A PUBLIC ROOM'));
    this.root.append(el('div', 'on-status', 'A quick check that you are a person (Cloudflare Turnstile)'));
    const box = el('div', 'on-turnstile');
    const { box: list, ctrl } = this.list([{ label: 'CANCEL', action: () => online.cancelVerify() }], { back: () => online.cancelVerify() });
    this.root.append(box, list);
    this.ctrl = ctrl;
    return box;
  }

  // The public rooms (online.rooms; null while loading): each joins on confirm. Pings fill in as they're measured
  // (onlineBrowseRefresh).
  onlineBrowse(online) {
    this.clear();
    this.screen = 'online-browse';
    this.root.classList.add('panel-screen', 'online-screen');
    this.root.append(el('div', 'screen-title', 'PUBLIC ROOMS'));
    const msg = el('div', 'on-status');
    const rooms = online.rooms;
    msg.textContent = rooms == null ? 'LOADING...' : online.error || (rooms.length ? `${rooms.length} open` : 'No public rooms right now: create one');
    const esc = (t) => String(t).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
    const items = (rooms || []).map((r) => ({
      label: () => esc(r.title) + (r.full ? ' · FULL' : ''),
      sub: () => [r.region, `${r.members} here`, r.playing ? esc(r.playing.join(' vs ')) : 'waiting for players', r.ping != null ? `${r.ping} ms` : '... ms'].filter(Boolean).join(' · '),
      action: () => (r.full ? audio.play('block') : online.join(r.code)),
    }));
    items.push({ label: 'REFRESH', action: () => online.browse() });
    items.push({ label: 'CREATE A PUBLIC ROOM', action: () => online.create(true) });
    const { box, ctrl, refresh } = this.list(items, { cls: 'on-browse', back: () => online.entry() });
    this.root.append(msg, box);
    this.ctrl = ctrl;
    this.onlineBrowseRefresh = () => { if (this.screen === 'online-browse') refresh(); };
  }

  // connecting
  onlineWait(online, text) {
    this.clear();
    this.screen = 'online-wait';
    this.root.classList.add('panel-screen', 'online-screen');
    this.root.append(el('div', 'screen-title', text));
    const { box, ctrl } = this.list([{ label: 'CANCEL', action: () => online.leaveRoom() }], { back: () => online.leaveRoom() });
    this.root.append(box);
    this.ctrl = ctrl;
  }

  // The room between matches (or over a match being watched: overlay): who is here, who plays, the line, your
  // fighter and whether you queue, the quick-chat, removing someone (the host does; others vote; tap a member's row to
  // point at them). onlineRefresh() repaints it on every room update without moving the cursor.
  onlineRoom(online, overlay = false) {
    this.clear();
    this.screen = 'online-room';
    this.root.classList.add('panel-screen', 'online-screen');
    if (overlay) this.root.classList.add('dim');
    const roster = this.game.roster, assets = this.game.rosterAssets;
    const fighterName = (id) => roster.find((c) => c.id === id)?.name ?? id;
    const title = el('div', 'screen-title', `ROOM ${online.code}`);
    const tag = el('div', 'on-tag');
    const status = el('div', 'on-status');
    const members = el('div', 'on-members');
    const chat = el('div', 'on-chat');
    const memberName = (id) => online.room?.members.find((m) => m.id === id)?.name ?? '';
    const removeLabel = () => {
      const R = online.room, t = online.target && memberName(online.target);
      if (!t) return 'REMOVE: no one else here';
      const host = online.isHost(), votes = R?.votes?.[online.target] || 0;
      return `${host ? 'REMOVE' : 'VOTE TO REMOVE'}: ◀ ${t.replace(/[&<>"']/g, '')}${host ? '' : ` (${votes}/${R?.needed ?? 2})`} ▶`;
    };
    const { box, ctrl, refresh } = this.list([
      { label: () => `FIGHTER: ◀ ${fighterName(online.fighter).toUpperCase()} ▶`, cycle: (d) => online.cycleFighter(d) },
      { label: () => `PLAY: ◀ ${online.play ? 'YES, IN LINE' : 'NO, JUST WATCH'} ▶`, cycle: () => online.setPlay(!online.play) },
      { label: () => `SAY: ◀ ${QUICK[online.sayIndex]} ▶`, cycle: (d) => { online.sayIndex = (online.sayIndex + d + QUICK.length) % QUICK.length; }, action: () => online.say() },
      { label: 'INVITE A FRIEND', sub: online.inviteUrl().replace(/^https?:\/\//, ''), action: () => online.invite() },
      { label: removeLabel, cycle: (d) => online.pickTarget(d), action: () => online.remove() },
      ...(overlay ? [{ label: 'BACK TO THE MATCH', action: () => online.menuKey() }] : []),
      { label: 'LEAVE ROOM', action: () => online.leaveRoom() },
    ], { cls: 'on-actions', back: overlay ? () => online.menuKey() : null });
    const left = el('div', 'on-left');
    left.append(members, chat);
    const cols = el('div', 'on-cols');
    cols.append(left, box);
    this.root.append(title, tag, status, cols);
    this.ctrl = ctrl;
    const paint = () => {
      const R = online.room;
      if (!R) return;
      if (!online.others().some((m) => m.id === online.target)) online.pickTarget(0);
      tag.textContent = R.pub ? `PUBLIC ROOM · ${R.title}${R.region ? ` · ${R.region}` : ''}` : 'PRIVATE ROOM · invite only';
      chat.replaceChildren(...(R.chat || []).slice(-6).map((c) => {
        const line = el('div', 'on-line');
        const b = el('b');
        b.textContent = c.name;
        line.append(b, document.createTextNode(` ${QUICK[c.i] ?? ''}`));
        return line;
      }));
      const playing = R.match?.players ?? [];
      const order = (m) => (playing.includes(m.id) ? playing.indexOf(m.id) : R.queue.includes(m.id) ? 2 + R.queue.indexOf(m.id) : 1e3);
      const names = (ids) => ids.map((id) => R.members.find((m) => m.id === id)?.name ?? '?').join(' vs ');
      status.textContent = online.note
        || (R.match ? `NOW: ${names(playing)}`
          : R.queue.length >= 2 ? `NEXT: ${names(R.queue.slice(0, 2))}`
          : R.members.length < 2 ? 'Waiting for a second player: send the invite link'
          : 'Waiting for a second player to get in line');
      members.innerHTML = '';
      for (const m of [...R.members].sort((a, b) => order(a) - order(b))) {
        const q = R.queue.indexOf(m.id);
        const role = m.away ? 'RECONNECTING'
          : playing.includes(m.id) ? 'PLAYING'
          : q < 0 ? 'WATCHING'
          : !R.match && R.queue.length < 2 ? 'READY'
          : (R.match ? q === 0 : q < 2) ? 'NEXT' : `IN LINE ${R.match ? q + 1 : q}`;
        const row = el('div', 'on-row' + (m.id === online.you ? ' me' : '') + (playing.includes(m.id) ? ' live' : '') + (m.id === online.target ? ' target' : ''));
        if (m.id !== online.you) row.onclick = () => { online.target = m.id; paint(); };
        const i = roster.findIndex((c) => c.id === m.fighter);
        const pic = i >= 0 ? portraitCanvas(assets[i], 22) : el('span', 'on-pic');
        const who = el('div', 'on-who');
        const nm = el('b');
        nm.textContent = m.name + (m.id === online.you ? ' (you)' : '') + (m.id === R.host ? ' ★' : '');
        const sub = el('small');
        sub.textContent = fighterName(m.fighter) + (m.wins ? ` · ${m.wins} win${m.wins > 1 ? 's' : ''}` : '') + (m.streak > 1 ? ` · ${m.streak} in a row` : '');
        who.append(nm, sub);
        row.append(pic, who, el('span', 'on-role', role));
        members.append(row);
      }
      refresh();
    };
    this.onlineRefresh = paint;
    paint();
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
          musicRow(),
          { label: 'EXIT TRAINING', action: () => g.exitTraining() },
        ]
      : [
          { label: 'RESUME', action: onResume },
          { label: 'CONTROLS', sub: 'PS / Xbox / keyboard · rebind', action: () => this.controls(again(1)) },
          musicRow(),
          { label: 'QUIT TO TITLE', action: onQuit },
        ];
    const { box, ctrl } = this.list(items, { index, back: onResume });
    this.root.append(box);
    this.ctrl = ctrl;
  }

  // Post-match: the live 3D winner is the hero shot (camera 'results'; Game.render shifts the projection by
  // resultsCover()), so this screen is only a slim side panel: no second sprite, no full-screen dim.
  results(winner, onRematch, onChars, onTitle) {
    this.clear();
    this.screen = 'results';
    this._resCover = null;
    this.root.classList.add('results-screen');
    const d = winner.def;
    const tag = ({ solo: ['P1', 'CPU'], cpu: ['CPU 1', 'CPU 2'] }[this.game.cfg?.mode] || ['P1', 'P2'])[winner.index];
    const panel = el('div', 'res-panel');
    panel.append(el('div', 'res-text',
      `<div class="res-win">WINNER · ${tag}</div><div class="res-name" style="color:${d.color};--len:${d.name.length}">${d.name}</div>` +
      (d.subtitle ? `<div class="res-sub">${d.subtitle}</div>` : '')));
    const { box, ctrl } = this.list([
      { label: 'REMATCH', action: onRematch },
      { label: 'CHARACTER SELECT', action: onChars },
      { label: 'TITLE', action: onTitle },
    ], { cls: 'res-list' });
    panel.append(box);
    this.root.append(panel);
    this.ctrl = ctrl;
  }

  // Screen fractions the results panel hides: x from the right (side column) or y from the bottom (the bar a
  // window narrower than 3:4 gets). Layout offsets ignore the slide-in transform, so the shot moves once, not
  // with the animation. Cached like panelCover: reading layout every frame would force a reflow per frame.
  resultsCover() {
    if (this.screen !== 'results') return NO_COVER;
    const now = performance.now();
    if (!this._resCover || now - this._resCover.t > 500) {
      const p = this.root.querySelector('.res-panel');
      const W = this.root.clientWidth || window.innerWidth, H = this.root.clientHeight || window.innerHeight;
      const bar = !!p && p.offsetWidth > W * 0.7;
      this._resCover = {
        t: now,
        x: p && !bar ? Math.max(0, Math.min(0.5, 1 - p.offsetLeft / W)) : 0,
        y: p && bar ? Math.max(0, Math.min(0.5, 1 - p.offsetTop / H)) : 0,
      };
    }
    return this._resCover;
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
