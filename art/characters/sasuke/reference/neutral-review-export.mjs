import fs from 'node:fs';
import path from 'node:path';
import {readPng,removeBackground,removeSpecks,splitStrip,crop,resample,placeCharFrame,encodePng} from '../../../../../../tools/pack-sprites.mjs';
import {auditCharacter,compactAudit,exemptionsFrom,quantizeCopies,measurementCells} from '../../../../../../tools/scale-probe.mjs';
const root='art/characters/sasuke/',out='public/art-review/sasuke-neutral-redraw';
fs.mkdirSync(out,{recursive:true});
const manifest=JSON.parse(fs.readFileSync('art/manifest.json')),spec=manifest.spec;
const inv=JSON.parse(fs.readFileSync(root+'reference/neutral-redraw-inventory.json')).rows;
const anims=[],records=[];
for(const item of inv){
 const candidates=fs.readdirSync(root+'raw').filter(x=>new RegExp('^'+item.animation+'_v\\d+\\.png$').test(x)).sort((a,b)=>+a.match(/_v(\d+)/)[1]-+b.match(/_v(\d+)/)[1]);
 const file=candidates.at(-1),v=+file.match(/_v(\d+)/)[1],src=root+'raw/'+file,side=JSON.parse(fs.readFileSync(src.replace('.png','.json')));
 const raw=readPng(src);removeBackground(raw,{tol:72,mode:'char'});removeSpecks(raw);
 const rects=splitStrip(raw,item.frames).rects;
 const row={name:item.animation,version:v,frames:item.frames,detected:rects.length,file,anatomy:side.anatomy,issues:[],placements:[]};
 if(rects.length!==item.frames)row.issues.push('FRAME COUNT MISMATCH');
 if(!side.anatomy)row.issues.push('NO ANATOMICAL CALIBRATION');
 const cells=rects.map((r,k)=>{
  const head=side.anatomy?.sourceHeadPx[k],factor=head?side.anatomy.targetHeadPx/head:1;
  const placed=placeCharFrame(resample(crop(raw,r.x0,r.y0,r.x1-r.x0,r.y1-r.y0),factor,{coverage:0.5,alphaMin:128}),spec,side.frameOffsets?.[k]||[0,0]);
  row.placements.push({k,factor,clip:placed.clip,margin:placed.margin,lost:placed.lost});
  return placed.cell;
 });
 fs.copyFileSync(src,out+'/'+file);
 quantizeCopies(cells,48).forEach((cell,k)=>fs.writeFileSync(out+'/'+item.animation+'-'+k+'.png',encodePng(cell)));
 anims.push({name:item.animation,version:v,cells});records.push(row);
}
const decl=JSON.parse(fs.readFileSync(process.env.SASUKE_PALETTE_BEFORE ? root+'reference/neutral-builds-before-palette.json' : 'art/scale/builds.json')).fighters.sasuke;
const A=auditCharacter(anims,{decl,exempt:exemptionsFrom(manifest.characters.sasuke.animations),maxColors:48});
const compact=compactAudit(A);
const measured=measurementCells(anims,anims.find(a=>a.name==='idle'),48,decl);
for(const a of measured) for(let k=0;k<a.cells.length;k++){
 const c=a.cells[k],d=Uint8Array.from(c.data);
 for(let i=0;i<d.length;i+=4){if(d[i+3]<128)continue;const color=(d[i]<<16)|(d[i+1]<<8)|d[i+2];if(A.palette.head.has(color)){d[i]=255;d[i+1]=220;d[i+2]=0;}else{d[i]=40;d[i+1]=45;d[i+2]=55;}}
 fs.writeFileSync(out+'/'+a.name+'-mask-'+k+'.png',encodePng({w:c.w,h:c.h,data:d}));
}
fs.writeFileSync(out+'/audit.json',JSON.stringify({kind:'diagnostic candidate extraction; not successful production pack',records,scale:compact},null,2));
fs.writeFileSync(root+'reference/neutral-candidate-audit.json',JSON.stringify({records,scale:compact},null,2));
fs.copyFileSync(root+'reference/height_neutral.png',out+'/approved-neutral.png');
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const html='<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Sasuke neutral redraw — candidate QA</title><style>body{background:#161b27;color:#eee;font:16px system-ui;margin:24px}h1{font-size:25px}section{border-top:1px solid #556;padding:22px 0}.frames{display:flex;flex-wrap:wrap;gap:10px}.frame{background:#343b49}.frame img{width:256px;image-rendering:pixelated}.frame p{margin:6px}a{color:#acf}.raw{max-width:100%;max-height:250px;image-rendering:pixelated}.warn{color:#ffbd71}.ref{height:256px;image-rendering:pixelated}</style><h1>Sasuke: all 42 neutral redraw candidates</h1><p class="warn">NOT APPROVED. Diagnostic cells below use anatomical sidecars, not a successful production atlas. Strict pack failures remain blockers. Each source landmark is inferred under hair/clothing with stated uncertainty. Do not treat ref, exempt, or unmeasured as ok.</p><p>Approved neutral target: skeleton194.882px, inferred skull24.487px ±2.84px. Body and limb ratios require visual review separately from the hair probe.</p><img class="ref" src="approved-neutral.png"><p><a href="audit.json">Exact frame measurements and placements</a></p>'+
records.map(r=>{const a=compact.anims[r.name];return '<section id="'+r.name+'"><h2>'+r.name+' v'+String(r.version).padStart(2,'0')+' — '+a.verdict+'</h2><p>'+r.frames+' expected / '+r.detected+' detected. Head/idle '+Number(a.head).toFixed(3)+'. '+escape(r.anatomy?.note||'NO CALIBRATION')+'</p><div class="frames">'+r.placements.map(p=>'<div class="frame"><img src="'+r.name+'-'+p.k+'.png"><p>f'+p.k+' head '+Number(a.frames[p.k]).toFixed(3)+' '+escape(p.clip.join(', '))+'</p></div>').join('')+'</div><details><summary>Raw immutable source</summary><img class="raw" src="'+r.file+'"></details></section>';}).join('');
fs.writeFileSync(out+'/index.html',html);
console.log(records.map(r=>({name:r.name,count:r.detected,verdict:compact.anims[r.name].verdict,head:compact.anims[r.name].head,clips:r.placements.filter(p=>p.clip.length).map(p=>p.k+':'+p.clip)})));

