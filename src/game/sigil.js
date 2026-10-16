// Eye-technique sigils (ADR 0035): the Sharingan and the Mangekyō drawn in code as crisp pixel art, shown large and
// turning behind a fighter when a move with `sigil` starts (the Sharingan counter, Amaterasu). The pattern comes from
// the character's `eyes` data, so no shared code knows a character id; a new eye technique is a new PATTERNS entry.
import * as THREE from 'three';
import { RING_TOP } from './constants.js';

const SIZE = 256; // texture px; drawn at SIGIL.size world units (about 80 px per unit, close to the sprites' density)

// Timing and look (seconds, world units). `pop`: the scale-in with a small overshoot; `spin`: turns per second;
// `burst`: what a successful read adds (a faster spin, a larger flare).
export const SIGIL = {
  size: 2.7, lift: 1.05, back: 0.35, opacity: 0.95, pop: 0.12, spin: 0.35, fade: 0.25,
  burst: { spin: 2.2, grow: 0.35, len: 0.35 },
};

// palette snap: crisp, fully opaque or clear texels, the colors of the cut-in art (art/characters/sasuke/CHARACTER.md §7)
const INK = '#140810';
function crisp(g, palette) {
  const img = g.getImageData(0, 0, SIZE, SIZE), d = img.data;
  const pal = palette.map((h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]);
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] < 128) { d[i + 3] = 0; continue; }
    let best = pal[0], bd = 1e9;
    for (const p of pal) {
      const e = (d[i] - p[0]) ** 2 + (d[i + 1] - p[1]) ** 2 + (d[i + 2] - p[2]) ** 2;
      if (e < bd) { bd = e; best = p; }
    }
    d[i] = best[0]; d[i + 1] = best[1]; d[i + 2] = best[2]; d[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
}

// a tomoe: a round head with a tail sweeping against the turn
function tomoe(g, cx, cy, a, r) {
  const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r, hr = SIZE * 0.06;
  g.beginPath();
  g.arc(x, y, hr, 0, Math.PI * 2);
  g.fill();
  g.beginPath();
  g.moveTo(x + Math.cos(a + Math.PI / 2) * hr, y + Math.sin(a + Math.PI / 2) * hr);
  g.quadraticCurveTo(cx + Math.cos(a - 0.45) * r * 1.05, cy + Math.sin(a - 0.45) * r * 1.05, cx + Math.cos(a - 0.85) * r, cy + Math.sin(a - 0.85) * r);
  g.quadraticCurveTo(cx + Math.cos(a - 0.4) * r * 0.9, cy + Math.sin(a - 0.4) * r * 0.9, x + Math.cos(a - Math.PI / 2) * hr, y + Math.sin(a - Math.PI / 2) * hr);
  g.fill();
}

const PATTERNS = {
  // the 3-tomoe Sharingan: red iris with a dark rim, a black pupil, a thin ring the tomoe sit on
  sharingan(g, c) {
    const C = SIZE / 2;
    g.fillStyle = c.rim; g.beginPath(); g.arc(C, C, C * 0.96, 0, Math.PI * 2); g.fill();
    g.fillStyle = c.iris; g.beginPath(); g.arc(C, C, C * 0.88, 0, Math.PI * 2); g.fill();
    g.fillStyle = c.light; g.beginPath(); g.arc(C, C, C * 0.5, 0, Math.PI * 2); g.fill();
    g.fillStyle = c.iris; g.beginPath(); g.arc(C, C, C * 0.44, 0, Math.PI * 2); g.fill();
    g.strokeStyle = c.rim; g.lineWidth = SIZE * 0.018; g.beginPath(); g.arc(C, C, C * 0.56, 0, Math.PI * 2); g.stroke();
    g.fillStyle = INK; g.beginPath(); g.arc(C, C, C * 0.17, 0, Math.PI * 2); g.fill();
    for (let k = 0; k < 3; k++) tomoe(g, C, C, -Math.PI / 2 + (k * Math.PI * 2) / 3, C * 0.56);
  },
  // his Mangekyō: three curved blades sweeping out of the pupil, joined by a ring
  mangekyo(g, c) {
    const C = SIZE / 2;
    g.fillStyle = c.rim; g.beginPath(); g.arc(C, C, C * 0.96, 0, Math.PI * 2); g.fill();
    g.fillStyle = c.iris; g.beginPath(); g.arc(C, C, C * 0.88, 0, Math.PI * 2); g.fill();
    g.fillStyle = INK;
    for (let k = 0; k < 3; k++) {
      const a = -Math.PI / 2 + (k * Math.PI * 2) / 3;
      const tip = (t, r) => [C + Math.cos(a + t) * C * r, C + Math.sin(a + t) * C * r];
      g.beginPath();
      g.moveTo(...tip(-0.55, 0.22));
      g.quadraticCurveTo(...tip(-0.15, 0.62), ...tip(0.5, 0.86));
      g.quadraticCurveTo(...tip(0.2, 0.5), ...tip(0.55, 0.22));
      g.fill();
    }
    g.strokeStyle = INK; g.lineWidth = SIZE * 0.035; g.beginPath(); g.arc(C, C, C * 0.3, 0, Math.PI * 2); g.stroke();
    g.fillStyle = c.iris; g.beginPath(); g.arc(C, C, C * 0.2, 0, Math.PI * 2); g.fill();
    g.fillStyle = INK; g.beginPath(); g.arc(C, C, C * 0.11, 0, Math.PI * 2); g.fill();
  },
};

const VERT = /* glsl */ `
  uniform float rot;
  varying vec2 vUv;
  void main() {
    vec2 q = uv - 0.5;
    float c = cos(rot), s = sin(rot);
    vUv = vec2(c * q.x - s * q.y, s * q.x + c * q.y) + 0.5;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`;
const FRAG = /* glsl */ `
  uniform sampler2D map;
  uniform float opacity, glow;
  varying vec2 vUv;
  void main() {
    vec4 c = texture2D(map, vUv);
    if (c.a < 0.5 || any(lessThan(vUv, vec2(0.0))) || any(greaterThan(vUv, vec2(1.0)))) discard;
    gl_FragColor = vec4(c.rgb * (1.0 + glow), opacity);
    #include <colorspace_fragment>
  }`;

const tmpV = new THREE.Vector3();

export class Sigils {
  constructor(scene) {
    this.scene = scene;
    this.tex = new Map();
    this.geo = new THREE.PlaneGeometry(1, 1);
    this.live = [];
  }

  texture(kind, colors) {
    const key = `${kind}:${colors.iris}`;
    let t = this.tex.get(key);
    if (t) return t;
    const draw = PATTERNS[kind];
    if (!draw) return null;
    const cv = document.createElement('canvas');
    cv.width = cv.height = SIZE;
    const g = cv.getContext('2d', { willReadFrequently: true });
    draw(g, colors);
    crisp(g, [INK, colors.rim, colors.iris, colors.light]);
    t = new THREE.CanvasTexture(cv);
    t.magFilter = t.minFilter = THREE.NearestFilter;
    t.generateMipmaps = false;
    t.colorSpace = THREE.SRGBColorSpace;
    this.tex.set(key, t);
    return t;
  }

  // the fighter's eye pattern (def.eyes) or a move's own kind; len = seconds it stays before fading
  show(f, kind, len) {
    const E = f.def.eyes;
    if (!E) return null;
    kind = typeof kind === 'string' ? kind : E.kind;
    const colors = { iris: E.iris ?? '#d81e28', rim: E.rim ?? '#7c0c16', light: E.light ?? '#ff5a5a' };
    const map = this.texture(kind, colors);
    if (!map) {
      console.warn(`[vfx] no sigil pattern "${kind}" for ${f.def.id}`);
      return null;
    }
    this.clear(f);
    const mat = new THREE.ShaderMaterial({
      uniforms: { map: { value: map }, rot: { value: 0 }, opacity: { value: 0 }, glow: { value: 0 } },
      // drawn in the opaque pass between the stage (renderOrder 0) and the fighters' sprites (2), which are alpha-
      // tested opaque: so the fighter stands in front of it and the floor never cuts it off. CustomBlending keeps the
      // fade, which three would switch off for a non-transparent NormalBlending material.
      vertexShader: VERT, fragmentShader: FRAG, transparent: false, depthWrite: false, depthTest: false,
      blending: THREE.CustomBlending, blendSrc: THREE.SrcAlphaFactor, blendDst: THREE.OneMinusSrcAlphaFactor,
    });
    const mesh = new THREE.Mesh(this.geo, mat);
    mesh.renderOrder = 1;
    this.scene.add(mesh);
    const s = { f, mesh, mat, t: 0, len, spin: SIGIL.spin, burstT: -1 };
    this.live.push(s);
    return s;
  }

  // a successful read: the pattern spins up and flares
  burst(f) {
    const s = this.live.find((x) => x.f === f);
    if (!s) return;
    s.burstT = 0;
    s.len = Math.max(s.len, s.t + SIGIL.burst.len);
  }

  clear(f = null) {
    for (let i = this.live.length - 1; i >= 0; i--) {
      if (f && this.live[i].f !== f) continue;
      this.remove(i);
    }
  }

  remove(i) {
    const s = this.live[i];
    this.scene.remove(s.mesh);
    s.mat.dispose();
    this.live.splice(i, 1);
  }

  update(dt, camera, camFwd) {
    for (let i = this.live.length - 1; i >= 0; i--) {
      const s = this.live[i], f = s.f, p = f.renderPos || f.pos;
      s.t += dt;
      if (s.t >= s.len + SIGIL.fade || f.ko) { this.remove(i); continue; }
      const pop = Math.min(1, s.t / SIGIL.pop);
      let scale = SIGIL.size * (pop < 1 ? pop * 1.15 : 1);
      let spin = s.spin;
      if (s.burstT >= 0) {
        s.burstT += dt;
        const b = Math.max(0, 1 - s.burstT / SIGIL.burst.len);
        scale *= 1 + SIGIL.burst.grow * b;
        spin += SIGIL.burst.spin * b;
        s.mat.uniforms.glow.value = 1.2 * b;
      }
      s.mat.uniforms.rot.value += spin * Math.PI * 2 * dt;
      s.mat.uniforms.opacity.value = SIGIL.opacity * Math.min(1, (s.len + SIGIL.fade - s.t) / SIGIL.fade);
      // just behind the fighter, facing the camera
      tmpV.copy(camFwd).multiplyScalar(SIGIL.back);
      s.mesh.position.set(p.x + tmpV.x, RING_TOP + p.y + SIGIL.lift + tmpV.y, p.z + tmpV.z);
      s.mesh.quaternion.copy(camera.quaternion);
      s.mesh.scale.setScalar(scale);
    }
  }
}
