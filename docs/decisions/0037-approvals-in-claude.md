# 0037: Approvals happen in Claude (question box), relayed to Codex

**Status:** Accepted (user decision, 2026-10-15)
**Date:** 2026-10-15
**Task:** TOOL-045
**Amends:** [ADR 0033](0033-claude-codex-relay.md) decision 5 and 6
**Amended by:** [ADR 0039](0039-approvals-desk.md): one Claude chat, `0 - Approvals`, asks for every lane

## Context

With the relay (ADR 0033) Claude and Codex hand work back and forth on their own, but every image approval still
stopped in the Codex chat that made it: Codex waited for the user to type `approve vNN` there, and did not ring
Claude. A day of real use showed the cost:

- The user works from a phone across six lanes. A lane that waited for them was invisible: the Goku/Luffy chat sat
  for hours on the user's Luffy decisions while `relay status` still said "turn: Codex" and nobody was
  notified.
- The scale chat already rang Claude with "await user decisions" ad hoc; the rule told it not to.
- The user asked (2026-10-15) for approvals as a question with buttons, all in Claude, so one place shows everything
  waiting for them.

ADR 0033 kept approvals out of the relay on purpose: an approval typed by the user in the Codex chat is something
neither agent can produce.

## Decision

1. **Codex rings for the user.** When the next step is the user's, Codex runs
   `node tools/relay.mjs ring <lane> --for user --kind approval|decision|blocked --note "<what to answer; versions;
   review link>"` instead of waiting silently in its chat. `relay status` shows "turn: you".
2. **Claude asks with buttons.** The watcher wakes Claude with "Codex needs the USER". Claude sends a push
   notification and asks with a question box (AskUserQuestion: approve / reject with feedback / hold, one question
   per decision, the review link in the question).
3. **Claude relays the user's own answer, word for word.** `send <lane> --user-approved "<asset vNN>" --quote
   "<their answer>"` (or `--user-rejected ... --note "<feedback>"`, `--user-decision`). Codex records "approved by
   the user via Claude" in REVIEW.md, the manifest and TRACKER, and continues. Claude uses these only with an answer
   the user gave in this conversation (a question-box click or their own message), never one it inferred.
4. **What counts as an approval:** the user typing it in the Codex chat (still valid), or a relay message that says
   `USER APPROVAL via Claude` with the user's quoted answer. A plain relay note that says "approve" is still refused
   by the tool.
5. **Mechanics fixed alongside:** round trips count only sends that answer a new ring (follow-ups do not), a relayed
   user answer starts the count again (limit stays 4 by default), watchers wait 24 h and say to restart while it is
   still Codex's turn, `send` unarchives an archived Codex chat once, `send --direct` asks without an inbox item,
   `add <lane> <chat>` needs no `--thread` (npm swallows that flag), and `remove <lane>` forgets a test lane.

## Alternatives considered

- **Codex's own question UI** (`default_mode_request_user_input`): the feature is off and marked "under development"
  in this Codex build; it would also leave approvals spread over six Codex chats. Rejected for now.
- **Keep approvals in Codex, add only the "waiting on you" ring.** Fixes the visibility, but the user would still
  have to find the right Codex chat on the phone. The user chose one place.

## Consequences

- Every pending approval shows up as a question in a Claude chat (and a notification), and `relay status` names it.
- Trust moves one step: Codex accepts Claude's relay of the user's answer. The quote and the lane log
  (`.relay/<lane>/log.jsonl` records subject and quote) are the audit trail; a wrong relay is fixed like any wrong
  approval (the version stays in REVIEW.md history).
- The Claude chat that runs a lane must stay open for its questions; an unanswered question just waits.
- Revisit if Codex ships a stable question UI that reaches the phone.
