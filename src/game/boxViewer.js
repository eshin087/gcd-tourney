import * as THREE from 'three';

// Training / debug overlay: outlines the current frame's hurt boxes (blue) and hit
// boxes (red, active frames only) on a fighter's sprite plane, so players and art QA
// can see exactly why a hit did or didn't connect. Grey = the default hurt box used
// when a sheet has no boxes for that frame.
const MAX_RECTS = 8;
const HURT = new THREE.Color('#3fd6ff');
const HIT = new THREE.Color('#ff3a4a');
const FALLBACK = new THREE.Color('#9aa0b8');

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
    const geo = this.lines.geometry;
    geo.setDrawRange(0, n * 8);
    geo.attributes.position.needsUpdate = true;
    geo.attributes.color.needsUpdate = true;
    this.lines.quaternion.copy(actor.mesh.quaternion);
  }

  dispose() {
    this.lines.removeFromParent();
    this.lines.geometry.dispose();
    this.lines.material.dispose();
  }
}
