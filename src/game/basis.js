// The control basis (ADR 0036, ENG-091): the screen axes the simulation reads. Stick directions, facing, `side`,
// lane offsets, dash and tech directions and the CPU's sense of "toward" are all relative to it. It used to be the
// rendered camera's own axes, which move with real-time smoothing, screen shake, interpolated render positions and
// the window's aspect, so two machines (or two refresh rates) disagreed about where "right" was. Now the
// simulation owns it: the fight framing's yaw rule on the fighters' positions, damped on the fixed step with
// deterministic math. The render camera follows this yaw for its framing (camera.js), so what you see and what
// the controls mean stay the same.
import * as THREE from 'three';
import { DT } from './constants.js';
import * as dmath from './dmath.js';

// Critically damped spring toward a target (Unity's SmoothDamp). Only + - * /, so it is deterministic too.
export function damp(cur, target, vel, key, smooth, dt) {
  const omega = 2 / Math.max(0.0001, smooth);
  const x = omega * dt;
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const change = cur - target;
  const temp = (vel[key] + omega * change) * dt;
  vel[key] = (vel[key] - omega * temp) * exp;
  return target + (change + temp) * exp;
}

// the fight framing: the camera swings to look across the line between the fighters once they are apart, within
// ±0.42 rad of straight on (the yaw the rendered fight camera used to compute for itself)
const BASIS = { minSep: 2.2, maxYaw: 0.42, smooth: 1.1 };

export class ControlBasis {
  constructor() {
    this.right = new THREE.Vector3(1, 0, 0);
    this.fwd = new THREE.Vector3(0, 0, -1);
    this.reset();
  }

  // a match starts looking straight on
  reset(yaw = 0) {
    this.yaw = this.prevYaw = this.target = yaw;
    this.vel = { v: 0 };
    this.apply();
  }

  // One fixed step: aim at the fighters' current positions (the simulation's, never the interpolated render ones).
  step(fighters) {
    this.prevYaw = this.yaw;
    const a = fighters[0], b = fighters[1];
    if (a && b) {
      const dx = b.pos.x - a.pos.x, dz = b.pos.z - a.pos.z;
      if (dmath.hypot(dx, dz) > BASIS.minSep) {
        let ideal = dmath.atan2(dx, dz) - dmath.PI / 2;
        while (ideal - this.yaw > dmath.PI / 2) ideal -= dmath.PI;
        while (ideal - this.yaw < -dmath.PI / 2) ideal += dmath.PI;
        this.target = THREE.MathUtils.clamp(ideal, -BASIS.maxYaw, BASIS.maxYaw);
      }
    }
    this.yaw = damp(this.yaw, this.target, this.vel, 'v', BASIS.smooth, DT);
    this.apply();
  }

  // the camera sits at (sin yaw, cos yaw) from the fighters' midpoint looking back at it: forward is the opposite
  // ground direction, right is forward turned a quarter turn
  apply() {
    const s = dmath.sin(this.yaw), c = dmath.cos(this.yaw);
    this.fwd.set(-s, 0, -c);
    this.right.set(c, 0, -s);
  }

  // a stick (screen right / screen up) as a ground direction
  dir(mx, my) {
    return new THREE.Vector2(this.right.x * mx + this.fwd.x * my, this.right.z * mx + this.fwd.z * my);
  }

  // the yaw for drawing between two fixed steps (alpha = how far the render is past the last step)
  viewYaw(alpha) {
    return this.prevYaw + (this.yaw - this.prevYaw) * alpha;
  }
}
