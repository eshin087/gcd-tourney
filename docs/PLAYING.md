# Playing GCD Tourney

The full player guide: every mode, the default controls, the combat toolkit and each fighter's moves.
Back to the [README](../README.md).

## Modes

- **VS CPU**: pick your fighter and the CPU's (Easy / Normal / Hard / **Insane** / **Impossible**). Impossible reads frame
  data: it parries and dodges what it sees coming, punishes whiffs, runs max-damage routes and wavedashes around
  you. It only reacts to what's on screen, so fast jabs and mix-ups are guesses for it too. Insane is the same
  brain at a person's reaction speed: it sees your attacks later, parries and dodges less, and sometimes drops a
  combo, so it sits between Hard and Impossible. Every level uses its
  whole kit over a match (specials, modes, supers, ultimates) and, from Normal up, parries, spot dodges, air
  dodges and wavedashes now and then.
- **2 Players**: shared keyboard, or two gamepads
- **Online**: browse the public rooms and join one, open your own public room or a private one, and send the invite link (or the five-letter room code) to friends, on a computer or a
  phone. Rooms talk in quick-chat lines and emotes (no free text); the host can remove someone and anyone can vote to. The first two in line fight, the winner stays on (up to five wins in a row) and the loser goes to the back;
  everyone else watches the match live. Matches run on rollback netcode: your own inputs are two frames late and the
  game corrects for the other player's lag. Esc (or the pause button) opens the room while you watch; a match has no
  pause, and leaving it counts as a loss; a dropped connection (switching apps, Wi-Fi blinking) has 20 seconds to
  come back into the same match while the other player waits
- **CPU vs CPU**: pick two fighters and watch the computer play both sides. The level defaults to **God**, a level
  only for watching: both CPUs at the top of every dial, trading long parry exchanges, melee clash chains, beam and
  ultimate clashes and long combos crowned with supers. Impossible (one step down) plays its showman style: long, varied combos composed fresh every match in each CPU's own style (wall-bounce
  "handball", vanish ping-pong, relaunches, kit grinds; each combo's techniques tick by beside the counter and big
  ones get a rating), every special and super in the kit, spells dodged and parried, techs, tech rolls and bursts out
  of combos, wavedashes and power-ups, each called out on a banner (PARRY!, DODGE!, TECH!, BURST!, HANDBALL!,
  PUNISH!...), and a BEAM CLASH every match (not Naruto vs Naruto: two Rasengans make a special clash), so you see
  what the engine can do; Esc / Start pauses and the results screen offers a rematch
- **Controls / training room**: keyboard, PlayStation and Xbox layouts (toggle
  between them), key and button rebinding saved in your browser, and a live training room where your fighter
  copies your inputs so you can try the controls in real time
- **Sprite Lab** (`/sprites.html`, not in the menu): preview every animation, import art strips, export sheets
- **Test lab** (SELECT MODE → LAB, or `/lab.html?p1=naruto&p2=sasuke`): play any move of either fighter in one tap, step through every animation
  with its hit and hurt boxes, replay shared mechanics (ultimate, special and beam clashes, throws, parries, dodges, wavedash,
  air combos, bounces, vanish, super dash), slow motion, frame step, record and replay on the dummy

Best of 3 rounds, 99 seconds each. The intro flythrough can be skipped with Enter / Start (not online: it runs on
both machines).

## Controls

These are the default bindings. You can rebind them in the controls menu.

| | VS CPU | P1 (2P) | P2 (2P) | Gamepad |
|---|---|---|---|---|
| Move | WASD / Arrows | WASD | Arrows | Left stick / D-pad |
| Light (auto combo; + direction: tilts and aerials) | J | F | , | □ / X |
| Heavy (launcher; + direction: smash attacks, hold to charge) | K | G | . | △ / Y |
| Special (tap, + direction) / charge ki (hold) | L | H | / | ○ / B |
| Jump (tap: short hop, hold: full hop, again in the air: double jump) | Space | Space | L | ✕ / A |
| Guard | Shift | L-Shift | ; | L1 / LB |
| Dash (with direction) / **super dash** (neutral) | O · double-tap | R · double-tap | K · double-tap | R1 / RB |
| **Ultimate beam** | **K + L** | **G + H** | **. + /** | **△ + ○** |
| **Vanish** | **Shift + L** | **L-Shift + H** | **; + /** | **L1 + ○** |
| **Super** (2nd super, 3 bars) | **H** or **B** | **T** | **'** | **L2 / LT** |
| **Throw** (close) / break a throw | **J + K** | **F + G** | **, + .** | **□ + △** |
| **Tech** / **tech roll**: hold Guard while hit | hold **Shift** | hold **L-Shift** | hold **;** | hold **L1 / LB** |
| **Timed tech**: tap Guard just before you hit the floor or the barrier (+ ← / → roll, ↑ wall jump) | tap **Shift** | tap **L-Shift** | tap **;** | tap **L1 / LB** |
| **Burst**: Guard + Special while hit (2 bars, once per round) | **Shift + L** | **L-Shift + H** | **; + /** | **L1 + ○** |
| **Beam clash**: your energy Special (→ toward them for some fighters) into theirs, or while theirs flies at you | **L** / **→ + L** | **H** / **→ + H** | **/** / **→ + /** | **○** / **→ + ○** |

### The combat toolkit

- **Auto combo**: Light ×4 with the stick neutral. The last hit is a smash that can **wall-bounce** off the ring's ki barrier.
- **Smash-style moves** ([ADR 0042](docs/decisions/0042-smash-directional-normals.md)): → / ↑ / ↓ + Light are the
  forward, up and down **tilts**; → / ↑ / ↓ + Heavy the **smash attacks** (hold Heavy to charge); in the air Light gives
  the **neutral air**, → / ← / ↑ + Light the **forward, back and up airs** and ↓ + Light the spike. Light in a dash with
  the stick held is the **dash attack**. They **link** instead of chaining: land the next move inside the hit stun
  (down tilt → jab, up tilt → up tilt → up air). Tap Jump for a **short hop** (Jump + Light: a short-hop aerial), jump
  again for a **double jump**, ↓ past the top of a jump to **fast fall**. Your facing holds through a jump, so jump away
  and press ← toward them for a back air. On a gamepad the **right stick is the C-stick**, as in Smash: flick it for a
  smash attack that way, or in the air for that aerial (your drift stays with the left stick).
- **Launcher**: Heavy (or Light ×3 → Heavy). Press **Jump** on hit to super-jump after them.
- **Air combo**: Light ×3 in the air, or end with **Heavy** (double-axe spike) for a **ground bounce**.
- **Super dash**: Dash with no direction. Homing flight that hits on contact, once per trip through the air.
- **Vanish** (1 bar): teleport behind the opponent and smash them. Also works while blocking.
- **Specials** (½-1 bar): tap Special for the neutral special. Hold a direction while you press it
  (→ toward the opponent, ↑, ↓) for the fighter's other specials. In the air: Special (+↓ for some
  fighters). The direction you hold when you *press* Special counts, so a quick tap works.
- **Ultimate** (3 bars, Heavy + Special): super flash with a cut-in, then the fighter's finisher (see Fighters).
  Fire yours into theirs (a beam, Hollow Purple or the Four-Tails pounce) and they **clash**: press Light, Heavy
  or Special as each ring closes on the target, then hold the last one (FINAL PUSH). Better timing pushes harder,
  presses off the beat push you back, and the winner's ultimate lands.
- **Melee clash**: throw a Light into their Light (or a Heavy into their Heavy) as theirs comes out and the strikes
  meet: CLASH!, no damage, the strikes held together with sparks in both fighters' colors as the camera pushes in on
  the fists, then you are both pushed back a step. Press again while they're held and the next swings meet too:
  CLASH ×2, ×3... with a bigger spray and ki for both each time, until the 5th skids you both far back (CLASH BREAK!).
  A Light that meets a Heavy loses (CRUSH!).
- **Special clash**: two rush specials meeting head-on (Rasengan into Chidori) get one ring; the closer press wins.
- **Beam clash**: fire an energy special (Killua's Narukami, Gojo's → Red, Sasuke's → Chidori Spear or air Fireball)
  into the opponent's, or drive Naruto's Rasengan into it, or fire yours while theirs flies at you: BEAM CLASH! Both
  attacks become streams that meet in the middle, and you play a short rhythm chart (about 4.5 s). The winner's
  stream runs through for 120 and a wall bounce; a dead heat blows both back. CPU vs CPU shows one every match.
- **Super** (3 bars, SUPER button): the fighter's second super. A fighter without one fires their beam.
- **Tech** (combo escape): **hold Guard while you're being hit**. The moment the attacker leaves a gap you
  flip out in the air (TECH!), or, if you hit the floor, roll back to your feet (TECH ROLL!) instead of lying
  down. Hold a direction to pick where: away (default), toward them, ↑ rise in place, ↓ drop to the floor.
  Pressing any button while launched still techs too. Spikes, throws and super finishes are hard knockdowns:
  no roll.
- **Timed tech** (Smash style): **tap Guard just before you hit the floor or the ring barrier** (up to about 11
  frames early) while you're being comboed. On the floor you get up on the spot (TECH!), or roll with ← / →; on the
  barrier you cling for a moment and kick off it (WALL TECH!), or hold ↑ for a wall jump you can act out of. It beats
  ground bounces, wall bounces (the "handball"), spikes, throws and plain landings, and ends the combo. Only a fresh
  press counts (holding Guard doesn't), and a press that's too early locks the timed tech out for about 40 frames,
  so mashing fails. Super finishes can't be teched.
- **Burst** (2 bars, once per round): **Guard + Special while you're being hit**. A shockwave blows the attacker
  away and ends the combo (BURST!). It can be blocked: an attacker who stops and guards gets to punish you. The
  gem next to your ki gauge shows whether you still have it this round.
- **Blue combo counter**: when the counter turns blue, the victim could have teched out somewhere in that combo.
- **Hold back to block**: hold the stick away from the opponent and you block their attacks on the ground, no
  button needed (it's always on). With nothing coming you still run away; when they attack nearby or a shot or
  beam of theirs is out, you turn and raise your guard. Throws still beat it, like a held Guard.
- **Parry**: tap Guard just before a hit lands (6-frame window). No damage, and a melee attacker staggers, so
  punish. Mashing Guard doesn't work: each press locks parries out for 24 frames, but a parry re-arms at once.
- **Spot dodge**: hold Guard and push ↓. Briefly intangible, then a short recovery (gets slower if you spam it).
- **Air dodge**: Guard in the air, once per jump, with a direction to dodge that way.
- **Wavedash**: Jump, then right away Guard + a direction: you air dodge into the floor and slide. Attack out of
  the slide and the momentum carries into it.
- **Throw**: Light + Heavy up close grabs someone who's blocking (or parrying, or in a counter stance) and
  tosses them into the wall. Whiff it and you're wide open. If you get grabbed, press Light + Heavy quickly to
  **break** it. Jabs, jumps and spot dodges beat throws.
- KO with a big hit sends the loser flying out of the ring into the stands.
- Esc / P / Start: pause. M (or the small speaker toggle in the top corner): mute. The pause menu's **MUSIC** row
  sets the music volume (◀ ▶, remembered); the music itself is chill generated lo-fi, a new song every time.
- A gamepad only takes control after you press one of its buttons, so an idle controller with a
  drifting stick can't move your fighter.

### Phone / tablet (landscape)

Open https://gcd-tourney.vercel.app on your phone and turn it sideways (portrait shows a "rotate" screen).
Android goes fullscreen on the first tap; on iPhone use Share > Add to Home Screen for a fullscreen app.

- **Left half of the screen:** a joystick appears under your thumb. Flick twice in a direction to dash.
- **Right side:** LIGHT, HEAVY, SPECIAL, JUMP, GUARD, DASH, plus **ULT** (Heavy + Special), **VANISH**
  (Guard + Special; it's the **Burst** while you're being hit) and **SUPER**, so you never need a two-finger chord.
  They dim until you have the ki. Hold GUARD while you're being hit to tech.
  Hold the joystick in a direction while you tap SPECIAL for the directional specials.
- **Top-left:** pause. In menus, tap items; the **BACK** button bottom-left replaces Esc. Tap the screen to
  skip the pre-fight intro.
- Button size: Pause > Controls > TOUCH tab (small / medium / large).

## Fighters

The original four fighters' kits are below. Goku and Luffy follow the same baseline (directional specials, a second super and an ultimate); see `src/characters/goku.js` and `src/characters/luffy.js`.

| | Special (tap) | → Special | ↑ Special | ↓ Special | air Special | Super (SUPER) | Ultimate |
|---|---|---|---|---|---|---|---|
| **Naruto** | Rasengan (rush) | Rasenshuriken, handheld (slower, grinds them in a wind vortex, costs him some HP) | Uzumaki Barrage (clones kick them up, heel drop; anti-air) | **Nine-Tails Cloak** (8 s: tougher, stronger, a bit faster) · **← Special:** Substitution (counter: a log takes the hit, he kicks them from behind, ½ bar) | shuriken; +↓ Barrage dive | **Shadow Clone Barrage** (clone combo, Giant Rasengan finish) | **Four-Tails** (the shroud boils up and he pounces on all fours; a catch is a mauling and a chakra roar; side-step during the roar to dodge it) |
| **Sasuke** | Chidori (rush) | Chidori Sharp Spear (short, instant lightning lance, ½ bar) | Lion's Barrage (rising kick; on a hit he follows them up from behind, strikes in the air and heel-drops them into the floor; anti-air) | Sharingan (counter: reads the attack, Chidori Current, kicks back, ½ bar) | Great Fireball; +↓ Lion's dive | **Kirin** (a fireball into the sky, storm clouds over where they stand, then the lightning dragon dives on the spot; they can dash out) | **Amaterasu** (black flames burn them for a few seconds; can't be blocked) |
| **Killua** | Narukami (lightning bolt, ½ bar) | Rhythm Echo (afterimage teleport behind, then a wall-bounce strike) | Thunderbolt (lightning leap and slam, anti-air) | **Godspeed** (8 s: faster, +12 % damage, dashes become lightning blinks) | Narukami; +↓ Thunderbolt dive | **Godspeed: Speed of Lightning** (dash, 8-hit afterimage flurry, slam) | **Godspeed: Whirlwind** (for 5 s his body counters up to 4 strikes or shots by itself; throw him or wait it out) |
| **Gojo** | Lapse: Blue (gravity vortex: pulls in, ticks, pops up) | Reversal: Red (repulsion blast, wall bounce) | Blink (teleport above them, ½ bar) | Infinity (counter: a melee hit freezes the attacker, ½ bar) | Reversal: Red | **Domain Expansion: Unlimited Void** (the void swallows the stage, opponent frozen ~2.5 s) | **Hollow Purple** (Red and Blue fuse into a huge orb that rolls across the stage and erases projectiles; leave its lane) |

**Gojo's Infinity passive:** projectiles stop before they touch him whenever he can act and has ki (each
volley of projectiles he stops costs him 15 ki; not while he's in hitstun or knocked down). Beams still connect, and so does everyone up close.
Design notes: [ADR 0009](docs/decisions/0009-move-system-v2.md) and [docs/COMBAT_DESIGN.md](docs/COMBAT_DESIGN.md).
