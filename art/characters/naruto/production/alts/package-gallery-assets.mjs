import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

const dest = 'public/reviews/naruto-alts';
const assets = dest + '/assets';
if (fs.existsSync(dest)) throw new Error(`Refusing to overwrite existing gallery: ${dest}`);
const copy = (src, out) => {
  if (!fs.existsSync(src)) throw new Error(`Missing gallery source: ${src}`);
  const to = assets + '/' + out;
  fs.mkdirSync(path.dirname(to), { recursive: true });
  if (fs.existsSync(to)) throw new Error(`Refusing to overwrite gallery asset: ${to}`);
  fs.copyFileSync(src, to);
  return { file: 'assets/' + out.replaceAll('\\', '/'), sha256: createHash('sha256').update(fs.readFileSync(src)).digest('hex') };
};

const files = {};
files.pairedAtlas = copy('art/characters/naruto/production/alts/frozen/naruto-alt-base-paired-native.png', 'naruto-alt-base-paired-native.png');
files.auditManifest = copy('art/characters/naruto/production/alts/frozen/audit-manifest.json', 'audit-manifest.json');
files.contactDeltas = copy('art/characters/naruto/production/alts/frozen/approved-contact-deltas.json', 'approved-contact-deltas.json');
files.productionAnims = copy('public/characters/naruto/anims.json', 'approved-production-anims.json');
files.productionSheet = copy('public/characters/naruto/sheet.png', 'approved-production-sheet.png');
files.anatomyTable = copy('art/characters/naruto/production/alts/astra-audit/ANATOMY-TABLE.md', 'ANATOMY-TABLE.md');
files.anatomyMeasurements = copy('art/characters/naruto/production/alts/astra-audit/anatomy-measurements.json', 'anatomy-measurements.json');
files.astraReport = copy('art/characters/naruto/production/alts/astra-audit/REPORT.md', 'REPORT.md');
files.verdicts = copy('art/characters/naruto/production/alts/astra-audit/verdicts.json', 'verdicts.json');
files.neutral = copy('public/art-review/title-style-pilot/naruto-neutral_v01.png', 'references/naruto-neutral_v01.png');
files.combat = copy('public/art-review/title-style-pilot/naruto-combat_v01.png', 'references/naruto-combat_v01.png');
files.packLog = copy('art/characters/naruto/production/alts/frozen/pack-log.txt', 'qa/pack-log.txt');
const list = { disclaimer: 'Review-only preview. This fixed allowlist includes the selected quantized base/alt comparison, approved production references, and compact QA metadata. Generated attempts, raw parts, prompt files, and private call history remain in art/ and are not copied into the preview.', files };
fs.writeFileSync(dest + '/assets.json', JSON.stringify(list, null, 2));
console.log(JSON.stringify({ directory: dest, copied: Object.keys(files).length, bytes: Object.values(files).reduce((sum, item) => sum + fs.statSync(dest + '/' + item.file).size, 0) }, null, 2));
