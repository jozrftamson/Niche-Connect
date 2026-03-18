# Contributing to Niche-Connect

Thank you for contributing.
This document defines the expected workflow for code changes, reviews, and quality checks.

## 1. Scope and Principles

- Keep pull requests focused and small.
- Prefer behavior-preserving refactors over broad rewrites.
- Update documentation in the same pull request as code changes.
- Do not commit secrets or private keys.

## 2. Branch Naming

Use one of these prefixes:

- `feat/<short-topic>`
- `fix/<short-topic>`
- `chore/<short-topic>`
- `docs/<short-topic>`
- `refactor/<short-topic>`

Examples:

- `feat/agents-package-pagination`
- `fix/a2a-job-not-found-response`

## 3. Local Setup

Install root dependencies:

```bash
npm install
```

Install miniapp dependencies:

```bash
cd apps/miniapp
npm install
```

## 4. Definition of Done

Before opening a pull request, run:

From repository root:

```bash
npm run check
npm run build
npm run test:agents
npm run test:a2a
```

From miniapp:

```bash
cd apps/miniapp
npm run lint
npm run build
```

If a command is not applicable to your change, state the reason in the PR description.

## 5. Commit Messages

Recommended style:

- `feat: add package-based workflow override`
- `fix: validate agent workflow limit bounds`
- `docs: add release runbook`

## 6. Pull Request Rules

- Use the pull request template.
- Explain user impact, technical approach, and risks.
- Include test evidence (commands and outputs summary).
- Include screenshots for UI changes.
- Call out follow-up work explicitly.

## 6.1 Issue Intake

Use the issue templates to keep triage consistent:

- Bug report template: `.github/ISSUE_TEMPLATE/bug_report.md`
- Technical debt template: `.github/ISSUE_TEMPLATE/technical_debt.md`
- Feature request template: `.github/ISSUE_TEMPLATE/feature_request.md`

Automatic assignment is handled by `.github/workflows/issue-auto-assign.yml`.
Configure repository variables in GitHub Settings -> Secrets and variables -> Actions:

- `ISSUE_OWNER_BUG`
- `ISSUE_OWNER_FEATURE`
- `ISSUE_OWNER_TECH_DEBT`
- `ISSUE_OWNER_DOCS`
- `DEFAULT_ISSUE_ASSIGNEE`

Each value can be one username or a comma-separated list of usernames.

Label definitions and triage policy are documented in `.github/LABEL_POLICY.md`.

## 7. Documentation Requirements

Update relevant docs when changing behavior:

- API behavior: `docs/API.md`
- Development flow: `docs/DEVELOPMENT.md`
- Architecture boundaries: `docs/ARCHITECTURE.md`
- Agent or A2A workflows: `docs/agent-workflow-package.md`, `docs/a2a-scaffold.md`

## 8. Security and Secrets

- Never commit `.env` files.
- Store local secrets in environment files outside version control.
- Use the security policy for vulnerability reporting: `SECURITY.md`.

## 9. Review Expectations

Reviewers check for:

- Correctness and regression risk
- Validation and error handling
- API contract stability
- Documentation updates
- Test completeness

## 10. Merge Strategy

- Rebase on latest default branch before merge.
- Resolve conflicts in source branch.
- Prefer squash merge for single-feature pull requests.

## 11. Required CI Checks

Recommended required checks for branch protection on `main`:

- `CI Root Quality`
- `CI Miniapp Quality`
