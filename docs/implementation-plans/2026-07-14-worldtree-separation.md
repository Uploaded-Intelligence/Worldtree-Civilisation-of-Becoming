# Worldtree Repository Separation Plan

Status: locally verified and independently reviewed; publication pending
Date: 2026-07-14

## Goal

Create a separate, governed Worldtree repository and Codex workspace that
preserves all game-specific decisions needed for future implementation while
leaving the ontology kernel and legacy scaffold untouched.

## Tasks

1. Verify the empty public remote and exact Git identity.
2. Establish the project control plane and accurate non-product status.
3. Record ownership, semantic, privacy, and model-routing boundaries.
4. Preserve the distilled design and selected visual lineage.
5. Create a deterministic continuation packet for the Worldtree Codex task.
6. Verify, independently review, commit, push, and synchronize the canonical
   local folder.

## Rollback

The work is isolated from both existing projects. Before publication it can be
discarded without changing either. After publication, use additive fixes or a
normal revert; do not rewrite public history.
