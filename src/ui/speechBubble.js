// The live announcer's lines (ENG-118, ADR 0048): one small caption at a time floating above his head, in a DOM layer
// under the HUD so the lettering stays crisp on a phone while the game draws into its small pixel buffer. A
// background touch, not a focal point (user, 2026-10-18): no balloon, small outlined text that fades in and out, and
// nothing at all while he is off screen. src/world/announcer.js decides what he says and where he is; this file only
// draws it. The line's style ('talk' | 'shout' | 'panic') only tints and tilts the lettering a little.
const mk = (tag, cls) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  return e;
};
const f1 = (v) => Math.round(v * 10) / 10;

export class SpeechBubble {
  constructor(ui) {
    this.layer = mk('div', 'caster-layer');
    this.layer.setAttribute('aria-hidden', 'true');
    ui.prepend(this.layer); // first child of #ui: under the HUD, its cut-ins and the big announcements
    this.box = mk('div', 'caster-line');
    this.text = mk('div', 'cl-text');
    this.box.append(this.text);
    this.layer.append(this.box);
    this.cur = null; // { prio, t, secs, style }
    this.w = 0; // the caption's size (px)
    this.h = 0;
    this.cx = 0; // where its center is drawn (smoothed)
    this.cy = 0;
    this.snap = true;
  }

  // true while a line that outranks prio is still up (the same rank waits until the line has been read a moment)
  busy(prio) {
    const c = this.cur;
    return !!c && (c.prio > prio || (c.prio === prio && c.t < 0.9));
  }

  // html: the line (names wrapped in <b>), style: 'talk' | 'shout' | 'panic'
  say(html, style, secs, prio) {
    this.cur = { prio, t: 0, secs, style };
    this.box.className = `caster-line ${style}`;
    this.text.innerHTML = html;
    this.w = this.text.offsetWidth || html.length * 5;
    this.h = this.text.offsetHeight || 12;
    if (!this.visible) this.snap = true;
  }

  hide() {
    this.cur = null;
    this.box.classList.remove('on');
  }

  // anchor: the top of his head on screen { x, y } in CSS px, or null when he can't be placed; view: { w, h, top,
  // bottom } the area the caption may use. Advances the line's clock unless frozen.
  update(dt, anchor, view, visible, frozen = false) {
    const c = this.cur;
    // only while he is on screen: a line from off screen would pull the eye to an empty spot
    const inside = !!anchor && anchor.x > 0 && anchor.x < view.w && anchor.y > 0 && anchor.y < view.h;
    this.visible = visible && inside;
    if (!c) return;
    if (!frozen) c.t += dt;
    if (c.t >= c.secs) { this.hide(); return; }
    this.box.classList.toggle('on', this.visible);
    if (!this.visible) { this.snap = true; return; }
    const { w, h } = this;
    const m = Math.max(6, view.w * 0.01), gap = 3;
    // centered just above his head; with no room under the HUD bars, beside his head toward the middle of the screen
    let tx = anchor.x, ty = anchor.y - gap - h / 2;
    if (ty - h / 2 < view.top) {
      tx = anchor.x + (anchor.x < view.w / 2 ? 1 : -1) * (w / 2 + 14);
      ty = anchor.y + h / 2;
    }
    tx = Math.min(view.w - m - w / 2, Math.max(m + w / 2, tx));
    ty = Math.min(view.bottom - h / 2, Math.max(view.top + h / 2, ty));
    if (this.snap) { this.cx = tx; this.cy = ty; this.snap = false; }
    const k = 1 - Math.exp(-dt * 12);
    this.cx += (tx - this.cx) * k;
    this.cy += (ty - this.cy) * k;
    this.box.style.transform = `translate3d(${f1(this.cx - w / 2)}px, ${f1(this.cy - h / 2)}px, 0)`;
  }

  dispose() {
    this.layer.remove();
  }
}
