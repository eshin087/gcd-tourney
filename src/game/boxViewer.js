import * as THREE from 'three';

// Training / debug overlay: outlines the current frame's hurt boxes (blue) and hit
// boxes (red, active frames only) on a fighter's sprite plane, so players and art QA
// can see exactly why a hit did or didn't connect. Grey = the default hurt box used
// when a sheet has no boxes for that frame.
const MAX_RECTS = 8;
const HURT = new THREE.Color('#3fd6ff');
const HIT = new THREE.Color('#ff3a4a');
const FALLBACK = new THREE.Color('#9aa0b8');
// head check (lab animation viewer, actor.headCheck): the scale probe's head box on this frame (gold; orange when the
// strip is off the idle) and the approved idle's head box centred on it (white), from anims.json meta.scaleAudit
const HEAD = new THREE.Color('#ffd23f');
const HEAD_OFF = new THREE.Color('#ff5a3c');
const HEAD_REF = new THREE.Color('#f4f4ff');

export class BoxViewer {
  constructor(actor) {
    this.actor = actor;
    this.pos = new Float32Array(MAX_RECTS * 8 * 3);
    this.col = new Float32Array(MAX_RECTS * 8 * 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute('color', new THREE.BufferAttribute(this.col, 3).setUsage(THREE.DynamicDrawUsage));
    this.lines = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ vertexColors: true, depthTest: false, depthWrite: false, transparent: true }));
    this.lines.renderOrder = 60;
    this.lines.frustumCulled = false;
    // child of the actor root (feet position), oriented like the billboard but never mirrored:
    // boxes() already mirrors x for the facing
    actor.root.add(this.lines);
  }

  set visible(v) {
    this.lines.visible = v;
  }

  update(defaultHurt) {
    const { actor } = this;
    const asset = actor.asset, flip = actor.flip;
    let n = 0;
    const rect = (b, c) => {
      if (n >= MAX_RECTS) return;
      const P = [b.x0, b.y0, b.x1, b.y0, b.x1, b.y0, b.x1, b.y1, b.x1, b.y1, b.x0, b.y1, b.x0, b.y1, b.x0, b.y0];
      for (let i = 0; i < 8; i++) {
        const k = (n * 8 + i) * 3;
        this.pos[k] = P[i * 2];
        this.pos[k + 1] = P[i * 2 + 1];
        this.pos[k + 2] = 0.02;
        this.col[k] = c.r;
        this.col[k + 1] = c.g;
        this.col[k + 2] = c.b;
      }
      n++;
    };
    const hurt = asset.boxes(actor.frame, 'hurt', flip);
    for (const b of hurt || defaultHurt) rect(b, hurt ? HURT : FALLBACK);
    for (const b of asset.boxes(actor.frame, 'hit', flip) || []) rect(b, HIT);
    if (actor.headCheck) this.headBoxes(rect);
    const geo = this.lines.geometry;
    geo.setDrawRange(0, n * 8);
    geo.attributes.position.needsUpdate = true;
    geo.attributes.color.needsUpdate = true;
    this.lines.quaternion.copy(actor.mesh.quaternion);
  }

  // the frame's measured head box and the idle head's size around the same centre, in local units like boxes()
  headBoxes(rect) {
    const { actor } = this, meta = actor.asset.meta, A = meta.scaleAudit;
    const s = A?.anims?.[actor.animName], ref = A?.ref?.box;
    if (!s || !ref) return;
    const ppu = meta.pixelsPerUnit, [px, py] = meta.pivot, flip = actor.flip;
    const local = (x0, y0, x1, y1) => {
      let a = (x0 - px) / ppu, b = (x1 + 1 - px) / ppu;
      if (flip < 0) [a, b] = [-b, -a];
      return { x0: a, x1: b, y0: (py - (y1 + 1)) / ppu, y1: (py - y0) / ppu };
    };
    const box = s.boxes?.[actor.fi];
    const [cx, cy] = box ? [(box[0] + box[2]) / 2, (box[1] + box[3]) / 2] : [(ref[0] + ref[2]) / 2, (ref[1] + ref[3]) / 2];
    const hw = (ref[2] - ref[0]) / 2, hh = (ref[3] - ref[1]) / 2;
    rect(local(cx - hw, cy - hh, cx + hw, cy + hh), HEAD_REF);
    if (box) rect(local(...box), ['uniform', 'drift', 'pop'].includes(s.verdict) ? HEAD_OFF : HEAD);
  }

  dispose() {
    this.lines.removeFromParent();
    this.lines.geometry.dispose();
    this.lines.material.dispose();
  }
}
