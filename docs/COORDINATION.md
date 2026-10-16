# GCD Tourney control chat

This is the durable coordination procedure. Chat history is a convenience, not the source of truth.
Read this from the main checkout at the start of every Codex or Claude session, including old worktrees.

## Roles and durable records

- One Codex control chat gives the user an overview and routes their scoped instructions to workers.
  Its current identity and monitor id are in `docs/agents/CONTROL_CHAT.json`. Validate identities using
  the app's thread tools before sending; a title alone or a stale UUID is not proof of identity.
- Worker chats execute their assigned tasks and report Status / Your action / Claude / Next. Their
  assignment is in `docs/agents/CODEX_INBOX.md` and `docs/TASKS.md`, not just chat history.
- Claude remains integration coordinator and the default approval desk under ADR 0037. Codex rings
  the lane with `--for user --kind approval|decision|blocked` when the user must act. The control chat
  lists the same decision, review link and holds; it does not create a competing approval request.
- Branches, commits, versioned candidates, REVIEW/manifest, and CLAUDE_ART_HANDOFF preserve work.
  `docs/NOW.md` is the durable next-actions page. `.relay/lanes.json` is the machine-local worker mapping;
  use the relay CLI to maintain it rather than editing it by hand. Never store credentials here.

## Control chat operation

Discover current project chats with list_threads and project/worktree evidence; do not rely on a fixed
list of chat names. Inspect compact wait_threads snapshots, then read_thread only for missing context.
Read main's inbox, NOW and relay status. An idle/completed turn is not proof the user's task is finished.
Report four groups: Needs you, Waiting for Claude, Working, Finished. Show unresolved blockers explicitly.
Each actionable item names the exact chat/lane, asset/version, review link, next actor, requested answer,
technical holds and last-checked time. Mark unavailable or conflicting evidence as unverified.

The user can give scoped instructions here, for example "Tell the Gojo chat to keep K" or
"Ask the effects chat to explain the two holds." Forward those instructions to the verified destination
without asking again, preserve the user's wording and scope, and report whether delivery succeeded.
This is not blanket authorization to invent worker tasks, create new chats, generate art, approve assets,
merge, deploy, or bypass paused lanes. Resolve ambiguous targets or approvals before forwarding them.
Do not translate a general "looks good" into approval of unspecified assets. Follow ADR 0037 for approvals;
do not impersonate a Claude USER APPROVAL relay. Keep exact user evidence attached to any forwarded decision.

Monitor reads do not wake idle workers or send status-request messages. Workers need not message the
control chat: it collects their published status and relay records, avoiding reply loops. During a
user-authorized setup/reset, the control chat may send the coordination instructions to existing workers.

## Starting over after deleting chats

In one new chat opened on this repository, the user says:

> Initialize this as the gcdTourney control chat.

That explicitly selects this chat as coordinator and authorizes restoring this coordination setup:

1. Read main's AGENTS.md, this file, CONTROL_CHAT.json, NOW, TASKS, inbox and current relay status.
2. Discover current chats and worktrees. Reconcile outstanding tasks, commits and approval evidence before
   resuming anything. Chat deletion never approves, rejects or cancels stored work by itself.
3. Validate the previous control identity. Replace CONTROL_CHAT.json with this chat's verified identity
   only under the user's initialization request. Keep one control chat and one attention monitor.
4. Rediscover replacement workers by explicit assignments and repository evidence. Rebind matching lanes
   through the relay CLI only when identity and assignment are unambiguous. Do not resurrect deleted chats,
   overwrite an active worker, or create new chats unless the user asks. Report missing workers together.
5. Find the previous monitor by its saved id/name through the app automation tools. Disable the superseded
   monitor if present, then update or recreate it on this chat; never assume it transferred. Save its returned
   id and actual schedule. Reuse an existing matching monitor instead of creating duplicates.
6. Send existing workers a scoped setup notice to read main's current rules. Claude reads the same procedure
   through CLAUDE.md and restores the lane watchers. Report watcher-off states, never claim Claude is listening
   merely because a ring succeeded. Do not remove pauses during setup.
7. Present one consolidated attention queue. State missing bindings or tool limitations and the minimal action
   needed to restore them. No per-worker reminder from the user should be necessary.

Any worker that finds a missing/deleted control chat continues already-authorized work, preserves its handoff
and reports the missing coordinator. It does not appoint itself or start a duplicate monitor. A new chat
with an unclear role asks once whether it is the control chat or a worker, instead of taking arbitrary tasks.

## Attention monitor

Preferred schedule: one heartbeat in the control chat every five minutes. Use the Codex automation tool,
not shell timers or a second standalone job. The registry records the actual configured state. Read-only
monitoring must not edit shared project files, commit, start production, forward new work or send relay rings.
Compare current task/lane/asset/version/next-action states with the previous report. Notify only on a new or
changed user action, meaningful blocker/failure, lost required watcher, completion, or resolution of an
existing request. Stay quiet when unchanged or non-actionable. Do not repeatedly announce the same approval.
Notifications include exact links and the next actor; approved/obsolete versions leave the active queue.

Repository rules survive deleted chats. Chat IDs, relay bindings, background watchers and thread automations
are replaceable runtime state. Monitoring requires the relevant app/host to be available and is not guaranteed
by these Markdown rules alone. If scheduling or thread tools are unavailable, state that only manual checks
are available; never claim a monitor is running without a successful tool result.
