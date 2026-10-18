import * as THREE from 'three';
import { ULTIMATE, VANISH, SUPERS, PROJECTILES, CLASH, DEFENSE, MOVES } from './moves.js';
import { specialFor, kitOf, towardSide, clashable, energyMoves, airEnergyMoves, isEnergy, incomingEnergy, canBeamClashNow } from './kit.js';
import { BeatPlan } from './clash.js';
import { seekClash } from './aiClash.js';

// Where each ultimate kind makes sense (ADR 0017): the beam and Hollow Purple want room, the Four-Tails pounce
// has a reach and wants their lane, Whirlwind wants them close enough to swing at it, the rest fire anywhere.
function ultimateFits(U, dist, sd) {
  if (!U || U.kind === 'orb') return dist > 2.6;
  if (U.kind === 'rampage') return dist < (U.range ?? 8) - 0.6 && sd < 1;
  if (U.kind === 'reflex') return dist < 4;
  if (U.kind === 'laneStrike') return dist < U.reach - 0.4 && sd < 1; // Gigant Pistol: their lane, within the arm's reach
  return true;
}
import { MasterBrain, roomAlong } from './aiMaster.js';
import { reachT } from './aiDefense.js';
import { TechTimer } from './aiTech.js';
import { Showcase, specialId, pickW } from './aiShow.js';
import { NORMAL_INPUT, AIM_FRAMES, FULL_HOP, SHORT_HOP, aimStick, noFlick, canFastFall } from './aiNormals.js';
import { aerialFor } from './aiCombo.js';

// states where the stick is the tech's or the roll's, not a normal's (an aim pressed before the hit is dropped)
const NO_AIM = new Set(['launched', 'airRecover', 'impactTech', 'techRoll', 'down', 'getup', 'held', 'burst']);

export const CPU_LEVELS = ['easy', 'normal', 'hard', 'insane', 'impossible'];

// One brain per CPU side. IMPOSSIBLE is its own frame-data brain (aiMaster.js, ADR 0014); in CPU vs CPU it
// plays the louder 'showman' style so a spectated fight keeps moving. `seed`: the brain's share of the match seed
// (Game.brainSeed), which draws its combo persona and routes (aiCombo.js, ADR 0026).
export function makeBrain(fighter, level = 'normal', spectate = false, seed = (Math.random() * 4294967296) >>> 0) {
  // INSANE is the same frame-data brain with human reactions and the odd dropped combo (STYLES.insane)
  if (level === 'impossible' || level === 'insane') return new MasterBrain(fighter, spectate ? 'showman' : level, seed);
  return new CpuBrain(fighter, level, spectate);
}

// The level's technique rates reshaped by the defense persona (ADR 0025). Against a person the persona only changes
// which technique comes out (the sum of the rates stays the level's); spectated, the CPU shows off: ×1.5, capped.
const TECH_RATES = { parry: 'parry', spot: 'dodge', airDodge: 'airdodge', wavedash: 'wavedash', vanish: 'vanish', dodge: 'dodge' };
function personaLevel(base, P, spectate) {
  const L = { ...base };
  let sum0 = 0, sum1 = 0;
  for (const k in TECH_RATES) {
    L[k] = base[k] * P.m[TECH_RATES[k]] * (spectate ? 1.5 : 1);
    sum0 += base[k];
    sum1 += L[k];
  }
  for (const k in TECH_RATES) L[k] = spectate ? Math.min(0.9, L[k]) : (L[k] * sum0) / sum1;
  return L;
}

// show: how strongly it reaches for kit tools the player hasn't seen yet (Showcase, aiShow.js, ADR 0016);
// parry / spot / airDodge / wavedash: chances to use those techniques where they fit, and `slop` = frames its
// parry timing can be off by (a wide error at Easy, so most of its parries fail and it gets hit)
// beat: its rhythm-clash timing (clash.js cpuPlan): `sd` frames of error per press, `miss` = notes it skips
// techHold: chance per launch that it holds Guard to tech at the first gap (ADR 0022; `tech` stays the late tap);
// burst: chance per combo (3+ hits, with the ki and the round's burst) that it bursts out
// meleeClash: chance to meet a fresh light / heavy with the same button, a MELEE CLASH (aiClash.js, ADR 0038); x1.5 spectated
// impactTech: chance per techable impact (floor or wall bounce) that it goes for the timed tech (ADR 0028), pressed
// `techSd` frames off on average (aiTech.js TechTimer: too early locks it out, too late misses)
// antiAir: chance per jump of theirs that drops in on it that it meets it (up tilt or launcher); smash: chance per whiffed
// move of theirs with time to spare that it punishes it with a smash attack (ADR 0042)
const LEVELS = {
  easy: { meleeClash: 0.04, beat: { sd: 6.5, miss: 0.16 }, impactTech: 0.05, techSd: 5, react: 24, guard: 0.18, aggro: 0.45, combo: 0.35, special: 0.15, dodge: 0.15, charge: 0.35, tech: 0.02, techHold: 0.05, burst: 0, vanish: 0.05, dash: 0.2, show: 0.3, parry: 0.04, slop: 5, spot: 0.05, airDodge: 0.05, wavedash: 0.03, antiAir: 0.1, smash: 0.1 },
  normal: { meleeClash: 0.08, beat: { sd: 4.5, miss: 0.08 }, impactTech: 0.15, techSd: 4, react: 14, guard: 0.42, aggro: 0.65, combo: 0.75, special: 0.3, dodge: 0.35, charge: 0.5, tech: 0.06, techHold: 0.2, burst: 0.04, vanish: 0.18, dash: 0.35, show: 0.5, parry: 0.12, slop: 3, spot: 0.15, airDodge: 0.15, wavedash: 0.12, antiAir: 0.3, smash: 0.25 },
  hard: { meleeClash: 0.12, beat: { sd: 3, miss: 0.04 }, impactTech: 0.35, techSd: 3, react: 7, guard: 0.7, aggro: 0.8, combo: 1.0, special: 0.45, dodge: 0.6, charge: 0.55, tech: 0.12, techHold: 0.45, burst: 0.12, vanish: 0.35, dash: 0.5, show: 0.7, parry: 0.28, slop: 2, spot: 0.3, airDodge: 0.35, wavedash: 0.25, antiAir: 0.55, smash: 0.4 },
};

// The CPU presses virtual buttons on its own Pad, exactly like a player would.
// Combos are driven by watching its own fighter's state (cancel windows, hit
// confirms), so it chains auto-combo -> launcher -> chase -> air combo -> spike.
export class CpuBrain {
  constructor(fighter, level = 'normal', spectate = false) {
    this.f = fighter;
    this.L = this.baseL = LEVELS[level] || LEVELS.normal;
    this.spectate = spectate;
    this.plan = 'idle';
    this.planT = 0;
    this.clk = 0; // live frames, never reset (setPlan resets planT, which used to lose a pending reaction)
    this.wait = 30;
    this.hold = {};
    this.beat = null; // its plan for the current clash
    this.lastOppState = '';
    this.strafe = Math.random() < 0.5 ? 1 : -1;
    this.route = 'launch';
    this.show = new Showcase(fighter, this.L.show, spectate ? 1 : 0.4);
    this.techT = new TechTimer(this.L.impactTech, this.L.techSd);
    this.aimsNormals = true; // its stick picks the directional normals, its jumps are short or full hops (ADR 0042)
    this.aim = null; // the normal pressed last and its stick, held until the fighter reads it (normal())
  }

  // only from a released state, so every press is a fresh edge. Light or Heavy on its own is the neutral normal (the
  // jab, the launcher, the neutral air): its stick is held neutral until the fighter reads it (normal() aims elsewhere)
  press(name, frames = 2) {
    if (this.hold[name] !== undefined && this.hold[name] !== -1) return false;
    this.hold[name] = frames;
    if (name === 'light' || name === 'heavy') this.aim = { btn: name, dir: 'neutral', air: false, at: this.f.pad.frame, live: false };
    return true;
  }

  // The normal `name` (NORMALS in moves.js: 'uTilt', 'dTilt', 'fSmash', 'fair' ...; ADR 0042): its button, with the
  // stick held on its direction from the press until the fighter has read it (aiNormals.js)
  normal(name, frames = 2) {
    const N = NORMAL_INPUT[name];
    if (!N || !this.press(N.btn, frames)) return false;
    this.aim = { btn: N.btn, dir: N.dir, air: N.air, at: this.f.pad.frame, live: false };
    return true;
  }

  // The stick for the normal pressed last, until the fighter has read it (consumed the press) or its buffer is over;
  // null when there is none (or we got hit before it came out: the stick is the tech's then)
  aimNow(f, pad) {
    const a = this.aim;
    if (!a) return null;
    if ((a.live && pad.b[a.btn].lastPress < 0) || pad.frame - a.at > AIM_FRAMES || NO_AIM.has(f.state)) { this.aim = null; return null; }
    return aimStick(f, a.dir, a.air);
  }

  update(game) {
    const f = this.f, o = f.opp, pad = f.pad;
    pad.tick();
    this.show.watch();
    if (this.show.persona && this.persona !== this.show.persona) {
      this.persona = this.show.persona; // rolled, or nudged for a new round
      this.L = personaLevel(this.baseL, this.persona, this.spectate);
    }
    const L = this.L;
    let mx = 0, my = 0, tt = null;
    const R = Math.random;
    const dx = o.pos.x - f.pos.x, dz = o.pos.z - f.pos.z;
    const dist = Math.hypot(dx, dz);
    const toOpp = new THREE.Vector2(dx, dz).normalize();
    const moveWorld = (vx, vz) => {
      const r = game.basis.right, fw = game.basis.fwd;
      mx = vx * r.x + vz * r.z;
      my = vx * fw.x + vz * fw.z;
    };
    // 2.5D lanes: line up in depth and stand ~1.1 units beside them on screen
    const { sx, sd } = f.laneOffsets();
    const laneGo = () => {
      const R = game.basis.right, F = game.basis.fwd;
      const want = Math.abs(sx) - 1.05;
      // stacked in depth right behind them (sx ~ 0, e.g. both against the barrier): step out toward the ring's
      // middle, or the depth step and the body push hold them there for good
      const side = Math.abs(sx) > 0.3 ? Math.sign(sx) : f.pos.x * R.x + f.pos.z * R.z > 0 ? 1 : -1;
      const ax = Math.abs(want) > 0.15 ? side * Math.sign(want) : 0;
      const ad = Math.abs(sd) > 0.18 ? Math.sign(sd) : 0;
      moveWorld(R.x * ax + F.x * ad, R.z * ax + F.z * ad);
      return Math.abs(want) < 0.45 && Math.abs(sd) < 0.45;
    };

    if (game.clash) {
      // a clash: play the chart (each press planned once, at its level's timing)
      if (this.beat?.clash !== game.clash) this.beat = new BeatPlan(game.clash, L.beat);
      for (const p of this.beat.due(game.clash.timer + 1)) this.press(this.beat.button(), p.len);
    } else if (game.inputLive && !f.ko && !o.ko && !game.freeze) {
      this.planT++;
      this.clk++;
      this.wait--;
      // the show director's beam-clash cue (CPU vs CPU only, ADR 0027): 'challenge', 'answer' or null
      this.cue = this.show.tools.beamClash ? game.director?.cueFor('beamClash', f.index) ?? null : null;

      // --- air tech when juggled
      if (f.state === 'launched' && f.airStun <= 0 && f.pos.y > 0.4 && R() < L.tech) this.press('jump', 1);
      // --- timed impact tech (ADR 0028): a fresh Guard press right before the floor or the barrier (applied below)
      tt = this.techT.plan(f, towardSide(f));
      // --- combo escape (ADR 0022): hold Guard through a launch (tech at the first gap, or roll on landing), and
      // now and then burst out of a combo
      if (f.state !== 'launched' && f.state !== 'hitstun') this.techHold = this.burstRoll = null;
      else {
        if (this.plan === 'charge') { this.hold.special = 0; this.setPlan('idle', 10); } // a hit ends the charge: let go of Special
        if (f.state === 'launched' && this.techHold == null) this.techHold = R() < L.techHold;
        // armed for the timed tech (ADR 0028): a Guard press now would lock it out, so the air gaps get a Jump tap
        if (this.techHold && !this.techT.armed) this.hold.guard = 2;
        else if (this.techHold && f.state === 'launched' && f.airStun <= 1 && f.pos.y > DEFENSE.tech.minY) this.press('jump', 1);
        if (this.burstRoll == null && f.combo >= 3) this.burstRoll = R() < L.burst ? 3 + Math.floor(R() * 3) : 0; // at hit 3-5
        if (this.burstRoll && f.combo >= this.burstRoll && f.canBurst()) { this.hold.guard = 3; this.press('special', 2); this.burstRoll = 0; }
      }
      // --- throw break (ADR 0015): Light + Heavy once, at its reaction time, if the guard roll says so
      if (f.state === 'held' && f.grab && f.grab.t === Math.min(10, Math.max(4, L.react - 3)) && R() < L.guard * 0.6) { this.press('light'); this.press('heavy'); }

      // --- combo execution: react to our own hits
      if (f.state === 'attack' && f.move) this.comboStep(f, o, R);
      else if (f.state === 'air' && f.chase > 0 && !f.airAttack && f.distTo() < 2.2) this.press('light');

      // --- melee clash (ADR 0038): meet their light / heavy with ours, or go again out of a clash's bounce
      const cl = seekClash(f, L.meleeClash * (this.spectate ? 1.5 : 1), this, R);
      if (cl) { this.press(cl, 2); this.setPlan('idle', 14); }

      // --- reactions
      const oppAttacking = o.state === 'attack' && o.move && o.t < o.move.startup + o.move.active;
      if (oppAttacking && o.state !== this.lastOppState) this.reactAt = this.clk + L.react;
      if (oppAttacking && this.reactAt === this.clk && dist < 3.4 && !f.busy) {
        // a counter may sit on ↓ or ← (Naruto's Substitution); the techniques the player hasn't seen this match
        // are a bit likelier (Showcase), each at its level's rate
        const sh = this.show, big = o.move.big || o.move.special, left = reachT(o, o.move) - o.t;
        const cSlot = ['down', 'back'].find((sl) => specialFor(f.def, sl)?.kind === 'counter');
        const counter = cSlot && specialFor(f.def, cSlot);
        this.tgtProj = null;
        if (counter && f.ki >= counter.cost && R() < L.guard * 0.35 * sh.bias(specialId(counter))) this.useSpecial(cSlot);
        else if (f.state === 'air' && !f.airDodged && R() < L.airDodge * sh.bias('airDodge')) this.airDodge(toOpp);
        else if (f.state !== 'air' && left > 2 && R() < L.parry * sh.bias('parry')) this.setPlan('parry', left + 14);
        else if (f.state !== 'air' && left > 4 && R() < L.spot * (big ? 1 : 0.4) * sh.bias('spotDodge')) this.setPlan('spotDodge', left + 18);
        else if (R() < L.guard) this.setPlan('guard', 14 + (o.move?.special ? 20 : 0));
        else if (R() < L.dodge * 0.3) this.dodge();
      }
      // their energy shot or Rasengan / Chidori from further out: sometimes answer it with ours (a BEAM CLASH, ADR 0027)
      if (oppAttacking && this.reactAt === this.clk && dist > CLASH.struggle.minDist + 0.3 && dist < 7 && (PROJECTILES[o.move.proj]?.clash || o.move.clash === 'rush')) {
        this.answerEnergy(f, o.move.clash === 'rush');
      }
      // cued to answer, it expects their energy and fires into it as soon as it comes (out of a charge, let go first)
      if (this.cue === 'answer' && this.energyComing(f, o)) {
        if (f.state === 'charge') { this.hold.special = 0; this.setPlan('idle', 4); }
        else this.answerEnergy(f, o.state === 'attack' && o.move?.clash === 'rush', true);
      }
      // guard-cancel vanish out of block pressure
      if (f.state === 'block' && f.ki >= VANISH.cost && R() < L.vanish * 0.08) { this.hold.guard = 3; this.press('special', 2); }
      // Kirin marks a spot: dash out of it before the dragon lands
      const ks = o.state === 'kit' && o.kitState;
      if (ks && ks.kind === 'skyStrike' && ks.phase === 'mark' && ks.t0 === L.react && Math.hypot(f.pos.x - ks.at.x, f.pos.z - ks.at.z) < ks.m.radius + 0.5
        && R() < 0.35 + L.dodge * 0.6) this.dodge();
      const ou = o.state === 'kit' && o.kitState?.ultimate ? o.kitState : null;
      if (ou && ou.t0 === L.react && ((ou.kind === 'orb' && ou.phase === 'merge') || (ou.kind === 'rampage' && ou.phase === 'roar'))) {
        // answer it with an ultimate that can meet it (a rhythm clash), or get out of its way
        if (f.ki >= ULTIMATE.cost && clashable(f.def) && R() < 0.35 + L.combo * 0.3) this.setPlan('ultimate', 5);
        else if (R() < L.dodge + 0.25) this.setPlan('dodgeBeam', 24);
        else this.setPlan('retreat', 30);
      }
      if (o.state === 'beamCharge' && o.t === Math.max(1, o.windup - L.react)) {
        if (f.ki >= ULTIMATE.cost && R() < 0.5 + L.combo * 0.3) this.setPlan('ultimate', 5);
        else if (R() < L.dodge + 0.25) this.setPlan('dodgeBeam', 20);
        else this.setPlan('guard', 70);
      }
      for (const p of game.projectiles) {
        if (p.owner === f || p.dead || p.seen) continue;
        const pd = Math.hypot(p.pos.x - f.pos.x, p.pos.z - f.pos.z);
        if (pd < 6) {
          p.seen = true;
          const sh = this.show;
          this.tgtProj = p;
          // fire ours into it: a BEAM CLASH (ADR 0027). A special already on its way (an answer to the shot's startup)
          // keeps going: switching to a guard or dodge now would press Guard + Special, a vanish.
          if (p.P.clash && (this.plan === 'useSpecial' || this.answerEnergy(f))) this.tgtProj = null;
          else if (f.state === 'air' && !f.airDodged && R() < L.airDodge * sh.bias('airDodge')) this.airDodge(toOpp);
          else if (!f.busy && f.state !== 'air' && R() < L.parry * sh.bias('parry')) this.setPlan('parry', 40);
          else if (!f.busy && f.state !== 'air' && R() < L.spot * 0.6 * sh.bias('spotDodge')) this.setPlan('spotDodge', 40);
          else if (R() < L.guard) this.setPlan('guard', 30);
          else if (R() < L.dodge) this.dodge();
        }
      }
      this.lastOppState = o.state;
      // free combo on a frozen (Domain / Infinity stagger) or popped-up (Blue) opponent
      if (!f.busy && this.plan !== 'combo' && this.plan !== 'jumpAttack') {
        if (o.state === 'held' && R() < L.combo) this.setPlan('combo', 90);
        else if (o.state === 'launched' && o.pos.y > 1.2 && dist < 3 && f.state !== 'air' && R() < 0.4 * L.combo) this.setPlan('jumpAttack', 50);
      }

      // anti-air (ADR 0042): their jump drops in on us; seen after its reaction time, once per airtime of theirs at the
      // level's rate, an up tilt or the launcher timed to where they'll be when it comes out
      if (o.air && !this.oppAir) { this.oppAirAt = this.clk; this.aaRoll = null; }
      this.oppAir = o.air;
      if (o.air && !f.busy && f.state !== 'air' && this.clk - this.oppAirAt >= L.react && (o.state === 'air' || (o.state === 'attack' && o.move?.air))) {
        if (this.aaRoll == null) {
          this.aaRoll = R() < L.antiAir * (this.spectate ? 1.3 : 1);
          this.aaMove = R() < 0.6 * Math.sqrt(this.show.bias('uTilt')) ? 'uTilt' : 'heavy'; // each in its own window
        }
        if (this.aaRoll && this.antiAirFits(f, o, game.basis.right, this.aaMove)) {
          if (this.aaMove === 'heavy') this.press('heavy');
          else this.normal(this.aaMove);
          this.aaRoll = false;
          this.setPlan('idle', 20);
        }
      }
      // their whiff with time to spare (seen after its reaction time): a smash attack into its recovery, charged by the
      // frames left over (ADR 0042: slow and punishable, so only a punish), once per move of theirs at the level's rate
      const om = o.state === 'attack' ? o.move : null;
      if (om && (om !== this.smSeen || o.t < this.smT)) { this.smSeen = om; this.smT = o.t; this.smDone = false; } // a new use of theirs
      if (om) this.smT = o.t;
      if (om && !this.smDone && !o.moveHit && !om.projectile && !(om.next && o.t < om.cancel + 2) && o.t >= om.startup + om.active + Math.min(L.react, 8) && !f.busy && f.state !== 'air') {
        this.smDone = true;
        const pick = R() < L.smash * (this.spectate ? 1.3 : 1) ? this.smashFor(f, om.startup + om.active + om.recovery - o.t) : null;
        if (pick) { this.smashMove = pick.move; this.smashHold = pick.hold; this.setPlan('smash', 4); }
      }

      if (this.wait <= 0 && !f.busy && f.state !== 'air') this.choose(dist, f, o);

      switch (this.plan) {
        case 'approach':
          if (laneGo()) this.setPlan('combo', 70);
          break;
        case 'superDash':
          if (this.planT === 1) this.press('dash', 2);
          if (this.planT > 8 && f.state === 'superDash' && dist < 2.2) this.press('light');
          if (this.planT > 40) this.setPlan('combo', 60);
          break;
        case 'dashIn':
          moveWorld(toOpp.x, toOpp.y);
          this.press('dash', 2);
          this.setPlan('approach', 30);
          break;
        case 'retreat':
          moveWorld(-toOpp.x + toOpp.y * this.strafe * 0.6, -toOpp.y - toOpp.x * this.strafe * 0.6);
          break;
        case 'strafe':
          moveWorld(toOpp.y * this.strafe + toOpp.x * 0.15, -toOpp.x * this.strafe + toOpp.y * 0.15);
          break;
        case 'combo':
          if (f.state !== 'attack') {
            const ready = laneGo();
            if (ready && !f.busy && this.planT % 6 === 0) {
              this.route = R() < 0.55 * L.combo ? 'launch' : R() < 0.5 ? 'special' : 'smash';
              this.press('light');
            }
          }
          if (this.planT > this.planLen && f.state !== 'attack' && f.state !== 'air') this.setPlan('strafe', 20 + R() * 30);
          break;
        case 'heavy':
          this.press('heavy');
          this.setPlan('idle', 30);
          break;
        case 'special':
          if (dist > 7 && this.planT < 20) moveWorld(toOpp.x, toOpp.y);
          else this.useSpecial(this.pickSpecial(f, o, dist));
          break;
        case 'useSpecial': {
          // hold the direction through the release frame: that's when the slot is read
          const d = this.spSlot;
          if (d === 'forward') mx = towardSide(f);
          else if (d === 'back') mx = -towardSide(f);
          else if (d === 'up') my = 1;
          else if (d === 'down') my = -1;
          if (this.planT === 1) this.press('special', 3);
          if (this.planT > 7) this.setPlan('idle', 36);
          break;
        }
        case 'super':
          this.press('super', 2);
          this.setPlan('idle', 60);
          break;
        case 'jumpAttack': {
          // a full hop at them (Jump held through the squat; now and then a short hop), the stick held through the squat
          // (its last frame reads the jump's direction); in the air the aerial that fits where they are (ADR 0042)
          if (this.planT === 1) { moveWorld(toOpp.x, toOpp.y); this.press('jump', R() < 0.25 ? SHORT_HOP : FULL_HOP); }
          else if (f.state === 'jumpSquat') moveWorld(toOpp.x, toOpp.y);
          else if (f.air) {
            moveWorld(toOpp.x, toOpp.y);
            const a = f.state === 'air' && !f.airAttack && (f.vel.y < 3 || o.air) ? (o.state === 'launched' ? (dist < 2.6 ? 'airLight1' : null) : aerialFor(f, game.basis.right)) : null;
            if (a) this.normal(a);
          }
          if (f.state === 'attack' && f.air && f.move?.air && !f.juggleMove && f.t > f.move.startup + f.move.active) {
            const ff = this.fastFall(); // past its active frames: fast fall, so it lands sooner
            if (ff) [mx, my] = ff;
          }
          if (this.planT > 50) this.setPlan('idle', 10);
          break;
        }
        case 'hop': {
          // a short-hop aerial in (ADR 0042). Rising: Jump + Light together, the forward air from a step out (the held
          // stick drifts the jump in), the neutral air close up. Late: the hop first, the aerial that fits on the way
          // down, so it lands with their hit stun to spare (linkDt). Past its active frames: fast fall
          if (this.planT > 45 || (this.hopped && !f.air && f.state !== 'jumpSquat' && f.state !== 'attack')) { this.setPlan('idle', 12); break; }
          if (this.hopped) {
            if (f.state === 'jumpSquat' && this.hopLate && Math.abs(sx) > 1.4) moveWorld(toOpp.x, toOpp.y); // the squat's end reads it
            else if (this.hopLate && f.state === 'air' && !f.airAttack && f.vel.y < 0.5) {
              // from the top, the aerial with a fast fall right after the press: it hits low and lands into the link
              const a = aerialFor(f, game.basis.right, true);
              if (a) this.normal(a);
            } else if (f.state === 'attack' && f.air && f.move?.air && (this.hopLate || f.t > f.move.startup + f.move.active)) {
              const ff = this.fastFall();
              if (ff) [mx, my] = ff;
            }
            break;
          }
          if (Math.abs(sd) > 0.4 || Math.abs(sx) > 2.3) { laneGo(); break; }
          if (f.busy || f.side !== towardSide(f)) break;
          this.hopped = true;
          this.hopLate = R() < 0.5;
          this.press('jump', SHORT_HOP);
          if (!this.hopLate) this.normal(Math.abs(sx) < 1.25 ? 'airLight1' : 'fair');
          break;
        }
        case 'bair': {
          // a back air after running off (ADR 0042): run away a few frames (the facing turns with the run), then Jump +
          // Light with ← along that facing, toward them: the jump drifts back in and the back air hits behind
          if (this.planT > 40 || (this.hopped && !f.air && f.state !== 'jumpSquat' && f.state !== 'attack')) { this.setPlan('idle', 12); break; }
          if (this.hopped || f.busy) break;
          if (f.side === towardSide(f) || this.planT < 5) { moveWorld(-toOpp.x, -toOpp.y); break; }
          this.hopped = true;
          this.press('jump', SHORT_HOP);
          this.normal('bair');
          break;
        }
        case 'poke':
          // a tilt at its range (ADR 0042): the down tilt (low, links into a jab) or the forward tilt (the longest normal)
          if (laneGo() || (Math.abs(sx) < (this.pokeMove === 'fTilt' ? 1.7 : 1.45) && Math.abs(sd) < 0.45)) {
            if (!f.busy) { this.normal(this.pokeMove); this.setPlan('idle', 24); }
          }
          if (this.planT > 40) this.setPlan('strafe', 16);
          break;
        case 'smash':
          // a smash attack into their whiff (ADR 0042), held to charge with the frames it has to spare
          if (!f.busy) this.normal(this.smashMove, this.smashHold);
          this.setPlan('idle', 30);
          break;
        case 'linkDt':
          // a short-hop aerial hit them standing: the down tilt once we land, inside their hit stun (ADR 0042)
          if (o.state !== 'hitstun' || this.planT > 40) { this.setPlan('idle', 6); break; }
          if (f.air) {
            const ff = this.fastFall(); // past the aerial's top: fast fall, to land with stun to spare
            if (ff) [mx, my] = ff;
          } else if (f.state !== 'jumpSquat' && (f.state !== 'land' || f.t >= f.landLag - 4)) { this.normal('dTilt'); this.setPlan('idle', 30); }
          break;
        case 'linkAir':
          // out of an up tilt: a short hop under them, then the up air once they're above us (ADR 0042)
          if (this.planT > 45 || o.state !== 'launched') { this.setPlan('idle', 10); break; }
          if (!this.hopped) { if (!f.busy) { this.hopped = true; this.press('jump', SHORT_HOP); } break; }
          if (f.air && !f.airAttack && f.state === 'air' && dist < 1.3 && o.pos.y > f.pos.y - 0.2) { this.normal('uair'); this.setPlan('idle', 30); }
          break;
        case 'projectile':
          if (this.planT === 1) this.press('jump', FULL_HOP);
          if (f.air && f.vel.y < 4 && !f.airAttack) this.press('special', 2);
          if (this.planT > 45) this.setPlan('idle', 20);
          break;
        case 'charge':
          this.hold.special = 2;
          if (f.ki >= ULTIMATE.cost - 1 || dist < 2.4 || this.planT > this.planLen) { this.hold.special = 0; this.setPlan('idle', 10); }
          break;
        case 'challenge': {
          // BEAM CLASH on the director's cue (ADR 0027): to a gap their answer reaches, then fire once they're free to
          // answer (standing or running, with the ki for it)
          const e = this.cueMove, want = e && Math.min(6, Math.max(4, e.range - 1));
          if (this.cue !== 'challenge' || !e || f.ki < e.cost) { this.setPlan('idle', 10); break; }
          if (dist > want + 0.5) moveWorld(toOpp.x, toOpp.y);
          else if (dist < want - 0.5) moveWorld(-toOpp.x, -toOpp.y);
          else if (!f.busy && (o.state === 'idle' || o.state === 'run') && o.ki >= this.answerKi(o, e.kind === 'rush') && canBeamClashNow(f, 5)) this.useSpecial(e.slot);
          if (this.plan === 'challenge' && this.planT > this.planLen) this.setPlan('idle', 6);
          break;
        }
        case 'ultimate':
          this.press('heavy', 3);
          this.press('special', 3);
          this.setPlan('idle', 90);
          break;
        case 'guard':
          this.hold.guard = 2;
          if (this.planT > this.planLen) this.setPlan('idle', 6);
          break;
        case 'parry': {
          // let go of Guard, then press it as the hit is about to land (a fresh press is a parry attempt),
          // `slop` frames early or late at random; keep holding after it, so a missed parry still blocks
          const left = this.threatIn(o);
          if (this.planT === 1) this.parryT = 2 + Math.round((R() * 2 - 1) * L.slop);
          if (left <= this.parryT) this.hold.guard = 3;
          if (left < -4 || this.planT > this.planLen) { this.tgtProj = null; this.setPlan('guard', 10); }
          break;
        }
        case 'spotDodge': {
          // Guard, a neutral frame, then ↓: intangible from the dodge's 2nd frame
          const left = this.threatIn(o);
          if (this.planT === 1) this.dodgeGo = 0;
          if (!this.dodgeGo && left <= 8) this.dodgeGo = this.planT;
          if (this.dodgeGo) {
            this.hold.guard = 2;
            if (this.planT - this.dodgeGo >= 2) my = -1;
          }
          if (f.state === 'dodge' || this.planT > this.planLen) { this.tgtProj = null; this.setPlan('idle', f.state === 'dodge' ? 24 : 6); }
          break;
        }
        case 'airDodge':
          moveWorld(this.wd[0], this.wd[1]);
          if (this.planT === 1) this.press('guard', 2);
          if (this.planT > 3) this.setPlan('idle', 10);
          break;
        case 'wavedash':
          // jump with Guard pressed in the squat and the stick held: a slide along the floor
          moveWorld(this.wd[0], this.wd[1]);
          if (this.planT === 1) { this.press('jump', 1); this.press('guard', 3); }
          if (this.planT > 8) this.setPlan(this.wdNext ?? 'idle', 30);
          break;
        case 'dodgeBeam': {
          moveWorld(toOpp.y * this.strafe, -toOpp.x * this.strafe);
          if (o.state === 'beamCharge' && o.t >= o.windup - 6) this.press('dash', 2);
          else if (o.state === 'kit' && o.kitState?.ultimate && this.planT === 3) this.press('dash', 2);
          if (this.planT > this.planLen) this.setPlan('idle', 10);
          break;
        }
        default:
          if (dist > 2.2 && f.state !== 'air') moveWorld(toOpp.x * 0.5, toOpp.y * 0.5);
      }
    }

    if (this.stick?.t > 0) {
      this.stick.t--;
      const d = this.stick.slot;
      mx = d === 'forward' ? towardSide(f) : d === 'back' ? -towardSide(f) : 0;
      my = 0;
    } else if (this.plan !== 'useSpecial') {
      // a normal's stick from its press until the fighter reads it; steering in the air never flicks into a fast
      // fall it doesn't mean (an air dodge reads its own stick)
      const a = this.aimNow(f, pad);
      if (a) [mx, my] = a;
      if (a && my < 0 && !f.air) this.hold.guard = 0; // (Guard + ↓ would be a spot dodge, not the down tilt or smash)
      if (!this.ffWant && !(this.hold.guard > 0)) my = noFlick(f, my);
    }
    this.ffWant = false;
    if (tt) {
      // the timed tech wins over whatever the plan holds: Guard let go, then a fresh press; the option's stick
      if (tt.guard === 'release') this.hold.guard = 0;
      else if (tt.guard === 'press') this.hold.guard = 2;
      if (tt.mx != null) { mx = tt.mx; my = tt.my; }
    }
    pad.setMove(mx, my);
    pad.dashDir = null; // laneGo flicks the stick on/off: never let that read as a double-tap dash
    for (const name of ['light', 'heavy', 'special', 'jump', 'guard', 'dash', 'super']) {
      const h = this.hold[name] ?? -1;
      pad.set(name, h > 0);
      this.hold[name] = h > 0 ? h - 1 : -1;
    }
    if (this.aim && !this.aim.live && pad.b[this.aim.btn].pressed) this.aim.live = true;
  }

  // A fast fall (Smash air, ADR 0042) this frame: a fresh ↓ (the stick kept off ↓ the frame before) past the top
  fastFall() {
    if (!canFastFall(this.f) || this.f.pad.prevDir.d) return null;
    this.ffWant = true;
    return [0, -1];
  }

  // Watch our own attack and feed the next input at the right moment.
  comboStep(f, o, R) {
    const m = f.move, L = this.L, n = f.moveName, t = f.t;
    const A = m.startup, B = A + m.active;
    if (t < A) return;
    if (!f.moveHit) {
      // whiffed: sometimes keep pressing (string), sometimes stop
      if (m.next && t >= m.cancel && R() < 0.25 * L.combo) this.press('light');
      return;
    }
    // Smash links (ADR 0042): the normal after this one has to land inside the hit stun; decided once per hit. Down
    // tilt (+11) into the jab string; up tilt into another up tilt or a short hop and the up air; a short-hop aerial on
    // a standing victim into the down tilt once we land
    if (this.linkOf !== m || t < this.linkT) { this.linkOf = m; this.linkGo = R() < L.combo; this.linkPick = R() < 0.5 ? 'uTilt' : 'hop'; }
    this.linkT = t;
    const C = B + m.recovery;
    if (n === 'dTilt') { if (this.linkGo && t >= C - 5) this.press('light'); return; }
    if (n === 'uTilt') {
      if (this.linkGo && t >= C - 5 && this.plan !== 'linkAir') {
        const above = o.pos.y - f.pos.y < 2.0 && f.distTo() < 1.3;
        if (this.linkPick === 'uTilt' && above) this.normal('uTilt');
        else this.setPlan('linkAir', 45);
      }
      return;
    }
    if (m.air && f.air && !f.juggleMove && o.state === 'hitstun') {
      if (this.linkGo && this.plan !== 'linkDt') this.setPlan('linkDt', 40);
      return;
    }
    const skill = R() < L.combo;
    if (!skill) return;
    if (n === 'light1' || n === 'light2') return this.press('light');
    if (n === 'light3') {
      if (this.route === 'launch') return this.press('heavy');
      const slot = this.route === 'special' ? this.comboSlot(f) : null;
      if (slot) {
        this.stick = { slot, t: 4 }; // the stick picks the special (held through the cancel)
        return this.press('special', 2);
      }
      return this.press('light');
    }
    if (n === 'light4' && t >= B && f.ki >= VANISH.cost && R() < L.vanish) { this.hold.guard = 3; this.press('special', 2); return; }
    if (n === 'light4' && t >= B && R() < L.dash) return this.press('dash', 2);
    if (n === 'heavy') return this.press('jump', 2); // chase the launch
    if (n === 'airLight1') return this.press('light');
    if (n === 'airLight2') return this.press(R() < 0.6 ? 'heavy' : 'light');
    if (n === 'airLight3' && t >= B && R() < L.dash) return this.press('dash', 2);
  }

  // The special to end a ground string with: a rush, a shot or a teleport strike, the unseen ones likelier.
  comboSlot(f) {
    const w = {}, seen = new Set();
    for (const slot of ['neutral', 'forward', 'back']) {
      const m = specialFor(f.def, slot);
      if (!m || seen.has(m) || f.ki < (m.cost ?? 0)) continue;
      seen.add(m);
      if (m.kind === 'rush' || m.kind === 'shot' || (m.kind === 'teleport' && m.follow)) w[slot] = this.show.bias(specialId(m));
    }
    return pickW(w);
  }

  // Does anti-air `name` ('uTilt': 6 frames, pops them over our head; 'heavy': the launcher, 12) meet them where they'll
  // be when its first active frame comes (a falling body at their own gravity)? Not yet: keep the spacing.
  antiAirFits(f, o, R, name) {
    if (Math.abs(f.laneOffsets().sd) > 1) return false;
    const T = MOVES[name].startup / 60, g = 42 * (o.gravityScale?.() ?? 1);
    const x = (o.pos.x + o.vel.x * T - f.pos.x) * R.x + (o.pos.z + o.vel.z * T - f.pos.z) * R.z;
    const y = o.pos.y + o.vel.y * T - 0.5 * g * T * T - f.pos.y;
    return name === 'uTilt' ? Math.abs(x) < 1.2 && y > 0.15 && y < 2.0 : Math.abs(x) < 1.5 && y > -0.2 && y < 1.9;
  }

  // A smash attack that reaches them standing and lands inside `left` frames of their recovery: { move, hold } (Heavy
  // held past its charge frame by what the opening has to spare), the one the viewer hasn't seen likelier; or null
  smashFor(f, left) {
    const { sx, sd } = f.laneOffsets(), ax = Math.abs(sx), w = {};
    if (Math.abs(sd) > 0.6 || f.opp.pos.y > 0.3) return null;
    for (const name of ['fSmash', 'dSmash', 'uSmash']) {
      const m = MOVES[name];
      if (left >= m.startup + 3 && ax < m.reach + 0.3 + ((m.lunge ?? 0) * m.startup) / 120) w[name] = this.show.bias(name);
    }
    const move = pickW(w);
    if (!move) return null;
    const G = MOVES[move].charge, spare = Math.min(G.max, left - MOVES[move].startup - 8);
    return { move, hold: spare >= 6 ? G.at + spare : 2 };
  }

  // Pick a special slot that suits the situation (ADR 0009 kinds), weighted at random.
  pickSpecial(f, o, dist) {
    const seen = new Set(), opts = [];
    for (const slot of ['neutral', 'forward', 'up', 'down', 'back']) {
      const m = specialFor(f.def, slot);
      if (!m || seen.has(m) || f.ki < (m.cost ?? 0)) continue;
      seen.add(m);
      let w = 1;
      switch (m.kind) {
        case 'shot': w = dist > 3 ? 3 : 0.6; break;
        case 'rush': w = dist > 1.8 && dist < 7 ? 3 : 0.8; break;
        case 'teleport': w = dist > 2.5 ? 2 : 0.8; break;
        case 'pull': w = dist > 1.4 && dist < 4.5 ? 3 : 0.4; break;
        case 'dive': w = o.air ? 3 : dist > 2 && dist < 6 ? 1.6 : 0.4; break;
        case 'counter': w = 0.2; break;
        case 'mode': w = f.mode ? 0 : 2.5; break;
      }
      opts.push([slot, w * this.show.bias(specialId(m))]);
    }
    const total = opts.reduce((a, [, w]) => a + w, 0);
    let r = Math.random() * total;
    for (const [slot, w] of opts) if ((r -= w) <= 0) return slot;
    return 'neutral';
  }

  useSpecial(slot) {
    this.spSlot = slot;
    this.setPlan('useSpecial', 10);
  }

  // Their energy is coming: at its level's special rate (x0.6, more while the player hasn't seen a beam clash), fire an
  // energy move of ours into it so the two meet (Game.checkEnergyClash, ADR 0027). A rush only meets a shot. Only when
  // a clash can still start (canBeamClashNow: no cooldown, not too close, they can be locked): otherwise the answer
  // can't clash and just eats the hit. `sure`: cued by the show director. Returns true when it went for it.
  answerEnergy(f, vsRush = false, sure = false) {
    if ((f.busy && f.state !== 'air') || this.plan === 'useSpecial' || !canBeamClashNow(f, 5)) return false;
    const list = (f.state === 'air' ? airEnergyMoves(f.def) : energyMoves(f.def)).filter((e) => f.ki >= e.cost && !(vsRush && e.kind === 'rush'));
    if (!list.length || !this.show.tools.beamClash || (!sure && Math.random() >= this.L.special * 0.6 * this.show.bias('beamClash'))) return false;
    const e = list[Math.floor(Math.random() * list.length)];
    if (f.state === 'air') { this.spSlot = 'air'; this.setPlan('useSpecial', 10); } else this.useSpecial(e.slot);
    return true;
  }

  // their energy is on its way: an energy special starting or running (a shot until it leaves the hand, a Rasengan
  // until its run ends), or their energy shot in flight heading at us
  energyComing(f, o) {
    const m = o.state === 'attack' ? o.move : null;
    if (isEnergy(m) && o.t >= 2 && (m.kind === 'shot' ? o.t < m.startup : !o.moveHit && o.t < m.startup + m.active)) return true;
    return !!incomingEnergy(f);
  }

  // the ki the opponent needs to answer with its cheapest ground energy special (a rush can only meet a shot)
  answerKi(o, vsRush) {
    return Math.min(Infinity, ...energyMoves(o.def).filter((e) => !(vsRush && e.kind === 'rush')).map((e) => e.cost));
  }

  // BEAM CLASH on the show director's cue (CPU vs CPU, showDirector.js, ADR 0027), at every level: the challenger picks
  // an energy special the other can answer and plays 'challenge'; the answerer keeps a gap it can answer from (the
  // answer itself is in update). Short of ki, either powers up first. False: nothing to do, choose as usual.
  cueChoose(dist, f, o) {
    const R = Math.random;
    if (this.cue === 'challenge') {
      const theirShot = energyMoves(o.def).some((e) => e.kind === 'shot');
      const list = energyMoves(f.def).filter((e) => e.kind === 'shot' || theirShot);
      if (!list.length) return false;
      const can = list.filter((e) => f.ki >= e.cost);
      if (!can.length) { this.setPlan(dist > 2.6 ? 'charge' : 'retreat', dist > 2.6 ? 60 : 24); return true; }
      this.cueMove = can[Math.floor(R() * can.length)];
      this.setPlan('challenge', 90);
      return true;
    }
    const need = this.answerKi(f, false);
    if (need === Infinity) return false; // no ground energy special to answer with
    if (f.ki < need) { this.setPlan(dist > 2.6 ? 'charge' : 'retreat', dist > 2.6 ? 60 : 24); return true; }
    this.setPlan(dist < 3.8 ? 'retreat' : 'strafe', 20 + R() * 20);
    return true;
  }

  dodge() {
    this.strafe = Math.random() < 0.5 ? 1 : -1;
    this.setPlan('strafe', 18);
    this.press('dash', 2);
  }

  // air dodge away from (dir = world direction to the opponent, flipped) whatever is coming
  airDodge(toOpp) {
    this.wd = [-toOpp.x, -toOpp.y];
    this.setPlan('airDodge', 4);
  }

  // wavedash along world direction (x, z), then carry on with plan `next`
  wavedash(x, z, next = 'idle') {
    this.wd = [x, z];
    this.wdNext = next;
    this.setPlan('wavedash', 10);
  }

  // frames until the threat we're answering lands: a projectile's flight, or the opponent's attack startup
  threatIn(o) {
    const p = this.tgtProj, f = this.f;
    if (p) {
      if (p.dead) return -99;
      const d = Math.hypot(p.pos.x - f.pos.x, p.pos.z - f.pos.z) - (p.P.radius + 0.4);
      return (d / (Math.hypot(p.vel.x, p.vel.z) || 1)) * 60;
    }
    return o.state === 'attack' && o.move ? reachT(o, o.move) - o.t + o.hitstop : -99; // to the drawn strike (reachT)
  }

  setPlan(p, len = 40) {
    this.plan = p;
    this.planT = 0;
    this.planLen = len;
    this.wait = len;
    this.hopped = false;
  }

  choose(dist, f, o) {
    const L = this.L, R = Math.random;
    // Whirlwind answers every strike: back off and let it run out (the Hard CPU usually does)
    if (o.reflex && dist < 3.4 && R() < L.guard) {
      this.setPlan('retreat', 30 + R() * 30);
      return;
    }
    const ult = f.ki >= ULTIMATE.cost;
    const saving = f.ki >= 180 && !ult;
    const kitted = !!f.def.kit; // fighters with a full kit show it off more often
    if (o.state === 'down' || o.state === 'getup') {
      this.setPlan(!ult && R() < L.charge + 0.2 ? 'charge' : 'strafe', 40 + R() * 30);
      return;
    }
    if (this.cue && this.cueChoose(dist, f, o)) return;
    // 3 bars: split evenly between the second super and the ultimate (a beam wants some distance)
    const K = kitOf(f.def), S = SUPERS[K.super], U = SUPERS[K.ultimate], sh = this.show;
    if (ult) {
      // the one the player hasn't seen yet is likelier (Showcase)
      const pick = pickW({
        super: S && (!S.range || dist < S.range) ? 0.45 * sh.bias('super') : 0,
        ultimate: ultimateFits(U, dist, Math.abs(f.laneOffsets().sd)) ? (0.35 + 0.2 * L.aggro) * sh.bias(U ? 'ultimate' : 'beam') : 0,
        wait: 0.2 + 0.25 * (1 - L.aggro),
      });
      if (pick === 'super' || pick === 'ultimate') return this.setPlan(pick, 5);
    }
    const kitty = 1 + 0.6 * L.show; // levels with more showcase push spend more of their ki on the kit
    if (dist < 1.7) {
      // Smash neutral (ADR 0042) now and then: a tilt poke, a short-hop aerial, a back air after running off
      const sm = pickW({
        poke: 0.18 * Math.sqrt(sh.bias('dTilt')), hop: 0.08 * Math.sqrt(sh.bias('nair')),
        bair: roomAlong(f.pos, -towardSide(f), f.game.basis.right) > 2 ? 0.05 * Math.sqrt(sh.bias('bair')) : 0, none: 0.69,
      });
      if (sm === 'poke') { this.pokeMove = R() < 0.6 ? 'dTilt' : 'fTilt'; return this.setPlan('poke', 30); }
      if (sm === 'hop' || sm === 'bair') return this.setPlan(sm, 40);
      if (R() < L.aggro) return this.setPlan('combo', 70);
      if (R() < 0.3) return this.setPlan('heavy', 5);
      return this.setPlan(R() < 0.5 ? 'retreat' : 'guard', 20 + R() * 20);
    }
    if (dist < 5) {
      const r = R();
      if (dist < 3 && R() < 0.2 * Math.sqrt(sh.bias('fair'))) return this.setPlan('hop', 40); // a short-hop forward air in
      if (f.ki >= 100 && !saving && r < L.special * (kitted ? kitty : 0.6)) return this.setPlan('special', 30);
      // a wavedash in or out now and then (the plan after it carries on from wherever the slide ends)
      if (dist > 2.2 && R() < L.wavedash * Math.sqrt(sh.bias('wavedash'))) {
        const away = R() < 0.35;
        const d = new THREE.Vector2(o.pos.x - f.pos.x, o.pos.z - f.pos.z).normalize().multiplyScalar(away ? -1 : 1);
        return this.wavedash(d.x, d.y, away ? 'strafe' : 'approach');
      }
      if (saving && r < 0.35) return this.setPlan('retreat', 30);
      if (r < 0.22) return this.setPlan('dashIn', 4);
      if (r < 0.36) return this.setPlan('jumpAttack', 50);
      if (r < 0.48) return this.setPlan('strafe', 20 + R() * 25);
      return this.setPlan('approach', 50);
    }
    const r = R();
    if (!ult && r < L.charge * (saving ? 0.95 : 0.45)) return this.setPlan('charge', 60 + R() * 80);
    if (r < L.dash * 0.6) return this.setPlan('superDash', 45);
    if (kitted && f.ki >= 100 && !saving && r < (0.3 + L.special * 0.5) * kitty) return this.setPlan('special', 40);
    if (f.ki >= 50 && !saving && r < 0.6) return this.setPlan('projectile', 45);
    if (f.ki >= 100 && !saving && r < 0.6 + L.special * 0.3) return this.setPlan('special', 40);
    if (r < 0.7) return this.setPlan('dashIn', 4);
    return this.setPlan('approach', 50);
  }
}

// Training dummy: stand still, hold guard, hop, or fight back like the CPU. Whatever its mode, it plays a rhythm
// clash with the timing of `clashLevel` (any CPU level; the lab picks it, Normal by default).
export class DummyBrain {
  constructor(fighter, mode = 'stand', clashLevel = 'normal') {
    this.f = fighter;
    this.aimsNormals = true; // fighting back it plays the Normal CPU, which aims its normals (ADR 0042)
    this.cpu = new CpuBrain(fighter, 'normal');
    this.clashBrain = clashLevel === 'normal' ? this.cpu : makeBrain(fighter, clashLevel);
    this.timed = new TechTimer(1, 0); // DUMMY TECH 'timed': every techable impact, pressed mid-window (ADR 0028)
    this.t = 0;
    this.setMode(mode);
  }

  setMode(mode) {
    this.mode = mode;
  }

  update(game) {
    if (game.clash) return this.clashBrain.update(game);
    if (this.mode === 'cpu') return this.cpu.update(game);
    const f = this.f, pad = f.pad, R = Math.random;
    pad.tick();
    this.t++;
    const juggled = f.state === 'launched' && f.airStun <= 0;
    // combo escape options (ADR 0022, game.dummyOpts): `tech` 'hold' holds Guard through every launch (tech at the
    // first gap, roll on landing), 'random' half the launches with a random direction, 'timed' the timed impact tech
    // at every floor and wall impact with a random option (ADR 0028); `burst` bursts at hit 3
    const O = game.dummyOpts ?? {};
    const tt = O.tech === 'timed' ? this.timed.plan(f, towardSide(f)) : null;
    if (f.state !== 'launched') this.techRoll = null;
    else if (this.techRoll == null) {
      this.techRoll = O.tech === 'hold' || (O.tech === 'random' && R() < 0.5);
      this.techStick = O.tech === 'random' ? [[0, 0], [-1, 0], [1, 0], [0, 1], [0, -1]][Math.floor(R() * 5)] : [0, 0];
    }
    const holdTech = f.state === 'launched' && this.techRoll;
    const burst = !!O.burst && f.combo >= 3 && f.canBurst();
    const stick = holdTech ? this.techStick : [0, 0];
    if (tt?.mx != null) pad.setMove(tt.mx, tt.my);
    else pad.setMove(stick[0] * towardSide(f), stick[1]);
    pad.dashDir = null;
    pad.set('light', false);
    pad.set('heavy', false);
    pad.set('special', burst);
    pad.set('dash', false);
    // GUARD lets go for the whole launch: a held Guard techs at the first gap and rolls on landing (DUMMY TECH's job)
    pad.set('guard', (this.mode === 'guard' && f.state !== 'launched') || holdTech || burst || tt?.guard === 'press');
    // (HOP: a full hop, Jump held through the squat; a juggled dummy's taps are air techs)
    pad.set('jump', (this.mode === 'jump' && this.t % 70 < FULL_HOP) || (juggled && this.mode !== 'stand' && this.t % 20 < 2));
  }
}
