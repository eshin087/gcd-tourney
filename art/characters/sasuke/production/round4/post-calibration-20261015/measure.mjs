import fs from 'node:fs';
const d='art/characters/sasuke/production/round4/post-calibration-20261015';
// Coordinates manually read on the saved native-cell 3x grids; no automatic anatomy inference.
const entries=[
['neutral',{H:[[119,34],[135,73]],T:[[125,75],[128,121]],NA:[[110,85],[96,119],[90,144]],FA:[[143,87],[151,122],[158,145]],NL:[[137,150],[148,194],[151,224]],FL:[[111,150],[104,193],[97,225]],S:28}],
['combat',{H:[[121,63],[136,101]],T:[[124,100],[122,143]],NA:[[141,108],[166,120],[183,114]],FA:[[98,108],[79,127],[104,118]],NL:[[139,166],[167,193],[181,226]],FL:[[109,166],[79,194],[64,226]],S:29}],
['idle-0',{H:[[110,65],[128,104]],T:[[113,100],[113,145]],NA:[[139,113],[160,124],[179,118]],FA:[[94,113],[73,131],[97,123]],NL:[[131,165],[164,194],[180,226]],FL:[[106,165],[75,195],[60,226]],S:32}],
['superDash-0',{H:[[162,90],[184,124]],T:[[174,124],[155,167]],NA:[[191,126],[218,115],[238,103]],FA:[[145,135],[123,145],[113,161]],NL:[[152,180],[135,207],[107,218]],FL:[[133,181],[111,209],[82,232]],S:null}],
['superDash-1',{H:[[157,89],[179,123]],T:[[169,124],[150,167]],NA:[[187,126],[213,114],[233,103]],FA:[[141,135],[119,147],[132,151]],NL:[[149,181],[137,207],[100,205]],FL:[[130,181],[108,209],[77,232]],S:null}],
['jumpSquat-0',{H:[[160,85],[184,122]],T:[[168,122],[145,163]],NA:[[145,125],[102,139],[62,156]],FA:null,NL:[[146,177],[181,185],[164,225]],FL:[[118,177],[91,194],[79,226]],S:34}],
['beamFire-0',{H:[[111,74],[131,113]],T:[[120,112],[114,149]],NA:[[139,122],[167,128],[189,125]],FA:[[92,123],[80,145],[71,166]],NL:[[130,169],[165,197],[178,226]],FL:[[104,169],[76,198],[62,226]],S:33}],
['beamFire-1',{H:[[111,74],[132,113]],T:[[120,112],[114,149]],NA:[[140,122],[168,128],[191,125]],FA:[[94,122],[78,144],[70,164]],NL:[[130,169],[165,197],[178,226]],FL:[[104,169],[76,198],[61,226]],S:33}],
['beamFire-2',{H:[[110,74],[130,113]],T:[[119,112],[113,149]],NA:[[139,122],[166,128],[187,125]],FA:[[91,123],[79,145],[69,167]],NL:[[129,169],[163,197],[176,226]],FL:[[103,169],[75,198],[61,226]],S:33}],
['dash-0',{H:[[215,82],[232,122]],T:[[216,124],[185,157]],NA:[[179,125],[142,128],[105,132]],FA:null,NL:[[184,173],[206,186],[175,226]],FL:[[155,177],[112,201],[83,227]],S:31}],
['dash-1',{H:[[215,82],[232,122]],T:[[216,124],[185,157]],NA:[[179,125],[142,128],[105,132]],FA:null,NL:[[184,173],[206,186],[175,226]],FL:[[155,177],[112,201],[83,227]],S:30}]
];
const len=(a,b)=>Math.round(Math.hypot(a[0]-b[0],a[1]-b[1])*10)/10;
const records=entries.map(([name,points])=>({name,points,measurements:Object.fromEntries(Object.entries(points).map(([k,v])=>[k,Array.isArray(v)?v.length===3?[len(v[0],v[1]),len(v[1],v[2])]:len(v[0],v[1]):v]))}));
fs.writeFileSync(`${d}/measurements.json`,JSON.stringify({method:'Manual projected landmark estimates, native pixels. N/F mean near/far visible chains, not anatomical left/right. H is outer hair-tip to chin, not hidden skull. T collar base to belt center. Upper/lower limbs follow garment-covered joint estimates, not a certified skeleton.',uncertainty:{H:5,T:7,upperArm:10,forearm:10,thigh:12,shin:10,S:2},exclusions:'All shoulders nonfrontal; no shoulder-width pass. superDash shoes oblique. jumpSquat/dash far arm overlaps torso and is foreshortened, unmeasured. All covered joint centers broad low confidence. Do not compare a projected shortened segment as a true bone length.',records},null,2)+'\n');
console.log(records.map(r=>r.name+' '+JSON.stringify(r.measurements)).join('\n'));
