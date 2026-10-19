// What the live announcer says (ENG-118, ADR 0048): one entry per moment he can comment, read by src/world/announcer.js.
//   style  bubble shape (src/ui/speechBubble.js): 'talk' round, 'shout' spiky starburst, 'panic' wobbly
//   prio   0 filler .. 5 KO: a line shows when no bubble with a higher priority is still up
//   cool   seconds before the same moment can be commented again
//   anim   his reaction while he says it (a missing animation plays its fallback, worldArt.js NPC_FALLBACK), for
//          `secs` seconds; `hold` stops his walk for that long; `look` is who he faces: 'A', 'B' or the fight
//   lines  one is picked at random, never the same twice in a row. {A} the fighter doing it, {B} the other one,
//          {M} the move's name, {N} a number. Original lines in the spirit of the tournament MC, no quotes.
export const LINES = {
  // the intro flythrough and the round calls (Announcer.watchFlow)
  welcome: { style: 'shout', prio: 4, anim: 'shout', secs: 1.4, lines: ['LADIES AND GENTLEMEN!!', 'ARE YOU READY, FOLKS?!', 'THE MOMENT YOU\'VE BEEN WAITING FOR!!'] },
  welcome2: { style: 'talk', prio: 4, anim: 'point', secs: 1.4, lines: ['Welcome to the World Martial Arts Tournament!!', 'The strongest fighters under heaven meet today!!', 'Today\'s match is one for the history books!!'] },
  introA: { style: 'shout', prio: 4, anim: 'point', secs: 1.2, look: 'A', lines: ['In this corner... {A}!!', 'First up... {A}!!', 'Give it up for... {A}!!'] },
  introB: { style: 'shout', prio: 4, anim: 'point', secs: 1.2, look: 'A', lines: ['And the challenger... {A}!!', 'Facing them... {A}!!', 'And their opponent... {A}!!'] },
  round: { style: 'talk', prio: 4, anim: 'point', secs: 1.0, lines: ['Fighters, take your positions!', 'Round {N}! Are you ready?!', 'Here we go, round {N}!'] },
  matchPoint: { style: 'talk', prio: 4, anim: 'point', secs: 1.2, look: 'A', lines: ['One more round and {A} takes it all!', '{A} is one round from victory!'] },
  finalRound: { style: 'shout', prio: 4, anim: 'shout', secs: 1.2, lines: ['FINAL ROUND!! Everything is on the line!!', 'It all comes down to this!!'] },
  begin: { style: 'shout', prio: 4, anim: 'shout', secs: 1.0, lines: ['BEGIN!!', 'LET THE MATCH BEGIN!!', 'FIGHT!!!', 'START!!'] },

  // techniques (arena cues from game.js)
  special: { style: 'talk', prio: 2, cool: 3, anim: 'point', secs: 1.0, hold: 0.6, look: 'A', lines: ['{M}!!', '{A} unleashes {M}!!', 'Here comes {M}!!', 'Whoa!! That\'s {M}!!', 'What a technique!! {M}!', '{A} goes for {M}!!'] },
  super: { style: 'shout', prio: 3, cool: 3, anim: 'shout', secs: 1.3, look: 'A', lines: ['{A} is going all out!!', '{M}!! UNBELIEVABLE POWER!!', 'Look at that energy!!', '{A} isn\'t holding back!!', '{M}?!! INCREDIBLE!!'] },
  counter: { style: 'shout', prio: 4, cool: 2, anim: 'shocked', secs: 1.2, look: 'A', lines: ['A COUNTER!! {A} answers back!!', '{A} fires right back!!'] },
  ultimate: { style: 'panic', prio: 4, cool: 3, lines: ['EVERYBODY GET DOWN!!', 'Th-that\'s {M}?!', '{A}\'s ULTIMATE!! TAKE COVER!!', 'The whole arena is shaking!!'] },
  domain: { style: 'panic', prio: 4, cool: 5, lines: ['Wh-where did the arena go?!', 'What is this place?!'] },
  domainEnd: { style: 'talk', prio: 3, cool: 5, anim: 'shocked', secs: 1.2, lines: ['What... what just happened?!', 'Did anyone see that?!', 'We\'re back?! What WAS that?!'] },
  clash: { style: 'shout', prio: 3, cool: 6, lines: ['A CLASH!! Neither one is backing down!!', 'Power against power!!', 'Their attacks are colliding!!', 'INCREDIBLE!! Dead even!!'] },
  clashWin: { style: 'shout', prio: 3, cool: 4, anim: 'point', secs: 1.0, look: 'A', lines: ['{A} breaks through!!', '{A} overpowers {B}!!', '{A} wins the clash!!'] },
  combo: { style: 'talk', prio: 2, cool: 5, anim: 'point', secs: 0.9, look: 'A', lines: ['{N} hits! Beautiful combo!', '{A} links it all together!', 'What a string by {A}!'] },
  comboBig: { style: 'shout', prio: 3, cool: 5, anim: 'shocked', secs: 1.2, look: 'A', lines: ['{N} HITS!! {A} is unstoppable!!', 'What a combo by {A}!!', '{B} can\'t escape!! {N} hits!!'] },
  comboLegend: { style: 'shout', prio: 3, cool: 5, anim: 'shocked', secs: 1.4, look: 'A', lines: ['{N} HITS?! LEGENDARY!!', 'I\'ve never seen anything like it!! {N} HITS!!'] },
  parry: { style: 'shout', prio: 2, cool: 5, anim: 'point', secs: 0.9, look: 'A', lines: ['PARRIED!! What reflexes!!', '{A} reads it perfectly!!', 'Blocked clean!! Amazing timing!!'] },
  dodge: { style: 'talk', prio: 1, cool: 7, look: 'A', lines: ['Missed!! {A} is too quick!', 'Where did {A} go?!', 'Not even close!'] },
  vanish: { style: 'shout', prio: 2, cool: 8, anim: 'shocked', secs: 1.0, lines: ['They\'re moving faster than the eye can see!!', 'I can\'t even follow them!!'] },
  burst: { style: 'shout', prio: 2, cool: 6, anim: 'point', secs: 0.9, look: 'A', lines: ['{A} bursts free!!', '{A} won\'t be held down!!'] },
  punish: { style: 'talk', prio: 2, cool: 6, anim: 'point', secs: 0.9, look: 'A', lines: ['{A} punishes it!!', 'What a reversal by {A}!!'] },
  bounce: { style: 'shout', prio: 2, cool: 6, anim: 'shocked', secs: 0.9, lines: ['Off the wall!!', 'What a slam!!', 'That has to hurt!!'] },
  throw: { style: 'talk', prio: 1, cool: 7, look: 'A', lines: ['{A} grabs {B}!', 'Into the throw!'] },
  throwBreak: { style: 'talk', prio: 2, cool: 7, look: 'A', lines: ['{A} breaks the throw!', 'Nice escape by {A}!'] },
  maxPower: { style: 'shout', prio: 2, cool: 10, anim: 'shocked', secs: 1.0, look: 'A', lines: ['{A}\'s power is off the charts!!', '{A} is at FULL POWER!!'] },
  charge: { style: 'talk', prio: 1, cool: 12, anim: 'point', secs: 1.0, look: 'A', lines: ['{A} is powering up!', 'Feel that energy, folks!', 'The air is trembling!'] },

  // how the fight is going (Announcer.watchFight)
  firstHit: { style: 'talk', prio: 1, anim: 'point', secs: 0.9, look: 'A', lines: ['First strike goes to {A}!', '{A} lands the first blow!'] },
  knockdown: { style: 'talk', prio: 2, cool: 6, anim: 'point', secs: 0.9, look: 'B', lines: ['{B} hits the mat!!', 'Down goes {B}!!', '{B} is down... but not out!'] },
  lowHp: { style: 'shout', prio: 2, anim: 'shocked', secs: 1.0, look: 'B', lines: ['{B} is in serious trouble!!', '{B} can barely stand!!', 'One more hit could end it!!'] },
  thread: { style: 'shout', prio: 2, anim: 'shocked', secs: 1.0, look: 'B', lines: ['{B} is hanging by a thread!!', 'It\'s not over yet for {B}!!'] },
  comeback: { style: 'shout', prio: 3, cool: 10, anim: 'shocked', secs: 1.3, look: 'A', lines: ['WHAT A COMEBACK BY {A}!!', '{A} turns the tables!!', 'I don\'t believe it!! {A} is back in this!!'] },
  dominating: { style: 'talk', prio: 1, cool: 20, anim: 'point', secs: 1.0, look: 'A', lines: ['{A} is dominating this match!', '{B} can\'t find an answer!', 'It\'s all {A} right now!'] },
  close: { style: 'shout', prio: 2, lines: ['Neck and neck!! Anyone\'s match!!', 'These two are dead even!!'] },
  time30: { style: 'talk', prio: 2, lines: ['Thirty seconds left!', 'The clock is running down!'] },
  time10: { style: 'shout', prio: 3, anim: 'shout', secs: 1.0, lines: ['TEN SECONDS!!', 'Time is running out!!'] },
  flee: { style: 'panic', prio: 1, cool: 8, lines: ['Whoa whoa whoa!!', 'Not this way!!', 'Yikes!!', 'I\'m just the announcer!!'] },
  filler: { style: 'talk', prio: 0, lines: ['What a match, folks!', 'The crowd is on its feet!', 'Incredible speed!', 'Neither fighter gives an inch!', 'This is what the tournament is all about!', 'Can you feel the tension?!', '{A} and {B} are giving it everything!'] },
  fillerLead: { style: 'talk', prio: 0, look: 'A', lines: ['{A} has the upper hand!', '{B} needs to turn this around!', 'Can {B} come back from this?!'] },

  // the end of a round (the KO count happens over the fallen fighter, Announcer.koRoute)
  ko: { style: 'shout', prio: 5, anim: 'shocked', secs: 1.0, look: 'B', lines: ['{B} IS DOWN!!', 'IT\'S OVER!!', 'WHAT A FINISH!!'] },
  perfect: { style: 'shout', prio: 5, anim: 'shocked', secs: 1.2, look: 'A', lines: ['PERFECT!! Not a single scratch!!', 'FLAWLESS!! {A} wasn\'t even touched!!'] },
  crash: { style: 'panic', prio: 5, lines: ['Right into the stands!!', 'Somebody call a medic!!'] },
  count: { style: 'shout', prio: 5, anim: 'micThrust', secs: 0.6, look: 'B', lines: ['{N}!!'] },
  roundWin: { style: 'shout', prio: 5, anim: 'point', secs: 2.0, look: 'A', lines: ['{A} takes the round!!', 'The round goes to {A}!!', 'What a performance by {A}!!'] },
  matchWin: { style: 'shout', prio: 5, anim: 'shout', secs: 2.0, look: 'A', lines: ['Your winner... {A}!!', '{A} is the champion!!', 'The tournament belongs to {A}!!'] },
  timeup: { style: 'shout', prio: 4, anim: 'shout', secs: 1.0, lines: ['TIME!! It goes to the judges!!', 'Time\'s up!!'] },
  draw: { style: 'panic', prio: 4, anim: 'shocked', secs: 1.4, lines: ['A DRAW?! Unbelievable!!', 'Dead even!! A DRAW!!'] },
};

// technique tags (Game.tag, the TAGS table in src/ui/hud.js) -> the LINES moment he comments
export const TAG_LINES = {
  parry: 'parry', dodge: 'dodge', airDodge: 'dodge', backstep: 'dodge', vanish2: 'vanish', vanish3: 'vanish',
  burst: 'burst', punish: 'punish', reversal: 'punish', wallBounce: 'bounce', wallBounce2: 'bounce', handball: 'bounce',
  groundBounce: 'bounce', throwBreak: 'throwBreak', clashBreak: 'clashWin',
};
