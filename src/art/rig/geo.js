// Geometry helpers for building chibi characters out of smooth primitives.
import * as THREE from 'three';

// Tapered capsule hanging from the origin down -Y: radius r0 at the top, r1 at the
// bottom, optional bulge (extra radius around 35% down, e.g. calves and forearms).
export function limb(len, r0, r1, o = {}) {
  const pts = [];
  const seg = 4;
  for (let i = 0; i <= seg; i++) {
    const a = (i / seg) * (Math.PI / 2);
    pts.push(new THREE.Vector2(Math.cos(a) * r1, -len - Math.sin(a) * r1 * (o.capB ?? 1)));
  }
  pts.reverse();
  const mid = [];
  if (o.bulge) mid.push(new THREE.Vector2(r0 + (r1 - r0) * 0.35 + o.bulge, -len * 0.35));
  const top = [];
  for (let i = 0; i <= seg; i++) {
    const a = (i / seg) * (Math.PI / 2);
    top.push(new THREE.Vector2(Math.cos(a) * r0, Math.sin(a) * r0 * (o.capT ?? 1)));
  }
  const all = [...pts, ...mid.reverse(), ...top];
  // profile must run bottom -> top for outward normals
  all.sort((p, q) => p.y - q.y);
  const g = new THREE.LatheGeometry(all, o.segments ?? 10);
  if (o.depth) g.scale(1, 1, o.depth);
  if (o.width) g.scale(o.width, 1, 1);
  g.computeVertexNormals();
  return g;
}

// Lathe from an explicit [radius, y] profile (bottom -> top), elliptical cross-section.
export function lathe(profile, o = {}) {
  const g = new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(Math.max(0.0001, r), y)), o.segments ?? 12);
  g.scale(o.sx ?? 1, 1, o.sz ?? 1);
  g.computeVertexNormals();
  return g;
}

export function ellipsoid(rx, ry, rz, ws = 14, hs = 10) {
  const g = new THREE.SphereGeometry(1, ws, hs);
  g.scale(rx, ry, rz);
  return g;
}

// Cone spike with its base at the origin pointing along +Y.
export function spike(r, h, sides = 5) {
  const g = new THREE.ConeGeometry(r, h, sides, 1);
  g.translate(0, h / 2, 0);
  return g;
}

// Anime head: round cranium, narrower jaw with the chin pushed forward-down.
// Faces +X. Returns geometry centered on the cranium.
export function animeHead(R, o = {}) {
  const g = new THREE.SphereGeometry(1, 20, 16);
  const p = g.attributes.position;
  const chin = o.chin ?? 0.16;
  for (let i = 0; i < p.count; i++) {
    let x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    if (y < 0) {
      const k = -y;
      z *= 1 - 0.3 * k * k;
      x *= 1 - 0.18 * k;
      x += chin * k * Math.max(0, x + 0.3);
      y *= 1 + 0.05 * k;
    }
    if (x < 0) x *= 0.93;
    p.setXYZ(i, x * R * (o.depth ?? 1), y * R * (o.height ?? 1), z * R * (o.width ?? 0.96));
  }
  g.computeVertexNormals();
  return g;
}

// Orient an object so its local +Y points along dir.
const Y = new THREE.Vector3(0, 1, 0);
export function pointAlong(obj, dir) {
  obj.quaternion.setFromUnitVectors(Y, dir.clone().normalize());
}

// Direction from head-local spherical angles: elevation (deg up from horizontal),
// azimuth (deg from forward +X toward the near side +Z).
export function sph(elev, azim) {
  const e = (elev * Math.PI) / 180, a = (azim * Math.PI) / 180;
  return new THREE.Vector3(Math.cos(e) * Math.cos(a), Math.sin(e), Math.cos(e) * Math.sin(a));
}
