// Watching an online match (ADR 0036, ENG-094). The lobby feeds every frame both players' inputs are confirmed for;
// the spectator replays them a little behind the players and never predicts, so it never rolls back. Someone who
// joins mid-match gets every frame so far and fast-forwards quietly (Game.quiet) to a moment before the present.
// Same interface as RollbackSession for Game: tick() runs a frame (or waits), applyInputs() feeds the pads.
import { applyInput } from './rollback.js';

const BUFFER = 24; // frames kept in hand before playing (0.4 s): the feed arrives in batches of six
const CATCH_UP = 240; // further behind than this: fast-forward quietly

export class SpectateSession {
  constructor(game) {
    this.game = game;
    this.reset();
  }

  reset() {
    this.inputs = [[], []];
    this.cur = [0, 0];
    this.buffering = true;
    this.ticks = 0;
    this.stats = { frames: 0, waits: 0, skipped: 0 };
  }

  // confirmed frames from the lobby: (first frame, player 1's inputs, player 2's)
  feed(start, a, b) {
    const [A, B] = this.inputs;
    for (let k = 0; k < a.length; k++) {
      if (start + k !== A.length) continue; // each frame once, in order
      A.push(a[k]);
      B.push(b[k]);
    }
  }

  tick() {
    const g = this.game;
    this.ticks++;
    let behind = this.inputs[0].length - g.frameNo;
    if (behind > CATCH_UP) {
      const n = behind - BUFFER;
      g.quiet(() => { for (let k = 0; k < n; k++) this.simulate(); });
      this.stats.skipped += n;
      this.catchUpView();
      behind = BUFFER;
    }
    if (this.buffering) {
      if (behind < BUFFER) { this.stats.waits++; return false; }
      this.buffering = false;
    }
    if (behind <= 0) {
      this.buffering = true; // ran dry (a slow feed): fill up again rather than stutter frame by frame
      this.stats.waits++;
      return false;
    }
    this.simulate();
    // drift back toward the buffer when the feed got ahead (a burst after a stall): a third faster for a while
    if (behind > BUFFER * 3 && this.ticks % 3 === 0) this.simulate();
    return true;
  }

  simulate() {
    const g = this.game, f = g.frameNo;
    this.cur[0] = this.inputs[0][f];
    this.cur[1] = this.inputs[1][f];
    g.fixedUpdate();
    this.stats.frames++;
  }

  applyInputs(game) {
    game.pads.forEach((pad, p) => applyInput(pad, this.cur[p]));
  }

  // a quiet fast-forward skipped the camera cuts and HUD calls of what it ran through: set the view for where the
  // match is now
  catchUpView() {
    const g = this.game;
    if (g.state === 'intro') return;
    g.hud.showCards(false);
    if (g.state === 'matchEnd' || g.state === 'results') {
      g.hud.show(false);
      g.cam.set('results', g.roundWinner);
    } else {
      g.hud.show(true);
      g.cam.set('fight');
    }
    g.cam.snap();
  }
}
