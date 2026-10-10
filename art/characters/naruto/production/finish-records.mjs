import fs from 'node:fs';
import path from 'node:path';
const base='art/characters/naruto/',prod=base+'production/';
const ledger=JSON.parse(fs.readFileSync(prod+'progress.json','utf8'));
const rp='art/REVIEW.md';
let review=fs.readFileSync(rp,'utf8');
const additions=[];
function recordOld(asset,v,relative,reason){
 const tag='v'+String(v).padStart(2,'0');
 const rows=review.split('\n');let found=false;
 review=rows.map(line=>{
  const c=line.split('|').map(s=>s.trim());
  if(c[2]==='naruto'&&c[3]===asset&&c[5]===tag){
   if(c[6]==='approved')throw Error('Refusing approved version '+asset+tag);
   found=true;c[4]='['+path.basename(relative)+'](characters/naruto/'+relative+')';c[6]='rejected';c[8]=reason;
   return '| '+c.slice(1,-1).join(' | ')+' |';
  }return line;
 }).join('\n');
 if(!found)additions.push('| 2026-10-09 | naruto | '+asset+' | ['+path.basename(relative)+'](characters/naruto/'+relative+') | '+tag+' | rejected | QA correction; original source retained | '+reason+' |');
}
for(const [asset,e]of Object.entries(ledger)){
 for(const file of fs.readdirSync(base+'raw')){
  const match=file.match(new RegExp('^'+asset+'_v(\\d+)\\.png$'));
  if(!match||Number(match[1])>=e.version)continue;
  const dest=base+'raw/_rejected/'+file;fs.mkdirSync(path.dirname(dest),{recursive:true});
  if(fs.existsSync(dest))throw Error('Archive exists '+dest);
  fs.renameSync(base+'raw/'+file,dest);
  recordOld(asset,Number(match[1]),'raw/_rejected/'+file,'Superseded during QA by v'+String(e.version).padStart(2,'0')+'; source retained. '+(asset==='ko'?'Earlier pose had unsuitable aspect ratio.':asset==='ui_cutin'?'Earlier band did not fill the final rectangle.':'Corrected separation/extraction of adjacent poses.'));
 }
}
for(const [asset,files,reason]of [
 ['airHeavy',['airHeavy_v01_A.png'],'Part A corrected in v02 to remove oversized decorative slash. No v01 final strip was assembled.'],
 ['specialForward',['specialForward_v01_A.png','specialForward_v01_B.png'],'Part A feet overlapped; corrected in v02, with unchanged B copied into v02. No v01 final strip was assembled.']
]){
 for(const file of files){const src=base+'raw/_parts/'+file,dest=base+'raw/_parts/_rejected/'+file;if(fs.existsSync(src)){fs.mkdirSync(path.dirname(dest),{recursive:true});if(fs.existsSync(dest))throw Error('Archive exists');fs.renameSync(src,dest);}}
 recordOld(asset,1,'raw/_parts/_rejected/'+files[0],reason);
}
const table=review.indexOf('\n| 2026-');
if(additions.length)review=review.slice(0,table)+'\n'+additions.join('\n')+review.slice(table);
fs.writeFileSync(rp,review);
let tasks=fs.readFileSync('docs/TASKS.md','utf8');
tasks=tasks.replace(/^\| ART-NAR-FINAL .*$/m,'| ART-NAR-FINAL | Complete Naruto art set for one final review | Codex | review | 40 new animations and 3 UI candidates complete; full set 42 animations / 175 frames, strict 48-color pack passes. Review /art-review/naruto/final/. Source corrections, sidecars, hitbox overrides and visual caveats in production/QA.md. One final approval pending. files: art/characters/naruto/, public/art-review/naruto/final/, public/characters/naruto/, Naruto tracker/review/manifest rows, docs/NOW.md, CHANGELOG.md. |');
for(const id of ['04','05','06','07','08','09','10','13'])tasks=tasks.replace(new RegExp('^\\| ART-NAR-'+id+' .*$', 'm'),line=>line.replace('| todo |','| review |')+' Completed candidates and checks tracked by ART-NAR-FINAL; one final batch approval. |');
fs.writeFileSync('docs/TASKS.md',tasks);
let now=fs.readFileSync('docs/NOW.md','utf8');
now=now.replace(/^1\. \*\*Naruto:\*\*.*$/m,'1. **Naruto: final batch review.** All 42 animations (175 frames) and 3 UI images are prepared. Review https://gcd-tourney.vercel.app/art-review/naruto/final/ once published, then reply `approve Naruto final batch` or list changes. Approved short-hair references, idle and run remain approved. See production/QA.md for visual limitations.');
fs.writeFileSync('docs/NOW.md',now);
let log=fs.readFileSync('CHANGELOG.md','utf8');
if(!log.includes('Naruto complete candidate batch'))log=log.replace('## [Unreleased]','## [Unreleased]\n\n- Naruto complete candidate batch for one final review: 40 new animations and three UI images, completing 42 animations / 175 frames. Corrected pose separation, dash placement, knockout and cut-in; 48-color atlas, frame-local hand boxes, and phone-friendly playback review (ART-NAR-FINAL).');
fs.writeFileSync('CHANGELOG.md',log);
console.log('Archived superseded Naruto sources and reconciled final review records.');
