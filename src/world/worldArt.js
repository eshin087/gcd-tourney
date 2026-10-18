// Packed world art beyond the crowd (ADR 0008, ADR 0012): stage slot images, NPC sprite sheets and the shared
// title-screen art, all written by `npm run sprites stage|npc|ui` (approved art only; `?art=custom` prefers the
// local candidates in public/preview/). Everything here fails soft: missing art keeps the procedural version.
import * as THREE from 'three';
import { fetchAtlasJson, artUrl } from '../core/artIndex.js';
import { loadImage } from '../game/sprites.js';

// public/stage/manifest.json -> Map(slot -> image). A listed file that can't be read keeps the painter.
export async function loadStageArt() {
  try {
    const found = await fetchAtlasJson('/stage', 'manifest.json');
    if (!found?.data?.slots) return null;
    const { data, dir } = found;
    const out = new Map();
    await Promise.all(Object.entries(data.slots).map(async ([slot, s]) => {
      const img = await loadImage(artUrl(`${dir}/${s.file}`));
      if (img) out.set(slot, img);
      else console.warn(`[stage] ${slot}: ${dir}/${s.file} is missing or unreadable, keeping the painted ${slot}`);
    }));
    return out.size ? { slots: out, preview: dir !== '/stage' } : null;
  } catch (e) {
    console.warn('[stage] stage art failed, keeping the painted stage', e);
    return null;
  }
}

// public/ui/manifest.json -> { logo, title_art } image URLs (null when absent).
export async function loadUiArt() {
  try {
    const found = await fetchAtlasJson('/ui', 'manifest.json');
    const a = found?.data?.assets;
    if (!a) return null;
    // the plain path in production: the loading and rotate screens (index.html) already asked for these two files
    const url = (n) => (a[n] ? artUrl(`${found.dir}/${a[n].file}`) : null);
    const out = { logo: url('logo'), titleArt: url('title_art'), preview: found.dir !== '/ui' };
    // only report what actually loads (fail soft)
    await Promise.all(['logo', 'titleArt'].map(async (k) => {
      if (out[k] && !(await loadImage(out[k]))) { console.warn(`[ui] ${out[k]} is missing or unreadable, keeping the text title`); out[k] = null; }
    }));
    return out.logo || out.titleArt ? out : null;
  } catch (e) {
    console.warn('[ui] title art failed, keeping the text title', e);
    return null;
  }
}

// ------------------------------------------------------------------ NPCs
// Who stands where and what they do. Positions are world units (the ring spans -9..9, the camera looks from the
// gate side at +z); `mirror` flips an NPC on the right of the ring so it faces the fight. `replaces: 'announcer'`
// hides the painted announcer when the sheet loads.
export const NPCS = [
  { id: 'announcer', pos: [-11.8, 0, -14.4], mirror: false, replaces: 'announcer' },
  { id: 'monk-a', pos: [-10.3, 0, -10.3], mirror: false },
  { id: 'monk-b', pos: [10.3, 0, -10.3], mirror: true },
  { id: 'vendor', pos: [-12.0, 0, 0.3], mirror: false },
];

// Game events -> the animation each NPC plays, with a priority (higher wins over a running cue) and how long
// it plays before going back to idle (art/npc/README.md "Event triggers").
export const NPC_CUES = {
  intro: { announcer: ['point', 1, 2.2] },
  roundStart: { announcer: ['shout', 2, 1.4], 'monk-a': ['signal', 1, 1.4], 'monk-b': ['signal', 1, 1.4] },
  super: { announcer: ['shout', 2, 1.2] },
  ultimate: { announcer: ['cower', 3, 2.0] },
  clash: { announcer: ['cower', 3, 1.8] },
  ko: { announcer: ['point', 2, 2.4], 'monk-a': ['signal', 1, 2.0], 'monk-b': ['signal', 1, 2.0] },
  crash: { announcer: ['cower', 3, 1.4] },
  roundEnd: { announcer: ['point', 2, 2.4] },
};

// public/npc/<id>/{anims.json, sheet.png} for every NPC in the table -> Map(id -> { meta, image }).
export async function loadNpcArt() {
  const out = new Map();
  await Promise.all(NPCS.map(async ({ id }) => {
    try {
      const found = await fetchAtlasJson(`/npc/${id}`, 'anims.json');
      if (!found) return;
      const m = found.data;
      const okFrames = (a) => Array.isArray(a?.frames) && a.frames.length > 0 && a.frames.every(Number.isInteger);
      if (!okFrames(m?.animations?.idle) || !(m.frameWidth > 0 && m.frameHeight > 0) || !(Array.isArray(m.pivot) && m.pivot.length === 2)) {
        console.warn(`[npc] ${id}: anims.json is malformed (idle frames, frame size or pivot), not placed`);
        return;
      }
      for (const [name, a] of Object.entries(m.animations)) if (!okFrames(a)) delete m.animations[name]; // a cue falls back to idle
      const img = await loadImage(artUrl(`${found.dir}/sheet.png`));
      if (!img) { console.warn(`[npc] ${id}: anims.json found but sheet.png is missing or unreadable, not placed`); return; }
      out.set(id, { meta: found.data, image: img, preview: found.dir.startsWith('/preview') });
    } catch (e) {
      console.warn(`[npc] ${id}: sheet failed, not placed`, e);
    }
  }));
  return out;
}

// One NPC billboard: a camera-facing sprite showing one cell of its sheet. Loops cycle their frames; a one-shot
// (loop: false) plays its frames once and holds the last until the cue ends.
export class NpcSprite {
  constructor(def, art) {
    const m = art.meta;
    this.def = def;
    this.meta = m;
    this.cols = m.columns || 8;
    this.rows = Math.ceil(art.image.height / m.frameHeight);
    const tex = new THREE.Texture(art.image);
    tex.magFilter = tex.minFilter = THREE.NearestFilter;
    tex.generateMipmaps = false;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    tex.repeat.set((def.mirror ? -1 : 1) / this.cols, 1 / this.rows);
    this.tex = tex;
    this.material = new THREE.SpriteMaterial({ map: tex, alphaTest: 0.5, transparent: false });
    const sp = new THREE.Sprite(this.material);
    const ppu = m.pixelsPerUnit || 80;
    // pivot = the feet: the bottom edge of the pivot row sits on the ground
    sp.center.set(m.pivot[0] / m.frameWidth, (m.frameHeight - 1 - m.pivot[1]) / m.frameHeight);
    if (def.mirror) sp.center.x = 1 - sp.center.x;
    sp.scale.set(m.frameWidth / ppu, m.frameHeight / ppu, 1);
    sp.position.set(...def.pos);
    this.sprite = sp;
    this.anim = 'idle';
    this.t = 0;
    this.cue = null; // { anim, prio, left }
    this.setFrame(m.animations.idle.frames[0]);
  }

  setFrame(cell) {
    const c = cell % this.cols, r = Math.floor(cell / this.cols);
    this.tex.offset.set((c + (this.def.mirror ? 1 : 0)) / this.cols, 1 - (r + 1) / this.rows);
  }

  play(anim, prio, seconds) {
    if (!this.meta.animations[anim]) anim = 'idle'; // a missing animation falls back to idle
    if (this.cue && this.cue.prio > prio && this.cue.left > 0) return;
    this.cue = { prio, left: seconds };
    if (anim !== this.anim) { this.anim = anim; this.t = 0; }
  }

  update(dt) {
    if (this.cue) {
      this.cue.left -= dt;
      if (this.cue.left <= 0) { this.cue = null; this.anim = 'idle'; this.t = 0; }
    }
    const A = this.meta.animations[this.anim] || this.meta.animations.idle;
    this.t += dt * 1000;
    const durs = A.durations || A.frames.map(() => 500);
    const total = durs.reduce((s, d) => s + d, 0) || 1;
    let t = A.loop === false ? Math.min(this.t, total - 1) : this.t % total;
    let k = 0;
    while (k < durs.length - 1 && t >= durs[k]) { t -= durs[k]; k++; }
    this.setFrame(A.frames[k]);
  }

  dispose() {
    this.tex.dispose();
    this.material.dispose();
  }
}
