// Shadow clones on screen (ENG-SKL-NAR): extra copies of a fighter's own sprite. The simulation never touches them:
// a kit move writes plain entries into its kitState (`crew`: position, facing, animation and progress through it),
// so they are saved and rolled back with the rest of the state (ADR 0036), and Fighter.sync draws them here once
// per rendered frame. The actors are made on first use, share the fighter's sheet, and hide when the move ends.
import { SpriteActor } from './sprites.js';

// A crew entry, for kit.js. anim: any animation name (missing ones resolve through FALLBACK); pr: 0..1 through it.
export function crewMember(x, y, z, fx, fz, anim = 'idle', pr = 0) {
  return { x, y, z, fx, fz, anim, pr, vis: true };
}

export class CloneCrew {
  constructor(asset, scene) {
    this.asset = asset;
    this.scene = scene;
    this.actors = [];
  }

  // crew: the kitState's entries (or null); the rest mirrors Fighter.sync's call into the body actor
  sync(crew, camera, camRight, refDepth, time) {
    const n = crew?.length ?? 0;
    for (let i = 0; i < n; i++) {
      const c = crew[i];
      const a = (this.actors[i] ??= new SpriteActor(this.asset, this.scene));
      if (!c.vis) { a.setVisible(false); continue; }
      a.setVisible(true);
      if (a.animName !== c.anim) a.play(c.anim);
      const fr = a.anim.frames;
      a.fi = Math.min(fr.length - 1, Math.max(0, Math.floor(c.pr * fr.length)));
      a.setFrame(fr[a.fi]);
      a.place(c.x, c.y, c.z);
      a.sync(camera, c.fx, c.fz, camRight, refDepth, time);
    }
    for (let i = n; i < this.actors.length; i++) this.actors[i].setVisible(false);
  }

  hide() {
    for (const a of this.actors) a.setVisible(false);
  }

  dispose() {
    for (const a of this.actors) a.dispose();
    this.actors.length = 0;
  }
}
