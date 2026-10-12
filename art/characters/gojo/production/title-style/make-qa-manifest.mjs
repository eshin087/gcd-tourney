// Reproduce a separate diagnostic atlas without changing production scale gates.
// The resulting atlas is only for native inspection of held candidates.
import fs from 'node:fs';

const root = 'art/characters/gojo/production/title-style';
const manifest = JSON.parse(fs.readFileSync('art/manifest.json', 'utf8'));
manifest.characters.gojo.scaleGate = 'warn';
fs.writeFileSync(`${root}/qa-manifest.json`, JSON.stringify(manifest));
console.log(`Wrote ${root}/qa-manifest.json (Gojo diagnostic scaleGate: warn only)`);
