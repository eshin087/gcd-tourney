import * as THREE from 'three';
import { SpriteActor } from './sprites.js';
import { MOVES, SPECIALS, ULTIMATE, SUPER_DASH, VANISH, DEFENSE, THROW } from './moves.js';
import { ARENA_LIMIT, GRAVITY, DT, MAX_HP, MAX_KI, KI_BAR, RING_HALF, RING_TOP } from './constants.js';
import { Pad } from '../core/input.js';
import { audio } from '../core/audio.js';
import * as kit from './kit.js';

const NEUTRAL_PAD = new Pad();
// states a held fighter is pulled out of (they can't act until the hold wears off)
const HOLDABLE = new Set(['idle', 'run', 'guard', 'block', 'air', 'land', 'jumpSquat', 'dash', 'charge', 'attack', 'airRecover', 'superDash', 'kit', 'dodge', 'airDodge', 'wavedash', 'throw']);
const FRAME_MS = 1000 / 60;
const ACTIONS = ['light', 'heavy', 'special', 'jump', 'guard', 'dash'];
// out of a wavedash slide, these keep sliding (attacks, guard, specials); jumps and dashes set their own speed
const CARRY_STATES = new Set(['attack', 'guard', 'kit', 'charge', 'throw']);
const JUGGLE_GAP = 0.76; // spacing an air juggle closes to (just outside Game.separate's 0.72)

export class Fighter {
  constructor(game, def, asset, index) {
    this.game = game;
    this.def = def;
    this.asset = asset;
    this.index = index;
    this.actor = new SpriteActor(asset, game.scene);
    this.pos = new THREE.Vector3();
    this.prev = new THREE.Vector3();
    this.vel = new THREE.Vector3();
    this.face = new THREE.Vector2(index === 0 ? 1 : -1, 0);
    this.side = index === 0 ? 1 : -1; // facing screen-right (+1) or screen-left (-1)
    this.pad = NEUTRAL_PAD;
    this.wins = 0;
    this.parries = 0; // this match (the CPU showcase, aiShow.js, notices them here)
    this.reset(0, 0);
  }

  get opp() {
    return this.game.fighters[1 - this.index];
  }

  reset(x, z) {
    this.blockAt = -99;
    this.pos.set(x, 0, z);
    this.prev.copy(this.pos);
    this.vel.set(0, 0, 0);
    this.hp = MAX_HP;
    this.ki = KI_BAR;
    this.state = 'idle';
    this.t = 0;
    this.move = null;
    this.moveName = null;
    this.hitstop = 0;
    this.stun = 0;
    this.airStun = 0;
    this.invuln = 0;
    this.combo = 0;
    this.comboDmg = 0;
    this.air = false;
    this.airAttack = false;
    this.hitDone = false;
    this.moveHit = false;
    this.ko = false;
    this.koLanded = false;
    this.crashed = false;
    this.flash = 0;
    this.spPending = false;
    this.spPress = -99;
    this.landLag = 6;
    this.beam = null;
    this.hurtAlt = false;
    this.gb = false; // ground bounce pending
    this.wb = false; // wall bounce pending
    this.chase = 0;
    this.airDashes = 0;
    this.forceTech = false;
    this.shaking = false;
    this.hidden = false;
    this.mode = null; // timed power-up (Godspeed), see kit.js
    this.heldT = 0; // frames held helpless (Domain Expansion, Whirlwind, Infinity stagger)
    this.counterT = 0; // counter-stance frames left
    this.kitState = null; // data of the running kit move (state 'kit')
    this.burn = null; // damage over time (Amaterasu), see kit.tickBurn
    this.reflex = null; // Whirlwind: auto-counters left and frames (ADR 0017), see kit.tickReflex
    kit.endShroud(this); // the Four-Tails tint never outlives a round
    this.dashDir = new THREE.Vector2(1, 0);
    // defensive options (ADR 0014)
    this.clock = 0; // frames since the round started (dodge staleness)
    this.parryAt = -99; // pad frame of the live parry attempt
    this.parryTry = -99; // pad frame of the last Guard press (parry lockout)
    this.airDodged = false; // one air dodge per airtime
    this.dodgeDir = null; // direction of the running air dodge (null = neutral)
    this.dodgeStale = 0;
    this.lastDodge = -999;
    this.carry = this.carry || new THREE.Vector2(); // wavedash momentum carried into the next move
    this.carry.set(0, 0);
    this.throwSt = null; // running throw (state 'throw'), ADR 0015
    this.grab = null; // { by, t } while pinned by the opponent's throw
    this.endMoveFx();
    this.actor.setVisible(true);
    this.actor.play('idle', true);
  }

  // --------------------------------------------------------------- helpers
  setState(s, anim = s) {
    if (this.state === 'attack' && s !== 'attack') this.endMoveFx();
    if (this.state === 'throw' && s !== 'throw') this.releaseGrab();
    if (this.state === 'kit' && s !== 'kit' && this.kitState) {
      // leaving a kit move by any route (round reset, debug tools) never leaves it half-running
      this.kitState = null;
      this.counterT = 0;
      this.hidden = false;
      this.actor.setVisible(true);
    }
    this.state = s;
    this.t = 0;
    if (anim) this.actor.play(anim, true);
  }

  // 2.5D lanes: fighters face screen-left or screen-right, never into the camera,
  // so strikes always travel across the screen the way the sprite is drawn.
  faceOpponent() {
    const o = this.opp, R = this.game.cam.right;
    const sx = (o.pos.x - this.pos.x) * R.x + (o.pos.z - this.pos.z) * R.z;
    if (Math.abs(sx) > 0.12) this.side = Math.sign(sx);
    this.setSide(this.side);
  }

  setSide(side) {
    const R = this.game.cam.right;
    this.side = side;
    this.face.set(R.x * side, R.z * side);
  }

  // Signed offsets to the opponent: along the screen (sx) and in depth (sd).
  laneOffsets() {
    const o = this.opp, R = this.game.cam.right, F = this.game.cam.fwd;
    const rx = o.pos.x - this.pos.x, rz = o.pos.z - this.pos.z;
    return { sx: rx * R.x + rz * R.z, sd: rx * F.x + rz * F.z };
  }

  distTo(o = this.opp) {
    return Math.hypot(o.pos.x - this.pos.x, o.pos.z - this.pos.z);
  }

  // Hold back to block (ENG-057): the stick held away from the opponent on screen. Only a person's pad gets it (no
  // brain, or a lab script/replay that sets `autoBlock`): a CPU blocks at its level's own rate.
  holdingBack() {
    const b = this.game.brains[this.index];
    if (b && !b.autoBlock) return false;
    return this.pad.mx * kit.towardSide(this) < -0.5;
  }

  // Something of theirs could hit us soon, so holding back raises the guard instead of running away: an attack or
  // kit move close by, a beam charging or out, a shot or orb near, or the next hit of a string we just blocked.
  underPressure() {
    const o = this.opp, g = this.game;
    if (this.clock - (this.blockAt ?? -99) < 14) return true;
    if (o.state === 'beamCharge' || g.beams.some((bm) => bm.owner === o && !bm.dead)) return true;
    if (['attack', 'kit', 'superDash', 'vanish'].includes(o.state) && this.distTo() < 4.5) return true;
    const near = (p, r) => Math.hypot(p.x - this.pos.x, p.z - this.pos.z) < r;
    return g.projectiles.some((pr) => pr.owner === o && !pr.dead && near(pr.pos, 4.5)) || g.orbs.some((ob) => ob.owner === o && !ob.dead && near(ob.pos, 5.5));
  }

  autoGuard() {
    return this.holdingBack() && this.underPressure();
  }

  inputDir() {
    return this.game.camDir(this.pad.mx, this.pad.my);
  }

  anyPress() {
    const b = this.pad.b;
    return ACTIONS.some((a) => b[a].pressed);
  }

  canAfford(cost) {
    if (this.ki >= cost) return true;
    this.game.hud?.kiShort(this.index);
    return false;
  }

  endMoveFx() {
    audio.stopLoop('sp' + this.index);
  }

  get speedStat() {
    return this.def.stats.speed * (this.mode?.speed ?? 1);
  }

  get busy() {
    return !['idle', 'run', 'guard', 'air'].includes(this.state);
  }

  // intangible because of a spot dodge or air dodge (Game.onEvade calls out what passes through)
  get evading() {
    return (this.state === 'dodge' || this.state === 'airDodge') && this.invuln > 0 && !this.ko;
  }

  get hittable() {
    return !this.ko && this.invuln <= 0 && this.state !== 'down' && this.state !== 'getup' && !this.hidden;
  }

  teleport(x, y, z) {
    this.pos.set(x, y, z);
    this.prev.copy(this.pos);
  }

  // --------------------------------------------------------------- actions
  startMove(name, m) {
    if (this.state === 'attack') this.endMoveFx();
    this.move = m;
    this.moveName = name;
    this.state = 'attack';
    this.t = 0;
    this.hitDone = false;
    this.moveHit = false;
    this.faceOpponent();
    if (m.air || m.hover) this.airAttack = true;
    if (m.special) {
      audio.loop('sp' + this.index, m.sfxLoop);
      this.game.onSpecialStart(this, m);
    }
    this.actor.setPhase(m.anim, 0, 0);
  }

  // The stick picks which special comes out (kit.js, ADR 0009).
  doSpecial() {
    return kit.doSpecial(this, false);
  }

  doProjectile() {
    return kit.doSpecial(this, true);
  }

  startUltimate() {
    if (kit.startKitUltimate(this)) return; // a non-beam ultimate (Amaterasu)
    const o = this.opp;
    const counter = kit.ultimateLive(o); // into their beam, orb or pounce: a quick counter-beam that can meet it
    this.ultAt = this.game.frameNo;
    this.ki -= ULTIMATE.cost;
    this.spPending = false;
    this.state = 'beamCharge';
    this.t = 0;
    this.windup = counter ? ULTIMATE.counterWindup : ULTIMATE.windup;
    this.invuln = this.windup + 8;
    this.vel.set(0, 0, 0);
    this.faceOpponent();
    this.actor.play('beamCharge', true);
    audio.play('beamCharge');
    this.game.onUltimateStart(this, counter);
  }

  startDash(dir2) {
    let d = dir2 ? this.game.camDir(dir2[0], dir2[1]) : this.inputDir();
    if (d.lengthSq() < 0.04) {
      if (!this.startSuperDash()) this.setState('idle');
      return;
    }
    d.normalize();
    this.dashDir.copy(d);
    if (this.mode?.blinkDash) {
      // Godspeed: a lightning blink, then the tail of a dash (attacks can still cancel it)
      kit.blinkDash(this, d);
      this.backDash = false;
      this.face.copy(d);
      this.setState('dash', 'dash');
      this.t = 11;
      return;
    }
    const toOpp = new THREE.Vector2(this.opp.pos.x - this.pos.x, this.opp.pos.z - this.pos.z).normalize();
    this.backDash = d.dot(toOpp) < -0.4;
    if (!this.backDash) {
      this.face.copy(d);
      const R = this.game.cam.right;
      const along = d.x * R.x + d.y * R.z;
      if (Math.abs(along) > 0.3) this.side = Math.sign(along);
    }
    this.setState('dash', this.backDash ? 'backDash' : 'dash');
    this.invuln = 8;
    audio.play('dash');
    this.game.fx.dust(this.pos, 0.9);
    this.game.fx.dashBurst(this);
  }

  // Homing dash that flies at the opponent (works on the ground and in the air).
  startSuperDash() {
    if (this.airDashes > 0) return false; // one super dash per trip through the air
    this.airDashes = 1;
    this.setState('superDash');
    this.airAttack = false;
    this.faceOpponent();
    audio.play('superDash');
    this.game.fx.dashBurst(this, true);
    this.game.fx.dust(this.pos, 1.0);
    return true;
  }

  startVanish() {
    this.ki -= VANISH.cost;
    this.spPending = false;
    this.endMoveFx();
    this.setState('vanish');
    this.hidden = true;
    this.invuln = VANISH.hideFrames + 6;
    this.vel.set(0, 0, 0);
    this.actor.setVisible(false);
    this.game.onVanish(this, 'out');
  }

  // ---- defensive options (ADR 0014, numbers in DEFENSE)
  // Spot dodge: Guard + ↓. The stick has to be pushed (an edge) close to the guard, so walking toward the
  // camera and then blocking never dodges by accident.
  wantsSpotDodge() {
    const p = this.pad;
    return p.b.guard.down && p.my < -0.5 && p.dirPressed('d', 3);
  }

  startSpotDodge() {
    const S = DEFENSE.spotDodge;
    // dodging again and again gets slower (Smash-style staleness), so it stays a read, not a panic button
    this.dodgeStale = this.clock - this.lastDodge < S.staleWindow ? Math.min(S.staleMax, this.dodgeStale + 1) : 0;
    this.lastDodge = this.clock;
    this.dodgeCalled = false;
    this.spPending = false;
    this.carry.set(0, 0);
    this.vel.x *= 0.3; this.vel.z *= 0.3;
    this.setState('dodge', 'vanish');
    audio.play('whoosh', 0.7);
  }

  // Air dodge: Guard in the air. A direction bursts that way, angled down; right after takeoff that meets
  // the floor, and the landing turns into a wavedash.
  startAirDodge() {
    const D = DEFENSE.airDodge;
    const d = this.inputDir();
    this.airDodged = true;
    this.dodgeCalled = false;
    this.chase = 0;
    this.spPending = false;
    this.endMoveFx();
    this.move = null;
    if (d.lengthSq() > 0.04) {
      d.normalize();
      this.dodgeDir = d;
      this.vel.set(d.x * D.speed, -(this.pos.y < D.lowY ? D.lowDrop : D.drop), d.y * D.speed);
    } else {
      this.dodgeDir = null;
      this.vel.set(this.vel.x * 0.15, 0, this.vel.z * 0.15);
    }
    this.setState('airDodge', this.dodgeDir ? 'airRecover' : 'jumpFall');
    this.actor.ghost(this.def.color, 0.25, 0.5);
    audio.play('dash', 0.55);
  }

  // Wavedash: slide along the floor. `d` is given when it comes straight out of the jump squat (Jump +
  // Guard), otherwise the air dodge's own speed carries over.
  startWavedash(d = null) {
    const W = DEFENSE.wavedash;
    if (d) {
      this.vel.x = d.x * W.speed;
      this.vel.z = d.y * W.speed;
    }
    this.vel.y = 0;
    this.pos.y = 0;
    this.air = false;
    this.invuln = 0; // the floor ends the dodge: a wavedash is movement, not a dodge
    this.airAttack = false;
    this.dodgeDir = null;
    this.setState('wavedash', 'land');
    this.faceOpponent();
    this.actor.ghost(this.def.color, 0.22, 0.45);
    this.game.fx.dust(this.pos, 0.9);
    audio.play('dash', 0.45);
  }

  // A blockable hit met a fresh Guard press: nothing gets through, the defender acts at once and a melee
  // attacker is knocked off balance. Returns 'parry' to takeHit's caller.
  parry(att, m) {
    const P = DEFENSE.parry;
    this.parries++;
    this.parryAt = -99; // one press parries one hit...
    this.parryTry = -99; // ...and the next press is a fresh attempt, so a string can be parried hit by hit
    this.sinceHit = 0;
    this.stun = 0;
    this.carry.set(0, 0);
    this.vel.x *= 0.2; this.vel.z *= 0.2;
    this.ki = Math.min(MAX_KI, this.ki + P.ki);
    this.flash = 0.9;
    this.setState('guard');
    if (!m.projectileHit && att !== this && !att.ko) {
      att.endMoveFx();
      att.move = null;
      att.vel.set(0, Math.min(0, att.vel.y), 0);
      att.carry.set(0, 0);
      att.heldT = m.big || m.special ? P.bigStagger : P.stagger;
      att.setState('held', 'stagger');
    }
    this.game.onParry(this, att, m);
    return 'parry';
  }

  // ---- throw (ADR 0015, numbers in THROW): Light + Heavy close up
  // Light and Heavy both pressed within 2 frames (buffered, so it also reads a frame after leaving Guard)
  wantsThrow() {
    const p = this.pad;
    return p.buffered('light', 2) && p.buffered('heavy', 2);
  }

  startThrow() {
    if (this.state === 'attack') this.endMoveFx();
    this.move = null;
    this.spPending = false;
    this.vel.x *= 0.3; this.vel.z *= 0.3;
    this.faceOpponent();
    this.setState('throw', null);
    this.throwSt = { phase: 'reach', t0: 0, victim: null };
    this.actor.setPhase('light1', 0, 0);
    audio.play('whoosh', 0.6);
  }

  // reach (startup + active: Game.tryGrab) -> hold (victim pinned, can break) -> toss (the hit) -> recovery;
  // a miss ends in the long whiff recovery, a break in the short one
  updateThrow(p) {
    const T = THROW, s = this.throwSt, o = this.opp;
    if (!s) { this.setState('idle'); return; }
    this.vel.x *= 0.7; this.vel.z *= 0.7;
    const k = this.t - s.t0;
    if (s.phase === 'reach') {
      const live = this.t >= T.startup;
      this.actor.setPhase('light1', live ? 1 : 0, Math.min(0.999, live ? (this.t - T.startup) / T.active : this.t / T.startup));
      if (this.t < T.startup - 1) this.faceOpponent();
      if (live && this.t < T.startup + T.active && this.game.tryGrab(this)) return;
      if (this.t >= T.startup + T.active) { s.phase = 'whiff'; s.t0 = this.t; }
      return;
    }
    if (s.phase === 'hold') {
      // the victim hangs off the grab in front; Game.breakThrow ends this early
      this.actor.setPhase('light1', 1, 0.6);
      const v = s.victim;
      if (v && v.grab?.by === this) {
        // clamped here: a victim that already updated this frame would otherwise end it past the barrier
        v.pos.x = THREE.MathUtils.clamp(v.pos.x + (this.pos.x + this.face.x * 0.8 - v.pos.x) * 0.5, -ARENA_LIMIT, ARENA_LIMIT);
        v.pos.z = THREE.MathUtils.clamp(v.pos.z + (this.pos.z + this.face.y * 0.8 - v.pos.z) * 0.5, -ARENA_LIMIT, ARENA_LIMIT);
      }
      if (k >= T.hold) { s.phase = 'toss'; s.t0 = this.t; this.game.throwHit(this, v); }
      return;
    }
    if (s.phase === 'toss') {
      this.actor.setPhase('light4', k < 4 ? 1 : 2, Math.min(0.999, k < 4 ? k / 4 : (k - 4) / T.recovery));
      // the toss wall-bounces them: chase with the super dash, or vanish behind them
      if (k >= 6 && o.state === 'launched' && !o.ko) {
        if ((p.buffered('dash', 8) || p.dashDir) && this.airDashes === 0) { p.consume('dash'); this.throwSt = null; this.startSuperDash(); return; }
        if (this.wantsVanish()) { this.throwSt = null; this.startVanish(); return; }
      }
      if (k >= 4 + T.recovery) { this.throwSt = null; this.setState('idle'); }
      return;
    }
    // 'whiff' or 'broken'
    const len = s.phase === 'whiff' ? T.whiff : T.breakLag;
    this.actor.setPhase('light1', 2, Math.min(0.999, k / len));
    if (k >= len) { this.throwSt = null; this.setState('idle'); }
  }

  // Let go of a pinned victim (the throw ended early: we got hit, the round reset).
  releaseGrab() {
    const v = this.throwSt?.victim;
    if (v && v.grab?.by === this) {
      v.grab = null;
      v.heldT = 0;
    }
    this.throwSt = null;
  }

  // After a launcher connects: jump after the victim.
  startChase() {
    const o = this.opp;
    const tgt = new THREE.Vector3(o.pos.x + o.vel.x * 0.18, o.pos.y + o.vel.y * 0.18 + 0.2, o.pos.z + o.vel.z * 0.18);
    const d = tgt.sub(this.pos);
    const toward = new THREE.Vector2(d.x, d.z);
    const flat = toward.length();
    if (flat > 0.9) toward.multiplyScalar((flat - 0.9) / flat);
    else toward.set(0, 0);
    this.vel.set(toward.x / 0.26, Math.max(10, d.y / 0.26), toward.y / 0.26);
    this.air = true;
    this.airAttack = false;
    this.chase = 16;
    this.move = null;
    this.setState('air', 'jumpUp');
    audio.play('superJump');
    this.game.fx.dust(this.pos, 1.0);
    this.game.fx.dashBurst(this, true);
  }

  wantsUltimate() {
    const p = this.pad, b = p.b;
    return this.ki >= ULTIMATE.cost && (
      (b.special.pressed && (b.heavy.down || p.buffered('heavy', 5))) ||
      (b.heavy.pressed && (b.special.down || p.buffered('special', 5)))
    );
  }

  wantsVanish() {
    const p = this.pad, b = p.b;
    return this.ki >= VANISH.cost && ((b.special.pressed && b.guard.down) || (b.guard.pressed && b.special.down && p.frame - this.spPress < 6));
  }

  // Ground neutral actions. Returns true if something started.
  tryActions() {
    const p = this.pad, b = p.b;
    if (this.wantsVanish()) { this.startVanish(); return true; }
    if (kit.wantsSuper(this)) { kit.startSuper(this); return true; }
    if (this.wantsUltimate()) {
      p.consume('heavy'); p.consume('special');
      this.startUltimate();
      return true;
    }
    if (this.spPending && b.special.released && p.frame - this.spPress < 14) {
      this.spPending = false;
      if (this.doSpecial()) return true;
    }
    if (this.spPending && b.special.down && !b.guard.down && p.frame - this.spPress >= 12) {
      this.spPending = false;
      this.setState('charge');
      return true;
    }
    if (this.wantsThrow()) {
      p.consume('light'); p.consume('heavy');
      this.startThrow();
      return true;
    }
    if (p.buffered('heavy', 6) && !b.special.down) {
      p.consume('heavy');
      this.startMove('heavy', MOVES.heavy);
      return true;
    }
    if (p.buffered('light', 6)) {
      p.consume('light');
      this.startMove('light1', MOVES.light1);
      return true;
    }
    if (p.buffered('jump', 5)) {
      p.consume('jump');
      this.setState('jumpSquat');
      return true;
    }
    if (p.dashDir || b.dash.pressed) {
      this.startDash(p.dashDir);
      return true;
    }
    if (b.guard.down && !b.special.down) {
      this.setState('guard');
      return true;
    }
    return false;
  }

  tryAirActions() {
    const p = this.pad, b = p.b;
    if (this.wantsVanish()) { this.startVanish(); return true; }
    if (kit.wantsSuper(this)) { kit.startSuper(this); return true; }
    if (this.wantsUltimate()) { p.consume('heavy'); p.consume('special'); this.startUltimate(); return true; }
    // air dodge works after an air attack too (it's the way out, not another attack)
    if (!this.airDodged && p.buffered('guard', 3)) { p.consume('guard'); this.startAirDodge(); return true; }
    if (this.airAttack) {
      if ((b.dash.pressed || p.dashDir) && this.startSuperDash()) return true;
      return false;
    }
    if (p.buffered('heavy', 5)) { p.consume('heavy'); this.startMove('airHeavy', MOVES.airHeavy); return true; }
    if (p.buffered('light', 5)) { p.consume('light'); this.startMove('airLight1', MOVES.airLight1); return true; }
    if (b.special.pressed) { this.spPending = false; return this.doProjectile(); }
    if ((b.dash.pressed || p.dashDir) && this.startSuperDash()) return true;
    return false;
  }

  // --------------------------------------------------------------- update
  update() {
    this.prev.copy(this.pos);
    const p = this.game.inputLive ? this.pad : NEUTRAL_PAD;
    const real = this.pad;
    this.pad = p;
    this.clock++;
    if (p.b.special.pressed) { this.spPress = p.frame; this.spPending = true; this.spMx = p.mx; this.spMy = p.my; }
    // every Guard press is a parry attempt unless another press came less than `lockout` frames ago
    // (read even during hitstop, so a press in block stun can parry the next hit of a string)
    if (p.b.guard.pressed) {
      if (p.frame - this.parryTry >= DEFENSE.parry.lockout) this.parryAt = p.frame;
      this.parryTry = p.frame;
    }

    if (this.hitstop > 0) {
      this.hitstop--;
      if (this.hitstop === 0) this.shaking = false;
      this.pad = real;
      return;
    }
    this.t++;
    if (this.invuln > 0) this.invuln--;
    if (this.flash > 0) this.flash = Math.max(0, this.flash - 0.1);
    if (this.chase > 0) this.chase--;
    if (this.airStun > 0) this.airStun--;
    kit.tickMode(this);
    kit.tickBurn(this);
    kit.tickReflex(this);
    kit.tickShroud(this);
    if (this.counterT > 0 && this.state !== 'kit') this.counterT = 0;
    if (this.heldT > 0) {
      this.heldT--;
      // Domain / Whirlwind / Infinity stagger: no actions until it wears off (hits still land)
      if (HOLDABLE.has(this.state)) this.setState('held', 'stagger');
    }
    if (this.game.inputLive && !this.ko && this.state !== 'charge' && this.ki < MAX_KI) this.ki = Math.min(MAX_KI, this.ki + 0.1);

    const freeAnim = () => this.actor.update(FRAME_MS);
    switch (this.state) {
      case 'idle':
      case 'run':
        this.updateNeutral();
        freeAnim();
        break;
      case 'guard':
        this.vel.x *= 0.6; this.vel.z *= 0.6;
        this.faceOpponent();
        if (this.wantsVanish()) { this.startVanish(); break; }
        if (this.wantsSpotDodge()) { this.startSpotDodge(); break; }
        if (this.wantsThrow()) { p.consume('light'); p.consume('heavy'); this.startThrow(); break; } // throw straight out of Guard
        if (kit.wantsSuper(this)) { kit.startSuper(this); break; }
        if (this.wantsUltimate()) { p.consume('heavy'); p.consume('special'); this.startUltimate(); break; }
        if (p.dashDir) { this.startDash(p.dashDir); break; }
        if (p.buffered('jump', 4)) { p.consume('jump'); this.setState('jumpSquat'); break; }
        if (!p.b.guard.down && !this.autoGuard()) this.setState('idle');
        freeAnim();
        break;
      case 'block':
        this.vel.x *= 0.85; this.vel.z *= 0.85;
        if (this.wantsVanish()) { this.startVanish(); break; } // guard-cancel vanish
        if (this.t >= this.stun) this.setState(p.b.guard.down || this.autoGuard() ? 'guard' : 'idle');
        freeAnim();
        break;
      case 'dash': {
        const sp = (this.backDash ? 12 : 16) * (1 - (this.t / 16) * 0.45);
        this.vel.x = this.dashDir.x * sp;
        this.vel.z = this.dashDir.y * sp;
        if (this.backDash) this.faceOpponent();
        if (this.t % 2 === 0) this.actor.ghost(this.def.color, 0.22, 0.5);
        if (this.t >= 4) {
          if (kit.wantsSuper(this)) { kit.startSuper(this); break; }
          if (this.wantsUltimate()) { p.consume('heavy'); p.consume('special'); this.startUltimate(); break; }
          if (this.wantsThrow()) { p.consume('light'); p.consume('heavy'); this.startThrow(); break; }
          if (p.buffered('heavy', 6)) { p.consume('heavy'); this.startMove('heavy', MOVES.heavy); break; }
          if (p.buffered('light', 6)) { p.consume('light'); this.startMove('light1', { ...MOVES.light1, lunge: 9 }); break; }
          if (p.buffered('jump', 5)) { p.consume('jump'); this.setState('jumpSquat'); break; }
        }
        if (this.t >= 15) {
          this.vel.x *= 0.3; this.vel.z *= 0.3;
          this.setState('idle');
        }
        freeAnim();
        break;
      }
      case 'superDash':
        this.updateSuperDash();
        freeAnim();
        break;
      case 'dodge': {
        const S = DEFENSE.spotDodge;
        this.vel.x *= 0.6; this.vel.z *= 0.6;
        this.faceOpponent();
        if (this.t === S.from) this.invuln = Math.max(this.invuln, S.to - S.from);
        if (this.t >= S.from && this.t < S.to && this.t % 3 === 0) this.actor.ghost('#bfe8ff', 0.18, 0.4);
        if (this.t >= S.len + this.dodgeStale * S.stale) this.setState(p.b.guard.down ? 'guard' : 'idle');
        freeAnim();
        break;
      }
      case 'airDodge': {
        const D = DEFENSE.airDodge;
        // Guard a frame before Special still means vanish
        if (this.t <= 3 && this.wantsVanish()) { this.startVanish(); break; }
        if (this.t === D.from) this.invuln = Math.max(this.invuln, D.to - D.from);
        const k = this.dodgeDir ? 0.9 : 0.8;
        this.vel.x *= k; this.vel.z *= k;
        if (this.t < D.to && this.t % 3 === 0) this.actor.ghost('#bfe8ff', 0.2, 0.45);
        this.faceOpponent();
        if (this.t >= D.len) { this.dodgeDir = null; this.setState('air', 'jumpFall'); }
        freeAnim();
        break;
      }
      case 'throw':
        this.updateThrow(p);
        break;
      case 'wavedash': {
        const W = DEFENSE.wavedash;
        this.vel.x *= W.friction; this.vel.z *= W.friction;
        this.faceOpponent();
        if (this.t % 3 === 0 && Math.hypot(this.vel.x, this.vel.z) > 2) this.game.fx.dust(this.pos, 0.4);
        if (this.t >= W.act) {
          const vx = this.vel.x, vz = this.vel.z;
          if (this.tryActions()) {
            if (CARRY_STATES.has(this.state)) this.carry.set(vx, vz);
            break;
          }
        }
        if (this.t >= W.len) this.setState('idle');
        freeAnim();
        break;
      }
      case 'kit':
        kit.update(this);
        break;
      case 'held':
        this.vel.x *= 0.8; this.vel.z *= 0.8;
        if (this.grab) {
          // pinned by a throw: Light + Heavy within the window breaks it
          this.grab.t++;
          if (this.grab.t <= THROW.techWindow && this.wantsThrow()) { p.consume('light'); p.consume('heavy'); this.game.breakThrow(this.grab.by, this); break; }
        }
        if (this.heldT <= 0) {
          if (this.air) this.setState('air', 'jumpFall');
          else this.setState('idle');
        }
        freeAnim();
        break;
      case 'vanish':
        this.vel.set(0, 0, 0);
        if (this.t === VANISH.hideFrames) {
          const o = this.opp, R = this.game.cam.right;
          // appear behind them on the screen axis (same lane), close enough for vanishKick's
          // hitbox; with their back to the barrier, appear in front instead of stacking
          let back = -o.side;
          const off = 0.8;
          if (Math.abs(o.pos.x + R.x * back * off) > ARENA_LIMIT || Math.abs(o.pos.z + R.z * back * off) > ARENA_LIMIT) back = -back;
          let x = o.pos.x + R.x * back * off, z = o.pos.z + R.z * back * off;
          x = THREE.MathUtils.clamp(x, -ARENA_LIMIT, ARENA_LIMIT);
          z = THREE.MathUtils.clamp(z, -ARENA_LIMIT, ARENA_LIMIT);
          this.teleport(x, o.pos.y, z);
          this.air = o.pos.y > 0.05;
          this.hidden = false;
          this.actor.setVisible(true);
          this.faceOpponent();
          this.game.onVanish(this, 'in');
          this.startMove('vanishKick', { ...MOVES.vanishKick, hover: this.air });
        }
        break;
      case 'jumpSquat':
        this.vel.x *= 0.7; this.vel.z *= 0.7;
        if (this.t >= 4) {
          const d = this.inputDir();
          // Guard pressed with the jump (from 2 frames before the squat): air dodge on the first airborne
          // frame, i.e. a wavedash without leaving the floor. No direction = land on the spot (Melee rules).
          if (p.buffered('guard', this.t + 2)) {
            p.consume('guard');
            if (d.lengthSq() > 0.04) this.startWavedash(d.normalize());
            else { this.landLag = DEFENSE.airDodge.land; this.setState('land'); }
            break;
          }
          const sp = this.speedStat;
          this.vel.set(d.x * sp, 13.6, d.y * sp);
          this.air = true;
          this.airAttack = false;
          this.setState('air', 'jumpUp');
          audio.play('jump');
          this.game.fx.dust(this.pos, 0.7);
        }
        freeAnim();
        break;
      case 'air': {
        this.actor.play(this.vel.y > 1.5 ? 'jumpUp' : 'jumpFall');
        if (this.chase <= 0) {
          const d = this.inputDir();
          const sp = this.speedStat;
          this.vel.x += d.x * 0.45; this.vel.z += d.y * 0.45;
          const h = Math.hypot(this.vel.x, this.vel.z);
          if (h > sp) { this.vel.x *= sp / h; this.vel.z *= sp / h; }
        } else if (this.chase % 2 === 0) this.actor.ghost(this.def.color, 0.2, 0.45);
        this.faceOpponent();
        if (this.tryAirActions()) break;
        freeAnim();
        break;
      }
      case 'land':
        this.vel.x *= 0.6; this.vel.z *= 0.6;
        if (this.t >= 3 && this.landLag <= 6 && this.tryActions()) break;
        if (this.t >= this.landLag) this.setState('idle');
        freeAnim();
        break;
      case 'attack':
        this.updateAttack();
        break;
      case 'hitstun':
        this.vel.x *= 0.86; this.vel.z *= 0.86;
        if (this.t >= this.stun) { this.combo = 0; this.setState('idle'); }
        freeAnim();
        break;
      case 'launched':
        if (!this.ko && !this.heldT && this.forceTech && this.t > 4 && this.pos.y > 0.2) { this.forceTech = false; this.airRecover(); break; }
        if (!this.ko && !this.heldT && this.airStun <= 0 && this.pos.y > 0.35 && this.anyPress()) {
          this.airRecover();
          break;
        }
        this.actor.play(this.bigLaunch && !this.ko ? 'spin' : 'launched');
        freeAnim();
        break;
      case 'airRecover':
        this.invuln = Math.max(this.invuln, 2);
        if (this.t >= 10) { this.airAttack = false; this.setState('air', 'jumpFall'); }
        freeAnim();
        break;
      case 'down':
        this.vel.x *= 0.85; this.vel.z *= 0.85;
        this.invuln = 2;
        if (this.ko) {
          if (!this.koLanded && this.t > 20) { this.koLanded = true; this.game.onKOLanded(this); }
        } else if (this.t >= 40 || (this.t >= 16 && this.anyPress())) {
          this.combo = 0;
          this.setState('getup');
          this.invuln = 28;
          audio.play('jump', 0.6);
        }
        freeAnim();
        break;
      case 'getup':
        this.vel.x *= 0.7; this.vel.z *= 0.7;
        if (this.t >= 20) this.setState('idle');
        freeAnim();
        break;
      case 'charge': {
        this.vel.x *= 0.7; this.vel.z *= 0.7;
        const before = this.ki;
        this.ki = Math.min(MAX_KI, this.ki + 1.45);
        if (Math.floor(before / KI_BAR) < Math.floor(this.ki / KI_BAR)) {
          audio.play('kiFull');
          this.game.fx.burstAt(this, this.def.color, 1.2);
        }
        audio.loop('charge' + this.index, 'charge');
        if (this.wantsUltimate() || (p.b.heavy.pressed && this.ki >= ULTIMATE.cost)) {
          audio.stopLoop('charge' + this.index);
          p.consume('heavy'); p.consume('special');
          this.startUltimate();
          break;
        }
        if (!p.b.special.down || p.b.guard.pressed || p.b.jump.pressed) {
          audio.stopLoop('charge' + this.index);
          this.setState('idle');
        }
        freeAnim();
        break;
      }
      case 'beamCharge':
        this.vel.multiplyScalar(0.5);
        if (this.t < this.windup - 4) this.faceOpponent();
        if (this.t >= this.windup) {
          this.setState('beamFire');
          this.beam = this.game.fireBeam(this);
        }
        freeAnim();
        break;
      case 'beamFire':
        this.vel.set(0, 0, 0);
        if (!this.beam || this.beam.dead) {
          this.landLag = 20;
          this.setState(this.air ? 'air' : 'land', this.air ? 'jumpFall' : 'land');
        }
        freeAnim();
        break;
      case 'clash':
        this.vel.set(0, 0, 0);
        freeAnim();
        break;
      default:
        this.vel.x *= 0.8; this.vel.z *= 0.8;
        freeAnim();
    }

    if (p.b.special.released) this.spPending = false;
    if (this.state !== 'charge') audio.stopLoop('charge' + this.index);
    this.pad = real;
    this.physics();
  }

  updateNeutral() {
    if (this.tryActions()) return;
    if (this.autoGuard()) { this.setState('guard'); return; } // turn and guard instead of running away
    const d = this.inputDir();
    if (d.lengthSq() > 0.04) {
      const sp = this.speedStat;
      this.vel.x += (d.x * sp - this.vel.x) * 0.38;
      this.vel.z += (d.y * sp - this.vel.z) * 0.38;
      this.face.set(d.x, d.y).normalize();
      const R = this.game.cam.right;
      const along = this.face.x * R.x + this.face.y * R.z;
      if (Math.abs(along) > 0.3) this.side = Math.sign(along);
      if (this.state !== 'run') {
        this.setState('run');
        this.game.fx.dust(this.pos, 0.5);
      }
      if (this.t % 12 === 6) { this.game.fx.dust(this.pos, 0.35); audio.play('step', 0.5); }
    } else {
      this.vel.x *= 0.55;
      this.vel.z *= 0.55;
      this.faceOpponent();
      if (this.state !== 'idle') this.setState('idle');
    }
  }

  updateSuperDash() {
    const o = this.opp;
    const tgt = new THREE.Vector3(o.pos.x, o.pos.y + (o.air ? 0.1 : 0.0), o.pos.z);
    const d = tgt.sub(this.pos);
    const dist = d.length();
    d.normalize();
    const S = SUPER_DASH;
    const want = d.multiplyScalar(S.speed);
    this.vel.lerp(want, this.t < 3 ? 1 : 0.3);
    this.faceOpponent();
    this.air = this.pos.y > 0.02 || this.vel.y > 0;
    if (this.t % 2 === 0) this.actor.ghost(this.def.color, 0.24, 0.5);
    if (this.t % 6 === 0) audio.play('whoosh', 0.4);
    const p = this.pad;
    // cancel into an attack
    if (this.t >= 6 && (p.buffered('light', 6) || p.buffered('heavy', 6))) {
      const heavy = p.buffered('heavy', 6);
      p.consume('light'); p.consume('heavy');
      this.vel.multiplyScalar(0.25);
      const name = this.air ? (heavy ? 'airHeavy' : 'airLight1') : heavy ? 'heavy' : 'light1';
      this.startMove(name, MOVES[name]);
      return;
    }
    if (dist < 1.0) {
      if (o.hittable) {
        const dir = new THREE.Vector2(o.pos.x - this.pos.x, o.pos.z - this.pos.z).normalize();
        o.takeHit(this, { ...S, name: 'superDash' }, dir);
        this.moveHit = true;
      }
      this.vel.multiplyScalar(0.15);
      if (this.air) { this.airAttack = false; this.setState('air', 'jumpFall'); this.vel.y = Math.max(this.vel.y, 3); }
      else this.setState('idle');
      return;
    }
    if (this.t >= S.maxFrames) {
      this.vel.multiplyScalar(0.3);
      if (this.air) this.setState('air', 'jumpFall');
      else this.setState('idle');
    }
  }

  updateAttack() {
    const p = this.pad, m = this.move, t = this.t;
    if (t <= 2 && !this.moveHit && !this.air && ((this.moveName === 'light1' && p.b.heavy.pressed) || (this.moveName === 'heavy' && p.b.light.pressed))) {
      // Light and Heavy a frame or two apart still read as a throw
      p.consume('light'); p.consume('heavy');
      this.startThrow();
      return;
    }
    const A = m.startup, B = m.startup + m.active, C = B + m.recovery;
    const phase = t < A ? 0 : t < B ? 1 : 2;
    const prog = phase === 0 ? t / A : phase === 1 ? (t - A) / m.active : (t - B) / m.recovery;
    this.actor.setPhase(m.anim, phase, Math.min(0.999, prog));

    if (t === Math.max(1, A - 2) && m.sfx) audio.play(m.sfx);
    if (t < A - 1) this.faceOpponent();
    // auto-step into the opponent's depth lane while the attack comes out
    if (t < B && !m.projectile) {
      const { sd } = this.laneOffsets();
      if (Math.abs(sd) < 2.6) {
        const F = this.game.cam.fwd;
        const step = Math.max(-0.1, Math.min(0.1, sd * 0.35));
        this.pos.x += F.x * step;
        this.pos.z += F.z * step;
      }
    }

    if (m.rush) {
      if (phase === 1 && !this.moveHit) {
        this.vel.x = this.face.x * m.rush;
        this.vel.z = this.face.y * m.rush;
        if (t % 2 === 0) this.actor.ghost(m.color, 0.22, 0.45);
      } else {
        this.vel.x *= 0.8; this.vel.z *= 0.8;
      }
    } else if (m.lunge && !m.air) {
      if (t < B && !this.moveHit) {
        const k = m.lunge * (1 - t / B);
        this.vel.x = this.face.x * k;
        this.vel.z = this.face.y * k;
      } else {
        this.vel.x *= 0.7; this.vel.z *= 0.7;
      }
    } else if ((m.air || m.hover) && this.moveHit && this.opp.state === 'launched' && !this.opp.ko) {
      // DBFZ air juggle: after connecting, ride along with the victim's pop and push, and close in to
      // the closest spacing (separate() keeps 0.72) so the next chained hit is still in range: a launched
      // pose leans back, so its hurtbox starts behind the victim's feet
      const o = this.opp;
      this.vel.set(o.vel.x, o.vel.y, o.vel.z);
      this.pos.y += (o.pos.y - 0.1 - this.pos.y) * 0.25;
      const dx = o.pos.x - this.pos.x, dz = o.pos.z - this.pos.z, d = Math.hypot(dx, dz);
      if (d > JUGGLE_GAP) {
        const k = ((d - JUGGLE_GAP) * 0.3) / d;
        this.pos.x += dx * k;
        this.pos.z += dz * k;
      }
    } else if (m.air || m.hover) {
      // drift slightly toward the opponent while attacking in the air; a juggled one is tracked to the
      // juggle spacing during the startup too, or the push opens the gap again before the next hit lands
      const o = this.opp, dd = this.distTo();
      if (o.state === 'launched' && !o.ko && dd > JUGGLE_GAP && dd < 2.2) {
        const k = ((dd - JUGGLE_GAP) * 0.2) / dd;
        this.pos.x += (o.pos.x - this.pos.x) * k;
        this.pos.z += (o.pos.z - this.pos.z) * k;
      }
      const k = dd > JUGGLE_GAP + 0.15 ? 2.2 : 0;
      this.vel.x += (this.face.x * k - this.vel.x) * 0.2;
      this.vel.z += (this.face.y * k - this.vel.z) * 0.2;
      if (this.vel.y < -2.5) this.vel.y = -2.5;
      if (this.vel.y > 0) this.vel.y *= 0.82; // hover at the victim's height instead of drifting up
    } else if (!this.air) {
      // ground moves without a lunge (shots) plant the feet instead of sliding on the walk speed
      this.vel.x *= 0.7; this.vel.z *= 0.7;
    }
    if (m.hop && t === A && !this.air) {
      this.vel.y = m.hop;
      this.air = true;
    }
    if (m.projectile && t === A) this.game.spawnProjectile(this);

    if (phase === 1 && !this.hitDone && !m.projectile) this.game.checkMelee(this, m);
    if (phase === 2 && m.special && t === B) this.endMoveFx();

    // cancels (DBFZ style: chain -> launcher -> special/super, jump-cancel launcher)
    if (m.next && t >= m.cancel && p.buffered('light', 10)) {
      p.consume('light');
      this.startMove(m.next, MOVES[m.next]);
      return;
    }
    if (this.moveHit && t >= A) {
      if (m.launcher && (p.buffered('jump', 10) || p.buffered('dash', 10))) {
        p.consume('jump'); p.consume('dash');
        this.startChase();
        return;
      }
      if (this.wantsVanish()) { this.startVanish(); return; }
      if (!m.special && kit.wantsSuper(this)) { kit.startSuper(this); return; }
      if (!m.special && this.wantsUltimate()) { p.consume('heavy'); p.consume('special'); this.startUltimate(); return; }
      if (m.light && p.buffered('heavy', 8)) { p.consume('heavy'); this.startMove('heavy', MOVES.heavy); return; }
      if (m.air && !m.next && p.buffered('heavy', 8) && this.moveName !== 'airHeavy') { p.consume('heavy'); this.startMove('airHeavy', MOVES.airHeavy); return; }
      if (m.air && m.next && p.buffered('heavy', 8)) { p.consume('heavy'); this.startMove('airHeavy', MOVES.airHeavy); return; }
      if (!m.special && !m.air && this.spPending) {
        this.spPending = false;
        this.cancelSpecial = true; // kit.js START.rush reads it for the faster cancelled startup
        const ok = this.doSpecial();
        this.cancelSpecial = false;
        if (ok) return;
      }
      if ((m.wallBounce || m.launch) && t >= B && (p.buffered('dash', 8) || p.dashDir) && this.airDashes === 0) {
        p.consume('dash');
        this.startSuperDash();
        return;
      }
    }

    if (t >= C) {
      this.move = null;
      if (this.air) this.setState('air', 'jumpFall');
      else this.setState('idle');
    }
  }

  airRecover() {
    this.combo = 0;
    this.gb = this.wb = false;
    this.vel.set(-this.face.x * 2.5, 6.5, -this.face.y * 2.5);
    this.invuln = 16;
    this.setState('airRecover');
    audio.play('jump', 0.7);
    this.game.fx.ring(this.pos, '#ffffff', 0.6, this.pos.y + 0.8);
  }

  onLand() {
    switch (this.state) {
      case 'kit':
        kit.onLand(this);
        break;
      case 'held':
        break;
      case 'air':
        this.landLag = 5;
        this.setState('land');
        audio.play('land', 0.6);
        this.game.fx.dust(this.pos, 0.7);
        break;
      case 'airRecover':
        this.setState('land');
        this.landLag = 4;
        break;
      case 'airDodge':
        // a directional dodge into the floor slides (wavedash); a neutral one just lands, with lag
        if (this.dodgeDir) this.startWavedash();
        else {
          this.invuln = 0;
          this.landLag = DEFENSE.airDodge.land;
          this.setState('land');
          this.game.fx.dust(this.pos, 0.6);
        }
        break;
      case 'attack': {
        const m = this.move;
        if (m && (m.air || m.hop || m.hover)) {
          if (m.hop && this.t < m.startup + m.active) break; // launcher keeps going through its hop
          this.move = null;
          this.landLag = 8;
          this.setState('land');
          this.game.fx.dust(this.pos, 0.8);
        }
        break;
      }
      case 'launched': {
        const impact = -this.vel.y;
        if (this.gb && !this.ko) {
          // ground bounce: pop back up for more juggling
          this.gb = false;
          this.vel.y = 11;
          this.vel.x *= 0.35; this.vel.z *= 0.35;
          this.air = true;
          this.airStun = 30;
          this.bigLaunch = true;
          this.game.onGroundBounce(this);
        } else if (impact > 8 && !this.bounced) {
          this.bounced = true;
          this.vel.y = impact * 0.32;
          this.vel.x *= 0.5; this.vel.z *= 0.5;
          this.air = true;
          audio.play('thud');
          this.game.fx.dust(this.pos, 1.3);
          if (impact > 14 || this.ko) this.game.fx.crater(this.pos);
          this.game.cam.shake(0.25);
        } else {
          this.vel.y = 0;
          this.bigLaunch = false;
          this.setState('down', this.ko ? 'ko' : 'down');
          audio.play('land', 0.8);
          this.game.fx.dust(this.pos, 1.0);
        }
        break;
      }
      case 'superDash':
        break;
      default:
        break;
    }
  }

  gravityScale() {
    switch (this.state) {
      case 'kit':
        return kit.gravityScale(this);
      case 'held':
        return this.air ? 0.25 : 1;
      case 'superDash':
      case 'vanish':
      case 'beamCharge':
      case 'beamFire':
      case 'clash':
        return 0;
      case 'airDodge':
        return this.t < DEFENSE.airDodge.to ? 0 : 1; // the dodge holds its line (a directional one keeps its drop)
      case 'attack':
        return this.move?.hover ? 0 : this.move?.air ? 0.35 : 1;
      case 'launched':
        return this.ko ? 0.9 : Math.min(1.35, 0.6 + this.combo * 0.035);
      case 'air':
        return this.chase > 0 ? 0.3 : 1;
      default:
        return 1;
    }
  }

  physics() {
    if (this.state === 'beamFire' || this.state === 'clash' || this.state === 'vanish') return;
    if (this.ko) return this.koPhysics();
    this.pos.addScaledVector(this.vel, DT);
    if (this.carry.x || this.carry.y) {
      // wavedash momentum riding under the next move, fading at the slide's friction
      this.pos.x += this.carry.x * DT;
      this.pos.z += this.carry.y * DT;
      this.carry.multiplyScalar(DEFENSE.wavedash.friction);
      if (this.carry.lengthSq() < 0.04) this.carry.set(0, 0);
    }
    if (this.air || this.pos.y > 0) this.vel.y -= GRAVITY * this.gravityScale() * DT;
    if (this.pos.y <= 0) {
      this.pos.y = 0;
      if (this.air && this.vel.y <= 0) {
        this.air = false;
        this.onLand();
      }
      if (!this.air && this.state !== 'superDash') this.airDashes = 0;
      if (!this.air) this.airDodged = false;
      if (!this.air) this.vel.y = Math.max(0, this.vel.y);
    } else this.air = true;
    // ring barrier (wall bounce for smash hits)
    for (const k of ['x', 'z']) {
      if (Math.abs(this.pos[k]) > ARENA_LIMIT) {
        const s = Math.sign(this.pos[k]);
        this.pos[k] = s * ARENA_LIMIT;
        if (this.state === 'launched' && this.wb && Math.abs(this.vel[k]) > 5 && !this.ko) {
          this.wb = false;
          this.vel[k] = -this.vel[k] * 0.55;
          this.vel.y = Math.max(this.vel.y, 7);
          this.airStun = 32;
          this.bigLaunch = true;
          this.game.onWallBounce(this, k, s);
        } else if (this.state === 'launched' || this.state === 'down') this.vel[k] *= -0.25;
        else this.vel[k] = 0;
      }
    }
  }

  // Destructive finish: no ring barrier, drop off the ring onto the grass,
  // crash into the stands' walls.
  koPhysics() {
    this.pos.addScaledVector(this.vel, DT);
    const onRing = Math.abs(this.pos.x) <= RING_HALF && Math.abs(this.pos.z) <= RING_HALF;
    const floor = onRing ? 0 : -RING_TOP;
    if (this.air || this.pos.y > floor) this.vel.y -= GRAVITY * 0.9 * DT;
    const ax = Math.abs(this.pos.x), az = this.pos.z;
    const hitSide = ax > 12.15 && Math.abs(az) < 13;
    const hitFront = az > 12.35 && ax > 3 && ax < 12.6;
    const hitBack = az < -17.5;
    if ((hitSide || hitFront || hitBack) && !this.crashed) {
      this.crashed = true;
      if (hitSide) this.pos.x = Math.sign(this.pos.x) * 12.15;
      if (hitFront) this.pos.z = 12.35;
      if (hitBack) this.pos.z = -17.5;
      const speed = this.vel.length();
      this.vel.set(-this.vel.x * 0.12, Math.max(0, this.vel.y) * 0.2, -this.vel.z * 0.12);
      this.game.onKOCrash(this, speed);
    }
    if (this.pos.y <= floor) {
      this.pos.y = floor;
      if (this.air && this.vel.y <= 0) {
        this.air = false;
        if (this.state === 'launched') {
          if (!this.bounced && this.vel.y < -7) {
            this.bounced = true;
            this.vel.y = -this.vel.y * 0.3;
            this.vel.x *= 0.5; this.vel.z *= 0.5;
            this.air = true;
            audio.play('thud');
            this.game.fx.dust(this.pos, 1.4);
          } else {
            this.vel.y = 0;
            this.setState('down', 'ko');
            this.game.fx.dust(this.pos, 1.2);
          }
        }
      }
      if (!this.air) { this.vel.y = 0; this.vel.x *= 0.9; this.vel.z *= 0.9; }
    } else this.air = true;
  }

  // --------------------------------------------------------------- getting hit
  takeHit(att, m, dir) {
    if (this.ko) return 'miss';
    if (this.counterT > 0 && this.state === 'kit' && !m.beam && !m.unblockable) return kit.counterHit(this, att, m);
    if (this.reflex && kit.reflexReady(this, m)) return kit.reflexCounter(this, att, m); // Whirlwind (ADR 0017)
    this.sinceHit = 0; // blocked or not (training health refill waits for a calm spell)
    if (m.projectileHit && this.state === 'superDash') return 'miss'; // super dash plows through projectiles
    // hold back to block: standing or running on the ground with the stick away from them, you turn and block
    const backBlock = !m.unblockable && (this.state === 'idle' || this.state === 'run') && !this.air && this.holdingBack();
    if (backBlock) this.faceOpponent();
    const tx = att.pos.x - this.pos.x, tz = att.pos.z - this.pos.z;
    const tl = Math.hypot(tx, tz) || 1;
    const facingAtt = (this.face.x * tx + this.face.y * tz) / tl > 0.05;
    const hs = m.hitstop ?? 6;
    const blocking = (this.state === 'guard' || this.state === 'block' || backBlock) && facingAtt && !m.unblockable;
    if (blocking && !m.beam && this.pad.frame - this.parryAt <= DEFENSE.parry.window) return this.parry(att, m);
    if (blocking) {
      const chip = kit.noChip(this) ? 0 : Math.round(m.dmg * (m.beam ? 0.3 : 0.1));
      this.hp = Math.max(1, this.hp - chip);
      this.stun = Math.round((m.hitstun ?? 26) * 0.6 + (m.big ? 8 : 0));
      this.setState('block');
      this.blockAt = this.clock;
      const pw = (m.push ?? 4) * 0.9 + (m.launch ? 4 : 0);
      this.vel.x = dir.x * pw;
      this.vel.z = dir.y * pw;
      this.hitstop = Math.ceil(hs * 0.7);
      this.shaking = true;
      if (!m.projectileHit && !m.beam) att.hitstop = this.hitstop;
      this.ki = Math.min(MAX_KI, this.ki + 4);
      this.game.onBlock(att, this, m);
      return 'block';
    }
    const wasStunned = this.state === 'hitstun' || this.state === 'launched';
    this.combo = wasStunned ? this.combo + 1 : 1;
    this.carry.set(0, 0);
    this.airDodged = false; // getting hit gives the air dodge back (for after the tech)
    this.dodgeDir = null;
    if (this.grab) { this.grab = null; this.heldT = 0; } // knocked out of a throw's grip
    if (!wasStunned) { this.gb = false; this.wb = false; this.bounced = false; }
    const scale = Math.max(m.minScale ?? 0.4, 1 - (this.combo - 1) * 0.065); // supers keep a higher floor
    const dmg = Math.max(1, Math.round((m.dmg * scale * (att.def.stats.power || 1) * (att.mode?.damage ?? 1)) / ((this.def.stats.defense || 1) * (this.mode?.defense ?? 1))));
    this.hp = Math.max(0, this.hp - dmg);
    this.comboDmg = wasStunned ? this.comboDmg + dmg : dmg;
    att.ki = Math.min(MAX_KI, att.ki + 4 + dmg * 0.07);
    this.ki = Math.min(MAX_KI, this.ki + 2 + dmg * 0.04);
    this.flash = 1;
    if (this.state === 'attack') this.endMoveFx();
    if (this.state === 'charge') audio.stopLoop('charge' + this.index);
    if (this.state === 'beamCharge' || this.state === 'beamFire') this.beam?.kill?.();
    this.move = null;
    if (this.kitState) {
      // knocked out of a kit move (dive, pull cast, counter whiff...)
      this.kitState = null;
      this.counterT = 0;
      this.hidden = false;
      this.actor.setVisible(true);
    }
    if (this.hp <= 0) {
      if (this.game.training) this.hp = 1;
      else this.ko = true;
    }
    // hitstun decay: long combos give the victim less stun, more gravity and an earlier tech
    const decay = Math.max(0.35, 1 - (this.combo - 1) * 0.045);
    if (m.groundBounce) this.gb = true;
    if (m.wallBounce) this.wb = true;
    const inAir = this.air || this.pos.y > 0.05;
    if (m.launch || this.ko) {
      const finisher = m.big || m.special || m.beam;
      const L = this.ko
        ? finisher ? [Math.max(23, m.launch?.[0] ?? 0), Math.max(10, m.launch?.[1] ?? 0)] : [Math.max(14, m.launch?.[0] ?? 0), Math.max(8.5, m.launch?.[1] ?? 0)]
        : m.launch;
      this.vel.set(dir.x * L[0], L[1], dir.y * L[0]);
      if (L[1] < 0 && !inAir) this.vel.y = 6; // spike on a grounded victim pops them up
      this.air = true;
      this.bounced = false;
      this.bigLaunch = Math.abs(L[1]) > 12 || L[0] > 13;
      this.airStun = Math.round(Math.max(6, 40 - this.combo * 1.6) * decay);
      this.setState('launched', this.bigLaunch ? 'spin' : 'launched');
    } else if (inAir) {
      // juggle: keep them floating
      const pw = (m.push ?? 2) * 0.7;
      const pop = (m.airPop ?? 5.5) * Math.max(0.5, 1 - this.combo * 0.03);
      this.vel.set(dir.x * pw, Math.max(this.vel.y * 0.3, pop), dir.y * pw);
      this.air = true;
      this.bigLaunch = false;
      this.airStun = Math.round(Math.max(5, 26 - this.combo * 1.0) * decay);
      this.setState('launched', 'launched');
    } else {
      this.stun = Math.round((m.hitstun ?? 20) * decay);
      this.hurtAlt = !this.hurtAlt;
      this.setState('hitstun', m.low || this.hurtAlt ? 'hurtLow' : 'hurtHigh');
      const pw = m.push ?? 3;
      this.vel.x = dir.x * pw;
      this.vel.z = dir.y * pw;
    }
    if (this.combo >= 22 && this.state === 'launched' && !this.ko) this.forceTech = true; // combo cap
    this.setSide(-att.side);
    this.hitstop = hs;
    this.shaking = true;
    if (!m.projectileHit && !m.beam) att.hitstop = hs;
    this.game.onHit(att, this, m, dmg);
    return 'hit';
  }

  // Damage over time (kit.tickBurn): no stun, no combo, no state change. A tick that would KO turns
  // into a real final hit so the KO plays out like any other.
  dot(att, base) {
    if (this.ko) return;
    const d = Math.max(1, Math.round((base * (att.def.stats.power || 1)) / ((this.def.stats.defense || 1) * (this.mode?.defense ?? 1))));
    if (this.hp - d > 0 || this.game.training) {
      this.hp = Math.max(1, this.hp - d);
      this.flash = Math.max(this.flash, 0.45);
      return;
    }
    this.hp = 1;
    this.burn = null;
    this.takeHit(att, { dmg: d, minScale: 1, launch: [5, 9], hitstop: 10, unblockable: true, big: true, spark: 'heavy' }, this.face.clone().negate());
  }

  // --------------------------------------------------------------- render sync
  sync(camera, camRight, alpha, time) {
    const a = this.hitstop > 0 ? 1 : alpha;
    let x = this.prev.x + (this.pos.x - this.prev.x) * a;
    const y = this.prev.y + (this.pos.y - this.prev.y) * a;
    let z = this.prev.z + (this.pos.z - this.prev.z) * a;
    if (this.shaking && this.hitstop > 0) {
      const s = Math.sin(time * 95) * 0.05 * Math.min(1, this.hitstop / 4);
      x += camRight.x * s;
      z += camRight.z * s;
    }
    this.renderPos = this.renderPos || new THREE.Vector3();
    this.renderPos.set(x, y, z);
    this.actor.place(x, y, z);
    this.actor.sync(camera, this.face.x, this.face.y, camRight);
    const u = this.actor.mat.uniforms;
    let flash = this.flash > 0.6 ? 1 : this.flash * 0.6;
    if (this.state === 'charge' || this.state === 'beamCharge') {
      u.flashColor.value.set(this.def.color);
      flash = Math.max(flash, 0.12 + 0.1 * Math.sin(time * 30));
    } else u.flashColor.value.set(0xffffff);
    if (this.invuln > 0 && this.state === 'getup' && (this.t >> 2) % 2) flash = Math.max(flash, 0.25);
    if (this.invuln > 0 && (this.state === 'dodge' || this.state === 'airDodge')) {
      // intangible shimmer, so a dodge reads at a glance
      u.flashColor.value.set(0xbfe8ff);
      flash = Math.max(flash, 0.28 + 0.14 * Math.sin(time * 42));
    }
    if (this.game.superFlash?.who === this) flash = Math.max(flash, this.game.superFlash.t < 6 ? 1 : 0);
    u.flash.value = flash;
  }
}
