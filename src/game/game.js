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
import { ULTIMATE, DEFENSE, THROW, CLASH, PROJECTILES, MELEE_CLASH } from './moves.js';
import { makeChart, beatChart, seedOf, Judge } from './clash.js';
import { kitOf, rushBody, formingOrb, releaseOrb, clashFx, resumeRampage, isEnergy, ENERGY_LOCK } from './kit.js';
import { ShowDirector } from './showDirector.js';
import { Pad } from '../core/input.js';
import { audio } from '../core/audio.js';
import { Hud, TAGS } from '../ui/hud.js';
import { Menus } from '../ui/menus.js';
import { deviceLayout, matchHint, clashHint } from '../ui/controls.js';
import { ROSTER, getChar } from '../characters/index.js';
import { loadFighterAsset } from './sprites.js';
import { BoxViewer } from './boxViewer.js';
import { DT, ROUND_TIME, ROUNDS_TO_WIN, RING_TOP, ARENA_LIMIT, MAX_KI } from './constants.js';

const v3 = new THREE.Vector3();
// one victim's running combo, for the HUD's ticker and rating (Game.trackCombos, ADR 0026)
const newCombo = () => ({ hits: 0, dmg: 0, kinds: new Set(), wall: 0, ground: 0, vanish: 0, start: 0 });

// closest distance between segments p1-q1 and p2-q2 (Ericson, Real-Time Collision Detection 5.1.9), for clash bodies
const sd1 = new THREE.Vector3(), sd2 = new THREE.Vector3(), sdr = new THREE.Vector3(), sdc = new THREE.Vector3();
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const clashTmp = new THREE.Vector3();
const meleeAt = new THREE.Vector3(); // where two swings met (meleeClash)
const burstCol = new THREE.Color();
const TECH_SPARK = 0xc8f8ff; // the timed impact tech's white-cyan (ADR 0028)
const ORB_HANDS = 0.9; // Hollow Purple forms this far ahead of Gojo (kit.js formOrb)
const BEAM_STUB = 0.7; // a beam pushed all the way back still leaves the hands
// BEAM CLASH (ADR 0027): the reused body lists (checkEnergyClash runs a few times a frame); the states a fighter can be
// locked into one from are kit.js ENERGY_LOCK, shared with the CPUs' canBeamClashNow
const bodiesA = [], bodiesB = [];
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
    this.meleeChain = { n: 0, at: -1e9 }; // the running MELEE CLASH chain: clashes in it, frame of the last (ADR 0034)
    this.meleeFxF = 0; // frames left of a melee clash's speed lines and stage dim (clashMoment)
    this.meleeFocus = { pos: new THREE.Vector3() }; // where those speed lines center (a stand-in for linesFocus' fighter)
    this.clash = null;
    this.spClashCool = 0; // frames until two specials may clash again (a rush-off can't stall the round)
    this.struggleCool = 0; // frames until the next BEAM CLASH (ADR 0027)
    this.director = null; // CPU vs CPU only: cues one beam clash per match (showDirector.js)
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
    this.dummyOpts = { tech: 'never', burst: false }; // the training dummy's combo escape (ADR 0022, DummyBrain)
    // keep the on-screen button hints in sync with the device being used
    input.onDevice((d) => {
      if (this.fighters.length === 2 && !this.training) this.hud.hint.innerHTML = matchHint(this.cfg.mode, d);
    });
  }

  async init() {
    await loadArtIndex();
    await this.fx.loadCustom();
    await this.fx.ground.loadCustom();
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
    this.fx.ground.prepare(this.fighters, this.renderer.renderer); // their decal pages, uploaded now
    this.pads = [new Pad(), new Pad()];
    this.fighters.forEach((f, i) => { f.pad = this.pads[i]; f.wins = 0; });
    // 'solo': P1 human vs CPU. 'cpu': spectate two CPUs at the same level (defaults to impossible, the
    // point being to watch what the strongest bots can do). 'versus': two humans.
    const level = cfg.level || (cfg.mode === 'cpu' ? 'impossible' : 'normal');
    // the match seed (ADR 0026): the CPUs' combo personas and routes; `?seed=` (cfg.seed) replays a match's draws
    this.seed = cfg.seed != null ? cfg.seed >>> 0 : (Math.random() * 4294967296) >>> 0;
    this.comboLog = []; // the CPUs' recent combo routes (aiCombo.js keeps them from repeating each other)
    this.matchNo = (this.matchNo ?? 0) + 1;
    this.brains = cfg.mode === 'solo' ? [null, makeBrain(this.fighters[1], level, false, this.brainSeed(1))]
      : cfg.mode === 'cpu' ? this.fighters.map((f, i) => makeBrain(f, level, true, this.brainSeed(i)))
      : [null, null];
    this.director = this.watching ? new ShowDirector(this) : null; // spectator-only choreography (ADR 0027)
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
    this.fx.ground.prepare(this.fighters, this.renderer.renderer);
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

  // one side's share of the match seed (spread by the golden ratio, so the two CPUs never draw alike)
  brainSeed(i) {
    return ((this.seed ?? 0) ^ Math.imul(i + 1, 0x9e3779b9)) >>> 0;
  }

  // 'arena' (tournament grounds) or 'training' (holographic practice room)
  setStage(kind) {
    this.arena.group.visible = kind === 'arena';
    this.room.group.visible = kind === 'training';
    this.voidStage.group.visible = kind === 'void';
    this.fx.ground.setSurface(kind, kind === 'training' ? this.room.surface : this.arena.surface);
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
    this.comboChip(f, m.name); // a kit special mid-combo (shot, teleport, pull, dive)
    this.hud.callout(f.index, m.name, m.color || f.def.color);
    this.superFlashFor(f, 8, 0.3);
    this.cam.zoomPunch(0.25);
  }

  // `answer`: fired into the opponent's running ultimate, so a short flash (they can meet, ADR 0017)
  onSuperStart(f, S, answer = false) {
    this.comboChip(f, 'SUPER', 'super'); // a three-bar finisher on the end of a combo
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
    this.struggleCool = 0;
    this.director = null;
    this.combos = null;
    this.comboF = this.fightF = 0;
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
    this.meleeChain = { n: 0, at: -1e9 };
    this.meleeFxF = 0;
    if (this.domain) { this.domain = null; this.setStage(this.training ? 'training' : 'arena'); }
    if (this.clash) { this.clash = null; audio.stopLoop('clash'); }
    this.spClashCool = 0;
    this.struggleCool = 0;
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
    this.director?.update();
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
    this.trackCombos();
    if (this.spClashCool > 0) this.spClashCool--;
    if (this.struggleCool > 0) this.struggleCool--;
    this.checkSpecialClash();
    this.checkUltimateClash(); // where the fighters stand now, before an orb's own hit test can land first
    this.checkEnergyClash(); // before the shots move: one can't hit (or be stopped by Infinity) before it meets its answer
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
    this.checkEnergyClash();
    this.beams = this.beams.filter((b) => !b.dead);
    this.fxTicks();
    if (this.training) {
      for (const f of this.fighters) {
        if (this.trainingCfg.infiniteKi && f.index === 0) f.ki = Math.max(f.ki, 300);
        // refill once nothing has touched them for a moment (works for a hopping or fighting dummy too)
        f.sinceHit = (f.sinceHit ?? 999) + 1;
        const reeling = f.state === 'hitstun' || f.state === 'launched' || f.state === 'down' || f.state === 'getup' || f.state === 'block';
        if (f.sinceHit > 50 && f.combo === 0 && !reeling && f.hp < 1000) f.hp = Math.min(1000, f.hp + 25);
        if (f.sinceHit > 50 && !reeling && f.state !== 'burst') f.burstUsed = 0; // no rounds here: the burst comes back
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

  // Combos for the spectator feedback (ADR 0026), in every match: each victim's running combo (hits, damage, the
  // techniques in it), the HUD's ticker chips, the rating when it ends, and the share of fight time spent in combos
  // (the CPU combo composer's governor reads it, aiCombo.js).
  trackCombos() {
    const T = this.combos || (this.combos = [newCombo(), newCombo()]);
    let any = false;
    for (let i = 0; i < 2; i++) {
      const d = this.fighters[i], C = T[i];
      const live = d.combo > 0 && !d.ko && (d.state === 'hitstun' || d.state === 'launched' || (d.state === 'held' && !d.grab && C.hits > 0));
      if (C.hits && (!live || d.combo < C.hits)) {
        // the KO'ing hit ends the combo the frame it lands (or the next, for a shot): count it in the rating
        if (d.ko && d.combo > C.hits) { C.hits = d.combo; C.dmg = d.comboDmg; }
        this.onComboEnd(d.opp, d, C);
        T[i] = newCombo();
      }
      if (!live) continue;
      any = true;
      const N = T[i];
      if (!N.hits) { N.start = this.frameNo; this.hud.comboStart(d.opp.index); }
      N.hits = d.combo;
      N.dmg = d.comboDmg;
    }
    if (this.state === 'fight' && this.inputLive) {
      this.fightF = (this.fightF ?? 0) + 1;
      if (any) this.comboF = (this.comboF ?? 0) + 1;
    } else if (this.state !== this.trackedState && this.trackedState === 'fight' && this.debugCombos && window.roundRecs) {
      window.roundRecs.push({ match: this.matchNo ?? 0, round: this.round, dur: +(ROUND_TIME - this.timeLeft).toFixed(1), end: this.state, comboF: this.comboF, fightF: this.fightF });
    }
    this.trackedState = this.state;
  }

  // the share of this match's fight time spent in a combo (0.4 until there's enough to say)
  comboShare() {
    return this.fightF > 600 ? this.comboF / this.fightF : 0.4;
  }

  // a technique in att's running combo: a chip in the combo ticker under their counter (`kind` groups it for STYLISH)
  comboChip(att, label, kind = label) {
    const C = this.combos?.[1 - att.index];
    if (!C || !C.hits) return;
    C.kinds.add(kind);
    this.hud.comboTag(att.index, label);
  }

  // A combo ended: the rating (GREAT 10+, AMAZING 15+, LEGENDARY 20+ hits, STYLISH! with 4+ different techniques)
  // and a cheer that grows with it.
  onComboEnd(att, def, C) {
    const rated = this.hud.comboEnd(att.index, C.hits, C.kinds.size);
    if (C.hits >= 8) audio.play('cheer', Math.min(1.4, 0.3 + C.hits * 0.05));
    if (rated) this.excite = 1;
    if (this.debugCombos && window.comboRecs) {
      window.comboRecs.push({
        match: this.matchNo ?? 0, att: att.def.id, hits: C.hits, dmg: C.dmg, kinds: [...C.kinds], wall: C.wall, ground: C.ground,
        vanish: C.vanish, frames: this.frameNo - C.start, blue: !!def.comboBlue, end: def.ko ? 'ko' : def.state, rated,
      });
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
      const held = f.state === 'clash' ? this.clashHand(f) : null;
      if (f.state === 'attack' && f.move?.fx) {
        const m = f.move;
        const t = f.t, A = m.startup, B = A + m.active;
        const phase = t < A ? 0 : t < B ? 1 : 2;
        if (phase < 2 || (f.moveHit && t < B + 6)) this.fx.handTick(f, m.fx, phase, t / A);
        else this.fx.dropHand(f);
      } else if (held) this.fx.handTick(f, held, 1, 1); // a Rasengan / Chidori driven into a beam clash stays lit
      else this.fx.dropHand(f);
    }
    if (this.clash) lines = 0.75;
    if (this.meleeFxF > 0) {
      this.meleeFxF--;
      lines = Math.max(lines, MELEE_CLASH.slow.lines);
      this.linesFocus = this.meleeFocus;
      if (!this.meleeFxF && !this.superFlash) this.dimTarget = 0;
    }
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
    if (!pt) {
      // a back dash carrying them just out of the swing's reach is a dodge too (BACKSTEP, ADR 0025)
      if (evading && def.state === 'dash' && sx * att.side < (m.reach ?? 1.3) + 0.6) this.onEvade(def);
      return;
    }
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
    let list = this.pendingMelee;
    this.pendingMelee = [];
    // MELEE CLASH (ADR 0034): a swing landing on the other's live swing of the same class cancels both; a light that
    // meets a heavy is beaten by it (its hit is dropped, the heavy lands now)
    const met = list.find((h) => this.swingsMeet(h.att, h.def));
    if (met) {
      const { att, def } = met;
      if (att.move.meleeClash === def.move.meleeClash) { this.meleeClash(att, def, met.at); return; }
      const H = att.move.meleeClash === 'heavy' ? att : def;
      list = list.filter((h) => h.att === H);
      if (!list.length) list.push({ att: H, def: H.opp, m: H.move, dir: H.face.clone(), at: met.at });
      H.hitDone = true;
      this.heavyBeatsLight(H, met.at);
    }
    for (const { att, def, m, dir, at } of list) {
      // a burst started after the hit was queued (P2 updates after P1) still beats it: the attack whiffs, as it
      // would against P1
      if (def.ko || (def.state === 'burst' && def.invuln > 0)) continue;
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

  // Both swings live at once: att's lands now and def's is in its active frames or at most MELEE_CLASH.window frames
  // from them (both pressed a few frames apart), each a light or heavy normal
  swingsMeet(att, def) {
    const a = att.move, d = def.move;
    if (att.state !== 'attack' || def.state !== 'attack' || !a?.meleeClash || !d?.meleeClash || def.moveHit || def.ko) return false;
    return def.t >= d.startup - MELEE_CLASH.window && def.t < d.startup + d.active;
  }

  // Two lights (or two heavies) met: no damage. Both hold their strikes pressed together through a short slow-mo
  // (sparks in both colors, a shockwave, speed lines, the stage dimmed, the camera pushing in on the fists), then
  // slide back a step free to act. A chain (the next clash within chainGap frames) grows the spray and the push-in
  // and pays both ki; the finale-th blows both apart (clashFinale).
  meleeClash(a, b, at) {
    const C = MELEE_CLASH, ch = this.meleeChain, cls = a.move.meleeClash, heavy = cls === 'heavy';
    ch.n = this.frameNo - ch.at <= C.chainGap ? ch.n + 1 : 1;
    ch.at = this.frameNo;
    ch.cls = cls; // the CPUs press it again out of the bounce (aiClash.js)
    const n = ch.n, mid = meleeAt.set((a.pos.x + b.pos.x) / 2, at.y, (a.pos.z + b.pos.z) / 2);
    const ki = C.ki[cls] * (1 + C.kiPer * (n - 1));
    for (const f of [a, b]) f.ki = Math.min(MAX_KI, f.ki + ki);
    this.arena.npcCue('clash');
    this.excite = Math.min(1, this.excite + 0.25 + 0.1 * n);
    this.clashMoment(mid, C.stop[cls] + 4, Math.min(C.camMax, C.cam + C.camPer * (n - 1)));
    if (n >= C.finale) {
      ch.n = 0;
      this.clashFinale(a, b, mid);
      return;
    }
    a.clashBounce(C.stop[cls], C.push[cls]);
    b.clashBounce(C.stop[cls], C.push[cls]);
    this.fx.clashSpark(mid.x, mid.y, mid.z, a.def.color, b.def.color, (heavy ? 1.25 : 1) * (1 + 0.12 * (n - 1)));
    this.fx.ring(mid, '#f4f0ff', 0.6 + 0.15 * n, Math.min(a.pos.y, b.pos.y) + 0.05);
    this.cam.shake(0.18 + 0.05 * n + (heavy ? 0.12 : 0));
    audio.play(heavy ? 'smash' : 'hitHeavy', Math.min(1.3, 0.8 + 0.1 * n));
    audio.play('block');
    if (n >= 2) audio.play('cheer', Math.min(1.2, 0.2 + 0.2 * n));
    this.hud.announce(n > 1 ? `CLASH ×${n}!` : 'CLASH!', 'clash', 650);
  }

  // what every melee clash shares: the slow-mo, the push-in on the contact, speed lines on it and a dimmed stage
  // for `frames` sim frames (fxTicks lifts them)
  clashMoment(at, frames, cam) {
    const S = MELEE_CLASH.slow;
    this.slowmo(S.scale, S.dur);
    this.cam.pushIn(at.x, at.y, at.z, cam, S.dur);
    this.meleeFocus.pos.set(at.x, at.y - 0.9, at.z); // the speed lines center on pos + 0.9
    this.meleeFxF = frames;
    if (!this.superFlash) this.dimTarget = S.dim;
  }

  // the last clash of a chain: a blast between them throws both apart (a little damage each, a knockdown)
  clashFinale(a, b, mid) {
    const F = MELEE_CLASH.finaleHit;
    this.fx.clashSpark(mid.x, mid.y, mid.z, a.def.color, b.def.color, 1.6);
    for (let k = 0; k < 4; k++) this.fx.smoke(mid.x + (Math.random() - 0.5) * 1.4, mid.y * 0.5 + Math.random() * 0.5, mid.z + (Math.random() - 0.5) * 1.4, 1);
    if (Math.min(a.pos.y, b.pos.y) < 1.5) this.fx.ground.impact(mid, { kind: 'trade' });
    else this.fx.debris(mid.x, mid.z, 12, 1.2);
    this.fx.overlay.flash('#ffe2b0', 0.22);
    audio.play('explosion', 1.2);
    audio.play('cheer', 1.4);
    this.cam.shake(0.9);
    this.excite = 1;
    this.hud.announce('CLASH BREAK!', 'clash', 1100);
    // the clash spray is the show: each knockback hit only adds a small spark
    for (const f of [a, b]) {
      const o = f.opp, d = new THREE.Vector2(f.pos.x - o.pos.x, f.pos.z - o.pos.z).normalize();
      f.takeHit(o, { dmg: F.dmg, launch: F.launch, hitstop: F.hitstop, unblockable: true, big: true, projectileHit: true, spark: 'light', hitFlash: 'heavy' }, d);
    }
  }

  // a heavy that met a light blows through it (the hit itself follows in resolveMelee)
  heavyBeatsLight(H, at) {
    this.fx.hit(at.x, at.y, at.z, 'heavy', 0xfff2c0);
    this.hud.callout(H.index, 'CRUSH!', H.def.color);
    audio.play('smash', 0.7);
  }

  // Two rush specials meeting head-on (Rasengan into Chidori): one beat decides it (ADR 0017). Right after another
  // special clash they simply trade.
  checkSpecialClash() {
    const [a, b] = this.fighters;
    const act = (f) => f.state === 'attack' && f.move?.special && f.t >= f.move.startup && f.t < f.move.startup + f.move.active;
    if (this.clash || !act(a) || !act(b)) return;
    if (Math.hypot(a.pos.x - b.pos.x, a.pos.z - b.pos.z) > 1.6) return;
    if (this.spClashCool > 0) this.specialTrade();
    else this.startClash(this.fighterBody(a), this.fighterBody(b), 'beat');
  }

  // both specials go off at once: each fighter takes the other's blast
  specialTrade() {
    const [a, b] = this.fighters;
    this.arena.npcCue('clash');
    const mid = v3.set((a.pos.x + b.pos.x) / 2, Math.max(a.pos.y, b.pos.y) + 0.9, (a.pos.z + b.pos.z) / 2);
    this.fx.explosion(mid.x, mid.y, mid.z, new THREE.Color(0xbfe0ff));
    if (Math.min(a.pos.y, b.pos.y) < 1.5) this.fx.ground.impact(mid, { kind: 'trade' });
    else this.fx.debris(mid.x, mid.z, 12, 1.2);
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
          if (a.P.clash && b.P.clash && this.checkEnergyClash()) continue; // two energy shots met head-on: BEAM CLASH
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

  // ------------------------------------------------------------ beam clashes (ADR 0027)
  // Two energy attacks meeting head-on lock both owners in a BEAM CLASH: each side's attack becomes a stream from
  // their hands (or a Rasengan / Chidori driven into the other's stream) and both play a short rhythm chart
  // (CLASH.struggle). Energy = a shot whose projectile has `clash` or a rush special with `clash: 'rush'`; two rushes
  // meeting stay the one-beat special clash. A fighter's energy as clash bodies (like ultimateBody's): `live` = out
  // and moving (a shot in flight, a rush running), else still starting (a shot's startup, a rush before its run),
  // which meets a live one heading at its owner from up to answerRange away: the answer.
  energyBodies(f, out) {
    out.length = 0;
    for (const p of this.projectiles) {
      if (p.owner !== f || p.dead || !p.P.clash) continue;
      out.push({
        kind: 'shot', live: true, f, obj: p, id: p.type, name: p.name, dir: p.vel.clone().normalize(), r: p.P.radius,
        back: p.pos.clone().addScaledVector(p.vel, -DT), front: p.pos.clone().addScaledVector(p.vel, DT), color: p.P.stream?.mid ?? f.def.beam.mid, palette: p.P.stream,
        S: { ground: p.P.ground }, // the floor style its win craters (endClash)
      });
    }
    const m = f.state === 'attack' ? f.move : null;
    if (!isEnergy(m)) return out;
    if (m.kind === 'shot') {
      if (f.t >= m.startup) return out; // out already (in flight, above)
      const H = f.actor?.hand?.(), fwd = H ? H.x : 0.5;
      const at = new THREE.Vector3(f.pos.x + f.face.x * fwd, f.pos.y + (H ? H.y : 0.9), f.pos.z + f.face.y * fwd);
      const P = PROJECTILES[m.proj], o = f.opp;
      const dir = new THREE.Vector3(o.pos.x - at.x, o.pos.y + 0.85 - at.y, o.pos.z - at.z).normalize();
      out.push({ kind: 'shot', live: false, charging: true, f, id: m.proj, name: m.name ?? f.def.projectileName, dir, back: at, front: at.clone(), r: 0.6, color: P.stream?.mid ?? f.def.beam.mid, palette: P.stream, S: { ground: P.ground } });
    } else if (!f.moveHit && f.t < m.startup + m.active) {
      const dir = new THREE.Vector3(f.face.x, 0, f.face.y);
      const reach = CLASH.struggle.rushReach, back = new THREE.Vector3(f.pos.x, f.pos.y + 0.7, f.pos.z), front = back.clone().addScaledVector(dir, reach);
      out.push({
        kind: 'rush', live: f.t >= m.startup, f, move: m, id: m.name, name: m.name, fx: m.fx, dir, back, front, tip: front.clone(), reach, r: 0.5, color: m.color ?? f.def.color,
        S: { strikePose: m.anim, maulPose: m.anim, maulPhase: 1, ground: m.ground }, // held on its rush frame, the hand effect lit (fxTicks)
      });
    }
    return out;
  }

  // something of theirs that could start a beam clash this frame (most frames: nothing, so no bodies get built)
  hasEnergy(f) {
    if (f.state === 'attack' && isEnergy(f.move)) return true;
    return this.projectiles.some((p) => p.owner === f && !p.dead && p.P.clash);
  }

  checkEnergyClash() {
    if (this.clash || this.struggleCool > 0 || this.fighters.length < 2 || !this.inputLive) return false;
    if (this.state !== 'fight' && !this.training) return false;
    const [fa, fb] = this.fighters;
    if (!this.hasEnergy(fa) || !this.hasEnergy(fb)) return false;
    for (const f of this.fighters) if (f.ko || f.hidden || !ENERGY_LOCK.has(f.state)) return false;
    if (Math.hypot(fa.pos.x - fb.pos.x, fa.pos.z - fb.pos.z) < CLASH.struggle.minDist) return false; // too close: they trade
    const A = this.energyBodies(fa, bodiesA), B = this.energyBodies(fb, bodiesB);
    for (const a of A) {
      for (const b of B) {
        if (!this.energyMeet(a, b)) continue;
        for (const s of [a, b]) if (s.kind === 'shot') this.materializeStream(s);
        this.startClash(a, b, 'struggle');
        return true;
      }
    }
    return false;
  }

  // head on, neither past the other, and touching; or one still starting while the other heads at its owner (answer)
  energyMeet(a, b) {
    if ((a.kind === 'rush' && b.kind === 'rush') || (!a.live && !b.live)) return false;
    if (a.dir.dot(b.dir) > -0.4) return false;
    if (v3.subVectors(b.back, a.back).dot(a.dir) <= 0 || v3.subVectors(a.back, b.back).dot(b.dir) <= 0) return false;
    const d = segDist(a.back, a.front, b.back, b.front);
    if (a.live && b.live) return d < a.r + b.r;
    const n = a.live ? b : a, l = a.live ? a : b, f = n.f;
    if (d < n.r + l.r + CLASH.struggle.catch) return true;
    if (f.answerMove === f.move && f.answering && f.answering === l.obj) return true; // started as the answer to this shot
    // the live one heads at the starting one's owner from inside the answer range
    const dx = f.pos.x - l.front.x, dy = f.pos.y + 0.85 - l.front.y, dz = f.pos.z - l.front.z, dist = Math.hypot(dx, dy, dz);
    const along = dx * l.dir.x + dy * l.dir.y + dz * l.dir.z;
    return dist < CLASH.struggle.answerRange && along > 0.6 * dist && dist * dist - along * along < 1.6 * 1.6;
  }

  // a shot (in flight or still starting) becomes its owner's stream: a Beam from the hands in the shot's colors
  materializeStream(s) {
    const f = s.f;
    s.obj?.kill();
    f.endMoveFx();
    f.move = null;
    f.faceOpponent(); // the stream leaves the hands toward them, whichever way the owner was turned
    const bm = new Beam(this, f, { palette: s.palette ?? f.def.beam, width: CLASH.struggle.width });
    this.beams.push(bm);
    f.beam = s.obj = bm;
    s.kind = 'beam';
    s.charging = false;
    s.dir = bm.dir;
    s.back = bm.origin.clone();
    s.front = bm.head.clone();
    s.tip = s.front.clone();
  }

  // the hand effect a fighter locked in a beam clash holds (a rush special's Rasengan / Chidori), or null
  clashHand(f) {
    const c = this.clash;
    const s = c && !c.lite ? (c.a.f === f ? c.a : c.b.f === f ? c.b : null) : null;
    return s?.kind === 'rush' ? s.fx ?? null : null;
  }

  // The two lock where they met and both players play the same note chart (clash.js): the score lead pushes the
  // struggle point toward the trailing side, and the chart's end (or a lead that can't be caught any more) decides
  // it. `tier`: 'ultimate' (ADR 0017), 'struggle' (a BEAM CLASH between energy specials, ADR 0027: its own shorter
  // chart and stakes in CLASH.struggle, a fresh chart each time) or 'beat' (the one-beat special clash, `lite`:
  // the world held still). `c.C` holds the tier's numbers.
  startClash(A, B, tier = 'ultimate') {
    const lite = tier === 'beat', struggle = tier === 'struggle';
    const C = struggle ? { ...CLASH, ...CLASH.struggle } : CLASH;
    this.arena.npcCue('clash');
    const chart = lite ? beatChart() : makeChart(struggle ? seedOf(A.id, B.id, this.frameNo) : seedOf(A.id, B.id), C);
    const c = { a: A, b: B, chart, judges: [new Judge(chart, C), new Judge(chart, C)], lite, tier, C, timer: 0, t: 0.5, kick: 0, point: new THREE.Vector3() };
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
    this.hud.announce(struggle ? 'BEAM CLASH!' : 'CLASH!', 'clash', 900);
    if (struggle) for (const s of [A, B]) if (s.name) this.hud.callout(s.f.index, s.name, '#' + (s === A ? c.ca : c.cb).getHexString());
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
      else { s.anchor = s.back.clone(); mins.push((s.reach ?? R.reach) - R.shove); }
      s.origin = s.kind === 'beam' ? s.obj.origin : s.anchor.clone(); // the clash camera frames origin to origin
    }
    const axis = new THREE.Vector3().subVectors(B.anchor, A.anchor);
    const span = axis.length();
    if (span < 0.5) axis.copy(A.dir);
    else axis.divideScalar(span);
    let lo = mins[0], hi = span - mins[1];
    if (lo > hi) lo = hi = (lo + hi) / 2;
    // they meet between their leading edges (the beam's head, the orb's surface, the claws); in a beam clash the two
    // streams meet halfway between the hands, or at the fist of a rush special driven into one (it stays put)
    const rush = c.tier === 'struggle' && [A, B].find((s) => s.kind === 'rush');
    const meet = c.tier !== 'struggle' ? v3.addVectors(A.tip, B.tip).multiplyScalar(0.5) : rush ? v3.copy(rush.tip) : null;
    const at = THREE.MathUtils.clamp(meet ? meet.sub(A.anchor).dot(axis) : span / 2, lo, hi);
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
    if (s.kind === 'rush') { const r = s.reach ?? CLASH.rush.reach; out.x = P.x - dx * r; out.z = P.z - dz * r; return out; }
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
      // a body locked against the barrier (a rush's reach measured off its facing, not the clash axis) never stands past
      // it: physics, which keeps everyone inside, doesn't run during a clash. Without this a push-back (a Gojo mirror's orb
      // or stream shoving the loser back against the wall) put a body up to 0.4 past ARENA_LIMIT for the whole struggle
      // (ENG-075; soak() reports it as a `ring` violation in state `clash`)
      at.x = THREE.MathUtils.clamp(at.x, -ARENA_LIMIT, ARENA_LIMIT);
      at.z = THREE.MathUtils.clamp(at.z, -ARENA_LIMIT, ARENA_LIMIT);
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
    // a beam clash whose owner was knocked out of the lock (a burn tick's KO) is over: the other side's stream wins
    if (c.tier === 'struggle' && (c.a.f.state !== 'clash' || c.b.f.state !== 'clash')) { this.endClash(c.a.f.state !== 'clash' ? 1 : 0); return; }
    const C = c.C, lead = JA.score - JB.score;
    const target = 0.5 + THREE.MathUtils.clamp(lead * C.push, -0.45, 0.45);
    c.t = THREE.MathUtils.clamp(c.t + (target - c.t) * 0.12 + Math.sin(now * 0.11) * 0.0015, 0.02, 0.98);
    this.placeClash(c);
    this.hud.clash(true, c.t);
    // over when the chart is, or (a blowout) once the trailing player can't catch up any more; once the FINAL PUSH
    // ring is up it always plays out
    const push = c.chart.notes[c.chart.notes.length - 1];
    const decided = now < push.t - c.chart.lead && Math.abs(lead) - (lead > 0 ? JB : JA).maxLeft() >= C.drawMargin;
    if (decided || now >= c.chart.end + C.outro) this.endClash(lead >= C.drawMargin ? 0 : lead <= -C.drawMargin ? 1 : -1);
  }

  // a graded press: its word on the player's side, and a Great or Perfect flares the struggle point in their color
  onBeat(c, i, r) {
    this.hud.clashJudge(i, r.g);
    const hit = r.g === 'perfect' || r.g === 'great' || r.g === 'good';
    if (r.g === 'perfect' || r.g === 'great') {
      c.kick = 1;
      const p = c.point;
      this.fx.spawn('ring', p.x, p.y, p.z, { scale: (r.g === 'perfect' ? 2.2 : 1.6) * (c.lite ? 0.55 : c.C.sparks ?? 1), color: i === 0 ? c.ca : c.cb, order: 6, depthTest: false, glow: 1.2 });
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
    const p = c.point, now = c.timer, k = c.lite ? 0.55 : c.C.sparks ?? 1; // the special clash sits between two lit specials, a beam clash between two short streams
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
    this.fx.overlay.flash('#ffffff', c.tier === 'struggle' ? 0.5 : 0.9); // a 1-bar beam clash ends a notch quieter
    this.cam.set('fight');
    this.cam.shake(1);
    this.slowmo(0.3, 0.8);
    for (const f of this.fighters) { f.invuln = 0; f.pad.clear(); } // the beat's presses must not fire moves after it
    if (c.lite) { this.endSpecialClash(winner); return; }
    const ax = c.line.axis, C = c.C;
    if (c.tier === 'struggle') this.struggleCool = C.cooldown;
    if (winner < 0) {
      // even: both ultimates blow up between them
      this.fx.explosion(P.x, P.y, P.z, new THREE.Color(0xffffff));
      this.fx.ground.impact(P, { kind: 'clashDraw', force: C.craters?.[1] });
      audio.play('explosion', 1.3);
      this.hud.announce('DRAW!', 'clash', 900);
      [c.a, c.b].forEach((s, i) => {
        s.obj?.kill();
        const sg = i === 0 ? -1 : 1;
        s.f.takeHit(s.f.opp, { dmg: C.drawDmg, launch: [10, 8], hitstop: 12, unblockable: true, big: true, beam: true, spark: 'smash', noTech: c.tier !== 'struggle' }, new THREE.Vector2(ax.x * sg, ax.z * sg).normalize());
      });
      return;
    }
    const WS = winner === 0 ? c.a : c.b, LS = winner === 0 ? c.b : c.a;
    const W = WS.f, L = LS.f, sg = winner === 0 ? 1 : -1;
    LS.obj?.kill();
    this.overwhelm(WS, L);
    L.takeHit(W, { dmg: C.winDmg, minScale: 1, launch: C.launch, hitstop: 18, unblockable: true, big: true, beam: true, wallBounce: true, spark: 'smash', noTech: c.tier !== 'struggle' }, new THREE.Vector2(ax.x * sg, ax.z * sg).normalize());
    this.fx.explosion(L.pos.x, L.pos.y + 0.9, L.pos.z, winner === 0 ? c.ca : c.cb);
    this.fx.ground.impact(L.pos, { kind: 'clashWin', force: C.craters?.[0], style: WS.S?.ground ?? W.def.ground?.style, tint: W.def.ground?.tint ?? W.def.color, dir: { x: ax.x * sg, z: ax.z * sg } });
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
    } else if (WS.move) {
      // a Rasengan / Chidori driven through a beam clash: on into its follow-through, its hit already dealt
      W.setState('attack', null);
      W.move = WS.move;
      W.moveName = 'special';
      W.t = WS.move.startup + WS.move.active;
      W.hitDone = W.moveHit = true;
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
    this.fx.ground.hit(att, def, m, dmg); // the floor under them, or where they come down
    if (m.beam) {
      // beam ticks draw their own sparks
    } else if (m.special) {
      const col = new THREE.Color(m.color);
      this.fx.explosion(x, y, z, col);
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
    // technique callouts (ADR 0022): a fresh combo on their recovery, an attack out of stun or wake-up
    if (def.punishHit) { def.punishHit = false; this.tag(att, 'punish'); }
    if (att.reversal && def.combo === 1) { att.reversal = false; this.tag(att, 'reversal'); }
    // the combo ticker (ADR 0026): a launcher (RELAUNCH! on someone already in the air), a super dash contact
    if (m.launcher && def.combo > 1) {
      const re = def.prev.y > 0.3;
      if (re) this.tag(att, 'relaunch');
      this.comboChip(att, re ? 'RELAUNCH' : 'LAUNCH');
    } else if (m.name === 'superDash') this.comboChip(att, 'DASH');
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
    if (def.ko || def.hidden || def.air || def.pos.y > 0.05 || att.air) return false;
    const R = this.cam.right, F = this.cam.fwd;
    const rx = def.pos.x - att.pos.x, rz = def.pos.z - att.pos.z;
    if (Math.abs(rx * R.x + rz * R.z) > T.range || Math.abs(rx * F.x + rz * F.z) > T.lane) return false;
    if (def.invuln > 0) {
      if (def.evading) this.onEvade(def); // a spot dodge beat the throw
      return false;
    }
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
    this.tag(def, 'throwBreak');
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
    this.tag(def, 'parry');
    this.freeze = Math.max(this.freeze, DEFENSE.parry.freeze);
    this.cam.zoomPunch(0.5);
    this.cam.shake(0.22);
    audio.play('block', 1.4);
    audio.play('flash', 0.6);
    this.excite = Math.min(1, this.excite + 0.3);
  }

  // A spot dodge or air dodge made an attack, shot, beam or super pass through (ADR 0016): one callout per
  // dodge, so the viewer sees why nothing landed.
  onEvade(f) {
    if (f.dodgeCalled) return;
    f.dodgeCalled = true;
    f.evades = (f.evades || 0) + 1; // the CPU showcase report (ADR 0025)
    this.tag(f, f.state === 'airDodge' ? 'airDodge' : f.state === 'dash' ? 'backstep' : 'dodge');
    this.excite = Math.min(1, this.excite + 0.1);
  }

  // Technique callouts (ADR 0022): a side banner from the TAGS table (src/ui/hud.js) on fighter f's side of the
  // screen, at most once per TAGS[id].cool frames per fighter. Every defensive success and named technique goes
  // through here, so a new one is a TAGS row plus one call.
  tag(f, id) {
    const T = TAGS[id];
    if (!T || !f) return;
    if (T.cool && this.frameNo - (f.tagAt[id] ?? -1e9) < T.cool) return;
    f.tagAt[id] = this.frameNo;
    this.hud.tag(f.index, id, T.color ?? f.def.color);
    this.excite = Math.min(1, this.excite + (T.excite ?? 0.2));
  }

  // Burst (ADR 0022): the combo is broken. A short freeze, a big BURST!, a shockwave in the fighter's color.
  onBurst(f) {
    const p = f.pos, col = new THREE.Color(f.def.color);
    this.tag(f, 'burst');
    this.freeze = Math.max(this.freeze, DEFENSE.burst.freeze);
    for (const v of this.vortices) if (v.owner === f.opp) v.kill(); // a grinding Rasenshuriken / Blue lets go too
    this.fx.burstAt(f, col, 1.4);
    this.fx.spawn('glow', p.x, p.y + 0.9, p.z, { scale: 1.6, color: col, opacity: 0.85, life: 0.35, fade: true, grow: 1.2, depthTest: false, order: 6, glow: 1 });
    this.fx.spawn('lines', p.x, p.y + 0.8, p.z, { scale: 1.6, color: 0xffffff, glow: 0.6, depthTest: false, order: 8 });
    this.fx.overlay.flash(f.def.color, 0.35);
    this.fx.overlay.impactFrame(2);
    this.cam.zoomPunch(0.6);
    this.cam.shake(0.5);
    audio.play('kiMax', 0.9);
    audio.play('smash', 0.8);
  }

  // each active frame of the burst: the wave rolls out from the body (and along the floor when grounded)
  onBurstWave(f, k) {
    const p = f.pos, col = burstCol.set(f.def.color); // spawn copies the color
    if (k === 0) {
      this.fx.spawn('ring', p.x, p.y + 0.85, p.z, { scale: 1.0, grow: 4.5, life: 0.3, fade: true, color: col, glow: 1.2, depthTest: false, order: 8 });
      this.fx.spawn('ring', p.x, p.y + 0.85, p.z, { scale: 0.7, grow: 5, life: 0.25, fade: true, color: 0xffffff, glow: 1.6, depthTest: false, order: 9 });
      if (!f.air) { this.fx.dust(p, 1.4); this.fx.debris(p.x, p.z, 6, 0.8); }
      this.cam.shake(0.45);
      audio.play('explosion', 0.6);
    } else if (k % 2 === 0) this.fx.spawn('ring', p.x, p.y + 0.85, p.z, { scale: 0.9 + k * 0.25, color: col, opacity: 0.6, life: 0.12, fade: true, glow: 0.8, depthTest: false, order: 7 });
  }

  // Timed impact tech (ADR 0028): TECH! / WALL TECH!, a small white-cyan spark ring at the contact point (the floor
  // under them, or the barrier), a bright ting and a crowd pop. The hold-Guard tech keeps its own white TECH!.
  onImpactTech(f, kind, axis, sign) {
    const p = f.pos, wall = kind === 'wall';
    const x = wall && axis === 'x' ? sign * ARENA_LIMIT : p.x, z = wall && axis === 'z' ? sign * ARENA_LIMIT : p.z;
    const y = wall ? p.y + 0.8 : 0.15;
    if (wall) this.fx.barrier(p, axis, sign, '#bff8ff');
    else this.fx.dust(p, 0.6);
    this.fx.spawn('ring', x, y, z, { scale: 0.45, grow: 2.4, life: 0.24, fade: true, color: TECH_SPARK, glow: 1.5, depthTest: false, order: 9 });
    this.fx.spawn('star', x, y + (wall ? 0 : 0.35), z, { scale: 0.5, color: 0xeaffff, glow: 1.5, depthTest: false, order: 9 });
    this.tag(f, wall ? 'wallTech' : 'impactTech');
    if (wall) this.cam.zoomPunch(0.25);
    audio.play('tech');
    audio.play('cheer', 0.55);
  }

  // `impact`: the downward speed it hit the floor at; n: this combo's ground bounce count (the JUGGLE budget)
  onGroundBounce(f, impact = 20, n = 1) {
    this.fx.dust(f.pos, 1.6);
    this.fx.ground.land(f, impact, { bounce: true });
    this.fx.ring(f.pos, '#fff3d0', 1.4);
    audio.play('groundBounce');
    this.cam.shake(0.5);
    f.hitstop = Math.max(f.hitstop, 5);
    if (this.combos?.[f.index]) this.combos[f.index].ground = n;
    this.tag(f.opp, 'groundBounce');
    this.comboChip(f.opp, 'BOUNCE', 'ground');
  }

  // n: this combo's wall bounce count: WALL BOUNCE!, WALL BOUNCE ×2!, then HANDBALL! (the same wall again and again)
  onWallBounce(f, axis, sign, n = 1) {
    this.fx.barrier(f.pos, axis, sign);
    this.fx.ground.wall(f.pos, axis, sign, Math.abs(f.vel[axis]) / 0.55); // the speed before the bounce (fighter.physics)
    this.fx.hit(f.pos.x, f.pos.y + 0.8, f.pos.z, 'heavy', 0xbfe8ff);
    audio.play('wallBounce');
    this.cam.shake(0.5);
    f.hitstop = Math.max(f.hitstop, 7);
    f.shaking = true;
    if (this.combos?.[f.index]) this.combos[f.index].wall = n;
    this.tag(f.opp, n >= 3 ? 'handball' : n === 2 ? 'wallBounce2' : 'wallBounce');
    this.comboChip(f.opp, 'WALL', 'wall');
    this.cam.zoomPunch(0.35 + 0.15 * n);
    if (n >= 2) this.slowmo(0.45, 0.14);
    this.excite = Math.min(1, this.excite + 0.4);
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
      // a vanish inside a combo (not a kit teleport): the ticker, and VANISH ×2! / ×3! for the ping-pong (ADR 0026)
      const C = this.combos?.[1 - f.index];
      if (f.state === 'vanish' && C?.hits) {
        C.vanish++;
        this.comboChip(f, 'VANISH');
        this.cam.zoomPunch(0.4);
        if (C.vanish >= 2) this.tag(f, C.vanish >= 3 ? 'vanish3' : 'vanish2');
      }
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
    this.comboChip(f, m.name); // a rush special cancelled into mid-combo
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
    this.fx.ground.wallCrater(f.pos, speed);
  }

  onKOLanded(f) {
    this.fx.ground.koMark(f);
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
