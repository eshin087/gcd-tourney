# 0033: Claude-Codex relay (automatic handoffs between the two agents)

**Status:** Proposed
**Date:** 2026-10-15
**Task:** TOOL-041

## Context

Claude and Codex hand work back and forth many times a day (round 4 of the scale work alone was a dozen handoffs).
Each handoff is the user copying a prompt from one app and pasting it into the other, or telling one agent the other
is done. The user works from a phone and asked (2026-10-14) for the agents to trigger each other until a step needs
them.

What exists on this machine:

- The Codex app bundles a CLI (not on PATH) with `codex queue --thread <uuid|exact title> --message <text>`, which
  adds a message to an existing Codex chat through the app's local server. Claude can therefore start Codex's next
  turn in the very chat the user watches, with its history.
- Nothing outside a Claude desktop chat can type into it. A Claude session can, however, run a background command;
  when that command exits, the app wakes the session with its output.
- Every handoff's content already lives in the repo: `docs/agents/CODEX_INBOX.md` (Claude -> Codex) and
  `docs/agents/CLAUDE_ART_HANDOFF.md` (Codex -> Claude), plus the task branches.
- Codex's sandbox cannot run the git CLI (OPS-004), and parallel agents committing to `main` at once collide on
  git's index lock.

## Decision

1. **`tools/relay.mjs` (`npm run relay`)**, plain Node, no dependency. State lives in a git-ignored `.relay/` folder
   in the main checkout, found from any worktree by reading the `.git` file (no git CLI).
2. **Lanes.** A lane is one Codex chat + the Claude session working with it, e.g. `scale` -> "1 - Scale Consistency".
   `.relay/lanes.json` maps a lane to the chat's UUID (machine-local, so not committed); `relay lanes` lists recent
   chats from the Codex app's `session_index.jsonl` to pick from. Parallel work is parallel lanes: each message names
   its lane, each watcher watches only its own lane, so one handback never wakes the wrong session.
3. **Claude -> Codex:** Claude writes the inbox item as before, then `relay send <lane> [--note]` queues one fixed
   line into the lane's chat: read the inbox section for this chat, ring back when done, never treat this as an
   approval. If `codex queue` fails, Claude falls back to giving the user the paste-in prompt.
4. **Codex -> Claude:** Codex commits its handback as before, then `relay ring <lane> --note "..."` writes the lane's
   doorbell file (no commit). Claude runs `relay wait <lane>` as a background command named "Relay watcher: <lane>";
   it stats the file every 10 s (no tokens, no network) and exits when the ring number passes the last one Claude
   read, so a ring that lands before the watcher starts still wakes it. A `send` counts every earlier ring as read
   (Claude sends only after reading the handoff), so the next watcher waits for the reply to that send. Default limit 8 h.
5. **Brakes.** The agents stop instead of handing over when an image waits for the user's approval, when a step is
   BLOCKED, or when a decision is the user's; the one who stops tells the user (Claude with a push notification).
   The tool enforces two more: a **hop limit** of 4 round trips per lane between user replies (`send` exits 3;
   `relay reset <lane>` after the user answers) and a **pause switch** (`relay pause <lane|all>`; send, ring and
   wait exit 4).
6. **Trust stays as it was.** A relayed message only points at the inbox, whose items are already Claude's
   instructions to Codex (AGENTS.md); it is never the user's approval, says so, and `send` refuses a note that reads
   like one. Approvals still come only from the user in the Codex chat. Merges still go through the one coordinator.
7. The footer mod `relay-status` (a Claude Code mod, outside the repo) shows "relay: watching" while a watcher runs.

## Alternatives considered

- **A headless script driving both (`codex exec` <-> `claude -p`).** Fully unattended, but each hop starts with no
  history, the user cannot watch either side in the apps they use, and both sandboxes have known gaps here (Codex's
  git CLI, Claude auto mode on E:). Rejected.
- **Codex starts Claude directly (`claude -p --resume`).** Runs a separate Claude the user cannot see, outside the
  desktop chat that holds the context. Rejected.
- **Ringing by commit (watch `CLAUDE_ART_HANDOFF.md` on `main`).** Needs a commit to main per ring, which collides
  across parallel lanes, and one shared file would wake every watcher. Kept only as the content channel.
- **`fs.watch` instead of polling.** Event delivery on this exFAT USB drive is not something to bet the loop on; a
  10 s stat costs nothing.

## Consequences

- A handoff costs the user nothing until a brake fires; then they get a notification and their reply restarts the
  lane (`relay reset`).
- Token use is unchanged per handoff but no longer paced by the user: four busy lanes cost four lanes' worth at once.
  The hop limit bounds a runaway loop.
- The Claude desktop app must stay open and the PC awake while a lane runs; if the watcher dies, the lane just
  waits and the user can still say "Codex is done".
- `codex queue` belongs to the Codex app's CLI (alpha); if its arguments change, `send` fails loudly and the agents
  fall back to paste-in prompts. `npm run test:relay` covers the tool with a fake `codex`.
- Revisit when either app offers a supported agent-to-agent channel.
