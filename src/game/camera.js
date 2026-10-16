import * as THREE from 'three';
import { RING_TOP } from './constants.js';
import { damp } from './basis.js';

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function dampV(cur, target, vel, smooth, dt) {
  cur.x = damp(cur.x, target.x, vel, 'x', smooth, dt);
  cur.y = damp(cur.y, target.y, vel, 'y', smooth, dt);
  cur.z = damp(cur.z, target.z, vel, 'z', smooth, dt);
}

// Results hero shot (mode 'results'): angle off the fight yaw, sway (rad) and its speed (rad/s), distance and
// height above the look point (world units), look point above the ring, fov. Distance and fov keep the tallest
// win pose (about 1.8 u) at roughly two thirds of the screen height with room above the head and below the feet.
const RESULTS_SHOT = { yaw: -0.55, sway: 0.22, swaySpeed: 0.16, dist: 5.2, up: 0.8, lookY: 0.92, fov: 28 };

// Intro flythrough keyframes: [time, position, lookAt]
const INTRO = [
  [0.0, [0, 2.4, 47], [0, 3.6, 31]],
  [1.6, [0, 2.9, 38], [0, 3.3, 30]],
  [2.6, [0, 3.4, 30.5], [0, 2.6, 20]],
  [3.7, [-5, 5.5, 20], [-15, 2.2, 3]],
  [4.9, [5, 7.0, 15], [14, 2, -2]],
  [6.2, [0, 5.2, 13.5], [0, 1.4, 0]],
];
// the flythrough's length: the match flow (simulation) ends the intro on it, so it must be data, not the camera's
// state (a quiet re-simulation stands the camera in, ADR 0036)
export const INTRO_DUR = INTRO[INTRO.length - 1][0];

export class CameraDirector {
  constructor(camera) {
    this.cam = camera;
    this.mode = 'orbit';
    this.time = 0;
    this.modeT = 0;
    this.trauma = 0;
    this.kick = new THREE.Vector3();
    this.kickVel = new THREE.Vector3();
    this.yaw = 0; // the fight's yaw: the simulation's control basis (basis.js) once a match runs
    this.fov = 30;
    this.pos = new THREE.Vector3(0, 14, 30);
    this.look = new THREE.Vector3(0, 1, 0);
    this.posVel = { x: 0, y: 0, z: 0 };
    this.lookVel = { x: 0, y: 0, z: 0 };
    this.right = new THREE.Vector3(1, 0, 0);
    this.fwd = new THREE.Vector3(0, 0, -1);
    this.introPos = new THREE.CatmullRomCurve3(INTRO.map((k) => new THREE.Vector3(...k[1])), false, 'centripetal');
    this.introLook = new THREE.CatmullRomCurve3(INTRO.map((k) => new THREE.Vector3(...k[2])), false, 'centripetal');
    this.introDur = INTRO_DUR;
    this.punch = 0;
    this.snapNext = false;
    this.spriteRefDepth = null; // view depth fighter sprites are normalized to (fight / clash only; ENG-067)
  }

  set(mode, data = null) {
    this.mode = mode;
    this.modeT = 0;
    this.data = data;
    this.lean = null;
    // the results shot cuts to a fixed angle off the fight's yaw, well clear of where the victory orbit
    // ends (about yaw + 0.1), so the cut reads as a cut and not as a jump
    if (mode === 'results') this.resYaw = this.yaw + RESULTS_SHOT.yaw;
  }

  snap() {
    this.snapNext = true;
  }

  shake(a, dir = null) {
    this.trauma = Math.min(1, this.trauma + a);
    if (dir) {
      // directional kick along the hit
      this.kickVel.x += dir.x * a * 6;
      this.kickVel.z += dir.y * a * 6;
      this.kickVel.y -= a * 2;
    }
  }

  zoomPunch(a) {
    this.punch = Math.max(this.punch, a);
  }

  // MELEE CLASH (ADR 0038): the fight framing eases in toward a point (the meeting strikes, ring-relative) by `amt`
  // (0-1), holds `hold` seconds, then eases back out
  pushIn(x, y, z, amt, hold) {
    this.lean = { p: new THREE.Vector3(x, RING_TOP + y, z), amt, hold, t: 0 };
  }

  update(dt, game) {
    this.time += dt;
    this.modeT += dt;
    const cam = this.cam;
    const tgtPos = new THREE.Vector3(), tgtLook = new THREE.Vector3();
    let fov = 30, smoothP = 0.35, smoothL = 0.22;
    const f = game.fighters;
    const rp = (ft) => ft.renderPos || ft.pos;
    // the fight's yaw is the simulation's control basis (basis.js), drawn between its fixed steps: the framing turns
    // with the axes the controls use, and every machine agrees on those (ADR 0036)
    if (game.basis && f[0] && f[1]) this.yaw = game.basis.viewYaw(game.freeze > 0 ? 1 : game.alpha ?? 1);

    switch (this.mode) {
      case 'orbit': {
        const a = this.time * 0.06 + 0.4;
        tgtPos.set(Math.sin(a) * 30, 13 + Math.sin(this.time * 0.2) * 2, Math.cos(a) * 30);
        tgtLook.set(0, 1.5, 0);
        fov = 34;
        smoothP = 0.6;
        break;
      }
      case 'intro': {
        const u = Math.min(1, this.modeT / this.introDur);
        const k = ease(u);
        this.introPos.getPoint(k, tgtPos);
        this.introLook.getPoint(k, tgtLook);
        fov = 34 - k * 4;
        smoothP = smoothL = 0.05;
        if (u >= 1) this.set('fight');
        break;
      }
      case 'fight': {
        if (!f[0] || !f[1]) break;
        const a = rp(f[0]), b = rp(f[1]);
        const dx = b.x - a.x, dz = b.z - a.z;
        const sep = Math.hypot(dx, dz);
        const avgH = (a.y + b.y) / 2, maxH = Math.max(a.y, b.y), hd = Math.abs(a.y - b.y);
        // frame for the visible width (the training panel can cover part of the screen)
        const visAspect = (cam.aspect || 1.7) * (1 - (game.viewCover || 0));
        const aspectK = Math.max(1, 1.7 / visAspect);
        let dist = THREE.MathUtils.clamp(9.6 + sep * 0.78 + hd * 0.7, 11, 21) * aspectK;
        const pitch = 0.44 - Math.min(0.12, avgH * 0.035);
        const mid = new THREE.Vector3((a.x + b.x) / 2, RING_TOP + 0.85 + avgH * 0.55 + Math.max(0, maxH - 2.5) * 0.25, (a.z + b.z) / 2);
        const L = this.lean;
        if (L) {
          const IN = 0.14, OUT = 0.6, T = (L.t += dt);
          const k = L.amt * (T < IN ? ease(T / IN) : T < IN + L.hold ? 1 : 1 - ease(Math.min(1, (T - IN - L.hold) / OUT)));
          if (T >= IN + L.hold + OUT) this.lean = null;
          dist *= 1 - 0.55 * k;
          mid.lerp(L.p, 0.7 * k);
        }
        tgtLook.copy(mid);
        tgtPos.set(
          mid.x + Math.sin(this.yaw) * Math.cos(pitch) * dist,
          mid.y + Math.sin(pitch) * dist,
          mid.z + Math.cos(this.yaw) * Math.cos(pitch) * dist,
        );
        smoothP = this.lean ? 0.16 : 0.32; // a push-in has to arrive within its slow-mo
        smoothL = this.lean ? 0.1 : 0.16;
        break;
      }
      case 'focus': {
        const ft = this.data;
        const p = rp(ft);
        // aim from the opponent's position, never from ft.face: face follows cam.right
        // while charging, so building the shot from it would make the camera chase itself
        let fx = ft.face.x, fz = ft.face.y;
        if (ft.opp) {
          const o = rp(ft.opp), dx = o.x - p.x, dz = o.z - p.z, l = Math.hypot(dx, dz);
          if (l > 0.01) { fx = dx / l; fz = dz / l; }
        }
        const side = new THREE.Vector3(-fz, 0, fx);
        const toCam = new THREE.Vector3(Math.sin(this.yaw), 0, Math.cos(this.yaw));
        if (side.dot(toCam) < 0) side.negate();
        const center = new THREE.Vector3(p.x, RING_TOP + p.y + 0.8, p.z);
        const swing = Math.min(1, this.modeT / 0.8);
        tgtPos.copy(center).addScaledVector(side, 8.2 - swing * 1.6).add(new THREE.Vector3(-fx * (2.2 - swing), 1.6 + swing * 0.3, -fz * (2.2 - swing)));
        tgtLook.copy(center).addScaledVector(new THREE.Vector3(fx, 0, fz), 1.1);
        fov = 30;
        smoothP = 0.18;
        smoothL = 0.12;
        break;
      }
      case 'clash': {
        const c = this.data;
        const p = c.point;
        const axis = new THREE.Vector3().subVectors(c.b.origin, c.a.origin).setY(0).normalize();
        const side = new THREE.Vector3(-axis.z, 0, axis.x);
        const toCam = new THREE.Vector3().subVectors(this.pos, new THREE.Vector3(p.x, p.y, p.z)).setY(0);
        if (side.dot(toCam) < 0) side.negate();
        const span = c.a.origin.distanceTo(c.b.origin);
        const orbit = Math.sin(this.modeT * 0.5) * 0.25;
        const s2 = side.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), orbit);
        tgtPos.set(p.x, RING_TOP + p.y, p.z).addScaledVector(s2, 6 + span * 0.85).add(new THREE.Vector3(0, 2.2, 0));
        // frame both bodies, under the struggle point, so the fighters sit in the upper middle and the rhythm ring and bar
        // (HUD, bottom) stay below their feet; a fighter hovering in the air widens the shot (ADR 0034)
        const fa = c.a.f.pos, fb = c.b.f.pos, lo = Math.min(fa.y, fb.y), hi = Math.max(fa.y, fb.y) + 1.7;
        tgtLook.set(p.x, RING_TOP + (lo + hi) / 2 - 0.55, p.z);
        tgtPos.addScaledVector(s2, (hi - lo - 1.7) * 1.4).y += (hi - lo - 1.7) * 0.5;
        fov = 33;
        smoothP = 0.5;
        this.shake(dt * 0.6);
        break;
      }
      case 'ko': {
        const v = this.data;
        const p = rp(v);
        const center = new THREE.Vector3(p.x, RING_TOP + p.y + 0.6, p.z);
        const a = this.yaw + this.modeT * 0.3;
        tgtPos.copy(center).add(new THREE.Vector3(Math.sin(a) * 7.5, 3.4, Math.cos(a) * 7.5));
        tgtLook.copy(center);
        fov = 30;
        smoothP = 0.45;
        smoothL = 0.15;
        break;
      }
      case 'victory': {
        const w = this.data;
        const p = rp(w);
        const center = new THREE.Vector3(p.x, RING_TOP + 0.95, p.z);
        const a = this.yaw + 0.5 - this.modeT * 0.12;
        tgtPos.copy(center).add(new THREE.Vector3(Math.sin(a) * 5, 1.1, Math.cos(a) * 5));
        tgtLook.copy(center);
        fov = 28;
        smoothP = 0.6;
        break;
      }
      case 'results': {
        // Post-match hero shot (Menus.results). Game.render shifts the projection so the winner stands whole in
        // the space the panel leaves free; with a bottom bar (narrow window) the shot pulls back by the covered
        // height. A bounded sway instead of the victory orbit: the stage behind stays put, and the billboard
        // never turns past the point where it would mirror.
        const R = RESULTS_SHOT, p = rp(this.data);
        const a = this.resYaw + Math.sin(this.modeT * R.swaySpeed) * R.sway;
        const k = 1 / Math.max(0.5, 1 - (game.viewCoverY || 0));
        tgtLook.set(p.x, RING_TOP + R.lookY, p.z);
        tgtPos.set(tgtLook.x + Math.sin(a) * R.dist * k, tgtLook.y + R.up * k, tgtLook.z + Math.cos(a) * R.dist * k);
        fov = R.fov;
        smoothP = 0.9;
        smoothL = 0.4;
        break;
      }
    }

    const snapped = this.snapNext;
    if (this.snapNext) {
      this.pos.copy(tgtPos);
      this.look.copy(tgtLook);
      this.posVel.x = this.posVel.y = this.posVel.z = 0;
      this.lookVel.x = this.lookVel.y = this.lookVel.z = 0;
      this.snapNext = false;
    } else if (dt > 0) {
      dampV(this.pos, tgtPos, this.posVel, smoothP, dt);
      dampV(this.look, tgtLook, this.lookVel, smoothL, dt);
    }

    this.fov += (fov - this.fov) * Math.min(1, dt * 4);
    this.punch *= Math.pow(0.015, dt);
    cam.fov = this.fov * (1 - this.punch * 0.14);

    // shake = trauma noise + a springy directional kick
    this.trauma = Math.max(0, this.trauma - dt * 1.7);
    const s = this.trauma * this.trauma;
    const t = this.time * 42;
    this.kickVel.addScaledVector(this.kick, -dt * 260);
    this.kickVel.multiplyScalar(Math.pow(0.0005, dt));
    this.kick.addScaledVector(this.kickVel, dt);
    cam.position.set(
      this.pos.x + s * 0.32 * Math.sin(t * 1.3) + this.kick.x * 0.25,
      this.pos.y + s * 0.26 * Math.sin(t * 1.7 + 1) + this.kick.y * 0.25,
      this.pos.z + s * 0.32 * Math.sin(t * 1.1 + 2) + this.kick.z * 0.25,
    );
    cam.lookAt(this.look.x + this.kick.x * 0.12, this.look.y + this.kick.y * 0.12, this.look.z + this.kick.z * 0.12);
    cam.updateMatrixWorld();

    cam.getWorldDirection(this.fwd);
    // The two-fighter framings draw both fighters at the size of one standing midway between their feet (the
    // mean of their view depths), so fighters level in depth keep their size and a depth gap is split evenly.
    // Eased, so when one fighter jumps in depth (vanish, teleport) both sizes drift together instead of the
    // other one popping. Close-ups (focus, ko, victory) and the flythroughs keep true perspective.
    if ((this.mode === 'fight' || this.mode === 'clash') && f[0] && f[1]) {
      const a = rp(f[0]), b = rp(f[1]), p = cam.position;
      const ref = ((a.x + b.x) / 2 - p.x) * this.fwd.x + (RING_TOP + (a.y + b.y) / 2 - p.y) * this.fwd.y + ((a.z + b.z) / 2 - p.z) * this.fwd.z;
      const r0 = this.spriteRefDepth;
      this.spriteRefDepth = r0 === null || snapped ? ref : r0 + (ref - r0) * (1 - Math.pow(0.75, dt * 60));
    } else this.spriteRefDepth = null;
    this.fwd.y = 0;
    this.fwd.normalize();
    this.right.set(-this.fwd.z, 0, this.fwd.x);
  }
}
