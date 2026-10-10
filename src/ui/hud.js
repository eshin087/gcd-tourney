import { MAX_HP, MAX_KI, KI_BAR } from '../game/constants.js';
import { InputHistory } from './controls.js';

const JUDGE_WORDS = { perfect: 'PERFECT', great: 'GREAT', good: 'GOOD', miss: 'MISS', stray: 'OFF BEAT' };
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
      kiRow.append(kiNum);
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
      return { side, portrait, name, trail, fill, segs, kiNum, kiRow, wins, modeBar, trailHp: MAX_HP, shown: -1 };
    });
    this.root.append(top);
    this.combo = [0, 1].map((i) => {
      const c = h('div', `combo c${i + 1}`);
      this.root.append(c);
      return { el: c, hits: 0, t: 0 };
    });
    this.callouts = [0, 1].map((i) => {
      const c = h('div', `callout k${i + 1}`);
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

  // DBFZ-style super flash banner: the character's eyes slide across a speed-line strip.
  superCutin(i, canvas, color, name) {
    const c = this.cutin;
    c.innerHTML = '';
    c.className = 'cutin';
    c.style.setProperty('--cc', color);
    const strip = h('div', 'cutin-strip');
    if (canvas) {
      const cv = document.createElement('canvas');
      cv.width = canvas.width;
      cv.height = canvas.height;
      const ctx = cv.getContext('2d');
      if (i === 1) { ctx.translate(cv.width, 0); ctx.scale(-1, 1); }
      ctx.drawImage(canvas, 0, 0);
      strip.append(cv);
    }
    const label = h('div', 'cutin-name', `<span>${name}</span>`);
    c.append(strip, label);
    void c.offsetWidth;
    c.classList.add(i === 1 ? 'go-r' : 'go-l');
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
        C.el.innerHTML = `<b>${opp.combo}</b><span>HITS</span><small>${opp.comboDmg} DMG</small>`;
        C.el.classList.remove('pop');
        void C.el.offsetWidth;
        C.el.classList.add('show', 'pop');
        C.t = 1.4;
      }
      if (C.t > 0) {
        C.t -= dt;
        if (C.t <= 0) { C.el.classList.remove('show'); C.hits = 0; }
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
