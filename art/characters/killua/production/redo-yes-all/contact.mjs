import fs from 'node:fs';
import {loadPacked} from '../../../../../tools/scale-audit.mjs';
import {newImage,blit,encodePng} from '../../../../../tools/pack-sprites.mjs';
const d='art/characters/killua/production/redo-yes-all/';
const P=loadPacked('killua',d+'scratch-public');
const names=['run','light1','heavy','airLight3','airHeavy','special','specialDown','down','ko'];
fs.mkdirSync(d+'contacts',{recursive:true});
const idle=P.anims.find(a=>a.name==='idle').cells[0];
for(const name of names){const a=P.anims.find(a=>a.name===name);const out=newImage((a.cells.length+1)*256,256);for(let i=0;i<out.data.length;i+=4)out.data.set([174,185,186,255],i);blit(out,idle,0,0);a.cells.forEach((c,i)=>blit(out,c,(i+1)*256,0));for(let x=0;x<out.width;x++)out.data.set([20,40,40,255],(240*out.width+x)*4);fs.writeFileSync(d+'contacts/'+name+'.png',encodePng(out));}
fs.writeFileSync(d+'candidate-run.png',encodePng(P.anims.find(a=>a.name==='run').cells[0]));
