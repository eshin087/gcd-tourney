import fs from 'node:fs';
import {readPng,removeBackground} from '../../tools/pack-sprites.mjs';
const rows=[];
for(const f of fs.readdirSync('art/decals/raw').filter(f=>/\.png$/.test(f))){
 const raw=readPng('art/decals/raw/'+f), samples=[];
 let base;
 for(const tol of [72,90,110,130]){
  const img={...raw,data:Buffer.from(raw.data)};removeBackground(img,{tol});
  if(!base)base=img;
  let opaque=0,purple=0,lost=0,interiorLost=0;
  for(let p=0;p<img.w*img.h;p++){
   const i=p*4,r=img.data[i],g=img.data[i+1],b=img.data[i+2];
   if(img.data[i+3]){opaque++;if(Math.min(r,b)-g>30&&b-g>50)purple++;}
   else if(base.data[i+3]){lost++;const x=p%img.w,y=Math.floor(p/img.w);let interior=x>=3&&x<img.w-3&&y>=3&&y<img.h-3;for(let dy=-3;dy<=3&&interior;dy++)for(let dx=-3;dx<=3;dx++)if(!base.data[((y+dy)*img.w+x+dx)*4+3])interior=false;if(interior)interiorLost++;}
  }
  samples.push({tol,opaque,purple,purplePct:+(purple/opaque*100).toFixed(3),lost,interiorLost});
 }
 rows.push({file:f,samples});
}
fs.writeFileSync('art/decals/tolerance-audit.json',JSON.stringify(rows,null,2));
console.log(rows.map(r=>r.file+' '+r.samples.map(s=>s.tol+':'+s.purplePct+'% lost'+s.lost+'/inner'+s.interiorLost).join(' ')).join('\n'));
