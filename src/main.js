import { PixelRenderer } from './core/renderer.js';
import { InputManager } from './core/input.js';
import { audio } from './core/audio.js';
import { Game } from './game/game.js';
import { TouchControls, IS_TOUCH_DEVICE } from './core/touch.js';
import { HIT_FLASH } from './game/moves.js';

const renderer = new PixelRenderer(document.getElementById('app'));
const input = new InputManager();
if (IS_TOUCH_DEVICE) input.lastDevice = 'touch'; // phones start with the on-screen controls
const game = new Game(renderer, input);
window.game = game; // handy for debugging in the console

// ---------------------------------------------------------------- touch / mobile
const touch = new TouchControls({ onPause: () => game.pauseFromTouch() });
input.touch = touch;
game.touch = touch;
window.addEventListener('touchstart', () => input.setDevice('touch'), { capture: true, passive: true });
// tap the game view to skip the pre-fight intro (there is no Enter key on a phone)
document.getElementById('app').addEventListener('pointerdown', () => game.tapSkip());

// Fullscreen + landscape lock on the first touch (Android; iOS Safari has no fullscreen API for
// pages: Add to Home Screen gives a fullscreen landscape app via the web manifest instead).
const canFullscreen = !!document.documentElement.requestFullscreen && document.fullscreenEnabled;
const enterFullscreen = () => {
  if (document.fullscreenElement || !canFullscreen) return;
  document.documentElement.requestFullscreen({ navigationUI: 'hide' })
    .then(() => screen.orientation?.lock?.('landscape'))
    .catch(() => {});
};
if (IS_TOUCH_DEVICE) {
  window.addEventListener('pointerdown', (e) => { if (e.pointerType === 'touch') enterFullscreen(); }, { once: true });
  if (canFullscreen) {
    const fs = document.createElement('button');
    fs.id = 'fs';
    fs.setAttribute('aria-label', 'Toggle fullscreen');
    fs.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
    fs.addEventListener('click', (e) => {
      e.stopPropagation();
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      else enterFullscreen();
    });
    document.body.append(fs);
  }
}

// first interaction unlocks audio, and every later one resumes a context iOS left 'interrupted' (a call mid-match);
// init() is only a state check once running. touchend too: iOS may only count the end of a touch as a gesture.
// M (or the small speaker top-right) toggles mute
const unlock = () => audio.init();
window.addEventListener('pointerdown', unlock, { capture: true, passive: true });
window.addEventListener('touchend', unlock, { capture: true, passive: true });
window.addEventListener('keydown', (e) => {
  unlock();
  if (e.code === 'KeyM' && !e.repeat) audio.setMuted(!audio.muted);
});

const SPEAKER = '<path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/>';
const ICON_ON = `<svg viewBox="0 0 24 24" aria-hidden="true">${SPEAKER}<path d="M16 8.5a5 5 0 0 1 0 7M18.6 6a8.6 8.6 0 0 1 0 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`;
const ICON_OFF = `<svg viewBox="0 0 24 24" aria-hidden="true">${SPEAKER}<path d="M16.5 9.5l5 5M21.5 9.5l-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
const muteBtn = document.createElement('button');
muteBtn.id = 'mute';
const paintMute = (m) => {
  muteBtn.innerHTML = m ? ICON_OFF : ICON_ON;
  muteBtn.classList.toggle('muted', m);
  muteBtn.title = m ? 'Unmute (M)' : 'Mute (M)';
  muteBtn.setAttribute('aria-label', muteBtn.title);
};
paintMute(audio.muted);
audio.onMute(paintMute);
muteBtn.addEventListener('mousedown', (e) => e.preventDefault()); // never steal keyboard focus
muteBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  audio.init();
  audio.setMuted(!audio.muted);
});
document.body.append(muteBtn);

let last = performance.now();
function loop(now) {
  requestAnimationFrame(loop); // schedule first: an exception in one frame must never freeze the game
  const dt = (now - last) / 1000;
  last = now;
  if (!window.__manualStep) game.frame(dt);
}

// let the loading text paint before the (blocking) sprite bake starts
const ready = new Promise((r) => setTimeout(r, 30)).then(() => game.init());
ready.then(() => {
  document.getElementById('loading')?.classList.add('done');
  requestAnimationFrame(loop);
});

// URL shortcuts for quick testing: ?fight=naruto,sasuke&mode=solo|versus|cpu&level=easy|normal|hard|insane|impossible
// (mode=cpu spectates two CPUs; its level defaults to impossible); &seed=N fixes the match seed (the CPUs' combo
// personas and routes, ADR 0026)
const qs = new URLSearchParams(location.search);
if (qs.get('fight')) {
  const [p1, p2] = qs.get('fight').split(',');
  const mode = qs.get('mode') || 'solo';
  const seed = qs.get('seed') ? Number(qs.get('seed')) >>> 0 : undefined;
  ready.then(() => game.startMatch({ mode, p1, p2: p2 || p1, level: qs.get('level') || (mode === 'cpu' ? 'impossible' : 'normal'), seed }));
}

// ?debug exposes deterministic stepping helpers for automated testing in the console
if (qs.has('debug')) {
  window.step = (n, dt = 1 / 60) => {
    window.__manualStep = true; // the rAF loop stops driving the game while we step by hand
    for (let i = 0; i < n; i++) game.frame(dt);
    return {
      state: game.state,
      t: +game.stateT.toFixed(2),
      f: game.fighters.map((f) => `${f.state}${f.moveName ? '/' + f.moveName : ''} hp${f.hp} ki${Math.round(f.ki)} combo${f.combo} pos(${f.pos.x.toFixed(1)},${f.pos.y.toFixed(1)},${f.pos.z.toFixed(1)})`),
    };
  };
  window.hold = (code) => input.keys.add(code);
  window.release = (code) => input.keys.delete(code);
  window.press = (code, frames = 3) => {
    input.keys.add(code);
    input.tapped.add(code);
    const r = window.step(frames);
    input.keys.delete(code);
    return r;
  };
  window.resumeLoop = () => { window.__manualStep = false; };
  window.HIT_FLASH = HIT_FLASH; // live hit-flash tuning (style, strength, tier numbers): read every frame, ENG-064
  // real-time helpers (rAF loop running): tap keys / chords with real timing
  window.sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  window.tap = async (codes, ms = 50) => {
    codes = [].concat(codes);
    for (const c of codes) window.dispatchEvent(new KeyboardEvent('keydown', { code: c }));
    await window.sleep(ms);
    for (const c of codes) window.dispatchEvent(new KeyboardEvent('keyup', { code: c }));
  };
  window.waitFight = async () => { while (game.state !== 'fight') await window.sleep(40); game.hud.clearAnnounce(); };
  // copy the WebGL frame into a plain 2D canvas (screenshots of hidden pages can drop WebGL content)
  window.snap = () => {
    game.render(0);
    const gl = document.getElementById('game-canvas');
    let c = document.getElementById('debug-snap');
    if (!c) {
      c = document.createElement('canvas');
      c.id = 'debug-snap';
      Object.assign(c.style, { position: 'fixed', inset: '0', width: '100%', height: '100%', imageRendering: 'pixelated', pointerEvents: 'none' });
      document.getElementById('app').after(c);
    }
    c.width = gl.width;
    c.height = gl.height;
    c.getContext('2d').drawImage(gl, 0, 0);
    return 'snapped';
  };
  window.unsnap = () => document.getElementById('debug-snap')?.remove();
  // scale gate (TOOL-025): each fighter's strip on screen, its head scale vs the idle (packer audit, meta.scaleAudit),
  // the verdict, every strip the gate flagged, and depthK (the sprite's depth normalization, 1 without it)
  window.scaleReport = () => game.fighters.map((f) => {
    const a = f.actor, A = a.asset.meta.scaleAudit, s = A?.anims?.[a.animName];
    return {
      id: f.def.id, anim: a.animName, head: s?.head ?? null, frameHead: s?.frames?.[a.fi] ?? null, verdict: s?.verdict ?? (A ? 'not packed' : 'no audit (baked art or an older pack)'),
      flagged: A ? Object.entries(A.anims).filter(([, v]) => ['uniform', 'drift', 'pop'].includes(v.verdict)).map(([n, v]) => `${n} ${v.head} ${v.verdict}`) : [],
      depthK: +(a.depthK ?? 1).toFixed(3),
    };
  });
  // ground damage review (ADR 0024): every decal name x variant laid out on the ring ('all', a group such as
  // 'base' or 'chakra', or one name), or one impact in the middle of the ring
  window.groundDemo = (group = 'all') => game.fx.ground.demo(group);
  window.groundTest = (force = 0.7, style = 'stone', o = {}) => {
    const c = game.fx.ground.impact({ x: 0, y: 0, z: 0 }, { force, style, tint: '#ffb43a', ...o });
    return c && { tier: c.tier, D: +c.D.toFixed(2), parts: c.parts.map((p) => p.name), stats: game.fx.ground.stats() };
  };
  // music (ADR 0019): music.state(), music.next() (a new song from the next bar), music.seed(n); ?musicSeed=N
  window.music = audio.mus;
  if (qs.get('musicSeed')) audio.mus.seedNext = Number(qs.get('musicSeed')) >>> 0;
  // CPU combos (ADR 0026): every combo's record since the page loaded (window.comboRecs: the engine's view, hits,
  // bounces, vanishes, rating; window.comboLog: the composer's routes and why they ended; window.comboLinks: each
  // link it pressed, predicted vs actual frames; window.roundRecs: round lengths), and comboStats() to sum them up
  // for the soak (docs/TESTING.md)
  game.debugCombos = true;
  Object.assign(window, { comboRecs: [], comboLog: [], comboLinks: [], roundRecs: [] });
  window.comboStats = () => {
    const recs = window.comboRecs.filter((r) => r.hits >= 2), log = window.comboLog, rounds = window.roundRecs;
    const matchIds = new Set([...recs.map((r) => r.match), ...rounds.map((r) => r.match)]);
    const M = Math.max(1, matchIds.size), count = (fn) => recs.filter(fn).length;
    const perMatch = (fn) => [...matchIds].filter((m) => recs.some((r) => r.match === m && fn(r))).length / M;
    const hist = { '2-3': 0, '4-7': 0, '8-12': 0, '13-19': 0, '20+': 0 };
    for (const r of recs) hist[r.hits >= 20 ? '20+' : r.hits >= 13 ? '13-19' : r.hits >= 8 ? '8-12' : r.hits >= 4 ? '4-7' : '2-3']++;
    // a route is two or more of the composer's decisions (the '·why' markers say how it stopped, not what it did)
    const routes = log.filter((r) => r.edges.filter((e) => !e.startsWith('·')).length >= 2);
    let repeat = 0;
    const prev = {};
    for (const r of routes) { if (prev[r.match + ':' + r.who] === r.sig) repeat++; prev[r.match + ':' + r.who] = r.sig; }
    const tally = (arr, key) => arr.reduce((t, r) => ((t[key(r)] = (t[key(r)] ?? 0) + 1), t), {});
    const last = {}; // each match's last round record holds its combo / fight frames so far
    for (const r of rounds) last[r.match] = r;
    const cf = Object.values(last).reduce((s, r) => s + r.comboF, 0), ff = Object.values(last).reduce((s, r) => s + r.fightF, 0);
    const links = window.comboLinks, ok = links.filter((l) => l.ok);
    const durs = rounds.map((r) => r.dur);
    return {
      matches: M, combos: recs.length, hist,
      long12PerMatch: +(count((r) => r.hits >= 12) / M).toFixed(2),
      handballMatches: +perMatch((r) => r.wall >= 2).toFixed(2), // a combo with 2+ wall bounces
      wall3Matches: +perMatch((r) => r.wall >= 3).toFixed(2),
      vanishPerMatch: +(recs.reduce((s, r) => s + r.vanish, 0) / M).toFixed(2),
      routes: routes.length, distinctRoutes: +(new Set(routes.map((r) => r.sig)).size / Math.max(1, routes.length)).toFixed(2),
      repeatPrev: +(repeat / Math.max(1, routes.length)).toFixed(2),
      comboShare: ff ? +(cf / ff).toFixed(2) : null,
      rounds: durs.length ? { n: durs.length, avg: +(durs.reduce((a, b) => a + b, 0) / durs.length).toFixed(1), min: Math.min(...durs), max: Math.max(...durs) } : null,
      blue: +(count((r) => r.blue) / Math.max(1, recs.length)).toFixed(2),
      ratings: tally(recs.filter((r) => r.rated), (r) => r.rated),
      endedBy: tally(log, (r) => r.reason.split(':')[0]),
      links: { pressed: links.length, connected: +(ok.length / Math.max(1, links.length)).toFixed(2), missed: tally(links.filter((l) => !l.ok), (l) => l.id) },
      personas: [...new Set(log.map((r) => `${r.fighter}:${r.persona}`))],
      edges: tally(log.flatMap((r) => r.edges), (e) => e),
    };
  };
  // soak(n, pairs, level): n CPU vs CPU matches back to back, stepped in chunks (so it runs in a hidden tab too), cycling
  // through `pairs` ([['naruto', 'sasuke'], ...]); returns the live status object (window.soakStatus), which counts
  // errors, NaN positions, ring-outs outside a KO and states stuck for 10 s, then comboStats() has the combo numbers
  window.soak = (n = 3, pairs = [[game.cfg?.p1 ?? 'naruto', game.cfg?.p2 ?? 'sasuke']], level = 'impossible') => {
    const S = window.soakStatus = { done: 0, n, errors: [], nan: 0, ring: 0, stuck: [], matches: [], finished: false };
    const onErr = (e) => S.errors.push(String(e.message ?? e.reason ?? e).slice(0, 200));
    window.addEventListener('error', onErr);
    window.addEventListener('unhandledrejection', onErr);
    const start = () => {
      const [p1, p2] = pairs[S.done % pairs.length];
      game.startMatch({ mode: 'cpu', p1, p2, level });
      game.skipIntro();
    };
    const seen = [{ s: '', t: 0, n: 0 }, { s: '', t: 0, n: 0 }]; // one state that keeps counting up (not re-entered)
    start();
    (async () => {
      while (S.done < n) {
        try { window.step(120); } catch (e) { S.errors.push(e.stack.split('\n').slice(0, 3).join(' | ')); break; }
        game.fighters.forEach((f, i) => {
          if (![f.pos.x, f.pos.y, f.pos.z, f.vel.x, f.vel.y, f.vel.z].every(Number.isFinite)) S.nan++;
          if (!f.ko && Math.max(Math.abs(f.pos.x), Math.abs(f.pos.z)) > 8.6) { S.ring++; S.ringAt = `${f.def.id}:${f.state}/${f.moveName ?? f.kitState?.kind ?? ''} (${f.pos.x.toFixed(2)}, ${f.pos.z.toFixed(2)}) game:${game.state}`; }
          const live = game.state === 'fight' && !['idle', 'run', 'guard'].includes(f.state);
          if (live && f.state === seen[i].s && f.t >= seen[i].t) { seen[i].t = f.t; if (++seen[i].n === 5) S.stuck.push(`${f.def.id}:${f.state}/${f.moveName ?? f.kitState?.kind ?? ''}`); } else seen[i] = { s: f.state, t: f.t, n: 0 };
        });
        if (game.state === 'results') {
          S.matches.push({ pair: game.fighters.map((f) => f.def.id).join(' vs '), winner: game.roundWinner?.def.id, personas: game.brains.map((b) => b?.persona?.name) });
          if (++S.done < n) start();
        }
        await new Promise((r) => setTimeout(r, 0));
      }
      S.finished = true;
      window.removeEventListener('error', onErr);
      window.removeEventListener('unhandledrejection', onErr);
    })();
    return S;
  };
  window.freezeCpu = () => {
    game.brains[1].update = function () {
      this.f.pad.tick();
      this.f.pad.setMove(0, 0);
      for (const n of ['light', 'heavy', 'special', 'jump', 'guard', 'dash']) this.f.pad.set(n, false);
    };
  };
}
