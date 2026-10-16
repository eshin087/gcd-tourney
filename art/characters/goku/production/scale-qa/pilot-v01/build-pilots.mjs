import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { PNG } from 'pngjs';

const root = process.cwd();
const character = path.join(root, 'art/characters/goku');
const output = path.join(character, 'production/scale-qa/pilot-v01/fixture-output');
const input = path.join(output, 'input');
if (fs.existsSync(output)) throw new Error(`Refusing to overwrite evidence directory: ${output}`);
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const saveJson = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n');
const mkdir = (dir) => fs.mkdirSync(dir, { recursive: true });
const selected = [
  { name: 'idle', version: 2 },
  { name: 'guard', version: 5 },
  { name: 'light2', version: 5 }
];
const inputRaw = path.join(input, 'characters/goku/raw');
mkdir(inputRaw);
mkdir(path.join(input, 'scale'));
fs.copyFileSync(path.join(root, 'art/scale/builds.json'), path.join(input, 'scale/builds.json'));

const sources = [];
for (const item of selected) {
  const filename = `${item.name}_v${String(item.version).padStart(2, '0')}.png`;
  const source = path.join(character, 'raw', filename);
  const dest = path.join(inputRaw, filename);
  if (!fs.existsSync(source)) throw new Error(`Missing expected source: ${source}`);
  fs.copyFileSync(source, dest);
  const sidecar = source.replace(/\.png$/, '.json');
  if (fs.existsSync(sidecar)) fs.copyFileSync(sidecar, dest.replace(/\.png$/, '.json'));
  const png = PNG.sync.read(fs.readFileSync(source));
  const def = JSON.parse(fs.readFileSync(path.join(root, 'art/manifest.json'), 'utf8')).characters.goku.animations[item.name];
  sources.push({ name: item.name, version: item.version, path: `art/characters/goku/raw/${filename}`, sha256: hash(source), width: png.width, height: png.height, frames: def.frames, sourceSidecar: fs.existsSync(sidecar) ? { path: `art/characters/goku/raw/${filename.replace(/\.png$/, '.json')}`, sha256: hash(sidecar) } : null });
}

const referenceDir = path.join(output, 'references');
mkdir(referenceDir);
const references = [
  ['idle_v02.png', path.join(character, 'raw/idle_v02.png')],
  ['idle_approved.png', path.join(character, 'reference/idle_approved.png')],
  ['title_style_lineup_v02.png', path.join(character, 'reference/title_style_lineup_v02.png')]
];
for (const [filename, source] of references) {
  if (!fs.existsSync(source)) throw new Error(`Missing approved comparison reference: ${source}`);
  fs.copyFileSync(source, path.join(referenceDir, filename));
}

const originalManifestFile = path.join(root, 'art/manifest.json');
const originalManifest = JSON.parse(fs.readFileSync(originalManifestFile, 'utf8'));
const actualSettings = Object.fromEntries(selected.map(({ name }) => [name, {
  bodyHeight: originalManifest.characters.goku.animations[name].bodyHeight,
  version: originalManifest.characters.goku.animations[name].version,
  approvedVersion: originalManifest.characters.goku.animations[name].approvedVersion ?? null,
  scaleManualQA: originalManifest.characters.goku.animations[name].scaleManualQA ?? null
}]));
const fixtureManifests = {};
for (const mode of ['current', 'native-height']) {
  const manifest = structuredClone(originalManifest);
  manifest.characters = { goku: structuredClone(originalManifest.characters.goku) };
  // Warn is only used by the isolated diagnostic fixture so failed probe findings render for inspection.
  manifest.characters.goku.scaleGate = 'warn';
  if (mode === 'native-height') {
    manifest.characters.goku.animations.guard.bodyHeight = 229;
    manifest.characters.goku.animations.light2.bodyHeight = 236;
  }
  const dir = path.join(output, mode);
  mkdir(dir);
  const manifestFile = path.join(dir, 'diagnostic-manifest.json');
  saveJson(manifestFile, manifest);
  fixtureManifests[mode] = { path: path.relative(root, manifestFile).replaceAll('\\', '/'), sha256: hash(manifestFile), guardBodyHeight: manifest.characters.goku.animations.guard.bodyHeight, light2BodyHeight: manifest.characters.goku.animations.light2.bodyHeight, scaleGate: manifest.characters.goku.scaleGate };
}

const packer = path.join(root, 'tools/pack-sprites.mjs');
const reports = {};
for (const mode of ['current', 'native-height']) {
  const dir = path.join(output, mode);
  const common = [packer, 'goku', '--root', input, '--manifest', path.join(dir, 'diagnostic-manifest.json'), '--out', dir, '--no-writeback', '--quantize', '48', '--json'];
  const strict = spawnSync(process.execPath, [...common, '--strict-scale', '--dry-run'], { encoding: 'utf8', maxBuffer: 40 * 1024 * 1024 });
  fs.writeFileSync(path.join(dir, 'strict-report.json'), strict.stdout);
  if (strict.error || strict.stderr) fs.writeFileSync(path.join(dir, 'strict-report.stderr.txt'), strict.error?.stack || strict.stderr);
  JSON.parse(strict.stdout);
  const render = spawnSync(process.execPath, common, { encoding: 'utf8', maxBuffer: 40 * 1024 * 1024 });
  fs.writeFileSync(path.join(dir, 'render-report.json'), render.stdout);
  if (render.error || render.stderr) fs.writeFileSync(path.join(dir, 'render-report.stderr.txt'), render.error?.stack || render.stderr);
  JSON.parse(render.stdout);
  if (render.status !== 0) throw new Error(`Warn-mode isolated render failed in ${mode}; see render report.`);
  const atlas = path.join(dir, 'characters/goku/sheet.png');
  const meta = path.join(dir, 'characters/goku/anims.json');
  if (!fs.existsSync(atlas) || !fs.existsSync(meta)) throw new Error(`Rendered atlas missing for ${mode}`);
  reports[mode] = {
    strictExitCode: strict.status,
    renderExitCode: render.status,
    strictReport: path.relative(root, path.join(dir, 'strict-report.json')).replaceAll('\\', '/'),
    renderReport: path.relative(root, path.join(dir, 'render-report.json')).replaceAll('\\', '/'),
    sheet: path.relative(root, atlas).replaceAll('\\', '/'),
    sheetSha256: hash(atlas),
    metadata: path.relative(root, meta).replaceAll('\\', '/'),
    metadataSha256: hash(meta)
  };
}

const inventory = {
  label: 'DIAGNOSTIC ONLY. Isolated selected-source current and native-height fixtures; not production gate/pass or approval.',
  sourceCommit: spawnSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).stdout.trim(),
  worktree: path.relative(root, character).replaceAll('\\', '/'),
  sourceManifest: { path: 'art/manifest.json', sha256: hash(originalManifestFile) },
  packer: { path: 'tools/pack-sprites.mjs', sha256: hash(packer) },
  probe: { path: 'tools/scale-probe.mjs', sha256: hash(path.join(root, 'tools/scale-probe.mjs')) },
  builds: { path: 'art/scale/builds.json', sha256: hash(path.join(root, 'art/scale/builds.json')) },
  selectedSources: sources,
  productionSettingsAtRun: actualSettings,
  fixtureManifests,
  approvedReferences: references.map(([filename, source]) => ({ path: source.replaceAll('\\', '/'), sha256: hash(source), copy: `art/characters/goku/production/scale-qa/pilot-v01/fixture-output/references/${filename}` })),
  outputs: reports,
  note: 'The current fixture mirrors production bodyHeight and differs from strict production mode only by isolated scaleGate=warn to force diagnostic rendering. Native-height fixture changes only guard bodyHeight=229 and light2 bodyHeight=236 in its private manifest; these values are measured occupied source-frame maxima and are not production calibration changes.'
};
saveJson(path.join(output, 'inventory.json'), inventory);
console.log(JSON.stringify({ output: path.relative(root, output).replaceAll('\\', '/'), sourceSettings: actualSettings, fixtureManifests, reports }, null, 2));
