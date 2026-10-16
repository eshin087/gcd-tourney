const fs=require('fs');const p=__dirname;let s=fs.readFileSync(p+'/audit-fixture1.cjs','utf8').replaceAll('quantized-crops','fixture2-crops').replaceAll('fixture-public','fixture2-public').replaceAll('REASSEMBLY_R02_FIXTURE1','REASSEMBLY_R02_FIXTURE2').replaceAll('/r02-','/r02f2-').replace('all64 frames','all81 frames');s=s.replace('const baseline=',`marks.jumpFall=[0,[151,70,136,106],[119,106,153,110],[110,193,102,237]];
marks.jumpUp=[0,[153,116,134,149],[115,148,151,154],[117,195,107,229]];
marks.jumpUpRecovery=[1,[164,102,145,129],[126,127,160,133],[113,201,102,238]];
marks.airLight1=[0,[198,67,183,102],[167,101,200,102],[130,195,116,238]];
marks.launched=[0,[32,89,63,115],[53,123,81,110],[118,202,139,237]];
marks.special=[3,[120,69,116,111],[96,112,135,112],[51,195,33,237]];
const baseline=`);s=s.replace("key==='light1Recovery'?'light1':key","key==='light1Recovery'?'light1':key==='jumpUpRecovery'?'jumpUp':key");fs.writeFileSync(p+'/audit-fixture2.cjs',s);
