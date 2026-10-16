import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';

const root = process.cwd();
const base = path.join(root, 'art/characters/goku/production/reassembly-r03');
const audit = path.join(root, 'art/characters/goku/production/manual-audit-r3');
const publicDir = path.join(root, 'public/characters/goku/calibration-r3');
const fixture = 'final5-fixture';
const cropsDir = path.join(base, `${fixture}-crops`);
const crops = JSON.parse(fs.readFileSync(path.join(cropsDir, 'inventory.json'), 'utf8'));
const meta = JSON.parse(fs.readFileSync(path.join(base, `${fixture}-public/characters/goku/anims.json`), 'utf8'));
const assets = path.join(publicDir, 'assets');
const framesRoot = path.join(assets, 'frames');
const contactsRoot = path.join(assets, 'contacts');
fs.mkdirSync(framesRoot, { recursive: true });
fs.mkdirSync(contactsRoot, { recursive: true });
for (const [name, animation] of Object.entries(crops.animations)) {
  const destFrames = path.join(framesRoot, name);
  fs.mkdirSync(destFrames, { recursive: true });
  for (const f of animation.frames) fs.copyFileSync(path.join(cropsDir, f.path), path.join(destFrames, path.basename(f.path)));
  const idlePath = path.join(cropsDir, 'idle', 'f00.png');
  const cells = [PNG.sync.read(fs.readFileSync(idlePath)), ...animation.frames.map((f) => PNG.sync.read(fs.readFileSync(path.join(cropsDir, f.path))))];
  const contact = new PNG({ width: cells.length * 256, height: 256 });
  cells.forEach((cell, i) => contact.data.set(cell.data, i * 256 * 4));
  fs.writeFileSync(path.join(contactsRoot, `${name}-one-density.png`), PNG.sync.write(contact));
}
const refs = path.join(assets, 'references');
fs.mkdirSync(refs, { recursive: true });
const sourceRef = path.join(publicDir, 'assets/references/approved-reference-lineup.png');
if (!fs.existsSync(sourceRef)) throw new Error(`approved reference lineup is missing: ${sourceRef}`);
const heldDir = path.join(assets, 'held');
fs.mkdirSync(heldDir, { recursive: true });
const heldCopies = [
  ['raw/_qa_hold/light3_v09.png', 'light3_v09.png'],
  ['raw/_qa_hold/heavy_v11.png', 'heavy_v11.png'],
  ['manual-audit-r3/light3-capacity-source.png', 'light3-capacity-source.png'],
  ['manual-audit-r3/heavy-capacity-source.png', 'heavy-capacity-source.png'],
  ['manual-audit-r3/light3-recovery-source-panel.png', 'light3-recovery-source-panel.png'],
  ['manual-audit-r3/heavy-source-panel.png', 'heavy-source-panel.png']
];
for (const [from, to] of heldCopies) {
  const source = from.startsWith('raw/') ? path.resolve(root, 'art/characters/goku', from) : path.resolve(root, 'art/characters/goku/production', from);
  if (!fs.existsSync(source)) throw new Error(`missing held evidence: ${source}`);
  fs.copyFileSync(source, path.join(heldDir, to));
}
const reports = path.join(publicDir, 'reports');
fs.mkdirSync(reports, { recursive: true });
const copies = [
  [`${fixture}-pack-report.json`, 'pack-report.json'],
  ['final5-fixture-inventory.json', 'fixture-inventory.json'],
  [`${fixture}-crops/inventory.json`, 'crop-inventory.json'],
  [`${fixture}-public/characters/goku/sheet.png`, 'final5-sheet.png'],
  [`${fixture}-public/characters/goku/anims.json`, 'final5-anims.json'],
  ['final4-final5-mask-comparison.json', 'final4-final5-mask-comparison.json'],
  ['final5-fixture-strict-attempt.json', 'strict-pack-attempt.json'],
  ['production-pack-report.json', 'production-pack-report.json'],
  ['production-selection-snapshot.json', 'production-selection-snapshot.json'],
  ['FINAL_HANDOFF_R03.md', 'FINAL_HANDOFF_R03.md'],
  ['WORKFLOW.md', 'WORKFLOW.md'],
  ['R03_REVIEW_ROWS.md', 'R03_REVIEW_ROWS.md']
];
for (const [from, to] of copies) fs.copyFileSync(path.join(base, from), path.join(reports, to));
for (const name of ['FINAL4_AUDIT.md', 'FINAL5_STRICT_AUDIT.md', 'FINAL5_PIXEL_VERIFICATION.json', 'SOURCE_REPAIR_NOTES.md']) {
  fs.copyFileSync(path.join(audit, name), path.join(reports, name));
}
console.log(JSON.stringify({ animations: Object.keys(meta.animations).length, frames: Object.values(meta.animations).reduce((n, a) => n + a.frames.length, 0), contacts: Object.keys(meta.animations).length, heldEvidence: heldCopies.length }, null, 2));
