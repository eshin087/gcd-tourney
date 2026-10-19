// The announcer's manga symbols (ENG-119): a sweat drop, !!, ?, an anger vein, dizzy stars, a music note, a puff of
// steam and a sparkle, popping over his head. They carry most of his reactions without words to read (the user asked
// him to talk less). Painted here from small pixel maps in the shared ink outline, so they need no art files; one
// camera-facing sprite shows one at a time. View only, like the rest of him.
import * as THREE from 'three';

// half the NPC sheets' 80 pixels per world unit: drawn at his density they were a tenth of his height, unreadable
// at fight distance; at twice that size they read like manga marks next to his head
const PPU = 40;
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

// how each symbol behaves: how long it stays, whether it drips (the sweat drop slides down), sways (the note) or
// alternates frames (the stars), and which side of his head it sits on (sweat and steam behind, the rest in front)
const KINDS = {
  sweat: { secs: 1.4, drip: true, back: true },
  bang: { secs: 1.1 },
  what: { secs: 1.6 },
  anger: { secs: 1.4 },
  notes: { secs: 2.2, sway: true },
  steam: { secs: 2.4, back: true, rise: true },
  spark: { secs: 0.9 },
  dizzy: { secs: 1.8, frames: ['dizzy0', 'dizzy1'], over: true },
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
    this.sprite.center.set(0.5, 0);
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

  // head: his head's top in world space; right: the camera's right axis; face: +1 when he faces screen-right
  update(dt, head, right, face, frozen) {
    const c = this.cur;
    if (!c) return;
    if (!frozen) c.t += dt;
    if (c.t >= c.secs) { this.clear(); return; }
    const K = c.K, k = c.t / c.secs;
    this.cell(K.frames ? K.frames[Math.floor(c.t / 0.22) % K.frames.length] : c.kind);
    // beside his head (in front of his face, or behind it for sweat and steam), or right on top for the stars
    const side = K.over ? 0 : (K.back ? -face : face) * 0.3;
    let up = K.over ? -0.06 : 0.02;
    if (K.drip) up -= k * 0.12;
    if (K.rise) up += k * 0.1;
    const sway = K.sway ? Math.sin(c.t * 5) * 0.03 : 0;
    this.sprite.position.copy(head).addScaledVector(right, side + sway);
    this.sprite.position.y += up;
    // in and out with a short fade (no pop, no bounce)
    this.material.opacity = Math.min(1, c.t / 0.12, (c.secs - c.t) / 0.25);
    this.sprite.visible = true;
  }

  dispose() {
    this.tex.dispose();
    this.material.dispose();
  }
}
