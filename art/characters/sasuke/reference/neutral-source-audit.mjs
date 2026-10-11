import fs from 'node:fs';
import {readPng,removeBackground,removeSpecks,splitStrip} from '../../../../tools/pack-sprites.mjs';
const root='art/characters/sasuke/raw/';
const inventory=JSON.parse(fs.readFileSync('art/characters/sasuke/reference/neutral-redraw-inventory.json'));
const rows=inventory.rows.map(r=>{
const files=fs.readdirSync(root).filter(f=>f.startsWith(r.animation+'_v')&&f.endsWith('.png')).sort((a,b)=>Number(a.match(/_v(\d+)/)[1])-Number(b.match(/_v(\d+)/)[1]));
const file=files.at(-1),im=readPng(root+file),width=im.w,height=im.h;
removeBackground(im,{tol:72,mode:'char'});removeSpecks(im);
const split=splitStrip(im,r.frames);
return {...r,file,width,height,rects:split.rects,splitCount:split.rects.length,hasAnatomy:fs.existsSync(root+file.replace('.png','.json'))&&!!JSON.parse(fs.readFileSync(root+file.replace('.png','.json'))).anatomy};
});
fs.writeFileSync('art/characters/sasuke/reference/neutral-source-audit.json',JSON.stringify(rows,null,2));
console.log(rows.map(r=>({anim:r.animation,file:r.file,size:r.width+'x'+r.height,count:r.splitCount,expected:r.frames,anatomy:r.hasAnatomy})));

