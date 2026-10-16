import fs from 'node:fs';
import { PNG } from 'pngjs';
const d='art/characters/sasuke/production/targeted-repairs/jumpSquat-v07-astra';
const paths=[d+'/cell.png','art/characters/sasuke/production/round4/post-calibration-20261015/jumpSquat-0.png','art/characters/sasuke/production/round4/post-calibration-20261015/idle-0.png','public/art-review/title-style-pilot/sasuke-neutral_v01.png','public/art-review/title-style-pilot/sasuke-combat_v01.png'];
let all=new PNG({width:256*5,height:256});
for(let i=0;i<paths.length;i++){let p=PNG.sync.read(fs.readFileSync(paths[i]));PNG.bitblt(p,all,0,0,256,256,i*256,0);}
let q=new PNG({width:all.width*3,height:all.height*3});for(let y=0;y<q.height;y++)for(let x=0;x<q.width;x++)q.data.set(all.data.subarray((Math.floor(y/3)*all.width+Math.floor(x/3))*4,(Math.floor(y/3)*all.width+Math.floor(x/3))*4+4),(y*q.width+x)*4);
fs.writeFileSync(d+'/comparison-3x.png',PNG.sync.write(q));
let p=PNG.sync.read(fs.readFileSync(paths[0]));let g=new PNG({width:768,height:768});for(let y=0;y<768;y++)for(let x=0;x<768;x++){let a=(Math.floor(y/3)*256+Math.floor(x/3))*4,b=(y*768+x)*4;g.data.set(p.data.subarray(a,a+4),b);if(x%30===0||y%30===0){g.data[b]=80;g.data[b+1]=80;g.data[b+2]=80;g.data[b+3]=150;}}
fs.writeFileSync(d+'/grid-3x.png',PNG.sync.write(g));
