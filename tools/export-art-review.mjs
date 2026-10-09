#!/usr/bin/env node
// Export only selected fighter art for the mobile review page. Validate approvals and packed
// frames first; keep versioned originals and content-addressed playback files unchanged.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = path.join(ROOT, 'public');
const OUT = path.join(PUBLIC, 'art-review');
const CHARACTERS = [
  { id: 'naruto', accent: '#f88320' },
  { id: 'sasuke', accent: '#9a72d2' },
];
const ASSETS = [
  { id: 'modelSheet', label: 'Model sheet', stem: 'model_sheet', folder: 'reference', fixed: 'model_sheet.png' },
  { id: 'expressions', label: 'Expressions', stem: 'expressions', folder: 'reference', fixed: 'expressions.png' },
  { id: 'idle', label: 'Idle', stem: 'idle', folder: 'raw', fixed: 'idle_approved.png', animation: 'idle' },
  { id: 'run', label: 'Run', stem: 'run', folder: 'raw', animation: 'run' },
];

const hash = (buffer) => crypto.createHash('sha256').update(buffer).digest('hex');
const read = (relative) => fs.readFileSync(path.join(ROOT, relative));
const readJson = (relative) => JSON.parse(read(relative).toString('utf8'));
const versionTag = (version) => String(version).padStart(2, '0');
const assert = (condition, message) => { if (!condition) throw new Error(message); };

function options() {
  const args = process.argv.slice(2);
  const result = { dryRun: false, notes: 'art/mobile-review-notes.json', explicitNotes: false };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--dry-run') result.dryRun = true;
    else if (args[i] === '--notes' && args[i + 1] && !args[i + 1].startsWith('--')) {
      result.notes = args[++i];
      result.explicitNotes = true;
    } else if (args[i] === '--help') {
      console.info('Usage: node tools/export-art-review.mjs [--dry-run] [--notes path/to/notes.json]');
      console.info('Optional notes: { "naruto.run": { "notes": ["Review note."], "recommendation": "Review this candidate." } }');
      return null;
    } else throw new Error(`Unknown or incomplete option: ${args[i]}`);
  }
  return result;
}

function loadNotes(opts) {
  const file = path.resolve(ROOT, opts.notes);
  if (!fs.existsSync(file) && !opts.explicitNotes) return {};
  const notes = JSON.parse(fs.readFileSync(file, 'utf8'));
  assert(notes && typeof notes === 'object' && !Array.isArray(notes), 'Review notes must be an object.');
  for (const [key, value] of Object.entries(notes)) {
    const [id, asset, extra] = key.split('.');
    assert(!extra && CHARACTERS.some((c) => c.id === id) && ASSETS.some((a) => a.id === asset),
      `Unknown review note asset: ${key}`);
    assert(value && typeof value === 'object' && !Array.isArray(value), `${key} review notes must be an object.`);
    assert(Array.isArray(value.notes) && value.notes.every((line) => typeof line === 'string' && line.length <= 500),
      `${key} notes must be an array of short strings (at most 500 characters each).`);
    assert(value.recommendation === undefined || (typeof value.recommendation === 'string' && value.recommendation.length <= 500),
      `${key} recommendation must be a short string (at most 500 characters).`);
  }
  return notes;
}

function approvedVersion(state, label) {
  assert(state?.status === 'approved' && Number.isInteger(state.approvedVersion) && state.approvedVersion > 0,
    `${label} needs an approved version before export.`);
  return state.approvedVersion;
}

function validateAnimation(id, asset, state, version, meta, sheet) {
  const label = `${id}/${asset.animation}`;
  const animation = meta.animations?.[asset.animation];
  assert(animation && Array.isArray(animation.frames) && animation.frames.length === state.frames,
    `${label}: packed animation is missing or has the wrong frame count.`);
  assert(Array.isArray(animation.durations) && animation.durations.length === animation.frames.length
    && animation.durations.every((ms) => Number.isFinite(ms) && ms > 0), `${label}: invalid packed frame durations.`);
  assert(Array.isArray(state.ms) && state.ms.length === animation.durations.length
    && state.ms.every((ms, index) => ms === animation.durations[index]), `${label}: packed timing differs from the manifest.`);
  assert(animation.loop === state.loop, `${label}: packed loop setting does not match the manifest.`);
  const { frameWidth: fw, frameHeight: fh, columns } = meta;
  const capacity = columns * (sheet.height / fh);
  assert(animation.frames.every((frame) => Number.isInteger(frame) && frame >= 0 && frame < capacity),
    `${label}: frame index lies outside the packed sheet.`);

  const frameDir = `art/characters/${id}/frames/${asset.animation}`;
  const marker = readJson(`${frameDir}/.packer.json`);
  const expectedSource = `raw/${asset.stem}_v${versionTag(version)}.png`;
  assert(marker.version === version && marker.sourceFile?.replaceAll('\\', '/') === expectedSource,
    `${label}: packed frames do not come from selected ${expectedSource}; pack again before exporting.`);

  // Check geometry against the cleaned frames. Packing may quantize their RGB values into a shared palette.
  for (const [index, frame] of animation.frames.entries()) {
    const source = PNG.sync.read(read(`${frameDir}/${asset.animation}_${versionTag(index)}.png`));
    assert(source.width === fw && source.height === fh, `${label}: cleaned frame ${index} has the wrong dimensions.`);
    const sx = (frame % columns) * fw, sy = Math.floor(frame / columns) * fh;
    for (let y = 0; y < fh; y++) for (let x = 0; x < fw; x++) {
      const sourceAlpha = source.data[(y * fw + x) * 4 + 3];
      const packedAlpha = sheet.data[((sy + y) * sheet.width + sx + x) * 4 + 3];
      assert(sourceAlpha === packedAlpha,
        `${label}: public sheet geometry differs from cleaned frame ${index}; pack again before exporting.`);
    }
  }
}

function prepare(opts) {
  const manifest = readJson('art/manifest.json');
  const notes = loadNotes(opts);
  const files = new Map();
  const addFile = (relative, buffer) => {
    const existing = files.get(relative);
    assert(!existing || existing.equals(buffer), `Conflicting export file: ${relative}`);
    files.set(relative, buffer);
    return relative;
  };
  const characters = CHARACTERS.map(({ id, accent }) => {
    const character = manifest.characters?.[id];
    assert(character, `Missing character in manifest: ${id}`);
    const sheetBuffer = read(`public/characters/${id}/sheet.png`);
    const metaBuffer = read(`public/characters/${id}/anims.json`);
    const sheet = PNG.sync.read(sheetBuffer);
    const meta = JSON.parse(metaBuffer.toString('utf8'));
    assert(meta.character === id && meta.source === 'art-pack', `${id}: expected a packed character sheet.`);
    assert([meta.frameWidth, meta.frameHeight, meta.columns].every((n) => Number.isInteger(n) && n > 0)
      && sheet.width === meta.frameWidth * meta.columns && sheet.height % meta.frameHeight === 0,
    `${id}: sheet dimensions do not match animation metadata.`);
    const colors = new Set();
    const maxColors = manifest.spec?.maxColors ?? 48;
    assert(Number.isInteger(maxColors) && maxColors > 0, 'Manifest palette limit must be a positive integer.');
    for (let i = 0; i < sheet.data.length; i += 4) {
      const alpha = sheet.data[i + 3];
      assert(alpha === 0 || alpha === 255, `${id}: packed sheet has partially transparent pixels.`);
      if (alpha) colors.add((sheet.data[i] << 16) | (sheet.data[i + 1] << 8) | sheet.data[i + 2]);
    }
    assert(colors.size <= maxColors, `${id}: packed sheet has ${colors.size} colors (maximum ${maxColors}).`);
    const sheetUrl = addFile(`art-review/${id}/sheet-${hash(sheetBuffer).slice(0, 12)}.png`, sheetBuffer);
    const metaUrl = addFile(`art-review/${id}/anims-${hash(metaBuffer).slice(0, 12)}.json`, metaBuffer);
    const assets = ASSETS.map((asset) => {
      const label = `${id}/${asset.id}`;
      const state = asset.animation ? character.animations?.[asset.animation] : character.reference?.[asset.id];
      const version = asset.id === 'run' ? state?.version : approvedVersion(state, label);
      assert(Number.isInteger(version) && version > 0, `${label}: missing selected version.`);
      if (asset.id === 'run') {
        assert(['packed', 'approved'].includes(state.status), `${label}: latest run must be packed before export.`);
        const versions = fs.readdirSync(path.join(ROOT, `art/characters/${id}/raw`))
          .map((name) => /^run_v(\d+)\.png$/.exec(name)).filter(Boolean).map((match) => Number(match[1]));
        assert(Math.max(0, ...versions) === version, `${label}: manifest does not identify the latest active raw version.`);
      }
      const basename = `${asset.stem}_v${versionTag(version)}.png`;
      const source = read(`art/characters/${id}/${asset.folder}/${basename}`);
      if (asset.fixed) {
        const fixed = read(`art/characters/${id}/reference/${asset.fixed}`);
        assert(source.equals(fixed), `${label}: approved fixed reference differs from ${basename}.`);
      }
      const status = state.approvedVersion === version ? 'approved' : 'needs review';
      const entry = {
        id: asset.id,
        label: asset.label,
        kind: asset.animation ? 'animation' : 'image',
        version,
        status,
        raw: addFile(`art-review/${id}/${basename}`, source),
        notes: notes[`${id}.${asset.id}`]?.notes ?? [status === 'approved' ? 'Approved reference.' : 'Latest candidate, awaiting your review.'],
      };
      const recommendation = notes[`${id}.${asset.id}`]?.recommendation;
      if (recommendation !== undefined) entry.recommendation = recommendation;
      if (asset.animation) {
        validateAnimation(id, asset, state, version, meta, sheet);
        Object.assign(entry, { animation: asset.animation, sheet: sheetUrl, meta: metaUrl });
      }
      return entry;
    });
    return { id, name: character.name, accent, assets };
  });
  const review = { title: 'GCD Tourney art review', updatedAt: new Date().toISOString(), characters };
  return { files, review };
}

function main() {
  const opts = options();
  if (!opts) return;
  const { files, review } = prepare(opts);
  // Check every destination before copying anything. Re-running the export never rewrites a versioned image.
  for (const [relative, buffer] of files) {
    const destination = path.join(PUBLIC, ...relative.split('/'));
    if (fs.existsSync(destination)) assert(fs.readFileSync(destination).equals(buffer), `Refusing to replace ${relative}.`);
  }
  const reviewBuffer = Buffer.from(`${JSON.stringify(review, null, 2)}\n`);
  const bytes = [...files.values()].reduce((total, buffer) => total + buffer.length, reviewBuffer.length);
  if (!opts.dryRun) {
    for (const [relative, buffer] of files) {
      const destination = path.join(PUBLIC, ...relative.split('/'));
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      if (!fs.existsSync(destination)) fs.writeFileSync(destination, buffer, { flag: 'wx' });
    }
    fs.writeFileSync(path.join(OUT, 'review.json'), reviewBuffer);
  }
  console.info(`art-review: ${opts.dryRun ? 'validated' : 'exported'} ${files.size + 1} files, ${(bytes / 1024 / 1024).toFixed(2)} MiB`);
  for (const character of review.characters) {
    console.info(`  ${character.id}: ${character.assets.map((a) => `${a.id} v${versionTag(a.version)} (${a.status})`).join(', ')}`);
  }
  console.info(opts.dryRun ? '  dry run: no files written' : '  public/art-review/review.json');
}

try { main(); } catch (error) {
  console.error(`art-review: ${error.message}`);
  process.exitCode = 1;
}
