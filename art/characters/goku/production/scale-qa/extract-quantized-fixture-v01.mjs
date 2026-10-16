import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { PNG } from 'pngjs';
const root=process.cwd();
const base=path.join(root,'art/characters/goku/production/scale-qa/reassembly-r02');
const sheet=PNG.sync.read(fs.readFileSync(path.join(base,'fixture-public/characters/goku/sheet.png')));
const meta=JSON.parse(fs.readFileSync(path.join(base,'fixture-public/characters/goku/anims.json'),'utf8'));
const out=path.join(base,'quantized-crops');
fs.mkdirSync(out,{recursive:true});
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const inventory={label:'Exact crops from frozen 48-color quantized warn-only atlas; no resizing or palette edits.',atlasPath:'fixture-public/characters/goku/sheet.png',atlasSha256:hash(fs.readFileSync(path.join(base,'fixture-public/characters/goku/sheet.png'))),animations:{}};
for(const [name,a] of Object.entries(meta.animations)){
  const dir=path.join(out,name); fs.mkdirSync(dir,{recursive:true});
  const frames=[];
  const contact=new PNG({width:256*a.frames.length,height:256});
  for(let j=0;j<a.frames.length;j++){
    const index=a.frames[j], col=index%meta.columns,row=Math.floor(index/meta.columns);
    const crop=new PNG({width:256,height:256});
    for(let y=0;y<256;y++) for(let x=0;x<256;x++){
      const si=((row*256+y)*sheet.width+(col*256+x))*4, di=(y*256+x)*4;
      crop.data.set(sheet.data.subarray(si,si+4),di); contact.data.set(sheet.data.subarray(si,si+4),((y*contact.width+j*256+x)*4));
    }
    const buf=PNG.sync.write(crop), file=`f${String(j).padStart(2,'0')}.png`; fs.writeFileSync(path.join(dir,file),buf);
    frames.push({frame:j,atlasIndex:index,durationMs:a.durations[j],path:`quantized-crops/${name}/${file}`,sha256:hash(buf)});
  }
  const cb=PNG.sync.write(contact); fs.writeFileSync(path.join(out,`${name}-contact.png`),cb);
  inventory.animations[name]={loop:a.loop,frames,contactPath:`quantized-crops/${name}-contact.png`,contactSha256:hash(cb)};
}
fs.writeFileSync(path.join(out,'inventory.json'),JSON.stringify(inventory,null,2)+'\n');
console.log(JSON.stringify({atlasSha256:inventory.atlasSha256,animations:Object.keys(inventory.animations),crops:out},null,2));
