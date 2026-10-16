import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {readPng,encodePng,newImage,blit,removeBackground,removeSpecks,dropStrays,figureSplit,resample,placeCharFrame,quantizeFrames,bbox} from '../../../../../tools/pack-sprites.mjs';
const root='art/characters/luffy';
const out=path.join(root,'production/relay8-generation/diagnostic-atlas');fs.mkdirSync(out,{recursive:true});
const spec={frameWidth:256,frameHeight:256,cellMargin:4,pivot:[128,240],pixelsPerUnit:128,standingBodyPx:200};
function clean(file,n){let im=readPng(file);removeBackground(im,{tol:72,mode:'char'});removeSpecks(im);dropStrays(im);const figs=figureSplit(im,n);if(!figs||figs.length!==n)throw Error(`${file}: expected ${n} separated figures, got ${figs?.length}`);return figs}
function pack(files,expected,bh,name){const figs=clean(files,expected);const maxH=Math.max(...figs.map(x=>bbox(x).h)),scale=bh/maxH;const cells=figs.map((f,i)=>{const s=resample(f,scale);const p=placeCharFrame(s,spec,null,null);if(p.lost||p.clip.length)throw Error(`${name} f${i}: ${JSON.stringify(p.clip)} lost=${p.lost}`);return p.cell});return {cells,sourceScale:scale,sourceFrames:figs.map(f=>bbox(f))}}
const down=pack(path.join(root,'raw/_rejected/down_v02.png'),2,96,'down');
const getup=pack(path.join(root,'raw/_rejected/getup_v02.png'),5,190,'getup');
const cells=[...down.cells,...getup.cells];const quantColors=quantizeFrames(cells,48);
const atlas=newImage(256*cells.length,256);for(let i=0;i<cells.length;i++)blit(atlas,cells[i],i*256,0);
const png=encodePng(atlas);fs.writeFileSync(path.join(out,'sheet.png'),png);
const records=[];let idx=0;for(const [anim,o] of [['down',down],['getup',getup]])for(let f=0;f<o.cells.length;f++,idx++){const b=bbox(o.cells[f]);records.push({anim,frame:f,index:idx,bodyHeight:anim==='down'?96:190,durationMs:anim==='down'?[80,420][f]:[70,60,60,80,70][f],bounds:[b.x0,b.y0,b.x1,b.y1]})}
const meta={diagnosticOnly:true,notGameplayAtlas:true,reason:'Historical diagnostic fixture. Its superseded source candidates now live in raw/_rejected/; no manualQA/pass or approval is implied.',cell:[256,256],pivot:[128,240],quantize:48,quantizeColorCount:quantColors,atlas:{path:'sheet.png',sha256:crypto.createHash('sha256').update(png).digest('hex'),size:[atlas.w,atlas.h]},source:{down:{candidate:'art/characters/luffy/raw/_rejected/down_v02.png',sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'raw/_rejected/down_v02.png'))).digest('hex'),sourceScale:down.sourceScale,boxes:down.sourceFrames},getup:{candidate:'art/characters/luffy/raw/_rejected/getup_v02.png',sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'raw/_rejected/getup_v02.png'))).digest('hex'),sourceScale:getup.sourceScale,boxes:getup.sourceFrames}},frames:records};
fs.writeFileSync(path.join(out,'anims.json'),JSON.stringify(meta,null,2)+'\n');
const index={animations:{down:{frames:records.filter(x=>x.anim==='down').map(x=>({index:x.index,ms:x.durationMs}))},getup:{frames:records.filter(x=>x.anim==='getup').map(x=>({index:x.index,ms:x.durationMs}))}},atlas:meta.atlas};fs.writeFileSync(path.join(out,'contacts-index.json'),JSON.stringify(index,null,2)+'\n');
for(let i=0;i<cells.length;i++)fs.writeFileSync(path.join(out,`${records[i].anim}-${records[i].frame}.png`),encodePng(cells[i]));
console.log(JSON.stringify({atlas:meta.atlas,metadataSha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(out,'anims.json'))).digest('hex'),quantColors,sourceScales:{down:down.sourceScale,getup:getup.sourceScale},records},null,2));
