import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import { PNG } from 'pngjs';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const prod='art/characters/sasuke/production', raw='art/characters/sasuke/raw', gallery='public/art-review/sasuke-heavy-charge';
const manifest=JSON.parse(fs.readFileSync('art/manifest.json'));
const main=JSON.parse(execFileSync('git',['show','main:art/manifest.json']));
if(main.characters.sasuke.animations.charge.approvedVersion!==2||manifest.characters.sasuke.animations.charge.approvedVersion!==2)throw Error('Approval changed; stop');
const approvedPath=`${raw}/charge_v02.png`;
if(hash(fs.readFileSync(approvedPath))!==hash(execFileSync('git',['show',`main:${approvedPath}`],{maxBuffer:20e6})))throw Error('Approved raw changed');
if(process.argv[2]==='prepare'){
 const snapshot={};for(const n of ['heavy_v06.png','heavy_v06.json'])snapshot[n]=hash(fs.readFileSync(`${raw}/${n}`));
 fs.writeFileSync(`${prod}/charge-rollback-before.json`,JSON.stringify(snapshot,null,2)+'\n');
 for(const ext of ['png','json'])fs.renameSync(`${raw}/charge_v04.${ext}`,`${raw}/_rejected/charge_v04.${ext}`);
 let review=fs.readFileSync('art/REVIEW.md','utf8');
 review=review.split('\n').map(l=>l.includes('| sasuke | charge |')&&l.includes('| v04 |')?'| 2026-10-10 | sasuke | charge | [archived](characters/sasuke/raw/_rejected/charge_v04.png) | v04 | rejected | User preferred the old charge: restore approved v02; no new generation. | v03/v04 archived; approved v02 raw and cleaned frames retained. Historical newest version stays4. |':l).join('\n');
 fs.writeFileSync('art/REVIEW.md',review);
 let tracker=fs.readFileSync('art/TRACKER.md','utf8');tracker=tracker.replace('| 7 | charge | 4 | - | **yes** | 198 | approved | v04 | v02 | Latest candidate needs review; approved v02 retained. See production/heavy-charge-QA.md. |','| 7 | charge | 4 | - | **yes** | 198 | approved | v04 | v02 | User rejected new charge; approved v02 active. v03/v04 archived; v04 is historical newest, not active. |');fs.writeFileSync('art/TRACKER.md',tracker);
 const tasks='docs/TASKS.md';fs.appendFileSync(tasks,'\n| ART-SAS-CHARGE-ROLLBACK | Restore approved Sasuke charge after user rejection | Codex | review | PR28: archive v04, keep approved v02 and historical newest4; strict pack, geometry comparison and refreshed preview. Heavy v06 unchanged. |\n');
 const change='CHANGELOG.md';fs.writeFileSync(change,fs.readFileSync(change,'utf8').replace('## [Unreleased]','## [Unreleased]\n\n- Sasuke: reject charge v04 per user feedback and restore approved charge v02; preserve rejected source history and heavy v06 candidate.'));
 const anim='art/characters/sasuke/ANIMATIONS.md';fs.writeFileSync(anim,fs.readFileSync(anim,'utf8').replace('prompt A15 · 👁 Sharingan · candidate version **v04**','prompt A15 · 👁 Sharingan · active approved **v02**; redraw v03/v04 rejected by user'));
 console.log('Archived charge v04; approved v02 retained; historical newest4 unchanged.');
}else{
 const report=JSON.parse(fs.readFileSync(`${prod}/charge-rollback-pack.json`));
 const packed=report.characters.find(c=>c.id==='sasuke').packed.find(a=>a.anim==='charge');
 if(packed.version!==2||!packed.from.includes('charge_v02'))throw Error('Packer did not select approved v02');
 const before=JSON.parse(fs.readFileSync(`${prod}/charge-rollback-before.json`));for(const[n,h]of Object.entries(before))if(hash(fs.readFileSync(`${raw}/${n}`))!==h)throw Error('Heavy source changed');
 const sheet=PNG.sync.read(fs.readFileSync('public/characters/sasuke/sheet.png')),meta=JSON.parse(fs.readFileSync('public/characters/sasuke/anims.json'));
 const oldSheet=PNG.sync.read(execFileSync('git',['show','main:public/characters/sasuke/sheet.png'],{maxBuffer:20e6})),oldMeta=JSON.parse(execFileSync('git',['show','main:public/characters/sasuke/anims.json']));
 const contact=new PNG({width:1024,height:256}),frames=[];
 meta.animations.charge.frames.forEach((id,f)=>{
  const oldId=oldMeta.animations.charge.frames[f];let alphaDifferences=0,colorDifferences=0;
  for(let y=0;y<256;y++)for(let x=0;x<256;x++){
   const si=((Math.floor(id/16)*256+y)*sheet.width+(id%16)*256+x)*4,oi=((Math.floor(oldId/16)*256+y)*oldSheet.width+(oldId%16)*256+x)*4,di=(y*1024+f*256+x)*4;
   sheet.data.copy(contact.data,di,si,si+4);if(sheet.data[si+3]!==oldSheet.data[oi+3])alphaDifferences++;
   if(sheet.data[si+3]&&sheet.data.subarray(si,si+3).some((n,j)=>n!==oldSheet.data[oi+j]))colorDifferences++;
  }
  frames.push({frame:f,alphaDifferences,colorDifferences});
 });
 if(frames.some(f=>f.alphaDifferences))throw Error('Approved charge geometry changed');
 const evidence={selectedVersion:2,historicalNewest:manifest.characters.sasuke.animations.charge.version,approvedVersion:2,source:packed.from,frames,heavySourceUnchanged:true,paletteNote:'Global 48-color quantization can change RGB values; charge silhouette alpha is identical to approved main atlas.'};
 fs.writeFileSync(`${prod}/charge-rollback-QA.json`,JSON.stringify(evidence,null,2)+'\n');
 fs.writeFileSync(`${gallery}/charge-contact.png`,PNG.sync.write(contact));
 fs.copyFileSync(approvedPath,`${gallery}/charge_v02.png`);
 fs.copyFileSync('art/characters/sasuke/frames/charge/.packer.json',`${gallery}/charge_v02.packer.json`);
 for(const name of ['sheet.png','anims.json'])fs.copyFileSync(`public/characters/sasuke/${name}`,`${gallery}/${name}`);
 for(const ext of ['png','json'])fs.copyFileSync(`art/scale/lineup-sasuke-heavy_v06-charge_v02.${ext}`,`${gallery}/lineup.${ext}`);
 let html=fs.readFileSync(`${gallery}/index.html`,'utf8');
 const qa='User rejected the new charge and preferred the old one. Approved charge v02 is restored; v03/v04 remain archived and are not approval choices. Heavy v06 remains an unapproved candidate with unchanged contact-zone and exact-idle recovery deviations. Heavy f3 foot reaches x212–233 instead of x180–208; f4 lies partly above y22–46. Whole-frame offsets would break the planted-foot pivot. Further heavy correction is recommended. Heavy raw source scale and palette gates remain failed; packed output is48 colors.';
 html=html.replace(/<h1>.*?<\/h1>/,'<h1>Sasuke · heavy v06 review / approved charge v02 kept</h1>').replace(/<p>.*?<\/p>/,`<p>${qa}</p>`).replace('charge v04 · needs review','charge v02 · approved, kept per user').replace('href="charge_v04.png"','href="charge_v02.png"').replace('href="charge_v04.json"','href="charge_v02.packer.json"').replace(/const meta=.*?,sheet=new Image\(\)/,`const meta=${JSON.stringify(meta)},sheet=new Image()`);
 fs.writeFileSync(`${gallery}/index.html`,html);
 fs.writeFileSync(`${prod}/heavy-charge-QA.md`,`# Sasuke heavy review / approved charge restored\n\n${qa}\n\nCharge selection is raw/charge_v02.png via unchanged approved cleaned frames. All4 packed alpha masks exactly match the approved main atlas; RGB differences are from global48-color palette quantization (see charge-rollback-QA.json). Manifest remains status approved, approvedVersion2 and historical version4. No new image generated. Heavy v06 raw/sidecar hashes unchanged.\n\nStrict pack:42 animations,175 frames,48 colors,zero warnings. Build and hosted runtime validation recorded in PR28.\n`);
 console.log(JSON.stringify(evidence));
}
