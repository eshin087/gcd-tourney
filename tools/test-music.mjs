#!/usr/bin/env node
// Regression test for the generative music composer (src/core/musicPlan.js, ADR 0019).
//   npm run test:music            (add -- --print to print one song per mood)
// The composer is pure data, so this runs in Node with no audio: same seed -> same song, songs vary across
// seeds, melody and pad stay in their scales and phone-friendly ranges, the pad glides (small voice-leading
// leaps), the battle intro has no drums, tempos stay chill, and heat-gated layers only exist where a mood can
// reach them. The performer (src/core/music.js) is checked in the browser (docs/TESTING.md, Audio).

import { composeSong, MOODS, CHORD, DUCKS, voiceLead } from '../src/core/musicPlan.js';

const PRINT = process.argv.includes('--print');
let failures = 0, passes = 0;
const check = (ok, msg) => {
  if (ok) passes++;
  else { failures++; console.log(`  FAIL ${msg}`); }
};
const mod12 = (m) => ((m % 12) + 12) % 12;
const SEEDS = Array.from({ length: 20 }, (_, i) => (i + 1) * 7919 + 13);
const NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const hz = (m) => Math.round(440 * 2 ** ((m - 69) / 12));

for (const mood of Object.keys(MOODS)) {
  const M = MOODS[mood];
  console.log(`${mood} (${M.name}, ${M.bpm} bpm)`);
  check(M.bpm >= 70 && M.bpm <= 90, `${mood}: bpm ${M.bpm} outside 70-90`);
  check(M.swing >= 0.5 && M.swing < 0.6, `${mood}: swing ${M.swing}`);

  // determinism
  const a = composeSong(mood, 12345), b = composeSong(mood, 12345);
  check(JSON.stringify(a) === JSON.stringify(b), `${mood}: same seed gives a different song`);
  check(JSON.stringify(a) !== JSON.stringify(composeSong(mood, 54321)), `${mood}: two seeds give the same song`);

  const songBars = M.form.reduce((n, s) => n + M.sections[s].length, 0);
  const songSec = (songBars * 240) / M.bpm;
  check(songSec >= 90, `${mood}: a song lasts only ${songSec.toFixed(0)} s`);

  const windows = new Set();
  let total = 0, maxLeap = 0, padLo = 99, padHi = 0, melLo = 99, melHi = 0, notes = 0, outOfScale = 0;
  let introDrums = 0, badPad = 0, badEvents = 0, unreachable = 0, approach = 0;
  const reach = (ev) => ev.minHeat === undefined || ev.minHeat <= M.heatCap;
  let prevSongLastPad = null;
  for (const seed of SEEDS) {
    for (const lite of [false, true]) {
      const s = composeSong(mood, seed, { lite, prevPad: prevSongLastPad });
      check(s.bars.length === songBars, `${mood} seed ${seed}: ${s.bars.length} bars, want ${songBars}`);
      const key = M.key + s.transpose;
      const scale = M.scale.map((x) => mod12(key + x));
      s.bars.forEach((bar, i) => {
        if (bar.pad.length !== 4 || bar.pad.some((m) => !Number.isInteger(m))) badPad++;
        const pcs = CHORD[bar.q].map((x) => mod12(bar.root + x));
        if (bar.pad.some((m) => !pcs.includes(mod12(m)))) badPad++;
        const prevPad = i ? s.bars[i - 1].pad : prevSongLastPad;
        if (prevPad) maxLeap = Math.max(maxLeap, ...bar.pad.map((m, k) => Math.abs(m - prevPad[k])));
        for (const m of bar.pad) { padLo = Math.min(padLo, m); padHi = Math.max(padHi, m); }
        for (const ev of bar.koto) {
          notes++;
          melLo = Math.min(melLo, ev.midi); melHi = Math.max(melHi, ev.midi);
          if (!scale.includes(mod12(ev.midi))) outOfScale++;
        }
        for (const ev of bar.bass) if (ev.step === 14) approach++;
        if (bar.sec === 'I') introDrums += bar.drums.filter((d) => ['kick', 'brush', 'ghost', 'hat'].includes(d.kind)).length;
        if (lite && (bar.arp.length || bar.drums.some((d) => d.kind === 'hat' && d.minHeat))) badEvents++;
        for (const list of [bar.bass, bar.koto, bar.arp, bar.drums, bar.chime]) {
          for (const ev of list) {
            if (!(ev.step >= 0 && ev.step < 16) || !(ev.vel > 0 && ev.vel <= 1.0001)) badEvents++;
            if ('midi' in ev && !Number.isFinite(ev.midi)) badEvents++;
            if (!reach(ev)) unreachable++;
          }
        }
      });
      if (!lite) {
        for (let i = 0; i + 8 <= s.bars.length; i += 8) {
          total++;
          windows.add(JSON.stringify(s.bars.slice(i, i + 8).map((x) => [x.root, x.q, x.koto.map((e) => [e.step, e.midi])])));
        }
      }
      prevSongLastPad = s.bars[s.bars.length - 1].pad; // the next song glides in from here
    }
  }
  const distinct = windows.size / total;
  console.log(`  ${songBars} bars = ${songSec.toFixed(0)} s; distinct 8-bar windows ${windows.size}/${total}; max pad leap ${maxLeap}; ` +
    `pad ${hz(padLo)}-${hz(padHi)} Hz; melody ${hz(melLo)}-${hz(melHi)} Hz (${notes} notes); bass approaches ${approach}`);
  check(distinct >= 0.95, `${mood}: only ${(distinct * 100).toFixed(0)}% distinct 8-bar windows`);
  check(maxLeap <= 7, `${mood}: pad voice leaps ${maxLeap} semitones`);
  check(padLo >= M.padLo && padHi <= M.padHi, `${mood}: pad ${padLo}-${padHi} outside ${M.padLo}-${M.padHi}`);
  check(melLo >= M.melLo && melHi <= M.melHi, `${mood}: melody ${melLo}-${melHi} outside ${M.melLo}-${M.melHi}`);
  check(outOfScale === 0, `${mood}: ${outOfScale} melody notes outside the scale`);
  check(notes > songBars * SEEDS.length, `${mood}: only ${notes} melody notes`);
  check(introDrums === 0, `${mood}: ${introDrums} drum events in the intro`);
  check(badPad === 0, `${mood}: ${badPad} bars with a wrong pad`);
  check(badEvents === 0, `${mood}: ${badEvents} malformed events (or lite layers)`);
  check(unreachable === 0, `${mood}: ${unreachable} events gated above the mood's heat cap`);

  if (PRINT) {
    for (const bar of a.bars.slice(0, 16)) {
      console.log(`    ${bar.sec}${bar.pass} ${NAMES[bar.root]}${bar.q.padEnd(6)} pad ${bar.pad.join(' ')} | koto ${bar.koto.map((e) => `${e.step}:${e.midi}`).join(' ')} | drums ${bar.drums.length}`);
    }
  }
}

// battle keeps a soft beat (the user's choice); the intro breathes, the groove has a calm half-time variant
{
  const s = composeSong('battle', 99);
  const A = s.bars.find((b) => b.sec === 'A');
  check(A.drums.some((d) => d.kind === 'kick' && d.maxHeat), 'battle: no half-time groove for calm moments');
  check(A.drums.some((d) => d.kind === 'kick' && d.minHeat), 'battle: no full groove');
  check(s.bars.some((b) => b.drums.some((d) => d.kind === 'taiko')), 'battle: no taiko accent');
  const T = composeSong('training', 99);
  check(!T.bars.some((b) => b.drums.some((d) => d.kind === 'taiko')), 'training: taiko should be off');
  const menu = composeSong('menu', 99);
  check(menu.bars.some((b) => b.chime.length), 'menu: no furin chimes');
  check(!menu.bars.some((b) => b.sec === 'A' && b.drums.length), 'menu: drums in the A section');
}

// voice leading from scratch and with a doubled pitch class (sus2) stays in range with 4 distinct notes
{
  const v = voiceLead(null, [9, 0, 4, 7], 52, 71);
  check(v.length === 4 && v.every((m) => m >= 52 && m <= 71), `voiceLead from scratch: ${v}`);
  const d = voiceLead([55, 59, 62, 66], CHORD.sus2.map((x) => mod12(43 + x)), 52, 71);
  check(new Set(d).size === 4, `voiceLead sus2 doubles into a unison: ${d}`);
}

for (const [id, D] of Object.entries(DUCKS)) check(D.gain > 0 && D.gain < 1 && D.cutoff >= 400, `duck ${id}: ${JSON.stringify(D)}`);

console.log(`${failures ? 'FAILED' : 'OK'}: ${passes} passed, ${failures} failed`);
process.exitCode = failures ? 1 : 0;
