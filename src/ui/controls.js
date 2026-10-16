// Controls panel: keyboard / PlayStation / Xbox layouts with live input
// highlights and rebinding. Mouse-driven inside the live training room, and
// keyboard/gamepad navigable (nav()) on the pause / menu controls page.
import { ACTIONS, DIRECTIONS, ACTION_LABELS, KEYMAPS, PAD_BUTTONS, PAD_NAMES, RESERVED_KEYS, keyLabel } from '../core/input.js';
import { audio } from '../core/audio.js';
import { IS_TOUCH_DEVICE } from '../core/touch.js';

const el = (tag, cls, html = '') => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  return e;
};

const LAYOUTS = [['keyboard', 'KEYBOARD'], ['playstation', 'PLAYSTATION'], ['xbox', 'XBOX'], ...(IS_TOUCH_DEVICE ? [['touch', 'TOUCH']] : [])];

// On-screen controls (src/core/touch.js): what each one does
const TOUCH_ROWS = [
  ['move', 'Joystick (left half)', 'Move · flick twice to dash'],
  ['light', 'LIGHT', 'Light attack · auto combo'],
  ['heavy', 'HEAVY', 'Heavy / launcher'],
  ['special', 'SPECIAL', 'Signature rush · hold to charge ki'],
  ['jump', 'JUMP', 'Jump · chase after a launcher'],
  ['guard', 'GUARD', 'Block (or hold the stick away) · tap to parry · hold while hit: tech / tech roll'],
  ['dash', 'DASH', 'Dash with the stick · super dash without'],
  ['ult', 'ULT', 'Ultimate (Heavy + Special, 3 bars)'],
  ['vanish', 'VANISH', 'Vanish (Guard + Special, 1 bar) · while hit: Burst (2 bars, once per round)'],
  ['super', 'SUPER', 'Second super (3 bars)'],
];
const PROFILES = [['solo', 'VS CPU / TRAINING'], ['p1', '2P · PLAYER 1'], ['p2', '2P · PLAYER 2']];
const PROFILE_SHORT = { solo: 'Solo', p1: 'P1', p2: 'P2' };

// Face-button colors per layout (✕ ○ □ △ / A B X Y)
const FACE = {
  playstation: { 0: '#7fa6ff', 1: '#ff6070', 2: '#ff8fd8', 3: '#40e0a8' },
  xbox: { 0: '#6ed35a', 1: '#ff5a5a', 2: '#4aa8ff', 3: '#ffcf3a' },
};

const SHORT = { light: 'Light', heavy: 'Heavy', special: 'Special', jump: 'Jump', guard: 'Guard', dash: 'Dash', super: 'Super' };

// Gamepad diagram: button index -> [x, y] in a 440x250 viewBox.
const SPOTS = {
  0: [334, 148], 1: [362, 120], 2: [306, 120], 3: [334, 92],
  4: [104, 44], 5: [336, 44], 6: [104, 18], 7: [336, 18],
  8: [178, 88], 9: [262, 88], 12: [110, 98], 13: [110, 142], 14: [88, 120], 15: [132, 120],
};

export function deviceLayout(input) {
  return input.lastDevice || 'keyboard';
}

export class ControlsPanel {
  // opts: { profile, layout, onLayout(layout), onBack() }
  constructor(input, opts = {}) {
    this.input = input;
    this.opts = opts;
    this.layout = opts.layout || deviceLayout(input);
    this.userPicked = !!opts.layout;
    this.profile = opts.profile || 'solo';
    this.focus = 0;
    this.navMode = false;
    this.capturing = false;
    this.root = el('div', 'ctl-panel');
    // stop clicks from focusing buttons (Space / Enter would re-click them mid-fight)
    this.root.addEventListener('mousedown', (e) => { if (e.target.closest('button')) e.preventDefault(); });
    this.unsub = input.onDevice((d) => {
      if (!this.userPicked && !this.capturing && d !== this.layout) {
        this.layout = d;
        this.focus = 0;
        this.navMode = false; // the press that switched devices only re-reveals the focus ring
        this.render();
      }
    });
    this.render();
  }

  destroy() {
    this.unsub?.();
    if (this.capturing) this.input.cancelCapture();
    this.root.remove();
  }

  setLayout(id) {
    this.userPicked = true;
    this.layout = id;
    this.opts.onLayout?.(id);
    audio.play('ui');
    this.render();
  }

  // ------------------------------------------------------------ rendering
  render() {
    const r = this.root;
    r.innerHTML = '';
    this.items = [];
    this.rows = {};
    const tabs = el('div', 'ctl-tabs');
    for (const [id, label] of LAYOUTS) {
      const b = el('button', 'ctl-tab' + (this.layout === id ? ' on' : ''), label);
      b.onclick = () => this.setLayout(id);
      tabs.append(b);
    }
    r.append(tabs);
    const cycleLayout = (d) => {
      const i = LAYOUTS.findIndex(([id]) => id === this.layout);
      this.setLayout(LAYOUTS[(i + d + LAYOUTS.length) % LAYOUTS.length][0]);
    };
    this.items.push({ el: tabs, left: () => cycleLayout(-1), right: () => cycleLayout(1), confirm: () => cycleLayout(1) });

    if (this.layout === 'touch') this.renderTouch(r);
    else if (this.layout === 'keyboard') this.renderKeyboard(r);
    else this.renderPad(r);

    const foot = el('div', 'ctl-foot');
    const reset = el('button', 'ctl-btn', 'RESET TO DEFAULTS');
    const doReset = () => { this.input.resetBindings(); audio.play('uiConfirm'); this.render(); };
    reset.onclick = doReset;
    foot.append(reset);
    this.items.push({ el: reset, confirm: doReset });
    if (this.opts.onBack) {
      const back = el('button', 'ctl-btn', 'BACK');
      const goBack = () => { audio.play('ui'); this.opts.onBack(); };
      back.onclick = goBack;
      foot.append(back);
      this.items.push({ el: back, confirm: goBack });
    }
    r.append(foot);
    this.tip = el('div', 'ctl-tip', this.layout === 'touch'
      ? 'Touch buttons are fixed; pick a size that fits your thumbs. The pause button is top-left.'
      : this.layout === 'keyboard'
      ? 'Click a row (or select it and confirm), then press the new key. Esc cancels.'
      : 'Click a row (or select it and press ✕ / A), then press the new button. Esc or Options / Menu cancels.');
    r.append(this.tip);
    this.focus = Math.min(this.focus, this.items.length - 1);
    this.paintFocus();
  }

  bindingRow(list, action, keysHtml, kind) {
    const row = el('div', 'ctl-row');
    row.append(el('span', 'ctl-name', ACTION_LABELS[action]), el('span', 'ctl-key', keysHtml));
    row.title = 'Click to rebind';
    row.onclick = () => this.rebind(row, action, kind);
    list.append(row);
    this.rows[action] = row;
    this.items.push({ el: row, confirm: () => this.rebind(row, action, kind) });
  }

  renderKeyboard(r) {
    const prof = el('div', 'ctl-profiles');
    for (const [id, label] of PROFILES) {
      const b = el('button', 'ctl-chip' + (this.profile === id ? ' on' : ''), label);
      b.onclick = () => { this.profile = id; audio.play('ui'); this.render(); };
      prof.append(b);
    }
    r.append(prof);
    const cycleProfile = (d) => {
      const i = PROFILES.findIndex(([id]) => id === this.profile);
      this.profile = PROFILES[(i + d + PROFILES.length) % PROFILES.length][0];
      audio.play('ui');
      this.render();
    };
    this.items.push({ el: prof, left: () => cycleProfile(-1), right: () => cycleProfile(1), confirm: () => cycleProfile(1) });

    const list = el('div', 'ctl-list');
    const map = KEYMAPS[this.profile];
    for (const a of [...DIRECTIONS, ...ACTIONS]) {
      const keys = map[a] || [];
      this.bindingRow(list, a, keys.map((c, i) => `<kbd class="${i ? 'alt' : ''}">${keyLabel(c)}</kbd>`).join('') || '<i>unbound</i>', 'key');
    }
    r.append(list);
    const k = (a) => `<kbd>${keyLabel(map[a]?.[0])}</kbd>`;
    r.append(el('div', 'ctl-combos', `
      <div><b>Ultimate</b>${k('heavy')}+${k('special')}</div>
      <div><b>Vanish</b>${k('guard')}+${k('special')}</div>
      <div><b>Tech</b>hold ${k('guard')} while hit</div>
      <div><b>Burst</b>${k('guard')}+${k('special')} while hit</div>
      <div><b>Super dash</b>${k('dash')} no direction</div>
      <div><b>Specials</b>${k('special')} + ←↑→↓ for more</div>
      <div><b>Dash</b>double-tap a direction</div>`));
  }

  // Touch layout: what every on-screen control does, live highlights, button size.
  renderTouch(r) {
    const list = el('div', 'ctl-list');
    for (const [id, name, what] of TOUCH_ROWS) {
      const row = el('div', 'ctl-row touch-row', `<span class="ctl-key"><kbd class="t-${id}">${name}</kbd></span><span class="ctl-name">${what}</span>`);
      list.append(row);
      this.rows[id] = row;
    }
    r.append(list);
    const t = this.input.touch;
    if (!t) return;
    const sizes = el('div', 'ctl-profiles');
    sizes.append(el('span', 'ctl-size-label', 'BUTTON SIZE'));
    for (const [id, label] of [['s', 'SMALL'], ['m', 'MEDIUM'], ['l', 'LARGE']]) {
      const b = el('button', 'ctl-chip' + (t.prefs.size === id ? ' on' : ''), label);
      b.onclick = () => { t.setSize(id); audio.play('ui'); this.render(); };
      sizes.append(b);
    }
    r.append(sizes);
  }

  renderPad(r) {
    const L = this.layout;
    const names = PAD_NAMES[L];
    const face = FACE[L];
    const byButton = {};
    for (const a of ACTIONS) for (const i of PAD_BUTTONS[a] || []) (byButton[i] = byButton[i] || []).push(SHORT[a]);
    let svg = `<svg class="ctl-svg" viewBox="0 0 440 250" xmlns="http://www.w3.org/2000/svg">
      <path class="pad-body" d="M78 62 Q100 44 150 48 L290 48 Q340 44 362 62 Q406 112 414 184 Q418 232 374 234 Q342 236 312 194 L128 194 Q98 236 66 234 Q22 232 26 184 Q34 112 78 62 Z"/>
      <circle class="pad-stick" data-stick="0" cx="172" cy="160" r="22"/><circle class="pad-stick" cx="268" cy="160" r="22"/>
      <circle class="pad-nub" cx="172" cy="160" r="9"/>`;
    for (const [i, [x, y]] of Object.entries(SPOTS)) {
      const n = +i;
      const isFace = n <= 3, isShoulder = n >= 4 && n <= 7, isDpad = n >= 12;
      if (isShoulder) svg += `<rect data-b="${n}" class="pad-btn" x="${x - 34}" y="${y - 10}" width="68" height="20" rx="8"/>`;
      else if (isDpad) svg += `<rect data-b="${n}" class="pad-btn" x="${x - 11}" y="${y - 11}" width="22" height="22" rx="4"/>`;
      else svg += `<circle data-b="${n}" class="pad-btn${isFace ? ' face' : ''}" cx="${x}" cy="${y}" r="${isFace ? 14 : 9}" style="--f:${isFace ? face[n] : '#8a80b0'}"/>`;
      if (!isDpad) svg += `<text class="pad-glyph${isFace ? ' face' : ''}" x="${x}" y="${y + (isFace ? 5 : 3.5)}" style="${isFace ? `fill:${face[n]}` : ''}">${names[n]}</text>`;
      if (byButton[n] && !isDpad) {
        // face labels sit outside the diamond: △ above, ✕ below, □ left, ○ right
        const right = isShoulder ? x > 220 : n === 1 || n === 9;
        let anchor = right ? 'start' : 'end';
        let lx = right ? x + 20 : x - 20, ly = y + 4;
        if (isShoulder) lx = right ? x + 40 : x - 40;
        if (n === 3) { lx = x; ly = y - 20; anchor = 'middle'; }
        if (n === 0) { lx = x; ly = y + 30; anchor = 'middle'; }
        svg += `<text class="pad-act" x="${lx}" y="${ly}" text-anchor="${anchor}">${byButton[n].join(' / ')}</text>`;
      }
    }
    svg += `<text class="pad-act dim" x="172" y="200" text-anchor="middle">Move</text>
      <text class="pad-act dim" x="110" y="172" text-anchor="middle">Move</text>
      <text class="pad-act dim" x="262" y="72" text-anchor="middle">Pause</text>
      <text class="pad-act dim" x="178" y="72" text-anchor="middle">Reset*</text></svg>`;
    const wrap = el('div', 'ctl-svgwrap', svg);
    r.append(wrap);
    this.stickNub = wrap.querySelector('.pad-nub');

    const list = el('div', 'ctl-list');
    for (const a of ACTIONS) {
      const html = (PAD_BUTTONS[a] || []).map((i, k) => `<kbd class="${k ? 'alt' : ''}" style="${i <= 3 ? `color:${face[i]}` : ''}">${names[i]}</kbd>`).join('') || '<i>unbound</i>';
      this.bindingRow(list, a, html, 'pad');
    }
    r.append(list);
    const b = (a) => `<kbd style="${PAD_BUTTONS[a]?.[0] <= 3 ? `color:${face[PAD_BUTTONS[a][0]]}` : ''}">${names[PAD_BUTTONS[a]?.[0]] ?? '—'}</kbd>`;
    r.append(el('div', 'ctl-combos', `
      <div><b>Ultimate</b>${b('heavy')}+${b('special')}</div>
      <div><b>Vanish</b>${b('guard')}+${b('special')}</div>
      <div><b>Tech</b>hold ${b('guard')} while hit</div>
      <div><b>Burst</b>${b('guard')}+${b('special')} while hit</div>
      <div><b>Super dash</b>${b('dash')} stick neutral</div>
      <div><b>Specials</b>${b('special')} + stick direction</div>
      <div><b>*Training</b><kbd>${names[8]}</kbd> resets positions</div>`));
  }

  // ------------------------------------------------------------ rebinding
  rebind(row, action, kind) {
    if (this.capturing) return;
    this.capturing = true;
    row.classList.add('wait');
    row.querySelector('.ctl-key').innerHTML = kind === 'key' ? '<i>press a key…</i>' : '<i>press a button…</i>';
    audio.play('ui');
    this.input.captureNext((ev) => {
      this.capturing = false;
      let msg = '';
      if (ev.type === 'cancel' || (ev.type === 'key' && ev.code === 'Escape')) msg = 'Cancelled.';
      else if (kind === 'key' && ev.type === 'key') {
        if (RESERVED_KEYS.includes(ev.code)) msg = `${keyLabel(ev.code)} is reserved (menus / pause / mute).`;
        else {
          const lost = this.input.setKey(this.profile, action, ev.code);
          msg = this.lostTip(keyLabel(ev.code), lost.map(({ profile, action: a }) => ({
            name: `${profile === this.profile ? '' : PROFILE_SHORT[profile] + ' '}${ACTION_LABELS[a]}`,
            empty: !KEYMAPS[profile][a].length,
          })));
          audio.play('uiConfirm');
        }
      } else if (kind === 'pad' && ev.type === 'pad') {
        const lost = this.input.setPadButton(action, ev.index);
        msg = this.lostTip(PAD_NAMES[this.layout]?.[ev.index] ?? `button ${ev.index}`, lost.map((a) => ({ name: ACTION_LABELS[a], empty: !PAD_BUTTONS[a].length })));
        audio.play('uiConfirm');
      } else msg = kind === 'key' ? 'That was a gamepad button. Switch to a controller tab to rebind buttons.' : 'That was a key. Switch to the KEYBOARD tab to rebind keys.';
      this.render();
      if (msg) this.tip.textContent = msg;
    });
  }

  // "K was P2 Dash: P2 Dash has no key now, rebind it" so a stolen binding is never silent.
  lostTip(label, lost) {
    if (!lost.length) return '';
    return lost.map((l) => (l.empty ? `${label} was ${l.name}: ${l.name} has nothing bound now, rebind it.` : `${label} removed from ${l.name}.`)).join(' ');
  }

  // ------------------------------------------------------------ navigation (pause/menu page)
  paintFocus() {
    this.items.forEach((it, i) => it.el.classList.toggle('foc', this.navMode && i === this.focus));
    if (this.navMode) this.items[this.focus]?.el.scrollIntoView?.({ block: 'nearest' });
  }

  nav(action) {
    if (this.capturing) return true;
    const it = this.items[this.focus];
    // the first key/button press only reveals the focus ring (mouse users never see it)
    if (!this.navMode) { this.navMode = true; this.paintFocus(); return true; }
    switch (action) {
      case 'up': this.focus = (this.focus + this.items.length - 1) % this.items.length; audio.play('ui'); break;
      case 'down': this.focus = (this.focus + 1) % this.items.length; audio.play('ui'); break;
      case 'left': it?.left?.(); break;
      case 'right': it?.right?.(); break;
      case 'confirm': it?.confirm?.(); break;
      default: return false;
    }
    this.paintFocus();
    return true;
  }

  // ------------------------------------------------------------ live highlights
  tick() {
    if (!this.rows || this.capturing) return;
    const inp = this.input;
    if (this.layout === 'touch') {
      const t = inp.touch;
      for (const [id] of TOUCH_ROWS) {
        const on = !t ? false : id === 'move' ? !!(t.mx || t.my) : id === 'ult' ? t.held.has('heavy') && t.held.has('special') : id === 'vanish' ? t.held.has('guard') && t.held.has('special') : t.held.has(id);
        this.rows[id]?.classList.toggle('live', on);
      }
      return;
    }
    if (this.layout === 'keyboard') {
      const map = KEYMAPS[this.profile];
      for (const a of [...DIRECTIONS, ...ACTIONS]) this.rows[a]?.classList.toggle('live', (map[a] || []).some((c) => inp.keys.has(c)));
      return;
    }
    const g = inp.primaryPad();
    const pressed = new Set();
    if (g) g.buttons.forEach((b, i) => b.pressed && pressed.add(i));
    for (const a of ACTIONS) this.rows[a]?.classList.toggle('live', (PAD_BUTTONS[a] || []).some((i) => pressed.has(i)));
    this.root.querySelectorAll('[data-b]').forEach((n) => n.classList.toggle('live', pressed.has(+n.dataset.b)));
    if (this.stickNub) {
      const ax = g?.axes[0] || 0, ay = g?.axes[1] || 0;
      this.stickNub.setAttribute('cx', 172 + ax * 12);
      this.stickNub.setAttribute('cy', 160 + ay * 12);
    }
  }
}

// Fighting-game style input history (left edge of the screen in training).
export class InputHistory {
  constructor(parent) {
    this.root = el('div', 'input-hist');
    parent.append(this.root);
    this.entries = [];
    this.last = '';
    this.frame = 0;
  }

  destroy() {
    this.root.remove();
  }

  // pad: the player's virtual Pad (screen-relative stick); layout picks button glyphs
  tick(pad, layout) {
    const x = pad.mx > 0.4 ? 1 : pad.mx < -0.4 ? -1 : 0, y = pad.my > 0.4 ? 1 : pad.my < -0.4 ? -1 : 0;
    const dir = { '-1,1': '↖', '0,1': '↑', '1,1': '↗', '-1,0': '←', '0,0': '', '1,0': '→', '-1,-1': '↙', '0,-1': '↓', '1,-1': '↘' }[`${x},${y}`];
    const names = PAD_NAMES[layout];
    const face = FACE[layout];
    const btns = ACTIONS.filter((a) => pad.b[a].down).map((a) => {
      if (!names) return { t: SHORT[a][0], c: '' };
      const i = PAD_BUTTONS[a]?.[0];
      return { t: names[i] ?? SHORT[a][0], c: face?.[i] || '' };
    });
    const sig = dir + '|' + btns.map((b) => b.t).join(',');
    if (sig === this.last) {
      if (this.entries[0]) this.entries[0].n++;
    } else {
      this.last = sig;
      // neutral gets its own row (frames spent idle), like fighting-game input displays
      if (dir || btns.length || this.entries.length) this.entries.unshift({ dir, btns, n: 1, idle: !dir && !btns.length });
      this.entries.length = Math.min(this.entries.length, 16);
    }
    if (this.frame++ % 3) return;
    this.root.innerHTML = this.entries.map((e) => `<div class="ih-row${e.idle ? ' idle' : ''}"><span class="ih-n">${Math.min(99, e.n)}</span><span class="ih-dir">${e.idle ? '·' : e.dir}</span>${e.btns.map((b) => `<span class="ih-btn" style="${b.c ? `color:${b.c}` : ''}">${b.t}</span>`).join('')}</div>`).join('');
  }
}

// Bottom-of-screen hint for matches, built from the live bindings + active device.
export function matchHint(mode, layout) {
  if (mode === 'cpu' || mode === 'watch') {
    // spectating: nobody is playing, so only the way out matters ('watch': an online match, Esc opens the room)
    const pause = layout === 'touch' ? '<kbd>❙❙</kbd>' : layout !== 'keyboard' && PAD_NAMES[layout] ? `<kbd>${PAD_NAMES[layout][9]}</kbd>` : '<kbd>Esc</kbd>';
    return mode === 'watch' ? `Watching · ${pause} room` : `CPU vs CPU · ${pause} pause`;
  }
  if (layout === 'touch') return ''; // the on-screen buttons are labelled
  const k = (map, a) => `<kbd>${keyLabel(map[a]?.[0])}</kbd>`;
  if (layout !== 'keyboard' && PAD_NAMES[layout]) {
    const n = PAD_NAMES[layout], face = FACE[layout];
    const b = (a) => {
      const i = PAD_BUTTONS[a]?.[0];
      return `<kbd style="${i <= 3 ? `color:${face[i]}` : ''}">${n[i] ?? '—'}</kbd>`;
    };
    return `Stick move · ${b('light')} light · ${b('heavy')} launcher · ${b('special')} special · ${b('heavy')}+${b('special')} ultimate · ${b('super')} super · ${b('guard')}+${b('special')} vanish · ${b('jump')} jump · ${b('dash')} super dash · hit: hold ${b('guard')} tech, ${b('guard')}+${b('special')} burst · <kbd>${n[9]}</kbd> pause`;
  }
  if (mode === 'versus') {
    const p = (m) => `${k(m, 'up')}${k(m, 'left')}${k(m, 'down')}${k(m, 'right')} ${k(m, 'light')}${k(m, 'heavy')}${k(m, 'special')} ${k(m, 'jump')} ${k(m, 'guard')} ${k(m, 'dash')}`;
    return `P1 ${p(KEYMAPS.p1)} · P2 ${p(KEYMAPS.p2)} · Heavy+Special ultimate · Guard+Special vanish · <kbd>Esc</kbd> pause`;
  }
  const m = KEYMAPS.solo;
  return `${k(m, 'up')}${k(m, 'left')}${k(m, 'down')}${k(m, 'right')} move · ${k(m, 'light')} light · ${k(m, 'heavy')} launcher · ${k(m, 'special')} special (hold: charge) · ${k(m, 'heavy')}+${k(m, 'special')} ultimate · ${k(m, 'super')} super · ${k(m, 'guard')}+${k(m, 'special')} vanish · ${k(m, 'jump')} jump · ${k(m, 'dash')} super dash · hit: hold ${k(m, 'guard')} tech, ${k(m, 'guard')}+${k(m, 'special')} burst · <kbd>Esc</kbd> pause`;
}

// Clash prompt (a rhythm clash, ADR 0017: any attack button on the beat), from the live bindings (training and
// VS CPU use the solo map).
export function clashHint(mode, layout) {
  if (mode === 'cpu') return 'ULTIMATE CLASH!'; // both sides play on their own
  if (layout === 'touch' && mode !== 'versus') return 'TAP <kbd>LIGHT</kbd><kbd>HEAVY</kbd><kbd>SPECIAL</kbd> ON THE BEAT!';
  const keys = (m) => ['light', 'heavy', 'special'].map((a) => `<kbd>${keyLabel(m[a]?.[0])}</kbd>`).join('');
  if (mode === 'versus') return `ON THE BEAT! P1 ${keys(KEYMAPS.p1)} · P2 ${keys(KEYMAPS.p2)}`;
  if (layout !== 'keyboard' && PAD_NAMES[layout]) {
    const n = PAD_NAMES[layout], face = FACE[layout];
    const b = (a) => {
      const i = PAD_BUTTONS[a]?.[0];
      return `<kbd style="${i <= 3 ? `color:${face[i]}` : ''}">${n[i] ?? '—'}</kbd>`;
    };
    return `${b('light')}${b('heavy')}${b('special')} ON THE BEAT!`;
  }
  return `${keys(KEYMAPS.solo)} ON THE BEAT!`;
}
