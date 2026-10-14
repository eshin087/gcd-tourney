import fs from 'node:fs';
import { PNG } from 'pngjs';
import { measureBody } from '../../../../../tools/body-sheet.mjs';
const base='art/characters/gojo/production/round4';
const p=`${base}/final-candidate-public/characters/gojo`;
const sheet=PNG.sync.read(fs.readFileSync(`${p}/sheet.png`));
const meta=JSON.parse(fs.readFileSync(`${p}/anims.json`,'utf8'));
const scale=JSON.parse(fs.readFileSync('art/scale/builds.json','utf8')).fighters.gojo;
const anims=Object.entries(meta.animations).map(([name,record])=>({name,cells:record.frames.map(id=>{const out=new PNG({width:256,height:256});PNG.bitblt(sheet,out,(id%16)*256,Math.floor(id/16)*256,256,256,0,0);return out;})}));
const body=measureBody({anims,meta},scale.bodyColors);
const candidates={};
for(const name of ['jumpFall','throw','airLight1','airRecover','airLight2','light3','guard','jumpUp','airLight3','hurtLow']){const audit=meta.scaleAudit.anims[name];const b=body.anims[name];candidates[name]={source:`${name}_v${String(audit.v).padStart(2,'0')}.png`,frames:audit.frames.map((head,i)=>({frame:i,H:+head.toFixed(3),B:b.body[i],headProbeVerdict:audit.verdict,notes:meta.anims?.[name]?.notes??[]}))};}
const report={method:'Per-frame head probe (H) from packer scaleAudit and garment area proxy (B) from TOOL-036, measured on this exact isolated 48-color atlas. B is advisory ±10% and never a segment pass. The full anatomical chain review is a separate manual audit; low-confidence/occluded/depth-projected/curl/sole-facing points are inconclusive.',atlas:`${p}/sheet.png`,atlasSha256:'89FD7021575060D70A065C620607D3A80FD526D6B8B6F709D2106766381F0B28',animsJson:`${p}/anims.json`,animsSha256:'40A09F854DA368550C4C158CC16350B7562CFA88030BE79BF77002307FF3BDC9',reference:'approved idle_v06 and approved title-style combat cell; idle_v07 not used',gate:'warn only inside disposable isolated fixture; production thresholds and files untouched',paletteColors:meta.colors,packedFrames:meta.frames,candidates};
fs.writeFileSync(`${base}/final-candidate-atlas-measurements.json`,JSON.stringify(report,null,2)+'\n');
console.log(Object.entries(candidates).map(([a,v])=>`${a} ${v.source}: ${v.frames.map(x=>`f${x.frame} H${x.H}/B${x.B}`).join(', ')}`).join('\n'));
