import fs from 'node:fs';
import {readPng,encodePng} from '../../../../../../tools/pack-sprites.mjs';
const root='public/art-review/sasuke-neutral-redraw/',j=JSON.parse(fs.readFileSync(root+'audit.json'));
for(let start=0;start<j.records.length;start+=7){const rows=j.records.slice(start,start+7),w=2048,h=rows.length*256,d=new Uint8Array(w*h*4);
for(let i=0;i<d.length;i+=4){d[i]=28;d[i+1]=34;d[i+2]=47;d[i+3]=255;}
for(let y=0;y<rows.length;y++)for(let k=0;k<rows[y].detected;k++){const c=readPng(root+rows[y].name+'-'+k+'.png');for(let sy=0;sy<256;sy++)for(let sx=0;sx<256;sx++){let si=(sy*256+sx)*4;if(c.data[si+3]<128)continue;d.set(c.data.slice(si,si+4),((y*256+sy)*w+k*256+sx)*4);}}
fs.writeFileSync(root+'contact-'+(start/7)+'.png',encodePng({w,h,data:d}));console.log(start/7,rows.map(r=>r.name).join(', '));}

