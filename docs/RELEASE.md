# Release Workflow

This runbook defines a practical release flow for Niche-Connect.

## 1. Release Inputs

- Target branch and commit SHA
- Release version tag (for example `v1.4.0`)
- Release notes draft
- Deployment targets:
  - Root app project on Vercel
  - Miniapp project on Vercel

## 2. Pre-Release Gate

Run checks before tagging:

```bash
npm run check
npm run build
npm run test:agents
npm run test:a2a
```

Miniapp checks:

```bash
cd apps/miniapp
npm run lint
npm run build
```

Verify docs are up to date:

- `docs/API.md`
- `docs/ARCHITECTURE.md`
- `docs/DEVELOPMENT.md`

## 3. Environment Verification

Root app required env:

- `DATABASE_URL`

Miniapp required env:

- `NEXT_PUBLIC_PROJECT_NAME`
- `NEXT_PUBLIC_ONCHAINKIT_API_KEY`
- `NEXT_PUBLIC_URL`

Verify production values in Vercel before deployment.

## 4. Versioning and Tagging

1. Bump version if your team uses package versioning.
2. Create release commit.
3. Tag the commit:

```bash
git tag vX.Y.Z
git push origin vX.Y.Z
```

## 5. Deployment Sequence

1. Deploy root app from repository root.
2. Run smoke check on root endpoints:

```bash
curl -s https://<root-domain>/api/health
```

3. Deploy miniapp from `apps/miniapp` root.
4. Validate miniapp launch and auth endpoint behavior.

## 6. Post-Deploy Smoke Tests

Run smoke scripts against deployed base URL:

```bash
AGENT_BASE_URL=https://<root-domain> npm run test:agents
A2A_BASE_URL=https://<root-domain> npm run test:a2a
```

Also verify:

- `/api/posts`
- `/api/engagements`
- `/api/agents/search`
- `/api/a2a/jobs`

## 7. Release Notes Template

Use this structure:

- Highlights
- New features
- Fixes
- Breaking changes
- Migration notes
- Operational notes

## 8. Rollback Strategy

If release issues are detected:

1. Roll back to previous Vercel deployment for impacted app.
2. Re-run smoke tests.
3. Open an incident issue with impact, timeline, and remediation steps.

## 9. Ownership

Minimum roles per release:

- Release driver
- Reviewer
- Verifier

A single person can hold multiple roles only for emergency patches.
