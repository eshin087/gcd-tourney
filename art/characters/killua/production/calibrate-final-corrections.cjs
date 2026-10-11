const fs=require('fs');
const base='art/characters/killua/';
// Source-space skull-axis estimates from correction ruler boards, never hair/bounding height.
const data=[
 ['getup',4,[70,70,70,70,70],15,'board07; f0 skull axis horizontal/tilted, nominal70 +/-15; first two tucked poses uncertain, f4 upright has comparable head. First-pose shoulder-hip roughly145, visible knee-ankle~115. Not a motion or floor clearance.'],
 ['throw',5,[80,80,80,80],10,'board07; f0 crown~107 chin~187. Shoulder~210 hip~365 =155; near knee~470 ankle~595 =125; tilted torso and hidden hip introduce15px uncertainty.'],
 ['superDash',4,[95,95],15,'board08; f0 inferred crown~210 chin~300 on tilted axis. Shoulder-hip axis~230, visible folded shin~150. Foreshortened far thigh is unresolved; do not fit to posed height.'],
 ['jumpSquat',4,[130],15,'board08; crown~385 chin~510; nominal130. Shoulder~520 hip~720 bent axis~290, near knee~800 ankle~945 =145 plus lateral axis. Thigh partly occluded, manual anatomy remains uncertain.'],
 ['land',3,[80,80],12,'board09; crouch crown~280 chin~360; same head in upright recovery. Crouch shoulder-hip about135, near knee-ankle axis~125, hip/thigh foreshortened.'],
 ['airRecover',4,[85,85,85],15,'board09; tilted skull crown~190 chin~270 on oblique axis, nominal85. Rolled second pose is rotated, same headmass; no vertical bbox head measurement. Tucked thigh occluded; full bone clearance pending.'],
 ['launched',3,[105,105],15,'board10; tilted skull crown~215 chin~300, oblique axis105. Long torso shoulder-hip~270; near thigh~170 and shin~190 with bent axis uncertainty20px. No posed-height scaling.'],
 ['spin',3,[85,85,85,85],15,'board10; f0 crown~220 chin~305, rotated other heads inferred same skeletal mass with15px uncertainty. Tucked/occluded hips prevent exact thigh certification.'],
 ['vanish',3,[80,80],12,'board11; f0 crown~245 chin~325, shoulder-hip about170, shin about120. f1 intentional teleport gaps across shorts/shins, not missing limb.'],
 ['down',4,[100,100],18,'Source head-left strict side elevation; horizontal skull axis about100 +/-18, not vertical hair bbox. Near-arm rests alongside torso. f1 lower-leg length potentially exceeds neutral; MANUAL HOLD pending knee-location review.'],
 ['ko',5,[180],25,'Source side elevation horizontal skull axis approximately180 +/-25; shoulder-hip~430, thigh~300, knee-ankle potentially~400. Knee is hidden by shorts; possible overlong shin means MANUAL HOLD, never cleared by head fit.']
];
for(const [name,v,heads,uncertainty,note] of data){const p=base+'raw/'+name+'_v'+String(v).padStart(2,'0')+'.json';const j=fs.existsSync(p)?JSON.parse(fs.readFileSync(p)):{};j.anatomy={measurement:'skull-to-chin',targetHeadPx:24.225774996334824,sourceHeadPx:heads};j.calibrationNotes=note;j.measurementUncertaintyPx=uncertainty;fs.writeFileSync(p,JSON.stringify(j,null,2)+'\n');}
let inv=JSON.parse(fs.readFileSync(base+'production/full-redraw-inventory.json'));
for(const a of inv){const d=data.find(x=>x[0]===a.name);if(d)a.version=d[1];if(a.name==='specialForward')a.version=9;}
fs.writeFileSync(base+'production/full-redraw-inventory.json',JSON.stringify(inv,null,2)+'\n');
