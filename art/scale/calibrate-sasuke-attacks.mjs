import fs from 'node:fs';
import crypto from 'node:crypto';

// Visual source measurements, not silhouette measurements. The skull crowns are
// under hair; each estimate must be checked against the packed idle and limb lengths.
const samples = {
  light3: { A: [[188,192,211,292],[496,192,519,292],[788,192,811,292],[1252,192,1275,292]], B: [[247,172,265,302],[755,172,773,302],[1258,172,1276,302]] },
  light4: { A: [[187,283,191,366],[461,245,469,326],[699,245,708,327],[980,268,981,351],[1346,264,1347,347]], B: [[297,206,306,330],[785,241,793,365],[1282,242,1290,366]] },
  heavy: { A: [[218,335,226,420],[530,405,539,490],[801,302,808,387],[1065,214,1074,300],[1370,159,1377,245]], B: [[323,200,334,319],[857,345,877,462],[1330,200,1341,319]] },
};
const ledger = {};
for (const [anim, parts] of Object.entries(samples)) {
  const frames = [];
  for (const [part, points] of Object.entries(parts)) {
    const file = `art/characters/sasuke/raw/_parts/${anim}_v01_${part}.png`;
    const sha256 = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
    for (const [x0,y0,x1,y1] of points) frames.push({source:file,sha256,crown:[x0,y0],chin:[x1,y1],sourceHeadPx:+Math.hypot(x1-x0,y1-y0).toFixed(3),certainty:'estimated crown beneath hair; final packed verification pending'});
  }
  const side = { anatomy: { measurement: 'skull-to-chin', targetHeadPx: 31, sourceHeadPx: frames.map(f=>f.sourceHeadPx) }, calibrationNotes: 'Visual source landmarks in art/scale/sasuke-attack-landmarks.json. Crowns obscured by hair: provisional until packed anatomy and transitions are checked.' };
  fs.writeFileSync(`art/characters/sasuke/raw/${anim}_v01.json`,JSON.stringify(side,null,2)+'\n');
  ledger[anim] = frames;
}
fs.writeFileSync('art/scale/sasuke-attack-landmarks.json',JSON.stringify(ledger,null,2)+'\n');
