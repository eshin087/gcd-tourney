# Worktree permissions and local previews

Prepared 2026-10-12. This is a proposed configuration change, not an installed or verified repair.

## Recommended layout

Use one project-local `.worktrees/` parent, and one real Git checkout and branch per task. Codex and Claude can share the parent directory, but should work in separate checkouts, with separate server ports. Continue using the project `pr start --art` helper and reuse each task checkout for later versions.

Codex-managed worktrees normally use `$CODEX_HOME/worktrees`. A shared global parent is also valid when the app manages distinct children; Settings > Worktrees > Worktree root changes that parent. Do not set the global parent to GCD Tourney for unrelated projects. This repository's policy currently requires its project-local parent.
Source: [OpenAI worktree documentation](https://learn.chatgpt.com/docs/environments/git-worktrees).

## Concrete edit for the current profile

In `.codex/config.toml`, remove the four absolute filesystem entries for the project, its `.git`, `.codex` and `.agents`. Keep the existing minimal/runtime/temp entries. Insert this table immediately before the existing network table:

```toml
[permissions.gcd-tourney.filesystem.":workspace_roots"]
"." = "write"
".git" = "write"
".codex" = "read"
".agents" = "read"
```

Keep `approval_policy = "never"`, the profile name and the existing network settings. This applies the same scoped rules to each effective workspace root and avoids embedding a drive-specific project path. For future profiles, OpenAI recommends extending the built-in `:workspace` profile, then overriding only the required rules.
Source: [OpenAI permission profiles](https://learn.chatgpt.com/docs/permissions).

The selected checkout must actually be an effective workspace root. Start/reopen a chat in that checkout after the configuration change. Git also needs write access to its common metadata in the main repository's `.git`; inspect the fresh chat's roots and grants before testing. If it is missing, add that exact project's common metadata path as a write grant in that project's profile.

The project `.codex` directory is intentionally read-only in this chat. The user must make this edit in an external editor, then start a fresh chat to load it. No profile or machine ACL was changed here.

## If you choose the default managed worktree location instead

Prefer making the chosen task checkout an active workspace root and granting that checkout plus its common Git metadata. Granting `E:/Vibe Coding/.codex/worktrees` wholesale would allow access to every project's checkout stored there; it is broader than necessary. Granting the entire `.codex` directory is unnecessary. Switching this repository back to managed global storage also requires changing its current project-local storage policy.

## Verify the real Git workflow

A plain filesystem write probe is insufficient. The current project-local parent is already under an allowed write root, yet native Git still reports permission errors. The proposed root-relative profile addresses path portability and active-checkout coverage; it does not establish that the Windows Git issue is repaired.

In a fresh chat, verify Git status, the common Git directory, and an actual isolated worktree creation/removal using the project's helper. Inspect existing branch/worktree registrations first. The earlier failed start already created `art/gojo-title-r3`; do not blindly recreate or delete that branch. Never copy the project as a worktree fallback.

Do not prune the external Gojo checkout until its dirty and ignored files can be inspected. Preserve Killua's three unmerged commits and the eleven unregistered archive/residual folders from the previous audit.

## Preview access is separate

The current localhost request failed with EACCES. A runtime reset also removed the previous TEMP demo. MXC-managed networking requires effective `allow_local_binding = true` for local networking, and foreground-command lifetime affects child servers. This setting requires a separate review of the effective network policy; filesystem grants alone do not repair localhost or browser URL-policy restrictions.
Source: [OpenAI Windows sandbox documentation](https://learn.chatgpt.com/docs/windows/windows-sandbox).

The replacement [Gojo comparison](art-review/gojo-bc/gojo_BC_standalone_v04.html) embeds all its images and needs no server. Open the HTML file directly in a browser. The project also preserves the normal/half-speed GIFs and frame sheet alongside it. It is a direction study; production atlas and anatomy approval are pending.

A private review Page was created, but uploading its interactive embed was rejected because the tool requires approval and this chat has approval policy never. No visualization was inserted and no publication occurred. The durable local file is the review deliverable.
