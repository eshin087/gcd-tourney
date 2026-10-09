import * as THREE from 'three';
import { bakeVfx } from '../art/vfxPainter.js';
import { loadImage } from './sprites.js';
import { fetchArtJson } from '../core/artIndex.js';
import { VFX_PPU as PPU, RING_TOP, ARENA_LIMIT } from './constants.js';

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
    this.decals = [];
    this.rocks = [];
    this.walls = [];
    this.hexTex = hexTexture();
    this.rockGeo = new THREE.DodecahedronGeometry(1, 0);
    this.rockMats = ['#cdb9a2', '#b9a28a', '#e0d0bb'].map((c) => new THREE.MeshLambertMaterial({ color: c, flatShading: true }));
    this.overlay = new Overlay();
    this.cellWorld = meta.cell / PPU;
    this.camFwd = new THREE.Vector3(0, 0, -1);
  }

  // Swap in hand-made effects from public/vfx/atlas.{png,json} (`npm run sprites vfx`).
  // Effects missing from the custom atlas keep their procedural frames (upscaled).
  async loadCustom() {
    try {
      const cm = await fetchArtJson('/vfx/atlas.json');
      if (!cm) return false;
      if (!cm.anims) {
        console.warn('[vfx] atlas.json has no "anims", keeping procedural effects');
        return false;
      }
      const img = await loadImage(`/vfx/atlas.png?v=${Date.now()}`);
      if (!img) {
        console.warn('[vfx] atlas.json found but atlas.png is missing or unreadable, keeping procedural effects');
        return false;
      }
      const pm = this.meta, proc = this.tex.image;
      const cell = cm.cell || 128;
      const names = [...new Set([...Object.keys(pm.anims), ...Object.keys(cm.anims)])];
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
      this.meta = meta;
      this.W = cv.width;
      this.H = cv.height;
      this.tex.image = cv;
      this.tex.needsUpdate = true;
      console.info(`[vfx] custom effects: ${custom.join(', ') || 'none'}`);
      return true;
    } catch (e) {
      console.warn('[vfx] custom atlas failed, keeping procedural effects', e);
      return false;
    }
  }

  uv(name, i, out) {
    const a = this.meta.anims[name];
    i = Math.max(0, Math.min(i | 0, a.n - 1));
    const c = this.meta.cell, e = 0.02;
    out.set((i * c + e) / this.W, 1 - ((a.row + 1) * c - e) / this.H, ((i + 1) * c - e) / this.W, 1 - (a.row * c + e) / this.H);
    return out;
  }

  spawn(name, x, y, z, o = {}) {
    const a = this.meta.anims[name];
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        map: { value: this.tex },
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
    const s = this.cellWorld * (o.scale ?? 1);
    mesh.scale.set(s * (o.flipX ? -1 : 1), s, s);
    mesh.position.set(x, y + RING_TOP, z);
    this.scene.add(mesh);
    const ms = o.ms ?? a.ms;
    const it = {
      mesh, mat, name, a, t: 0, ms,
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
    };
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
      const s = this.cellWorld * o.scale;
      it.base = s;
      it.mesh.scale.set(s, s, s);
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
      if (it.frame >= 0) f = it.frame;
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
    for (let i = this.decals.length - 1; i >= 0; i--) {
      const d = this.decals[i];
      d.life -= dt;
      d.mesh.material.opacity = Math.min(1, d.life / 2);
      if (d.life <= 0) {
        this.removeDecal(d);
        this.decals.splice(i, 1);
      }
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
    this.overlay.update(dt);
  }

  clearAll() {
    for (const it of this.items) { this.scene.remove(it.mesh); it.mat.dispose(); }
    this.items.length = 0;
    this.keepers.clear();
    for (const d of this.decals) this.removeDecal(d);
    this.decals.length = 0;
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

  crater(pos) {
    const mat = new THREE.MeshBasicMaterial({ map: this.tex, transparent: true, alphaTest: 0.5, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -3 });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
    const uv = this.uv('crater', Math.floor(Math.random() * this.meta.anims.crater.n), new THREE.Vector4());
    const g = m.geometry.attributes.uv;
    for (let i = 0; i < g.count; i++) {
      g.setXY(i, g.getX(i) ? uv.z : uv.x, g.getY(i) ? uv.w : uv.y);
    }
    m.rotation.x = -Math.PI / 2;
    m.rotation.z = Math.random() * Math.PI;
    const s = this.cellWorld * 0.85;
    m.scale.set(s, s, 1);
    m.position.set(pos.x, RING_TOP + 0.01, pos.z);
    this.scene.add(m);
    this.decals.push({ mesh: m, life: 9 });
    if (this.decals.length > 10) this.removeDecal(this.decals.shift());
  }

  removeDecal(d) {
    this.scene.remove(d.mesh);
    d.mesh.material.dispose();
    d.mesh.geometry.dispose();
  }

  // Charging aura: flame tongues + light streaks + glow, tinted per character.
  auraTick(f, power = 1, camRight) {
    // a mode can recolor the aura (Nine-Tails Cloak burns red-orange)
    const c = new THREE.Color(f.mode?.auraColor ?? f.def.color);
    const core = new THREE.Color().setRGB(...(f.mode?.auraCore ?? f.def.auraCore));
    const back = this.camFwd;
    const p = f.renderPos || f.pos;
    const count = Math.random() < power % 1 ? Math.ceil(power) : Math.floor(power);
    for (let k = 0; k < Math.max(1, count); k++) {
      const off = (Math.random() - 0.5) * 1.15;
      const front = Math.random() < 0.2;
      const d = front ? -0.25 : 0.35;
      this.spawn('flame', p.x + camRight.x * off + back.x * d, p.y - 0.05 + Math.random() * 0.2, p.z + camRight.z * off + back.z * d, {
        bottom: true, scale: (front ? 0.4 : 0.55) + Math.random() * 0.28, color: Math.random() < 0.35 ? core : c, vel: [0, 1.3, 0], opacity: front ? 0.5 : 0.8, order: front ? 4 : 1, glow: 0.12,
      });
    }
    if (Math.random() < 0.6 * power) {
      const off = (Math.random() - 0.5) * 1.6;
      this.spawn('streak', p.x + camRight.x * off + back.x * 0.2, p.y, p.z + camRight.z * off + back.z * 0.2, { bottom: true, scale: 0.7 + Math.random() * 0.35, color: core, vel: [0, 2.6, 0], order: 4, glow: 0.35 });
    }
    if (Math.random() < 0.3 * power) {
      const a = Math.random() * Math.PI * 2;
      this.spawn('star', p.x + Math.cos(a) * 0.9, 0.05, p.z + Math.sin(a) * 0.6, { scale: 0.18, frame: 2, vel: [0, 3 + Math.random() * 2, 0], color: 0xb8a48c, life: 0.6 });
    }
    this.keep('aura' + f.index, 'glow', p.x + back.x * 0.4, p.y + 0.8, p.z + back.z * 0.4, { scale: 1.1 + Math.sin(performance.now() * 0.02) * 0.06, color: c, opacity: 0.28 * Math.min(1, power), order: 1, glow: 0.25 });
  }

  // Signature move hand effects.
  handTick(f, kind, phase, prog) {
    const fx = f.face.x, fz = f.face.y;
    const P = f.renderPos || f.pos;
    if (kind === 'rasengan') {
      const s = phase === 0 ? 0.25 + prog * 0.45 : 0.72;
      const p = { x: P.x + fx * 0.6, y: P.y + 0.72, z: P.z + fz * 0.6 };
      this.keep('hand' + f.index, 'orb', p.x, p.y, p.z, { scale: s, order: 9, glow: 0.7 });
      this.keep('handGlow' + f.index, 'glow', p.x, p.y, p.z, { scale: s * 1.3, color: 0x8ac8ff, opacity: 0.45, order: 3, glow: 1 });
      if (Math.random() < 0.5) this.spawn('star', p.x, p.y, p.z, { scale: 0.2, frame: 2, vel: [(Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3], life: 0.2, color: 0xbfe4ff, order: 9, glow: 1.5 });
    } else if (kind === 'rasenshuriken') {
      // a big wind orb ringed by spinning blades, held high in startup and thrust forward in active
      const p = phase === 0
        ? { x: P.x + fx * 0.25, y: P.y + 1.55, z: P.z + fz * 0.25 }
        : { x: P.x + fx * 0.7, y: P.y + 0.8, z: P.z + fz * 0.7 };
      const s = phase === 0 ? 0.3 + prog * 0.6 : 0.9;
      this.keep('hand' + f.index, 'orb', p.x, p.y, p.z, { scale: s, color: 0xe8f6ff, order: 9, glow: 0.8 });
      this.keep('handGlow' + f.index, 'glow', p.x, p.y, p.z, { scale: s * 2.2, color: 0x8ac8ff, opacity: 0.45, order: 3, glow: 1 });
      if (Math.random() < 0.5) this.spawn('ring', p.x, p.y, p.z, { scale: s * 2.1, color: 0xffffff, glow: 0.6, life: 0.12, fade: true, order: 8 });
      if (Math.random() < 0.6) {
        const a = Math.random() * Math.PI * 2;
        this.spawn('streak', p.x + Math.cos(a) * s * 0.9, p.y + Math.sin(a) * s * 0.5, p.z, { scale: 0.35, color: 0xe8f6ff, vel: [-Math.sin(a) * 6, Math.cos(a) * 3, 0], life: 0.1, order: 8, glow: 0.8 });
      }
    } else if (kind === 'chidori') {
      const back = 0.5;
      const p = phase === 2
        ? { x: P.x + fx * 0.7, y: P.y + 0.78, z: P.z + fz * 0.7 }
        : { x: P.x - fx * back, y: P.y + 0.32, z: P.z - fz * back };
      const s = phase === 0 ? 0.4 + prog * 0.5 : 0.9;
      const it = this.keep('hand' + f.index, 'lightning', p.x, p.y, p.z, { scale: s, color: 0xd8f0ff, order: 9, glow: 1.0 });
      it.random = true;
      it.rot = Math.random() * 6.28;
      this.keep('handGlow' + f.index, 'glow', p.x, p.y, p.z, { scale: s * 1.1, color: 0x5aa8ff, opacity: 0.5, order: 3, glow: 1 });
      if (Math.random() < 0.6) {
        const a = Math.random() * Math.PI * 2;
        this.spawn('lightning', p.x + Math.cos(a) * 0.3, p.y + Math.sin(a) * 0.3, p.z, { scale: 0.35, random: true, life: 0.08, color: 0xffffff, rot: a, order: 9, glow: 2 });
      }
    }
  }

  dropHand(f) {
    this.drop('hand' + f.index);
    this.drop('handGlow' + f.index);
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
    this.cv.width = Math.floor(window.innerWidth / 2);
    this.cv.height = Math.floor(window.innerHeight / 2);
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
