// IMPOSSIBLE CPU (ADR 0014). A frame-data-aware brain built to show what the engine allows: it reads the
// opponent's move, frame and position (what a player sees on screen, never their pad), times parries,
// spot dodges and air dodges, punishes whiffs and blocked big moves, runs each kit's max-damage route
// with a lethal check, spaces with wavedashes and times meaty attacks on wake-up.
// It still only presses buttons on its Pad (design pillar 4). Fairness lives in STYLES: it only "sees" an
// attack after `react` frames (a 5-frame jab is a guess, like for a human), it goes for a parry only part
// of the time, and it has habits a player can learn. CPU vs CPU runs the louder 'showman' style so a
// spectated fight keeps moving and the big moves come out.
import { MOVES, ULTIMATE, VANISH, SUPERS, DEFENSE, SUPER_DASH, PROJECTILES, THROW } from './moves.js';
import { specialFor, kitOf, clashable, mergeOf, roarOf } from './kit.js';
import { BeatPlan } from './clash.js';
import { ARENA_LIMIT } from './constants.js';
import { Showcase, specialId, pickW } from './aiShow.js';
import { mixDefense, reachT } from './aiDefense.js';

const BUTTONS = ['light', 'heavy', 'special', 'jump', 'guard', 'dash', 'super'];
const SLOTS = ['neutral', 'forward', 'up', 'down', 'back'];
const PARRY = DEFENSE.parry, SPOT = DEFENSE.spotDodge, WD = DEFENSE.wavedash;
// screen distance a light1 reliably connects from (hit boxes come from the art: ~1.25 on the packs)
const LIGHT_REACH = 1.25;
const THROWABLE_NOW = new Set(['guard', 'idle', 'run', 'land', 'charge', 'wavedash']); // states worth throwing at
const DASH_LIGHT_REACH = 1.55; // the light out of a dash lunges further

// react   frames before it knows an attack started (humans: ~15; its fastest answer to a 5-frame jab is a guess)
// parry   chance to go for a parry when a blockable attack it saw is coming (else dodge / block / counter)
// dodge   chance to spot dodge / air dodge a big move instead of blocking it
// aggro   how much it wants to be in your face; flair: how often it spends on the loud option (vanish,
//         supers as enders, counter-beams); tech: chance to air tech at the first legal frame
// throw   how keen it is to throw a guarding opponent; throwBreak: chance to break a throw inside the window
// show    how strongly it reaches for tools the viewer hasn't seen yet (Showcase, aiShow.js, ADR 0016)
// cap     combo hits after which it cashes out with an ender instead of extending (0 = never: max damage)
// hoard   how often a round is spent saving meter for a three-bar finish
// block   weight of a plain block among its answers to a threat it saw (the others: parry, dodges, counters...)
// drop    chance that a combo is dropped after its first couple of hits (a missed link, like a person's)
// beat    its rhythm-clash timing (clash.js cpuPlan): `sd` frames of error per press, `miss` = notes it skips
// burst   chance per combo (3+ hits, ki and the round's burst in hand) that it bursts out (×1.5 when low on
//         health or when the attacker sits on three bars); bait: chance per combo that it stops its own combo and
//         guards against a victim who could burst (ADR 0022)
export const STYLES = {
  // INSANE, between HARD and IMPOSSIBLE: the same reads at a person's reaction time (12 f), fewer parries, dodges,
  // techs and throw breaks, and some dropped combos
  insane: { beat: { sd: 2.6, miss: 0.03 }, react: 12, parry: 0.28, dodge: 0.3, aggro: 0.65, flair: 0.35, tech: 0.5, wavedash: 0.3, antiAir: 0.5, throw: 0.3, throwBreak: 0.3, show: 0.35, cap: 0, hoard: 0.6, block: 1, drop: 0.15, burst: 0.15, bait: 0 },
  impossible: { beat: { sd: 1.6, miss: 0.012 }, react: 7, parry: 0.5, dodge: 0.4, aggro: 0.7, flair: 0.45, tech: 0.85, wavedash: 0.55, antiAir: 0.75, throw: 0.4, throwBreak: 0.55, show: 0.35, cap: 0, hoard: 1, block: 1, burst: 0.3, bait: 0.25 },
  showman: { beat: { sd: 2.2, miss: 0.02 }, react: 6, parry: 0.55, dodge: 0.55, aggro: 0.6, flair: 0.9, tech: 0.7, wavedash: 0.35, antiAir: 0.6, throw: 0.45, throwBreak: 0.45, show: 1, cap: 5, hoard: 0.15, block: 0.35, burst: 0.35, bait: 0.3 },
};
// Defense showcase knobs (ADR 0025), merged into STYLES below; a style without one reads it as 0 (off).
// defPersona  strength of the per-match defense persona (aiShow.js): 1 = as is; below 1 it only changes which
//             advanced answer comes out, never how often one does (the weights are normalized)
// read        chance per approach to guess it (parry, dodge, backstep, wavedash out, jump out, stuff it with a jab)
// stringRead  chance per blocked string hit to guess the next one (parry it, guard-cancel vanish, step out)
// gapEscape   chance per hit stun / wake-up to reverse at its end (parry, dodge, backstep): beats only a gap
// escape      chance to escape right after an air tech (air dodge away / through, waveland, vanish, super dash)
// rally       weight of a flashy, non-guaranteed parry punish (a raw special, a vanish or a heavy timed to land after
//             their stagger, so they can parry it back), rallyMax per exchange; rotate: weight factor per repeat of
//             an answer among its last 4 (so a match rotates them)
// wdDefense / backstep / vanishWar  weights of a defensive wavedash (out of a shot's line), a back dash through a
//             melee swing (8 invulnerable frames) and a counter-vanish against a vanish
const DEF_KNOBS = {
  insane: { defPersona: 0.4 },
  impossible: { defPersona: 0.4 },
  showman: { defPersona: 1, read: 0.5, stringRead: 0.5, gapEscape: 0.6, escape: 0.5, rally: 2, rallyMax: 3, rotate: 0.5, wdDefense: 0.8, backstep: 0.8, vanishWar: 2 },
};
for (const k in DEF_KNOBS) Object.assign(STYLES[k], DEF_KNOBS[k]);
// which persona column scales each answer
const PERSONA_OF = { parry: 'parry', dodge: 'dodge', airdodge: 'airdodge', wavedash: 'wavedash', backstep: 'backstep', vanish: 'vanish', vanishWar: 'vanish', counter: 'counter', block: 'block', jumpOut: 'airdodge', stuff: 'read', sidestep: 'wavedash' };
const BURST = DEFENSE.burst;

// forward distance a lunging ground move still covers from frame t (its speed fades out over startup+active)
function lungeLeft(m, t) {
  if (!m.lunge || m.air) return 0;
  const B = m.startup + m.active;
  let d = 0;
  for (let k = Math.max(0, t); k < B; k++) d += (m.lunge * (1 - k / B)) / 60;
  return d;
}

// distance from p to the ring barrier along screen direction s (+1 = screen right)
function roomAlong(p, s, R) {
  const dx = R.x * s, dz = R.z * s;
  let t = 99;
  if (Math.abs(dx) > 1e-3) t = Math.min(t, ((dx > 0 ? ARENA_LIMIT : -ARENA_LIMIT) - p.x) / dx);
  if (Math.abs(dz) > 1e-3) t = Math.min(t, ((dz > 0 ? ARENA_LIMIT : -ARENA_LIMIT) - p.z) / dz);
  return Math.max(0, t);
}

let projIds = 0;

export class MasterBrain {
  constructor(fighter, style = 'impossible') {
    this.f = fighter;
    this.style = STYLES[style] ? style : 'impossible';
    this.S = STYLES[this.style];
    this.hold = {}; // button -> frames left on a tap
    this.fresh = new Set(); // taps that still need their press edge
    this.keep = new Set(); // buttons held down this frame only
    this.mx = 0;
    this.my = 0;
    this.clock = 0;
    this.plan = null;
    this.resp = null; // defensive answer to the current threat
    this.spSlot = null; // stick held for a special input
    this.spT = 0;
    this.beat = null; // its plan for the current clash
    this.oppMove = null; // to give every opponent move a serial (threat identity)
    this.oppSerial = 0;
    this.wake = 0;
    this.techRoll = null;
    this.route = {}; // per-combo choices
    // habits of the opponent, slowly forgotten: what it does after blocking, how often it jumps in, parries
    this.mem = { parries: 0, contacts: 0, jumps: 0, mashAfterBlock: 0, blockAfterBlock: 0 };
    this.lastOppState = '';
    this.show = new Showcase(fighter, this.S.show, this.S.defPersona ?? 0);
  }

  // ------------------------------------------------------------------ pad output
  // press `name` for `frames` frames; a button already held is released for one frame first, so the press
  // is a new edge (parries, vanish and the chains all read edges)
  tap(name, frames = 2) {
    if (this.hold[name] > 0) return;
    this.hold[name] = frames;
    this.fresh.add(name);
  }

  flush() {
    const pad = this.f.pad;
    if (this.spT > 0) {
      this.spT--;
      this.stickFor(this.spSlot);
    }
    pad.setMove(this.mx, this.my);
    pad.dashDir = null; // stick work must never read as a double-tap dash: dashes go through the button
    for (const n of BUTTONS) {
      let want = this.hold[n] > 0 || this.keep.has(n);
      if (this.fresh.has(n) && pad.b[n].down) want = false; // release first, press next frame
      else {
        this.fresh.delete(n);
        if (this.hold[n] > 0) this.hold[n]--;
      }
      pad.set(n, want);
    }
    this.keep.clear();
  }

  // screen-space stick toward a special slot (forward/back follow the opponent, like kit.specialSlot)
  stickFor(slot) {
    const s = this.c?.toward ?? this.f.side;
    this.mx = slot === 'forward' ? s : slot === 'back' ? -s : 0;
    this.my = slot === 'up' ? 1 : slot === 'down' || slot === 'airDown' ? -1 : 0;
  }

  // Hold Special to charge ki. The hold has to reach the charge state (12 frames): let go sooner and the press
  // fires a special, so update() keeps a started hold going until then.
  holdCharge() {
    this.keep.add('special');
    if (this.chargeFrom == null) this.chargeFrom = this.f.pad.frame;
  }

  special(slot, frames = 2) {
    if (this.hold.special > 0) return;
    this.spSlot = slot;
    this.spT = frames + 2;
    this.stickFor(slot);
    this.tap('special', frames);
  }

  // ------------------------------------------------------------------ main loop
  update(game) {
    const f = this.f, o = f.opp;
    f.pad.tick();
    this.mx = 0;
    this.my = 0;
    this.show.watch();
    if (game.state === 'roundIntro' && !this.roundSet) {
      // per-round temperament: whether it saves up for the big three-bar finish this round
      this.roundSet = true;
      this.roundNo = (this.roundNo ?? 0) + 1;
      this.hoarding = Math.random() < this.S.flair * 0.55 * this.S.hoard;
      this.bigUsed = this.bigCount();
      this.plan = null;
      this.resp = null;
      this.route = {};
    } else if (game.state === 'fight') this.roundSet = false;
    if (this.hoarding && this.bigCount() > this.bigUsed) this.hoarding = false; // it spent them: back to normal
    // the showman also holds its bars until it has fired its first three-bar move of the match: spending
    // freely, it would almost never reach three bars (after that it spends freely, and pickBig still prefers
    // the three-bar move the viewer hasn't seen when the bars come round again)
    this.waitClash = this.clashWait(game);
    if (this.waitClash && f.ki >= 300 && o.ki < 300) {
      this.clashFull = (this.clashFull || 0) + 1;
      if (this.clashFull > 600) this.clashGaveUp = this.roundNo; // 10 s at three bars and they never got there
    } else this.clashFull = 0;
    this.saving = this.hoarding || this.waitClash || (this.S.show >= 0.5 && f.ki >= 100 && this.bigCount() === 0);
    if (game.clash) this.playClash(game);
    else if (game.inputLive && !f.ko && !o.ko) this.think(game);
    if (this.chargeFrom != null) {
      if (f.state === 'charge' || !f.spPending || f.pad.frame - this.chargeFrom > 16) this.chargeFrom = null;
      else if (f.state === 'idle' || f.state === 'run' || f.state === 'land') this.keep.add('special');
    }
    this.flush();
  }

  think(game) {
    const f = this.f;
    const c = this.sense(game);
    this.trackOpponent(game, c);
    if (game.freeze > 0) return this.frozen(game, c);
    this.clock++;
    if (this.pendingPunish && this.parryPunish(game, c)) return;
    if (this.recover(game, c)) return;
    if (this.holdBait()) return;
    if (this.ownMove(game, c)) return;
    const th = this.threat(game, c);
    if (th) {
      if (!this.resp || this.resp.key !== th.key) this.resp = this.chooseDefense(game, c, th);
      if (this.execDefense(game, c, th, this.resp)) return;
    } else if (this.resp) {
      // the threat is over: keep the guard a few frames in case the read was early, then let go (at once
      // when they're open, e.g. staggered by our parry: Guard state ignores attack buttons)
      const open = this.opening(f.opp);
      if (!open && this.clock < (this.resp.until ?? 0) && (f.state === 'guard' || f.state === 'block')) { this.keep.add('guard'); return; }
      this.resp = null;
    }
    if (f.state === 'air') return; // airborne with nothing to answer: airStep already steered
    if (f.state === 'block') { this.blockStun(game, c); return; }
    if (this.tickThrow && this.tick(game, c)) return;
    if (this.punish(game, c)) return;
    if (this.situational(game, c)) return;
    this.neutral(game, c);
  }

  sense(game) {
    const f = this.f, o = f.opp, R = game.cam.right, F = game.cam.fwd;
    const rx = o.pos.x - f.pos.x, rz = o.pos.z - f.pos.z;
    const c = this.c || (this.c = {});
    c.R = R;
    c.F = F;
    c.sx = rx * R.x + rz * R.z; // along the screen
    c.sd = rx * F.x + rz * F.z; // in depth
    c.dy = o.pos.y - f.pos.y;
    c.dist = Math.hypot(rx, rz);
    c.toward = Math.abs(c.sx) > 0.12 ? Math.sign(c.sx) : f.side;
    c.myRoom = roomAlong(f.pos, -c.toward, R); // room behind us
    c.oppRoom = roomAlong(o.pos, c.toward, R); // room behind them (wall bounce)
    c.ready = this.ready();
    return c;
  }

  // What our fighter can start this frame (the fighter's t advances before it reads the pad).
  ready() {
    const f = this.f, s = f.state, t = f.t + 1;
    if (f.hitstop > 0) return null;
    if (s === 'idle' || s === 'run' || s === 'guard') return 'ground';
    if (s === 'land') return t >= 3 && f.landLag <= 6 ? 'ground' : null;
    if (s === 'wavedash') return t >= WD.act ? 'ground' : null;
    if (s === 'air') return 'air';
    if (s === 'block') return 'block';
    if (s === 'dash') return t >= 4 ? 'dash' : null;
    return null;
  }

  // ------------------------------------------------------------------ memory
  trackOpponent(game, c) {
    const o = this.f.opp, m = this.mem;
    if (o.move !== this.oppMove || (o.state !== this.lastOppState && o.state !== 'attack')) {
      this.oppMove = o.move;
      this.oppSerial++;
    }
    if (o.state !== this.lastOppState) {
      if (o.state === 'jumpSquat') m.jumps = m.jumps * 0.9 + 1;
      if (o.state === 'throw') m.throws = (m.throws || 0) * 0.9 + 1;
      if (this.lastOppState === 'block') {
        // what it does when its block stun ends
        if (o.state === 'attack' || o.state === 'jumpSquat' || o.state === 'dash') m.mashAfterBlock = m.mashAfterBlock * 0.85 + 1;
        else m.blockAfterBlock = m.blockAfterBlock * 0.85 + 1;
      }
    }
    this.lastOppState = o.state;
  }

  // The opponent parried us: remember it, string timing gets mixed up against parry-happy players.
  noteContact(parried) {
    const m = this.mem;
    m.contacts = m.contacts * 0.95 + 1;
    if (parried) m.parries = m.parries * 0.95 + 1;
  }

  get parryHabit() {
    return this.mem.contacts > 2 ? this.mem.parries / this.mem.contacts : 0;
  }

  // ------------------------------------------------------------------ frozen world
  // Super flash, vanish freeze, parry freeze: nothing moves but inputs still buffer. Keep guarding,
  // and right before the world restarts, buffer the punish after a parry.
  // Gotcha: fighters don't update during a freeze, so a press read as a `.pressed` edge (Guard for a parry, Special,
  // the vanish chord, Dash) made now is lost; only buffered() reads (Light, Heavy, Jump, the throw) survive. Anything
  // else has to wait for the first live frame.
  frozen(game, c) {
    const f = this.f, o = f.opp;
    const free = f.state === 'guard' || f.state === 'idle';
    // the showman varies its parry punish (ADR 0025), picked once per parry: what buffers (jab, heavy, throw) is
    // pressed now, a vanish or a rally special on the first live frame (parryPunish)
    if (this.S.rally && free && o.state === 'held' && !o.grab && f.parries !== (this.punKey ?? 0)) {
      this.punKey = f.parries;
      this.pendingPunish = this.pickParryPunish(c);
      if (this.pendingPunish) this.resp = null;
    }
    const pp = this.pendingPunish;
    if (pp && pp.buffered) {
      if (game.freeze <= 3) {
        if (pp.type === 'throw') this.throwNow();
        else { this.tap(pp.type === 'heavy' ? 'heavy' : 'light', 2); this.route = {}; }
        this.show.logDef('punish:' + pp.type, true);
        this.pendingPunish = null;
      }
      return;
    }
    if (pp) return; // a vanish or a rally waits for the first live frame
    const punish = o.state === 'held' && o.heldT > 6 && c.dist < LIGHT_REACH + 0.6 && free;
    if (punish) {
      // let go of Guard (Guard state ignores attacks) and buffer the jab for the first live frame
      this.resp = null;
      if (game.freeze <= 3) {
        this.tap('light', 2);
        this.route = {};
      }
      return;
    }
    if (f.state === 'guard' || f.state === 'block') this.keep.add('guard');
  }

  // ------------------------------------------------------------------ getting hit, knocked down
  recover(game, c) {
    const f = this.f, S = this.S;
    if (f.state !== 'launched') this.techRoll = null;
    if (f.state !== 'launched' && f.state !== 'hitstun') this.burstPlan = null;
    if (f.state !== 'down') this.wake = 0;
    if (!f.grab) this.breakRoll = null;
    if (this.rev && this.reversal(c)) return true;
    switch (f.state) {
      case 'launched':
        if (this.techRoll === null) {
          this.techRoll = Math.random() < S.tech;
          // where to: mostly back, over to their side when they're close, straight down, or up in place (the
          // defense persona leans it: a dancer hops away, a scrapper over them, a rock drops to the floor)
          const P = (k) => this.show.pm(k);
          this.techDir = pickW({ back: 0.5 * P('airdodge'), toward: (c.dist < 2.5 ? 0.2 : 0.05) * P('read'), down: 0.2 * P('block'), up: 0.1 * P('escape') });
        }
        // hold Guard to tech at the first gap, or roll on landing (ADR 0022); else ride it out and tap a late tech
        if (this.techRoll) {
          this.keep.add('guard');
          const d = this.techDir;
          this.mx = d === 'back' ? -c.toward : d === 'toward' ? c.toward : 0;
          this.my = d === 'up' ? 1 : d === 'down' ? -1 : 0;
        } else if (f.airStun <= 0 && f.pos.y > 0.4 && !f.heldT && f.pos.y < 1.2) this.tap('jump', 1);
        this.burstOut(c);
        return true;
      case 'down':
        // vary the wake-up so meaty timing is a guess
        if (!this.wake) this.wake = 16 + Math.floor(Math.random() * 16);
        if (f.t >= this.wake && !f.ko) this.tap('light', 1);
        return true;
      case 'hitstun':
        this.burstOut(c);
        if (this.gapEscape(c)) return true;
        // block the moment the stun ends if they're still on top of us
        if (f.t >= f.stun - 2 && c.dist < 2.5) this.keep.add('guard');
        return true;
      case 'block':
        return this.stringRead(game, c);
      case 'burst':
      case 'techRoll':
        return true;
      case 'held':
        if (f.grab) {
          // grabbed: break it on reaction (decided once per grab), Light + Heavy inside the window
          if (this.breakRoll == null) { this.breakRoll = Math.random() < S.throwBreak; this.breakAt = 5 + Math.floor(Math.random() * 6); }
          if (this.breakRoll && f.grab.t + 1 >= this.breakAt) { this.tap('light', 2); this.tap('heavy', 2); }
        }
        return true;
      case 'airRecover':
        this.teched = true;
        return true;
      case 'getup':
        this.wakeRead(c);
        return true;
      case 'vanish':
      case 'beamCharge':
      case 'beamFire':
      case 'clash':
      case 'dodge':
      case 'jumpSquat':
      case 'intro':
      case 'win':
        if (f.state === 'jumpSquat' && this.wdDir) { this.mx = this.wdDir[0]; this.my = this.wdDir[1]; }
        return true;
      case 'kit':
        return true;
      case 'airDodge':
        return true;
      case 'wavedash':
        return f.t + 1 < WD.act;
      case 'land':
        return !(f.t + 1 >= 3 && f.landLag <= 6);
    }
    return false;
  }

  // Burst out of a combo (ADR 0022): decided once per combo at its 3rd hit, pressed then or a hit later, likelier
  // when low on health or when the attacker sits on three bars (the combo would end in a super); the showman
  // also leans toward it while the viewer hasn't seen one (Showcase).
  burstOut(c) {
    const f = this.f, o = f.opp;
    if (this.burstPlan == null && f.combo >= 3 && f.ki >= BURST.cost && f.burstUsed < BURST.perRound) {
      const k = (f.hp < 350 || o.ki >= 300 ? 1.5 : 1) * (this.S.show >= 0.5 ? Math.sqrt(this.show.bias('burst')) : 1) * this.show.pm('escape');
      this.burstPlan = Math.random() < (this.S.burst ?? 0) * k ? f.combo + Math.floor(Math.random() * 2) : 0;
    }
    if (this.burstPlan && f.combo >= this.burstPlan && f.canBurst()) {
      this.keep.add('guard');
      this.tap('special', 2);
      this.burstPlan = 0;
    }
  }

  // Burst bait (ADR 0022): their burst would blow us away mid-combo, so now and then (decided once per combo, on
  // the ground) stop the combo after a hit and guard; a blocked burst leaves them open (opening: 'burst').
  baitBurst() {
    const f = this.f, o = f.opp, R = this.route;
    if (R.bait === undefined) {
      if (R.baitAt === undefined) R.baitAt = 3 + Math.floor(Math.random() * 3); // the hit it may stop after
      if (o.combo < R.baitAt || f.air) return false;
      R.bait = o.burstUsed < BURST.perRound && o.ki >= BURST.cost && Math.random() < (this.S.bait ?? 0);
      if (R.bait) this.baitUntil = this.clock + 50;
    }
    return !!R.bait;
  }

  // While baiting: hold Guard until the burst comes (and let go to punish its recovery) or the moment passes.
  holdBait() {
    const f = this.f, o = f.opp;
    if (!(this.clock < this.baitUntil)) return false;
    if (o.state === 'burst' && o.t >= BURST.startup + BURST.active) { this.baitUntil = 0; return false; }
    if (!['idle', 'run', 'guard', 'block', 'land'].includes(f.state)) return false;
    this.keep.add('guard');
    return true;
  }

  // ------------------------------------------------------------------ our own moves: routes and strings
  ownMove(game, c) {
    const f = this.f, o = f.opp;
    if (f.state === 'attack' && f.move) {
      this.comboStep(game, c);
      return true;
    }
    if (f.state === 'superDash') {
      // homing in: let the contact hit land on a juggled victim; in neutral, cancel into a light up close
      const d3 = Math.hypot(c.dist, c.dy);
      if (f.t + 1 >= 6 && d3 < 1.6 && o.hittable && o.state !== 'launched' && o.state !== 'hitstun') this.tap('light');
      return true;
    }
    if (f.state === 'charge') {
      // stop charging when they get close or start something
      const danger = c.dist < 4.2 || o.state === 'attack' || o.state === 'superDash' || game.projectiles.some((p) => p.owner === o);
      if (!danger && f.ki < (this.plan?.kiGoal ?? 300) - 1) this.keep.add('special');
      return true;
    }
    if (f.state === 'air') return this.airStep(game, c);
    return false;
  }

  // Airborne and free: keep juggles going, air dodge out of anti-airs (threat layer), come down safely.
  airStep(game, c) {
    const f = this.f, o = f.opp;
    const juggle = o.state === 'launched' && !o.ko && o.hittable;
    const d3 = Math.hypot(c.sx, c.dy);
    const R = Math.random, showy = this.S.show >= 0.5;
    if (juggle && f.moveHit && this.capped()) return true; // the showman's combo is over: drop down, play neutral
    if (f.chase > 0 || (juggle && f.moveHit)) {
      // after a launcher chase or a super dash contact: first air hit when the victim is in reach
      if (!f.airAttack && juggle && d3 < 1.5 && Math.abs(c.sd) < 0.7) {
        this.tap('light');
        return true;
      }
      if (f.airAttack && juggle && f.airDashes === 0 && d3 < 5) {
        this.tap('dash');
        return true;
      }
      return true;
    }
    // an opponent we can reach in the air with an attack
    if (!f.airAttack && o.hittable && d3 < 1.5 && Math.abs(c.sd) < 0.6 && (o.air || c.dy > -0.6)) {
      this.tap(o.state === 'launched' || Math.random() < 0.6 ? 'light' : 'heavy');
      return true;
    }
    // falling onto a grounded opponent from above (a Blink, a high jump-in): the spike reaches down
    if (!f.airAttack && o.hittable && !o.air && Math.abs(c.sx) < 1.3 && Math.abs(c.sd) < 0.6 && c.dy < -0.6 && c.dy > -2.6 && f.vel.y <= 1) {
      this.tap('heavy');
      return true;
    }
    if (this.plan?.name === 'jumpin') {
      this.mx = c.toward;
      // jump-in mix-up: air dodge on the way down, through a launcher, and waveland beside them
      const k = showy ? Math.sqrt(this.show.bias('airDodge')) : 1;
      if (!f.airDodged && f.vel.y < 0 && f.pos.y < 1.7 && Math.abs(c.sx) < 2.6 && R() < this.S.flair * 0.06 * k) this.tap('guard', 2);
    }
    // planned air special: a shot near the top of the jump, a dive once it's over them
    const p = this.plan;
    if (p?.name === 'airShot' && !p.fired && !f.airAttack) {
      const m = specialFor(f.def, p.slot);
      if (!m || f.ki < (m.cost ?? 0)) p.fired = true;
      else if (m.kind === 'dive' ? Math.abs(c.sx) < 2.4 || f.vel.y < 0 : f.vel.y < 3) {
        p.fired = true;
        this.special(p.slot, 2);
        return true;
      }
      if (m?.kind === 'dive') this.mx = c.toward;
    }
    // showman, just teched out of a juggle with them close: an escape, decided once per tech (ADR 0025)
    if (this.teched) {
      this.teched = false;
      this.esc = showy && c.dist < 3.5 ? this.pickEscape() : null;
    }
    if (this.esc && this.airEscape(c)) return true;
    return false; // nothing of ours running: let the threat layer answer what's coming (air dodge)
  }

  comboStep(game, c) {
    const f = this.f, o = f.opp, m = f.move, n = f.moveName;
    if (f.hitstop > 0) return; // presses on live frames, so the buffers line up with the cancel windows
    const t = f.t + 1;
    const A = m.startup, B = A + m.active;
    if (!f.moveHit) {
      this.route.wasBlocked = this.route.wasBlocked || o.state === 'block';
      return this.stringStep(game, c, m, n, t);
    }
    if (t < A) return;
    if (!this.route.counted) {
      this.route.counted = true;
      this.noteContact(false);
      if (this.S.drop && Math.random() < this.S.drop) this.route.dropAt = 2 + Math.floor(Math.random() * 2);
    }
    if (this.route.dropAt && o.combo >= this.route.dropAt) return; // missed the link: the combo ends here
    if (this.baitBurst()) return; // stop here and guard: they may burst
    if (!m.special && this.finisher(game, c, m, t)) return;
    switch (n) {
      case 'light1':
      case 'light2':
        if (o.state === 'launched' && o.pos.y > 0.9) { this.tap('heavy'); return; } // popped up: launch them
        if (t >= m.cancel - 1) this.tap('light');
        return;
      case 'light3':
        return this.branchGround(game, c, m, t);
      case 'heavy':
        this.tap('jump'); // chase the launch
        return;
      case 'airLight1':
        if (t >= m.cancel - 1) this.tap('light');
        return;
      case 'airLight2':
        return this.branchAir(game, c, m, t);
      case 'light4':
        // showman: the wall bounce is the moment for a special the viewer hasn't seen (shot, teleport, rush)
        if (this.S.show >= 0.5 && this.afterBounce(c)) return;
      // falls through
      default:
        // launchers, spikes, wall bounces, vanish kicks, rush specials: chase with the super dash,
        // or vanish behind them when the dash is spent; the showman cashes out instead once the combo is
        // long enough, or right after the ender of a short route (only the launcher route chases)
        if (t >= B) {
          if (this.capped() || (this.S.show >= 0.5 && this.route.ground !== 'launch')) this.cashOut(game, c, m);
          else this.extend(game, c);
        }
    }
  }

  // The showman's combo has done its job at `cap` hits (or its short route has ended): from there it ends
  // with something flashy instead of looping super dash -> air string, because a long juggle is the part of
  // a fight with nothing new to see, and rounds need room for neutral (ADR 0016).
  capped() {
    return (this.S.cap > 0 && this.f.opp.combo >= this.S.cap) || !!this.route.over;
  }

  // light3 on hit: a kit special (ender or extender), the launcher route, or light4 into the wall. IMPOSSIBLE
  // takes the special when it lands in time, else the launcher; the showman picks once per combo, weighted
  // toward the specials the viewer hasn't seen (and away from the launcher once the combo is long).
  branchGround(game, c, m, t) {
    const f = this.f, o = f.opp, R = this.route;
    const sp = o.state === 'hitstun' ? this.comboSpecial(c, o.stun - o.t) : null;
    if (this.S.show >= 0.5 && !R.ground) {
      // short routes first: an air juggle is the longest stretch of a fight with nothing new in it, so the
      // launcher route is the exception (it still shows the air game and the super dash chase)
      R.ground = pickW({
        special: sp ? 2 * this.show.bias(specialId(sp.m)) : 0,
        launch: this.capped() ? 0.1 : 0.55 * Math.sqrt(this.show.bias('superDash')),
        wall: c.oppRoom < 1.2 ? 2 : 1.1,
      }) || 'wall';
    }
    if (sp && (!R.ground || R.ground === 'special') && this.spend(sp.m.cost, sp.value)) {
      this.special(sp.slot, 2);
      R.special = sp.slot;
      return;
    }
    if (R.ground === 'special') R.ground = 'wall'; // no special after all (no ki, or saving it): the short route
    // launcher (more hits, a ground-bounce loop) unless they're right on the wall, where light4 bounces
    if (R.ground === 'wall' || (!R.ground && c.oppRoom < 1.2) || R.l4) {
      R.l4 = true;
      if (t >= m.cancel - 1) this.tap('light');
      return;
    }
    this.tap('heavy');
  }

  // airLight2 on hit: spike for a ground bounce while the super dash is still there to follow it,
  // otherwise airLight3 (wall bounce) when the barrier is close behind them, else spike anyway. Past the
  // showman's cap: a vanish kick it hasn't shown, else either ender at random.
  branchAir(game, c, m, t) {
    const f = this.f, o = f.opp, R = this.route;
    if (this.capped()) {
      if (R.air == null) R.air = pickW({ vanish: f.ki >= VANISH.cost && !R.vanished ? 0.6 * this.show.bias('vanish') : 0, spike: 1, wall: c.oppRoom < 3 ? 1.5 : 0.7 });
      if (R.air === 'vanish' && f.ki >= VANISH.cost) { R.vanished = true; this.keep.add('guard'); this.tap('special', 2); return; }
      if (R.air === 'wall') { if (t >= m.cancel - 1) this.tap('light'); return; }
      this.tap('heavy');
      return;
    }
    const spike = f.airDashes === 0 || c.oppRoom > 4 || o.pos.y > 2.2;
    if (spike) this.tap('heavy');
    else if (t >= m.cancel - 1) this.tap('light');
  }

  // light4 wall bounce (showman): cancel into a special that still catches them in flight, once per combo.
  afterBounce(c) {
    const f = this.f, o = f.opp, R = this.route;
    if (R.special || R.bounceDone || o.state !== 'launched' || o.ko) return false;
    R.bounceDone = true;
    const sp = this.comboSpecial(c, 30, true);
    if (!sp || !this.spend(sp.m.cost, sp.value) || Math.random() > 0.35 + 0.5 * this.S.show * (this.show.fresh(specialId(sp.m)) ? 1 : 0.4)) return false;
    this.special(sp.slot, 2);
    R.special = sp.slot;
    return true;
  }

  // Past the cap: one last flashy hit if a fresh one fits (a vanish kick behind them), then let them fall.
  cashOut(game, c, m) {
    const f = this.f, o = f.opp, R = this.route;
    if (R.cashed || o.state !== 'launched' || o.ko) return;
    R.cashed = true;
    R.over = true;
    if (!R.vanished && f.ki >= VANISH.cost && Math.random() < 0.25 * this.show.bias('vanish') && this.spend(VANISH.cost, 90)) {
      R.vanished = true;
      this.keep.add('guard');
      this.tap('special', 2);
    }
  }

  extend(game, c) {
    const f = this.f, o = f.opp;
    if (o.state !== 'launched' || o.ko) return;
    if (f.airDashes === 0) {
      this.mx = 0;
      this.my = 0;
      this.tap('dash');
      return;
    }
    // super dash spent: vanish behind them (wantsVanish needs Special pressed with Guard down)
    if (f.ki >= VANISH.cost && this.spend(VANISH.cost, 90) && !this.route.vanished) {
      this.route.vanished = true;
      this.keep.add('guard');
      this.tap('special', 2);
    }
  }

  // Our attack whiffed or got blocked: pressure with the string, or stop and let the next layer decide.
  stringStep(game, c, m, n, t) {
    const f = this.f, o = f.opp, R = Math.random;
    const blocked = o.state === 'block' || o.state === 'guard';
    if (!blocked) return; // a whiff: stop pushing buttons, recover
    if (!this.route.blockDecided) {
      this.route.blockDecided = true;
      // continue the string, or stop to frame-trap / bait a parry-happy or mashing player
      const parryish = this.parryHabit;
      const r = R();
      this.route.blockPlan = r < 0.4 - parryish * 0.3 ? 'string' : r < 0.4 + this.S.throw * 0.5 ? 'tick' : R() < 0.5 ? 'stop' : 'vanish';
      if (this.route.blockPlan === 'tick') this.tickThrow = true; // throw them once our move recovers
    }
    const plan = this.route.blockPlan;
    if (plan === 'string' && m.next && n !== 'light3' && t >= m.cancel - 1) this.tap('light');
    else if (plan === 'vanish' && f.ki >= VANISH.cost * 2 && !this.saving && t >= m.startup + m.active && n !== 'heavy') {
      // cross them up out of a blocked string (keeps a bar for defense)
      this.keep.add('guard');
      this.tap('special', 2);
      this.route.blockPlan = 'done';
    }
  }

  // Lethal (or showman) finish at a hit confirm: the second super, a kit ultimate, or a rush special.
  finisher(game, c, m, t) {
    const f = this.f, o = f.opp, K = kitOf(f.def), S = this.S;
    if (f.ki < 100) return false;
    // showman: a three-bar ender, decided once per combo, likelier while the viewer hasn't seen it
    if (S.show >= 0.5 && f.ki >= 300 && o.combo >= 3 && !this.waitClash) {
      if (this.route.big === undefined) this.route.big = this.pickBig(c, true);
      if (this.route.big) {
        this.fireBig(this.route.big);
        this.route.finisher = this.route.big;
        this.route.big = null;
        return true;
      }
    }
    const est = this.finishDamage(c);
    if (!est) return false;
    const kills = o.hp <= est.dmg * 0.9;
    // a showy super mid-combo, unless it saved these bars for the ultimate (a beam at range, a clash)
    const show = f.ki >= 300 && o.combo >= 4 && Math.random() < S.flair * (this.saving ? 0.015 : 0.08);
    if (!kills && !show) return false;
    if (est.how === 'super') this.tap('super');
    else if (est.how === 'ultimate') { this.tap('heavy'); this.tap('special'); }
    else if (est.how === 'special' && !m.air) this.special(est.slot, 2);
    else return false;
    this.route.finisher = est.how;
    return true;
  }

  // The biggest finish we can afford now, with the damage it should do at the current combo scaling.
  finishDamage(c) {
    const f = this.f, o = f.opp, K = kitOf(f.def);
    const scale = (min) => Math.max(min, 1 - o.combo * 0.065) * (f.def.stats.power || 1) * (f.mode?.damage ?? 1) / ((o.def.stats.defense || 1) * (o.mode?.defense ?? 1));
    let best = null;
    const take = (how, dmg, slot) => { if (!best || dmg > best.dmg) best = { how, dmg, slot }; };
    if (f.ki >= 300) {
      const Sp = SUPERS[K.super];
      if (Sp?.kind === 'flurry' && c.dist < (Sp.range ?? 6)) take('super', (Sp.hits * Sp.hitDmg + Sp.finalDmg) * scale(Sp.minScale), null);
      const U = SUPERS[K.ultimate];
      if (U?.kind === 'ignite') take('ultimate', U.dmg * scale(1) + (U.burn.len / U.burn.every) * U.burn.dmg, null);
      if (U?.kind === 'rampage' && c.dist < (U.range ?? 8) - 0.6 && Math.abs(c.sd) < 1) take('ultimate', (U.slams * U.slamDmg + U.finalDmg) * scale(U.minScale ?? 0.9), null);
    }
    const sp = specialFor(f.def, 'neutral');
    const left = o.state === 'hitstun' ? o.stun - o.t : 0;
    if (sp?.kind === 'rush' && f.ki >= sp.cost && !f.move?.air && f.state === 'attack' && this.specialHitTime(sp, c, true) <= left - 1) {
      take('special', sp.dmg * scale(sp.minScale ?? 0.4), 'neutral');
    }
    return best;
  }

  // Showman: which three-bar move to spend now ('super' / 'ultimate' / 'beam'), or null to hold the bars.
  // In a combo only the ones that connect on a reeling victim (flurry in range, Domain, Amaterasu); in neutral
  // and punishes also Kirin and the beam (they need the opponent stuck or far away).
  pickBig(c, inCombo, anyRange = false) {
    const f = this.f, K = kitOf(f.def), sh = this.show;
    if (f.ki < 300) return null;
    const ok = (S) => {
      if (!S) return false;
      if (S.kind === 'flurry') return c.dist < (S.range ?? 6) - 0.6;
      if (S.kind === 'domain' || S.kind === 'ignite') return true;
      // ADR 0017: Hollow Purple wants room and their lane, the Four-Tails pounce its reach and their lane,
      // Whirlwind them close enough to swing at it
      if (S.kind === 'orb') return !inCombo && (anyRange || (c.dist > 2.6 && Math.abs(c.sd) < 1));
      if (S.kind === 'rampage') return c.dist < (S.range ?? 8) - 0.6 && (anyRange || Math.abs(c.sd) < 1);
      if (S.kind === 'reflex') return !inCombo && (anyRange || c.dist < 4.5);
      return !inCombo && S.kind === 'skyStrike';
    };
    const w = { hold: inCombo ? 1.2 : 1 };
    if (ok(SUPERS[K.super])) w.super = sh.bias('super');
    if (ok(SUPERS[K.ultimate])) w.ultimate = sh.bias('ultimate');
    // the beam wants range and their lane (the beam plan backs off and lines up first: `anyRange`)
    if (!inCombo && !K.ultimate && (anyRange || (c.dist > 2.6 && Math.abs(c.sd) < 1))) w.beam = sh.bias('beam');
    const pick = pickW(w);
    return pick === 'hold' ? null : pick;
  }

  fireBig(id) {
    if (id === 'super') this.tap('super');
    else { this.tap('heavy', 3); this.tap('special', 3); } // ultimate: the kit's or the beam
  }

  bigCount() {
    const u = this.show.used;
    return (u.super || 0) + (u.ultimate || 0) + (u.beam || 0);
  }

  // Showman (ENG-056): an ultimate clash needs both fighters at three bars at once, which free spending almost
  // never lines up. When both ultimates can meet and the viewer hasn't seen a clash yet this match, it reserves its
  // three bars for one: it fires its ultimate only once the opponent has three too (it can only read their meter,
  // like a player: the challenge, which they can answer), and otherwise answers theirs. One per match, so the next
  // bars can go to the second super; it gives up for the round after 10 s at three bars, or with the clock low.
  clashWait(game) {
    const f = this.f, sh = this.show;
    if (this.S.show < 0.5 || !sh.tools.clash || sh.used.clash) return false;
    if (game.timeLeft < 20 || this.clashGaveUp === this.roundNo) return false;
    return f.ki >= 100;
  }

  // Frames from pressing a special to its first hit landing, or null for kinds that don't hit directly.
  // `cancel`: cancelled out of a normal that hit (a rush then starts at `cancelStartup`, ADR 0015).
  specialHitTime(m, c, cancel = false) {
    if (m.kind === 'rush') return (cancel && m.cancelStartup ? m.cancelStartup : m.startup) + Math.max(0, Math.abs(c.sx) - (m.reach ?? 1.3)) / m.rush * 60 + 1;
    if (m.kind === 'shot') {
      const P = PROJ_INFO[m.proj];
      return P && c.dist < P.range ? m.startup + Math.max(0, c.dist - 0.8) / P.speed * 60 + 1 : null;
    }
    if (m.kind === 'teleport' && m.follow) return (m.startup ?? 0) + m.hide + (MOVES[m.follow]?.startup ?? 3) + 1;
    return null;
  }

  // Best special to cancel a hit into, by kind: rush and wall-bounce shots end big, long-stun shots and
  // teleports extend. Only ones that land before the victim's stun runs out (`left` frames): after
  // light3, a 24-frame Rasengan doesn't, and a blocked "ender" is a free punish. `value` is a rough damage
  // worth of spending the ki; the pick also leans toward specials the viewer hasn't seen (Showcase).
  // `flying`: the victim was knocked away (light4), so a rush only catches them off the wall.
  comboSpecial(c, left = 99, flying = false) {
    const f = this.f, seen = new Set();
    let best = null;
    for (const slot of SLOTS) {
      const m = specialFor(f.def, slot);
      if (!m || seen.has(m) || f.ki < (m.cost ?? 0)) continue;
      seen.add(m);
      if (flying && m.kind === 'rush' && c.oppRoom > 2.2) continue;
      const hitIn = this.specialHitTime(m, c, true);
      if (hitIn == null || hitIn > left - 1) continue;
      let v = 0;
      if (m.kind === 'rush') v = m.dmg * (m.vortex ? 1.2 : 1) - (m.selfDmg ?? 0);
      else if (m.kind === 'shot') {
        const P = m.proj && PROJ_INFO[m.proj];
        if (P) v = P.wallBounce ? P.dmg * 1.3 : P.hitstun >= 30 ? P.dmg * 1.2 : 0;
      } else if (m.kind === 'teleport' && m.follow) v = (MOVES[m.follow]?.dmg ?? 0) * 1.3;
      const score = v * this.show.bias(specialId(m));
      if (v > 0 && (!best || score > best.score)) best = { slot, m, value: v, score };
    }
    return best;
  }

  // Ki policy: keep a bar for defense (vanish, counter) unless it pays off, the style is loud, or the
  // round is nearly over.
  spend(cost, value) {
    const f = this.f, S = this.S;
    const left = f.ki - cost;
    if (left < 0) return false;
    if (f.game.timeLeft < 15) return true;
    // some rounds it saves up for a three-bar finish (supers, ultimates, beam clashes): nothing smaller may
    // take it back under three bars
    if (this.saving && cost < 300 && left < 300) return value > 200 && Math.random() < 0.3;
    if (left >= 100) return true;
    return Math.random() < (value > 100 ? 0.75 : 0.45) * (0.6 + S.flair * 0.5);
  }

  // ------------------------------------------------------------------ threats
  // The opponent's soonest attack that can reach us: { key, kind, frames (until it's active), len, ... }
  threat(game, c) {
    const f = this.f, o = f.opp, S = this.S;
    let best = null;
    const add = (t) => { if (t && (!best || t.frames < best.frames)) best = t; };
    const delay = o.hitstop;
    if (o.state === 'attack' && o.move && !o.move.projectile && o.t >= S.react) {
      const m = o.move, A = m.startup, B = A + m.active;
      if (o.t < B && !(o.moveHit && m.rush)) {
        const travel = m.rush ? (m.rush * (B - Math.max(o.t, A))) / 60 + 0.3 : lungeLeft(m, o.t) + (o.carry ? Math.hypot(o.carry.x, o.carry.y) * 0.12 : 0);
        const reach = (m.reach ?? 1.3) + travel + 0.55;
        const depth = Math.max(0, Math.abs(c.sd) - (Math.abs(c.sd) < 2.6 ? 0.1 * Math.max(0, A - o.t) : 0));
        if (Math.abs(c.sx) < reach && depth < 0.7 && Math.abs(c.dy) < (m.yTol ?? 1.25) + 0.8) {
          // a rush connects once it has run the gap, not when its active phase starts, and no move before its drawn
          // strike reaches out (reachT)
          const run = m.rush ? Math.max(0, Math.abs(c.sx) - (m.reach ?? 1.3) - 0.2) / m.rush * 60 : 0;
          const at = Math.max(Math.max(A, o.t) + run, reachT(o, m));
          add({ key: 'm' + this.oppSerial, kind: 'melee', frames: at - o.t + delay, len: B - Math.max(o.t, A), m, big: !!(m.big || m.special), unblockable: !!m.unblockable, rush: !!m.rush });
        }
      }
    }
    if (o.state === 'superDash' && o.t >= Math.min(S.react, 4)) {
      add({ key: 'sd' + this.oppSerial, kind: 'melee', frames: Math.max(0, (Math.hypot(c.dist, c.dy) - 1.0) / SUPER_DASH.speed * 60), len: 3, m: SUPER_DASH, big: true });
    }
    if (o.state === 'vanish') {
      // live frames to the kick: the rest of the hide, then vanishKick's startup (think() skips the arrival freeze)
      const K = MOVES.vanishKick, key = 'v' + this.oppSerial;
      this.strike = { key, name: 'vanishKick', vanish: true };
      add({ key, kind: 'melee', frames: Math.max(0, VANISH.hideFrames - o.t) + reachT(o, K), len: K.active, m: K, big: true, behind: true, vanish: true });
    } else add(this.strikeThreat(o));
    for (const p of game.projectiles) {
      if (p.owner !== o || p.dead) continue;
      const age = (p.P.life - p.life) * 60;
      if (age < Math.min(S.react, 4)) continue;
      const rx = f.pos.x - p.pos.x, ry = f.pos.y + 0.8 - p.pos.y, rz = f.pos.z - p.pos.z;
      const v2 = p.vel.x * p.vel.x + p.vel.y * p.vel.y + p.vel.z * p.vel.z;
      if (v2 < 1e-4) continue;
      const tc = Math.max(0, (rx * p.vel.x + ry * p.vel.y + rz * p.vel.z) / v2);
      if (tc > p.life + 0.05) continue;
      const miss = Math.hypot(rx - p.vel.x * tc, (ry - p.vel.y * tc) * 0.7, rz - p.vel.z * tc);
      if (miss < p.P.radius + 0.8) {
        p._aid = p._aid || ++projIds;
        // it touches the body before its closest approach: a big shot (fireball) by 5-7 frames
        const touch = Math.max(0, tc - (p.P.radius + 0.45) / Math.sqrt(v2));
        add({ key: 'p' + p._aid, kind: 'proj', frames: touch * 60, len: 3, p, big: !!p.P.big });
      }
    }
    for (const v of game.vortices) {
      if (v.owner !== o || v.dead) continue;
      if (Math.hypot(v.pos.x - f.pos.x, v.pos.z - f.pos.z) < (v.m.radius ?? 2.2) + 0.6) add({ key: 'vx' + this.oppSerial, kind: 'proj', frames: 2, len: 8, vortex: true });
    }
    if (o.state === 'beamCharge' && o.t >= S.react) {
      add({ key: 'b' + this.oppSerial, kind: 'beam', frames: o.windup - o.t + (c.dist / ULTIMATE.speed) * 60, len: ULTIMATE.duration, charging: true, clash: true });
    }
    for (const b of game.beams) {
      if (b.owner !== o || b.dead || b.clash) continue;
      const ax = f.pos.x - b.origin.x, az = f.pos.z - b.origin.z;
      const along = ax * b.dir.x + az * b.dir.z;
      const perp = Math.hypot(ax - b.dir.x * along, az - b.dir.z * along);
      if (along > -0.5 && perp < b.width * 0.5 + 0.9) add({ key: 'bf' + this.oppSerial, kind: 'beam', frames: Math.max(0, (along - b.len) / ULTIMATE.speed * 60), len: 30 });
    }
    for (const ob of game.orbs) {
      if (ob.owner !== o || ob.dead || ob.clash || ob.hit) continue;
      const ax = f.pos.x - ob.pos.x, az = f.pos.z - ob.pos.z;
      const along = ax * ob.dir.x + az * ob.dir.z;
      const perp = Math.hypot(ax - ob.dir.x * along, az - ob.dir.z * along);
      if (along > -ob.r && perp < ob.r + 0.9) add({ key: 'ob' + this.oppSerial, kind: 'beam', frames: Math.max(0, (along - ob.r) / ob.S.speed * 60), len: 20 });
    }
    if (o.state === 'kit' && o.kitState) add(this.kitThreat(game, c, o.kitState));
    // nothing real on its way: the showman may still guess at an approach (a real threat replaces the guess)
    if (best) this.readTh = null;
    else if (S.read) best = this.readApproach(c);
    return best;
  }

  // Approach read (ADR 0025, showman): they dash, run or wavedash in fast. Their jab would be a guess for anyone (5
  // frames, under its reaction time), so it guesses too, once per approach: a synthetic threat timed to when a jab
  // from them would land, answered like a real one (parry, dodge, backstep, wavedash or jump out, stuff it, block).
  // A throw beats the guard and parry reads, a delayed jab beats the dodge: a real guess, not a free answer.
  readApproach(c) {
    const f = this.f, o = f.opp, S = this.S;
    const rd = this.readTh;
    if (rd) {
      const left = rd.eta - (this.clock - rd.at);
      if (left > -8 && o.state !== 'hitstun' && o.state !== 'launched') { rd.th.frames = Math.max(0, left); return rd.th; }
      this.readTh = null;
      return null;
    }
    if (c.ready !== 'ground' || this.readSerial === this.oppSerial || c.dist >= 3.4 || Math.abs(c.sd) > 0.8) return null;
    const dash = o.state === 'dash' && !o.backDash;
    if (!dash && o.state !== 'run' && o.state !== 'wavedash') return null;
    const v = (o.vel.x * (f.pos.x - o.pos.x) + o.vel.z * (f.pos.z - o.pos.z)) / (c.dist || 1); // closing speed
    if (v <= 3) return null;
    this.readSerial = this.oppSerial;
    if (Math.random() >= S.read * this.show.pm('read')) return null;
    const eta = (Math.max(0, Math.abs(c.sx) - (dash ? DASH_LIGHT_REACH : LIGHT_REACH)) / v) * 60 + MOVES.light1.startup;
    const th = { key: 'rd' + this.oppSerial, kind: 'read', frames: eta, len: 3, m: MOVES.light1 };
    this.readTh = { th, eta, at: this.clock };
    return th;
  }

  kitThreat(game, c, k) {
    const f = this.f, o = f.opp, m = k.m;
    switch (k.kind) {
      case 'flurry':
        if (k.phase === 'dash' || k.phase === 'flash') return { key: 'fl' + this.oppSerial, kind: 'grab', frames: Math.max(0, (c.dist - 1.4) / 24 * 60), len: 4, unblockable: true, big: true };
        return null;
      case 'orb':
        if (k.phase === 'merge' || k.phase === 'flash') return { key: 'om' + this.oppSerial, kind: 'beam', frames: Math.max(0, mergeOf(k) - (k.t0 || 0)) + Math.max(0, c.dist - m.radius) / m.speed * 60, len: 30, charging: true, clash: !!k.ultimate };
        return null;
      case 'rampage':
        if (k.phase === 'flash' || k.phase === 'roar' || k.phase === 'lunge') {
          // noDodge: the bodies still collide during a spot dodge, so he waits it out in front of you and grabs you
          return { key: 'rp' + this.oppSerial, kind: 'grab', frames: (k.phase === 'lunge' ? 0 : Math.max(0, roarOf(k) - (k.t0 || 0))) + Math.max(0, c.dist - 1.35) / m.speed * 60, len: 4, unblockable: true, big: true, noDodge: true, clash: !!k.ultimate && k.phase !== 'lunge' };
        }
        return null;
      case 'ignite':
        if (k.phase === 'gaze' || k.phase === 'flash') return { key: 'ig' + this.oppSerial, kind: 'grab', frames: Math.max(0, m.delay - (k.t0 || 0)), len: 2, unblockable: true, big: true, rangeless: true };
        return null;
      case 'skyStrike':
        if (k.phase === 'mark' && k.at && Math.hypot(f.pos.x - k.at.x, f.pos.z - k.at.z) < m.radius + 0.7) {
          return { key: 'ks' + this.oppSerial, kind: 'zone', frames: Math.max(0, m.delay - k.t0), len: 2, unblockable: true, at: k.at, r: m.radius };
        }
        return null;
      case 'dive': {
        const hit = k.phase === 'rise' ? m.riseHit : m.hit;
        if (!hit) return null;
        if (k.phase === 'rise' && (c.dist > 2.2 || !f.air)) return null;
        const fall = k.phase === 'slam' ? (o.pos.y / -m.slamV) * 60 : k.phase === 'hang' ? m.hang - k.t0 + (o.pos.y / -m.slamV) * 60 : 2;
        if (c.dist > (m.area ?? 1.6) + 2.5) return null;
        // one threat from the hover to the slam (a new key at the slam would re-pick the answer too late)
        return { key: 'dv' + this.oppSerial + (k.phase === 'rise' ? 'r' : 's'), kind: 'melee', frames: Math.max(0, fall), len: 2, m: hit, big: true, dive: k.phase !== 'rise' };
      }
      case 'teleport': {
        // a teleport strike (Rhythm Echo, Substitution): through the arrival and its recovery to the follow-up's
        // first active frame, then strikeThreat keeps the same key on the strike itself
        const F = m.follow && MOVES[m.follow];
        if (!F) return null;
        const key = 'tp' + this.oppSerial;
        this.strike = { key, name: m.follow };
        return { key, kind: 'melee', frames: Math.max(0, (m.startup ?? 0) + m.hide + (m.recovery ?? 0) - o.t) + reachT(o, F), len: F.active, m: F, big: true, behind: true };
      }
    }
    return null;
  }

  // The strike out of a vanish or a teleport (ADR 0025). It saw the smoke, so the kick keeps the threat it answered
  // (same key, so the same answer, and no react gating: a 2-frame vanishKick would otherwise be invisible) until the
  // strike's active frames are over.
  strikeThreat(o) {
    const st = this.strike;
    if (!st || (o.state === 'kit' && o.kitState?.kind === 'teleport')) return null; // still on its way: kitThreat
    const m = o.move;
    if (o.state !== 'attack' || o.moveName !== st.name || !m || o.t >= m.startup + m.active) { this.strike = null; return null; }
    return { key: st.key, kind: 'melee', frames: Math.max(0, reachT(o, m) - o.t) + o.hitstop, len: m.startup + m.active - Math.max(o.t, m.startup), m, big: true, behind: true, vanish: !!st.vanish };
  }

  // Pick the answer once per threat, at random among the ones that work against it, weighted by the style
  // (parry when the read is clean, dodges against big swings, counters and vanish for the loud styles, a plain
  // block) and by the Showcase: an answer the viewer hasn't seen yet weighs more (ADR 0016).
  chooseDefense(game, c, th) {
    const f = this.f, o = f.opp, S = this.S, sh = this.show;
    const r = c.ready;
    const d = { key: th.key, type: 'none' };
    // picked while it can't act (hitstop, a dash's first frames, a throw): execDefense picks again once it can
    if (!r) return { ...d, retry: true };
    const ki = f.ki;
    const now = f.pad.frame;
    const lockFree = (lead) => now + lead - f.parryTry >= PARRY.lockout;
    // weights: the style's, × the Showcase bias for unseen tools, × the defense persona (ADR 0025), × `rotate` per
    // repeat among the last four answers (showman), so a match cycles through its answers
    const w = {}, base = {}, ans = {}, P = sh.persona, recent = this.recentDef || (this.recentDef = []);
    const offer = (key, weight, resp, tool) => {
      if (!(weight > 0)) return;
      base[key] = weight * (tool ? sh.bias(tool) : 1);
      let x = base[key] * (PERSONA_OF[key] ? sh.pm(PERSONA_OF[key]) : 1);
      if (S.rotate) for (const t of recent) if (t === (resp.type ?? key)) x *= S.rotate;
      w[key] = x;
      ans[key] = { ...d, ...resp };
    };
    const decide = () => {
      // a weak persona (IMPOSSIBLE, INSANE) only reshuffles the advanced answers: their total stays the style's
      if (P && P.s < 1) {
        let b0 = 0, b1 = 0;
        for (const k in w) if (k !== 'block' && k !== 'none') { b0 += base[k]; b1 += w[k]; }
        for (const k in w) if (k !== 'block' && k !== 'none' && b1 > 0) w[k] *= b0 / b1;
        if (w.block) w.block = base.block;
      }
      const a = ans[pickW(w)] ?? d;
      if (a.type !== 'none') {
        sh.logDef(a.type);
        if (a.type !== 'block') { recent.push(a.type); if (recent.length > 4) recent.shift(); }
      }
      return a;
    };
    // a spot dodge is intangible 3-4 frames after the press (Guard, neutral, ↓, dodge frame 2): too late below that
    const dodgeLead = f.state === 'guard' ? 4 : 5;
    const canDodge = th.frames >= dodgeLead;
    const stale = this.staleK();
    // their beam, orb or pounce on its way and an ultimate of ours that can meet it: answer it (a rhythm clash,
    // ADR 0017). Amaterasu or Whirlwind can't touch it, so those don't offer.
    if (th.clash && ki >= ULTIMATE.cost && clashable(f.def)) {
      // the showman takes it most of the time while the viewer hasn't seen a clash (Showcase 'clash')
      const k = S.show >= 0.5 && sh.tools.clash ? sh.bias('clash') : 1;
      offer('counterBeam', (1 + S.flair * 2) * k, { type: 'counterBeam' }, kitOf(f.def).ultimate ? null : 'beam');
    }
    if (th.kind === 'beam') {
      if (ki >= VANISH.cost) offer('vanish', 0.6 + S.flair * 0.6, { type: 'vanish', at: 10 }, 'vanish');
      if (r !== 'air') offer('sidestep', 0.7, { type: 'sidestep', at: 30 });
      return decide();
    }
    if (th.unblockable) {
      if (th.kind === 'zone') return { ...d, type: 'dashOut' };
      if (ki >= VANISH.cost) offer('vanish', 3, { type: 'vanish', at: th.rangeless ? 6 : 4 }, 'vanish');
      // a spot dodge's intangibility lets a flurry dash or Amaterasu pass through
      if (r === 'ground' && canDodge && !th.noDodge) offer('dodge', (th.rangeless ? 1 : 0.4 + 0.4 * S.show) * stale, { type: 'dodge', at: 7 }, 'spotDodge');
      if (r === 'air') { if (!f.airDodged) offer('airdodge', 1, { type: 'airdodge', at: 5 }, 'airDodge'); } else offer('sidestep', 1, { type: 'sidestep', at: 5 });
      return decide();
    }
    if (r === 'air') {
      if (!f.airDodged) offer('airdodge', S.dodge + 0.25, { type: 'airdodge', at: 3 }, 'airDodge');
      if (th.vanish && S.vanishWar && ki >= VANISH.cost) offer('vanishWar', S.vanishWar, { type: 'vanish', at: 4 }, 'vanishWar'); // works in the air too
      offer('none', 0.75 - S.dodge, {});
      return decide();
    }
    if (r === 'dash') return { ...d, retry: true };
    if (th.kind === 'read') {
      // a guess at their approach (readApproach): the jab it expects may be a throw or a delayed hit instead
      if (lockFree(Math.max(0, th.frames - 2))) offer('parry', 0.9, { type: 'parry' }, 'parry');
      if (th.frames >= 6) offer('dodge', 0.6 * stale, { type: 'dodge', at: 6 }, 'spotDodge');
      if (c.myRoom > 2) {
        if (th.frames >= 4) offer('backstep', 0.5 * Math.sqrt(sh.bias('backstep')), { type: 'backstep', at: 4 });
        offer('wavedash', 0.6 * Math.sqrt(sh.bias('wavedash')), { type: 'wavedash', at: 99, dir: 'back' });
      }
      offer('jumpOut', 0.35, { type: 'jumpOut', at: 99 });
      offer('stuff', 0.6, { type: 'stuff' });
      // vanish behind the runner (they can answer it with a vanish of their own: the vanish war)
      if (ki >= VANISH.cost && this.spend(VANISH.cost, 90)) offer('vanish', 0.5, { type: 'vanish', at: 99 }, 'vanish');
      offer('block', 1, { type: 'block' });
      return decide();
    }
    const big = th.big || th.p?.P?.big;
    if (th.kind === 'proj' && !th.vortex) {
      // plow through it with the super dash and hit its thrower, or spot dodge it as it arrives (a shot is often
      // seen late: two frames more of lead than a swing), or (showman) wavedash out of its line in depth
      if (r === 'ground' && f.airDashes === 0 && c.dist < 7) offer('superDash', 0.25 + S.flair * 0.25, { type: 'superDash', at: 12 }, 'superDash');
      if (r === 'ground' && th.frames >= dodgeLead + 2) offer('dodge', S.dodge * 0.6 * S.show * stale, { type: 'dodge', at: 8 }, 'spotDodge');
      const wdAt = big ? 19 : 12;
      if (r === 'ground' && S.wdDefense && th.frames >= wdAt) offer('wavedash', S.wdDefense * Math.sqrt(sh.bias('wavedash')), { type: 'wavedash', at: wdAt, dir: 'depth' });
    }
    // (not a vortex's grind: its ticks keep coming after the one a press could meet)
    if (!th.vortex && lockFree(Math.max(0, th.frames - 2))) offer('parry', S.parry * 2 * (big ? 1.2 : 1), { type: 'parry' }, 'parry');
    // dodge what leaves something to punish: its active + recovery outlasts our dodge (a hop launcher
    // lands and recovers first, so that one gets parried or blocked)
    // (the showman also dodges the rest now and then: even trade, but the viewer sees the dodge)
    const punishable = th.dive || (th.m && !th.m.hop && (th.m.active ?? 0) + (th.m.recovery ?? 0) >= SPOT.len);
    // (never a rush special: its body keeps pressing against the dodger, and its long active frames outlast the dodge)
    if (th.kind === 'melee' && r === 'ground' && canDodge && !th.rush && (punishable || S.show >= 0.5)) {
      offer('dodge', (punishable ? S.dodge * (big ? 1.4 : 0.5 * S.show) : S.dodge * 0.35) * stale, { type: 'dodge', at: f.state === 'guard' ? 6 : 7 }, 'spotDodge');
    }
    const cSlot = ['down', 'back'].find((sl) => specialFor(f.def, sl)?.kind === 'counter');
    const cm = cSlot && specialFor(f.def, cSlot);
    if (th.kind === 'melee' && cm && r === 'ground' && ki >= cm.cost + (S.show >= 0.5 ? 0 : 50)) offer('counter', S.flair * 0.45, { type: 'counter', slot: cSlot }, specialId(cm));
    if (th.kind === 'melee' && big && ki >= VANISH.cost * (S.show >= 0.5 ? 1 : 2)) offer('vanish', S.flair * 0.3, { type: 'vanish', at: 4 }, 'vanish');
    // showman (ADR 0025): a back dash through a swing (its 8 invulnerable frames, then the punish layer takes the whiff),
    // and against a vanish the vanish war: vanish too, so their kick whiffs and ours lands in its recovery
    if (th.kind === 'melee' && r === 'ground' && S.backstep && !th.rush && !th.behind && !th.dive && th.frames >= 3 && th.frames <= 10 && c.myRoom > 2) {
      offer('backstep', S.backstep * Math.sqrt(sh.bias('backstep')), { type: 'backstep', at: 3 });
    }
    if (th.vanish && S.vanishWar && ki >= VANISH.cost) offer('vanishWar', S.vanishWar, { type: 'vanish', at: 4 }, 'vanishWar');
    offer('block', S.block, { type: 'block' });
    return decide();
  }

  execDefense(game, c, th, d) {
    const f = this.f, o = f.opp;
    const fr = th.frames;
    d.until = this.clock + th.len + 6;
    switch (d.type) {
      case 'none':
        // a 'none' picked while it couldn't act is not the answer to this threat: pick again now it can (ADR 0025)
        if (d.retry && c.ready && c.ready !== 'dash') {
          this.resp = this.chooseDefense(game, c, th);
          return this.execDefense(game, c, th, this.resp);
        }
        return false;
      case 'block':
        this.keep.add('guard');
        return true;
      case 'parry': {
        // press so the hit lands ~2 frames after it (a held guard needs a release frame first)
        const lead = f.pad.b.guard.down ? 3 : 2;
        if (!d.pressed && fr <= lead) {
          this.tap('guard', 4);
          d.pressed = true;
          this.show.logDef('parry', true);
        }
        if (d.pressed && this.hold.guard <= 0) this.keep.add('guard');
        return true;
      }
      case 'dodge':
        if (!d.go && fr <= d.at) { d.go = true; this.show.logDef('dodge', true); }
        // wait for it in place: a dash or an attack started now couldn't guard into the dodge in time
        if (!d.go) return fr <= d.at + 20 && f.state !== 'block';
        if (f.state === 'dodge') return true;
        this.keep.add('guard');
        if (f.state === 'guard') this.my = d.pushed ? -1 : 0, d.pushed = true; // neutral one frame, then the ↓ edge
        return true;
      case 'airdodge':
        if (f.state === 'airDodge') return true;
        if (fr <= d.at && !d.done) {
          d.done = true;
          this.mx = -c.toward; // dodge away and down
          this.tap('guard', 2);
          this.show.logDef('airdodge', true);
        }
        return true;
      case 'vanish':
        if (d.done) return true;
        if (fr > d.at) return fr <= d.at + 20 && f.state !== 'block'; // wait for it in place, like a dodge
        d.done = true;
        this.keep.add('guard');
        this.tap('special', 2);
        this.show.logDef(th.vanish ? 'vanishWar' : 'vanish', true);
        return true;
      case 'wavedash': {
        // out of a shot's line in depth (mirrored at the barrier, like the sidestep), or straight back from an
        // approach read; a slide, so it can act again from its 5th frame
        if (d.done) return f.state === 'jumpSquat' || (f.state === 'wavedash' && f.t + 1 < WD.act);
        if (fr > d.at) return fr <= d.at + 20 && f.state !== 'block';
        d.done = true;
        if (d.dir === 'back') this.wavedash(-c.toward, 0);
        else {
          let sd = c.sd > 0 ? -1 : 1;
          if (Math.abs(f.pos.z) > ARENA_LIMIT - 1.5) sd = -Math.sign(f.pos.z) * Math.sign(c.F.z || 1);
          this.wavedash(0, sd);
        }
        this.show.logDef('wavedash', true);
        return true;
      }
      case 'backstep':
        // a back dash: 8 invulnerable frames carry it out through the swing (BACKSTEP when it passes through)
        if (d.done) return f.state === 'dash' && f.t + 1 < 4;
        if (fr > d.at) return fr <= d.at + 20 && f.state !== 'block';
        d.done = true;
        this.mx = -c.toward;
        this.my = 0;
        this.tap('dash', 2);
        this.show.logDef('backstep', true);
        return true;
      case 'jumpOut':
        // a back jump out of an approach; airborne, the threat layer air dodges an anti-air
        if (d.done) return f.state === 'jumpSquat';
        d.done = true;
        this.mx = -c.toward;
        this.tap('jump', 2);
        this.show.logDef('jumpOut', true);
        return true;
      case 'stuff':
        // a jab into their approach, the moment they step into its reach
        if (d.done) return false;
        if (Math.abs(c.sx) < 1.45 && Math.abs(c.sd) < 0.6) {
          d.done = true;
          this.tap('light');
          this.route = {};
          this.show.logDef('stuff', true);
        }
        return true;
      case 'counter':
        if (d.done) return true;
        // the special fires on the release a frame after the press: 5 keeps that release out of a teleport's
        // arrival freeze (an edge made during a freeze is lost) and the stance still outlasts the strike
        if (fr <= 5) {
          d.done = true;
          this.special(d.slot, 1);
          this.show.logDef('counter', true);
        }
        return true;
      case 'counterBeam':
        if (!d.done) {
          d.done = true;
          this.tap('heavy', 3);
          this.tap('special', 3);
        }
        return true;
      case 'superDash':
        if (fr > d.at) return false;
        if (!d.done) {
          d.done = true;
          this.tap('dash', 2);
        }
        return true;
      case 'sidestep': {
        // dash out of the line in depth (beams, rushes and flurries run along the lane)
        if (fr > d.at || d.done) return d.done;
        d.done = true;
        this.my = c.sd > 0 ? -1 : 1;
        if (Math.abs(f.pos.z) > ARENA_LIMIT - 1.5) this.my = -Math.sign(f.pos.z) * Math.sign(c.F.z || 1);
        this.tap('dash', 2);
        return true;
      }
      case 'dashOut': {
        if (d.done) return true;
        const ax = f.pos.x - th.at.x, az = f.pos.z - th.at.z;
        const l = Math.hypot(ax, az) || 1;
        this.mx = (ax * c.R.x + az * c.R.z) / l;
        this.my = (ax * c.F.x + az * c.F.z) / l;
        if (Math.hypot(this.mx, this.my) < 0.3) this.mx = -c.toward;
        this.tap('dash', 2);
        d.done = true;
        return true;
      }
    }
    return false;
  }

  // In block stun: re-press for a parry when the next hit of their string is coming and the lockout
  // allows, vanish out (guard cancel) when the pressure is heavy, else keep holding.
  blockStun(game, c) {
    const f = this.f, o = f.opp, S = this.S;
    this.keep.add('guard');
    if (f.ki >= VANISH.cost * 2 && o.combo === 0 && Math.random() < S.flair * 0.01) this.tap('special', 2);
  }

  // ------------------------------------------------------------------ punishes
  // Frames the opponent stays unable to act, { from, to } from now, or null (only what the screen shows).
  opening(o) {
    const lag = o.hitstop;
    switch (o.state) {
      case 'attack': {
        const m = o.move;
        if (!m) return null;
        const B = m.startup + m.active, C = B + m.recovery;
        if (o.t < B || (m.next && o.t < m.cancel + 2) || o.moveHit) return null; // still live, or may chain
        return { from: 0, to: C - o.t + lag };
      }
      case 'land':
        return o.landLag > 6 ? { from: 0, to: o.landLag - o.t + lag } : null;
      case 'held':
        return { from: 0, to: o.heldT + lag };
      case 'burst': // a burst that was blocked or whiffed: its recovery (ADR 0022)
        return { from: Math.max(0, o.invuln), to: o.burstEnd - o.t + lag };
      case 'dodge': {
        const len = SPOT.len + (o.dodgeStale || 0) * SPOT.stale;
        return { from: Math.max(0, o.invuln), to: len - o.t + lag };
      }
      case 'charge':
        return { from: 0, to: 9 };
      case 'throw': {
        const s = o.throwSt;
        if (!s || (s.phase !== 'whiff' && s.phase !== 'broken')) return null;
        return { from: 0, to: (s.phase === 'whiff' ? THROW.whiff : THROW.breakLag) - (o.t - s.t0) + lag };
      }
      case 'jumpSquat':
        return null;
      case 'kit': {
        const k = o.kitState, m = k?.m;
        if (!k) return null;
        if (k.kind === 'counter') return o.t >= m.len ? { from: 0, to: m.len + m.recovery - o.t } : null;
        if (k.kind === 'mode') return { from: 0, to: m.startup + m.recovery - o.t };
        if (k.kind === 'dive' && k.phase === 'land') return { from: 0, to: m.recovery - k.t0 };
        if (k.kind === 'pull') return { from: 0, to: m.startup + m.recovery - o.t };
        if (k.kind === 'flurry' && k.phase === 'land') return { from: 0, to: 14 - k.t0 };
        if (k.kind === 'skyStrike') return { from: 0, to: (k.phase === 'mark' ? m.delay - k.t0 : 0) + m.recovery - (k.phase === 'mark' ? 0 : k.t0) };
        if (k.kind === 'ignite') return { from: 0, to: m.delay + m.recovery - (k.t0 || 0) };
        return null;
      }
    }
    return null;
  }

  punish(game, c) {
    const f = this.f, o = f.opp, r = c.ready;
    if (r !== 'ground' && r !== 'dash') return false;
    // keep a combo going after a shot or a super dash contact (past the showman's cap: let them drop)
    if ((o.state === 'hitstun' || o.state === 'launched') && o.combo > 0 && !o.ko && o.hittable) {
      if (this.capped()) { this.approach(c, 1.8); return true; }
      return this.followUp(game, c);
    }
    if (o.state === 'kit' && o.counterT > 0) { this.backOff(c); return true; } // never swing into a counter stance
    if (o.reflex) {
      // Whirlwind answers every strike and shot (ADR 0017): walk in and throw it, or wait it out
      if (c.dist < 2.6) { if (this.inThrowRange(c)) this.throwNow(); else this.approach(c, 0.7); return true; }
      this.backOff(c);
      return true;
    }
    if (o.state === 'beamFire') return this.punishBeam(game, c);
    const w = this.opening(o);
    if (!w || w.to <= 0) return false;
    // lethal from anywhere: a super flash freezes the world, so its travel fits any opening
    if (f.ki >= 300 && this.superPunish(game, c, w)) return true;
    const sx = Math.abs(c.sx), lane = Math.abs(c.sd) < 0.9;
    // showman: punish with a special the viewer hasn't seen when it fits the opening (decided once per opening)
    if (this.S.show >= 0.5 && this.specialPunish(c, w)) return true;
    const timeToLight = (sx > LIGHT_REACH ? (sx - LIGHT_REACH) / 9 * 60 : 0) + MOVES.light1.startup;
    if (lane && sx < LIGHT_REACH + 0.05 && w.to >= MOVES.light1.startup + 1 && w.from <= MOVES.light1.startup) {
      if (w.to >= MOVES.heavy.startup + 2 && sx < 1.3 && Math.random() < 0.35) this.tap('heavy');
      else this.tap('light');
      this.route = {};
      return true;
    }
    if (lane && sx < 4.2 && w.to >= timeToLight + 6 && r === 'ground') {
      // dash in, then the dash cancels into a lunging light at frame 4
      this.mx = c.toward;
      this.my = Math.abs(c.sd) > 0.2 ? Math.sign(c.sd) : 0;
      this.tap('dash', 2);
      this.route = { dashIn: true };
      return true;
    }
    if (r === 'dash' && this.route.dashIn) {
      if (sx < DASH_LIGHT_REACH) this.tap('light');
      this.mx = c.toward;
      return true;
    }
    if (w.to >= 16 && c.dist < 9 && this.rangedPunish(game, c, w)) return true;
    return false;
  }

  // The victim is still reeling after a hit that wasn't one of our normals (shot, super dash contact,
  // vortex pop): run in and restart the route.
  followUp(game, c) {
    const f = this.f, o = f.opp;
    const sx = Math.abs(c.sx);
    if (o.state === 'launched') {
      if (o.pos.y < 1.7 && sx < 1.5 && Math.abs(c.sd) < 0.7) { this.tap('heavy'); this.route = {}; return true; }
      if (f.airDashes === 0 && c.dist < 6 && o.pos.y > 0.8) { this.tap('dash'); return true; }
      this.approach(c, 0.95);
      return true;
    }
    const left = o.stun - o.t + o.hitstop;
    if (sx < LIGHT_REACH && Math.abs(c.sd) < 0.8 && left >= 2) { this.tap('light'); this.route = {}; return true; }
    if (sx < 4 && left >= 9 && c.ready === 'ground') { this.mx = c.toward; this.tap('dash', 2); this.route = { dashIn: true }; return true; }
    if (c.ready === 'dash' && sx < DASH_LIGHT_REACH) { this.tap('light'); return true; }
    this.approach(c, 0.95);
    return true;
  }

  superPunish(game, c, w) {
    const f = this.f, o = f.opp, K = kitOf(f.def);
    const S = SUPERS[K.super];
    const est = this.finishDamage(c);
    const kills = est && o.hp <= est.dmg * 0.9;
    if (!kills && this.S.show >= 0.5) {
      if (this.waitClash) return false; // the bars are kept for the clash
      // showman: spend the bars on an opening, once per opening, on the move the viewer hasn't seen
      if (this.bigRoll?.key !== this.oppSerial) this.bigRoll = { key: this.oppSerial, pick: this.pickBig(c, false) };
      const big = this.bigRoll.pick;
      if (!big) return false;
      const Sx = big === 'super' ? S : big === 'ultimate' ? SUPERS[K.ultimate] : null;
      if (Sx?.kind === 'skyStrike' && w.to < Sx.delay + 6) return false; // Kirin lands its delay later
      if (big === 'beam' && w.to < 40) return false;
      this.bigRoll.pick = null;
      this.fireBig(big);
      return true;
    }
    const show = Math.random() < this.S.flair * 0.12;
    if (!kills && !show) return false;
    if (S?.kind === 'flurry' && c.dist < 5.4) { this.tap('super'); return true; }
    if (S?.kind === 'domain' && c.dist < 8) { this.tap('super'); return true; }
    const U = SUPERS[K.ultimate];
    if (U?.kind === 'ignite') { this.tap('heavy'); this.tap('special'); return true; }
    if (U?.kind === 'rampage' && c.dist < (U.range ?? 8) - 0.6 && Math.abs(c.sd) < 1 && w.to > (U.roar ?? 16) + 8) { this.tap('heavy'); this.tap('special'); return true; }
    if ((!U || U.kind === 'orb') && w.to > 40 && c.dist > 2.5 && Math.abs(c.sd) < 1) { this.tap('heavy'); this.tap('special'); return true; } // beam / Hollow Purple
    return false;
  }

  // Showman: a rush, shot, teleport or dive that reaches them before the opening closes, weighted toward the
  // ones the viewer hasn't seen; decided once per opening (otherwise the jab / dash-in punish runs).
  specialPunish(c, w) {
    const f = this.f;
    if (this.spRoll?.key === this.oppSerial) return false;
    this.spRoll = { key: this.oppSerial };
    const seen = new Set(), opts = {};
    for (const slot of SLOTS) {
      const m = specialFor(f.def, slot);
      if (!m || seen.has(m) || f.ki < (m.cost ?? 0)) continue;
      seen.add(m);
      let t = this.specialHitTime(m, c);
      if (m.kind === 'rush' && Math.abs(c.sd) > 0.6) t = null;
      if (m.kind === 'dive' && m.rise > 0 && c.dist < 5.5) t = m.rise + m.hang + 8;
      if (t != null && t + 2 < w.to) opts[slot] = this.show.bias(specialId(m));
    }
    const pick = Math.random() < 0.6 ? pickW(opts) : null;
    if (!pick || !this.spend(specialFor(f.def, pick).cost ?? 0, 120)) return false;
    this.special(pick, 2);
    this.route = {};
    return true;
  }

  // Shots and teleports against openings out of melee range.
  rangedPunish(game, c, w) {
    const f = this.f, seen = new Set();
    for (const slot of SLOTS) {
      const m = specialFor(f.def, slot);
      if (!m || seen.has(m) || f.ki < (m.cost ?? 0)) continue;
      seen.add(m);
      if (m.kind === 'teleport' && m.follow && w.to >= (m.hide + 6)) { this.special(slot, 2); return true; }
      if (m.kind === 'shot' && Math.abs(c.sd) < 0.8 && w.to >= m.startup + 8) {
        const P = PROJ_INFO[m.proj];
        if (P && (c.dist / P.speed) * 60 + m.startup < w.to && c.dist < P.range) { this.special(slot, 2); return true; }
      }
    }
    if (f.airDashes === 0 && w.to >= (c.dist / SUPER_DASH.speed) * 60 + 6 && c.dist < 7) { this.tap('dash'); return true; }
    return false;
  }

  // The beam pins its user: hit them from the side or from behind (vanish), never through the beam.
  punishBeam(game, c) {
    const f = this.f, o = f.opp;
    const beam = game.beams.find((b) => b.owner === o && !b.dead);
    if (!beam) return false;
    if (f.ki >= VANISH.cost) { this.keep.add('guard'); this.tap('special', 2); return true; }
    const sideOff = Math.abs(c.sd);
    if (sideOff < 1.3) { this.my = c.sd > 0 ? -1 : 1; return true; } // step out of its lane first
    this.mx = c.toward;
    this.my = 0;
    if (Math.abs(c.sx) < 1.2) { this.my = Math.sign(c.sd); this.tap('light'); }
    return true;
  }

  backOff(c) {
    this.mx = -c.toward;
  }

  // ------------------------------------------------------------------ throws (ADR 0015)
  inThrowRange(c) {
    const o = this.f.opp;
    return Math.abs(c.sx) < THROW.range - 0.08 && Math.abs(c.sd) < THROW.lane - 0.1 && !o.air && o.pos.y < 0.05;
  }

  throwNow() {
    this.tap('light', 2);
    this.tap('heavy', 2);
    this.route = {};
  }

  // After a blocked string: walk the last step in and throw while they still sit in Guard.
  tick(game, c) {
    const f = this.f, o = f.opp;
    if (c.ready !== 'ground' || !['guard', 'idle', 'block'].includes(o.state) || c.dist > 1.8) { this.tickThrow = false; return false; }
    this.tickT = (this.tickT ?? 0) + 1;
    if (this.tickT > 20) { this.tickThrow = false; this.tickT = 0; return false; }
    if (o.state !== 'block' && this.inThrowRange(c)) { this.throwNow(); this.tickThrow = false; this.tickT = 0; return true; }
    this.approach(c, 0.7);
    return true;
  }

  // ------------------------------------------------------------------ okizeme, anti-air
  situational(game, c) {
    const f = this.f, o = f.opp, S = this.S, r = c.ready;
    if (r !== 'ground') return false;
    // wake-up: stand next to them and time a meaty light so its active frames meet the end of the invincibility
    if (o.state === 'down' || o.state === 'getup' || (o.invuln > 0 && o.state === 'idle')) {
      if (this.okiPlan == null) {
        const r = Math.random();
        // the showman often gives them room instead, so the next exchange starts at mid range with the kit
        if (S.show >= 0.5) this.okiPlan = pickW({ reset: 1.3, meaty: 0.6, throw: S.throw * 0.6, bait: 0.3 });
        else this.okiPlan = r < S.throw * 0.4 ? 'throw' : r < 0.6 + S.aggro * 0.3 ? 'meaty' : Math.random() < 0.5 ? 'bait' : 'charge';
      }
      if (this.okiPlan === 'reset') {
        if (Math.abs(c.sx) < 2.6 && !this.resetWd && Math.random() < S.wavedash) { this.resetWd = true; this.wavedash(-c.toward, 0); return true; }
        const there = this.approach(c, 3.8);
        if (there && f.ki < 300 && (o.state === 'down' || o.state === 'getup')) this.holdCharge(); // power up while they rise
        return true;
      }
      if (this.okiPlan === 'throw') {
        // stand on top of them and throw the moment the invincibility runs out (beats blocking on wake-up)
        const there = this.approach(c, 0.7);
        if (there && o.state !== 'down' && o.state !== 'getup' && o.invuln <= 1 && this.inThrowRange(c)) this.throwNow();
        return true;
      }
      if (this.okiPlan === 'charge' && c.dist > 3.5 && f.ki < 300) { this.holdCharge(); return true; }
      if (this.okiPlan === 'bait') { this.approach(c, 2.2); if (o.state === 'getup' && o.t > 14) this.keep.add('guard'); return true; }
      const there = this.approach(c, 0.95);
      if (there && o.state !== 'down' && o.invuln > 0 && o.invuln <= MOVES.light1.startup + 1) this.tap('light');
      return true;
    }
    this.okiPlan = null;
    this.resetWd = false;
    // a guard held this long, right in front of us: throw it
    if (o.state === 'guard' && o.t > 20 && this.inThrowRange(c) && Math.random() < S.throw * 0.25) { this.throwNow(); return true; }
    // anti-air: an opponent dropping in on us
    if (o.air && (o.state === 'air' || (o.state === 'attack' && o.move?.air)) && c.dy > 0.3 && Math.abs(c.sx) < 3.2 && Math.abs(c.sd) < 1.2) {
      if (this.aaRoll == null) this.aaRoll = Math.random() < S.antiAir;
      if (!this.aaRoll) return false;
      // where they'll be when the launcher's active frames start
      const T = MOVES.heavy.startup / 60;
      const py = o.pos.y + o.vel.y * T - 0.5 * 42 * T * T;
      const ox = o.pos.x + o.vel.x * T, oz = o.pos.z + o.vel.z * T;
      const px = (ox - f.pos.x) * c.R.x + (oz - f.pos.z) * c.R.z;
      if (Math.abs(px) < 1.5 && py < 1.9 && py > -0.2) {
        const dive = specialFor(f.def, 'up');
        const showy = S.show >= 0.5;
        if (dive?.kind === 'dive' && dive.riseHit && f.ki >= dive.cost + (showy ? 0 : 100) && Math.random() < S.flair * 0.4 * (showy ? this.show.bias(specialId(dive)) : 1)) this.special('up', 2);
        else this.tap('heavy');
        this.aaRoll = null;
        return true;
      }
      // not yet in range: hold the spacing so they land in front of us
      return false;
    }
    this.aaRoll = null;
    return false;
  }

  // ------------------------------------------------------------------ neutral
  neutral(game, c) {
    const f = this.f;
    if (this.route.over) this.route = {}; // the showman's finished combo: the next hit starts a fresh one
    if (!this.plan || this.plan.t >= this.plan.len || this.plan.done) this.plan = this.choosePlan(game, c);
    this.plan.t++;
    this.runPlan(game, c, this.plan);
  }

  choosePlan(game, c) {
    const f = this.f, o = f.opp, S = this.S, R = Math.random, sh = this.show;
    const dist = c.dist, ki = f.ki;
    const lead = (f.hp - o.hp) / 1000;
    const w = {};
    const shotSl = this.shotSlot(), hasShot = shotSl != null;
    const modeSlot = SLOTS.find((sl) => specialFor(f.def, sl)?.kind === 'mode');
    const showy = S.show >= 0.5;
    // the showman turns a mode on whenever it can afford it; IMPOSSIBLE keeps a bar for defense
    const modeReady = modeSlot && !f.mode && ki >= specialFor(f.def, modeSlot).cost + (showy ? 0 : 50) && !this.saving;
    const spare = !this.saving; // saving up: no ki on pokes (at three bars the bars go to the big move)
    // Showcase weights (1 = seen plenty, up to 4 = never shown): tools the viewer hasn't seen get picked more
    const shotB = hasShot ? sh.bias(specialId(specialFor(f.def, shotSl))) : 1;
    const modeB = modeSlot ? sh.bias(specialId(specialFor(f.def, modeSlot))) : 1;
    const kitOpts = this.kitOptions(c);
    const kitB = kitOpts.length ? Math.max(...kitOpts.map((k) => k.w)) : 0;
    const airSp = spare ? this.airSpecial(c) : null;
    // the showman plays more of its neutral at mid range with its kit (shots, air specials, kit tools) and less
    // of it running in for a jab, so there are spells to dodge and parry, and rounds have room for them
    const kitty = showy ? 1.7 : 1;
    if (dist > 5.5) {
      w.approach = 1.6 + S.aggro * 2;
      w.zone = hasShot && ki >= 100 && spare ? 1.2 * kitty * shotB : 0;
      w.charge = ki < 300 ? 1.4 - S.aggro * 0.6 + (this.saving ? 0.8 : 0) + (showy && ki < 200 ? 1.5 : 0) : 0;
      w.mode = modeReady ? 2.5 * modeB : 0;
      w.airShot = airSp?.m.kind === 'shot' ? 0.5 * kitty * airSp.b : 0;
    } else if (dist > 2.4) {
      w.approach = (1.4 + S.aggro * 2) * (showy ? 0.5 : 1);
      // the showman powers up at a safe distance to afford its kit (a real habit: it can be punished)
      w.charge = showy && (ki < 150 || (this.saving && ki < 300)) && dist > 4.6 ? 1.5 : 0;
      w.space = (1.3 - S.aggro * 0.5) * (showy ? Math.sqrt(sh.bias('wavedash')) : 1);
      w.jumpin = (0.5 + S.aggro * 0.5 - Math.min(0.6, this.mem.jumps * 0.02)) * (showy ? Math.sqrt(sh.bias('airDodge')) : 1);
      w.zone = hasShot && ki >= 100 && spare ? 0.6 * kitty * shotB : 0;
      w.kit = ki >= 100 && spare ? (0.4 + S.flair * 0.6) * kitB : 0;
      w.mode = modeReady && dist > 4 ? modeB : 0;
      w.airShot = airSp ? 0.4 * kitty * airSp.b : 0;
    } else if (showy) {
      w.pressure = (0.8 + S.aggro * 1.4) * Math.sqrt(sh.bias('throw'));
      w.guard = 0.8;
      w.bait = 0.9 + this.mem.mashAfterBlock * 0.05;
      w.space = 1.6 * Math.sqrt(sh.bias('wavedash'));
    } else {
      w.pressure = 1.8 + S.aggro * 3;
      w.guard = 1.4 - S.aggro;
      w.bait = 0.6 + this.mem.mashAfterBlock * 0.05;
      w.space = 0.4;
    }
    // three bars: the beam from afar (an opponent with three bars can fire back: CLASH), or a kit super
    const K = kitOf(f.def);
    let big = null;
    if (ki >= 300 && showy && this.waitClash) {
      // waiting for a clash: only the ultimate that can meet theirs, and only once they have three bars too
      if (o.ki >= ULTIMATE.cost) {
        big = K.ultimate ? 'ultimate' : 'beam';
        if (big === 'beam') w.beam = 3 * sh.bias('clash');
        else w.big = 3 * sh.bias('clash');
      }
    } else if (ki >= 300 && showy) {
      // one pick among the super, the ultimate and the beam, so neither crowds out the other
      big = this.pickBig(c, false, true);
      const want = S.flair * 1.5 * (big ? sh.bias(big) : 0) + (big && this.saving ? 2 : 0);
      if (big === 'beam') w.beam = want * (o.ki >= ULTIMATE.cost ? 1.5 : 1);
      else if (big) w.big = want;
    } else if (ki >= 300 && SUPERS[K.ultimate] && (dist > 3.5 || this.saving)) {
      // IMPOSSIBLE: a kit ultimate (Amaterasu) from range, where another fighter would fire the beam
      big = 'ultimate';
      w.big = S.flair * (o.ki >= ULTIMATE.cost ? 2.5 : 1.2) + (this.saving ? 2.5 : 0);
    } else if (ki >= ULTIMATE.cost && !K.ultimate && (dist > 3.5 || this.saving)) {
      w.beam = (S.flair * (o.ki >= ULTIMATE.cost ? 2.5 : 1.2) + (this.saving ? 2.5 : 0)) * sh.bias('beam');
    }
    // showman, short on ki while the viewer still hasn't seen some of its kit (or saving for its first
    // three-bar move): back off and power up
    if (showy && dist < 5.5 && this.saving && ki < 300) w.powerUp = 2;
    else if (showy && ki < 200 && dist < 5.5 && sh.unseen().some((id) => id.startsWith('sp:') || id === 'super' || id === 'ultimate' || id === 'beam')) w.powerUp = 1.1;
    if (lead > 0.25 && game.timeLeft < 30) { w.space = (w.space ?? 0) + 1.5; w.guard = (w.guard ?? 0) + 1; }
    if (lead < -0.3) { w.pressure = (w.pressure ?? 0) * 1.3; w.approach = (w.approach ?? 0) * 1.3; }
    const name = pickW(w) || 'approach';
    const len = { approach: 70, zone: 50, charge: 70 + R() * 50, mode: 30, space: 40 + R() * 40, jumpin: 45, kit: 30, pressure: 50, guard: 25 + R() * 30, bait: 40, beam: 90, airShot: 50, big: 40, powerUp: 150 }[name];
    const p = { name, t: 0, len, done: false };
    if (name === 'approach') {
      const m = R();
      const wd = S.wavedash * 0.5 * (showy ? Math.sqrt(sh.bias('wavedash')) : 1);
      p.how = dist > 5 && f.airDashes === 0 && m < 0.25 * (showy ? Math.sqrt(sh.bias('superDash')) : 1) ? 'superDash' : m < 0.25 + wd ? 'wavedash' : m < 0.75 ? 'dash' : 'walk';
    }
    if (name === 'charge' || name === 'powerUp') p.kiGoal = Math.min(300, f.ki + 100 + R() * 100);
    if (name === 'space') p.gap = showy ? 3 + R() * 1.4 : 2.6 + R() * 0.8;
    if (name === 'mode') p.slot = modeSlot;
    if (name === 'airShot') p.slot = airSp.slot;
    if (name === 'big') p.tool = big;
    return p;
  }

  // Ground kit specials that make sense at this distance: { slot, w } with w = the Showcase weight.
  kitOptions(c) {
    const f = this.f, seen = new Set(), opts = [];
    const extra = this.S.show >= 0.5 ? 0 : 50; // IMPOSSIBLE keeps half a bar spare
    for (const sl of SLOTS) {
      const m = specialFor(f.def, sl);
      if (!m || seen.has(m) || f.ki < (m.cost ?? 0) + extra) continue;
      seen.add(m);
      let ok = false;
      if (m.kind === 'pull') ok = c.dist > 1.4 && c.dist < 4.5;
      if (m.kind === 'teleport' && m.follow) ok = c.dist > 2.5;
      // a plain teleport (Blink) puts it over their head: airStep drops the spike from there
      if (m.kind === 'teleport' && !m.follow) ok = c.dist > 3 && this.S.show >= 0.5;
      if (m.kind === 'rush') ok = c.dist > 2 && c.dist < 5.5 && Math.abs(c.sd) < 0.6;
      // a rising dive leaps at them from mid range (the slam is blockable: a read, like in DBFZ)
      if (m.kind === 'dive' && m.rise > 0) ok = c.dist > 2.2 && c.dist < 6 && this.S.show >= 0.5;
      if (ok) opts.push({ slot: sl, w: this.show.bias(specialId(m)) });
    }
    return opts;
  }

  // The air special for a jump-in plan: { slot, m, b } (shots from range, a dive when they're close enough).
  airSpecial(c) {
    const f = this.f;
    let best = null;
    for (const sl of ['air', 'airDown']) {
      const m = specialFor(f.def, sl);
      if (!m || f.ki < (m.cost ?? 0)) continue;
      if (m.kind === 'dive' && (c.dist > 5 || c.dist < 1.5)) continue;
      if (m.kind === 'shot' && Math.abs(c.sd) > 0.8) continue;
      const b = this.show.bias(specialId(m));
      if (!best || b > best.b) best = { slot: sl, m, b };
    }
    return best;
  }

  shotSlot() {
    const f = this.f;
    for (const sl of SLOTS) {
      const m = specialFor(f.def, sl);
      if (m?.kind === 'shot' && !m.air) return sl;
    }
    return null;
  }

  // walk to `gap` units beside them on screen, in their depth lane; true when there
  approach(c, gap) {
    const want = Math.abs(c.sx) - gap;
    this.mx = Math.abs(want) > 0.15 ? c.toward * Math.sign(want) : 0;
    this.my = Math.abs(c.sd) > 0.18 ? Math.sign(c.sd) : 0;
    return Math.abs(want) < 0.45 && Math.abs(c.sd) < 0.45;
  }

  // a wavedash toward screen direction sx (+1 right) and depth sd: jump, Guard in the squat, stick held
  wavedash(sx, sd = 0) {
    this.wdDir = [sx, sd];
    this.mx = sx;
    this.my = sd;
    this.tap('jump', 1);
    this.tap('guard', 3);
  }

  runPlan(game, c, p) {
    const f = this.f, o = f.opp, S = this.S, R = Math.random;
    const r = c.ready;
    if (r !== 'ground' && r !== 'dash') return;
    this.wdDir = null;
    switch (p.name) {
      case 'approach': {
        const close = Math.abs(c.sx) < LIGHT_REACH && Math.abs(c.sd) < 0.5;
        if (close) { this.tap('light'); this.route = {}; p.done = true; return; }
        if (p.how === 'superDash' && !p.used) { p.used = true; this.tap('dash'); return; }
        if (p.how === 'wavedash' && f.state !== 'jumpSquat' && (p.t % 14 === 1) && Math.abs(c.sx) > 2.2 && (p.wds = (p.wds ?? 0) + 1) <= 2) {
          this.wavedash(c.toward, Math.abs(c.sd) > 0.3 ? Math.sign(c.sd) * 0.6 : 0);
          return;
        }
        if (p.how === 'dash' && Math.abs(c.sx) > 2.6 && r === 'ground' && p.t % 18 === 1) {
          this.mx = c.toward;
          this.my = Math.abs(c.sd) > 0.3 ? Math.sign(c.sd) * 0.5 : 0;
          this.tap('dash', 2);
          return;
        }
        if (r === 'dash' && Math.abs(c.sx) < DASH_LIGHT_REACH) { this.tap('light'); this.route = {}; p.done = true; return; }
        this.approach(c, 0.95);
        return;
      }
      case 'pressure': {
        // pick the poke first: a throw when they sit in Guard (more often against someone who blocks a lot),
        // else a jab (delayed against parry-happy players) or the launcher; then walk to its spacing
        if (!p.act) {
          const guardy = (o.state === 'guard' ? 1 : 0.25) + Math.min(1, this.mem.blockAfterBlock * 0.1);
          p.act = R() < S.throw * guardy ? 'throw' : R() < 0.15 ? 'heavy' : 'light';
        }
        this.approach(c, p.act === 'throw' ? 0.75 : 0.95);
        const inRange = p.act === 'throw' ? this.inThrowRange(c) : Math.abs(c.sx) < LIGHT_REACH && Math.abs(c.sd) < 0.5;
        if (inRange && p.t > (this.parryHabit > 0.25 ? 8 : 2)) {
          // only grab what can be grabbed right now (a throw into block stun or a jump whiffs for 34 frames)
          if (p.act === 'throw' && !THROWABLE_NOW.has(o.state)) p.act = 'light';
          if (p.act === 'throw') this.throwNow();
          else this.tap(p.act);
          this.route = {};
          p.done = true;
        }
        return;
      }
      case 'guard':
        this.keep.add('guard');
        // fish for a parry every so often while they're in range (the lockout keeps it honest)
        if (c.dist < 2.2 && f.pad.frame - f.parryTry > PARRY.lockout + 4 && R() < 0.06) this.tap('guard', 3);
        // they like to throw: when they walk right up, spot dodge it (beats throws) or jab first
        if ((this.mem.throws ?? 0) > 1.5 && c.dist < 1.2 && (o.state === 'idle' || o.state === 'run') && f.state === 'guard' && R() < 0.05) {
          if (R() < 0.5) this.my = -1;
          else { this.keep.delete('guard'); this.tap('light'); this.route = {}; }
        }
        // showman: read their approach and spot dodge before anything starts (a jab or throw whiffs into it,
        // a delayed attack catches the recovery); a reaction would come too late for a 5-12 frame normal
        else if (S.show >= 0.5 && !p.read && c.dist < 1.7 && (o.state === 'run' || o.state === 'dash') && f.state === 'guard' && R() < 0.04 * this.show.bias('spotDodge')) {
          p.read = true;
          this.my = -1;
        }
        if (c.dist > 3.5) p.done = true;
        return;
      case 'bait': {
        // step out of their reach and wait for a whiff (the punish layer takes it from there)
        if (Math.abs(c.sx) < 2.3 && !p.backed && r === 'ground') {
          p.backed = true;
          if (R() < S.wavedash) this.wavedash(-c.toward, 0);
          else { this.mx = -c.toward; this.tap('dash', 2); }
          return;
        }
        this.approach(c, 2.4);
        return;
      }
      case 'space': {
        // footsies at the edge of their reach, with little wavedash steps in and out
        const want = Math.abs(c.sx) - p.gap;
        if (Math.abs(want) > 0.6 && p.t % 20 === 5 && R() < S.wavedash && !p.wd && (p.wd = true)) {
          this.wavedash(c.toward * Math.sign(want), Math.abs(c.sd) > 0.3 ? Math.sign(c.sd) * 0.5 : 0);
          return;
        }
        this.approach(c, p.gap);
        if (c.myRoom < 1.4) p.done = true; // cornered: stop backing up
        return;
      }
      case 'jumpin': {
        if (!p.jumped) {
          p.jumped = true;
          this.mx = c.toward;
          this.my = Math.abs(c.sd) > 0.3 ? Math.sign(c.sd) * 0.5 : 0;
          this.tap('jump', 2);
          return;
        }
        p.done = f.state !== 'jumpSquat' && !f.air;
        return;
      }
      case 'zone': {
        const sl = this.shotSlot();
        if (!sl || f.ki < 100 || p.fired) { p.done = true; return; }
        // line up in depth, then fire
        if (Math.abs(c.sd) > 0.5) { this.my = Math.sign(c.sd); return; }
        p.fired = true;
        this.special(sl, 2);
        return;
      }
      case 'charge':
        if (c.dist < 4.5 || f.ki >= p.kiGoal) { p.done = true; return; }
        this.holdCharge();
        return;
      case 'powerUp': {
        // make room first (a wavedash or back dash out), then charge; the charge stops by itself when they come
        if (f.ki >= p.kiGoal || (p.charged && c.dist < 4.5)) { p.done = true; return; }
        if (c.dist < 5 && !p.charged) {
          if (!p.moved) {
            p.moved = true;
            if (R() < S.wavedash) this.wavedash(-c.toward, 0);
            else { this.mx = -c.toward; this.tap('dash', 2); }
            return;
          }
          this.mx = -c.toward;
          if (c.myRoom < 1.2 || p.t > 60) p.charged = true; // cornered or slow: charge from here anyway
          return;
        }
        p.charged = true;
        this.holdCharge();
        return;
      }
      case 'mode':
        if (!p.fired && p.slot) { p.fired = true; this.special(p.slot, 2); }
        p.done = p.t > 4;
        return;
      case 'beam': {
        if (p.fired) { p.done = p.t > p.firedAt + 4; return; }
        if (f.ki < ULTIMATE.cost) { p.done = true; return; }
        // back off to beam range first (wavedash or dash away), then line up so it can't just walk out
        if (Math.abs(c.sx) < 3.4 && p.t < 50) {
          if (r === 'ground' && p.t % 16 === 1) {
            if (R() < S.wavedash) this.wavedash(-c.toward, 0);
            else { this.mx = -c.toward; this.tap('dash', 2); }
          } else this.mx = -c.toward;
          return;
        }
        if (Math.abs(c.sd) > 0.4 && p.t < 70) { this.my = Math.sign(c.sd); return; }
        p.fired = true;
        p.firedAt = p.t;
        this.tap('heavy', 3);
        this.tap('special', 3);
        return;
      }
      case 'kit': {
        // mid-range kit tools: pull them in, teleport behind, a rush from the edge of its range, a dive leap;
        // the one the viewer hasn't seen is likelier
        const opts = this.kitOptions(c);
        if (opts.length && !p.fired) {
          p.fired = true;
          const w = {};
          for (const k of opts) w[k.slot] = k.w;
          this.special(pickW(w), 2);
        }
        p.done = true;
        return;
      }
      case 'airShot': {
        // jump (backward when they're close), the air special comes out near the top (airStep)
        if (p.jumped) { p.done = f.state !== 'jumpSquat' && !f.air; return; }
        if (Math.abs(c.sd) > 0.5 && p.t < 20) { this.my = Math.sign(c.sd); return; }
        p.jumped = true;
        const dive = specialFor(f.def, p.slot)?.kind === 'dive';
        this.mx = dive ? c.toward : c.dist < 3.5 ? -c.toward : 0;
        this.tap('jump', 2);
        return;
      }
      case 'big': {
        if (p.fired) { p.done = p.t > p.firedAt + 4; return; }
        if (f.ki < 300 || !p.tool) { p.done = true; return; }
        // a flurry needs them in its dash range; the rest work from anywhere (Kirin marks their spot,
        // Amaterasu needs only sight, the Domain takes the whole stage)
        const S = SUPERS[p.tool === 'super' ? kitOf(f.def).super : kitOf(f.def).ultimate];
        if (S?.kind === 'flurry' && (c.dist > (S.range ?? 6) - 1 || Math.abs(c.sd) > 0.8) && p.t < 30) { this.approach(c, 2.5); return; }
        // the pounce: inside its reach, in their lane; Whirlwind: close enough that they'll swing; the orb: room
        if (S?.kind === 'rampage' && (c.dist > (S.range ?? 8) - 1 || Math.abs(c.sd) > 0.5) && p.t < 30) { this.approach(c, 3.5); return; }
        if (S?.kind === 'reflex' && c.dist > 4 && p.t < 30) { this.approach(c, 2.5); return; }
        if (S?.kind === 'orb' && (Math.abs(c.sx) < 2.8 || Math.abs(c.sd) > 0.6) && p.t < 40) {
          if (Math.abs(c.sx) < 2.8) this.mx = -c.toward;
          if (Math.abs(c.sd) > 0.6) this.my = Math.sign(c.sd);
          return;
        }
        p.fired = true;
        p.firedAt = p.t;
        this.fireBig(p.tool);
        return;
      }
    }
  }

  // ------------------------------------------------------------------ clashes (ADR 0017)
  // play the chart: every press planned once at its style's timing, alternating Light and Heavy
  playClash(game) {
    if (this.beat?.clash !== game.clash) this.beat = new BeatPlan(game.clash, this.S.beat);
    for (const p of this.beat.due(game.clash.timer + 1)) this.tap(this.beat.button(), p.len);
  }
}

mixDefense(MasterBrain); // the defense showcase's methods (ADR 0025, aiDefense.js)

// Projectile facts the brain plans with: speed (units/s), range (speed × life, plus the hand), damage,
// stun, and whether it bounces the victim off the barrier.
const PROJ_INFO = Object.fromEntries(Object.entries(PROJECTILES).map(([id, P]) => [id, {
  speed: P.speed, range: P.speed * P.life + 0.8, dmg: P.dmg, hitstun: P.hitstun ?? (P.launch ? 40 : 0), wallBounce: !!P.wallBounce,
}]));
