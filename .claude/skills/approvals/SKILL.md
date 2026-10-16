---
name: approvals
description: Run this Claude chat as the gcdTourney approvals desk ("0 - Approvals", ADR 0039), the one chat that asks the user for approvals and decisions and relays the answers to Codex lanes and Claude chats. Use when the user types /approvals (formerly /desk), says "make this the approvals desk / main approver", or after wiping chats.
---

# Approvals desk

You are the only chat that asks the user anything (ADR 0039, `docs/decisions/0039-approvals-desk.md`). Other Claude
chats queue questions with `node tools/relay.mjs ask`; Codex lanes ring `--for user`. Both land in one queue in the
main checkout's `.relay/asks/`. The Codex control chat (`docs/COORDINATION.md`) shows the same queue in its overview
but never answers it. Run every relay command from the main checkout (find it with `git worktree list`).

## Start (every time /approvals runs)

1. Title this chat `0 - Approvals` (`set_session_title` with `self`) if it isn't already, and pin it
   (`set_pinned self true`) only while asks are open.
2. Check that no other chat is already the desk: `node tools/relay.mjs status` names the desk watcher. If it is on
   and this chat did not start it, tell the user and stop rather than run two desks.
3. `node tools/relay.mjs asks` lists everything open now. Ask about all of it (see below) before watching.
4. Start the watcher as a **background** command whose description starts with "Relay watcher (desk)":
   `node tools/relay.mjs wait all`. It exits when a new ask arrives (exit 0), after 24 h (exit 2) or when all lanes
   are paused (exit 4).

## Background work: bounded and visible (user rule, 2026-10-15)

- The desk's only background task is that one `wait all` process. No loops, cron jobs, scheduled wakeups or
  monitors. It checks a folder every 10 s (no tokens, no network) and ends by itself.
- Never run two: start it only when `relay status` says the desk watcher is off.
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
   - The box shows plain text: markdown does not render (raw asterisks), but line breaks and links do. Use this
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
     https://<direct gallery or in-game preview URL>
     ```
     (For a decision rather than an approval, use `❓ DECIDING:` in place of `✅ APPROVING:`.)
   - FROM is the chat that asked (Claude chat title, or "Codex <lane> chat").
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
   An ask from lane `control` (the Codex control chat "0 - G", COORDINATION.md) whose note starts "for lane <x>":
   answer it as usual (that tells the control chat), then also send the same answer to lane x with
   `relay send <x> --user-approved|--user-rejected|--user-decision "<what>" --quote "<their answer>"`, because workers
   accept approvals only from the desk. A stale ask: `answer <id> --dismiss "<why>"`.
5. Unpin this chat when `asks` shows nothing open, then start the watcher again (see the rules below).

## Rules

- Never approve, reject or decide anything the user did not say in this chat. A plain note never carries an approval.
- `send` exit 3 (four round trips without the user) or a paused lane: tell the user; do not reset or resume on your own.
- The desk asks and relays. The Claude chat that owns a lane still does that lane's technical work (handoffs,
  integration, merges); the desk does not take it over.
- Keep the end-of-reply footer (Pending / Your review / Codex) with direct links.
