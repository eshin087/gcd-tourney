import * as THREE from 'three';
import * as T from '../art/textures.js';
import { bakeCrowd, bakeAnnouncer, CROWD_W, CROWD_H } from '../art/crowdPainter.js';
import { CROWD_PPU as PPU } from '../game/constants.js';
import { RING_HALF, RING_TOP } from '../game/constants.js';
import { hasArt, fetchAtlasJson } from '../core/artIndex.js';
import { loadImage } from '../game/sprites.js';
import { NPCS, NPC_CUES, NpcSprite } from './worldArt.js';

const lambert = (map, extra = {}) => new THREE.MeshLambertMaterial({ map, ...extra });

// Stage slots (art/stage/ASSETS.md): every painted texture is registered under its slot name, so packed stage
// art can replace the image later without touching geometry or repeat counts (the world coverage stays the
// same whatever the image size). Clones made by repeatTex join their base's slot.
let slotTextures = new Map();
const slotOf = new WeakMap();
function slotTex(slot, tex) {
  if (!slotTextures.has(slot)) slotTextures.set(slot, []);
  slotTextures.get(slot).push(tex);
  slotOf.set(tex, slot);
  return tex;
}
const BANNER_SLOT = { 武: 'bannerBu', 道: 'bannerDo', 祭: 'bannerSai', 闘: 'bannerTo' };
const LANTERN_SLOT = { 武: 'lanternBu', 祭: 'lanternSai' };
const CLOUD_SLOTS = ['cloudA', 'cloudB', 'cloudC'];
const TREE_SLOTS = ['treeRoundA', 'treeRoundB', 'treePine', 'treePalm'];

function repeatTex(base, rx, ry) {
  const t = base.clone();
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(rx, ry);
  t.needsUpdate = true;
  if (slotOf.has(base)) slotTex(slotOf.get(base), t);
  return t;
}

function box(w, h, d, mat, x, y, z, opts = {}) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  if (opts.cast) m.castShadow = true;
  if (opts.receive !== false) m.receiveShadow = true;
  return m;
}

// Crowd atlas descriptor (procedural or packed art, ADR 0008):
//   texture, grid [cols, rows] in cells, frames (2: idle/cheer, 3: + shocked), step [dx, dy] from one
//   frame's cell to the next, size [w, h] world units per cell, lift (world units: feet above the cell
//   bottom, negative = sink), entries [[col, row], ...] = each spectator's idle cell.
function proceduralCrowdAtlas() {
  const a = bakeCrowd(28, 9);
  return {
    texture: T.toTex(a.canvas),
    grid: [a.count, 2],
    frames: 2,
    step: [0, 1],
    size: [CROWD_W / PPU, CROWD_H / PPU],
    lift: 0,
    entries: Array.from({ length: a.count }, (_, v) => [v, 0]),
    source: 'procedural',
  };
}

// public/crowd/atlas.{json,png} from `npm run sprites crowd` (approved spectators only; ?art=custom prefers the
// candidates in public/preview/crowd/). Returns null (procedural crowd) when absent.
export async function loadCrowdAtlas() {
  try {
    const found = await fetchAtlasJson('/crowd');
    if (!found) return null;
    const { data: m, dir } = found;
    if (!hasArt(`${dir}/atlas.png`)) {
      console.warn('[crowd] atlas.json found but atlas.png is missing, keeping the procedural crowd');
      return null;
    }
    const img = await loadImage(`${dir}/atlas.png?v=${Date.now()}`);
    if (!img) {
      console.warn('[crowd] atlas.json found but atlas.png is missing or unreadable, keeping the procedural crowd');
      return null;
    }
    const [cw, ch] = m.cell || [64, 96];
    const cols = m.cols || Math.floor(img.width / cw);
    const ppu = m.ppu || 50;
    const pivotY = m.pivot?.[1] ?? ch - 2;
    const entries = (m.spectators || []).map((sp) => [sp.cell % cols, Math.floor(sp.cell / cols)]);
    if (!entries.length) {
      console.warn('[crowd] atlas.json lists no spectators, keeping the procedural crowd');
      return null;
    }
    const tex = new THREE.Texture(img);
    tex.magFilter = tex.minFilter = THREE.NearestFilter;
    tex.generateMipmaps = false;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return {
      texture: tex,
      grid: [img.width / cw, img.height / ch],
      frames: (m.frames || ['idle', 'cheer', 'shocked']).length,
      step: [1, 0],
      size: [cw / ppu, ch / ppu],
      lift: -(ch - 1 - pivotY) / ppu,
      entries,
      source: 'custom',
    };
  } catch (e) {
    console.warn('[crowd] custom crowd atlas failed, keeping the procedural crowd', e);
    return null;
  }
}

// Billboarded, instanced crowd. Every seat shows its own spectator (reshuffled per match);
// they flip idle/cheer on their own rhythm, uExcite makes them go wild and uShock (KOs, supers,
// clashes) switches most of them to the shocked frame when the atlas has one.
function makeCrowd(positions, atlas) {
  const base = new THREE.PlaneGeometry(1, 1);
  base.translate(0, 0.5, 0);
  const geo = new THREE.InstancedBufferGeometry();
  geo.index = base.index;
  geo.attributes.position = base.attributes.position;
  geo.attributes.uv = base.attributes.uv;
  const n = positions.length;
  const aPos = new Float32Array(n * 3), aPhase = new Float32Array(n);
  positions.forEach((p, i) => {
    aPos.set([p.x, p.y, p.z], i * 3);
    aPhase[i] = Math.random();
  });
  geo.setAttribute('aPos', new THREE.InstancedBufferAttribute(aPos, 3));
  geo.setAttribute('aCell', new THREE.InstancedBufferAttribute(new Float32Array(n * 2), 2));
  geo.setAttribute('aPhase', new THREE.InstancedBufferAttribute(aPhase, 1));
  geo.instanceCount = n;
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      map: { value: null },
      uTime: { value: 0 },
      uExcite: { value: 0 },
      uShock: { value: 0 },
      uDim: { value: 0 },
      uSize: { value: new THREE.Vector2() },
      uGrid: { value: new THREE.Vector2() },
      uStep: { value: new THREE.Vector2() },
      uFrames: { value: 2 },
      uLift: { value: 0 },
    },
    vertexShader: /* glsl */ `
      attribute vec3 aPos; attribute vec2 aCell; attribute float aPhase;
      uniform float uTime, uExcite, uShock, uFrames, uLift; uniform vec2 uSize, uGrid, uStep;
      varying vec2 vUv;
      void main() {
        vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
        vec3 up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
        vec3 back = vec3(viewMatrix[0][2], viewMatrix[1][2], viewMatrix[2][2]);
        // each spectator keeps their own steady tempo (0.3-0.55 cycles/s calm); excitement speeds up the shared
        // clock (uTime, advanced on the CPU), never the multiplier, so phases never jump when the mood changes
        float rate = 2.0 + aPhase * 1.5;
        float s = sin(uTime * rate + aPhase * 40.0);
        float cheer = step(0.75 - uExcite * 0.9, s);
        // most of the stand gasps on big moments; a few keep cheering
        float shocked = uFrames > 2.5 ? step(1.0 - uShock * 0.85, fract(aPhase * 7.31)) : 0.0;
        float frame = shocked > 0.5 ? 2.0 : cheer;
        float hop = shocked > 0.5 ? 0.0 : max(0.0, s) * (0.03 + uExcite * 0.12);
        // tiny depth jitter so overlapping neighbours never z-fight
        vec3 wp = aPos + right * (position.x * uSize.x) + up * (position.y * uSize.y + uLift) + back * (aPhase - 0.5) * 0.06 + vec3(0.0, hop, 0.0);
        gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);
        vec2 cell = aCell + uStep * frame;
        vUv = vec2((cell.x + uv.x) / uGrid.x, 1.0 - (cell.y + 1.0 - uv.y) / uGrid.y);
      }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D map; uniform float uDim; varying vec2 vUv;
      void main() {
        vec4 c = texture2D(map, vUv);
        if (c.a < 0.5) discard;
        gl_FragColor = vec4(c.rgb * 0.97 * (1.0 - uDim * 0.8) * vec3(1.0 - uDim * 0.1, 1.0 - uDim * 0.18, 1.0), 1.0);
        #include <colorspace_fragment>
      }`,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.frustumCulled = false;
  const crowd = {
    mesh,
    atlas: null,
    // point every seat at a spectator: a shuffled pass through the roster, repeated only when
    // there are more seats than spectators, so nobody sits next to their twin
    shuffle() {
      const A = crowd.atlas, cells = geo.attributes.aCell;
      let pool = [];
      for (let i = 0; i < n; i++) {
        if (!pool.length) {
          pool = A.entries.slice();
          for (let k = pool.length - 1; k > 0; k--) {
            const j = Math.floor(Math.random() * (k + 1));
            [pool[k], pool[j]] = [pool[j], pool[k]];
          }
        }
        const [c, r] = pool.pop();
        cells.setXY(i, c, r);
      }
      cells.needsUpdate = true;
    },
    setAtlas(A) {
      if (crowd.atlas?.source === 'custom' && crowd.atlas.texture !== A.texture) crowd.atlas.texture.dispose();
      crowd.atlas = A;
      const u = mat.uniforms;
      u.map.value = A.texture;
      u.uSize.value.set(A.size[0], A.size[1]);
      u.uGrid.value.set(A.grid[0], A.grid[1]);
      u.uStep.value.set(A.step[0], A.step[1]);
      u.uFrames.value = A.frames;
      u.uLift.value = A.lift;
      crowd.shuffle();
    },
  };
  crowd.setAtlas(atlas);
  return crowd;
}

function billboard(canvas, w, h, x, y, z, ppu = PPU, slot = null) {
  const map = T.toTex(canvas);
  if (slot) slotTex(slot, map);
  const mat = new THREE.SpriteMaterial({ map, alphaTest: 0.5, transparent: false });
  const s = new THREE.Sprite(mat);
  s.center.set(0.5, 0);
  s.scale.set(w || canvas.width / ppu, h || canvas.height / ppu, 1);
  s.position.set(x, y, z);
  return s;
}

function gableRoof(len, depth, rise, mat, x, y, z, overhang = 0.6) {
  const g = new THREE.Group();
  const half = depth / 2 + overhang;
  const slope = Math.hypot(half, rise);
  const ang = Math.atan2(rise, half);
  for (const s of [-1, 1]) {
    const b = box(len + overhang * 2, 0.28, slope, mat, 0, rise / 2, (s * half) / 2);
    b.rotation.x = s * ang;
    g.add(b);
  }
  // ridge beam
  g.add(box(len + overhang * 2 + 0.2, 0.3, 0.4, mat, 0, rise + 0.05, 0));
  g.position.set(x, y, z);
  return g;
}

function slopeAwning(len, depth, drop, mat, x, y, z) {
  const b = box(len, 0.22, Math.hypot(depth, drop), mat, x, y - drop / 2, z + depth / 2);
  b.rotation.x = Math.atan2(drop, depth);
  return b;
}

export function buildArena(scene) {
  slotTextures = new Map();
  const slots = slotTextures;
  const world = new THREE.Group();
  scene.add(world);

  // ---------------------------------------------------------------- lights & sky
  const hemi = new THREE.HemisphereLight(0xe8f2ff, 0x9a8a6a, 1.55);
  world.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff0d8, 2.3);
  sun.position.set(-9, 22, 13);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  const sc = sun.shadow.camera;
  sc.left = -17; sc.right = 17; sc.top = 17; sc.bottom = -17; sc.near = 1; sc.far = 70;
  sun.shadow.bias = -0.0008;
  world.add(sun, sun.target);

  const sky = new THREE.Mesh(new THREE.SphereGeometry(400, 16, 12), new THREE.MeshBasicMaterial({ map: slotTex('sky', T.skyTexture()), side: THREE.BackSide, depthWrite: false, fog: false }));
  sky.renderOrder = -10;
  world.add(sky);
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2 + 0.3;
    const cl = billboard(T.cloudCanvas(100 + i), 0, 0, Math.cos(a) * 220, 40 + (i % 3) * 18, Math.sin(a) * 220, 1.4, CLOUD_SLOTS[i % 3]);
    world.add(cl);
  }

  // ---------------------------------------------------------------- ground
  const grassTex = slotTex('grass', T.grassTexture());
  const grass = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), lambert(repeatTex(grassTex, 50, 50)));
  grass.rotation.x = -Math.PI / 2;
  grass.receiveShadow = true;
  world.add(grass);

  const pathTex = slotTex('path', T.pathTexture());
  const pathMat = (len) => lambert(repeatTex(pathTex, 2, len / 2));
  const path = (x, z, w, len) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, len), pathMat(len));
    m.rotation.x = -Math.PI / 2;
    m.position.set(x, 0.02, z);
    m.receiveShadow = true;
    world.add(m);
  };
  path(0, -15, 4, 12); // temple -> ring
  path(0, 25, 4, 32); // ring -> gate
  path(0, 50, 4, 20); // outside the gate

  // ---------------------------------------------------------------- ring
  const S = RING_HALF * 2;
  const sideTex = slotTex('ringSide', T.ringSideTexture());
  const sideMat = lambert(repeatTex(sideTex, S / 4, 1));
  const topMat = lambert(slotTex('ringTop', T.ringTopTexture(S, 24)));
  const ring = new THREE.Mesh(new THREE.BoxGeometry(S, RING_TOP, S), [sideMat, sideMat, topMat, sideMat, sideMat, sideMat]);
  ring.position.y = RING_TOP / 2;
  ring.receiveShadow = true;
  world.add(ring);
  const lip = box(S + 0.7, 0.18, S + 0.7, lambert(repeatTex(sideTex, S / 3, 0.3)), 0, 0.09, 0);
  world.add(lip);

  // ---------------------------------------------------------------- temple
  const plaster = slotTex('plaster', T.plasterTexture());
  const plasterMat = (rx, ry) => lambert(repeatTex(plaster, rx, ry));
  const woodTex = slotTex('wood', T.woodTexture());
  const woodMat = lambert(repeatTex(woodTex, 1, 1));
  const darkWoodMat = lambert(repeatTex(slotTex('woodDark', T.woodTexture('#6e4a2e')), 1, 1));
  const roofTexBase = slotTex('roof', T.roofTexture('#5e4436'));
  const roofMat = lambert(repeatTex(roofTexBase, 16, 4));
  const stoneTex = slotTex('stoneBase', T.stoneBaseTexture());
  const stoneMat = (rx, ry) => lambert(repeatTex(stoneTex, rx, ry));

  const TZ = -24;
  world.add(box(32, 0.9, 8, stoneMat(16, 1), 0, 0.45, TZ));
  const facade = lambert(slotTex('templeFacade', T.templeFacadeTexture()));
  const side = plasterMat(3, 3);
  world.add(box(28, 7, 6, [side, side, plasterMat(14, 3), side, facade, side], 0, 0.9 + 3.5, TZ));
  world.add(gableRoof(28, 6, 2.8, roofMat, 0, 7.9, TZ, 1.2));
  world.add(slopeAwning(28.6, 1.6, 0.7, roofMat, 0, 0.9 + 4.3, TZ + 3));
  // steps
  const stepsTex = slotTex('steps', T.stepsTexture());
  for (let i = 0; i < 3; i++) {
    world.add(box(6, 0.3 * (3 - i), 0.7, lambert(repeatTex(stepsTex, 3, 1)), 0, 0.15 * (3 - i), TZ + 4 + i * 0.7));
  }
  // banners
  const banners = [['#c8323c', '#fff0d0', '武'], ['#2a4a8a', '#f4f4ff', '道'], ['#2a4a8a', '#f4f4ff', '祭'], ['#c8323c', '#fff0d0', '闘']];
  [-10.5, -6.5, 6.5, 10.5].forEach((x, i) => {
    const [bg, fg, g] = banners[i];
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 3.2), new THREE.MeshLambertMaterial({ map: slotTex(BANNER_SLOT[g], T.bannerTexture(bg, fg, g)), alphaTest: 0.5, side: THREE.DoubleSide }));
    m.position.set(x, 0.9 + 4.6, TZ + 3.05);
    world.add(m);
  });

  // ---------------------------------------------------------------- props: gong, parasols, announcer
  const gong = new THREE.Group();
  gong.add(box(0.25, 2.8, 0.25, darkWoodMat, -1.1, 1.4, 0, { cast: true }));
  gong.add(box(0.25, 2.8, 0.25, darkWoodMat, 1.1, 1.4, 0, { cast: true }));
  gong.add(box(2.7, 0.25, 0.3, darkWoodMat, 0, 2.75, 0, { cast: true }));
  const disc = new THREE.Mesh(new THREE.CircleGeometry(0.85, 20), new THREE.MeshLambertMaterial({ map: slotTex('gong', T.gongTexture()), side: THREE.DoubleSide }));
  disc.position.set(0, 1.65, 0);
  disc.castShadow = true;
  gong.add(disc);
  gong.position.set(-9.5, 0, -15.5);
  gong.rotation.y = 0.25;
  world.add(gong);

  const parasolTex = slotTex('parasol', T.parasolTexture());
  const parasol = (x, z) => {
    const g = new THREE.Group();
    const cone = new THREE.Mesh(new THREE.ConeGeometry(1.7, 0.8, 16, 1, true), new THREE.MeshLambertMaterial({ map: repeatTex(parasolTex, 2, 1), alphaTest: 0.5, side: THREE.DoubleSide }));
    cone.position.y = 2.7;
    cone.castShadow = true;
    g.add(cone);
    g.add(box(0.08, 2.6, 0.08, darkWoodMat, 0, 1.3, 0));
    g.add(box(1.9, 0.12, 0.9, woodMat, 0, 0.75, 0.2, { cast: true }));
    g.add(box(0.1, 0.7, 0.1, darkWoodMat, -0.8, 0.35, 0.2));
    g.add(box(0.1, 0.7, 0.1, darkWoodMat, 0.8, 0.35, 0.2));
    g.position.set(x, 0, z);
    world.add(g);
  };
  parasol(-13.2, -15);
  parasol(13.2, -15);
  // the painted announcer; a packed announcer sheet (setNpcArt) replaces it
  const announcer = billboard(bakeAnnouncer(), 0, 0, -11.8, 0, -14.4);
  world.add(announcer);

  // ---------------------------------------------------------------- stands + crowd
  const brickTex = slotTex('brick', T.brickTexture());
  const crowdPos = [];
  const R = Math.random;
  const tierStep = 1.25, tierRise = 0.7, wallH = 1.25;
  const TIERS = 6; // a packed tournament: ~500 seats so a 500+ spectator roster rarely repeats
  const addCrowdRow = (x0, z0, x1, z1, y, density = 1.05, skipFn = null) => {
    const len = Math.hypot(x1 - x0, z1 - z0);
    const n = Math.floor(len / density);
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5 + (R() - 0.5) * 0.35) / n;
      const x = x0 + (x1 - x0) * t, z = z0 + (z1 - z0) * t;
      if (skipFn && skipFn(x, z)) continue;
      if (R() < 0.06) continue;
      crowdPos.push(new THREE.Vector3(x, y, z));
    }
  };
  // side stands (left/right), tiers rise outward
  for (const s of [-1, 1]) {
    const x0 = s * 12.6;
    const zA = -13, zB = 13;
    const L = zB - zA;
    world.add(box(0.4, wallH, L, lambert(repeatTex(brickTex, L / 2, 1)), x0, wallH / 2, 0));
    for (let i = 0; i < TIERS; i++) {
      const h = wallH - 0.35 + i * tierRise;
      const xc = x0 + s * (0.2 + tierStep * (i + 0.5));
      world.add(box(tierStep, h, L, [stoneMat(1, 1), stoneMat(1, 1), lambert(repeatTex(stepsTex, 1, L)), stoneMat(1, 1), stoneMat(1, h), stoneMat(1, h)], xc, h / 2, 0));
      addCrowdRow(xc, zA + 0.5, xc, zB - 0.5, h, 0.82, (x, z) => Math.abs(z) < 0.7 || Math.abs(Math.abs(z) - 8) < 0.6);
    }
    // aisle stairs
    for (const az of [-8, 0, 8]) world.add(box(tierStep * TIERS, 0.12, 1.0, lambert(repeatTex(stepsTex, 2, 1)), x0 + s * (0.2 + tierStep * TIERS / 2), wallH + 0.9, az));
    // standing room: fans packed against the stand wall at ground level
    addCrowdRow(x0 - s * 0.55, zA + 0.8, x0 - s * 0.55, zB - 0.8, 0, 0.9, (x, z) => Math.abs(z) < 1.2);
  }
  // front stands (either side of the entrance path), tiers rise toward the gate
  for (const s of [-1, 1]) {
    const xa = s * 3.2, xb = s * 12.4;
    const xc = (xa + xb) / 2, L = Math.abs(xb - xa);
    const z0 = 12.8;
    world.add(box(L, wallH, 0.4, lambert(repeatTex(brickTex, L / 2, 1)), xc, wallH / 2, z0));
    for (let i = 0; i < TIERS; i++) {
      const h = wallH - 0.35 + i * tierRise;
      const zc = z0 + 0.2 + tierStep * (i + 0.5);
      world.add(box(L, h, tierStep, [stoneMat(1, h), stoneMat(1, h), lambert(repeatTex(stepsTex, L, 1)), stoneMat(1, 1), stoneMat(L, h), stoneMat(L, h)], xc, h / 2, zc));
      addCrowdRow(xa + s * 0.5, zc, xb - s * 0.5, zc, h, 0.82);
    }
    addCrowdRow(xa + s * 0.5, z0 - 0.55, xb - s * 0.5, z0 - 0.55, 0, 0.9);
  }
  const crowd = makeCrowd(crowdPos, proceduralCrowdAtlas());
  world.add(crowd.mesh);

  // ---------------------------------------------------------------- outer walls + gate
  const wallTop = lambert(repeatTex(roofTexBase, 40, 1));
  const wall = (x, z, len, alongX) => {
    const w = alongX ? len : 0.6, d = alongX ? 0.6 : len;
    world.add(box(w, 0.9, d, stoneMat(len / 2, 1), x, 0.45, z));
    world.add(box(w, 2.1, d, plasterMat(len / 2, 1), x, 0.9 + 1.05, z));
    world.add(box(alongX ? len : 0.9, 0.2, alongX ? 0.9 : len, darkWoodMat, x, 3.05, z));
    world.add(box(alongX ? len + 0.2 : 1.3, 0.3, alongX ? 1.3 : len + 0.2, wallTop, x, 3.3, z));
  };
  const WX = 25, WZ = 31;
  wall(-WX, 0, WZ * 2, false);
  wall(WX, 0, WZ * 2, false);
  wall(0, -WZ, WX * 2, true);
  wall(-(WX + 3.6) / 2, WZ, WX - 3.6, true);
  wall((WX + 3.6) / 2, WZ, WX - 3.6, true);

  // gate
  const gate = new THREE.Group();
  const pillarMat = lambert(repeatTex(slotTex('woodPillar', T.woodTexture('#8a5634')), 1, 3));
  gate.add(box(0.7, 5.4, 0.7, pillarMat, -3.4, 2.7, 0, { cast: true }));
  gate.add(box(0.7, 5.4, 0.7, pillarMat, 3.4, 2.7, 0, { cast: true }));
  gate.add(box(8.6, 0.45, 0.6, darkWoodMat, 0, 4.9, 0));
  gate.add(box(7.4, 0.3, 0.5, darkWoodMat, 0, 4.1, 0));
  gate.add(gableRoof(8.4, 1.6, 0.9, lambert(repeatTex(roofTexBase, 6, 2)), 0, 5.15, 0, 0.6));
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 1.1), new THREE.MeshLambertMaterial({ map: slotTex('sign', T.signTexture('天下一武闘祭')), side: THREE.DoubleSide }));
  sign.position.set(0, 3.5, 0.36);
  gate.add(sign);
  const sign2 = sign.clone();
  sign2.position.z = -0.36;
  sign2.rotation.y = Math.PI;
  gate.add(sign2);
  for (const [x, g] of [[-3.4, '武'], [3.4, '祭']]) {
    const lan = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.95, 12), new THREE.MeshLambertMaterial({ map: slotTex(LANTERN_SLOT[g], T.lanternTexture(g)) }));
    lan.position.set(x, 2.6, 0.75);
    gate.add(lan);
    gate.add(box(0.5, 0.12, 0.5, darkWoodMat, x, 3.12, 0.75));
    gate.add(box(0.5, 0.12, 0.5, darkWoodMat, x, 2.08, 0.75));
    gate.add(box(0.05, 0.6, 0.05, darkWoodMat, x, 3.45, 0.75));
  }
  gate.position.set(0, 0, WZ);
  world.add(gate);

  // ---------------------------------------------------------------- trees
  const treeCanvases = [T.treeCanvas(3, 'round'), T.treeCanvas(4, 'round'), T.treeCanvas(5, 'pine'), T.treeCanvas(6, 'round')];
  const treeMats = treeCanvases.map((c, i) => new THREE.SpriteMaterial({ map: slotTex(TREE_SLOTS[i], T.toTex(c)), alphaTest: 0.5 }));
  const tree = (x, z, s) => {
    const sp = new THREE.Sprite(treeMats[Math.floor(Math.random() * treeMats.length)]);
    sp.center.set(0.5, 0);
    sp.scale.set(3 * s, 4 * s, 1);
    sp.position.set(x, 0, z);
    world.add(sp);
  };
  for (let i = 0; i < 70; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 36 + Math.random() * 40;
    const x = Math.cos(a) * r * 0.9, z = Math.sin(a) * r;
    if (Math.abs(x) < 6 && z > 30) continue;
    tree(x, z, 1.6 + Math.random() * 1.2);
  }
  for (const [x, z] of [[-6.5, 36], [6.5, 36], [-9, 41], [9, 41], [-21, -27], [21, -27], [-21, 27], [21, 27], [-6.2, 45], [6.2, 45]]) tree(x, z, 1.3 + Math.random() * 0.4);

  // unlit materials that should darken during super flashes
  const unlit = new Set([sky.material]);
  world.traverse((o) => { if (o.isSprite) unlit.add(o.material); });
  const baseHemi = hemi.intensity, baseSun = sun.intensity;
  const hemiSky = hemi.color.clone();
  const dimSky = new THREE.Color('#3a2a6a');
  let prevExcite = 0, shockT = 0, lastT = null, crowdClock = 0, mood = 0;
  const npcs = [];
  return {
    group: world,
    sun,
    crowd: crowd.mesh,
    seats: crowdPos.length,
    gong: disc,
    update(time, excite) {
      const u = crowd.mesh.material.uniforms;
      // a sudden jump in excitement (KO, super, clash) makes the stand gasp, then it fades
      if (excite - prevExcite > 0.3) shockT = 1.4;
      prevExcite = excite;
      const dt = Math.min(0.1, Math.max(0, time - (lastT ?? time)));
      lastT = time;
      // the stand warms up over ~0.3 s and calms over ~1.5 s instead of snapping with every hit, and the hype
      // speeds up the crowd's clock (up to ~2.6x) rather than each spectator's rate
      mood += (excite - mood) * Math.min(1, dt * (excite > mood ? 3 : 0.7));
      crowdClock += dt * (1 + mood * 1.6);
      u.uTime.value = crowdClock;
      u.uExcite.value = mood;
      shockT = Math.max(0, shockT - dt);
      u.uShock.value = Math.min(1, shockT / 0.6);
      for (const n of npcs) n.update(dt);
    },
    // packed stage art (worldArt.loadStageArt): Map(slot -> image). Returns the slots that were replaced.
    applyStageArt(art) {
      const used = [];
      for (const [slot, img] of art) {
        const list = slots.get(slot);
        if (!list) continue;
        for (const t of list) {
          t.dispose(); // the GPU copy has the painter's size; a new size needs a fresh upload
          t.image = img;
          t.magFilter = t.minFilter = THREE.NearestFilter;
          t.generateMipmaps = false;
          t.colorSpace = THREE.SRGBColorSpace;
          t.needsUpdate = true;
        }
        used.push(slot);
      }
      return used;
    },
    // packed NPC sheets (worldArt.loadNpcArt): Map(id -> { meta, image }). NPCs without a sheet are not placed.
    setNpcArt(art) {
      for (const n of npcs.splice(0)) {
        world.remove(n.sprite);
        unlit.delete(n.material);
        n.dispose();
      }
      announcer.visible = true;
      for (const def of NPCS) {
        const a = art.get(def.id);
        if (!a) continue;
        let n;
        try {
          n = new NpcSprite(def, a);
        } catch (e) {
          console.warn(`[npc] ${def.id}: sheet could not be used, not placed`, e);
          continue;
        }
        world.add(n.sprite);
        unlit.add(n.material); // unlit like the crowd: darkens with it during super flashes
        npcs.push(n);
        if (def.replaces === 'announcer') announcer.visible = false;
      }
      return npcs.map((n) => n.def.id);
    },
    // a game event (NPC_CUES: intro, roundStart, super, ultimate, clash, ko, crash, roundEnd)
    npcCue(kind) {
      const cue = NPC_CUES[kind];
      if (!cue) return;
      for (const n of npcs) if (cue[n.def.id]) n.play(...cue[n.def.id]);
    },
    setCrowdAtlas(A) {
      crowd.setAtlas(A);
    },
    shuffleCrowd() {
      crowd.shuffle();
    },
    setDim(d) {
      hemi.intensity = baseHemi * (1 - d * 0.78);
      sun.intensity = baseSun * (1 - d * 0.92);
      hemi.color.copy(hemiSky).lerp(dimSky, d);
      const k = 1 - d * 0.8;
      for (const m of unlit) m.color.setRGB(k * (1 - d * 0.1), k * (1 - d * 0.18), k);
      crowd.mesh.material.uniforms.uDim.value = d;
    },
  };
}

