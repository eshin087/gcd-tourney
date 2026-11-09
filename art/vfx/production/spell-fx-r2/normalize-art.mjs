import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { PNG } from 'pngjs';

const cwd = process.cwd();
const inv = path.join(cwd, 'art/vfx/production/spell-fx-r2');
const raw = path.join(cwd, 'art/vfx/raw');
const framesRoot = path.join(cwd, 'art/vfx/frames');
const sourceFiles = {
  arm: path.join(inv, 'attempts/gigantArm_v02_call01.png'),
  fist: path.join(inv, 'attempts/gigantFist_v02_call01.png'),
  shatterA: path.join(inv, 'attempts/voidShatter_v01_call01_frames00-03.png'),
  shatterB: path.join(inv, 'attempts/voidShatter_v01_call02_frames04-07.png')
};
const generatedBase = 'E:\\Vibe Coding\\.codex\\generated_images\\01a1bdc7-fdf1-7c93-9506-03dc751cd9de\\';
const armPalette = ['#FF00FF','#492610','#ffd7a8','#fcc081','#fbba79','#f9b171','#dc8440','#c97c45','#a8622e','#f8e8d1'];
const fistPalette = ['#FF00FF','#492610','#74391d','#a8622e','#c97c45','#dc8440','#f9b171','#fbba79','#fcc081','#ffd7a8','#f8e8d1','#f4a257','#e9954d','#6b3218','#9d5124'];
const voidPalette = ['#FF00FF','#000000','#05040c','#120c30','#2a1e78','#5a6ce0','#8fc8ff','#bfe6ff','#e8f8ff','#ffffff'];

function rgb(hex) { const s=hex.slice(1); return [parseInt(s.slice(0,2),16),parseInt(s.slice(2,4),16),parseInt(s.slice(4,6),16)]; }
function isMagenta(r,g,b) { return r>=220 && b>=220 && g<=85; }
function idx(img,x,y) { return (y*img.width+x)*4; }
function get(img,x,y) { const i=idx(img,x,y); return [img.data[i],img.data[i+1],img.data[i+2],img.data[i+3]]; }
function set(img,x,y,r,g,b,a=255) { const i=idx(img,x,y); img.data[i]=r; img.data[i+1]=g; img.data[i+2]=b; img.data[i+3]=a; }
function nearest(r,g,b,palette) {
  let best=palette[0],d0=Infinity;
  for (const h of palette) { const [pr,pg,pb]=rgb(h); const d=(r-pr)**2+(g-pg)**2+(b-pb)**2; if(d<d0){best=h;d0=d;} }
  return rgb(best);
}
function read(f) { return PNG.sync.read(fs.readFileSync(f)); }
function writeNew(f,img) {
  if(fs.existsSync(f)) throw new Error('Refusing to overwrite: '+path.relative(cwd,f));
  fs.mkdirSync(path.dirname(f),{recursive:true}); fs.writeFileSync(f,PNG.sync.write(img));
}
function writeJsonNew(f,v) {
  if(fs.existsSync(f)) throw new Error('Refusing to overwrite: '+path.relative(cwd,f));
  fs.mkdirSync(path.dirname(f),{recursive:true}); fs.writeFileSync(f,JSON.stringify(v,null,2)+'\n');
}
function sha(f) { return crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex'); }
function cropPanel(img,n) {
  if(img.width!==1254 || img.height!==1254) throw new Error('Expected 1254x1254 contact sheet: '+img.width+'x'+img.height);
  const col=n%2,row=Math.floor(n/2),x0=col?629:0,y0=row?629:0,w=625,h=625,out=new PNG({width:w,height:h});
  for(let y=0;y<h;y++) for(let x=0;x<w;x++) set(out,x,y,...get(img,x0+x,y0+y));
  return out;
}
function resize(src,w,h) {
  const out=new PNG({width:w,height:h});
  for(let y=0;y<h;y++) for(let x=0;x<w;x++) {
    const sx=Math.min(src.width-1,Math.floor((x+0.5)*src.width/w));
    const sy=Math.min(src.height-1,Math.floor((y+0.5)*src.height/h));
    set(out,x,y,...get(src,sx,sy));
  }
  return out;
}
function paletteMap(img,palette) {
  const pink=rgb('#FF00FF');
  for(let y=0;y<img.height;y++) for(let x=0;x<img.width;x++) {
    const [r,g,b,a]=get(img,x,y);
    set(img,x,y,...(isMagenta(r,g,b)?pink:nearest(r,g,b,palette)),a);
  }
  return img;
}
function colors(img) {
  const s=new Set();
  for(let i=0;i<img.data.length;i+=4) if(img.data[i+3]) s.add('#'+[img.data[i],img.data[i+1],img.data[i+2]].map(v=>v.toString(16).padStart(2,'0')).join(''));
  return [...s].sort();
}
function compose(fs0) {
  const out=new PNG({width:256*fs0.length,height:256});
  fs0.forEach((f,j)=>{for(let y=0;y<256;y++)for(let x=0;x<256;x++)set(out,j*256+x,y,...get(f,x,y));});
  return out;
}
function pinkFrame() {
  const out=new PNG({width:256,height:256}),c=rgb('#FF00FF');
  for(let y=0;y<256;y++)for(let x=0;x<256;x++)set(out,x,y,...c);
  return out;
}
function armProfile(sheet) {
  const f=cropPanel(sheet,0),x=Math.floor(f.width/2),runs=[];
  let start=-1;
  for(let y=0;y<f.height;y++){
    const [r,g,b]=get(f,x,y),on=!isMagenta(r,g,b);
    if(on&&start<0)start=y;
    if(!on&&start>=0){runs.push([start,y-1]);start=-1;}
  }
  if(start>=0)runs.push([start,f.height-1]);
  runs.sort((a,b)=>(b[1]-b[0])-(a[1]-a[0]));
  const [top,bottom]=runs[0]||[];
  if(!Number.isInteger(top)||bottom-top<100)throw new Error('Could not detect the arm tube profile.');
  const rows=[];
  for(let i=0;i<170;i++){
    const sy=top+Math.min(bottom-top,Math.floor((i+0.5)*(bottom-top+1)/170));
    const [r,g,b]=get(f,x,sy); rows.push(nearest(r,g,b,armPalette));
  }
  const outline=rgb('#492610');
  rows[0]=rows[1]=rows[2]=outline; rows[167]=rows[168]=rows[169]=outline;
  return rows;
}
function armFrame(profile,speed) {
  const out=pinkFrame();
  for(let i=0;i<170;i++)for(let x=0;x<256;x++)set(out,x,43+i,...profile[i]);
  if(speed){const pale=rgb('#f8e8d1');for(const y0 of [29,224])for(let y=y0;y<y0+3;y++)for(let x=0;x<256;x++)set(out,x,y,...pale);}
  return out;
}
function fistFrames(sheet,profile) {
  const out=[];
  for(let n=0;n<4;n++){
    const f=paletteMap(resize(cropPanel(sheet,n),256,256),fistPalette),frame=pinkFrame();
    for(let y=0;y<256;y++)for(let x=0;x<256;x++)set(frame,x,y,...get(f,x,y));
    for(let y=43;y<=212;y++)for(let x=30;x<=78;x++)set(frame,x,y,...profile[y-43]);
    const cut=rgb('#492610');for(let y=43;y<=212;y++)for(let x=30;x<=32;x++)set(frame,x,y,...cut);
    out.push(frame);
  }
  return out;
}
function fullShatter(sourceFile,panel,n) {
  const f=paletteMap(resize(cropPanel(read(sourceFile),panel),512,512),voidPalette);
  if(n<=2)for(let y=0;y<512;y++)for(let x=0;x<512;x++){const [r,g,b,a]=get(f,x,y);if(isMagenta(r,g,b))set(f,x,y,0,0,0,a);}
  if(n===0)for(let y=0;y<512;y++)for(let x=0;x<512;x++)set(f,x,y,0,0,0);
  return f;
}
function quadrant(f,q) {
  const x0=q%2?256:0,y0=q>=2?256:0,out=new PNG({width:256,height:256});
  for(let y=0;y<256;y++)for(let x=0;x<256;x++){
    const [r,g,b]=get(f,x0+x,y0+y);set(out,x,y,r,g,b,isMagenta(r,g,b)?0:255);
  }
  return out;
}
for(const f of Object.values(sourceFiles))if(!fs.existsSync(f))throw new Error('Missing source: '+f);

const aSheet=read(sourceFiles.arm),profile=armProfile(aSheet);
const arm=compose([armFrame(profile,false),armFrame(profile,true)]);
const armPath=path.join(raw,'gigantArm_v02.png');writeNew(armPath,arm);
writeJsonNew(path.join(raw,'gigantArm_v02.json'),{split:'even',frames:2});
writeJsonNew(path.join(raw,'gigantArm_v02.provenance.json'),{
  asset:'art/vfx/raw/gigantArm_v02.png',brief:'ART-SPELL-R2 section 3 G1',generationTool:'built-in image_gen',
  modelDecision:'USER DECISION via Claude relay spells #6: current model for ART-SPELL-R2 only; not image approval',
  source:'art/vfx/production/spell-fx-r2/attempts/gigantArm_v02_call01.png',sourceSha256:sha(sourceFiles.arm),
  generatedImagePath:generatedBase+'exec-07612b0b-5dcb-4058-b043-0bbfe481f7c7.png',
  processing:'Upper-left tube profile repeated identically in every column; mapped to specified hard palette, exact y=43-212 thickness, forced 3px top/bottom outlines, and exact f1 speed lines.',
  outputSha256:sha(armPath)
});

const fist=compose(fistFrames(read(sourceFiles.fist),profile));
const fistPath=path.join(raw,'gigantFist_v02.png');writeNew(fistPath,fist);
writeJsonNew(path.join(raw,'gigantFist_v02.json'),{split:'even',frames:4});
writeJsonNew(path.join(raw,'gigantFist_v02.provenance.json'),{
  asset:'art/vfx/raw/gigantFist_v02.png',brief:'ART-SPELL-R2 section 3 G2',generationTool:'built-in image_gen',
  modelDecision:'USER DECISION via Claude relay spells #6: current model for ART-SPELL-R2 only; not image approval',
  source:'art/vfx/production/spell-fx-r2/attempts/gigantFist_v02_call01.png',sourceSha256:sha(sourceFiles.fist),
  generatedImagePath:generatedBase+'exec-593ff77f-45ef-4733-a847-d2e48b95dd46.png',
  processing:'Four contact-sheet frames reduced with nearest-neighbor to 256px and mapped to a 15-color hard palette; exposed wrist x=30-78 receives the exact arm profile and flat 3px left cut.',
  outputSha256:sha(fistPath)
});

const full=[];
for(let n=0;n<8;n++){
  const f=fullShatter(n<4?sourceFiles.shatterA:sourceFiles.shatterB,n%4,n);
  writeNew(path.join(inv,'source-512/voidShatter_full_'+String(n).padStart(2,'0')+'.png'),f);
  full.push(f);
}
const names=['voidShatterTL','voidShatterTR','voidShatterBL','voidShatterBR'],tiles=names.map(()=>[]);
for(let n=0;n<8;n++)for(let q=0;q<4;q++)tiles[q].push(quadrant(full[n],q));
const sourceRecords=[
  {frames:'00-03',path:'art/vfx/production/spell-fx-r2/attempts/voidShatter_v01_call01_frames00-03.png',sha256:sha(sourceFiles.shatterA),generatedImagePath:generatedBase+'exec-faf049e3-bc35-4ca4-9d98-ae5d1cbd0138.png'},
  {frames:'04-07',path:'art/vfx/production/spell-fx-r2/attempts/voidShatter_v01_call02_frames04-07.png',sha256:sha(sourceFiles.shatterB),generatedImagePath:generatedBase+'exec-af1cfc75-7595-4b72-8844-119b80d06be6.png'}
];
for(let q=0;q<4;q++){
  const name=names[q],opaque=tiles[q].map(t=>{
    const f=new PNG({width:256,height:256});
    for(let y=0;y<256;y++)for(let x=0;x<256;x++){const [r,g,b,a]=get(t,x,y);set(f,x,y,r,g,b,isMagenta(r,g,b)?255:a);}
    return f;
  });
  const strip=compose(opaque),stripPath=path.join(raw,name+'_v01.png');
  writeNew(stripPath,strip);writeJsonNew(path.join(raw,name+'_v01.json'),{split:'even',frames:8});
  const frameDir=path.join(framesRoot,name);fs.mkdirSync(frameDir);
  for(let n=0;n<8;n++)writeNew(path.join(frameDir,name+'_'+String(n).padStart(2,'0')+'.png'),tiles[q][n]);
  writeJsonNew(path.join(raw,name+'_v01.provenance.json'),{
    asset:'art/vfx/raw/'+name+'_v01.png',brief:'ART-SPELL-R2 section 3 V1',generationTool:'built-in image_gen',
    modelDecision:'USER DECISION via Claude relay spells #6: current model for ART-SPELL-R2 only; not image approval',
    sourceSheets:sourceRecords,
    processing:'Each 2x2 panel cropped and nearest-neighbor resized to 512x512; frames 00-02 retain opaque black pane across magenta gaps; each full frame cut at (256,256) into four exact 256x256 quadrants. Raw strips keep opaque magenta; exact tile frame PNGs key magenta to alpha.',
    outputSha256:sha(stripPath)
  });
}
function summary(f){return {width:f.width,height:f.height,colorCount:colors(f).length};}
console.log(JSON.stringify({
  arm:summary(arm),fist:summary(fist),
  fullFrames:full.map((f,n)=>({frame:n,width:f.width,height:f.height,colorCount:colors(f).length})),
  tileFrames:names.map((name,q)=>({name,count:tiles[q].length,all256:tiles[q].every(f=>f.width===256&&f.height===256),maxPalette:Math.max(...tiles[q].map(f=>colors(f).length))}))
},null,2));
