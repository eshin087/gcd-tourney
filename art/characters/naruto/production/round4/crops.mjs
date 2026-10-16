import fs from 'node:fs';
import { PNG } from 'pngjs';
const dir='art/characters/naruto/production/round4';
const label=process.argv[2]||'baseline'; const source=dir+'/'+(label==='candidate'?'candidate-public':'baseline')+'/characters/naruto/';
const m=JSON.parse(fs.readFileSync(source+'anims.json'));
const s=PNG.sync.read(fs.readFileSync(source+'sheet.png'));
const out=new PNG({width:768,height:768});
for (const a of ['idle','superDash','jumpUp','stagger','taunt','win']) for(let f=0;f<m.animations[a].frames.length;f++){
const n=m.animations[a].frames[f], sx=n%16*256,sy=Math.floor(n/16)*256;
for(let y=0;y<768;y++)for(let x=0;x<768;x++) {const p=((sy+Math.floor(y/3))*s.width+sx+Math.floor(x/3))*4, d=(y*768+x)*4; for(let c=0;c<3;c++)out.data[d+c]=s.data[p+3]?s.data[p+c]:28;out.data[d+3]=255; if(x%48===0||y%48===0)for(let c=0;c<3;c++)out.data[d+c]=Math.round(out.data[d+c]*.85+80*.15);}
fs.writeFileSync(`${dir}/${label}-${a}-${f}.png`,PNG.sync.write(out));
}
