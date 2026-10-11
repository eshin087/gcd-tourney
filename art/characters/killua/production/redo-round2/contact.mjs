import fs from 'node:fs';
import {loadPacked} from '../../../../../tools/scale-audit.mjs';
import {newImage,blit,encodePng} from '../../../../../tools/pack-sprites.mjs';
const d='art/characters/killua/production/redo-round2/',P=loadPacked('killua',d+'scratch-public');
fs.mkdirSync(d+'contacts',{recursive:true});
const idle=P.anims.find(a=>a.name==='idle').cells[0];
for(const name of ['light1','airLight3']){const a=P.anims.find(a=>a.name===name);const out=newImage((a.cells.length+1)*256,256);for(let i=0;i<out.data.length;i+=4)out.data.set([174,185,186,255],i);blit(out,idle,0,0);a.cells.forEach((c,i)=>blit(out,c,(i+1)*256,0));fs.writeFileSync(d+'contacts/'+name+'.png',encodePng(out));}
fs.writeFileSync(d+'candidate-light1.png',encodePng(P.anims.find(a=>a.name==='light1').cells[0]));
