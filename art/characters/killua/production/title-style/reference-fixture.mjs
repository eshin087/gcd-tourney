// Diagnostic approved-reference comparison, never a production atlas or idle.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { loadPacked } from '../../../../../tools/scale-audit.mjs';
import { readPng, newImage, blit, encodePng } from '../../../../../tools/pack-sprites.mjs';

const base = 'art/characters/killua/production/title-style';
const root = `${base}/qa-reference-art`;
const diagnostic = process.argv.includes('--diagnostic');
const output = `public/preview/killua-reference-${diagnostic ? 'diagnostic' : 'qa'}`;
const settings = JSON.parse(fs.readFileSync(`${base}/candidate-settings.json`));
const manifest = JSON.parse(fs.readFileSync('art/manifest.json'));
fs.mkdirSync(`${root}/characters/killua/raw`, { recursive: true });
fs.mkdirSync(`${root}/scale`, { recursive: true });
fs.copyFileSync(`${base}/combat_v01.png`, `${root}/characters/killua/raw/idle_v01.png`);
fs.copyFileSync('art/scale/builds.json', `${root}/scale/builds.json`);
const animations = { idle: { frames: 1, bodyHeight: 145, version: 1, approvedVersion: 1 } };
for (const [name, setting] of Object.entries(settings)) {
  const file = `${name}_v${String(setting.version).padStart(2, '0')}`;
  fs.copyFileSync(`art/characters/killua/raw/${file}.png`, `${root}/characters/killua/raw/${file}.png`);
  const sidecar = `art/characters/killua/raw/${file}.json`;
  if (fs.existsSync(sidecar)) fs.copyFileSync(sidecar, `${root}/characters/killua/raw/${file}.json`);
  animations[name] = { ...manifest.animationDefaults[name], ...setting, approvedVersion: null };
}
manifest.characters = { killua: { ...manifest.characters.killua, scaleGate: diagnostic ? 'warn' : 'strict', animations } };
manifest.animationDefaults.idle.frames = 1;
fs.writeFileSync(`${root}/manifest.json`, JSON.stringify(manifest, null, 2));
const run = spawnSync(process.execPath, ['tools/pack-sprites.mjs', 'killua', '--quantize', '48', '--no-writeback', '--root', root, '--out', output], { encoding: 'utf8' });
fs.writeFileSync(`${base}/reference-${diagnostic ? 'diagnostic' : 'strict'}-pack.txt`, run.stdout + run.stderr);
process.stdout.write(run.stdout + run.stderr);
if (run.status !== 0) process.exit(run.status || 1);
const packed = loadPacked('killua', path.resolve(output));
const names = Object.keys(settings);
const composite = newImage((2 + Math.max(...packed.anims.map(a => a.cells.length))) * 256, names.length * 256);
for (const [row, name] of names.entries()) {
  blit(composite, readPng(`${base}/neutral_v01.png`), 0, row * 256);
  blit(composite, readPng(`${base}/combat_v01.png`), 256, row * 256);
  packed.anims.find(a => a.name === name).cells.forEach((cell, column) => blit(composite, cell, (column + 2) * 256, row * 256));
  const cells = packed.anims.find(a => a.name === name).cells;
  const contact = newImage((cells.length + 2) * 256, 256);
  blit(contact, readPng(`${base}/neutral_v01.png`), 0, 0);
  blit(contact, readPng(`${base}/combat_v01.png`), 256, 0);
  cells.forEach((cell, column) => blit(contact, cell, (column + 2) * 256, 0));
  fs.writeFileSync(`${base}/contact-${name}.png`, encodePng(contact));
}
fs.writeFileSync(`${base}/all-reference-comparison.png`, encodePng(composite));
fs.writeFileSync(`${base}/reference-audit.json`, JSON.stringify(packed.meta.scaleAudit, null, 2));
