---
name: superpowers
description: Repository-local engineering workflow skill adapted for ZINITEK from obra/superpowers.
source: https://github.com/obra/superpowers
upstream-path: skills/*
installed: 2026-08-28
---

# Superpowers — ZINITEK Adapter

Use this skill to impose disciplined engineering workflow on non-trivial coding tasks.

The upstream project is a collection of specialized skills including brainstorming, planning, execution, systematic debugging, test-driven development, code review, worktrees and verification-before-completion. This adapter routes the parts that are appropriate for ZINITEK without forcing every upstream workflow onto every task.

## Core rule

Do not begin a significant implementation from a guess. Inspect the relevant source, identify the system boundary and choose the smallest reliable path to the requested result.

## Routing

### Planning

Use for multi-file changes, architectural changes, migrations and risky refactors.

Plan should identify:

- current source of truth
- files/subsystems affected
- compatibility risks
- implementation order
- verification steps

Do not create ceremony for tiny edits.

### Systematic debugging

When fixing a bug:

1. Reproduce or establish the exact failing behavior.
2. Read the code path before modifying it.
3. Identify the root cause rather than patching symptoms.
4. Check related shared components/queries/routes for the same failure mode.
5. Apply the narrowest coherent fix.
6. Verify the original failure is gone and no obvious regression was introduced.

For ZINITEK, always consider i18n, translated slugs, Sanity fallback and shared UI behavior when the bug crosses those boundaries.

### Test-driven reasoning

Use tests when they materially reduce regression risk. Prefer behavior-focused tests over tests that merely mirror implementation details.

Do not introduce a test framework solely to satisfy this skill unless the user requests it or the project already has an appropriate testing setup.

### Verification before completion

Before claiming a task is done, use available evidence:

- inspect the resulting diff/code
- run `npm run lint` when applicable
- run `npm run build` for meaningful production code changes when environment allows
- use browser verification for interaction/UI work when possible
- verify translated routes/metadata when i18n or SEO changed

Never say a fix is verified if verification was not actually performed.

### Code review discipline

When reviewing or responding to review comments:

- verify the technical claim before accepting it
- distinguish correctness issues from style preference
- avoid unrelated cleanup
- explain tradeoffs when rejecting a suggestion

## ZINITEK constraints

Generic engineering advice never overrides:

- root `AGENTS.md`
- `.agents/skills/zinitek-project/SKILL.md`
- project i18n and Sanity architecture
- the root UX `SKILL.md`
- user instructions

Do not introduce worktrees, branches, dependencies, test infrastructure or large refactors unless they solve the actual request.

## Completion standard

A coding task is complete only when:

1. the requested behavior is implemented,
2. repository-specific constraints are preserved,
3. relevant verification has been performed or explicitly stated as unavailable,
4. no unsupported claim of success is made.

## Upstream note

This file is an intentionally compact repository adapter, not a full copy of every `obra/superpowers` skill. The upstream collection remains the reference for specialized workflow details; ZINITEK uses the subset above as its default engineering discipline.
