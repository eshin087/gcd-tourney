import * as THREE from 'three';
import { buildArena, loadCrowdAtlas } from '../world/arena.js';
import { loadStageArt, loadNpcArt, loadUiArt } from '../world/worldArt.js';
import { loadArtIndex } from '../core/artIndex.js';
import { buildTrainingRoom } from '../world/trainingRoom.js';
import { buildVoidStage } from '../world/voidStage.js';
import { Effects } from './effects.js';
import { chargeTick, chargeBar, chargeEnd } from './chargeFx.js';
import { CameraDirector } from './camera.js';
import { Fighter } from './fighter.js';
import { makeBrain, DummyBrain } from './ai.js';
import { Orb, Beam, Vortex, spawnProjectiles } from './projectiles.js';
import { ULTIMATE, DEFENSE, THROW, CLASH } from './moves.js';
import { makeChart, beatChart, seedOf, Judge } from './clash.js';
import { kitOf, rushBody, formingOrb, releaseOrb, clashFx, resumeRampage } from './kit.js';
import { Pad } from '../core/input.js';
import { audio } from '../core/audio.js';
import { Hud } from '../ui/hud.js';
import { Menus } from '../ui/menus.js';
import { deviceLayout, matchHint, clashHint } from '../ui/controls.js';
import { ROSTER, getChar } from '../characters/index.js';
import { loadFighterAsset } from './sprites.js';
import { BoxViewer } from './boxViewer.js';
import { DT, ROUND_TIME, ROUNDS_TO_WIN, RING_TOP, ARENA_LIMIT, MAX_KI } from './constants.js';

const v3 = new THREE.Vector3();

// closest distance between segments p1-q1 and p2-q2 (Ericson, Real-Time Collision Detection 5.1.9), for clash bodies
const sd1 = new THREE.Vector3(), sd2 = new THREE.Vector3(), sdr = new THREE.Vector3(), sdc = new THREE.Vector3();
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const clashTmp = new THREE.Vector3();
const ORB_HANDS = 0.9; // Hollow Purple forms this far ahead of Gojo (kit.js formOrb)
const BEAM_STUB = 0.7; // a beam pushed all the way back still leaves the hands
function segDist(p1, q1, p2, q2) {
  const d1 = sd1.subVectors(q1, p1), d2 = sd2.subVectors(q2, p2), r = sdr.subVectors(p1, p2);
  const a = d1.dot(d1), e = d2.dot(d2), f = d2.dot(r);
  let s = 0, t = 0;
  if (a > 1e-8 || e > 1e-8) {
    if (a <= 1e-8) t = clamp01(f / e);
    else {
      const c = d1.dot(r);
      if (e <= 1e-8) s = clamp01(-c / a);
      else {
        const b = d1.dot(d2), den = a * e - b * b;
        s = den > 1e-8 ? clamp01((b * f - c * e) / den) : 0;
        t = (b * s + f) / e;
        if (t < 0) { t = 0; s = clamp01(-c / a); } else if (t > 1) { t = 1; s = clamp01((b - c) / a); }
      }
    }
  }
  return sdc.copy(p1).addScaledVector(d1, s).sub(r.copy(p2).addScaledVector(d2, t)).length();
}
const LANE = 0.6; // max depth offset (world units) for a melee hit to connect
// states a throw can grab (ADR 0015): not hit or block stun, not airborne, not mid-dodge; an attack only
// during its startup and a kit move only while it stands still (counter stance, mode power-up, Blue cast)
const THROWABLE = new Set(['idle', 'run', 'guard', 'land', 'wavedash', 'charge', 'dash', 'jumpSquat', 'held']);
const THROWABLE_KIT = new Set(['counter', 'mode', 'pull']);
const DEFAULT_HURT = [{ x0: -0.3, x1: 0.3, y0: 0, y1: 1.45 }];
// Hit boxes are grown a little before the overlap test (world units, [x, y]): a fist
// that visibly brushes the body should count. Air normals get DBFZ-style tall boxes
// so juggles survive the victim's float. Per move: `boxPad` in moves.js.
const BOX_PAD = [0.1, 0.12];
const AIR_BOX_PAD = [0.18, 0.45];
// Narrowest body a hurtbox may have (world units). Art packs trace the real silhouette, and a slim
// fighter (Killua's art: 0.43) became much harder to hit than the cast; every body is at least this wide.
const HURT_MIN_W = 0.56;
const widen = (u) => {
  const w = u.x1 - u.x0;
  if (w >= HURT_MIN_W) return u;
  const c = (u.x0 + u.x1) / 2;
  return { x0: c - HURT_MIN_W / 2, x1: c + HURT_MIN_W / 2, y0: u.y0, y1: u.y1 };
};

export class Game {
  constructor(renderer, input) {
    this.renderer = renderer;
    this.input = input;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(30, 16 / 9, 0.3, 900);
    this.arena = buildArena(this.scene);
    this.room = buildTrainingRoom(this.scene);
    this.voidStage = buildVoidStage(this.scene); // Domain Expansion
    this.vortices = []; // Lapse: Blue
    this.domain = null;
    this.fx = new Effects(this.scene);
    this.cam = new CameraDirector(this.camera);
    const ui = document.getElementById('ui');
    this.hud = new Hud(ui);
    this.menus = new Menus(ui, this);
    this.roster = ROSTER;
    this.rosterAssets = [];
    this.fighters = [];
    this.projectiles = [];
    this.beams = [];
    this.orbs = []; // Hollow Purple (ADR 0017)
    this.pendingMelee = []; // melee hits found this frame, applied together (resolveMelee)
    this.clash = null;
    this.spClashCool = 0; // frames until two specials may clash again (a rush-off can't stall the round)
    this.frameNo = 0; // fixed frames run (which of two ultimates came first, ADR 0017)
    this.pads = [new Pad(), new Pad()];
    this.brains = [null, null];
    this.state = 'boot';
    this.stateT = 0;
    this.inputLive = false;
    this.paused = false;
    this.timeScale = 1;
    this.slowT = 0;
    this.acc = 0;
    this.alpha = 1;
    this.time = 0;
    this.excite = 0.15;
    this.timeLeft = ROUND_TIME;
    this.round = 1;
    this.freeze = 0;
    this.superFlash = null;
    this.dim = 0;
    this.dimTarget = 0;
    this.viewCover = 0; // fraction of the screen width hidden behind the training panel / touch buttons
    this.viewLift = 0; // projection shift up while touch buttons cover the bottom
    this.viewCoverY = 0; // results bottom bar (narrow window): the 'results' camera pulls back by it
    this.showBoxes = new URLSearchParams(location.search).has('boxes'); // hit/hurt box overlay
    // keep the on-screen button hints in sync with the device being used
    input.onDevice((d) => {
      if (this.fighters.length === 2 && !this.training) this.hud.hint.innerHTML = matchHint(this.cfg.mode, d);
    });
  }

  async init() {
    await loadArtIndex();
    await this.fx.loadCustom();
    const crowd = await loadCrowdAtlas();
    if (crowd) {
      this.arena.setCrowdAtlas(crowd);
      console.info(`[crowd] using custom crowd atlas (${crowd.entries.length} spectators, ${this.arena.seats} seats)`);
    }
    // stage slots, NPCs and title art (ADR 0012): approved packs only, ?art=custom shows local candidates
    const [stage, npcs, ui] = await Promise.all([loadStageArt(), loadNpcArt(), loadUiArt()]);
    if (stage) console.info(`[stage] custom slots${stage.preview ? ' (candidates)' : ''}: ${this.arena.applyStageArt(stage.slots).join(', ')}`);
    if (npcs.size) console.info(`[npc] placed ${this.arena.setNpcArt(npcs).join(', ')}${[...npcs.values()].some((n) => n.preview) ? ' (candidates)' : ''}`);
    this.uiArt = ui;
    this.rosterAssets = [];
    for (const c of ROSTER) this.rosterAssets.push(await loadFighterAsset(c, this.renderer.renderer));
    // hi-res art packs get the sharper render mode (override with ?res=pixel or ?res=hd)
    const res = new URLSearchParams(location.search).get('res');
    this.renderer.setDetail(res || (this.rosterAssets.some((a) => a.meta.pixelsPerUnit >= 70) ? 'hd' : 'pixel'));
    this.cam.set('orbit');
    this.state = 'menu';
    this.menus.title();
  }

  camDir(mx, my) {
    return this.cam.dirFromInput(mx, my);
  }

  // ------------------------------------------------------------ match setup
  startMatch(cfg) {
    this.cfg = cfg;
    this.menus.hide();
    audio.init();
    this.cleanupMatch();
    this.arena.shuffleCrowd(); // a different crowd every match
    const defs = [getChar(cfg.p1), getChar(cfg.p2)];
    const assets = defs.map((d) => this.rosterAssets[ROSTER.indexOf(d)]);
    this.assets = assets;
    this.fighters = defs.map((d, i) => new Fighter(this, d, assets[i], i));
    if (defs[0] === defs[1]) this.fighters[1].actor.mat.uniforms.tint.value.setRGB(0.78, 0.86, 1.18); // mirror match tint
    this.pads = [new Pad(), new Pad()];
    this.fighters.forEach((f, i) => { f.pad = this.pads[i]; f.wins = 0; });
    // 'solo': P1 human vs CPU. 'cpu': spectate two CPUs at the same level (defaults to impossible, the
    // point being to watch what the strongest bots can do). 'versus': two humans.
    const level = cfg.level || (cfg.mode === 'cpu' ? 'impossible' : 'normal');
    this.brains = cfg.mode === 'solo' ? [null, makeBrain(this.fighters[1], level)]
      : cfg.mode === 'cpu' ? this.fighters.map((f) => makeBrain(f, level, true))
      : [null, null];
    this.input.bind(this.pads, cfg.mode === 'solo' || cfg.mode === 'cpu' ? cfg.mode : 'versus');
    this.hud.setup(this.fighters, assets, matchHint(cfg.mode, deviceLayout(this.input)));
    this.round = 1;
    this.resetRound();
    this.beginIntro();
  }

  // Training room: no timer, no KO, health refills, configurable dummy.
  startTraining(cfg = {}) {
    const p1 = cfg.p1 || this.trainingCfg?.p1 || ROSTER[0].id;
    const p2 = cfg.p2 || this.trainingCfg?.p2 || (ROSTER.find((c) => c.id !== p1) || ROSTER[0]).id;
    this.trainingCfg = { p1, p2, dummy: cfg.dummy || this.trainingCfg?.dummy || 'stand', infiniteKi: cfg.infiniteKi ?? this.trainingCfg?.infiniteKi ?? true };
    this.menus.hide();
    audio.init();
    this.paused = false;
    if (audio.sfx) audio.sfx.gain.value = 0.9;
    this.cleanupMatch();
    this.training = true;
    this.setStage('training');
    this.cfg = { mode: 'training', p1, p2 };
    const defs = [getChar(p1), getChar(p2)];
    const assets = defs.map((d) => this.rosterAssets[ROSTER.indexOf(d)]);
    this.assets = assets;
    this.fighters = defs.map((d, i) => new Fighter(this, d, assets[i], i));
    if (defs[0] === defs[1]) this.fighters[1].actor.mat.uniforms.tint.value.setRGB(0.78, 0.86, 1.18);
    this.pads = [new Pad(), new Pad()];
    this.fighters.forEach((f, i) => { f.pad = this.pads[i]; });
    this.brains = [null, new DummyBrain(this.fighters[1], this.trainingCfg.dummy)];
    this.input.bind(this.pads, 'solo');
    this.input.flush(); // training goes live at once (no intro): the menu confirm press must not act
    this.hud.setup(this.fighters, assets, '');
    this.resetRound();
    this.setState('training');
    this.cam.set('fight');
    this.cam.snap();
    this.hud.show(true);
    this.hud.training(true);
    this.inputLive = true;
    audio.startMusic('training');
    audio.setCrowd(0);
    this.menus.trainingPanel();
  }

  // CPU vs CPU spectator match: both pads are driven by brains, nobody is playing.
  get watching() {
    return this.cfg?.mode === 'cpu' && !this.training;
  }

  // 'arena' (tournament grounds) or 'training' (holographic practice room)
  setStage(kind) {
    this.arena.group.visible = kind === 'arena';
    this.room.group.visible = kind === 'training';
    this.voidStage.group.visible = kind === 'void';
  }

  // ------------------------------------------------------------ kits (ADR 0009)
  // named kit moves: callout + a short flash
  // a new ki bar while powering up: the fighter's own beat (chargeFx.js, restrained); the last bar is louder
  onChargeBar(f) {
    const full = f.ki >= MAX_KI;
    chargeBar(this, f, full);
    audio.play(full ? 'kiMax' : 'kiFull');
    if (full) this.hud.callout(f.index, 'MAX POWER!', f.def.color);
  }

  onKitMove(f, m) {
    if (!m.name) return;
    this.hud.callout(f.index, m.name, m.color || f.def.color);
    this.superFlashFor(f, 8, 0.3);
    this.cam.zoomPunch(0.25);
  }

  // `answer`: fired into the opponent's running ultimate, so a short flash (they can meet, ADR 0017)
  onSuperStart(f, S, answer = false) {
    this.arena.npcCue('super');
    this.superFlashFor(f, answer ? CLASH.answerFlash : S.flash, 0.78, true, S.name);
    if (answer) this.hud.announce('COUNTER!', 'clash', 700);
    this.fx.overlay.flash(S.color || f.def.color, 0.45);
    this.excite = 1;
  }

  spawnVortex(f, m, at = null) {
    this.vortices = this.vortices.filter((v) => !v.dead && v.owner !== f);
    this.vortices.push(new Vortex(this, f, m, at));
  }

  // Domain Expansion: Unlimited Void: the void replaces the stage and the opponent is frozen.
  startDomain(f, S) {
    this.arena.npcCue('super');
    const o = f.opp;
    this.domain = { owner: f, t: S.len };
    this.setStage('void');
    if (!o.ko) {
      o.endMoveFx();
      o.move = null;
      o.kitState = null;
      o.counterT = 0;
      o.hidden = false;
      o.actor.setVisible(true);
      o.heldT = S.len;
      o.vel.set(0, 0, 0);
      if (!['hitstun', 'launched', 'down', 'getup'].includes(o.state)) o.setState('held', 'stagger');
    }
    for (const b of this.beams) if (b.owner === o) b.kill();
    for (const ob of this.orbs) if (ob.owner === o) ob.kill();
    this.hud.announce('UNLIMITED VOID', 'clash', 1500);
    this.fx.overlay.flash('#ffffff', 0.9);
    this.fx.overlay.impactFrame(4);
    this.cam.shake(0.6);
    audio.play('gong');
    audio.duckMusic('domain', true);
    this.excite = 1;
  }

  endDomain() {
    if (!this.domain) return;
    this.domain = null;
    audio.duckMusic('domain', false);
    this.setStage(this.training ? 'training' : 'arena');
    this.fx.overlay.flash('#ffffff', 0.5);
  }

  setDummy(mode) {
    this.trainingCfg.dummy = mode;
    if (this.brains[1]?.setMode) this.brains[1].setMode(mode);
  }

  resetTrainingPositions() {
    if (!this.training) return;
    for (const f of this.fighters) f.endMoveFx();
    this.resetRound();
    const [a, b] = this.fighters;
    a.reset(-1.6, 0); b.reset(1.6, 0);
    this.faceEachOther();
    this.input.flush();
    this.cam.set('fight'); // a reset mid-ultimate or mid-clash must not strand the camera
    this.cam.snap();
    audio.play('ui');
  }

  cleanupMatch() {
    this.training = false;
    this.domain = null;
    for (const v of this.vortices) v.kill();
    this.vortices = [];
    this.setStage('arena');
    this.hud.training(false);
    for (const f of this.fighters) { f.endMoveFx(); f.boxViewer?.dispose(); f.actor.dispose(); }
    this.fighters = [];
    for (const p of this.projectiles) p.kill();
    for (const b of this.beams) b.kill();
    for (const ob of this.orbs) ob.kill();
    this.projectiles = [];
    this.beams = [];
    this.orbs = [];
    this.clash = null;
    this.spClashCool = 0;
    audio.stopAllLoops();
    audio.clearMusicDucks();
    this.fx.clearAll();
    this.hud.clash(false);
    this.hud.clearAnnounce();
    this.hud.show(false);
    this.hud.showCards(false);
    this.timeScale = 1;
    this.slowT = 0;
    this.freeze = 0;
    this.superFlash = null;
    this.dimTarget = 0;
    this.inputLive = false;
    this.viewCover = this.viewLift = this.viewCoverY = 0; // a rematch's intro must not start in the results framing
  }

  resetRound() {
    const [a, b] = this.fighters;
    a.reset(-3.4, 0.3);
    b.reset(3.4, -0.3);
    this.faceEachOther();
    for (const p of this.projectiles) p.kill();
    for (const bm of this.beams) bm.kill();
    for (const ob of this.orbs) ob.kill();
    for (const v of this.vortices) v.kill();
    this.projectiles = [];
    this.beams = [];
    this.orbs = [];
    this.vortices = [];
    this.pendingMelee = [];
    if (this.domain) { this.domain = null; this.setStage(this.training ? 'training' : 'arena'); }
    if (this.clash) { this.clash = null; audio.stopLoop('clash'); }
    this.spClashCool = 0;
    this.hud.clash(false);
    audio.stopAllLoops();
    audio.clearMusicDucks();
    this.fx.clearAll();
    this.timeLeft = ROUND_TIME;
    this.timeScale = 1;
    this.slowT = 0;
    this.freeze = 0;
    this.superFlash = null;
    this.dimTarget = 0;
    this.koTriggered = false;
    this.roundWinner = null;
    for (const p of this.pads) p.clear();
  }

  // Start-of-round facing in world space: the camera can still be on the menu orbit
  // (or the victory shot), so cam.right can't be trusted yet. 'idle' re-aims each frame.
  faceEachOther() {
    const [a, b] = this.fighters;
    a.side = 1;
    b.side = -1;
    a.face.set(b.pos.x - a.pos.x, b.pos.z - a.pos.z).normalize();
    b.face.set(a.pos.x - b.pos.x, a.pos.z - b.pos.z).normalize();
  }

  setState(s) {
    this.state = s;
    this.stateT = 0;
    this.flowFlags = {};
  }

  beginIntro() {
    this.arena.npcCue('intro');
    this.setState('intro');
    this.inputLive = false;
    this.cam.set('intro');
    this.cam.yaw = 0;
    for (const f of this.fighters) f.setState('intro');
    this.hud.show(false);
    audio.startMusic('battle');
    audio.setCrowd(0.12);
    audio.play('taiko');
  }

  skipIntro() {
    this.hud.showCards(false);
    this.beginRound();
  }

  beginRound() {
    this.setState('roundIntro');
    if (this.cam.mode !== 'fight') this.cam.set('fight');
    this.hud.show(true);
    for (const f of this.fighters) f.setState('idle');
  }

  nextRound() {
    this.round++;
    this.resetRound();
    this.cam.set('fight');
    this.cam.snap();
    this.beginRound();
  }

  // ------------------------------------------------------------ main loop
  frame(dtReal) {
    dtReal = Math.min(dtReal, 0.1);
    this.input.pollMenu();
    const events = this.input.takeMenuEvents();
    if (this.state === 'menu' || this.state === 'results' || this.paused) this.menus.handle(events);
    else this.handleGameEvents(events);

    if (!this.paused) {
      if (this.slowT > 0) {
        this.slowT -= dtReal;
        if (this.slowT <= 0) this.timeScale = 1;
      }
      const dt = dtReal * this.timeScale;
      if (this.fighters.length === 2) {
        this.acc += dt;
        let steps = 0;
        while (this.acc >= DT && steps < 6) {
          this.fixedUpdate();
          this.acc -= DT;
          steps++;
        }
        if (steps === 6) this.acc = 0;
        this.alpha = Math.min(1, this.acc / DT);
      }
      this.time += dt;
      this.stateT += dtReal;
      this.flow(dtReal);
    }
    this.render(dtReal);
  }

  handleGameEvents(events) {
    for (const e of events) {
      if (this.state === 'intro' && (e.action === 'confirm' || e.action === 'pause' || e.action === 'back')) {
        if (this.stateT > 0.3) this.skipIntro();
        continue;
      }
      if ((e.action === 'pause' || (e.action === 'back' && e.code === 'Escape')) && this.fighters.length === 2) this.pause();
      else if (this.training && e.action === 'panel') this.menus.toggleTrainingPanel();
      else if (this.training && (e.action === 'select' || e.code === 'Backspace')) this.resetTrainingPositions();
    }
  }

  // on-screen pause button (touch)
  pauseFromTouch() {
    if (this.fighters.length === 2 && !this.paused && this.state !== 'intro') this.pause();
  }

  // a tap on the game view during the pre-fight intro skips it (touch has no Enter key)
  tapSkip() {
    if (this.state === 'intro' && this.stateT > 0.3 && !this.paused) this.skipIntro();
  }

  pause() {
    if (this.paused) return;
    this.paused = true;
    if (audio.sfx) audio.sfx.gain.value = 0.25;
    audio.duckMusic('pause', true);
    this.fx.overlay.clear();
    this.menus.pause(() => this.resume(), () => this.quitToTitle(), this.training);
  }

  resume() {
    this.paused = false;
    if (audio.sfx) audio.sfx.gain.value = 0.9;
    audio.duckMusic('pause', false);
    this.menus.hide();
    for (const p of this.pads) p.clear();
    this.input.flush(); // the RESUME confirm press must not also jump / attack
    if (this.training) this.menus.trainingPanel();
    else if (this.fighters.length === 2) this.hud.hint.innerHTML = matchHint(this.cfg.mode, deviceLayout(this.input)); // bindings may have changed
  }

  // Every way back to the menus (exit training, quit to title, results -> character select). The old
  // screen goes first and a failing open() falls back to the title, so a menu bug can never leave the
  // pause list up over an empty arena with no way out (ENG-062).
  toMenu(open) {
    this.paused = false;
    if (audio.sfx) audio.sfx.gain.value = 0.9;
    this.cleanupMatch();
    this.brains = [null, null];
    this.setState('menu');
    this.cam.set('orbit');
    audio.startMusic('menu');
    audio.setCrowd(0.05);
    this.menus.hide();
    try {
      open();
    } catch (e) {
      console.error('[menus] could not open the next screen; back to the title', e);
      this.menus.title();
    }
  }

  exitTraining() { this.toMenu(() => this.menus.modeSelect(this.menus.modeIndex('training'))); }

  quitToTitle() { this.toMenu(() => this.menus.title()); }

  fixedUpdate() {
    this.frameNo++;
    this.input.poll();
    if (this.training) this.hud.history?.tick(this.pads[0], deviceLayout(this.input));
    for (let i = 0; i < 2; i++) if (this.brains[i]) this.brains[i].update(this);
    if (this.superFlash) {
      this.superFlash.t++;
      if (this.superFlash.t >= this.superFlash.len) {
        this.superFlash = null;
        this.dimTarget = 0;
      }
    }
    if (this.clash?.lite) {
      // a special clash: the world holds still for its one beat (updateClash ends it)
      for (const f of this.fighters) f.prev.copy(f.pos);
      this.updateClash();
      this.fxTicks(true);
      return;
    }
    if (this.freeze > 0) {
      // super flash: the world holds its breath (inputs still buffer)
      this.freeze--;
      for (const f of this.fighters) f.prev.copy(f.pos);
      this.fxTicks(true);
      return;
    }
    for (const f of this.fighters) f.update();
    this.resolveMelee();
    this.separate();
    if (this.spClashCool > 0) this.spClashCool--;
    this.checkSpecialClash();
    this.checkUltimateClash(); // where the fighters stand now, before an orb's own hit test can land first
    for (const p of this.projectiles) p.update();
    this.projectileCollisions();
    this.projectiles = this.projectiles.filter((p) => !p.dead);
    for (const v of this.vortices) v.update();
    this.vortices = this.vortices.filter((v) => !v.dead);
    if (this.domain && --this.domain.t <= 0) this.endDomain();
    if (this.clash && !this.clash.lite) this.updateClash(); // places the bodies before they draw
    for (const b of this.beams) b.update();
    for (const ob of this.orbs) ob.update();
    this.orbs = this.orbs.filter((ob) => !ob.dead);
    this.checkUltimateClash();
    this.beams = this.beams.filter((b) => !b.dead);
    this.fxTicks();
    if (this.training) {
      for (const f of this.fighters) {
        if (this.trainingCfg.infiniteKi && f.index === 0) f.ki = Math.max(f.ki, 300);
        // refill once nothing has touched them for a moment (works for a hopping or fighting dummy too)
        f.sinceHit = (f.sinceHit ?? 999) + 1;
        const reeling = f.state === 'hitstun' || f.state === 'launched' || f.state === 'down' || f.state === 'getup' || f.state === 'block';
        if (f.sinceHit > 50 && f.combo === 0 && !reeling && f.hp < 1000) f.hp = Math.min(1000, f.hp + 25);
      }
    }
    if (this.state === 'fight' && this.inputLive && !this.clash) {
      this.timeLeft -= DT;
      if (this.timeLeft <= 0) this.timeUp();
    }
  }

  separate() {
    const [a, b] = this.fighters;
    if (a.ko || b.ko || this.clash || a.hidden || b.hidden) return;
    const dx = b.pos.x - a.pos.x, dz = b.pos.z - a.pos.z;
    const d = Math.hypot(dx, dz);
    if (d < 0.72 && Math.abs(a.pos.y - b.pos.y) < 1.3) {
      const nx = d > 0.001 ? dx / d : 1, nz = d > 0.001 ? dz / d : 0;
      const push = (0.72 - d) / 2;
      a.pos.x -= nx * push; a.pos.z -= nz * push;
      b.pos.x += nx * push; b.pos.z += nz * push;
      // never shove a cornered fighter through the ring barrier: the other one gives way instead
      for (const [f, g] of [[a, b], [b, a]]) {
        for (const k of ['x', 'z']) {
          const over = Math.abs(f.pos[k]) - ARENA_LIMIT;
          if (over > 0) {
            const s = Math.sign(f.pos[k]);
            f.pos[k] -= s * over;
            g.pos[k] -= s * over;
          }
        }
      }
    }
  }

  // `frozen`: a super flash or special clash holds the world (f.t stands still), so effects only refresh
  fxTicks(frozen = false) {
    let lines = 0;
    for (const f of this.fighters) {
      if (f.state !== 'charge') chargeEnd(this, f);
      if (f.state === 'charge') {
        lines = Math.max(lines, chargeTick(this, f, f.t, frozen)); // canon power-up per fighter (ENG-069)
        this.linesFocus = f;
      } else if (f.state === 'beamCharge') {
        this.fx.auraTick(f, 1.8, this.cam.right);
        lines = 1;
        this.linesFocus = f;
      } else if (f.state === 'beamFire' || f.state === 'clash') this.fx.auraTick(f, 0.6, this.cam.right);
      if (f.state === 'attack' && f.move?.fx) {
        const m = f.move;
        const t = f.t, A = m.startup, B = A + m.active;
        const phase = t < A ? 0 : t < B ? 1 : 2;
        if (phase < 2 || (f.moveHit && t < B + 6)) this.fx.handTick(f, m.fx, phase, t / A);
        else this.fx.dropHand(f);
      } else this.fx.dropHand(f);
    }
    if (this.clash) lines = 0.75;
    if (this.superFlash) { lines = 1; this.linesFocus = this.superFlash.who; }
    const o = this.fx.overlay;
    o.lines += (lines - o.lines) * (lines > o.lines ? 0.3 : 0.08);
  }

  // ------------------------------------------------------------ combat
  // A melee hit needs (1) both fighters in the same depth lane and (2) the attack's
  // hitbox (the actual fist/foot on this sprite frame) overlapping the defender's
  // hurtbox. Sheets without boxes fall back to the move's reach numbers.
  checkMelee(att, m) {
    const def = att.opp;
    // a dodge's intangibility still runs the overlap test, so a hit it lets pass gets its callout
    const evading = !def.hittable && def.evading;
    if (!def.hittable && !evading) return;
    const R = this.cam.right, F = this.cam.fwd;
    const rx = def.pos.x - att.pos.x, rz = def.pos.z - att.pos.z;
    const sx = rx * R.x + rz * R.z, sd = rx * F.x + rz * F.z, sy = def.pos.y - att.pos.y;
    if (Math.abs(sd) > (m.lane ?? LANE)) return;
    let pt = null;
    const hits = att.asset.boxes(att.actor.frame, 'hit', att.side);
    if (hits) {
      const hurts = (def.asset.boxes(def.actor.frame, 'hurt', def.side) || DEFAULT_HURT).map(widen);
      const [px, py] = m.boxPad ?? (m.air || m.hover ? AIR_BOX_PAD : BOX_PAD);
      for (const h of hits) {
        for (const u of hurts) {
          const x0 = Math.max(h.x0 - px, u.x0 + sx), x1 = Math.min(h.x1 + px, u.x1 + sx);
          const y0 = Math.max(h.y0 - py, u.y0 + sy), y1 = Math.min(h.y1 + py, u.y1 + sy);
          if (x0 < x1 && y0 < y1) { pt = { x: (x0 + x1) / 2, y: (y0 + y1) / 2 }; break; }
        }
        if (pt) break;
      }
    } else {
      const along = sx * att.side;
      if (along > -0.25 && along < m.reach + 0.25 && Math.abs(sy) < (m.yTol ?? 1.25)) pt = { x: sx * 0.75, y: sy + 0.85 };
    }
    if (!pt) return;
    if (evading) { this.onEvade(def); return; }
    att.hitDone = true;
    // applied after both fighters moved this frame, so two attacks meeting on the same frame trade
    // (P1 updates first; applying at once made P1 win every exchange)
    this.pendingMelee.push({
      att, def, m, dir: att.face.clone(),
      at: { x: att.pos.x + R.x * pt.x + F.x * sd * 0.5, y: att.pos.y + pt.y, z: att.pos.z + R.z * pt.x + F.z * sd * 0.5 },
    });
  }

  resolveMelee() {
    if (!this.pendingMelee.length) return;
    const list = this.pendingMelee;
    this.pendingMelee = [];
    for (const { att, def, m, dir, at } of list) {
      if (def.ko) continue;
      const attacking = att.state === 'attack' && att.move === m; // false if the other hit landed first
      att.moveHit = true;
      att.hitPoint = at;
      const r = def.takeHit(att, m, dir);
      att.hitPoint = null;
      if (!attacking || r === 'parry') continue; // a parried attacker is already staggered
      if (m.rush) {
        att.vel.multiplyScalar(0.1);
        att.t = m.startup + m.active;
        if (m.vortex && def.hp > 0) this.spawnVortex(att, m.vortex, def.pos); // Rasenshuriken grind
      }
      // air juggles: start riding up with the victim (Fighter.updateAttack keeps following)
      if (m.air || m.hover) att.vel.y = Math.max(att.vel.y, def.state === 'launched' ? def.vel.y : 2.5);
    }
  }

  // Two rush specials meeting head-on (Rasengan into Chidori): one beat decides it (ADR 0017). Right after another
  // special clash they simply trade.
  checkSpecialClash() {
    const [a, b] = this.fighters;
    const act = (f) => f.state === 'attack' && f.move?.special && f.t >= f.move.startup && f.t < f.move.startup + f.move.active;
    if (this.clash || !act(a) || !act(b)) return;
    if (Math.hypot(a.pos.x - b.pos.x, a.pos.z - b.pos.z) > 1.6) return;
    if (this.spClashCool > 0) this.specialTrade();
    else this.startClash(this.fighterBody(a), this.fighterBody(b), true);
  }

  // both specials go off at once: each fighter takes the other's blast
  specialTrade() {
    const [a, b] = this.fighters;
    this.arena.npcCue('clash');
    const mid = v3.set((a.pos.x + b.pos.x) / 2, Math.max(a.pos.y, b.pos.y) + 0.9, (a.pos.z + b.pos.z) / 2);
    this.fx.explosion(mid.x, mid.y, mid.z, new THREE.Color(0xbfe0ff));
    this.fx.debris(mid.x, mid.z, 12, 1.2);
    this.fx.overlay.impactFrame(4);
    this.fx.overlay.flash('#ffffff', 0.7);
    audio.play('explosion', 1.2);
    this.cam.shake(1);
    this.slowmo(0.3, 0.6);
    this.excite = 1;
    audio.play('cheer');
    for (const f of [a, b]) {
      const o = f.opp;
      const d = new THREE.Vector2(f.pos.x - o.pos.x, f.pos.z - o.pos.z).normalize();
      f.takeHit(o, { dmg: CLASH.special.dmg, launch: [12, 8], hitstop: 16, unblockable: true, big: true, projectileHit: true, spark: 'smash', hitFlash: 'special' }, d);
    }
  }

  projectileCollisions() {
    const ps = this.projectiles;
    for (let i = 0; i < ps.length; i++) {
      for (let j = i + 1; j < ps.length; j++) {
        const a = ps[i], b = ps[j];
        if (a.dead || b.dead || a.owner === b.owner) continue;
        if (a.pos.distanceTo(b.pos) < a.P.radius + b.P.radius) {
          this.fx.hit((a.pos.x + b.pos.x) / 2, (a.pos.y + b.pos.y) / 2, (a.pos.z + b.pos.z) / 2, 'heavy');
          audio.play('block');
          a.kill();
          b.kill();
        }
      }
    }
    for (const bm of this.beams) {
      for (const p of ps) {
        if (p.dead || p.owner === bm.owner) continue;
        v3.copy(p.pos).sub(bm.origin);
        const along = v3.dot(bm.dir);
        if (along > 0 && along < bm.len && v3.addScaledVector(bm.dir, -along).length() < bm.width) {
          this.fx.hit(p.pos.x, p.pos.y, p.pos.z, 'light');
          p.kill();
        }
      }
    }
    // Hollow Purple erases whatever the opponent throws into it, and a Lapse: Blue in its way
    for (const ob of this.orbs) {
      if (ob.dead) continue;
      for (const p of ps) {
        if (p.dead || p.owner === ob.owner) continue;
        if (p.pos.distanceTo(ob.pos) < ob.r + p.P.radius) {
          this.fx.hit(p.pos.x, p.pos.y, p.pos.z, 'light');
          p.kill();
        }
      }
      for (const v of this.vortices) if (!v.dead && v.owner !== ob.owner && v.pos.distanceTo(ob.pos) < ob.r + 1) v.kill();
    }
  }

  // Hollow Purple: leaves the meeting point of Red and Blue (kit.js 'orb'); one per fighter
  spawnOrb(f, S, at, ultimate = true) {
    this.arena.npcCue('clash');
    for (const ob of this.orbs) if (ob.owner === f) ob.kill();
    const ob = new Orb(this, f, S, at, ultimate);
    this.orbs.push(ob);
    this.cam.shake(0.6);
    this.fx.overlay.flash('#c890ff', 0.4);
    audio.play('explosion', 0.8);
    this.excite = 1;
    return ob;
  }

  spawnProjectile(f) {
    this.projectiles.push(...spawnProjectiles(this, f, f.move?.proj || f.def.projectile));
  }

  fireBeam(f) {
    this.arena.npcCue('clash');
    const b = new Beam(this, f);
    this.beams.push(b);
    if (this.cam.mode === 'focus') this.cam.set('fight');
    this.cam.shake(0.45);
    this.fx.overlay.flash('#ffffff', 0.35);
    this.excite = 1;
    return b;
  }

  // ------------------------------------------------------------ ultimate clashes (ADR 0017)
  // What a fighter's running ultimate puts on the field, for clash detection: a capsule from `back` to `front`
  // (radius `r`) heading along `dir`. Only ultimates clash: the shared beam, Hollow Purple's orb and the Four-Tails
  // pounce (from the roar on). A beam still charging or a Purple still merging counts too (`charging`: it goes
  // off the moment they clash), so a rush can't slip through it. `id` names the ultimate: a pairing always plays
  // the same chart.
  ultimateBody(f) {
    if (!f || f.ko || f.hidden) return null;
    const id = kitOf(f.def).ultimate ?? 'beam:' + f.def.id;
    const toward = (at) => new THREE.Vector3(f.opp.pos.x - at.x, 0, f.opp.pos.z - at.z).normalize();
    const bm = this.beams.find((b) => b.owner === f && !b.dead && !b.spent && b.fade >= 1 && b.t < ULTIMATE.duration);
    if (bm) return { kind: 'beam', id, f, obj: bm, dir: bm.dir, back: bm.origin.clone(), front: bm.head.clone(), tip: bm.head.clone(), r: bm.width * 0.5, color: f.def.beam.mid };
    if (f.state === 'beamCharge') {
      const at = new THREE.Vector3(f.pos.x + f.face.x * 0.8, f.pos.y + 0.92, f.pos.z + f.face.y * 0.8);
      return { kind: 'beam', id, f, charging: true, dir: toward(at), back: at, front: at.clone(), tip: at.clone(), r: 0.6, color: f.def.beam.mid };
    }
    const ob = this.orbs.find((o) => o.owner === f && o.ultimate && !o.dead && !o.hit);
    if (ob) return { kind: 'orb', id, f, obj: ob, S: ob.S, dir: ob.dir, back: ob.pos.clone(), front: ob.pos.clone(), tip: ob.pos.clone().addScaledVector(ob.dir, ob.r), r: ob.r, color: ob.S.orb };
    const fo = formingOrb(f);
    if (fo) {
      const dir = toward(fo.at), r = fo.S.radius * 0.7;
      return { kind: 'orb', id, f, charging: true, S: fo.S, dir, back: fo.at, front: fo.at.clone(), tip: fo.at.clone().addScaledVector(dir, r), r, color: fo.S.orb };
    }
    const rb = rushBody(f);
    if (rb) {
      const dir = new THREE.Vector3(rb.dir.x, 0, rb.dir.y).normalize();
      const back = new THREE.Vector3(f.pos.x, f.pos.y + 0.7, f.pos.z);
      const front = back.clone().addScaledVector(dir, CLASH.rush.reach);
      return { kind: 'rush', id, f, S: rb.S, k: rb.k, dir, back, front, tip: front.clone(), r: 0.5, color: rb.S.shroud?.chakra ?? rb.S.color };
    }
    return null;
  }

  // one side of a special clash: the fighter itself, held mid-rush
  fighterBody(f) {
    const at = new THREE.Vector3(f.pos.x, f.pos.y + 0.9, f.pos.z);
    return { kind: 'fighter', f, origin: at, color: f.move?.color ?? f.def.color };
  }

  checkUltimateClash() {
    if (this.clash || this.fighters.length < 2) return;
    const A = this.ultimateBody(this.fighters[0]), B = this.ultimateBody(this.fighters[1]);
    if (!A || !B || A.dir.dot(B.dir) > -0.4) return;
    // head on: each one's back is still ahead of the other's along its heading (not two that already passed)
    if (v3.subVectors(B.back, A.back).dot(A.dir) <= 0 || v3.subVectors(A.back, B.back).dot(B.dir) <= 0) return;
    if (segDist(A.back, A.front, B.back, B.front) > A.r + B.r) return;
    this.startClash(A, B);
  }

  // The two lock where they met and both players play the same note chart (clash.js): the score lead pushes the
  // struggle point toward the trailing side, and the chart's end (or a lead that can't be caught any more) decides
  // it. `lite`: the one-beat special clash, with the world held still.
  startClash(A, B, lite = false) {
    this.arena.npcCue('clash');
    const chart = lite ? beatChart() : makeChart(seedOf(A.id, B.id));
    const c = { a: A, b: B, chart, judges: [new Judge(chart), new Judge(chart)], lite, timer: 0, t: 0.5, kick: 0, point: new THREE.Vector3() };
    c.ca = new THREE.Color(A.color);
    c.cb = new THREE.Color(B.color);
    c.mix = c.ca.clone().lerp(c.cb, 0.5);
    this.clash = c;
    if (lite) c.point.addVectors(A.origin, B.origin).multiplyScalar(0.5);
    else {
      for (const s of [A, B]) if (s.charging) this.materialize(s);
      this.clashLine(c);
      for (const s of [A, B]) {
        const f = s.f;
        if (s.obj) s.obj.clash = c;
        f.setState('clash', s.kind === 'beam' ? 'beamFire' : s.kind === 'orb' ? (s.S.strikePose ?? 'beamFire') : (s.S.strikePose ?? 'dash'));
        f.invuln = 99999;
        f.vel.set(0, 0, 0);
        f.faceOpponent();
      }
      this.placeClash(c);
      audio.loop('clash', 'clash');
      audio.duckMusic('clash', true); // the clash's metronome runs on its own tempo
    }
    for (const f of this.fighters) f.pad.clear();
    // the one-beat clash keeps the fight camera: up close, the two specials' light would hide both fighters
    if (lite) this.cam.zoomPunch(0.6);
    else this.cam.set('clash', c);
    const hint = clashHint(this.cfg.mode, deviceLayout(this.input));
    this.hud.clashStart(c, ['#' + c.ca.getHexString(), '#' + c.cb.getHexString()], hint);
    this.hud.announce('CLASH!', 'clash', 900);
    audio.play('explosion', lite ? 0.4 : 0.6);
    this.fx.overlay.flash('#ffffff', lite ? 0.4 : 0.6);
    this.excite = 1;
    audio.play('cheer');
  }

  // a clash caught this one still charging: the beam goes off / the Purple forms right now
  materialize(s) {
    const f = s.f;
    if (s.kind === 'beam') {
      f.setState('beamFire');
      f.beam = s.obj = this.fireBeam(f);
      s.back = s.obj.origin.clone();
      s.front = s.obj.head.clone();
      s.tip = s.front.clone();
    } else {
      s.obj = releaseOrb(f);
      s.back = s.obj.pos.clone();
      s.front = s.obj.pos.clone();
      s.tip = s.obj.pos.clone().addScaledVector(s.obj.dir, s.obj.r);
    }
    s.dir = s.obj.dir;
    s.charging = false;
  }

  // The line the struggle runs on, anchor to anchor: where they met, and how far the point may travel toward each
  // side. A beam is pushed back to a stub in the hands and an orb into its owner's hands, and then the owner gives
  // ground; a rusher gets shoved back the same way (CLASH.rush.shove), never through the ring barrier.
  clashLine(c) {
    const R = CLASH.rush, A = c.a, B = c.b, mins = [];
    for (const s of [A, B]) {
      const f = s.f;
      s.base = f.pos.clone();
      if (s.kind === 'beam') { s.anchor = s.obj.origin.clone(); mins.push(BEAM_STUB - R.shove); }
      else if (s.kind === 'orb') { s.anchor = new THREE.Vector3(f.pos.x, f.pos.y + 0.98, f.pos.z); mins.push(ORB_HANDS + s.obj.r * 0.6 - R.shove); }
      else { s.anchor = s.back.clone(); mins.push(R.reach - R.shove); }
      s.origin = s.kind === 'beam' ? s.obj.origin : s.anchor.clone(); // the clash camera frames origin to origin
    }
    const axis = new THREE.Vector3().subVectors(B.anchor, A.anchor);
    const span = axis.length();
    if (span < 0.5) axis.copy(A.dir);
    else axis.divideScalar(span);
    let lo = mins[0], hi = span - mins[1];
    if (lo > hi) lo = hi = (lo + hi) / 2;
    // they meet between their leading edges (the beam's head, the orb's surface, the claws)
    const at = THREE.MathUtils.clamp(v3.addVectors(A.tip, B.tip).multiplyScalar(0.5).sub(A.anchor).dot(axis), lo, hi);
    const C = A.anchor.clone().addScaledVector(axis, at);
    c.line = { axis, C, room: [Math.max(0.25, at - lo), Math.max(0.25, hi - at)] };
    // shoved all the way back, they still stand inside the ring barrier
    [A, B].forEach((s, i) => {
      const room = c.line.room, sg = i === 0 ? -1 : 1;
      while (room[i] > 0.25) {
        const stand = this.clashStance(c, s, v3.copy(C).addScaledVector(axis, sg * room[i]));
        if (Math.abs(stand.x) <= ARENA_LIMIT && Math.abs(stand.z) <= ARENA_LIMIT) break;
        room[i] -= 0.1;
      }
    });
  }

  // where a body's owner stands for struggle point P: a rusher stays `reach` behind the point; a beam's or an orb's
  // owner holds their ground until the beam is down to its stub / the orb is pressed into the hands, then gives it
  clashStance(c, s, P) {
    const sg = s === c.a ? 1 : -1, ax = c.line.axis, fl = Math.hypot(ax.x, ax.z) || 1;
    const dx = (ax.x / fl) * sg, dz = (ax.z / fl) * sg, out = clashTmp.copy(s.base);
    if (s.kind === 'rush') { out.x = P.x - dx * CLASH.rush.reach; out.z = P.z - dz * CLASH.rush.reach; return out; }
    const hold = s.kind === 'beam' ? BEAM_STUB : ORB_HANDS + 0.6 * s.obj.r, from = s.kind === 'beam' ? s.anchor : s.base;
    const give = Math.min(0, (P.x - from.x) * dx + (P.z - from.z) * dz - hold);
    out.x += dx * give;
    out.z += dz * give;
    return out;
  }

  // Bodies on the line for the struggle point: c.t 0.5 = where they met, 0 / 1 = all the way back to A's / B's side.
  placeClash(c) {
    const { axis, C, room } = c.line;
    const u = c.t * 2 - 1;
    const P = c.point.copy(C).addScaledVector(axis, u >= 0 ? u * room[1] : u * room[0]);
    for (const s of [c.a, c.b]) {
      const sg = s === c.a ? 1 : -1, f = s.f;
      const dx = axis.x * sg, dy = axis.y * sg, dz = axis.z * sg;
      const at = this.clashStance(c, s, P);
      const gx = at.x - f.pos.x, gz = at.z - f.pos.z;
      f.pos.x = at.x;
      f.pos.z = at.z;
      if (s.kind === 'beam') {
        const bm = s.obj;
        bm.origin.x += gx; // the hands slide back with the body
        bm.origin.z += gz;
        bm.dir.set(dx, dy, dz);
        bm.len = Math.max(0.4, (P.x - bm.origin.x) * dx + (P.y - bm.origin.y) * dy + (P.z - bm.origin.z) * dz);
      } else if (s.kind === 'orb') s.obj.pos.set(P.x - dx * s.obj.r, P.y - dy * s.obj.r, P.z - dz * s.obj.r);
      else {
        s.origin.set(f.pos.x, f.pos.y + 0.7, f.pos.z);
        f.actor.setPhase(s.S.maulPose ?? 'heavy', s.S.maulPhase ?? 1, 0.5); // claws dug into it
        clashFx(f, s.S, c.timer);
      }
    }
  }

  updateClash() {
    const c = this.clash, now = ++c.timer;
    for (let i = 0; i < 2; i++) {
      const b = this.fighters[i].pad.b;
      const pressed = b.light.pressed || b.heavy.pressed || b.special.pressed;
      const down = b.light.down || b.heavy.down || b.special.down;
      for (const r of c.judges[i].frame(now, pressed, down)) this.onBeat(c, i, r);
    }
    for (const n of c.chart.notes) if (n.t === now) audio.play('beat', n.kind === 'hold' ? 1.4 : 1);
    c.kick *= 0.85;
    this.clashSparks(c);
    this.hud.clashBeat(c);
    this.excite = 1;
    const [JA, JB] = c.judges;
    if (c.lite) {
      if (now >= c.chart.end + CLASH.windows.good + 8) this.endClash(this.beatWinner(JA, JB));
      return;
    }
    const lead = JA.score - JB.score;
    const target = 0.5 + THREE.MathUtils.clamp(lead * CLASH.push, -0.45, 0.45);
    c.t = THREE.MathUtils.clamp(c.t + (target - c.t) * 0.12 + Math.sin(now * 0.11) * 0.0015, 0.02, 0.98);
    this.placeClash(c);
    this.hud.clash(true, c.t);
    // over when the chart is, or (a blowout) once the trailing player can't catch up any more; once the FINAL PUSH
    // ring is up it always plays out
    const push = c.chart.notes[c.chart.notes.length - 1];
    const decided = now < push.t - c.chart.lead && Math.abs(lead) - (lead > 0 ? JB : JA).maxLeft() >= CLASH.drawMargin;
    if (decided || now >= c.chart.end + CLASH.outro) this.endClash(lead >= CLASH.drawMargin ? 0 : lead <= -CLASH.drawMargin ? 1 : -1);
  }

  // a graded press: its word on the player's side, and a Great or Perfect flares the struggle point in their color
  onBeat(c, i, r) {
    this.hud.clashJudge(i, r.g);
    const hit = r.g === 'perfect' || r.g === 'great' || r.g === 'good';
    if (r.g === 'perfect' || r.g === 'great') {
      c.kick = 1;
      const p = c.point;
      this.fx.spawn('ring', p.x, p.y, p.z, { scale: (r.g === 'perfect' ? 2.2 : 1.6) * (c.lite ? 0.55 : 1), color: i === 0 ? c.ca : c.cb, order: 6, depthTest: false, glow: 1.2 });
    }
    if (this.brains[i]) return; // only a player's own grades make a sound
    if (hit) audio.play('beatHit', r.g === 'perfect' ? 1 : r.g === 'great' ? 0.7 : 0.45);
    else audio.play('beatMiss', 0.7);
  }

  // the special clash's one beat: the better grade wins, then the closer press; both off (or a dead heat) trades
  beatWinner(JA, JB) {
    const key = (J) => (J.score <= 0 ? -99 : J.score * 100 - Math.abs(J.res[0]?.off ?? 99));
    const ka = key(JA), kb = key(JB);
    return ka === kb ? -1 : ka > kb ? 0 : 1;
  }

  clashSparks(c) {
    const p = c.point, now = c.timer, k = c.lite ? 0.55 : 1; // the special clash sits between two lit specials
    const pulse = (1 + Math.sin(now * 0.6) * 0.12 + c.kick * 0.15) * k;
    this.fx.keep('clashGlow', 'glow', p.x, p.y, p.z, { scale: 1.35 * pulse, color: c.mix, opacity: 1, order: 7, depthTest: false, glow: 1.2 });
    this.fx.keep('clashCore', 'glow', p.x, p.y, p.z, { scale: 0.75 * pulse, color: 0xffffff, opacity: 1, order: 8, depthTest: false, glow: 2 });
    const lt = this.fx.keep('clashBolt', 'lightning', p.x, p.y, p.z, { scale: 1.3 * k, color: 0xffffff, order: 9, depthTest: false, glow: 2 });
    lt.random = true;
    lt.rot = Math.random() * 6.28;
    if (now % 10 === 0) this.fx.spawn('ring', p.x, p.y, p.z, { scale: 1.5 * k, color: c.mix, order: 6, depthTest: false, glow: 1 });
    if (now % 3 === 0) {
      const a = Math.random() * Math.PI * 2;
      this.fx.spawn('star', p.x, p.y, p.z, { scale: 0.3, frame: 2, vel: [Math.cos(a) * 5, Math.sin(a) * 4 + 2, (Math.random() - 0.5) * 5], grav: 8, life: 0.4, color: Math.random() < 0.5 ? c.ca : c.cb, depthTest: false, order: 9, glow: 1.5 });
    }
    if (c.lite) return;
    if (now % 14 === 0) this.fx.smoke(p.x + (Math.random() - 0.5) * 2, 0.2, p.z + (Math.random() - 0.5) * 2, 1);
    if (now % 20 === 0) this.fx.debris(p.x, p.z, 3, 0.7);
  }

  endClash(winner) {
    const c = this.clash;
    this.clash = null;
    audio.stopLoop('clash');
    audio.duckMusic('clash', false);
    this.hud.clash(false);
    const P = c.point.clone();
    this.fx.overlay.impactFrame(4);
    this.fx.overlay.flash('#ffffff', 0.9);
    this.cam.set('fight');
    this.cam.shake(1);
    this.slowmo(0.3, 0.8);
    for (const f of this.fighters) { f.invuln = 0; f.pad.clear(); } // the beat's presses must not fire moves after it
    if (c.lite) { this.endSpecialClash(winner); return; }
    const ax = c.line.axis;
    if (winner < 0) {
      // even: both ultimates blow up between them
      this.fx.explosion(P.x, P.y, P.z, new THREE.Color(0xffffff));
      this.fx.debris(P.x, P.z, 14, 1.3);
      audio.play('explosion', 1.3);
      this.hud.announce('DRAW!', 'clash', 900);
      [c.a, c.b].forEach((s, i) => {
        s.obj?.kill();
        const sg = i === 0 ? -1 : 1;
        s.f.takeHit(s.f.opp, { dmg: CLASH.drawDmg, launch: [10, 8], hitstop: 12, unblockable: true, big: true, beam: true, spark: 'smash' }, new THREE.Vector2(ax.x * sg, ax.z * sg).normalize());
      });
      return;
    }
    const WS = winner === 0 ? c.a : c.b, LS = winner === 0 ? c.b : c.a;
    const W = WS.f, L = LS.f, sg = winner === 0 ? 1 : -1;
    LS.obj?.kill();
    this.overwhelm(WS, L);
    L.takeHit(W, { dmg: CLASH.winDmg, minScale: 1, launch: [18, 10], hitstop: 18, unblockable: true, big: true, beam: true, wallBounce: true, spark: 'smash' }, new THREE.Vector2(ax.x * sg, ax.z * sg).normalize());
    this.fx.explosion(L.pos.x, L.pos.y + 0.9, L.pos.z, winner === 0 ? c.ca : c.cb);
    this.fx.crater(L.pos);
    this.fx.debris(L.pos.x, L.pos.z, 12, 1.2);
    audio.play('explosion', 1.4);
    audio.play('cheer');
    this.hud.callout(W.index, 'OVERWHELMED!', W.def.color, true);
  }

  // the winning ultimate goes on through: the beam runs its last stretch, the orb rolls over them, the beast roars on
  overwhelm(WS, L) {
    const W = WS.f;
    if (WS.kind === 'beam') {
      const bm = WS.obj;
      bm.clash = null;
      bm.spent = true; // the clash dealt the damage; the rest of the beam is the show
      bm.len = bm.origin.distanceTo(v3.set(L.pos.x, L.pos.y + 0.85, L.pos.z)) + 0.5;
      bm.t = ULTIMATE.duration - 30;
      bm.finished = true;
      W.setState('beamFire');
    } else if (WS.kind === 'orb') {
      const ob = WS.obj;
      ob.clash = null;
      ob.hit = true;
      ob.dir.set(L.pos.x - ob.pos.x, 0, L.pos.z - ob.pos.z);
      if (ob.dir.lengthSq() < 1e-4) ob.dir.set(W.face.x, 0, W.face.y);
      ob.dir.normalize();
      ob.t = Math.min(ob.t, ob.S.life * 60 - 45);
      if (W.pos.y > 0.05) { W.air = true; W.setState('air', 'jumpFall'); }
      else { W.landLag = 18; W.setState('land'); }
    } else resumeRampage(W, WS.S, WS.k);
  }

  endSpecialClash(winner) {
    this.spClashCool = CLASH.special.cooldown;
    if (winner < 0) { this.specialTrade(); return; }
    const W = this.fighters[winner], L = W.opp;
    // the winner's special goes through; it doesn't land a second time on the way out
    W.hitDone = true;
    if (W.state === 'attack' && W.move) W.t = Math.max(W.t, W.move.startup + W.move.active);
    W.vel.multiplyScalar(0.1);
    const d = new THREE.Vector2(L.pos.x - W.pos.x, L.pos.z - W.pos.z).normalize();
    L.takeHit(W, { dmg: CLASH.special.dmg, launch: [14, 9], hitstop: 16, unblockable: true, big: true, projectileHit: true, spark: 'smash', hitFlash: 'special' }, d);
    const col = new THREE.Color(W.move?.color ?? W.def.color);
    this.fx.explosion(L.pos.x, L.pos.y + 0.9, L.pos.z, col);
    this.fx.debris(L.pos.x, L.pos.z, 10, 1.1);
    audio.play('explosion', 1.1);
    audio.play('cheer');
    this.hud.callout(W.index, 'OVERPOWERED!', W.def.color, true);
  }

  // ------------------------------------------------------------ event hooks
  onHit(att, def, m, dmg) {
    const tx = att.pos.x - def.pos.x, tz = att.pos.z - def.pos.z;
    const tl = Math.hypot(tx, tz) || 1;
    // spark where the fist/foot actually met the body
    const hp = att.hitPoint;
    const x = hp ? hp.x : def.pos.x + (tx / tl) * 0.25, y = hp ? hp.y : def.pos.y + (m.low ? 0.5 : 0.85), z = hp ? hp.z : def.pos.z + (tz / tl) * 0.25;
    const dir = new THREE.Vector2(-tx / tl, -tz / tl);
    const kind = m.spark || (m.big ? 'heavy' : 'light');
    if (m.beam) {
      // beam ticks draw their own sparks
    } else if (m.special) {
      const col = new THREE.Color(m.color);
      this.fx.explosion(x, y, z, col);
      this.fx.crater(def.pos);
      this.fx.debris(def.pos.x, def.pos.z, 10, 1.1);
      audio.play('specialHit');
      this.cam.shake(0.9, dir);
      this.cam.zoomPunch(1);
      this.fx.overlay.impactFrame(3);
      this.fx.overlay.flash(m.color, 0.35);
      this.slowmo(0.3, 0.5);
      this.excite = 1;
      audio.play('cheer');
    } else if (kind === 'smash') {
      this.fx.hit(x, y, z, 'smash');
      audio.play('smash');
      this.cam.shake(m.shake ?? 0.6, dir);
      this.cam.zoomPunch(0.8);
      this.fx.overlay.flash('#ffffff', 0.25);
      this.slowmo(0.4, 0.18);
      this.excite = Math.min(1, this.excite + 0.5);
    } else if (kind === 'heavy') {
      this.fx.hit(x, y, z, 'heavy');
      audio.play('hitHeavy');
      this.cam.shake(m.shake ?? 0.4, dir);
      this.cam.zoomPunch(0.45);
      this.excite = Math.min(1, this.excite + 0.3);
    } else {
      this.fx.hit(x, y, z, 'light');
      audio.play('hit');
      this.cam.shake(0.14, dir);
      this.excite = Math.min(1, this.excite + 0.08);
    }
    if (m.launcher) audio.play('launch');
    if (def.combo === 10 || def.combo === 20) audio.play('cheer', 0.8);
    if (def.ko && !this.koTriggered) this.triggerKO(def, att);
  }

  onBlock(att, def, m) {
    const x = (att.pos.x + def.pos.x) / 2, z = (att.pos.z + def.pos.z) / 2;
    this.fx.blockSpark(x, def.pos.y + 0.85, z);
    audio.play('block');
    this.cam.shake(0.08);
  }

  // ------------------------------------------------------------ throws (ADR 0015)
  // Called on the throw's active frames: grab a grounded, throwable opponent in reach. Two throws meeting
  // break each other. Returns true when the throw is resolved (grabbed or broken).
  tryGrab(att) {
    const def = att.opp, T = THROW;
    if (def.ko || def.hidden || def.invuln > 0 || def.air || def.pos.y > 0.05 || att.air) return false;
    const R = this.cam.right, F = this.cam.fwd;
    const rx = def.pos.x - att.pos.x, rz = def.pos.z - att.pos.z;
    if (Math.abs(rx * R.x + rz * R.z) > T.range || Math.abs(rx * F.x + rz * F.z) > T.lane) return false;
    if (def.state === 'throw' && def.throwSt?.phase === 'reach') { this.breakThrow(att, def); return true; }
    const open = THROWABLE.has(def.state) || (def.state === 'attack' && def.move && def.t < def.move.startup && !def.move.air)
      || (def.state === 'kit' && THROWABLE_KIT.has(def.kitState?.kind));
    if (!open) return false;
    def.endMoveFx();
    def.move = null;
    def.counterT = 0;
    def.carry.set(0, 0);
    def.vel.set(0, 0, 0);
    def.heldT = T.hold + 6;
    def.grab = { by: att, t: 0 };
    def.setState('held', 'hurtHigh');
    att.throwSt.phase = 'hold';
    att.throwSt.t0 = att.t;
    att.throwSt.victim = def;
    const x = (att.pos.x + def.pos.x) / 2, z = (att.pos.z + def.pos.z) / 2;
    this.fx.spawn('ring', x, def.pos.y + 0.9, z, { scale: 1.1, color: 0xffe2a0, glow: 1, depthTest: false, order: 9 });
    this.freeze = Math.max(this.freeze, 3);
    this.cam.zoomPunch(0.3);
    audio.play('block', 0.8);
    return true;
  }

  // Throw break: Light + Heavy within the window (or two throws at once). No damage; both get pushed apart.
  breakThrow(att, def) {
    const T = THROW;
    const dx = def.pos.x - att.pos.x, dz = def.pos.z - att.pos.z, l = Math.hypot(dx, dz) || 1;
    for (const [f, s] of [[att, -1], [def, 1]]) {
      if (f.state === 'throw') f.releaseGrab();
      f.grab = null;
      f.heldT = 0;
      f.landLag = T.breakLag;
      f.setState('land');
      f.vel.set((dx / l) * T.push * s, 0, (dz / l) * T.push * s);
    }
    const x = (att.pos.x + def.pos.x) / 2, z = (att.pos.z + def.pos.z) / 2, y = def.pos.y + 0.9;
    this.fx.blockSpark(x, y, z);
    this.fx.spawn('ring', x, y, z, { scale: 1.4, color: 0xffffff, glow: 1.2, depthTest: false, order: 9 });
    this.hud.callout(def.index, 'BREAK!', '#ffe2a0');
    this.freeze = Math.max(this.freeze, 4);
    this.cam.shake(0.2);
    audio.play('block', 1.2);
  }

  // The toss: an unblockable hit that wall-bounces them (super dash or vanish can follow).
  throwHit(att, def) {
    if (!def || def.grab?.by !== att || def.ko) return;
    def.grab = null;
    def.heldT = 0;
    def.setState('idle', null); // a fresh hit, not part of a combo
    this.hud.callout(att.index, 'THROW!', att.def.color);
    def.takeHit(att, THROW.hit, att.face.clone());
  }

  // Parry (ADR 0014): a bright clang, a short world freeze to sell it, and the callout.
  onParry(def, att, m) {
    const near = m.projectileHit || att === def;
    const x = near ? def.pos.x + def.face.x * 0.45 : (att.pos.x + def.pos.x) / 2;
    const z = near ? def.pos.z + def.face.y * 0.45 : (att.pos.z + def.pos.z) / 2;
    const y = def.pos.y + 0.9;
    this.fx.blockSpark(x, y, z);
    this.fx.hitSpark(x, y, z, true, 0xbff4ff);
    this.fx.spawn('ring', x, y, z, { scale: 1.5, color: 0x9ff0ff, glow: 1.4, depthTest: false, order: 9 });
    this.fx.overlay.flash('#cff6ff', 0.3);
    this.hud.callout(def.index, 'PARRY!', '#9ff0ff', true);
    this.freeze = Math.max(this.freeze, DEFENSE.parry.freeze);
    this.cam.zoomPunch(0.5);
    this.cam.shake(0.22);
    audio.play('block', 1.4);
    audio.play('flash', 0.6);
    this.excite = Math.min(1, this.excite + 0.5);
  }

  // A spot dodge or air dodge made an attack, shot, beam or super pass through (ADR 0016): one callout per
  // dodge, so the viewer sees why nothing landed.
  onEvade(f) {
    if (f.dodgeCalled) return;
    f.dodgeCalled = true;
    this.hud.callout(f.index, f.state === 'airDodge' ? 'AIR DODGE!' : 'DODGE!', '#bfe8ff');
    this.excite = Math.min(1, this.excite + 0.3);
  }

  onGroundBounce(f) {
    this.fx.dust(f.pos, 1.6);
    this.fx.crater(f.pos);
    this.fx.debris(f.pos.x, f.pos.z, 9, 1);
    this.fx.ring(f.pos, '#fff3d0', 1.4);
    audio.play('groundBounce');
    this.cam.shake(0.5);
    f.hitstop = Math.max(f.hitstop, 5);
  }

  onWallBounce(f, axis, sign) {
    this.fx.barrier(f.pos, axis, sign);
    this.fx.hit(f.pos.x, f.pos.y + 0.8, f.pos.z, 'heavy', 0xbfe8ff);
    audio.play('wallBounce');
    this.cam.shake(0.5);
    f.hitstop = Math.max(f.hitstop, 7);
    f.shaking = true;
  }

  onVanish(f, phase) {
    if (phase === 'out') {
      this.fx.smoke(f.pos.x, f.pos.y + 0.6, f.pos.z, 1.2);
      this.fx.spawn('lines', f.pos.x, f.pos.y + 0.8, f.pos.z, { scale: 1.2, glow: 0.6, depthTest: false, order: 8 });
      audio.play('vanish');
      this.hud.callout(f.index, 'VANISH!', f.def.color);
    } else {
      this.fx.spawn('star', f.pos.x, f.pos.y + 0.9, f.pos.z, { scale: 1.2, glow: 2, depthTest: false, order: 9 });
      this.fx.spawn('ring', f.pos.x, f.pos.y + 0.8, f.pos.z, { scale: 1.2, glow: 1, color: f.def.color, depthTest: false, order: 8 });
      f.actor.ghost(f.def.color, 0.3, 0.6);
      audio.play('vanishIn');
      this.freeze = Math.max(this.freeze, 5);
    }
  }

  // DBFZ super flash: freeze time, darken the stage, flash the user, cut-in
  superFlashFor(f, len, dim, cutin = false, name = f.def.beam.name) {
    this.freeze = Math.max(this.freeze, len);
    this.superFlash = { who: f, t: 0, len };
    this.dimTarget = dim;
    if (cutin) this.hud.superCutin(f.index, f.asset?.cutin, f.def.color, name);
    audio.play('flash');
  }

  onSpecialStart(f, m) {
    this.hud.callout(f.index, m.name, m.color);
    this.superFlashFor(f, 12, 0.45);
    this.cam.zoomPunch(0.4);
  }

  onUltimateStart(f, counter) {
    this.arena.npcCue('ultimate');
    this.cam.set('focus', f);
    this.superFlashFor(f, counter ? CLASH.answerFlash : ULTIMATE.flash, 0.72, true);
    this.fx.overlay.flash(f.def.color, 0.4);
    this.excite = 1;
    if (counter) this.hud.announce('COUNTER!', 'clash', 700);
  }

  triggerKO(loser, winner) {
    this.arena.npcCue('ko');
    this.koTriggered = true;
    this.inputLive = false;
    this.roundWinner = winner;
    this.setState('ko');
    this.slowmo(0.22, 1.4);
    this.hud.announce('K.O.', 'ko', 1900);
    this.endDomain();
    audio.play('ko');
    audio.duckMusic('ko', true);
    audio.play('cheer', 1.4);
    this.excite = 1;
    this.cam.set('ko', loser);
    this.fx.overlay.flash('#ffffff', 0.9);
    this.fx.overlay.impactFrame(5);
    this.fx.debris(loser.pos.x, loser.pos.z, 12, 1.2);
    for (const b of this.beams) if (b.owner === loser) b.kill();
    for (const ob of this.orbs) if (ob.owner === loser) ob.kill();
  }

  onKOCrash(f, speed) {
    this.arena.npcCue('crash');
    const y = f.pos.y + 0.8;
    this.fx.explosion(f.pos.x, y, f.pos.z, new THREE.Color(0xfff0d0));
    this.fx.debris(f.pos.x, f.pos.z, 16, 1.4);
    for (let k = 0; k < 4; k++) this.fx.smoke(f.pos.x + (Math.random() - 0.5), y + Math.random(), f.pos.z + (Math.random() - 0.5), 1.4);
    this.fx.overlay.flash('#ffffff', 0.5);
    this.cam.shake(1);
    audio.play('explosion', 1.2);
    audio.play('cheer', 1.4);
    this.excite = 1;
    void speed;
  }

  onKOLanded(f) {
    this.fx.crater(f.pos);
    this.fx.dust(f.pos, 2);
    this.cam.shake(0.5);
    audio.play('groundBounce');
  }

  timeUp() {
    this.inputLive = false;
    const [a, b] = this.fighters;
    this.setState('timeup');
    this.hud.announce('TIME!', 'time', 1500);
    audio.play('gong');
    this.roundWinner = a.hp === b.hp ? null : a.hp > b.hp ? a : b;
  }

  slowmo(scale, dur) {
    this.timeScale = Math.min(this.timeScale, scale);
    this.slowT = Math.max(this.slowT, dur);
  }

  // ------------------------------------------------------------ match flow (real time)
  flow() {
    const t = this.stateT;
    const once = (k) => (this.flowFlags[k] ? false : (this.flowFlags[k] = true));
    switch (this.state) {
      case 'intro':
        if (t > 3.9 && once('cards')) {
          this.hud.showCards(true);
          audio.play('taiko');
        }
        if (t > this.cam.introDur + 0.2) {
          this.hud.showCards(false);
          this.beginRound();
        }
        break;
      case 'roundIntro': {
        const wins = this.fighters.map((f) => f.wins);
        const final = wins[0] === ROUNDS_TO_WIN - 1 && wins[1] === ROUNDS_TO_WIN - 1;
        if (t > 0.3 && once('round')) {
          this.hud.announce(final ? 'FINAL ROUND' : `ROUND ${this.round}`, 'round', 1100);
          audio.play('taiko');
          audio.setCrowd(0.1);
        }
        if (t > 1.6 && once('fight')) {
          this.hud.announce('FIGHT!', 'fight', 800);
          audio.play('gong');
          audio.play('cheer');
          this.excite = 0.8;
          this.arena.npcCue('roundStart');
          this.inputLive = true;
          for (const p of this.pads) p.clear();
          this.setState('fight');
        }
        break;
      }
      case 'fight':
        break;
      case 'ko': {
        const loser = this.roundWinner.opp;
        if ((loser.koLanded || t > 4) && t > 2.2 && once('win')) this.roundOver(this.roundWinner);
        break;
      }
      case 'timeup':
        if (t > 1.8 && once('win')) {
          if (this.roundWinner) this.roundOver(this.roundWinner);
          else {
            this.hud.announce('DRAW', 'time', 1500);
            this.setState('draw');
          }
        }
        break;
      case 'draw':
        if (t > 2) this.nextRound();
        break;
      case 'roundEnd':
        if (t > 3.4 && once('next')) {
          const w = this.roundWinner;
          if (w.wins >= ROUNDS_TO_WIN) this.matchEnd(w);
          else this.nextRound();
        }
        break;
      case 'matchEnd':
        this.roundWinner.setSide(1); // the hero shot faces screen-right (unmirrored), whatever the sway does
        if (t > 1.6 && once('menu')) {
          const w = this.roundWinner;
          this.setState('results');
          audio.startMusic('menu');
          this.hud.show(false);
          this.hud.clearAnnounce();
          this.menus.results(w,
            () => this.startMatch(this.cfg),
            () => this.toMenu(() => this.menus.charSelect(this.cfg.mode)),
            () => this.quitToTitle());
        }
        break;
      case 'results':
        this.roundWinner.setSide(1);
        break;
    }
  }

  roundOver(w) {
    this.arena.npcCue('roundEnd');
    w.wins++;
    this.setState('roundEnd');
    this.timeScale = 1;
    this.slowT = 0;
    w.setState('win');
    w.face.set(Math.sin(this.cam.yaw), Math.cos(this.cam.yaw));
    this.cam.set('victory', w);
    this.hud.announce(`${w.def.name} WINS`, 'win', 2600);
    audio.play('cheer', 1.3);
    audio.duckMusic('ko', false);
    this.excite = 1;
  }

  matchEnd(w) {
    this.setState('matchEnd');
    this.hud.announce(`${w.def.name}`, 'win', 0);
    // Hard cut to the results hero shot: only the winner (DBFZ-style), so the loser leaves on the cut. Their
    // actor is disposed by cleanupMatch and Fighter.reset shows the fresh one, so rematch / character select /
    // title restore it. A running power-up mode or burn would keep sparking over the empty spot, so they end too.
    const o = w.opp;
    o.mode = null;
    o.burn = null;
    o.actor.setVisible(false);
    this.cam.set('results', w);
    this.cam.snap();
  }

  // ------------------------------------------------------------ render
  render(dt) {
    const alpha = this.freeze > 0 ? 1 : this.alpha;
    for (const f of this.fighters) f.sync(this.camera, this.cam.right, alpha, this.time);
    this.cam.update(this.paused ? 0 : dt, this);
    for (const f of this.fighters) {
      f.sync(this.camera, this.cam.right, alpha, this.time);
      if (!this.paused) f.actor.updateGhosts(dt);
      if (this.showBoxes && !f.boxViewer) f.boxViewer = new BoxViewer(f.actor);
      if (f.boxViewer) {
        f.boxViewer.visible = this.showBoxes;
        if (this.showBoxes) f.boxViewer.update(DEFAULT_HURT);
      }
    }
    for (const b of this.beams) b.sync(this.camera, this.time);
    if (!this.paused) {
      this.fx.update(dt * Math.max(0.4, this.timeScale), this.camera);
      if (this.fx.overlay.lines > 0.02 && this.linesFocus) {
        const f = this.clash ? null : this.linesFocus;
        const p = f ? v3.set(f.pos.x, RING_TOP + f.pos.y + 0.9, f.pos.z) : v3.copy(this.clash ? this.clash.point : new THREE.Vector3()).setY((this.clash?.point.y || 0) + RING_TOP);
        p.project(this.camera);
        this.fx.overlay.focus = [(p.x + 1) / 2, (1 - p.y) / 2];
      }
    }
    // stage dimming for super flashes
    this.dim += (this.dimTarget - this.dim) * Math.min(1, dt * (this.dimTarget > this.dim ? 18 : 5));
    this.arena.setDim(this.dim);
    this.room.setDim(this.dim);
    this.voidStage.setDim(this.dim);
    this.excite = Math.max(0.12, this.excite - dt * 0.22);
    audio.setMusicIntensity(this.state === 'fight' || this.training ? this.excite : 0.2);
    this.arena.update(performance.now() / 1000, this.excite);
    this.room.update(performance.now() / 1000);
    if (this.domain) this.voidStage.update(performance.now() / 1000);
    if (this.fighters.length === 2) this.hud.update(this.fighters, this.timeLeft, dt);
    this.menus.tick?.(dt);
    if (this.touch) {
      // on-screen controls only while there is something to control (CPU vs CPU keeps just the pause button)
      const live = this.input.lastDevice === 'touch' && this.fighters.length === 2 && !this.paused &&
        (this.state === 'fight' || this.state === 'roundIntro' || this.state === 'training');
      this.touch.setVisible(live);
      this.touch.setSpectate(this.watching);
      if (live) this.touch.setKi(this.fighters[0].ki);
    }
    // keep the fight centered in the space the training panel / touch buttons leave free, and the results
    // screen's winner in the space beside (or above) the results panel
    const touchUi = !!this.touch?.visible && !this.watching;
    const res = this.menus.resultsCover();
    const cover = Math.max(this.training && !this.paused ? this.menus.panelCover() : 0, touchUi ? 0.16 : 0, res.x);
    const k = Math.min(1, dt * 8);
    this.viewCover += (cover - this.viewCover) * k;
    this.viewLift += (Math.max(touchUi ? 0.07 : 0, res.y / 2) - this.viewLift) * k; // lift the action above the bottom buttons
    this.viewCoverY += (res.y - this.viewCoverY) * k;
    if (this.viewCover > 0.002 || this.viewLift > 0.002) this.camera.setViewOffset(1, 1, this.viewCover / 2, this.viewLift, 1, 1);
    else if (this.camera.view?.enabled) this.camera.clearViewOffset();
    this.renderer.render(this.scene, this.camera);
  }
}
