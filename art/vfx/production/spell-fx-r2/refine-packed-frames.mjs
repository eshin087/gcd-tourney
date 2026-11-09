import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';

const root=process.cwd();
function read(p){return PNG.sync.read(fs.readFileSync(p));}
function write(p,img){fs.writeFileSync(p,PNG.sync.write(img));}
function get(img,x,y){const i=(y*img.width+x)*4;return [img.data[i],img.data[i+1],img.data[i+2],img.data[i+3]];}
function set(img,x,y,c){const i=(y*img.width+x)*4;img.data[i]=c[0];img.data[i+1]=c[1];img.data[i+2]=c[2];img.data[i+3]=c[3];}
function extract(strip,n){
  const out=new PNG({width:256,height:256});
  for(let y=0;y<256;y++)for(let x=0;x<256;x++)set(out,x,y,get(strip,n*256+x,y));
  return out;
}
function keyMagenta(img){
  for(let y=0;y<256;y++)for(let x=0;x<256;x++){
    const c=get(img,x,y);if(c[0]===255&&c[1]===0&&c[2]===255)c[3]=0;set(img,x,y,c);
  }
  return img;
}
function bodyBounds(img){
  let min=256,max=-1;
  for(let y=0;y<256;y++)for(let x=79;x<256;x++){
    const [r,g,b]=get(img,x,y);
    if(r===255&&g===0&&b===255)continue;
    if(r===248&&g===232&&b===209)continue;
    min=Math.min(min,y);max=Math.max(max,y);
  }
  return {top:min,bottom:max,height:max-min+1};
}
const armRaw=read(path.join(root,'art/vfx/raw/gigantArm_v02.png'));
const armDir=path.join(root,'art/vfx/frames/gigantArm');
for(let n=0;n<2;n++)write(path.join(armDir,'gigantArm_'+String(n).padStart(2,'0')+'.png'),keyMagenta(extract(armRaw,n)));

const fistRaw=read(path.join(root,'art/vfx/raw/gigantFist_v02.png'));
const fistDir=path.join(root,'art/vfx/frames/gigantFist');
const source=extract(fistRaw,0),bounds=bodyBounds(source),scale=220/bounds.height;
if(!fs.existsSync(fistDir))throw new Error('Candidate pack did not create frames/gigantFist.');
for(let n=0;n<4;n++){
  const src=extract(fistRaw,n),out=new PNG({width:256,height:256});
  for(let y=0;y<256;y++)for(let x=0;x<256;x++){
    let sy=y;
    if(x>=79)sy=Math.round((y-128)/scale+128);
    if(sy<0||sy>=256){set(out,x,y,[255,0,255,0]);continue;}
    const c=get(src,x,sy);
    if(c[0]===255&&c[1]===0&&c[2]===255)c[3]=0;
    set(out,x,y,c);
  }
  write(path.join(fistDir,'gigantFist_'+String(n).padStart(2,'0')+'.png'),out);
}
const readme=[
'# Derived packed-frame adjustments',
'',
'The versioned raw sources remain immutable and are the source of truth. The active frame cells are derived output for candidate review.',
'',
'- gigantArm: raw v02 frames are copied to the active 256px frame folder with exact #FF00FF keyed to alpha, because the packer treats those cells as final hand-made tiles.',
'- gigantFist: each raw v02 frame keeps its exact wrist rows x=30-78, y=43-212. The hand and effects at x>=79 are scaled vertically around y=128 so the fist body measures 220px high; raw v02 remains unchanged.',
'- These are candidate frame adjustments only. The user has not approved them; manifest reviewStatus remains needs review.'
].join('\n');
fs.writeFileSync(path.join(root,'art/vfx/production/spell-fx-r2/FRAME_ADJUSTMENTS.md'),readme+'\n');
console.log(JSON.stringify({
  armFrameSizes:[0,1].map(n=>({frame:n,width:256,height:256})),
  fistBodyBoundsBefore:bounds,
  fistVerticalScale:Number(scale.toFixed(4)),
  fistBodyTargetPx:220,
  exactWrist:{x:[30,78],y:[43,212],height:170}
},null,2));
