import fs from 'node:fs';
import crypto from 'node:crypto';
import {pathToFileURL} from 'node:url';
const main='C:/Users/eshin/Desktop/Claude Code/gcdTourney/';
const P=await import(pathToFileURL(main+'tools/pack-sprites.mjs'));
const Q=await import(pathToFileURL(main+'tools/scale-probe.mjs'));
const {loadPacked}=await import(pathToFileURL(main+'tools/scale-audit.mjs'));
const base='art/characters/killua/', anim=process.argv[2]||'light1', ver=process.argv[3]||'v04';
const spec={frameWidth:256,frameHeight:256,pivot:[128,240],cellMargin:4};
const packed=loadPacked('killua','public'), idle=packed.anims.find(a=>a.name==='idle');
const idleCells=Q.countColors(idle.cells)>48?Q.quantizeCopies(idle.cells,48):idle.cells;
const decl=JSON.parse(fs.readFileSync('art/scale/builds.json')).fighters.killua;
const pal=Q.palettesFromIdle(idleCells,decl), ref=Q.makeReference(idleCells,pal);
const m=JSON.parse(fs.readFileSync('art/manifest.json')), bodyHeight=m.characters.killua.animations[anim].bodyHeight??m.animationDefaults[anim].bodyHeight??204;
const hash=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const parts=['A','B'].map(name=>{let file=base+'raw/_parts/'+anim+'_'+ver+'_'+name+'.png',im=P.readPng(file);P.removeBackground(im,{tol:72,mode:'char'});P.removeSpecks(im,{frac:.0015,min:4});let poses=P.splitStrip(im,0,{split:'auto',mode:'char'}).rects.map(r=>{let p=P.crop(im,r.x0,r.y0,r.x1-r.x0,r.y1-r.y0),b=P.bbox(p);return P.crop(p,b.x0,b.y0,b.w,b.h);});return{name,file,hash:hash(file),poses};});
let rows=[], result={anim,ver,bodyHeight,publicIdleSource:JSON.parse(fs.readFileSync(base+'frames/idle/.packer.json')),sheetSHA256:hash('public/characters/killua/sheet.png'),ref,parts:[]};
function measure(part,scale,label){let placed=part.poses.map(p=>P.placeCharFrame(P.resample(p,scale,{coverage:.5,alphaMin:128}),spec)),cells=Q.snapToPalette(placed.map(p=>p.cell),idleCells),frames=cells.map((c,k)=>({k,raw:[part.poses[k].w,part.poses[k].h],scaled:[Math.round(part.poses[k].w*scale),Math.round(part.poses[k].h*scale)],lost:placed[k].lost,clip:placed[k].clip,...Q.measureFrame(c,ref,pal)}));rows.push({part:part.name,label,scale,cells,frames});return{scale,head:Q.median(frames.map(f=>f.head)),frames};}
for(const part of parts){let s=bodyHeight/Math.max(...part.poses.map(p=>p.h)),a=measure(part,s,'trial'),b=measure(part,s/a.head,'refined'),f=s/a.head/b.head,c=measure(part,f,'final');result.parts.push({name:part.name,file:part.file,hash:part.hash,trial:a,refined:b,final:c});}
const board=P.newImage(4*256,rows.length*256);for(let i=0;i<board.data.length;i+=4)board.data.set([28,32,40,255],i);
for(let r=0;r<rows.length;r++)for(let k=0;k<rows[r].cells.length;k++){P.blit(board,rows[r].cells[k],k*256,r*256);let box=rows[r].frames[k].box;if(!box)continue;let b={x0:box[0],y0:box[1],x1:box[2],y1:box[3]};for(let y=b.y0;y<=b.y1;y++)for(let x=b.x0;x<=b.x1;x++)if(x===b.x0||x===b.x1||y===b.y0||y===b.y1){let at=((r*256+y)*board.w+k*256+x)*4;board.data.set([255,60,60,255],at);}}
fs.writeFileSync(base+'production/'+anim+'-'+ver+'-stitch-roi.json',JSON.stringify(result,null,2));fs.writeFileSync(base+'production/'+anim+'-'+ver+'-stitch-roi.png',P.encodePng(board));console.log(JSON.stringify(result.parts.map(p=>({part:p.name,trial:p.trial.frames,refined:p.refined.frames,final:p.final.frames})),null,2));

