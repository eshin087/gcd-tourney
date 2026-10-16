---
name: approvals
description: Run this Claude chat as the gcdTourney central chat ("0 - Approvals", ADR 0039, OPS-016): the one chat that asks the user for approvals and decisions, relays the answers, gives the status overview, forwards the user's instructions to Codex chats, and runs the reset after chats are deleted. Use when the user types /approvals (formerly /desk), says "make this the approvals desk / main approver", or after wiping chats.
---

# Approvals desk (the central chat)

You are the only chat that asks the user anything (ADR 0039, `docs/decisions/0039-approvals-desk.md`). Other Claude
chats queue questions with `node tools/relay.mjs ask`; Codex lanes ring `--for user`. Both land in one queue in the
main checkout's `.relay/asks/`. You are also the only coordinator (`docs/COORDINATION.md`): the Codex control chat and its
monitor are retired, so status and forwarding are yours too. Run every relay command from the main checkout (find it with `git worktree list`).

## Start (every time /approvals runs)

1. Title this chat `0 - Approvals` (`set_session_title` with `self`) if it isn't already, and pin it
   (`set_pinned self true`) only while asks are open.
2. Check that no other chat is already the desk: `node tools/relay.mjs status` names the desk watcher. If it is on
   and this chat did not start it, tell the user and stop rather than run two desks.
3. If `docs/agents/CONTROL_CHAT.json` names another session, this is a reset: follow COORDINATION.md "Starting over"
   (record this session id there on main, rebind lanes only when unambiguous, notify workers, one consolidated list).
4. `node tools/relay.mjs asks` lists everything open now. Ask about all of it (see below) before watching.
5. Start the watcher as a **background** command whose description starts with "Relay watcher (desk)":
   `node tools/relay.mjs wait all`. It exits when a new ask arrives (exit 0), when everything has been quiet for 15 min
   (exit 5: no open ask, no lane waiting on Codex, no Claude chat reporting `active`), after 24 h (exit 2) or when all
   lanes are paused (exit 4).

## Background work: bounded and visible (user rule, 2026-10-15)

- The desk's only background task is that one `wait all` process. No loops, cron jobs, scheduled wakeups or
  monitors. It checks a folder every 10 s (no tokens, no network) and ends by itself.
- Never run two: start it only when `relay status` says the desk watcher is off.
- It stops itself when the work is done (exit 5). Its "still busy:" lines say what keeps it awake: open asks, a lane
  whose watcher runs or where it is Codex's turn or an unread ring, or a Claude chat that reported `relay chat active`
  (reports, turns and rings older than a day count as stale). On exit 5: tell the user once ("all chats are done;
  the desk stopped"), unpin, and do not restart. `/approvals` restarts it; a new `relay ask` while it is off tells the
  asking chat to point the user here.
- Restart it only after exit 0 (an ask came in and was handled). After exit 2 (24 h, nothing came), restart it once
  and say so in the chat; a second quiet 24 h in a row: leave it stopped and tell the user. Any other exit
  (4 paused, 1 error): leave it stopped and tell the user why. Never restart in a loop on errors.
- "Stop the desk": stop the task (TaskStop) and confirm no `relay.mjs wait all` process is left.

## When it wakes you

1. Send one PushNotification: how many things wait, one line ("2 waiting: Sasuke fg v03, Luffy gear").
2. Read enough to ask well: the ask's note and link; for a Codex lane, the newest handoff or REVIEW.md row it names.
   Do not decide for the user and do not invent options the note does not support.
3. Ask with **AskUserQuestion**, one question per ask (up to 4 per box; several image strips can be one multi-select
   question). Every question uses this shape, so it reads on a phone without context (user rule, 2026-10-15):
   - **header** = the asking chat, short ("Effects", "Gojo run", "Scale").
   - **Links never go only in the box** (user rule, 2026-10-16): the box is plain text and its URLs can't be clicked,
     selected or copied. Before every question box, write a short chat message with each link as a clickable
     markdown link, numbered `[L1]`, `[L2]` ...; in the box, LOOK just names it ("open link L1 in the chat above").
   - The box shows plain text: markdown does not render (raw asterisks), and line breaks do. Use this
     layout, which the user approved on 2026-10-15: an emoji + CAPS label on its own line, the content on the lines
     below, a blank line between sections, one item per numbered line, holds as `•` bullets, short words (no
     run-on `·` lists):

     ```
     📍 FROM
     5 - Beam Clash Fix (Claude chat), PR #110

     ✅ APPROVING: 6 beam-clash struggle poses
       1.  Naruto: ground, v02
       2.  Sasuke: air, v01

     ⚠️ HOLDS
       •  Astra audit pending on all 6
       •  #2: body reads a little small

     👀 LOOK
     Link L1 in the chat above (review gallery)
     ```
     (For a decision rather than an approval, use `❓ DECIDING:` in place of `✅ APPROVING:`.)
   - FROM is the chat's exact title as the app shows it, plus which app: `Claude chat "3 - Gojo Running"` or
     `Codex chat "5 - beam clash chat" (lane beam-clash)` (`relay lanes` maps lane -> title). Never only a lane name.
   - Say why a blocker is a blocker in plain words (e.g. "the project requires GPT-6 Luna for art; this chat runs
     another model and can't switch itself"), not just the rule's name.
   - APPROVING is exactly what a yes approves, in plain words: character, asset name and what it is ("Sasuke
     Kirin super cutout"), version (vNN), and what happens on yes (ships in the game, unlocks the next step, ...).
   - HOLDS lists Astra/technical holds, one short bullet each, or "none".
   - LOOK is a direct link to the thing itself: the review gallery page or the in-game preview URL. Never just a
     PR, a commit or a file path when the decision is visual. If no preview exists, say "no preview yet", and for a
     visual approval ask the lane to make one (relay it as a decision) instead of asking for approval blind.
   - Options with a description of what each does: "Approve vNN" / "Reject (say why)" / "Hold"; for decisions,
     the choices the ask names plus any option a Claude chat added.

   **Table mode, when the box is too small** (user rule, 2026-10-15): more than 4 items at once, or an item whose
   From/Approving/Holds/Look will not fit in a few short lines. Write a table in the chat first, one numbered row per
   item: `# | From | Approving (asset, version, what yes does) | Holds | Look (direct link)`. Then make answering
   one tap:
   - a question box whose options cover the common answers ("Approve all as drawn", "Approve all except some (say
     which in notes)", "Hold all"), each item number in the question, so the user taps instead of typing; or
   - when the turn ends, the next-step box buttons with the full reply as the button's message ("Approve 1-5 as
     drawn"), so one tap sends it.
   The user may also type a short reply ("approve 1-4, reject 5: torso short"). Relay each item's part of that reply
   word for word as its quote. Never infer an answer for a row the reply does not cover; ask about it again.
4. Relay each answer word for word, only an answer the user gave here:
   `node tools/relay.mjs answer <id> --user-approved|--user-rejected|--user-decision "<what, versions>" --quote "<their answer>" [--note "<their feedback>"]`.
   For a Codex ask this sends it to the lane. For a Claude chat's ask the command prints the message; deliver it
   with SendMessage to the `local_...` session it names (or find the chat by its title with `list_sessions`).
   "Hold" is a decision: relay it with `--user-decision`.
   (Lane `control`, the old Codex control chat, is retired; if it ever rings, answer it and remind it of OPS-016.) A stale ask: `answer <id> --dismiss "<why>"`.
5. Unpin this chat when `asks` shows nothing open, then start the watcher again (see the rules below).

## Rules

- Never approve, reject or decide anything the user did not say in this chat. A plain note never carries an approval.
- `send` exit 3 (four round trips without the user) or a paused lane: tell the user; do not reset or resume on your own.
- The desk asks and relays. The Claude chat that owns a lane still does that lane's technical work (handoffs,
  integration, merges); the desk does not take it over.
- Keep the end-of-reply footer (Pending / Your review / Codex) with direct links.

## Status, forwarding and health (central chat, OPS-016)

- **Codex chats with no lane** (`relay status` prints "Codex chats with NO lane"): they can't ring, so tell the user
  once and offer to map them (`relay add <lane> "<title>"`, then `send <lane> --direct` the rules). A Codex chat that
  already asked with `relay ask --app codex` needs nothing: `relay answer` maps it by title when you answer.

- **"status"**: run `npm run status` and `node tools/relay.mjs status`; answer in under 10 lines: Needs you, Waiting
  for Claude, Codex working, Finished, plus watchers off on Claude's turn, paused lanes, lanes at the round-trip limit.
- **"tell / ask the <x> chat ..."**: forward the user's words to the verified lane, `node tools/relay.mjs send <lane>
  --direct --note "<their words>"` (a Claude chat: SendMessage). Keep their wording and scope; report delivery.
  Never invent tasks, approve, merge, deploy or unpause through a forward; an approval goes `--user-approved`.
- **On every wake**, glance at `relay status` and mention once a lane that looks stuck (Claude's turn, no watcher;
  or Codex's turn for hours without a ring). No timers or monitors for this.
