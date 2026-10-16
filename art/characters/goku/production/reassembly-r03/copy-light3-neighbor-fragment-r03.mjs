import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const goku = path.join(root, 'art/characters/goku');
const hold = path.join(goku, 'raw/_qa_hold');
const pngIn = path.join(hold, 'light3_v08.png');
const jsonIn = path.join(hold, 'light3_v08.json');
const pngOut = path.join(hold, 'light3_v09.png');
const jsonOut = path.join(hold, 'light3_v09.json');
if (!fs.existsSync(pngIn) || !fs.existsSync(jsonIn) || fs.existsSync(pngOut) || fs.existsSync(jsonOut)) throw new Error('missing v08 input or refusing overwrite light3_v09');
const bytes = fs.readFileSync(pngIn), side = JSON.parse(fs.readFileSync(jsonIn, 'utf8'));
const erase = [3 * 256 + 41, 23, 8, 30];
const next = {
  ...side,
  version: 9,
  erase: [erase],
  status: 'diagnostic technical hold; exact-pixel placement/extraction correction only; source drawing unchanged; combined-palette audit pending',
  extractionCorrection: {
    fromVersion: 8,
    sourcePngSha256: crypto.createHash('sha256').update(bytes).digest('hex'),
    frame: 3,
    stripRect: erase,
    evidence: 'Connected-component inspection of v08 frame 3 found a separate 206-pixel component with exact bbox local x=41..48,y=23..52 (strip x=809..816). Its rectangle contains only those 206 pixels and no pixels from the main figure. Astra directly identified it as the neighboring raised boot carried across the source panel seam. Remove only this verified fragment via packer sidecar erase; original source and v08 remain unchanged.'
  }
};
fs.writeFileSync(pngOut, bytes);
fs.writeFileSync(jsonOut, JSON.stringify(next, null, 2) + '\n');
console.log(JSON.stringify({ version: 9, sourcePngSha256: next.extractionCorrection.sourcePngSha256, outputPngSha256: next.extractionCorrection.sourcePngSha256, erase, removedComponents: 206 }, null, 2));
