import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(), art=path.join(root,'art'), dir=path.join(art,'characters/gojo'), raw=path.join(dir,'raw');
const invPath=path.join(dir,'redraw/INVENTORY.json'), inv=JSON.parse(fs.readFileSync(invPath));
let review=fs.readFileSync(path.join(art,'REVIEW.md'),'utf8'), rows=[];
for(const item of inv){
 const v=String(item.version).padStart(2,'0');
 const all=fs.readdirSync(raw).filter(f=>new RegExp('^'+item.name+'_v(\\d+)\\.png$').test(f));
 const fresh=all.filter(f=>Number(f.match(/_v(\d+)/)[1])>=item.version);
 const parts=fs.readdirSync(path.join(raw,'_parts')).filter(f=>f.startsWith(item.name+'_v'+v+'_'));
 item.savedStrips=fresh;
 item.savedParts=parts;
 item.status=fresh.length?'raw-awaiting-full-QA':parts.length?'parts-in-progress':'todo';
 for(const f of fresh){
  const version=f.match(/_v(\d+)/)[1], needle='characters/gojo/raw/'+f;
  if(!review.includes(needle)) rows.push('| 2026-10-11 | gojo | '+item.name+' | [raw]('+needle+') | v'+version+' | needs review | Approved-neutral full redraw candidate. | Production checkpoint only; NOT review-ready. Scale/pose/game QA pending. |');
 }
 if(parts.length&&!fresh.length){
  const key='gojo | '+item.name+' parts |';
  if(!review.includes(key)) rows.push('| 2026-10-11 | '+key+' '+parts.map(f=>'[part](characters/gojo/raw/_parts/'+f+')').join(', ')+' | v'+v+' | needs review | Long-strip source parts in progress. | Not a complete animation; measured stitching and all-frame QA required. |');
 }
}
const rejected=fs.readdirSync(path.join(raw,'_rejected')).filter(f=>/^.+_v\d+\.png$/.test(f));
for(const f of rejected){
 const [_,name,v]=f.match(/^(.+)_v(\d+)\.png$/), needle='characters/gojo/raw/_rejected/'+f;
 review=review.split('\n').map(line=>line.includes('characters/gojo/raw/'+f)?line.replace('characters/gojo/raw/'+f,needle).replace('needs review','rejected'):line).join('\n');
 if(!review.includes(needle)) rows.push('| 2026-10-11 | gojo | '+name+' | [rejected]('+needle+') | v'+v+' | rejected | Scale or cell-fit failed; original preserved. | See pack-latest.txt and successor prompt for correction. |');
}
const marker=review.indexOf('\n',review.indexOf('|---',review.indexOf('| date |')));
if(rows.length)review=review.slice(0,marker+1)+rows.join('\n')+'\n'+review.slice(marker+1);
fs.writeFileSync(path.join(art,'REVIEW.md'),review);
fs.writeFileSync(invPath,JSON.stringify(inv,null,2)+'\n');
console.log(JSON.stringify({saved:inv.filter(x=>x.savedStrips.length).length,partsOnly:inv.filter(x=>!x.savedStrips.length&&x.savedParts.length).length,total:inv.length,newRows:rows.length}));

