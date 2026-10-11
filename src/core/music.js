// MusicPlayer: performs the songs musicPlan.js composes, with cheap WebAudio voices (ADR 0019). Callers keep
// audio.startMusic(mood) / stopMusic(); AudioEngine delegates here. One Track per playing mood (two only while
// they crossfade). Every note is a short-lived source + gain feeding persistent per-track filters, so a bar costs
// about a hundred tiny nodes and nothing piles up: no per-note filters, no ConvolverNode, no AudioWorklet (phones).
// Only LOOKAHEAD seconds of notes ever exist ahead of time, so the fight's intensity, the ducks, mute and a new
// mood all take effect within a bar.
//
// Chain: track.out (crossfade) -> duck (pause / clash / KO / domain) -> tone lowpass (lo-fi warmth, duck muffle)
// -> engine.music (the player's MUSIC volume) -> master.

import { composeSong, MOODS, DUCKS, rng } from './musicPlan.js';
import { IS_TOUCH_DEVICE } from './touch.js';

const LOOKAHEAD = 0.3; // s of notes scheduled ahead
const TICK_MS = 50;
const LATE = 0.08; // a step further behind than this is skipped, never played late (no burst after a stall)
const FADE_IN = 1.5, FADE_OUT = 2; // mood crossfade, s
const TONE_HZ = 5200; // the whole mix's lowpass: takes the edge off the highs
const KOTO_HZ = 2000; // the plucks' shared lowpass: a warm, tape-dark string (its attack was the mix's 2-4 kHz edge)
const KOTO_SOFT = 0.6; // how much the pluck's noise burst is smoothed (0 = raw, bright)
const DUCK_TAU = 0.25;

// voice levels (peak gain before the music bus)
const KOTO = 0.14, ARP = 0.045, PAD = 0.03, BASS = 0.15, KICK = 0.28, BRUSH = 0.06, GHOST = 0.02, HAT = 0.014;
const TAIKO = 0.2, CHIME = 0.018, ECHO_SEND = 0.35, ECHO_WET = 0.28, ECHO_FB = 0.33;

// phones and small CPUs: no arpeggio, 8th hats, one delay instead of the ping-pong, 3 pad voices, no crackle
export const MUSIC_LITE = IS_TOUCH_DEVICE || (globalThis.navigator?.hardwareConcurrency || 8) <= 4;

const mtof = (m) => 440 * 2 ** ((m - 69) / 12);
const newSeed = () => (Math.random() * 2 ** 32) >>> 0;
const heatOk = (ev, heat) => (ev.minHeat === undefined || heat >= ev.minHeat) && (ev.maxHeat === undefined || heat < ev.maxHeat);
const same = (a, b) => a && b && a.length === b.length && a.every((v, i) => v === b[i]);

// Karplus-Strong plucked string, rendered once: a soft noise burst circulating in a damped delay line. Played back
// at other rates it is the koto (and the arpeggio) across the whole melody range.
function pluckBuffer(ctx, f, dur, soft, seed) {
  const sr = ctx.sampleRate, n = Math.max(2, Math.round(sr / f - 0.5)), N = Math.floor(sr * dur);
  const buf = ctx.createBuffer(1, N, sr), out = buf.getChannelData(0), line = new Float32Array(n), R = rng(seed);
  let prev = 0, mean = 0;
  for (let i = 0; i < n; i++) { prev += (R() * 2 - 1 - prev) * (1 - soft); line[i] = prev; mean += prev / n; }
  for (let i = 0; i < n; i++) line[i] -= mean; // no DC: it would thump at the start and end of every note
  let p = 0, peak = 0;
  for (let i = 0; i < N; i++) {
    const q = p + 1 === n ? 0 : p + 1, a = line[p];
    out[i] = a;
    line[p] = 0.996 * 0.5 * (a + line[q]);
    p = q;
    peak = Math.max(peak, Math.abs(a));
  }
  const fade = Math.floor(sr * 0.08);
  for (let i = 0; i < fade; i++) out[N - 1 - i] *= i / fade;
  for (let i = 0; i < N; i++) out[i] /= peak || 1;
  return { buf, base: sr / (n + 0.5) }; // the averaging filter adds half a sample to the loop: tune with it
}

// one Track = one mood's song being performed, with its own filters and echo (tempo-synced)
class Track {
  constructor(player, mood, seed, t0) {
    const ctx = (this.ctx = player.ctx);
    this.p = player;
    this.mood = mood;
    this.M = MOODS[mood];
    this.lite = player.lite;
    this.seed = seed;
    this.song = composeSong(mood, seed, { lite: this.lite });
    this.songNo = 1;
    this.pending = null;
    this.bar = 0;
    this.step = 0;
    this.barT = t0;
    this.stepDur = 15 / this.M.bpm;
    this.swingOff = (this.M.swing - 0.5) * 2 * this.stepDur;
    this.heat = Math.min(this.M.heatCap, player.intensity);
    this.peak = player.intensity;
    this.padNotes = null;
    this.padStale = true;
    this.voices = [];
    this.nodes = [];
    this.flip = 0;
    this.endAt = Infinity;

    const keep = (n) => (this.nodes.push(n), n);
    const gain = (v) => { const g = keep(ctx.createGain()); g.gain.value = v; return g; };
    const filt = (type, f, Q = 0.7) => { const b = keep(ctx.createBiquadFilter()); b.type = type; b.frequency.value = f; b.Q.value = Q; return b; };
    const pan = (v) => {
      if (!ctx.createStereoPanner) return gain(1); // old Safari: centered
      const s = keep(ctx.createStereoPanner());
      s.pan.value = v;
      return s;
    };
    this.out = gain(0);
    this.out.gain.setValueAtTime(0, t0);
    this.out.gain.linearRampToValueAtTime(1, t0 + FADE_IN);
    this.out.connect(player.duck);
    const out = this.out, P = this.M.pad;
    this.padLP = filt('lowpass', P.cut + P.cutHeat * this.heat);
    this.padLP.connect(out);
    this.padPan = this.lite ? [this.padLP, this.padLP] : [pan(-0.3), pan(0.3)];
    if (!this.lite) for (const s of this.padPan) s.connect(this.padLP);
    this.kotoPan = [pan(-0.25), pan(0.25)];
    this.arpPan = pan(-0.35);
    this.kotoLP = filt('lowpass', KOTO_HZ, 0.5);
    this.kotoLP.connect(out);
    for (const s of [...this.kotoPan, this.arpPan]) s.connect(this.kotoLP);
    this.hatHP = filt('highpass', 7500);
    this.brushBP = filt('bandpass', 2200, 0.6);
    this.taikoLP = filt('lowpass', 600);
    for (const f of [this.hatHP, this.brushBP, this.taikoLP]) f.connect(out);

    // tempo-synced echo: ping-pong between two delays (lite: one), each tap darker than the last
    const beat = 60 / this.M.bpm;
    this.send = gain(ECHO_SEND);
    const wet = gain(ECHO_WET);
    wet.connect(out);
    const dA = keep(ctx.createDelay(2)), lA = filt('lowpass', 2000), fA = gain(ECHO_FB);
    dA.delayTime.value = 0.75 * beat;
    this.send.connect(dA).connect(lA);
    if (this.lite) {
      lA.connect(wet);
      lA.connect(fA).connect(dA);
    } else {
      const dB = keep(ctx.createDelay(2)), lB = filt('lowpass', 2000), fB = gain(ECHO_FB), pL = pan(-0.5), pR = pan(0.5);
      dB.delayTime.value = 0.5 * beat;
      lA.connect(pL).connect(wet);
      lA.connect(fA).connect(dB).connect(lB);
      lB.connect(pR).connect(wet);
      lB.connect(fB).connect(dA);
    }

    // slow tape wow on the pad (cents), and a faint vinyl hiss
    this.lfo = keep(ctx.createOscillator());
    this.lfo.frequency.value = 0.13;
    this.lfoG = gain(4);
    this.lfo.connect(this.lfoG);
    this.lfo.start(t0);
    const tex = this.M.texture;
    if (tex.hiss > 0 && player.e.noiseBuf) {
      this.hiss = keep(ctx.createBufferSource());
      this.hiss.buffer = player.e.noiseBuf;
      this.hiss.loop = true;
      const bp = filt('bandpass', 5000, 0.5), g = gain(tex.hiss);
      this.hiss.connect(bp).connect(g).connect(out);
      this.hiss.start(t0, Math.random());
    }
  }

  stepTime() {
    return this.barT + this.step * this.stepDur + (this.step & 1 ? this.swingOff : 0);
  }

  // schedule every step that starts before `until`; `emit` false (muted) keeps the clock running silently
  pump(until, emit) {
    const now = this.ctx.currentTime;
    while (this.stepTime() < now - LATE) this.advance(); // after a stall: skip ahead, never burst
    while (this.stepTime() < until) {
      if (emit) this.play(now);
      else if (this.voices.length) { this.releasePad(now, 0.1); this.padStale = true; }
      this.advance();
    }
  }

  advance() {
    if (++this.step < 16) return;
    this.step = 0;
    this.barT += 16 * this.stepDur;
    const ended = this.song.bars[this.bar++];
    if (this.pending !== null || this.bar >= this.song.bars.length) {
      // a new song carries on from the last voicing, so the pad glides across the seam
      const seed = this.pending ?? this.p.takeSeed();
      this.pending = null;
      this.song = composeSong(this.mood, seed, { lite: this.lite, prevPad: ended.pad });
      this.seed = seed;
      this.songNo++;
      this.bar = 0;
    }
    this.heat = Math.min(this.M.heatCap, this.peak);
    this.peak = this.p.intensity;
    this.padStale = true;
  }

  play(now) {
    const b = this.song.bars[this.bar], s = this.step, t = this.stepTime(), heat = this.heat;
    if (this.padStale) {
      this.padStale = false;
      this.updatePad(b, Math.max(t, now));
      const P = this.M.pad;
      this.padLP.frequency.setTargetAtTime(P.cut + P.cutHeat * heat, Math.max(t, now), 1);
    }
    if (s === 0 && !this.lite && this.M.texture.clicks > 0) {
      const n = 4 + Math.floor(Math.random() * 7); // vinyl crackle: a few random ticks per bar
      for (let i = 0; i < n; i++) this.click(t + Math.random() * 16 * this.stepDur, this.M.texture.clicks * (0.4 + 0.6 * Math.random()));
    }
    for (const ev of b.bass) if (ev.step === s) this.bass(t, ev);
    for (const ev of b.koto) if (ev.step === s) this.koto(t, ev);
    for (const ev of b.arp) if (ev.step === s && heatOk(ev, heat)) this.arp(t, ev);
    for (const ev of b.drums) if (ev.step === s && heatOk(ev, heat)) this.drum(t, ev, heat);
    for (const ev of b.chime) if (ev.step === s) this.chime(t, ev);
  }

  // ---------------------------------------------------------------- voices
  // Pad: one warm oscillator per voice; a chord that repeats is held, a new one crossfades over the old
  updatePad(b, t) {
    if (this.voices.length && same(b.pad, this.padNotes)) return;
    this.releasePad(t, 0.5);
    this.padNotes = b.pad;
    // a chord that starts mid-bar (after a stall or unmute) swells in before the next bar can release it
    const atk = Math.min(this.M.pad.attack, Math.max(0.05, (this.barT + 16 * this.stepDur - t) * 0.9));
    const ctx = this.ctx, wave = this.p.waves.pad;
    for (let i = this.lite ? 1 : 0; i < 4; i++) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.setPeriodicWave(wave);
      o.frequency.value = mtof(b.pad[i]);
      o.detune.value = i & 1 ? 7 : -7; // a gentle chorus between voices
      this.lfoG.connect(o.detune);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(PAD, t + atk);
      o.connect(g).connect(this.padPan[i & 1]);
      o.start(t);
      o.onended = () => { try { this.lfoG.disconnect(o.detune); } catch { /* already gone */ } };
      this.voices.push({ o, g });
    }
  }

  releasePad(t, tau) {
    const now = this.ctx.currentTime;
    for (const { o, g } of this.voices) {
      if (t <= now + 0.02) { // right now (mute, stop): hold the current level, then let go
        g.gain.cancelScheduledValues(now);
        g.gain.setValueAtTime(g.gain.value, now);
        t = now;
      }
      g.gain.setTargetAtTime(0, t, tau);
      try { o.stop(t + tau * 8); } catch { /* stopped */ }
    }
    this.voices.length = 0;
  }

  bass(t, ev) {
    const ctx = this.ctx, o = ctx.createOscillator(), g = ctx.createGain(), peak = BASS * ev.vel;
    const end = t + ev.len * this.stepDur;
    o.setPeriodicWave(this.p.waves.bass);
    o.frequency.value = mtof(ev.midi);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + 0.01);
    g.gain.setTargetAtTime(peak * 0.6, t + 0.01, 0.1);
    g.gain.setTargetAtTime(0, end, 0.04);
    o.connect(g).connect(this.out);
    o.start(t);
    o.stop(end + 0.3);
  }

  pluck(t, midi, level, tau, dest, bend = false) {
    const ctx = this.ctx, f = mtof(midi), k = this.p.ks[f < 370 ? 0 : 1];
    const s = ctx.createBufferSource(), g = ctx.createGain(), rate = f / k.base;
    s.buffer = k.buf;
    if (bend) { // oshide: start a semitone flat and press up into the note
      s.playbackRate.setValueAtTime(rate * 0.944, t);
      s.playbackRate.linearRampToValueAtTime(rate, t + 0.07);
    } else s.playbackRate.value = rate;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(level, t + 0.003);
    g.gain.setTargetAtTime(0, t + 0.05, tau);
    s.connect(g).connect(dest);
    g.connect(this.send);
    s.start(t);
    s.stop(t + tau * 5 + 0.1);
  }

  koto(t, ev) {
    t += (Math.random() - 0.5) * 0.01; // a human hand: +-5 ms
    const vel = ev.vel * (0.85 + 0.3 * Math.random()), tau = this.M.koto.tau, pan = this.kotoPan[(this.flip ^= 1)];
    if (ev.grace) {
      const g32 = this.stepDur / 2;
      this.pluck(t - 2 * g32, ev.grace[0], KOTO * vel * 0.45, 0.15, pan);
      this.pluck(t - g32, ev.grace[1], KOTO * vel * 0.55, 0.15, pan);
    }
    this.pluck(t, ev.midi, KOTO * vel, tau, pan, ev.bend);
  }

  arp(t, ev) {
    this.pluck(t, ev.midi, ARP * ev.vel, 0.25, this.arpPan);
  }

  noise(t, dur, dest) {
    const s = this.ctx.createBufferSource();
    s.buffer = this.p.e.noiseBuf;
    s.connect(dest);
    s.start(t, Math.random() * 1.5);
    s.stop(t + dur);
    return s;
  }

  drum(t, ev, heat) {
    const ctx = this.ctx, v = ev.vel * (ev.kind === 'kick' || ev.kind === 'taiko' ? 1 : 0.85 + 0.3 * Math.random());
    if (ev.kind === 'kick' || ev.kind === 'taiko') {
      const taiko = ev.kind === 'taiko', o = ctx.createOscillator(), g = ctx.createGain();
      const len = taiko ? 0.5 : 0.32, peak = (taiko ? TAIKO : KICK) * v;
      o.frequency.setValueAtTime(taiko ? 95 : 110, t);
      o.frequency.exponentialRampToValueAtTime(taiko ? 42 : 48, t + (taiko ? 0.3 : 0.09));
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(peak, t + 0.003);
      g.gain.exponentialRampToValueAtTime(0.0001, t + len);
      o.connect(g).connect(this.out);
      o.start(t);
      o.stop(t + len + 0.02);
      // a tiny noise tick (kick) / skin thump (taiko): phone speakers can't play the low end, they hear this
      const ng = ctx.createGain(), nd = taiko ? 0.06 : 0.004;
      ng.gain.setValueAtTime(0.0001, t);
      ng.gain.exponentialRampToValueAtTime((taiko ? 0.1 : 0.025) * v, t + 0.002);
      ng.gain.exponentialRampToValueAtTime(0.0001, t + nd + 0.01);
      ng.connect(taiko ? this.taikoLP : this.brushBP);
      this.noise(t, nd + 0.02, ng);
      return;
    }
    const g = ctx.createGain();
    if (ev.kind === 'hat') {
      t += (Math.random() - 0.5) * 0.01;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(HAT * v * (0.75 + 0.4 * heat), t + 0.001);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.036);
      g.connect(this.hatHP);
      this.noise(t, 0.05, g);
      return;
    }
    // brush snare (and its ghost notes): a swish more than a crack
    const ghost = ev.kind === 'ghost', atk = ghost ? 0.06 : 0.012;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime((ghost ? GHOST : BRUSH) * v, t + atk);
    g.gain.exponentialRampToValueAtTime(0.0001, t + atk + 0.22);
    g.connect(this.brushBP);
    this.noise(t, atk + 0.25, g);
  }

  // furin wind chime: a high sine with one inharmonic partial, sent into the echo
  chime(t, ev) {
    const ctx = this.ctx, f = mtof(ev.midi), g = ctx.createGain(), g2 = ctx.createGain();
    const o = ctx.createOscillator(), o2 = ctx.createOscillator();
    o.frequency.value = f;
    o2.frequency.value = f * 2.76;
    g2.gain.value = 0.3;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(CHIME * ev.vel, t + 0.002);
    g.gain.setTargetAtTime(0, t + 0.002, 0.8);
    o.connect(g);
    o2.connect(g2).connect(g);
    g.connect(this.out); // past the plucks' lowpass: the chime is all highs; the ping-pong echo spreads it
    g.connect(this.send);
    o.start(t); o2.start(t);
    o.stop(t + 4); o2.stop(t + 4);
  }

  click(t, level) {
    const s = this.ctx.createBufferSource(), g = this.ctx.createGain();
    s.buffer = this.p.clickBuf;
    g.gain.value = level;
    s.connect(g).connect(this.out);
    s.start(t);
  }

  // ---------------------------------------------------------------- lifecycle
  fade(dur) {
    const now = this.ctx.currentTime, g = this.out.gain;
    g.cancelScheduledValues(now);
    g.setValueAtTime(g.value, now);
    g.linearRampToValueAtTime(0, now + dur);
    this.endAt = now + dur + 0.5;
  }

  dispose() {
    this.releasePad(this.ctx.currentTime, 0.05);
    for (const n of this.nodes) {
      try { n.stop?.(); } catch { /* not started */ }
      n.disconnect();
    }
    this.nodes.length = 0;
  }
}

export class MusicPlayer {
  constructor(engine) {
    this.e = engine; // AudioEngine (or a stand-in with ctx, music, noiseBuf, muted, musicVolume)
    this.ctx = null;
    this.track = null;
    this.fading = [];
    this.mood = null;
    this.intensity = 0.2;
    this.ducks = new Set();
    this.timer = null;
    this.lite = MUSIC_LITE;
    this.seedNext = null; // ?musicSeed= / music.seed(n) with ?debug
  }

  // shared nodes and the pre-rendered koto strings, built on the first song (about 10 ms)
  ensure() {
    const ctx = this.e.ctx;
    if (!ctx) return false;
    if (this.ctx === ctx) return true;
    this.ctx = ctx;
    this.duck = ctx.createGain();
    this.tone = ctx.createBiquadFilter();
    this.tone.type = 'lowpass';
    this.tone.frequency.value = TONE_HZ;
    this.tone.Q.value = 0.5;
    this.duck.connect(this.tone).connect(this.e.music);
    this.ks = [pluckBuffer(ctx, 261.63, 2.2, KOTO_SOFT, 7), pluckBuffer(ctx, 523.25, 1.6, KOTO_SOFT, 11)];
    const wave = (imag) => ctx.createPeriodicWave(new Float32Array(imag.length), Float32Array.from(imag));
    this.waves = { pad: wave([0, 1, 0.42, 0.22, 0.12, 0.06, 0.03]), bass: wave([0, 1, 0.45, 0.2, 0.08]) };
    this.clickBuf = ctx.createBuffer(1, 64, ctx.sampleRate);
    const d = this.clickBuf.getChannelData(0), R = rng(3);
    for (let i = 0; i < 64; i++) d[i] = (R() * 2 - 1) * Math.exp(-i / 6);
    this.applyDucks(0);
    return true;
  }

  // a no-op when that mood is already playing; otherwise the old one fades out while the new one fades in
  play(mood) {
    if (!MOODS[mood]) mood = 'battle';
    if (mood === this.mood && (this.track || this.silent() || !this.e.ctx)) return;
    this.mood = mood;
    if (!this.ensure()) return;
    this.fadeOut(FADE_OUT);
    if (this.silent()) return; // MUSIC at 0%: remember the mood for when it comes back
    this.track = new Track(this, mood, this.takeSeed(), this.ctx.currentTime + 0.1);
    this.run();
  }

  stop(fade = 1.5) {
    this.mood = null;
    this.fadeOut(fade);
  }

  // the audio context arrived after a mood was asked for (no gesture yet): start it now
  wake() {
    if (this.mood && !this.track) { const m = this.mood; this.mood = null; this.play(m); }
  }

  fadeOut(dur) {
    const tr = this.track;
    if (!tr) return;
    this.track = null;
    tr.fade(dur);
    this.fading.push(tr);
    this.run();
  }

  takeSeed() {
    const s = this.seedNext ?? newSeed();
    this.seedNext = null;
    return s;
  }

  silent() {
    return !(this.e.musicVolume > 0);
  }

  run() {
    if (!this.timer) this.timer = setInterval(() => this.tick(), TICK_MS);
    this.tick();
  }

  tick() {
    const ctx = this.ctx;
    if (!ctx) return;
    const now = ctx.currentTime;
    if (this.track) this.track.pump(now + LOOKAHEAD, !this.e.muted);
    for (let i = this.fading.length - 1; i >= 0; i--) {
      if (now < this.fading[i].endAt) continue;
      this.fading[i].dispose();
      this.fading.splice(i, 1);
    }
    if (!this.track && !this.fading.length) { clearInterval(this.timer); this.timer = null; }
  }

  // 0..1 from the game (its excitement); read once per bar, so this only stores a number
  setIntensity(k) {
    this.intensity = k;
    if (this.track && k > this.track.peak) this.track.peak = k;
  }

  // the MUSIC volume changed: at 0% nothing is scheduled at all; back above it, the mood starts a new song
  onVolume(v) {
    if (v <= 0) this.fadeOut(0.3);
    else this.wake();
  }

  setDuck(id, on) {
    if (!DUCKS[id] || this.ducks.has(id) === !!on) return;
    if (on) this.ducks.add(id);
    else this.ducks.delete(id);
    this.applyDucks();
  }

  clearDucks() {
    if (!this.ducks.size) return;
    this.ducks.clear();
    this.applyDucks();
  }

  applyDucks(tau = DUCK_TAU) {
    if (!this.ctx) return;
    let gain = 1, cut = TONE_HZ;
    for (const id of this.ducks) { gain = Math.min(gain, DUCKS[id].gain); cut = Math.min(cut, DUCKS[id].cutoff); }
    const now = this.ctx.currentTime;
    if (tau > 0) {
      this.duck.gain.setTargetAtTime(gain, now, tau);
      this.tone.frequency.setTargetAtTime(cut, now, tau);
    } else {
      this.duck.gain.value = gain;
      this.tone.frequency.value = cut;
    }
  }

  // ---------------------------------------------------------------- debug (?debug: window.music)
  state() {
    const tr = this.track, b = tr?.song.bars[tr.bar];
    return {
      mood: this.mood, playing: !!tr, seed: tr?.seed ?? null, song: tr?.songNo ?? 0, section: b ? `${b.sec}${b.pass}` : null,
      bar: tr ? tr.bar : null, bars: tr?.song.bars.length ?? 0, bpm: tr?.M.bpm ?? null, heat: tr ? +tr.heat.toFixed(2) : null,
      intensity: +this.intensity.toFixed(2), ducks: [...this.ducks], volume: this.e.musicVolume, muted: !!this.e.muted,
      scheduler: !!this.timer, fading: this.fading.length, lite: this.lite, ctx: this.ctx?.state ?? 'none',
    };
  }

  // compose a new song now (it starts at the next bar)
  next(seed = null) {
    if (this.track) this.track.pending = seed ?? newSeed();
    return this.state();
  }

  seed(n) {
    this.seedNext = n >>> 0;
    if (this.track) { this.track.pending = this.seedNext; this.seedNext = null; }
    return this.state();
  }
}
