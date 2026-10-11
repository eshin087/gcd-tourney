import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
const root = process.cwd();
const require = createRequire(path.join(root, 'package.json'));
const { PNG } = require('pngjs');
const read = p => JSON.parse(fs.readFileSync(p));
const dir = path.join(root, 'public/decals');
const atlas = read(path.join(dir, 'atlas.json'));
const pages = atlas.pages.map(p => PNG.sync.read(fs.readFileSync(path.join(dir,p))));
const digest = (img,e,i) => {
  const [x,y] = e.frames[i]; const h = createHash('sha256');
  for(let row=0;row<e.h;row++) h.update(img.data.subarray(((y+row)*img.width+x)*4,((y+row)*img.width+x+e.w)*4));
  return h.digest('hex');
};
const results=[];
for(const gallery of ['decals','decals-chakra-cursed','decals-cursed']) {
  const d=path.join(root,'public/art-review',gallery,'candidate');
  if(!fs.existsSync(path.join(d,'atlas.json'))) continue;
  const a=read(path.join(d,'atlas.json'));
  const imgs=a.pages.map(p=>PNG.sync.read(fs.readFileSync(path.join(d,p))));
  for(const [name,e] of Object.entries(a.decals)) {
    const p=atlas.decals[name];
    if(!p) throw Error('Missing '+name);
    const metadata=x=>Object.fromEntries(Object.entries(x).filter(([k])=>!['page','frames'].includes(k)));
    if(JSON.stringify(metadata(e))!==JSON.stringify(metadata(p)) || p.frames.length!==e.frames.length) throw Error('Metadata changed '+name);
    for(let i=0;i<e.frames.length;i++) if(digest(imgs[e.page],e,i)!==digest(pages[p.page],p,i)) throw Error('Pixels changed '+name+':'+i);
    results.push({name,version:p.version,variants:p.frames.length,pixelsIdentical:true});
  }
}
const floor=new Set(), elements={};
for(const e of Object.values(atlas.decals)) {
  if(['base','edge'].includes(e.group)) floor.add(e.page);
  else (elements[e.group]??=new Set()).add(e.page);
}
const groups=Object.keys(elements); let max=0;
for(const a of groups)for(const b of groups)max=Math.max(max,new Set([...floor,...elements[a],...elements[b]]).size);
if(atlas.source!=='approved'||results.length!==Number(process.argv[2]||31)||max>4)throw Error('Approval/count/page-budget failure');
console.log(JSON.stringify({source:atlas.source,names:results.length,variants:results.reduce((n,e)=>n+e.variants,0),maxPagesPerMatch:max,pages:atlas.pages,reviewedPixelsIdentical:true,results},null,2));
