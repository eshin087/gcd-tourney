import fs from 'node:fs';
import path from 'node:path';
const [source, name] = process.argv.slice(2);
if (!/^[A-Za-z0-9_]+\.png$/.test(name)) throw new Error('Invalid destination');
const folder = /_[AB]\.png$/.test(name) ? 'raw/_parts' : 'raw';
const target = `art/characters/gojo/${folder}/${name}`;
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL);
console.log(target);
