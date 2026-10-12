import fs from 'node:fs';
import path from 'node:path';
import { loadPacked } from '../../../../../tools/scale-audit.mjs';
import { readPng, newImage, blit, encodePng } from '../../../../../tools/pack-sprites.mjs';

const dir = 'art/characters/gojo/production/title-style';
const packed = loadPacked('gojo', path.resolve(dir, 'qa-public'));
const idle = packed.anims.find((a) => a.name === 'idle');
const squat = packed.anims.find((a) => a.name === 'jumpSquat');
if (!idle || !squat) throw new Error('Missing atlas cells');
const image = newImage(1024, 256);
blit(image, readPng('art/characters/gojo/reference/title_neutral_approved.png'), 0, 0);
blit(image, idle.cells[0], 256, 0);
blit(image, idle.cells[4], 512, 0);
blit(image, squat.cells[0], 768, 0);
fs.writeFileSync(`${dir}/jumpSquat-compare.png`, encodePng(image));
