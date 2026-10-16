// Ground damage (ENG-070, ADR 0024). Every hit, landing, slam, charge and crash that should mark the floor comes
// through here. A force (0 to 1.6) picks a tier and a size, from a hairline crack to a crater four bodies wide; a
// style picks the element look per move and fighter (data: `ground` on moves, projectiles, supers and characters,
// never an id check). One impact is a cluster of flat decals (underlay, satellite cracks, the crater, the style's
// overlay, rubble) plus a little 3D (rim chunks, jutting floor slabs, flying debris, a dust ring).
//
// Decals are lit like the floor (Lambert, so they dim with super flashes and take the fighters' shadows), clip at
// the ring edge, spread out from the middle, glow along their hot seams (pure #FFFFFF texels, the "hot key") in the
// fighter's tint and cool to soot, then dissolve pixel by pixel. Repeated slams in one spot grow one crater instead
// of stacking copies (merge), and an airborne victim's crater waits for where they actually land (impact debt).
// The art is the packed decal atlas (public/decals/, `npm run sprites decals`), merged per name over the
// procedural pages of src/art/decalPainter.js.
import * as THREE from 'three';
import { RING_HALF, RING_TOP, ARENA_LIMIT } from './constants.js';
import { SPECIAL_MOVES, SUPERS, PROJECTILES } from './moves.js';
import { kitOf } from './kit.js';
import { DECALS, bakeDecals, paintDecal } from '../art/decalPainter.js';
import { fetchAtlasJson } from '../core/artIndex.js';
import { loadImage } from './sprites.js';

// All the numbers (tune here).
export const GROUND = {
  // force -> tier: the decal, its diameter range in world units (cracks included; a fighter is ~1.6 tall), its
  // life in seconds (0: until the round resets) and how long its cracks take to spread out
  tiers: [
    { at: 0.15, name: 'crack_s', d: [1.4, 2.2], life: 6, reveal: 0.08 },
    { at: 0.35, name: 'crack', d: [2.0, 3.0], life: 10, reveal: 0.14 },
    { at: 0.55, name: 'crater', d: [2.6, 3.6], life: 16, reveal: 0.2 },
    { at: 0.85, name: 'crater_big', d: [3.8, 5.2], life: 26, reveal: 0.28 },
    { at: 1.15, name: 'crater_huge', d: [5.4, 7.6], life: 0, reveal: 0.35 },
  ],
  maxForce: 1.6,
  sizeJitter: 0.1, // ±10% diameter
  aspectJitter: 0.08, // radial decals 0.92-1.08 wide
  dirJitter: 12, // degrees off the movement for directional decals
  // where the force comes from
  // clamp((vy - from) / span): a launcher's fall (vy 14-18) cracks, an air heavy spike (vy 23-28) craters big
  fall: { from: 8, span: 26, bounce: 0.25, ko: 0.35, hard: 10, hardForce: 0.16 },
  hit: { spark: { light: 0.2, heavy: 0.45, smash: 0.6 }, dmg: 400, special: 0.15, superCost: 300, super: 0.35 },
  dive: { base: 0.7, hit: 0.2 },
  // fixed forces (impact `kind`)
  fixed: { trade: 1.0, slam: 0.55, roar: 1.2, ko: 1.1, clashWin: 1.35, clashDraw: 1.5, kirin: 1.5, crater: 0.7, chase: 0.25, shot: 0.6, shotSmall: 0.4, vortex: 0.75, ignite: 0.8, burn: 0.3 },
  debt: { frames: 90, minY: 0.3 }, // an airborne victim's crater waits up to this long for the floor
  // within reach * D of a younger crater at most one tier above the hit: it grows by `bonus` per tier of it (nothing
  // new when that would not reach a bigger tier); inside * D of a younger one two or more tiers bigger: nothing
  merge: { reach: 0.45, age: 4, bonus: 0.15, inside: 0.3 },
  life: { scuff: 3, skid: 3, extras: 26, overflow: 8 }, // extras: satellites and rubble of a persistent crater
  caps: { decals: 40, soft: 34, persistent: 8, barrier: 4, wallCraters: 4, chunks: 128, slabs: 20, trail: 24, pages: 4 },
  dissolve: { normal: 0.6, overflow: 0.35, merge: 0.25 },
  // ring damage drawn into the ring's own stone (GD_FLOOR): `depth` how far a pit's floor sinks per unit of decal
  // diameter (parallax), `bump` how strongly its slopes catch the scene light (`crackBump`: the drawn cracks' share),
  // `crackDark` the shade of a texel at depth 0 (cracks are mixed from it up to the stone), `snap` the depth above which a texel
  // counts as unbroken stone (the drawn rubble's mid tones; only cracks, pits and scorch stay), `surface` the
  // untouched stone tone the art is measured against (stone ring palette, art/decals/DECALS.md), `bowl` how deep the
  // ring sinks under each crater name (drawn in code, so the floor's own tiles slope into it)
  floor: { depth: 0.05, bump: 1.6, crackBump: 0.4, crackDark: 0.2, snap: 0.5, surface: '#e3d5bf', bowl: { crater: 0.7, crater_big: 0.85, crater_huge: 1, scour_spiral: 0.5, scour_spiral_big: 0.6, crush_implode: 0.9 } },
  // hot seams: a short, dim ember of the element's color (seconds = the style's heat x heatScale), never a neon line
  heatScale: 0.5,
  heatGlow: 0.9,
  trailStep: 0.9,
  satellites: { at: 0.85, n: [1, 3], dist: [0.45, 0.65], big: 1.15, bigN: [2, 4], underlay: 1.25 },
  rubble: { at: 0.7, d: 1.1, ring: false }, // ring: off since the stone draws its own damage (GD_FLOOR): the drawn pebble field read as a sticker, the 3D chunks are the rubble
  chunks: { at: 0.55, base: 4, per: 12, size: [0.05, 0.14] },
  slabs: { at: 0.85, n: [2, 5], tilt: [12, 30], ring: [0.35, 0.55], clear: 0.6, sink: 0.3 },
  dustRing: { at: 0.55, n: [7, 12], r: 0.3 },
  smoke: 1.15,
  // holding Special: one decal per fighter that grows at these frames; the full gauge gives the fighter's own fracture
  charge: [{ t: 30, name: 'crack_s', d: 1.8, force: 0.2 }, { t: 80, name: 'crack', d: 2.6, force: 0.4 }, { t: 140, name: 'fracture_ring', d: 4.6, force: 0.6 }],
  chargeMax: { d: [6, 7], force: 1.0, heat: 1.2 },
  scuff: { d: [1.5, 2.0], dedupe: 0.6 },
  skid: { speed: 4, len: [1.0, 3.5] },
  wall: { d: [1.4, 3.6], speed: [5, 20], reveal: 0.1, flicker: 1.8, end: 2.4, fade: 0.4, shards: [6, 10] },
  wallCrater: { d: [1.6, 2.1], person: 14 },
  colors: {
    cool: '#3a302a', barrier: '#7ad8ff', holo: '#3fd6ff',
    stone: ['#cdb9a2', '#b9a28a', '#e0d0bb'], earth: ['#8a6a48', '#6e5236', '#54402a'],
  },
};

// Element looks. overlay: drawn over the tier's crater; replace: drawn instead of it; big: the overlay/replace from
// crater_big up; satellites: the small marks around a big impact; trail: a path decal; heat: seconds the hot seams
// glow; life: lifetime multiplier; noDebris: no rubble, chunks, slabs or rocks (matter erased); noRubble: no rubble decal.
export const GROUND_STYLES = {
  stone: {},
  chakra: { overlay: 'scorch_ki', heat: 0.6 },
  spiral: { replace: 'scour_spiral', big: 'scour_spiral_big', heat: 0.9 },
  spiralBig: { replace: 'scour_spiral_big', heat: 1.0 },
  wind: { overlay: 'cut_wind', heat: 0.5 },
  claw: { replace: 'claw', heat: 0.7 },
  chakraBlast: { replace: 'scorch_chakra', heat: 1.0 },
  lightning: { overlay: 'burn_lightning', big: 'burn_lightning_big', heat: 1.2 },
  lightningBig: { replace: 'burn_lightning_big', satellites: 'burn_lightning', heat: 1.4 },
  fire: { overlay: 'burn_fire', heat: 1.6 },
  blackFire: { replace: 'burn_black', heat: 0, life: 1.5, noRubble: true },
  cursed: { overlay: 'fracture_cursed', big: 'fracture_cursed_big', heat: 0.8 },
  erasure: { replace: 'erasure', trail: 'erasure_trench', noDebris: true, heat: 1.2 },
  repel: { replace: 'gouge_repel', heat: 0.8 },
  implode: { replace: 'crush_implode' },
  ki: { overlay: 'scorch_ki', heat: 1.0 },
};

const BASE_NAMES = Object.keys(DECALS).filter((n) => DECALS[n].group === 'base' || DECALS[n].group === 'edge');
const TIER_NAMES = new Set(GROUND.tiers.map((t) => t.name));
const TAU = Math.PI * 2;
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const lerp = (a, b, t) => a + (b - a) * t;
const rand = (a, b) => a + Math.random() * (b - a);
const randInt = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

// Every decal is a unit quad; a floor one lies flat (u runs along +x, so a directional decal turns along its yaw).
const flatGeo = new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2);
const wallGeo = new THREE.PlaneGeometry(1, 1);
const tmpM = new THREE.Matrix4(), tmpQ = new THREE.Quaternion(), tmpQ2 = new THREE.Quaternion(), tmpP = new THREE.Vector3(), tmpS = new THREE.Vector3();
const tmpAxis = new THREE.Vector3(), yAxis = new THREE.Vector3(0, 1, 0), tmpE = new THREE.Euler();
const ZERO = new THREE.Matrix4().makeScale(0, 0, 0);

// ------------------------------------------------------------------ decal shader (onBeforeCompile)
// three r170 chunk names: <project_vertex>, <map_fragment>, <emissivemap_fragment>. After a three upgrade, check
// groundDemo() still renders (ADR 0024).
const FRAG_HEAD = /* glsl */ `
uniform vec4 uRect, uClip;
uniform vec3 uClipY, uTint, uCool, uLine;
uniform vec2 uCell, uTile;
uniform float uReveal, uKeep, uHeat, uDir;
#ifdef GD_FLOOR
uniform sampler2D uFloor;
uniform vec3 uSurf;
uniform vec4 uAxes;
uniform float uRing, uDepth, uBump, uSnap, uBowl, uCrackBump, uCrackDark;
#endif
varying vec2 vGdUv;
varying vec3 vGdW;
float gdHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
`;
// GD_FLOOR: the slope of the broken stone tilts the normal (world xz from the decal's u/v axes), so a crater's walls
// take the scene's light like the rest of the ring instead of carrying painted light
const FRAG_FLOOR_NORMAL = /* glsl */ `
#ifdef GD_FLOOR
{
  vec2 gdG = (uAxes.xy * gdSlope.x + uAxes.zw * gdSlope.y) * uBump;
  normal = normalize((viewMatrix * vec4(-gdG.x, 1.0, -gdG.y, 0.0)).xyz);
}
#endif
`;
// GD_FLOOR helpers, after <map_pars_fragment> declares the map: a texel's depth, 1 = untouched stone, 0 = the pit
const FRAG_FLOOR_FN = /* glsl */ `
#ifdef GD_FLOOR
float gdDepthOf(vec4 t) {
  if (t.a < 0.5) return 1.0;
  float h = clamp(dot(t.rgb, vec3(0.3, 0.59, 0.11)) / dot(uSurf, vec3(0.3, 0.59, 0.11)), 0.0, 1.0);
  return h > uSnap ? 1.0 : h;
}
float gdDepthAt(vec2 t) { return gdDepthOf(texture2D(map, uRect.xy + clamp(t, 0.0, 1.0) * uRect.zw)); }
#endif
`;
const FRAG_MAP = /* glsl */ `
float gdHeat = 0.0;
vec2 gdSlope = vec2(0.0);
{
  // world clip: the ring edge, the grass around the ring, the wall's face
  bool gdIn = all(greaterThan(vGdW.xz, uClip.xy)) && all(lessThan(vGdW.xz, uClip.zw)) && vGdW.y > uClipY.x && vGdW.y < uClipY.y;
  if (gdIn == (uClipY.z > 0.5)) discard;
  vec2 gdPx = floor(vGdUv * uCell);
  // the cracks spread out from the middle (along +u for directional decals)
  float gdR = uDir > 0.5 ? vGdUv.x : length(vGdUv - 0.5) * 2.0;
  if (gdR > uReveal + gdHash(gdPx + 3.7) * 0.12) discard;
  // pixel dissolve: whole texels drop out, so there is never a soft fade on the pixel art
  if (gdHash(gdPx) > uKeep) discard;
  vec2 gdT = vec2(fract(vGdUv.x * uTile.x + uTile.y), vGdUv.y);
  vec4 gdTex = texture2D(map, uRect.xy + gdT * uRect.zw);
  #ifdef GD_FLOOR
    // a crater's bowl: the ring sinks toward the middle in a few hard steps (pixel-art banding), lit by its slope
    float gdBr = length(vGdUv - 0.5) * 2.0;
    float gdB = uDir > 0.5 ? 0.0 : uBowl * floor((1.0 - smoothstep(0.12, 0.8, gdBr)) * 5.0) / 5.0;
    if (gdTex.a < 0.5 && gdB <= 0.0) discard;
  #else
    if (gdTex.a < 0.5) discard;
  #endif
  float gdHot = step(0.985, min(gdTex.r, min(gdTex.g, gdTex.b))) * step(0.5, gdTex.a); // (a bowl keeps clear texels)
  gdHeat = gdHot * uHeat;
  #if defined(GD_TINTED)
    diffuseColor.rgb = uTint * dot(gdTex.rgb, vec3(0.3, 0.59, 0.11)) * 1.8;
  #elif defined(GD_HOLO)
    // the holo floor draws the damage as glowing outlines: luma and alpha edges against the 4 neighbor texels
    vec2 gdD = uRect.zw / vec2(uCell.x / uTile.x, uCell.y); // one texel
    float gdL = dot(gdTex.rgb, vec3(0.3, 0.59, 0.11)), gdE = 0.0;
    for (int i = 0; i < 4; i++) {
      vec2 o = i == 0 ? vec2(gdD.x, 0.0) : i == 1 ? vec2(-gdD.x, 0.0) : i == 2 ? vec2(0.0, gdD.y) : vec2(0.0, -gdD.y);
      vec4 n = texture2D(map, uRect.xy + gdT * uRect.zw + o);
      gdE = max(gdE, n.a < 0.5 ? 1.0 : abs(gdL - dot(n.rgb, vec3(0.3, 0.59, 0.11))) * 3.0);
    }
    diffuseColor.rgb = uLine * (min(gdE, 1.0) * 1.4 + (1.0 - gdL) * 0.18) + uTint * gdHeat * 2.0;
  #elif defined(GD_FLOOR)
    // Ring damage is the ring's own stone, broken: the art only says how much darker (and how deep) each texel is
    // than untouched stone, and the floor texture under it shows through, grid lines included. Painted rim tones
    // and chips lighter than the floor sink into it, so there is no sticker edge and no bright highlight.
    vec2 gdD = 1.0 / uCell;
    float gdH = gdDepthOf(gdTex);
    gdSlope = vec2(gdDepthAt(gdT + vec2(gdD.x, 0.0)) - gdDepthAt(gdT - vec2(gdD.x, 0.0)),
      gdDepthAt(gdT + vec2(0.0, gdD.y)) - gdDepthAt(gdT - vec2(0.0, gdD.y))) * uCrackBump;
    // the bowl's wall rises outward (its steepest band between the pit and the rim)
    float gdBs = uDir > 0.5 ? 0.0 : uBowl * smoothstep(0.1, 0.35, gdBr) * (1.0 - smoothstep(0.55, 0.85, gdBr));
    gdSlope += normalize(vGdUv - 0.5 + 1e-4) * gdBs * 0.5;
    // the floor seen in a pit slides against the view like a lower surface would (one parallax step)
    vec3 gdV = normalize(cameraPosition - vGdW);
    vec2 gdW = vGdW.xz - gdV.xz / max(gdV.y, 0.3) * (1.0 - gdH + gdB * 0.6) * uDepth;
    vec3 gdFl = texture2D(uFloor, vec2(gdW.x / uRing + 0.5, 0.5 - gdW.y / uRing)).rgb;
    // grey shade only: the stone keeps the floor's color (no painted hue, no magenta fringe), and the mid tones of
    // the drawn rubble melt into the stone so only cracks, pits and scorch read
    float gdK = gdH > uSnap ? 1.0 : mix(uCrackDark, 1.0, gdH);
    gdK = mix(gdK, 0.22, gdHot); // a hot seam is a dark crack under its ember
    gdK *= 1.0 - 0.28 * gdB; // less light reaches the bottom of the bowl
    diffuseColor.rgb *= gdFl * gdK;
  #else
    diffuseColor.rgb *= mix(gdTex.rgb, mix(uCool, uTint, uHeat), gdHot);
  #endif
}
`;
function gdCompile(shader) {
  Object.assign(shader.uniforms, this.userData.gd);
  shader.vertexShader = 'varying vec2 vGdUv;\nvarying vec3 vGdW;\n' + shader.vertexShader.replace('#include <project_vertex>', '#include <project_vertex>\n\tvGdUv = uv;\n\tvGdW = (modelMatrix * vec4(transformed, 1.0)).xyz;');
  shader.fragmentShader = FRAG_HEAD + shader.fragmentShader
    .replace('#include <map_pars_fragment>', '#include <map_pars_fragment>\n' + FRAG_FLOOR_FN)
    .replace('#include <map_fragment>', FRAG_MAP)
    .replace('#include <normal_fragment_maps>', '#include <normal_fragment_maps>\n' + FRAG_FLOOR_NORMAL)
    .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>\n\ttotalEmissiveRadiance += uTint * ${GROUND.heatGlow.toFixed(2)} * gdHeat;`);
}
// every decal of one kind shares one program
const PROGRAM_KEY = { lit: () => 'gd-lit', floor: () => 'gd-floor', holo: () => 'gd-holo', tinted: () => 'gd-tinted' };

function pageTexture(image) {
  const t = new THREE.Texture(image);
  t.magFilter = t.minFilter = THREE.NearestFilter;
  t.generateMipmaps = false;
  t.colorSpace = THREE.SRGBColorSpace;
  t.needsUpdate = true;
  return t;
}

// a direction from a Vector2 (x, y = world z), a Vector3 / {x, z}, or nothing
function dirOf(d, out) {
  if (!d) return null;
  const x = d.x, z = d.isVector2 ? d.y : d.z ?? d.y;
  const l = Math.hypot(x, z);
  if (l < 1e-4) return null;
  out.x = x / l;
  out.z = z / l;
  return out;
}

// The ground styles a fighter can produce (character, specials, their shots and vortices, supers).
function stylesOf(def) {
  const out = new Set(['stone']);
  const add = (s) => s && out.add(s);
  add(def.ground?.style);
  const K = kitOf(def);
  for (const id of Object.values(K.specials)) {
    const m = SPECIAL_MOVES[id];
    if (!m) continue;
    add(m.ground);
    add(m.vortex?.ground);
    if (m.proj) add(PROJECTILES[m.proj]?.ground);
  }
  for (const id of [K.super, K.ultimate]) {
    add(SUPERS[id]?.ground);
    add(SUPERS[id]?.roarGround);
  }
  return out;
}

function namesOfStyle(style, out) {
  const S = GROUND_STYLES[style];
  if (S) for (const k of ['overlay', 'replace', 'big', 'satellites', 'trail']) if (S[k]) out.add(S[k]);
}

const tierIndex = (F) => {
  let t = -1;
  GROUND.tiers.forEach((T, i) => { if (F >= T.at) t = i; });
  return t;
};

export class GroundDamage {
  constructor(scene, fx) {
    this.fx = fx;
    this.time = 0;
    this.seq = 0;
    this.mode = 'arena';
    this.arenaGroup = new THREE.Group();
    this.holoGroup = new THREE.Group();
    this.holoGroup.visible = false;
    scene.add(this.arenaGroup, this.holoGroup);
    this.clusters = [];
    this.barriers = [];
    this.wallMarks = [];
    this.trails = new Map();
    this.slabs = [];
    this.charges = [];
    this.bags = new Map();
    this.bodies = [];
    this.walls = [];
    this.slabMats = null;
    this.line = new THREE.Color(GROUND.colors.holo);
    this.cool = new THREE.Color(GROUND.colors.cool);
    this.surfTone = new THREE.Color(GROUND.floor.surface);
    this.floorTex = null;
    // decal art: name -> { tex, pw, ph, w, h, frames, mode, tinted, src }
    this.active = {};
    this.procCache = new Map();
    this.procTex = [];
    this.custom = null;
    this.proc = null;
    this.procKey = null;
    this.epoch = 0;
    this.renderer = null;
    // rim chunks: one instanced mesh of the debris rock, partly sunk around big craters
    const C = GROUND.caps.chunks;
    this.chunkMesh = new THREE.InstancedMesh(fx.rockGeo, new THREE.MeshLambertMaterial({ flatShading: true }), C);
    this.chunkMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.chunkMesh.castShadow = true;
    this.chunkMesh.receiveShadow = true;
    this.chunkMesh.frustumCulled = false;
    const white = new THREE.Color(1, 1, 1);
    for (let i = 0; i < C; i++) { this.chunkMesh.setMatrixAt(i, ZERO); this.chunkMesh.setColorAt(i, white); }
    this.chunkFree = Array.from({ length: C }, (_, i) => C - 1 - i);
    this.arenaGroup.add(this.chunkMesh);
    this.chunkColors = {
      ring: GROUND.colors.stone.map((c) => new THREE.Color(c)),
      grass: GROUND.colors.earth.map((c) => new THREE.Color(c)),
    };
    this.slabGeos = [];
  }

  // ---------------------------------------------------------------- art
  // public/decals/atlas.json (`npm run sprites decals`: approved names only; ?art=custom prefers the candidates in
  // public/preview/decals/). Only the JSON loads here; a match loads the pages it needs (prepare).
  async loadCustom() {
    try {
      const found = await fetchAtlasJson('/decals');
      if (!found) {
        console.info('[decals] procedural ground damage (no packed decal art yet)');
        return false;
      }
      const { data, dir } = found;
      if (!data?.decals || !Array.isArray(data.pages)) {
        console.warn('[decals] atlas.json has no "decals" or "pages", keeping the procedural ground damage');
        return false;
      }
      const decals = {};
      for (const [name, e] of Object.entries(data.decals)) {
        if (!DECALS[name] || !Array.isArray(e?.frames) || !e.frames.length || !(e.page >= 0 && e.page < data.pages.length)) continue;
        decals[name] = { page: e.page, w: e.w, h: e.h, frames: e.frames, mode: e.mode, tinted: !!e.tinted, group: e.group };
      }
      this.custom = { dir, pages: data.pages.map((file) => ({ file, img: null, tex: null, loading: null, failed: false })), decals };
      const names = Object.keys(decals);
      console.info(`[decals] custom ground damage${dir === '/decals' ? '' : ' (candidates)'}: ${names.join(', ') || 'none'}; procedural for the rest`);
      return true;
    } catch (e) {
      console.warn('[decals] custom decal atlas failed, keeping the procedural ground damage', e);
      return false;
    } finally {
      // paint the procedural fallbacks now, behind the loading screen (~50 ms), not when the first match starts
      for (const n of Object.keys(DECALS)) if (!this.custom?.decals[n] && !this.procCache.has(n)) this.procCache.set(n, paintDecal(n));
    }
  }

  // A new match: load only the decal pages these fighters can need (at most caps.pages) and upload them now, so
  // the first crater never hitches mid-fight.
  prepare(fighters = [], renderer = null) {
    this.bodies = fighters;
    if (renderer) this.renderer = renderer;
    const names = new Set(BASE_NAMES);
    for (const f of fighters) {
      for (const s of stylesOf(f.def)) namesOfStyle(s, names);
      if (f.def.ground?.charge) names.add(f.def.ground.charge);
    }
    this.use(names);
  }

  use(names, unlimited = false) {
    const epoch = ++this.epoch;
    const C = this.custom;
    // custom pages that hold needed names, the floor tiers first
    let chosen = [];
    if (C) {
      const score = new Map();
      for (const n of names) {
        const e = C.decals[n];
        if (!e || C.pages[e.page].failed) continue;
        score.set(e.page, (score.get(e.page) ?? 0) + (DECALS[n].group === 'base' ? 3 : 1));
      }
      chosen = [...score.keys()].sort((a, b) => score.get(b) - score.get(a));
    }
    // procedural pages paint what the chosen custom pages don't hold; drop custom pages until it fits the budget
    let proc, rest;
    for (;;) {
      rest = [...names].filter((n) => !(C?.decals[n] && chosen.includes(C.decals[n].page))).sort();
      proc = rest.join() === this.procKey ? this.proc : bakeDecals(rest, this.procCache);
      if (unlimited || !chosen.length || chosen.length + (rest.length ? proc.pages.length : 0) <= GROUND.caps.pages) break;
      chosen.pop();
    }
    if (rest.join() !== this.procKey) {
      // a rematch with the same fighters keeps its pages
      for (const t of this.procTex) t.dispose();
      this.procTex = rest.length ? proc.pages.map((cv) => pageTexture(cv)) : [];
      this.proc = proc;
      this.procKey = rest.join();
    }
    if (C) {
      C.pages.forEach((pg, i) => {
        if (chosen.includes(i) || !pg.tex) return;
        pg.tex.dispose(); // not needed this match: free the GPU copy (and the image: it reloads when needed)
        pg.tex = null;
        pg.img = null;
      });
    }
    this.active = {};
    for (const [name, e] of Object.entries(proc.decals)) {
      const tex = this.procTex[e.page];
      this.active[name] = { tex, pw: tex.image.width, ph: tex.image.height, w: e.w, h: e.h, frames: e.frames, mode: e.mode, tinted: e.tinted, src: 'procedural' };
    }
    for (const t of this.procTex) this.renderer?.initTexture(t);
    for (const i of chosen) this.usePage(i, names, epoch);
  }

  // make one custom page drawable (loading it first if needed); its names switch over as soon as it is ready
  usePage(i, names, epoch) {
    const C = this.custom, pg = C.pages[i];
    const ready = () => {
      if (epoch !== this.epoch) return;
      if (!pg.img) { this.use(names); return; } // it failed: the procedural pages take its names over now
      if (!pg.tex) {
        pg.tex = pageTexture(pg.img);
        this.renderer?.initTexture(pg.tex);
      }
      for (const n of names) {
        const e = C.decals[n];
        if (e?.page === i) this.active[n] = { tex: pg.tex, pw: pg.img.width, ph: pg.img.height, w: e.w, h: e.h, frames: e.frames, mode: e.mode, tinted: e.tinted, src: 'custom' };
      }
    };
    if (pg.img) return ready();
    pg.loading ??= loadImage(`${C.dir}/${pg.file}?v=${Date.now()}`).then((img) => {
      pg.loading = null;
      if (!img) {
        pg.failed = true;
        console.warn(`[decals] ${pg.file} is missing or unreadable, its decals stay procedural`);
      }
      pg.img = img;
    });
    pg.loading.then(ready);
  }

  // ---------------------------------------------------------------- surfaces
  // 'arena' (stone ring, grass around it, brick stand walls), 'training' (holo floor: cyan cracks, no 3D rubble) or
  // 'void' (the domain: no ground damage; the arena's decals wait hidden until it ends).
  setSurface(kind, s = null) {
    this.mode = kind;
    if (s?.slabTop) {
      this.slabMats = [s.slabSide, s.slabSide, s.slabTop, s.slabSide, s.slabSide, s.slabSide];
      if (!this.slabGeos.length) this.slabGeos = Array.from({ length: 6 }, () => this.slabGeo());
    }
    if (s?.walls) this.walls = s.walls;
    if (s?.slabTop) this.floorTex = s.slabTop.map ?? null; // ring damage samples the ring's own stone (GD_FLOOR)
    if (s?.line) this.line.set(s.line);
    this.arenaGroup.visible = kind === 'arena';
    this.holoGroup.visible = kind === 'training';
  }

  // a floor-tile slab: the top face shows one random tile of the ring top, the sides the ring side's upper edge
  slabGeo() {
    const g = new THREE.BoxGeometry(0.9, 0.14, 0.9);
    const uv = g.attributes.uv, S = RING_HALF * 2;
    const tu = (Math.floor(Math.random() * S) + 0.05) / S, tv = (Math.floor(Math.random() * S) + 0.05) / S, dt = 0.9 / S;
    for (let f = 0; f < 6; f++) {
      for (let k = 0; k < 4; k++) {
        const i = f * 4 + k, u = uv.getX(i), v = uv.getY(i);
        if (f === 2) uv.setXY(i, tu + u * dt, tv + v * dt);
        else uv.setXY(i, u * (0.9 / S), 1 - (1 - v) * (0.14 / RING_TOP));
      }
    }
    return g;
  }

  surfaceAt(x, z) {
    if (this.mode === 'void') return null;
    if (this.mode === 'training') return 'holo';
    return Math.abs(x) <= RING_HALF - 0.02 && Math.abs(z) <= RING_HALF - 0.02 ? 'ring' : 'grass';
  }

  // ---------------------------------------------------------------- what happened -> impacts
  // A hit landed (Game.onHit). Specials, styled shots and smashes mark the floor: under a grounded victim at once
  // (specials and styled shots only), or, for an airborne one, where they come down next (impact debt).
  hit(att, def, m, dmg) {
    if (m.beam && !m.big) return; // beam ticks
    const H = GROUND.hit;
    const kind = m.spark || (m.big ? 'heavy' : 'light');
    const marks = m.special || m.ground || kind === 'smash' || (m.big && m.launch);
    if (!marks) return;
    const F = 0.5 * (H.spark[kind] ?? H.spark.light) + dmg / H.dmg + (m.special ? H.special : 0) + ((m.cost ?? 0) >= H.superCost ? H.super : 0);
    const style = m.ground ?? (m.special ? att.def.ground?.style : null) ?? 'stone';
    const tint = GROUND_STYLES[style]?.tint ?? m.color ?? att.def.ground?.tint ?? att.def.color;
    const dx = def.pos.x - att.pos.x, dz = def.pos.z - att.pos.z;
    if (def.pos.y > GROUND.debt.minY) {
      const mk = def.groundMark, now = def.game.frameNo;
      if (!mk || now - mk.frame > GROUND.debt.frames || mk.force <= F) def.groundMark = { force: F, style, tint, dx, dz, frame: now };
    } else if (m.special || m.ground) this.impact(def.pos, { force: F, style, tint, dir: { x: dx, z: dz } }); // a small shot's F (~0.4) burns a crack
  }

  // the victim's pending mark, if it is still fresh (consumed)
  takeMark(f) {
    const mk = f.groundMark;
    f.groundMark = null;
    return mk && f.game.frameNo - mk.frame <= GROUND.debt.frames ? mk : null;
  }

  // A launched body meets the floor at downward speed `vy` (a bounce, a ground bounce, coming to rest).
  land(f, vy, o = {}) {
    const L = GROUND.fall;
    let F = clamp01((vy - L.from) / L.span) + (o.bounce ? L.bounce : 0);
    if (vy >= L.hard) F = Math.max(F, L.hardForce);
    const mk = this.takeMark(f);
    let style = 'stone', tint = null, dir = null;
    if (mk) {
      F = Math.max(F, mk.force) + Math.min(F, mk.force) * 0.25;
      ({ style, tint } = mk);
      dir = { x: mk.dx, z: mk.dz };
    }
    if (F < GROUND.tiers[0].at) return null;
    return this.impact(f.pos, { force: F, style, tint, dir });
  }

  // A KO'd body came to rest: the round's mark, on the ring or in the grass (persistent).
  koMark(f) {
    const mk = this.takeMark(f);
    const F = Math.max(GROUND.fixed.ko, mk ? mk.force + GROUND.fall.ko : 0);
    return this.impact(f.pos, { force: F, style: mk?.style ?? 'stone', tint: mk?.tint, persistent: true });
  }

  // A body starts skidding along the floor (a knockdown or a KO slide): a drag groove as long as the slide will be.
  // `friction`: the per-frame speed factor of that slide (fighter.js), so the groove ends where the body stops.
  slide(f, friction, persistent = !!f.ko) {
    const v = Math.hypot(f.vel.x, f.vel.z), K = GROUND.skid;
    if (v < K.speed) return null;
    const len = Math.min(K.len[1], Math.max(K.len[0], (v / 60) / (1 - friction) + 0.3));
    return this.skid(f.pos, f.vel, len, persistent);
  }

  // A dive special slams down (kit.onLand): harder when it caught someone.
  dive(f, m, connected) {
    const D = GROUND.dive;
    return this.impact(f.pos, { force: D.base + (connected ? D.hit : 0), style: m.ground ?? f.def.ground?.style, tint: m.color ?? f.def.ground?.tint, dir: f.face });
  }

  // ---------------------------------------------------------------- the impact itself
  // pos: a fighter-space point (x, z on the floor). o: force | kind (GROUND.fixed), style, tint, dir, d (diameter
  // override), name (one decal instead of the tier/style mix), key, persistent, noMerge, quiet (no 3D or dust),
  // origin (pos is where a directional decal starts, not its middle), heat.
  impact(pos, o = {}) {
    if (!this.epoch) this.prepare(this.bodies); // stamped before any match (debug helpers): the shared pages
    const surf = this.surfaceAt(pos.x, pos.z);
    let F = Math.min(GROUND.maxForce, o.force ?? GROUND.fixed[o.kind] ?? GROUND.fixed.crater);
    let style = GROUND_STYLES[o.style] ? o.style : 'stone', tint = o.tint;
    if (!surf) return null;
    if (F < GROUND.tiers[0].at && !o.name) return null;
    let tier = tierIndex(F);
    let x = pos.x, z = pos.z, merged = false;
    // A slam where a younger crater lies grows that crater instead of stacking a copy. Only a hit at most one tier
    // weaker may grow it: a super-jump crack or a launcher's landing beside a fresh crater_big must not wipe it and
    // replay a full big impact somewhere else.
    if (!o.noMerge && !o.name) {
      const M = GROUND.merge, T = GROUND.tiers[Math.max(0, tier)];
      const reach = M.reach * (T.d[0] + T.d[1]) / 2;
      let best = null, bd = Infinity;
      for (const c of this.clusters) {
        if (c.dissolving || !c.mergeable || c.surface !== surf || this.time - c.t0 > M.age) continue;
        const d = Math.hypot(c.x - pos.x, c.z - pos.z);
        if (tier < c.tier - 1) {
          if (d < c.D * M.inside) return c; // a much smaller hit inside a fresh, bigger crater: already broken there
          continue; // further out: its own small mark
        }
        if (d < Math.max(reach, c.D * M.reach) && d < bd) { bd = d; best = c; }
      }
      if (best) {
        const grown = Math.min(GROUND.maxForce, F + M.bonus * (best.tier + 1));
        // not a bigger tier than the crater already is: the floor is broken that much there (no copy, no debris)
        if (tierIndex(grown) <= best.tier) return best;
        this.dissolve(best, GROUND.dissolve.merge);
        // the grown crater sits between the two, nearer the harder one, so it does not jump to the weaker hit
        const mx = (best.x * best.force + x * F) / (best.force + F), mz = (best.z * best.force + z * F) / (best.force + F);
        if (this.surfaceAt(mx, mz) === surf) { x = mx; z = mz; }
        F = grown;
        if (style === 'stone' && best.style !== 'stone') { style = best.style; tint = tint ?? best.tint; }
        tier = tierIndex(F);
        merged = true;
      }
    }
    const S = GROUND_STYLES[style];
    const T = GROUND.tiers[Math.max(0, tier)], next = GROUND.tiers[tier + 1]?.at ?? GROUND.maxForce;
    const D = o.d ?? lerp(T.d[0], T.d[1], clamp01((F - T.at) / (next - T.at))) * rand(1 - GROUND.sizeJitter, 1 + GROUND.sizeJitter);
    const life = o.persistent || (!o.name && T.life === 0) ? 0 : (o.life ?? T.life) * (S.life ?? 1);
    const dir = dirOf(o.dir, { x: 0, z: 0 });
    // `origin`: pos is where the decal starts (a blast fanning out from the attacker), so the cluster sits ahead of it
    if (o.origin && dir && !o.name && !merged) { x += dir.x * D / 2; z += dir.z * D / 2; }
    const c = {
      x, z, surface: surf, tier: Math.max(0, tier), force: F, style, tint, D, t0: this.time, life,
      persistent: life === 0, key: o.key ?? null, mergeable: !o.name, parts: [], chunks: [], slabs: [], dissolving: false, dissolveAt: 0, dissolveLen: 0,
    };
    const tintC = new THREE.Color(tint ?? '#ffffff');
    const big = tier >= 3;
    const part = (name, px, pz, d, po = {}) => this.addPart(c, name, px, pz, d, { tint: tintC, reveal: T.reveal, ...po });
    if (o.name) {
      part(o.name, pos.x, pos.z, D, { dir, origin: o.origin, heat: o.heat ?? S.heat ?? 0 });
    } else {
      const G = GROUND.satellites;
      const ground = surf === 'grass';
      // underlay and satellite cracks (drawn first)
      if (F >= G.big && !ground) part('fracture_ring', x, z, D * G.underlay, { reveal: T.reveal * 1.3, extra: true });
      if (F >= G.at && !ground) {
        const n = F >= G.big ? randInt(...G.bigN) : randInt(...G.n), name = S.satellites ?? (F >= G.big ? 'crack' : 'crack_s');
        const st = GROUND.tiers[TIER_NAMES.has(name) ? GROUND.tiers.findIndex((t) => t.name === name) : 0];
        for (let k = 0; k < n; k++) {
          const a = Math.random() * TAU, r = D * rand(...G.dist);
          part(name, x + Math.cos(a) * r, z + Math.sin(a) * r, lerp(st.d[0], st.d[1], Math.random()), { delay: 0.04 + k * 0.03, heat: S.satellites ? S.heat : 0, extra: true });
        }
      }
      // the crater (or the style's own decal), then the style's overlay
      const tierName = ground && !S.replace ? 'dirt_crater' : T.name;
      const base = S.replace ? (big && S.big ? S.big : S.replace) : tierName;
      part(base, x, z, D, { dir, heat: S.replace ? S.heat ?? 0 : 0 });
      const over = S.overlay ? (big && S.big ? S.big : S.overlay) : null;
      if (over) part(over, x + rand(-0.04, 0.04) * D, z + rand(-0.04, 0.04) * D, D * rand(0.8, 1.0), { heat: S.heat ?? 0 });
      if (F >= GROUND.rubble.at && !S.noDebris && !S.noRubble && !ground && (surf !== 'ring' || GROUND.rubble.ring)) part('rubble', x, z, D * GROUND.rubble.d, { delay: 0.05, extra: true });
    }
    if (!c.parts.length) return null;
    this.clusters.push(c);
    if (!o.quiet) this.debrisFor(c, S);
    this.enforceCaps();
    return c;
  }

  // the 3D layer: rim chunks, slabs, rocks, a dust ring, smoke
  debrisFor(c, S) {
    const F = c.force, floorY = c.surface === 'grass' ? -RING_TOP : 0, pos = c;
    if (S.noDebris) return;
    if (c.surface !== 'holo') {
      if (F >= GROUND.chunks.at) this.addChunks(c);
      if (F >= GROUND.slabs.at && c.surface === 'ring') this.addSlabs(c);
    }
    this.fx.debris(pos.x, pos.z, Math.round(4 + 10 * F), 0.6 + 0.5 * F);
    const R = GROUND.dustRing;
    if (F >= R.at) this.fx.dustRing(pos, c.D * R.r, Math.round(lerp(R.n[0], R.n[1], clamp01((F - R.at) / 1.05))), floorY);
    if (F >= GROUND.smoke) for (let k = 0; k < 3; k++) this.fx.smoke(pos.x + rand(-0.6, 0.6) * c.D * 0.3, floorY + 0.3, pos.z + rand(-0.6, 0.6) * c.D * 0.3, 1.3);
  }

  // One decal of a cluster. d: size along u (diameter, or length for a directional decal).
  addPart(c, name, x, z, d, o = {}) {
    const e = this.active[name];
    if (!e) return null; // a page still loading (or a name no fighter here can make)
    const spec = DECALS[name];
    const directional = !!spec.dir;
    const holo = c.surface === 'holo';
    const kind = e.tinted ? 'tinted' : holo ? 'holo' : 'lit';
    let yaw;
    if (directional && o.dir) yaw = Math.atan2(-o.dir.z, o.dir.x) + THREE.MathUtils.degToRad(rand(-GROUND.dirJitter, GROUND.dirJitter));
    else yaw = Math.random() * TAU;
    const width = directional ? d * (spec.h / spec.w) : d * rand(1 - GROUND.aspectJitter, 1 + GROUND.aspectJitter);
    if (directional && o.origin) { x += Math.cos(yaw) * d / 2; z -= Math.sin(yaw) * d / 2; }
    const y = c.surface === 'grass' ? 0.035 : RING_TOP + 0.012;
    const flip = !o.noFlip && Math.random() < 0.5; // directional decals mirror across their path, not along it
    const heat = (o.heat ?? 0) * GROUND.heatScale;
    const floor = kind === 'lit' && c.surface === 'ring' && !!this.floorTex;
    const p = this.makeDecal(e, floor ? 'floor' : kind, o.variant ?? this.pick(name, e.frames.length), { flipU: !directional && flip, flipV: directional && flip, dir: directional, tint: o.tint, heat });
    if (floor) {
      // decal u runs along the mesh's +x, v along its -z (flatGeo), both turned by the yaw
      const cy = Math.cos(yaw), sy = Math.sin(yaw);
      p.u.uAxes.value.set(cy / d, -sy / d, -sy / width, -cy / width);
      p.u.uDepth.value = d * GROUND.floor.depth;
      p.u.uBowl.value = GROUND.floor.bowl[name] ?? 0;
    }
    const H = RING_HALF;
    if (c.surface === 'grass') p.u.uClip.value.set(-H - 0.4, -H - 0.4, H + 0.4, H + 0.4), p.u.uClipY.value.set(-9, 99, 1);
    else p.u.uClip.value.set(-H + 0.03, -H + 0.03, H - 0.03, H - 0.03), p.u.uClipY.value.set(-9, 99, 0);
    p.mesh.position.set(x, y, z);
    p.mesh.rotation.y = yaw;
    p.mesh.scale.set(d, 1, width);
    p.cluster = c;
    p.delay = o.delay ?? 0;
    p.reveal = o.reveal ?? 0.2;
    p.heat = heat;
    p.life = o.extra && c.life === 0 ? GROUND.life.extras : 0;
    p.dissolveAt = -1;
    p.name = name;
    (holo ? this.holoGroup : this.arenaGroup).add(p.mesh);
    c.parts.push(p);
    return p;
  }

  // the mesh and material of one decal (kind: lit | holo | tinted)
  makeDecal(e, kind, vi, o = {}) {
    const [fx, fy] = e.frames[vi % e.frames.length];
    const u = {
      uRect: { value: new THREE.Vector4() }, uClip: { value: new THREE.Vector4(-999, -999, 999, 999) }, uClipY: { value: new THREE.Vector3(-999, 999, 0) },
      uTint: { value: new THREE.Color().copy(o.tint ?? this.line) }, uCool: { value: this.cool }, uLine: { value: this.line },
      uCell: { value: new THREE.Vector2(e.w, e.h) }, uTile: { value: new THREE.Vector2(1, 0) },
      uReveal: { value: 0 }, uKeep: { value: 1 }, uHeat: { value: o.heat > 0 ? 1 : 0 }, uDir: { value: o.dir ? 1 : 0 },
    };
    if (kind === 'floor') {
      Object.assign(u, {
        uFloor: { value: this.floorTex }, uSurf: { value: this.surfTone }, uAxes: { value: new THREE.Vector4() },
        uRing: { value: RING_HALF * 2 }, uDepth: { value: 0 }, uBump: { value: GROUND.floor.bump }, uSnap: { value: GROUND.floor.snap }, uBowl: { value: 0 },
        uCrackBump: { value: GROUND.floor.crackBump }, uCrackDark: { value: GROUND.floor.crackDark },
      });
    }
    // the variant's cell on its page, half a texel inside (flipY: v counts up from the page bottom)
    const du = (e.w - 1) / e.pw, dv = (e.h - 1) / e.ph;
    let u0 = (fx + 0.5) / e.pw, v0 = 1 - (fy + e.h - 0.5) / e.ph, su = du, sv = dv;
    if (o.flipU) { u0 += du; su = -du; }
    if (o.flipV) { v0 += dv; sv = -dv; }
    u.uRect.value.set(u0, v0, su, sv);
    const common = { map: e.tex, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -4 };
    const lit = kind === 'lit' || kind === 'floor';
    const mat = lit ? new THREE.MeshLambertMaterial(common)
      : new THREE.MeshBasicMaterial({ ...common, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
    if (!lit || kind === 'floor') mat.defines = { [{ holo: 'GD_HOLO', tinted: 'GD_TINTED', floor: 'GD_FLOOR' }[kind]]: '' };
    mat.userData.gd = u;
    mat.onBeforeCompile = gdCompile;
    mat.customProgramCacheKey = PROGRAM_KEY[kind];
    const mesh = new THREE.Mesh(o.wall ? wallGeo : flatGeo, mat);
    mesh.receiveShadow = lit;
    // older decals draw first, all of them before the fighters' blob shadows (renderOrder 0)
    mesh.renderOrder = -1 + (this.seq++ % 500000) * 1e-6;
    return { mesh, mat, u };
  }

  // shuffle bag per name: every variant once before any repeats, never the same one twice in a row
  pick(name, n) {
    let b = this.bags.get(name);
    if (!b || b.n !== n) { b = { n, order: [], last: -1 }; this.bags.set(name, b); }
    if (!b.order.length) {
      b.order = Array.from({ length: n }, (_, i) => i);
      for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b.order[i], b.order[j]] = [b.order[j], b.order[i]]; }
      if (n > 1 && b.order[n - 1] === b.last) [b.order[0], b.order[n - 1]] = [b.order[n - 1], b.order[0]];
    }
    b.last = b.order.pop();
    return b.last;
  }

  addChunks(c) {
    const K = GROUND.chunks, n = Math.round(K.base + K.per * (c.force - K.at));
    const cols = this.chunkColors[c.surface === 'grass' ? 'grass' : 'ring'];
    const y = c.surface === 'grass' ? 0 : RING_TOP;
    const rim = c.D * 0.22; // about where the bowl's rim sits
    for (let k = 0; k < n && this.chunkFree.length; k++) {
      const i = this.chunkFree.pop();
      const a = Math.random() * TAU, r = rim * rand(0.85, 1.35), s = rand(...K.size) * (1 + c.force * 0.4);
      const ch = { i, x: c.x + Math.cos(a) * r, y: y + s * 0.25, z: c.z + Math.sin(a) * r, s, rx: rand(0, TAU), ry: rand(0, TAU) };
      this.placeChunk(ch, 1);
      this.chunkMesh.setColorAt(i, cols[k % cols.length]);
      c.chunks.push(ch);
    }
    this.chunkMesh.instanceMatrix.needsUpdate = true;
    if (this.chunkMesh.instanceColor) this.chunkMesh.instanceColor.needsUpdate = true;
  }

  placeChunk(ch, k) {
    tmpQ.setFromEuler(tmpE.set(ch.rx, ch.ry, 0));
    tmpM.compose(tmpP.set(ch.x, ch.y - (1 - k) * ch.s, ch.z), tmpQ, tmpS.setScalar(ch.s * k));
    this.chunkMesh.setMatrixAt(ch.i, tmpM);
  }

  // floor tiles jutting up around a big crater, never within `clear` of a fighter
  addSlabs(c) {
    if (!this.slabMats) return;
    const L = GROUND.slabs;
    const n = randInt(...L.n);
    for (let k = 0; k < n && this.slabs.length < GROUND.caps.slabs; k++) {
      const a = Math.random() * TAU, r = (c.D / 2) * rand(...L.ring);
      const x = c.x + Math.cos(a) * r, z = c.z + Math.sin(a) * r;
      if (Math.abs(x) > RING_HALF - 0.6 || Math.abs(z) > RING_HALF - 0.6 || this.nearBody(x, z, L.clear + 0.5)) continue;
      const m = new THREE.Mesh(this.slabGeos[k % this.slabGeos.length], this.slabMats);
      m.castShadow = m.receiveShadow = true;
      // tilt about the tangent so the outer edge lifts (12-30 degrees: the top edge rises at most ~0.3)
      tmpAxis.set(-Math.sin(a), 0, Math.cos(a));
      tmpQ.setFromAxisAngle(tmpAxis, THREE.MathUtils.degToRad(rand(...L.tilt)));
      tmpQ2.setFromAxisAngle(yAxis, Math.random() * TAU);
      m.quaternion.copy(tmpQ).multiply(tmpQ2);
      m.position.set(x, RING_TOP + 0.02, z);
      this.arenaGroup.add(m);
      const sl = { mesh: m, cluster: c, y0: RING_TOP + 0.02, sink: 0 };
      this.slabs.push(sl);
      c.slabs.push(sl);
    }
  }

  nearBody(x, z, r) {
    for (const f of this.bodies) if (f?.pos && Math.hypot(f.pos.x - x, f.pos.z - z) < r) return true;
    return false;
  }

  // ---------------------------------------------------------------- paths, scuffs, skids
  // Hollow Purple's trench: a growing decal per straight run, tiled along the path (new run after a turn, a jump
  // or the ring edge). Stamped every trailStep units, at most caps.trail runs per key.
  trail(key, p, dir, width, style = 'erasure', tint = null) {
    const surf = this.surfaceAt(p.x, p.z);
    const S = GROUND_STYLES[style] ?? GROUND_STYLES.erasure;
    if (!surf) return;
    let tr = this.trails.get(key);
    const d = dirOf(dir, { x: 0, z: 0 });
    if (!d) return;
    if (tr && Math.hypot(p.x - tr.x, p.z - tr.z) > 2.5) tr = null; // a new orb on the same key
    if (!tr) {
      tr = { x: p.x, z: p.z, runs: 0, run: null };
      this.trails.set(key, tr);
      if (S.replace) this.impact(p, { name: S.replace, d: width, style, tint, persistent: true, quiet: true, heat: S.heat });
    }
    const run = tr.run;
    const moved = Math.hypot(p.x - tr.x, p.z - tr.z);
    if (run && !run.dissolving && run.surface === surf && run.dx * d.x + run.dz * d.z > 0.985) {
      if (moved < GROUND.trailStep) return;
      this.extendRun(run, p);
    } else if (tr.runs < GROUND.caps.trail) {
      tr.runs++;
      tr.run = this.startRun(p, d, width, surf, S, tint);
    }
    tr.x = p.x;
    tr.z = p.z;
  }

  startRun(p, d, width, surf, S, tint) {
    const name = surf === 'grass' ? 'dirt_skid' : S.trail ?? 'erasure_trench';
    const c = this.impact(p, { name, d: 0.1, dir: { x: d.x, z: d.z }, origin: true, tint, persistent: true, quiet: true, noMerge: true, heat: S.heat });
    if (!c) return null;
    c.sx = p.x; c.sz = p.z; c.dx = d.x; c.dz = d.z; c.width = surf === 'grass' ? width * 0.6 : width;
    const pt = c.parts[0];
    pt.mesh.rotation.y = Math.atan2(-d.z, d.x); // a straight run: no jitter
    pt.u.uReveal.value = 2;
    pt.reveal = 1e-3;
    this.extendRun(c, p);
    return c;
  }

  extendRun(c, p) {
    const pt = c.parts[0];
    if (!pt || pt.gone) return;
    const len = Math.max(0.1, (p.x - c.sx) * c.dx + (p.z - c.sz) * c.dz);
    const e = this.active[pt.name], aspect = e ? e.w / e.h : 2;
    pt.mesh.position.set(c.sx + c.dx * len / 2, pt.mesh.position.y, c.sz + c.dz * len / 2);
    pt.mesh.scale.set(len, 1, c.width);
    // the art tiles along the run at its natural length for this width
    const reps = len / (c.width * aspect);
    pt.u.uTile.value.set(reps, 0);
    if (e) pt.u.uCell.value.set(e.w * reps, e.h);
    c.x = c.sx + c.dx * len / 2;
    c.z = c.sz + c.dz * len / 2;
  }

  skid(pos, vel, len, persistent = false) {
    const surf = this.surfaceAt(pos.x, pos.z);
    if (!surf) return null;
    return this.impact(pos, { name: surf === 'grass' ? 'dirt_skid' : 'skid', d: len, dir: vel, origin: true, persistent, life: GROUND.life.skid, noMerge: true, quiet: true, force: 0.3 });
  }

  // a wavedash or super dash takeoff scrapes the floor (once per spot)
  scuff(pos, vel) {
    const surf = this.surfaceAt(pos.x, pos.z);
    if (!surf || !dirOf(vel, { x: 0, z: 0 })) return null;
    for (const c of this.clusters) {
      if (c.scuff && this.time - c.t0 < 0.5 && Math.hypot(c.x - pos.x, c.z - pos.z) < GROUND.scuff.dedupe) return null;
    }
    const c = this.impact(pos, { name: surf === 'grass' ? 'dirt_skid' : 'scuff', d: rand(...GROUND.scuff.d), dir: vel, origin: true, life: GROUND.life.scuff, noMerge: true, quiet: true, force: 0.2 });
    if (c) c.scuff = true;
    return c;
  }

  // ---------------------------------------------------------------- charging (hold Special)
  // One decal per charging fighter that upgrades in place: crack_s, crack, fracture_ring, then the fighter's own
  // fracture when the gauge fills (chargeMax). The power-up effects call these (chargeFx.js, ADR 0023) for a charge
  // style whose `ground.crackAt` is above 0, every live charge frame. The crack waits for that level (`from`: Naruto
  // bar 2, Sasuke MAX), then grows from the first stage, timed from that moment, so a late crack still grows in
  // steps. `ground.charge: false` here (Gojo: Infinity holds the floor still) leaves the floor alone too.
  chargeTick(f, t, level = 0, from = 0) {
    if (f.def.ground?.charge === false) return;
    let c = this.charges[f.index];
    if (!c || t < c.t) {
      if (c?.cluster) c.cluster.key = null; // a new charge: the old mark lives out its life
      c = this.charges[f.index] = { t, t0: null, stage: 0, cluster: null, max: false };
    }
    c.t = t;
    if (level < from) return;
    const st = GROUND.charge;
    c.t0 ??= from > 0 ? t - st[0].t : 0; // the first stage at once when the level is reached
    while (!c.max && c.stage < st.length && t - c.t0 >= st[c.stage].t) {
      const s = st[c.stage++];
      this.chargeStage(f, c, { name: s.name, d: s.d, force: s.force, quiet: s.force < GROUND.chunks.at, heat: 0 });
    }
  }

  chargeMax(f) {
    const G = f.def.ground;
    if (G?.charge === false) return;
    let c = this.charges[f.index];
    if (!c) c = this.charges[f.index] = { t: 0, t0: null, stage: 0, cluster: null, max: false };
    if (c.max) return;
    c.max = true;
    c.stage = GROUND.charge.length;
    const M = GROUND.chargeMax;
    this.chargeStage(f, c, { name: G?.charge || 'fracture_ring', d: rand(...M.d), force: M.force, quiet: false, heat: M.heat });
  }

  chargeStage(f, c, s) {
    const old = c.cluster;
    const tint = f.def.ground?.tint ?? f.def.color;
    c.cluster = this.impact(f.pos, { name: s.name, d: s.d, force: s.force, tint, key: 'charge' + f.index, quiet: true, noMerge: true, heat: s.heat });
    if (c.cluster && !s.quiet && c.cluster.surface !== 'holo') {
      // only the floor itself breaks (chunks and slabs out by the rim, the fighter stands in the middle): no flying
      // rocks or dust, the power-up's own effects carry that moment
      const C = c.cluster;
      if (s.force >= GROUND.chunks.at) this.addChunks(C);
      if (s.force >= GROUND.slabs.at && C.surface === 'ring') this.addSlabs(C);
    }
    if (old) {
      old.key = null;
      this.dissolve(old, GROUND.dissolve.merge);
    }
  }

  // ---------------------------------------------------------------- walls
  // A wall bounce cracks the ki barrier: a hex spiderweb in the barrier's color at the impact, that flickers,
  // dissolves and sheds a few falling shards.
  wall(pos, axis, sign, speed = 10, tint = null) {
    if (this.mode === 'void') return null;
    const e = this.active.barrier_crack;
    if (!e) return null;
    const W = GROUND.wall;
    const D = lerp(W.d[0], W.d[1], clamp01((speed - W.speed[0]) / (W.speed[1] - W.speed[0])));
    const holo = this.mode === 'training';
    const col = new THREE.Color(tint ?? (holo ? this.line : GROUND.colors.barrier));
    const p = this.makeDecal(e, 'tinted', this.pick('barrier_crack', e.frames.length), { tint: col, wall: true, flipU: Math.random() < 0.5 });
    const at = sign * (ARENA_LIMIT + 0.35 - 0.01), y = RING_TOP + pos.y + 0.9;
    if (axis === 'x') { p.mesh.position.set(at, y, pos.z); p.mesh.rotation.y = -sign * Math.PI / 2; }
    else { p.mesh.position.set(pos.x, y, at); p.mesh.rotation.y = sign > 0 ? Math.PI : 0; }
    p.mesh.scale.set(D, D, 1);
    p.u.uClipY.value.set(RING_TOP + 0.02, 999, 0);
    p.mesh.renderOrder = 6; // with the barrier flash, over the fighters
    (holo ? this.holoGroup : this.arenaGroup).add(p.mesh);
    const b = { ...p, t0: this.time, D, col, shed: false };
    this.barriers.push(b);
    while (this.barriers.length > GROUND.caps.barrier) this.removeDecal(this.barriers.shift());
    return b;
  }

  // A KO crash into the stands: a hole in the brick wall (body-shaped when it was fast), until the round resets.
  wallCrater(pos, speed = 10) {
    if (this.mode !== 'arena') return null;
    const e = this.active.crater_wall;
    let w = null, best = 1.2;
    for (const it of this.walls) {
      const along = it.axis === 'x' ? pos.z : pos.x, across = it.axis === 'x' ? pos.x : pos.z;
      const d = Math.abs(across - it.at);
      if (along > it.min && along < it.max && d < best) { best = d; w = it; }
    }
    if (!e || !w) return null;
    const K = GROUND.wallCrater;
    const n = e.frames.length;
    const person = speed >= K.person;
    const vi = n >= 4 ? (person ? 0 : 2) + (Math.random() < 0.5 ? 1 : 0) : this.pick('crater_wall', n);
    const p = this.makeDecal(e, 'lit', vi, { wall: true, flipU: Math.random() < 0.5 });
    const D = lerp(K.d[0], K.d[1], clamp01(speed / 30));
    const y = Math.min(w.top - D * 0.38, Math.max(D * 0.4, RING_TOP + pos.y + 0.6));
    const off = w.at + w.normal * 0.012;
    if (w.axis === 'x') { p.mesh.position.set(off, y, pos.z); p.mesh.rotation.y = w.normal * Math.PI / 2; p.u.uClip.value.set(-999, w.min, 999, w.max); }
    else { p.mesh.position.set(pos.x, y, off); p.mesh.rotation.y = w.normal > 0 ? 0 : Math.PI; p.u.uClip.value.set(w.min, -999, w.max, 999); }
    p.u.uClipY.value.set(0.01, w.top, 0);
    p.u.uReveal.value = 2;
    p.mesh.scale.set(D, D, 1);
    this.arenaGroup.add(p.mesh);
    const m = { ...p, t0: this.time, dissolveAt: -1 };
    this.wallMarks.push(m);
    if (this.wallMarks.filter((x) => x.dissolveAt < 0).length > GROUND.caps.wallCraters) this.wallMarks.find((x) => x.dissolveAt < 0).dissolveAt = this.time;
    return m;
  }

  // ---------------------------------------------------------------- lifetimes and caps
  dissolve(c, len = GROUND.dissolve.normal) {
    if (c.dissolving) return;
    c.dissolving = true;
    c.dissolveAt = this.time;
    c.dissolveLen = len;
    c.key = null;
  }

  // floor decals are capped (oldest timed ones dissolve first, never a pop); at most caps.persistent permanent marks
  enforceCaps() {
    const C = GROUND.caps;
    let persistent = 0;
    for (const c of this.clusters) if (c.persistent && !c.dissolving && !c.demo) persistent++;
    for (const c of this.clusters) {
      if (persistent <= C.persistent) break;
      if (c.persistent && !c.dissolving && !c.demo) {
        c.persistent = false;
        c.life = this.time - c.t0 + GROUND.life.overflow;
        persistent--;
      }
    }
    const live = () => this.meshCount(false);
    for (const c of this.clusters) {
      if (live() <= C.soft) break;
      if (!c.dissolving && !c.persistent && !c.demo && !c.key) this.dissolve(c, GROUND.dissolve.overflow);
    }
    for (const c of this.clusters) {
      if (live() <= C.soft) break;
      if (!c.dissolving && !c.demo && !c.key) this.dissolve(c, GROUND.dissolve.overflow);
    }
    // hard cap: the oldest dissolving decals go at once (they are already fading out)
    while (this.meshCount(true) > C.decals) {
      const c = this.clusters.find((x) => x.dissolving && !x.demo) ?? this.clusters.find((x) => !x.demo);
      if (!c) break;
      this.removeCluster(c);
    }
  }

  // floor decal meshes (all, or only the ones not dissolving)
  meshCount(all = true) {
    let n = 0;
    for (const c of this.clusters) {
      if (c.demo || (!all && c.dissolving)) continue;
      for (const p of c.parts) if (!p.gone && (all || p.dissolveAt < 0)) n++;
    }
    return n;
  }

  removeDecal(p) {
    if (p.gone) return;
    p.gone = true;
    p.mesh.parent?.remove(p.mesh);
    p.mat.dispose();
  }

  removeCluster(c) {
    for (const p of c.parts) this.removeDecal(p);
    for (const ch of c.chunks) { this.chunkMesh.setMatrixAt(ch.i, ZERO); this.chunkFree.push(ch.i); }
    if (c.chunks.length) this.chunkMesh.instanceMatrix.needsUpdate = true;
    c.chunks.length = 0;
    for (const s of c.slabs) this.removeSlab(s);
    c.slabs.length = 0;
    const i = this.clusters.indexOf(c);
    if (i >= 0) this.clusters.splice(i, 1);
  }

  removeSlab(s) {
    s.mesh.parent?.remove(s.mesh);
    const i = this.slabs.indexOf(s);
    if (i >= 0) this.slabs.splice(i, 1);
  }

  // ---------------------------------------------------------------- per frame
  update(dt) {
    this.time += dt;
    const t = this.time;
    let chunksMoved = false;
    for (let ci = this.clusters.length - 1; ci >= 0; ci--) {
      const c = this.clusters[ci];
      const age = t - c.t0;
      if (!c.dissolving && c.life > 0 && age >= c.life) this.dissolve(c);
      let alive = 0;
      for (const p of c.parts) {
        if (p.gone) continue;
        const pa = age - p.delay, u = p.u;
        if (p.reveal > 1e-3) u.uReveal.value = pa <= 0 ? 0 : Math.min(1.7, pa / p.reveal);
        if (p.heat > 0) { const h = Math.max(0, 1 - pa / p.heat); u.uHeat.value = h * h; }
        if (p.dissolveAt < 0 && p.life > 0 && age >= p.life) p.dissolveAt = t;
        const at = p.dissolveAt >= 0 ? p.dissolveAt : c.dissolving ? c.dissolveAt : -1;
        if (at >= 0) {
          const len = p.dissolveAt >= 0 ? GROUND.dissolve.normal : c.dissolveLen;
          const k = (t - at) / len;
          if (k >= 1) { this.removeDecal(p); continue; }
          u.uKeep.value = 1 - k;
        }
        alive++;
      }
      if (c.dissolving) {
        const k = clamp01((t - c.dissolveAt) / c.dissolveLen);
        for (const ch of c.chunks) this.placeChunk(ch, 1 - k);
        if (c.chunks.length) chunksMoved = true;
        for (const s of c.slabs) s.sink = Math.max(s.sink, k);
        if (k >= 1 && !c.slabs.length) alive = 0;
      }
      if (!alive && !c.slabs.length) this.removeCluster(c);
      else if (!alive && c.slabs.every((s) => s.sink >= 1)) this.removeCluster(c);
    }
    if (chunksMoved) this.chunkMesh.instanceMatrix.needsUpdate = true;
    // slabs: a fighter walking up to one makes it sink at once (they never stand in a fighter's feet)
    for (let i = this.slabs.length - 1; i >= 0; i--) {
      const s = this.slabs[i], p = s.mesh.position;
      if (this.nearBody(p.x, p.z, GROUND.slabs.clear + 0.45)) s.fast = true;
      if (s.fast) s.sink = Math.min(1, s.sink + dt / 0.15);
      p.y = s.y0 - s.sink * GROUND.slabs.sink;
      if (s.sink >= 1) { this.removeSlab(s); const c = s.cluster; c.slabs.splice(c.slabs.indexOf(s), 1); }
    }
    this.updateBarriers(t);
    for (let i = this.wallMarks.length - 1; i >= 0; i--) {
      const m = this.wallMarks[i];
      if (m.dissolveAt < 0) continue;
      const k = (t - m.dissolveAt) / GROUND.dissolve.overflow;
      if (k >= 1) { this.removeDecal(m); this.wallMarks.splice(i, 1); } else m.u.uKeep.value = 1 - k;
    }
  }

  updateBarriers(t) {
    const W = GROUND.wall;
    for (let i = this.barriers.length - 1; i >= 0; i--) {
      const b = this.barriers[i], a = t - b.t0;
      b.u.uReveal.value = Math.min(1.7, a / W.reveal);
      b.mat.opacity = a > W.flicker && a < W.end ? (Math.sin(a * 90) > 0 ? 1 : 0.35) : 1;
      if (a >= W.end && !b.shed) {
        b.shed = true;
        const p = b.mesh.position, n = randInt(...W.shards);
        for (let k = 0; k < n; k++) {
          this.fx.spawn('star', p.x + rand(-0.4, 0.4) * b.D, p.y - RING_TOP + rand(-0.3, 0.3) * b.D, p.z + rand(-0.4, 0.4) * b.D, {
            scale: 0.16 + Math.random() * 0.1, frame: 2, vel: [rand(-1, 1), rand(0, 2), rand(-1, 1)], grav: 12, life: 0.8, color: b.col, glow: 1, order: 7,
          });
        }
      }
      if (a >= W.end) {
        const k = (a - W.end) / W.fade;
        if (k >= 1) { this.removeDecal(b); this.barriers.splice(i, 1); } else b.u.uKeep.value = 1 - k;
      }
    }
  }

  // round reset: the ring is clean again
  clear() {
    for (const c of [...this.clusters]) this.removeCluster(c);
    for (const b of this.barriers) this.removeDecal(b);
    this.barriers.length = 0;
    for (const m of this.wallMarks) this.removeDecal(m);
    this.wallMarks.length = 0;
    for (const s of [...this.slabs]) this.removeSlab(s);
    this.trails.clear();
    this.charges.length = 0;
    this.seq = 0;
    for (const f of this.bodies) if (f) f.groundMark = null;
  }

  // ---------------------------------------------------------------- debug (?debug: groundDemo / groundTest)
  // Every name x variant in a grid on the ring, fully revealed, hot seams lit (review the art in place).
  demo(group = 'all') {
    this.clear();
    const names = Object.keys(DECALS).filter((n) => group === 'all' || DECALS[n].group === group || n === group);
    this.use(new Set(names), true);
    const cell = group === 'all' ? 1.05 : 2.1, H = RING_HALF - 0.3;
    let x = -H, z = -H;
    for (const name of names) {
      const e = this.active[name];
      if (!e) continue;
      const span = Math.max(1, Math.round(e.w / e.h)) * cell;
      for (let i = 0; i < e.frames.length; i++) {
        if (x + span > H) { x = -H; z += cell; }
        const c = { x: x + span / 2, z: z + cell / 2, surface: this.mode === 'training' ? 'holo' : 'ring', tier: 0, force: 0, style: 'stone', D: cell, t0: this.time, life: 0, persistent: true, demo: true, parts: [], chunks: [], slabs: [], dissolving: false, mergeable: false };
        const p = this.addPart(c, name, c.x, c.z, span * 0.96, { variant: i, tint: new THREE.Color('#ffb43a'), reveal: 1e-3, noFlip: true });
        if (p) {
          p.mesh.rotation.y = 0;
          p.u.uReveal.value = 2;
          p.u.uHeat.value = 0.6;
          this.clusters.push(c);
        }
        x += span;
      }
    }
    return `${names.length} names, ${this.clusters.length} decals (${Object.values(this.active).filter((e) => e.src === 'custom').length} custom)`;
  }

  // live counts, for soaks
  stats() {
    let persistent = 0;
    for (const c of this.clusters) if (c.persistent && !c.dissolving) persistent++;
    return {
      decals: this.meshCount(true), clusters: this.clusters.length, persistent, chunks: GROUND.caps.chunks - this.chunkFree.length,
      slabs: this.slabs.length, barriers: this.barriers.length, wallCraters: this.wallMarks.length, pages: this.procTex.length + (this.custom?.pages.filter((p) => p.tex).length ?? 0),
    };
  }

  // flat list of live floor decals (debug: `game.fx.ground.decals.filter((d) => d.key === 'charge0')`)
  get decals() {
    const out = [];
    for (const c of this.clusters) for (const p of c.parts) if (!p.gone) out.push({ name: p.name, key: c.key, cluster: c, mesh: p.mesh });
    return out;
  }
}
