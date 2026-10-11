import fs from 'node:fs';
import {loadPacked} from '../../../../../tools/scale-audit.mjs';
import {newImage,blit,encodePng,readPng} from '../../../../../tools/pack-sprites.mjs';
const d='art/characters/killua/production/torso-fix/',cur=loadPacked('killua',d+'scratch-public'),old=loadPacked('killua','art/characters/killua/production/redo-round2/scratch-public');
const idle=cur.anims.find(a=>a.name==='idle').cells[0];
for(const n of ['down','ko']){const a=cur.anims.find(a=>a.name===n),o=old.anims.find(a=>a.name===n);const out=newImage((a.cells.length+1)*256,512);for(let i=0;i<out.data.length;i+=4)out.data.set([174,185,186,255],i);blit(out,idle,0,0);blit(out,idle,0,256);o.cells.forEach((c,i)=>blit(out,c,(i+1)*256,0));a.cells.forEach((c,i)=>blit(out,c,(i+1)*256,256));fs.writeFileSync(d+'contacts/'+n+'-old-new.png',encodePng(out));}
console.log(['down_v06','ko_v07'].map(n=>{let p=readPng('art/characters/killua/raw/'+n+'.png');return{name:n,width:p.w,height:p.h}}));
