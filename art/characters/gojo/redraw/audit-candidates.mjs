import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const H=await import(pathToFileURL(path.resolve('../../tools/pack-sprites.mjs')));
const P=await import(pathToFileURL(path.resolve('../../tools/scale-probe.mjs')));
const root=process.cwd(),dir=path.join(root,'art/characters/gojo'), raw=path.join(dir,'raw');
const manifest=JSON.parse(fs.readFileSync('art/manifest.json')), builds=JSON.parse(fs.readFileSync('art/scale/builds.json'));
const inv=JSON.parse(fs.readFileSync(path.join(dir,'redraw/INVENTORY.json')));
const spec=manifest.spec, report=[], anims=[];
for(const j of inv){
 const files=fs.readdirSync(raw).filter(f=>f.startsWith(j.name+'_v')&&f.endsWith('.png')).sort();
 const f=files.at(-1);if(!f||Number(f.match(/_v(\d+)/)[1])<j.version)continue;
 const version=Number(f.match(/_v(\d+)/)[1]), sidePath=path.join(raw,f.replace('.png','.json'));
 const side=fs.existsSync(sidePath)?JSON.parse(fs.readFileSync(sidePath)):{};
 const img=H.readPng(path.join(raw,f));H.removeBackground(img);H.removeSpecks(img);
 const split=H.splitStrip(img,j.frames);
 const sprites=split.rects.map(r=>{const piece=H.crop(img,r.x0,r.y0,r.x1-r.x0,r.y1-r.y0),b=H.bbox(piece);return b?H.crop(piece,b.x0,b.y0,b.w,b.h):null}).filter(Boolean);
 const body=manifest.characters.gojo.animations[j.name]?.bodyHeight??manifest.animationDefaults[j.name]?.bodyHeight??200;
 const scales=sprites.map((s,k)=>side.anatomy?.measurement==='skull-to-chin'?side.anatomy.targetHeadPx/side.anatomy.sourceHeadPx[k]:body/Math.max(...sprites.map(x=>x.h)));
 const place=(factor=1)=>sprites.map((s,k)=>H.placeCharFrame(H.resample(s,scales[k]*factor,{coverage:.5,alphaMin:128}),spec,side.frameOffsets?.[k]));
 const placed=place();
 anims.push({name:j.name,version,cells:placed.map(x=>x.cell),placed,place,side,f,scales,rawBounds:sprites.map(s=>({w:s.w,h:s.h}))});
}
let audit=P.auditCharacter(anims,{decl:builds.fighters.gojo});
if(audit.error)throw Error(audit.error);
for(const a of anims){
 const s=audit.anims[a.name];
 if(a.side.anatomy?.measurement==='auto-head'&&s.verdict==='uniform'){
  a.fit=1/s.head;a.placed=a.place(a.fit);a.cells=a.placed.map(x=>x.cell);
 }
}
audit=P.auditCharacter(anims,{decl:builds.fighters.gojo});
const out=path.join(dir,'redraw/contact');fs.mkdirSync(out,{recursive:true});
for(const a of anims){
 const cells=P.quantizeCopies(a.cells,48), contact=H.newImage(cells.length*256,256);
 cells.forEach((c,k)=>H.blit(contact,c,k*256,0));
 fs.writeFileSync(path.join(out,a.f),H.encodePng(contact));
 report.push({name:a.name,version:a.version,source:a.f,frameCount:a.cells.length,rawBounds:a.rawBounds,scales:a.scales,autoFit:a.fit??null,audit:audit.anims[a.name],placement:a.placed.map(({lost,clip,margin})=>({lost,clip,margin}))});
}
fs.writeFileSync(path.join(dir,'redraw/candidate-diagnostic.json'),JSON.stringify({method:'Diagnostic only using current main helpers; official packer exit required separately',anims:report},null,2));
console.log(report.map(a=>({name:a.name,head:a.audit.head,feet:a.audit.feet,verdict:a.audit.verdict,clip:a.placement.filter(x=>x.lost).length})));

