import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
const base = 'art/characters/gojo/production/';
const stage = base + 'staging/';
const m = JSON.parse(fs.readFileSync('art/manifest.json'));
fs.mkdirSync(stage + 'characters/gojo/raw', { recursive: true });
fs.mkdirSync(stage + 'characters/gojo/ui', { recursive: true });
fs.writeFileSync(stage + 'manifest.json', JSON.stringify({ ...m, characters: { gojo: m.characters.gojo } }, null, 2));
for (const file of fs.readdirSync('art/characters/gojo/raw')) {
  if (/\.(png|json)$/.test(file)) fs.copyFileSync('art/characters/gojo/raw/' + file, stage + 'characters/gojo/raw/' + file);
}
fs.copyFileSync('art/characters/gojo/hitboxes.json', stage + 'characters/gojo/hitboxes.json');
for (const name of ['portrait', 'cutin', 'select']) {
  const files = fs.readdirSync('art/characters/gojo/raw').filter(f => new RegExp('^ui_' + name + '_v\\d+\\.png$').test(f)).sort();
  fs.copyFileSync('art/characters/gojo/raw/' + files.at(-1), stage + 'characters/gojo/ui/' + name + '.png');
}
// The packer requires fixed UI input names. Keep these temporary inputs under staging;
// canonical approval copies and approvedVersion remain untouched until bulk review.
const result = spawnSync(process.execPath, ['tools/pack-sprites.mjs', 'gojo', '--root', stage, '--out', 'public', '--quantize', '48', '--no-writeback', '--json', '--strict'], { encoding: 'utf8', windowsHide: true });
fs.writeFileSync(base + 'pack-report.json', result.stdout);
if (result.stderr) console.error(result.stderr);
const report = JSON.parse(result.stdout);
const r = report.characters[0];
console.log(JSON.stringify({ animations: r.packed.length, frames: r.frames, ui: r.ui, colors: r.colors, warnings: r.warnings, notes: r.notes }));
process.exitCode = result.status;
