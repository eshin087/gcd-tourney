import * as THREE from 'three';
import { buildArena, loadCrowdAtlas } from '../world/arena.js';
import { loadStageArt, loadNpcArt, loadUiArt } from '../world/worldArt.js';
import { loadArtIndex } from '../core/artIndex.js';
import { buildTrainingRoom } from '../world/trainingRoom.js';
import { buildVoidStage } from '../world/voidStage.js';
import { Effects } from './effects.js';
import { CameraDirector } from './camera.js';
import { Fighter } from './fighter.js';
import { makeBrain, DummyBrain } from './ai.js';
import { Beam, Vortex, spawnProjectiles } from './projectiles.js';
import { ULTIMATE, DEFENSE, THROW } from './moves.js';
import { Pad } from '../core/input.js';
import { audio } from '../core/audio.js';
import { Hud } from '../ui/hud.js';
import { Menus } from '../ui/menus.js';
import { deviceLayout, matchHint, clashHint } from '../ui/controls.js';
import { ROSTER, getChar } from '../characters/index.js';
import { loadFighterAsset } from './sprites.js';
import { BoxViewer } from './boxViewer.js';
import { DT, ROUND_TIME, ROUNDS_TO_WIN, RING_TOP, ARENA_LIMIT } from './constants.js';

const v3 = new THREE.Vector3();
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
    this.pendingMelee = []; // melee hits found this frame, applied together (resolveMelee)
    this.clash = null;
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
    audio.startMusic('battle');
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
  onKitMove(f, m) {
    if (!m.name) return;
    this.hud.callout(f.index, m.name, m.color || f.def.color);
    this.superFlashFor(f, 8, 0.3);
    this.cam.zoomPunch(0.25);
  }

  onSuperStart(f, S) {
    this.arena.npcCue('super');
    this.superFlashFor(f, S.flash, 0.78, true, S.name);
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
    this.hud.announce('UNLIMITED VOID', 'clash', 1500);
    this.fx.overlay.flash('#ffffff', 0.9);
    this.fx.overlay.impactFrame(4);
    this.cam.shake(0.6);
    audio.play('gong');
    this.excite = 1;
  }

  endDomain() {
    if (!this.domain) return;
    this.domain = null;
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
    this.projectiles = [];
    this.beams = [];
    this.clash = null;
    audio.stopAllLoops();
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
  }

  resetRound() {
    const [a, b] = this.fighters;
    a.reset(-3.4, 0.3);
    b.reset(3.4, -0.3);
    this.faceEachOther();
    for (const p of this.projectiles) p.kill();
    for (const bm of this.beams) bm.kill();
    for (const v of this.vortices) v.kill();
    this.projectiles = [];
    this.beams = [];
    this.vortices = [];
    this.pendingMelee = [];
    if (this.domain) { this.domain = null; this.setStage(this.training ? 'training' : 'arena'); }
    if (this.clash) { this.clash = null; audio.stopLoop('clash'); }
    this.hud.clash(false);
    audio.stopAllLoops();
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
    this.fx.overlay.clear();
    this.menus.pause(() => this.resume(), () => this.quitToTitle(), this.training);
  }

  resume() {
    this.paused = false;
    if (audio.sfx) audio.sfx.gain.value = 0.9;
    this.menus.hide();
    for (const p of this.pads) p.clear();
    this.input.flush(); // the RESUME confirm press must not also jump / attack
    if (this.training) this.menus.trainingPanel();
    else if (this.fighters.length === 2) this.hud.hint.innerHTML = matchHint(this.cfg.mode, deviceLayout(this.input)); // bindings may have changed
  }

  exitTraining() {
    this.paused = false;
    if (audio.sfx) audio.sfx.gain.value = 0.9;
    this.cleanupMatch();
    this.setState('menu');
    this.cam.set('orbit');
    audio.startMusic('menu');
    audio.setCrowd(0.05);
    this.menus.modeSelect(this.menus.modeIndex('training'));
  }

  quitToTitle() {
    this.paused = false;
    if (audio.sfx) audio.sfx.gain.value = 0.9;
    this.cleanupMatch();
    this.setState('menu');
    this.cam.set('orbit');
    audio.startMusic('menu');
    audio.setCrowd(0.05);
    this.menus.title();
  }

  fixedUpdate() {
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
    if (this.freeze > 0) {
      // super flash: the world holds its breath (inputs still buffer)
      this.freeze--;
      for (const f of this.fighters) f.prev.copy(f.pos);
      this.fxTicks();
      return;
    }
    for (const f of this.fighters) f.update();
    this.resolveMelee();
    this.separate();
    this.checkSpecialClash();
    for (const p of this.projectiles) p.update();
    this.projectileCollisions();
    this.projectiles = this.projectiles.filter((p) => !p.dead);
    for (const v of this.vortices) v.update();
    this.vortices = this.vortices.filter((v) => !v.dead);
    if (this.domain && --this.domain.t <= 0) this.endDomain();
    for (const b of this.beams) b.update();
    this.checkBeamClash();
    if (this.clash) this.updateClash();
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

  fxTicks() {
    let lines = 0;
    for (const f of this.fighters) {
      if (f.state === 'charge') this.fx.auraTick(f, 1, this.cam.right);
      else if (f.state === 'beamCharge') {
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
    if (!def.hittable) return;
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

  checkSpecialClash() {
    const [a, b] = this.fighters;
    const act = (f) => f.state === 'attack' && f.move?.special && f.t >= f.move.startup && f.t < f.move.startup + f.move.active;
    if (!act(a) || !act(b)) return;
    if (Math.hypot(a.pos.x - b.pos.x, a.pos.z - b.pos.z) > 1.6) return;
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
      f.takeHit(o, { dmg: 60, launch: [12, 8], hitstop: 16, unblockable: true, big: true, projectileHit: true, spark: 'smash' }, d);
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

  checkBeamClash() {
    if (this.clash) return;
    const A = this.beams.find((b) => b.owner.index === 0 && !b.dead && b.fade >= 1);
    const B = this.beams.find((b) => b.owner.index === 1 && !b.dead && b.fade >= 1);
    if (!A || !B) return;
    if (A.dir.dot(B.dir) > -0.4) return;
    const span = A.origin.distanceTo(B.origin);
    if (A.len + B.len >= span - 0.4) this.startClash(A, B);
  }

  startClash(A, B) {
    this.arena.npcCue('clash');
    const span = A.origin.distanceTo(B.origin);
    const c = { a: A, b: B, t: THREE.MathUtils.clamp(A.len / (A.len + B.len), 0.3, 0.7), timer: 0, point: new THREE.Vector3(), span };
    this.clash = c;
    A.clash = B.clash = c;
    A.dir.copy(B.origin).sub(A.origin).normalize();
    B.dir.copy(A.dir).negate();
    for (const f of this.fighters) {
      f.setState('clash', 'beamFire');
      f.invuln = 99999;
      f.pad.clear();
    }
    this.cam.set('clash', c);
    const [fa, fb] = this.fighters;
    const hint = clashHint(this.cfg.mode, deviceLayout(this.input));
    this.hud.clash(true, c.t, [fa.def.beam.mid, fb.def.beam.mid], hint);
    this.hud.announce('CLASH!', 'clash', 900);
    audio.loop('clash', 'clash');
    audio.play('explosion', 0.6);
    this.fx.overlay.flash('#ffffff', 0.6);
    this.excite = 1;
    audio.play('cheer');
  }

  updateClash() {
    const c = this.clash;
    c.timer++;
    const ra = this.fighters[0].pad.mashRate(), rb = this.fighters[1].pad.mashRate();
    c.t += (ra - rb) * 0.00105 + Math.sin(c.timer * 0.11) * 0.0011 + (Math.random() - 0.5) * 0.0016;
    c.t = THREE.MathUtils.clamp(c.t, 0, 1);
    const span = c.a.origin.distanceTo(c.b.origin);
    c.a.len = span * c.t;
    c.b.len = span * (1 - c.t);
    c.point.copy(c.a.origin).addScaledVector(c.a.dir, c.a.len);
    const p = c.point;
    const pulse = 1 + Math.sin(c.timer * 0.6) * 0.12;
    const ca = new THREE.Color(this.fighters[0].def.beam.mid), cb = new THREE.Color(this.fighters[1].def.beam.mid);
    const mixc = ca.clone().lerp(cb, 0.5);
    this.fx.keep('clashGlow', 'glow', p.x, p.y, p.z, { scale: 1.35 * pulse, color: mixc, opacity: 1, order: 7, depthTest: false, glow: 1.2 });
    this.fx.keep('clashCore', 'glow', p.x, p.y, p.z, { scale: 0.75 * pulse, color: 0xffffff, opacity: 1, order: 8, depthTest: false, glow: 2 });
    const lt = this.fx.keep('clashBolt', 'lightning', p.x, p.y, p.z, { scale: 1.3, color: 0xffffff, order: 9, depthTest: false, glow: 2 });
    lt.random = true;
    lt.rot = Math.random() * 6.28;
    if (c.timer % 10 === 0) this.fx.spawn('ring', p.x, p.y, p.z, { scale: 1.5, color: mixc, order: 6, depthTest: false, glow: 1 });
    if (c.timer % 3 === 0) {
      const a = Math.random() * Math.PI * 2;
      this.fx.spawn('star', p.x, p.y, p.z, { scale: 0.3, frame: 2, vel: [Math.cos(a) * 5, Math.sin(a) * 4 + 2, (Math.random() - 0.5) * 5], grav: 8, life: 0.4, color: Math.random() < 0.5 ? ca : cb, depthTest: false, order: 9, glow: 1.5 });
    }
    if (c.timer % 14 === 0) this.fx.smoke(p.x + (Math.random() - 0.5) * 2, 0.2, p.z + (Math.random() - 0.5) * 2, 1);
    if (c.timer % 20 === 0) this.fx.debris(p.x, p.z, 3, 0.7);
    this.hud.clash(true, c.t);
    this.excite = 1;
    if (c.t >= 0.96) this.endClash(0);
    else if (c.t <= 0.04) this.endClash(1);
    else if (c.timer > 60 * 9) this.endClash(-1);
  }

  endClash(winner) {
    const c = this.clash;
    this.clash = null;
    audio.stopLoop('clash');
    this.hud.clash(false);
    const P = c.point.clone();
    this.fx.overlay.impactFrame(4);
    this.fx.overlay.flash('#ffffff', 0.9);
    this.cam.set('fight');
    this.cam.shake(1);
    this.slowmo(0.3, 0.8);
    for (const f of this.fighters) f.invuln = 0;
    if (winner < 0) {
      this.fx.explosion(P.x, P.y, P.z, new THREE.Color(0xffffff));
      this.fx.debris(P.x, P.z, 14, 1.3);
      audio.play('explosion', 1.3);
      c.a.kill();
      c.b.kill();
      for (const f of this.fighters) {
        const o = f.opp;
        const d = new THREE.Vector2(f.pos.x - o.pos.x, f.pos.z - o.pos.z).normalize();
        f.state = 'hitstun';
        f.takeHit(o, { dmg: 90, launch: [10, 8], hitstop: 12, unblockable: true, big: true, beam: true, spark: 'smash' }, d);
      }
      return;
    }
    const W = this.fighters[winner], L = W.opp;
    const wb = winner === 0 ? c.a : c.b, lb = winner === 0 ? c.b : c.a;
    lb.kill();
    wb.clash = null;
    wb.len = c.span;
    wb.t = ULTIMATE.duration - 30;
    wb.finished = true;
    W.setState('beamFire');
    L.state = 'hitstun';
    const d = new THREE.Vector2(wb.dir.x, wb.dir.z).normalize();
    L.takeHit(W, { dmg: 280, launch: [18, 10], hitstop: 18, unblockable: true, big: true, beam: true, wallBounce: true, spark: 'smash' }, d);
    this.fx.explosion(L.pos.x, L.pos.y + 0.9, L.pos.z, new THREE.Color(W.def.beam.mid));
    this.fx.crater(L.pos);
    this.fx.debris(L.pos.x, L.pos.z, 12, 1.2);
    audio.play('explosion', 1.4);
    audio.play('cheer');
    this.hud.callout(W.index, 'OVERWHELMED!', W.def.color, true);
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
    this.superFlashFor(f, ULTIMATE.flash, 0.72, true);
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
    audio.play('cheer', 1.4);
    this.excite = 1;
    this.cam.set('ko', loser);
    this.fx.overlay.flash('#ffffff', 0.9);
    this.fx.overlay.impactFrame(5);
    this.fx.debris(loser.pos.x, loser.pos.z, 12, 1.2);
    for (const b of this.beams) if (b.owner === loser) b.kill();
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
        if (t > 1.6 && once('menu')) {
          const w = this.roundWinner;
          this.setState('results');
          this.hud.show(false);
          this.hud.clearAnnounce();
          this.menus.results(w, this.assets[w.index],
            () => this.startMatch(this.cfg),
            () => { this.cleanupMatch(); this.setState('menu'); this.cam.set('orbit'); audio.startMusic('menu'); this.menus.charSelect(this.cfg.mode); },
            () => this.quitToTitle());
        }
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
    this.excite = 1;
  }

  matchEnd(w) {
    this.setState('matchEnd');
    this.hud.announce(`${w.def.name}`, 'win', 0);
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
    // keep the fight centered in the space the training panel / touch buttons leave free
    const touchUi = !!this.touch?.visible && !this.watching;
    const cover = Math.max(this.training && !this.paused ? this.menus.panelCover() : 0, touchUi ? 0.16 : 0);
    const k = Math.min(1, dt * 8);
    this.viewCover += (cover - this.viewCover) * k;
    this.viewLift += ((touchUi ? 0.07 : 0) - this.viewLift) * k; // lift the action above the bottom buttons
    if (this.viewCover > 0.002 || this.viewLift > 0.002) this.camera.setViewOffset(1, 1, this.viewCover / 2, this.viewLift, 1, 1);
    else if (this.camera.view?.enabled) this.camera.clearViewOffset();
    this.renderer.render(this.scene, this.camera);
  }
}
