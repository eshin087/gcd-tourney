// The live announcer's lines (ENG-118, ADR 0048): one small caption at a time floating above his head, in a DOM layer
// under the HUD so the lettering stays crisp on a phone while the game draws into its small pixel buffer. A
// background touch, not a focal point (user, 2026-10-18): no balloon, small outlined text that fades in and out, and
// nothing at all while he is off screen. It sits locked above his head and every line looks the same (user,
// 2026-10-18: consistent, not bouncy). src/world/announcer.js decides what he says and where he is; this file only
// draws it.
const mk = (tag, cls) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  return e;
};
const MIN_READ = 1.2; // seconds a line stays up before another may replace it

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
  }

  // true while a line is still being read: any line, whatever its rank, waits until the current one has been up
  // MIN_READ s (lines flipping every few frames read as flicker); a line that outranks it may then cut it short
  busy(prio) {
    const c = this.cur;
    return !!c && (c.t < MIN_READ || c.prio > prio);
  }

  // html: the line (names wrapped in <b>); every line looks the same (the style is kept for the data, not shown)
  say(html, style, secs, prio) {
    this.cur = { prio, t: 0, secs, style };
    this.text.innerHTML = html;
    this.w = this.text.offsetWidth || html.length * 5;
    this.h = this.text.offsetHeight || 12;
  }

  hide() {
    this.cur = null;
    this.box.classList.remove('on');
  }

  // anchor: the top of his head on screen { x, y } in CSS px, already on the game's pixel grid, or null when he
  // can't be placed; view: { w, h, top, bottom, grid } the area the caption may use and the size of one game pixel.
  // Advances the line's clock unless frozen.
  update(dt, anchor, view, visible, frozen = false) {
    const c = this.cur;
    // only while he is on screen (a little slack, so a step across the edge doesn't blink it)
    const pad = 24;
    const inside = !!anchor && anchor.x > -pad && anchor.x < view.w + pad && anchor.y > -pad && anchor.y < view.h + pad;
    this.visible = visible && inside;
    if (!c) return;
    if (!frozen) c.t += dt;
    if (c.t >= c.secs) { this.hide(); return; }
    this.box.classList.toggle('on', this.visible);
    if (!this.visible) return;
    // locked straight above his head and moving with him in the game's own pixel steps: no lag, no easing, no
    // switching sides (user, 2026-10-18: steady, not bouncy); only kept on screen at the edges
    const { w, h } = this;
    const m = Math.max(6, view.w * 0.01), gap = 2;
    let tx = anchor.x, ty = anchor.y - gap - h / 2;
    tx = Math.min(view.w - m - w / 2, Math.max(m + w / 2, tx));
    ty = Math.min(view.bottom - h / 2, Math.max(view.top + h / 2, ty));
    const g = view.grid || 1, gx = view.gx || 0, gy = view.gy || 0;
    const x0 = gx + Math.round((tx - w / 2 - gx) / g) * g, y0 = gy + Math.round((ty - h / 2 - gy) / g) * g;
    this.box.style.transform = `translate3d(${x0}px, ${y0}px, 0)`;
  }

  dispose() {
    this.layer.remove();
  }
}
