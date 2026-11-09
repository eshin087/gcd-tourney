import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';

const base=process.cwd();
const out=path.join(base,'public/reviews/spell-fx-r2');

const assets=path.join(out,'assets');
fs.mkdirSync(assets,{recursive:true});
const oldRoot=path.join(base,'public/vfx');
const newRoot=path.join(base,'public/preview/vfx');
const oldMeta=JSON.parse(fs.readFileSync(path.join(oldRoot,'atlas.json'),'utf8'));
const newMeta=JSON.parse(fs.readFileSync(path.join(newRoot,'atlas.json'),'utf8'));

function read(file){return PNG.sync.read(fs.readFileSync(file));}
function pixel(img,x,y){const i=(y*img.width+x)*4;return [img.data[i],img.data[i+1],img.data[i+2],img.data[i+3]];}
function set(img,x,y,c){const i=(y*img.width+x)*4;img.data[i]=c[0];img.data[i+1]=c[1];img.data[i+2]=c[2];img.data[i+3]=c[3];}
function write(name,img){const file=path.join(assets,name);fs.writeFileSync(file,PNG.sync.write(img));return 'assets/'+name;}
function packed(root,meta,name,frame){
  const entry=meta.hd.effects[name];
  if(!entry)throw new Error('Missing packed effect '+name);
  const page=meta.hd.pages[entry.page];
  const img=read(path.join(root,page.image));
  const out=new PNG({width:256,height:256});
  const x0=frame*256,y0=entry.row*256;
  for(let y=0;y<256;y++)for(let x=0;x<256;x++)set(out,x,y,pixel(img,x0+x,y0+y));
  return out;
}
function strip(root,meta,name,count,file){
  const out=new PNG({width:count*256,height:256});
  for(let f=0;f<count;f++){
    const cell=packed(root,meta,name,f);
    for(let y=0;y<256;y++)for(let x=0;x<256;x++)set(out,f*256+x,y,pixel(cell,x,y));
  }
  return write(file,out);
}
function scale2(src){
  const out=new PNG({width:512,height:512});
  for(let y=0;y<512;y++)for(let x=0;x<512;x++)set(out,x,y,pixel(src,Math.floor(x/2),Math.floor(y/2)));
  return out;
}
function join(arm,fist){
  const out=new PNG({width:1250,height:256});
  for(let n=0;n<4;n++)for(let y=0;y<256;y++)for(let x=0;x<256;x++)set(out,n*256+x,y,pixel(arm,x,y));
  for(let y=0;y<256;y++)for(let x=0;x<256;x++){
    const c=pixel(fist,x,y);
    if(c[3])set(out,994+x,y,c);
  }
  return out;
}
function assemble(tiles){
  const out=new PNG({width:512,height:512});
  for(let q=0;q<4;q++)for(let y=0;y<256;y++)for(let x=0;x<256;x++)set(out,(q%2)*256+x,Math.floor(q/2)*256+y,pixel(tiles[q],x,y));
  return out;
}
function pair(left,right){
  const out=new PNG({width:1024,height:512});
  for(let y=0;y<512;y++)for(let x=0;x<512;x++){set(out,x,y,pixel(left,x,y));set(out,512+x,y,pixel(right,x,y));}
  return out;
}
const names=[];
for(const [name,count] of [['gigantArm',2],['gigantFist',4]]){
  names.push({name,oldStrip:strip(oldRoot,oldMeta,name,count,name+'_v01_packed.png'),newStrip:strip(newRoot,newMeta,name,count,name+'_v02_packed.png')});
}
const oldJoin=join(packed(oldRoot,oldMeta,'gigantArm',0),packed(oldRoot,oldMeta,'gigantFist',0));
const newJoin=join(packed(newRoot,newMeta,'gigantArm',0),packed(newRoot,newMeta,'gigantFist',0));
const oldJoinPath=write('gigantPistol_v01_joined.png',oldJoin);
const newJoinPath=write('gigantPistol_v02_joined.png',newJoin);
const voidRows=[];
for(let f=0;f<8;f++){
  const v01=scale2(packed(oldRoot,oldMeta,'voidShatter',f));
  const quad=assemble(['voidShatterTL','voidShatterTR','voidShatterBL','voidShatterBR'].map(n=>packed(newRoot,newMeta,n,f)));
  const file='voidShatter_compare_'+String(f).padStart(2,'0')+'.png';
  voidRows.push({frame:f,path:write(file,pair(v01,quad))});
}
const sections=[
'<!doctype html>',
'<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">',
'<title>ART-SPELL-R2 review</title>',
'<style>',
':root{color-scheme:dark;font:16px/1.5 system-ui,sans-serif;background:#10131a;color:#eef2f7}body{margin:0 auto;max-width:1200px;padding:32px 20px 64px}h1,h2{line-height:1.2}h1{font-size:2rem}h2{margin-top:2.5rem}p,li{color:#c3cbd7}.note{border-left:4px solid #61b9ff;padding:10px 14px;background:#1b2330}.grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}.card{background:#1a202a;border:1px solid #394353;border-radius:10px;padding:14px}.card img,.wide img{display:block;width:100%;height:auto;image-rendering:pixelated;background:#252b35;border-radius:5px}.wide{margin:16px 0;background:#1a202a;border:1px solid #394353;border-radius:10px;padding:14px}.frames{display:grid;grid-template-columns:1fr;gap:16px}.frame{background:#1a202a;border:1px solid #394353;border-radius:10px;padding:12px}.frame img{display:block;width:100%;height:auto;image-rendering:pixelated;background:#fff}.label{font-weight:700}.small{font-size:.9rem;color:#aab5c3}code{color:#a6dcff}a{color:#8fd0ff}@media(max-width:700px){.grid{grid-template-columns:1fr}body{padding:22px 12px}}</style>',
'</head><body>',
'<h1>Spell effects round 2 — image review</h1>',
'<p class="note"><strong>All six assets are candidates awaiting your review.</strong> Relay spells #6 selected the current Codex model for generation this round only; that was not image approval. v01 remains the approved/active version until you approve a replacement. The images below are extracted from the candidate and production packed atlases.</p>',
'<p>HD VFX cells are 256×256 at 112 px per world unit. Art was keyed to exact magenta for raw sheets, reduced to hard palettes, then packed. Candidate pack: 114 effects / 729 frames / 9 HD pages; the 3 warnings are existing unrelated streamBolt, streamFlame, and gumArm notes.</p>',
'<h2 id="gigantArm">Luffy — gigantArm v02 + gigantFist v02</h2>',
'<p>Joined view repeats the packed 256px arm cell four times and places the packed fist so the wrist cut lands exactly on the arm edge. This shows the stretch at four fist lengths. v01 on the left comes from the approved production atlas; v02 on the right comes from the candidate atlas.</p>',
'<div class="grid">',
'<div class="card"><div class="label">Approved v01, packed</div><img src="'+oldJoinPath+'" alt="Approved gigantArm and gigantFist v01 joined at four arm lengths"><p class="small">Source frames: gigantArm 0, gigantFist 0. Production atlas.</p></div>',
'<div class="card"><div class="label">Candidate v02, packed</div><img src="'+newJoinPath+'" alt="Candidate gigantArm and gigantFist v02 joined at four arm lengths"><p class="small">Source frames: gigantArm 0, gigantFist 0. Candidate atlas.</p></div>',
'</div>',
'<div class="grid">',
'<div class="card"><div class="label">gigantArm v01 packed frames</div><img src="'+names[0].oldStrip+'" alt="gigantArm v01 packed frames"><p class="small">2 frames, 60 ms loop, tiled.</p></div>',
'<div class="card"><div class="label">gigantArm v02 packed frames</div><img src="'+names[0].newStrip+'" alt="gigantArm v02 packed frames"><p class="small">2 frames, 60 ms loop, 170px tube thickness, repeated row profile.</p></div>',
'<div class="card"><div class="label">gigantFist v01 packed frames</div><img src="'+names[1].oldStrip+'" alt="gigantFist v01 packed frames"><p class="small">4 frames, 40 ms loop.</p></div>',
'<div class="card"><div class="label">gigantFist v02 packed frames</div><img src="'+names[1].newStrip+'" alt="gigantFist v02 packed frames"><p class="small">4 frames, 40 ms loop; 220px fist body, exact 170px wrist stub, 15-color palette.</p></div>',
'</div>',
'<h2 id="voidShatterTL">Gojo — Domain exit in four 256px tiles</h2>',
'<p>Each row compares the approved single-cell v01 enlarged 2× with the candidate four-tile composition assembled from the actual packed TL/TR/BL/BR frames. Each comparison is 512×512 on both sides; frame number and 50 ms timing are preserved.</p>',
'<div class="frames">'
];
for(const row of voidRows)sections.push('<div class="frame"><div class="label">Frame '+String(row.frame).padStart(2,'0')+' — approved single-cell v01 left · four-tile candidate v01 right</div><img src="'+row.path+'" alt="Void shatter frame '+row.frame+': approved v01 and assembled candidate tiles side by side"></div>');
sections.push('</div>');
sections.push('<h2>Review status</h2><p>The six candidates are queued in the repository review records, and their generated call paths and hashes are preserved in the R2 production inventory. Visual approval remains separate from runtime integration and engine checks, which Claude owns after approval.</p>');
sections.push('</body></html>');
const htmlPath=path.join(out,'index.html');
fs.writeFileSync(htmlPath,sections.join('\n')+'\n');
console.log(JSON.stringify({review:htmlPath,assets:names,voidFrames:voidRows.length,armJoinWidth:oldJoin.width,voidCompareSize:'1024x512 per frame'},null,2));

