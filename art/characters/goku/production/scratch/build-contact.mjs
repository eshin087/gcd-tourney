import fs from 'node:fs';
import { PNG } from 'pngjs';
const chars = ['light2','light3','light4','heavy','airLight1','airHeavy'];
const width = 9 * 256, height = chars.length * 256;
const out = new PNG({ width, height });
for (let i=0;i<out.data.length;i+=4){out.data[i]=255;out.data[i+1]=0;out.data[i+2]=255;out.data[i+3]=255;}
function paste(src,sx,sy,dx,dy){for(let y=0;y<256;y++)for(let x=0;x<256;x++){const si=((sy+y)*src.width+sx+x)*4,di=((dy+y)*out.width+dx+x)*4;out.data.set(src.data.subarray(si,si+4),di);}}
const idle=PNG.sync.read(fs.readFileSync('art/characters/goku/reference/idle_approved.png'));
chars.forEach((id,row)=>{paste(idle,0,0,0,row*256);const p=PNG.sync.read(fs.readFileSync(`art/characters/goku/raw/_qa_hold/${id}_v03.png`));for(let f=0;f<p.width/256;f++)paste(p,f*256,0,(f+1)*256,row*256);});
fs.writeFileSync('art/characters/goku/production/scale-qa/goku-core-six_v01.png',PNG.sync.write(out));
