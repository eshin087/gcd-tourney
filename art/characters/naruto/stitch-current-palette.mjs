import fs from 'node:fs';
import {loadPacked} from '../../../../../tools/scale-audit.mjs';
import {hex} from '../../../../../tools/scale-probe.mjs';
import {main} from '../../../../../tools/stitch-parts.mjs';
const colors=new Map();
const idle=loadPacked('naruto','public').anims.find(a=>a.name==='idle');
for(const c of idle.cells)for(let y=40;y<68;y++)for(let x=110;x<150;x++){const i=(y*256+x)*4;if(c.data[i+3]<128)continue;const [r,g,b]=c.data.subarray(i,i+3);if(r>180&&g>180&&b<120){const k=(r<<16)|(g<<8)|b;colors.set(k,(colors.get(k)||0)+1);}}
const gold=[...colors].sort((a,b)=>b[1]-a[1]);console.log('Actual packed idle hair-only ROI colors',gold.map(([k,n])=>[hex(k),n]));
if(!gold.length)throw Error('No gold found');
const file='art/scale/builds.json',original=fs.readFileSync(file,'utf8');
try{const j=JSON.parse(original);j.fighters.naruto.headColors=[hex(gold[0][0])];fs.writeFileSync(file,JSON.stringify(j,null,2)+'\n');process.exitCode=main(['naruto',...process.argv.slice(2),'--root','art','--public','public']);}
finally{fs.writeFileSync(file,original);}
