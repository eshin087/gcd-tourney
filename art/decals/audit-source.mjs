import {readPng,removeBackground} from '../../tools/pack-sprites.mjs';
for(const p of process.argv.slice(2)){
 const a=readPng(p);removeBackground(a,{tol:72});let opaque=0,purple=0,colored=0;
 for(let i=0;i<a.data.length;i+=4)if(a.data[i+3]){const [r,g,b]=a.data.subarray(i,i+3);opaque++;if(Math.min(r,b)-g>30&&b-g>50)purple++;if(Math.max(r,g,b)-Math.min(r,g,b)>10)colored++;}
 console.log(JSON.stringify({file:p.split(/[\\/]/).pop(),opaque,purple,purplePct:purple/opaque*100,coloredPct:colored/opaque*100}));
}
