import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';
import { auditCharacter, compactAudit } from '../../../../../tools/scale-probe.mjs';
const root = process.cwd();
const out = path.join(root, 'public/reviews/gojo-run-ghi');
const read = (f) => { const p = PNG.sync.read(fs.readFileSync(f)); return { w: p.width, h: p.height, data: p.data }; };
const ref = read(path.join(root, 'public/art-review/title-style-pilot/gojo-neutral_v01.png'));
const report = {};
for (const name of ['G', 'H', 'I']) {
  const cells = Array.from({ length: 8 }, (_, i) => read(path.join(out, `${name}_frames_v01/frame_${String(i).padStart(2, '0')}.png`)));
  const result = auditCharacter([{ name: 'idle', cells: [ref] }, { name: 'run', cells, version: 1 }], { maxColors: 48 });
  report[name] = result.error ? { error: result.error } : compactAudit(result);
  const sheet = new PNG({ width: 2304, height: 96 });
  [ref, ...cells].forEach((cell, k) => { for (let y = 0; y < 96; y++) for (let x = 0; x < 256; x++) {
    const src = (y * 256 + x) * 4, dst = (y * sheet.width + k * 256 + x) * 4;
    sheet.data.set(cell.data.subarray(src, src + 4), dst);
  } });
  fs.writeFileSync(path.join(out, `${name}_heads_v01.png`), PNG.sync.write(sheet));
}
fs.writeFileSync(path.join(out, 'head-audit_v01.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report));

