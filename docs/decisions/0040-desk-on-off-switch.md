# 0040: An on/off switch for the approvals desk

**Status:** Accepted (user decision, 2026-10-17)
**Date:** 2026-10-17
**Task:** OPS-018
**Amends:** [ADR 0039](0039-approvals-desk.md) decision 1 (only the desk asks), while the switch is off

## Context

ADR 0039 sends every approval and decision to one Claude chat, `0 - Approvals`. That suits days with many chats
running at once. On 2026-10-17 the user asked for a way to turn it off: "there are times where I don't want to have
everything funneled to the 0 chat". On those days they work in one or two chats and want each one to ask them
directly.

Stopping the desk's watcher does not do this. With the watcher stopped, `relay ask` still queues the question and
tells the chat not to ask the user, and lane watchers still say "do not ask the user here". So questions just pile up
where no chat asks them.

## Decision

1. **A switch the user owns:** `node tools/relay.mjs desk off [--note "<why>"]` and `desk on`; `desk` alone shows the
   state. It is a file in the git-ignored `.relay/desk/off.json`, so it is machine-local, needs no commit, and every
   worktree sees it. It is separate from the watcher: a stopped watcher still means "queue it for the desk", and off
   means nothing is queued.
2. **While it is off**, ADR 0037's per-chat way is back:
   - `relay ask` queues nothing and exits 6. Its message tells the chat to ask the user itself and carry on with the
     answer.
   - When Codex rings `--for user`, a lane watcher wakes its own Claude chat. That chat asks the user and relays the
     answer word for word with `send <lane> --user-approved|--user-rejected|--user-decision ... --quote`.
   - `wait all` won't start, and a running one stops at its next check (exit 6).
   - `relay brief` (the SessionStart hook), `status` and `asks` all say the desk is off. New chats learn the rule
     that way.
3. **Nothing is lost:** asks queued before the switch stay in `.relay/asks/`. `desk off` lists them so they can be
   answered first or handed back to the chats that asked. `desk on` brings back the ADR 0039 rule, and `/approvals`
   restarts the watcher.
4. **Only on the user's word:** any chat may run `desk on|off` when the user tells it to, never on its own judgment.
   Approval rules are unchanged: an answer counts only as the user's own words.

## Consequences

- One command switches between "one place to answer" and "answer where you are".
- Codex needs no change. Its `ring --for user` reaches the lane's Claude chat either way. A Codex chat with no lane
  that runs `ask --app codex` is told to ask the user in its own chat while the desk is off.
- Exit code 6 is new (`ask`, `wait all`). A chat that reads the message knows what to do.
