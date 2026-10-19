// The live tournament announcer (ENG-118, ADR 0048). The MC stands in the ring for the introductions and the round
// calls; during the fight he keeps to the ring's back half, about five tiles beyond the fighters (seen from the camera)
// and off to one side, so he is in the shot without hiding anyone. The fight camera looks down at the ring, which puts
// the grass beyond it at the very top of the screen under the health bars: the ring is where he can be seen (user
// pick 2026-10-18). He scurries away when a fighter comes at him, hops down to the walkway on the grass when he is
// cornered (and back up once there is room), ducks for ultimates and clashes, and counts over the fallen fighter after
// a KO. He comments everything in small captions above his head (src/ui/speechBubble.js, lines in announcerLines.js).
//
// View only: the arena hands him its NPC cues (game.js -> arena.npcCue; Game.quiet stands the arena in during a
// rollback, so a re-simulated frame never cues him twice) and he reads the game each rendered frame. He never writes
// to the simulation, so Math.random is fine here (ADR 0036). His body is the packed announcer sheet (an NpcSprite)
// or, without one, the painted placeholder billboard; animations he lacks play their NPC_FALLBACK.
import * as THREE from 'three';
import { RING_HALF, RING_TOP, MAX_HP, ROUNDS_TO_WIN } from '../game/constants.js';
import { LINES, TAG_LINES } from './announcerLines.js';
import { NPC_CUES } from './worldArt.js';

// The walkway: a rounded square between the ring's stone lip (9.35) and the standing-room fans (12.05 at the sides,
// 12.25 in front), its corners rounded inside the judge monks (10.3, -10.3).
const WALK_HALF = 10.6;
const WALK_R = 2.6;
const IN = WALK_HALF - WALK_R; // the straight sides run from -IN to IN
const SIDE = 2 * IN + (Math.PI / 2) * WALK_R; // one side and its corner
const LOOP = 4 * SIDE;
const HOME = new THREE.Vector3(-11.8, 0, -14.4); // the gong, where he stands outside a match (ENG-024)
const RING_IN = RING_HALF - 0.75; // how far into the ring he goes (his feet stay on the mat)

const MOVE = {
  walk: 2.4, // world units / s (a brisk stride for the walk strip at 150 ms a frame)
  run: 5.2,
  accel: 12,
  runFrom: 4.5, // further than this: run (the fight crosses the ring faster than he walks)
  startFrom: 1.6, // standing still, he only sets off once his spot has moved this far (no fidgeting)
  behind: 5.0, // his fight spot: this far beyond the fighters' middle, away from the camera ...
  aside: 4.0, // ... and this far to one side of it across the screen
  roomy: 3.2, // a spot at least this far from both fighters is free
  aisle: 5.4, // on the grass: how far along the walkway from straight behind the fight he waits
  flee: 2.3, // a fighter this close (horizontal) sends him scurrying ...
  fleeBy: 3.6, // ... this far away (on the walkway: along it)
  hop: 0.46, // seconds in the air climbing into or out of the ring
  hopUp: 0.55, // the hop's arc above its higher end
  bob: 0.03, // the bob while `walk` art is missing (the idle frames slide otherwise)
};
const HEAD = 1.45; // his caption's anchor above his feet (the sprite is 1.4 tall)
const SHOW_STATES = new Set(['intro', 'roundIntro', 'fight', 'ko', 'timeup', 'draw', 'roundEnd']);
// outside a match he waits by the gong; the match's hero shot (matchEnd, results) is the winner's alone
const OFF_STATES = new Set(['boot', 'menu', 'training', 'matchEnd', 'results']);
const COUNT = ['ONE', 'TWO', 'THREE'];
const SMALL_CLASH = ['shocked', 2, 1.0];
const COUNT_GAP = 0.5; // seconds between the KO count's numbers (all three fit the KO shot)
const ONCE_WAIT = 2.5; // seconds a once-a-round moment waits for a busy bubble

const tmpV = new THREE.Vector3();
const tmpW = new THREE.Vector3();
const wrap = (d) => ((((d + LOOP / 2) % LOOP) + LOOP) % LOOP) - LOOP / 2; // signed shortest distance on the loop
const clampRing = (v) => Math.max(-RING_IN, Math.min(RING_IN, v));
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// arc length s -> the walkway point (x, z): side 0 runs along x = +WALK_HALF, each next side a quarter turn on
export function walkAt(s, out = { x: 0, z: 0 }) {
  s = ((s % LOOP) + LOOP) % LOOP;
  const k = Math.min(3, Math.floor(s / SIDE));
  const u = s - k * SIDE;
  let x, z;
  if (u < 2 * IN) { x = WALK_HALF; z = -IN + u; }
  else { const a = (u - 2 * IN) / WALK_R; x = IN + WALK_R * Math.cos(a); z = IN + WALK_R * Math.sin(a); }
  for (let i = 0; i < k; i++) { const t = x; x = -z; z = t; }
  out.x = x;
  out.z = z;
  return out;
}

// the arc length of the walkway point nearest (x, z): a coarse table, then one refining pass
const TABLE = Array.from({ length: 320 }, (_, i) => { const s = (i / 320) * LOOP; return { s, ...walkAt(s) }; });
export function walkNear(x, z) {
  let best = TABLE[0], bd = Infinity;
  for (const p of TABLE) { const d = (p.x - x) ** 2 + (p.z - z) ** 2; if (d < bd) { bd = d; best = p; } }
  let s = best.s;
  const step = LOOP / 320;
  for (let i = -4; i <= 4; i++) {
    const t = best.s + (i * step) / 4, p = walkAt(t);
    const d = (p.x - x) ** 2 + (p.z - z) ** 2;
    if (d < bd) { bd = d; s = t; }
  }
  return ((s % LOOP) + LOOP) % LOOP;
}

// signed distance to the walkway's rounded square (negative inside)
function walkSdf(x, z) {
  const qx = Math.abs(x) - IN, qz = Math.abs(z) - IN;
  return Math.hypot(Math.max(qx, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qz), 0) - WALK_R;
}

// where the ray from (x, z) along (dx, dz) leaves the walkway's square (the start is inside: the ring is)
function walkHit(x, z, dx, dz) {
  let lo = 0, hi = 40;
  for (let i = 0; i < 22; i++) {
    const m = (lo + hi) / 2;
    if (walkSdf(x + dx * m, z + dz * m) < 0) lo = m;
    else hi = m;
  }
  return walkNear(x + dx * lo, z + dz * lo);
}

// The painted placeholder (crowdPainter.bakeAnnouncer) as a body: it mirrors, it has no animations.
export function paintedBody(sprite) {
  const tex = sprite.material.map;
  return {
    sprite,
    resolve: () => 'idle',
    setAnim() {},
    update() {},
    setMirror(m) {
      tex.repeat.x = m ? -1 : 1;
      tex.offset.x = m ? 1 : 0;
    },
  };
}

export class Announcer {
  constructor(bubble) {
    this.bubble = bubble;
    this.body = null;
    this.pos = HOME.clone();
    this.place = 'home'; // 'home' | 'walk' (on the walkway at arc length s) | 'ring' | 'hop'
    this.s = 0;
    this.speed = 0; // current speed along his way (units / s)
    this.moving = 0; // > 0 while walking or running (its sign is the direction on the walkway)
    // the steps he is carrying out (runStep): wait, ring (walk/run to x, z), path (along the walkway to s), hop (into
    // or out of the ring), ko / chase / stand (the KO call), winner / stand (presenting the winner)
    this.route = [];
    this.hopT = 0;
    this.side = 1; // which side of the fight he keeps to (sticky, so he doesn't swap sides on every camera turn)
    this.react = null; // { anim, t }
    this.holdT = 0; // seconds he stands still (a reaction, a duck for cover)
    this.look = null; // the fighter he faces (or null: the fight)
    this.mirror = false;
    this.clock = 0;
    this.lastSaid = {}; // moment -> clock when last said
    this.bags = {}; // moment -> line indices not used yet
    this.lastLineEnd = 0;
    this.nextFiller = 8;
    this.lastState = null;
    this.flowDone = {};
    this.round = null; // per-round memory (watchFight)
    this.prevStates = ['', ''];
    this.chargeT = [0, 0];
    this.stage = 'arena';
    this.count = null; // { who, t, n }: the KO count in progress
    this.koWho = null; // the fallen fighter whose count is about to start
    this.dt = 0;
    this.pendingWin = null; // { f, match, t }: the winner line waiting for the KO count
    this.bob = 0;
  }

  // the packed sheet arrived (or went): put the new body where the old one was
  setBody(body) {
    this.body = body;
    if (!body) return;
    body.sprite.position.copy(this.pos);
    body.setMirror(this.mirror);
  }

  // ------------------------------------------------------------ per rendered frame
  update(dt, game) {
    const body = this.body;
    if (!body) return;
    this.game = game;
    const live = game.fighters?.length === 2 && !OFF_STATES.has(game.state) && game.stageKind !== 'training';
    this.showing = live && SHOW_STATES.has(game.state) && game.stageKind === 'arena';
    const frozen = !!game.paused;
    const step = frozen ? 0 : dt * Math.min(1, Math.max(0.4, game.timeScale ?? 1));
    this.clock += step;
    this.dt = step;
    if (!live) {
      if (this.place !== 'home') this.goHome();
      this.lastState = null;
      this.bubble.hide();
      body.update(dt);
      return;
    }
    this.flow(game);
    if (game.state === 'fight') this.watchFight(game, step);
    this.move(game, step);
    this.animate(game, step);
    this.speak(game, dt, frozen);
  }

  // ------------------------------------------------------------ the match flow: who stands where, the set lines
  flow(game) {
    const st = game.state, t = game.stateT ?? 0;
    const [a, b] = game.fighters;
    if (st !== this.lastState) {
      this.lastState = st;
      this.flowDone = {};
      this.enter(st, game);
    }
    // the stage leaves for a Domain Expansion's void and comes back: he wonders what happened
    if (game.stageKind !== this.stage) {
      if (this.stage === 'void' && game.stageKind === 'arena') this.say('domainEnd', {}, true);
      this.stage = game.stageKind;
    }
    const once = (k) => (this.flowDone[k] ? false : (this.flowDone[k] = true));
    // the KO count, ONE .. THREE, while the KO shot lasts; the winner line waits for him to reach the winner, or 1.4 s
    const K = this.koWho;
    if (st === 'ko' && K && !this.count && ((K.koLanded && t > 0.5) || t > 1.0)) {
      this.count = { who: K, t: 0, n: 0 };
      this.koWho = null;
    }
    const C = this.count;
    if (C) {
      C.t += this.dt;
      if (st !== 'ko' || C.n >= COUNT.length) this.count = null;
      else if (C.t > C.n * COUNT_GAP && this.say('count', { B: C.who, N: COUNT[C.n] }, true, true)) { C.n++; this.look = C.who; }
    }
    if (this.pendingWin && this.clock - this.pendingWin.t > 1.4) this.sayWin();
    if (st === 'intro') {
      if (t > 0.4 && once('w1')) this.say('welcome');
      if (t > 1.9 && once('w2')) this.say('welcome2');
      if (t > 3.9 && once('a')) this.say('introA', { A: a });
      if (t > 5.1 && once('b')) this.say('introB', { A: b });
    } else if (st === 'roundIntro') {
      if (t > 0.45 && once('r')) {
        const wins = game.fighters.map((f) => f.wins);
        const lead = wins[0] === ROUNDS_TO_WIN - 1 ? a : wins[1] === ROUNDS_TO_WIN - 1 ? b : null;
        if (wins[0] === ROUNDS_TO_WIN - 1 && wins[1] === ROUNDS_TO_WIN - 1) this.say('finalRound');
        else if (lead) this.say('matchPoint', { A: lead });
        else this.say('round', { N: game.round });
      }
    }
  }

  enter(st, game) {
    if (st === 'intro') {
      // the flythrough starts at the gate, far from the ring: he is already standing in it when the camera arrives
      this.route = [];
      this.toRingSpot(game, true);
      this.round = null;
    } else if (st === 'roundIntro') {
      this.round = { done: {}, seen: {}, firstHit: null, lead: [0, 0] };
      this.pendingWin = this.count = this.koWho = null;
      this.bubble.hide(); // a new round: last round's winner line makes way for the round call
      this.prevStates = game.fighters.map((f) => f.state);
      this.lastLineEnd = this.clock;
      this.nextFiller = 7 + Math.random() * 4;
      // the KO walk is over (a hop in the air lands first); in the ring: back to the middle for the round call
      const hop = this.route[0]?.kind === 'hop' && this.route[0].from ? [this.route[0]] : [];
      this.route = hop;
      if (this.place === 'ring' || hop[0]?.ring) this.toRingSpot(game, false);
    } else if (st === 'roundEnd' || st === 'matchEnd') {
      this.holdT = 0;
    } else if (st === 'draw') {
      this.say('draw');
    }
  }

  // his spot in the ring for the calls: just beyond the fighters' middle, seen from the camera
  ringSpot(game) {
    const [a, b] = game.fighters;
    const yaw = game.cam?.yaw ?? 0;
    const fx = -Math.sin(yaw), fz = -Math.cos(yaw);
    return { x: clampRing((a.pos.x + b.pos.x) / 2 + fx * 2.5), z: clampRing((a.pos.z + b.pos.z) / 2 + fz * 2.5) };
  }

  toRingSpot(game, teleport) {
    const p = this.ringSpot(game);
    if (teleport) {
      this.place = 'ring';
      this.pos.set(p.x, RING_TOP, p.z);
      this.speed = 0;
    } else this.route.push({ kind: 'ring', x: p.x, z: p.z });
  }

  goHome() {
    this.place = 'home';
    this.route = [];
    this.pos.copy(HOME);
    this.speed = this.moving = 0;
    this.react = null;
    this.look = null;
    this.setMirror(false);
    this.body.setAnim('idle');
    this.body.sprite.position.copy(this.pos);
  }

  // his fight spot: beyond the fighters' middle (away from the camera) and to one side, kept inside the ring. `ok`
  // when both fighters are well clear of it. He keeps his side unless it is crowded and the other one is not.
  fightSpot(game) {
    const [a, b] = game.fighters;
    const yaw = game.cam?.yaw ?? 0;
    const fx = -Math.sin(yaw), fz = -Math.cos(yaw), rx = -fz, rz = fx; // into the screen, across it
    const mx = (a.pos.x + b.pos.x) / 2, mz = (a.pos.z + b.pos.z) / 2;
    const at = (side) => {
      const x = clampRing(mx + fx * MOVE.behind + rx * side * MOVE.aside), z = clampRing(mz + fz * MOVE.behind + rz * side * MOVE.aside);
      const room = Math.min(...game.fighters.map((f) => Math.hypot(f.pos.x - x, f.pos.z - z)));
      return { x, z, room, ok: room >= MOVE.roomy };
    };
    const mine = at(this.side), other = at(-this.side);
    if (!mine.ok && other.room > mine.room + 0.5) { this.side = -this.side; return other; }
    return mine;
  }

  // the fighter within `r` of him, if any (a KO'd one stays put)
  threat(game, r) {
    for (const f of game.fighters) if (!f.ko && Math.hypot(this.pos.x - f.pos.x, this.pos.z - f.pos.z) < r) return f;
    return null;
  }

  // off the ring onto the nearest stretch of the walkway (cornered), then a breather
  hopDown(wait = 1.2) {
    const s = walkNear(this.pos.x * 1.3, this.pos.z * 1.3);
    this.route = [{ kind: 'hop', ring: false, s }, { kind: 'wait', t: wait }];
  }

  // after a KO, once the fallen fighter has landed (a KO launches them, sometimes into the stands): over to them, or
  // to the ring edge nearest them when they ended up outside it, for the count
  approach(game, loser) {
    const steps = [];
    if (this.place === 'walk') {
      const w = walkAt(this.s);
      steps.push({ kind: 'hop', ring: true, x: clampRing(w.x), z: clampRing(w.z) });
    }
    steps.push({ kind: 'chase', who: loser, t: 0 }, { kind: 'stand', who: loser });
    return steps;
  }

  // where he stands over the fallen fighter: beside them across the screen and a little beyond, so the KO shot holds
  // both; the ring edge nearest them when they ended up outside it
  besideLoser(game, L) {
    const lx = L.pos.x, lz = L.pos.z;
    if (Math.abs(lx) >= RING_IN || Math.abs(lz) >= RING_IN) return { x: clampRing(lx), z: clampRing(lz) };
    const yaw = game.cam?.yaw ?? 0;
    const fx = -Math.sin(yaw), fz = -Math.cos(yaw), rx = -fz, rz = fx;
    const side = (this.pos.x - lx) * rx + (this.pos.z - lz) * rz >= 0 ? 1 : -1;
    return { x: clampRing(lx + rx * side * 1.5 + fx * 0.4), z: clampRing(lz + rz * side * 1.5 + fz * 0.4) };
  }

  // the round's end (the victory close-up orbits the winner from the fight's yaw + 0.5): beside the winner, on the
  // side he comes from, a step beyond them, so the shot holds both while he holds the mic out
  present(game, w) {
    const a = (game.cam?.yaw ?? 0) + 0.3; // where that orbit is a second in
    const fx = -Math.sin(a), fz = -Math.cos(a), rx = -fz, rz = fx;
    const side = (this.pos.x - w.pos.x) * rx + (this.pos.z - w.pos.z) * rz >= 0 ? 1 : -1;
    const steps = [];
    if (this.place === 'walk') {
      const p = walkAt(this.s);
      steps.push({ kind: 'hop', ring: true, x: clampRing(p.x), z: clampRing(p.z) });
    }
    steps.push({ kind: 'ring', x: clampRing(w.pos.x + rx * side * 1.25 + fx * 0.7), z: clampRing(w.pos.z + rz * side * 1.25 + fz * 0.7), hurry: true }, { kind: 'stand', who: w, win: true });
    return steps;
  }

  // the round's winner: said after the count, or on its own when there is no count to wait for
  sayWin() {
    const w = this.pendingWin;
    if (w && this.say(w.match ? 'matchWin' : 'roundWin', { A: w.f }, true, true)) {
      this.pendingWin = null;
      this.look = w.f;
    }
  }

  // ------------------------------------------------------------ getting around
  move(game, dt) {
    if (!dt) return;
    this.moving = 0;
    if (this.holdT > 0) { this.holdT -= dt; this.speed = 0; return; }
    const r = this.route[0];
    if (r) { if (this.runStep(r, game, dt)) this.route.shift(); return; }
    if (game.state !== 'fight' && game.state !== 'timeup') return;
    if (this.place === 'home') {
      // a match that skipped the intro (training back to versus, a rematch from the lab): onto the walkway
      this.place = 'walk';
      this.s = walkNear(this.pos.x, this.pos.z);
      const w = walkAt(this.s);
      this.pos.set(w.x, 0, w.z);
    }
    if (this.place === 'ring') this.followRing(game, dt);
    else if (this.place === 'walk') this.followWalk(game, dt);
  }

  // one route step; true when it is done
  runStep(r, game, dt) {
    if (r.kind === 'wait') { r.t -= dt; return r.t <= 0; }
    if ((r.kind === 'ring' || r.kind === 'chase') && this.place === 'walk') {
      // a move across the ring that finds him down on the grass (a hop down was under way): back up first
      this.route.unshift({ kind: 'hop', ring: true, x: clampRing(this.pos.x), z: clampRing(this.pos.z) });
      return false;
    }
    if (r.kind === 'ko') {
      // the KO line first, then after the fallen fighter (the count runs on its own, Announcer.flow)
      r.t += dt;
      if (r.t < 0.3) return false;
      this.route.splice(1, 0, ...this.approach(game, r.who));
      return true;
    }
    if (r.kind === 'chase') {
      // after the fallen fighter while they fly (a KO launches them), done once beside them and they have landed
      r.t += dt;
      const p = this.besideLoser(game, r.who);
      return this.ringTo(p.x, p.z, dt, true, 0.15) && (r.who.koLanded || r.t > 2.5);
    }
    if (r.kind === 'winner') {
      this.route.splice(1, 0, ...this.present(game, r.who));
      return true;
    }
    if (r.kind === 'stand') {
      // over the fallen fighter, or presenting the winner (their line on arrival), mic out until the round moves on
      this.look = r.who;
      if (r.win) this.sayWin();
      this.reactTo('micThrust', 0.5);
      return game.state !== 'ko' && game.state !== 'roundEnd' && game.state !== 'timeup';
    }
    if (r.kind === 'hop') {
      if (!r.from) {
        r.from = this.pos.clone();
        const to = r.ring ? { x: r.x, z: r.z } : walkAt(r.s);
        r.to = new THREE.Vector3(to.x, r.ring ? RING_TOP : 0, to.z);
        this.hopT = 0;
        this.place = 'hop';
      }
      this.hopT += dt / MOVE.hop;
      const k = Math.min(1, this.hopT);
      this.pos.lerpVectors(r.from, r.to, k);
      this.pos.y = r.from.y + (r.to.y - r.from.y) * k + Math.sin(k * Math.PI) * MOVE.hopUp;
      this.moving = 1;
      this.dirX = r.to.x - r.from.x;
      this.dirZ = r.to.z - r.from.z;
      if (k < 1) return false;
      this.pos.copy(r.to);
      if (r.ring) this.place = 'ring';
      else { this.place = 'walk'; this.s = r.s; }
      return true;
    }
    if (r.kind === 'path') {
      if (this.place !== 'walk') { this.place = 'walk'; this.s = walkNear(this.pos.x, this.pos.z); }
      return this.walkTo(r.s, dt, r.hurry, 0.12);
    }
    if (r.kind === 'ring') return this.ringTo(r.x, r.z, dt, r.hurry, 0.08);
    return true;
  }

  // across the ring toward (x, z) in a straight line; true on arrival
  ringTo(x, z, dt, hurry, near) {
    const dx = x - this.pos.x, dz = z - this.pos.z, d = Math.hypot(dx, dz);
    if (d <= near) { this.speed = 0; return true; }
    const want = hurry || d > MOVE.runFrom ? MOVE.run : MOVE.walk;
    this.speed = Math.min(want, this.speed + MOVE.accel * dt);
    const go = Math.min(d, this.speed * dt);
    this.pos.x += (dx / d) * go;
    this.pos.z += (dz / d) * go;
    this.pos.y = RING_TOP;
    this.moving = 1;
    this.dirX = dx;
    this.dirZ = dz;
    return false;
  }

  // along the walkway toward arc length s; true on arrival
  walkTo(s, dt, hurry, near) {
    const d = wrap(s - this.s);
    if (Math.abs(d) <= near) { this.speed = 0; return true; }
    const want = hurry || Math.abs(d) > MOVE.runFrom ? MOVE.run : MOVE.walk;
    this.speed = Math.min(want, this.speed + MOVE.accel * dt);
    const go = Math.min(Math.abs(d), this.speed * dt) * Math.sign(d);
    const before = walkAt(this.s, tmpW);
    const bx = before.x, bz = before.z;
    this.s = (((this.s + go) % LOOP) + LOOP) % LOOP;
    const p = walkAt(this.s, tmpW);
    this.pos.set(p.x, 0, p.z);
    this.moving = Math.sign(d);
    this.dirX = p.x - bx;
    this.dirZ = p.z - bz;
    return false;
  }

  // the fight is on, he is in the ring: keep to his spot behind the fight and get out of the way
  followRing(game, dt) {
    const f = this.threat(game, MOVE.flee);
    if (f) {
      // straight away from them; with the ring edge at his back, down onto the grass
      const dx = this.pos.x - f.pos.x, dz = this.pos.z - f.pos.z, d = Math.hypot(dx, dz) || 1;
      const ex = this.pos.x + (dx / d) * MOVE.fleeBy, ez = this.pos.z + (dz / d) * MOVE.fleeBy;
      if (Math.abs(ex) > RING_IN || Math.abs(ez) > RING_IN) this.hopDown();
      else this.route = [{ kind: 'ring', x: ex, z: ez, hurry: true }, { kind: 'wait', t: 1.0 }];
      if (Math.random() < 0.5) this.say('flee');
      return;
    }
    const spot = this.fightSpot(game);
    // nowhere in the ring clear of the fighters (the fight is at his edge): wait it out on the grass
    if (!spot.ok && spot.room < MOVE.flee + 0.3) { this.hopDown(1.6); return; }
    const d = Math.hypot(spot.x - this.pos.x, spot.z - this.pos.z);
    if (this.speed > 0 || d > MOVE.startFrom) this.ringTo(spot.x, spot.z, dt, false, 0.15);
  }

  // on the grass (cornered off the ring, or the ring is no place to be): stay behind the fight along the walkway and
  // climb back in once his spot in the ring is free again
  followWalk(game, dt) {
    const spot = this.fightSpot(game);
    if (spot.ok) {
      const w = walkAt(this.s);
      const x = clampRing(w.x), z = clampRing(w.z);
      if (game.fighters.every((f) => Math.hypot(f.pos.x - x, f.pos.z - z) > MOVE.roomy)) {
        this.route = [{ kind: 'hop', ring: true, x, z }];
        return;
      }
    }
    const f = this.threat(game, MOVE.flee);
    if (f) {
      // along the walkway, the way whose tangent points away from the fighter, then a breather
      const dx = this.pos.x - f.pos.x, dz = this.pos.z - f.pos.z;
      const ahead = walkAt(this.s + 0.5, tmpW);
      const away = (ahead.x - this.pos.x) * dx + (ahead.z - this.pos.z) * dz >= 0 ? 1 : -1;
      this.route = [{ kind: 'path', s: this.s + away * MOVE.fleeBy, hurry: true }, { kind: 'wait', t: 1.2 }];
      if (Math.random() < 0.5) this.say('flee');
      return;
    }
    const [a, b] = game.fighters;
    const yaw = game.cam?.yaw ?? 0;
    const behind = walkHit((a.pos.x + b.pos.x) / 2, (a.pos.z + b.pos.z) / 2, -Math.sin(yaw), -Math.cos(yaw));
    const target = behind + this.side * MOVE.aisle;
    const d = wrap(target - this.s);
    if (this.speed > 0 || Math.abs(d) > MOVE.startFrom) this.walkTo(target, dt, false, 0.2);
  }

  // ------------------------------------------------------------ how he looks
  animate(game, dt) {
    const body = this.body, sp = body.sprite;
    if (this.react) { this.react.t -= dt; if (this.react.t <= 0) this.react = null; }
    let anim = 'idle';
    if (this.place === 'hop') anim = 'hop';
    else if (this.moving) anim = this.speed > MOVE.walk + 0.3 ? 'run' : 'walk';
    else if (this.react) anim = this.react.anim;
    body.setAnim(anim);
    // facing: the way he walks, else toward who he is talking about (the sheet faces screen-right)
    const cam = game.camera;
    if (cam) {
      let dx = 0;
      const from = this.screenX(this.pos, cam);
      if (this.moving && (this.dirX || this.dirZ)) dx = this.screenX(tmpV.set(this.pos.x + this.dirX * 4, this.pos.y, this.pos.z + this.dirZ * 4), cam) - from;
      else {
        const [a, b] = game.fighters;
        const L = this.look;
        const p = L ? tmpV.set(L.pos.x, RING_TOP, L.pos.z) : tmpV.set((a.pos.x + b.pos.x) / 2, RING_TOP, (a.pos.z + b.pos.z) / 2);
        dx = this.screenX(p, cam) - from;
      }
      if (Math.abs(dx) > 0.015) this.setMirror(dx < 0);
    }
    // without walk art the idle frames would slide along: a small bob sells the steps (no tilt: a rotated pixel
    // sprite shimmers)
    let y = this.pos.y;
    if (this.moving && this.place !== 'hop' && body.resolve('walk') === 'idle') {
      this.bob += dt * (this.speed > MOVE.walk + 0.3 ? 15 : 9);
      y += Math.abs(Math.sin(this.bob)) * MOVE.bob;
    }
    sp.position.set(this.pos.x, y, this.pos.z);
    body.update(dt);
  }

  setMirror(m) {
    this.mirror = m;
    this.body?.setMirror(m);
  }

  screenX(p, cam) {
    tmpW.copy(p).project(cam);
    return tmpW.z > 1 ? -tmpW.x : tmpW.x; // behind the camera the projection flips
  }

  reactTo(anim, secs, hold = 0) {
    if (this.react && this.react.anim === 'cower' && anim !== 'cower' && this.react.t > 0) return; // ducking wins
    this.react = { anim, t: secs };
    if (hold) this.holdT = Math.max(this.holdT, hold);
  }

  // ------------------------------------------------------------ what he says
  // an arena NPC cue (worldArt.NPC_CUES kinds + the ENG-118 ones), with its info from game.js
  cue(kind, info = {}) {
    if (!this.body) return;
    const f = info.f, o = f?.opp;
    // [anim, prio, secs] reactions kept from ENG-024; an ultimate-tier super sends him for cover like a beam does, a
    // melee or special clash (or a one-beat one) only makes his jaw drop
    const small = kind === 'clash' && (info.tier === 'melee' || info.tier === 'special' || info.tier === 'beat');
    const base = small ? SMALL_CLASH : kind === 'super' && info.ultimate && !info.answer ? NPC_CUES.ultimate.announcer : NPC_CUES[kind]?.announcer;
    switch (kind) {
      case 'roundStart':
        this.say('begin', {}, true);
        this.route = [{ kind: 'wait', t: 0.55 }]; // shout it on the spot, then off to his place behind the fight
        break;
      case 'special':
        if (info.name) this.say('special', { A: f, B: o, M: info.name });
        break;
      case 'super':
        if (info.domain) this.say('domain', { A: f, B: o, M: info.name }, true);
        else if (info.answer) this.say('counter', { A: f, B: o, M: info.name }, true);
        else this.say(info.ultimate ? 'ultimate' : 'super', { A: f, B: o, M: info.name }, true);
        break;
      case 'ultimate':
        this.say(info.counter ? 'counter' : 'ultimate', { A: f, B: o, M: info.name }, true);
        break;
      case 'clash':
        // a beam or Hollow Purple going off is a 'clash' cue too (ENG-024): the super already said its line
        if (info.tier !== 'blast') this.say('clash', {}, !small);
        break;
      case 'clashWin':
        this.say('clashWin', { A: f, B: o });
        break;
      case 'combo': {
        const n = info.hits || 0;
        if (n >= 20) this.say('comboLegend', { A: f, B: info.victim, N: n });
        else if (n >= 12) this.say('comboBig', { A: f, B: info.victim, N: n });
        else if (n >= 6) this.say('combo', { A: f, B: info.victim, N: n });
        break;
      }
      case 'tag':
        if (TAG_LINES[info.id]) this.say(TAG_LINES[info.id], { A: f, B: o });
        break;
      case 'throw':
        this.say('throw', { A: f, B: o });
        break;
      case 'maxPower':
        this.say('maxPower', { A: f, B: o });
        break;
      case 'ko':
        if (f && f.hp >= MAX_HP) this.say('perfect', { A: f, B: info.loser }, true);
        else this.say('ko', { A: f, B: info.loser }, true);
        this.pendingWin = null;
        this.count = null;
        this.koWho = info.loser ?? null; // the count starts as they land (Announcer.flow), even while he ducks
        if (info.loser) this.route = [{ kind: 'ko', who: info.loser, t: 0 }];
        break;
      case 'crash':
        this.say('crash', { A: f }, true);
        break;
      case 'roundEnd':
        // roundOver cues before it counts the win; after a KO the line waits for his count (Announcer.flow)
        if (!f) break;
        this.look = f;
        this.pendingWin = { f, match: f.wins + 1 >= ROUNDS_TO_WIN, t: this.clock };
        this.count = this.koWho = null;
        this.route = this.place === 'hop' ? this.route.slice(0, 1) : []; // a hop in the air lands first
        this.route.push({ kind: 'winner', who: f });
        break;
      case 'timeup':
        this.say('timeup', {}, true);
        break;
    }
    // the ENG-024 reaction table: a duck for cover stops him where he is
    if (base) {
      const [anim, , secs] = base;
      if (anim === 'cower') this.reactTo('cower', secs, kind === 'crash' ? 0.7 : secs); // a KO crash: then off to count
      else if (!this.react || this.react.t <= 0) this.reactTo(anim, secs);
    }
  }

  // passive commentary while the fight runs: firsts, knockdowns, health swings, the clock, the lulls
  watchFight(game, dt) {
    const R = this.round;
    if (!R) return;
    const F = game.fighters;
    const [a, b] = F;
    // a once-a-round moment, said as soon as the bubble is free (up to ONCE_WAIT s after it happened, else dropped)
    const once = (id, key, ctx, force = false) => {
      if (R.done[id]) return;
      R.seen[id] ??= this.clock;
      if (this.clock - R.seen[id] > ONCE_WAIT || this.say(key, ctx, force)) R.done[id] = true;
    };
    if (a.hp < MAX_HP || b.hp < MAX_HP) {
      const hit = R.firstHit ??= a.hp < MAX_HP ? a : b;
      once('first', 'firstHit', { A: hit.opp, B: hit });
    }
    F.forEach((f, i) => {
      if (f.state === 'down' && this.prevStates[i] !== 'down' && !f.ko) this.say('knockdown', { A: f.opp, B: f });
      this.prevStates[i] = f.state;
      if (!f.ko && f.hp > 0) {
        if (f.hp <= MAX_HP * 0.08) { R.done['low' + i] = true; once('thread' + i, 'thread', { A: f.opp, B: f }); }
        else if (f.hp <= MAX_HP * 0.25) once('low' + i, 'lowHp', { A: f.opp, B: f });
      }
      // powering up for a while
      this.chargeT[i] = f.state === 'charge' ? this.chargeT[i] + dt : 0;
      if (this.chargeT[i] > 0.9) { this.chargeT[i] = -30; this.say('charge', { A: f, B: f.opp }); }
    });
    // health swings: the biggest lead each side had, a comeback when the other side takes it back
    const lead = a.hp - b.hp;
    R.lead[0] = Math.max(R.lead[0], lead);
    R.lead[1] = Math.max(R.lead[1], -lead);
    for (let i = 0; i < 2; i++) {
      const mine = i === 0 ? lead : -lead;
      if (R.lead[1 - i] >= MAX_HP * 0.3 && mine >= MAX_HP * 0.05) once('back' + i, 'comeback', { A: F[i], B: F[1 - i] });
    }
    const leader = lead >= 0 ? a : b;
    if (Math.abs(lead) >= MAX_HP * 0.45 && leader.hp >= MAX_HP * 0.65) this.say('dominating', { A: leader, B: leader.opp });
    if (a.hp <= MAX_HP * 0.35 && b.hp <= MAX_HP * 0.35 && Math.abs(lead) <= MAX_HP * 0.08 && a.hp > 0 && b.hp > 0) once('close', 'close');
    const tl = game.timeLeft ?? 99;
    if (tl <= 30 && tl > 10) once('t30', 'time30');
    if (tl <= 10) once('t10', 'time10', {}, true);
    // a lull: something to fill it
    if (!this.bubble.cur && this.clock - this.lastLineEnd > this.nextFiller) {
      this.nextFiller = 6 + Math.random() * 4;
      if (Math.abs(lead) >= MAX_HP * 0.25 && Math.random() < 0.6) this.say('fillerLead', { A: leader, B: leader.opp });
      else this.say('filler', { A: Math.random() < 0.5 ? a : b, B: null, swap: true });
    }
  }

  // say one of LINES[key] (if no better line is up); `force` skips the moment's cooldown, `interrupt` replaces any line
  say(key, ctx = {}, force = false, interrupt = false) {
    const C = LINES[key];
    if (!C || !this.body) return false;
    if (!force && C.cool && this.clock - (this.lastSaid[key] ?? -1e9) < C.cool) return false;
    if (!interrupt && this.bubble.busy(C.prio)) return false;
    if (!this.showing) return false;
    this.lastSaid[key] = this.clock;
    const line = this.pick(key, C.lines);
    if (ctx.swap && ctx.A) ctx = { ...ctx, B: ctx.A.opp };
    const name = (f) => (f ? `<b style="--nc:${esc(f.def.color)}">${esc(f.def.name)}</b>` : '');
    const html = esc(line)
      .replace(/\{A\}/g, () => name(ctx.A))
      .replace(/\{B\}/g, () => name(ctx.B))
      .replace(/\{M\}/g, () => `<b class="mv">${esc(ctx.M ?? '')}</b>`)
      .replace(/\{N\}/g, () => esc(ctx.N ?? ''));
    const chars = line.length + 6;
    const secs = Math.min(3.4, Math.max(key === 'count' ? 0.55 : 1.7, 1.2 + chars * 0.045));
    this.bubble.say(html, C.style, secs, C.prio);
    this.lastLineEnd = this.clock + secs;
    const who = C.look === 'A' ? ctx.A : C.look === 'B' ? ctx.B : null;
    if (who) this.look = who;
    if (C.anim) this.reactTo(C.anim, C.secs ?? 1.2, this.route.length ? 0 : C.hold ?? 0);
    return true;
  }

  // a random line, never the same one twice in a row: each moment draws from a shuffled bag
  pick(key, lines) {
    let bag = this.bags[key];
    if (!bag || !bag.length) {
      bag = this.bags[key] = lines.map((_, i) => i).sort(() => Math.random() - 0.5);
      if (lines.length > 1 && bag[bag.length - 1] === this.bags[key + ':last']) bag.unshift(bag.pop());
    }
    const i = bag.pop();
    this.bags[key + ':last'] = i;
    return lines[i];
  }

  // place his caption: the top of his head on screen, the free area between the HUD bars and the touch buttons
  speak(game, dt, frozen) {
    if (!this.bubble.cur) { this.bubble.update(dt, null, null, false, frozen); return; }
    const cam = game.camera, cv = game.renderer?.renderer?.domElement;
    const head = this.place === 'hop' || this.react?.anim !== 'cower' ? HEAD : 1.0;
    tmpV.set(this.pos.x, this.pos.y + head, this.pos.z);
    // behind the camera (the intro flythrough): nowhere to put it
    if (!cam || !cv || !this.showing || tmpW.copy(tmpV).applyMatrix4(cam.matrixWorldInverse).z > -0.1) {
      this.bubble.update(dt, null, null, false, frozen);
      return;
    }
    const rect = cv.getBoundingClientRect();
    const L = this.bubble.layer.getBoundingClientRect(); // the caption's own frame (the lab docks a panel beside the game)
    tmpV.project(cam);
    const x = (tmpV.x + 1) / 2 * rect.width, y = (1 - tmpV.y) / 2 * rect.height;
    const ox = rect.left - L.left, oy = rect.top - L.top;
    const top = oy + rect.height * (game.hud?.root?.classList.contains('hidden') ? 0.06 : 0.17); // under the bars
    const bottom = oy + rect.height * (game.touch?.visible ? 0.62 : 0.8); // the on-screen buttons fill the bottom corners
    this.bubble.update(dt, { x: x + ox, y: y + oy }, { w: L.width, h: L.height, top, bottom }, true, frozen);
  }
}
