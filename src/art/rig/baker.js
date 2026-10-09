// Bakes a posed 3D chibi into a pixel-art sprite sheet (same format as hand-made
// sheets): toon color pass + ID/depth pass -> contour lines, stamped faces,
// motion smears and a dark outline, all on an exact pixel grid.
import * as THREE from 'three';
import { buildRig } from './rig.js';
import { BAKE } from './toon.js';
import { evalKeys, sampleTimes } from './pose.js';
import { stampFace, drawBigEye } from './face.js';
import { hex, darken, lighten } from '../pixel.js';

export const FRAME = 112;
export const PPU = 44;
export const PIVOT = [56, 104];
const TURN = 38; // sprite turned toward the viewer (3/4 view), degrees
const ELEV = 13; // bake camera elevation, degrees
const D = Math.PI / 180;
const OUTLINE = hex('#130d1c');

// Which limb does the damage on each attack's active frames ('body' = whole front half).
export const STRIKES = {
  light1: ['handF'], light2: ['handN'], light3: ['footN'], light4: ['footN'], heavy: ['handN'],
  airLight1: ['handF'], airLight2: ['footN'], airLight3: ['footF'], airHeavy: ['handN', 'handF'],
  special: ['body'],
  specialForward: ['handN'], // Rhythm Echo claw (Killua); harmless for cast poses (shot kinds never check melee)
};

// Hurtbox = silhouette bounds, trimmed so grazing a hair spike doesn't count.
export function hurtBoxFromPixels(px, W, H) {
  let x0 = W, y0 = H, x1 = -1, y1 = -1;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (px[y * W + x] >>> 24) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  }
  if (x1 < 0) return null;
  const w = x1 - x0 + 1, h = y1 - y0 + 1;
  const ix = Math.round(w * 0.18), iy = Math.round(h * 0.06);
  return [x0 + ix, y0 + iy, Math.max(2, w - ix * 2), Math.max(2, h - iy)];
}

const pack = (r, g, b, a = 255) => ((a << 24) | (b << 16) | (g << 8) | r) >>> 0;

function makeCamera(W, H, ppu, pivot, elev) {
  const cam = new THREE.OrthographicCamera(-W / 2 / ppu, W / 2 / ppu, H / 2 / ppu, -H / 2 / ppu, 0.1, 40);
  const e = elev * D;
  const dir = new THREE.Vector3(0, -Math.sin(e), -Math.cos(e));
  const up = new THREE.Vector3(0, Math.cos(e), -Math.sin(e));
  // world origin (the feet) lands on the pivot pixel
  const offY = (pivot[1] - H / 2) / ppu;
  const offX = (W / 2 - pivot[0]) / ppu;
  const pos = up.clone().multiplyScalar(offY).add(new THREE.Vector3(offX, 0, 0)).addScaledVector(dir, -8);
  cam.position.copy(pos);
  cam.up.copy(up);
  cam.lookAt(pos.clone().add(dir));
  cam.updateMatrixWorld(true);
  cam.userData.dir = dir;
  return cam;
}

class Baker {
  constructor(def, renderer) {
    this.def = def;
    this.renderer = renderer;
    this.rig = buildRig(def.model);
    this.scene = new THREE.Scene();
    this.turn = new THREE.Group();
    this.turn.rotation.y = -TURN * D;
    this.turn.add(this.rig.root);
    this.rig.turnDeg = TURN;
    this.scene.add(this.turn);
    // per-part lookup for post-processing
    this.info = [null];
    for (const m of this.rig.parts) {
      const r = m.material.uniforms;
      const base = [r.c1.value.x, r.c1.value.y, r.c1.value.z].map((v) => Math.round(v * 255));
      this.info[m.userData.id] = {
        group: m.userData.group,
        groupName: m.userData.groupName,
        line: darken(base, 0.55),
        light: [r.c2.value.x, r.c2.value.y, r.c2.value.z].map((v) => Math.round(v * 255)),
      };
    }
    this.skinIds = new Set(this.rig.byGroup('head').map((m) => m.userData.id));
    this.plateIds = new Set(this.rig.byGroup('plate').map((m) => m.userData.id));
  }

  setup(W, H, ppu, pivot, elev = ELEV) {
    this.W = W; this.H = H;
    this.cam = makeCamera(W, H, ppu, pivot, elev);
    const L = new THREE.Vector3(0.62, 0.72, 0.55).normalize(); // world: front-up-near
    BAKE.light.value.copy(L).transformDirection(this.cam.matrixWorldInverse);
    BAKE.range.value.set(4, 12);
    if (this.rt) this.rt.dispose();
    this.rt = new THREE.WebGLRenderTarget(W, H, { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, depthBuffer: true });
    this.bufC = new Uint8Array(W * H * 4);
    this.bufI = new Uint8Array(W * H * 4);
  }

  pass(mode, buf) {
    const r = this.renderer;
    BAKE.mode.value = mode;
    r.setRenderTarget(this.rt);
    r.setClearColor(0x000000, 0);
    r.clear(true, true, true);
    r.render(this.scene, this.cam);
    r.readRenderTargetPixels(this.rt, 0, 0, this.W, this.H, buf);
  }

  project(obj) {
    const v = obj.getWorldPosition(new THREE.Vector3()).project(this.cam);
    return { x: ((v.x + 1) / 2) * this.W - 0.5, y: ((1 - v.y) / 2) * this.H - 0.5 };
  }

  facing(obj) {
    const c = this.rig.anchors.headCenter.getWorldPosition(new THREE.Vector3());
    const p = obj.getWorldPosition(new THREE.Vector3());
    const n = p.sub(c).normalize();
    return -n.dot(this.cam.userData.dir);
  }

  // Render the current pose into a Uint32 pixel array (W*H, ABGR).
  frame(pose, smear = null, big = false) {
    const { W, H } = this;
    this.pass(0, this.bufC);
    this.pass(1, this.bufI);
    const n = W * H;
    const px = new Uint32Array(n);
    const id = new Uint8Array(n);
    const depth = new Float32Array(n);
    for (let y = 0; y < H; y++) {
      const sy = H - 1 - y; // readPixels is bottom-up
      for (let x = 0; x < W; x++) {
        const s = (sy * W + x) * 4, i = y * W + x;
        const pid = this.bufI[s];
        id[i] = pid;
        if (!pid) continue;
        depth[i] = (this.bufI[s + 1] + this.bufI[s + 2] / 255) / 255;
        px[i] = pack(this.bufC[s], this.bufC[s + 1], this.bufC[s + 2]);
      }
    }
    // contour lines where a part sits behind another part
    const out = new Uint32Array(px);
    const range = BAKE.range.value.y - BAKE.range.value.x;
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = y * W + x, a = id[i];
        if (!a) continue;
        const A = this.info[a];
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const xx = x + dx, yy = y + dy;
          if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue;
          const j = yy * W + xx, b = id[j];
          if (!b || b === a) continue;
          const dz = (depth[i] - depth[j]) * range;
          const B = this.info[b];
          if ((B.group !== A.group && dz > 0.035) || dz > 0.16) {
            out[i] = pack(...A.line);
            break;
          }
        }
      }
    }
    // face
    const R = this.rig;
    const eyes = [R.anchors.eyeN, R.anchors.eyeF].map((o) => ({ ...this.project(o), facing: this.facing(o) }));
    const mouth = { ...this.project(R.anchors.mouth), facing: this.facing(R.anchors.mouth) };
    const cheeks = [R.anchors.cheekN, R.anchors.cheekF].map((o) => ({ ...this.project(o), facing: this.facing(o) }));
    stampFace(out, id, W, H, this.skinIds, pose, { colors: this.def.model.face, eyes, mouth, cheeks, whiskers: this.def.model.face.whiskers, big });
    if (R.anchors.plate && this.plateIds.size) {
      const p = this.project(R.anchors.plate);
      const sym = pack(...hex(this.def.model.face.symbol || '#3a3448'));
      for (const [dx, dy] of [[0, 0], [1, 0], [0, -1]]) {
        const xx = Math.round(p.x + dx), yy = Math.round(p.y + dy);
        const i = yy * W + xx;
        if (xx >= 0 && yy >= 0 && xx < W && yy < H && this.plateIds.has(id[i])) out[i] = sym;
      }
    }
    // motion smear behind the body
    if (smear) for (const s of smear) this.drawSmear(out, id, s);
    // dark outline around the silhouette (tinted by what it borders)
    const fin = new Uint32Array(out);
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = y * W + x;
        if (out[i] >>> 24) continue;
        let nb = 0;
        if (x > 0 && out[i - 1] >>> 24) nb = out[i - 1];
        else if (x < W - 1 && out[i + 1] >>> 24) nb = out[i + 1];
        else if (y > 0 && out[i - W] >>> 24) nb = out[i - W];
        else if (y < H - 1 && out[i + W] >>> 24) nb = out[i + W];
        if (!nb) continue;
        const r = nb & 255, g = (nb >> 8) & 255, b = (nb >> 16) & 255;
        fin[i] = pack(Math.round(OUTLINE[0] * 0.75 + r * 0.12), Math.round(OUTLINE[1] * 0.75 + g * 0.12), Math.round(OUTLINE[2] * 0.75 + b * 0.12));
      }
    }
    return fin;
  }

  // Swept limb: filled quads between successive (joint, tip) positions, only on
  // empty pixels so it trails behind the character.
  drawSmear(out, id, s) {
    const { W, H } = this;
    const col = pack(...s.color);
    const fillTri = (a, b, c) => {
      const x0 = Math.max(0, Math.floor(Math.min(a.x, b.x, c.x))), x1 = Math.min(W - 1, Math.ceil(Math.max(a.x, b.x, c.x)));
      const y0 = Math.max(0, Math.floor(Math.min(a.y, b.y, c.y))), y1 = Math.min(H - 1, Math.ceil(Math.max(a.y, b.y, c.y)));
      const area = (b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y);
      if (Math.abs(area) < 0.01) return;
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
        const w0 = ((b.x - x) * (c.y - y) - (c.x - x) * (b.y - y)) / area;
        const w1 = ((c.x - x) * (a.y - y) - (a.x - x) * (c.y - y)) / area;
        const w2 = 1 - w0 - w1;
        if (w0 >= -0.02 && w1 >= -0.02 && w2 >= -0.02) {
          const i = y * W + x;
          if (!(out[i] >>> 24)) out[i] = col;
        }
      }
    };
    const P = s.path;
    for (let k = 0; k < P.length - 1; k++) {
      const a = P[k], b = P[k + 1];
      // taper: older samples are thinner (pull the joint toward the tip)
      const ta = 0.35 + (0.65 * k) / (P.length - 1), tb = 0.35 + (0.65 * (k + 1)) / (P.length - 1);
      const ja = { x: a.tip.x + (a.joint.x - a.tip.x) * ta, y: a.tip.y + (a.joint.y - a.tip.y) * ta };
      const jb = { x: b.tip.x + (b.joint.x - b.tip.x) * tb, y: b.tip.y + (b.joint.y - b.tip.y) * tb };
      fillTri(ja, a.tip, b.tip);
      fillTri(ja, b.tip, jb);
    }
  }

  // Screen-space box around the striking hand/foot (frame pixels).
  strikeBox(name, hurt) {
    const R = this.rig;
    if (name === 'body') {
      if (!hurt) return null;
      const [x, y, w, h] = hurt;
      return [x + Math.round(w * 0.45), y + Math.round(h * 0.1), Math.round(w * 0.75), Math.round(h * 0.75)];
    }
    const side = name.endsWith('N') ? 'N' : 'F';
    let obj;
    if (name.startsWith('hand')) {
      const A = R.arms[side];
      obj = (A.fist.visible ? A.fist : A.open).children[0];
    } else obj = R.legs[side].an.children[0];
    const c = this.project(obj);
    const r = name.startsWith('hand') ? 7 : 8;
    return [Math.round(c.x - r), Math.round(c.y - r), r * 2 + 1, r * 2 + 1];
  }

  limbNodes(name) {
    const R = this.rig;
    const side = name.endsWith('N') ? 'N' : 'F';
    if (name.startsWith('hand')) return { joint: R.arms[side].el, tip: R.arms[side].wr, mat: this.def.model.outfit.foreArm };
    return { joint: R.legs[side].kn, tip: R.legs[side].an, mat: this.def.model.outfit.shin };
  }
}

function getRenderer(given) {
  if (given) return { r: given, own: false };
  const r = new THREE.WebGLRenderer({ antialias: false, alpha: true, preserveDrawingBuffer: false });
  r.setPixelRatio(1);
  r.setSize(8, 8, false);
  return { r, own: true };
}

// Bake every animation into a sheet. Returns { canvas, meta, portrait, cutin }.
export function bakeCharacter(def, opts = {}) {
  const { r: renderer, own } = getRenderer(opts.renderer);
  const prevTarget = renderer.getRenderTarget();
  const prevClear = renderer.getClearColor(new THREE.Color());
  const prevAlpha = renderer.getClearAlpha();
  const prevShadow = renderer.shadowMap.enabled;
  renderer.shadowMap.enabled = false;
  const B = new Baker(def, renderer);
  B.setup(FRAME, FRAME, PPU, PIVOT);

  const anims = def.anims;
  const cols = 16;
  let total = 0;
  for (const a of Object.values(anims)) total += sampleTimes(a).length;
  const rows = Math.ceil(total / cols);
  const canvas = document.createElement('canvas');
  canvas.width = cols * FRAME;
  canvas.height = rows * FRAME;
  const ctx = canvas.getContext('2d');
  const meta = { frameWidth: FRAME, frameHeight: FRAME, columns: cols, pivot: PIVOT, pixelsPerUnit: PPU, facing: 'right', source: '3d-bake', complete: true, animations: {}, boxes: {} };
  const img = ctx.createImageData(FRAME, FRAME);
  const img32 = new Uint32Array(img.data.buffer);
  let idx = 0;
  for (const [name, a] of Object.entries(anims)) {
    const samples = sampleTimes(a);
    const frames = [], durations = [];
    samples.forEach(({ t, ms }, k) => {
      let smear = null;
      const limbs = a.smear?.[k];
      if (limbs && k > 0) {
        const t0 = samples[k - 1].t;
        smear = limbs.map((ln) => {
          const nodes = B.limbNodes(ln);
          const path = [];
          for (let s = 0; s <= 5; s++) {
            const ts = t0 + ((t - t0) * s) / 5;
            B.rig.applyPose(evalKeys(a.keys, ts, a.loop, a.cycle), ts);
            path.push({ joint: B.project(nodes.joint), tip: B.project(nodes.tip) });
          }
          const base = B.rig.model.palette[nodes.mat];
          const baseHex = typeof base === 'string' ? base : base.base;
          return { path, color: lighten(hex(baseHex), 0.45) };
        });
      }
      const p = evalKeys(a.keys, t, a.loop, a.cycle);
      B.rig.applyPose(p, t);
      const px = B.frame(p, smear);
      img32.set(px);
      // hit/hurt boxes for the combat system
      const hurt = hurtBoxFromPixels(px, FRAME, FRAME);
      const box = {};
      if (hurt) box.hurt = [hurt];
      const strike = a.strike || STRIKES[name];
      if (strike && a.phases && k >= a.phases[0] && k < a.phases[0] + a.phases[1]) {
        // an empty list would mean "cannot hit"; if no strike box resolved, leave it out so the move's reach applies
        const hit = strike.map((ln) => B.strikeBox(ln, hurt)).filter(Boolean);
        if (hit.length) box.hit = hit;
      }
      meta.boxes[idx] = box;
      ctx.putImageData(img, (idx % cols) * FRAME, Math.floor(idx / cols) * FRAME);
      frames.push(idx);
      durations.push(ms);
      idx++;
    });
    const m = { frames, durations, loop: !!a.loop };
    if (a.phases) m.phases = a.phases;
    meta.animations[name] = m;
  }

  const portrait = bakePortrait(B, def);
  const cutin = bakeCutin(B, def);

  renderer.setRenderTarget(prevTarget);
  renderer.setClearColor(prevClear, prevAlpha);
  renderer.shadowMap.enabled = prevShadow;
  B.rt.dispose();
  for (const m of B.rig.parts) { m.geometry.dispose(); m.material.dispose(); }
  if (own) { renderer.dispose(); renderer.forceContextLoss?.(); }
  return { canvas, meta, portrait, cutin };
}

// Head-and-shoulders portrait for the HUD.
function bakePortrait(B, def) {
  const S = 48;
  const p = evalKeys(def.anims.idle.keys, 0, true, def.anims.idle.cycle);
  B.rig.applyPose(p, 0);
  const hc = B.rig.anchors.headCenter.getWorldPosition(new THREE.Vector3());
  const ppu = 66;
  // pivot chosen so the head center sits slightly above the middle
  const prevTurn = B.turn.rotation.y;
  B.turn.rotation.y = -34 * D;
  B.rig.root.updateMatrixWorld(true);
  B.turn.updateMatrixWorld(true);
  const hc2 = B.rig.anchors.headCenter.getWorldPosition(new THREE.Vector3());
  B.setup(S, S, ppu, [S / 2 - hc2.x * ppu, S / 2 + 4 + hc2.y * ppu], 8);
  const px = B.frame({ ...p, face: def.portraitFace || 'normal' }, null, true);
  B.turn.rotation.y = prevTurn;
  void hc;
  const c = document.createElement('canvas');
  c.width = S; c.height = S;
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(S, S);
  new Uint32Array(img.data.buffer).set(px);
  ctx.putImageData(img, 0, 0);
  B.setup(FRAME, FRAME, PPU, PIVOT);
  return c;
}

// Wide eye-strip for the super flash cut-in (DBFZ style).
function bakeCutin(B, def) {
  const W = 240, H = 64;
  const p = evalKeys(def.anims.idle.keys, 0, true, def.anims.idle.cycle);
  B.rig.applyPose({ ...p }, 0);
  const prevTurn = B.turn.rotation.y;
  B.turn.rotation.y = -62 * D;
  B.turn.updateMatrixWorld(true);
  const eye = B.rig.anchors.eyeN.getWorldPosition(new THREE.Vector3());
  const eyeF = B.rig.anchors.eyeF.getWorldPosition(new THREE.Vector3());
  const mid = eye.clone().add(eyeF).multiplyScalar(0.5);
  const ppu = 330;
  B.setup(W, H, ppu, [W / 2 - mid.x * ppu, H / 2 + mid.y * ppu - 6], 4);
  const px = B.frame({ ...p, face: 'closed', blindfold: false }, null, true); // face pixels replaced by big eyes below
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(W, H);
  new Uint32Array(img.data.buffer).set(px);
  ctx.putImageData(img, 0, 0);
  // repaint the eye area with skin, then draw big anime eyes
  const C = def.model.face;
  const skin = def.model.palette.skin;
  const skinHex = typeof skin === 'string' ? skin : skin.base;
  for (const [o, mirror] of [[B.rig.anchors.eyeN, false], [B.rig.anchors.eyeF, true]]) {
    const q = B.project(o);
    ctx.fillStyle = skinHex;
    ctx.fillRect(q.x - 24, q.y - 14, 48, 26);
    drawBigEye(ctx, q.x, q.y, 46, 30, C, mirror, def.cutinEyes ?? def.cutinRedEyes);
  }
  // harden edges (no anti-aliasing)
  const im = ctx.getImageData(0, 0, W, H);
  for (let i = 3; i < im.data.length; i += 4) im.data[i] = im.data[i] > 100 ? 255 : 0;
  ctx.putImageData(im, 0, 0);
  B.turn.rotation.y = prevTurn;
  B.setup(FRAME, FRAME, PPU, PIVOT);
  return c;
}
