import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { loadPacked } from '../../../../../tools/scale-audit.mjs';
import { bbox, blit, encodePng, newImage } from '../../../../../tools/pack-sprites.mjs';

const root = 'art/characters/naruto/production/alts/frozen';
const fixture = root + '/fixture';
const raw = fixture + '/characters/naruto/raw';
const out = root + '/packed';
const sourceRoot = 'art/characters/naruto/raw';
const manifest = JSON.parse(fs.readFileSync('art/manifest.json', 'utf8'));
const selections = [
  ['light1', 4, 'light1Alt', 1], ['light2', 6, 'light2Alt', 2],
  ['light3', 4, 'light3Alt', 1], ['light4', 8, 'light4Alt', 1],
  ['heavy', 12, 'heavyAlt', 1], ['airLight1', 6, 'airLight1Alt', 1],
  ['airLight2', 5, 'airLight2Alt', 1], ['airLight3', 9, 'airLight3Alt', 1],
  ['airHeavy', 9, 'airHeavyAlt', 2], ['hurtHigh', 4, 'hurtHighAlt', 1],
  ['hurtLow', 3, 'hurtLowAlt', 1],
];
fs.mkdirSync(raw, { recursive: true });
fs.mkdirSync(fixture + '/scale', { recursive: true });
const character = structuredClone(manifest.characters.naruto);
character.scaleGate = 'warn';
for (const [base, bv, alt, av] of selections) {
  character.animations[base].version = bv;
  character.animations[alt].version = av;
  character.animations[alt].status = 'raw';
  character.animations[alt].approvedVersion = null;
}
fs.writeFileSync(fixture + '/manifest.json', JSON.stringify({ ...manifest, characters: { naruto: character } }, null, 2));
fs.copyFileSync('art/scale/builds.json', fixture + '/scale/builds.json');
for (const f of fs.readdirSync(raw)) fs.unlinkSync(raw + '/' + f);
const inputs = [['idle', 7]];
for (const [base, bv, alt, av] of selections) inputs.push([base, bv], [alt, av]);
const inputHashes = {};
for (const [asset, version] of inputs) {
  const stem = `${asset}_v${String(version).padStart(2, '0')}`;
  for (const ext of ['png', 'json']) {
    const src = `${sourceRoot}/${stem}.${ext}`;
    if (!fs.existsSync(src)) continue;
    const bytes = fs.readFileSync(src);
    fs.copyFileSync(src, `${raw}/${stem}.${ext}`);
    inputHashes[`${asset}_v${version}.${ext}`] = createHash('sha256').update(bytes).digest('hex');
  }
}
const packed = spawnSync(process.execPath, ['tools/pack-sprites.mjs', 'naruto', '--quantize', '48', '--root', fixture, '--out', out, '--no-writeback'], { encoding: 'utf8' });
fs.writeFileSync(root + '/pack-log.txt', packed.stdout + packed.stderr);
if (packed.status !== 0) throw new Error(`Diagnostic full pack failed (${packed.status}); see pack-log.txt`);
const P = loadPacked('naruto', path.resolve(out));
const rows = [];
const frames = {};
for (const [base, , alt] of selections) {
  const baseCells = P.anims.find(a => a.name === base)?.cells;
  const altCells = P.anims.find(a => a.name === alt)?.cells;
  if (!baseCells || !altCells) throw new Error(`Missing packed cells ${base}/${alt}`);
  const y0 = rows.length * 512;
  rows.push({ base, alt, baseCount: baseCells.length, altCount: altCells.length, y0 });
  const cells = [...baseCells, ...altCells];
  cells.forEach((cell, i) => {
    const name = i < baseCells.length ? base : alt;
    const frame = i < baseCells.length ? i : i - baseCells.length;
    frames[`${name}:${frame}`] = bbox(cell);
  });
}
const atlas = newImage(4096, rows.length * 512);
for (const row of rows) {
  const baseCells = P.anims.find(a => a.name === row.base).cells;
  const altCells = P.anims.find(a => a.name === row.alt).cells;
  [...baseCells, ...Array(Math.max(0, 8 - baseCells.length)).fill(null), ...altCells, ...Array(Math.max(0, 8 - altCells.length)).fill(null)]
    .forEach((cell, i) => { if (cell) blit(atlas, cell, (i % 16) * 256, row.y0 + Math.floor(i / 16) * 256); });
}
const atlasPath = root + '/naruto-alt-base-paired-native.png';
fs.writeFileSync(atlasPath, encodePng(atlas));
const sourceAnims = JSON.parse(fs.readFileSync(out + '/characters/naruto/anims.json', 'utf8'));
const edge = box => box ? [box[0], box[1], box[0] + box[2], box[1] + box[3]] : null;
const report = {
  note: 'Warning-mode diagnostic only. Cells are actual 48-color quantized pack output; no bodyHeight, pivot, gate or hitbox threshold was changed. Pair rows: base cells at x0..7, alt cells x8..15; use per-animation frame arrays below.',
  atlas: atlasPath,
  atlasSha256: createHash('sha256').update(fs.readFileSync(atlasPath)).digest('hex'),
  inputs: inputHashes,
  rows,
  frames,
  animations: Object.fromEntries(selections.map(([base, bv, alt, av]) => [alt, {
    base, baseVersion: bv, version: av,
    baseContract: { frames: character.animations[base].frames, phases: character.animations[base].phases, ms: character.animations[base].ms },
    altContract: { frames: character.animations[alt].frames, phases: character.animations[alt].phases, ms: character.animations[alt].ms },
    baseFrames: sourceAnims.animations[base].frames.length,
    altFrames: sourceAnims.animations[alt].frames.length,
    contactDeltas: (character.animations[alt].phases ? Array.from({ length: character.animations[alt].phases[1] }, (_, i) => character.animations[alt].phases[0] + i) : []).map(frame => {
      const baseAtlasFrame = sourceAnims.animations[base].frames[frame];
      const altAtlasFrame = sourceAnims.animations[alt].frames[frame];
      const baseBox = sourceAnims.boxes[String(baseAtlasFrame)]?.hit?.[0] ?? null;
      const altBox = sourceAnims.boxes[String(altAtlasFrame)]?.hit?.[0] ?? null;
      const baseEdges = edge(baseBox);
      const altEdges = edge(altBox);
      return { frame, baseHit: baseBox, altHit: altBox, baseEdges, altEdges, edgeDeltaAltMinusBase: baseEdges && altEdges ? altEdges.map((v, i) => v - baseEdges[i]) : null };
    }),
    altBoxes: Object.fromEntries(sourceAnims.animations[alt].frames.map((frame, i) => [i, sourceAnims.boxes[String(frame)]])),
  }])),
};
const reportPath = root + '/audit-manifest.json';
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ atlas: atlasPath, atlasSha256: report.atlasSha256, report: reportPath, reportSha256: createHash('sha256').update(fs.readFileSync(reportPath)).digest('hex'), packLog: root + '/pack-log.txt' }, null, 2));
