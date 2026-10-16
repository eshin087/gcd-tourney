import fs from 'node:fs';
import path from 'node:path';
const base = path.resolve('art/characters/gojo/production/round4');
const art = path.join(base, 'diagnostic-v05-art');
const raw = path.join(art, 'characters/gojo/raw');
fs.mkdirSync(raw, { recursive: true });
const manifest = JSON.parse(fs.readFileSync('art/manifest.json', 'utf8'));
const gojo = structuredClone(manifest.characters.gojo);
const names = { idle: 6, guard: 4, jumpUp: 4, jumpFall: 5, airRecover: 4, throw: 5, airLight1: 7, airLight2: 5, airLight3: 12, light3: 5, hurtLow: 4 };
gojo.animations = Object.fromEntries(Object.entries(names).map(([name, version]) => {
  const entry = structuredClone(manifest.characters.gojo.animations[name]);
  entry.version = version;
  entry.approvedVersion = name === 'idle' ? 6 : manifest.characters.gojo.animations[name].approvedVersion;
  return [name, entry];
}));
gojo.scaleGate = 'warn';
const diagnosticManifest = { ...manifest, characters: { gojo } };
fs.writeFileSync(path.join(art, 'manifest.json'), JSON.stringify(diagnosticManifest, null, 2) + '\n');
for (const [name, version] of Object.entries(names)) {
  for (const ext of ['png', 'json']) {
    const from = path.resolve(`art/characters/gojo/raw/${name}_v${String(version).padStart(2, '0')}.${ext}`);
    if (fs.existsSync(from)) fs.copyFileSync(from, path.join(raw, path.basename(from)));
  }
}
console.log(`prepared ${Object.keys(names).length} diagnostic strips in ${art}`);

