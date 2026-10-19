// The live announcer's manga speech bubbles (ENG-118, ADR 0048): one bubble at a time in a DOM layer under the HUD,
// so the lettering stays crisp on a phone while the game draws into its small pixel buffer. Three shapes: a round
// 'talk' balloon, a spiky 'shout' starburst and a wobbly 'panic' one; an inked tail points at his mic and follows
// him as he walks. When he is off screen the bubble docks at the edge with its tail pointing his way (a voice from
// off-panel). src/world/announcer.js decides what he says and where he is; this file only draws it.
const SVG = 'http://www.w3.org/2000/svg';
const INK = '#160f22';
const mk = (tag, cls) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  return e;
};
const svgEl = (tag, attrs) => {
  const e = document.createElementNS(SVG, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  return e;
};
const f1 = (v) => Math.round(v * 10) / 10;

export class SpeechBubble {
  constructor(ui) {
    this.layer = mk('div', 'caster-layer');
    this.layer.setAttribute('aria-hidden', 'true');
    ui.prepend(this.layer); // first child of #ui: under the HUD, its cut-ins and the big announcements
    this.box = mk('div', 'caster-bubble');
    this.inner = mk('div', 'cb-in');
    this.svg = svgEl('svg', { class: 'cb-svg' });
    // the outline is the same two shapes drawn first with a wide ink stroke, the white fills on top, so the tail
    // and the balloon share one outline with no seam where they meet
    const ink = svgEl('g', { fill: INK, stroke: INK, 'stroke-linejoin': 'round' });
    const paper = svgEl('g', { fill: '#ffffff' });
    this.inkBody = svgEl('path', {});
    this.inkTail = svgEl('path', {});
    this.paperBody = svgEl('path', {});
    this.paperTail = svgEl('path', {});
    ink.append(this.inkTail, this.inkBody);
    paper.append(this.paperTail, this.paperBody);
    this.svg.append(ink, paper);
    this.ink = ink;
    this.text = mk('div', 'cb-text');
    this.inner.append(this.svg, this.text);
    this.box.append(this.inner);
    this.layer.append(this.box);
    this.cur = null; // { prio, t, secs, style }
    this.w = 0; // the balloon's box (px) and its ellipse radii
    this.h = 0;
    this.rx = 0;
    this.ry = 0;
    this.cx = 0; // where the balloon's center is drawn (smoothed)
    this.cy = 0;
    this.snap = true;
    this.shown = false;
  }

  // true while a line that outranks prio is still up (the same rank waits until the line has been read a moment)
  busy(prio) {
    const c = this.cur;
    return !!c && (c.prio > prio || (c.prio === prio && c.t < 0.9));
  }

  // html: the line (names wrapped in <b>), style: 'talk' | 'shout' | 'panic'
  say(html, style, secs, prio) {
    this.cur = { prio, t: 0, secs, style };
    this.box.className = `caster-bubble ${style}`;
    this.text.innerHTML = html;
    const fs = parseFloat(getComputedStyle(this.text).fontSize) || 14;
    const tw = this.text.offsetWidth || html.length * fs * 0.5, th = this.text.offsetHeight || fs * 1.1;
    const pad = fs * 0.45;
    // an ellipse holding the text block's corners: radii about sqrt(2) x the half sizes
    this.rx = tw * 0.68 + pad;
    this.ry = th * 0.7 + pad;
    const spike = style === 'shout' ? 1.36 : style === 'panic' ? 1.1 : 1.02;
    this.w = this.rx * 2 * spike;
    this.h = this.ry * 2 * spike;
    this.inner.style.width = `${f1(this.w)}px`;
    this.inner.style.height = `${f1(this.h)}px`;
    this.svg.setAttribute('width', f1(this.w));
    this.svg.setAttribute('height', f1(this.h));
    this.ink.setAttribute('stroke-width', f1(Math.max(3, fs * 0.32)));
    const d = this.shape(style, this.w / 2, this.h / 2);
    this.inkBody.setAttribute('d', d);
    this.paperBody.setAttribute('d', d);
    this.box.classList.remove('pop');
    void this.box.offsetWidth; // restart the pop-in
    this.box.classList.add('pop', 'on');
    this.shown = true;
    if (!this.visible) this.snap = true;
  }

  hide() {
    this.cur = null;
    this.box.classList.remove('on');
    this.shown = false;
  }

  // the balloon's outline around (cx, cy), in the box's own pixels
  shape(style, cx, cy) {
    const { rx, ry } = this;
    const pts = [];
    if (style === 'shout') {
      const n = 13 + Math.floor(Math.random() * 6);
      for (let i = 0; i < n * 2; i++) {
        const a = ((i + (Math.random() - 0.5) * 0.5) / (n * 2)) * Math.PI * 2;
        const r = i % 2 ? 0.98 : 1.16 + Math.random() * 0.2;
        pts.push([cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r]);
      }
      return `M${pts.map(([x, y]) => `${f1(x)},${f1(y)}`).join('L')}Z`;
    }
    const wob = style === 'panic' ? 0.06 : 0;
    const ph = Math.random() * 6;
    for (let i = 0; i < 40; i++) {
      const a = (i / 40) * Math.PI * 2;
      const r = 1 + wob * Math.sin(a * 7 + ph);
      pts.push([cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r]);
    }
    return `M${pts.map(([x, y]) => `${f1(x)},${f1(y)}`).join('L')}Z`;
  }

  // anchor: his mouth on screen { x, y } in CSS px (off screen allowed), or null when he can't be placed;
  // view: { w, h, top, bottom } the area the balloon may use. Advances the line's clock unless frozen.
  update(dt, anchor, view, visible, frozen = false) {
    const c = this.cur;
    this.visible = visible && !!anchor;
    if (!c) return;
    if (!frozen) c.t += dt;
    if (c.t >= c.secs) { this.hide(); return; }
    this.box.classList.toggle('on', this.visible);
    if (!this.visible) { this.snap = true; return; }
    const { w, h } = this;
    const m = Math.max(8, view.w * 0.015);
    const inside = anchor.x > 0 && anchor.x < view.w && anchor.y > 0 && anchor.y < view.h;
    // above him and leaning toward the middle of the screen; with no room under the HUD bars for that (a small
    // screen, him far up the ring) beside him at head height instead, so it never covers him. Then kept inside the
    // free area.
    const side = anchor.x < view.w / 2 ? 1 : -1;
    const gap = Math.max(h * 0.22, 14);
    let tx, ty;
    if (anchor.y - gap - h >= view.top || !inside) {
      tx = anchor.x + side * w * 0.3;
      ty = anchor.y - gap - h / 2;
    } else {
      tx = anchor.x + side * (w / 2 + gap);
      ty = anchor.y - h * 0.15;
    }
    tx = Math.min(view.w - m - w / 2, Math.max(m + w / 2, tx));
    ty = Math.min(view.bottom - h / 2, Math.max(view.top + h / 2, ty));
    if (this.snap) { this.cx = tx; this.cy = ty; this.snap = false; }
    const k = 1 - Math.exp(-dt * 10);
    this.cx += (tx - this.cx) * k;
    this.cy += (ty - this.cy) * k;
    const x0 = this.cx - w / 2, y0 = this.cy - h / 2;
    this.box.style.transform = `translate3d(${f1(x0)}px, ${f1(y0)}px, 0)`;
    this.inner.style.transformOrigin = `${f1(anchor.x - x0)}px ${f1(anchor.y - y0)}px`;
    this.tail(anchor.x - x0, anchor.y - y0, inside, c.style);
  }

  // the tail: a wedge from inside the balloon toward (ax, ay) in box pixels, at most about one balloon height long
  tail(ax, ay, inside, style) {
    const cx = this.w / 2, cy = this.h / 2;
    let dx = ax - cx, dy = ay - cy;
    const dist = Math.hypot(dx, dy) || 1;
    dx /= dist;
    dy /= dist;
    // the balloon's edge along that direction (an ellipse ray)
    const edge = 1 / Math.sqrt((dx / this.rx) ** 2 + (dy / this.ry) ** 2);
    const reach = Math.min(dist, edge + Math.max(18, this.h * (inside ? 0.9 : 0.55)));
    const tipX = cx + dx * reach, tipY = cy + dy * reach;
    const bx = cx + dx * edge * 0.7, by = cy + dy * edge * 0.7;
    const half = Math.min(this.rx, this.ry) * (style === 'shout' ? 0.22 : 0.3);
    const px = -dy * half, py = dx * half;
    // a talk tail curves a little (drawn by hand); shout and panic tails are straight, sharp wedges
    const bend = style === 'talk' ? 0.35 : 0;
    const mx = (bx + tipX) / 2 + px * bend, my = (by + tipY) / 2 + py * bend;
    const d = `M${f1(bx + px)},${f1(by + py)}Q${f1(mx + px * 0.3)},${f1(my + py * 0.3)} ${f1(tipX)},${f1(tipY)}Q${f1(mx - px * 0.5)},${f1(my - py * 0.5)} ${f1(bx - px)},${f1(by - py)}Z`;
    this.inkTail.setAttribute('d', d);
    this.paperTail.setAttribute('d', d);
  }

  dispose() {
    this.layer.remove();
  }
}
