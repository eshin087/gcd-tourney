import { MAX_HP, MAX_KI, KI_BAR } from '../game/constants.js';
import { DEFENSE } from '../game/moves.js';
import { InputHistory } from './controls.js';

const JUDGE_WORDS = { perfect: 'PERFECT', great: 'GREAT', good: 'GOOD', miss: 'MISS', stray: 'OFF BEAT' };

// Technique callouts (ADR 0022): side banners stacked under the combo counter, newest on top, on the side of the
// fighter who did it. Game.tag(f, id) shows one. color: null = the fighter's own color; big: the large banner
// for the decisive moments; small: the quiet one for movement tech; cool: frames before the same fighter can
// show it again; excite: how much it lifts the crowd.
export const TAGS = {
  parry: { text: 'PARRY!', color: '#9ff0ff', big: true },
  burst: { text: 'BURST!', color: null, big: true, excite: 0.6 },
  dodge: { text: 'DODGE!', color: '#bfe8ff' },
  airDodge: { text: 'AIR DODGE!', color: '#bfe8ff' },
  backstep: { text: 'BACKSTEP', color: '#bfe8ff' }, // a back dash's invulnerable frames let a hit pass (ADR 0025)
  tech: { text: 'TECH!', color: '#ffffff' },
  techRoll: { text: 'TECH ROLL!', color: '#ffffff' },
  // the timed impact tech (ADR 0028): a fresh Guard press right before the floor or the barrier, in white-cyan
  impactTech: { text: 'TECH!', color: '#bff8ff', excite: 0.35 },
  wallTech: { text: 'WALL TECH!', color: '#bff8ff', excite: 0.45 },
  throwBreak: { text: 'THROW BREAK', color: '#ffe2a0' },
  reversal: { text: 'REVERSAL', color: '#ffb43a' },
  punish: { text: 'PUNISH!', color: '#ff6a4a' },
  wavedash: { text: 'WAVEDASH', color: '#c8f0ff', small: true, cool: 360, excite: 0.05 },
  // combo techniques (ADR 0026): the n-th wall bounce of a combo, a ground bounce, a relaunch, the vanish ping-pong
  wallBounce: { text: 'WALL BOUNCE!', color: '#bfe8ff', small: true, excite: 0.2 },
  wallBounce2: { text: 'WALL BOUNCE ×2!', color: '#bfe8ff', excite: 0.4 },
  handball: { text: 'HANDBALL!', color: '#ffd84a', big: true, excite: 0.7 },
  groundBounce: { text: 'GROUND BOUNCE!', color: '#fff3d0', small: true, excite: 0.1 },
  relaunch: { text: 'RELAUNCH!', color: '#ffb43a', excite: 0.3 },
  vanish2: { text: 'VANISH ×2!', color: null, excite: 0.4 },
  vanish3: { text: 'VANISH ×3!', color: null, big: true, excite: 0.6 },
};
// the end-of-combo rating (ADR 0026): by hits, plus STYLISH! for 4+ different techniques in it
const RATINGS = [[20, 'LEGENDARY'], [15, 'AMAZING'], [10, 'GREAT']];
const STYLISH = 4;
const CHIPS = 7; // ticker chips kept under a combo counter (the oldest scroll out)
const TAG_STACK = 3; // banners per side; a fourth pushes the oldest out

// A super/ultimate layer as a crisp <img> (the decoded image is shared, nothing is copied); the right-hand player's
// art is mirrored so the fighter faces the opponent.
const layerImg = (img, cls, mirror) => {
  const el = new Image();
  el.src = img.src;
  el.className = cls + (mirror ? ' mirror' : '');
  el.draggable = false;
  return el;
};
const mirroredCanvas = (src, mirror, cls = '') => {
  const cv = document.createElement('canvas');
  if (cls) cv.className = cls;
  cv.width = src.width;
  cv.height = src.height;
  const ctx = cv.getContext('2d');
  if (mirror) { ctx.translate(cv.width, 0); ctx.scale(-1, 1); }
  ctx.drawImage(src, 0, 0);
  return cv;
};
const h = (tag, cls, html = '') => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  return e;
};

// Crop the head out of the first idle frame for a portrait.
export function portraitCanvas(asset, size = 34) {
  if (asset.portrait) {
    const c = document.createElement('canvas');
    c.width = asset.portrait.width;
    c.height = asset.portrait.height;
    c.getContext('2d').drawImage(asset.portrait, 0, 0);
    return c;
  }
  const m = asset.meta;
  const a = asset.anim('idle');
  const f = a.frames[0];
  // crop the head from the idle frame, sized from the sheet's own scale (works for any cell size)
  const ppu = m.pixelsPerUnit || 44, [px, py] = m.pivot || [m.frameWidth / 2, m.frameHeight];
  const S = Math.round(ppu * 0.62);
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  const col = f % asset.cols, row = Math.floor(f / asset.cols);
  const sx = col * m.frameWidth + px - S / 2 + ppu * 0.05, sy = row * m.frameHeight + py - Math.round(ppu * 1.62);
  ctx.drawImage(asset.image, sx, sy, S, S, 0, 0, size, size);
  return c;
}

export class Hud {
  constructor(root) {
    this.root = h('div', 'hud hidden');
    root.appendChild(this.root);
    const top = h('div', 'hud-top');
    this.p = [0, 1].map((i) => {
      const side = h('div', `pbar p${i + 1}`);
      const portrait = h('div', 'portrait');
      const bars = h('div', 'bars');
      const name = h('div', 'pname');
      const hp = h('div', 'hp');
      const trail = h('div', 'hp-trail');
      const fill = h('div', 'hp-fill');
      hp.append(trail, fill);
      const kiRow = h('div', 'ki-row');
      const segs = [0, 1, 2].map(() => {
        const s = h('div', 'ki-seg');
        const f = h('i');
        s.append(f);
        kiRow.append(s);
        return f;
      });
      const kiNum = h('div', 'ki-num', '1');
      // the round's Burst (ADR 0022): lit while it's there, glowing once there's ki for it, dark once used
      const burst = h('div', 'burst-ico', '<i></i>');
      burst.title = 'Burst: Guard + Special while being hit (2 bars, once per round)';
      kiRow.append(kiNum, burst);
      // timed mode (Godspeed): a thin draining bar under the ki gauge
      const modeBar = h('div', 'mode-bar', '<i></i>');
      const wins = h('div', 'wins', '<i></i><i></i>');
      bars.append(name, hp, kiRow, modeBar);
      side.append(portrait, bars, wins);
      top.append(side);
      if (i === 0) {
        this.timer = h('div', 'timer', '99');
        this.trainTag = h('div', 'train-tag', 'TRAINING');
        top.append(this.timer, this.trainTag);
      }
      return { side, portrait, name, trail, fill, segs, kiNum, kiRow, wins, modeBar, burst, burstState: '', trailHp: MAX_HP, shown: -1 };
    });
    this.root.append(top);
    this.combo = [0, 1].map((i) => {
      const c = h('div', `combo c${i + 1}`);
      // the count, the technique ticker under it (ADR 0026) and the rating when it ends
      const num = h('div', 'cnum'), chips = h('div', 'chips'), rate = h('div', 'rate');
      c.append(num, chips, rate);
      this.root.append(c);
      return { el: c, num, chips, rate, hits: 0, t: 0, blue: false };
    });
    this.callouts = [0, 1].map((i) => {
      const c = h('div', `callout k${i + 1}`);
      this.root.append(c);
      return c;
    });
    this.tags = [0, 1].map((i) => {
      const c = h('div', `tags k${i + 1}`);
      this.root.append(c);
      return c;
    });
    this.announceEl = h('div', 'announce');
    this.root.parentNode.append(this.announceEl);
    this.clashEl = h('div', 'clash hidden', `
      <div class="beat"><div class="beat-target"></div><div class="beat-rings"></div><div class="beat-call"></div>
        <div class="beat-judge j1"></div><div class="beat-judge j2"></div></div>
      <div class="clash-bar"><div class="clash-a"></div><div class="clash-b"></div><div class="clash-mark"></div></div>
      <div class="clash-hint"></div>`);
    this.root.append(this.clashEl);
    this.beatTarget = this.clashEl.querySelector('.beat-target');
    this.beatRingsEl = this.clashEl.querySelector('.beat-rings');
    this.beatCall = this.clashEl.querySelector('.beat-call');
    this.beatJudges = [...this.clashEl.querySelectorAll('.beat-judge')];
    this.beatRings = [];
    this.cards = h('div', 'namecards hidden');
    this.root.parentNode.append(this.cards);
    this.hint = h('div', 'hint');
    this.root.append(this.hint);
    this.cutin = h('div', 'cutin');
    this.root.parentNode.append(this.cutin);
  }

  // DBFZ-style super flash (ADR 0035). asset: the fighter's SheetAsset (cutin = the eye strip, super/ult = { bg, fg }
  // layer images, each optional). tier 'super' slides a banner across the screen: the move's backdrop (or speed
  // lines) with the fighter breaking out of its top edge (or the eye strip inside it). tier 'ult' plays the
  // full-screen splash when the fighter has either splash layer, else the banner. o.secs = how long the world is frozen.
  superCutin(i, asset, color, name, o = {}) {
    const L = o.tier === 'ult' ? asset?.ult : asset?.super;
    if (o.tier === 'ult' && (L?.bg || L?.fg)) return this.ultSplash(i, L, color, name, o.secs ?? 0.8, asset?.cutin);
    this.splash?.remove();
    const c = this.cutin;
    c.innerHTML = '';
    c.className = 'cutin';
    c.style.setProperty('--cc', color);
    const strip = h('div', 'cutin-strip');
    if (L?.bg) {
      c.classList.add('art');
      strip.append(layerImg(L.bg, 'cutin-bg', i === 1));
    }
    // no fighter layer: the eye strip, as a framed panel on the fighter's side when a backdrop fills the band
    if (!L?.fg && asset?.cutin) strip.append(mirroredCanvas(asset.cutin, i === 1, L?.bg ? 'cutin-eyes' : ''));
    const label = h('div', 'cutin-name', `<span>${name}</span>`);
    c.append(strip);
    if (L?.fg) {
      c.classList.add('art');
      // outside the clipped strip, so the head and a raised hand can break out of the banner's top edge
      c.append(layerImg(L.fg, 'cutin-fg', i === 1));
    }
    c.append(label);
    void c.offsetWidth;
    c.classList.add(i === 1 ? 'go-r' : 'go-l');
  }

  // An eye technique's flash (a move's `eyeFlash`): the eye strip snaps across a thin band for half a second, so the
  // red eyes read even while the fighter is small on screen.
  eyeFlash(i, eyes, color) {
    if (!eyes) return;
    this.eyes?.remove();
    const e = h('div', `eyeflash ${i === 1 ? 'p2' : 'p1'}`);
    e.style.setProperty('--cc', color);
    e.append(mirroredCanvas(eyes, i === 1));
    this.root.parentNode.append(e);
    this.eyes = e;
    e.addEventListener('animationend', () => e.remove());
  }

  // The ultimate's full-screen splash: a colored flash in, letterbox bars, the backdrop slowly pushing in, the
  // fighter sliding over it from their side, the move name large. It lives for the frozen frames and then fades.
  ultSplash(i, L, color, name, secs, eyes = null) {
    this.cutin.className = 'cutin';
    this.splash?.remove();
    const s = h('div', `splash ${i === 1 ? 'p2' : 'p1'}`);
    s.style.setProperty('--cc', color);
    s.style.setProperty('--d', `${Math.max(0.5, secs).toFixed(2)}s`);
    if (L.bg) s.append(layerImg(L.bg, 'sp-bg', i === 1));
    if (L.fg) s.append(layerImg(L.fg, 'sp-fg', i === 1));
    else if (eyes) s.append(mirroredCanvas(eyes, i === 1, 'sp-eyes')); // no fighter layer yet: the eye strip as a band
    s.append(h('div', 'sp-bar top'), h('div', 'sp-bar bot'), h('div', 'sp-name', `<span>${name}</span>`), h('div', 'sp-flash'));
    this.root.parentNode.append(s);
    this.splash = s;
    s.addEventListener('animationend', (e) => { if (e.target === s) s.remove(); });
  }

  setup(fighters, assets, hint) {
    fighters.forEach((f, i) => {
      const P = this.p[i];
      P.name.textContent = f.def.name;
      P.portrait.innerHTML = '';
      P.portrait.append(portraitCanvas(assets[i]));
      P.side.style.setProperty('--pc', f.def.color);
      P.trailHp = MAX_HP;
      this.combo[i].hits = 0;
      this.combo[i].el.classList.remove('show');
      this.combo[i].blue = false;
      this.comboStart(i);
      this.tags[i].textContent = '';
    });
    this.hint.innerHTML = hint;
    this.cards.innerHTML = fighters.map((f, i) => `
      <div class="card c${i + 1}" style="--pc:${f.def.color}">
        <div class="cn">${f.def.name}</div><div class="cs">${f.def.subtitle}</div>
      </div>`).join('<div class="vs">VS</div>');
  }

  show(v) {
    this.root.classList.toggle('hidden', !v);
  }

  // Training room: no timer / round pips, plus a fighting-game input history.
  training(on) {
    this.root.classList.toggle('training', on);
    if (on && !this.history) this.history = new InputHistory(this.root);
    if (!on && this.history) { this.history.destroy(); this.history = null; }
  }

  showCards(v) {
    this.cards.classList.toggle('hidden', !v);
  }

  update(fighters, timeLeft, dt) {
    fighters.forEach((f, i) => {
      const P = this.p[i];
      const pct = Math.max(0, f.hp / MAX_HP);
      P.fill.style.width = pct * 100 + '%';
      P.fill.classList.toggle('low', pct < 0.3);
      if (P.trailHp > f.hp) P.trailHp = Math.max(f.hp, P.trailHp - MAX_HP * 0.5 * dt * (f.state === 'hitstun' || f.state === 'launched' ? 0.15 : 1));
      else P.trailHp = f.hp;
      P.trail.style.width = (P.trailHp / MAX_HP) * 100 + '%';
      const bars = Math.floor(f.ki / KI_BAR);
      P.segs.forEach((s, k) => {
        const v = Math.max(0, Math.min(1, (f.ki - k * KI_BAR) / KI_BAR));
        s.style.width = v * 100 + '%';
        s.parentNode.classList.toggle('full', v >= 1);
      });
      P.kiNum.textContent = bars;
      P.kiRow.classList.toggle('max', f.ki >= MAX_KI);
      const B = DEFENSE.burst, bs = f.burstUsed >= B.perRound ? 'used' : f.ki >= B.cost ? 'ready' : 'held';
      if (bs !== P.burstState) { P.burstState = bs; P.burst.className = 'burst-ico ' + bs; }
      P.modeBar.classList.toggle('on', !!f.mode);
      if (f.mode) {
        P.modeBar.firstChild.style.width = (f.mode.t / f.mode.len) * 100 + '%';
        P.modeBar.style.setProperty('--mc', f.mode.color || f.def.color);
      }
      const w = P.wins.children;
      for (let k = 0; k < w.length; k++) w[k].classList.toggle('on', f.wins > k);

      // combo counter on the attacker's side
      const opp = fighters[1 - i];
      const C = this.combo[i];
      if (opp.combo >= 2 && opp.combo !== C.hits) {
        C.hits = opp.combo;
        // blue (ADR 0022): the combo had a gap they could have teched out of; training shows the widest one in frames
        const blue = !!opp.comboBlue, gap = this.root.classList.contains('training') && opp.maxGap > 0 ? `<em>GAP ${opp.maxGap}F</em>` : '';
        C.num.innerHTML = `<b>${opp.combo}</b><span>HITS</span><small>${opp.comboDmg} DMG</small>${gap}`;
        C.el.classList.remove('pop', 'blue-pop');
        void C.el.offsetWidth;
        C.el.classList.toggle('blue', blue);
        C.el.classList.add('show', blue && !C.blue ? 'blue-pop' : 'pop');
        C.blue = blue;
        C.t = 1.4;
      }
      if (C.t > 0) {
        // it stays up while they're still reeling in it (a long bounce, a super's hold), so the ticker and rating show
        const reeling = opp.combo > 0 && (opp.state === 'launched' || opp.state === 'hitstun' || opp.state === 'held');
        if (!reeling) C.t -= dt;
        if (C.t <= 0) { C.el.classList.remove('show'); C.hits = 0; C.blue = false; this.comboStart(i); }
      }
    });
    const tl = Math.max(0, Math.ceil(timeLeft));
    if (this.timer.textContent !== String(tl)) this.timer.textContent = tl;
    this.timer.classList.toggle('low', tl <= 10);
  }

  kiShort(i) {
    const r = this.p[i].kiRow;
    r.classList.remove('short');
    void r.offsetWidth;
    r.classList.add('short');
  }

  // A technique banner (TAGS[id]) on side i, newest on top; it slides out by itself (and the stack never grows past
  // TAG_STACK, also in a hidden tab where animations don't run).
  tag(i, id, color) {
    const T = TAGS[id], box = this.tags[i];
    if (!T || !box) return;
    const e = h('div', 'tag' + (T.big ? ' big' : T.small ? ' small' : ''), `<span>${T.text}</span>`);
    e.style.setProperty('--cc', color);
    e.addEventListener('animationend', (ev) => { if (ev.target === e) e.remove(); });
    box.prepend(e);
    while (box.children.length > TAG_STACK) box.lastChild.remove();
  }

  // A new combo on side i: the ticker and the last rating clear.
  comboStart(i) {
    const C = this.combo[i];
    C.chips.textContent = '';
    C.rate.textContent = '';
    C.rate.className = 'rate';
  }

  // A technique in side i's running combo (Game.comboChip): a chip in the ticker under the counter (WALL ▸ VANISH ▸
  // BOUNCE ...); the same one twice in a row counts up instead.
  comboTag(i, label) {
    const C = this.combo[i], last = C.chips.lastElementChild;
    if (last && last.dataset.l === label) {
      last.dataset.n = String((+last.dataset.n || 1) + 1);
      last.textContent = `${label} ×${last.dataset.n}`;
      return;
    }
    const e = h('i', 'chip');
    e.dataset.l = label;
    e.textContent = label;
    C.chips.append(e);
    while (C.chips.children.length > CHIPS) C.chips.firstChild.remove();
  }

  // The combo on side i ended with `hits` hits and `kinds` different techniques: its rating under the counter, which
  // stays up a little longer for it. Returns the rating word, or null for an unrated combo.
  comboEnd(i, hits, kinds) {
    const word = RATINGS.find(([n]) => hits >= n)?.[1] ?? null;
    const stylish = kinds >= STYLISH;
    if (!word && !stylish) return null;
    const C = this.combo[i];
    C.rate.innerHTML = `${word ? `<strong>${word}</strong>` : ''}${stylish ? '<strong class="sty">STYLISH!</strong>' : ''}`;
    C.rate.className = 'rate';
    void C.rate.offsetWidth; // restart the pop
    C.rate.className = 'rate go ' + (word ? word.toLowerCase() : 'stylish');
    C.el.classList.add('show');
    C.t = Math.max(C.t, 2.4);
    return word ?? 'STYLISH';
  }

  callout(i, text, color, big = false) {
    const c = this.callouts[i];
    c.innerHTML = `<span>${text}</span>`;
    c.style.setProperty('--cc', color);
    c.classList.toggle('big', big);
    c.classList.remove('go');
    void c.offsetWidth;
    c.classList.add('go');
  }

  // style: 'round' | 'fight' | 'ko' | 'win' | 'time'
  announce(text, style = 'round', ms = 1200) {
    const a = this.announceEl;
    a.className = 'announce ' + style;
    a.innerHTML = `<span data-t="${text}">${text}</span>`;
    void a.offsetWidth;
    a.classList.add('go');
    clearTimeout(this._at);
    if (ms) this._at = setTimeout(() => a.classList.remove('go'), ms);
  }

  clearAnnounce() {
    this.announceEl.classList.remove('go');
  }

  clash(on, t = 0.5, colors = null, hint = '') {
    this.clashEl.classList.toggle('hidden', !on);
    if (!on) return;
    if (colors) {
      this.clashEl.style.setProperty('--ca', colors[0]);
      this.clashEl.style.setProperty('--cb', colors[1]);
    }
    this.clashEl.querySelector('.clash-a').style.width = t * 100 + '%';
    this.clashEl.querySelector('.clash-b').style.width = (1 - t) * 100 + '%';
    this.clashEl.querySelector('.clash-mark').style.left = t * 100 + '%';
    if (hint) this.clashEl.querySelector('.clash-hint').innerHTML = hint;
  }

  // Rhythm clash (ADR 0017): approach rings close on one target, each player's grade pops on their side, and the
  // FINAL PUSH hold fills the target. `c` is Game.clash (chart, timer, judges); a lite clash has no struggle bar.
  clashStart(c, colors, hint) {
    this.clashEl.classList.toggle('lite', !!c.lite);
    this.beatRingsEl.textContent = '';
    this.beatRings = c.chart.notes.map((n) => {
      const r = h('div', 'beat-ring' + (n.kind === 'hold' ? ' hold' : n.double ? ' double' : ''));
      this.beatRingsEl.append(r);
      return r;
    });
    this.beatJudges.forEach((e, i) => { e.className = `beat-judge j${i + 1}`; e.textContent = ''; });
    this.clash(true, 0.5, colors, hint);
    this.clashBeat(c);
  }

  clashBeat(c) {
    const now = c.timer, lead = c.chart.lead;
    let hold = null, tick = false;
    c.chart.notes.forEach((n, i) => {
      const r = this.beatRings[i], dt = n.t - now, end = n.end ?? n.t;
      if (dt === 0) tick = true;
      if (n.kind === 'hold' && dt <= lead) hold = n;
      if (dt > lead || now > end + 6) {
        if (r.on) { r.on = false; r.style.opacity = '0'; }
        return;
      }
      r.on = true;
      const s = dt > 0 ? 1 + (2.4 * dt) / lead : 1;
      r.style.opacity = (dt > 0 ? Math.min(1, (lead - dt) / 8) : Math.max(0, 1 - (now - end) / 6)).toFixed(2);
      r.style.transform = `translate(-50%, -50%) scale(${s.toFixed(3)})`;
    });
    if (tick) {
      // the target thumps on every note: the beat you can see
      this.beatTarget.classList.remove('go');
      void this.beatTarget.offsetWidth;
      this.beatTarget.classList.add('go');
    }
    const p = hold && now >= hold.t ? Math.min(1, (now - hold.t) / (hold.end - hold.t)) : 0;
    this.beatTarget.style.setProperty('--p', p.toFixed(3));
    this.beatCall.textContent = !hold || now > hold.end ? '' : now < hold.t ? 'FINAL PUSH!' : 'HOLD!';
  }

  clashJudge(i, g) {
    const e = this.beatJudges[i];
    e.textContent = JUDGE_WORDS[g] ?? '';
    e.className = `beat-judge j${i + 1} ${g}`;
    void e.offsetWidth; // restart the pop
    e.classList.add('go');
  }
}
