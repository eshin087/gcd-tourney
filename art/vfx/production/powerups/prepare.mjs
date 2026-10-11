import fs from 'node:fs';
const names=['bubble','wisp','arc','ripple','naruto_chakraTail'];
const dir='public/art-review/vfx-powerups';
fs.copyFileSync('public/preview/vfx/atlas.png',`${dir}/atlas.png`);
fs.copyFileSync('public/preview/vfx/atlas.json',`${dir}/atlas.json`);
let manifest=fs.readFileSync('art/manifest.json','utf8');
let tracker=fs.readFileSync('art/TRACKER.md','utf8');
for(const name of names){const v=name==='ripple'?2:1;fs.copyFileSync(`art/vfx/raw/${name}_v0${v}.png`,`${dir}/${name}_v0${v}.png`);manifest=manifest.replace(new RegExp('("'+name+'": \\{[^\\n]*?)"status":"todo","version":0'), '$1"status":"packed","version":'+v);tracker=tracker.replace(new RegExp('(^\\| '+name+' \\|[^\\n]*?)\\| todo \\| - \\| - \\|[^\\n]*','m'),'$1| packed | v0'+v+' | - | W5 candidate; 128px, white-tinted; awaiting explicit approval. |');}
fs.writeFileSync('art/manifest.json',manifest);fs.writeFileSync('art/TRACKER.md',tracker);
let rows=names.map(n=>`| 2026-10-10 | vfx | ${n} | [raw](vfx/raw/${n}_v0${n==='ripple'?2:1}.png), [packed contact](../public/art-review/vfx-powerups/contact.png) | v0${n==='ripple'?2:1} | needs review | W5 power-up effect candidate, built-in imagegen. | ${n==='ripple'?'5 frames; automatic split fixed in v02; raw fringe triggers grayscale conversion warning.':'Expected frame count packed; white/light-grey runtime tint.'} Review playback and game at /art-review/vfx-powerups/. No approval implied. |`).join('\n');
rows+='\n| 2026-10-10 | vfx | ripple | [raw v01](vfx/raw/ripple_v01.png) | v01 | needs review | Retained earlier source; v02 is the recommended review candidate. | Technical failure: automatic split read 6 instead of 5 frames. Do not approve; preserved immutable history. |';
let review=fs.readFileSync('art/REVIEW.md','utf8');review=review.replace('|---|---|---|---|---|---|---|---|','|---|---|---|---|---|---|---|---|\n'+rows);fs.writeFileSync('art/REVIEW.md',review);
let log=fs.readFileSync('CHANGELOG.md','utf8');log=log.replace('## [Unreleased]','## [Unreleased]\n\n- art(vfx): add unapproved power-up candidates bubble/wisp/arc/chakra tail v01 and ripple v02, packed frame gallery and isolated candidate preview.');fs.writeFileSync('CHANGELOG.md',log);
