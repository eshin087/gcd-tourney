import * as THREE from 'three';
import { PROJECTILES, ULTIMATE } from './moves.js';
import { DT, RING_TOP, ARENA_LIMIT } from './constants.js';
import { audio } from '../core/audio.js';
import { infinityStops } from './kit.js';
import * as dmath from './dmath.js';
import { PASSIVES } from './moves.js';

const BEAM_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

// Banded energy beam: white core, bright mid, colored rim, thin streaks racing along it and wobbling edges.
// uHot scales the HDR of the core: a beam clash keeps it low, or the bloom buries the fighters (ADR 0034).
const BEAM_FRAG = /* glsl */ `
  uniform float uTime, uLen, uWidthPx, uFade, uHot;
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
    vec3 col = r < 0.34 ? cCore * uHot : (r < 0.7 ? cMid * 1.05 : cEdge);
    // streaks: thin pointed dashes in 6 lanes across the band (each lane offset), never full-height blocks
    float lane = floor(vUv.y * 6.0), ly = abs(fract(vUv.y * 6.0) - 0.5);
    float s = fract(x * 0.55 - uTime * 6.0 + lane * 0.37);
    float streak = s > 0.72 && ly < 0.22 * (s - 0.72) / 0.28 ? 1.0 : 0.0;
    if (r > 0.34 && r < 0.9) col = mix(col, cCore * 1.15, streak * 0.75);
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }`;

// A stream drawn from a VFX atlas band (streamBolt, streamLance, streamFlame; ADR 0034): the cell repeats every uSeg
// world units along the stream, scrolling toward its head, and fades in over its first stretch out of the hand.
const STREAM_FRAG = /* glsl */ `
  uniform sampler2D map;
  uniform vec4 uvRect;
  uniform float uLen, uSeg, uScroll, uFade, uGlow;
  uniform vec3 color;
  varying vec2 vUv;
  void main() {
    float x = vUv.x * uLen;
    float u = fract((x - uScroll) / uSeg);
    vec4 c = texture2D(map, vec2(mix(uvRect.x, uvRect.z, u), mix(uvRect.y, uvRect.w, vUv.y)));
    float a = c.a * uFade * smoothstep(0.0, 0.35, x);
    if (a < 0.08) discard;
    gl_FragColor = vec4(c.rgb * color * (1.0 + uGlow), a);
    #include <colorspace_fragment>
  }`;

// How each stream style is drawn (PROJECTILES[id].stream.style, def.beam.style; ADR 0034). fx: the atlas band, seg:
// world length of one cell (also the ribbon's width, the cell being square), scroll: units/s toward the head, tint:
// how far the white art is tinted from the core toward the mid color (full-color art stays as drawn), glow: bloom.
// 'orb' (Reversal: Red) holds the orb effect at the hand and sends repulsion ripples down a faint channel in the mid
// color (no white core) to the struggle point; 'ribbon' is the shader beam (the ultimate beams).
export const STREAM_STYLES = {
  ribbon: {},
  bolt: { fx: 'streamBolt', seg: 1.5, scroll: 9, tint: 0.55, glow: 0.45 },
  lance: { fx: 'streamLance', seg: 1.4, scroll: 14, tint: 0.4, glow: 0.4 },
  flame: { fx: 'streamFlame', seg: 1.6, scroll: 6, full: true, glow: 0.2 },
  orb: { orb: 'redOrb', orbScale: 0.5, width: 0.42, wave: 'ripple', waveEvery: 0.11, waveLife: 0.3 },
};

const up = new THREE.Vector3(0, 1, 0);
const tmpA = new THREE.Vector3(), tmpB = new THREE.Vector3(), tmpC = new THREE.Vector3();

// opts.palette / opts.width: a BEAM CLASH stream (ADR 0027) in its shot's colors; the ultimate beam uses the
// fighter's def.beam. The palette's `style` picks how it is drawn (STREAM_STYLES, ADR 0034); opts.pose / poseFrame: the
// pose (and frame) whose drawn hand the stream leaves from (a struggle's `beamStruggle`, the air `throw` release).
// Simulation state only: its mesh is a BeamView (ShotViews, by `id`), so a saved state can bring it back (ADR 0036).
export class Beam {
  constructor(game, owner, opts = {}) {
    this.game = game;
    this.owner = owner;
    this.id = game.nextShotId++;
    const o = owner.opp;
    // from the drawn palms of the pose when the art pack marks them
    const H = owner.actor?.hand?.(opts.pose ?? 'beamFire', opts.poseFrame ?? 0);
    const fwd = H ? H.x : 0.8, up = H ? H.y : 0.92;
    this.origin = new THREE.Vector3(owner.pos.x + owner.face.x * fwd, owner.pos.y + up, owner.pos.z + owner.face.y * fwd);
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
    const b = (this.pal = opts.palette ?? owner.def.beam);
    this.width = opts.width ?? b.width ?? ULTIMATE.width; // Hollow Purple is wider
    // an atlas style needs its band in the atlas; without it (an old pack) the stream falls back to the ribbon. The
    // atlas the game loaded at startup decides (game.fxMeta), never the effects object, which a rollback swaps out.
    const St = STREAM_STYLES[b.style] ?? STREAM_STYLES.ribbon;
    this.St = St.fx && !game.fxMeta?.anims?.[St.fx] ? STREAM_STYLES.ribbon : St;
    if (St !== this.St && !game.resim) console.warn(`[vfx] no ${St.fx} in the atlas: the ${b.style} stream draws as a ribbon`);
    if (this.St.width) this.width = this.St.width;
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
      // `spent`: a beam that won a clash already dealt its damage (Game.overwhelm); the rest is the show
      const touching = !this.spent && along > 0 && along < this.len + 0.3 && perp < this.width * 0.5 + 0.45 && !o.ko;
      if (touching && o.evading) this.game.onEvade(o);
      if (touching && o.invuln <= 0 && o.state !== 'down' && o.state !== 'getup') {
        this.hitting = true;
        this.len = Math.min(this.len, along + 0.5);
        if (this.t % U.tickEvery === 0) {
          this.ticks++;
          const r = o.takeHit(this.owner, { dmg: U.tickDmg, hitstun: 16, push: 3.5, hitstop: 0, beam: true, lock: U.tickEvery + 3 }, new THREE.Vector2(this.dir.x, this.dir.z).normalize());
          if (r === 'hit') this.hasHit = true;
          const h = this.head;
          this.game.fx.hit(h.x, h.y, h.z, this.ticks % 3 === 0 ? 'heavy' : 'light', new THREE.Color(this.pal.mid));
          this.game.cam.shake(0.18);
        }
      } else this.hitting = false;
    } else {
      if (this.hasHit && !this.finished) {
        this.finished = true;
        const o2 = this.owner.opp;
        if (o2.state === 'hitstun' || o2.state === 'launched') {
          o2.takeHit(this.owner, { dmg: U.finalDmg, launch: U.launch, hitstop: 14, beam: true, big: true, hardKnockdown: true, noTech: true }, new THREE.Vector2(this.dir.x, this.dir.z).normalize());
          const h = this.head;
          this.game.fx.explosion(h.x, h.y, h.z, new THREE.Color(this.pal.mid));
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
    audio.stopLoop('beam' + this.owner.index);
  }
}

// A beam's ribbon (or atlas stream): the view of a Beam, made and dropped by ShotViews as beams come and go.
class BeamView {
  constructor(game, beam) {
    this.game = game;
    const b = beam.pal, St = beam.St;
    this.mat = St.fx
      ? new THREE.ShaderMaterial({
        uniforms: {
          map: { value: game.fx.tex }, uvRect: { value: new THREE.Vector4() }, uLen: { value: 1 }, uSeg: { value: St.seg },
          uScroll: { value: 0 }, uFade: { value: 1 }, uGlow: { value: St.glow ?? 0.3 },
          color: { value: St.full ? new THREE.Color(0xffffff) : new THREE.Color(b.core).lerp(new THREE.Color(b.mid), St.tint ?? 0.5) },
        },
        vertexShader: BEAM_VERT,
        fragmentShader: STREAM_FRAG,
        side: THREE.DoubleSide,
        depthWrite: false,
        transparent: true,
      })
      : new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 }, uLen: { value: 1 }, uWidthPx: { value: 1 }, uFade: { value: 1 }, uHot: { value: 1.4 },
          cCore: { value: new THREE.Color(St.orb ? b.mid : b.core) }, cMid: { value: new THREE.Color(b.mid) }, cEdge: { value: new THREE.Color(b.edge) },
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
    this.waveT = -1; // when the last ripple left the orb (render clock)
  }

  dispose() {
    this.game.scene.remove(this.mesh);
    this.mat.dispose();
    this.mesh.geometry.dispose();
  }

  // Orient the ribbon along the beam, widened toward the camera.
  sync(beam, camera, time) {
    const o = tmpA.copy(beam.origin);
    o.y += RING_TOP;
    const view = tmpB.copy(camera.position).sub(o).normalize();
    const side = new THREE.Vector3().crossVectors(beam.dir, view).normalize();
    const normal = new THREE.Vector3().crossVectors(beam.dir, side).normalize();
    const St = beam.St;
    // an atlas band is as wide as one cell is long (square cells); the ribbon flickers
    const w = St.fx ? St.seg : beam.width * (0.92 + dmath.sin(time * 40) * 0.08);
    const m = this.mesh.matrix;
    m.makeBasis(beam.dir.clone().multiplyScalar(beam.len), side.multiplyScalar(w), normal);
    m.setPosition(o);
    this.mesh.matrixWorldNeedsUpdate = true;
    const u = this.mat.uniforms;
    const fx = this.game.fx;
    u.uLen.value = beam.len;
    u.uFade.value = Math.max(0, beam.fade);
    if (St.fx) {
      const a = fx.meta.anims[St.fx];
      fx.uv(St.fx, Math.floor((time * 1000) / a.ms) % a.n, u.uvRect.value);
      u.uScroll.value = (time * St.scroll) % St.seg;
    } else {
      u.uTime.value = time;
      u.uHot.value = beam.clash ? 1.1 : 1.4; // in a clash the two streams sit beside the fighters
    }
    // bulbs at the hands and the head. The hand bulb is small and drawn behind the sprite (fighters are order 2), so
    // it lights the palm without covering the body
    const color = new THREE.Color(beam.pal.mid);
    const id = beam.owner.index;
    const pulse = 1 + dmath.sin(time * 30) * 0.08;
    fx.keep('beamO' + id, 'glow', beam.origin.x, beam.origin.y, beam.origin.z, { scale: (beam.clash ? 0.34 : 0.5) * pulse * beam.fade, color, opacity: 0.9, order: 1, glow: 0.3 });
    const h = beam.head;
    if (St.orb) {
      // the orb is the technique (Reversal: Red), held just ahead of the fingertips; it pulses on a good beat and
      // sends repulsion ripples down the channel to the struggle point
      const s = St.orbScale * (beam.clash ? 1 + beam.clash.kick * 0.2 : 1) * beam.fade;
      const at = 0.3 + 0.2 * s, ox = beam.origin.x + beam.dir.x * at, oy = beam.origin.y + beam.dir.y * at, oz = beam.origin.z + beam.dir.z * at;
      fx.keep('beamOrb' + id, St.orb, ox, oy, oz, { scale: s, order: 7, glow: 0.3 });
      if (time - this.waveT >= St.waveEvery && beam.fade > 0.5) {
        this.waveT = time;
        const v = Math.max(0.5, beam.len - at) / St.waveLife;
        fx.spawn(St.wave, ox, oy, oz, { scale: 0.32, grow: 2.2, life: St.waveLife, fade: true, vel: [beam.dir.x * v, beam.dir.y * v, beam.dir.z * v], color, opacity: 0.7, order: 6, glow: 0.3 });
      }
    } else if (!beam.clash && !St.fx) {
      fx.keep('beamH' + id, 'glow', h.x, h.y, h.z, { scale: (beam.hitting ? 1.25 : 0.95) * pulse * beam.fade, color, opacity: 1, order: 7, glow: 0.4 });
      fx.keep('beamH2' + id, 'glow', h.x, h.y, h.z, { scale: 0.5 * pulse * beam.fade, color: 0xffffff, opacity: 1, order: 8, glow: 0.6 });
    }
  }
}

// The shots' visuals, rebuilt from the simulation every render (ADR 0036): a projectile's sprite and glow and a beam's
// ribbon live here, keyed by the shot's id, so restoring a saved state (a rollback) brings them back or drops them
// like any other state, and a re-simulated frame never spawns a second one.
export class ShotViews {
  constructor(game) {
    this.game = game;
    this.shots = new Map(); // projectile id -> { sprite, glow }
    this.beams = new Map(); // beam id -> BeamView
  }

  sync(camera, time) {
    const g = this.game, fx = g.fx, seen = new Set();
    for (const p of g.projectiles) {
      if (p.dead) continue;
      seen.add(p.id);
      let v = this.shots.get(p.id);
      if (!v || v.sprite.life < 0) {
        const P = p.P;
        v = { sprite: fx.spawn(P.sprite, p.pos.x, p.pos.y, p.pos.z, { scale: P.scale, loop: true, life: 999, order: 7, color: P.color ?? 0xffffff, glow: P.color ? 1.2 : 0, random: !!P.random }) };
        if (P.glowColor) v.glow = fx.spawn('glow', p.pos.x, p.pos.y, p.pos.z, { scale: P.scale * 0.9 + 0.3, color: P.glowColor, loop: true, life: 999, opacity: 0.5, order: 6 });
        this.shots.set(p.id, v);
      }
      v.sprite.mesh.position.set(p.pos.x, p.pos.y + RING_TOP, p.pos.z);
      if (v.glow) v.glow.mesh.position.copy(v.sprite.mesh.position);
    }
    for (const [id, v] of this.shots) {
      if (seen.has(id)) continue;
      fx.kill(v.sprite);
      if (v.glow) fx.kill(v.glow);
      this.shots.delete(id);
    }
    seen.clear();
    for (const b of g.beams) {
      if (b.dead) continue;
      seen.add(b.id);
      let v = this.beams.get(b.id);
      if (!v) this.beams.set(b.id, (v = new BeamView(g, b)));
      v.sync(b, camera, time);
    }
    for (const [id, v] of this.beams) {
      if (seen.has(id)) continue;
      v.dispose();
      this.beams.delete(id);
    }
  }

  // a match ends: every view goes (the effects themselves are cleared with fx.clearAll)
  clear() {
    for (const v of this.beams.values()) v.dispose();
    this.beams.clear();
    this.shots.clear();
  }
}

// Simulation state only: its sprite and glow are drawn by ShotViews, keyed by `id` (ADR 0036).
export class Projectile {
  constructor(game, owner, type, dir) {
    const P = PROJECTILES[type];
    this.game = game;
    this.owner = owner;
    this.id = game.nextShotId++;
    this.P = P;
    this.type = type;
    this.name = owner.move?.name ?? owner.def.projectileName ?? type.toUpperCase(); // the BEAM CLASH callout
    // leaves from the drawn hand when the art pack marks it (anims.json `hand` / hit box)
    const H = owner.actor?.hand?.();
    const fwd = H ? H.x : 0.5, up = H ? H.y : 0.9;
    this.pos = new THREE.Vector3(owner.pos.x + owner.face.x * fwd, owner.pos.y + up, owner.pos.z + owner.face.y * fwd);
    this.vel = dir.clone().multiplyScalar(P.speed);
    this.life = P.life;
    this.dead = false;
  }

  update() {
    this.pos.addScaledVector(this.vel, DT);
    this.life -= DT;
    const fx = this.game.fx;
    const back = { x: this.pos.x - this.vel.x * 0.03, z: this.pos.z - this.vel.z * 0.03 };
    if (this.P.trail === 'fire' && Math.random() < 0.5) fx.spawn('fire', back.x, this.pos.y, back.z, { scale: 0.7, life: 0.2, fade: true, opacity: 0.8 });
    if (this.P.trail === 'bolt') fx.spawn('lightning', back.x, this.pos.y, back.z, { scale: 0.55, random: true, life: 0.06, color: 0xd8f0ff, rot: Math.random() * 6.28, order: 7, glow: 1.6 });
    if (this.P.trail === 'red' && Math.random() < 0.6) fx.spawn('glow', back.x, this.pos.y, back.z, { scale: 0.8, life: 0.12, color: 0xff3048, opacity: 0.6, fade: true, order: 6 });
    if (this.pos.y < 0.1 || Math.abs(this.pos.x) > ARENA_LIMIT + 4 || Math.abs(this.pos.z) > ARENA_LIMIT + 4 || this.life <= 0) {
      if (this.pos.y < 0.1 && this.P.burst === 'explosion') {
        fx.explosion(this.pos.x, 0.3, this.pos.z, new THREE.Color(this.P.burstColor ?? 0xff8a30));
        audio.play('hitHeavy', 0.7);
      }
      // a styled shot marks the floor it reaches (a missed Narukami Air burns it too)
      if (this.pos.y < 0.1 && this.P.ground) fx.ground.impact(this.pos, { kind: this.P.big ? 'shot' : 'shotSmall', style: this.P.ground, tint: this.P.glowColor, dir: this.vel });
      this.kill();
      return;
    }
    const o = this.owner.opp;
    if (o.invuln > 0 || o.ko || o.state === 'down') {
      if (o.evading && dmath.hypot(this.pos.x - o.pos.x, this.pos.y - o.pos.y - 0.8, this.pos.z - o.pos.z) < this.P.radius + 0.7) this.game.onEvade(o);
      return;
    }
    // distance to the victim's body capsule
    const by = THREE.MathUtils.clamp(this.pos.y, o.pos.y + 0.25, o.pos.y + 1.4);
    const d = dmath.hypot(this.pos.x - o.pos.x, this.pos.y - by, this.pos.z - o.pos.z);
    // Infinity (Gojo's passive): the projectile slows to nothing before it can touch him
    if (d < this.P.radius + 1.15 && infinityStops(o)) {
      fx.spawn('ring', this.pos.x, this.pos.y, this.pos.z, { scale: 0.9, color: 0xd8f2ff, glow: 1, order: 8 });
      fx.spawn('glow', this.pos.x, this.pos.y, this.pos.z, { scale: 1, color: 0x9fd8ff, opacity: 0.5, life: 0.25, fade: true });
      // frames, not the render clock: the ki charge below decides a fight (ADR 0036)
      if (!o.infinityCallT || this.game.frameNo - o.infinityCallT > 120) {
        o.infinityCallT = this.game.frameNo;
        this.game.hud.callout(o.index, 'INFINITY', '#d8f2ff');
      }
      audio.play('block', 0.6);
      // one charge per volley: a 3-shuriken throw costs Gojo 15 ki, not 45
      if (!o.infinityPayT || this.game.frameNo - o.infinityPayT > 21) {
        o.ki = Math.max(0, o.ki - PASSIVES.infinity.kiCost);
        o.infinityPayT = this.game.frameNo;
      }
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
        audio.play(r === 'hit' ? 'hitHeavy' : 'block', 0.8);
      } else {
        fx.hitSpark(this.pos.x, this.pos.y, this.pos.z, false);
        audio.play(r === 'hit' ? 'hit' : 'block', 0.8);
      }
      this.kill();
    }
  }

  kill() {
    this.dead = true; // ShotViews drops its sprite on the next render
  }
}

// Hollow Purple (Gojo, ADR 0017): the imaginary mass rolls forward on its own, erases the opponent's projectiles
// (Game.projectileCollisions) and carves a trench. One unblockable hit, then it keeps going; you leave its lane or
// vanish. `S` is the SUPERS entry (speed, radius, life, dmg, launch, colors).
export class Orb {
  constructor(game, owner, S, at, ultimate = true) {
    this.game = game;
    this.owner = owner;
    this.S = S;
    this.ultimate = ultimate;
    this.id = 'orb' + owner.index;
    this.pos = at.clone();
    const o = owner.opp;
    this.dir = new THREE.Vector3(o.pos.x - at.x, 0, o.pos.z - at.z);
    if (this.dir.lengthSq() < 1e-4) this.dir.set(owner.face.x, 0, owner.face.y);
    this.dir.normalize();
    this.r = S.radius;
    this.t = 0;
    this.grow = 0.2;
    this.dead = false;
    this.hit = false;
    this.clash = null;
    audio.loop('orb' + owner.index, 'beam');
  }

  update() {
    if (this.dead) return;
    this.t++;
    const g = this.game, fx = g.fx, S = this.S, p = this.pos;
    this.grow = Math.min(1, this.grow + 0.1);
    if (!this.clash) {
      p.addScaledVector(this.dir, S.speed * DT);
      fx.ground.trail(this.id, p, this.dir, S.radius * 2, S.ground, S.orb); // the trench it carves
      if (this.t % 5 === 0) fx.debris(p.x, p.z, 3, 0.7);
      const o = this.owner.opp;
      if (!this.hit && !o.ko && !o.hidden && o.state !== 'down' && o.state !== 'getup') {
        const by = THREE.MathUtils.clamp(p.y, o.pos.y + 0.25, o.pos.y + 1.4);
        const touching = dmath.hypot(p.x - o.pos.x, p.y - by, p.z - o.pos.z) < this.r * this.grow + 0.35;
        // a dodge carrying them through it only counts once it has rolled past without a hit: it is too wide and slow
        // for a spot dodge alone, so a callout on contact would come right before the hit
        if (touching && o.evading) this.slip = true;
        else if (!touching && this.slip) { this.slip = false; g.onEvade(o); }
        else if (touching && o.invuln <= 0) {
          this.hit = true;
          o.takeHit(this.owner, { dmg: S.dmg, minScale: 1, launch: S.launch, wallBounce: true, noTech: true, hitstop: 18, unblockable: true, big: true, shake: 1.2, spark: 'smash', hitFlash: 'special' }, new THREE.Vector2(this.dir.x, this.dir.z).normalize());
          fx.explosion(o.pos.x, o.pos.y + 0.9, o.pos.z, new THREE.Color(S.orb));
          fx.overlay.impactFrame(4);
          g.cam.shake(1.1);
          audio.play('explosion', 1.3);
          g.excite = 1;
        }
      }
      if (this.t > S.life * 60 || Math.abs(p.x) > ARENA_LIMIT + 3 || Math.abs(p.z) > ARENA_LIMIT + 3) { this.kill(); return; }
    }
    const s = this.r * 1.35 * this.grow * (1 + 0.05 * dmath.sin(this.t * 0.7));
    fx.keep(this.id, 'orb', p.x, p.y, p.z, { scale: s, color: S.orb, order: 8, glow: 1.1 });
    fx.keep(this.id + 'c', 'orb', p.x, p.y, p.z, { scale: s * 0.5, color: 0xf2e2ff, order: 9, glow: 1.6 });
    fx.keep(this.id + 'g', 'glow', p.x, p.y, p.z, { scale: s * 1.25, color: S.glow, opacity: 0.32, order: 3, glow: 0.8 }); // larger reads as a flat square
    if (this.t % 5 === 0) fx.spawn('ring', p.x, p.y, p.z, { scale: s * 1.1, color: S.orb, glow: 0.8, life: 0.2, fade: true, order: 7 });
    if (this.t % 3 === 0) fx.spawn('lightning', p.x + (Math.random() - 0.5) * this.r, p.y + (Math.random() - 0.5) * this.r, p.z, { scale: 0.7, random: true, life: 0.08, color: 0xe0c0ff, rot: Math.random() * 6.28, order: 9, glow: 1.6 });
  }

  kill() {
    if (this.dead) return;
    this.dead = true;
    const fx = this.game.fx;
    fx.drop(this.id);
    fx.drop(this.id + 'c');
    fx.drop(this.id + 'g');
    audio.stopLoop('orb' + this.owner.index);
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
    // turned about the vertical by hand: three.js would turn it with the engine's Math.sin / cos (ADR 0036)
    const c = dmath.cos(off), sn = dmath.sin(off);
    const d = new THREE.Vector3(base.x * c + base.z * sn, base.y, base.z * c - base.x * sn);
    list.push(new Projectile(game, owner, type, d));
  }
  audio.play(P.sfx);
  return list;
}

// Lapse: Blue (Gojo): a gravity vortex in front of the caster that drags the opponent in,
// ticks small hits, then pops them up for a combo. Gojo is free to act while it runs.
export class Vortex {
  // at: a fixed point (the Rasenshuriken grinds the victim where it hit); otherwise `dist` ahead
  constructor(game, owner, m, at = null) {
    this.game = game;
    this.owner = owner;
    this.m = m;
    this.t = 0;
    this.dead = false;
    this.fixed = !!at;
    const f = owner;
    this.pos = at
      ? new THREE.Vector3(at.x, at.y + 0.9, at.z)
      : new THREE.Vector3(f.pos.x + f.face.x * m.dist, Math.max(0.9, f.opp.pos.y + 0.9), f.pos.z + f.face.y * m.dist);
    const C = m.colors || {};
    this.colors = { orb: C.orb ?? 0x7ab8ff, glow: C.glow ?? 0x2a6aff, ring: C.ring ?? 0x4aa8ff };
    this.id = 'vortex' + owner.index;
    audio.play('beamCharge', 0.5);
  }

  update() {
    const m = this.m, g = this.game, fx = g.fx, o = this.owner.opp, p = this.pos;
    this.t++;
    const grow = Math.min(1, this.t / 8) * (this.t > m.len - 6 ? Math.max(0, (m.len - this.t) / 6) : 1);
    const C = this.colors;
    fx.keep(this.id, 'orb', p.x, p.y, p.z, { scale: 0.25 + 1.0 * grow, color: C.orb, order: 8, glow: 0.9 });
    fx.keep(this.id + 'g', 'glow', p.x, p.y, p.z, { scale: 0.4 + 2.2 * grow, color: C.glow, opacity: 0.5, order: 3, glow: 1 });
    if (this.t % 4 === 0) fx.spawn('ring', p.x, p.y, p.z, { scale: 1.8 * grow, color: C.ring, glow: 0.8, life: 0.2, fade: true, order: 7 });
    if (this.t % 2 === 0) {
      const a = Math.random() * Math.PI * 2, r = 2.2;
      const sx = p.x + dmath.cos(a) * r, sy = p.y + dmath.sin(a) * r * 0.6, sz = p.z + dmath.sin(a * 1.7) * 0.5;
      fx.spawn('star', sx, sy, sz, { scale: 0.2, frame: 2, vel: [(p.x - sx) * 5, (p.y - sy) * 5, (p.z - sz) * 5], life: 0.2, color: 0xbfe4ff, order: 9, glow: 1.5 });
    }
    // drag the opponent toward the core
    const canPull = !o.ko && !o.hidden && o.state !== 'down' && o.state !== 'getup';
    const dx = p.x - o.pos.x, dz = p.z - o.pos.z, dy = p.y - 0.8 - o.pos.y;
    const d = dmath.hypot(dx, dz, dy) || 1;
    const dir = new THREE.Vector2(-dx, -dz);
    if (this.fixed || dir.lengthSq() < 0.01) dir.set(this.owner.face.x, this.owner.face.y); // grind pops them away
    dir.normalize();
    if (canPull && d < m.radius) {
      const k = m.pull * Math.min(1, d / 0.6);
      o.vel.x = (dx / d) * k;
      o.vel.z = (dz / d) * k;
      if (o.air || dy > 0.3) {
        o.vel.y = (dy / d) * k;
        o.air = true;
      }
      if (this.t % m.tick === 0 && o.hittable) o.takeHit(this.owner, { ...m.tickHit, projectileHit: true, lock: m.tick + 3 }, dir);
    }
    if (this.t >= m.len) {
      if (canPull && d < 1.8 && o.hittable) o.takeHit(this.owner, { ...m.pop, projectileHit: true }, dir);
      fx.explosion(p.x, p.y, p.z, new THREE.Color(0x6ab4ff));
      if (p.y < 2.5) fx.ground.impact(p, { kind: 'vortex', style: m.ground, tint: this.colors.glow });
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
