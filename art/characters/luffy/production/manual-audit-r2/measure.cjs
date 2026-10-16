const fs=require('fs');
// Manually read native atlas endpoints. Each row is knee center to ankle above sandal;
// selected visible leg may change with pose. null means no defensible projected shin.
const shins={
 idle:[[77,174,53,221],[77,175,53,222],[78,174,53,221],[77,175,53,222],[77,174,53,221],[77,175,53,222],[77,174,53,221],[77,175,53,222]],
 run:[[187,176,181,226],[111,179,124,225],[159,177,180,225],[142,185,154,226],[106,184,126,225],[132,181,119,226],[145,178,175,225],[143,187,154,226]],
 dash:[[199,181,179,227],[184,183,165,226]],
 jumpUp:[[195,184,169,223],null],
 jumpFall:[[176,173,147,214],[170,175,149,223]],
 land:[[87,187,48,227],[83,187,54,226]],
 light1:[[77,177,54,225],[78,179,54,225],[81,177,55,225],[79,177,54,225],[79,179,51,227],[78,179,51,227],[78,179,52,227]],
 light2:[[82,181,60,226],[91,182,49,226],[91,185,54,226],[93,186,52,226],[80,183,50,227],[78,182,50,227],[80,182,51,227]],
 light3:[[85,174,73,225],[140,174,126,225],[141,174,126,225],[139,174,124,225],[141,177,126,226],[139,176,126,226],[87,177,70,226]],
 light4:[[83,178,58,225],[149,177,170,225],[130,181,128,227],[140,178,132,226],[139,179,132,227],[139,180,128,228],[145,183,166,226],[80,181,49,226]],
 heavy:[[85,183,62,225],[85,190,65,226],[173,184,175,226],[90,187,68,226],[91,189,62,226],[91,188,64,226],[89,185,62,226],[83,186,58,226]],
 airLight1:[[193,183,152,215],[190,184,144,211],[198,185,151,212],[198,185,151,212],[190,185,149,215]],
 airHeavy:[null,null,null,null,null,[80,192,36,224]],
 guard:[[81,184,55,225],[80,185,55,225]],
 hurtHigh:[[79,182,51,226],[94,184,67,226],[87,185,58,226]],
 launched:[[94,192,112,224],[101,190,118,226]],
 down:[[168,196,204,225],[182,213,240,221]],
 getup:[[173,183,213,222],[170,174,190,223],[107,222,60,220],null,[69,181,34,227]],
 charge:[[66,174,39,226],[64,174,39,226],[64,174,39,226],[64,174,39,226]],
 beamCharge:[[78,181,49,226],[78,181,49,226],[78,181,49,226]],
 beamFire:[[68,177,41,226],[64,177,38,226],[64,177,38,226]],
 special:[[79,184,53,227],[80,184,55,227],[80,184,55,227],[80,184,55,227],[79,184,53,227],[79,184,53,227],null,null],
 win:[[95,175,75,224],[95,175,75,224],[95,175,75,224],[95,175,75,224]]
};
const segment=p=>p?{endpoints:[[p[0],p[1]],[p[2],p[3]]],projectedPx:+Math.hypot(p[2]-p[0],p[3]-p[1]).toFixed(1),lengthUncertaintyPx:6,ratioToIdle:+(Math.hypot(p[2]-p[0],p[3]-p[1])/Math.hypot(24,47)).toFixed(3)}:{unmeasurable:'Foreshortening/occlusion or damaged frame prevents a defensible stable projected shin; no numeric pass for this segment.'};
const rows=Object.entries(shins).flatMap(([animation,points])=>points.map((p,frame)=>({animation,frame,shin:segment(p)})));
const additional=[
 ['idle',0,'neckBaseToSash',[126,93,115,133],6],['idle',0,'sashWidth',[101,133,126,133],4],['idle',0,'leftForearm',[77,109,107,97],6],['idle',0,'sandalTopToSole',[51,227,48,239],3],
 ['neutral',0,'neckBaseToSash',[121,65,124,108],6],['neutral',0,'shin',[92,174,73,230],6],['neutral',0,'sashWidth',[112,108,137,108],4],
 ['combat',0,'neckBaseToSash',[132,94,121,133],6],['combat',0,'shin',[69,179,45,228],6],['combat',0,'sashWidth',[106,134,133,134],4],
 ['guard',0,'sashWidth',[106,139,132,139],4],['guard',1,'sashWidth',[106,140,132,140],4],
 ['guard',0,'forearmProjected',[121,118,145,99],6],['guard',1,'forearmProjected',[121,118,144,100],6],
 ['land',0,'neckBaseToSash',[129,153,110,174],8],['land',1,'neckBaseToSash',[135,114,121,148],6],
 ['jumpUp',0,'neckBaseToSash',[157,112,140,147],6],['jumpUp',1,'neckBaseToSash',[147,111,139,144],7],
 ['airHeavy',0,'neckBaseToSash',[169,90,169,128],6],['airHeavy',5,'neckBaseToSash',[164,120,133,154],8],
 ['heavy',0,'neckBaseToSash',[125,107,115,144],6],['heavy',5,'neckBaseToSash',[125,108,126,143],7],
 ['launched',0,'neckBaseToSash',[58,139,77,162],6],['launched',1,'neckBaseToSash',[65,138,82,160],6],
 ['charge',0,'neckBaseToSash',[145,101,126,136],6],['beamCharge',0,'neckBaseToSash',[129,99,118,138],6],['beamFire',0,'neckBaseToSash',[121,94,110,132],6]
];
for(let f=0;f<7;f++){
 // Each light1 recovery/strike frame retains the same legs; torso turns modestly.
 const torsos=[[124,95,114,136],[124,95,114,136],[126,94,117,135],[126,94,117,135],[126,95,115,136],[125,95,115,136],[125,95,115,136]];
 additional.push(['light1',f,'neckBaseToSash',torsos[f],6],['light1',f,'sashWidth',[101,136,127,136],4],['light1',f,'sandalTopToSole',[53,228,51,239],3]);
}
for(let f=0;f<4;f++)additional.push(['win',f,'neckBaseToSash',[129,60,134,108],6],['win',f,'sashWidth',[116,109,147,109],4],['win',f,'leftForearm',[72,74,86,42],6],['win',f,'sandalTopToSole',[72,229,70,239],3]);
fs.writeFileSync(__dirname+'/measurements.json',JSON.stringify({method:'Independent manual approximate visible endpoints from actual 48-color atlas cells and exact reference crops. Native pixel coordinates, rounded; identical stable points across breathing frames intentionally rounded identically. Projected lengths are NOT reconstructed bone lengths. Shin ratios use approved idle left shin52.8px. A ratio alone does not imply failure where pose changes projection; null never means numeric pass. Additional body landmarks supplement each sequence; concealed joints not invented.',rows,additional:additional.map(([animation,frame,name,p,u])=>({animation,frame,name,...segment(p),lengthUncertaintyPx:u,ratioToIdle:undefined}))},null,2));
console.log(Object.fromEntries(Object.entries(shins).map(([n,a])=>[n,a.map(p=>segment(p).projectedPx??null)])));
