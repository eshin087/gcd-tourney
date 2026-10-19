// The announcer's manga symbols (ENG-119): a sweat drop, !!, ?, an anger vein, dizzy stars, a music note, a puff of
// steam and a sparkle, popping over his head. They carry most of his reactions without words to read (the user asked
// him to talk less). Painted here from small pixel maps in the shared ink outline, so they need no art files; one
// camera-facing sprite shows one at a time. View only, like the rest of him.
import * as THREE from 'three';

// one NPC pixel is 1/80 world unit; each symbol pixel is SCALE of them: at his own density the marks were a tenth of
// his height and unreadable at fight distance, at 1.5x they read like manga marks about half a head tall
const NPC_PX = 1 / 80;
const SCALE = 1.5;
const PPU = 1 / (NPC_PX * SCALE);
const CELL = 16;
const COLS = 4;
const PAL = {
  o: '#1d1420', w: '#ffffff', b: '#8fd3ff', B: '#4aa8e8', r: '#e8414f', y: '#ffe27a', g: '#cfccd8', G: '#9a97a8',
};
// '.' is empty; every map sits bottom-centred in its 16 x 16 cell
const STAR = ['..o..', '.oyo.', 'oyyyo', '.oyo.', '..o..'];
export const ICONS = {
  sweat: ['...oo...', '..obbo..', '..obbo..', '.obbbbo.', '.obwbbo.', 'obwbbbbo', 'obbbbbbo', 'obbbbbBo', '.oBbbBo.', '..oooo..'],
  bang: ['ooo..ooo', 'oyo..oyo', 'oyo..oyo', 'oyo..oyo', 'oyo..oyo', 'oyo..oyo', 'ooo..ooo', '........', 'ooo..ooo', 'oyo..oyo', 'ooo..ooo'],
  what: ['.oooooo.', 'owwwwwwo', 'owwoowwo', 'oooowwo.', '...owwo.', '..owwo..', '..owwo..', '..oooo..', '........', '..oooo..', '..owwo..', '..oooo..'],
  anger: ['.oo...oo.', 'orro.orro', '.orrorro.', '..orrro..', '.orrorro.', 'orro.orro', '.oo...oo.'],
  notes: ['....oooo..', '....owwwo.', '....owoowo', '....owo.oo', '....owo...', '....owo...', '.ooooow...', 'owwwwwo...', 'owwwwwo...', '.ooooo....'],
  steam: ['..ooo.....', '.oggGo.oo.', 'oggggGoggo', 'oggggggggo', '.oGgggGGo.', '..ooooo...'],
  spark: ['....o....', '...owo...', '...owo...', '.oowwwoo.', 'owwwwwwwo', '.oowwwoo.', '...owo...', '...owo...', '....o....'],
  // two frames of three stars circling his head
  dizzy0: stars([[0, 4], [6, 0], [11, 5]]),
  dizzy1: stars([[2, 0], [9, 2], [5, 6]]),
};
const ORDER = Object.keys(ICONS);

function stars(at) {
  const rows = Array.from({ length: 11 }, () => Array(16).fill('.'));
  for (const [x, y] of at) STAR.forEach((r, j) => [...r].forEach((ch, i) => { if (ch !== '.') rows[y + j][x + i] = ch; }));
  return rows.map((r) => r.join(''));
}

// How each symbol sits and moves, in his own pixels from his head's outline (see Announcer.headAnchors): `side` +1 in
// front of his face, -1 behind it, 0 centred on top; `gap` how far past the hair's edge its near edge sits (negative:
// overlapping the head a little, so it reads as attached, the way manga draws them); `top` where its top edge is
// relative to the top of his hair (positive: above it). Marks stay beside the head, below his caption, which sits
// just above it. `drip` slides down, `rise` drifts up, `sway` wobbles side to side, `frames` alternates cells.
const KINDS = {
  sweat: { secs: 1.4, side: -1, gap: -2, top: -3, drip: 5 },
  bang: { secs: 1.1, side: 1, gap: 0, top: 3 },
  what: { secs: 1.6, side: 1, gap: 0, top: 3 },
  anger: { secs: 1.4, side: 1, gap: -3, top: -1 },
  notes: { secs: 2.2, side: -1, gap: 1, top: 4, rise: 5, sway: 1.5 },
  steam: { secs: 2.4, side: -1, gap: -5, top: 1, rise: 6 },
  spark: { secs: 0.9, side: 1, gap: 0, top: 1 },
  dizzy: { secs: 1.8, side: 0, gap: 0, top: 7, frames: ['dizzy0', 'dizzy1'] },
};

function paintAtlas() {
  const rows = Math.ceil(ORDER.length / COLS);
  const cv = document.createElement('canvas');
  cv.width = COLS * CELL;
  cv.height = rows * CELL;
  const g = cv.getContext('2d');
  ORDER.forEach((name, n) => {
    const map = ICONS[name], h = map.length, w = map[0].length;
    const x0 = (n % COLS) * CELL + Math.floor((CELL - w) / 2), y0 = Math.floor(n / COLS) * CELL + CELL - h;
    map.forEach((r, j) => [...r].forEach((ch, i) => {
      if (ch === '.') return;
      g.fillStyle = PAL[ch];
      g.fillRect(x0 + i, y0 + j, 1, 1);
    }));
  });
  return cv;
}

export class AnnouncerSymbols {
  constructor() {
    const tex = new THREE.CanvasTexture(paintAtlas());
    tex.magFilter = tex.minFilter = THREE.NearestFilter;
    tex.generateMipmaps = false;
    tex.colorSpace = THREE.SRGBColorSpace;
    this.rows = Math.ceil(ORDER.length / COLS);
    tex.repeat.set(1 / COLS, 1 / this.rows);
    this.tex = tex;
    this.material = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, alphaTest: 0.05 });
    this.sprite = new THREE.Sprite(this.material);
    this.sprite.center.set(0.5, 0); // its bottom-centre is the mark's bottom-centre (the maps sit bottom-centred)
    this.sprite.scale.set(CELL / PPU, CELL / PPU, 1);
    this.sprite.visible = false;
    this.sprite.renderOrder = 2;
    this.cur = null; // { kind, t, secs }
  }

  // a symbol over his head for `secs` (its kind's default when omitted); a new one replaces the old
  show(kind, secs = null) {
    const K = KINDS[kind];
    if (!K) return;
    this.cur = { kind, K, t: 0, secs: secs ?? K.secs };
  }

  clear() {
    this.cur = null;
    this.sprite.visible = false;
  }

  cell(name) {
    const n = ORDER.indexOf(name);
    this.tex.offset.set((n % COLS) / COLS, 1 - (Math.floor(n / COLS) + 1) / this.rows);
  }

  // H = where his head is right now: { pos: the middle of the top of his hair in world space, right / up: the
  // camera's screen axes (his sprite is screen-aligned), hw: half the hair's width in world units, face: +1 when he
  // faces screen-right, toCam: a unit vector toward the camera (so nothing of his can cover the mark) }
  update(dt, H, frozen) {
    const c = this.cur;
    if (!c) return;
    if (!frozen) c.t += dt;
    if (c.t >= c.secs) { this.clear(); return; }
    const K = c.K, k = c.t / c.secs;
    const name = K.frames ? K.frames[Math.floor(c.t / 0.22) % K.frames.length] : c.kind;
    this.cell(name);
    const h = ICONS[name].length * SCALE * NPC_PX, w = ICONS[name][0].length * SCALE * NPC_PX;
    // horizontally: its near edge a `gap` past the hair's edge on its side (centred on top for side 0)
    const dir = K.side * H.face;
    const x = K.side === 0 ? 0 : dir * (H.hw + K.gap * NPC_PX + w / 2);
    // vertically: its top edge `top` above the hair top, drifting with its motion
    let y = K.top * NPC_PX - h;
    if (K.drip) y -= k * K.drip * NPC_PX;
    if (K.rise) y += k * K.rise * NPC_PX;
    const sway = K.sway ? Math.sin(c.t * 4) * K.sway * NPC_PX : 0;
    this.sprite.position.copy(H.pos).addScaledVector(H.right, x + sway).addScaledVector(H.up, y).addScaledVector(H.toCam, 0.12);
    // in and out with a short fade (no pop, no bounce)
    this.material.opacity = Math.min(1, c.t / 0.12, (c.secs - c.t) / 0.25);
    this.sprite.visible = true;
  }

  dispose() {
    this.tex.dispose();
    this.material.dispose();
  }
}
