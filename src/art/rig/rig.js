// A posable 3D chibi built from smooth primitives. Faces +X, up is +Y, and the
// "near" side (toward the bake camera) is +Z. Angles in poses are degrees.
import * as THREE from 'three';
import { toonMaterial, ramp } from './toon.js';
import { limb, lathe, ellipsoid, spike, animeHead, pointAlong, sph } from './geo.js';

const D = Math.PI / 180;

export const DEFAULT_PROPS = {
  thigh: 0.235, shin: 0.225, ankle: 0.055,
  hipW: 0.082,
  pelvis: [0.13, 0.095, 0.112],
  spineUp: 0.04, torso: 0.335,
  shoulderW: 0.168, shoulderY: 0.29,
  upper: 0.165, fore: 0.15,
  armR: [0.062, 0.054], foreR: [0.056, 0.046],
  thighR: [0.096, 0.076], shinR: [0.074, 0.054],
  neck: 0.035, headR: 0.262, headUp: 0.2,
  torsoProfile: [[0.13, -0.04], [0.138, 0.04], [0.142, 0.11], [0.156, 0.18], [0.168, 0.24], [0.164, 0.285], [0.132, 0.32], [0.08, 0.345], [0.045, 0.355]],
  torsoDepth: 0.74,
  hand: 1.2, foot: 1.18,
};

// Slice of a lathe profile between two heights (interpolates the endpoints).
function sliceProfile(prof, y0, y1) {
  const at = (y) => {
    for (let i = 0; i < prof.length - 1; i++) {
      const [ra, ya] = prof[i], [rb, yb] = prof[i + 1];
      if (y >= ya && y <= yb) return ra + ((rb - ra) * (y - ya)) / (yb - ya || 1);
    }
    return y < prof[0][1] ? prof[0][0] : prof[prof.length - 1][0];
  };
  const out = [[at(y0), y0]];
  for (const p of prof) if (p[1] > y0 && p[1] < y1) out.push(p);
  out.push([at(y1), y1]);
  return out;
}

export function buildRig(model) {
  const P = { ...DEFAULT_PROPS, ...(model.props || {}) };
  const ramps = {};
  for (const [k, v] of Object.entries(model.palette)) ramps[k] = typeof v === 'string' ? ramp(v) : ramp(v.base, v);
  const parts = [];
  const groups = new Map();
  let nextId = 1;
  const gid = (name) => {
    if (!groups.has(name)) groups.set(name, groups.size + 1);
    return groups.get(name);
  };
  const add = (parent, geo, mat, group, opt = {}) => {
    const id = nextId++;
    const m = new THREE.Mesh(geo, toonMaterial(ramps[mat], id, opt));
    m.userData = { id, group: gid(group), groupName: group, mat };
    if (opt.pos) m.position.set(...opt.pos);
    if (opt.rot) m.rotation.set(...opt.rot.map((a) => a * D));
    parent.add(m);
    parts.push(m);
    return m;
  };

  const O = model.outfit;
  const root = new THREE.Group();
  root.rotation.order = 'YXZ';
  // root pivots at the pelvis so flips and lying down rotate around the body center
  const hips = new THREE.Group();
  root.add(hips);
  add(hips, ellipsoid(...P.pelvis), O.pelvis, 'pelvis');

  // ---- torso & head
  const spine = new THREE.Group();
  spine.rotation.order = 'YXZ';
  spine.position.y = P.spineUp;
  hips.add(spine);
  for (const band of O.torso) {
    add(spine, lathe(sliceProfile(P.torsoProfile, band.y0, band.y1), { sz: P.torsoDepth }), band.mat, 'torso');
  }
  if (model.extraTorso) model.extraTorso({ add, spine, P, THREE, D });

  const neck = new THREE.Group();
  neck.rotation.order = 'YXZ';
  neck.position.y = P.torso;
  spine.add(neck);
  add(neck, limb(0.1, 0.048, 0.05), 'skin', 'neck', { pos: [0, 0.08, 0] });
  if (O.collar === 'ring') add(neck, new THREE.TorusGeometry(0.072, 0.02, 6, 16), O.collarMat || 'white', 'collar', { pos: [0.01, 0.0, 0], rot: [90, 0, 0] });
  if (O.collar === 'high') {
    const g = new THREE.CylinderGeometry(0.095, 0.078, 0.13, 16, 1, true, Math.PI * 0.62, Math.PI * 1.76);
    add(neck, g, O.collarMat || 'shirt', 'collar', { pos: [-0.005, 0.045, 0], side: THREE.DoubleSide });
  }

  const head = new THREE.Group();
  head.rotation.order = 'YXZ';
  head.position.y = P.neck;
  neck.add(head);
  const HC = new THREE.Vector3(0.0, P.headUp, 0);
  const headMesh = add(head, animeHead(P.headR, model.head || {}), 'skin', 'head', { pos: [HC.x, HC.y, HC.z] });
  for (const s of [1, -1]) add(head, ellipsoid(0.036, 0.055, 0.022), 'skin', 'ear', { pos: [-0.02, HC.y - 0.035, s * P.headR * 0.9] });

  // hair cap: sphere with the face and ears pushed inside the skull
  const H = model.hair;
  const capG = new THREE.SphereGeometry(P.headR * (H.capScale ?? 1.07), 22, 16);
  const cp = capG.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < cp.count; i++) {
    v.set(cp.getX(i), cp.getY(i), cp.getZ(i));
    const d = v.clone().normalize();
    const hairline = H.hairline ?? 0.32; // how low the hair comes down on the forehead
    const face = d.x > 0.05 && d.y < hairline + (d.x - 0.05) * (H.hairSlope ?? -0.15);
    const ears = d.y < 0.02 && Math.abs(d.z) > 0.55 && d.x > -0.35;
    const neckHole = d.y < (H.nape ?? -0.45);
    if (face || ears || neckHole) v.multiplyScalar(0.82);
    cp.setXYZ(i, v.x, v.y, v.z);
  }
  capG.computeVertexNormals();
  add(head, capG, H.mat, 'hair', { pos: [HC.x - 0.01, HC.y + 0.01, HC.z], t2: 0.82 });
  const hairGroup = new THREE.Group();
  hairGroup.position.copy(HC);
  head.add(hairGroup);
  const spikes = [];
  for (const s of H.spikes) {
    // [elevation, azimuth, length, radius, sides, tiltBack]
    const [el, az, len, r, sides = 5, tilt = 0] = s;
    const dir = sph(el, az);
    const base = dir.clone().multiplyScalar(P.headR * (s[6] ?? 0.86));
    const tip = sph(el - tilt * 0.3, az).add(new THREE.Vector3(-tilt * 0.012, 0, 0)).normalize();
    const g = new THREE.Group();
    g.position.copy(base);
    pointAlong(g, tip);
    hairGroup.add(g);
    add(g, spike(r, len, sides), H.mat, 'hair', { t2: 0.82 });
    spikes.push({ g, rest: g.quaternion.clone(), dir: tip });
  }
  for (const b of H.bangs || []) {
    // [x, y, z (head-local base), dir x, dir y, dir z, length, radius]
    const [x, y, z, dx, dy, dz, len, r, sides = 4] = b;
    const g = new THREE.Group();
    g.position.set(x, y, z);
    pointAlong(g, new THREE.Vector3(dx, dy, dz));
    hairGroup.add(g);
    add(g, spike(r, len, sides), H.mat, 'hair', { t2: 0.82 });
  }

  // headband
  let tails = [];
  let band = null;
  if (model.headband) {
    const B = model.headband;
    band = new THREE.Group();
    band.position.copy(HC).add(new THREE.Vector3(0, B.y ?? 0.06, 0));
    band.rotation.z = (B.tilt ?? -6) * D;
    head.add(band);
    add(band, new THREE.CylinderGeometry(P.headR * 1.08, P.headR * 1.08, 0.07, 26, 1, true), B.band, 'band', { side: THREE.DoubleSide });
    add(band, new THREE.BoxGeometry(0.026, 0.068, 0.125), B.plate, 'plate', { pos: [P.headR * 1.075, 0, 0], t1: 0.35, t2: 0.8 });
    if (B.tails) {
      for (const [k, s] of [[0, 1], [1, -1]]) {
        const tg = new THREE.Group();
        tg.position.set(-P.headR * 1.07, 0, s * 0.02);
        band.add(tg);
        add(tg, new THREE.BoxGeometry(0.014, 0.17, 0.035), B.band, 'band', { pos: [0, -0.085, 0] });
        tails.push({ g: tg, k });
      }
    }
  }

  // blindfold (Gojo): a wide band over the eyes; a pose can lift it with `blindfold: false`.
  // Face stamps only land on skin pixels, so the band hides the eyes by itself.
  let blindfold = null;
  if (model.blindfold) {
    const B = model.blindfold;
    blindfold = new THREE.Group();
    blindfold.position.copy(HC).add(new THREE.Vector3(0, B.y ?? -0.03, 0));
    blindfold.rotation.z = (B.tilt ?? 0) * D;
    head.add(blindfold);
    add(blindfold, new THREE.CylinderGeometry(P.headR * (B.r ?? 1.06), P.headR * (B.r ?? 1.06), B.h ?? 0.1, 28, 1, true), B.mat, 'band', { side: THREE.DoubleSide });
  }

  // face anchors (head-local)
  const anchors = {};
  const anchor = (name, x, y, z) => {
    const o = new THREE.Object3D();
    o.position.set(HC.x + x, HC.y + y, HC.z + z);
    head.add(o);
    anchors[name] = o;
  };
  const F = model.faceAnchors || {};
  anchor('eyeN', ...(F.eyeN || [0.215, -0.035, 0.092]));
  anchor('eyeF', ...(F.eyeF || [0.215, -0.035, -0.092]));
  anchor('mouth', ...(F.mouth || [0.228, -0.145, 0.03]));
  anchor('cheekN', 0.17, -0.095, 0.16);
  anchor('cheekF', 0.17, -0.095, -0.16);
  anchor('headCenter', 0, 0, 0);
  if (model.headband) {
    const o = new THREE.Object3D();
    o.position.set(P.headR * 1.08 + 0.016, 0, 0);
    band.add(o);
    anchors.plate = o;
  }

  // ---- arms
  const arms = {};
  for (const [side, s] of [['N', 1], ['F', -1]]) {
    const sh = new THREE.Group();
    sh.rotation.order = 'XYZ';
    sh.position.set(0, P.shoulderY, s * P.shoulderW);
    spine.add(sh);
    add(sh, ellipsoid(P.armR[0] * 1.2, P.armR[0] * 1.12, P.armR[0] * 1.12), O.shoulder || O.upperArm, 'arm' + side, { pos: [0, -0.01, 0] });
    add(sh, limb(P.upper, ...P.armR), O.upperArm, 'arm' + side);
    if (O.sleeve) add(sh, limb(P.upper * O.sleeve.len, P.armR[0] * 1.18, P.armR[1] * 1.22), O.sleeve.mat, 'arm' + side, { pos: [0, 0.005, 0] });
    const el = new THREE.Group();
    el.rotation.order = 'XYZ';
    el.position.y = -P.upper;
    sh.add(el);
    add(el, limb(P.fore, ...P.foreR, { bulge: 0.004 }), O.foreArm, 'fore' + side);
    if (O.warmer) add(el, limb(P.fore * 0.72, P.foreR[0] * 1.16, P.foreR[1] * 1.22), O.warmer, 'fore' + side, { pos: [0, -P.fore * 0.2, 0] });
    const wr = new THREE.Group();
    wr.rotation.order = 'XYZ';
    wr.position.y = -P.fore;
    el.add(wr);
    const fist = new THREE.Group();
    const hs = P.hand;
    add(fist, ellipsoid(0.056 * hs, 0.052 * hs, 0.046 * hs), O.hand, 'hand' + side, { pos: [0.006, -0.042 * hs, 0] });
    add(fist, ellipsoid(0.02 * hs, 0.026 * hs, 0.018 * hs), O.hand, 'hand' + side, { pos: [0.046 * hs, -0.032 * hs, s * 0.024 * hs] });
    wr.add(fist);
    const open = new THREE.Group();
    add(open, ellipsoid(0.03 * hs, 0.062 * hs, 0.05 * hs), O.hand, 'hand' + side, { pos: [0.0, -0.052 * hs, 0] });
    add(open, ellipsoid(0.018 * hs, 0.034 * hs, 0.038 * hs), O.hand, 'hand' + side, { pos: [0.004, -0.104 * hs, 0] });
    add(open, ellipsoid(0.018 * hs, 0.028 * hs, 0.016 * hs), O.hand, 'hand' + side, { pos: [0.032 * hs, -0.036 * hs, s * 0.036 * hs] });
    wr.add(open);
    arms[side] = { sh, el, wr, fist, open };
  }

  // ---- legs
  const legs = {};
  for (const [side, s] of [['N', 1], ['F', -1]]) {
    const hip = new THREE.Group();
    hip.rotation.order = 'XYZ';
    hip.position.set(0, -0.015, s * P.hipW);
    hips.add(hip);
    add(hip, limb(P.thigh, ...P.thighR), O.thigh, 'thigh' + side);
    const kn = new THREE.Group();
    kn.rotation.order = 'XYZ';
    kn.position.y = -P.thigh;
    hip.add(kn);
    add(kn, limb(P.shin, ...P.shinR, { bulge: 0.008 }), O.shin, 'shin' + side);
    if (O.wrap) add(kn, limb(P.shin * 0.34, P.shinR[0] * 0.98, P.shinR[1] * 1.2), O.wrap, 'shin' + side, { pos: [0, -P.shin * 0.64, 0] });
    if (O.pantsCuff) add(kn, limb(0.05, P.shinR[1] * 1.45, P.shinR[1] * 1.5), O.shin, 'shin' + side, { pos: [0, -P.shin + 0.035, 0] });
    const an = new THREE.Group();
    an.rotation.order = 'XYZ';
    an.position.y = -P.shin;
    kn.add(an);
    const fs = P.foot;
    add(an, ellipsoid(0.085 * fs, 0.038 * fs, 0.05 * fs), O.foot, 'foot' + side, { pos: [0.035 * fs, -0.024 * fs, 0] });
    if (O.toes) add(an, ellipsoid(0.04 * fs, 0.026 * fs, 0.042 * fs), O.toes, 'foot' + side, { pos: [0.088 * fs, -0.03 * fs, 0] });
    if (O.sole) add(an, new THREE.BoxGeometry(0.19 * fs, 0.016, 0.088 * fs), O.sole, 'foot' + side, { pos: [0.04 * fs, -0.056 * fs, 0] });
    legs[side] = { hip, kn, an };
  }

  if (model.extras) model.extras({ add, root, hips, spine, neck, head, HC, P, THREE, D, arms, legs });

  const rig = { root, hips, spine, neck, head, arms, legs, parts, anchors, spikes, tails, blindfold, P, HC, groups, headMesh, model, hipH: P.thigh + P.shin + P.ankle };

  // snap helpers: parts whose bottoms can touch the floor
  rig.snapParts = parts.filter((m) => /^(foot|hand|head|pelvis|torso|shin|thigh|hair)/.test(m.userData.groupName));
  rig.byGroup = (name) => parts.filter((m) => m.userData.groupName === name);
  rig.applyPose = (pose, t = 0) => applyPose(rig, pose, t);
  return rig;
}

const tmpV = new THREE.Vector3();

export function applyPose(rig, p, t) {
  const { root, spine, neck, head, arms, legs } = rig;
  root.position.set(p.root.x || 0, rig.hipH, p.root.z || 0);
  root.rotation.set((p.root.roll || 0) * D, -(p.root.yaw || 0) * D, -(p.root.lean || 0) * D);
  const sq = p.squash ?? 1;
  root.scale.set(1 / Math.sqrt(sq), sq, 1 / Math.sqrt(sq));
  spine.rotation.set((p.spine.roll || 0) * D, -(p.spine.yaw || 0) * D, -(p.spine.lean || 0) * D);
  neck.rotation.set(0, -(p.head.yaw || 0) * 0.4 * D, -(p.head.nod || 0) * 0.35 * D);
  head.rotation.set((p.head.roll || 0) * D, -(p.head.yaw || 0) * 0.6 * D, -(p.head.nod || 0) * 0.65 * D);

  // Auto-aim: limbs reaching forward are counter-rotated against the body's turn
  // toward the viewer, so strikes read straight across the screen like hand-drawn sprites.
  const yawArm = (rig.turnDeg || 0) + (p.root.yaw || 0) + (p.spine.yaw || 0);
  const yawLeg = (rig.turnDeg || 0) + (p.root.yaw || 0);
  const aimW = (sw, k = 1) => k * Math.max(0, Math.min(1, (Math.sin((sw || 0) * D) - 0.3) / 0.6));
  for (const side of ['N', 'F']) {
    const a = p['a' + side], A = arms[side], s = side === 'N' ? 1 : -1;
    A.sh.rotation.set(-s * (a.ab || 0) * D, (-s * (a.tw || 0) + yawArm * aimW(a.sw, a.aim ?? 0.9)) * D, (a.sw || 0) * D);
    A.el.rotation.set(0, 0, (a.el || 0) * D);
    A.wr.rotation.set(0, 0, (a.wr || 0) * D);
    const open = a.hand === 'open' || a.hand === 'palm';
    A.fist.visible = !open;
    A.open.visible = open;
    if (a.hand === 'palm') A.wr.rotation.z += 70 * D;
    const l = p['l' + side], L = legs[side];
    L.hip.rotation.set(-s * (l.ab || 0) * D, (-s * (l.tw || 0) + yawLeg * aimW(l.sw, l.aim ?? 0.8)) * D, (l.sw || 0) * D);
    L.kn.rotation.set(0, 0, -(l.kn || 0) * D);
    // fl (0..1) blends the foot toward flat-on-the-floor; an adds on top (toes down < 0)
    const flat = (p.root.lean || 0) - (l.sw || 0) + (l.kn || 0);
    const ank = Math.max(-70, Math.min(70, (l.an || 0) + (l.fl ?? 1) * flat));
    L.an.rotation.set(0, 0, ank * D);
  }

  if (rig.blindfold) rig.blindfold.visible = p.blindfold !== false;
  // secondary motion: hair spikes and headband tails sway with "flutter"
  const fl = p.flutter || 0;
  rig.spikes.forEach((s, i) => {
    s.g.quaternion.copy(s.rest);
    if (fl) s.g.rotateX(Math.sin(t * 18 + i * 1.7) * 0.06 * fl);
    if (fl) s.g.rotateZ(Math.cos(t * 15 + i) * 0.05 * fl);
  });
  for (const tl of rig.tails) {
    tl.g.rotation.set(Math.sin(t * 14 + tl.k) * 0.15 * fl, 0, (-35 - fl * 22 + Math.sin(t * 20 + tl.k * 2) * 10 * fl - tl.k * 12) * D);
  }

  // ground snap: lowest point of the body rests on y = 0
  root.updateMatrixWorld(true);
  if (p.snap !== false) {
    let minY = Infinity;
    for (const m of rig.snapParts) {
      if (!m.visible || !m.parent.visible) continue;
      const g = m.geometry;
      const pos = g.attributes.position;
      const step = Math.max(1, Math.floor(pos.count / 60));
      for (let i = 0; i < pos.count; i += step) {
        tmpV.fromBufferAttribute(pos, i).applyMatrix4(m.matrixWorld);
        if (tmpV.y < minY) minY = tmpV.y;
      }
    }
    root.position.y += -minY + (p.root.y || 0);
  } else root.position.y = rig.hipH + (p.root.y || 0);
  root.updateMatrixWorld(true);
}
