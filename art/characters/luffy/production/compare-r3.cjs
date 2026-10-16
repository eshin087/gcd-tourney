const fs = require('fs');
const { PNG } = require('pngjs');
const oldAtlas = PNG.sync.read(fs.readFileSync('art/characters/luffy/production/astra-audit-r2/atlas-luffy-calibration-r2.png'));
const oldMeta = JSON.parse(fs.readFileSync('art/characters/luffy/production/astra-audit-r2/animations-luffy-calibration-r2.json'));
const newAtlas = PNG.sync.read(fs.readFileSync('public/characters/luffy/sheet.png'));
const newMeta = JSON.parse(fs.readFileSync('public/characters/luffy/anims.json'));
const anims = Object.keys(newMeta.animations);
const out = { oldAtlas: {width:oldAtlas.width,height:oldAtlas.height}, newAtlas:{width:newAtlas.width,height:newAtlas.height}, animations:[] };
function frame(png, i) { const ox=(i%16)*256, oy=Math.floor(i/16)*256, a=new Uint8Array(256*256*4); for(let y=0;y<256;y++){ const s=((oy+y)*png.width+ox)*4; a.set(png.data.subarray(s,s+256*4),y*256*4); } return a; }
for (const anim of anims) {
 const oldA=oldMeta.animations[anim], newA=newMeta.animations[anim];
 if(!oldA||!newA) { out.animations.push({anim,missingOld:!oldA,missingNew:!newA}); continue; }
 const frames=[];
 for(let j=0;j<Math.min(oldA.frames.length,newA.frames.length);j++){
  const a=frame(oldAtlas,oldA.frames[j]), b=frame(newAtlas,newA.frames[j]);
  let maskDiff=0,rgbDiff=0,alphaDiff=0,bounds=[256,256,-1,-1];
  for(let p=0;p<256*256;p++){
   const k=p*4, aa=a[k+3], ba=b[k+3];
   if(!!aa!==!!ba){maskDiff++;bounds[0]=Math.min(bounds[0],p%256);bounds[1]=Math.min(bounds[1],Math.floor(p/256));bounds[2]=Math.max(bounds[2],p%256);bounds[3]=Math.max(bounds[3],Math.floor(p/256));}
   if(aa!==ba) alphaDiff++;
   if(aa&&ba&&(a[k]!==b[k]||a[k+1]!==b[k+1]||a[k+2]!==b[k+2])) rgbDiff++;
  }
  frames.push({frame:j,oldAtlasIndex:oldA.frames[j],newAtlasIndex:newA.frames[j],maskDiff,alphaDiff,rgbDiff,maskDiffBounds:maskDiff?bounds:null,oldDuration:oldA.durations[j],newDuration:newA.durations[j]});
 }
 out.animations.push({anim,version:newA.version||null,frames});
}
fs.writeFileSync('art/characters/luffy/production/r3-pixel-compare.json',JSON.stringify(out,null,2)+'\n');
const lines=['# Luffy calibration r3 pixel comparison','','Compared actual 19-animation public pack against audited 23-animation r2 diagnostic atlas at exact 256px cell granularity. Alpha occupancy (mask), alpha byte, and RGB of mutually opaque pixels were measured separately. No image bytes were changed by this comparison.','',`Old fixture: ${oldAtlas.width}x${oldAtlas.height}; current gameplay pack: ${newAtlas.width}x${newAtlas.height}.`,''];
for(const a of out.animations){ const md=a.frames.reduce((s,f)=>s+f.maskDiff,0), ad=a.frames.reduce((s,f)=>s+f.alphaDiff,0), rd=a.frames.reduce((s,f)=>s+f.rgbDiff,0); lines.push(`- ${a.anim}: ${a.frames.length} compared frames; mask-different pixels ${md}; alpha-byte differences ${ad}; mutually opaque RGB-different pixels ${rd}.`); }
lines.push('','Per-frame indices, durations, exact diff counts, and mask-difference bounds are in `r3-pixel-compare.json`. Differences can reflect the actual packer selecting a different 48-color palette after four held strips were excluded; this is a comparison report, not Astra certification.');
fs.writeFileSync('art/characters/luffy/production/r3-pixel-compare.md',lines.join('\n')+'\n');
