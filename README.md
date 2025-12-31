# Niche-Connect Monorepo

This repo contains two apps:

- `apps/miniapp`: Base Onchain Mini App (Next.js)
- `.` (repo root): Niche-Connect (Vite + Express)

## Local development

### Mini App

```bash
cd /home/josef/projeckt/Github/Nischenverbindung/Niche-Connect/apps/miniapp
npm install
npm run dev
```

### Niche-Connect

```bash
cd /home/josef/projeckt/Github/Nischenverbindung/Niche-Connect
npm install
npm run dev
```

## Vercel setup (two projects)

Create two Vercel projects pointing at this repo:

1. **Mini App**
   - Root Directory: `apps/miniapp`
   - Build Command: `npm run build`
   - Output Directory: `.next`
2. **Niche-Connect**
   - Root Directory: `.`
   - Build Command: `npm run build`
   - Output Directory: `dist/public`

Note: Niche-Connect uses an Express server. On Vercel, the API is served via
serverless functions under `/api/*`.

## Vercel Functions (API)

When deploying Niche-Connect to Vercel, the API is exposed via:

- `api/health.ts` → `/api/health`
- `api/echo.ts` → `/api/echo`
- `api/posts.ts` → `/api/posts`
- `api/posts/sample.ts` → `/api/posts/sample`
- `api/engagements.ts` → `/api/engagements`
