// Pure, seeded music composer (ADR 0019). No WebAudio here, so tools/test-music.mjs can check it in Node.
// composeSong() writes a whole song as data (pad chords, soft bass, koto melody, arpeggio, brushed drums, furin
// chimes); src/core/music.js performs it bar by bar. Every song is new (a fresh seed per mood change, and a new
// one each time a song ends), so nothing loops: tune the music in MOODS, not in the performer.

// mulberry32, the same generator as clash.js: a seed always writes the same song (?musicSeed= with ?debug)
export const rng = (seed) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
const pick = (R, a) => a[Math.floor(R() * a.length)];
const mod12 = (m) => ((m % 12) + 12) % 12;

// Pad shapes, 4 voices in semitones above the chord root. Mostly rootless (the bass plays the root): the 9ths and
// 11ths are what make it sound warm and lo-fi instead of plain triads.
export const CHORD = {
  maj7: [0, 4, 7, 11],
  maj9: [4, 7, 11, 14],
  '69': [4, 7, 9, 14],
  m7: [0, 3, 7, 10],
  m9: [3, 7, 10, 14],
  m11: [3, 7, 10, 17],
  '7sus4': [5, 7, 10, 14],
  sus2: [0, 2, 7, 12], // 3 pitch classes: voiceLead doubles one in another octave
};

// Melody rhythm cells (16th positions in a bar); [] is a breath
const MENU_CELLS = [[0, 6], [0, 3, 8], [2, 8, 10], [0, 10], [4, 7, 12], [0], []];
const BATTLE_CELLS = [[0, 3, 6, 10], [0, 2, 7, 10, 12], [2, 6, 8, 14], [0, 3, 8, 11, 14], [0, 6, 10], [0, 8], []];

// Battle grooves (16th steps). One per section; HALF replaces it while the fight is calm (heat under 0.3).
const GROOVES = [
  { kick: [0, 10], brush: [4, 12], ghost: [7, 15] },
  { kick: [0, 7, 10], brush: [4, 12], ghost: [] },
  { kick: [0, 3, 10], brush: [4, 12], ghost: [14] },
];
const HALF = { kick: [0], brush: [8] };
const HAT_VEL = [1, 0.55, 0.8, 0.55];
const CALM = 0.3; // heat under this plays the half-time groove
const HOT_HATS = 0.7; // 16th hats
const HOT_ARP = 0.6; // the arpeggio outside B sections
const HOT_ARP16 = 0.8;
const HOT_TAIKO = 0.75;

// Mood table. Chords are [semitones above the key, shape]; subs swap a chord on repeat passes ([root, shape, chance]).
// layers per section: koto (melody), drums ('groove' | 'breakdown' | 'menu' | null), arp ('always' | 'heat' | false),
// bass ('groove' | 'whole'). heatCap limits how busy the fight intensity may make it.
const BATTLE = {
  name: 'tournament grounds',
  bpm: 86,
  swing: 0.56,
  key: 45, // A2
  scale: [0, 3, 5, 7, 10], // A minor pentatonic: no semitone rubs
  padLo: 52, padHi: 71, // pad 165-494 Hz and melody 220-740 Hz in every key: phone speakers hear all of it
  melLo: 57, melHi: 76,
  bassLo: 33, // A1..G#2 (the bass wave's harmonics carry it on small speakers)
  sections: {
    I: [[0, 'm9'], [0, 'm9'], [8, 'maj7'], [10, 'sus2']],
    A: [[0, 'm9'], [0, 'm9'], [8, 'maj7'], [8, 'maj7'], [5, 'm9'], [7, 'm7'], [8, 'maj9'], [10, 'sus2']],
    B: [[8, 'maj9'], [7, 'm7'], [5, 'm9'], [3, 'maj7'], [8, 'maj9'], [7, 'm7'], [5, 'm11'], [7, '7sus4']],
    K: [[5, 'm9'], [5, 'm9'], [0, 'm9'], [0, 'm9']],
  },
  form: ['I', 'A', 'B', 'A', 'K', 'B', 'A'], // 48 bars, about 134 s
  subs: { '7:m7': [7, '7sus4', 0.3], '3:maj7': [3, '69', 0.3], '0:m9': [0, 'm11', 0.4], '10:sus2': [10, '69', 0.4] },
  cells: BATTLE_CELLS,
  playBar: 0.75, // chance an answering bar of the melody plays (the rest is breathing room)
  layers: {
    I: { koto: false, drums: null, arp: false, bass: 'whole' },
    A: { koto: true, drums: 'groove', arp: 'heat', bass: 'groove' },
    B: { koto: true, drums: 'groove', arp: 'always', bass: 'groove' },
    K: { koto: true, drums: 'breakdown', arp: 'heat', bass: 'whole' },
  },
  chime: 0,
  taiko: true,
  heatCap: 1,
  pad: { attack: 0.9, cut: 1100, cutHeat: 700 },
  koto: { tau: 0.4 }, // a shorter ring: more shamisen bite in fights
  texture: { hiss: 0.00075, clicks: 0.0025 }, // vinyl hiss and crackle: barely there
};

export const MOODS = {
  // 'dojo at dusk': slow, open, no drums until the B section; furin chimes
  menu: {
    name: 'dojo at dusk',
    bpm: 72,
    swing: 0.54,
    key: 50, // D3
    scale: [0, 2, 5, 7, 9], // yo scale: D E G A B
    padLo: 52, padHi: 71,
    melLo: 62, melHi: 81,
    bassLo: 33,
    sections: {
      A: [[5, 'maj9'], [4, 'm7'], [2, 'm9'], [7, '7sus4'], [0, 'maj9'], [9, 'm9'], [2, 'm9'], [7, '7sus4']],
      B: [[9, 'm9'], [5, 'maj9'], [0, '69'], [5, 'maj7'], [2, 'm11'], [4, 'm7'], [5, 'maj9'], [7, '7sus4']],
    },
    form: ['A', 'A', 'B', 'A'], // 32 bars, about 107 s
    subs: { '7:7sus4': [10, 'maj7', 0.3], '0:maj9': [0, '69', 0.4], '9:m9': [9, 'm11', 0.4], '2:m9': [2, 'm11', 0.4] },
    cells: MENU_CELLS,
    playBar: 0.6,
    layers: {
      A: { koto: true, drums: null, arp: false, bass: 'whole' },
      B: { koto: true, drums: 'menu', arp: 'always', bass: 'whole' },
    },
    chime: 0.25, // furin wind chime: chance per bar
    taiko: false,
    heatCap: 0.2,
    pad: { attack: 1.4, cut: 900, cutHeat: 0 },
    koto: { tau: 0.5 },
    texture: { hiss: 0.0015, clicks: 0.005 },
  },
  battle: BATTLE,
  // the practice room: the fight's harmony, a little slower, never busier than a warm-up, no taiko
  training: { ...BATTLE, name: 'practice room', bpm: 80, heatCap: 0.45, taiko: false },
};

// Music ducks, applied after every track: the effective gain / cutoff is the lowest of the active ones
export const DUCKS = {
  pause: { gain: 0.5, cutoff: 1200 },
  clash: { gain: 0.3, cutoff: 900 }, // a rhythm clash plays its own metronome on another tempo
  ko: { gain: 0.45, cutoff: 2000 },
  domain: { gain: 0.6, cutoff: 600 },
};

const TRANSPOSE = [0, 0, 2, -2, 3, -3];
const CONTOURS = ['up', 'down', 'arch'];
// the midi note with pitch class pc at or below (side -1) / at or above (+1) m, moved by octaves into [lo, hi]
// (the range spans more than an octave, so there always is one)
const pcNear = (m, pc, lo, hi, side) => {
  let c = side < 0 ? m - mod12(m - pc) : m + mod12(pc - m);
  while (c < lo) c += 12;
  while (c > hi) c -= 12;
  return c;
};

const PERMS = (() => {
  const out = [];
  const go = (a, rest) => (rest.length ? rest.forEach((x, i) => go([...a, x], rest.filter((_, j) => j !== i))) : out.push(a));
  go([], [0, 1, 2, 3]);
  return out;
})();

// Voice leading: the next chord's voicing that moves the previous one least (every assignment of chord tones to
// voices, each voice to the nearest octave below or above, two voices on one note penalized). A pad that glides
// between chords is most of what makes this sound calm.
export function voiceLead(prev, pcs, lo, hi) {
  const from = prev ?? [lo + 3, lo + 7, lo + 11, lo + 15];
  let best = null, bestCost = Infinity;
  const cand = [0, 0, 0, 0];
  const pickFor = (perm, i, cost) => {
    if (cost >= bestCost) return;
    if (i === 4) {
      const out = cand.slice().sort((a, b) => a - b);
      let c = cost;
      for (let k = 1; k < 4; k++) if (out[k] === out[k - 1]) c += 8;
      if (c < bestCost) { bestCost = c; best = out; }
      return;
    }
    const pc = pcs[perm[i]];
    const lo1 = pcNear(from[i], pc, lo, hi, -1), hi1 = pcNear(from[i], pc, lo, hi, 1);
    for (const m of lo1 === hi1 ? [lo1] : [lo1, hi1]) {
      cand[i] = m;
      pickFor(perm, i + 1, cost + Math.abs(m - from[i]));
    }
  };
  for (const perm of PERMS) pickFor(perm, 0, 0);
  return best;
}

// scale tones (midi) inside [lo, hi]
const scaleNotes = (pcs, lo, hi) => {
  const out = [];
  for (let m = lo; m <= hi; m++) if (pcs.includes(mod12(m))) out.push(m);
  return out;
};
const nearest = (pool, target) => pool.reduce((a, b) => (Math.abs(b - target) < Math.abs(a - target) ? b : a));

// Compose one song for a mood. `prevPad`: the last voicing of the song before, so the next one glides in.
// `lite` (phones): no arpeggio and no 16th hats.
export function composeSong(moodId, seed, { lite = false, prevPad = null } = {}) {
  const M = MOODS[moodId] || MOODS.battle;
  const R = rng(seed);
  const transpose = pick(R, TRANSPOSE);
  const key = M.key + transpose;
  const scalePcs = M.scale.map((s) => mod12(key + s));
  const melPool = scaleNotes(scalePcs, M.melLo, M.melHi);
  const chimePool = scaleNotes(scalePcs, 90, 100); // furin: 1.5-2.6 kHz
  const motifs = {}, passes = {};
  const bars = [];
  let prev = prevPad;
  for (const sec of M.form) {
    const pass = (passes[sec] = (passes[sec] ?? -1) + 1);
    const L = M.layers[sec];
    // a section's motif is written once per song, so A sounds like A when it comes back
    const mo = (motifs[sec] ??= { cells: [pick(R, M.cells), pick(R, M.cells)], contour: pick(R, CONTOURS), start: Math.floor(R() * 5) });
    const groove = pick(R, GROOVES);
    const chords = M.sections[sec];
    const shift = pass > 0 && R() < 0.5 ? (R() < 0.5 ? 1 : -1) : 0; // a repeat pass sits a step higher or lower
    chords.forEach(([root, q], bi) => {
      const sub = M.subs[`${root}:${q}`];
      if (sub && pass > 0 && R() < sub[2]) [root, q] = sub;
      const r = key + root;
      const pcs = CHORD[q].map((i) => mod12(r + i));
      const pad = voiceLead(prev, pcs, M.padLo, M.padHi);
      prev = pad;
      const bassRoot = M.bassLo + mod12(r - M.bassLo);
      const bar = { sec, pass, bi, first: bi === 0, last: bi === chords.length - 1, root: mod12(r), q, pad, bassRoot, bass: [], koto: [], arp: [], drums: [], chime: [] };

      // ---- bass
      if (L.bass === 'whole') bar.bass.push({ step: 0, midi: bassRoot, len: 16, vel: 0.9 });
      else {
        bar.bass.push({ step: 0, midi: bassRoot, len: 6, vel: 1 });
        if (R() < 0.5) bar.bass.push({ step: 7, midi: bassRoot, len: 2, vel: 0.7 });
        else bar.bass.push({ step: 10, midi: bassRoot + 7 <= M.bassLo + 14 ? bassRoot + 7 : bassRoot - 5, len: 3, vel: 0.75 });
        if (R() < 0.5) bar.approach = true; // filled in once the next bar's root is known
      }

      // ---- koto melody: bars 1-2 state the motif, 3-4 repeat it refit to the new chords with a changed ending,
      // 5-6 answer with fresh cells, 7-8 cadence on a long chord tone
      if (L.koto) {
        const phase = bi % 8;
        let cell = phase < 4 ? mo.cells[phase % 2] : phase < 6 ? pick(R, M.cells) : phase === 6 ? [0, 8] : [0];
        if (phase % 2 === 1 && R() > M.playBar) cell = [];
        const chordPcs = [...pcs, mod12(r)];
        // weak steps avoid a scale tone a semitone above a chord tone (the b9 rub that made the old loop grate)
        const strong = melPool.filter((m) => chordPcs.includes(mod12(m)));
        let weak = melPool.filter((m) => !chordPcs.some((c) => mod12(m - c) === 1));
        if (!weak.length) weak = strong;
        // degrees count scale tones up from melLo; the contour walks them, strong steps snap to a chord tone
        let deg = 1 + mo.start + shift + (phase >= 4 && phase < 6 ? (R() < 0.5 ? 2 : -2) : 0);
        if (phase >= 6) deg = 2; // cadences settle low
        const n = cell.length;
        let last = null;
        cell.forEach((st, i) => {
          const c = mo.contour, dir = c === 'up' ? 1 : c === 'down' ? -1 : i < n / 2 ? 1 : -1;
          let d = deg + (c === 'up' ? i : c === 'down' ? -i : i < n / 2 ? i : n - 1 - i);
          if (phase === 3 && i === n - 1) d += R() < 0.5 ? 2 : -2; // the repeat ends differently
          const target = melPool[Math.max(0, Math.min(melPool.length - 1, d))];
          const pool = st % 4 === 0 ? (strong.length ? strong : melPool) : weak;
          let midi = nearest(pool, target);
          if (midi === last) { // the line moves: a repeated note steps on to the pool's next tone the contour's way
            const k = pool.indexOf(midi) + dir;
            if (k >= 0 && k < pool.length) midi = pool[k];
          }
          last = midi;
          const len = phase === 7 ? 12 : Math.min(8, (i + 1 < n ? cell[i + 1] : 16) - st);
          const ev = { step: st, midi, len, vel: (st % 4 === 0 ? 0.85 : 0.68) * (0.88 + 0.12 * R()) };
          if (len >= 4 && R() < 0.12) ev.bend = true; // oshide: a pressed-string scoop into the note
          if (i === 0 && phase % 2 === 0 && R() < 0.08) {
            const below = melPool.filter((m) => m < midi);
            ev.grace = [midi - 12, below.length ? below[below.length - 1] : midi - 12]; // a quick koto flick
          }
          bar.koto.push(ev);
        });
      }

      // ---- arpeggio: chord tones up and down in 8ths (16ths when the fight is hot)
      // (layers a mood's heatCap can never reach are left out)
      if (!lite && (L.arp === 'always' || (L.arp === 'heat' && M.heatCap >= HOT_ARP))) {
        const order = [0, 1, 2, 3, 2, 1, 0, 1];
        const minHeat = L.arp === 'always' ? undefined : HOT_ARP;
        for (let k = 0; k < 8; k++) bar.arp.push({ step: k * 2, midi: pad[order[k]], vel: k % 2 ? 0.6 : 0.8, minHeat });
        if (M.heatCap >= HOT_ARP16) for (let k = 0; k < 8; k++) bar.arp.push({ step: k * 2 + 1, midi: pad[order[(k + 3) % 8]], vel: 0.45, minHeat: HOT_ARP16 });
      }

      // ---- drums
      const D = bar.drums;
      const hats = (vel, cut) => {
        for (let s = 0; s < cut; s += 2) D.push({ step: s, kind: 'hat', vel: vel * HAT_VEL[(s / 2) % 4] * (0.85 + 0.15 * R()) });
        if (!lite && M.heatCap >= HOT_HATS) for (let s = 1; s < cut; s += 2) D.push({ step: s, kind: 'hat', vel: vel * 0.35 * (0.85 + 0.15 * R()), minHeat: HOT_HATS });
      };
      const fill = () => {
        if (M.taiko && R() < 0.35) { D.push({ step: 12, kind: 'taiko', vel: 0.55 }, { step: 14, kind: 'taiko', vel: 0.75 }); return; }
        for (let s = 12; s < 16; s++) D.push({ step: s, kind: 'brush', vel: 0.3 + ((s - 12) / 3) * 0.5 });
      };
      if (L.drums === 'groove') {
        const cut = bar.last ? 12 : 16; // a section's last bar ends on a fill
        for (const s of groove.kick) if (s < cut) D.push({ step: s, kind: 'kick', vel: s === 0 ? 1 : 0.8, minHeat: CALM });
        for (const s of groove.brush) if (s < cut) D.push({ step: s, kind: 'brush', vel: 0.9, minHeat: CALM });
        for (const s of groove.ghost) if (s < cut) D.push({ step: s, kind: 'ghost', vel: 1, minHeat: CALM });
        for (const s of HALF.kick) D.push({ step: s, kind: 'kick', vel: 0.9, maxHeat: CALM });
        for (const s of HALF.brush) if (s < cut) D.push({ step: s, kind: 'brush', vel: 0.85, maxHeat: CALM });
        hats(1, cut);
        if (bar.last) fill();
        // soft taiko: the game's identity, on a section's downbeat and, when the fight is hot, every other bar
        if (M.taiko && bar.first) D.push({ step: 0, kind: 'taiko', vel: 0.8 });
        else if (M.taiko && bi % 2 === 0 && M.heatCap >= HOT_TAIKO) D.push({ step: 0, kind: 'taiko', vel: 0.6, minHeat: HOT_TAIKO });
      } else if (L.drums === 'breakdown') {
        hats(0.7, 16);
        if (M.taiko && bi % 2 === 0) D.push({ step: 0, kind: 'taiko', vel: 0.7 });
        else if (!M.taiko) D.push({ step: 0, kind: 'kick', vel: 0.6 });
      } else if (L.drums === 'menu') {
        D.push({ step: 0, kind: 'kick', vel: 0.6 }, { step: 10, kind: 'kick', vel: 0.6 }, { step: 12, kind: 'brush', vel: 0.7 });
        for (const s of [0, 4, 8, 12]) D.push({ step: s, kind: 'hat', vel: 0.6 * (0.85 + 0.15 * R()) });
      }

      // ---- furin chime
      if (M.chime && R() < M.chime) bar.chime.push({ step: Math.floor(R() * 16), midi: pick(R, chimePool), vel: 0.7 + 0.3 * R() });

      bars.push(bar);
    });
  }
  // bass approach notes lead into the next bar's root by a scale step
  const bassPcs = scalePcs;
  bars.forEach((b, i) => {
    if (!b.approach) return;
    delete b.approach;
    const next = bars[i + 1]?.bassRoot ?? bars[0].bassRoot;
    const cands = [];
    for (let m = next - 3; m <= next + 3; m++) if (m !== next && bassPcs.includes(mod12(m))) cands.push(m);
    if (!cands.length) return;
    const side = next >= b.bassRoot ? -1 : 1; // approach from the side the bass comes from
    const own = cands.filter((m) => Math.sign(m - next) === side);
    const midi = nearest(own.length ? own : cands, next);
    b.bass.push({ step: 14, midi, len: 2, vel: 0.6 });
  });
  return { mood: MOODS[moodId] ? moodId : 'battle', seed: seed >>> 0, bpm: M.bpm, swing: M.swing, transpose, bars };
}
