// Diagnostic-only native atlas contact sheet. The QA manifest allows inspection
// of held candidates; it does not alter production scale verdicts or sources.
import fs from 'node:fs';
import path from 'node:path';
import { loadPacked } from '../../../../../tools/scale-audit.mjs';
import { newImage, blit, encodePng } from '../../../../../tools/pack-sprites.mjs';

const root = 'art/characters/gojo/production/title-style';
const packed = loadPacked('gojo', path.resolve(root, 'qa-public'));
const names = process.argv.slice(2);
if (!names.length) throw new Error('usage: node native-contact.mjs <anim> [anim...]');
const rows = names.map(name => {
  const anim = packed.anims.find(a => a.name === name);
  if (!anim) throw new Error(`missing ${name}`);
  return anim;
});
const columns = Math.max(...rows.map(a => a.cells.length));
const out = newImage(columns * 256, rows.length * 256);
rows.forEach((a, y) => a.cells.forEach((cell, x) => blit(out, cell, x * 256, y * 256)));
const file = path.join(root, `native-${names.join('-')}.png`);
fs.writeFileSync(file, encodePng(out));
console.log(`${file}: ${rows.map(a => `${a.name}:${a.cells.length}`).join(', ')}`);
