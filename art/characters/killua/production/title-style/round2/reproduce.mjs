import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { loadPacked } from '../../../../../../tools/scale-audit.mjs';
import { bbox, encodePng, newImage, blit, readPng } from '../../../../../../tools/pack-sprites.mjs';

const root = process.cwd();
const dir = path.join(root, 'art/characters/killua/production/title-style/round2');
const fixture = path.join(dir, 'fixture');
const out = path.join(root, 'public/reviews/killua-round2');
const versions = { idle: 8, run: 9, charge: 13, stagger: 5, taunt: 5, beamFire: 9 };
fs.mkdirSync(dir, { recursive: true });
fs.mkdirSync(path.join(fixture, 'characters/killua/raw'), { recursive: true });
fs.mkdirSync(path.join(fixture, 'characters/killua/reference'), { recursive: true });
fs.mkdirSync(path.join(fixture, 'scale'), { recursive: true });
const original = JSON.parse(fs.readFileSync('art/manifest.json'));
const m = structuredClone(original);
m.characters = { killua: structuredClone(original.characters.killua) };
m.characters.killua.animations = Object.fromEntries(Object.keys(versions).map(a => [a, structuredClone(original.characters.killua.animations[a])]));
delete m.characters.killua.ui;
delete m.characters.killua.reference;
for (const [a, v] of Object.entries(versions)) {
  m.characters.killua.animations[a].version = v;
  for (const ext of ['png', 'json']) {
    const src = `art/characters/killua/raw/${a}_v${String(v).padStart(2, '0')}.${ext}`;
    if (fs.existsSync(src)) fs.copyFileSync(src, path.join(fixture, `characters/killua/raw/${path.basename(src)}`));
  }
}
fs.writeFileSync(path.join(fixture, 'manifest.json'), JSON.stringify(m, null, 2));
fs.copyFileSync('art/scale/builds.json', path.join(fixture, 'scale/builds.json'));
fs.copyFileSync('art/characters/killua/reference/title_style_combat_cell_v01.png', path.join(fixture, 'characters/killua/reference/title_style_combat_cell_v01.png'));
const full = spawnSync(process.execPath, ['tools/pack-sprites.mjs', 'killua', '--quantize', '48', '--strict-scale'], { encoding: 'utf8' });
fs.writeFileSync(path.join(dir, 'full-strict-pack.txt'), `exit ${full.status}\n${full.stdout}\n${full.stderr}`);
const args = ['tools/pack-sprites.mjs', 'killua', '--root', fixture, '--out', out, '--quantize', '48', '--no-writeback'];
const strict = spawnSync(process.execPath, [...args, '--strict-scale'], { encoding: 'utf8' });
fs.writeFileSync(path.join(dir, 'isolated-strict-pack.txt'), `exit ${strict.status}\n${strict.stdout}\n${strict.stderr}`);
if (strict.status) {
  // Diagnostic only: unchanged thresholds and reference, warn allows inspection of failed cells.
  m.characters.killua.scaleGate = 'warn';
  fs.writeFileSync(path.join(fixture, 'manifest.json'), JSON.stringify(m, null, 2));
  const warn = spawnSync(process.execPath, args, { encoding: 'utf8' });
  fs.writeFileSync(path.join(dir, 'diagnostic-warn-pack.txt'), `DIAGNOSTIC ONLY: not a strict pass. exit ${warn.status}\n${warn.stdout}\n${warn.stderr}`);
}
const P = loadPacked('killua', out);
if (!P) throw new Error('No diagnostic atlas');
const measurements = { fullStrictExit: full.status, isolatedStrictExit: strict.status, reference: 'approved combat cell', versions, audit: P.meta.scaleAudit, frames: {} };
const reference = readPng('public/art-review/title-style-pilot/killua-combat_v01.png');
for (const a of P.anims) {
  if (P.meta.scaleAudit.anims[a.name].v !== versions[a.name]) throw new Error('Stale candidate ' + a.name);
  measurements.frames[a.name] = a.cells.map(c => bbox(c));
  const contact = newImage((a.cells.length + 1) * 256, 256, [34, 30, 48, 255]);
  blit(contact, reference, 0, 0);
  a.cells.forEach((c, i) => blit(contact, c, (i + 1) * 256, 0));
  fs.writeFileSync(path.join(dir, `native-${a.name}.png`), encodePng(contact));
  fs.writeFileSync(path.join(out, `${a.name}-f0.png`), encodePng(a.cells[0]));
}
fs.writeFileSync(path.join(dir, 'measurements.json'), JSON.stringify(measurements, null, 2));
const scale = spawnSync(process.execPath, ['tools/scale-audit.mjs', 'killua', '--root', fixture, '--public', out, '--out', path.join(dir, 'scale')], { encoding: 'utf8' });
fs.writeFileSync(path.join(dir, 'scale-command.txt'), scale.stdout + '\n' + scale.stderr);
const passFixture = path.join(dir, 'passing-fixture');
fs.mkdirSync(path.join(passFixture, 'characters/killua/raw'), { recursive: true });
fs.mkdirSync(path.join(passFixture, 'characters/killua/reference'), { recursive: true });
fs.mkdirSync(path.join(passFixture, 'scale'), { recursive: true });
const pm = structuredClone(original);
pm.characters = { killua: structuredClone(original.characters.killua) };
pm.characters.killua.animations = Object.fromEntries(['idle', 'stagger', 'taunt'].map(a => [a, structuredClone(original.characters.killua.animations[a])]));
delete pm.characters.killua.ui;
delete pm.characters.killua.reference;
for (const a of Object.keys(pm.characters.killua.animations)) {
  pm.characters.killua.animations[a].version = versions[a];
  for (const ext of ['png', 'json']) {
    const src = path.join(fixture, `characters/killua/raw/${a}_v${String(versions[a]).padStart(2, '0')}.${ext}`);
    if (fs.existsSync(src)) fs.copyFileSync(src, path.join(passFixture, `characters/killua/raw/${path.basename(src)}`));
  }
}
fs.writeFileSync(path.join(passFixture, 'manifest.json'), JSON.stringify(pm, null, 2));
fs.copyFileSync('art/scale/builds.json', path.join(passFixture, 'scale/builds.json'));
fs.copyFileSync('art/characters/killua/reference/title_style_combat_cell_v01.png', path.join(passFixture, 'characters/killua/reference/title_style_combat_cell_v01.png'));
const passOut = path.join(out, 'passing');
const pass = spawnSync(process.execPath, ['tools/pack-sprites.mjs', 'killua', '--root', passFixture, '--out', passOut, '--quantize', '48', '--strict-scale', '--no-writeback'], { encoding: 'utf8' });
fs.writeFileSync(path.join(dir, 'passing-strict-pack.txt'), `Only idle/stagger/taunt candidates. exit ${pass.status}\n${pass.stdout}\n${pass.stderr}`);
if (pass.status) throw new Error('Passing subset failed');
const passP = loadPacked('killua', passOut);
for (const a of passP.anims) {
  const contact = newImage((a.cells.length + 1) * 256, 256, [34, 30, 48, 255]);
  blit(contact, reference, 0, 0);
  a.cells.forEach((c, i) => blit(contact, c, (i + 1) * 256, 0));
  fs.writeFileSync(path.join(dir, `native-passing-${a.name}.png`), encodePng(contact));
}
spawnSync(process.execPath, ['tools/scale-audit.mjs', 'killua', '--root', passFixture, '--public', passOut, '--out', path.join(dir, 'passing-scale')], { encoding: 'utf8' });
console.log(JSON.stringify({ fullStrictExit: full.status, isolatedStrictExit: strict.status, audit: P.meta.scaleAudit }, null, 2));
