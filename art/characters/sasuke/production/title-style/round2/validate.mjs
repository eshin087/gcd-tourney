import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
const before=JSON.parse(execFileSync('git',['show','HEAD:art/manifest.json'],{encoding:'utf8'}));
const after=JSON.parse(fs.readFileSync('art/manifest.json'));
const jobs=JSON.parse(fs.readFileSync('art/characters/sasuke/production/title-style/round2/jobs.json')).jobs;
const changed=[];
for(const [id,c] of Object.entries(before.characters))for(const [a,v] of Object.entries(c.animations)){
 if(JSON.stringify(v)!==JSON.stringify(after.characters[id].animations[a]))changed.push(`${id}.${a}`);
 if(v.approvedVersion!==after.characters[id].animations[a].approvedVersion)throw Error('Approval changed');
}
if(changed.length!==10||changed.some(k=>!jobs.some(j=>k===`sasuke.${j.asset}`)))throw Error('Scope error '+changed);
for(const j of jobs)if(after.characters.sasuke.animations[j.asset].version!==j.version)throw Error('Stale manifest '+j.asset);
const report=JSON.parse(fs.readFileSync('art/characters/sasuke/production/title-style/round2/reports/metrics-strict.json'));
for(const [a,j] of Object.entries(report.anims))if(j.frames.some(f=>!f.inside))throw Error('Margin '+a);
console.log('PASS owned animation metadata only, unchanged approvals, correct versions and strict candidate pixel margins.');
