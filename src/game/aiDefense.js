// CPU defense showcase (ADR 0025): the parts of the frame-data brain (MasterBrain, aiMaster.js) that make its defense
// worth watching. Its flashy parry punishes (a rally the other side can parry back), the reversals it plans while stuck
// (at the end of hit stun, a get-up or block stun: a gap parry, a dodge, a back dash), its guesses at a blocked
// string, and its escapes after an air tech. The knobs are STYLES' (read with ?? 0, so IMPOSSIBLE and INSANE skip
// them) and the Showcase's defense persona (aiShow.js). Kept in their own module so the brain's file stays
// readable; mixDefense() adds the methods to MasterBrain, and they press buttons on its Pad like the rest of it.
import { MOVES, VANISH, DEFENSE } from './moves.js';
import { specialFor } from './kit.js';
import { specialId, pickW } from './aiShow.js';
import { FULL_HOP } from './aiNormals.js';

const PARRY = DEFENSE.parry, SPOT = DEFENSE.spotDodge;
const SLOTS = ['neutral', 'forward', 'up', 'down', 'back'];
const PUNISH_REACH = 1.85; // a jab (reliable to ~1.25) and the step its lunge takes

// The frame of move `m` from which fighter `o`'s drawn strike reaches out: a hit box in front of the body (x1 of at
// least REACH_X). Art can draw the strike late in the active frames (Sasuke's Chidori: its hand is behind him for the
// first two active frames), and a parry or dodge timed to the active phase's start would come too early. Read from the
// sprite sheet's boxes with the same phase-to-frame mapping as SpriteActor.setPhase; cached per sheet and animation.
const REACH_X = 0.3;
const reachCache = new WeakMap();
export function reachT(o, m) {
  const A = m.startup, asset = o.asset;
  if (!m.anim || !m.active || !asset?.anim) return A;
  let per = reachCache.get(asset);
  if (!per) reachCache.set(asset, (per = new Map()));
  const key = m.anim + ':' + A + ':' + m.active;
  if (per.has(key)) return per.get(key);
  let at = A;
  const a = asset.anim(m.anim);
  if (a?.frames?.length && a.phases?.length === 3) {
    const start = a.phases[0], cnt = Math.max(1, a.phases[1]);
    let found = false;
    for (let t = A; t < A + m.active && !found; t++) {
      const idx = Math.min(a.frames.length - 1, start + Math.min(cnt - 1, Math.floor(((t - A) / m.active) * cnt)));
      const boxes = asset.boxes(a.frames[idx], 'hit', 1); // null: no box data, so the engine hits by reach at once
      if (!boxes || boxes.some((b) => b.x1 >= REACH_X)) { at = t; found = true; }
    }
  }
  per.set(key, at);
  return at;
}

class Defense {
  // The showman's punish for a parry it just made (ADR 0025): a jab (the sure one), a heavy into the launcher route,
  // a throw (a staggered fighter can be grabbed), a vanish (it lands in 11 live frames, inside the stagger), or a
  // rally: a hit that lands only after they have recovered, so they can parry it back (a parry exchange, the anime
  // moment; spectated CPU vs CPU only, `rally` is 0 elsewhere), rarer with each rally of the exchange.
  pickParryPunish(c) {
    const f = this.f, o = f.opp, S = this.S, sh = this.show;
    const sx = Math.abs(c.sx), lane = Math.abs(c.sd) < 0.9;
    // an exchange ends when a real hit lands (anyone's health drops) or after 3 s without a rally
    const hp = f.hp + o.hp;
    if (this.clock - (this.rallyAt ?? -999) > 180 || hp < (this.rallyHp ?? hp)) this.rallyN = 0;
    const w = {};
    if (lane && sx < PUNISH_REACH) w.jab = 1;
    if (lane && sx < 1.3 && o.heldT >= 14) w.heavy = 0.6;
    if (this.inThrowRange(c)) w.throw = 0.4;
    if (f.ki >= VANISH.cost && this.spend(VANISH.cost, 90)) w.vanish = 0.7 * sh.bias('vanish');
    let slot;
    if ((this.rallyN ?? 0) < (S.rallyMax ?? 0) && lane) {
      const k = S.rally * 0.5 ** (this.rallyN ?? 0);
      slot = this.rallySlot(c, o.heldT);
      w.rally = k * sh.pm('rally');
      // or vanish behind them as they recover: they can vanish too (the vanish war), parry or dodge the kick
      if (f.ki >= VANISH.cost) w.rallyVanish = k * 0.5 * sh.pm('vanish');
    }
    let type = pickW(w);
    if (!type) return null;
    sh.logDef('punish:' + type);
    if (type === 'rallyVanish') { type = 'rally'; slot = 'vanish'; }
    return { type, slot, buffered: type === 'jab' || type === 'heavy' || type === 'throw', since: this.clock };
  }

  // What to rally with: a raw rush or shot that lands at least 6 frames after their stagger ends (time to see it and
  // answer; the drawn strike's frame counts, reachT), if the ki policy allows, else (null) a heavy timed so they see it
  // coming as they recover. (Not a rising dive: its rise hits at point blank, inside the stagger.)
  rallySlot(c, heldT) {
    const f = this.f, seen = new Set(), w = {};
    for (const slot of SLOTS) {
      const m = specialFor(f.def, slot);
      if (!m || seen.has(m) || f.ki < (m.cost ?? 0)) continue;
      seen.add(m);
      let t = null;
      if (m.kind === 'rush' && Math.abs(c.sd) < 0.6) t = Math.max(this.specialHitTime(m, c, false), reachT(f, m) + 1);
      else if (m.kind === 'shot') t = this.specialHitTime(m, c, false);
      if (t != null && t >= heldT + 6) w[slot] = this.show.bias(specialId(m));
    }
    const slot = pickW(w);
    // worth a bar to the showman (spend: even while it saves for a three-bar move, now and then)
    return slot && this.spend(specialFor(f.def, slot).cost ?? 0, 250) ? slot : null;
  }

  // First live frame after the parry freeze: the vanish or the rally (presses made during a freeze are lost). A special
  // fires on its release a few frames later, so until it is out nothing else may press (the punish layer would jab
  // over it); a heavy rally waits for them to recover first.
  parryPunish(game, c) {
    const P = this.pendingPunish, f = this.f, o = f.opp;
    if (P.pressed != null) {
      if (this.clock - P.pressed < 5 && f.state !== 'attack' && f.state !== 'kit') return true;
      this.pendingPunish = null;
      return false;
    }
    if (P.waiting) {
      // a heavy swung so it is already in sight (past their reaction time) on their first free frame, so they answer it
      // instead of jabbing first; a vanish timed so they are free a few frames before the kick lands
      if (this.clock - P.since > 50 || (f.state !== 'idle' && f.state !== 'guard' && f.state !== 'run')) { this.pendingPunish = null; return false; }
      const lead = P.slot === 'vanish' ? VANISH.hideFrames + MOVES.vanishKick.startup - 6 : MOVES.heavy.startup - 6;
      if (o.state === 'held' && o.heldT > lead) { if (!P.slot) this.approach(c, 1); return true; }
      P.pressed = this.clock;
      if (P.slot === 'vanish') { this.keep.add('guard'); this.tap('special', 2); } else this.tap('heavy');
      return true;
    }
    if (o.state !== 'held' || (f.state !== 'guard' && f.state !== 'idle')) { this.pendingPunish = null; return false; }
    this.route = {};
    this.show.logDef('punish:' + P.type, true);
    if (P.type === 'vanish') {
      this.pendingPunish = null;
      this.keep.add('guard');
      this.tap('special', 2);
      return true;
    }
    if (P.type === 'rally') {
      if (P.slot && P.slot !== 'vanish') {
        P.pressed = this.clock;
        this.special(P.slot, 2);
      } else P.waiting = true;
      this.rallyN = (this.rallyN ?? 0) + 1;
      this.rallyAt = this.clock;
      this.rallyHp = f.hp + o.hp;
      this.show.rallies++;
      return true;
    }
    this.pendingPunish = null;
    return false;
  }

  // ------------------------------------------------------------------ reversals and reads
  // Gap reversal: once per hit-stun entry, plan an answer for the moment the stun ends. A true combo's next hit
  // lands inside the stun, so only a gap (a dropped link, a slow follow-up: the blue counter's case) gets escaped:
  // a parry press on the stun's last frame, or a spot dodge or a back dash on the first free one.
  gapEscape(c) {
    const f = this.f, S = this.S, sh = this.show;
    if (!S.gapEscape) return false;
    if (this.gapKey !== f.combo) {
      this.gapKey = f.combo;
      this.gapPick = null;
      if (c.dist < 3 && Math.random() < S.gapEscape * sh.pm('escape')) {
        const lockFree = f.pad.frame + (f.stun - f.t) - f.parryTry >= PARRY.lockout;
        this.gapPick = pickW({
          parry: lockFree ? sh.bias('parry') * sh.pm('parry') : 0,
          dodge: 0.6 * Math.sqrt(sh.bias('spotDodge')) * sh.pm('dodge') * this.staleK(),
          backstep: c.myRoom > 2 ? 0.5 * Math.sqrt(sh.bias('backstep')) * sh.pm('backstep') : 0,
          guard: sh.pm('block'),
        });
        if (this.gapPick) sh.logDef('gap:' + this.gapPick);
      }
    }
    const p = this.gapPick;
    if (!p || p === 'guard') return false;
    // hands off until the stun's last frame (a Guard held now would spend the press); this frame's update ends it
    if (f.t + 1 < f.stun || f.hitstop > 0) return true;
    this.gapPick = null;
    this.rev = this.newRev(p === 'parry' ? 'hold' : p, 'hitstun', p === 'parry' ? 8 : 6);
    if (p === 'parry') { this.tap('guard', 4); sh.logDef('gap:parry', true); }
    return true;
  }

  // Wake-up read: the get-up is ending with them close and coming in (a meaty on the way): a parry timed to the end
  // of the wake-up invulnerability, a back dash or wavedash out, a back jump, or a plain block.
  wakeRead(c) {
    const f = this.f, o = f.opp, S = this.S, sh = this.show;
    if (f.t <= 1) this.wakeDone = false;
    if (!S.gapEscape || this.wakeDone || f.t + 1 < 17 || f.ko) return;
    this.wakeDone = true;
    const coming = c.dist < 2.5 && (o.state === 'attack' || o.state === 'run' || o.state === 'dash' || (o.state === 'idle' && c.dist < 1.6));
    if (!coming || Math.random() >= S.gapEscape * sh.pm('escape')) return;
    const room = c.myRoom > 2;
    const p = pickW({
      parry: sh.bias('parry') * sh.pm('parry'),
      backstep: room ? 0.6 * Math.sqrt(sh.bias('backstep')) * sh.pm('backstep') : 0,
      wavedash: room ? 0.5 * Math.sqrt(sh.bias('wavedash')) * sh.pm('wavedash') : 0,
      jumpOut: 0.35 * sh.pm('airdodge'),
      block: sh.pm('block'),
    });
    if (!p) return;
    sh.logDef('wake:' + p);
    if (p === 'parry') this.rev = { ...this.newRev('parryAt', 'getup', 24), at: 3 };
    else if (p !== 'block') this.rev = this.newRev(p, 'getup', 8);
  }

  // A reversal planned while stuck in `from` (hit stun, a get-up, block stun), for `len` frames.
  newRev(type, from, len) {
    return { type, from, until: this.clock + len, parries: this.f.parries, left: false };
  }

  // A reversal planned while stuck (gap, wake-up, the end of block stun), carried out from the first frame it can work.
  reversal(c) {
    const f = this.f, R = this.rev;
    if (f.state !== R.from) R.left = true;
    // over: timed out, hit or stuck again, or a parry landed (its punish takes over)
    if (this.clock > R.until || f.parries !== R.parries || (R.left && f.state === R.from) || !['idle', 'guard', 'run', R.from].includes(f.state)) {
      this.rev = null;
      return false;
    }
    const free = c.ready === 'ground';
    switch (R.type) {
      case 'hold': // a parry press was made: keep the guard up so the hit meets it
        this.keep.add('guard');
        return true;
      case 'parryAt': // press as the invulnerability is about to run out (a meaty lands on its end)
        if (!R.pressed && f.invuln <= R.at && f.pad.frame - f.parryTry >= PARRY.lockout) {
          R.pressed = this.clock;
          this.tap('guard', 4);
          this.show.logDef('wake:parry', true);
        } else if (R.pressed && this.hold.guard <= 0) this.keep.add('guard');
        if (R.pressed && this.clock - R.pressed > PARRY.window + 2) this.rev = null; // the window is over: play on
        return true;
      case 'dodge': // Guard, then the ↓ edge: a spot dodge two frames into the free time
        if (f.state === R.from) return true;
        if (f.state === 'dodge') { this.rev = null; return true; }
        this.keep.add('guard');
        this.my = -1;
        if (!R.logged) { R.logged = true; this.show.logDef(R.from + ':dodge', true); }
        return true;
      case 'backstep':
      case 'wavedash':
      case 'jumpOut':
        if (!free) return f.state === R.from;
        if (R.type === 'backstep') {
          this.mx = -c.toward;
          this.my = 0;
          if (!this.pressDash()) return true; // out of Guard: let go this frame, press on the next
        } else if (R.type === 'wavedash') this.wavedash(-c.toward, 0);
        else this.jumpTo(-c.toward);
        this.rev = null;
        this.show.logDef(R.from + ':' + R.type, true);
        return true;
    }
    this.rev = null;
    return false;
  }

  // String read: on a blocked hit whose move chains into another, guess the next hit (once per hit). Parry it on its
  // rhythm, guard-cancel vanish out, or, when the next hit would leave room after the block stun, spot dodge,
  // wavedash or jump out; else keep blocking. Their string may stop, tick-throw or cross up instead: a real guess.
  stringRead(game, c) {
    const f = this.f, o = f.opp, S = this.S, sh = this.show;
    if (!S.stringRead) return false;
    let R = this.sRead;
    if (!R || R.key !== this.oppSerial) {
      const m = o.move, next = m?.next && MOVES[m.next];
      R = this.sRead = { key: this.oppSerial, pick: null };
      if (o.state === 'attack' && next && Math.random() < S.stringRead * sh.pm('read')) {
        R.eta = Math.max(0, m.cancel - o.t) + next.startup + o.hitstop;
        R.at = this.clock;
        const room = R.eta - (f.stun - f.t + f.hitstop); // free frames between our block stun and their next hit
        R.pick = pickW({
          parry: f.pad.frame + R.eta - f.parryTry >= PARRY.lockout ? sh.bias('parry') * sh.pm('parry') : 0,
          vanish: f.ki >= VANISH.cost ? 0.8 * sh.bias('vanish') * sh.pm('vanish') : 0,
          dodge: room >= 4 ? 0.5 * sh.bias('spotDodge') * sh.pm('dodge') * this.staleK() : 0,
          wavedash: room >= 6 && c.myRoom > 2 ? 0.6 * Math.sqrt(sh.bias('wavedash')) * sh.pm('wavedash') : 0,
          jumpOut: room >= 6 ? 0.3 * sh.pm('airdodge') : 0,
          hold: 0.8 * sh.pm('block'),
        });
        if (R.pick) sh.logDef('string:' + R.pick);
      }
    }
    const left = R.eta - (this.clock - R.at);
    switch (R.pick) {
      case 'parry': {
        const lead = f.pad.b.guard.down ? 3 : 2;
        if (!R.pressed && left <= lead) {
          R.pressed = true;
          this.tap('guard', 4);
          sh.logDef('string:parry', true);
        } else if (!R.pressed || this.hold.guard <= 0) this.keep.add('guard');
        return true;
      }
      case 'vanish':
        this.keep.add('guard');
        if (!R.done && c.ready === 'block') {
          R.done = true;
          this.tap('special', 2);
          sh.logDef('string:vanish', true);
        }
        return true;
      case 'dodge':
      case 'wavedash':
      case 'jumpOut':
        // hold the block, then go on its last frame (the reversal runs from the first free frame)
        this.keep.add('guard');
        if (f.t + 1 >= f.stun && f.hitstop === 0 && !R.done) {
          R.done = true;
          this.rev = this.newRev(R.pick, 'block', 6);
        }
        return true;
    }
    return false;
  }

  // After an air tech: air dodge away or through them, a waveland (an air dodge into the floor: a slide), a vanish
  // behind them, or the super dash straight back in (a reversal), with chance `escape` × the persona's.
  pickEscape() {
    const f = this.f, S = this.S, sh = this.show, P = (k) => sh.pm(k);
    if (Math.random() >= (S.escape ?? 0) * P('escape')) return null;
    const ad = !f.airDodged;
    const type = pickW({
      away: ad ? Math.sqrt(sh.bias('airDodge')) * P('airdodge') : 0,
      through: ad ? 0.4 * P('airdodge') : 0,
      waveland: ad && f.pos.y < 1.6 ? 0.6 * P('wavedash') : 0,
      vanish: f.ki >= VANISH.cost ? 0.6 * sh.bias('vanish') * P('vanish') : 0,
      superDash: f.airDashes === 0 ? 0.35 * P('read') : 0,
    });
    if (type) sh.logDef('escape:' + type);
    return type ? { type, until: this.clock + 40, go: 0 } : null;
  }

  airEscape(c) {
    const f = this.f, E = this.esc;
    if (E.go) {
      // the stick stays on a couple of frames (a Guard still held needs a release frame before the press)
      if (this.clock - E.go > 2 || f.state !== 'air') { this.esc = null; return false; }
      this.mx = E.type === 'through' ? c.toward : -c.toward;
      return true;
    }
    if (f.state !== 'air' || this.clock > E.until) { this.esc = null; return false; }
    switch (E.type) {
      case 'waveland':
        this.mx = -c.toward;
        if (!(f.vel.y < 0 && f.pos.y < DEFENSE.airDodge.lowY)) return false; // wait until the floor is close
      // falls through
      case 'away':
      case 'through':
        this.mx = E.type === 'through' ? c.toward : -c.toward;
        this.tap('guard', 2);
        break;
      case 'vanish':
        this.keep.add('guard');
        this.tap('special', 2);
        break;
      case 'superDash':
        this.tap('dash', 2);
        break;
    }
    E.go = this.clock;
    this.show.logDef('escape:' + E.type, true);
    return true;
  }

  // ------------------------------------------------------------------ presses the fighter reads late or not at all
  // Press Dash (a back dash, a sidestep, the super dash). Guard state starts a dash only from a double-tap's dashDir,
  // never from the Dash button, and the brain never double-taps (flush), so out of Guard it lets go first: no Guard
  // this frame (Guard drops to idle) and the press on the next. True once the press is out.
  pressDash() {
    if (this.f.state === 'guard') {
      this.hold.guard = 0; // a parry tap still running would keep it up
      return false;
    }
    this.tap('dash', 2);
    return true;
  }

  // A jump toward screen direction sx (+1 right) and depth sd. The fighter reads the jump's direction on the squat's
  // last frame, not on the press, so the stick has to stay there through the squat: recover() holds wdDir there (the
  // wavedash's slot, cleared once the squat is over). `hold`: frames Jump stays down, a full hop held through the squat
  // or a short hop's tap (ADR 0042).
  jumpTo(sx, sd = 0, hold = FULL_HOP) {
    this.wdDir = [sx, sd];
    this.wdAt = this.clock;
    this.mx = sx;
    this.my = sd;
    this.tap('jump', hold);
  }

  // A dodge right after another is slower (spot dodge staleness): the showman picks one less often then.
  staleK() {
    const f = this.f;
    return this.S.rotate && f.clock - f.lastDodge < SPOT.staleWindow ? 0.5 : 1;
  }
}

// Adds the Defense methods to a brain class (MasterBrain).
export function mixDefense(Brain) {
  for (const k of Object.getOwnPropertyNames(Defense.prototype)) if (k !== 'constructor') Brain.prototype[k] = Defense.prototype[k];
}
