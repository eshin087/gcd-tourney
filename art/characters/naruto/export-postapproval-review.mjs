import fs from 'node:fs';
import {PNG} from 'pngjs';
import {loadPacked} from '../../../tools/scale-audit.mjs';
const base='art/characters/naruto/production';
const out='public/art-review/naruto/post-approval-redraws';
fs.mkdirSync(out,{recursive:true});
const packed=loadPacked('naruto',`${base}/redraw-scratch/final-public`);
const report=JSON.parse(fs.readFileSync(`${base}/light4-v05-qa/scale-report.json`)).fighters.naruto;
const versions={heavy:10,throw:5,airLight3:5,light4:5};
const rows=[];
for(const [name,v] of Object.entries(versions)){
 const a=packed.anims.find(a=>a.name===name), g=report.anims[name];
 const board=new PNG({width:256*a.cells.length,height:256});
 a.cells.forEach((c,k)=>{for(let y=0;y<256;y++)for(let x=0;x<256;x++){const si=(y*256+x)*4,di=(y*board.width+k*256+x)*4;board.data.set(c.data.subarray(si,si+4),di);}});
 fs.writeFileSync(`${out}/${name}-packed.png`,PNG.sync.write(board));
 fs.copyFileSync(`art/characters/naruto/raw/${name}_v${String(v).padStart(2,'0')}.png`,`${out}/${name}-raw.png`);
 rows.push({name,version:v,frames:a.cells.length,gate:g.verdict,head:g.head,range:g.range,attempts:name==='throw'?1:3});
 if(name==='light4'){const c=a.cells[0];const one=new PNG({width:256,height:256});one.data=Buffer.from(c.data);fs.writeFileSync(`${base}/light4-v05-qa/light4-v05-f0.png`,PNG.sync.write(one));}
}
fs.copyFileSync(`${base}/light4-v05-qa/heads-naruto.png`,`${out}/heads.png`);
fs.writeFileSync(`${out}/review.json`,JSON.stringify(rows,null,2)+'\n');
fs.writeFileSync(`${out}/index.html`,`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Naruto post-approval redraws</title><style>body{background:#171b24;color:#eee;font:16px system-ui;margin:20px}a{color:#9cf}section{margin:36px 0}.strip{overflow:auto}img{image-rendering:pixelated;background:#303743;max-width:100%}.strip img{max-width:none;height:256px}.hold{border-left:5px solid #f77;padding-left:12px}</style><h1>Naruto: four post-approval redraws</h1><p>User approved heavy v10, throw v05 and airLight3 v05. Only light4 v05 remains unapproved.</p><p><strong>Technical hold: light4 v05. Full strict pack exited 1 and did not write the game atlas.</strong> These are diagnostic packed cells from a separate warning-only scratch output, not shipping game art. Heavy v10, throw v05 and airLight3 v05 pass their scale gates; no heavy clipping remains. Light4 exhausted its latest 3 additional generations; f0 remains larger than f2.</p><p><a href="heads.png">All-frame heads sheet</a> · <a href="lineup.png">Light4 f0 cast comparison</a> · <a href="review.json">Measurements</a></p>${rows.map(r=>`<section class="${r.gate==='pop'?'hold':''}"><h2>${r.name} v${String(r.version).padStart(2,'0')} — ${r.gate==='pop'?'HOLD — needs review':'approved'}</h2><p>Gate ${r.gate}; head ${r.head}; range ${r.range}. ${r.attempts}/3 extra generations used. Frames f0–f${r.frames-1}, at original 256 px density.</p><div class="strip"><img src="${r.name}-packed.png" alt="${r.name} all diagnostic frames"></div><details><summary>Versioned raw source</summary><img src="${r.name}-raw.png"></details></section>`).join('')}`);
console.log(rows);



