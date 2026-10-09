// Character roster. To add a fighter: create a file like naruto.js, import it here.
import naruto from './naruto.js';
import sasuke from './sasuke.js';
import killua from './killua.js';
import gojo from './gojo.js';
import { buildAnims } from '../art/rig/anims.js';

export const ROSTER = [naruto, sasuke, killua, gojo];

for (const c of ROSTER) {
  c.anims = buildAnims({ stance: c.stance, extra: c.extraAnims, runLean: c.runLean, runArms: c.runArms });
}

export function getChar(id) {
  return ROSTER.find((c) => c.id === id) || ROSTER[0];
}
