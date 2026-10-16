# GCD Tourney control chat

This is the durable coordination procedure. Chat history is a convenience, not the source of truth.
Read this from the main checkout at the start of every Codex or Claude session, including old worktrees.

## Roles and durable records

- One Codex control chat gives the user an overview and routes their scoped instructions to workers.
  Its current identity and monitor id are in `docs/agents/CONTROL_CHAT.json`. Validate identities using
  the app's thread tools before sending; a title alone or a stale UUID is not proof of identity.
- Worker chats execute their assigned tasks and report Status / Your action / Claude / Next. Their
  assignment is in `docs/agents/CODEX_INBOX.md` and `docs/TASKS.md`, not just chat history.
- Claude remains integration coordinator and the approval desk under ADR 0037. Since ADR 0039 the desk is
  one Claude chat, titled `0 - Approvals`: the only chat that asks the user. Codex rings the lane with
  `--for user --kind approval|decision|blocked` when the user must act, and other Claude chats queue with
  `relay ask`; both land in `node tools/relay.mjs asks`. The control chat lists the same decision, review link
  and holds and points the user to `0 - Approvals`; it does not create a competing approval request.
- **The control chat never asks the user to approve or decide** (user decision 2026-10-15: one true central
  approver). It forwards instead, on its own relay lane `control`:
  1. Run `node tools/relay.mjs asks` first. If the item is already there (a worker rang `--for user`), do nothing
     but tell the user "waiting in Claude 0 - Approvals".
  2. Otherwise run `node tools/relay.mjs ring control --for user --kind approval|decision|blocked --note "for lane
     <worker lane or none>: <what exactly; versions; holds>; <direct preview link>"`, then stop on that item.
  3. The answer comes back as `[relay control #N] USER APPROVAL|REJECTION|DECISION via Claude`. The desk sends the
     same answer straight to the named worker lane too, so the control chat only records it; it never re-relays an
     approval to a worker itself (workers accept only the desk's relay or the user's own words).
  If the user volunteers an approval in this chat, that is still their own words: pass it on with the step-2 ring
  quoting them, so the desk records and relays it.
- Branches, commits, versioned candidates, REVIEW/manifest, and CLAUDE_ART_HANDOFF preserve work.
  `docs/NOW.md` is the durable next-actions page. `.relay/lanes.json` is the machine-local worker mapping;
  use the relay CLI to maintain it rather than editing it by hand. Never store credentials here.

## Control chat operation

To request an immediate full check before the next heartbeat, type `$gcdtourney-attention` in the control chat (or say "check GCD Tourney now"). The project skill lives at `.codex/skills/gcdtourney-attention/`; it reads the current repo state, checks every discovered worker without waking it, consults the approvals desk queue, then updates or pauses the same bounded heartbeat. It never creates a second monitor. The skill is explicit-only, so normal chat turns do not start a check automatically.

Discover current project chats with list_threads and project/worktree evidence; do not rely on a fixed
list of chat names. Inspect compact wait_threads snapshots, then read_thread only for missing context.
Read main's inbox, NOW and relay status. An idle/completed turn is not proof the user's task is finished.
Report four groups: Needs you, Waiting for Claude, Working, Finished. Show unresolved blockers explicitly.
"Needs you" starts from `node tools/relay.mjs asks` (the desk's queue) and says where to answer: the Claude chat
`0 - Approvals`. If `relay status` shows the desk watcher off while asks are open, report that as a lost watcher.
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
   id and actual schedule with a fixed four-hour session expiration. Reuse an existing matching monitor
   instead of creating duplicates. Never restore an unbounded recurrence.
6. Send existing workers a scoped setup notice to read main's current rules. Claude reads the same procedure
   through CLAUDE.md and restores the lane watchers; the user restores the approvals desk by naming one Claude chat
   `0 - Approvals` and typing `/approvals` (ADR 0039). Report watcher-off states (lanes and desk), never claim Claude is
   listening merely because a ring succeeded. Do not remove pauses during setup.
7. Present one consolidated attention queue. State missing bindings or tool limitations and the minimal action
   needed to restore them. No per-worker reminder from the user should be necessary.

Any worker that finds a missing/deleted control chat continues already-authorized work, preserves its handoff
and reports the missing coordinator. It does not appoint itself or start a duplicate monitor. A new chat
with an unclear role asks once whether it is the control chat or a worker, instead of taking arbitrary tasks.

## Attention monitor

Use one adaptive, bounded heartbeat in the control chat, through the Codex automation tool. No shell timers
or second standalone job. Recommend GPT-6 Luna/medium for routine coordination; preserve Astra for final
anatomy audits. The heartbeat tool has no separate model selector, so do not claim a model change based on
prompt text; the user selects the chat model. The registry records configuration at setup, not live status.
Read the actual automation to verify current scheduling. Monitoring may update or pause ONLY its own
automation; it must not edit project files, commit, start production, message workers or ring relay lanes.

Start at 15 minutes. After each run, estimate the earliest useful next check from observed worker progress:
5 minutes for a verified near-complete operation, 15 for progressing work without a reliable ETA, 30 for
long generation/audits or one unchanged check, and 60 for waiting on Claude without observed progress.
ETAs are estimates, not promises. Preserve the same absolute expiration on every schedule update.

Pause automatically when no relevant work or actions remain; when only already-reported user decisions
remain and no worker is active; after three consecutive checks without meaningful progress (including stale
active flags or unavailable tools); when the control chat is superseded; or at the session deadline.
Explain the pause once and preserve unresolved actions without marking them complete. Never auto-resume.
If a schedule update fails, try to pause the existing automation and report the failure; do not create a loop.

Each monitoring session has a fixed maximum duration of four hours, enforced by an absolute expiration
in its schedule as well as the prompt. Do not extend it automatically. A user request to resume monitoring
or initialize the control chat may start a new bounded session; set a fresh deadline then. Say when the
next check is expected or that monitoring is paused. Stopping monitoring does not stop worker tasks.
Compare current task/lane/asset/version/next-action states with the previous report. Notify only on a new or
changed user action, meaningful blocker/failure, lost required watcher, completion, or resolution of an
existing request. Stay quiet when unchanged or non-actionable. Do not repeatedly announce the same approval.
Notifications include exact links and the next actor; approved/obsolete versions leave the active queue.

Repository rules survive deleted chats. Chat IDs, relay bindings, background watchers and thread automations
are replaceable runtime state. Monitoring requires the relevant app/host to be available and is not guaranteed
by these Markdown rules alone. If scheduling or thread tools are unavailable, state that only manual checks
are available; never claim a monitor is running without a successful tool result.
