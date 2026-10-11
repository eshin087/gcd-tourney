# 0019. Chill generative lo-fi music: a seeded composer and a WebAudio performer

- Status: Proposed
- Date: 2026-10-10
- Deciders: User, Claude
- Builds on: [0001](0001-threejs-vite-browser.md) (browser, no audio files), ENG-031 / ROADMAP M5 (volume sliders)

## Context

The user found the background music "very annoying" and asked for "something chill people don't mind looped"
(their pick: lo-fi Japanese, soft koto/shamisen plucks, warm pads, a gentle beat around 80 bpm, a busier groove in
fights, ambient menus, still synthesized in the browser, long varied progressions).

The old music (`AudioEngine.startMusic`) was two hard-coded step-sequencer patterns. The fight cue ran at 148 bpm
with about 20 dry note events a second in the 0.4-3 kHz band: taiko, narrow 2.2 kHz shime clicks, a saw bass, a
triangle melody doubled an octave up and a square arpeggio. It repeated exactly every 6.5 s (the menu cue every
2.5 s), and every match restarted it from step 0. It had no harmony, no space, no volume setting, no crossfade, no
ducking under pause, clashes or KO, and a scheduler that played every missed note at once after a main-thread stall.

## Decision

### 1. A pure composer and a cheap performer

- `src/core/musicPlan.js` (no WebAudio, tested in Node by `npm run test:music`): `composeSong(mood, seed)` writes a
  whole song as data, bar by bar: a 4-voice pad voicing, soft bass, a koto melody, an arpeggio, brushed drums and
  furin chimes, each event with optional `minHeat` / `maxHeat` gates. A seed always gives the same song.
- `src/core/music.js`: `MusicPlayer` performs it with a 50 ms lookahead scheduler (0.3 s ahead, 16th steps). Every
  note is a short-lived source + gain into persistent per-track filters (no per-note filters, no ConvolverNode, no
  AudioWorklet), so a hot fight bar costs about 36 nodes a second and at most about 35 sources play at once.
- `AudioEngine` keeps `startMusic(mood)` / `stopMusic()` and delegates; a mood already playing is a no-op, so the
  title, rematch and character-select calls no longer restart it.

### 2. Moods (plain data in `MOODS`; tune numbers there)

| mood | where | tempo | key / scale | form | layers |
|---|---|---|---|---|---|
| `menu` "dojo at dusk" | title, menus, results | 72 bpm, swing 0.54 | D, yo scale | A A B A, 32 bars, ~107 s | pad, koto, whole-note bass, furin chimes; a soft beat only in B |
| `battle` "tournament grounds" | matches | 86 bpm, swing 0.56 | A minor pentatonic | I A B A K B A, 48 bars, ~134 s | pad + bass intro, koto, brushed lo-fi groove, arpeggio in B (and when hot), a soft taiko on section downbeats, a hats-and-taiko breakdown |
| `training` "practice room" | training room, lab | 80 bpm | as battle | as battle | never busier than a warm-up (heat cap 0.45), no taiko |

- Harmony is maj7/maj9/6-9/m7/m9/m11/7sus4/sus2 pad shapes, voice-led (the voicing that moves least, every voice
  within 7 semitones). Repeat passes swap chords (for example V7sus4 to bVIImaj7) by chance.
- Each section gets a 2-bar motif per song (rhythm cells, a contour, a start degree): stated, repeated over the new
  chords with a changed ending, answered, then a cadence. Weak steps avoid a scale tone a semitone above a chord
  tone. About 12% of long notes get an oshide bend, about 8% of phrases a koto flick.
- Every song is new: a fresh seed per mood change, a transposition of 0 / ±2 / ±3 semitones, and the next song
  composed seamlessly (the pad glides on from the last voicing). Pad 165-494 Hz and melody 220-740 Hz in every key,
  so phone speakers hear everything; the bass wave's harmonics carry the low end there.
- Fights keep a soft beat (the user's choice): kick, a brushed snare, quiet hats; a half-time version while the
  fight is calm.

### 3. Intensity, ducks, volume

- **Intensity**: `audio.setMusicIntensity(k)` gets `game.excite` every frame during a fight (0.2 otherwise) and only
  stores a number; the performer reads the peak of the last bar at each bar line. Heat opens the full groove
  (≥ 0.3), the arpeggio outside B (≥ 0.6), 16th hats (≥ 0.7), extra taiko (≥ 0.75) and 16th arpeggio (≥ 0.8), and
  brightens the pad.
- **Ducks** (`DUCKS`): pause (gain 0.5, lowpass 1200 Hz), rhythm clash (0.3, 900 Hz: its metronome runs on another
  tempo), KO (0.45, 2000 Hz, until the winner's pose), domain (0.6, 600 Hz). The lowest active one wins;
  `Game.resetRound` and `cleanupMatch` clear them all.
- **Mood changes** crossfade: the old song fades out over 2 s while the new one fades in over 1.5 s.
- **MUSIC volume**: a row in both pause menus (match pause, and training pause right before EXIT TRAINING), 10% steps
  with a squared fader, default 70%, saved as `gcd.musicVol`. At 100% it is about as loud overall as the old music;
  the default is 6 dB under that, with 4 dB less at 1-2 kHz than the old loop and no more at 2-4 kHz (offline
  renders). At 0% nothing is scheduled at all. `M` still mutes everything; while muted the clock runs and no
  notes are built.
- **Texture**: a very faint vinyl hiss and a few random crackle ticks per bar (half the first proposal's level, on
  the coordinator's call), a 5.2 kHz lowpass on the whole mix, a 2 kHz lowpass on the plucks, a tempo-synced
  ping-pong echo, swing and ±5 ms timing jitter.

### 4. Robustness

- **No burst after a stall**: a step more than 80 ms late is skipped, never played late.
- A hidden tab suspends the audio context. On return it resumes any context that has ever run, also one iOS left
  'interrupted' or suspended (a call, Siri, an app switch), never one still waiting for its first gesture. Every
  pointerdown, touchend and keydown calls `audio.init()`, which resumes a context that is not running, so a resume the
  browser refuses outside a gesture comes back on the next tap.
- **Lite mode** (touch devices or 4 cores or fewer): no arpeggio, 8th hats only, one delay instead of the ping-pong,
  3 pad voices, no crackle; about half the nodes.

## Alternatives considered

- **Retune the old sequencer** (slower, quieter, no clicks): still a short exact loop of raw oscillators, no
  crossfade or volume.
- **Pre-render whole songs with OfflineAudioContext**: zero scheduling cost, but about 46 MB per 2-minute stereo
  song (too much for phones) and no reaction to the fight.
- **AudioWorklet synthesis**: more expressive, but more code and heavier on phones; pre-rendered Karplus-Strong
  buffers (2 renders, about 10 ms, 0.7 MB) give most of the tone for almost no CPU.
- **Recorded or licensed tracks**: best fidelity, but they break "no audio files" (ADR 0001), need licensing, and
  belong to ENG-031 / M5. The volume / duck / crossfade API stays when samples replace the synth.
- **Beatless ambient fights**: the most chill, but fights lose momentum; the user chose a soft beat.

## Consequences

- Taste is subjective: the numbers live in `MOODS` / `DUCKS` and the voice constants at the top of `music.js`, and
  `?debug` exposes `music.state()`, `music.next()` and `music.seed(n)` (plus `?musicSeed=N`) to compare songs.
- `npm run test:music` guards the composer (determinism, variety, ranges, voice leading, heat gates); the performer
  is checked by an OfflineAudioContext render (docs/TESTING.md, Audio).
- ENG-031 keeps sample-based SFX / music and an SFX volume; the music volume ships here.
