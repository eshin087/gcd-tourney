import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { readPng, crop, removeBackground, bbox } from '../../../../tools/pack-sprites.mjs';

// Diagnostic only. Copies exact selected candidates into an isolated input root;
// it never moves source files or changes production manifests or approval state.
const root = process.cwd();
const character = path.join(root, 'art/characters/goku');
const output = path.resolve(process.argv[2] || path.join(character, 'production/preflight-v01'));
if (!output.startsWith(path.join(character, 'production') + path.sep)) throw new Error('Output must be inside Goku production.');
if (fs.existsSync(output)) throw new Error('Choose a fresh output directory; evidence is immutable.');
const chosen = { idle: 2, run: 4, dash: 3, jumpUp: 3, jumpFall: 2, land: 3, light1: 2, light2: 4, light3: 4, light4: 4, heavy: 4, airLight1: 4, airHeavy: 4, guard: 4, hurtHigh: 7, launched: 6, down: 4, getup: 3, charge: 4, beamCharge: 4, beamFire: 4, special: 2, win: 3 };
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const relative = (file) => path.relative(root, file).replaceAll('\\', '/');
const writeJSON = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n');
const input = path.join(output, 'input');
const raw = path.join(input, 'characters/goku/raw');
fs.mkdirSync(raw, { recursive: true });
fs.mkdirSync(path.join(input, 'scale'), { recursive: true });
fs.writeFileSync(path.join(output, '.gitignore'), '/input/\n');
fs.copyFileSync(path.join(root, 'art/scale/builds.json'), path.join(input, 'scale/builds.json'));
const original = JSON.parse(fs.readFileSync(path.join(root, 'art/manifest.json'), 'utf8'));
const inventory = [];
for (const [name, version] of Object.entries(chosen)) {
  const file = `${name}_v${String(version).padStart(2, '0')}.png`;
  const found = ['raw', 'raw/_qa_hold'].map((folder) => path.join(character, folder, file)).filter(fs.existsSync);
  if (found.length !== 1) throw new Error(`Expected one selected source for ${file}, found ${found.length}`);
  const source = found[0];
  fs.copyFileSync(source, path.join(raw, file));
  const sidecar = source.replace(/\.png$/, '.json');
  if (fs.existsSync(sidecar)) fs.copyFileSync(sidecar, path.join(raw, file.replace(/\.png$/, '.json')));
  const png = readPng(source);
  const def = original.characters.goku.animations[name];
  const native = png.w === def.frames * 256 && png.h === 256;
  const bounds = native ? Array.from({ length: def.frames }, (_, k) => {
    const c = crop(png, k * 256, 0, 256, 256);
    removeBackground(c, { tol: 72 });
    return bbox(c);
  }) : null;
  inventory.push({ name, version, source: relative(source), sha256: hash(source), sidecar: fs.existsSync(sidecar) ? { source: relative(sidecar), sha256: hash(sidecar) } : null, frames: def.frames, dimensions: [png.w, png.h], native, bounds, bodyHeight: def.bodyHeight, approvedVersion: def.approvedVersion, maximumNativeHeight: bounds ? Math.max(...bounds.map((b) => b?.h || 0)) : null });
}
const base = { ...original, characters: { goku: structuredClone(original.characters.goku) } };
// 'warn' exists only here to render failed candidates for diagnosis. The separate
// --strict-scale report preserves the real gate results, with original thresholds.
base.characters.goku.scaleGate = 'warn';
const manifests = { current: base, 'native-control': structuredClone(base) };
for (const record of inventory) if (record.native) {
  manifests['native-control'].characters.goku.animations[record.name].bodyHeight = record.maximumNativeHeight;
}
const packer = path.join(root, 'tools/pack-sprites.mjs');
const reports = {};
for (const [label, manifest] of Object.entries(manifests)) {
  const dir = path.join(output, label);
  fs.mkdirSync(dir);
  const manifestFile = path.join(dir, 'diagnostic-manifest.json');
  writeJSON(manifestFile, manifest);
  const common = [packer, 'goku', '--root', input, '--manifest', manifestFile, '--out', dir, '--no-writeback', '--quantize', '48', '--json'];
  for (const strict of [true, false]) {
    const args = [...common, ...(strict ? ['--strict-scale', '--dry-run'] : [])];
    const result = spawnSync(process.execPath, args, { encoding: 'utf8', maxBuffer: 30 * 1024 * 1024 });
    const reportFile = path.join(dir, strict ? 'strict-report.json' : 'render-report.json');
    fs.writeFileSync(reportFile, result.stdout);
    if (result.error || result.stderr) fs.writeFileSync(reportFile + '.stderr.txt', result.error?.stack || result.stderr);
    JSON.parse(result.stdout);
    reports[`${label}-${strict ? 'strict' : 'render'}`] = { exitCode: result.status, report: relative(reportFile) };
    if (!strict && result.status !== 0) throw new Error(`Diagnostic render failed: ${label}`);
  }
}
// Bind evidence to the sources and tools, not to the newest filename on disk.
writeJSON(path.join(output, 'inventory.json'), { label: 'DIAGNOSTIC ONLY — no approval or release pass', sourceCommit: spawnSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).stdout.trim(), sourceManifestSha256: hash(path.join(root, 'art/manifest.json')), packerSha256: hash(packer), probeSha256: hash(path.join(root, 'tools/scale-probe.mjs')), buildsSha256: hash(path.join(root, 'art/scale/builds.json')), selected: inventory, reports });
for (const record of inventory) if (hash(path.join(root, record.source)) !== record.sha256) throw new Error(`Source changed during diagnosis: ${record.source}`);
console.log(JSON.stringify({ output, candidates: inventory.length, reports }, null, 2));
