// Online play (ADR 0036, ENG-094): a room on the lobby server, its line of players, your matches over rollback
// netcode and everyone else's matches watched live. The flow: ONLINE on the mode list, or an invite link
// (?room=CODE) -> name and room code (Menus.onlineEntry) -> the room (Menus.onlineRoom) over the arena -> the server
// starts each match on every member's machine: its two players run a RollbackSession over the lobby link, everyone
// else a SpectateSession on the confirmed inputs -> the server's `end` -> back to the room. Game hooks: game.online
// (update() per rendered frame, menuKey() for Esc / the pause button, overlay), cfg.mode 'online'.
import { LobbyClient, lobbyUrl, newCode, cleanCode } from './lobby.js';
import { RollbackSession, packInput } from './rollback.js';
import { SpectateSession } from './spectate.js';
import { ROSTER } from '../characters/index.js';

const SIM = import.meta.env.SIM_ID || 'dev'; // the server keeps a room to one simulation build
const KEY = 'gcd.online.';
const load = (k, d) => { try { return localStorage.getItem(KEY + k) ?? d; } catch { return d; } };
const keep = (k, v) => { try { localStorage.setItem(KEY + k, v); } catch { /* private mode: not remembered */ } };
const fighterId = (id) => (ROSTER.some((c) => c.id === id) ? id : ROSTER[0].id);
// the banner for a match the server ended early (`end.reason`), given the player it went against
const END_TEXT = {
  forfeit: (n) => `${n} LEFT THE MATCH`,
  timeout: (n) => `${n} LOST CONNECTION`,
  desync: () => 'NO CONTEST',
  mismatch: () => 'NO CONTEST',
  server: () => 'NO CONTEST',
};
// a match the server ended early stays on screen, frozen, while its banner shows
const FROZEN = { tick: () => false, applyInputs: () => {}, reset: () => {} };
const SHOW_END_MS = 2600; // after the server's `end`, before the room comes back

export class Online {
  constructor(game) {
    this.game = game;
    this.client = null;
    this.code = '';
    this.you = null; // our member id in the room
    this.room = null; // the server's room view
    this.match = null; // { no, you (0 / 1, or -1 watching), players, session, reported, ended, endAt, resultsAt }
    this.overlay = false; // the room screen is up over a match we watch
    this.error = '';
    this.note = ''; // a passing line on the room screen ('LINK COPIED')
    this.name = load('name', `Player${100 + ((Math.random() * 900) | 0)}`);
    this.fighter = fighterId(load('fighter', ROSTER[0].id));
    this.play = true;
    this.strip = document.createElement('div');
    this.strip.className = 'on-strip hidden';
    document.body.append(this.strip);
    this.stripAt = 0;
  }

  get available() {
    return !!lobbyUrl();
  }

  // ------------------------------------------------------------ joining
  // the name / room code screen (code: from an invite link)
  entry(code = '') {
    this.leaveRoom(false);
    const g = this.game;
    g.toMenu(() => g.menus.onlineEntry(this, cleanCode(code)));
  }

  setName(name) {
    const n = String(name ?? '').trim().slice(0, 16);
    if (n) this.name = n;
    keep('name', this.name);
  }

  create() {
    this.join(newCode());
  }

  join(code) {
    const g = this.game;
    code = cleanCode(code);
    const url = lobbyUrl();
    if (code.length !== 5) this.error = 'A room code is five letters or digits.';
    else if (!url) this.error = 'Online play is not set up yet.';
    if (code.length !== 5 || !url) return g.menus.onlineEntry(this, code);
    this.leaveRoom(false);
    this.error = '';
    this.code = code;
    g.menus.onlineWait(this, `JOINING ROOM ${code}...`);
    const client = (this.client = new LobbyClient(url, code, {
      open: () => client.send({ t: 'hello', name: this.name, fighter: this.fighter, sim: SIM, play: this.play }),
      welcome: (m) => {
        this.you = m.you;
        this.room = m.room;
        this.setUrl(code);
        this.showRoom();
      },
      room: (m) => {
        this.room = m.room;
        this.refresh();
      },
      start: (m) => this.begin(m),
      feed: (m) => { if (this.match?.no === m.no && this.match.you < 0) this.match.session.feed(m.start, m.a, m.b); },
      end: (m) => this.end(m),
      error: (m) => { this.error = m.text; },
      close: (e) => this.lost(e),
    }));
  }

  // the socket closed without us leaving: back to the entry screen with why
  lost(e) {
    const g = this.game, joined = !!this.you;
    this.client = null;
    this.dropMatch();
    this.you = null;
    this.room = null;
    if (!this.error) {
      this.error = !joined ? 'Could not reach the room. Check your connection and try again.'
        : e.code === 4008 ? 'Disconnected: too many messages.' : 'Disconnected from the room.';
    }
    g.toMenu(() => g.menus.onlineEntry(this, this.code));
  }

  leaveRoom(back = true) {
    const g = this.game;
    if (this.client) {
      this.client.close();
      this.client = null;
    }
    this.dropMatch();
    this.you = null;
    this.room = null;
    this.setUrl(null);
    if (back) g.toMenu(() => g.menus.modeSelect(g.menus.modeIndex('online')));
  }

  dropMatch() {
    if (this.match) this.game.netplay = null;
    this.match = null;
    this.overlay = false;
    this.strip.classList.add('hidden');
  }

  // ?room=CODE in the address bar while in a room, so a refresh comes back to it
  setUrl(code) {
    const u = new URL(location.href);
    if (code) u.searchParams.set('room', code);
    else if (u.searchParams.has('room')) u.searchParams.delete('room');
    else return;
    history.replaceState(null, '', u);
  }

  inviteUrl() {
    const u = new URL(location.origin + location.pathname);
    u.searchParams.set('room', this.code);
    const lobby = new URLSearchParams(location.search).get('lobby');
    if (lobby) u.searchParams.set('lobby', lobby);
    return u.toString();
  }

  async invite() {
    const url = this.inviteUrl();
    try {
      if (navigator.share && this.game.input.lastDevice === 'touch') await navigator.share({ title: 'GCD Tourney', text: `Fight me in room ${this.code}`, url });
      else {
        await navigator.clipboard.writeText(url);
        this.flash('INVITE LINK COPIED');
      }
    } catch {
      this.flash(url); // no clipboard (http on a LAN address): show it to copy by hand
    }
  }

  flash(text) {
    this.note = text;
    this.refresh();
    clearTimeout(this.noteT);
    this.noteT = setTimeout(() => { this.note = ''; this.refresh(); }, 2500);
  }

  // ------------------------------------------------------------ the room
  showRoom() {
    const g = this.game;
    this.dropMatch();
    g.toMenu(() => g.menus.onlineRoom(this));
  }

  refresh() {
    if (this.game.menus.screen === 'online-room') this.game.menus.onlineRefresh?.();
    this.paintStrip();
  }

  cycleFighter(d) {
    const i = ROSTER.findIndex((c) => c.id === this.fighter);
    this.fighter = ROSTER[(i + d + ROSTER.length) % ROSTER.length].id;
    keep('fighter', this.fighter);
    this.client?.send({ t: 'set', fighter: this.fighter });
  }

  setPlay(on) {
    this.play = on;
    this.client?.send({ t: 'set', play: on });
  }

  member(id) {
    return this.room?.members.find((m) => m.id === id);
  }

  // ------------------------------------------------------------ matches
  begin(m) {
    const g = this.game, you = m.you;
    this.client.inbox.length = 0;
    g.netplay = null; // startMatch must not reset the last match's session
    this.overlay = false;
    g.startMatch({ mode: 'online', p1: fighterId(m.players[0].fighter), p2: fighterId(m.players[1].fighter), seed: m.seed, spectate: you < 0 });
    const session = you >= 0
      ? new RollbackSession(g, {
        link: this.client.matchLink(),
        local: () => this.localInput(),
        localPlayers: [you],
        remotePlayers: [1 - you],
        delay: m.delay,
        onDesync: (frame) => this.client?.send({ t: 'desync', frame }),
      })
      : new SpectateSession(g);
    g.netplay = session;
    this.match = { no: m.no, you, players: m.players, session, reported: false, ended: null, endAt: 0, resultsAt: 0 };
    this.paintStrip();
  }

  localInput() {
    const s = this.game.input.sample()[0];
    return s ? packInput(s.x, s.y, s.b) : 0;
  }

  end(m) {
    const M = this.match, g = this.game;
    if (!M || M.no !== m.no) return this.refresh();
    M.ended = m;
    M.endAt = performance.now();
    if (m.reason !== 'ko') {
      const loser = m.winner ? M.players.find((p) => p.id !== m.winner)?.name ?? '' : '';
      g.netplay = FROZEN;
      g.hud.announce((END_TEXT[m.reason] || END_TEXT.server)(loser.toUpperCase()), 'time', SHOW_END_MS);
    }
    this.paintStrip();
  }

  // per rendered frame (Game.frame): report our result once every frame is confirmed, and go back to the room
  // a little after the match ended
  update() {
    const M = this.match, g = this.game, now = performance.now();
    if (M) {
      if (g.state === 'results' && !M.resultsAt) M.resultsAt = now;
      if (M.you >= 0 && !M.reported && !M.ended && g.state === 'results' && M.session.remoteConfirmed() >= g.frameNo - 1) {
        M.reported = true;
        this.client?.send({ t: 'result', winner: g.roundWinner.index });
      }
      // a spectator plays a KO out to its results (it runs a little behind) before leaving
      const shown = M.ended && (M.ended.reason !== 'ko' || M.you >= 0 ? now - M.endAt > SHOW_END_MS
        : (M.resultsAt && now - M.resultsAt > SHOW_END_MS) || now - M.endAt > 8000);
      if (shown) this.showRoom();
    }
    if (now - this.stripAt > 500) {
      this.stripAt = now;
      this.paintStrip();
    }
  }

  // Esc or the pause button during a match: a spectator opens the room over it; a player has no pause (the match
  // runs on both machines)
  menuKey() {
    const M = this.match, g = this.game;
    if (!M || M.you >= 0) return;
    this.overlay = !this.overlay;
    if (this.overlay) g.menus.onlineRoom(this, true);
    else g.menus.hide();
    this.paintStrip();
  }

  // the line at the top during a match: the room, who is playing, where we are in the line, the ping
  paintStrip() {
    const s = this.strip, M = this.match, R = this.room;
    const show = !!(this.client && R && M && !this.overlay);
    s.classList.toggle('hidden', !show);
    if (!show) return;
    const ping = this.client.rtt != null ? ` · ${Math.round(this.client.rtt)} ms` : '';
    const [a, b] = M.players.map((p) => p.name);
    let line = `${a} vs ${b}`;
    if (M.you < 0) {
      const pos = R.queue.indexOf(this.you);
      line = `watching ${line}` + (pos === 0 ? ' · you play next' : pos > 0 ? ` · ${pos} ahead of you in line` : '');
      line += this.game.input.lastDevice === 'touch' ? '' : ' · Esc: room';
    }
    s.textContent = `ROOM ${this.code} · ${line}${ping}`;
  }
}
