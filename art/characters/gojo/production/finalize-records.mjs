import fs from 'node:fs';
let now = fs.readFileSync('docs/NOW.md', 'utf8');
now = now.replace(/^2\. \*\*Gojo:.*$/m, '2. **Gojo: complete batch ready for one review.** Model v03, expressions v02, all 42 animations / 175 frames and 3 UI candidates. Strict pack, browser combat checks and build pass. Open art/characters/gojo/reference/batch_review_v03.html locally; reply in the Gojo thread with `approve Gojo final batch` or consolidated feedback. Blink engine wiring remains ENG-032.');
fs.writeFileSync('docs/NOW.md', now);
let review = fs.readFileSync('art/REVIEW.md', 'utf8');
review = review.split('\n').map(line => {
  if (!line.startsWith('| 2026-10-09 | gojo |')) return line;
  return line.replace('Final measured QA recorded in production/QA.md.', 'Final strict pack and browser QA pass. [QA and visual caveats](characters/gojo/production/QA.md); one bulk review.');
}).join('\n');
fs.writeFileSync('art/REVIEW.md', review);
const m = JSON.parse(fs.readFileSync('art/manifest.json')).characters.gojo;
const final = { model: 'model_sheet_v03.png', expressions: 'expressions_v02.png', animations: Object.fromEntries(Object.entries(m.animations).map(([n,d]) => [n,{version:d.version,file:n+'_v'+String(d.version).padStart(2,'0')+'.png',frames:d.frames}])), ui: m.ui, reviewStatus: 'needs review', browser: 'PASS: nine normal hits, six special/super paths, no errors', build: 'PASS: sandbox-compatible Vite build', engineHandoffs: ['ENG-032','ENG-035'] };
fs.writeFileSync('art/characters/gojo/production/progress.json', JSON.stringify(final,null,2)+'\n');
console.log('Final Gojo review records saved');
