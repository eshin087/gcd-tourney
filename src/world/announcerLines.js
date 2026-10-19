// What the live announcer says and does (ENG-118, ADR 0048; ENG-119): one entry per moment he reacts to, read by
// src/world/announcer.js. Since ENG-119 he talks only at the big moments (user 2026-10-18: "he talks way too much"):
// the rest are silent reactions, a pose and a manga symbol over his head (announcerSymbols.js), no text to read.
//   lines  what he may say; one is picked at random, never the same twice in a row. {A} the fighter doing it, {B} the
//          other one, {M} the move's name, {N} a number. Original lines in the spirit of the tournament MC, no quotes.
//          No `lines`: a silent reaction.
//   prio   0 .. 5 (KO): a line shows when no line that outranks it is still up; under 4 it also waits for the talk
//          gap (Announcer TALK_GAP); 4 and up are the round calls and the huge moments, never held back
//   cool   seconds before the same moment can come again
//   anim   his reaction for `secs` seconds (a missing animation plays its fallback, worldArt.js NPC_FALLBACK); `hold`
//          stops his walk for that long; `look` is who he faces: 'A', 'B' or the fight
//   sym    the symbol over his head (sweat, bang, what, anger, notes, steam, spark, dizzy)
//   style  kept for the data ('talk' | 'shout' | 'panic'); every caption looks the same on screen
export const LINES = {
  // the intro flythrough and the round calls (Announcer.flow)
  welcome: { style: 'shout', prio: 4, anim: 'shout', secs: 1.4, lines: ['LADIES AND GENTLEMEN!!', 'ARE YOU READY, FOLKS?!', 'THE MOMENT YOU\'VE BEEN WAITING FOR!!'] },
  welcome2: { style: 'talk', prio: 4, anim: 'point', secs: 1.4, lines: ['Welcome to the World Martial Arts Tournament!!', 'The strongest fighters under heaven meet today!!', 'Today\'s match is one for the history books!!'] },
  introA: { style: 'shout', prio: 4, anim: 'point', secs: 1.2, look: 'A', lines: ['In this corner... {A}!!', 'First up... {A}!!', 'Give it up for... {A}!!'] },
  introB: { style: 'shout', prio: 4, anim: 'point', secs: 1.2, look: 'A', lines: ['And the challenger... {A}!!', 'Facing them... {A}!!', 'And their opponent... {A}!!'] },
  round: { style: 'talk', prio: 4, anim: 'point', secs: 1.0, lines: ['Fighters, take your positions!', 'Round {N}! Are you ready?!', 'Here we go, round {N}!'] },
  matchPoint: { style: 'talk', prio: 4, anim: 'point', secs: 1.2, look: 'A', lines: ['One more round and {A} takes it all!', '{A} is one round from victory!'] },
  finalRound: { style: 'shout', prio: 4, anim: 'shout', secs: 1.2, lines: ['FINAL ROUND!! Everything is on the line!!', 'It all comes down to this!!'] },
  begin: { style: 'shout', prio: 4, anim: 'shout', secs: 1.0, lines: ['BEGIN!!', 'LET THE MATCH BEGIN!!', 'FIGHT!!!', 'START!!'] },

  // the huge moments: spoken
  super: { style: 'shout', prio: 3, cool: 6, anim: 'shout', secs: 1.3, look: 'A', sym: 'bang', lines: ['{A} is going all out!!', '{M}!! UNBELIEVABLE POWER!!', 'Look at that energy!!', '{M}?!! INCREDIBLE!!'] },
  counter: { style: 'shout', prio: 4, cool: 4, anim: 'shocked', secs: 1.2, look: 'A', sym: 'bang', lines: ['A COUNTER!! {A} answers back!!', '{A} fires right back!!'] },
  ultimate: { style: 'panic', prio: 4, cool: 4, sym: 'sweat', lines: ['EVERYBODY GET DOWN!!', 'Th-that\'s {M}?!', '{A}\'s ULTIMATE!! TAKE COVER!!'] },
  domain: { style: 'panic', prio: 4, cool: 8, lines: ['Wh-where did the arena go?!', 'What is this place?!'] },
  domainEnd: { style: 'talk', prio: 4, cool: 8, anim: 'shocked', secs: 1.2, sym: 'what', lines: ['What... what just happened?!', 'Did anyone see that?!', 'We\'re back?! What WAS that?!'] },
  struggle: { style: 'shout', prio: 3, cool: 8, sym: 'bang', lines: ['A CLASH!! Neither one is backing down!!', 'Power against power!!', 'INCREDIBLE!! Dead even!!'] },
  comboBig: { style: 'shout', prio: 3, cool: 8, anim: 'shocked', secs: 1.2, look: 'A', sym: 'bang', lines: ['{N} HITS!! {A} is unstoppable!!', 'What a combo by {A}!!', '{B} can\'t escape!! {N} hits!!'] },
  comboLegend: { style: 'shout', prio: 3, cool: 8, anim: 'cheer', secs: 1.6, look: 'A', sym: 'spark', lines: ['{N} HITS?! LEGENDARY!!', 'I\'ve never seen anything like it!! {N} HITS!!'] },
  comeback: { style: 'shout', prio: 3, cool: 12, anim: 'cheer', secs: 1.6, look: 'A', sym: 'bang', lines: ['WHAT A COMEBACK BY {A}!!', '{A} turns the tables!!', 'I don\'t believe it!! {A} is back in this!!'] },
  lowHp: { style: 'shout', prio: 3, anim: 'shocked', secs: 1.0, look: 'B', sym: 'sweat', lines: ['{B} is in serious trouble!!', '{B} can barely stand!!', 'One more hit could end it!!'] },
  thread: { style: 'shout', prio: 3, anim: 'shocked', secs: 1.0, look: 'B', sym: 'sweat', lines: ['{B} is hanging by a thread!!', 'It\'s not over yet for {B}!!'] },
  time10: { style: 'shout', prio: 3, anim: 'checkWatch', secs: 1.4, sym: 'bang', lines: ['TEN SECONDS!!', 'Time is running out!!'] },
  knocked: { style: 'panic', prio: 3, cool: 10, lines: ['Ow... I\'m okay!!', 'Hey, watch it!!', 'Not the suit!!', 'I\'m just the announcer!!'] },

  // the end of a round (the count happens over the fallen fighter, Announcer.flow)
  ko: { style: 'shout', prio: 5, anim: 'shocked', secs: 1.0, look: 'B', sym: 'bang', lines: ['{B} IS DOWN!!', 'IT\'S OVER!!', 'WHAT A FINISH!!'] },
  perfect: { style: 'shout', prio: 5, anim: 'cheer', secs: 1.4, look: 'A', sym: 'spark', lines: ['PERFECT!! Not a single scratch!!', 'FLAWLESS!! {A} wasn\'t even touched!!'] },
  crash: { style: 'panic', prio: 5, anim: 'wince', secs: 1.2, sym: 'sweat', lines: ['Right into the stands!!', 'Somebody call a medic!!'] },
  count: { style: 'shout', prio: 5, anim: 'micThrust', secs: 0.6, look: 'B', lines: ['{N}!!'] },
  roundWin: { style: 'shout', prio: 5, anim: 'point', secs: 2.0, look: 'A', lines: ['{A} takes the round!!', 'The round goes to {A}!!', 'What a performance by {A}!!'] },
  matchWin: { style: 'shout', prio: 5, anim: 'cheer', secs: 2.0, look: 'A', sym: 'spark', lines: ['Your winner... {A}!!', '{A} is the champion!!', 'The tournament belongs to {A}!!'] },
  timeup: { style: 'shout', prio: 4, anim: 'shout', secs: 1.0, lines: ['TIME!! It goes to the judges!!', 'Time\'s up!!'] },
  draw: { style: 'panic', prio: 4, anim: 'facepalm', secs: 2.0, sym: 'what', lines: ['A DRAW?! Unbelievable!!', 'Dead even!! A DRAW!!'] },

  // silent reactions: a pose and a symbol, nothing to read
  special: { prio: 1, cool: 9, anim: 'point', secs: 0.9, hold: 0.5, look: 'A', sym: 'bang' },
  clash: { prio: 2, cool: 8, anim: 'shocked', secs: 0.9, sym: 'bang' },
  clashWin: { prio: 2, cool: 5, anim: 'point', secs: 0.9, look: 'A', sym: 'bang' },
  combo: { prio: 1, cool: 8, anim: 'point', secs: 0.8, look: 'A' },
  parry: { prio: 2, cool: 6, anim: 'shocked', secs: 0.8, look: 'A', sym: 'bang' },
  vanish: { prio: 1, cool: 8, look: 'A', sym: 'what' },
  burst: { prio: 1, cool: 8, anim: 'point', secs: 0.8, look: 'A', sym: 'bang' },
  bounce: { prio: 2, cool: 6, anim: 'wince', secs: 1.0, sym: 'sweat' },
  brutal: { prio: 2, cool: 5, anim: 'wince', secs: 1.1, look: 'B', sym: 'sweat' },
  maxPower: { prio: 1, cool: 10, anim: 'shocked', secs: 0.9, look: 'A', sym: 'bang' },
  charge: { prio: 1, cool: 12, look: 'A', sym: 'sweat' },
  knockdown: { prio: 1, cool: 6, anim: 'wince', secs: 0.8, look: 'B' },
  whiff: { prio: 2, cool: 6, anim: 'facepalm', secs: 2.0, look: 'A', sym: 'what' },
  close: { prio: 2, sym: 'sweat' },
  time30: { prio: 1, anim: 'checkWatch', secs: 1.6 },
  flee: { prio: 1, cool: 6, sym: 'sweat' },
};

// technique tags (Game.tag, the TAGS table in src/ui/hud.js) -> the LINES moment he reacts with
export const TAG_LINES = {
  parry: 'parry', vanish2: 'vanish', vanish3: 'vanish', burst: 'burst', wallBounce: 'bounce', wallBounce2: 'bounce',
  handball: 'bounce', groundBounce: 'bounce', clashBreak: 'clashWin',
};
