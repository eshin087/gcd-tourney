import fs from 'node:fs';
import crypto from 'node:crypto';
const rows = {
  light2: { version:2, width:3352, marks:[[128,149,133,215],[402,149,405,215],[653,149,659,215],[940,149,945,215],[1289,107,1298,177],[1594,107,1603,177],[1900,107,1909,177]] },
  light3: { version:2, width:3214, marks:[[136,169,142,236],[353,169,359,236],[605,169,616,235],[934,169,947,236],[1260,101,1272,179],[1585,101,1597,179],[1886,99,1900,177]] },
  special: { version:3, width:3464, marks:[[193,100,200,175],[578,145,581,212],[901,155,907,222],[1113,343,1118,378],[1304,343,1309,378],[1511,351,1515,385],[1762,362,1768,396],[1974,345,1979,380]] }
};
for (const [anim, row] of Object.entries(rows)) {
  const file = `art/characters/sasuke/raw/${anim}_v${String(row.version).padStart(2,'0')}`;
  const side = JSON.parse(fs.readFileSync(file+'.json'));
  side.sourceSha256 = crypto.createHash('sha256').update(fs.readFileSync(file+'.png')).digest('hex');
  side.measurements = row.marks.map((m,i) => {
    const p=m.map(n=>Math.round(n*row.width/2048));
    return {frame:i,crown:p.slice(0,2),chin:p.slice(2),tracedHeadPx:+Math.hypot(p[2]-p[0],p[3]-p[1]).toFixed(2),calibrationHeadPx:side.anatomy.sourceHeadPx[i],uncertaintyPx:6};
  });
  side.measurementUncertainty = { status:'visually traced, approximate', reason:'Coordinates refer to full stitched raw source. Skull crown is inferred beneath hair; +/-6 source px. Calibration values stay inside the approximate crown range; silhouette heights are cross-checks, not skull measurements.' };
  fs.writeFileSync(file+'.json',JSON.stringify(side,null,2)+'\n');
}
