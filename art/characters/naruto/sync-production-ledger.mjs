import fs from 'node:fs';
const inventory=JSON.parse(fs.readFileSync('art/characters/naruto/REDRAW_INVENTORY.json')).rows;
const base='art/characters/naruto/raw';
const records=[];
for(const sub of ['', '/_rejected']) for(const file of fs.readdirSync(base+sub)) {
  const m=file.match(/^(.+)_v(\d+)\.png$/); if(!m)continue;
  const row=inventory.find(r=>r.name===m[1]); if(!row || +m[2]<row.nextVersion)continue;
  const side=base+sub+'/'+file.replace('.png','.json');
  const notes=fs.existsSync(side)?JSON.parse(fs.readFileSync(side,'utf8').replace(/^\uFEFF/,'')).anatomy?.notes:'Three attempts exhausted; best source retained as technical hold. No automatic exemption.';
  records.push({name:m[1],version:+m[2],frames:row.frames,file:base+sub+'/'+file,hold:!!sub,notes});
}
let review=fs.readFileSync('art/REVIEW.md','utf8');
// Refresh only this production round's rows, including links moved into technical holds.
review=review.split('\n').filter(line=>{const c=line.split('|').map(x=>x.trim());return !(c[2]==='naruto' && records.some(r=>c[3]===r.name && c[5]===`v${String(r.version).padStart(2,'0')}`));}).join('\n');
const added=records.filter(r=>!review.includes('('+r.file.replace(/^art\//,'')+')')).map(r=>`| 2026-10-11 | naruto | ${r.name} | [raw](${r.file.replace(/^art\//,'')}) | v${String(r.version).padStart(2,'0')} | needs review | Approved-neutral production redraw; ${r.hold?'TECHNICAL HOLD, excluded from pack; not a user rejection.':'candidate, not approved.'} | ${r.frames} intended frames. ${r.notes||''} Batch QA pending; [heads](scale/heads-naruto.png) and [lineup](scale/lineup-naruto-idle_v05.png) refresh required before final review. |`).join('\n');
if(added)review=review.replace('|---|---|---|---|---|---|---|---|','|---|---|---|---|---|---|---|---|\n'+added);
fs.writeFileSync('art/REVIEW.md',review);
let manifest=fs.readFileSync('art/manifest.json','utf8');
const start=manifest.indexOf('"naruto":'),end=manifest.indexOf('"sasuke":',start);
let own=manifest.slice(start,end);
for(const row of inventory){const versions=records.filter(r=>r.name===row.name).map(r=>r.version);if(!versions.length)continue;const v=Math.max(...versions);const re=new RegExp('("'+row.name+'"\\s*:\\s*\\{[^}]*?"version"\\s*:\\s*)\\d+');own=own.replace(re,'$1'+v);}
manifest=manifest.slice(0,start)+own+manifest.slice(end);fs.writeFileSync('art/manifest.json',manifest);
fs.writeFileSync('art/characters/naruto/PRODUCTION_LEDGER.json',JSON.stringify({date:'2026-10-11',state:'in progress; no new animation approved',records},null,2)+'\n');
console.log(`${records.length} version records; ${new Set(records.map(r=>r.name)).size}/42 animations attempted`);
