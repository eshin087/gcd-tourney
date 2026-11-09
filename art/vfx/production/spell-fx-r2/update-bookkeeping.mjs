import fs from 'node:fs';

const base = process.cwd();
const manifestPath = base + '/art/manifest.json';
const reviewPath = base + '/art/REVIEW.md';
const trackerPath = base + '/art/TRACKER.md';
const eol = '\r\n';

function parseLine(lines, name) {
  const i = lines.findIndex((line) => new RegExp('^\\s*"' + name + '"\\s*:').test(line));
  if (i < 0) throw new Error('Missing manifest row: ' + name);
  const match = lines[i].match(/^(\s*)"[^\"]+"\s*:\s*(\{.*\})(,?)\s*$/);
  if (!match) throw new Error('Manifest row not in one-line form: ' + name);
  return { i, indent: match[1], value: JSON.parse(match[2]), comma: match[3] };
}
let manifest = fs.readFileSync(manifestPath, 'utf8');
const manifestEol = manifest.includes('\r\n') ? '\r\n' : '\n';
const lines = manifest.split(/\r?\n/);
for (const name of ['gigantArm', 'gigantFist']) {
  const row = parseLine(lines, name);
  row.value.version = 2;
  row.value.status = 'approved';
  row.value.approvedVersion = 1;
  row.value.reviewStatus = 'needs review';
  lines[row.i] = row.indent + JSON.stringify(name) + ': ' + JSON.stringify(row.value) + row.comma;
}
const tileNames = ['voidShatterTL', 'voidShatterTR', 'voidShatterBL', 'voidShatterBR'];
const tileRows = tileNames.map((name) => '      ' + JSON.stringify(name) + ': ' + JSON.stringify({
  frames: 8, ms: 50, colorRule: 'fullColor', anchor: 'center', step: 10,
  status: 'raw', version: 1, approvedVersion: null, hd: true, fill: 1.0, tile: false,
  reviewStatus: 'needs review', owner: 'gojo'
}) + ',');
const namesPresent = tileNames.filter((name) => lines.some((line) => new RegExp('^\\s*"' + name + '"\\s*:').test(line)));
if (namesPresent.length) throw new Error('Refusing duplicate tile rows: ' + namesPresent.join(', '));
const voidIndex = lines.findIndex((line) => /^\s*"voidShatter"\s*:/.test(line));
if (voidIndex < 0) throw new Error('Missing voidShatter manifest row');
lines.splice(voidIndex + 1, 0, ...tileRows);
fs.writeFileSync(manifestPath, lines.join(manifestEol));

const review = fs.readFileSync(reviewPath, 'utf8');
if (review.includes('## Spell effects round 2 (ART-SPELL-R2)')) throw new Error('R2 review section already exists');
const section = [
  '',
  '## Spell effects round 2 (ART-SPELL-R2)',
  '',
  'The model decision from Claude relay spells #6 waived the GPT-6 Luna rule for this generation round only (“Current model (Recommended)”); this is not image approval. All six candidates below need the user’s review. The [review gallery](../public/reviews/spell-fx-r2/index.html) compares the packed v02 arm/fist with approved v01 and assembles the four Gojo tiles beside v01. The [call inventory](vfx/production/spell-fx-r2/CALLS.md) preserves source paths, hashes and budgets.',
  '',
  '| date | character | asset | file | version | status | what changed | QA notes |',
  '|---|---|---|---|---|---|---|---|',
  '| 2026-11-08 | Luffy | gigantArm | [raw](vfx/raw/gigantArm_v02.png) · [review](../public/reviews/spell-fx-r2/index.html#gigantArm) · [calls](vfx/production/spell-fx-r2/CALLS.md) | v02 | needs review | Inflated cylindrical arm, 170px thick with a repeated row profile | 2 frames; 10-color hard palette; v01 remains approved. Candidate pack and atlas comparison recorded in gallery; not yet approved. |',
  '| 2026-11-08 | Luffy | gigantFist | [raw](vfx/raw/gigantFist_v02.png) · [review](../public/reviews/spell-fx-r2/index.html#gigantFist) · [calls](vfx/production/spell-fx-r2/CALLS.md) | v02 | needs review | Fist retained with an arm-matched 170px wrist stub | 4 frames; 15 colors; v01 remains approved. Candidate pack and atlas comparison recorded in gallery; not yet approved. |',
  '| 2026-11-08 | Gojo | voidShatterTL | [raw](vfx/raw/voidShatterTL_v01.png) · [f00](vfx/frames/voidShatterTL/voidShatterTL_00.png) · [review](../public/reviews/spell-fx-r2/index.html#voidShatterTL) | v01 | needs review | Top-left quadrant of the doubled-resolution Domain exit | 8 exact 256x256 frames; HD candidate; approval pending. |',
  '| 2026-11-08 | Gojo | voidShatterTR | [raw](vfx/raw/voidShatterTR_v01.png) · [f00](vfx/frames/voidShatterTR/voidShatterTR_00.png) · [review](../public/reviews/spell-fx-r2/index.html#voidShatterTR) | v01 | needs review | Top-right quadrant of the doubled-resolution Domain exit | 8 exact 256x256 frames; HD candidate; approval pending. |',
  '| 2026-11-08 | Gojo | voidShatterBL | [raw](vfx/raw/voidShatterBL_v01.png) · [f00](vfx/frames/voidShatterBL/voidShatterBL_00.png) · [review](../public/reviews/spell-fx-r2/index.html#voidShatterBL) | v01 | needs review | Bottom-left quadrant of the doubled-resolution Domain exit | 8 exact 256x256 frames; HD candidate; approval pending. |',
  '| 2026-11-08 | Gojo | voidShatterBR | [raw](vfx/raw/voidShatterBR_v01.png) · [f00](vfx/frames/voidShatterBR/voidShatterBR_00.png) · [review](../public/reviews/spell-fx-r2/index.html#voidShatterBR) | v01 | needs review | Bottom-right quadrant of the doubled-resolution Domain exit | 8 exact 256x256 frames; HD candidate; approval pending. |',
  ''
].join('\n');
fs.writeFileSync(reviewPath, '# Art review queue\n' + section + review.slice('# Art review queue\n'.length));

let tracker = fs.readFileSync(trackerPath, 'utf8');
const trackerEol = tracker.includes('\r\n') ? '\r\n' : '\n';
const tLines = tracker.split(/\r?\n/);
for (const name of ['gigantArm', 'gigantFist']) {
  const i = tLines.findIndex((line) => line.startsWith('| ' + name + ' |'));
  if (i < 0) throw new Error('Missing tracker row: ' + name);
  const cols = tLines[i].split('|');
  cols[6] = ' approved ';
  cols[7] = ' v02 ';
  cols[8] = ' v01 ';
  cols[9] = name === 'gigantArm'
    ? ' ART-SPELL-R2 v02 is a 170px inflated tube candidate; v01 remains approved. Candidate pack recorded in the R2 gallery; awaiting user review. '
    : ' ART-SPELL-R2 v02 retains the fist and adds the exact 170px arm-matched wrist stub; v01 remains approved. Candidate pack recorded in the R2 gallery; awaiting user review. ';
  tLines[i] = cols.join('|');
}
const trackerVoid = tLines.findIndex((line) => line.startsWith('| voidShatter |'));
if (trackerVoid < 0) throw new Error('Missing tracker row: voidShatter');
const newTrackerRows = tileNames.map((name) =>
  '| ' + name + ' | 8 | 50 | full color | center | raw | v01 | — | ART-SPELL-R2; Gojo HD exit tile candidate, 8 exact 256px frames; awaiting user review. |'
);
tLines.splice(trackerVoid + 1, 0, ...newTrackerRows);
fs.writeFileSync(trackerPath, tLines.join(trackerEol));
console.log('Updated only gigantArm/gigantFist and four new tile records in manifest, review, and tracker.');
