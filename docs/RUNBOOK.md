# Runbook

## Open the project

Use this folder as the Codex workspace root:

Open the saved **Worldtree Civilisational Game of Becoming** project in Codex.
Its conventional local location is
`$HOME/Documents/Worldtree Civilisational Game of Becoming`.

Read `AGENTS.md`, `docs/WINNING.md`, and `docs/PROGRESS.md` before planning or
implementation.

## Separation verification

```bash
node ~/.codex/harness/foundation-audit.mjs
node ~/.codex/harness/define-winning.mjs
git diff --check
git status --short --branch
git remote -v
git log -1 --format=fuller
```

Expected current truth after publication:

- branch `main` tracks `origin/main`;
- author and committer are exactly Uploaded-Intelligence with the mandated
  noreply address;
- control-plane audits pass;
- no application runtime or participant data exists.

## Branch workflow

1. Update `docs/PROGRESS.md` with the active goal.
2. Create a `codex/*` branch and isolated worktree for substantial work.
3. Use test-first implementation for behavior.
4. Run the full task verification.
5. Obtain spec-compliance and code-quality review.
6. Push a PR and request external `@codex review` before non-trivial merge.

## Upstream contract procedure

Do not copy the sibling ontology directly. Wait for the upstream
`genesis-v0.1` release, then generate a manifest containing its public URL,
tag, commit, ontology version, file list, SHA-256 digests, and license boundary.
CI must compare the vendored machine-readable snapshot with that manifest.

## Incident response

Stop work and record a blocker if any of these occur:

- personal or sensitive artifact enters Git history, logs, analytics, or CI;
- model output changes durable lineage without Player ratification;
- a game type conflicts with the released upstream contract;
- a feature introduces identity, authenticity, compatibility, productivity, or
  engagement scoring;
- an external side effect occurs without explicit authority.

## Rollback

- Revert repository changes through Git; never rewrite public history casually.
- Keep the legacy Diegetic folder untouched as migration evidence.
- Export future local Player data before incompatible changes.
- Disable future model adapters independently from deterministic play.
