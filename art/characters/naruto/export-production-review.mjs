import fs from 'node:fs';
import {PNG} from 'pngjs';
import {loadPacked} from '../../../../../tools/scale-audit.mjs';
const out='public/art-review/naruto/neutral-production';
fs.mkdirSync(out,{recursive:true});
const ledger=JSON.parse(fs.readFileSync('art/characters/naruto/PRODUCTION_LEDGER.json'));
const report=JSON.parse(fs.readFileSync('art/scale/scale-report.json')).fighters.naruto;
const packed=loadPacked('naruto','public');
const latest=Object.values(Object.fromEntries(ledger.records.sort((a,b)=>a.version-b.version).map(r=>[r.name,r])));
const rows=[];
for(const r of latest){
  const a=packed.anims.find(a=>a.name===r.name),gate=report.anims[r.name];
  const board=new PNG({width:256*a.cells.length,height:256});
  for(let i=0;i<board.data.length;i+=4){board.data[i]=35;board.data[i+1]=39;board.data[i+2]=50;board.data[i+3]=255;}
  a.cells.forEach((c,k)=>{for(let y=0;y<256;y++)for(let x=0;x<256;x++){const si=(y*256+x)*4,di=(y*board.width+k*256+x)*4;if(c.data[si+3])board.data.set(c.data.subarray(si,si+4),di);}});
  fs.writeFileSync(`${out}/${r.name}-packed.png`,PNG.sync.write(board));
  fs.copyFileSync(r.file,`${out}/${r.name}_v${String(r.version).padStart(2,'0')}.png`);
  rows.push({...r,packedVersion:gate.v,gate:gate.verdict,head:gate.head,range:gate.range});
}
fs.copyFileSync('art/scale/heads-naruto.png',`${out}/heads.png`);
fs.copyFileSync('art/characters/naruto/reference/height_neutral_v01.png',`${out}/height_neutral_v01.png`);
fs.writeFileSync(`${out}/review.json`,JSON.stringify(rows,null,2)+'\n');
const html=`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Naruto neutral production review</title><style>body{background:#171b24;color:#eceef2;font:16px system-ui;margin:20px;max-width:1500px}a{color:#91cafa}.hold{border-left:5px solid #e76c75;padding-left:14px}section{margin:36px 0}img{max-width:100%;image-rendering:pixelated;background:#252936}.strip{overflow-x:auto}.strip img{max-width:none;height:256px}summary{cursor:pointer}small{color:#bbb}</style><h1>Naruto — pending neutral-baseline production</h1><p>42 new sources; 32 packed candidates, 10 technical holds. Only height_neutral v01 is approved. No new animation is approved. Pack includes older approved fallbacks for held moves; those are clearly labeled below. Unmeasured is not a scale pass.</p><p><a href="/?fight=naruto,naruto&mode=solo&art=custom&debug">Open candidate game</a> · <a href="heads.png">Heads audit</a> · <a href="review.json">Measurements and notes</a></p><details><summary>Approved neutral anatomy</summary><img src="height_neutral_v01.png" width="400"></details>${rows.map(r=>`<section class="${r.hold?'hold':''}"><h2>${r.name} v${String(r.version).padStart(2,'0')} — ${r.hold?'TECHNICAL HOLD':'needs review'}</h2><p>${r.notes||''}</p><p>Packed v${String(r.packedVersion).padStart(2,'0')}: ${r.gate}, head ${r.head??'not measured'}, range ${r.range??'not measured'}. ${r.hold?'BELOW IS OLD APPROVED FALLBACK, NOT NEW CANDIDATE.':''}</p><div class="strip"><img src="${r.name}-packed.png"></div><small>Frames left to right f0–f${r.frames-1}; native 256 px cells.</small><details><summary>New raw source v${String(r.version).padStart(2,'0')}</summary><img src="${r.name}_v${String(r.version).padStart(2,'0')}.png"></details></section>`).join('')}`;
fs.writeFileSync(`${out}/index.html`,html);
console.log(JSON.stringify({rows:rows.length,candidates:rows.filter(r=>!r.hold).length,holds:rows.filter(r=>r.hold).length,unmeasured:rows.filter(r=>!r.hold&&r.gate==='unmeasured').map(r=>r.name)}));

