# Architecture

Niche-Connect is a monorepo with two deployable applications and shared domain contracts.

## High-Level Components

- Root Web App
  - Frontend: React + Vite in `client/`
  - Backend/API: Serverless handlers in `api/`
  - Local dev server: Express in `server/`
- Miniapp
  - Next.js app in `apps/miniapp/`
  - Includes auth endpoint in `apps/miniapp/app/api/auth/route.ts`
- Shared Domain Layer
  - Drizzle schema + zod input contracts in `shared/schema.ts`

## Runtime Paths

### Local Development

- Root app: `server/index.ts` runs and serves app/API in development mode.
- Miniapp runs separately from `apps/miniapp`.

### Production

- Root app deployed with static output plus `api/*.ts` serverless functions.
- Miniapp deployed independently as a Next.js app.

## Data Model (Core Tables)

- `users`
- `posts`
- `engagements`
- `agent_packages`

Indexes are configured in `shared/schema.ts` for common filters/sorts (for example niche, createdAt, engagementScore).

## API Design Notes

- All root APIs are namespaced under `/api/*`.
- Agent APIs:
  - `/api/agents/search`
  - `/api/agents/workflow`
  - `/api/agents/packages`
- A2A APIs:
  - `/api/a2a/run`
  - `/api/a2a/agent`
  - `/api/a2a/jobs`

## Frontend Routing

Main SPA routes are defined in `client/src/App.tsx`.
Protected pages are guarded by store auth state and redirect unauthenticated users to `/auth`.

## Key Engineering Principles

- Keep zod validation at API boundaries.
- Keep workflow execution deterministic and traceable.
- Keep response envelopes stable (`ok`, `count`, `params`, `results`, `trace`, depending on endpoint).
- Keep docs updated alongside route and payload changes.
