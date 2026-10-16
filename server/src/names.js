// Nickname filter (ADR 0036, ENG-095): a name with a slur or obvious profanity becomes "Player<digits>". The roots
// are ROT13-encoded so the source reads clean; decode() turns them back at load. Matching runs on a normalized name:
// lower case, look-alike digits and symbols as letters (0 o, 1 i, 3 e, 4 a, 5 s, 7 t, @ a, $ s), and also with
// repeated letters collapsed (fuuuck). SUBSTR roots count anywhere in the name; WORD roots only as a whole word (or
// the whole name without spaces), since they hide inside ordinary words (cockpit, grape, spicy, circumstance).
const decode = (s) => s.replace(/[a-z]/g, (c) => String.fromCharCode(((c.charCodeAt(0) - 97 + 13) % 26) + 97));
const SUBSTR = ["shpx","fuvg","phag","avttre","avttn","snttbg","ergneq","juber","ovgpu","chffl","nffubyr","uvgyre","genaal","cbea","zbyrfg","crqb","encvfg","wvmm","qvyqb"].map(decode);
const WORD = new Set(["qvpx","pbpx","phz","snt","encr","fcvp","xvxr","puvax","fyhg","gjng","jnax","cravf","intvan","anmv","onfgneq","gvgf","obbof","nany","frk","avt","pbba","tbbx","xxx"].map(decode));
const LOOK = { 0: 'o', 1: 'i', 3: 'e', 4: 'a', 5: 's', 7: 't', '@': 'a', $: 's', '!': 'i', '|': 'i' };

const norm = (s) => s.toLowerCase().replace(/[013457@$!|]/g, (c) => LOOK[c]).normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
const squeeze = (s) => s.replace(/(.)\1+/g, '$1');

export function isRude(name) {
  const n = norm(String(name ?? ''));
  const words = n.split(/[^a-z]+/).filter(Boolean);
  const joined = words.join('');
  for (const v of [joined, squeeze(joined)]) if (SUBSTR.some((r) => v.includes(r))) return true;
  return [...words, joined].some((w) => WORD.has(w) || WORD.has(squeeze(w)) || WORD.has(w.replace(/s$/, '')));
}

// the name as shown: letters, digits, spaces and _ . - (16 at most); a rude one becomes Player<digits>
export function cleanName(s, fallbackSeed = 0) {
  const name = String(s ?? '').replace(/[^\p{L}\p{N} _.-]/gu, '').replace(/\s+/g, ' ').trim().slice(0, 16);
  if (!name) return 'Player';
  return isRude(name) ? `Player${100 + (Math.abs(fallbackSeed) % 900)}` : name;
}
