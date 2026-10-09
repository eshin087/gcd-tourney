// Virtual training room: a holographic grid stage that replaces the tournament
// arena while practicing. Same ring footprint and height, so physics, wall
// bounces and the camera behave exactly like a real match.
import * as THREE from 'three';
import { RING_HALF, RING_TOP } from '../game/constants.js';

const GRID_FS = /* glsl */ `
  uniform vec3 uBase, uLine, uGlow;
  uniform float uDim, uBright, uFade0, uFade1;
  varying vec3 vW;
  float grid(vec2 p, float step, float w) {
    vec2 g = abs(fract(p / step - 0.5) - 0.5) * step;
    vec2 fw = max(fwidth(p), vec2(1e-4));
    vec2 l = 1.0 - smoothstep(vec2(0.0), fw * w, g);
    return max(l.x, l.y);
  }
  void main() {
    float d = length(vW.xz);
    float fade = 1.0 - smoothstep(uFade0, uFade1, d);
    float minor = grid(vW.xz, 1.0, 1.0) * fade;
    float major = grid(vW.xz, 4.0, 1.5) * fade;
    vec3 c = uBase;
    c = mix(c, uLine * 0.5, minor * 0.55);
    c = mix(c, uLine, major * 0.85);
    // soft center spot so the fighters read against the floor
    c += uGlow * (1.0 - smoothstep(0.0, 7.0, d)) * 0.06;
    c *= uBright * (1.0 - uDim * 0.75);
    gl_FragColor = vec4(c, 1.0);
  }`;

const WORLD_VS = /* glsl */ `
  varying vec3 vW;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec4 w = modelMatrix * vec4(position, 1.0);
    vW = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }`;

// Translucent boundary wall: bright base line fading upward, faint vertical ribs.
const WALL_FS = /* glsl */ `
  uniform vec3 uLine;
  uniform float uDim, uTime;
  varying vec3 vW;
  varying vec2 vUv;
  void main() {
    float h = vUv.y;
    float along = vW.x + vW.z;
    float rib = 1.0 - smoothstep(0.0, max(fwidth(along), 1e-4) * 1.2, abs(fract(along / 2.0 - 0.5) - 0.5) * 2.0);
    float scan = 0.5 + 0.5 * sin(h * 40.0 - uTime * 2.0);
    float a = pow(1.0 - h, 3.0) * 0.32 + rib * (1.0 - h) * 0.16 + scan * 0.02 * (1.0 - h);
    a *= 1.0 - uDim * 0.6;
    gl_FragColor = vec4(uLine * a, a);
  }`;

const DOME_FS = /* glsl */ `
  uniform vec3 uLow, uHigh, uLine;
  uniform float uDim;
  varying vec3 vW;
  void main() {
    vec3 n = normalize(vW);
    float t = clamp(n.y * 1.6 + 0.15, 0.0, 1.0);
    vec3 c = mix(uLow, uHigh, t);
    // big lat/long lines far away
    float lon = atan(n.z, n.x) * 12.0 / 3.14159;
    float lat = n.y * 14.0;
    vec2 g = abs(fract(vec2(lon, lat) - 0.5) - 0.5);
    vec2 fw = max(fwidth(vec2(lon, lat)), vec2(1e-4));
    float l = max(1.0 - smoothstep(0.0, fw.x * 1.2, g.x), 1.0 - smoothstep(0.0, fw.y * 1.2, g.y));
    c = mix(c, uLine, l * 0.18 * smoothstep(-0.05, 0.25, n.y));
    c *= 1.0 - uDim * 0.7;
    gl_FragColor = vec4(c, 1.0);
  }`;

const col = (hex) => new THREE.Color(hex);

export function buildTrainingRoom(scene) {
  const group = new THREE.Group();
  group.visible = false;
  scene.add(group);
  const dim = { value: 0 };
  const time = { value: 0 };
  const line = col('#3fd6ff');
  // the arena's lights hide with the arena; lit things (debris rocks) need their own cool light here
  const hemi = new THREE.HemisphereLight(0xbfe8ff, 0x2a3060, 1.7);
  group.add(hemi);

  const gridMat = (bright, fade0, fade1, base) => new THREE.ShaderMaterial({
    vertexShader: WORLD_VS,
    fragmentShader: GRID_FS,
    uniforms: {
      uBase: { value: col(base) }, uLine: { value: line }, uGlow: { value: col('#7fe8ff') },
      uDim: dim, uBright: { value: bright }, uFade0: { value: fade0 }, uFade1: { value: fade1 },
    },
  });

  // outer floor (ground level) and the raised practice platform
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(260, 260), gridMat(0.55, 14, 70, '#0a1030'));
  floor.rotation.x = -Math.PI / 2;
  group.add(floor);

  const S = RING_HALF * 2;
  const top = new THREE.Mesh(new THREE.PlaneGeometry(S, S), gridMat(1, 30, 60, '#141c4a'));
  top.rotation.x = -Math.PI / 2;
  top.position.y = RING_TOP + 0.001;
  group.add(top);
  const sideMat = new THREE.ShaderMaterial({
    vertexShader: WORLD_VS,
    fragmentShader: /* glsl */ `
      uniform vec3 uLine; uniform float uDim; varying vec2 vUv;
      void main() {
        float edge = smoothstep(0.75, 1.0, vUv.y);
        vec3 c = mix(vec3(0.012, 0.016, 0.05), uLine * 1.25, edge);
        gl_FragColor = vec4(c * (1.0 - uDim * 0.7), 1.0);
      }`,
    uniforms: { uLine: { value: line }, uDim: dim },
  });
  const hidden = new THREE.MeshBasicMaterial({ visible: false });
  const sides = new THREE.Mesh(new THREE.BoxGeometry(S, RING_TOP, S), [sideMat, sideMat, hidden, hidden, sideMat, sideMat]);
  sides.position.y = RING_TOP / 2;
  group.add(sides);

  // holographic boundary: BackSide so only the far walls render (never in front of the fighters)
  const WALL_H = 3.2;
  const wallMat = new THREE.ShaderMaterial({
    vertexShader: WORLD_VS,
    fragmentShader: WALL_FS,
    uniforms: { uLine: { value: line }, uDim: dim, uTime: time },
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const none = new THREE.MeshBasicMaterial({ visible: false });
  // box face order: +x, -x, +y, -y, +z, -z (no lid or floor)
  const wall = new THREE.Mesh(new THREE.BoxGeometry(S, WALL_H, S), [wallMat, wallMat, none, none, wallMat, wallMat]);
  wall.position.y = RING_TOP + WALL_H / 2;
  group.add(wall);

  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(320, 32, 16),
    new THREE.ShaderMaterial({
      vertexShader: WORLD_VS,
      fragmentShader: DOME_FS,
      uniforms: { uLow: { value: col('#0b0f2a') }, uHigh: { value: col('#1a0f3a') }, uLine: { value: col('#6a7cff') }, uDim: dim },
      side: THREE.BackSide,
      depthWrite: false,
    }),
  );
  dome.renderOrder = -10;
  group.add(dome);

  // a few floating holo panels in the distance for depth
  const panelMat = new THREE.MeshBasicMaterial({ color: col('#2b5cff'), transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 + 0.4;
    const r = 34 + (i % 3) * 9;
    const p = new THREE.Mesh(new THREE.PlaneGeometry(8 + (i % 4) * 3, 4 + (i % 3) * 2), panelMat);
    p.position.set(Math.cos(a) * r, 6 + (i % 4) * 3.5, Math.sin(a) * r);
    p.lookAt(0, p.position.y, 0);
    group.add(p);
  }

  return {
    group,
    update(t) {
      time.value = t;
    },
    setDim(d) {
      dim.value = d;
      hemi.intensity = 1.7 * (1 - d * 0.7);
    },
  };
}
