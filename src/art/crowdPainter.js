// Spectator sprites (front-facing chibi townsfolk), two frames each: idle + cheer.
import { PixelCanvas, makeMat, pack, hex, rng } from './pixel.js';

export const CROWD_W = 24;
export const CROWD_H = 32;

const SKINS = ['#f9d0a8', '#f2c08e', '#e0a878', '#c58a5e', '#fbe0c8'];
const HAIRS = ['#2a2a3a', '#4a3424', '#f2d060', '#e8e8f0', '#3a5ab0', '#8a3a2a', '#6a6a7a', '#2c4a8a', '#c86a3a'];
const SHIRTS = ['#3f8f5a', '#3a62b0', '#e8e4dc', '#d8b040', '#c84a4a', '#6a4aa0', '#4aa0b0', '#2e3e6a', '#e07a2a', '#8ab04a'];
const HATS = ['#f0c63a', '#3a6ad0', '#e8e8e8', '#d04040'];
const STYLES = ['spiky', 'bowl', 'long', 'cap', 'bun', 'bald', 'bowl', 'spiky', 'cap'];

function paintPerson(R, cheer, variant) {
  const pc = new PixelCanvas(CROWD_W, CROWD_H);
  const skin = makeMat(variant.skin);
  const hair = makeMat(variant.hair);
  const shirt = makeMat(variant.shirt);
  const hat = makeMat(variant.hat);
  const cx = 12;
  const bob = cheer ? -1 : 0;
  const hy = 11 + bob;
  // arms behind body when cheering
  const arm = (side) => {
    const s = side < 0 ? [cx - 4, 20 + bob] : [cx + 4, 20 + bob];
    const e = cheer ? [cx + side * 8, 9 + bob] : [cx + side * 5.6, 28];
    const p = pc.newPart(shirt, 'arm' + side);
    pc.capsule(s[0], s[1], e[0], e[1], 1.6, 1.4, p);
    const h = pc.newPart(skin, 'hand' + side);
    pc.disc(e[0], e[1] + (cheer ? -0.5 : 0.5), 1.7, h);
  };
  if (cheer) { arm(-1); arm(1); }
  const body = pc.newPart(shirt, 'body', { shadeDepth: 2 });
  pc.capsule(cx, 21 + bob, cx, 31, 4.8, 5.4, body);
  if (!cheer) { arm(-1); arm(1); }
  if (variant.style === 'long') {
    const back = pc.newPart(hair, 'hairback');
    pc.capsule(cx, hy, cx, hy + 9, 6.2, 5.2, back);
  }
  const head = pc.newPart(skin, 'head');
  pc.ellipse(cx, hy, 5.4, 5.0, head);
  const H = pc.newPart(variant.style === 'cap' ? hat : hair, 'hair', { shadeDepth: 1 });
  const st = variant.style;
  if (st === 'spiky') {
    pc.ellipse(cx, hy - 2.2, 5.8, 3.6, H);
    for (let i = -2; i <= 2; i++) pc.poly([[cx + i * 2.4 - 1.6, hy - 4], [cx + i * 2.8, hy - 8.5 - (i === 0 ? 1 : 0)], [cx + i * 2.4 + 1.6, hy - 4]], H);
  } else if (st === 'bowl' || st === 'long') {
    pc.ellipse(cx, hy - 1.8, 6.0, 4.4, H, 0, (x, y) => y < hy - 0.5 || Math.abs(x - cx) > 4.2);
  } else if (st === 'cap') {
    pc.ellipse(cx, hy - 2.6, 5.8, 3.6, H, 0, (x, y) => y < hy - 1.5);
    pc.rect(cx - 6, Math.floor(hy - 2), 12, 1, H);
  } else if (st === 'bun') {
    pc.ellipse(cx, hy - 2, 5.8, 3.8, H, 0, (x, y) => y < hy - 0.8);
    pc.disc(cx, hy - 6.5, 2.4, H);
  } else if (st === 'bald') {
    pc.ellipse(cx, hy - 3.6, 4.0, 1.6, H, 0, (x, y) => R() < 2);
  }
  pc.finalize();
  const eye = pack(hex('#1e1a28'));
  if (cheer && R() < 0.5) {
    pc.pset(cx - 2, hy + 1, eye); pc.pset(cx - 3, hy + 1, eye);
    pc.pset(cx + 2, hy + 1, eye); pc.pset(cx + 1, hy + 1, eye);
  } else {
    pc.pset(cx - 2, hy, eye); pc.pset(cx - 2, hy + 1, eye);
    pc.pset(cx + 2, hy, eye); pc.pset(cx + 2, hy + 1, eye);
  }
  if (cheer) { pc.pset(cx, hy + 3, pack(hex('#7a2a2a'))); pc.pset(cx - 1, hy + 3, pack(hex('#7a2a2a'))); }
  pc.outline(pack([30, 24, 40]));
  return pc;
}

// Returns { canvas, variants } where frame (v, cheer) sits at x = v*W, y = cheer*H.
export function bakeCrowd(count = 24, seed = 5) {
  const R = rng(seed);
  const pick = (a) => a[Math.floor(R() * a.length)];
  const canvas = document.createElement('canvas');
  canvas.width = count * CROWD_W;
  canvas.height = CROWD_H * 2;
  const ctx = canvas.getContext('2d');
  for (let v = 0; v < count; v++) {
    const variant = { skin: pick(SKINS), hair: pick(HAIRS), shirt: pick(SHIRTS), hat: pick(HATS), style: pick(STYLES) };
    for (let cheer = 0; cheer < 2; cheer++) {
      const pc = paintPerson(rng(seed * 100 + v), !!cheer, variant);
      pc.drawTo(ctx, v * CROWD_W, cheer * CROWD_H);
    }
  }
  return { canvas, count };
}

// Announcer / referee (purple hair, sunglasses, suit) standing beside the ring.
export function bakeAnnouncer() {
  const pc = new PixelCanvas(32, 48);
  const skin = makeMat('#f6cda8');
  const suit = makeMat('#e8e4ec');
  const pants = makeMat('#3a3650');
  const hair = makeMat('#7a4ab0', { hi: '#a87ae0' });
  const tie = makeMat('#d03a4a');
  const cx = 16;
  const lb = pc.newPart(pants, 'legB'); pc.capsule(cx - 2, 33, cx - 2.5, 45, 2.2, 2, lb);
  const lf = pc.newPart(pants, 'legF'); pc.capsule(cx + 2, 33, cx + 2.5, 45, 2.2, 2, lf);
  const body = pc.newPart(suit, 'body', { shadeDepth: 2 });
  pc.capsule(cx, 23, cx, 33, 5, 4.6, body);
  const t = pc.newPart(tie, 'tie'); pc.rect(cx, 21, 1, 7, t);
  const armL = pc.newPart(suit, 'armL'); pc.capsule(cx - 5, 22, cx - 6, 31, 1.7, 1.6, armL);
  const armR = pc.newPart(suit, 'armR'); pc.capsule(cx + 5, 22, cx + 8, 26, 1.7, 1.6, armR);
  const hand = pc.newPart(skin, 'hand'); pc.disc(cx + 8.5, 25, 1.7, hand); pc.disc(cx - 6, 32, 1.6, hand);
  const head = pc.newPart(skin, 'head'); pc.ellipse(cx, 14, 5.4, 5.2, head);
  const H = pc.newPart(hair, 'hair', { shadeDepth: 1 });
  pc.ellipse(cx, 11, 6.2, 4.6, H, 0, (x, y) => y < 12.5 || Math.abs(x - cx) > 4.4);
  pc.capsule(cx - 5, 12, cx - 5.5, 19, 1.6, 1.2, H);
  pc.capsule(cx + 5, 12, cx + 5.5, 19, 1.6, 1.2, H);
  pc.poly([[cx - 3, 6], [cx + 1, 3], [cx + 2, 7]], H);
  pc.finalize();
  const g = pack(hex('#1a1a24'));
  for (let x = cx - 4; x <= cx + 4; x++) pc.pset(x, 14, g);
  pc.pset(cx - 3, 15, g); pc.pset(cx - 2, 15, g); pc.pset(cx + 2, 15, g); pc.pset(cx + 3, 15, g);
  pc.pset(cx - 1, 18, pack(hex('#9a5040'))); pc.pset(cx, 18, pack(hex('#9a5040')));
  // microphone
  pc.pset(cx + 9, 23, pack(hex('#222222'))); pc.pset(cx + 9, 22, pack(hex('#555555')));
  pc.outline(pack([30, 24, 40]));
  const c = document.createElement('canvas');
  c.width = 32; c.height = 48;
  pc.drawTo(c.getContext('2d'), 0, 0);
  return c;
}
