import fs from 'node:fs';
import path from 'node:path';
const base='art/characters/naruto';
const manifest=JSON.parse(fs.readFileSync('art/manifest.json','utf8'));
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const files=walk(base), review=fs.readFileSync('art/REVIEW.md','utf8');
const rows=Object.entries(manifest.characters.naruto.animations).map(([name,a])=>{
 const versions=files.flatMap(f=>{const m=path.basename(f).match(new RegExp('^'+name+'_v(\\d+)'));return m?[Number(m[1])]:[];});
 for(const line of review.split('\n'))if(line.includes('naruto')&&line.includes('`'+name+'`'))for(const m of line.matchAll(/v(\d+)/g))versions.push(Number(m[1]));
 return {name,frames:a.frames,nextVersion:Math.max(0,...versions)+1,approvedVersion:a.approvedVersion,bodyHeight:a.bodyHeight};
});
fs.writeFileSync(base+'/REDRAW_INVENTORY.json',JSON.stringify({date:'2026-10-11',note:'Version inventory includes raw, parts, rejected, reference and review rows. Recheck before each save.',rows},null,2)+'\n');
console.log(JSON.stringify(rows));
