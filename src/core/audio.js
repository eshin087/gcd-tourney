// All sound is synthesized with WebAudio, so the demo ships with zero audio files.
// Swap any entry in play() for a sample later (AudioBuffer) without touching callers.

export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.muted = (() => { try { return localStorage.getItem('gcd.muted') === '1'; } catch { return false; } })();
    this.musicOn = true;
    this.muteListeners = new Set();
    this.loops = new Map();
  }

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = (this.ctx = new AC());
    this.master = ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 0.8;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.ratio.value = 6;
    this.master.connect(comp).connect(ctx.destination);
    this.sfx = ctx.createGain();
    this.sfx.gain.value = 0.9;
    this.sfx.connect(this.master);
    this.music = ctx.createGain();
    this.music.gain.value = 0.32;
    this.music.connect(this.master);
    this.amb = ctx.createGain();
    this.amb.gain.value = 0.0;
    this.amb.connect(this.master);
    // crunchy bus for impacts
    this.crunch = ctx.createWaveShaper();
    const curve = new Float32Array(1024);
    for (let i = 0; i < 1024; i++) { const x = (i / 1023) * 2 - 1; curve[i] = Math.tanh(x * 3.2) * 0.85; }
    this.crunch.curve = curve;
    this.crunch.oversample = '2x';
    this.crunch.connect(this.sfx);
    const len = ctx.sampleRate * 2;
    this.noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = this.noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    this.startCrowd();
  }

  get t() {
    return this.ctx ? this.ctx.currentTime : 0;
  }

  setMuted(m) {
    this.muted = m;
    if (this.master) this.master.gain.setTargetAtTime(m ? 0 : 0.8, this.t, 0.05);
    try { localStorage.setItem('gcd.muted', m ? '1' : '0'); } catch {}
    for (const f of this.muteListeners) f(m);
  }

  onMute(f) {
    this.muteListeners.add(f);
    return () => this.muteListeners.delete(f);
  }

  // ---- primitives ----
  tone({ type = 'sine', f0 = 440, f1 = f0, dur = 0.2, gain = 0.3, attack = 0.005, when = 0, dest = this.sfx, curve = 'exp' }) {
    const ctx = this.ctx;
    const t0 = this.t + when;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(f0, t0);
    if (f1 !== f0) {
      if (curve === 'exp') o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t0 + dur);
      else o.frequency.linearRampToValueAtTime(f1, t0 + dur);
    }
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(dest);
    o.start(t0);
    o.stop(t0 + dur + 0.05);
    return o;
  }

  noise({ dur = 0.2, gain = 0.3, type = 'bandpass', f0 = 1000, f1 = f0, Q = 1, attack = 0.005, when = 0, dest = this.sfx }) {
    const ctx = this.ctx;
    const t0 = this.t + when;
    const s = ctx.createBufferSource();
    s.buffer = this.noiseBuf;
    s.loop = true;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.Q.value = Q;
    f.frequency.setValueAtTime(f0, t0);
    if (f1 !== f0) f.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t0 + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    s.connect(f).connect(g).connect(dest);
    s.start(t0, Math.random());
    s.stop(t0 + dur + 0.05);
  }

  play(name, vol = 1) {
    if (!this.ctx || this.muted) return;
    const v = vol;
    switch (name) {
      case 'whoosh':
        this.noise({ dur: 0.13, gain: 0.22 * v, f0: 900, f1: 2800, Q: 1.4 });
        break;
      case 'whooshHeavy':
        this.noise({ dur: 0.24, gain: 0.3 * v, f0: 500, f1: 1800, Q: 1.2 });
        break;
      case 'hit':
        this.noise({ dur: 0.025, gain: 0.45 * v, type: 'highpass', f0: 3500 });
        this.noise({ dur: 0.08, gain: 0.55 * v, type: 'bandpass', f0: 1400, f1: 600, Q: 1.2, dest: this.crunch });
        this.tone({ type: 'sine', f0: 210, f1: 62, dur: 0.11, gain: 0.7 * v });
        this.tone({ type: 'square', f0: 1600, f1: 520, dur: 0.03, gain: 0.07 * v });
        break;
      case 'hitHeavy':
        this.noise({ dur: 0.03, gain: 0.55 * v, type: 'highpass', f0: 3000 });
        this.noise({ dur: 0.2, gain: 0.8 * v, type: 'lowpass', f0: 3200, f1: 260, dest: this.crunch });
        this.tone({ type: 'sine', f0: 150, f1: 34, dur: 0.3, gain: 0.95 * v });
        this.tone({ type: 'square', f0: 900, f1: 180, dur: 0.07, gain: 0.12 * v, dest: this.crunch });
        break;
      case 'smash':
        this.play('hitHeavy', v);
        this.noise({ dur: 0.5, gain: 0.5 * v, type: 'lowpass', f0: 1800, f1: 120, attack: 0.01 });
        this.tone({ type: 'sine', f0: 90, f1: 28, dur: 0.55, gain: 0.8 * v });
        this.tone({ type: 'sawtooth', f0: 2400, f1: 300, dur: 0.09, gain: 0.07 * v, dest: this.crunch });
        break;
      case 'launch':
        this.noise({ dur: 0.3, gain: 0.3 * v, f0: 500, f1: 3200, Q: 1.4 });
        break;
      case 'superDash':
        this.noise({ dur: 0.4, gain: 0.35 * v, type: 'lowpass', f0: 1400, f1: 500 });
        this.noise({ dur: 0.25, gain: 0.25 * v, f0: 2500, f1: 900, Q: 1 });
        this.tone({ type: 'sawtooth', f0: 70, f1: 140, dur: 0.35, gain: 0.08 * v, curve: 'lin' });
        break;
      case 'superJump':
        this.noise({ dur: 0.22, gain: 0.3 * v, f0: 700, f1: 3000, Q: 1.2 });
        this.tone({ type: 'sine', f0: 220, f1: 520, dur: 0.18, gain: 0.12 * v });
        break;
      case 'step':
        this.noise({ dur: 0.035, gain: 0.12 * v, type: 'lowpass', f0: 600, f1: 250 });
        break;
      case 'vanish':
        this.tone({ type: 'sine', f0: 380, f1: 2600, dur: 0.09, gain: 0.18 * v });
        this.noise({ dur: 0.12, gain: 0.22 * v, type: 'highpass', f0: 2500, f1: 6000 });
        break;
      case 'vanishIn':
        this.tone({ type: 'sine', f0: 2600, f1: 500, dur: 0.11, gain: 0.18 * v });
        this.noise({ dur: 0.08, gain: 0.3 * v, type: 'lowpass', f0: 1200, f1: 300 });
        break;
      case 'wallBounce':
        this.play('hitHeavy', 0.8 * v);
        this.tone({ type: 'triangle', f0: 1200, f1: 260, dur: 0.22, gain: 0.18 * v });
        this.noise({ dur: 0.3, gain: 0.25 * v, type: 'highpass', f0: 1800, f1: 600 });
        break;
      case 'groundBounce':
        this.noise({ dur: 0.35, gain: 0.8 * v, type: 'lowpass', f0: 1600, f1: 120, dest: this.crunch });
        this.tone({ type: 'sine', f0: 110, f1: 30, dur: 0.4, gain: 0.9 * v });
        for (let k = 0; k < 4; k++) this.noise({ dur: 0.04, gain: 0.15 * v, type: 'bandpass', f0: 2000 + k * 600, when: 0.08 + k * 0.05, Q: 3 });
        break;
      case 'block':
        this.tone({ type: 'triangle', f0: 1100, f1: 760, dur: 0.07, gain: 0.25 * v });
        this.noise({ dur: 0.05, gain: 0.2 * v, type: 'highpass', f0: 3000 });
        break;
      case 'jump':
        this.noise({ dur: 0.12, gain: 0.12 * v, f0: 600, f1: 1600 });
        break;
      case 'land':
        this.noise({ dur: 0.1, gain: 0.25 * v, type: 'lowpass', f0: 500, f1: 150 });
        break;
      case 'dash':
        this.noise({ dur: 0.22, gain: 0.25 * v, f0: 1600, f1: 500, Q: 0.8 });
        break;
      case 'thud':
        this.noise({ dur: 0.18, gain: 0.5 * v, type: 'lowpass', f0: 700, f1: 120 });
        this.tone({ type: 'sine', f0: 110, f1: 40, dur: 0.22, gain: 0.6 * v });
        break;
      case 'kiFull':
        this.tone({ type: 'triangle', f0: 880, dur: 0.15, gain: 0.15 * v });
        this.tone({ type: 'triangle', f0: 1320, dur: 0.25, gain: 0.12 * v, when: 0.07 });
        break;
      case 'poof':
        this.noise({ dur: 0.25, gain: 0.3 * v, f0: 2000, f1: 400, Q: 0.6 });
        break;
      case 'shuriken':
        this.tone({ type: 'sine', f0: 2600, f1: 1700, dur: 0.16, gain: 0.08 * v });
        this.noise({ dur: 0.1, gain: 0.12 * v, type: 'highpass', f0: 4000 });
        break;
      case 'fireball':
        this.noise({ dur: 0.7, gain: 0.5 * v, type: 'lowpass', f0: 1800, f1: 300, attack: 0.03 });
        this.tone({ type: 'sawtooth', f0: 90, f1: 50, dur: 0.6, gain: 0.12 * v });
        break;
      case 'specialHit':
      case 'explosion':
        this.noise({ dur: 0.9, gain: 0.8 * v, type: 'lowpass', f0: 2600, f1: 90, attack: 0.01 });
        this.tone({ type: 'sine', f0: 90, f1: 26, dur: 0.8, gain: 0.9 * v });
        this.tone({ type: 'square', f0: 300, f1: 60, dur: 0.15, gain: 0.12 * v });
        break;
      case 'beamCharge':
        this.tone({ type: 'sawtooth', f0: 90, f1: 420, dur: 0.85, gain: 0.12 * v, attack: 0.1, curve: 'lin' });
        this.noise({ dur: 0.85, gain: 0.25 * v, f0: 300, f1: 3000, Q: 2, attack: 0.2 });
        break;
      case 'flash':
        this.tone({ type: 'sine', f0: 2600, f1: 3600, dur: 0.6, gain: 0.12 * v, attack: 0.002 });
        this.tone({ type: 'triangle', f0: 1300, f1: 1800, dur: 0.45, gain: 0.1 * v });
        this.noise({ dur: 0.5, gain: 0.25 * v, type: 'highpass', f0: 3000, f1: 8000 });
        this.tone({ type: 'sine', f0: 80, f1: 40, dur: 0.4, gain: 0.5 * v });
        break;
      case 'gong': {
        const parts = [1, 1.52, 2.03, 2.74, 3.21, 4.07];
        parts.forEach((p, i) => this.tone({ type: 'sine', f0: 98 * p, f1: 98 * p * 0.995, dur: 3.2 - i * 0.35, gain: (0.3 / (i + 1)) * v, attack: 0.005 }));
        this.noise({ dur: 0.08, gain: 0.3 * v, type: 'lowpass', f0: 2000 });
        break;
      }
      case 'taiko':
        this.tone({ type: 'sine', f0: 120, f1: 48, dur: 0.35, gain: 0.8 * v });
        this.noise({ dur: 0.06, gain: 0.35 * v, type: 'lowpass', f0: 900 });
        break;
      case 'cheer':
        this.noise({ dur: 1.8, gain: 0.22 * v, f0: 900, f1: 1400, Q: 0.7, attack: 0.15, dest: this.sfx });
        this.noise({ dur: 1.5, gain: 0.12 * v, f0: 2400, f1: 2000, Q: 1.5, attack: 0.1, dest: this.sfx });
        break;
      case 'beat': // a rhythm clash's metronome: every note ticks (ADR 0017)
        this.tone({ type: 'triangle', f0: 1320, f1: 990, dur: 0.06, gain: 0.22 * v });
        this.noise({ dur: 0.025, gain: 0.12 * v, type: 'highpass', f0: 5000 });
        break;
      case 'beatHit': // a player's own good press
        this.tone({ type: 'sine', f0: 1760, dur: 0.16, gain: 0.14 * v });
        this.tone({ type: 'sine', f0: 2637, dur: 0.12, gain: 0.07 * v, when: 0.02 });
        break;
      case 'beatMiss':
        this.tone({ type: 'square', f0: 150, f1: 90, dur: 0.1, gain: 0.07 * v });
        break;
      case 'ui':
        this.tone({ type: 'square', f0: 660, dur: 0.05, gain: 0.06 * v });
        break;
      case 'uiConfirm':
        this.tone({ type: 'square', f0: 660, dur: 0.06, gain: 0.07 * v });
        this.tone({ type: 'square', f0: 990, dur: 0.1, gain: 0.07 * v, when: 0.06 });
        break;
      case 'ko':
        this.play('explosion', 1.2);
        this.tone({ type: 'sawtooth', f0: 220, f1: 55, dur: 1.2, gain: 0.15 * v });
        break;
    }
  }

  // ---- loops (charging aura, rasengan whirr, chidori chirp, beams, clash) ----
  loop(id, kind) {
    if (!this.ctx || this.loops.has(id)) return;
    const ctx = this.ctx;
    const out = ctx.createGain();
    out.gain.setValueAtTime(0.0001, this.t);
    out.gain.exponentialRampToValueAtTime(1, this.t + 0.08);
    out.connect(this.sfx);
    const nodes = [];
    const src = () => {
      const s = ctx.createBufferSource();
      s.buffer = this.noiseBuf;
      s.loop = true;
      s.start(0, Math.random());
      nodes.push(s);
      return s;
    };
    const osc = (type, f) => {
      const o = ctx.createOscillator();
      o.type = type;
      o.frequency.value = f;
      o.start();
      nodes.push(o);
      return o;
    };
    const filt = (type, f, Q = 1) => {
      const b = ctx.createBiquadFilter();
      b.type = type;
      b.frequency.value = f;
      b.Q.value = Q;
      return b;
    };
    const gain = (v) => {
      const g = ctx.createGain();
      g.gain.value = v;
      return g;
    };
    const lfo = (f, depth, target) => {
      const o = osc('sine', f);
      const g = gain(depth);
      o.connect(g).connect(target);
    };

    if (kind === 'charge') {
      const n = src(), f = filt('bandpass', 500, 0.8), g = gain(0.22);
      n.connect(f).connect(g).connect(out);
      lfo(7, 250, f.frequency);
      const o = osc('sawtooth', 62), og = gain(0.06);
      o.connect(filt('lowpass', 400)).connect(og).connect(out);
      lfo(5, 6, o.frequency);
    } else if (kind === 'rasengan') {
      const n = src(), f = filt('bandpass', 1800, 3), g = gain(0.3);
      n.connect(f).connect(g).connect(out);
      lfo(22, 900, f.frequency);
      lfo(30, 0.15, g.gain);
      const o = osc('triangle', 330), og = gain(0.05);
      o.connect(og).connect(out);
      lfo(18, 40, o.frequency);
    } else if (kind === 'chidori') {
      const o = osc('square', 2600), og = gain(0.0);
      o.connect(filt('bandpass', 3000, 1)).connect(og).connect(out);
      const n = src(), f = filt('highpass', 3500), g = gain(0.16);
      n.connect(f).connect(g).connect(out);
      // random chirps
      const iv = setInterval(() => {
        const t = this.t;
        o.frequency.setValueAtTime(1800 + Math.random() * 2600, t);
        og.gain.setValueAtTime(Math.random() < 0.6 ? 0.07 : 0, t);
        g.gain.setValueAtTime(0.08 + Math.random() * 0.2, t);
      }, 35);
      nodes.push({ stop: () => clearInterval(iv) });
    } else if (kind === 'beam') {
      const n = src(), f = filt('lowpass', 1400, 0.7), g = gain(0.55);
      n.connect(f).connect(g).connect(out);
      lfo(9, 300, f.frequency);
      const o1 = osc('sawtooth', 68), o2 = osc('sawtooth', 71), og = gain(0.08);
      const lp = filt('lowpass', 600);
      o1.connect(lp); o2.connect(lp);
      lp.connect(og).connect(out);
    } else if (kind === 'clash') {
      const n = src(), f = filt('lowpass', 900, 0.8), g = gain(0.45); // under the metronome
      n.connect(f).connect(g).connect(out);
      lfo(13, 400, f.frequency);
      const n2 = src(), f2 = filt('highpass', 3000), g2 = gain(0.1);
      n2.connect(f2).connect(g2).connect(out);
      lfo(17, 0.1, g2.gain);
      const o = osc('sawtooth', 48), og = gain(0.12);
      o.connect(filt('lowpass', 300)).connect(og).connect(out);
      lfo(6, 8, o.frequency);
    }
    this.loops.set(id, { out, nodes });
  }

  stopLoop(id) {
    const l = this.loops.get(id);
    if (!l) return;
    this.loops.delete(id);
    const t = this.t;
    l.out.gain.cancelScheduledValues(t);
    l.out.gain.setValueAtTime(l.out.gain.value, t);
    l.out.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);
    setTimeout(() => {
      for (const n of l.nodes) try { n.stop(); } catch {}
      l.out.disconnect();
    }, 250);
  }

  stopAllLoops() {
    for (const id of [...this.loops.keys()]) this.stopLoop(id);
  }

  // ---- crowd ambience ----
  startCrowd() {
    const ctx = this.ctx;
    const s = ctx.createBufferSource();
    s.buffer = this.noiseBuf;
    s.loop = true;
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = 1100;
    f.Q.value = 0.6;
    const g = ctx.createGain();
    g.gain.value = 0.05;
    const l = ctx.createOscillator();
    l.frequency.value = 0.37;
    const lg = ctx.createGain();
    lg.gain.value = 0.02;
    l.connect(lg).connect(g.gain);
    l.start();
    s.connect(f).connect(g).connect(this.amb);
    s.start();
  }

  setCrowd(level) {
    if (!this.ctx) return;
    this.amb.gain.setTargetAtTime(level, this.t, 0.4);
  }

  // ---- music: taiko + pentatonic plucks, scheduled ahead ----
  startMusic(style = 'battle') {
    if (!this.ctx) return;
    this.stopMusic();
    const ctx = this.ctx;
    const bpm = style === 'battle' ? 148 : 96;
    const step = 60 / bpm / 4;
    // Hirajoshi-ish scale on A
    const scale = [220, 246.94, 261.63, 329.63, 349.23, 440, 493.88, 523.25, 659.25, 698.46];
    const melody = style === 'battle'
      ? [5, -1, 7, 5, 4, -1, 3, -1, 5, 7, 8, -1, 7, 5, 4, 3, 2, -1, 3, 4, 5, -1, 3, -1, 2, 1, 0, -1, 1, 2, 3, -1]
      : [5, -1, -1, 4, -1, -1, 3, -1, 2, -1, -1, -1, 3, -1, 4, -1];
    const bass = [0, -1, -1, 0, -1, -1, 0, -1, 3, -1, -1, 3, -1, -1, 2, -1];
    const taiko = [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0];
    const shime = [0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1];
    let i = 0;
    let next = ctx.currentTime + 0.1;
    const dest = this.music;
    const sched = () => {
      while (next < ctx.currentTime + 0.2) {
        const s16 = i % 16;
        if (style === 'battle') {
          if (taiko[s16]) this._drum(next, 0.9);
          if (shime[s16]) this._click(next, 0.35);
          const b = bass[s16];
          if (b >= 0) this._pluck(next, scale[b] / 2, 'sawtooth', 0.09, step * 2.5, 500);
        } else if (s16 % 8 === 0) this._drum(next, 0.4);
        const m = melody[i % melody.length];
        if (m >= 0) this._pluck(next, scale[m] * (style === 'battle' ? 2 : 1), 'triangle', 0.13, step * 3, 3000);
        if (style === 'battle' && i % 64 >= 48 && m >= 0) this._pluck(next + step / 2, scale[(m + 2) % scale.length] * 2, 'square', 0.035, step, 2000);
        next += step;
        i++;
      }
    };
    sched();
    this.musicTimer = setInterval(sched, 40);
    void dest;
  }

  stopMusic() {
    clearInterval(this.musicTimer);
    this.musicTimer = null;
  }

  _drum(t, v) {
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    o.frequency.setValueAtTime(110, t);
    o.frequency.exponentialRampToValueAtTime(45, t + 0.25);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.7 * v, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
    o.connect(g).connect(this.music);
    o.start(t);
    o.stop(t + 0.4);
  }

  _click(t, v) {
    const ctx = this.ctx;
    const s = ctx.createBufferSource();
    s.buffer = this.noiseBuf;
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = 2200;
    f.Q.value = 4;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.5 * v, t + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    s.connect(f).connect(g).connect(this.music);
    s.start(t, Math.random());
    s.stop(t + 0.06);
  }

  _pluck(t, f, type, v, dur, cutoff) {
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = f;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(cutoff, t);
    lp.frequency.exponentialRampToValueAtTime(Math.max(200, cutoff / 6), t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(v, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(lp).connect(g).connect(this.music);
    o.start(t);
    o.stop(t + dur + 0.02);
  }
}

export const audio = new AudioEngine();
