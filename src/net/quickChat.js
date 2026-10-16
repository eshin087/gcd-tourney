// Quick-chat (ADR 0036, ENG-095): online rooms talk only in these lines and emotes, sent as an index, so no one can
// type anything at anyone. The server knows only how many there are (server/src/roomCore.js QUICK_COUNT): add lines at
// the end and raise that number in the same change; never reorder (a room's members all run the same build).
export const QUICK = [
  'Hi!', 'Good luck!', 'GG', 'Good game!', 'Nice combo!', 'Nice!', 'Wow!', 'Close one!',
  'Rematch?', 'One more!', 'Thanks!', 'Sorry!', 'Oops', 'Well played', "Let's go!", 'brb',
  '👍', '👏', '🔥', '😂', '😮', '😭', '💀', '🤝',
];
