# GCD Tourney coordination: one central chat

This is the durable coordination procedure. Chat history is a convenience, not the source of truth.
Read this from the main checkout at the start of every Codex or Claude session, including old worktrees.

**User decision 2026-10-15 (OPS-016, ADR 0039):** the Claude chat titled **`0 - Approvals`** is the one central
chat. It asks the user every approval and decision, gives the overview ("status"), forwards the user's instructions
to Codex chats, and runs the reset after chats are deleted. The Codex control chat ("0 - G") and its attention
monitor are retired: no Codex chat coordinates, monitors or asks the user for approvals any more.

## Roles and durable records

- **Central chat (Claude `0 - Approvals`)**: runs `/approvals` (`.claude/skills/approvals/SKILL.md`). Its identity
  is recorded in `docs/agents/CONTROL_CHAT.json`.
- **Codex worker chats** do their assigned tasks (`docs/agents/CODEX_INBOX.md`, `docs/TASKS.md`) and report
  Status / Your action / Claude / Next. When the user must approve or decide anything, they leave it for the central
  chat: `node tools/relay.mjs ring <lane> --for user --kind approval|decision|blocked --note "<what exactly;
  versions; holds; direct preview link>"`, then stop on that item. They never ask the user in their own chat.
  Without a mapped lane they write the item in their handoff and NOW.md and say "waiting for Claude 0 - Approvals".
- **Other Claude chats** do the engineering and integration of their lanes. When they need the user they run
  `node tools/relay.mjs ask ...` and stop (CLAUDE.md "Approvals desk").
- An approval counts only as the user's own words: typed in the chat, or relayed by the central chat as
  `USER APPROVAL|REJECTION|DECISION via Claude` / `via the approvals desk` with their quote (ADR 0037).
- Branches, commits, versioned candidates, REVIEW/manifest, and CLAUDE_ART_HANDOFF preserve work.
  `docs/NOW.md` is the durable next-actions page. `.relay/lanes.json` is the machine-local worker mapping;
  use the relay CLI to maintain it rather than editing it by hand. Never store credentials here.

## Central chat operation

- **Questions:** one background `node tools/relay.mjs wait all` watcher wakes the chat when anything is queued for
  the user; it asks in one question box and relays each answer word for word (see the skill).
- **Status:** when the user says "status", run `npm run status` and `node tools/relay.mjs status` and answer in
  under 10 lines: Needs you, Waiting for Claude, Working (Codex), Finished, plus any lane whose watcher is off while
  it is Claude's turn, paused lanes and lanes at their round-trip limit. Mark unverified anything you could not check.
- **Health check on every wake:** while handling a wake, glance at `relay status` and mention, once, a lane that
  looks stuck (Claude's turn with no watcher, or no ring for a long time while it is Codex's turn). No extra timer.
- **Forwarding the user's instructions:** the user can say "tell the Gojo chat to keep K" or "ask the effects chat
  to explain the two holds". Forward to the verified lane with `node tools/relay.mjs send <lane> --direct --note
  "<the user's words>"` (or SendMessage for a Claude chat) without asking again, keep their wording and scope, and
  report whether delivery succeeded. This is not blanket authorization to invent worker tasks, create new chats,
  generate art, approve assets, merge, deploy, or bypass paused lanes. Resolve ambiguous targets first. Never turn a
  general "looks good" into approval of unspecified assets; approvals go through `--user-approved` with the quote.
- **No monitors:** no scheduled heartbeats, cron jobs or automations in either app. The only background tasks are
  relay watchers (the central chat's `wait all`, and one `wait <lane>` per active lane in its Claude chat), each a
  file check that ends by itself (the skill's restart rules).

## Starting over after deleting chats

1. In Claude, name a new chat `0 - Approvals` and type `/approvals`. It records its identity in CONTROL_CHAT.json,
   starts the one watcher, and lists anything still waiting (`relay asks`: asks survive chat deletion).
2. It reads main's NOW, TASKS, inbox and `relay status`, and reconciles outstanding tasks, commits and approval
   evidence. Chat deletion never approves, rejects or cancels stored work by itself.
3. Rebind worker lanes to the replacement Codex chats with `node tools/relay.mjs add <lane> <chat id|title>` only when
   identity and assignment are unambiguous; report missing workers together. Do not create chats unless asked.
4. Send each existing worker a scoped notice to read main's current AGENTS.md and this file (`relay send <lane>
   --direct`). Other Claude chats get the rule from CLAUDE.md and the SessionStart hook.
5. Present one consolidated list: what needs the user, missing bindings, watchers that are off.

Any worker that finds the central chat missing continues already-authorized work, keeps its handoff, leaves its
user items in the queue (they wait in `.relay/asks/`) and reports the missing central chat. It never appoints itself.

## Retired (2026-10-15)

The Codex control chat role, its adaptive attention monitor (OPS-014) and the `$gcdtourney-attention` skill (OPS-015,
`.codex/skills/gcdtourney-attention/`) are retired. Do not restart them; a request to "check GCD Tourney now" goes to
the central chat as "status".
