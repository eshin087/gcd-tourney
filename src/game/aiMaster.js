// IMPOSSIBLE CPU (ADR 0014). A frame-data-aware brain built to show what the engine allows: it reads the
// opponent's move, frame and position (what a player sees on screen, never their pad), times parries,
// spot dodges and air dodges, punishes whiffs and blocked big moves, runs each kit's max-damage route
// with a lethal check, spaces with wavedashes and times meaty attacks on wake-up.
// It still only presses buttons on its Pad (design pillar 4). Fairness lives in STYLES: it only "sees" an
// attack after `react` frames (a 5-frame jab is a guess, like for a human), it goes for a parry only part
// of the time, and it has habits a player can learn. CPU vs CPU runs the louder 'showman' style so a
// spectated fight keeps moving and the big moves come out.
import { MOVES, ULTIMATE, VANISH, SUPERS, DEFENSE, SUPER_DASH, PROJECTILES } from './moves.js';
import { specialFor, kitOf } from './kit.js';
import { ARENA_LIMIT } from './constants.js';

const BUTTONS = ['light', 'heavy', 'special', 'jump', 'guard', 'dash', 'super'];
const SLOTS = ['neutral', 'forward', 'up', 'down', 'back'];
const PARRY = DEFENSE.parry, SPOT = DEFENSE.spotDodge, WD = DEFENSE.wavedash;
// screen distance a light1 reliably connects from (hit boxes come from the art: ~1.25 on the packs)
const LIGHT_REACH = 1.25;
const DASH_LIGHT_REACH = 1.55; // the light out of a dash lunges further

// react   frames before it knows an attack started (humans: ~15; its fastest answer to a 5-frame jab is a guess)
// parry   chance to go for a parry when a blockable attack it saw is coming (else dodge / block / counter)
// dodge   chance to spot dodge / air dodge a big move instead of blocking it
// aggro   how much it wants to be in your face; flair: how often it spends on the loud option (vanish,
//         supers as enders, counter-beams); tech: chance to air tech at the first legal frame
export const STYLES = {
  impossible: { react: 7, parry: 0.5, dodge: 0.4, aggro: 0.7, flair: 0.45, mash: 13, tech: 0.85, wavedash: 0.55, antiAir: 0.75 },
  showman: { react: 8, parry: 0.4, dodge: 0.4, aggro: 0.78, flair: 0.9, mash: 12, tech: 0.7, wavedash: 0.75, antiAir: 0.6 },
};

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
    this.mashAcc = 0;
    this.oppMove = null; // to give every opponent move a serial (threat identity)
    this.oppSerial = 0;
    this.wake = 0;
    this.techRoll = null;
    this.route = {}; // per-combo choices
    // habits of the opponent, slowly forgotten: what it does after blocking, how often it jumps in, parries
    this.mem = { parries: 0, contacts: 0, jumps: 0, mashAfterBlock: 0, blockAfterBlock: 0 };
    this.lastOppState = '';
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
    if (game.state === 'roundIntro' && !this.roundSet) {
      // per-round temperament: whether it saves up for the big three-bar finish this round
      this.roundSet = true;
      this.saving = Math.random() < this.S.flair * 0.55;
      this.plan = null;
      this.resp = null;
      this.route = {};
    } else if (game.state === 'fight') this.roundSet = false;
    if (game.clash) this.mashClash();
    else if (game.inputLive && !f.ko && !o.ko) this.think(game);
    this.flush();
  }

  think(game) {
    const f = this.f;
    const c = this.sense(game);
    this.trackOpponent(game, c);
    if (game.freeze > 0) return this.frozen(game, c);
    this.clock++;
    if (this.recover(game, c)) return;
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
    if (f.state === 'block') { this.blockStun(game, c); return; }
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
  frozen(game, c) {
    const f = this.f, o = f.opp;
    const punish = o.state === 'held' && o.heldT > 6 && c.dist < LIGHT_REACH + 0.6 && (f.state === 'guard' || f.state === 'idle');
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
    if (f.state !== 'down') this.wake = 0;
    switch (f.state) {
      case 'launched':
        if (this.techRoll === null) this.techRoll = Math.random() < S.tech;
        // tech at the first legal frame (a human mashes), or ride it out and tech late
        if (f.airStun <= 0 && f.pos.y > 0.4 && !f.heldT && (this.techRoll || f.pos.y < 1.2)) this.tap('jump', 1);
        return true;
      case 'down':
        // vary the wake-up so meaty timing is a guess
        if (!this.wake) this.wake = 16 + Math.floor(Math.random() * 16);
        if (f.t >= this.wake && !f.ko) this.tap('light', 1);
        return true;
      case 'hitstun':
        // block the moment the stun ends if they're still on top of us
        if (f.t >= f.stun - 2 && c.dist < 2.5) this.keep.add('guard');
        return true;
      case 'held':
      case 'getup':
      case 'airRecover':
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
    if (this.plan?.name === 'jumpin') {
      this.mx = c.toward;
      // jump-in mix-up: air dodge on the way down, through a launcher, and waveland beside them
      if (!f.airDodged && f.vel.y < 0 && f.pos.y < 1.7 && Math.abs(c.sx) < 2.6 && Math.random() < this.S.flair * 0.06) this.tap('guard', 2);
    }
    return true;
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
    }
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
      default:
        // launchers, spikes, wall bounces, vanish kicks, rush specials: chase with the super dash,
        // or vanish behind them when the dash is spent
        if (t >= B) this.extend(game, c);
    }
  }

  // light3 on hit: a kit special (ender or extender), or the launcher route
  branchGround(game, c, m, t) {
    const f = this.f, o = f.opp;
    const sp = o.state === 'hitstun' ? this.comboSpecial(c, o.stun - o.t) : null;
    if (sp && this.spend(sp.m.cost, sp.value)) {
      this.special(sp.slot, 2);
      this.route.special = sp.slot;
      return;
    }
    // launcher (more hits, a ground-bounce loop) unless they're right on the wall, where light4 bounces
    if (c.oppRoom < 1.2 && !this.route.l4) {
      this.route.l4 = true;
      if (t >= m.cancel - 1) this.tap('light');
      return;
    }
    this.tap('heavy');
  }

  // airLight2 on hit: spike for a ground bounce while the super dash is still there to follow it,
  // otherwise airLight3 (wall bounce) when the barrier is close behind them, else spike anyway
  branchAir(game, c, m, t) {
    const f = this.f, o = f.opp;
    const spike = f.airDashes === 0 || c.oppRoom > 4 || o.pos.y > 2.2;
    if (spike) this.tap('heavy');
    else if (t >= m.cancel - 1) this.tap('light');
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
      this.route.blockPlan = R() < 0.5 - parryish * 0.4 ? 'string' : R() < 0.5 ? 'stop' : 'vanish';
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
    }
    const sp = specialFor(f.def, 'neutral');
    const left = o.state === 'hitstun' ? o.stun - o.t : 0;
    if (sp?.kind === 'rush' && f.ki >= sp.cost && !f.move?.air && f.state === 'attack' && this.specialHitTime(sp, c) <= left - 1) {
      take('special', sp.dmg * scale(sp.minScale ?? 0.4), 'neutral');
    }
    return best;
  }

  // Frames from pressing a special to its first hit landing, or null for kinds that don't hit directly.
  specialHitTime(m, c) {
    if (m.kind === 'rush') return m.startup + Math.max(0, Math.abs(c.sx) - (m.reach ?? 1.3)) / m.rush * 60 + 1;
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
  // worth of spending the ki.
  comboSpecial(c, left = 99) {
    const f = this.f, seen = new Set();
    let best = null;
    for (const slot of SLOTS) {
      const m = specialFor(f.def, slot);
      if (!m || seen.has(m) || f.ki < (m.cost ?? 0)) continue;
      seen.add(m);
      const hitIn = this.specialHitTime(m, c);
      if (hitIn == null || hitIn > left - 1) continue;
      let v = 0;
      if (m.kind === 'rush') v = m.dmg * (m.vortex ? 1.2 : 1) - (m.selfDmg ?? 0);
      else if (m.kind === 'shot') {
        const P = m.proj && PROJ_INFO[m.proj];
        if (P) v = P.wallBounce ? P.dmg * 1.3 : P.hitstun >= 30 ? P.dmg * 1.2 : 0;
      } else if (m.kind === 'teleport' && m.follow) v = (MOVES[m.follow]?.dmg ?? 0) * 1.3;
      if (v > 0 && (!best || v > best.value)) best = { slot, m, value: v };
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
    // some rounds it saves up for a three-bar finish (supers, ultimates, beam clashes)
    if (this.saving && f.ki < 300 && cost < 300) return value > 200 && Math.random() < 0.3;
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
          // a rush connects once it has run the gap, not when its active phase starts
          const run = m.rush ? Math.max(0, Math.abs(c.sx) - (m.reach ?? 1.3) - 0.2) / m.rush * 60 : 0;
          add({ key: 'm' + this.oppSerial, kind: 'melee', frames: Math.max(0, A - o.t) + run + delay, len: B - Math.max(o.t, A), m, big: !!(m.big || m.special), unblockable: !!m.unblockable, rush: !!m.rush });
        }
      }
    }
    if (o.state === 'superDash' && o.t >= Math.min(S.react, 4)) {
      add({ key: 'sd' + this.oppSerial, kind: 'melee', frames: Math.max(0, (Math.hypot(c.dist, c.dy) - 1.0) / SUPER_DASH.speed * 60), len: 3, m: SUPER_DASH, big: true });
    }
    if (o.state === 'vanish') {
      add({ key: 'v' + this.oppSerial, kind: 'melee', frames: Math.max(0, VANISH.hideFrames - o.t) + 7, len: 5, m: MOVES.vanishKick, big: true, behind: true });
    }
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
        add({ key: 'p' + p._aid, kind: 'proj', frames: tc * 60, len: 3, p, big: !!p.P.big });
      }
    }
    for (const v of game.vortices) {
      if (v.owner !== o || v.dead) continue;
      if (Math.hypot(v.pos.x - f.pos.x, v.pos.z - f.pos.z) < (v.m.radius ?? 2.2) + 0.6) add({ key: 'vx' + this.oppSerial, kind: 'proj', frames: 2, len: 8, vortex: true });
    }
    if (o.state === 'beamCharge' && o.t >= S.react) {
      add({ key: 'b' + this.oppSerial, kind: 'beam', frames: o.windup - o.t + (c.dist / ULTIMATE.speed) * 60, len: ULTIMATE.duration, charging: true });
    }
    for (const b of game.beams) {
      if (b.owner !== o || b.dead || b.clash) continue;
      const ax = f.pos.x - b.origin.x, az = f.pos.z - b.origin.z;
      const along = ax * b.dir.x + az * b.dir.z;
      const perp = Math.hypot(ax - b.dir.x * along, az - b.dir.z * along);
      if (along > -0.5 && perp < b.width * 0.5 + 0.9) add({ key: 'bf' + this.oppSerial, kind: 'beam', frames: Math.max(0, (along - b.len) / ULTIMATE.speed * 60), len: 30 });
    }
    if (o.state === 'kit' && o.kitState) add(this.kitThreat(game, c, o.kitState));
    return best;
  }

  kitThreat(game, c, k) {
    const f = this.f, o = f.opp, m = k.m;
    switch (k.kind) {
      case 'flurry':
        if (k.phase === 'dash' || k.phase === 'flash') return { key: 'fl' + this.oppSerial, kind: 'grab', frames: Math.max(0, (c.dist - 1.4) / 24 * 60), len: 4, unblockable: true, big: true };
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
        return { key: 'dv' + this.oppSerial + k.phase, kind: 'melee', frames: Math.max(0, fall), len: 2, m: hit, big: true };
      }
      case 'teleport':
        if (m.follow && !k.arrived) return { key: 'tp' + this.oppSerial, kind: 'melee', frames: Math.max(0, (m.startup ?? 0) + m.hide - o.t) + 3, len: 4, m: MOVES[m.follow], big: true, behind: true };
        return null;
    }
    return null;
  }

  // Pick the answer once per threat. Order of preference: the loud answers the style can afford,
  // a parry when the read is clean, a dodge against big swings, otherwise block.
  chooseDefense(game, c, th) {
    const f = this.f, o = f.opp, S = this.S, R = Math.random;
    const r = c.ready;
    const d = { key: th.key, type: 'none' };
    if (!r) return d;
    const ki = f.ki;
    const now = f.pad.frame;
    const lockFree = (lead) => now + lead - f.parryTry >= PARRY.lockout;
    if (th.kind === 'beam') {
      if (th.charging && ki >= ULTIMATE.cost && o.state === 'beamCharge' && R() < 0.4 + S.flair * 0.5) return { ...d, type: 'counterBeam' };
      if (ki >= VANISH.cost && R() < 0.5 + S.flair * 0.3) return { ...d, type: 'vanish', at: 10 };
      return { ...d, type: r === 'air' ? 'none' : 'sidestep', at: 30 };
    }
    if (th.unblockable) {
      if (th.kind === 'zone') return { ...d, type: 'dashOut' };
      if (ki >= VANISH.cost && R() < 0.75) return { ...d, type: 'vanish', at: th.rangeless ? 6 : 4 };
      if (r === 'ground' && th.rangeless) return { ...d, type: 'dodge', at: 6 };
      return { ...d, type: r === 'air' ? 'airdodge' : 'sidestep', at: 5 };
    }
    if (r === 'air') return R() < S.dodge + 0.25 ? { ...d, type: 'airdodge', at: 3 } : d;
    if (r === 'dash') return d;
    const big = th.big || th.p?.P?.big;
    // a projectile we can plow through with the super dash and hit its thrower
    if (th.kind === 'proj' && !th.vortex && r === 'ground' && f.airDashes === 0 && c.dist < 7 && R() < 0.25 + S.flair * 0.25) return { ...d, type: 'superDash', at: 12 };
    if (lockFree(Math.max(0, th.frames - 2)) && R() < S.parry * (big ? 1.2 : 1)) return { ...d, type: 'parry' };
    // dodge only what leaves something to punish: its active + recovery outlasts our dodge (a hop launcher
    // lands and recovers first, so that one gets parried or blocked)
    const punishable = th.m && !th.m.hop && (th.m.active ?? 0) + (th.m.recovery ?? 0) >= SPOT.len;
    if (th.kind === 'melee' && big && punishable && r === 'ground' && R() < S.dodge * 1.4) return { ...d, type: 'dodge', at: f.state === 'guard' ? 4 : 5 };
    const cSlot = ['down', 'back'].find((sl) => specialFor(f.def, sl)?.kind === 'counter');
    if (th.kind === 'melee' && cSlot && r === 'ground' && ki >= specialFor(f.def, cSlot).cost + 50 && R() < S.flair * 0.3) return { ...d, type: 'counter', slot: cSlot };
    if (th.kind === 'melee' && big && ki >= VANISH.cost * 2 && R() < S.flair * 0.25) return { ...d, type: 'vanish', at: 4 };
    return { ...d, type: 'block' };
  }

  execDefense(game, c, th, d) {
    const f = this.f, o = f.opp;
    const fr = th.frames;
    d.until = this.clock + th.len + 6;
    switch (d.type) {
      case 'none':
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
        }
        if (d.pressed && this.hold.guard <= 0) this.keep.add('guard');
        return true;
      }
      case 'dodge':
        if (!d.go && fr <= d.at) d.go = true;
        if (!d.go) return false;
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
        }
        return true;
      case 'vanish':
        if (fr > d.at || d.done) return d.done;
        d.done = true;
        this.keep.add('guard');
        this.tap('special', 2);
        return true;
      case 'counter':
        if (d.done) return true;
        if (fr <= 4) {
          d.done = true;
          this.special(d.slot, 1);
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
      case 'dodge': {
        const len = SPOT.len + (o.dodgeStale || 0) * SPOT.stale;
        return { from: Math.max(0, o.invuln), to: len - o.t + lag };
      }
      case 'charge':
        return { from: 0, to: 9 };
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
    // keep a combo going after a shot or a super dash contact
    if ((o.state === 'hitstun' || o.state === 'launched') && o.combo > 0 && !o.ko && o.hittable) return this.followUp(game, c);
    if (o.state === 'kit' && o.counterT > 0) { this.backOff(c); return true; } // never swing into a counter stance
    if (o.state === 'beamFire') return this.punishBeam(game, c);
    const w = this.opening(o);
    if (!w || w.to <= 0) return false;
    // lethal from anywhere: a super flash freezes the world, so its travel fits any opening
    if (f.ki >= 300 && this.superPunish(game, c, w)) return true;
    const sx = Math.abs(c.sx), lane = Math.abs(c.sd) < 0.9;
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
    const show = Math.random() < this.S.flair * 0.12;
    if (!kills && !show) return false;
    if (S?.kind === 'flurry' && c.dist < 5.4) { this.tap('super'); return true; }
    if (S?.kind === 'domain' && c.dist < 8) { this.tap('super'); return true; }
    if (SUPERS[K.ultimate]?.kind === 'ignite') { this.tap('heavy'); this.tap('special'); return true; }
    if (!K.ultimate && w.to > 40 && c.dist > 2.5 && Math.abs(c.sd) < 1) { this.tap('heavy'); this.tap('special'); return true; } // beam
    return false;
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

  // ------------------------------------------------------------------ okizeme, anti-air
  situational(game, c) {
    const f = this.f, o = f.opp, S = this.S, r = c.ready;
    if (r !== 'ground') return false;
    // wake-up: stand next to them and time a meaty light so its active frames meet the end of the invincibility
    if (o.state === 'down' || o.state === 'getup' || (o.invuln > 0 && o.state === 'idle')) {
      if (this.okiPlan == null) this.okiPlan = Math.random() < 0.6 + S.aggro * 0.3 ? 'meaty' : Math.random() < 0.5 ? 'bait' : 'charge';
      if (this.okiPlan === 'charge' && c.dist > 3.5 && f.ki < 300) { this.keep.add('special'); return true; }
      if (this.okiPlan === 'bait') { this.approach(c, 2.2); if (o.state === 'getup' && o.t > 14) this.keep.add('guard'); return true; }
      const there = this.approach(c, 0.95);
      if (there && o.state !== 'down' && o.invuln > 0 && o.invuln <= MOVES.light1.startup + 1) this.tap('light');
      return true;
    }
    this.okiPlan = null;
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
        if (dive?.kind === 'dive' && dive.riseHit && f.ki >= dive.cost + 100 && Math.random() < S.flair * 0.4) this.special('up', 2);
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
    if (!this.plan || this.plan.t >= this.plan.len || this.plan.done) this.plan = this.choosePlan(game, c);
    this.plan.t++;
    this.runPlan(game, c, this.plan);
  }

  choosePlan(game, c) {
    const f = this.f, o = f.opp, S = this.S, R = Math.random;
    const dist = c.dist, ki = f.ki;
    const lead = (f.hp - o.hp) / 1000;
    const w = {};
    const hasShot = this.shotSlot() != null;
    const modeSlot = SLOTS.find((sl) => specialFor(f.def, sl)?.kind === 'mode');
    const modeReady = modeSlot && !f.mode && ki >= specialFor(f.def, modeSlot).cost + 50 && !this.saving;
    const spare = !this.saving || ki >= 300; // saving up: no ki on pokes
    if (dist > 5.5) {
      w.approach = 1.6 + S.aggro * 2;
      w.zone = hasShot && ki >= 100 && spare ? 1.2 : 0;
      w.charge = ki < 300 ? 1.4 - S.aggro * 0.6 + (this.saving ? 0.8 : 0) : 0;
      w.mode = modeReady ? 2.5 : 0;
    } else if (dist > 2.4) {
      w.approach = 1.4 + S.aggro * 2;
      w.space = 1.3 - S.aggro * 0.5;
      w.jumpin = 0.5 + S.aggro * 0.5 - Math.min(0.6, this.mem.jumps * 0.02);
      w.zone = hasShot && ki >= 100 && spare ? 0.6 : 0;
      w.kit = ki >= 150 && spare ? 0.4 + S.flair * 0.6 : 0;
      w.mode = modeReady && dist > 4 ? 1 : 0;
    } else {
      w.pressure = 1.8 + S.aggro * 3;
      w.guard = 1.4 - S.aggro;
      w.bait = 0.6 + this.mem.mashAfterBlock * 0.05;
      w.space = 0.4;
    }
    // three bars at range: the ultimate from afar (an opponent with three bars can fire back: CLASH)
    if (ki >= ULTIMATE.cost && (dist > 3.5 || this.saving)) w.beam = S.flair * (o.ki >= ULTIMATE.cost ? 2.5 : 1.2) + (this.saving ? 2.5 : 0);
    if (lead > 0.25 && game.timeLeft < 30) { w.space = (w.space ?? 0) + 1.5; w.guard = (w.guard ?? 0) + 1; }
    if (lead < -0.3) { w.pressure = (w.pressure ?? 0) * 1.3; w.approach = (w.approach ?? 0) * 1.3; }
    let total = 0;
    for (const k in w) total += Math.max(0, w[k]);
    let pick = R() * total, name = 'approach';
    for (const k in w) if ((pick -= Math.max(0, w[k])) <= 0) { name = k; break; }
    const len = { approach: 70, zone: 50, charge: 70 + R() * 50, mode: 30, space: 40 + R() * 40, jumpin: 45, kit: 30, pressure: 50, guard: 25 + R() * 30, bait: 40, beam: 90 }[name];
    const p = { name, t: 0, len, done: false };
    if (name === 'approach') {
      const m = R();
      p.how = dist > 5 && f.airDashes === 0 && m < 0.25 ? 'superDash' : m < 0.25 + S.wavedash * 0.5 ? 'wavedash' : m < 0.75 ? 'dash' : 'walk';
    }
    if (name === 'charge') p.kiGoal = Math.min(300, f.ki + 100 + R() * 100);
    if (name === 'space') p.gap = 2.6 + R() * 0.8;
    if (name === 'mode') p.slot = modeSlot;
    return p;
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
        if (p.how === 'wavedash' && f.state !== 'jumpSquat' && (p.t % 14 === 1) && Math.abs(c.sx) > 2.2) {
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
        this.approach(c, 0.95);
        if (Math.abs(c.sx) < LIGHT_REACH && Math.abs(c.sd) < 0.5) {
          // jab, or a delayed jab to catch a parry attempt, or the launcher straight away
          if (p.t > (this.parryHabit > 0.25 ? 8 : 2)) {
            this.tap(R() < 0.15 ? 'heavy' : 'light');
            this.route = {};
            p.done = true;
          }
        }
        return;
      }
      case 'guard':
        this.keep.add('guard');
        // fish for a parry every so often while they're in range (the lockout keeps it honest)
        if (c.dist < 2.2 && f.pad.frame - f.parryTry > PARRY.lockout + 4 && R() < 0.06) this.tap('guard', 3);
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
        if (Math.abs(want) > 0.6 && p.t % 20 === 5 && R() < S.wavedash) {
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
        this.keep.add('special');
        return;
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
        // mid-range kit tools: pull them in, teleport behind, or a rush from the edge of its range
        const opts = [];
        for (const sl of SLOTS) {
          const m = specialFor(f.def, sl);
          if (!m || f.ki < (m.cost ?? 0) + 50) continue;
          if (m.kind === 'pull' && c.dist > 1.4 && c.dist < 4.5) opts.push(sl);
          if (m.kind === 'teleport' && m.follow && c.dist > 2.5) opts.push(sl);
          if (m.kind === 'rush' && c.dist > 2 && c.dist < 5.5 && Math.abs(c.sd) < 0.6) opts.push(sl);
        }
        if (opts.length && !p.fired) { p.fired = true; this.special(opts[Math.floor(R() * opts.length)], 2); }
        p.done = true;
        return;
      }
    }
  }

  // ------------------------------------------------------------------ beam clash
  mashClash() {
    this.mashAcc += (this.S.mash * (0.85 + Math.random() * 0.3)) / 60;
    if (this.mashAcc >= 1) {
      this.mashAcc -= 1;
      this.mashAlt = !this.mashAlt;
      this.tap(this.mashAlt ? 'light' : 'heavy', 1);
    }
  }
}

// Projectile facts the brain plans with: speed (units/s), range (speed × life, plus the hand), damage,
// stun, and whether it bounces the victim off the barrier.
const PROJ_INFO = Object.fromEntries(Object.entries(PROJECTILES).map(([id, P]) => [id, {
  speed: P.speed, range: P.speed * P.life + 0.8, dmg: P.dmg, hitstun: P.hitstun ?? (P.launch ? 40 : 0), wallBounce: !!P.wallBounce,
}]));
