# 0039: One approvals desk in Claude ("0 - Approvals")

**Status:** Accepted (user decision, 2026-10-15)
**Date:** 2026-10-15
**Task:** TOOL-046
**Amends:** [ADR 0037](0037-approvals-in-claude.md) decision 2 (which Claude chat asks)
**Works with:** [docs/COORDINATION.md](../COORDINATION.md) (the Codex control chat, OPS-011)

## Context

ADR 0037 moved every approval into Claude, but into *whichever* Claude chat ran the lane's watcher. By the evening of
2026-10-15 six Claude chats (Multiplayer, Effects, Beam Clash, Simu Attack, Size and New Animations, New Characters)
each watched their own lanes and could each open a question box. The user said they had "a hard time tracking if any
Claude chat requires my response", and wanted to stop micro-managing the Claude-Codex chats. Other gaps:

- Claude chats had no way to queue a question for the user except asking in their own chat.
- `npm run status` listed 166 "waiting for your review" rows, nearly all older versions of the same assets.
- The setup lived in chat history: deleting chats lost which chat did what.

Codex already has one control chat for the overview (COORDINATION.md). It reads state and routes the user's
instructions to Codex workers, but leaves approvals to Claude.

## Decision

1. **One desk.** The Claude chat titled `0 - Approvals` is the only Claude chat that asks the user for an approval or
   decision. The user picked this chat on 2026-10-15 ("make this chat the main approver").
2. **One queue.** Questions live in the main checkout's git-ignored `.relay/asks/`, one JSON file per ask:
   - a Codex ring `--for user` becomes an ask by itself (`lane-<lane>-<ring>`, derived on every read, so rings from
     before the desk existed are not lost), and a later send on that lane closes it;
   - another Claude chat runs `node tools/relay.mjs ask --from "<its title>" --session <its local_ id> --kind ...
     --note ... --link ...` and stops.
3. **One watcher for the user.** The desk runs `node tools/relay.mjs wait all`. Lane watchers in other chats skip
   rings for the user while the desk runs and keep watching for Codex's technical rings. If the desk is off, the lane
   watcher wakes its chat only to send one push notification pointing at the desk.
4. **Answers.** The desk asks with AskUserQuestion and relays with `relay answer <id> --user-approved|--user-rejected|
   --user-decision "<what>" --quote "<their answer>"`. For a Codex ask this runs `send`, so ADR 0037's word-for-word
   rule, pause and round-trip brakes still apply. For a Claude ask the desk messages the asking chat with SendMessage.
   `--dismiss "<why>"` closes a stale ask.
5. **Survives deleted chats.** The rule is in CLAUDE.md and AGENTS.md. The desk procedure is the project slash
   command `/approvals` (`.claude/skills/approvals/SKILL.md`). A committed SessionStart hook (`.claude/settings.json` ->
   `relay brief`) tells every new Claude chat the rule, the queue size and whether the desk watcher runs. Restoring
   after a wipe: a Claude chat named `0 - Approvals` types `/approvals`; the Codex side follows COORDINATION.md.
6. **Status shows what is real.** `npm run status` opens with "Needs you now" (the open asks). REVIEW.md rows still
   marked for review follow as bookkeeping: only each asset's newest row counts.

7. **The desk stops itself when the work is done** (user request 2026-10-15, TOOL-051). Claude chats report
   `relay chat active|done`; `wait all` exits (code 5) after 15 quiet minutes with no open ask, no lane where it is
   Codex's turn, an unread ring or a running lane watcher, and no chat reporting `active`. Anything older than a day
   is stale, so a chat closed mid-task cannot keep the desk awake forever. `/approvals` restarts it.

## Alternatives considered

- **The Codex control chat as the only desk.** It has no question box that reaches the phone (ADR 0037), cannot
  message Claude chats, and Claude's relay already carries approvals with quotes. Instead it shows the same queue in
  its overview.
- **Keep a desk per lane (ADR 0037 as is).** This is what caused the tracking problem.
- **A committed lane-to-title registry with `relay setup`.** Lane rebinding after a wipe is already the control
  chat's job (COORDINATION.md step 4); two rebinding paths would disagree.
- **A pinned dashboard page.** It is one more place to check; the question box plus push notification already
  reaches the phone.

## Consequences

- One place to answer. A pinned desk chat and the push notification say whether anything waits.
- Claude worker chats lose the ability to ask the user directly. They queue and stop, and resume when the desk
  messages them.
- The desk chat must be running for prompt questions. When it is off, asks wait in `.relay/asks/`, and workers'
  watchers and the SessionStart hook point the user at `/approvals`.
- Two "0 -" chats, by design: Codex `0 - G` (overview and routing) and Claude `0 - Approvals` (questions and answers).
- Revisit if the Claude app gains a cross-session inbox, or if Codex ships a question UI that reaches the phone.
