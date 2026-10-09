// Domain Expansion: Unlimited Void (Gojo's super): the arena is swapped for an endless starry
// void with streaks of light rushing toward the fighters. Same floor height as the ring, so the
// fight keeps going exactly where it was.
import * as THREE from 'three';
import { RING_TOP } from '../game/constants.js';

const VS = /* glsl */ `
  varying vec3 vW;
  void main() {
    vec4 w = modelMatrix * vec4(position, 1.0);
    vW = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }`;

const FS = /* glsl */ `
  uniform float uTime, uDim;
  varying vec3 vW;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  void main() {
    vec3 n = normalize(vW);
    float lon = atan(n.z, n.x), lat = asin(clamp(n.y, -1.0, 1.0));
    // deep blue-black with a faint violet band at the horizon
    vec3 c = mix(vec3(0.004, 0.003, 0.02), vec3(0.03, 0.015, 0.08), exp(-abs(lat) * 3.5));
    // stars
    vec2 g = vec2(lon * 60.0, lat * 60.0);
    vec2 cell = floor(g);
    float h = hash(cell);
    float star = step(0.985, h) * (1.0 - smoothstep(0.0, 0.3, length(fract(g) - 0.5))) * (0.6 + 0.4 * sin(uTime * 3.0 + h * 40.0));
    c += vec3(0.9, 0.95, 1.2) * star;
    // streaks of light rushing in (the information flood)
    float lane = floor(lon * 40.0);
    float speed = 0.6 + hash(vec2(lane, 3.0)) * 1.6;
    float pos = fract(lat * 0.8 + uTime * speed + hash(vec2(lane, 9.0)));
    float streak = smoothstep(0.92, 1.0, pos) * step(0.55, hash(vec2(lane, 1.0))) * (1.0 - smoothstep(0.0, 0.06, abs(fract(lon * 40.0) - 0.5)));
    c += vec3(0.75, 0.85, 1.25) * streak * 0.9;
    c *= 1.0 - uDim * 0.5;
    gl_FragColor = vec4(c, 1.0);
  }`;

const FLOOR_FS = /* glsl */ `
  uniform float uTime;
  varying vec3 vW;
  void main() {
    float d = length(vW.xz);
    // thin bright rings at the period edges (smoothstep needs edge0 < edge1)
    float ring = smoothstep(0.43, 0.5, abs(fract(d * 0.35 - uTime * 0.25) - 0.5));
    vec3 c = vec3(0.01, 0.01, 0.03) + vec3(0.25, 0.32, 0.6) * ring * exp(-d * 0.08);
    gl_FragColor = vec4(c, 1.0);
  }`;

export function buildVoidStage(scene) {
  const group = new THREE.Group();
  group.visible = false;
  scene.add(group);
  const time = { value: 0 }, dim = { value: 0 };
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(300, 48, 24),
    new THREE.ShaderMaterial({ vertexShader: VS, fragmentShader: FS, uniforms: { uTime: time, uDim: dim }, side: THREE.BackSide, depthWrite: false }),
  );
  sky.renderOrder = -10;
  group.add(sky);
  const floor = new THREE.Mesh(new THREE.CircleGeometry(60, 64), new THREE.ShaderMaterial({ vertexShader: VS, fragmentShader: FLOOR_FS, uniforms: { uTime: time } }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = RING_TOP - 0.002;
  group.add(floor);
  // lit things (debris) still need a light while the arena is hidden
  group.add(new THREE.HemisphereLight(0xbfd8ff, 0x101030, 1.4));
  return {
    group,
    update(t) {
      time.value = t;
    },
    setDim(d) {
      dim.value = d;
    },
  };
}
