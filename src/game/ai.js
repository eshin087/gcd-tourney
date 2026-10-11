import * as THREE from 'three';
import { ULTIMATE, VANISH, SUPERS } from './moves.js';
import { specialFor, kitOf, towardSide, clashable } from './kit.js';
import { BeatPlan } from './clash.js';

// Where each ultimate kind makes sense (ADR 0017): the beam and Hollow Purple want room, the Four-Tails pounce
// has a reach and wants their lane, Whirlwind wants them close enough to swing at it, the rest fire anywhere.
function ultimateFits(U, dist, sd) {
  if (!U || U.kind === 'orb') return dist > 2.6;
  if (U.kind === 'rampage') return dist < (U.range ?? 8) - 0.6 && sd < 1;
  if (U.kind === 'reflex') return dist < 4;
  return true;
}
import { MasterBrain } from './aiMaster.js';
import { reachT } from './aiDefense.js';
import { Showcase, specialId, pickW } from './aiShow.js';

export const CPU_LEVELS = ['easy', 'normal', 'hard', 'insane', 'impossible'];

// One brain per CPU side. IMPOSSIBLE is its own frame-data brain (aiMaster.js, ADR 0014); in CPU vs CPU it
// plays the louder 'showman' style so a spectated fight keeps moving.
export function makeBrain(fighter, level = 'normal', spectate = false) {
  // INSANE is the same frame-data brain with human reactions and the odd dropped combo (STYLES.insane)
  if (level === 'impossible' || level === 'insane') return new MasterBrain(fighter, spectate ? 'showman' : level);
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
const LEVELS = {
  easy: { beat: { sd: 6.5, miss: 0.16 }, react: 24, guard: 0.18, aggro: 0.45, combo: 0.35, special: 0.15, dodge: 0.15, charge: 0.35, tech: 0.02, techHold: 0.05, burst: 0, vanish: 0.05, dash: 0.2, show: 0.3, parry: 0.04, slop: 5, spot: 0.05, airDodge: 0.05, wavedash: 0.03 },
  normal: { beat: { sd: 4.5, miss: 0.08 }, react: 14, guard: 0.42, aggro: 0.65, combo: 0.75, special: 0.3, dodge: 0.35, charge: 0.5, tech: 0.06, techHold: 0.2, burst: 0.04, vanish: 0.18, dash: 0.35, show: 0.5, parry: 0.12, slop: 3, spot: 0.15, airDodge: 0.15, wavedash: 0.12 },
  hard: { beat: { sd: 3, miss: 0.04 }, react: 7, guard: 0.7, aggro: 0.8, combo: 1.0, special: 0.45, dodge: 0.6, charge: 0.55, tech: 0.12, techHold: 0.45, burst: 0.12, vanish: 0.35, dash: 0.5, show: 0.7, parry: 0.28, slop: 2, spot: 0.3, airDodge: 0.35, wavedash: 0.25 },
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
  }

  // only from a released state, so every press is a fresh edge
  press(name, frames = 2) {
    if (this.hold[name] === undefined || this.hold[name] === -1) this.hold[name] = frames;
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
    let mx = 0, my = 0;
    const R = Math.random;
    const dx = o.pos.x - f.pos.x, dz = o.pos.z - f.pos.z;
    const dist = Math.hypot(dx, dz);
    const toOpp = new THREE.Vector2(dx, dz).normalize();
    const moveWorld = (vx, vz) => {
      const r = game.cam.right, fw = game.cam.fwd;
      mx = vx * r.x + vz * r.z;
      my = vx * fw.x + vz * fw.z;
    };
    // 2.5D lanes: line up in depth and stand ~1.1 units beside them on screen
    const { sx, sd } = f.laneOffsets();
    const laneGo = () => {
      const R = game.cam.right, F = game.cam.fwd;
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

      // --- air tech when juggled
      if (f.state === 'launched' && f.airStun <= 0 && f.pos.y > 0.4 && R() < L.tech) this.press('jump', 1);
      // --- combo escape (ADR 0022): hold Guard through a launch (tech at the first gap, or roll on landing), and
      // now and then burst out of a combo
      if (f.state !== 'launched' && f.state !== 'hitstun') this.techHold = this.burstRoll = null;
      else {
        if (this.plan === 'charge') { this.hold.special = 0; this.setPlan('idle', 10); } // a hit ends the charge: let go of Special
        if (f.state === 'launched' && this.techHold == null) this.techHold = R() < L.techHold;
        if (this.techHold) this.hold.guard = 2;
        if (this.burstRoll == null && f.combo >= 3) this.burstRoll = R() < L.burst ? 3 + Math.floor(R() * 3) : 0; // at hit 3-5
        if (this.burstRoll && f.combo >= this.burstRoll && f.canBurst()) { this.hold.guard = 3; this.press('special', 2); this.burstRoll = 0; }
      }
      // --- throw break (ADR 0015): Light + Heavy once, at its reaction time, if the guard roll says so
      if (f.state === 'held' && f.grab && f.grab.t === Math.min(10, Math.max(4, L.react - 3)) && R() < L.guard * 0.6) { this.press('light'); this.press('heavy'); }

      // --- combo execution: react to our own hits
      if (f.state === 'attack' && f.move) this.comboStep(f, o, R);
      else if (f.state === 'air' && f.chase > 0 && !f.airAttack && f.distTo() < 2.2) this.press('light');

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
          if (f.state === 'air' && !f.airDodged && R() < L.airDodge * sh.bias('airDodge')) this.airDodge(toOpp);
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
        case 'jumpAttack':
          if (this.planT === 1) { moveWorld(toOpp.x, toOpp.y); this.press('jump', 2); }
          else if (f.air) {
            moveWorld(toOpp.x, toOpp.y);
            if (f.vel.y < 3 && dist < 2.6 && !f.airAttack) this.press(R() < 0.6 ? 'light' : 'heavy');
          }
          if (this.planT > 50) this.setPlan('idle', 10);
          break;
        case 'projectile':
          if (this.planT === 1) this.press('jump', 2);
          if (f.air && f.vel.y < 4 && !f.airAttack) this.press('special', 2);
          if (this.planT > 45) this.setPlan('idle', 20);
          break;
        case 'charge':
          this.hold.special = 2;
          if (f.ki >= ULTIMATE.cost - 1 || dist < 2.4 || this.planT > this.planLen) { this.hold.special = 0; this.setPlan('idle', 10); }
          break;
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
    }
    pad.setMove(mx, my);
    pad.dashDir = null; // laneGo flicks the stick on/off: never let that read as a double-tap dash
    for (const name of ['light', 'heavy', 'special', 'jump', 'guard', 'dash', 'super']) {
      const h = this.hold[name] ?? -1;
      pad.set(name, h > 0);
      this.hold[name] = h > 0 ? h - 1 : -1;
    }
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
      if (R() < L.aggro) return this.setPlan('combo', 70);
      if (R() < 0.3) return this.setPlan('heavy', 5);
      return this.setPlan(R() < 0.5 ? 'retreat' : 'guard', 20 + R() * 20);
    }
    if (dist < 5) {
      const r = R();
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
    this.cpu = new CpuBrain(fighter, 'normal');
    this.clashBrain = clashLevel === 'normal' ? this.cpu : makeBrain(fighter, clashLevel);
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
    // first gap, roll on landing), 'random' half the launches with a random direction; `burst` bursts at hit 3
    const O = game.dummyOpts ?? {};
    if (f.state !== 'launched') this.techRoll = null;
    else if (this.techRoll == null) {
      this.techRoll = O.tech === 'hold' || (O.tech === 'random' && R() < 0.5);
      this.techStick = O.tech === 'random' ? [[0, 0], [-1, 0], [1, 0], [0, 1], [0, -1]][Math.floor(R() * 5)] : [0, 0];
    }
    const holdTech = f.state === 'launched' && this.techRoll;
    const burst = !!O.burst && f.combo >= 3 && f.canBurst();
    const stick = holdTech ? this.techStick : [0, 0];
    pad.setMove(stick[0] * towardSide(f), stick[1]);
    pad.dashDir = null;
    pad.set('light', false);
    pad.set('heavy', false);
    pad.set('special', burst);
    pad.set('dash', false);
    // GUARD lets go for the whole launch: a held Guard techs at the first gap and rolls on landing (DUMMY TECH's job)
    pad.set('guard', (this.mode === 'guard' && f.state !== 'launched') || holdTech || burst);
    pad.set('jump', (this.mode === 'jump' && this.t % 70 < 3) || (juggled && this.mode !== 'stand' && this.t % 20 < 2));
  }
}
