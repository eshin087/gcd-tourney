// CPU combo composer (ADR 0026). MasterBrain asks it what to do at each decision point ("node") of a combo it is
// running: light3 connected, the victim bounced off the wall, we're free in the air beside them... It answers with an
// edge of a graph of combo moves (chain, launch, super dash, vanish, a kit special, meet the bounce, ...), filtered by
// live frame data: the victim's stun left against the edge's link gap, with 2+ frames of margin (else a victim
// holding Guard techs out at the gap and the counter turns blue, ADR 0022), the bounce budget (JUGGLE), ki and the
// super dash. Among the edges that work it draws one, weighted by a per-match persona (a style read from the kit
// data), a length tier per combo, freshness, and a cooldown on routes either CPU used recently. Every draw comes from
// the brain's seeded rng, so `?seed=` replays them. It presses buttons only through the brain (tap, special, keep).
import { MOVES, VANISH, SUPER_DASH, JUGGLE, PROJECTILES, DEFENSE, SUPERS, AIR } from './moves.js';
import { specialFor, kitOf } from './kit.js';
import { ARENA_LIMIT, GRAVITY, DT, ROUND_TIME } from './constants.js';
import { gauss, pickW } from './rng.js';
import { specialId } from './aiShow.js';
import { SHORT_HOP } from './aiNormals.js';

const J = JUGGLE;
const GROUND_SLOTS = ['neutral', 'forward', 'up', 'down', 'back'];
const AIR_SLOTS = ['air', 'airDown'];
// screen reach of the normals the composer meets a victim with (hit boxes come from the art: ~1.25 on the packs)
const AIR_REACH = 1.5; // an air normal from the free air state (MasterBrain's old juggle test; air boxes are tall)
const MARGIN = 2; // frames a link must land before the victim's first open frame (a held Guard techs on it)
const CHASE = 20; // a launcher's super-jump chase until the first air hit lands (startChase ~16 f + airLight1)
export const TIERS = { short: [4, 7], medium: [8, 12], highlight: [13, 20] };
const RUN = 0, DONE = 1, FAIL = -1;

// ------------------------------------------------------------------ prediction (JUGGLE + MOVES only)
export const decayAt = (c) => Math.max(J.decay.floor, 1 - (c - 1) * J.decay.per);

// Stun a victim gets from its c-th hit. kind: 'launch' (air stun of a launching hit), 'juggle' (an airborne victim
// hit without a launch), 'wall' / 'bounce' (the n-th wall / ground bounce of the combo, n from 0), else grounded hit
// stun from the move's `base` hitstun.
export function stunAfter(kind, c, base = 20, n = 0) {
  switch (kind) {
    case 'launch': return Math.round(Math.max(J.launchStun.min, J.launchStun.base - c * J.launchStun.per) * decayAt(c));
    case 'juggle': return Math.round(Math.max(J.airStun.min, J.airStun.base - c * J.airStun.per) * decayAt(c));
    case 'wall': return J.wall.stun[Math.min(n, J.wall.stun.length - 1)];
    case 'bounce': return J.ground.stun[Math.min(n, J.ground.stun.length - 1)];
    default: return Math.round(base * decayAt(c));
  }
}

// Live frames from one hit to the next for a chain or a cancel on hit (moves.js names): a chain fires at the first
// move's `cancel` frame, a cancel on hit (light into heavy, air light into air heavy) the frame after its hitstop.
export function linkGap(prev, next) {
  const P = MOVES[prev], N = MOVES[next];
  if (!P || !N) return null;
  return P.next === next ? P.cancel - P.startup + N.startup : 1 + N.startup;
}

// Horizontal distance a victim launched with [lx, ly] at combo c from height y0 covers before it lands (the one hard
// floor skip included, like Fighter.onLand), with nothing in the way.
export function flightReach(lx, ly, c, y0 = 0) {
  const gs = Math.min(J.gravity.max, J.gravity.base + c * J.gravity.per);
  let x = 0, y = y0, vx = lx, vy = ly < 0 && y0 <= 0.05 ? 6 : ly, skipped = false;
  for (let k = 0; k < 240; k++) {
    x += vx * DT; y += vy * DT; vy -= GRAVITY * gs * DT;
    if (y <= 0 && vy <= 0) {
      const imp = -vy;
      if (imp > J.floor.impact && !skipped) { skipped = true; y = 0; vy = imp * J.floor.keep; vx *= J.floor.slide; continue; }
      return x;
    }
  }
  return x;
}

// The speed a launch [lx, ly] still has when it has covered `room` (the floor skip halves it), or 0 if it lands first:
// a wall bounce needs more than JUGGLE.wall.minSpeed.
function speedAt(lx, ly, c, y0, room) {
  const gs = Math.min(J.gravity.max, J.gravity.base + c * J.gravity.per);
  let x = 0, y = y0, vx = lx, vy = ly < 0 && y0 <= 0.05 ? 6 : ly, skipped = false;
  for (let k = 0; k < 240; k++) {
    x += vx * DT; y += vy * DT; vy -= GRAVITY * gs * DT;
    if (x >= room) return vx;
    if (y <= 0 && vy <= 0) {
      const imp = -vy;
      if (imp > J.floor.impact && !skipped) { skipped = true; y = 0; vy = imp * J.floor.keep; vx *= J.floor.slide; continue; }
      return 0;
    }
  }
  return 0;
}

// Will a hit with launch L at combo c, from height y0, with `room` to the barrier behind the victim, wall-bounce them?
export function wallAhead(L, c, y0, room, wbCount) {
  if (!L || wbCount >= J.wall.max) return false;
  return speedAt(L[0], L[1], c, y0, Math.max(0, room - 0.25)) > J.wall.minSpeed + 0.5;
}

// Scratch for predictFlight (no allocations per frame): the victim's position, air stun left and state per frame
// (bounce: 1 off the barrier, 2 off the floor, 3 the floor skip).
export const PF = 120;
const PX = new Float32Array(PF), PY = new Float32Array(PF), PZ = new Float32Array(PF);
const PS = new Int16Array(PF), PL = new Uint8Array(PF), PB = new Uint8Array(PF);
export const flight = { x: PX, y: PY, z: PZ, stun: PS, live: PL, bounce: PB, n: 0, firstBounce: -1 };

// Step the victim forward n frames the way Fighter.update / physics / onLand would, with nobody touching them:
// position, stun left (air stun, or hit stun on the ground) and whether they are still stuck in the combo (`live`).
// Barrier and ground bounces follow the budget (each one sets the bounce's stun and a hitstop). Fills `flight`.
export function predictFlight(o, n = PF) {
  n = Math.min(n, PF);
  const launched = o.state === 'launched';
  let x = o.pos.x, y = o.pos.y, z = o.pos.z, vx = o.vel.x, vy = o.vel.y, vz = o.vel.z;
  let stun = launched ? o.airStun : o.state === 'hitstun' ? Math.max(0, o.stun - o.t) : 0;
  let hold = o.hitstop, wb = o.wb, gb = o.gb, wbN = o.wbCount, gbN = o.gbCount, skipped = !!o.bounced, alive = launched || o.state === 'hitstun';
  const gs = Math.min(J.gravity.max, J.gravity.base + o.combo * J.gravity.per);
  flight.firstBounce = -1;
  for (let k = 0; k < n; k++) {
    PB[k] = 0;
    if (!alive) { PX[k] = x; PY[k] = y; PZ[k] = z; PS[k] = 0; PL[k] = 0; continue; }
    if (hold > 0) hold--;
    else if (launched) {
      if (stun > 0) stun--;
      x += vx * DT; y += vy * DT; z += vz * DT;
      vy -= GRAVITY * gs * DT;
      if (y <= 0) {
        y = 0;
        if (vy <= 0) {
          const imp = -vy;
          if (gb) {
            gb = false; vy = J.ground.up; vx *= J.ground.keep; vz *= J.ground.keep;
            stun = J.ground.stun[Math.min(gbN, J.ground.stun.length - 1)]; gbN++; hold = 5; PB[k] = 2;
            if (flight.firstBounce < 0) flight.firstBounce = k;
          } else if (o.feetLand) alive = false; // a light pop lands on the feet: no floor skip, the combo ends (ADR 0042)
          else if (imp > J.floor.impact && !skipped) {
            skipped = true; vy = imp * J.floor.keep; vx *= J.floor.slide; vz *= J.floor.slide; PB[k] = 3;
          } else alive = false;
        }
      }
      // the ring barrier on both axes
      if (Math.abs(x) > ARENA_LIMIT) {
        x = Math.sign(x) * ARENA_LIMIT;
        if (wb && Math.abs(vx) > J.wall.minSpeed) { wb = false; vx = -vx * J.wall.keep; vy = Math.max(vy, J.wall.up); stun = J.wall.stun[Math.min(wbN, J.wall.stun.length - 1)]; wbN++; hold = 7; PB[k] = 1; if (flight.firstBounce < 0) flight.firstBounce = k; } else vx *= -0.25;
      }
      if (Math.abs(z) > ARENA_LIMIT) {
        z = Math.sign(z) * ARENA_LIMIT;
        if (wb && Math.abs(vz) > J.wall.minSpeed) { wb = false; vz = -vz * J.wall.keep; vy = Math.max(vy, J.wall.up); stun = J.wall.stun[Math.min(wbN, J.wall.stun.length - 1)]; wbN++; hold = 7; PB[k] = 1; if (flight.firstBounce < 0) flight.firstBounce = k; } else vz *= -0.25;
      }
    } else {
      // grounded hit stun: sliding on the push, out of it when the stun runs out
      vx *= 0.86; vz *= 0.86;
      x = Math.max(-ARENA_LIMIT, Math.min(ARENA_LIMIT, x + vx * DT));
      z = Math.max(-ARENA_LIMIT, Math.min(ARENA_LIMIT, z + vz * DT));
      stun--;
      if (stun <= 0) alive = false;
    }
    PX[k] = x; PY[k] = y; PZ[k] = z; PS[k] = Math.max(0, stun); PL[k] = alive ? 1 : 0;
  }
  flight.n = n;
  return flight;
}

// distance a lunging ground move covers from frame t until its first active frame (its lunge fades over startup+active)
export function lungeTo(m, t = 0) {
  if (!m.lunge || m.air) return 0;
  const B = m.startup + m.active;
  let d = 0;
  for (let k = Math.max(0, t); k < m.startup; k++) d += (m.lunge * (1 - k / B)) / 60;
  return d;
}

// The frames until our fighter can start a ground move: an attack's recovery, landing lag, a dash's first 4 frames.
// frames for a body at height y rising at vy to touch the floor under gravity scale g
const fallFrames = (y, vy, g = 1) => Math.ceil(((vy + Math.sqrt(vy * vy + 2 * GRAVITY * g * Math.max(0, y))) / (GRAVITY * g)) * 60);

function readyIn(f) {
  switch (f.state) {
    case 'idle': case 'run': case 'guard': return 0;
    case 'attack': {
      const m = f.move;
      if (!m) return 0;
      const rec = Math.max(0, m.startup + m.active + m.recovery - f.t);
      if (f.air && m.air && !f.juggleMove) {
        // a Smash aerial falls with the jump (ADR 0042): it lands when the feet touch, into its own landing lag (a
        // plain landing from its autoCancel frame on, or once it has ended in the air: actionable from the 3rd frame)
        const fall = fallFrames(f.pos.y, f.vel.y);
        if (fall >= rec) return fall + 3;
        const lag = m.autoCancel != null && f.t + fall >= m.autoCancel ? 5 : m.landLag ?? AIR.landLag;
        return fall + (lag <= 6 ? 3 : lag);
      }
      // an air move ends in the air: then the fall and the 8 frames of its landing
      return f.air && !m.hop ? rec + fallFrames(f.pos.y, Math.max(0, f.vel.y)) + 8 : rec;
    }
    case 'land': return f.landLag <= 6 ? Math.max(0, 3 - f.t) : Math.max(0, f.landLag - f.t);
    case 'dash': return Math.max(0, 4 - f.t);
    case 'wavedash': return Math.max(0, DEFENSE.wavedash.act - f.t);
    case 'air': return fallFrames(f.pos.y, f.vel.y, f.chase > 0 ? 0.3 : 1) + 3; // until the feet touch, then 3 landing frames
    default: return 99;
  }
}

// Earliest frame k (from now) at which ground move `name`, started from where we stand (walking toward them until
// the press, at our walk speed), meets the predicted victim: inside its art reach (artBox) in front of us on screen,
// low enough, still in the combo with MARGIN frames of stun to spare. `flight` must hold this victim's prediction.
// Returns { k, press (frame to press), walk (units still to walk), dir } in `meetOut`, or null.
const meetOut = { k: 0, press: 0, walk: 0, dir: 1 };
export function intercept(f, o, name, ready, R, dash = false) {
  const m = MOVES[name], b = artBox(f, name);
  const a0 = f.pos.x * R.x + f.pos.z * R.z;
  const v0 = o.pos.x * R.x + o.pos.z * R.z;
  const dir = Math.sign(v0 - a0) || f.side;
  const walk = (f.speedStat ?? 6) / 60;
  const lunge = lungeTo(m) * (dash ? 2 : 1); // a light out of a dash lunges at 9
  const dashRun = dash ? 1.0 : 0; // the dash itself (16 u/s, 4 frames before the light can come out)
  const near = Math.max(0.3, b.near), far = farFor(b, o);
  const low = b.y0 - (m.boxPad?.[1] ?? 0.12) + 0.08 - bodyTop(o); // their feet must be above this for the body to reach the box
  for (let k = ready + m.startup + (dash ? 4 : 0); k < flight.n; k++) {
    if (!PL[k]) return null;
    if (PS[k] < MARGIN + 1 || PY[k] - f.pos.y > b.top || PY[k] - f.pos.y <= low) continue;
    const press = k - m.startup - (dash ? 4 : 0);
    const along = ((PX[k] * R.x + PZ[k] * R.z) - a0) * dir - lunge - dashRun;
    if (along + lunge + dashRun < 0.35) return null; // they flew past us
    const room = walk * Math.max(0, press - ready);
    if (along < near || along > far + room) continue;
    meetOut.k = k;
    meetOut.press = press;
    meetOut.walk = Math.max(0, along - (far - 0.15));
    meetOut.dir = dir;
    return meetOut;
  }
  return null;
}

// Frames until a super dash started `wait` frames from now touches the predicted victim (Fighter.updateSuperDash:
// 18 u/s straight at them, contact under 1 unit, at most 42 frames), or null.
export function superDashGap(f, wait) {
  let ax = f.pos.x, ay = f.pos.y, az = f.pos.z;
  const step = SUPER_DASH.speed / 60;
  for (let k = wait; k < Math.min(flight.n, wait + SUPER_DASH.maxFrames); k++) {
    const tx = PX[k], ty = PY[k] + (PY[k] > 0.05 ? 0.1 : 0), tz = PZ[k];
    const dx = tx - ax, dy = ty - ay, dz = tz - az, d = Math.hypot(dx, dy, dz);
    if (d < 1.0) return PL[k] ? k + 1 : null;
    ax += (dx / d) * step; ay += (dy / d) * step; az += (dz / d) * step;
  }
  return null;
}

// whether a special puts the victim into the barrier (its own hit, its shot, its follow-up strike, its vortex pop)
function bouncesOffWall(m) {
  return !!(m.wallBounce || PROJECTILES[m.proj]?.wallBounce || MOVES[m.follow]?.wallBounce || m.vortex?.pop?.wallBounce);
}

// ------------------------------------------------------------------ personas
// tags: weight multipliers per edge tag; tiers: [short, medium, highlight] length odds; ki: appetite for spending on
// vanishes and specials mid-combo; risk: how willing it is to take a tight link (2-3 frames of margin) and to stop a
// combo to bait a burst. `optimal` (IMPOSSIBLE, INSANE): the best-damage edge that links, as long as it links.
export const PERSONAS = {
  rushdown: { tags: { ground: 1.6, dash: 1.4, relaunch: 1.3, air: 0.8, vanish: 0.7 }, tiers: [0.55, 0.35, 0.1], ki: 0.6, risk: 0.5 },
  juggler: { tags: { air: 1.7, relaunch: 1.6, gb: 1.6, dash: 1.3 }, tiers: [0.35, 0.4, 0.25], ki: 0.7, risk: 0.6 },
  vanishArtist: { tags: { vanish: 2.2, vanishChain: 1.8, teleport: 1.8 }, tiers: [0.4, 0.4, 0.2], ki: 1.0, risk: 0.7 },
  wallBouncer: { tags: { wall: 2.2, handball: 2.0, ground: 1.2 }, tiers: [0.35, 0.4, 0.25], ki: 0.7, risk: 0.8 },
  kitShowman: { tags: { kit: 2.0, big: 1.5 }, tiers: [0.5, 0.35, 0.15], ki: 0.9, risk: 0.5 },
  optimal: { optimal: true, tags: {}, tiers: null, ki: 1, risk: 0.3 },
};
const ARCHETYPES = ['rushdown', 'juggler', 'vanishArtist', 'wallBouncer', 'kitShowman'];

// A per-match persona for a fighter: a primary archetype drawn by kit affinity (read from the kit data: teleports
// lean vanish artist, wall-bounce specials wall bouncer, ground-bounce dives juggler, a pull kit showman), 30 % of a
// secondary blended in, and every tag jittered ×exp(0.25·gauss). `force`: an archetype by name (the lab).
export function makePersona(rand, def, force = null) {
  if (force === 'optimal') return { ...PERSONAS.optimal, name: 'optimal' };
  const aff = { rushdown: 1, juggler: 1, vanishArtist: 1, wallBouncer: 1, kitShowman: 1 };
  const why = new Set();
  for (const slot of [...GROUND_SLOTS, ...AIR_SLOTS]) {
    const m = specialFor(def, slot);
    if (!m) continue;
    if (m.kind === 'teleport') why.add('vanishArtist');
    if (bouncesOffWall(m) && (m.kind === 'shot' || m.kind === 'rush' || m.follow)) why.add('wallBouncer');
    if (m.kind === 'dive' && m.hit?.groundBounce) why.add('juggler');
    if (m.kind === 'pull') why.add('kitShowman');
  }
  for (const k of why) aff[k] *= k === 'juggler' || k === 'kitShowman' ? 1.3 : 1.5;
  const primary = PERSONAS[force] ? force : pickW(aff, rand) || 'juggler';
  delete aff[primary];
  const secondary = pickW(aff, rand) || 'rushdown';
  const P = PERSONAS[primary], S = PERSONAS[secondary];
  const tags = {};
  for (const t of new Set([...Object.keys(P.tags), ...Object.keys(S.tags)])) {
    tags[t] = (0.7 * (P.tags[t] ?? 1) + 0.3 * (S.tags[t] ?? 1)) * Math.exp(0.25 * gauss(rand));
  }
  return {
    name: `${primary}+${secondary}`, primary, secondary, tags,
    tiers: P.tiers.map((w, i) => 0.7 * w + 0.3 * S.tiers[i]),
    ki: 0.7 * P.ki + 0.3 * S.ki, risk: 0.7 * P.risk + 0.3 * S.risk,
  };
}

// ------------------------------------------------------------------ the graph
// Nodes (where MasterBrain asks): L1 / L2 / G3 / G4 (that ground light connected), LAUNCH (heavy connected), A1 / A2
// (that air light connected), DT / UT (the down / up tilt connected), HOP (a short-hop aerial connected on a standing
// victim), FLY (any other move of ours connected: an ender, a kick, a smash attack, a special), AFREE (we're in the
// air, free, beside a juggled victim), AIRLOCK (in the air after an air string: only a super dash or a vanish),
// WALLBACK / GBUP (the victim just bounced off the barrier / the floor), RESTART (we're on the ground and free while
// they still reel). An edge: { id, nodes, tags, w (weight, or per node), opt (the optimal persona's priority),
// cost (ki), tool (Showcase id), act, pre }. pre(x) returns the frames until its first hit lands (checked against
// the stun left), `true` for edges that don't hit by themselves, or null when it can't work now.
const NODE_OF_MOVE = { light1: 'L1', light2: 'L2', light3: 'G3', light4: 'G4', heavy: 'LAUNCH', airLight1: 'A1', airLight2: 'A2', dTilt: 'DT', uTilt: 'UT' };
const NODES = ['L1', 'L2', 'G3', 'G4', 'LAUNCH', 'A1', 'A2', 'DT', 'UT', 'HOP', 'FLY', 'AFREE', 'AIRLOCK', 'WALLBACK', 'GBUP', 'RESTART'];
// the Smash link nodes (ADR 0042): a link chosen there is carried on after our move ends (we land, recover) until it
// is pressed, since the next hit comes after the move instead of cancelling out of it
const LINK_NODES = new Set(['DT', 'UT', 'HOP']);

const inAttack = (x) => x.f.state === 'attack' && x.f.move && x.f.moveHit;
const airFree = (x) => x.f.state === 'air' && !x.f.airAttack;
const groundSide = (x) => !x.f.air && x.f.pos.y < 0.05;

// Where a fighter's move can hit, from its art: the union of the hit boxes on the move's active frames (local units,
// facing right: x along the screen, y up from the feet), so a link the drawing can't reach is never planned (a
// strike drawn short, or behind the body). Without boxes (the baked placeholder): its reach / yTol numbers.
const BOXES = new WeakMap();
const HURT_HALF = 0.28 + 0.1; // the victim's half-width (HURT_MIN_W / 2) plus Game.checkMelee's box pad
// a launched pose leans back: its hurt box starts only ~0.1 in front of the victim's center (fighter.js JUGGLE_GAP)
const LAUNCHED_NEAR = 0.1 + 0.1;
export function artBox(f, name) {
  const asset = f.asset;
  let cache = BOXES.get(asset);
  if (!cache) BOXES.set(asset, (cache = {}));
  if (cache[name]) return cache[name];
  const m = MOVES[name];
  let b = null;
  const a = asset?.anim?.(m.anim);
  if (a?.frames?.length && asset.boxes) {
    const ph = a.phases?.length === 3 ? a.phases : null;
    const fr = ph ? a.frames.slice(ph[0], ph[0] + ph[1]) : a.frames.slice(Math.floor(a.frames.length * 0.33), Math.ceil(a.frames.length * 0.66));
    for (const frame of fr) {
      for (const h of asset.boxes(frame, 'hit', 1) ?? []) {
        b = b ?? { x0: 9, x1: -9, y0: 9, y1: -9 };
        b.x0 = Math.min(b.x0, h.x0); b.x1 = Math.max(b.x1, h.x1); b.y0 = Math.min(b.y0, h.y0); b.y1 = Math.max(b.y1, h.y1);
      }
    }
  }
  if (!b) b = { x0: 0, x1: m.reach ?? 1.3, y0: 0.3, y1: m.yTol ?? 1.25 };
  const [px, py] = m.boxPad ?? (m.air || m.hover ? [0.18, 0.45] : [0.1, 0.12]);
  // the victim's center may sit this far out (near .. far) and its feet this high (top) for the boxes to meet
  b.near = b.x0 - px - HURT_HALF;
  b.far = b.x1 + px + HURT_HALF;
  b.top = b.y1 + py - 0.1;
  return (cache[name] = b);
}

// how far beyond its far edge a hit box still meets this victim's body (a launched body leans away from us)
const farFor = (b, o) => b.far - (o.state === 'launched' ? HURT_HALF - LAUNCHED_NEAR : 0);

// the top of the victim's body right now (its art hurt boxes; a recoiling pose is shorter than a standing one)
function bodyTop(o) {
  let top = 0;
  for (const u of o.asset?.boxes?.(o.actor.frame, 'hurt', o.side) ?? []) top = Math.max(top, u.y1);
  return top || 1.45;
}

// The aerial that meets them from our jump (Smash air, ADR 0042), checked like a link: the art's hit box at its first
// active frame, with us falling at full gravity (no float outside a juggle) and them carried on their speed. Above us the
// up air, behind our facing the back air (the facing holds through a jump), in front the neutral or forward air, below
// us the down air (the spike); beside a reeling opponent the DBFZ juggle's air string. null: nothing reaches them yet.
// `ff`: pressed now with a fast fall from the next frame (a fast-fall aerial: it hits low and lands right after the hit,
// so a link follows).
const AERIALS = ['uair', 'bair', 'airLight1', 'fair', 'airHeavy'];
export function aerialFor(f, R, ff = false) {
  const o = f.opp;
  if (f.juggling()) {
    const sx = (o.pos.x - f.pos.x) * R.x + (o.pos.z - f.pos.z) * R.z;
    return Math.abs(sx) < 1.6 && Math.abs(o.pos.y - f.pos.y) < 1.6 ? 'airLight1' : null;
  }
  const fits = AERIALS.filter((name) => aerialMeets(f, o, name, R, ff));
  if (!fits.length) return null;
  // the neutral and forward air both reach: either, so the jump-ins vary (the brains' Math.random, not the seeded one)
  if (fits[0] === 'airLight1' && fits[1] === 'fair' && Math.random() < 0.5) return 'fair';
  return fits[0];
}

// pressed now, would aerial `name` meet them (fast-falling from the next frame with `ff`)? Both bodies are carried on
// their speeds meanwhile.
function aerialMeets(f, o, name, R, ff = false) {
  const m = MOVES[name], b = artBox(f, name), T = m.startup / 60, t1 = T - 1 / 60;
  const y = ff ? f.pos.y + f.vel.y / 60 - AIR.fastFall * t1 - 0.5 * GRAVITY * t1 * t1 : f.pos.y + f.vel.y * T - 0.5 * GRAVITY * T * T;
  if (y <= 0.05) return false; // it would land before it comes out
  const oy = o.air ? Math.max(0, o.pos.y + o.vel.y * T - 0.5 * GRAVITY * T * T) : o.pos.y;
  const dy = oy - y, pad = m.boxPad?.[1] ?? 0.45;
  if (dy >= b.top || dy + bodyTop(o) <= b.y0 - pad + 0.08) return false;
  // the up air is for someone above us, the spike for someone below (a stand-in strip's box can reach further)
  if ((name === 'uair' && dy < 0.35) || (name === 'airHeavy' && dy > -0.5)) return false;
  const sx = (o.pos.x - f.pos.x + (o.vel.x - f.vel.x) * T) * R.x + (o.pos.z - f.pos.z + (o.vel.z - f.vel.z) * T) * R.z;
  // a back air without its own strip shows a forward one mirrored, boxes and all (Fighter.mirrorPose)
  const ahead = sx * f.side * (m.back && !f.hasStrip(m.anim) ? -1 : 1);
  return ahead > b.near + 0.05 && ahead < farFor(b, o) - 0.05;
}

// Can our move `name`, its first active frame k frames from now, meet the predicted victim? Our lunge during the
// startup closes in; a juggled victim must still be low enough for the boxes. An air move follows the victim
// sideways by itself (Fighter.updateAttack's juggle tracking), so only its height matters.
function meets(x, name, k, selfY = x.f.pos.y) {
  const f = x.f, R = x.c.R, m = MOVES[name], b = artBox(f, name);
  const i = Math.min(PF - 1, Math.max(0, k));
  const dy = PY[i] - selfY, pad = m.boxPad?.[1] ?? (m.air ? 0.45 : 0.12);
  // their body (feet .. top) must overlap the box's height
  if (dy >= b.top || dy + bodyTop(x.o) <= b.y0 - pad + 0.08) return false;
  if (m.air) return true;
  const dx = ((PX[i] - f.pos.x) * R.x + (PZ[i] - f.pos.z) * R.z) * x.c.toward - lungeTo(m);
  return dx > b.near + 0.05 && dx < farFor(b, x.o) - 0.05;
}

function gapChain(x) {
  const m = x.m;
  if (!inAttack(x) || !m.next) return null;
  const g = Math.max(0, m.cancel - x.t) + MOVES[m.next].startup;
  return m.air || meets(x, m.next, g) ? g : null; // (an air chain tracks the victim: Fighter.updateAttack)
}

function gapHeavyCancel(x) {
  const m = x.m;
  if (!inAttack(x) || (!m.light && !m.air) || x.f.moveName === 'airHeavy') return null;
  const g = MOVES[m.air ? 'airHeavy' : 'heavy'].startup;
  return m.air || meets(x, 'heavy', g) ? g : null;
}

// frames into a throw's toss (its super dash and vanish open from frame 6, Fighter.updateThrow), or -1
const TOSS_OPEN = 6;
const tossK = (f) => (f.state === 'throw' && f.throwSt?.phase === 'toss' ? f.t - f.throwSt.t0 : -1);

function gapVanish(x) {
  const f = x.f;
  if (f.ki < VANISH.cost) return null;
  const toss = tossK(f);
  const ok = inAttack(x) || toss >= 0 || ['idle', 'run', 'guard', 'air'].includes(f.state) || (f.state === 'land' && readyIn(f) === 0);
  return ok ? Math.max(0, TOSS_OPEN - toss) * (toss >= 0 ? 1 : 0) + VANISH.hideFrames + MOVES.vanishKick.startup + 1 : null;
}

function gapSuperDash(x) {
  const f = x.f, m = x.m, toss = tossK(f);
  if (f.airDashes > 0) return null;
  let wait;
  if (toss >= 0) wait = Math.max(0, TOSS_OPEN - toss);
  else if (inAttack(x)) {
    if (!m.launch && !m.wallBounce) return null;
    wait = Math.max(0, m.startup + m.active - x.t);
  } else if (f.state === 'air') {
    if (!f.airAttack && Math.hypot(x.c.sx, x.c.dy) < 2.4) return null; // right beside them: the air string, not a dash
    wait = 0;
  } else wait = readyIn(f);
  if (wait > 30) return null;
  const k = superDashGap(f, wait + 1);
  return k == null ? null : k + 1;
}

// a kit special, as a cancel on hit (fromCancel) or from neutral / the air
function gapKit(x, m, air) {
  const f = x.f, c = x.c, o = x.o;
  if (f.ki < (m.cost ?? 0)) return null;
  const cancel = !air && inAttack(x) && !x.m.special && !x.m.air;
  const ready = air ? (airFree(x) ? 0 : null) : cancel ? 0 : (groundSide(x) ? readyIn(f) : null);
  if (ready == null || ready > 20) return null;
  const lead = ready + (cancel || air ? 0 : 2); // a neutral special fires on the release
  const dist = Math.hypot(c.sx, c.dy);
  switch (m.kind) {
    case 'rush': {
      if (air || Math.abs(c.sd) > 0.6 || o.pos.y > 1.2) return null;
      const st = cancel && m.cancelStartup ? m.cancelStartup : m.startup;
      return lead + st + Math.max(0, Math.abs(c.sx) - (m.reach ?? 1.3)) / m.rush * 60 + 1;
    }
    case 'shot': {
      const P = PROJECTILES[m.proj];
      if (!P || dist > P.speed * P.life + 0.6 || Math.abs(c.sd) > 0.8) return null;
      return lead + m.startup + Math.max(0, dist - 0.8) / P.speed * 60 + 1;
    }
    case 'teleport':
      return m.follow ? lead + (m.startup ?? 0) + m.hide + (MOVES[m.follow]?.startup ?? 3) + 1 : null;
    case 'pull': {
      // Blue: the vortex opens `dist` ahead; its first tick lands `tick` frames later if they're inside it
      if (air || ready > 0) return null;
      const k = Math.min(PF - 1, lead + m.startup);
      const vx = f.pos.x + f.face.x * m.dist, vz = f.pos.z + f.face.y * m.dist;
      if (!PL[k] || Math.hypot(PX[k] - vx, PZ[k] - vz) > m.radius - 0.6) return null;
      return lead + m.startup + m.tick + 1;
    }
    case 'dive': {
      if (air) {
        // the slam hits on our landing: they must be low and close then
        const fall = m.hang + Math.ceil(f.pos.y / -m.slamV * 60) + 1;
        const k = Math.min(PF - 1, fall);
        if (!PL[k] || PY[k] > 1.1 || Math.hypot(PX[k] - f.pos.x, PZ[k] - f.pos.z) > (m.area ?? 1.6) + 0.6) return null;
        return fall;
      }
      if (!m.riseHit || dist > 3 || o.pos.y > 1.6) return null;
      return lead + Math.max(2, Math.ceil((dist - 1.2) / 14 * 60)) + 1;
    }
  }
  return null;
}

// Blink (a plain teleport above them): reappear over their head, then the air heavy spikes them down
function gapAbove(x, m) {
  const f = x.f;
  if (m.kind !== 'teleport' || m.to !== 'above' || m.follow || f.ki < (m.cost ?? 0)) return null;
  const cancel = inAttack(x) && !x.m.special && !x.m.air;
  if (!cancel && !(groundSide(x) && readyIn(f) === 0)) return null;
  return (cancel ? 0 : 2) + (m.startup ?? 0) + m.hide + (m.recovery ?? 0) + 2 + MOVES.airHeavy.startup;
}

// In reach of an air normal from where we hang: the light in front (MasterBrain's old juggle test), the heavy also
// reaching down at someone below us (it's a spike with a tall box).
function airInReach(c, move) {
  if (Math.abs(c.sd) >= 0.7) return false;
  if (move === 'airHeavy') return Math.abs(c.sx) < 1.2 && c.dy < 0.1 && c.dy > -2.4; // it chops down: they're below us
  if (move === 'uair') return Math.abs(c.sx) < 1.15 && c.dy > -0.2 && c.dy < 2.0; // it hits above the head (ADR 0042)
  return Math.hypot(c.sx, c.dy) < AIR_REACH;
}

// Do we stay in the air for `pre` frames (falling at full gravity) and then an air move's `during` frames (air
// attacks fall at 0.35×)? An air normal started too close to the floor lands and is gone before it hits.
let selfY = 0; // where airborneFor() left us (our height when the air move hits)
function airborneFor(f, pre, during) {
  let y = f.pos.y, vy = f.vel.y;
  const g1 = GRAVITY * (f.chase > 0 ? 0.3 : 1) * DT, g2 = GRAVITY * 0.35 * DT;
  for (let k = 0; k < pre + during; k++) {
    y += vy * DT;
    vy -= k < pre ? g1 : g2;
    if (k >= pre && vy < -2.5) vy = -2.5; // Fighter.updateAttack caps an air move's fall
    if (k >= pre && vy > 0) vy *= 0.82; // ...and damps its rise
    if (y <= 0.02) return false;
  }
  selfY = y;
  return true;
}

// in the air and free: frames until they're in reach of an air normal (drifting toward them), or null
function gapAirReach(x, move) {
  if (!airFree(x)) return null;
  const c = x.c;
  if (move === 'airHeavy' && c.dy > 0.1) return null;
  if (move === 'uair' && c.dy < -0.2) return null;
  const d = move === 'airHeavy' ? Math.max(Math.abs(c.sx) - 1.15, -c.dy - 2.3, 0)
    : move === 'uair' ? Math.max(Math.abs(c.sx) - 1.1, c.dy - 1.9, 0) : Math.hypot(c.sx, c.dy) - AIR_REACH + 0.1;
  const frames = airInReach(c, move) ? 0 : Math.ceil(Math.max(0, d) / 0.2);
  if (frames > 14 || !airborneFor(x.f, frames + 1, MOVES[move].startup)) return null;
  const k = frames + 1 + MOVES[move].startup;
  return meets(x, move, k, selfY) ? k : null; // they'll still be at our height when it comes out
}

// Out of an up tilt (ADR 0042): a short hop under the victim it popped, then the up air. Frames from now until its hit
// (our recovery, the 4-frame squat, a few airborne frames, the up air's startup), or null when their predicted flight
// doesn't pass through its reach in time. Our height is the short hop's without the juggle float (the lower case).
const SQUAT = 4;
function gapHop(x, move = 'uair') {
  const f = x.f, R = x.c.R, m = MOVES[move];
  if (!groundSide(x) || x.o.state !== 'launched') return null;
  const ready = readyIn(f);
  if (ready > 20) return null;
  const a0 = f.pos.x * R.x + f.pos.z * R.z;
  for (let j = 1; j <= 12; j++) {
    const k = ready + SQUAT + j + m.startup;
    if (k >= flight.n || !PL[k]) return null;
    if (PS[k] < MARGIN + 1) continue;
    const a = (j + m.startup) / 60, y = AIR.shortHop * a - 0.5 * GRAVITY * a * a;
    if (y <= 0.05) return null;
    if (Math.abs(PX[k] * R.x + PZ[k] * R.z - a0) > 1.2) continue; // (the hop drifts under them a little)
    if (meets(x, move, k, y)) return k;
  }
  return null;
}

// A bounce the victim's current flight will make (wall or ground) before they can get out, or null; sets x.bounceAt
// to its frame. Waiting is a link like any other: their air stun must outlast the flight to the bounce by MARGIN
// frames wherever they're high enough to tech (Fighter.techOpen reads last frame's height), and a floor skip on the
// way is a tech roll unless the last hit was a hard knockdown.
function bounceComing(x) {
  const o = x.o;
  if (o.state !== 'launched' || (!o.wb && !o.gb)) return null;
  const k = flight.firstBounce;
  if (k < 0 || k > 70) return null;
  const minY = DEFENSE.tech.minY;
  for (let i = 0; i < k; i++) {
    if (!PL[i]) return null;
    const y = Math.max(PY[i], i ? PY[i - 1] : o.pos.y);
    if (PS[i] < MARGIN && y > minY) return null;
    if (PB[i] === 3 && !o.hardKD) return null;
  }
  x.bounceAt = k;
  return PB[k] === 1 ? 'wall' : 'gb';
}

// The edges. `wall` / `ender` tags that depend on the moment come from x.extra (set by pre).
function buildEdges(def) {
  const E = [];
  const add = (e) => E.push({ cost: 0, tool: null, opt: 1, ...e });
  // ground string
  add({ id: 'l2', nodes: ['L1'], tags: ['ground', 'string'], w: 5, opt: 3, act: 'chain', pre: gapChain });
  add({ id: 'l3', nodes: ['L2'], tags: ['ground', 'string'], w: 5, opt: 3, act: 'chain', pre: gapChain });
  add({
    id: 'l4', nodes: ['G3', 'L1', 'L2'], tags: ['ground'], w: { G3: 1.4, L1: 0, L2: 0 }, opt: 1, act: 'chain',
    pre: (x) => {
      if (x.node !== 'G3') return null;
      const g = gapChain(x);
      if (g == null) return null;
      const wall = wallAhead(MOVES.light4.launch, x.combo + 1, x.o.pos.y, x.c.oppRoom, x.o.wbCount);
      x.extra = wall ? (x.handball ? ['wall', 'handball'] : ['wall']) : ['ender'];
      x.wk = wall ? 1.6 : 0.6;
      x.optk = wall ? 2.2 : 0.6;
      return g;
    },
  });
  add({
    id: 'launch', nodes: ['L1', 'L2', 'G3'], tags: ['launch', 'air'], w: { L1: 0.3, L2: 0.45, G3: 1.4 }, opt: 2, act: 'heavy',
    pre: (x) => (x.o.pos.y < 0.6 && Math.abs(x.c.sx) < 1.7 ? gapHeavyCancel(x) : null),
  });
  add({
    id: 'relaunch', nodes: ['L1', 'L2', 'G3'], tags: ['relaunch'], w: 2.5, opt: 2.6, act: 'heavy',
    pre: (x) => (x.o.state === 'launched' && x.o.pos.y >= 0.6 && x.o.pos.y < 1.7 && Math.abs(x.c.sx) < 1.6 ? gapHeavyCancel(x) : null),
  });
  // launcher follow-ups
  add({ id: 'chase', nodes: ['LAUNCH'], tags: ['air'], w: 3, opt: 3, act: 'jump', pre: (x) => (inAttack(x) ? CHASE : null) });
  // air string
  add({ id: 'a2', nodes: ['A1'], tags: ['air', 'string'], w: 5, opt: 3, act: 'chain', pre: gapChain });
  add({
    id: 'a3', nodes: ['A2'], tags: ['air'], w: 1, opt: 1, act: 'chain',
    pre: (x) => {
      const g = gapChain(x);
      if (g == null) return null;
      // the bounce only extends if we can reach them again from the air after it (the super dash, or a vanish)
      const follow = x.f.airDashes === 0 || x.f.ki >= VANISH.cost;
      const wall = follow && wallAhead(MOVES.airLight3.launch, x.combo + 1, x.o.pos.y, x.c.oppRoom, x.o.wbCount);
      x.extra = wall ? ['wall'] : ['ender'];
      x.wk = wall ? 1.6 : 0.5;
      x.optk = wall ? 1.8 : 0.5;
      return g;
    },
  });
  add({
    id: 'spike', nodes: ['A1', 'A2'], tags: ['air'], w: { A1: 0.4, A2: 1.4 }, opt: 2.4, act: 'heavy',
    pre: (x) => {
      const g = gapHeavyCancel(x);
      if (g == null) return null;
      const gbLeft = x.o.gbCount < J.ground.max;
      x.extra = gbLeft ? ['gb'] : ['ender'];
      x.wk = gbLeft ? 1 : 0.3;
      x.optk = gbLeft ? 1 : 0.3;
      return g;
    },
  });
  add({ id: 'airString', nodes: ['AFREE', 'WALLBACK', 'GBUP'], tags: ['air', 'string'], w: { AFREE: 4, WALLBACK: 1.2, GBUP: 1.2 }, opt: 3, act: 'airLight', pre: (x) => gapAirReach(x, 'airLight1') });
  add({
    id: 'airSpike', nodes: ['AFREE', 'WALLBACK', 'GBUP'], tags: ['air'], w: { AFREE: 0.7, WALLBACK: 0.4, GBUP: 0.4 }, opt: 1.5, act: 'airHeavy',
    pre: (x) => {
      const g = gapAirReach(x, 'airHeavy');
      if (g == null) return null;
      x.extra = x.o.gbCount < J.ground.max ? ['gb'] : ['ender'];
      if (x.z.blinked) { x.wk = 8; x.optk = 3; } // over their head after a Blink: the spike is the point
      return g;
    },
  });
  // super dash: after a launch or a wall-bouncing hit, in the air, or from the ground
  add({
    id: 'sd', nodes: ['G4', 'LAUNCH', 'FLY', 'UT', 'AFREE', 'AIRLOCK', 'WALLBACK', 'GBUP', 'RESTART'], tags: ['dash'], tool: 'superDash',
    w: { G4: 0.8, LAUNCH: 0.9, FLY: 1.2, UT: 0.5, AFREE: 0.6, AIRLOCK: 2, WALLBACK: 1, GBUP: 1.6, RESTART: 0.6 },
    opt: { G4: 1.5, LAUNCH: 2, FLY: 2.5, UT: 1.4, AFREE: 1, AIRLOCK: 3, WALLBACK: 2.8, GBUP: 3, RESTART: 1.5 }, act: 'sd', pre: gapSuperDash,
  });
  // vanish: behind them, then the kick (wall bounce); a second and third in one combo are the ping-pong
  add({
    id: 'vanish', nodes: ['G3', 'G4', 'LAUNCH', 'A1', 'A2', 'FLY', 'DT', 'UT', 'HOP', 'AFREE', 'AIRLOCK', 'WALLBACK', 'GBUP', 'RESTART'], tags: ['vanish'], tool: 'vanish', cost: VANISH.cost,
    w: { G3: 0.4, G4: 0.6, LAUNCH: 0.5, A1: 0.2, A2: 0.6, FLY: 1, DT: 0.3, UT: 0.4, HOP: 0.2, AFREE: 0.3, AIRLOCK: 1.2, WALLBACK: 0.8, GBUP: 0.6, RESTART: 0.3 }, opt: 1.6, act: 'vanish',
    pre: (x) => {
      const g = gapVanish(x);
      if (g != null && x.z.vanishes > 0) x.extra = ['vanishChain'];
      return g;
    },
  });
  // waiting for the bounce the victim is flying into (then WALLBACK / GBUP answers it)
  add({
    id: 'wait', nodes: ['G4', 'FLY', 'AIRLOCK'], tags: [], w: 2.6, opt: 3.2, act: 'wait',
    pre: (x) => {
      const kind = bounceComing(x);
      if (!kind) return null;
      x.extra = kind === 'wall' ? ['wall'] : ['gb'];
      return true;
    },
  });
  // meet the victim from the ground: a light (the handball, or a jab while they reel), a dash-in light, a heavy relaunch
  add({ id: 'handball', nodes: ['WALLBACK'], tags: ['ground', 'wall', 'handball'], w: 3, opt: 2, act: 'meet', meet: { move: 'light1' }, pre: (x) => gapMeet(x, 'light1') });
  add({ id: 'jab', nodes: ['GBUP', 'RESTART', 'HOP'], tags: ['ground'], w: { GBUP: 0.5, RESTART: 2, HOP: 1 }, opt: 2, act: 'meet', meet: { move: 'light1' }, pre: (x) => gapMeet(x, 'light1') });
  add({ id: 'dashJab', nodes: ['WALLBACK', 'RESTART'], tags: ['ground', 'dash'], w: { WALLBACK: 0.8, RESTART: 1 }, opt: 1.5, act: 'meet', meet: { move: 'light1', dash: true }, pre: (x) => gapMeet(x, 'light1', true) });
  add({ id: 'relaunchMeet', nodes: ['WALLBACK', 'GBUP', 'RESTART'], tags: ['relaunch'], w: { WALLBACK: 1.2, GBUP: 1.4, RESTART: 1.5 }, opt: 2.6, act: 'meet', meet: { move: 'heavy' }, pre: (x) => gapMeet(x, 'heavy') });
  // Smash links (ADR 0042): a tilt or a short-hop aerial connected; the next normal has to land inside the hit stun.
  // Down tilt (+11 on hit) into the jab string; up tilt into another up tilt or a short hop and the up air; a short-hop
  // neutral or forward air on a standing victim into the down tilt once we land
  add({ id: 'dtJab', nodes: ['DT'], tags: ['ground', 'link'], w: 4, opt: 2.5, act: 'meet', meet: { move: 'light1' }, pre: (x) => gapMeet(x, 'light1') });
  add({ id: 'utUt', nodes: ['UT', 'RESTART'], tags: ['ground', 'link', 'juggle'], w: { UT: 2.6, RESTART: 0.5 }, opt: 1.8, act: 'meet', meet: { move: 'uTilt' }, pre: (x) => gapMeet(x, 'uTilt') });
  add({ id: 'utHop', nodes: ['UT'], tags: ['air', 'link', 'juggle'], w: 2.4, opt: 2.2, act: 'hop', pre: (x) => gapHop(x, 'uair') });
  add({ id: 'hopDt', nodes: ['HOP', 'RESTART'], tags: ['ground', 'link'], w: { HOP: 4, RESTART: 0.4 }, opt: 2.4, act: 'meet', meet: { move: 'dTilt' }, pre: (x) => gapMeet(x, 'dTilt') });
  // the up air from the free air, under a victim above us (out of the up tilt's short hop: hopFor leans on it)
  add({
    id: 'uair', nodes: ['AFREE'], tags: ['air', 'link'], w: 0.5, opt: 1.2, act: 'airNormal', meet: { move: 'uair' },
    pre: (x) => {
      const g = gapAirReach(x, 'uair');
      if (g != null && x.z.hopFor === 'uair') { x.wk = 6; x.optk = 2.5; }
      return g;
    },
  });
  // stop here: the combo ends (the budget's ender of last resort)
  add({ id: 'end', nodes: NODES, tags: ['ender'], w: 0.15, opt: 0.05, act: 'end', pre: () => true });
  // the three-bar finish that carries the combo on (a highlight's crown): from a hit of ours, or free on the ground
  add({
    id: 'big', nodes: ['L1', 'L2', 'G3', 'G4', 'LAUNCH', 'FLY', 'DT', 'UT', 'RESTART', 'WALLBACK', 'GBUP'], tags: ['big'], w: 0.35, opt: 0, act: 'big',
    pre: (x) => {
      const ready = x.f.state === 'attack' ? inAttack(x) && !x.m.special : groundSide(x) && readyIn(x.f) === 0;
      return ready && (x.big = bigOption(x)) ? x.bigGap : null;
    },
  });
  // AIRLOCK: let ourselves fall and pick it up from the ground (RESTART)
  add({ id: 'fall', nodes: ['AIRLOCK', 'AFREE'], tags: ['relaunch'], w: { AIRLOCK: 0.5, AFREE: 0.4 }, opt: 0.4, act: 'none', pre: (x) => (x.o.state === 'launched' && x.left > readyIn(x.f) + 14 ? true : null) });
  // the kit: every special by its data, as a cancel on hit or from neutral, and the air specials from the free air
  const seen = new Set();
  for (const slot of GROUND_SLOTS) {
    const m = specialFor(def, slot);
    if (!m || seen.has(m)) continue;
    seen.add(m);
    const tags = ['kit'];
    if (bouncesOffWall(m)) tags.push('wall');
    if (m.kind === 'teleport') tags.push('teleport');
    if (m.kind === 'dive') tags.push('gb');
    if (m.kind === 'teleport' && m.to === 'above' && !m.follow) {
      add({ id: 'blink:' + slot, nodes: ['LAUNCH', 'G3', 'WALLBACK'], tags: ['kit', 'teleport'], w: { LAUNCH: 0.8, G3: 0.3, WALLBACK: 0.4 }, opt: 1, act: 'special', slot, m, cost: m.cost ?? 0, tool: specialId(m), blink: true, pre: (x) => gapAbove(x, m) });
      continue;
    }
    if (!['rush', 'shot', 'teleport', 'pull', 'dive'].includes(m.kind)) continue;
    const ender = m.kind === 'rush' || m.kind === 'dive' || (m.kind === 'shot' && !bouncesOffWall(m));
    if (ender) tags.push('ender');
    add({
      id: 'kit:' + slot, nodes: ['L1', 'L2', 'G3', 'G4', 'LAUNCH', 'DT', 'UT', 'WALLBACK', 'RESTART'], tags, slot, m, cost: m.cost ?? 0, tool: specialId(m), act: 'special',
      // (a down tilt cancels into a special on hit like any ground normal; an up tilt's victim is up in the air)
      w: { L1: 0.15, L2: 0.3, G3: 1, G4: 0.8, LAUNCH: m.kind === 'shot' || m.kind === 'teleport' ? 0.5 : 0, DT: 0.7, UT: m.kind === 'shot' || m.kind === 'teleport' ? 0.4 : 0, WALLBACK: 0.8, RESTART: 0.5 },
      opt: m.kind === 'rush' ? 2.6 : m.kind === 'pull' ? 2.2 : 1.6,
      pre: (x) => gapKit(x, m, false),
    });
  }
  for (const slot of AIR_SLOTS) {
    const m = specialFor(def, slot);
    if (!m || seen.has(m) || (m.kind !== 'shot' && m.kind !== 'dive')) continue;
    seen.add(m);
    const tags = ['kit'];
    if (bouncesOffWall(m)) tags.push('wall');
    if (m.kind === 'dive') tags.push('gb');
    add({
      id: 'airKit:' + slot, nodes: ['AFREE', 'WALLBACK', 'GBUP'], tags, slot, m, cost: m.cost ?? 0, tool: specialId(m), act: 'special',
      w: { AFREE: 0.7, WALLBACK: 0.5, GBUP: 0.7 }, opt: m.kind === 'dive' ? 2 : 1.2, pre: (x) => gapKit(x, m, true),
    });
  }
  return E;
}

// A three-bar move that grabs them out of the combo and carries it on (Fighter.takeHit: a held victim keeps the
// combo): a flurry in its reach, a Domain, Amaterasu, a Four-Tails pounce in their lane. 'super' / 'ultimate' or null,
// and x.bigGap: frames until it has them, which choose() checks against their stun like any link (its super flash
// holds the world, so only our press, its delay and its dash count). A dash that arrives after they tech whiffs.
const BIG_LEAD = 1; // pressed now, the super starts on our next live frame
const FLURRY_SPEED = 24; // kit.js flurry: the dash's speed (u/s)
function bigOption(x) {
  const f = x.f, c = x.c, K = kitOf(f.def);
  if (f.ki < 300 || x.b.waitClash || x.z.p.optimal) return null; // (IMPOSSIBLE keeps its own lethal check)
  const gapOf = (S) => {
    if (!S) return null;
    switch (S.kind) {
      case 'flurry': return c.dist < (S.range ?? 6) - 0.6 && x.o.pos.y < 1.2 ? bigChase(f, BIG_LEAD, BIG_LEAD, FLURRY_SPEED, S.dash, 1.4, 1) : null;
      case 'domain': return BIG_LEAD + 1; // the void holds them the frame it opens
      case 'ignite': return BIG_LEAD + S.delay;
      // the pounce commits to where they stand as the roar starts, then steers a little
      case 'rampage': return c.dist < (S.range ?? 8) - 0.6 && Math.abs(c.sd) < 1 && x.o.pos.y < 1.2 ? bigChase(f, BIG_LEAD, BIG_LEAD + S.roar, S.speed, S.dash, 1.35, S.steer ?? 0.03) : null;
    }
    return null;
  };
  const room = x.left - 1 - MARGIN - Math.max(0, f.hitstop - 3);
  for (const id of ['super', 'ultimate']) {
    const g = gapOf(SUPERS[id === 'super' ? K.super : K.ultimate]);
    if (g != null && g <= room) { x.bigGap = g; return id; }
  }
  return null;
}

// Frames until a three-bar dash (kit.js flurry, rampage) started `wait` frames from now catches the predicted victim:
// `speed` u/s along the floor, aimed at where they are `commit` frames from now and turning toward them by `steer` a
// frame; contact under `reach` (and 1.4 in height), for at most `len` frames; or null.
function bigChase(f, commit, wait, speed, len, reach, steer) {
  const c = Math.min(commit, PF - 1), step = speed / 60;
  let ax = f.pos.x, az = f.pos.z, hx = PX[c] - ax, hz = PZ[c] - az, h = Math.hypot(hx, hz) || 1;
  hx /= h; hz /= h;
  for (let k = wait; k < Math.min(flight.n, wait + len); k++) {
    const dx = PX[k] - ax, dz = PZ[k] - az, d = Math.hypot(dx, dz);
    if (d < reach && Math.abs(PY[k] - f.pos.y) < 1.4) return PL[k] ? k + 1 : null;
    if (d > 1e-4) {
      hx += (dx / d - hx) * steer; hz += (dz / d - hz) * steer;
      h = Math.hypot(hx, hz) || 1; hx /= h; hz /= h;
    }
    ax += hx * step; az += hz * step;
  }
  return null;
}

// a meet from the ground (or after landing): frames to its hit, via intercept()
function gapMeet(x, move, dash = false) {
  const f = x.f, o = x.o;
  if (f.state === 'superDash' || f.state === 'vanish' || f.state === 'kit') return null;
  if (o.state !== 'launched' && o.state !== 'hitstun') return null;
  const ready = readyIn(f);
  if (ready > 40) return null;
  if (dash && f.state !== 'idle' && f.state !== 'run' && f.state !== 'guard' && f.state !== 'attack') return null;
  const r = intercept(f, o, move, ready, x.c.R, dash);
  return r ? r.k : null;
}

// One step of lookahead: the stun window the victim will be in after this edge's hit lands (its own stun, or the
// bounce it sets up). Long combos lean on the edges that leave a long window (a launch, a bounce, a lock), since
// juggle stun shrinks fast with hitstun decay (JUGGLE).
function afterStun(e, x) {
  const o = x.o, c = x.combo + 1, air = o.state === 'launched';
  const tags = x.extra;
  const wall = (tags?.includes('wall') || e.tags.includes('wall')) && o.wbCount < J.wall.max ? stunAfter('wall', c, 0, o.wbCount) : 0;
  const gb = (tags?.includes('gb') || e.tags.includes('gb')) && o.gbCount < J.ground.max ? stunAfter('bounce', c, 0, o.gbCount) : 0;
  const of = (m) => (!m ? 0 : Math.max(m.lock ?? 0, m.launch ? stunAfter('launch', c) : air ? stunAfter('juggle', c) : stunAfter('ground', c, m.hitstun ?? 20)));
  let s = 0;
  switch (e.act) {
    case 'chain': s = of(MOVES[x.m?.next]); break;
    case 'heavy': s = of(x.m?.air ? MOVES.airHeavy : MOVES.heavy); break;
    case 'airHeavy': s = of(MOVES.airHeavy); break;
    case 'airLight': s = of(MOVES.airLight1); break;
    case 'jump': s = stunAfter('juggle', c); break;
    case 'sd': s = of(SUPER_DASH); break;
    case 'vanish': s = of(MOVES.vanishKick); break;
    case 'meet': case 'airNormal': s = of(MOVES[e.meet.move]); break;
    case 'hop': s = of(MOVES.uair); break;
    case 'wait': return x.bounceAt != null && PB[x.bounceAt] === 1 ? stunAfter('wall', c, 0, o.wbCount) : stunAfter('bounce', c, 0, o.gbCount);
    case 'big': return 40; // a held victim: the super's hits all land
    case 'special': {
      const m = e.m;
      if (!m) break;
      if (m.vortex || m.kind === 'pull') s = 30; // a grind: several locked hits, then the pop
      else if (m.kind === 'shot') s = of(PROJECTILES[m.proj]);
      else if (m.kind === 'teleport') s = m.follow ? of(MOVES[m.follow]) : stunAfter('launch', c);
      else if (m.kind === 'dive') s = of(m.hit);
      else s = of(m);
      break;
    }
    default: return 0;
  }
  return Math.max(s, wall, gb);
}

// The rest of the lookahead: after this edge, will we still have a way to reach them? A move that ends in a long
// recovery in the air (a vanish kick, a rush or teleport strike, the last hit of an air string) leaves only the super
// dash or another bar to follow its launch; a grind, a ground shot or a ground ender leaves time to walk up and meet.
function followable(e, x) {
  const f = x.f, ki = f.ki - (e.cost ?? 0), sd = f.airDashes === 0 && e.act !== 'sd';
  switch (e.act) {
    case 'vanish': return sd || ki >= VANISH.cost;
    case 'special': return !!(e.m?.kind === 'pull' || e.m?.vortex || (e.m?.kind === 'shot' && !e.m.air)) || sd || ki >= VANISH.cost;
    case 'chain': return !x.m?.air || x.m.next !== 'airLight3' || sd || ki >= VANISH.cost;
    default: return true;
  }
}

// Nothing fits right now but they're still stuck for a while (a vortex grinding them, a long launch, our recovery):
// press nothing (walk up to them on the ground) and decide again at the next hit, bounce, or once we're free.
const HOLD = { id: 'hold', act: 'hold', tags: [] };
const SD_LATE = new Set(['WALLBACK', 'GBUP', 'AIRLOCK', 'RESTART']); // where a long combo spends its super dash
const NOT_OURS = new Set(['hitstun', 'launched', 'burst', 'down', 'held']); // our states when their combo isn't one we run
const HOLD_NODES = new Set(['FLY', 'AIRLOCK', 'AFREE', 'GBUP', 'WALLBACK', 'RESTART', 'G4', 'LAUNCH', 'A1', 'A2', 'DT', 'UT', 'HOP']);

// ------------------------------------------------------------------ the composer
const ctx = { z: null, b: null, f: null, o: null, c: null, t: 0, m: null, left: 0, combo: 0, node: '', extra: null, wk: 1, optk: 1, handball: false, bounceAt: -1, big: null, bigGap: 0 };

export class ComboComposer {
  // brain: the MasterBrain it presses buttons for; persona from makePersona; rand: the brain's seeded rng
  constructor(brain, persona, rand) {
    this.b = brain;
    this.f = brain.f;
    this.p = persona;
    this.rand = rand;
    this.edges = buildEdges(this.f.def);
    this.uses = {}; // edge id -> times used this match
    this.stats = {}; // edge id -> { n, ok }: links that connected, so a link the art doesn't allow fades out
    this.history = []; // this brain's last routes (edge id lists)
    this.round = -1;
    this.highlights = 0; // highlight combos this round
    this.live = false;
    this.over = false;
    this.reset();
  }

  reset() {
    this.route = [];
    this.cur = null;
    this.waiting = false;
    this.bounce = null;
    this.expect = null;
    this.blinked = false;
    this.hopFor = null; // the aerial a short hop out of an up tilt went up for ('uair'): the free-air node leans on it
    this.vanishes = 0;
    this.moveSerial = 0;
    this.airSerial = 0;
    this.lastMove = null;
    this.lastT = 0;
    this.lastState = '';
    this.seenWb = this.f.opp?.wbCount ?? 0;
    this.seenGb = this.f.opp?.gbCount ?? 0;
    this.peak = 0;
  }

  get done() { return this.over; }

  // A link out of a tilt or a short-hop aerial is under way (chosen at DT / UT / HOP, not pressed yet, no hit since):
  // MasterBrain lets the composer finish it from the ground or the air instead of picking a fresh move (ADR 0042)
  linking() {
    const cur = this.cur;
    return !!(this.live && !this.over && cur && !cur.done && LINK_NODES.has(cur.node) && cur.combo === this.f.opp.combo);
  }

  // burst bait odds scale with the persona's appetite for risk (ADR 0022 burst bait; optimal keeps the style's)
  get baitK() { return this.p.optimal ? 1 : 0.5 + this.p.risk; }

  // the victim can still burst out (once per round, 2 bars)
  burstThreat() {
    const o = this.f.opp, B = DEFENSE.burst;
    return !o.ko && o.burstUsed < B.perRound && o.ki >= B.cost;
  }

  // The victim can still beat the bounce an edge sets up (or waits for) with a timed impact tech (ADR 0028): how often
  // it did this match (teched of the techable impacts it met, with a prior of about 1 in 6), 0 while a missed press
  // has it locked out.
  techRisk() {
    const o = this.f.opp;
    if (o.ko || o.noTech || o.impactTechLocked()) return 0;
    const s = o.techStats;
    return (s.teched + 0.5) / (s.faced + 3);
  }

  // Every frame (MasterBrain.update, also through a KO and the time-up): follow the combo's life, the bounces and
  // whether our last link connected.
  watch(game, c) {
    const f = this.f, o = f.opp;
    if (game.round !== this.round) {
      if (this.live) this.end(game, 'round'); // (a combo the last round's end left open counts for that round)
      this.round = game.round;
      this.highlights = 0;
    }
    const timeUp = game.state === 'timeup';
    const inCombo = o.combo > 0 && !o.ko && (o.state === 'hitstun' || o.state === 'launched' || (o.state === 'held' && !o.grab && this.live));
    if (this.live && (!inCombo || o.combo < this.peak || timeUp)) {
      if (o.ko) this.peak = Math.max(this.peak, o.combo); // the hit that KO'd them is part of it
      this.end(game, timeUp && !o.ko ? 'time' : inCombo ? 'restart' : this.endReason(o));
    }
    // (a trade is no combo of ours: we're reeling too; nor is a burst's shockwave, which ends in its own recovery)
    if (!this.live && inCombo && game.inputLive && o.combo <= 3 && !NOT_OURS.has(f.state)) this.begin(game, c);
    if (!this.live) { this.lastState = f.state; return; }
    this.peak = Math.max(this.peak, o.combo);
    // move and airtime serials: a new move of ours is a new decision point
    if (f.state === 'attack' && (f.move !== this.lastMove || f.t < this.lastT)) this.moveSerial++;
    if (f.state === 'air' && this.lastState !== 'air') this.airSerial++;
    if (f.state === 'throw' && this.lastState !== 'throw') this.throwSerial = (this.throwSerial ?? 0) + 1;
    this.lastMove = f.state === 'attack' ? f.move : null;
    this.lastT = f.t;
    this.lastState = f.state;
    // a bounce: answered by the WALLBACK / GBUP node when nothing of ours is already flying at them
    if (o.wbCount !== this.seenWb || o.gbCount !== this.seenGb) {
      const kind = o.wbCount > this.seenWb ? 'wall' : o.gbCount > this.seenGb ? 'ground' : null;
      this.seenWb = o.wbCount;
      this.seenGb = o.gbCount;
      const busy = f.state === 'superDash' || f.state === 'vanish' || f.state === 'kit' || (f.state === 'attack' && !f.moveHit && f.t < (f.move?.startup ?? 0) + 2);
      if (kind && !this.over && !busy) {
        this.bounce = { kind, n: kind === 'wall' ? o.wbCount : o.gbCount, combo: o.combo, serial: (this.bounce?.serial ?? 0) + 1 };
        this.waiting = false;
      }
    }
    if (this.bounce && o.combo > this.bounce.combo) this.bounce = null;
    if (this.waiting && (o.state !== 'launched' || this.b.clock > this.waitUntil)) { this.waiting = false; this.stop('wait'); }
    // did the link we pressed connect?
    const X = this.expect;
    if (X) {
      if (o.combo > X.combo) {
        this.note(X.id, true, this.b.clock - X.at, X.gap);
        this.expect = null;
      } else if (this.b.clock - X.at > X.gap + 12) {
        this.note(X.id, false, null, X.gap);
        this.expect = null;
      }
    }
  }

  endReason(o) {
    if (o.ko) return 'ko';
    if (o.state === 'burst') return 'burst';
    // a timed impact tech (ADR 0028) beat the bounce or the landing: the route just ends there
    if (o.clock - o.techedAt <= 2) return o.techKind === 'inPlace' || o.techKind === 'roll' ? 'groundTech' : 'wallTech';
    if (this.over) return 'end'; // we ended it (an 'end' edge, burst bait, a dropped link: the route says which)
    switch (o.state) {
      case 'airRecover': return 'tech';
      case 'techRoll': return 'techRoll';
      case 'down': case 'getup': return 'down';
      default: return this.expect ? 'whiff:' + this.expect.id : 'drop';
    }
  }

  // A link we pressed connected (after `gap` frames, `pred` predicted) or didn't. Its success rate weights the edge
  // from now on, and how late it lands on average (hit boxes come from the art: a move can connect a few active
  // frames after its startup) is added to its future predictions (`late`).
  note(id, ok, gap, pred) {
    const s = this.stats[id] || (this.stats[id] = { n: 0, ok: 0, late: 0 });
    s.n++;
    if (ok) {
      s.ok++;
      if (gap != null && pred != null) s.late += (Math.max(0, gap - 1 - pred) - s.late) * 0.3; // seen a frame after the hit
    }
    const L = this.f.game.debugCombos && window.comboLinks;
    if (L) {
      const f = this.f, o = f.opp, R = f.game.basis.right;
      L.push({ who: f.def.id, id, ok, gap, pred, ...(ok ? null : { at: `${f.state}/${f.moveName} vs ${o.state} dx${((o.pos.x - f.pos.x) * R.x + (o.pos.z - f.pos.z) * R.z).toFixed(2)} dy${(o.pos.y - f.pos.y).toFixed(2)}` }) });
    }
  }

  // The first confirmed hit: draw this combo's length tier and target (the governor keeps highlights about once a
  // round per CPU and the share of fight time spent in combos near ADR 0016's 40 %).
  begin(game, c) {
    this.reset();
    this.b.route = {}; // MasterBrain's per-combo choices (drop roll, burst bait, the three-bar ender) start fresh too
    this.live = true;
    this.over = false;
    this.peak = this.f.opp.combo;
    this.startAt = this.b.clock;
    this.opener = this.f.state === 'attack' ? this.f.moveName : this.f.state; // what landed the first hit (?debug)
    const P = this.p;
    if (P.optimal) { this.tier = 'max'; this.target = 99; return; }
    const w = { short: P.tiers[0], medium: P.tiers[1], highlight: P.tiers[2] };
    const elapsed = ROUND_TIME - game.timeLeft;
    if (!this.highlights && elapsed > 20) w.highlight *= 2.5;
    if (this.highlights) w.highlight *= 0.4;
    const share = game.comboShare?.() ?? 0.4;
    if (share > 0.5) { w.highlight *= 0.3; w.medium *= 0.6; } else if (share < 0.3) w.highlight *= 1.5;
    if (this.burstThreat()) w.highlight *= P.risk >= 0.7 ? 1 : 0.5;
    // a long route runs on bars (vanish chains, grinds): go for one when the meter is there for it
    w.highlight *= this.f.ki >= 200 ? 1.6 : this.f.ki >= 100 ? 1 : 0.5;
    this.tier = pickW(w, this.rand) || 'short';
    const [lo, hi] = TIERS[this.tier];
    this.target = lo + Math.floor(this.rand() * (hi - lo + 1));
  }

  end(game, reason) {
    const o = this.f.opp;
    const rec = {
      who: this.f.index, fighter: this.f.def.id, persona: this.p.name, tier: this.tier, target: this.target,
      edges: this.route.slice(), sig: this.route.join('>'), hits: this.peak, dmg: o.comboDmg, reason,
      vanishes: this.vanishes, frames: this.b.clock - this.startAt, match: game.matchNo ?? 0, opener: this.opener,
    };
    if (rec.hits >= TIERS.highlight[0]) this.highlights++;
    this.history.unshift(rec.edges);
    if (this.history.length > 6) this.history.pop();
    if (game.comboLog) {
      game.comboLog.unshift(rec);
      if (game.comboLog.length > 12) game.comboLog.pop();
    }
    if (game.debugCombos && window.comboLog) { rec.steps = this.steps ?? []; window.comboLog.push(rec); }
    this.steps = null;
    this.live = false;
    this.over = false;
    this.reset();
  }

  // stop extending (an 'end' edge, a missed link, burst bait): MasterBrain plays on from neutral
  stop(why) {
    if (!this.live || this.over) return;
    this.over = true;
    this.route.push('·' + why);
    this.cur = null;
  }

  // The ki the composer may spend mid-combo: a highlight spends freely (but keeps three bars while the showman waits
  // for a clash); otherwise the brain's usual policy (`saving`), times the persona's appetite.
  kiOk(cost, value = 100) {
    const f = this.f, b = this.b;
    if (cost <= 0) return true;
    if (f.ki < cost) return false;
    if (this.tier === 'highlight') return f.ki - cost >= (b.waitClash ? 300 : 0);
    if (this.p.optimal) return b.spend(cost, value);
    return b.spend(cost, value) && this.rand() < 0.45 + 0.55 * this.p.ki;
  }

  // ---------------------------------------------------------------- deciding and running
  // site: 'move' (comboStep: our move connected), 'air' (airStep: free or air-locked in the air), 'ground'
  // (followUp: free on the ground while they reel). Returns true when it took care of this frame.
  drive(site, c) {
    const f = this.f, o = f.opp;
    if (!this.live || this.over || o.ko) return false;
    if (this.waiting && !this.bounce) return true; // let them fly into the barrier / floor
    let node, key;
    if (this.bounce) { node = this.bounce.kind === 'wall' ? 'WALLBACK' : 'GBUP'; key = 'b' + this.bounce.serial; }
    else if (f.state === 'throw') { node = 'FLY'; key = 't' + this.throwSerial; } // the toss: super dash, vanish, its wall bounce
    else if (site === 'move') {
      // a Smash aerial (not the juggle float) on a standing victim: HOP, its links come after we land (ADR 0042)
      node = f.air && f.move?.air && !f.juggleMove && o.state === 'hitstun' ? 'HOP' : NODE_OF_MOVE[f.moveName] ?? 'FLY';
      key = 'm' + this.moveSerial;
    } else if (this.linking()) { node = this.cur.node; key = this.cur.key; } // our tilt or aerial is over: its link goes on
    else if (site === 'air') { node = f.airAttack ? 'AIRLOCK' : 'AFREE'; key = 'a' + this.airSerial + node; }
    else { node = 'RESTART'; key = 'g' + o.combo + ':' + (o.state === 'launched' ? 'L' : 'H'); }
    const x = this.ctx(node, c);
    // a hold is looked at again every few frames and after every hit (something may fit now)
    const stale = this.cur?.edge === HOLD && (o.combo !== this.cur.combo || this.b.clock - this.cur.at >= 6);
    if (!this.cur || this.cur.key !== key || stale) {
      this.cur = { key, node, edge: this.choose(x), st: {}, done: false, combo: o.combo, at: this.b.clock };
      if (!this.cur.edge) { this.stop('none@' + node); return false; }
    }
    const cur = this.cur;
    if (cur.done) return true;
    const r = this.exec(x, cur);
    if (r === DONE) cur.done = true; // (an 'end' edge has already let go of it)
    else if (r === FAIL) { this.stop('fail:' + cur.edge.id); return false; }
    return true;
  }

  ctx(node, c) {
    const f = this.f, o = f.opp, x = ctx;
    x.z = this; x.b = this.b; x.f = f; x.o = o; x.c = c; x.node = node;
    x.t = f.t + 1;
    x.m = f.state === 'attack' ? f.move : null;
    x.combo = o.combo;
    x.left = (o.state === 'launched' ? o.airStun : o.state === 'hitstun' ? o.stun - o.t : 0) + o.hitstop;
    x.handball = o.wbCount > 0;
    predictFlight(o);
    return x;
  }

  // Filter the node's edges by their link check and ki, weight the rest, draw one.
  choose(x) {
    const P = this.p, node = x.node, opts = [], w = {};
    const remaining = this.target - x.combo;
    const sh = this.b.show;
    const risk = this.techRisk();
    for (const e of this.edges) {
      if (!e.nodes.includes(node)) continue;
      const base = typeof e.w === 'object' ? e.w[node] ?? 0 : e.w;
      if (!(base > 0)) continue;
      x.extra = null; x.wk = 1; x.optk = 1;
      const raw = e.pre(x);
      if (raw == null) continue;
      let margin = 99, gap = raw;
      if (raw !== true) {
        gap = raw + Math.round(this.stats[e.id]?.late ?? 0) + Math.max(0, this.f.hitstop - 3); // (exec waits out our hitstop)
        margin = x.left - 1 - gap;
        if (margin < MARGIN) continue;
      }
      if (e.cost && !this.kiOk(e.cost, e.cost >= 100 ? 110 : 80)) continue;
      const tags = x.extra ? e.tags.concat(x.extra) : e.tags;
      const ender = tags.includes('ender');
      const s = this.stats[e.id], rel = s ? Math.max(0.2, (s.ok + 2) / (s.n + 2)) : 1;
      let k = base * x.wk * rel;
      const after = afterStun(e, x);
      const dead = remaining >= 4 && !followable(e, x); // it would end the combo early: an ender in effect
      // a route through a bounce (setting one up, or waiting for it) gives the victim a timed tech at the impact
      // (ADR 0028); waiting for it, with nothing of ours on the way, the most
      const bounce = e.act === 'wait' || (e.id !== 'handball' && (tags.includes('wall') || tags.includes('gb')));
      const techK = bounce ? 1 - risk * (e.act === 'wait' ? 0.9 : 0.6) : 1;
      if (P.optimal) {
        // the most damage that links: its priority, safer links first, and a window to keep going afterwards
        const opt = (typeof e.opt === 'object' ? e.opt[node] ?? 1 : e.opt) * x.optk * rel * (margin < MARGIN + 2 ? 0.6 : 1) * (0.6 + after / 25) * (dead ? 0.5 : 1) * techK;
        opts.push({ e, tags, gap, raw, k: opt * (0.9 + 0.2 * this.rand()) });
        continue;
      }
      for (const t of tags) k *= P.tags[t] ?? 1;
      k /= 1 + 0.4 * (this.uses[e.id] ?? 0);
      if (this.route.includes(e.id) && !tags.includes('string') && !tags.includes('handball')) k *= 0.3;
      if (this.cooled(e.id)) k *= 0.25;
      if (remaining >= 4 && (ender || dead)) k *= dead && !ender ? 0.35 : 0.2;
      if (remaining <= 0 && !ender) k *= 0.1;
      if (margin < MARGIN + 2) k *= P.risk;
      if (bounce) k *= Math.max(0.15, 1 - risk * (e.act === 'wait' ? 1.5 : 1.1) * (1.2 - P.risk)); // risk lovers bounce anyway
      // a long combo leans on what leaves a long stun window after it (a launch, a bounce, a grind)
      if (this.tier === 'highlight') {
        k *= Math.pow(0.5 + after / 20, 1.3) * (e.cost ? 1.5 : 1); // and spends its bars on it
        // the super dash is once per airtime: keep it for after a bounce (chase the launcher, wait for the wall)
        if (e.id === 'sd' && !SD_LATE.has(node)) k *= 0.5;
      }
      else if (this.tier === 'medium') k *= 0.75 + after / 40;
      if (e.tool) k *= Math.sqrt(sh.bias(e.tool));
      if (this.burstThreat() && this.tier !== 'highlight' && ender) k *= 1.3; // cash out before they burst
      if (k > 0) { w[opts.length] = k; opts.push({ e, tags, gap, raw, k }); }
    }
    if (!opts.length) return null;
    if (x.left >= 10 && HOLD_NODES.has(node) && !opts.some((o) => o.e.id !== 'end')) {
      if (this.f.game.debugCombos && this.cur?.edge !== HOLD) (this.steps || (this.steps = [])).push(`${node}@${x.combo} ${this.f.state} vs ${x.o.state} left${x.left} → hold`);
      return HOLD;
    }
    let pick;
    if (P.optimal) pick = opts.reduce((a, b) => (b.k > a.k ? b : a));
    else pick = opts[pickW(w, this.rand)] ?? opts[0];
    const e = pick.e;
    this.uses[e.id] = (this.uses[e.id] ?? 0) + 1;
    this.route.push(e.id);
    this.lastGap = pick.raw; // the expectation without the learned lateness, which note() re-measures
    if (this.f.game.debugCombos) {
      // ?debug: why this edge, out of which (comboLog[i].steps)
      (this.steps || (this.steps = [])).push(`${node}@${x.combo} ${this.f.state}/${this.f.moveName ?? ''} vs ${x.o.state} left${x.left} y${x.o.pos.y.toFixed(1)} room${x.c.oppRoom.toFixed(1)} ki${Math.round(this.f.ki)}${this.f.airDashes ? ' sd-used' : ''} → ${e.id} gap${pick.gap === true ? '-' : Math.round(pick.gap)} [${opts.map((o) => o.e.id + ':' + (o.k ?? 0).toFixed(2)).join(',')}]`);
    }
    return e;
  }

  // a route that reproduces a 3+ edge opening of one of our last routes or the other CPU's
  cooled(id) {
    const r = this.route, n = r.length + 1;
    if (n < 3) return false;
    const same = (h) => h.length >= n && h[n - 1] === id && r.every((v, i) => h[i] === v);
    if (this.history.slice(0, 4).some(same)) return true;
    const log = this.f.game.comboLog;
    return !!log?.some((rec, i) => i < 4 && rec.who !== this.f.index && same(rec.edges));
  }

  // Run the chosen edge for this frame: RUN (keep going), DONE (pressed), FAIL (it can't happen any more).
  exec(x, cur) {
    const e = cur.edge, b = this.b, f = this.f, st = cur.st;
    // a press made early in our hitstop has left the input buffer (5 frames for an air normal) before we can act
    if (f.hitstop > 3) return RUN;
    const pressed = (gap) => {
      if (gap !== true && gap != null) this.expect = { id: e.id, gap, at: b.clock, combo: x.combo };
      return DONE;
    };
    switch (e.act) {
      case 'chain':
        if (!inAttack(x)) return FAIL;
        if (x.t < x.m.cancel - 1) return RUN;
        if (b.hold.light > 0) return RUN;
        b.tap('light');
        return pressed(this.lastGap);
      case 'heavy':
        if (!inAttack(x) || b.hold.heavy > 0) return inAttack(x) ? RUN : FAIL;
        b.tap('heavy');
        return pressed(this.lastGap);
      case 'jump':
        if (!inAttack(x)) return FAIL;
        b.tap('jump');
        return DONE; // the air hit comes from the AFREE node
      case 'sd': {
        if (f.airDashes > 0) return FAIL;
        const toss = tossK(f);
        if (toss >= 0) {
          if (toss < TOSS_OPEN) return RUN;
        } else if (f.state === 'attack' && f.move) {
          if (x.t < f.move.startup + f.move.active) return RUN;
        } else if (f.state !== 'air' && readyIn(f) > 0) return RUN;
        if (b.hold.dash > 0) return RUN;
        b.mx = 0; b.my = 0;
        b.tap('dash');
        return pressed(this.lastGap);
      }
      case 'vanish': {
        if (f.ki < VANISH.cost) return FAIL;
        const can = inAttack(x) || tossK(f) >= TOSS_OPEN || ['idle', 'run', 'guard', 'air'].includes(f.state) || (f.state === 'land' && readyIn(f) === 0);
        if (!can) return (st.waited = (st.waited ?? 0) + 1) > 20 ? FAIL : RUN;
        // Guard has to go down on the frame of Special's press edge: Guard alone first is an air dodge in the air
        if (b.hold.special > 0 || f.pad.b.special.down) return RUN;
        b.keep.add('guard');
        b.tap('special', 2);
        this.vanishes++;
        return pressed(this.lastGap);
      }
      case 'special': {
        if (b.hold.special > 0) return RUN;
        if (!st.ok) {
          // from neutral the special comes out on the release, so wait until we can act at all
          const air = e.slot === 'air' || e.slot === 'airDown';
          const can = air ? airFree(x) : inAttack(x) || readyIn(f) === 0;
          if (!can) return (st.waited = (st.waited ?? 0) + 1) > 25 ? FAIL : RUN;
          st.ok = true;
          b.special(e.slot, 2);
          if (e.blink) this.blinked = true;
          return pressed(e.blink ? null : this.lastGap); // a Blink's hit comes from the spike (AFREE)
        }
        return DONE;
      }
      case 'airLight':
      case 'airHeavy':
      case 'airNormal': {
        if (!airFree(x)) return f.state === 'attack' ? DONE : FAIL;
        const c = x.c, mv = e.meet?.move ?? (e.act === 'airHeavy' ? 'airHeavy' : 'airLight1');
        if (airInReach(c, mv)) {
          if (!b.normal(mv)) return RUN; // (the stick picks it: neutral for the air string, ↑ for the up air)
          this.blinked = false;
          this.hopFor = null;
          return pressed(MOVES[mv].startup + 1);
        }
        b.mx = Math.abs(c.sx) > 0.5 ? c.toward : 0;
        b.my = Math.abs(c.sd) > 0.2 ? Math.sign(c.sd) : 0;
        if (x.left < MOVES[mv].startup + 1 + MARGIN || !airborneFor(f, 1, MOVES[mv].startup)) return FAIL;
        return RUN;
      }
      case 'meet': {
        const M = e.meet, mv = MOVES[M.move];
        const ready = readyIn(f);
        if (f.state === 'attack' && f.moveName === M.move && f.t < 3) return DONE; // it came out
        const r = intercept(f, x.o, M.move, ready, x.c.R, M.dash);
        if (!r) return FAIL;
        if (ready > 0) {
          if (f.air && r.walk > 0.05) b.mx = r.dir; // a short-hop aerial's fall drifts in toward its link (HOP)
          return RUN;
        }
        const c = x.c;
        b.my = Math.abs(c.sd) > 0.18 ? Math.sign(c.sd) : 0;
        if (M.dash && !st.dashed && f.state !== 'dash') {
          // the dash first (a light out of it lunges), then the light once it's in reach
          if (r.press <= 0 || r.walk > 0.4) { st.dashed = true; b.mx = r.dir; b.tap('dash', 2); }
          return RUN;
        }
        // the stick picks the normal (ADR 0042): held on it from the press until the fighter reads it (MasterBrain.normal)
        if (r.press <= 0 && b.normal(M.move)) return pressed(r.k);
        b.mx = r.walk > 0.05 ? r.dir : 0;
        return RUN;
      }
      case 'hop': {
        // out of the up tilt: a short hop under them (stick toward them through the squat if they drifted off), then the
        // up air comes from the free air node (AFREE, which leans on hopFor)
        if (f.state === 'jumpSquat' || f.air) return DONE;
        if (readyIn(f) > 0) return RUN;
        if (b.hold.jump > 0) return RUN;
        b.jumpTo(Math.abs(x.c.sx) > 0.5 ? x.c.toward : 0, 0, SHORT_HOP);
        this.hopFor = 'uair';
        return DONE;
      }
      case 'wait':
        this.waiting = true;
        this.waitUntil = b.clock + (x.bounceAt ?? 40) + 12;
        return DONE;
      case 'end':
        this.stop('end');
        return DONE;
      case 'none':
        return DONE;
      case 'hold':
        if (groundSide(x) && Math.abs(x.c.sx) > 1.4) b.mx = x.c.toward;
        return RUN;
      case 'big': {
        // the super flash freezes the world and its own hits run the rest: the composer's part is over
        const id = st.big ?? (st.big = x.big);
        if (!id || f.ki < 300) return FAIL;
        if (b.hold.super > 0 || b.hold.heavy > 0) return RUN;
        b.fireBig(id);
        this.over = true;
        return DONE;
      }
    }
    return FAIL;
  }

  // MasterBrain fired a three-bar finisher mid-combo (its own lethal / showman check): it's in the route, and the
  // super runs the rest
  mark(id) {
    if (!this.live) return;
    this.route.push(id);
    this.over = true;
    this.cur = null;
  }
}
