# Label Policy

This document defines how labels are used for issues and pull requests in Niche-Connect.

## 1. Goals

- Keep triage fast and consistent.
- Make priority and ownership visible.
- Support reliable planning and release decisions.

## 2. Core Type Labels

Apply exactly one primary type label per issue whenever possible.

- `bug`: Defect in behavior, correctness, or reliability.
- `feature`: New capability or user-facing enhancement.
- `tech-debt`: Structural improvements and maintainability work.
- `docs`: Documentation-only work.
- `chore`: Non-feature maintenance and tooling tasks.
- `refactor`: Internal restructuring without intended behavior change.
- `release`: Release planning, readiness, and rollout tasks.

## 3. Priority Labels

Use exactly one priority label per issue.

- `priority:p0`: Highest urgency. Production impact or major blocker.
- `priority:p1`: High urgency. Important and time-sensitive.
- `priority:p2`: Normal urgency. Planned work.
- `priority:p3`: Low urgency. Nice-to-have or backlog item.

If no explicit priority is set during intake, default to `priority:p2` during triage.

## 4. Assignment Rules

Issue auto-assignment is handled by `.github/workflows/issue-auto-assign.yml`.

Assignment is based on first matching label in this order:

1. `bug`
2. `feature`
3. `tech-debt`
4. `docs`

If no matching owner variable is configured, fallback uses `DEFAULT_ISSUE_ASSIGNEE`.

## 5. Triage Workflow

1. Confirm reproducibility and scope.
2. Apply one type label.
3. Apply one priority label.
4. Add milestone (if release-bound).
5. Confirm assignee and next action.

## 6. Pull Request Labeling

Use labels to match the dominant change type.

- Feature PRs: `feature`
- Bug fix PRs: `bug`
- Documentation PRs: `docs`
- Refactor PRs: `refactor`
- Release PRs: `release`

If a PR spans multiple areas, use one primary type label and capture secondary scope in the PR description.

## 7. Anti-Patterns

- Multiple conflicting type labels on one issue.
- Missing priority labels on active work.
- Using `chore` as a catch-all for unclear requests.
- Leaving stale labels after scope changes.

## 8. Governance

- Label definitions are source-controlled in `.github/labels.json`.
- Sync is automated via `.github/workflows/labels-sync.yml`.
- Policy updates should be reviewed in the same PR as label schema changes.
