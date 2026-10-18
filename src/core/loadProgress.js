// Load progress for the loading screen's bar (ENG-102, ADR 0043): every art fetch reports here (loadImage,
// fetchArtJson), weighted by its size from art-index.json when production knows it, so the bar follows bytes rather
// than file count (one fighter sheet is ~3 MB, a portrait ~10 kB). A phase (begin) restarts the count: the boot
// phase covers what the title screen needs, the next one the fighters and the world art that load behind it.
const listeners = new Set();
const state = { phase: 'boot', total: 0, done: 0, files: 0, filesDone: 0 };

const emit = () => { for (const fn of listeners) fn(state); };

export const loadProgress = {
  state,
  begin(phase) {
    Object.assign(state, { phase, total: 0, done: 0, files: 0, filesDone: 0 });
    emit();
  },
  // Wraps one fetch: counts its weight as pending until the promise settles (either way: a missing file is done too).
  track(promise, weight = 1) {
    state.total += weight;
    state.files++;
    emit();
    const settle = () => { state.done += weight; state.filesDone++; emit(); };
    promise.then(settle, settle);
    return promise;
  },
  frac() {
    return state.total ? state.done / state.total : 0;
  },
  onChange(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};
