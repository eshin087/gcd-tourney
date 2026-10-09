// On-screen touch controls for phones and tablets (landscape): a floating joystick on the left
// half of the screen and an action-button cluster on the right. InputManager.poll() merges the
// state into player 1's Pad, exactly like a keyboard or gamepad, so fighters never know the
// difference. Multi-touch via Pointer Events (one pointer per finger).
const STORE_KEY = 'gcd.touch.v1';
const qs = new URLSearchParams(location.search);

// ?touch=1 forces the touch UI on any device (desktop testing); ?touch=0 hides it.
// Phones/tablets only (primary pointer is a finger): touchscreen laptops keep the keyboard UI and
// switch to touch controls the moment the screen is touched (InputManager device 'touch').
export const IS_TOUCH_DEVICE = qs.get('touch') === '1' || (qs.get('touch') !== '0' && matchMedia('(pointer: coarse)').matches);

// id, label, actions pressed while held, extra class. ULT / VANISH press both buttons of the chord:
// two-finger chords are hard on glass.
const BUTTONS = [
  ['light', 'LIGHT', ['light'], 'big'],
  ['heavy', 'HEAVY', ['heavy'], ''],
  ['special', 'SPECIAL', ['special'], ''],
  ['jump', 'JUMP', ['jump'], ''],
  ['guard', 'GUARD', ['guard'], 'small'],
  ['dash', 'DASH', ['dash'], 'small'],
  ['ult', 'ULT', ['heavy', 'special'], 'macro'],
  ['vanish', 'VANISH', ['guard', 'special'], 'macro'],
  ['super', 'SUPER', ['super'], 'macro'],
];

// keep receiving a finger's moves after it leaves the element; never let a capture failure drop the press
const capture = (el, e) => {
  try {
    el.setPointerCapture(e.pointerId);
  } catch {}
};

const DEAD = 0.18; // joystick deadzone (fraction of the radius)

function loadPrefs() {
  try {
    return { size: 'm', ...JSON.parse(localStorage.getItem(STORE_KEY) || '{}') };
  } catch {
    return { size: 'm' };
  }
}

export class TouchControls {
  constructor({ onPause } = {}) {
    this.mx = 0;
    this.my = 0;
    this.held = new Set(); // actions currently held by on-screen buttons
    this.visible = false;
    this.prefs = loadPrefs();
    this.stick = null; // { id, x0, y0 }
    this.btnPointers = new Map(); // pointerId -> button id
    this.root = document.createElement('div');
    this.root.id = 'touch';
    this.root.className = `size-${this.prefs.size}`;
    this.root.innerHTML = `
      <div class="t-zone"></div>
      <div class="t-stick"><div class="t-knob"></div></div>
      <div class="t-buttons">${BUTTONS.map(([id, label, , cls]) => `<div class="t-btn t-${id} ${cls}" data-b="${id}"><span>${label}</span></div>`).join('')}</div>
      <div class="t-pause" role="button" aria-label="Pause"><i></i><i></i></div>`;
    document.body.append(this.root);
    this.zone = this.root.querySelector('.t-zone');
    this.stickEl = this.root.querySelector('.t-stick');
    this.knob = this.root.querySelector('.t-knob');
    this.btns = Object.fromEntries([...this.root.querySelectorAll('.t-btn')].map((el) => [el.dataset.b, el]));
    const stop = (e) => e.preventDefault();
    this.root.addEventListener('contextmenu', stop);
    this.root.addEventListener('touchstart', stop, { passive: false }); // no scroll, zoom or magnifier

    // joystick: appears where the thumb lands on the left half
    this.zone.addEventListener('pointerdown', (e) => {
      if (this.stick) return;
      capture(this.zone, e);
      this.stick = { id: e.pointerId, x0: e.clientX, y0: e.clientY };
      this.stickEl.style.left = `${e.clientX}px`;
      this.stickEl.style.top = `${e.clientY}px`;
      this.stickEl.classList.add('on');
      this.moveStick(e);
    });
    this.zone.addEventListener('pointermove', (e) => { if (this.stick?.id === e.pointerId) this.moveStick(e); });
    const endStick = (e) => {
      if (this.stick?.id !== e.pointerId) return;
      this.stick = null;
      this.mx = this.my = 0;
      this.stickEl.classList.remove('on');
      this.knob.style.transform = '';
    };
    this.zone.addEventListener('pointerup', endStick);
    this.zone.addEventListener('pointercancel', endStick);

    // buttons: a finger can slide from one button to another (common for mashing)
    const btnArea = this.root.querySelector('.t-buttons');
    const pick = (e) => document.elementFromPoint(e.clientX, e.clientY)?.closest?.('.t-btn')?.dataset.b ?? null;
    btnArea.addEventListener('pointerdown', (e) => {
      capture(btnArea, e);
      this.btnPointers.set(e.pointerId, pick(e));
      this.syncButtons();
    });
    btnArea.addEventListener('pointermove', (e) => {
      if (!this.btnPointers.has(e.pointerId)) return;
      const b = pick(e);
      if (b !== this.btnPointers.get(e.pointerId)) {
        this.btnPointers.set(e.pointerId, b);
        this.syncButtons();
      }
    });
    const endBtn = (e) => {
      if (this.btnPointers.delete(e.pointerId)) this.syncButtons();
    };
    btnArea.addEventListener('pointerup', endBtn);
    btnArea.addEventListener('pointercancel', endBtn);

    this.root.querySelector('.t-pause').addEventListener('pointerdown', (e) => {
      e.preventDefault();
      onPause?.();
    });
  }

  moveStick(e) {
    const R = this.stickEl.offsetWidth * 0.42 || 48;
    let dx = e.clientX - this.stick.x0, dy = e.clientY - this.stick.y0;
    const len = Math.hypot(dx, dy);
    if (len > R) { dx *= R / len; dy *= R / len; }
    this.knob.style.transform = `translate(${dx}px, ${dy}px)`;
    const k = Math.min(1, len / R);
    const mag = k < DEAD ? 0 : (k - DEAD) / (1 - DEAD);
    this.mx = len > 0 ? (dx / Math.max(len, 1e-6)) * mag : 0;
    this.my = len > 0 ? (-dy / Math.max(len, 1e-6)) * mag : 0;
  }

  syncButtons() {
    const down = new Set([...this.btnPointers.values()].filter(Boolean));
    this.held.clear();
    for (const [id, , acts] of BUTTONS) {
      const on = down.has(id);
      this.btns[id].classList.toggle('down', on);
      if (on) for (const a of acts) this.held.add(a);
    }
    if (down.size && navigator.vibrate) navigator.vibrate(8);
  }

  // Release everything (pause, menus, losing visibility) so nothing stays stuck down.
  reset() {
    this.btnPointers.clear();
    this.stick = null;
    this.mx = this.my = 0;
    this.held.clear();
    this.stickEl.classList.remove('on');
    this.knob.style.transform = '';
    for (const el of Object.values(this.btns)) el.classList.remove('down');
  }

  setVisible(v) {
    if (v === this.visible) return;
    this.visible = v;
    this.root.classList.toggle('show', v);
    if (!v) this.reset();
  }

  // dim ULT / VANISH when there isn't enough ki (per rendered frame)
  setKi(ki) {
    this.btns.ult.classList.toggle('off', ki < 300);
    this.btns.vanish.classList.toggle('off', ki < 100);
    this.btns.super.classList.toggle('off', ki < 300);
  }

  setSize(size) {
    this.prefs.size = size;
    this.root.className = `size-${size}${this.visible ? ' show' : ''}`;
    try { localStorage.setItem(STORE_KEY, JSON.stringify(this.prefs)); } catch {}
  }

  // merged into player 1's Pad by InputManager.poll()
  isHeld(action) {
    return this.held.has(action);
  }
}
