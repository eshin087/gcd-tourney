import * as THREE from 'three';
import { bakeVfx } from '../art/vfxPainter.js';
import { loadImage } from './sprites.js';
import { fetchAtlasJson, artUrl } from '../core/artIndex.js';
import { VFX_PPU as PPU, RING_TOP, ARENA_LIMIT } from './constants.js';
import { GroundDamage } from './ground.js';
import { Sigils } from './sigil.js';

const VERT = /* glsl */ `
  uniform vec4 uvRect;
  varying vec2 vUv;
  void main() {
    vUv = mix(uvRect.xy, uvRect.zw, uv);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`;
// glow > 0 pushes the color above 1.0 so the bloom pass picks it up
const FRAG = /* glsl */ `
  uniform sampler2D map;
  uniform vec3 color;
  uniform float opacity;
  uniform float glow;
  varying vec2 vUv;
  void main() {
    vec4 c = texture2D(map, vUv);
    if (c.a < 0.08) discard;
    gl_FragColor = vec4(c.rgb * color * (1.0 + glow), c.a * opacity);
    #include <colorspace_fragment>
  }`;

const qz = new THREE.Quaternion();
const shellLooks = new WeakMap(); // a power-up's `shell` data -> the same with its colors resolved (Effects.modeShell)
const zAxis = new THREE.Vector3(0, 0, 1);

function hexTexture() {
  const c = document.createElement('canvas');
  c.width = 64; c.height = 64;
  const g = c.getContext('2d');
  g.strokeStyle = '#ffffff';
  g.lineWidth = 2;
  const r = 9, h = r * Math.sqrt(3);
  for (let row = -1; row < 6; row++) {
    for (let col = -1; col < 6; col++) {
      const x = col * r * 1.5, y = row * h + (col % 2 ? h / 2 : 0);
      g.beginPath();
      for (let k = 0; k < 6; k++) {
        const a = (k / 6) * Math.PI * 2;
        g.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
      }
      g.closePath();
      g.stroke();
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.magFilter = t.minFilter = THREE.NearestFilter;
  t.generateMipmaps = false;
  return t;
}

export class Effects {
  constructor(scene) {
    this.scene = scene;
    const { canvas, meta } = bakeVfx();
    this.meta = meta;
    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    tex.generateMipmaps = false;
    tex.colorSpace = THREE.SRGBColorSpace;
    this.tex = tex;
    this.W = canvas.width;
    this.H = canvas.height;
    this.geoC = new THREE.PlaneGeometry(1, 1);
    this.geoB = new THREE.PlaneGeometry(1, 1).translate(0, 0.5 - 4 / 64, 0);
    this.barrierGeo = new THREE.PlaneGeometry(4.5, 3); // shared by every wall-bounce flash
    this.items = [];
    this.keepers = new Map();
    this.rocks = [];
    this.walls = [];
    this.hexTex = hexTexture();
    this.rockGeo = new THREE.DodecahedronGeometry(1, 0);
    this.rockMats = ['#cdb9a2', '#b9a28a', '#e0d0bb'].map((c) => new THREE.MeshLambertMaterial({ color: c, flatShading: true }));
    this.overlay = new Overlay();
    this.cellWorld = meta.cell / PPU;
    this.camFwd = new THREE.Vector3(0, 0, -1);
    this.ground = new GroundDamage(scene, this); // craters, cracks, scorches, wall marks (ADR 0024)
    this.sigils = new Sigils(scene); // Sharingan / Mangekyō behind an eye technique (ADR 0035)
  }

  // Swap in hand-made effects from public/vfx/atlas.{png,json} (`npm run sprites vfx`: approved effects only;
  // ?art=custom prefers the unapproved candidates in public/preview/vfx/). Effects missing from the custom atlas
  // keep their procedural frames (upscaled). The signature effects (ADR 0044) come from a second page, atlas.json's
  // `hd` block (256 px cells at twice the density, the same world size per cell): `this.hd`, used per effect.
  async loadCustom() {
    try {
      const found = await fetchAtlasJson('/vfx');
      if (!found) return false;
      const { data: cm, dir } = found;
      if (!cm.anims) {
        console.warn('[vfx] atlas.json has no "anims", keeping procedural effects');
        return false;
      }
      const img = await loadImage(artUrl(`${dir}/atlas.png`));
      if (!img) {
        console.warn('[vfx] atlas.json found but atlas.png is missing or unreadable, keeping procedural effects');
        return false;
      }
      const pm = this.meta, proc = this.tex.image;
      const cell = cm.cell || 128;
      const hd = cm.hd?.anims ? await this.loadHd(cm.hd, dir) : null;
      const names = [...new Set([...Object.keys(pm.anims), ...Object.keys(cm.anims)])].filter((n) => !hd?.anims[n]);
      const cols = Math.max(...names.map((n) => (cm.anims[n] || pm.anims[n]).n));
      const cv = document.createElement('canvas');
      cv.width = cols * cell;
      cv.height = names.length * cell;
      const ctx = cv.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      const meta = { cell, cols, rows: names.length, anims: {} };
      const custom = [];
      names.forEach((name, row) => {
        const c = cm.anims[name], p = pm.anims[name];
        if (c) {
          ctx.drawImage(img, 0, c.row * cell, c.n * cell, cell, 0, row * cell, c.n * cell, cell);
          meta.anims[name] = { row, n: c.n, ms: c.ms ?? p?.ms ?? 40 };
          custom.push(name);
        } else {
          ctx.drawImage(proc, 0, p.row * pm.cell, p.n * pm.cell, pm.cell, 0, row * cell, p.n * cell, cell);
          meta.anims[name] = { row, n: p.n, ms: p.ms };
        }
      });
      // keep the same world size: custom cells use their own ppu, upscaled procedural ones match it
      this.cellWorld = cell / (cm.ppu || (cell * PPU) / pm.cell);
      if (hd) {
        for (const [name, a] of Object.entries(hd.anims)) meta.anims[name] = { row: a.row, n: a.n, ms: a.ms ?? 40, hd: true };
        this.hd = hd;
        custom.push(...Object.keys(hd.anims).map((n) => `${n} (HD)`));
      }
      this.meta = meta;
      this.W = cv.width;
      this.H = cv.height;
      this.tex.image = cv;
      this.tex.needsUpdate = true;
      console.info(`[vfx] custom effects${dir === '/vfx' ? '' : ' (candidates)'}: ${custom.join(', ') || 'none'}`);
      return true;
    } catch (e) {
      console.warn('[vfx] custom atlas failed, keeping procedural effects', e);
      return false;
    }
  }

  // The HD page of atlas.json (ADR 0044). A missing or unreadable image keeps those effects procedural.
  async loadHd(h, dir) {
    const img = await loadImage(artUrl(`${dir}/${h.image || 'atlas_hd.png'}`));
    if (!img) {
      console.warn('[vfx] atlas.json lists HD effects but their page is missing or unreadable, keeping them procedural');
      return null;
    }
    const tex = new THREE.Texture(img);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    tex.generateMipmaps = false;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    const cell = h.cell || 256;
    return { tex, cell, W: img.width, H: img.height, cellWorld: cell / (h.ppu || 112), anims: h.anims };
  }

  // the page an effect is drawn from: the HD signature page or the shared one
  sheet(a) {
    return a?.hd && this.hd ? this.hd : this;
  }

  uv(name, i, out) {
    const a = this.meta.anims[name];
    const S = this.sheet(a);
    i = Math.max(0, Math.min(i | 0, a.n - 1));
    const c = S === this ? this.meta.cell : S.cell, e = 0.02;
    out.set((i * c + e) / S.W, 1 - ((a.row + 1) * c - e) / S.H, ((i + 1) * c - e) / S.W, 1 - (a.row * c + e) / S.H);
    return out;
  }

  spawn(name, x, y, z, o = {}) {
    const a = this.meta.anims[name];
    const S = this.sheet(a);
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        map: { value: S.tex },
        uvRect: { value: new THREE.Vector4() },
        color: { value: new THREE.Color(o.color ?? 0xffffff) },
        opacity: { value: o.opacity ?? 1 },
        glow: { value: o.glow ?? 0 },
      },
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      depthTest: o.depthTest ?? true,
      blending: o.additive ? THREE.AdditiveBlending : THREE.NormalBlending,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(o.bottom ? this.geoB : this.geoC, mat);
    mesh.renderOrder = o.order ?? 5;
    const s = S.cellWorld * (o.scale ?? 1);
    mesh.scale.set(s * (o.flipX ? -1 : 1), s, s);
    mesh.position.set(x, y + RING_TOP, z);
    this.scene.add(mesh);
    const ms = o.ms ?? a.ms;
    const it = {
      mesh, mat, name, a, t: 0, ms, cellWorld: S.cellWorld,
      loop: !!o.loop,
      life: o.life ?? (a.n * ms) / 1000,
      vel: o.vel ? new THREE.Vector3(...o.vel) : null,
      grav: o.grav ?? 0,
      rot: o.rot ?? 0,
      spin: o.spin ?? 0,
      fade: o.fade ?? false,
      grow: o.grow ?? 0,
      base: s,
      frame: o.frame ?? -1,
      opacity: o.opacity ?? 1,
      follow: o.follow ?? null,
      random: !!o.random,
      stretch: o.stretch ?? 1,
      seq: o.seq ?? null, // frames played in this order, one per `ms`, then it ends (a strip with a held loop inside)
    };
    if (it.seq) it.life = (it.seq.length * ms) / 1000;
    it.max = it.life;
    if (it.stretch !== 1) mesh.scale.x *= it.stretch;
    this.uv(name, 0, mat.uniforms.uvRect.value);
    this.items.push(it);
    return it;
  }

  kill(it) {
    it.life = -1;
  }

  // persistent effect keyed by id, refreshed every frame by its owner
  keep(id, name, x, y, z, o = {}) {
    let it = this.keepers.get(id);
    if (!it || it.life < 0) {
      it = this.spawn(name, x, y, z, { ...o, loop: true, life: 999 });
      this.keepers.set(id, it);
    }
    it.mesh.position.set(x, y + RING_TOP, z);
    if (o.scale != null) {
      const s = it.cellWorld * o.scale;
      it.base = s;
      it.mesh.scale.set(o.flipX ? -s : s, s, s);
    }
    if (o.color != null) it.mat.uniforms.color.value.set(o.color);
    if (o.opacity != null) it.mat.uniforms.opacity.value = o.opacity;
    if (o.glow != null) it.mat.uniforms.glow.value = o.glow;
    it.seenAt = performance.now();
    return it;
  }

  drop(id) {
    const it = this.keepers.get(id);
    if (it) { it.life = -1; this.keepers.delete(id); }
  }

  update(dt, camera) {
    camera.getWorldDirection(this.camFwd);
    this.sigils.update(dt, camera, this.camFwd);
    const now = performance.now();
    for (const [id, it] of this.keepers) {
      if (now - it.seenAt > 90) { it.life = -1; this.keepers.delete(id); }
    }
    for (let i = this.items.length - 1; i >= 0; i--) {
      const it = this.items[i];
      it.t += dt;
      if (it.life !== 999) it.life -= dt;
      if (it.life <= 0) {
        this.scene.remove(it.mesh);
        it.mat.dispose();
        this.items.splice(i, 1);
        continue;
      }
      if (it.follow) {
        const p = it.follow();
        if (p) it.mesh.position.set(p.x, p.y + RING_TOP, p.z);
      }
      if (it.vel) {
        it.vel.y -= it.grav * dt;
        it.mesh.position.addScaledVector(it.vel, dt);
      }
      let f;
      if (it.seq) f = it.seq[Math.min(it.seq.length - 1, Math.floor((it.t * 1000) / it.ms))];
      else if (it.frame >= 0) f = it.frame;
      else if (it.random) f = Math.floor(Math.random() * it.a.n);
      else {
        f = Math.floor((it.t * 1000) / it.ms);
        f = it.loop ? f % it.a.n : Math.min(it.a.n - 1, f);
      }
      this.uv(it.name, f, it.mat.uniforms.uvRect.value);
      if (it.fade) it.mat.uniforms.opacity.value = it.opacity * Math.min(1, it.life / (it.max * 0.6));
      if (it.grow) {
        const s = it.base * (1 + it.grow * it.t);
        it.mesh.scale.set(Math.sign(it.mesh.scale.x) * s * it.stretch, s, s);
      }
      it.rot += it.spin * dt;
      qz.setFromAxisAngle(zAxis, it.rot);
      it.mesh.quaternion.copy(camera.quaternion).multiply(qz);
    }
    for (let i = this.rocks.length - 1; i >= 0; i--) {
      const r = this.rocks[i];
      r.life -= dt;
      r.vel.y -= 30 * dt;
      r.mesh.position.addScaledVector(r.vel, dt);
      r.mesh.rotation.x += r.spin.x * dt;
      r.mesh.rotation.z += r.spin.z * dt;
      const floor = Math.abs(r.mesh.position.x) < ARENA_LIMIT + 0.4 && Math.abs(r.mesh.position.z) < ARENA_LIMIT + 0.4 ? RING_TOP : 0;
      if (r.mesh.position.y < floor + r.size) {
        r.mesh.position.y = floor + r.size;
        r.vel.y = Math.abs(r.vel.y) * 0.35;
        r.vel.x *= 0.6; r.vel.z *= 0.6;
        r.spin.multiplyScalar(0.6);
      }
      if (r.life < 0.6) r.mesh.scale.setScalar(r.size * Math.max(0.01, r.life / 0.6));
      if (r.life <= 0) {
        this.scene.remove(r.mesh);
        this.rocks.splice(i, 1);
      }
    }
    for (let i = this.walls.length - 1; i >= 0; i--) {
      const w = this.walls[i];
      w.life -= dt;
      w.mesh.material.opacity = Math.max(0, w.life / w.max) * 0.85;
      w.mesh.scale.setScalar(1 + (1 - w.life / w.max) * 0.25);
      if (w.life <= 0) {
        this.scene.remove(w.mesh);
        w.mesh.material.dispose();
        this.walls.splice(i, 1);
      }
    }
    this.ground.update(dt);
    this.overlay.update(dt);
  }

  clearAll() {
    // life -1: a handle someone still holds (a charge emitter's live list) reads as dead instead of frozen alive
    for (const it of this.items) { it.life = -1; this.scene.remove(it.mesh); it.mat.dispose(); }
    this.items.length = 0;
    this.keepers.clear();
    this.ground.clear();
    this.sigils.clear();
    for (const r of this.rocks) this.scene.remove(r.mesh);
    this.rocks.length = 0;
    for (const w of this.walls) {
      this.scene.remove(w.mesh);
      w.mesh.material.dispose();
    }
    this.walls.length = 0;
    this.overlay.reset();
  }

  // ------------------------------------------------------------ recipes
  // Lightning strike column (Thunderbolt slam, Whirlwind finish)
  thunder(x, z, color = 0xd8f0ff) {
    for (let i = 0; i < 6; i++) {
      this.spawn('lightning', x + (Math.random() - 0.5) * 0.3, 0.3 + i, z, { scale: 1.25, random: true, life: 0.22, color, rot: Math.random() * 6.28, order: 9, glow: 2.2 });
    }
    this.spawn('streak', x, 0, z, { bottom: true, scale: 3.5, color, life: 0.25, glow: 2, order: 8 });
    this.spawn('glow', x, 0.4, z, { scale: 3, color, opacity: 0.8, life: 0.3, fade: true, glow: 1.5 });
    this.ring({ x, z }, color, 1.6);
    this.overlay.flash('#e8f6ff', 0.5);
  }

  dust(pos, scale = 1) {
    for (let k = 0; k < 2; k++) {
      this.spawn('dust', pos.x + (Math.random() - 0.5) * 0.5, Math.min(0, pos.y), pos.z + (Math.random() - 0.5) * 0.3, {
        bottom: true, scale: scale * (0.7 + Math.random() * 0.4), flipX: Math.random() < 0.5, opacity: 0.9,
      });
    }
  }

  // DBFZ-ish layered hit: crescent slash + star flare + radial lines (+ burst & ring for heavy)
  hit(x, y, z, kind = 'light', color = 0xffffff) {
    const top = { depthTest: false, order: 8 };
    if (kind === 'light') {
      this.spawn('spark', x, y, z, { ...top, scale: 0.7, rot: Math.random() * Math.PI * 2, color, glow: 0.35 });
      this.spawn('star', x, y, z, { ...top, scale: 0.5, color: 0xfff6c8, glow: 0.6 });
      this.spawn('lines', x, y, z, { ...top, scale: 0.75, color: 0xffffff, glow: 0.1, rot: Math.random() * 6 });
    } else if (kind === 'heavy') {
      this.spawn('spark', x, y, z, { ...top, scale: 0.9, rot: Math.random() * Math.PI * 2, color, glow: 0.45 });
      this.spawn('burst', x, y, z, { ...top, order: 7, scale: 0.75, rot: Math.random() * 6, color: 0xfff0b0, glow: 0.25 });
      this.spawn('lines', x, y, z, { ...top, scale: 1.1, color: 0xffffff, glow: 0.2, rot: Math.random() * 6 });
      this.spawn('ring', x, y, z, { ...top, order: 7, scale: 1.0, color: 0xffd27a, glow: 0.3 });
      this.spawn('star', x, y, z, { ...top, scale: 0.7, color: 0xffffff, glow: 0.9 });
    } else {
      // smash: brief white flash
      this.spawn('glow', x, y, z, { ...top, order: 6, scale: 1.0, color: 0xffffff, glow: 0.6, life: 0.12, fade: true, grow: 3 });
      this.spawn('burst', x, y, z, { ...top, order: 7, scale: 1.1, rot: Math.random() * 6, color: 0xffe8a0, glow: 0.35 });
      this.spawn('burst', x, y, z, { ...top, order: 8, scale: 0.65, rot: Math.random() * 6, color: 0xffffff, glow: 0.6 });
      this.spawn('lines', x, y, z, { ...top, scale: 1.5, color: 0xffffff, glow: 0.3, rot: Math.random() * 6 });
      this.spawn('ring', x, y, z, { ...top, order: 7, scale: 1.4, color: 0xffcf6a, glow: 0.4 });
      this.spawn('star', x, y, z, { ...top, scale: 1.0, color: 0xffffff, glow: 1.2 });
    }
    const n = kind === 'light' ? 3 : kind === 'heavy' ? 5 : 8;
    for (let k = 0; k < n; k++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 2.5 + Math.random() * (kind === 'smash' ? 5 : 3);
      this.spawn('star', x, y, z, { ...top, scale: 0.2, vel: [Math.cos(a) * sp, Math.sin(a) * sp + 1.5, (Math.random() - 0.5) * sp], grav: 12, life: 0.26, frame: 2, color: 0xfff2b0, glow: 0.8 });
    }
  }

  // MELEE CLASH (ADR 0038): two strikes meeting. A crisp contact star, sparks and arcs in both fighters' colors
  // sprayed out of the contact point, a thin shockwave ring and speed lines; no white glow, so the frozen strikes
  // stay readable. `power` grows the spray with the chain.
  clashSpark(x, y, z, colA, colB, power = 1) {
    const top = { depthTest: false, order: 8 };
    this.spawn('star', x, y, z, { ...top, scale: 0.42 * power, color: 0xfff6e0, glow: 0.35 });
    for (const col of [colA, colB]) {
      this.spawn('spark', x, y, z, { ...top, scale: 0.6 * power, rot: Math.random() * Math.PI * 2, color: col, glow: 0.3 });
      this.spawn('arc', x, y, z, { ...top, order: 7, scale: 0.7 * power, rot: Math.random() * Math.PI * 2, color: col, glow: 0.25, opacity: 0.85 });
    }
    this.spawn('ring', x, y, z, { ...top, order: 7, scale: 0.45, color: 0xf4f0ff, glow: 0.1, opacity: 0.75, grow: 4.5 * power, fade: true, life: 0.32 });
    this.spawn('lines', x, y, z, { ...top, scale: 0.8 * power, color: 0xffffff, opacity: 0.35, rot: Math.random() * 6 });
    const n = Math.round(6 + 3 * power);
    for (let k = 0; k < n * 2; k++) {
      const a = Math.random() * Math.PI * 2, sp = 3 + Math.random() * 4 * power;
      this.spawn('star', x, y, z, {
        ...top, scale: 0.16 + Math.random() * 0.08, vel: [Math.cos(a) * sp, Math.sin(a) * sp * 0.8 + 1.5, (Math.random() - 0.5) * sp],
        grav: 10, life: 0.3 + Math.random() * 0.15, frame: 2, color: k % 2 ? colA : colB, glow: 0.45,
      });
    }
  }

  // backwards-compatible helper
  hitSpark(x, y, z, big = false, color = 0xffffff) {
    this.hit(x, y, z, big ? 'heavy' : 'light', color);
  }

  blockSpark(x, y, z) {
    this.spawn('ring', x, y, z, { scale: 0.85, color: 0x9ad0ff, depthTest: false, order: 8, glow: 0.8 });
    this.spawn('star', x, y, z, { scale: 0.6, color: 0xc8e6ff, depthTest: false, order: 8, glow: 1.2 });
    this.spawn('lines', x, y, z, { scale: 0.7, color: 0xbfe2ff, depthTest: false, order: 8, glow: 0.4 });
  }

  bigImpact(x, y, z, color) {
    this.hit(x, y, z, 'smash', color);
    this.spawn('ring', x, 0.1, z, { scale: 2.2, color: 0xffffff, order: 6, ms: 50 });
  }

  ring(pos, color, scale = 1, y = 0.05) {
    this.spawn('ring', pos.x, y, pos.z, { scale: 1.2 * scale, color, opacity: 0.9, glow: 0.3 });
  }

  burstAt(f, color, scale = 1) {
    this.spawn('burst', f.pos.x, f.pos.y + 0.8, f.pos.z, { scale: 0.9 * scale, color, depthTest: false, order: 7, glow: 1 });
    this.spawn('ring', f.pos.x, f.pos.y + 0.8, f.pos.z, { scale: 1.3 * scale, color, depthTest: false, order: 7, glow: 1 });
  }

  dashBurst(f, big = false) {
    this.spawn('ring', f.pos.x, f.pos.y + 0.12, f.pos.z, { scale: big ? 1.3 : 0.9, color: 0xffffff, opacity: 0.9, glow: 0.4 });
    if (big) {
      this.spawn('lines', f.pos.x, f.pos.y + 0.7, f.pos.z, { scale: 1.2, color: f.def.color, glow: 0.8, depthTest: false, order: 7 });
      this.spawn('burst', f.pos.x, f.pos.y + 0.7, f.pos.z, { scale: 0.7, color: f.def.color, glow: 1, depthTest: false, order: 7 });
    }
  }

  smoke(x, y, z, scale = 1) {
    this.spawn('smoke', x, y, z, { scale: 1.1 * scale, flipX: Math.random() < 0.5 });
  }

  // a beam clash's finish (ADR 0034): a heavy hit in the side's color without the smash's white flash, and less smoke,
  // so the loser still reads as they fly
  clashBlast(x, y, z, color) {
    this.spawn('glow', x, y, z, { scale: 0.8, color, life: 0.3, fade: true, grow: 1.4, depthTest: false, order: 6, opacity: 0.7, glow: 0.4 });
    this.hit(x, y, z, 'heavy', color);
    this.spawn('ring', x, 0.1, z, { scale: 1.6, color, order: 6, ms: 50, glow: 0.3 });
    for (let k = 0; k < 3; k++) this.smoke(x + (Math.random() - 0.5) * 1.2, y * 0.4 + Math.random() * 0.4, z + (Math.random() - 0.5) * 1.2, 0.7);
  }

  // a held technique that won a beam clash against a stream from the air bursts up the line into them (ADR 0034): a few
  // copies of it racing from the hand to the target, the lead one biggest
  techBlast(kind, from, to, color) {
    const name = kind === 'chidori' ? 'lightning' : kind === 'kiFist' ? 'glow' : 'orb';
    const life = 0.12, vel = [(to.x - from.x) / life, (to.y - from.y) / life, (to.z - from.z) / life];
    for (let k = 0; k < 3; k++) {
      this.spawn(name, from.x, from.y, from.z, { scale: 0.75 - k * 0.18, vel, life: life + k * 0.03, color: kind === 'rasengan' || kind === 'rasenshuriken' ? 0xffffff : color, random: name === 'lightning', order: 8, glow: 0.6, depthTest: false });
    }
    this.spawn('ring', to.x, to.y, to.z, { scale: 1.1, color, depthTest: false, order: 8, glow: 0.5 });
  }

  explosion(x, y, z, color = 0xffb040) {
    this.spawn('glow', x, y, z, { scale: 1.3, color, life: 0.4, fade: true, grow: 1.6, depthTest: false, order: 6, opacity: 0.9, glow: 0.7 });
    this.bigImpact(x, y, z, color);
    for (let k = 0; k < 5; k++) this.smoke(x + (Math.random() - 0.5) * 1.6, y * 0.5 + Math.random() * 0.6, z + (Math.random() - 0.5) * 1.6, 1.1);
  }

  debris(x, z, n = 8, power = 1) {
    for (let k = 0; k < n; k++) {
      const size = 0.05 + Math.random() * 0.09;
      const m = new THREE.Mesh(this.rockGeo, this.rockMats[k % 3]);
      m.scale.setScalar(size);
      m.position.set(x + (Math.random() - 0.5) * 0.6, RING_TOP + 0.1, z + (Math.random() - 0.5) * 0.6);
      m.castShadow = true;
      this.scene.add(m);
      const a = Math.random() * Math.PI * 2;
      const sp = (2 + Math.random() * 4) * power;
      this.rocks.push({
        mesh: m, size, life: 1.6 + Math.random() * 0.8,
        vel: new THREE.Vector3(Math.cos(a) * sp, (5 + Math.random() * 6) * power, Math.sin(a) * sp),
        spin: new THREE.Vector3((Math.random() - 0.5) * 20, 0, (Math.random() - 0.5) * 20),
      });
    }
    while (this.rocks.length > 60) this.scene.remove(this.rocks.shift().mesh);
  }

  // Hexagonal ki barrier flash where a fighter slams into the ring boundary.
  barrier(pos, axis, sign, color = '#7ad8ff') {
    const mat = new THREE.MeshBasicMaterial({ map: this.hexTex, color: new THREE.Color(color).multiplyScalar(1.8), transparent: true, opacity: 0.85, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending });
    const m = new THREE.Mesh(this.barrierGeo, mat);
    this.hexTex.repeat.set(3, 2);
    if (axis === 'x') { m.rotation.y = Math.PI / 2; m.position.set(sign * (ARENA_LIMIT + 0.35), RING_TOP + pos.y + 0.9, pos.z); }
    else m.position.set(pos.x, RING_TOP + pos.y + 0.9, sign * (ARENA_LIMIT + 0.35));
    m.renderOrder = 6;
    this.scene.add(m);
    this.walls.push({ mesh: m, life: 0.45, max: 0.45 });
  }

  // A plain crater (ground.js picks tier, look and size, on the ring or in the grass off its edge; call fx.ground
  // directly for force and style)
  crater(pos) {
    return this.ground.impact(pos, { kind: 'crater' });
  }

  // a ring of rolling dust walls around a big impact (y: the floor, fighter space)
  dustRing(pos, r = 1, n = 10, y = 0) {
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2 + Math.random() * 0.4, sp = 1.4 + Math.random() * 1.4;
      // low and small (about half a body wide each), so the ring frames the fighter instead of hiding them
      this.spawn('dustWave', pos.x + Math.cos(a) * r, y, pos.z + Math.sin(a) * r, {
        bottom: true, scale: 0.36 + Math.random() * 0.2, flipX: Math.random() < 0.5, vel: [Math.cos(a) * sp, 0, Math.sin(a) * sp], opacity: 0.9,
      });
    }
  }

  // Charging aura: flame tongues + light streaks + glow, tinted per character.
  // `front`: the share of flames drawn in front of the body (a power-up keeps them behind, so the fighter reads).
  // Under half power (a beam clash's thin aura) a frame may spawn no flame and never a light streak.
  auraTick(f, power = 1, camRight, front = 0.2) {
    // a mode can recolor the aura (Nine-Tails Cloak burns red-orange)
    const c = new THREE.Color(f.mode?.auraColor ?? f.def.color);
    const core = new THREE.Color().setRGB(...(f.mode?.auraCore ?? f.def.auraCore));
    const back = this.camFwd;
    const p = f.renderPos || f.pos;
    const count = Math.random() < power % 1 ? Math.ceil(power) : Math.floor(power);
    for (let k = 0; k < Math.max(power >= 0.5 ? 1 : 0, count); k++) {
      const off = (Math.random() - 0.5) * 1.15;
      const ahead = Math.random() < front;
      const d = ahead ? -0.25 : 0.35;
      this.spawn('flame', p.x + camRight.x * off + back.x * d, p.y - 0.05 + Math.random() * 0.2, p.z + camRight.z * off + back.z * d, {
        bottom: true, scale: (ahead ? 0.4 : 0.55) + Math.random() * 0.28, color: Math.random() < 0.35 ? core : c, vel: [0, 1.3, 0], opacity: ahead ? 0.5 : 0.8, order: ahead ? 4 : 1, glow: 0.12,
      });
    }
    if (power >= 0.5 && Math.random() < 0.6 * power) {
      const off = (Math.random() - 0.5) * 1.6;
      this.spawn('streak', p.x + camRight.x * off + back.x * 0.2, p.y, p.z + camRight.z * off + back.z * 0.2, { bottom: true, scale: 0.7 + Math.random() * 0.35, color: core, vel: [0, 2.6, 0], order: front > 0.1 ? 4 : 1, glow: 0.35 });
    }
    if (Math.random() < 0.3 * power) {
      const a = Math.random() * Math.PI * 2;
      this.spawn('star', p.x + Math.cos(a) * 0.9, 0.05, p.z + Math.sin(a) * 0.6, { scale: 0.18, frame: 2, vel: [0, 3 + Math.random() * 2, 0], color: 0xb8a48c, life: 0.6 });
    }
    this.keep('aura' + f.index, 'glow', p.x + back.x * 0.4, p.y + 0.8, p.z + back.z * 0.4, { scale: 1.1 + Math.sin(performance.now() * 0.02) * 0.06, color: c, opacity: 0.28 * Math.min(1, power), order: 1, glow: 0.25 });
  }

  // Signature move hand effects. `quiet`: held into a beam clash, where its halo would cover the holder; `pos`: where
  // the clash holds it (the struggle line), instead of the frame's hand (ADR 0034)
  handTick(f, kind, phase, prog, quiet = false, pos = null) {
    const halo = quiet ? 0.45 : 1;
    const fx = f.face.x, fz = f.face.y;
    const P = f.renderPos || f.pos;
    // an art pack's drawn palm (anims.json `hand` / hit box) wins over the placeholder's tuned offsets
    const H = f.actor?.hand?.();
    // the body draws scaled by depthK about its feet (SpriteActor.syncDepth, ENG-067), so the held effect scales its
    // offset and size with it to stay on the drawn palm; visual only, these positions never feed the simulation
    const k = f.actor?.depthK ?? 1;
    const at = (fwd, up) => (pos ? pos : H ? { x: P.x + fx * H.x * k, y: P.y + H.y * k, z: P.z + fz * H.x * k } : { x: P.x + fx * fwd * k, y: P.y + up * k, z: P.z + fz * fwd * k });
    if (kind === 'rasengan') {
      // formed in his palm through most of the startup (rasenganForm), then the spinning sphere (ENG-SKL-NAR)
      const p = at(0.6, 0.72);
      const forming = phase === 0 && prog < 0.6 && !quiet;
      if (forming) {
        this.drop('hand' + f.index);
        const it = this.keep('handForm' + f.index, 'rasenganForm', p.x, p.y, p.z, { scale: 0.5 * k, order: 9, glow: 0.4 });
        it.frame = Math.min(it.a.n - 1, Math.floor((prog / 0.6) * it.a.n));
      } else {
        this.drop('handForm' + f.index);
        this.keep('hand' + f.index, 'rasengan', p.x, p.y, p.z, { scale: 0.5 * k, order: 9, glow: 0.45 });
      }
      const s = (forming ? 0.2 + prog * 0.3 : 0.45) * k;
      this.keep('handGlow' + f.index, 'glow', p.x, p.y, p.z, { scale: s, color: 0x8ac8ff, opacity: 0.3 * halo, order: 3, glow: 0.8 });
      if (Math.random() < 0.3) this.spawn('star', p.x, p.y, p.z, { scale: 0.18, frame: 2, vel: [(Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3], life: 0.2, color: 0xbfe4ff, order: 9, glow: 1.5 });
    } else if (kind === 'rasenshuriken') {
      // the wind shuriken: four blades spinning round a Rasengan core, held high in startup and thrust forward in active
      const p = phase === 0 ? at(0.25, 1.55) : at(0.7, 0.8);
      const s = (phase === 0 ? 0.25 + prog * 0.4 : 0.65) * k;
      this.keep('hand' + f.index, 'rasenshuriken', p.x, p.y, p.z, { scale: s, order: 9, glow: 0.15 });
      this.keep('handGlow' + f.index, 'glow', p.x, p.y, p.z, { scale: s * 0.9, color: 0x8ac8ff, opacity: 0.25 * halo, order: 3, glow: 0.4 });
      if (Math.random() < 0.35) {
        const a = Math.random() * Math.PI * 2;
        this.spawn('streak', p.x + Math.cos(a) * s * 1.2, p.y + Math.sin(a) * s * 0.6, p.z, { scale: 0.3, color: 0xe8f6ff, vel: [-Math.sin(a) * 6, Math.cos(a) * 3, 0], life: 0.1, order: 8, glow: 0.8 });
      }
    } else if (kind === 'kiFist') {
      // Dragon Fist (Goku): golden ki wrapped round the fist, drawn back in startup and driven forward in active
      const p = phase === 0 ? at(-0.2, 0.8) : at(0.7, 0.85);
      const s = (phase === 0 ? 0.3 + prog * 0.4 : 0.75) * k;
      this.keep('handGlow' + f.index, 'glow', p.x, p.y, p.z, { scale: s * 1.5, color: 0xffd84a, opacity: 0.55 * halo, order: 3, glow: 1 });
      if (Math.random() < 0.5) this.spawn('flame', p.x, p.y - 0.2, p.z, { bottom: true, scale: 0.3 * s, color: 0xffd84a, vel: [0, 1.6, 0], opacity: 0.8, order: 8, glow: 0.6 });
    } else if (kind === 'chidori') {
      // the thousand birds (ENG-SKL-SAS): it crackles to life in his gripped hand through most of the startup
      // (chidoriForm), then the HD knot rides the drawn palm; a small glow only, the art carries the light (the old
      // 128 px lightning tile under a big glow read as a white blob)
      const p = phase === 2 ? at(0.7, 0.78) : at(-0.5, 0.32);
      const forming = phase === 0 && prog < 0.6 && !quiet;
      const flip = f.side < 0; // drawn trailing screen-left: mirrored when he faces screen-left
      if (forming) {
        this.drop('hand' + f.index);
        const it = this.keep('handForm' + f.index, 'chidoriForm', p.x, p.y, p.z, { scale: 0.55 * k, order: 9, glow: 0.4, flipX: flip });
        it.frame = Math.min(it.a.n - 1, Math.floor((prog / 0.6) * it.a.n));
      } else {
        this.drop('handForm' + f.index);
        this.keep('hand' + f.index, 'chidori', p.x, p.y, p.z, { scale: (quiet ? 0.4 : 0.55) * k, order: 9, glow: quiet ? 0.3 : 0.5, flipX: flip });
      }
      this.keep('handGlow' + f.index, 'glow', p.x, p.y, p.z, { scale: (forming ? 0.3 + prog * 0.4 : 0.6) * k, color: 0x5aa8ff, opacity: 0.28 * halo, order: 3, glow: 0.6 });
      if (Math.random() < (quiet ? 0.2 : 0.45)) {
        const a = Math.random() * Math.PI * 2;
        this.spawn('arc', p.x + Math.cos(a) * 0.25, p.y + Math.sin(a) * 0.2, p.z, { scale: 0.3, life: 0.08, color: 0xe8f7ff, rot: a, order: 9, glow: quiet ? 0.8 : 1.4 });
      }
      // the run with the hand dragged low behind him (the strip's run frames): it tears a trench in the floor and
      // throws up sparks and chips where it touches
      const T = f.move?.trench;
      if (T && phase === 1 && !f.moveHit && !quiet && p.y - P.y < 0.6 && (p.x - P.x) * fx + (p.z - P.z) * fz < 0.1) {
        const g = { x: p.x, y: 0, z: p.z };
        this.ground.trail('trench' + f.index, g, { x: fx, z: fz }, 0.32, T, f.move.color);
        if (Math.random() < 0.5) this.spawn('spark', g.x, 0.08, g.z, { scale: 0.35, rot: Math.random() * 6.28, color: 0xbfe8ff, glow: 0.8, order: 8 });
        if (Math.random() < 0.25) this.spawn('dust', g.x - fx * 0.2, 0, g.z - fz * 0.2, { bottom: true, scale: 0.35, opacity: 0.7, order: 6 });
      }
    } else if (this.meta.anims[kind]) {
      // any other effect name: held in the drawn palm through the startup (Lightning Palm's crackle, ENG-SKL-KIL),
      // looping and growing as it builds; the art carries the light, so no glow disc. `fxForm` on the move: a forming
      // strip instead, its frames played by the startup's progress and its last frame held after (Reversal: Red's);
      // `fxScale`: its full size
      const p = at(0.6, 0.85), M = f.move, form = !!M?.fxForm, base = (M?.fxScale ?? 0.6) * k * (quiet ? 0.7 : 1);
      const it = this.keep('hand' + f.index, kind, p.x, p.y, p.z, { scale: form || phase ? base : base * (0.5 + prog * 0.5), order: 9, glow: 0.3 });
      it.frame = !form ? -1 : phase === 0 ? Math.min(it.a.n - 1, Math.floor(prog * it.a.n)) : it.a.n - 1;
    }
  }

  dropHand(f) {
    this.drop('hand' + f.index);
    this.drop('handForm' + f.index);
    this.drop('handGlow' + f.index);
  }

  // ------------------------------------------------------------ signature techniques (ENG-SKL-NAR)
  // A technique's own hit blast (the Rasengan's spiral): the effect, a shockwave ring and a little smoke, without the
  // generic explosion's bloom so its shape reads. `smoke`: how many puffs (lightning leaves less smoke than wind);
  // `ring`: the shockwave's size against the blast's (0: none)
  blast(name, x, y, z, scale, color, smoke = 3, ring = 2.2) {
    this.spawn(name, x, y, z, { scale, order: 8, depthTest: false });
    if (ring) this.spawn('ring', x, y, z, { scale: ring * scale, color, glow: 0.4, order: 7, depthTest: false });
    for (let k = 0; k < smoke; k++) this.smoke(x + (Math.random() - 0.5) * 1.2, y * 0.5 + Math.random() * 0.5, z + (Math.random() - 0.5) * 1.2, 0.9);
  }

  // A straight effect drawn pointing screen-right (the Chidori Spear's blade, ENG-SKL-SAS), laid from `from` along `dir`
  // for `len` world units: turned to that line's angle on screen and mirrored when it points screen-left. `fill`: the
  // share of the cell the drawn length spans.
  span(name, from, dir, len, camRight, o = {}) {
    const sx = dir.x * camRight.x + dir.z * camRight.z, flip = sx < 0, phi = Math.atan2(dir.y, sx);
    const it = this.spawn(name, from.x + (dir.x * len) / 2, from.y + (dir.y * len) / 2, from.z + (dir.z * len) / 2, { ...o, flipX: flip, rot: flip ? phi - Math.PI : phi });
    const s = len / (it.cellWorld * (o.fill ?? 0.95));
    it.base = s;
    it.mesh.scale.set(flip ? -s : s, s, s);
    return it;
  }

  // A teleport's own look where it vanishes or reappears (its `vanishFx` / `appearFx`): an effect name, or { fx, scale,
  // bottom (anchored at the feet), y (up from the feet otherwise, default 0.9), reverse (its frames backward) }. `at`:
  // the feet (fighter space)
  teleportFx(spec, at) {
    const S = typeof spec === 'string' ? { fx: spec } : spec;
    const a = this.meta.anims[S?.fx];
    if (!a) {
      console.warn(`[vfx] no ${S?.fx} effect for a teleport`);
      return null;
    }
    const seq = S.reverse ? Array.from({ length: a.n }, (_, i) => a.n - 1 - i) : null;
    return this.spawn(S.fx, at.x, at.y + (S.bottom ? 0 : S.y ?? 0.9), at.z, { scale: S.scale ?? 1, bottom: !!S.bottom, seq, depthTest: false, order: 9 });
  }

  // A shadow clone appearing or vanishing (the anime's poof)
  poof(x, y, z, scale = 0.6) {
    this.spawn('poof', x, y, z, { scale, order: 8 });
  }

  // Substitution: the log left where he stood, in a puff; it tips over and lies there a moment
  subLog(x, y, z, faceX = 1) {
    this.spawn('subLog', x, y, z, { bottom: true, scale: 0.8, life: 1.4, fade: true, order: 6, flipX: faceX < 0 });
    this.poof(x, y + 0.8, z, 0.75);
  }

  // The Nine-Tails Cloak wells up over him (the mode starts)
  cloakBurst(f, C) {
    const p = f.renderPos || f.pos;
    this.spawn('ring', p.x, p.y + 0.8, p.z, { scale: 2.2, color: C.rim, glow: 0.8, order: 8, depthTest: false });
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      this.spawn('bubble', p.x + Math.cos(a) * 0.3, p.y + 0.3 + Math.random() * 1.1, p.z, {
        scale: 0.18 + Math.random() * 0.1, color: C.bubble ?? C.rim, vel: [Math.cos(a) * 2, 1.2 + Math.random(), Math.sin(a) * 1.2], life: 0.4, fade: true, order: 7,
      });
    }
  }

  // Held behind the hips, swaying with its own loop, mirrored with the facing: the cloak's tail, the shroud's four
  // (`i` of `n`, fanned). The tail art sweeps left from its base, so it is mirrored when he faces screen-left.
  tail(f, id, camRight, T, color, rot = 0) {
    const p = f.renderPos || f.pos, flip = f.actor.flip, k = f.actor.depthK ?? 1;
    const x = p.x - camRight.x * flip * 0.12 * k + this.camFwd.x * 0.25, z = p.z - camRight.z * flip * 0.12 * k + this.camFwd.z * 0.25;
    const it = this.keep(id, T.fx ?? 'naruto_chakraTail', x, p.y + 0.62 * k, z, { bottom: true, scale: (T.scale ?? 0.75) * k, color, opacity: T.opacity ?? 0.75, glow: 0.15, order: 1, flipX: flip < 0 });
    it.rot = flip * rot;
  }

  // Every frame of the Nine-Tails Cloak: its tail when it has one, and now and then a bubble of chakra boiling off him
  cloakTick(f, C, camRight, frozen = false) {
    if (C.tail) this.tail(f, 'cloakTail' + f.index, camRight, C.tail, C.tail.color ?? C.rim, 0.1);
    if (frozen || Math.random() > 0.12) return;
    const p = f.renderPos || f.pos, k = f.actor.depthK ?? 1;
    this.spawn('bubble', p.x + (Math.random() - 0.5) * 0.5 * k, p.y + (0.3 + Math.random()) * k, p.z, {
      scale: 0.12 + Math.random() * 0.08, color: C.bubble ?? C.rim, vel: [0, 1.1, 0], life: 0.45, fade: true, order: 6,
    });
  }

  // A beam ultimate's `gather` (Naruto's Tailed Beast Ball): the ball grows at the drawn hand anchor (the mouth on the
  // four-tails frames) through the charge, red and blue chakra converging on it. prog: 0..1 through the windup.
  gatherTick(f, G, prog, frozen = false) {
    if (prog <= 0) return; // the flash is the transformation's: the ball starts with the charge
    const P = f.renderPos || f.pos, k = f.actor?.depthK ?? 1, H = f.actor?.hand?.();
    const fwd = H ? H.x : 0.6, up = H ? H.y : 0.9;
    const x = P.x + f.face.x * fwd * k, y = P.y + up * k, z = P.z + f.face.y * fwd * k;
    this.keep('gather' + f.index, G.fx, x, y, z, { scale: (G.scale ?? 0.6) * (0.2 + 0.8 * prog) * k, order: 9, glow: 0.3 });
    if (frozen || Math.random() > 0.65) return;
    const a = Math.random() * Math.PI * 2, b = (Math.random() - 0.5) * 2.2, r = 1.3 + Math.random() * 0.5;
    const sx = x + Math.cos(a) * r, sy = y + Math.sin(b) * r * 0.6, sz = z + Math.sin(a) * r * 0.5;
    const cols = G.colors ?? [0xff3a2a];
    this.spawn('bubble', sx, sy, sz, {
      scale: 0.14 + Math.random() * 0.1, color: cols[(Math.random() * cols.length) | 0], vel: [(x - sx) * 3, (y - sy) * 3, (z - sz) * 3], life: 0.33, order: 8, glow: 0.2,
    });
  }

  dropGather(f) {
    this.drop('gather' + f.index);
  }

  // A power-up's outline on the body (kit.modeLook `shell`: { kind, width, lift, noise, speed, dash, opacity, color,
  // core }, a charge style's shell shape; colors as hex or numbers). null hides the one this showed; the charge drives
  // the same AuraShell while he powers up, so it is left to it then
  modeShell(f, S, time) {
    const a = f.actor;
    if (!S) {
      if (a.modeShellOn) { a.shell?.hide(); a.modeShellOn = false; }
      return;
    }
    let st = shellLooks.get(S);
    if (!st) shellLooks.set(S, (st = { ...S, color: new THREE.Color(S.color ?? 0xffffff), core: new THREE.Color(S.core ?? S.color ?? 0xffffff) }));
    st.time = time;
    a.auraShell().show(st);
    a.modeShellOn = true;
  }

  // A power-up's effect kept at his feet (kit.modeLook `aura`: { fx, scale, opacity, front, glow }): one copy a step
  // behind the body along the view, and with `front` a see-through copy in front at that opacity
  modeAura(f, A) {
    const p = f.renderPos || f.pos, bk = this.camFwd, k = f.actor.depthK ?? 1, s = (A.scale ?? 1) * k;
    this.keep('modeAura' + f.index, A.fx, p.x + bk.x * 0.3, p.y, p.z + bk.z * 0.3, { bottom: true, scale: s, opacity: A.opacity ?? 1, order: 1, glow: A.glow ?? 0.2 });
    if (A.front) this.keep('modeAuraF' + f.index, A.fx, p.x - bk.x * 0.3, p.y, p.z - bk.z * 0.3, { bottom: true, scale: s, opacity: A.front, order: 4, glow: A.glow ?? 0.2 });
  }

  // A beam's `muzzle`: every `every` frames a shock ring leaves the root of the beam and runs down it
  muzzleTick(f, beam, M) {
    if (beam.t % (M.every ?? 10) !== 1) return;
    const o = beam.origin, d = beam.dir, v = M.speed ?? 7;
    this.spawn(M.fx, o.x + d.x * 0.4, o.y + d.y * 0.4, o.z + d.z * 0.4, { scale: M.scale ?? 0.9, vel: [d.x * v, d.y * v, d.z * v], life: 0.45, fade: true, order: 7 });
  }

  // Every frame of the Four-Tails shroud (kit.js startShroud): its tails once the chakra has swallowed him, bubbles
  shroudTick(f, sh, level, camRight, frozen = false) {
    if (sh.tails && level > 0.6) {
      for (let i = 0; i < sh.tails; i++) {
        const fan = sh.tails > 1 ? -0.4 + (0.8 * i) / (sh.tails - 1) : 0;
        this.tail(f, 'shroudTail' + f.index + '_' + i, camRight, { scale: 0.8 + (i % 2) * 0.08, opacity: 0.95 }, i % 2 ? sh.rim : sh.chakra, fan);
      }
    }
    if (frozen && level >= 1) return;
    if (Math.random() > (frozen ? 0.35 : 0.25)) return;
    // the chakra boiling up the body (during the flash, up to the line it has reached)
    const p = f.renderPos || f.pos, k = f.actor.depthK ?? 1;
    this.spawn('bubble', p.x + (Math.random() - 0.5) * 0.6 * k, p.y + (0.1 + Math.random() * 1.3 * Math.max(0.2, level)) * k, p.z, {
      scale: 0.14 + Math.random() * 0.1, color: Math.random() < 0.5 ? sh.chakra : sh.rim, vel: [0, 1.4, 0], life: 0.4, fade: true, order: 6,
    });
  }

  // ------------------------------------------------------------ Killua's lightning (ENG-SKL-KIL)
  // A column of tiles stacked from yBot up past yTop (Narukami's bolt from the sky): copies of a strip that tiles top to
  // bottom. With an `id` they are held (refreshed every frame by the caller), without one they flash for `life`.
  column(id, name, x, yBot, yTop, z, o = {}) {
    const a = this.meta.anims[name], seg = this.sheet(a).cellWorld * (o.scale ?? 1) * 0.98;
    const n = Math.min(8, Math.max(1, Math.ceil((yTop - yBot) / seg)));
    for (let j = 0; j < 8; j++) {
      if (j >= n) { if (id) this.drop(id + j); continue; }
      const y = yBot + seg * (j + 0.5);
      if (!id) { this.spawn(name, x, y, z, { order: 8, depthTest: false, glow: 0.4, ...o, life: o.life ?? 0.15 }); continue; }
      const it = this.keep(id + j, name, x, y, z, { order: 8, depthTest: false, glow: 0.4, ...o });
      if (it.t === 0) it.t = j * 0.07; // the tiles crackle out of step
    }
  }

  // A hit's `cling` on the stunned body (Lightning Palm's paralysis): its loop over them, refreshed every frame
  clingTick(f, C) {
    const p = f.renderPos || f.pos, k = f.actor.depthK ?? 1;
    this.keep('cling' + f.index, C.fx, p.x, p.y, p.z, { bottom: true, scale: (C.scale ?? 1) * k, order: 7, glow: 0.3 });
  }

  // ------------------------------------------------------------ limbs (ENG-SKL-LUF)
  // Where the drawn hand is now: the frame's `hand` anchor (or hit box) in the world, else `def` [forward, up]. A limb
  // longer than its strip's cell leaves the cell at the edge with the anchor there, and these effects carry it on.
  handAt(f, def = [0.5, 0.9]) {
    const P = f.renderPos || f.pos, H = f.actor?.hand?.(), k = f.actor?.depthK ?? 1;
    const fwd = H ? H.x : def[0], up = H ? H.y : def[1];
    return { x: P.x + f.face.x * fwd * k, y: P.y + up * k, z: P.z + f.face.y * fwd * k };
  }

  // A stretched limb from `from` to `to` (Luffy's rubber arm, Killua's yo-yo string): a tube effect drawn pointing
  // screen-right, its tube `tube` of the cell high and every column the same, stretched along the line as seen on screen
  // and scaled across it to `thick` world units. Kept by `id`: its owner refreshes it every frame. A null `id` lays it
  // once instead, playing its strip through and gone (Killua's Godspeed streaks). `o.color` tints it.
  limb(id, name, from, to, thick, tube, camRight, o = {}) {
    const dy = to.y - from.y, sx = (to.x - from.x) * camRight.x + (to.z - from.z) * camRight.z;
    const mx = (from.x + to.x) / 2, my = (from.y + to.y) / 2, mz = (from.z + to.z) / 2;
    const so = { order: o.order ?? 7, depthTest: false, color: o.color };
    const it = id == null ? this.spawn(name, mx, my, mz, so) : this.keep(id, name, mx, my, mz, so);
    // the quad is 1 x 1 world units before scaling (spawn folds the cell's world size into the scale)
    const flip = sx < 0, phi = Math.atan2(dy, sx), sy = thick / tube;
    it.rot = flip ? phi - Math.PI : phi;
    it.mesh.scale.set(Math.max(1e-3, Math.hypot(sx, dy)) * (flip ? -1 : 1), sy, sy);
    return it;
  }

  // the end of a limb (its fist), drawn pointing screen-right: centred on `at`, `scale` cells, turned along the limb
  // (kept by `id`, or played once with a null `id`, like limb)
  limbEnd(id, name, at, from, scale, camRight, o = {}) {
    const dy = at.y - from.y, sx = (at.x - from.x) * camRight.x + (at.z - from.z) * camRight.z;
    const so = { order: o.order ?? 8, depthTest: false, color: o.color };
    const it = id == null ? this.spawn(name, at.x, at.y, at.z, so) : this.keep(id, name, at.x, at.y, at.z, so);
    const flip = sx < 0, phi = Math.atan2(dy, sx), s = it.cellWorld * scale;
    it.rot = flip ? phi - Math.PI : phi;
    it.mesh.scale.set(flip ? -s : s, s, s);
    return it;
  }
}

// Fullscreen 2D overlay: anime speed lines, color flashes, impact frames.
class Overlay {
  constructor() {
    this.cv = document.getElementById('fx-overlay');
    this.ctx = this.cv.getContext('2d');
    this.lines = 0;
    this.linesColor = '255,255,255';
    this.focus = [0.5, 0.5];
    this.flashA = 0;
    this.flashColor = '#ffffff';
    this.impact = 0;
    this.tick = 0;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    // its own box (full screen in the game, left of the docked panel in the test lab)
    this.cv.width = Math.floor((this.cv.clientWidth || window.innerWidth) / 2);
    this.cv.height = Math.floor((this.cv.clientHeight || window.innerHeight) / 2);
    this.cv.style.imageRendering = 'pixelated';
  }

  reset() {
    this.lines = 0;
    this.flashA = 0;
    this.impact = 0;
  }

  // Drop transient impact / flash state and blank the canvas (pausing mid impact-frame
  // would otherwise leave the whole view color-inverted behind the menu).
  clear() {
    this.reset();
    this.ctx.clearRect(0, 0, this.cv.width, this.cv.height);
    this.cv.style.mixBlendMode = 'normal';
  }

  flash(color = '#ffffff', a = 0.8) {
    this.flashColor = color;
    this.flashA = Math.max(this.flashA, a);
  }

  impactFrame(frames = 3) {
    this.impact = frames;
  }

  update(dt) {
    const { ctx, cv } = this;
    const w = cv.width, h = cv.height;
    ctx.clearRect(0, 0, w, h);
    this.tick++;
    if (this.impact > 0) {
      this.impact--;
      cv.style.mixBlendMode = 'difference';
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      return;
    }
    cv.style.mixBlendMode = 'normal';
    if (this.lines > 0.02) {
      const cx = this.focus[0] * w, cy = this.focus[1] * h;
      const n = Math.floor(70 * this.lines);
      const R = Math.hypot(w, h) * 0.6;
      ctx.fillStyle = `rgba(${this.linesColor},${0.55 * Math.min(1, this.lines)})`;
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const inner = R * (0.42 + Math.random() * 0.3);
        const wd = 0.004 + Math.random() * 0.012;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a - wd) * R * 1.3, cy + Math.sin(a - wd) * R * 1.3);
        ctx.lineTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner);
        ctx.lineTo(cx + Math.cos(a + wd) * R * 1.3, cy + Math.sin(a + wd) * R * 1.3);
        ctx.fill();
      }
    }
    if (this.flashA > 0.01) {
      ctx.globalAlpha = Math.min(1, this.flashA);
      ctx.fillStyle = this.flashColor;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
      this.flashA *= Math.pow(0.0008, dt);
    }
  }
}
