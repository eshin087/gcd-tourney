const fs=require('fs');
const rows=[
 ['idle',0,[136,75,127,112],[109,112,145,112],[70,197,58,239],[88,103,107,99]],
 ['guard',0,[129,76,121,113],[103,113,139,113],[63,197,47,239],[83,104,101,101]],
 ['guard',1,[135,76,123,114],[110,114,146,114],[65,198,51,239],[173,104,169,89]],
 ['light2',0,[130,70,120,109],[102,109,137,109],[68,196,55,239],[83,102,101,98]],
 ['light2',1,[139,73,124,111],[107,111,144,111],[64,197,52,239],[74,84,88,97]],
 ['light2',2,null,[104,112,137,112],[63,197,49,239],[185,78,212,75]],
 ['light2',3,[138,77,124,114],[108,114,144,114],[64,197,51,239],[194,82,220,79]],
 ['light2',4,[132,80,121,116],[103,116,140,116],[63,199,50,239],[193,83,219,82]],
 ['light2',5,[137,66,125,105],[107,105,142,105],[70,195,60,238],[91,96,105,87]],
 ['light2',6,[134,71,122,108],[106,108,141,108],[69,197,55,239],[90,101,105,96]]
];
const names=['neckBaseToBelt','beltWidth','bootTopToSole','forearm'];
const baseline=rows[0].slice(2).map(p=>Math.hypot(p[2]-p[0],p[3]-p[1]));
const measured=rows.map(([animation,frame,...segments])=>({animation,frame,segments:Object.fromEntries(segments.map((p,i)=>[names[i],p?{endpoints:[[p[0],p[1]],[p[2],p[3]]],projectedPx:+Math.hypot(p[2]-p[0],p[3]-p[1]).toFixed(1),ratioToIdle:+(Math.hypot(p[2]-p[0],p[3]-p[1])/baseline[i]).toFixed(3),lengthUncertaintyPx:i===0?5:i===1?4:i===2?4:6,ratioMeaning:i===3?'projection only; changed pose/side prevents direct scale inference':'screening comparison; endpoints and projection uncertain'}:{unmeasurable:'neck base hidden by rear torso rotation'}])),shin:{unmeasurable:'knee and ankle skeletal centers concealed by baggy gi and boot; do not substitute garment fold for a measured joint'}}));
fs.writeFileSync(__dirname+'/measurements.json',JSON.stringify({method:'Independent manual visible endpoint readings on native-height atlas crops at 2x nearest-neighbor, coordinates divided by two. Approximate endpoints; rounded to native pixels. Neck base means collar-center/sternoclavicular region, unlike earlier posterior-neck screening point. No inferred hidden joints. Uncertainty applies to lengths, not a statistical confidence interval.',reference:{titleNeutral:{torso:[[135,64],[134,101]],boot:[[94,200],[87,239]],belt:[[118,101],[150,101]]},titleCombat:{torso:[[135,84],[125,120]],boot:[[64,200],[55,239]],belt:[[110,120],[143,120]]}},rows:measured},null,2));
console.log(measured.map(x=>({frame:x.animation+x.frame,...Object.fromEntries(Object.entries(x.segments).map(([k,v])=>[k,v.projectedPx??'occluded']))})));
