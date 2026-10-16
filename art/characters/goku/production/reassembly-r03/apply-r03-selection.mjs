import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const goku = path.join(root, 'art/characters/goku');
const raw = path.join(goku, 'raw');
const hold = path.join(raw, '_qa_hold');
const base = path.join(goku, 'production/reassembly-r03');
const inventory = JSON.parse(fs.readFileSync(path.join(base, 'final5-fixture-inventory.json'), 'utf8'));
const manifestPath = path.join(root, 'art/manifest.json');
const original = fs.readFileSync(manifestPath, 'utf8');
JSON.parse(original);
const sha = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const selected = inventory.selected;

// Move exact candidate bytes into the packer's selected raw directory; keep the immutable files intact.
for (const pick of selected) {
  for (const ext of ['png', 'json']) {
    const name = `${pick.animation}_v${String(pick.version).padStart(2, '0')}.${ext}`;
    const from = path.join(hold, name), to = path.join(raw, name);
    const fixtureFile = path.join(base, 'final5-fixture-art/characters/goku/raw', name);
    if (!fs.existsSync(fixtureFile)) throw new Error(`fixture lacks selected source: ${fixtureFile}`);
    if (fs.existsSync(to)) {
      if (sha(fs.readFileSync(to)) !== sha(fs.readFileSync(fixtureFile))) throw new Error(`selected raw differs from audited fixture: ${to}`);
    } else {
      if (!fs.existsSync(from)) throw new Error(`missing held candidate: ${from}`);
      if (sha(fs.readFileSync(from)) !== sha(fs.readFileSync(fixtureFile))) throw new Error(`held source differs from audited fixture: ${from}`);
      fs.renameSync(from, to);
    }
  }
}
// The two calibrated holds must not fall back to their older approved drawings in a real pack.
for (const [anim, version] of [['light3', 4], ['heavy', 4]]) {
  for (const ext of ['png', 'json']) {
    const name = `${anim}_v${String(version).padStart(2, '0')}.${ext}`;
    const from = path.join(raw, name), to = path.join(hold, name);
    if (!fs.existsSync(from)) continue;
    if (fs.existsSync(to)) {
      const displaced = path.join(hold, '_pre-final5-raw', name);
      fs.mkdirSync(path.dirname(displaced), { recursive: true });
      if (fs.existsSync(displaced)) throw new Error(`displaced source already exists; inspect before proceeding: ${displaced}`);
      fs.renameSync(from, displaced);
    } else fs.renameSync(from, to);
  }
}

function findAnimationObject(text, name) {
  const needle = `${JSON.stringify(name)}: {`;
  const gokuAt = text.indexOf('"goku": {');
  const animationsAt = text.indexOf('"animations": {', gokuAt);
  const keyAt = text.indexOf(needle, animationsAt + 1);
  if (keyAt < 0) throw new Error(`manifest animation not found: ${name}`);
  const open = keyAt + needle.length - 1;
  let depth = 0, quote = false, escape = false;
  for (let i = open; i < text.length; i++) {
    const ch = text[i];
    if (quote) {
      if (escape) escape = false;
      else if (ch === '\\') escape = true;
      else if (ch === '"') quote = false;
      continue;
    }
    if (ch === '"') quote = true;
    else if (ch === '{') depth++;
    else if (ch === '}' && --depth === 0) return { keyAt, open, close: i, object: JSON.parse(text.slice(open, i + 1)) };
  }
  throw new Error(`unterminated manifest object: ${name}`);
}

let text = original;
const atlasHash = 'fbccd9bf1958a7d3e7c701ea062aa2b99f031456e3d25cd010a81c47e5286054';
const metadataHash = 'e98d7a2addcdbf932438ac43b89f507177b9071194359a40e042bab68fdfdc9f';
const evidence = 'art/characters/goku/production/manual-audit-r3/FINAL5_STRICT_AUDIT.md';
for (const pick of selected) {
  const found = findAnimationObject(text, pick.animation);
  const old = text.slice(found.open, found.close + 1);
  const updated = { ...found.object, bodyHeight: pick.bodyHeight, version: pick.version };
  if (updated.status === 'todo') updated.status = 'raw';
  updated.scaleManualQA = {
    version: pick.version,
    result: 'pass',
    by: 'GPT-6 Astra (medium), final5 strict quantized-pixel audit',
    note: `Exact version-bound pass on the 48-color strict atlas SHA256 ${atlasHash} and metadata SHA256 ${metadataHash}; packed at x1. This records technical scale/anatomy review only, not design approval or runtime contact approval.`,
    evidence
  };
  const replacement = JSON.stringify(updated);
  text = text.slice(0, found.open) + replacement + text.slice(found.close + 1);
  // Confirm that only this object changed and it remains parseable before continuing.
  const roundTrip = JSON.parse(text);
  if (roundTrip.characters.goku.animations[pick.animation].version !== pick.version) throw new Error(`in-place update failed: ${pick.animation}`);
}
JSON.parse(text);
fs.writeFileSync(manifestPath, text);
const after = fs.readFileSync(manifestPath);
fs.writeFileSync(path.join(base, 'production-selection-snapshot.json'), JSON.stringify({
  selected,
  omittedOnHold: ['light3_v09', 'heavy_v11'],
  heldApprovedSources: ['light3_v04', 'heavy_v04'],
  atlasSha256: atlasHash,
  metadataSha256: metadataHash,
  manifestSha256: sha(after),
  note: 'Only selected Goku animation version/bodyHeight/scaleManualQA objects were edited in place. approvedVersion fields and all other manifest data were preserved.'
}, null, 2) + '\n');
console.log(JSON.stringify({ manifestSha256: sha(after), selected: selected.length, bytesBefore: Buffer.byteLength(original), bytesAfter: after.length }, null, 2));
