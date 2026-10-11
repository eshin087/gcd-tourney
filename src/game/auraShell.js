// Body-hugging aura shell (ENG-069, ADR 0023): a second quad behind a fighter's sprite that draws a band of
// energy around the silhouette of the frame on screen. It reads the same sheet texture and uvRect as the body
// and dilates the frame's alpha in the shader, so the power-up lives ON the body (Naruto's chakra boil, Sasuke's
// dark chakra, Killua's crackling outline, Gojo's Infinity shimmer) instead of a cloud of sprites around it.
// Hard bands and colors <= 1.0: it never blooms and stays pixel art. Styles come from chargeFx.js.
import * as THREE from 'three';

// kind -> shader branch. 'flame' is the default DBZ-style ki outline (a new fighter without a charge block).
export const SHELL_KINDS = { flame: 0, boil: 1, dark: 2, electric: 3, shimmer: 4 };

const VERT = /* glsl */ `
  uniform vec4 uvRect;
  varying vec2 vUv;
  void main() {
    vUv = mix(uvRect.xy, uvRect.zw, uv);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`;

// The band is found by sampling the frame's alpha at 12 directions x 2 radii around each pixel outside the body:
// inner radius hit = the inner band, outer radius only = the outer band. Samples are clamped to the frame's own
// cell so a neighbour frame never bleeds in. Noise works on whole texels (hard pixels) and scrolls upward.
const FRAG = /* glsl */ `
  uniform sampler2D map;
  uniform vec4 uvRect;
  uniform vec2 texel;
  uniform float radius;
  uniform float lift;
  uniform float noise;
  uniform float grain;
  uniform float speed;
  uniform float time;
  uniform float dash;
  uniform int kind;
  uniform vec3 color;
  uniform vec3 core;
  uniform float opacity;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float vnoise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  float solid(vec2 uv) { return step(0.5, texture2D(map, clamp(uv, uvRect.xy, uvRect.zw)).a); }
  // any filled texel within radius r (in texels) of uv, taps biased downward by lift so the band rises
  float near(vec2 uv, float r) {
    float hit = 0.0;
    for (int i = 0; i < 12; i++) {
      float a = float(i) * 0.5235988;
      vec2 o = vec2(cos(a), sin(a) - lift * 0.6) * r;
      hit = max(hit, solid(uv + o * texel));
    }
    return hit;
  }

  void main() {
    if (solid(vUv) > 0.5) discard; // the body itself draws there
    vec2 px = floor(vUv / texel / grain); // art pixels
    float r = radius;
    if (kind == 1 || kind == 0 || kind == 2) {
      // boiling / licking edge: radius pulses with noise that rises over time
      float n = vnoise(vec2(px.x * 0.35, px.y * 0.22 - time * speed));
      r *= 1.0 - noise * 0.55 + noise * 0.9 * n;
    } else if (kind == 4) {
      // Infinity: a slow, thin wobble
      r *= 0.75 + 0.25 * sin(time * speed * 2.0 + px.y * 0.3);
    }
    r = max(r, 1.0);
    float outer = near(vUv, r);
    if (outer < 0.5) discard;
    float inner = near(vUv, max(1.0, r * 0.5));
    vec3 col = color;
    float a = opacity;
    if (kind == 2) {
      col = inner > 0.5 ? core : color; // dark chakra: near-black against the body, a thin colored rim
    } else if (kind == 3) {
      // electricity: the outline is broken into flickering segments
      if (hash(floor(px / 3.0) + floor(time * speed)) < dash) discard;
      col = inner > 0.5 ? core : color;
    } else if (kind == 4) {
      col = color;
    } else {
      col = inner > 0.5 ? core : color;
      a *= inner > 0.5 ? 1.0 : 0.75;
    }
    gl_FragColor = vec4(min(col, vec3(1.0)), a);
    #include <colorspace_fragment>
  }`;

export class AuraShell {
  // Lives as a child of the body mesh: it inherits the billboard, the facing flip and any per-frame scale, and
  // shares the body's uvRect uniform, so it always outlines the frame on screen with no per-frame sync.
  constructor(actor) {
    const m = actor.asset.meta;
    this.ppu = m.pixelsPerUnit;
    this.mat = new THREE.ShaderMaterial({
      uniforms: {
        map: { value: actor.asset.texture },
        uvRect: actor.mat.uniforms.uvRect,
        texel: { value: new THREE.Vector2(1 / actor.asset.W, 1 / actor.asset.H) },
        radius: { value: 4 },
        lift: { value: 0.6 },
        noise: { value: 0.8 },
        grain: { value: Math.max(1, Math.round(this.ppu / 44)) },
        speed: { value: 2 },
        time: { value: 0 },
        dash: { value: 0 },
        kind: { value: 0 },
        color: { value: new THREE.Color(1, 1, 1) },
        core: { value: new THREE.Color(1, 1, 1) },
        opacity: { value: 0.5 },
      },
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    this.mesh = new THREE.Mesh(actor.geo, this.mat);
    this.mesh.position.z = -0.06; // a hair behind the body along the view direction (the body billboards)
    this.mesh.renderOrder = 1;
    this.mesh.visible = false;
    actor.mesh.add(this.mesh);
  }

  // o: { kind, width (world units), lift, noise, speed, dash, color, core (THREE.Color), opacity, time }
  show(o) {
    const u = this.mat.uniforms;
    u.kind.value = SHELL_KINDS[o.kind] ?? 0;
    u.radius.value = Math.min(12, Math.max(1, o.width * this.ppu)); // texels; 12 stays inside a frame's headroom
    u.lift.value = o.lift ?? 0;
    u.noise.value = o.noise ?? 0;
    u.speed.value = o.speed ?? 1;
    u.dash.value = o.dash ?? 0;
    u.time.value = o.time;
    u.color.value.copy(o.color);
    u.core.value.copy(o.core);
    u.opacity.value = o.opacity;
    this.mesh.visible = true;
  }

  hide() {
    this.mesh.visible = false;
  }

  dispose() {
    this.mesh.parent?.remove(this.mesh);
    this.mat.dispose(); // the geometry and texture belong to the actor / asset
  }
}
