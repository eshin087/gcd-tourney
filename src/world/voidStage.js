// Domain Expansion: Unlimited Void (Gojo's super): the arena is swapped for an endless void. Same floor height as the
// ring, so the fight keeps going exactly where it was. The anime's sequence (ENG-SKL-GOJ, the super's data in
// SUPERS.unlimitedVoid): a black sphere bursts out of him and swallows the arena (`open` frames; Game.syncView keeps
// the arena until it has), then the cosmos inside: a blinding white-blue light on the horizon behind the fight, a
// galaxy swirl round it, starlight streaming out of it and a mirror floor; the frozen opponent's head floods with
// light (`flood`), and when it ends the void shatters like glass (`shatter`). View only: the simulation knows
// Game.domain alone, and a domain restored by a rollback simply shows the void.
import * as THREE from 'three';
import { RING_TOP } from '../game/constants.js';
import { SUPERS } from '../game/moves.js';
import { kitOf } from '../game/kit.js';

const VS = /* glsl */ `
  varying vec3 vW;
  void main() {
    vec4 w = modelMatrix * vec4(position, 1.0);
    vW = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }`;

// The cosmos seen in direction n: deep black, a faint indigo nebula, log-spiral galaxy arms round the core (uCore, kept
// behind the fight on screen), the blinding core and the horizon line through it, starlight streaming out of the core
// and stars; `sky` 0 leaves out the arms and the starlight (the mirror floor: reflected they snake). Hard bands (band) so
// it reads like the pixel art rather than a soft gradient. Linear colors: keep the dark ones very dark, the output
// encoding lifts them.
const COSMOS = /* glsl */ `
  uniform float uTime, uDim;
  uniform vec3 uCore;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float band(float x, float n) { return floor(clamp(x, 0.0, 1.0) * n + 0.5) / n; }
  vec3 cosmos(vec3 n, float sky) {
    float ang = acos(clamp(dot(n, uCore), -1.0, 1.0));
    vec3 ax1 = normalize(cross(uCore, vec3(0.0, 1.0, 0.0)));
    vec3 ax2 = cross(ax1, uCore);
    float th = atan(dot(n, ax2), dot(n, ax1));
    vec3 c = vec3(0.003, 0.002, 0.012);
    c += vec3(0.012, 0.008, 0.035) * band(exp(-ang * 1.6), 4.0);
    float arm = sin(2.0 * th + 6.0 * log(ang + 0.04) - uTime * 0.5);
    c += vec3(0.05, 0.09, 0.26) * band(smoothstep(0.8, 0.98, arm) * exp(-ang * 2.2), 3.0) * sky;
    c += vec3(0.95, 1.0, 1.35) * band(exp(-ang * 9.0), 5.0) * 1.6;
    c += vec3(0.4, 0.6, 1.0) * band(exp(-abs(n.y - uCore.y) * 45.0) * exp(-ang * 1.1), 3.0) * 0.7;
    float lanes = 48.0, u = (th + 3.14159) / 6.28318 * lanes, lane = floor(u);
    float pos = fract(ang * 0.55 - uTime * (0.35 + hash(vec2(lane, 3.0)) * 0.9) + hash(vec2(lane, 9.0)));
    float streak = step(0.9, pos) * step(0.5, hash(vec2(lane, 1.0))) * step(abs(fract(u) - 0.5), 0.1);
    c += vec3(0.6, 0.75, 1.15) * streak * (0.3 + 0.7 * exp(-ang * 0.8)) * sky;
    float lon = atan(n.z, n.x), lat = asin(clamp(n.y, -1.0, 1.0));
    vec2 g = vec2(lon * 70.0, lat * 70.0), cell = floor(g);
    float h = hash(cell);
    c += vec3(0.9, 0.95, 1.2) * step(0.982, h) * step(length(fract(g) - 0.5), 0.22) * (0.6 + 0.4 * sin(uTime * 3.0 + h * 40.0));
    return c * (1.0 - uDim * 0.5);
  }`;

const SKY_FS = /* glsl */ `
  ${COSMOS}
  varying vec3 vW;
  void main() {
    gl_FragColor = vec4(cosmos(normalize(vW), 1.0), 1.0);
  }`;

// a black mirror: the cosmos reflected (more of it at grazing angles, so the far floor carries the blinding horizon the
// fight camera rarely sees), rippling a little, with faint rings running out from the middle
const FLOOR_FS = /* glsl */ `
  ${COSMOS}
  varying vec3 vW;
  void main() {
    vec3 v = normalize(vW - cameraPosition);
    vec3 r = reflect(v, vec3(0.0, 1.0, 0.0));
    float d = length(vW.xz);
    r.xz += 0.006 * sin(d * 3.0 - uTime * 1.5);
    float fres = 0.18 + 0.82 * pow(1.0 - abs(v.y), 4.0);
    vec3 c = cosmos(normalize(r), 0.0) * fres * 0.8;
    float ring = step(0.475, abs(fract(d * 0.35 - uTime * 0.25) - 0.5));
    c += vec3(0.035, 0.05, 0.12) * ring * exp(-d * 0.12);
    gl_FragColor = vec4(c, 1.0);
  }`;

// the domain's black sphere bursting out of him: black, with a hard white-blue rim at its silhouette
const SPHERE_VS = /* glsl */ `
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vec4 w = modelMatrix * vec4(position, 1.0);
    vN = normalize(mat3(modelMatrix) * normal);
    vV = normalize(cameraPosition - w.xyz);
    gl_Position = projectionMatrix * viewMatrix * w;
  }`;
const SPHERE_FS = /* glsl */ `
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    float f = 1.0 - abs(dot(normalize(vN), normalize(vV)));
    float rim = floor(pow(f, 3.0) * 4.0 + 0.2) / 4.0;
    gl_FragColor = vec4(vec3(0.75, 0.9, 1.4) * rim, 1.0);
  }`;

const tmp = new THREE.Vector3();

// the super's look for a domain owner (its SUPER), or null for a domain without one
function lookOf(f) {
  const S = f && SUPERS[kitOf(f.def).super];
  return S?.kind === 'domain' && S.open ? S : null;
}

export function buildVoidStage(scene) {
  const group = new THREE.Group();
  group.visible = false;
  scene.add(group);
  const time = { value: 0 }, dim = { value: 0 }, core = { value: new THREE.Vector3(0, 0.04, -1).normalize() };
  const uniforms = { uTime: time, uDim: dim, uCore: core };
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(300, 48, 24),
    new THREE.ShaderMaterial({ vertexShader: VS, fragmentShader: SKY_FS, uniforms, side: THREE.BackSide, depthWrite: false }),
  );
  sky.renderOrder = -10;
  group.add(sky);
  const floor = new THREE.Mesh(new THREE.CircleGeometry(60, 64), new THREE.ShaderMaterial({ vertexShader: VS, fragmentShader: FLOOR_FS, uniforms }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = RING_TOP - 0.002;
  group.add(floor);
  // lit things (debris) still need a light while the arena is hidden
  group.add(new THREE.HemisphereLight(0xbfd8ff, 0x101030, 1.4));

  // the opening sphere lives outside the group: it shows over the arena it swallows
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 20), new THREE.ShaderMaterial({ vertexShader: SPHERE_VS, fragmentShader: SPHERE_FS }));
  sphere.visible = false;
  scene.add(sphere);
  let opening = null; // { at, t, len } while the sphere grows
  let shatter = null; // the super whose shatter plays on the next update
  const coreDir = new THREE.Vector3();

  return {
    group,
    // the sphere is still swallowing the arena (Game.syncView keeps the arena until it has)
    get opening() {
      return !!opening;
    },
    // something to draw after the domain ended (the shatter)
    get busy() {
      return !!opening || !!shatter;
    },
    // Game.startDomain: the black sphere bursts out of f's chest
    open(f, S) {
      if (!S?.open) return;
      opening = { at: new THREE.Vector3(f.pos.x, RING_TOP + f.pos.y + 0.9, f.pos.z), t: 0, len: S.open / 60 };
      sphere.position.copy(opening.at);
      sphere.scale.setScalar(0.2);
      sphere.visible = true;
    },
    // Game.endDomain: the void shatters like glass. False when the domain has no look (the caller flashes instead)
    close(owner) {
      opening = null;
      sphere.visible = false;
      const S = lookOf(owner);
      if (!S?.shatter) return false;
      shatter = S;
      return true;
    },
    update(t, game, dt = 0) {
      time.value = t;
      const cam = game.camera;
      // the core sits on the horizon straight behind the fight, easing round as the camera turns
      cam.getWorldDirection(coreDir);
      coreDir.y = 0;
      if (coreDir.lengthSq() > 1e-6) {
        coreDir.normalize().setY(0.04).normalize();
        core.value.lerp(coreDir, Math.min(1, dt * 3)).normalize();
      }
      if (opening) {
        if (!game.domain) { opening = null; sphere.visible = false; }
        else {
          opening.t += dt;
          const u = Math.min(1, opening.t / opening.len), reach = cam.position.distanceTo(opening.at) + 1.5;
          sphere.scale.setScalar(Math.max(0.2, reach * (1 - (1 - u) * (1 - u))));
          if (u >= 1) { opening = null; sphere.visible = false; }
        }
      }
      if (shatter) {
        // a pane of black glass over the whole view, cracking open onto the arena
        const S = shatter, d = 3;
        shatter = null;
        const at = () => {
          cam.getWorldDirection(tmp);
          return { x: cam.position.x + tmp.x * d, y: cam.position.y + tmp.y * d - RING_TOP, z: cam.position.z + tmp.z * d };
        };
        const p = at(), h = 2 * d * Math.tan(THREE.MathUtils.degToRad(cam.fov) / 2), w = h * cam.aspect;
        const it = game.fx.spawn(S.shatter, p.x, p.y, p.z, { depthTest: false, order: 30, follow: at });
        const s = Math.max(w, h) * 1.12;
        it.base = s;
        it.mesh.scale.set(s, s, s);
      }
      const S = game.domain && !opening ? lookOf(game.domain.owner) : null;
      if (!S) return;
      // starlight streaming past: specks far behind the fight rushing at the camera (the sky's own streaks are mostly
      // above the fight camera's frame)
      if (dt > 0 && Math.random() < 0.7) {
        cam.getWorldDirection(tmp);
        const R = game.cam.right, d = 10 + Math.random() * 12, sx = (Math.random() - 0.5) * 18, sy = Math.random() * 7 - 1.5;
        game.fx.spawn('star', cam.position.x + tmp.x * d + R.x * sx, cam.position.y + tmp.y * d + sy - RING_TOP, cam.position.z + tmp.z * d + R.z * sx, {
          scale: 0.12 + Math.random() * 0.1, frame: 2, vel: [-tmp.x * 22, -tmp.y * 22, -tmp.z * 22], life: 0.5, color: 0xd8f0ff, glow: 0.8, order: 2,
        });
      }
      // the frozen opponent's head floods with light
      const v = game.domain.owner.opp;
      if (S.flood && v && !v.ko && v.state === 'held') {
        const p = v.renderPos || v.pos, k = v.actor?.depthK ?? 1;
        game.fx.keep('voidFlood' + v.index, S.flood.fx, p.x, p.y + headUp(v, S.flood.up) * k, p.z, { scale: (S.flood.scale ?? 0.6) * k, order: 9, depthTest: false });
      }
    },
    setDim(d) {
      dim.value = d;
    },
  };
}

// the top of the drawn body less a little (its hurt box, an art pack's), or `up` units
function headUp(v, up = 1.5) {
  const a = v.actor, boxes = a?.asset?.boxes?.(a.frame, 'hurt');
  if (!boxes?.length) return up;
  return Math.max(...boxes.map((b) => b.y1)) - 0.18;
}
