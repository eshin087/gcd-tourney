import fs from 'node:fs';
function update(file,fn){const s=fs.readFileSync(file,'utf8');const n=fn(s);if(n===s)throw new Error('No matching update in '+file);fs.writeFileSync(file,n);}
update('art/REVIEW.md',(s)=>{
  s=s.replace('Candidate pack and atlas comparison recorded in gallery; not yet approved.','Candidate pack 2/2 at x1; 9 visible colors; 170px tube and repeated-column profile shown beside approved v01 in the gallery. Not approved.',1);
  s=s.replace('Candidate pack and atlas comparison recorded in gallery; not yet approved.','Candidate pack 4/4 at x1; 14 visible colors; 220px fist body with exact 170px wrist stub shown beside approved v01. Not approved.',1);
  return s.replace('8 exact 256x256 frames; HD candidate; approval pending.','8/8 exact 256x256 HD frames packed at x1; 9-color maximum; approval pending.');
});
update('art/TRACKER.md',(s)=>{
  s=s.replace('ART-SPELL-R2 v02 is a 170px inflated tube candidate; v01 remains approved. Candidate pack recorded in the R2 gallery; awaiting user review.','ART-SPELL-R2 v02 candidate: 2/2 packed, 170px thick, 9 visible colors; v01 remains approved. Gallery compares four arm lengths beside v01; awaiting user review.');
  s=s.replace('ART-SPELL-R2 v02 retains the fist and adds the exact 170px arm-matched wrist stub; v01 remains approved. Candidate pack recorded in the R2 gallery; awaiting user review.','ART-SPELL-R2 v02 candidate: 4/4 packed, 220px hand, exact 170px wrist, 14 visible colors; v01 remains approved. Gallery compares the four-length join beside v01; awaiting user review.');
  return s.replace('ART-SPELL-R2; Gojo HD exit tile candidate, 8 exact 256px frames; awaiting user review.','ART-SPELL-R2; Gojo HD exit tile candidate, 8/8 exact 256px frames packed at x1 (9-color maximum); awaiting user review.');
});
const calls='art/vfx/production/spell-fx-r2/CALLS.md';
let log=fs.readFileSync(calls,'utf8');
if(!log.includes('## Packing and review evidence')){
  log+='\n## Packing and review evidence\n\n'+
    '- Candidate pack: node tools/pack-sprites.mjs vfx --candidates, exit 0; 114 effects / 729 frames / 9 HD pages. The six requested candidates pack at their expected frame counts; no new warnings were reported for them. Three unrelated existing warnings remain for streamBolt, streamFlame and gumArm.\n'+
    '- Candidate atlas placements: gigantArm row 10 and gigantFist row 11 of the Luffy HD page; voidShatterTL/TR/BL rows 13-15 of the Gojo HD page and voidShatterBR row 0 of Gojo page 2.\n'+
    '- Review gallery assets are extracted from the actual packed candidate atlas and production v01 atlas. It shows a four-arm-length Luffy join and all eight 512px Gojo comparisons (v01 enlarged 2x beside the four packed tiles).\n'+
    '- After extracting review evidence, the active gigantArm frame folder was restored to its approved v01 cells, and the candidate-only fist frame folder was removed after its exact v02 packed cells were preserved under references/. Standard production pack then exited 0 with 110 approved effects / 697 frames / 8 HD pages; it selected gigantArm v01 and gigantFist v01, leaving every R2 asset unapproved.\n';
  fs.writeFileSync(calls,log);
}
fs.writeFileSync('art/vfx/production/spell-fx-r2/FRAME_ADJUSTMENTS.md',[
  '# Derived packed-frame adjustments',
  '',
  'The versioned raw sources remain immutable and are the source of truth. The candidate atlas reviewed at public/reviews/spell-fx-r2/index.html used these derived frame cells:',
  '',
  '- gigantArm v02: raw frames were keyed from exact #FF00FF to alpha and used as 256px hand-made tile cells. The pre-existing v01 cells were preserved under references/gigantArm_v01/ and restored to art/vfx/frames/gigantArm/ after candidate capture.',
  '- gigantFist v02: raw frames kept their exact 170px wrist rows x=30-78, y=43-212. The hand and effects at x>=79 were scaled vertically around y=128 to a measured 220px body. Exact packed candidate cells are preserved under references/gigantFist_v02_packed/; the active folder was removed so the production pack regenerated the approved v01 cells.',
  '- The user has not approved the v02 or tile candidates. Manifest reviewStatus remains needs review.'
].join('\n')+'\n');
console.log('Updated review QA notes, VFX tracker rows, packing evidence, and derived-frame status.');
