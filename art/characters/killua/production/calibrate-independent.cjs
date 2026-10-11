const fs=require('fs'),base='art/characters/killua/';
const data=[
 ['specialForward',9,[72,72,72,72,74.88,74.88,74.88],12,'Independent A nominal72 f0(300,228)->(318,298),f1(783,228)->(801,296); B81 f0(497,175)->(515,254),f1(1128,175)->(1146,254),f2(1770,175)->(1788,254), times actual stitch0.9243996=74.88. Chest width uncertainty from posture; not approval.'],
 ['heavy',9,[65,64,70,70,70,63.15,65.93,68.72],15,'Independent source A65/64/70/70/70, B68/71/74 times stitch0.9285966. A f0(303,305)->(319,368),f2(1141,259)->(1165,325); Bf0(454,126)->(474,191),f2(1822,200)->(1844,270). Bent axes uncertain15px.'],
 ['airLight3',5,[70,70,70,70,73.13,73.13],12,'Independent source A70 each, B74 each times stitch0.9882444. A f0(301,117)->(318,185); Bf0(667,124)->(685,194).'],
 ['airHeavy',4,[71,75,66,68,69.97,71.92],15,'Independent source A71/75/66/68, B72/74 times stitch0.9718444. Af0(312,168)->(322,238),f1(797,152)->(811,225),f2(1376,210)->(1395,274); Bf0(739,165)->(757,235),f1(1432,112)->(1451,184). Arms/tilt obscure scalp.'],
 ['airLight1',5,[71,71,71,71,71],12,'Independent crown/chin representative f0(208,133)->(223,202); all5 visually stable.'],
 ['airLight2',6,[72,68,69,74,74],12,'Independent crown/chin f0(204,144)->(224,213),f1(630,154)->(647,220),f4(1960,142)->(1978,214). Small differences inside uncertainty.'],
 ['light2',4,[81,81,81,81,76.65,76.65,76.65],12,'Independent part A nominal81: f0(291,118)->(309,196). B nominal78: f0(474,116)->(494,191), then stitch0.9827 gives76.65. Within-part axes visually stable.'],
 ['light3',4,[74,74,74,74,75.39,75.39,75.39],12,'Independent part A nominal74: f0(250,105)->(269,176). B nominal76: f0(446,97)->(461,171), then stitch0.9919645 gives75.39. Small differences within hidden-scalp uncertainty.'],
 ['beamCharge',7,[90,88,87],12,'Independent inferred scalp/chin global coordinates f0(446,108)->(472,194),f1(1108,107)->(1133,192),f2(1769,109)->(1790,194). Native2172x724.'],
 ['beamFire',7,[86,80,86],12,'Independent inferred scalp/chin f0(435,154)->(451,239),f1(1046,144)->(1066,222),f2(1803,152)->(1818,237). Native2172x724.'],
 ['specialDown',3,[78,72,83,77],15,'Independent crown/chin f0(304,263)->(323,338),f1(852,269)->(868,339),f2(1329,111)->(1352,191),f3(1960,247)->(1980,321). Crouch/upward gaze gives15px uncertainty.'],
 ['superPose',6,[82,82,82,82],12,'Independent crown/chin f0(311,122)->(332,202),f1(826,122)->(844,202),f2(1367,122)->(1387,202),f3(1907,122)->(1927,202).'],
 ['specialUp',7,[69,72,76,74,73,73],16,'Independent A source skull69/72/76/74 +/-12; B85/86 +/-16 multiplied stitch0.8538011696 gives73 each. Exact XY in independent-correction-review.md. Occluded/tucked bones remain uncertain, no exemption.']
];
for(const [a,v,heads,u,note] of data){const p=base+'raw/'+a+'_v'+String(v).padStart(2,'0')+'.json',j=fs.existsSync(p)?JSON.parse(fs.readFileSync(p)):{};j.anatomy={measurement:'skull-to-chin',targetHeadPx:24.225774996334824,sourceHeadPx:heads};j.measurementUncertaintyPx=u;j.calibrationNotes=note+' Approximate anatomy, not art approval or final QA.';fs.writeFileSync(p,JSON.stringify(j,null,2)+'\n');}
let inv=JSON.parse(fs.readFileSync(base+'production/full-redraw-inventory.json'));inv.find(a=>a.name==='specialUp').version=7;fs.writeFileSync(base+'production/full-redraw-inventory.json',JSON.stringify(inv,null,2)+'\n');
