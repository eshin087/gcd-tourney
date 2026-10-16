import fs from 'node:fs'; import {PNG} from 'pngjs';
for(const [src,dst,x,y,w,h] of [
['art/characters/goku/production/generation-source/jumpUp_v03_attempt03.png','art/characters/goku/production/reassembly-r02/jumpUp-source-f0-crop.png',0,0,887,887],
['art/characters/goku/production/generation-source/airLight1_v04_attempt04.png','art/characters/goku/production/reassembly-r02/airLight1-source-f0-crop.png',0,0,512,512]]){
 const im=PNG.sync.read(fs.readFileSync(src)), out=new PNG({width:w,height:h});
 for(let yy=0;yy<h;yy++)for(let xx=0;xx<w;xx++){let si=((y+yy)*im.width+x+xx)*4,di=(yy*w+xx)*4;out.data.set(im.data.subarray(si,si+4),di)}
 fs.writeFileSync(dst,PNG.sync.write(out));
}
