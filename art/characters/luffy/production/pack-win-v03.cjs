const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const read = (p) => PNG.sync.read(fs.readFileSync(p));
const save = (p, png) => fs.writeFileSync(p, PNG.sync.write(png));
const magenta = [255, 0, 255, 255];
const isBg = (d, i) => d[i] > 110 && d[i + 2] > 110 && d[i + 1] < 115 && Math.abs(d[i] - d[i + 2]) < 100;
const root = process.cwd();
const sourcePath = 'art/characters/luffy/production/generation-source/win_v03_attempt02_source.png';
const candidatePath='art/characters/luffy/raw/_qa_hold/win_v03.png';
const sidecarPath='art/characters/luffy/raw/_qa_hold/win_v03.json';
if(fs.existsSync(candidatePath)||fs.existsSync(sidecarPath))throw new Error('win v03 is already preserved; refusing to overwrite or recreate it.');
const source = read(sourcePath);
const spans = [[108,488,64,690],[631,1012,68,690],[1156,1540,65,690],[1688,2070,64,690]];
const srcHeights = spans.map(([, , y0, y1]) => y1-y0+1);
const targetH = 238;
const factor = targetH / srcHeights.reduce((a,b)=>a+b,0) * srcHeights.length;
const frames=[];
const stats=[];
for (let f=0; f<spans.length; f++) {
  const [x0,x1,y0,y1]=spans[f];
  const w=x1-x0+1, h=y1-y0+1;
  const sw=Math.round(w*factor), sh=Math.round(h*factor);
  const xOffset=Math.round((256-sw)/2), yOffset=240-sh;
  const cell=new PNG({width:256,height:256});
  for(let i=0;i<cell.data.length;i+=4) cell.data.set(magenta,i);
  for(let y=0;y<sh;y++) for(let x=0;x<sw;x++) {
    const sx=x0+Math.min(w-1,Math.floor((x+0.5)/factor));
    const sy=y0+Math.min(h-1,Math.floor((y+0.5)/factor));
    const si=(sy*source.width+sx)*4, di=((yOffset+y)*256+xOffset+x)*4;
    if(isBg(source.data,si)) cell.data.set(magenta,di);
    else cell.data.set(source.data.subarray(si,si+4),di);
  }
  frames.push(cell);
  stats.push({frame:f,sourceBox:[x0,y0,x1,y1],sourceBodyHeight:h,sourceBodyWidth:w,sharedScale:factor,scaledBodyHeight:sh,scaledWidth:sw,feetBaseline:240,cellX:[xOffset,xOffset+sw-1]});
}
const strip=new PNG({width:256*frames.length,height:256});
for(let f=0;f<frames.length;f++) for(let y=0;y<256;y++) for(let x=0;x<256;x++) {
  const si=(y*256+x)*4,di=(y*strip.width+f*256+x)*4;
  strip.data.set(frames[f].data.subarray(si,si+4),di);
}
const out='art/characters/luffy/raw/win_v03.png';
save(candidatePath,strip);
const neutral=read('art/characters/luffy/production/native-audit-20261015/neutral.png');
const combat=read('art/characters/luffy/production/native-audit-20261015/combat.png');
const idleFull=read('art/characters/luffy/reference/idle_approved.png');
const idle=new PNG({width:256,height:256});
for(let y=0;y<256;y++) for(let x=0;x<256;x++) idle.data.set(idleFull.data.subarray((y*idleFull.width+x)*4,(y*idleFull.width+x)*4+4),(y*256+x)*4);
const contact=new PNG({width:256*7,height:256});
const items=[neutral,combat,idle,...frames];for(const item of items)for(let i=0;i<item.data.length;i+=4)if(item.data[i+3]<16)item.data.set(magenta,i);
for(let f=0;f<items.length;f++) for(let y=0;y<256;y++) for(let x=0;x<256;x++) contact.data.set(items[f].data.subarray((y*256+x)*4,(y*256+x)*4+4),(y*contact.width+f*256+x)*4);
save('art/characters/luffy/production/win-v03-contact.png',contact);
const report={source:sourcePath,sourceSize:[source.width,source.height],sourceSHA256:require('crypto').createHash('sha256').update(fs.readFileSync(sourcePath)).digest('hex'),approvedNeutralBodyHeightPx:238,sourceBodyHeightsPx:srcHeights,sharedScale:factor,scaledBodyHeightsPx:stats.map(s=>s.scaledBodyHeight),commonFeetBaselineY:240,measurement:{method:'magenta-background silhouette bbox, neutral native cell; hat top to sandal sole',uncertaintyPx:3,scope:'source candidate measurement only; no independent anatomy audit'},frames:stats,outputs:{strip:candidatePath,contact:'art/characters/luffy/production/win-v03-contact.png'}};
fs.writeFileSync(sidecarPath,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
