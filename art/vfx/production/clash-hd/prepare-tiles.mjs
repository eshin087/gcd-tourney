import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';

const root = path.resolve('art/vfx');
const manifest = JSON.parse(fs.readFileSync(path.resolve('art/manifest.json'), 'utf8'));
const effects = {
  clashKnot: { frames: 8, palette: ['#FFFFFF', '#E6E6E6', '#C8C8C8', '#9A9A9A'], kind: 'centered-strip', fill: 0.95 },
  spearStream: { frames: 4, palette: ['#FFFFFF', '#E8F7FF', '#BFE8FF', '#7CC8FF', '#3E8CFF', '#2350D8', '#141E78'] },
  palmStream: { frames: 4, palette: ['#FFFFFF', '#EAFCFF', '#B4F0FF', '#62D8FF', '#3A9BF0', '#8C6BFF', '#5534D0', '#24125E'] },
  fireballStream: { frames: 4, palette: ['#2B080E', '#5A0D17', '#A00C22', '#C8281E', '#E0441B', '#F08C0A', '#FFC21A', '#FFE066', '#FFF6C0', '#FFFFFF'] },
  kamehamehaStream: { frames: 4, palette: ['#FFFFFF', '#E6FAFF', '#AEE8FF', '#6CCBFF', '#2E9BFF', '#1A62E0', '#123A9E'] },
  beastBeamStream: { frames: 4, palette: ['#1A0204', '#4A0606', '#7A0C0C', '#C8281E', '#FF4A2A', '#FFB08A', '#FFE8DC', '#3A8AFF', '#FFFFFF'] },
};

const rgb = (hex) => [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16));
const nearest = (r, g, b, colors) => {
  let best = colors[0], score = Infinity;
  for (const c of colors) {
    const d = (r - c[0]) ** 2 + (g - c[1]) ** 2 + (b - c[2]) ** 2;
    if (d < score) { score = d; best = c; }
  }
  return best;
};
const isMagenta = (r, g, b) => r > 190 && b > 180 && g < 90 && Math.abs(r - b) < 75;
const isWhite = (r, g, b) => r > 220 && g > 220 && b > 220;
const reports = [];

for (const [name, spec] of Object.entries(effects)) {
  const version = manifestVersion(name);
  const sourceFile = path.join(root, 'raw', `${name}_v${String(version).padStart(2, '0')}.png`);
  const src = PNG.sync.read(fs.readFileSync(sourceFile));
  if (src.width % spec.frames !== 0 && spec.kind !== 'centered-strip') throw new Error(`${name}: width ${src.width} is not evenly divisible by ${spec.frames}`);
  const slotW = src.width / spec.frames;
  const allowed = spec.palette.map(rgb);
  const outDir = path.join(root, 'frames', name);
  fs.mkdirSync(outDir, { recursive: true });
  let removedMagenta = 0, removedWhiteBars = 0;

  for (let frame = 0; frame < spec.frames; frame++) {
    let out = new PNG({ width: 256, height: 256 });
    if (spec.kind === 'centered-strip') {
      const x0 = Math.floor(frame * slotW), x1 = Math.floor((frame + 1) * slotW);
      let bx0 = x1, by0 = src.height, bx1 = x0 - 1, by1 = -1;
      for (let sy = 0; sy < src.height; sy++) for (let sx = x0; sx < x1; sx++) {
        const si = (sy * src.width + sx) * 4;
        const r = src.data[si], g = src.data[si + 1], b = src.data[si + 2], a = src.data[si + 3];
        if (!a || isMagenta(r, g, b)) { if (isMagenta(r, g, b)) removedMagenta++; continue; }
        bx0 = Math.min(bx0, sx); by0 = Math.min(by0, sy); bx1 = Math.max(bx1, sx); by1 = Math.max(by1, sy);
      }
      if (bx1 < bx0 || by1 < by0) throw new Error(`${name}: frame ${frame} is empty after key removal`);
      const bw = bx1 - bx0 + 1, bh = by1 - by0 + 1;
      const scale = Math.min(256 * spec.fill / bw, 256 * spec.fill / bh);
      const rw = Math.max(1, Math.round(bw * scale)), rh = Math.max(1, Math.round(bh * scale));
      const dx = Math.round((256 - rw) / 2), dy = Math.round((256 - rh) / 2);
      for (let y = 0; y < rh; y++) for (let x = 0; x < rw; x++) {
        const sx = bx0 + Math.min(bw - 1, Math.floor(x / scale));
        const sy = by0 + Math.min(bh - 1, Math.floor(y / scale));
        const si = (sy * src.width + sx) * 4;
        const di = ((dy + y) * 256 + dx + x) * 4;
        const [qr, qg, qb] = nearest(src.data[si], src.data[si + 1], src.data[si + 2], allowed);
        out.data[di] = qr; out.data[di + 1] = qg; out.data[di + 2] = qb; out.data[di + 3] = 255;
      }
    } else {
      if (src.height < slotW) throw new Error(`${name}: source height ${src.height} is shorter than one ${slotW}px frame`);
      const top = Math.floor((src.height - slotW) / 2);
      for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
        // Move each tile boundary to the middle of the generated panel. These are continuous streams,
        // so the beam core crosses both edges while the larger repeated flare stays inside the tile.
        const localX = Math.min(slotW - 1, Math.floor(x * slotW / 256));
        const sx = (Math.floor(slotW / 2) + frame * slotW + localX) % src.width;
        const sy = top + Math.min(slotW - 1, Math.floor(y * slotW / 256));
        const si = (sy * src.width + sx) * 4;
        const di = (y * 256 + x) * 4;
        const r = src.data[si], g = src.data[si + 1], b = src.data[si + 2], a = src.data[si + 3];
        const beastWhiteBar = name === 'beastBeamStream' && (sy < 192 || sy > 491) && isWhite(r, g, b);
        if (!a || isMagenta(r, g, b) || beastWhiteBar) {
          if (isMagenta(r, g, b)) removedMagenta++;
          if (beastWhiteBar) removedWhiteBars++;
          out.data[di] = 0; out.data[di + 1] = 0; out.data[di + 2] = 0; out.data[di + 3] = 0;
        } else {
          const [qr, qg, qb] = nearest(r, g, b, allowed);
          out.data[di] = qr; out.data[di + 1] = qg; out.data[di + 2] = qb; out.data[di + 3] = 255;
        }
      }
    }
    const file = path.join(outDir, `${name}_${String(frame).padStart(2, '0')}.png`);
    fs.writeFileSync(file, PNG.sync.write(out));
  }
  reports.push({ name, sourceVersion: version, source: `${src.width}x${src.height}`, frameSource: spec.kind === 'centered-strip' ? `${slotW}x${src.height}` : `${slotW}x${slotW}`, cropTop: spec.kind === 'centered-strip' ? 0 : Math.floor((src.height - slotW) / 2), cropOffsetX: spec.kind === 'centered-strip' ? 0 : Math.floor(slotW / 2), frames: spec.frames, output: '256x256', paletteLimit: allowed.length, removedMagentaPixels: removedMagenta, removedWhiteBarPixels: removedWhiteBars });
}

fs.writeFileSync(path.join(root, 'production', 'clash-hd', 'tile-prep-report.json'), `${JSON.stringify(reports, null, 2)}\n`);
console.log(JSON.stringify(reports, null, 2));

function manifestVersion(name) {
  const entry = manifest.vfx.effects[name];
  return entry.version || 1;
}
