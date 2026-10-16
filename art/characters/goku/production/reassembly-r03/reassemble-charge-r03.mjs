import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { PNG } from 'pngjs';

const root = process.cwd(), goku = path.join(root, 'art/characters/goku');
const base = path.join(goku, 'production/reassembly-r03');
const srcPath = path.join(goku, 'production/generation-source/charge_v04_attempt03.png');
const hold = path.join(goku, 'raw/_qa_hold');
const sourceBytes = fs.readFileSync(srcPath), source = PNG.sync.read(sourceBytes);
if (source.width !== 2170 || source.height !== 725) throw new Error(`unexpected charge source dimensions ${source.width}x${source.height}`);
const origin = 543;
const landmarks = {
  collarToBelt: { a: [263, 214], b: [235, 318], targetPx: 38.1, endpointUncertaintyPx: 9, referenceUncertaintyPx: 5, definition: 'sternoclavicular collar-center to belt-center, source f1' },
  beltWidth: { a: [187, 316], b: [279, 318], targetPx: 36, endpointUncertaintyPx: 8, referenceUncertaintyPx: 4, definition: 'visible blue belt outer span, source f1' },
  bootTopToSole: { a: [81, 551], b: [47, 663], targetPx: 43.7, endpointUncertaintyPx: 8, referenceUncertaintyPx: 4, definition: 'rear boot shaft-center to sole along boot axis, source f1' }
};
const length = (m) => Math.hypot(m.b[0] - m.a[0], m.b[1] - m.a[1]);
const factor = landmarks.bootTopToSole.targetPx / length(landmarks.bootTopToSole);
const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const magenta = (p, i) => p.data[i] > 160 && p.data[i + 1] < 100 && p.data[i + 2] > 160;
function bounds(x0, x1) {
  let left = x1, top = source.height, right = -1, bottom = -1;
  for (let y = 0; y < source.height; y++) for (let x = x0; x < x1; x++) {
    const i = (y * source.width + x) * 4;
    if (source.data[i + 3] < 128 || magenta(source, i)) continue;
    left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y);
  }
  if (right < left) throw new Error('empty frame bounds');
  return { left, top, right, bottom, width: right-left+1, height: bottom-top+1 };
}
function makeFrame(frame) {
  const rects = { 1: [543,1085], 2: [1085,1627], 3: [1627,2170] };
  const [x0,x1] = rects[frame], b = bounds(x0,x1);
  const w = Math.ceil(b.width * factor), h = Math.ceil(b.height * factor);
  const out = new PNG({ width: 256, height: 256 });
  for (let i = 0; i < out.data.length; i += 4) out.data.set([255,0,255,255],i);
  const ox = Math.floor((256-w)/2), oy = 240-h+1;
  let lost = 0, copied = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const sx = b.left + Math.min(b.width-1,Math.floor(x/factor)), sy = b.top + Math.min(b.height-1,Math.floor(y/factor));
    const si = (sy*source.width+sx)*4;
    if(source.data[si+3]<128||magenta(source,si)) continue;
    const dx=ox+x,dy=oy+y;
    if(dx<0||dx>=256||dy<0||dy>=256){lost++;continue;}
    out.data.set(source.data.subarray(si,si+4),(dy*256+dx)*4);copied++;
  }
  return { frame, sourceFrame: frame, sourceRect:[x0,0,x1,725], sourceBounds:b, nativeHeight:h, lost, copied, image:out };
}
function line(p,a,b,color){const n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1]));for(let s=0;s<=n;s++){const x=Math.round(a[0]+(b[0]-a[0])*s/n),y=Math.round(a[1]+(b[1]-a[1])*s/n);for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const xx=x+dx,yy=y+dy;if(xx<0||xx>=p.width||yy<0||yy>=p.height)continue;p.data.set([...color,255],(yy*p.width+xx)*4);}}}
const mapping=[1,2,3,1],frames=mapping.map(makeFrame),maxHeight=Math.max(...frames.map(f=>f.nativeHeight));
const strip=new PNG({width:1024,height:256});for(let i=0;i<strip.data.length;i+=4)strip.data.set([255,0,255,255],i);
frames.forEach((f,n)=>{for(let y=0;y<256;y++)strip.data.set(f.image.data.subarray(y*1024,(y+1)*1024),(y*1024+n*256)*4);});
const versions=fs.readdirSync(hold).map(f=>f.match(/^charge_v(\d{2})\.png$/)).filter(Boolean).map(m=>Number(m[1]));const version=Math.max(0,...versions)+1;
const name=`charge_v${String(version).padStart(2,'0')}`,imageBytes=PNG.sync.write(strip),imagePath=path.join(hold,`${name}.png`);
if(fs.existsSync(imagePath)||fs.existsSync(imagePath.replace(/\.png$/,'.json')))throw new Error(`refusing overwrite ${name}`);
fs.writeFileSync(imagePath,imageBytes);
const annotated=PNG.sync.read(sourceBytes);for(const [k,m]of Object.entries(landmarks)){const color=k==='beltWidth'?[255,235,0]:k==='collarToBelt'?[0,255,255]:[255,64,64];line(annotated,[m.a[0]+origin,m.a[1]],[m.b[0]+origin,m.b[1]],color);}
const annotationPath=path.join(base,'source-inspection/charge-f01-endpoints-verified.png');fs.writeFileSync(annotationPath,PNG.sync.write(annotated));
const referenceHash=hash(fs.readFileSync(path.join(goku,'raw/idle_v02.png')));
const record={animation:'charge',version,status:'diagnostic technical hold; no design approval or scale pass',sourcePath:'art/characters/goku/production/generation-source/charge_v04_attempt03.png',sourceSha256:hash(sourceBytes),sourceDimensions:[source.width,source.height],sourcePanelRects:[[0,0,543,725],[543,0,1085,725],[1085,0,1627,725],[1627,0,2170,725]],frameMap:mapping,loopTimingMs:[50,50,50,50],reference:{path:'art/characters/goku/raw/idle_v02.png',sha256:referenceHash,targetsPx:{collarToBelt:38.1,beltWidth:36,bootTopToSole:43.7},uncertaintyPx:{collarToBelt:5,beltWidth:4,bootTopToSole:4}},measuredSourceFrame:1,landmarks:Object.fromEntries(Object.entries(landmarks).map(([k,m])=>[k,{sourceEndpointsPanelLocal:[m.a,m.b],sourceEndpointsAbsolute:[[m.a[0]+origin,m.a[1]],[m.b[0]+origin,m.b[1]]],sourceLengthPx:Number(length(m).toFixed(3)),sourceEndpointUncertaintyPx:m.endpointUncertaintyPx,referenceTargetPx:m.targetPx,referenceTargetUncertaintyPx:m.referenceUncertaintyPx,ratio:Number((m.targetPx/length(m)).toFixed(6)),definition:m.definition}])),selectedFactor:Number(factor.toFixed(9)),factorMethod:'direct rear-boot ratio, with torso and belt as independent uncertainty-compatible cross-checks; not a median and not a bounds fit',factorUncertainty:'approximately ±0.04 to ±0.06; source endpoint uncertainty and reference uncertainty remain separate',nativeMaxHeight:maxHeight,frameLoss:frames.map(f=>({sourceFrame:f.sourceFrame,lostPixels:f.lost,sourceBounds:f.sourceBounds,nativeHeight:f.nativeHeight})),totalLostPixels:frames.reduce((n,f)=>n+f.lost,0),outputSha256:hash(imageBytes),outputPath:`art/characters/goku/raw/_qa_hold/${name}.png`,annotationPath:'art/characters/goku/production/reassembly-r03/source-inspection/charge-f01-endpoints-verified.png',note:'Original neutral f0 omitted; KIT lists power-up look and does not require a neutral pre-pose. Combat sequence uses source frames 1,2,3,1 at unchanged common factor. This repairs the neutral-to-combat seam without redrawing.'};
fs.writeFileSync(imagePath.replace(/\.png$/,'.json'),JSON.stringify(record,null,2)+'\n');
console.log(JSON.stringify({animation:'charge',version,factor:record.selectedFactor,nativeMaxHeight:maxHeight,lost:record.totalLostPixels,sourceSha256:record.sourceSha256,outputSha256:record.outputSha256},null,2));
