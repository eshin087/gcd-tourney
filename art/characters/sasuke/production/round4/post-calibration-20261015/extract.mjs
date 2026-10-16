import fs from 'node:fs';
import crypto from 'node:crypto';
import { PNG } from 'pngjs';
const dest='art/characters/sasuke/production/round4/post-calibration-20261015';
const sheet=PNG.sync.read(fs.readFileSync('public/characters/sasuke/sheet.png'));
const meta=JSON.parse(fs.readFileSync('public/characters/sasuke/anims.json'));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
let evidence={commit:'ffb6abfd94ed30ad1fac277f5b6833e7709b8e1b',hashes:{},frames:[]};
for(const p of ['public/characters/sasuke/sheet.png','public/characters/sasuke/anims.json','public/art-review/title-style-pilot/sasuke-neutral_v01.png','public/art-review/title-style-pilot/sasuke-combat_v01.png','art/characters/sasuke/reference/idle_approved.png',...['superDash_v07','jumpSquat_v06','beamFire_v07','dash_v07'].map(n=>'art/characters/sasuke/raw/'+n+'.png')]) evidence.hashes[p]=hash(p);
function enlarge(p,k){let q=new PNG({width:p.width*k,height:p.height*k});for(let y=0;y<q.height;y++)for(let x=0;x<q.width;x++){let a=(Math.floor(y/k)*p.width+Math.floor(x/k))*4,b=(y*q.width+x)*4;q.data.set(p.data.subarray(a,a+4),b);}return q;}
let tiles=[];
for(const n of ['idle','superDash','jumpSquat','beamFire','dash']) for(const [f,index] of meta.animations[n].frames.entries()) {if(n==='idle'&&f>0)continue;let p=new PNG({width:256,height:256});PNG.bitblt(sheet,p,index%16*256,Math.floor(index/16)*256,256,256,0,0);let xs=[],ys=[];for(let y=0;y<256;y++)for(let x=0;x<256;x++)if(p.data[(y*256+x)*4+3]){xs.push(x);ys.push(y);}const box=[Math.min(...xs),Math.min(...ys),Math.max(...xs),Math.max(...ys)];fs.writeFileSync(`${dest}/${n}-${f}.png`,PNG.sync.write(p));fs.writeFileSync(`${dest}/${n}-${f}-3x.png`,PNG.sync.write(enlarge(p,3)));evidence.frames.push({name:n,frame:f,index,bounds:box,margins:[box[0],box[1],255-box[2],255-box[3]],loop:meta.animations[n].loop,durations:meta.animations[n].durations});tiles.push(p);}
for(const n of ['neutral','combat']){let p=PNG.sync.read(fs.readFileSync(`public/art-review/title-style-pilot/sasuke-${n}_v01.png`));fs.writeFileSync(`${dest}/${n}-3x.png`,PNG.sync.write(enlarge(p,3)));}
let all=new PNG({width:256*3,height:256*3});tiles.forEach((p,i)=>PNG.bitblt(p,all,0,0,256,256,i%3*256,Math.floor(i/3)*256));fs.writeFileSync(`${dest}/all-2x.png`,PNG.sync.write(enlarge(all,2)));
fs.writeFileSync(`${dest}/provenance.json`,JSON.stringify(evidence,null,2)+'\n');console.log(JSON.stringify(evidence,null,2));
