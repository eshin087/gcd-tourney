import fs from 'node:fs';
const mPath='art/manifest.json';
const m=fs.readFileSync(mPath,'utf8').split(/\r?\n/);
for(const name of ['voidShatterTL','voidShatterTR','voidShatterBL','voidShatterBR']){
  const i=m.findIndex(line=>new RegExp('^\\s*"'+name+'"\\s*:').test(line));
  if(i<0)throw new Error('Missing '+name);
  const match=m[i].match(/^(\s*)"[^\"]+"\s*:\s*(\{.*\})(,?)\s*$/);
  if(!match)throw new Error('Malformed '+name);
  const value=JSON.parse(match[2]);
  value.status='packed';
  m[i]=match[1]+JSON.stringify(name)+': '+JSON.stringify(value)+match[3];
}
const eol=fs.readFileSync(mPath,'utf8').includes('\r\n')?'\r\n':'\n';
fs.writeFileSync(mPath,m.join(eol));
const tPath='art/TRACKER.md',t=fs.readFileSync(tPath,'utf8'),teol=t.includes('\r\n')?'\r\n':'\n',rows=t.split(/\r?\n/);
for(const name of ['voidShatterTL','voidShatterTR','voidShatterBL','voidShatterBR']){
  const i=rows.findIndex(line=>line.startsWith('| '+name+' |'));
  if(i<0)throw new Error('Missing tracker '+name);
  const cols=rows[i].split('|');cols[6]=' packed ';rows[i]=cols.join('|');
}
fs.writeFileSync(tPath,rows.join(teol));
console.log('R2 tile rows now reflect packed, unapproved candidates.');
