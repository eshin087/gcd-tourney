import fs from 'node:fs';
import path from 'node:path';
import { readPng, crop, removeBackground, bbox, resample, placeCharFrame } from '../../../../tools/pack-sprites.mjs';
import { auditCharacter } from '../../../../tools/scale-probe.mjs';

const directory = path.resolve(process.argv[2] || 'art/characters/goku/production/preflight-v01');
const inventory = JSON.parse(fs.readFileSync(path.join(directory, 'inventory.json')));
const idle = readPng(inventory.selected.find((a) => a.name === 'idle').source);
const cells = Array.from({ length: 8 }, (_, k) => {
  const c = crop(idle, k * 256, 0, 256, 256);
  removeBackground(c);
  return c;
});
const spec = { frameWidth: 256, frameHeight: 256, pivot: [128, 240], cellMargin: 4 };
const controls = [0.8, 1].map((factor) => ({ name: `known-${factor}`, cells: cells.map((c) => {
  const b = bbox(c), trimmed = crop(c, b.x0, b.y0, b.w, b.h);
  return placeCharFrame(resample(trimmed, factor), spec).cell;
}) }));
const audit = auditCharacter([{ name: 'idle', cells }, ...controls]);
const data = { description: 'Measurement controls only. In-memory copies of approved idle; no source edits.', ref: audit.ref,
  headPalette: [...audit.palette.head].map((n) => '#' + n.toString(16).padStart(6, '0')), anims: audit.anims };
const frameRatios = audit.anims.idle.frames.map((f) => f.head).filter(Number.isFinite);
data.referenceSelfCheck = { minimum: Math.min(...frameRatios), maximum: Math.max(...frameRatios), allowedPop: 0.12,
  pass: frameRatios.length === cells.length && Math.max(...frameRatios) - Math.min(...frameRatios) <= 0.12 };
data.retryDecision = data.referenceSelfCheck.pass ? 'Check control accuracy and whole anatomy before using gate verdicts.' : 'MEASUREMENT HOLD: failed head verdicts cannot authorize regeneration. Fix/review detector first.';
const output = path.join(directory, 'measurement-controls.json');
if (fs.existsSync(output)) throw new Error('Control evidence already exists.');
fs.writeFileSync(output, JSON.stringify(data, null, 2) + '\n');
console.log(JSON.stringify({ reference: data.ref, selfCheck: data.referenceSelfCheck, retryDecision: data.retryDecision }, null, 2));
