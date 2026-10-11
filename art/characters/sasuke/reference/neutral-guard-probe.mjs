import fs from 'node:fs';
import {readPng,removeBackground,removeSpecks,splitStrip,crop,resample,placeCharFrame,encodePng} from '../../../../tools/pack-sprites.mjs';
import {palettesFromIdle,makeReference,measureFrame,snapToPalette} from '../../../../tools/scale-probe.mjs';
const atlas=readPng('public/characters/sasuke/sheet.png'); const idle=Array.from({length:8},(_,i)=>crop(atlas,i*256,0,256,256));
const raw=readPng('art/characters/sasuke/raw/guard_v02.png');removeBackground(raw,{tol:72,mode:'char'});removeSpecks(raw);
const spec={frameWidth:256,frameHeight:256,pivot:[128,240],cellMargin:4};
let cells=splitStrip(raw,2).rects.map(r=>placeCharFrame(resample(crop(raw,r.x0,r.y0,r.x1-r.x0,r.y1-r.y0),24.48673197462748/106),spec).cell);
const d=JSON.parse(fs.readFileSync('art/scale/scale-report.json')).fighters.sasuke.palette; const p={head:new Set(d.head.map(x=>parseInt(x.slice(1),16))),feet:new Set()};cells=snapToPalette(cells,idle);const ref=makeReference(idle,p);const records=cells.map(c=>measureFrame(c,ref,p));
cells.forEach((c,i)=>fs.writeFileSync(`art/characters/sasuke/reference/neutral-guard-probe-${i}.png`,encodePng(c)));
fs.writeFileSync('art/characters/sasuke/reference/neutral-guard-probe.json',JSON.stringify({ref,records},null,2));console.log({ref,records});

