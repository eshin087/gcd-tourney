// Keyboard + gamepad input, normalized into per-player virtual pads.
// The CPU drives the exact same Pad interface, so fighters never know who's playing.
// Bindings are rebindable and saved to localStorage.
import * as dmath from '../game/dmath.js';

export const ACTIONS = ['light', 'heavy', 'special', 'jump', 'guard', 'dash', 'super'];
export const DIRECTIONS = ['up', 'down', 'left', 'right'];

export const ACTION_LABELS = {
  up: 'Up', down: 'Down', left: 'Left', right: 'Right',
  light: 'Light', heavy: 'Heavy / Launcher', special: 'Special (+direction)', jump: 'Jump', guard: 'Guard', dash: 'Dash / Super dash',
  super: 'Super (2nd super)',
};

export const DEFAULT_KEYMAPS = {
  // VS CPU / training: one player, generous bindings
  solo: {
    up: ['KeyW', 'ArrowUp'], down: ['KeyS', 'ArrowDown'], left: ['KeyA', 'ArrowLeft'], right: ['KeyD', 'ArrowRight'],
    light: ['KeyJ', 'KeyZ'], heavy: ['KeyK', 'KeyX'], special: ['KeyL', 'KeyC'], jump: ['Space', 'KeyI'],
    guard: ['ShiftLeft', 'ShiftRight', 'KeyU'], dash: ['KeyO', 'KeyV'], super: ['KeyH', 'KeyB'],
  },
  // Local versus: two players share the keyboard
  p1: {
    up: ['KeyW'], down: ['KeyS'], left: ['KeyA'], right: ['KeyD'],
    light: ['KeyF'], heavy: ['KeyG'], special: ['KeyH'], jump: ['Space'], guard: ['ShiftLeft'], dash: ['KeyR'], super: ['KeyT'],
  },
  p2: {
    up: ['ArrowUp'], down: ['ArrowDown'], left: ['ArrowLeft'], right: ['ArrowRight'],
    light: ['Comma', 'Numpad1'], heavy: ['Period', 'Numpad2'], special: ['Slash', 'Numpad3'],
    jump: ['KeyL', 'Numpad0'], guard: ['Semicolon', 'NumpadDecimal', 'ShiftRight'], dash: ['KeyK', 'NumpadEnter'], super: ['Quote', 'NumpadAdd'],
  },
};

// Standard gamepad mapping indices. 0 ✕/A, 1 ○/B, 2 □/X, 3 △/Y, 4 L1/LB, 5 R1/RB, 6 L2/LT, 7 R2/RT
export const DEFAULT_PAD = { jump: [0], light: [2], heavy: [3], special: [1], guard: [4], dash: [5, 7], super: [6] };

export const PAD_NAMES = {
  playstation: ['✕', '○', '□', '△', 'L1', 'R1', 'L2', 'R2', 'Create', 'Options', 'L3', 'R3', 'D-Up', 'D-Down', 'D-Left', 'D-Right', 'PS'],
  xbox: ['A', 'B', 'X', 'Y', 'LB', 'RB', 'LT', 'RT', 'View', 'Menu', 'LS', 'RS', 'D-Up', 'D-Down', 'D-Left', 'D-Right', 'Xbox'],
};

// Never rebindable: system keys (pause, mute, panel) and the gamepad's Create/View + Options/Menu buttons.
export const RESERVED_KEYS = ['Escape', 'Enter', 'Tab', 'Backspace', 'KeyP', 'KeyM'];
export const RESERVED_PAD = [8, 9];

const STORE_KEY = 'gcd.bindings.v2'; // v2: the SUPER action took L2 / LT from guard (ADR 0009)
const clone = (o) => JSON.parse(JSON.stringify(o));

function loadStored() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
  } catch {
    return null;
  }
}

// Live binding tables (mutated in place so active pads pick up rebinds instantly)
export const KEYMAPS = clone(DEFAULT_KEYMAPS);
export const PAD_BUTTONS = clone(DEFAULT_PAD);
{
  const s = loadStored();
  if (s?.keys) for (const p of Object.keys(KEYMAPS)) Object.assign(KEYMAPS[p], s.keys[p] || {});
  if (s?.pad) Object.assign(PAD_BUTTONS, s.pad);
}

function saveBindings() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify({ keys: KEYMAPS, pad: PAD_BUTTONS }));
  } catch {}
}

export function padKind(g) {
  const id = (g?.id || '').toLowerCase();
  if (/054c|dualsense|dualshock|playstation|wireless controller/.test(id)) return 'playstation';
  if (/045e|xbox|xinput/.test(id)) return 'xbox';
  return 'xbox';
}

export function keyLabel(code) {
  if (!code) return '—';
  return code
    .replace(/^Key/, '').replace(/^Digit/, '').replace(/^Numpad/, 'Num ')
    .replace('ShiftLeft', 'L-Shift').replace('ShiftRight', 'R-Shift').replace('ControlLeft', 'L-Ctrl').replace('ControlRight', 'R-Ctrl')
    .replace('AltLeft', 'L-Alt').replace('AltRight', 'R-Alt')
    .replace('ArrowUp', '↑').replace('ArrowDown', '↓').replace('ArrowLeft', '←').replace('ArrowRight', '→')
    .replace('Comma', ',').replace('Period', '.').replace('Slash', '/').replace('Semicolon', ';').replace('Quote', "'")
    .replace('BracketLeft', '[').replace('BracketRight', ']').replace('Backquote', '`').replace('Minus', '-').replace('Equal', '=');
}

function makeBtn() {
  return { down: false, pressed: false, released: false, held: 0, lastPress: -9999 };
}

export class Pad {
  constructor() {
    this.mx = 0; // screen-right
    this.my = 0; // screen-up (away from camera)
    this.b = Object.fromEntries(ACTIONS.map((a) => [a, makeBtn()]));
    this.dirTaps = { l: -99, r: -99, u: -99, d: -99 };
    this.dirPress = { l: -99, r: -99, u: -99, d: -99 }; // frame each stick direction was last pushed (spot dodge)
    this.prevDir = { l: false, r: false, u: false, d: false };
    this.dashDir = null; // set on the frame a double-tap happens
    this.frame = 0;
  }

  set(name, isDown) {
    const b = this.b[name];
    b.pressed = isDown && !b.down;
    b.released = !isDown && b.down;
    if (b.pressed) b.lastPress = this.frame;
    b.down = isDown;
    b.held = isDown ? b.held + 1 : 0;
  }

  setMove(x, y) {
    // -0 becomes 0: an input that crosses the wire or a saved log arrives as +0, and the two can steer later math
    // differently (ADR 0036)
    x = x || 0;
    y = y || 0;
    const len = dmath.hypot(x, y);
    if (len > 1) { x /= len; y /= len; }
    this.mx = x;
    this.my = y;
    // double-tap detection for dashing
    this.dashDir = null;
    const dirs = { l: x < -0.5, r: x > 0.5, u: y > 0.5, d: y < -0.5 };
    for (const k of Object.keys(dirs)) {
      if (dirs[k] && !this.prevDir[k]) {
        this.dirPress[k] = this.frame;
        if (this.frame - this.dirTaps[k] < 14) {
          this.dashDir = { l: [-1, 0], r: [1, 0], u: [0, 1], d: [0, -1] }[k];
          this.dirTaps[k] = -99;
        } else this.dirTaps[k] = this.frame;
      }
      this.prevDir[k] = dirs[k];
    }
  }

  // Was the button pressed within the last `win` frames (and not yet consumed)?
  buffered(name, win = 8) {
    return this.frame - this.b[name].lastPress <= win;
  }

  consume(name) {
    this.b[name].lastPress = -9999;
  }

  // Was the stick pushed toward 'l' | 'r' | 'u' | 'd' within the last `win` frames (an edge, not a hold)?
  dirPressed(k, win = 3) {
    return this.frame - this.dirPress[k] <= win;
  }

  tick() {
    this.frame++;
  }

  clear() {
    for (const a of ACTIONS) Object.assign(this.b[a], makeBtn());
    for (const k of Object.keys(this.dirPress)) this.dirPress[k] = -99;
    this.mx = this.my = 0;
  }
}

export class InputManager {
  constructor() {
    this.keys = new Set();
    this.tapped = new Set(); // keys pressed since last poll (catches very short taps)
    this.menuQueue = [];
    this.padPrev = [{}, {}, {}, {}];
    this.bindings = []; // [{ pad, keymap, gp }]
    this.active = new Set();
    this.lastDevice = 'keyboard'; // keyboard | playstation | xbox
    this.lastPad = -1; // gamepad index pressed most recently: it drives a lone (solo / training) player
    this.touch = null; // TouchControls (src/core/touch.js), merged into player 1 when visible
    this.capture = null; // rebinding: callback waiting for the next key / button
    this.capturePrev = {}; // per gamepad index: buttons already held when the capture started
    // Keys / buttons held across a menu -> gameplay boundary (or a pad rebind) are ignored
    // until released, so the confirm press can't also jump or attack on a cleared Pad.
    this.suppressKeys = new Set();
    this.suppressPad = new Map(); // gamepad index -> Set of button indices
    this.listeners = new Set();
    window.addEventListener('gamepaddisconnected', (e) => {
      this.active.delete(e.gamepad.index);
      this.suppressPad.delete(e.gamepad.index);
    });
    window.addEventListener('keydown', (e) => {
      // Enter too: a focused <button> would otherwise be clicked on top of the queued 'confirm'
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Slash', 'Quote', 'Tab', 'Enter', 'NumpadEnter'].includes(e.code)) e.preventDefault();
      if (this.capture) {
        e.preventDefault();
        e.stopImmediatePropagation(); // e.g. don't let M toggle mute while binding it
        if (e.repeat) return; // only a fresh press completes a rebind (not the held confirm key)
        const cb = this.capture;
        this.capture = null;
        cb({ type: 'key', code: e.code });
        return;
      }
      this.setDevice('keyboard');
      if (!e.repeat) this.tapped.add(e.code);
      this.keys.add(e.code);
      const m = this.keyToMenu(e.code);
      if (m) this.menuQueue.push({ action: m, source: 'kb', code: e.code, repeat: e.repeat });
    });
    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.code);
      this.suppressKeys.delete(e.code);
    });
    window.addEventListener('blur', () => {
      this.keys.clear();
      this.suppressKeys.clear();
    });
  }

  setDevice(d) {
    if (this.lastDevice === d) return;
    this.lastDevice = d;
    for (const f of this.listeners) f(d);
  }

  onDevice(f) {
    this.listeners.add(f);
    return () => this.listeners.delete(f);
  }

  keyToMenu(code) {
    switch (code) {
      case 'ArrowUp': case 'KeyW': return 'up';
      case 'ArrowDown': case 'KeyS': return 'down';
      case 'ArrowLeft': case 'KeyA': return 'left';
      case 'ArrowRight': case 'KeyD': return 'right';
      case 'Enter': case 'Space': case 'KeyJ': case 'KeyF': case 'NumpadEnter': return 'confirm';
      case 'Escape': case 'Backspace': return 'back';
      case 'KeyP': return 'pause';
      case 'Tab': return 'panel';
      default: return null;
    }
  }

  // mode: 'solo' (P1 human, P2 cpu), 'versus' (two humans) or 'cpu' (spectating: nobody drives a pad,
  // menu events such as pause still work)
  bind(pads, mode) {
    this.bindings = mode === 'versus'
      ? [{ pad: pads[0], keymap: KEYMAPS.p1, gp: 0 }, { pad: pads[1], keymap: KEYMAPS.p2, gp: 1 }]
      : mode === 'cpu' ? []
      : [{ pad: pads[0], keymap: KEYMAPS.solo, gp: 0 }];
  }

  // Call at every menu -> gameplay boundary (resume, training start / reset).
  flush() {
    this.tapped.clear();
    this.suppressKeys = new Set(this.keys);
    this.suppressPad.clear();
    for (const g of this.activeGamepads()) this.suppressHeld(g);
  }

  suppressHeld(g) {
    const held = new Set();
    g.buttons.forEach((b, i) => b.pressed && held.add(i));
    if (held.size) this.suppressPad.set(g.index, held);
  }

  // --- rebinding --------------------------------------------------------
  // Wait for the next key or gamepad button.
  // cb({type:'key', code} | {type:'pad', index} | {type:'cancel'})  (Options / Menu cancels on a pad)
  captureNext(cb) {
    this.capture = cb;
    this.capturePrev = {};
  }

  cancelCapture() {
    this.capture = null;
  }

  // Make `code` the primary key for `action`, and take it away from every other action
  // that is live at the same time (the same profile; in versus both P1 and P2).
  // Returns the [{ profile, action }] that lost the key.
  setKey(profile, action, code) {
    const lost = [];
    for (const p of profile === 'solo' ? ['solo'] : ['p1', 'p2']) {
      const map = KEYMAPS[p];
      for (const a of Object.keys(map)) {
        if ((p !== profile || a !== action) && map[a].includes(code)) lost.push({ profile: p, action: a });
        map[a] = map[a].filter((c) => c !== code);
      }
    }
    const map = KEYMAPS[profile];
    map[action] = [code, ...(map[action] || []).filter((c) => c !== code).slice(1)];
    saveBindings();
    return lost;
  }

  // Returns the actions that lost the button.
  setPadButton(action, index) {
    const lost = Object.keys(PAD_BUTTONS).filter((a) => a !== action && PAD_BUTTONS[a].includes(index));
    for (const a of Object.keys(PAD_BUTTONS)) PAD_BUTTONS[a] = PAD_BUTTONS[a].filter((i) => i !== index);
    PAD_BUTTONS[action] = [index, ...(PAD_BUTTONS[action] || []).filter((i) => i !== index).slice(0, 1)];
    saveBindings();
    return lost;
  }

  resetBindings() {
    for (const p of Object.keys(KEYMAPS)) {
      for (const a of Object.keys(KEYMAPS[p])) delete KEYMAPS[p][a];
      Object.assign(KEYMAPS[p], clone(DEFAULT_KEYMAPS[p]));
    }
    for (const a of Object.keys(PAD_BUTTONS)) delete PAD_BUTTONS[a];
    Object.assign(PAD_BUTTONS, clone(DEFAULT_PAD));
    saveBindings();
  }

  gamepads() {
    try {
      return [...(navigator.getGamepads?.() || [])].filter(Boolean);
    } catch {
      return [];
    }
  }

  // A connected pad only counts once one of its buttons is pressed, so an idle
  // controller with a drifting or resting stick can't steer anyone.
  activeGamepads() {
    const all = this.gamepads();
    for (const g of all) {
      if (!this.active.has(g.index) && g.buttons.some((b) => b.pressed)) this.active.add(g.index);
    }
    return all.filter((g) => this.active.has(g.index));
  }

  // The pad a lone player is holding: whichever was pressed last (not raw index 0).
  primaryPad(gps = this.activeGamepads()) {
    return gps.find((p) => p.index === this.lastPad) || gps[0] || null;
  }

  poll() {
    const capturing = !!this.capture;
    const gps = capturing ? [] : this.activeGamepads();
    for (const [gi, held] of this.suppressPad) {
      const g = gps.find((p) => p.index === gi);
      if (!g) continue;
      for (const i of held) if (!g.buttons[i]?.pressed) held.delete(i);
      if (!held.size) this.suppressPad.delete(gi);
    }
    const live = (c) => !capturing && !this.suppressKeys.has(c) && (this.keys.has(c) || this.tapped.has(c));
    const touch = !capturing && this.touch?.visible ? this.touch : null;
    this.bindings.forEach(({ pad, keymap, gp }, bi) => {
      const t = bi === 0 ? touch : null; // on-screen controls drive player 1
      const k = (list) => (list || []).some(live);
      let x = (k(keymap.right) ? 1 : 0) - (k(keymap.left) ? 1 : 0);
      let y = (k(keymap.up) ? 1 : 0) - (k(keymap.down) ? 1 : 0);
      const g = this.bindings.length === 1 ? this.primaryPad(gps) : gps.find((p) => p.index === gp) || null;
      const sup = g ? this.suppressPad.get(g.index) : null;
      const gb = (ids) => g && (ids || []).some((i) => g.buttons[i]?.pressed && !sup?.has(i));
      if (g) {
        const ax = g.axes[0] || 0, ay = g.axes[1] || 0;
        const mag = dmath.hypot(ax, ay);
        if (mag > 0.35) { const k = Math.min(1, (mag - 0.35) / 0.55) / mag; x = ax * k; y = -ay * k; }
        if (gb([14])) x = -1;
        if (gb([15])) x = 1;
        if (gb([12])) y = 1;
        if (gb([13])) y = -1;
      }
      if (t && (t.mx || t.my)) { x = t.mx; y = t.my; }
      pad.tick();
      pad.setMove(x, y);
      for (const a of ACTIONS) pad.set(a, k(keymap[a]) || !!gb(PAD_BUTTONS[a]) || !!t?.isHeld(a));
    });
    this.tapped.clear();
  }

  // Gamepad menu navigation (edge-triggered) + rebinding capture; call once per rendered frame.
  pollMenu() {
    for (const g of this.activeGamepads()) {
      if (g.buttons.some((b) => b.pressed)) {
        this.setDevice(padKind(g));
        this.lastPad = g.index;
      }
      const capturing = !!this.capture;
      if (capturing) {
        const cp = this.capturePrev[g.index] || (this.capturePrev[g.index] = g.buttons.map((b) => b.pressed));
        const idx = g.buttons.findIndex((b, i) => b.pressed && !cp[i]);
        this.capturePrev[g.index] = g.buttons.map((b) => b.pressed);
        if (idx === 9) {
          const cb = this.capture;
          this.capture = null;
          cb({ type: 'cancel' });
        } else if (idx >= 0 && idx < 12 && !RESERVED_PAD.includes(idx)) {
          const cb = this.capture;
          this.capture = null;
          this.suppressHeld(g); // the new binding is still held: it must not act the moment capture ends
          cb({ type: 'pad', index: idx });
        }
      }
      // keep the edge detector current during a capture too, so the captured button
      // doesn't fire a stale menu edge (e.g. 'back') on the next frame
      const prev = this.padPrev[g.index] || (this.padPrev[g.index] = {});
      const st = {
        up: g.buttons[12]?.pressed || (g.axes[1] || 0) < -0.6,
        down: g.buttons[13]?.pressed || (g.axes[1] || 0) > 0.6,
        left: g.buttons[14]?.pressed || (g.axes[0] || 0) < -0.6,
        right: g.buttons[15]?.pressed || (g.axes[0] || 0) > 0.6,
        confirm: g.buttons[0]?.pressed,
        back: g.buttons[1]?.pressed,
        pause: g.buttons[9]?.pressed,
        select: g.buttons[8]?.pressed,
      };
      for (const [a, v] of Object.entries(st)) {
        if (v && !prev[a] && !capturing) this.menuQueue.push({ action: a, source: 'gp' + g.index });
        prev[a] = v;
      }
    }
  }

  takeMenuEvents() {
    const q = this.menuQueue;
    this.menuQueue = [];
    return q;
  }
}
