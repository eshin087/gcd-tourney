import fs from 'node:fs';
import {readPng} from '../../../../../../tools/pack-sprites.mjs';
for (const f of [0,4]) {
 const c=readPng('public/art-review/sasuke-neutral-redraw/idle-'+f+'.png'), counts=new Map();
 for(let y=34;y<58;y++)for(let x=105;x<149;x++){const i=(y*c.w+x)*4,d=c.data;if(d[i+3]<128)continue;const rgb=[d[i],d[i+1],d[i+2]]; if(Math.max(...rgb)>140)continue;const key='#'+rgb.map(v=>v.toString(16).padStart(2,'0')).join('');counts.set(key,(counts.get(key)||0)+1);}
 console.log(f,[...counts].sort((a,b)=>b[1]-a[1]));
}

