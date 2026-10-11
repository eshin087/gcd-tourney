import fs from 'node:fs';
import {readPng,removeBackground,splitStrip,crop,newImage,blit,encodePng,resample} from '../../../../tools/pack-sprites.mjs';
const G=Function('return '+fs.readFileSync('tools/scale-audit.mjs','utf8').match(/const GLYPHS = (\{[\s\S]*?\n\});/)[1])();
function text(im,s,x,y){for(const c of s.toUpperCase()){let g=G[c]||G['?'];for(let r=0;r<5;r++)for(let q=0;q<3;q++)if(g[r*3+q]==='1')for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++)im.data.set([255,255,255,255],((y+r*2+dy)*im.w+x+q*2+dx)*4);x+=8;}}
const base='art/characters/killua/';
let out=newImage(1800,1150);for(let i=0;i<out.data.length;i+=4)out.data.set([30,35,43,255],i);
let sources=[["NEUTRAL","reference/height_neutral.png",1,0.8],["specialDown_v03","raw/specialDown_v03.png",4,0.65],["superPose_v06","raw/superPose_v06.png",4,0.65]];
let records=[];
for(let k=0;k<sources.length;k++){let [label,file,n,factor]=sources[k],raw=readPng(base+file);removeBackground(raw);let rect=splitStrip(raw,n).rects[0],sprite=crop(raw,rect.x0,rect.y0,rect.x1-rect.x0+1,rect.y1-rect.y0+1),scaled=resample(sprite,factor);let x=k*600+60,y=60;blit(out,scaled,x,y);text(out,label,k*600+20,20);for(let yy=0;yy<sprite.h;yy+=25){let sy=y+Math.round(yy*factor);text(out,String(rect.y0+yy),k*600+6,sy);for(let xx=x;xx<x+scaled.w;xx++){let p=(sy*out.w+xx)*4;if(out.data[p+3]&&out.data[p]<80){out.data[p]=70;out.data[p+1]=90;out.data[p+2]=100;}}}records.push({label,file,rect,factor});}
fs.writeFileSync(base+'production/correction-board-02.png',encodePng(out));fs.writeFileSync(base+'production/correction-board-02.json',JSON.stringify(records,null,2));console.log(records);



