// Toon material for baking 3D chibis into pixel art. Colors come out as exact
// palette entries (no color-management, no blending), so the baked sprites keep a
// clean hand-picked ramp. The same material also renders an ID + depth pass that
// the baker uses to draw contour lines and place facial features.
import * as THREE from 'three';
import { hex, darken, lighten } from '../pixel.js';

export const BAKE = {
  mode: { value: 0 }, // 0 = color, 1 = id + depth
  range: { value: new THREE.Vector2(2, 14) }, // view-space depth range for packing
  light: { value: new THREE.Vector3(0.45, 0.75, 0.5).normalize() }, // view-space light dir
};

const VERT = /* glsl */ `
  varying vec3 vN;
  varying float vDepth;
  void main() {
    vN = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }`;

const FRAG = /* glsl */ `
  uniform int uMode;
  uniform vec2 uRange;
  uniform vec3 uLight;
  uniform vec3 c0, c1, c2, c3;
  uniform vec3 uTh;
  uniform float uId;
  varying vec3 vN;
  varying float vDepth;
  void main() {
    if (uMode == 1) {
      float d = clamp((vDepth - uRange.x) / (uRange.y - uRange.x), 0.0, 1.0) * 255.0;
      gl_FragColor = vec4(uId / 255.0, floor(d) / 255.0, fract(d), 1.0);
      return;
    }
    vec3 n = normalize(vN);
    if (!gl_FrontFacing) n = -n;
    float k = dot(n, uLight);
    vec3 col = k > uTh.z ? c3 : (k > uTh.y ? c2 : (k > uTh.x ? c1 : c0));
    gl_FragColor = vec4(col, 1.0);
  }`;

const v3 = (rgb) => new THREE.Vector3(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255);

// A ramp is [shadow, base, light, highlight] as 0-255 RGB triplets.
export function ramp(base, o = {}) {
  const b = typeof base === 'string' ? hex(base) : base;
  const shadow = o.shadow ? hex(o.shadow) : darken(b, o.shade ?? 0.3);
  const light = o.light ? hex(o.light) : lighten(b, o.lit ?? 0.16);
  const hi = o.hi ? hex(o.hi) : o.hiAmt ? lighten(b, o.hiAmt) : light;
  return { shadow, base: b, light, hi, line: o.line ? hex(o.line) : darken(b, 0.62) };
}

// Thresholds on N·L: below t0 = shadow, above t1 = light, above t2 = highlight.
export function toonMaterial(r, id, o = {}) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uMode: BAKE.mode,
      uRange: BAKE.range,
      uLight: BAKE.light,
      c0: { value: v3(r.shadow) },
      c1: { value: v3(r.base) },
      c2: { value: v3(r.light) },
      c3: { value: v3(r.hi) },
      uTh: { value: new THREE.Vector3(o.t0 ?? -0.08, o.t1 ?? 0.58, o.t2 ?? 0.9) },
      uId: { value: id },
    },
    vertexShader: VERT,
    fragmentShader: FRAG,
    side: o.side ?? THREE.FrontSide,
  });
}
