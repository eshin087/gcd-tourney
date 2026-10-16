---
name: gcdtourney-attention
description: Run an on-demand GCD Tourney attention check from the registered control chat. Use when the user asks for status, approvals, blockers, what is waiting on them or Claude, or says check now.
---

# GCD Tourney attention check

Run the control chat's status workflow immediately; do not wait for the scheduled heartbeat.

1. Read the main checkout's `docs/COORDINATION.md`, `docs/agents/CONTROL_CHAT.json`, `docs/NOW.md`, relevant inbox sections, and `node tools/relay.mjs status` plus `node tools/relay.mjs asks`.
2. Verify this chat matches the registered control chat using thread tools. Discover all current local gcdTourney worker chats with `list_threads`; do not rely on a fixed roster. Use a compact `wait_threads` snapshot with `timeoutMs: 0` for every worker. Because a multi-target wait may return only the first event, make individual checks or repeat until each worker is represented. Use `read_thread` only if a snapshot lacks enough detail. Do not wake or message workers.
3. Reconcile chat evidence with NOW, inbox, task records, relay asks and current relay lane state. Explicitly separate **Needs you**, **Waiting for Claude**, **Working**, and **Finished**. Include exact decision, asset/version, review URL, technical holds, next actor and last-checked time. Claude's single approval desk is `0 - Approvals` per ADR 0039; direct the user there for open asks. Idle or a completed Codex turn is not proof the task is finished.
4. If `gcd-tourney-attention-queue` exists, inspect its actual saved state. Based on real evidence, update that same heartbeat's next interval to 5, 15, 30 or 60 minutes according to `docs/COORDINATION.md`, always retaining its fixed absolute expiry. If no relevant work/actions remain, only previously reported user decisions remain with no active worker, three checks show no progress, the controller is superseded, or expiry is reached, pause that same automation. Never extend expiry, create a second monitor, or resume a paused monitor unless the user explicitly asks to resume. If updating the schedule fails, try to pause the same automation and report the failure.
5. Do not message workers, ring relay lanes, create chats, edit repository files, generate art, commit, merge or deploy. This skill only checks status and may update/pause the one existing monitor.
6. Present a concise actionable queue. Name the requested user response and where to give it, or say there is no user action. Report Claude's exact pending action and relay/watcher state. State whether the monitor remains active (with next interval and expiry) or is paused. Do not claim a monitor model change: the heartbeat tool does not expose a separate model selector.

If this chat is not the registered controller, do a read-only check and explain which chat is registered; do not update automation state. If evidence conflicts or a worker cannot be reached, mark it unverified rather than guessing.
