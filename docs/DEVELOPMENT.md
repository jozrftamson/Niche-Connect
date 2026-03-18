# Development Guide

This guide describes how to run, extend, and maintain the full Niche-Connect monorepo.

## 1. Requirements

- Node.js 20+
- npm
- PostgreSQL for API routes that use DB persistence

## 2. Install Dependencies

From repository root:

```bash
npm install
```

From miniapp directory:

```bash
cd apps/miniapp
npm install
```

## 3. Run Locally

Root web app (Express + Vite integration):

```bash
npm run dev
```

Optional Vite-only dev command:

```bash
npm run dev:client
```

Miniapp:

```bash
cd apps/miniapp
npm run dev
```

## 4. Environment Variables

### Root

Required for DB-backed endpoints:

```bash
DATABASE_URL=postgres://user:password@host:5432/dbname
```

### Miniapp

Use `apps/miniapp/.env.local`:

```bash
NEXT_PUBLIC_PROJECT_NAME="Your App Name"
NEXT_PUBLIC_ONCHAINKIT_API_KEY="<your-cdp-api-key>"
NEXT_PUBLIC_URL="http://localhost:3000"
```

## 5. Build and Quality Checks

From root:

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

## 6. Code Areas and Ownership

- Frontend app: `client/src/`
- Root API routes: `api/`
- Shared DB schema and zod contracts: `shared/schema.ts`
- Local server boot and static wiring: `server/`
- Miniapp UI and auth route: `apps/miniapp/app/`

## 7. Typical Feature Flow

1. Define/adjust schema contracts in `shared/schema.ts` if data changes.
2. Implement API logic in `api/`.
3. Integrate frontend page/hooks in `client/src/`.
4. Add or adjust smoke test scripts in `script/` when relevant.
5. Update docs in `docs/` in the same change set.

## 8. Agent and A2A Development

- Agent search/workflow routes are under `api/agents/*`.
- A2A orchestration routes are under `api/a2a/*`.
- Keep workflow payloads zod-validated and deterministic.
- Keep `limit` bounded in query params to avoid oversized responses.

## 9. Common Pitfalls

- Missing `DATABASE_URL` causes DB routes to fail.
- Running root scripts without installed dependencies can fail on `tsx`.
- Miniapp env must include a URL that matches local or deployed domain behavior.

## 10. Definition of Done for New Work

- Code compiles (`npm run check`).
- Relevant app builds (`npm run build` and/or miniapp build).
- New/changed endpoint behavior documented in `docs/API.md`.
- Any new workflow format examples documented in `docs/`.
