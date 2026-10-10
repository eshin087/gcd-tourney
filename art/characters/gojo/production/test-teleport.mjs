import assert from 'node:assert/strict';
import { Vector3 } from 'three';
import { doSpecial, update } from '../../../../src/game/kit.js';
import { audio } from '../../../../src/core/audio.js';
audio.play = () => {};
function fighter(id) {
  return {
    def: { kit: { specials: { neutral: id } } }, pad: { mx: 0, my: 0 }, ki: 1000,
    pos: new Vector3(-1, 0, 0), vel: new Vector3(), side: 1,
    opp: { pos: new Vector3(1, 0, 0), side: -1 },
    game: { cam: { right: { x: 1, z: 0 } }, fx: { smoke() {}, spawn() {} }, onKitMove() {}, onVanish() {} },
    actor: { ghost() {}, setVisible(v) { this.visible = v; }, place() {}, setPhase() {} },
    canAfford() { return true; }, endMoveFx() {}, faceOpponent() {},
    setState(s, a) { this.state = s; this.anim = a; this.t = 0; },
    teleport(x, y, z) { this.pos.set(x, y, z); this.teleports = (this.teleports ?? 0) + 1; },
    startMove(name) { this.follow = name; this.state = 'attack'; }
  };
}
const legacy = fighter('rhythmEcho');
assert.ok(doSpecial(legacy)); assert.equal(legacy.hidden, true); assert.equal(legacy.anim, 'vanish');
legacy.t = 6; update(legacy); assert.equal(legacy.teleports, undefined);
legacy.t = 7; update(legacy); assert.equal(legacy.teleports, 1); assert.equal(legacy.follow, 'echoStrike'); assert.equal(legacy.hidden, false);
const blink = fighter('blink');
assert.ok(doSpecial(blink)); assert.equal(blink.hidden, false); assert.equal(blink.anim, 'specialUp');
blink.t = 6; update(blink); assert.equal(blink.hidden, true);
blink.t = 12; update(blink); assert.equal(blink.hidden, false); assert.equal(blink.pos.y, 2.3);
blink.t = 17; update(blink); assert.equal(blink.teleports, 1); assert.equal(blink.state, 'kit');
blink.t = 18; update(blink); assert.equal(blink.state, 'air'); assert.equal(blink.anim, 'jumpFall'); assert.equal(blink.teleports, 1);
console.log('PASS: legacy Rhythm Echo timing/follow-up and Blink visibility/recovery/one teleport');
