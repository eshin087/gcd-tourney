import fs from 'node:fs';
import {readPng,removeBackground,removeSpecks,splitStrip,crop,newImage,blit,encodePng,resample} from '../../../../tools/pack-sprites.mjs';
const base='art/characters/killua/', inv=JSON.parse(fs.readFileSync(base+'production/full-redraw-inventory.json'));
const G=Function('return '+fs.readFileSync('tools/scale-audit.mjs','utf8').match(/const GLYPHS = (\{[\s\S]*?\n\});/)[1])();
function text(im,s,x,y){for(const c of s.toUpperCase()){const g=G[c]||G['?'];for(let r=0;r<5;r++)for(let q=0;q<3;q++)if(g[r*3+q]==='1')for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++)im.data.set([255,255,255,255],((y+r*2+dy)*im.w+x+q*2+dx)*4);x+=8;}}
fs.mkdirSync(base+'production/full-redraw-contacts',{recursive:true});const records=[];
for(const a of inv){let version=a.name==='run'?6:a.version,file='raw/'+a.name+'_v'+String(version).padStart(2,'0')+'.png',im=readPng(base+file);removeBackground(im);removeSpecks(im);let {rects,notes}=splitStrip(im,a.frames),board=newImage(Math.min(4,rects.length)*440,Math.ceil(rects.length/4)*440);for(let z=0;z<board.data.length;z+=4)board.data.set([30,35,43,255],z);
for(let f=0;f<rects.length;f++){const r=rects[f],frame=crop(im,r.x0,r.y0,r.x1-r.x0+1,r.y1-r.y0+1),factor=Math.min(.5,400/frame.w,380/frame.h),show=resample(frame,factor),x=f%4*440+20,y=Math.floor(f/4)*440+40;blit(board,show,x,y);text(board,a.name+' V'+version+' F'+f,x,y-25);text(board,frame.w+'X'+frame.h+' S'+factor.toFixed(2),x,y+390);records.push({animation:a.name,version,frame:f,source:file,sourceBounds:r,displayFactor:factor,skullLandmarks:null,limbLandmarks:null,verdict:'pending-direct-neutral-landmark-audit',uncertainty:'Hidden skull and clothing joints require visual annotation; no automatic pass.'});}
fs.writeFileSync(base+'production/full-redraw-contacts/'+a.name+'.png',encodePng(board));if(rects.length!==a.frames)console.log(a.name,rects.length,a.frames,notes);
}
fs.writeFileSync(base+'production/full-redraw-per-frame.json',JSON.stringify(records,null,2));console.log(records.length+' extracted frames; pending annotation, not audited passes');
