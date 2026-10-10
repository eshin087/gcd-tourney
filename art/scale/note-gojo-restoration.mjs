import fs from 'node:fs';
for(const [file,changes] of Object.entries({
 'art/TRACKER.md':[['Model v04 anatomy correction pending final review (ART-SCALE-01); v03 remains approved.','Model v04 rejected: enlarged head. Original approved model v03 retained.'],['ART-SCALE-01 corrected-scale candidate; previous approval retained; final motion review pending.','Enlarged idle v03 rejected; original approved idle v02 restored.']],
 'docs/TASKS.md':[['complete Sasuke after calibration.','complete Sasuke after calibration. User reaffirmed original Gojo head size; enlarged Gojo candidates rejected.'],['files: tools/pack-sprites.mjs, tools/test-pack-sprites.mjs, art/scale/','files: docs/decisions/0010-per-character-body-scale.md, art/characters/_template/PROMPTS.md, tools/pack-sprites.mjs, tools/test-pack-sprites.mjs, art/scale/']]
})){let s=fs.readFileSync(file,'utf8');for(const [a,b]of changes)s=s.replace(a,b);fs.writeFileSync(file,s);}
