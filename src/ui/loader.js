// The loading screen (ENG-102, ADR 0043). Its markup sits in index.html / lab.html so it paints before any script
// arrives (title art, logo, an empty bar); this module drives the bars there and on the portrait rotate screen from
// loadProgress. Modes: full screen while the title screen's art loads ('boot') and while a fight waits for its
// fighters ('wait'), a slim strip over the title while the fighters load behind it ('mini'), hidden once all is in.
import { loadProgress } from '../core/loadProgress.js';

const LABEL = { boot: 'LOADING', world: 'LOADING FIGHTERS' };

export class Loader {
  constructor(el) {
    this.el = el;
    this.shown = 0; // the bar never runs backwards inside a phase, though new files keep joining the total
    this.phase = null;
    this.mode = 'boot';
    this.finished = false;
    this.paint = this.paint.bind(this);
    loadProgress.onChange(this.paint);
    this.paint(loadProgress.state);
  }

  paint(st) {
    if (this.finished) return;
    if (st.phase !== this.phase) {
      this.phase = st.phase;
      this.shown = 0;
    }
    this.shown = Math.max(this.shown, loadProgress.frac());
    const pct = Math.floor(this.shown * 100);
    const label = `${LABEL[st.phase] ?? 'LOADING'} ${pct}%`;
    for (const f of document.querySelectorAll('[data-load-fill]')) f.style.transform = `scaleX(${this.shown})`;
    for (const l of document.querySelectorAll('[data-load-label]')) l.textContent = label;
    document.documentElement.dataset.load = st.phase;
  }

  setMode(mode) {
    this.mode = mode;
    if (!this.el) return;
    this.el.classList.toggle('mini', mode === 'mini');
    this.el.classList.toggle('done', mode === 'done');
  }

  // the title screen is up: the fighters' progress moves to a strip at the bottom
  mini() { if (!this.finished) this.setMode('mini'); }

  // something needs the fighters before they are in: full screen again
  wait() { if (!this.finished) this.setMode('wait'); }

  done() {
    this.finished = true;
    this.setMode('done');
    document.documentElement.dataset.load = 'done';
  }
}
