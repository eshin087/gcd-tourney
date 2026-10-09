import { PixelRenderer } from './core/renderer.js';
import { InputManager } from './core/input.js';
import { audio } from './core/audio.js';
import { Game } from './game/game.js';
import { TouchControls, IS_TOUCH_DEVICE } from './core/touch.js';

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

// first interaction unlocks audio; M (or the small speaker top-right) toggles mute
const unlock = () => audio.init();
window.addEventListener('pointerdown', unlock, { once: true });
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

// URL shortcuts for quick testing: ?fight=naruto,sasuke&mode=solo&level=hard
const qs = new URLSearchParams(location.search);
if (qs.get('fight')) {
  const [p1, p2] = qs.get('fight').split(',');
  ready.then(() => game.startMatch({ mode: qs.get('mode') || 'solo', p1, p2: p2 || p1, level: qs.get('level') || 'normal' }));
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
  window.freezeCpu = () => {
    game.brains[1].update = function () {
      this.f.pad.tick();
      this.f.pad.setMove(0, 0);
      for (const n of ['light', 'heavy', 'special', 'jump', 'guard', 'dash']) this.f.pad.set(n, false);
    };
  };
}
