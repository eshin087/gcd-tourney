import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { PNG } from 'pngjs';

const base = path.join(process.cwd(), 'art/characters/goku/production/reassembly-r03');
const pub = path.join(base, 'fixture-public/characters/goku');
const sheet = PNG.sync.read(fs.readFileSync(path.join(pub, 'sheet.png')));
const meta = JSON.parse(fs.readFileSync(path.join(pub, 'anims.json'), 'utf8'));
const out = path.join(base, 'fixture-crops');
if (fs.existsSync(out)) throw new Error('r03 crops already exist; refusing overwrite');
fs.mkdirSync(out, { recursive: true });
const hash = (b) => crypto.createHash('sha256').update(b).digest('hex');
const inventory = { label: 'Exact crops from frozen 48-color quantized warn-only r03 fixture; no resizing or palette edits.', atlasPath: 'production/reassembly-r03/fixture-public/characters/goku/sheet.png', atlasSha256: hash(fs.readFileSync(path.join(pub, 'sheet.png'))), metadataSha256: hash(fs.readFileSync(path.join(pub, 'anims.json'))), animations: {} };
for (const name of ['dash', 'land']) {
  const a = meta.animations[name];
  const dir = path.join(out, name); fs.mkdirSync(dir, { recursive: true });
  const frames = [], contact = new PNG({ width: 256 * a.frames.length, height: 256 });
  for (let j = 0; j < a.frames.length; j++) {
    const index = a.frames[j], col = index % meta.columns, row = Math.floor(index / meta.columns);
    const crop = new PNG({ width: 256, height: 256 });
    for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
      const si = ((row * 256 + y) * sheet.width + (col * 256 + x)) * 4, di = (y * 256 + x) * 4;
      crop.data.set(sheet.data.subarray(si, si + 4), di); contact.data.set(sheet.data.subarray(si, si + 4), (y * contact.width + j * 256 + x) * 4);
    }
    const bytes = PNG.sync.write(crop), filename = `f${String(j).padStart(2, '0')}.png`;
    fs.writeFileSync(path.join(dir, filename), bytes);
    frames.push({ frame: j, atlasIndex: index, durationMs: a.durations[j], path: `fixture-crops/${name}/${filename}`, sha256: hash(bytes) });
  }
  const contactBytes = PNG.sync.write(contact), contactPath = `${name}-contact.png`;
  fs.writeFileSync(path.join(out, contactPath), contactBytes);
  inventory.animations[name] = { version: a.version, scale: a.scale, loop: a.loop, frames, contactPath: `fixture-crops/${contactPath}`, contactSha256: hash(contactBytes) };
}
fs.writeFileSync(path.join(out, 'inventory.json'), JSON.stringify(inventory, null, 2) + '\n');
console.log(JSON.stringify({ atlasSha256: inventory.atlasSha256, metadataSha256: inventory.metadataSha256, animations: inventory.animations }, null, 2));
