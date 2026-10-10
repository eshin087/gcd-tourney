import fs from 'node:fs';
import path from 'node:path';
import {PNG} from 'pngjs';
// Pipeline frame cleanup requested in CODEX_INBOX. Matches packer's <3-pixel,
// eight-connected noise threshold; raw generations and visible poses stay intact.
const root='art/characters/killua/frames',changes=[];
for(const dir of fs.readdirSync(root)){
  if(!fs.statSync(path.join(root,dir)).isDirectory())continue;
  for(const file of fs.readdirSync(path.join(root,dir)).filter(n=>n.endsWith('.png'))){
    const full=path.join(root,dir,file),p=PNG.sync.read(fs.readFileSync(full)),seen=new Uint8Array(p.width*p.height);let removed=0;
    for(let k=0;k<seen.length;k++)if(p.data[k*4+3]&&!seen[k]){
      const stack=[k],pixels=[];seen[k]=1;
      while(stack.length){const n=stack.pop(),x=n%p.width,y=Math.floor(n/p.width);pixels.push(n);
        for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const xx=x+dx,yy=y+dy,j=yy*p.width+xx;if(xx>=0&&xx<p.width&&yy>=0&&yy<p.height&&!seen[j]&&p.data[j*4+3]){seen[j]=1;stack.push(j);}}
      }
      if(pixels.length<3){removed+=pixels.length;for(const n of pixels)p.data.fill(0,n*4,n*4+4);}
    }
    if(removed){fs.writeFileSync(full,PNG.sync.write(p));changes.push({file:full,removed});}
  }
}
fs.writeFileSync('art/characters/killua/production/qa-cleanup.json',JSON.stringify(changes,null,2)+'\n');console.log(JSON.stringify(changes));
