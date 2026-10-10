import fs from 'node:fs';
import {PNG} from 'pngjs';
const p=PNG.sync.read(fs.readFileSync('public/characters/killua/sheet.png'));
const meta=JSON.parse(fs.readFileSync('public/characters/killua/anims.json'));
for(const [name,a] of Object.entries(meta.animations)) {
  if(name!=='run'&&!a.phases)continue;
  for(const [i,f]of a.frames.entries()) {
    let sum=0,n=0,min=256,max=0;
    for(let y=0;y<110;y++)for(let x=0;x<256;x++){
      const k=((Math.floor(f/16)*256+y)*p.width+f%16*256+x)*4;
      if(p.data[k+3]&&p.data[k]>170&&p.data[k+1]>165&&p.data[k+2]>180){sum+=x;n++;min=Math.min(min,x);max=Math.max(max,x);}
    }
    if(name==='run'||meta.boxes[f].hit)console.log(JSON.stringify({name,i,head:Math.round(sum/n),hair:[min,max],box:meta.boxes[f]}));
  }
}
