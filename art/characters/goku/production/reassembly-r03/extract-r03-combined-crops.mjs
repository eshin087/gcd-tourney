import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { PNG } from 'pngjs';

const base = path.join(process.cwd(), 'art/characters/goku/production/reassembly-r03');
const pub = path.join(base, 'combined-fixture-public/characters/goku');
const sheetBytes = fs.readFileSync(path.join(pub, 'sheet.png'));
const sheet = PNG.sync.read(sheetBytes);
const metadataBytes = fs.readFileSync(path.join(pub, 'anims.json'));
const metadata = JSON.parse(metadataBytes);
const out = path.join(base, 'combined-fixture-crops');
if (fs.existsSync(out)) throw new Error('combined fixture crops exist; refusing overwrite');
fs.mkdirSync(out, { recursive: true });
const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const inventory = {
  label: 'Exact per-frame crops from the combined 48-color diagnostic atlas; images unchanged after pack; no approval implied.',
  atlasPath: 'production/reassembly-r03/combined-fixture-public/characters/goku/sheet.png',
  atlasSha256: hash(sheetBytes),
  metadataPath: 'production/reassembly-r03/combined-fixture-public/characters/goku/anims.json',
  metadataSha256: hash(metadataBytes),
  cell: [256, 256],
  columns: metadata.columns,
  animations: {}
};
for (const [name, animation] of Object.entries(metadata.animations)) {
  const dir = path.join(out, name);
  fs.mkdirSync(dir, { recursive: true });
  const frames = [];
  const contact = new PNG({ width: 256 * animation.frames.length, height: 256 });
  for (let f = 0; f < animation.frames.length; f++) {
    const index = animation.frames[f];
    const col = index % metadata.columns;
    const row = Math.floor(index / metadata.columns);
    const crop = new PNG({ width: 256, height: 256 });
    for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
      const si = ((row * 256 + y) * sheet.width + col * 256 + x) * 4;
      const di = (y * 256 + x) * 4;
      crop.data.set(sheet.data.subarray(si, si + 4), di);
      contact.data.set(sheet.data.subarray(si, si + 4), (y * contact.width + f * 256 + x) * 4);
    }
    const bytes = PNG.sync.write(crop);
    const filename = `f${String(f).padStart(2, '0')}.png`;
    fs.writeFileSync(path.join(dir, filename), bytes);
    frames.push({ frame: f, atlasIndex: index, durationMs: animation.durations[f], path: `${name}/${filename}`, sha256: hash(bytes) });
  }
  const contactBytes = PNG.sync.write(contact);
  const contactPath = `${name}-contact.png`;
  fs.writeFileSync(path.join(out, contactPath), contactBytes);
  inventory.animations[name] = {
    frames,
    loop: animation.loop,
    contactPath,
    contactSha256: hash(contactBytes)
  };
}
fs.writeFileSync(path.join(out, 'inventory.json'), JSON.stringify(inventory, null, 2) + '\n');
console.log(JSON.stringify({ atlasSha256: inventory.atlasSha256, metadataSha256: inventory.metadataSha256, animations: Object.keys(inventory.animations) }, null, 2));
