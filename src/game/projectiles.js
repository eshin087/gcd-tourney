import * as THREE from 'three';
import { PROJECTILES, ULTIMATE } from './moves.js';
import { DT, RING_TOP, ARENA_LIMIT } from './constants.js';
import { audio } from '../core/audio.js';
import { infinityStops } from './kit.js';

const BEAM_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

// Banded energy beam: white core, bright mid, colored rim, scrolling streaks and wobbling edges.
const BEAM_FRAG = /* glsl */ `
  uniform float uTime, uLen, uWidthPx, uFade;
  uniform vec3 cCore, cMid, cEdge;
  varying vec2 vUv;
  void main() {
    float x = vUv.x * uLen;
    float d = abs(vUv.y - 0.5) * 2.0;
    float wob = 0.07 * sin(x * 4.0 - uTime * 38.0) + 0.05 * sin(x * 9.0 + uTime * 23.0);
    float taper = smoothstep(0.0, 0.6, x);
    float edge = (0.62 + 0.38 * taper + wob) * uFade;
    if (d > edge) discard;
    float r = d / max(edge, 0.001);
    // HDR so the bloom pass makes the beam glow
    vec3 col = r < 0.38 ? cCore * 1.55 : (r < 0.7 ? cMid * 1.08 : cEdge);
    float streak = step(0.82, fract(x * 0.9 - uTime * 7.0 + floor(vUv.y * 7.0) * 0.31));
    if (r > 0.38 && r < 0.92) col = mix(col, cCore * 1.3, streak * 0.7);
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }`;

const up = new THREE.Vector3(0, 1, 0);
const tmpA = new THREE.Vector3(), tmpB = new THREE.Vector3(), tmpC = new THREE.Vector3();

export class Beam {
  constructor(game, owner) {
    this.game = game;
    this.owner = owner;
    const o = owner.opp;
    this.origin = new THREE.Vector3(owner.pos.x + owner.face.x * 0.8, owner.pos.y + 0.92, owner.pos.z + owner.face.y * 0.8);
    const target = new THREE.Vector3(o.pos.x, o.pos.y + 0.85, o.pos.z);
    this.dir = target.sub(this.origin);
    if (this.dir.lengthSq() < 0.01) this.dir.set(owner.face.x, 0, owner.face.y);
    this.dir.normalize();
    this.dir.y = THREE.MathUtils.clamp(this.dir.y, -0.35, 0.35);
    this.dir.normalize();
    this.len = 0.4;
    this.t = 0;
    this.dead = false;
    this.fade = 1;
    this.clash = null;
    this.ticks = 0;
    this.hitting = false;
    this.hasHit = false;
    this.width = owner.def.beam.width ?? ULTIMATE.width; // Hollow Purple is wider
    const b = owner.def.beam;
    this.mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 }, uLen: { value: 1 }, uWidthPx: { value: 1 }, uFade: { value: 1 },
        cCore: { value: new THREE.Color(b.core) }, cMid: { value: new THREE.Color(b.mid) }, cEdge: { value: new THREE.Color(b.edge) },
      },
      vertexShader: BEAM_VERT,
      fragmentShader: BEAM_FRAG,
      side: THREE.DoubleSide,
      depthWrite: false,
      transparent: true,
    });
    const geo = new THREE.PlaneGeometry(1, 1, 1, 1);
    geo.translate(0.5, 0, 0);
    this.mesh = new THREE.Mesh(geo, this.mat);
    this.mesh.renderOrder = 6;
    this.mesh.matrixAutoUpdate = false;
    game.scene.add(this.mesh);
    audio.loop('beam' + owner.index, 'beam');
  }

  get head() {
    return tmpC.copy(this.origin).addScaledVector(this.dir, this.len);
  }

  update() {
    this.t++;
    if (this.clash) return;
    const U = ULTIMATE;
    const o = this.owner.opp;
    if (this.t < U.duration) {
      this.len = Math.min(U.maxLen, this.len + U.speed * DT);
      // hit test against the opponent's chest
      tmpA.set(o.pos.x, o.pos.y + 0.8, o.pos.z).sub(this.origin);
      const along = tmpA.dot(this.dir);
      const perp = tmpA.addScaledVector(this.dir, -along).length();
      const touching = along > 0 && along < this.len + 0.3 && perp < this.width * 0.5 + 0.45 && !o.ko;
      if (touching && o.invuln <= 0 && o.state !== 'down' && o.state !== 'getup') {
        this.hitting = true;
        this.len = Math.min(this.len, along + 0.5);
        if (this.t % U.tickEvery === 0) {
          this.ticks++;
          const r = o.takeHit(this.owner, { dmg: U.tickDmg, hitstun: 16, push: 3.5, hitstop: 0, beam: true }, new THREE.Vector2(this.dir.x, this.dir.z).normalize());
          if (r === 'hit') this.hasHit = true;
          const h = this.head;
          this.game.fx.hit(h.x, h.y, h.z, this.ticks % 3 === 0 ? 'heavy' : 'light', new THREE.Color(this.owner.def.beam.mid));
          this.game.cam.shake(0.18);
        }
      } else this.hitting = false;
    } else {
      if (this.hasHit && !this.finished) {
        this.finished = true;
        const o2 = this.owner.opp;
        if (o2.state === 'hitstun' || o2.state === 'launched') {
          o2.takeHit(this.owner, { dmg: U.finalDmg, launch: U.launch, hitstop: 14, beam: true, big: true }, new THREE.Vector2(this.dir.x, this.dir.z).normalize());
          const h = this.head;
          this.game.fx.explosion(h.x, h.y, h.z, new THREE.Color(this.owner.def.beam.mid));
          audio.play('explosion');
          this.game.cam.shake(0.8);
        }
      }
      this.fade -= 0.08;
      if (this.fade <= 0) this.kill();
    }
  }

  kill() {
    if (this.dead) return;
    this.dead = true;
    this.game.scene.remove(this.mesh);
    this.mat.dispose();
    this.mesh.geometry.dispose();
    audio.stopLoop('beam' + this.owner.index);
  }

  // Orient the ribbon along the beam, widened toward the camera.
  sync(camera, time) {
    if (this.dead) return;
    const o = tmpA.copy(this.origin);
    o.y += RING_TOP;
    const view = tmpB.copy(camera.position).sub(o).normalize();
    const side = new THREE.Vector3().crossVectors(this.dir, view).normalize();
    const normal = new THREE.Vector3().crossVectors(this.dir, side).normalize();
    const w = this.width * (0.92 + Math.sin(time * 40) * 0.08);
    const m = this.mesh.matrix;
    m.makeBasis(this.dir.clone().multiplyScalar(this.len), side.multiplyScalar(w), normal);
    m.setPosition(o);
    this.mesh.matrixWorldNeedsUpdate = true;
    const u = this.mat.uniforms;
    u.uTime.value = time;
    u.uLen.value = this.len;
    u.uFade.value = Math.max(0, this.fade);
    // glowing bulbs at the hands and the head
    const fx = this.game.fx;
    const color = new THREE.Color(this.owner.def.beam.mid);
    const id = this.owner.index;
    const pulse = 1 + Math.sin(time * 30) * 0.08;
    fx.keep('beamO' + id, 'glow', this.origin.x, this.origin.y, this.origin.z, { scale: 0.7 * pulse * this.fade, color, opacity: 1, order: 7, glow: 0.35 });
    if (!this.clash) {
      const h = this.head;
      fx.keep('beamH' + id, 'glow', h.x, h.y, h.z, { scale: (this.hitting ? 1.25 : 0.95) * pulse * this.fade, color, opacity: 1, order: 7, glow: 0.4 });
      fx.keep('beamH2' + id, 'glow', h.x, h.y, h.z, { scale: 0.5 * pulse * this.fade, color: 0xffffff, opacity: 1, order: 8, glow: 0.8 });
    }
  }
}

export class Projectile {
  constructor(game, owner, type, dir) {
    const P = PROJECTILES[type];
    this.game = game;
    this.owner = owner;
    this.P = P;
    this.type = type;
    this.pos = new THREE.Vector3(owner.pos.x + owner.face.x * 0.5, owner.pos.y + 0.9, owner.pos.z + owner.face.y * 0.5);
    this.vel = dir.clone().multiplyScalar(P.speed);
    this.life = P.life;
    this.dead = false;
    this.sprite = game.fx.spawn(P.sprite, this.pos.x, this.pos.y, this.pos.z, { scale: P.scale, loop: true, life: 999, order: 7, color: P.color ?? 0xffffff, glow: P.color ? 1.2 : 0, random: !!P.random });
    if (P.glowColor) {
      this.glow = game.fx.spawn('glow', this.pos.x, this.pos.y, this.pos.z, { scale: P.scale * 0.9 + 0.3, color: P.glowColor, loop: true, life: 999, opacity: 0.5, order: 6 });
    }
  }

  update() {
    this.pos.addScaledVector(this.vel, DT);
    this.life -= DT;
    const fx = this.game.fx;
    this.sprite.mesh.position.set(this.pos.x, this.pos.y + RING_TOP, this.pos.z);
    if (this.glow) this.glow.mesh.position.copy(this.sprite.mesh.position);
    const back = { x: this.pos.x - this.vel.x * 0.03, z: this.pos.z - this.vel.z * 0.03 };
    if (this.P.trail === 'fire' && Math.random() < 0.5) fx.spawn('fire', back.x, this.pos.y, back.z, { scale: 0.7, life: 0.2, fade: true, opacity: 0.8 });
    if (this.P.trail === 'bolt') fx.spawn('lightning', back.x, this.pos.y, back.z, { scale: 0.55, random: true, life: 0.06, color: 0xd8f0ff, rot: Math.random() * 6.28, order: 7, glow: 1.6 });
    if (this.P.trail === 'red' && Math.random() < 0.6) fx.spawn('glow', back.x, this.pos.y, back.z, { scale: 0.8, life: 0.12, color: 0xff3048, opacity: 0.6, fade: true, order: 6 });
    if (this.pos.y < 0.1 || Math.abs(this.pos.x) > ARENA_LIMIT + 4 || Math.abs(this.pos.z) > ARENA_LIMIT + 4 || this.life <= 0) {
      if (this.pos.y < 0.1 && this.P.burst === 'explosion') {
        fx.explosion(this.pos.x, 0.3, this.pos.z, new THREE.Color(this.P.burstColor ?? 0xff8a30));
        audio.play('hitHeavy', 0.7);
      }
      this.kill();
      return;
    }
    const o = this.owner.opp;
    if (o.invuln > 0 || o.ko || o.state === 'down') return;
    // distance to the victim's body capsule
    const by = THREE.MathUtils.clamp(this.pos.y, o.pos.y + 0.25, o.pos.y + 1.4);
    const d = Math.hypot(this.pos.x - o.pos.x, this.pos.y - by, this.pos.z - o.pos.z);
    // Infinity (Gojo's passive): the projectile slows to nothing before it can touch him
    if (d < this.P.radius + 1.15 && infinityStops(o)) {
      fx.spawn('ring', this.pos.x, this.pos.y, this.pos.z, { scale: 0.9, color: 0xd8f2ff, glow: 1, order: 8 });
      fx.spawn('glow', this.pos.x, this.pos.y, this.pos.z, { scale: 1, color: 0x9fd8ff, opacity: 0.5, life: 0.25, fade: true });
      if (!o.infinityCallT || this.game.time - o.infinityCallT > 2) {
        o.infinityCallT = this.game.time;
        this.game.hud.callout(o.index, 'INFINITY', '#d8f2ff');
      }
      audio.play('block', 0.6);
      this.kill();
      return;
    }
    if (d < this.P.radius + 0.42) {
      const dir = new THREE.Vector2(this.vel.x, this.vel.z).normalize();
      const r = o.takeHit(this.owner, { ...this.P, hitstop: this.P.big ? 10 : 4, projectileHit: true, big: this.P.big }, dir);
      if (this.P.burst === 'explosion') {
        fx.explosion(this.pos.x, this.pos.y, this.pos.z, new THREE.Color(this.P.burstColor ?? 0xff8a30));
        audio.play('explosion', 0.7);
        this.game.cam.shake(0.5);
      } else if (this.P.trail === 'bolt') {
        fx.spawn('lightning', this.pos.x, this.pos.y, this.pos.z, { scale: 1.3, random: true, life: 0.18, color: 0xffffff, order: 9, glow: 2 });
        fx.hitSpark(this.pos.x, this.pos.y, this.pos.z, true, 0xbfe6ff);
        audio.play(r === 'block' ? 'block' : 'hitHeavy', 0.8);
      } else {
        fx.hitSpark(this.pos.x, this.pos.y, this.pos.z, false);
        audio.play(r === 'block' ? 'block' : 'hit', 0.8);
      }
      this.kill();
    }
  }

  kill() {
    if (this.dead) return;
    this.dead = true;
    this.game.fx.kill(this.sprite);
    if (this.glow) this.game.fx.kill(this.glow);
  }
}

// Aim from the thrower's hand toward the opponent's chest, fanned out for volleys.
export function spawnProjectiles(game, owner, type = owner.def.projectile) {
  const P = PROJECTILES[type];
  const o = owner.opp;
  const from = new THREE.Vector3(owner.pos.x, owner.pos.y + 0.9, owner.pos.z);
  const to = new THREE.Vector3(o.pos.x, o.pos.y + 0.8, o.pos.z);
  const base = to.sub(from).normalize();
  const list = [];
  for (let i = 0; i < P.count; i++) {
    const off = (i - (P.count - 1) / 2) * P.spread;
    const d = base.clone().applyAxisAngle(up, off);
    list.push(new Projectile(game, owner, type, d));
  }
  audio.play(P.sfx);
  return list;
}

// Lapse: Blue (Gojo): a gravity vortex in front of the caster that drags the opponent in,
// ticks small hits, then pops them up for a combo. Gojo is free to act while it runs.
export class Vortex {
  constructor(game, owner, m) {
    this.game = game;
    this.owner = owner;
    this.m = m;
    this.t = 0;
    this.dead = false;
    const f = owner;
    this.pos = new THREE.Vector3(f.pos.x + f.face.x * m.dist, Math.max(0.9, f.opp.pos.y + 0.9), f.pos.z + f.face.y * m.dist);
    this.id = 'vortex' + owner.index;
    audio.play('beamCharge', 0.5);
  }

  update() {
    const m = this.m, g = this.game, fx = g.fx, o = this.owner.opp, p = this.pos;
    this.t++;
    const grow = Math.min(1, this.t / 8) * (this.t > m.len - 6 ? Math.max(0, (m.len - this.t) / 6) : 1);
    fx.keep(this.id, 'orb', p.x, p.y, p.z, { scale: 0.25 + 1.0 * grow, color: 0x7ab8ff, order: 8, glow: 0.9 });
    fx.keep(this.id + 'g', 'glow', p.x, p.y, p.z, { scale: 0.4 + 2.2 * grow, color: 0x2a6aff, opacity: 0.5, order: 3, glow: 1 });
    if (this.t % 4 === 0) fx.spawn('ring', p.x, p.y, p.z, { scale: 1.8 * grow, color: 0x4aa8ff, glow: 0.8, life: 0.2, fade: true, order: 7 });
    if (this.t % 2 === 0) {
      const a = Math.random() * Math.PI * 2, r = 2.2;
      const sx = p.x + Math.cos(a) * r, sy = p.y + Math.sin(a) * r * 0.6, sz = p.z + Math.sin(a * 1.7) * 0.5;
      fx.spawn('star', sx, sy, sz, { scale: 0.2, frame: 2, vel: [(p.x - sx) * 5, (p.y - sy) * 5, (p.z - sz) * 5], life: 0.2, color: 0xbfe4ff, order: 9, glow: 1.5 });
    }
    // drag the opponent toward the core
    const canPull = !o.ko && !o.hidden && o.state !== 'down' && o.state !== 'getup';
    const dx = p.x - o.pos.x, dz = p.z - o.pos.z, dy = p.y - 0.8 - o.pos.y;
    const d = Math.hypot(dx, dz, dy) || 1;
    const dir = new THREE.Vector2(-dx, -dz).normalize();
    if (canPull && d < m.radius) {
      const k = m.pull * Math.min(1, d / 0.6);
      o.vel.x = (dx / d) * k;
      o.vel.z = (dz / d) * k;
      if (o.air || dy > 0.3) {
        o.vel.y = (dy / d) * k;
        o.air = true;
      }
      if (this.t % m.tick === 0 && o.hittable) o.takeHit(this.owner, { ...m.tickHit, projectileHit: true }, dir);
    }
    if (this.t >= m.len) {
      if (canPull && d < 1.8 && o.hittable) o.takeHit(this.owner, { ...m.pop, projectileHit: true }, dir);
      fx.explosion(p.x, p.y, p.z, new THREE.Color(0x6ab4ff));
      g.cam.shake(0.4);
      audio.play('explosion', 0.6);
      this.kill();
    }
  }

  kill() {
    if (this.dead) return;
    this.dead = true;
    this.game.fx.drop(this.id);
    this.game.fx.drop(this.id + 'g');
  }
}
