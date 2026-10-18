import * as THREE from 'three';
import { SpriteActor } from './sprites.js';
import { MOVES, SPECIALS, ULTIMATE, SUPER_DASH, VANISH, DEFENSE, THROW, JUGGLE, MELEE_CLASH, NORMALS, AIR } from './moves.js';
import { ARENA_LIMIT, GRAVITY, DT, MAX_HP, MAX_KI, KI_BAR, RING_HALF, RING_TOP, RING_LIP } from './constants.js';
import { Pad, CSTICK } from '../core/input.js';
import { audio } from '../core/audio.js';
import * as kit from './kit.js';
import { chargeStyle } from './chargeFx.js';
import { resetHitFlash, startHitFlash, flashTier, hitFlashUniforms, hitShake } from './hitFlash.js';
import { TECH_ART, techPose, rollBackward, wallFacing, wallShift } from './techAnim.js';
import { pickAnim } from './animAlts.js';
import * as dmath from './dmath.js';

const NEUTRAL_PAD = new Pad();
// states a held fighter is pulled out of (they can't act until the hold wears off)
const HOLDABLE = new Set(['idle', 'run', 'guard', 'block', 'air', 'land', 'jumpSquat', 'dash', 'charge', 'attack', 'airRecover', 'superDash', 'kit', 'dodge', 'airDodge', 'wavedash', 'throw', 'clashBack']);
const FRAME_MS = 1000 / 60;
const ACTIONS = ['light', 'heavy', 'special', 'jump', 'guard', 'dash'];
// out of a wavedash slide, these keep sliding (attacks, guard, specials); jumps and dashes set their own speed
const CARRY_STATES = new Set(['attack', 'guard', 'kit', 'charge', 'throw']);
// the C-stick's ways as a stick (screen right, up): the aim normalFor reads instead of the left stick
const C_AIM = { cUp: [0, 1], cDown: [0, -1], cLeft: [-1, 0], cRight: [1, 0] };
const JUGGLE_GAP = 0.76; // spacing an air juggle closes to (just outside Game.separate's 0.72)
// ADR 0022: leaving one of these opens the REVERSAL window; starting one of the actions inside it is a reversal
const STUN_STATES = new Set(['hitstun', 'launched', 'down', 'block', 'getup', 'airRecover', 'techRoll', 'impactTech', 'held']);
const REVERSAL_STATES = new Set(['attack', 'kit', 'throw', 'vanish', 'superDash', 'beamCharge']);
// A KO'd body lies up to about 2 units long (254 px / 128 ppu) across the screen. Within half that of the ring edge it
// would rest with its head or feet hanging over the drop (or sunk in the lip), so it keeps sliding off onto the grass.
const KO_EDGE = 1.0;
const KO_SLIDE = 3; // units/s the body slides outward while it is within KO_EDGE of the edge
const AXES = ['x', 'z'];
// reused results of the per-frame tech pose helpers (techAnim.js), read at once
const TECH_POSE = {};
const WALL_FACE = {};

export class Fighter {
  constructor(game, def, asset, index) {
    this.game = game;
    this.def = def;
    this.asset = asset;
    this.index = index;
    this.actor = new SpriteActor(asset, game.scene);
    // attack alts (ADR 0031): uses per base strip this match (animAlts.pickAnim), and the sheet test it reads
    this.animUses = {};
    this.hasStrip = (name) => this.actor.hasAnim(name);
    this.moveAnim = null; // the strip the running move shows (its base or alt), for the move in moveAnimOf
    this.moveAnimOf = null;
    this.pos = new THREE.Vector3();
    this.prev = new THREE.Vector3();
    this.vel = new THREE.Vector3();
    this.face = new THREE.Vector2(index === 0 ? 1 : -1, 0);
    this.side = index === 0 ? 1 : -1; // facing screen-right (+1) or screen-left (-1)
    this.pad = NEUTRAL_PAD;
    this.wins = 0;
    this.parries = 0; // this match (the CPU showcase, aiShow.js, notices them here)
    this.techStats = { faced: 0, teched: 0 }; // techable impacts this match and the timed techs (the combo composer reads it)
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
    this.flash = 0; // the 'classic' hit flash; the other styles run on hfx (hitFlash.js)
    resetHitFlash(this);
    this.spPending = false;
    this.spPress = -99;
    this.landLag = 6;
    this.beam = null;
    this.hurtAlt = false;
    this.gb = false; // ground bounce pending
    this.wb = false; // wall bounce pending
    this.gbCount = this.wbCount = 0; // bounces this combo (the JUGGLE budget)
    this.chase = 0;
    this.airDashes = 0;
    this.forceTech = false;
    this.shaking = false;
    this.clashOut = null; // a melee clash's bounce, taken when its freeze ends (clashBounce)
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
    // combo escape and true combos (ADR 0022)
    this.gapF = 0; // open frames (could have teched) since the last hit
    this.lastGap = 0; // the gap before the latest hit
    this.maxGap = 0; // the widest gap in this combo (training shows it)
    this.comboBlue = false; // this combo had a gap: it could have been escaped
    this.comboFrom = 0; // pad frame the combo started (a burst press must come after it)
    this.hardKD = false; // the last hit was a hard knockdown: no tech roll
    this.burstUsed = 0; // bursts this round
    this.burstHit = null; // the running burst's shockwave connected: 'hit' | 'block'
    this.burstEnd = 0;
    this.parriedAt = -99; // clock when this fighter was parried (PUNISH); `clock` restarts every round
    this.freeAt = -99; // clock when stun, block or wake-up last ended (REVERSAL)
    this.reversal = false;
    this.punishHit = false;
    this.tagAt = this.tagAt || {}; // Game.tag cooldowns
    // timed impact tech (ADR 0028): its window and lockout count live frames (not hitstop, not world freezes)
    this.liveF = 0;
    this.itTry = -999; // live frame of the last Guard press that counted as a timed tech attempt
    this.itSeen = null; // the pad's guard.lastPress already read
    this.noTech = false; // the last hit was a super finish: its impact can't be teched
    this.techKind = null; // the running impact tech: 'inPlace' | 'roll' | 'wall' (the cling) | 'wallKick'
    this.techAxis = null;
    this.techSign = 0;
    this.techedAt = -99; // clock of the last timed tech (the combo composer's end reason)
    this.techArt = false; // the running tech has its dedicated strip in this fighter's sheet (ADR 0030)
    this.wallJumpPose = 0; // airborne frames the wall tech's push-off pose still shows over a wall jump (visual only)
    this.rollBack = false; // the running tech roll plays its tumble backward (decided at its start, lockRollPose)
    this.rollFx = this.face.x; // ... and the facing its strip keeps on screen
    this.rollFz = this.face.y;
    // directional normals and Smash air (ADR 0042)
    this.atkMx = this.atkMy = 0; // the stick when Light or Heavy was last pressed (normalFor)
    this.jumped2 = false; // the double jump is used (back on landing or when hit)
    this.shortHop = false; // the jump squat running was Jump + attack: a short hop, the aerial out at once
    this.fastFell = false;
    this.juggleMove = false; // the running air attack started beside a reeling opponent: the DBFZ float, not Smash air
    this.mirrorPose = false; // a back air shown with a forward strip until its own exists: drawn and boxed mirrored
    this.feetLand = false; // the last hit was a light pop: land on the feet, not in a knockdown
    this.chargeT = 0; // frames a smash attack was held charging
    this.chargeMul = 1;
    this.chargeDone = false;
    this.endMoveFx();
    this.actor.setVisible(true);
    this.actor.play('idle', true);
  }

  // --------------------------------------------------------------- helpers
  setState(s, anim = s) {
    if (this.state === 'attack' && s !== 'attack') {
      this.endMoveFx();
      this.mirrorPose = false;
    }
    if (this.state === 'throw' && s !== 'throw') this.releaseGrab();
    if (this.state === 'kit' && s !== 'kit' && this.kitState) {
      // leaving a kit move by any route (round reset, debug tools) never leaves it half-running
      this.kitState = null;
      this.counterT = 0;
      this.hidden = false;
      this.actor.setVisible(true);
      this.game.fx.drop('fist' + this.index); // a Gigant Pistol cut off mid-punch (kit.js laneStrike)
    }
    if (STUN_STATES.has(this.state) && !STUN_STATES.has(s)) this.freeAt = this.clock;
    // the push-off pose belongs to the wall jump's first airborne frames only (wallKick sets it after this): any other
    // state, or 'air' again after an air attack, never replays it
    this.wallJumpPose = 0;
    this.reversal = false; // update() sets it again when the new state is a reversal
    if (s === 'jumpSquat') this.shortHop = false; // (tryActions sets it again for Jump + attack)
    this.clashOut = null; // whatever ended the clashed swing (a hit, a burst) also cancels its bounce
    this.state = s;
    this.t = 0;
    if (anim) this.actor.play(anim, true);
  }

  // 2.5D lanes: fighters face screen-left or screen-right, never into the camera,
  // so strikes always travel across the screen the way the sprite is drawn.
  faceOpponent() {
    const o = this.opp, R = this.game.basis.right;
    const sx = (o.pos.x - this.pos.x) * R.x + (o.pos.z - this.pos.z) * R.z;
    if (Math.abs(sx) > 0.12) this.side = Math.sign(sx);
    this.setSide(this.side);
  }

  setSide(side) {
    const R = this.game.basis.right;
    this.side = side;
    this.face.set(R.x * side, R.z * side);
  }

  // Signed offsets to the opponent: along the screen (sx) and in depth (sd).
  laneOffsets() {
    const o = this.opp, R = this.game.basis.right, F = this.game.basis.fwd;
    const rx = o.pos.x - this.pos.x, rz = o.pos.z - this.pos.z;
    return { sx: rx * R.x + rz * R.z, sd: rx * F.x + rz * F.z };
  }

  distTo(o = this.opp) {
    return dmath.hypot(o.pos.x - this.pos.x, o.pos.z - this.pos.z);
  }

  // Hold back to block (ENG-057): the stick held away from the opponent on screen. Only a person's pad gets it (the
  // match setup's kind, Game.kinds, and no brain here; a lab script or replay sets `autoBlock`): a CPU blocks at its
  // level's own rate.
  holdingBack() {
    const b = this.game.brains[this.index];
    if ((this.game.kinds?.[this.index] === 'cpu' || b) && !b?.autoBlock) return false;
    return this.pad.mx * kit.towardSide(this) < -0.5;
  }

  // Something of theirs could hit us soon, so holding back raises the guard instead of running away: an attack or
  // kit move close by, a beam charging or out, a shot or orb near, or the next hit of a string we just blocked.
  underPressure() {
    const o = this.opp, g = this.game;
    if (this.clock - (this.blockAt ?? -99) < 14) return true;
    if (o.state === 'beamCharge' || g.beams.some((bm) => bm.owner === o && !bm.dead)) return true;
    if (['attack', 'kit', 'superDash', 'vanish'].includes(o.state) && this.distTo() < 4.5) return true;
    const near = (p, r) => dmath.hypot(p.x - this.pos.x, p.z - this.pos.z) < r;
    return g.projectiles.some((pr) => pr.owner === o && !pr.dead && near(pr.pos, 4.5)) || g.orbs.some((ob) => ob.owner === o && !ob.dead && near(ob.pos, 5.5));
  }

  autoGuard() {
    return this.holdingBack() && this.underPressure();
  }

  inputDir() {
    return this.game.camDir(this.pad.mx, this.pad.my);
  }

  // ---- directional normals and Smash air (ADR 0042, numbers in NORMALS / AIR)
  // The CPU brains don't play the directional normals yet (phase 2 of ADR 0042): their Light / Heavy read as a neutral
  // stick and their jump taps as full hops, so they keep the moves they were built around. A person's pad, a lab script
  // or replay, or a brain that sets `aimsNormals` aims them. Like holdingBack, a CPU slot without its brain (a replay of
  // a CPU match) reads the same way, so a recorded match plays back identically.
  aimsNormals() {
    const b = this.game.brains[this.index];
    if (b) return !!(b.aimsNormals || b.autoBlock);
    return this.game.kinds?.[this.index] !== 'cpu';
  }

  // The opponent is reeling in the air close by: the DBFZ juggle (air attacks float level with them and keep turning to
  // them, the air string rides along), so the anime air combos stay. Anywhere else the air is Smash's.
  juggling() {
    const o = this.opp;
    return o.air && !o.ko && (o.state === 'launched' || o.state === 'held') && this.distTo() < AIR.juggle;
  }

  // The normal the stick picks for `btn` ('light' | 'heavy'): the stick now, or the one held at the press when it is
  // neutral by now (a quick tap of direction and button). Vertical wins when the stick is mostly up or down, as for specials.
  normalFor(btn, aim = null) {
    let x = 0, y = 0;
    if (aim) [x, y] = aim; // the C-stick's way, whatever the left stick does
    else if (this.aimsNormals()) {
      x = this.pad.mx; y = this.pad.my;
      if (Math.abs(x) < 0.5 && Math.abs(y) < 0.6) { x = this.atkMx; y = this.atkMy; }
    }
    const dir = Math.abs(y) > 0.6 && Math.abs(y) > Math.abs(x) ? (y > 0 ? 'up' : 'down')
      : Math.abs(x) > 0.5 ? (this.air && x * this.side < 0 ? 'back' : 'forward') : 'neutral';
    return NORMALS[this.air ? 'air' : 'ground'][btn][dir];
  }

  startNormal(btn, aim = null) {
    const name = this.normalFor(btn, aim);
    this.startMove(name, MOVES[name]);
  }

  // The C-stick (ADR 0042, Smash's): the right stick flicked one way, a buffered press like a button's. The newest way
  // pressed within `win` frames, or null.
  cPress(win) {
    const p = this.pad;
    let best = null;
    for (const k of CSTICK) if (p.buffered(k, win) && (!best || p.b[k].lastPress > p.b[best].lastPress)) best = k;
    return best;
  }

  // On the ground a smash attack that way (never charged: Heavy isn't held), in the air the aerial that way; the left
  // stick keeps steering the jump, so a back air never turns the drift around.
  startC(k) {
    for (const c of CSTICK) this.pad.consume(c);
    this.startNormal(this.air ? 'light' : 'heavy', C_AIM[k]);
  }

  // Air control: the stick steers the jump (and a Smash aerial) up to the run speed.
  airDrift() {
    const d = this.inputDir(), sp = this.speedStat;
    this.vel.x += d.x * 0.45; this.vel.z += d.y * 0.45;
    const h = dmath.hypot(this.vel.x, this.vel.z);
    if (h > sp) { this.vel.x *= sp / h; this.vel.z *= sp / h; }
  }

  // Fast fall: a fresh ↓ at or past the top of the jump drops at once (once per fall). Not in the super jump's chase.
  tryFastFall() {
    const p = this.pad;
    if (this.fastFell || this.chase > 0 || this.vel.y > AIR.ffFrom || !this.aimsNormals()) return;
    if (p.my < -0.6 && p.dirPressed('d', 2)) {
      this.fastFell = true;
      this.vel.y = Math.min(this.vel.y, -AIR.fastFall);
      this.actor.ghost(this.def.color, 0.18, 0.4);
    }
  }

  doubleJump() {
    const d = this.inputDir(), sp = this.speedStat;
    this.jumped2 = true;
    this.fastFell = false;
    // the stick sets the new drift at once (Smash's double jump can turn the jump around); the facing holds
    this.vel.set(d.x * sp, AIR.doubleJump, d.y * sp);
    this.setState('air', 'jumpUp');
    this.actor.ghost(this.def.color, 0.22, 0.45);
    this.game.fx.ring(this.pos, '#ffffff', 0.45, this.pos.y + 0.1);
    audio.play('jump', 0.8);
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

  // intangible because of a spot dodge, an air dodge or a back dash's first frames (Game.onEvade calls out what
  // passes through: DODGE!, AIR DODGE!, BACKSTEP)
  get evading() {
    return (this.state === 'dodge' || this.state === 'airDodge' || (this.state === 'dash' && this.backDash)) && this.invuln > 0 && !this.ko;
  }

  // holding a smash attack's charge (ADR 0042): the sprite glows and trembles (sync)
  get smashCharging() {
    return this.state === 'attack' && !!this.move?.charge && this.chargeT > 0 && !this.chargeDone;
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
    this.clashOut = null;
    this.t = 0;
    this.hitDone = false;
    this.moveHit = false;
    this.chargeT = 0;
    this.chargeMul = 1;
    this.chargeDone = false;
    // Smash air (ADR 0042): an aerial out of a jump keeps the jump's facing (screen-aligned), so ← is a back air; one
    // started beside a reeling opponent is the DBFZ juggle and turns to them
    this.juggleMove = !!m.air && this.air && this.juggling();
    if (m.air && this.air && !this.juggleMove) this.setSide(this.side);
    else this.faceOpponent();
    // a back air without its own strip shows a forward strip mirrored, hit boxes and all (Fighter.sync, Game.checkMelee)
    this.mirrorPose = !!m.back && !this.hasStrip(m.anim);
    if (m.air || m.hover) this.airAttack = true;
    if (m.special) {
      audio.loop('sp' + this.index, m.sfxLoop);
      this.game.onSpecialStart(this, m);
    }
    // the base strip or its alt (ADR 0031): same frames and phases, so updateAttack's phase clock plays either
    this.moveAnim = this.pickAnim(m.anim);
    this.moveAnimOf = m;
    this.actor.setPhase(this.moveAnim, 0, 0);
  }

  // The strip one use of an attack or hit reaction shows: the base, or its alt when this sheet has one (animAlts.js).
  pickAnim(base) {
    return pickAnim(base, this.animUses, this.hasStrip);
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
      const R = this.game.basis.right;
      const along = d.x * R.x + d.y * R.z;
      if (Math.abs(along) > 0.3) this.side = Math.sign(along);
    }
    this.setState('dash', this.backDash ? 'backDash' : 'dash');
    this.invuln = 8;
    this.dodgeCalled = false; // a back dash that something passes through gets its BACKSTEP callout
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
    if (this.pos.y < 0.05) this.game.fx.ground.scuff(this.pos, this.face);
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
    this.setState('dodge', (this.def.dodgePose?.[0]) ?? S.pose);
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
    this.game.fx.ground.scuff(this.pos, this.vel);
    audio.play('dash', 0.45);
    this.game.tag(this, 'wavedash');
  }

  // ---- combo escape (ADR 0022, numbers in DEFENSE.tech / DEFENSE.burst)
  // Launched and able to tech this frame: air stun over, high enough, not held. Every such frame the attacker
  // doesn't take away again is a gap (the combo turns blue).
  techOpen() {
    return !this.ko && !this.heldT && this.airStun <= 0 && this.pos.y > DEFENSE.tech.minY;
  }

  // The combo is over for the victim (a tech, a tech roll, a burst).
  endCombo() {
    this.combo = 0;
    this.comboBlue = false;
    this.gapF = 0;
    this.gb = this.wb = false;
    this.gbCount = this.wbCount = 0;
    this.forceTech = false;
  }

  // Burst input: Guard + Special both held, the later press within `buffer` frames, and Special itself a fresh
  // press: after the combo began and under `chord` frames ago (like the vanish chord). A ki charge that got hit
  // still holds Special, so pressing Guard to tech must not spend the burst; a vanish pressed just before the hit
  // doesn't turn into one either.
  wantsBurst() {
    const p = this.pad, b = p.b, B = DEFENSE.burst, sp = b.special.lastPress;
    if (!b.guard.down || !b.special.down || sp < this.comboFrom || p.frame - sp >= B.chord) return false;
    return p.frame - Math.max(sp, b.guard.lastPress) <= B.buffer;
  }

  // Burst is possible: in hit stun or a launch, the bar and ki for it, not held or grabbed (Domain, flurries,
  // mauls, throws) and not inside the opponent's three-bar move or beam.
  canBurst() {
    const B = DEFENSE.burst, o = this.opp, g = this.game;
    if (this.state !== 'hitstun' && this.state !== 'launched') return false;
    if (this.ko || this.heldT > 0 || this.grab || this.burstUsed >= B.perRound || this.ki < B.cost) return false;
    if (!g.inputLive || g.clash || g.domain) return false;
    if (o.state === 'beamCharge' || o.state === 'beamFire' || (o.state === 'kit' && (o.kitState?.m?.cost ?? 0) >= 300)) return false;
    return !g.beams.some((bm) => bm.owner === o && !bm.dead);
  }

  startBurst() {
    const B = DEFENSE.burst;
    this.ki -= B.cost;
    this.burstUsed++;
    this.spPending = false;
    this.endMoveFx();
    this.endCombo();
    this.hitstop = 0;
    this.shaking = false;
    this.airStun = this.stun = 0;
    this.vel.set(0, 0, 0);
    this.carry.set(0, 0);
    this.invuln = B.startup + B.active + 2;
    this.burstHit = null;
    this.burstEnd = B.startup + B.active + B.whiff;
    this.setState('burst', 'charge');
    this.faceOpponent();
    this.game.onBurst(this);
  }

  // The shockwave's active frames: one hit on an attacker inside the radius. It is blockable and parryable, so
  // an attacker who stopped and guarded makes it whiff into the long recovery (burst bait).
  burstWave(k) {
    const B = DEFENSE.burst, o = this.opp;
    this.game.onBurstWave(this, k);
    if (this.burstHit) return;
    const dx = o.pos.x - this.pos.x, dz = o.pos.z - this.pos.z, d = dmath.hypot(dx, dz);
    if (d > B.radius || Math.abs(o.pos.y - this.pos.y) > B.radius) return;
    if (!o.hittable) {
      if (o.evading) this.game.onEvade(o);
      return;
    }
    const dir = d > 0.01 ? new THREE.Vector2(dx / d, dz / d) : new THREE.Vector2(this.face.x, this.face.y);
    this.burstHit = o.takeHit(this, B.hit, dir) === 'hit' ? 'hit' : 'block';
  }

  // Landing from a launch while holding Guard: roll back to the feet (the stick's direction, else away from them).
  startTechRoll() {
    const T = DEFENSE.tech.roll;
    const d = this.inputDir();
    if (d.lengthSq() > 0.04) d.normalize();
    else d.set(this.pos.x - this.opp.pos.x, this.pos.z - this.opp.pos.z).normalize();
    this.endCombo();
    this.airStun = 0;
    this.bounced = false;
    this.bigLaunch = false;
    this.vel.set(d.x * T.speed, 0, d.y * T.speed);
    this.invuln = T.invuln;
    this.techArt = this.actor.hasAnim(TECH_ART.roll);
    this.setState('techRoll', this.techArt ? null : 'airRecover');
    this.faceOpponent();
    this.lockRollPose();
    if (this.techArt) this.showTech('roll', T.animPhases);
    this.game.fx.dust(this.pos, 0.8);
    audio.play('dash', 0.6);
    this.game.tag(this, 'techRoll');
  }

  // ---- timed impact tech (ADR 0028, numbers in DEFENSE.impactTech)
  // A fresh Guard press while reeling is an attempt. Read from the pad's press stamp, so a press during hitstop or a
  // world freeze (the fighter doesn't update in one) still counts, as made on the next live frame. A press inside the
  // lockout of the last attempt is ignored: mashing fails.
  readTechPress(p) {
    const lp = p.b.guard.lastPress;
    if (lp === this.itSeen) return;
    this.itSeen = lp;
    if (lp < 0 || lp < this.comboFrom || (this.state !== 'hitstun' && this.state !== 'launched')) return;
    const at = this.liveF + 1;
    if (at - this.itTry < DEFENSE.impactTech.lockout) return;
    this.itTry = at;
  }

  // The impact itself could be teched: not KO'd, held or grabbed, and the last hit wasn't a super finish.
  impactTechable() {
    return !this.ko && !this.noTech && !this.heldT && !this.grab && this.game.inputLive;
  }

  // A missed attempt still locks the timed tech out (the combo composer's tech risk reads it).
  impactTechLocked() {
    const d = this.liveF - this.itTry, I = DEFENSE.impactTech;
    return d > I.window && d < I.lockout;
  }

  // At an impact (the first floor contact of a fall, a wall bounce): teched when the last attempt is at most `window`
  // live frames old. `kind`: 'ground' | 'wall' (axis / sign: the barrier it hit).
  tryImpactTech(kind, axis = null, sign = 0) {
    if (!this.impactTechable()) return false;
    this.techStats.faced++;
    const d = this.liveF - this.itTry;
    if (d < 0 || d > DEFENSE.impactTech.window) return false;
    this.startImpactTech(kind, axis, sign);
    return true;
  }

  // The impact is beaten: the combo ends there, the bounce (and its budget) never happens. On the floor the stick picks
  // tech in place (neutral) or a roll (left / right); on the barrier the fighter clings, then kicks off (update).
  startImpactTech(kind, axis, sign) {
    const I = DEFENSE.impactTech;
    this.itTry = -999; // a success re-arms at once
    this.endCombo();
    this.airStun = this.stun = 0;
    this.bounced = this.bigLaunch = this.hardKD = false;
    this.techStats.teched++;
    this.techedAt = this.clock;
    this.techAxis = axis;
    this.techSign = sign;
    this.carry.set(0, 0);
    // the dedicated strip (ADR 0030) when this fighter's sheet has it, else the poses the tech always showed
    if (kind === 'wall') {
      this.techKind = 'wall';
      this.vel.set(0, 0, 0);
      this.invuln = I.wall.invuln;
      this.techArt = this.actor.hasAnim(TECH_ART.wall);
      this.setState('impactTech', this.techArt ? null : 'land');
    } else if (Math.abs(this.pad.mx) > 0.5) {
      const d = this.inputDir().normalize();
      this.techKind = 'roll';
      this.vel.set(d.x * I.roll.speed, 0, d.y * I.roll.speed);
      this.invuln = I.roll.invuln;
      this.techArt = this.actor.hasAnim(TECH_ART.roll);
      this.setState('impactTech', this.techArt ? null : 'airRecover');
    } else {
      this.techKind = 'inPlace';
      this.vel.set(0, 0, 0);
      this.invuln = I.inPlace.invuln;
      this.techArt = this.actor.hasAnim(TECH_ART.inPlace);
      this.setState('impactTech', this.techArt ? null : 'land');
    }
    this.faceOpponent();
    this.lockRollPose();
    if (this.techArt) this.showImpactTech();
    startHitFlash(this, 'tech', 0);
    this.game.onImpactTech(this, kind, axis, sign);
  }

  // The wall tech's kick off the barrier: away from it, or a wall jump (↑ or Jump held) that is free in the air at once.
  wallKick(p) {
    const I = DEFENSE.impactTech, jump = p.my > 0.6 || p.b.jump.down;
    const W = jump ? I.wallJump : I.wall;
    this.vel.set(0, W.up, 0);
    this.vel[this.techAxis] = -this.techSign * W.along;
    this.air = true;
    this.actor.ghost(this.def.color, 0.25, 0.5);
    this.game.fx.dust(this.pos, 0.5);
    audio.play('jump', 0.7);
    if (jump) {
      this.invuln = Math.max(0, I.wallJump.invuln - I.wall.stick); // (the cling's frames counted)
      this.techKind = null;
      this.airAttack = false;
      this.airDodged = false;
      // with the wall strip, its push-off pose shows for wallJump.animFrames frames (this one and the next airborne
      // ones) before jumpUp; the jump is free at once
      const art = this.techArt;
      this.setState('air', art ? null : 'jumpUp');
      if (art) {
        this.wallJumpPose = I.wallJump.animFrames - 1;
        this.actor.setPhase(TECH_ART.wall, 1, 0);
      }
    } else {
      this.techKind = 'wallKick';
      if (!this.techArt) this.actor.play('airRecover', true);
    }
  }

  // ---- tech poses (ADR 0030, src/game/techAnim.js): the dedicated strip on the tech state's own clock when the
  // sheet has it (techArt), else the legacy pose free-running exactly as before. Never changes timing or movement.
  showTech(kind, beats) {
    const P = techPose(kind, this.t, beats, this.techArt, kind === 'roll' && this.rollBack, TECH_POSE);
    if (P.free) {
      this.actor.play(P.name);
      this.actor.update(FRAME_MS);
    } else this.actor.setPhase(P.name, P.phase, P.p, P.reverse);
  }

  // At a tech's start (after faceOpponent): a roll's direction against the facing (a back roll plays its tumble
  // backward) and the facing its strip keeps on screen, both fixed for the whole roll (techAnim.rollBackward).
  lockRollPose() {
    this.rollFx = this.face.x;
    this.rollFz = this.face.y;
    this.rollBack = rollBackward(this.vel.x, this.vel.z, this.face.x, this.face.y);
  }

  showImpactTech() {
    const I = DEFENSE.impactTech, k = this.techKind;
    if (k === 'roll') this.showTech('roll', I.roll.animPhases);
    else if (k === 'wall' || k === 'wallKick') this.showTech('wall', I.wall.animPhases);
    else this.showTech('inPlace', I.inPlace.animPhases);
  }

  // The wall strip is on screen (the cling, the kick, or the push-off over a wall jump, to its last frame): Fighter.sync
  // turns it away from the wall it is drawn against and puts its wall line on the barrier, or re-centres it on a wall
  // seen in depth (techAnim.wallFacing / wallShift).
  wallPoseShown() {
    if (!this.techArt || this.techAxis == null || (this.state !== 'impactTech' && this.state !== 'air')) return false;
    return this.actor.animName === TECH_ART.wall;
  }

  // The roll strip is on screen (either tech roll): Fighter.sync keeps the facing it started with (lockRollPose).
  rollPoseShown() {
    return this.techArt && (this.state === 'techRoll' || this.state === 'impactTech') && this.actor.animName === TECH_ART.roll;
  }

  // Stuck in their own recovery (a whiffed or blocked move, a parry stagger, the end of a dodge, landing lag, a
  // burst that missed): a fresh combo started here is a PUNISH.
  inRecovery() {
    const m = this.move;
    switch (this.state) {
      case 'attack': return !!m && this.t >= m.startup + m.active;
      case 'held': return !this.grab && this.clock - this.parriedAt < 40;
      case 'dodge': case 'airDodge': return this.invuln <= 0;
      case 'land': return this.landLag > 6;
      case 'throw': return this.throwSt?.phase === 'whiff' || this.throwSt?.phase === 'broken';
      case 'kit': return ['whiff', 'land', 'recover'].includes(this.kitState?.phase);
      case 'burst': return this.t >= DEFENSE.burst.startup + DEFENSE.burst.active;
      case 'beamFire': return true;
      default: return false;
    }
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
    startHitFlash(this, 'parry', P.freeze);
    this.setState('guard');
    if (!m.projectileHit && att !== this && !att.ko) {
      att.endMoveFx();
      att.move = null;
      att.vel.set(0, Math.min(0, att.vel.y), 0);
      att.carry.set(0, 0);
      att.heldT = m.big || m.special ? P.bigStagger : P.stagger;
      att.setState('held', 'stagger');
      att.parriedAt = att.clock; // hitting them in this stagger is a PUNISH (inRecovery)
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
    if (this.pos.y < 0.05) this.game.fx.ground.impact(this.pos, { kind: 'chase' }); // the super jump cracks the floor
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
    // Jump with Light or Heavy (Ultimate's shortcut, ADR 0042): a short hop, and the button stays buffered so the aerial
    // comes out as it leaves the floor
    const C = AIR.chord;
    if (this.aimsNormals() && p.buffered('jump', C) && (p.buffered('light', C) || p.buffered('heavy', C)) && !b.special.down) {
      p.consume('jump');
      this.setState('jumpSquat');
      this.shortHop = true;
      return true;
    }
    const c = this.cPress(6);
    if (c) { this.startC(c); return true; }
    if (p.buffered('heavy', 6) && !b.special.down) {
      p.consume('heavy');
      this.startNormal('heavy');
      return true;
    }
    if (p.buffered('light', 6)) {
      p.consume('light');
      this.startNormal('light');
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
    // one air string per jump in a juggle (DBFZ: airAttack holds until landing, a super dash or a tech); Smash aerials in
    // the open clear it as they end, so a jump can carry several (ADR 0042)
    if (this.airAttack) {
      if ((b.dash.pressed || p.dashDir) && this.startSuperDash()) return true;
      if (b.jump.pressed && !this.jumped2 && this.chase <= 0) { this.doubleJump(); return true; }
      return false;
    }
    const c = this.cPress(5);
    if (c) { this.startC(c); return true; }
    if (p.buffered('heavy', 5)) { p.consume('heavy'); this.startNormal('heavy'); return true; }
    if (p.buffered('light', 5)) { p.consume('light'); this.startNormal('light'); return true; }
    if (b.special.pressed) { this.spPending = false; return this.doProjectile(); }
    if ((b.dash.pressed || p.dashDir) && this.startSuperDash()) return true;
    if (b.jump.pressed && !this.jumped2 && this.chase <= 0) { this.doubleJump(); return true; }
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
    if (p.b.light.pressed || p.b.heavy.pressed) { this.atkMx = p.mx; this.atkMy = p.my; } // normalFor's fallback stick
    // every Guard press is a parry attempt unless another press came less than `lockout` frames ago
    // (read even during hitstop, so a press in block stun can parry the next hit of a string)
    if (p.b.guard.pressed) {
      if (p.frame - this.parryTry >= DEFENSE.parry.lockout) this.parryAt = p.frame;
      this.parryTry = p.frame;
    }
    // Burst (ADR 0022): read before the hitstop return, so a press on the hit itself is answered at once
    if ((this.state === 'hitstun' || this.state === 'launched') && this.wantsBurst() && this.canBurst()) this.startBurst();
    if (this.game.inputLive) this.readTechPress(p); // timed impact tech (ADR 0028): a press in hitstop counts too
    const s0 = this.state;

    if (this.hitstop > 0) {
      this.hitstop--;
      if (this.hitstop === 0) {
        this.shaking = false;
        if (this.clashOut) this.leaveClash();
      }
      this.pad = real;
      return;
    }
    this.t++;
    this.liveF++;
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
          const c = this.cPress(6);
          if (c) { this.startC(c); break; }
          if (p.buffered('heavy', 6)) { p.consume('heavy'); this.startMove('heavy', MOVES.heavy); break; }
          if (p.buffered('light', 6)) {
            p.consume('light');
            // the stick still held through a forward dash: the dash attack (ADR 0042); let go, the lunging jab
            const aim = this.aimsNormals() && dmath.hypot(p.mx, p.my) > 0.5;
            if (aim && !this.backDash) this.startMove('dashAttack', MOVES.dashAttack);
            else this.startMove('light1', { ...MOVES.light1, lunge: 9 });
            break;
          }
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
        else if (S.poseFrame != null && this.actor.anim?.frames?.length) this.actor.setFrame(this.actor.anim.frames[Math.min(this.def.dodgePose?.[1] ?? S.poseFrame, this.actor.anim.frames.length - 1)]);
        else freeAnim();
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
        if (this.t % 3 === 0 && dmath.hypot(this.vel.x, this.vel.z) > 2) this.game.fx.dust(this.pos, 0.4);
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
          const o = this.opp, R = this.game.basis.right;
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
          // Smash hops (ADR 0042): Jump let go before the squat ends (or pressed with an attack) is a short hop
          const short = this.shortHop || (this.aimsNormals() && !p.b.jump.down);
          this.vel.set(d.x * sp, short ? AIR.shortHop : AIR.fullHop, d.y * sp);
          this.air = true;
          this.airAttack = false;
          this.fastFell = false;
          this.setSide(this.side); // the facing the jump keeps (screen-aligned: a run in depth turned the body)
          this.setState('air', 'jumpUp');
          audio.play('jump');
          this.game.fx.dust(this.pos, 0.7);
          // Jump + attack: the aerial out on the first airborne frame (its press can be `chord` frames older than the squat)
          const c = this.cPress(6); // the C-stick flicked during the squat: that aerial as it leaves the floor
          if (c) this.startC(c);
          else if (this.shortHop) {
            const btn = p.buffered('heavy', AIR.chord + 6) ? 'heavy' : p.buffered('light', AIR.chord + 6) ? 'light' : null;
            if (btn) { p.consume(btn); this.startNormal(btn); }
          }
          this.shortHop = false;
        } else if (this.t <= AIR.chord && this.aimsNormals() && (p.b.light.pressed || p.b.heavy.pressed)) this.shortHop = true; // attack right after Jump
        freeAnim();
        break;
      case 'air': {
        // a wall jump's first frames keep the wall tech's push-off pose (ADR 0030); the jump is actionable throughout
        const kick = this.wallJumpPose > 0;
        if (kick) {
          this.wallJumpPose--;
          this.actor.setPhase(TECH_ART.wall, 1, 1 - this.wallJumpPose / (DEFENSE.impactTech.wallJump.animFrames - 1));
        } else this.actor.play(this.vel.y > 1.5 ? 'jumpUp' : 'jumpFall');
        if (this.chase <= 0) this.airDrift();
        else if (this.chase % 2 === 0) this.actor.ghost(this.def.color, 0.2, 0.45);
        // Smash air keeps the jump's facing (back airs, cross-ups); the launcher's chase and a juggle turn to them (ADR 0042)
        if (this.chase > 0 || this.juggling()) this.faceOpponent();
        else this.setSide(this.side);
        this.tryFastFall();
        if (this.tryAirActions()) break;
        if (!kick) freeAnim();
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
      case 'launched': {
        // any button, or Guard simply held, techs on the first open frame (ADR 0022); an open frame let pass is a gap
        const open = this.techOpen();
        if (open) this.gapF++;
        if (!this.ko && !this.heldT && this.forceTech && this.t > 4 && this.pos.y > 0.2) { this.forceTech = false; this.airRecover(); break; }
        if (open && (this.anyPress() || p.b.guard.down)) {
          this.airRecover();
          break;
        }
        this.actor.play(this.bigLaunch && !this.ko ? 'spin' : 'launched');
        freeAnim();
        break;
      }
      case 'airRecover':
        this.invuln = Math.max(this.invuln, 2);
        if (this.t >= DEFENSE.tech.len) { this.airAttack = false; this.setState('air', 'jumpFall'); }
        freeAnim();
        break;
      case 'techRoll': {
        const T = DEFENSE.tech.roll;
        this.vel.x *= T.friction; this.vel.z *= T.friction;
        this.faceOpponent();
        if (this.t % 3 === 0) this.actor.ghost(this.def.color, 0.2, 0.45);
        if (this.t >= T.len) { this.setState('idle'); freeAnim(); break; }
        this.showTech('roll', T.animPhases);
        break;
      }
      case 'impactTech': {
        // timed impact tech (ADR 0028): in place / roll on the floor, or the cling and kick off the barrier
        const I = DEFENSE.impactTech;
        switch (this.techKind) {
          case 'roll':
            this.vel.x *= I.roll.friction; this.vel.z *= I.roll.friction;
            if (this.t % 3 === 0) this.actor.ghost(this.def.color, 0.2, 0.45);
            if (this.t >= I.roll.len) this.setState('idle');
            break;
          case 'wall':
            this.vel.set(0, 0, 0);
            if (this.t >= I.wall.stick) this.wallKick(p);
            break;
          case 'wallKick':
            if (this.t >= I.wall.stick + I.wall.len) { this.airAttack = false; this.setState('air', 'jumpFall'); }
            break;
          default:
            this.vel.x *= 0.6; this.vel.z *= 0.6;
            if (this.t >= I.inPlace.len) this.setState('idle');
        }
        if (this.state === 'impactTech') this.showImpactTech();
        else if (!this.wallPoseShown()) freeAnim(); // (a wall jump's push-off frame is set, not free-running)
        break;
      }
      case 'burst': {
        const B = DEFENSE.burst, E = B.startup + B.active;
        this.vel.x *= 0.7; this.vel.z *= 0.7;
        if (this.t >= B.startup && this.t < E) this.burstWave(this.t - B.startup);
        if (this.t === E) {
          // a blocked or parried shockwave leaves the long recovery: the punish for burst bait
          this.burstEnd = E + (this.burstHit === 'block' ? B.blocked : B.whiff);
          this.actor.play(this.air ? 'jumpFall' : 'land', true);
        }
        if (this.t >= this.burstEnd) {
          this.airAttack = false;
          if (this.air) this.setState('air', 'jumpFall');
          else this.setState('idle');
        }
        freeAnim();
        break;
      }
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
        if (this.t === 1) audio.play('powerUp');
        if (Math.floor(before / KI_BAR) < Math.floor(this.ki / KI_BAR)) this.game.onChargeBar(this);
        audio.loop('charge' + this.index, 'charge', chargeStyle(this).sound);
        audio.tune('charge' + this.index, Math.min(1, this.t / 45)); // the hum climbs as the aura builds
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
      case 'clashBack': {
        // pushed back out of a melee clash (ADR 0038): free after `act` frames, and a Light / Heavy pressed during the freeze
        // comes out then, so pressing again meets the next swing
        this.vel.x *= 0.82; this.vel.z *= 0.82;
        this.actor.setPhase(this.clashAnim, 2, Math.min(0.999, this.t / this.clashSlide));
        if (this.clashSlide > MELEE_CLASH.slide && !this.air && this.t % 3 === 0) this.game.fx.dust(this.pos, 0.6); // CLASH BREAK skid
        if (this.t < this.clashAct) break; // the pushback shows before the next swing pulls them back in
        const w = this.clashBuf + this.t;
        const heavy = p.buffered('heavy', w), light = !heavy && p.buffered('light', w);
        if ((heavy || light) && !p.b.special.down) {
          p.consume(heavy ? 'heavy' : 'light');
          this.startNormal(heavy ? 'heavy' : 'light');
          break;
        }
        if (this.air ? this.tryAirActions() : this.tryActions()) break;
        if (this.t >= this.clashSlide) {
          if (this.air) this.setState('air', 'jumpFall');
          else this.setState('idle');
        }
        break;
      }
      default:
        this.vel.x *= 0.8; this.vel.z *= 0.8;
        freeAnim();
    }

    if (this.state !== s0 && REVERSAL_STATES.has(this.state) && this.clock - this.freeAt <= DEFENSE.reversal.window) this.reversal = true;
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
      const R = this.game.basis.right;
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
    const c = this.t >= 6 && this.cPress(6);
    if (c) {
      this.vel.multiplyScalar(0.25);
      this.startC(c);
      return;
    }
    if (this.t >= 6 && (p.buffered('light', 6) || p.buffered('heavy', 6))) {
      const heavy = p.buffered('heavy', 6);
      p.consume('light'); p.consume('heavy');
      this.vel.multiplyScalar(0.25);
      this.startNormal(heavy ? 'heavy' : 'light');
      return;
    }
    if (dist < 1.0) {
      if (o.hittable) {
        const dir = new THREE.Vector2(o.pos.x - this.pos.x, o.pos.z - this.pos.z).normalize();
        o.takeHit(this, { ...S, name: 'superDash' }, dir);
        this.moveHit = true;
      } else if (o.evading) this.game.onEvade(o); // flew through their dodge
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

  // A melee clash (Game.meleeClash, ADR 0038): this swing is spent and holds for `stop` frames where it met the
  // other, then is pushed back away from them at `speed`, free to act after `act` frames (leaveClash)
  clashBounce(stop, speed, act = MELEE_CLASH.act, slide = MELEE_CLASH.slide) {
    const o = this.opp, dx = this.pos.x - o.pos.x, dz = this.pos.z - o.pos.z, d = dmath.hypot(dx, dz) || 1;
    this.hitDone = true;
    this.moveHit = false;
    this.vel.set(0, Math.min(this.vel.y, 0), 0);
    this.hitstop = stop;
    this.shaking = true;
    this.clashOut = { x: (dx / d) * speed, z: (dz / d) * speed, buf: stop + MELEE_CLASH.buffer, act, slide };
  }

  leaveClash() {
    const c = this.clashOut;
    if (this.state !== 'attack') { this.clashOut = null; return; }
    // the slide back plays the clashed move's own recovery (the strike pulls back), not a hop
    this.clashAnim = this.moveAnimOf === this.move ? this.moveAnim : this.move.anim;
    this.move = null;
    this.airAttack = false; // a clashed air swing doesn't use up the jump's attack
    this.setState('clashBack', null);
    this.clashBuf = c.buf;
    this.clashAct = c.act;
    this.clashSlide = c.slide;
    this.vel.x = c.x;
    this.vel.z = c.z;
    if (this.air) this.vel.y = Math.max(this.vel.y, 3);
    this.faceOpponent();
  }

  updateAttack() {
    const p = this.pad, m = this.move, t = this.t;
    if (t <= 2 && !this.moveHit && !this.air && ((m.btn === 'light' && p.b.heavy.pressed) || (m.btn === 'heavy' && p.b.light.pressed))) {
      // Light and Heavy a frame or two apart still read as a throw
      p.consume('light'); p.consume('heavy');
      this.startThrow();
      return;
    }
    // a smash attack held (ADR 0042): Heavy still down on the charge frame holds the swing there for up to `max` frames,
    // for up to `mul` × the damage (Fighter.takeHit); the hold is all startup, so it can be hit out of
    const G = m.charge;
    if (G && t === G.at && !this.chargeDone) {
      if (p.b.heavy.down && this.chargeT < G.max) {
        if (this.chargeT === 0) audio.play('powerUp', 0.45);
        this.chargeT++;
        this.t--; // the clock stays on the charge frame (update() steps it again)
        this.vel.x *= 0.7; this.vel.z *= 0.7;
        if (this.chargeT % 6 === 0) this.actor.ghost(this.def.color, 0.16, 0.4);
        this.actor.setPhase(this.moveAnimOf === m ? this.moveAnim : m.anim, 0, t / m.startup);
        return;
      }
      this.chargeDone = true;
      this.chargeMul = 1 + ((G.mul - 1) * this.chargeT) / G.max;
    }
    const A = m.startup, B = m.startup + m.active, C = B + m.recovery;
    const phase = t < A ? 0 : t < B ? 1 : 2;
    const prog = phase === 0 ? t / A : phase === 1 ? (t - A) / m.active : (t - B) / m.recovery;
    // a move set without startMove (a beam clash resuming a rush, Game) has no pick: it plays its base strip
    this.actor.setPhase(this.moveAnimOf === m ? this.moveAnim : m.anim, phase, Math.min(0.999, prog));

    if (t === Math.max(1, A - 2) && m.sfx) audio.play(m.sfx);
    const smashAir = m.air && this.air && !this.juggleMove; // a Smash aerial: it keeps the jump's facing (ADR 0042)
    if (t < A - 1 && !smashAir) this.faceOpponent();
    // auto-step into the opponent's depth lane while the attack comes out
    if (t < B && !m.projectile) {
      const { sd } = this.laneOffsets();
      if (Math.abs(sd) < 2.6) {
        const F = this.game.basis.fwd;
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
    } else if (smashAir) {
      // Smash air (ADR 0042): the aerial falls with the jump, the stick steers it and ↓ fast-falls; no float, no ride-along
      this.airDrift();
      this.tryFastFall();
    } else if ((m.air || m.hover) && this.moveHit && this.opp.state === 'launched' && !this.opp.ko) {
      // DBFZ air juggle: after connecting, ride along with the victim's pop and push, and close in to
      // the closest spacing (separate() keeps 0.72) so the next chained hit is still in range: a launched
      // pose leans back, so its hurtbox starts behind the victim's feet
      const o = this.opp;
      this.vel.set(o.vel.x, o.vel.y, o.vel.z);
      this.pos.y += (o.pos.y - 0.1 - this.pos.y) * 0.25;
      const dx = o.pos.x - this.pos.x, dz = o.pos.z - this.pos.z, d = dmath.hypot(dx, dz);
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
      // the air string ends in the spike; the other aerials link (ADR 0042: only `chain` moves cancel into a normal)
      if (m.air && m.chain && p.buffered('heavy', 8)) { p.consume('heavy'); this.startMove('airHeavy', MOVES.airHeavy); return; }
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
      if (smashAir) this.airAttack = false; // Smash air: the jump can carry another aerial (a juggle string holds the lock)
      if (this.air) this.setState('air', 'jumpFall');
      else this.setState('idle');
    }
  }

  // Air tech (ADR 0022): the stick picks the hop, read against the opponent's side of the screen: neutral or away
  // hops back, toward hops over to their side, ↑ rises in place, ↓ drops straight to the floor.
  airRecover() {
    const T = DEFENSE.tech, s = kit.towardSide(this), R = this.game.basis.right;
    const x = this.pad.mx * s, y = this.pad.my;
    const kind = Math.abs(y) > 0.6 && Math.abs(y) > Math.abs(x) ? (y > 0 ? 'up' : 'down') : x > 0.5 ? 'toward' : 'back';
    const [along, up] = T[kind];
    this.endCombo();
    this.vel.set(R.x * s * along, up, R.z * s * along);
    this.invuln = T.invuln;
    this.techDir = kind;
    this.setState('airRecover');
    audio.play('jump', 0.7);
    this.game.fx.ring(this.pos, '#ffffff', 0.6, this.pos.y + 0.8);
    this.game.tag(this, 'tech');
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
      case 'clashBack': // an air clash's bounce lands softly: it was never a whiffed attack
        this.setState('land');
        this.landLag = 2;
        break;
      case 'impactTech':
        if (this.techKind === 'wallKick') { this.setState('land'); this.landLag = 4; } // (a cling never meets the floor)
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
          // each aerial has its own landing lag (ADR 0042); from its `autoCancel` frame on it lands like a plain jump
          this.landLag = m.autoCancel != null && this.t >= m.autoCancel ? 5 : m.landLag ?? AIR.landLag;
          this.setState('land');
          this.game.fx.dust(this.pos, 0.8);
        }
        break;
      }
      case 'launched': {
        const impact = -this.vel.y;
        // timed impact tech (ADR 0028): a fresh Guard press just before the first contact of the fall beats the ground
        // bounce, the hard knockdown and the plain landing alike
        if (!this.bounced && this.tryImpactTech('ground')) break;
        // a light pop (MOVES `feet`, ADR 0042) lands on the feet like Smash's low knockback: no knockdown, no floor bounce
        if (this.feetLand && !this.ko && !this.gb && !this.heldT) {
          this.vel.y = 0;
          this.vel.x *= 0.4; this.vel.z *= 0.4;
          this.combo = 0;
          this.bigLaunch = false;
          this.landLag = 4;
          this.setState('land');
          this.game.fx.dust(this.pos, 0.6);
          audio.play('land', 0.6);
          break;
        }
        // tech roll (ADR 0022): the floor is a way out unless the last hit was a hard knockdown; one not taken is a gap
        const roll = !this.ko && !this.gb && !this.hardKD && !this.heldT;
        if (roll && this.game.inputLive && this.pad.b.guard.down) { this.startTechRoll(); break; }
        if (roll) this.gapF++;
        if (this.gb && !this.ko) {
          // ground bounce: pop back up for more juggling
          const G = JUGGLE.ground;
          this.gb = false;
          this.vel.y = G.up;
          this.vel.x *= G.keep; this.vel.z *= G.keep;
          this.air = true;
          this.airStun = G.stun[Math.min(this.gbCount, G.stun.length - 1)]; // less each time (the bounce budget)
          this.gbCount++;
          this.bigLaunch = true;
          this.game.onGroundBounce(this, impact, this.gbCount);
        } else if (impact > JUGGLE.floor.impact && !this.bounced) {
          this.bounced = true;
          this.vel.y = impact * JUGGLE.floor.keep;
          this.vel.x *= JUGGLE.floor.slide; this.vel.z *= JUGGLE.floor.slide;
          this.air = true;
          audio.play('thud');
          this.game.fx.dust(this.pos, 1.3);
          this.game.fx.ground.land(this, impact); // harder falls crack deeper (and an airborne hit's crater lands here)
          this.game.cam.shake(0.25);
        } else {
          this.vel.y = 0;
          this.bigLaunch = false;
          this.setState('down', this.ko ? 'ko' : 'down');
          audio.play('land', 0.8);
          this.game.fx.dust(this.pos, 1.0);
          this.game.fx.ground.land(this, impact);
          this.game.fx.ground.slide(this, 0.85); // the 'down' slide's friction
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
      case 'burst':
        return this.t < DEFENSE.burst.startup + DEFENSE.burst.active ? 0 : 1; // hangs in the air until the wave is out
      case 'impactTech':
        return this.techKind === 'wall' ? 0 : 1; // clinging to the barrier
      case 'attack':
        return this.move?.hover ? 0 : this.move?.air && this.juggleMove ? 0.35 : 1; // a Smash aerial falls (ADR 0042)
      case 'launched':
        return this.ko ? 0.9 : Math.min(JUGGLE.gravity.max, JUGGLE.gravity.base + this.combo * JUGGLE.gravity.per);
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
      if (!this.air) this.airDodged = this.jumped2 = this.fastFell = false;
      if (!this.air) this.vel.y = Math.max(0, this.vel.y);
    } else this.air = true;
    // ring barrier (wall bounce for smash hits)
    for (const k of ['x', 'z']) {
      if (Math.abs(this.pos[k]) > ARENA_LIMIT) {
        const s = Math.sign(this.pos[k]);
        this.pos[k] = s * ARENA_LIMIT;
        const W = JUGGLE.wall;
        const bounce = this.state === 'launched' && this.wb && Math.abs(this.vel[k]) > W.minSpeed && !this.ko;
        if (bounce && this.tryImpactTech('wall', k, s)) {
          // WALL TECH (ADR 0028): it clings to the barrier instead of bouncing (and stops on the other axis below)
        } else if (bounce) {
          this.wb = false;
          this.vel[k] = -this.vel[k] * W.keep;
          this.vel.y = Math.max(this.vel.y, W.up);
          this.airStun = W.stun[Math.min(this.wbCount, W.stun.length - 1)];
          this.wbCount++;
          this.bigLaunch = true;
          this.game.onWallBounce(this, k, s, this.wbCount);
        } else if (this.state === 'launched' || this.state === 'down') this.vel[k] *= -0.25;
        else this.vel[k] = 0;
      }
    }
  }

  // Destructive finish: no ring barrier, drop off the ring onto the grass,
  // crash into the stands' walls.
  koPhysics() {
    if (this.state === 'down' && !this.air) this.slideOffEdge();
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
            this.game.fx.ground.slide(this, 0.9); // the KO slide's friction (below)
          }
        }
      }
      if (!this.air) { this.vel.y = 0; this.vel.x *= 0.9; this.vel.z *= 0.9; }
    } else this.air = true;
  }

  // A KO'd body never comes to rest across the ring edge (ADR 0020): on the ring within KO_EDGE of the edge, or on the
  // grass within the lip + KO_EDGE of it, it keeps sliding outward until it lies clear, and drops onto the grass on the way.
  slideOffEdge() {
    const lim = RING_HALF + RING_LIP + KO_EDGE;
    if (Math.abs(this.pos.x) >= lim || Math.abs(this.pos.z) >= lim) return;
    const onRing = Math.abs(this.pos.x) <= RING_HALF && Math.abs(this.pos.z) <= RING_HALF;
    for (const k of AXES) {
      const a = Math.abs(this.pos[k]);
      // off the ring only the axis it went over matters (beside the ring along the other axis is fine)
      if (a <= RING_HALF - KO_EDGE || (!onRing && a <= RING_HALF)) continue;
      const s = Math.sign(this.pos[k]) || 1;
      if (this.vel[k] * s < KO_SLIDE) this.vel[k] = s * KO_SLIDE;
    }
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
    const tl = dmath.hypot(tx, tz) || 1;
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
    // a super that grabs a victim out of a combo (flurry, Domain, maul: `held`, not a throw) carries the combo on (ADR 0026)
    const wasStunned = this.state === 'hitstun' || this.state === 'launched' || (this.state === 'held' && this.combo > 0 && !this.grab);
    // true combos (ADR 0022): a hit after open frames (they could have teched) turns the rest of the combo blue
    this.punishHit = !wasStunned && !m.burst && this.inRecovery();
    if (wasStunned) {
      this.lastGap = this.gapF;
      this.maxGap = Math.max(this.maxGap, this.gapF);
      if (this.gapF > 0) this.comboBlue = true;
    } else {
      this.lastGap = this.maxGap = 0;
      this.comboBlue = false;
      this.comboFrom = this.pad.frame;
    }
    this.gapF = 0;
    this.hardKD = !!(m.hardKnockdown ?? (m.groundBounce || (m.unblockable && m.big)));
    this.noTech = !!m.noTech; // a super finish's impact can't be timed-teched (ADR 0028)
    this.combo = wasStunned ? this.combo + 1 : 1;
    this.carry.set(0, 0);
    this.airDodged = this.jumped2 = this.fastFell = false; // getting hit gives the air dodge and the double jump back (for after the tech)
    this.feetLand = !!m.feet && !this.ko; // a light pop lands on the feet (ADR 0042); anything else tumbles
    this.dodgeDir = null;
    if (this.grab) { this.grab = null; this.heldT = 0; } // knocked out of a throw's grip
    if (!wasStunned) { this.gb = false; this.wb = false; this.bounced = false; this.gbCount = this.wbCount = 0; }
    const J = JUGGLE;
    const scale = Math.max(m.minScale ?? J.scale.floor, 1 - (this.combo - 1) * J.scale.per); // supers keep a higher floor
    const charged = m.charge && att.move === m ? att.chargeMul : 1; // a held smash attack (ADR 0042)
    const dmg = Math.max(1, Math.round((m.dmg * charged * scale * (att.def.stats.power || 1) * (att.mode?.damage ?? 1)) / ((this.def.stats.defense || 1) * (this.mode?.defense ?? 1))));
    this.hp = Math.max(0, this.hp - dmg);
    this.comboDmg = wasStunned ? this.comboDmg + dmg : dmg;
    att.ki = Math.min(MAX_KI, att.ki + 4 + dmg * 0.07);
    this.ki = Math.min(MAX_KI, this.ki + 2 + dmg * 0.04);
    this.flash = 1;
    startHitFlash(this, flashTier(this, m), hs);
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
    const decay = Math.max(J.decay.floor, 1 - (this.combo - 1) * J.decay.per);
    // the bounce budget (ADR 0026): a bounce hit arms one only while this combo has bounces left
    if (m.groundBounce && this.gbCount < J.ground.max) this.gb = true;
    if (m.wallBounce && this.wbCount < J.wall.max) this.wb = true;
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
      this.airStun = Math.round(Math.max(J.launchStun.min, J.launchStun.base - this.combo * J.launchStun.per) * decay);
      this.setState('launched', this.bigLaunch ? 'spin' : 'launched');
    } else if (inAir) {
      // juggle: keep them floating
      const pw = (m.push ?? 2) * 0.7;
      const pop = (m.airPop ?? 5.5) * Math.max(J.pop.floor, 1 - this.combo * J.pop.per);
      this.vel.set(dir.x * pw, Math.max(this.vel.y * 0.3, pop), dir.y * pw);
      this.air = true;
      this.bigLaunch = false;
      this.airStun = Math.round(Math.max(J.airStun.min, J.airStun.base - this.combo * J.airStun.per) * decay);
      this.setState('launched', 'launched');
    } else {
      this.stun = Math.round((m.hitstun ?? 20) * decay);
      this.hurtAlt = !this.hurtAlt;
      // high / low as before, then that reaction's base or alt strip (ADR 0031)
      this.setState('hitstun', this.pickAnim(m.low || this.hurtAlt ? 'hurtLow' : 'hurtHigh'));
      const pw = m.push ?? 3;
      this.vel.x = dir.x * pw;
      this.vel.z = dir.y * pw;
    }
    if (m.lock) {
      // one multi-hit move (beam, vortex ticks) holds them until its next tick: it can't be teched midway
      this.airStun = Math.max(this.airStun, m.lock);
      this.stun = Math.max(this.stun, m.lock);
    }
    if (this.combo >= J.cap && this.state === 'launched' && !this.ko) this.forceTech = true; // combo cap
    // they turn to the attacker: in front of them as a rule, behind them for a back air or a down smash's back swing
    const R = this.game.basis.right, behind = (m.back || m.both) && (dir.x * R.x + dir.y * R.z) * att.side < 0;
    this.setSide(behind ? att.side : -att.side);
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
      startHitFlash(this, 'burn', 0, this.burn?.color ?? att.def.color);
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
      const s = hitShake(this, time);
      x += camRight.x * s;
      z += camRight.z * s;
    } else if (this.state === 'charge' || this.smashCharging) {
      // trembling with the power: a pixel or so, more as it builds
      const s = dmath.sin(time * 70) * 0.012 * Math.min(1, (this.smashCharging ? this.chargeT : this.t) / 30);
      x += camRight.x * s;
      z += camRight.z * s;
    }
    this.renderPos = this.renderPos || new THREE.Vector3();
    this.renderPos.set(x, y, z);
    // the wall strip (ADR 0030) is drawn against a wall at its left: on a wall at a screen side it faces away from the
    // wall with its wall line on the barrier; on a wall seen in depth it keeps facing the opponent, re-centred on the
    // fighter. A tech roll's strip keeps the facing it started with. The sprite only: the facing for gameplay and
    // renderPos (followed by the camera and the effects) stay on the fighter.
    let fx = this.face.x, fz = this.face.y;
    if (this.wallPoseShown()) {
      const w = wallFacing(this.techAxis, this.techSign, camRight, WALL_FACE);
      if (w.side) { fx = w.fx; fz = w.fz; }
      const a = this.actor;
      const s = wallShift(w.side, a.flipFor(fx, fz, camRight), a.wallLine(), a.wallAnchor()) * (a.depthK || 1);
      x += camRight.x * s;
      z += camRight.z * s;
    } else if (this.rollPoseShown()) { fx = this.rollFx; fz = this.rollFz; }
    else if (this.mirrorPose && this.state === 'attack') { fx = -fx; fz = -fz; } // a back air on a forward strip (ADR 0042)
    this.actor.place(x, y, z);
    const cam = this.game.cam; // depth-normalized sprite size, keyed on the camera clock (SpriteActor.syncDepth)
    this.actor.sync(camera, fx, fz, camRight, cam?.spriteRefDepth, cam?.time ?? time);
    const u = this.actor.mat.uniforms;
    let flash = hitFlashUniforms(this, u, time);
    if (this.state === 'charge') {
      // a steady tint in the power-up's color (ENG-069): the shell and emitters carry the motion, not a flicker
      const cs = chargeStyle(this);
      u.flashColor.value.copy(cs.tint);
      flash = Math.max(flash, cs.bodyTint);
    } else if (this.state === 'beamCharge' || this.smashCharging) {
      u.flashColor.value.set(this.def.color);
      flash = Math.max(flash, 0.12 + 0.1 * dmath.sin(time * 30));
    } else u.flashColor.value.set(0xffffff);
    if (this.invuln > 0 && this.state === 'getup' && (this.t >> 2) % 2) flash = Math.max(flash, 0.25);
    if (this.invuln > 0 && (this.state === 'dodge' || this.state === 'airDodge')) {
      // intangible shimmer, so a dodge reads at a glance
      u.flashColor.value.set(0xbfe8ff);
      flash = Math.max(flash, 0.28 + 0.14 * dmath.sin(time * 42));
    }
    if (this.game.superFlash?.who === this) flash = Math.max(flash, this.game.superFlash.t < 6 ? 1 : 0);
    u.flash.value = flash;
  }
}
