# Niche-Connect Documentation

This folder is the central documentation hub for Niche-Connect.

## Start Here

1. [Development Guide](./DEVELOPMENT.md)
2. [Architecture](./ARCHITECTURE.md)
3. [API Reference](./API.md)
4. [Release Workflow](./RELEASE.md)
5. [Agent Workflow Package](./agent-workflow-package.md)
6. [A2A Scaffold](./a2a-scaffold.md)

## Audience Map

- Product and new contributors: read this file, then Architecture.
- Frontend contributors: read Development Guide sections for client and miniapp.
- Backend contributors: read API Reference and Development Guide backend sections.
- AI and agent contributors: read Agent Workflow Package and A2A Scaffold.

## Documentation Conventions

- Keep endpoint examples executable with curl.
- Prefer concrete payload examples over abstract descriptions.
- Update docs in the same pull request as behavior changes.
- Keep all dates in ISO 8601 format when examples include timestamps.

## Fast Navigation

- Root app entry: `client/src/App.tsx`
- API handlers: `api/`
- Shared DB schema: `shared/schema.ts`
- Local Express runtime: `server/`
- Miniapp (Next.js): `apps/miniapp/`
