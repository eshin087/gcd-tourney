import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
const p='art/characters/gojo/production/round4/sources/attempt-ledger.json';const xs=JSON.parse(fs.readFileSync(p,'utf8'));
const dest='art/characters/gojo/raw/jumpFall_v06.png';const src='art/characters/gojo/production/round4/sources/jumpFall-v06-call1.png';
if(!fs.existsSync(src))fs.copyFileSync(dest,src);
const resolved=path.resolve(src);const hash=crypto.createHash('sha256').update(fs.readFileSync(src)).digest('hex');
xs.push({asset:'jumpFall-v06',calls:1,maxNewCalls:3,cumulativeCallsInRound:3,candidate:'jumpFall_v06.png',candidateSha256:crypto.createHash('sha256').update(fs.readFileSync(dest)).digest('hex'),call1:resolved,call1Sha256:hash,generatedOutputOriginal:'E:/Vibe Coding/.codex/generated_images/01a1386d-a88d-75f0-94e7-a19782987b09/exec-b72f1a1a-1508-4d38-94c3-7718f8ff348c.png',selectedSource:'call1',selectedReason:'Third authorized generation call total this round; new immutable v06 while prior v05 candidate remains preserved.'});
fs.writeFileSync(p,JSON.stringify(xs,null,2)+'\n');console.log(`jumpFall-v06 recorded: ${hash}`);
