// Cloudflare Turnstile (ADR 0036, ENG-095): the anti-bot check before opening a public room. Cloudflare's script loads
// only when someone opens one (the game has no other outside script); the widget runs in the given element, usually
// without asking anything, and hands back a one-time token the lobby server checks (server/src/room.js verify()).
// A page on localhost uses Cloudflare's always-pass test key, matching the local server's test secret. Off in
// production for now (the user's call, 2026-10-16): SITEKEY is empty, so public rooms open without the check; to switch
// it on, create the widget, put its site key here and deploy the game, then set the server's secret (server/README.md).
const TEST_SITEKEY = '1x00000000000000000000AA';
export const SITEKEY = ''; // the gcd-tourney rooms widget on the user's Cloudflare account (server/README.md)
const SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

let loading = null;
const load = () => (loading ||= new Promise((resolve, reject) => {
  const s = document.createElement('script');
  s.src = SCRIPT;
  s.async = true;
  s.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error('no turnstile')));
  s.onerror = () => { loading = null; reject(new Error('could not load the check')); };
  document.head.append(s);
}));

export const sitekey = () => (/^(localhost|127\.0\.0\.1)$/.test(location.hostname) ? TEST_SITEKEY : SITEKEY);
export const checkOn = () => !!sitekey();

// a token for opening a room, from a widget drawn in `el` (removed again either way)
export async function roomToken(el) {
  const key = sitekey();
  if (!key) throw new Error('Public rooms are not set up yet.');
  const ts = await load();
  return new Promise((resolve, reject) => {
    let id = null;
    const done = (fn, v) => {
      try { if (id != null) ts.remove(id); } catch { /* already gone */ }
      fn(v);
    };
    id = ts.render(el, {
      sitekey: key,
      action: 'create_room',
      theme: 'dark',
      callback: (token) => done(resolve, token),
      'error-callback': () => done(reject, new Error('The check did not pass. Try again.')),
      'expired-callback': () => done(reject, new Error('The check expired. Try again.')),
    });
  });
}
